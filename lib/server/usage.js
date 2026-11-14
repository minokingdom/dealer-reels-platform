'use strict';
// 사용량 계산·제한: 성우 글자 수, AI 대본 횟수.
// DB가 없으면(시연 모드) 제한 없이 통과합니다.
const crypto = require('node:crypto');
const db = require('./db');
const { readiness } = require('./config');
const { readSession } = require('./session');
const { limits } = require('./plans');

function monthKey(d = new Date()) {
  // 한국 시간 기준 달
  const k = new Date(d.getTime() + 9 * 3600 * 1000);
  return k.toISOString().slice(0, 7);
}
function dayKey(d = new Date()) {
  const k = new Date(d.getTime() + 9 * 3600 * 1000);
  return k.toISOString().slice(0, 10);
}
function hourKey(d = new Date()) {
  const k = new Date(d.getTime() + 9 * 3600 * 1000);
  return k.toISOString().slice(0, 13);
}

function isSameSiteRequest(req) {
  const host = String((req && req.headers && req.headers.host) || '').toLowerCase();
  const source = (req && req.headers && (req.headers.origin || req.headers.referer)) || '';
  if (!source) return true;
  try {
    return new URL(source).host.toLowerCase() === host;
  } catch (e) {
    return false;
  }
}

// DB가 꺼져 있을 때(시연 모드) 비용 누수를 막기 위한 메모리 기반 IP 일일 + 인스턴스 시간당 한도
const MEM_USAGE = new Map();
const MEM_DAILY_IP_CAPS = { ai: 15, tts: 1500, trends: 10, export: 0 };
const MEM_HOURLY_GLOBAL_CAPS = { ai: 120, tts: 25000, trends: 40, export: 0 };

function memPruneIfNeeded() {
  if (MEM_USAGE.size < 2000) return;
  const today = dayKey();
  const curHour = hourKey();
  for (const k of MEM_USAGE.keys()) {
    if (!k.includes(today) && !k.includes(curHour)) MEM_USAGE.delete(k);
  }
}

function memSubjectKey(req) {
  const salt = String(process.env.AUTH_SECRET || 'ar_mem_fallback');
  return crypto.createHash('sha256').update(salt + clientIp(req)).digest('hex').slice(0, 20);
}

function memConsume(req, kind, units) {
  memPruneIfNeeded();
  const ipCap = MEM_DAILY_IP_CAPS[kind];
  const hrCap = MEM_HOURLY_GLOBAL_CAPS[kind];
  if (ipCap === undefined || hrCap === undefined) return { ok: true, skipped: true };
  const ipKey = `ip:${kind}:${dayKey()}:${memSubjectKey(req)}`;
  const gKey = `gl:${kind}:${hourKey()}`;
  const ipUsed = MEM_USAGE.get(ipKey) || 0;
  const gUsed = MEM_USAGE.get(gKey) || 0;
  if (ipUsed + units > ipCap || gUsed + units > hrCap) {
    return {
      ok: false,
      status: 429,
      body: {
        ok: false,
        error: 'quota_exceeded',
        kind,
        tier: 'anonymous',
        message: '체험 한도를 초과했습니다. 잠시 후 다시 시도하거나 로그인해 주세요.'
      }
    };
  }
  MEM_USAGE.set(ipKey, ipUsed + units);
  MEM_USAGE.set(gKey, gUsed + units);
  return { ok: true, used: ipUsed + units, cap: ipCap, tier: 'anonymous', memoryFallback: true };
}

function memRefund(req, kind, units) {
  const ipKey = `ip:${kind}:${dayKey()}:${memSubjectKey(req)}`;
  const gKey = `gl:${kind}:${hourKey()}`;
  if (MEM_USAGE.has(ipKey)) MEM_USAGE.set(ipKey, Math.max(0, (MEM_USAGE.get(ipKey) || 0) - units));
  if (MEM_USAGE.has(gKey)) MEM_USAGE.set(gKey, Math.max(0, (MEM_USAGE.get(gKey) || 0) - units));
}

function clientIp(req) {
  const f = String((req.headers && req.headers['x-forwarded-for']) || '').split(',')[0].trim();
  return f || String((req.socket && req.socket.remoteAddress) || 'unknown');
}

// 지금 이 요청을 한 사람의 이용권 (가입자는 구독 상태까지)
async function resolveSubject(req) {
  const s = readSession(req);
  if (s) {
    const r = await db.query(
      `SELECT u.id, u.session_version, s.plan, s.status, s.current_period_end
         FROM ar_users u LEFT JOIN ar_subscriptions s ON s.user_id = u.id WHERE u.id = $1`,
      [s.uid]
    );
    const row = r.rows[0];
    if (row && Number(row.session_version) === Number(s.v || 1)) {
      const active = isActive(row);
      return { kind: 'user', subject: `u:${row.id}`, userId: row.id, tier: active ? row.plan : 'free' };
    }
  }
  const salt = String(process.env.AUTH_SECRET || '');
  const ipHash = crypto.createHash('sha256').update(salt + clientIp(req)).digest('hex').slice(0, 24);
  return { kind: 'anonymous', subject: `ip:${ipHash}`, userId: null, tier: 'anonymous' };
}

function isActive(row) {
  if (!row || !row.plan) return false;
  if (!['active', 'past_due', 'canceling'].includes(row.status)) return false;
  return row.current_period_end && new Date(row.current_period_end).getTime() > Date.now();
}

