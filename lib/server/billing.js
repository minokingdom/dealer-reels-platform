'use strict';
// 구독·결제 처리 (베이온 정기결제)
//  - 카드 등록 준비 → 등록 완료 확인 → 첫 결제 → 이용권 시작
//  - 매일 자동 갱신 결제(cron), 실패 시 3번까지 하루 간격 재시도
//  - 해지 예약/취소, 관리자 환불
// 결제 결과를 알 수 없을 때(통신 끊김)는 자동으로 다시 결제하지 않고 'unknown'으로 남겨 운영자가 확인합니다.
const crypto = require('node:crypto');
const db = require('./db');
const { createVeyon, VeyonError } = require('./veyon');
const { PLANS, addPeriod } = require('./plans');
const { siteUrl, readiness } = require('./config');

function err(code, status, message) {
  const e = new Error(message);
  e.code = code;
  e.status = status;
  return e;
}

function requireBilling() {
  if (!readiness().billing) throw err('BILLING_NOT_READY', 503, '결제가 아직 열리지 않았습니다. 곧 오픈합니다.');
}

function ymdKst(d) {
  return new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
}

async function getSubscription(userId) {
  const r = await db.query('SELECT * FROM ar_subscriptions WHERE user_id = $1', [userId]);
  return r.rows[0] || null;
}

function publicSubscription(s) {
  if (!s) return null;
  return {
    plan: s.plan,
    planName: PLANS[s.plan] ? PLANS[s.plan].name : s.plan,
    amount: PLANS[s.plan] ? PLANS[s.plan].amount : 0,
    status: s.status,
    cardLast4: s.card_last4 || '',
    cardIssuer: s.card_issuer || '',
    currentPeriodEnd: s.current_period_end,
    cancelAtPeriodEnd: s.cancel_at_period_end,
    retryCount: s.retry_count
  };
}

// 1) 카드 등록창 준비
async function prepareCard(user, planKey) {
  requireBilling();
  const plan = PLANS[planKey];
  if (!plan) throw err('INVALID_PLAN', 400, '요금제를 다시 선택해 주세요.');
  const existing = await getSubscription(user.id);
  if (existing && existing.status === 'active' && new Date(existing.current_period_end) > new Date() && !existing.cancel_at_period_end && existing.plan === planKey) {
    throw err('ALREADY_SUBSCRIBED', 409, '이미 이용 중인 요금제입니다.');
  }
  const veyon = createVeyon();
  const state = crypto.randomBytes(24).toString('base64url');
  const stateDigest = crypto.createHash('sha256').update(state).digest('hex');
  const trackId = `AR-CARD-${user.id}-${crypto.randomBytes(8).toString('hex')}`;
  await db.query(
    `INSERT INTO ar_card_registrations (track_id, user_id, plan, state_digest, expires_at)
     VALUES ($1, $2, $3, $4, now() + interval '15 minutes')`,
    [trackId, user.id, planKey, stateDigest]
  );
  try {
    const ready = await veyon.readyRecurring({
      trackId,
      returnUrl: siteUrl(),
      payerId: String(user.id),
      payerName: user.name,
      payerEmail: user.email,
      payerTel: String(user.phone || '').replace(/\D/g, '')
    });
    if (ready.trackId && ready.trackId !== trackId) throw err('VEYON_TRACK_MISMATCH', 502, '카드 등록 거래번호가 맞지 않습니다.');
    const allowed = veyon.cfg.baseUrl;
    const override = process.env.VEYON_TEST_OVERRIDE_URL;
    let u;
    try { u = new URL(ready.payUrl); } catch (e) { u = null; }
    if (!u || (u.origin !== allowed && !(veyon.cfg.environment === 'test' && override && u.origin === new URL(override).origin))) {
      throw err('VEYON_PAYURL_INVALID', 502, '카드 등록 주소가 올바르지 않습니다.');
    }
    await db.query('UPDATE ar_card_registrations SET provider_trx_id = $2, updated_at = now() WHERE track_id = $1', [trackId, ready.trxId]);
    return { state, trackId, trxId: ready.trxId, payUrl: ready.payUrl, scriptUrl: veyon.cfg.scriptUrl };
  } catch (e) {
    await db.query(`UPDATE ar_card_registrations SET status = 'failed', failure_code = $2, updated_at = now() WHERE track_id = $1`, [trackId, e.code || 'READY_FAILED']).catch(() => {});
    throw e;
  }
}

