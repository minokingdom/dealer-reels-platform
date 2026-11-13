'use strict';
// 기존 API(성우·AI 대본)를 감싸서 사용량을 세고 한도를 넘으면 막습니다.
// 처리 중 실패(응답 코드 400 이상)하면 센 사용량을 되돌립니다.
// DB에 문제가 생기면 서비스가 멈추지 않도록 통과시킵니다(로그만 남김).
const { consume, refundUsage } = require('./usage');

function withMeter(handler, kind, unitsOf) {
  return async function metered(req, res) {
    if (req.method === 'OPTIONS') return handler(req, res);
    let units = 0;
    try {
      units = Math.max(0, Math.floor(Number(unitsOf(req)) || 0));
    } catch (e) {
      units = 0;
    }
    let charged = false;
    if (units > 0) {
      try {
        const gate = await consume(req, kind, units);
        if (!gate.ok) {
          res.setHeader('Cache-Control', 'no-store');
          return res.status(gate.status).json(gate.body);
        }
        charged = !gate.skipped;
      } catch (e) {
        console.error('[meter] usage check failed, allowing request:', e.code || '', e.message);
      }
    }
    let finalStatus = 200;
    const origStatus = res.status.bind(res);
    res.status = (code) => {
      finalStatus = code;
      return origStatus(code);
    };
    try {
      await handler(req, res);
    } finally {
      if (charged && finalStatus >= 400) await refundUsage(req, kind, units);
    }
  };
}

module.exports = { withMeter };
