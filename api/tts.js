/**
 * Vercel Serverless Function: GET /api/tts?text=...&voice=...
 * ----------------------------------------------------------------------------
 * 한국어 AI 성우 TTS 오디오 스트림 프록시 (MP3 바이너리 반환)
 * - 브라우저의 WebAudio AudioContext에서 decodeAudioData()로 디코딩하여
 *   실시간 스피커 재생은 물론, MediaRecorder 영상 추출 시 오디오 트랙에 직접 합성됩니다.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const text = String(req.query.text || '안녕하세요, 즉시출고 특별 프로모션을 안내해 드립니다.').slice(0, 180);
    const tl = String(req.query.tl || 'ko');

    const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${encodeURIComponent(tl)}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`TTS upstream status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