// 2) 카드 등록 결과 확인 + 첫 결제
async function completeCard(user, { state, trackId, providerResult }) {
  requireBilling();
  const pr = providerResult && typeof providerResult === 'object' ? providerResult : {};
  const pay = pr.pay || {};
  const metadata = pay.metadata || pr.metadata || {};
  const card = pay.card || pr.card || {};
  const resultCd = String((pr.result && pr.result.resultCd) || pr.resultCd || '').trim();
  const metaCd = String(metadata.resultCd || '').trim();
  const recurringId = String(metadata.recurringId || pr.recurringId || '').trim();
  const last4Raw = String(card.last4 || pr.cardLast4 || '').trim();
  const cardLast4 = /^\d{4}$/.test(last4Raw) ? last4Raw : '';
  const stateDigest = crypto.createHash('sha256').update(String(state || '')).digest('hex');

  const reg = await db.tx(async (c) => {
    const r = await c.query('SELECT * FROM ar_card_registrations WHERE track_id = $1 FOR UPDATE', [String(trackId || '')]);
    const row = r.rows[0];
    if (!row || String(row.user_id) !== String(user.id) || row.state_digest !== stateDigest) {
      throw err('CARD_SESSION_INVALID', 400, '카드 등록 정보를 확인할 수 없습니다. 다시 시도해 주세요.');
    }
    if (row.status !== 'ready') throw err('CARD_SESSION_USED', 409, '이미 처리된 카드 등록입니다.');
    if (new Date(row.expires_at) < new Date()) throw err('CARD_SESSION_EXPIRED', 409, '카드 등록 시간이 지났습니다. 다시 시도해 주세요.');
    const ok = resultCd === '0000' && (!metaCd || metaCd === '0000') && recurringId;
    await c.query(`UPDATE ar_card_registrations SET status = $2, failure_code = $3, updated_at = now() WHERE track_id = $1`,
      [row.track_id, ok ? 'completed' : 'failed', ok ? null : (resultCd || metaCd || 'NO_RECURRING_ID')]);
    if (!ok) throw err('CARD_REGISTRATION_DECLINED', 409, '카드 등록이 완료되지 않았습니다.');
    return row;
  });

  const veyon = createVeyon();
  // 등록된 카드가 정말 이 회원 것인지 결제사에 다시 확인
  const owned = await veyon.verifyCardOwnership({ payerId: String(user.id), recurringId });

  const plan = reg.plan;
  const sub = await db.tx(async (c) => {
    const r = await c.query(
      `INSERT INTO ar_subscriptions (user_id, plan, status, recurring_id, card_last4, card_issuer)
       VALUES ($1, $2, 'incomplete', $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET recurring_id = EXCLUDED.recurring_id, card_last4 = EXCLUDED.card_last4,
         card_issuer = EXCLUDED.card_issuer, updated_at = now()
       RETURNING *`,
      [user.id, plan, recurringId, cardLast4, owned.issuer || String(card.issuer || '').slice(0, 60)]
    );
    return r.rows[0];
  });

  // 지금 이용 중(기간이 남은) 구독이면 카드만 바꾸고, 요금제 변경은 다음 결제일부터
  const stillActive = sub.status === 'active' && sub.current_period_end && new Date(sub.current_period_end) > new Date();
  if (stillActive) {
    await db.query('UPDATE ar_subscriptions SET plan = $2, cancel_at_period_end = false, updated_at = now() WHERE id = $1', [sub.id, plan]);
    return { charged: false, cardUpdated: true, subscription: publicSubscription(await getSubscription(user.id)) };
  }
  const result = await chargePeriod(sub.id, plan, new Date(), 'initial');
  return { charged: result.approved, result, subscription: publicSubscription(await getSubscription(user.id)) };
}

