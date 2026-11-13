/**
 * Vercel Serverless Function: GET /api/trends?industry=beauty&q=...&refresh=1
 * ----------------------------------------------------------------------------
 * 운영자 계정(APIFY_TOKEN 또는 IG_ACCESS_TOKEN+IG_USER_ID)이 등록되어 있으면
 * 인스타그램 릴스 인기 게시물을 가져오고, 미등록 시 YouTube Shorts(#릴스 #쇼츠)로 자동 폴백합니다.
 * 기본 업종 조회는 Postgres(ar_trend_cache) + Vercel Edge 캐시(s-maxage)에 저장해
 * 다수 사용자에게 0.1초 만에 무료·안정적으로 제공합니다.
 */

const { Pool } = require('pg');

const INDUSTRY_QUERIES = {
  auto: { yt: '신차 중고차 출고 릴스 쇼츠', ig: '자동차릴스' },
  restaurant: { yt: '맛집 음식점 홍보 릴스 쇼츠', ig: '맛집릴스' },
  cafe: { yt: '카페 디저트 신메뉴 릴스 쇼츠', ig: '카페릴스' },
  beauty: { yt: '미용실 네일샵 릴스 쇼츠', ig: '미용실릴스' },
  realestate: { yt: '부동산 매물 투어 릴스 쇼츠', ig: '부동산릴스' },
  academy: { yt: '학원 공부법 성적 릴스 쇼츠', ig: '공부법릴스' },
  clinic: { yt: '병원 의사 건강 릴스 쇼츠', ig: '건강릴스' },
  fitness: { yt: '헬스 필라테스 오운완 릴스 쇼츠', ig: '오운완릴스' },
  shop: { yt: '쇼핑몰 코디 언박싱 릴스 쇼츠', ig: '코디릴스' },
  interior: { yt: '인테리어 룸투어 비포애프터 릴스 쇼츠', ig: '인테리어릴스' }
};

let trendPool = null;
let trendTableReady = false;

function getTrendPool() {
  const cs = String(process.env.DATABASE_URL || process.env.POSTGRES_URL || '').trim();
  if (!cs) return null;
  if (!trendPool) {
    const local = /localhost|127\.0\.0\.1|host=\/tmp/.test(cs);
    trendPool = new Pool({
      connectionString: cs,
      max: 2,
      idleTimeoutMillis: 10000,
      ssl: local ? false : { rejectUnauthorized: false }
    });
  }
  return trendPool;
}

