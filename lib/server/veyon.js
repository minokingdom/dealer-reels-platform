'use strict';
// 베이온(Veyon) 정기결제 클라이언트 — 이츠페이(D:\Avicx\eatspay\lib\veyon-client.js)와 같은 요청 형식.
//  1) /api/recurring/ready      카드 등록창 준비 → payUrl, trxId
//  2) /api/approve/recurring    등록된 카드(recurringId)로 결제
//  3) /api/refund               결제 취소
//  4) office /v2/api/bill/list  등록 카드가 정말 이 회원 것인지 서버에서 확인
const crypto = require('node:crypto');
const { veyonConfig } = require('./config');

class VeyonError extends Error {
  constructor(code, message, status = 502, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function clean(v) {
  return String(v == null ? '' : v).trim();
}

function endpoints(cfg) {
  // 테스트 모드에서만 가짜 베이온 서버 주소로 바꿀 수 있음 (자동 테스트용)
  const override = cfg.environment === 'test' ? clean(process.env.VEYON_TEST_OVERRIDE_URL) : '';
  return {
    api: override || cfg.baseUrl,
    office: override || cfg.officeUrl
  };
}

function createVeyon(fetchImpl = globalThis.fetch) {
  const cfg = veyonConfig();
  const ep = endpoints(cfg);

  async function request(path, body, code, message) {
    if (!cfg.payKey) throw new VeyonError('VEYON_NOT_CONFIGURED', '결제 설정이 아직 준비되지 않았습니다.', 503);
    let response;
    try {
      response = await fetchImpl(`${ep.api}${path}`, {
        method: 'POST',
        headers: { Authorization: cfg.payKey, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
      });
    } catch (e) {
      // 응답을 못 받음 = 결제가 됐는지 알 수 없음 (자동 재시도 금지)
      throw new VeyonError('VEYON_NETWORK_UNKNOWN', '결제사와 통신이 끊겼습니다.', 502, { unknown: true });
    }
    const payload = await response.json().catch(() => ({}));
    const resultCd = clean(payload && payload.result && payload.result.resultCd);
    const resultMsg = clean(payload && payload.result && payload.result.resultMsg);
    if (!response.ok) {
      throw new VeyonError(code, message, response.status >= 500 ? 502 : 409, { resultCd, resultMsg, httpStatus: response.status, unknown: response.status >= 500 });
    }
    return { payload, resultCd, resultMsg };
  }

  async function readyRecurring({ trackId, returnUrl, payerId, payerName, payerEmail, payerTel }) {
    const ready = { trackId: clean(trackId), payMethod: 'recurring' };
    for (const [k, v] of Object.entries({ returnUrl, payerId, payerName, payerEmail, payerTel })) {
      if (clean(v)) ready[k] = clean(v);
    }
    const { payload, resultCd, resultMsg } = await request('/api/recurring/ready', { ready }, 'VEYON_READY_FAILED', '카드 등록창을 준비하지 못했습니다.');
    if (resultCd !== '0000') throw new VeyonError('VEYON_READY_FAILED', resultMsg || '카드 등록창을 준비하지 못했습니다.', 409, { resultCd });
    const link = payload.link || {};
    if (!clean(link.payUrl) || !clean(link.trxId)) throw new VeyonError('VEYON_READY_LINK_MISSING', '카드 등록 링크를 받지 못했습니다.', 502);
    return { payUrl: clean(link.payUrl), trxId: clean(link.trxId), trackId: clean(link.trackId) };
  }

  // 결과: { approved: true, trxId, trxDate } | { approved: false, resultCd, message } | throw (unknown)
  async function chargeRecurring({ recurringId, trackId, amount, productName }) {
    const pay = {
      recurringId: clean(recurringId),
      trackId: clean(trackId),
      amount: Number(amount),
      card: { installment: 0 },
      products: [{ name: clean(productName) || 'AutoReels 구독', qty: 1, price: Number(amount) }]
    };
    let out;
    try {
      out = await request('/api/approve/recurring', { pay }, 'VEYON_CHARGE_FAILED', '카드 결제에 실패했습니다.');
    } catch (e) {
      if (e.details && !e.details.unknown && e.details.resultCd) {
        return { approved: false, resultCd: e.details.resultCd, message: e.details.resultMsg || e.message };
      }
      throw e;
    }
    if (out.resultCd !== '0000') return { approved: false, resultCd: out.resultCd, message: out.resultMsg || '카드 결제가 승인되지 않았습니다.' };
    const p = out.payload.pay || {};
    return {
      approved: true,
      trxId: clean(p.trxId || (p.authInfo && p.authInfo.trxId)),
      trxDate: clean(p.trxDate || p.trxDay || (p.authInfo && p.authInfo.trxDate)).replace(/\D/g, '').slice(0, 8),
      raw: p
    };
  }

  async function refund({ trackId, rootTrxId, rootTrackId, rootTrxDate, amount, reason }) {
    const body = {
      refund: {
        trackId: clean(trackId),
        rootTrxId: clean(rootTrxId),
        rootTrackId: clean(rootTrackId),
        rootTrxDay: clean(rootTrxDate),
        amount: Number(amount),
        metadata: { reason: clean(reason) || '사용자취소' }
      }
    };
    const { payload, resultCd, resultMsg } = await request('/api/refund', body, 'VEYON_REFUND_FAILED', '결제 취소에 실패했습니다.');
    if (resultCd !== '0000') throw new VeyonError('VEYON_REFUND_FAILED', resultMsg || '결제 취소에 실패했습니다.', 409, { resultCd });
    return payload.refund || {};
  }

  // 이 회원(payerId) 이름으로 등록된 사용 중 카드 목록에 recurringId가 있는지 확인
  async function verifyCardOwnership({ payerId, recurringId }) {
    if (!cfg.payKey || Buffer.byteLength(cfg.secretKey, 'utf8') !== 32) {
      throw new VeyonError('VEYON_VERIFY_UNAVAILABLE', '카드 확인 설정이 없습니다.', 503);
    }
    const trackId = `AR-CL-${crypto.randomUUID()}`;
    const reqBody = { trackId, payerId: String(payerId), payerTel: '', pageNo: 1, pageSize: 100 };
    const signature = crypto.createHmac('sha256', cfg.secretKey)
      .update(`trackId=${trackId}&payerId=${payerId}&payerTel=&pageNo=1&pageSize=100`).digest('hex');
    let payload;
    try {
      const r = await fetchImpl(`${ep.office}/v2/api/bill/list`, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
        headers: { Authorization: cfg.payKey, 'Content-Type': 'application/json', 'X-Signature': signature },
        body: JSON.stringify(reqBody)
      });
      if (!r.ok) throw new Error('http ' + r.status);
      payload = await r.json();
    } catch (e) {
      throw new VeyonError('VEYON_VERIFY_FAILED', '등록한 카드를 확인하지 못했습니다.', 502);
    }
    if (!payload || payload.resultCode !== '0000' || payload.trackId !== trackId || !Array.isArray(payload.list)) {
      throw new VeyonError('VEYON_VERIFY_FAILED', '등록한 카드를 확인하지 못했습니다.', 502);
    }
    const owned = payload.list
      .filter((p) => String(p.payerId) === String(payerId) && p.payerStatus === '사용')
      .flatMap((p) => (Array.isArray(p.cards) ? p.cards : []))
      .find((c) => c.recurringId === recurringId && c.cardStatus === '사용');
    if (!owned) throw new VeyonError('VEYON_CARD_NOT_OWNED', '카드 소유 확인에 실패했습니다.', 409);
    return { issuer: clean(owned.brand).slice(0, 60) };
  }

  return { cfg, readyRecurring, chargeRecurring, refund, verifyCardOwnership };
}

module.exports = { createVeyon, VeyonError };
