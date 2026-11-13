/**
 * Vercel Serverless Function: POST /api/generate-script
 * ----------------------------------------------------------------------------
 * 방식 A (중앙 AI 씬 디렉터 & 카피라이팅 엔진):
 * 사용자(카마스터·사장님·원장님 등 업종별 담당자)가 한 줄 상황을 입력하거나
 * [AI 대본 · 씬 구도 새로 생성] 버튼을 누르면, 선택한 업종 정보와 프롬프트에서
 * 상품·타겟 고객·상황을 추출하여
 * 1) 상품 타이틀(vehicle), 혜택 수치(discountNum), 혜택 조건(discount)
 * 2) 1~4컷 스토리보드 대본(cutCaptions) 및 TTS 성우 내레이션 대본(ttsLines)
 * 3) 카카오톡 상담 대화(kakaoChat)
 * 4) 컬러 테마(themeId) + 4컷 동적 위젯 레이아웃(scenePlan)
 * 을 생성합니다. 자동차(auto)는 차종 사전 기반 전용 경로를, 나머지 업종은 업종 정보 기반 경로를 쓰며,
 * 외부 AI 호출이 실패하면 서버 내장 기본 대본으로 응답합니다.
 * (응답 필드명 vehicle/discount 는 하위 호환을 위해 자동차 시절 이름을 유지합니다.)
 *
 * 대본 3안: 한 번 요청으로 혜택 강조형·고객 공감형·신뢰형 대본 3개를 만들어 variants 로 돌려줍니다.
 * data 는 variants[0] 과 같아서 예전 화면도 그대로 동작합니다.
 * 응답: { ok, provider, data, variants: [{ angle, angleLabel, ...대본 }] }
 */

// 대본 3안의 방향 (순서 = 화면에 보이는 순서)
const SCRIPT_ANGLES = [
  { id: 'benefit', label: '혜택 강조형', guide: '첫 컷에서 혜택·조건을 바로 던지는 직진형. 숫자는 입력에 있는 것만 쓴다.' },
  { id: 'empathy', label: '고객 공감형', guide: '첫 컷에서 고객의 고민·불편을 질문으로 꺼내고 해결로 이어가는 스토리형.' },
  { id: 'trust', label: '신뢰·전문성형', guide: '담당자의 꼼꼼함·책임감·전문성을 보여 주며 믿고 맡기게 만드는 신뢰형.' }
];

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
    `${dealerName} ${dealerTitle} 직통 출고`
  ];

  const ttsLines = [
    `${shortCarName}, 아직도 기다리세요?`,
    `선점 물량 ${stockCount}대, 이번 주 바로 출고.`,
    `최대 ${discountNum}만 원 할인 받으세요.`,
    `계약하면 바로 출고해 드립니다.`
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
    ctaBanner: `댓글에 [견적] 남기시면 ${shortCarName} 비밀 조건표 즉시 발송`,
    // 대본 3안 기본값을 만들 때만 쓰고 응답에서는 지웁니다.
    __ctx: { persona, shortCarName, stockCount }
  };
}

