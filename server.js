/**
 * server.js
 * 
 * AutoReels 업종별 숏폼 제작·검수·자동 업로드 플랫폼 로컬 백엔드 서버
 * (초기 자동차 딜러 버전 기준 데모 데이터가 들어 있습니다. 운영 API는 api/ 의 Vercel 함수가 담당합니다.)
 * 외부 패키지 설치 없이 Node.js 기본 내장 모듈(http, fs, path, crypto)만으로 즉시 구동됩니다.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { buildFfmpegCommand } = require('./ffmpeg-compositor');
const { encryptCredential, publishReelViaGraphApi } = require('./instagram-api');

const PORT = process.env.PORT || 4000;

// 인메모리 DB (실제 운영 시 SQLite/PostgreSQL 연동 가능)
const db = {
  dealers: [
    {
      id: 'dlr_1',
      name: '김민준',
      title: '수석 카마스터',
      branch: '현대자동차 강남오토스퀘어',
      phone: '010-4821-9032',
      kakaoUrl: 'open.kakao.com/o/sCarMasterMJ',
      igUsername: '@hyundai_minjun_official',
      igAuthMode: 'GRAPH_API', // 'GRAPH_API' | 'CREDENTIAL_VAULT'
      encryptedPassword: null,
      accentColor: '#3B82F6',
      promoTag: '출고고객 전원 루마버텍스 썬팅 + 빌트인캠 무상지원',
      approvalToken: 'tok_minjun_2026w45',
      approvalStatus: 'PENDING' // 'PENDING' | 'APPROVED_PUBLISHED' | 'REVISION_REQUESTED'
    },
    {
      id: 'dlr_2',
      name: '박서연',
      title: '공식인증 주임',
      branch: 'BMW 코오롱모터스 서초전시장',
      phone: '010-7734-1290',
      kakaoUrl: 'open.kakao.com/o/sBmwSeoyeon',
      igUsername: '@bmw_seoyeon_deal',
      igAuthMode: 'CREDENTIAL_VAULT',
      encryptedPassword: encryptCredential('dealer_pass_demo!'),
      accentColor: '#10B981',
      promoTag: '11월 한정 5시리즈 재고할인 최대 1,150만원 + 즉시출고',
      approvalToken: 'tok_seoyeon_2026w45',
      approvalStatus: 'PENDING'
    },
    {
      id: 'dlr_3',
      name: '이도현',
      title: '대표 팀장',
      branch: '수원 도이치오토월드 인증중고',
      phone: '010-9102-5581',
      kakaoUrl: 'open.kakao.com/o/sSuwonCarDH',
      igUsername: '@dohyun_motors',
      igAuthMode: 'GRAPH_API',
      encryptedPassword: null,
      accentColor: '#F59E0B',
      promoTag: '허위매물 0% · 1년/2만km 엔진미션 보증 · 전액할부 최저금리',
      approvalToken: 'tok_dohyun_2026w45',
      approvalStatus: 'APPROVED_PUBLISHED'
    }
  ],
  weeklyCampaign: {
    weekLabel: '11월 2주차 프로모션 릴스',
    vehicleTitle: '2026 쏘렌토 하이브리드 & BMW 520i 특판',
    hookHeadline: '이번 달 계약 안 하면 무조건 손해! 11월 비밀 프로모션 총정리',
    subHeadline: '재고 딱 4대 한정 · 대기 없이 3일 내 즉시출고',
    discountHighlight: '최대 1,150만 원 혜택 / 월 49만 원대',
    captionTemplate:
      `🔥 {{차종}} 이번 달 프로모션 영혼까지 끌어모았습니다!\n\n` +
      `✔️ 핵심 혜택: {{할인혜택}}\n` +
      `✔️ 딜러 특별 지원: {{딜러특전}}\n\n` +
      `📌 담당: {{소속}} {{이름}} {{직함}}\n` +
      `📞 직통 상담: {{연락처}}\n` +
      `💬 빠른 견적: 프로필 링크({{카카오링크}}) 또는 댓글에 [견적]을 남겨주세요!\n\n` +
      `#신차견적 #즉시출고 #자동차프로모션 #리스렌트 #카마스터`
  }
};

function interpolateCaption(template, campaign, dealer) {
  return template
    .replace(/\{\{차종\}\}/g, campaign.vehicleTitle)
    .replace(/\{\{할인혜택\}\}/g, campaign.discountHighlight)
    .replace(/\{\{딜러특전\}\}/g, dealer.promoTag)
    .replace(/\{\{소속\}\}/g, dealer.branch)
    .replace(/\{\{이름\}\}/g, dealer.name)
    .replace(/\{\{직함\}\}/g, dealer.title)
    .replace(/\{\{연락처\}\}/g, dealer.phone)
    .replace(/\{\{카카오링크\}\}/g, dealer.kakaoUrl);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // 1. 전체 상태 조회 (관리자 & 임시 검수 페이지용)
  if (req.method === 'GET' && url.pathname === '/api/state') {
    const dealersWithPreview = db.dealers.map((d) => ({
      ...d,
      generatedCaption: interpolateCaption(db.weeklyCampaign.captionTemplate, db.weeklyCampaign, d),
      ffmpegCommand: buildFfmpegCommand({
        masterVideoPath: './storage/master_weekly_promo.mp4',
        outroImagePath: `./storage/outro_${d.id}.png`,
        outputPath: `./storage/staging/reel_${d.id}.mp4`,
        dealer: d
      }).cliString
    }));
    return sendJson(res, 200, {
      weeklyCampaign: db.weeklyCampaign,
      dealers: dealersWithPreview
    });
  }

  // 2. 딜러 등록 추가 (아이디/패스워드 암호화 보관 또는 API 연동)
  if (req.method === 'POST' && url.pathname === '/api/dealers') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newDealer = {
          id: `dlr_${Date.now()}`,
          name: data.name,
          title: data.title || '공식 카마스터',
          branch: data.branch,
          phone: data.phone,
          kakaoUrl: data.kakaoUrl || '',
          igUsername: data.igUsername,
          igAuthMode: data.igPassword ? 'CREDENTIAL_VAULT' : 'GRAPH_API',
          encryptedPassword: data.igPassword ? encryptCredential(data.igPassword) : null,
          accentColor: data.accentColor || '#3B82F6',
          promoTag: data.promoTag || '출고 고객 프리미엄 신차패키지 무상 지원',
          approvalToken: `tok_${crypto.randomBytes(4).toString('hex')}`,
          approvalStatus: 'PENDING'
        };
        db.dealers.push(newDealer);
        sendJson(res, 201, { ok: true, dealer: newDealer });
      } catch (e) {
        sendJson(res, 400, { error: e.message });
      }
    });
    return;
  }

  // 3. 딜러 임시서버 검수 승인 -> 인스타그램 자동 업로드 트리거
  if (req.method === 'POST' && url.pathname === '/api/approve') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { dealerId, customCaption } = JSON.parse(body);
        const dealer = db.dealers.find((d) => d.id === dealerId);
        if (!dealer) return sendJson(res, 404, { error: '딜러를 찾을 수 없습니다.' });

        const finalCaption =
          customCaption ||
          interpolateCaption(db.weeklyCampaign.captionTemplate, db.weeklyCampaign, dealer);

        const publishResult = await publishReelViaGraphApi({
          igUserId: dealer.igUsername.replace('@', ''),
          accessToken: 'demo_token',
          videoUrl: `https://staging.dealer-reels.kr/renders/reel_${dealer.id}.mp4`,
          caption: finalCaption
        });

        dealer.approvalStatus = 'APPROVED_PUBLISHED';
        dealer.lastPublishedResult = publishResult;

        sendJson(res, 200, {
          ok: true,
          dealerId: dealer.id,
          approvalStatus: dealer.approvalStatus,
          publishResult
        });
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
    });
    return;
  }

  // 정적 파일 서빙: public/ 아래 파일이 있으면 그대로(스크립트·CSS·사진), 없으면 index.html
  const publicDir = path.join(__dirname, 'public');
  const reqPath = decodeURIComponent(String(req.url || '/').split('?')[0]);
  const filePath = path.normalize(path.join(publicDir, reqPath));
  if (reqPath !== '/' && filePath.startsWith(publicDir + path.sep) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.wasm': 'application/wasm', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }
  // / 와 /intro 는 랜딩(index.html), 나머지 주소는 제작 화면(studio.html) — vercel.json 과 같게
  const indexPath = path.join(publicDir, reqPath === '/' || reqPath === '/intro' ? 'index.html' : 'studio.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404);
  res.end('Not Found');
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[DealerReels] 임시검수 & 자동발행 서버 실행 중: http://localhost:${PORT}`);
  });
}

module.exports = server;
