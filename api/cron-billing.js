'use strict';
// GET /api/cron-billing — Vercel Cron이 매일 한 번 부르는 자동 갱신 결제
// 관리자 환불: POST /api/cron-billing?action=refund  (헤더 x-admin-token: ADMIN_TOKEN)
const billing = require('../lib/server/billing');
const db = require('../lib/server/db');
const crypto = require('node:crypto');

function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String((req.query && req.query.action) || '');
  try {
    if (action === 'refund' || action === 'review') {
      const admin = String(process.env.ADMIN_TOKEN || '');
      if (admin.length < 24 || !safeEqual(req.headers['x-admin-token'], admin)) return res.status(401).json({ ok: false });
      if (action === 'review') {
        // 결과를 알 수 없는 결제(운영자 확인 필요) 목록
        const r = await db.query(`SELECT track_id, user_id, plan, amount, status, failure_message, created_at FROM ar_payments WHERE status = 'unknown' ORDER BY created_at DESC LIMIT 100`);
        return res.status(200).json({ ok: true, unknown: r.rows });
      }
      const body = typeof req.body === 'object' && req.body ? req.body : {};
      return res.status(200).json({ ok: true, ...(await billing.adminRefund(String(body.trackId || ''), String(body.reason || '운영자 환불'))) });
    }
    const secret = String(process.env.CRON_SECRET || '');
    const auth = String(req.headers.authorization || '');
    if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return res.status(401).json({ ok: false });
    const out = await billing.runRenewals();
    console.log('[cron-billing]', JSON.stringify(out));
    return res.status(200).json({ ok: true, ...out });
  } catch (e) {
    console.error('[cron-billing]', e.code || '', e.message);
    return res.status(Number(e.status) || 500).json({ ok: false, error: e.code || 'server_error', message: e.message });
  }
};