// 자동차 기본 대본 3안 (AI 호출 실패 시)
function buildAutoFallbackVariants(base, dealerName, dealerTitle) {
  const { persona, shortCarName, stockCount } = base.__ctx;
  const n = base.discountNum;
  const won = Number(n).toLocaleString();
  const who = `${dealerName} ${dealerTitle}`;
  const offer = `최대 -${won}만원 · ${base.discount}`;
  const benefit = pickOne([
    { hook: base.hook, cap: base.cutCaptions, tts: base.ttsLines },
    { hook: `${shortCarName}, 이번 달 조건 공개`, cap: [`${shortCarName} 이번 달 조건 공개`, `선점 물량 ${stockCount}대 즉시 배정`, offer, `${who} 직통 출고`], tts: ['이번 달 조건 공개합니다.', `선점 물량 ${stockCount}대 있어요.`, `최대 ${n}만 원 할인됩니다.`, '지금 바로 출고 가능해요.'] },
    { hook: `${persona} 주목! ${shortCarName}`, cap: [`${persona} 주목`, `${shortCarName} 즉시 출고 가능`, offer, `${who} 책임 출고`], tts: [`${shortCarName} 찾으셨죠?`, '대기 없이 바로 나와요.', `최대 ${n}만 원 혜택이에요.`, '계약 즉시 챙겨드려요.'] }
  ]);
  const empathy = pickOne([
    { hook: `${persona}, 아직 ${shortCarName} 고민 중이세요?`, cap: [`${shortCarName}, 출고 대기 때문에 망설이셨죠?`, `선점 물량 ${stockCount}대로 기다림 없이`, offer, `${who} 끝까지 책임 관리`], tts: ['출고 대기, 지치셨죠?', `선점 물량 ${stockCount}대 준비했어요.`, `최대 ${n}만 원 할인됩니다.`, '끝까지 책임지고 챙길게요.'] },
    { hook: '견적만 받다 지치셨죠?', cap: ['견적만 몇 번째 받으셨나요?', `${shortCarName} 조건 한 번에 정리`, offer, `${who} 직통 상담`], tts: ['견적만 받다 지치셨죠?', '조건 한 번에 정리해 드려요.', `최대 ${n}만 원 할인돼요.`, '편하게 물어보세요.'] },
    { hook: '월 납입금 부담되시죠?', cap: ['월 납입금 부담되시죠?', `${shortCarName} 맞춤 설계`, offer, `${who} 비교 견적`], tts: ['월 납입금 부담되시죠?', '맞춤으로 설계해 드려요.', `최대 ${n}만 원 할인까지.`, '비교 견적 받아 보세요.'] }
  ]);
  const trust = pickOne([
    { hook: `${shortCarName}, 제대로 사고 싶다면`, cap: [`${shortCarName} 출고 전문 · ${who}`, '견적부터 출고까지 한 사람이 책임', offer, `${who} 직통 상담`], tts: [`${shortCarName}, 제대로 사고 싶다면.`, '견적부터 출고까지 제가 맡습니다.', `최대 ${n}만 원 혜택 챙겨드려요.`, '편하게 연락 주세요.'] },
    { hook: '숨은 비용 없이 투명하게', cap: ['숨은 비용 없이 투명하게', `${shortCarName} 조건 그대로 공개`, offer, `${who} 책임 상담`], tts: ['숨은 비용 없이 알려드려요.', '조건 그대로 공개합니다.', `최대 ${n}만 원 혜택이에요.`, '믿고 연락 주세요.'] },
    { hook: '출고 후에도 끝까지 챙깁니다', cap: [`${shortCarName} 출고 그 후까지`, '사후 관리도 직접 챙깁니다', offer, `${who} 평생 관리`], tts: ['출고 후에도 챙겨드려요.', '사후 관리도 제가 직접.', `최대 ${n}만 원 할인돼요.`, '오래 함께하겠습니다.'] }
  ]);
  return [benefit, empathy, trust].map((p) => ({ ...base, hook: p.hook, cutCaptions: p.cap, ttsLines: p.tts }));
}

