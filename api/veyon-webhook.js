'use strict';
// POST /api/veyon-webhook — 베이온 카드 결제 알림(노티) 수신
// 베이온 알림에는 서명이 없어서(이츠페이 확인 내용과 같음) 이것만으로 결제 상태를 바꾸지 않습니다.
// 기록만 남기고, 결제 확정은 결제 요청의 응답(승인 결과)으로만 합니다.
const db = require('../lib/server/db');
const { readiness } = require('../lib/server/config');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');
  try {
    if (readiness().db) {
      const payload = typeof req.body === 'object' && req.body ? req.body : { raw: String(req.body || '').slice(0, 20000) };
      await db.query('INSERT INTO ar_notifications (provider, payload) VALUES ($1, $2)', ['veyon', JSON.stringify(payload).slice(0, 50000)]);
    }
  } catch (e) {
    console.error('[veyon-webhook]', e.message);
  }
  // 결제사는 정해진 응답을 기다리므로 항상 성공 응답
  return res.status(200).send('OK');
};
