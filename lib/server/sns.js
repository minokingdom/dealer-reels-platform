'use strict';
// SNS 계정 연결(OAuth)과 영상 올리기: 인스타그램·페이스북(메타 한 번 로그인), 유튜브, 틱톡
// - 토큰은 TOKEN_ENC_KEY로 암호화해 DB에 저장하고, 화면에는 계정 이름만 보냅니다.
// - 키가 없는 서비스는 "준비 중"으로만 표시되고 연결 버튼이 열리지 않습니다.
const crypto = require('crypto');
const db = require('./db');
const { clean, siteUrl } = require('./config');

const TARGETS = ['instagram', 'facebook', 'youtube', 'tiktok'];
const PROVIDER_OF = { instagram: 'meta', facebook: 'meta', youtube: 'youtube', tiktok: 'tiktok' };
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

class SnsError extends Error {
  constructor(message, status = 400, code = 'sns_error') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function env(name) {
  return clean(process.env[name]);
}
function graphVer() {
  return env('META_GRAPH_VERSION') || 'v23.0';
}
function redirectUri() {
  return `${siteUrl()}/api/sns`;
}
function providerReady(provider) {
  if (Buffer.byteLength(env('TOKEN_ENC_KEY'), 'utf8') < 32) return false;
  if (provider === 'meta') return Boolean(env('META_APP_ID') && env('META_APP_SECRET'));
  if (provider === 'youtube') return Boolean(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET'));
  if (provider === 'tiktok') return Boolean(env('TIKTOK_CLIENT_KEY') && env('TIKTOK_CLIENT_SECRET'));
  return false;
}

// ---------- 토큰 암호화 (AES-256-GCM) ----------
function encKey() {
  const k = env('TOKEN_ENC_KEY');
  if (Buffer.byteLength(k, 'utf8') < 32) throw new SnsError('SNS 연결이 아직 준비되지 않았습니다.', 503, 'not_ready');
  return crypto.createHash('sha256').update(k).digest();
}
function seal(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', encKey(), iv);
  const ct = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64');
}
function unseal(s) {
  const b = Buffer.from(String(s || ''), 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', encKey(), b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'));
}
function digest(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}
function b64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------- HTTP ----------
async function call(url, opts = {}, timeoutMs = 25000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, { ...opts, signal: ac.signal });
  } catch (e) {
    throw new SnsError(`서비스에 연결하지 못했습니다 (${e.name === 'AbortError' ? '시간 초과' : '네트워크'})`, 502, 'network');
  } finally {
    clearTimeout(t);
  }
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text.slice(0, 300) }; }
  if (!res.ok) {
    const msg = (data.error && (data.error.message || data.error.error_user_msg || data.error_description || data.error)) ||
      data.error_description || data.message || `HTTP ${res.status}`;
    throw new SnsError(typeof msg === 'string' ? msg.slice(0, 300) : `HTTP ${res.status}`, 502, 'provider');
  }
  return { data, headers: res.headers, status: res.status };
}
function form(obj) {
  return new URLSearchParams(Object.entries(obj).filter(([, v]) => v != null && v !== '')).toString();
}
const FORM = { 'Content-Type': 'application/x-www-form-urlencoded' };

// ---------- 연결 시작 / 콜백 ----------
async function startAuth(user, target) {
  const provider = PROVIDER_OF[target] || target;
  if (!['meta', 'youtube', 'tiktok'].includes(provider)) throw new SnsError('지원하지 않는 서비스입니다.');
  if (!providerReady(provider)) throw new SnsError('이 SNS 연결은 아직 준비 중입니다.', 503, 'not_ready');
  const state = b64url(crypto.randomBytes(24));
  const verifier = provider === 'youtube' ? b64url(crypto.randomBytes(48)) : null;
  await db.query('DELETE FROM ar_oauth_states WHERE expires_at < now()');
  await db.query(
    `INSERT INTO ar_oauth_states (state_digest, user_id, provider, verifier, expires_at) VALUES ($1, $2, $3, $4, now() + interval '10 minutes')`,
    [digest(state), user.id, provider, verifier]
  );
  const redirect = redirectUri();
  if (provider === 'meta') {
    const scope = ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'business_management',
      'instagram_basic', 'instagram_content_publish', 'publish_video'].join(',');
    return `https://www.facebook.com/${graphVer()}/dialog/oauth?` + form({ client_id: env('META_APP_ID'), redirect_uri: redirect, state, scope, response_type: 'code' });
  }
  if (provider === 'youtube') {
    const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
    return 'https://accounts.google.com/o/oauth2/v2/auth?' + form({
      client_id: env('GOOGLE_CLIENT_ID'), redirect_uri: redirect, response_type: 'code', state,
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true',
      code_challenge: challenge, code_challenge_method: 'S256'
    });
  }
  return 'https://www.tiktok.com/v2/auth/authorize/?' + form({
    client_key: env('TIKTOK_CLIENT_KEY'), redirect_uri: redirect, response_type: 'code', state,
    scope: 'user.info.basic,video.upload'
  });
}

