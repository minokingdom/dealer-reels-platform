/**
 * Fish Audio 한국어 보이스 목록 조회 (서버 전용 공용 모듈)
 * - GET https://api.fish.audio/model 로 한국어 보이스를 인기순으로 받아옵니다.
 * - 같은 서버 인스턴스 안에서는 10분간 결과를 재사용합니다.
 */

const FISH_MODEL_URL = 'https://api.fish.audio/model';
const CACHE_MS = 10 * 60 * 1000;
const VOICE_ID_PATTERN = /^[a-f0-9]{16,64}$/i;

// 서비스에서 쓰는 성우 (Fish Audio 보이스 모델 ID). 첫 번째가 기본 성우입니다.
const CURATED_VOICE_IDS = [
  '4e118bfbb83e401c84699c09b5f08257',
  '8cf5ee4cb0224c109852a206f185a05f',
  '9a50287ddd26414690b538539ad52d61',
  '8748b1f032e2418183a6ffb920724755'
];

let cached = { at: 0, voices: [] };
let curatedCache = { at: 0, voices: [] };

// 지정한 성우들의 이름을 Fish Audio에서 받아옴. 이름을 못 받아도 ID는 그대로 돌려줌
async function listCuratedVoices(apiKey) {
  if (curatedCache.voices.length > 0 && Date.now() - curatedCache.at < CACHE_MS) return curatedCache.voices;
  const voices = await Promise.all(
    CURATED_VOICE_IDS.map(async (id, idx) => {
      let title = `성우 ${idx + 1}`;
      let named = false;
      try {
        const res = await fetch(`${FISH_MODEL_URL}/${id}`, { headers: { Authorization: `Bearer ${apiKey}` } });
        if (res.ok) {
          const m = await res.json();
          if (m && m.title) {
            title = String(m.title).slice(0, 40);
            named = true;
          }
        }
      } catch (e) {}
      return { id, title, named };
    })
  );
  if (voices.every((v) => v.named)) curatedCache = { at: Date.now(), voices };
  return voices;
}

function isValidVoiceId(id) {
  return typeof id === 'string' && VOICE_ID_PATTERN.test(id);
}

async function listKoreanVoices(apiKey) {
  if (cached.voices.length > 0 && Date.now() - cached.at < CACHE_MS) return cached.voices;

  const url = `${FISH_MODEL_URL}?page_size=20&page_number=1&language=ko&sort_by=task_count`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) {
    const err = new Error(`fish_model_list_${res.status}`);
    err.status = res.status;
    throw err;
  }
  const body = await res.json();
  const items = Array.isArray(body && body.items) ? body.items : [];
  const voices = items
    .filter((m) => m && isValidVoiceId(m._id))
    .filter((m) => !m.state || m.state === 'trained')
    .filter((m) => !m.type || m.type === 'tts')
    .map((m) => ({
      id: m._id,
      title: String(m.title || '이름 없는 보이스').slice(0, 40),
      description: String(m.description || '').slice(0, 80),
      tags: Array.isArray(m.tags) ? m.tags.slice(0, 4).map((t) => String(t).slice(0, 16)) : []
    }));

  if (voices.length > 0) cached = { at: Date.now(), voices };
  return voices;
}

module.exports = { listKoreanVoices, listCuratedVoices, isValidVoiceId, CURATED_VOICE_IDS };