async function ensureTrendTable(pool) {
  if (trendTableReady || !pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ar_trend_cache (
      industry_key TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT '',
      query TEXT NOT NULL DEFAULT '',
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  trendTableReady = true;
}

async function readTrendCache(indKey, maxAgeHours = 24) {
  const pool = getTrendPool();
  if (!pool) return null;
  try {
    await ensureTrendTable(pool);
    const { rows } = await pool.query(
      `SELECT source, query, items, updated_at
       FROM ar_trend_cache
       WHERE industry_key = $1
         AND updated_at > now() - ($2 || ' hours')::interval`,
      [indKey, String(maxAgeHours)]
    );
    if (!rows.length || !Array.isArray(rows[0].items) || !rows[0].items.length) return null;
    return rows[0];
  } catch (e) {
    return null;
  }
}

async function writeTrendCache(indKey, source, query, items) {
  const pool = getTrendPool();
  if (!pool || !items || !items.length) return;
  try {
    await ensureTrendTable(pool);
    await pool.query(
      `INSERT INTO ar_trend_cache (industry_key, source, query, items, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, now())
       ON CONFLICT (industry_key) DO UPDATE SET
         source = EXCLUDED.source,
         query = EXCLUDED.query,
         items = EXCLUDED.items,
         updated_at = now()`,
      [indKey, source, query, JSON.stringify(items)]
    );
  } catch (e) {}
}

function themeSpecFromTitle(title, indKey, idx, prefix = '📡') {
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

  const cleaned = t
    .replace(/#[^\s#]+/g, '')
    .replace(/\[[^\]]*\]|\([^)]*\)/g, '')
    .replace(/[^\w가-힣\s·!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const shortLabel = (cleaned.slice(0, 12) || '실시간 릴스').trim();
  const shortName = `${prefix} ${(cleaned.slice(0, 11) || '실시간 트렌드').trim()}`;

  return {
    id: `live_${indKey}_${Date.now().toString(36)}_${idx}`,
    name: shortName,
    label: shortLabel,
    layout, cap, font, deco, trans, outro, grade, head, bg, accent, accent2
  };
}

async function fetchInstagramApify(hashtag) {
  const token = String(process.env.APIFY_TOKEN || '').trim();
  if (!token) return [];
  const tag = String(hashtag || '').replace(/^#/, '').replace(/\s+/g, '');
  if (!tag) return [];
  const url = `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=25`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashtags: [tag], resultsType: 'reels', resultsLimit: 6 }),
    signal: AbortSignal.timeout(26000)
  });
  if (!r.ok) return [];
  const rows = await r.json();
  if (!Array.isArray(rows)) return [];
  return rows.slice(0, 6).map((p) => {
    const firstLine = String(p.caption || '').split('\n').map((s) => s.trim()).find(Boolean) || `#${tag} 인기 릴스`;
    const views = p.videoViewCount || p.videoPlayCount || p.likesCount || 0;
    return {
      videoId: p.shortCode || p.id || '',
      url: p.url || (p.shortCode ? `https://www.instagram.com/reel/${p.shortCode}/` : 'https://www.instagram.com/'),
      title: firstLine.slice(0, 80),
      views: views ? `인스타 ${Number(views).toLocaleString()}회/좋아요` : '인스타 인기 릴스',
      author: p.ownerUsername ? `@${p.ownerUsername}` : 'Instagram',
      platform: 'instagram'
    };
  }).filter((x) => x.title);
}

async function fetchInstagramGraph(hashtag) {
  const token = String(process.env.IG_ACCESS_TOKEN || '').trim();
  const userId = String(process.env.IG_USER_ID || '').trim();
  if (!token || !userId) return [];
  const tag = String(hashtag || '').replace(/^#/, '').replace(/\s+/g, '');
  if (!tag) return [];
  const searchUrl = `https://graph.facebook.com/v21.0/ig_hashtag_search?user_id=${encodeURIComponent(userId)}&q=${encodeURIComponent(tag)}&access_token=${encodeURIComponent(token)}`;
  const sr = await fetch(searchUrl, { signal: AbortSignal.timeout(5000) });
  if (!sr.ok) return [];
  const sj = await sr.json();
  const hid = sj?.data?.[0]?.id;
  if (!hid) return [];
  const mediaUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(hid)}/top_media?user_id=${encodeURIComponent(userId)}&fields=id,caption,like_count,comments_count,permalink,media_type&access_token=${encodeURIComponent(token)}`;
  const mr = await fetch(mediaUrl, { signal: AbortSignal.timeout(5000) });
  if (!mr.ok) return [];
  const mj = await mr.json();
  const list = Array.isArray(mj?.data) ? mj.data : [];
  return list.slice(0, 6).map((p) => {
    const firstLine = String(p.caption || '').split('\n').map((s) => s.trim()).find(Boolean) || `#${tag} 인기 릴스`;
    return {
      videoId: p.id || '',
      url: p.permalink || 'https://www.instagram.com/',
      title: firstLine.slice(0, 80),
      views: p.like_count ? `인스타 좋아요 ${Number(p.like_count).toLocaleString()}` : '인스타 인기 게시물',
      author: 'Instagram',
      platform: 'instagram'
    };
  }).filter((x) => x.title);
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
          author: vr.ownerText?.runs?.[0]?.text || '',
          platform: 'youtube'
        });
        if (results.length >= 6) return results;
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

