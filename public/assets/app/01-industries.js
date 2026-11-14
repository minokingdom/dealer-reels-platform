// AutoReels — 01-industries.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // GSAP Easing 함수 & 결정론적 수학 헬퍼 (HyperFrames 표준)
    // ============================================================================
    const Easing = {
      clamp: (v, min = 0, max = 1) => Math.min(max, Math.max(min, v)),
      power4Out: (t) => 1 - Math.pow(1 - Easing.clamp(t), 4),
      power3InOut: (t) => {
        const p = Easing.clamp(t);
        return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      },
      backOut: (t) => {
        const p = Easing.clamp(t);
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
      },
      elasticOut: (t) => {
        const p = Easing.clamp(t);
        if (p === 0 || p === 1) return p;
        return Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
      }
    };

    // ==========================================================================
    // ★ 업종 설정 — 화면 문구·영상 디자인·상품 프리셋·대본 템플릿이 업종에 따라 바뀝니다.
    //   자동차(auto)는 기존 데이터를 그대로 씁니다.
    //   words: 화면과 영상의 자동차 낱말을 업종 낱말로 바꾸는 표
    //   {product}는 템플릿을 고를 때 지금 상품 이름으로 바뀝니다.
    // ==========================================================================
    const AR_INDUSTRIES = {
      auto: {
        key: 'auto', name: '자동차 영업', icon: '🚗', role: '카마스터', title: '수석 카마스터',
        product: '차종', deliver: '출고', cta: '견적', trial: '시승', place: '전시장',
        branchLabel: '소속 전시장 · 대리점명', branchPlaceholder: '현대·기아 공식전시장',
        promoLabel: '출고 고객 전담 서비스 문구', promoPlaceholder: '출고 고객 전원 썬팅 + 블랙박스 무상',
        promise: '끝까지 책임지고 출고해 드리겠습니다', vlogDone: '오늘도 출고 완료!', chatAsk: '견적 받아볼 수 있을까요?',
        hashtags: ['신차견적', '즉시출고', '카마스터', '장기렌트', '오토리스'],
        aiRole: '대한민국 자동차 영업 카마스터', caution: ''
      },
      restaurant: {
        key: 'restaurant', name: '음식점', icon: '🍲', role: '사장님', title: '매장 공식 안내',
        outroMode: 'store', storeNames: ['한옥 갈비 본점', '성수 화로구이', '정성 한상 식탁'],
        storeSubtitle: '매장 공식 안내', storeLocation: '서울 강남구 테헤란로 123 · 주차 가능',
        product: '메뉴', deliver: '방문', cta: '예약', trial: '시식', place: '매장',
        branchLabel: '매장 주소 · 오시는 길', branchPlaceholder: '서울 강남구 테헤란로 123 · 주차 가능',
        promoLabel: '방문 고객 혜택 문구', promoPlaceholder: '리뷰 작성 시 음료 1병 서비스',
        promise: '정성껏 준비해 기다리겠습니다', vlogDone: '오늘도 영업 마감!', chatAsk: '이번 주말 예약 되나요?',
        hashtags: ['맛집', '오늘뭐먹지', '맛집추천', '동네맛집', '단체예약'],
        aiRole: '동네 음식점 사장님', caution: ''
      },
      cafe: {
        key: 'cafe', name: '카페·디저트', icon: '☕', role: '사장님', title: '카페 공식 안내',
        outroMode: 'store', storeNames: ['모닝빈 커피 연남점', '아워스 로스터리', '메종 디저트 바'],
        storeSubtitle: '카페 공식 안내', storeLocation: '서울 마포구 연남로 45 · 10:00~22:00',
        product: '메뉴', deliver: '방문', cta: '쿠폰', trial: '시음', place: '카페',
        branchLabel: '카페 주소 · 영업시간', branchPlaceholder: '서울 마포구 연남로 45 · 10:00~22:00',
        promoLabel: '방문 고객 혜택 문구', promoPlaceholder: '스탬프 10개 모으면 음료 1잔 무료',
        promise: '오늘도 맛있게 내려 드릴게요', vlogDone: '오늘도 마감 완료!', chatAsk: '쿠폰 받을 수 있나요?',
        hashtags: ['카페추천', '디저트맛집', '신메뉴', '카페투어', '동네카페'],
        aiRole: '동네 카페 사장님', caution: ''
      },
      beauty: {
        key: 'beauty', name: '미용·네일·뷰티', icon: '💇', role: '원장님', title: '살롱 공식 안내',
        outroMode: 'store', storeNames: ['라온 헤어 강남점', '무드 네일 스튜디오', '아틀리에 뷰티 살롱'],
        storeSubtitle: '살롱 공식 안내', storeLocation: '서울 강남구 압구정로 42 · 우선 예약제',
        product: '시술', deliver: '시술', cta: '예약', trial: '상담', place: '샵',
        branchLabel: '샵 주소 · 예약 안내', branchPlaceholder: '서울 강남구 압구정로 42 · 우선 예약제',
        promoLabel: '첫 방문 혜택 문구', promoPlaceholder: '첫 방문 두피 클리닉 무료',
        promise: '만족하실 때까지 책임지겠습니다', vlogDone: '오늘도 시술 완료!', chatAsk: '이번 주 예약 가능한가요?',
        hashtags: ['헤어스타일', '네일아트', '뷰티샵', '예약가능', '스타일변신'],
        aiRole: '미용실·네일샵 원장님', caution: ''
      },
      realestate: {
        key: 'realestate', name: '부동산 중개', icon: '🏠', role: '공인중개사', title: '공인중개사사무소',
        outroMode: 'store', storeNames: ['행복 공인중개사사무소', '더퍼스트 부동산 중개', '센트럴 매물 센터'],
        storeSubtitle: '중개사무소 공식 안내', storeLocation: '서울 송파구 올림픽로 300 · 매물 상담',
        product: '매물', deliver: '입주', cta: '매물', trial: '방문', place: '중개사무소',
        branchLabel: '사무소 위치 · 상담 안내', branchPlaceholder: '서울 송파구 올림픽로 300 · 매물 상담',
        promoLabel: '고객 안내 문구', promoPlaceholder: '전세사기 예방 권리분석 무료 안내',
        promise: '안전한 계약까지 책임지겠습니다', vlogDone: '오늘도 계약 완료!', chatAsk: '이 매물 아직 있나요?',
        hashtags: ['부동산', '매물소개', '전세', '월세', '내집마련'],
        aiRole: '동네 공인중개사',
        caution: '부동산 광고는 중개사무소 명칭·소재지·연락처·등록번호·대표자 이름과 매물의 소재지·면적·가격 등을 표시해야 합니다. 허위·과장 매물 광고는 과태료 대상입니다.'
      },
      academy: {
        key: 'academy', name: '학원·교육', icon: '📚', role: '원장님', title: '학원 공식 안내',
        outroMode: 'store', storeNames: ['한빛 수학학원', '프라임 영어 아카데미', '에이스 입시 연구소'],
        storeSubtitle: '학원 공식 안내', storeLocation: '서울 양천구 목동동로 210 · 레벨테스트',
        product: '강좌', deliver: '등록', cta: '상담', trial: '체험수업', place: '학원',
        branchLabel: '학원 위치 · 상담 시간', branchPlaceholder: '서울 양천구 목동동로 210 · 레벨테스트',
        promoLabel: '신규 등록 혜택 문구', promoPlaceholder: '첫 달 교재비 지원',
        promise: '끝까지 함께 공부하겠습니다', vlogDone: '오늘도 수업 끝!', chatAsk: '체험수업 신청할 수 있나요?',
        hashtags: ['학원추천', '공부법', '수학학원', '영어학원', '체험수업'],
        aiRole: '동네 학원 원장님',
        caution: '학원 광고에는 교육청에 신고한 수강료를 정확히 써야 하고, 성적 향상을 보장하는 표현은 쓰지 않는 것이 안전합니다.'
      },
      clinic: {
        key: 'clinic', name: '병원·의원', icon: '🏥', role: '원장님', title: '진료 공식 안내',
        outroMode: 'store', storeNames: ['바른 정형외과의원', '연세 스마일 치과', '맑은 피부과의원'],
        storeSubtitle: '병원 공식 안내', storeLocation: '서울 서초구 강남대로 365 · 예약 진료',
        product: '진료', deliver: '진료', cta: '상담', trial: '상담', place: '병원',
        branchLabel: '병원 위치 · 진료 시간', branchPlaceholder: '서울 서초구 강남대로 365 · 예약 진료',
        promoLabel: '안내 문구', promoPlaceholder: '토요일 오후 진료',
        promise: '꼼꼼하게 진료하겠습니다', vlogDone: '오늘 진료도 마쳤습니다', chatAsk: '진료 예약하고 싶어요',
        hashtags: ['병원', '진료안내', '건강정보', '예약안내'],
        aiRole: '동네 의원 원장님 (의료광고 규정을 지키는 정보 안내 위주)',
        caution: '의료광고는 사전 심의 대상일 수 있고, 치료 효과 보장·다른 병원 비교·비급여 진료비 할인 광고는 금지됩니다. 정보 안내 위주로 쓰고 게시 전에 심의 필요 여부를 확인하세요.'
      },
      fitness: {
        key: 'fitness', name: '헬스·필라테스', icon: '💪', role: '트레이너', title: '센터 공식 안내',
        outroMode: 'store', storeNames: ['핏앤바디 필라테스', '코어랩 피트니스', '스튜디오 밸런스'],
        storeSubtitle: '센터 공식 안내', storeLocation: '서울 강남구 역삼로 180 · 무료 체험',
        product: '프로그램', deliver: '등록', cta: '상담', trial: '체험', place: '센터',
        branchLabel: '센터 위치 · 운영 시간', branchPlaceholder: '서울 강남구 역삼로 180 · 무료 체험',
        promoLabel: '신규 회원 혜택 문구', promoPlaceholder: '1회 무료 체험 + 인바디 측정',
        promise: '목표 달성까지 함께하겠습니다', vlogDone: '오늘도 운동 끝!', chatAsk: '무료 체험 신청할게요',
        hashtags: ['헬스장', '필라테스', 'PT', '다이어트', '운동하는일상'],
        aiRole: '헬스장·필라테스 센터 트레이너', caution: ''
      },
      shop: {
        key: 'shop', name: '쇼핑몰·소매', icon: '🛍️', role: '스토어', title: '스토어 공식 안내',
        outroMode: 'store', storeNames: ['데일리룩 스토어', '모던 리빙샵', '셀렉트 마켓'],
        storeSubtitle: '스토어 공식 안내', storeLocation: '서울 성동구 성수이로 88 · 당일 발송',
        product: '상품', deliver: '배송', cta: '구매', trial: '체험', place: '스토어',
        branchLabel: '매장 주소 · 배송 안내', branchPlaceholder: '서울 성동구 성수이로 88 · 당일 발송',
        promoLabel: '구매 혜택 문구', promoPlaceholder: '오늘 주문 시 무료배송',
        promise: '꼼꼼하게 포장해 보내드릴게요', vlogDone: '오늘 주문 출발!', chatAsk: '이 상품 재고 있나요?',
        hashtags: ['쇼핑', '신상', '데일리룩', '살림템', '오늘의딜'],
        aiRole: '온라인 쇼핑몰·소매점 대표', caution: ''
      },
      interior: {
        key: 'interior', name: '인테리어·시공', icon: '🛠️', role: '실장님', title: '쇼룸 공식 안내',
        outroMode: 'store', storeNames: ['모던 인테리어 디자인', '아르코 공간 시공', '스튜디오 홈 리모델링'],
        storeSubtitle: '쇼룸 공식 안내', storeLocation: '서울 강남구 논현로 512 · 무료 실측',
        product: '시공', deliver: '시공', cta: '견적', trial: '방문 상담', place: '쇼룸',
        branchLabel: '쇼룸 위치 · 상담 안내', branchPlaceholder: '서울 강남구 논현로 512 · 무료 실측',
        promoLabel: '고객 혜택 문구', promoPlaceholder: '현장 실측 무료 방문',
        promise: '끝까지 책임지고 시공하겠습니다', vlogDone: '오늘도 시공 완료!', chatAsk: '견적 받아볼 수 있을까요?',
        hashtags: ['인테리어', '집꾸미기', '리모델링', '시공후기', '욕실리모델링'],
        aiRole: '인테리어·리모델링 업체 실장님', caution: ''
      }
    };

    // 업종별 상품 프리셋 (자동차는 아래 presets를 그대로 씀)
    //  priceTag: 가격 강조 문구 (예: -30%) / priceLine: "최대 ~" 같은 한 줄 문구
    const AR_INDUSTRY_PRESETS = {
      restaurant: {
        set_lunch: { vehicle: '점심 한정 갈비탕 정식', hook: '점심 11시~2시만! 한정 정식', priceTag: '-20%', priceLine: '점심 정식 -20%', discountNum: 20, discount: '평일 점심 한정 · 포장 가능',
          bullets: ['✔ 평일 점심 11시~2시 한정', '✔ 반찬 리필 무료', '✔ 포장 주문 가능'], neonColor: '#f97316', bgGradient: ['#1a0f08', '#3b1d0a'] },
        group: { vehicle: '단체 회식 코스', hook: '연말 회식, 아직 장소 못 정하셨죠?', priceTag: '음료 서비스', priceLine: '10인 이상 음료 서비스', discountNum: 10, discount: '10인 이상 · 룸 예약 가능',
          bullets: ['✔ 최대 30명 룸 예약', '✔ 10인 이상 음료 서비스', '✔ 주차 가능'], neonColor: '#ef4444', bgGradient: ['#170909', '#3f0f0f'] },
        new_menu: { vehicle: '신메뉴 출시', hook: '드디어 나왔습니다, 신메뉴!', priceTag: '출시 기념 -15%', priceLine: '출시 기념 -15%', discountNum: 15, discount: '이번 달 출시 기념가',
          bullets: ['✔ 이번 달 출시 기념 할인', '✔ 재료 매일 아침 손질', '✔ 포장·배달 가능'], neonColor: '#facc15', bgGradient: ['#151204', '#3a3006'] }
      },
      cafe: {
        signature: { vehicle: '시그니처 크림라떼', hook: '이 라떼 마시러 일부러 와요', priceTag: '1+1', priceLine: '오후 2~5시 1+1', discountNum: 1, discount: '오후 2~5시 한정',
          bullets: ['✔ 매일 직접 로스팅', '✔ 오후 2~5시 1+1', '✔ 디카페인 변경 가능'], neonColor: '#d97706', bgGradient: ['#140d06', '#3a2410'] },
        dessert: { vehicle: '수제 딸기 케이크', hook: '오늘 구운 케이크, 오후면 품절', priceTag: '홀케이크 예약', priceLine: '홀케이크 사전 예약 가능', discountNum: 0, discount: '매일 소량만 굽습니다',
          bullets: ['✔ 매일 아침 직접 굽기', '✔ 홀케이크 사전 예약', '✔ 레터링 가능'], neonColor: '#f472b6', bgGradient: ['#160a10', '#3d1328'] },
        stamp: { vehicle: '스탬프 적립 이벤트', hook: '10잔 마시면 1잔 공짜!', priceTag: '10+1', priceLine: '스탬프 10개 = 음료 1잔', discountNum: 0, discount: '모든 음료 적립 가능',
          bullets: ['✔ 모든 음료 스탬프 적립', '✔ 10개 모으면 1잔 무료', '✔ 첫 방문 스탬프 2개'], neonColor: '#22c55e', bgGradient: ['#08140c', '#123620'] }
      },
      beauty: {
        perm: { vehicle: '볼륨 매직 펌', hook: '부스스한 머리, 한 번에 정리', priceTag: '첫 방문 -20%', priceLine: '첫 방문 고객 -20%', discountNum: 20, discount: '기장 추가 없음 · 클리닉 포함',
          bullets: ['✔ 두피 진단 후 맞춤 시술', '✔ 손상 케어 클리닉 포함', '✔ 첫 방문 -20%'], neonColor: '#ec4899', bgGradient: ['#160812', '#3b0f2c'] },
        nail: { vehicle: '이달의 아트 네일', hook: '이번 달 신상 디자인 나왔어요', priceTag: '이달의 아트', priceLine: '이달의 아트 특가', discountNum: 0, discount: '젤 연장 가능 · 2주 무료 AS',
          bullets: ['✔ 이달의 신상 디자인', '✔ 2주 무료 AS', '✔ 1인 단독 시술'], neonColor: '#a855f7', bgGradient: ['#100a18', '#2a1340'] },
        clinic: { vehicle: '두피 스케일링', hook: '머리 감아도 가렵다면?', priceTag: '체험가', priceLine: '두피 스케일링 체험가', discountNum: 0, discount: '현미경 두피 진단 포함',
          bullets: ['✔ 현미경 두피 진단', '✔ 스케일링 + 영양 앰플', '✔ 홈케어 방법 안내'], neonColor: '#14b8a6', bgGradient: ['#061412', '#0f332d'] }
      },
      realestate: {
        jeonse: { vehicle: '역세권 투룸 전세', hook: '지하철 3분, 신축 투룸 나왔어요', priceTag: '전세 2억 1천', priceLine: '전세 2억 1천 (협의 가능)', discountNum: 0, discount: '전용 39㎡ · 2층 · 즉시 입주',
          bullets: ['✔ 지하철역 도보 3분', '✔ 2023년 준공 신축', '✔ 권리분석 무료 안내'], neonColor: '#0ea5e9', bgGradient: ['#06101a', '#0c2a44'] },
        apart: { vehicle: '남향 30평대 아파트 매매', hook: '초등학교 바로 앞, 남향 로열층', priceTag: '매매 협의', priceLine: '실거래가 기준 상담', discountNum: 0, discount: '전용 84㎡ · 15층 · 남향',
          bullets: ['✔ 초등학교 도보 2분', '✔ 남향 로열층', '✔ 실거래가 기준 상담'], neonColor: '#22c55e', bgGradient: ['#07130b', '#123a1f'] },
        shop: { vehicle: '1층 코너 상가 임대', hook: '유동인구 많은 1층 코너 자리', priceTag: '보증금·월세 협의', priceLine: '보증금·월세 협의 가능', discountNum: 0, discount: '전용 33㎡ · 1층 코너',
          bullets: ['✔ 1층 코너 가시성 좋음', '✔ 업종 제한 적음', '✔ 권리금 협의'], neonColor: '#f59e0b', bgGradient: ['#151004', '#3a2a08'] }
      },
      academy: {
        math: { vehicle: '중등 수학 내신반', hook: '수학 점수, 개념부터 다시 잡자', priceTag: '체험수업', priceLine: '1:1 레벨테스트 + 체험수업', discountNum: 0, discount: '소수정예 6명 · 주 3회',
          bullets: ['✔ 반 정원 6명 소수정예', '✔ 1:1 레벨테스트', '✔ 매주 오답 클리닉'], neonColor: '#3b82f6', bgGradient: ['#060c1a', '#0f2148'] },
        english: { vehicle: '초등 영어 회화반', hook: '영어로 말하는 게 즐거워지는 수업', priceTag: '첫 달 교재비 지원', priceLine: '첫 달 교재비 지원', discountNum: 0, discount: '원어민 수업 주 2회',
          bullets: ['✔ 원어민 회화 주 2회', '✔ 매달 말하기 평가', '✔ 첫 달 교재비 지원'], neonColor: '#22c55e', bgGradient: ['#07130b', '#123a1f'] },
        coding: { vehicle: '초등 코딩 교실', hook: '게임만 하던 아이가 게임을 만들어요', priceTag: '무료 체험', priceLine: '무료 체험수업 1회', discountNum: 0, discount: '블록코딩 → 파이썬 단계별',
          bullets: ['✔ 블록코딩부터 파이썬까지', '✔ 학기말 작품 발표회', '✔ 무료 체험수업'], neonColor: '#a855f7', bgGradient: ['#100a18', '#2a1340'] }
      },
      clinic: {
        hours: { vehicle: '진료 시간 안내', hook: '토요일 오후에도 진료합니다', priceTag: '진료 안내', priceLine: '평일 야간 · 토요일 진료', discountNum: 0, discount: '평일 저녁 8시까지',
          bullets: ['✔ 평일 저녁 8시까지 진료', '✔ 토요일 오후 진료', '✔ 주차 가능'], neonColor: '#0ea5e9', bgGradient: ['#06101a', '#0c2a44'] },
        checkup: { vehicle: '건강검진 안내', hook: '올해 건강검진, 아직 안 받으셨나요?', priceTag: '검진 예약', priceLine: '국가건강검진 예약 접수', discountNum: 0, discount: '국가건강검진 지정기관',
          bullets: ['✔ 국가건강검진 지정기관', '✔ 당일 결과 상담', '✔ 사전 예약 시 대기 단축'], neonColor: '#22c55e', bgGradient: ['#07130b', '#123a1f'] },
        info: { vehicle: '허리 통증 바른 자세', hook: '앉아 있으면 허리가 아프다면?', priceTag: '건강 정보', priceLine: '바른 자세 3가지', discountNum: 0, discount: '진료 전 참고용 정보',
          bullets: ['✔ 모니터는 눈높이에', '✔ 50분마다 스트레칭', '✔ 통증이 계속되면 진료'], neonColor: '#6366f1', bgGradient: ['#0a0a1a', '#1c1c48'] }
      },
      fitness: {
        pt: { vehicle: '1:1 PT 체험', hook: '혼자 운동하다 포기했다면', priceTag: '1회 무료 체험', priceLine: '1:1 PT 1회 무료 체험', discountNum: 0, discount: '인바디 측정 + 맞춤 루틴',
          bullets: ['✔ 인바디 측정 무료', '✔ 체형에 맞춘 루틴', '✔ 식단 가이드 제공'], neonColor: '#ef4444', bgGradient: ['#170909', '#3f0f0f'] },
        pilates: { vehicle: '기구 필라테스 그룹반', hook: '거북목·굽은 어깨, 자세부터', priceTag: '체험 수업', priceLine: '그룹 체험수업 1회', discountNum: 0, discount: '정원 4명 · 기구 필라테스',
          bullets: ['✔ 정원 4명 소그룹', '✔ 자세 분석 후 맞춤 운동', '✔ 체험수업 1회'], neonColor: '#14b8a6', bgGradient: ['#061412', '#0f332d'] },
        event: { vehicle: '새해 등록 이벤트', hook: '올해는 진짜 운동 시작합니다', priceTag: '등록 혜택', priceLine: '3개월 등록 시 운동복 증정', discountNum: 0, discount: '3개월 이상 등록 고객',
          bullets: ['✔ 운동복·수건 무료', '✔ 개인 사물함 제공', '✔ 주 1회 자세 점검'], neonColor: '#f59e0b', bgGradient: ['#151004', '#3a2a08'] }
      },
      shop: {
        best: { vehicle: '베스트셀러 니트', hook: '재입고 알림 신청 1위 니트', priceTag: '-30%', priceLine: '오늘만 -30%', discountNum: 30, discount: '전 색상 · 무료배송',
          bullets: ['✔ 전 색상 재입고', '✔ 오늘 주문 내일 도착', '✔ 무료 교환'], neonColor: '#ec4899', bgGradient: ['#160812', '#3b0f2c'] },
        living: { vehicle: '주방 정리 수납 세트', hook: '좁은 주방이 두 배로 넓어져요', priceTag: '1+1', priceLine: '세트 구매 시 1+1', discountNum: 0, discount: '오늘 주문 시 무료배송',
          bullets: ['✔ 공간 맞춤 사이즈', '✔ 세트 구매 1+1', '✔ 무료배송'], neonColor: '#22c55e', bgGradient: ['#07130b', '#123a1f'] },
        food: { vehicle: '산지직송 제철 과일', hook: '오늘 딴 과일, 내일 문 앞에', priceTag: '산지 직송', priceLine: '산지직송 첫 구매 -10%', discountNum: 10, discount: '당일 수확 · 익일 도착',
          bullets: ['✔ 당일 수확 · 다음 날 도착', '✔ 상하면 무료 재배송', '✔ 첫 구매 -10%'], neonColor: '#f97316', bgGradient: ['#1a0f08', '#3b1d0a'] }
      },
      interior: {
        bath: { vehicle: '욕실 리모델링', hook: '오래된 욕실, 3일이면 새것처럼', priceTag: '실측 무료', priceLine: '현장 실측 · 견적 무료', discountNum: 0, discount: '타일 · 도기 · 수전 교체',
          bullets: ['✔ 3일 완성 공정', '✔ 현장 실측 무료', '✔ 시공 후 1년 AS'], neonColor: '#0ea5e9', bgGradient: ['#06101a', '#0c2a44'] },
        kitchen: { vehicle: '주방 싱크대 교체', hook: '싱크대만 바꿔도 집이 달라져요', priceTag: '무료 3D 도면', priceLine: '무료 3D 도면 상담', discountNum: 0, discount: '상판 · 도어 · 하드웨어 교체',
          bullets: ['✔ 무료 3D 도면', '✔ 하루 철거·설치', '✔ 시공 후 1년 AS'], neonColor: '#f59e0b', bgGradient: ['#151004', '#3a2a08'] },
        full: { vehicle: '30평대 아파트 올수리', hook: '이사 전 올수리, 한 번에 맡기세요', priceTag: '견적 무료', priceLine: '공정표 포함 무료 견적', discountNum: 0, discount: '철거부터 입주청소까지',
          bullets: ['✔ 공정표 미리 공유', '✔ 현장 사진 매일 보고', '✔ 입주청소 포함'], neonColor: '#a855f7', bgGradient: ['#100a18', '#2a1340'] }
      }
    };

    // 업종별 대본 템플릿 6종씩 (자막 4컷 + 성우 4문장). 마지막 "댓글에 ~" 안내는 명함 화면에서 따로 나옴
    const AR_INDUSTRY_TEMPLATES = {
      restaurant: [
        ['🔥', '오늘의 추천', '점심 메뉴 고민 끝', '오늘 점심은 여기로 정했습니다', ['오늘 점심 메뉴 고민 끝!', '{product}', '매일 아침 직접 손질한 재료', '점심시간 줄 서기 전에 오세요'], ['오늘 점심 메뉴 고민 끝내 드릴게요.', '저희 집 추천은 {product}입니다.', '재료는 매일 아침 직접 손질해요.', '점심시간 줄 서기 전에 오세요.']],
        ['🎉', '단체 예약', '연말 회식 장소', '회식 장소 아직 못 정하셨죠?', ['연말 회식, 장소 정하셨나요?', '최대 30명 룸 예약 가능', '단체 메뉴 미리 맞춰 드려요', '날짜 정해지면 바로 연락 주세요'], ['연말 회식 장소 아직 못 정하셨나요?', '저희는 최대 서른 명까지 룸 예약이 됩니다.', '단체 메뉴도 미리 맞춰 드려요.', '날짜 정해지면 바로 연락 주세요.']],
        ['👨‍🍳', '주방 브이로그', '아침 준비 과정', '새벽부터 준비하는 이유', ['새벽 6시, 오늘 장사 준비', '육수는 12시간 끓입니다', '반찬도 매일 새로 만들어요', '정성 그대로 내어 드릴게요'], ['새벽 여섯 시, 오늘 장사를 준비합니다.', '육수는 열두 시간 동안 끓여요.', '반찬도 매일 새로 만듭니다.', '그 정성 그대로 내어 드릴게요.']],
        ['🆕', '신메뉴', '신메뉴 출시', '드디어 나왔습니다', ['드디어 신메뉴 출시!', '{product}', '한 달 동안 연구한 맛', '이번 달 출시 기념 혜택까지'], ['드디어 신메뉴가 나왔습니다.', '{product}, 한 달 동안 연구했어요.', '처음 드시는 분들 반응이 정말 좋아요.', '이번 달은 출시 기념 혜택도 있습니다.']],
        ['⭐', '단골 이야기', '20년 단골의 메뉴', '단골손님이 꼭 시키는 메뉴', ['단골손님이 꼭 시키는 메뉴', '{product}', '처음 오셔도 실패 없는 선택', '오늘 저녁 한 그릇 어떠세요'], ['단골손님들이 꼭 시키는 메뉴가 있어요.', '바로 {product}입니다.', '처음 오셔도 실패 없는 선택이에요.', '오늘 저녁 한 그릇 어떠세요?']],
        ['🛵', '포장·배달', '포장 할인 안내', '집에서도 같은 맛 그대로', ['집에서도 매장 맛 그대로', '포장 주문 가능합니다', '포장 용기도 꼼꼼하게', '미리 주문하면 바로 준비해요'], ['집에서도 매장 맛 그대로 드실 수 있어요.', '포장 주문 가능합니다.', '포장 용기도 꼼꼼하게 챙겨 드려요.', '미리 주문 주시면 바로 준비해 둘게요.']]
      ],
      cafe: [
        ['☕', '시그니처', '시그니처 메뉴', '이거 마시러 일부러 와요', ['이거 마시러 일부러 와요', '{product}', '매일 직접 로스팅한 원두', '오후에 들러 주세요'], ['이거 마시러 일부러 오시는 분들이 많아요.', '저희 대표 메뉴는 {product}예요.', '원두는 매일 직접 로스팅해요.', '오후에 한 잔 하러 들러 주세요.']],
        ['🍰', '오늘의 디저트', '갓 구운 디저트', '오후면 품절되는 디저트', ['오늘 아침 구운 디저트', '{product}', '소량만 만들어 금방 품절', '예약하면 따로 챙겨 둘게요'], ['오늘 아침에 구운 디저트예요.', '{product}, 소량만 만들어요.', '오후면 금방 품절됩니다.', '예약하시면 따로 챙겨 둘게요.']],
        ['🌿', '카페 브이로그', '오픈 준비 브이로그', '문 열기 전 한 시간', ['문 열기 전 한 시간', '원두 볶고 우유 거품 테스트', '창가 자리 햇살 맛집', '오늘도 문 열었습니다'], ['문 열기 전 한 시간의 기록이에요.', '원두를 볶고 우유 거품도 테스트합니다.', '창가 자리는 햇살이 정말 좋아요.', '오늘도 문 열었습니다.']],
        ['🎁', '적립 이벤트', '스탬프 이벤트', '10잔이면 1잔 무료', ['스탬프 이벤트 시작!', '모든 음료 적립 가능', '10개 모으면 1잔 무료', '첫 방문은 스탬프 2개'], ['스탬프 이벤트를 시작했어요.', '모든 음료가 적립됩니다.', '열 개 모으시면 한 잔 무료예요.', '첫 방문 고객은 스탬프 두 개 드려요.']],
        ['🍂', '시즌 메뉴', '계절 한정', '이 계절에만 마실 수 있어요', ['이 계절에만 나오는 메뉴', '{product}', '제철 재료로 직접 만든 시럽', '시즌 끝나기 전에 꼭 드셔 보세요'], ['이 계절에만 나오는 메뉴가 있어요.', '{product}입니다.', '제철 재료로 시럽을 직접 만들어요.', '시즌 끝나기 전에 꼭 드셔 보세요.']],
        ['💻', '작업하기 좋은 카페', '카공 추천', '콘센트 걱정 없는 카페', ['카공하기 좋은 카페 찾으세요?', '전 좌석 콘센트', '조용한 2층 작업 공간', '오래 앉아 계셔도 괜찮아요'], ['공부나 작업하기 좋은 카페 찾으세요?', '저희는 전 좌석에 콘센트가 있어요.', '2층은 조용한 작업 공간입니다.', '오래 계셔도 괜찮으니 편하게 오세요.']]
      ],
      beauty: [
        ['✨', '비포 애프터', '시술 전후', '같은 사람 맞아요', ['같은 사람 맞습니다', '{product}', '두피 상태부터 확인하고 시술', '변신하고 싶다면 예약하세요'], ['같은 분 맞습니다, 놀라셨죠?', '이번 시술은 {product}입니다.', '두피 상태부터 확인하고 시술해요.', '변신하고 싶으시면 예약해 주세요.']],
        ['💅', '이달의 디자인', '신상 디자인', '이번 달 신상 나왔어요', ['이달의 신상 디자인', '{product}', '1인 단독 공간에서 시술', '2주 안에 문제 생기면 무료 수리'], ['이번 달 신상 디자인이 나왔어요.', '{product}, 반응이 정말 좋아요.', '1인 단독 공간에서 편하게 받으세요.', '2주 안에 문제 생기면 무료로 고쳐 드려요.']],
        ['📅', '예약 안내', '이번 주 예약', '이번 주 빈자리 알려드려요', ['이번 주 예약 빈자리', '평일 오후 몇 자리 남았어요', '첫 방문 상담은 무료', '원하는 시간 댓글로 알려주세요'], ['이번 주 예약 빈자리 알려드려요.', '평일 오후에 몇 자리 남아 있어요.', '첫 방문 상담은 무료입니다.', '원하시는 시간 알려 주세요.']],
        ['🧴', '홈케어 팁', '관리 꿀팁', '시술 후 이렇게 관리하세요', ['시술 후 관리법 3가지', '첫날은 머리 감지 않기', '드라이는 미지근한 바람', '궁금한 점은 언제든 물어보세요'], ['시술 후 관리법 세 가지 알려드릴게요.', '첫날은 머리를 감지 않는 게 좋아요.', '드라이는 미지근한 바람으로 해 주세요.', '궁금한 점은 언제든 물어보세요.']],
        ['🎀', '원장님 브이로그', '샵 하루', '원장님의 하루', ['원장님의 하루 시작', '오전엔 도구 소독부터', '오후엔 쉴 틈 없이 시술', '오늘도 예쁘게 보내 드렸어요'], ['원장님의 하루를 보여 드릴게요.', '오전에는 도구 소독부터 합니다.', '오후에는 쉴 틈 없이 시술해요.', '오늘도 예쁘게 보내 드렸습니다.']],
        ['🎁', '첫 방문 혜택', '첫 방문 이벤트', '처음 오시는 분께만', ['처음 오시는 분께만 드려요', '{product}', '1:1 상담 후 맞춤 시술', '부담 없이 상담부터 받아 보세요'], ['처음 오시는 분께만 드리는 혜택이에요.', '{product}부터 시작해 보세요.', '1:1 상담 후 맞춤으로 시술합니다.', '부담 없이 상담부터 받아 보세요.']]
      ],
      realestate: [
        ['🏠', '매물 소개', '오늘의 매물', '오늘 나온 따끈한 매물', ['오늘 나온 매물 소개', '{product}', '채광·소음·수압까지 직접 확인', '방문 일정 바로 잡아 드려요'], ['오늘 나온 매물 소개해 드릴게요.', '{product}입니다.', '채광, 소음, 수압까지 직접 확인했어요.', '방문 일정 바로 잡아 드릴게요.']],
        ['🛡️', '전세 안전', '전세사기 예방', '계약 전 꼭 확인하세요', ['전세 계약 전 꼭 확인할 3가지', '등기부등본 근저당 확인', '집주인 세금 체납 여부', '권리분석은 무료로 안내해요'], ['전세 계약 전에 꼭 확인할 세 가지예요.', '먼저 등기부등본의 근저당을 보세요.', '집주인 세금 체납 여부도 확인해야 해요.', '권리분석은 무료로 안내해 드립니다.']],
        ['🚶', '동네 브이로그', '동네 산책', '이 동네가 살기 좋은 이유', ['이 동네가 살기 좋은 이유', '지하철역까지 걸어서 5분', '공원과 학교가 가까워요', '이 동네 매물 문의 주세요'], ['이 동네가 살기 좋은 이유 보여 드릴게요.', '지하철역까지 걸어서 오 분이에요.', '공원과 학교도 가까워요.', '이 동네 매물이 궁금하면 문의 주세요.']],
        ['🔑', '신혼집', '신혼부부 추천', '신혼집 찾고 계신가요?', ['신혼집 찾고 계신가요?', '{product}', '대출 가능 여부도 함께 상담', '예산 알려주시면 맞춰 찾아드려요'], ['신혼집 찾고 계신가요?', '{product}, 신혼부부께 추천해요.', '대출 가능 여부도 함께 상담해 드려요.', '예산 알려 주시면 맞춰서 찾아 드릴게요.']],
        ['🏪', '상가 임대', '창업 자리', '창업 자리 찾는 사장님께', ['창업 자리 찾는 사장님께', '{product}', '유동인구와 주변 업종 분석', '현장 같이 보러 가요'], ['창업 자리 찾는 사장님께 소개해요.', '{product}입니다.', '유동인구와 주변 업종도 분석해 드려요.', '현장 같이 보러 가요.']],
        ['📋', '계약 브이로그', '계약 날 기록', '안전한 계약의 하루', ['오늘은 계약하는 날', '특약 사항 한 줄씩 확인', '잔금 날까지 함께합니다', '오늘도 안전하게 계약 완료'], ['오늘은 계약하는 날이에요.', '특약 사항을 한 줄씩 함께 확인합니다.', '잔금 날까지 끝까지 함께해요.', '오늘도 안전하게 계약을 마쳤습니다.']]
      ],
      academy: [
        ['📈', '공부법', '공부법 팁', '점수 오르는 공부 순서', ['점수 오르는 공부 순서', '개념 먼저, 문제는 그다음', '틀린 문제는 다음 날 다시', '레벨테스트로 시작해 보세요'], ['점수가 오르는 공부 순서가 있어요.', '개념을 먼저 잡고 문제는 그다음이에요.', '틀린 문제는 다음 날 꼭 다시 풀어요.', '레벨테스트로 시작해 보세요.']],
        ['🏫', '반 소개', '수업 소개', '이렇게 수업합니다', ['이렇게 수업합니다', '{product}', '반 정원은 소수정예', '체험수업 먼저 들어 보세요'], ['저희는 이렇게 수업합니다.', '{product}를 운영하고 있어요.', '반 정원은 소수정예로 유지해요.', '체험수업 먼저 들어 보세요.']],
        ['🎥', '원장 브이로그', '학원의 하루', '수업 끝나고 남는 이유', ['수업 끝나고도 남는 이유', '아이마다 오답 노트 확인', '부모님께 매주 학습 리포트', '함께 끝까지 갑니다'], ['수업이 끝나도 남아 있는 이유가 있어요.', '아이마다 오답 노트를 확인합니다.', '부모님께는 매주 학습 리포트를 보내요.', '끝까지 함께 갑니다.']],
        ['📝', '시험 대비', '내신 대비', '시험 4주 전, 지금 시작', ['시험 4주 전, 지금이 시작', '학교별 기출 분석', '주말 특강으로 마무리', '상담 신청 받고 있어요'], ['시험 사 주 전, 지금이 시작할 때예요.', '학교별 기출을 분석해서 준비합니다.', '주말 특강으로 마무리해요.', '상담 신청 받고 있습니다.']],
        ['🙋', '자주 묻는 질문', '학부모 질문', '상담 때 가장 많이 받는 질문', ['상담 때 가장 많이 받는 질문', 'Q. 중간에 들어가도 되나요?', 'A. 레벨에 맞는 반으로 배정해요', '궁금한 점 남겨 주세요'], ['상담 때 가장 많이 받는 질문이에요.', '중간에 들어가도 되냐고 많이 물어보세요.', '레벨테스트 후 맞는 반으로 배정해 드려요.', '궁금한 점 남겨 주세요.']],
        ['🎁', '신규 등록', '신규 등록 안내', '새 학기 등록 안내', ['새 학기 신규 등록 안내', '{product}', '레벨테스트 후 반 배정', '체험수업 신청 받고 있어요'], ['새 학기 신규 등록 안내드려요.', '{product}, 자리가 많지 않아요.', '레벨테스트 후 반을 배정합니다.', '체험수업 신청 받고 있어요.']]
      ],
      clinic: [
        ['🕘', '진료 안내', '진료 시간', '이 시간에도 진료합니다', ['진료 시간 안내', '평일 저녁 8시까지', '토요일 오후 진료', '예약하면 대기 시간이 줄어요'], ['진료 시간 안내드립니다.', '평일은 저녁 여덟 시까지 진료해요.', '토요일 오후에도 진료합니다.', '예약하시면 대기 시간이 줄어요.']],
        ['💡', '건강 정보', '생활 건강 팁', '알아두면 좋은 건강 정보', ['알아두면 좋은 건강 정보', '{product}', '생활 습관부터 바꿔 보세요', '증상이 계속되면 진료받으세요'], ['알아두면 좋은 건강 정보예요.', '오늘 주제는 {product}입니다.', '생활 습관부터 바꿔 보세요.', '증상이 계속되면 꼭 진료받으세요.']],
        ['🧘', '스트레칭', '따라 하는 스트레칭', '30초 스트레칭', ['하루 30초 스트레칭', '목을 천천히 좌우로', '어깨는 뒤로 크게 돌리기', '아프면 무리하지 마세요'], ['하루 삼십 초 스트레칭 따라 해 보세요.', '목을 천천히 좌우로 기울여요.', '어깨는 뒤로 크게 돌립니다.', '아프면 절대 무리하지 마세요.']],
        ['🏥', '병원 소개', '처음 오시는 분께', '처음 오시면 이렇게 진행돼요', ['처음 오시면 이렇게 진행돼요', '접수 후 문진표 작성', '진료 후 생활 관리 안내', '주차는 건물 지하에'], ['처음 오시면 이렇게 진행돼요.', '접수하시고 문진표를 작성합니다.', '진료 후 생활 관리 방법도 안내해요.', '주차는 건물 지하에 하시면 됩니다.']],
        ['📋', '검진 안내', '건강검진', '올해 검진 받으셨나요?', ['올해 건강검진 받으셨나요?', '국가건강검진 지정기관', '사전 예약하면 대기 단축', '검진 결과 상담까지'], ['올해 건강검진 받으셨나요?', '저희는 국가건강검진 지정기관입니다.', '사전 예약하시면 대기 시간이 줄어요.', '검진 결과 상담까지 해 드립니다.']],
        ['🙋', '자주 묻는 질문', '진료 FAQ', '많이 물어보시는 질문', ['많이 물어보시는 질문', 'Q. 예약 없이 가도 되나요?', 'A. 가능해요, 예약하면 더 빨라요', '궁금한 점은 전화로 문의하세요'], ['많이 물어보시는 질문이에요.', '예약 없이 와도 되는지 궁금해하세요.', '가능하지만, 예약하시면 더 빨라요.', '궁금한 점은 편하게 문의하세요.']]
      ],
      fitness: [
        ['💪', '체험 안내', '무료 체험', '혼자 운동하다 포기했다면', ['혼자 운동하다 포기했다면', '{product}', '체형 분석 후 맞춤 루틴', '체험부터 가볍게 시작해요'], ['혼자 운동하다 포기하셨나요?', '{product}부터 시작해 보세요.', '체형을 분석해서 맞춤 루틴을 짜 드려요.', '체험부터 가볍게 시작해요.']],
        ['🏋️', '운동 팁', '오늘의 운동 팁', '스쿼트 이것만 지키세요', ['스쿼트, 이것만 지키세요', '무릎은 발끝 방향으로', '허리는 곧게 세우기', '자세가 헷갈리면 봐 드릴게요'], ['스쿼트할 때 이것만 지키세요.', '무릎은 발끝 방향으로 굽혀요.', '허리는 곧게 세웁니다.', '자세가 헷갈리면 직접 봐 드릴게요.']],
        ['📹', '센터 브이로그', '트레이너의 하루', '새벽 6시 센터 오픈', ['새벽 6시, 센터 오픈', '기구 점검부터 시작', '회원님 운동 기록 확인', '오늘도 함께 땀 흘렸어요'], ['새벽 여섯 시, 센터 문을 엽니다.', '기구 점검부터 시작해요.', '회원님들 운동 기록도 확인합니다.', '오늘도 함께 땀 흘렸어요.']],
        ['🥗', '식단 팁', '다이어트 식단', '굶지 말고 이렇게 드세요', ['굶지 말고 이렇게 드세요', '단백질은 매 끼니', '저녁은 잠들기 3시간 전', '식단 가이드도 드려요'], ['굶지 말고 이렇게 드세요.', '단백질은 매 끼니 챙겨 드세요.', '저녁은 잠들기 세 시간 전에 마쳐요.', '식단 가이드도 따로 드립니다.']],
        ['🎯', '프로그램 소개', '수업 소개', '이런 분께 추천해요', ['이런 분께 추천해요', '{product}', '소그룹이라 꼼꼼하게', '체험수업 먼저 들어 보세요'], ['이런 분들께 추천하는 수업이에요.', '{product}를 운영하고 있어요.', '소그룹이라 한 분씩 꼼꼼하게 봐요.', '체험수업 먼저 들어 보세요.']],
        ['🎁', '등록 혜택', '이달의 혜택', '이번 달 등록하면', ['이번 달 등록 혜택', '{product}', '운동복과 수건 무료', '자리 있을 때 상담 받으세요'], ['이번 달 등록 혜택 알려드려요.', '{product}입니다.', '운동복과 수건은 무료로 드려요.', '자리 있을 때 상담 받으세요.']]
      ],
      shop: [
        ['🛍️', '오늘의 딜', '오늘만 특가', '오늘 하루만 이 가격', ['오늘 하루만 이 가격', '{product}', '재고 소진 시 조기 마감', '지금 바로 확인하세요'], ['오늘 하루만 이 가격이에요.', '{product}입니다.', '재고가 떨어지면 일찍 마감돼요.', '지금 바로 확인하세요.']],
        ['📦', '포장 브이로그', '포장하는 하루', '주문 들어오면 이렇게 포장해요', ['주문 들어오면 이렇게 포장해요', '상품 검수 먼저', '뽁뽁이로 꼼꼼하게', '오늘 주문 오늘 출발'], ['주문이 들어오면 이렇게 포장해요.', '상품 검수부터 먼저 합니다.', '뽁뽁이로 꼼꼼하게 감싸요.', '오늘 주문하시면 오늘 출발해요.']],
        ['👗', '코디 제안', '스타일링', '하나로 세 가지 코디', ['하나로 세 가지 코디', '{product}', '출근룩·주말룩·데이트룩', '사이즈 고민되면 물어보세요'], ['하나로 세 가지 코디가 가능해요.', '{product}입니다.', '출근룩, 주말룩, 데이트룩까지요.', '사이즈 고민되면 편하게 물어보세요.']],
        ['🔄', '재입고', '재입고 소식', '품절됐던 그 상품 돌아왔어요', ['품절됐던 그 상품 재입고', '{product}', '이번에도 금방 빠질 거예요', '알림 받고 싶다면 댓글로'], ['품절됐던 그 상품이 다시 들어왔어요.', '{product}입니다.', '이번에도 금방 빠질 거예요.', '놓치지 말고 확인해 주세요.']],
        ['⭐', '후기 소개', '실제 사용 후기', '써 본 사람만 아는 차이', ['써 본 사람만 아는 차이', '{product}', '꼼꼼한 마감과 소재', '직접 받아 보시면 알아요'], ['써 본 사람만 아는 차이가 있어요.', '{product}입니다.', '마감과 소재를 꼼꼼하게 골랐어요.', '직접 받아 보시면 아실 거예요.']],
        ['🚚', '배송 안내', '빠른 배송', '오늘 주문하면 내일 도착', ['오늘 주문하면 내일 도착', '오후 2시 전 주문 당일 출발', '무료 교환·반품', '궁금한 점은 댓글로'], ['오늘 주문하시면 내일 도착해요.', '오후 두 시 전 주문은 당일 출발합니다.', '교환과 반품도 무료예요.', '궁금한 점은 편하게 물어보세요.']]
      ],
      interior: [
        ['🛁', '비포 애프터', '시공 전후', '같은 집 맞습니다', ['같은 집 맞습니다', '{product}', '철거부터 마감까지 직접 관리', '우리 집도 바꾸고 싶다면'], ['같은 집 맞습니다.', '이번 현장은 {product}이었어요.', '철거부터 마감까지 직접 관리했습니다.', '우리 집도 바꾸고 싶으시면 문의 주세요.']],
        ['🔨', '현장 브이로그', '시공 현장', '오늘의 현장 기록', ['오늘의 현장 기록', '방수 작업은 꼼꼼하게 두 번', '타일 줄눈까지 수평 확인', '오늘도 시공 완료'], ['오늘의 현장 기록입니다.', '방수 작업은 꼼꼼하게 두 번 합니다.', '타일 줄눈까지 수평을 확인해요.', '오늘도 시공을 마쳤습니다.']],
        ['📐', '견적 안내', '견적 받는 법', '견적 받기 전 꼭 확인하세요', ['견적 받기 전 꼭 확인하세요', '자재 브랜드와 등급', '공정 기간과 AS 기간', '현장 실측은 무료예요'], ['견적 받기 전에 꼭 확인하세요.', '자재 브랜드와 등급을 보셔야 해요.', '공정 기간과 AS 기간도 중요합니다.', '현장 실측은 무료로 해 드려요.']],
        ['💡', '인테리어 팁', '작은 집 넓어 보이게', '좁은 집 넓어 보이는 방법', ['좁은 집 넓어 보이는 방법', '벽과 바닥 색은 밝게', '조명은 간접등으로', '상담 받아 보세요'], ['좁은 집이 넓어 보이는 방법이에요.', '벽과 바닥 색은 밝게 맞춰요.', '조명은 간접등이 좋습니다.', '우리 집에 맞는 방법 상담 받아 보세요.']],
        ['🏡', '시공 소개', '대표 시공', '이렇게 시공합니다', ['이렇게 시공합니다', '{product}', '공정표 미리 공유', '시공 후 1년 AS'], ['저희는 이렇게 시공합니다.', '{product}를 많이 맡고 있어요.', '공정표는 미리 공유해 드려요.', '시공 후 일 년 동안 AS 해 드립니다.']],
        ['🙋', '자주 묻는 질문', '시공 FAQ', '상담 때 많이 받는 질문', ['상담 때 많이 받는 질문', 'Q. 살면서 공사 가능한가요?', 'A. 부분 시공은 가능해요', '궁금한 점 남겨 주세요'], ['상담 때 많이 받는 질문이에요.', '살면서 공사가 되냐고 많이 물어보세요.', '부분 시공은 충분히 가능합니다.', '궁금한 점 남겨 주세요.']]
      ]
    };

    // 업종별 템플릿을 대본 템플릿 목록(STORY_ARCHETYPES)에 넣을 형태로 변환
    function arIndustryArchetypes() {
      const out = {};
      Object.keys(AR_INDUSTRY_TEMPLATES).forEach((ind) => {
        AR_INDUSTRY_TEMPLATES[ind].forEach(([icon, title, short, hook, caps, tts], i) => {
          const id = `ind_${ind}_${i + 1}`;
          out[id] = {
            id, industry: ind, category: 'industry', layoutMode: 'CLASSIC_SHOWROOM',
            title: `${icon} ${title}`, shortTitle: short, tagline: hook, icon, themeId: 'royal', accentColor: '#38bdf8',
            hook, discountNum: 0, discount: '',
            scenePlan: [{ cut: 1, widget: 'LOWER_THIRD', pos: 'bottom', cam: 0 }, { cut: 2, widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1 },
                        { cut: 3, widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2 }, { cut: 4, widget: 'COMMENT_DM_MAGNET', pos: 'bottom', cam: 3 }],
            cutCaptions: caps, ttsLines: tts
          };
        });
      });
      return out;
    }

    // 지금 업종
    let IND = AR_INDUSTRIES.auto;
    try {
      const saved = localStorage.getItem('autoreels_industry');
      if (saved && AR_INDUSTRIES[saved]) IND = AR_INDUSTRIES[saved];
    } catch (e) {}

    // 자동차 낱말 → 지금 업종 낱말
    function indWord(s) {
      if (s == null || IND.key === 'auto') return s;
      return String(s)
        .replace(/수석 카마스터/g, IND.title)
        .replace(/카마스터/g, IND.role)
        .replace(/출고/g, IND.deliver)
        .replace(/영수증 견적/g, IND.key === 'restaurant' || IND.key === 'cafe' ? '매장 정보' : `영수증 ${IND.cta}`)
        .replace(/견적서/g, IND.key === 'restaurant' || IND.key === 'cafe' ? '메뉴 정보' : `${IND.cta} 안내`)
        .replace(/견적/g, IND.cta)
        .replace(/차종/g, IND.product)
        .replace(/시승/g, IND.trial)
        .replace(/전시장/g, IND.place);
    }
    function arCta() {
      return `댓글에 [${IND.cta}] 남겨주세요`;
    }
    // 가격 강조: 업종 프리셋에 priceTag가 있으면 그것, 없으면 기존 "-480만원" 방식
    function arPriceTag() {
      return campaign.priceTag || `-${campaign.discountNum}만원`;
    }
    function arPriceLine() {
      return campaign.priceLine || `최대 ${arPriceTag()}`;
    }
    function arPriceAnim(p) {
      if (campaign.priceTag) return campaign.priceTag;
      return `-${Math.round((campaign.discountNum || 0) * p)}만원`;
    }
    function arPresetsForIndustry() {
      return IND.key === 'auto' ? presets : (AR_INDUSTRY_PRESETS[IND.key] || {});
    }

    // 캔버스에 그리는 글자(영상 디자인)도 업종 낱말로: fillText/strokeText/measureText를 함께 바꿔야 글자 폭 계산이 맞음
    function indCanvasWord(t) {
      return indWord(t).replace(/VEHICLE/g, 'ITEM').replace(/AUTO (DAILY|MAGAZINE)/g, 'LOCAL $1');
    }
    (function () {
      if (typeof CanvasRenderingContext2D === 'undefined') return;
      const P = CanvasRenderingContext2D.prototype;
      ['fillText', 'strokeText', 'measureText'].forEach((fn) => {
        const orig = P[fn];
        P[fn] = function (t, ...rest) {
          if (IND.key !== 'auto' && typeof t === 'string') t = indCanvasWord(t);
          return orig.call(this, t, ...rest);
        };
      });
    })();

    // 화면 글자(버튼·라벨·안내문)를 업종 낱말로. 원래 글자를 기억해 두어 자동차로 돌아오면 그대로 복원
    const AR_TXT = new WeakMap();
    const AR_ATTR = new WeakMap();
    const AR_IND_ATTRS = ['placeholder', 'title', 'aria-label'];
    const AR_CAR_RE = /카마스터|출고|견적|차종|시승|전시장/;
    function arIndTextNode(node) {
      const v = node.nodeValue;
      let rec = AR_TXT.get(node);
      if (!rec && (IND.key === 'auto' || !v || !AR_CAR_RE.test(v))) return;
      if (!rec || v !== rec.out) rec = { orig: v };
      const out = indWord(rec.orig);
      rec.out = out;
      AR_TXT.set(node, rec);
      if (v !== out) node.nodeValue = out;
    }
    function arIndAttrs(el) {
      let recs = AR_ATTR.get(el);
      AR_IND_ATTRS.forEach((a) => {
        const v = el.getAttribute(a);
        if (v == null) return;
        let rec = recs && recs[a];
        if (!rec && (IND.key === 'auto' || !AR_CAR_RE.test(v))) return;
        if (!rec || v !== rec.out) rec = { orig: v };
        const out = indWord(rec.orig);
        rec.out = out;
        recs = recs || {};
        recs[a] = rec;
        AR_ATTR.set(el, recs);
        if (v !== out) el.setAttribute(a, out);
      });
    }
    function arIndSkip(el) {
      return !el || el.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|CANVAS|SVG)$/i.test(el.tagName) || el.isContentEditable || el.closest('[data-noind]');
    }
    function arIndWalk(root) {
      if (!root) return;
      if (root.nodeType === 3) {
        if (!arIndSkip(root.parentElement)) arIndTextNode(root);
        return;
      }
      if (arIndSkip(root)) return;
      arIndAttrs(root);
      const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.nodeType === 1 && arIndSkip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
      });
      let n;
      while ((n = w.nextNode())) {
        if (n.nodeType === 3) arIndTextNode(n);
        else arIndAttrs(n);
      }
    }
    let arIndObserver = null;
    function arIndStartObserver() {
      if (arIndObserver || typeof MutationObserver === 'undefined') return;
      arIndObserver = new MutationObserver((list) => {
        if (IND.key === 'auto') return;
        list.forEach((m) => {
          if (m.type === 'characterData') arIndWalk(m.target);
          else if (m.type === 'attributes') { if (!arIndSkip(m.target)) arIndAttrs(m.target); }
          else m.addedNodes.forEach((n) => arIndWalk(n));
        });
      });
      arIndObserver.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: AR_IND_ATTRS });
    }

    // 상품 프리셋 선택 목록
    let AR_AUTO_PRESET_OPTIONS = null;
    function arRenderPresetSelect() {
      const sel = document.getElementById('presetSelect');
      if (!sel) return;
      if (AR_AUTO_PRESET_OPTIONS == null) AR_AUTO_PRESET_OPTIONS = sel.innerHTML;
      if (IND.key === 'auto') {
        sel.innerHTML = AR_AUTO_PRESET_OPTIONS;
      } else {
        const list = AR_INDUSTRY_PRESETS[IND.key] || {};
        sel.innerHTML = Object.keys(list).map((k) => `<option value="${k}">${escapeHtmlInd(list[k].vehicle)} (${escapeHtmlInd(list[k].priceTag || '')})</option>`).join('');
      }
      const lab = sel.previousElementSibling;
      if (lab && lab.tagName === 'LABEL') lab.textContent = `${IND.product} 프리셋`;
    }
    function escapeHtmlInd(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    // 업종 주의 문구 (병원·부동산·학원 광고 규정)
    function arRenderIndustryCaution() {
      let box = document.getElementById('industryCaution');
      const sel = document.getElementById('presetSelect');
      if (!box && sel && sel.parentElement) {
        box = document.createElement('div');
        box.id = 'industryCaution';
        box.setAttribute('data-noind', '');
        box.className = 'mt-2 text-[11px] leading-relaxed rounded-[8px] px-3 py-2 border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#fcd34d]';
        sel.parentElement.appendChild(box);
      }
      if (!box) return;
      box.textContent = IND.caution ? `⚠️ ${IND.caution}` : '';
      box.style.display = IND.caution ? '' : 'none';
    }

    // 헤더의 업종 버튼 + 고르는 창
    function arRenderIndustryChip() {
      let btn = document.getElementById('headerIndustryBtn');
      const anchor = document.getElementById('headerLoggedDealerChip');
      if (!btn && anchor && anchor.parentElement) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'headerIndustryBtn';
        btn.setAttribute('data-noind', '');
        btn.className = 'h-8 px-3 rounded-[8px] bg-[#141415] border border-[var(--border)] text-[12px] text-[#ededed] hover:border-[#52525b] cursor-pointer';
        btn.onclick = arIndustryChipClick;
        anchor.parentElement.insertBefore(btn, anchor);
      }
      if (btn) {
        btn.textContent = arIndustryLocked ? `${IND.icon} ${IND.name} ▾` : `${IND.icon} ${IND.name} · 업종 선택`;
        btn.title = arIndustryLocked ? '내 계정 업종 — 눌러서 바꿀 수 있습니다' : '회원가입할 때 업종을 고르면 내 계정 업종으로 저장됩니다';
      }
      const auth = document.getElementById('authIndustryInput');
      if (auth) {
        if (!auth.options.length) {
          auth.innerHTML = Object.values(AR_INDUSTRIES).map((x) => `<option value="${x.key}">${x.icon} ${x.name}</option>`).join('');
          auth.onchange = () => arSignupIndustryChanged(auth.value);
        }
        auth.value = IND.key;
      }
    }
    // 업종은 회원가입 때 고르고, 로그인하면 그 업종으로 고정
    let arIndustryLocked = false;
    function arIndustryChipClick() {
      return openIndustryPicker();
    }
    // 가입 창에서 업종을 바꾸면 미리보기와 입력칸 안내도 그 업종으로
    function arSignupIndustryChanged(key) {
      if (arIndustryLocked) return;
      setIndustry(key);
      arFillSignupFieldsForIndustry();
    }
    function arFillSignupFieldsForIndustry() {
      const set = (id, v, ph) => { const el = document.getElementById(id); if (el) { el.value = v; if (ph != null) el.placeholder = ph; } };
      const lab = (id, text) => { const el = document.getElementById(id); const l = el && el.closest('div') && el.closest('div').querySelector('label'); if (l) l.textContent = text; };
      set('authTitleInput', IND.title, IND.title);
      set('authBranchInput', '', IND.branchPlaceholder);
      set('authPromoInput', '', IND.promoPlaceholder);
      lab('authNameInput', `${IND.role === '대표' ? '대표' : IND.role.replace(/님$/, '')} 성함`);
      lab('authBranchInput', IND.branchLabel);
      lab('authPromoInput', IND.promoLabel);
    }
    // 로그인한 회원이 업종 바꾸기: 화면을 바꾸고 계정에도 저장
    async function arChangeAccountIndustry(key) {
      const m = document.getElementById('industryPickerModal');
      if (m) m.remove();
      if (!AR_INDUSTRIES[key] || key === IND.key) return;
      const next = AR_INDUSTRIES[key];
      arLockIndustry(key);
      try {
        if (window.AR_SERVER && AR_SERVER.mode) {
          const u = (AR_SERVER.me && AR_SERVER.me.user) || {};
          const r = await arApi('profile', { name: u.name, title: u.title, branch: u.branch, email: u.email, promo: u.promo, industry: key });
          if (r.ok) { AR_SERVER.me = r.body; arToast(`업종을 ${next.name}(으)로 바꿨습니다.`, true); }
          else arToast(r.body.message || '업종을 저장하지 못했습니다. 다시 시도해 주세요.');
        } else {
          const phone = localStorage.getItem('autoreels_logged_phone');
          const accs = loadDealerAccounts();
          if (phone && accs[phone]) { accs[phone].industry = key; saveDealerAccounts(accs); }
          if (typeof arToast === 'function') arToast(`업종을 ${next.name}(으)로 바꿨습니다.`, true);
        }
      } catch (e) {}
    }

    // 로그인한 계정의 업종으로 고정
    function arLockIndustry(key) {
      arIndustryLocked = false;
      setIndustry(AR_INDUSTRIES[key] ? key : 'auto', { silent: true });
      arIndustryLocked = true;
      arRenderIndustryChip();
      const m = document.getElementById('industryPickerModal');
      if (m) m.remove();
    }
    let arPickerChoice = '';
    function openIndustryPicker() {
      let m = document.getElementById('industryPickerModal');
      if (!m) {
        m = document.createElement('div');
        m.id = 'industryPickerModal';
        m.setAttribute('data-noind', '');
        m.className = 'fixed inset-0 z-[90] flex ar-modal';
        m.onclick = (ev) => { if (ev.target === m) m.remove(); };
        document.body.appendChild(m);
      }
      arPickerChoice = IND.key;
      m.innerHTML = `
        <div class="ar-modal-card space-y-4" style="--mw:480px">
          <div class="ar-modal-head">
            <div>
              <h3>업종 바꾸기</h3>
              <p class="text-[#85858b]">고른 뒤 [저장]을 누르면 화면 문구·상품 프리셋·대본 템플릿이 그 업종으로 바뀌고 내 계정에도 저장됩니다.</p>
            </div>
            <button type="button" onclick="document.getElementById('industryPickerModal').remove()" class="ar-modal-x" aria-label="닫기">×</button>
          </div>
          <div class="grid grid-cols-2 gap-2" id="industryPickerGrid">
            ${Object.values(AR_INDUSTRIES).map((x) => `
              <button type="button" data-ind="${x.key}" onclick="arPickIndustry('${x.key}')"
                class="ar-choice h-12 px-3 text-left text-[13px] cursor-pointer flex items-center gap-2 ${x.key === IND.key ? 'on' : ''}">
                <span class="text-[18px]">${x.icon}</span><span>${x.name}</span>${x.key === IND.key ? '<span class="ml-auto text-[10px] text-[#85858b]">지금</span>' : ''}
              </button>`).join('')}
          </div>
          <p class="text-[11px] text-[#85858b]">고르신 업종에 맞는 전용 디자인·사진·대본·명함이 바로 적용됩니다.</p>
          <div class="ar-modal-foot">
            <button type="button" onclick="document.getElementById('industryPickerModal').remove()" class="btn-secondary h-9 px-4 text-[12px] cursor-pointer">취소</button>
            <button type="button" id="industryPickerSave" onclick="arChangeAccountIndustry(arPickerChoice)" class="btn-primary h-9 px-5 text-[12px] cursor-pointer" disabled style="opacity:.45">저장</button>
          </div>
        </div>`;
    }
    function arPickIndustry(key) {
      arPickerChoice = key;
      document.querySelectorAll('#industryPickerGrid [data-ind]').forEach((b) => b.classList.toggle('on', b.dataset.ind === key));
      const save = document.getElementById('industryPickerSave');
      if (save) { const same = key === IND.key; save.disabled = same; save.style.opacity = same ? '.45' : '1'; save.textContent = same ? '저장' : `${AR_INDUSTRIES[key].name}(으)로 저장`; }
    }

    // 체험용 견본 카마스터(김민준 등)는 업종에 맞는 직함·가게 이름·혜택 문구로 바꿔 보여 줌
    const AR_DEMO_DEALER_IDS = ['dlr_1', 'dlr_2', 'dlr_3'];
    // 견본 값인지: 자동차 견본 원래 값이거나 어느 업종의 예시 매장 정보와 같으면 견본으로 봄
    function arIsSampleDealerValue(d, k) {
      const v = String(d[k] || '').trim();
      if (!v) return true;
      if (d._autoOrig && String(d._autoOrig[k] || '').trim() === v) return true;
      return Object.values(AR_INDUSTRIES).some((ind) => [
        ...(ind.storeNames || []), ind.storeSubtitle, ind.storeLocation, ind.branchPlaceholder, ind.promoPlaceholder, ind.title,
        ind.place ? `${ind.place} 공식 안내` : ''
      ].some((s) => s && String(s).trim() === v));
    }
    function arApplyIndustryDemoDealers() {
      if (typeof dealers === 'undefined') return;
      dealers.forEach((d, idx) => {
        if (!d._autoOrig) {
          d._autoOrig = {
            name: d.name,
            title: d.title,
            branch: d.branch,
            promoTag: d.promoTag,
            phone: d.phone,
            avatarImg: d.avatarImg
          };
        }
        if (IND.key === 'auto') {
          Object.assign(d, d._autoOrig);
          return;
        }
        if (IND.outroMode === 'store') {
          // 대체 그림에도 예시 매장명은 넣지 않음
          const storeName = IND.place || IND.name || '';
          if (!d._storeAvatarCache) d._storeAvatarCache = {};
          if (!d._storeAvatarCache[IND.key]) {
            const storeImg = new Image();
            storeImg.crossOrigin = 'anonymous';
            storeImg.onload = () => {
              if (window.__timelines?.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            };
            storeImg.onerror = () => {
              if (typeof createThemedSceneImage === 'function') {
                const deck = (typeof AR_INDUSTRY_SCENE_DECKS !== 'undefined' && AR_INDUSTRY_SCENE_DECKS[IND.key]) || [];
                const storeScene = deck[8] || deck[0] || [IND.icon, storeName, IND.storeSubtitle || IND.place, ['#1f1209', '#451a03']];
                const fb = createThemedSceneImage(IND.icon || storeScene[0], storeName, IND.storeSubtitle || `${IND.place} 공식 안내`, storeScene[3] || ['#1f1209', '#451a03'], storeName, 10);
                storeImg.src = fb.src;
              }
            };
            storeImg.src = `/assets/scenes/${IND.key}/9.jpg`;
            d._storeAvatarCache[IND.key] = storeImg;
          }
          d.avatarImg = d._storeAvatarCache[IND.key] || d._autoOrig.avatarImg;
        } else {
          d.avatarImg = d._autoOrig.avatarImg;
        }
        // 명함(4단계)은 비워 둠: 예시 매장명·주소·혜택은 입력칸 안내 문구(placeholder)로만 보여 줌
        // 사장님이 직접 입력한 값은 그대로 두고, 견본(자동차 견본·업종 예시) 값만 지움
        ['name', 'title', 'branch', 'promoTag', 'phone'].forEach((k) => {
          if (arIsSampleDealerValue(d, k)) d[k] = '';
        });
      });
      const nameIn = document.getElementById('dlrInputName');
      const titleIn = document.getElementById('dlrInputTitle');
      const branchIn = document.getElementById('dlrInputBranch');
      const promoIn = document.getElementById('dlrInputPromo');
      if (nameIn) nameIn.placeholder = IND.key === 'auto' ? '김민준' : `예: ${(IND.storeNames && IND.storeNames[0]) || '매장명'}`;
      if (titleIn) titleIn.placeholder = IND.outroMode === 'store' ? (IND.storeSubtitle || '매장 공식 안내') : (IND.title || '대표');
      if (branchIn) branchIn.placeholder = IND.outroMode === 'store' ? (IND.storeLocation || IND.branchPlaceholder) : (IND.branchPlaceholder || '소속 지점');
      if (promoIn) promoIn.placeholder = IND.promoPlaceholder || '';
      const phoneIn = document.getElementById('dlrInputPhone');
      if (phoneIn) phoneIn.placeholder = IND.key === 'auto' ? '010-4821-9032' : '예: 02-123-4567';      if (typeof syncPreviewPanel === 'function') { try { syncPreviewPanel(); } catch (e) {} }
    }

    // 업종별 10개 디폴트 장면 덱 (각 업장마다 10개의 서로 다른 테마·구도·배경의 기본 이미지를 생성)
    const AR_INDUSTRY_SCENE_DECKS = {
      auto: [
        ['🚘', '시그니처 외관 풀샷', '선점 물량 즉시 출고 모델', ['#0f172a', '#1e3a8a']],
        ['✨', '프론트 LED 헤드램프', '세련된 전면 디자인 디테일', ['#111827', '#312e81']],
        ['🛋️', '프리미엄 1열 콕핏', '파노라믹 디스플레이 & 시트', ['#1c1917', '#44403c']],
        ['👨‍👩‍👧‍👦', '여유로운 2열 공간', '패밀리카 최적의 실내 레그룸', ['#090d16', '#1e293b']],
        ['🔑', '스마트키 인도 순간', '당일 검수 완료 · 바로 출발', ['#171717', '#713f12']],
        ['🛡️', '신차 꼼꼼 검수 리포트', '외관·단차·전장 완벽 체크', ['#064e3b', '#0f172a']],
        ['🎨', '인기 외장 컬러 라인업', '화이트 · 블랙 · 그레이 선점', ['#18181b', '#3f3f46']],
        ['⚡', '고효율 파워트레인', '연비와 주행감을 동시에', ['#0c4a6e', '#090d16']],
        ['📦', '풀패키지 시공 서비스', '프리미엄 썬팅 · 블랙박스', ['#3b0764', '#1e1b4b']],
        ['📍', '공식 전시장 1:1 안내', '방문 시승 및 전국 탁송 가능', ['#1e293b', '#0f172a']]
      ],
      restaurant: [
        ['🍲', '시그니처 메인 요리', '매일 아침 정성껏 끓여낸 대표 메뉴', ['#3b1d0a', '#1a0f08']],
        ['🥩', '최상급 원육 · 신선 재료', '엄선된 산지 직송 재료만 사용', ['#450a0a', '#1c0a0a']],
        ['🥢', '정갈한 한 상 차림', '메인부터 곁들임까지 푸짐한 구성', ['#422006', '#1a1204']],
        ['🔥', '불향 가득 조리 순간', '주문 즉시 조리해 가장 맛있을 때', ['#431407', '#180905']],
        ['🍱', '점심 특선 · 가성비 정식', '평일 점심 한정 인기 메뉴', ['#365314', '#141e09']],
        ['🥗', '매일 손질하는 밑반찬', '직접 담근 김치와 신선한 반찬', ['#064e3b', '#071a14']],
        ['🏮', '아늑한 홀 · 프라이빗 룸', '가족 외식부터 소모임까지 편안하게', ['#31102f', '#140714']],
        ['🥂', '단체 회식 · 모임 예약', '넓은 좌석과 주차 공간 완비', ['#4c0519', '#19050b']],
        ['📦', '깔끔한 포장 · 배달', '집에서도 매장 맛 그대로 즐기기', ['#1e293b', '#0f172a']],
        ['📍', '매장 위치 · 예약 안내', '댓글에 [예약] 남기시면 바로 안내', ['#7c2d12', '#1f0b05']]
      ],
      cafe: [
        ['☕', '시그니처 크림 라떼', '부드러운 크림과 진한 에스프레소', ['#3a2410', '#140d06']],
        ['🫘', '매장 직접 로스팅 원두', '매일 신선하게 볶아내는 스페셜티', ['#29180d', '#120a05']],
        ['🍰', '오늘 구운 수제 케이크', '매일 아침 매장에서 직접 굽는 디저트', ['#4a1230', '#190712']],
        ['🥐', '겉바속촉 베이커리', '갓 나온 따뜻한 크루아상 · 스콘', ['#451a03', '#1a0b02']],
        ['🍵', '시즌 한정 음료 라인업', '제철 과일로 만든 상큼한 에이드', ['#143620', '#07140c']],
        ['🪟', '햇살 가득 창가 자리', '여유롭게 머물기 좋은 감성 인테리어', ['#1e293b', '#0f172a']],
        ['🧊', '시원한 디카페인 · 콜드브루', '카페인 부담 없이 즐기는 깊은 풍미', ['#0c4a6e', '#071826']],
        ['🎂', '홀케이크 사전 예약', '기념일 레터링 케이크 맞춤 제작', ['#4c1d95', '#170a2e']],
        ['🎫', '스탬프 적립 · 단골 혜택', '10잔 적립 시 음료 1잔 무료', ['#065f46', '#061c16']],
        ['📍', '카페 오시는 길 · 영업시간', '댓글에 [쿠폰] 남기시면 혜택 안내', ['#78350f', '#1c0f05']]
      ],
      beauty: [
        ['💇', '맞춤 헤어 스타일링', '얼굴형과 모질에 맞춘 1:1 디자인', ['#3b0f2c', '#160812']],
        ['💅', '이달의 신상 아트 네일', '트렌디한 컬러와 섬세한 케어', ['#2a1340', '#100a18']],
        ['🔬', '정밀 두피 · 모발 진단', '시술 전 꼼꼼한 상태 체크', ['#0f332d', '#061412']],
        ['✨', '윤기 가득 손상 케어', '클리닉 포함으로 건강하게 유지', ['#4c1d95', '#140929']],
        ['🪑', '프라이빗 1인 시술 공간', '편안하고 조용한 힐링 타임', ['#1e293b', '#0f172a']],
        ['🎨', '퍼스널 컬러 염색', '피부 톤을 밝혀주는 자연스러운 발색', ['#500724', '#1a040e']],
        ['🌿', '순한 프리미엄 제품 사용', '두피 자극을 줄인 검증된 시술제', ['#064e3b', '#051a14']],
        ['📸', '시술 전후 비포 & 애프터', '자연스럽게 달라지는 스타일 변화', ['#312e81', '#0f0e2b']],
        ['🎁', '첫 방문 고객 특별 혜택', '댓글에 [예약] 시 케어 서비스', ['#701a75', '#210724']],
        ['📍', '샵 위치 · 우선 예약 안내', '100% 예약제로 대기 없이 시술', ['#831843', '#1f0612']]
      ],
      realestate: [
        ['🏠', '매물 외관 · 단지 전경', '역세권 도보권의 쾌적한 입지', ['#0c2a44', '#06101a']],
        ['🛋️', '채광 좋은 남향 거실', '탁 트인 뷰와 넉넉한 공간감', ['#1e3a5f', '#0a1626']],
        ['🍳', '깔끔한 주방 · 수납 공간', '신축급 컨디션의 빌트인 구성', ['#1e293b', '#0f172a']],
        ['🛏️', '안정감 있는 침실 구조', '동선이 편리한 투룸 · 쓰리룸', ['#123a1f', '#07130b']],
        ['🚇', '지하철 · 버스 교통 입지', '출퇴근이 편리한 초역세권', ['#1e1b4b', '#09081a']],
        ['🏫', '학군 · 생활 편의시설', '대형마트·병원·공원 도보 이용', ['#064e3b', '#051a14']],
        ['📋', '전세사기 예방 권리분석', '등기부등본·보증보험 꼼꼼 확인', ['#3a2a08', '#151004']],
        ['🔑', '즉시 입주 가능 매물', '입주 날짜 협의 가능한 실매물', ['#0f172a', '#1e293b']],
        ['🤝', '허위 없는 실매물 브리핑', '공인중개사 직접 동행 투어', ['#312e81', '#11102b']],
        ['📍', '중개사무소 상담 안내', '댓글에 [매물] 남기시면 상세 정보', ['#0369a1', '#061926']]
      ],
      academy: [
        ['📚', '소수정예 맞춤 수업', '학생 한 명 한 명 꼼꼼한 지도', ['#0f2148', '#060c1a']],
        ['✏️', '1:1 레벨테스트 진단', '현재 실력과 취약 단원 정확히 파악', ['#1e3a8a', '#09112b']],
        ['📝', '매주 오답 클리닉', '틀린 문제는 완전히 이해할 때까지', ['#123a1f', '#07130b']],
        ['💻', '실습 · 프로젝트 수업', '직접 만들고 발표하는 참여형 교육', ['#2a1340', '#100a18']],
        ['📖', '자체 제작 핵심 교재', '학교별 내신·시험 유형 완벽 반영', ['#312e81', '#100f29']],
        ['🏫', '집중 잘되는 자습 공간', '쾌적한 학습 환경과 관리 시스템', ['#1e293b', '#0f172a']],
        ['👨‍🏫', '전담 선생님 밀착 관리', '출결부터 과제까지 학부모 소통', ['#064e3b', '#051a14']],
        ['🎯', '단계별 로드맵 안내', '기초부터 심화까지 체계적 커리큘럼', ['#4c1d95', '#15082b']],
        ['🎁', '무료 체험수업 신청', '수업 분위기를 먼저 경험해 보세요', ['#0369a1', '#061926']],
        ['📍', '학원 위치 · 상담 안내', '댓글에 [상담] 남기시면 시간표 안내', ['#1d4ed8', '#071338']]
      ],
      clinic: [
        ['🏥', '병원 외관 · 접수 안내', '편안하고 청결한 진료 환경', ['#0c4a6e', '#061926']],
        ['🩺', '전문의 1:1 정밀 상담', '증상의 원인부터 차근차근 설명', ['#0f332d', '#061412']],
        ['🔬', '최신 정밀 검사 장비', '정확한 진단을 위한 체계적 검사', ['#1e3a5f', '#091524']],
        ['🛏️', '쾌적한 치료 · 회복실', '프라이빗하게 관리받는 진료 공간', ['#1e293b', '#0f172a']],
        ['📋', '과잉 진료 없는 정직한 안내', '꼭 필요한 치료만 투명하게 권유', ['#064e3b', '#051a14']],
        ['🕒', '야간 · 주말 진료 안내', '바쁜 직장인도 편하게 방문 가능', ['#312e81', '#0f0e29']],
        ['🚶', '역세권 도보 3분 거리', '찾아오시기 편한 건물 내 주차 완비', ['#164e63', '#07191f']],
        ['💬', '친절한 사후 관리 안내', '진료 후 주의사항까지 꼼꼼히 체크', ['#134e4a', '#061a19']],
        ['📅', '사전 예약 대기 최소화', '원하시는 시간에 맞춘 예약 진료', ['#1e40af', '#091233']],
        ['📍', '진료 시간 · 오시는 길', '댓글에 [상담] 남기시면 안내해 드려요', ['#0284c7', '#061e2e']]
      ],
      fitness: [
        ['💪', '1:1 맞춤 트레이닝', '체형과 목표에 맞춘 운동 설계', ['#450a0a', '#170505']],
        ['🧘', '기구 필라테스 스튜디오', '코어 강화와 바른 자세 교정', ['#3b0f2c', '#140610']],
        ['📊', '인바디 체성분 정밀 측정', '데이터 기반의 체계적인 변화 관리', ['#0c4a6e', '#061926']],
        ['🏋️', '프리미엄 머신 & 프리웨이트', '대기 없이 쾌적한 최신 운동 기구', ['#18181b', '#09090b']],
        ['🥗', '무리 없는 식단 가이드', '생활 패턴에 맞춘 현실적인 식단', ['#064e3b', '#051a14']],
        ['🚿', '호텔급 샤워실 · 탈의실', '운동 후 산뜻하게 마무리하는 공간', ['#1e293b', '#0f172a']],
        ['🔥', '다이어트 · 바디프로필 반', '지치지 않게 함께 달리는 밀착 케어', ['#7c2d12', '#1f0b05']],
        ['🤝', '초보자 기초 자세 교정', '운동이 처음이어도 안전하게 시작', ['#312e81', '#0f0e29']],
        ['🎁', '1회 무료 체험권 증정', '직접 경험해 보고 결정하세요', ['#991b1b', '#260707']],
        ['📍', '센터 위치 · 상담 안내', '댓글에 [상담] 남기시면 체험 예약', ['#b91c1c', '#2b0606']]
      ],
      shop: [
        ['🛍️', '이번 주 베스트 신상', '가장 문의가 많은 인기 아이템', ['#3b0764', '#130421']],
        ['👗', '실물 착용 · 디테일 컷', '소재와 핏이 살아있는 데일리 스타일', ['#4a1230', '#180610']],
        ['🧶', '고급 원단 · 꼼꼼한 마감', '오래 입어도 변형 적은 탄탄한 품질', ['#292524', '#0c0a09']],
        ['🎨', '다양한 컬러 · 사이즈 옵션', '취향에 맞게 고르는 폭넓은 구성', ['#1e3a8a', '#09112b']],
        ['📦', '당일 발송 빠른 배송', '오후 3시 전 주문 시 오늘 바로 출발', ['#064e3b', '#051a14']],
        ['🎁', '정성 담은 선물 포장', '소중한 분께 전하는 특별한 패키지', ['#701a75', '#210724']],
        ['💬', '실제 구매자 재구매율 1위', '만족도 높은 실용적인 아이템', ['#1e293b', '#0f172a']],
        ['✨', '스타일링 코디 추천', '어디에나 매치하기 좋은 활용도', ['#312e81', '#0f0e29']],
        ['🏷️', '오늘 주문 무료배송 혜택', '합리적인 가격으로 만나는 신상', ['#9d174d', '#240512']],
        ['📍', '스토어 주문 · 구매 안내', '댓글에 [구매] 남기시면 링크 발송', ['#6d28d9', '#1b0a36']]
      ],
      interior: [
        ['🛠️', '30평대 올수리 완공', '모던하고 따뜻한 거실 리모델링', ['#1e293b', '#0f172a']],
        ['🚿', '호텔식 욕실 리모델링', '포세린 타일과 간접조명 포인트', ['#0f332d', '#061412']],
        ['🍳', '맞춤 주방 싱크대 시공', '수납과 동선을 극대화한 키친', ['#3a2410', '#140d06']],
        ['💡', '감성 라인 · 간접 조명', '공간 분위기를 바꾸는 조명 설계', ['#422006', '#1a1204']],
        ['🪵', '프리미엄 강마루 · 필름', '친환경 자재로 깔끔한 마감 처리', ['#29180d', '#120a05']],
        ['📐', '현장 무료 실측 & 3D 도면', '시공 전 완성 모습을 미리 확인', ['#1e3a8a', '#09112b']],
        ['📋', '투명한 공정표 · 정품 자재', '자재 등급과 공사 일정을 명확히 공개', ['#064e3b', '#051a14']],
        ['🔧', '책임 시공 & 사후 AS 보증', '완공 후에도 끝까지 책임지는 관리', ['#312e81', '#0f0e29']],
        ['📸', '시공 전후 비포 & 애프터', '오래된 집의 놀라운 변신 과정', ['#3f3f46', '#18181b']],
        ['📍', '무료 방문 견적 상담', '댓글에 [견적] 남기시면 일정 안내', ['#0369a1', '#061926']]
      ]
    };

    function createThemedSceneImage(icon, title, sub, grad, labelId, sceneNum) {
      const cv = document.createElement('canvas');
      cv.width = 720; cv.height = 1280;
      const c = cv.getContext('2d');
      const lg = c.createLinearGradient(0, 0, 720, 1280);
      lg.addColorStop(0, grad[0]); lg.addColorStop(1, grad[1]);
      c.fillStyle = lg; c.fillRect(0, 0, 720, 1280);

      // 스튜디오 스포트라이트 글로우
      const rg = c.createRadialGradient(360, 500, 40, 360, 500, 440);
      rg.addColorStop(0, 'rgba(255,255,255,0.16)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = rg; c.fillRect(0, 0, 720, 1280);

      // 장식용 보케 패턴
      c.globalAlpha = 0.06; c.fillStyle = '#ffffff';
      for (let k = 0; k < 10; k++) {
        const bx = ((k * 173 + sceneNum * 89) % 600) + 60;
        const by = ((k * 311 + sceneNum * 137) % 1080) + 100;
        const br = 45 + ((k + sceneNum) % 5) * 24;
        c.beginPath(); c.arc(bx, by, br, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;

      // 상단 씬 번호 배지
      c.strokeStyle = 'rgba(255,255,255,0.22)';
      c.lineWidth = 2;
      c.beginPath(); c.roundRect(250, 210, 220, 44, 22); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.85)';
      c.font = '700 20px "JetBrains Mono", monospace';
      c.textAlign = 'center';
      c.fillText(`SCENE ${String(sceneNum).padStart(2, '0')} / 10`, 360, 239);

      // 메인 아이콘
      c.font = '210px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      c.fillText(icon, 360, 560);

      // 장면 제목 & 설명
      c.fillStyle = '#ffffff';
      c.font = '800 42px "Noto Sans KR",sans-serif';
      c.fillText(title, 360, 680);

      c.fillStyle = 'rgba(255,255,255,0.75)';
      c.font = '500 26px "Noto Sans KR",sans-serif';
      c.fillText(sub, 360, 736);

      c.fillStyle = 'rgba(255,255,255,0.42)';
      c.font = '500 21px "Noto Sans KR",sans-serif';
      c.fillText('사진 탭 · 장면별 교체로 내 사진 적용 가능', 360, 810);

      const img = new Image();
      img._label = labelId;
      img._sceneTitle = title;
      img.src = cv.toDataURL('image/jpeg', 0.86);
      return img;
    }

    // 업종별 10개 기본 이미지 생성 (실제 사진 우선 로드 + 오프라인 시 테마 카드 폴백)
    function arIndustryPlaceholderPhotos() {
      const deck = AR_INDUSTRY_SCENE_DECKS[IND.key] || AR_INDUSTRY_SCENE_DECKS.restaurant;
      return deck.map(([icon, title, sub, grad], i) => {
        const label = `${i + 1}. ${title}`;
        const url = `/assets/scenes/${IND.key}/${i + 1}.jpg`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img._label = label;
        img._sceneTitle = title;
        img._dataUrl = url;
        img.onload = () => {
          if (window.__timelines?.main) {
            window.__timelines.main.seek(window.__timelines.main.currentTime);
          }
        };
        img.onerror = () => {
          if (img._fellBack) return;
          img._fellBack = true;
          const fb = createThemedSceneImage(icon, title, sub, grad, label, i + 1);
          img._dataUrl = fb.src;
          img.src = fb.src;
          if (typeof renderPhotoThumbnailsGrid === 'function') renderPhotoThumbnailsGrid();
          if (typeof renderDynamicCutCardsUI === 'function') renderDynamicCutCardsUI();
        };
        img.src = url;
        return img;
      });
    }
    function arApplyIndustryPhotos() {
      if (typeof campaign === 'undefined' || campaign.isUserCustomPhotos) return;
      if (IND.key === 'auto') {
        if (campaign._indPhotos && typeof resetToAiPhotos === 'function') { campaign._indPhotos = false; resetToAiPhotos(); }
        return;
      }
      campaign.uploadedPhotos = arIndustryPlaceholderPhotos();
      campaign._indPhotos = true;
      if (typeof renderPhotoThumbnailsGrid === 'function') renderPhotoThumbnailsGrid();
      if (typeof renderDynamicCutCardsUI === 'function') renderDynamicCutCardsUI();
      if (typeof applyVideoDurations === 'function') { try { applyVideoDurations(); } catch (e) {} }
    }

    // 업종 바꾸기
    function setIndustry(key, opts = {}) {
      if (arIndustryLocked && key !== IND.key && !opts.force) return;
      const next = AR_INDUSTRIES[key] || AR_INDUSTRIES.auto;
      const changed = next.key !== IND.key;
      IND = next;
      try { localStorage.setItem('autoreels_industry', IND.key); } catch (e) {}
      if (IND.key === 'auto') { delete campaign.priceTag; delete campaign.priceLine; }
      arRenderIndustryChip();
      arRenderPresetSelect();
      arRenderIndustryCaution();
      arRenderArchetypeCats();
      arApplyIndustryDemoDealers();
      if (changed || opts.force) arApplyIndustryPhotos();
      if ((changed || opts.force) && typeof arVisibleDesigns === 'function' && typeof selectDesignStyle === 'function') {
        const vis = arVisibleDesigns();
        const cur = typeof getActiveDesign === 'function' ? getActiveDesign() : null;
        if (IND.key !== 'auto' && vis[0] && vis[0].industry) { campaign.designCat = '전체'; selectDesignStyle(vis[0].id); }
        else if (cur && !arDesignVisible(cur) && vis[0]) selectDesignStyle(vis[0].id);
        if (typeof renderDesignStylePicker === 'function') { try { renderDesignStylePicker(); } catch (e) {} }
      }
      if (changed || opts.force) {
        const list = arPresetsForIndustry();
        const first = Object.keys(list)[0];
        if (first && typeof applyPreset === 'function') {
          const sel = document.getElementById('presetSelect');
          if (sel) sel.value = first;
          applyPreset(first);
        }
        const tpl = IND.key === 'auto' ? 'clearance' : `ind_${IND.key}_1`;
        if (typeof applyStoryArchetype === 'function' && STORY_ARCHETYPES[tpl]) applyStoryArchetype(tpl);
      }
      if (typeof renderStoryArchetypesUI === 'function') renderStoryArchetypesUI();
      arRenderAiPromptHints();
      // 스크립트를 다 읽은 뒤 실행되도록 미룸 (처음 불러올 때 주제 코드가 아직 준비 전일 수 있음)
      setTimeout(() => { if (typeof arLoadTopics === 'function') { try { arLoadTopics(false); } catch (e) {} } }, 0);
      arIndWalk(document.body);
      arIndStartObserver();
      if (typeof renderPresetDrawer === 'function') { try { renderPresetDrawer(); } catch (e) {} }
    }

    // AI 대본 입력칸 예시: 업종에 맞는 상황 예시 (설명 문구의 짧은 예시도 함께)
    const AR_AI_PROMPT_HINTS = {
      auto: ['30대 여성, 그랜저 하브 선점차 2대 즉시출고 / 법인 대표님 GV80 비용처리', '30대 여성, 그랜저', '견적, 최저가, 무료, 1등'],
      restaurant: ['점심 한정 갈비탕 정식, 직장인 단골 / 주말 가족 외식 세트 예약', '점심 한정 갈비탕 정식', '최저가, 무료, 1등, 원조'],
      cafe: ['가을 신메뉴 밤 라떼 출시 / 평일 오후 디저트 세트 할인', '가을 신메뉴 밤 라떼', '최저가, 무료, 1등'],
      beauty: ['첫 방문 염색 20% 할인 / 웨딩 전 피부 관리 패키지', '첫 방문 염색 할인', '최저가, 무료, 효과 보장'],
      realestate: ['역세권 신축 투룸 전세 / 신혼부부 추천 30평대 아파트', '역세권 신축 투룸 전세', '급매, 최저가, 무조건'],
      academy: ['중2 수학 겨울방학 특강 / 고3 내신 대비 소수정예반', '중2 수학 겨울방학 특강', '성적 보장, 1등, 무조건'],
      clinic: ['환절기 비염 진료 안내 / 직장인 야간 진료 시간', '환절기 비염 진료 안내', '완치, 효과 보장, 최고, 할인'],
      fitness: ['PT 10회 등록 이벤트 / 3개월 바디프로필 챌린지', 'PT 10회 등록 이벤트', '무조건, 보장, 최저가'],
      shop: ['겨울 니트 신상 입고 / 첫 구매 무료배송 이벤트', '겨울 니트 신상 입고', '최저가, 1등, 정품 보장'],
      interior: ['30평 아파트 전체 리모델링 / 주방 상판 교체 시공 사례', '30평 아파트 전체 리모델링', '최저가, 무료, 1등']
    };
    function arRenderAiPromptHints() {
      const h = AR_AI_PROMPT_HINTS[IND.key] || AR_AI_PROMPT_HINTS.auto;
      const promptEl = document.getElementById('aiPromptInput');
      if (promptEl) promptEl.setAttribute('placeholder', `예: ${h[0]}`);
      const ex = document.getElementById('aiHowtoExample');
      if (ex) ex.textContent = `"${h[1]}"`;
      const exEl = document.getElementById('aiExcludeInput');
      if (exEl) exEl.setAttribute('placeholder', `예: ${h[2]} (쉼표로 구분 · AI 대본에서 자동 제외)`);
    }

    // 대본 템플릿 분류 버튼: 자동차가 아니면 자동차 전용 분류는 숨김
    function arRenderArchetypeCats() {
      ['vlog', 'special', 'luxury', 'ev_tech', 'sports', 'finance', 'trust'].forEach((c) => {
        const b = document.getElementById(`archCatBtn_${c}`);
        if (b) b.style.display = IND.key === 'auto' ? '' : 'none';
      });
      if (IND.key !== 'auto' && typeof currentArchetypeCategory !== 'undefined' && !['all', 'favorite', 'custom'].includes(currentArchetypeCategory)) {
        currentArchetypeCategory = 'all';
      }
    }
    function arArchetypeVisible(k) {
      const a = STORY_ARCHETYPES[k];
      if (!a) return false;
      if (a.industry) return a.industry === IND.key;
      if (IND.key !== 'auto' && !a.isCustom) return false;
      return true;
    }

    // 프리셋 데이터
    const presets = {
      sorento: {
        hook: '이번 달 계약 안 하면 손해! 11월 비밀 조건',
        vehicle: '2026 쏘렌토 하이브리드',
        discountNum: 480,
        discount: '월 46만원대 · 3일 즉시출고',
        bullets: [
          '✔ 대기 6개월 → 선점 재고 4대 즉시출고',
          '✔ 최대 할인 + 저금리 특별 금융 프로모션',
          '✔ 프리미엄 썬팅·블랙박스·유리막 풀패키지 무상'
        ],
        bgGradient: ['#060b19', '#172554'],
        neonColor: '#38bdf8'
      },
      santafe: {
        hook: '패밀리 SUV 원탑! 싼타페 하브 즉시출고 특판',
        vehicle: '디 올 뉴 싼타페 하이브리드',
        discountNum: 420,
        discount: '월 44만원대 · 선점재고 즉시출고',
        bullets: [
          '✔ 캘리그라피·프레스티지 인기 색상 즉시 배정',
          '✔ 현대캐피탈 저금리 할부 & 무보증 특판 렌트',
          '✔ 신차패키지 8종 + 공식 카마스터 특별 사은품'
        ],
        bgGradient: ['#060b19', '#0f172a'],
        neonColor: '#38bdf8'
      },
      grandeur: {
        hook: '성공의 상징! 디 올 뉴 그랜저 하브 즉시출고 특판',
        vehicle: '디 올 뉴 그랜저 하이브리드',
        discountNum: 450,
        discount: '월 48만원대 · 캘리그라피 즉시배정',
        bullets: [
          '✔ 3040 워너비 세단! 정숙성·연비 18km/L 동급 최고',
          '✔ 대기 없이 이번 주 즉시출고 가능한 선점 물량 확보',
          '✔ 초기비용 0원 무보증 장기렌트·리스 최저금리 비교'
        ],
        bgGradient: ['#09090b', '#1e293b'],
        neonColor: '#facc15'
      },
      carnival: {
        hook: '법인·다자녀 압도적 1위! 카니발 하브 긴급물량',
        vehicle: '더 뉴 카니발 하이브리드 9인승',
        discountNum: 390,
        discount: '월 52만원대 · 부가세 환급 가능',
        bullets: [
          '✔ 9인승 사업자 부가세 10% 환급 + 전액 비용처리',
          '✔ 긴급 취소차·선점 물량 대기 없이 당월 출고',
          '✔ 프리미엄 썬팅 + 사이드스텝 + 코일매트 무상'
        ],
        bgGradient: ['#060b19', '#1e293b'],
        neonColor: '#38bdf8'
      },
      bmw5: {
        hook: 'BMW 5시리즈 할인 실화? 재고 딱 3대!',
        vehicle: 'BMW 520i M Sport 패키지',
        discountNum: 1150,
        discount: '월 59만원대 · 즉시출고 가능',
        bullets: [
          '✔ 11월 입항 물량 한정 추가 프로모션 적용',
          '✔ 운용리스·장기렌트 최저 금리 비교 견적',
          '✔ 공식 전시장 출고 + 평생 소모품 케어 안내'
        ],
        bgGradient: ['#050811', '#0f172a'],
        neonColor: '#60a5fa'
      },
      gv80: {
        hook: '대표님들이 가장 많이 찾는 GV80 비밀 조건',
        vehicle: '제네시스 GV80 페이스리프트',
        discountNum: 620,
        discount: '법인·개인사업자 비용처리 특판',
        bullets: [
          '✔ 인기 외장/시트 컬러 조합 선점 재고 보유',
          '✔ 초기비용 0원 무보증 즉시출고 가능',
          '✔ 전국 어디든 탁송 및 신차검수 완벽 지원'
        ],
        bgGradient: ['#09090b', '#27272a'],
        neonColor: '#facc15'
      },
      used: {
        hook: '허위매물 0%! 성능보증 완료 무사고 특가',
        vehicle: '인증 중고차 특가 컬렉션',
        discountNum: 350,
        discount: '시세 대비 특가 인하 · 당일출고',
        bullets: [
          '✔ 1인 신조 · 완전 무사고 · 비흡연 차량 엄선',
          '✔ 1년 / 2만km 엔진·미션 보증 연장 가입 완료',
          '✔ 저신용·전액할부 최저 금리 맞춤 승인'
        ],
        bgGradient: ['#022c22', '#0f172a'],
        neonColor: '#34d399'
      }
    };
