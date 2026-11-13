'use strict';
// 요금제와 사용량 한도.
// 성우(Fish Audio)는 쓸수록 돈이 나가므로 글자 수로 한도를 둡니다 (한국어 1글자 ≈ 3바이트).
// 한도는 환경변수 PLAN_LIMITS_JSON 으로 바꿀 수 있습니다.

const PLANS = {
  weekly: { key: 'weekly', name: '주간 스타터', amount: 50000, periodDays: 7, label: '7일마다 자동 결제' },
  monthly: { key: 'monthly', name: '월간 PRO', amount: 150000, periodMonths: 1, label: '매달 자동 결제' },
  annual: { key: 'annual', name: '연간 VIP', amount: 1200000, periodMonths: 12, label: '매년 자동 결제' }
};

// 한 달 기준 한도 (연간도 매달 같은 한도로 초기화)
const DEFAULT_LIMITS = {
  // 로그인 안 한 방문자: 하루 기준 (IP 단위)
  anonymous: { ttsCharsDaily: 400, aiScriptsDaily: 3 },
  // 가입했지만 결제 안 한 무료 회원: 한 달 기준
  free: { ttsChars: 2000, aiScripts: 10 },
  weekly: { ttsChars: 30000, aiScripts: 150 },
  monthly: { ttsChars: 120000, aiScripts: 600 },
  annual: { ttsChars: 120000, aiScripts: 600 }
};

function limits(env = process.env) {
  try {
    const override = JSON.parse(env.PLAN_LIMITS_JSON || '{}');
    const out = {};
    for (const k of Object.keys(DEFAULT_LIMITS)) out[k] = { ...DEFAULT_LIMITS[k], ...(override[k] || {}) };
    return out;
  } catch (e) {
    return DEFAULT_LIMITS;
  }
}

function addPeriod(from, plan) {
  const p = PLANS[plan];
  const d = new Date(from.getTime());
  if (!p) throw new Error('unknown plan');
  if (p.periodDays) d.setUTCDate(d.getUTCDate() + p.periodDays);
  else d.setUTCMonth(d.getUTCMonth() + p.periodMonths);
  return d;
}

function publicPlans() {
  return Object.values(PLANS).map((p) => ({ key: p.key, name: p.name, amount: p.amount, label: p.label }));
}

module.exports = { PLANS, limits, addPeriod, publicPlans };