// 한 기간 결제. trackId를 (구독, 기간 시작일)로 정해 같은 기간을 두 번 결제하지 않음
async function chargePeriod(subId, planKey, periodStart, reason) {
  const plan = PLANS[planKey];
  const periodEnd = addPeriod(periodStart, planKey);
  // 기간 시작 시각(초)까지 넣어 같은 기간은 같은 번호 → 두 번 결제되지 않음
  const trackId = `AR-PAY-${subId}-${ymdKst(periodStart)}-${Math.floor(periodStart.getTime() / 1000).toString(36)}${reason === 'initial' ? '-' + crypto.randomBytes(3).toString('hex') : ''}`;
  const sub = (await db.query('SELECT * FROM ar_subscriptions WHERE id = $1', [subId])).rows[0];
  const ins = await db.query(
    `INSERT INTO ar_payments (user_id, subscription_id, track_id, plan, amount, status, period_start, period_end)
     VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7) ON CONFLICT (track_id) DO NOTHING RETURNING id`,
    [sub.user_id, subId, trackId, planKey, plan.amount, periodStart, periodEnd]
  );
  if (!ins.rows.length) return { approved: false, skipped: true, message: '이미 처리 중인 결제입니다.' };
  const paymentId = ins.rows[0].id;
  const veyon = createVeyon();
  let out;
  try {
    out = await veyon.chargeRecurring({ recurringId: sub.recurring_id, trackId, amount: plan.amount, productName: `AutoReels ${plan.name}` });
  } catch (e) {
    const unknown = e instanceof VeyonError && e.details && e.details.unknown;
    await db.query(`UPDATE ar_payments SET status = $2, failure_message = $3, updated_at = now() WHERE id = $1`,
      [paymentId, unknown ? 'unknown' : 'failed', String(e.message).slice(0, 300)]);
    if (unknown) {
      // 결과를 모름: 자동 재시도하지 않고 운영자 확인 대기
      await db.query(`UPDATE ar_subscriptions SET status = 'review', updated_at = now() WHERE id = $1`, [subId]);
      return { approved: false, unknown: true, message: '결제 결과를 확인하는 중입니다. 잠시 후 다시 확인해 주세요.' };
    }
    throw e;
  }
  if (out.approved) {
    await db.query(`UPDATE ar_payments SET status = 'paid', provider_trx_id = $2, provider_trx_date = $3, result_code = '0000', updated_at = now() WHERE id = $1`,
      [paymentId, out.trxId, out.trxDate || ymdKst(new Date())]);
    await db.query(
      `UPDATE ar_subscriptions SET status = 'active', plan = $2, current_period_start = $3, current_period_end = $4,
         retry_count = 0, next_attempt_at = NULL, updated_at = now() WHERE id = $1`,
      [subId, planKey, periodStart, periodEnd]
    );
    return { approved: true, trackId, amount: plan.amount, periodEnd };
  }
  await db.query(`UPDATE ar_payments SET status = 'failed', result_code = $2, failure_message = $3, updated_at = now() WHERE id = $1`,
    [paymentId, out.resultCd, String(out.message || '').slice(0, 300)]);
  return { approved: false, resultCd: out.resultCd, message: out.message || '카드 결제가 승인되지 않았습니다.' };
}

