/**
 * Vercel Serverless Function: POST /api/publish
 * ----------------------------------------------------------------------------
 * 딜러가 [승인 완료] 버튼을 누르면 선택한 멀티 SNS 채널(Instagram Reels, YouTube Shorts,
 * TikTok, Facebook Reels)로 동시 발행 파이프라인을 실행합니다.
 */
const { publishToMultipleSns } = require('../multi-sns-publisher');

module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      service: 'AutoReels Multi-SNS Publisher API (Vercel Serverless)',
      status: 'READY',
      supportedChannels: ['instagram', 'youtube', 'tiktok', 'facebook']
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const dealer = body.dealer || {
      name: '김민준',
      title: '수석 카마스터',
      branch: '현대·기아 강남오토스퀘어',
      phone: '010-4821-9032',
      promo: '출고고객 전원 루마버텍스 썬팅 + 빌트인캠 무상지원'
    };
    const channels = Array.isArray(body.channels) && body.channels.length > 0
      ? body.channels
      : ['instagram', 'youtube', 'tiktok', 'facebook'];

    const result = await publishToMultipleSns({
      dealer,
      carModelName: body.carModelName || '2026 쏘렌토 하이브리드',
      promoSubtext: body.promoSubtext || '이번 달 계약 안 하면 손해! 11월 비밀 조건',
      videoUrl: body.videoUrl || 'https://cdn.autoreels.kr/staging/sorento_12s.mp4',
      channels,
      dryRun: true
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Multi-SNS publish error'
    });
  }
};