async function saveAccount(userId, provider, account) {
  await db.query(
    `INSERT INTO ar_sns_accounts (user_id, provider, account_id, account_name, token_enc, refresh_enc, expires_at, meta, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
     ON CONFLICT (user_id, provider) DO UPDATE SET account_id = EXCLUDED.account_id, account_name = EXCLUDED.account_name,
       token_enc = EXCLUDED.token_enc, refresh_enc = COALESCE(EXCLUDED.refresh_enc, ar_sns_accounts.refresh_enc),
       expires_at = EXCLUDED.expires_at, meta = EXCLUDED.meta, updated_at = now()`,
    [userId, provider, String(account.id || ''), String(account.name || '').slice(0, 120), seal(account.token),
      account.refresh ? seal({ r: account.refresh }) : null, account.expiresAt || null, JSON.stringify(account.meta || {})]
  );
}

function pickPage(pages, wantId) {
  return pages.find((p) => p.id === wantId) || pages.find((p) => p.ig) || pages[0] || null;
}

async function finishAuth(state, code) {
  if (!state || !code) throw new SnsError('연결 정보가 올바르지 않습니다.');
  const r = await db.query('DELETE FROM ar_oauth_states WHERE state_digest = $1 AND expires_at > now() RETURNING user_id, provider, verifier', [digest(state)]);
  const st = r.rows[0];
  if (!st) throw new SnsError('연결 시간이 지났습니다. 다시 시도해 주세요.', 400, 'state');
  const redirect = redirectUri();
  const userId = st.user_id;

  if (st.provider === 'meta') {
    const ver = graphVer();
    const short = await call(`https://graph.facebook.com/${ver}/oauth/access_token?` + form({
      client_id: env('META_APP_ID'), client_secret: env('META_APP_SECRET'), redirect_uri: redirect, code
    }));
    const long = await call(`https://graph.facebook.com/${ver}/oauth/access_token?` + form({
      grant_type: 'fb_exchange_token', client_id: env('META_APP_ID'), client_secret: env('META_APP_SECRET'), fb_exchange_token: short.data.access_token
    }));
    const userToken = long.data.access_token || short.data.access_token;
    const acc = await call(`https://graph.facebook.com/${ver}/me/accounts?` + form({
      fields: 'id,name,access_token,instagram_business_account{id,username}', limit: '50', access_token: userToken
    }));
    const pages = (acc.data.data || []).map((p) => ({
      id: String(p.id), name: String(p.name || ''), token: p.access_token,
      ig: p.instagram_business_account ? { id: String(p.instagram_business_account.id), username: String(p.instagram_business_account.username || '') } : null
    }));
    if (!pages.length) throw new SnsError('연결할 페이스북 페이지가 없습니다. 인스타그램은 프로페셔널 계정을 페이스북 페이지에 연결해야 올릴 수 있습니다.', 400, 'no_page');
    const sel = pickPage(pages);
    await saveAccount(userId, 'meta', {
      id: sel.id, name: sel.name, token: { userToken, pages },
      meta: { page: sel.id, pages: pages.map((p) => ({ id: p.id, name: p.name, ig: p.ig })) }
    });
    return { userId, provider: 'meta' };
  }

  if (st.provider === 'youtube') {
    const tok = await call('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: FORM,
      body: form({ code, client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'), redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: st.verifier })
    });
    const access = tok.data.access_token;
    let name = '';
    let id = '';
    try {
      const ch = await call('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', { headers: { Authorization: `Bearer ${access}` } });
      const c = (ch.data.items || [])[0];
      if (c) { id = c.id; name = c.snippet && c.snippet.title; }
    } catch (e) {}
    await saveAccount(userId, 'youtube', {
      id, name: name || '유튜브 채널', token: { access }, refresh: tok.data.refresh_token,
      expiresAt: new Date(Date.now() + (Number(tok.data.expires_in) || 3600) * 1000)
    });
    return { userId, provider: 'youtube' };
  }

  // tiktok
  const tok = await call('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST', headers: FORM,
    body: form({ client_key: env('TIKTOK_CLIENT_KEY'), client_secret: env('TIKTOK_CLIENT_SECRET'), code, grant_type: 'authorization_code', redirect_uri: redirect })
  });
  if (tok.data.error) throw new SnsError(String(tok.data.error_description || tok.data.error), 502, 'provider');
  const access = tok.data.access_token;
  let name = '';
  try {
    const u = await call('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name', { headers: { Authorization: `Bearer ${access}` } });
    name = u.data.data && u.data.data.user && u.data.data.user.display_name;
  } catch (e) {}
  await saveAccount(userId, 'tiktok', {
    id: tok.data.open_id, name: name || '틱톡 계정', token: { access }, refresh: tok.data.refresh_token,
    expiresAt: new Date(Date.now() + (Number(tok.data.expires_in) || 86400) * 1000)
  });
  return { userId, provider: 'tiktok' };
}

