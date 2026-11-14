// AutoReels — 07-motion-styles.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ==========================================================================
    // ★ 모션그래픽 엔진 — 기존 키트·장르와 별개로 처음부터 그리는 새 스타일 10종
    //   화면 구역을 고정해 겹치지 않게: 위 사진 무대(0~58%) · 자막(62~86%) · 이름 칩(91% 아래)
    // ==========================================================================
    const MOTION_ROWS = [
      // [id, 이름, 움직임, 글꼴, 바탕1, 바탕2, 강조색, 보조색, 밝은바탕]
      ['mo_blob', '리퀴드 블롭', 'blob', 'dohyeon', '#1e1b4b', '#4c1d95', '#f472b6', '#fde68a', false],
      ['mo_sweep', '키네틱 스윕', 'sweep', 'impact', '#0a0a0a', '#111827', '#facc15', '#ef4444', false],
      ['mo_tiles', '타일 플립', 'tiles', 'sans', '#0b1220', '#111c33', '#38bdf8', '#e0f2fe', false],
      ['mo_tunnel', '줌 터널', 'tunnel', 'gasoek', '#050505', '#18181b', '#a3e635', '#ffffff', false],
      ['mo_cards', '스와이프 카드', 'cards', 'jua', '#fff7ed', '#ffedd5', '#f97316', '#111111', true],
      ['mo_eq', '이퀄라이저 링', 'eq', 'gugi', '#020617', '#0f172a', '#22d3ee', '#f0abfc', false],
      ['mo_aurora', '오로라 플로트', 'aurora', 'sans', '#0f0a1e', '#1a1033', '#c084fc', '#67e8f9', false],
      ['mo_dots', '하프톤 웨이브', 'dots', 'bagel', '#fef08a', '#fde047', '#111111', '#ef4444', true],
      ['mo_number', '넘버 마스크', 'number', 'impact', '#111111', '#1f2937', '#fb7185', '#ffffff', false],
      ['mo_strips', '패럴랙스 스트립', 'strips', 'dohyeon', '#0c0a09', '#1c1917', '#fb923c', '#fef3c7', false],
      ['mo_circle', '서클 와이프', 'circle', 'sans', '#0a0a0a', '#18181b', '#34d399', '#ffffff', false],
      ['mo_ribbon', '리본 티커', 'ribbon', 'impact', '#111827', '#1e293b', '#facc15', '#f43f5e', false],
      ['mo_doors', '미러 도어', 'doors', 'serif', '#0c0a09', '#1c1917', '#d4af37', '#fef3c7', false],
      ['mo_bounce', '바운스 타이포', 'bounce', 'bagel', '#ecfeff', '#cffafe', '#0ea5e9', '#f43f5e', true],
      // 인스타·릴스 템플릿 감성
      ['ig_story', '인스타 스토리', 'story', 'sans', '#111111', '#262626', '#ff3d77', '#ffd600', false],
      ['ig_feed', '피드 포스트', 'feed', 'sans', '#fafafa', '#f1f1f1', '#ff3040', '#0095f6', true],
      ['ig_poll', '투표 스티커', 'poll', 'jua', '#7c3aed', '#db2777', '#ffffff', '#facc15', false],
      ['mo_vhs', 'VHS 캠코더', 'vhs', 'mono', '#050505', '#111111', '#ff3b3b', '#7dd3fc', false],
      ['mo_neon', '네온 사인', 'neon', 'dohyeon', '#0b0b12', '#141420', '#ff4fd8', '#4ff0ff', false],
      ['mo_scrap', '스크랩북 콜라주', 'scrap', 'gamja', '#f5efe6', '#ede3d3', '#e11d48', '#0f766e', true],
      ['mo_punch', '줌 펀치', 'punch', 'gasoek', '#000000', '#0a0a0a', '#ffffff', '#ff2d55', false],
      ['mo_cube', '큐브 플립', 'cube', 'sans', '#0f172a', '#1e1b4b', '#818cf8', '#f9a8d4', false],
      // 2026-11 캡컷 트렌드 분석(docs/motion-research)에서 온 4종
      ['mo_glow', '카메라 글로우', 'glow', 'serif', '#1a0f08', '#2b1709', '#fb923c', '#fde68a', false],
      ['mo_bokeh', '보케 스포트라이트', 'bokeh', 'sans', '#120a1c', '#1e1030', '#f0abfc', '#fde68a', false],
      ['mo_cinema', '시네마 레터박스', 'cinema', 'serif', '#000000', '#0c0a09', '#d4af37', '#f5f5f4', false],
      ['mo_credits', '엔딩 크레딧 롤', 'credits', 'sans', '#0a0a0c', '#111114', '#facc15', '#ffffff', false],
      // 2026-11 인스타 감성(카페·브이로그): 크림톤·필름 그레인·얇은 명조·작은 자막·여백·"— 가게명" 서명
      ['in_film', '크림 필름', 'in_film', 'maru', '#f3ece1', '#efe6d8', '#8a6a4f', '#2b2622', true],
      ['in_mood', '무드 풀샷', 'in_mood', 'maru', '#1a1512', '#120e0c', '#e8d5bc', '#ffffff', false],
      ['in_diary', '다이어리 노트', 'in_diary', 'pen', '#fbf8f1', '#f6f1e6', '#b07a5a', '#3b2f28', true],
      ['in_letter', '미니멀 레터', 'in_letter', 'pretL', '#f7f5f0', '#f2efe8', '#9a8f80', '#2a2724', true],
      ['in_vlog', '브이로그 타임스탬프', 'in_vlog', 'pretM', '#111111', '#0b0b0b', '#f5e6c8', '#ffffff', false],
      ['in_collage', '크림 콜라주', 'in_collage', 'maru', '#efe7da', '#e9dfcf', '#a0785a', '#2d2621', true],
      // 핀터레스트 "인스타 릴스 감성 템플릿"에서 자주 보이는 형식 (2026-11-14 확인)
      ['in_music', '뮤직 플레이어', 'in_music', 'maru', '#1a1512', '#120e0c', '#e8d5bc', '#ffffff', false],
      ['in_memo', '아이폰 메모', 'in_memo', 'pretM', '#fbfaf7', '#f7f5f0', '#e0a400', '#1c1c1e', true],
      ['in_lock', '잠금화면 시계', 'in_lock', 'pretL', '#111111', '#0b0b0b', '#ffffff', '#ffffff', false],
      ['in_dump', '포토덤프 리캡', 'in_dump', 'pen', '#f4efe6', '#efe8dc', '#c2603f', '#2d2621', true],
      ['in_cal', '캘린더 카드', 'in_cal', 'maru', '#f3ece1', '#efe6d8', '#c2603f', '#2b2622', true],
      // 제미나이 제안 인스타 감성 6종 (2026-11-14)
      ['in_h_plaque', '전시 캡션 카드', 'in_h_plaque', 'maru', '#f5efe6', '#ebe2d5', '#5c4d40', '#8c7a6b', true],
      ['in_h_panes', '세 갈래 시선', 'in_h_panes', 'gowun', '#1f1a17', '#14110f', '#e8dccb', '#b8a692', false],
      ['in_h_double', '이중노출 잔상', 'in_h_double', 'maruL', '#1c1815', '#120f0d', '#efe5d8', '#bca995', false],
      ['in_h_vinyl', '오후의 레코드', 'in_h_vinyl', 'gowun', '#efe7dc', '#e2d6c5', '#3d322a', '#8c7765', true],
      // 제미나이 제안 인스타 감성 6종 (2026-11-14)
  ['in_g_sub', '시네마 자막', 'in_g_sub', 'gowun', '#191512', '#120f0d', '#e6ccb2', '#ffffff', false],
  ['in_g_arch', '아치 무드', 'in_g_arch', 'maru', '#f6f1ea', '#eae1d5', '#8c735b', '#2b2520', true],
  ['in_g_strip', '필름 스트립', 'in_g_strip', 'pen', '#f3ede3', '#e6ddd0', '#7a634e', '#2d2621', true],
  ['in_g_postcard', '엽서 기록', 'in_g_postcard', 'gowun', '#f7f3ec', '#ece4d8', '#9c7e63', '#2c2520', true],
  ['in_g_cam', '뷰파인더', 'in_g_cam', 'pretL', '#1c1815', '#120f0d', '#d8c3a5', '#ffffff', false],
  ['in_g_bookmark', '책갈피 노트', 'in_g_bookmark', 'maruL', '#241e1a', '#171310', '#c7ad92', '#2b2622', false],
      // 인스타 일상 감성 6종: 밀착인화·리넨·잡지·책갈피·산책·창가
      ['in_x_contact', '필름 밀착인화', 'in_x_contact', 'pretL', '#eee6d8', '#e8ddcd', '#987354', '#332b25', true],
      ['in_x_linen', '리넨 위의 사진', 'in_x_linen', 'gowun', '#ece4d6', '#e5dbc9', '#92795f', '#3b342b', true],
      ['in_x_cover', '우리의 작은 잡지', 'in_x_cover', 'maru', '#241e19', '#17130f', '#deceb7', '#fff7e9', false],
      ['in_x_tabs', '붙여둔 한마디', 'in_x_tabs', 'pen', '#29251e', '#1d1914', '#b9bc9e', '#f6edda', false],
      ['in_x_walk', '골목 산책 기록', 'in_x_walk', 'pretL', '#262a22', '#191c17', '#cbd0b8', '#f8f3e7', false],
      ['in_x_window', '창가의 느린 오후', 'in_x_window', 'maruL', '#e7dece', '#ded2be', '#9c8768', '#40372d', true],
      // 인스타 일상 감성 2차 6종: 대화·세로분할·겹노출·찢은인화·사진음반·조각현상
      ['in_y_chat', '사진으로 건넨 말', 'in_y_chat', 'pretM', '#29241e', '#1b1814', '#d5c7a5', '#fcf5e8', false],
      ['in_y_torn', '손끝으로 찢은 풍경', 'in_y_torn', 'pen', '#f3ecdf', '#e8decc', '#b29374', '#fff8ea', true],
      ['in_y_mosaic', '조각조각 스며들다', 'in_y_mosaic', 'pretL', '#eee5d6', '#e3d6c2', '#aa8b6f', '#fff9ee', true],
      // 에디토리얼 · 감각적 릴스 5종
      ['ed_vogue', '보그 에디토리얼', 'ed_vogue', 'maru', '#0c0b0a', '#161412', '#e8d5bc', '#ffffff', false],
      ['ed_glasspill', '글래스 플로우', 'ed_glasspill', 'pretM', '#0b1018', '#141c2b', '#7dd3fc', '#ffffff', false],
      ['ed_kinetic', '키네틱 포스터', 'ed_kinetic', 'impact', '#09090b', '#18181b', '#facc15', '#ffffff', false],
      ['ed_arch', '아치 갤러리', 'ed_arch', 'maru', '#f4efe8', '#ebe3d7', '#9f7a54', '#2b2622', true],
      ['ed_duotone', '듀오톤 포스터', 'ed_duotone', 'dohyeon', '#111827', '#1f2937', '#fb7185', '#fef08a', false],
      // 비포·애프터 5종
      ['ba_slider', '슬라이더 와이프', 'ba_slider', 'pretM', '#0b0f19', '#111827', '#38bdf8', '#ffffff', false],
      ['ba_diagonal', '대각선 체인지', 'ba_diagonal', 'impact', '#09090b', '#18181b', '#facc15', '#ffffff', false],
      ['ba_collage', '나란히 비교', 'ba_collage', 'pretM', '#0f172a', '#1e293b', '#34d399', '#ffffff', false],
      ['ba_flash', '비포→애프터 전환', 'ba_flash', 'dohyeon', '#111111', '#1c1917', '#fb923c', '#ffffff', false],
      ['ba_polaroid', '스냅 비교 카드', 'ba_polaroid', 'maru', '#f4efe8', '#ebe3d7', '#c2603f', '#2b2622', true]
    ];
    // 모션 디자인도 별도 분류를 만들지 않고 기존 분류에 넣음
    const MOTION_CAT = {
      mo_blob: '재미', mo_sweep: '타이포', mo_tiles: '테크', mo_tunnel: '스포츠', mo_cards: '브이로그', mo_eq: '재미',
      mo_aurora: '감성', mo_dots: '재미', mo_number: '특가', mo_strips: '브이로그', mo_circle: '고급', mo_ribbon: '뉴스·방송',
      mo_doors: '고급', mo_bounce: '타이포', ig_story: '브이로그', ig_feed: '브이로그', ig_poll: '재미', mo_vhs: '브이로그',
      mo_neon: '재미', mo_scrap: '감성', mo_punch: '스포츠', mo_cube: '테크', mo_glow: '감성', mo_bokeh: '고급',
      mo_cinema: '고급', mo_credits: '뉴스·방송',
      in_film: '감성', in_mood: '감성', in_diary: '감성', in_letter: '감성', in_vlog: '브이로그', in_collage: '브이로그',
      in_g_sub: '브이로그', in_g_arch: '감성', in_g_strip: '브이로그', in_g_postcard: '감성', in_g_cam: '브이로그', in_g_bookmark: '감성',
      in_h_plaque: '감성', in_h_panes: '감성', in_h_double: '감성', in_h_vinyl: '감성',
      in_music: '감성', in_memo: '브이로그', in_lock: '감성', in_dump: '브이로그', in_cal: '감성',
      in_x_contact: '브이로그', in_x_linen: '감성', in_x_cover: '감성',
      in_x_tabs: '브이로그', in_x_walk: '브이로그', in_x_window: '감성',
      in_y_chat: '브이로그', 
      in_y_torn: '감성', in_y_mosaic: '브이로그',
      ed_vogue: '신규', ed_glasspill: '신규', ed_kinetic: '신규', ed_arch: '신규', ed_duotone: '신규',
      ba_slider: '비포·애프터', ba_diagonal: '비포·애프터', ba_collage: '비포·애프터', ba_flash: '비포·애프터', ba_polaroid: '비포·애프터'
    };
    const MOTION_DESIGNS = MOTION_ROWS.map((r, i) => ({
      id: r[0], name: r[1], cat: MOTION_CAT[r[0]] || '재미', engine: 'motion', mstyle: r[2], font: r[3],
      bg1: r[4], bg2: r[5], accent: r[6], accent2: r[7], light: r[8], seed: 900 + i, genre: 'motion', grade: 'none', label: r[1],
      insta: String(r[0]).startsWith('in_'), // 인스타 감성: 배경색을 업종 색으로 바꾸지 않고, 엔딩도 크림 카드로
      desc: `모션그래픽 · ${r[1]}`
    }));
    DESIGN_STYLES.push(...MOTION_DESIGNS);

    const mClamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const mEase = (p) => gEase(mClamp(p));
    function mFit(c, text, maxW, maxLines, size, minSize, fontKey) {
      return kWrap(c, text, maxW, maxLines, size, minSize, fontKey);
    }
    // 자막: 줄마다 아래에서 올라오며 나타남
    function mCaption(c, text, x, y, maxW, maxH, size, fontKey, color, e, align = 'center', box = null) {
      const F = KIT_FONTS[fontKey] || KIT_FONTS.sans;
      const maxLines = Math.max(1, Math.min(3, Math.floor(maxH / (size * F.k * 1.28))));
      const r = mFit(c, text, maxW, maxLines, size, Math.round(size * 0.55), fontKey);
      const total = r.lines.length * r.lh;
      const top = y + Math.max(0, (maxH - total) / 2);
      c.save();
      c.textAlign = align;
      c.textBaseline = 'middle';
      c.font = gFont(F.w, r.size, F.f);
      r.lines.forEach((ln, i) => {
        const p = mEase((e - i * 0.12) / 0.5);
        const ly = top + i * r.lh + r.lh / 2 + (1 - p) * 26;
        c.globalAlpha = p;
        if (box) {
          const w = c.measureText(ln).width + 28;
          const bx = align === 'center' ? x - w / 2 : x - 14;
          c.fillStyle = box;
          c.fillRect(bx, ly - r.lh / 2 + 3, w * p, r.lh - 6);
        }
        c.fillStyle = color;
        c.fillText(ln, x, ly);
      });
      c.restore();
      return { top, h: total };
    }
    function mPhoto(c, S, k, x, y, w, h, scale = 1.06, px = 0, py = 0) {
      const img = kitImg(S, k);
      if (!img) {
        const g = c.createLinearGradient(x, y, x, y + h);
        g.addColorStop(0, '#3f4a5c');
        g.addColorStop(1, '#10151f');
        c.fillStyle = g;
        c.fillRect(x, y, w, h);
        return;
      }
      c.save();
      c.beginPath();
      c.rect(x, y, w, h);
      c.clip();
      kitCover(c, img, x, y, w, h, scale, px, py);
      c.restore();
    }
    // ---------- 인스타 감성 도우미 ----------
    let arGrainTile = null;
    function inGrain(c, W, H, t, alpha) {
      if (!arGrainTile) {
        arGrainTile = document.createElement('canvas');
        arGrainTile.width = 160; arGrainTile.height = 160;
        const g = arGrainTile.getContext('2d');
        const im = g.createImageData(160, 160);
        for (let i = 0; i < im.data.length; i += 4) {
          const v = Math.random() * 255;
          im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
          im.data[i + 3] = 255;
        }
        g.putImageData(im, 0, 0);
      }
      c.save();
      c.globalAlpha = alpha;
      c.globalCompositeOperation = 'overlay';
      const ox = Math.floor((Math.sin(t * 37.1) * 0.5 + 0.5) * 160), oy = Math.floor((Math.cos(t * 23.7) * 0.5 + 0.5) * 160);
      for (let y = -oy; y < H; y += 160) for (let x = -ox; x < W; x += 160) c.drawImage(arGrainTile, x, y);
      c.restore();
    }
    // 따뜻한 필름 색감: 노란빛을 살짝 얹고 검은색을 들어 올림
    function inWarm(c, x, y, w, h, k = 1) {
      c.save();
      c.globalCompositeOperation = 'soft-light';
      c.fillStyle = `rgba(255,196,140,${0.32 * k})`;
      c.fillRect(x, y, w, h);
      c.globalCompositeOperation = 'screen';
      c.fillStyle = `rgba(60,44,30,${0.16 * k})`;
      c.fillRect(x, y, w, h);
      c.restore();
    }
    function inDateLabel() {
      const n = new Date();
      return `${String(n.getMonth() + 1).padStart(2, '0')}.${String(n.getDate()).padStart(2, '0')} ${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][n.getDay()]}`;
    }
    // 서명: "— 가게 이름" (명함이 비었으면 그리지 않음)
    function inSign(c, d, x, y, color, align = 'right', size = 18) {
      const name = String((d && d.name) || '').trim();
      if (!name) return;
      c.save();
      c.textAlign = align;
      c.textBaseline = 'middle';
      c.fillStyle = color;
      gDrawLine(c, `— ${name}`, x, y, 300, size, 12, KIT_FONTS.maruL.f, 400);
      c.restore();
    }
    // 작은 영문·숫자 라벨 (자간 넓게)
    function inLabel(c, text, x, y, color, align = 'left', size = 13) {
      c.save();
      c.textAlign = align;
      c.textBaseline = 'middle';
      c.fillStyle = color;
      c.font = gFont(500, size, GENRE_FONTS.sans);
      if ('letterSpacing' in c) c.letterSpacing = '2px';
      c.fillText(text, x, y);
      c.restore();
    }
    // 컷이 바뀔 때 앞 사진에서 부드럽게 겹쳐 바뀜
    function inPhotoFade(c, S, cutIdx, local, x, y, w, h, scale, warm = 1) {
      const fade = cutIdx > 0 ? mEase(local / 0.5) : 1;
      if (fade < 1) mPhoto(c, S, -1, x, y, w, h, scale);
      c.save();
      c.globalAlpha = fade;
      mPhoto(c, S, 0, x, y, w, h, scale);
      c.restore();
      if (warm) inWarm(c, x, y, w, h, warm);
    }
    function mBg(c, W, H, spec, t) {
      const g = c.createLinearGradient(0, 0, W * 0.4, H);
      g.addColorStop(0, spec.bg1);
      g.addColorStop(1, spec.bg2);
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    }
    function mChip(c, d, W, H, spec, a) {
      if (!d) return;
      c.save();
      c.globalAlpha = a;
      const txt = `${d.name || ''} · ${d.title || ''}`;
      c.font = gFont(700, 15, GENRE_FONTS.sans);
      const w = Math.min(W - 40, c.measureText(txt).width + 54);
      const x = 20, y = H - 58;
      gRoundRect(c, x, y, w, 38, 19);
      c.fillStyle = spec.light ? 'rgba(17,17,17,0.88)' : 'rgba(255,255,255,0.12)';
      c.fill();
      c.beginPath();
      c.arc(x + 19, y + 19, 12, 0, Math.PI * 2);
      c.fillStyle = spec.accent;
      c.fill();
      c.fillStyle = kTextOn(spec.accent);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = gFont(800, 12, GENRE_FONTS.sans);
      c.fillText(String(d.name || '').slice(0, 1), x + 19, y + 19.5);
      c.fillStyle = '#ffffff';
      c.textAlign = 'left';
      c.font = gFont(700, 15, GENRE_FONTS.sans);
      gDrawLine(c, txt, x + 38, y + 20, w - 48, 15, 11, GENRE_FONTS.sans, 700);
      c.restore();
    }
    // 가격 배지: 자막 위쪽 가운데에서 통 튀어 오름
    function mPrice(c, W, y, spec, e) {
      const txt = arPriceTag();
      const s = gBack(mClamp(e / 0.45));
      c.save();
      c.translate(W / 2, y);
      c.scale(s, s);
      c.font = gFont(900, 40, GENRE_FONTS.impact);
      const w = Math.min(W - 60, c.measureText(txt).width + 48);
      gRoundRect(c, -w / 2, -30, w, 60, 30);
      c.fillStyle = spec.accent;
      c.fill();
      c.fillStyle = kTextOn(spec.accent);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      gDrawLine(c, txt, 0, 2, w - 30, 40, 20, GENRE_FONTS.impact, 900);
      c.restore();
    }

    // ---- 캡컷 트렌드 4종(glow · bokeh · cinema · credits)용 도우미 ----
    // 따뜻한 빛: 상시 은은한 빛샘(오른쪽 위) + 전환 순간(g>0) 아래·모서리에서 차오르는 빛, 세로 빛줄기, 빛망울
    function mWarmLight(c, W, H, g, t, seed) {
      c.save();
      c.globalCompositeOperation = 'screen';
      const amb = 0.16 + 0.06 * Math.sin(t * 0.9);
      const a = c.createRadialGradient(W * 0.95, H * 0.04, 0, W * 0.95, H * 0.04, W * 0.95);
      a.addColorStop(0, `rgba(255,180,90,${amb})`);
      a.addColorStop(1, 'rgba(255,120,40,0)');
      c.fillStyle = a;
      c.fillRect(0, 0, W, H);
      if (g > 0.001) {
        const b = c.createRadialGradient(W * 0.25, H * 1.02, 0, W * 0.25, H * 1.02, H * (0.4 + 0.7 * g));
        b.addColorStop(0, `rgba(255,243,214,${0.95 * g})`);
        b.addColorStop(0.45, `rgba(255,140,50,${0.6 * g})`);
        b.addColorStop(1, 'rgba(255,90,20,0)');
        c.fillStyle = b;
        c.fillRect(0, 0, W, H);
        for (let i = 0; i < 3; i++) {
          const x = W * (0.2 + 0.3 * i) + Math.sin(seed * 1.7 + i) * 40;
          const lg = c.createLinearGradient(x - 40, 0, x + 40, 0);
          lg.addColorStop(0, 'rgba(255,200,140,0)');
          lg.addColorStop(0.5, `rgba(255,220,170,${0.45 * g})`);
          lg.addColorStop(1, 'rgba(255,200,140,0)');
          c.fillStyle = lg;
          c.fillRect(x - 40, 0, 80, H);
        }
        for (let i = 0; i < 7; i++) {
          const bx = W * ((Math.sin(seed * 3.1 + i * 2.3) + 1) / 2);
          const by = H * (0.35 + 0.6 * ((Math.cos(seed * 1.3 + i * 1.7) + 1) / 2)) - g * 30;
          c.fillStyle = `rgba(255,236,200,${0.35 * g})`;
          c.beginPath();
          c.arc(bx, by, 12 + (i % 4) * 9, 0, Math.PI * 2);
          c.fill();
        }
        c.fillStyle = `rgba(255,232,205,${0.28 * g})`;
        c.fillRect(0, 0, W, H);
      }
      c.restore();
    }
    // 흐린 사진 (canvas filter 를 못 쓰는 브라우저는 어둡게만)
    function mBlurPhoto(c, S, k, x, y, w, h, scale, px) {
      const can = 'filter' in c;
      c.save();
      if (can) c.filter = `blur(${px}px)`;
      mPhoto(c, S, k, x, y, w, h, scale);
      c.restore();
      if (!can) { c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(x, y, w, h); }
    }
    // 부드러운 원형 마스크를 만들 때 쓰는 보조 캔버스 (한 장을 계속 재사용)
    let mOffCanvasEl = null;
    function mOffscreen(W, H) {
      if (!mOffCanvasEl) mOffCanvasEl = document.createElement('canvas');
      if (mOffCanvasEl.width !== W || mOffCanvasEl.height !== H) { mOffCanvasEl.width = W; mOffCanvasEl.height = H; }
      return mOffCanvasEl;
    }
    // 엔딩 크레딧에 올릴 정보 (연락처는 영상에 넣지 않음)
    function mCreditItems(d) {
      const out = [];
      const add = (label, value) => { const v = String(value || '').trim(); if (v) out.push([label, v]); };
      const isAuto = typeof IND === 'undefined' || IND.key === 'auto';
      add(isAuto ? '차종' : (IND.product || '상품'), campaign.vehicle);
      add('혜택', campaign.discount);
      (campaign.bullets || []).slice(0, 3).forEach((b) => add('포인트', String(b).replace(/^[✔✓•\-\s]+/, '')));
      add(isAuto ? '전시장' : '매장', d && d.branch);
      add('담당', d && `${d.name || ''} ${d.title || ''}`.trim());
      add('특전', d && d.promoTag);
      const kw = (d && d.variation && d.variation.ctaKeyword) || (typeof IND !== 'undefined' && IND.cta) || '문의';
      add('문의', `댓글에 [${kw}] 남겨 주세요`);
      return out;
    }

    // 업종을 바꾸면 모션 템플릿도 그 업종 색으로 물듦 (사용자가 색을 고르면 그 색 우선)
    const AR_IND_PALETTE = {
      restaurant: ['#f97316', '#1a0f08', '#3b1d0a'], cafe: ['#d97706', '#1c140c', '#3a2614'], beauty: ['#ec4899', '#1a0b14', '#3b1230'],
      realestate: ['#0ea5e9', '#06101a', '#0c2a44'], academy: ['#3b82f6', '#081024', '#132a5c'], clinic: ['#14b8a6', '#05201d', '#0b3b36'],
      fitness: ['#ef4444', '#140606', '#3a0d0d'], shop: ['#a855f7', '#120a1c', '#2a1442'], interior: ['#ca8a04', '#14110c', '#2e2618']
    };
    function renderMotionFrame(c, W, H, t, mainDuration, totalCuts, d, spec, V) {
      const userColor = campaign.colorKey && campaign.colorKey !== 'default';
      const pal = typeof IND !== 'undefined' && IND.key !== 'auto' ? AR_IND_PALETTE[IND.key] : null;
      const accent = userColor ? ((V && V.accent) || spec.accent) : pal ? pal[0] : spec.accent;
      const sp = Object.assign({}, spec, { accent }, pal && !spec.light && !spec.insta && !userColor ? { bg1: pal[1], bg2: pal[2] } : {});
      if (t >= mainDuration) return renderMotionOutro(c, W, H, t, mainDuration, d, sp);
      const cutDur = mainDuration / totalCuts;
      const cutIdx = Math.min(totalCuts - 1, Math.floor(t / cutDur));
      const local = t - cutIdx * cutDur;
      const lp = mClamp(local / cutDur);
      const S = kitScene(t, mainDuration, false);
      const raw = (campaign.cutCaptions && campaign.cutCaptions[cutIdx]) || campaign.hook || '';
      const caption = gCleanCaption(raw);
      const isPrice = gIsPriceCut(raw) || (campaign.priceTag && cutIdx === 2);
      const e = mClamp(local / 1.1);
      const ent = mEase(local / 0.6); // 컷 시작 등장
      const stageH = Math.round(H * 0.58);
      const capY = Math.round(H * 0.62), capH = Math.round(H * 0.24);
      const fg = sp.light ? '#111111' : '#ffffff';
      const M = sp.mstyle;
      mBg(c, W, H, sp, t);

      if (M === 'blob') {
        // 배경 위 떠다니는 원 + 출렁이는 블롭 안에 사진
        for (let i = 0; i < 5; i++) {
          c.beginPath();
          c.arc((W * (0.15 + i * 0.19) + Math.sin(t * 0.6 + i) * 30), H * (0.12 + (i % 3) * 0.3) + Math.cos(t * 0.5 + i * 2) * 24, 30 + i * 9, 0, Math.PI * 2);
          c.fillStyle = i % 2 ? sp.accent2 + '22' : sp.accent + '26';
          c.fill();
        }
        const cx = W / 2, cy = stageH * 0.55, R = W * 0.41 * (0.7 + 0.3 * ent);
        c.save();
        c.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 60) {
          const rr = R * (1 + 0.07 * Math.sin(3 * a + t * 1.8) + 0.05 * Math.sin(5 * a - t * 1.2));
          const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * 1.12;
          if (a === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        c.shadowColor = sp.accent + '88';
        c.shadowBlur = 40;
        c.fillStyle = sp.accent;
        c.fill();
        c.shadowBlur = 0;
        c.clip();
        mPhoto(c, S, 0, cx - R * 1.15, cy - R * 1.3, R * 2.3, R * 2.6, 1.05 + lp * 0.06);
        c.restore();
        if (isPrice) mPrice(c, W, capY - 4, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 0), W - 70, capH - (isPrice ? 40 : 0), 40, sp.font, fg, e);
      } else if (M === 'sweep') {
        mPhoto(c, S, 0, 0, 0, W, H, 1.08 + lp * 0.05);
        const g = c.createLinearGradient(0, H * 0.45, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.85)');
        c.fillStyle = g;
        c.fillRect(0, H * 0.45, W, H * 0.55);
        // 컷 시작마다 사선 색 띠 세 줄이 휙 지나감
        if (local < 0.7) {
          const cols = [sp.accent, sp.accent2, '#ffffff'];
          cols.forEach((col, i) => {
            const p = mClamp((local - i * 0.07) / 0.5);
            const x = -W * 1.2 + p * W * 2.6;
            c.save();
            c.translate(x, 0);
            c.transform(1, 0, -0.35, 1, 0, 0);
            c.fillStyle = col;
            c.fillRect(i * 70, 0, 120, H);
            c.restore();
          });
        }
        c.fillStyle = sp.accent;
        c.fillRect(0, 0, W * lp, 6);
        if (isPrice) mPrice(c, W, capY - 10, sp, e);
        mCaption(c, caption, 34, capY + (isPrice ? 36 : 0), W - 68, capH - (isPrice ? 36 : 0), 38, sp.font, '#111111', e, 'left', sp.accent);
      } else if (M === 'tiles') {
        const cols = 4, rows = 6, tw = W / cols, th = H / rows;
        mPhoto(c, S, -1, 0, 0, W, H, 1.1);
        for (let r = 0; r < rows; r++) {
          for (let k = 0; k < cols; k++) {
            const p = cutIdx === 0 && local < 0.05 ? 1 : mEase((local - (r + k) * 0.04) / 0.35);
            if (p <= 0) continue;
            c.save();
            const x = k * tw, y = r * th;
            c.translate(x + tw / 2, y + th / 2);
            c.scale(p, 1);
            c.beginPath();
            c.rect(-tw / 2, -th / 2, tw + 0.5, th + 0.5);
            c.clip();
            mPhoto(c, S, 0, -tw / 2 - x, -th / 2 - y, W, H, 1.04 + lp * 0.05);
            c.restore();
          }
        }
        const g = c.createLinearGradient(0, H * 0.48, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.86)');
        c.fillStyle = g;
        c.fillRect(0, H * 0.48, W, H * 0.52);
        if (isPrice) mPrice(c, W, capY - 6, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 36 : 8), W - 76, capH - (isPrice ? 36 : 8), 38, sp.font, '#ffffff', e);
      } else if (M === 'tunnel') {
        // 안쪽에서 바깥으로 계속 커지는 사각 테두리
        c.save();
        c.translate(W / 2, stageH * 0.52);
        for (let i = 0; i < 7; i++) {
          const ph = ((t * 0.45 + i / 7) % 1);
          const s = 0.2 + ph * 1.5;
          c.globalAlpha = (1 - ph) * 0.8;
          c.strokeStyle = i % 2 ? sp.accent : '#ffffff';
          c.lineWidth = 3;
          gRoundRect(c, -W * 0.45 * s, -stageH * 0.5 * s, W * 0.9 * s, stageH * s, 20 * s);
          c.stroke();
        }
        c.restore();
        const sc = 0.62 + 0.12 * ent + lp * 0.03;
        const pw = W * sc, ph = stageH * 0.86 * sc / 0.74;
        const px = (W - pw) / 2, py = stageH * 0.52 - ph / 2;
        c.save();
        gRoundRect(c, px, py, pw, ph, 18);
        c.clip();
        mPhoto(c, S, 0, px, py, pw, ph, 1.05);
        c.restore();
        c.strokeStyle = sp.accent;
        c.lineWidth = 4;
        gRoundRect(c, px, py, pw, ph, 18);
        c.stroke();
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 44, sp.font, sp.accent, e);
      } else if (M === 'cards') {
        // 겹친 카드: 끝날 무렵 맨 위 카드가 왼쪽으로 넘어감
        const cw = W * 0.74, ch = stageH * 0.9, cx = W / 2, cy = stageH * 0.52;
        const out = mClamp((local - (cutDur - 0.45)) / 0.45);
        for (let i = 2; i >= 0; i--) {
          c.save();
          const rot = (i === 0 ? -out * 0.5 : (i === 1 ? 0.05 : -0.07));
          c.translate(cx + (i === 0 ? -out * W : i * 6), cy + i * 10);
          c.rotate(rot);
          c.shadowColor = 'rgba(0,0,0,0.18)';
          c.shadowBlur = 24;
          gRoundRect(c, -cw / 2, -ch / 2, cw, ch, 22);
          c.fillStyle = '#ffffff';
          c.fill();
          c.shadowBlur = 0;
          gRoundRect(c, -cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20, 16);
          c.clip();
          mPhoto(c, S, i, -cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20, 1.04);
          c.restore();
        }
        // 하트 팝
        const hp = gBack(mClamp((local - 0.4) / 0.4));
        if (hp > 0) {
          c.save();
          c.translate(W * 0.82, stageH * 0.12);
          c.scale(hp, hp);
          c.fillStyle = sp.accent;
          c.beginPath();
          c.moveTo(0, 12);
          c.bezierCurveTo(-26, -8, -14, -30, 0, -16);
          c.bezierCurveTo(14, -30, 26, -8, 0, 12);
          c.fill();
          c.restore();
        }
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 70, capH - (isPrice ? 40 : 4), 40, sp.font, '#111111', e);
      } else if (M === 'eq') {
        const cx = W / 2, cy = stageH * 0.52, R = W * 0.3;
        const bars = 64;
        for (let i = 0; i < bars; i++) {
          const a = (i / bars) * Math.PI * 2 - Math.PI / 2;
          const v = 0.35 + 0.65 * Math.abs(Math.sin(t * 3.1 + i * 0.7) * Math.cos(t * 1.7 + i * 0.23));
          const L = 14 + v * 52 * ent;
          c.strokeStyle = i % 2 ? sp.accent : sp.accent2;
          c.lineWidth = 4;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(cx + Math.cos(a) * (R + 10), cy + Math.sin(a) * (R + 10));
          c.lineTo(cx + Math.cos(a) * (R + 10 + L), cy + Math.sin(a) * (R + 10 + L));
          c.stroke();
        }
        c.save();
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.clip();
        mPhoto(c, S, 0, cx - R, cy - R, R * 2, R * 2, 1.1 + lp * 0.06);
        c.restore();
        c.strokeStyle = '#ffffff';
        c.lineWidth = 3;
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.stroke();
        if (isPrice) mPrice(c, W, capY, sp, e);
        c.save();
        c.shadowColor = sp.accent;
        c.shadowBlur = 16;
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 40, sp.font, '#ffffff', e);
        c.restore();
      } else if (M === 'aurora') {
        [[sp.accent, 0.3, 0.25], [sp.accent2, 0.75, 0.4], ['#f472b6', 0.4, 0.75]].forEach(([col, fx, fy], i) => {
          const x = W * fx + Math.sin(t * 0.4 + i * 2) * 60, y = H * fy + Math.cos(t * 0.35 + i) * 50;
          const g = c.createRadialGradient(x, y, 0, x, y, W * 0.7);
          g.addColorStop(0, col + '66');
          g.addColorStop(1, col + '00');
          c.fillStyle = g;
          c.fillRect(0, 0, W, H);
        });
        const fy = Math.sin(t * 1.4) * 6;
        const pw = W * 0.7, ph = stageH * 0.9;
        const px = (W - pw) / 2, py = stageH * 0.06 + fy + (1 - ent) * 30;
        c.save();
        c.globalAlpha = ent;
        c.shadowColor = 'rgba(0,0,0,0.5)';
        c.shadowBlur = 40;
        c.shadowOffsetY = 16;
        gRoundRect(c, px, py, pw, ph, 28);
        c.fillStyle = '#000';
        c.fill();
        c.shadowColor = 'transparent';
        c.clip();
        mPhoto(c, S, 0, px, py, pw, ph, 1.05 + lp * 0.05);
        c.restore();
        c.save();
        if ('filter' in c) c.filter = `blur(${Math.round((1 - mEase(e / 0.6)) * 8)}px)`;
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 70, capH - (isPrice ? 40 : 4), 38, sp.font, '#ffffff', e);
        c.restore();
      } else if (M === 'dots') {
        // 크기가 물결치는 점 무늬
        c.fillStyle = 'rgba(0,0,0,0.16)';
        for (let y = 14; y < H; y += 24) {
          for (let x = 14; x < W; x += 24) {
            const r = 2 + 4 * (0.5 + 0.5 * Math.sin(x * 0.02 + y * 0.015 - t * 2.4));
            c.beginPath();
            c.arc(x, y, r, 0, Math.PI * 2);
            c.fill();
          }
        }
        const pw = W * 0.8, ph = stageH * 0.84;
        c.save();
        c.translate(W / 2, stageH * 0.52 + (1 - ent) * 40);
        c.rotate(-0.04 + Math.sin(t * 0.8) * 0.012);
        c.fillStyle = '#111111';
        c.fillRect(-pw / 2 + 10, -ph / 2 + 12, pw, ph);
        c.fillStyle = '#ffffff';
        c.fillRect(-pw / 2 - 6, -ph / 2 - 6, pw + 12, ph + 12);
        c.beginPath();
        c.rect(-pw / 2, -ph / 2, pw, ph);
        c.clip();
        mPhoto(c, S, 0, -pw / 2, -ph / 2, pw, ph, 1.05 + lp * 0.05);
        c.restore();
        if (isPrice) mPrice(c, W, capY, Object.assign({}, sp, { accent: sp.accent2 }), e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 70, capH - (isPrice ? 40 : 4), 40, sp.font, '#111111', e, 'center', '#ffffff');
      } else if (M === 'number') {
        // 큰 컷 번호 글자 속에 사진
        mPhoto(c, S, 0, 0, 0, W, stageH, 1.15);
        c.fillStyle = 'rgba(12,12,12,0.9)';
        c.fillRect(0, 0, W, stageH);
        const num = kPad(cutIdx + 1);
        if (!window.__mNumCanvas) { window.__mNumCanvas = document.createElement('canvas'); }
        const oc = window.__mNumCanvas;
        oc.width = W; oc.height = stageH;
        const ox = oc.getContext('2d');
        ox.clearRect(0, 0, W, stageH);
        ox.textAlign = 'center';
        ox.textBaseline = 'middle';
        ox.font = gFont(900, Math.round(stageH * 0.78), GENRE_FONTS.impact);
        ox.fillStyle = '#fff';
        const fitS = Math.min(1, (W * 0.88) / Math.max(1, ox.measureText(num).width));
        const s = (0.85 + 0.15 * ent) * fitS;
        ox.save();
        ox.translate(W / 2, stageH * 0.54);
        ox.scale(s, s);
        ox.fillText(num, 0, 0);
        ox.restore();
        ox.globalCompositeOperation = 'source-in';
        const img = kitImg(S, 0);
        if (img) kitCover(ox, img, 0, 0, W, stageH, 1.08 + lp * 0.06, 0, 0); else { ox.fillStyle = sp.accent; ox.fillRect(0, 0, W, stageH); }
        ox.globalCompositeOperation = 'source-over';
        c.drawImage(oc, 0, 0);
        c.save();
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = gFont(900, Math.round(stageH * 0.78), GENRE_FONTS.impact);
        c.translate(W / 2, stageH * 0.54);
        c.scale(s, s);
        // 외곽선 숫자 대신 옅게 채운 숫자 (테두리 글자 제거)
        c.globalAlpha = 0.18;
        c.fillStyle = sp.accent;
        c.fillText(num, 0, 0);
        c.restore();
        c.fillStyle = sp.accent;
        c.font = gFont(800, 16, GENRE_FONTS.sans);
        c.textAlign = 'left';
        c.fillText(`${num} / ${kPad(totalCuts)}`, 26, 40);
        c.fillRect(26, 52, 60 * ent, 4);
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, 30, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 40, sp.font, '#ffffff', e, 'left');
      } else if (M === 'circle') {
        // 모서리에서 원이 퍼지며 전체 화면 다음 사진으로 바뀜
        const corner = [[0, 0], [W, 0], [W, H], [0, H]][cutIdx % 4];
        const R = Math.hypot(W, H) * mEase(local / 0.75);
        mPhoto(c, S, -1, 0, 0, W, H, 1.08);
        c.save();
        c.beginPath();
        c.arc(corner[0], corner[1], cutIdx === 0 ? 9999 : R, 0, Math.PI * 2);
        c.clip();
        mPhoto(c, S, 0, 0, 0, W, H, 1.04 + lp * 0.05);
        c.restore();
        if (cutIdx > 0 && local < 0.8) {
          c.strokeStyle = sp.accent;
          c.lineWidth = 6;
          c.beginPath();
          c.arc(corner[0], corner[1], R, 0, Math.PI * 2);
          c.stroke();
        }
        // 진행 링
        c.save();
        c.translate(W - 44, 44);
        c.strokeStyle = 'rgba(255,255,255,0.25)';
        c.lineWidth = 4;
        c.beginPath(); c.arc(0, 0, 18, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = sp.accent;
        c.beginPath(); c.arc(0, 0, 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lp); c.stroke();
        c.restore();
        const cg = c.createLinearGradient(0, H * 0.48, 0, H);
        cg.addColorStop(0, 'rgba(0,0,0,0)');
        cg.addColorStop(1, 'rgba(0,0,0,0.82)');
        c.fillStyle = cg;
        c.fillRect(0, H * 0.48, W, H * 0.52);
        if (isPrice) mPrice(c, W, capY - 10, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 30 : 4), W - 80, capH - (isPrice ? 30 : 8), 38, sp.font, '#ffffff', e);
      } else if (M === 'ribbon') {
        // 사선 리본 두 줄이 사진 위아래 모서리를 지나감 (자막 구역에는 안 들어감)
        const pw = W - 60, ph = stageH - 70;
        c.save();
        gRoundRect(c, 30, 40, pw, ph, 16);
        c.clip();
        mPhoto(c, S, 0, 30, 40, pw, ph, 1.05 + lp * 0.05);
        c.restore();
        const label = `${(campaign.vehicle || IND.product || '').toString().toUpperCase()} ★ `;
        [[60, -0.12, sp.accent, '#111111', 1], [stageH - 30, 0.1, sp.accent2, '#ffffff', -1]].forEach(([y, rot, bg, fgc, dir]) => {
          c.save();
          c.translate(W / 2, y);
          c.rotate(rot);
          c.fillStyle = bg;
          c.fillRect(-W, -20, W * 2, 40);
          c.fillStyle = fgc;
          c.font = gFont(900, 20, GENRE_FONTS.impact);
          c.textBaseline = 'middle';
          c.textAlign = 'left';
          const tw = Math.max(120, c.measureText(label).width);
          const off = ((t * 80 * dir) % tw + tw) % tw;
          for (let x = -W - tw + off; x < W; x += tw) c.fillText(label, x, 1);
          c.restore();
        });
        if (isPrice) mPrice(c, W, capY + 4, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 44 : 8), W - 60, capH - (isPrice ? 44 : 8), 44, sp.font, '#ffffff', e);
      } else if (M === 'doors') {
        // 가운데에서 문이 열리듯 양쪽으로 갈라지며 사진이 나타남
        const open = cutIdx === 0 && local < 0.05 ? 1 : mEase(local / 0.7);
        mPhoto(c, S, 0, 0, 0, W, stageH, 1.04 + lp * 0.04);
        if (open < 1) {
          const half = (W / 2) * (1 - open);
          c.save();
          c.beginPath(); c.rect(0, 0, half, stageH); c.clip();
          mPhoto(c, S, -1, -W / 2 + half, 0, W, stageH, 1.08);
          c.restore();
          c.save();
          c.beginPath(); c.rect(W - half, 0, half, stageH); c.clip();
          mPhoto(c, S, -1, W / 2 - half, 0, W, stageH, 1.08);
          c.restore();
          c.fillStyle = sp.accent;
          c.fillRect(half - 2, 0, 4, stageH);
          c.fillRect(W - half - 2, 0, 4, stageH);
        }
        c.fillStyle = sp.accent;
        c.fillRect(W / 2 - 30 * mEase(local / 0.8), stageH + 22, 60 * mEase(local / 0.8), 2);
        if (isPrice) mPrice(c, W, capY + 10, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 46 : 14), W - 70, capH - (isPrice ? 46 : 14), 38, sp.font, sp.accent2, e);
      } else if (M === 'bounce') {
        // 낱말이 하나씩 통통 튀어 들어옴
        const pw = W - 48, ph = stageH - 40;
        c.save();
        c.shadowColor = 'rgba(14,116,144,0.25)';
        c.shadowBlur = 30;
        c.shadowOffsetY = 12;
        gRoundRect(c, 24, 30 + (1 - ent) * 30, pw, ph, 30);
        c.fillStyle = '#ffffff';
        c.fill();
        c.restore();
        c.save();
        gRoundRect(c, 32, 38 + (1 - ent) * 30, pw - 16, ph - 16, 24);
        c.clip();
        mPhoto(c, S, 0, 32, 38, pw - 16, ph - 16, 1.05 + lp * 0.05);
        c.restore();
        if (isPrice) mPrice(c, W, capY, Object.assign({}, sp, { accent: sp.accent2 }), e);
        const F = KIT_FONTS[sp.font] || KIT_FONTS.sans;
        const r = mFit(c, caption, W - 70, 3, 44, 24, sp.font);
        c.font = gFont(F.w, r.size, F.f);
        c.textBaseline = 'middle';
        c.textAlign = 'left';
        const y0 = capY + (isPrice ? 44 : 8) + Math.max(0, (capH - (isPrice ? 44 : 8) - r.lines.length * r.lh) / 2);
        let wi = 0;
        r.lines.forEach((ln, li) => {
          const words = ln.split(' ');
          const lw = c.measureText(ln).width;
          let x = (W - lw) / 2;
          words.forEach((wd) => {
            const ww = c.measureText(wd).width;
            const p = mClamp((local - 0.15 - wi * 0.09) / 0.4);
            const sc = p <= 0 ? 0 : gBack(p);
            if (sc > 0) {
              c.save();
              c.translate(x + ww / 2, y0 + li * r.lh + r.lh / 2);
              c.scale(sc, sc);
              c.fillStyle = wi % 3 === 1 ? sp.accent : wi % 3 === 2 ? sp.accent2 : '#0f172a';
              c.fillText(wd, -ww / 2, 0);
              c.restore();
            }
            x += ww + c.measureText(' ').width;
            wi++;
          });
        });
      } else if (M === 'story') {
        // 인스타 스토리: 위 진행 막대 + 프로필 + 줄마다 색 배경 자막 + 스티커
        mPhoto(c, S, 0, 0, 0, W, H, 1.06 + lp * 0.05);
        const gtop = c.createLinearGradient(0, 0, 0, 160);
        gtop.addColorStop(0, 'rgba(0,0,0,0.55)');
        gtop.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gtop;
        c.fillRect(0, 0, W, 160);
        const segW = (W - 24 - (totalCuts - 1) * 4) / totalCuts;
        for (let i = 0; i < totalCuts; i++) {
          c.fillStyle = 'rgba(255,255,255,0.35)';
          gRoundRect(c, 12 + i * (segW + 4), 14, segW, 3, 2); c.fill();
          const f = i < cutIdx ? 1 : i === cutIdx ? lp : 0;
          if (f > 0) { c.fillStyle = '#ffffff'; gRoundRect(c, 12 + i * (segW + 4), 14, segW * f, 3, 2); c.fill(); }
        }
        const rg = c.createLinearGradient(14, 30, 50, 66);
        rg.addColorStop(0, '#feda75'); rg.addColorStop(0.5, '#d62976'); rg.addColorStop(1, '#4f5bd5');
        c.beginPath(); c.arc(34, 48, 17, 0, Math.PI * 2); c.fillStyle = rg; c.fill();
        c.beginPath(); c.arc(34, 48, 14, 0, Math.PI * 2); c.fillStyle = '#222'; c.fill();
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = gFont(800, 13, GENRE_FONTS.sans); c.fillText(String((d && d.name) || '').slice(0, 1), 34, 49);
        c.textAlign = 'left'; c.font = gFont(700, 15, GENRE_FONTS.sans);
        c.fillText(((d && (d.name || d.branch)) || '').slice(0, 18), 60, 44);
        c.fillStyle = 'rgba(255,255,255,0.7)'; c.font = gFont(500, 12, GENRE_FONTS.sans); c.fillText('방금 전', 60, 61);
        // 스토리 텍스트: 줄마다 둥근 배경
        const F = KIT_FONTS[sp.font] || KIT_FONTS.sans;
        const r = mFit(c, caption, W - 110, 3, 36, 22, sp.font);
        c.font = gFont(F.w, r.size, F.f);
        c.textAlign = 'center';
        const cy0 = H * 0.5 - (r.lines.length * (r.lh + 6)) / 2;
        r.lines.forEach((ln, i) => {
          const p = gBack(mClamp((local - 0.1 - i * 0.08) / 0.35));
          if (p <= 0) return;
          const w = c.measureText(ln).width + 28;
          c.save();
          c.translate(W / 2, cy0 + i * (r.lh + 6) + r.lh / 2);
          c.rotate(-0.03);
          c.scale(p, p);
          gRoundRect(c, -w / 2, -r.lh / 2 - 2, w, r.lh + 4, 10);
          c.fillStyle = i % 2 ? '#ffffff' : sp.accent;
          c.fill();
          c.fillStyle = i % 2 ? '#111111' : '#ffffff';
          c.fillText(ln, 0, 2);
          c.restore();
        });
        // 스티커 (가격 컷은 가격 스티커, 아니면 이모지 스티커)
        const sp2 = gBack(mClamp((local - 0.5) / 0.4));
        if (sp2 > 0) {
          c.save();
          c.translate(W * 0.72, H * 0.72);
          c.rotate(0.12);
          c.scale(sp2, sp2);
          const txt = isPrice ? arPriceTag() : (IND.key === 'auto' ? '🚗 NEW' : `${IND.icon} PICK`);
          c.font = gFont(900, 24, GENRE_FONTS.impact);
          const w = c.measureText(txt).width + 34;
          gRoundRect(c, -w / 2, -26, w, 52, 14);
          c.fillStyle = sp.accent2;
          c.fill();
          c.fillStyle = '#111111';
          c.fillText(txt, 0, 2);
          c.restore();
        }
        // 아래 메시지 입력칸 모양
        gRoundRect(c, 16, H - 112, W - 90, 44, 22);
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.5; c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.8)'; c.textAlign = 'left'; c.font = gFont(500, 14, GENRE_FONTS.sans);
        c.fillText('메시지 보내기', 34, H - 89);
        c.font = gFont(400, 24, GENRE_FONTS.sans); c.textAlign = 'center';
        c.fillText('♡', W - 50, H - 88);
      } else if (M === 'feed') {
        // 인스타 피드 게시물 카드
        const top = 60, pw = W - 32, px = 16;
        c.fillStyle = '#ffffff';
        gRoundRect(c, px - 4, top - 50, pw + 8, stageH + 210, 18);
        c.fill();
        const rg = c.createLinearGradient(px, top - 40, px + 34, top - 6);
        rg.addColorStop(0, '#feda75'); rg.addColorStop(0.5, '#d62976'); rg.addColorStop(1, '#4f5bd5');
        c.beginPath(); c.arc(px + 22, top - 24, 16, 0, Math.PI * 2); c.fillStyle = rg; c.fill();
        c.beginPath(); c.arc(px + 22, top - 24, 13, 0, Math.PI * 2); c.fillStyle = sp.accent2; c.fill();
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = gFont(800, 12, GENRE_FONTS.sans);
        c.fillText(String((d && d.name) || '').slice(0, 1), px + 22, top - 23);
        c.fillStyle = '#111'; c.textAlign = 'left'; c.font = gFont(700, 15, GENRE_FONTS.sans);
        c.fillText(((d && (d.name || d.branch)) || '').slice(0, 20), px + 46, top - 24);
        c.font = gFont(900, 18, GENRE_FONTS.sans); c.textAlign = 'right'; c.fillText('···', px + pw - 10, top - 26);
        const ph = stageH;
        c.save(); c.beginPath(); c.rect(px, top, pw, ph); c.clip();
        mPhoto(c, S, 0, px, top, pw, ph, 1.04 + lp * 0.05);
        // 두 번 톡 → 하트
        const hp = mClamp((local - 0.6) / 0.6);
        if (hp > 0 && hp < 1) {
          const sc = gBack(Math.min(1, hp * 2)) * (1 - Math.max(0, hp - 0.7) / 0.3);
          c.save(); c.translate(px + pw / 2, top + ph / 2); c.scale(sc * 3, sc * 3);
          c.fillStyle = '#ffffff';
          c.beginPath(); c.moveTo(0, 12); c.bezierCurveTo(-26, -8, -14, -30, 0, -16); c.bezierCurveTo(14, -30, 26, -8, 0, 12); c.fill();
          c.restore();
        }
        c.restore();
        const iy = top + ph + 26;
        const liked = local > 0.9;
        c.save(); c.translate(px + 22, iy); c.scale(0.8, 0.8);
        c.fillStyle = liked ? sp.accent : 'transparent'; c.strokeStyle = liked ? sp.accent : '#111'; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(0, 12); c.bezierCurveTo(-26, -8, -14, -30, 0, -16); c.bezierCurveTo(14, -30, 26, -8, 0, 12);
        if (liked) c.fill(); c.stroke(); c.restore();
        c.strokeStyle = '#111'; c.lineWidth = 2.2;
        c.beginPath(); c.arc(px + 64, iy - 2, 11, 0.6, Math.PI * 2 - 0.2); c.stroke();
        c.beginPath(); c.moveTo(px + 96, iy - 12); c.lineTo(px + 120, iy - 2); c.lineTo(px + 96, iy + 8); c.closePath(); c.stroke();
        if (isPrice) { c.fillStyle = sp.accent; c.font = gFont(900, 22, GENRE_FONTS.impact); c.textAlign = 'right'; c.fillText(arPriceTag(), px + pw - 8, iy); }
        c.textAlign = 'left';
        const F = KIT_FONTS[sp.font] || KIT_FONTS.sans;
        const r = mFit(c, caption, pw - 24, 2, 24, 16, sp.font);
        c.globalAlpha = mEase(e / 0.4);
        c.fillStyle = '#111'; c.font = gFont(800, r.size, F.f);
        r.lines.forEach((ln, i) => c.fillText(ln, px + 10, iy + 40 + i * r.lh));
        c.globalAlpha = 1;
        c.fillStyle = sp.light ? '#8e8e8e' : '#ddd'; c.font = gFont(500, 13, GENRE_FONTS.sans);
        c.fillText(`#${(IND.hashtags && IND.hashtags[0]) || '오늘의추천'} #${(IND.hashtags && IND.hashtags[1]) || '릴스'}`, px + 10, iy + 44 + r.lines.length * r.lh);
      } else if (M === 'poll') {
        // 투표 스티커 템플릿: 반투명 프로스트 글래스 + 은은한 네온 글로우 (배경 사진이 비치고 얼굴을 가리지 않게 하단 배치)
        mPhoto(c, S, 0, 0, 0, W, H, 1.06 + lp * 0.05);
        c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(0, 0, W, H);
        const bw = W - 76, bx = 38, by = H * 0.52;
        const p = gBack(mClamp(local / 0.45));
        c.save(); c.translate(W / 2, by + 110); c.scale(p, p); c.translate(-W / 2, -(by + 110));
        c.shadowColor = sp.bg2 || '#db2777'; c.shadowBlur = 34;
        gRoundRect(c, bx, by, bw, 220, 24);
        c.fillStyle = 'rgba(14,16,28,0.56)'; c.fill();
        c.shadowBlur = 0;
        c.save();
        gRoundRect(c, bx, by, bw, 220, 24);
        c.clip();
        const gg = c.createLinearGradient(bx, by, bx + bw, by + 220);
        gg.addColorStop(0, sp.bg1); gg.addColorStop(1, sp.bg2);
        c.globalAlpha = 0.24;
        c.fillStyle = gg; c.fillRect(bx, by, bw, 220);
        c.restore();
        gRoundRect(c, bx, by, bw, 220, 24);
        c.strokeStyle = 'rgba(255,255,255,0.36)'; c.lineWidth = 1.5; c.stroke();
        c.restore();
        c.globalAlpha = mClamp(local / 0.45);
        mCaption(c, caption, W / 2, by + 14, bw - 40, 96, 30, sp.font, '#ffffff', e);
        const opts = isPrice ? [arPriceTag(), '더 알아볼래요'] : ['가볼래요 👍', '궁금해요 👀'];
        const pick = local > 1.1 ? 0 : -1;
        opts.forEach((o, i) => {
          const oy = by + 118 + i * 50;
          c.save();
          if (pick === i) {
            c.shadowColor = sp.accent2 || '#facc15';
            c.shadowBlur = 18;
          }
          gRoundRect(c, bx + 20, oy, bw - 40, 40, 20);
          c.fillStyle = pick === i ? (sp.accent2 || '#facc15') : 'rgba(255,255,255,0.16)';
          c.fill();
          c.shadowBlur = 0;
          if (pick !== i) {
            c.strokeStyle = 'rgba(255,255,255,0.32)';
            c.lineWidth = 1;
            c.stroke();
          }
          c.fillStyle = pick === i ? '#111111' : '#ffffff';
          c.textAlign = 'center'; c.textBaseline = 'middle';
          gDrawLine(c, o, W / 2, oy + 21, bw - 70, 18, 12, GENRE_FONTS.sans, 800);
          c.restore();
        });
        c.globalAlpha = 1;
      } else if (M === 'vhs') {
        // 캠코더: REC · 시간 · 주사선 · 색 번짐
        const jx = Math.sin(t * 40) * (local < 0.25 ? 6 : 0.8);
        c.save();
        if ('filter' in c) c.filter = 'saturate(1.3) contrast(1.1)';
        c.globalAlpha = 0.6; mPhoto(c, S, 0, -3 + jx, 0, W, H, 1.06 + lp * 0.04);
        c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.35; mPhoto(c, S, 0, 3 + jx, 0, W, H, 1.06 + lp * 0.04);
        c.restore();
        c.globalAlpha = 1;
        c.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = (t * 30) % 4; y < H; y += 4) c.fillRect(0, y, W, 1.5);
        c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(0, (t * 120) % H, W, 26);
        c.font = gFont(700, 22, GENRE_FONTS.mono); c.textAlign = 'left'; c.textBaseline = 'middle';
        if (Math.floor(t * 2) % 2 === 0) { c.fillStyle = sp.accent; c.beginPath(); c.arc(36, 46, 9, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = '#fff'; c.fillText('REC', 52, 47);
        c.textAlign = 'right'; c.fillText('PLAY ▶', W - 26, 47);
        const sec = Math.floor(t);
        c.textAlign = 'left'; c.font = gFont(700, 18, GENRE_FONTS.mono);
        c.fillText(`00:${kPad(Math.floor(sec / 60))}:${kPad(sec % 60)}`, 26, H - 130);
        c.textAlign = 'right'; c.fillText(new Date().getFullYear() + '. ' + kPad(new Date().getMonth() + 1) + '. ' + kPad(new Date().getDate()), W - 26, H - 130);
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 30), 34, sp.font, '#ffffff', e, 'center', 'rgba(0,0,0,0.6)');
      } else if (M === 'neon') {
        // 벽돌 벽 + 깜빡이는 네온 글씨 + 네온 테두리 사진
        c.fillStyle = 'rgba(255,255,255,0.035)';
        for (let y = 0; y < H; y += 26) for (let x = ((y / 26) % 2) * 30 - 30; x < W; x += 60) c.fillRect(x + 2, y + 2, 56, 22);
        const pw = W - 90, ph = stageH - 70, px = 45, py = 50;
        c.save(); gRoundRect(c, px, py, pw, ph, 20); c.clip();
        mPhoto(c, S, 0, px, py, pw, ph, 1.05 + lp * 0.04); c.restore();
        const flick = local < 0.5 ? (Math.sin(local * 60) > 0 ? 1 : 0.25) : 1;
        c.save(); c.globalAlpha = flick;
        c.shadowColor = sp.accent2; c.shadowBlur = 22; c.strokeStyle = sp.accent2; c.lineWidth = 4;
        gRoundRect(c, px, py, pw, ph, 20); c.stroke(); c.restore();
        c.save(); c.globalAlpha = flick; c.shadowColor = sp.accent; c.shadowBlur = 24;
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 42, sp.font, '#ffe4fb', e);
        c.restore();
      } else if (M === 'scrap') {
        // 찢은 종이 + 마스킹테이프 + 비스듬한 사진 두 장
        const tear = (x, y, w, h, col, seed) => {
          c.beginPath(); c.moveTo(x, y);
          for (let i = 0; i <= 20; i++) c.lineTo(x + (w * i) / 20, y + ((i * 37 + seed) % 7) - 3);
          c.lineTo(x + w, y + h);
          for (let i = 20; i >= 0; i--) c.lineTo(x + (w * i) / 20, y + h + ((i * 53 + seed) % 7) - 3);
          c.closePath(); c.fillStyle = col; c.fill();
        };
        tear(0, stageH - 30, W, 70, sp.accent2 + '33', 3);
        const pol = (k, cx, cy, rot, sc, a) => {
          c.save(); c.globalAlpha = a; c.translate(cx, cy); c.rotate(rot); c.scale(sc, sc);
          c.shadowColor = 'rgba(0,0,0,0.2)'; c.shadowBlur = 16; c.fillStyle = '#fff';
          c.fillRect(-150, -170, 300, 340); c.shadowBlur = 0;
          c.save(); c.beginPath(); c.rect(-138, -158, 276, 280); c.clip();
          mPhoto(c, S, k, -138, -158, 276, 280, 1.06); c.restore();
          c.fillStyle = 'rgba(250,204,21,0.75)'; c.save(); c.rotate(-0.2); c.fillRect(-40, -182, 90, 26); c.restore();
          c.restore();
        };
        pol(1, W * 0.68, stageH * 0.5, 0.12, 0.84, 0.9);
        pol(0, W * 0.38, stageH * 0.5 + (1 - ent) * 40, -0.08 + (1 - ent) * 0.2, 1.0, ent);
        c.fillStyle = sp.accent; c.font = gFont(700, 18, GENRE_FONTS.sans); c.textAlign = 'left';
        c.save(); c.translate(28, 40); c.rotate(-0.05); c.fillText(`No.${kPad(cutIdx + 1)} ✂`, 0, 0); c.restore();
        if (isPrice) mPrice(c, W, capY + 6, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 44 : 10), W - 70, capH - (isPrice ? 44 : 10), 40, sp.font, '#3f2a14', e);
      } else if (M === 'punch') {
        // 컷마다 확 당겨지는 줌 + 번쩍 + 큰 단어 하나
        const punch = local < 0.22 ? 1.35 - 0.3 * mEase(local / 0.22) : 1.05 + lp * 0.03;
        mPhoto(c, S, 0, 0, 0, W, H, punch);
        if (local < 0.12) { c.fillStyle = `rgba(255,255,255,${0.8 * (1 - local / 0.12)})`; c.fillRect(0, 0, W, H); }
        const vg = c.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.7)');
        c.fillStyle = vg; c.fillRect(0, 0, W, H);
        const words = caption.split(' ').filter(Boolean);
        const key = words.slice().sort((a, b) => b.length - a.length)[0] || caption;
        const sc = gBack(mClamp(local / 0.3));
        c.save(); c.translate(W / 2, H * 0.42); c.scale(sc, sc); c.rotate(-0.04);
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = gFont(900, 96, GENRE_FONTS.impact);
        const punchWord = isPrice ? arPriceTag() : key;
        const fs = Math.min(1, (W - 50) / Math.max(1, c.measureText(punchWord).width));
        c.scale(fs, fs);
        kLongShadow(c, punchWord, 0, 0, isPrice ? sp.accent2 : '#ffffff', 'rgba(0,0,0,0.65)', 16, 0.85, 1);
        c.restore();
        mCaption(c, caption, W / 2, capY + 10, W - 60, capH - 10, 30, 'sans', '#ffffff', mClamp((local - 0.25) / 0.8), 'center', sp.accent2);
      } else if (M === 'cube') {
        // 큐브가 돌아가듯 옆면 사진으로 넘어감 (가로 압축으로 입체감)
        const turn = cutIdx === 0 ? 1 : mEase(local / 0.6);
        const cw = W * 0.78, chh = stageH * 0.86, cx = W / 2, cy = stageH * 0.52;
        const faceL = cw * (1 - turn), faceR = cw * turn;
        const x0 = cx - cw / 2;
        if (faceL > 1) {
          c.save(); c.beginPath(); c.rect(x0, cy - chh / 2, faceL, chh); c.clip();
          mPhoto(c, S, -1, x0, cy - chh / 2, faceL, chh, 1.05);
          c.fillStyle = `rgba(0,0,0,${0.5 * turn})`; c.fillRect(x0, cy - chh / 2, faceL, chh); c.restore();
        }
        c.save(); c.beginPath(); c.rect(x0 + faceL, cy - chh / 2, faceR, chh); c.clip();
        mPhoto(c, S, 0, x0 + faceL, cy - chh / 2, faceR, chh, 1.05 + lp * 0.04);
        c.fillStyle = `rgba(0,0,0,${0.5 * (1 - turn)})`; c.fillRect(x0 + faceL, cy - chh / 2, faceR, chh); c.restore();
        c.strokeStyle = sp.accent; c.lineWidth = 3; c.strokeRect(x0, cy - chh / 2, cw, chh);
        c.fillStyle = sp.accent2 + '55';
        c.beginPath(); c.moveTo(x0, cy + chh / 2); c.lineTo(x0 + cw, cy + chh / 2); c.lineTo(x0 + cw - 30, cy + chh / 2 + 22); c.lineTo(x0 + 30, cy + chh / 2 + 22); c.closePath(); c.fill();
        if (isPrice) mPrice(c, W, capY + 12, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 48 : 16), W - 60, capH - (isPrice ? 48 : 16), 38, sp.font, '#ffffff', e);
      } else if (M === 'glow') {
        // 카메라 글로우: 컷이 바뀔 때 아래·모서리에서 따뜻한 빛이 차오르며 이전 사진과 겹쳐 바뀜 (캡컷 "카메라 글로우")
        const tr = cutIdx > 0 && local < 0.6;
        const mix = tr ? mEase((local - 0.15) / 0.3) : 1;
        if (tr && mix < 1) mPhoto(c, S, -1, 0, 0, W, H, 1.06);
        c.save();
        c.globalAlpha = mix;
        mPhoto(c, S, 0, 0, 0, W, H, 1.04 + lp * 0.05);
        c.restore();
        mWarmLight(c, W, H, tr ? Math.sin(Math.PI * mClamp(local / 0.6)) : 0, t, cutIdx + 1);
        const bg = c.createLinearGradient(0, H * 0.5, 0, H);
        bg.addColorStop(0, 'rgba(0,0,0,0)');
        bg.addColorStop(1, 'rgba(0,0,0,0.82)');
        c.fillStyle = bg;
        c.fillRect(0, H * 0.5, W, H * 0.5);
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 40, sp.font, '#ffffff', e);
      } else if (M === 'bokeh') {
        // 보케 스포트라이트: 흐린 배경과 빛망울 위로 가운데만 또렷하게 열림 (캡컷 "갤럭시 블러")
        const scale = 1.04 + lp * 0.04;
        mBlurPhoto(c, S, 0, 0, 0, W, H, scale, 14);
        c.save();
        c.globalCompositeOperation = 'screen';
        c.fillStyle = sp.accent2 + '22';
        c.fillRect(0, 0, W, H);
        for (let i = 0; i < 9; i++) {
          const bx = W * ((i * 0.37 + 0.11) % 1) + Math.sin(t * 0.35 + i) * 18;
          const by = H * ((i * 0.53 + 0.07) % 0.9) + Math.cos(t * 0.3 + i * 1.3) * 14;
          const r = 18 + (i % 4) * 10;
          const bg = c.createRadialGradient(bx, by, 0, bx, by, r);
          bg.addColorStop(0, i % 2 ? 'rgba(255,255,255,0.32)' : sp.accent + '55');
          bg.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = bg;
          c.beginPath();
          c.arc(bx, by, r, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
        const open = mEase((local - 0.1) / 0.7);
        if (open > 0.01) {
          const cx = W / 2, cy = stageH * 0.5, R = W * 0.5 * open;
          const off = mOffscreen(W, H);
          const o = off.getContext('2d');
          o.setTransform(1, 0, 0, 1, 0, 0);
          o.globalCompositeOperation = 'source-over';
          o.clearRect(0, 0, W, H);
          mPhoto(o, S, 0, 0, 0, W, H, scale);
          o.globalCompositeOperation = 'destination-in';
          const m = o.createRadialGradient(cx, cy, R * 0.62, cx, cy, R);
          m.addColorStop(0, 'rgba(0,0,0,1)');
          m.addColorStop(1, 'rgba(0,0,0,0)');
          o.fillStyle = m;
          o.fillRect(0, 0, W, H);
          o.globalCompositeOperation = 'source-over';
          c.drawImage(off, 0, 0, W, H);
        }
        const bg = c.createLinearGradient(0, H * 0.48, 0, H);
        bg.addColorStop(0, 'rgba(0,0,0,0)');
        bg.addColorStop(1, 'rgba(0,0,0,0.82)');
        c.fillStyle = bg;
        c.fillRect(0, H * 0.48, W, H * 0.52);
        if (isPrice) mPrice(c, W, capY - 10, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 30 : 4), W - 80, capH - (isPrice ? 30 : 8), 38, sp.font, '#ffffff', e);
      } else if (M === 'in_g_sub') {
        // 시네마 자막: 꽉 찬 따뜻한 영상미 + 위아래 레터박스 + 하단 부드러운 영화 자막 감성
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.04 + lp * 0.04, 1.15);
        const vg = c.createLinearGradient(0, H * 0.52, 0, H);
        vg.addColorStop(0, 'rgba(18,14,11,0)');
        vg.addColorStop(1, 'rgba(18,14,11,0.58)');
        c.fillStyle = vg;
        c.fillRect(0, H * 0.52, W, H * 0.48);
        const bh = 68;
        c.fillStyle = 'rgba(16,13,10,0.88)';
        c.fillRect(0, 0, W, bh);
        c.fillRect(0, H - bh, W, bh);
        const n0 = new Date();
        const ds = `${n0.getFullYear()}.${String(n0.getMonth() + 1).padStart(2, '0')}.${String(n0.getDate()).padStart(2, '0')}`;
        inLabel(c, ds, 28, bh / 2, 'rgba(235,224,210,0.75)', 'left', Math.round(W * 0.026));
        inLabel(c, `0${cutIdx + 1} / 0${totalCuts}`, W - 28, bh / 2, 'rgba(235,224,210,0.75)', 'right', Math.round(W * 0.026));
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.24)';
        c.shadowBlur = 8;
        mCaption(c, caption, W / 2, H - bh - 330, W - 84, 259, Math.round(W * 0.0599), 'gowun', '#f7f2eb', e);
        c.restore();
        inSign(c, d, W / 2, H - bh / 2, 'rgba(235,224,210,0.8)', 'center', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.09);
      } else if (M === 'in_g_arch') {
        // 아치 무드: 따뜻한 코튼지 바탕 + 아치형 창문 액자 + 하단 에디토리얼 명조 자막
        const aw = W - 96, ah = Math.round(H * 0.64), ax = 48, ay = 86, r = aw / 2;
        const archPath = (pad) => {
          const rx = ax - pad, ry = ay - pad, rw = aw + pad * 2, rh = ah + pad * 2, rr = rw / 2;
          c.beginPath();
          c.arc( rx + rr, ry + rr, rr, Math.PI, 0, false);
          c.lineTo(rx + rw, ry + rh);
          c.lineTo(rx, ry + rh);
          c.closePath();
        };
        c.save();
        archPath(8);
        c.strokeStyle = 'rgba(140,115,91,0.32)';
        c.lineWidth = 1;
        c.stroke();
        archPath(0);
        c.clip();
        inPhotoFade(c, S, cutIdx, local, ax, ay, aw, ah, 1.03 + lp * 0.04, 1.0);
        c.restore();
        const n0 = new Date();
        inLabel(c, `${String(n0.getMonth() + 1).padStart(2, '0')} · ${String(n0.getDate()).padStart(2, '0')}`, W / 2, 46, '#8c735b', 'center', Math.round(W * 0.026));
        c.save();
        c.globalAlpha = ent;
        gRoundRect(c, W / 2 - 150, ay + ah - 26, 300, 44, 22);
        c.fillStyle = '#f9f5ef';
        c.shadowColor = 'rgba(60,40,20,0.12)';
        c.shadowBlur = 10;
        c.fill();
        c.restore();
        inSign(c, d, W / 2, ay + ah - 4, '#5e4d3e', 'center', Math.round(W * 0.03));
        mCaption(c, caption, W / 2, ay + ah + 38, W - 88, 288, Math.round(W * 0.0620), 'maru', '#2b2520', e);
        inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_g_strip') {
        // 필름 스트립: 왼쪽에 살짝 기운 3컷 밀착 인화 스트립 + 오른쪽 손글씨 메모
        const sw = 236, sh = H - 110, sx = 152, sy = H / 2;
        const drop = (1 - ent) * 24;
        c.save();
        c.translate(sx, sy + drop);
        c.rotate(-2.2 * Math.PI / 180);
        c.shadowColor = 'rgba(50,34,20,0.2)';
        c.shadowBlur = 16;
        c.shadowOffsetY = 6;
        c.fillStyle = '#26201b';
        gRoundRect(c, -sw / 2, -sh / 2, sw, sh, 6);
        c.fill();
        c.shadowColor = 'transparent';
        for (let y = -sh / 2 + 16; y < sh / 2 - 12; y += 26) {
          c.fillStyle = '#f3ede3';
          gRoundRect(c, -sw / 2 + 7, y, 8, 12, 2); c.fill();
          gRoundRect(c, sw / 2 - 15, y, 8, 12, 2); c.fill();
        }
        const fh = Math.floor((sh - 56) / 3), fw = sw - 46;
        [-1, 0, 1].forEach((k, i) => {
          const fy = -sh / 2 + 18 + i * (fh + 10);
          c.save();
          c.beginPath();
          c.rect(-fw / 2, fy, fw, fh);
          c.clip();
          mPhoto(c, S, k, -fw / 2, fy, fw, fh, i === 1 ? 1.03 + lp * 0.04 : 1.05);
          inWarm(c, -fw / 2, fy, fw, fh, i === 1 ? 0.9 : 1.15);
          if (i !== 1) {
            c.fillStyle = 'rgba(30,22,16,0.22)';
            c.fillRect(-fw / 2, fy, fw, fh);
          }
          c.restore();
        });
        c.restore();
        const rx = 286, rw = W - rx - 28;
        const n0 = new Date();
        inLabel(c, `${n0.getFullYear()}.${String(n0.getMonth() + 1).padStart(2, '0')}.${String(n0.getDate()).padStart(2, '0')}`, rx, 170, '#8c7765', 'left', Math.round(W * 0.026));
        c.strokeStyle = 'rgba(140,119,101,0.3)';
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(rx, 192); c.lineTo(W - 32, 192); c.stroke();
        mCaption(c, caption, rx, 224, rw, 624, Math.round(W * 0.0684), 'pen', '#2d2621', e, 'left');
        inSign(c, d, rx, H - 120, '#6e5c4d', 'left', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.08);
      } else if (M === 'in_g_postcard') {
        // 엽서 기록: 크림 질감 바탕 위 두꺼운 엽서 카드 + 우표 미니 컷 + 고운 명조 편지글
        const cw = W - 68, ch = H - 148, cx = 34, cy = 74;
        const lift = (1 - ent) * 18;
        c.save();
        c.translate(0, lift);
        c.shadowColor = 'rgba(65,45,28,0.16)';
        c.shadowBlur = 20;
        c.shadowOffsetY = 8;
        c.fillStyle = '#fffcf7';
        gRoundRect(c, cx, cy, cw, ch, 8);
        c.fill();
        c.shadowColor = 'transparent';
        const px = cx + 22, py = cy + 22, pw = cw - 44, ph = Math.round(ch * 0.62);
        inPhotoFade(c, S, cutIdx, local, px, py, pw, ph, 1.03 + lp * 0.03, 0.95);
        // 우측 상단 우표 프레임과 소인 스탬프
        const sw = 76, sh = 92, sx = px + pw - sw - 14, sy = py + 14;
        c.save();
        c.rotate(0.03);
        c.shadowColor = 'rgba(40,28,18,0.18)';
        c.shadowBlur = 8;
        c.fillStyle = '#faf5ed';
        c.fillRect(sx - 5, sy - 5, sw + 10, sh + 10);
        c.shadowColor = 'transparent';
        mPhoto(c, S, 1, sx, sy, sw, sh, 1.08);
        inWarm(c, sx, sy, sw, sh, 1.1);
        c.restore();
        c.strokeStyle = 'rgba(140,112,88,0.38)';
        c.lineWidth = 1.2;
        c.beginPath(); c.arc(sx - 10, sy + sh - 8, 22, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(sx - 10, sy + sh - 8, 16, 0, Math.PI * 2); c.stroke();
        const ty = py + ph + 26;
        c.strokeStyle = 'rgba(160,140,120,0.22)';
        c.beginPath(); c.moveTo(px, ty + 115); c.lineTo(px + pw, ty + 115); c.stroke();
        mCaption(c, caption, px + 4, ty, pw - 8, 250, Math.round(W * 0.0577), 'gowun', '#2c2520', e, 'left');
        const n0 = new Date();
        inLabel(c, `${n0.getFullYear()}.${String(n0.getMonth() + 1).padStart(2, '0')}.${String(n0.getDate()).padStart(2, '0')}`, px + 4, ty + 142, '#9c8b7a', 'left', Math.round(W * 0.026));
        inSign(c, d, px + pw - 4, ty + 142, '#6e5d4f', 'right', Math.round(W * 0.03));
        c.restore();
        inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_g_cam') {
        // 뷰파인더: 전체 화면 일상 컷 + 얇은 카메라 가이드라인 + 하단 담백한 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.03 + lp * 0.04, 0.9);
        const vg = c.createLinearGradient(0, H * 0.58, 0, H);
        vg.addColorStop(0, 'rgba(15,12,10,0)');
        vg.addColorStop(1, 'rgba(15,12,10,0.62)');
        c.fillStyle = vg;
        c.fillRect(0, H * 0.58, W, H * 0.42);
        const m = 34, len = 22;
        c.strokeStyle = 'rgba(255,250,244,0.72)';
        c.lineWidth = 1.5;
        [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => {
          c.beginPath();
          c.moveTo(x, y + dy * len); c.lineTo(x, y); c.lineTo(x + dx * len, y);
          c.stroke();
        });
        c.strokeStyle = 'rgba(255,250,244,0.45)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(W / 2 - 12, H / 2); c.lineTo(W / 2 + 12, H / 2);
        c.moveTo(W / 2, H / 2 - 12); c.lineTo(W / 2, H / 2 + 12);
        c.stroke();
        if (Math.floor(t * 2) % 2 === 0) {
          c.fillStyle = '#d9534f';
          c.beginPath(); c.arc(m + 18, m + 20, 4.5, 0, Math.PI * 2); c.fill();
        }
        const sec = String(Math.floor(t)).padStart(2, '0');
        const frm = String(Math.floor((t % 1) * 24)).padStart(2, '0');
        inLabel(c, `00:${sec}:${frm}`, m + 32, m + 20, 'rgba(255,250,244,0.88)', 'left', Math.round(W * 0.026));
        inLabel(c, `${cutIdx + 1} / ${totalCuts}`, W - m - 14, m + 20, 'rgba(255,250,244,0.88)', 'right', Math.round(W * 0.026));
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.22)';
        c.shadowBlur = 9;
        mCaption(c, caption, W / 2, H - 440, W - 100, 283, Math.round(W * 0.0620), 'pretL', '#ffffff', e);
        c.restore();
        inSign(c, d, W / 2, H - 64, 'rgba(255,250,244,0.82)', 'center', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.06);
      } else if (M === 'in_g_bookmark') {
        // 책갈피 노트: 깊이감 있는 배경 사진 위에 반투명 트레싱지 책갈피 태그와 세로 감성 문구
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.05 + lp * 0.04, 1.1);
        c.fillStyle = 'rgba(24,18,14,0.28)';
        c.fillRect(0, 0, W, H);
        const bw = W - 136, bh = Math.round(H * 0.44), bx = 68, by = Math.round(H * 0.42) + (1 - ent) * 22;
        c.save();
        c.globalAlpha = 0.92 * ent;
        c.shadowColor = 'rgba(20,12,6,0.22)';
        c.shadowBlur = 18;
        c.shadowOffsetY = 6;
        c.fillStyle = 'rgba(250,246,239,0.92)';
        gRoundRect(c, bx, by, bw, bh, 6);
        c.fill();
        c.shadowColor = 'transparent';
        c.strokeStyle = 'rgba(150,128,106,0.35)';
        c.lineWidth = 1;
        gRoundRect(c, bx + 10, by + 10, bw - 20, bh - 20, 4);
        c.stroke();
        c.fillStyle = 'rgba(120,98,78,0.45)';
        c.beginPath(); c.arc(W / 2, by + 28, 5, 0, Math.PI * 2); c.fill();
        c.strokeStyle = 'rgba(180,155,130,0.75)';
        c.lineWidth = 2;
        c.beginPath(); c.moveTo(W / 2, by - 46); c.lineTo(W / 2, by + 24); c.stroke();
        const n0 = new Date();
        inLabel(c, `${String(n0.getMonth() + 1).padStart(2, '0')}.${String(n0.getDate()).padStart(2, '0')}`, W / 2, by + 58, '#8c7662', 'center', Math.round(W * 0.026));
        mCaption(c, caption, W / 2, by + 84, bw - 56, (bh - 150) * 1.6, Math.round(W * 0.0577), 'maruL', '#2b2520', e);
        inSign(c, d, W / 2, by + bh - 36, '#6e5c4e', 'center', Math.round(W * 0.03));
        c.restore();
        inGrain(c, W, H, t, 0.08);
      } else if (M === 'in_h_plaque') {
        // 전시 캡션 카드: 화면 가득 찬 따뜻한 사진과 왼쪽 아래 미술관 캡션 명패
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.03 + lp * 0.03, 0.95);
        const vg = c.createLinearGradient(0, H * 0.45, 0, H);
        vg.addColorStop(0, 'rgba(24,18,14,0)');
        vg.addColorStop(1, 'rgba(24,18,14,0.48)');
        c.fillStyle = vg;
        c.fillRect(0, H * 0.45, W, H * 0.55);
        // 얇은 전시장 내부 여백 선
        c.strokeStyle = 'rgba(255,248,238,0.38)';
        c.lineWidth = Math.max(1, Math.round(W * 0.0018));
        c.strokeRect(W * 0.045, H * 0.035, W * 0.91, H * 0.93);
        // 크림색 전시 명패 카드
        const slide = (1 - ent) * H * 0.018;
        const cx = W * 0.08, cy = H * 0.64 + slide, cw = W * 0.78, ch = H * 0.245;
        c.save();
        c.shadowColor = 'rgba(20,14,10,0.22)';
        c.shadowBlur = 10;
        c.fillStyle = 'rgba(248,243,234,0.94)';
        gRoundRect(c, cx, cy, cw, ch, Math.round(W * 0.008));
        c.fill();
        c.restore();
        // 명패 내부 디테일
        c.fillStyle = '#8c7a6b';
        c.fillRect(cx + cw * 0.07, cy + ch * 0.23, cw * 0.12, Math.max(1, Math.round(W * 0.002)));
        inLabel(c, `전시 기록 · 제 ${String(cutIdx + 1).padStart(2, '0')}장`, cx + cw * 0.07, cy + ch * 0.14, '#7a6a5c', 'left', Math.round(W * 0.025));
        mCaption(c, caption, cx + cw * 0.07, cy + ch * 0.30, cw * 0.86, ch * 0.48, Math.round(W * 0.056), 'maru', '#2b241f', e, 'left');
        inSign(c, d, cx + cw * 0.93, cy + ch * 0.86, '#6e5f52', 'right', Math.round(W * 0.029));
        inGrain(c, W, H, t, 0.065);
      } else if (M === 'in_h_panes') {
        // 세 갈래 시선: 같은 사진을 세 개의 세로 창으로 나누어 미묘한 시차로 흐르게 연출
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.12 + lp * 0.03, 1.0);
        c.fillStyle = 'rgba(24,19,15,0.42)';
        c.fillRect(0, 0, W, H);
        const gap = Math.round(W * 0.018);
        const mx = Math.round(W * 0.055);
        const pw = Math.round((W - mx * 2 - gap * 2) / 3);
        const ph = Math.round(H * 0.78);
        const pyBase = Math.round(H * 0.09);
        for (let i = 0; i < 3; i++) {
          const px = mx + i * (pw + gap);
          const drift = Math.sin(t * 0.9 + i * 1.3) * H * 0.008 + (i - 1) * H * 0.014 * ent;
          const py = pyBase + drift;
          c.save();
          gRoundRect(c, px, py, pw, ph, Math.round(W * 0.012));
          c.clip();
          inPhotoFade(c, S, cutIdx, local, 0, drift * 0.6, W, H, 1.04 + lp * 0.03, 0.9);
          c.restore();
          c.strokeStyle = 'rgba(245,236,224,0.45)';
          c.lineWidth = Math.max(1, Math.round(W * 0.0016));
          gRoundRect(c, px, py, pw, ph, Math.round(W * 0.012));
          c.stroke();
        }
        const shade = c.createLinearGradient(0, H * 0.56, 0, H);
        shade.addColorStop(0, 'rgba(18,14,11,0)');
        shade.addColorStop(1, 'rgba(18,14,11,0.78)');
        c.fillStyle = shade;
        c.fillRect(0, H * 0.56, W, H * 0.44);
        inLabel(c, `시선의 조각 · 0${cutIdx + 1}`, W / 2, H * 0.05, 'rgba(242,232,218,0.85)', 'center', Math.round(W * 0.026));
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.24)';
        c.shadowBlur = 9;
        mCaption(c, caption, W / 2, H * 0.69, W * 0.82, H * 0.19, Math.round(W * 0.06), 'gowun', '#faf3e8', e, 'center');
        c.restore();
        inSign(c, d, W / 2, H * 0.92, 'rgba(242,232,218,0.82)', 'center', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.075);
      } else if (M === 'in_h_double') {
        // 이중노출 잔상: 배경 풀샷 위에 몽환적으로 겹쳐지는 필름 잔상과 에디토리얼 명조 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.06 + lp * 0.04, 1.05);
        c.fillStyle = 'rgba(22,17,13,0.28)';
        c.fillRect(0, 0, W, H);
        // 안쪽 잔상 프레임 (이중노출 효과)
        const gx = W * 0.11 + Math.sin(t * 0.7) * W * 0.012;
        const gy = H * 0.11 + Math.cos(t * 0.6) * H * 0.008;
        const gw = W * 0.78, gh = H * 0.52;
        c.save();
        c.globalAlpha = 0.68 * ent;
        gRoundRect(c, gx, gy, gw, gh, Math.round(W * 0.01));
        c.clip();
        inPhotoFade(c, S, cutIdx, local, gx - W * 0.04, gy - H * 0.03, gw + W * 0.08, gh + H * 0.06, 1.02 + lp * 0.02, 1.15);
        c.restore();
        c.strokeStyle = 'rgba(255,246,234,0.42)';
        c.lineWidth = Math.max(1, Math.round(W * 0.0015));
        gRoundRect(c, gx, gy, gw, gh, Math.round(W * 0.01));
        c.stroke();
        // 하단 그라데이션과 서정적인 타이포
        const vg = c.createLinearGradient(0, H * 0.52, 0, H);
        vg.addColorStop(0, 'rgba(18,13,10,0)');
        vg.addColorStop(1, 'rgba(18,13,10,0.76)');
        c.fillStyle = vg;
        c.fillRect(0, H * 0.52, W, H * 0.48);
        inLabel(c, `기억의 온도 · ${String(cutIdx + 1).padStart(2, '0')} / ${String(totalCuts).padStart(2, '0')}`, W * 0.11, H * 0.065, 'rgba(247,238,226,0.86)', 'left', Math.round(W * 0.026));
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.24)';
        c.shadowBlur = 10;
        mCaption(c, caption, W * 0.11, H * 0.68, W * 0.78, H * 0.19, Math.round(W * 0.06), 'maruL', '#fff8ee', e, 'left');
        c.restore();
        inSign(c, d, W * 0.89, H * 0.91, 'rgba(247,238,226,0.82)', 'right', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.08);
      } else if (M === 'in_h_vinyl') {
        // 오후의 레코드: 따뜻한 종이 배경 위 정사각 앨범 재킷과 살짝 나와 회전하는 바이닐 음반
        c.fillStyle = '#efe7dc';
        c.fillRect(0, 0, W, H);
        const jSize = Math.round(W * 0.72);
        const jx = Math.round(W * 0.08), jy = Math.round(H * 0.15);
        // 재킷 오른쪽으로 살짝 나온 레코드판
        const vx = jx + jSize * 0.68 + ent * jSize * 0.14;
        const vy = jy + jSize * 0.5;
        const vr = jSize * 0.46;
        c.save();
        c.shadowColor = 'rgba(30,22,16,0.20)';
        c.shadowBlur = 10;
        c.beginPath();
        c.arc(vx, vy, vr, 0, Math.PI * 2);
        c.fillStyle = '#241f1c';
        c.fill();
        c.restore();
        // 레코드 소리골과 중앙 라벨
        c.strokeStyle = 'rgba(255,245,232,0.12)';
        c.lineWidth = Math.max(1, Math.round(W * 0.0015));
        for (let r = 0.55; r <= 0.88; r += 0.11) {
          c.beginPath();
          c.arc(vx, vy, vr * r, 0, Math.PI * 2);
          c.stroke();
        }
        c.beginPath();
        c.arc(vx, vy, vr * 0.32, 0, Math.PI * 2);
        c.fillStyle = '#d9c7b2';
        c.fill();
        c.beginPath();
        c.arc(vx, vy, vr * 0.06, 0, Math.PI * 2);
        c.fillStyle = '#efe7dc';
        c.fill();
        // 앨범 재킷 사진
        c.save();
        c.shadowColor = 'rgba(30,22,16,0.22)';
        c.shadowBlur = 10;
        gRoundRect(c, jx, jy, jSize, jSize, Math.round(W * 0.012));
        c.fillStyle = '#e2d6c5';
        c.fill();
        c.clip();
        inPhotoFade(c, S, cutIdx, local, jx, jy, jSize, jSize, 1.03 + lp * 0.03, 0.95);
        c.restore();
        // 상단 트랙 라벨 및 하단 가사형 자막
        inLabel(c, `오후의 선곡 · 트랙 0${cutIdx + 1}`, jx, H * 0.105, '#7a6858', 'left', Math.round(W * 0.026));
        c.fillStyle = 'rgba(122,104,88,0.35)';
        c.fillRect(jx, H * 0.62, W * 0.84, Math.max(1, Math.round(W * 0.0015)));
        mCaption(c, caption, jx, H * 0.655, W * 0.84, H * 0.20, Math.round(W * 0.06), 'gowun', '#2e251f', e, 'left');
        inSign(c, d, W * 0.92, H * 0.91, '#6e5d4f', 'right', Math.round(W * 0.03));
        inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_film') {
        // 크림 필름: 크림 바탕 위 4:5 사진, 아래 얇은 명조 자막과 서명
        const px = 36, pw = W - 72, ph = Math.round(pw * 1.22), py = 74;
        inLabel(c, inDateLabel(), px, 44, '#8a7d70');
        inLabel(c, 'today\x27s pick', W - px, 44, '#8a7d70', 'right');
        inPhotoFade(c, S, cutIdx, local, px, py, pw, ph, 1.02 + lp * 0.03);
        mCaption(c, caption, px, py + ph + 26, pw, 120, 30, 'maru', '#2b2622', e, 'left');
        inSign(c, d, W - px, H - 46, '#6f6156');
        inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_mood') {
        // 무드 풀샷: 꽉 찬 사진 + 따뜻한 색감·비네트, 왼쪽 아래 작은 명조 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.04 + lp * 0.04, 1.1);
        const vg = c.createLinearGradient(0, H * 0.5, 0, H);
        vg.addColorStop(0, 'rgba(20,14,10,0)');
        vg.addColorStop(1, 'rgba(20,14,10,0.62)');
        c.fillStyle = vg;
        c.fillRect(0, H * 0.5, W, H * 0.5);
        inLabel(c, `today · ${inDateLabel().toLowerCase()}`, 30, 42, 'rgba(255,255,255,0.86)');
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.35)';
        c.shadowBlur = 12;
        mCaption(c, caption, 30, H - 230, W - 90, 130, 30, 'maru', '#ffffff', e, 'left');
        c.restore();
        inSign(c, d, 30, H - 74, 'rgba(255,255,255,0.82)', 'left');
        inGrain(c, W, H, t, 0.09);
      } else if (M === 'in_diary') {
        // 다이어리 노트: 줄 노트 바탕, 살짝 기운 폴라로이드 + 마스킹테이프, 손글씨 자막
        c.strokeStyle = 'rgba(160,140,120,0.16)';
        c.lineWidth = 1;
        for (let y = 120; y < H; y += 34) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
        const fw = 360, fh = 430, ang = (cutIdx % 2 ? 2.2 : -2.6) * Math.PI / 180;
        const drop = (1 - mEase(local / 0.5)) * (cutIdx > 0 ? 30 : 0);
        c.save();
        c.translate(W / 2, 90 + fh / 2 + drop);
        c.rotate(ang);
        c.shadowColor = 'rgba(60,40,20,0.22)';
        c.shadowBlur = 18;
        c.shadowOffsetY = 6;
        c.fillStyle = '#ffffff';
        c.fillRect(-fw / 2, -fh / 2, fw, fh);
        c.shadowColor = 'transparent';
        mPhoto(c, S, 0, -fw / 2 + 16, -fh / 2 + 16, fw - 32, fh - 92, 1.04 + lp * 0.03);
        inWarm(c, -fw / 2 + 16, -fh / 2 + 16, fw - 32, fh - 92, 0.8);
        c.fillStyle = 'rgba(214,190,150,0.72)';
        c.save(); c.translate(0, -fh / 2); c.rotate(-0.06); c.fillRect(-60, -14, 120, 28); c.restore();
        c.fillStyle = '#9a8676';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = gFont(400, 22, KIT_FONTS.pen.f);
        c.fillText(inDateLabel().toLowerCase(), 0, fh / 2 - 38);
        c.restore();
        mCaption(c, caption, W / 2, 90 + fh + 40, W - 80, 150, 40, 'pen', '#3b2f28', e);
        inSign(c, d, W - 40, H - 46, '#7a6658');
        inGrain(c, W, H, t, 0.05);
      } else if (M === 'in_letter') {
        // 미니멀 레터: 여백 많은 흰 바탕, 가운데 작은 사진, 얇은 고딕 자막
        inLabel(c, 'a little note', W / 2, 70, '#a39a8e', 'center', 13);
        c.fillStyle = '#d9d3c9';
        c.fillRect(W / 2 - 14, 92, 28, 1);
        const pw = 300, ph = 375, px = (W - pw) / 2, py = 130;
        inPhotoFade(c, S, cutIdx, local, px, py, pw, ph, 1.03 + lp * 0.03, 0.7);
        mCaption(c, caption, W / 2, py + ph + 44, W - 120, 120, 25, 'pretL', '#2a2724', e);
        inSign(c, d, W / 2, H - 70, '#8f867a', 'center', 16);
        inGrain(c, W, H, t, 0.04);
      } else if (M === 'in_vlog') {
        // 브이로그 타임스탬프: 꽉 찬 사진, 왼쪽 위 시간·짧은 영문, 가운데 아래 담백한 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.05 + lp * 0.05, 0.9);
        const sec = Math.floor(t);
        const n = new Date();
        const hh = n.getHours();
        inLabel(c, `${hh < 12 ? 'AM' : 'PM'} ${((hh + 11) % 12) + 1}:${String((n.getMinutes() + sec) % 60).padStart(2, '0')}`, 28, 40, '#ffffff', 'left', 15);
        inLabel(c, `vlog · ${String(cutIdx + 1).padStart(2, '0')}`, 28, 64, 'rgba(255,255,255,0.75)', 'left', 12);
        c.save();
        c.shadowColor = 'rgba(0,0,0,0.55)';
        c.shadowBlur = 10;
        mCaption(c, caption, W / 2, H - 250, W - 70, 120, 28, 'pretM', '#ffffff', e);
        c.restore();
        inSign(c, d, W / 2, H - 92, 'rgba(255,255,255,0.8)', 'center', 15);
        inGrain(c, W, H, t, 0.06);
      } else if (M === 'in_collage') {
        // 크림 콜라주: 큰 사진과 작은 사진이 겹친 콜라주, 위쪽에 명조 자막
        mCaption(c, caption, 36, 54, W - 72, 120, 30, 'maru', '#2d2621', e, 'left');
        const ent2 = mEase(local / 0.6);
        c.save();
        c.translate(40 + 222, 200 + 260);
        c.rotate(-1.5 * Math.PI / 180);
        c.shadowColor = 'rgba(60,40,20,0.18)'; c.shadowBlur = 16; c.shadowOffsetY = 5;
        c.fillStyle = '#fffdf9';
        c.fillRect(-222, -260, 444, 520);
        c.shadowColor = 'transparent';
        mPhoto(c, S, 0, -210, -248, 420, 496, 1.03 + lp * 0.03);
        inWarm(c, -210, -248, 420, 496, 0.9);
        c.restore();
        c.save();
        c.globalAlpha = ent2;
        c.translate(W - 150, H - 250 + (1 - ent2) * 24);
        c.rotate(3 * Math.PI / 180);
        c.shadowColor = 'rgba(60,40,20,0.2)'; c.shadowBlur = 14; c.shadowOffsetY = 5;
        c.fillStyle = '#fffdf9';
        c.fillRect(-105, -130, 210, 260);
        c.shadowColor = 'transparent';
        mPhoto(c, S, 1, -97, -122, 194, 220, 1.06);
        inWarm(c, -97, -122, 194, 220, 0.9);
        c.restore();
        inLabel(c, inDateLabel(), 40, H - 120, '#8a7a6b');
        inSign(c, d, 40, H - 92, '#6f6156', 'left', 17);
        inGrain(c, W, H, t, 0.06);
      } else if (M === 'in_music') {
        // 뮤직 플레이어: 따뜻한 사진 위에 반투명 플레이어 카드 (앨범 사진·곡명=자막·가게명·재생 막대)
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.06 + lp * 0.04, 1.1);
        c.fillStyle = 'rgba(20,14,10,0.18)';
        c.fillRect(0, 0, W, H);
        const cw = W - 80, ch = 250, cx = 40, cy = H - ch - 120 + (1 - ent) * 30;
        c.save();
        c.globalAlpha = 0.25 + 0.75 * ent;
        gRoundRect(c, cx, cy, cw, ch, 28);
        c.fillStyle = 'rgba(250,246,240,0.82)';
        c.fill();
        const art = 84;
        c.save();
        gRoundRect(c, cx + 22, cy + 22, art, art, 12);
        c.clip();
        mPhoto(c, S, 0, cx + 22, cy + 22, art, art, 1.2);
        c.restore();
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.fillStyle = '#1c1714';
        const r = mFit(c, caption, cw - art - 64, 2, 22, 15, 'maru');
        c.font = gFont(KIT_FONTS.maru.w, r.size, KIT_FONTS.maru.f);
        r.lines.forEach((ln, i) => c.fillText(ln, cx + art + 40, cy + 44 + i * r.lh));
        c.fillStyle = '#7d7066';
        gDrawLine(c, String((d && d.name) || (typeof IND !== 'undefined' && IND.place) || ''), cx + art + 40, cy + 44 + r.lines.length * r.lh + 4, cw - art - 64, 15, 11, KIT_FONTS.pretL.f, 500);
        const by = cy + 150, bw = cw - 44;
        c.fillStyle = 'rgba(60,50,40,0.18)';
        gRoundRect(c, cx + 22, by, bw, 5, 3); c.fill();
        c.fillStyle = '#2b2622';
        gRoundRect(c, cx + 22, by, Math.max(6, bw * ((cutIdx + lp) / totalCuts)), 5, 3); c.fill();
        c.fillStyle = '#7d7066';
        c.font = gFont(500, 12, GENRE_FONTS.sans);
        const el = Math.floor(t);
        c.fillText(`0:${String(el).padStart(2, '0')}`, cx + 22, by + 22);
        c.textAlign = 'right';
        c.fillText(`-0:${String(Math.max(0, Math.round(mainDuration - t))).padStart(2, '0')}`, cx + 22 + bw, by + 22);
        // 재생 버튼: ◀◀  ❚❚  ▶▶
        const my = cy + 212, mx = cx + cw / 2;
        c.fillStyle = '#1c1714';
        const tri = (x, dir) => { c.beginPath(); c.moveTo(x, my - 9); c.lineTo(x + 13 * dir, my); c.lineTo(x, my + 9); c.closePath(); c.fill(); };
        tri(mx - 74, -1); tri(mx - 62, -1);
        c.fillRect(mx - 9, my - 11, 6, 22); c.fillRect(mx + 3, my - 11, 6, 22);
        tri(mx + 62, 1); tri(mx + 74, 1);
        c.restore();
        inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_memo') {
        // 아이폰 메모: 메모 앱 화면처럼 — 노란 "< 메모", 날짜, 굵은 제목(자막)이 타이핑되듯, 아래 둥근 사진
        c.textBaseline = 'middle';
        c.fillStyle = '#e0a400';
        c.textAlign = 'left';
        c.font = gFont(500, 19, GENRE_FONTS.sans);
        c.fillText('‹ 메모', 22, 42);
        c.textAlign = 'right';
        c.fillText('완료', W - 22, 42);
        const n0 = new Date();
        c.textAlign = 'center';
        c.fillStyle = '#9a9a9f';
        c.font = gFont(500, 13, GENRE_FONTS.sans);
        c.fillText(`${n0.getFullYear()}년 ${n0.getMonth() + 1}월 ${n0.getDate()}일 ${n0.getHours() < 12 ? '오전' : '오후'} ${((n0.getHours() + 11) % 12) + 1}:${String(n0.getMinutes()).padStart(2, '0')}`, W / 2, 84);
        const shown = caption.slice(0, Math.max(1, Math.ceil(caption.length * mClamp(local / 1.2))));
        c.textAlign = 'left';
        c.fillStyle = '#1c1c1e';
        const r = mFit(c, shown, W - 56, 3, 30, 20, 'pretM');
        c.font = gFont(700, r.size, KIT_FONTS.pretM.f);
        r.lines.forEach((ln, i) => c.fillText(ln, 28, 130 + i * r.lh));
        if (local < 1.3 && Math.floor(t * 2.5) % 2 === 0) {
          const last = r.lines[r.lines.length - 1] || '';
          c.fillStyle = '#e0a400';
          c.fillRect(28 + c.measureText(last).width + 3, 130 + (r.lines.length - 1) * r.lh - r.size * 0.55, 2, r.size * 1.1);
        }
        const py = 150 + Math.max(1, r.lines.length) * r.lh, ph = H - py - 96;
        c.save();
        gRoundRect(c, 28, py, W - 56, ph, 14);
        c.clip();
        inPhotoFade(c, S, cutIdx, local, 28, py, W - 56, ph, 1.04 + lp * 0.03, 0.6);
        c.restore();
        inSign(c, d, 28, H - 52, '#8e8e93', 'left', 16);
      } else if (M === 'in_lock') {
        // 잠금화면: 꽉 찬 사진 + 얇고 큰 시계 + 아래 알림 말풍선(가게 이름·자막)
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.05 + lp * 0.04, 0.8);
        const tg = c.createLinearGradient(0, 0, 0, H * 0.4);
        tg.addColorStop(0, 'rgba(0,0,0,0.35)'); tg.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = tg; c.fillRect(0, 0, W, H * 0.4);
        const n1 = new Date();
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillStyle = 'rgba(255,255,255,0.92)';
        c.font = gFont(500, 18, GENRE_FONTS.sans);
        c.fillText(`${n1.getMonth() + 1}월 ${n1.getDate()}일 ${['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][n1.getDay()]}`, W / 2, 96);
        c.fillStyle = '#ffffff';
        c.font = gFont(200, 104, GENRE_FONTS.sans);
        c.fillText(`${String(n1.getHours()).padStart(2, '0')}:${String(n1.getMinutes()).padStart(2, '0')}`, W / 2, 172);
        const ny = H - 230 + (1 - ent) * 40, nw = W - 40, nx = 20;
        c.save();
        c.globalAlpha = ent;
        gRoundRect(c, nx, ny, nw, 104, 22);
        c.fillStyle = 'rgba(245,242,238,0.78)';
        c.fill();
        gRoundRect(c, nx + 16, ny + 18, 38, 38, 9);
        c.fillStyle = sp.accent2 === '#ffffff' ? '#2b2622' : sp.accent2;
        c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.font = gFont(700, 18, GENRE_FONTS.sans);
        c.fillText(String((d && d.name) || (typeof IND !== 'undefined' && IND.place) || '·').slice(0, 1), nx + 35, ny + 38);
        c.textAlign = 'left';
        c.fillStyle = '#1c1c1e';
        gDrawLine(c, String((d && d.name) || (typeof IND !== 'undefined' && IND.place) || ''), nx + 68, ny + 30, nw - 140, 16, 12, GENRE_FONTS.sans, 700);
        c.fillStyle = '#8e8e93';
        c.textAlign = 'right';
        c.font = gFont(500, 13, GENRE_FONTS.sans);
        c.fillText('지금', nx + nw - 16, ny + 30);
        c.textAlign = 'left';
        c.fillStyle = '#2c2c2e';
        const r = mFit(c, caption, nw - 90, 2, 17, 13, 'pretL');
        c.font = gFont(500, r.size, KIT_FONTS.pretL.f);
        r.lines.forEach((ln, i) => c.fillText(ln, nx + 68, ny + 58 + i * r.lh));
        c.restore();
        c.fillStyle = 'rgba(255,255,255,0.85)';
        gRoundRect(c, W / 2 - 66, H - 22, 132, 5, 3); c.fill();
        inGrain(c, W, H, t, 0.05);
      } else if (M === 'in_dump') {
        // 포토덤프 리캡: 손글씨 제목, 흩어진 사진 세 장(하나씩 툭툭 놓임), 반짝이 낙서, 손글씨 자막
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.fillStyle = '#2d2621';
        c.font = gFont(400, 44, KIT_FONTS.pen.f);
        c.fillText("today's recap", 30, 58);
        c.fillStyle = '#c2603f';
        c.font = gFont(500, 14, GENRE_FONTS.sans);
        c.fillText(`${cutIdx + 1}/${totalCuts}`, W - 64, 58);
        const spots = [[-1, 150, 210, 200, 240, -6], [1, 360, 250, 180, 220, 5], [0, 250, 430, 280, 330, -1.5]];
        spots.forEach(([k, x, y, w, h, deg], i) => {
          const pe = i === 2 ? mEase(local / 0.45) : 1;
          if (pe <= 0) return;
          c.save();
          c.globalAlpha = pe;
          c.translate(x, y + (1 - pe) * -30);
          c.rotate(deg * Math.PI / 180);
          c.scale(0.9 + 0.1 * pe, 0.9 + 0.1 * pe);
          c.shadowColor = 'rgba(60,40,20,0.2)'; c.shadowBlur = 12; c.shadowOffsetY = 4;
          c.fillStyle = '#fffdf9';
          c.fillRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16);
          c.shadowColor = 'transparent';
          mPhoto(c, S, k, -w / 2, -h / 2, w, h, 1.06);
          inWarm(c, -w / 2, -h / 2, w, h, 0.9);
          c.restore();
        });
        // 반짝이 낙서 두 개
        const spark = (x, y, r) => { c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.28 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); };
        c.fillStyle = '#e8b04b';
        spark(W - 70, 150, 16 + Math.sin(t * 4) * 2);
        spark(70, 640, 11 + Math.cos(t * 4) * 2);
        mCaption(c, caption, W / 2, 640, W - 70, 130, 38, 'pen', '#2d2621', e);
        inSign(c, d, W - 30, H - 44, '#7a6658');
        inGrain(c, W, H, t, 0.05);
      } else if (M === 'in_cal') {
        // 캘린더 카드: 위쪽 사진, 그 위로 겹친 흰 카드에 영어 요일·날짜, 아래 명조 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, Math.round(H * 0.6), 1.05 + lp * 0.04, 1);
        const n2 = new Date();
        const cy2 = Math.round(H * 0.5) + (1 - ent) * 24;
        c.save();
        c.shadowColor = 'rgba(60,40,20,0.18)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
        gRoundRect(c, 34, cy2, W - 68, H - cy2 - 70, 18);
        c.fillStyle = '#fffdf9';
        c.fill();
        c.restore();
        c.fillStyle = '#c2603f';
        gRoundRect(c, 34, cy2, W - 68, 10, 5); c.fill();
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.fillStyle = '#2b2622';
        c.font = gFont(600, 40, KIT_FONTS.maru.f);
        c.fillText(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n2.getDay()], 58, cy2 + 56);
        c.fillStyle = '#c2603f';
        c.textAlign = 'right';
        c.font = gFont(500, 18, GENRE_FONTS.sans);
        c.fillText(`${String(n2.getMonth() + 1).padStart(2, '0')}.${String(n2.getDate()).padStart(2, '0')}`, W - 58, cy2 + 58);
        c.fillStyle = '#e6ddd0';
        c.fillRect(58, cy2 + 92, W - 116, 1);
        mCaption(c, caption, 58, cy2 + 108, W - 116, H - cy2 - 230, 28, 'maru', '#2b2622', e, 'left');
        inSign(c, d, W - 58, H - 108, '#7a6d61');
        inGrain(c, W, H, t, 0.06);
      } else if (M === 'in_x_contact') {
        // 밀착인화: 질감 있는 인화지 위 정돈된 여섯 장, 선택 컷의 작은 황토색 표식
        const pad = W * 0.07, gap = W * 0.025, active = S.idx % 6;
        const sheet = Math.floor(S.idx / 6), sheetFade = S.idx > 0 && active === 0 ? mEase(S.into / 0.5) : 1;
        inLabel(c, '오늘 모은 장면', pad, H * 0.035, '#786653', 'left', W * 0.024);
        inLabel(c, `${cutIdx + 1} / ${totalCuts}`, W - pad, H * 0.035, '#786653', 'right', W * 0.024);
        mCaption(c, caption, pad, H * 0.06, W - pad * 2, H * 0.13, W * 0.052, 'pretL', '#332b25', e, 'left');
        const fw = (W - pad * 2 - gap) / 2, fh = H * 0.208;
        for (let i = 0; i < 6; i++) {
          const x = pad + (i % 2) * (fw + gap), y = H * 0.22 + Math.floor(i / 2) * (fh + gap);
          const edge = W * 0.009, footer = H * 0.021;
          c.fillStyle = '#faf5eb';
          c.fillRect(x, y, fw, fh);
          const frameScene = Object.assign({}, S, { idx: sheet * 6 + i });
          // 같은 인화지는 유지하고 여섯 장을 넘길 때만 이전 인화지와 겹쳐 전환
          if (sheetFade < 1) mPhoto(c, Object.assign({}, S, { idx: (sheet - 1) * 6 + i }), 0, x + edge, y + edge, fw - edge * 2, fh - edge - footer, 1.025);
          c.save(); c.globalAlpha = sheetFade;
          mPhoto(c, frameScene, 0, x + edge, y + edge, fw - edge * 2, fh - edge - footer, 1.025 + S.p * 0.018);
          c.restore();
          inWarm(c, x + edge, y + edge, fw - edge * 2, fh - edge - footer, 0.85);
          inLabel(c, String((sheet * 6 + i) % Math.max(1, S.n) + 1).padStart(2, '0'), x + edge * 2, y + fh - footer * 0.48, '#786653', 'left', W * 0.019);
          if (i === active) {
            c.save();
            c.globalAlpha = 0.3 + ent * 0.7;
            c.fillStyle = '#987354';
            c.fillRect(x + fw - W * 0.07, y + fh - footer * 0.65, W * 0.045, H * 0.004);
            c.restore();
          }
        }
        inGrain(c, W, H, t, 0.065);
      } else if (M === 'in_x_linen') {
        // 리넨: 성긴 직물 바탕의 세로 인화물과 옆에서 겹친 접지, 천천히 떠오르는 사진
        c.fillStyle = 'rgba(112,91,65,0.07)';
        for (let x = 0; x < W; x += W / 55) c.fillRect(x, 0, W * 0.0015, H);
        c.fillStyle = 'rgba(255,251,239,0.25)';
        for (let y = 0; y < H; y += H / 85) c.fillRect(0, y, W, H * 0.001);
        const px = W * 0.27, py = H * 0.12 + Math.sin(t * 0.35) * H * 0.004;
        const pw = W * 0.65, ph = H * 0.69, edge = W * 0.016;
        c.fillStyle = '#faf5e9';
        c.fillRect(px - edge, py - edge, pw + edge * 2, ph + edge * 2);
        inPhotoFade(c, S, cutIdx, local, px, py, pw, ph, 1.035 + lp * 0.022, 0.8);
        c.fillStyle = '#978269';
        c.font = gFont(400, W * 0.04, KIT_FONTS.gowun.f);
        c.textAlign = 'center'; c.textBaseline = 'middle';
        Array.from('일상의결').forEach((ch, i) => c.fillText(ch, W * 0.13, H * 0.15 + i * W * 0.055));
        const nx = W * 0.06, ny = H * 0.45 + (1 - ent) * H * 0.008;
        c.fillStyle = '#f5efdf';
        c.fillRect(nx, ny, W * 0.58, H * 0.265);
        c.fillStyle = '#e8decb';
        c.fillRect(nx + W * 0.025, ny, W * 0.007, H * 0.265);
        inLabel(c, '간직하고 싶은 순간', nx + W * 0.06, ny + H * 0.032, '#88725b', 'left', W * 0.023);
        mCaption(c, caption, nx + W * 0.06, ny + H * 0.055, W * 0.46, H * 0.185, W * 0.05, 'gowun', '#3b342b', e, 'left');
        inLabel(c, inDateLabel().split(' ')[0], W * 0.91, H * 0.85, '#88725b', 'right', W * 0.023);
        inGrain(c, W, H, t, 0.055);
      } else if (M === 'in_x_cover') {
        // 작은 잡지: 사진 전체를 표지로, 큰 한글 제호와 오른쪽 정렬 기사 제목
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.025 + lp * 0.025, 0.85);
        const shade = c.createLinearGradient(0, 0, 0, H);
        shade.addColorStop(0, 'rgba(28,22,16,0.66)');
        shade.addColorStop(0.35, 'rgba(28,22,16,0.06)');
        shade.addColorStop(0.55, 'rgba(28,22,16,0.12)');
        shade.addColorStop(1, 'rgba(28,22,16,0.75)');
        c.fillStyle = shade; c.fillRect(0, 0, W, H);
        inLabel(c, '일상을 담은 작은 잡지', W * 0.08, H * 0.055, '#e7dac4', 'left', W * 0.023);
        c.save();
        c.globalAlpha = mEase(local / 0.85);
        c.fillStyle = '#fff7e9';
        c.font = gFont(600, W * 0.135, KIT_FONTS.maru.f);
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('우리의 하루', W / 2, H * 0.125 + (1 - ent) * H * 0.006);
        c.fillStyle = 'rgba(255,247,233,0.6)';
        c.fillRect(W * 0.08, H * 0.182, W * 0.84, H * 0.001);
        c.restore();
        inLabel(c, `${String(cutIdx + 1).padStart(2, '0')}호`, W * 0.92, H * 0.21, '#e7dac4', 'right', W * 0.027);
        inLabel(c, '이번 장면', W * 0.9, H * 0.645, '#e7dac4', 'right', W * 0.024);
        mCaption(c, caption, W * 0.9, H * 0.675, W * 0.74, H * 0.19, W * 0.064, 'maru', '#fff7e9', e, 'right');
        inGrain(c, W, H, t, 0.065);
      } else if (M === 'in_x_tabs') {
        // 붙여둔 한마디: 꽉 찬 사진 가장자리의 색인과 가로로 살짝 들어오는 손글씨 종이 탭
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.04 + lp * 0.02, 0.9);
        c.fillStyle = 'rgba(37,30,21,0.12)'; c.fillRect(0, 0, W, H);
        const labels = ['눈길', '머문 곳', '기억'], colors = ['#d9d4b9', '#e8cfb9', '#eee5ce'];
        labels.forEach((label, i) => {
          const selected = i === cutIdx % 3, tw = W * (selected ? 0.27 : 0.22);
          const tx = W - tw, ty = H * (0.13 + i * 0.058);
          c.fillStyle = colors[i];
          gRoundRect(c, tx, ty, tw + W * 0.02, H * 0.045, W * 0.008); c.fill();
          inLabel(c, label, tx + W * 0.035, ty + H * 0.0225, '#574b3e', 'left', W * 0.025);
        });
        const nx = W * 0.07 + (1 - ent) * W * 0.025, ny = H * 0.57;
        c.fillStyle = '#f6edda';
        gRoundRect(c, nx, ny, W * 0.81, H * 0.255, W * 0.008); c.fill();
        c.fillStyle = '#c7c7aa'; c.fillRect(nx, ny, W * 0.025, H * 0.255);
        c.fillStyle = '#e3d6bd';
        c.beginPath(); c.moveTo(nx + W * 0.81, ny + H * 0.22);
        c.lineTo(nx + W * 0.75, ny + H * 0.255); c.lineTo(nx + W * 0.81, ny + H * 0.255); c.closePath(); c.fill();
        inLabel(c, '여기에 남겨둘 말', nx + W * 0.065, ny + H * 0.035, '#8a775d', 'left', W * 0.024);
        mCaption(c, caption, nx + W * 0.065, ny + H * 0.06, W * 0.67, H * 0.17, W * 0.058, 'pen', '#46392d', e, 'left');
        inGrain(c, W, H, t, 0.05);
      } else if (M === 'in_x_walk') {
        // 산책 기록: 사진 위 점선 동선과 방문 순서 핀, 현재 지점 옆에 나타나는 담백한 자막
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.035 + lp * 0.025, 0.7);
        const shade = c.createLinearGradient(0, 0, W, H * 0.65);
        shade.addColorStop(0, 'rgba(23,29,20,0.66)');
        shade.addColorStop(0.55, 'rgba(23,29,20,0.5)');
        shade.addColorStop(1, 'rgba(23,29,20,0.25)');
        c.fillStyle = shade; c.fillRect(0, 0, W, H);
        inLabel(c, '천천히 걷는 하루', W * 0.08, H * 0.065, '#f8f3e7', 'left', W * 0.03);
        inLabel(c, inDateLabel().split(' ')[0], W * 0.08, H * 0.1, '#cbd0b8', 'left', W * 0.023);
        const points = [[W * 0.15, H * 0.25], [W * 0.3, H * 0.41], [W * 0.18, H * 0.61]];
        c.fillStyle = 'rgba(238,235,213,0.55)';
        for (let segment = 0; segment < 2; segment++) {
          const a = points[segment], b = points[segment + 1];
          for (let j = 1; j < 15; j++) {
            const p = j / 15;
            c.beginPath(); c.arc(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, W * 0.0025, 0, Math.PI * 2); c.fill();
          }
        }
        points.forEach(([x, y], i) => {
          c.fillStyle = '#d8dbc8';
          c.beginPath(); c.arc(x, y, W * 0.013, 0, Math.PI * 2); c.fill();
          if (i < 2) inLabel(c, i === 0 ? '발길 따라' : '잠시 머물러', x + W * 0.04, y, '#f8f3e7', 'left', W * 0.025);
        });
        const [pinX, pinY] = points[2];
        c.save(); c.globalAlpha = ent;
        c.fillStyle = '#f8f3e7';
        c.beginPath(); c.arc(pinX, pinY - W * 0.035, W * 0.033, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(pinX - W * 0.024, pinY - W * 0.015);
        c.lineTo(pinX, pinY + W * 0.025); c.lineTo(pinX + W * 0.024, pinY - W * 0.015); c.closePath(); c.fill();
        c.fillStyle = '#687456'; c.beginPath(); c.arc(pinX, pinY - W * 0.035, W * 0.011, 0, Math.PI * 2); c.fill();
        c.restore();
        inLabel(c, `${cutIdx + 1}번째 기록`, W * 0.28, H * 0.61, '#cbd0b8', 'left', W * 0.024);
        mCaption(c, caption, W * 0.28, H * 0.645, W * 0.63, H * 0.21, W * 0.053, 'pretL', '#f8f3e7', e, 'left');
        inGrain(c, W, H, t, 0.06);
      } else if (M === 'in_x_window') {
        // 창가의 오후: 사진 위 반투명 창빛이 느리게 이동하고 가운데 얇은 명조가 스며듦
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.02 + lp * 0.018, 0.6);
        c.fillStyle = 'rgba(246,235,214,0.22)'; c.fillRect(0, 0, W, H);
        c.save();
        c.translate(Math.sin(t * 0.18) * W * 0.035, 0);
        c.transform(1, 0, -0.26, 1, W * 0.18, 0);
        for (let i = 0; i < 3; i++) {
          const x = W * (-0.2 + i * 0.46), beam = c.createLinearGradient(x, 0, x + W * 0.3, 0);
          beam.addColorStop(0, 'rgba(255,247,225,0)');
          beam.addColorStop(0.25, 'rgba(255,247,225,0.28)');
          beam.addColorStop(0.75, 'rgba(255,247,225,0.28)');
          beam.addColorStop(1, 'rgba(255,247,225,0)');
          c.fillStyle = beam; c.fillRect(x, 0, W * 0.3, H);
        }
        c.restore();
        const veil = c.createLinearGradient(0, H * 0.24, 0, H * 0.78);
        veil.addColorStop(0, 'rgba(248,240,224,0)');
        veil.addColorStop(0.3, 'rgba(248,240,224,0.88)');
        veil.addColorStop(0.7, 'rgba(248,240,224,0.88)');
        veil.addColorStop(1, 'rgba(248,240,224,0)');
        c.fillStyle = veil; c.fillRect(0, H * 0.24, W, H * 0.54);
        inLabel(c, '잠시, 이대로', W / 2, H * 0.37, '#79674f', 'center', W * 0.026);
        c.fillStyle = '#b6a389'; c.fillRect(W * 0.47, H * 0.4, W * 0.06, H * 0.001);
        mCaption(c, caption, W / 2, H * 0.425, W * 0.78, H * 0.2, W * 0.058, 'maruL', '#40372d', e);
        inGrain(c, W, H, t, 0.045);
      } else if (M === 'in_y_chat') {
        // 사진 대화: 전체 사진 위 서로 마주 보는 말풍선, 답장이 천천히 올라옴
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.035 + lp * 0.025, 0.85);
        c.fillStyle = 'rgba(32,25,18,0.18)'; c.fillRect(0, 0, W, H);
        const bx = W * 0.07, by = H * 0.49, bw = W * 0.5, bh = H * 0.065;
        c.save(); c.globalAlpha = mEase(local / 0.65);
        c.fillStyle = '#fcf5e8';
        gRoundRect(c, bx, by, bw, bh, W * 0.035); c.fill();
        c.beginPath(); c.moveTo(bx + W * 0.025, by + bh * 0.55);
        c.lineTo(bx - W * 0.018, by + bh * 0.8); c.lineTo(bx + W * 0.04, by + bh * 0.87); c.fill();
        inLabel(c, '오늘은 어떤 장면이야?', bx + W * 0.04, by + bh / 2, '#76634f', 'left', Math.round(W * 0.026));
        c.restore();
        const reply = mEase((local - 0.22) / 0.65), rx = W * 0.18;
        const ry = H * 0.59 + (1 - reply) * H * 0.014, rw = W * 0.74, rh = H * 0.245;
        c.save(); c.globalAlpha = reply; c.fillStyle = '#e6dcc0';
        gRoundRect(c, rx, ry, rw, rh, W * 0.035); c.fill();
        c.beginPath(); c.moveTo(rx + rw - W * 0.03, ry + rh * 0.7);
        c.lineTo(rx + rw + W * 0.018, ry + rh * 0.86); c.lineTo(rx + rw - W * 0.04, ry + rh * 0.86); c.fill();
        c.restore();
        mCaption(c, caption, rx + W * 0.045, ry + H * 0.02, rw - W * 0.09, rh - H * 0.04,
          Math.round(W * 0.06), 'pretM', '#3d3529', mClamp((local - 0.32) / 1.1), 'left');
        inGrain(c, W, H, t, 0.045);
      } else if (M === 'in_y_torn') {
        // 찢은 인화: 불규칙한 종이 가장자리 안에 큰 사진, 종이 전체가 살짝 떠오름
        const lift = Math.sin(t * 0.24) * H * 0.003, left = W * 0.055, right = W * 0.945;
        const top = H * 0.055 + lift, bottom = H * 0.88 + lift;
        c.save(); c.beginPath(); c.moveTo(left, top);
        for (let i = 1; i <= 24; i++) c.lineTo(left + (right - left) * i / 24, top + Math.sin(i * 2.7) * H * 0.003);
        for (let i = 1; i <= 40; i++) c.lineTo(right + Math.sin(i * 2.3) * W * 0.006, top + (bottom - top) * i / 40);
        for (let i = 1; i <= 24; i++) c.lineTo(right - (right - left) * i / 24, bottom + Math.sin(i * 3.1) * H * 0.003);
        for (let i = 1; i <= 40; i++) c.lineTo(left + Math.sin(i * 2.9) * W * 0.006, bottom - (bottom - top) * i / 40);
        c.closePath(); c.clip();
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.04 + lp * 0.02, 0.95);
        const shade = c.createLinearGradient(0, H * 0.42, 0, bottom);
        shade.addColorStop(0, 'rgba(41,28,18,0)'); shade.addColorStop(1, 'rgba(41,28,18,0.8)');
        c.fillStyle = shade; c.fillRect(0, H * 0.42, W, H * 0.5);
        inLabel(c, '손끝에 남긴 풍경', W * 0.12, H * 0.65, '#ecdbc3', 'left', Math.round(W * 0.026));
        mCaption(c, caption, W * 0.12, H * 0.68, W * 0.75, H * 0.17, Math.round(W * 0.06), 'pen', '#fff8ea', e, 'left');
        c.restore(); inGrain(c, W, H, t, 0.07);
      } else if (M === 'in_y_mosaic') {
        // 조각 현상: 여러 사진 격자가 아닌 한 사진의 열두 조각이 순서대로 스며들어 완성
        const developing = local < 1.3;
        mPhoto(c, S, developing && cutIdx > 0 ? -1 : 0, 0, 0, W, H, 1.035 + lp * 0.02);
        if (developing) {
          c.fillStyle = 'rgba(239,228,208,0.42)'; c.fillRect(0, 0, W, H);
        }
        const tw = W / 3, th = H / 4;
        for (let row = 0; developing && row < 4; row++) for (let col = 0; col < 3; col++) {
          const reveal = mEase((local - (row + col) * 0.09) / 0.85);
          const x = col * tw, y = row * th;
          c.save(); c.beginPath(); c.rect(x, y, tw, th); c.clip(); c.globalAlpha = reveal;
          mPhoto(c, S, 0, 0, 0, W, H, 1.035 + lp * 0.02);
          c.restore();
          c.save(); c.globalAlpha = (1 - reveal) * 0.65; c.fillStyle = '#f3eadb';
          c.fillRect(x, y, W * 0.003, th); c.fillRect(x, y, tw, H * 0.002); c.restore();
        }
        inWarm(c, 0, 0, W, H, 0.8);
        const shade = c.createLinearGradient(0, H * 0.52, 0, H);
        shade.addColorStop(0, 'rgba(30,24,18,0)'); shade.addColorStop(1, 'rgba(30,24,18,0.82)');
        c.fillStyle = shade; c.fillRect(0, H * 0.52, W, H * 0.48);
        inLabel(c, '조금씩 선명해지는 하루', W * 0.08, H * 0.67, '#ecdbc2', 'left', Math.round(W * 0.026));
        mCaption(c, caption, W * 0.08, H * 0.7, W * 0.84, H * 0.17,
          Math.round(W * 0.06), 'pretL', '#fff9ee', mClamp((local - 0.25) / 1.1), 'left');
        inGrain(c, W, H, t, 0.055);
      } else if (M === 'ed_vogue') {
        // 보그 에디토리얼: 풀블리드 감성 톤 + 상단 이슈 헤더 + 하단 페이드 명조 타이포
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.03 + lp * 0.04, 1);
        const topG = c.createLinearGradient(0, 0, 0, 150);
        topG.addColorStop(0, 'rgba(0,0,0,0.48)');
        topG.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = topG; c.fillRect(0, 0, W, 150);
        const botG = c.createLinearGradient(0, H * 0.5, 0, H);
        botG.addColorStop(0, 'rgba(0,0,0,0)');
        botG.addColorStop(1, 'rgba(0,0,0,0.82)');
        c.fillStyle = botG; c.fillRect(0, H * 0.5, W, H * 0.5);
        inLabel(c, `ISSUE NO. 0${cutIdx + 1} · ${inDateLabel()}`, 32, 44, 'rgba(232,213,188,0.88)');
        c.fillStyle = 'rgba(232,213,188,0.35)';
        c.fillRect(32, 62, W - 64, 1);
        c.save();
        c.globalAlpha = 0.14 * ent;
        c.fillStyle = '#ffffff';
        c.font = gFont(400, 74, KIT_FONTS.maru.f);
        c.textAlign = 'left';
        c.fillText('EDITORIAL', 24 + (1 - ent) * -30, H * 0.58);
        c.restore();
        if (isPrice) mPrice(c, W, H - 290, sp, e);
        mCaption(c, caption, 32, H - 245, W - 64, 145, 34, 'maru', '#ffffff', e, 'left');
        inSign(c, d, W - 32, H - 46, 'rgba(232,213,188,0.85)');
      } else if (M === 'ed_glasspill') {
        // 글래스 플로우: 풀블리드 + 글자 폭에 딱 맞는 컴팩트 프로스트 글래스 알약
        inPhotoFade(c, S, cutIdx, local, 0, 0, W, H, 1.05 + lp * 0.05, 1);
        const lg = c.createRadialGradient(W * 0.85, H * 0.12, 10, W * 0.85, H * 0.12, 340);
        lg.addColorStop(0, sp.accent + '44');
        lg.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = lg; c.fillRect(0, 0, W, H);
        const F = KIT_FONTS.pretM || KIT_FONTS.sans;
        const wr = mFit(c, caption, W - 120, 2, 30, 20, 'pretM');
        c.font = gFont(F.w, wr.size, F.f);
        const maxW = Math.max(...wr.lines.map((l) => c.measureText(l).width), 120);
        const pw = Math.min(W - 56, maxW + 64);
        const ph = wr.lines.length * wr.lh + 34;
        const px = (W - pw) / 2, py = H - 230 + (1 - ent) * 28;
        c.save();
        c.globalAlpha = ent;
        gRoundRect(c, px, py, pw, ph, ph / 2);
        c.fillStyle = 'rgba(14,18,28,0.58)';
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.28)';
        c.lineWidth = 1.2;
        c.stroke();
        c.fillStyle = sp.accent;
        c.beginPath(); c.arc(px + 26, py + ph / 2, 5, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        wr.lines.forEach((ln, i) => {
          c.fillText(ln, px + 44, py + 17 + wr.lh * (i + 0.5));
        });
        c.restore();
      } else if (M === 'ed_kinetic') {
        // 키네틱 포스터: 풀블리드 + 사선 빛 스윕 + 굵은 긴그림자(Long Shadow) 타이포
        mPhoto(c, S, 0, 0, 0, W, H, 1.06 + lp * 0.05);
        const g = c.createLinearGradient(0, H * 0.42, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.84)');
        c.fillStyle = g; c.fillRect(0, H * 0.42, W, H * 0.58);
        if (local < 0.55) {
          c.save();
          c.translate(-W + mEase(local / 0.55) * W * 2.4, 0);
          c.transform(1, 0, -0.35, 1, 0, 0);
          c.fillStyle = sp.accent + '44';
          c.fillRect(0, 0, 140, H);
          c.restore();
        }
        const wr = kWrap(c, caption, W - 64, 2, 54, 30, 'impact');
        const F = KIT_FONTS.impact;
        c.save();
        c.font = gFont(F.w, wr.size, F.f);
        c.textAlign = 'left';
        wr.lines.forEach((ln, i) => {
          const p = mEase((e - i * 0.12) / 0.42);
          const x = 32 + (1 - p) * -48;
          const y = H - 220 + i * wr.lh;
          c.globalAlpha = p;
          kLongShadow(c, ln, x, y, i === 0 ? '#ffffff' : sp.accent, 'rgba(0,0,0,0.62)', 12, 0.85, 1);
        });
        c.restore();
      } else if (M === 'ed_arch') {
        // 아치 갤러리: 따뜻한 스톤 배경 위 아치형 창 + 얇은 골드 라인 + 명조 서명
        const ax = 40, ay = 74, aw = W - 80, ah = 590, r = aw / 2;
        c.save();
        c.beginPath();
        c.moveTo(ax, ay + ah);
        c.lineTo(ax, ay + r);
        c.arc(ax + r, ay + r, r, Math.PI, 0, false);
        c.lineTo(ax + aw, ay + ah);
        c.closePath();
        c.save();
        c.clip();
        inPhotoFade(c, S, cutIdx, local, ax, ay, aw, ah, 1.04 + lp * 0.04, 1);
        c.restore();
        c.strokeStyle = sp.accent;
        c.lineWidth = 1.5;
        c.stroke();
        c.restore();
        inLabel(c, 'GALLERY EDITION', W / 2, 44, '#8a7968', 'center');
        mCaption(c, caption, W / 2, ay + ah + 26, W - 80, 140, 28, 'maru', '#2b2622', e, 'center');
        inSign(c, d, W - 40, H - 44, '#8a7968');
        inGrain(c, W, H, t, 0.04);
      } else if (M === 'ed_duotone') {
        // 듀오톤 포스터: 모던 모노크롬/컬러 틴트 + 코너 크롭마크 + 긴그림자 타이포
        c.save();
        c.filter = 'grayscale(1) contrast(1.18)';
        mPhoto(c, S, 0, 0, 0, W, H, 1.05 + lp * 0.04);
        c.restore();
        c.save();
        c.globalCompositeOperation = 'multiply';
        c.fillStyle = sp.accent;
        c.globalAlpha = 0.38;
        c.fillRect(0, 0, W, H);
        c.restore();
        const g = c.createLinearGradient(0, H * 0.45, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.82)');
        c.fillStyle = g; c.fillRect(0, H * 0.45, W, H * 0.55);
        c.strokeStyle = 'rgba(255,255,255,0.5)';
        c.lineWidth = 1.5;
        [[28, 36], [W - 28, 36], [28, H - 90], [W - 28, H - 90]].forEach(([mx, my]) => {
          c.beginPath(); c.moveTo(mx - 8, my); c.lineTo(mx + 8, my); c.moveTo(mx, my - 8); c.lineTo(mx, my + 8); c.stroke();
        });
        const wr = kWrap(c, caption, W - 72, 2, 46, 26, 'dohyeon');
        const F = KIT_FONTS.dohyeon;
        c.save();
        c.font = gFont(F.w, wr.size, F.f);
        c.textAlign = 'left';
        wr.lines.forEach((ln, i) => {
          const p = mEase((e - i * 0.1) / 0.4);
          c.globalAlpha = p;
          kLongShadow(c, ln, 32, H - 220 + i * wr.lh + (1 - p) * 20, i === 0 ? '#ffffff' : sp.accent2, 'rgba(0,0,0,0.58)', 10, 0.85, 1);
        });
        c.restore();
      } else if (M.startsWith('ba_')) {
        // 비포·애프터 비교 5종 공통 배지 헬퍼
        const baBadge = (bx, by, txt, bgCol, fgCol, align = 'left') => {
          c.save();
          c.font = gFont(800, 12, GENRE_FONTS.sans);
          const bw = c.measureText(txt).width + 22, bh = 28;
          const rx = align === 'right' ? bx - bw : align === 'center' ? bx - bw / 2 : bx;
          gRoundRect(c, rx, by, bw, bh, 14);
          c.fillStyle = bgCol; c.fill();
          c.fillStyle = fgCol;
          c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText(txt, rx + bw / 2, by + bh / 2 + 1);
          c.restore();
        };
        const beforeIdx = cutIdx === 0 ? 1 : -1;
        if (M === 'ba_slider') {
          const sx = Math.round(W * (0.18 + 0.68 * mEase(local / 1.35)));
          c.save();
          c.filter = 'saturate(0.72) contrast(0.95)';
          mPhoto(c, S, beforeIdx, 0, 0, W, H, 1.05 + lp * 0.03);
          c.restore();
          c.save();
          c.beginPath(); c.rect(sx, 0, W - sx, H); c.clip();
          mPhoto(c, S, 0, 0, 0, W, H, 1.05 + lp * 0.03);
          c.restore();
          c.save();
          c.shadowColor = sp.accent; c.shadowBlur = 16;
          c.fillStyle = '#ffffff';
          c.fillRect(sx - 1.5, 0, 3, H);
          c.beginPath(); c.arc(sx, H * 0.44, 18, 0, Math.PI * 2); c.fill();
          c.shadowBlur = 0;
          c.fillStyle = '#111111';
          c.font = gFont(800, 11, GENRE_FONTS.sans);
          c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText('◀▶', sx, H * 0.44 + 1);
          c.restore();
          baBadge(22, 42, 'BEFORE', 'rgba(15,23,42,0.72)', '#e2e8f0', 'left');
          baBadge(W - 22, 42, 'AFTER', sp.accent, kTextOn(sp.accent), 'right');
          const g = c.createLinearGradient(0, H * 0.55, 0, H);
          g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.84)');
          c.fillStyle = g; c.fillRect(0, H * 0.55, W, H * 0.45);
          mCaption(c, caption, W / 2, H - 235, W - 64, 130, 36, sp.font, '#ffffff', e);
        } else if (M === 'ba_diagonal') {
          const p = mEase(local / 1.05);
          c.save();
          c.filter = 'saturate(0.7)';
          mPhoto(c, S, beforeIdx, 0, 0, W, H, 1.05);
          c.restore();
          const cutY = H * (1.25 - p * 1.35);
          c.save();
          c.beginPath();
          c.moveTo(0, cutY + 240); c.lineTo(W, cutY - 120);
          c.lineTo(W, H + 200); c.lineTo(0, H + 200); c.closePath();
          c.clip();
          mPhoto(c, S, 0, 0, 0, W, H, 1.05 + lp * 0.04);
          c.restore();
          c.save();
          c.strokeStyle = sp.accent; c.lineWidth = 5;
          c.shadowColor = sp.accent; c.shadowBlur = 18;
          c.beginPath(); c.moveTo(0, cutY + 240); c.lineTo(W, cutY - 120); c.stroke();
          c.restore();
          baBadge(22, 42, 'BEFORE', 'rgba(0,0,0,0.68)', '#cbd5e1', 'left');
          baBadge(W - 22, 42, 'AFTER', sp.accent, kTextOn(sp.accent), 'right');
          const g = c.createLinearGradient(0, H * 0.55, 0, H);
          g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.85)');
          c.fillStyle = g; c.fillRect(0, H * 0.55, W, H * 0.45);
          mCaption(c, caption, 30, H - 235, W - 60, 135, 38, sp.font, '#ffffff', e, 'left');
        } else if (M === 'ba_collage') {
          const cw = (W - 60) / 2, ch = 480, py = 100;
          const slide = mEase(local / 0.55);
          [[22, beforeIdx, 'BEFORE', 'rgba(15,23,42,0.82)', '#e2e8f0', (1 - slide) * -28], [22 + cw + 16, 0, 'AFTER', sp.accent, kTextOn(sp.accent), (1 - slide) * 28]].forEach(([cx, idx, lbl, bgc, fgc, dx]) => {
            c.save();
            c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
            gRoundRect(c, cx + dx, py, cw, ch, 20);
            c.fillStyle = '#18181b'; c.fill();
            c.restore();
            c.save();
            gRoundRect(c, cx + dx, py, cw, ch, 20); c.clip();
            mPhoto(c, S, idx, cx + dx, py, cw, ch, 1.04 + lp * 0.04);
            c.restore();
            baBadge(cx + dx + 12, py + 14, lbl, bgc, fgc, 'left');
          });
          c.save();
          c.fillStyle = sp.accent;
          c.beginPath(); c.arc(W / 2, py + ch / 2, 18, 0, Math.PI * 2); c.fill();
          c.fillStyle = kTextOn(sp.accent);
          c.font = gFont(800, 16, GENRE_FONTS.sans);
          c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText('→', W / 2, py + ch / 2 + 1);
          c.restore();
          mCaption(c, caption, W / 2, py + ch + 28, W - 60, 160, 34, sp.font, '#ffffff', e);
        } else if (M === 'ba_flash') {
          const afterOn = local >= 0.72;
          if (!afterOn) {
            c.save(); c.filter = 'saturate(0.75)';
            mPhoto(c, S, beforeIdx, 0, 0, W, H, 1.04);
            c.restore();
            baBadge(W / 2, 56, 'BEFORE', 'rgba(15,23,42,0.78)', '#ffffff', 'center');
          } else {
            mPhoto(c, S, 0, 0, 0, W, H, 1.05 + lp * 0.05);
            if (local < 0.92) {
              c.fillStyle = `rgba(255,255,255,${0.7 * (1 - (local - 0.72) / 0.2)})`;
              c.fillRect(0, 0, W, H);
            }
            baBadge(W / 2, 56, 'AFTER ✨', sp.accent, kTextOn(sp.accent), 'center');
          }
          const g = c.createLinearGradient(0, H * 0.55, 0, H);
          g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.84)');
          c.fillStyle = g; c.fillRect(0, H * 0.55, W, H * 0.45);
          mCaption(c, caption, W / 2, H - 235, W - 64, 135, 38, sp.font, '#ffffff', e);
        } else if (M === 'ba_polaroid') {
          const snap = (cx, cy, rot, idx, lbl, bgc, fgc, sc) => {
            c.save();
            c.translate(cx, cy); c.rotate(rot); c.scale(sc, sc);
            c.shadowColor = 'rgba(0,0,0,0.22)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
            c.fillStyle = '#fffdf9';
            gRoundRect(c, -135, -165, 270, 330, 12); c.fill();
            c.shadowBlur = 0;
            c.save();
            gRoundRect(c, -121, -151, 242, 242, 8); c.clip();
            mPhoto(c, S, idx, -121, -151, 242, 242, 1.04 + lp * 0.03);
            c.restore();
            baBadge(0, 114, lbl, bgc, fgc, 'center');
            c.restore();
          };
          snap(W * 0.34, 290, -0.07, beforeIdx, 'BEFORE', '#e5e7eb', '#374151', 0.94);
          snap(W * 0.66, 360, 0.05, 0, 'AFTER', sp.accent, kTextOn(sp.accent), 0.94 + 0.08 * ent);
          mCaption(c, caption, W / 2, 585, W - 70, 170, 32, sp.font, '#2b2622', e);
        }
      } else if (M === 'cinema') {
        // 시네마틱: 위아래 검은 띠 + 가장자리 비네트, 컷은 부드럽게 겹쳐 바뀜 (캡컷 "영화 화면"·"비네트")
        const fade = cutIdx > 0 ? mEase(local / 0.45) : 1;
        if (fade < 1) mPhoto(c, S, -1, 0, 0, W, H, 1.06);
        c.save();
        c.globalAlpha = fade;
        mPhoto(c, S, 0, 0, 0, W, H, 1.0 + lp * 0.03);
        c.restore();
        const vs = 0.45 + 0.25 * mEase(local / 0.55);
        const vg = c.createRadialGradient(W / 2, H * 0.45, W * 0.25, W / 2, H * 0.45, H * 0.62);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, `rgba(15,12,10,${vs})`);
        c.fillStyle = vg;
        c.fillRect(0, 0, W, H);
        const band = Math.round(H * 0.14);
        const barH = Math.round(band * mEase((t - 0.1) / 0.55));
        c.fillStyle = '#000';
        c.fillRect(0, 0, W, barH);
        c.fillRect(0, H - barH, W, barH);
        if (barH > 20) {
          // 위 띠: 상품명(왼쪽) · 담당자(오른쪽)
          c.save();
          c.globalAlpha = mEase((t - 0.5) / 0.6);
          c.textBaseline = 'middle';
          c.fillStyle = sp.accent;
          c.textAlign = 'left';
          gDrawLine(c, String(campaign.vehicle || (typeof IND !== 'undefined' && IND.product) || ''), 26, barH * 0.55, W * 0.55, 16, 11, GENRE_FONTS.sans, 700);
          c.fillStyle = 'rgba(255,255,255,0.78)';
          c.textAlign = 'right';
          gDrawLine(c, d ? `${d.name || ''} ${d.title || ''}`.trim() : '', W - 26, barH * 0.55, W * 0.38, 15, 11, GENRE_FONTS.sans, 500);
          c.restore();
        }
        if (isPrice) mPrice(c, W, H - band - 52, sp, e);
        // 아래 띠 안의 영화 자막
        mCaption(c, caption, W / 2, H - band + 6, W - 60, band - 12, 30, sp.font, sp.accent2, e);
      } else if (M === 'credits') {
        // 옆 크레딧 롤: 사진은 왼쪽으로 살짝 밀리고, 오른쪽 어두운 면에 상품·매장 정보가 영화 엔딩처럼 올라감
        const fade = cutIdx > 0 ? mEase(local / 0.4) : 1;
        const pan = -W * 0.08 * mEase(t / 0.6);
        if (fade < 1) mPhoto(c, S, -1, 0, 0, W, H, 1.06, pan);
        c.save();
        c.globalAlpha = fade;
        mPhoto(c, S, 0, 0, 0, W, H, 1.06 + lp * 0.03, pan);
        c.restore();
        const sg = c.createLinearGradient(W * 0.3, 0, W * 0.64, 0);
        sg.addColorStop(0, 'rgba(10,10,12,0)');
        sg.addColorStop(1, 'rgba(10,10,12,0.94)');
        c.fillStyle = sg;
        c.fillRect(0, 0, W, H);
        const bb = c.createLinearGradient(0, H * 0.55, 0, H);
        bb.addColorStop(0, 'rgba(10,10,12,0)');
        bb.addColorStop(1, 'rgba(10,10,12,0.88)');
        c.fillStyle = bb;
        c.fillRect(0, H * 0.55, W, H * 0.45);
        const zx = W * 0.56, zw = W * 0.4, zTop = 36, zBot = capY - 16, zH = zBot - zTop;
        // 항목마다 값은 최대 2줄(18px → 최소 14px)로 나눠 높이를 계산
        const blocks = mCreditItems(d).map(([label, value]) => {
          const r = gWrap(c, value, zw, 2, 18, 14, GENRE_FONTS.sans, 800);
          return { label, lines: r.lines, size: r.size, h: 22 + r.lines.length * Math.round(r.size * 1.3) + 16 };
        });
        const total = blocks.reduce((s, b) => s + b.h, 0) + zH;
        const off = (t * (total / Math.max(4, mainDuration))) % total;
        c.save();
        c.beginPath();
        c.rect(zx - 6, zTop, zw + 12, zH);
        c.clip();
        c.globalAlpha = mEase((t - 0.3) / 0.6);
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        let by = zBot - off;
        blocks.forEach((b) => {
          if (by + b.h > zTop - 10 && by < zBot + 10) {
            c.fillStyle = sp.accent;
            gDrawLine(c, b.label, zx, by + 10, zw, 13, 11, GENRE_FONTS.sans, 700);
            c.fillStyle = '#ffffff';
            c.font = gFont(800, b.size, GENRE_FONTS.sans);
            const lh = Math.round(b.size * 1.3);
            b.lines.forEach((ln, i) => c.fillText(ln, zx, by + 22 + lh / 2 + i * lh));
          }
          by += b.h;
        });
        c.restore();
        // 크레딧 위아래 가장자리를 어둡게 녹임
        [[zTop, 0], [zBot - 40, 1]].forEach(([y, dir]) => {
          const fg2 = c.createLinearGradient(0, y, 0, y + 40);
          fg2.addColorStop(dir ? 0 : 1, 'rgba(10,10,12,0)');
          fg2.addColorStop(dir ? 1 : 0, 'rgba(10,10,12,0.9)');
          c.fillStyle = fg2;
          c.fillRect(zx - 6, y, zw + 12, 40);
        });
        if (isPrice) mPrice(c, W, capY, sp, e);
        mCaption(c, caption, 30, capY + (isPrice ? 40 : 4), W - 60, capH - (isPrice ? 40 : 4), 38, sp.font, '#ffffff', e, 'left');
      } else {
        // strips: 세로 세 줄 사진이 서로 다른 속도로 움직임
        const gap = 8, sw = (W - gap * 4) / 3;
        for (let i = 0; i < 3; i++) {
          const x = gap + i * (sw + gap);
          const dir = i % 2 ? -1 : 1;
          const off = (1 - ent) * dir * 120 + Math.sin(t * 0.8 + i) * 10;
          c.save();
          gRoundRect(c, x, gap + off, sw, stageH - gap, 14);
          c.clip();
          mPhoto(c, S, 0, 0, gap + off, W, stageH, 1.12 + lp * 0.05, 0, dir * lp * 20);
          c.restore();
        }
        c.fillStyle = sp.accent;
        c.fillRect(gap, stageH + 6, (W - gap * 2) * lp, 4);
        if (isPrice) mPrice(c, W, capY + 6, sp, e);
        mCaption(c, caption, W / 2, capY + (isPrice ? 44 : 8), W - 60, capH - (isPrice ? 44 : 8), 40, sp.font, sp.accent2, e);
      }
      // 시네마는 위 띠에, 크레딧은 크레딧 안에 이름이 나오므로 아래 이름 칩을 그리지 않음
      if (M !== 'story' && M !== 'feed' && M !== 'cinema' && M !== 'credits' && !sp.insta) mChip(c, d, W, H, sp, mEase(t / 0.6));
    }

    // 인스타 감성 엔딩: 크림 카드에 작은 사진, 명조 가게 이름, 얇은 선, 주소·연락처, 담백한 댓글 안내
    function renderInstaOutro(c, W, H, t, mainDuration, d, sp) {
      const lt = t - mainDuration;
      c.fillStyle = '#f3ece1';
      c.fillRect(0, 0, W, H);
      const S = kitScene(t, mainDuration, true);
      const a = (k) => mEase((lt - k) / 0.6);
      c.save();
      c.globalAlpha = a(0);
      const pw = 220, ph = 270, px = (W - pw) / 2, py = 110;
      c.shadowColor = 'rgba(60,40,20,0.16)'; c.shadowBlur = 14; c.shadowOffsetY = 4;
      c.fillStyle = '#fffdf9';
      c.fillRect(px - 10, py - 10, pw + 20, ph + 20);
      c.shadowColor = 'transparent';
      mPhoto(c, S, 0, px, py, pw, ph, 1.04);
      inWarm(c, px, py, pw, ph, 0.9);
      c.restore();
      const ny = py + ph + 76;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.globalAlpha = a(0.2);
      c.fillStyle = '#2b2622';
      gDrawLine(c, (d && d.name) || '', W / 2, ny, W - 80, 40, 24, KIT_FONTS.maru.f, 600);
      c.fillStyle = '#cbbfae';
      c.fillRect(W / 2 - 20, ny + 36, 40, 1);
      c.globalAlpha = a(0.35);
      c.fillStyle = '#7a6d61';
      const sub = [(d && d.title) || '', (d && d.branch) || ''].filter(Boolean).join(' · ');
      if (sub) gDrawLine(c, sub, W / 2, ny + 68, W - 90, 17, 12, KIT_FONTS.pretL.f, 500);
      const phone = String((d && d.phone) || '').trim();
      if (phone) gDrawLine(c, phone, W / 2, ny + 98, W - 90, 18, 12, KIT_FONTS.pretL.f, 500);
      const promo = String((d && d.promoTag) || '').trim();
      if (promo) { c.fillStyle = '#8a6a4f'; gDrawLine(c, promo, W / 2, ny + 132, W - 90, 17, 12, KIT_FONTS.maruL.f, 400); }
      c.globalAlpha = a(0.55);
      c.fillStyle = '#2b2622';
      gDrawLine(c, arCta(), W / 2, H - 120, W - 100, 19, 13, KIT_FONTS.pretL.f, 600);
      c.fillStyle = '#2b2622';
      c.fillRect(W / 2 - 60, H - 104, 120, 1);
      c.globalAlpha = 1;
      inGrain(c, W, H, t, 0.07);
    }
