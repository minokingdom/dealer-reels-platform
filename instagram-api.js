/**
 * instagram-api.js
 * 
 * 임시서버에서 사용자(업종별 담당자)가 [승인] 버튼을 눌렀을 때 인스타그램 릴스를 자동 업로드하는 초기 모듈입니다.
 * 현재 멀티 SNS 연결·발행은 api/sns.js 와 lib/server/sns.js 가 담당합니다.
 *
 * 지원 방식:
 * 1) [권장] Meta 공식 Instagram Graph API (OAuth 토큰 기반 - 비밀번호 노출/차단 위험 없음)
 * 2) [대행 운영] 사용자 계정 정보(ID/PW) 암호화 금고(AES-256-GCM) + 세션 유지형 업로드 워커 연동
 */

const crypto = require('crypto');
const https = require('https');

const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(process.env.VAULT_SECRET || 'dealer-reels-default-secret-key-2026')
  .digest();

/**
 * 사용자 인스타 비밀번호/세션 토큰 AES-256-GCM 암호화 저장
 */
function encryptCredential(plainText) {
  if (!plainText) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * 사용자 인스타 비밀번호/세션 토큰 복호화 (업로드 승인 시점에만 메모리에서 복호화)
 */
function decryptCredential(cipherText) {
  if (!cipherText) return null;
  const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    ENCRYPTION_KEY,
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

/**
 * 방식 1: Meta 공식 Instagram Graph API로 릴스(REELS) 컨테이너 생성 및 즉시 게시
 * @param {Object} params
 * @param {string} params.igUserId - 사용자의 인스타그램 비즈니스 계정 ID
 * @param {string} params.accessToken - 사용자의 장기(Long-lived) Access Token
 * @param {string} params.videoUrl - 임시서버에 렌더링된 사용자 전용 MP4 퍼블릭 URL
 * @param {string} params.caption - 사용자 연락처와 해시태그가 치환된 최종 본문 캡션
 */
async function publishReelViaGraphApi({ igUserId, accessToken, videoUrl, caption }) {
  // Step 1: 릴스 미디어 컨테이너 생성 요청
  // POST https://graph.facebook.com/v19.0/{ig-user-id}/media
  const createEndpoint = `https://graph.facebook.com/v19.0/${igUserId}/media`;
  const createPayload = new URLSearchParams({
    media_type: 'REELS',
    video_url: videoUrl,
    caption: caption,
    share_to_feed: 'true',
    access_token: accessToken
  });

  // Step 2: 컨테이너 인코딩 완료 후 게시 요청
  // POST https://graph.facebook.com/v19.0/{ig-user-id}/media_publish
  const publishEndpoint = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;

  // 실제 토큰이 입력되지 않은 테스트 환경에서는 API 페이로드와 성공 시뮬레이션 결과를 반환
  if (!accessToken || accessToken.startsWith('demo_')) {
    return {
      mode: 'META_GRAPH_API_SIMULATION',
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      igMediaId: `1798${Math.floor(100000000 + Math.random() * 900000000)}`,
      permalink: `https://www.instagram.com/reel/C_${Math.random().toString(36).substring(2, 9)}/`,
      requestPreview: {
        step1_createContainer: {
          url: createEndpoint,
          params: Object.fromEntries(createPayload.entries())
        },
        step2_publishMedia: {
          url: publishEndpoint,
          params: { creation_id: '<CONTAINER_ID>', access_token: '***' }
        }
      }
    };
  }

  // 실제 프로덕션 호출용 헬퍼
  const postForm = (url, params) =>
    new Promise((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }
      );
      req.on('error', reject);
      req.write(params.toString());
      req.end();
    });

  const containerRes = await postForm(createEndpoint, createPayload);
  if (!containerRes.id) {
    throw new Error(`Instagram 미디어 컨테이너 생성 실패: ${JSON.stringify(containerRes)}`);
  }

  const publishPayload = new URLSearchParams({
    creation_id: containerRes.id,
    access_token: accessToken
  });
  const publishRes = await postForm(publishEndpoint, publishPayload);

  return {
    mode: 'META_GRAPH_API_LIVE',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    igMediaId: publishRes.id
  };
}

module.exports = {
  encryptCredential,
  decryptCredential,
  publishReelViaGraphApi
};