// ---------- 연결 상태 ----------
async function status(user) {
  const r = await db.query('SELECT provider, account_name, meta, updated_at FROM ar_sns_accounts WHERE user_id = $1', [user.id]);
  const rows = Object.fromEntries(r.rows.map((x) => [x.provider, x]));
  const meta = rows.meta;
  const pages = meta ? (meta.meta.pages || []) : [];
  const page = meta ? pages.find((p) => p.id === meta.meta.page) || null : null;
  return {
    targets: {
      instagram: { ready: providerReady('meta'), connected: Boolean(page && page.ig), name: page && page.ig ? `@${page.ig.username}` : '',
        note: meta && !(page && page.ig) ? '선택한 페이지에 인스타그램 프로페셔널 계정이 연결되어 있지 않습니다' : '' },
      facebook: { ready: providerReady('meta'), connected: Boolean(page), name: page ? page.name : '' },
      youtube: { ready: providerReady('youtube'), connected: Boolean(rows.youtube), name: rows.youtube ? rows.youtube.account_name : '' },
      tiktok: { ready: providerReady('tiktok'), connected: Boolean(rows.tiktok), name: rows.tiktok ? rows.tiktok.account_name : '' }
    },
    pages: pages.map((p) => ({ id: p.id, name: p.name, ig: p.ig ? p.ig.username : '' })),
    page: page ? page.id : '',
    storage: Boolean(env('BLOB_READ_WRITE_TOKEN'))
  };
}

async function disconnect(user, target) {
  const provider = PROVIDER_OF[target] || target;
  await db.query('DELETE FROM ar_sns_accounts WHERE user_id = $1 AND provider = $2', [user.id, provider]);
}

async function selectPage(user, pageId) {
  const r = await db.query("SELECT meta FROM ar_sns_accounts WHERE user_id = $1 AND provider = 'meta'", [user.id]);
  if (!r.rows[0]) throw new SnsError('먼저 메타(인스타그램·페이스북)를 연결해 주세요.');
  const m = r.rows[0].meta || {};
  const p = (m.pages || []).find((x) => x.id === String(pageId));
  if (!p) throw new SnsError('페이지를 찾지 못했습니다.');
  m.page = p.id;
  await db.query("UPDATE ar_sns_accounts SET meta = $2, account_id = $3, account_name = $4, updated_at = now() WHERE user_id = $1 AND provider = 'meta'",
    [user.id, JSON.stringify(m), p.id, p.name]);
}