// kind: 'tts' (units = 글자 수) | 'ai'
// 반환: { ok: true } | { ok: false, status, body }
async function consume(req, kind, units) {
  if (kind === 'trends') return memConsume(req, 'trends', units);
  const ready = readiness();
  if (!ready.serverMode) return memConsume(req, kind, units);
  // 전체 성우 비용 상한 (모든 사용자 합계, 한 달)
  if (kind === 'tts' && Number(process.env.FISH_MONTHLY_CHAR_CAP) > 0) {
    const g = await db.query(`SELECT tts_chars FROM ar_usage WHERE subject = 'global' AND period = $1`, [monthKey()]);
    if ((g.rows[0] ? g.rows[0].tts_chars : 0) + units > Number(process.env.FISH_MONTHLY_CHAR_CAP)) {
      return { ok: false, status: 429, body: { ok: false, error: 'service_tts_cap', message: '이번 달 성우 서비스 사용량이 가득 찼습니다.' } };
    }
  }
  const who = await resolveSubject(req);
  const L = limits()[who.tier] || limits().free;
  const daily = who.kind === 'anonymous';
  const period = daily ? `d:${dayKey()}` : monthKey();
  const col = kind === 'tts' ? 'tts_chars' : kind === 'export' ? 'exports' : 'ai_scripts';
  const cap = kind === 'tts'
    ? (daily ? L.ttsCharsDaily : L.ttsChars)
    : kind === 'export'
      ? (L.exportPublishLimit === undefined ? 0 : L.exportPublishLimit)
      : (daily ? L.aiScriptsDaily : L.aiScripts);
  const rejected = {
    ok: false,
    status: 429,
    body: {
      ok: false,
      error: 'quota_exceeded',
      kind,
      tier: who.tier,
      message: kind === 'export'
        ? (who.tier === 'standard'
            ? `이번 달 다운로드·SNS 게시 한도(${cap}회)를 모두 사용했어요. 프로 무제한 요금제로 업그레이드해 주세요.`
            : '다운로드·SNS 게시는 스탠다드 또는 프로 요금제 구독 후 이용할 수 있어요.')
        : who.kind === 'anonymous'
          ? '오늘 체험 사용량을 다 썼어요. 무료 가입하면 더 쓸 수 있어요.'
          : who.tier === 'free'
            ? '무료 회원 이번 달 사용량을 다 썼어요. PRO 구독으로 늘릴 수 있어요.'
            : '이번 달 사용량을 다 썼어요. 다음 달에 다시 채워집니다.'
    }
  };
  if (kind === 'export' && cap === null) {
    const rUnlim = await db.query(
      `INSERT INTO ar_usage (subject, period, exports) VALUES ($1, $2, $3)
         ON CONFLICT (subject, period) DO UPDATE SET exports = ar_usage.exports + EXCLUDED.exports
       RETURNING exports AS used`,
      [who.subject, period, units]
    );
    return { ok: true, used: rUnlim.rows[0].used, cap: null, tier: who.tier };
  }
  if (units > cap) return rejected;
  // 한도 안에서만 원자적으로 더함
  const r = await db.query(
    `INSERT INTO ar_usage (subject, period, ${col}) VALUES ($1, $2, $3)
       ON CONFLICT (subject, period) DO UPDATE SET ${col} = ar_usage.${col} + EXCLUDED.${col}
       WHERE ar_usage.${col} + EXCLUDED.${col} <= $4
     RETURNING ${col} AS used`,
    [who.subject, period, units, cap]
  );
  if (!r.rows.length) return rejected;
  if (kind === 'tts') {
    await db.query(
      `INSERT INTO ar_usage (subject, period, tts_chars) VALUES ('global', $1, $2)
         ON CONFLICT (subject, period) DO UPDATE SET tts_chars = ar_usage.tts_chars + EXCLUDED.tts_chars`,
      [monthKey(), units]
    );
  }
  return { ok: true, used: r.rows[0].used, cap, tier: who.tier };
}

// 실패한 요청은 사용량을 되돌려 줌
async function refundUsage(req, kind, units) {
  if (kind === 'trends') return memRefund(req, 'trends', units);
  const ready = readiness();
  if (!ready.serverMode) return memRefund(req, kind, units);
  try {
    const who = await resolveSubject(req);
    const period = who.kind === 'anonymous' ? `d:${dayKey()}` : monthKey();
    const col = kind === 'tts' ? 'tts_chars' : kind === 'export' ? 'exports' : 'ai_scripts';
    await db.query(`UPDATE ar_usage SET ${col} = GREATEST(0, ${col} - $3) WHERE subject = $1 AND period = $2`, [who.subject, period, units]);
    if (kind === 'tts') await db.query(`UPDATE ar_usage SET tts_chars = GREATEST(0, tts_chars - $2) WHERE subject = 'global' AND period = $1`, [monthKey(), units]);
  } catch (e) {}
}

async function usageFor(userId, tier) {
  const r = await db.query(`SELECT tts_chars, ai_scripts, exports FROM ar_usage WHERE subject = $1 AND period = $2`, [`u:${userId}`, monthKey()]);
  const L = limits()[tier] || limits().free;
  const row = r.rows[0] || { tts_chars: 0, ai_scripts: 0, exports: 0 };
  return {
    ttsChars: row.tts_chars,
    ttsLimit: L.ttsChars,
    aiScripts: row.ai_scripts,
    aiLimit: L.aiScripts,
    exports: row.exports || 0,
    exportLimit: L.exportPublishLimit === undefined ? 0 : L.exportPublishLimit,
    period: monthKey()
  };
}

module.exports = { consume, refundUsage, usageFor, isActive, resolveSubject, monthKey, isSameSiteRequest };
