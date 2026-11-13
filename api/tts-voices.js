/**
 * Vercel Serverless Function: GET /api/tts-voices
 * 서비스에서 고를 수 있는 성우 목록 (id, 이름)
 */
const { listCuratedVoices, listKoreanVoices } = require('../lib/fish-voices');

// 지정 성우 뒤에 Fish Audio 한국어 성우 중 사용량 상위 몇 명을 붙여 고를 수 있게 함 (목록을 못 받으면 지정 성우만)
const POPULAR_LIMIT = 10;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const apiKey = (process.env.FISH_API_KEY || '').trim();
  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false, error: 'fish_api_key_missing' });
  }
  try {
    const curated = await listCuratedVoices(apiKey);
    let popular = [];
    try {
      const ids = new Set(curated.map((v) => v.id));
      popular = (await listKoreanVoices(apiKey))
        .filter((v) => !ids.has(v.id))
        .slice(0, POPULAR_LIMIT)
        .map((v) => ({ id: v.id, title: `인기 · ${v.title}`, named: true, popular: true }));
    } catch (e) {}
    const voices = curated.concat(popular);
    const allNamed = curated.every((v) => v.named);
    res.setHeader('Cache-Control', allNamed ? 'public, max-age=600, s-maxage=3600' : 'no-store');
    return res.status(200).json({ ok: true, voices });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'fish_voice_list_failed', detail: String(err && err.message) });
  }
};
