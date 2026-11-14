// AutoReels — 06-design-kit.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ==========================================================================
    // ★ 기본 디자인 12종(장르 엔진) — 아래 디자인 키트 124종과 합쳐 모두 136종.
    //   색상은 여기서 정하지 않고, 카마스터가 아래 COLOR_PALETTES에서 따로 고릅니다.
    //   대본 템플릿(STORY_ARCHETYPES)은 문구만 바꾸고 디자인은 바꾸지 않습니다.
    // ==========================================================================
    const DESIGN_STYLES = [
      { id: 'sale_coupon', name: '특가 쿠폰', desc: '기울어진 노란 띠 · 할인 숫자 카운트업 · 절취선 쿠폰 명함', genre: 'sale', label: '특가 진행중', sig: 'countdown', high: false, alt: false, cover: false, accent: '#ef4444', accent2: '#facc15' },
      { id: 'sale_news', name: '뉴스 속보', desc: '상단 속보 띠와 흐르는 자막 · 검은 띠 자막 · 표지형 명함', genre: 'sale', label: 'LIVE 특가속보', sig: 'ticker', high: true, alt: true, cover: true, accent: '#dc2626', accent2: '#fde047' },
      { id: 'lux_editorial', name: '에디토리얼', desc: '흑백 화보 · 명조체 가운데 자막 · 금테 액자 명함', genre: 'luxury', label: 'THE EDITORIAL', sig: 'masthead', grade: 'mono', high: false, alt: false, cover: false, accent: '#e7d8b5', accent2: '#ffffff' },
      { id: 'lux_cinema', name: '시네마', desc: '영화 비율 검은 띠 · 필름 질감 · 왼쪽 정렬 자막 · 표지형 명함', genre: 'luxury', label: 'CINÉMA', sig: 'film', grade: 'film', high: true, alt: true, cover: true, accent: '#f2c46d', accent2: '#ffffff' },
      { id: 'ev_hud', name: '글래스 HUD', desc: '모서리 표시 · 스캔선 · 유리 패널 자막 · ID 카드 명함', genre: 'ev', label: 'EV SYSTEM', sig: 'grid', high: false, alt: false, cover: false, accent: '#22d3ee', accent2: '#a5f3fc' },
      { id: 'ev_terminal', name: '터미널', desc: '레이더 원 · 글자가 타이핑되는 자막 · 표지형 명함', genre: 'ev', label: 'AUTOPILOT', sig: 'radar', high: true, alt: true, cover: true, accent: '#38bdf8', accent2: '#e0f2fe' },
      { id: 'sport_race', name: '레이스', desc: '연석 무늬 · 속도선 · 비스듬한 색 블록 자막 · 레이서 카드', genre: 'sports', label: 'RACE MODE', sig: 'checker', high: false, alt: false, cover: false, accent: '#ef4444', accent2: '#ffffff' },
      { id: 'sport_outline', name: '퍼포먼스', desc: '0→100 타이머 · 거대한 외곽선 글씨 · 표지형 명함', genre: 'sports', label: 'LAUNCH', sig: 'timer', high: true, alt: true, cover: true, accent: '#facc15', accent2: '#ffffff' },
      { id: 'fin_chat', name: '채팅 상담', desc: '위 사진 · 아래 메신저 말풍선 · 견적서 카드 · DM 명함', genre: 'finance', label: '1:1 견적상담', sig: 'split', high: false, alt: false, cover: false, accent: '#6366f1', accent2: '#e0e7ff' },
      { id: 'fin_notice', name: '알림 카드', desc: '사진 전체 화면 · 푸시 알림 자막 · 표지형 명함', genre: 'finance', label: '견적 알림', sig: 'receipt', high: false, alt: true, cover: true, accent: '#0ea5e9', accent2: '#e0f2fe' },
      { id: 'trust_card', name: '화이트 카드', desc: '밝은 톤 · 아래 흰 카드 자막 · 인증서 명함', genre: 'trust', label: '인증 카마스터', sig: 'seal', high: false, alt: false, cover: false, accent: '#1d4ed8', accent2: '#dbeafe' },
      { id: 'trust_check', name: '체크리스트', desc: '검수 진행 표시 · 위쪽 체크 카드 자막 · 표지형 명함', genre: 'trust', label: '정밀 검수 완료', sig: 'checklist', high: true, alt: true, cover: true, accent: '#0284c7', accent2: '#e0f2fe' }
    ];

    // 색상 — 어떤 디자인에도 적용되는 포인트 색 (디자인 수에 세지 않음)
    const COLOR_PALETTES = [
      { id: 'default', name: '디자인 기본색' },
      { id: 'red', name: '레드', accent: '#ef4444', accent2: '#fde047' },
      { id: 'orange', name: '오렌지', accent: '#f97316', accent2: '#fed7aa' },
      { id: 'gold', name: '골드', accent: '#d4af37', accent2: '#f5e6b8' },
      { id: 'yellow', name: '옐로', accent: '#facc15', accent2: '#fef9c3' },
      { id: 'green', name: '그린', accent: '#22c55e', accent2: '#bbf7d0' },
      { id: 'teal', name: '틸', accent: '#14b8a6', accent2: '#ccfbf1' },
      { id: 'sky', name: '스카이', accent: '#38bdf8', accent2: '#e0f2fe' },
      { id: 'blue', name: '블루', accent: '#2563eb', accent2: '#dbeafe' },
      { id: 'purple', name: '퍼플', accent: '#8b5cf6', accent2: '#ede9fe' },
      { id: 'pink', name: '핑크', accent: '#ec4899', accent2: '#fce7f3' },
      { id: 'silver', name: '실버', accent: '#cbd5e1', accent2: '#ffffff' }
    ];

    function gLuminance(hex) {
      const m = String(hex || '').match(/^#?([0-9a-f]{6})$/i);
      if (!m) return -1;
      const n = parseInt(m[1], 16);
      const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    }
    // 색을 흰색(amount>0) 또는 검은색(amount<0) 쪽으로 섞음
    function gMix(hex, amount) {
      const n = parseInt(String(hex).replace('#', ''), 16);
      const to = amount > 0 ? 255 : 0;
      const k = Math.abs(amount);
      const mix = (v) => Math.round(v + (to - v) * k);
      const r = mix((n >> 16) & 255);
      const g = mix((n >> 8) & 255);
      const b = mix(n & 255);
      return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }
    // 바탕이 밝은 디자인에는 충분히 진하게, 어두운 디자인에는 충분히 밝게 맞춤 (글씨가 안 보이는 일 방지)
    function gReadableAccent(hex, lightBg) {
      let c = hex;
      for (let i = 0; i < 8; i++) {
        const l = gLuminance(c);
        if (lightBg && l > 0.32) c = gMix(c, -0.15);
        else if (!lightBg && l < 0.16) c = gMix(c, 0.18);
        else break;
      }
      return c;
    }

    // ==========================================================================
    // ★ 디자인 키트 — 사진 배치 12 · 자막 16 · 장식 12 · 전환 8 · 명함 12 · 글꼴 8가지 부품.
    //   아래 KIT_DESIGNS 88종은 이 부품을 골라 만든 디자인으로, 어떤 두 디자인도
    //   "사진 배치 + 자막" 조합이 겹치지 않고 최소 3가지 부품이 서로 다릅니다.
    //   색상은 여기서 정하지 않습니다 (COLOR_PALETTES에서 따로 선택).
    // ==========================================================================
    const KIT_FONTS = {
      impact: { f: GENRE_FONTS.impact, w: 400, k: 1 },
      serif: { f: GENRE_FONTS.serif, w: 700, k: 1 },
      sans: { f: GENRE_FONTS.sans, w: 800, k: 1 },
      mono: { f: GENRE_FONTS.mono, w: 700, k: 0.9 },
      dohyeon: { f: '"Do Hyeon", "Pretendard Variable", sans-serif', w: 400, k: 1.05 },
      jua: { f: '"Jua", "Pretendard Variable", sans-serif', w: 400, k: 1 },
      pen: { f: '"Nanum Pen Script", "Pretendard Variable", cursive', w: 400, k: 1.35 },
      gugi: { f: '"Gugi", "Pretendard Variable", sans-serif', w: 400, k: 0.92 },
      gaegu: { f: '"Gaegu", "Pretendard Variable", cursive', w: 700, k: 1.15 },
      himelody: { f: '"Hi Melody", "Pretendard Variable", cursive', w: 400, k: 1.25 },
      dokdo: { f: '"East Sea Dokdo", "Pretendard Variable", cursive', w: 400, k: 1.4 },
      singleday: { f: '"Single Day", "Pretendard Variable", cursive', w: 400, k: 1.0 },
      yeonsung: { f: '"Yeon Sung", "Pretendard Variable", cursive', w: 400, k: 1.05 },
      poorstory: { f: '"Poor Story", "Pretendard Variable", cursive', w: 400, k: 1.12 },
      gamja: { f: '"Gamja Flower", "Pretendard Variable", cursive', w: 400, k: 1.12 },
      brush: { f: '"Nanum Brush Script", "Pretendard Variable", cursive', w: 400, k: 1.4 },
      gasoek: { f: '"Pretendard Variable", Pretendard, "Do Hyeon", sans-serif', w: 900, k: 0.96 },
      bagel: { f: '"Jua", "Do Hyeon", "Pretendard Variable", sans-serif', w: 400, k: 0.96 },
      songmyung: { f: '"Song Myung", "Noto Serif KR", serif', w: 400, k: 1.0 },
      bwpicture: { f: '"Black And White Picture", "Pretendard Variable", sans-serif', w: 400, k: 1.1 },
      dongle: { f: '"Dongle", "Pretendard Variable", sans-serif', w: 700, k: 1.6 },
      serif7: { f: GENRE_FONTS.serif, w: 700, k: 1 },
      greatvibes: { f: '"Great Vibes", "Nanum Brush Script", cursive', w: 400, k: 1.15 },
      pinyon: { f: '"Pinyon Script", "Nanum Brush Script", cursive', w: 400, k: 1.0 },
      // 인스타 감성 스타일용: 얇은 명조·얇은 고딕
      maru: { f: '"MaruBuri", "Gowun Batang", serif', w: 600, k: 1 },
      maruL: { f: '"MaruBuri", "Gowun Batang", serif', w: 400, k: 1 },
      gowun: { f: '"Gowun Batang", "MaruBuri", serif', w: 400, k: 1.02 },
      pretL: { f: '"Pretendard Variable", Pretendard, sans-serif', w: 500, k: 1 },
      pretM: { f: '"Pretendard Variable", Pretendard, sans-serif', w: 600, k: 1 }
    };
    // 디자인에 쓰인 글꼴만 그때그때 내려받음 (처음 화면을 무겁게 하지 않도록)
    const kitFontLoads = {};
    function kitEnsureFont(key) {
      const F = KIT_FONTS[key];
      if (!F || !document.fonts || !document.fonts.load) return Promise.resolve();
      if (!kitFontLoads[key]) {
        const fam = F.f.split(',')[0];
        kitFontLoads[key] = document.fonts.load(`${F.w} 40px ${fam}`, '가나다AB12').catch(() => null);
      }
      return kitFontLoads[key];
    }
    Object.assign(GENRE_FILTERS, {
      none: 'none',
      vivid: 'saturate(1.45) contrast(1.1)',
      pastel: 'saturate(0.72) brightness(1.12) contrast(0.9)',
      teal: 'saturate(1.1) hue-rotate(-18deg) contrast(1.08)',
      sepia: 'sepia(0.7) contrast(1.05) brightness(0.95)'
    });

    function kFont(key, size) {
      const F = KIT_FONTS[key] || KIT_FONTS.sans;
      return gFont(F.w, Math.round(size * F.k), F.f);
    }
    function kWrap(c, text, maxW, maxLines, size, minSize, key) {
      const F = KIT_FONTS[key] || KIT_FONTS.sans;
      const r = gWrap(c, text, maxW, maxLines, Math.round(size * F.k), Math.round(minSize * F.k), F.f, F.w);
      return { lines: r.lines, size: r.size, lh: Math.round(r.size * 1.28) };
    }
    function kLine(c, text, x, y, maxW, size, minSize, key) {
      const F = KIT_FONTS[key] || KIT_FONTS.sans;
      return gDrawLine(c, text, x, y, maxW, Math.round(size * F.k), Math.round(minSize * F.k), F.f, F.w);
    }
    function kTextOn(col) {
      return gLuminance(col) > 0.42 ? '#111111' : '#ffffff';
    }
    function kPad(n) {
      return String(n).padStart(2, '0');
    }
    // 테두리(strokeText) 대신 세련된 긴 그림자(Long Shadow) & 소프트 섀도우 타이포 헬퍼
    // 2026-11: 겹겹이 쌓던 긴 그림자는 글자 테두리처럼 보여 촌스럽다는 의견 → 깔끔한 채움 글자만 (밝은 글자는 사진 위에서 읽히게 옅은 그림자)
    //   (이름·인자는 호출부 호환을 위해 그대로 둠, shadowCol·depth·dx·dy 는 쓰지 않음)
    function kLongShadow(c, text, x, y, fillCol, shadowCol = 'rgba(0,0,0,0.48)', depth = 12, dx = 0.85, dy = 1.0) {
      c.save();
      if (gLuminance(fillCol) > 0.5) {
        c.shadowColor = 'rgba(0,0,0,0.22)';
        c.shadowBlur = 10;
      } else {
        c.shadowColor = 'transparent';
      }
      c.shadowOffsetX = 0;
      c.shadowOffsetY = 0;
      c.fillStyle = fillCol;
      c.fillText(text, x, y);
      c.restore();
    }
    function kSoftDepthText(c, text, x, y, fillCol, shadowCol = 'rgba(0,0,0,0.72)', blur = 18, offsetY = 4) {
      c.save();
      // 진한 번짐(테두리처럼 보임) 대신 옅은 그림자만
      c.shadowColor = 'rgba(0,0,0,0.26)';
      c.shadowBlur = Math.min(blur, 10);
      c.shadowOffsetY = 0;
      c.fillStyle = fillCol;
      c.fillText(text, x, y);
      c.shadowBlur = 5;
      c.shadowOffsetY = 2;
      c.fillText(text, x, y);
      c.restore();
    }

    // 잔 노이즈 (필름 질감) — 한 번만 만들어 둠
    let kitNoiseCanvas = null;
    function kitNoise() {
      if (kitNoiseCanvas) return kitNoiseCanvas;
      const nc = document.createElement('canvas');
      nc.width = 180;
      nc.height = 320;
      const nx = nc.getContext('2d');
      const img = nx.createImageData(nc.width, nc.height);
      let seed = 1234567;
      for (let i = 0; i < img.data.length; i += 4) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const v = seed % 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      nx.putImageData(img, 0, 0);
      kitNoiseCanvas = nc;
      return nc;
    }

    // 화면 위쪽이 사진인 배치 (머리표·장식을 흰색으로)
    const KIT_PHOTO_TOP = ['full', 'blinds', 'diag', 'dim', 'handheld'];

    // ---------- 장면(사진·영상) 계산 ----------
    function kitScene(t, mainDuration, isOutro) {
      const photos = campaign.uploadedPhotos || [];
      const n = photos.length;
      if (!n) return { photos, n: 0, idx: 0, p: 0, tp: 1, into: t, sceneDur: mainDuration };
      const sceneDur = mainDuration / n;
      const tt = isOutro ? mainDuration - 0.01 : t;
      const idx = Math.min(n - 1, Math.floor(tt / sceneDur));
      const into = tt - idx * sceneDur;
      if (!isOutro) syncCutVideos(idx, Math.max(0, (window.__realTimelineT || 0) - toRealTime(idx * sceneDur)));
      return { photos, n, idx, p: Math.min(1, into / sceneDur), tp: idx === 0 || isOutro ? 1 : Math.min(1, into / 0.5), into, sceneDur };
    }
    function kitImg(S, k) {
      if (!S.n) return null;
      return S.photos[(((S.idx + k) % S.n) + S.n) % S.n];
    }
    function kitCover(c, img, x, y, w, h, scale, px, py) {
      if (!img) return;
      if (img._isVideo && img.readyState < 2) return;
      const sw = img.videoWidth || img.naturalWidth || img.width;
      const sh = img.videoHeight || img.naturalHeight || img.height;
      if (!sw || !sh) return;
      const r = Math.max(w / sw, h / sh) * scale;
      c.drawImage(img, x + (w - sw * r) / 2 + px, y + (h - sh * r) / 2 + py, sw * r, sh * r);
    }
    function kitShapePath(c, r) {
      if (r.shape === 'round') {
        gRoundRect(c, r.x, r.y, r.w, r.h, r.rad || 24);
        return;
      }
      c.beginPath();
      if (r.shape === 'circle') c.arc(r.x + r.w / 2, r.y + r.h / 2, Math.min(r.w, r.h) / 2, 0, Math.PI * 2);
      else if (r.shape === 'arch') {
        const rad = r.w / 2;
        c.moveTo(r.x, r.y + r.h);
        c.lineTo(r.x, r.y + rad);
        c.arc(r.x + rad, r.y + rad, rad, Math.PI, 0);
        c.lineTo(r.x + r.w, r.y + r.h);
        c.closePath();
      } else if (r.shape === 'diag') {
        c.moveTo(r.x, r.y);
        c.lineTo(r.x + r.w, r.y);
        c.lineTo(r.x + r.w, r.y + r.h - 100);
        c.lineTo(r.x, r.y + r.h);
        c.closePath();
      } else c.rect(r.x, r.y, r.w, r.h);
    }
    // 사각·원·아치 등 영역 안에 사진을 그리고, 장면이 바뀔 때 디자인별 전환을 적용
    function kitPhoto(c, r, S, spec, opts) {
      const o = opts || {};
      c.save();
      kitShapePath(c, r);
      c.clip();
      if (!S.n) {
        const g = c.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
        g.addColorStop(0, '#3f4a5c');
        g.addColorStop(1, '#10151f');
        c.fillStyle = g;
        c.fillRect(r.x, r.y, r.w, r.h);
        c.restore();
        return;
      }
      const canFilter = 'filter' in c;
      if (canFilter) c.filter = o.filter || GENRE_FILTERS[spec.grade] || 'none';
      const k = o.offset || 0;
      const cur = kitImg(S, k);
      const prev = kitImg(S, k - 1);
      const kb = (p, i) => {
        const m = (((i + (spec.seed || 0)) % 3) + 3) % 3;
        if (m === 0) return { s: 1.04 + 0.08 * p, x: 0, y: 0 };
        if (m === 1) return { s: 1.12, x: 24 - 48 * p, y: 0 };
        return { s: 1.14 - 0.08 * p, x: 0, y: -12 + 24 * p };
      };
      const mc = kb(o.still ? 0.5 : S.p, S.idx + k);
      const mp = kb(1, S.idx + k - 1);
      const tp = o.still ? 1 : S.tp;
      const e = gEase(tp);
      const tr = o.trans || spec.trans;
      const draw = (img, m, dx, dy, sc, a) => {
        c.globalAlpha = a;
        kitCover(c, img, r.x + dx, r.y + dy, r.w, r.h, m.s * (sc || 1), m.x, m.y);
        c.globalAlpha = 1;
      };
      if (tp >= 1 || S.n === 1) draw(cur, mc, 0, 0, 1, 1);
      else if (tr === 'slide') {
        draw(prev, mp, -e * r.w, 0, 1, 1);
        draw(cur, mc, (1 - e) * r.w, 0, 1, 1);
      } else if (tr === 'drop') {
        draw(prev, mp, 0, 0, 1, 1);
        draw(cur, mc, 0, -(1 - gBack(tp)) * r.h, 1, 1);
      } else if (tr === 'zoom') {
        draw(prev, mp, 0, 0, 1, 1);
        draw(cur, mc, 0, 0, 1.35 - 0.35 * e, e);
      } else if (tr === 'wipe') {
        draw(prev, mp, 0, 0, 1, 1);
        c.save();
        c.beginPath();
        const X = r.x + e * (r.w + r.h);
        c.moveTo(r.x - 10, r.y);
        c.lineTo(X, r.y);
        c.lineTo(X - r.h, r.y + r.h);
        c.lineTo(r.x - 10, r.y + r.h);
        c.closePath();
        c.clip();
        draw(cur, mc, 0, 0, 1, 1);
        c.restore();
      } else if (tr === 'glitch') {
        draw(prev, mp, 0, 0, 1, 1);
        if (tp < 0.5) {
          for (let i = 0; i < 10; i++) {
            const sy = r.y + (i * r.h) / 10;
            c.save();
            c.beginPath();
            c.rect(r.x, sy, r.w, r.h / 10 + 1);
            c.clip();
            const off = ((gHash(String(i * 7 + Math.floor(S.into * 30))) % 100) - 50) * (1 - tp * 2) * 1.4;
            draw(cur, mc, off, 0, 1, 1);
            c.restore();
          }
        } else draw(cur, mc, 0, 0, 1, 1);
      } else if (tr === 'flash') {
        draw(cur, mc, 0, 0, 1, 1);
        c.fillStyle = '#ffffff';
        c.globalAlpha = 1 - e;
        c.fillRect(r.x, r.y, r.w, r.h);
        c.globalAlpha = 1;
      } else if (tr === 'blinds') {
        draw(prev, mp, 0, 0, 1, 1);
        const N = 5;
        const sw = r.w / N;
        for (let i = 0; i < N; i++) {
          const pe = gEase((tp - i * 0.08) / 0.6);
          if (pe <= 0) continue;
          c.save();
          c.beginPath();
          c.rect(r.x + i * sw, r.y, sw + 1, r.h * pe);
          c.clip();
          draw(cur, mc, 0, 0, 1, 1);
          c.restore();
        }
      } else if (tr === 'iris') {
        draw(prev, mp, 0, 0, 1, 1);
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const maxR = Math.hypot(r.w / 2, r.h / 2) * 1.05;
        const rad = Math.max(2, e * maxR);
        c.save();
        c.beginPath();
        c.arc(cx, cy, rad, 0, Math.PI * 2);
        c.clip();
        draw(cur, mc, 0, 0, 1.08 - 0.08 * e, 1);
        c.restore();
        c.save();
        c.strokeStyle = spec.accent || '#facc15';
        c.lineWidth = Math.max(3, 14 * (1 - e));
        c.beginPath();
        c.arc(cx, cy, rad, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      } else if (tr === 'diamond') {
        draw(prev, mp, 0, 0, 1, 1);
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const span = (r.w + r.h) * 0.65 * e;
        c.save();
        c.beginPath();
        c.moveTo(cx, cy - span);
        c.lineTo(cx + span, cy);
        c.lineTo(cx, cy + span);
        c.lineTo(cx - span, cy);
        c.closePath();
        c.clip();
        draw(cur, mc, 0, 0, 1.06 - 0.06 * e, 1);
        c.restore();
        c.save();
        c.strokeStyle = spec.accent || '#38bdf8';
        c.lineWidth = Math.max(2, 12 * (1 - e));
        c.beginPath();
        c.moveTo(cx, cy - span);
        c.lineTo(cx + span, cy);
        c.lineTo(cx, cy + span);
        c.lineTo(cx - span, cy);
        c.closePath();
        c.stroke();
        c.restore();
      } else if (tr === 'hex') {
        draw(prev, mp, 0, 0, 1, 1);
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const rad = Math.max(4, Math.hypot(r.w, r.h) * 0.62 * e);
        const rot = (1 - e) * 0.65;
        const traceHex = () => {
          c.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = rot + (i * Math.PI) / 3;
            const px = cx + Math.cos(a) * rad;
            const py = cy + Math.sin(a) * rad;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.closePath();
        };
        c.save();
        traceHex();
        c.clip();
        draw(cur, mc, 0, 0, 1.08 - 0.08 * e, 1);
        c.restore();
        c.save();
        c.strokeStyle = spec.accent || '#a855f7';
        c.lineWidth = Math.max(2, 12 * (1 - e));
        traceHex();
        c.stroke();
        c.restore();
      } else if (tr === 'barswipe') {
        draw(prev, mp, 0, 0, 1, 1);
        const rows = 4;
        const bh = r.h / rows;
        for (let i = 0; i < rows; i++) {
          const pe = gEase((tp - i * 0.08) / 0.68);
          if (pe <= 0) continue;
          const bw = r.w * pe;
          const bx = i % 2 === 0 ? r.x : r.x + r.w - bw;
          const by = r.y + i * bh;
          c.save();
          c.beginPath();
          c.rect(bx, by, bw + 1, bh + 1);
          c.clip();
          draw(cur, mc, 0, 0, 1, 1);
          c.restore();
          if (pe < 0.98) {
            c.fillStyle = spec.accent || '#ec4899';
            c.fillRect(i % 2 === 0 ? bx + bw - 6 : bx, by, 6, bh);
          }
        }
      } else {
        draw(prev, mp, 0, 0, 1, 1);
        draw(cur, mc, 0, 0, 1, e);
      }
      if (canFilter) c.filter = 'none';
      c.restore();
    }

    // ---------- 사진 배치 12가지 → 자막이 들어갈 자리(zone)를 돌려줌 ----------
    function kitLayout(c, W, H, t, S, spec, V, K) {
      const L = spec.layout;
      const fillBg = () => {
        c.fillStyle = K.bg;
        c.fillRect(0, 0, W, H);
      };
      const scrim = (y0, a) => {
        const g = c.createLinearGradient(0, y0, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.45, `rgba(0,0,0,${a * 0.7})`);
        g.addColorStop(1, `rgba(0,0,0,${a})`);
        c.fillStyle = g;
        c.fillRect(0, y0, W, H - y0);
        const g2 = c.createLinearGradient(0, 0, 0, 150);
        g2.addColorStop(0, 'rgba(0,0,0,0.38)');
        g2.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = g2;
        c.fillRect(0, 0, W, 150);
      };
      if (L === 'full' || L === 'blinds') {
        kitPhoto(c, { x: 0, y: 0, w: W, h: H }, S, spec, L === 'blinds' ? { trans: 'blinds' } : null);
        scrim(H * 0.42, 0.78);
        return { x: 30, y: 590, w: W - 60, h: 260, onPhoto: true };
      }
      if (L === 'duo') {
        fillBg();
        const ent = S.idx === 0 ? Math.min(1, t / 0.55) : 1;
        const drawCard = (bx, by, bw, bh, rad, off, still, borderCol) => {
          c.save();
          c.shadowColor = 'rgba(0,0,0,0.34)';
          c.shadowBlur = 24;
          c.shadowOffsetY = 10;
          gRoundRect(c, bx, by, bw, bh, rad);
          c.fillStyle = K.light ? '#ffffff' : '#18181b';
          c.fill();
          c.restore();
          c.save();
          gRoundRect(c, bx, by, bw, bh, rad);
          c.clip();
          kitPhoto(c, { x: bx, y: by, w: bw, h: bh }, S, spec, still ? { offset: off, still: true } : { offset: off });
          c.restore();
          if (borderCol) {
            c.save();
            gRoundRect(c, bx, by, bw, bh, rad);
            c.strokeStyle = borderCol;
            c.lineWidth = 2.5;
            c.stroke();
            c.restore();
          }
        };
        const dx1 = (1 - gEase(ent)) * -24;
        const dx2 = (1 - gEase(ent)) * 28;
        drawCard(24 + dx1, 76, 336, 400, 22, 0, false, K.light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)');
        drawCard(196 + dx2, 248, 320, 316, 22, 1, true, K.light ? '#ffffff' : 'rgba(255,255,255,0.22)');
        return { x: 30, y: 598, w: W - 60, h: 252, onPhoto: false };
      }
      if (L === 'handheld') {
        // 손에 들고 찍은 듯한 흔들림 + 살짝 확대
        const sx = Math.sin(t * 1.7) * 5 + Math.sin(t * 4.3) * 2;
        const sy = Math.cos(t * 1.3) * 4 + Math.sin(t * 3.1) * 2;
        const rot = Math.sin(t * 0.9) * 0.006;
        c.save();
        c.translate(W / 2 + sx, H / 2 + sy);
        c.rotate(rot);
        c.scale(1.06, 1.06);
        c.translate(-W / 2, -H / 2);
        kitPhoto(c, { x: 0, y: 0, w: W, h: H }, S, spec);
        c.restore();
        scrim(H * 0.5, 0.7);
        return { x: 30, y: 640, w: W - 60, h: 210, onPhoto: true };
      }
      if (L === 'dim') {
        kitPhoto(c, { x: 0, y: 0, w: W, h: H }, S, spec, { filter: `${GENRE_FILTERS[spec.grade] || ''} brightness(0.42) saturate(0.85)`.trim() });
        const g = c.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 640);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.6)');
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        return { x: 30, y: 150, w: W - 60, h: 680, onPhoto: true };
      }
      fillBg();
      if (L === 'split') {
        const px = 20, py = 74, pw = W - 40, ph = 492, pr = 26;
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.34)';
        c.shadowBlur = 28;
        c.shadowOffsetY = 12;
        gRoundRect(c, px, py, pw, ph, pr);
        c.fillStyle = K.light ? '#ffffff' : '#18181b';
        c.fill();
        c.restore();
        c.save();
        gRoundRect(c, px, py, pw, ph, pr);
        c.clip();
        kitPhoto(c, { x: px, y: py, w: pw, h: ph }, S, spec);
        c.restore();
        c.save();
        gRoundRect(c, px, py, pw, ph, pr);
        c.strokeStyle = K.light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)';
        c.lineWidth = 1.5;
        c.stroke();
        c.restore();
        return { x: 30, y: 594, w: W - 60, h: 256, onPhoto: false };
      }
      if (L === 'diag') {
        kitPhoto(c, { x: 0, y: 0, w: W, h: 640, shape: 'diag' }, S, spec);
        c.strokeStyle = K.bgAccent ? K.hl : V.accent;
        c.lineWidth = 10;
        c.beginPath();
        c.moveTo(0, 640);
        c.lineTo(W * gEase(t / 0.8), 640 - 100 * gEase(t / 0.8));
        c.stroke();
        return { x: 30, y: 668, w: W - 60, h: 182, onPhoto: false };
      }
      if (L === 'polaroid') {
        // 점 무늬 바탕 + 겹쳐 놓인 폴라로이드
        c.fillStyle = K.light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
        for (let y = 20; y < 580; y += 26) for (let x = 14 + ((y / 26) % 2) * 13; x < W; x += 26) c.fillRect(x, y, 3, 3);
        const ent = S.idx === 0 ? Math.min(1, t / 0.6) : S.tp;
        const pol = (k, rot, dx, dy, sc, a) => {
          c.save();
          c.globalAlpha = a;
          c.translate(W / 2 + dx, 300 + dy);
          c.rotate(rot);
          c.scale(sc, sc);
          c.shadowColor = 'rgba(0,0,0,0.35)';
          c.shadowBlur = 24;
          c.shadowOffsetY = 10;
          c.fillStyle = '#fbfaf6';
          c.fillRect(-200, -240, 400, 476);
          c.shadowColor = 'transparent';
          kitPhoto(c, { x: -182, y: -222, w: 364, h: 364 }, S, spec, { offset: k, still: true });
          c.fillStyle = '#3b3b3b';
          c.textAlign = 'center';
          kLine(c, `No.${kPad(S.idx + k + 1)} · ${campaign.vehicle}`, 0, 196, 340, 30, 18, 'pen');
          c.restore();
        };
        if (S.n > 1 && S.idx > 0) pol(-1, ((S.idx - 1) % 2 ? 5 : -5) * (Math.PI / 180), -14, 8, 1, 1);
        const rot = (S.idx % 2 ? -3 : 3) * (Math.PI / 180);
        const tr = spec.trans;
        if (tr === 'slide') pol(0, rot, (1 - gEase(ent)) * 620, 0, 1, 1);
        else if (tr === 'zoom' || tr === 'flash') pol(0, rot, 0, 0, 1.6 - 0.6 * gEase(ent), gEase(ent / 0.6));
        else if (tr === 'fade') pol(0, rot, 0, 0, 1, gEase(ent));
        else pol(0, rot, 0, -(1 - gBack(ent)) * 760, 1, 1);
        return { x: 30, y: 600, w: W - 60, h: 250, onPhoto: false };
      }
      if (L === 'film') {
        c.fillStyle = '#0a0a0a';
        c.fillRect(90, 0, 360, 590);
        c.fillStyle = K.bg;
        for (let y = ((t * 40) % 30) - 30; y < 590; y += 30) {
          c.fillRect(100, y, 14, 18);
          c.fillRect(426, y, 14, 18);
        }
        c.save();
        c.beginPath();
        c.rect(90, 0, 360, 590);
        c.clip();
        const pos = S.idx - 1 + gEase(S.tp);
        for (let k = -2; k <= 2; k++) {
          const i = S.idx + k;
          const cy = 300 + (i - pos) * 236;
          if (cy < -150 || cy > 760) continue;
          kitPhoto(c, { x: 124, y: cy - 105, w: 292, h: 210 }, S, spec, { offset: k, still: true });
          c.fillStyle = 'rgba(255,190,90,0.85)';
          c.font = gFont(700, 11, GENRE_FONTS.mono);
          c.textAlign = 'left';
          c.fillText(`${kPad(i + 1)}A ▸`, 124, cy - 112);
        }
        c.restore();
        c.strokeStyle = K.bgAccent ? K.hl : V.accent;
        c.lineWidth = 4;
        c.strokeRect(122, 193, 296, 214);
        return { x: 30, y: 622, w: W - 60, h: 228, onPhoto: false };
      }
      if (L === 'circle') {
        c.save();
        c.translate(W / 2, 310);
        c.rotate(t * 0.4);
        c.setLineDash([16, 12]);
        c.strokeStyle = K.bgAccent ? K.hl : V.accent;
        c.lineWidth = 4;
        c.beginPath();
        c.arc(0, 0, 250, 0, Math.PI * 2);
        c.stroke();
        c.setLineDash([]);
        c.restore();
        kitPhoto(c, { x: W / 2 - 230, y: 80, w: 460, h: 460, shape: 'circle' }, S, spec);
        return { x: 30, y: 600, w: W - 60, h: 250, onPhoto: false };
      }
      if (L === 'mat') {
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.3)';
        c.shadowBlur = 30;
        c.shadowOffsetY = 12;
        c.fillStyle = K.light ? '#ffffff' : '#1b1b1f';
        c.fillRect(34, 44, 472, 532);
        c.restore();
        kitPhoto(c, { x: 54, y: 64, w: 432, h: 492 }, S, spec);
        c.strokeStyle = K.light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
        c.lineWidth = 1;
        c.strokeRect(54.5, 64.5, 431, 491);
        c.fillStyle = K.light ? '#6b6b6b' : '#9a9aa0';
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.textAlign = 'left';
        c.fillText(`No. ${kPad(S.idx + 1)} / ${kPad(Math.max(1, S.n))}`, 36, 600);
        c.textAlign = 'right';
        gDrawLine(c, campaign.vehicle, W - 36, 600, 300, 12, 10, GENRE_FONTS.mono, 500);
        return { x: 30, y: 630, w: W - 60, h: 220, onPhoto: false };
      }
      if (L === 'cards') {
        const tint = K.bgAccent ? K.hl : V.accent;
        [[-8, 0.35], [-4, 0.6]].forEach(([deg, a]) => {
          c.save();
          c.translate(W / 2, 310);
          c.rotate((deg * Math.PI) / 180);
          c.globalAlpha = a;
          gRoundRect(c, -220, -250, 440, 500, 28);
          c.fillStyle = tint;
          c.fill();
          c.restore();
        });
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 26;
        c.shadowOffsetY = 12;
        gRoundRect(c, 50, 60, 440, 500, 28);
        c.fillStyle = '#000';
        c.fill();
        c.restore();
        kitPhoto(c, { x: 50, y: 60, w: 440, h: 500, shape: 'round', rad: 28 }, S, spec);
        return { x: 30, y: 612, w: W - 60, h: 238, onPhoto: false };
      }
      if (L === 'grid') {
        const cells = [[20, 20], [275, 20], [20, 320], [275, 320]];
        const hl = S.idx % 4;
        cells.forEach(([x, y], j) => {
          kitPhoto(c, { x, y, w: 245, h: 290, shape: 'round', rad: 14 }, S, spec, { offset: j - hl, still: j !== hl });
          if (j !== hl) {
            gRoundRect(c, x, y, 245, 290, 14);
            c.fillStyle = K.light ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
            c.fill();
          }
        });
        const [hx, hy] = cells[hl];
        gRoundRect(c, hx - 3, hy - 3, 251, 296, 16);
        c.strokeStyle = K.bgAccent ? K.hl : V.accent;
        c.lineWidth = 6;
        c.stroke();
        return { x: 30, y: 644, w: W - 60, h: 206, onPhoto: false };
      }
      if (L === 'arch') {
        c.strokeStyle = K.bgAccent ? K.hl : V.accent;
        c.lineWidth = 2;
        kitShapePath(c, { x: 56, y: 46, w: 428, h: 568, shape: 'arch' });
        c.stroke();
        kitPhoto(c, { x: 70, y: 60, w: 400, h: 540, shape: 'arch' }, S, spec);
        return { x: 30, y: 638, w: W - 60, h: 212, onPhoto: false };
      }
      if (L === 'notebook') {
        c.strokeStyle = 'rgba(59,130,246,0.2)';
        c.lineWidth = 1;
        for (let y = 40; y < H; y += 34) {
          c.beginPath();
          c.moveTo(0, y + 0.5);
          c.lineTo(W, y + 0.5);
          c.stroke();
        }
        c.strokeStyle = 'rgba(239,68,68,0.4)';
        c.beginPath();
        c.moveTo(56.5, 0);
        c.lineTo(56.5, H);
        c.stroke();
        c.save();
        c.translate(W / 2, 270);
        c.rotate(-0.025 + (S.idx % 2) * 0.045);
        c.shadowColor = 'rgba(0,0,0,0.22)';
        c.shadowBlur = 16;
        c.shadowOffsetY = 6;
        c.fillStyle = '#ffffff';
        c.fillRect(-210, -200, 420, 400);
        c.shadowColor = 'transparent';
        kitPhoto(c, { x: -196, y: -186, w: 392, h: 372 }, S, spec);
        c.fillStyle = 'rgba(253,230,138,0.75)';
        [[-200, -192, -0.6], [200, -192, 0.6]].forEach(([x, y, r]) => {
          c.save();
          c.translate(x, y);
          c.rotate(r);
          c.fillRect(-46, -13, 92, 26);
          c.restore();
        });
        c.restore();
        return { x: 40, y: 520, w: W - 80, h: 330, onPhoto: false };
      }
      if (L === 'chalkboard') {
        c.fillStyle = '#6b4423';
        c.fillRect(0, 0, W, H);
        c.fillStyle = '#1f3b2d';
        c.fillRect(14, 14, W - 28, H - 28);
        [[140, 700], [420, 300], [300, 860]].forEach(([x, y]) => {
          const g = c.createRadialGradient(x, y, 0, x, y, 180);
          g.addColorStop(0, 'rgba(255,255,255,0.05)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = g;
          c.fillRect(14, 14, W - 28, H - 28);
        });
        c.save();
        c.translate(W / 2, 250);
        c.rotate(0.02 - (S.idx % 2) * 0.04);
        c.shadowColor = 'rgba(0,0,0,0.4)';
        c.shadowBlur = 18;
        c.fillStyle = '#ffffff';
        c.fillRect(-200, -180, 400, 360);
        c.shadowColor = 'transparent';
        kitPhoto(c, { x: -188, y: -168, w: 376, h: 336 }, S, spec);
        c.fillStyle = '#dc2626';
        c.beginPath();
        c.arc(0, -172, 10, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.beginPath();
        c.arc(-3, -175, 3, 0, Math.PI * 2);
        c.fill();
        c.restore();
        return { x: 40, y: 480, w: W - 80, h: 370, onPhoto: false };
      }
      if (L === 'poster') {
        c.strokeStyle = K.light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(30, 96.5);
        c.lineTo(W - 30, 96.5);
        c.moveTo(30, 590.5);
        c.lineTo(W - 30, 590.5);
        c.stroke();
        kitPhoto(c, { x: 30, y: 606, w: W - 60, h: 244, shape: 'round', rad: 18 }, S, spec);
        return { x: 30, y: 124, w: W - 60, h: 450, onPhoto: false };
      }
      kitPhoto(c, { x: 0, y: 0, w: W, h: H }, S, spec);
      return { x: 30, y: 590, w: W - 60, h: 260, onPhoto: true };
    }

    // ---------- 가격 강조 ----------
    const KIT_STAR_CAPS = ['band', 'bubble', 'sticky', 'words', 'pill', 'stamp', 'outline', 'write', 'scribble', 'doodle', 'brush', 'stack', 'scroll', 'slam', 'knockout', 'marquee', 'longshadow', 'vsub', 'chapter', 'loctag', 'checkl', 'timestamp'];
    function kitPrice(c, W, zone, spec, V, K, e) {
      const txt = arPriceTag();
      if (spec.cat === '손글씨') return 0; // 고급 손글씨 디자인은 가격 스티커 없이 문구로만
      // 자막 자리가 좁은 배치에서는 자막을 밀어내지 않도록 별 스티커로
      if (KIT_STAR_CAPS.includes(spec.cap) || zone.h < 250) {
        // 오른쪽 위 별 모양 스티커 (자막을 밀어내지 않음)
        const s = gBack(e / 0.45);
        c.save();
        c.translate(spec.cap === 'vertical' ? 98 : W - 98, Math.max(110, zone.y - 92));
        c.rotate(0.18 + Math.sin(e * 6) * 0.02);
        c.scale(s, s);
        c.beginPath();
        for (let i = 0; i < 28; i++) {
          const rr = i % 2 ? 66 : 80;
          const a = (i / 28) * Math.PI * 2;
          c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        c.closePath();
        c.fillStyle = K.bgAccent ? K.hl : V.accent;
        c.fill();
        c.fillStyle = kTextOn(K.bgAccent ? K.hl : V.accent);
        c.textAlign = 'center';
        c.font = gFont(800, 14, GENRE_FONTS.sans);
        c.fillText('최대', 0, -18);
        kLine(c, txt, 0, 18, 128, 32, 18, spec.font === 'pen' ? 'impact' : spec.font);
        c.restore();
        return 0;
      }
      c.save();
      c.globalAlpha = gEase(e / 0.4);
      c.textAlign = zone.center ? 'center' : 'left';
      const x = zone.center ? W / 2 : zone.x;
      if (['glass', 'typer', 'ticket', 'lower3', 'headline'].includes(spec.cap)) {
        c.font = kFont(spec.font, 34);
        const w = c.measureText(txt).width + 30;
        const bx = zone.center ? W / 2 - w / 2 : zone.x;
        gRoundRect(c, bx, zone.y, w, 52, spec.cap === 'glass' ? 26 : 4);
        c.fillStyle = K.bgAccent ? K.hl : V.accent;
        c.fill();
        c.fillStyle = kTextOn(K.bgAccent ? K.hl : V.accent);
        c.textBaseline = 'middle';
        c.fillText(txt, zone.center ? W / 2 : bx + 15, zone.y + 28);
        c.textBaseline = 'alphabetic';
      } else {
        c.fillStyle = K.bgAccent ? K.hl : V.accent;
        if (zone.onPhoto) {
          c.shadowColor = 'rgba(0,0,0,0.6)';
          c.shadowBlur = 12;
        }
        kLine(c, txt, x, zone.y + 48, zone.w, 56, 30, spec.font);
      }
      c.restore();
      return 66;
    }

    // ---------- 자막 16가지 ----------
    function kitCaption(c, W, H, t, zone, text, spec, V, K, e, cutIdx, S, fr) {
      const fk = spec.font;
      const top = zone.center ? zone.y + zone.h / 2 - 60 : zone.y;
      const ink = zone.onPhoto ? '#ffffff' : K.ink;
      const hl = K.hl;
      const hlText = kTextOn(hl);
      c.save();
      c.textBaseline = 'alphabetic';
      const cap = spec.cap;
      const shadowOn = () => {
        if (zone.onPhoto) {
          c.shadowColor = 'rgba(0,0,0,0.65)';
          c.shadowBlur = 14;
        }
      };

      if (cap === 'band') {
        const r = kWrap(c, text, W - 110, 2, 46, 26, fk);
        r.lines.forEach((ln, i) => {
          const ei = gEase((e - i * 0.15) / 0.45);
          c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
          const w = c.measureText(ln).width + 40;
          const bh = r.lh + 14;
          const x = zone.x - (1 - ei) * (w + 80);
          const y = top + i * (bh + 8);
          c.save();
          c.translate(x, y);
          c.transform(1, 0, -0.14, 1, 0, 0);
          c.fillStyle = hl;
          c.fillRect(0, 0, w, bh);
          c.restore();
          c.fillStyle = hlText;
          c.textBaseline = 'middle';
          c.fillText(ln, x + 14, y + bh / 2 + 2);
          c.textBaseline = 'alphabetic';
        });
      } else if (cap === 'glass') {
        const r = kWrap(c, text, W - 130, 3, 36, 22, fk);
        const bh = 66 + r.lines.length * r.lh;
        const y0 = top + (1 - gEase(e / 0.55)) * 36;
        c.globalAlpha = gEase(e / 0.45);
        gRoundRect(c, zone.x, y0, zone.w, bh, 24);
        c.fillStyle = K.light && !zone.onPhoto ? 'rgba(255,255,255,0.86)' : 'rgba(14,14,20,0.6)';
        c.fill();
        c.strokeStyle = K.light && !zone.onPhoto ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.26)';
        c.lineWidth = 1.2;
        c.stroke();
        c.fillStyle = hl;
        c.beginPath();
        c.arc(zone.x + 30, y0 + 30, 5, 0, Math.PI * 2);
        c.fill();
        c.font = gFont(800, 14, GENRE_FONTS.sans);
        c.textAlign = 'left';
        c.fillText(K.label, zone.x + 44, y0 + 35);
        c.fillStyle = K.light && !zone.onPhoto ? '#111111' : '#ffffff';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x + 26, y0 + 58 + r.lh * (i + 0.78)));
      } else if (cap === 'typer') {
        const r = kWrap(c, text, W - 130, 3, 32, 20, fk);
        const bh = 60 + r.lines.length * r.lh;
        gRoundRect(c, zone.x, top, zone.w, bh, 10);
        c.fillStyle = 'rgba(6,8,10,0.86)';
        c.fill();
        ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
          c.fillStyle = col;
          c.beginPath();
          c.arc(zone.x + 22 + i * 18, top + 20, 5, 0, Math.PI * 2);
          c.fill();
        });
        c.fillStyle = '#8b8b92';
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.textAlign = 'left';
        c.fillText(`~/견적/cut_${kPad(cutIdx + 1)}.sh`, zone.x + 82, top + 24);
        const total = r.lines.join('').length;
        let shown = Math.floor(total * Math.min(1, e / 0.75));
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        let cx = zone.x + 24;
        let cy = top + 46 + r.lh * 0.8;
        r.lines.forEach((ln, i) => {
          if (shown <= 0) return;
          const part = ln.slice(0, shown);
          shown -= ln.length;
          c.fillStyle = i === 0 ? hl : '#e5e7eb';
          const y = top + 46 + r.lh * (i + 0.8);
          c.fillText(part, zone.x + 24, y);
          cx = zone.x + 24 + c.measureText(part).width;
          cy = y;
        });
        if (Math.floor(t * 2.4) % 2 === 0) {
          c.fillStyle = hl;
          c.fillRect(cx + 4, cy - r.size * 0.8, r.size * 0.5, r.size * 0.95);
        }
      } else if (cap === 'outline') {
        const r = kWrap(c, text, W - 60, 2, 74, 40, fk);
        c.textAlign = 'left';
        r.lines.forEach((ln, i) => {
          const y = top + r.lh * (i + 0.85);
          kLongShadow(c, ln, zone.x, y, ink, K.light ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.58)', 13, 0.85, 1);
          const p = gEase((e - i * 0.18) / 0.6);
          c.save();
          c.beginPath();
          c.rect(zone.x - 10, y - r.size * 1.1, (zone.w + 20) * p, r.size * 1.4);
          c.clip();
          c.fillStyle = hl;
          c.fillText(ln, zone.x, y);
          c.restore();
        });
      } else if (cap === 'marker') {
        const r = kWrap(c, text, W - 100, 3, 42, 24, fk);
        c.textAlign = 'left';
        r.lines.forEach((ln, i) => {
          const ei = gEase((e - i * 0.2) / 0.5);
          const y = top + r.lh * (i + 0.9) + i * 6;
          const w = c.measureText(ln).width;
          c.save();
          c.translate(zone.x, y);
          c.rotate(-0.012);
          c.fillStyle = hl;
          c.globalAlpha = 0.95;
          c.fillRect(-10, -r.size * 0.82, (w + 20) * ei, r.size * 1.06);
          c.restore();
          c.globalAlpha = Math.min(1, ei * 2);
          c.fillStyle = hlText;
          c.fillText(ln, zone.x, y);
          c.globalAlpha = 1;
        });
      } else if (cap === 'bubble') {
        const r = kWrap(c, text, W - 150, 3, 36, 22, fk);
        let mw = 0;
        r.lines.forEach((ln) => (mw = Math.max(mw, c.measureText(ln).width)));
        const bw = mw + 56;
        const bh = r.lines.length * r.lh + 40;
        const s = gBack(e / 0.45);
        const fill = K.light && !zone.onPhoto ? '#111111' : '#ffffff';
        c.save();
        c.translate(zone.x, top + bh + 22);
        c.scale(s, s);
        gRoundRect(c, 0, -bh - 22, bw, bh, 28);
        c.fillStyle = fill;
        c.fill();
        c.beginPath();
        c.moveTo(34, -24);
        c.lineTo(20, 4);
        c.lineTo(64, -24);
        c.closePath();
        c.fill();
        c.fillStyle = kTextOn(fill);
        c.textAlign = 'left';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, 28, -bh - 22 + 20 + r.lh * (i + 0.82)));
        c.restore();
      } else if (cap === 'sticky') {
        const r = kWrap(c, text, 330, 3, 40, 26, fk);
        const nh = r.lines.length * r.lh + 70;
        const drop = (1 - gBack(e / 0.5)) * -220;
        c.save();
        c.translate(W / 2, top + nh / 2 + drop);
        c.rotate(-0.045);
        c.shadowColor = 'rgba(0,0,0,0.28)';
        c.shadowBlur = 18;
        c.shadowOffsetY = 8;
        c.fillStyle = gMix(K.bgAccent ? '#fde68a' : V.accent, 0.62);
        c.fillRect(-195, -nh / 2, 390, nh);
        c.shadowColor = 'transparent';
        c.fillStyle = 'rgba(255,255,255,0.55)';
        c.save();
        c.rotate(0.06);
        c.fillRect(-60, -nh / 2 - 14, 120, 28);
        c.restore();
        c.fillStyle = '#1f2937';
        c.textAlign = 'left';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, -170, -nh / 2 + 36 + r.lh * (i + 0.75)));
        c.restore();
      } else if (cap === 'cinema') {
        const r = kWrap(c, text, W - 80, 2, 34, 22, fk);
        c.globalAlpha = gEase(e / 0.4);
        c.textAlign = 'center';
        c.fillStyle = hl;
        c.fillRect(W / 2 - 18, top + 4, 36, 3);
        r.lines.forEach((ln, i) => {
          const y = top + 34 + r.lh * (i + 0.8);
          if (zone.onPhoto || !K.light) {
            kSoftDepthText(c, ln, W / 2, y, '#ffffff', 'rgba(0,0,0,0.75)', 18, 4);
          } else {
            c.fillStyle = K.ink;
            c.fillText(ln, W / 2, y);
          }
        });
      } else if (cap === 'neon') {
        const r = kWrap(c, text, W - 80, 2, 54, 30, fk);
        const on = e > 0.12 && !(e > 0.22 && e < 0.3) && !(e > 0.36 && e < 0.4);
        c.globalAlpha = on ? 1 : 0.22;
        c.textAlign = 'center';
        r.lines.forEach((ln, i) => {
          const y = top + r.lh * (i + 0.9);
          c.save();
          c.shadowColor = hl;
          c.shadowBlur = 32;
          c.fillStyle = hl;
          c.globalAlpha = (on ? 1 : 0.22) * 0.72;
          c.fillText(ln, W / 2, y);
          c.restore();
          c.shadowColor = hl;
          c.shadowBlur = 14;
          c.fillStyle = '#ffffff';
          c.fillText(ln, W / 2, y);
        });
      } else if (cap === 'stamp') {
        const r = kWrap(c, text, W - 190, 2, 40, 24, fk);
        let mw = 0;
        r.lines.forEach((ln) => (mw = Math.max(mw, c.measureText(ln).width)));
        const bw = Math.max(240, mw + 70);
        const bh = r.lines.length * r.lh + 64;
        const s = 1 + 1.4 * (1 - gEase(e / 0.32));
        c.save();
        c.globalAlpha = gEase(e / 0.22);
        c.translate(W / 2, top + bh / 2 + 6);
        c.rotate(-0.1);
        c.scale(s, s);
        if (zone.onPhoto || !K.light) {
          c.fillStyle = 'rgba(255,255,255,0.9)';
          c.fillRect(-bw / 2, -bh / 2, bw, bh);
        }
        const sc = zone.onPhoto || !K.light ? gReadableAccent(hl, true) : hl;
        c.strokeStyle = sc;
        c.lineWidth = 6;
        c.strokeRect(-bw / 2 + 6, -bh / 2 + 6, bw - 12, bh - 12);
        c.lineWidth = 2;
        c.strokeRect(-bw / 2 + 14, -bh / 2 + 14, bw - 28, bh - 28);
        c.fillStyle = sc;
        c.textAlign = 'center';
        c.font = gFont(800, 12, GENRE_FONTS.sans);
        c.fillText(`★ ${K.label} ★`, 0, -bh / 2 + 32);
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, 0, -bh / 2 + 40 + r.lh * (i + 0.85)));
        c.restore();
      } else if (cap === 'words') {
        const r = kWrap(c, text, W - 80, 3, 52, 28, fk);
        c.textAlign = 'left';
        let wi = 0;
        r.lines.forEach((ln, li) => {
          const words = ln.split(' ');
          const sp = c.measureText(' ').width;
          const widths = words.map((w) => c.measureText(w).width);
          const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
          let x = W / 2 - total / 2;
          const y = top + r.lh * (li + 0.9);
          words.forEach((w, k) => {
            const ei = gBack((e - wi * 0.08) / 0.28);
            if (ei > 0.01) {
              c.save();
              c.translate(x + widths[k] / 2, y - r.size * 0.35);
              c.scale(ei, ei);
              c.fillStyle = wi % 3 === 1 ? hl : ink;
              shadowOn();
              c.fillText(w, -widths[k] / 2, r.size * 0.35);
              c.restore();
            }
            x += widths[k] + sp;
            wi += 1;
          });
        });
      } else if (cap === 'vertical') {
        const chars = Array.from(text.replace(/\s+/g, ' ').trim());
        const per = 12;
        const cols = Math.min(2, Math.ceil(chars.length / per));
        const size = 36;
        const shown = Math.floor(chars.length * Math.min(1, e / 0.7));
        const x0 = W - 58;
        c.fillStyle = 'rgba(0,0,0,0.52)';
        c.fillRect(x0 - 26 - (cols - 1) * 54, 92, cols * 54 + 4, per * 42 + 30);
        c.fillStyle = hl;
        c.fillRect(x0 + 34, 100, 3, (per * 42 + 14) * gEase(e / 0.5));
        c.textAlign = 'center';
        c.font = kFont(fk, size);
        for (let i = 0; i < Math.min(shown, per * cols); i++) {
          const col = Math.floor(i / per);
          const row = i % per;
          c.fillStyle = '#ffffff';
          c.fillText(chars[i], x0 - col * 54, 136 + row * 42);
        }
      } else if (cap === 'ticket') {
        const r = kWrap(c, text, W - 140, 3, 32, 20, fk);
        const h = 76 + r.lines.length * r.lh;
        const y0 = top + (1 - gEase(e / 0.5)) * 90;
        c.globalAlpha = gEase(e / 0.35);
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.25)';
        c.shadowBlur = 14;
        c.beginPath();
        c.moveTo(zone.x + 10, y0);
        c.lineTo(zone.x + zone.w - 10, y0);
        c.lineTo(zone.x + zone.w - 10, y0 + h);
        for (let x = zone.x + zone.w - 10; x > zone.x + 10; x -= 16) {
          c.lineTo(x - 8, y0 + h + 8);
          c.lineTo(x - 16, y0 + h);
        }
        c.closePath();
        c.fillStyle = '#fffdf7';
        c.fill();
        c.restore();
        c.fillStyle = '#7a7a7a';
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.textAlign = 'left';
        c.fillText(`NO.${kPad(cutIdx + 1)} ── ${K.label}`, zone.x + 32, y0 + 28);
        c.strokeStyle = '#bdbdbd';
        c.setLineDash([5, 4]);
        c.beginPath();
        c.moveTo(zone.x + 30, y0 + 42);
        c.lineTo(zone.x + zone.w - 30, y0 + 42);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = '#111111';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x + 32, y0 + 52 + r.lh * (i + 0.8)));
      } else if (cap === 'pill') {
        const r = kWrap(c, text, W - 130, 3, 36, 22, fk);
        r.lines.forEach((ln, i) => {
          const ei = gBack((e - i * 0.14) / 0.4);
          if (ei <= 0.01) return;
          const w = c.measureText(ln).width + 44;
          const bh = r.lh + 18;
          const y = top + i * (bh + 10);
          const fill = i % 2 ? (K.light && !zone.onPhoto ? '#111111' : '#ffffff') : hl;
          c.save();
          c.translate(zone.x + w / 2, y + bh / 2);
          c.scale(ei, ei);
          gRoundRect(c, -w / 2, -bh / 2, w, bh, bh / 2);
          c.fillStyle = fill;
          c.fill();
          c.fillStyle = kTextOn(fill);
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(ln, 0, 2);
          c.restore();
        });
      } else if (cap === 'headline') {
        const r = kWrap(c, text, W - 70, 2, 44, 26, fk);
        const h = 70 + r.lines.length * r.lh;
        const reveal = gEase(e / 0.5);
        c.save();
        c.beginPath();
        c.rect(0, top - 6, W, h * reveal);
        c.clip();
        c.fillStyle = '#f5f1e8';
        c.fillRect(0, top - 6, W, h);
        c.fillStyle = '#111111';
        c.fillRect(24, top + 8, W - 48, 3);
        c.fillRect(24, top + 14, W - 48, 1);
        c.fillStyle = gReadableAccent(hl, true);
        c.fillRect(24, top + 24, 54, 22);
        c.fillStyle = '#ffffff';
        c.font = gFont(800, 13, GENRE_FONTS.sans);
        c.textAlign = 'center';
        c.fillText('속보', 51, top + 40);
        c.fillStyle = '#555555';
        c.textAlign = 'left';
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.fillText(`${K.label} · ${kPad(cutIdx + 1)}면`, 88, top + 40);
        c.fillStyle = '#111111';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        r.lines.forEach((ln, i) => c.fillText(ln, 24, top + 56 + r.lh * (i + 0.82)));
        c.restore();
      } else if (cap === 'write' || cap === 'scribble' || cap === 'doodle') {
        // 손글씨가 왼쪽부터 써지는 연출
        const r = kWrap(c, text, zone.w - 20, 3, 46, 28, fk);
        const handInk = zone.onPhoto || !K.light ? '#ffffff' : '#1f2a44';
        const prog = Math.min(1, e / 0.8) * r.lines.length;
        c.textAlign = 'left';
        const boxes = [];
        r.lines.forEach((ln, i) => {
          const y = top + r.lh * (i + 0.9) + i * 4;
          const w = c.measureText(ln).width;
          const x = cap === 'write' ? zone.x : W / 2 - w / 2;
          boxes.push({ x, y, w });
          const lp = Math.min(1, Math.max(0, prog - i));
          if (lp <= 0) return;
          c.save();
          c.beginPath();
          c.rect(x - 6, y - r.size * 1.2, w * lp + 6, r.size * 1.6);
          c.clip();
          c.fillStyle = handInk;
          shadowOn();
          c.fillText(ln, x, y);
          c.restore();
          if (lp < 1) {
            c.save();
            c.translate(x + w * lp, y - r.size * 0.25);
            c.rotate(-0.7);
            c.fillStyle = hl;
            c.fillRect(-3, -34, 6, 30);
            c.beginPath();
            c.moveTo(-3, -4);
            c.lineTo(3, -4);
            c.lineTo(0, 4);
            c.closePath();
            c.fill();
            c.restore();
          }
        });
        const drawIn = (pts, p) => {
          const n = Math.max(2, Math.floor(pts.length * Math.min(1, Math.max(0, p))));
          if (p <= 0) return;
          c.beginPath();
          pts.slice(0, n).forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y)));
          c.stroke();
        };
        c.strokeStyle = hl;
        c.lineWidth = 4;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        if (cap === 'scribble' && boxes.length) {
          const b0 = boxes[0];
          const cx = b0.x + b0.w / 2;
          const cy = b0.y - r.size * 0.32;
          const pts = [];
          for (let a = 0; a <= Math.PI * 2.15; a += 0.08) {
            const k = 1 + 0.04 * Math.sin(a * 3);
            pts.push([cx + Math.cos(a - 2.4) * (b0.w / 2 + 22) * k, cy + Math.sin(a - 2.4) * r.size * 0.82 * k]);
          }
          drawIn(pts, (e - 0.55) / 0.35);
          const bl = boxes[boxes.length - 1];
          if (boxes.length > 1) {
            const wav = [];
            for (let x = bl.x; x <= bl.x + bl.w; x += 6) wav.push([x, bl.y + 12 + Math.sin(x / 8) * 4]);
            drawIn(wav, (e - 0.75) / 0.25);
          }
        }
        if (cap === 'doodle' && boxes.length) {
          const b0 = boxes[0];
          const sx = b0.x - 34;
          const sy = b0.y - r.size * 0.4;
          const star = [];
          for (let i = 0; i <= 10; i++) {
            const a = -Math.PI / 2 + (i * Math.PI * 4) / 5;
            star.push([sx + Math.cos(a) * 16, sy + Math.sin(a) * 16]);
          }
          drawIn(star, (e - 0.5) / 0.25);
          const bl = boxes[boxes.length - 1];
          const ax = bl.x + bl.w + 18;
          const ay = bl.y - r.size * 0.3;
          const arrow = [];
          for (let k = 0; k <= 20; k++) {
            const p = k / 20;
            arrow.push([ax + 60 - p * 56 + Math.sin(p * 3) * 8, ay + 50 - p * 50]);
          }
          drawIn(arrow, (e - 0.65) / 0.25);
          if (e > 0.88) {
            c.beginPath();
            c.moveTo(ax + 2, ay + 18);
            c.lineTo(ax + 4, ay);
            c.lineTo(ax + 20, ay + 6);
            c.stroke();
          }
          [[W - 70, top - 4], [zone.x + 10, top + r.lh * r.lines.length + 26]].forEach(([x, y], i) => {
            if (e < 0.7 + i * 0.1) return;
            for (let k = 0; k < 3; k++) {
              const a = -1.2 + k * 0.5;
              c.beginPath();
              c.moveTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8);
              c.lineTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20);
              c.stroke();
            }
          });
        }
      } else if (cap === 'letter') {
        const r = kWrap(c, text, zone.w - 90, 3, 40, 26, fk);
        const gap = Math.max(r.lh, 46);
        const h = 76 + r.lines.length * gap;
        const y0 = top + (1 - gEase(e / 0.5)) * 70;
        c.save();
        c.globalAlpha = gEase(e / 0.4);
        c.translate(W / 2, y0 + h / 2);
        c.rotate(0.014);
        c.translate(-W / 2, -(y0 + h / 2));
        c.shadowColor = 'rgba(0,0,0,0.25)';
        c.shadowBlur = 18;
        c.shadowOffsetY = 6;
        c.fillStyle = '#fffdf5';
        c.fillRect(zone.x, y0, zone.w, h);
        c.shadowColor = 'transparent';
        c.strokeStyle = 'rgba(59,130,246,0.28)';
        c.lineWidth = 1;
        for (let k = 0; k < r.lines.length; k++) {
          const ly = y0 + 58 + gap * (k + 1);
          c.beginPath();
          c.moveTo(zone.x + 18, ly);
          c.lineTo(zone.x + zone.w - 18, ly);
          c.stroke();
        }
        c.strokeStyle = 'rgba(239,68,68,0.5)';
        c.beginPath();
        c.moveTo(zone.x + 48, y0 + 10);
        c.lineTo(zone.x + 48, y0 + h - 10);
        c.stroke();
        c.fillStyle = gReadableAccent(hl, true);
        c.textAlign = 'left';
        kLine(c, K.label, zone.x + 62, y0 + 44, zone.w - 90, 26, 16, fk);
        c.fillStyle = '#1e3a8a';
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        const prog = Math.min(1, e / 0.85) * r.lines.length;
        r.lines.forEach((ln, i) => {
          const lp = Math.min(1, Math.max(0, prog - i));
          if (lp <= 0) return;
          const ly = y0 + 52 + gap * (i + 1);
          c.save();
          c.beginPath();
          c.rect(zone.x + 56, ly - gap, (zone.w - 60) * lp, gap + 8);
          c.clip();
          c.fillText(ln, zone.x + 62, ly);
          c.restore();
        });
        c.restore();
      } else if (cap === 'chalk') {
        const r = kWrap(c, text, zone.w - 60, 3, 44, 26, fk);
        const h = 56 + r.lines.length * r.lh;
        if (spec.layout !== 'chalkboard') {
          gRoundRect(c, zone.x, top, zone.w, h, 8);
          c.fillStyle = '#7c4a21';
          c.fill();
          gRoundRect(c, zone.x + 9, top + 9, zone.w - 18, h - 18, 4);
          c.fillStyle = '#1f3b2d';
          c.fill();
        }
        c.textAlign = 'left';
        const prog = Math.min(1, e / 0.8) * r.lines.length;
        r.lines.forEach((ln, i) => {
          const lp = Math.min(1, Math.max(0, prog - i));
          if (lp <= 0) return;
          const y = top + 28 + r.lh * (i + 0.85);
          const w = c.measureText(ln).width;
          c.save();
          c.beginPath();
          c.rect(zone.x + 24, y - r.size * 1.2, w * lp + 8, r.size * 1.6);
          c.clip();
          c.fillStyle = 'rgba(255,255,255,0.5)';
          c.fillText(ln, zone.x + 31, y + 1);
          c.fillStyle = i === 0 ? '#fffbe6' : 'rgba(255,255,255,0.92)';
          c.fillText(ln, zone.x + 30, y);
          c.restore();
        });
        if (e > 0.75) {
          c.strokeStyle = spec.layout === 'chalkboard' ? hl : '#fde047';
          c.lineWidth = 3;
          c.beginPath();
          const ly = top + 40 + r.lh * r.lines.length;
          for (let x = zone.x + 30; x < zone.x + 30 + 160 * gEase((e - 0.75) / 0.25); x += 6) c.lineTo(x, ly + Math.sin(x / 6) * 3);
          c.stroke();
        }
      } else if (cap === 'brush') {
        const r = kWrap(c, text, zone.w - 80, 3, Math.min(74, Math.floor((zone.h - 20) / 3.9 / (KIT_FONTS[fk] || KIT_FONTS.sans).k)), 26, fk);
        const brushInk = zone.onPhoto || !K.light ? '#ffffff' : '#111111';
        c.textAlign = 'left';
        let lastEnd = zone.x;
        let lastY = top;
        r.lines.forEach((ln, i) => {
          const y = top + r.lh * (i + 0.9);
          const w = c.measureText(ln).width;
          const lp = gEase((e - i * 0.25) / 0.45);
          if (lp <= 0) return;
          c.save();
          c.beginPath();
          c.rect(zone.x - 10, y - r.size * 1.3, (w + 20) * lp, r.size * 1.8);
          c.clip();
          c.fillStyle = brushInk;
          shadowOn();
          c.fillText(ln, zone.x, y);
          c.restore();
          lastEnd = zone.x + w;
          lastY = y;
        });
        c.fillStyle = brushInk;
        for (let i = 0; i < 7; i++) {
          const hsh = gHash('ink' + i + cutIdx);
          if (e < 0.3 + i * 0.05) continue;
          c.globalAlpha = 0.5;
          c.beginPath();
          c.arc(zone.x + (hsh % zone.w), top + ((hsh >> 7) % Math.max(40, r.lh * r.lines.length)), 1.5 + (hsh % 5), 0, Math.PI * 2);
          c.fill();
        }
        c.globalAlpha = 1;
        if (e > 0.7) {
          const s = gBack((e - 0.7) / 0.2);
          c.save();
          c.translate(Math.min(W - 50, lastEnd + 38), lastY - r.size * 0.35);
          c.rotate(0.06);
          c.scale(s, s);
          c.fillStyle = '#c81e1e';
          c.fillRect(-26, -26, 52, 52);
          c.fillStyle = '#ffffff';
          c.textAlign = 'center';
          c.font = gFont(900, 18, GENRE_FONTS.serif);
          const sealTxt = Array.from(K.label).slice(0, 2);
          c.fillText(sealTxt[0] || '印', 0, sealTxt.length > 1 ? -2 : 7);
          if (sealTxt[1]) c.fillText(sealTxt[1], 0, 18);
          c.restore();
        }
      } else if (cap === 'stack') {
        // 단어마다 한 줄씩, 줄 너비를 꽉 채우는 거대한 글씨
        let words = text.split(' ').filter(Boolean);
        while (words.length > 5) {
          let best = 0;
          for (let i = 1; i < words.length - 1; i++) if (words[i].length + words[i + 1].length < words[best].length + words[best + 1].length) best = i;
          words.splice(best, 2, words[best] + ' ' + words[best + 1]);
        }
        const F = KIT_FONTS[fk] || KIT_FONTS.sans;
        const fits = words.map((w) => gFitLine(c, w, zone.w, Math.round(150 * F.k), Math.round(28 * F.k), F.f, F.w));
        // 줄마다 글자 크기가 달라도 위아래 줄이 겹치지 않게: 윗줄 아래 여백 + 이 줄 높이로 내려감
        let total = fits.reduce((a, f) => a + f.size * 1.04 + 4, 0);
        const scale = Math.min(1, (zone.h - 20) / total);
        let y = top;
        let prevSize = 0;
        c.textAlign = 'left';
        fits.forEach((f, i) => {
          const size = Math.floor(f.size * scale);
          c.font = gFont(F.w, size, F.f);
          y += prevSize * 0.18 + size * 0.86 + (i ? 4 : 0);
          prevSize = size;
          const ei = gEase((e - i * 0.09) / 0.35);
          const dx = (1 - ei) * (i % 2 ? 1 : -1) * W;
          if (i % 3 === 2) {
            kLongShadow(c, f.text, zone.x + dx, y, ink, K.light ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.58)', 11, 0.85, 1);
          } else {
            c.fillStyle = i % 3 === 1 ? hl : ink;
            c.fillText(f.text, zone.x + dx, y);
          }
        });
      } else if (cap === 'scroll') {
        const F = KIT_FONTS[fk] || KIT_FONTS.sans;
        const size = Math.round(62 * F.k);
        const rowH = Math.round(size * 1.12);
        const zh = Math.min(zone.h, 480);
        c.save();
        c.beginPath();
        c.rect(0, top, W, zh);
        c.clip();
        c.font = gFont(F.w, size, F.f);
        c.textAlign = 'left';
        const off = (t * 70) % rowH;
        const mid = top + zh / 2;
        for (let k = -1; k * rowH < zh + rowH; k++) {
          const y = top + k * rowH - off + rowH;
          const center = Math.abs(y - size * 0.35 - mid) < rowH / 2;
          const xs = (k % 2) * -80 - ((t * 30) % 200);
          const line = `${text}   ·   ${text}`;
          if (center) {
            c.fillStyle = hl;
            c.fillText(line, xs, y);
          } else {
            c.fillStyle = ink;
            c.globalAlpha = 0.16;
            c.fillText(line, xs, y);
            c.globalAlpha = 1;
          }
        }
        c.restore();
        c.globalAlpha = gEase(e / 0.4);
        c.fillStyle = ink;
        c.textAlign = 'center';
        gDrawLine(c, text, W / 2, top + zh + 34, zone.w, 18, 12, GENRE_FONTS.sans, 700);
      } else if (cap === 'slam') {
        const words = text.split(' ').filter(Boolean);
        const n = Math.max(1, words.length);
        const pos = Math.min(n - 0.001, (fr || 0) * n * 1.08);
        const idx = Math.floor(pos);
        const lp = pos - idx;
        const F = KIT_FONTS[fk] || KIT_FONTS.sans;
        const f = gFitLine(c, words[idx] || '', zone.w, Math.round(170 * F.k), Math.round(40 * F.k), F.f, F.w);
        const s = 1 + 0.6 * (1 - gEase(lp * 5));
        c.save();
        c.translate(W / 2, top + Math.min(zone.h, 420) / 2);
        c.scale(s, s);
        c.font = gFont(F.w, f.size, F.f);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillStyle = idx % 2 ? hl : ink;
        shadowOn();
        c.fillText(f.text, 0, 0);
        c.restore();
        for (let i = 0; i < n; i++) {
          c.fillStyle = i <= idx ? hl : zone.onPhoto || !K.light ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)';
          c.fillRect(W / 2 - n * 11 + i * 22, top + Math.min(zone.h, 420) - 10, 16, 4);
        }
        c.fillStyle = ink;
        c.globalAlpha = 0.75;
        c.textAlign = 'center';
        gDrawLine(c, text, W / 2, top + Math.min(zone.h, 420) + 26, zone.w, 17, 12, GENRE_FONTS.sans, 600);
        c.globalAlpha = 1;
      } else if (cap === 'knockout') {
        // 글자 안에 사진이 비치는 타이포
        const kk = (KIT_FONTS[fk] || KIT_FONTS.sans).k;
        const r = kWrap(c, text, zone.w - 20, 3, Math.min(96, Math.floor((zone.h - 50) / 3.2 / kk)), 30, fk);
        const h = Math.round(r.lines.length * r.size * 1.06 + 44);
        const reveal = gEase(e / 0.5);
        const block = K.bgAccent ? K.bg : zone.onPhoto ? hl : K.light ? '#111111' : hl;
        if (!window.__kitKnock) window.__kitKnock = document.createElement('canvas');
        const off = window.__kitKnock;
        off.width = W;
        off.height = h;
        const o = off.getContext('2d');
        o.clearRect(0, 0, W, h);
        // 글자를 먼저 그리고, 그 글자 모양 안에만 사진을 채움
        o.font = c.font;
        o.textAlign = 'left';
        o.fillStyle = '#000';
        r.lines.forEach((ln, i) => o.fillText(ln, zone.x + 10, 22 + r.size * (i + 0.86) * 1.06));
        o.globalCompositeOperation = 'source-in';
        const img = kitImg(S, zone.onPhoto ? 1 : 0);
        if ('filter' in o) o.filter = 'saturate(1.4) contrast(1.15)';
        if (img) kitCover(o, img, 0, -top, W, H, 1.15 + 0.05 * (fr || 0), 0, 0);
        else {
          o.fillStyle = '#ffffff';
          o.fillRect(0, 0, W, h);
        }
        if ('filter' in o) o.filter = 'none';
        // 밝은 바탕 위에서 읽히도록 글자 속 사진을 살짝 어둡게
        if (gLuminance(block) > 0.45) {
          o.globalCompositeOperation = 'source-atop';
          o.fillStyle = 'rgba(0,0,0,0.42)';
          o.fillRect(0, 0, W, h);
        }
        o.globalCompositeOperation = 'source-over';
        c.save();
        c.beginPath();
        c.rect(0, top, W, h * reveal);
        c.clip();
        c.fillStyle = block;
        c.fillRect(0, top, W, h);
        c.drawImage(off, 0, top);
        c.restore();
      } else if (cap === 'marquee') {
        const F = KIT_FONTS[fk] || KIT_FONTS.sans;
        const size = Math.round(52 * F.k);
        const unit = `${text}  ★  `;
        c.save();
        c.translate(W / 2, top + Math.min(130, zone.h / 2));
        c.rotate(-0.08);
        c.font = gFont(F.w, size, F.f);
        const uw = c.measureText(unit).width;
        const rows = [
          { y: -92, bg: hl, fg: hlText, dir: 1 },
          { y: 0, bg: null, fg: ink, dir: -1 },
          { y: 92, bg: zone.onPhoto || !K.light ? '#ffffff' : '#111111', fg: zone.onPhoto || !K.light ? '#111111' : '#ffffff', dir: 1 }
        ];
        rows.forEach((row, i) => {
          const ei = gEase((e - i * 0.1) / 0.4);
          c.save();
          c.globalAlpha = ei;
          if (row.bg) {
            c.fillStyle = row.bg;
            c.fillRect(-W, row.y - size * 0.9, W * 2, size * 1.3);
          }
          const shift = ((t * 90 * row.dir) % uw + uw) % uw;
          c.textAlign = 'left';
          c.textBaseline = 'alphabetic';
          for (let x = -W - shift; x < W; x += uw) {
            if (row.bg) {
              c.fillStyle = row.fg;
              c.fillText(unit, x, row.y);
            } else {
              c.fillStyle = row.fg;
              c.globalAlpha = ei * 0.35;
              c.fillText(unit, x, row.y);
              c.globalAlpha = ei;
            }
          }
          c.restore();
        });
        c.restore();
      } else if (cap === 'longshadow') {
        const r = kWrap(c, text, zone.w - 50, 3, 72, 36, fk);
        const s = gBack(e / 0.42);
        const topCol = K.bgAccent ? '#ffffff' : zone.onPhoto || !K.light ? '#ffffff' : hl;
        const shCol = K.bgAccent ? '#111111' : zone.onPhoto || !K.light ? gMix(hl, -0.35) : gMix(hl, -0.5);
        const blockH = r.lines.length * r.lh;
        c.save();
        c.translate(W / 2, top + blockH / 2 + 10);
        c.scale(s, s);
        c.textAlign = 'center';
        r.lines.forEach((ln, i) => {
          const y = -blockH / 2 + r.lh * (i + 0.85);
          c.fillStyle = shCol;
          for (let k = 12; k >= 1; k--) c.fillText(ln, k, y + k);
          c.fillStyle = topCol;
          c.fillText(ln, 0, y);
        });
        c.restore();
      } else if (cap === 'vsub') {
        // 유튜브 브이로그 자막: 줄마다 반투명 검은 상자
        const r = kWrap(c, text, W - 120, 2, 32, 22, fk);
        c.globalAlpha = gEase(e / 0.3);
        c.textAlign = 'center';
        const blockTop = zone.center ? top : zone.y + zone.h - r.lines.length * (r.lh + 12) - 6;
        r.lines.forEach((ln, i) => {
          const w = c.measureText(ln).width + 28;
          const y = blockTop + i * (r.lh + 12);
          gRoundRect(c, W / 2 - w / 2, y, w, r.lh + 8, 8);
          c.fillStyle = 'rgba(0,0,0,0.62)';
          c.fill();
          c.fillStyle = i === 0 ? '#ffffff' : '#ffe58a';
          c.textBaseline = 'middle';
          c.fillText(ln, W / 2, y + (r.lh + 8) / 2 + 1);
          c.textBaseline = 'alphabetic';
        });
      } else if (cap === 'chapter') {
        // 챕터 카드: #01 번호 + 제목
        const ee = gEase(e / 0.45);
        const num = `#${kPad(cutIdx + 1)}`;
        c.textAlign = 'left';
        c.save();
        c.globalAlpha = ee;
        c.translate((1 - ee) * -60, 0);
        c.fillStyle = hl;
        kLine(c, num, zone.x, top + 64, 200, 72, 40, fk === 'pen' ? 'impact' : fk);
        c.fillStyle = ink;
        c.fillRect(zone.x, top + 84, 60 * ee, 3);
        c.restore();
        const r = kWrap(c, text, zone.w, 2, 36, 22, fk);
        c.globalAlpha = gEase((e - 0.2) / 0.4);
        c.fillStyle = ink;
        shadowOn();
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x, top + 104 + r.lh * (i + 0.85)));
        c.shadowColor = 'transparent';
        c.globalAlpha = gEase((e - 0.35) / 0.4) * 0.75;
        c.font = gFont(600, 13, GENRE_FONTS.mono);
        c.fillText(`CHAPTER ${kPad(cutIdx + 1)} · ${K.label}`, zone.x, top + 116 + r.lh * r.lines.length + 10);
      } else if (cap === 'loctag') {
        // 위치 태그(핀 아이콘 + 지점) + 자막
        const place = (K.dealer && K.dealer.branch) || K.label;
        const ee = gBack(e / 0.4);
        c.font = gFont(800, 16, GENRE_FONTS.sans);
        const tw = Math.min(zone.w - 50, c.measureText(place).width) + 52;
        c.save();
        c.translate(zone.x, top);
        c.scale(ee, ee);
        gRoundRect(c, 0, 0, tw, 38, 19);
        c.fillStyle = '#ffffff';
        c.fill();
        c.fillStyle = gReadableAccent(hl, true);
        c.beginPath();
        c.arc(22, 16, 8, Math.PI, 0);
        c.lineTo(22, 30);
        c.closePath();
        c.fill();
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(22, 16, 3, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#111111';
        c.textAlign = 'left';
        gDrawLine(c, place, 40, 25, tw - 52, 16, 11, GENRE_FONTS.sans, 800);
        c.restore();
        const r = kWrap(c, text, zone.w, 3, 38, 24, fk);
        c.globalAlpha = gEase((e - 0.15) / 0.4);
        c.fillStyle = ink;
        c.textAlign = 'left';
        shadowOn();
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x, top + 56 + r.lh * (i + 0.85)));
      } else if (cap === 'checkl') {
        // 출고 체크리스트: 지난 컷 문구는 체크된 채로 쌓이고, 지금 컷이 새로 체크됨
        const items = [];
        const caps = campaign.cutCaptions || [];
        for (let i = Math.max(0, cutIdx - 2); i <= cutIdx; i++) items.push({ txt: i === cutIdx ? text : gCleanCaption(caps[i] || ''), now: i === cutIdx });
        const rowH = 56;
        const h = 58 + items.length * rowH;
        // 밝은 바탕에서도 카드가 보이게 그림자 + 테두리
        c.save();
        c.shadowColor = 'rgba(15,23,42,0.18)';
        c.shadowBlur = 26;
        c.shadowOffsetY = 8;
        gRoundRect(c, zone.x, top, zone.w, h, 16);
        c.fillStyle = 'rgba(255,255,255,0.97)';
        c.fill();
        c.restore();
        gRoundRect(c, zone.x, top, zone.w, h, 16);
        c.strokeStyle = 'rgba(15,23,42,0.08)';
        c.lineWidth = 1;
        c.stroke();
        c.fillStyle = gReadableAccent(hl, true);
        c.fillRect(zone.x + 20, top, 46, 4);
        c.fillStyle = '#111111';
        c.textAlign = 'left';
        c.font = gFont(800, 15, GENRE_FONTS.sans);
        c.fillText(K.label, zone.x + 20, top + 32);
        c.fillStyle = '#999999';
        c.font = gFont(600, 12, GENRE_FONTS.mono);
        c.textAlign = 'right';
        c.fillText(`${cutIdx + 1}/${(caps.length || 1)}`, zone.x + zone.w - 20, top + 32);
        c.textAlign = 'left';
        items.forEach((it, i) => {
          const y = top + 48 + i * rowH;
          const done = it.now ? gEase((e - 0.35) / 0.3) : 1;
          gRoundRect(c, zone.x + 20, y + 10, 24, 24, 6);
          c.strokeStyle = done > 0 ? gReadableAccent(hl, true) : '#bbbbbb';
          c.lineWidth = 2;
          c.stroke();
          if (done > 0) {
            c.fillStyle = gReadableAccent(hl, true);
            c.globalAlpha = done;
            c.fill();
            c.strokeStyle = '#ffffff';
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(zone.x + 26, y + 22);
            c.lineTo(zone.x + 30, y + 27);
            c.lineTo(zone.x + 38, y + 16);
            c.stroke();
            c.globalAlpha = 1;
          }
          c.fillStyle = it.now ? '#111111' : '#9a9a9a';
          c.globalAlpha = it.now ? gEase(e / 0.3) : 1;
          const FK = KIT_FONTS[fk] || KIT_FONTS.sans;
          gDrawLine(c, it.txt, zone.x + 56, y + 31, zone.w - 76, Math.round((it.now ? 26 : 17) * FK.k), Math.round(13 * FK.k), FK.f, FK.w);
          c.globalAlpha = 1;
          if (!it.now) {
            c.fillStyle = '#c4c4c4';
            c.fillRect(zone.x + 56, y + 23, Math.min(zone.w - 76, c.measureText(it.txt).width), 1.5);
          }
        });
      } else if (cap === 'timestamp') {
        // 날짜·시각 + 자막 (일상 기록 느낌)
        const hh = 9 + cutIdx * 2;
        const ampm = hh < 12 ? 'AM' : 'PM';
        const h12 = hh > 12 ? hh - 12 : hh;
        const clock = `${ampm} ${h12}:${kPad((cutIdx * 17 + 5) % 60)}`;
        c.textAlign = 'left';
        c.globalAlpha = gEase(e / 0.35);
        c.fillStyle = ink;
        shadowOn();
        kLine(c, clock, zone.x, top + 52, zone.w, 58, 34, fk === 'pen' || fk === 'gaegu' ? fk : 'sans');
        c.fillStyle = hl;
        c.font = gFont(700, 15, GENRE_FONTS.mono);
        c.fillText(`DAY ${kPad(cutIdx + 1)} · ${K.label}`, zone.x + 2, top + 80);
        const r = kWrap(c, text, zone.w, 2, 30, 20, fk);
        c.globalAlpha = gEase((e - 0.2) / 0.4);
        c.fillStyle = ink;
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x, top + 104 + r.lh * (i + 0.85)));
      } else if (cap === 'scriptkick' || cap === 'signline' || cap === 'quotecard' || cap === 'notecard') {
        // ★ 프리미엄 손글씨: 본문은 반듯한 활자, 손글씨는 서명·한 줄 포인트로만
        const SF = KIT_FONTS[spec.sfont || 'greatvibes'] || KIT_FONTS.brush;
        const scriptCol = zone.onPhoto || !K.light ? hl : gReadableAccent(hl, true);
        const reveal = (x, y, w, h, p, draw) => {
          if (p <= 0) return;
          c.save();
          c.beginPath();
          c.rect(x, y, w * Math.min(1, p), h);
          c.clip();
          draw();
          c.restore();
        };
        const dealerName = (K.dealer && K.dealer.name) || '';
        if (cap === 'scriptkick') {
          c.textAlign = 'left';
          const ss = Math.round(58 * SF.k);
          c.font = gFont(SF.w, ss, SF.f);
          const sw = Math.min(zone.w, c.measureText(spec.script || '').width + 20);
          reveal(zone.x - 6, top - 10, sw + 20, ss * 1.5, e / 0.6, () => {
            c.save();
            c.translate(zone.x, top + ss * 0.85);
            c.rotate(-0.045);
            c.fillStyle = scriptCol;
            if (zone.onPhoto) {
              c.shadowColor = 'rgba(0,0,0,0.5)';
              c.shadowBlur = 10;
            }
            c.fillText(spec.script || '', 0, 0);
            c.restore();
          });
          const r = kWrap(c, text, zone.w, 2, 36, 22, fk);
          c.globalAlpha = gEase((e - 0.3) / 0.4);
          c.fillStyle = ink;
          shadowOn();
          const y0 = top + ss * 1.45;
          r.lines.forEach((ln, i) => c.fillText(ln, zone.x, y0 + r.lh * (i + 0.85)));
          c.shadowColor = 'transparent';
          c.fillStyle = scriptCol;
          c.fillRect(zone.x, y0 + r.lh * r.lines.length + 14, 44 * gEase((e - 0.45) / 0.4), 2);
        } else if (cap === 'signline') {
          const r = kWrap(c, text, zone.w, 2, 40, 24, fk);
          c.textAlign = 'left';
          c.globalAlpha = gEase(e / 0.35);
          c.fillStyle = ink;
          shadowOn();
          let maxW = 0;
          r.lines.forEach((ln, i) => {
            c.fillText(ln, zone.x, top + r.lh * (i + 0.85));
            maxW = Math.max(maxW, c.measureText(ln).width);
          });
          c.shadowColor = 'transparent';
          c.globalAlpha = 1;
          // 한 번에 그은 듯한 매끈한 밑줄
          const ly = top + r.lh * r.lines.length + 16;
          const lw = Math.min(zone.w, maxW + 10);
          const p = gEase((e - 0.3) / 0.45);
          if (p > 0) {
            c.save();
            c.strokeStyle = scriptCol;
            c.lineWidth = 2.5;
            c.lineCap = 'round';
            c.setLineDash([lw * 1.2, lw * 1.2]);
            c.lineDashOffset = lw * 1.2 * (1 - p);
            c.beginPath();
            c.moveTo(zone.x, ly + 6);
            c.bezierCurveTo(zone.x + lw * 0.3, ly - 2, zone.x + lw * 0.7, ly + 4, zone.x + lw, ly - 6);
            c.stroke();
            c.restore();
          }
          const ss = Math.round(34 * SF.k);
          c.font = gFont(SF.w, ss, SF.f);
          c.textAlign = 'right';
          const tx = zone.x + zone.w;
          reveal(tx - zone.w, ly + 8, zone.w, ss * 1.4, (e - 0.6) / 0.35, () => {
            c.fillStyle = scriptCol;
            if (zone.onPhoto) {
              c.shadowColor = 'rgba(0,0,0,0.5)';
              c.shadowBlur = 8;
            }
            c.fillText(spec.script || '', tx, ly + 8 + ss);
          });
        } else if (cap === 'quotecard') {
          c.textAlign = 'left';
          c.globalAlpha = gEase(e / 0.3);
          c.fillStyle = scriptCol;
          c.font = gFont(700, 110, GENRE_FONTS.serif);
          c.fillText('“', zone.x - 6, top + 78);
          const r = kWrap(c, text, zone.w - 16, 3, 32, 20, fk);
          c.globalAlpha = gEase((e - 0.1) / 0.4);
          c.fillStyle = ink;
          shadowOn();
          r.lines.forEach((ln, i) => c.fillText(ln, zone.x + 8, top + 70 + r.lh * (i + 0.85)));
          c.shadowColor = 'transparent';
          c.globalAlpha = 1;
          const ss = Math.round(32 * KIT_FONTS.brush.k);
          c.font = gFont(KIT_FONTS.brush.w, ss, KIT_FONTS.brush.f);
          c.textAlign = 'right';
          const sy = top + 70 + r.lh * r.lines.length + 16;
          c.fillStyle = scriptCol;
          c.fillRect(zone.x + zone.w - c.measureText(dealerName).width - 44, sy + ss * 0.55, 24 * gEase((e - 0.5) / 0.3), 1.5);
          reveal(zone.x, sy, zone.w, ss * 1.4, (e - 0.55) / 0.4, () => {
            c.fillStyle = scriptCol;
            c.fillText(dealerName, zone.x + zone.w, sy + ss * 0.95);
          });
        } else {
          // notecard: 고급 카드지 + 활자 본문 + 카마스터 서명
          const r = kWrap(c, text, zone.w - 70, 3, 30, 20, fk);
          const h = 92 + r.lines.length * r.lh + 56;
          const y0 = top + (1 - gEase(e / 0.5)) * 40;
          c.save();
          c.globalAlpha = gEase(e / 0.35);
          c.shadowColor = 'rgba(0,0,0,0.18)';
          c.shadowBlur = 24;
          c.shadowOffsetY = 8;
          c.fillStyle = '#fffdf8';
          c.fillRect(zone.x, y0, zone.w, h);
          c.shadowColor = 'transparent';
          c.strokeStyle = 'rgba(120,100,60,0.28)';
          c.lineWidth = 1;
          c.strokeRect(zone.x + 10.5, y0 + 10.5, zone.w - 21, h - 21);
          c.fillStyle = '#8a7a5c';
          c.textAlign = 'center';
          c.font = gFont(600, 12, GENRE_FONTS.sans);
          c.fillText(K.label.split('').join(' '), W / 2, y0 + 42);
          c.fillStyle = '#1f2937';
          r.lines.forEach((ln, i) => {
            c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
            c.fillText(ln, W / 2, y0 + 70 + r.lh * (i + 0.85));
          });
          c.restore();
          const ss = Math.round(30 * KIT_FONTS.brush.k);
          c.font = gFont(KIT_FONTS.brush.w, ss, KIT_FONTS.brush.f);
          c.textAlign = 'right';
          const sx = zone.x + zone.w - 34;
          const sy = y0 + h - 22;
          reveal(zone.x, sy - ss, zone.w, ss * 1.3, (e - 0.5) / 0.4, () => {
            c.fillStyle = gReadableAccent(hl, true);
            c.fillText(dealerName, sx, sy);
          });
        }
      } else if (cap === 'lower3') {
        const r = kWrap(c, text, W - 110, 2, 32, 20, fk);
        const tabE = gEase(e / 0.3);
        const barE = gEase((e - 0.12) / 0.4);
        c.font = gFont(800, 15, GENRE_FONTS.sans);
        const tw = c.measureText(K.label).width + 28;
        c.fillStyle = hl;
        c.fillRect(zone.x, top, tw * tabE, 34);
        c.fillStyle = hlText;
        c.textAlign = 'left';
        if (tabE > 0.9) c.fillText(K.label, zone.x + 14, top + 23);
        c.font = kFont(fk, r.size / (KIT_FONTS[fk] || KIT_FONTS.sans).k);
        let mw = 0;
        r.lines.forEach((ln) => (mw = Math.max(mw, c.measureText(ln).width)));
        const bw = (mw + 44) * barE;
        const bh = r.lines.length * r.lh + 22;
        c.fillStyle = '#ffffff';
        c.fillRect(zone.x, top + 34, bw, bh);
        c.fillStyle = hl;
        c.fillRect(zone.x, top + 34, 6, bh * barE);
        c.save();
        c.beginPath();
        c.rect(zone.x, top + 34, bw, bh);
        c.clip();
        c.fillStyle = '#111111';
        r.lines.forEach((ln, i) => c.fillText(ln, zone.x + 24, top + 44 + r.lh * (i + 0.8)));
        c.restore();
      }
      c.restore();
    }

    // ---------- 장식 12가지 ----------
    function kitDeco(c, W, H, t, spec, V, K, phase) {
      const D = spec.deco;
      const col = K.bgAccent ? K.hl : V.accent;
      if (phase === 'under') {
        if (D === 'bars') {
          c.fillStyle = '#000';
          c.fillRect(0, 0, W, 62);
          c.fillRect(0, H - 62, W, 62);
        } else if (D === 'grid') {
          c.strokeStyle = K.light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.08)';
          c.lineWidth = 1;
          for (let x = 0; x <= W; x += 60) {
            c.beginPath();
            c.moveTo(x + 0.5, 0);
            c.lineTo(x + 0.5, H);
            c.stroke();
          }
          for (let y = 0; y <= H; y += 60) {
            c.beginPath();
            c.moveTo(0, y + 0.5);
            c.lineTo(W, y + 0.5);
            c.stroke();
          }
        } else if (D === 'dots') {
          c.fillStyle = col;
          [[W, 0], [0, H]].forEach(([ox, oy]) => {
            for (let i = 0; i < 9; i++) {
              for (let j = 0; j < 9; j++) {
                const x = ox === 0 ? 14 + i * 22 : W - 14 - i * 22;
                const y = oy === 0 ? 14 + j * 22 : H - 14 - j * 22;
                const rr = Math.max(0, 7 - (i + j) * 0.55);
                if (rr <= 0.4) continue;
                c.globalAlpha = 0.55;
                c.beginPath();
                c.arc(x, y, rr, 0, Math.PI * 2);
                c.fill();
              }
            }
          });
          c.globalAlpha = 1;
        } else if (D === 'leak') {
          c.save();
          c.globalCompositeOperation = 'lighter';
          [[0.2, '#ff7a3d'], [0.75, '#ff3d8b']].forEach(([k, cl], i) => {
            const x = W * (k + 0.15 * Math.sin(t * 0.7 + i * 2));
            const y = H * (0.25 + 0.5 * i + 0.08 * Math.cos(t * 0.5 + i));
            const g = c.createRadialGradient(x, y, 0, x, y, 320);
            g.addColorStop(0, cl);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            c.globalAlpha = 0.28;
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
          });
          c.restore();
        } else if (D === 'shapes') {
          c.save();
          const c2 = V.accent2 || '#ffffff';
          const drift = Math.sin(t * 1.4) * 14;
          c.save();
          c.translate(64, 150 + drift);
          c.rotate(t * 0.7);
          c.strokeStyle = col;
          c.lineWidth = 3;
          c.globalAlpha = 0.75;
          c.strokeRect(-22, -22, 44, 44);
          c.restore();
          c.save();
          c.strokeStyle = c2;
          c.lineWidth = 2.5;
          c.globalAlpha = 0.65;
          c.beginPath();
          c.arc(W - 62, 130 - drift * 0.7, 26 + Math.sin(t * 2.2) * 5, 0, Math.PI * 2);
          c.stroke();
          c.fillStyle = col;
          c.globalAlpha = 0.45;
          c.beginPath();
          c.arc(W - 62, 130 - drift * 0.7, 10, 0, Math.PI * 2);
          c.fill();
          c.restore();
          c.save();
          c.translate(W - 112, 214 + drift * 0.8);
          c.rotate(-t * 0.55);
          c.fillStyle = col;
          c.globalAlpha = 0.55;
          c.beginPath();
          c.moveTo(0, -24);
          c.lineTo(22, 18);
          c.lineTo(-22, 18);
          c.closePath();
          c.fill();
          c.restore();
          c.restore();
        }
        return;
      }
      if (D === 'corners') {
        c.strokeStyle = K.light && !KIT_PHOTO_TOP.includes(spec.layout) ? '#111111' : '#ffffff';
        c.lineWidth = 3;
        const L2 = 30;
        const m = 22;
        [[m, 40, 1, 1], [W - m, 40, -1, 1], [m, H - 20, 1, -1], [W - m, H - 20, -1, -1]].forEach(([x, y, sx, sy]) => {
          c.beginPath();
          c.moveTo(x, y + sy * L2);
          c.lineTo(x, y);
          c.lineTo(x + sx * L2, y);
          c.stroke();
        });
      } else if (D === 'grain') {
        c.save();
        c.globalAlpha = 0.09;
        c.globalCompositeOperation = 'overlay';
        const n = kitNoise();
        const ox = (Math.floor(t * 24) * 37) % 60;
        c.drawImage(n, -ox, -((Math.floor(t * 24) * 53) % 60), W + 60, H + 60);
        c.restore();
        c.fillStyle = 'rgba(0,0,0,0.05)';
        for (let y = 0; y < H; y += 4) c.fillRect(0, y, W, 1);
      } else if (D === 'vhs') {
        c.save();
        c.font = gFont(700, 20, GENRE_FONTS.mono);
        c.textAlign = 'left';
        c.shadowColor = 'rgba(0,0,0,0.6)';
        c.shadowBlur = 6;
        if (Math.floor(t * 1.6) % 2 === 0) {
          c.fillStyle = '#ff3b30';
          c.beginPath();
          c.arc(40, 62, 9, 0, Math.PI * 2);
          c.fill();
        }
        c.fillStyle = '#ffffff';
        c.fillText('REC', 56, 69);
        c.textAlign = 'right';
        c.fillText('▶ PLAY', W - 30, 69);
        const sec = Math.floor(t);
        c.fillText(`00:00:${kPad(sec % 60)}:${kPad(Math.floor((t % 1) * 30))}`, W - 30, 98);
        c.restore();
        const y = (t * 140) % H;
        c.fillStyle = 'rgba(255,255,255,0.12)';
        c.fillRect(0, y, W, 6);
        c.fillStyle = 'rgba(255,0,80,0.06)';
        c.fillRect(0, y + 8, W, 2);
      } else if (D === 'sprocket') {
        c.fillStyle = '#000';
        c.fillRect(0, 0, 30, H);
        c.fillRect(W - 30, 0, 30, H);
        c.fillStyle = 'rgba(255,255,255,0.85)';
        for (let y = ((t * 60) % 34) - 34; y < H; y += 34) {
          gRoundRect(c, 8, y, 14, 20, 3);
          c.fill();
          gRoundRect(c, W - 22, y, 14, 20, 3);
          c.fill();
        }
      } else if (D === 'confetti') {
        const cols = [col, V.accent2, '#ffffff', '#f472b6', '#60a5fa'];
        for (let i = 0; i < 36; i++) {
          const h = gHash('cf' + i);
          const x = (h % W) + Math.sin(t * 2 + i) * 16;
          const y = (((h >> 8) % H) + t * (60 + (h % 50))) % (H + 40) - 20;
          c.save();
          c.translate(x, y);
          c.rotate(t * 3 + i);
          c.fillStyle = cols[i % cols.length];
          c.fillRect(-5, -3, 10, 6);
          c.restore();
        }
      } else if (D === 'border') {
        c.strokeStyle = col;
        c.lineWidth = 14;
        c.strokeRect(7, 7, W - 14, H - 14);
        c.font = gFont(900, 14, GENRE_FONTS.sans);
        const tw = c.measureText(K.label).width + 24;
        c.fillStyle = col;
        c.fillRect(W / 2 - tw / 2, H - 34, tw, 34);
        c.fillStyle = kTextOn(col);
        c.textAlign = 'center';
        c.fillText(K.label, W / 2, H - 12);
      } else if (D === 'camera') {
        // 카메라 앱 화면: 3분할 격자, 초점 상자, 녹화 시간, 화질
        c.strokeStyle = 'rgba(255,255,255,0.22)';
        c.lineWidth = 1;
        [W / 3, (W * 2) / 3].forEach((x) => {
          c.beginPath();
          c.moveTo(x, 0);
          c.lineTo(x, H);
          c.stroke();
        });
        [H / 3, (H * 2) / 3].forEach((y) => {
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(W, y);
          c.stroke();
        });
        const pulse = 1 + 0.06 * Math.sin(t * 5);
        const fs = 70 * pulse;
        c.strokeStyle = '#facc15';
        c.lineWidth = 2;
        const fx = W / 2;
        const fy = H * 0.42;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
          c.beginPath();
          c.moveTo(fx + sx * fs, fy + sy * (fs - 16));
          c.lineTo(fx + sx * fs, fy + sy * fs);
          c.lineTo(fx + sx * (fs - 16), fy + sy * fs);
          c.stroke();
        });
        c.save();
        c.font = gFont(700, 15, GENRE_FONTS.mono);
        c.textAlign = 'right';
        c.shadowColor = 'rgba(0,0,0,0.6)';
        c.shadowBlur = 6;
        c.fillStyle = Math.floor(t * 1.5) % 2 ? '#ff3b30' : 'rgba(255,59,48,0.4)';
        c.beginPath();
        c.arc(W - 116, 66, 6, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#ffffff';
        c.fillText(`00:${kPad(Math.floor(t))}`, W - 26, 72);
        c.fillText('4K · 60', W - 26, H * 0.62);
        c.restore();
      } else if (D === 'sparkle') {
        for (let i = 0; i < 12; i++) {
          const h = gHash('sp' + i);
          const x = 30 + (h % (W - 60));
          const y = 60 + ((h >> 9) % (H * 0.6));
          const s = Math.max(0, Math.sin(t * 3 + i * 1.7)) * (8 + (h % 8));
          if (s < 1) continue;
          c.fillStyle = i % 3 ? '#ffffff' : col;
          c.beginPath();
          c.moveTo(x, y - s);
          c.quadraticCurveTo(x, y, x + s, y);
          c.quadraticCurveTo(x, y, x, y + s);
          c.quadraticCurveTo(x, y, x - s, y);
          c.quadraticCurveTo(x, y, x, y - s);
          c.fill();
        }
      }
    }

    // ---------- 상단 머리표 5가지 ----------
    function kitHead(c, W, t, spec, V, K, S, cutIdx, totalCuts, cutDur) {
      const hd = spec.deco === 'vhs' ? 'none' : spec.head;
      const col = K.bgAccent ? K.hl : V.accent;
      const topInk = KIT_PHOTO_TOP.includes(spec.layout) || !K.light ? '#ffffff' : '#111111';
      if (hd !== 'counter') drawGenreProgress(c, W, t, cutDur, totalCuts, col, spec.deco === 'bars' ? 70 : 14, topInk === '#ffffff' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.15)');
      const a = gEase(t / 0.5);
      c.save();
      c.globalAlpha = a;
      const y = spec.deco === 'bars' ? 88 : 32;
      if (hd === 'pill') {
        c.font = gFont(800, 14, GENRE_FONTS.sans);
        const w = c.measureText(K.label).width + 28;
        gRoundRect(c, 18, y, w, 32, 16);
        c.fillStyle = col;
        c.fill();
        c.fillStyle = kTextOn(col);
        c.textAlign = 'left';
        c.fillText(K.label, 32, y + 21);
      } else if (hd === 'kicker') {
        c.fillStyle = topInk;
        c.font = gFont(800, 13, GENRE_FONTS.sans);
        c.textAlign = 'center';
        const label = K.label.split('').join(' ');
        const w = c.measureText(label).width;
        c.fillText(label, W / 2, y + 22);
        c.fillStyle = col;
        c.fillRect(W / 2 - w / 2 - 50, y + 17, 36, 2);
        c.fillRect(W / 2 + w / 2 + 14, y + 17, 36, 2);
      } else if (hd === 'box') {
        c.font = gFont(800, 13, GENRE_FONTS.mono);
        const w = c.measureText(K.label).width + 22;
        c.strokeStyle = topInk;
        c.lineWidth = 1.5;
        c.strokeRect(W - 18 - w, y, w, 30);
        c.fillStyle = topInk;
        c.textAlign = 'right';
        c.fillText(K.label, W - 29, y + 20);
      } else if (hd === 'profile') {
        // 인스타 스토리처럼 프로필 사진 + 이름 + 시간
        const dd = K.dealer || {};
        drawGenreAvatar(c, dd, 36, y + 18, 16, col, 2);
        c.textAlign = 'left';
        c.fillStyle = topInk;
        c.shadowColor = 'rgba(0,0,0,0.5)';
        c.shadowBlur = 6;
        gDrawLine(c, `${dd.name || ''} ${dd.title || ''}`, 60, y + 16, 260, 15, 11, GENRE_FONTS.sans, 800);
        c.font = gFont(500, 12, GENRE_FONTS.sans);
        c.fillStyle = topInk === '#ffffff' ? 'rgba(255,255,255,0.75)' : '#666666';
        c.fillText(`${K.label} · 방금`, 60, y + 33);
        c.shadowColor = 'transparent';
      } else if (hd === 'counter') {
        c.fillStyle = col;
        c.textAlign = 'left';
        kLine(c, kPad(cutIdx + 1), 22, y + 50, 120, 56, 40, spec.font === 'pen' ? 'impact' : spec.font);
        c.font = gFont(700, 16, GENRE_FONTS.mono);
        c.fillStyle = topInk;
        c.fillText(`/ ${kPad(totalCuts)}`, 96, y + 48);
        c.fillStyle = col;
        c.fillRect(22, y + 62, 120 * Math.min(1, (t - cutIdx * cutDur) / cutDur), 3);
      }
      c.restore();
    }

    // ---------- 본편 카마스터 칩 3가지 ----------
    function kitChip(c, d, W, H, spec, V, K, enter) {
      const variant = { pill: 'round', counter: 'round', box: 'square', kicker: 'line', none: 'line', profile: 'square' }[spec.head] || 'round';
      const onPhoto = ['full', 'blinds', 'dim', 'handheld'].includes(spec.layout);
      const y = (spec.deco === 'bars' ? H - 124 : H - 82) + (1 - enter) * 30;
      const col = K.bgAccent ? K.hl : V.accent;
      c.save();
      c.globalAlpha = enter;
      const label = `${d.name} ${d.title}`;
      if (variant === 'line') {
        const ink = onPhoto || !K.light ? '#ffffff' : '#111111';
        drawGenreAvatar(c, d, 44, y + 26, 20, col, 2);
        c.fillStyle = ink;
        c.textAlign = 'left';
        if (onPhoto) {
          c.shadowColor = 'rgba(0,0,0,0.6)';
          c.shadowBlur = 8;
        }
        kLine(c, label, 76, y + 24, 300, 19, 13, spec.font === 'pen' ? 'sans' : spec.font);
        c.shadowColor = 'transparent';
        c.font = gFont(500, 12, GENRE_FONTS.sans);
        c.fillStyle = onPhoto || !K.light ? 'rgba(255,255,255,0.75)' : '#555555';
        gDrawLine(c, d.branch || '', 76, y + 43, 300, 12, 10, GENRE_FONTS.sans, 500);
        c.fillStyle = col;
        c.fillRect(76, y + 51, 40, 2);
        c.restore();
        return;
      }
      c.font = gFont(800, 18, GENRE_FONTS.sans);
      const nameW = Math.min(300, c.measureText(label).width);
      c.font = gFont(500, 12, GENRE_FONTS.sans);
      const subW = Math.min(300, c.measureText(d.branch || '').width);
      const w = Math.max(nameW, subW) + 88;
      const dark = onPhoto || !K.light;
      gRoundRect(c, 18, y, w, 54, variant === 'round' ? 27 : 4);
      c.fillStyle = dark ? 'rgba(10,10,14,0.78)' : '#ffffff';
      c.fill();
      if (variant === 'square') {
        c.fillStyle = col;
        c.fillRect(18, y, 5, 54);
      }
      drawGenreAvatar(c, d, 46, y + 27, 19, col, 2);
      c.fillStyle = dark ? '#ffffff' : '#111111';
      c.textAlign = 'left';
      gDrawLine(c, label, 76, y + 24, 300, 18, 12, GENRE_FONTS.sans, 800);
      c.fillStyle = dark ? 'rgba(255,255,255,0.68)' : '#555555';
      gDrawLine(c, d.branch || '', 76, y + 42, 300, 12, 10, GENRE_FONTS.sans, 500);
      c.restore();
    }

    // ---------- 마지막 명함 12가지 (전화번호는 절대 넣지 않음) ----------
    function kitAvatarRect(c, d, x, y, w, h, col) {
      const img = d.avatarImg;
      c.save();
      c.beginPath();
      c.rect(x, y, w, h);
      c.clip();
      if (img && (img.naturalWidth || img.width)) kitCover(c, img, x, y, w, h, 1, 0, 0);
      else {
        c.fillStyle = col;
        c.fillRect(x, y, w, h);
        c.fillStyle = kTextOn(col);
        c.font = gFont(800, h * 0.45, GENRE_FONTS.sans);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(d.name || '?').slice(0, 1), x + w / 2, y + h / 2);
        c.textBaseline = 'alphabetic';
      }
      c.restore();
    }
    function kitOutro(c, W, H, t, local, lt, spec, V, K, d, S) {
      if (typeof IND !== 'undefined' && IND.outroMode === 'store') {
        return drawStoreOutro(c, W, H, t, local, V, d);
      }
      const O = spec.outro;
      const fk = spec.font;
      const col = K.bgAccent ? K.hl : V.accent;
      const colText = kTextOn(col);
      const cta = arCta();
      const promo = gCleanCaption(d.promoTag || '');
      const disc = arPriceLine();
      const veh = campaign.vehicle;
      const name = d.name || '';
      const e = gBack(local / 0.55);
      const a = gEase(local / 0.4);
      const after = (k) => gEase((local - k) / 0.4);
      c.textAlign = 'center';
      const ctaButton = (y, h, r, fill, txt) => {
        const pulse = 1 + 0.03 * Math.sin(t * 7);
        c.save();
        c.globalAlpha = after(0.35);
        c.translate(W / 2, y);
        c.scale(pulse, pulse);
        gRoundRect(c, -205, -h / 2, 410, h, r);
        c.fillStyle = fill;
        c.fill();
        c.fillStyle = txt;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        kLine(c, cta, 0, 2, 370, 30, 18, fk);
        c.textBaseline = 'alphabetic';
        c.restore();
      };

      if (O === 'signature') {
        // ★ 서명 명함: 반듯한 활자 + 카마스터 이름을 손으로 서명하는 연출
        const SF = KIT_FONTS[spec.sfont || 'greatvibes'] || KIT_FONTS.brush;
        const dark = !K.light || K.bgAccent;
        const bgc = dark ? '#0f0e0c' : '#f6f1e7';
        const inkc = dark ? '#f5efe2' : '#1c1a17';
        const sub = dark ? 'rgba(245,239,226,0.6)' : '#7a7062';
        const gold = dark ? hlSafe(col) : gReadableAccent(col, true);
        function hlSafe(x) {
          return gLuminance(x) < 0.25 ? '#d4af37' : x;
        }
        c.fillStyle = bgc;
        c.fillRect(0, 0, W, H);
        c.strokeStyle = gold;
        c.globalAlpha = 0.45;
        c.lineWidth = 1;
        c.strokeRect(24.5, 24.5, W - 49, H - 49);
        c.globalAlpha = a;
        c.textAlign = 'center';
        c.fillStyle = gold;
        c.font = gFont(SF.w, Math.round(52 * SF.k), SF.f);
        c.fillText(spec.script || 'With care', W / 2, 190);
        drawGenreAvatar(c, d, W / 2, 300, 62, gold, 2);
        c.fillStyle = inkc;
        kLine(c, name, W / 2, 418, W - 120, 38, 24, 'serif7');
        c.fillStyle = sub;
        gDrawLine(c, `${d.title} · ${d.branch || ''}`, W / 2, 450, W - 120, 15, 11, GENRE_FONTS.sans, 600);
        c.globalAlpha = 1;
        // 서명
        const ss = Math.round(64 * KIT_FONTS.brush.k);
        c.font = gFont(KIT_FONTS.brush.w, ss, KIT_FONTS.brush.f);
        const sw = c.measureText(name).width;
        const p = gEase((local - 0.25) / 0.55);
        if (p > 0) {
          c.save();
          c.beginPath();
          c.rect(W / 2 - sw / 2 - 10, 470, (sw + 20) * p, ss * 1.4);
          c.clip();
          c.fillStyle = gold;
          c.save();
          c.translate(W / 2, 470 + ss);
          c.rotate(-0.05);
          c.fillText(name, 0, 0);
          c.restore();
          c.restore();
          c.strokeStyle = gold;
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(W / 2 - sw / 2 - 10, 476 + ss * 1.15);
          c.lineTo(W / 2 - sw / 2 - 10 + (sw + 20) * p, 470 + ss * 1.1);
          c.stroke();
        }
        c.globalAlpha = after(0.5);
        c.fillStyle = inkc;
        kLine(c, IND.promise, W / 2, 640, W - 120, 19, 13, 'serif7');
        c.fillStyle = sub;
        gDrawLine(c, `${veh} · ${disc}`, W / 2, 674, W - 120, 15, 11, GENRE_FONTS.sans, 600);
        c.globalAlpha = after(0.6);
        c.strokeStyle = inkc;
        c.lineWidth = 1.2;
        gRoundRect(c, 70, 760, W - 140, 62, 4);
        c.stroke();
        c.fillStyle = inkc;
        c.textBaseline = 'middle';
        kLine(c, cta, W / 2, 792, W - 180, 22, 15, 'sans');
        c.textBaseline = 'alphabetic';
        c.globalAlpha = 1;
        return;
      }
      if (O === 'vlogend') {
        // 유튜브 끝 화면 느낌: 다음 영상 두 칸 + 가운데 프로필 + 댓글 안내
        c.fillStyle = 'rgba(8,8,10,0.86)';
        c.fillRect(0, 0, W, H);
        c.textAlign = 'center';
        c.globalAlpha = a;
        c.fillStyle = '#ffffff';
        kLine(c, IND.vlogDone, W / 2, 150, W - 60, 46, 28, fk);
        c.fillStyle = 'rgba(255,255,255,0.65)';
        gDrawLine(c, `${veh} · ${disc}`, W / 2, 186, W - 80, 17, 12, GENRE_FONTS.sans, 600);
        c.globalAlpha = 1;
        [[-1, 1], [1, 2]].forEach(([side, k], i) => {
          const p = gBack((local - 0.1 - i * 0.12) / 0.45);
          if (p <= 0.01) return;
          const bw = 220;
          const bh = 300;
          const x = W / 2 + side * 125 - bw / 2;
          c.save();
          c.translate(x + bw / 2, 250 + bh / 2);
          c.scale(p, p);
          c.translate(-(x + bw / 2), -(250 + bh / 2));
          c.save();
          gRoundRect(c, x, 250, bw, bh, 16);
          c.clip();
          kitCover(c, kitImg(S, k), x, 250, bw, bh, 1.05, 0, 0);
          const g = c.createLinearGradient(0, 430, 0, 550);
          g.addColorStop(0, 'rgba(0,0,0,0)');
          g.addColorStop(1, 'rgba(0,0,0,0.75)');
          c.fillStyle = g;
          c.fillRect(x, 430, bw, 120);
          c.restore();
          gRoundRect(c, x, 250, bw, bh, 16);
          c.strokeStyle = 'rgba(255,255,255,0.25)';
          c.lineWidth = 1.5;
          c.stroke();
          c.fillStyle = '#ffffff';
          c.textAlign = 'left';
          gDrawLine(c, i === 0 ? '지난 출고 영상' : '다음 출고 예고', x + 14, 534, bw - 28, 16, 11, GENRE_FONTS.sans, 800);
          c.beginPath();
          c.arc(x + bw / 2, 400, 26, 0, Math.PI * 2);
          c.fillStyle = 'rgba(255,255,255,0.85)';
          c.fill();
          c.fillStyle = '#111111';
          c.beginPath();
          c.moveTo(x + bw / 2 - 7, 388);
          c.lineTo(x + bw / 2 + 12, 400);
          c.lineTo(x + bw / 2 - 7, 412);
          c.closePath();
          c.fill();
          c.restore();
        });
        c.globalAlpha = after(0.25);
        drawGenreAvatar(c, d, W / 2, 640, 48, col, 4);
        c.textAlign = 'center';
        c.fillStyle = '#ffffff';
        kLine(c, `${name} ${d.title}`, W / 2, 728, W - 80, 28, 18, fk);
        c.fillStyle = 'rgba(255,255,255,0.6)';
        gDrawLine(c, d.branch || '', W / 2, 756, W - 80, 14, 10, GENRE_FONTS.sans, 600);
        c.globalAlpha = 1;
        ctaButton(840, 64, 32, '#ff0033', '#ffffff');
        return;
      }
      if (O === 'bigname') {
        const g = c.createLinearGradient(0, 200, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0.15)');
        g.addColorStop(1, 'rgba(0,0,0,0.94)');
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.globalAlpha = a;
        drawGenreAvatar(c, d, 64, 470, 36, col, 3);
        c.textAlign = 'left';
        c.fillStyle = col;
        kLine(c, `${d.title} · ${veh}`, 30, 560, W - 60, 24, 15, fk);
        c.globalAlpha = 1;
        c.save();
        c.beginPath();
        c.rect(0, 560, W, 150);
        c.clip();
        c.fillStyle = '#ffffff';
        kLine(c, name, 26, 690 + (1 - gEase(local / 0.5)) * 140, W - 52, 118, 50, fk);
        c.restore();
        c.globalAlpha = after(0.2);
        c.fillStyle = 'rgba(255,255,255,0.75)';
        gDrawLine(c, d.branch || '', 30, 738, W - 60, 17, 12, GENRE_FONTS.sans, 600);
        c.fillStyle = '#ffffff';
        gDrawLine(c, `${disc}${promo ? ' · ' + promo : ''}`, 30, 772, W - 60, 18, 12, GENRE_FONTS.sans, 700);
        c.globalAlpha = after(0.35);
        c.fillStyle = col;
        kLine(c, `${cta}  →`, 30, 850, W - 60, 34, 20, fk);
        c.fillRect(30, 866, (W - 60) * after(0.45), 4);
        c.globalAlpha = 1;
        return;
      }
      if (O === 'card') {
        c.fillStyle = 'rgba(0,0,0,0.55)';
        c.fillRect(0, 0, W, H);
        c.save();
        c.translate(W / 2, 470);
        c.scale(e, e);
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 40;
        gRoundRect(c, -220, -290, 440, 560, 30);
        c.fillStyle = '#ffffff';
        c.fill();
        c.shadowColor = 'transparent';
        drawGenreAvatar(c, d, 0, -170, 70, col, 5);
        c.fillStyle = '#111111';
        kLine(c, name, 0, -40, 380, 46, 26, fk);
        c.fillStyle = gReadableAccent(col, true);
        gDrawLine(c, d.title, 0, -6, 380, 20, 14, GENRE_FONTS.sans, 800);
        c.fillStyle = '#666666';
        gDrawLine(c, d.branch || '', 0, 22, 380, 15, 11, GENRE_FONTS.sans, 600);
        c.fillStyle = '#eeeeee';
        c.fillRect(-170, 48, 340, 2);
        c.fillStyle = gReadableAccent(col, true);
        kLine(c, disc, 0, 104, 380, 38, 22, fk);
        c.fillStyle = '#666666';
        gDrawLine(c, promo || veh, 0, 136, 380, 15, 11, GENRE_FONTS.sans, 600);
        gRoundRect(c, -180, 170, 360, 66, 33);
        c.fillStyle = gReadableAccent(col, true);
        c.fill();
        c.fillStyle = '#ffffff';
        c.textBaseline = 'middle';
        kLine(c, cta, 0, 205, 320, 26, 16, fk);
        c.textBaseline = 'alphabetic';
        c.restore();
        return;
      }
      if (O === 'ticket') {
        c.fillStyle = 'rgba(0,0,0,0.6)';
        c.fillRect(0, 0, W, H);
        c.save();
        c.translate(W / 2, 470 + (1 - gEase(local / 0.5)) * 600);
        gRoundRect(c, -210, -330, 420, 660, 22);
        c.fillStyle = '#ffffff';
        c.fill();
        c.fillStyle = col;
        gRoundRect(c, -210, -330, 420, 90, 22);
        c.fill();
        c.fillRect(-210, -270, 420, 30);
        c.fillStyle = colText;
        c.textAlign = 'left';
        c.font = gFont(800, 14, GENRE_FONTS.mono);
        c.fillText('BOARDING PASS', -184, -294);
        c.textAlign = 'right';
        c.fillText(K.label, 184, -294);
        c.textAlign = 'left';
        c.fillStyle = '#888888';
        c.font = gFont(600, 12, GENRE_FONTS.mono);
        c.fillText('FROM', -184, -196);
        c.fillText('TO', 60, -196);
        c.fillStyle = '#111111';
        kLine(c, '상담', -184, -150, 180, 42, 24, fk);
        kLine(c, '출고', 60, -150, 140, 42, 24, fk);
        c.fillStyle = gReadableAccent(col, true);
        c.font = gFont(800, 22, GENRE_FONTS.sans);
        c.fillText('✈', -16, -158);
        const field = (lab, val, x, y, w) => {
          c.fillStyle = '#888888';
          c.font = gFont(600, 11, GENRE_FONTS.mono);
          c.fillText(lab, x, y);
          c.fillStyle = '#111111';
          gDrawLine(c, val, x, y + 26, w, 19, 12, GENRE_FONTS.sans, 800);
        };
        field('PASSENGER · 담당', `${name} ${d.title}`, -184, -100, 368);
        field('VEHICLE · 차종', veh, -184, -40, 368);
        field('GATE · 지점', d.branch || '-', -184, 20, 368);
        field('BENEFIT · 혜택', disc, -184, 80, 368);
        // 절취선과 양쪽 홈
        c.fillStyle = 'rgba(0,0,0,0.6)';
        c.beginPath();
        c.arc(-210, 150, 18, 0, Math.PI * 2);
        c.arc(210, 150, 18, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#cccccc';
        c.setLineDash([7, 6]);
        c.beginPath();
        c.moveTo(-180, 150);
        c.lineTo(180, 150);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = '#111111';
        for (let i = 0; i < 46; i++) {
          const w = (gHash('bc' + i) % 3) + 1;
          c.fillRect(-184 + i * 8, 186, w * 1.6, 54);
        }
        c.fillStyle = gReadableAccent(col, true);
        c.textAlign = 'center';
        kLine(c, cta, 0, 292, 380, 26, 16, fk);
        c.restore();
        return;
      }
      if (O === 'badge') {
        c.fillStyle = 'rgba(0,0,0,0.62)';
        c.fillRect(0, 0, W, H);
        const sw = 0.32 * Math.exp(-lt * 2.2) * Math.sin(lt * 8);
        c.save();
        c.translate(W / 2, -20);
        c.rotate(sw);
        c.fillStyle = col;
        c.beginPath();
        c.moveTo(-60, 0);
        c.lineTo(-14, 236);
        c.lineTo(14, 236);
        c.lineTo(60, 0);
        c.lineTo(42, 0);
        c.lineTo(0, 210);
        c.lineTo(-42, 0);
        c.closePath();
        c.fill();
        c.fillStyle = '#9ca3af';
        gRoundRect(c, -22, 226, 44, 34, 6);
        c.fill();
        c.translate(0, 250);
        c.shadowColor = 'rgba(0,0,0,0.4)';
        c.shadowBlur = 30;
        gRoundRect(c, -170, 0, 340, 480, 22);
        c.fillStyle = '#ffffff';
        c.fill();
        c.shadowColor = 'transparent';
        c.fillStyle = col;
        gRoundRect(c, -170, 0, 340, 130, 22);
        c.fill();
        c.fillRect(-170, 100, 340, 30);
        c.fillStyle = '#ffffff';
        gRoundRect(c, -40, 20, 80, 14, 7);
        c.fill();
        c.fillStyle = colText;
        c.textAlign = 'center';
        c.font = gFont(900, 16, GENRE_FONTS.sans);
        c.fillText(K.label, 0, 80);
        kitAvatarRect(c, d, -70, 100, 140, 160, gMix(col, -0.2));
        c.strokeStyle = '#ffffff';
        c.lineWidth = 6;
        c.strokeRect(-70, 100, 140, 160);
        c.fillStyle = '#111111';
        kLine(c, name, 0, 316, 300, 42, 24, fk);
        c.fillStyle = gReadableAccent(col, true);
        gDrawLine(c, d.title, 0, 346, 300, 18, 12, GENRE_FONTS.sans, 800);
        c.fillStyle = '#666666';
        gDrawLine(c, d.branch || '', 0, 374, 300, 14, 10, GENRE_FONTS.sans, 600);
        gDrawLine(c, `${veh} · ${disc}`, 0, 404, 300, 14, 10, GENRE_FONTS.sans, 700);
        c.fillStyle = '#111111';
        for (let i = 0; i < 30; i++) c.fillRect(-120 + i * 8, 424, (gHash('id' + i) % 3) + 1.5, 32);
        c.restore();
        ctaButton(880, 62, 31, col, colText);
        return;
      }
      if (O === 'receipt') {
        c.fillStyle = 'rgba(0,0,0,0.55)';
        c.fillRect(0, 0, W, H);
        const y0 = 90 + (1 - gEase(local / 0.6)) * 820;
        const x0 = 70;
        const w = 400;
        const h = 700;
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 24;
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x0 + w, y0);
        c.lineTo(x0 + w, y0 + h);
        for (let x = x0 + w; x > x0; x -= 20) {
          c.lineTo(x - 10, y0 + h + 10);
          c.lineTo(x - 20, y0 + h);
        }
        c.closePath();
        c.fillStyle = '#fbfbf8';
        c.fill();
        c.restore();
        const mono = (txt, x, y, size, weight, align, color) => {
          c.font = gFont(weight, size, GENRE_FONTS.mono);
          c.textAlign = align;
          c.fillStyle = color || '#222222';
          c.fillText(txt, x, y);
        };
        mono('*** 견 적 영 수 증 ***', W / 2, y0 + 54, 18, 800, 'center');
        mono(K.label, W / 2, y0 + 80, 12, 500, 'center', '#777777');
        const dash = (y) => {
          c.strokeStyle = '#999999';
          c.setLineDash([4, 4]);
          c.beginPath();
          c.moveTo(x0 + 24, y);
          c.lineTo(x0 + w - 24, y);
          c.stroke();
          c.setLineDash([]);
        };
        dash(y0 + 100);
        const row = (lab, val, y) => {
          mono(lab, x0 + 28, y, 14, 600, 'left', '#666666');
          c.textAlign = 'right';
          c.fillStyle = '#111111';
          gDrawLine(c, val, x0 + w - 28, y, 250, 15, 10, GENRE_FONTS.sans, 800);
        };
        row('차종', veh, y0 + 140);
        row('담당', `${name} ${d.title}`, y0 + 180);
        row('지점', d.branch || '-', y0 + 220);
        row('혜택', promo || '-', y0 + 260);
        dash(y0 + 290);
        mono('TOTAL', x0 + 28, y0 + 346, 18, 800, 'left');
        c.textAlign = 'right';
        c.fillStyle = gReadableAccent(col, true);
        kLine(c, arPriceTag(), x0 + w - 28, y0 + 352, 240, 46, 26, fk === 'pen' ? 'impact' : fk);
        dash(y0 + 384);
        c.fillStyle = '#111111';
        for (let i = 0; i < 44; i++) c.fillRect(x0 + 30 + i * 7.9, y0 + 410, (gHash('rc' + i) % 3) + 1.2, 70);
        mono('THANK YOU · AUTO REELS', W / 2, y0 + 508, 12, 500, 'center', '#777777');
        gRoundRect(c, x0 + 24, y0 + 560, w - 48, 70, 6);
        c.fillStyle = gReadableAccent(col, true);
        c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        kLine(c, cta, W / 2, y0 + 597, w - 80, 26, 16, fk);
        c.textBaseline = 'alphabetic';
        return;
      }
      if (O === 'chat') {
        const dark = !K.light;
        c.fillStyle = dark ? '#0e0e12' : '#eef0f3';
        c.fillRect(0, 0, W, H);
        c.globalAlpha = a;
        c.fillStyle = dark ? '#18181d' : '#ffffff';
        c.fillRect(0, 0, W, 120);
        drawGenreAvatar(c, d, 56, 70, 28, col, 2);
        c.textAlign = 'left';
        c.fillStyle = dark ? '#ffffff' : '#111111';
        gDrawLine(c, `${name} ${d.title}`, 98, 66, 360, 21, 14, GENRE_FONTS.sans, 800);
        c.fillStyle = '#22c55e';
        c.beginPath();
        c.arc(104, 88, 5, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = dark ? '#9ca3af' : '#6b7280';
        gDrawLine(c, `지금 상담 가능 · ${d.branch || ''}`, 116, 93, 340, 13, 10, GENRE_FONTS.sans, 600);
        c.globalAlpha = 1;
        const bubble = (txt, y, right, k, fill, ink, size) => {
          const p = gBack((lt - k) / 0.35);
          if (p <= 0.01) return;
          c.save();
          c.font = kFont(fk, size || 24);
          const r = kWrap(c, txt, 330, 2, size || 24, 16, fk);
          let mw = 0;
          r.lines.forEach((ln) => (mw = Math.max(mw, c.measureText(ln).width)));
          const bw = mw + 40;
          const bh = r.lines.length * r.lh + 26;
          const x = right ? W - 30 - bw : 30;
          c.translate(x + (right ? bw : 0), y);
          c.scale(p, p);
          gRoundRect(c, right ? -bw : 0, 0, bw, bh, 22);
          c.fillStyle = fill;
          c.fill();
          c.fillStyle = ink;
          c.textAlign = 'left';
          r.lines.forEach((ln, i) => c.fillText(ln, (right ? -bw : 0) + 20, 13 + r.lh * (i + 0.8)));
          c.restore();
        };
        const other = dark ? '#26262d' : '#ffffff';
        const otherInk = dark ? '#ffffff' : '#111111';
        bubble(`안녕하세요, ${name} ${d.title}입니다`, 170, false, 0.05, other, otherInk);
        bubble(`${veh} ${disc}`, 270, false, 0.45, col, colText, 28);
        if (promo) bubble(promo, 380, false, 0.85, other, otherInk);
        bubble(IND.chatAsk, promo ? 480 : 380, true, 1.25, dark ? '#3b3b44' : '#dbeafe', otherInk);
        bubble(`네! 댓글에 [${IND.cta}]만 남겨주세요`, promo ? 580 : 480, false, 1.7, other, otherInk);
        c.globalAlpha = a;
        gRoundRect(c, 20, 850, W - 110, 60, 30);
        c.fillStyle = dark ? '#1c1c22' : '#ffffff';
        c.fill();
        c.fillStyle = dark ? '#9ca3af' : '#9ca3af';
        c.textAlign = 'left';
        gDrawLine(c, `[${IND.cta}] 입력…`, 46, 888, 300, 18, 12, GENRE_FONTS.sans, 600);
        c.fillStyle = col;
        c.beginPath();
        c.arc(W - 52, 880, 30, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = colText;
        c.textAlign = 'center';
        c.font = gFont(900, 26, GENRE_FONTS.sans);
        c.fillText('↑', W - 52, 890);
        c.globalAlpha = 1;
        return;
      }
      if (O === 'split') {
        const top = H - (H - 470) * gEase(local / 0.5);
        c.fillStyle = col;
        c.fillRect(0, top, W, H - top);
        c.save();
        c.beginPath();
        c.rect(0, top, W, H - top);
        c.clip();
        const off = top - 470;
        c.fillStyle = colText;
        c.textAlign = 'left';
        kLine(c, `${d.title} · ${d.branch || ''}`, 30, 530 + off, W - 60, 20, 13, fk);
        const nm = name.length > 3 ? [name] : [name];
        nm.forEach((ln, i) => kLine(c, ln, 26, 640 + off + i * 100, W - 52, 112, 50, fk));
        c.globalAlpha = 0.85;
        gDrawLine(c, `${veh} · ${disc}`, 30, 690 + off, W - 60, 19, 12, GENRE_FONTS.sans, 700);
        c.globalAlpha = 1;
        c.strokeStyle = colText;
        c.lineWidth = 3;
        gRoundRect(c, 30, 760 + off, W - 60, 78, 4);
        c.stroke();
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        kLine(c, cta, W / 2, 800 + off, W - 100, 30, 18, fk);
        c.textBaseline = 'alphabetic';
        c.restore();
        drawGenreAvatar(c, d, W - 80, top - 10, 52 * gEase(local / 0.6), '#ffffff', 5);
        return;
      }
      if (O === 'ring') {
        c.fillStyle = 'rgba(0,0,0,0.78)';
        c.fillRect(0, 0, W, H);
        c.save();
        c.translate(W / 2, 360);
        c.scale(e, e);
        drawGenreAvatar(c, d, 0, 0, 110, col, 4);
        c.rotate(t * 0.5);
        const ring = (cta + ' · ').repeat(2);
        const chars = Array.from(ring);
        c.fillStyle = '#ffffff';
        c.font = gFont(800, 18, GENRE_FONTS.sans);
        c.textAlign = 'center';
        chars.forEach((ch, i) => {
          c.save();
          c.rotate((i / chars.length) * Math.PI * 2);
          c.fillText(ch, 0, -146);
          c.restore();
        });
        c.restore();
        c.globalAlpha = after(0.2);
        c.textAlign = 'center';
        c.fillStyle = '#ffffff';
        kLine(c, name, W / 2, 610, W - 80, 52, 28, fk);
        c.fillStyle = col;
        gDrawLine(c, d.title, W / 2, 646, W - 80, 20, 14, GENRE_FONTS.sans, 800);
        c.fillStyle = 'rgba(255,255,255,0.7)';
        gDrawLine(c, d.branch || '', W / 2, 676, W - 80, 15, 11, GENRE_FONTS.sans, 600);
        c.fillStyle = '#ffffff';
        kLine(c, disc, W / 2, 740, W - 80, 34, 20, fk);
        c.globalAlpha = 1;
        ctaButton(840, 64, 32, col, colText);
        return;
      }
      if (O === 'polaroid') {
        c.fillStyle = '#f3eee3';
        c.fillRect(0, 0, W, H);
        c.save();
        c.translate(W / 2, 360 - (1 - gBack(local / 0.55)) * 700);
        c.rotate(-0.06);
        c.shadowColor = 'rgba(0,0,0,0.3)';
        c.shadowBlur = 26;
        c.shadowOffsetY = 10;
        c.fillStyle = '#ffffff';
        c.fillRect(-180, -230, 360, 440);
        c.shadowColor = 'transparent';
        kitAvatarRect(c, d, -160, -210, 320, 320, col);
        c.fillStyle = '#2b2b2b';
        c.textAlign = 'center';
        kLine(c, `${name} ${d.title}`, 0, 172, 320, 40, 24, 'pen');
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.rotate(0.3);
        c.fillRect(-40, -260, 110, 30);
        c.restore();
        c.globalAlpha = after(0.25);
        c.fillStyle = '#333333';
        c.textAlign = 'center';
        kLine(c, `${d.branch || ''} · ${veh}`, W / 2, 680, W - 80, 30, 20, 'pen');
        c.fillStyle = gReadableAccent(col, true);
        kLine(c, disc, W / 2, 740, W - 80, 46, 28, 'pen');
        c.globalAlpha = after(0.4);
        c.fillStyle = '#111111';
        kLine(c, cta, W / 2, 840, W - 80, 42, 26, 'pen');
        c.strokeStyle = gReadableAccent(col, true);
        c.lineWidth = 4;
        c.beginPath();
        for (let x = 80; x <= 80 + 380 * after(0.5); x += 6) c.lineTo(x, 860 + Math.sin(x / 9) * 4);
        c.stroke();
        c.globalAlpha = 1;
        return;
      }
      if (O === 'news') {
        c.fillStyle = 'rgba(0,0,0,0.7)';
        c.fillRect(0, 0, W, H);
        c.save();
        const s = gEase(local / 0.6);
        c.translate(W / 2, H / 2);
        c.rotate((1 - s) * Math.PI * 4);
        c.scale(0.2 + 0.8 * s, 0.2 + 0.8 * s);
        c.translate(-W / 2, -H / 2);
        c.fillStyle = '#f4f1ea';
        c.fillRect(14, 24, W - 28, H - 48);
        c.fillStyle = '#111111';
        c.textAlign = 'center';
        c.font = gFont(900, 52, GENRE_FONTS.serif);
        c.fillText('AUTO DAILY', W / 2, 96);
        c.fillRect(34, 114, W - 68, 3);
        c.fillRect(34, 120, W - 68, 1);
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.fillStyle = '#555555';
        c.fillText(`특별판 · ${d.branch || ''}`, W / 2, 140);
        c.fillStyle = '#111111';
        const r = kWrap(c, `${name} ${d.title}, ${veh} ${disc}`, W - 80, 3, 40, 24, 'serif');
        c.textAlign = 'left';
        r.lines.forEach((ln, i) => c.fillText(ln, 40, 190 + r.lh * i));
        const py = 190 + r.lh * r.lines.length - 10;
        c.save();
        if ('filter' in c) c.filter = 'grayscale(1) contrast(1.1)';
        c.beginPath();
        c.rect(40, py, W - 80, 290);
        c.clip();
        kitCover(c, kitImg(S, 0), 40, py, W - 80, 290, 1.05, 0, 0);
        if ('filter' in c) c.filter = 'none';
        c.restore();
        c.fillStyle = '#666666';
        c.font = gFont(500, 11, GENRE_FONTS.sans);
        c.fillText(`▲ ${veh}`, 40, py + 308);
        c.fillStyle = 'rgba(0,0,0,0.18)';
        for (let i = 0; i < 6; i++) {
          c.fillRect(40, py + 330 + i * 14, 210 - (i === 5 ? 80 : 0), 6);
          c.fillRect(290, py + 330 + i * 14, 210 - (i === 5 ? 60 : 0), 6);
        }
        c.fillStyle = '#111111';
        c.fillRect(34, 840, W - 68, 70);
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        kLine(c, cta, W / 2, 876, W - 110, 26, 16, 'serif');
        c.textBaseline = 'alphabetic';
        c.restore();
        return;
      }
      if (O === 'neon') {
        c.fillStyle = '#140d0e';
        c.fillRect(0, 0, W, H);
        c.strokeStyle = 'rgba(255,255,255,0.05)';
        c.lineWidth = 2;
        for (let y = 0, r = 0; y < H; y += 36, r++) {
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(W, y);
          c.stroke();
          for (let x = (r % 2) * 40; x < W; x += 80) {
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x, y + 36);
            c.stroke();
          }
        }
        const on = lt > 0.15 && !(lt > 0.3 && lt < 0.38);
        const glow = (fn, color, blur) => {
          c.save();
          c.globalAlpha = on ? 1 : 0.2;
          c.shadowColor = color;
          c.shadowBlur = blur;
          fn();
          c.restore();
        };
        c.textAlign = 'center';
        glow(() => {
          c.fillStyle = V.accent2;
          gDrawLine(c, `${d.title} · ${d.branch || ''}`, W / 2, 300, W - 80, 22, 14, GENRE_FONTS.sans, 700);
        }, V.accent2, 16);
        glow(() => {
          const F = KIT_FONTS[fk] || KIT_FONTS.sans;
          const f = gFitLine(c, name, W - 70, Math.round(100 * F.k), Math.round(50 * F.k), F.f, F.w);
          c.font = gFont(F.w, f.size, F.f);
          c.save();
          c.fillStyle = col;
          c.globalAlpha = 0.72;
          c.fillText(f.text, W / 2, 440);
          c.restore();
          c.shadowBlur = 14;
          c.fillStyle = '#ffffff';
          c.fillText(f.text, W / 2, 440);
        }, col, 34);
        glow(() => {
          c.fillStyle = '#ffffff';
          kLine(c, disc, W / 2, 560, W - 80, 40, 24, fk);
        }, col, 20);
        glow(() => {
          c.strokeStyle = col;
          c.lineWidth = 4;
          gRoundRect(c, 50, 760, W - 100, 86, 43);
          c.stroke();
          c.fillStyle = '#ffffff';
          c.textBaseline = 'middle';
          kLine(c, cta, W / 2, 805, W - 140, 30, 18, fk);
          c.textBaseline = 'alphabetic';
        }, col, 26);
        c.save();
        c.globalAlpha = after(0.3);
        drawGenreAvatar(c, d, W / 2, 660, 44, col, 3);
        c.restore();
        return;
      }
      // minimal
      const mbg = K.bgAccent || K.light ? K.bg : '#0c0c10';
      c.fillStyle = mbg;
      c.fillRect(0, 0, W, H);
      const ink = kTextOn(mbg);
      const lift = (1 - a) * 24;
      c.globalAlpha = a;
      c.strokeStyle = ink;
      c.globalAlpha = a * 0.4;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(60, 200);
      c.lineTo(W - 60, 200);
      c.moveTo(60, 780);
      c.lineTo(W - 60, 780);
      c.stroke();
      c.globalAlpha = a;
      drawGenreAvatar(c, d, W / 2, 330 + lift, 46, null, 0);
      c.fillStyle = ink;
      c.textAlign = 'center';
      c.font = gFont(600, 13, GENRE_FONTS.sans);
      c.fillText(d.title.split('').join(' '), W / 2, 418 + lift);
      kLine(c, name, W / 2, 476 + lift, W - 120, 42, 26, fk);
      c.globalAlpha = a * 0.65;
      gDrawLine(c, d.branch || '', W / 2, 512 + lift, W - 120, 15, 11, GENRE_FONTS.sans, 500);
      c.globalAlpha = after(0.2);
      c.fillStyle = col === K.bg ? ink : col;
      c.fillRect(W / 2 - 20, 552, 40, 2);
      c.fillStyle = ink;
      gDrawLine(c, `${veh} · ${disc}`, W / 2, 600, W - 120, 17, 12, GENRE_FONTS.sans, 600);
      c.globalAlpha = after(0.35);
      kLine(c, cta, W / 2, 700, W - 120, 24, 16, fk);
      c.fillRect(W / 2 - 110 * after(0.45), 716, 220 * after(0.45), 1.5);
      c.globalAlpha = 1;
    }

    // ---------- 키트 디자인 한 프레임 ----------
    function kitContext(spec, V) {
      const bgMap = { dark: '#0c0c10', ink: '#111827', paper: '#f3eee3', white: '#ffffff', cream: '#fbfaf4', chalk: '#1f3b2d', accent: V.accent };
      const bg = bgMap[spec.bg || 'dark'] || '#0c0c10';
      const light = gLuminance(bg) > 0.4;
      const bgAccent = spec.bg === 'accent';
      const hl = bgAccent ? (light ? '#111111' : '#ffffff') : V.accent;
      return { bg, light, bgAccent, hl, ink: light ? '#111111' : '#ffffff', label: spec.label || V.label };
    }
    function kitAutoCutLayout(spec, cutIdx) {
      if (cutIdx === 0) return spec.layout;
      // 업종 디자인: 컷이 바뀌어도 사진을 꽉 채운 레이아웃끼리만 돌림 (위 사진·아래 글자 나눔형이 섞이지 않게, 2026-11)
      if (spec.industry) {
        if (!['full', 'dim', 'blinds'].includes(spec.layout)) return spec.layout;
        return ['full', 'blinds', 'dim', 'full'][cutIdx % 4];
      }
      const fixedLayouts = ['chalkboard', 'notebook', 'polaroid', 'film', 'handheld'];
      if (fixedLayouts.includes(spec.layout)) {
        return cutIdx === 2 ? 'duo' : spec.layout;
      }
      const rotMap = {
        full: ['full', 'diag', 'duo', 'split'],
        dim: ['dim', 'split', 'cards', 'duo'],
        split: ['split', 'duo', 'diag', 'cards'],
        diag: ['diag', 'duo', 'split', 'grid'],
        circle: ['circle', 'diag', 'grid', 'duo'],
        cards: ['cards', 'duo', 'diag', 'split'],
        grid: ['grid', 'split', 'diag', 'duo'],
        duo: ['duo', 'diag', 'split', 'cards'],
        arch: ['arch', 'split', 'duo', 'full'],
        mat: ['mat', 'split', 'duo', 'cards'],
        blinds: ['blinds', 'diag', 'duo', 'split'],
        poster: ['poster', 'duo', 'diag', 'split']
      };
      const seq = rotMap[spec.layout] || ['full', 'diag', 'duo', 'split'];
      return seq[cutIdx % seq.length];
    }

    function kitRichGraphics(c, W, H, t, cutIdx, totalCuts, S, spec, V, K) {
      const col = (K && K.bgAccent) ? (K.hl || '#ffffff') : (V && V.accent) || '#facc15';
      const col2 = (V && V.accent2) || '#ffffff';
      const p = Math.min(1, Math.max(0, S ? S.p : 0.5));
      const pop = gEase(Math.min(1, p * 2.6));
      c.save();

      // 1) 상단 인스타 릴스형 진행 게이지 바 (깔끔하게 최상단 12px)
      const progW = W - 48;
      const segW = progW / Math.max(1, totalCuts);
      for (let i = 0; i < totalCuts; i++) {
        const sx = 24 + i * segW;
        c.fillStyle = 'rgba(255,255,255,0.2)';
        c.fillRect(sx, 12, segW - 5, 3);
        if (i < cutIdx) {
          c.fillStyle = col;
          c.fillRect(sx, 12, segW - 5, 3);
        } else if (i === cutIdx) {
          c.fillStyle = col;
          c.fillRect(sx, 12, (segW - 5) * p, 3);
        }
      }

      // 2) 사선 레이아웃일 때만 경계선 그래픽 액센트
      if (spec.layout === 'diag') {
        c.save();
        c.strokeStyle = col;
        c.lineWidth = 4;
        c.globalAlpha = 0.85 * pop;
        c.beginPath();
        c.moveTo(0, 640);
        c.lineTo(W * pop, 640 - 110 * pop);
        c.stroke();
        c.restore();
      }

      // 3) 모션 도형 / 트렌드 테마 전용: 사선/콜라주 위 상단 여백에만 깔끔한 미니 태그 표시
      const isMotionTheme = spec.deco === 'shapes' || spec.isTrend;
      if (false && isMotionTheme && spec.layout === 'duo' && cutIdx % 2 === 1) {
        c.save();
        c.translate(W / 2, 480);
        c.fillStyle = 'rgba(12,12,16,0.9)';
        c.fillRect(-W * 0.5, -12, W, 24);
        c.strokeStyle = col;
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(-W * 0.5, -12); c.lineTo(W * 0.5, -12);
        c.moveTo(-W * 0.5, 12); c.lineTo(W * 0.5, 12);
        c.stroke();
        const ticker = `★ ${spec.label || 'TREND'}  ·  POINT 0${cutIdx + 1}  ·  `;
        c.font = '800 11px "Pretendard Variable", sans-serif';
        c.fillStyle = col2;
        c.textAlign = 'left';
        const tw = Math.max(160, c.measureText(ticker).width);
        const offset = -((t * 90) % tw);
        for (let x = offset - tw; x < W * 0.6; x += tw) {
          c.fillText(ticker, x - W * 0.5, 4);
        }
        c.restore();
      }

      c.restore();
    }

    function renderKitFrame(c, W, H, t, mainDuration, totalCuts, d, spec, V) {
      const cutDur = mainDuration / totalCuts;
      if (t < mainDuration) {
        const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
        const cutPlan = (typeof campaign !== 'undefined' && Array.isArray(campaign.scenePlan) && campaign.scenePlan[cutIdx]) || {};
        const autoLayout = kitAutoCutLayout(spec, cutIdx);
        const kineticCaps = ['words', 'stack', 'slam', 'marquee', 'longshadow'];
        const allowKineticCap = spec.deco === 'shapes' || spec.cat === '타이포' || spec.cat === '스포츠' || spec.isTrend;
        const autoCap = (cutIdx === 2 && allowKineticCap && !kineticCaps.includes(spec.cap)) ? 'words' : spec.cap;
        const cutSpec = Object.assign({}, spec, {
          layout: cutPlan.customLayout || autoLayout,
          cap: cutPlan.customCap || autoCap,
          deco: cutPlan.customDeco || spec.deco
        });
        const K = kitContext(cutSpec, V);
        K.dealer = d;
        const S = kitScene(t, mainDuration, false);
        const zone = kitLayout(c, W, H, t, S, cutSpec, V, K);
        kitDeco(c, W, H, t, cutSpec, V, K, 'under');
        kitRichGraphics(c, W, H, t, cutIdx, totalCuts, S, cutSpec, V, K);
        const localSec = t - cutIdx * cutDur;
        const raw = (campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || campaign.hook || '';
        const caption = gCleanCaption(raw);
        const e = Math.min(1, localSec / 1.2);
        let z = zone;
        if (gIsPriceCut(raw)) {
          const shift = kitPrice(c, W, zone, cutSpec, V, K, e);
          if (shift) z = Object.assign({}, zone, { y: zone.y + shift, h: zone.h - shift });
        }
        kitCaption(c, W, H, t, z, caption, cutSpec, V, K, e, cutIdx, S, Math.min(1, localSec / cutDur));
        kitHead(c, W, t, cutSpec, V, K, S, cutIdx, totalCuts, cutDur);
        kitChip(c, d, W, H, cutSpec, V, K, gEase(t / 0.6));
        kitDeco(c, W, H, t, cutSpec, V, K, 'over');
      } else {
        const K = kitContext(spec, V);
        K.dealer = d;
        syncCutVideos(-1, 0);
        const S = kitScene(t, mainDuration, true);
        kitPhoto(c, { x: 0, y: 0, w: W, h: H }, S, spec, { still: true });
        const local = Math.min(1, (t - mainDuration) / 1.2);
        kitOutro(c, W, H, t, local, t - mainDuration, spec, V, K, d, S);
        if (spec.deco === 'grain' || spec.deco === 'sparkle' || spec.deco === 'confetti') kitDeco(c, W, H, t, spec, V, K, 'over');
      }
    }

    // ---------- 키트 디자인 40종 (모션 도형 10종 + 핵심·인기 스타일 30종) ----------
    //   [id, 이름, 묶음, 사진배치, 자막, 글꼴, 장식, 전환, 명함, 색보정, 머리표, 바탕, 라벨, 기본색, 보조색]
    const KIT_ROWS = [
      // 모션 도형 10종 (도형 전환 + 움직이는 도형 그래픽)
      ['g_iris', '원형 아이리스', '고급', 'full', 'pill', 'dohyeon', 'shapes', 'iris', 'ring', 'vivid', 'pill', 'dark', '모션 릴스', '#facc15', '#ffffff'],
      ['g_diamond', '다이아몬드 컷', '고급', 'full', 'words', 'impact', 'shapes', 'diamond', 'bigname', 'vivid', 'counter', 'dark', 'FOCUS', '#38bdf8', '#e0f2fe'],
      ['g_hex', '육각 줌인', '테크', 'full', 'neon', 'gugi', 'shapes', 'hex', 'neon', 'noir', 'box', 'dark', 'HEXAGON', '#a855f7', '#f0abfc'],
      ['g_blocks', '도형 블록 스윕', '스포츠', 'split', 'band', 'dohyeon', 'shapes', 'barswipe', 'split', 'vivid', 'pill', 'dark', '오늘의 픽', '#ec4899', '#fde047'],
      ['g_ringpop', '링 팝 릴스', '재미', 'circle', 'glass', 'sans', 'shapes', 'iris', 'ring', 'cool', 'kicker', 'ink', 'SPOTLIGHT', '#22d3ee', '#e0f2fe'],
      ['g_diagshape', '사선 도형 컷', '스포츠', 'diag', 'outline', 'impact', 'shapes', 'diamond', 'badge', 'sports', 'counter', 'dark', 'TREND', '#ef4444', '#ffffff'],
      ['g_cardhex', '카드 육각 전환', '상담·정보', 'cards', 'checkl', 'sans', 'shapes', 'hex', 'card', 'none', 'counter', 'white', '핵심 포인트', '#2563eb', '#dbeafe'],
      ['g_duosweep', '비교 블록 전환', '특가', 'duo', 'pill', 'jua', 'shapes', 'barswipe', 'ticket', 'vivid', 'box', 'dark', 'BEFORE / AFTER', '#22c55e', '#dcfce7'],
      ['g_archiris', '아치 아이리스', '감성', 'arch', 'cinema', 'serif', 'shapes', 'iris', 'minimal', 'warm', 'kicker', 'paper', 'ATELIER', '#d97706', '#fef3c7'],
      ['g_griddia', '그리드 다이아', '브이로그', 'grid', 'words', 'jua', 'shapes', 'diamond', 'polaroid', 'pastel', 'pill', 'white', 'BEST 4', '#f43f5e', '#ffe4e6'],

      // 특가 · 재미 · 뉴스
      ['k_redband', '레드 띠지', '특가', 'full', 'band', 'impact', 'dots', 'zoom', 'ticket', 'vivid', 'pill', 'dark', '오늘만 특가', '#ef4444', '#facc15'],
      ['s_shoplive', '쇼핑 라이브', '특가', 'split', 'pill', 'jua', 'sparkle', 'slide', 'ticket', 'vivid', 'pill', 'accent', '라이브 특가', '#ec4899', '#fde047'],
      ['d_coupon', '사선 쿠폰', '특가', 'diag', 'ticket', 'dohyeon', 'dots', 'zoom', 'ticket', 'vivid', 'pill', 'ink', '쿠폰 지급', '#f97316', '#fde68a'],
      ['b_sale', '블라인드 특가', '특가', 'blinds', 'band', 'dohyeon', 'dots', 'blinds', 'ticket', 'sale', 'pill', 'dark', '오픈 특가', '#f97316', '#fde047'],
      ['k_neonnight', '네온 나이트', '재미', 'full', 'neon', 'dohyeon', 'grain', 'glitch', 'neon', 'noir', 'box', 'dark', 'NIGHT MOOD', '#f472b6', '#a78bfa'],
      ['k_popbubble', '팝 말풍선', '재미', 'full', 'bubble', 'jua', 'confetti', 'drop', 'chat', 'vivid', 'counter', 'white', '이거 실화?', '#f59e0b', '#ffffff'],
      ['a_popart', '팝아트 액자', '재미', 'mat', 'words', 'jua', 'confetti', 'zoom', 'split', 'vivid', 'pill', 'accent', 'POP!', '#ec4899', '#fde047'],
      ['k_lowerthird', '방송 하단 자막', '뉴스·방송', 'full', 'lower3', 'sans', 'corners', 'slide', 'news', 'none', 'box', 'dark', 'LIVE', '#2563eb', '#dbeafe'],
      ['p_frontpage', '사진 기사', '뉴스·방송', 'polaroid', 'headline', 'serif', 'corners', 'slide', 'news', 'mono', 'counter', 'paper', '포토 뉴스', '#dc2626', '#111111'],

      // 고급 · 감성
      ['k_subtitle', '극장 자막', '고급', 'full', 'cinema', 'serif', 'bars', 'fade', 'minimal', 'film', 'kicker', 'dark', 'A FILM BY', '#f2c46d', '#ffffff'],
      ['s_magazine', '매거진 하프', '고급', 'split', 'headline', 'serif', 'none', 'wipe', 'news', 'mono', 'kicker', 'paper', 'MAGAZINE', '#b91c1c', '#111111'],
      ['a_gallery', '갤러리 액자', '고급', 'mat', 'vertical', 'serif', 'none', 'fade', 'minimal', 'mono', 'kicker', 'paper', 'EXHIBITION', '#78716c', '#e7e5e4'],
      ['r_window', '아치 윈도우', '고급', 'arch', 'cinema', 'serif', 'none', 'fade', 'minimal', 'warm', 'kicker', 'paper', 'MAISON', '#a16207', '#fef3c7'],
      ['m_strip', '필름 스트립', '고급', 'film', 'cinema', 'serif', 'grain', 'slide', 'polaroid', 'film', 'none', 'dark', 'FILM No.35', '#f2c46d', '#ffffff'],
      ['c_spotlight', '스포트라이트', '고급', 'circle', 'cinema', 'serif', 'sparkle', 'fade', 'ring', 'noir', 'kicker', 'dark', 'SPOTLIGHT', '#d4af37', '#ffffff'],
      ['p_diary', '폴라로이드 일기', '감성', 'polaroid', 'sticky', 'pen', 'leak', 'drop', 'polaroid', 'warm', 'none', 'paper', '오늘의 기록', '#fb923c', '#fed7aa'],
      ['g_fourcut', '네 컷 사진', '감성', 'grid', 'pill', 'jua', 'sparkle', 'flash', 'polaroid', 'pastel', 'none', 'white', '네컷', '#f9a8d4', '#fce7f3'],
      ['a_poster', '아트 포스터', '감성', 'mat', 'headline', 'serif', 'grain', 'wipe', 'news', 'film', 'box', 'paper', 'ART PRINT', '#b45309', '#fef3c7'],

      // 상담·정보 · 신뢰 · 스포츠 · 테크
      ['k_highlighter', '형광펜 정리', '상담·정보', 'full', 'marker', 'sans', 'none', 'wipe', 'card', 'none', 'pill', 'dark', '핵심 정리', '#facc15', '#fef9c3'],
      ['u_compare', '위아래 비교', '상담·정보', 'duo', 'band', 'sans', 'none', 'slide', 'split', 'none', 'counter', 'dark', 'BEFORE / AFTER', '#0ea5e9', '#e0f2fe'],
      ['k2_stack', '카드 스택', '상담·정보', 'cards', 'glass', 'sans', 'none', 'slide', 'card', 'none', 'pill', 'ink', '핵심 카드', '#6366f1', '#e0e7ff'],
      ['k_approved', '승인 도장', '신뢰', 'full', 'stamp', 'gugi', 'border', 'flash', 'badge', 'trust', 'kicker', 'dark', '승인 완료', '#dc2626', '#fee2e2'],
      ['g_check', '그리드 체크', '신뢰', 'grid', 'stamp', 'sans', 'corners', 'zoom', 'card', 'trust', 'box', 'white', '4면 점검', '#16a34a', '#dcfce7'],
      ['k_kinetic', '키네틱 타이포', '스포츠', 'full', 'words', 'impact', 'leak', 'flash', 'bigname', 'sports', 'counter', 'dark', 'GO', '#facc15', '#ffffff'],
      ['d_speed', '사선 스피드', '스포츠', 'diag', 'band', 'impact', 'none', 'slide', 'bigname', 'sports', 'counter', 'accent', 'SPEED', '#ef4444', '#ffffff'],
      ['s_datapanel', '데이터 패널', '테크', 'split', 'typer', 'mono', 'grid', 'glitch', 'receipt', 'ev', 'counter', 'ink', 'SYS.REPORT', '#22d3ee', '#a5f3fc'],

      // 손글씨 · 타이포 · 브이로그
      ['h_signature', '시그니처', '손글씨', 'mat', 'scriptkick', 'serif7', 'none', 'fade', 'signature', 'warm', 'kicker', 'paper', 'SIGNATURE', '#a16207', '#fef3c7', 'With care', 'greatvibes'],
      ['h_thankyou', '감사 카드', '손글씨', 'cards', 'notecard', 'serif7', 'none', 'slide', 'signature', 'none', 'none', 'paper', 'THANK YOU', '#9f1239', '#ffe4e6', 'Thank you', 'greatvibes'],
      ['t_stack', '빅 스택', '타이포', 'dim', 'stack', 'gasoek', 'none', 'flash', 'bigname', 'noir', 'counter', 'dark', 'BIG TYPE', '#facc15', '#ffffff'],
      ['t_inside', '글자 속 사진', '타이포', 'full', 'knockout', 'bagel', 'none', 'zoom', 'card', 'vivid', 'pill', 'dark', 'INSIDE', '#22d3ee', '#ffffff'],
      ['t_pop3d', '입체 팝', '타이포', 'poster', 'longshadow', 'bagel', 'dots', 'drop', 'chat', 'vivid', 'counter', 'accent', 'POP 3D', '#f97316', '#fde68a'],
      ['v_delivery', '일상 브이로그', '브이로그', 'handheld', 'vsub', 'sans', 'none', 'fade', 'vlogend', 'warm', 'profile', 'dark', '오늘의 브이로그', '#facc15', '#fef9c3'],
      ['v_camera', '카메라 앱', '브이로그', 'full', 'timestamp', 'sans', 'camera', 'slide', 'polaroid', 'none', 'none', 'dark', 'VLOG', '#facc15', '#ffffff']
    ];
    const KIT_PART_NAMES = {
      layout: { full: '전체 화면', split: '라운딩 카드', polaroid: '겹친 폴라로이드', film: '흐르는 필름', circle: '원형 렌즈', mat: '액자', diag: '사선 분할', cards: '겹친 카드', grid: '4분할 그리드', arch: '아치 창', blinds: '블라인드 전환', duo: '레이어드 콜라주', notebook: '공책', chalkboard: '칠판', dim: '어두운 사진 위 큰 글씨', poster: '타이포 포스터', handheld: '손에 든 카메라' },
      cap: { band: '기울어진 띠', glass: '유리 카드', typer: '타자기', outline: '외곽선 글씨', marker: '형광펜', bubble: '말풍선', sticky: '포스트잇', cinema: '영화 자막', neon: '네온사인', stamp: '도장', words: '단어 팝', vertical: '세로쓰기', ticket: '영수증 쪽지', pill: '알약 칩', headline: '신문 헤드라인', lower3: '방송 하단 자막', write: '써지는 손글씨', letter: '편지지 손글씨', chalk: '분필 글씨', scribble: '동그라미 손글씨', brush: '붓글씨', doodle: '낙서 손글씨', stack: '꽉 찬 단어 쌓기', scroll: '흐르는 타이포', slam: '한 단어씩 쾅', knockout: '글자 속 사진', marquee: '무한 띠 타이포', longshadow: '입체 글씨', vsub: '브이로그 자막', chapter: '챕터 카드', loctag: '위치 태그', checkl: '출고 체크리스트', timestamp: '날짜·시각 기록', scriptkick: '필기체 포인트', signline: '서명 밑줄', quotecard: '서명 인용', notecard: '고급 카드지' },
      outro: { bigname: '큰 이름', card: '흰 명함 카드', ticket: '탑승권', badge: '사원증', receipt: '견적 영수증', chat: '메신저 대화', split: '컬러 블록', ring: '회전 글씨 원', polaroid: '폴라로이드', news: '신문 1면', neon: '네온 간판', minimal: '미니멀', vlogend: '유튜브 끝 화면', signature: '서명 명함' }
    };
    const KIT_DESIGNS = KIT_ROWS.map((r, i) => ({
      id: r[0],
      name: r[1],
      cat: r[2],
      engine: 'kit',
      layout: r[3],
      cap: r[4],
      font: r[5],
      deco: r[6],
      trans: r[7],
      outro: r[8],
      grade: r[9],
      head: r[10],
      bg: r[11],
      label: r[12],
      accent: r[13],
      accent2: r[14],
      script: r[15] || '',
      sfont: r[16] || '',
      seed: i,
      genre: 'kit',
      desc: `${KIT_PART_NAMES.layout[r[3]]} · ${KIT_PART_NAMES.cap[r[4]]} 자막 · ${KIT_PART_NAMES.outro[r[8]]} 명함`
    }));
    const CLASSIC_CATS = { sale: '특가', luxury: '고급', ev: '테크', sports: '스포츠', finance: '상담·정보', trust: '신뢰' };
    DESIGN_STYLES.forEach((ds) => {
      ds.engine = 'genre';
      ds.cat = CLASSIC_CATS[ds.genre] || '특가';
    });
    DESIGN_STYLES.push(...KIT_DESIGNS);
    // 스타일 분류는 이 12개로 고정: 새 스타일을 추가할 때 분류를 새로 만들지 말고 아래 중 하나에 넣을 것
    const DESIGN_CATS = ['전체', '신규', '비포·애프터', '브이로그', '손글씨', '타이포', '특가', '고급', '테크', '스포츠', '상담·정보', '신뢰', '감성', '재미', '뉴스·방송'];
    // ★ 업종 전용 테마: 그 업종을 고른 사람에게만 보이고, 업종을 바꾸면 첫 테마가 바로 적용됨
    // [id, 이름, (분류는 '내 업종'), layout, cap, font, deco, trans, outro, grade, head, bg, label, accent, accent2, script, sfont]
    // 2026-11: 업종 디자인은 사진을 꽉 채우고 자막을 사진 위에 올림 (위 사진·아래 글자로 나누는 구성은 촌스럽다는 의견)
    const IND_KIT_ROWS = {
      restaurant: [
        ['r1', '오늘의 메뉴판', 'chalkboard', 'chalk', 'gaegu', 'none', 'fade', 'card', 'warm', 'kicker', 'dark', '오늘의 메뉴', '#facc15', '#ffffff'],
        ['r2', '김 나는 한 그릇', 'full', 'band', 'dohyeon', 'leak', 'zoom', 'ticket', 'warm', 'pill', 'dark', '오늘 점심', '#f97316', '#fde68a'],
        ['r3', '손글씨 메뉴 노트', 'full', 'write', 'pen', 'none', 'slide', 'polaroid', 'sepia', 'none', 'paper', '사장님 추천', '#b45309', '#fef3c7'],
        ['r4', '단골 영수증', 'full', 'glass', 'mono', 'corners', 'slide', 'receipt', 'warm', 'box', 'cream', 'ORDER', '#dc2626', '#fee2e2'],
        ['r5', '주방 브이로그', 'handheld', 'vsub', 'sans', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '새벽 6시 주방', '#facc15', '#fef9c3'],
        ['r6', '맛집 신문', 'full', 'headline', 'serif', 'grain', 'wipe', 'news', 'sepia', 'kicker', 'paper', '동네 맛집 소식', '#991b1b', '#fef2f2'],
        ['r7', '네온 포차', 'dim', 'neon', 'dohyeon', 'grain', 'flash', 'neon', 'noir', 'box', 'dark', '오늘 밤 한잔', '#f472b6', '#fde047'],
        ['r8', '정성 한 상', 'full', 'brush', 'brush', 'border', 'fade', 'signature', 'warm', 'none', 'cream', '정성 한 상', '#7c2d12', '#ffedd5', 'Bon appétit', 'greatvibes']
      ],
      cafe: [
        ['c1', '라떼 아트', 'full', 'scriptkick', 'sans', 'leak', 'fade', 'signature', 'warm', 'none', 'cream', 'Today’s Coffee', '#92400e', '#fef3c7', 'Coffee & you', 'greatvibes'],
        ['c2', '카페 메뉴 칠판', 'chalkboard', 'chalk', 'gaegu', 'none', 'fade', 'card', 'warm', 'kicker', 'dark', 'MENU', '#fde68a', '#ffffff'],
        ['c3', '디저트 폴라로이드', 'polaroid', 'sticky', 'gamja', 'sparkle', 'drop', 'polaroid', 'pastel', 'none', 'paper', '오늘 구운 케이크', '#f472b6', '#fce7f3'],
        ['c4', '스탬프 쿠폰', 'full', 'stamp', 'jua', 'dots', 'zoom', 'ticket', 'pastel', 'counter', 'cream', 'STAMP 10+1', '#16a34a', '#dcfce7'],
        ['c5', '오픈 준비 브이로그', 'handheld', 'timestamp', 'mono', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', 'AM 07:30', '#facc15', '#ffffff'],
        ['c6', '창가 자리', 'full', 'glass', 'sans', 'leak', 'slide', 'minimal', 'warm', 'kicker', 'dark', '햇살 맛집', '#fbbf24', '#fff7ed'],
        ['c7', '시즌 메뉴 포스터', 'full', 'stack', 'gasoek', 'none', 'flash', 'split', 'vivid', 'box', 'accent', 'NEW SEASON', '#ea580c', '#ffffff'],
        ['c8', '원두 노트', 'full', 'letter', 'pen', 'grain', 'slide', 'card', 'sepia', 'none', 'paper', 'Roasting Note', '#78350f', '#fef3c7']
      ],
      beauty: [
        ['b1', '비포 애프터', 'full', 'pill', 'sans', 'sparkle', 'wipe', 'card', 'pastel', 'kicker', 'white', 'BEFORE · AFTER', '#ec4899', '#fce7f3'],
        ['b2', '살롱 매거진', 'full', 'lower3', 'serif', 'border', 'fade', 'minimal', 'pastel', 'none', 'dark', 'BEAUTY ISSUE', '#f9a8d4', '#ffffff'],
        ['b3', '네일 아트 카드', 'full', 'glass', 'sans', 'sparkle', 'slide', 'polaroid', 'pastel', 'pill', 'cream', '이달의 아트', '#a855f7', '#f3e8ff'],
        ['b4', '원장님 서명', 'full', 'signline', 'serif7', 'none', 'fade', 'signature', 'warm', 'none', 'cream', 'Salon', '#be185d', '#fce7f3', 'With love', 'pinyon'],
        ['b5', '예약 알림', 'full', 'bubble', 'jua', 'confetti', 'drop', 'chat', 'pastel', 'counter', 'white', '이번 주 빈자리', '#f43f5e', '#ffe4e6'],
        ['b6', '샵 브이로그', 'handheld', 'vsub', 'sans', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '원장님의 하루', '#f9a8d4', '#ffffff'],
        ['b7', '홈케어 팁', 'full', 'glass', 'sans', 'none', 'slide', 'receipt', 'none', 'kicker', 'paper', '관리 꿀팁', '#14b8a6', '#ccfbf1'],
        ['b8', '글로우 원형', 'full', 'scriptkick', 'sans', 'sparkle', 'zoom', 'ring', 'pastel', 'none', 'dark', 'Glow up', '#fda4af', '#fff1f2', 'Glow up', 'greatvibes']
      ],
      realestate: [
        ['e1', '매물 카드', 'full', 'glass', 'sans', 'corners', 'slide', 'card', 'cool', 'pill', 'white', '오늘의 매물', '#0ea5e9', '#e0f2fe'],
        ['e2', '평면 그리드', 'full', 'pill', 'sans', 'grid', 'blinds', 'receipt', 'cool', 'counter', 'white', '구조 한눈에', '#2563eb', '#dbeafe'],
        ['e3', '동네 산책', 'handheld', 'loctag', 'sans', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '이 동네 어때요', '#22c55e', '#dcfce7'],
        ['e4', '부동산 신문', 'full', 'headline', 'serif', 'grain', 'wipe', 'news', 'mono', 'kicker', 'paper', '매물 속보', '#1e3a8a', '#e0e7ff'],
        ['e5', '안전 계약 체크', 'full', 'stamp', 'sans', 'border', 'zoom', 'badge', 'trust', 'box', 'cream', '권리분석 확인', '#15803d', '#dcfce7'],
        ['e6', '야경 뷰', 'dim', 'cinema', 'serif', 'bars', 'fade', 'minimal', 'noir', 'none', 'dark', 'NIGHT VIEW', '#fbbf24', '#ffffff'],
        ['e7', '열쇠 전달', 'full', 'lower3', 'sans', 'leak', 'slide', 'ticket', 'warm', 'kicker', 'dark', '입주 축하', '#f59e0b', '#fef3c7'],
        ['e8', '중개사 명함', 'full', 'glass', 'sans', 'none', 'fade', 'card', 'trust', 'pill', 'ink', '공인중개사', '#0f766e', '#ccfbf1']
      ],
      academy: [
        ['a1', '칠판 강의', 'chalkboard', 'chalk', 'gaegu', 'none', 'fade', 'card', 'none', 'kicker', 'dark', '오늘의 수업', '#fde047', '#ffffff'],
        ['a2', '오답 노트', 'full', 'scribble', 'pen', 'none', 'slide', 'polaroid', 'none', 'none', 'paper', '오답 노트', '#ef4444', '#fee2e2'],
        ['a3', '공부법 카드', 'full', 'marker', 'sans', 'corners', 'slide', 'receipt', 'cool', 'counter', 'white', '공부법 3단계', '#2563eb', '#dbeafe'],
        ['a4', '합격 포스터', 'full', 'slam', 'gasoek', 'confetti', 'flash', 'split', 'vivid', 'box', 'accent', '시험 D-28', '#7c3aed', '#ffffff'],
        ['a5', '학부모 Q&A', 'full', 'bubble', 'jua', 'none', 'drop', 'chat', 'pastel', 'kicker', 'white', '자주 묻는 질문', '#0ea5e9', '#e0f2fe'],
        ['a6', '원장님 브이로그', 'handheld', 'vsub', 'sans', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '수업 끝나고', '#facc15', '#fef9c3'],
        ['a7', '시간표', 'full', 'pill', 'sans', 'grid', 'blinds', 'card', 'cool', 'pill', 'white', '이번 학기 시간표', '#16a34a', '#dcfce7'],
        ['a8', '수료증', 'full', 'stamp', 'serif', 'border', 'zoom', 'badge', 'trust', 'none', 'cream', 'CERTIFICATE', '#b45309', '#fef3c7']
      ],
      clinic: [
        ['m1', '진료 안내 카드', 'full', 'glass', 'sans', 'none', 'slide', 'card', 'trust', 'pill', 'white', '진료 안내', '#0ea5e9', '#e0f2fe'],
        ['m2', '건강 정보 체크', 'full', 'glass', 'sans', 'corners', 'slide', 'receipt', 'cool', 'counter', 'white', '건강 체크', '#14b8a6', '#ccfbf1'],
        ['m3', '스트레칭 따라하기', 'full', 'pill', 'sans', 'none', 'fade', 'minimal', 'cool', 'counter', 'dark', '30초 스트레칭', '#22c55e', '#dcfce7'],
        ['m4', '원장님 Q&A', 'full', 'bubble', 'sans', 'none', 'drop', 'chat', 'trust', 'kicker', 'white', '많이 묻는 질문', '#2563eb', '#dbeafe'],
        ['m5', '건강 칼럼', 'full', 'headline', 'serif', 'none', 'wipe', 'news', 'mono', 'kicker', 'paper', '건강 칼럼', '#1e40af', '#e0e7ff'],
        ['m6', '진료 시간표', 'full', 'lower3', 'sans', 'grid', 'blinds', 'card', 'trust', 'pill', 'white', '진료 시간', '#0f766e', '#ccfbf1'],
        ['m7', '깨끗한 진료실', 'full', 'lower3', 'sans', 'border', 'fade', 'badge', 'cool', 'none', 'cream', 'CLEAN CARE', '#38bdf8', '#f0f9ff'],
        ['m8', '편안한 첫 방문', 'full', 'letter', 'pen', 'leak', 'slide', 'signature', 'warm', 'none', 'paper', '처음 오시는 분께', '#0d9488', '#ccfbf1', 'Take care', 'greatvibes']
      ],
      fitness: [
        ['f1', '운동 카운트', 'full', 'slam', 'impact', 'none', 'flash', 'bigname', 'sports', 'counter', 'dark', 'NO PAIN NO GAIN', '#ef4444', '#ffffff'],
        ['f2', '루틴 체크', 'full', 'glass', 'sans', 'corners', 'slide', 'receipt', 'sports', 'counter', 'white', '오늘의 루틴', '#f97316', '#ffedd5'],
        ['f3', '센터 브이로그', 'handheld', 'timestamp', 'mono', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', 'AM 06:00', '#facc15', '#ffffff'],
        ['f4', '바디 체인지', 'full', 'band', 'impact', 'none', 'wipe', 'split', 'vivid', 'box', 'dark', 'BEFORE · AFTER', '#22c55e', '#dcfce7'],
        ['f5', '필라테스 무드', 'dim', 'scriptkick', 'sans', 'leak', 'fade', 'signature', 'pastel', 'none', 'cream', 'Pilates', '#14b8a6', '#ccfbf1', 'Breathe', 'greatvibes'],
        ['f6', '식단 노트', 'full', 'marker', 'sans', 'none', 'slide', 'polaroid', 'none', 'kicker', 'paper', '식단 가이드', '#16a34a', '#dcfce7'],
        ['f7', '스피드 사선', 'diag', 'words', 'impact', 'none', 'slide', 'ticket', 'sports', 'pill', 'accent', 'LET’S GO', '#facc15', '#111111'],
        ['f8', '트레이너 사원증', 'full', 'stamp', 'sans', 'border', 'zoom', 'badge', 'sports', 'box', 'dark', 'TRAINER', '#ef4444', '#fee2e2']
      ],
      shop: [
        ['s1', '오늘의 딜', 'full', 'band', 'impact', 'dots', 'zoom', 'ticket', 'vivid', 'pill', 'dark', 'TODAY DEAL', '#ec4899', '#fde047'],
        ['s2', '포장 브이로그', 'handheld', 'vsub', 'sans', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '오늘 출발합니다', '#f59e0b', '#fef3c7'],
        ['s3', '룩북 매거진', 'full', 'lower3', 'serif', 'border', 'fade', 'minimal', 'mono', 'none', 'paper', 'LOOKBOOK', '#111827', '#f3f4f6'],
        ['s4', '언박싱', 'full', 'sticky', 'gamja', 'confetti', 'drop', 'polaroid', 'pastel', 'counter', 'cream', 'UNBOXING', '#f472b6', '#fce7f3'],
        ['s5', '재입고 알림', 'full', 'bubble', 'jua', 'none', 'drop', 'chat', 'vivid', 'kicker', 'white', '재입고!', '#2563eb', '#dbeafe'],
        ['s6', '상품 그리드', 'full', 'pill', 'sans', 'grid', 'blinds', 'receipt', 'none', 'pill', 'white', '베스트 4', '#16a34a', '#dcfce7'],
        ['s7', '무한 세일 띠', 'full', 'marquee', 'impact', 'none', 'slide', 'split', 'sale', 'none', 'dark', 'SALE SALE SALE', '#facc15', '#ffffff'],
        ['s8', '감사 카드', 'full', 'letter', 'pen', 'sparkle', 'fade', 'signature', 'warm', 'none', 'cream', 'Thank you', '#9f1239', '#ffe4e6', 'Thank you', 'greatvibes']
      ],
      interior: [
        ['i1', '비포 애프터', 'full', 'pill', 'sans', 'none', 'wipe', 'card', 'none', 'kicker', 'white', 'BEFORE · AFTER', '#0ea5e9', '#e0f2fe'],
        ['i2', '시공 현장 기록', 'handheld', 'timestamp', 'mono', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '현장 D+3', '#f59e0b', '#fef3c7'],
        ['i3', '도면 그리드', 'full', 'typer', 'mono', 'grid', 'blinds', 'receipt', 'cool', 'counter', 'white', '공정표', '#2563eb', '#dbeafe'],
        ['i4', '쇼룸 매거진', 'full', 'lower3', 'serif', 'border', 'fade', 'minimal', 'mono', 'none', 'paper', 'HOME STYLING', '#44403c', '#f5f5f4'],
        ['i5', '견적 체크', 'full', 'glass', 'sans', 'corners', 'slide', 'receipt', 'none', 'counter', 'cream', '견적 전 체크', '#16a34a', '#dcfce7'],
        ['i6', '아치 인테리어', 'full', 'glass', 'sans', 'leak', 'slide', 'card', 'warm', 'kicker', 'dark', '우리 집 변신', '#d97706', '#fef3c7'],
        ['i7', '자재 샘플', 'polaroid', 'sticky', 'pen', 'none', 'drop', 'polaroid', 'sepia', 'none', 'paper', '자재 샘플', '#78716c', '#f5f5f4'],
        ['i8', '실장님 서명', 'full', 'signline', 'serif7', 'none', 'fade', 'signature', 'warm', 'none', 'cream', 'Interior', '#57534e', '#f5f5f4', 'Made with care', 'pinyon']
      ]
    };
    Object.keys(IND_KIT_ROWS).forEach((ind) => {
      IND_KIT_ROWS[ind].forEach((r, i) => {
        DESIGN_STYLES.push({
          id: `ind_${ind}_${r[0]}`, name: r[1], cat: '내 업종', industry: ind, engine: 'kit',
          layout: r[2], cap: r[3], font: r[4], deco: r[5], trans: r[6], outro: r[7], grade: r[8], head: r[9], bg: r[10],
          label: r[11], accent: r[12], accent2: r[13], script: r[14] || '', sfont: r[15] || '', seed: 500 + i, genre: 'kit',
          desc: `${KIT_PART_NAMES.layout[r[2]]} · ${KIT_PART_NAMES.cap[r[3]]} 자막 · ${KIT_PART_NAMES.outro[r[7]]} 명함`
        });
      });
    });
    // ★ 업종별 유행 릴스·쇼츠 트렌드 테마 뱅크 (검색/교체 시 기존 저사용 디자인을 삭제하고 1:1 교체)
    const IND_TREND_BANK = {
      auto: [
        ['tr_auto_pov', '🔥 시승 1인칭 POV', 'handheld', 'timestamp', 'mono', 'camera', 'zoom', 'vlogend', 'cool', 'profile', 'dark', '시승 POV', '#38bdf8', '#e0f2fe'],
        ['tr_auto_monthly', '🔥 월 납입금 3초컷', 'split', 'band', 'impact', 'dots', 'flash', 'ticket', 'vivid', 'pill', 'dark', '월 납입금 공개', '#ef4444', '#fde047'],
        ['tr_auto_ambient', '🔥 야간 엠비언트', 'dim', 'neon', 'dohyeon', 'grain', 'fade', 'neon', 'noir', 'box', 'dark', 'NIGHT AMBIENT', '#a855f7', '#22d3ee'],
        ['tr_auto_opt', '🔥 옵션 비교 스플릿', 'duo', 'pill', 'sans', 'corners', 'wipe', 'split', 'cool', 'counter', 'dark', '트림별 비교', '#0ea5e9', '#e0f2fe'],
        ['tr_auto_delivery', '🔥 3초 출고 훅', 'full', 'slam', 'gasoek', 'sparkle', 'flash', 'signature', 'warm', 'kicker', 'dark', '오늘 출고!', '#facc15', '#ffffff']
      ],
      restaurant: [
        ['tr_rest_asmr', '🔥 지글지글 ASMR', 'full', 'vsub', 'dohyeon', 'leak', 'zoom', 'vlogend', 'warm', 'pill', 'dark', '소리 켜고 보세요', '#f97316', '#fde68a'],
        ['tr_rest_openrun', '🔥 줄 서는 오픈런', 'handheld', 'timestamp', 'mono', 'camera', 'slide', 'ticket', 'vivid', 'profile', 'dark', '오픈런 현장', '#ef4444', '#fef08a'],
        ['tr_rest_value', '🔥 가성비 정식 3초컷', 'split', 'band', 'impact', 'dots', 'flash', 'receipt', 'warm', 'counter', 'cream', '이 가격 실화?', '#dc2626', '#fee2e2'],
        ['tr_rest_fire', '🔥 시그니처 불쇼', 'dim', 'slam', 'gasoek', 'grain', 'flash', 'bigname', 'noir', 'box', 'dark', '시그니처 메뉴', '#f59e0b', '#ffffff'],
        ['tr_rest_night', '🔥 심야 포차 감성', 'polaroid', 'neon', 'jua', 'grain', 'fade', 'neon', 'noir', 'kicker', 'dark', '오늘 밤 한잔', '#f472b6', '#fde047']
      ],
      cafe: [
        ['tr_cafe_pour', '🔥 아아 붓기 ASMR', 'full', 'vsub', 'sans', 'leak', 'fade', 'minimal', 'warm', 'kicker', 'dark', 'ICED COFFEE', '#fbbf24', '#fff7ed'],
        ['tr_cafe_cross', '🔥 디저트 반갈샷', 'split', 'pill', 'jua', 'sparkle', 'zoom', 'polaroid', 'pastel', 'pill', 'paper', '단면 미쳤다', '#f472b6', '#fce7f3'],
        ['tr_cafe_receipt', '🔥 감성 영수증 컷', 'cards', 'ticket', 'mono', 'none', 'slide', 'receipt', 'sepia', 'box', 'paper', 'CAFE RECEIPT', '#78350f', '#fef3c7'],
        ['tr_cafe_new', '🔥 시즌 한정 신메뉴', 'poster', 'slam', 'gasoek', 'dots', 'flash', 'split', 'vivid', 'counter', 'accent', '시즌 한정', '#ea580c', '#ffffff'],
        ['tr_cafe_sun', '🔥 햇살 창가 브이로그', 'arch', 'scriptkick', 'serif7', 'leak', 'fade', 'signature', 'warm', 'none', 'cream', 'SUNLIGHT', '#b45309', '#fef3c7', 'Coffee mood', 'greatvibes']
      ],
      beauty: [
        ['tr_beau_ba', '🔥 3초 비포·애프터', 'duo', 'band', 'sans', 'sparkle', 'wipe', 'card', 'pastel', 'kicker', 'white', 'BEFORE → AFTER', '#ec4899', '#fce7f3'],
        ['tr_beau_rank', '🔥 이달의 네일 랭킹', 'grid', 'pill', 'jua', 'sparkle', 'slide', 'polaroid', 'pastel', 'counter', 'white', 'BEST 4', '#a855f7', '#f3e8ff'],
        ['tr_beau_color', '🔥 퍼스널컬러 진단', 'split', 'marker', 'sans', 'corners', 'wipe', 'card', 'cool', 'pill', 'white', '퍼스널 진단', '#f43f5e', '#ffe4e6'],
        ['tr_beau_close', '🔥 마감 임박 예약', 'full', 'bubble', 'jua', 'confetti', 'drop', 'chat', 'vivid', 'box', 'dark', '이번주 잔여석', '#ec4899', '#fde047'],
        ['tr_beau_glow', '🔥 물광 시술 줌인', 'circle', 'scriptkick', 'serif7', 'sparkle', 'zoom', 'ring', 'pastel', 'none', 'dark', 'GLOW UP', '#fda4af', '#fff1f2', 'Glow up', 'greatvibes']
      ],
      realestate: [
        ['tr_real_tour', '🔥 30초 랜선 집들이', 'handheld', 'loctag', 'sans', 'camera', 'slide', 'vlogend', 'warm', 'profile', 'dark', '30초 룸투어', '#0ea5e9', '#e0f2fe'],
        ['tr_real_urg', '🔥 급매물 속보', 'full', 'lower3', 'dohyeon', 'corners', 'flash', 'news', 'vivid', 'box', 'dark', '급매 속보', '#dc2626', '#fee2e2'],
        ['tr_real_safe', '🔥 전세 안전 체크', 'cards', 'checkl', 'sans', 'border', 'wipe', 'receipt', 'trust', 'counter', 'white', '안전 체크 4', '#16a34a', '#dcfce7'],
        ['tr_real_view', '🔥 한강뷰 야경 컷', 'dim', 'cinema', 'serif', 'bars', 'fade', 'minimal', 'noir', 'kicker', 'dark', 'RIVER VIEW', '#f2c46d', '#ffffff'],
        ['tr_real_walk', '🔥 역세권 도보 3분', 'split', 'pill', 'sans', 'corners', 'zoom', 'card', 'cool', 'pill', 'white', '초역세권', '#2563eb', '#dbeafe']
      ],
      academy: [
        ['tr_acad_top1', '🔥 1등급 공부 루틴', 'cards', 'checkl', 'sans', 'corners', 'slide', 'receipt', 'cool', 'counter', 'white', '1등급 루틴', '#2563eb', '#dbeafe'],
        ['tr_acad_dday', '🔥 시험 D-7 족보', 'poster', 'slam', 'gasoek', 'dots', 'flash', 'bigname', 'vivid', 'box', 'accent', '시험 D-7', '#ef4444', '#ffffff'],
        ['tr_acad_qa', '🔥 학부모 30초 Q&A', 'split', 'bubble', 'jua', 'none', 'drop', 'chat', 'pastel', 'kicker', 'white', '학부모 Q&A', '#0ea5e9', '#e0f2fe'],
        ['tr_acad_up', '🔥 성적 수직 상승', 'duo', 'band', 'dohyeon', 'confetti', 'wipe', 'badge', 'vivid', 'pill', 'dark', '성적 상승 사례', '#16a34a', '#dcfce7'],
        ['tr_acad_camp', '🔥 방학 특강 선착순', 'chalkboard', 'chalk', 'gaegu', 'none', 'fade', 'ticket', 'none', 'kicker', 'dark', '방학 특강', '#fde047', '#ffffff']
      ],
      clinic: [
        ['tr_clin_fact', '🔥 의사쌤 30초 팩트', 'split', 'lower3', 'sans', 'corners', 'slide', 'news', 'trust', 'box', 'white', '전문의 팩트체크', '#0284c7', '#e0f2fe'],
        ['tr_clin_1min', '🔥 하루 1분 스트레칭', 'full', 'pill', 'sans', 'none', 'fade', 'minimal', 'cool', 'counter', 'dark', '하루 1분 루틴', '#22c55e', '#dcfce7'],
        ['tr_clin_ba', '🔥 시술 전후 비교', 'duo', 'glass', 'sans', 'none', 'wipe', 'card', 'trust', 'kicker', 'white', 'BEFORE · AFTER', '#0ea5e9', '#e0f2fe'],
        ['tr_clin_check', '🔥 건강검진 체크', 'cards', 'checkl', 'sans', 'corners', 'slide', 'receipt', 'cool', 'counter', 'white', '필수 체크', '#14b8a6', '#ccfbf1'],
        ['tr_clin_night', '🔥 야간·주말 진료', 'grid', 'lower3', 'sans', 'grid', 'blinds', 'card', 'trust', 'pill', 'white', '야간 진료 안내', '#2563eb', '#dbeafe']
      ],
      fitness: [
        ['tr_fit_4wk', '🔥 4주 바디 체인지', 'duo', 'band', 'impact', 'none', 'wipe', 'split', 'vivid', 'box', 'dark', '4주 변화', '#22c55e', '#dcfce7'],
        ['tr_fit_oun', '🔥 오운완 루틴 3종', 'cards', 'checkl', 'sans', 'corners', 'slide', 'receipt', 'sports', 'counter', 'white', '오늘의 루틴', '#f97316', '#ffedd5'],
        ['tr_fit_pt', '🔥 PT 1회 체험 특가', 'full', 'slam', 'gasoek', 'dots', 'flash', 'ticket', 'sports', 'pill', 'dark', '1회 체험 특가', '#ef4444', '#fde047'],
        ['tr_fit_meal', '🔥 식단 칼로리 컷', 'notebook', 'marker', 'sans', 'none', 'slide', 'polaroid', 'none', 'kicker', 'paper', '식단 가이드', '#16a34a', '#dcfce7'],
        ['tr_fit_am', '🔥 새벽 6시 헬스장', 'handheld', 'timestamp', 'mono', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', 'AM 06:00', '#facc15', '#ffffff']
      ],
      shop: [
        ['tr_shop_fit', '🔥 착샷 3초 코디', 'full', 'vsub', 'jua', 'sparkle', 'zoom', 'minimal', 'vivid', 'pill', 'dark', '데일리 코디', '#ec4899', '#fce7f3'],
        ['tr_shop_unbox', '🔥 언박싱 첫인상', 'cards', 'sticky', 'gamja', 'confetti', 'drop', 'polaroid', 'pastel', 'counter', 'cream', 'UNBOXING', '#f472b6', '#fce7f3'],
        ['tr_shop_restock', '🔥 품절대란 재입고', 'split', 'bubble', 'jua', 'dots', 'drop', 'chat', 'vivid', 'kicker', 'white', '긴급 재입고!', '#2563eb', '#dbeafe'],
        ['tr_shop_1plus1', '🔥 1+1 타임세일', 'full', 'band', 'impact', 'dots', 'flash', 'ticket', 'sale', 'pill', 'dark', '1+1 타임세일', '#ef4444', '#fde047'],
        ['tr_shop_pack', '🔥 사장님 포장 브이로그', 'handheld', 'timestamp', 'mono', 'camera', 'fade', 'vlogend', 'warm', 'profile', 'dark', '오늘 출발!', '#f59e0b', '#fef3c7']
      ],
      interior: [
        ['tr_int_3wk', '🔥 구축 3주 대변신', 'duo', 'pill', 'sans', 'none', 'wipe', 'card', 'warm', 'kicker', 'white', '구축 3주 변신', '#0ea5e9', '#e0f2fe'],
        ['tr_int_tour', '🔥 30초 룸투어', 'handheld', 'loctag', 'sans', 'camera', 'slide', 'vlogend', 'warm', 'profile', 'dark', '30초 룸투어', '#d97706', '#fef3c7'],
        ['tr_int_mat', '🔥 자재·조명 톤매치', 'polaroid', 'sticky', 'pen', 'none', 'drop', 'polaroid', 'sepia', 'none', 'paper', '자재 톤매치', '#78716c', '#f5f5f4'],
        ['tr_int_est', '🔥 평수별 견적 공개', 'cards', 'checkl', 'sans', 'corners', 'slide', 'receipt', 'cool', 'counter', 'cream', '견적 공개', '#16a34a', '#dcfce7'],
        ['tr_int_show', '🔥 쇼룸 미니멀 컷', 'arch', 'glass', 'serif', 'leak', 'fade', 'minimal', 'mono', 'none', 'paper', 'ROOM MOOD', '#44403c', '#f5f5f4']
      ]
    };
    const KIT_LEGACY_ALIASES = {
      k_vhs: 'm_strip', k_vserif: 'a_gallery', k_outline: 'k_kinetic', s_magazine: 'a_gallery', s_cleanhalf: 'k_approved',
      s_colorblock: 'k_popbubble', s_memo: 'p_diary', s_neonhalf: 'k_neonnight', s_stamphalf: 'k_approved',
      p_album: 'p_diary', p_scrapbook: 'k_popbubble', p_postcard: 'p_diary', p_gallery: 'k_subtitle', p_frontpage: 'k_lowerthird',
      m_retro: 'm_strip', m_contact: 'k_highlighter', m_vertical: 'm_strip', m_diary: 'p_diary', m_cyber: 's_datapanel', m_sale: 'k_redband',
      c_lens: 's_datapanel', c_spotlight: 'k_subtitle', c_sticker: 'k_popbubble', c_target: 'k_kinetic', c_seal: 'k_approved', c_talk: 'k_highlighter', c_newsround: 'k_lowerthird',
      a_poster: 'a_gallery', a_label: 'a_gallery', a_memo: 'p_diary', a_black: 'k_neonnight', a_note: 'k_highlighter', a_popart: 'k_popbubble',
      d_speed: 'k_kinetic', d_mag: 'a_gallery', d_coupon: 'k_redband', d_tech: 's_datapanel', d_pop: 'k_popbubble', d_neon: 'k_neonnight', d_trust: 'k_approved',
      k2_stack: 'k_highlighter', k2_swipe: 'k_popbubble', k2_memo: 'p_diary', k2_receipt: 'k_highlighter', k2_racer: 'k_kinetic', k2_warm: 'p_diary', k2_news: 'k_lowerthird',
      g_mosaic: 'g_fourcut', g_monitor: 's_datapanel', g_mag: 'a_gallery', g_neon: 'k_neonnight', g_check: 'k_approved', g_talk: 'k_highlighter',
      r_vertical: 'r_window', r_sticker: 'k_popbubble', r_glass: 's_datapanel', r_memo: 'p_diary', r_marker: 'k_highlighter', r_type: 'k_kinetic',
      b_cut: 'k_kinetic', b_sale: 'k_redband', b_news: 'k_lowerthird', b_cinema: 'k_subtitle', b_neon: 'k_neonnight', b_term: 's_datapanel', b_glass: 'k_highlighter',
      u_mag: 'u_compare', u_bubble: 'u_compare', u_stamp: 'k_redband', u_neon: 'k_neonnight', u_glass: 's_datapanel', u_words: 'k_kinetic',
      h_thankyou: 'h_signature', h_delivered: 'h_signature', h_promise: 'h_signature', h_handpicked: 'h_signature', h_letterpress: 'h_signature',
      h_goldscript: 'h_signature', h_sincerely: 'h_signature', h_newowner: 'h_signature', h_brushpoint: 'h_signature', h_cursive: 'h_signature', h_seal: 'h_signature',
      t_credits: 't_stack', t_oneword: 't_stack', t_nonstop: 't_inside', t_pop3d: 't_inside', t_poster: 't_stack', t_postword: 't_stack', t_postscroll: 't_stack', t_banner: 't_inside', t_depth: 't_stack', t_phototype: 't_inside',
      v_camera: 'v_delivery', v_chapter: 'v_delivery', v_location: 'v_delivery', v_checklist: 'v_delivery', v_diary: 'v_delivery', v_story: 'v_delivery', v_cine: 'v_delivery', v_split: 'v_delivery', v_note: 'v_delivery', v_timelapse: 'v_delivery', v_handover: 'v_delivery'
    };
    const BASE_DESIGN_SNAPSHOT = DESIGN_STYLES.map((d) => ({ ...d }));

    function getDesignStats() {
      try { return JSON.parse(localStorage.getItem('autoreels_design_stats') || '{}') || {}; } catch (e) { return {}; }
    }
    function recordDesignUse(id) {
      if (!id) return;
      try {
        const stats = getDesignStats();
        const prev = stats[id] || { count: 0, lastUsed: 0 };
        stats[id] = { count: (prev.count || 0) + 1, lastUsed: Date.now() };
        localStorage.setItem('autoreels_design_stats', JSON.stringify(stats));
      } catch (e) {}
    }
    function getTrendSwapState() {
      try {
        const raw = JSON.parse(localStorage.getItem('autoreels_trend_swaps') || '{}') || {};
        return { removedIds: Array.isArray(raw.removedIds) ? raw.removedIds : [], added: Array.isArray(raw.added) ? raw.added : [] };
      } catch (e) { return { removedIds: [], added: [] }; }
    }
    function saveTrendSwapState(st) {
      try { localStorage.setItem('autoreels_trend_swaps', JSON.stringify(st)); } catch (e) {}
    }
    function makeTrendDesignObj(r, indKey, seedOffset) {
      return {
        id: r[0], name: r[1], cat: '내 업종', industry: indKey, engine: 'kit', isTrend: true,
        layout: r[2], cap: r[3], font: r[4], deco: r[5], trans: r[6], outro: r[7], grade: r[8], head: r[9], bg: r[10],
        label: r[11], accent: r[12], accent2: r[13], script: r[14] || '', sfont: r[15] || '', seed: 800 + (seedOffset || 0), genre: 'kit',
        desc: `🔥 업종 트렌드 · ${KIT_PART_NAMES.layout[r[2]] || r[2]} · ${KIT_PART_NAMES.cap[r[3]] || r[3]} 자막`
      };
    }
    function applySavedTrendSwaps() {
      const st = getTrendSwapState();
      if (st.removedIds.length) {
        const rm = new Set(st.removedIds);
        for (let i = DESIGN_STYLES.length - 1; i >= 0; i--) {
          if (rm.has(DESIGN_STYLES[i].id)) DESIGN_STYLES.splice(i, 1);
        }
      }
      if (st.added.length) {
        st.added.forEach((ds) => {
          if (ds && ds.id && !DESIGN_STYLES.some((x) => x.id === ds.id)) DESIGN_STYLES.unshift(ds);
        });
      }
    }
    applySavedTrendSwaps();

    function updateTrendSwapStatusUI(msg) {
      const st = getTrendSwapState();
      const hasSwaps = st.removedIds.length > 0 || st.added.length > 0;
      ['trendSwapResetBtn', 'pdTrendSwapResetBtn'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !hasSwaps);
      });
      ['trendSwapStatus', 'pdTrendSwapStatus'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (msg) {
          el.textContent = msg;
          el.classList.remove('hidden');
        } else if (hasSwaps) {
          el.textContent = `유행 테마 ${st.added.length}개 추가됨`;
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
      renderPopularTrendChips();
    }

    function renderPopularTrendChips() {
      const indKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      const bank = IND_TREND_BANK[indKey] || IND_TREND_BANK.auto;
      const activeId = campaign && campaign.designStyle;
      const addedSet = new Set(DESIGN_STYLES.map((d) => d.id));
      const html = bank.map((r) => {
        const on = activeId === r[0];
        const added = addedSet.has(r[0]);
        return `<button type="button" onclick="applyPopularTrendChip('${r[0]}')" title="${r[1]} 바로 적용"
          class="shrink-0 px-2 py-1 rounded-[6px] text-[11px] font-medium border cursor-pointer transition ${on
            ? 'border-[#fb923c] bg-[#ea580c]/25 text-white'
            : added
              ? 'border-[#ea580c]/40 bg-[#1a1614] text-[#fdba74] hover:border-[#fb923c]'
              : 'border-[var(--border)] bg-[#141416] text-[#d4d4d8] hover:border-[#fb923c] hover:text-white'}">${r[1]}</button>`;
      }).join('');
      ['popularTrendChips', 'pdPopularTrendChips'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      });
    }

    function applyPopularTrendChip(rowId) {
      const indKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      const bank = IND_TREND_BANK[indKey] || IND_TREND_BANK.auto;
      const row = bank.find((r) => r[0] === rowId);
      if (!row) return;
      if (!DESIGN_STYLES.some((d) => d.id === rowId)) {
        const obj = makeTrendDesignObj(row, indKey, DESIGN_STYLES.length);
        DESIGN_STYLES.unshift(obj);
        const st = getTrendSwapState();
        if (!st.added.some((x) => x.id === obj.id)) {
          st.added.unshift(obj);
          saveTrendSwapState(st);
        }
        if (typeof designThumbCache !== 'undefined' && designThumbCache.fresh) {
          delete designThumbCache.fresh[obj.id];
        }
      }
      campaign.designCat = '전체';
      selectDesignStyle(rowId);
      updateTrendSwapStatusUI(`'${row[1]}' 바로 적용됨`);
    }

    function importAllPopularTrends() {
      const indKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      const bank = IND_TREND_BANK[indKey] || IND_TREND_BANK.auto;
      const st = getTrendSwapState();
      let addedCount = 0;
      let firstId = bank[0] && bank[0][0];
      [...bank].reverse().forEach((row, i) => {
        if (!DESIGN_STYLES.some((d) => d.id === row[0])) {
          const obj = makeTrendDesignObj(row, indKey, i);
          DESIGN_STYLES.unshift(obj);
          if (!st.added.some((x) => x.id === obj.id)) st.added.unshift(obj);
          if (typeof designThumbCache !== 'undefined' && designThumbCache.fresh) {
            delete designThumbCache.fresh[obj.id];
          }
          addedCount++;
        }
      });
      if (addedCount) saveTrendSwapState(st);
      campaign.designCat = '내 업종';
      if (firstId && DESIGN_STYLES.some((d) => d.id === firstId)) selectDesignStyle(firstId);
      else renderDesignStylePicker();
      const totalCount = arVisibleDesigns().length;
      updateTrendSwapStatusUI(addedCount ? `인기 템플릿 ${addedCount}종 한 번에 추가됨 (총 ${totalCount}종)` : `이미 인기 템플릿 5종이 모두 담겨 있습니다`);
    }

    window.__liveTrendItems = [];
    async function fetchLiveReelsTrends() {
      const btn = document.getElementById('liveTrendsBtn');
      const box = document.getElementById('liveTrendResults');
      const qEl = document.getElementById('trendThemeQuery');
      const q = qEl ? qEl.value.trim() : '';
      const indKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      if (btn) { btn.disabled = true; btn.textContent = '📡 조회 중...'; }
      if (box) {
        box.classList.remove('hidden');
        box.innerHTML = '<div class="text-[11px] text-[#93c5fd]">현재 유행 중인 릴스·쇼츠를 실시간으로 가져오는 중...</div>';
      }
      try {
        const res = await fetch(`/api/trends?industry=${encodeURIComponent(indKey)}&q=${encodeURIComponent(q)}`);
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        window.__liveTrendItems = items;
        if (!items.length) {
          if (box) box.innerHTML = '<div class="text-[11px] text-[#fca5a5]">실시간 검색 결과가 비어 있습니다. 키워드를 바꿔 다시 눌러 주세요.</div>';
        } else if (box) {
          const srcLabel = String(data.source || '').startsWith('instagram') ? '📸 인스타 릴스' : '📡 쇼츠·릴스';
          const cacheTag = data.cached ? ' · 서버 캐시' : '';
          box.innerHTML = `
            <div class="flex items-center justify-between text-[10px] text-[#7dd3fc]">
              <span>${srcLabel} (${items.length}건 · ${data.query || ''}${cacheTag})</span>
              <button type="button" onclick="document.getElementById('liveTrendResults').classList.add('hidden')" class="text-[#85858b] hover:text-white cursor-pointer">닫기</button>
            </div>
            ${items.map((it, idx) => `
              <div class="flex items-center justify-between gap-2 rounded-[6px] bg-[#111827]/80 px-2 py-1.5 border border-white/5">
                <div class="min-w-0 flex-1">
                  <div class="text-[11px] text-[#ededed] truncate">${(it.title || '').replace(/</g, '&lt;')}</div>
                  <div class="text-[10px] text-[#9ca3af] truncate">${it.views || '인기 쇼츠'} · 훅: <span class="text-[#fde047]">${(it.theme?.label || '').replace(/</g, '&lt;')}</span> · <a href="${it.url}" target="_blank" rel="noopener" class="underline text-[#38bdf8]">영상 보기</a></div>
                </div>
                <button type="button" onclick="applyLiveTrendItem(${idx})" class="shrink-0 px-2 py-1 rounded-[5px] bg-[#0ea5e9] hover:bg-[#38bdf8] text-white text-[10px] font-semibold cursor-pointer">스타일 적용</button>
              </div>
            `).join('')}`;
        }
      } catch (e) {
        if (box) box.innerHTML = '<div class="text-[11px] text-[#fca5a5]">실시간 조회 중 오류가 발생했습니다.</div>';
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📡 실시간 릴스 가져오기'; }
      }
    }

    function applyLiveTrendItem(idx) {
      const it = (window.__liveTrendItems || [])[idx];
      if (!it || !it.theme) return;
      const t = it.theme;
      const indKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      const obj = makeTrendDesignObj([
        t.id, t.name, t.layout, t.cap, t.font, t.deco, t.trans, t.outro, t.grade, t.head, t.bg, t.label, t.accent, t.accent2
      ], indKey, DESIGN_STYLES.length);
      if (!DESIGN_STYLES.some((d) => d.id === obj.id)) {
        DESIGN_STYLES.unshift(obj);
        const st = getTrendSwapState();
        st.added.unshift(obj);
        saveTrendSwapState(st);
      }
      if (t.hookCaption && Array.isArray(campaign.cutCaptions) && campaign.cutCaptions.length > 0) {
        campaign.cutCaptions[0] = t.hookCaption;
        if (typeof renderDynamicCutCardsUI === 'function') renderDynamicCutCardsUI();
      }
      if (typeof designThumbCache !== 'undefined' && designThumbCache.fresh) {
        delete designThumbCache.fresh[obj.id];
      }
      campaign.designCat = '전체';
      selectDesignStyle(obj.id);
      if (window.__timelines && window.__timelines.main) {
        window.__timelines.main.seek(0.5);
      }
      updateTrendSwapStatusUI(`인스타 스타일 '${obj.name}' + 1컷 훅 문구 적용됨`);
    }

    function pickVictimDesignForSwap(indKey) {
      const vis = arVisibleDesigns().filter((d) => d.id !== campaign.designStyle);
      if (!vis.length) return null;
      const stats = getDesignStats();
      // 공통(비업종) 또는 오래된 교체 테마 중 사용 횟수가 가장 적은 것을 우선 삭제 대상으로 선택
      const pool = vis.filter((d) => !d.industry || d.isTrend);
      const candidates = pool.length ? pool : vis;
      candidates.sort((a, b) => {
        const sa = stats[a.id] || { count: 0, lastUsed: 0 };
        const sb = stats[b.id] || { count: 0, lastUsed: 0 };
        if (sa.count !== sb.count) return sa.count - sb.count;
        return sa.lastUsed - sb.lastUsed;
      });
      return candidates[0] || null;
    }

    function synthesizeKeywordTrend(query, indKey) {
      const q = String(query || '').trim();
      const lower = q.toLowerCase();
      let layout = 'full', cap = 'band', font = 'dohyeon', deco = 'leak', trans = 'zoom', outro = 'card', grade = 'vivid', head = 'pill', bg = 'dark';
      let accent = '#ef4444', accent2 = '#fde047';
      if (/비교|전후|비포|애프터|차이/.test(lower)) { layout = 'duo'; cap = 'band'; trans = 'wipe'; accent = '#0ea5e9'; accent2 = '#e0f2fe'; }
      else if (/브이로그|일상|현장|출근|오픈|하루/.test(lower)) { layout = 'handheld'; cap = 'vsub'; font = 'sans'; deco = 'camera'; outro = 'vlogend'; grade = 'warm'; head = 'profile'; accent = '#facc15'; accent2 = '#fef9c3'; }
      else if (/속보|뉴스|공지|긴급|할인|특가|세일|타임/.test(lower)) { layout = 'full'; cap = 'lower3'; trans = 'flash'; outro = 'ticket'; accent = '#dc2626'; accent2 = '#fde047'; }
      else if (/감성|무드|카페|야경|밤|포차|힐링/.test(lower)) { layout = 'arch'; cap = 'cinema'; font = 'serif'; deco = 'grain'; trans = 'fade'; grade = 'film'; bg = 'paper'; accent = '#d97706'; accent2 = '#fef3c7'; }
      else if (/체크|정리|꿀팁|루틴|질문|q&a|공부|가이드/.test(lower)) { layout = 'cards'; cap = 'checkl'; font = 'sans'; deco = 'corners'; trans = 'slide'; outro = 'receipt'; bg = 'white'; head = 'counter'; accent = '#2563eb'; accent2 = '#dbeafe'; }
      const shortLabel = q.slice(0, 12);
      const id = `tr_${indKey}_${Date.now().toString(36)}`;
      return makeTrendDesignObj([id, `🔥 ${shortLabel}`, layout, cap, font, deco, trans, outro, grade, head, bg, shortLabel, accent, accent2], indKey, Math.floor(Math.random() * 90));
    }

    function detectTrendIndustryFromQuery(qLow, fallbackKey) {
      if (/미용|헤어|네일|살롱|뷰티|속눈썹|피부관리|염색|펌/.test(qLow)) return 'beauty';
      if (/음식|맛집|식당|고기|국밥|포차|배달|먹방|요리/.test(qLow)) return 'restaurant';
      if (/카페|커피|디저트|라떼|케이크|베이커리|빵/.test(qLow)) return 'cafe';
      if (/부동산|매물|아파트|전세|월세|집들이|분양/.test(qLow)) return 'realestate';
      if (/학원|공부|수업|시험|성적|과외|수능|입시/.test(qLow)) return 'academy';
      if (/병원|의원|치과|피부과|한의원|진료|건강|스트레칭/.test(qLow)) return 'clinic';
      if (/헬스|피트니스|필라테스|pt|운동|다이어트|오운완/.test(qLow)) return 'fitness';
      if (/쇼핑|의류|코디|언박싱|패션|스토어|세일/.test(qLow)) return 'shop';
      if (/인테리어|리모델링|시공|룸투어|가구|자재/.test(qLow)) return 'interior';
      if (/자동차|중고차|신차|시승|출고|할부|리스/.test(qLow)) return 'auto';
      return fallbackKey;
    }

    function searchAndSwapTrendTheme(fromDrawer) {
      const inputEl = document.getElementById(fromDrawer ? 'pdTrendThemeQuery' : 'trendThemeQuery');
      const query = inputEl ? inputEl.value.trim() : '';
      const curIndKey = typeof IND !== 'undefined' ? IND.key : 'auto';
      const qLow = query.toLowerCase();
      const targetIndKey = query ? detectTrendIndustryFromQuery(qLow, curIndKey) : curIndKey;
      const bank = IND_TREND_BANK[targetIndKey] || IND_TREND_BANK[curIndKey] || IND_TREND_BANK.auto;
      const existingIds = new Set(DESIGN_STYLES.map((d) => d.id));

      let picked = null;
      if (query) {
        const detected = detectTrendIndustryFromQuery(qLow, null);
        const matchRow = bank.find((r) => !existingIds.has(r[0]) && (r[1].toLowerCase().includes(qLow) || r[11].toLowerCase().includes(qLow)))
          || (detected ? bank.find((r) => !existingIds.has(r[0])) : null);
        picked = matchRow ? makeTrendDesignObj(matchRow, curIndKey, DESIGN_STYLES.length) : synthesizeKeywordTrend(query, curIndKey);
      } else {
        const nextRow = bank.find((r) => !existingIds.has(r[0]));
        if (nextRow) {
          picked = makeTrendDesignObj(nextRow, curIndKey, DESIGN_STYLES.length);
        } else {
          const fallbackRow = bank[Math.floor(Math.random() * bank.length)];
          const freshRow = [...fallbackRow];
          freshRow[0] = `${fallbackRow[0]}_${Date.now().toString(36).slice(-4)}`;
          picked = makeTrendDesignObj(freshRow, curIndKey, DESIGN_STYLES.length);
        }
      }

      const st = getTrendSwapState();
      DESIGN_STYLES.unshift(picked);
      st.added.unshift(picked);
      saveTrendSwapState(st);

      if (typeof designThumbCache !== 'undefined' && designThumbCache.fresh) {
        delete designThumbCache.fresh[picked.id];
      }
      if (inputEl) inputEl.value = '';
      campaign.designCat = '전체';
      selectDesignStyle(picked.id);

      const totalCount = arVisibleDesigns().length;
      updateTrendSwapStatusUI(`'${picked.name}' 추가됨 (현재 총 ${totalCount}종)`);
    }

    function resetTrendSwaps() {
      localStorage.removeItem('autoreels_trend_swaps');
      DESIGN_STYLES.length = 0;
      BASE_DESIGN_SNAPSHOT.forEach((d) => DESIGN_STYLES.push({ ...d }));
      const vis = arVisibleDesigns();
      if (!DESIGN_STYLES.some((d) => d.id === campaign.designStyle) && vis[0]) {
        campaign.designStyle = vis[0].id;
      }
      if (typeof designThumbCache !== 'undefined') designThumbCache.fresh = {};
      renderDesignStylePicker();
      renderColorPalettePicker();
      if (typeof renderPresetDrawer === 'function') renderPresetDrawer();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
      updateTrendSwapStatusUI('기본 큐레이션 목록으로 복원했습니다.');
    }

    // 지금 업종에서 보여 줄 디자인: 업종 전용 테마 + 공통 테마 (자동차 전용 고전 테마·테크는 자동차에서만)
    // 2026-11-14 정리: 핀터레스트 인스타 감성 기준으로 서로 비슷하거나(도형 전환 6종·어두운 사진+굵은 자막 상자 4종)
    // 유행이 지난 모션(블롭·터널·이퀄라이저·큐브·하프톤·터미널)은 목록에서 뺌
    const AR_RETIRED_DESIGNS = new Set(['g_diamond', 'g_hex', 'g_blocks', 'g_ringpop', 'g_diagshape', 'g_cardhex',
      's_shoplive', 'b_sale', 'u_compare', 'k2_stack', 'ev_terminal', 'mo_blob', 'mo_tunnel', 'mo_eq', 'mo_cube', 'mo_dots', 'in_cal',
      'r1', 'c2', 'a1', 'tr_acad_camp']);
    // 사진을 위 58%에만 두고 자막은 아래 단색 바탕에 두는 모션 스타일 — 자동차 외 업종에서는 숨김 (촌스럽다는 의견, 2026-11)
    const AR_SPLIT_MOTION_IDS = new Set(['mo_tiles', 'mo_cards', 'mo_aurora', 'mo_number', 'mo_bounce', 'mo_neon']);
    function arDesignVisible(ds) {
      if (AR_RETIRED_DESIGNS.has(ds.id)) return false;
      const key = typeof IND !== 'undefined' ? IND.key : 'auto';
      if (key !== 'auto' && AR_SPLIT_MOTION_IDS.has(ds.id)) return false;
      if (ds.industry) return ds.industry === key;
      // 자동차가 아닌 업종: 그 업종 전용 테마 + 업종 색으로 물드는 모션 템플릿만 (자동차 판매용 공통 디자인은 숨김)
      if (key !== 'auto') return ds.engine === 'motion';
      return true;
    }
    function arVisibleDesigns() {
      const list = DESIGN_STYLES.filter(arDesignVisible);
      return list.filter((d) => d.industry).concat(list.filter((d) => !d.industry));
    }
    function arDesignCats() {
      const key = typeof IND !== 'undefined' ? IND.key : 'auto';
      if (key === 'auto') return DESIGN_CATS;
      const vis = arVisibleDesigns();
      return ['전체', '내 업종', ...DESIGN_CATS.filter((c) => c !== '전체' && vis.some((d) => !d.industry && d.cat === c))];
    }

    function loadDesignPrefs() {
      try {
        let s = localStorage.getItem('autoreels_design_style');
        const c = localStorage.getItem('autoreels_color');
        if (s && KIT_LEGACY_ALIASES[s] && !DESIGN_STYLES.some((d) => d.id === s)) {
          s = KIT_LEGACY_ALIASES[s];
        }
        if (s && DESIGN_STYLES.some((d) => d.id === s)) campaign.designStyle = s;
        if (c && COLOR_PALETTES.some((p) => p.id === c)) campaign.colorKey = c;
      } catch (e) {}
      if (!campaign.designStyle || !DESIGN_STYLES.some((d) => d.id === campaign.designStyle)) campaign.designStyle = DESIGN_STYLES[0].id;
      if (!campaign.colorKey) campaign.colorKey = 'default';
    }
    function getActiveDesign() {
      return DESIGN_STYLES.find((d) => d.id === campaign.designStyle) || DESIGN_STYLES[0];
    }
    function getActivePalette() {
      return COLOR_PALETTES.find((p) => p.id === campaign.colorKey) || COLOR_PALETTES[0];
    }
    // 디자인 + 색상 → 그리기에 쓰는 값
    function buildDesignVariant(design, palette) {
      const lightBg = design.engine === 'kit'
        ? (design.bg === 'paper' || design.bg === 'white' || design.bg === 'cream') && !['full', 'blinds', 'duo', 'dim', 'handheld'].includes(design.layout)
        : design.genre === 'trust' || design.genre === 'finance';
      let accent = design.accent;
      let accent2 = design.accent2;
      if (palette && palette.accent) {
        accent = gReadableAccent(palette.accent, lightBg);
        accent2 = palette.accent2;
      }
      return { genre: design.genre, label: design.label, sig: design.sig, grade: design.grade, accent, accent2 };
    }

    // ---------- 디자인 스타일 · 색상 고르기 화면 ----------
    // 미리보기는 색상·길이가 바뀌어도 지우지 않고, 새 그림으로 하나씩 바꿔 끼움 (빈 칸이 생기지 않게)
    let designThumbCache = { key: '', urls: {}, fresh: {} };
    let designThumbJob = null;
    function designThumbKey() {
      if (!window.__timelines || !window.__timelines.main) return '';
      const photos = campaign.uploadedPhotos || [];
      const ready = photos.every((p) => !p || p._isVideo || (p.complete && p.naturalWidth > 0));
      if (!ready) return '';
      const photoKey = photos.map((p) => (p && (p._label || p.src || '').slice(-24)) || '').join('|');
      return `${window.__genreFontsReady ? 'F' : 'f'}|${IND.key}|${campaign.colorKey}|${photoKey}|${getSelectedDealer().id}|${campaign.cutCaptions && campaign.cutCaptions[0]}|${TOTAL_DURATION}`;
    }
    function syncDesignThumbKey() {
      const key = designThumbKey();
      if (key && designThumbCache.key !== key) {
        designThumbCache.key = key;
        designThumbCache.fresh = {};
      }
      return key;
    }
    function getDesignPickerList() {
      const cat = campaign.designCat || '전체';
      const vis = arVisibleDesigns();
      return cat === '전체' ? vis : vis.filter((ds) => ds.cat === cat);
    }
    function renderDesignThumbBatch(list) {
      const saved = campaign.designStyle;
      const mainDuration = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const totalCuts = getTargetCutCount();
      const thumb = document.createElement('canvas');
      thumb.width = 162;
      thumb.height = 288;
      const tctx = thumb.getContext('2d');
      try {
        list.forEach((ds) => {
          campaign.designStyle = ds.id;
          renderGenreFrame((mainDuration / totalCuts) * 0.9, mainDuration, totalCuts, getSelectedDealer());
          tctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
          const url = thumb.toDataURL('image/jpeg', 0.72);
          designThumbCache.urls[ds.id] = url;
          designThumbCache.fresh[ds.id] = true;
          const el = document.getElementById('dthumb_' + ds.id);
          if (el) el.src = url;
          const el2 = document.getElementById('pdthumb_' + ds.id);
          if (el2) el2.src = url;
        });
      } catch (e) {}
      campaign.designStyle = saved;
      window.__timelines.main.seek(window.__timelines.main.currentTime);
    }
    function scheduleDesignThumbs() {
      if (designThumbJob) return;
      const step = () => {
        designThumbJob = null;
        const key = syncDesignThumbKey();
        if (!key || window.__exportingVideo) {
          designThumbJob = setTimeout(step, key ? 1500 : 700);
          return;
        }
        const todo = getDesignPickerList().concat(arVisibleDesigns()).filter((ds) => !designThumbCache.fresh[ds.id]);
        if (!todo.length) return;
        const batch = todo.filter((ds, i, arr) => arr.indexOf(ds) === i).slice(0, 6);
        const fonts = [...new Set(batch.filter((ds) => ds.engine === 'kit').flatMap((ds) => [ds.font, ds.sfont, 'brush'].filter(Boolean)))];
        designThumbJob = true;
        Promise.race([Promise.all(fonts.map(kitEnsureFont)), new Promise((r) => setTimeout(r, 2500))]).then(() => {
          if (designThumbCache.key === key && !window.__exportingVideo) renderDesignThumbBatch(batch);
          designThumbJob = setTimeout(step, 40);
        });
      };
      designThumbJob = setTimeout(step, 0);
    }

    // ---------- 디자인에 어울리는 배경음악 ----------
    const DESIGN_BGM_BY_CAT = {
      특가: ['urban', 'edm'], 고급: ['luxury', 'jazz', 'cinema'], 테크: ['drive', 'edm'], 스포츠: ['edm', 'urban'],
      '상담·정보': ['showroom', 'bright'], 신뢰: ['ballad', 'showroom'], 감성: ['lofi', 'ballad'], 재미: ['funk', 'bright'],
      '뉴스·방송': ['news'], 손글씨: ['lofi', 'ballad', 'jazz'], 타이포: ['urban', 'drive', 'edm'], 브이로그: ['vlog', 'lofi', 'bright']
    };
    function getDesignBgm(ds) {
      if (!ds) return 'showroom';
      if (ds.bgm) return ds.bgm;
      if (ds.industry) {
        const byInd = { restaurant: ['vlog', 'funk', 'bright'], cafe: ['lofi', 'jazz', 'vlog'], beauty: ['bright', 'lofi', 'luxury'], realestate: ['showroom', 'luxury', 'ballad'],
          academy: ['bright', 'showroom', 'vlog'], clinic: ['ballad', 'showroom', 'lofi'], fitness: ['edm', 'urban', 'funk'], shop: ['bright', 'funk', 'edm'], interior: ['jazz', 'showroom', 'lofi'] };
        if (ds.layout === 'handheld') return 'vlog';
        const opts = byInd[ds.industry] || ['showroom'];
        return opts[gHash(ds.id) % opts.length];
      }
      if (ds.cap === 'cinema' || ds.layout === 'film' || /cinema|subtitle|credits|spot/.test(ds.id)) return 'cinema';
      const opts = DESIGN_BGM_BY_CAT[ds.cat] || ['showroom'];
      return opts[gHash(ds.id) % opts.length];
    }
    // 디자인을 바꾸면 배경음악도 바꿈. 직접 불러온 음원이나 'BGM 끄기'는 그대로 둠
    function applyDesignBgm(ds, restart) {
      if (typeof AudioEngine === 'undefined') return;
      if (AudioEngine.bgmStyle === 'custom_mp3' || AudioEngine.bgmStyle === 'off') return;
      const key = getDesignBgm(ds);
      if (!AudioEngine.BGM_STYLES[key]) return;
      const changed = AudioEngine.bgmStyle !== key;
      AudioEngine.bgmStyle = key;
      const sel = document.getElementById('bgmStyleSelect');
      if (sel) sel.value = key;
      if (changed && restart && AudioEngine.enabled) AudioEngine.startBgmLoop();
    }

    function selectDesignCat(cat) {
      campaign.designCat = cat;
      renderDesignStylePicker();
    }

    function renderDesignStylePicker() {
      const grid = document.getElementById('designStyleGrid');
      syncDesignThumbKey();
      const urls = designThumbCache.urls;
      const active = getActiveDesign().id;
      const cat = campaign.designCat || '전체';
      const tabs = document.getElementById('designCatTabs');
      if (tabs) {
        const vis = arVisibleDesigns();
        tabs.innerHTML = arDesignCats().map((c) => {
          const n = c === '전체' ? vis.length : vis.filter((ds) => ds.cat === c).length;
          const on = c === cat;
          return `<button type="button" onclick="selectDesignCat('${c}')" class="shrink-0 px-2.5 py-1 rounded-[6px] text-[11px] font-medium border cursor-pointer ${on ? 'border-[#ededed] bg-[#232325] text-white' : 'border-[var(--border)] text-[#a1a1a6] hover:text-[#ededed]'}">${c} <span class="text-[#6e6e73]">${n}</span></button>`;
        }).join('');
      }
      if (grid) grid.innerHTML = getDesignPickerList().map((ds) => {
        const on = ds.id === active;
        const src = urls[ds.id] || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        return `
          <button type="button" onclick="selectDesignStyle('${ds.id}')" title="${ds.desc}"
            class="text-left p-1.5 rounded-[9px] border transition-colors cursor-pointer ${on ? 'border-[#ededed] bg-[#232325]' : 'border-[var(--border)] bg-[#141415] hover:border-[rgba(237,237,237,0.3)]'}">
            <img id="dthumb_${ds.id}" src="${src}" alt="" class="w-full aspect-[9/16] object-cover rounded-[6px] bg-[#0f0f10]" />
            <div class="mt-1.5 px-0.5 text-[12px] font-medium ${on ? 'text-white' : 'text-[#d4d4d8]'} truncate">${ds.name}</div>
          </button>`;
      }).join('');
      const nameEl = document.getElementById('activeDesignName');
      if (nameEl) nameEl.textContent = `${getActiveDesign().name} · ${getActivePalette().name}`;
      const descEl = document.getElementById('activeDesignDesc');
      if (descEl) {
        const bk = typeof AudioEngine !== 'undefined' && AudioEngine.bgmStyle ? AudioEngine.bgmStyle : getDesignBgm(getActiveDesign());
        const bl = (typeof AudioEngine !== 'undefined' && AudioEngine.BGM_LABELS && AudioEngine.BGM_LABELS[bk]) || (bk === 'custom_mp3' ? '내가 불러온 음원' : bk === 'off' ? '끔' : bk);
        descEl.textContent = `${getActiveDesign().desc}  ·  배경음악: ${bl}`;
      }
      const countEl = document.getElementById('designStyleCount');
      if (countEl) countEl.textContent = String(arVisibleDesigns().length);
      if (typeof updateTrendSwapStatusUI === 'function') updateTrendSwapStatusUI();
      scheduleDesignThumbs();
      const pd = document.getElementById('presetDrawer');
      if (pd && pd.classList.contains('open') && typeof renderPresetDrawer === 'function') renderPresetDrawer();
    }

    function renderColorPalettePicker() {
      const design = getActiveDesign();
      const html = COLOR_PALETTES.map((p) => {
        const on = p.id === campaign.colorKey;
        const sw = p.accent || design.accent;
        const dot = p.id === 'default'
          ? `<span class="w-3 h-3 rounded-full shrink-0" style="background: conic-gradient(${design.accent} 0 50%, ${design.accent2} 50% 100%)"></span>`
          : `<span class="w-3 h-3 rounded-full shrink-0" style="background:${sw}"></span>`;
        return `<button type="button" onclick="selectColorPalette('${p.id}')" class="theme-swatch-chip shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-[6px] text-[11px] font-medium border cursor-pointer ${on ? 'border-[#ededed] bg-[#232325] text-white' : 'border-[var(--border)] text-[#a1a1a6] hover:text-[#ededed]'}">${dot}<span class="truncate">${p.name}</span></button>`;
      }).join('');
      ['desktopThemeSwatches', 'mobileThemeSwatches', 'designColorSwatches'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      });
      ['desktopActiveThemeName', 'mobileActiveThemeName'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = getActivePalette().name;
          el.style.color = getActivePalette().accent || design.accent;
        }
      });
    }

    function getShuffleIncludeCats() {
      try {
        const raw = localStorage.getItem('autoreels_shuffle_cats');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && x && x !== '전체') : [];
      } catch (e) { return []; }
    }
    function updateShuffleFilterBadge() {
      const badge = document.getElementById('shuffleFilterBadge');
      if (!badge) return;
      const sel = getShuffleIncludeCats();
      if (sel.includes('__keep__')) badge.textContent = '변경없음';
      else if (!sel.length) badge.textContent = '전체';
      else if (sel.length === 1) badge.textContent = sel[0];
      else badge.textContent = `${sel.length}종`;
    }
    function getShuffleExcludedIds() {
      try {
        const raw = localStorage.getItem('autoreels_shuffle_excluded');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && x) : [];
      } catch (e) { return []; }
    }
    function setShuffleExcludedIds(arr) {
      try { localStorage.setItem('autoreels_shuffle_excluded', JSON.stringify(Array.isArray(arr) ? arr : [])); } catch (e) {}
      window.__arStyleBag = [];
      renderShuffleFilterPanel();
    }
    function excludeStyleFromShuffle(id) {
      if (!id) return;
      const cur = getShuffleExcludedIds();
      if (!cur.includes(id)) cur.push(id);
      setShuffleExcludedIds(cur);
    }
    function restoreShuffleExcluded(id) {
      setShuffleExcludedIds(getShuffleExcludedIds().filter((x) => x !== id));
    }
    function clearShuffleExcluded() {
      setShuffleExcludedIds([]);
    }
    function renderShuffleFilterPanel() {
      const box = document.getElementById('shuffleFilterChips');
      if (!box) return;
      const cats = (typeof arDesignCats === 'function' ? arDesignCats() : DESIGN_CATS).filter((c) => c !== '전체');
      const rawSel = getShuffleIncludeCats();
      const keepMode = rawSel.includes('__keep__');
      const sel = new Set(keepMode ? [] : rawSel);
      const btnAll = document.getElementById('shufflePresetAllBtn');
      const btnNew = document.getElementById('shufflePresetNewBtn');
      const btnKeep = document.getElementById('shufflePresetKeepBtn');
      const setPresetBtn = (el, on) => {
        if (!el) return;
        el.className = on
          ? 'px-2 py-0.5 rounded bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 text-[#38bdf8] font-semibold text-[11px] cursor-pointer'
          : 'px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#ededed] text-[11px] cursor-pointer';
      };
      setPresetBtn(btnAll, !keepMode && sel.size === 0);
      setPresetBtn(btnNew, !keepMode && sel.size === 1 && sel.has('신규'));
      setPresetBtn(btnKeep, keepMode);
      box.innerHTML = cats.map((c) => {
        const active = !keepMode && (sel.size === 0 || sel.has(c));
        const picked = !keepMode && sel.has(c);
        return `<button type="button" onclick="toggleShuffleCat('${c.replace(/'/g, "\\'")}')" class="px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition ${picked ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] font-semibold' : active ? 'bg-white/5 border-white/10 text-[#d4d4d8]' : 'bg-transparent border-white/5 text-[#6b7280] opacity-60'}">${c}</button>`;
      }).join('');
      const exBox = document.getElementById('shuffleExcludedChips');
      const clearBtn = document.getElementById('clearShuffleExcludedBtn');
      if (exBox) {
        const exIds = getShuffleExcludedIds();
        if (clearBtn) clearBtn.classList.toggle('hidden', exIds.length === 0);
        if (!exIds.length) {
          exBox.innerHTML = '<span>없음 · 섞기 후 위 알림을 누르면 현재 스타일이 빠집니다</span>';
        } else {
          exBox.innerHTML = exIds.map((id) => {
            const d = (typeof DESIGN_STYLES !== 'undefined' ? DESIGN_STYLES : []).find((x) => x.id === id);
            const nm = d ? d.name : id;
            return `<button type="button" onclick="restoreShuffleExcluded('${id.replace(/'/g, "\\'")}')" class="px-2 py-0.5 rounded-[6px] bg-[#2a1414] border border-[#e5484d]/50 text-[#fca5a5] hover:text-white cursor-pointer" title="클릭하면 다시 섞기에 포함됩니다">✕ ${nm}</button>`;
          }).join('');
        }
      }
      updateShuffleFilterBadge();
    }
    function setShuffleIncludeCats(arr) {
      try { localStorage.setItem('autoreels_shuffle_cats', JSON.stringify(Array.isArray(arr) ? arr : [])); } catch (e) {}
      window.__arStyleBag = [];
      renderShuffleFilterPanel();
    }
    function toggleShuffleCat(cat) {
      const cur = getShuffleIncludeCats().filter((x) => x !== '__keep__');
      const idx = cur.indexOf(cat);
      if (idx >= 0) cur.splice(idx, 1);
      else cur.push(cat);
      setShuffleIncludeCats(cur);
    }
    function toggleShuffleFilterPanel(force) {
      const panel = document.getElementById('shuffleFilterPanel');
      if (!panel) return;
      const show = typeof force === 'boolean' ? force : panel.classList.contains('hidden');
      panel.classList.toggle('hidden', !show);
      if (show) renderShuffleFilterPanel();
    }
    if (typeof document !== 'undefined') setTimeout(updateShuffleFilterBadge, 0);

    function randomizePreviewDesignOnly() {
      // 대본·업종·사진은 유지하고, 설정한 카테고리 및 제외 목록을 반영해 랜덤 전환
      const allDesigns = typeof arVisibleDesigns === 'function' ? arVisibleDesigns() : (typeof DESIGN_STYLES !== 'undefined' ? DESIGN_STYLES : []);
      const includeCats = getShuffleIncludeCats();
      if (includeCats.includes('__keep__')) {
        if (typeof arToast === 'function') {
          const shuffleBtn = [document.getElementById('previewRandomDesignBtnMain'), document.getElementById('previewRandomDesignBtn')].find((b) => b && b.offsetParent !== null);
          arToast('🔒 현재 테마 유지 중 (스타일 변경 없음)', false, shuffleBtn || null);
        }
        if (window.__timelines?.main) {
          if (typeof AudioEngine !== 'undefined') AudioEngine.stopTts();
          window.__timelines.main.seek(0);
          if (!isPlaying) {
            isPlaying = true;
            const ppBtn = document.getElementById('playPauseBtn');
            if (ppBtn) ppBtn.textContent = '⏸ 일시정지';
          }
        }
        return;
      }
      const catFiltered = includeCats.length
        ? allDesigns.filter((d) => includeCats.includes(d.industry ? '내 업종' : (d.cat || '')))
        : allDesigns;
      const basePool = catFiltered.length ? catFiltered : allDesigns;
      const excluded = new Set(getShuffleExcludedIds());
      const pool = basePool.filter((d) => !excluded.has(d.id));
      const designs = pool.length ? pool : basePool;
      if (designs.length > 0 && typeof selectDesignStyle === 'function') {
        // 보이는 디자인 전체(81종 등)를 섞은 순서대로 한 번씩 다 보여 준 뒤 다시 섞음 (같은 몇 개만 반복되지 않게)
        const curId = campaign.designStyle;
        const ids = designs.map((x) => x.id);
        if (!Array.isArray(window.__arStyleBag) || window.__arStyleBagKey !== ids.join(',')) { window.__arStyleBag = []; window.__arStyleBagKey = ids.join(','); }
        if (!window.__arStyleBag.length) {
          const bag = ids.filter((id) => id !== curId);
          for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
          // 바로 앞 디자인과 분류·화면 방식(엔진)이 겹치지 않게 순서를 다시 고름 (비슷한 모양이 연달아 나오지 않도록)
          const info = (id) => { const d = designs.find((x) => x.id === id) || {}; return { cat: d.cat || '', eng: (d.engine || '') + '/' + (d.mstyle || '') }; };
          const spread = [];
          let prev = info(curId);
          while (bag.length) {
            let k = bag.findIndex((id) => { const f = info(id); return f.cat !== prev.cat && f.eng !== prev.eng; });
            if (k < 0) k = bag.findIndex((id) => info(id).cat !== prev.cat);
            if (k < 0) k = 0;
            const id = bag.splice(k, 1)[0];
            spread.push(id);
            prev = info(id);
          }
          window.__arStyleBag = spread.length ? spread : ids.slice();
          window.__arStyleBagTotal = window.__arStyleBag.length;
        }
        const pickId = window.__arStyleBag.shift();
        const pick = designs.find((x) => x.id === pickId) || designs[0];
        selectDesignStyle(pick.id);
        // 어떤 디자인으로 바뀌었는지 버튼 바로 위에 보여 주고, 클릭하면 설정창 열기 + 현재 스타일 랜덤 제외
        if (typeof arToast === 'function') {
          const shuffleBtn = [document.getElementById('previewRandomDesignBtnMain'), document.getElementById('previewRandomDesignBtn')].find((b) => b && b.offsetParent !== null);
          const idxNow = (window.__arStyleBagTotal || designs.length) - window.__arStyleBag.length;
          const totalNow = window.__arStyleBagTotal || designs.length;
          arToast(
            `🎲 ${pick.name}${pick.cat ? ' · ' + pick.cat : ''} (${idxNow}/${totalNow}) · 누르면 설정·제외`,
            true,
            shuffleBtn || null,
            () => {
              excludeStyleFromShuffle(pick.id);
              toggleShuffleFilterPanel(true);
              arToast(`🚫 '${pick.name}'을 랜덤 섞기에서 뺐습니다`, false, shuffleBtn || null);
            }
          );
        }
      }
      if (typeof selectColorPalette === 'function') {
        // 대부분 디자인 고유의 조화로운 기본색을 유지하고, 가끔만 다른 팔레트 적용
        if (Math.random() < 0.7 || !Array.isArray(COLOR_PALETTES) || !COLOR_PALETTES.length) {
          selectColorPalette('default');
        } else {
          const pal = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
          if (pal && pal.id) selectColorPalette(pal.id);
        }
      }
      if (Array.isArray(campaign.scenePlan)) {
        campaign.scenePlan = campaign.scenePlan.map((p) => {
          if (!p) return p;
          const next = { ...p };
          delete next.customLayout;
          delete next.customCap;
          delete next.customDeco;
          return next;
        });
      }
      campaign.motionSeed = Math.floor(Math.random() * 9973);
      if (typeof renderDynamicCutCardsUI === 'function') renderDynamicCutCardsUI();
      if (typeof renderDesignStylePicker === 'function') { try { renderDesignStylePicker(); } catch (e) {} }
      // 새 스타일은 처음(0초)부터 다시 재생해서 보여 줌
      if (window.__timelines?.main) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.stopTts();
        window.__timelines.main.seek(0);
        if (!isPlaying) {
          isPlaying = true;
          const ppBtn = document.getElementById('playPauseBtn');
          if (ppBtn) ppBtn.textContent = '⏸ 일시정지';
        }
        if (typeof AudioEngine !== 'undefined' && AudioEngine.enabled) {
          AudioEngine.lastSpokenCut = -1;
          if (AudioEngine.masterBuffer) AudioEngine.playMasterAt(0);
        }
      }
    }

    function selectDesignStyle(id) {
      if (!DESIGN_STYLES.some((d) => d.id === id)) return;
      campaign.designStyle = id;
      try { localStorage.setItem('autoreels_design_style', id); } catch (e) {}
      if (typeof recordDesignUse === 'function') recordDesignUse(id);
      const dsel = DESIGN_STYLES.find((d) => d.id === id);
      applyDesignBgm(dsel, true);
      if (dsel && (dsel.engine === 'kit' || dsel.engine === 'motion')) {
        Promise.all([dsel.font, dsel.sfont, dsel.engine === 'kit' ? 'brush' : null, dsel.insta ? 'maruL' : null, dsel.insta ? 'pretL' : null, dsel.insta ? 'maru' : null, dsel.insta ? 'pretM' : null].filter(Boolean).map(kitEnsureFont)).then(() => {
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        });
      }
      renderDesignStylePicker();
      renderColorPalettePicker();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
    }
    function selectColorPalette(id) {
      if (!COLOR_PALETTES.some((p) => p.id === id)) return;
      campaign.colorKey = id;
      try { localStorage.setItem('autoreels_color', id); } catch (e) {}
      renderColorPalettePicker();
      renderDesignStylePicker();
      if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
    }

    // ==========================================================================
    // 진입점: 한 프레임을 장르 엔진으로 그림
    // ==========================================================================
    function drawCustomCutWidget(c, W, H, t, cutIdx, localFrac, widgetType, d, V) {
      if (!widgetType) return;
      const accent = (V && V.accent) || '#3b82f6';
      const ink = (V && V.inkOnAccent) || '#ffffff';
      const place = (typeof IND !== 'undefined' && IND.place) || '매장';
      const cta = (typeof IND !== 'undefined' && IND.cta) || '안내';
      const ask = (typeof IND !== 'undefined' && IND.chatAsk) || '자세히 알고 싶어요!';
      const rawLbl = (typeof WIDGET_LABELS !== 'undefined' && WIDGET_LABELS[widgetType]) || widgetType;
      const wLbl = (typeof indWord === 'function' ? indWord(rawLbl) : rawLbl).replace(/^[^\w가-힣]+/, '').trim();
      const pop = typeof gBack === 'function' ? gBack(Math.min(1, localFrac * 2.5)) : 1;
      c.save();
      c.globalAlpha = 0.96;

      if (widgetType === 'MAGAZINE_COVER') {
        c.strokeStyle = 'rgba(255,255,255,0.85)';
        c.lineWidth = 4;
        c.strokeRect(18, 18, W - 36, H - 36);
        c.fillStyle = 'rgba(255,255,255,0.92)';
        c.font = '800 18px Georgia, serif';
        c.textAlign = 'center';
        c.fillText(`EDITORIAL · ISSUE 0${cutIdx + 1}`, W / 2, 54);
      } else if (widgetType === 'BREAKING_NEWS') {
        c.fillStyle = '#dc2626';
        c.fillRect(0, 56, W, 38);
        c.fillStyle = '#ffffff';
        c.font = '900 16px "Noto Sans KR", sans-serif';
        c.textAlign = 'left';
        c.fillText(`🔴 LIVE · ${wLbl || '핵심 안내'}`, 24, 81);
      } else if (widgetType === 'GIANT_DISCOUNT_STAMP') {
        c.translate(W - 108, 132);
        c.rotate(-0.18);
        c.scale(pop, pop);
        c.strokeStyle = accent;
        c.lineWidth = 4;
        c.beginPath(); c.arc(0, 0, 52, 0, Math.PI * 2); c.stroke();
        c.fillStyle = 'rgba(0,0,0,0.55)'; c.fill();
        c.fillStyle = accent;
        c.font = '900 18px "Noto Sans KR", sans-serif';
        c.textAlign = 'center';
        c.fillText(cta, 0, 6);
      } else if (widgetType === 'KAKAO_CHAT_PAIR') {
        if (typeof gRoundRect === 'function') {
          gRoundRect(c, 28, 92, W - 140, 44, 16);
          c.fillStyle = '#fee500'; c.fill();
          c.fillStyle = '#18181b';
          c.font = '700 15px "Noto Sans KR", sans-serif';
          c.textAlign = 'left';
          c.fillText(`💬 ${ask.slice(0, 20)}`, 44, 120);
          gRoundRect(c, 120, 144, W - 148, 42, 16);
          c.fillStyle = 'rgba(255,255,255,0.95)'; c.fill();
          c.fillStyle = '#18181b';
          c.fillText(`✨ ${place}에서 바로 안내해 드려요!`, 136, 170);
        }
      } else if (widgetType === 'DYNAMIC_ISLAND') {
        if (typeof gRoundRect === 'function') {
          gRoundRect(c, W / 2 - 130, 26, 260, 42, 21);
          c.fillStyle = '#09090b'; c.fill();
          c.strokeStyle = accent; c.lineWidth = 1.5; c.stroke();
          c.fillStyle = '#ffffff';
          c.font = '700 14px "Noto Sans KR", sans-serif';
          c.textAlign = 'center';
          c.fillText(`● CUT ${cutIdx + 1} · ${d.name || place}`, W / 2, 52);
        }
      } else if (widgetType === 'TECH_HUD') {
        c.strokeStyle = accent; c.lineWidth = 3;
        const L = 32;
        [[24, 24, 1, 1], [W - 24, 24, -1, 1], [24, H - 24, 1, -1], [W - 24, H - 24, -1, -1]].forEach(([x, y, dx, dy]) => {
          c.beginPath(); c.moveTo(x, y + dy * L); c.lineTo(x, y); c.lineTo(x + dx * L, y); c.stroke();
        });
        c.fillStyle = accent;
        c.font = '700 13px monospace';
        c.textAlign = 'left';
        c.fillText(`REC ● SCENE 0${cutIdx + 1}`, 42, 52);
      } else if (widgetType === 'NEON_TITLE') {
        c.strokeStyle = accent; c.lineWidth = 5;
        c.shadowColor = accent; c.shadowBlur = 18;
        c.strokeRect(14, 14, W - 28, H - 28);
        c.shadowBlur = 0;
      } else if (widgetType === 'RACING_RIBBON') {
        c.translate(72, 72);
        c.rotate(-0.65);
        c.fillStyle = accent;
        c.fillRect(-120, -18, 240, 36);
        c.fillStyle = ink;
        c.font = '900 15px "Noto Sans KR", sans-serif';
        c.textAlign = 'center';
        c.fillText(`★ ${cta} 추천`, 0, 6);
      } else {
        if (typeof gRoundRect === 'function') {
          gRoundRect(c, 26, 76, Math.min(W - 52, 260), 40, 12);
          c.fillStyle = 'rgba(15,15,18,0.78)'; c.fill();
          c.strokeStyle = accent; c.lineWidth = 1.8; c.stroke();
          c.fillStyle = '#ffffff';
          c.font = '800 15px "Noto Sans KR", sans-serif';
          c.textAlign = 'left';
          c.fillText(`✦ ${wLbl || cta}`, 42, 102);
        }
      }
      c.restore();
    }
