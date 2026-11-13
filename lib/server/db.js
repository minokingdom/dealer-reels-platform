'use strict';
// Postgres 연결 (Vercel의 Neon/Postgres 연결 주소 DATABASE_URL 사용).
// 첫 요청 때 필요한 표를 자동으로 만듭니다 (이미 있으면 그대로).
const { Pool } = require('pg');

let pool = null;
let migrated = null;

function connectionString(env = process.env) {
  return String(env.DATABASE_URL || env.POSTGRES_URL || '').trim();
}

function getPool() {
  if (pool) return pool;
  const cs = connectionString();
  if (!cs) {
    const e = new Error('DATABASE_URL is not configured');
    e.code = 'DB_NOT_CONFIGURED';
    e.status = 503;
    throw e;
  }
  const local = /localhost|127\.0\.0\.1|host=\/tmp/.test(cs);
  pool = new Pool({
    connectionString: cs,
    max: 3,
    idleTimeoutMillis: 10000,
    ssl: local ? false : { rejectUnauthorized: false }
  });
  return pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS ar_users (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  branch TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT 'auto',
  promo TEXT NOT NULL DEFAULT '',
  session_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ar_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES ar_users(id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'incomplete',
  recurring_id TEXT,
  card_last4 TEXT NOT NULL DEFAULT '',
  card_issuer TEXT NOT NULL DEFAULT '',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  retry_count INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ar_card_registrations (
  track_id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES ar_users(id),
  plan TEXT NOT NULL,
  state_digest TEXT NOT NULL,
  provider_trx_id TEXT,
  status TEXT NOT NULL DEFAULT 'ready',
  failure_code TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ar_payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES ar_users(id),
  subscription_id BIGINT REFERENCES ar_subscriptions(id),
  track_id TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL DEFAULT 'charge',
  plan TEXT NOT NULL,
  amount INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_trx_id TEXT,
  provider_trx_date TEXT,
  result_code TEXT,
  failure_message TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ar_usage (
  subject TEXT NOT NULL,
  period TEXT NOT NULL,
  tts_chars INT NOT NULL DEFAULT 0,
  ai_scripts INT NOT NULL DEFAULT 0,
  exports INT NOT NULL DEFAULT 0,
  PRIMARY KEY (subject, period)
);
CREATE TABLE IF NOT EXISTS ar_notifications (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ar_sns_accounts (
  user_id BIGINT NOT NULL REFERENCES ar_users(id),
  provider TEXT NOT NULL,
  account_id TEXT NOT NULL DEFAULT '',
  account_name TEXT NOT NULL DEFAULT '',
  token_enc TEXT NOT NULL,
  refresh_enc TEXT,
  expires_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider)
);
CREATE TABLE IF NOT EXISTS ar_oauth_states (
  state_digest TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES ar_users(id),
  provider TEXT NOT NULL,
  verifier TEXT,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS ar_publish_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES ar_users(id),
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ar_sub_due_idx ON ar_subscriptions (status, current_period_end);
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS meta JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE ar_publish_jobs ADD COLUMN IF NOT EXISTS title TEXT;
CREATE INDEX IF NOT EXISTS ar_publish_user_idx ON ar_publish_jobs (user_id, created_at);
CREATE INDEX IF NOT EXISTS ar_publish_sched_idx ON ar_publish_jobs (status, scheduled_at);
`;

async function migrate() {
  if (!migrated) {
    migrated = getPool().query(SCHEMA).catch((e) => {
      migrated = null;
      throw e;
    });
  }
  return migrated;
}

async function query(text, params) {
  await migrate();
  return getPool().query(text, params);
}

// 트랜잭션: fn(client) 안에서 client.query 사용
async function tx(fn) {
  await migrate();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw e;
  } finally {
    client.release();
  }
}

// 테스트용: 연결 닫기
async function close() {
  if (pool) await pool.end();
  pool = null;
  migrated = null;
}

module.exports = { query, tx, migrate, close, connectionString };