// 저장된 토큰 꺼내기 (만료되면 새로 받기)
async function access(user, provider) {
  const r = await db.query('SELECT * FROM ar_sns_accounts WHERE user_id = $1 AND provider = $2', [user.id, provider]);
  const row = r.rows[0];
  if (!row) throw new SnsError('계정이 연결되어 있지 않습니다.', 400, 'not_connected');
  const tok = unseal(row.token_enc);
  if (provider === 'meta') {
    const page = (tok.pages || []).find((p) => p.id === (row.meta || {}).page) || pickPage(tok.pages || []);
    if (!page) throw new SnsError('페이스북 페이지를 다시 연결해 주세요.', 400, 'not_connected');
    return { page };
  }
  const expired = !row.expires_at || new Date(row.expires_at).getTime() < Date.now() + 60000;
  if (!expired) return { token: tok.access };
  const refresh = row.refresh_enc ? unseal(row.refresh_enc).r : '';
  if (!refresh) throw new SnsError('계정 연결이 만료되었습니다. 다시 연결해 주세요.', 400, 'expired');
  let fresh;
  if (provider === 'youtube') {
    fresh = await call('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: FORM,
      body: form({ client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'), refresh_token: refresh, grant_type: 'refresh_token' })
    });
  } else {
    fresh = await call('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST', headers: FORM,
      body: form({ client_key: env('TIKTOK_CLIENT_KEY'), client_secret: env('TIKTOK_CLIENT_SECRET'), refresh_token: refresh, grant_type: 'refresh_token' })
    });
  }
  const accessToken = fresh.data.access_token;
  if (!accessToken) throw new SnsError('계정 연결이 만료되었습니다. 다시 연결해 주세요.', 400, 'expired');
  await db.query('UPDATE ar_sns_accounts SET token_enc = $3, refresh_enc = COALESCE($4, refresh_enc), expires_at = $5, updated_at = now() WHERE user_id = $1 AND provider = $2', [
    user.id, provider, seal({ access: accessToken }), fresh.data.refresh_token ? seal({ r: fresh.data.refresh_token }) : null,
    new Date(Date.now() + (Number(fresh.data.expires_in) || 3600) * 1000)
  ]);
  return { token: accessToken };
}

// ---------- 영상 올리기 ----------
function checkVideoUrl(u) {
  let url;
  try { url = new URL(String(u || '')); } catch (e) { throw new SnsError('영상 주소가 올바르지 않습니다.'); }
  if (url.protocol !== 'https:' || !/\.public\.blob\.vercel-storage\.com$/.test(url.hostname)) {
    throw new SnsError('영상은 이 서비스 저장소에 올린 파일만 발행할 수 있습니다.');
  }
  return url.toString();
}

async function downloadVideo(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 30000);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) throw new SnsError('저장된 영상을 읽지 못했습니다.', 502, 'storage');
    const len = Number(res.headers.get('content-length') || 0);
    if (len > MAX_VIDEO_BYTES) throw new SnsError('영상 파일이 너무 큽니다 (200MB 이하).');
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_VIDEO_BYTES) throw new SnsError('영상 파일이 너무 큽니다 (200MB 이하).');
    return { buf, type: (res.headers.get('content-type') || 'video/mp4').split(';')[0] };
  } catch (e) {
    if (e instanceof SnsError) throw e;
    throw new SnsError('저장된 영상을 읽지 못했습니다.', 502, 'storage');
  } finally {
    clearTimeout(t);
  }
}

async function publishInstagram(user, job) {
  const { page } = await access(user, 'meta');
  if (!page.ig) throw new SnsError('인스타그램 프로페셔널 계정이 연결된 페이지가 아닙니다.');
  const r = await call(`https://graph.facebook.com/${graphVer()}/${page.ig.id}/media`, {
    method: 'POST', headers: FORM,
    body: form({ media_type: 'REELS', video_url: job.videoUrl, caption: job.caption, share_to_feed: 'true', access_token: page.token })
  });
  return { status: 'processing', meta: { container: r.data.id, ig: page.ig.id } };
}

async function publishFacebook(user, job) {
  const { page } = await access(user, 'meta');
  const base = `https://graph.facebook.com/${graphVer()}/${page.id}/video_reels`;
  const start = await call(base, { method: 'POST', headers: FORM, body: form({ upload_phase: 'start', access_token: page.token }) });
  const videoId = start.data.video_id;
  await call(start.data.upload_url || `https://rupload.facebook.com/video-upload/${graphVer()}/${videoId}`, {
    method: 'POST', headers: { Authorization: `OAuth ${page.token}`, file_url: job.videoUrl }
  });
  await call(base, {
    method: 'POST', headers: FORM,
    body: form({ upload_phase: 'finish', video_id: videoId, video_state: 'PUBLISHED', description: job.caption, access_token: page.token })
  });
  return { status: 'processing', remoteId: videoId, meta: { video: videoId } };
}

