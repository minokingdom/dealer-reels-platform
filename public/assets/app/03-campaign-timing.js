// AutoReels — 03-campaign-timing.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // 카마스터별 스마트 자동 변주 (Smart Per-Dealer Variation & Anti-Duplicate Engine)
    // ============================================================================
    const CUT_NAMES = ['외관 디자인', '파노라믹 운전석', '2열 독립 캡틴시트', '즉시출고 스마트키'];
    const CAMERA_NAMES = [
      '고속 줌인(Push-In)', '와이드 패닝(Pan)', '줌아웃 리빌(Reveal)', '대각선 돌리(Dolly)',
      '역방향 패닝(Pan Left)', '틸트 업(Tilt Up)', '틸트 다운(Tilt Down)', '로테이트 줌(Rotate)',
      '비트 펀치인(Punch)', '핸드헬드 플로팅(Handheld)', '3D 스윙(Swing)', '크래시 줌(Crash Zoom)',
      '오빗 무빙(Orbit)', '더치 앵글(Dutch)'
    ];
    const TRANSITION_NAMES = [
      '크로스 디졸브', '휩 팬', '줌 블러 펀치', '세로 푸시', '아이리스 리빌', '대각선 와이프',
      '블라인드 스트립', '화이트 플래시', '글리치 슬라이스', '스핀 줌', '스플릿 도어', '카드 그로우'
    ];
    const MOTION_COUNT = CAMERA_NAMES.length;
    const TRANSITION_COUNT = TRANSITION_NAMES.length;

    function hashMotionSeed(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
      }
      return h % 9973;
    }

    // 카메라 무빙 상태 (p: 컷 진행률 0~1) → 확대·이동·회전·기울기 (시네마틱 GSAP 스타일)
    function cameraMotionState(type, p) {
      const io = Easing.power3InOut(p);
      const o4 = Easing.power4Out(p);
      switch (type % MOTION_COUNT) {
        case 0: return { s: 1.06 + o4 * 0.2, x: 0, y: (1 - o4) * 20 - 6, r: 0 };
        case 1: return { s: 1.22, x: 52 - io * 104, y: -6, r: 0 };
        case 2: return { s: 1.3 - io * 0.24, x: -14 + io * 14, y: -20 + io * 26, r: 0 };
        case 3: return { s: 1.12 + o4 * 0.14, x: -28 + o4 * 40, y: 24 - o4 * 32, r: 0 };
        case 4: return { s: 1.22, x: -52 + io * 104, y: 4, r: 0 };
        case 5: return { s: 1.17 + io * 0.05, x: 0, y: 66 - io * 132, r: 0 };
        case 6: return { s: 1.17 + io * 0.05, x: 0, y: -66 + io * 132, r: 0 };
        case 7: return { s: 1.32 - o4 * 0.18, x: 0, y: 0, r: (-4 + o4 * 4) * Math.PI / 180 };
        case 8: {
          const pop = p < 0.18 ? Easing.backOut(p / 0.18) : 1;
          return { s: 1.02 + pop * 0.14 + p * 0.06, x: 0, y: 0, r: 0 };
        }
        case 9: return {
          s: 1.15,
          x: Math.sin(p * Math.PI * 2.2) * 10,
          y: Math.cos(p * Math.PI * 1.7) * 8,
          r: Math.sin(p * Math.PI * 1.3) * 0.012
        };
        case 10: return { s: 1.18, x: 30 - io * 60, y: 0, r: 0, ky: 0.06 - io * 0.12 };
        case 11: {
          const q = p * p * p;
          return { s: 1.04 + q * 0.42, x: 0, y: -q * 18, r: 0 };
        }
        case 12: return {
          s: 1.2 + Math.sin(p * Math.PI) * 0.06,
          x: Math.cos(p * Math.PI) * 46,
          y: Math.sin(p * Math.PI) * -10,
          r: Math.cos(p * Math.PI) * 0.02
        };
        default: return { s: 1.24, x: -40 + io * 80, y: 0, r: 4 * Math.PI / 180 };
      }
    }

    const VARIATION_RECIPES = [
      {
        label: '변주 A (정석 쇼룸 후킹형)',
        cutOrder: [0, 1, 2, 3],
        cameraOrder: [0, 1, 2, 3],
        hook: '이번 달 계약 안 하면 손해! 11월 비밀 조건',
        badgeTop: '11월 한정',
        badgeBottom: '특별 프로모션',
        bullets: [
          '✔ 대기 6개월 → 선점 재고 4대 즉시출고',
          '✔ 최대 할인 + 저금리 특별 금융 프로모션'
        ],
        ctaKeyword: '견적',
        ctaBanner: '💬 댓글에 [견적] 남기시면 1:1 최저가 견적표 DM 발송!'
      },
      {
        label: '변주 B (즉시출고 키 인도 선행형)',
        cutOrder: [3, 0, 2, 1],
        cameraOrder: [2, 0, 3, 1],
        hook: '대기 6개월? 선점 재고 4대 즉시출고 확정!',
        badgeTop: '선착순 4대',
        badgeBottom: '즉시출고 특판',
        bullets: [
          '✔ 계약 즉시 당월 출고 가능한 긴급 물량 확보',
          '✔ 신차 패키지 8종 + 전국 무료 캐리어 탁송'
        ],
        ctaKeyword: '즉시출고',
        ctaBanner: '💬 댓글에 [즉시출고] 남기시면 실시간 재고표 DM 발송!'
      },
      {
        label: '변주 C (법인·사업자 절세 & 실내 강조형)',
        cutOrder: [1, 2, 0, 3],
        cameraOrder: [1, 3, 0, 2],
        hook: '법인·개인사업자 월 납입금 최저가 특판 공개',
        badgeTop: '사업자·법인',
        badgeBottom: '최저가 리스',
        bullets: [
          '✔ 법인·개인사업자 연간 1,500만 원 전액 비용처리',
          '✔ 초기비용 0원 무보증 최저가 리스·장기렌트'
        ],
        ctaKeyword: '특판',
        ctaBanner: '💬 댓글에 [특판] 남기시면 사업자 전용 견적서 DM 발송!'
      },
      {
        label: '변주 D (패밀리 캡틴시트 & 무보증 금융형)',
        cutOrder: [2, 0, 1, 3],
        cameraOrder: [3, 2, 1, 0],
        hook: '전국 대리점 비교 완료! 11월 마지막 최대 할인',
        badgeTop: '전국 최저가',
        badgeBottom: '비교견적 보증',
        bullets: [
          '✔ 전 금융사 금리 비교로 월 납입금 최저가 설계',
          '✔ 프리미엄 썬팅·블랙박스·유리막 풀패키지 무상'
        ],
        ctaKeyword: '비교견적',
        ctaBanner: '💬 댓글에 [비교견적] 남기시면 최저가 비교표 DM 발송!'
      },
      {
        label: '변주 E (초저금리 할부 & 스마트키 클로징형)',
        cutOrder: [0, 3, 1, 2],
        cameraOrder: [0, 2, 3, 1],
        hook: '초저금리 할부 vs 장기렌트 1:1 맞춤 비교견적',
        badgeTop: '초저금리',
        badgeBottom: '맞춤 금융설계',
        bullets: [
          '✔ 심사 서류 간소화 · 당일 승인 및 즉시 배정',
          '✔ 출고 후 사후관리 & 신차 검수 100% 책임 보장'
        ],
        ctaKeyword: '상담',
        ctaBanner: '💬 댓글에 [상담] 남기시면 1:1 맞춤 견적서 DM 발송!'
      }
    ];

    let dealers = [
      {
        id: 'dlr_1',
        name: '김민준',
        title: '수석 카마스터',
        branch: '현대·기아 강남오토스퀘어',
        phone: '010-4821-9032',
        licensedPhone: '010-4821-9032',
        expiryYmd: 20261231,
        licenseKey: formatWasmLicenseKey('010-4821-9032', 20261231),
        igUsername: '@hyundai_minjun_official',
        snsAccounts: {
          ig: '@hyundai_minjun_official',
          yt: '@minjun_car_tv',
          tt: '@minjun_autoteam',
          fb: '강남오토스퀘어 김민준 공식페이지'
        },
        igPwMasked: 'AES256:9f8a...c41b (암호화 보관)',
        accentColor: '#3b82f6',
        promoTag: '출고고객 전원 루마버텍스 썬팅 + 빌트인캠 무상지원',
        token: 'tok_minjun',
        avatarImg: null,
        status: 'PENDING',
        variation: JSON.parse(JSON.stringify(VARIATION_RECIPES[0]))
      },
      {
        id: 'dlr_2',
        name: '박서연',
        title: '공식인증 주임',
        branch: '기아 오토큐브 서초전시장',
        phone: '010-7734-1290',
        licensedPhone: '010-7734-1290',
        expiryYmd: 20261231,
        licenseKey: formatWasmLicenseKey('010-7734-1290', 20261231),
        igUsername: '@kia_seoyeon_deal',
        snsAccounts: {
          ig: '@kia_seoyeon_deal',
          yt: '@seoyeon_kia_shorts',
          tt: '@seoyeon_car_master',
          fb: '서초전시장 박서연 주임'
        },
        igPwMasked: 'AES256:3d12...e890 (암호화 보관)',
        accentColor: '#10b981',
        promoTag: '11월 한정 추가할인 + 전국 무료 캐리어 탁송 지원',
        token: 'tok_seoyeon',
        avatarImg: null,
        status: 'PENDING',
        variation: JSON.parse(JSON.stringify(VARIATION_RECIPES[1]))
      },
      {
        id: 'dlr_3',
        name: '이도현',
        title: '대표 팀장',
        branch: '현대·기아 법인특판 오토허브',
        phone: '010-9102-5581',
        licensedPhone: '010-9102-5581',
        expiryYmd: 20261231,
        licenseKey: formatWasmLicenseKey('010-9102-5581', 20261231),
        igUsername: '@dohyun_motors',
        snsAccounts: {
          ig: '@dohyun_motors',
          yt: '@dohyun_lease_tv',
          tt: '@dohyun_fleet_korea',
          fb: '법인특판 오토허브 이도현 팀장'
        },
        igPwMasked: 'Meta 공식 Graph API 연동됨',
        accentColor: '#f59e0b',
        promoTag: '1년/2만km 보증연장 + 엔진오일 쿠폰 무상 제공',
        token: 'tok_dohyun',
        avatarImg: null,
        status: 'PUBLISHED',
        variation: JSON.parse(JSON.stringify(VARIATION_RECIPES[2]))
      }
    ];

    let selectedDealerId = 'dlr_1';
    let BASE_DURATION = 12.0; // 사용자가 고른 영상 길이 (컷 수 기준)
    let TOTAL_DURATION = 12.0; // 실제 영상 길이 (성우 음성이 길면 자동으로 늘어남)
    let OUTRO_DURATION = 4.0;
    const FPS = 60;
    let isPlaying = true;
    let lastWallTime = performance.now();

    function getSelectedDealer() {
      return dealers.find((d) => d.id === selectedDealerId) || dealers[0];
    }

    // 영상 길이에 따른 본편 컷(사진·장면) 수 계산: 8~12초=4컷, 15초=6컷, 20초=8컷, 30초+=10컷
    function getTargetCutCount() {
      // 컷(자막·성우 대사) 수는 고른 영상 길이로 정함: 길이를 늘리면 컷과 대사가 늘어남.
      // 사진·영상은 따로 "장면"으로 나뉘어 깔리며, 같은 사진을 반복해 채우지 않음
      if (BASE_DURATION >= 26) return 10;
      if (BASE_DURATION >= 18) return 8;
      if (BASE_DURATION >= 14) return 6;
      return 4;
    }

    const EXTRA_CUT_BLUEPRINTS = [
      { label: '5. 파노라마 앰비언트 무드', widget: 'SPEC_FLOATING_TAGS', pos: 'center', cam: 1, cropMode: 'ambient',
        sub: (c) => `${c.vehicle} · 캘리그라피 전용 나파가죽 & 앰비언트 라이트`,
        tts: (c) => `나파가죽 시트에 파노라마 디스플레이.` },
      { label: '6. 광활한 2열·트렁크 적재', widget: 'CHECKLIST_GLASS', pos: 'bottom', cam: 2, cropMode: 'trunk',
        sub: (c) => `골프백 4개 + 유모차 여유 수납 · 패밀리·레저 완벽 대응`,
        tts: (c) => `넓은 2열과 트렁크, 패밀리카로 딱.` },
      { label: '7. 하이브리드 정숙성·연비', widget: 'MONTHLY_PAYMENT_HERO', pos: 'center', cam: 3, cropMode: 'drive',
        sub: (c) => `복합연비 최상위 · 정숙한 EV 모드 주행 퍼포먼스`,
        tts: (c) => `조용한 주행에 연비까지 잡았습니다.` },
      { label: '8. 할부·렌트·리스 최저금리', widget: 'VS_FINANCE_BATTLE', pos: 'center', cam: 0, cropMode: 'finance',
        sub: (c) => `초기비용 0원 무보증 · 전 금융사 최저금리 1:1 비교`,
        tts: (c) => `할부, 렌트, 리스 최저 금리로 맞춰드려요.` },
      { label: '9. 프리미엄 신차패키지 무상', widget: 'STOCK_COUNTDOWN', pos: 'bottom', cam: 1, cropMode: 'package',
        // 명함 혜택이 견본 그대로면 대본에 넣지 않음
        sub: (c, d) => { const dd = arDealerForCopy(d); return dd.promoTag ? `🎁 ${dd.promoTag}` : '계약 고객 혜택은 상담 때 안내해 드려요'; },
        tts: (c, d) => (arDealerForCopy(d).promoTag ? `계약 고객께 드리는 혜택도 준비했어요.` : `계약 고객 혜택은 상담 때 안내해 드려요.`) },
      { label: '10. 전시장 VIP 즉시출고 인도', widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2, cropMode: 'vip',
        sub: (c, d) => `${d.name} ${d.title} 전국 무료 캐리어 탁송 · 댓글 [견적]`,
        tts: (c, d) => `검수부터 탁송까지 끝까지 책임집니다.` }
    ];

    // 5번째 컷부터 쓸 문구: 자동차가 아닌 업종은 그 업종 프리셋 내용으로
    // 업종을 바꾸면 명함(4단계)에 예시 매장 정보(예: 음식점 "한옥 갈비 본점")가 들어가 있음.
    // 사장님이 아직 바꾸지 않은 예시 값은 대본·자막에 쓰지 않도록 빈 값으로 돌려줌 (자동차는 그대로)
    // 견본 딜러 3명의 혜택 문구 (처음 불러올 때 값, 업종 전환 전에도 견본으로 알아보기 위해 고정)
    const AR_DEMO_PROMO_TAGS = [
      '출고고객 전원 루마버텍스 썬팅 + 빌트인캠 무상지원',
      '11월 한정 추가할인 + 전국 무료 캐리어 탁송 지원',
      '1년/2만km 보증연장 + 엔진오일 쿠폰 무상 제공',
      // 가입 화면·체험 계정에 미리 채워 둔 견본 혜택
      '출고 고객 전원 프리미엄 썬팅 + 블랙박스 무상 지원',
      '출고 고객 전원 썬팅 + 블랙박스 무상'
    ];
    // 견본 딜러 3명의 소속 (예시 값이면 대본에 쓰지 않음)
    const AR_DEMO_BRANCHES = ['현대·기아 강남오토스퀘어', '기아 오토큐브 서초전시장', '현대·기아 법인특판 오토허브', '현대·기아 공식전시장', '현대자동차 도산대로점'];
    function arIsDemoPromo(v) { return AR_DEMO_PROMO_TAGS.includes(String(v || '').trim()); }
    // 영상 화면에 그릴 명함: 혜택이 견본 그대로면 비워서 🎁 혜택 장식이 나오지 않게 함 (원본 명함은 그대로 둠)
    function arDisplayDealer(d) {
      if (!d || !arIsDemoPromo(d.promoTag)) return d;
      const view = Object.create(d);
      view.promoTag = '';
      return view;
    }
    function arDealerForCopy(d) {
      const out = { name: (d && d.name) || '', title: (d && d.title) || '', branch: (d && d.branch) || '', promoTag: (d && d.promoTag) || '' };
      // 혜택 문구가 견본(자동차 견본 딜러·업종 예시) 그대로면 대본에 쓰지 않음 — 사장님이 직접 적은 혜택만 씀
      if (d && out.promoTag && AR_DEMO_PROMO_TAGS.includes(out.promoTag.trim())) out.promoTag = '';
      if (d && out.branch && AR_DEMO_BRANCHES.includes(out.branch.trim())) out.branch = '';
      if (!d || IND.key === 'auto') return out;
      if ((IND.storeNames || []).includes(out.name)) { out.name = ''; if (out.title === (IND.storeSubtitle || `${IND.place} 공식 안내`)) out.title = ''; }
      if (out.branch && (out.branch === IND.storeLocation || out.branch === IND.branchPlaceholder)) out.branch = '';
      if (out.promoTag && out.promoTag === IND.promoPlaceholder) out.promoTag = '';
      if (out.title && out.title === IND.title && !out.name) out.title = '';
      return out;
    }

    // 명함(4단계)을 모두 비워 두면 영상 끝 명함 화면과 마지막 멘트 없이 본편만 출력
    function arCardEmpty() {
      try {
        const d = getSelectedDealer();
        return !d || !['name', 'title', 'branch', 'phone', 'promoTag'].some((k) => String(d[k] || '').trim());
      } catch (e) { return false; }
    }

    function arExtraBp(idx) {
      if (IND.key === 'auto') return EXTRA_CUT_BLUEPRINTS[(idx - 4) % EXTRA_CUT_BLUEPRINTS.length];
      const strip = (x) => String(x || '').replace(/^✔\s*/, '');
      const list = [
        { widget: 'CHECKLIST_GLASS', pos: 'bottom', cam: 1, sub: (c) => strip((c.bullets || [])[2]) || c.discount, tts: (c) => `${strip((c.bullets || [])[2]) || '꼼꼼하게 준비했습니다'}.` },
        { widget: 'GIANT_DISCOUNT_STAMP', pos: 'center', cam: 2, sub: (c) => [c.priceLine, c.discount].filter(Boolean).join(' · '), tts: () => '혜택도 꼭 확인해 보세요.' },
        { widget: 'STOCK_COUNTDOWN', pos: 'bottom', cam: 3, sub: (c, d) => { const dd = arDealerForCopy(d); return dd.promoTag ? `🎁 ${dd.promoTag}` : '찾아 주시는 분께 드리는 혜택도 있어요'; }, tts: () => '찾아 주시는 분께 드리는 혜택도 있어요.' },
        { widget: 'LOWER_THIRD', pos: 'bottom', cam: 0, sub: (c, d) => { const dd = arDealerForCopy(d); return dd.name ? [`${dd.name} ${dd.title}`.trim(), dd.branch].filter(Boolean).join(' · ') : `${c.vehicle || IND.product} · ${IND.place}에서 만나요`; }, tts: () => `${IND.promise}.` },
        { widget: 'RECEIPT_QUOTE', pos: 'bottom', cam: 1, sub: () => '궁금한 점은 편하게 물어보세요', tts: () => '궁금한 점은 편하게 물어보세요.' },
        { widget: 'SMARTKEY_DELIVERY', pos: 'bottom', cam: 2, sub: () => `${IND.place}에서 기다릴게요`, tts: () => `${IND.place}에서 기다릴게요.` }
      ];
      return list[(idx - 4) % list.length];
    }

    // 4장의 기본 실사 화보를 기반으로 5~10번째 추가 컷 전용 고해상도 쇼룸 앵글/크롭/무드 화보 자동 합성
    function createSynthesizedCutImage(baseImg, cutIdx, labelText) {
      const off = document.createElement('canvas');
      off.width = 540;
      off.height = 960;
      const octx = off.getContext('2d');
      if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
        octx.save();
        // 각 추가 컷마다 다른 줌/앵글 포커스 부여
        const zoom = 1.18 + (cutIdx % 3) * 0.08;
        const offsetX = cutIdx % 2 === 0 ? -38 : 34;
        const offsetY = cutIdx % 3 === 0 ? -42 : 28;
        octx.translate(270 + offsetX, 480 + offsetY);
        octx.scale(zoom, zoom);
        octx.drawImage(baseImg, -270, -480, 540, 960);
        octx.restore();
      } else {
        const g = octx.createLinearGradient(0, 0, 0, 960);
        g.addColorStop(0, '#0f172a');
        g.addColorStop(1, '#020617');
        octx.fillStyle = g;
        octx.fillRect(0, 0, 540, 960);
      }
      // 컷별 쇼룸 무드 컬러 그레이딩 필터
      const tints = [
        'rgba(14, 116, 144, 0.24)',
        'rgba(30, 58, 138, 0.26)',
        'rgba(88, 28, 135, 0.22)',
        'rgba(6, 78, 59, 0.24)',
        'rgba(124, 45, 18, 0.22)',
        'rgba(15, 23, 42, 0.28)'
      ];
      octx.fillStyle = tints[(cutIdx - 4) % tints.length];
      octx.fillRect(0, 0, 540, 960);

      const dataUrl = off.toDataURL('image/jpeg', 0.86);
      const synthImg = new Image();
      synthImg.src = dataUrl;
      synthImg._label = labelText;
      synthImg._dataUrl = dataUrl;
      return synthImg;
    }

    // 현재 설정된 영상 시간(컷 수)에 맞춰 사진 배열·자막 배열·TTS 대본·UI 카드·썸네일을 동적 확장/동기화
    function syncDynamicCutCountAndPhotos() {
      const targetCuts = getTargetCutCount();
      const d = getSelectedDealer();
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const cutDur = mainDur / targetCuts;

      while (campaign.cutCaptions.length < targetCuts) {
        const idx = campaign.cutCaptions.length;
        const bp = arExtraBp(idx);
        campaign.cutCaptions.push(bp.sub(campaign, d));
      }
      if (!Array.isArray(campaign.ttsLines)) campaign.ttsLines = [];
      while (campaign.ttsLines.length < targetCuts) {
        const idx = campaign.ttsLines.length;
        if (idx < 4 && campaign.cutCaptions[idx]) {
          campaign.ttsLines.push(campaign.cutCaptions[idx]);
        } else {
          const bp = arExtraBp(idx);
          campaign.ttsLines.push(bp.tts(campaign, d));
        }
      }
      if (!Array.isArray(campaign.scenePlan)) campaign.scenePlan = [];
      while (campaign.scenePlan.length < targetCuts) {
        const idx = campaign.scenePlan.length;
        const bp = arExtraBp(idx);
        campaign.scenePlan.push({
          cut: idx + 1,
          widget: bp.widget,
          pos: bp.pos,
          cam: bp.cam
        });
      }

      // 썸네일 그리드 업데이트
      const thumbContainer = document.getElementById('aiPhotoThumbnails');
      if (thumbContainer && campaign.uploadedPhotos.length > 0) {
        thumbContainer.innerHTML = '';
        campaign.uploadedPhotos.forEach((imgObj, idx) => {
          const sceneUnit = mainDur / campaign.uploadedPhotos.length;
          const sceneStart = toRealTime(idx * sceneUnit);
          const sceneEnd = idx + 1 >= campaign.uploadedPhotos.length ? mainDur : toRealTime((idx + 1) * sceneUnit);
          const sTime = sceneStart.toFixed(1);
          const eTime = sceneEnd.toFixed(1);
          const label =
            imgObj._label ||
            (!campaign.isUserCustomPhotos && BUILT_IN_AI_CAR_PHOTOS[idx] && BUILT_IN_AI_CAR_PHOTOS[idx].label) ||
            `${idx + 1}. 컷 ${idx + 1}`;
          const srcUrl = imgObj._dataUrl || imgObj.src;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.onclick = () => seekToTime(sceneStart + 0.1);
          btn.className =
            'relative rounded-[8px] overflow-hidden border border-[var(--border)] hover:border-[#3b82f6] transition group aspect-[9/14] bg-black cursor-pointer';
          btn.innerHTML = `
            ${srcUrl ? `<img src="${srcUrl}" class="w-full h-full object-cover group-hover:scale-105 transition" />` : ''}
            <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#4cc38a]">${sTime}~${eTime}s</span>
            ${imgObj._isVideo ? '<span class="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-[#3b82f6] text-[10px] text-white">영상</span>' : ''}
            <span class="absolute bottom-0 inset-x-0 bg-black/80 text-[#ededed] text-[11px] py-0.5 text-center truncate px-1">${label}</span>
          `;
          thumbContainer.appendChild(btn);
        });
      }

      const statusEl = document.getElementById('photoUploadStatus');
      if (statusEl) {
        const sceneCount = campaign.uploadedPhotos.length;
        statusEl.textContent =
          `${campaign.isUserCustomPhotos ? '내가 올린' : '기본'} 사진·영상 ${sceneCount}개 · 대본 ${targetCuts}컷 · ${TOTAL_DURATION.toFixed(1)}초. ` +
          (sceneCount < targetCuts
            ? `같은 사진을 반복하지 않고 한 장면을 더 길게 보여 줍니다. ${targetCuts - sceneCount}개를 더 올리면 컷마다 다른 장면이 됩니다.`
            : '컷마다 다른 장면이 들어갑니다.');
      }

      // 동적 N컷(4~10컷) 자막 & 성우 대본 입력 카드 렌더링
      renderDynamicCutCardsUI();
    }

    function renderDynamicCutCardsUI() {
      const container = document.getElementById('dynamicCutCardsContainer');
      if (!container) return;
      const targetCuts = getTargetCutCount();
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const cutDur = mainDur / targetCuts;
      const photos = Array.isArray(campaign.uploadedPhotos) ? campaign.uploadedPhotos : [];
      const widgetKeys = typeof WIDGET_LABELS !== 'undefined' ? Object.keys(WIDGET_LABELS) : (WIDGET_POOL || []);
      const camNames = typeof CAMERA_NAMES !== 'undefined' ? CAMERA_NAMES : [];

      let html = '';
      let mediaHtml = '';
      for (let i = 0; i < targetCuts; i++) {
        const s = getCutStart(i).toFixed(1).replace(/\.0$/, '');
        const e = (getCutStart(i) + getCutLengths()[i]).toFixed(1).replace(/\.0$/, '');
        const plan = campaign.scenePlan[i] || {};
        const wKey = plan.widget || WIDGET_POOL[i % WIDGET_POOL.length];
        const rawWLabel = (typeof WIDGET_LABELS !== 'undefined' && WIDGET_LABELS[wKey]) || wKey;
        const wLabel = typeof indWord === 'function' ? indWord(rawWLabel) : rawWLabel;
        const subVal = (campaign.cutCaptions[i] || '').replace(/"/g, '&quot;');
        const ttsVal = ((campaign.ttsLines && campaign.ttsLines[i]) || campaign.cutCaptions[i] || '').replace(/"/g, '&quot;');

        const activePhotoIdx = (plan.photoIdx !== undefined && photos[plan.photoIdx])
          ? plan.photoIdx
          : (photos.length > 0 ? (i % photos.length) : -1);
        const activeImg = activePhotoIdx >= 0 ? photos[activePhotoIdx] : null;
        const thumbUrl = activeImg ? (activeImg._dataUrl || activeImg.src || '') : '';
        const seekSec = (getCutStart(i) + 0.1).toFixed(2);

        const photoOpts = photos.map((p, pIdx) => {
          const pLabel = (p && p._label) || `${pIdx + 1}. 장면 ${pIdx + 1}`;
          return `<option value="${pIdx}" ${pIdx === activePhotoIdx ? 'selected' : ''}>${pLabel}</option>`;
        }).join('');

        const widgetOpts = widgetKeys.map((wk) => {
          const lbl = typeof indWord === 'function' ? indWord(WIDGET_LABELS[wk] || wk) : (WIDGET_LABELS[wk] || wk);
          return `<option value="${wk}" ${wk === wKey ? 'selected' : ''}>${lbl}</option>`;
        }).join('');

        const curCam = plan.customCam !== undefined ? String(plan.customCam) : 'auto';
        const camOpts = `<option value="auto" ${curCam === 'auto' ? 'selected' : ''}>모션: 자동</option>` +
          camNames.map((cn, cIdx) => `<option value="${cIdx}" ${curCam === String(cIdx) ? 'selected' : ''}>모션: ${cn}</option>`).join('');

        // 대본 탭: 컷별 헤드라인·성우 대사만 (사진·화면·모션은 사진 탭)
        html += `
          <div class="p-3 rounded-[8px] bg-[#141415] border border-[var(--border)] space-y-1.5">
            <button type="button" onclick="seekToTime(${seekSec})" id="cutTimeLabel${i}" class="font-mono text-[12px] text-[#ededed] font-medium hover:text-[#38bdf8] cursor-pointer" title="이 장면(${s}초)으로 미리보기 이동">CUT ${i + 1} (${s}~${e}초)</button>
            <input id="cutSub${i}" type="text" value="${subVal}" oninput="updateCustomCutCaptions()" placeholder="${i + 1}컷 화면 헤드라인" class="studio-input w-full h-8 px-2.5 text-[12px]" />
            <input id="cutTts${i}" type="text" value="${ttsVal}" oninput="updateCustomCutCaptions()" placeholder="${i + 1}컷 성우 대사 (짧을수록 영상이 짧아집니다)" title="숫자가 다르게 읽히면 한글로 적어 주세요. 예: 네 대" class="studio-input w-full h-7 px-2.5 text-[11px] text-[#a1a1a6]" />
          </div>
        `;
        // 사진 탭: 컷별 사진/영상 · 화면 디자인 · 카메라 모션
        mediaHtml += `
          <div class="p-3 rounded-[8px] bg-[#141415] border border-[var(--border)] space-y-2">
            <div class="flex items-start gap-2.5">
              <button type="button" onclick="seekToTime(${seekSec})" title="이 장면(${s}초)으로 미리보기 이동" class="w-10 aspect-[9/14] rounded-[6px] overflow-hidden border border-[var(--border)] hover:border-[#3b82f6] bg-black shrink-0 cursor-pointer relative">
                ${thumbUrl ? `<img src="${thumbUrl}" class="w-full h-full object-cover" />` : ''}
                ${activeImg && activeImg._isVideo ? '<span class="absolute bottom-0 inset-x-0 bg-[#3b82f6]/90 text-[8px] text-white text-center">영상</span>' : ''}
              </button>
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-center justify-between gap-1 text-[12px]">
                  <span class="font-mono text-[#ededed] font-medium">CUT ${i + 1} (${s}~${e}초)</span>
                  <div class="flex items-center gap-1">
                    <span id="cutWidgetBadge${i}" class="font-mono text-[10px] text-[#85858b] truncate max-w-[110px]">${wLabel}</span>
                    <button type="button" onclick="cycleCutDesign(${i})" class="px-1.5 py-0.5 rounded bg-[#232325] hover:bg-[#3b82f6] text-[10px] font-mono text-[#ededed] cursor-pointer" title="누를 때마다 이 컷의 디자인을 바꾸고 바로 미리보기로 보여줍니다">
                      변경
                    </button>
                  </div>
                </div>
                <p class="text-[12px] text-[#a1a1a6] truncate">${subVal || '(대본 탭에서 문구를 적어 주세요)'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-[#222225]">
              <label class="h-7 px-2 rounded-[6px] bg-[#1e1e22] hover:bg-[#2a2a30] border border-[var(--border)] text-[11px] text-[#d4d4d8] flex items-center justify-center cursor-pointer truncate" title="이 컷만 내 사진 또는 영상으로 교체">
                사진/영상 변경
                <input type="file" accept="image/*,video/*" class="hidden" onchange="replaceCutMedia(${i}, event)" />
              </label>
              <select onchange="pickCutDefaultPhoto(${i}, this.value)" title="이 컷의 기본 이미지 선택" class="studio-input h-7 px-1.5 text-[11px] bg-[#1a1a1d] text-[#d4d4d8] cursor-pointer">
                ${photoOpts || '<option value="0">기본 장면</option>'}
              </select>
              <select id="cutWidgetSelect${i}" onchange="updateCutSceneSetting(${i}, 'widget', this.value)" title="이 컷의 화면 위젯/디자인 변경" class="studio-input h-7 px-1.5 text-[11px] bg-[#1a1a1d] text-[#d4d4d8] cursor-pointer">
                ${widgetOpts}
              </select>
              <select onchange="updateCutSceneSetting(${i}, 'customCam', this.value)" title="이 컷의 카메라 모션 변경" class="studio-input h-7 px-1.5 text-[11px] bg-[#1a1a1d] text-[#d4d4d8] cursor-pointer">
                ${camOpts}
              </select>
            </div>
          </div>
        `;
      }
      container.innerHTML = html;
      const mediaBox = document.getElementById('cutMediaCardsContainer');
      if (mediaBox) mediaBox.innerHTML = mediaHtml;
    }

    // ============================================================================
    // 영상 총 길이(8초 / 12초 / 15초 / 20초 / 30초 / 직접 입력) 동적 변경 컨트롤러
    // ============================================================================
    // ------------------------------------------------------------------------
    // 컷별 길이: 성우가 한 문장을 말하는 시간만큼 그 컷이 이어짐 (문장마다 길이가 다름)
    //  - 화면 그리기 코드는 "모든 컷 길이가 같은" 가상 시간으로 짜여 있으므로,
    //    실제 시간 ↔ 가상 시간을 컷 단위로 변환해서 씁니다.
    // ------------------------------------------------------------------------
    let CUT_LENGTHS = []; // 컷별 실제 길이(초). 비어 있으면 모든 컷이 같은 길이

    function getMainDuration() {
      return Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
    }
    function getCutLengths() {
      const n = getTargetCutCount();
      if (CUT_LENGTHS.length === n) return CUT_LENGTHS;
      return new Array(n).fill(getMainDuration() / n);
    }
    function getCutStart(cutIdx) {
      const lengths = getCutLengths();
      let start = 0;
      for (let i = 0; i < Math.min(cutIdx, lengths.length); i++) start += lengths[i];
      return start;
    }
    function getCutIndexAt(realT) {
      const lengths = getCutLengths();
      let acc = 0;
      for (let i = 0; i < lengths.length; i++) {
        acc += lengths[i];
        if (realT < acc) return i;
      }
      return lengths.length - 1;
    }
    // 실제 시간 → 가상 시간 (본편 구간만 변환, 명함 구간은 그대로)
    function toVirtualTime(realT) {
      const main = getMainDuration();
      if (realT >= main) return realT;
      const lengths = getCutLengths();
      const unit = main / lengths.length;
      const i = getCutIndexAt(realT);
      const frac = Math.min(1, Math.max(0, (realT - getCutStart(i)) / Math.max(0.05, lengths[i])));
      return Math.min(main - 0.0001, (i + frac) * unit);
    }
    // 가상 시간 → 실제 시간
    function toRealTime(virtualT) {
      const main = getMainDuration();
      if (virtualT >= main) return virtualT;
      const lengths = getCutLengths();
      const unit = main / lengths.length;
      const i = Math.min(lengths.length - 1, Math.max(0, Math.floor(virtualT / unit)));
      return getCutStart(i) + ((virtualT - i * unit) / unit) * lengths[i];
    }

    // AudioEngine은 아래에서 선언되므로, 초기화 도중 호출돼도 안전하게 확인
    function audioEngineReady() {
      try { return !!AudioEngine; } catch (e) { return false; }
    }

    // 선택한 길이와 성우 음성 길이로 실제 영상 길이를 계산
    //  - 컷 길이는 가장 긴 성우 문장이 끝까지 나올 만큼 확보 (음성이 중간에 잘리지 않도록)
    function computeFittedDurations() {
      const baseOutro = BASE_DURATION <= 8 ? 2.4 : BASE_DURATION >= 20 ? 4.0 : 3.5;
      const cuts = getTargetCutCount();
      let mainDur = Math.max(4.0, BASE_DURATION - baseOutro);
      let outro = baseOutro;
      let lengths = [];
      if (audioEngineReady() && AudioEngine.enabled && AudioEngine.ttsVoice !== 'off') {
        const secs = AudioEngine.getNarrationSeconds();
        const cutSecs = secs.slice(0, cuts);
        const outroSec = secs[cuts] || 0;

        if (cutSecs.length === cuts && cutSecs.every((x) => x > 0)) {
          lengths = cutSecs.map((x) => Math.max(1.5, x + 0.25));
          const need = lengths.reduce((p, q) => p + q, 0);
          if (need < mainDur) {
            lengths = lengths.map((x) => (x * mainDur) / need);
          } else {
            mainDur = need;
          }
        } else {
          const longestCut = Math.max(0, ...cutSecs);
          if (longestCut > 0) mainDur = Math.max(mainDur, cuts * (longestCut + 0.3));
        }

        // 마지막 엔딩 명함 멘트 길이 확보 (음성이 완전히 끝나고도 2.2초 이상 유지 -> 절대 잘리지 않음!)
        if (outroSec > 0) {
          outro = Math.max(outro, outroSec + 2.2);
        } else {
          outro = Math.max(outro, 4.2); // 멘트 길이를 아직 모를 때도 4.2초 이상 확보
        }

        // 원테이크 마스터 음성이 있을 때:
        if (AudioEngine.masterBuffer && AudioEngine.masterDuration > 0) {
          const masterDur = AudioEngine.masterDuration;
          const targetTotal = Math.max(BASE_DURATION, masterDur + 2.4);
          if (mainDur + outro < targetTotal) {
            outro = Math.max(outro, targetTotal - mainDur);
          }
        }
      }
      // 명함이 비었으면 명함 화면 없이: 고른 길이는 본편으로 채우고, 한 호흡 음성이 끝까지 들어가게 확보
      if (arCardEmpty()) {
        outro = 0;
        mainDur = Math.max(mainDur, BASE_DURATION);
        const masterDur = audioEngineReady() && AudioEngine.enabled && AudioEngine.masterBuffer ? AudioEngine.masterDuration : 0;
        if (masterDur > 0) mainDur = Math.max(mainDur, masterDur + 0.6);
      }
      const total = Math.round((mainDur + outro) * 10) / 10;
      const outroRounded = Math.round(outro * 10) / 10;
      // 반올림한 전체 길이에 컷 길이 합이 정확히 맞도록 보정
      if (lengths.length > 0) {
        const main = Math.max(4.0, total - outroRounded);
        const sum = lengths.reduce((p, q) => p + q, 0);
        lengths = lengths.map((x) => (x * main) / sum);
      }
      return { total, outro: outroRounded, lengths };
    }

    // 성우 음성을 새로 받았을 때 호출: 길이가 달라졌으면 영상 길이를 다시 맞춤
    function refitDurationToNarration() {
      const fit = computeFittedDurations();
      const sameLengths =
        fit.lengths.length === CUT_LENGTHS.length && fit.lengths.every((x, i) => Math.abs(x - CUT_LENGTHS[i]) < 0.03);
      if (sameLengths && Math.abs(fit.total - TOTAL_DURATION) < 0.05 && Math.abs(fit.outro - OUTRO_DURATION) < 0.05) return false;
      applyVideoDurations();
      if (audioEngineReady()) {
        AudioEngine.stopTts();
        AudioEngine.lastSpokenCut = -1;
      }
      if (window.__timelines && window.__timelines['main']) window.__timelines['main'].seek(0);
      return true;
    }

    function setVideoTotalDuration(sec) {
      BASE_DURATION = Math.max(6, Math.min(60, Number(sec) || 12));
      applyVideoDurations();
      // 컷 수가 바뀌면 새 컷의 성우 음성을 받아 길이를 다시 맞춤
      if (audioEngineReady() && AudioEngine.enabled) AudioEngine.prefetchTtsBuffers();
    }

    function applyVideoDurations() {
      const fitted = computeFittedDurations();
      TOTAL_DURATION = fitted.total;
      OUTRO_DURATION = fitted.outro;
      CUT_LENGTHS = fitted.lengths;
      setTimeout(() => {
        try { renderDesignStylePicker(); } catch (e) {}
      }, 0);
      const fitNotice = document.getElementById('narrationFitNotice');
      if (fitNotice) {
        if (TOTAL_DURATION > BASE_DURATION + 0.4) {
          fitNotice.textContent = `성우 음성이 잘리지 않도록 ${Math.round(BASE_DURATION)}초 → ${TOTAL_DURATION.toFixed(1)}초로 늘렸습니다. 성우 대본을 짧게 줄이면 영상도 짧아집니다.`;
          fitNotice.classList.remove('hidden');
        } else {
          fitNotice.classList.add('hidden');
        }
      }
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const targetCuts = getTargetCutCount();
      const cutDur = mainDur / targetCuts;
      if (typeof window.__arPinnedCut === 'number' && window.__arPinnedCut >= targetCuts) {
        window.__arPinnedCut = -1;
        window.__arSelectedOverlayIdx = -1;
      }
      if (typeof renderPreviewCutPinBar === 'function') renderPreviewCutPinBar();

      if (window.__timelines && window.__timelines['main']) {
        window.__timelines['main'].duration = TOTAL_DURATION;
      }
      const slider = document.getElementById('timelineSlider');
      if (slider) {
        slider.max = String(TOTAL_DURATION);
      }
      const sel = document.getElementById('durationSelect');
      if (sel && [8, 12, 15, 20, 30].includes(Math.round(BASE_DURATION))) {
        sel.value = String(Math.round(BASE_DURATION));
      }
      const customIn = document.getElementById('customDurationInput');
      if (customIn) {
        customIn.value = String(Math.round(BASE_DURATION));
      }

      // 상단 빠른 시간 버튼 하이라이트 동기화
      [8, 12, 15, 20, 30].forEach((dVal) => {
        const btn = document.getElementById(`durBtn_${dVal}`);
        if (btn) {
          if (Math.round(BASE_DURATION) === dVal) {
            btn.className = 'h-6 px-2 rounded-[5px] text-[11px] font-mono bg-[#3b82f6] text-white cursor-pointer';
          } else {
            btn.className = 'h-6 px-2 rounded-[5px] text-[11px] font-mono text-[#a1a1a6] hover:text-[#ededed] cursor-pointer';
          }
        }
      });

      // 점프 버튼 업데이트
      const jb0 = document.getElementById('jumpBtn0');
      const jb1 = document.getElementById('jumpBtn1');
      const jb2 = document.getElementById('jumpBtn2');
      if (jb0) {
        jb0.textContent = '처음';
        jb0.onclick = () => seekToTime(0.2);
      }
      if (jb1) {
        jb1.textContent = `본편 ${targetCuts}컷`;
        jb1.onclick = () => seekToTime(mainDur * 0.45);
      }
      if (jb2) {
        jb2.textContent = '명함';
        jb2.onclick = () => seekToTime(mainDur + 0.3);
      }

      const expText = document.getElementById('exportBtnText');
      if (expText) {
        expText.textContent = `영상 만들기 · ${Math.round(TOTAL_DURATION)}초`;
      }

      // 시간 변경에 맞춰 사진 개수(4~10장) 및 컷 대본 카드 자동 확장
      syncDynamicCutCountAndPhotos();
      syncScenePlanUI();

      if (window.__timelines && window.__timelines['main']) {
        const cur = Math.min(window.__timelines['main'].currentTime, TOTAL_DURATION - 0.1);
        window.__timelines['main'].seek(cur);
      }
    }