// 자동차 외 업종 기본 대본 3안 (AI 호출 실패 시). 지어낸 숫자는 넣지 않습니다.
// 같은 대본이 반복되지 않도록 방향마다 문장 묶음 여러 개 중 하나를 무작위로 고릅니다.
// (조사 오류를 피하려고 이름 뒤에 은/는·이/가를 붙이지 않는 문장만 씁니다)
function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildOtherFallbackVariants(base, item, I, discountText) {
  const offer = discountText || '자세한 내용은 문의 주세요';
  const cta = I.cta;
  const pools = [
    // 혜택 강조형
    [
      { hook: `${item}, 지금 소개합니다`, cap: [`${item}`, '직접 준비했습니다', offer, `${cta} 문의 환영합니다`], tts: [`${item} 소개해 드릴게요.`, '정성껏 준비했습니다.', '궁금한 점은 편하게 물어보세요.', `${cta} 문의 기다릴게요.`] },
      { hook: `이번 주 추천 · ${item}`, cap: [`이번 주 추천 · ${item}`, '한 번 보시면 압니다', offer, `${cta} 문의는 댓글로`], tts: ['이번 주 추천 드려요.', '한 번 보시면 압니다.', '조건 꼭 확인하세요.', '댓글로 편하게 남겨 주세요.'] },
      { hook: `${item}, 놓치면 아쉬워요`, cap: [`${item} 지금 진행 중`, '이번에 꼭 챙기세요', offer, `${cta} 문의 바로 답해 드려요`], tts: ['지금 진행 중이에요.', '이번에 꼭 챙기세요.', '혜택 확인해 보세요.', '문의 주시면 바로 답할게요.'] }
    ],
    // 고객 공감형
    [
      { hook: `${item}, 고민만 하고 계셨나요?`, cap: [`${item}, 고민만 하셨다면`, '직접 보고 결정하세요', offer, `${cta} 문의 환영합니다`], tts: ['아직 고민 중이신가요?', '직접 보시면 달라요.', '궁금한 점 편하게 물어보세요.', `${cta} 문의 기다릴게요.`] },
      { hook: '뭘 고를지 고민되시죠?', cap: ['뭘 고를지 고민되시죠?', `그래서 ${item} 준비했어요`, offer, '부담 없이 물어보세요'], tts: ['뭘 고를지 고민되시죠?', '그래서 준비했어요.', '조건도 확인해 보세요.', '부담 없이 물어보세요.'] },
      { hook: '이런 분께 딱 맞아요', cap: ['바쁜 일상, 시간 아끼고 싶다면', `${item}`, offer, `${cta} 문의 기다릴게요`], tts: ['시간 아끼고 싶으시죠?', '그럴 때 딱 맞아요.', '혜택도 챙겨 가세요.', '편하게 연락 주세요.'] }
    ],
    // 신뢰·전문성형
    [
      { hook: `${item}, 정직하게 준비했습니다`, cap: [`${item} · ${I.role} 직접 준비`, '하나하나 꼼꼼하게', offer, `${cta} 문의 환영합니다`], tts: [`${item}, 직접 준비했어요.`, '하나하나 꼼꼼하게 챙겼어요.', '궁금한 점 편하게 물어보세요.', `${cta} 문의 기다릴게요.`] },
      { hook: '처음부터 끝까지 직접 챙깁니다', cap: [`${item}`, '처음부터 끝까지 직접', offer, `${I.role} 직통 문의`], tts: ['처음부터 끝까지 제가 챙겨요.', '대충 하지 않습니다.', '조건도 투명하게 알려드려요.', '언제든 편하게 물어보세요.'] },
      { hook: '믿고 맡겨 주세요', cap: [`${item}, 믿고 맡겨 주세요`, '설명부터 정확하게', offer, `${cta} 문의 환영합니다`], tts: ['믿고 맡겨 주세요.', '설명부터 정확하게 드려요.', '조건 꼭 비교해 보세요.', '상담은 부담 없이 오세요.'] }
    ]
  ];
  return pools.map((pool) => {
    const p = pickOne(pool);
    return { ...base, hook: p.hook.slice(0, 24), cutCaptions: p.cap, ttsLines: p.tts };
  });
}