async function publishYoutube(user, job, video) {
  const { token } = await access(user, 'youtube');
  const title = String(job.title || '').slice(0, 95) || '새 영상';
  const init = await call('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': video.type, 'X-Upload-Content-Length': String(video.buf.length)
    },
    body: JSON.stringify({
      snippet: { title: `${title} #Shorts`.slice(0, 100), description: String(job.caption || '').slice(0, 4900), categoryId: '22' },
      status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
    })
  });
  const loc = init.headers.get('location');
  if (!loc) throw new SnsError('유튜브 업로드 주소를 받지 못했습니다.', 502, 'provider');
  const up = await call(loc, { method: 'PUT', headers: { 'Content-Type': video.type, 'Content-Length': String(video.buf.length) }, body: video.buf }, 50000);
  const id = up.data.id;
  return { status: 'done', remoteId: id, url: id ? `https://youtube.com/shorts/${id}` : '' };
}

async function publishTiktok(user, job, video) {
  const { token } = await access(user, 'tiktok');
  const size = video.buf.length;
  if (size > 64 * 1024 * 1024) throw new SnsError('틱톡에는 64MB 이하 영상만 올릴 수 있습니다.');
  const init = await call('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ source_info: { source: 'FILE_UPLOAD', video_size: size, chunk_size: size, total_chunk_count: 1 } })
  });
  const d = init.data.data || {};
  if (!d.upload_url) throw new SnsError((init.data.error && init.data.error.message) || '틱톡 업로드를 시작하지 못했습니다.', 502, 'provider');
  await call(d.upload_url, {
    method: 'PUT', headers: { 'Content-Type': video.type, 'Content-Length': String(size), 'Content-Range': `bytes 0-${size - 1}/${size}` }, body: video.buf
  }, 50000);
  return { status: 'processing', remoteId: d.publish_id, meta: { publish: d.publish_id } };
}

async function startPublish(user, body) {
  const targets = (Array.isArray(body.targets) ? body.targets : []).filter((t) => TARGETS.includes(t));
  if (!targets.length) throw new SnsError('발행할 SNS를 골라 주세요.');
  const job = {
    videoUrl: checkVideoUrl(body.videoUrl),
    caption: String(body.caption || '').slice(0, 2100),
    title: String(body.title || '').slice(0, 95)
  };
  let video = null;
  const needBytes = targets.some((t) => t === 'youtube' || t === 'tiktok');
  const out = [];
  for (const t of targets) {
    const ins = await db.query('INSERT INTO ar_publish_jobs (user_id, provider, status, video_url) VALUES ($1, $2, $3, $4) RETURNING id', [user.id, t, 'pending', job.videoUrl]);
    const id = ins.rows[0].id;
    let result;
    try {
      if (needBytes && !video && (t === 'youtube' || t === 'tiktok')) video = await downloadVideo(job.videoUrl);
      if (t === 'instagram') result = await publishInstagram(user, job);
      else if (t === 'facebook') result = await publishFacebook(user, job);
      else if (t === 'youtube') result = await publishYoutube(user, job, video);
      else result = await publishTiktok(user, job, video);
    } catch (e) {
      result = { status: 'failed', error: e.message || '발행 실패' };
    }
    await db.query('UPDATE ar_publish_jobs SET status = $2, remote_id = $3, error = $4, url = $5, meta = $6, updated_at = now() WHERE id = $1',
      [id, result.status, result.remoteId || null, result.error || null, result.url || null, JSON.stringify(result.meta || {})]);
    out.push({ id: String(id), target: t, status: result.status, url: result.url || '', error: result.error || '' });
  }
  return out;
}

