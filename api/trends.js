/**
 * Vercel Serverless Function: GET /api/trends?industry=beauty&q=...
 * ----------------------------------------------------------------------------
 * 현재 실제로 올라와 있는 쇼츠·릴스(YouTube Shorts / 릴스 크로스포스팅 영상)를
 * 실시간 검색해 제목·조회수·훅 문구와 AutoReels 디자인 테마 스펙으로 변환해 반환합니다.
 * (YOUTUBE_API_KEY가 있으면 공식 API 사용, 없으면 공개 검색 결과에서 안전하게 추출)
 */

const INDUSTRY_QUERIES = {
  auto: '신차 중고차 출고 릴스 쇼츠',
  restaurant: '맛집 음식점 홍보 릴스 쇼츠',
  cafe: '카페 디저트 신메뉴 릴스 쇼츠',
  beauty: '미용실 네일샵 릴스 쇼츠',
  realestate: '부동산 매물 투어 릴스 쇼츠',
  academy: '학원 공부법 성적 릴스 쇼츠',
  clinic: '병원 의사 건강 릴스 쇼츠',
  fitness: '헬스 필라테스 오운완 릴스 쇼츠',
  shop: '쇼핑몰 코디 언박싱 릴스 쇼츠',
  interior: '인테리어 룸투어 비포애프터 릴스 쇼츠'
};

function themeSpecFromTitle(title, indKey, idx) {
  const t = String(title || '');
  const lower = t.toLowerCase();
  let layout = 'full', cap = 'band', font = 'dohyeon', deco = 'leak', trans = 'zoom', outro = 'card', grade = 'vivid', head = 'pill', bg = 'dark';
  let accent = '#ef4444', accent2 = '#fde047';

  if (/비포|애프터|전후|변신|before|after/.test(lower)) {
    layout = 'duo'; cap = 'band'; trans = 'wipe'; accent = '#ec4899'; accent2 = '#fce7f3';
  } else if (/브이로그|일상|하루|출근|오픈|현장|vlog/.test(lower)) {
    layout = 'handheld'; cap = 'vsub'; font = 'sans'; deco = 'camera'; outro = 'vlogend'; grade = 'warm'; head = 'profile'; accent = '#facc15'; accent2 = '#fef9c3';
  } else if (/꿀팁|방법|체크|정리|루틴|추천|이유|주의/.test(lower)) {
    layout = 'cards'; cap = 'checkl'; font = 'sans'; deco = 'corners'; trans = 'slide'; outro = 'receipt'; bg = 'white'; head = 'counter'; accent = '#2563eb'; accent2 = '#dbeafe';
  } else if (/할인|특가|가격|세일|이벤트|무료/.test(lower)) {
    layout = 'split'; cap = 'band'; font = 'impact'; deco = 'dots'; trans = 'flash'; outro = 'ticket'; accent = '#dc2626'; accent2 = '#fde047';
  } else if (/감성|무드|분위기|야경|카페|예쁜/.test(lower)) {
    layout = 'arch'; cap = 'cinema'; font = 'serif'; deco = 'grain'; trans = 'fade'; grade = 'film'; bg = 'paper'; accent = '#d97706'; accent2 = '#fef3c7';
  } else if (idx % 2 === 1) {
    layout = 'split'; cap = 'pill'; font = 'jua'; deco = 'sparkle'; trans = 'slide'; outro = 'polaroid'; accent = '#8b5cf6'; accent2 = '#ede9fe';
  }

  // 제목에서 해시태그·특수문자 제거 후 짧은 훅 라벨 추출
  const cleaned = t
    .replace(/#[^\s#]+/g, '')
    .replace(/\[[^\]]*\]|\([^)]*\)/g, '')
    .replace(/[^\w가-힣\s·!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const shortLabel = (cleaned.slice(0, 12) || '실시간 릴스').trim();
  const shortName = `📡 ${(cleaned.slice(0, 11) || '실시간 트렌드').trim()}`;

  return {
    id: `live_${indKey}_${Date.now().toString(36)}_${idx}`,
    name: shortName,
    label: shortLabel,
    layout, cap, font, deco, trans, outro, grade, head, bg, accent, accent2
  };
}

function extractVideosFromYtHtml(html) {
  const marker = 'var ytInitialData = ';
  const idx = html.indexOf(marker);
  if (idx < 0) return [];
  const sub = html.slice(idx + marker.length);
  const end = sub.indexOf(';</script>');
  if (end < 0) return [];
  try {
    const data = JSON.parse(sub.slice(0, end));
    const sections = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    const results = [];
    for (const sec of sections) {
      const items = sec?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        const vr = item.videoRenderer;
        if (!vr || !vr.videoId) continue;
        const title = vr.title?.runs?.map((r) => r.text).join('') || '';
        if (!title) continue;
        results.push({
          videoId: vr.videoId,
          url: `https://www.youtube.com/watch?v=${vr.videoId}`,
          title,
          views: vr.viewCountText?.simpleText || vr.shortViewCountText?.simpleText || '',
          author: vr.ownerText?.runs?.[0]?.text || ''
        });
        if (results.length >= 6) return results;
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const indKey = String(req.query.industry || 'auto').trim();
  const customQ = String(req.query.q || '').trim();
  const baseQ = INDUSTRY_QUERIES[indKey] || INDUSTRY_QUERIES.auto;
  const searchQuery = customQ ? `${customQ} 릴스 쇼츠` : baseQ;

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    let rawVideos = [];

    if (apiKey) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&order=viewCount&maxResults=6&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(searchQuery)}&key=${encodeURIComponent(apiKey)}`;
      const r = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const j = await r.json();
        rawVideos = (j.items || []).map((it) => ({
          videoId: it.id?.videoId,
          url: `https://www.youtube.com/watch?v=${it.id?.videoId}`,
          title: it.snippet?.title || '',
          views: '인기 쇼츠',
          author: it.snippet?.channelTitle || ''
        })).filter((v) => v.videoId && v.title);
      }
    }

    if (!rawVideos.length) {
      // sp=EgIYAQ%3D%3D (4분 이하 쇼츠/짧은 영상 필터)
      const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}&sp=EgIYAQ%3D%3D`;
      const r = await fetch(ytUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
        },
        signal: AbortSignal.timeout(5500)
      });
      if (r.ok) {
        const html = await r.text();
        rawVideos = extractVideosFromYtHtml(html);
      }
    }

    const items = rawVideos.map((v, idx) => ({
      ...v,
      theme: themeSpecFromTitle(v.title, indKey, idx)
    }));

    return res.status(200).json({
      ok: true,
      source: apiKey ? 'youtube_api' : (items.length ? 'youtube_live' : 'empty'),
      industry: indKey,
      query: searchQuery,
      fetchedAt: new Date().toISOString(),
      items
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      source: 'error',
      industry: indKey,
      query: searchQuery,
      message: err?.message || '실시간 트렌드 조회 실패',
      items: []
    });
  }
};
