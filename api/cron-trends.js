'use strict';
// GET /api/cron-trends — 매일 1회 10개 업종의 최신 릴스/쇼츠 트렌드를 수집해 DB 캐시에 저장
const crypto = require('node:crypto');
const { INDUSTRY_QUERIES, fetchTrendsForIndustry, writeTrendCache } = require('./trends');

function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const secret = String(process.env.CRON_SECRET || '');
    const auth = String(req.headers.authorization || '');
    if (secret && !safeEqual(auth, `Bearer ${secret}`)) return res.status(401).json({ ok: false });

    const keys = Object.keys(INDUSTRY_QUERIES);
    const summary = {};
    for (const k of keys) {
      const { source, query, items } = await fetchTrendsForIndustry(k, '');
      if (items.length) await writeTrendCache(k, source, query, items);
      summary[k] = { source, count: items.length };
    }
    console.log('[cron-trends]', JSON.stringify(summary));
    return res.status(200).json({ ok: true, updatedAt: new Date().toISOString(), summary });
  } catch (e) {
    console.error('[cron-trends]', e.message);
    return res.status(500).json({ ok: false, message: e.message });
  }
};
