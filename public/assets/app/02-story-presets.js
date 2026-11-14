// AutoReels — 02-story-presets.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // 무한 생성형 씬 디렉터 레지스트리 (24종 컬러 테마 × 22종 그래픽 위젯)
    // 수학적 순열: 22종 중 4컷 비복원 추출 P(22, 4) = 175,560 × 24 테마 = 4,213,440가지 완전 무중복!
    // ============================================================================
    const DIRECTOR_THEMES = {
      royal:        { name: '로얄 골드',      primary: '#0f172a', accent: '#facc15', badge: '#2563eb', text: '#ffffff', sub: '#93c5fd' },
      crimson:      { name: '크림슨 레드',    primary: '#18181b', accent: '#f43f5e', badge: '#e11d48', text: '#ffffff', sub: '#fda4af' },
      emerald:      { name: '에메랄드 럭스',  primary: '#062c22', accent: '#34d399', badge: '#059669', text: '#ffffff', sub: '#a7f3d0' },
      cyber:        { name: '사이버 네온',    primary: '#090d16', accent: '#38bdf8', badge: '#4f46e5', text: '#ffffff', sub: '#bae6fd' },
      cobalt:       { name: '현대 딥코발트',  primary: '#002C5F', accent: '#fde047', badge: '#0284c7', text: '#ffffff', sub: '#e0f2fe' },
      sunset:       { name: '선셋 오렌지',    primary: '#1c1917', accent: '#fb923c', badge: '#ea580c', text: '#ffffff', sub: '#fed7aa' },
      violet:       { name: '벨벳 바이올렛',  primary: '#1e1b4b', accent: '#c084fc', badge: '#7c3aed', text: '#ffffff', sub: '#e9d5ff' },
      obsidian:     { name: '옵시디언 블랙',  primary: '#09090b', accent: '#e4e4e7', badge: '#3f3f46', text: '#ffffff', sub: '#a1a1aa' },
      ice:          { name: '글래시어 아이스', primary: '#031726', accent: '#38bdf8', badge: '#0284c7', text: '#ffffff', sub: '#bae6fd' },
      stealth:      { name: '스텔스 카본',    primary: '#121214', accent: '#a1a1aa', badge: '#27272a', text: '#ffffff', sub: '#d4d4d8' },
      monochrome:   { name: '모노크롬 에디션',primary: '#09090b', accent: '#f8fafc', badge: '#334155', text: '#ffffff', sub: '#cbd5e1' },
      lime:         { name: '네온 하이퍼라임',primary: '#0a1f0a', accent: '#84cc16', badge: '#4d7c0f', text: '#ffffff', sub: '#d9f99d' },
      champagne:    { name: '샴페인 골드',    primary: '#1c1917', accent: '#fde047', badge: '#b45309', text: '#ffffff', sub: '#fef08a' },
      tiffany:      { name: '티파니 민트',    primary: '#042220', accent: '#2dd4bf', badge: '#0f766e', text: '#ffffff', sub: '#99f6e4' },
      synthwave:    { name: '신스웨이브 80s', primary: '#1e102a', accent: '#ec4899', badge: '#a21caf', text: '#ffffff', sub: '#fbcfe8' },
      nardo:        { name: '나르도 그레이',  primary: '#18181b', accent: '#e2e8f0', badge: '#52525b', text: '#ffffff', sub: '#94a3b8' },
      racing_green: { name: '브리티시 그린',  primary: '#052317', accent: '#10b981', badge: '#064e3b', text: '#ffffff', sub: '#6ee7b7' },
      solar:        { name: '솔라 플레어',    primary: '#270a00', accent: '#f97316', badge: '#c2410c', text: '#ffffff', sub: '#fdba74' },
      matte_bronze: { name: '매트 브론즈',    primary: '#1c1512', accent: '#d97706', badge: '#92400e', text: '#ffffff', sub: '#fcd34d' },
      amethyst:     { name: '아메지스트 딥',  primary: '#160b24', accent: '#a855f7', badge: '#6b21a8', text: '#ffffff', sub: '#d8b4fe' },
      deep_ocean:   { name: '딥 오션 틸',     primary: '#031a24', accent: '#06b6d4', badge: '#0e7490', text: '#ffffff', sub: '#a5f3fc' },
      desert_sand:  { name: '사하라 데저트',  primary: '#1c1815', accent: '#eab308', badge: '#854d0e', text: '#ffffff', sub: '#fde68a' },
      hyper_red:    { name: '하이퍼 레드',    primary: '#200508', accent: '#ef4444', badge: '#b91c1c', text: '#ffffff', sub: '#fca5a5' },
      arctic_white: { name: '아크틱 퓨어',    primary: '#0a0d14', accent: '#ffffff', badge: '#1e293b', text: '#ffffff', sub: '#94a3b8' }
    };

    const WIDGET_POOL = [
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
      'MONTHLY_PAYMENT_HERO',
      'COMMENT_DM_MAGNET',
      'RACING_RIBBON',
      'TECH_HUD',
      'LOWER_THIRD',
      'NEON_TITLE',
      'DYNAMIC_ISLAND',
      'SPEEDOMETER_RPM_DIAL',
      'VIP_BLACK_CARD',
      'SCRATCH_COUPON',
      'SMARTPHONE_NOTIF_STACK',
      'CONTRACT_STAMP_SIGN'
    ];

    const WIDGET_LABELS_RAW = {
      BREAKING_NEWS: '긴급 속보 티커',
      MAGAZINE_COVER: '매거진 커버 프레임',
      GIANT_DISCOUNT_STAMP: '슬롯머신 특가 스탬프',
      SPEC_FLOATING_TAGS: '3단 플로팅 스펙태그',
      KAKAO_CHAT_PAIR: '실제 카톡 대화창',
      RECEIPT_QUOTE: '영수증 견적 명세표',
      VS_FINANCE_BATTLE: '할부·렌트·리스 비교',
      CHECKLIST_GLASS: '글래스 체크리스트',
      STOCK_COUNTDOWN: '선점재고 잔여 게이지',
      SMARTKEY_DELIVERY: '스마트키 출고 배너',
      MONTHLY_PAYMENT_HERO: '월 납입금 히어로 보드',
      COMMENT_DM_MAGNET: '댓글 자동 DM 콜아웃',
      RACING_RIBBON: '사선 레이싱 리본',
      TECH_HUD: '3D 미래형 HUD 타겟',
      LOWER_THIRD: '방송국 와이드 하단바',
      NEON_TITLE: '초대형 사이버 네온타이틀',
      DYNAMIC_ISLAND: '다이내믹 아일랜드 팝업',
      SPEEDOMETER_RPM_DIAL: 'RPM 속도계 다이얼',
      VIP_BLACK_CARD: 'VIP 블랙 메탈카드',
      SCRATCH_COUPON: '스크래치 특가 쿠폰',
      SMARTPHONE_NOTIF_STACK: '스마트폰 3단 알림스택',
      CONTRACT_STAMP_SIGN: '공식출고 서명 인감도장'
    };
    // 업종이 자동차가 아니면 위젯 이름도 업종 말로 (음식점에 '견적'·'출고'가 보이지 않게)
    const WIDGET_LABELS_IND = {
      RECEIPT_QUOTE: '영수증 안내표', VS_FINANCE_BATTLE: '가격·혜택 비교', SMARTKEY_DELIVERY: '완료 축하 배너',
      MONTHLY_PAYMENT_HERO: '가격 히어로 보드', RACING_RIBBON: '사선 리본', SPEEDOMETER_RPM_DIAL: '게이지 다이얼',
      CONTRACT_STAMP_SIGN: '확인 도장', STOCK_COUNTDOWN: '선착순 잔여 게이지', TECH_HUD: '포커스 타겟'
    };
    const WIDGET_LABELS = new Proxy(WIDGET_LABELS_RAW, {
      get(target, k) {
        if (typeof k !== 'string' || !(k in target)) return target[k];
        if (typeof IND !== 'undefined' && IND.key !== 'auto') return WIDGET_LABELS_IND[k] || indWord(target[k]);
        return target[k];
      }
    });

    const ATMOSPHERE_FX_OPTIONS = [
      { id: 'anamorphic_flare', name: '시네마틱 렌즈 플레어' },
      { id: 'speed_lines',      name: '고속 질주 스피드라인' },
      { id: 'cyber_scanlines',  name: '사이버네틱 스캔라인' },
      { id: 'bokeh_sparkles',   name: '럭셔리 골드 보케' },
      { id: 'film_grain',       name: '클래식 필름 그레인' },
      { id: 'studio_clean',     name: '스튜디오 클린 림라이트' }
    ];

    const PROCEDURAL_HOOKS = [
      '🚨 [긴급속보] 전국 잔여 취소차량 3대 즉시출고 배정!',
      '⚡ 오늘 계약 시 이번 주 자택 앞 무료 탁송 도착!',
      '💸 최대 할인 + 카마스터 비공식 지원금 풀패키지 방출',
      '👑 단 1% VIP만을 위한 감성 플래그십 리미티드 에디션',
      '⚖️ 할부 vs 장기렌트, 아직도 비교 안 하면 500만원 손해!',
      '☕ 하루 커피 두 잔 값으로 시작하는 신차 오너의 꿈',
      '🏢 대표님 주목! 연 1,500만원 합법적 전액 비용처리 플랜',
      '🏎️ 심장을 울리는 폭발적 배기음과 서킷 레이싱 퍼포먼스',
      '⏱️ 무서류 비대면 모바일 10분 심사 즉시 통과 완료',
      '💬 "진짜 감동했습니다" 출고 고객 100% 실화 카톡 후기',
      '🏕️ 주말이 기다려지는 2열 풀플랫 차박 캠핑 에디션',
      '🔍 허위매물 0%! 성능점검 무사고 원본 직인 팩트 공개',
      '🎁 카마스터 마진 포기! 썬팅+블박+유리막 8종 풀패키지 증정',
      '🛸 1회 충전 500km+ 정부 보조금 잔여분 즉시 선점!',
      '📉 취등록세 0원 + 자동차세 0원 + 초기비용 0원 설계',
      '💎 압도적인 하차감과 풀옵션 프리미엄 시네마틱 화보',
      '🔥 이번 달 마감 전 한정 배정! 지금 잡아야 이득입니다',
      '🏆 누적 출고 1,200대 돌파 기념 고객 감사 특별 할인',
      '🔑 계약서 도장 찍는 즉시 전국 어디든 당일 캐리어 탁송',
      '🛡️ 출고 후 10년 평생 사후관리 보증 자동차 주치의'
    ];

    const PROCEDURAL_CUT1 = [
      '🚨 긴급 속보! 전국 잔여 재고 3대 한정 배정',
      '⚡ 대기 6개월 NO! 선점 물량 확보로 이번 주 즉시출고',
      '👑 도로 위의 예술품, 감성 플래그십 에디션',
      '⚖️ 할부 vs 렌트, 모르면 수백만원 손해봅니다',
      '💬 "진짜 감동했습니다" 출고 고객 리얼 카톡 후기',
      '🛸 차세대 스마트 테크, 1회 충전 500km 주행',
      '🏢 대표님 주목! 연간 1,500만원 100% 비용처리',
      '🏎️ 레이싱 DNA 탑재! 최고출력 380마력 서킷 퍼포먼스',
      '💼 보증금 0원 + 선수금 0원! 목돈 한 푼 없이 바로 시작',
      '⏱️ 서류 제출 없이 스마트폰으로 10분 즉시 승인',
      '🏕️ 주말 가족 힐링 2열 풀플랫 완벽 평탄화 공간',
      '🔍 국토부 공인 성능점검 무사고 완전 직인 확인',
      '🎁 카마스터 사비 180만원 투입! 신차 8종 풀패키지 시공',
      '🔥 이번 달 마지막 특별 배정! 선착순 마감 임박',
      '💎 압도적 비주얼과 최고급 나파가죽 풀옵션',
      '📉 취등록세 0원 + 자동차세 0원 올인원 포함',
      '🔑 계약 즉시 3일 이내 고객님 자택 당일 도착',
      '✨ 광활한 파노라마 선루프와 서라운드뷰 탑재',
      '🏆 고객 만족도 5.0 만점 인증 카마스터 추천',
      '☕ 하루 커피 한잔 값으로 완성하는 프리미엄 라이프'
    ];

    const PROCEDURAL_CUT2 = [
      '✨ 최고급 나파가죽 & 12.3인치 파노라믹 커브드 디스플레이',
      '🛡️ 첨단 ADAS 주행보조 시스템 + 9에어백 세이프티 풀패키지',
      '📉 취등록세 0원 + 공채할인 0원 + 초기비용 전액 무보증',
      '🔍 단차·도장 결함 제로! 36가지 신차 정밀 검수 완료',
      '⚡ 복잡한 심사 NO! 프리랜서·신규사업자도 모바일 10분 패스',
      '🔋 800V 초급속 충전 시스템으로 18분 만에 80% 충전',
      '🏁 제로백 4초대 주파 & 전자식 가변배기 다이내믹 사운드',
      '📊 감가상각 걱정 제로! 전자세금계산서 매월 자동발행',
      '🧳 동급 최대 트렁크 적재용량 + 골프백 4개 완벽 수납',
      '💧 침수·전손 이력 0건! 하부 누유 및 부식 100% 무결점',
      '🎁 전면+측후면 반사썬팅 & QHD 2채널 블랙박스 장착',
      '🎩 1:1 전담 카마스터의 프라이빗 신차 검수 및 리포트',
      '📱 스마트폰 원격 스마트 주차 보조 시스템 기본 탑재',
      '💡 프로젝션 LED 헤드램프 & 웰컴 라이트 시퀀셜 턴시그널',
      '☕ 월 납입금 부담 제로! 전 금융사 실시간 최저금리 확정',
      '🌟 2열 통풍시트 & 독립 풀오토 에어컨 패밀리 맞춤형',
      '🚗 선점 물량 3대 확보! 계약 즉시 전용 트랜스포터 배송',
      '🛡️ 제조사 공식 보증에 카마스터 2년 추가 무상 안심 케어',
      '💳 다이렉트 캐피탈 제휴로 최저 이율 견적서 실시간 산출',
      '🥇 전국 카마스터 판매 1위 공식 인증 카마스터의 프리미엄 케어'
    ];

    const PROCEDURAL_CUT3 = [
      '💸 최대 공식할인 + 카마스터 비공식 특별지원 더블 혜택',
      '☕ 하루 커피 두 잔 값, 부담 없는 월 납입금 설계',
      '📈 신차가 대비 감가 혜택 종결자, 역대 최고 가성비',
      '🏛️ 법인 및 개인사업자 100% 합법 절세 컨설팅 적용',
      '⚡ 2026 전기차 국고·지자체 보조금 잔여분 즉시 차감',
      '🎁 프리미엄 썬팅+유리막코팅+코일매트 전액 무상 시공',
      '📉 할부 대비 장기렌트 500만원 절약 견적 전격 공개',
      '🏆 이번 주 계약 고객 한정 주유상품권 20만원권 추가',
      '🛡️ 1년 20,000km 엔진·미션 공식 무상 보증서 발급',
      '🏎️ 서킷 전용 퍼포먼스 에어로 파츠 무상 장착 패키지',
      '💼 보증금 0% 선택 가능! 초기비용 없이 오늘 바로 출고',
      '🔑 계약 고객 전원 고급 가죽 스마트키 케이스 증정',
      '💰 최저 월 납입금 플랜으로 예산 부담 완벽 해소',
      '📊 금융사 다이렉트 비교로 매월 8만원 추가 절감',
      '✨ 출고 전 전문 디테일링 샵 외장 세라믹 코팅 완료',
      '🚙 기존 타시던 중고차 최고가 매입 + 대차 추가 할인',
      '🔥 선착순 3대 한정 특별 프로모션, 이번 주 마감',
      '🏷️ 공식 카탈로그 가격 대비 파격적인 카마스터 특가 적용',
      '💳 무이자 분할 납부 프로모션 적용으로 이자 0원',
      '🤝 투명한 원가 공개로 거품 없는 정직한 실구매가 확정'
    ];

    const PROCEDURAL_CUT4 = [
      '🔑 계약 즉시 3일 이내 고객님 자택 앞 당일 안전 탁송!',
      '📲 지금 바로 댓글에 [견적] 남기시면 1분 비공식 DM 발송',
      '🎩 공식 인증 카마스터가 직접 찾아가는 1:1 방문 인도',
      '🤝 평생 든든한 자동차 주치의, 10년 사후관리 약속드립니다',
      '⚡ 잔여 재고 단 2대! 선착순 마감 전 서둘러 문의주세요',
      '📞 프로필 링크 클릭 시 실시간 다이렉트 견적표 즉시 전송',
      '🎁 이번 주 출고 고객 8종 신차 풀패키지 100% 무상 지급',
      '🏎️ 단 한 번의 시승으로 확인하는 압도적인 주행 감각',
      '💼 비대면 10분 모바일 심사로 오늘 바로 승인 완료하세요',
      '⭐️ 전국 1,200대 출고 신화, 믿고 맡겨주시면 만족을 드립니다',
      '🚚 전국 어디든 제주도까지 무료 안전 캐리어 탁송 지원',
      '📱 댓글 남겨주시면 카마스터 비공식 시크릿 조건표를 보내드립니다',
      '🛡️ 결함 걱정 제로! 무결점 신차 출고 확인서 현장 교부',
      '☕ 친절하고 부담 없는 1:1 맞춤 견적 상담 지금 시작하세요',
      '🎉 오늘이 가장 저렴합니다! 이번 달 특판 혜택 놓치지 마세요',
      '🏆 고객 만족도 5.0 만점의 감동을 직접 경험해 보세요',
      '💎 당신의 품격을 완성할 최고의 선택, 지금 함께합니다',
      '🚙 시승차 완비! 지금 문의하시면 원하시는 장소로 찾아갑니다',
      '🏁 준비된 차량은 단 3대, 다음 기회는 6개월 뒤입니다',
      '✨ 계약부터 출고·사후관리까지 책임지는 공식 카마스터'
    ];

    let campaign = {
      presetKey: 'sorento',
      themeId: 'royal',
      scenePlan: [
        { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
        { cut: 2, widget: 'KAKAO_CHAT_PAIR', pos: 'center', cam: 1 },
        { cut: 3, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 2 },
        { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
      ],
      hook: presets.sorento.hook,
      vehicle: presets.sorento.vehicle,
      discountNum: presets.sorento.discountNum,
      discount: presets.sorento.discount,
      bullets: [...presets.sorento.bullets],
      cutCaptions: [
        '대기 6개월? 선점 재고 4대 즉시출고 확정!',
        '파노라믹 디스플레이 & 2열 독립 캡틴시트 완비',
        '최대 -480만원 혜택 · 월 46만원대 최저금리',
        '계약 즉시 스마트키 인도!'
      ],
      ttsLines: [
        '쏘렌토 하이브리드, 이번 달 비밀 조건!',
        '선점 재고 4대, 이번 주 바로 출고.',
        '최대 480만 원 할인, 월 46만 원대.',
        '계약하면 바로 출고해 드립니다.'
      ],
      kakaoChat: [
        { role: 'customer', text: '팀장님! 쏘렌토 하브 지금 계약하면 진짜 6개월 기다려야 하나요? 😭' },
        { role: 'dealer', text: '아닙니다 고객님! 인기 색상 선점 물량 4대 확보해둬서 이번 주 바로 출고 가능합니다 🚗' },
        { role: 'customer', text: '오 대박!! 초기비용 0원으로 하면 월 납입금이랑 할인은 얼마나 되나요?' },
        { role: 'dealer', text: '최대 480만원 특판 혜택 들어가서 월 46만원대입니다! 아래 견적서 바로 보내드렸어요 👇' }
      ],
      bgGradient: presets.sorento.bgGradient,
      neonColor: presets.sorento.neonColor,
      hasCustomVideo: false,
      uploadedPhotos: [] // Image 객체 배열 (다중 사진 3D Ken Burns 슬라이드용)
    };

    // ============================================================================
    // ★ 12대 프로 세일즈 스토리 스타일 아키타입 (Story Arc Presets - 루틴 완전 탈피!)
    // ============================================================================
// ============================================================================
    // ★ 36대 프로 세일즈 스토리 스타일 아키타입 (Story Arc Presets - 루틴 완전 탈피!)
    // 6개 카테고리 × 6개 고유 스타일 = 36종 큐레이션 프리셋 + 무제한 AI 커스텀 저장
    // ============================================================================
    const BASE_STORY_ARCHETYPES = {
      vlog_delivery: {
        id: 'vlog_delivery',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "🎬 출고 브이로그",
        shortTitle: "출고VLOG",
        tagline: "고객님 차 출고하는 하루를 브이로그로",
        icon: "🎬",
        themeId: 'royal',
        accentColor: '#facc15',
        hook: "오늘은 신차 출고하는 날! 같이 가보실래요?",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["오늘은 고객님 새 차 출고하는 날, 아침부터 설레요", "썬팅·블랙박스 시공까지 꼼꼼하게 마무리", "드디어 키 전달! 고객님 표정이 다 말해주네요", "다음 출고 주인공은 당신, 댓글에 [견적]"],
        ttsLines: ["오늘은 고객님 새 차 출고하는 날이라 아침부터 설레네요.", "썬팅이랑 블랙박스까지 꼼꼼하게 마무리했습니다.", "드디어 키를 전달해 드렸어요. 고객님 표정이 다 말해주네요.", "다음 출고 주인공이 되고 싶으시면 댓글에 견적이라고 남겨주세요."]
      },
      vlog_day: {
        id: 'vlog_day',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "☀️ 카마스터의 하루",
        shortTitle: "하루VLOG",
        tagline: "전시장 오픈부터 출고까지 하루 기록",
        icon: "☀️",
        themeId: 'royal',
        accentColor: '#f97316',
        hook: "카마스터의 하루, 이렇게 흘러갑니다",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["오전 9시, 전시장 문 열고 하루 시작", "시승 고객님 모시고 함께 드라이브", "오후엔 출고 차량 최종 점검 꼼꼼하게", "오늘도 출고 완료! 상담은 댓글로 편하게"],
        ttsLines: ["오전 아홉 시, 전시장 문을 열고 하루를 시작합니다.", "시승 예약하신 고객님을 모시고 함께 드라이브를 다녀왔어요.", "오후에는 내일 출고할 차량을 꼼꼼하게 점검합니다.", "오늘도 출고 완료! 궁금한 점은 댓글로 편하게 물어봐 주세요."]
      },
      vlog_inspect: {
        id: 'vlog_inspect',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "🔍 출고 전 점검",
        shortTitle: "점검VLOG",
        tagline: "출고 전날 차량을 하나하나 확인하는 과정",
        icon: "🔍",
        themeId: 'royal',
        accentColor: '#16a34a',
        hook: "출고 전날, 이렇게까지 확인합니다",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["출고 전날, 외관부터 하나하나 체크", "실내 옵션과 소모품까지 리스트대로 확인", "조명 켜고 작은 흠집까지 다시 확인", "이렇게 꼼꼼하게 출고해요, 댓글에 [견적]"],
        ttsLines: ["출고 전날, 차량 외관부터 하나하나 확인합니다.", "실내 옵션과 소모품까지 체크리스트대로 점검해요.", "조명을 켜고 작은 흠집이 없는지 한 번 더 봅니다.", "이렇게 꼼꼼하게 출고해 드려요. 댓글에 견적이라고 남겨주세요."]
      },
      vlog_family: {
        id: 'vlog_family',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "👨‍👩‍👧 가족 첫차 출고",
        shortTitle: "가족첫차",
        tagline: "가족의 첫 패밀리카 출고 이야기",
        icon: "👨‍👩‍👧",
        themeId: 'royal',
        accentColor: '#ec4899',
        hook: "우리 가족 첫 패밀리카 출고하는 날",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["온 가족이 함께 기다린 첫 패밀리카", "카시트 설치까지 직접 도와드렸어요", "첫 가족사진은 새 차 앞에서 찰칵", "우리 가족 차 상담도 댓글로 남겨주세요"],
        ttsLines: ["온 가족이 함께 기다린 첫 패밀리카 출고 날입니다.", "카시트 설치까지 제가 직접 도와드렸어요.", "첫 가족사진은 새 차 앞에서 함께 찍었습니다.", "우리 가족 차도 상담받고 싶으시면 댓글로 남겨주세요."]
      },
      vlog_first: {
        id: 'vlog_first',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "🔑 사회초년생 첫 차",
        shortTitle: "첫차VLOG",
        tagline: "생애 첫 차를 받는 순간",
        icon: "🔑",
        themeId: 'royal',
        accentColor: '#2563eb',
        hook: "생애 첫 차, 키 받는 순간",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["첫 월급 모아 생애 첫 차 계약한 고객님", "부담 줄인 월 납입 플랜으로 맞춤 설계", "키 받는 순간, 저까지 뭉클했어요", "첫 차 고민 중이라면 댓글에 [견적]"],
        ttsLines: ["첫 월급을 모아 생애 첫 차를 계약하신 고객님입니다.", "부담을 줄인 월 납입 플랜으로 맞춤 설계해 드렸어요.", "키를 건네드리는 순간, 저까지 뭉클했습니다.", "첫 차 고민 중이시라면 댓글에 견적이라고 남겨주세요."]
      },
      vlog_long: {
        id: 'vlog_long',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "🚚 장거리 직접 출고",
        shortTitle: "장거리VLOG",
        tagline: "먼 지역 고객님께 직접 찾아가는 출고",
        icon: "🚚",
        themeId: 'royal',
        accentColor: '#0ea5e9',
        hook: "먼 곳까지 직접 찾아가는 출고 브이로그",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["먼 지역 고객님께 차 전달하러 출발", "휴게소에서 잠깐, 차 상태 다시 확인", "도착! 직접 만나 인수 설명까지 완료", "전국 어디든 찾아갑니다, 댓글로 문의"],
        ttsLines: ["먼 지역에 계신 고객님께 차를 전달하러 출발합니다.", "휴게소에서 잠깐 쉬면서 차 상태를 다시 확인했어요.", "도착해서 직접 만나 인수 설명까지 마쳤습니다.", "전국 어디든 찾아갑니다. 궁금하신 점은 댓글로 문의해 주세요."]
      },
      vlog_qa: {
        id: 'vlog_qa',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "💬 출고 전 자주 묻는 질문",
        shortTitle: "QnA VLOG",
        tagline: "출고 전 고객님들이 많이 묻는 질문 정리",
        icon: "💬",
        themeId: 'royal',
        accentColor: '#8b5cf6',
        hook: "출고 전에 가장 많이 받는 질문 3가지",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["출고 전 가장 많이 받는 질문 모아봤어요", "Q. 계약부터 출고까지 얼마나 걸리나요?", "Q. 탁송이랑 직접 인수, 뭐가 나을까요?", "나머지 궁금증은 댓글로, [견적]도 함께"],
        ttsLines: ["출고 전에 고객님들이 가장 많이 물어보시는 질문을 모아봤어요.", "계약부터 출고까지 기간은 차종과 재고에 따라 달라서 바로 확인해 드려요.", "탁송과 직접 인수는 일정과 거리에 맞춰 편한 쪽으로 정하시면 됩니다.", "나머지 궁금한 점은 댓글로 남겨주세요. 견적도 함께 보내드릴게요."]
      },
      vlog_night: {
        id: 'vlog_night',
        category: 'vlog',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: "🌙 퇴근 전 하루 정리",
        shortTitle: "하루정리",
        tagline: "출고 일정을 마치고 돌아보는 하루",
        icon: "🌙",
        themeId: 'royal',
        accentColor: '#a855f7',
        hook: "출고 일정 끝! 퇴근 전 하루 정리",
        discountNum: 300,
        discount: '출고 고객 감사 혜택',
        scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 }, { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
        cutCaptions: ["오늘 출고 일정 무사히 마무리", "내일 출고 차량 서류 미리 챙겨두기", "고객님 감사 문자에 피로가 싹", "내일의 출고 주인공, 댓글에 [견적]"],
        ttsLines: ["오늘 출고 일정을 무사히 마무리했습니다.", "내일 출고할 차량 서류도 미리 챙겨둡니다.", "고객님이 보내주신 감사 문자에 피로가 싹 풀리네요.", "내일의 출고 주인공이 되고 싶으시면 댓글에 견적이라고 남겨주세요."]
      },
      // ------------------------------------------------------------------------
      // [1] 특판 & 즉시출고 (category: 'special') - 6종
      // ------------------------------------------------------------------------
      clearance: {
        id: 'clearance',
        category: 'special',
        layoutMode: 'BROADCAST_NEWS',
        title: '⚡ 긴급 한정특판형',
        shortTitle: '한정특판',
        tagline: '선착순 배정 · 취소차 긴급 확보 · 카운트다운 게이지',
        icon: '⚡',
        themeId: 'crimson',
        accentColor: '#f43f5e',
        hook: '🚨 [긴급배정] 선착순 취소차량 3대 즉시출고!',
        discountNum: 480,
        discount: '월 39만원대 · 선착순 마감임박',
        scenePlan: [
          { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🚨 긴급 속보! 전국 잔여 재고 3대 한정 배정',
          '⚡ 선착순 재고 소진 임박! 취소차량 긴급 확보',
          '💸 최대 -480만원 공식할인 + 카마스터 비공식 지원',
          '🔑 계약 즉시 3일 이내 고객님 자택 당일 탁송!'
        ],
        ttsLines: [
          '긴급 속보! 전국 잔여 취소 차량 세 대가 한정 배정되었습니다.',
          '선착순 소진 임박! 이번 주 마감 전 즉시 배정됩니다.',
          '최대 사백팔십만 원 공식 특판 혜택을 놓치지 마세요.',
          '계약 즉시 삼 일 이내 고객님 자택으로 당일 탁송해 드립니다.'
        ]
      },
      timedeal_flash: {
        id: 'timedeal_flash',
        category: 'special',
        layoutMode: 'DDAY_COUNTDOWN',
        title: '⏱️ 마감 임박 타임어택형',
        shortTitle: '타임어택',
        tagline: '오늘 24시 특판 마감 · 실시간 잔여 카운트다운 · 지점장 승인',
        icon: '⏱️',
        themeId: 'solar',
        accentColor: '#f59e0b',
        hook: '⏱️ [오늘 24시 종료] 지점장 특별 승인 타임어택!',
        discountNum: 520,
        discount: '월 42만원대 · 24시 자동 마감',
        scenePlan: [
          { cut: 1, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 1 },
          { cut: 3, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⏱️ 마감 임박! 오늘 밤 12시까지만 적용되는 특별 조건',
          '🔥 지점장 결재 완료! 전산 락 해제된 단독 할인율',
          '💰 공식 할인에 지점 특별 마진까지 전액 차감 방출',
          '💬 댓글에 [견적] 남기시면 마감 전 조건표 즉시 발송'
        ],
        ttsLines: [
          '오늘 밤 열두 시까지만 적용되는 타임어택 특별 조건입니다.',
          '지점장 승인 완료! 전산 락이 해제된 극비 할인율입니다.',
          '공식 할인에 지점 특별 마진까지 모두 차감하여 방출합니다.',
          '댓글에 견적이라고 남기시면 마감 전 전용 조건표를 즉시 보내드립니다.'
        ]
      },
      cancel_stock: {
        id: 'cancel_stock',
        category: 'special',
        layoutMode: 'CANCEL_STOCK',
        title: '🔥 법인 취소차 당일배정형',
        shortTitle: '법인취소차',
        tagline: '법인 대량 취소분 발생 · 대기 0일 당일 출고 · 특별 저금리',
        icon: '🔥',
        themeId: 'royal',
        accentColor: '#3b82f6',
        hook: '🔥 [단독] 법인 계약 취소차량 2대 발생! 즉시 당일 출고',
        discountNum: 580,
        discount: '대기 0일 당일 배정 · 특별 할인',
        scenePlan: [
          { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔥 대기 6개월 차종! 법인 취소로 즉시 출고 물량 확보',
          '📋 인기 선호 옵션 풀장착 완벽 신차 사양',
          '💳 대기업 전용 특판 금리 승계로 이자 절감 혜택',
          '🚀 서류 접수 당일 번호판 등록 및 자택 탁송 보장'
        ],
        ttsLines: [
          '대기 육 개월 인기 차종이 법인 계약 취소로 즉시 배정됩니다.',
          '선호도 일위 옵션이 모두 장착된 완벽한 신차 사양입니다.',
          '대기업 전용 특판 금리를 그대로 승계하여 이자를 대폭 아낄 수 있습니다.',
          '접수 당일 번호판 등록과 함께 고객님 자택으로 직배송됩니다.'
        ]
      },
      clearance_event: {
        id: 'clearance_event',
        category: 'special',
        layoutMode: 'CANCEL_STOCK',
        title: '🏷️ 분기 마감 재고 땡처리형',
        shortTitle: '재고땡처리',
        tagline: '2026 분기 마감 실적 털기 · 마진 0원 원가 출고 · 비공식 최대',
        icon: '🏷️',
        themeId: 'emerald',
        accentColor: '#10b981',
        hook: '🏷️ 2026 분기 마감 재고 땡처리! 마진 0원 원가 출고',
        discountNum: 650,
        discount: '원가 출고 · 비공식 지원 최대',
        scenePlan: [
          { cut: 1, widget: 'SLANTED_STAMP', pos: 'center', cam: 0 },
          { cut: 2, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏷️ 분기 실적 마감 전산 털기! 원가 이하 한정 방출',
          '💥 영업사원 판매 수수료 전액 환원 할인 적용',
          '📉 시중 견적서 들고 오시면 무조건 추가 50만원 더 DC',
          '💬 댓글에 [견적] 적으시면 타사 비교 견적서 즉시 회신'
        ],
        ttsLines: [
          '분기 실적 마감을 위해 원가 이하 한정 방출을 시작합니다.',
          '영업 수수료 전액을 고객 할인으로 환원해 드립니다.',
          '타사 견적서를 보여주시면 무조건 추가 오십만 원 더 할인해 드립니다.',
          '댓글에 견적이라고 남겨주시면 즉시 타사 비교 견적서를 보내드립니다.'
        ]
      },
      monthly_target: {
        id: 'monthly_target',
        category: 'special',
        layoutMode: 'DDAY_COUNTDOWN',
        title: '🎯 당월 실적 마감 특판형',
        shortTitle: '실적마감',
        tagline: '당월 판매 목표 달성용 마진 포기 · 전산 락 해제 · 선착순',
        icon: '🎯',
        themeId: 'deepblue',
        accentColor: '#1d4ed8',
        hook: '🎯 지점 판매 목표 1대 남음! 전산 마진 100% 포기 방출',
        discountNum: 490,
        discount: '월 38만원대 · 지점장 승인',
        scenePlan: [
          { cut: 1, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎯 딱 한 대만 채우면 지점 1등! 남은 마진 전부 포기합니다',
          '✍️ 본사 공식 계약서 날인 기준 최저 마진 보증',
          '📲 금융사 심사 10분 컷 무보증 전액 승인 패스',
          '🎁 최고급 틴팅+블랙박스+코팅 지점장 사비 무상 시공'
        ],
        ttsLines: [
          '딱 한 대만 채우면 지점 일등, 남은 마진을 모두 포기합니다.',
          '본사 공식 계약서 날인 기준으로 최저 마진을 보증합니다.',
          '금융사 심사 십 분 만에 초기비용 영원으로 전액 승인됩니다.',
          '최고급 틴팅과 블랙박스, 유리막 코팅까지 무상 장착해 드립니다.'
        ]
      },
      weekend_special: {
        id: 'weekend_special',
        category: 'special',
        layoutMode: 'FLASH_DEAL',
        title: '⚡ 주말 게릴라 번개특판형',
        shortTitle: '주말게릴라',
        tagline: '토·일 주말 계약 고객 한정 · 기름값 100만원 지원 · 즉시 계약',
        icon: '⚡',
        themeId: 'amber',
        accentColor: '#d97706',
        hook: '⚡ [주말 한정] 이번 주말 계약 시 주유권 100만원 추가 증정!',
        discountNum: 440,
        discount: '주유권 100만원 + 주말 특판',
        scenePlan: [
          { cut: 1, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 0 },
          { cut: 2, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 1 },
          { cut: 3, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚡ 토·일 주말 상담 예약자 전원 모바일 주유권 100% 증정',
          '📉 주말 한정 본사 비공개 카마스터 프로모션 중복 적용',
          '🧾 실시간 영수증 견적 투명 비교! 부대비용 거품 제로',
          '💬 댓글에 [견적] 남기시고 주말 사은품 먼저 선점하세요'
        ],
        ttsLines: [
          '이번 주말 상담 예약 고객 전원에게 주유 상품권을 증정합니다.',
          '주말 한정 비공개 프로모션이 중복 적용되는 찬스입니다.',
          '부대비용 거품 없는 투명한 실시간 영수증 견적을 확인하세요.',
          '댓글에 견적이라고 남기시고 주말 한정 사은품을 먼저 챙겨가세요.'
        ]
      },
      exhibition_car: {
        id: 'exhibition_car',
        category: 'special',
        layoutMode: 'FLASH_DEAL',
        title: '🏢 전시장 전시차 파격할인형',
        shortTitle: '전시차특가',
        tagline: '무주행 0km 전시장 실물 전시차 · 단독 500만원 추가할인 · 즉시출고',
        icon: '🏢',
        themeId: 'deepblue',
        accentColor: '#2563eb',
        hook: '🏢 [전시차 특별방출] 실주행 0km 전시차 500만원 파격 할인!',
        discountNum: 520,
        discount: '전시차 전용 -500만 추가할인',
        scenePlan: [
          { cut: 1, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏢 전시장 로테이션 전시차량 딱 1대! 무주행 신차 상태 보증',
          '🔍 잔기스 하나 없는 36개 항목 정밀 외관 광택 검수 완료',
          '📉 신차 가격에서 전시차 전용 500만원 즉시 차감 적용',
          '🔑 계약 당일 번호판 등록 및 자택 캐리어 직송 가능'
        ],
        ttsLines: [
          '전시장 교체 주기 도래로 무주행 전시차량을 특별 방출합니다.',
          '외관 검수와 광택 케어를 완벽하게 마친 무결점 상태입니다.',
          '정상 출고가에서 전시차 특별 할인 오백만 원을 즉시 깎아드립니다.',
          '계약 즉시 당일 번호판 등록과 함께 집 앞까지 배송해 드립니다.'
        ]
      },
      pre_registered: {
        id: 'pre_registered',
        category: 'special',
        layoutMode: 'SECRET_DOSSIER',
        title: '🔑 대리점 선등록 신차 특판형',
        shortTitle: '선등록신차',
        tagline: '실주행 없는 선등록 서류상 중고 · 취등록세 지원 · 번개배정',
        icon: '🔑',
        themeId: 'crimson',
        accentColor: '#dc2626',
        hook: '🔑 [선등록 특판] 실주행 10km 미만 신차급! 취등록세 100% 지원',
        discountNum: 560,
        discount: '취등록세 100% 전액 지원',
        scenePlan: [
          { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'VS_FINANCE_BATTLE', pos: 'center', cam: 1 },
          { cut: 3, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🚨 지점 실적용 선등록 완료! 서류상 중고, 실물은 100% 새차',
          '⚖️ 할부·리스 대비 취등록세 300만원 지점 대납 전액 지원',
          '⏳ 서류 이전만 하면 끝! 대기기간 0일 번개 즉시출고',
          '💬 댓글에 [선등록] 남기시면 등록증 및 옵션표 즉시 전송'
        ],
        ttsLines: [
          '지점 실적 달성을 위해 등록만 해둔 완벽한 새 차입니다.',
          '취등록세를 지점에서 전액 지원하여 초기비용을 아껴드립니다.',
          '복잡한 대기 없이 서류 이전 즉시 당일 인도가 가능합니다.',
          '댓글에 선등록이라고 남겨주시면 실제 차량 등록증을 보내드립니다.'
        ]
      },
      black_friday: {
        id: 'black_friday',
        category: 'special',
        layoutMode: 'FLASH_DEAL',
        title: '🛍️ 카마스터 블랙프라이데이형',
        shortTitle: '블프특판',
        tagline: '연중 최대 할인 폭탄 · 본사 공식 프로모션 더블 중복 · 선착순',
        icon: '🛍️',
        themeId: 'obsidian',
        accentColor: '#f59e0b',
        hook: '🛍️ 1년에 단 한 번! 카마스터 블랙프라이데이 전산 오픈',
        discountNum: 630,
        discount: '연중 최대 -630만원 블프 특판',
        scenePlan: [
          { cut: 1, widget: 'SCRATCH_COUPON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 1 },
          { cut: 3, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛍️ 1년에 딱 한 번! 연중 최대 할인율 블프 코드 전산 오픈',
          '🎟️ 스크래치 시크릿 쿠폰 + 카마스터 비공식 수수료 전액 환원',
          '⚡ 인기 차종 3대 선착순! 먼저 긁으시는 분이 오너가 됩니다',
          '💬 댓글에 [블프] 남기시면 비공개 블프 쿠폰 즉시 발급'
        ],
        ttsLines: [
          '일 년에 단 한 번뿐인 블랙프라이데이 전산 코드가 열렸습니다.',
          '시크릿 할인 쿠폰과 수수료 전액을 차감해 최대 혜택을 드립니다.',
          '인기 모델 선착순 세 대, 먼저 선점하시는 분이 주인공입니다.',
          '댓글에 블프라고 남겨주시면 비공개 할인 쿠폰을 발급해 드립니다.'
        ]
      },
      fleet_discount: {
        id: 'fleet_discount',
        category: 'special',
        layoutMode: 'SECRET_DOSSIER',
        title: '🏢 대기업 임직원 특판 승계형',
        shortTitle: '임직원특판',
        tagline: '대기업 제휴 단체 할인율 · 최우수 우대금리 · 일반인 승계 배정',
        icon: '🏢',
        themeId: 'deepblue',
        accentColor: '#0ea5e9',
        hook: '🏢 대기업 임직원 전용 단체특판 잔여분! 일반 고객 특별 배정',
        discountNum: 490,
        discount: '월 37만원대 · 제휴 우대금리',
        scenePlan: [
          { cut: 1, widget: 'SPEC_FLOATING_TAGS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏢 대기업 제휴 단체 납품 계약 잔여 물량 2대 긴급 배정',
          '📊 일반 고객님께도 임직원 전용 특별 우대 금리 그대로 적용',
          '🧾 불필요한 부대비용 제로! 투명한 실견적서 발행',
          '🎁 최고급 틴팅+유리막+블랙박스 기업 패키지 무상 시공'
        ],
        ttsLines: [
          '대기업 단체 제휴 계약에서 남은 잔여 물량을 긴급 배정합니다.',
          '일반 고객님께도 기업 임직원 전용 최저 우대 금리를 적용해 드립니다.',
          '거품 없는 투명한 실견적서로 최상의 조건을 확인하세요.',
          '신차 출고에 필요한 모든 프리미엄 시공을 무상 지원합니다.'
        ]
      },
      quota_rush: {
        id: 'quota_rush',
        category: 'special',
        layoutMode: 'DDAY_COUNTDOWN',
        title: '⏳ 본사 배정 쿼터 마감형',
        shortTitle: '쿼터마감',
        tagline: '지점 월 배정 쿼터 소진 임박 · 마진 0% 전산 방출 · 막차 탑승',
        icon: '⏳',
        themeId: 'crimson',
        accentColor: '#e11d48',
        hook: '⏳ [쿼터 마감 2시간 전] 본사 추가 쿼터 소진 시 즉시 종료!',
        discountNum: 510,
        discount: '월 40만원대 · 쿼터 긴급 소진',
        scenePlan: [
          { cut: 1, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'BREAKING_NEWS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⏳ 이번 달 본사 직영 배정 쿼터 마지막 잔여분 소진 돌입',
          '🚨 지금 놓치면 다음 분기까지 최소 4개월 출고 대기',
          '💰 지점 마진 0% 선언! 오직 실적을 위해 전액 할인 반영',
          '💬 댓글에 [견적] 남기시고 마지막 쿼터 슬롯을 잡으세요'
        ],
        ttsLines: [
          '이번 달 본사 직영 쿼터의 마지막 잔여분 소진이 임박했습니다.',
          '지금 기회를 놓치시면 다음 분기까지 네 달을 기다리셔야 합니다.',
          '지점 마진을 전혀 남기지 않고 전액 할인으로 돌려드립니다.',
          '댓글에 견적이라고 남기시고 마지막 출고 슬롯을 선점하세요.'
        ]
      },
      holiday_express: {
        id: 'holiday_express',
        category: 'special',
        layoutMode: 'BROADCAST_NEWS',
        title: '🏖️ 명절 연휴 즉시출고 배정형',
        shortTitle: '연휴특급',
        tagline: '명절 귀성길 신차 타고 고향 가기 · 연휴 전 100% 자택 인도',
        icon: '🏖️',
        themeId: 'solar',
        accentColor: '#ea580c',
        hook: '🏖️ 이번 연휴 고향길은 새 차로! 연휴 전 완벽 인도 보증',
        discountNum: 460,
        discount: '연휴 전 100% 자택 배송',
        scenePlan: [
          { cut: 1, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏖️ 연휴 귀성길, 가족들과 새 차 타고 편안하고 당당하게 출발',
          '⚡ 당일 전자계약 체결 시 연휴 전 무조건 자택 도착 보증',
          '🛡️ 장거리 안전 주행 패키지 무상 점검 및 시공 완료',
          '🔑 스마트키 들고 고향으로 떠나는 행복한 신차 인도'
        ],
        ttsLines: [
          '이번 연휴에는 가족들과 반짝이는 새 차를 타고 고향으로 떠나보세요.',
          '당일 전자계약으로 연휴 전 무조건 자택 인도를 보증합니다.',
          '장거리 안전 운전을 위한 필수 용품 시공까지 꼼꼼히 마쳤습니다.',
          '스마트키를 들고 떠나는 설레는 신차 라이프를 선물해 드립니다.'
        ]
      },
      end_of_year: {
        id: 'end_of_year',
        category: 'special',
        layoutMode: 'CANCEL_STOCK',
        title: '❄️ 연말 총결산 창고 대방출형',
        shortTitle: '연말총결산',
        tagline: '연말 마감 대량 털기 · 마진 전액 포기 · 1년 중 최대 조건',
        icon: '❄️',
        themeId: 'emerald',
        accentColor: '#059669',
        hook: '❄️ [연말 총결산] 1년 치 남은 재고 원가 이하 총력 방출!',
        discountNum: 680,
        discount: '연말 결산 최대 -680만원',
        scenePlan: [
          { cut: 1, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '❄️ 연말 지점 총결산! 해 넘어가기 전 전산 재고 100% 털어냅니다',
          '📉 마진을 남기지 않고 원가 이하로 깎아주는 1년 중 유일한 타이밍',
          '🧾 영수증 투명 견적 공개! 숨은 부대비용 1원도 없음',
          '💬 댓글에 [연말] 남겨주시면 총결산 시크릿 조건표 발송'
        ],
        ttsLines: [
          '연말 총결산을 맞아 해가 넘어가기 전 잔여 재고를 모두 털어냅니다.',
          '마진을 포기하고 원가 이하로 드리는 일 년 중 가장 좋은 타이밍입니다.',
          '영수증 투명 견적으로 부대비용 없는 깔끔한 출고를 약속합니다.',
          '댓글에 연말이라고 남겨주시면 결산 전용 조건표를 보내드립니다.'
        ]
      },
      last_chance: {
        id: 'last_chance',
        category: 'special',
        layoutMode: 'BROADCAST_NEWS',
        title: '🚨 전국 단 1대 잔여스펙 선점형',
        shortTitle: '단1대선점',
        tagline: '가장 인기 있는 색상·풀옵션 전국 1대 잔여 · 빠른 손 승리',
        icon: '🚨',
        themeId: 'crimson',
        accentColor: '#f43f5e',
        hook: '🚨 [전국 단 1대] 선호옵션 풀장착 인기 컬러 즉시 선점!',
        discountNum: 470,
        discount: '월 38만원대 · 전국 1대 한정',
        scenePlan: [
          { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SPEC_FLOATING_TAGS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🚨 긴급 전산 포착! 선호도 1위 옵션 조합 전국 잔여 단 1대',
          '⏳ 다른 카마스터가 잡기 전에 가계약금 10만원으로 전산 락 필수',
          '✨ 파노라마선루프+헤드업디스플레이 풀옵션 황금 스펙',
          '💬 댓글에 [선점] 남기시면 차량 전산 락 즉시 걸어드립니다'
        ],
        ttsLines: [
          '전국 전산에서 포착된 선호도 일등 황금 옵션 조합 단 한 대입니다.',
          '다른 곳에서 채가기 전에 전산 락을 걸어야만 잡으실 수 있습니다.',
          '선루프와 헤드업 디스플레이까지 완벽하게 갖춘 인기 스펙입니다.',
          '댓글에 선점이라고 남겨주시면 즉시 차량 락을 잡아드립니다.'
        ]
      },
      zero_margin: {
        id: 'zero_margin',
        category: 'special',
        layoutMode: 'FLASH_DEAL',
        title: '📉 카마스터 마진 전액 환원형',
        shortTitle: '마진0원',
        tagline: '카마스터 영업수수료 0원 선언 · 최저마진 전산공개 · 고객 환원',
        icon: '📉',
        themeId: 'deepblue',
        accentColor: '#3b82f6',
        hook: '📉 [원가 공개] 카마스터 수수료 0원! 남은 마진 전액 돌려드립니다',
        discountNum: 540,
        discount: '마진 전액 환원 특판',
        scenePlan: [
          { cut: 1, widget: 'VS_FINANCE_BATTLE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📉 영업사원 판매 수당 전액을 고객님 할인으로 100% 환원',
          '🧾 공식 전산 원가표를 투명하게 공개하는 양심 견적',
          '✍️ 본사 정식 계약서 날인 기준으로 철저한 품질 보증',
          '🔑 전국 어디서나 추가 수수료 없는 무방문 당일 출고'
        ],
        ttsLines: [
          '영업사원 판매 수당을 전액 깎아서 고객님께 돌려드립니다.',
          '공식 전산 원가표를 가감 없이 투명하게 공개합니다.',
          '본사 정식 계약서 날인 기준으로 안심하고 출고하실 수 있습니다.',
          '추가 수수료 없이 전국 어디서든 집 앞 배송을 받아보세요.'
        ]
      },
      secret_coupon: {
        id: 'secret_coupon',
        category: 'special',
        layoutMode: 'SECRET_DOSSIER',
        title: '🎟️ 게릴라 시크릿 쿠폰 즉시할인형',
        shortTitle: '시크릿쿠폰',
        tagline: '영상 시청자 전용 비공개 할인 쿠폰 · 바코드 즉시 전송',
        icon: '🎟️',
        themeId: 'solar',
        accentColor: '#f59e0b',
        hook: '🎟️ [영상 시청자 전용] 70만원 추가할인 시크릿 바코드 증정',
        discountNum: 590,
        discount: '시크릿 쿠폰 70만원 즉시적용',
        scenePlan: [
          { cut: 1, widget: 'SCRATCH_COUPON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎟️ 인스타 릴스 영상 시청 고객님께만 열리는 시크릿 할인 바코드',
          '📱 댓글 작성 시 70만원 추가 할인 쿠폰이 DM으로 자동 발송',
          '💥 기존 공식 할인에 쿠폰 할인까지 더블 중복 차감 적용',
          '💬 댓글에 [쿠폰] 두 글자만 남기시면 바코드 즉시 쏴드립니다'
        ],
        ttsLines: [
          '릴스 영상을 시청해 주신 고객님께만 드리는 비밀 할인 바코드입니다.',
          '댓글을 남기시면 칠십만 원 추가 할인 쿠폰이 디엠으로 자동 발송됩니다.',
          '기존 공식 할인에 쿠폰까지 중복으로 혜택을 챙겨가실 수 있습니다.',
          '댓글에 쿠폰이라고 두 글자만 남겨주시면 즉시 바코드를 쏴드립니다.'
        ]
      },

      // ------------------------------------------------------------------------
      // [2] 시네마틱 & 럭셔리 (category: 'luxury') - 16종
      // ------------------------------------------------------------------------
      luxury: {
        id: 'luxury',
        category: 'luxury',
        layoutMode: 'EDITORIAL_VOGUE',
        title: '🎬 시네마틱 프리미엄형',
        shortTitle: '시네마틱',
        tagline: '시네마틱 럭셔리 에디토리얼 · 플래그십 VIP 의전 · 나파가죽',
        icon: '🎬',
        themeId: 'royal',
        accentColor: '#d4af37',
        hook: '👑 감탄이 터지는 플래그십 아우라, VIP 전용 특별출고',
        discountNum: 620,
        discount: '월 58만원대 · VIP 프라이빗 컨시어지',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '👑 압도적 존재감, 당신의 품격을 완성할 플래그십 에디션',
          '✨ 최고급 나파가죽 · 서라운드뷰 · 풀옵션 사양',
          '🏛️ 법인 및 개인사업자 100% 비용처리 세무 컨설팅',
          '🎩 공식 인증 카마스터의 1:1 VIP 프라이빗 인도'
        ],
        ttsLines: [
          '압도적인 존재감, 당신의 품격을 완성할 플래그십 에디션입니다.',
          '최고급 나파 가죽과 서라운드 뷰 풀옵션이 적용되었습니다.',
          '법인 및 개인사업자 전액 비용처리가 가능한 맞춤 컨설팅을 제공합니다.',
          '공식 인증 카마스터가 직접 최고급 인도를 약속드립니다.'
        ]
      },
      night_drive: {
        id: 'night_drive',
        category: 'luxury',
        layoutMode: 'VVIP_CONCIERGE',
        title: '🌃 나이트 드라이브 네온시티형',
        shortTitle: '나이트시티',
        tagline: '심야 도심 네온 감성 · 앰비언트 라이트 풀가동 · 감성 드라이빙',
        icon: '🌃',
        themeId: 'neon',
        accentColor: '#f43f5e',
        hook: '🌃 도심의 밤을 지배하는 앰비언트 라이트 감성 드라이브',
        discountNum: 580,
        discount: '월 52만원대 · 감성 나이트팩',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌃 어두운 밤을 수놓는 64색 앰비언트 무드 라이팅',
          '🎵 프리미엄 사운드 시스템이 완성하는 나만의 음악 홀',
          '✨ 시선이 머무는 곳마다 빛나는 미래지향적 실내 인테리어',
          '🔑 퇴근길이 기다려지는 꿈의 드라이빙 머신'
        ],
        ttsLines: [
          '어두운 밤을 황홀하게 수놓는 육십사 색 앰비언트 무드 라이팅입니다.',
          '프리미엄 사운드 시스템이 완성하는 콘서트홀 같은 음향을 누려보세요.',
          '시선이 머무는 곳마다 빛나는 미래지향적 럭셔리 인테리어입니다.',
          '매일 퇴근길이 기다려지는 당신만의 시네마틱 드라이브를 시작하세요.'
        ]
      },
      vvip_concierge: {
        id: 'vvip_concierge',
        category: 'luxury',
        layoutMode: 'VVIP_CONCIERGE',
        title: '💎 VVIP 쇼퍼드리븐 의전형',
        shortTitle: '쇼퍼의전',
        tagline: '회장님 전용 쇼퍼드리븐 · 최고급 나파가죽 리클라이닝 · 프라이빗 케어',
        icon: '💎',
        themeId: 'obsidian',
        accentColor: '#e2e8f0',
        hook: '💎 격이 다른 VVIP 쇼퍼드리븐, 품격 있는 비즈니스의 완성',
        discountNum: 740,
        discount: '월 68만원대 · VIP 프라이빗 컨시어지',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'MAGAZINE_COVER', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💎 2열 항공기 퍼스트클래스 릴렉션 컴포트 시트 장착',
          '🔇 이중접합 차음 글래스와 액티브 노이즈 캔슬링의 고요함',
          '👔 의전 전담 카마스터의 1:1 비밀 방문 상담 서비스',
          '💬 댓글에 [견적] 남기시면 VIP 프라이빗 제안서 전송'
        ],
        ttsLines: [
          '이열 항공기 퍼스트클래스 리클라이닝 시트가 탑재되었습니다.',
          '이중접합 차음 글래스로 도심 속 완벽한 정숙성을 선사합니다.',
          '의전 전담 카마스터가 직접 찾아가는 일대일 방문 상담을 진행합니다.',
          '댓글에 견적이라고 남겨주시면 프라이빗 전용 제안서를 보내드립니다.'
        ]
      },
      monaco_yacht: {
        id: 'monaco_yacht',
        category: 'luxury',
        layoutMode: 'MONACO_MARINE',
        title: '🛥️ 모나코 요트 클럽 마린형',
        shortTitle: '요트마린',
        tagline: '딥오션 틸 & 지중해 요트 감성 · 프리미엄 크루징 · 휴양지 라이프',
        icon: '🛥️',
        themeId: 'teal',
        accentColor: '#14b8a6',
        hook: '🛥️ 지중해 요트를 품은 프리미엄 크루징 라이프',
        discountNum: 590,
        discount: '월 49만원대 · 마린 럭셔리 에디션',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛥️ 지중해 럭셔리 요트의 우드 데크를 재현한 실내 감성',
          '🌊 바다를 품은 딥오션 틸 컬러와 프리미엄 화이트 나파가죽',
          '🏖️ 주말 휴양지 드라이브를 위한 파노라마 와이드 뷰',
          '🔑 공식 카마스터 직영 출고 웰컴 패키지 무상 제공'
        ],
        ttsLines: [
          '지중해 요트의 품격을 그대로 담아낸 우아한 실내 인테리어입니다.',
          '바다를 닮은 딥오션 틸 컬러와 화이트 나파 가죽의 환상적 조화입니다.',
          '주말 교외 드라이브를 위한 탁 트인 파노라마 뷰를 자랑합니다.',
          '공식 카마스터 직영 출고 웰컴 기프트 세트를 무상으로 증정합니다.'
        ]
      },
      black_obsidian: {
        id: 'black_obsidian',
        category: 'luxury',
        layoutMode: 'BLACK_OBSIDIAN',
        title: '🖤 블랙 옵시디언 올블랙형',
        shortTitle: '올블랙다크',
        tagline: '크롬 딜리트 다크 에디션 · 다크 티타늄 휠 · 극강의 절제미',
        icon: '🖤',
        themeId: 'stealth',
        accentColor: '#71717a',
        hook: '🖤 올블랙 다크 에디션, 시선을 압도하는 묵직한 카리스마',
        discountNum: 550,
        discount: '올블랙 패키지 · 한정 출고',
        scenePlan: [
          { cut: 1, widget: 'SLANTED_STAMP', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🖤 모든 크롬 라인을 지운 다크 옵시디언 스페셜 에디션',
          '🕶️ 20인치 다크 티타늄 휠 & 블랙 캘리퍼 풀 커스텀',
          '🛡️ 고급 스모키 틴팅 무상 시공으로 완벽한 프라이버시',
          '💬 댓글에 [견적] 남기시면 올블랙 에디션 잔여재고 안내'
        ],
        ttsLines: [
          '모든 크롬 라인을 과감하게 지운 다크 옵시디언 한정판입니다.',
          '이십 인치 다크 티타늄 휠과 블랙 캘리퍼가 완벽한 조화를 이룹니다.',
          '고급 스모키 틴팅 무상 시공으로 완벽한 프라이버시를 지켜드립니다.',
          '댓글에 견적이라고 남기시면 다크 에디션 잔여 재고를 즉시 안내해 드립니다.'
        ]
      },
      letterbox_film: {
        id: 'letterbox_film',
        category: 'luxury',
        layoutMode: 'CANNES_FILM',
        title: '🎞️ 헐리우드 와이드 시네필름형',
        shortTitle: '시네필름',
        tagline: '2.39:1 아나모픽 와이드 비율 · 필름 그레인 텍스처 · 예술적 색감',
        icon: '🎞️',
        themeId: 'amber',
        accentColor: '#f59e0b',
        hook: '🎞️ 영화의 한 장면처럼, 당신의 일상이 시네마가 됩니다',
        discountNum: 600,
        discount: '월 48만원대 · 시네마틱 스페셜',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎞️ 헐리우드 아나모픽 렌즈의 깊이감과 예술적 시네마 톤',
          '🎬 매 순간이 영화가 되는 독보적인 드라이빙 포지션',
          '✨ 클래식 프리미엄 사운드와 함께하는 감성 여정',
          '🔑 공식 카마스터가 전하는 품격 있는 출고 스토리'
        ],
        ttsLines: [
          '영화의 한 장면처럼 깊이 있는 아나모픽 시네마 톤을 연출합니다.',
          '운전대를 잡는 모든 순간이 특별한 영화가 됩니다.',
          '클래식 프리미엄 사운드와 함께 감성 가득한 여정을 떠나보세요.',
          '공식 카마스터가 품격 있는 당신만의 출고 스토리를 전합니다.'
        ]
      },
      presidential_armored: {
        id: 'presidential_armored',
        category: 'luxury',
        layoutMode: 'BLACK_OBSIDIAN',
        title: '🛡️ 방탄 VIP 프레지덴셜형',
        shortTitle: '방탄프레지덴셜',
        tagline: '국빈 의전 리무진 · 최고 등급 방탄 및 프라이빗 보안 · 절대적 안락함',
        icon: '🛡️',
        themeId: 'royal',
        accentColor: '#d4af37',
        hook: '🛡️ 국빈급 의전의 품격! 프라이빗 세이프티 리무진 에디션',
        discountNum: 950,
        discount: '월 98만원대 · VIP 국빈 의전 플랜',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛡️ 국빈 의전 차량에 준하는 최고 등급 프라이빗 세이프티 설계',
          '🔒 3중 차음 이중접합 라미네이티드 글래스로 완성한 무소음 정숙성',
          '🛋️ 퍼스트 클래스 리클라이너와 최고급 세미 아닐린 가죽의 조화',
          '🔑 VVIP 전문 프라이빗 컨시어지가 1:1 방문 인도를 약속드립니다'
        ],
        ttsLines: [
          '국빈 의전 차량에 준하는 최고 등급 프라이빗 세이프티 설계가 적용되었습니다.',
          '삼중 차음 글래스로 외부 소음을 완벽히 차단하여 절대적 정숙을 선사합니다.',
          '퍼스트 클래스 리클라이너 시트로 최상의 편안함을 경험해 보세요.',
          '브이 브이 아이 피 전문 컨시어지가 고객님을 위해 직접 방문 인도해 드립니다.'
        ]
      },
      maybach_two_tone: {
        id: 'maybach_two_tone',
        category: 'luxury',
        layoutMode: 'VVIP_CONCIERGE',
        title: '👑 투톤 비스포크 마이바흐형',
        shortTitle: '비스포크투톤',
        tagline: '핸드페인팅 듀얼 코트 · 장인 정신의 정점 · 독보적 아우라',
        icon: '👑',
        themeId: 'royal',
        accentColor: '#fbbf24',
        hook: '👑 장인의 붓끝에서 완성된 투톤 비스포크의 독보적 아우라',
        discountNum: 880,
        discount: '월 89만원대 · 마이바흐 투톤 한정배정',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '👑 숙련된 장인의 핸드페인팅으로 완성되는 마이바흐 듀얼 톤 바디',
          '✨ 도로 위 시선을 압도하는 품격 있는 골드 앤 블랙 코트',
          '🥂 센터 콘솔 전용 샴페인 쿨러와 냉온 컵홀더 풀 옵션',
          '💬 댓글에 [견적] 남기시면 투톤 에디션 즉시 출고 재고 배정'
        ],
        ttsLines: [
          '숙련된 장인의 핸드페인팅으로 완성되는 독보적인 마이바흐 투톤 바디입니다.',
          '도로 위 모든 시선을 압도하는 최상위 클래스의 품격을 보여줍니다.',
          '센터 콘솔 냉온 컵홀더와 샴페인 쿨러가 탑재된 최고급 사양입니다.',
          '댓글에 견적이라고 남겨주시면 즉시 출고 가능한 투톤 재고를 안내해 드립니다.'
        ]
      },
      golf_country_club: {
        id: 'golf_country_club',
        category: 'luxury',
        layoutMode: 'MONACO_MARINE',
        title: '⛳ 프라이빗 컨트리클럽 라운딩형',
        shortTitle: '골프라운딩',
        tagline: '골프백 4개 완벽 적재 트렁크 · 필드 라운딩 의전 · 하이엔드 주말 라이프',
        icon: '⛳',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '⛳ 골프백 4개 거뜬한 광활한 트렁크! 주말 라운딩 전용 플래그십',
        discountNum: 720,
        discount: '월 68만원대 · CC 라운딩 스페셜',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⛳ 캐디백 4개와 보스턴백이 여유롭게 들어가는 광활한 러기지 스페이스',
          '🏌️ 주말 명문 골프장 클럽하우스 정문에서 돋보이는 웅장한 실루엣',
          '💆 라운딩 후 피로를 풀어주는 18-웨이 에르고 모션 안마 시트',
          '💬 댓글에 [골프] 남기시면 명품 항공커버 및 타이틀리스트 골프공 증정'
        ],
        ttsLines: [
          '골프백 네 개와 보스턴백이 넉넉하게 들어가는 광활한 트렁크 공간을 제공합니다.',
          '주말 명문 골프장 클럽하우스 앞에서 압도적인 존재감을 뽐내 보세요.',
          '라운딩 후 지친 피로를 풀어주는 에르고 모션 마사지 시트가 기본 탑재됩니다.',
          '댓글에 골프라고 남겨주시면 프리미엄 골프 기프트 패키지를 함께 챙겨드립니다.'
        ]
      },
      champagne_gold: {
        id: 'champagne_gold',
        category: 'luxury',
        layoutMode: 'EDITORIAL_VOGUE',
        title: '🍾 샴페인 골드 에디션형',
        shortTitle: '샴페인골드',
        tagline: '은은한 로즈골드 앰비언트 · 샴페인 쿨러 탑재 · 황금빛 럭셔리',
        icon: '🍾',
        themeId: 'royal',
        accentColor: '#f59e0b',
        hook: '🍾 황금빛 샴페인 한 잔의 여유, 최고급 실내 앰비언트 라운지',
        discountNum: 650,
        discount: '월 62만원대 · 샴페인 에디션',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🍾 은은하고 따뜻하게 실내를 감싸는 64색 샴페인 골드 앰비언트',
          '🥂 뒷좌석 전용 접이식 테이블과 리얼 알루미늄 콘솔 마감',
          '✨ 렉시콘 17스피커 서라운드 사운드로 즐기는 프라이빗 콘서트',
          '🔑 프리미엄 카마스터가 직접 전달하는 샴페인 패키지 출고'
        ],
        ttsLines: [
          '은은한 샴페인 골드 앰비언트 라이트가 실내를 따뜻하게 감싸줍니다.',
          '뒷좌석 전용 테이블과 고급 마감재로 최고급 라운지 공간을 완성했습니다.',
          '렉시콘 서라운드 사운드로 이동 중에도 나만의 음악회를 즐기실 수 있습니다.',
          '공식 카마스터가 품격 있는 샴페인 패키지와 함께 차량을 전달해 드립니다.'
        ]
      },
      first_class_cabin: {
        id: 'first_class_cabin',
        category: 'luxury',
        layoutMode: 'VVIP_CONCIERGE',
        title: '✈️ 퍼스트 클래스 에어로 캐빈형',
        shortTitle: '일등석캐빈',
        tagline: '항공기 일등석 리클라이너 · 무중력 릴렉션 시트 · 미래형 프리미엄',
        icon: '✈️',
        themeId: 'cyber',
        accentColor: '#38bdf8',
        hook: '✈️ 지상에서 즐기는 일등석! 원터치 무중력 릴렉션 시트',
        discountNum: 790,
        discount: '월 74만원대 · 퍼스트클래스 패키지',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '✈️ 버튼 하나로 누워 쉬는 원터치 무중력 릴렉션 릴리프 모드',
          '🌌 파노라믹 글래스 루프와 스타라이트 헤드라이너의 은하수 야경',
          '🔇 능동형 노면소음 저감 기술(ANC-R)로 실내 데시벨 최소화',
          '💬 댓글에 [일등석] 남기시면 VIP 전용 조건표 즉시 발송'
        ],
        ttsLines: [
          '원터치 버튼 하나로 항공기 일등석처럼 누워 쉴 수 있는 릴렉션 시트입니다.',
          '스타라이트 헤드라이너가 밤하늘 은하수 같은 환상적인 야경을 연출합니다.',
          '능동형 소음 저감 기술로 고속 주행 중에도 도서관 같은 정숙함을 유지합니다.',
          '댓글에 일등석이라고 남겨주시면 브이아이피 전용 조건표를 즉시 보내드립니다.'
        ]
      },
      sunset_boulevard: {
        id: 'sunset_boulevard',
        category: 'luxury',
        layoutMode: 'CANNES_FILM',
        title: '🌅 선셋 블러바드 골든아워형',
        shortTitle: '선셋블러바드',
        tagline: '노을빛 골든아워 시네마틱 · 해안도로 크루징 · 소프트 오픈에어링',
        icon: '🌅',
        themeId: 'amber',
        accentColor: '#f97316',
        hook: '🌅 붉게 물드는 석양 속을 달리는 낭만, 골든아워 크루징 에디션',
        discountNum: 610,
        discount: '월 55만원대 · 선셋 에디션',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌅 해안도로를 따라 펼쳐지는 영화 같은 석양의 황금빛 실루엣',
          '🌬️ 윈드 디플렉터와 넥워머로 사계절 쾌적한 오픈 드라이빙',
          '🎵 프리미엄 오디오 튜닝으로 바람 소리 속에서도 선명한 보컬',
          '🔑 로맨틱한 드라이브를 위한 전담 카마스터의 스페셜 딜'
        ],
        ttsLines: [
          '황금빛 노을을 배경으로 영화 같은 해안도로 드라이브를 즐겨보세요.',
          '넥워머와 윈드 디플렉터로 쌀쌀한 날씨에도 쾌적하게 오픈 드라이빙이 가능합니다.',
          '고급 튜닝 오디오로 바람 소리 속에서도 맑고 선명한 음악을 감상할 수 있습니다.',
          '로맨틱한 드라이빙 라이프를 전담 카마스터가 특별한 조건으로 안내해 드립니다.'
        ]
      },
      art_gallery: {
        id: 'art_gallery',
        category: 'luxury',
        layoutMode: 'MONACO_MARINE',
        title: '🏛️ 프라이빗 아트 갤러리형',
        shortTitle: '아트갤러리',
        tagline: '모던 미니멀리즘 큐레이션 · 미술관 쇼룸 전시 · 절제된 디자인 미학',
        icon: '🏛️',
        themeId: 'royal',
        accentColor: '#e2e8f0',
        hook: '🏛️ 달리는 현대 미술관! 절제된 미니멀리즘과 하이엔드 인테리어',
        discountNum: 700,
        discount: '월 66만원대 · 아트 큐레이션 팩',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏛️ 불필요한 장식을 덜어내고 선과 면의 완벽한 비례를 살린 익스테리어',
          '🪵 천연 오픈포어 리얼 우드 가니시와 알루미늄 다이얼의 하모니',
          '🎨 예술 작품처럼 소장 가치를 지닌 하이엔드 플래그십 세단',
          '💬 댓글에 [갤러리] 남기시면 미술관 도슨트급 1:1 상담 연결'
        ],
        ttsLines: [
          '불필요한 장식을 덜어내고 선과 면의 비례미를 극대화한 현대 미술 같은 디자인입니다.',
          '천연 원목 가니시와 정교한 알루미늄 다이얼이 감각적인 촉감을 전합니다.',
          '달리는 예술 작품처럼 오랫동안 소장하고 싶은 특별한 가치를 선물합니다.',
          '댓글에 갤러리라고 남겨주시면 미술관 도슨트처럼 차량을 상세히 안내해 드립니다.'
        ]
      },
      penthouse_valet: {
        id: 'penthouse_valet',
        category: 'luxury',
        layoutMode: 'BLACK_OBSIDIAN',
        title: '🏙️ 펜트하우스 프라이빗 발렛형',
        shortTitle: '펜트하우스발렛',
        tagline: '하이엔드 주거 전용 발렛 서비스 · 프리미엄 도어투도어 · VIP 전용 출고',
        icon: '🏙️',
        themeId: 'deepblue',
        accentColor: '#38bdf8',
        hook: '🏙️ 펜트하우스 로비 앞에 서는 순간, 최고급 발렛 전담 플랜',
        discountNum: 830,
        discount: '월 79만원대 · 펜트하우스 발렛 팩',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏙️ 최고급 레지던스 로비에서 가장 완벽하게 어우러지는 기품 있는 자세',
          '📲 스마트폰으로 주차 위치 확인 및 원격 시동 공조 제어 풀 지원',
          '🏎️ 발렛 전용 모드로 최고속도 및 개인정보 보호 잠금 기능 탑재',
          '💬 댓글에 [발렛] 남기시면 전담 카매니저가 자택 주차장으로 방문'
        ],
        ttsLines: [
          '최고급 펜트하우스 로비에 어울리는 기품 있고 당당한 실루엣을 자랑합니다.',
          '스마트폰으로 사전에 실내 온도를 완벽하게 맞추고 원격으로 시동을 걸 수 있습니다.',
          '발렛 전용 모드로 소중한 개인정보와 주행 데이터를 안전하게 보호합니다.',
          '댓글에 발렛이라고 남겨주시면 전담 매니저가 계신 곳으로 찾아가 차량을 안내해 드립니다.'
        ]
      },
      acoustic_hall: {
        id: 'acoustic_hall',
        category: 'luxury',
        layoutMode: 'CANNES_FILM',
        title: '🎼 콘서트홀 하이파이 오디오형',
        shortTitle: '하이파이오디오',
        tagline: '23스피커 뱅앤올룹슨 3D 사운드 · 3중 차음 유리 · 콘서트홀 사운드 스테이지',
        icon: '🎼',
        themeId: 'royal',
        accentColor: '#d4af37',
        hook: '🎼 달리는 링컨센터 콘서트홀! 23개 스피커 3D 입체 음향 시스템',
        discountNum: 670,
        discount: '월 63만원대 · 하이파이 사운드팩',
        scenePlan: [
          { cut: 1, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎼 뱅앤올룹슨 23채널 3D 서라운드 스피커로 재현하는 공연장의 현장감',
          '🎻 바이올린의 현 떨림까지 생생하게 전달하는 초고해상도 음원 재생',
          '🔇 액티브 노이즈 캔슬링이 구현한 압도적인 정막 속 순수한 선율',
          '💬 댓글에 [오디오] 남기시면 청음 전용 시승차 예약 배정'
        ],
        ttsLines: [
          '뱅앤올룹슨 이십삼 개 스피커가 콘서트홀 무대 정중앙에 앉은 듯한 감동을 선사합니다.',
          '현악기의 미세한 숨결까지 생생하게 살아나는 초고해상도 음질을 감상해 보세요.',
          '외부 소음을 지워주는 노이즈 캔슬링으로 음악에만 완벽히 몰입할 수 있습니다.',
          '댓글에 오디오라고 남겨주시면 청음 전용 시승차를 빠르게 예약해 드립니다.'
        ]
      },
      bespoke_couture: {
        id: 'bespoke_couture',
        category: 'luxury',
        layoutMode: 'EDITORIAL_VOGUE',
        title: '🪡 비스포크 오뜨 꾸뛰르형',
        shortTitle: '오뜨꾸뛰르',
        tagline: '1:1 맞춤형 가죽 스티치 · 나만의 퍼스널 컬러 빌드 · 세상 단 한 대의 차',
        icon: '🪡',
        themeId: 'royal',
        accentColor: '#fbbf24',
        hook: '🪡 장인의 한 땀 한 땀, 세상에 단 한 대뿐인 비스포크 꾸뛰르',
        discountNum: 920,
        discount: '월 91만원대 · 비스포크 인디비주얼',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🪡 고객님의 취향에 맞춘 수제 파이핑 스티치와 최고급 나파 가죽',
          '🎨 50여 가지 비스포크 외장 컬러 조합으로 완성하는 나만의 아이덴티티',
          '🖋️ 도어 스커프와 헤드레스트에 새겨지는 고객 전용 이니셜 각인',
          '🔑 공식 인증 카마스터의 1:1 맞춤 제작 오더 빌드 컨설팅'
        ],
        ttsLines: [
          '고객님의 안목에 맞춘 정교한 수제 스티치와 최고급 가죽으로 실내를 빚어냅니다.',
          '오십 가지 이상의 특별한 컬러 조합으로 세상에 단 하나뿐인 차량을 완성하세요.',
          '도어 스커프에 고객님의 영문 이니셜을 새겨 특별한 소장 가치를 더해 드립니다.',
          '공식 인증 마스터가 처음부터 끝까지 일대일 비스포크 빌드를 성심껏 도와드립니다.'
        ]
      },

      // ------------------------------------------------------------------------
      // [3] 미래 테크 & 전기차 EV (category: 'ev_tech') - 16종
      // ------------------------------------------------------------------------
      ev_future: {
        id: 'ev_future',
        category: 'ev_tech',
        layoutMode: 'CYBER_HUD',
        title: '⚡ 미래형 테크 & EV 전기차형',
        shortTitle: '미래테크EV',
        tagline: '사이버네틱 타겟 · 정부 보조금 선점 · 제로백 게이지',
        icon: '⚡',
        themeId: 'cyber',
        accentColor: '#00f0ff',
        hook: '🛸 [보조금 긴급] 2026 전기차 국고·지자체 지원금 선착순!',
        discountNum: 750,
        discount: '국고+지자체 최대 750만원 지원',
        scenePlan: [
          { cut: 1, widget: 'TECH_HUD', pos: 'center', cam: 0 },
          { cut: 2, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 3 }
        ],
        cutCaptions: [
          '🛸 1회 충전 500km 돌파! 최첨단 배터리 매니지먼트',
          '⚡ 2026 전기차 국고·지자체 보조금 잔여분 선착순 배정',
          '🔋 최대 750만원 지원금 즉시 차감 + 비공식 충전카드 증정',
          '⚡ 10분 초급속 충전 80% 달성, 이번 주 즉시 출고 가능!'
        ],
        ttsLines: [
          '일회 충전으로 오백 킬로미터 이상 주행하는 최첨단 전기차입니다.',
          '전기차 국고와 지자체 보조금 잔여분, 지금 선착순으로 배정됩니다.',
          '최대 칠백오십만 원 지원금 즉시 차감 혜택을 놓치지 마세요.',
          '십 분 초급속 충전 지원 모델, 이번 주 즉시 고객님께 인도됩니다.'
        ]
      },
      subsidy_race: {
        id: 'subsidy_race',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '🔋 지자체 보조금 100% 사수형',
        shortTitle: '보조금사수',
        tagline: '지역별 전기차 국고·지자체 보조금 잔여분 실시간 조회 · 선착순',
        icon: '🔋',
        themeId: 'glacier',
        accentColor: '#38bdf8',
        hook: '🔋 [보조금 긴급] 지자체 전기차 지원금 잔여 예산 100% 사수!',
        discountNum: 820,
        discount: '지역 보조금 최대 820만원 즉시 차감',
        scenePlan: [
          { cut: 1, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔋 지자체별 전기차 예산 조기 마감 임박! 선착순 마감',
          '📊 내 거주지 보조금 잔여 예산 1분 만에 전산 즉시 조회',
          '💸 출고가에서 보조금 전액 선할인 차감 반영',
          '💬 댓글에 [지역명] 남기시면 잔여 보조금 즉시 확인'
        ],
        ttsLines: [
          '지자체별 전기차 보조금 예산이 조기 마감되고 있습니다.',
          '고객님의 거주지 보조금 잔여액을 일 분 만에 전산 조회해 드립니다.',
          '차량 출고가에서 보조금을 즉시 차감하여 부담을 줄여드립니다.',
          '댓글에 사시는 지역명을 남겨주시면 잔여 보조금을 바로 알려드립니다.'
        ]
      },
      autopilot_ai: {
        id: 'autopilot_ai',
        category: 'ev_tech',
        layoutMode: 'AUTONOMOUS_LIDAR',
        title: '🤖 AI 오토파일럿 자율주행형',
        shortTitle: 'AI자율주행',
        tagline: '레벨2+ 고속도로 주행보조 · OTA 무선 소프트웨어 업데이트 · 스마트 인포',
        icon: '🤖',
        themeId: 'cyber',
        accentColor: '#06b6d4',
        hook: '🤖 고속도로 운전 피로도 0%! 첨단 AI 자율주행 탑재',
        discountNum: 670,
        discount: '월 45만원대 · 스마트 드라이빙 팩',
        scenePlan: [
          { cut: 1, widget: 'TECH_HUD', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🤖 내비게이션 기반 스마트 크루즈 & 고속도로 차선 자동 변경',
          '📲 원격 스마트 주차 보조! 좁은 주차장에서도 밖에서 출차',
          '📶 무선 OTA 업데이트로 항상 최신 AI 기능 유지',
          '🔑 출고 시 1:1 자율주행 조작법 완벽 가이드 제공'
        ],
        ttsLines: [
          '스마트 크루즈 컨트롤과 고속도로 자동 차선 변경이 적용되었습니다.',
          '스마트키로 차 밖에서 원격 주차와 출차가 가능합니다.',
          '무선 소프트웨어 업데이트로 늘 최신 자율주행 성능을 유지합니다.',
          '출고 당일 자율주행 조작법을 일대일로 상세히 안내해 드립니다.'
        ]
      },
      battery_telemetry: {
        id: 'battery_telemetry',
        category: 'ev_tech',
        layoutMode: 'BATTERY_TELEMETRY',
        title: '⚡ 배터리 SOH 100% 텔레메트리형',
        shortTitle: '배터리진단',
        tagline: '삼원계 NCM 고효율 배터리 · 1회 충전 520km 실주행 · 10년 20만km 보증',
        icon: '⚡',
        themeId: 'glacier',
        accentColor: '#38bdf8',
        hook: '⚡ 1회 충전 520km 주행! 배터리 무결점 수명 100% 검증',
        discountNum: 710,
        discount: '월 49만원대 · 10년 20만km 보증',
        scenePlan: [
          { cut: 1, widget: 'TECH_HUD', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚡ 최신 NCM 삼원계 배터리 장착! 열화율 0% 무결점 상태',
          '🛡️ 배터리 10년 20만km 제조사 공식 무상 보증 탑재',
          '🔌 초급속 충전 18분 만에 80% 충전 완료',
          '💬 댓글에 [견적] 남기시면 충전비 지원 바우처 증정'
        ],
        ttsLines: [
          '최신 고효율 배터리가 장착되어 열화 없이 신차 컨디션을 자랑합니다.',
          '배터리 십 년 이십만 킬로미터 무상 보증으로 안심하고 타실 수 있습니다.',
          '초급속 충전 십팔 분 만에 팔십 퍼센트까지 충전됩니다.',
          '댓글에 견적이라고 남기시면 충전비 지원 바우처를 보내드립니다.'
        ]
      },
      cyber_cockpit: {
        id: 'cyber_cockpit',
        category: 'ev_tech',
        layoutMode: 'CYBER_HUD',
        title: '🌐 미래형 파노라믹 커브드 디스플레이형',
        shortTitle: '사이버콕핏',
        tagline: '차세대 ccNC 커넥티비티 · 증강현실 HUD · 음성인식 제어',
        icon: '🌐',
        themeId: 'neon',
        accentColor: '#8b5cf6',
        hook: '🌐 전투기 콕핏처럼 펼쳐지는 차세대 증강현실 HUD',
        discountNum: 630,
        discount: '월 46만원대 · 테크놀로지 풀옵션',
        scenePlan: [
          { cut: 1, widget: 'TECH_HUD', pos: 'center', cam: 0 },
          { cut: 2, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌐 12.3인치 듀얼 파노라믹 커브드 디스플레이 탑재',
          '🛫 앞 유리에 그래픽으로 투영되는 증강현실 헤드업 디스플레이',
          '🗣️ "에어컨 켜줘, 창문 열어줘" 음성인식 차량 스마트 제어',
          '🔑 공식 카마스터 테크놀로지 패키지 특별 출고'
        ],
        ttsLines: [
          '십이점삼 인치 듀얼 파노라믹 커브드 디스플레이가 장착되었습니다.',
          '전면 유리에 그래픽으로 길을 안내하는 증강현실 헤드업 디스플레이입니다.',
          '자연어 음성 인식으로 차량의 모든 기능을 손쉽게 제어할 수 있습니다.',
          '공식 카마스터 전용 테크놀로지 풀옵션 특별 출고 모델입니다.'
        ]
      },
      zero_emission: {
        id: 'zero_emission',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '🌱 탄소중립 제로에미션 친환경형',
        shortTitle: '제로에코',
        tagline: '취등록세 최대 140만원 감면 · 공영주차장 50% 할인 · 남산터널 무료',
        icon: '🌱',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '🌱 취등록세 감면 + 공영주차장 반값! 실속형 친환경 혜택',
        discountNum: 580,
        discount: '친환경 세제혜택 풀적용',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌱 취등록세 140만원 즉시 감면 + 개별소비세 감면 혜택',
          '🅿️ 전국 공영주차장 50% 반값 & 혼잡통행료 100% 면제',
          '⚡ 고속도로 통행료 할인까지! 탈수록 돈 버는 친환경차',
          '💬 댓글에 [견적] 남기시고 세제 감면 총액을 확인하세요'
        ],
        ttsLines: [
          '취등록세 백사십만 원 감면과 개별소비세 감면이 동시 적용됩니다.',
          '전국 공영주차장 반값 할인과 혼잡통행료 면제 혜택을 누리세요.',
          '고속도로 통행료 할인까지 더해져 탈수록 유지비가 절약됩니다.',
          '댓글에 견적이라고 남겨주시면 총 세제 감면액을 계산해 드립니다.'
        ]
      },
      super_fast_charge: {
        id: 'super_fast_charge',
        category: 'ev_tech',
        layoutMode: 'BATTERY_TELEMETRY',
        title: '⚡ 800V 초고속 18분 완충형',
        shortTitle: '18분완충',
        tagline: '350kW 초급속 충전 아키텍처 · 커피 한 잔에 80% 완충 · 장거리 충전 스트레스 해소',
        icon: '⚡',
        themeId: 'cyber',
        accentColor: '#00f0ff',
        hook: '⚡ 커피 한 잔 마시는 18분이면 80% 충전 완료! 800V 초급속',
        discountNum: 680,
        discount: '월 49만원대 · 초고속 충전팩',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚡ 800V 초고전압 시스템으로 10%에서 80%까지 단 18분 완충',
          '☕ 고속도로 휴게소 커피 타임이면 이미 400km 주행 가능 충전',
          '🔋 배터리 컨디셔닝 시스템으로 겨울철에도 최고 충전 속도 유지',
          '💬 댓글에 [충전] 남기시면 1년 무제한 초고속 충전 크레딧 증정'
        ],
        ttsLines: [
          '팔백 볼트 초고전압 시스템으로 십 퍼센트에서 팔십 퍼센트까지 단 십팔 분이면 충전됩니다.',
          '휴게소에서 커피 한 잔 마시는 사이에 사백 킬로미터 주행 거리를 확보합니다.',
          '배터리 사전 예열 시스템으로 혹한기에도 최상의 충전 효율을 발휘합니다.',
          '댓글에 충전이라고 남겨주시면 일 년간 사용 가능한 충전 지원금을 드립니다.'
        ]
      },
      v2l_camping: {
        id: 'v2l_camping',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '🏕️ V2L 220V 차박 캠핑형',
        shortTitle: '차박V2L',
        tagline: '움직이는 대용량 파워뱅크 · 220V 일반 가전 풀가동 · 감성 글램핑 라이프',
        icon: '🏕️',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '🏕️ 캠핑장에서 전자레인지·에어컨 빵빵! 움직이는 220V 파워뱅크',
        discountNum: 590,
        discount: '월 46만원대 · V2L 캠핑 에디션',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏕️ 최대 3.6kW 대용량 V2L로 커피머신·인덕션·빔프로젝터 동시 구동',
          '🛏️ 2열 완전 평탄화 시트로 완성하는 럭셔리 감성 차박 라운지',
          '❄️ 시동 없이 밤새 켜두는 무소음 무진동 에어컨 & 히터 캠핑 모드',
          '🔑 출고 즉시 떠나는 V2L 전용 젠더 및 에어매트 사은품 증정'
        ],
        ttsLines: [
          '삼 점 육 킬로와트 대용량 전력으로 야외에서도 가정용 가전을 마음껏 사용하세요.',
          '이열 풀 플랫 시트로 아늑한 호텔급 차박 공간을 손쉽게 만드실 수 있습니다.',
          '엔진 소음과 매연 없이 밤새 시원한 에어컨과 따뜻한 난방을 유지합니다.',
          '출고 즉시 캠핑을 떠나실 수 있도록 정품 브이투엘 젠더를 함께 선물합니다.'
        ]
      },
      ota_update: {
        id: 'ota_update',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '📡 무선 OTA 평생 진화형',
        shortTitle: 'OTA무선진화',
        tagline: '무선 소프트웨어 업데이트 · 자고 일어나면 새 차가 되는 자율주행 진화 · SDV',
        icon: '📡',
        themeId: 'cyber',
        accentColor: '#38bdf8',
        hook: '📡 정비소 갈 필요 없이 자고 일어나면 새 차로 진화하는 무선 OTA',
        discountNum: 620,
        discount: '월 48만원대 · 평생 OTA 커넥티드',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📡 무선 통신으로 브레이크·서스펜션·자율주행 알고리즘 자동 성능 향상',
          '📱 스마트폰처럼 새로운 기능이 밤사이 자동 설치되는 차세대 SDV',
          '🌐 현대차 블루링크 5년 무상 기본 제공으로 원격 제어 완벽 호환',
          '💬 댓글에 [OTA] 남기시면 무선 소프트웨어 패키지 풀옵션 배정'
        ],
        ttsLines: [
          '서비스센터 방문 없이 무선 업데이트만으로 주행 성능과 자율주행이 진화합니다.',
          '스마트폰을 업데이트하듯 최신 기능이 차량에 자동으로 탑재되는 소프트웨어 중심 차량입니다.',
          '오 년간 무상 제공되는 커넥티드 서비스로 차량 상태를 원격 관리해 드립니다.',
          '댓글에 오티에이라고 남겨주시면 무선 진화 패키지 적용 차량을 안내해 드립니다.'
        ]
      },
      cyberpunk_cockpit: {
        id: 'cyberpunk_cockpit',
        category: 'ev_tech',
        layoutMode: 'CYBER_HUD',
        title: '🌌 사이버 콕핏 증강현실형',
        shortTitle: '사이버콕핏',
        tagline: '27인치 OLED 커브드 디스플레이 · AR 증강현실 내비게이션 · 앰비언트 인터랙션',
        icon: '🌌',
        themeId: 'neon',
        accentColor: '#a855f7',
        hook: '🌌 영화 속 우주선 조종석! 27인치 커브드 파노라믹 OLED 콕핏',
        discountNum: 710,
        discount: '월 52만원대 · 하이테크 콕핏 팩',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌌 27인치 일체형 파노라믹 커브드 디스플레이의 압도적 시인성',
          '🎯 도로 위에 직접 주행 경로를 투영하는 AR 증강현실 길안내',
          '🌈 음성 인식에 반응하여 살아 움직이듯 점등하는 다이내믹 앰비언트',
          '💬 댓글에 [콕핏] 남기시면 하이테크 옵션 무상 장착 프로모션'
        ],
        ttsLines: [
          '이십칠 인치 파노라믹 커브드 디스플레이가 마치 우주선 조종석에 앉은 기분을 줍니다.',
          '실제 도로 위에 화살표를 띄워주는 증강현실 내비게이션으로 길 찾기가 완벽해집니다.',
          '운전자의 음성에 맞춰 살아 숨쉬듯 반응하는 첨단 인터랙티브 조명을 만나보세요.',
          '댓글에 콕핏이라고 남겨주시면 첨단 디스플레이 풀패키지 차량을 우선 배정합니다.'
        ]
      },
      dual_motor_awd: {
        id: 'dual_motor_awd',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '🌪️ 듀얼 모터 전자식 사륜형',
        shortTitle: '듀얼모터AWD',
        tagline: '전후륜 듀얼 모터 600Nm 즉각 토크 · e-AWD 눈길 접지력 · 압도적 가속',
        icon: '🌪️',
        themeId: 'cyber',
        accentColor: '#06b6d4',
        hook: '🌪️ 눈길·빗길 걱정 제로! 600마력급 듀얼 모터 전자식 사륜 e-AWD',
        discountNum: 740,
        discount: '월 54만원대 · 듀얼모터 사륜구동',
        scenePlan: [
          { cut: 1, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'HUD_TELEMETRY', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌪️ 전륜과 후륜에 각각 탑재된 고출력 듀얼 모터의 폭발적인 즉각 토크',
          '❄️ 밀리초 단위로 구동력을 배분하여 결빙 도로에서도 미끄러짐 방지',
          '🚀 밟는 순간 뿜어져 나오는 제로백 4초대의 짜릿한 가속 성능',
          '💬 댓글에 [사륜] 남기시면 사륜구동 추가옵션 비용 전액 지원'
        ],
        ttsLines: [
          '전후륜 듀얼 모터가 즉각적인 토크를 뿜어내어 지체 없는 가속력을 선사합니다.',
          '밀리초 단위로 바퀴마다 구동력을 정밀 배분하여 빗길과 눈길에서도 안전합니다.',
          '페달을 밟는 즉시 머리가 젖혀지는 폭발적인 스포츠카급 가속감을 느껴보세요.',
          '댓글에 사륜이라고 남겨주시면 사륜구동 옵션 비용을 파격적으로 지원해 드립니다.'
        ]
      },
      one_pedal_drive: {
        id: 'one_pedal_drive',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '🦶 아이페달 스마트 원페달형',
        shortTitle: '원페달드라이브',
        tagline: '가속 페달 하나로 가속·감속·정차까지 완벽 제어 · 브레이크 패드 마모 제로',
        icon: '🦶',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '🦶 브레이크 밟을 일 없는 편안함! 가속과 정차를 페달 하나로',
        discountNum: 560,
        discount: '월 43만원대 · 스마트 드라이빙',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🦶 가속 페달에서 발을 떼는 것만으로 부드러운 감속부터 완전 정차까지',
          '🔋 회생제동 에너지로 주행거리는 늘리고 브레이크 패드 마모는 제로',
          '🚦 막히는 도심 출퇴근길 피로도를 절반 이하로 줄여주는 스마트 주행',
          '💬 댓글에 [원페달] 남기시면 초보자도 쉬운 원페달 전담 코칭 출고'
        ],
        ttsLines: [
          '가속 페달 하나로 출발과 감속, 완전 정차까지 부드럽게 제어할 수 있습니다.',
          '회생제동을 통해 버려지는 전기를 회수하여 주행 가능 거리를 극대화합니다.',
          '막히는 도심 출퇴근 시간에도 다리의 피로도를 획기적으로 덜어드립니다.',
          '댓글에 원페달이라고 남겨주시면 출고 당일 일대일 드라이빙 코칭을 제공합니다.'
        ]
      },
      digital_side_mirror: {
        id: 'digital_side_mirror',
        category: 'ev_tech',
        layoutMode: 'AUTONOMOUS_LIDAR',
        title: '📷 디지털 사이드 카메라 미러형',
        shortTitle: '디지털미러',
        tagline: '우천·야간 무결점 OLED 화면 · 사각지대 완전 제거 · 공기저항 최소화',
        icon: '📷',
        themeId: 'cyber',
        accentColor: '#38bdf8',
        hook: '📷 폭우가 쏟아져도 선명한 시야! 디지털 사이드 카메라 미러',
        discountNum: 640,
        discount: '월 47만원대 · 디지털 미러 패키지',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📷 거울 대신 고화질 OLED 모니터로 밤길과 비바람 속에서도 선명한 후방',
          '🛡️ 차선 변경 시 사각지대 위험 차량을 빨간색 가이드라인으로 직관적 경고',
          '💨 콤팩트한 카메라 디자인으로 풍절음 감소 및 전비 효율 극대화',
          '💬 댓글에 [미러] 남기시면 디지털 미러 옵션 장착차 즉시 출고'
        ],
        ttsLines: [
          '폭우가 쏟아지는 밤에도 물방울 맺힘 없이 선명한 초고화질 후방 화면을 보여줍니다.',
          '차선 변경 시 사각지대에 있는 위험 차량을 가이드라인으로 안전하게 알려줍니다.',
          '슬림한 카메라 바디로 공기저항을 줄여 풍절음과 주행 전비를 모두 개선했습니다.',
          '댓글에 미러라고 남겨주시면 디지털 사이드 미러 탑재 차량을 우선 배정해 드립니다.'
        ]
      },
      smart_summon: {
        id: 'smart_summon',
        category: 'ev_tech',
        layoutMode: 'AUTONOMOUS_LIDAR',
        title: '📱 원격 스마트 주차 어시스트형',
        shortTitle: '원격스마트주차',
        tagline: '차 밖에서 스마트키로 원격 전후진 입출차 · 좁은 문콕 주차장 탈출 솔루션',
        icon: '📱',
        themeId: 'cyber',
        accentColor: '#22c55e',
        hook: '📱 좁은 주차장 문콕 걱정 끝! 차 밖에서 키로 넣고 빼는 원격 주차',
        discountNum: 600,
        discount: '월 45만원대 · 원격 주차 솔루션',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📱 먼저 차에서 내린 뒤 스마트키 버튼 하나로 좁은 칸에 쏙 넣는 원격 주차',
          '🚪 양옆 차량 문콕 걱정 없이 널찍하게 짐 싣고 내리는 프리미엄 편의성',
          '🛑 장애물과 보행자를 감지하면 스스로 즉각 정지하는 360도 초음파 센서',
          '🔑 스마트 주차 마스터 카매니저의 1:1 조작법 완벽 시연 출고'
        ],
        ttsLines: [
          '좁은 주차 칸에 주차할 때 미리 내린 후 스마트키로 안전하게 차를 넣을 수 있습니다.',
          '문콕 스트레스 없이 짐을 편하게 싣고 여유롭게 탑승하세요.',
          '삼백육십도 센서가 장애물과 보행자를 감지하여 스스로 멈추므로 안심할 수 있습니다.',
          '공식 카매니저가 출고 현장에서 원격 주차 조작법을 친절히 시연해 드립니다.'
        ]
      },
      heatpump_winter: {
        id: 'heatpump_winter',
        category: 'ev_tech',
        layoutMode: 'TECH_ECO_V2L',
        title: '❄️ 영하 20도 고효율 히트펌프형',
        shortTitle: '히트펌프윈터',
        tagline: '폐열 회수 고효율 히트펌프 · 겨울철 주행거리 저하 최소화 · 윈터 배터리 케어',
        icon: '❄️',
        themeId: 'glacier',
        accentColor: '#38bdf8',
        hook: '❄️ 영하 20도 한파에도 주행거리 그대로! 폐열 회수 히트펌프 시스템',
        discountNum: 630,
        discount: '월 47만원대 · 윈터 히트펌프팩',
        scenePlan: [
          { cut: 1, widget: 'HUD_TELEMETRY', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '❄️ 모터와 인버터 폐열을 모아 난방에 재활용하는 고효율 히트펌프 탑재',
          '📉 겨울철 히터를 틀어도 주행거리 급감 없는 검증된 실주행 효율',
          '🔥 배터리 히팅 시스템으로 강추위 속에서도 급속 충전 속도 완벽 방어',
          '💬 댓글에 [히트펌프] 남기시면 겨울철 윈터 패키지 무상 업그레이드'
        ],
        ttsLines: [
          '전기장치에서 발생하는 폐열을 모아 실내 난방에 활용하는 고효율 시스템입니다.',
          '한겨울에도 주행거리 감소 걱정 없이 따뜻하고 쾌적하게 운전하실 수 있습니다.',
          '배터리 사전 히팅 기능으로 추운 날씨에도 고속 충전 성능을 유지합니다.',
          '댓글에 히트펌프라고 남겨주시면 윈터 패키지 업그레이드 혜택을 챙겨드립니다.'
        ]
      },
      battery_guarantee: {
        id: 'battery_guarantee',
        category: 'ev_tech',
        layoutMode: 'BATTERY_TELEMETRY',
        title: '🔋 배터리 평생 안심 보증형',
        shortTitle: '배터리보증',
        tagline: '10년 20만km 공식 보증 · 배터리 무상 교환 프로그램 · 안심 잔존가치 보장',
        icon: '🔋',
        themeId: 'teal',
        accentColor: '#22c55e',
        hook: '🔋 10년 20만km 배터리 무상 보증! 중고차 감가 걱정 없는 안심 플랜',
        discountNum: 700,
        discount: '10년 20만km 무상 보증 풀케어',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔋 10년 20만km 이내 배터리 용량 70% 이하 저하 시 100% 무상 교환',
          '🛡️ 현대 정품 배터리 진단 스캐너로 매년 정기 점검 무상 발급',
          '💰 3년 후 신차 교체 시 중고차 배터리 잔존가치 최고가 보장 확약',
          '💬 댓글에 [보증] 남기시면 공식 카마스터 평생 안심 보증서 동봉'
        ],
        ttsLines: [
          '십 년 이십만 킬로미터 동안 배터리 수명을 제조사가 완벽히 책임집니다.',
          '매년 정기 점검 시 공식 스캐너로 배터리 건강 상태를 투명하게 진단해 드립니다.',
          '삼 년 후 차를 바꾸실 때도 최고 수준의 잔존가치를 확정 보장해 드립니다.',
          '댓글에 보증이라고 남겨주시면 공식 평생 안심 보증서를 발급해 드립니다.'
        ]
      },

      // ------------------------------------------------------------------------
      // [4] 고성능 스포츠 & 레이싱 (category: 'sports') - 16종
      // ------------------------------------------------------------------------
      high_performance: {
        id: 'high_performance',
        category: 'sports',
        layoutMode: 'RACING_ACTION',
        title: '🏎️ 고성능 스포츠 다이내믹형',
        shortTitle: '스포츠서킷',
        tagline: '사선 레이싱 스트라이프 · 런치컨트롤 사운드 · 피트레인 뱃지',
        icon: '🏎️',
        themeId: 'crimson',
        accentColor: '#e11d48',
        hook: '🏁 심장을 뛰게 하는 0-100km 폭발적 가속, 서킷 머신 출고',
        discountNum: 490,
        discount: '월 45만원대 · 스포츠 패키지',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 1 },
          { cut: 3, widget: 'TECH_HUD', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏁 서킷의 DNA를 그대로, 폭발적인 드라이빙 다이내믹스',
          '⚡ 전자식 서스펜션과 고성능 대구경 브레이크 시스템',
          '💥 당월 스포츠 라인업 단독 특별 금융 금리 지원',
          '🏎️ 트랙 감성을 일상으로! 선착순 즉시 출고 배정'
        ],
        ttsLines: [
          '서킷의 유전자를 그대로 품은 폭발적인 드라이빙 머신입니다.',
          '전자식 서스펜션과 대구경 브레이크가 칼같은 제동력을 발휘합니다.',
          '당월 고성능 라인업 단독 특별 금융 혜택을 제공합니다.',
          '일상의 도로를 서킷으로 바꿀 준비가 되셨다면 지금 상담하세요.'
        ]
      },
      nurburgring_lap: {
        id: 'nurburgring_lap',
        category: 'sports',
        layoutMode: 'RACING_ACTION',
        title: '🏁 뉘르부르크링 랩타임 챌린지형',
        shortTitle: '랩타임챌린지',
        tagline: '런치 컨트롤 0-100km 3.8초 · 전자식 서스펜션 · 코너링 브레이크',
        icon: '🏁',
        themeId: 'solar',
        accentColor: '#f59e0b',
        hook: '🏁 제로백 3.8초의 폭발적 가속! 뉘르부르크링 서킷 머신',
        discountNum: 560,
        discount: '월 54만원대 · 고성능 브렘보 팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏁 독일 뉘르부르크링 혹독한 테스트를 통과한 섀시 강성',
          '⚡ 런치 컨트롤 작동 시 제로백 3초대 순간 가속감',
          '🏎️ 코너를 완벽하게 움켜쥐는 미쉐린 파일럿 스포츠 타이어',
          '💬 댓글에 [견적] 남기시면 고성능 모델 전용 혜택 전송'
        ],
        ttsLines: [
          '독일 뉘르부르크링 서킷의 극한 테스트를 완벽히 통과했습니다.',
          '런치 컨트롤 작동 시 삼 초대의 폭발적인 가속감을 선사합니다.',
          '어떤 코너에서도 흔들림 없는 완벽한 접지력을 발휘합니다.',
          '댓글에 견적이라고 남기시면 고성능 전용 프로모션을 전송해 드립니다.'
        ]
      },
      drift_exhaust: {
        id: 'drift_exhaust',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '🔥 가변배기 팝콘사운드형',
        shortTitle: '가변배기사운드',
        tagline: '전자식 가변 배기 밸브 · 스포츠 플러스 모드 팝콘 배기음 · 버킷 시트',
        icon: '🔥',
        themeId: 'sunset',
        accentColor: '#f97316',
        hook: '🔥 심장을 울리는 팝콘 배기음! 스포츠 모드 감성 폭발',
        discountNum: 510,
        discount: '월 47만원대 · 퍼포먼스 배기 팩',
        scenePlan: [
          { cut: 1, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'RACING_RIBBON', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔥 스포츠 플러스 모드 시 팝콘처럼 터지는 리얼 배기음',
          '🔊 순정 전자식 가변 배기로 구조변경 걱정 제로',
          '🏎️ 몸을 단단하게 감싸주는 알칸타라 버킷 시트',
          '🔑 공식 카마스터 퍼포먼스 패키지 특별 출고'
        ],
        ttsLines: [
          '스포츠 플러스 모드로 전환 시 팝콘처럼 터지는 강렬한 배기 사운드입니다.',
          '제조사 순정 가변 배기 장착으로 구조변경 없이 완벽합니다.',
          '격렬한 주행에서도 몸을 단단하게 지지하는 버킷 시트가 기본입니다.',
          '공식 카마스터가 직접 튜닝 패키지를 검수하여 출고해 드립니다.'
        ]
      },
      carbon_paddock: {
        id: 'carbon_paddock',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '🏎️ 카본 에어로 & 패독 라이선스형',
        shortTitle: '카본패독',
        tagline: '리얼 카본 리어 스포일러 · 다운포스 디퓨저 · 경량 단조 휠',
        icon: '🏎️',
        themeId: 'stealth',
        accentColor: '#a1a1aa',
        hook: '🏎️ 리얼 카본 바디킷과 다운포스 윙, 레이싱 혈통 그대로',
        discountNum: 620,
        discount: '카본 파츠 풀장착 · 특별 출고',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SLANTED_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏎️ 공기역학 풍동실험으로 설계된 리얼 카본 프론트 립',
          '✈️ 고속 안정성을 극대화하는 카본 리어 스포일러',
          '⚙️ 현가하질량을 줄여주는 초경량 단조 휠 장착',
          '💬 댓글에 [견적] 남기시고 카본 에디션 재고를 선점하세요'
        ],
        ttsLines: [
          '공기역학 풍동실험을 거쳐 완성된 리얼 카본 바디킷입니다.',
          '초고속 주행 시에도 바닥에 밀착되는 강력한 다운포스를 만들어냅니다.',
          '초경량 단조 휠로 민첩한 핸들링 반응성을 극대화했습니다.',
          '댓글에 견적이라고 남기시고 한정 수량 카본 에디션을 선점하세요.'
        ]
      },
      mountain_winding: {
        id: 'mountain_winding',
        category: 'sports',
        layoutMode: 'LAUNCH_CONTROL',
        title: '⛰️ 와인딩 로드 코너링 마스터형',
        shortTitle: '와인딩코너',
        tagline: '전자식 차동제한장치 e-LSD · 랙 구동형 파워 스티어링 · 코너링 밸런스',
        icon: '⛰️',
        themeId: 'royal',
        accentColor: '#3b82f6',
        hook: '⛰️ 와인딩 로드를 칼처럼 베어내는 완벽한 코너링 밸런스',
        discountNum: 480,
        discount: '월 43만원대 · e-LSD 스포츠 팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⛰️ 전자식 차동제한장치 e-LSD로 코너 탈출 가속력 극대화',
          '🎯 랙 타입 전동식 파워 스티어링의 직관적인 조향감',
          '⚖️ 50:50에 가까운 전후 무게 배분으로 롤링 억제',
          '🔑 공식 카마스터 특별 즉시 출고 배정'
        ],
        ttsLines: [
          '전자식 차동제한장치가 코너 탈출 시 폭발적인 트랙션을 선사합니다.',
          '랙 타입 조향 시스템으로 한 치의 오차 없는 칼같은 핸들링을 완성합니다.',
          '완벽한 전후 무게 밸런스로 급격한 코너에서도 롤링을 완벽 억제합니다.',
          '공식 카마스터 전용 스포츠 모델, 지금 즉시 출고 가능합니다.'
        ]
      },
      track_day_pilot: {
        id: 'track_day_pilot',
        category: 'sports',
        layoutMode: 'RACING_ACTION',
        title: '⚡ 트랙데이 서킷 파일럿형',
        shortTitle: '트랙데이',
        tagline: '대구경 브렘보 모노블록 4P · 미쉐린 파일럿 스포츠 · 고성능 쿨링',
        icon: '⚡',
        themeId: 'crimson',
        accentColor: '#f43f5e',
        hook: '⚡ 서킷 트랙데이 주행 즉시 투입 가능한 고성능 팩!',
        discountNum: 590,
        discount: '월 51만원대 · 브렘보 모노블록 팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚡ 대구경 브렘보 모노블록 4피스톤 캘리퍼 풀 장착',
          '🔥 고온에서도 베이퍼록 없는 고성능 레이싱 브레이크 오일',
          '🏎️ 유온과 냉각수온을 실시간 모니터링하는 고성능 클러스터',
          '💬 댓글에 [견적] 남기시면 서킷 팩 잔여 차량 즉시 배정'
        ],
        ttsLines: [
          '대구경 모노블록 사 피스톤 캘리퍼로 지치지 않는 제동력을 자랑합니다.',
          '가혹한 연속 주행에도 열화 없는 고성능 쿨링 시스템이 적용되었습니다.',
          '실시간 유온과 냉각수온 텔레메트리로 최적의 엔진 상태를 유지합니다.',
          '댓글에 견적이라고 남겨주시면 서킷 패키지 차량을 바로 배정해 드립니다.'
        ]
      },
      launch_control: {
        id: 'launch_control',
        category: 'sports',
        layoutMode: 'LAUNCH_CONTROL',
        title: '🚀 런치 컨트롤 제로백 3.4초형',
        shortTitle: '런치컨트롤',
        tagline: '풀악셀 스타트 스프린트 · 심장을 뛰게 하는 1.2G 가속도 · 트랙 론치',
        icon: '🚀',
        themeId: 'crimson',
        accentColor: '#ef4444',
        hook: '🚀 브레이크 밟고 풀악셀! 0 to 100km 단 3.4초 런치 컨트롤',
        discountNum: 780,
        discount: '월 59만원대 · 런치 컨트롤 팩',
        scenePlan: [
          { cut: 1, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RACING_RIBBON', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🚀 런치 모드 활성화 시 네 바퀴를 아스팔트에 박아 넣는 폭발적 스타트',
          '⏱️ 계측기 인증 제로백 3.4초! 슈퍼카 부럽지 않은 가속 G포스',
          '🔥 고강도 단조 크랭크샤프트와 트윈 스크롤 터보의 고성능 엔진',
          '💬 댓글에 [런치] 남기시면 고성능 트랙 패키지 우선 시승권'
        ],
        ttsLines: [
          '런치 컨트롤 모드를 켜는 순간 아스팔트를 박차고 나가는 폭발적인 스타트를 발휘합니다.',
          '제로백 삼 점 사 초의 압도적인 가속력으로 온몸을 시트에 파묻히게 만듭니다.',
          '고강도 엔진 설계와 트윈 터보로 한계 주행에서도 완벽한 내구성을 보장합니다.',
          '댓글에 런치라고 남겨주시면 고성능 트랙 패키지 우선 배정권을 드립니다.'
        ]
      },
      drift_machine: {
        id: 'drift_machine',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '💨 리어 휠 드리프트 머신형',
        shortTitle: '드리프트머신',
        tagline: '후륜 구동 오버스티어 완벽 제어 · 드리프트 옵티마이저 모드 · 타이어 스모크',
        icon: '💨',
        themeId: 'neon',
        accentColor: '#f97316',
        hook: '💨 스티어링 꺾고 엑셀 ON! 아드레날린 폭발 후륜 드리프트 머신',
        discountNum: 650,
        discount: '월 52만원대 · 드리프트 팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💨 드리프트 옵티마이저로 카운터스티어 조작을 예술로 완성하는 전자제어',
          '🏎️ 50:50 완벽에 가까운 전후 무게 배분으로 칼날 같은 코너링 선회력',
          '🏁 서킷 전용 타이어 트레드 온도를 실시간 감지하는 스마트 TPMS',
          '💬 댓글에 [드리프트] 남기시면 미쉐린 파일럿 스포츠 교환권'
        ],
        ttsLines: [
          '드리프트 전용 모드가 탑재되어 짜릿한 후륜 슬라이드를 안전하게 즐길 수 있습니다.',
          '오십 대 오십 무게 배분으로 와인딩 코너를 칼날처럼 베어 나갑니다.',
          '실시간 타이어 온도 모니터링으로 트랙 주행 시 최적의 접지력을 유지합니다.',
          '댓글에 드리프트라고 남겨주시면 고성능 스포츠 타이어 교환권을 증정합니다.'
        ]
      },
      brembo_brakes: {
        id: 'brembo_brakes',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '🛑 브렘보 6P 카본 세라믹형',
        shortTitle: '브렘보6P',
        tagline: '초고온 서킷에서도 페이드 현상 제로 · 400mm 카본 세라믹 디스크 · 극한 제동',
        icon: '🛑',
        themeId: 'crimson',
        accentColor: '#dc2626',
        hook: '🛑 100km에서 단 32미터 제동! 브렘보 6피스톤 카본 세라믹',
        discountNum: 720,
        discount: '월 56만원대 · 카본 브레이크 팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛑 대형 브렘보 6피스톤 캘리퍼와 400mm 카본 세라믹 로터의 극한 제동력',
          '🔥 연속 풀브레이킹에도 베이퍼록과 페이드 현상 없는 트랙 내구성',
          '🛞 노란색 고성능 캘리퍼가 뿜어내는 강렬한 레이싱 익스테리어',
          '💬 댓글에 [브렘보] 남기시면 브레이크 튜닝 패키지 무상 시공'
        ],
        ttsLines: [
          '대구경 육 피스톤 캘리퍼로 시속 백 킬로미터에서 불과 삼십이 미터 만에 멈춰섭니다.',
          '연속되는 서킷 주행에도 지치지 않는 카본 세라믹 디스크가 기본 적용됩니다.',
          '휠 안쪽에서 강렬하게 빛나는 옐로우 레이싱 캘리퍼의 압도적 존재감을 만나보세요.',
          '댓글에 브렘보라고 남겨주시면 고성능 브레이크 패키지 출고 차량을 안내합니다.'
        ]
      },
      electron_lsd: {
        id: 'electron_lsd',
        category: 'sports',
        layoutMode: 'LAUNCH_CONTROL',
        title: '⚙️ e-LSD 전자식 차동제한형',
        shortTitle: '전자식LSD',
        tagline: '코너링 탈출 가속 시 좌우 토크 능동 배분 · 언더스티어 완전 삭제 · 레일 주행',
        icon: '⚙️',
        themeId: 'cyber',
        accentColor: '#06b6d4',
        hook: '⚙️ 레일 위를 달리는 코너링! e-LSD 전자식 차동제한 차체제어',
        discountNum: 610,
        discount: '월 49만원대 · e-LSD 퍼포먼스',
        scenePlan: [
          { cut: 1, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚙️ 코너 바깥쪽 바퀴에 토크를 몰아주어 안쪽으로 파고드는 전자식 LSD',
          '🛤️ 와인딩 로드에서 언더스티어를 지우고 기차처럼 궤적을 유지하는 안정감',
          '🎮 전자제어 서스펜션(ECS)과 연동되어 롤링을 즉각 억제하는 차체 강성',
          '💬 댓글에 [코너링] 남기시면 서킷 데이터 로거 장착 패키지 증정'
        ],
        ttsLines: [
          '코너를 탈출할 때 외측 휠에 최적의 구동력을 전달해 안쪽으로 날카롭게 파고듭니다.',
          '언더스티어 없이 마치 철길 위를 달리는 듯한 기막힌 코너링 궤적을 그립니다.',
          '전자제어 서스펜션과 맞물려 급격한 방향 전환 시에도 차체 쏠림이 없습니다.',
          '댓글에 코너링이라고 남겨주시면 트랙 텔레메트리 패키지 차량을 배정해 드립니다.'
        ]
      },
      active_spoiler: {
        id: 'active_spoiler',
        category: 'sports',
        layoutMode: 'RACING_ACTION',
        title: '🏎️ 액티브 카본 가변 스포일러형',
        shortTitle: '가변스포일러',
        tagline: '고속 주행 시 자동 전개 가변 윙 · 150kg 추가 다운포스 · 에어 브레이크',
        icon: '🏎️',
        themeId: 'crimson',
        accentColor: '#f43f5e',
        hook: '🏎️ 시속 120km에서 날개를 펴다! 액티브 카본 가변 스포일러',
        discountNum: 680,
        discount: '월 54만원대 · 에어로 다이내믹',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏎️ 속도에 따라 3단계로 각도를 자동 조절하는 리얼 카본 가변 윙',
          '🌪️ 고속 주행 시 차체를 바닥으로 눌러주는 150kg 강력한 다운포스',
          '🛑 급제동 시 70도 수직으로 세워져 제동거리를 줄이는 에어 브레이크',
          '💬 댓글에 [스포일러] 남기시면 카본 에어로 파츠 풀세트 장착'
        ],
        ttsLines: [
          '주행 속도에 맞춰 자동으로 각도를 조절하는 리얼 카본 가변 스포일러입니다.',
          '초고속에서도 차체를 바닥으로 강하게 눌러주어 흔들림 없는 안정감을 선사합니다.',
          '급제동 시에는 에어 브레이크 역할을 수행하여 제동 안정성을 비약적으로 높여줍니다.',
          '댓글에 스포일러라고 남겨주시면 카본 에어로 바디킷이 적용된 차량을 안내합니다.'
        ]
      },
      paddle_shift: {
        id: 'paddle_shift',
        category: 'sports',
        layoutMode: 'LAUNCH_CONTROL',
        title: '🕹️ 마그네슘 패들 시프트 직결형',
        shortTitle: '패들시프트',
        tagline: '0.05초 번개 같은 듀얼클러치 변속 체감 · 레브매칭 회전수 보정 · 손끝 손맛',
        icon: '🕹️',
        themeId: 'cyber',
        accentColor: '#38bdf8',
        hook: '🕹️ 0.05초 만에 다음 단 체결! 손끝으로 지휘하는 듀얼클러치 DCT',
        discountNum: 570,
        discount: '월 47만원대 · 스포츠 DCT 팩',
        scenePlan: [
          { cut: 1, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🕹️ 스티어링 휠 뒤편 큼직한 마그네슘 패들이 전하는 서늘한 금속의 손맛',
          '⚡ 다운시프트 시 엔진 RPM을 순식간에 튕겨 맞추는 자동 레브매칭',
          '💥 변속 순간 귓전을 때리는 배기 파열음과 즉각적인 동력 직결감',
          '💬 댓글에 [패들] 남기시면 고성능 알칸타라 D컷 스티어링 업그레이드'
        ],
        ttsLines: [
          '큼직한 마그네슘 패들 시프트로 손끝에서 레이스카 수준의 빠른 변속을 즐기세요.',
          '기어를 내릴 때 자동으로 알피엠을 보정하는 레브매칭으로 부드럽고 안전합니다.',
          '변속 순간 터져 나오는 배기음과 함께 완벽한 동력 직결감을 온몸으로 느껴보세요.',
          '댓글에 패들이라고 남겨주시면 알칸타라 스티어링 휠이 적용된 모델을 배정합니다.'
        ]
      },
      exhaust_titanium: {
        id: 'exhaust_titanium',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '🔊 가변 배기 팝앤뱅 사운드형',
        shortTitle: '팝앤뱅배기',
        tagline: '스포츠 플러스 모드 폭발적 백파이어 배기음 · 티타늄 머플러 팁 · 합법 사운드',
        icon: '🔊',
        themeId: 'crimson',
        accentColor: '#f97316',
        hook: '🔊 악셀 오프 시 팝콘 튀기는 사운드! 가변 배기 팝앤뱅 시스템',
        discountNum: 640,
        discount: '월 51만원대 · 가변 배기 에디션',
        scenePlan: [
          { cut: 1, widget: 'AUDIO_WAVEFORM', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔊 스포츠 모드에서 가변 밸브가 열리며 뿜어내는 가슴 뛰는 중저음 배기음',
          '🍿 가속 후 페달을 뗄 때 터져 나오는 짜릿한 백파이어 팝콘 사운드',
          '🤫 아파트 지하주차장에서는 조용하게 밸브를 닫는 컴포트 사일런트 모드',
          '💬 댓글에 [배기] 남기시면 티타늄 쿼드 머플러 팁 무상 장착'
        ],
        ttsLines: [
          '스포츠 모드를 켜면 가변 밸브가 열리며 가슴을 울리는 웅장한 배기음이 터져 나옵니다.',
          '가속 페달에서 발을 뗄 때 터지는 팝앤뱅 사운드가 드라이빙의 즐거움을 더합니다.',
          '아파트 주차장에서는 조용하게 주행할 수 있는 사일런트 모드로 이웃을 배려합니다.',
          '댓글에 배기라고 남겨주시면 티타늄 머플러가 장착된 스페셜 에디션을 배정합니다.'
        ]
      },
      bucket_seat: {
        id: 'bucket_seat',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '💺 알칸타라 카본 버킷시트형',
        shortTitle: '카본버킷시트',
        tagline: '횡가속도를 단단히 지지하는 레이싱 전용 시트 · 카본 백쉘 · 라이트웨이트',
        icon: '💺',
        themeId: 'neon',
        accentColor: '#38bdf8',
        hook: '💺 극한의 코너링에서도 몸을 꽉 잡아주는 알칸타라 카본 버킷시트',
        discountNum: 690,
        discount: '월 53만원대 · 버킷시트 패키지',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RACING_RIBBON', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💺 등받이 뒤편을 리얼 카본으로 마감하여 경량화와 강성을 동시에 확보',
          '🏎️ 과격한 횡가속도 주행 시 상체와 골반을 완벽히 밀착 지지하는 볼스터',
          '🧵 통기성이 우수하고 미끄러짐을 방지하는 정품 이탈리아 알칸타라 원단',
          '💬 댓글에 [버킷] 남기시면 실내 카본 패키지 무상 시공 출고'
        ],
        ttsLines: [
          '리얼 카본 백쉘이 적용되어 가벼운 무게와 강력한 지지력을 자랑합니다.',
          '격한 코너링에서도 몸이 전혀 흔들리지 않도록 상체를 완벽하게 감싸줍니다.',
          '이탈리아 정품 알칸타라 소재로 미끄러짐 없이 쾌적한 착좌감을 유지합니다.',
          '댓글에 버킷이라고 남겨주시면 실내 카본 인테리어 패키지를 무상으로 더해 드립니다.'
        ]
      },
      forged_wheels: {
        id: 'forged_wheels',
        category: 'sports',
        layoutMode: 'EXHAUST_POP',
        title: '🛞 초경량 20인치 단조 휠형',
        shortTitle: '초경량단조휠',
        tagline: '현가하질량 12kg 감축 · 서스펜션 반응성 및 핸들링 극대화 · 단조 공법',
        icon: '🛞',
        themeId: 'crimson',
        accentColor: '#e11d48',
        hook: '🛞 바퀴 하나당 3kg 경량화! 서스펜션이 살아나는 20인치 단조 휠',
        discountNum: 660,
        discount: '월 50만원대 · 경량 단조 휠팩',
        scenePlan: [
          { cut: 1, widget: 'RACING_RIBBON', pos: 'center', cam: 0 },
          { cut: 2, widget: 'STOCK_COUNTDOWN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛞 10,000톤 프레스로 압축 성형한 초고강도 20인치 레이싱 단조 휠',
          '📉 휠 4개 합산 12kg 감축으로 로드홀딩과 서스펜션 추종성 드라마틱 개선',
          '🏎️ 미쉐린 최상급 파일럿 스포츠 4S 타이어와 완벽 매칭 조합',
          '💬 댓글에 [단조휠] 남기시면 단조 휠 옵션 가격 50% 반값 할인'
        ],
        ttsLines: [
          '만 톤 프레스로 찍어낸 단조 휠로 극한의 강성과 가벼운 무게를 동시에 달성했습니다.',
          '하체 무게를 십이 킬로그램 덜어내어 노면을 읽고 반응하는 속도가 획기적으로 향상됩니다.',
          '최고급 미쉐린 스포츠 타이어와 함께 완벽한 접지력과 코너링을 완성합니다.',
          '댓글에 단조휠이라고 남겨주시면 고가 단조 휠 옵션을 반값에 지원해 드립니다.'
        ]
      },
      redline_rev: {
        id: 'redline_rev',
        category: 'sports',
        layoutMode: 'LAUNCH_CONTROL',
        title: '🏁 레드존 8,000RPM 고회전형',
        shortTitle: '8000RPM레드존',
        tagline: '가슴을 울리는 고회전 자연흡기 감성 엔진 필링 · 선형적 출력 전개 · 퓨어 스포츠',
        icon: '🏁',
        themeId: 'amber',
        accentColor: '#f59e0b',
        hook: '🏁 8,000 RPM까지 거침없이 치솟는 타코미터 바늘! 고회전 스포츠',
        discountNum: 750,
        discount: '월 58만원대 · 고회전 퓨어 머신',
        scenePlan: [
          { cut: 1, widget: 'SPEEDO_GAUGE', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RACING_RIBBON', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏁 8,000 RPM 고회전 영역까지 매끄럽게 뻗어나가는 선형적 가속 페달 반응',
          '🎻 회전수가 올라갈수록 울려 퍼지는 기계식 사운드의 순수한 교향곡',
          '🏎️ 변속 타이밍을 시각적으로 안내하는 고회전 인디케이터 시프트 라이트',
          '💬 댓글에 [레드존] 남기시면 서킷 스포츠 주행 보증 패키지 제공'
        ],
        ttsLines: [
          '팔천 알피엠까지 거침없이 회전하며 뿜어내는 가속 페달 반응이 심장을 울립니다.',
          '알피엠이 치솟을수록 맑고 날카롭게 변하는 기계식 엔진 사운드를 즐겨보세요.',
          '시프트 라이트가 최적의 변속 타이밍을 알려주어 완벽한 트랙 주행을 돕습니다.',
          '댓글에 레드존이라고 남겨주시면 서킷 주행 전용 안심 케어 패키지를 증정합니다.'
        ]
      },

      // ------------------------------------------------------------------------
      // [5] 실속 금융 & 0원 초기비용 & 사업자 절세 (category: 'finance') - 16종
      // ------------------------------------------------------------------------
      zero_initial: {
        id: 'zero_initial',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '💳 초기비용 0원 무보증 전액 승인형',
        shortTitle: '초기비용0원',
        tagline: '보증금 0원 · 취등록세 0원 · 자동차세+보험료 전액 분납',
        icon: '💳',
        themeId: 'emerald',
        accentColor: '#10b981',
        hook: '💳 [내 돈 0원] 초기비용 0원 무보증 즉시승인 출고!',
        discountNum: 390,
        discount: '초기비용 0원 · 전액 분납 승인',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'SLOT_MACHINE', pos: 'center', cam: 1 },
          { cut: 3, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💳 목돈 부담 제로! 보증금·선납금 0원으로 당일 출고',
          '🧾 취등록세·공채·탁송료 전액 월 납입금에 분납 포함',
          '⚡ 신용 7등급도 예외 심사 승인! 16개 금융사 비교',
          '💬 댓글에 [견적] 두 글자만 남기면 무보증 승인표 발송'
        ],
        ttsLines: [
          '목돈 부담 제로! 초기비용 영원으로 오늘 바로 출고됩니다.',
          '취등록세와 보험료까지 모두 월 납입금으로 분납 설계해 드립니다.',
          '십육 개 금융사 비교 분석으로 예외 심사 무보증 승인을 이끌어냅니다.',
          '댓글에 견적 두 글자만 남기시면 무보증 승인 조건표를 즉시 보내드립니다.'
        ]
      },
      corp_tax: {
        id: 'corp_tax',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '💼 법인·개인사업자 100% 비용처리 절세형',
        shortTitle: '사업자절세',
        tagline: '연간 1,500만원 전액 경비 처리 · 부가세 환급 · 절세 컨설팅',
        icon: '💼',
        themeId: 'obsidian',
        accentColor: '#94a3b8',
        hook: '💼 법인·개인사업자 연간 1,500만원 전액 경비처리 절세 플랜!',
        discountNum: 650,
        discount: '연간 1,500만원 전액 비용처리',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💼 차량 리스료 연간 1,500만원 100% 손비 인정 경비 처리',
          '📊 부가세 환급 대상 차종 실시간 세무 비교 컨설팅',
          '🏢 종합소득세 및 법인세 수백만원 합법 절세 효과',
          '🔑 사업자 등록증 사본 하나로 비대면 당일 심사 완료'
        ],
        ttsLines: [
          '연간 천오백만 원까지 차량 유지비를 전액 손비로 인정받으실 수 있습니다.',
          '부가세 환급 대상 여부를 세무 전산으로 즉시 검토해 드립니다.',
          '종합소득세와 법인세를 대폭 절감하는 최고의 절세 플랜입니다.',
          '사업자등록증 하나로 방문 없이 당일 비대면 심사가 완료됩니다.'
        ]
      },
      lease_takeover: {
        id: 'lease_takeover',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '⚡ 꿀승계 무사고 리스 번개출고형',
        shortTitle: '꿀승계번개',
        tagline: '보증금 지원금 300만원 현금 지급 · 무사고 승계 심사 당일 완료',
        icon: '⚡',
        themeId: 'amber',
        accentColor: '#f59e0b',
        hook: '⚡ 지원금 300만원 받고 승계받는 무사고 꿀승계 매물!',
        discountNum: 480,
        discount: '현금 지원금 300만원 즉시 지급',
        scenePlan: [
          { cut: 1, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 0 },
          { cut: 2, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 1 },
          { cut: 3, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚡ 전 차주가 애지중지 탄 무사고 1인 신조 꿀승계 매물',
          '💵 계약 시 전 차주가 지원금 300만원 현금 즉시 지급',
          '📉 신차 대비 취등록세 0원! 취득세 전액 면제 혜택',
          '💬 댓글에 [승계] 남기시면 승계 지원금 상세 내역 전송'
        ],
        ttsLines: [
          '무사고 일인 신조 차량을 파격적인 지원금과 함께 승계받으세요.',
          '계약 즉시 현금 삼백만 원의 지원금이 고객님 계좌로 지급됩니다.',
          '신차와 달리 취등록세가 전혀 발생하지 않아 초기비용이 절약됩니다.',
          '댓글에 승계라고 남겨주시면 지원금 상세 내역을 보내드립니다.'
        ]
      },
      lowest_apr: {
        id: 'lowest_apr',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '📉 16개 금융사 금리 역경매 최저가형',
        shortTitle: '금리역경매',
        tagline: '전 금융사 실시간 금리 역경매 · 3.2% 초저금리 다이렉트',
        icon: '📉',
        themeId: 'royal',
        accentColor: '#2563eb',
        hook: '📉 금융 16개사 전산 역경매로 찾은 전국 최저금리 견적!',
        discountNum: 430,
        discount: '초저금리 3.2% 다이렉트 역경매',
        scenePlan: [
          { cut: 1, widget: 'BREAKING_NEWS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📉 캐피탈·카드사 16곳 동시 입찰! 최저금리 역경매 시스템',
          '🏦 시중 평균 6%대 금리 대비 반값! 3.2% 다이렉트 적용',
          '💰 총 이자만 450만원 절약되는 실속 금융 솔루션',
          '💬 댓글에 [견적] 남기시면 16개사 실시간 금리 비교표 발송'
        ],
        ttsLines: [
          '국내 십육 개 금융사를 실시간 역경매하여 최저금리를 찾아냅니다.',
          '시중 평균 금리의 절반 수준인 삼점이 퍼센트 초저금리를 적용합니다.',
          '총 이자 비용만 사백오십만 원 이상 절감할 수 있습니다.',
          '댓글에 견적이라고 남겨주시면 십육 개 금융사 금리 비교표를 전송해 드립니다.'
        ]
      },
      student_first_car: {
        id: 'student_first_car',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '🎓 생애 첫차 사회초년생 안심 플랜형',
        shortTitle: '생애첫차',
        tagline: '월 납입금 20만원대 · 초기비용 0원 · 만 26세 보험료 패키지 지원',
        icon: '🎓',
        themeId: 'teal',
        accentColor: '#0d9488',
        hook: '🎓 사회초년생 생애 첫차, 월 20만원대로 부담 없이 출고!',
        discountNum: 350,
        discount: '월 24만원대 · 첫차 안심 패키지',
        scenePlan: [
          { cut: 1, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 0 },
          { cut: 2, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 1 },
          { cut: 3, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎓 알바·신입사원도 승인! 월 20만원대 가성비 첫차 설계',
          '🛡️ 비싼 첫차 보험료 걱정 끝! 단체 종합보험 특약 포함',
          '🚗 사고 나도 면책금 10만원으로 올 커버! 감가 걱정 제로',
          '🔑 취업 성공 축하 출고 기념 선물 풀세트 증정'
        ],
        ttsLines: [
          '신입사원도 부담 없는 월 이십만 원대 알뜰 첫차 플랜입니다.',
          '비싼 만 이십육 세 미만 보험료를 단체 요율로 대폭 낮춰드립니다.',
          '사고가 나도 면책금 십만 원이면 모든 수리가 완벽 보장됩니다.',
          '취업 성공을 축하하며 첫차 출고 기념 선물 세트를 무상 증정합니다.'
        ]
      },
      residual_value: {
        id: 'residual_value',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '📈 중고차 잔가 60% 보장 스마트 반납형',
        shortTitle: '잔가보장형',
        tagline: '3년 후 신차 교체 시 중고차 가격 60% 확정 보장 · 감가 리스크 제로',
        icon: '📈',
        themeId: 'deepblue',
        accentColor: '#1e40af',
        hook: '📈 3년 뒤 중고차 감가 걱정 끝! 잔존가치 60% 확정 보장',
        discountNum: 460,
        discount: '잔가 60% 확정 보장 플랜',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📈 3년 타다가 반납하면 신차가격의 60% 확정 보장 보너스',
          '📉 감가상각 위험은 금융사가 전액 부담! 고객 손실 0원',
          '🔄 3년마다 새 차로 갈아타는 가장 똑똑한 신차 이용법',
          '💬 댓글에 [잔가] 남기시면 3년 잔가 보장 확약서 발송'
        ],
        ttsLines: [
          '삼 년간 타시다가 반납 시 신차가의 육십 퍼센트를 확정 보장해 드립니다.',
          '중고차 가격 하락 위험은 금융사가 전액 부담하므로 손실이 없습니다.',
          '삼 년마다 최신 신차로 부담 없이 갈아타는 가장 현명한 방법입니다.',
          '댓글에 잔가라고 남겨주시면 삼 년 잔가 보장 확약서를 전송해 드립니다.'
        ]
      },
      freelance_pass: {
        id: 'freelance_pass',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '💼 프리랜서·주부 무서류 승인형',
        shortTitle: '무서류간편승인',
        tagline: '재직증명 소득증빙 없이 10분 즉시 모바일 승인 · 서류 스트레스 제로 · 99% 통과',
        icon: '💼',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '💼 재직증명서 소득증빙 NO! 휴대폰 본인인증으로 10분 즉시 승인',
        discountNum: 480,
        discount: '초기비용 0원 · 무서류 10분 승인',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💼 프리랜서, 주부, 신규 창업자도 복잡한 소득증빙 서류 없이 간편 신청',
          '📱 스마트폰 본인인증 30초면 한도 조회 완료! 신용점수 하락 없는 안심 조회',
          '🤝 10년 경력 심사 마스터가 지점장 특별 전결로 승인율 99% 달성',
          '💬 댓글에 [승인] 남기시면 1:1 비공개 무서류 간편 한도 즉시 산출'
        ],
        ttsLines: [
          '프리랜서나 주부님도 복잡한 소득 증빙 서류 없이 간편하게 신차를 이용하실 수 있습니다.',
          '스마트폰 인증만으로 신용도 영향 없이 삼십 초 만에 한도를 확인해 드립니다.',
          '십 년 경력의 심사 전문 마스터가 특별 승인으로 높은 통과율을 약속합니다.',
          '댓글에 승인이라고 남겨주시면 일대일 비공개 무서류 심사를 도와드립니다.'
        ]
      },
      oil_included: {
        id: 'oil_included',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '⛽ 1년 주유비·충전비 지원형',
        shortTitle: '1년주유비지원',
        tagline: '차량 출고 즉시 100만원 주유·충전 카드 증정 · 1년간 기름값 걱정 끝',
        icon: '⛽',
        themeId: 'amber',
        accentColor: '#f59e0b',
        hook: '⛽ 차만 타세요, 1년 기름값은 저희가 쏩니다! 100만원 주유권 증정',
        discountNum: 520,
        discount: '100만원 주유·충전 상품권 증정',
        scenePlan: [
          { cut: 1, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⛽ 신차 인도 당일 GS칼텍스/SK에너지 모바일 주유권 100만원 즉시 지급',
          '🔋 전기차 출고 고객님께는 전국 초고속 충전 1년 무제한 크레딧 대체 증정',
          '📉 월 납입금 외에 기름값 부담까지 덜어드리는 역대급 생활 밀착 프로모션',
          '💬 댓글에 [주유비] 남기시면 100만원 주유권 바우처 선착순 배정'
        ],
        ttsLines: [
          '차량을 출고하시는 모든 분께 백만 원 상당의 정품 모바일 주유권을 증정합니다.',
          '전기차를 선택하시는 고객님께는 일 년간 마음껏 충전하실 수 있는 충전권을 드립니다.',
          '월 납입금 외에 추가 유류비 부담까지 덜어드리는 실속 있는 프로모션입니다.',
          '댓글에 주유비라고 남겨주시면 백만 원 유류비 지원 바우처를 챙겨드립니다.'
        ]
      },
      short_lease: {
        id: 'short_lease',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '⏱️ 12개월 단기 무위약 승계형',
        shortTitle: '1년단기리스',
        tagline: '장기 부담 없는 1년 단위 계약 · 언제든 위약금 없이 신차 교체 · 자유로운 반납',
        icon: '⏱️',
        themeId: 'deepblue',
        accentColor: '#38bdf8',
        hook: '⏱️ 4~5년 묶이기 싫다면? 딱 1년만 타고 위약금 없이 갈아타기',
        discountNum: 430,
        discount: '월 39만원대 · 12개월 단기 플랜',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⏱️ 36개월, 48개월 장기 계약 부담 NO! 1년 단위로 가볍게 이용하는 단기 플랜',
          '🔄 1년 후 위약금 한 푼 없이 최신 신차로 무상 교체 또는 자유로운 반납',
          '🛡️ 취등록세, 자동차세, 보험료 모두 월 렌트료에 포함되어 추가 지출 제로',
          '💬 댓글에 [단기] 남기시면 12개월 무위약 승계 전용 리스트 발송'
        ],
        ttsLines: [
          '삼사 년씩 묶이는 장기 계약 부담 없이 딱 일 년만 타실 수 있는 단기 플랜입니다.',
          '일 년 후 위약금 없이 신형 차량으로 갈아타시거나 자유롭게 반납하실 수 있습니다.',
          '세금과 보험료가 모두 포함되어 있어 매달 고정 비용 외에 추가 지출이 없습니다.',
          '댓글에 단기라고 남겨주시면 십이 개월 단기 전용 차량 목록을 보내드립니다.'
        ]
      },
      zero_interest: {
        id: 'zero_interest',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '0️⃣ 무이자 60개월 제로할부형',
        shortTitle: '무이자60개월',
        tagline: '이자 부담 0% 원금만 60개월 분할 납부 · 고금리 시대 완벽한 이자 방어 솔루션',
        icon: '0️⃣',
        themeId: 'royal',
        accentColor: '#facc15',
        hook: '0️⃣ 고금리 시대에 이자율 0.0%! 원금만 60개월 나눠 내는 제로할부',
        discountNum: 620,
        discount: '이자 0원 · 60개월 무이자 할부',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '0️⃣ 금리 인상기에도 걱정 없는 확정 0.0% 무이자 60개월 균등 분할 상환',
          '💰 총 이자 지출 수백만원 전액 세이브! 원금만 깔끔하게 납부하는 알짜 조건',
          '📜 공식 현대캐피탈 제휴 본사 승인 특별 금융 프로모션 재고',
          '💬 댓글에 [무이자] 남기시면 60개월 무이자 적용 잔여 차량 즉시 확인'
        ],
        ttsLines: [
          '고금리 시대에도 이자 부담이 전혀 없는 연 영 퍼센트 무이자 육십 개월 할부입니다.',
          '수백만 원에 달하는 대출 이자를 아끼고 순수 차량 원금만 분할 납부하세요.',
          '본사 공식 금융 제휴를 통해 한정 수량으로 제공되는 특별 프로모션입니다.',
          '댓글에 무이자라고 남겨주시면 무이자 적용 가능한 잔여 차량을 확인해 드립니다.'
        ]
      },
      credit_recovery: {
        id: 'credit_recovery',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '🤝 저신용 맞춤형 특별예외승인형',
        shortTitle: '특별예외승인',
        tagline: '신용점수 7~8등급도 지점장 직권 특별 한도 배정 · 거절 이력자 재승인 솔루션',
        icon: '🤝',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '🤝 타사 거절되셨나요? 7·8등급도 지점장 직권 특별 한도 100% 배정',
        discountNum: 490,
        discount: '저신용 특별 예외 승인 전문',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🤝 타사 렌트/리스 심사 부결자, 신용점수 하락자도 1:1 맞춤 우회 솔루션',
          '🏢 지점장 직권 특별 예외 승인 라인 가동으로 당일 즉시 펀딩 완료',
          '🔒 신용등급에 영향 없는 비공개 가심사 시스템으로 안심 진행',
          '💬 댓글에 [예외승인] 남기시면 1:1 극비 승인 전담 마스터 배정'
        ],
        ttsLines: [
          '타사에서 부결되셨거나 신용점수가 낮아 고민이신 분들도 승인이 가능합니다.',
          '지점장 직권 특별 승인 라인을 통해 당일 출고까지 신속하게 처리해 드립니다.',
          '신용 점수 하락이 전혀 없는 안전한 사전 심사로 부담 없이 상담받으세요.',
          '댓글에 예외승인이라고 남겨주시면 전담 심사 마스터가 직접 도와드립니다.'
        ]
      },
      tax_refund: {
        id: 'tax_refund',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '📑 사업자 비용처리 연 1,500만원형',
        shortTitle: '사업자절세1500',
        tagline: '종합소득세 및 법인세 전액 경비 처리 · 부가세 환급 · 대표님을 위한 절세 비법',
        icon: '📑',
        themeId: 'deepblue',
        accentColor: '#38bdf8',
        hook: '📑 종합소득세·법인세 폭탄 방어! 연간 1,500만원 전액 경비 처리',
        discountNum: 580,
        discount: '연 최대 1,500만원 합법 절세',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📑 연간 차량 렌트료 800만원 + 유지관리비 700만원 = 연 1,500만원 100% 경비 처리',
          '🧾 9인승 이상 및 경차 출고 시 부가세 10% 전액 환급 혜택 추가 적용',
          '📊 5월 종합소득세 및 법인세 신고 시 세무사 연계 원클릭 세금계산서 발송',
          '💬 댓글에 [절세] 남기시면 사업자 맞춤 연간 절세 시뮬레이션 리포트 증정'
        ],
        ttsLines: [
          '차량 렌트료와 유류비 등 연간 최대 천오백만 원까지 전액 경비 처리가 가능합니다.',
          '구인승 이상 모델을 선택하시면 부가세 십 퍼센트 환급 혜택까지 챙기실 수 있습니다.',
          '종합소득세와 법인세 절세 리포트를 발행해 드려 세무 신고가 간편해집니다.',
          '댓글에 절세라고 남겨주시면 대표님 맞춤형 절세 계산서를 즉시 보내드립니다.'
        ]
      },
      trade_in_bonus: {
        id: 'trade_in_bonus',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '🔄 타시던 차 최고가 매입형',
        shortTitle: '트레이드인보너스',
        tagline: '중고차 감정 평가 즉시 매입 · 시세 대비 100만원 더 보장 · 신차 추가 더블 DC',
        icon: '🔄',
        themeId: 'teal',
        accentColor: '#22c55e',
        hook: '🔄 타시던 중고차 최고가 보장 매입 + 신차 100만원 추가 더블 할인!',
        discountNum: 550,
        discount: '중고차 시세+100만 & 신차 더블할인',
        scenePlan: [
          { cut: 1, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔄 타사 헤이딜러/엔카 견적 들고 오시면 무조건 50~100만원 더 쳐드리는 매입 보장',
          '💰 중고차 판매 대금은 신차 보증금으로 즉시 전환하여 월 납입금 파격 인하',
          '🚗 신차 받는 날 타시던 차 문 앞 인도! 단 1분의 공백도 없는 당일 맞교환',
          '💬 댓글에 [내차팔기] 남기시면 5분 모바일 무감가 확정 매입가 제시'
        ],
        ttsLines: [
          '타사 중고차 비교 견적보다 무조건 오십만 원에서 백만 원 더 높게 매입해 드립니다.',
          '매각 대금을 신차 초기비용으로 전환하여 매달 납부하는 비용을 크게 낮춰보세요.',
          '신차를 인수받는 날 타시던 차를 바로 넘겨주시면 되므로 출퇴근 공백이 없습니다.',
          '댓글에 내차팔기라고 남겨주시면 오 분 만에 확정 매입 견적을 산출해 드립니다.'
        ]
      },
      daily_coffee: {
        id: 'daily_coffee',
        category: 'finance',
        layoutMode: 'TIKTOK_VIRAL_SPLIT',
        title: '☕ 하루 커피 한 잔 9,900원형',
        shortTitle: '하루9900원',
        tagline: '부담 없는 일 단위 환산 월 납입금 · 커피 두 잔 값이면 최신 신차가 내 손에',
        icon: '☕',
        themeId: 'amber',
        accentColor: '#f59e0b',
        hook: '☕ 하루 커피 두 잔 값 9,900원이면 끝! 부담 제로 갓성비 신차 플랜',
        discountNum: 410,
        discount: '하루 9,900원대 실속형 플랜',
        scenePlan: [
          { cut: 1, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '☕ 하루 9,900원 커피 두 잔 값이면 주유비 지원 포함 최신 세단 풀옵션',
          '📉 목돈 들어갈 일 없는 보증금 0원, 선수금 0원 완벽한 무자본 출고',
          '🛡️ 고장 수리비, 소모품 교체비 모두 렌트사에 포함된 안심 케어 서비스',
          '💬 댓글에 [커피] 남기시면 일 9,900원대 잔여 모델 특가표 발송'
        ],
        ttsLines: [
          '하루 커피 두 잔 값인 구천구백 원대로 최신 신차를 부담 없이 운행해 보세요.',
          '목돈이 전혀 필요 없는 보증금 영원 조건으로 누구나 가볍게 시작하실 수 있습니다.',
          '차량 유지보수와 소모품 교체까지 알아서 챙겨드리므로 신경 쓸 일이 없습니다.',
          '댓글에 커피라고 남겨주시면 하루 만 원 이하로 탈 수 있는 차량 목록을 드립니다.'
        ]
      },
      no_penalty: {
        id: 'no_penalty',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '🆓 중도 반납 위약금 0원형',
        shortTitle: '위약금0원반납',
        tagline: '사정 변경 시 언제든 위약금 없이 반납 가능한 안심 플랜 · 리스크 완전 제로',
        icon: '🆓',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '🆓 타다가 사정 생기면 위약금 0원 반납! 리스크 제로 프리미엄 플랜',
        discountNum: 470,
        discount: '중도 반납 위약금 0원 확약',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🆓 이직, 이사, 해외 파견 등 언제든 타다가 돌려줘도 위약금 0원 전액 면제',
          '📉 기존 렌트 승계 수수료나 패널티 걱정 없이 마음 편한 드라이빙',
          '🔄 타는 동안에는 신차 혜택 그대로 누리고 원할 때 깔끔하게 종료',
          '💬 댓글에 [위약금제로] 남기시면 무위약 안심 계약서 조건표 전송'
        ],
        ttsLines: [
          '이직이나 해외 파견 등 사정이 생기더라도 위약금 없이 자유롭게 반납이 가능합니다.',
          '중도 해지 수수료 부담 없이 안심하고 신차를 마음껏 이용해 보세요.',
          '타시는 동안에는 최신 신차의 편리함을 누리고 필요할 때 언제든 부담 없이 종료하세요.',
          '댓글에 위약금제로라고 남겨주시면 무위약 안심 조건표를 즉시 보내드립니다.'
        ]
      },
      fleet_vip: {
        id: 'fleet_vip',
        category: 'finance',
        layoutMode: 'TAX_CALCULATOR',
        title: '🏢 법인 대량 구매 특별 우대형',
        shortTitle: '법인플릿우대',
        tagline: '임직원 패밀리 할인 및 법인 전담 카매니저 1:1 배정 · 3대 이상 대량 추가 할인',
        icon: '🏢',
        themeId: 'deepblue',
        accentColor: '#1e40af',
        hook: '🏢 법인·개인사업자 2대 이상 구매 시 대량 특별 추가 할인 풀적용',
        discountNum: 710,
        discount: '법인 플릿 대량 추가 10% DC',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏢 회사 업무용 차량 2대 이상 계약 시 대당 추가 100만원 플릿 특별 할인',
          '🧑‍💼 법인 임직원 및 직계가족까지 동일한 임직원 패밀리 할인율 적용',
          '📊 분기별 차량 유지비 통합 정산서 및 무상 방문 순회정비 정기 제공',
          '💬 댓글에 [법인] 남기시면 법인 플릿 전담 매니저 1:1 출장 상담'
        ],
        ttsLines: [
          '업무용 차량을 두 대 이상 계약하시면 대당 추가 백만 원의 특별 할인이 적용됩니다.',
          '법인 소속 임직원분들과 가족분들에게도 동일한 우대 혜택을 제공합니다.',
          '차량 유지비를 한눈에 관리할 수 있는 통합 정산서와 정기 방문 정비를 제공합니다.',
          '댓글에 법인이라고 남겨주시면 플릿 전담 매니저가 직접 회사로 방문해 드립니다.'
        ]
      },

      // ------------------------------------------------------------------------
      // [6] 카마스터 신뢰 & 무사고 팩트체크 & 패밀리 (category: 'trust') - 16종
      // ------------------------------------------------------------------------
      certified_used: {
        id: 'certified_used',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '🔍 무사고 인증 중고차 팩트체크형',
        shortTitle: '인증중고팩트',
        tagline: '성능점검 무사고 직인 · 침수·전손 0원 공개 · 1년 2만km 보증',
        icon: '🔍',
        themeId: 'stealth',
        accentColor: '#a1a1aa',
        hook: '🔍 허위매물 0%! 성능점검표 원본 그대로 팩트체크 공개',
        discountNum: 510,
        discount: '신차가 대비 -1,850만원 감가 혜택',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'TECH_HUD', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🔍 국토부 공인 성능점검 무사고 완전 직인 확인 완료',
          '💧 침수·전손·도난 이력 0건! 하부 부식 및 누유 올 양호',
          '📉 신차 출고가 대비 1,800만원 절약된 감가 가성비 종결자',
          '🛡️ 출고 후 1년 20,000km 엔진·미션 무상 안심 보증 제공'
        ],
        ttsLines: [
          '국토부 공인 성능점검 무사고 원본을 투명하게 공개합니다.',
          '침수나 전손 이력 제로, 하부 부식과 미세 누유 없이 완벽합니다.',
          '신차 출고가 대비 천팔백만 원 절약된 최고의 실속 매물입니다.',
          '출고 후 일 년 이만 킬로미터 엔진과 미션 무상 보증을 약속합니다.'
        ]
      },
      contract_stamp: {
        id: 'contract_stamp',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '📜 공식 계약서 무결점 날인형',
        shortTitle: '공식계약서',
        tagline: '제조사 본사 전산 바인딩 계약서 · 위약금 0원 무결점 품질 보증',
        icon: '📜',
        themeId: 'royal',
        accentColor: '#1d4ed8',
        hook: '📜 허위 없는 제조사 공식 전산 계약서 그대로 날인 보증!',
        discountNum: 490,
        discount: '제조사 공식 계약 · 위약금 0원',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📜 말로만 하는 약속 NO! 본사 전산 등록 공식 계약서 날인',
          '🛡️ 계약 후 추가금 요구나 사기 걱정 없는 100% 안심 계약',
          '🔑 차량 인수 전 꼼꼼한 34가지 신차 검수 체크리스트 증정',
          '💬 댓글에 [견적] 남기시면 공식 계약 서식 미리보기 발송'
        ],
        ttsLines: [
          '말로만 하는 구두 계약이 아닌 본사 전산 바인딩 공식 계약서입니다.',
          '계약 후 부당한 추가 요구나 잡음 없는 투명한 출고를 약속합니다.',
          '고객님 인수 전 서른네 가지 항목의 정밀 신차 검수를 무상 진행합니다.',
          '댓글에 견적이라고 남기시면 공식 계약 서식을 미리 전송해 드립니다.'
        ]
      },
      family_camping: {
        id: 'family_camping',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '🏕️ 패밀리 SUV 차박 캠핑 & 감성형',
        shortTitle: '패밀리차박',
        tagline: '2열 풀플랫 평탄화 · 9에어백 안심 케어 · 트렁크 유모차 수납',
        icon: '🏕️',
        themeId: 'amber',
        accentColor: '#d97706',
        hook: '🏕️ 이번 주말 가족과 함께 떠나는 완벽한 차박 캠핑 SUV',
        discountNum: 430,
        discount: '월 36만원대 · 캠핑 패키지 증정',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'LOWER_THIRD', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏕️ 주말이 기다려지는 2열 풀플랫 완벽 평탄화 공간',
          '👨‍👩‍👧‍👦 아이들 안전 최우선! 9에어백 & 첨단 ADAS 주행보조',
          '✨ 파노라마 선루프 + 대용량 트렁크 유모차 2대 적재',
          '🎁 이번 주 계약 고객 전원 고급 에어매트+차박텐트 세트 증정'
        ],
        ttsLines: [
          '가족과 함께하는 주말 힐링, 이열 풀플랫 완벽 평탄화 공간을 누려보세요.',
          '아이들의 안전을 최우선으로, 첨단 주행 보조 시스템이 기본 적용되었습니다.',
          '광활한 파노라마 선루프와 유모차 두 대가 거뜬한 대용량 트렁크입니다.',
          '이번 주 계약 고객 전원에게 프리미엄 차박 캠핑 세트를 무상 증정합니다.'
        ]
      },
      ten_year_veteran: {
        id: 'ten_year_veteran',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '🎖️ 15년 근속 명예 카마스터 보증형',
        shortTitle: '15년베테랑',
        tagline: '15년 무사고 출고 1,200대 돌파 · 제조사 최우수 판매왕 직통 케어',
        icon: '🎖️',
        themeId: 'deepblue',
        accentColor: '#1e40af',
        hook: '🎖️ 15년 경력 최우수 카마스터의 1,000대 출고 노하우 직통 케어',
        discountNum: 530,
        discount: '월 41만원대 · 15년 베테랑 보증',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎖️ 15년간 한자리에서 1,200대 출고! 믿을 수 있는 카마스터',
          '🤝 출고 후 5년 동안 소모품 교체 및 사고처리 24시간 직통 케어',
          '📞 신차 길들이기부터 중고차 매각까지 평생 카라이프 파트너',
          '💬 댓글에 [견적] 남기시면 15년 경력의 베테랑 1:1 상담 연결'
        ],
        ttsLines: [
          '십오 년간 한자리에서 천이백 대 이상 출고한 베테랑 카마스터입니다.',
          '출고 후 오 년 동안 소모품 교체와 사고 처리를 이십사 시간 케어해 드립니다.',
          '신차 길들이기부터 향후 중고차 매각까지 평생 파트너가 되어드립니다.',
          '댓글에 견적이라고 남겨주시면 베테랑 일대일 직통 상담을 연결해 드립니다.'
        ]
      },
      real_review: {
        id: 'real_review',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '💬 실제 고객 100% 리얼 출고 후기형',
        shortTitle: '리얼출고후기',
        tagline: '계약 고객 카톡 캡처 그대로 · 만족도 5.0 만점 · 지인 소개율 80%',
        icon: '💬',
        themeId: 'solar',
        accentColor: '#f59e0b',
        hook: '💬 지인 소개율 80%! 실제 출고 고객님들의 솔직한 카톡 후기',
        discountNum: 470,
        discount: '만족도 ★5.0 만점 신화',
        scenePlan: [
          { cut: 1, widget: 'SMARTPHONE_NOTIF_STACK', pos: 'center', cam: 0 },
          { cut: 2, widget: 'DYNAMIC_ISLAND', pos: 'top', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💬 "다른 곳보다 80만원 더 싸고 탁송도 빨랐어요" 리얼 카톡',
          '⭐ 네이버·인스타 출고 리뷰 평점 5.0 만점 달성',
          '🤝 한 번 계약하신 고객님이 가족·지인까지 소개해 주시는 신뢰',
          '💬 댓글에 [후기] 남기시면 100% 무편집 출고 인증 공개'
        ],
        ttsLines: [
          '다른 곳보다 팔십만 원 더 저렴하고 배정도 빨랐다는 고객님들의 실제 카톡입니다.',
          '네이버와 인스타그램 출고 고객 만족도 평점 오 점 만점을 기록 중입니다.',
          '한 번 출고하신 분이 가족과 친구를 다시 소개해 주시는 진짜 신뢰입니다.',
          '댓글에 후기라고 남겨주시면 실제 출고 인증 사진을 모두 공개해 드립니다.'
        ]
      },
      vip_delivery_box: {
        id: 'vip_delivery_box',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '🎁 명품 출고 언박싱 웰컴 기프트형',
        shortTitle: '출고언박싱',
        tagline: '루마 버텍스 프리미엄 틴팅 · QXD 블랙박스 · 유리막 코팅 풀세트',
        icon: '🎁',
        themeId: 'royal',
        accentColor: '#d4af37',
        hook: '🎁 최고급 썬팅+블랙박스+유리막! 200만원 상당 출고 패키지 무상 시공',
        discountNum: 580,
        discount: '200만원 상당 용품 풀시공',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎁 루마 버텍스 프리미엄 틴팅 정품 보증서 발급 무상 시공',
          '📷 전후방 QHD 2채널 초고화질 블랙박스 + 에어케어 장착',
          '✨ 100만원 상당 일본 명품 유리막 코팅 & 생활보호 PPF 4종',
          '💬 댓글에 [견적] 남기시면 8종 용품 패키지 우선 배정'
        ],
        ttsLines: [
          '루마 버텍스 정품 보증서가 발급되는 최고급 틴팅을 무상 시공해 드립니다.',
          '초고화질 투 채널 블랙박스와 에어컨 냄새 방지 케어 시스템을 장착합니다.',
          '백만 원 상당의 일본 명품 유리막 코팅과 생활보호 필름을 모두 둘러드립니다.',
          '댓글에 견적이라고 남기시면 팔 종 프리미엄 용품 패키지를 먼저 챙겨드립니다.'
        ]
      },
      full_inspection: {
        id: 'full_inspection',
        category: 'trust',
        layoutMode: 'BLUEHANDS_INSPECT',
        title: '📋 120가지 정밀 사전검수형',
        shortTitle: '120가지사전검수',
        tagline: '하부 누유부터 전자 장비까지 120개 항목 정밀 점검 · 무결점 확인서 고객 제공',
        icon: '📋',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '📋 볼트 하나까지 120가지 정밀 사전 검수! 무결점 차량만 출고합니다',
        discountNum: 540,
        discount: '120개 항목 정밀 점검표 발급',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📋 도장면 단차, 하부 누유, 배터리 진단까지 국가공인 정비사가 직접 검수',
          '📸 출고 전 120개 검수 항목의 실물 사진과 체크리스트를 카카오톡 전송',
          '🛡️ 이상 발견 시 100% 본사 교환 및 무결점 재배정 안심 프로세스',
          '💬 댓글에 [검수] 남기시면 120가지 실물 정밀 검수 리포트 발송'
        ],
        ttsLines: [
          '도장 단차부터 하부 누유까지 국가 공인 정비사가 백이십 가지 항목을 정밀 검수합니다.',
          '검수 과정의 실물 사진과 체크리스트를 고객님께 투명하게 전송해 드립니다.',
          '작은 결함이라도 발견되면 즉시 교환하여 무결점 차량만을 인도해 드립니다.',
          '댓글에 검수라고 남겨주시면 정밀 검수 샘플 리포트를 전송해 드립니다.'
        ]
      },
      nationwide_carrier: {
        id: 'nationwide_carrier',
        category: 'trust',
        layoutMode: 'BLUEHANDS_INSPECT',
        title: '🚛 전국 세이프 캐리어 탁송형',
        shortTitle: '전국캐리어탁송',
        tagline: '제주도까지 집 앞 전용 캐리어 안전 탁송 · 주행거리 0km 신차 컨디션 유지',
        icon: '🚛',
        themeId: 'deepblue',
        accentColor: '#38bdf8',
        hook: '🚛 주행거리 늘어나는 로드 탁송 NO! 전용 세이프 캐리어로 안방 배달',
        discountNum: 510,
        discount: '전국 세이프 캐리어 탁송비 지원',
        scenePlan: [
          { cut: 1, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🚛 다른 사람이 몰고 오는 로드 탁송이 아닌 전용 캐리어 차량에 실어 안전 운송',
          '📍 서울부터 부산, 제주도까지 고객님 댁 주차장 앞까지 정확한 시간 엄수 배송',
          '🛡️ 탁송 중 발생할 수 있는 스톤칩 방지를 위한 특수 보호 랩핑 시공',
          '💬 댓글에 [탁송] 남기시면 전국 어디든 캐리어 탁송비 전액 지원'
        ],
        ttsLines: [
          '남이 운전해서 오는 로드 탁송이 아닌 전용 캐리어에 실어 안전하게 배달해 드립니다.',
          '전국 어디든 고객님 자택 주차장 앞까지 약속된 시간에 맞춰 안전히 도착합니다.',
          '이동 중 발생할 수 있는 미세 흠집까지 방지하는 전용 보호 필름을 씌워 운송합니다.',
          '댓글에 탁송이라고 남겨주시면 캐리어 탁송 비용을 전액 지원해 드립니다.'
        ]
      },
      no_fake_price: {
        id: 'no_fake_price',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '💯 정찰제 100% 실견적형',
        shortTitle: '정찰제실견적',
        tagline: '취등록세 및 부대비용 포함 100% 투명 영수증 공개 · 낚시 견적 절대 사절',
        icon: '💯',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '💯 1원도 숨기지 않는 정찰제 실견적! 숨은 부대비용 0원 투명 공개',
        discountNum: 480,
        discount: '숨은 추가금 0원 정찰제',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '💯 인터넷 미끼 견적에 낚이지 마세요! 취등록세, 공채, 탁송료 100% 공개',
          '🧾 공식 전산 영수증과 계약서를 토씨 하나 숨김없이 고객님께 투명 교부',
          '🙅‍♂️ 출고 당일 말 바꾸거나 추가 비용을 요구하지 않는 안심 정찰제 확약',
          '💬 댓글에 [정찰제] 남기시면 거품 없는 1원 단위 투명 실견적서 발송'
        ],
        ttsLines: [
          '인터넷 낚시 견적에 속지 마세요. 취등록세와 탁송료를 모두 투명하게 공개합니다.',
          '공식 전산 영수증과 계약서를 있는 그대로 투명하게 교부해 드립니다.',
          '출고 당일 말을 바꾸거나 추가 비용을 요구하지 않는 클린 정찰제를 약속합니다.',
          '댓글에 정찰제라고 남겨주시면 일 원 단위까지 정직한 견적서를 보내드립니다.'
        ]
      },
      female_driver: {
        id: 'female_driver',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '🌸 초보·가족 맞춤 안심케어형',
        shortTitle: '초보가족안심케어',
        tagline: '출고 후 기능 1:1 방문 코칭 · 24시간 안심 긴급 콜 서비스 · 가족의 안전 최우선',
        icon: '🌸',
        themeId: 'teal',
        accentColor: '#38bdf8',
        hook: '🌸 차를 잘 몰라도 걱정 제로! 출고 후 1:1 방문 기능 코칭 안심 케어',
        discountNum: 460,
        discount: '초보 맞춤형 1:1 안심 케어',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🌸 차 기능 조작이 낯선 초보 운전자와 가족을 위한 눈높이 1시간 친절 코칭',
          '📞 야간 경고등이나 접촉 사고 시 24시간 즉시 연결되는 전담 카마스터 직통폰',
          '👶 유아용 카시트 장착 및 사각지대 어라운드 뷰 세팅 완벽 지원',
          '💬 댓글에 [안심케어] 남기시면 초보 운전자를 위한 1:1 전담 매니저 배정'
        ],
        ttsLines: [
          '차량 기능이 낯선 초보 운전자분들을 위해 한 시간 동안 눈높이에 맞춰 친절히 설명해 드립니다.',
          '야간 경고등 점등이나 비상 상황 시 이십사 시간 직통으로 연락 가능한 번호를 드립니다.',
          '어린 자녀를 위한 카시트 장착과 안전 주행 기능 설정을 꼼꼼히 챙겨드립니다.',
          '댓글에 안심케어라고 남겨주시면 가족처럼 챙겨드리는 전담 매니저를 연결해 드립니다.'
        ]
      },
      accident_free_care: {
        id: 'accident_free_care',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '🛡️ 무사고 5년 연장보증형',
        shortTitle: '무사고5년보증',
        tagline: '제조사 기본 보증에 공식 카마스터 추가 2년 연장 보증 · 엔진 미션 완벽 보호',
        icon: '🛡️',
        themeId: 'teal',
        accentColor: '#22c55e',
        hook: '🛡️ 기본 보증 끝났다고 걱정 마세요! 5년 10만km 무상 연장 보증 혜택',
        discountNum: 590,
        discount: '5년 10만km 연장 보증 무상 제공',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🛡️ 제조사 보증기간이 끝난 후에도 2년간 추가 보증해 드리는 안심 워런티',
          '🔧 엔진, 미션, 조향장치, 전자장비 고장 시 자기부담금 0원 무상 수리',
          '📜 전국 현대/제네시스 공식 서비스센터 어디서나 호환 가능한 정품 보증서',
          '💬 댓글에 [연장보증] 남기시면 5년 무상 보증 케어 증서 동봉 출고'
        ],
        ttsLines: [
          '제조사 기본 보증이 끝난 후에도 이 년간 추가로 무상 수리를 보장해 드립니다.',
          '엔진과 변속기 등 핵심 부품 고장 시 자기부담금 없이 완벽하게 고쳐드립니다.',
          '전국 공식 서비스망에서 호환되는 정품 연장 보증서를 함께 발급해 드립니다.',
          '댓글에 연장보증이라고 남겨주시면 오 년 안심 보증 혜택을 챙겨드립니다.'
        ]
      },
      tinting_guarantee: {
        id: 'tinting_guarantee',
        category: 'trust',
        layoutMode: 'BLUEHANDS_INSPECT',
        title: '🎁 명품 비반사 틴팅 시공형',
        shortTitle: '명품비반사틴팅',
        tagline: '루마 버텍스 900급 열차단 틴팅 & QXD 블랙박스 풀시공 · 정품 전자보증서 발급',
        icon: '🎁',
        themeId: 'royal',
        accentColor: '#f59e0b',
        hook: '🎁 싸구려 영맨표 썬팅 NO! 150만원 상당 루마 버텍스 정품 풀시공',
        discountNum: 530,
        discount: '150만원 상당 틴팅·블박 무상시공',
        scenePlan: [
          { cut: 1, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🎁 자외선 99.9%, 열차단율 70% 이상의 하이엔드 프리미엄 비반사 필름',
          '📷 전후방 QHD 초고화질 블랙박스 + 주차 중 충격 감지 커넥티드 모듈 장착',
          '📜 공식 시공 대리점에서 발행하는 10년 정품 전자 품질 보증서 발급',
          '💬 댓글에 [틴팅] 남기시면 명품 틴팅 시공 패키지 우선 예약'
        ],
        ttsLines: [
          '자외선과 열을 완벽히 차단하는 백오십만 원 상당의 하이엔드 비반사 틴팅을 시공합니다.',
          '초고화질 블랙박스와 통신형 모듈을 장착하여 주차 중 충격도 스마트폰으로 알려줍니다.',
          '십 년 품질 보증서가 발급되는 공식 대리점 정품 시공만을 고집합니다.',
          '댓글에 틴팅이라고 남겨주시면 명품 틴팅 시공 패키지를 지원해 드립니다.'
        ]
      },
      youtube_delivery: {
        id: 'youtube_delivery',
        category: 'trust',
        layoutMode: 'FAMILY_SAFETY',
        title: '📹 유튜브 출고 영상 선물형',
        shortTitle: '출고영상숏폼제작',
        tagline: '감동적인 신차 인도 순간을 4K 숏폼으로 제작 선물 · 평생 기억될 특별한 추억',
        icon: '📹',
        themeId: 'neon',
        accentColor: '#ec4899',
        hook: '📹 생애 첫 신차 출고 순간! 4K 시네마틱 숏폼 영상 무료 제작 선물',
        discountNum: 490,
        discount: '4K 출고 기념 숏폼 무료 제작',
        scenePlan: [
          { cut: 1, widget: 'MAGAZINE_COVER', pos: 'center', cam: 0 },
          { cut: 2, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '📹 리본 커팅부터 첫 시동의 설렘까지 전문 촬영팀이 4K 고화질 영상 기록',
          '🎬 인스타그램 릴스와 유튜브 쇼츠에 바로 올릴 수 있는 세련된 숏폼 편집본',
          '💐 고급 꽃다발 및 맞춤 레터링 케이크와 함께하는 특별한 출고식 이벤트',
          '💬 댓글에 [출고영상] 남기시면 출고 세리머니 패키지 무상 예약'
        ],
        ttsLines: [
          '신차를 인도받는 감동적인 첫 순간을 전문 카메라로 담아 세련된 숏폼으로 편집해 드립니다.',
          '인스타그램과 유튜브에 자랑하실 수 있도록 고화질 영상 파일로 선물해 드립니다.',
          '축하 꽃다발과 맞춤 케이크가 함께하는 감동적인 출고 이벤트를 준비합니다.',
          '댓글에 출고영상이라고 남겨주시면 특별 출고 세리머니를 준비해 드립니다.'
        ]
      },
      door_to_door: {
        id: 'door_to_door',
        category: 'trust',
        layoutMode: 'BLUEHANDS_INSPECT',
        title: '🏠 집 앞으로 찾아오는 시승형',
        shortTitle: '홈방문시승상담',
        tagline: '전시장 방문 없이 원하는 시간·장소로 시승차 직접 배달 · 주차장 주차 테스트',
        icon: '🏠',
        themeId: 'teal',
        accentColor: '#38bdf8',
        hook: '🏠 바쁜 직장인을 위해! 계신 곳 주차장으로 시승차 몰고 찾아갑니다',
        discountNum: 450,
        discount: '전국 무료 1:1 방문 시승',
        scenePlan: [
          { cut: 1, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'LOWER_THIRD', pos: 'bottom', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏠 주말에 전시장 갈 시간 없으신가요? 고객님 회사나 자택 앞으로 시승차 배달',
          '🅿️ 실제 출퇴근 코스 주행과 아파트 지하주차장 주차 편의성을 직접 확인',
          '☕ 부담스러운 구매 강요 절대 없이 순수하게 차만 타보실 수 있는 힐링 시승',
          '💬 댓글에 [방문시승] 남기시면 원하시는 날짜와 장소로 시승차 출발'
        ],
        ttsLines: [
          '전시장에 오실 필요 없이 고객님 회사나 집 앞으로 시승 차량을 직접 가져다 드립니다.',
          '매일 다니시는 출퇴근 도로와 아파트 주차장에서 차의 크기와 승차감을 시험해 보세요.',
          '구매 부담 없이 편안하게 타보실 수 있도록 친절하게 안내해 드립니다.',
          '댓글에 방문시승이라고 남겨주시면 원하시는 일정에 맞춰 찾아뵙겠습니다.'
        ]
      },
      reorder_rate: {
        id: 'reorder_rate',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '🏆 7년 연속 재구매 1위형',
        shortTitle: '재구매율1위',
        tagline: '누적 1,200대 출고 · 고객 평점 4.98점 보증 · 평생 자동차 주치의 사후관리',
        icon: '🏆',
        themeId: 'royal',
        accentColor: '#facc15',
        hook: '🏆 고객 10명 중 8명이 다시 찾는 카마스터! 누적 1,200대 출고 신화',
        discountNum: 580,
        discount: '7년 연속 고객만족도 1위 사후케어',
        scenePlan: [
          { cut: 1, widget: 'CONTRACT_STAMP_SIGN', pos: 'center', cam: 0 },
          { cut: 2, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 1 },
          { cut: 3, widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '🏆 한 번 맺은 인연은 평생! 출고 후 5년, 10년이 지나도 변함없는 사후 관리',
          '⭐️ 고객 만족도 평가 4.98점! 지인 소개와 재구매로만 증명된 정직한 서비스',
          '🛠️ 정기 오일 교환 알림부터 사고 처리 대행까지 원스톱 자동차 비서 역할',
          '💬 댓글에 [평생케어] 남기시면 VIP 전담 평생 주치의 카마스터 등록'
        ],
        ttsLines: [
          '출고 후에도 오 년, 십 년 동안 변함없이 고객님의 소중한 자동차를 케어해 드립니다.',
          '평점 사 점 구팔 점으로 입증된 정직하고 투명한 관리로 고객 만족을 약속합니다.',
          '정기 점검 시기 안내부터 사고 처리까지 모든 과정을 가족처럼 전담해 드립니다.',
          '댓글에 평생케어라고 남겨주시면 평생 자동차 주치의 서비스를 등록해 드립니다.'
        ]
      },
      honest_quote: {
        id: 'honest_quote',
        category: 'trust',
        layoutMode: 'CLASSIC_SHOWROOM',
        title: '⚖️ 타사 견적 분석 양심견적형',
        shortTitle: '양심견적비교',
        tagline: '과다 청구된 부대비용 및 고금리 상품 즉시 거품 제거 · 투명 비교 리포트',
        icon: '⚖️',
        themeId: 'teal',
        accentColor: '#10b981',
        hook: '⚖️ 타사 견적서 사진 찍어 보내주세요! 거품 쏙 뺀 양심 최저가 공개',
        discountNum: 520,
        discount: '타사 대비 거품 전액 제거 확약',
        scenePlan: [
          { cut: 1, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 0 },
          { cut: 2, widget: 'PRICE_STRIKE_THROUGH', pos: 'center', cam: 1 },
          { cut: 3, widget: 'CHECKLIST_GLASS', pos: 'center', cam: 2 },
          { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }
        ],
        cutCaptions: [
          '⚖️ 타 대리점에서 받은 견적서의 숨겨진 수수료와 이자율을 정확히 팩트체크',
          '🔍 겉으로만 저렴해 보이는 편법 리스/렌트의 교묘한 독소 조항 사전 차단',
          '📉 불필요한 마진을 모두 걷어낸 본사 공식 최저가 견적으로 1:1 재산출',
          '💬 댓글에 [견적비교] 남기시면 3분 만에 타사 견적서 거품 분석 리포트 회신'
        ],
        ttsLines: [
          '타사에서 받아보신 견적서를 보내주시면 숨어있는 불필요한 수수료를 짚어드립니다.',
          '초기비용이 저렴해 보여도 만기에 폭탄을 맞는 독소 조항을 사전에 꼼꼼히 걸러냅니다.',
          '영업 수수료 거품을 모두 걷어낸 정직한 본사 공식 최저가로 다시 산출해 드립니다.',
          '댓글에 견적비교라고 남겨주시면 삼 분 안에 견적서 팩트체크 리포트를 보내드립니다.'
        ]
      }
    };

    function loadUserCustomArchetypes() {
      try {
        return JSON.parse(localStorage.getItem('autoreels_user_custom_styles') || '{}');
      } catch (e) {
        return {};
      }
    }

    // 전역 스토리 아키타입 사전 (큐레이션 96종 + 사용자 영구 저장 AI 커스텀)
    const STORY_ARCHETYPES = { ...BASE_STORY_ARCHETYPES, ...arIndustryArchetypes(), ...loadUserCustomArchetypes() };

    let activeStoryArchetypeKey = 'clearance';
    let currentArchetypeCategory = 'all';

    function getFavoriteArchetypes() {
      try {
        return JSON.parse(localStorage.getItem('autoreels_favorites') || '[]');
      } catch (e) {
        return [];
      }
    }

    function toggleFavoriteArchetype(e, archKey) {
      if (e) e.stopPropagation();
      const favs = getFavoriteArchetypes();
      const idx = favs.indexOf(archKey);
      if (idx >= 0) {
        favs.splice(idx, 1);
      } else {
        favs.push(archKey);
      }
      localStorage.setItem('autoreels_favorites', JSON.stringify(favs));
      updateArchetypeCounts();
      renderStoryArchetypesUI();
    }

    function isFavoriteArchetype(archKey) {
      return getFavoriteArchetypes().includes(archKey);
    }

    function getPinnedArchetype() {
      return localStorage.getItem('autoreels_pinned_style') || '';
    }

    function togglePinnedArchetype(e, archKey) {
      if (e) e.stopPropagation();
      const current = getPinnedArchetype();
      if (current === archKey) {
        localStorage.removeItem('autoreels_pinned_style');
      } else {
        localStorage.setItem('autoreels_pinned_style', archKey);
      }
      renderStoryArchetypesUI();
    }

    function saveUserCustomArchetype(customArch) {
      const custom = loadUserCustomArchetypes();
      custom[customArch.id] = customArch;
      localStorage.setItem('autoreels_user_custom_styles', JSON.stringify(custom));
      Object.assign(STORY_ARCHETYPES, custom);
      updateArchetypeCounts();
      renderStoryArchetypesUI();
    }

    function deleteUserCustomArchetype(e, archId) {
      if (e) e.stopPropagation();
      if (!confirm('이 커스텀 AI 스타일을 라이브러리에서 삭제하시겠습니까?')) return;
      const custom = loadUserCustomArchetypes();
      delete custom[archId];
      delete STORY_ARCHETYPES[archId];
      localStorage.setItem('autoreels_user_custom_styles', JSON.stringify(custom));
      if (activeStoryArchetypeKey === archId) {
        applyStoryArchetype('clearance');
      }
      updateArchetypeCounts();
      renderStoryArchetypesUI();
    }

    function saveCurrentAiMixerStyle() {
      const seedEl = document.getElementById('aiMixerSeedText');
      const seedMatch = seedEl ? seedEl.textContent.match(/\d+/) : null;
      const seed = seedMatch ? seedMatch[0] : Math.floor(100000 + Math.random() * 900000);
      const customId = `custom_ai_${seed}`;
      const themeObj = DIRECTOR_THEMES[campaign.themeId] || DIRECTOR_THEMES.royal;
      
      const newArch = {
        id: customId,
        category: 'custom',
        layoutMode: campaign.layoutMode || 'CLASSIC_SHOWROOM',
        title: `✨ AI 맞춤 #${seed}`,
        shortTitle: `AI #${seed}`,
        tagline: `${themeObj.name} · ${campaign.layoutMode} · ${campaign.discount}`,
        icon: '✨',
        themeId: campaign.themeId,
        accentColor: themeObj.accent,
        hook: campaign.hook,
        discountNum: campaign.discountNum,
        discount: campaign.discount,
        scenePlan: JSON.parse(JSON.stringify(campaign.scenePlan)),
        cutCaptions: [...campaign.cutCaptions],
        ttsLines: [...campaign.ttsLines],
        isCustom: true
      };

      saveUserCustomArchetype(newArch);
      activeStoryArchetypeKey = customId;
      filterArchetypeCategory('custom');
      alert(`🎉 AI 맞춤 스타일 [#${seed}]이 '✨ 내 커스텀' 탭에 영구 저장되었습니다!`);
    }

    function generateBatchCustomArchetypes(count = 10) {
      const custom = loadUserCustomArchetypes();
      if (typeof IND !== 'undefined' && IND.key !== 'auto') {
        // 자동차가 아닌 업종: 그 업종 문구로만 만들고, 그 업종에서만 보이게
        for (let i = 0; i < count; i++) {
          const pick = arIndustryCopyPick();
          const seed = Math.floor(100000 + Math.random() * 900000);
          const id = `batch_${IND.key}_${seed}_${i}`;
          custom[id] = {
            id, industry: IND.key, category: 'custom', layoutMode: 'CLASSIC_SHOWROOM',
            title: `🎲 ${IND.name} 문구 #${seed}`, shortTitle: `${IND.name} #${seed}`, tagline: pick.hook, icon: IND.icon,
            themeId: 'royal', accentColor: '#38bdf8', hook: pick.hook, discountNum: campaign.discountNum || 0, discount: campaign.discount || '',
            scenePlan: JSON.parse(JSON.stringify(campaign.scenePlan || [])), cutCaptions: pick.caps, ttsLines: pick.tts, isCustom: true
          };
        }
        try { localStorage.setItem('autoreels_user_custom_styles', JSON.stringify(custom)); } catch (e) {}
        Object.assign(STORY_ARCHETYPES, custom);
        currentArchetypeCategory = 'custom';
        renderStoryArchetypesUI();
        return;
      }
      const lModes = ['EDITORIAL_VOGUE', 'BROADCAST_NEWS', 'CYBER_HUD', 'TIKTOK_VIRAL_SPLIT', 'RACING_ACTION', 'CLASSIC_SHOWROOM'];
      const themeKeys = Object.keys(DIRECTOR_THEMES);

      for (let i = 0; i < count; i++) {
        const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        const themeObj = DIRECTOR_THEMES[randomTheme];
        const shuffled = [...WIDGET_POOL].sort(() => Math.random() - 0.5);
        const selectedLMode = lModes[Math.floor(Math.random() * lModes.length)];
        const seed = Math.floor(100000 + Math.random() * 900000);
        const customId = `batch_ai_${seed}_${i}`;

        const hookIdx = Math.floor(Math.random() * PROCEDURAL_HOOKS.length);
        const c1 = PROCEDURAL_CUT1[Math.floor(Math.random() * PROCEDURAL_CUT1.length)];
        const c2 = PROCEDURAL_CUT2[Math.floor(Math.random() * PROCEDURAL_CUT2.length)];
        const c3 = PROCEDURAL_CUT3[Math.floor(Math.random() * PROCEDURAL_CUT3.length)];
        const c4 = PROCEDURAL_CUT4[Math.floor(Math.random() * PROCEDURAL_CUT4.length)];

        custom[customId] = {
          id: customId,
          category: 'custom',
          layoutMode: selectedLMode,
          title: `🎲 AI 생성 #${seed}`,
          shortTitle: `AI #${seed}`,
          tagline: `${themeObj.name} · ${selectedLMode} · 완전 신규 연출`,
          icon: '🎲',
          themeId: randomTheme,
          accentColor: themeObj.accent,
          hook: PROCEDURAL_HOOKS[hookIdx],
          discountNum: 360 + (i * 50),
          discount: `월 ${32 + i * 4}만원대 · 비공식 특별지원`,
          scenePlan: [
            { cut: 1, widget: shuffled[0], pos: 'center', cam: Math.floor(Math.random() * 8) },
            { cut: 2, widget: shuffled[1], pos: 'center', cam: Math.floor(Math.random() * 8) },
            { cut: 3, widget: shuffled[2], pos: 'center', cam: Math.floor(Math.random() * 8) },
            { cut: 4, widget: shuffled[3], pos: 'bottom', cam: Math.floor(Math.random() * 8) }
          ],
          cutCaptions: [c1, c2, c3, c4],
          ttsLines: [
            c1.replace(/^[^\s]+\s*/, ''),
            c2.replace(/^[^\s]+\s*/, ''),
            c3.replace(/^[^\s]+\s*/, ''),
            c4.replace(/^[^\s]+\s*/, '')
          ],
          isCustom: true
        };
      }
      localStorage.setItem('autoreels_user_custom_styles', JSON.stringify(custom));
      Object.assign(STORY_ARCHETYPES, custom);
      updateArchetypeCounts();
      filterArchetypeCategory('custom');
      alert(`✨ 10종의 새로운 AI 고유 스타일이 성공적으로 합성되어 '✨ 내 커스텀' 탭에 추가되었습니다!`);
    }

    function updateArchetypeCounts() {
      const allKeys = Object.keys(STORY_ARCHETYPES).filter(arArchetypeVisible);
      const totalCount = allKeys.length;
      const customCount = allKeys.filter(k => STORY_ARCHETYPES[k].category === 'custom').length;
      const favCount = getFavoriteArchetypes().length;

      const elAll = document.getElementById('catCount_all');
      if (elAll) elAll.textContent = totalCount;
      const elCustom = document.getElementById('customTabCount');
      if (elCustom) elCustom.textContent = `(${customCount})`;
      const elFav = document.getElementById('favTabCount');
      if (elFav) elFav.textContent = `(${favCount})`;

      const cats = ['vlog', 'special', 'luxury', 'ev_tech', 'sports', 'finance', 'trust'];
      cats.forEach(c => {
        const el = document.getElementById(`catCount_${c}`);
        if (el) el.textContent = allKeys.filter(k => STORY_ARCHETYPES[k].category === c).length;
      });
    }

    function updateFavoriteTabCount() {
      updateArchetypeCounts();
    }

    function filterArchetypeCategory(catKey) {
      currentArchetypeCategory = catKey;
      const cats = ['all', 'favorite', 'vlog', 'special', 'luxury', 'ev_tech', 'sports', 'finance', 'trust', 'custom'];
      cats.forEach((c) => {
        const btn = document.getElementById(`archCatBtn_${c}`);
        if (btn) {
          if (c === catKey) {
            btn.className = 'h-6 px-2.5 rounded-[5px] font-medium bg-[#232325] text-white border border-white/30 shrink-0';
          } else {
            btn.className = 'h-6 px-2.5 rounded-[5px] text-[#a1a1a6] hover:text-[#ededed] shrink-0';
          }
        }
      });
      renderStoryArchetypesUI();
    }

    // 업종별 문구 재료: 그 업종 대본 템플릿 6종 + 상품 프리셋에서 컷마다 (자막, 성우) 짝을 뽑아 섞음
    let arLastCopyPick = -1;
    function arIndustryCopyPick() {
      // 앞뒤가 맞는 이야기가 되도록 대본 한 벌을 통째로 고름 (업종 템플릿 6종 + 상품 프리셋 대본), 직전 것과는 다르게
      const fill = (x) => String(x).replace(/\{product\}/g, campaign.vehicle || IND.product);
      const strip = (x) => String(x || '').replace(/^✔\s*/, '');
      const options = (AR_INDUSTRY_TEMPLATES[IND.key] || []).map((tp) => ({ hook: fill(tp[3]), caps: tp[4].map(fill), tts: tp[5].map(fill) }));
      Object.values(AR_INDUSTRY_PRESETS[IND.key] || {}).forEach((p) => options.push({
        hook: p.hook,
        caps: [p.hook, strip(p.bullets[0]), `${p.priceLine} · ${p.discount}`, strip(p.bullets[1])],
        tts: [`${p.vehicle}, 소개해 드릴게요.`, `${strip(p.bullets[0])}.`, `${strip(p.bullets[1])}.`, `${IND.cta} 문의 기다릴게요.`]
      }));
      if (!options.length) return { hook: campaign.hook, caps: campaign.cutCaptions, tts: campaign.ttsLines };
      let k = Math.floor(Math.random() * options.length);
      if (options.length > 1 && k === arLastCopyPick) k = (k + 1 + Math.floor(Math.random() * (options.length - 1))) % options.length;
      arLastCopyPick = k;
      return options[k];
    }
    function arRandomizeIndustryScript() {
      const pick = arIndustryCopyPick();
      campaign.hook = pick.hook;
      campaign.cutCaptions = pick.caps;
      campaign.ttsLines = pick.tts;
      const hookInput = document.getElementById('inputHook');
      if (hookInput) hookInput.value = campaign.hook;
      const d = getSelectedDealer();
      if (d && d.variation) d.variation.hook = campaign.hook;
      const badge = document.getElementById('activeArchetypeBadge');
      if (badge) badge.textContent = `🎲 ${IND.icon} ${IND.name} 문구 조합`;
      const bar = document.getElementById('aiMixerRecipeInfo');
      if (bar) { bar.classList.add('hidden'); bar.classList.remove('flex'); }
      activeStoryArchetypeKey = 'custom_ai';
      if (typeof syncDynamicCutCountAndPhotos === 'function') { try { syncDynamicCutCountAndPhotos(); } catch (e) {} }
      syncPreviewPanel();
      syncTechPanel();
      AudioEngine.lastSpokenCut = -1;
      AudioEngine.prefetchTtsBuffers();
      if (window.__timelines && window.__timelines['main']) window.__timelines['main'].seek(0.2);
    }

        function randomizeCustomStyle() {
      if (typeof IND !== 'undefined' && IND.key !== 'auto') return arRandomizeIndustryScript();
      // 1. 24종 디렉터 테마 무작위 선택
      const themeKeys = Object.keys(DIRECTOR_THEMES);
      const themeIdx = Math.floor(Math.random() * themeKeys.length);
      const randomTheme = themeKeys[themeIdx];
      const themeObj = DIRECTOR_THEMES[randomTheme];

      // 2. 22종 시각 위젯 중 4컷 완전 비복원 무작위 추출 (중복 절대 없음)
      // 수학적 순열: P(22, 4) = 22 × 21 × 20 × 19 = 175,560가지
      const shuffledWidgets = [...WIDGET_POOL].sort(() => Math.random() - 0.5);
      const selectedWidgets = shuffledWidgets.slice(0, 4);

      // 고유 순열 인덱스 및 시드 생성
      const wIdx0 = WIDGET_POOL.indexOf(selectedWidgets[0]);
      const wIdx1 = WIDGET_POOL.indexOf(selectedWidgets[1]);
      const wIdx2 = WIDGET_POOL.indexOf(selectedWidgets[2]);
      const wIdx3 = WIDGET_POOL.indexOf(selectedWidgets[3]);
      const permIndex = ((wIdx0 * 21 * 20 * 19 + wIdx1 * 20 * 19 + wIdx2 * 19 + wIdx3) * 24 + themeIdx) % 4213440;
      const seedNumber = Math.floor(100000 + Math.random() * 900000);

      // 3. 4개 컷별 카메라 앵글 & 모션 무작위 매칭 (8^4 = 4,096가지)
      const cams = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8)
      ];
      const positions = ['top', 'center', 'bottom'];
      const customScenePlan = [
        { cut: 1, widget: selectedWidgets[0], pos: selectedWidgets[0] === 'DYNAMIC_ISLAND' ? 'top' : (selectedWidgets[0] === 'LOWER_THIRD' ? 'bottom' : 'center'), cam: cams[0] },
        { cut: 2, widget: selectedWidgets[1], pos: selectedWidgets[1] === 'DYNAMIC_ISLAND' ? 'top' : 'center', cam: cams[1] },
        { cut: 3, widget: selectedWidgets[2], pos: selectedWidgets[2] === 'RECEIPT_QUOTE' ? 'bottom' : 'center', cam: cams[2] },
        { cut: 4, widget: selectedWidgets[3], pos: 'bottom', cam: cams[3] }
      ];

      // 4. 화면 전체 레이아웃 구성 모드 (6종 전면 변환)
      const layoutModes = ['EDITORIAL_VOGUE', 'BROADCAST_NEWS', 'CYBER_HUD', 'TIKTOK_VIRAL_SPLIT', 'RACING_ACTION', 'CLASSIC_SHOWROOM'];
      const selectedLayoutMode = layoutModes[Math.floor(Math.random() * layoutModes.length)];
      campaign.layoutMode = selectedLayoutMode;

      // 5. 시네마틱 대기 FX 무작위 지정 (6종)
      const fxObj = ATMOSPHERE_FX_OPTIONS[Math.floor(Math.random() * ATMOSPHERE_FX_OPTIONS.length)];
      campaign.atmosphereFx = fxObj.id;

      // 6. 다이내믹 세일즈 조건 및 절차적 킬러 카피 매트릭스 결합
      const discountOptions = [290, 340, 390, 440, 480, 520, 580, 640, 720, 850, 920, 1100];
      const randomDiscountNum = discountOptions[Math.floor(Math.random() * discountOptions.length)];
      const monthlyPay = Math.floor(randomDiscountNum * 0.07 + 19);

      const hookIdx = Math.floor(Math.random() * PROCEDURAL_HOOKS.length);
      const c1Idx = Math.floor(Math.random() * PROCEDURAL_CUT1.length);
      const c2Idx = Math.floor(Math.random() * PROCEDURAL_CUT2.length);
      const c3Idx = Math.floor(Math.random() * PROCEDURAL_CUT3.length);
      const c4Idx = Math.floor(Math.random() * PROCEDURAL_CUT4.length);

      const randomHook = PROCEDURAL_HOOKS[hookIdx];
      const randomCutCaptions = [
        PROCEDURAL_CUT1[c1Idx],
        PROCEDURAL_CUT2[c2Idx],
        PROCEDURAL_CUT3[c3Idx],
        PROCEDURAL_CUT4[c4Idx]
      ];
      const randomTtsLines = [
        `${PROCEDURAL_CUT1[c1Idx].replace(/^[^\s]+\s*/, '')}`,
        `${PROCEDURAL_CUT2[c2Idx].replace(/^[^\s]+\s*/, '')}`,
        `최대 ${randomDiscountNum}만 원 특판 혜택, ${PROCEDURAL_CUT3[c3Idx].replace(/^[^\s]+\s*/, '')}`,
        `${PROCEDURAL_CUT4[c4Idx].replace(/^[^\s]+\s*/, '')}`
      ];

      campaign.hook = randomHook;
      campaign.discountNum = randomDiscountNum;
      campaign.discount = `월 ${monthlyPay}만원대 · 비공식 지원`;
      campaign.scenePlan = customScenePlan;
      campaign.cutCaptions = randomCutCaptions;
      campaign.ttsLines = randomTtsLines;

      // 폼 인풋 동기화
      const numInput = document.getElementById('inputDiscountNum');
      if (numInput) numInput.value = campaign.discountNum;
      const dInput = document.getElementById('inputDiscount');
      if (dInput) dInput.value = campaign.discount;
      const hookInput = document.getElementById('inputHook');
      if (hookInput) hookInput.value = campaign.hook;

      const d = getSelectedDealer();
      if (d && d.variation) {
        d.variation.hook = campaign.hook;
      }

      // UI 뱃지 업데이트
      const badge = document.getElementById('activeArchetypeBadge');
      if (badge) {
        badge.textContent = `🎲 AI 커스텀 믹스 (${themeObj.name})`;
        badge.style.borderColor = themeObj.accent;
        badge.style.color = themeObj.accent;
      }

      // 무한 조합 상세 스펙 정보 바 업데이트 (4,213,440 조합 중 고유 번호 시각화)
      const recipeInfoBar = document.getElementById('aiMixerRecipeInfo');
      if (recipeInfoBar) {
        recipeInfoBar.classList.remove('hidden');
        recipeInfoBar.classList.add('flex');
        const seedTextEl = document.getElementById('aiMixerSeedText');
        if (seedTextEl) seedTextEl.innerHTML = `<span>🎲</span> <span>시드 #${seedNumber}</span>`;
        const permTextEl = document.getElementById('aiMixerPermText');
        if (permTextEl) permTextEl.textContent = `4,213,440 조합 중 #${permIndex.toLocaleString()}호`;
        const recipeTextEl = document.getElementById('aiMixerRecipeText');
        if (recipeTextEl) {
          const layoutLabels = {
            EDITORIAL_VOGUE: '시네마틱 럭셔리 에디토리얼',
            BROADCAST_NEWS: '24시 방송국 LIVE 속보',
            CYBER_HUD: '3D 사이버네틱 HUD 테크',
            TIKTOK_VIRAL_SPLIT: '2분할 바이럴 숏폼',
            RACING_ACTION: '-8도 사선 레이싱 서킷',
            CLASSIC_SHOWROOM: '정통 공식 쇼룸'
          };
          const wNames = selectedWidgets.map(w => WIDGET_LABELS[w] || w).join(' ➔ ');
          recipeTextEl.textContent = `[${layoutLabels[selectedLayoutMode]}] · [${themeObj.name}] · ${wNames} · [${fxObj.name}]`;
        }
      }

      activeStoryArchetypeKey = 'custom_ai';
      renderStoryArchetypesUI();
      renderDynamicCutCardsUI();
      renderVisualStoryboardTrack();

      isPlaying = true;
      if (audioEngineReady() && AudioEngine.enabled) {
        AudioEngine.lastSpokenCut = -1;
        AudioEngine.prefetchTtsBuffers();
      }
      if (window.__timelines && window.__timelines['main']) {
        window.__timelines['main'].seek(0.08);
      }
    }

    const STORY_KILLER_COPIES = [
      '🔥 선점 재고 3대 즉시출고',
      '💸 최대 -480만원 특별할인',
      '☕ 하루 커피 한잔 월 32만원',
      '⚖️ 취등록세 0원 무보증 승인',
      '🔍 36가지 신차 무결점 검수',
      '⭐️ 고객 출고후기 만족도 5.0',
      '🚚 계약 즉시 3일 이내 자택탁송',
      '🤝 10년 든든한 평생 사후관리'
    ];

    function selectTheme(themeId) {
      if (!DIRECTOR_THEMES[themeId]) return;
      campaign.themeId = themeId;
      const themeObj = DIRECTOR_THEMES[themeId];

      const mobileNameEl = document.getElementById('mobileActiveThemeName');
      if (mobileNameEl) {
        mobileNameEl.textContent = themeObj.name;
        mobileNameEl.style.color = themeObj.accent;
      }
      const deskNameEl = document.getElementById('desktopActiveThemeName');
      if (deskNameEl) {
        deskNameEl.textContent = themeObj.name;
        deskNameEl.style.color = themeObj.accent;
      }

      syncScenePlanUI();
      renderThemeSwatches();

      if (window.__timelines && window.__timelines['main']) {
        window.__timelines['main'].seek(window.__timelines['main'].currentTime);
      }
    }

    // 예전 '테마' 스와치 자리에 색상 고르기를 그림 (색상은 디자인 수에 세지 않음)
    function renderThemeSwatches() {
      renderColorPalettePicker();
    }

    function applyStoryArchetype(archKey) {
      const arch = STORY_ARCHETYPES[archKey];
      if (!arch) return;
      activeStoryArchetypeKey = archKey;

      const d = getSelectedDealer();
      campaign.layoutMode = arch.layoutMode || 'CLASSIC_SHOWROOM'; // 예전 그리기 코드용. 장르 엔진의 디자인은 바뀌지 않음
      // 업종 템플릿: {product} 자리에 지금 상품 이름, 혜택·가격은 지금 프리셋 그대로
      const fillProduct = (x) => String(x).replace(/\{product\}/g, campaign.vehicle || IND.product);
      campaign.hook = indWord(arch.industry ? fillProduct(arch.hook) : arch.hook);
      if (!arch.industry) {
        campaign.discountNum = arch.discountNum;
        campaign.discount = indWord(arch.discount);
      }
      campaign.scenePlan = JSON.parse(JSON.stringify(arch.scenePlan));
      campaign.cutCaptions = (arch.industry ? arch.cutCaptions.map(fillProduct) : [...arch.cutCaptions]).map(indWord);
      campaign.ttsLines = (arch.industry ? arch.ttsLines.map(fillProduct) : [...arch.ttsLines]).map(indWord);

      if (d.variation) {
        d.variation.hook = arch.hook;
      }

      const hookInput = document.getElementById('inputHook');
      if (hookInput) hookInput.value = campaign.hook;

      const vInput = document.getElementById('inputVehicle');
      if (vInput) vInput.value = campaign.vehicle;
      const numInput = document.getElementById('inputDiscountNum');
      if (numInput) numInput.value = campaign.discountNum;
      const dInput = document.getElementById('inputDiscount');
      if (dInput) dInput.value = campaign.discount;

      const badge = document.getElementById('activeArchetypeBadge');
      if (badge) {
        badge.textContent = `${arch.icon} ${arch.title}`;
        badge.style.borderColor = arch.accentColor;
        badge.style.color = arch.accentColor;
      }

      renderStoryArchetypesUI();
      renderDynamicCutCardsUI();
      renderVisualStoryboardTrack();
      if (typeof renderDesignStylePicker === 'function') renderDesignStylePicker();

      isPlaying = true;
      if (audioEngineReady() && AudioEngine.enabled) {
        AudioEngine.lastSpokenCut = -1;
        AudioEngine.prefetchTtsBuffers();
      }
      if (window.__timelines && window.__timelines['main']) {
        window.__timelines['main'].seek(0.08);
      }
    }

function renderStoryArchetypesUI() {
      const container = document.getElementById('storyArchetypeCardsContainer');
      if (!container) return;

      const favList = getFavoriteArchetypes();
      const pinnedKey = getPinnedArchetype();
      updateArchetypeCounts();

      const keys = Object.keys(STORY_ARCHETYPES).filter((k) => {
        if (!arArchetypeVisible(k)) return false;
        if (currentArchetypeCategory === 'all') return true;
        if (currentArchetypeCategory === 'favorite') return favList.includes(k);
        return STORY_ARCHETYPES[k].category === currentArchetypeCategory;
      });

      if (keys.length === 0 && currentArchetypeCategory === 'favorite') {
        container.innerHTML = `
          <div class="col-span-full py-10 text-center text-[#85858b] bg-[#141416] rounded-[10px] border border-[#27272a] p-6">
            <span class="text-[24px] block mb-1.5">⭐</span>
            <div class="text-[#ededed] font-semibold text-[13px] mb-1">아직 즐겨찾는 스타일이 없습니다</div>
            <p class="text-[11px] text-[#71717a] max-w-sm mx-auto">마음에 드는 스타일 카드 우측 상단의 별표(★)를 누르시면 여기에 모아서 언제든 원클릭으로 사용하실 수 있습니다.</p>
          </div>
        `;
        return;
      }

      if (keys.length === 0 && currentArchetypeCategory === 'custom') {
        container.innerHTML = `
          <div class="col-span-full py-10 text-center text-[#85858b] bg-[#141416] rounded-[10px] border border-[#27272a] p-6">
            <span class="text-[24px] block mb-1.5">✨</span>
            <div class="text-[#ededed] font-semibold text-[13px] mb-1">아직 저장된 AI 커스텀 스타일이 없습니다</div>
            <p class="text-[11px] text-[#71717a] max-w-md mx-auto mb-3">상단의 [🎲 AI 무한 씬 믹서]를 누른 뒤 [💾 이 AI 스타일 영구 저장]을 누르시거나, [⚡ 10종 일괄 생성] 버튼으로 즉시 나만의 전용 스타일 팩을 만드실 수 있습니다.</p>
            <button type="button" onclick="generateBatchCustomArchetypes(10)" class="btn-primary h-8 px-4 text-[12px] inline-flex items-center gap-1.5 cursor-pointer">
              <span>⚡</span> 지금 AI 고유 스타일 10종 생성하기
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = keys.map((k) => {
        const arch = STORY_ARCHETYPES[k];
        const isActive = k === activeStoryArchetypeKey;
        const isFav = favList.includes(k);
        const isPinned = pinnedKey === k;
        const isCustom = !!arch.isCustom;
        const catBadgeLabel = {
          special: '⚡특판',
          luxury: '🎬럭셔리',
          ev_tech: '🛸EV테크',
          sports: '🏎️스포츠',
          finance: '💳금융',
          trust: '🛡️신뢰',
          custom: '✨AI커스텀'
        }[arch.category] || '';

        return `
          <div onclick="applyStoryArchetype('${k}')" class="story-arc-card p-3 rounded-[10px] border cursor-pointer transition-all ${isActive ? 'active' : 'bg-[#18181a] border-[#27272a] hover:border-[#3f3f46]'}" style="--accent: ${arch.accentColor}">
            <div class="flex items-center justify-between gap-1 mb-1.5">
              <span class="text-[12px] font-bold text-[#ededed] flex items-center gap-1.5 truncate">
                <span>${arch.icon}</span>
                <span class="truncate">${arch.shortTitle}</span>
                ${isPinned ? '<span class="px-1 py-0.2 rounded text-[8px] bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/40 font-mono">📌고정</span>' : ''}
              </span>
              <div class="flex items-center gap-1 shrink-0">
                ${isCustom ? `
                  <button type="button" onclick="deleteUserCustomArchetype(event, '${k}')" class="w-6 h-6 flex items-center justify-center rounded hover:bg-rose-500/20 text-[#f43f5e] text-[12px] transition-colors" title="이 AI 커스텀 스타일 삭제">
                    🗑️
                  </button>
                ` : ''}
                <button type="button" onclick="toggleFavoriteArchetype(event, '${k}')" class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-[14px] ${isFav ? 'text-[#facc15]' : 'text-[#52525b] hover:text-[#facc15]'}" title="${isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>
            <p class="text-[11px] text-[#a1a1a6] leading-snug line-clamp-2 min-h-[30px]">${arch.tagline}</p>
            <div class="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[#85858b]">
              <span class="truncate pr-1">${(arch.cutCaptions && arch.cutCaptions[0] ? arch.cutCaptions[0].replace(/^[^\s]+\s*/, '') : arch.hook)}</span>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="togglePinnedArchetype(event, '${k}')" class="px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${isPinned ? 'bg-[#facc15] text-[#0f172a] font-bold' : 'text-[#71717a] hover:text-[#ededed] hover:bg-[#27272a]'}" title="AutoReels 시작 시 항상 이 스타일로 고정">
                  ${isPinned ? '📌 해제' : '📌 시작고정'}
                </button>
                <span class="font-bold text-[#ededed] ml-1">선택 →</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

        function renderVisualStoryboardTrack() {
      const trackContainer = document.getElementById('visualStoryboardTrack');
      if (!trackContainer) return;
      const totalCuts = getTargetCutCount();
      const cutLengths = getCutLengths();

      let html = '';
      for (let i = 0; i < totalCuts; i++) {
        const s = getCutStart(i).toFixed(1).replace(/\.0$/, '');
        const e = (getCutStart(i) + cutLengths[i]).toFixed(1).replace(/\.0$/, '');
        const wKey = campaign.scenePlan[i]?.widget || WIDGET_POOL[i % WIDGET_POOL.length];
        const wLabel = WIDGET_LABELS[wKey] || wKey;
        const caption = (campaign.cutCaptions[i] || `CUT ${i + 1}`).replace(/"/g, '&quot;');

        html += `
          <div onclick="seekToCutIndex(${i})" class="storyboard-track-card p-2 rounded-[8px] bg-[#17171a] border border-[#27272a] hover:border-[#38bdf8] transition-all text-left group">
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="font-mono font-bold text-[#38bdf8]">CUT ${i + 1}</span>
              <span class="text-[10px] font-mono text-[#85858b]">${s}~${e}s</span>
            </div>
            <div class="text-[10px] font-medium text-[#ededed] truncate group-hover:text-white" title="${caption}">
              ${caption}
            </div>
            <div class="mt-1 flex items-center justify-between text-[9px] text-[#71717a]">
              <span class="truncate">${wLabel}</span>
              <span class="text-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity">▶ 점프</span>
            </div>
          </div>
        `;
      }
      trackContainer.innerHTML = html;

      const badge = document.getElementById('storyboardTrackTotalBadge');
      if (badge) badge.textContent = `총 ${totalCuts}컷 · ${TOTAL_DURATION}초 구성`;
    }

    function seekToCutIndex(cutIdx) {
      const targetTime = getCutStart(cutIdx) + 0.05;
      seekToTime(targetTime);

      const inputEl = document.getElementById(`cutSub${cutIdx}`);
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
        inputEl.classList.add('ring-2', 'ring-[#38bdf8]');
        setTimeout(() => inputEl.classList.remove('ring-2', 'ring-[#38bdf8]'), 1200);
      }
    }

    function renderKillerCopyChips() {
      const container = document.getElementById('killerCopyChipsContainer');
      if (!container) return;
      container.innerHTML = STORY_KILLER_COPIES.map((copy) => `
        <button type="button" onclick="injectKillerCopy('${copy.replace(/'/g, "\\'")}')" class="killer-copy-chip px-2.5 py-1 rounded-[6px] bg-[#1a1a1e] text-[#a1a1a6] text-[11px] border border-[#27272a] hover:border-[#52525b] hover:text-white transition-colors" title="현재 컷에 이 카피를 즉시 반영합니다">
          ${copy}
        </button>
      `).join('');
    }

    function injectKillerCopy(text) {
      const curT = (window.__timelines && window.__timelines['main']) ? window.__timelines['main'].currentTime : 0;
      const cutIdx = getCutIndexAt(curT);
      const subInput = document.getElementById(`cutSub${cutIdx}`);
      if (subInput) {
        subInput.value = text;
        campaign.cutCaptions[cutIdx] = text;
        updateCustomCutCaptions();
        renderVisualStoryboardTrack();
      }
    }

    function scrollToMainMonitor() {
      const mon = document.getElementById('mainMonitorColumn');
      if (mon) {
        mon.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function syncMobileDockUI(t) {
      const dock = document.getElementById('mobileLiveDock');
      if (!dock) return;

      const totalCuts = getTargetCutCount();
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const cutIdx = t < mainDur ? getCutIndexAt(t) : totalCuts - 1;
      const wKey = campaign.scenePlan[cutIdx]?.widget || WIDGET_POOL[cutIdx % WIDGET_POOL.length];
      const wLabel = WIDGET_LABELS[wKey] || wKey;

      const cutBadge = document.getElementById('mobileDockCutBadge');
      if (cutBadge) {
        if (t >= mainDur) {
          cutBadge.textContent = '엔딩 · 카마스터 명함';
        } else {
          cutBadge.textContent = `${cutIdx + 1}컷 · ${wLabel}`;
        }
      }

      const timeBadge = document.getElementById('mobileDockTimeBadge');
      if (timeBadge) {
        timeBadge.textContent = `${t.toFixed(1)}s / ${TOTAL_DURATION}s`;
      }

      const playBtn = document.getElementById('mobileDockPlayBtn');
      if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸' : '▶'; // 상단 바는 아이콘만 (버튼 크기 통일)
      }

      const soundBtn = document.getElementById('mobileDockSoundBtn');
      if (soundBtn) {
        soundBtn.textContent = (AudioEngine && AudioEngine.enabled) ? '🔊' : '🔇';
        soundBtn.style.color = (AudioEngine && AudioEngine.enabled) ? '#4cc38a' : '#ededed';
      }
    }

    // 모바일 스크롤 시 라이브 도크 완벽 상단 락 (스크롤 다운 시 fixed 모드 전환)
    window.addEventListener('scroll', () => {
      const dock = document.getElementById('mobileLiveDock');
      if (!dock || window.innerWidth >= 1024) {
        if (dock) dock.classList.remove('dock-fixed-mode');
        return;
      }
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 120) {
        dock.classList.add('dock-fixed-mode');
      } else {
        dock.classList.remove('dock-fixed-mode');
      }
    }, { passive: true });
