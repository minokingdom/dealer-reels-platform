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
      { id: 'blackhan', label: '임팩트', css: "'Black Han Sans', sans-serif", weight: 400 },
      { id: 'bagel', label: '통통', css: "'Bagel Fat One', sans-serif", weight: 400 },
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
    const CUT_OVERLAY_ANIMS = [
      { id: 'static', label: '고정' },
      { id: 'pop', label: '팝업' },
      { id: 'slide', label: '슬라이드' },
      { id: 'float', label: '둥실' }
    ];
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

    function loadCutDecos() {
      try {
        localStorage.removeItem('autoreels_cut_decos');
        localStorage.removeItem('autoreels_cut_overlays');
        localStorage.removeItem('autoreels_cut_filters');
        localStorage.removeItem('autoreels_cut_frames');
        localStorage.removeItem('autoreels_cut_strokes');
      } catch (e) {}
      campaign.cutDecos = [];
      campaign.cutOverlays = [];
      campaign.cutFilters = [];
      campaign.cutFrames = [];
      campaign.cutStrokes = [];
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
      window.__arPinnedCut = -1;
      window.__arPinnedCutIdx = -1;
      window.__arSelectedOverlayIdx = -1;
      window.__arOverlayUndo = [];
      closeIgSheet();
      if (typeof closeIgDrawMode === 'function') closeIgDrawMode(true);
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      renderPreviewCutPinBar();
      if (typeof renderCutOverlayEditorLayer === 'function') renderCutOverlayEditorLayer();
      if (typeof renderIgEditorHud === 'function') renderIgEditorHud();
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

    function drawSingleCutOverlayItem(c, W, H, item, localT) {
      if (!item) return;
      const anim = item.anim || 'static';
      const lt = typeof localT === 'number' ? Math.max(0, localT) : 1;
      let animScale = 1, animY = 0, animAlpha = 1;
      if (anim === 'pop' && lt < 0.35) {
        const p = lt / 0.35;
        animScale = 0.4 + 0.6 * (1 + Math.sin(p * Math.PI * 1.1) * 0.14) * Math.min(1, p * 1.2);
        animAlpha = Math.min(1, p * 2.2);
      } else if (anim === 'slide' && lt < 0.4) {
        const p = 1 - Math.pow(1 - lt / 0.4, 3);
        animY = (1 - p) * 48;
        animAlpha = p;
      } else if (anim === 'float') {
        animY = Math.sin(lt * 3.8) * 7;
      }
      const px = (typeof item.x === 'number' ? item.x : 0.5) * W;
      const py = (typeof item.y === 'number' ? item.y : 0.5) * H + animY;
      const sc = Math.max(0.4, Math.min(3.0, Number(item.scale) || 1)) * animScale;
      const rot = ((Number(item.rot) || 0) * Math.PI) / 180;
      const itemAlpha = (typeof item.alpha === 'number' ? item.alpha : 1) * animAlpha;
      c.save();
      c.globalAlpha *= Math.max(0, Math.min(1, itemAlpha));
      c.translate(px, py);
      c.rotate(rot);
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
          const txt = String(item.text || 'NEW');
          const tw = c.measureText(txt).width;
          const padX = Math.round(22 * sc);
          const bh = Math.round(52 * sc);
          const bw = tw + padX * 2;
          c.shadowColor = 'rgba(0,0,0,0.45)';
          c.shadowBlur = 14;
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
          c.shadowBlur = 12;
          c.fillText(String(item.text || '✨'), 0, 0);
        }
      } else if (item.type === 'text') {
        const txt = String(item.text || '').trim();
        if (txt) {
          const st = item.style || 'box';
          const col = item.color || '#ffffff';
          const align = item.align || 'center';
          const fontObj = CUT_TEXT_FONTS.find((f) => f.id === (item.font || 'dohyeon')) || CUT_TEXT_FONTS[0];
          const fs = Math.round(44 * sc * (fontObj.id === 'pen' || fontObj.id === 'brush' || fontObj.id === 'script' ? 1.2 : 1));
          c.font = `${fontObj.weight} ${fs}px ${fontObj.css}`;
          c.textAlign = align;
          const lines = txt.split('\n');
          const lineH = Math.round(fs * 1.28);
          const maxW = Math.max(...lines.map((l) => c.measureText(l).width));
          const totalH = lines.length * lineH;
          const xOff = align === 'left' ? -maxW / 2 : align === 'right' ? maxW / 2 : 0;
          const isLightBg = col === '#ffffff' || col === '#facc15' || col === '#38bdf8' || col === '#34d399' || col === '#a3e635';

          if (st === 'box' || st === 'softbox') {
            const padX = Math.round(22 * sc);
            const padY = Math.round(12 * sc);
            const bw = maxW + padX * 2;
            const bh = totalH + padY * 2;
            c.save();
            if (st === 'softbox') c.globalAlpha = 0.72;
            c.shadowColor = 'rgba(0,0,0,0.35)';
            c.shadowBlur = 14;
            gRoundRect(c, -bw / 2, -bh / 2, bw, bh, Math.round(16 * sc));
            c.fillStyle = col;
            c.fill();
            c.restore();
            c.fillStyle = isLightBg ? '#09090b' : '#ffffff';
          } else if (st === 'highlight') {
            lines.forEach((line, li) => {
              const ly = (li - (lines.length - 1) / 2) * lineH;
              const lw = c.measureText(line).width + 20 * sc;
              const bx = align === 'left' ? -maxW / 2 - 10 * sc : align === 'right' ? maxW / 2 - lw + 10 * sc : -lw / 2;
              c.save();
              c.globalAlpha = 0.85;
              c.fillStyle = col;
              gRoundRect(c, bx, ly - lineH * 0.42, lw, lineH * 0.86, 8 * sc);
              c.fill();
              c.restore();
            });
            c.fillStyle = isLightBg ? '#09090b' : '#ffffff';
          } else if (st === 'neon') {
            c.shadowColor = col;
            c.shadowBlur = 26;
            c.fillStyle = '#ffffff';
            c.strokeStyle = col;
            c.lineWidth = Math.max(2, Math.round(4 * sc));
          } else if (st === 'outline') {
            c.shadowColor = 'rgba(0,0,0,0.6)';
            c.shadowBlur = 8;
            c.fillStyle = col;
            c.strokeStyle = col === '#09090b' ? '#ffffff' : '#09090b';
            c.lineWidth = Math.max(4, Math.round(8 * sc));
            c.lineJoin = 'round';
          } else {
            c.shadowColor = 'rgba(0,0,0,0.75)';
            c.shadowBlur = 12;
            c.shadowOffsetY = 3;
            c.fillStyle = col;
            c.strokeStyle = col === '#09090b' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.5)';
            c.lineWidth = Math.max(1.5, Math.round(3 * sc));
          }
          lines.forEach((line, li) => {
            const ly = (li - (lines.length - 1) / 2) * lineH;
            if (st !== 'box' && st !== 'softbox' && st !== 'highlight') c.strokeText(line, xOff, ly);
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
      const overlays = (campaign.cutOverlays && campaign.cutOverlays[cutIdx]) || [];
      if (Array.isArray(overlays) && overlays.length) {
        overlays.forEach((item) => drawSingleCutOverlayItem(c, W, H, item, localT));
      }
      if (typeof drawCutStrokesOverlay === 'function') drawCutStrokesOverlay(c, W, H, cutIdx);
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
        const hasDeco = (decos[i] && decos[i] !== 'none') || (flts[i] && flts[i] !== 'none') || !!frms[i] || (Array.isArray(ovs[i]) && ovs[i].length > 0) || (Array.isArray(stks[i]) && stks[i].length > 0);
        if (hasDeco) anyEdited = true;
        return `<button type="button" onclick="togglePinPreviewCut(${i})" class="px-1.5 py-0.5 min-w-[20px] shrink-0 rounded-[6px] text-[10.5px] font-semibold border cursor-pointer transition ${pinned ? 'bg-white border-white text-[#09090b]' : hasDeco ? 'bg-[#facc15]/15 border-[#facc15]/60 text-[#fde047]' : 'bg-white/5 border-white/10 text-[#a1a1a6] hover:text-white'}" title="${i + 1}번 컷 편집">${i + 1}${hasDeco ? '✦' : ''}</button>`;
      }).join('');
      const clearBtn = document.getElementById('clearAllCutEditsBtn');
      if (clearBtn) clearBtn.classList.toggle('hidden', !anyEdited);
      renderIgEditorHud();
      renderCutOverlayEditorLayer();
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
      if (!layer) return;
      const cutIdx = window.__arPinnedCut;
      if (cutIdx === undefined || cutIdx < 0) {
        layer.classList.add('hidden');
        layer.classList.remove('pointer-events-auto');
        layer.classList.add('pointer-events-none');
        layer.innerHTML = '';
        return;
      }
      const list = getCutOverlayList(cutIdx);
      if (!list.length) {
        layer.classList.add('hidden');
        layer.innerHTML = '';
        return;
      }
      layer.classList.remove('hidden', 'pointer-events-none');
      layer.classList.add('pointer-events-auto');

      layer.innerHTML = `
        <div id="cutSnapV" class="hidden absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#38bdf8]/80 pointer-events-none"></div>
        <div id="cutSnapH" class="hidden absolute left-0 right-0 top-1/2 h-[1px] bg-[#38bdf8]/80 pointer-events-none"></div>
      ` + list.map((it, ii) => {
        const sel = window.__arSelectedOverlayIdx === ii;
        const leftPct = ((typeof it.x === 'number' ? it.x : 0.5) * 100).toFixed(2);
        const topPct = ((typeof it.y === 'number' ? it.y : 0.5) * 100).toFixed(2);
        const sc = Number(it.scale) || 1;
        const boxW = Math.round((it.type === 'sticker' && it.variant !== 'badge' ? 62 : 130) * Math.min(1.8, Math.max(0.7, sc)));
        const boxH = Math.round((it.type === 'sticker' && it.variant !== 'badge' ? 62 : 44) * Math.min(1.8, Math.max(0.7, sc)));
        return `
          <div data-ov-idx="${ii}"
               ondblclick="if(${it.type === 'text' ? 'true' : 'false'})openIgTextCompose(${ii})"
               style="left:${leftPct}%;top:${topPct}%;width:${boxW}px;height:${boxH}px;transform:translate(-50%,-50%) rotate(${it.rot || 0}deg);touch-action:none;"
               class="absolute cursor-move rounded-[10px] ${sel ? 'ring-1 ring-white/85 bg-white/5' : ''}">
          </div>
        `;
      }).join('');

      if (!layer._boundDrag) {
        layer._boundDrag = true;
        let dragIdx = -1, startX = 0, startY = 0, origX = 0.5, origY = 0.5, moved = false, overTrash = false;
        const onStart = (ev) => {
          const card = ev.target.closest('[data-ov-idx]');
          if (!card) {
            if (window.__arSelectedOverlayIdx >= 0) { window.__arSelectedOverlayIdx = -1; renderIgEditorHud(); renderCutOverlayEditorLayer(); }
            return;
          }
          ev.preventDefault();
          dragIdx = Number(card.getAttribute('data-ov-idx'));
          moved = false;
          overTrash = false;
          if (window.__arSelectedOverlayIdx !== dragIdx) {
            window.__arSelectedOverlayIdx = dragIdx;
            renderIgEditorHud();
          }
          const pt = ev.touches ? ev.touches[0] : ev;
          startX = pt.clientX;
          startY = pt.clientY;
          const it = getCutOverlayList(window.__arPinnedCut)[dragIdx];
          origX = it ? (it.x ?? 0.5) : 0.5;
          origY = it ? (it.y ?? 0.5) : 0.5;
        };
        const onMove = (ev) => {
          if (dragIdx < 0 || window.__arPinnedCut < 0) return;
          const rect = layer.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const pt = ev.touches ? ev.touches[0] : ev;
          if (Math.hypot(pt.clientX - startX, pt.clientY - startY) > 4) moved = true;
          let nx = Math.max(0.06, Math.min(0.94, origX + (pt.clientX - startX) / rect.width));
          let ny = Math.max(0.06, Math.min(0.94, origY + (pt.clientY - startY) / rect.height));
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
            it.x = nx;
            it.y = ny;
            const card = layer.querySelector(`[data-ov-idx="${dragIdx}"]`);
            if (card) { card.style.left = `${(nx * 100).toFixed(2)}%`; card.style.top = `${(ny * 100).toFixed(2)}%`; }
            if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
          }
        };
        const onEnd = () => {
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
      if (typeof idx !== 'number' || idx < 0) { window.__arPinnedCut = -1; window.__arSelectedOverlayIdx = -1; renderPreviewCutPinBar(); return; }
      if (window.__arPinnedCut === idx) {
        window.__arPinnedCut = -1;
        window.__arSelectedOverlayIdx = -1;
        isPlaying = true;
        const ppBtn = document.getElementById('playPauseBtn');
        if (ppBtn) ppBtn.textContent = '⏸ 일시정지';
        if (typeof updatePlayPauseUI === 'function') updatePlayPauseUI();
      } else {
        window.__arPinnedCut = idx;
        window.__arSelectedOverlayIdx = -1;
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
    function renderGenreFrame(t, mainDuration, totalCuts, d) {
      const c = ctx;
      const W = canvas.width;
      const H = canvas.height;
      const design = getActiveDesign();
      const V = buildDesignVariant(design, getActivePalette());
      const cutDur = mainDuration / totalCuts;
      c.save();
      c.textBaseline = 'alphabetic';
      c.globalAlpha = 1;
      c.setLineDash([]);
      c.shadowBlur = 0;
      // 사진 탭에서 이 컷의 화면 구도를 [변경]했으면, 모션·장르 디자인이어도 그 컷은 고른 구도(레이아웃·자막 모양)로 그림
      //   (예전에는 모션 디자인에서 작은 표시만 바뀌어 [변경]이 반영되지 않는 것처럼 보였음)
      if (t < mainDuration && design.engine !== 'kit') {
        const cIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
        const cPlan = (campaign.scenePlan && campaign.scenePlan[cIdx]) || {};
        if (cPlan._customWidget && cPlan.widget && cPlan.customLayout) {
          const kd = arCutKitDesign(design);
          if (kd) {
            const KV = buildDesignVariant(kd, getActivePalette());
            renderKitFrame(c, W, H, t, mainDuration, totalCuts, d, kd, KV);
            const frac = Math.min(1, Math.max(0, (t - cIdx * cutDur) / cutDur));
            drawCustomCutWidget(c, W, H, t, cIdx, frac, cPlan.widget, d, KV);
            drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, kd, KV);
            c.restore();
            return;
          }
        }
      }
      if (design.engine === 'motion') {
        renderMotionFrame(c, W, H, t, mainDuration, totalCuts, d, design, V);
        // 사진 탭에서 컷별 화면 구도를 바꿨으면 모션 디자인 위에도 덧그림 (예전에는 무시돼서 [변경]이 반영되지 않았음)
        if (t < mainDuration) {
          const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
          const plan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
          if (plan._customWidget && plan.widget) {
            const frac = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
            drawCustomCutWidget(c, W, H, t, cutIdx, frac, plan.widget, d, V);
          }
          drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
        }
        c.restore();
        return;
      }
      if (design.engine === 'kit') {
        renderKitFrame(c, W, H, t, mainDuration, totalCuts, d, design, V);
        if (t < mainDuration) {
          const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
          const plan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
          if (plan._customWidget && plan.widget) {
            const frac = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
            drawCustomCutWidget(c, W, H, t, cutIdx, frac, plan.widget, d, V);
          }
          drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
        }
        c.restore();
        return;
      }

      if (t < mainDuration) {
        drawGenreBackground(c, W, H, t, mainDuration, V, false);
        const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
        const local = Math.min(1, Math.max(0, (t - cutIdx * cutDur) / cutDur));
        const localSec = t - cutIdx * cutDur;
        const raw = (campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || campaign.hook || '';
        const caption = gCleanCaption(raw);
        const info = {
          V,
          d,
          cutIdx,
          local: Math.min(1, localSec / 1.2), // 컷 시작 후 1.2초에 걸친 등장 진행도
          frac: local, // 컷 안에서의 진행 비율 (0~1)
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
        const activePlan = (campaign.scenePlan && campaign.scenePlan[cutIdx]) || {};
        if (activePlan._customWidget && activePlan.widget) {
          drawCustomCutWidget(c, W, H, t, cutIdx, local, activePlan.widget, d, V);
        }
        drawCustomCutDecoOverlay(c, W, H, t, mainDuration, totalCuts, cutDur, design, V);
      } else {
        syncCutVideos(-1, 0);
        drawGenreBackground(c, W, H, t, mainDuration, V, true);
        const local = Math.min(1, (t - mainDuration) / 1.2);
        if (design.cover) drawCoverOutro(c, W, H, t, local, V, d);
        else drawGenreOutro(c, W, H, t, local, V, d);
      }
      c.restore();
    }

    loadDesignPrefs();
    (function () {
      const ds = getActiveDesign();
      setTimeout(() => applyDesignBgm(ds, false), 0);
      if (ds && ds.engine === 'kit') Promise.all([ds.font, ds.sfont, 'brush'].filter(Boolean).map(kitEnsureFont)).then(() => {
        if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      });
    })();
