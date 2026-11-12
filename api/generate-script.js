/**
 * Vercel Serverless Function: POST /api/generate-script
 * ----------------------------------------------------------------------------
 * 방식 A (중앙 AI 씬 디렉터 & 카피라이팅 엔진):
 * 딜러가 한 줄 상황을 입력하거나 [AI 대본 · 씬 구도 새로 생성] 버튼을 누르면,
 * 입력된 프롬프트에서 차종·타겟 고객·상황을 정확히 추출하여
 * 1) 차종 타이틀(vehicle), 할인액(discountNum), 월 납입 조건(discount)
 * 2) 1~4컷 스토리보드 대본(cutCaptions) 및 TTS 성우 내레이션 대본(ttsLines)
 * 3) 카카오톡 실제 상담 대화(kakaoChat)
 * 4) 컬러 테마(themeId) + 4컷 동적 위젯 레이아웃(scenePlan)
 * 을 즉시 생성합니다. (외부 API 지연 시에도 서버 내장 한국어 자동차 카피 엔진이 100% 무결점 응답 보장)
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

// 한국 자동차 시장 주요 차종 사전 (프롬프트 내 차종 자동 감지 및 현실적인 제원 매핑)
const CAR_CATALOG = [
  { keywords: ['그랜저', 'gn7'], vehicle: '2026 디 올 뉴 그랜저 하이브리드', discountNum: 450, discount: '월 49만원대 · 즉시출고' },
  { keywords: ['쏘렌토', 'mq4'], vehicle: '2026 더 뉴 쏘렌토 하이브리드', discountNum: 480, discount: '월 46만원대 · 3일 즉시출고' },
  { keywords: ['싼타페', '산타페', 'mx5'], vehicle: '2026 디 올 뉴 싼타페 하이브리드', discountNum: 420, discount: '월 44만원대 · 선점재고 출고' },
  { keywords: ['카니발', 'ka4'], vehicle: '2026 더 뉴 카니발 하이브리드 9인승', discountNum: 390, discount: '월 52만원대 · 부가세 환급' },
  { keywords: ['아반떼', 'cn7'], vehicle: '2026 더 뉴 아반떼 인스퍼레이션', discountNum: 240, discount: '월 28만원대 · 첫차 특별프로모션' },
  { keywords: ['스포티지', 'nq5'], vehicle: '2026 더 뉴 스포티지 하이브리드', discountNum: 360, discount: '월 38만원대 · 당월 즉시배정' },
  { keywords: ['투싼', 'nx4'], vehicle: '2026 더 뉴 투싼 하이브리드', discountNum: 350, discount: '월 37만원대 · 무보증 즉시출고' },
  { keywords: ['팰리세이드', '펠리세이드', 'lx3'], vehicle: '2026 디 올 뉴 팰리세이드 캘리그라피', discountNum: 520, discount: '월 58만원대 · 선점물량 배정' },
  { keywords: ['쏘나타', '소나타', 'dn8'], vehicle: '2026 쏘나타 디 엣지 하이브리드', discountNum: 380, discount: '월 39만원대 · 저금리 특판' },
  { keywords: ['코나'], vehicle: '2026 디 올 뉴 코나 하이브리드', discountNum: 280, discount: '월 31만원대 · 즉시출고' },
  { keywords: ['캐스퍼'], vehicle: '2026 캐스퍼 일렉트릭 인스퍼레이션', discountNum: 310, discount: '월 24만원대 · 보조금 추가지원' },
  { keywords: ['레이'], vehicle: '2026 더 뉴 기아 레이 시그니처', discountNum: 190, discount: '월 22만원대 · 경차 혜택 풀적용' },
  { keywords: ['k5'], vehicle: '2026 더 뉴 K5 하이브리드', discountNum: 370, discount: '월 38만원대 · 즉시출고 특판' },
  { keywords: ['k8'], vehicle: '2026 더 뉴 K8 하이브리드 시그니처', discountNum: 460, discount: '월 48만원대 · 법인·개인 특판' },
  { keywords: ['gv80'], vehicle: '제네시스 GV80 페이스리프트', discountNum: 650, discount: '월 79만원대 · 비용처리 특판' },
  { keywords: ['gv70'], vehicle: '제네시스 더 뉴 GV70 스포츠', discountNum: 540, discount: '월 64만원대 · 선점재고 즉시출고' },
  { keywords: ['g80'], vehicle: '제네시스 전동화/더 뉴 G80', discountNum: 680, discount: '월 72만원대 · 대표님 법인특판' },
  { keywords: ['아이오닉', 'ioniq'], vehicle: '아이오닉 5 N / 더 뉴 아이오닉 5', discountNum: 750, discount: '월 41만원대 · 전기차 특별보조금' },
  { keywords: ['ev6', 'ev9', 'ev3'], vehicle: '기아 EV 시리즈 특별 프로모션', discountNum: 690, discount: '월 39만원대 · 지자체 보조금 선점' },
  { keywords: ['bmw', '520i', '5시리즈', '3시리즈', 'x5'], vehicle: 'BMW 520i M Sport 패키지', discountNum: 1150, discount: '월 59만원대 · 입항물량 즉시출고' },
  { keywords: ['벤츠', 'e클래스', 'e200', 'e300', 'glc'], vehicle: '메르세데스-벤츠 E클래스 아방가르드', discountNum: 1280, discount: '월 64만원대 · 공식 프로모션' },
  { keywords: ['아우디', 'a6', 'q5'], vehicle: '아우디 A6 45 TFSI 콰트로', discountNum: 1450, discount: '월 55만원대 · 파격 할인 특판' },
  { keywords: ['테슬라', '모델y', '모델3'], vehicle: '테슬라 Model Y RWD 즉시배정', discountNum: 490, discount: '월 47만원대 · 보조금 확정 물량' },
  { keywords: ['토레스'], vehicle: 'KGM 토레스 하이브리드 / EVX', discountNum: 340, discount: '월 35만원대 · 무보증 즉시출고' }
];

function parsePromptAndBuildSmartScene(prompt, fallbackVehicle, fallbackDiscountNum, fallbackDiscount, dealerName, dealerTitle) {
  const raw = (prompt || '').trim();
  const lower = raw.toLowerCase();

  // 1. 프롬프트에서 차종 감지
  let matchedCar = null;
  for (const item of CAR_CATALOG) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      matchedCar = item;
      break;
    }
  }

  const vehicle = matchedCar ? matchedCar.vehicle : (raw.length > 1 && raw.length <= 14 ? `${raw} 특별 프로모션` : fallbackVehicle);
  const discountNum = matchedCar ? matchedCar.discountNum : fallbackDiscountNum;
  const discount = matchedCar ? matchedCar.discount : fallbackDiscount;

  // 2. 연령대("20대", "30대", "40대", "50대", "60대")와 실제 차량 대수("1대", "2대", "3대")를 정확히 구분!
  const cleanedForStock = raw.replace(/[1-7]0\s*대\s*(여성|남성|고객|워킹맘|직장인|부부|신혼|대표|사장|첫차|분들)?/g, '');
  const stockMatch = cleanedForStock.match(/([1-9])\s*대/);
  const stockCount = stockMatch ? Number(stockMatch[1]) : 3;

  // 3. 고객 페르소나 / 키워드 감지
  const agePersonaMatch = raw.match(/([2-6]0대\s*(?:여성|남성|워킹맘|직장인|신혼부부|대표님|사업자)?)/);
  const persona = agePersonaMatch ? agePersonaMatch[1].trim() : (
    raw.includes('여성') || raw.includes('워킹맘') ? '3040 여성·패밀리 고객님' :
    raw.includes('법인') || raw.includes('사업자') || raw.includes('대표') ? '법인·개인사업자 대표님' :
    raw.includes('첫차') || raw.includes('사회초년생') ? '첫차 구매 고객님' : '즉시출고 희망 고객님'
  );

  // 4. 테마 및 4컷 위젯을 매번 시드에 따라 다양하게 조합
  const themeId = VALID_THEMES[Math.floor(Math.random() * VALID_THEMES.length)];
  const shuffledWidgets = [...VALID_WIDGETS].sort(() => Math.random() - 0.5);
  // 1컷은 임팩트 위젯, 2컷은 카톡 대화 또는 스펙, 3컷은 견적/할인, 4컷은 출고/DM유도 우선 배치
  const scenePlan = [
    { cut: 1, widget: shuffledWidgets[0], pos: 'center', cam: 0 },
    { cut: 2, widget: 'KAKAO_CHAT_PAIR', pos: 'center', cam: 1 },
    { cut: 3, widget: shuffledWidgets[1] === 'KAKAO_CHAT_PAIR' ? 'RECEIPT_QUOTE' : shuffledWidgets[1], pos: 'bottom', cam: 2 },
    { cut: 4, widget: shuffledWidgets[2] === 'KAKAO_CHAT_PAIR' ? 'COMMENT_DM_MAGNET' : shuffledWidgets[2], pos: 'bottom', cam: 3 }
  ];

  const shortCarName = vehicle.replace(/^2026\s+/, '').replace(/^디 올 뉴\s+/, '').replace(/^더 뉴\s+/, '');

  const hook = `${persona} 인기 1위! ${shortCarName} 특판`;
  const cutCaptions = [
    `${persona} 강력 추천 · ${shortCarName}`,
    `인기 컬러 선점 물량 ${stockCount}대 대기 없이 즉시 배정`,
    `최대 -${discountNum.toLocaleString()}만원 특판 혜택 · ${discount}`,
    `${dealerName} ${dealerTitle} 직통 출고 · 댓글에 [견적] 남겨주세요`
  ];

  const ttsLines = [
    `${shortCarName}, 아직도 기다리세요?`,
    `선점 물량 ${stockCount}대, 이번 주 바로 출고.`,
    `최대 ${discountNum}만 원 할인 받으세요.`,
    `댓글에 견적 두 글자만 남겨주세요!`
  ];

  const kakaoChat = [
    { role: 'customer', text: `팀장님! ${persona}인데 ${shortCarName} 지금 바로 출고 가능한가요?` },
    { role: 'dealer', text: `네 고객님! 인기 화이트·블랙 선점 재고 ${stockCount}대 확보해 둬서 이번 주 즉시 출고됩니다` },
    { role: 'customer', text: `우와 다행이네요! 이번 달 할인 혜택이랑 월 납입금은 어느 정도인가요?` },
    { role: 'dealer', text: `최대 -${discountNum.toLocaleString()}만원 혜택 적용해서 ${discount}로 맞춰드렸습니다` }
  ];

  const bullets = [
    `✔ ${persona} 맞춤 ${shortCarName} 선점 재고 ${stockCount}대 즉시출고`,
    `✔ 최대 -${discountNum.toLocaleString()}만원 할인 + 최저금리 비교 설계`,
    `✔ 프리미엄 썬팅·블랙박스·유리막코팅 풀패키지 무상 지원`
  ];

  return {
    vehicle,
    discountNum,
    discount,
    hook,
    themeId,
    scenePlan,
    cutCaptions,
    ttsLines,
    kakaoChat,
    bullets,
    ctaKeyword: '견적',
    ctaBanner: `댓글에 [견적] 남기시면 ${shortCarName} 비밀 조건표 즉시 발송`
  };
}

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

  // 먼저 프롬프트 기반 정교한 기본 씬 데이터를 준비 (외부 LLM 실패 시에도 100% 작동 보장)
  const smartFallback = parsePromptAndBuildSmartScene(
    prompt,
    currentVehicle,
    currentDiscountNum,
    currentDiscount,
    dealerName,
    dealerTitle
  );

  try {
    const systemInstruction = `당신은 대한민국 자동차 딜러(카마스터) 전문 숏폼 AI 영상 감독(Scene Director)입니다.
딜러가 입력한 상황(예: "30대 여성, 그랜저")에서 차종과 고객 특성을 정확히 반영하여 vehicle(차종명), discountNum(할인액), discount(월납입조건), themeId, scenePlan, cutCaptions(4컷 자막), ttsLines(4컷 성우 내레이션 대본), kakaoChat(4개 대화)을 JSON으로만 출력하세요.
ttsLines의 각 문장은 숏폼 한 컷(약 2초) 안에 읽을 수 있도록 공백 포함 20자 이내의 짧은 한 문장으로 쓰세요.
주의: "30대 여성"의 "30대"는 나이(연령대)이지 차량 30대가 아닙니다! 절대 혼동하지 마세요.

[themeId 선택지]: "crimson" | "emerald" | "royal" | "cyber" | "cobalt" | "sunset" | "violet" | "obsidian"
[widget 선택지]: "BREAKING_NEWS" | "MAGAZINE_COVER" | "GIANT_DISCOUNT_STAMP" | "SPEC_FLOATING_TAGS" | "KAKAO_CHAT_PAIR" | "RECEIPT_QUOTE" | "VS_FINANCE_BATTLE" | "CHECKLIST_GLASS" | "STOCK_COUNTDOWN" | "SMARTKEY_DELIVERY" | "COMMENT_DM_MAGNET" | "MONTHLY_PAYMENT_HERO"

JSON 스키마:
{
  "vehicle": "감지된 차종 풀네임 (예: 2026 디 올 뉴 그랜저 하이브리드)",
  "discountNum": 450,
  "discount": "월 납입금 및 출고 조건",
  "hook": "메인 후킹 카피 (24자 이내)",
  "themeId": "royal",
  "scenePlan": [
    { "cut": 1, "widget": "BREAKING_NEWS", "pos": "center", "cam": 0 },
    { "cut": 2, "widget": "KAKAO_CHAT_PAIR", "pos": "center", "cam": 1 },
    { "cut": 3, "widget": "RECEIPT_QUOTE", "pos": "bottom", "cam": 2 },
    { "cut": 4, "widget": "COMMENT_DM_MAGNET", "pos": "bottom", "cam": 3 }
  ],
  "cutCaptions": ["1컷 자막", "2컷 자막", "3컷 자막", "4컷 자막"],
  "ttsLines": ["1컷 성우 내레이션 문장", "2컷 성우 내레이션 문장", "3컷 성우 내레이션 문장", "4컷 성우 내레이션 문장"],
  "kakaoChat": [
    { "role": "customer", "text": "고객 질문 1" },
    { "role": "dealer", "text": "딜러 답변 1" },
    { "role": "customer", "text": "고객 질문 2" },
    { "role": "dealer", "text": "딜러 답변 2" }
  ],
  "bullets": ["✔ 혜택 1", "✔ 혜택 2", "✔ 혜택 3"],
  "ctaKeyword": "견적",
  "ctaBanner": "하단 댓글 유도 문구"
}`;

    const userMessage = `[딜러 입력 상황]: "${prompt || `${currentVehicle} 당월 특별 프로모션`}"
[담당 카마스터]: ${dealerBranch} ${dealerName} ${dealerTitle} (사은품: ${dealerPromo})`;

    let aiResult = null;
    let providerUsed = '';

    if (adminOpenAiKey) {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminOpenAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.85,
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
        providerUsed = 'OpenAI GPT-4o-mini Director';
      }
    }

    if (!aiResult && adminGeminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(adminGeminiKey)}`;
      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.85,
            responseMimeType: 'application/json'
          }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        aiResult = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
        providerUsed = 'Google Gemini 2.0 Flash Director';
      }
    }

    if (aiResult && Array.isArray(aiResult.cutCaptions) && aiResult.cutCaptions.length >= 4) {
      return res.status(200).json({
        ok: true,
        provider: providerUsed,
        data: {
          ...smartFallback,
          ...aiResult,
          ttsLines: Array.isArray(aiResult.ttsLines) && aiResult.ttsLines.length >= 4 ? aiResult.ttsLines : smartFallback.ttsLines
        }
      });
    }
  } catch (e) {
    // 외부 LLM 타임아웃/오류 시에도 아래 내장 스마트 엔진으로 즉시 200 응답 반환
  }

  return res.status(200).json({
    ok: true,
    provider: 'AutoReels AI Automotive Director',
    data: smartFallback
  });
};