// AI 글에서 JSON 꺼내기: ```json 코드블록이나 앞뒤 설명이 붙어 와도 첫 { ~ 마지막 } 을 해석
function parseJsonLoose(text) {
  const t = String(text || '').replace(/```(?:json)?/gi, '').trim();
  try { return JSON.parse(t); } catch (e) { /* 아래에서 다시 시도 */ }
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s < 0 || e <= s) return null;
  try { return JSON.parse(t.slice(s, e + 1)); } catch (err) { return null; }
}

// AI 응답에서 대본 목록 꺼내기: {variants:[...]} 또는 예전 형식(대본 1개)
function extractAiVariants(aiResult) {
  if (!aiResult || typeof aiResult !== 'object') return [];
  const list = Array.isArray(aiResult.variants) ? aiResult.variants : [aiResult];
  return list.filter((v) => v && typeof v === 'object' && Array.isArray(v.cutCaptions) && v.cutCaptions.length >= 4);
}

async function handler(req, res) {
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
  const excludeRaw = String(body.exclude || '').trim();
  const excludeTerms = excludeRaw.split(/[,，/\n]+/).map((s) => s.trim()).filter(Boolean).slice(0, 20);
  const stripExcluded = (txt) => {
    let out = String(txt || '');
    excludeTerms.forEach((term) => {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp(esc, 'gi'), '');
    });
    return out.replace(/\s{2,}/g, ' ').trim();
  };
  const sanitizeScript = (obj) => {
    if (!obj || excludeTerms.length === 0) return obj;
    return {
      ...obj,
      hook: stripExcluded(obj.hook),
      discount: stripExcluded(obj.discount),
      cutCaptions: Array.isArray(obj.cutCaptions) ? obj.cutCaptions.map(stripExcluded) : obj.cutCaptions,
      ttsLines: Array.isArray(obj.ttsLines) ? obj.ttsLines.map(stripExcluded) : obj.ttsLines,
      bullets: Array.isArray(obj.bullets) ? obj.bullets.map(stripExcluded) : obj.bullets,
      kakaoChat: Array.isArray(obj.kakaoChat)
        ? obj.kakaoChat.map((m) => (m && typeof m === 'object' ? { ...m, text: stripExcluded(m.text) } : m))
        : obj.kakaoChat
    };
  };
  const excludeRule = excludeTerms.length > 0 ? `\n절대 사용하지 말아야 할 금지어(뺄 문구): ${excludeTerms.join(', ')}` : '';
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

  // 자동차가 아닌 업종: 업종 정보로 대본을 만들고, 실패하면 내장 기본 대본
  const ind = body.industryInfo && typeof body.industryInfo === 'object' ? body.industryInfo : null;
  const isOther = body.industry && body.industry !== 'auto' && ind;
  const cut = (v, n) => String(v || '').replace(/[\r\n`]/g, ' ').slice(0, n);
  const I = isOther ? {
    name: cut(ind.name, 20), role: cut(ind.role, 12), product: cut(ind.product, 12), cta: cut(ind.cta, 8),
    aiRole: cut(ind.aiRole, 60), caution: cut(ind.caution, 300)
  } : null;
  const otherItem = prompt.length > 1 && prompt.length <= 24 ? prompt : currentVehicle;
  const otherFallback = isOther ? (() => {
    const item = otherItem;
    return {
      vehicle: item, discountNum: Number(body.discountNum) || 0, discount: body.discount || '',
      hook: cut(`${item}, 지금 소개합니다`, 24), themeId: 'royal',
      scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
      cutCaptions: [`${item}`, '직접 준비했습니다', body.discount || '자세한 내용은 문의 주세요', `${I.cta} 문의 환영합니다`],
      ttsLines: [`${item} 소개해 드릴게요.`, '정성껏 준비했습니다.', '궁금한 점은 편하게 물어보세요.', `${I.cta} 문의 기다릴게요.`],
      kakaoChat: [{ role: 'customer', text: `${item} 문의드려요!` }, { role: 'dealer', text: '네, 편하게 물어보세요 😊' }, { role: 'customer', text: '이번 주에 가능할까요?' }, { role: 'dealer', text: `댓글에 [${I.cta}] 남겨주시면 바로 안내드릴게요 👇` }],
      bullets: Array.isArray(body.bullets) ? body.bullets.slice(0, 3).map((x) => cut(x, 40)) : [],
      ctaKeyword: I.cta
    };
  })() : null;
  const fallback = otherFallback || smartFallback;
  const fallbackVariants = isOther
    ? buildOtherFallbackVariants(otherFallback, otherItem, I, body.discount || '')
    : buildAutoFallbackVariants(smartFallback, dealerName, dealerTitle);

  // 응답용 대본 정리: 내부 값 제거, 방향 표시, 금지어 제거
  const finalizeVariant = (v, i) => {
    const { __ctx, angle, angleLabel, ...rest } = v || {};
    const a = SCRIPT_ANGLES[i] || SCRIPT_ANGLES[0];
    return sanitizeScript({ ...rest, angle: a.id, angleLabel: a.label });
  };
  const respond = (provider, variants, fallbackDiag) => {
    const list = variants.map(finalizeVariant);
    return res.status(200).json({ ok: true, provider, data: list[0], variants: list, ...(fallbackDiag ? { aiFallback: fallbackDiag } : {}) });
  };
  // AI 모델 이름은 환경변수로 바꿀 수 있음 (예전 모델이 지원 종료되면 여기서 교체)
  const openaiModel = String(process.env.OPENAI_SCRIPT_MODEL || 'gpt-4o-mini').trim();
  const geminiModel = String(process.env.GEMINI_SCRIPT_MODEL || 'gemini-2.0-flash').trim();
  const kieKey = String(process.env.KIE_API_KEY || '').trim();
  const kieModel = String(process.env.KIE_SCRIPT_MODEL || 'gemini-3-8-flash-openai').trim();
  const aiDiag = { kieKey: Boolean(kieKey), openaiKey: Boolean(adminOpenAiKey), geminiKey: Boolean(adminGeminiKey) };
  const secrets = [kieKey, adminOpenAiKey, adminGeminiKey].filter(Boolean);
  const errSnippet = async (resp) => {
    let t = await resp.text().catch(() => '');
    secrets.forEach((s) => { t = t.split(s).join('***'); });
    return t.replace(/\s+/g, ' ').slice(0, 200);
  };
  const anglesRule = `\n\n[대본 3안] 같은 상황으로 방향이 다른 대본 3개를 만들어 {"variants":[대본1, 대본2, 대본3]} 형태의 JSON으로만 출력하세요. 각 대본은 아래 스키마를 따릅니다.
${SCRIPT_ANGLES.map((a, i) => `대본${i + 1} (${a.label}): ${a.guide}`).join('\n')}
세 대본의 hook·cutCaptions·ttsLines 문장이 서로 겹치지 않게 쓰세요.`;

  try {
    const systemInstruction = isOther ? `당신은 대한민국 ${I.name} 업종의 숏폼(릴스·쇼츠) 대본 작가입니다. 화자는 ${I.aiRole}입니다.
입력된 상황에 맞춰 vehicle(소개할 ${I.product} 이름), discount(혜택·조건 한 줄), hook, cutCaptions(4컷 자막), ttsLines(4컷 성우 문장), kakaoChat(4개 대화), bullets(3개)를 JSON으로만 출력하세요.
ttsLines의 각 문장은 공백 포함 20자 이내의 짧은 한 문장으로 쓰세요. 마지막 "댓글에 [${I.cta}]" 안내는 명함 화면에서 따로 나오므로 넣지 마세요.
지어낸 고객 후기, 지어낸 숫자·통계, 효과를 보장하는 표현은 쓰지 마세요. 입력에 없는 가격은 만들지 마세요.${I.caution ? `\n반드시 지킬 것: ${I.caution}` : ''}${excludeRule}
JSON 스키마: {"vehicle":"","discountNum":0,"discount":"","hook":"24자 이내","themeId":"royal","cutCaptions":["","","",""],"ttsLines":["","","",""],"kakaoChat":[{"role":"customer","text":""},{"role":"dealer","text":""},{"role":"customer","text":""},{"role":"dealer","text":""}],"bullets":["✔ ","✔ ","✔ "],"ctaKeyword":"${I.cta}"}` : `당신은 대한민국 자동차 카마스터 전문 숏폼 AI 영상 감독(Scene Director)입니다.
카마스터가 입력한 상황(예: "30대 여성, 그랜저")에서 차종과 고객 특성을 정확히 반영하여 vehicle(차종명), discountNum(할인액), discount(월납입조건), themeId, scenePlan, cutCaptions(4컷 자막), ttsLines(4컷 성우 내레이션 대본), kakaoChat(4개 대화)을 JSON으로만 출력하세요.
ttsLines의 각 문장은 숏폼 한 컷(약 2초) 안에 읽을 수 있도록 공백 포함 20자 이내의 짧은 한 문장으로 쓰세요.
"댓글에 견적" 안내는 영상 마지막 명함 화면에서 따로 나오므로 cutCaptions와 ttsLines에는 넣지 마세요.
주의: "30대 여성"의 "30대"는 나이(연령대)이지 차량 30대가 아닙니다! 절대 혼동하지 마세요.${excludeRule}

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
    { "role": "dealer", "text": "카마스터 답변 1" },
    { "role": "customer", "text": "고객 질문 2" },
    { "role": "dealer", "text": "카마스터 답변 2" }
  ],
  "bullets": ["✔ 혜택 1", "✔ 혜택 2", "✔ 혜택 3"],
  "ctaKeyword": "견적",
  "ctaBanner": "하단 댓글 유도 문구"
}`;
    const systemWithAngles = `${systemInstruction}${anglesRule}`;

    const userMessage = isOther ? `[입력 상황]: "${prompt || `${currentVehicle} 소개`}"
[화자]: ${dealerBranch} ${dealerName} ${dealerTitle} (고객 혜택: ${dealerPromo})
[지금 ${I.product}]: ${currentVehicle} / ${body.discount || ''}` : `[카마스터 입력 상황]: "${prompt || `${currentVehicle} 당월 특별 프로모션`}"
[담당 카마스터]: ${dealerBranch} ${dealerName} ${dealerTitle} (사은품: ${dealerPromo})`;

    let aiResult = null;
    let providerUsed = '';

    // 1순위: kie.ai (OpenAI 호환 chat.completions, 모델은 주소로 고름 · 오류도 HTTP 200 + {code,msg} 로 올 수 있음)
    if (kieKey) {
      aiDiag.kieModel = kieModel;
      const resp = await fetch(`https://api.kie.ai/${encodeURIComponent(kieModel)}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${kieKey}` },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          stream: false,
          messages: [
            { role: 'system', content: [{ type: 'text', text: `${systemWithAngles}\n\n반드시 JSON만 출력하세요. 설명이나 코드블록 표시는 넣지 마세요.` }] },
            { role: 'user', content: [{ type: 'text', text: userMessage }] }
          ]
        })
      });
      aiDiag.kieStatus = resp.status;
      if (resp.ok) {
        const data = await resp.json().catch(() => null);
        const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (typeof text === 'string' && text.trim()) {
          const parsed = parseJsonLoose(text);
          if (parsed) {
            aiResult = parsed;
            providerUsed = `kie.ai ${kieModel} Director`;
          } else {
            aiDiag.kieError = 'JSON 해석 실패: ' + text.replace(/\s+/g, ' ').slice(0, 120);
          }
        } else {
          aiDiag.kieError = data ? `code ${data.code}: ${String(data.msg || '').slice(0, 160)}` : '빈 응답';
        }
      } else {
        aiDiag.kieError = await errSnippet(resp);
      }
    }

    if (!aiResult && adminOpenAiKey) {
      aiDiag.openaiModel = openaiModel;
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminOpenAiKey}`
        },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model: openaiModel,
          temperature: 0.85,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemWithAngles },
            { role: 'user', content: userMessage }
          ]
        })
      });
      aiDiag.openaiStatus = resp.status;
      if (resp.ok) {
        const data = await resp.json();
        aiResult = JSON.parse(data.choices?.[0]?.message?.content || '{}');
        providerUsed = `OpenAI ${openaiModel} Director`;
      } else {
        aiDiag.openaiError = await errSnippet(resp);
      }
    }

    if (!aiResult && adminGeminiKey) {
      aiDiag.geminiModel = geminiModel;
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(adminGeminiKey)}`;
      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemWithAngles}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.85,
            responseMimeType: 'application/json'
          }
        })
      });
      aiDiag.geminiStatus = resp.status;
      if (resp.ok) {
        const data = await resp.json();
        aiResult = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
        providerUsed = `Google ${geminiModel} Director`;
      } else {
        aiDiag.geminiError = await errSnippet(resp);
      }
    }
    if (aiResult && !extractAiVariants(aiResult).length) aiDiag.parse = 'AI 응답에 쓸 수 있는 대본이 없음';

    const aiVariants = extractAiVariants(aiResult).slice(0, SCRIPT_ANGLES.length);
    if (aiVariants.length > 0) {
      // AI가 3개보다 적게 주면 모자란 칸은 기본 대본으로 채웁니다.
      const merged = SCRIPT_ANGLES.map((_, i) => {
        const fb = fallbackVariants[i] || fallback;
        const v = aiVariants[i];
        if (!v) return fb;
        return {
          ...fb,
          ...v,
          ...(isOther ? { scenePlan: fb.scenePlan } : {}),
          ...(v.themeId && !VALID_THEMES.includes(v.themeId) ? { themeId: fb.themeId } : {}),
          ttsLines: Array.isArray(v.ttsLines) && v.ttsLines.length >= 4 ? v.ttsLines : fb.ttsLines
        };
      });
      return respond(providerUsed, merged);
    }
  } catch (e) {
    // 외부 LLM 타임아웃/오류 시에도 아래 내장 스마트 엔진으로 즉시 200 응답 반환
    aiDiag.exception = String(e && e.message || e).slice(0, 160);
  }

  // 기본 대본으로 대신 응답: 왜 AI를 못 썼는지 aiFallback 에 남김 (키 값은 넣지 않음)
  if (!aiDiag.kieKey && !aiDiag.openaiKey && !aiDiag.geminiKey) aiDiag.reason = 'AI 키가 설정되어 있지 않음 (KIE_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY)';
  return respond(isOther ? 'AutoReels 기본 대본' : 'AutoReels AI Automotive Director', fallbackVariants, aiDiag);
};

// 사용량 계산·한도 (회원 서버가 켜져 있을 때만 동작)
const { withMeter } = require('../lib/server/meter');
module.exports = withMeter(handler, 'ai', (req) => (req.method === 'POST' ? 1 : 0));
