/**
 * Vercel Serverless Function: POST /api/generate-script
 * ----------------------------------------------------------------------------
 * 방식 A (중앙 AI 씬 디렉터 & 카피라이팅 엔진):
 * 딜러가 한 줄 상황을 입력하거나 [AI 새 연출·대본 생성] 버튼을 누르면,
 * 단순 텍스트 대본뿐만 아니라 매번 화면의 색상 테마(themeId)와 1~4컷 각각의
 * 그래픽 위젯 종류(widget), 화면 배치(pos), 카메라 모션(cam)까지 AI가 직접 디렉팅합니다.
 */

const VALID_THEMES = ['crimson', 'emerald', 'royal', 'cyber', 'cobalt', 'sunset', 'violet', 'obsidian'];
const VALID_WIDGETS = [
  'BREAKING_NEWS',
  'MAGAZINE_COVER',
  'GIANT_DISCOUNT_STAMP',
  'SPEC_FLOATING_TAGS',
  'KAKAO_CHAT_PAIR',
  'RECEIPT_QUOTE',
  'VS_FINANCE_BATTLE',
  'CHECKLIST_GLASS',
  'STOCK_COUNTDOWN',
  'SMARTKEY_DELIVERY',
  'COMMENT_DM_MAGNET',
  'MONTHLY_PAYMENT_HERO'
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      service: 'AutoReels Generative AI Scene Director Engine (방식 A)',
      status: 'READY',
      supportedThemes: VALID_THEMES.length,
      supportedWidgets: VALID_WIDGETS.length
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = (body.prompt || '').trim();
    const currentVehicle = body.vehicle || '2026 쏘렌토 하이브리드';
    const currentDiscountNum = Number(body.discountNum) || 480;
    const currentDiscount = body.discount || '월 46만원대 · 3일 즉시출고';
    const dealerName = body.dealerName || '김민준';
    const dealerTitle = body.dealerTitle || '수석 카마스터';
    const dealerBranch = body.dealerBranch || '현대·기아 공식전시장';
    const dealerPromo = body.dealerPromo || '신차패키지 8종 무상지원';

    const adminOpenAiKey = (body.adminOpenAiKey || process.env.OPENAI_API_KEY || '').trim();
    const adminGeminiKey = (body.adminGeminiKey || process.env.GEMINI_API_KEY || '').trim();

    const systemInstruction = `당신은 대한민국 상위 0.1% 자동차 딜러(카마스터) 전문 숏폼(릴스·쇼츠·틱톡) AI 영상 감독(Scene Director) 겸 카피라이터입니다.
고정된 템플릿이 아니라, 딜러가 입력한 상황에 맞춰 매번 화면의 컬러 테마(themeId)와 1~4컷 각각의 그래픽 위젯(widget), 배치 위치(pos), 카메라 모션(cam), 그리고 대본을 완전히 새롭게 조합해 JSON으로만 출력하세요.

[사용 가능한 컬러 테마 themeId (1개 선택)]:
"crimson" | "emerald" | "royal" | "cyber" | "cobalt" | "sunset" | "violet" | "obsidian"

[사용 가능한 12종 그래픽 위젯 widget (1~4컷에 서로 다른 4개를 상황에 맞게 배치)]:
- "BREAKING_NEWS": 긴급 속보 티커 + 대형 헤드라인
- "MAGAZINE_COVER": 모터트렌드 매거진 표지 프레임 타이포
- "GIANT_DISCOUNT_STAMP": 초대형 슬롯머신 할인 금액 스탬프
- "SPEC_FLOATING_TAGS": 좌우 비대칭 3단 옵션·트림 플로팅 캡슐
- "KAKAO_CHAT_PAIR": 실제 고객 노란/흰 말풍선 카톡 티키타카 대화
- "RECEIPT_QUOTE": 영수증/견적서 명세표 스타일 보드
- "VS_FINANCE_BATTLE": 할부 vs 장기렌트 vs 리스 비교 게이지 바
- "CHECKLIST_GLASS": 글래스모피즘 핵심 혜택 체크리스트
- "STOCK_COUNTDOWN": 선점 재고 잔여 대수 긴급 게이지 바
- "SMARTKEY_DELIVERY": 스마트키 인도 & 무상 탁송 배지
- "COMMENT_DM_MAGNET": 댓글 키워드 자동 DM 유도 콜아웃
- "MONTHLY_PAYMENT_HERO": 하루 커피 한 잔 값 / 월 납입금 히어로 카드

반드시 아래 JSON 스키마만 출력하세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "vehicle": "차종 풀네임",
  "discountNum": 숫자(만원 단위 혜택액, 예: 480),
  "discount": "월 납입금 및 출고 핵심 조건 (20자 이내)",
  "hook": "메인 후킹 카피 (25자 이내)",
  "themeId": "위 8개 테마 중 상황에 어울리는 1개",
  "scenePlan": [
    { "cut": 1, "widget": "위 12종 중 1개", "pos": "top|center|bottom", "cam": 0 },
    { "cut": 2, "widget": "위 12종 중 다른 1개", "pos": "top|center|bottom", "cam": 1 },
    { "cut": 3, "widget": "위 12종 중 다른 1개", "pos": "top|center|bottom", "cam": 2 },
    { "cut": 4, "widget": "위 12종 중 다른 1개", "pos": "top|center|bottom", "cam": 3 }
  ],
  "cutCaptions": [
    "1컷(0~2초) 자막 (25자 이내)",
    "2컷(2~4초) 자막 (25자 이내)",
    "3컷(4~6초) 자막 (25자 이내)",
    "4컷(6~8초) 자막 (25자 이내)"
  ],
  "kakaoChat": [
    { "role": "customer", "text": "고객의 현실적인 카톡 질문 1 (36자 이내)" },
    { "role": "dealer", "text": "딜러의 명쾌한 카톡 답변 1 (36자 이내)" },
    { "role": "customer", "text": "고객의 추가 질문 2 (36자 이내)" },
    { "role": "dealer", "text": "딜러의 핵심 조건 답변 2 (36자 이내)" }
  ],
  "bullets": [
    "✔ 핵심 혜택 1 (26자 이내)",
    "✔ 핵심 혜택 2 (26자 이내)",
    "✔ 핵심 혜택 3 (26자 이내)"
  ],
  "ctaKeyword": "댓글 유도 키워드 (2~4글자)",
  "ctaBanner": "하단 댓글 유도 문구"
}`;

    const userMessage = `[딜러 입력 상황]: "${prompt || `${currentVehicle} 당월 특별 프로모션 및 선점재고 즉시출고`}"
[기본 차종]: ${currentVehicle}
[기본 할인액]: ${currentDiscountNum}만원 (${currentDiscount})
[담당 카마스터]: ${dealerBranch} ${dealerName} ${dealerTitle} (사은품: ${dealerPromo})
[생성 시드]: ${Date.now()}-${Math.random().toString(36).slice(2, 7)} (이전과 전혀 다른 위젯 조합과 생생한 표현을 사용하세요)`;

    let aiResult = null;
    let providerUsed = '';

    // 1순위: 대표님 전용 OpenAI API Key
    if (adminOpenAiKey) {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminOpenAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.9,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage }
          ]
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        aiResult = JSON.parse(data.choices?.[0]?.message?.content || '{}');
        providerUsed = 'OpenAI GPT-4o-mini Scene Director';
      }
    }

    // 2순위: 대표님 전용 Google Gemini API Key
    if (!aiResult && adminGeminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(adminGeminiKey)}`;
      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: 'application/json'
          }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        aiResult = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
        providerUsed = 'Google Gemini 2.0 Flash Scene Director';
      }
    }

    // 3순위: 기본 클라우드 LLM
    if (!aiResult) {
      const cloudResp = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          temperature: 0.9,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (cloudResp.ok) {
        const data = await cloudResp.json();
        let rawText = data.choices?.[0]?.message?.content || '';
        rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        aiResult = JSON.parse(rawText);
        providerUsed = 'AutoReels Cloud AI Scene Director';
      }
    }

    if (!aiResult || !Array.isArray(aiResult.cutCaptions)) {
      throw new Error('AI 씬 디렉터 응답 파싱에 실패했습니다.');
    }

    return res.status(200).json({
      ok: true,
      provider: providerUsed,
      data: aiResult
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'AI 씬 디렉팅 중 오류가 발생했습니다.'
    });
  }
};
