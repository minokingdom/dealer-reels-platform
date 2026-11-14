'use strict';
// 서버 설정: 환경변수만 읽습니다. 키 값은 절대 응답으로 내보내지 않습니다.
// 무엇이 준비됐는지(true/false)만 화면에 알려 줍니다.

function clean(v) {
  return String(v == null ? '' : v).trim();
}

function siteUrl(env = process.env) {
  return clean(env.SITE_URL) || 'https://autoreels-studio.vercel.app';
}

function veyonConfig(env = process.env) {
  const environment = clean(env.VEYON_ENV).toLowerCase() === 'production' ? 'production' : 'test';
  return {
    environment,
    mid: clean(env.VEYON_MID),
    tid: clean(env.VEYON_TID),
    payKey: clean(env.VEYON_PAY_KEY),
    secretKey: clean(env.VEYON_SECRET_KEY),
    baseUrl: environment === 'production' ? 'https://api.veyon.co.kr' : 'https://tapi.veyon.co.kr',
    officeUrl: environment === 'production' ? 'https://office.veyon.co.kr' : 'https://toffice.veyon.co.kr',
    scriptUrl: environment === 'production'
      ? 'https://api.veyon.co.kr/static/v1/public/veyon.v1.js'
      : 'https://tapi.veyon.co.kr/static/v1/public/veyon.v1.js',
    // 결제를 실제로 열지 말지 운영자가 직접 켜는 스위치 (키를 넣어도 이 값이 true여야 결제가 열림)
    enabled: clean(env.VEYON_PAYMENTS_ENABLED).toLowerCase() === 'true'
  };
}

function readiness(env = process.env) {
  const v = veyonConfig(env);
  const db = Boolean(clean(env.DATABASE_URL) || clean(env.POSTGRES_URL));
  const auth = Buffer.byteLength(clean(env.AUTH_SECRET), 'utf8') >= 32;
  const veyonKeys = Boolean(v.mid && v.payKey && Buffer.byteLength(v.secretKey, 'utf8') === 32);
  return {
    db,
    auth,
    // 회원·구독 서버가 동작하는 조건: DB + 세션 비밀키
    serverMode: db && auth,
    billing: db && auth && veyonKeys && v.enabled,
    veyonKeys,
    veyonEnv: v.environment,
    sns: {
      instagram: Boolean(clean(env.META_APP_ID) && clean(env.META_APP_SECRET)),
      facebook: Boolean(clean(env.META_APP_ID) && clean(env.META_APP_SECRET)),
      youtube: Boolean(clean(env.GOOGLE_CLIENT_ID) && clean(env.GOOGLE_CLIENT_SECRET)),
      tiktok: Boolean(clean(env.TIKTOK_CLIENT_KEY) && clean(env.TIKTOK_CLIENT_SECRET)),
      threads: Boolean(clean(env.THREADS_APP_ID) && clean(env.THREADS_APP_SECRET))
    },
    snsTokenKey: Buffer.byteLength(clean(env.TOKEN_ENC_KEY), 'utf8') >= 32,
    videoStorage: Boolean(clean(env.BLOB_READ_WRITE_TOKEN))
  };
}

module.exports = { clean, siteUrl, veyonConfig, readiness };
