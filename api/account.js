'use strict';
// POST/GET /api/account?action=...
// 회원가입·로그인·내 정보·구독 결제(베이온)·해지·결제 내역을 한 곳에서 처리합니다.
// (Vercel 함수 개수를 아끼려고 하나로 묶음)
const db = require('../lib/server/db');
const { readiness } = require('../lib/server/config');
const { setSession, clearSession, readSession, hashPassword, checkPassword, sameOrigin } = require('../lib/server/session');
const billing = require('../lib/server/billing');
const { publicPlans } = require('../lib/server/plans');
const { usageFor, isActive } = require('../lib/server/usage');

const INDUSTRY_KEYS = ['auto', 'restaurant', 'cafe', 'beauty', 'realestate', 'academy', 'clinic', 'fitness', 'shop', 'interior'];

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
  }
  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 100000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

function normPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (!/^01\d{8,9}$/.test(d)) return '';
  return d.length === 11 ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}` : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function cut(v, n) {
  return String(v == null ? '' : v).trim().slice(0, n);
}

async function currentUser(req) {
  const s = readSession(req);
  if (!s) return null;
  const r = await db.query('SELECT * FROM ar_users WHERE id = $1', [s.uid]);
  const u = r.rows[0];
  if (!u || Number(u.session_version) !== Number(s.v || 1)) return null;
  return u;
}

function publicUser(u) {
  return { id: String(u.id), phone: u.phone, name: u.name, title: u.title, branch: u.branch, email: u.email, industry: u.industry, promo: u.promo };
}

async function mePayload(u) {
  const sub = await billing.getSubscription(u.id);
  const active = isActive(sub);
  const tier = active ? sub.plan : 'free';
  return {
    ok: true,
    user: publicUser(u),
    subscription: billing.publicSubscription(sub),
    entitlement: { pro: active, tier, until: active ? sub.current_period_end : null },
    usage: await usageFor(u.id, tier)
  };
}

// 로그인 시도 제한: 같은 번호로 하루 10번 실패하면 잠금
async function tooManyAttempts(phone) {
  const day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const r = await db.query(`SELECT exports FROM ar_usage WHERE subject = $1 AND period = $2`, [`login:${phone}`, `d:${day}`]);
  return r.rows[0] && r.rows[0].exports >= 10;
}
async function noteFailedAttempt(phone) {
  const day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  await db.query(
    `INSERT INTO ar_usage (subject, period, exports) VALUES ($1, $2, 1)
       ON CONFLICT (subject, period) DO UPDATE SET exports = ar_usage.exports + 1`,
    [`login:${phone}`, `d:${day}`]
  );
}

module.exports = async function handler(req, res) {
  const action = String((req.query && req.query.action) || '').trim();
  const ready = readiness();

  // 설정 상태(키 값 아님)와 요금제 — 화면이 시연 모드/실서비스 모드를 고를 때 사용
  if (action === 'config') {
    return send(res, 200, {
      ok: true,
      serverMode: ready.serverMode,
      billingReady: ready.billing,
      veyonEnv: ready.veyonEnv,
      sns: ready.sns,
      plans: publicPlans()
    });
  }

  if (!ready.serverMode) {
    return send(res, 503, { ok: false, error: 'server_mode_off', message: '회원 서버가 아직 준비되지 않았습니다.' });
  }
  if (req.method === 'POST' && !sameOrigin(req)) {
    return send(res, 403, { ok: false, error: 'bad_origin' });
  }

  try {
    if (action === 'signup' && req.method === 'POST') {
      const b = await readBody(req);
      const phone = normPhone(b.phone);
      const pw = String(b.password || '');
      if (!phone) return send(res, 400, { ok: false, error: 'invalid_phone', message: '휴대폰 번호를 정확히 입력해 주세요.' });
      if (pw.length < 8) return send(res, 400, { ok: false, error: 'weak_password', message: '비밀번호는 8자 이상으로 정해 주세요.' });
      const industry = INDUSTRY_KEYS.includes(b.industry) ? b.industry : 'auto';
      const ins = await db.query(
        `INSERT INTO ar_users (phone, password_hash, name, title, branch, email, industry, promo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (phone) DO NOTHING RETURNING *`,
        [phone, hashPassword(pw), cut(b.name, 40) || '대표', cut(b.title, 40), cut(b.branch, 80), cut(b.email, 120), industry, cut(b.promo, 120)]
      );
      if (!ins.rows.length) return send(res, 409, { ok: false, error: 'phone_taken', message: '이미 가입된 번호입니다. 로그인해 주세요.' });
      setSession(req, res, ins.rows[0]);
      return send(res, 200, await mePayload(ins.rows[0]));
    }

    if (action === 'login' && req.method === 'POST') {
      const b = await readBody(req);
      const phone = normPhone(b.phone);
      if (!phone) return send(res, 400, { ok: false, error: 'invalid_phone', message: '휴대폰 번호를 정확히 입력해 주세요.' });
      if (await tooManyAttempts(phone)) return send(res, 429, { ok: false, error: 'locked', message: '로그인 시도가 너무 많습니다. 내일 다시 시도해 주세요.' });
      const r = await db.query('SELECT * FROM ar_users WHERE phone = $1', [phone]);
      const u = r.rows[0];
      if (!u || !checkPassword(String(b.password || ''), u.password_hash)) {
        await noteFailedAttempt(phone);
        return send(res, 401, { ok: false, error: 'bad_credentials', message: '번호 또는 비밀번호가 맞지 않습니다.' });
      }
      setSession(req, res, u);
      return send(res, 200, await mePayload(u));
    }

    if (action === 'logout') {
      clearSession(req, res);
      return send(res, 200, { ok: true });
    }

    const user = await currentUser(req);
    if (!user) return send(res, 401, { ok: false, error: 'login_required', message: '로그인이 필요합니다.' });

    if (action === 'me') return send(res, 200, await mePayload(user));

    if (action === 'profile' && req.method === 'POST') {
      const b = await readBody(req);
      const industry = INDUSTRY_KEYS.includes(b.industry) ? b.industry : user.industry;
      const r = await db.query(
        `UPDATE ar_users SET name = $2, title = $3, branch = $4, email = $5, industry = $6, promo = $7, updated_at = now()
          WHERE id = $1 RETURNING *`,
        [user.id, cut(b.name, 40) || user.name, cut(b.title, 40), cut(b.branch, 80), cut(b.email, 120), industry, cut(b.promo, 120)]
      );
      return send(res, 200, await mePayload(r.rows[0]));
    }

    if (action === 'password' && req.method === 'POST') {
      const b = await readBody(req);
      if (!checkPassword(String(b.current || ''), user.password_hash)) return send(res, 401, { ok: false, error: 'bad_credentials', message: '지금 비밀번호가 맞지 않습니다.' });
      if (String(b.next || '').length < 8) return send(res, 400, { ok: false, error: 'weak_password', message: '새 비밀번호는 8자 이상으로 정해 주세요.' });
      const r = await db.query('UPDATE ar_users SET password_hash = $2, session_version = session_version + 1, updated_at = now() WHERE id = $1 RETURNING *', [user.id, hashPassword(b.next)]);
      setSession(req, res, r.rows[0]);
      return send(res, 200, { ok: true });
    }

    if (action === 'card-ready' && req.method === 'POST') {
      const b = await readBody(req);
      return send(res, 200, { ok: true, ...(await billing.prepareCard(user, String(b.plan || ''))) });
    }

    if (action === 'card-complete' && req.method === 'POST') {
      const b = await readBody(req);
      const out = await billing.completeCard(user, b);
      const me = await mePayload(user);
      return send(res, out.charged || out.cardUpdated ? 200 : 402, { ...me, ok: Boolean(out.charged || out.cardUpdated), billing: out });
    }

    if (action === 'consume-export' && req.method === 'POST') {
      const q = await usage.consume(req, 'export', 1);
      if (!q.ok) return send(res, q.status, q.body);
      return send(res, 200, { ok: true, used: q.used, cap: q.cap });
    }
    if (action === 'cancel' && req.method === 'POST') return send(res, 200, { ok: true, subscription: await billing.setCancel(user.id, true) });
    if (action === 'resume' && req.method === 'POST') return send(res, 200, { ok: true, subscription: await billing.setCancel(user.id, false) });
    if (action === 'payments') return send(res, 200, { ok: true, payments: await billing.paymentHistory(user.id) });

    return send(res, 404, { ok: false, error: 'unknown_action' });
  } catch (e) {
    const status = Number(e.status) || 500;
    if (status >= 500) console.error('[account]', action, e.code || '', e.message);
    return send(res, status, { ok: false, error: e.code || 'server_error', message: status >= 500 && !e.code ? '서버 오류가 났습니다. 잠시 후 다시 시도해 주세요.' : e.message });
  }
};
