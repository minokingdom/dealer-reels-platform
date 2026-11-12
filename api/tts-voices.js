/**
 * Vercel Serverless Function: GET /api/tts-voices
 * Fish Audio에서 고를 수 있는 한국어 성우 목록 (id, 이름, 태그)
 */
const { listKoreanVoices } = require('../lib/fish-voices');

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
    const voices = await listKoreanVoices(apiKey);
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
    return res.status(200).json({ ok: true, voices });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'fish_voice_list_failed', detail: String(err && err.message) });
  }
};