// 처리 중인 발행 확인 (인스타그램은 처리가 끝나야 게시)
async function checkJob(user, row) {
  const m = row.meta || {};
  if (row.provider === 'instagram') {
    const { page } = await access(user, 'meta');
    const st = await call(`https://graph.facebook.com/${graphVer()}/${m.container}?` + form({ fields: 'status_code,status', access_token: page.token }));
    if (st.data.status_code === 'ERROR' || st.data.status_code === 'EXPIRED') return { status: 'failed', error: String(st.data.status || '인스타그램 영상 처리 실패').slice(0, 300) };
    if (st.data.status_code !== 'FINISHED') return { status: 'processing' };
    const pub = await call(`https://graph.facebook.com/${graphVer()}/${m.ig}/media_publish`, {
      method: 'POST', headers: FORM, body: form({ creation_id: m.container, access_token: page.token })
    });
    let url = '';
    try {
      const md = await call(`https://graph.facebook.com/${graphVer()}/${pub.data.id}?` + form({ fields: 'permalink', access_token: page.token }));
      url = md.data.permalink || '';
    } catch (e) {}
    return { status: 'done', remoteId: pub.data.id, url };
  }
  if (row.provider === 'facebook') {
    const { page } = await access(user, 'meta');
    const st = await call(`https://graph.facebook.com/${graphVer()}/${m.video}?` + form({ fields: 'status,permalink_url', access_token: page.token }));
    const vs = st.data.status || {};
    if (vs.video_status === 'error') return { status: 'failed', error: '페이스북 영상 처리 실패' };
    if (vs.video_status === 'ready' || (vs.publishing_phase && vs.publishing_phase.status === 'complete')) {
      const link = st.data.permalink_url || '';
      return { status: 'done', url: link ? (link.startsWith('http') ? link : `https://www.facebook.com${link}`) : '' };
    }
    return { status: 'processing' };
  }
  if (row.provider === 'tiktok') {
    const { token } = await access(user, 'tiktok');
    const st = await call('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ publish_id: m.publish })
    });
    const s = (st.data.data || {}).status;
    if (s === 'FAILED') return { status: 'failed', error: String((st.data.data || {}).fail_reason || '틱톡 업로드 실패') };
    if (s === 'SEND_TO_USER_INBOX') return { status: 'done', note: '틱톡 앱 알림함에서 게시를 마무리해 주세요' };
    if (s === 'PUBLISH_COMPLETE') return { status: 'done' };
    return { status: 'processing' };
  }
  return { status: row.status };
}

async function jobStatus(user, ids) {
  const list = (Array.isArray(ids) ? ids : []).map((x) => String(x)).filter((x) => /^\d+$/.test(x)).slice(0, 8);
  if (!list.length) return [];
  const r = await db.query('SELECT * FROM ar_publish_jobs WHERE user_id = $1 AND id = ANY($2::bigint[])', [user.id, list]);
  const out = [];
  for (const row of r.rows) {
    let cur = { status: row.status, url: row.url, error: row.error };
    if (row.status === 'processing') {
      try {
        const next = await checkJob(user, row);
        cur = { ...cur, ...next };
        const stale = Date.now() - new Date(row.created_at).getTime() > 30 * 60 * 1000;
        if (cur.status === 'processing' && stale) cur = { status: 'failed', error: '처리 시간이 너무 오래 걸려 중단했습니다' };
        if (cur.status !== 'processing' || next.remoteId) {
          await db.query('UPDATE ar_publish_jobs SET status = $2, remote_id = COALESCE($3, remote_id), url = COALESCE($4, url), error = $5, updated_at = now() WHERE id = $1',
            [row.id, cur.status, next.remoteId || null, cur.url || null, cur.error || null]);
        }
      } catch (e) {
        cur.note = e.message;
      }
    }
    out.push({ id: String(row.id), target: row.provider, status: cur.status, url: cur.url || '', error: cur.error || '', note: cur.note || '' });
  }
  return out;
}

// 브라우저가 영상 파일을 저장소에 바로 올릴 수 있게 하는 1회용 업로드 권한
async function uploadToken(user, body) {
  const rw = env('BLOB_READ_WRITE_TOKEN');
  if (!rw) throw new SnsError('영상 저장소가 아직 준비되지 않았습니다.', 503, 'not_ready');
  const type = String(body.type || 'video/mp4').split(';')[0];
  if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(type)) throw new SnsError('mp4 영상만 올릴 수 있습니다.');
  const size = Number(body.size) || 0;
  if (size <= 0 || size > MAX_VIDEO_BYTES) throw new SnsError('영상 파일 크기가 올바르지 않습니다 (200MB 이하).');
  const ext = type === 'video/webm' ? 'webm' : type === 'video/quicktime' ? 'mov' : 'mp4';
  const pathname = `publish/${user.id}/${Date.now().toString(36)}-${b64url(crypto.randomBytes(6))}.${ext}`;
  const { generateClientTokenFromReadWriteToken } = require('@vercel/blob/client');
  const clientToken = await generateClientTokenFromReadWriteToken({
    token: rw, pathname, allowedContentTypes: [type], maximumSizeInBytes: Math.min(MAX_VIDEO_BYTES, size + 1024),
    validUntil: Date.now() + 15 * 60 * 1000, ttlDays: 3
  });
  return { pathname, clientToken, contentType: type };
}

module.exports = { TARGETS, SnsError, providerReady, startAuth, finishAuth, status, disconnect, selectPage, startPublish, jobStatus, uploadToken, seal, unseal, redirectUri };
