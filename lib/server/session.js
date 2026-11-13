'use strict';
// 로그인 세션: 서명한 쿠키(HttpOnly) + 비밀번호 해시(scrypt).
const crypto = require('node:crypto');

const COOKIE = 'ar_session';
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30일

function secret() {
  const s = String(process.env.AUTH_SECRET || '');
  if (Buffer.byteLength(s, 'utf8') < 32) {
    const e = new Error('AUTH_SECRET must be at least 32 bytes');
    e.code = 'AUTH_NOT_CONFIGURED';
    e.status = 503;
    throw e;
  }
  return s;
}

function b64(buf) {
  return Buffer.from(buf).toString('base64url');
}

function sign(payload) {
  const body = b64(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  const expect = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(mac || '');
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!p || typeof p.uid !== 'string' || !(p.exp > Date.now() / 1000)) return null;
    return p;
  } catch (e) {
    return null;
  }
}

function parseCookies(req) {
  const out = {};
  String((req.headers && req.headers.cookie) || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function isSecure(req) {
  const proto = String((req.headers && req.headers['x-forwarded-proto']) || '');
  return proto === 'https' || process.env.VERCEL === '1';
}

function setSession(req, res, user) {
  const token = sign({ uid: String(user.id), v: user.session_version || 1, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC });
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${isSecure(req) ? '; Secure' : ''}`);
}

function clearSession(req, res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure(req) ? '; Secure' : ''}`);
}

function readSession(req) {
  try {
    return verify(parseCookies(req)[COOKIE]);
  } catch (e) {
    return null;
  }
}

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(String(pw), salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

function checkPassword(pw, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'base64');
  const expect = Buffer.from(parts[2], 'base64');
  const key = crypto.scryptSync(String(pw), salt, expect.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(key, expect);
}

// 같은 사이트에서 온 요청인지 (다른 사이트가 몰래 로그인 쿠키로 결제 요청하는 것을 막음)
function sameOrigin(req) {
  const host = String((req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '');
  const origin = String((req.headers && req.headers.origin) || '');
  if (!origin) return true; // 같은 사이트 fetch 중 일부는 Origin이 없음
  try {
    return new URL(origin).host === host;
  } catch (e) {
    return false;
  }
}

module.exports = { setSession, clearSession, readSession, hashPassword, checkPassword, sameOrigin, parseCookies };
