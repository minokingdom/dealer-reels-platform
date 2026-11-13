/**
 * Vercel Serverless Function: GET /api/tts-script?lines=<JSON 배열>&ref=<보이스 ID>&speed=1.1&tone=bright
 * ----------------------------------------------------------------------------
 * 대본 전체를 Fish Audio에 "한 번에" 보내 한 호흡으로 녹음한 뒤, 문장별 시작·끝 시각을 함께 돌려줍니다.
 * 문장마다 따로 녹음하면 문장 사이의 톤·속도·크기가 달라져 이어 붙인 티가 나기 때문입니다.
 *
 * 응답: { ok, audio_base64 (mp3), duration, lines: [{ start, end }] }  — 시각 단위는 초
 * 브라우저는 이 시각 근처의 가장 조용한 지점에서 잘라 컷별 음성으로 씁니다.
 */

const { isValidVoiceId, CURATED_VOICE_IDS } = require('../lib/fish-voices');
const { normalizeKoreanNumbers } = require('../lib/korean-numbers');
// 유료 크레딧이 없을 때 쓰는 Fish Audio 무료 모델
const FREE_MODEL = (process.env.FISH_TTS_FREE_MODEL || 's2.1-pro-free').trim();

const FISH_TS_URL = 'https://api.fish.audio/v1/tts/stream/with-timestamp';
const TONE_TAGS = { bright: '[happy]', excited: '[excited]', plain: '' };
const MAX_LINES = 12;
const MAX_LINE_LENGTH = 200;

// 글자 수 비교용: 한글·영문·숫자만 남김 (말투 지시어 [..] 는 제외)
function countable(text) {
  return String(text).replace(/\[[^\]]*\]/g, '').replace(/[^0-9A-Za-z가-힣]/g, '');
}

function isSameSiteRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  const source = req.headers.origin || req.headers.referer || '';
  if (!source) return true;
  try {
    return new URL(source).host.toLowerCase() === host;
  } catch (e) {
    return false;
  }
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!isSameSiteRequest(req)) {
    return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }
  const apiKey = (process.env.FISH_API_KEY || '').trim();
  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false, error: 'fish_api_key_missing' });
  }

  let lines;
  try {
    lines = JSON.parse(String(req.query.lines || '[]'));
  } catch (e) {
    lines = null;
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) {
    return res.status(400).json({ ok: false, error: 'lines_required' });
  }
  lines = lines.map((l) => String(l || '').replace(/\s+/g, ' ').trim().slice(0, MAX_LINE_LENGTH));
  if (lines.some((l) => !countable(l))) {
    return res.status(400).json({ ok: false, error: 'empty_line' });
  }

  const ref = String(req.query.ref || '');
  const referenceId = isValidVoiceId(ref) ? ref : (process.env.FISH_VOICE_FEMALE || '').trim() || CURATED_VOICE_IDS[0];
  const requestedSpeed = Number(req.query.speed);
  const speed = requestedSpeed >= 0.8 && requestedSpeed <= 1.5 ? requestedSpeed : 1.1;
  const toneKey = Object.prototype.hasOwnProperty.call(TONE_TAGS, String(req.query.tone)) ? String(req.query.tone) : 'bright';
  const toneTag = TONE_TAGS[toneKey];

  const spoken = lines.map((l) => normalizeKoreanNumbers(l));
  // 문장 사이에 [pause]를 넣어 실제로 숨 쉬는 틈을 만듦 (문장을 잘라 쓸 때 말끝이 잘리지 않도록)
  const fullText = spoken
    .map((l, i) => (toneTag ? `${toneTag} ${l}` : l) + (i < spoken.length - 1 ? ' [pause]' : ''))
    .join('\n');

  const callFish = (model) =>
    fetch(FISH_TS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        model
      },
      body: JSON.stringify({
        text: fullText,
        reference_id: referenceId,
        format: 'mp3',
        latency: 'normal',
        prosody: { speed }
      })
    });
  try {
    let modelUsed = (process.env.FISH_TTS_MODEL || 's2-pro').trim();
    let upstream = await callFish(modelUsed);
    if (upstream.status === 402) {
      modelUsed = FREE_MODEL;
      upstream = await callFish(FREE_MODEL);
    }
    res.setHeader('X-TTS-Model', modelUsed);
    if (!upstream.ok) {
      let detail = '';
      try { detail = (await upstream.text()).slice(0, 300); } catch (e) {}
      res.setHeader('Cache-Control', 'no-store');
      return res.status(upstream.status === 401 || upstream.status === 402 ? upstream.status : 502).json({
        ok: false, error: 'fish_tts_failed', upstreamStatus: upstream.status, detail
      });
    }

    // SSE 본문: "data: {json}" 줄마다 오디오 조각과 정렬(문장 시각) 스냅샷이 들어 있음
    const raw = await upstream.text();
    const audioParts = [];
    const chunks = new Map(); // chunk_seq → { offset, segments }
    let eventCount = 0;
    for (const line of raw.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      let evt;
      try { evt = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
      if (!evt || typeof evt !== 'object') continue;
      eventCount++;
      if (evt.audio_base64) audioParts.push(Buffer.from(evt.audio_base64, 'base64'));
      if (evt.alignment && Array.isArray(evt.alignment.segments)) {
        chunks.set(Number(evt.chunk_seq) || 0, {
          offset: Number(evt.chunk_audio_offset_sec) || 0,
          segments: evt.alignment.segments
        });
      }
    }
    const audio = Buffer.concat(audioParts);
    const segments = [];
    [...chunks.keys()].sort((a, b) => a - b).forEach((seq) => {
      const c = chunks.get(seq);
      c.segments.forEach((s) => {
        const text = String(s.text || '');
        if (countable(text)) segments.push({ text, start: c.offset + Number(s.start), end: c.offset + Number(s.end) });
      });
    });
    if (audio.length === 0 || segments.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ ok: false, error: 'fish_no_alignment', eventCount, audioBytes: audio.length, segments: segments.length });
    }

    // 정렬 구간을 대본 문장에 배분: 글자 수 누적 비율로 각 문장의 끝 구간을 찾음
    const segChars = segments.map((s) => countable(s.text).length);
    const totalSeg = segChars.reduce((a, b) => a + b, 0);
    const lineChars = spoken.map((l) => countable(l).length);
    const totalLine = lineChars.reduce((a, b) => a + b, 0);
    const out = [];
    let segIdx = 0;
    let segCum = 0;
    let lineCum = 0;
    for (let i = 0; i < spoken.length; i++) {
      lineCum += lineChars[i];
      const target = (lineCum / totalLine) * totalSeg;
      const firstSeg = Math.min(segIdx, segments.length - 1);
      let lastSeg = firstSeg;
      while (segIdx < segments.length) {
        const next = segCum + segChars[segIdx];
        // 이 구간의 가운데가 목표 지점을 넘으면 다음 문장 몫으로 넘김 (각 문장은 최소 한 구간)
        if (segIdx > firstSeg && segCum + segChars[segIdx] / 2 > target) break;
        segCum = next;
        lastSeg = segIdx;
        segIdx++;
        if (i === spoken.length - 1) continue; // 마지막 문장은 남은 구간 전부
        if (segments.length - segIdx <= spoken.length - 1 - i) break; // 뒤 문장 몫을 남겨 둠
      }
      out.push({ start: segments[firstSeg].start, end: segments[lastSeg].end });
    }
    const monotonic = out.every((l, i) => l.end > l.start && (i === 0 || l.start >= out[i - 1].start));
    if (out.length !== spoken.length || !monotonic) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ ok: false, error: 'fish_alignment_mismatch', lines: out, segments: segments.length });
    }

    // model: 실제로 쓴 Fish Audio 모델 (유료 크레딧이 떨어지면 무료 모델 이름이 나옴)
    const body = { ok: true, model: modelUsed, duration: segments[segments.length - 1].end, lines: out, audio_base64: audio.toString('base64') };
    if (req.query.debug === '1') {
      body.debug = { eventCount, segments, spoken, fullText };
      res.setHeader('Cache-Control', 'no-store');
    } else {
      // 무료 모델(크레딧 부족) 음성은 CDN에 저장하지 않음
      res.setHeader('Cache-Control', modelUsed === FREE_MODEL ? 'no-store' : 'public, max-age=86400, s-maxage=604800');
    }
    return res.status(200).json(body);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'fish_tts_unreachable', detail: String(err && err.message) });
  }
};

// 사용량 계산·한도 (회원 서버가 켜져 있을 때만 동작)
const { withMeter } = require('../lib/server/meter');
module.exports = withMeter(handler, 'tts', (req) => { try { return JSON.parse(String((req.query || {}).lines || '[]')).join('').replace(/\s+/g, ' ').length; } catch (e) { return 0; } });