async function fetchTrendsForIndustry(indKey, customQ = '') {
  const conf = INDUSTRY_QUERIES[indKey] || INDUSTRY_QUERIES.auto;
  const igTag = customQ ? customQ.replace(/\s+/g, '') : conf.ig;
  const ytQuery = customQ ? `${customQ} 릴스 쇼츠` : conf.yt;

  let source = 'empty';
  let rawVideos = [];

  // 1) 운영자 Apify 토큰이 있으면 인스타 릴스 우선 조회
  if (process.env.APIFY_TOKEN) {
    rawVideos = await fetchInstagramApify(igTag).catch(() => []);
    if (rawVideos.length) source = 'instagram_apify';
  }

  // 2) 운영자 Meta Graph API 토큰이 있으면 공식 인스타 해시태그 조회
  if (!rawVideos.length && process.env.IG_ACCESS_TOKEN && process.env.IG_USER_ID) {
    rawVideos = await fetchInstagramGraph(igTag).catch(() => []);
    if (rawVideos.length) source = 'instagram_graph';
  }

  // 3) YouTube Data API (YOUTUBE_API_KEY)
  if (!rawVideos.length && process.env.YOUTUBE_API_KEY) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&order=viewCount&maxResults=6&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(ytQuery)}&key=${encodeURIComponent(process.env.YOUTUBE_API_KEY)}`;
    const r = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const j = await r.json();
      rawVideos = (j.items || []).map((it) => ({
        videoId: it.id?.videoId,
        url: `https://www.youtube.com/watch?v=${it.id?.videoId}`,
        title: it.snippet?.title || '',
        views: '인기 쇼츠',
        author: it.snippet?.channelTitle || '',
        platform: 'youtube'
      })).filter((v) => v.videoId && v.title);
      if (rawVideos.length) source = 'youtube_api';
    }
  }

  // 4) 무료 공개 YouTube Shorts 검색 폴백
  if (!rawVideos.length) {
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}&sp=EgIYAQ%3D%3D`;
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
      if (rawVideos.length) source = 'youtube_live';
    }
  }

  const prefix = source.startsWith('instagram') ? '📸' : '📡';
  const items = rawVideos.map((v, idx) => ({
    ...v,
    theme: themeSpecFromTitle(v.title, indKey, idx, prefix)
  }));
  return { source, query: source.startsWith('instagram') ? `#${igTag}` : ytQuery, items };
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const indKey = String(req.query.industry || 'auto').trim();
  const customQ = String(req.query.q || '').trim();
  const forceRefresh = req.query.refresh === '1';

  try {
    // 기본 업종 조회는 서버 DB 캐시 우선 (0.1초 응답 & 비용/한도 절약)
    if (!customQ && !forceRefresh) {
      const cached = await readTrendCache(indKey, 24);
      if (cached) {
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).json({
          ok: true,
          cached: true,
          source: cached.source,
          industry: indKey,
          query: cached.query,
          fetchedAt: cached.updated_at,
          items: cached.items
        });
      }
    }

    const { source, query, items } = await fetchTrendsForIndustry(indKey, customQ);
    if (!customQ && items.length) {
      await writeTrendCache(indKey, source, query, items);
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    }

    return res.status(200).json({
      ok: true,
      cached: false,
      source,
      industry: indKey,
      query,
      fetchedAt: new Date().toISOString(),
      items
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      source: 'error',
      industry: indKey,
      query: customQ,
      message: err?.message || '실시간 트렌드 조회 실패',
      items: []
    });
  }
}

module.exports = handler;
module.exports.INDUSTRY_QUERIES = INDUSTRY_QUERIES;
module.exports.fetchTrendsForIndustry = fetchTrendsForIndustry;
module.exports.writeTrendCache = writeTrendCache;
