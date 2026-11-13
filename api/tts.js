/**
 * Vercel Serverless Function: GET /api/tts?text=...&ref=<보이스 ID>&speed=1.1
 * ----------------------------------------------------------------------------
 * Fish Audio 한국어 AI 성우 TTS 프록시 (MP3 바이너리 반환)
 * - API 키는 서버 환경변수에만 두고 브라우저로 내려보내지 않습니다.
 * - 브라우저는 응답을 decodeAudioData()로 디코딩해 WebAudio 그래프에 연결하므로
 *   스피커 재생과 MediaRecorder 영상 추출 오디오 트랙에 같은 음성이 들어갑니다.
 *
 * 환경변수 (Vercel → Settings → Environment Variables)
 *   FISH_API_KEY          필수. Fish Audio API 키
 *   FISH_TTS_MODEL        선택. 기본 s2-pro
 *   FISH_VOICE_FEMALE     선택. 여성 성우 보이스 모델 ID (reference_id)
 *   FISH_VOICE_MALE       선택. 남성 성우 보이스 모델 ID
 *   FISH_VOICE_ENERGETIC  선택. 쇼호스트 성우 보이스 모델 ID (없으면 여성 보이스 + 빠른 속도)
 *   보이스 ID를 비워두면 lib/fish-voices.js 의 기본 성우 하나로 고정해 합성합니다.
 *   말투는 ?tone=bright(기본, 밝게) | excited | plain
 *   화면에서 성우를 고르면 ?ref=<보이스 ID>, 속도는 ?speed=0.8~1.5 로 전달됩니다.
 */

const { isValidVoiceId, CURATED_VOICE_IDS } = require('../lib/fish-voices');
const { normalizeKoreanNumbers } = require('../lib/korean-numbers');
// 유료 크레딧이 없을 때 쓰는 Fish Audio 무료 모델
const FREE_MODEL = (process.env.FISH_TTS_FREE_MODEL || 's2.1-pro-free').trim();

// 말투: S2 모델은 문장 앞의 [대괄호] 지시어로 감정을 조절합니다. 기본은 밝은 톤
const TONE_TAGS = { bright: '[happy]', excited: '[excited]', plain: '' };

const FISH_TTS_URL = 'https://api.fish.audio/v1/tts';
const MAX_TEXT_LENGTH = 200;

const VOICE_PRESETS = {
  female: { env: ['FISH_VOICE_FEMALE'], speed: 1.1 },
  male: { env: ['FISH_VOICE_MALE'], speed: 1.05 },
  energetic: { env: ['FISH_VOICE_ENERGETIC', 'FISH_VOICE_FEMALE'], speed: 1.2 }
};

function resolveVoice(voiceKey) {
  const preset = VOICE_PRESETS[voiceKey] || VOICE_PRESETS.female;
  let referenceId = '';
  for (const name of preset.env) {
    const v = (process.env[name] || '').trim();
    if (v) {
      referenceId = v;
      break;
    }
  }
  return { referenceId, speed: preset.speed };
}

// 다른 사이트가 이 프록시를 끌어다 써서 크레딧을 소모하는 것을 막는 최소한의 확인
function isSameSiteRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  const source = req.headers.origin || req.headers.referer || '';
  if (!source) return true; // 주소창 직접 호출·서버 간 호출은 허용
  try {
    return new URL(source).host.toLowerCase() === host;
  } catch (e) {
    return false;
  }
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!isSameSiteRequest(req)) {
    return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }

  const apiKey = (process.env.FISH_API_KEY || '').trim();
  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      ok: false,
      error: 'fish_api_key_missing',
      message: 'Vercel 환경변수 FISH_API_KEY가 설정되지 않았습니다.'
    });
  }

  const input = req.method === 'POST' && req.body && typeof req.body === 'object' ? req.body : req.query || {};
  const text = String(input.text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT_LENGTH);
  if (!text) {
    return res.status(400).json({ ok: false, error: 'text_required' });
  }
  // 보이스 결정 순서: 화면에서 고른 보이스(ref) → 환경변수 보이스 → 기본 성우(목록의 첫 번째)
  // 보이스를 지정하지 않으면 Fish Audio가 문장마다 다른 목소리(남/여)를 골라 섞이므로 반드시 하나로 고정합니다.
  const preset = resolveVoice(String(input.voice || 'female'));
  let referenceId = isValidVoiceId(String(input.ref || '')) ? String(input.ref) : preset.referenceId;
  if (!referenceId) referenceId = CURATED_VOICE_IDS[0];
  const toneKey = Object.prototype.hasOwnProperty.call(TONE_TAGS, String(input.tone)) ? String(input.tone) : 'bright';
  const toneTag = TONE_TAGS[toneKey];
  const requestedSpeed = Number(input.speed);
  const speed = requestedSpeed >= 0.8 && requestedSpeed <= 1.5 ? requestedSpeed : preset.speed;

  const payload = {
    // "4대"를 "네 대"로 읽도록 숫자 읽기를 보정한 뒤 말투 지시어를 붙임
    text: (toneTag ? `${toneTag} ` : '') + normalizeKoreanNumbers(text),
    format: 'mp3',
    latency: 'normal',
    prosody: { speed }
  };
  payload.reference_id = referenceId;

  // 크레딧이 떨어지면(402) Fish Audio 무료 모델로 한 번 더 시도
  const callFish = (model) =>
    fetch(FISH_TTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        model
      },
      body: JSON.stringify(payload)
    });
  try {
    let upstream = await callFish((process.env.FISH_TTS_MODEL || 's2-pro').trim());
    if (upstream.status === 402) upstream = await callFish(FREE_MODEL);

    if (!upstream.ok) {
      let detail = '';
      try {
        detail = (await upstream.text()).slice(0, 300);
      } catch (e) {}
      res.setHeader('Cache-Control', 'no-store');
      // 401 키 오류, 402 크레딧 부족 등 Fish Audio 상태 코드를 그대로 전달
      return res.status(upstream.status === 401 || upstream.status === 402 ? upstream.status : 502).json({
        ok: false,
        error: 'fish_tts_failed',
        upstreamStatus: upstream.status,
        detail
      });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ ok: false, error: 'fish_tts_empty_audio' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    // 같은 문장·같은 성우는 CDN에서 7일간 재사용해 크레딧 소모를 줄입니다.
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    return res.status(200).send(buffer);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'fish_tts_unreachable', detail: String(err && err.message) });
  }
};

// 사용량 계산·한도 (회원 서버가 켜져 있을 때만 동작)
const { withMeter } = require('../lib/server/meter');
module.exports = withMeter(handler, 'tts', (req) => String(((req.method === 'POST' && req.body) || req.query || {}).text || '').replace(/\s+/g, ' ').trim().slice(0, 200).length);
