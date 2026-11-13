/**
 * Vercel Serverless Function: GET /api/tts-voices
 * 서비스에서 고를 수 있는 성우 목록 (id, 이름)
 */
const { listCuratedVoices } = require('../lib/fish-voices');

// 주의: Fish Audio 한국어 "인기순" 목록을 그대로 붙이지 말 것.
// 2026-11-14 확인 결과 연예인 목소리 복제본(아이돌·배우)과 다른 언어 목소리가 섞여 있어
// 광고에 쓰면 퍼블리시티권 문제가 생길 수 있음. 성우는 직접 들어 보고 CURATED_VOICE_IDS 에만 추가.

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
    const voices = await listCuratedVoices(apiKey);
    const allNamed = voices.every((v) => v.named);
    res.setHeader('Cache-Control', allNamed ? 'public, max-age=600, s-maxage=3600' : 'no-store');
    return res.status(200).json({ ok: true, voices });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'fish_voice_list_failed', detail: String(err && err.message) });
  }
};
