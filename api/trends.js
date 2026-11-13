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
  auto: { yt: '신차 중고차 출고 릴스 쇼츠', ig: '자동차' },
  restaurant: { yt: '맛집 음식점 홍보 릴스 쇼츠', ig: '맛집추천' },
  cafe: { yt: '카페 디저트 신메뉴 릴스 쇼츠', ig: '카페추천' },
  beauty: { yt: '미용실 네일샵 릴스 쇼츠', ig: '미용실' },
  realestate: { yt: '부동산 매물 투어 릴스 쇼츠', ig: '부동산' },
  academy: { yt: '학원 공부법 성적 릴스 쇼츠', ig: '공부법' },
  clinic: { yt: '병원 의사 건강 릴스 쇼츠', ig: '건강정보' },
  fitness: { yt: '헬스 필라테스 오운완 릴스 쇼츠', ig: '오운완' },
  shop: { yt: '쇼핑몰 코디 언박싱 릴스 쇼츠', ig: '데일리룩' },
  interior: { yt: '인테리어 룸투어 비포애프터 릴스 쇼츠', ig: '인테리어' }
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

function themeSpecFromTitle(title, indKey, idx, prefix = '📡', fullCaption = '') {
  const t = String(title || '');
  const lower = t.toLowerCase();
  const presets = [
    { layout: 'dim', cap: 'stack', font: 'gasoek', deco: 'grain', trans: 'flash', outro: 'vlogend', grade: 'noir', head: 'kicker', bg: 'dark', accent: '#facc15', accent2: '#ffffff' },
    { layout: 'handheld', cap: 'vsub', font: 'sans', deco: 'camera', trans: 'zoom', outro: 'vlogend', grade: 'warm', head: 'profile', bg: 'dark', accent: '#38bdf8', accent2: '#e0f2fe' },
    { layout: 'split', cap: 'pill', font: 'jua', deco: 'sparkle', trans: 'slide', outro: 'polaroid', grade: 'vivid', head: 'pill', bg: 'dark', accent: '#ec4899', accent2: '#fce7f3' },
    { layout: 'cards', cap: 'checkl', font: 'sans', deco: 'corners', trans: 'slide', outro: 'receipt', grade: 'cool', head: 'counter', bg: 'white', accent: '#2563eb', accent2: '#dbeafe' },
    { layout: 'arch', cap: 'cinema', font: 'serif', deco: 'leak', trans: 'fade', grade: 'film', head: 'kicker', bg: 'paper', accent: '#d97706', accent2: '#fef3c7' },
    { layout: 'duo', cap: 'band', font: 'dohyeon', deco: 'dots', trans: 'wipe', grade: 'vivid', head: 'box', bg: 'dark', accent: '#22c55e', accent2: '#dcfce7' }
  ];
  let chosen = { ...presets[idx % presets.length] };

  if (/비포|애프터|전후|변신|before|after/.test(lower)) {
    chosen = { ...presets[5] };
  } else if (/브이로그|일상|하루|출근|오픈|현장|vlog/.test(lower)) {
    chosen = { ...presets[1] };
  } else if (/꿀팁|방법|체크|정리|루틴|추천|이유|주의|인기/.test(lower)) {
    chosen = { ...presets[3] };
  } else if (/할인|특가|가격|세일|이벤트|무료|문의/.test(lower)) {
    chosen = { layout: 'full', cap: 'band', font: 'impact', deco: 'dots', trans: 'flash', outro: 'ticket', grade: 'vivid', head: 'pill', bg: 'dark', accent: '#ef4444', accent2: '#fde047' };
  } else if (/감성|무드|분위기|야경|카페|예쁜|결감/.test(lower)) {
    chosen = { ...presets[4] };
  } else if (/소리|꼭|절대|실화|충격|레전드/.test(lower)) {
    chosen = { ...presets[0] };
  }

  const cleaned = t
    .replace(/#[^\s#]+/g, '')
    .replace(/@[a-zA-Z0-9._]+/g, '')
    .replace(/\[[^\]]*\]|\([^)]*\)/g, '')
    .replace(/[^\w가-힣\s·!?,.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const shortLabel = (cleaned.slice(0, 12) || '실시간 릴스').trim();
  const shortName = `${prefix} ${(cleaned.slice(0, 11) || '실시간 트렌드').trim()}`;
  const hookCaption = (cleaned.slice(0, 28) || '지금 가장 많이 본 릴스 스타일').trim();
  const tags = (String(fullCaption || t).match(/#[가-힣a-zA-Z0-9_]+/g) || []).slice(0, 5);

  return {
    id: `live_${indKey}_${Date.now().toString(36)}_${idx}`,
    name: shortName,
    label: shortLabel,
    hookCaption,
    hashtags: tags,
    ...chosen
  };
}

async function fetchInstagramApify(hashtag, diag) {
  const token = String(process.env.APIFY_TOKEN || '').trim();
  if (!token) return [];
  const tag = String(hashtag || '').replace(/^#/, '').replace(/\s+/g, '');
  if (!tag) return [];
  const url = `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=24`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashtags: [tag], resultsType: 'reels', resultsLimit: 50 }),
    signal: AbortSignal.timeout(25000)
  });
  if (diag) diag.apifyStatus = r.status;
  if (!r.ok) {
    if (diag) diag.apifyErr = (await r.text().catch(() => '')).slice(0, 180);
    return [];
  }
  const rows = await r.json();
  if (!Array.isArray(rows)) return [];
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentRows = rows.filter((p) => {
    const cap = String(p.caption || '').trim();
    if (cap.length < 4 || cap === '-') return false;
    if (!p.timestamp) return true;
    const ts = Date.parse(p.timestamp);
    return Number.isNaN(ts) || ts >= monthAgo;
  });
  const pool = recentRows.length ? recentRows : rows.filter((p) => String(p.caption || '').trim().length >= 4);
  const scored = pool
    .map((p) => {
      const play = Number(p.videoViewCount || p.videoPlayCount || 0);
      const likes = Number(p.likesCount) > 0 ? Number(p.likesCount) : 0;
      // 한 달 기준 조회수 최우선 정렬 (조회수가 없는 경우에만 좋아요 보조)
      const score = play > 0 ? play * 1000 + likes : likes;
      return { p, play, likes, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map(({ p, play, likes }) => {
    const firstLine = String(p.caption || '').split('\n').map((s) => s.trim()).find((s) => s && s !== '-') || `#${tag} 인기 릴스`;
    const statLabel = play > 0
      ? `인스타 조회 ${play.toLocaleString()}회`
      : likes > 0
        ? `인스타 좋아요 ${likes.toLocaleString()}개`
        : '인스타 릴스';
    return {
      videoId: p.shortCode || p.id || '',
      url: p.url || (p.shortCode ? `https://www.instagram.com/reel/${p.shortCode}/` : 'https://www.instagram.com/'),
      title: firstLine.slice(0, 80),
      fullCaption: String(p.caption || '').slice(0, 300),
      views: statLabel,
      author: p.ownerUsername ? `@${p.ownerUsername}` : 'Instagram',
      platform: 'instagram'
    };
  });
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
  const diag = { hasApify: Boolean(process.env.APIFY_TOKEN) };

  // 1) 운영자 Apify 토큰이 있으면 인스타 릴스 우선 조회
  if (process.env.APIFY_TOKEN) {
    rawVideos = await fetchInstagramApify(igTag, diag).catch((e) => { diag.apifyEx = e?.message; return []; });
    if (rawVideos.length) source = 'instagram_apify';
  }

  // 2) 운영자 Meta Graph API 토큰이 있으면 공식 인스타 해시태그 조회
  if (!rawVideos.length && process.env.IG_ACCESS_TOKEN && process.env.IG_USER_ID) {
    rawVideos = await fetchInstagramGraph(igTag).catch(() => []);
    if (rawVideos.length) source = 'instagram_graph';
  }

  // 3) YouTube Data API (YOUTUBE_API_KEY) — 최근 30일 조회수순
  if (!rawVideos.length && process.env.YOUTUBE_API_KEY) {
    const monthAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&order=viewCount&publishedAfter=${encodeURIComponent(monthAgoIso)}&maxResults=6&regionCode=KR&relevanceLanguage=ko&q=${encodeURIComponent(ytQuery)}&key=${encodeURIComponent(process.env.YOUTUBE_API_KEY)}`;
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
    theme: themeSpecFromTitle(v.title, indKey, idx, prefix, v.fullCaption || '')
  }));
  return { source, query: source.startsWith('instagram') ? `#${igTag}` : ytQuery, items, diag };
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const indKey = String(req.query.industry || 'auto').trim();
  const customQ = String(req.query.q || '').trim();
  const forceRefresh = req.query.refresh === '1';

  try {
    if (req.query.cron === '1') {
      const keys = Object.keys(INDUSTRY_QUERIES);
      const summary = {};
      for (const k of keys) {
        const { source, query, items } = await fetchTrendsForIndustry(k, '');
        if (items.length) await writeTrendCache(k, source, query, items);
        summary[k] = { source, count: items.length };
      }
      return res.status(200).json({ ok: true, updatedAt: new Date().toISOString(), summary });
    }
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

    const { source, query, items, diag } = await fetchTrendsForIndustry(indKey, customQ);
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
      diag,
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
