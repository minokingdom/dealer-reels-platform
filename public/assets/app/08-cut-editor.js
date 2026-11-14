// AutoReels — 08-cut-editor.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    function renderMotionOutro(c, W, H, t, mainDuration, d, sp) {
      if (sp.insta) return renderInstaOutro(c, W, H, t, mainDuration, d, sp);
      const lt = t - mainDuration;
      const e = mClamp(lt / 1.2);
      mBg(c, W, H, sp, t);
      const fg = sp.light ? '#111111' : '#ffffff';
      // 돌아가는 도형 고리
      c.save();
      c.translate(W / 2, H * 0.3);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + t * 0.6;
        const r = 120 + Math.sin(t * 2 + i) * 6;
        c.globalAlpha = 0.85 * mEase((lt - i * 0.03) / 0.4);
        c.fillStyle = i % 3 === 0 ? sp.accent : i % 3 === 1 ? sp.accent2 : (sp.light ? '#11111133' : '#ffffff33');
        c.beginPath();
        if (i % 2) c.arc(Math.cos(a) * r, Math.sin(a) * r, 8, 0, Math.PI * 2);
        else c.rect(Math.cos(a) * r - 7, Math.sin(a) * r - 7, 14, 14);
        c.fill();
      }
      c.globalAlpha = 1;
      const s = gBack(mClamp(lt / 0.5));
      c.scale(s, s);
      c.beginPath();
      c.arc(0, 0, 74, 0, Math.PI * 2);
      c.fillStyle = sp.accent;
      c.fill();
      c.fillStyle = kTextOn(sp.accent);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = gFont(900, 60, GENRE_FONTS.sans);
      c.fillText(String((d && d.name) || '').slice(0, 1), 0, 4);
      c.restore();
      // 이름: 아래에서 위로 걷히며 나타남
      const ny = H * 0.53;
      c.save();
      c.beginPath();
      c.rect(0, ny - 50, W, 100);
      c.clip();
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = fg;
      const off = (1 - mEase((lt - 0.2) / 0.5)) * 90;
      gDrawLine(c, (d && d.name) || '', W / 2, ny + off, W - 60, 56, 30, GENRE_FONTS.sans, 900);
      c.restore();
      c.textAlign = 'center';
      c.globalAlpha = mEase((lt - 0.4) / 0.4);
      c.fillStyle = sp.accent;
      c.font = gFont(700, 18, GENRE_FONTS.sans);
      gDrawLine(c, `${(d && d.title) || ''}${d && d.branch ? ' · ' + d.branch : ''}`, W / 2, ny + 52, W - 60, 18, 12, GENRE_FONTS.sans, 700);
      c.fillStyle = sp.light ? '#333333' : '#d4d4d8';
      gDrawLine(c, arPriceLine(), W / 2, ny + 100, W - 80, 26, 14, GENRE_FONTS.sans, 800);
      // 매장 업종: 주소·전화번호 안내 (자동차 영업은 전화번호를 넣지 않음)
      if (typeof IND !== 'undefined' && IND.key !== 'auto') {
        const addr = String((d && d.branch) || '').trim();
        const phone = String((d && d.phone) || '').trim();
        c.globalAlpha = mEase((lt - 0.5) / 0.4);
        c.fillStyle = sp.light ? '#333333' : '#e4e4e7';
        if (addr) gDrawLine(c, `📍 ${addr}`, W / 2, ny + 140, W - 70, 17, 12, GENRE_FONTS.sans, 600);
        if (phone) { c.fillStyle = sp.accent; gDrawLine(c, `📞 예약·문의 ${phone}`, W / 2, ny + 172, W - 70, 22, 14, GENRE_FONTS.sans, 800); }
      }
      // 댓글 안내
      const pulse = 1 + Math.sin(t * 5) * 0.025;
      c.globalAlpha = mEase((lt - 0.6) / 0.4);
      c.save();
      c.translate(W / 2, H * 0.8);
      c.scale(pulse, pulse);
      gRoundRect(c, -W * 0.36, -32, W * 0.72, 64, 32);
      c.fillStyle = sp.light ? '#111111' : '#ffffff';
      c.fill();
      c.fillStyle = sp.light ? '#ffffff' : '#111111';
      c.textBaseline = 'middle';
      gDrawLine(c, arCta(), 0, 2, W * 0.66, 24, 14, GENRE_FONTS.sans, 800);
      c.restore();
      c.globalAlpha = 1;
    }

    // 구도를 바꾼 컷을 그릴 때 쓸 키트 디자인: 같은 분류의 키트 디자인, 없으면 첫 키트 디자인 (글꼴은 미리 불러 둠)
    function arCutKitDesign(design) {
      const kits = DESIGN_STYLES.filter((x) => x.engine === 'kit');
      const kd = kits.find((x) => x.cat === design.cat) || kits[0];
      if (kd && !kd._fontsAsked && typeof kitEnsureFont === 'function') {
        kd._fontsAsked = true;
        Promise.all([kd.font, kd.sfont, 'brush'].filter(Boolean).map(kitEnsureFont)).then(() => {
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        }).catch(() => {});
      }
      return kd;
    }
    // 컷별 꾸밈효과 + 인스타 스타일 글씨/스티커 오버레이 + 미리보기 컷 번호 고정
    const CUT_DECO_OPTIONS = [
      { id: 'none', label: '없음' },
      { id: 'sparkle', label: '✨ 반짝이' },
      { id: 'confetti', label: '🎉 콘페티' },
      { id: 'leak', label: '☀️ 빛 번짐' },
      { id: 'grain', label: '🎞️ 그레인' },
      { id: 'shapes', label: '🔷 모션 도형' },
      { id: 'camera', label: '📷 카메라' },
      { id: 'dots', label: '● 도트' },
      { id: 'snow', label: '❄️ 눈꽃' },
      { id: 'petals', label: '🌸 꽃잎' },
      { id: 'bubbles', label: '🫧 버블' },
      { id: 'bokeh', label: '🌟 보케' },
      { id: 'hearts', label: '💖 하트비' },
      { id: 'sparks', label: '🔥 스파크' },
      { id: 'scanline', label: '⚡ 스캔라인' },
      { id: 'prism', label: '🌈 프리즘' }
    ];
    const CUT_TEXT_FONTS = [
      { id: 'sans', label: '모던', css: "'Pretendard', 'Noto Sans KR', sans-serif", weight: 800 },
      { id: 'dohyeon', label: '릴스', css: "'Do Hyeon', 'Noto Sans KR', sans-serif", weight: 400 },
      { id: 'blackhan', label: '임팩트', css: "'Pretendard Variable', 'Pretendard', sans-serif", weight: 900 },
      { id: 'bagel', label: '통통', css: "'Jua', 'Do Hyeon', sans-serif", weight: 400 },
      { id: 'jua', label: '동글', css: "'Jua', sans-serif", weight: 400 },
      { id: 'gugi', label: '레트로', css: "'Gugi', sans-serif", weight: 400 },
      { id: 'singleday', label: '다이어리', css: "'Single Day', cursive", weight: 400 },
      { id: 'himelody', label: '멜로디', css: "'Hi Melody', cursive", weight: 400 },
      { id: 'dokdo', label: '캘리', css: "'East Sea Dokdo', cursive", weight: 400 },
      { id: 'serif', label: '명조', css: "'Noto Serif KR', serif", weight: 900 },
      { id: 'batang', label: '감성', css: "'Gowun Batang', serif", weight: 700 },
      { id: 'pen', label: '손글씨', css: "'Nanum Pen Script', cursive", weight: 400 },
      { id: 'brush', label: '붓글씨', css: "'Nanum Brush Script', cursive", weight: 400 },
      { id: 'script', label: 'Script', css: "'Great Vibes', 'Pinyon Script', cursive", weight: 400 }
    ];
    const CUT_TEXT_STYLES = [
      { id: 'box', label: '박스' },
      { id: 'softbox', label: '반투명' },
      { id: 'outline', label: '외곽선' },
      { id: 'neon', label: '네온' },
      { id: 'highlight', label: '형광펜' },
      { id: 'clean', label: '기본' }
    ];
    const CUT_TEXT_ALIGNS = [
      { id: 'center', label: '중앙' },
      { id: 'left', label: '왼쪽' },
      { id: 'right', label: '오른쪽' }
    ];
    const CUT_TEXT_COLORS = ['#ffffff', '#09090b', '#facc15', '#fb7185', '#ef4444', '#f97316', '#38bdf8', '#3b82f6', '#34d399', '#a3e635', '#c084fc', '#f472b6'];
    const CUT_STICKER_WIDGETS = [
      { key: 'loc', label: '📍 위치 태그', sub: 'SEOUL · HOT', bg: 'linear-gradient(90deg,#ec4899,#8b5cf6)' },
      { key: 'time', label: '🕒 시간 스탬프', sub: 'NOW · LIVE', bg: '#18181b' },
      { key: 'date', label: '📅 날짜 카드', sub: 'TODAY EDITION', bg: '#27272a' },
      { key: 'music', label: '🎵 뮤직 플레이어', sub: 'Now Playing', bg: '#0f172a' },
      { key: 'poll', label: '📊 투표 스티커', sub: '좋아요 | 궁금해요', bg: '#3f3f46' },
      { key: 'slider', label: '😍 만족 슬라이더', sub: '100% 추천', bg: '#7c2d12' },
      { key: 'tag', label: '🏷️ 특가 행택', sub: 'SPECIAL PRICE', bg: '#ca8a04' },
      { key: 'stars5', label: '★ 5.0 리뷰', sub: '★★★★★', bg: '#18181b' },
      { key: 'dm', label: '💬 DM 질문박스', sub: '편하게 문의', bg: '#312e81' },
      { key: 'follow', label: '🔔 팔로우 알림', sub: '+ FOLLOW', bg: '#be185d' },
      { key: 'dday', label: '🔥 타임세일', sub: 'TODAY ONLY', bg: '#991b1b' },
      { key: 'verified', label: '✅ 100% 정품', sub: 'VERIFIED', bg: '#065f46' },
      { key: 'rec', label: '● REC VLOG', sub: '4K · 60FPS', bg: '#7f1d1d' },
      { key: 'open', label: '☕ OPEN 사인', sub: 'WELCOME', bg: '#1e293b' },
      { key: 'gift', label: '🎁 선착순 혜택', sub: 'EVENT GIFT', bg: '#581c87' },
      { key: 'ready', label: '⚡ 즉시 가능', sub: 'FAST BOOKING', bg: '#0e7490' }
    ];
    const CUT_STICKER_FRAMES = [
      { key: 'viewfinder', label: '📷 뷰파인더', sub: 'REC ● 4K' },
      { key: 'film', label: '🎞️ 필름 프레임', sub: 'KODAK 400' },
      { key: 'polaroid', label: '🖼️ 폴라로이드', sub: 'MEMORIES' },
      { key: 'magazine', label: '📰 매거진 커버', sub: 'EDITION' },
      { key: 'cinema', label: '🎬 시네마 바', sub: '21:9 WIDE' },
      { key: 'sparkleBorder', label: '✨ 글리터 테두리', sub: 'GLOW' },
      { key: 'tape', label: '🏷️ 마스킹 테이프', sub: 'DIARY' },
      { key: 'noneFrame', label: '✕ 프레임 제거', sub: 'CLEAR' }
    ];
    const CUT_STICKER_DOODLES = [
      { key: 'sparkle3', label: '스파클', color: '#ffffff' },
      { key: 'sparkleGold', label: '골드빛', color: '#facc15' },
      { key: 'sparklePink', label: '핑크빛', color: '#fb7185' },
      { key: 'sparkleMint', label: '민트빛', color: '#34d399' },
      { key: 'arrow', label: '화살표', color: '#ffffff' },
      { key: 'arrowPink', label: '핑크화살', color: '#fb7185' },
      { key: 'arrowGold', label: '골드화살', color: '#facc15' },
      { key: 'doubleArrow', label: '더블화살', color: '#38bdf8' },
      { key: 'heart', label: '라인하트', color: '#fb7185' },
      { key: 'heartFill', label: '채움하트', color: '#ef4444' },
      { key: 'underline', label: '골드물결', color: '#facc15' },
      { key: 'underlineWhite', label: '화이트물결', color: '#ffffff' },
      { key: 'check', label: '체크도장', color: '#34d399' },
      { key: 'crown', label: '왕관', color: '#facc15' },
      { key: 'bang', label: '강조 !!', color: '#facc15' },
      { key: 'circleMark', label: '강조원', color: '#fb7185' }
    ];
    const CUT_STICKER_EMOJIS = [
      '✨', '🔥', '💖', '⭐', '🎉', '👑', '💯',
      '👇', '👉', '👆', '📌', '💎', '🌸', '🍀',
      '⚡', '💥', '🎯', '🎁', '☕', '🍰', '🚗',
      '💅', '🏋️', '🏠', '📸', '🎵', '🫶', '🥳',
      '🤍', '🖤', '💛', '🩵', '🩷', '🌟', '🫧',
      '🦋', '🌷', '🍓', '🥂', '🎬', '🛍️', '🏷️',
      '📍', '🕒', '🔔', '💬', '👍', '👏', '🙌',
      '😍', '🤩', '😎', '🥹', '🤍', '✅', '🚀'
    ];
    const CUT_STICKER_BADGES = [
      { text: 'NEW', bg: '#ef4444', fg: '#ffffff' },
      { text: 'BEST', bg: '#facc15', fg: '#09090b' },
      { text: 'HOT 🔥', bg: '#f97316', fg: '#ffffff' },
      { text: 'SALE', bg: '#ec4899', fg: '#ffffff' },
      { text: 'EVENT', bg: '#8b5cf6', fg: '#ffffff' },
      { text: '추천!', bg: '#38bdf8', fg: '#09090b' },
      { text: '예약중', bg: '#10b981', fg: '#09090b' },
      { text: '한정수량', bg: '#18181b', fg: '#fde047' },
      { text: '오늘만', bg: '#ffffff', fg: '#09090b' },
      { text: '무료배송', bg: '#2563eb', fg: '#ffffff' },
      { text: 'DM문의', bg: '#db2777', fg: '#ffffff' },
      { text: 'SOLD OUT', bg: '#27272a', fg: '#f87171' },
      { text: '1 + 1', bg: '#f43f5e', fg: '#ffffff' },
      { text: 'VIP', bg: '#18181b', fg: '#facc15' },
      { text: 'PICK ✨', bg: '#6366f1', fg: '#ffffff' },
      { text: '인기폭발', bg: '#ea580c', fg: '#ffffff' },
      { text: '마감임박', bg: '#dc2626', fg: '#ffffff' },
      { text: '할인특가', bg: '#eab308', fg: '#09090b' },
      { text: '오픈런', bg: '#0ea5e9', fg: '#ffffff' },
      { text: '재입고', bg: '#14b8a6', fg: '#09090b' },
      { text: '실물깡패', bg: '#ec4899', fg: '#ffffff' },
      { text: '단독특가', bg: '#7c3aed', fg: '#ffffff' },
      { text: '당일발송', bg: '#059669', fg: '#ffffff' },
      { text: '선착순', bg: '#f59e0b', fg: '#09090b' }
    ];
    const CUT_FILTER_OPTIONS = [
      { id: 'none', label: '원본', swatch: '#52525b', tint: '' },
      { id: 'clear', label: '맑은톤', swatch: '#bae6fd', tint: 'rgba(224,242,254,0.14)', mode: 'screen' },
      { id: 'warm', label: '따뜻함', swatch: '#fdba74', tint: 'rgba(251,146,60,0.18)', mode: 'soft-light' },
      { id: 'golden', label: '골든아워', swatch: '#f59e0b', tint: 'rgba(245,158,11,0.22)', mode: 'soft-light' },
      { id: 'cinema', label: '시네마', swatch: '#166534', tint: 'rgba(20,83,45,0.2)', mode: 'overlay' },
      { id: 'cool', label: '쿨블루', swatch: '#38bdf8', tint: 'rgba(56,189,248,0.16)', mode: 'soft-light' },
      { id: 'mono', label: '흑백', swatch: '#a1a1aa', mono: true },
      { id: 'vivid', label: '비비드', swatch: '#ec4899', tint: 'rgba(236,72,153,0.14)', mode: 'overlay' },
      { id: 'pastel', label: '파스텔', swatch: '#fde047', tint: 'rgba(253,224,71,0.14)', mode: 'screen' },
      { id: 'rose', label: '로즈핑크', swatch: '#fb7185', tint: 'rgba(251,113,133,0.16)', mode: 'soft-light' },
      { id: 'emerald', label: '에메랄드', swatch: '#10b981', tint: 'rgba(16,185,129,0.15)', mode: 'soft-light' },
      { id: 'vintage', label: '빈티지', swatch: '#a16207', tint: 'rgba(161,98,7,0.22)', mode: 'overlay' },
      { id: 'sepia', label: '세피아', swatch: '#92400e', tint: 'rgba(146,64,14,0.26)', mode: 'color' },
      { id: 'glow', label: '소프트', swatch: '#fef08a', tint: 'rgba(255,255,255,0.14)', mode: 'screen' },
      { id: 'contrast', label: '선명대비', swatch: '#27272a', tint: 'rgba(0,0,0,0.2)', mode: 'overlay' },
      { id: 'mood', label: '무드다크', swatch: '#09090b', tint: 'rgba(9,9,11,0.34)', mode: 'multiply' }
    ];
    const AR_ELEMENT_ANIMS = [
      { id: 'default',    label: '스타일 기본',     group: 'base' },
      { id: 'none',       label: '없음(고정)',      group: 'base' },
      { id: 'fadeIn',     label: '페이드인',        group: 'in' },
      { id: 'slideUp',    label: '위로 슬라이드',   group: 'in' },
      { id: 'slideDown',  label: '아래로 슬라이드', group: 'in' },
      { id: 'slideLeft',  label: '왼쪽 슬라이드',   group: 'in' },
      { id: 'slideRight', label: '오른쪽 슬라이드', group: 'in' },
      { id: 'pop',        label: '팝(탄성)',        group: 'in' },
      { id: 'bounce',     label: '바운스',          group: 'in' },
      { id: 'zoomIn',     label: '줌인',            group: 'in' },
      { id: 'zoomOut',    label: '줌아웃',          group: 'in' },
      { id: 'blurIn',     label: '블러 인',         group: 'in' },
      { id: 'wipe',       label: '가로 와이프',     group: 'in' },
      { id: 'typewriter', label: '타자기',          group: 'in' },
      { id: 'flip',       label: '플립 회전',       group: 'in' },
      { id: 'drop',       label: '드롭 낙하',       group: 'in' },
      { id: 'float',      label: '둥실둥실',        group: 'loop' },
      { id: 'pulse',      label: '두근두근',        group: 'loop' },
      { id: 'wiggle',     label: '흔들흔들',        group: 'loop' },
      { id: 'glow',       label: '글로우',          group: 'loop' }
    ];
    window.AR_ELEMENT_ANIMS = AR_ELEMENT_ANIMS;

    const CUT_OVERLAY_ANIMS = [
      { id: 'static',     label: '고정' },
      { id: 'pop',        label: '팝(탄성)' },
      { id: 'bounce',     label: '바운스' },
      { id: 'slideUp',    label: '위로 슬라이드' },
      { id: 'slideDown',  label: '아래로 슬라이드' },
      { id: 'slideLeft',  label: '왼쪽 슬라이드' },
      { id: 'slideRight', label: '오른쪽 슬라이드' },
      { id: 'fadeIn',     label: '페이드인' },
      { id: 'zoomIn',     label: '줌인' },
      { id: 'zoomOut',    label: '줌아웃' },
      { id: 'blurIn',     label: '블러 인' },
      { id: 'wipe',       label: '와이프' },
      { id: 'typewriter', label: '타자기' },
      { id: 'flip',       label: '플립' },
      { id: 'drop',       label: '드롭' },
      { id: 'float',      label: '둥실둥실' },
      { id: 'pulse',      label: '두근두근' },
      { id: 'wiggle',     label: '흔들흔들' },
      { id: 'glow',       label: '글로우' }
    ];

    const AR_ELEMENT_BOX_STYLES = [
      { id: 'default',    label: '스타일 기본' },
      { id: 'darkGlass',  label: '다크 글래스' },
      { id: 'solidBadge', label: '컬러 배지' },
      { id: 'outlineBox', label: '테두리 박스' },
      { id: 'softBox',    label: '반투명 박스' },
      { id: 'neonGlow',   label: '네온 글로우' },
      { id: 'plain',      label: '배경 없음' }
    ];
    window.AR_ELEMENT_BOX_STYLES = AR_ELEMENT_BOX_STYLES;

    const AR_CUT_TRANSITIONS = [
      { id: 'default',       label: '스타일 기본' },
      { id: 'none',          label: '없음(컷)' },
      { id: 'crossfade',     label: '크로스페이드' },
      { id: 'pushLeft',      label: '왼쪽 밀기' },
      { id: 'pushRight',     label: '오른쪽 밀기' },
      { id: 'pushUp',        label: '위로 밀기' },
      { id: 'pushDown',      label: '아래로 밀기' },
      { id: 'zoomIn',        label: '줌인 전환' },
      { id: 'zoomOut',       label: '줌아웃 전환' },
      { id: 'circleWipe',    label: '서클 와이프' },
      { id: 'diamondWipe',   label: '다이아몬드' },
      { id: 'whiteFlash',    label: '화이트 플래시' },
      { id: 'blackDissolve', label: '블랙 디졸브' },
      { id: 'blinds',        label: '블라인드' },
      { id: 'spin',          label: '스핀 회전' },
      { id: 'glitch',        label: '글리치' }
    ];
    window.AR_CUT_TRANSITIONS = AR_CUT_TRANSITIONS;

    window.__arPinnedCut = -1;
    window.__arCutEditorTab = 'deco';
    window.__arCutTextFont = 'dohyeon';
    window.__arCutTextStyle = 'box';
    window.__arCutTextAlign = 'center';
    window.__arCutTextColor = '#ffffff';
    window.__arIgStickerTab = 'widget';
    window.__arIgSheetMode = 'sticker';
    window.__arSelectedOverlayIdx = -1;
    window.__arOverlayUndo = [];
    window.__arCutEditorOpen = false;
    window.__arInlineEditActive = false;
    window.__arActiveCutElKey = 'caption';
    window.__arDirectCanvasMode = true;
    window.__arActiveRenderCutIdx = -1;
    window.__arAnimPreviewTimer = null;

    // 컷별 요소(자막·상단배지·혜택문구·배경사진 구도) 오버라이드 상태 (새로고침 시 항상 초기화 — localStorage 미저장)
    let cutElementOverrides = [];
    window.cutElementOverrides = cutElementOverrides;

    function createDefaultCutElementOverride() {
      return {
        caption: { x: 0.5, y: 0.72, scale: 1, color: '', bgColor: '', font: '', boxStyle: 'default', anim: 'default', hidden: false, customPos: false },
        badge:   { text: '', x: 0.5, y: 0.08, scale: 1, color: '', bgColor: '', font: '', boxStyle: 'default', anim: 'default', hidden: false, customPos: false },
        price:   { text: '', x: 0.5, y: 0.56, scale: 1, color: '', bgColor: '', font: '', boxStyle: 'default', anim: 'default', hidden: false, customPos: false },
        photo:   { scale: 1, panX: 0, panY: 0 }
      };
    }

    function getCutElementOverride(cutIdx) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return createDefaultCutElementOverride();
      if (!Array.isArray(cutElementOverrides)) cutElementOverrides = [];
      window.cutElementOverrides = cutElementOverrides;
      if (typeof campaign !== 'undefined') campaign.cutElementOverrides = cutElementOverrides;
      if (!cutElementOverrides[cutIdx] || typeof cutElementOverrides[cutIdx] !== 'object') {
        cutElementOverrides[cutIdx] = createDefaultCutElementOverride();
      } else {
        const def = createDefaultCutElementOverride();
        if (!cutElementOverrides[cutIdx].caption) cutElementOverrides[cutIdx].caption = def.caption;
        else cutElementOverrides[cutIdx].caption = Object.assign({}, def.caption, cutElementOverrides[cutIdx].caption);
        if (!cutElementOverrides[cutIdx].badge) cutElementOverrides[cutIdx].badge = def.badge;
        else cutElementOverrides[cutIdx].badge = Object.assign({}, def.badge, cutElementOverrides[cutIdx].badge);
        if (!cutElementOverrides[cutIdx].price) cutElementOverrides[cutIdx].price = def.price;
        else cutElementOverrides[cutIdx].price = Object.assign({}, def.price, cutElementOverrides[cutIdx].price);
        if (!cutElementOverrides[cutIdx].photo) cutElementOverrides[cutIdx].photo = def.photo;
        else cutElementOverrides[cutIdx].photo = Object.assign({}, def.photo, cutElementOverrides[cutIdx].photo);
      }
      return cutElementOverrides[cutIdx];
    }

    function isCutElementPropCustomized(obj) {
      if (!obj) return false;
      return !!(
        obj.hidden ||
        obj.customPos ||
        (obj.scale && Math.abs(obj.scale - 1) > 0.01) ||
        obj.color ||
        obj.bgColor ||
        obj.font ||
        (obj.boxStyle && obj.boxStyle !== 'default') ||
        (obj.anim && obj.anim !== 'default')
      );
    }

    function isCutElementModified(cutIdx, elKey) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return false;
      const ov = cutElementOverrides && cutElementOverrides[cutIdx];
      if (elKey === 'transition') {
        const tr = (campaign && campaign.cutTransitions && campaign.cutTransitions[cutIdx]) || 'default';
        return !!(tr && tr !== 'default');
      }
      if (!ov) {
        if (elKey === 'photo') {
          const flt = (campaign && campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
          return !!(flt && flt !== 'none');
        }
        if (elKey === 'deco') {
          const d = (campaign && campaign.cutDecos && campaign.cutDecos[cutIdx]) || 'none';
          const fr = (campaign && campaign.cutFrames && campaign.cutFrames[cutIdx]) || '';
          return !!((d && d !== 'none') || fr);
        }
        return false;
      }
      if (elKey === 'caption') {
        return isCutElementPropCustomized(ov.caption);
      }
      if (elKey === 'badge') {
        const b = ov.badge || {};
        return !!(b.text || isCutElementPropCustomized(b));
      }
      if (elKey === 'price') {
        const p = ov.price || {};
        return !!(p.text || isCutElementPropCustomized(p));
      }
      if (elKey === 'photo') {
        const ph = ov.photo || {};
        const flt = (campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
        return !!((ph.scale && Math.abs(ph.scale - 1) > 0.01) || (ph.panX && Math.abs(ph.panX) > 0.005) || (ph.panY && Math.abs(ph.panY) > 0.005) || (flt && flt !== 'none'));
      }
      if (elKey === 'deco') {
        const d = (campaign.cutDecos && campaign.cutDecos[cutIdx]) || 'none';
        const fr = (campaign.cutFrames && campaign.cutFrames[cutIdx]) || '';
        return !!((d && d !== 'none') || fr);
      }
      return false;
    }

    function hasAnyCutElementOverride(cutIdx) {
      return isCutElementModified(cutIdx, 'caption') ||
             isCutElementModified(cutIdx, 'badge') ||
             isCutElementModified(cutIdx, 'price') ||
             isCutElementModified(cutIdx, 'photo') ||
             isCutElementModified(cutIdx, 'transition');
    }

    function loadCutDecos() {
      try {
        localStorage.removeItem('autoreels_cut_decos');
        localStorage.removeItem('autoreels_cut_overlays');
        localStorage.removeItem('autoreels_cut_filters');
        localStorage.removeItem('autoreels_cut_frames');
        localStorage.removeItem('autoreels_cut_strokes');
        localStorage.removeItem('autoreels_cut_element_overrides');
        localStorage.removeItem('autoreels_cut_transitions');
      } catch (e) {}
      campaign.cutDecos = [];
      campaign.cutOverlays = [];
      campaign.cutFilters = [];
      campaign.cutFrames = [];
      campaign.cutStrokes = [];
      campaign.cutTransitions = [];
      cutElementOverrides = [];
      window.cutElementOverrides = cutElementOverrides;
      campaign.cutElementOverrides = cutElementOverrides;
    }
    function saveCutDecos() {}
    function saveCutOverlays() {}
    function saveCutFilters() {}
    function saveCutFrames() {}
    function saveCutStrokes() {}
    function clearAllCutEdits() {
      campaign.cutDecos = [];
      campaign.cutOverlays = [];
      campaign.cutFilters = [];
      campaign.cutFrames = [];
      campaign.cutStrokes = [];
      campaign.cutTransitions = [];
      cutElementOverrides = [];
      window.cutElementOverrides = cutElementOverrides;
      campaign.cutElementOverrides = cutElementOverrides;
      window.__arPinnedCut = -1;
      window.__arPinnedCutIdx = -1;
      window.__arSelectedOverlayIdx = -1;
      window.__arOverlayUndo = [];
      window.__arCutEditorOpen = false;
      window.__arInlineEditActive = false;
      closeIgSheet();
      if (typeof closeIgDrawMode === 'function') closeIgDrawMode(true);
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
      if (typeof renderCutOverlayEditorLayer === 'function') renderCutOverlayEditorLayer();
      if (typeof renderIgEditorHud === 'function') renderIgEditorHud();
      if (typeof renderCutEditorPanel === 'function') renderCutEditorPanel();
      if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
    }

    window.__arPhotoStickerCache = window.__arPhotoStickerCache || {};
    function getPhotoStickerImg(src) {
      if (!src) return null;
      let img = window.__arPhotoStickerCache[src];
      if (!img) {
        img = new Image();
        img.onload = () => {
          if (window.__timelines && window.__timelines.main) {
            window.__timelines.main.seek(window.__timelines.main.currentTime);
          }
        };
        img.src = src;
        window.__arPhotoStickerCache[src] = img;
      }
      return img && img.complete && img.naturalWidth > 0 ? img : null;
    }

    function ensureActivePinCut() {
      if (typeof window.__arPinnedCut === 'number' && window.__arPinnedCut >= 0) return window.__arPinnedCut;
      return -1;
    }

    function handleIgPhotoStickerUpload(event) {
      const file = event && event.target && event.target.files && event.target.files[0];
      if (event && event.target) event.target.value = '';
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const rawUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 480;
          let w = img.naturalWidth || 400;
          let h = img.naturalHeight || 400;
          if (w > maxDim || h > maxDim) {
            const r = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * r);
            h = Math.round(h * r);
          }
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const cx = c.getContext('2d');
          cx.drawImage(img, 0, 0, w, h);
          const dataUrl = c.toDataURL('image/webp', 0.88);
          getPhotoStickerImg(dataUrl);
          const cutIdx = ensureActivePinCut();
          if (cutIdx < 0) return;
          pushCutOverlayUndo();
          if (!Array.isArray(campaign.cutOverlays)) campaign.cutOverlays = [];
          if (!Array.isArray(campaign.cutOverlays[cutIdx])) campaign.cutOverlays[cutIdx] = [];
          const list = campaign.cutOverlays[cutIdx];
          list.push({
            id: 'ov_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            type: 'sticker',
            style: 'photo',
            photoSrc: dataUrl,
            photoShape: 'round',
            aspect: w / Math.max(1, h),
            x: 0.5,
            y: 0.5,
            scale: 1,
            rotation: 0
          });
          window.__arSelectedOverlayIdx = list.length - 1;
          closeIgSheet();
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
          renderPreviewCutPinBar();
          renderCutOverlayEditorLayer();
          renderIgEditorHud();
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }

    const IG_DRAW_BRUSHES = [
      { id: 'pen', label: '펜' },
      { id: 'highlighter', label: '형광' },
      { id: 'neon', label: '네온' }
    ];
    const IG_DRAW_SIZES = [8, 16, 28, 42];
    window.__arDrawBrushIdx = 0;
    window.__arDrawSizeIdx = 1;
    window.__arDrawColor = '#ffffff';
    window.__arDrawActive = null;

    function openIgDrawMode() {
      const cutIdx = ensureActivePinCut();
      if (cutIdx < 0) return;
      closeIgSheet();
      const overlay = document.getElementById('igDrawOverlay');
      const pad = document.getElementById('igDrawPad');
      const colorBar = document.getElementById('igDrawColorBar');
      if (!overlay || !pad || !colorBar) return;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      const brushBtn = document.getElementById('igDrawBrushBtn');
      const sizeBtn = document.getElementById('igDrawSizeBtn');
      if (brushBtn) brushBtn.textContent = IG_DRAW_BRUSHES[window.__arDrawBrushIdx].label;
      if (sizeBtn) sizeBtn.textContent = '두께 ' + IG_DRAW_SIZES[window.__arDrawSizeIdx];
      colorBar.innerHTML = CUT_TEXT_COLORS.map(c =>
        `<button type="button" onclick="window.__arDrawColor='${c}';document.querySelectorAll('#igDrawColorBar button').forEach(b=>b.classList.remove('ring-2','ring-white'));this.classList.add('ring-2','ring-white');" class="w-6 h-6 rounded-full shrink-0 border border-white/40 ${window.__arDrawColor === c ? 'ring-2 ring-white' : ''}" style="background:${c};"></button>`
      ).join('');
      pad.onpointerdown = (ev) => {
        ev.preventDefault();
        const rect = pad.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const cIdx = ensureActivePinCut();
        if (cIdx < 0) return;
        if (!Array.isArray(campaign.cutStrokes)) campaign.cutStrokes = [];
        if (!Array.isArray(campaign.cutStrokes[cIdx])) campaign.cutStrokes[cIdx] = [];
        const pt = {
          x: Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)),
          y: Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height))
        };
        const stroke = {
          brush: IG_DRAW_BRUSHES[window.__arDrawBrushIdx].id,
          color: window.__arDrawColor,
          size: IG_DRAW_SIZES[window.__arDrawSizeIdx],
          points: [pt]
        };
        campaign.cutStrokes[cIdx].push(stroke);
        window.__arDrawActive = { cutIdx: cIdx, stroke, rect };
        try { pad.setPointerCapture(ev.pointerId); } catch (e) {}
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      };
      pad.onpointermove = (ev) => {
        if (!window.__arDrawActive) return;
        const { stroke, rect } = window.__arDrawActive;
        const pt = {
          x: Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)),
          y: Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height))
        };
        const last = stroke.points[stroke.points.length - 1];
        if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) > 0.003) {
          stroke.points.push(pt);
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        }
      };
      pad.onpointerup = pad.onpointercancel = () => {
        if (!window.__arDrawActive) return;
        window.__arDrawActive = null;
        renderPreviewCutPinBar();
        renderIgEditorHud();
      };
    }

    function closeIgDrawMode(silent) {
      window.__arDrawActive = null;
      const overlay = document.getElementById('igDrawOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
      }
      if (!silent) {
        renderPreviewCutPinBar();
        renderIgEditorHud();
      }
    }

    function cycleIgDrawBrush() {
      window.__arDrawBrushIdx = (window.__arDrawBrushIdx + 1) % IG_DRAW_BRUSHES.length;
      const btn = document.getElementById('igDrawBrushBtn');
      if (btn) btn.textContent = IG_DRAW_BRUSHES[window.__arDrawBrushIdx].label;
    }

    function cycleIgDrawSize() {
      window.__arDrawSizeIdx = (window.__arDrawSizeIdx + 1) % IG_DRAW_SIZES.length;
      const btn = document.getElementById('igDrawSizeBtn');
      if (btn) btn.textContent = '두께 ' + IG_DRAW_SIZES[window.__arDrawSizeIdx];
    }

    function undoIgDrawStroke() {
      const cutIdx = ensureActivePinCut();
      if (cutIdx < 0 || !Array.isArray(campaign.cutStrokes) || !Array.isArray(campaign.cutStrokes[cutIdx])) return;
      campaign.cutStrokes[cutIdx].pop();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function clearIgDrawStrokes() {
      const cutIdx = ensureActivePinCut();
      if (cutIdx < 0 || !Array.isArray(campaign.cutStrokes)) return;
      campaign.cutStrokes[cutIdx] = [];
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function drawCutStrokesOverlay(ctx, w, h, cutIdx) {
      const strokes = Array.isArray(campaign.cutStrokes) && Array.isArray(campaign.cutStrokes[cutIdx]) ? campaign.cutStrokes[cutIdx] : [];
      if (!strokes.length) return;
      const scale = w / 1080;
      strokes.forEach(s => {
        if (!s || !Array.isArray(s.points) || !s.points.length) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const lw = (s.size || 16) * scale;
        ctx.lineWidth = lw;
        ctx.strokeStyle = s.color || '#ffffff';
        if (s.brush === 'highlighter') {
          ctx.globalAlpha = 0.45;
          ctx.lineCap = 'butt';
          ctx.lineWidth = lw * 1.45;
        } else if (s.brush === 'neon') {
          ctx.shadowColor = s.color || '#ffffff';
          ctx.shadowBlur = lw * 1.6;
          ctx.strokeStyle = '#ffffff';
        }
        ctx.beginPath();
        const pts = s.points;
        ctx.moveTo(pts[0].x * w, pts[0].y * h);
        if (pts.length === 1) {
          ctx.lineTo(pts[0].x * w + 0.1, pts[0].y * h + 0.1);
        } else {
          for (let i = 1; i < pts.length - 1; i++) {
            const mx = ((pts[i].x + pts[i + 1].x) / 2) * w;
            const my = ((pts[i].y + pts[i + 1].y) / 2) * h;
            ctx.quadraticCurveTo(pts[i].x * w, pts[i].y * h, mx, my);
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x * w, last.y * h);
        }
        ctx.stroke();
        if (s.brush === 'neon') {
          ctx.shadowBlur = lw * 0.5;
          ctx.strokeStyle = s.color || '#ffffff';
          ctx.lineWidth = lw * 0.45;
          ctx.stroke();
        }
        ctx.restore();
      });
    }
    function setCutFrame(idx, frameKey) {
      if (!Array.isArray(campaign.cutFrames)) campaign.cutFrames = [];
      campaign.cutFrames[idx] = frameKey === 'noneFrame' ? '' : frameKey;
      saveCutFrames();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }
    function pushCutOverlayUndo() {
      try {
        window.__arOverlayUndo.push(JSON.stringify(campaign.cutOverlays || []));
        if (window.__arOverlayUndo.length > 20) window.__arOverlayUndo.shift();
      } catch (e) {}
    }
    function undoCutOverlay() {
      if (!window.__arOverlayUndo || !window.__arOverlayUndo.length) return;
      try {
        const prev = JSON.parse(window.__arOverlayUndo.pop());
        campaign.cutOverlays = Array.isArray(prev) ? prev : [];
        window.__arSelectedOverlayIdx = -1;
        saveCutOverlays();
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        renderPreviewCutPinBar();
      } catch (e) {}
    }
    function getCutOverlayList(cutIdx) {
      if (!Array.isArray(campaign.cutOverlays)) campaign.cutOverlays = [];
      if (!Array.isArray(campaign.cutOverlays[cutIdx])) campaign.cutOverlays[cutIdx] = [];
      return campaign.cutOverlays[cutIdx];
    }

    function drawIgSparkleShape(c, x, y, r, col) {
      c.save();
      c.translate(x, y);
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(0, -r);
      c.quadraticCurveTo(0, 0, r, 0);
      c.quadraticCurveTo(0, 0, 0, r);
      c.quadraticCurveTo(0, 0, -r, 0);
      c.quadraticCurveTo(0, 0, 0, -r);
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawIgWidgetSticker(c, item, sc) {
      const k = item.key || 'loc';
      const sub = item.sub || '';
      c.save();
      if (k === 'loc') {
        const txt = item.customText || `📍 ${(typeof IND !== 'undefined' && IND.place) ? IND.place : 'SEOUL HOTPLACE'}`;
        c.font = `800 ${Math.round(25 * sc)}px 'Pretendard', 'Noto Sans KR', sans-serif`;
        const bw = Math.max(210 * sc, c.measureText(txt).width + 44 * sc);
        const bh = 54 * sc;
        const grd = c.createLinearGradient(-bw / 2, 0, bw / 2, 0);
        grd.addColorStop(0, '#ec4899');
        grd.addColorStop(1, '#8b5cf6');
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 14 * sc);
        c.fillStyle = '#ffffff';
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = grd;
        c.fillText(txt, 0, 2);
      } else if (k === 'time') {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const txt = `${days[now.getDay()]} · ${hh}:${mm}`;
        c.font = `700 ${Math.round(28 * sc)}px 'JetBrains Mono', monospace`;
        const bw = Math.max(195 * sc, c.measureText(txt).width + 40 * sc);
        const bh = 54 * sc;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 14 * sc);
        c.fillStyle = 'rgba(15,15,18,0.82)';
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.28)';
        c.lineWidth = 2;
        c.stroke();
        c.shadowBlur = 0;
        c.fillStyle = '#ffffff';
        c.fillText(txt, 0, 2);
      } else if (k === 'music') {
        const bw = 270 * sc, bh = 74 * sc;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 16;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 16 * sc);
        c.fillStyle = 'rgba(20,20,26,0.86)';
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.18)';
        c.lineWidth = 1.5;
        c.stroke();
        c.shadowBlur = 0;
        gRoundRect(c, -bw / 2 + 10 * sc, -24 * sc, 48 * sc, 48 * sc, 10 * sc);
        c.fillStyle = '#38bdf8';
        c.fill();
        c.fillStyle = '#09090b';
        c.font = `800 ${Math.round(22 * sc)}px sans-serif`;
        c.fillText('♫', -bw / 2 + 34 * sc, 1);
        c.textAlign = 'left';
        c.fillStyle = '#ffffff';
        c.font = `700 ${Math.round(18 * sc)}px 'Pretendard', sans-serif`;
        c.fillText((typeof IND !== 'undefined' && IND.label) ? `${IND.label} BGM` : 'AutoReels Mix', -bw / 2 + 70 * sc, -9 * sc);
        c.fillStyle = '#a1a1aa';
        c.font = `500 ${Math.round(14 * sc)}px 'Pretendard', sans-serif`;
        c.fillText('Now Playing · 0:12', -bw / 2 + 70 * sc, 13 * sc);
      } else if (k === 'poll') {
        const bw = 270 * sc, bh = 112 * sc;
        c.shadowColor = 'rgba(0,0,0,0.4)';
        c.shadowBlur = 16;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 18 * sc);
        c.fillStyle = '#ffffff';
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#09090b';
        c.font = `800 ${Math.round(19 * sc)}px 'Pretendard', sans-serif`;
        c.fillText(item.customText || '지금 느낌 어때요?', 0, -28 * sc);
        gRoundRect(c, -bw / 2 + 14 * sc, -4 * sc, bw - 28 * sc, 36 * sc, 10 * sc);
        c.fillStyle = '#f4f4f5';
        c.fill();
        c.fillStyle = '#09090b';
        c.font = `700 ${Math.round(16 * sc)}px 'Pretendard', sans-serif`;
        c.fillText('🔥 완전 좋아요!   |   👀 궁금해요', 0, 14 * sc);
      } else if (k === 'slider') {
        const bw = 260 * sc, bh = 74 * sc;
        c.shadowColor = 'rgba(0,0,0,0.4)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 18 * sc);
        c.fillStyle = '#ffffff';
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#18181b';
        c.font = `800 ${Math.round(17 * sc)}px 'Pretendard', sans-serif`;
        c.fillText('만족도 100% 추천', 0, -14 * sc);
        gRoundRect(c, -bw / 2 + 22 * sc, 10 * sc, bw - 44 * sc, 10 * sc, 5 * sc);
        c.fillStyle = '#e4e4e7';
        c.fill();
        const grd = c.createLinearGradient(-bw / 2 + 22 * sc, 0, bw / 2 - 42 * sc, 0);
        grd.addColorStop(0, '#f43f5e');
        grd.addColorStop(1, '#facc15');
        gRoundRect(c, -bw / 2 + 22 * sc, 10 * sc, (bw - 44 * sc) * 0.82, 10 * sc, 5 * sc);
        c.fillStyle = grd;
        c.fill();
        c.font = `${Math.round(28 * sc)}px sans-serif`;
        c.fillText('😍', bw / 2 - 42 * sc, 14 * sc);
      } else if (k === 'tag') {
        const bw = 200 * sc, bh = 58 * sc;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 12 * sc);
        c.fillStyle = '#facc15';
        c.fill();
        c.shadowBlur = 0;
        c.beginPath();
        c.arc(-bw / 2 + 20 * sc, 0, 6 * sc, 0, Math.PI * 2);
        c.fillStyle = '#09090b';
        c.fill();
        c.fillStyle = '#09090b';
        c.font = `900 ${Math.round(23 * sc)}px 'Do Hyeon', 'Pretendard', sans-serif`;
        c.fillText(item.customText || arPriceTag() || 'SPECIAL PRICE', 10 * sc, 2);
      } else if (k === 'stars5') {
        const bw = 210 * sc, bh = 54 * sc;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 12;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, bh / 2);
        c.fillStyle = 'rgba(15,15,18,0.86)';
        c.fill();
        c.strokeStyle = '#facc15';
        c.lineWidth = 2;
        c.stroke();
        c.shadowBlur = 0;
        c.fillStyle = '#facc15';
        c.font = `800 ${Math.round(24 * sc)}px sans-serif`;
        c.fillText('★★★★★', 0, 1);
      } else if (k === 'dm') {
        const bw = 250 * sc, bh = 78 * sc;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 16 * sc);
        c.fillStyle = 'rgba(255,255,255,0.95)';
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#18181b';
        c.font = `800 ${Math.round(18 * sc)}px 'Pretendard', sans-serif`;
        c.fillText(item.customText || '💬 편하게 DM 주세요!', 0, -10 * sc);
        c.fillStyle = '#71717a';
        c.font = `500 ${Math.round(14 * sc)}px 'Pretendard', sans-serif`;
        c.fillText('예약 · 가격 · 상담 환영', 0, 16 * sc);
      } else if (k === 'date' || k === 'follow' || k === 'dday' || k === 'verified' || k === 'rec' || k === 'open' || k === 'gift' || k === 'ready') {
        const cfg = {
          date: { text: 'NOV 14 · TODAY', bg: '#ffffff', fg: '#09090b', bd: 'rgba(255,255,255,0.4)' },
          follow: { text: '🔔 팔로우 + 알림설정', bg: '#db2777', fg: '#ffffff', bd: '#f472b6' },
          dday: { text: '🔥 TODAY ONLY 특가', bg: '#dc2626', fg: '#ffffff', bd: '#fca5a5' },
          verified: { text: '✅ 100% 정품 인증', bg: '#059669', fg: '#ffffff', bd: '#6ee7b7' },
          rec: { text: '● REC  4K VLOG', bg: 'rgba(15,15,18,0.85)', fg: '#f87171', bd: 'rgba(248,113,113,0.6)' },
          open: { text: '☕ OPEN · 영업중', bg: '#1e293b', fg: '#38bdf8', bd: '#38bdf8' },
          gift: { text: '🎁 선착순 사은품', bg: '#7c3aed', fg: '#ffffff', bd: '#c4b5fd' },
          ready: { text: '⚡ 당일 즉시 가능', bg: '#0891b2', fg: '#ffffff', bd: '#67e8f9' }
        }[k];
        const txt = item.customText || cfg.text;
        c.font = `800 ${Math.round(21 * sc)}px 'Pretendard', 'Noto Sans KR', sans-serif`;
        const bw = Math.max(190 * sc, c.measureText(txt).width + 40 * sc);
        const bh = 52 * sc;
        c.shadowColor = 'rgba(0,0,0,0.42)';
        c.shadowBlur = 14;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 14 * sc);
        c.fillStyle = cfg.bg;
        c.fill();
        c.strokeStyle = cfg.bd;
        c.lineWidth = 2;
        c.stroke();
        c.shadowBlur = 0;
        c.fillStyle = cfg.fg;
        c.fillText(txt, 0, 2);
      } else if (k === 'sparkle3' || k === 'sparkleGold' || k === 'sparklePink' || k === 'sparkleMint') {
        const col = item.color || (k === 'sparkleGold' ? '#facc15' : k === 'sparklePink' ? '#fb7185' : k === 'sparkleMint' ? '#34d399' : '#ffffff');
        c.shadowColor = col;
        c.shadowBlur = 16;
        drawIgSparkleShape(c, 0, 0, 28 * sc, col);
        drawIgSparkleShape(c, -30 * sc, -22 * sc, 13 * sc, col);
        drawIgSparkleShape(c, 28 * sc, 22 * sc, 16 * sc, col);
      } else if (k === 'arrow' || k === 'arrowPink' || k === 'arrowGold' || k === 'doubleArrow') {
        const col = item.color || (k === 'arrowPink' ? '#fb7185' : k === 'arrowGold' ? '#facc15' : k === 'doubleArrow' ? '#38bdf8' : '#ffffff');
        c.strokeStyle = col;
        c.lineWidth = 6 * sc;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.shadowColor = 'rgba(0,0,0,0.5)';
        c.shadowBlur = 8;
        c.beginPath();
        c.moveTo(-42 * sc, -26 * sc);
        c.quadraticCurveTo(-8 * sc, 24 * sc, 36 * sc, 12 * sc);
        c.stroke();
        c.beginPath();
        c.moveTo(16 * sc, -4 * sc);
        c.lineTo(38 * sc, 12 * sc);
        c.lineTo(20 * sc, 30 * sc);
        c.stroke();
        if (k === 'doubleArrow') {
          c.beginPath();
          c.moveTo(2 * sc, -10 * sc);
          c.lineTo(20 * sc, 4 * sc);
          c.lineTo(4 * sc, 20 * sc);
          c.stroke();
        }
      } else if (k === 'heart' || k === 'heartFill') {
        const col = item.color || (k === 'heartFill' ? '#ef4444' : '#fb7185');
        c.strokeStyle = col;
        c.fillStyle = col;
        c.lineWidth = 5 * sc;
        c.lineCap = 'round';
        c.shadowColor = col;
        c.shadowBlur = 12;
        c.beginPath();
        c.moveTo(0, 28 * sc);
        c.bezierCurveTo(-48 * sc, -4 * sc, -30 * sc, -42 * sc, 0, -14 * sc);
        c.bezierCurveTo(30 * sc, -42 * sc, 48 * sc, -4 * sc, 0, 28 * sc);
        if (k === 'heartFill') c.fill();
        else c.stroke();
      } else if (k === 'underline' || k === 'underlineWhite') {
        const col = item.color || (k === 'underlineWhite' ? '#ffffff' : '#facc15');
        c.strokeStyle = col;
        c.lineWidth = 6 * sc;
        c.lineCap = 'round';
        c.beginPath();
        for (let x = -72 * sc; x <= 72 * sc; x += 6 * sc) {
          const y = Math.sin(x / (12 * sc)) * 7 * sc;
          if (x === -72 * sc) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      } else if (k === 'bang') {
        const col = item.color || '#facc15';
        c.fillStyle = col;
        c.shadowColor = 'rgba(0,0,0,0.5)';
        c.shadowBlur = 10;
        c.font = `900 ${Math.round(58 * sc)}px 'Black Han Sans', sans-serif`;
        c.fillText('!!', 0, 4);
      } else if (k === 'circleMark') {
        const col = item.color || '#fb7185';
        c.strokeStyle = col;
        c.lineWidth = 6 * sc;
        c.lineCap = 'round';
        c.beginPath();
        c.ellipse(0, 0, 56 * sc, 30 * sc, -0.1, 0, Math.PI * 1.88);
        c.stroke();
      } else if (k === 'check') {
        const col = item.color || '#34d399';
        c.strokeStyle = col;
        c.lineWidth = 5 * sc;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.beginPath();
        c.arc(0, 0, 32 * sc, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.moveTo(-14 * sc, 2 * sc);
        c.lineTo(-3 * sc, 14 * sc);
        c.lineTo(18 * sc, -12 * sc);
        c.stroke();
      } else if (k === 'crown') {
        const col = item.color || '#facc15';
        c.fillStyle = col;
        c.shadowColor = 'rgba(0,0,0,0.45)';
        c.shadowBlur = 10;
        c.beginPath();
        c.moveTo(-34 * sc, 18 * sc);
        c.lineTo(-38 * sc, -18 * sc);
        c.lineTo(-14 * sc, 0);
        c.lineTo(0, -26 * sc);
        c.lineTo(14 * sc, 0);
        c.lineTo(38 * sc, -18 * sc);
        c.lineTo(34 * sc, 18 * sc);
        c.closePath();
        c.fill();
      }
      c.restore();
    }

    function computeArElementAnimState(animId, localT) {
      const a = animId || 'default';
      const lt = typeof localT === 'number' ? Math.max(0, localT) : 0.6;
      const st = {
        alpha: 1,
        dx: 0,
        dy: 0,
        scaleX: 1,
        scaleY: 1,
        rot: 0,
        blur: 0,
        wipeRatio: 1,
        charRatio: 1,
        glowBoost: 0
      };
      if (a === 'none' || a === 'static') return st;
      if (a === 'default') {
        const p = Math.min(1, Math.max(0.2, lt / 0.42));
        st.alpha = p;
        st.dy = (1 - p) * 14;
        return st;
      }
      if (a === 'fadeIn') {
        const p = Math.min(1, lt / 0.48);
        st.alpha = p * p * (3 - 2 * p);
      } else if (a === 'slideUp' || a === 'slide') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        st.dy = (1 - p) * 68;
        st.alpha = Math.min(1, p * 1.35);
      } else if (a === 'slideDown') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        st.dy = -(1 - p) * 68;
        st.alpha = Math.min(1, p * 1.35);
      } else if (a === 'slideLeft') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        st.dx = (1 - p) * 96;
        st.alpha = Math.min(1, p * 1.35);
      } else if (a === 'slideRight') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        st.dx = -(1 - p) * 96;
        st.alpha = Math.min(1, p * 1.35);
      } else if (a === 'pop') {
        if (lt < 0.42) {
          const p = lt / 0.42;
          const s = 0.35 + 0.65 * (1 + Math.sin(p * Math.PI * 1.15) * 0.22) * Math.min(1, p * 1.25);
          st.scaleX = s;
          st.scaleY = s;
          st.alpha = Math.min(1, p * 2.2);
        }
      } else if (a === 'bounce') {
        if (lt < 0.58) {
          const p = lt / 0.58;
          const decay = Math.pow(1 - p, 1.8);
          st.dy = -Math.abs(Math.cos(p * Math.PI * 2.5)) * 64 * decay;
          st.alpha = Math.min(1, p * 2.5);
        }
      } else if (a === 'zoomIn') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        const s = 0.25 + 0.75 * p;
        st.scaleX = s;
        st.scaleY = s;
        st.alpha = p;
      } else if (a === 'zoomOut') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.45), 3);
        const s = 1.65 - 0.65 * p;
        st.scaleX = s;
        st.scaleY = s;
        st.alpha = p;
      } else if (a === 'blurIn') {
        const p = Math.min(1, lt / 0.48);
        st.alpha = p;
        st.blur = (1 - p) * 10;
        const s = 1.08 - 0.08 * p;
        st.scaleX = s;
        st.scaleY = s;
      } else if (a === 'wipe') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.52), 2.6);
        st.wipeRatio = Math.max(0.02, p);
      } else if (a === 'typewriter') {
        const p = Math.min(1, lt / 0.68);
        st.charRatio = Math.max(0.05, p);
      } else if (a === 'flip') {
        const p = 1 - Math.pow(1 - Math.min(1, lt / 0.48), 3);
        st.scaleY = Math.max(0.08, p);
        st.rot = (1 - p) * -0.18;
        st.alpha = Math.min(1, p * 1.6);
      } else if (a === 'drop') {
        if (lt < 0.46) {
          const p = lt / 0.46;
          const ease = p < 0.7 ? (p / 0.7) * (p / 0.7) : 1 - Math.sin(((p - 0.7) / 0.3) * Math.PI) * 0.12;
          st.dy = -(1 - ease) * 140;
          st.alpha = Math.min(1, p * 2.4);
        }
      } else if (a === 'float') {
        st.dy = Math.sin(lt * 4.2) * 8;
      } else if (a === 'pulse') {
        const s = 1 + Math.sin(lt * 6.2) * 0.065;
        st.scaleX = s;
        st.scaleY = s;
      } else if (a === 'wiggle') {
        st.rot = Math.sin(lt * 9.5) * 0.065;
      } else if (a === 'glow') {
        st.glowBoost = 0.5 + 0.5 * Math.sin(lt * 5.6);
      }
      return st;
    }

    function drawSingleCutOverlayItem(c, W, H, item, localT) {
      if (!item) return;
      const anim = item.anim || 'static';
      const ast = computeArElementAnimState(anim, localT);
      const px = (typeof item.x === 'number' ? item.x : 0.5) * W + ast.dx;
      const py = (typeof item.y === 'number' ? item.y : 0.5) * H + ast.dy;
      const baseSc = Math.max(0.4, Math.min(3.0, Number(item.scale) || 1));
      const sc = baseSc * ast.scaleX;
      const rot = ((Number(item.rot) || 0) * Math.PI) / 180 + ast.rot;
      const itemAlpha = (typeof item.alpha === 'number' ? item.alpha : 1) * ast.alpha;
      c.save();
      c.globalAlpha *= Math.max(0, Math.min(1, itemAlpha));
      if (ast.blur > 0.3 && typeof c.filter === 'string') {
        c.filter = `blur(${ast.blur.toFixed(1)}px)`;
      }
      c.translate(px, py);
      c.rotate(rot);
      if (Math.abs(ast.scaleY - ast.scaleX) > 0.01) {
        c.scale(1, ast.scaleY / Math.max(0.05, ast.scaleX));
      }
      if (ast.wipeRatio < 0.999) {
        c.beginPath();
        c.rect(-W, -H, W * 2 * ast.wipeRatio, H * 2);
        c.clip();
      }
      c.textAlign = 'center';
      c.textBaseline = 'middle';

      if (item.type === 'sticker') {
        if (item.style === 'photo' && item.photoSrc) {
          const img = getPhotoStickerImg(item.photoSrc);
          const shape = item.photoShape || 'round';
          const base = 280 * sc;
          const asp = Number(item.aspect) || 1;
          const pw = asp >= 1 ? base : base * asp;
          const ph = asp >= 1 ? base / asp : base;
          if (img) {
            c.save();
            c.shadowColor = 'rgba(0,0,0,0.42)';
            c.shadowBlur = 18 * sc;
            c.shadowOffsetY = 6 * sc;
            if (shape === 'polaroid') {
              const pad = 14 * sc;
              const bot = 42 * sc;
              gRoundRect(c, -pw / 2 - pad, -ph / 2 - pad, pw + pad * 2, ph + pad + bot, 8 * sc);
              c.fillStyle = '#ffffff';
              c.fill();
              c.shadowBlur = 0;
              c.shadowOffsetY = 0;
              c.drawImage(img, -pw / 2, -ph / 2, pw, ph);
            } else if (shape === 'circle') {
              const d = Math.min(pw, ph);
              c.beginPath();
              c.arc(0, 0, d / 2, 0, Math.PI * 2);
              c.fillStyle = '#ffffff';
              c.fill();
              c.shadowBlur = 0;
              c.shadowOffsetY = 0;
              c.save();
              c.beginPath();
              c.arc(0, 0, d / 2, 0, Math.PI * 2);
              c.clip();
              c.drawImage(img, -pw / 2, -ph / 2, pw, ph);
              c.restore();
              c.beginPath();
              c.arc(0, 0, d / 2, 0, Math.PI * 2);
              c.lineWidth = 4 * sc;
              c.strokeStyle = 'rgba(255,255,255,0.9)';
              c.stroke();
            } else {
              const rad = shape === 'round' ? 24 * sc : 4 * sc;
              gRoundRect(c, -pw / 2, -ph / 2, pw, ph, rad);
              c.fillStyle = 'rgba(255,255,255,0.12)';
              c.fill();
              c.shadowBlur = 0;
              c.shadowOffsetY = 0;
              c.save();
              gRoundRect(c, -pw / 2, -ph / 2, pw, ph, rad);
              c.clip();
              c.drawImage(img, -pw / 2, -ph / 2, pw, ph);
              c.restore();
              gRoundRect(c, -pw / 2, -ph / 2, pw, ph, rad);
              c.lineWidth = 3 * sc;
              c.strokeStyle = 'rgba(255,255,255,0.85)';
              c.stroke();
            }
            c.restore();
          }
        } else if (item.variant === 'widget' || item.variant === 'doodle') {
          drawIgWidgetSticker(c, item, sc);
        } else if (item.variant === 'badge') {
          const fs = Math.round(30 * sc);
          c.font = `800 ${fs}px 'Pretendard', 'Noto Sans KR', sans-serif`;
          const rawTxt = String(item.text || 'NEW');
          const txt = ast.charRatio < 0.999 ? rawTxt.slice(0, Math.max(1, Math.ceil(rawTxt.length * ast.charRatio))) : rawTxt;
          const tw = c.measureText(rawTxt).width;
          const padX = Math.round(22 * sc);
          const bh = Math.round(52 * sc);
          const bw = tw + padX * 2;
          c.shadowColor = ast.glowBoost > 0 ? (item.bg || '#ef4444') : 'rgba(0,0,0,0.45)';
          c.shadowBlur = ast.glowBoost > 0 ? 16 + ast.glowBoost * 18 : 14;
          c.shadowOffsetY = 4;
          gRoundRect(c, -bw / 2, -bh / 2, bw, bh, bh / 2);
          c.fillStyle = item.bg || '#ef4444';
          c.fill();
          c.shadowBlur = 0;
          c.shadowOffsetY = 0;
          c.fillStyle = item.fg || '#ffffff';
          c.fillText(txt, 0, 2);
        } else {
          const fs = Math.round(84 * sc);
          c.font = `${fs}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
          c.shadowColor = 'rgba(0,0,0,0.35)';
          c.shadowBlur = 12 + ast.glowBoost * 16;
          c.fillText(String(item.text || '✨'), 0, 0);
        }
      } else if (item.type === 'text') {
        const rawTxt = String(item.text || '').trim();
        const txt = ast.charRatio < 0.999 ? rawTxt.slice(0, Math.max(1, Math.ceil(rawTxt.length * ast.charRatio))) : rawTxt;
        if (txt) {
          const st = item.style || 'box';
          const col = item.color || '#ffffff';
          const align = item.align || 'center';
          const fontObj = CUT_TEXT_FONTS.find((f) => f.id === (item.font || 'dohyeon')) || CUT_TEXT_FONTS[0];
          const fs = Math.round(44 * sc * (fontObj.id === 'pen' || fontObj.id === 'brush' || fontObj.id === 'script' ? 1.2 : 1));
          c.font = `${fontObj.weight} ${fs}px ${fontObj.css}`;
          c.textAlign = align;
          const fullLines = rawTxt.split('\n');
          const lines = txt.split('\n');
          const lineH = Math.round(fs * 1.28);
          const maxW = Math.max(...fullLines.map((l) => c.measureText(l).width), 40);
          const totalH = fullLines.length * lineH;
          const xOff = align === 'left' ? -maxW / 2 : align === 'right' ? maxW / 2 : 0;
          const isLightBg = col === '#ffffff' || col === '#facc15' || col === '#38bdf8' || col === '#34d399' || col === '#a3e635';

          if (st === 'box' || st === 'softbox' || st === 'darkGlass' || st === 'solidBadge' || st === 'outlineBox' || st === 'softBox') {
            const padX = Math.round(22 * sc);
            const padY = Math.round(12 * sc);
            const bw = maxW + padX * 2;
            const bh = totalH + padY * 2;
            c.save();
            if (st === 'softbox' || st === 'softBox') c.globalAlpha *= 0.72;
            c.shadowColor = ast.glowBoost > 0 ? col : 'rgba(0,0,0,0.35)';
            c.shadowBlur = 14 + ast.glowBoost * 18;
            gRoundRect(c, -bw / 2, -bh / 2, bw, bh, Math.round(16 * sc));
            c.fillStyle = st === 'darkGlass' ? 'rgba(10,10,14,0.84)' : st === 'outlineBox' ? 'rgba(10,10,14,0.68)' : col;
            c.fill();
            if (st === 'outlineBox' || st === 'darkGlass') {
              c.strokeStyle = col;
              c.lineWidth = st === 'outlineBox' ? 2.5 : 1.5;
              c.stroke();
            }
            c.restore();
            c.fillStyle = (st === 'darkGlass' || st === 'outlineBox') ? col : (isLightBg ? '#09090b' : '#ffffff');
          } else if (st === 'highlight') {
            lines.forEach((line, li) => {
              const ly = (li - (fullLines.length - 1) / 2) * lineH;
              const lw = c.measureText(line).width + 20 * sc;
              const bx = align === 'left' ? -maxW / 2 - 10 * sc : align === 'right' ? maxW / 2 - lw + 10 * sc : -lw / 2;
              c.save();
              c.globalAlpha *= 0.85;
              c.fillStyle = col;
              gRoundRect(c, bx, ly - lineH * 0.42, lw, lineH * 0.86, 8 * sc);
              c.fill();
              c.restore();
            });
            c.fillStyle = isLightBg ? '#09090b' : '#ffffff';
          } else if (st === 'neon' || st === 'neonGlow') {
            c.shadowColor = col;
            c.shadowBlur = 26 + ast.glowBoost * 18;
            c.fillStyle = '#ffffff';
          } else {
            c.shadowColor = 'rgba(0,0,0,0.82)';
            c.shadowBlur = 14 + ast.glowBoost * 16;
            c.shadowOffsetY = 3;
            c.fillStyle = col;
          }
          lines.forEach((line, li) => {
            const ly = (li - (fullLines.length - 1) / 2) * lineH;
            c.fillText(line, xOff, ly);
          });
        }
      }
      c.restore();
    }

    function drawExtraCutDeco(c, W, H, t, decoKey) {
      c.save();
      if (decoKey === 'snow' || decoKey === 'petals' || decoKey === 'bubbles' || decoKey === 'hearts' || decoKey === 'sparks') {
        const count = 22;
        for (let i = 0; i < count; i++) {
          const seed = i * 1.37 + 0.5;
          const x = ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1 * W + Math.sin(t * 1.8 + i) * 18;
          const speed = decoKey === 'sparks' ? -0.32 : decoKey === 'bubbles' ? -0.18 : 0.22;
          const base = ((i * 0.13 + t * speed) % 1 + 1) % 1;
          const y = base * H;
          const r = 4 + (i % 5) * 2.6;
          c.save();
          c.translate(x, y);
          if (decoKey === 'snow') {
            c.fillStyle = `rgba(255,255,255,${0.55 + (i % 3) * 0.15})`;
            c.beginPath(); c.arc(0, 0, r * 0.6, 0, Math.PI * 2); c.fill();
          } else if (decoKey === 'petals') {
            c.rotate(t * 1.4 + i);
            c.fillStyle = `rgba(251,182,206,${0.65 + (i % 3) * 0.1})`;
            c.beginPath(); c.ellipse(0, 0, r * 1.1, r * 0.55, 0, 0, Math.PI * 2); c.fill();
          } else if (decoKey === 'bubbles') {
            c.strokeStyle = 'rgba(186,230,253,0.7)';
            c.lineWidth = 1.6;
            c.beginPath(); c.arc(0, 0, r * 1.3, 0, Math.PI * 2); c.stroke();
          } else if (decoKey === 'hearts') {
            c.font = `${Math.round(r * 2.2)}px sans-serif`;
            c.fillStyle = 'rgba(251,113,133,0.85)';
            c.fillText('❤', 0, 0);
          } else if (decoKey === 'sparks') {
            c.fillStyle = i % 2 === 0 ? 'rgba(251,146,60,0.9)' : 'rgba(250,204,21,0.9)';
            c.beginPath(); c.arc(0, 0, r * 0.45, 0, Math.PI * 2); c.fill();
          }
          c.restore();
        }
      } else if (decoKey === 'bokeh') {
        for (let i = 0; i < 12; i++) {
          const x = ((i * 0.23 + 0.1) % 0.9 + 0.05) * W + Math.sin(t + i) * 14;
          const y = ((i * 0.37 + 0.15) % 0.85 + 0.07) * H + Math.cos(t * 0.8 + i) * 14;
          const r = 24 + (i % 4) * 16;
          c.fillStyle = i % 2 === 0 ? 'rgba(253,224,71,0.12)' : 'rgba(255,255,255,0.11)';
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        }
      } else if (decoKey === 'scanline') {
        c.fillStyle = 'rgba(255,255,255,0.06)';
        for (let y = 0; y < H; y += 6) c.fillRect(0, y, W, 2);
      } else if (decoKey === 'prism') {
        const grd = c.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, 'rgba(244,63,94,0.16)');
        grd.addColorStop(0.5, 'rgba(56,189,248,0.12)');
        grd.addColorStop(1, 'rgba(250,204,21,0.16)');
        c.globalCompositeOperation = 'screen';
        c.fillStyle = grd;
        c.fillRect(0, 0, W, H);
      }
      c.restore();
    }

    function drawCutFrameOverlay(c, W, H, fk, t) {
      if (!fk) return;
      c.save();
      if (fk === 'viewfinder') {
        c.strokeStyle = 'rgba(255,255,255,0.85)';
        c.lineWidth = 4;
        const m = 24, len = 36;
        [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => {
          c.beginPath(); c.moveTo(x + dx * len, y); c.lineTo(x, y); c.lineTo(x, y + dy * len); c.stroke();
        });
        c.fillStyle = Math.floor(t * 2) % 2 === 0 ? '#ef4444' : 'rgba(239,68,68,0.4)';
        c.beginPath(); c.arc(m + 20, m + 24, 7, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#ffffff';
        c.font = `700 16px 'JetBrains Mono', monospace`;
        c.textAlign = 'left';
        c.fillText('REC  4K · 60FPS', m + 36, m + 29);
      } else if (fk === 'film') {
        c.fillStyle = 'rgba(10,10,12,0.92)';
        c.fillRect(0, 0, 32, H);
        c.fillRect(W - 32, 0, 32, H);
        c.fillStyle = 'rgba(255,255,255,0.22)';
        for (let y = 18; y < H; y += 38) {
          gRoundRect(c, 8, y, 16, 20, 3); c.fill();
          gRoundRect(c, W - 24, y, 16, 20, 3); c.fill();
        }
      } else if (fk === 'polaroid') {
        c.strokeStyle = '#ffffff';
        c.lineWidth = 28;
        c.strokeRect(14, 14, W - 28, H - 28);
        c.fillStyle = '#ffffff';
        c.fillRect(0, H - 110, W, 110);
        c.fillStyle = '#18181b';
        c.font = `400 28px 'Nanum Pen Script', cursive`;
        c.textAlign = 'center';
        c.fillText((typeof IND !== 'undefined' && IND.place) ? IND.place : 'Special Moment', W / 2, H - 48);
      } else if (fk === 'magazine') {
        c.fillStyle = 'rgba(255,255,255,0.92)';
        c.font = `900 54px 'Noto Serif KR', serif`;
        c.textAlign = 'center';
        c.fillText('EDITION', W / 2, 74);
        c.strokeStyle = 'rgba(255,255,255,0.6)';
        c.lineWidth = 2;
        c.strokeRect(20, 20, W - 40, H - 40);
      } else if (fk === 'cinema') {
        c.fillStyle = '#000000';
        c.fillRect(0, 0, W, 92);
        c.fillRect(0, H - 92, W, 92);
      } else if (fk === 'sparkleBorder') {
        c.strokeStyle = 'rgba(253,224,71,0.55)';
        c.lineWidth = 3;
        gRoundRect(c, 20, 20, W - 40, H - 40, 22);
        c.stroke();
        drawIgSparkleShape(c, 34, 34, 18, '#fde047');
        drawIgSparkleShape(c, W - 34, H - 34, 18, '#fde047');
      } else if (fk === 'tape') {
        c.fillStyle = 'rgba(253,224,71,0.45)';
        [ [36, 36, -0.4], [W - 36, 36, 0.4], [36, H - 36, 0.4], [W - 36, H - 36, -0.4] ].forEach(([x, y, a]) => {
          c.save(); c.translate(x, y); c.rotate(a); c.fillRect(-34, -10, 68, 20); c.restore();
        });
      }
      c.restore();
    }

    function resolveArFontSpec(fontId, defaultWeight, baseSize, sc) {
      if (!fontId) {
        return {
          css: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif",
          weight: defaultWeight || 800,
          fs: Math.round(baseSize * sc)
        };
      }
      const fObj = CUT_TEXT_FONTS.find((f) => f.id === fontId);
      if (!fObj) {
        return {
          css: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif",
          weight: defaultWeight || 800,
          fs: Math.round(baseSize * sc)
        };
      }
      const boost = (fObj.id === 'pen' || fObj.id === 'brush' || fObj.id === 'script') ? 1.18 : 1;
      return {
        css: fObj.css,
        weight: fObj.weight || defaultWeight || 800,
        fs: Math.round(baseSize * sc * boost)
      };
    }

    function drawStyledArBoxAndText(c, W, H, opts) {
      const {
        lines,
        rawText,
        cx,
        cy,
        sc,
        fontSpec,
        boxStyle,
        textColor,
        bgColor,
        defaultBoxStyle,
        pillRadius,
        padXBase,
        padYBase,
        ast
      } = opts;
      if (!lines || !lines.length) return;
      const st = (!boxStyle || boxStyle === 'default') ? (defaultBoxStyle || 'darkGlass') : boxStyle;
      c.save();
      c.globalAlpha *= Math.max(0, Math.min(1, ast.alpha));
      if (ast.blur > 0.3 && typeof c.filter === 'string') {
        c.filter = `blur(${ast.blur.toFixed(1)}px)`;
      }
      c.translate(cx + ast.dx, cy + ast.dy);
      if (ast.rot) c.rotate(ast.rot);
      if (Math.abs(ast.scaleX - 1) > 0.005 || Math.abs(ast.scaleY - 1) > 0.005) {
        c.scale(ast.scaleX, ast.scaleY);
      }

      c.font = `${fontSpec.weight} ${fontSpec.fs}px ${fontSpec.css}`;
      const lh = Math.round(fontSpec.fs * 1.3);
      const maxW = Math.max(...lines.map((l) => c.measureText(l).width), 48);
      const bw = Math.min(W - 28, maxW + Math.round((padXBase || 36) * sc));
      const bh = lines.length * lh + Math.round((padYBase || 22) * sc);
      const rad = pillRadius ? bh / 2 : Math.round(16 * sc);

      if (ast.wipeRatio < 0.999) {
        c.beginPath();
        c.rect(-bw / 2 - 20, -bh / 2 - 20, (bw + 40) * ast.wipeRatio, bh + 40);
        c.clip();
      }

      const mainCol = textColor || '#ffffff';
      const fillBg = bgColor || mainCol;
      const isLightFill = fillBg === '#ffffff' || fillBg === '#facc15' || fillBg === '#38bdf8' || fillBg === '#34d399' || fillBg === '#a3e635';

      let fg = mainCol;
      if (st === 'solidBadge') {
        c.shadowColor = ast.glowBoost > 0 ? fillBg : 'rgba(0,0,0,0.45)';
        c.shadowBlur = 14 + ast.glowBoost * 18;
        c.shadowOffsetY = 4;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, rad);
        c.fillStyle = fillBg;
        c.fill();
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
        fg = bgColor ? mainCol : (isLightFill ? '#09090b' : '#ffffff');
      } else if (st === 'darkGlass') {
        c.shadowColor = ast.glowBoost > 0 ? mainCol : 'rgba(0,0,0,0.52)';
        c.shadowBlur = 16 + ast.glowBoost * 18;
        c.shadowOffsetY = 4;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, rad);
        c.fillStyle = bgColor || 'rgba(10, 10, 14, 0.84)';
        c.fill();
        c.strokeStyle = mainCol === '#ffffff' ? 'rgba(255,255,255,0.28)' : mainCol;
        c.lineWidth = 1.6;
        c.stroke();
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
        fg = mainCol;
      } else if (st === 'outlineBox') {
        c.shadowColor = ast.glowBoost > 0 ? mainCol : 'rgba(0,0,0,0.5)';
        c.shadowBlur = 14 + ast.glowBoost * 18;
        c.shadowOffsetY = 3;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, rad);
        c.fillStyle = bgColor || 'rgba(10, 10, 14, 0.55)';
        c.fill();
        c.strokeStyle = mainCol;
        c.lineWidth = 2.6;
        c.stroke();
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
        fg = mainCol;
      } else if (st === 'softBox') {
        c.save();
        c.globalAlpha *= 0.72;
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 12;
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, rad);
        c.fillStyle = fillBg;
        c.fill();
        c.restore();
        fg = bgColor ? mainCol : (isLightFill ? '#09090b' : '#ffffff');
      } else if (st === 'neonGlow') {
        c.shadowColor = bgColor || mainCol;
        c.shadowBlur = 24 + ast.glowBoost * 20;
        c.shadowOffsetY = 0;
        fg = '#ffffff';
      } else {
        // 'plain' (배경 없음)
        c.shadowColor = 'rgba(0,0,0,0.85)';
        c.shadowBlur = 14 + ast.glowBoost * 16;
        c.shadowOffsetY = 3;
        fg = mainCol;
      }

      c.fillStyle = fg;
      c.textAlign = 'center';
      c.textBaseline = 'middle';

      let totalChars = rawText ? rawText.length : lines.join(' ').length;
      let budget = ast.charRatio < 0.999 ? Math.max(1, Math.ceil(totalChars * ast.charRatio)) : 99999;
      lines.forEach((ln, li) => {
        if (budget <= 0) return;
        const drawLn = budget >= ln.length ? ln : ln.slice(0, budget);
        budget -= ln.length + 1;
        const ly = (li - (lines.length - 1) / 2) * lh;
        c.fillText(drawLn, 0, ly + 1, bw - 20);
      });
      c.restore();
      return { cx: cx + ast.dx, cy: cy + ast.dy, w: bw, h: bh };
    }

    function getDefaultCutElPos(elKey) {
      const ds = typeof getActiveDesign === 'function' ? getActiveDesign() : null;
      if (elKey === 'badge') {
        if (ds && ds.engine === 'motion') return { x: 0.5, y: 0.065, w: 220, h: 48 };
        if (ds && ds.genre === 'sale') return { x: 0.24, y: 0.055, w: 200, h: 48 };
        return { x: 0.5, y: 0.08, w: 220, h: 50 };
      }
      if (elKey === 'price') {
        if (ds && ds.genre === 'sale' && !ds.high) return { x: 0.5, y: 0.79, w: 340, h: 68 };
        return { x: 0.5, y: 0.56, w: 340, h: 64 };
      }
      if (elKey === 'caption') {
        if (ds && ds.engine === 'motion') return { x: 0.5, y: 0.74, w: 492, h: 112 };
        if (ds && ds.genre === 'sale') return { x: 0.5, y: ds.high ? 0.312 : 0.583, w: 492, h: 108 };
        return { x: 0.5, y: 0.72, w: 468, h: 108 };
      }
      return { x: 0.5, y: 0.5, w: 240, h: 80 };
    }

    function drawCutElementOverridesOverlay(c, W, H, cutIdx, localT, design, V) {
      if (!window.__arLastRenderedBoxes) window.__arLastRenderedBoxes = {};
      window.__arLastRenderedBoxes[cutIdx] = {};
      const ov = cutElementOverrides && cutElementOverrides[cutIdx];
      if (!ov) return;
      const accent = (V && V.accent) || '#facc15';

      // 1) 상단 라벨/배지 커스텀 렌더
      const b = ov.badge;
      if (b && !b.hidden) {
        const hasCustomBadgeStyle = isCutElementPropCustomized(b) || (!!b.text && design && design.head === 'none');
        if (hasCustomBadgeStyle) {
          const bText = String(b.text || (design && design.label) || (V && V.label) || `${cutIdx + 1} CUT`).trim();
          if (bText) {
            const sc = Math.max(0.5, Math.min(2.2, Number(b.scale) || 1));
            const defB = getDefaultCutElPos('badge');
            const bx = (b.customPos && typeof b.x === 'number' ? b.x : defB.x) * W;
            const by = (b.customPos && typeof b.y === 'number' ? b.y : defB.y) * H;
            const fontSpec = resolveArFontSpec(b.font, 800, 18, sc);
            const ast = computeArElementAnimState(b.anim || 'default', localT);
            const rBox = drawStyledArBoxAndText(c, W, H, {
              lines: [bText],
              rawText: bText,
              cx: bx,
              cy: by,
              sc,
              fontSpec,
              boxStyle: b.boxStyle || 'default',
              textColor: b.color || accent,
              bgColor: b.bgColor || '',
              defaultBoxStyle: 'solidBadge',
              pillRadius: true,
              padXBase: 32,
              padYBase: 14,
              ast
            });
            if (rBox) window.__arLastRenderedBoxes[cutIdx].badge = rBox;
          }
        }
      }

      // 2) 혜택/서브 문구 커스텀 렌더
      const p = ov.price;
      if (p && !p.hidden) {
        const hasCustomPrice = isCutElementPropCustomized(p) || !!p.text;
        if (hasCustomPrice) {
          const pText = String(p.text || (typeof arPriceTag === 'function' ? arPriceTag() : '') || (campaign && campaign.discount) || '').trim();
          if (pText) {
            const sc = Math.max(0.5, Math.min(2.2, Number(p.scale) || 1));
            const defP = getDefaultCutElPos('price');
            const px = (p.customPos && typeof p.x === 'number' ? p.x : defP.x) * W;
            const py = (p.customPos && typeof p.y === 'number' ? p.y : defP.y) * H;
            const fontSpec = resolveArFontSpec(p.font, 900, 26, sc);
            const ast = computeArElementAnimState(p.anim || 'default', localT);
            const rBox = drawStyledArBoxAndText(c, W, H, {
              lines: [pText],
              rawText: pText,
              cx: px,
              cy: py,
              sc,
              fontSpec,
              boxStyle: p.boxStyle || 'default',
              textColor: p.color || accent,
              bgColor: p.bgColor || '',
              defaultBoxStyle: 'outlineBox',
              pillRadius: false,
              padXBase: 40,
              padYBase: 18,
              ast
            });
            if (rBox) window.__arLastRenderedBoxes[cutIdx].price = rBox;
          }
        }
      }

      // 3) 메인 컷 자막 커스텀 렌더
      const cap = ov.caption;
      if (cap && !cap.hidden) {
        const hasCustomCap = isCutElementPropCustomized(cap);
        if (hasCustomCap) {
          const raw = (campaign && campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || (campaign && campaign.hook) || '';
          const clean = typeof gCleanCaption === 'function' ? gCleanCaption(raw) : String(raw || '').trim();
          if (clean) {
            const sc = Math.max(0.5, Math.min(2.2, Number(cap.scale) || 1));
            const defC = getDefaultCutElPos('caption');
            const cx = (cap.customPos && typeof cap.x === 'number' ? cap.x : defC.x) * W;
            const cy = (cap.customPos && typeof cap.y === 'number' ? cap.y : defC.y) * H;
            const fontSpec = resolveArFontSpec(cap.font, 800, 34, sc);
            const ast = computeArElementAnimState(cap.anim || 'default', localT);
            c.save();
            c.font = `${fontSpec.weight} ${fontSpec.fs}px ${fontSpec.css}`;
            const maxLineW = W - 84;
            const words = clean.split(' ');
            const lines = [];
            let curLine = '';
            words.forEach((w) => {
              const test = curLine ? `${curLine} ${w}` : w;
              if (c.measureText(test).width > maxLineW && curLine) {
                lines.push(curLine);
                curLine = w;
              } else {
                curLine = test;
              }
            });
            if (curLine) lines.push(curLine);
            c.restore();
            const finalLines = lines.slice(0, 3);
            const rBox = drawStyledArBoxAndText(c, W, H, {
              lines: finalLines,
              rawText: finalLines.join(' '),
              cx,
              cy,
              sc,
              fontSpec,
              boxStyle: cap.boxStyle || 'default',
              textColor: cap.color || '#ffffff',
              bgColor: cap.bgColor || '',
              defaultBoxStyle: 'darkGlass',
              pillRadius: false,
              padXBase: 44,
              padYBase: 28,
              ast
            });
            if (rBox) window.__arLastRenderedBoxes[cutIdx].caption = rBox;
          }
        }
      }
    }

    function getCutElementHitBox(cutIdx, elKey, W, H) {
      const ov = getCutElementOverride(cutIdx);
      if (elKey && elKey.startsWith('overlay:')) {
        const ii = Number(elKey.split(':')[1]);
        const list = getCutOverlayList(cutIdx);
        const it = list[ii];
        if (!it) return null;
        const sc = Math.max(0.5, Math.min(2.4, Number(it.scale) || 1));
        const bw = (it.type === 'sticker' && it.variant !== 'badge' ? 110 : 250) * sc;
        const bh = (it.type === 'sticker' && it.variant !== 'badge' ? 110 : 84) * sc;
        return {
          key: elKey,
          label: it.type === 'text' ? `텍스트: ${String(it.text || '').slice(0, 10)}` : `스티커 #${ii + 1}`,
          cx: (typeof it.x === 'number' ? it.x : 0.5) * W,
          cy: (typeof it.y === 'number' ? it.y : 0.5) * H,
          w: bw,
          h: bh,
          rot: ((Number(it.rot) || 0) * Math.PI) / 180,
          color: '#60a5fa'
        };
      }
      if (elKey === 'caption' || elKey === 'badge' || elKey === 'price') {
        const elObj = ov[elKey] || {};
        const sc = Math.max(0.6, Math.min(2.0, Number(elObj.scale) || 1));
        const rendered = window.__arLastRenderedBoxes && window.__arLastRenderedBoxes[cutIdx] && window.__arLastRenderedBoxes[cutIdx][elKey];
        const def = getDefaultCutElPos(elKey);
        const labelMap = {
          caption: elObj.hidden ? '컷 자막 (숨김)' : '💬 컷 자막',
          badge: elObj.hidden ? '상단 배지 (숨김)' : '🏷️ 상단 라벨/배지',
          price: elObj.hidden ? '혜택 문구 (숨김)' : '💰 혜택/서브 문구'
        };
        const cx = rendered ? rendered.cx : ((elObj.customPos && typeof elObj.x === 'number' ? elObj.x : def.x) * W);
        const cy = rendered ? rendered.cy : ((elObj.customPos && typeof elObj.y === 'number' ? elObj.y : def.y) * H);
        const bw = rendered ? rendered.w : Math.min(W - 36, def.w * sc);
        const bh = rendered ? rendered.h : (def.h * sc);
        return {
          key: elKey,
          label: labelMap[elKey],
          cx,
          cy,
          w: bw,
          h: bh,
          rot: 0,
          color: '#4cc38a'
        };
      }
      if (elKey === 'photo') {
        const ph = ov.photo || {};
        return {
          key: 'photo',
          label: `🖼️ 배경 구도 (${Math.round((ph.scale || 1) * 100)}%)`,
          cx: W / 2,
          cy: H / 2,
          w: W - 28,
          h: H - 28,
          rot: 0,
          color: '#60a5fa'
        };
      }
      return null;
    }

    function drawCutElementSelectionBox(c, W, H, cutIdx) {
      if (window.__exportingVideo) return;
      if (window.__arPinnedCut !== cutIdx) return;
      if (!window.__arCutEditorOpen && !window.__arInlineEditActive && !window.__arDirectCanvasMode && window.__arSelectedOverlayIdx < 0) return;

      let activeKey = window.__arActiveCutElKey || 'caption';
      if (window.__arSelectedOverlayIdx >= 0) {
        activeKey = `overlay:${window.__arSelectedOverlayIdx}`;
      }
      const box = getCutElementHitBox(cutIdx, activeKey, W, H);
      if (!box) return;

      c.save();
      c.translate(box.cx, box.cy);
      if (box.rot) c.rotate(box.rot);

      const hw = box.w / 2;
      const hh = box.h / 2;
      const col = box.color || '#4cc38a';

      // 선택 영역 테두리
      c.strokeStyle = col;
      c.lineWidth = 2;
      c.setLineDash([7, 5]);
      gRoundRect(c, -hw, -hh, box.w, box.h, 12);
      c.stroke();
      c.setLineDash([]);

      // 모서리 핸들 4개
      const corners = [
        [-hw, -hh],
        [hw, -hh],
        [-hw, hh],
        [hw, hh]
      ];
      corners.forEach(([kx, ky]) => {
        c.fillStyle = '#ffffff';
        c.strokeStyle = col;
        c.lineWidth = 2;
        c.beginPath();
        c.rect(kx - 5, ky - 5, 10, 10);
        c.fill();
        c.stroke();
      });

      // 상단 라벨 필 (strokeText 사용 금지, fillRect + fillText만 사용)
      c.font = `700 12px 'Pretendard Variable', 'Pretendard', sans-serif`;
      const tagTxt = box.label;
      const tagW = c.measureText(tagTxt).width + 18;
      const tagH = 22;
      const tagY = -hh - tagH - 6 > -H / 2 + 8 ? -hh - tagH - 6 : -hh + 8;
      gRoundRect(c, -tagW / 2, tagY, tagW, tagH, 11);
      c.fillStyle = col;
      c.fill();
      c.fillStyle = '#09090b';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(tagTxt, 0, tagY + tagH / 2 + 0.5);

      c.restore();
    }

    function drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V) {
      if (t >= mainDuration) return;
      const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
      const localT = t - cutIdx * cutDur;
      const filterId = (campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
      if (filterId && filterId !== 'none') {
        const fObj = CUT_FILTER_OPTIONS.find((f) => f.id === filterId);
        if (fObj) {
          c.save();
          if (fObj.mono) {
            c.globalCompositeOperation = 'saturation';
            c.fillStyle = '#000000';
            c.fillRect(0, 0, W, H);
          } else if (fObj.tint) {
            c.globalCompositeOperation = fObj.mode || 'overlay';
            c.fillStyle = fObj.tint;
            c.fillRect(0, 0, W, H);
          }
          c.restore();
        }
      }
      const frameKey = (campaign.cutFrames && campaign.cutFrames[cutIdx]) || '';
      if (frameKey) drawCutFrameOverlay(c, W, H, frameKey, t);
      const decoKey = (campaign.cutDecos && campaign.cutDecos[cutIdx]) || '';
      if (decoKey && decoKey !== 'none') {
        const extraKeys = ['snow', 'petals', 'bubbles', 'bokeh', 'hearts', 'sparks', 'scanline', 'prism'];
        if (extraKeys.includes(decoKey)) {
          drawExtraCutDeco(c, W, H, t, decoKey);
        } else if (typeof kitDeco === 'function') {
          const specLike = { deco: decoKey, label: (design && design.label) || '' };
          const KLike = { hl: (V && V.accent) || '#facc15', light: !!(design && design.light), bgAccent: false };
          c.save();
          kitDeco(c, W, H, t, specLike, V || { accent: '#facc15' }, KLike, 'under');
          kitDeco(c, W, H, t, specLike, V || { accent: '#facc15' }, KLike, 'over');
          c.restore();
        }
      }
      drawCutElementOverridesOverlay(c, W, H, cutIdx, localT, design, V);
      const overlays = (campaign.cutOverlays && campaign.cutOverlays[cutIdx]) || [];
      if (Array.isArray(overlays) && overlays.length) {
        overlays.forEach((item) => drawSingleCutOverlayItem(c, W, H, item, localT));
      }
      if (typeof drawCutStrokesOverlay === 'function') drawCutStrokesOverlay(c, W, H, cutIdx);
      drawCutElementSelectionBox(c, W, H, cutIdx);
    }

    // 좌우 스와이프 줄: 손가락은 기본 가로 스크롤, PC 는 마우스로 끌기 + 세로 휠을 가로로. 끄는 중에는 버튼 클릭 무시
    function arUpdateSwipeFade(row) {
      const max = row.scrollWidth - row.clientWidth;
      row.classList.toggle('fade-l', max > 2 && row.scrollLeft > 2);
      row.classList.toggle('fade-r', max > 2 && row.scrollLeft < max - 2);
    }
    function arInitSwipeRow(row) {
      if (!row || row.dataset.swipeReady) return;
      row.dataset.swipeReady = '1';
      let startX = 0, startLeft = 0, down = false, moved = false;
      row.addEventListener('scroll', () => arUpdateSwipeFade(row), { passive: true });
      window.addEventListener('resize', () => arUpdateSwipeFade(row));
      row.addEventListener('wheel', (e) => {
        if (row.scrollWidth <= row.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        row.scrollLeft += e.deltaY;
        e.preventDefault();
      }, { passive: false });
      row.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return; // 손가락은 브라우저 기본 스크롤
        down = true; moved = false; startX = e.clientX; startLeft = row.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 6) { moved = true; row.classList.add('is-dragging'); }
        if (moved) row.scrollLeft = startLeft - dx;
      });
      window.addEventListener('pointerup', () => {
        if (!down) return;
        down = false;
        row.classList.remove('is-dragging');
        if (moved) setTimeout(() => { moved = false; }, 0);
      });
      // 끌기로 끝난 경우 버튼이 눌리지 않게
      row.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
    }

    function renderPreviewCutPinBar() {
      const bar = document.getElementById('previewCutPinBar');
      if (!bar) return;
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      const decos = Array.isArray(campaign.cutDecos) ? campaign.cutDecos : [];
      const ovs = Array.isArray(campaign.cutOverlays) ? campaign.cutOverlays : [];
      const flts = Array.isArray(campaign.cutFilters) ? campaign.cutFilters : [];
      const frms = Array.isArray(campaign.cutFrames) ? campaign.cutFrames : [];
      const stks = Array.isArray(campaign.cutStrokes) ? campaign.cutStrokes : [];
      let anyEdited = false;
      bar.innerHTML = Array.from({ length: n }, (_, i) => {
        const pinned = window.__arPinnedCut === i;
        const hasDeco = (decos[i] && decos[i] !== 'none') || (flts[i] && flts[i] !== 'none') || !!frms[i] || (Array.isArray(ovs[i]) && ovs[i].length > 0) || (Array.isArray(stks[i]) && stks[i].length > 0) || hasAnyCutElementOverride(i);
        if (hasDeco) anyEdited = true;
        return `<button type="button" onclick="togglePinPreviewCut(${i})" class="h-7 min-w-[32px] px-2 shrink-0 rounded-[8px] text-[12px] font-semibold border cursor-pointer transition ${pinned ? 'bg-white border-white text-[#09090b]' : hasDeco ? 'bg-[#facc15]/15 border-[#facc15]/60 text-[#fde047]' : 'bg-white/5 border-white/10 text-[#a1a1a6] hover:text-white'}" title="${i + 1}번 컷 요소별 편집">${i + 1}${hasDeco ? '✦' : ''}</button>`;
      }).join('');
      const clearBtn = document.getElementById('clearAllCutEditsBtn');
      if (clearBtn) clearBtn.classList.toggle('hidden', !anyEdited);
      arInitSwipeRow(bar);
      if (typeof window.__arPinnedCut === 'number' && bar.children[window.__arPinnedCut]) {
        const b = bar.children[window.__arPinnedCut];
        const left = b.offsetLeft - bar.offsetLeft, right = left + b.offsetWidth;
        if (left < bar.scrollLeft || right > bar.scrollLeft + bar.clientWidth) bar.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' });
      }
      arUpdateSwipeFade(bar);
      renderIgEditorHud();
      renderCutOverlayEditorLayer();
      if (typeof renderCutEditorPanel === 'function') renderCutEditorPanel();
      if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
    }

    function renderIgEditorHud() {
      const hud = document.getElementById('igEditorHud');
      const badge = document.getElementById('igCutBadge');
      const undoBtn = document.getElementById('igUndoBtn');
      const selBar = document.getElementById('igSelectedBar');
      const slider = document.getElementById('igSelectedScaleSlider');
      const alphaBtn = document.getElementById('igSelectedAlphaBtn');
      const animBtn = document.getElementById('igSelectedAnimBtn');
      const editBtn = document.getElementById('igSelectedEditBtn');
      const presetHandle = document.getElementById('presetHandle');
      if (!hud) return;
      const cutIdx = window.__arPinnedCut;
      const active = typeof cutIdx === 'number' && cutIdx >= 0;
      hud.classList.toggle('hidden', !active);
      if (presetHandle) presetHandle.classList.toggle('hidden', active);
      if (!active) {
        closeIgSheet();
        closeIgTextCompose(false);
        return;
      }
      if (badge) badge.textContent = `${cutIdx + 1}컷 편집`;
      if (undoBtn) undoBtn.classList.toggle('hidden', !window.__arOverlayUndo || window.__arOverlayUndo.length === 0);
      const list = getCutOverlayList(cutIdx);
      const selIdx = window.__arSelectedOverlayIdx;
      const selItem = selIdx >= 0 ? list[selIdx] : null;
      if (selBar) selBar.classList.toggle('hidden', !selItem);
      if (selItem) {
        if (slider) slider.value = Number(selItem.scale) || 1;
        if (alphaBtn) alphaBtn.textContent = `${Math.round((typeof selItem.alpha === 'number' ? selItem.alpha : 1) * 100)}%`;
        if (animBtn) {
          const aObj = CUT_OVERLAY_ANIMS.find((a) => a.id === (selItem.anim || 'static')) || CUT_OVERLAY_ANIMS[0];
          animBtn.textContent = aObj.label;
        }
        const canEdit = selItem.type === 'text' || selItem.style === 'photo' || (selItem.type === 'sticker' && selItem.variant === 'widget' && ['loc', 'poll', 'tag', 'dm'].includes(selItem.key));
        if (editBtn) editBtn.classList.toggle('hidden', !canEdit);
      }
    }

    function renderIgStickerSheetBody() {
      const body = document.getElementById('igSheetContent');
      if (!body) return;
      const cutIdx = window.__arPinnedCut;
      const stTab = window.__arIgStickerTab || 'widget';
      const tabsHtml = `<div class="grid grid-cols-5 gap-1 bg-black/40 p-0.5 rounded-[10px] border border-white/10 text-[11px]">
        ${[
          { id: 'widget', label: '위젯' },
          { id: 'frame', label: '프레임' },
          { id: 'doodle', label: '두들' },
          { id: 'badge', label: '배지' },
          { id: 'emoji', label: '이모지' }
        ].map((t) => `<button type="button" onclick="window.__arIgStickerTab='${t.id}';renderIgStickerSheetBody()" class="py-1 rounded-[8px] font-semibold cursor-pointer transition ${stTab === t.id ? 'bg-white text-[#09090b]' : 'text-white/65 hover:text-white'}">${t.label}</button>`).join('')}
      </div>`;
      let inner = '';
      if (stTab === 'widget') {
        inner = `<button type="button" onclick="document.getElementById('igPhotoStickerInput').click()" class="w-full mb-2 py-2 px-3 rounded-[12px] bg-white/12 hover:bg-white/20 border border-dashed border-white/30 text-[12px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition">📷 내 사진 스티커 올리기 <span class="text-[10px] font-normal text-white/65">(갤러리 사진)</span></button><div class="grid grid-cols-2 gap-1.5">${CUT_STICKER_WIDGETS.map((w) =>
          `<button type="button" onclick="addCutStickerOverlay('widget','${w.key}');closeIgSheet()" class="p-2 rounded-[12px] border border-white/15 text-left cursor-pointer active:scale-95 transition shadow" style="background:${w.bg || 'rgba(255,255,255,0.08)'}">
            <div class="text-[12px] font-bold text-white">${w.label}</div>
            <div class="text-[10px] text-white/75 truncate">${w.sub}</div>
          </button>`
        ).join('')}</div>`;
      } else if (stTab === 'frame') {
        const curFr = (campaign.cutFrames && campaign.cutFrames[cutIdx]) || '';
        inner = `<div class="grid grid-cols-2 gap-1.5">${CUT_STICKER_FRAMES.map((fr) => {
          const on = curFr === fr.key;
          return `<button type="button" onclick="setCutFrame(${cutIdx}, '${fr.key}');closeIgSheet()" class="p-2 rounded-[12px] border text-left cursor-pointer active:scale-95 transition ${on ? 'bg-white text-[#09090b] border-white' : 'bg-white/8 hover:bg-white/15 border-white/10 text-white'}">
            <div class="text-[12px] font-bold">${fr.label}</div>
            <div class="text-[10px] opacity-65 truncate">${fr.sub}</div>
          </button>`;
        }).join('')}</div>`;
      } else if (stTab === 'doodle') {
        inner = `<div class="grid grid-cols-4 gap-1.5">${CUT_STICKER_DOODLES.map((d, di) =>
          `<button type="button" onclick="addCutStickerOverlay('doodle', ${di});closeIgSheet()" class="py-2 px-1 rounded-[12px] bg-white/8 hover:bg-white/15 border border-white/10 flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition">
            <span class="w-4 h-4 rounded-full border border-white/30" style="background:${d.color}"></span>
            <span class="text-[10px] font-semibold text-white">${d.label}</span>
          </button>`
        ).join('')}</div>`;
      } else if (stTab === 'badge') {
        inner = `<div class="flex flex-wrap gap-1.5 pt-0.5">${CUT_STICKER_BADGES.map((b, bi) =>
          `<button type="button" onclick="addCutStickerOverlay('badge', ${bi});closeIgSheet()" class="px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer active:scale-95 transition" style="background:${b.bg};color:${b.fg}">${b.text}</button>`
        ).join('')}</div>`;
      } else {
        inner = `<div class="grid grid-cols-7 gap-1.5">${CUT_STICKER_EMOJIS.map((em) =>
          `<button type="button" onclick="addCutStickerOverlay('emoji','${em}');closeIgSheet()" class="h-9 rounded-[10px] bg-white/5 hover:bg-white/15 text-[18px] flex items-center justify-center cursor-pointer active:scale-90 transition">${em}</button>`
        ).join('')}</div>`;
      }
      body.innerHTML = tabsHtml + inner;
    }

    function openIgSheet(mode) {
      const cutIdx = window.__arPinnedCut;
      if (cutIdx < 0) return;
      const back = document.getElementById('igSheetBackdrop');
      const title = document.getElementById('igSheetTitle');
      const body = document.getElementById('igSheetContent');
      const applyAll = document.getElementById('igSheetApplyAllBtn');
      if (!back || !body) return;
      window.__arIgSheetMode = mode;
      back.classList.remove('hidden');
      if (mode === 'deco') {
        if (title) title.textContent = `${cutIdx + 1}컷 꾸밈효과 (16종)`;
        if (applyAll) applyAll.classList.remove('hidden');
        const cur = (campaign.cutDecos && campaign.cutDecos[cutIdx]) || 'none';
        body.innerHTML = `<div class="grid grid-cols-4 gap-1.5">${CUT_DECO_OPTIONS.map((o) => {
          const on = cur === o.id;
          return `<button type="button" onclick="setCutDeco(${cutIdx}, '${o.id}');closeIgSheet()" class="py-2 px-1 rounded-[10px] text-[11px] border cursor-pointer transition ${on ? 'bg-white text-[#09090b] border-white font-bold' : 'bg-white/5 border-white/10 text-[#e4e4e7] hover:bg-white/10'}">${o.label}</button>`;
        }).join('')}</div>`;
      } else if (mode === 'filter') {
        if (title) title.textContent = `${cutIdx + 1}컷 색감 필터 (16종)`;
        if (applyAll) applyAll.classList.remove('hidden');
        const curF = (campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
        body.innerHTML = `<div class="grid grid-cols-4 gap-1.5">${CUT_FILTER_OPTIONS.map((f) => {
          const on = curF === f.id;
          return `<button type="button" onclick="setCutFilter(${cutIdx}, '${f.id}');closeIgSheet()" class="py-2 px-1 rounded-[10px] text-[11px] border flex flex-col items-center gap-1 cursor-pointer transition ${on ? 'bg-white text-[#09090b] border-white font-bold' : 'bg-white/5 border-white/10 text-[#e4e4e7] hover:bg-white/10'}">
            <span class="w-4 h-4 rounded-full border border-white/30" style="background:${f.swatch || '#52525b'}"></span>
            <span>${f.label}</span>
          </button>`;
        }).join('')}</div>`;
      } else {
        if (title) title.textContent = '스티커 · 프레임';
        if (applyAll) applyAll.classList.add('hidden');
        renderIgStickerSheetBody();
      }
    }
    function setCutFilter(idx, filterId) {
      if (!Array.isArray(campaign.cutFilters)) campaign.cutFilters = [];
      campaign.cutFilters[idx] = filterId;
      saveCutFilters();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }
    function closeIgSheet() {
      const back = document.getElementById('igSheetBackdrop');
      if (back) back.classList.add('hidden');
    }

    window.__arEditingOverlayIdx = -1;
    function renderIgComposeFontBar() {
      const fBar = document.getElementById('igComposeFontBar');
      if (!fBar) return;
      fBar.innerHTML = CUT_TEXT_FONTS.map((f) => {
        const on = (window.__arCutTextFont || 'dohyeon') === f.id;
        return `<button type="button" onclick="window.__arCutTextFont='${f.id}';previewIgComposeStyle();renderIgComposeFontBar()" style="font-family:${f.css};font-weight:${f.weight};" class="px-2.5 py-1 rounded-full text-[11px] shrink-0 border cursor-pointer transition ${on ? 'bg-white text-[#09090b] border-white' : 'bg-black/45 text-white/85 border-white/20 hover:border-white/50'}">${f.label}</button>`;
      }).join('');
    }
    function openIgTextCompose(editIdx) {
      const cutIdx = window.__arPinnedCut;
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      closeIgSheet();
      const ov = document.getElementById('igTextComposeOverlay');
      const ta = document.getElementById('igComposeTextarea');
      if (!ov || !ta) return;
      window.__arEditingOverlayIdx = typeof editIdx === 'number' ? editIdx : -1;
      if (window.__arEditingOverlayIdx >= 0) {
        const it = getCutOverlayList(cutIdx)[window.__arEditingOverlayIdx];
        if (it && it.type === 'text') {
          ta.value = it.text || '';
          window.__arCutTextFont = it.font || 'dohyeon';
          window.__arCutTextStyle = it.style || 'box';
          window.__arCutTextAlign = it.align || 'center';
          window.__arCutTextColor = it.color || '#ffffff';
        }
      } else {
        ta.value = '';
      }
      renderIgComposeFontBar();
      openIgTextComposeColors();
      ov.classList.remove('hidden');
      previewIgComposeStyle();
      setTimeout(() => ta.focus(), 30);
    }
    function openIgTextComposeColors() {
      const colBar = document.getElementById('igComposeColorBar');
      if (!colBar) return;
      colBar.innerHTML = CUT_TEXT_COLORS.map((col) => {
        const on = window.__arCutTextColor === col;
        return `<button type="button" onclick="window.__arCutTextColor='${col}';previewIgComposeStyle();openIgTextComposeColors()" class="w-5 h-5 rounded-full shrink-0 border-2 cursor-pointer transition ${on ? 'scale-120 border-white' : 'border-white/40'}" style="background:${col}"></button>`;
      }).join('');
    }
    function cycleIgComposeStyle() {
      const ids = CUT_TEXT_STYLES.map((s) => s.id);
      const cur = ids.indexOf(window.__arCutTextStyle || 'box');
      window.__arCutTextStyle = ids[(cur + 1) % ids.length];
      previewIgComposeStyle();
    }
    function cycleIgComposeAlign() {
      const ids = CUT_TEXT_ALIGNS.map((a) => a.id);
      const cur = ids.indexOf(window.__arCutTextAlign || 'center');
      window.__arCutTextAlign = ids[(cur + 1) % ids.length];
      previewIgComposeStyle();
    }
    function previewIgComposeStyle() {
      const ta = document.getElementById('igComposeTextarea');
      const btn = document.getElementById('igComposeStyleBtn');
      const alignBtn = document.getElementById('igComposeAlignBtn');
      const st = window.__arCutTextStyle || 'box';
      const align = window.__arCutTextAlign || 'center';
      const col = window.__arCutTextColor || '#ffffff';
      const fontObj = CUT_TEXT_FONTS.find((f) => f.id === (window.__arCutTextFont || 'dohyeon')) || CUT_TEXT_FONTS[0];
      const stObj = CUT_TEXT_STYLES.find((s) => s.id === st) || CUT_TEXT_STYLES[0];
      const alObj = CUT_TEXT_ALIGNS.find((a) => a.id === align) || CUT_TEXT_ALIGNS[0];
      if (btn) btn.textContent = stObj.label;
      if (alignBtn) alignBtn.textContent = alObj.label;
      if (!ta) return;
      ta.style.fontFamily = fontObj.css;
      ta.style.fontWeight = String(fontObj.weight);
      ta.style.textAlign = align;
      const isLight = col === '#ffffff' || col === '#facc15' || col === '#38bdf8' || col === '#34d399' || col === '#a3e635';
      if (st === 'box' || st === 'softbox' || st === 'highlight') {
        ta.style.backgroundColor = st === 'softbox' ? `${col}b8` : col;
        ta.style.color = isLight ? '#09090b' : '#ffffff';
        ta.style.padding = '8px 14px';
        ta.style.borderRadius = '12px';
        ta.style.textShadow = 'none';
        ta.style.webkitTextStroke = '0px transparent';
      } else if (st === 'neon') {
        ta.style.backgroundColor = 'transparent';
        ta.style.color = '#ffffff';
        ta.style.padding = '4px';
        ta.style.textShadow = `0 0 12px ${col}, 0 0 22px ${col}`;
        ta.style.webkitTextStroke = '0px transparent';
      } else if (st === 'outline') {
        ta.style.backgroundColor = 'transparent';
        ta.style.color = col;
        ta.style.padding = '4px';
        ta.style.textShadow = 'none';
        ta.style.webkitTextStroke = `1.5px ${col === '#09090b' ? '#ffffff' : '#09090b'}`;
      } else {
        ta.style.backgroundColor = 'transparent';
        ta.style.color = col;
        ta.style.padding = '4px';
        ta.style.textShadow = '0 2px 10px rgba(0,0,0,0.85)';
        ta.style.webkitTextStroke = '0px transparent';
      }
    }
    function closeIgTextCompose(commit) {
      const ov = document.getElementById('igTextComposeOverlay');
      const ta = document.getElementById('igComposeTextarea');
      if (ov) ov.classList.add('hidden');
      const cutIdx = window.__arPinnedCut;
      if (!commit || typeof cutIdx !== 'number' || cutIdx < 0 || !ta) return;
      const txt = ta.value.trim();
      if (!txt) return;
      pushCutOverlayUndo();
      const list = getCutOverlayList(cutIdx);
      if (window.__arEditingOverlayIdx >= 0 && list[window.__arEditingOverlayIdx]) {
        const it = list[window.__arEditingOverlayIdx];
        it.text = txt;
        it.font = window.__arCutTextFont || 'dohyeon';
        it.style = window.__arCutTextStyle || 'box';
        it.align = window.__arCutTextAlign || 'center';
        it.color = window.__arCutTextColor || '#ffffff';
        window.__arSelectedOverlayIdx = window.__arEditingOverlayIdx;
      } else {
        const offset = (list.length % 4) * 0.06;
        list.push({
          type: 'text',
          text: txt,
          font: window.__arCutTextFont || 'dohyeon',
          style: window.__arCutTextStyle || 'box',
          align: window.__arCutTextAlign || 'center',
          color: window.__arCutTextColor || '#ffffff',
          x: 0.5,
          y: Math.min(0.8, 0.38 + offset),
          scale: 1.0,
          rot: 0
        });
        window.__arSelectedOverlayIdx = list.length - 1;
      }
      window.__arEditingOverlayIdx = -1;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function addCutStickerOverlay(variant, val) {
      const idx = window.__arPinnedCut;
      if (idx < 0) return;
      pushCutOverlayUndo();
      const list = getCutOverlayList(idx);
      const offset = ((list.length % 5) - 2) * 0.04;
      if (variant === 'widget') {
        list.push({ type: 'sticker', variant: 'widget', key: String(val || 'loc'), x: 0.5, y: 0.35 + offset, scale: 1.0, rot: 0 });
      } else if (variant === 'doodle') {
        const d = CUT_STICKER_DOODLES[Number(val)] || CUT_STICKER_DOODLES[0];
        list.push({ type: 'sticker', variant: 'doodle', key: d.key, color: d.color, x: 0.5 + offset, y: 0.45 + offset, scale: 1.0, rot: 0 });
      } else if (variant === 'badge') {
        const b = CUT_STICKER_BADGES[Number(val)] || CUT_STICKER_BADGES[0];
        list.push({ type: 'sticker', variant: 'badge', text: b.text, bg: b.bg, fg: b.fg, x: 0.5 + offset, y: 0.28 + Math.abs(offset), scale: 1.0, rot: -6 });
      } else {
        list.push({ type: 'sticker', variant: 'emoji', text: String(val || '✨'), x: 0.5 + offset, y: 0.45 + offset, scale: 1.0, rot: 0 });
      }
      window.__arSelectedOverlayIdx = list.length - 1;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function setSelectedOverlayScale(val) {
      const idx = window.__arPinnedCut;
      const ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      it.scale = Math.max(0.45, Math.min(2.5, Number(val) || 1));
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderCutOverlayEditorLayer();
    }
    function nudgeSelectedOverlayRot(dRot) {
      const idx = window.__arPinnedCut;
      const ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      it.rot = Math.max(-45, Math.min(45, (it.rot || 0) + dRot));
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderCutOverlayEditorLayer();
    }
    function resetSelectedOverlayRot() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      it.rot = 0;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderCutOverlayEditorLayer();
    }
    function cycleSelectedOverlayAlpha() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      const steps = [1, 0.72, 0.45];
      const cur = typeof it.alpha === 'number' ? it.alpha : 1;
      const next = steps.find((s) => s < cur - 0.05) || 1;
      it.alpha = next;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderIgEditorHud();
    }
    function cycleSelectedOverlayAnim() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      const ids = CUT_OVERLAY_ANIMS.map((a) => a.id);
      const cur = ids.indexOf(it.anim || 'static');
      it.anim = ids[(cur + 1) % ids.length];
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderIgEditorHud();
    }
    function duplicateSelectedOverlay() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const list = getCutOverlayList(idx);
      const it = list[ii];
      if (!it) return;
      pushCutOverlayUndo();
      const clone = JSON.parse(JSON.stringify(it));
      clone.x = Math.min(0.88, (clone.x ?? 0.5) + 0.05);
      clone.y = Math.min(0.88, (clone.y ?? 0.5) + 0.05);
      list.push(clone);
      window.__arSelectedOverlayIdx = list.length - 1;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }
    function copySelectedOverlayToAllCuts() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      pushCutOverlayUndo();
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      for (let k = 0; k < n; k++) {
        if (k === idx) continue;
        getCutOverlayList(k).push(JSON.parse(JSON.stringify(it)));
      }
      saveCutOverlays();
      renderPreviewCutPinBar();
      if (typeof arToast === 'function') arToast('📌 선택한 요소를 모든 컷에 복사했습니다');
    }
    function editSelectedOverlayItem() {
      const idx = window.__arPinnedCut, ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      const it = getCutOverlayList(idx)[ii];
      if (!it) return;
      if (it.type === 'text') {
        openIgTextCompose(ii);
      } else if (it.type === 'sticker' && it.style === 'photo') {
        const shapes = ['round', 'circle', 'polaroid', 'rect'];
        const nextShape = shapes[(shapes.indexOf(it.photoShape || 'round') + 1) % shapes.length];
        pushCutOverlayUndo();
        it.photoShape = nextShape;
        saveCutOverlays();
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      } else if (it.type === 'sticker' && it.variant === 'widget') {
        const next = prompt('위젯 문구 수정', it.customText || '');
        if (next !== null) {
          pushCutOverlayUndo();
          it.customText = next.trim();
          saveCutOverlays();
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        }
      }
    }
    function removeSelectedOverlay() {
      const idx = window.__arPinnedCut;
      const ii = window.__arSelectedOverlayIdx;
      if (idx < 0 || ii < 0) return;
      pushCutOverlayUndo();
      getCutOverlayList(idx).splice(ii, 1);
      window.__arSelectedOverlayIdx = -1;
      saveCutOverlays();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function renderCutOverlayEditorLayer() {
      const layer = document.getElementById('cutOverlayEditorLayer');
      const vp = document.getElementById('previewViewport');
      const rCanvas = document.getElementById('reelCanvas');
      if (!layer) return;
      const cutIdx = window.__arPinnedCut;
      const isEditing = typeof cutIdx === 'number' && cutIdx >= 0;
      const directMode = isEditing && (window.__arDirectCanvasMode || window.__arCutEditorOpen || window.__arInlineEditActive);

      if (vp) {
        vp.classList.toggle('ar-el-canvas-mode', !!directMode);
        vp.classList.toggle('ar-inline-edit-active', !!(isEditing && window.__arInlineEditActive));
      }
      if (rCanvas) rCanvas.classList.toggle('ar-el-canvas-interactive', !!directMode);

      if (!isEditing) {
        layer.classList.add('hidden');
        layer.classList.remove('pointer-events-auto');
        layer.classList.add('pointer-events-none');
        layer.innerHTML = '';
        return;
      }

      const list = getCutOverlayList(cutIdx);
      const ov = getCutElementOverride(cutIdx);
      const activeKey = window.__arSelectedOverlayIdx >= 0
        ? `overlay:${window.__arSelectedOverlayIdx}`
        : (window.__arActiveCutElKey || 'caption');

      if (!list.length && !directMode) {
        layer.classList.add('hidden');
        layer.innerHTML = '';
        return;
      }
      layer.classList.remove('hidden', 'pointer-events-none');
      layer.classList.add('pointer-events-auto');

      // 기본 컷 요소(자막·배지·혜택문구) 직접 선택·드래그 히트박스 (캔버스 실제 좌표와 % 단위로 정확히 일치)
      const baseBoxes = directMode ? ['badge', 'price', 'caption'].map((key) => {
        const hb = getCutElementHitBox(cutIdx, key, 540, 960);
        const titleMap = {
          badge: '상단 라벨/배지 (드래그하여 이동)',
          price: '혜택/서브 문구 (드래그하여 이동)',
          caption: '컷 자막 (드래그하여 이동)'
        };
        return {
          key,
          x: hb ? hb.cx / 540 : 0.5,
          y: hb ? hb.cy / 960 : 0.5,
          wPct: hb ? (hb.w / 540) * 100 : 40,
          hPct: hb ? (hb.h / 960) * 100 : 10,
          title: titleMap[key]
        };
      }) : [];

      const baseBoxesHtml = baseBoxes.map((b) => {
        const isSel = activeKey === b.key;
        const leftPct = (b.x * 100).toFixed(2);
        const topPct = (b.y * 100).toFixed(2);
        const wPct = Math.max(12, Math.min(96, b.wPct)).toFixed(2);
        const hPct = Math.max(4, Math.min(40, b.hPct)).toFixed(2);
        return `
          <div data-el-key="${b.key}"
               title="${b.title}"
               style="left:${leftPct}%;top:${topPct}%;width:${wPct}%;height:${hPct}%;transform:translate(-50%,-50%);touch-action:none;"
               class="absolute cursor-move rounded-[10px] ${isSel ? 'active' : 'hover:bg-white/5'}">
          </div>
        `;
      }).join('');

      const inlineBadgeHtml = window.__arInlineEditActive
        ? `<div class="ar-inline-edit-badge pointer-events-none">⚡ ${cutIdx + 1}컷 인라인 빠른 편집 · 드래그하여 이동</div>`
        : '';

      const hintHtml = (!window.__arInlineEditActive && directMode)
        ? `<div class="ar-el-canvas-hint pointer-events-none">${activeKey === 'photo' ? '드래그하여 사진 구도 이동' : '요소를 클릭·드래그해 위치 조절 (길게 눌러 빠른 편집)'}</div>`
        : '';

      layer.innerHTML = `
        <div id="cutSnapV" class="hidden absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#38bdf8]/80 pointer-events-none"></div>
        <div id="cutSnapH" class="hidden absolute left-0 right-0 top-1/2 h-[1px] bg-[#38bdf8]/80 pointer-events-none"></div>
        ${inlineBadgeHtml}
        ${hintHtml}
        ${baseBoxesHtml}
      ` + list.map((it, ii) => {
        const sel = window.__arSelectedOverlayIdx === ii || activeKey === `overlay:${ii}`;
        const leftPct = ((typeof it.x === 'number' ? it.x : 0.5) * 100).toFixed(2);
        const topPct = ((typeof it.y === 'number' ? it.y : 0.5) * 100).toFixed(2);
        const sc = Number(it.scale) || 1;
        const boxW = Math.round((it.type === 'sticker' && it.variant !== 'badge' ? 62 : 130) * Math.min(1.8, Math.max(0.7, sc)));
        const boxH = Math.round((it.type === 'sticker' && it.variant !== 'badge' ? 62 : 44) * Math.min(1.8, Math.max(0.7, sc)));
        return `
          <div data-ov-idx="${ii}"
               ondblclick="if(${it.type === 'text' ? 'true' : 'false'})openIgTextCompose(${ii})"
               style="left:${leftPct}%;top:${topPct}%;width:${boxW}px;height:${boxH}px;transform:translate(-50%,-50%) rotate(${it.rot || 0}deg);touch-action:none;"
               class="absolute cursor-move rounded-[10px] ${sel ? 'active ring-1 ring-white/85 bg-white/5' : ''}">
          </div>
        `;
      }).join('');

      if (!layer._boundDrag) {
        layer._boundDrag = true;
        let dragIdx = -1, dragElKey = '', startX = 0, startY = 0, origX = 0.5, origY = 0.5, moved = false, overTrash = false;
        const onStart = (ev) => {
          const card = ev.target.closest('[data-ov-idx]');
          const elCard = ev.target.closest('[data-el-key]');
          const pt = ev.touches ? ev.touches[0] : ev;
          startX = pt.clientX;
          startY = pt.clientY;
          moved = false;
          overTrash = false;

          if (card) {
            ev.preventDefault();
            dragIdx = Number(card.getAttribute('data-ov-idx'));
            dragElKey = '';
            window.__arSelectedOverlayIdx = dragIdx;
            window.__arActiveCutElKey = `overlay:${dragIdx}`;
            const it = getCutOverlayList(window.__arPinnedCut)[dragIdx];
            origX = it ? (it.x ?? 0.5) : 0.5;
            origY = it ? (it.y ?? 0.5) : 0.5;
            if (rCanvas) rCanvas.classList.add('ar-el-canvas-dragging');
            renderIgEditorHud();
            renderCutEditorPanel();
            if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            return;
          }

          if (elCard && (window.__arDirectCanvasMode || window.__arCutEditorOpen || window.__arInlineEditActive)) {
            ev.preventDefault();
            dragIdx = -1;
            dragElKey = elCard.getAttribute('data-el-key') || 'caption';
            window.__arSelectedOverlayIdx = -1;
            window.__arActiveCutElKey = dragElKey;
            const curOv = getCutElementOverride(window.__arPinnedCut);
            const targetObj = curOv[dragElKey] || {};
            const hb = getCutElementHitBox(window.__arPinnedCut, dragElKey, 540, 960);
            origX = (targetObj.customPos && typeof targetObj.x === 'number') ? targetObj.x : (hb ? hb.cx / 540 : 0.5);
            origY = (targetObj.customPos && typeof targetObj.y === 'number') ? targetObj.y : (hb ? hb.cy / 960 : 0.72);
            if (rCanvas) rCanvas.classList.add('ar-el-canvas-dragging');
            renderIgEditorHud();
            renderCutEditorPanel();
            if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            return;
          }

          // 배경 사진 구도 모드이거나 빈 캔버스 영역을 드래그할 때
          if (window.__arPinnedCut >= 0 && (window.__arDirectCanvasMode || window.__arCutEditorOpen || window.__arInlineEditActive)) {
            ev.preventDefault();
            dragIdx = -1;
            window.__arSelectedOverlayIdx = -1;
            const curKey = window.__arActiveCutElKey || 'caption';
            if (curKey === 'photo' || (!curKey.startsWith('overlay:') && curKey !== 'transition')) {
              dragElKey = curKey === 'deco' ? 'photo' : curKey;
            } else {
              dragElKey = 'photo';
              window.__arActiveCutElKey = 'photo';
            }
            const curOv = getCutElementOverride(window.__arPinnedCut);
            if (dragElKey === 'photo') {
              origX = Number(curOv.photo.panX) || 0;
              origY = Number(curOv.photo.panY) || 0;
            } else {
              const tObj = curOv[dragElKey] || {};
              const hb2 = getCutElementHitBox(window.__arPinnedCut, dragElKey, 540, 960);
              origX = (tObj.customPos && typeof tObj.x === 'number') ? tObj.x : (hb2 ? hb2.cx / 540 : 0.5);
              origY = (tObj.customPos && typeof tObj.y === 'number') ? tObj.y : (hb2 ? hb2.cy / 960 : 0.72);
            }
            if (rCanvas) rCanvas.classList.add('ar-el-canvas-dragging');
            renderIgEditorHud();
            renderCutEditorPanel();
            if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
          } else if (window.__arSelectedOverlayIdx >= 0) {
            window.__arSelectedOverlayIdx = -1;
            renderIgEditorHud();
            renderCutOverlayEditorLayer();
            renderCutEditorPanel();
            if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
          }
        };

        const onMove = (ev) => {
          if ((dragIdx < 0 && !dragElKey) || window.__arPinnedCut < 0) return;
          const rect = layer.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const pt = ev.touches ? ev.touches[0] : ev;
          if (Math.hypot(pt.clientX - startX, pt.clientY - startY) > 4) moved = true;
          const dx = (pt.clientX - startX) / rect.width;
          const dy = (pt.clientY - startY) / rect.height;

          if (dragElKey) {
            const curOv = getCutElementOverride(window.__arPinnedCut);
            const snapV = document.getElementById('cutSnapV');
            const snapH = document.getElementById('cutSnapH');
            if (dragElKey === 'photo') {
              curOv.photo.panX = Math.max(-0.5, Math.min(0.5, Number((origX + dx).toFixed(3))));
              curOv.photo.panY = Math.max(-0.5, Math.min(0.5, Number((origY + dy).toFixed(3))));
            } else if (curOv[dragElKey]) {
              let nx = Math.max(0.06, Math.min(0.94, origX + dx));
              let ny = Math.max(0.05, Math.min(0.94, origY + dy));
              const nearV = Math.abs(nx - 0.5) < 0.025;
              const nearH = Math.abs(ny - 0.5) < 0.025;
              if (nearV) nx = 0.5;
              if (nearH) ny = 0.5;
              if (snapV) snapV.classList.toggle('hidden', !nearV);
              if (snapH) snapH.classList.toggle('hidden', !nearH);
              curOv[dragElKey].x = Number(nx.toFixed(3));
              curOv[dragElKey].y = Number(ny.toFixed(3));
              curOv[dragElKey].customPos = true;
              const boxEl = layer.querySelector(`[data-el-key="${dragElKey}"]`);
              if (boxEl) {
                boxEl.style.left = `${(nx * 100).toFixed(2)}%`;
                boxEl.style.top = `${(ny * 100).toFixed(2)}%`;
              }
            }
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            syncCutInspectorLiveValues(window.__arPinnedCut, dragElKey);
            return;
          }

          let nx = Math.max(0.06, Math.min(0.94, origX + dx));
          let ny = Math.max(0.06, Math.min(0.94, origY + dy));
          const snapV = document.getElementById('cutSnapV');
          const snapH = document.getElementById('cutSnapH');
          const trash = document.getElementById('igTrashZone');
          const topBar = document.getElementById('igTopBar');
          const selBar = document.getElementById('igSelectedBar');
          if (moved) {
            if (topBar) topBar.classList.add('opacity-0');
            if (selBar) selBar.classList.add('hidden');
            if (trash) trash.classList.remove('hidden');
          }
          overTrash = moved && ny > 0.83 && Math.abs(nx - 0.5) < 0.16;
          if (trash) {
            trash.style.transform = overTrash ? 'translateX(-50%) scale(1.22)' : 'translateX(-50%) scale(1)';
            trash.style.backgroundColor = overTrash ? 'rgba(229,72,77,0.9)' : 'rgba(0,0,0,0.65)';
            trash.style.borderColor = overTrash ? '#ffffff' : 'rgba(255,255,255,0.3)';
          }
          const nearV = !overTrash && Math.abs(nx - 0.5) < 0.025;
          const nearH = !overTrash && Math.abs(ny - 0.5) < 0.025;
          if (nearV) nx = 0.5;
          if (nearH) ny = 0.5;
          if (snapV) snapV.classList.toggle('hidden', !nearV);
          if (snapH) snapH.classList.toggle('hidden', !nearH);
          const it = getCutOverlayList(window.__arPinnedCut)[dragIdx];
          if (it) {
            it.x = Number(nx.toFixed(3));
            it.y = Number(ny.toFixed(3));
            const card = layer.querySelector(`[data-ov-idx="${dragIdx}"]`);
            if (card) { card.style.left = `${(nx * 100).toFixed(2)}%`; card.style.top = `${(ny * 100).toFixed(2)}%`; }
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            syncCutInspectorLiveValues(window.__arPinnedCut, `overlay:${dragIdx}`);
          }
        };

        const onEnd = () => {
          if (rCanvas) rCanvas.classList.remove('ar-el-canvas-dragging');
          if (dragElKey) {
            dragElKey = '';
            const snapV = document.getElementById('cutSnapV');
            const snapH = document.getElementById('cutSnapH');
            if (snapV) snapV.classList.add('hidden');
            if (snapH) snapH.classList.add('hidden');
            renderPreviewCutPinBar();
            return;
          }
          if (dragIdx >= 0) {
            const wasTrash = overTrash;
            const finishedIdx = dragIdx;
            dragIdx = -1;
            overTrash = false;
            const snapV = document.getElementById('cutSnapV');
            const snapH = document.getElementById('cutSnapH');
            const trash = document.getElementById('igTrashZone');
            const topBar = document.getElementById('igTopBar');
            if (snapV) snapV.classList.add('hidden');
            if (snapH) snapH.classList.add('hidden');
            if (trash) trash.classList.add('hidden');
            if (topBar) topBar.classList.remove('opacity-0');
            if (wasTrash) {
              pushCutOverlayUndo();
              getCutOverlayList(window.__arPinnedCut).splice(finishedIdx, 1);
              window.__arSelectedOverlayIdx = -1;
              window.__arActiveCutElKey = 'caption';
              if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            }
            saveCutOverlays();
            renderPreviewCutPinBar();
          }
        };
        layer.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        layer.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
      }
    }

    function togglePinPreviewCut(idx) {
      if (typeof idx !== 'number' || idx < 0) {
        window.__arPinnedCut = -1;
        window.__arSelectedOverlayIdx = -1;
        window.__arCutEditorOpen = false;
        window.__arInlineEditActive = false;
        renderPreviewCutPinBar();
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        return;
      }
      if (window.__arPinnedCut === idx) {
        window.__arPinnedCut = -1;
        window.__arSelectedOverlayIdx = -1;
        window.__arCutEditorOpen = false;
        window.__arInlineEditActive = false;
        isPlaying = true;
        const ppBtn = document.getElementById('playPauseBtn');
        if (ppBtn) ppBtn.textContent = '⏸ 일시정지';
        if (typeof updatePlayPauseUI === 'function') updatePlayPauseUI();
      } else {
        window.__arPinnedCut = idx;
        window.__arSelectedOverlayIdx = -1;
        window.__arCutEditorOpen = true;
        if (!window.__arActiveCutElKey || window.__arActiveCutElKey.startsWith('overlay:')) {
          window.__arActiveCutElKey = 'caption';
        }
        isPlaying = false;
        const ppBtn = document.getElementById('playPauseBtn');
        if (ppBtn) ppBtn.textContent = '▶️ 재생';
        if (typeof updatePlayPauseUI === 'function') updatePlayPauseUI();
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const totalCuts = getTargetCutCount();
        const cutDur = mainDur / totalCuts;
        const seekT = idx * cutDur + Math.min(0.55, cutDur * 0.35);
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(seekT);
      }
      renderPreviewCutPinBar();
    }

    // ============================================================================
    // ★ 애니메이션 & 컷 전환 라이브 미리보기 및 전환 설정
    // ============================================================================
    function previewCutElementAnimation(cutIdx) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      if (window.__arAnimPreviewTimer) {
        cancelAnimationFrame(window.__arAnimPreviewTimer);
        window.__arAnimPreviewTimer = null;
      }
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const cutDur = mainDur / n;
      const startT = cutIdx * cutDur;
      const dur = Math.min(0.78, cutDur * 0.65);
      const t0 = performance.now();
      const step = (now) => {
        const elapsed = (now - t0) / 1000;
        const lt = Math.min(dur, elapsed);
        if (window.__timelines && window.__timelines.main) {
          window.__timelines.main.seek(startT + lt);
        }
        if (elapsed < dur) {
          window.__arAnimPreviewTimer = requestAnimationFrame(step);
        } else {
          window.__arAnimPreviewTimer = null;
        }
      };
      window.__arAnimPreviewTimer = requestAnimationFrame(step);
    }

    function setCutTransition(cutIdx, transId) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      if (!Array.isArray(campaign.cutTransitions)) campaign.cutTransitions = [];
      campaign.cutTransitions[cutIdx] = transId || 'default';
      renderPreviewCutPinBar();
      if (transId && transId !== 'default' && transId !== 'none') {
        previewCutElementAnimation(cutIdx);
      } else if (window.__timelines && window.__timelines.main) {
        window.__timelines.main.seek(window.__timelines.main.currentTime);
      }
    }

    function applyCutTransitionToAll(transId) {
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      const val = transId || ((campaign.cutTransitions && campaign.cutTransitions[window.__arPinnedCut]) || 'default');
      campaign.cutTransitions = Array.from({ length: n }, () => val);
      renderPreviewCutPinBar();
      if (typeof arToast === 'function') arToast('🎞 선택한 전환 효과를 모든 컷에 적용했습니다');
    }

    // ============================================================================
    // ★ 프리뷰 캔버스 길게 누르기 (~380ms, 이동 < 8px) → 인라인 빠른 편집 바 (#arInlineEditBar)
    // ============================================================================
    function hitTestCutCanvasElement(cutIdx, nx, ny) {
      const list = getCutOverlayList(cutIdx);
      for (let i = list.length - 1; i >= 0; i--) {
        const it = list[i];
        if (!it) continue;
        const ix = typeof it.x === 'number' ? it.x : 0.5;
        const iy = typeof it.y === 'number' ? it.y : 0.5;
        const sc = Math.max(0.6, Math.min(2.2, Number(it.scale) || 1));
        const hw = (it.type === 'sticker' && it.variant !== 'badge' ? 0.14 : 0.28) * sc;
        const hh = (it.type === 'sticker' && it.variant !== 'badge' ? 0.08 : 0.07) * sc;
        if (Math.abs(nx - ix) <= hw && Math.abs(ny - iy) <= hh) {
          return `overlay:${i}`;
        }
      }
      const ov = getCutElementOverride(cutIdx);
      const bx = typeof ov.badge.x === 'number' ? ov.badge.x : 0.5;
      const by = typeof ov.badge.y === 'number' ? ov.badge.y : 0.08;
      if (Math.abs(nx - bx) <= 0.32 && Math.abs(ny - by) <= 0.08) return 'badge';

      const px = typeof ov.price.x === 'number' ? ov.price.x : 0.5;
      const py = typeof ov.price.y === 'number' ? ov.price.y : 0.56;
      if (Math.abs(nx - px) <= 0.36 && Math.abs(ny - py) <= 0.07) return 'price';

      const cx = typeof ov.caption.x === 'number' ? ov.caption.x : 0.5;
      const cy = typeof ov.caption.y === 'number' ? ov.caption.y : 0.72;
      if (Math.abs(nx - cx) <= 0.44 && Math.abs(ny - cy) <= 0.14) return 'caption';

      if (ny < 0.16) return 'badge';
      if (ny > 0.62) return 'caption';
      if (ny >= 0.48 && ny <= 0.62) return 'price';
      return 'caption';
    }

    function ensureInlineQuickEditBarDOM() {
      let bar = document.getElementById('arInlineEditBar');
      if (bar) return bar;
      const vp = document.getElementById('previewViewport');
      const monitorFrame = vp ? (vp.closest('.monitor-frame') || vp.parentElement) : document.getElementById('mainMonitorColumn');
      if (!monitorFrame) return null;
      bar = document.createElement('section');
      bar.id = 'arInlineEditBar';
      bar.className = 'ar-inline-edit-bar hidden';
      bar.setAttribute('aria-label', '프리뷰 인라인 빠른 편집 바');
      if (vp && vp.nextSibling) {
        vp.parentElement.insertBefore(bar, vp.nextSibling);
      } else {
        monitorFrame.appendChild(bar);
      }
      return bar;
    }

    function openInlineQuickEdit(cutIdx, elKey) {
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      let targetIdx = typeof cutIdx === 'number' && cutIdx >= 0 ? Math.min(n - 1, cutIdx) : window.__arPinnedCut;
      if (typeof targetIdx !== 'number' || targetIdx < 0) {
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const curT = (window.__timelines && window.__timelines.main) ? window.__timelines.main.currentTime : 0;
        const cutDur = mainDur / n;
        targetIdx = curT < mainDur ? Math.min(n - 1, Math.max(0, Math.floor(curT / cutDur))) : 0;
      }
      window.__arPinnedCut = targetIdx;
      window.__arInlineEditActive = true;
      window.__arDirectCanvasMode = true;
      if (elKey) {
        window.__arActiveCutElKey = elKey;
        if (elKey.startsWith('overlay:')) {
          window.__arSelectedOverlayIdx = Number(elKey.split(':')[1]);
        } else {
          window.__arSelectedOverlayIdx = -1;
        }
      } else if (!window.__arActiveCutElKey) {
        window.__arActiveCutElKey = 'caption';
      }

      isPlaying = false;
      const ppBtn = document.getElementById('playPauseBtn');
      if (ppBtn) ppBtn.textContent = '▶️ 재생';
      if (typeof updatePlayPauseUI === 'function') updatePlayPauseUI();

      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const cutDur = mainDur / n;
      const curT = (window.__timelines && window.__timelines.main) ? window.__timelines.main.currentTime : 0;
      if (curT < targetIdx * cutDur || curT >= (targetIdx + 1) * cutDur) {
        const seekT = targetIdx * cutDur + Math.min(0.55, cutDur * 0.35);
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(seekT);
      } else if (window.__timelines && window.__timelines.main) {
        window.__timelines.main.seek(curT);
      }
      renderPreviewCutPinBar();
      const inp = document.getElementById('arInlineQuickTextInput');
      if (inp) setTimeout(() => inp.focus(), 20);
    }

    function closeInlineQuickEdit() {
      window.__arInlineEditActive = false;
      const vp = document.getElementById('previewViewport');
      if (vp) vp.classList.remove('ar-inline-edit-active', 'ar-longpress-holding');
      const bar = document.getElementById('arInlineEditBar');
      if (bar) bar.classList.add('hidden');
      renderCutOverlayEditorLayer();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
    }

    function renderInlineQuickEditBar() {
      const bar = ensureInlineQuickEditBarDOM();
      const vp = document.getElementById('previewViewport');
      if (!bar) return;
      const cutIdx = window.__arPinnedCut;
      if (!window.__arInlineEditActive || typeof cutIdx !== 'number' || cutIdx < 0) {
        bar.classList.add('hidden');
        bar.innerHTML = '';
        if (vp) vp.classList.remove('ar-inline-edit-active');
        return;
      }
      bar.classList.remove('hidden');
      if (vp) vp.classList.add('ar-inline-edit-active');

      const ov = getCutElementOverride(cutIdx);
      const overlays = getCutOverlayList(cutIdx);
      const design = typeof getActiveDesign === 'function' ? getActiveDesign() : {};
      let activeKey = window.__arActiveCutElKey || 'caption';
      if (window.__arSelectedOverlayIdx >= 0 && overlays[window.__arSelectedOverlayIdx]) {
        activeKey = `overlay:${window.__arSelectedOverlayIdx}`;
        window.__arActiveCutElKey = activeKey;
      } else if (activeKey.startsWith('overlay:')) {
        const chk = Number(activeKey.split(':')[1]);
        if (!overlays[chk]) {
          activeKey = 'caption';
          window.__arActiveCutElKey = 'caption';
        }
      }

      const pills = [
        { key: 'caption',    label: '💬 자막' },
        { key: 'badge',      label: '🏷️ 상단배지' },
        { key: 'price',      label: '💰 혜택문구' },
        { key: 'photo',      label: '🖼️ 배경구도' },
        { key: 'transition', label: '🎞 컷 전환' }
      ];
      overlays.forEach((it, ii) => {
        pills.push({
          key: `overlay:${ii}`,
          label: it.type === 'text' ? `🔤 ${String(it.text || '텍스트').slice(0, 6)}` : `⭐ #${ii + 1}`
        });
      });

      const pillsHtml = pills.map((p) => {
        const on = activeKey === p.key;
        return `<button type="button" onclick="selectCutEditorElement('${p.key}')" class="ar-el-pill ${on ? 'active' : ''}">${escapeCutHtml(p.label)}</button>`;
      }).join('');

      let bodyHtml = '';
      if (activeKey === 'caption' || activeKey === 'badge' || activeKey === 'price') {
        const tObj = ov[activeKey] || {};
        const curText = activeKey === 'caption'
          ? ((campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || '')
          : (tObj.text || '');
        const placeholderTxt = activeKey === 'caption'
          ? `${cutIdx + 1}컷 자막 입력`
          : activeKey === 'badge'
            ? `기본: ${(design && design.label) || '상단 배지'}`
            : `기본: ${(typeof arPriceTag === 'function' ? arPriceTag() : '') || (campaign && campaign.discount) || '혜택 문구'}`;
        const textHandler = activeKey === 'caption'
          ? `updateCutCaptionDirect(${cutIdx}, this.value)`
          : `updateCutElementOverride(${cutIdx}, '${activeKey}', 'text', this.value, false)`;

        bodyHtml = `
          <div class="ar-el-row">
            <input id="arInlineQuickTextInput" type="text" value="${escapeCutHtml(curText)}" placeholder="${escapeCutHtml(placeholderTxt)}"
                   oninput="${textHandler}"
                   class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/45 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
            <span class="ar-el-label ml-1">크기</span>
            <input type="range" min="0.6" max="1.9" step="0.05" value="${Number(tObj.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, '${activeKey}', 'scale', this.value, false)"
                   class="w-20" />
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'hidden', ${!tObj.hidden}, true)"
                    class="ar-el-badge ${tObj.hidden ? 'muted' : ''}">${tObj.hidden ? '🙈 숨김' : '👁 표시'}</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, '${activeKey}')" class="ar-el-badge muted">↺</button>
          </div>
          <div class="ar-inline-scroll-row ar-inline-font-bar">
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'font', '', true)"
                    class="ar-inline-font-chip ${!tObj.font ? 'active' : ''}">기본 폰트</button>
            ${CUT_TEXT_FONTS.map((f) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'font', '${f.id}', true)"
                      style="font-family:${f.css};font-weight:${f.weight};"
                      class="ar-inline-font-chip ${tObj.font === f.id ? 'active' : ''}">${f.label}</button>
            `).join('')}
          </div>
          <div class="ar-inline-scroll-row ar-inline-style-bar">
            ${AR_ELEMENT_BOX_STYLES.map((bs) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'boxStyle', '${bs.id}', true)"
                      class="ar-inline-style-chip ${(tObj.boxStyle || 'default') === bs.id ? 'active' : ''}">${bs.label}</button>
            `).join('')}
          </div>
          <div class="ar-inline-scroll-row ar-inline-anim-bar">
            ${AR_ELEMENT_ANIMS.map((an) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'anim', '${an.id}', true);previewCutElementAnimation(${cutIdx})"
                      class="ar-inline-anim-chip ${(tObj.anim || 'default') === an.id ? 'active' : ''}">${an.label}</button>
            `).join('')}
          </div>
          <div class="ar-inline-scroll-row ar-inline-color-bar">
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'color', '', true)"
                    class="ar-inline-style-chip ${!tObj.color ? 'active' : ''}">기본색</button>
            ${CUT_TEXT_COLORS.map((col) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${activeKey}', 'color', '${col}', true)"
                      class="ar-inline-color-swatch ${tObj.color === col ? 'active' : ''}"
                      style="background:${col}"></button>
            `).join('')}
          </div>
        `;
      } else if (activeKey.startsWith('overlay:')) {
        const ii = Number(activeKey.split(':')[1]);
        const it = overlays[ii];
        if (it) {
          const isText = it.type === 'text';
          const isWidget = it.type === 'sticker' && it.variant === 'widget';
          const curTxt = isText ? (it.text || '') : (it.customText || it.text || '');
          bodyHtml = `
            <div class="ar-el-row">
              ${(isText || isWidget) ? `
                <input id="arInlineQuickTextInput" type="text" value="${escapeCutHtml(curTxt)}" placeholder="오버레이 문구"
                       oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'text', this.value, false)"
                       class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/45 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
              ` : `<span class="text-[12px] text-white/80 flex-1">${it.style === 'photo' ? '📷 사진 스티커' : escapeCutHtml(it.text || it.key || '스티커')}</span>`}
              <span class="ar-el-label ml-1">크기</span>
              <input type="range" min="0.45" max="2.4" step="0.05" value="${Number(it.scale) || 1}"
                     oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'scale', this.value, false)"
                     class="w-20" />
              <button type="button" onclick="removeSelectedOverlay()" class="ar-el-badge" style="color:#f87171;">🗑</button>
            </div>
            ${isText ? `
              <div class="ar-inline-scroll-row ar-inline-font-bar">
                ${CUT_TEXT_FONTS.map((f) => `
                  <button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'font', '${f.id}', true)"
                          style="font-family:${f.css};font-weight:${f.weight};"
                          class="ar-inline-font-chip ${(it.font || 'dohyeon') === f.id ? 'active' : ''}">${f.label}</button>
                `).join('')}
              </div>
              <div class="ar-inline-scroll-row ar-inline-style-bar">
                ${AR_ELEMENT_BOX_STYLES.filter((b) => b.id !== 'default').map((bs) => `
                  <button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'style', '${bs.id}', true)"
                          class="ar-inline-style-chip ${(it.style || 'box') === bs.id ? 'active' : ''}">${bs.label}</button>
                `).join('')}
              </div>
            ` : ''}
            <div class="ar-inline-scroll-row ar-inline-anim-bar">
              ${AR_ELEMENT_ANIMS.filter((a) => a.id !== 'default').map((an) => {
                const curA = it.anim || 'static';
                const on = (an.id === 'none' && (curA === 'static' || curA === 'none')) || curA === an.id;
                return `<button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'anim', '${an.id}', true);previewCutElementAnimation(${cutIdx})"
                                class="ar-inline-anim-chip ${on ? 'active' : ''}">${an.label}</button>`;
              }).join('')}
            </div>
            ${isText ? `
              <div class="ar-inline-scroll-row ar-inline-color-bar">
                ${CUT_TEXT_COLORS.map((col) => `
                  <button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'color', '${col}', true)"
                          class="ar-inline-color-swatch ${(it.color || '#ffffff') === col ? 'active' : ''}"
                          style="background:${col}"></button>
                `).join('')}
              </div>
            ` : ''}
          `;
        }
      } else if (activeKey === 'transition') {
        const curTr = (campaign.cutTransitions && campaign.cutTransitions[cutIdx]) || 'default';
        bodyHtml = `
          <div class="ar-inline-scroll-row ar-inline-anim-bar">
            ${AR_CUT_TRANSITIONS.map((tr) => `
              <button type="button" onclick="setCutTransition(${cutIdx}, '${tr.id}')"
                      class="ar-inline-anim-chip ${curTr === tr.id ? 'active' : ''}">${tr.label}</button>
            `).join('')}
          </div>
          <div class="ar-el-row">
            <span class="text-[11px] text-white/65 flex-1">이 컷 시작 전환 효과 (16종)</span>
            <button type="button" onclick="applyCutTransitionToAll('${curTr}')" class="ar-el-badge blue">전체 컷에 동일 적용</button>
          </div>
        `;
      } else {
        // photo
        const ph = ov.photo;
        const curFilter = (campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
        bodyHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">확대</span>
            <input type="range" min="0.8" max="2.4" step="0.05" value="${Number(ph.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, 'photo', 'scale', this.value, false)" class="flex-1" />
            <button type="button" onclick="triggerCutPhotoReplace(${cutIdx})" class="ar-el-badge blue">📷 사진 교체</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'photo')" class="ar-el-badge muted">↺</button>
          </div>
          <div class="ar-inline-scroll-row ar-inline-style-bar">
            ${CUT_FILTER_OPTIONS.map((f) => `
              <button type="button" onclick="setCutFilter(${cutIdx}, '${f.id}')"
                      class="ar-inline-style-chip ${curFilter === f.id ? 'active' : ''}">${f.label}</button>
            `).join('')}
          </div>
        `;
      }

      bar.innerHTML = `
        <div class="ar-inline-head">
          <div class="ar-inline-title">
            <span>⚡ ${cutIdx + 1}컷 빠른 편집</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" onclick="openCutEditor(${cutIdx}, '${activeKey}')" class="ar-el-badge muted">상세 패널</button>
            <button type="button" onclick="closeInlineQuickEdit()" class="ar-el-badge blue">편집 완료 ✓</button>
          </div>
        </div>
        <div class="ar-inline-scroll-row">
          ${pillsHtml}
        </div>
        ${bodyHtml}
      `;
    }

    (function bindPreviewLongPressQuickEdit() {
      if (window.__arLongPressBound) return;
      window.__arLongPressBound = true;
      let timer = null;
      let startX = 0;
      let startY = 0;
      let ringEl = null;

      const clearPress = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        const vp = document.getElementById('previewViewport');
        if (vp) vp.classList.remove('ar-longpress-holding');
        if (ringEl && ringEl.parentNode) {
          ringEl.parentNode.removeChild(ringEl);
        }
        ringEl = null;
      };

      const onPointerDown = (ev) => {
        if (ev.button && ev.button !== 0) return;
        const vp = document.getElementById('previewViewport');
        if (!vp || !vp.contains(ev.target)) return;
        // HUD 버튼, 인풋, 드로잉 캔버스 위는 제외
        if (ev.target.closest('button, input, textarea, select, #igEditorHud, #igSheetBackdrop, #igTextComposeOverlay, #igDrawOverlay, #presetHandle')) {
          return;
        }
        const pt = ev.touches ? ev.touches[0] : ev;
        startX = pt.clientX;
        startY = pt.clientY;
        clearPress();

        const rect = vp.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const relX = pt.clientX - rect.left;
        const relY = pt.clientY - rect.top;

        vp.classList.add('ar-longpress-holding');
        ringEl = document.createElement('div');
        ringEl.className = 'ar-longpress-ring pointer-events-none';
        ringEl.style.left = `${relX}px`;
        ringEl.style.top = `${relY}px`;
        ringEl.innerHTML = `<div class="ar-longpress-ripple"></div>`;
        vp.appendChild(ringEl);

        timer = setTimeout(() => {
          timer = null;
          vp.classList.remove('ar-longpress-holding');
          if (ringEl && ringEl.parentNode) ringEl.parentNode.removeChild(ringEl);
          ringEl = null;

          const nx = Math.max(0, Math.min(1, relX / rect.width));
          const ny = Math.max(0, Math.min(1, relY / rect.height));
          const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
          const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
          const curT = (window.__timelines && window.__timelines.main) ? window.__timelines.main.currentTime : 0;
          const cutDur = mainDur / n;
          const targetIdx = window.__arPinnedCut >= 0
            ? window.__arPinnedCut
            : (curT < mainDur ? Math.min(n - 1, Math.max(0, Math.floor(curT / cutDur))) : 0);
          const hitKey = hitTestCutCanvasElement(targetIdx, nx, ny);
          openInlineQuickEdit(targetIdx, hitKey);
        }, 380);
      };

      const onPointerMove = (ev) => {
        if (!timer) return;
        const pt = ev.touches ? ev.touches[0] : ev;
        if (Math.hypot(pt.clientX - startX, pt.clientY - startY) > 8) {
          clearPress();
        }
      };

      window.addEventListener('mousedown', onPointerDown, true);
      window.addEventListener('mousemove', onPointerMove, true);
      window.addEventListener('mouseup', clearPress, true);
      window.addEventListener('touchstart', onPointerDown, { capture: true, passive: true });
      window.addEventListener('touchmove', onPointerMove, { capture: true, passive: true });
      window.addEventListener('touchend', clearPress, true);
      window.addEventListener('touchcancel', clearPress, true);
    })();

    // ============================================================================
    // ★ 컷 편집 — 요소별 편집 모드 (Element Inspector & Direct Canvas Mode)
    // ============================================================================
    function ensureCutEditorPanelDOM() {
      let panel = document.getElementById('cutEditorPanel');
      if (panel) return panel;
      const pinBar = document.getElementById('previewCutPinBar');
      const monitorFrame = pinBar ? (pinBar.closest('.monitor-frame') || pinBar.parentElement.parentElement) : document.getElementById('mainMonitorColumn');
      if (!monitorFrame) return null;
      panel = document.createElement('section');
      panel.id = 'cutEditorPanel';
      panel.className = 'hidden mt-2 w-full';
      panel.setAttribute('aria-label', '컷 요소별 편집 모드');
      const pinRow = pinBar ? pinBar.parentElement : null;
      if (pinRow && pinRow.nextSibling) {
        monitorFrame.insertBefore(panel, pinRow.nextSibling);
      } else {
        monitorFrame.appendChild(panel);
      }
      return panel;
    }

    function openCutEditor(cutIdx, elKey) {
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      const targetIdx = typeof cutIdx === 'number' && cutIdx >= 0 ? Math.min(n - 1, cutIdx) : (window.__arPinnedCut >= 0 ? window.__arPinnedCut : 0);
      window.__arCutEditorOpen = true;
      if (elKey) {
        window.__arActiveCutElKey = elKey;
        if (elKey.startsWith('overlay:')) {
          window.__arSelectedOverlayIdx = Number(elKey.split(':')[1]);
        } else {
          window.__arSelectedOverlayIdx = -1;
        }
      } else if (!window.__arActiveCutElKey) {
        window.__arActiveCutElKey = 'caption';
      }
      if (window.__arPinnedCut !== targetIdx) {
        window.__arPinnedCut = targetIdx;
        isPlaying = false;
        const ppBtn = document.getElementById('playPauseBtn');
        if (ppBtn) ppBtn.textContent = '▶️ 재생';
        if (typeof updatePlayPauseUI === 'function') updatePlayPauseUI();
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const cutDur = mainDur / n;
        const seekT = targetIdx * cutDur + Math.min(0.55, cutDur * 0.35);
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(seekT);
      } else if (window.__timelines && window.__timelines.main) {
        window.__timelines.main.seek(window.__timelines.main.currentTime);
      }
      renderPreviewCutPinBar();
    }

    function closeCutEditor() {
      window.__arCutEditorOpen = false;
      window.__arInlineEditActive = false;
      const panel = document.getElementById('cutEditorPanel');
      if (panel) panel.classList.add('hidden');
      const bar = document.getElementById('arInlineEditBar');
      if (bar) bar.classList.add('hidden');
      if (window.__arPinnedCut >= 0) {
        togglePinPreviewCut(-1);
      }
    }

    function selectCutEditorElement(elKey) {
      const cutIdx = window.__arPinnedCut;
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      window.__arActiveCutElKey = elKey || 'caption';
      if (elKey && elKey.startsWith('overlay:')) {
        window.__arSelectedOverlayIdx = Number(elKey.split(':')[1]);
      } else {
        window.__arSelectedOverlayIdx = -1;
      }
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderIgEditorHud();
      renderCutOverlayEditorLayer();
      renderCutEditorPanel();
      if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
    }

    function toggleDirectCanvasSelectMode() {
      window.__arDirectCanvasMode = !window.__arDirectCanvasMode;
      renderCutOverlayEditorLayer();
      renderCutEditorPanel();
      if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
    }

    function updateCutCaptionDirect(cutIdx, val) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      if (!Array.isArray(campaign.cutCaptions)) campaign.cutCaptions = [];
      campaign.cutCaptions[cutIdx] = String(val ?? '');
      const s2Input = document.getElementById(`s2CutCap_${cutIdx}`);
      if (s2Input && s2Input.value !== campaign.cutCaptions[cutIdx]) {
        s2Input.value = campaign.cutCaptions[cutIdx];
      }
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
    }

    function updateCutElementOverride(cutIdx, elKey, prop, val, rerenderPanel) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      const ov = getCutElementOverride(cutIdx);
      const target = ov[elKey];
      if (!target) return;
      if (prop === 'x' || prop === 'y') {
        target[prop] = Math.max(0.04, Math.min(0.96, Number(val) || 0.5));
        target.customPos = true;
      } else if (prop === 'scale') {
        target.scale = Math.max(0.5, Math.min(2.4, Number(val) || 1));
      } else if (prop === 'panX' || prop === 'panY') {
        target[prop] = Math.max(-0.5, Math.min(0.5, Number(val) || 0));
      } else if (prop === 'hidden') {
        target.hidden = !!val;
      } else {
        target[prop] = val;
      }
      syncCutInspectorLiveValues(cutIdx, elKey);
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderCutOverlayEditorLayer();
      if (rerenderPanel) renderPreviewCutPinBar();
    }

    function resetCutElementOverride(cutIdx, elKey) {
      if (typeof cutIdx !== 'number' || cutIdx < 0) return;
      const def = createDefaultCutElementOverride();
      const ov = getCutElementOverride(cutIdx);
      if (!elKey || elKey === 'all') {
        cutElementOverrides[cutIdx] = def;
        if (Array.isArray(campaign.cutFilters)) campaign.cutFilters[cutIdx] = 'none';
        if (Array.isArray(campaign.cutDecos)) campaign.cutDecos[cutIdx] = 'none';
        if (Array.isArray(campaign.cutFrames)) campaign.cutFrames[cutIdx] = '';
        if (Array.isArray(campaign.cutTransitions)) campaign.cutTransitions[cutIdx] = 'default';
      } else if (elKey === 'transition') {
        if (Array.isArray(campaign.cutTransitions)) campaign.cutTransitions[cutIdx] = 'default';
      } else if (def[elKey]) {
        ov[elKey] = def[elKey];
        if (elKey === 'photo' && Array.isArray(campaign.cutFilters)) {
          campaign.cutFilters[cutIdx] = 'none';
        }
      }
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    function updateSelectedOverlayProp(cutIdx, ovIdx, prop, val, rerenderPanel) {
      const list = getCutOverlayList(cutIdx);
      const it = list[ovIdx];
      if (!it) return;
      if (prop === 'x' || prop === 'y') {
        it[prop] = Math.max(0.06, Math.min(0.94, Number(val) || 0.5));
      } else if (prop === 'scale') {
        it.scale = Math.max(0.45, Math.min(2.5, Number(val) || 1));
      } else if (prop === 'rot') {
        it.rot = Math.max(-45, Math.min(45, Number(val) || 0));
      } else if (prop === 'text') {
        if (it.type === 'sticker' && it.variant === 'widget') it.customText = String(val ?? '');
        else it.text = String(val ?? '');
      } else {
        it[prop] = val;
      }
      saveCutOverlays();
      syncCutInspectorLiveValues(cutIdx, `overlay:${ovIdx}`);
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderCutOverlayEditorLayer();
      renderIgEditorHud();
      if (rerenderPanel) {
        renderCutEditorPanel();
        if (typeof renderInlineQuickEditBar === 'function') renderInlineQuickEditBar();
      }
    }

    function syncCutInspectorLiveValues(cutIdx, elKey) {
      const ov = getCutElementOverride(cutIdx);
      const setVal = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };
      const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el && document.activeElement !== el) el.value = val;
      };
      if (elKey === 'caption' || elKey === 'badge' || elKey === 'price') {
        const t = ov[elKey] || {};
        setVal('arElValX', `${Math.round((typeof t.x === 'number' ? t.x : 0.5) * 100)}%`);
        setVal('arElValY', `${Math.round((typeof t.y === 'number' ? t.y : 0.5) * 100)}%`);
        setVal('arElValScale', `${Math.round((Number(t.scale) || 1) * 100)}%`);
        setInput('arElRangeX', typeof t.x === 'number' ? t.x : 0.5);
        setInput('arElRangeY', typeof t.y === 'number' ? t.y : 0.5);
        setInput('arElRangeScale', Number(t.scale) || 1);
      } else if (elKey === 'photo') {
        const ph = ov.photo || {};
        setVal('arElValPhotoScale', `${Math.round((Number(ph.scale) || 1) * 100)}%`);
        setVal('arElValPanX', `${Math.round((Number(ph.panX) || 0) * 100)}%`);
        setVal('arElValPanY', `${Math.round((Number(ph.panY) || 0) * 100)}%`);
        setInput('arElRangePhotoScale', Number(ph.scale) || 1);
        setInput('arElRangePanX', Number(ph.panX) || 0);
        setInput('arElRangePanY', Number(ph.panY) || 0);
      } else if (elKey && elKey.startsWith('overlay:')) {
        const ii = Number(elKey.split(':')[1]);
        const it = getCutOverlayList(cutIdx)[ii];
        if (it) {
          setVal('arElValOvX', `${Math.round((typeof it.x === 'number' ? it.x : 0.5) * 100)}%`);
          setVal('arElValOvY', `${Math.round((typeof it.y === 'number' ? it.y : 0.5) * 100)}%`);
          setVal('arElValOvScale', `${Math.round((Number(it.scale) || 1) * 100)}%`);
          setVal('arElValOvRot', `${Math.round(Number(it.rot) || 0)}°`);
          setInput('arElRangeOvX', typeof it.x === 'number' ? it.x : 0.5);
          setInput('arElRangeOvY', typeof it.y === 'number' ? it.y : 0.5);
          setInput('arElRangeOvScale', Number(it.scale) || 1);
          setInput('arElRangeOvRot', Number(it.rot) || 0);
        }
      }
    }

    function triggerCutPhotoReplace(cutIdx) {
      if (typeof replaceCutMedia === 'function') {
        replaceCutMedia(cutIdx);
        return;
      }
      let inp = document.getElementById('arCutPhotoReplaceInput');
      if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file';
        inp.id = 'arCutPhotoReplaceInput';
        inp.accept = 'image/*,video/*';
        inp.className = 'hidden';
        document.body.appendChild(inp);
      }
      inp.onchange = (ev) => {
        const f = ev.target && ev.target.files && ev.target.files[0];
        inp.value = '';
        if (!f) return;
        if (typeof handleCutCardFileSelect === 'function') {
          handleCutCardFileSelect(cutIdx, f);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              if (!Array.isArray(campaign.uploadedPhotos)) campaign.uploadedPhotos = [];
              campaign.uploadedPhotos[cutIdx] = img;
              if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(f);
        }
      };
      inp.click();
    }

    function escapeCutHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function buildElementStyleAndAnimRowsHtml(cutIdx, elKey, obj) {
      const curFont = obj.font || '';
      const curBox = obj.boxStyle || 'default';
      const curAnim = obj.anim || 'default';
      return `
        <div class="ar-el-row">
          <span class="ar-el-label">폰트·박스</span>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${elKey}', 'font', '', true)"
                    class="ar-el-chip ${!curFont ? 'active' : ''}">기본 폰트</button>
            ${CUT_TEXT_FONTS.map((f) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${elKey}', 'font', '${f.id}', true)"
                      style="font-family:${f.css};font-weight:${f.weight};"
                      class="ar-el-chip ${curFont === f.id ? 'active' : ''}">${f.label}</button>
            `).join('')}
          </div>
        </div>
        <div class="ar-el-row">
          <span class="ar-el-label">박스 디자인</span>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
            ${AR_ELEMENT_BOX_STYLES.map((bs) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${elKey}', 'boxStyle', '${bs.id}', true)"
                      class="ar-el-chip ${curBox === bs.id ? 'active' : ''}">${bs.label}</button>
            `).join('')}
          </div>
        </div>
        <div class="ar-el-row">
          <span class="ar-el-label">애니메이션</span>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
            ${AR_ELEMENT_ANIMS.map((an) => `
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, '${elKey}', 'anim', '${an.id}', true);previewCutElementAnimation(${cutIdx})"
                      class="ar-el-chip ${curAnim === an.id ? 'active' : ''}">${an.label}</button>
            `).join('')}
          </div>
        </div>
      `;
    }

    function renderCutEditorPanel() {
      const panel = ensureCutEditorPanelDOM();
      if (!panel) return;
      const cutIdx = window.__arPinnedCut;
      if (typeof cutIdx !== 'number' || cutIdx < 0) {
        panel.classList.add('hidden');
        panel.innerHTML = '';
        return;
      }
      window.__arCutEditorOpen = true;
      panel.classList.remove('hidden');

      const ov = getCutElementOverride(cutIdx);
      const overlays = getCutOverlayList(cutIdx);
      const curDeco = (campaign.cutDecos && campaign.cutDecos[cutIdx]) || 'none';
      const curFilter = (campaign.cutFilters && campaign.cutFilters[cutIdx]) || 'none';
      const curFrame = (campaign.cutFrames && campaign.cutFrames[cutIdx]) || '';
      const curTrans = (campaign.cutTransitions && campaign.cutTransitions[cutIdx]) || 'default';
      const design = typeof getActiveDesign === 'function' ? getActiveDesign() : {};

      let activeKey = window.__arActiveCutElKey || 'caption';
      if (window.__arSelectedOverlayIdx >= 0 && overlays[window.__arSelectedOverlayIdx]) {
        activeKey = `overlay:${window.__arSelectedOverlayIdx}`;
        window.__arActiveCutElKey = activeKey;
      } else if (activeKey.startsWith('overlay:')) {
        const idxCheck = Number(activeKey.split(':')[1]);
        if (!overlays[idxCheck]) {
          activeKey = 'caption';
          window.__arActiveCutElKey = 'caption';
        }
      }

      const baseChips = [
        { key: 'caption',    label: '💬 컷 자막',         hidden: !!ov.caption.hidden, mod: isCutElementModified(cutIdx, 'caption') },
        { key: 'badge',      label: '🏷️ 상단 라벨/배지',   hidden: !!ov.badge.hidden,   mod: isCutElementModified(cutIdx, 'badge') },
        { key: 'price',      label: '💰 혜택/서브 문구',   hidden: !!ov.price.hidden,   mod: isCutElementModified(cutIdx, 'price') },
        { key: 'photo',      label: '🖼️ 배경 사진 구도',   hidden: false,               mod: isCutElementModified(cutIdx, 'photo') },
        { key: 'transition', label: '🎞 컷 전환 효과',     hidden: false,               mod: isCutElementModified(cutIdx, 'transition') },
        { key: 'deco',       label: '✨ 꾸밈·오버레이',    hidden: false,               mod: isCutElementModified(cutIdx, 'deco') }
      ];

      const overlayChipsHtml = overlays.map((it, ii) => {
        const key = `overlay:${ii}`;
        const on = activeKey === key;
        const shortTxt = it.type === 'text'
          ? `🔤 ${escapeCutHtml(String(it.text || '텍스트').slice(0, 8))}`
          : it.style === 'photo'
            ? `📷 사진스티커 #${ii + 1}`
            : `⭐ ${escapeCutHtml(String(it.text || it.key || `스티커 #${ii + 1}`).slice(0, 8))}`;
        return `<button type="button" onclick="selectCutEditorElement('${key}')" aria-selected="${on ? 'true' : 'false'}" class="ar-el-chip modified ${on ? 'active' : ''}">${shortTxt}</button>`;
      }).join('');

      const chipsHtml = baseChips.map((ch) => {
        const on = activeKey === ch.key;
        const cls = [
          'ar-el-chip',
          on ? 'active' : '',
          ch.mod ? 'modified' : '',
          ch.hidden ? 'is-hidden' : ''
        ].filter(Boolean).join(' ');
        return `<button type="button" onclick="selectCutEditorElement('${ch.key}')" aria-selected="${on ? 'true' : 'false'}" class="${cls}">${ch.label}</button>`;
      }).join('') + overlayChipsHtml;

      let inspectorHtml = '';
      if (activeKey === 'caption') {
        const c = ov.caption;
        const curCap = (campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || '';
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">컷 자막</span>
            <input type="text" value="${escapeCutHtml(curCap)}" placeholder="${cutIdx + 1}컷 자막을 입력하세요"
                   oninput="updateCutCaptionDirect(${cutIdx}, this.value)"
                   class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/40 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'caption', 'hidden', ${!c.hidden}, true)"
                    class="ar-el-badge ${c.hidden ? 'muted' : ''}">${c.hidden ? '🙈 숨김중' : '👁 표시중'}</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'caption')" class="ar-el-badge muted" title="자막 위치·크기·색상 초기화">↺ 초기화</button>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">가로 X</span>
            <input id="arElRangeX" type="range" min="0.08" max="0.92" step="0.01" value="${typeof c.x === 'number' ? c.x : 0.5}"
                   oninput="updateCutElementOverride(${cutIdx}, 'caption', 'x', this.value, false)" />
            <span id="arElValX" class="ar-el-val">${Math.round((typeof c.x === 'number' ? c.x : 0.5) * 100)}%</span>
            <span class="ar-el-label ml-1">세로 Y</span>
            <input id="arElRangeY" type="range" min="0.08" max="0.92" step="0.01" value="${typeof c.y === 'number' ? c.y : 0.72}"
                   oninput="updateCutElementOverride(${cutIdx}, 'caption', 'y', this.value, false)" />
            <span id="arElValY" class="ar-el-val">${Math.round((typeof c.y === 'number' ? c.y : 0.72) * 100)}%</span>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">크기</span>
            <input id="arElRangeScale" type="range" min="0.6" max="1.8" step="0.05" value="${Number(c.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, 'caption', 'scale', this.value, false)" />
            <span id="arElValScale" class="ar-el-val">${Math.round((Number(c.scale) || 1) * 100)}%</span>
            <div class="flex items-center gap-1 ml-1 overflow-x-auto no-scrollbar">
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'caption', 'color', '', true)"
                      class="px-1.5 py-0.5 rounded text-[10px] border ${!c.color ? 'border-white bg-white/15 text-white' : 'border-white/15 text-white/60'}">기본</button>
              ${CUT_TEXT_COLORS.slice(0, 7).map((col) => `
                <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'caption', 'color', '${col}', true)"
                        class="w-4 h-4 rounded-full shrink-0 border ${c.color === col ? 'scale-125 border-white ring-1 ring-white' : 'border-white/30'}"
                        style="background:${col}"></button>
              `).join('')}
            </div>
          </div>
          ${buildElementStyleAndAnimRowsHtml(cutIdx, 'caption', c)}
        `;
      } else if (activeKey === 'badge') {
        const b = ov.badge;
        const defLabel = (design && design.label) || '상단 라벨';
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">배지 문구</span>
            <input type="text" value="${escapeCutHtml(b.text || '')}" placeholder="기본: ${escapeCutHtml(defLabel)}"
                   oninput="updateCutElementOverride(${cutIdx}, 'badge', 'text', this.value, false)"
                   class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/40 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'badge', 'hidden', ${!b.hidden}, true)"
                    class="ar-el-badge ${b.hidden ? 'muted' : ''}">${b.hidden ? '🙈 숨김중' : '👁 표시중'}</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'badge')" class="ar-el-badge muted">↺ 초기화</button>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">가로 X</span>
            <input id="arElRangeX" type="range" min="0.08" max="0.92" step="0.01" value="${typeof b.x === 'number' ? b.x : 0.5}"
                   oninput="updateCutElementOverride(${cutIdx}, 'badge', 'x', this.value, false)" />
            <span id="arElValX" class="ar-el-val">${Math.round((typeof b.x === 'number' ? b.x : 0.5) * 100)}%</span>
            <span class="ar-el-label ml-1">세로 Y</span>
            <input id="arElRangeY" type="range" min="0.04" max="0.90" step="0.01" value="${typeof b.y === 'number' ? b.y : 0.08}"
                   oninput="updateCutElementOverride(${cutIdx}, 'badge', 'y', this.value, false)" />
            <span id="arElValY" class="ar-el-val">${Math.round((typeof b.y === 'number' ? b.y : 0.08) * 100)}%</span>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">크기</span>
            <input id="arElRangeScale" type="range" min="0.6" max="1.8" step="0.05" value="${Number(b.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, 'badge', 'scale', this.value, false)" />
            <span id="arElValScale" class="ar-el-val">${Math.round((Number(b.scale) || 1) * 100)}%</span>
            <div class="flex items-center gap-1 ml-1 overflow-x-auto no-scrollbar">
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'badge', 'color', '', true)"
                      class="px-1.5 py-0.5 rounded text-[10px] border ${!b.color ? 'border-white bg-white/15 text-white' : 'border-white/15 text-white/60'}">기본</button>
              ${CUT_TEXT_COLORS.slice(0, 7).map((col) => `
                <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'badge', 'color', '${col}', true)"
                        class="w-4 h-4 rounded-full shrink-0 border ${b.color === col ? 'scale-125 border-white ring-1 ring-white' : 'border-white/30'}"
                        style="background:${col}"></button>
              `).join('')}
            </div>
          </div>
          ${buildElementStyleAndAnimRowsHtml(cutIdx, 'badge', b)}
        `;
      } else if (activeKey === 'price') {
        const p = ov.price;
        const defPrice = (typeof arPriceTag === 'function' ? arPriceTag() : '') || (campaign && campaign.discount) || '혜택 강조 문구';
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">혜택 문구</span>
            <input type="text" value="${escapeCutHtml(p.text || '')}" placeholder="기본: ${escapeCutHtml(defPrice)}"
                   oninput="updateCutElementOverride(${cutIdx}, 'price', 'text', this.value, false)"
                   class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/40 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
            <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'price', 'hidden', ${!p.hidden}, true)"
                    class="ar-el-badge ${p.hidden ? 'muted' : ''}">${p.hidden ? '🙈 숨김중' : '👁 표시중'}</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'price')" class="ar-el-badge muted">↺ 초기화</button>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">가로 X</span>
            <input id="arElRangeX" type="range" min="0.08" max="0.92" step="0.01" value="${typeof p.x === 'number' ? p.x : 0.5}"
                   oninput="updateCutElementOverride(${cutIdx}, 'price', 'x', this.value, false)" />
            <span id="arElValX" class="ar-el-val">${Math.round((typeof p.x === 'number' ? p.x : 0.5) * 100)}%</span>
            <span class="ar-el-label ml-1">세로 Y</span>
            <input id="arElRangeY" type="range" min="0.08" max="0.92" step="0.01" value="${typeof p.y === 'number' ? p.y : 0.56}"
                   oninput="updateCutElementOverride(${cutIdx}, 'price', 'y', this.value, false)" />
            <span id="arElValY" class="ar-el-val">${Math.round((typeof p.y === 'number' ? p.y : 0.56) * 100)}%</span>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">크기</span>
            <input id="arElRangeScale" type="range" min="0.6" max="1.8" step="0.05" value="${Number(p.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, 'price', 'scale', this.value, false)" />
            <span id="arElValScale" class="ar-el-val">${Math.round((Number(p.scale) || 1) * 100)}%</span>
            <div class="flex items-center gap-1 ml-1 overflow-x-auto no-scrollbar">
              <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'price', 'color', '', true)"
                      class="px-1.5 py-0.5 rounded text-[10px] border ${!p.color ? 'border-white bg-white/15 text-white' : 'border-white/15 text-white/60'}">기본</button>
              ${CUT_TEXT_COLORS.slice(0, 7).map((col) => `
                <button type="button" onclick="updateCutElementOverride(${cutIdx}, 'price', 'color', '${col}', true)"
                        class="w-4 h-4 rounded-full shrink-0 border ${p.color === col ? 'scale-125 border-white ring-1 ring-white' : 'border-white/30'}"
                        style="background:${col}"></button>
              `).join('')}
            </div>
          </div>
          ${buildElementStyleAndAnimRowsHtml(cutIdx, 'price', p)}
        `;
      } else if (activeKey === 'photo') {
        const ph = ov.photo;
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">확대(Zoom)</span>
            <input id="arElRangePhotoScale" type="range" min="0.8" max="2.4" step="0.05" value="${Number(ph.scale) || 1}"
                   oninput="updateCutElementOverride(${cutIdx}, 'photo', 'scale', this.value, false)" />
            <span id="arElValPhotoScale" class="ar-el-val">${Math.round((Number(ph.scale) || 1) * 100)}%</span>
            <button type="button" onclick="triggerCutPhotoReplace(${cutIdx})" class="ar-el-badge blue">📷 이 컷 사진 교체</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'photo')" class="ar-el-badge muted">↺ 구도 초기화</button>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">좌우 이동</span>
            <input id="arElRangePanX" type="range" min="-0.5" max="0.5" step="0.02" value="${Number(ph.panX) || 0}"
                   oninput="updateCutElementOverride(${cutIdx}, 'photo', 'panX', this.value, false)" />
            <span id="arElValPanX" class="ar-el-val">${Math.round((Number(ph.panX) || 0) * 100)}%</span>
            <span class="ar-el-label ml-1">상하 이동</span>
            <input id="arElRangePanY" type="range" min="-0.5" max="0.5" step="0.02" value="${Number(ph.panY) || 0}"
                   oninput="updateCutElementOverride(${cutIdx}, 'photo', 'panY', this.value, false)" />
            <span id="arElValPanY" class="ar-el-val">${Math.round((Number(ph.panY) || 0) * 100)}%</span>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">색감 필터</span>
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
              ${CUT_FILTER_OPTIONS.slice(0, 8).map((f) => {
                const on = curFilter === f.id;
                return `<button type="button" onclick="setCutFilter(${cutIdx}, '${f.id}')"
                                class="ar-el-chip ${on ? 'active' : ''}">${f.label}</button>`;
              }).join('')}
            </div>
          </div>
        `;
      } else if (activeKey === 'transition') {
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">컷 전환(16종)</span>
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
              ${AR_CUT_TRANSITIONS.map((tr) => {
                const on = curTrans === tr.id;
                return `<button type="button" onclick="setCutTransition(${cutIdx}, '${tr.id}')"
                                class="ar-el-chip ${on ? 'active' : ''}">${tr.label}</button>`;
              }).join('')}
            </div>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">일괄 적용</span>
            <span class="text-[11px] text-white/65 flex-1">이 컷이 시작될 때 화면 전환 모션을 지정합니다</span>
            <button type="button" onclick="applyCutTransitionToAll('${curTrans}')" class="ar-el-badge blue">전체 컷에 동일 적용</button>
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'transition')" class="ar-el-badge muted">↺ 초기화</button>
          </div>
        `;
      } else if (activeKey.startsWith('overlay:')) {
        const ii = Number(activeKey.split(':')[1]);
        const it = overlays[ii];
        if (it) {
          const isText = it.type === 'text';
          const isWidget = it.type === 'sticker' && it.variant === 'widget';
          const curTxt = isText ? (it.text || '') : (it.customText || it.text || '');
          inspectorHtml = `
            <div class="ar-el-row">
              <span class="ar-el-label">${isText ? '텍스트' : '오버레이'}</span>
              ${(isText || isWidget) ? `
                <input type="text" value="${escapeCutHtml(curTxt)}" placeholder="문구 입력"
                       oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'text', this.value, false)"
                       class="flex-1 min-w-0 h-8 px-2.5 rounded-[8px] bg-black/40 border border-white/15 text-[12px] text-white focus:outline-none focus:border-[#4cc38a]" />
              ` : `<span class="text-[12px] text-white/80 flex-1">${it.style === 'photo' ? '📷 사진 스티커' : escapeCutHtml(it.text || it.key || '스티커')}</span>`}
              <button type="button" onclick="duplicateSelectedOverlay()" class="ar-el-badge muted">복제</button>
              <button type="button" onclick="removeSelectedOverlay()" class="ar-el-badge" style="color:#f87171;border-color:rgba(248,113,113,0.4);">🗑 삭제</button>
            </div>
            ${isText ? `
              <div class="ar-el-row">
                <span class="ar-el-label">폰트·배경</span>
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
                  ${CUT_TEXT_FONTS.map((f) => {
                    const on = (it.font || 'dohyeon') === f.id;
                    return `<button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'font', '${f.id}', true)"
                                    class="ar-el-chip ${on ? 'active' : ''}">${f.label}</button>`;
                  }).join('')}
                </div>
                <div class="flex items-center gap-1">
                  ${CUT_TEXT_COLORS.slice(0, 6).map((col) => `
                    <button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'color', '${col}', true)"
                            class="w-4 h-4 rounded-full shrink-0 border ${(it.color || '#ffffff') === col ? 'scale-125 border-white ring-1 ring-white' : 'border-white/30'}"
                            style="background:${col}"></button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="ar-el-row">
              <span class="ar-el-label">애니메이션</span>
              <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
                ${AR_ELEMENT_ANIMS.filter((a) => a.id !== 'default').map((an) => {
                  const curA = it.anim || 'static';
                  const on = (an.id === 'none' && (curA === 'static' || curA === 'none')) || curA === an.id;
                  return `<button type="button" onclick="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'anim', '${an.id}', true);previewCutElementAnimation(${cutIdx})"
                                  class="ar-el-chip ${on ? 'active' : ''}">${an.label}</button>`;
                }).join('')}
              </div>
            </div>
            <div class="ar-el-row">
              <span class="ar-el-label">가로 X</span>
              <input id="arElRangeOvX" type="range" min="0.06" max="0.94" step="0.01" value="${typeof it.x === 'number' ? it.x : 0.5}"
                     oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'x', this.value, false)" />
              <span id="arElValOvX" class="ar-el-val">${Math.round((typeof it.x === 'number' ? it.x : 0.5) * 100)}%</span>
              <span class="ar-el-label ml-1">세로 Y</span>
              <input id="arElRangeOvY" type="range" min="0.06" max="0.94" step="0.01" value="${typeof it.y === 'number' ? it.y : 0.5}"
                     oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'y', this.value, false)" />
              <span id="arElValOvY" class="ar-el-val">${Math.round((typeof it.y === 'number' ? it.y : 0.5) * 100)}%</span>
            </div>
            <div class="ar-el-row">
              <span class="ar-el-label">크기</span>
              <input id="arElRangeOvScale" type="range" min="0.45" max="2.5" step="0.05" value="${Number(it.scale) || 1}"
                     oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'scale', this.value, false)" />
              <span id="arElValOvScale" class="ar-el-val">${Math.round((Number(it.scale) || 1) * 100)}%</span>
              <span class="ar-el-label ml-1">회전</span>
              <input id="arElRangeOvRot" type="range" min="-45" max="45" step="1" value="${Number(it.rot) || 0}"
                     oninput="updateSelectedOverlayProp(${cutIdx}, ${ii}, 'rot', this.value, false)" />
              <span id="arElValOvRot" class="ar-el-val">${Math.round(Number(it.rot) || 0)}°</span>
            </div>
          `;
        }
      } else {
        // 'deco' 탭: 오버레이 추가 버튼 + 꾸밈효과·프레임 빠른 선택
        inspectorHtml = `
          <div class="ar-el-row">
            <span class="ar-el-label">요소 추가</span>
            <button type="button" onclick="openIgTextCompose(-1)" class="ar-el-chip active">＋ 🔤 텍스트 추가</button>
            <button type="button" onclick="openIgSheet('sticker')" class="ar-el-chip">＋ ⭐ 스티커·위젯</button>
            <button type="button" onclick="openIgDrawMode()" class="ar-el-chip">＋ ✏️ 그리기</button>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">꾸밈 효과</span>
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
              ${CUT_DECO_OPTIONS.slice(0, 8).map((o) => {
                const on = curDeco === o.id;
                return `<button type="button" onclick="setCutDeco(${cutIdx}, '${o.id}')" class="ar-el-chip ${on ? 'active' : ''}">${o.label}</button>`;
              }).join('')}
            </div>
          </div>
          <div class="ar-el-row">
            <span class="ar-el-label">프레임</span>
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
              ${CUT_STICKER_FRAMES.map((fr) => {
                const on = (curFrame || 'noneFrame') === fr.key;
                return `<button type="button" onclick="setCutFrame(${cutIdx}, '${fr.key}')" class="ar-el-chip ${on ? 'active' : ''}">${fr.label}</button>`;
              }).join('')}
            </div>
          </div>
        `;
      }

      panel.innerHTML = `
        <div class="ar-el-mode-bar">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="ar-el-badge">${cutIdx + 1}컷 요소 선택·편집</span>
            <button type="button" onclick="toggleDirectCanvasSelectMode()"
                    class="ar-el-badge ${window.__arDirectCanvasMode ? 'blue' : 'muted'}"
                    title="프리뷰 캔버스에서 직접 요소를 클릭·드래그해 위치를 조절합니다">
              🎯 캔버스 직접 선택 ${window.__arDirectCanvasMode ? 'ON' : 'OFF'}
            </button>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" onclick="resetCutElementOverride(${cutIdx}, 'all')"
                    class="ar-el-badge muted" title="${cutIdx + 1}컷의 모든 요소 편집 초기화">이 컷 초기화</button>
            <button type="button" onclick="closeCutEditor()"
                    class="ar-el-badge muted" title="요소 편집 닫기">닫기 ✕</button>
          </div>
        </div>
        <div class="ar-el-chip-list" role="tablist" aria-label="편집할 컷 요소 선택">
          ${chipsHtml}
        </div>
        <div class="ar-el-inspector">
          ${inspectorHtml}
        </div>
      `;
    }

    function setCutDeco(idx, decoId) {
      if (!Array.isArray(campaign.cutDecos)) campaign.cutDecos = [];
      campaign.cutDecos[idx] = decoId;
      saveCutDecos();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }
    function applyCutDecoToAll() {
      const idx = window.__arPinnedCut;
      if (idx < 0) return;
      const n = typeof getTargetCutCount === 'function' ? getTargetCutCount() : 4;
      if (window.__arIgSheetMode === 'filter') {
        const curF = (campaign.cutFilters && campaign.cutFilters[idx]) || 'none';
        campaign.cutFilters = Array.from({ length: n }, () => curF);
        saveCutFilters();
      } else {
        const cur = (campaign.cutDecos && campaign.cutDecos[idx]) || 'none';
        campaign.cutDecos = Array.from({ length: n }, () => cur);
        saveCutDecos();
      }
      closeIgSheet();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
    }

    // 배경 사진 구도(Zoom / Pan X / Pan Y) 및 가격·혜택 오버라이드를 모든 엔진(kit / motion / genre)에 일관 적용하기 위한 래퍼
    (function bindCutElementEngineHooks() {
      if (window.__arCutElementHooksBound) return;
      window.__arCutElementHooksBound = true;

      if (typeof kitCover === 'function' && !kitCover._arWrapped) {
        const origKitCover = kitCover;
        kitCover = function (c, img, x, y, w, h, scale, panX, panY) {
          let sc = scale || 1, px = panX || 0, py = panY || 0;
          const rIdx = window.__arActiveRenderCutIdx;
          if (typeof rIdx === 'number' && rIdx >= 0 && cutElementOverrides && cutElementOverrides[rIdx] && cutElementOverrides[rIdx].photo) {
            const ph = cutElementOverrides[rIdx].photo;
            sc *= (Number(ph.scale) || 1);
            px += (Number(ph.panX) || 0) * w;
            py += (Number(ph.panY) || 0) * h;
          }
          return origKitCover(c, img, x, y, w, h, sc, px, py);
        };
        kitCover._arWrapped = true;
      }

      if (typeof gDrawCover === 'function' && !gDrawCover._arWrapped) {
        const origGDrawCover = gDrawCover;
        gDrawCover = function (c, img, x, y, w, h, scale, panX, panY) {
          let sc = scale || 1, px = panX || 0, py = panY || 0;
          const rIdx = window.__arActiveRenderCutIdx;
          if (typeof rIdx === 'number' && rIdx >= 0 && cutElementOverrides && cutElementOverrides[rIdx] && cutElementOverrides[rIdx].photo) {
            const ph = cutElementOverrides[rIdx].photo;
            sc *= (Number(ph.scale) || 1);
            px += (Number(ph.panX) || 0) * w;
            py += (Number(ph.panY) || 0) * h;
          }
          return origGDrawCover(c, img, x, y, w, h, sc, px, py);
        };
        gDrawCover._arWrapped = true;
      }

      if (typeof gIsPriceCut === 'function' && !gIsPriceCut._arWrapped) {
        const origGIsPriceCut = gIsPriceCut;
        gIsPriceCut = function (raw) {
          const rIdx = window.__arActiveRenderCutIdx;
          if (typeof rIdx === 'number' && rIdx >= 0 && cutElementOverrides && cutElementOverrides[rIdx] && cutElementOverrides[rIdx].price) {
            const p = cutElementOverrides[rIdx].price;
            if (isCutElementPropCustomized(p) || p.text) {
              return false;
            }
          }
          return origGIsPriceCut(raw);
        };
        gIsPriceCut._arWrapped = true;
      }
    })();

    function applyCutTransitionPre(c, W, H, transId, localSec) {
      if (!transId || transId === 'default' || transId === 'none') return false;
      const dur = 0.45;
      if (typeof localSec !== 'number' || localSec < 0 || localSec >= dur) return false;
      const tp = Math.max(0, Math.min(1, localSec / dur));
      const ep = 1 - Math.pow(1 - tp, 3);

      c.fillStyle = '#09090b';
      c.fillRect(0, 0, W, H);
      c.save();

      if (transId === 'pushLeft') {
        c.translate((1 - ep) * W, 0);
      } else if (transId === 'pushRight') {
        c.translate(-(1 - ep) * W, 0);
      } else if (transId === 'pushUp') {
        c.translate(0, (1 - ep) * H);
      } else if (transId === 'pushDown') {
        c.translate(0, -(1 - ep) * H);
      } else if (transId === 'zoomIn') {
        const z = 0.52 + 0.48 * ep;
        c.globalAlpha *= ep;
        c.translate(W / 2, H / 2);
        c.scale(z, z);
        c.translate(-W / 2, -H / 2);
      } else if (transId === 'zoomOut') {
        const z = 1.48 - 0.48 * ep;
        c.globalAlpha *= ep;
        c.translate(W / 2, H / 2);
        c.scale(z, z);
        c.translate(-W / 2, -H / 2);
      } else if (transId === 'circleWipe') {
        const maxR = Math.hypot(W, H) * 0.58;
        c.beginPath();
        c.arc(W / 2, H / 2, Math.max(4, maxR * ep), 0, Math.PI * 2);
        c.clip();
      } else if (transId === 'diamondWipe') {
        const r = (W + H) * 0.62 * ep;
        c.beginPath();
        c.moveTo(W / 2, H / 2 - r);
        c.lineTo(W / 2 + r, H / 2);
        c.lineTo(W / 2, H / 2 + r);
        c.lineTo(W / 2 - r, H / 2);
        c.closePath();
        c.clip();
      } else if (transId === 'blinds') {
        const slats = 8;
        const sh = H / slats;
        c.beginPath();
        for (let i = 0; i < slats; i++) {
          c.rect(0, i * sh, W, sh * ep);
        }
        c.clip();
      } else if (transId === 'spin') {
        const z = 0.35 + 0.65 * ep;
        const ang = (1 - ep) * 0.48;
        c.globalAlpha *= ep;
        c.translate(W / 2, H / 2);
        c.rotate(ang);
        c.scale(z, z);
        c.translate(-W / 2, -H / 2);
      } else if (transId === 'glitch') {
        const jitter = (1 - ep) * 28 * Math.sin(localSec * 95);
        c.translate(jitter, 0);
      }
      return true;
    }

    function applyCutTransitionPost(c, W, H, transId, localSec, hadPre) {
      if (hadPre) c.restore();
      if (!transId || transId === 'default' || transId === 'none') return;
      const dur = 0.45;
      if (typeof localSec !== 'number' || localSec < 0 || localSec >= dur) return;
      const tp = Math.max(0, Math.min(1, localSec / dur));
      const ep = 1 - Math.pow(1 - tp, 3);

      c.save();
      if (transId === 'whiteFlash') {
        c.fillStyle = `rgba(255,255,255,${((1 - ep) * 0.92).toFixed(3)})`;
        c.fillRect(0, 0, W, H);
      } else if (transId === 'blackDissolve') {
        c.fillStyle = `rgba(0,0,0,${((1 - ep) * 0.94).toFixed(3)})`;
        c.fillRect(0, 0, W, H);
      } else if (transId === 'crossfade') {
        c.fillStyle = `rgba(12,12,16,${((1 - ep) * 0.78).toFixed(3)})`;
        c.fillRect(0, 0, W, H);
      } else if (transId === 'glitch') {
        const a = (1 - ep) * 0.38;
        c.fillStyle = `rgba(56,189,248,${a.toFixed(3)})`;
        c.fillRect(0, (H * 0.28) | 0, W, 18);
        c.fillStyle = `rgba(244,63,94,${a.toFixed(3)})`;
        c.fillRect(0, (H * 0.64) | 0, W, 14);
      }
      c.restore();
    }

    function renderGenreFrame(t, mainDuration, totalCuts, d) {
      const c = ctx;
      const W = canvas.width;
      const H = canvas.height;
      const baseDesign = getActiveDesign();
      const cutDur = mainDuration / totalCuts;
      const activeCutIdx = t < mainDuration ? Math.min(totalCuts - 1, Math.floor(t / cutDur)) : -1;
      const localSec = activeCutIdx >= 0 ? (t - activeCutIdx * cutDur) : 0;
      const transId = (activeCutIdx >= 0 && campaign.cutTransitions && campaign.cutTransitions[activeCutIdx]) || 'default';
      window.__arActiveRenderCutIdx = activeCutIdx;

      // 컷별 요소 오버라이드(자막 숨김/커스텀 위치, 상단 배지 숨김/문구 변경)를 기본 렌더에 반영
      const ov = activeCutIdx >= 0 && cutElementOverrides ? cutElementOverrides[activeCutIdx] : null;
      const hasCustomBadge = !!(ov && ov.badge && isCutElementPropCustomized(ov.badge));
      const design = ov && ov.badge && (hasCustomBadge || ov.badge.text)
        ? Object.assign({}, baseDesign, {
            head: hasCustomBadge ? 'none' : baseDesign.head,
            label: ov.badge.hidden ? '' : (ov.badge.text || baseDesign.label)
          })
        : baseDesign;
      const V = buildDesignVariant(design, getActivePalette());
      if (ov && ov.badge) {
        if (hasCustomBadge) {
          V.label = '';
        } else if (ov.badge.text) {
          V.label = ov.badge.text;
        }
      }

      const suppressBaseCaption = !!(ov && ov.caption && isCutElementPropCustomized(ov.caption));
      const savedCutCap = suppressBaseCaption && campaign.cutCaptions ? campaign.cutCaptions[activeCutIdx] : undefined;
      const savedHook = suppressBaseCaption ? campaign.hook : undefined;
      if (suppressBaseCaption) {
        if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = ' ';
        campaign.hook = ' ';
      }

      c.save();
      c.textBaseline = 'alphabetic';
      c.globalAlpha = 1;
      c.setLineDash([]);
      c.shadowBlur = 0;
      let hadTransPre = false;
      try {
        if (t < mainDuration) {
          hadTransPre = applyCutTransitionPre(c, W, H, transId, localSec);
        }
        // 사진 탭에서 이 컷의 화면 구도를 [변경]했으면, 모션·장르 디자인이어도 그 컷은 고른 구도(레이아웃·자막 모양)로 그림
        if (t < mainDuration && design.engine !== 'kit') {
          const cIdx = activeCutIdx;
          const cPlan = (campaign.scenePlan && campaign.scenePlan[cIdx]) || {};
          if (cPlan._customWidget && cPlan.widget && cPlan.customLayout) {
            const kd = arCutKitDesign(design);
            if (kd) {
              const KV = buildDesignVariant(kd, getActivePalette());
              renderKitFrame(c, W, H, t, mainDuration, totalCuts, d, kd, KV);
              if (suppressBaseCaption) {
                if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = savedCutCap;
                campaign.hook = savedHook;
              }
              const frac = Math.min(1, Math.max(0, (t - cIdx * cutDur) / cutDur));
              drawCustomCutWidget(c, W, H, t, cIdx, frac, cPlan.widget, d, KV);
              drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, kd, KV);
              applyCutTransitionPost(c, W, H, transId, localSec, hadTransPre);
              hadTransPre = false;
              return;
            }
          }
        }
        if (design.engine === 'motion') {
          renderMotionFrame(c, W, H, t, mainDuration, totalCuts, d, design, V);
          if (suppressBaseCaption) {
            if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = savedCutCap;
            campaign.hook = savedHook;
          }
          if (t < mainDuration) {
            const cutIdx = activeCutIdx;
            const plan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
            if (plan._customWidget && plan.widget) {
              const frac = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
              drawCustomCutWidget(c, W, H, t, cutIdx, frac, plan.widget, d, V);
            }
            drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
            applyCutTransitionPost(c, W, H, transId, localSec, hadTransPre);
            hadTransPre = false;
          }
          return;
        }
        if (design.engine === 'kit') {
          renderKitFrame(c, W, H, t, mainDuration, totalCuts, d, design, V);
          if (suppressBaseCaption) {
            if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = savedCutCap;
            campaign.hook = savedHook;
          }
          if (t < mainDuration) {
            const cutIdx = activeCutIdx;
            const plan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
            if (plan._customWidget && plan.widget) {
              const frac = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
              drawCustomCutWidget(c, W, H, t, cutIdx, frac, plan.widget, d, V);
            }
            drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
            applyCutTransitionPost(c, W, H, transId, localSec, hadTransPre);
            hadTransPre = false;
          }
          return;
        }

        if (t < mainDuration) {
          drawGenreBackground(c, W, H, t, mainDuration, V, false);
          const cutIdx = activeCutIdx;
          const local = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
          const raw = suppressBaseCaption ? '' : ((campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || campaign.hook || '');
          const caption = gCleanCaption(raw);
          const info = {
            V,
            d,
            cutIdx,
            local: Math.min(1, localSec / 1.2),
            frac: local,
            caption,
            isPrice: gIsPriceCut(raw),
            cutDur,
            totalCuts,
            high: design.high,
            alt: design.alt
          };
          if (V.genre === 'sale') drawSaleMain(c, W, H, t, info);
          else if (V.genre === 'luxury') drawLuxuryMain(c, W, H, t, info);
          else if (V.genre === 'ev') drawEvMain(c, W, H, t, info);
          else if (V.genre === 'sports') drawSportsMain(c, W, H, t, info);
          else if (V.genre === 'finance') drawFinanceMain(c, W, H, t, info);
          else drawTrustMain(c, W, H, t, info);
          if (V.genre !== 'finance') drawDealerChip(c, d, W, H, V, gEase(t / 0.6));
          if (suppressBaseCaption) {
            if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = savedCutCap;
            campaign.hook = savedHook;
          }
          const activePlan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
          if (activePlan._customWidget && activePlan.widget) {
            drawCustomCutWidget(c, W, H, t, cutIdx, local, activePlan.widget, d, V);
          }
          drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
          applyCutTransitionPost(c, W, H, transId, localSec, hadTransPre);
          hadTransPre = false;
        } else {
          syncCutVideos(-1, 0);
          drawGenreBackground(c, W, H, t, mainDuration, V, true);
          const local = Math.min(1, (t - mainDuration) / 1.2);
          if (design.cover) drawCoverOutro(c, W, H, t, local, V, d);
          else drawGenreOutro(c, W, H, t, local, V, d);
        }
      } finally {
        if (hadTransPre) c.restore();
        if (suppressBaseCaption) {
          if (Array.isArray(campaign.cutCaptions)) campaign.cutCaptions[activeCutIdx] = savedCutCap;
          campaign.hook = savedHook;
        }
        window.__arActiveRenderCutIdx = -1;
        c.restore();
      }
    }

    loadDesignPrefs();
    (function () {
      const ds = getActiveDesign();
      setTimeout(() => applyDesignBgm(ds, false), 0);
      if (ds && ds.engine === 'kit') Promise.all([ds.font, ds.sfont, 'brush'].filter(Boolean).map(kitEnsureFont)).then(() => {
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      });
    })();