// 3) 매일 자동 갱신 (Vercel Cron)
async function runRenewals({ limit = 50 } = {}) {
  if (!readiness().billing) return { skipped: 'billing_not_ready' };
  const summary = { charged: 0, failed: 0, ended: 0, unknown: 0 };
  // 해지 예약된 구독은 기간이 끝나면 종료
  const ended = await db.query(
    `UPDATE ar_subscriptions SET status = 'canceled', updated_at = now()
      WHERE cancel_at_period_end = true AND status IN ('active','past_due') AND current_period_end <= now() RETURNING id`
  );
  summary.ended = ended.rowCount;
  const due = await db.query(
    `SELECT id, plan, current_period_end, retry_count FROM ar_subscriptions
      WHERE cancel_at_period_end = false AND status IN ('active','past_due')
        AND current_period_end <= now() + interval '1 hour'
        AND (next_attempt_at IS NULL OR next_attempt_at <= now())
      ORDER BY current_period_end LIMIT $1`,
    [limit]
  );
  for (const s of due.rows) {
    // 다음 기간은 이전 기간 끝에서 바로 이어짐 (결제가 늦어져도 날짜가 밀리지 않음)
    const start = new Date(s.current_period_end);
    let res;
    try {
      res = await chargePeriod(s.id, s.plan, start, 'renewal');
    } catch (e) {
      res = { approved: false, message: e.message };
    }
    if (res.approved) summary.charged++;
    else if (res.unknown) summary.unknown++;
    else if (!res.skipped) {
      summary.failed++;
      const retries = s.retry_count + 1;
      if (retries >= 3) {
        await db.query(`UPDATE ar_subscriptions SET status = 'expired', retry_count = $2, updated_at = now() WHERE id = $1`, [s.id, retries]);
      } else {
        // 같은 기간 시작일이면 trackId가 같아 중복 방지에 걸리므로, 실패한 결제 기록은 다음 시도 전에 표시를 바꿔 둠
        await db.query(`UPDATE ar_payments SET track_id = track_id || '-F' || $2 WHERE subscription_id = $1 AND status = 'failed' AND track_id NOT LIKE '%-F%'`, [s.id, retries]);
        await db.query(`UPDATE ar_subscriptions SET status = 'past_due', retry_count = $2, next_attempt_at = now() + interval '1 day', updated_at = now() WHERE id = $1`, [s.id, retries]);
      }
    }
  }
  return summary;
}

async function setCancel(userId, cancel) {
  const r = await db.query(
    `UPDATE ar_subscriptions SET cancel_at_period_end = $2, updated_at = now()
      WHERE user_id = $1 AND status IN ('active','past_due') RETURNING *`,
    [userId, Boolean(cancel)]
  );
  if (!r.rows.length) throw err('NO_SUBSCRIPTION', 404, '이용 중인 구독이 없습니다.');
  return publicSubscription(r.rows[0]);
}

async function paymentHistory(userId) {
  const r = await db.query(
    `SELECT track_id, plan, amount, status, kind, period_start, period_end, created_at
       FROM ar_payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 24`,
    [userId]
  );
  return r.rows.map((p) => ({
    trackId: p.track_id, plan: p.plan, amount: p.amount, status: p.status, kind: p.kind,
    periodStart: p.period_start, periodEnd: p.period_end, createdAt: p.created_at
  }));
}

// 관리자 환불 (ADMIN_TOKEN 필요)
async function adminRefund(trackId, reason) {
  requireBilling();
  const p = (await db.query(`SELECT * FROM ar_payments WHERE track_id = $1 AND status = 'paid'`, [trackId])).rows[0];
  if (!p) throw err('PAYMENT_NOT_FOUND', 404, '환불할 결제를 찾지 못했습니다.');
  const veyon = createVeyon();
  const refundTrack = `AR-RF-${p.id}-${crypto.randomBytes(3).toString('hex')}`;
  await veyon.refund({ trackId: refundTrack, rootTrxId: p.provider_trx_id, rootTrackId: p.track_id, rootTrxDate: p.provider_trx_date, amount: p.amount, reason });
  await db.query(`UPDATE ar_payments SET status = 'refunded', updated_at = now() WHERE id = $1`, [p.id]);
  await db.query(
    `INSERT INTO ar_payments (user_id, subscription_id, track_id, kind, plan, amount, status) VALUES ($1, $2, $3, 'refund', $4, $5, 'paid')`,
    [p.user_id, p.subscription_id, refundTrack, p.plan, -p.amount]
  );
  await db.query(`UPDATE ar_subscriptions SET status = 'canceled', current_period_end = now(), updated_at = now() WHERE id = $1`, [p.subscription_id]);
  return { refunded: true, amount: p.amount };
}

module.exports = { prepareCard, completeCard, runRenewals, setCancel, paymentHistory, adminRefund, getSubscription, publicSubscription, chargePeriod };
