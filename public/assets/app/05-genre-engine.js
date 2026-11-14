// AutoReels — 05-genre-engine.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // HyperFrames 핵심: window.__timelines 결정론적 타임라인 등록
    // ============================================================================
    window.__timelines = window.__timelines || {};
    window.__timelines['main'] = {
      currentTime: 0,
      duration: TOTAL_DURATION,
      paused: true,
      seek(timeInSeconds) {
        this.duration = TOTAL_DURATION;
        this.currentTime = Easing.clamp(Number(timeInSeconds), 0, this.duration);
        // 화면은 가상 시간(컷 길이 균등)으로 그리고, 소리·표시는 실제 시간을 씀
        window.__realTimelineT = this.currentTime;
        // 명함 화면이 없으면 끝 프레임에서도 명함을 그리지 않음
        const drawT = OUTRO_DURATION <= 0 ? Math.min(this.currentTime, getMainDuration() - 0.001) : this.currentTime;
        renderHyperFramesComposition(toVirtualTime(drawT));
        updateTimelineUI(this.currentTime);
        if (isPlaying && AudioEngine.enabled) {
          AudioEngine.syncWithTimeline(this.currentTime);
        }
        return this;
      }
    };

    function updateTimelineUI(t) {
      const mainDuration = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const totalCuts = getTargetCutCount();
      const cutDuration = mainDuration / totalCuts;
      const slider = document.getElementById('timelineSlider');
      if (slider && document.activeElement !== slider) {
        slider.max = String(TOTAL_DURATION);
        slider.value = t.toFixed(3);
      }
      const timeCode = document.getElementById('timeCodeText');
      if (timeCode) {
        timeCode.textContent = `${t.toFixed(1)}초 / ${Number(TOTAL_DURATION.toFixed(1))}초`;
      }
      const frameCount = document.getElementById('frameCountText');
      if (frameCount) {
        frameCount.textContent = `Frame: ${Math.floor(t * FPS)} / ${Math.round(TOTAL_DURATION * FPS)}`;
      }

      const badge = document.getElementById('activeClipBadge');
      if (badge) {
        if (t < mainDuration) {
          const curSlot = Math.min(totalCuts, getCutIndexAt(t) + 1);
          badge.textContent = `본편 CUT ${curSlot}/${totalCuts} (${t.toFixed(1)}s / ${mainDuration.toFixed(0)}s)`;
        } else {
          badge.textContent = (typeof IND !== 'undefined' && IND.outroMode === 'store')
            ? `엔딩 ${IND.place || '매장'} 안내 (${mainDuration.toFixed(0)}~${TOTAL_DURATION.toFixed(0)}초)`
            : `엔딩 카마스터 명함 (${mainDuration.toFixed(0)}~${TOTAL_DURATION.toFixed(0)}초)`;
        }
      }
    }

    // ============================================================================
    // HyperFrames 캔버스 렌더러 (3D 쇼룸 + 키네틱 모션 + 3D 메탈 카마스터 명함)
    // ============================================================================
    const canvas = document.getElementById('reelCanvas');
    const ctx = canvas.getContext('2d');

    function drawRoundedRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // 카마스터 고유 토큰으로 결정론적 QR 코드 패턴 그리기
    function drawDeterministicQrCode(ctx, x, y, size, seedStr) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, x, y, size, size, 10);
      ctx.fill();

      const cells = 11;
      const pad = 8;
      const cellSize = (size - pad * 2) / cells;
      ctx.fillStyle = '#0f172a';

      for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
          const isCorner =
            (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3);
          const charCode = seedStr.charCodeAt((r * cells + c) % seedStr.length) || 7;
          const active = isCorner || (charCode + r * 3 + c * 5) % 3 === 0;
          if (active) {
            ctx.fillRect(x + pad + c * cellSize, y + pad + r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }
      ctx.restore();
    }

    // 3D 원근 그리드 바닥 & 천장 스포트라이트 쇼룸 렌더링
    function draw3DShowroomEnvironment(ctx, W, H, t, neonColor) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, campaign.bgGradient[0]);
      grad.addColorStop(0.6, campaign.bgGradient[1]);
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 천장 스튜디오 볼류메트릭 스포트라이트 2개
      ctx.save();
      const sway = Math.sin(t * 1.8) * 35;
      const beamGrad = ctx.createRadialGradient(W / 2 + sway, 80, 10, W / 2, 420, 380);
      beamGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
      beamGrad.addColorStop(0.5, 'rgba(56,189,248,0.08)');
      beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // 3D 퍼스펙티브 쇼룸 바닥 반사 그리드
      ctx.save();
      const horizonY = 470;
      ctx.strokeStyle = neonColor;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1.5;

      // 방사형 원근 선
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 25, horizonY);
        ctx.lineTo(W / 2 + i * 145, H);
        ctx.stroke();
      }
      // 전진하는 수평 그리드 선 (카메라 돌리 인 효과)
      const speedOffset = (t * 0.65) % 1;
      for (let j = 0; j < 7; j++) {
        const p = Math.pow((j + speedOffset) / 7, 1.8);
        const y = horizonY + p * (H - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 성우 음성이 안 될 때 쓰는 브라우저 기본 음성에도 서버와 같은 숫자 읽기 보정 (3대 → 세 대, '+' 생략)
    window.__koSpeech = (function () {
      const ONES = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
      const TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

      // 고유어 수사로 세는 단위 (긴 것부터 검사)
      const COUNTERS = ['번째', '시간', '군데', '가지', '마리', '켤레', '대', '개', '명', '살', '장', '잔', '병', '곳', '컷', '분'];

      function toNativeKorean(n) {
        if (n < 1 || n > 99) return null;
        if (n === 20) return '스무';
        return TENS[Math.floor(n / 10)] + ONES[n % 10];
      }

      // "30대 여성"처럼 나이대를 뜻하는 경우 뒤에 오는 말
      const AGE_FOLLOWERS = /^\s?(여성|남성|여자|남자|직장인|고객|부부|주부|아빠|엄마|가장|초반|중반|후반|분들|사회초년생|이상|이하|부터|까지|에게|들이|들에게|인데|라면|도|가 |이 |의 )/;

      // "취등록세 0원+보증금 0원"의 '+'는 '플러스'로 읽지 않고 짧게 쉬도록 쉼표로 바꿈 (1+1 같은 숫자 사이는 그대로)
      function softenSymbols(text) {
        return String(text).replace(/\s*\+\s*/g, (m, offset, whole) => {
          const prev = whole.slice(0, offset).trim().slice(-1);
          const next = whole.slice(offset + m.length).trim().charAt(0);
          if (/[0-9]/.test(prev) && /[0-9]/.test(next)) return m;
          return prev ? ', ' : '';
        });
      }

      function normalizeKoreanNumbers(text) {
        text = softenSymbols(text);
        const pattern = new RegExp(`(^|[^0-9.,])([0-9]{1,2})\\s?(${COUNTERS.join('|')})`, 'g');
        return String(text).replace(pattern, (match, before, digits, counter, offset, whole) => {
          const n = Number(digits);
          const after = whole.slice(offset + match.length);

          if (counter === '개' && /^(월|년)/.test(after)) return match; // 3개월, 2개년은 "삼 개월"
          if (counter === '분' && !/^(께|들|이서|을 모시|의 고객)/.test(after)) return match; // 5분(시간)은 "오 분"
          if (counter === '대' && n % 10 === 0 && AGE_FOLLOWERS.test(after)) return match; // 30대 여성은 "삼십대"
          if (counter === '대' && /^(리점|표|한민국|형|박|출|기업|수)/.test(after)) return match; // 대리점, 대표 등 다른 낱말
          if (counter === '장' && /^(기|점|착|거리)/.test(after)) return match; // 장기렌트 등
          if (counter === '명' && /^(함|의|품|절)/.test(after)) return match; // 명함 등
          if (counter === '병' && /^(원)/.test(after)) return match;

          let word = toNativeKorean(n);
          if (!word) return match;
          if (counter === '번째' && n === 1) word = '첫';
          return `${before}${word} ${counter}`;
        });
      }
      return normalizeKoreanNumbers;
    })();

    // ==========================================================================
    // ★ 장르 엔진 v2 — 6개 장르(특가·럭셔리·EV·스포츠·금융·신뢰)를 색보정·글꼴·배치·명함까지
    //   완전히 다르게 그리고, 22개 구성은 장르 안의 변형(포인트 색 + 시그니처 요소)으로 표현합니다.
    //   화면당 문구는 컷 자막 1줄(최대 2줄) + 핵심 숫자 1개로 줄여 휴대폰에서 읽히게 합니다.
    // ==========================================================================
    const USE_GENRE_ENGINE = true;

    const GENRE_FONTS = {
      impact: '"Black Han Sans", "Pretendard Variable", sans-serif',
      serif: '"MaruBuri", "Gowun Batang", "Noto Serif KR", serif', // 인스타 감성: 굵은 Noto Serif 대신 마루부리
      sans: '"Pretendard Variable", Pretendard, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace'
    };

    // 구성(layoutMode) → 장르 + 변형
    const GENRE_VARIANTS = {
      BROADCAST_NEWS: { genre: 'sale', accent: '#ef4444', accent2: '#facc15', label: 'LIVE 긴급속보', sig: 'ticker' },
      DDAY_COUNTDOWN: { genre: 'sale', accent: '#f97316', accent2: '#fde047', label: '마감 임박', sig: 'countdown' },
      CANCEL_STOCK: { genre: 'sale', accent: '#dc2626', accent2: '#fca5a5', label: '취소차 긴급배정', sig: 'stamp' },
      FLASH_DEAL: { genre: 'sale', accent: '#a855f7', accent2: '#fde047', label: '주말 번개특가', sig: 'bolt' },
      SECRET_DOSSIER: { genre: 'sale', accent: '#b45309', accent2: '#fef3c7', label: '대외비 특판', sig: 'dossier' },

      EDITORIAL_VOGUE: { genre: 'luxury', accent: '#e7d8b5', accent2: '#ffffff', label: 'THE EDITORIAL', sig: 'masthead', grade: 'mono' },
      VVIP_CONCIERGE: { genre: 'luxury', accent: '#d4af37', accent2: '#f5e6b8', label: 'VVIP CONCIERGE', sig: 'crest', grade: 'warm' },
      MONACO_MARINE: { genre: 'luxury', accent: '#cfe3f5', accent2: '#ffffff', label: 'MARINE CLUB', sig: 'wave', grade: 'cool' },
      BLACK_OBSIDIAN: { genre: 'luxury', accent: '#c0c4cc', accent2: '#ffffff', label: 'OBSIDIAN', sig: 'facet', grade: 'noir' },
      CANNES_FILM: { genre: 'luxury', accent: '#f2c46d', accent2: '#ffffff', label: 'CINÉMA', sig: 'film', grade: 'film' },

      CYBER_HUD: { genre: 'ev', accent: '#22d3ee', accent2: '#a5f3fc', label: 'EV SYSTEM', sig: 'grid' },
      TECH_ECO_V2L: { genre: 'ev', accent: '#4ade80', accent2: '#bbf7d0', label: 'ECO · V2L', sig: 'plug' },
      AUTONOMOUS_LIDAR: { genre: 'ev', accent: '#38bdf8', accent2: '#e0f2fe', label: 'AUTOPILOT', sig: 'radar' },
      BATTERY_TELEMETRY: { genre: 'ev', accent: '#2dd4bf', accent2: '#ccfbf1', label: 'BATTERY SOH', sig: 'gauge' },

      RACING_ACTION: { genre: 'sports', accent: '#ef4444', accent2: '#ffffff', label: 'RACE MODE', sig: 'checker' },
      EXHAUST_POP: { genre: 'sports', accent: '#fb923c', accent2: '#fde68a', label: 'EXHAUST', sig: 'flame' },
      LAUNCH_CONTROL: { genre: 'sports', accent: '#facc15', accent2: '#ffffff', label: 'LAUNCH', sig: 'timer' },

      TIKTOK_VIRAL_SPLIT: { genre: 'finance', accent: '#6366f1', accent2: '#e0e7ff', label: '1:1 견적상담', sig: 'split' },
      TAX_CALCULATOR: { genre: 'finance', accent: '#0ea5e9', accent2: '#e0f2fe', label: '사업자 절세 견적', sig: 'receipt' },

      CLASSIC_SHOWROOM: { genre: 'trust', accent: '#1d4ed8', accent2: '#dbeafe', label: '인증 카마스터', sig: 'seal' },
      FAMILY_SAFETY: { genre: 'trust', accent: '#ea580c', accent2: '#ffedd5', label: '패밀리 안심', sig: 'heart' },
      BLUEHANDS_INSPECT: { genre: 'trust', accent: '#0284c7', accent2: '#e0f2fe', label: '120항목 정밀검수', sig: 'checklist' }
    };

    function getGenreVariant(mode) {
      return GENRE_VARIANTS[mode] || GENRE_VARIANTS.CLASSIC_SHOWROOM;
    }

    // 웹폰트를 미리 불러와 첫 화면·추출 영상에서 기본 글꼴로 나오지 않게 함
    (function preloadGenreFonts() {
      if (!document.fonts || !document.fonts.load) return;
      const specs = ['400 40px "Black Han Sans"', '700 40px "Noto Serif KR"', '900 40px "Noto Serif KR"', '500 20px "JetBrains Mono"', '400 40px "Do Hyeon"', '400 40px "Jua"', '400 40px "Nanum Pen Script"', '400 40px "Gugi"'];
      Promise.all(specs.map((s) => document.fonts.load(s, '가A1').catch(() => null))).then(() => {
        window.__genreFontsReady = true;
        try {
          if (typeof renderDesignStylePicker === 'function') renderDesignStylePicker();
        } catch (e) {}
        try {
          if (window.__timelines && window.__timelines.main) window.__timelines.main.seek(window.__timelines.main.currentTime);
        } catch (e) {}
      });
    })();

    // ---------- 그리기 도우미 ----------
    function gEase(x) {
      const c = Math.min(1, Math.max(0, x));
      return 1 - Math.pow(1 - c, 3);
    }
    function gBack(x) {
      const c = Math.min(1, Math.max(0, x));
      const s = 1.6;
      return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2);
    }
    function gRoundRect(c, x, y, w, h, r) {
      const rr = Math.max(0, Math.min(r, w / 2, h / 2));
      c.beginPath();
      c.moveTo(x + rr, y);
      c.arcTo(x + w, y, x + w, y + h, rr);
      c.arcTo(x + w, y + h, x, y + h, rr);
      c.arcTo(x, y + h, x, y, rr);
      c.arcTo(x, y, x + w, y, rr);
      c.closePath();
    }
    function gFont(weight, size, family) {
      return `${weight} ${size}px ${family}`;
    }
    // 앞쪽 이모지·기호 제거 (굵은 제목 글꼴에서 이모지가 어색하게 섞이지 않도록)
    function gCleanCaption(s) {
      return String(s || '')
        .replace(/^[\s -⯿\u{1F000}-\u{1FFFF}️‍✔✓★☆•·\-\[\]【】]+/u, '')
        .replace(/[\u{1F000}-\u{1FFFF}️‍]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
    // 한 줄 맞춤: 넘치면 글자를 줄이고, 그래도 넘치면 말줄임
    function gFitLine(c, text, maxW, size, minSize, family, weight) {
      let s = size;
      c.font = gFont(weight, s, family);
      while (c.measureText(text).width > maxW && s > minSize) {
        s -= 1;
        c.font = gFont(weight, s, family);
      }
      let out = text;
      if (c.measureText(out).width > maxW) {
        while (out.length > 1 && c.measureText(out + '…').width > maxW) out = out.slice(0, -1);
        out += '…';
      }
      return { text: out, size: s };
    }
    function gDrawLine(c, text, x, y, maxW, size, minSize, family, weight) {
      const f = gFitLine(c, text, maxW, size, minSize, family, weight);
      c.fillText(f.text, x, y);
      return f.size;
    }
    // 여러 줄 줄바꿈: 단어 단위, 긴 단어는 글자 단위. 최대 줄 수를 넘으면 글자 크기를 줄임
    function gWrap(c, text, maxW, maxLines, size, minSize, family, weight) {
      const words = String(text || '').split(' ');
      for (let s = size; s >= minSize; s -= 1) {
        c.font = gFont(weight, s, family);
        const lines = [];
        let cur = '';
        let overflow = false;
        for (const w of words) {
          const trial = cur ? cur + ' ' + w : w;
          if (c.measureText(trial).width <= maxW) {
            cur = trial;
            continue;
          }
          if (cur) lines.push(cur);
          if (c.measureText(w).width <= maxW) {
            cur = w;
          } else {
            let piece = '';
            for (const ch of w) {
              if (c.measureText(piece + ch).width > maxW) {
                lines.push(piece);
                piece = ch;
              } else piece += ch;
            }
            cur = piece;
          }
          if (lines.length > maxLines) {
            overflow = true;
            break;
          }
        }
        if (cur) lines.push(cur);
        if (!overflow && lines.length <= maxLines) return { lines, size: s };
      }
      // 가장 작은 글자로도 넘치면: 최대 줄 수까지만 쓰고 마지막 줄 끝에 말줄임표
      c.font = gFont(weight, minSize, family);
      const lines = [];
      let cur = '';
      for (const ch of String(text || '')) {
        if (c.measureText(cur + ch).width > maxW) {
          lines.push(cur);
          cur = ch.trim() ? ch : '';
          if (lines.length === maxLines) break;
        } else cur += ch;
      }
      if (lines.length < maxLines && cur) lines.push(cur);
      const last = lines.length - 1;
      if (last >= 0) {
        let tail = lines[last];
        while (tail.length > 1 && c.measureText(tail + '…').width > maxW) tail = tail.slice(0, -1);
        lines[last] = tail + '…';
      }
      return { lines, size: minSize };
    }
    function gDrawCover(c, img, W, H, scale, panX, panY, alpha) {
      if (!img) return;
      if (img._isVideo && img.readyState < 2) return;
      const sw = img.videoWidth || img.naturalWidth || img.width || W;
      const sh = img.videoHeight || img.naturalHeight || img.height || H;
      if (!sw || !sh) return;
      const r = Math.max(W / sw, H / sh) * scale;
      c.save();
      c.globalAlpha = alpha;
      c.drawImage(img, (W - sw * r) / 2 + panX, (H - sh * r) / 2 + panY, sw * r, sh * r);
      c.restore();
    }
    function gHash(str) {
      let h = 2166136261;
      for (const ch of String(str)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
      return h >>> 0;
    }
    // 자막에 가격 정보가 있는 컷인지 (큰 숫자 연출용)
    function gIsPriceCut(caption) {
      return /(만\s?원|할인|월\s?\d|최저|금리|0원|무보증|-\d)/.test(caption || '');
    }
    function gMonthlyText() {
      const m = String(campaign.discount || '').match(/월\s?[0-9]+\s?만\s?원\s?대?/);
      return m ? m[0].replace(/\s/g, '') : '';
    }

    // ---------- 배경: 사진·영상 장면 + 장르별 색보정 ----------
    const GENRE_FILTERS = {
      sale: 'saturate(1.35) contrast(1.12)',
      mono: 'grayscale(1) contrast(1.18) brightness(0.92)',
      warm: 'sepia(0.35) saturate(1.1) contrast(1.1) brightness(0.86)',
      cool: 'saturate(0.7) contrast(1.05) brightness(1.02) hue-rotate(-8deg)',
      noir: 'grayscale(0.85) contrast(1.35) brightness(0.62)',
      film: 'sepia(0.28) saturate(1.05) contrast(1.15) brightness(0.88)',
      ev: 'saturate(0.85) contrast(1.15) brightness(0.8) hue-rotate(-12deg)',
      sports: 'saturate(1.4) contrast(1.28) brightness(0.92)',
      finance: 'saturate(1.05) brightness(1.02)',
      trust: 'saturate(1.08) brightness(1.1) contrast(1.02)'
    };

    function drawGenreBackground(c, W, H, t, mainDuration, V, isOutro) {
      const photos = campaign.uploadedPhotos;
      c.fillStyle = V.genre === 'trust' || V.genre === 'finance' ? '#e2e8f0' : '#05070c';
      c.fillRect(0, 0, W, H);
      if (!photos || photos.length === 0) return;

      const n = photos.length;
      const sceneDur = mainDuration / n;
      const tt = isOutro ? mainDuration - 0.01 : t;
      const idx = Math.min(n - 1, Math.floor(tt / sceneDur));
      const local = Math.min(1, Math.max(0, (tt - idx * sceneDur) / sceneDur));
      if (!isOutro) {
        syncCutVideos(idx, Math.max(0, (window.__realTimelineT || 0) - toRealTime(idx * sceneDur)));
      }

      const filterKey = V.grade || V.genre;
      const canFilter = 'filter' in c;
      if (canFilter) c.filter = GENRE_FILTERS[filterKey] || 'none';

      const seed = gHash(String(getSelectedDealer().token || '')) % 4;
      const moveFor = (i, p) => {
        const kind = (i + seed) % 4;
        const e = p;
        if (V.genre === 'sports') return { s: 1.18 + e * 0.12, x: 40 - e * 80, y: 0 };
        if (V.genre === 'luxury') return { s: 1.06 + e * 0.05, x: 0, y: 8 - e * 16 };
        if (kind === 0) return { s: 1.04 + e * 0.1, x: 0, y: 0 };
        if (kind === 1) return { s: 1.14, x: 30 - e * 60, y: 0 };
        if (kind === 2) return { s: 1.16 - e * 0.1, x: 0, y: -10 + e * 20 };
        return { s: 1.08 + e * 0.08, x: -20 + e * 40, y: 10 - e * 20 };
      };
      const m = moveFor(idx, local);
      const fade = isOutro ? 1 : Math.min(1, (tt - idx * sceneDur) / 0.3);
      if (idx > 0 && fade < 1) {
        const pm = moveFor(idx - 1, 1);
        gDrawCover(c, photos[idx - 1], W, H, pm.s, pm.x, pm.y, 1);
      }
      gDrawCover(c, photos[idx], W, H, m.s, m.x, m.y, idx > 0 ? fade : 1);
      if (canFilter) c.filter = 'none';
    }

    // ---------- 상단 진행 막대 (컷 수만큼) ----------
    function drawGenreProgress(c, W, t, cutDur, totalCuts, color, y, track) {
      const pad = 16;
      const gap = 5;
      const segW = (W - pad * 2 - gap * (totalCuts - 1)) / totalCuts;
      for (let i = 0; i < totalCuts; i++) {
        const x = pad + i * (segW + gap);
        c.fillStyle = track;
        c.fillRect(x, y, segW, 4);
        const p = Math.min(1, Math.max(0, (t - i * cutDur) / cutDur));
        if (p > 0) {
          c.fillStyle = color;
          c.fillRect(x, y, segW * p, 4);
        }
      }
    }

    // ---------- 카마스터 프로필 원 ----------
    function drawGenreAvatar(c, d, cx, cy, r, ring, ringW) {
      c.save();
      c.beginPath();
      c.arc(cx, cy, r, 0, Math.PI * 2);
      c.closePath();
      c.fillStyle = '#1f2937';
      c.fill();
      c.clip();
      const img = d.avatarImg;
      if (img && (img.naturalWidth || img.width)) {
        const sw = img.naturalWidth || img.width;
        const sh = img.naturalHeight || img.height;
        const k = Math.max((r * 2) / sw, (r * 2) / sh);
        c.drawImage(img, cx - (sw * k) / 2, cy - (sh * k) / 2, sw * k, sh * k);
      } else {
        c.fillStyle = '#e5e7eb';
        c.font = gFont(700, r, GENRE_FONTS.sans);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(d.name || '?').slice(0, 1), cx, cy + 2);
        c.textBaseline = 'alphabetic';
      }
      c.restore();
      if (ring) {
        c.beginPath();
        c.arc(cx, cy, r + ringW / 2, 0, Math.PI * 2);
        c.strokeStyle = ring;
        c.lineWidth = ringW;
        c.stroke();
      }
    }

    // ---------- 본편 하단 카마스터 칩 ----------
    function drawDealerChip(c, d, W, H, V, enter) {
      const chipH = 56;
      const y = H - chipH - 26 + (1 - enter) * 30;
      const dark = !(V.genre === 'trust' || V.genre === 'finance');
      c.save();
      c.globalAlpha = enter;
      const label = `${d.name} ${d.title}`;
      c.font = gFont(800, 19, GENRE_FONTS.sans);
      const nameW = Math.min(300, c.measureText(label).width);
      c.font = gFont(500, 13, GENRE_FONTS.sans);
      const subW = Math.min(300, c.measureText(d.branch || '').width);
      const w = Math.max(nameW, subW) + 92;
      const x = 18;
      gRoundRect(c, x, y, w, chipH, V.genre === 'luxury' ? 4 : 28);
      c.fillStyle = dark ? 'rgba(8, 10, 16, 0.78)' : 'rgba(255, 255, 255, 0.94)';
      c.fill();
      if (V.genre === 'luxury' || V.genre === 'ev') {
        c.strokeStyle = V.accent;
        c.lineWidth = 1.2;
        c.stroke();
      }
      drawGenreAvatar(c, d, x + 29, y + chipH / 2, 21, V.accent, 2);
      c.textAlign = 'left';
      c.fillStyle = dark ? '#ffffff' : '#0f172a';
      gDrawLine(c, label, x + 60, y + 25, 300, 19, 13, V.genre === 'luxury' ? GENRE_FONTS.serif : GENRE_FONTS.sans, 800);
      c.fillStyle = dark ? 'rgba(255,255,255,0.68)' : '#475569';
      gDrawLine(c, d.branch || '', x + 60, y + 44, 300, 13, 10, GENRE_FONTS.sans, 500);
      c.restore();
    }

    // ==========================================================================
    // 장르별 본편 오버레이
    // ==========================================================================
    function drawSaleMain(c, W, H, t, info) {
      const { V, cutIdx, local, frac, caption, isPrice, cutDur, totalCuts } = info;
      const enter = gBack(local / 0.42);
      // 붉은 그라데이션으로 아래쪽 가독성 확보
      const g = c.createLinearGradient(0, H * 0.35, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(20,0,0,0.82)');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);

      // 상단 띠: 라벨 + 깜빡이는 점
      c.fillStyle = V.accent;
      c.fillRect(0, 26, W, 50);
      c.fillStyle = '#ffffff';
      if (Math.sin(t * 7) > -0.2) {
        c.beginPath();
        c.arc(34, 51, 7, 0, Math.PI * 2);
        c.fill();
      }
      c.textAlign = 'left';
      gDrawLine(c, V.label, 50, 62, W - 210, 28, 18, GENRE_FONTS.impact, 400);
      c.textAlign = 'right';
      c.font = gFont(700, 15, GENRE_FONTS.mono);
      c.fillText(`${cutIdx + 1}/${totalCuts}`, W - 18, 58);
      drawGenreProgress(c, W, t, cutDur, totalCuts, V.accent2, 10, 'rgba(255,255,255,0.3)');

      // 시그니처 요소
      if (V.sig === 'ticker') {
        const text = `   ${gCleanCaption(campaign.hook)}   ·   ${campaign.vehicle}   ·   ${campaign.discount}   `;
        c.font = gFont(400, 20, GENRE_FONTS.impact);
        const tw = c.measureText(text).width;
        c.fillStyle = '#111827';
        c.fillRect(0, 76, W, 34);
        c.fillStyle = V.accent2;
        const off = -((t * 90) % tw);
        c.textAlign = 'left';
        c.fillText(text + text, off, 101);
      } else if (V.sig === 'countdown') {
        const left = Math.max(0, Math.ceil(cutDur - (t - cutIdx * cutDur)));
        c.save();
        c.translate(W - 70, 160);
        c.beginPath();
        c.arc(0, 0, 46, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0,0,0,0.6)';
        c.fill();
        c.beginPath();
        c.arc(0, 0, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - frac));
        c.strokeStyle = V.accent2;
        c.lineWidth = 6;
        c.stroke();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.font = gFont(400, 38, GENRE_FONTS.impact);
        c.fillText(String(left), 0, 13);
        c.restore();
      } else if (V.sig === 'stamp') {
        c.save();
        c.translate(W - 110, 175);
        c.rotate(-0.22);
        c.globalAlpha = 0.9 * Math.min(1, local / 0.2);
        c.strokeStyle = V.accent;
        c.lineWidth = 5;
        gRoundRect(c, -88, -34, 176, 68, 8);
        c.stroke();
        c.fillStyle = V.accent;
        c.textAlign = 'center';
        c.font = gFont(400, 30, GENRE_FONTS.impact);
        c.fillText('당일배정', 0, 11);
        c.restore();
      } else if (V.sig === 'bolt') {
        c.save();
        c.translate(W - 90, 150 + Math.sin(t * 6) * 4);
        c.fillStyle = V.accent2;
        c.beginPath();
        c.moveTo(10, -50);
        c.lineTo(-24, 6);
        c.lineTo(-2, 6);
        c.lineTo(-14, 50);
        c.lineTo(26, -10);
        c.lineTo(4, -10);
        c.closePath();
        c.fill();
        c.restore();
      } else if (V.sig === 'dossier') {
        c.save();
        c.translate(W / 2, 150);
        c.rotate(-0.06);
        c.globalAlpha = 0.85;
        c.strokeStyle = '#fca5a5';
        c.lineWidth = 3;
        c.strokeRect(-130, -26, 260, 52);
        c.fillStyle = '#fca5a5';
        c.textAlign = 'center';
        c.font = gFont(700, 24, GENRE_FONTS.mono);
        c.fillText('CONFIDENTIAL', 0, 9);
        c.restore();
      }

      // 컷 자막 — 배치(high: 위쪽 / 기본: 가운데 아래)와 모양(alt: 검은 띠 + 흰 글씨)을 스타일마다 다르게
      const high = info.high;
      const boxY = high ? 300 : 560;
      if (info.alt) {
        const wr2 = gWrap(c, caption, W - 110, 2, 44, 28, GENRE_FONTS.impact, 400);
        const lh2 = wr2.size * 1.2;
        const bh2 = wr2.lines.length * lh2 + 58;
        const slide = gEase(local / 0.3);
        c.save();
        c.globalAlpha = Math.min(1, local / 0.12);
        c.fillStyle = 'rgba(0,0,0,0.76)';
        c.fillRect(0, boxY - bh2 / 2, W * slide, bh2);
        c.fillStyle = V.accent;
        c.fillRect(0, boxY - bh2 / 2, 12, bh2);
        c.textAlign = 'left';
        c.fillStyle = V.accent2;
        c.font = gFont(400, 20, GENRE_FONTS.impact);
        c.fillText(`POINT 0${cutIdx + 1}`, 32, boxY - bh2 / 2 + 32);
        c.fillStyle = '#ffffff';
        c.font = gFont(400, wr2.size, GENRE_FONTS.impact);
        wr2.lines.forEach((ln, i) => c.fillText(ln, 32, boxY - bh2 / 2 + 46 + lh2 * (i + 0.8)));
        c.restore();
      } else {
      c.save();
      c.translate(W / 2, boxY);
      c.scale(0.92 + 0.08 * enter, 0.92 + 0.08 * enter);
      c.globalAlpha = Math.min(1, local / 0.15);
      const wr = gWrap(c, caption, W - 104, 2, 38, 24, GENRE_FONTS.sans, 800);
      const lh = wr.size * 1.28;
      const boxH = wr.lines.length * lh + 38;
      gRoundRect(c, -W / 2 + 24, -boxH / 2, W - 48, boxH, 18);
      c.fillStyle = 'rgba(15, 15, 18, 0.84)';
      c.fill();
      c.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      c.lineWidth = 1.2;
      c.stroke();
      gRoundRect(c, -W / 2 + 36, -boxH / 2 + 14, 5, boxH - 28, 2.5);
      c.fillStyle = V.accent;
      c.fill();
      c.fillStyle = '#ffffff';
      c.textAlign = 'center';
      c.font = gFont(800, wr.size, GENRE_FONTS.sans);
      wr.lines.forEach((ln, i) => c.fillText(ln, 4, -boxH / 2 + 19 + lh * (i + 0.78)));
      c.restore();
      }

      // 가격 컷: 큰 할인 숫자
      if (isPrice) {
        const p = gEase((local - 0.08) / 0.5);
        const num = Math.round((campaign.discountNum || 0) * p);
        c.save();
        c.translate(W / 2, high ? 640 : 760);
        c.textAlign = 'center';
        c.fillStyle = '#ffffff';
        c.font = gFont(400, 30, GENRE_FONTS.impact);
        c.fillText(campaign.priceTag ? '특별 혜택' : '최대 할인', 0, -78);
        c.font = gFont(400, campaign.priceTag ? Math.min(104, Math.floor(620 / Math.max(2, String(campaign.priceTag).length))) : 104, GENRE_FONTS.impact);
        const txt = campaign.priceTag || `-${num}만`;
        kLongShadow(c, txt, 0, 18, V.accent2, 'rgba(0,0,0,0.58)', 14, 0.85, 1);
        const mt = gMonthlyText();
        if (mt) {
          c.fillStyle = '#ffffff';
          c.font = gFont(400, 30, GENRE_FONTS.impact);
          c.fillText(mt, 0, 62);
        }
        c.restore();
      } else if (cutIdx === 0) {
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.globalAlpha = Math.min(1, local / 0.3);
        gDrawLine(c, campaign.vehicle, W / 2, high ? 450 : 470, W - 60, 40, 24, GENRE_FONTS.impact, 400);
        c.globalAlpha = 1;
      }
    }

    function drawLuxuryMain(c, W, H, t, info) {
      const { V, cutIdx, local, caption, isPrice, cutDur, totalCuts } = info;
      const bar = V.sig === 'film' ? 128 : 92;
      // 비네팅
      const vg = c.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, V.sig === 'facet' ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.55)');
      c.fillStyle = vg;
      c.fillRect(0, 0, W, H);
      // 레터박스
      c.fillStyle = V.sig === 'wave' ? '#0b1f3a' : '#000000';
      c.fillRect(0, 0, W, bar);
      c.fillRect(0, H - bar, W, bar);

      // 상단 마스트헤드
      c.textAlign = 'center';
      c.fillStyle = V.accent;
      c.font = gFont(700, V.sig === 'masthead' ? 30 : 20, GENRE_FONTS.serif);
      const spaced = V.label.split('').join(V.sig === 'masthead' ? ' ' : '  ');
      gDrawLine(c, spaced, W / 2, bar / 2 + 10, W - 60, V.sig === 'masthead' ? 30 : 20, 14, GENRE_FONTS.serif, 700);
      c.strokeStyle = V.accent;
      c.globalAlpha = 0.6;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(W / 2 - 60, bar - 14);
      c.lineTo(W / 2 + 60, bar - 14);
      c.stroke();
      c.globalAlpha = 1;

      // 시그니처
      if (V.sig === 'film') {
        // 필름 구멍 + 타임코드 + 그레인
        c.fillStyle = 'rgba(255,255,255,0.18)';
        for (let x = 10; x < W; x += 28) {
          c.fillRect(x, 8, 14, 10);
          c.fillRect(x, H - 18, 14, 10);
        }
        c.fillStyle = 'rgba(255,255,255,0.55)';
        c.font = gFont(500, 13, GENRE_FONTS.mono);
        c.textAlign = 'left';
        const fr = Math.floor((t * 24) % 24);
        c.fillText(`SCENE ${String(cutIdx + 1).padStart(2, '0')}  ·  00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(fr).padStart(2, '0')}`, 20, H - bar + 30);
        const gs = gHash(String(Math.floor(t * 12)));
        c.fillStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i < 60; i++) {
          const rx = ((gs * (i + 1)) % 997) / 997;
          const ry = ((gs * (i + 7)) % 991) / 991;
          c.fillRect(rx * W, bar + ry * (H - bar * 2), 2, 2);
        }
      } else if (V.sig === 'crest') {
        c.save();
        c.translate(W / 2, bar + 70);
        c.strokeStyle = V.accent;
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(0, 0, 30, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = V.accent;
        c.font = gFont(900, 22, GENRE_FONTS.serif);
        c.textAlign = 'center';
        c.fillText('V', 0, 8);
        c.restore();
      } else if (V.sig === 'wave') {
        c.strokeStyle = 'rgba(207, 227, 245, 0.55)';
        c.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          c.beginPath();
          for (let x = 0; x <= W; x += 8) {
            const y = H - bar - 18 - k * 10 + Math.sin(x / 40 + t * 2 + k) * 4;
            if (x === 0) c.moveTo(x, y);
            else c.lineTo(x, y);
          }
          c.stroke();
        }
      } else if (V.sig === 'facet') {
        c.strokeStyle = 'rgba(192,196,204,0.25)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, bar + 40);
        c.lineTo(W * 0.35, bar);
        c.moveTo(W, H - bar - 40);
        c.lineTo(W * 0.65, H - bar);
        c.stroke();
      }

      // 컷 자막 — high: 위쪽 / 기본: 아래쪽, alt: 왼쪽 정렬 + 세로 금선
      const a = gEase(local / 0.6);
      const high = info.high;
      const capY = (high ? bar + 210 : H - bar - 150) + (1 - a) * 16;
      const heroY = high ? H - bar - 250 : bar + 150; // 차종명·혜택 숫자 위치
      c.save();
      c.globalAlpha = a;
      if (!info.alt) {
        c.textAlign = 'center';
        const wr = gWrap(c, caption, W - 80, 2, 34, 22, GENRE_FONTS.serif, 700);
        const lh = wr.size * 1.4;
        c.fillStyle = '#ffffff';
        c.shadowColor = 'rgba(0,0,0,0.6)';
        c.shadowBlur = 12;
        c.font = gFont(700, wr.size, GENRE_FONTS.serif);
        wr.lines.forEach((ln, i) => c.fillText(ln, W / 2, capY + lh * i));
        c.shadowBlur = 0;
        c.strokeStyle = V.accent;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(W / 2 - 24, capY - wr.size - 12);
        c.lineTo(W / 2 + 24, capY - wr.size - 12);
        c.stroke();
      } else {
        c.textAlign = 'left';
        const wr = gWrap(c, caption, W - 120, 3, 30, 20, GENRE_FONTS.serif, 700);
        const lh = wr.size * 1.45;
        const top = capY - wr.size;
        c.fillStyle = 'rgba(0,0,0,0.45)';
        c.fillRect(30, top - 40, W - 60, lh * wr.lines.length + 52);
        c.fillStyle = V.accent;
        c.fillRect(46, top - 6, 2, lh * wr.lines.length + 2);
        c.font = gFont(700, 13, GENRE_FONTS.serif);
        c.fillText(`No. ${String(cutIdx + 1).padStart(2, '0')}`, 62, top - 16);
        c.fillStyle = '#ffffff';
        c.font = gFont(700, wr.size, GENRE_FONTS.serif);
        wr.lines.forEach((ln, i) => c.fillText(ln, 62, capY + lh * i));
      }
      c.restore();

      if (cutIdx === 0 && !isPrice) {
        c.save();
        c.globalAlpha = gEase(local / 0.8);
        c.textAlign = 'center';
        c.fillStyle = V.accent;
        gDrawLine(c, campaign.vehicle, W / 2, heroY, W - 70, 40, 24, GENRE_FONTS.serif, 900);
        c.restore();
      }
      if (isPrice) {
        c.save();
        c.globalAlpha = gEase((local - 0.15) / 0.6);
        c.textAlign = 'center';
        c.fillStyle = V.accent2;
        c.font = gFont(700, 18, GENRE_FONTS.serif);
        c.fillText('PRIVILEGE', W / 2, heroY);
        c.fillStyle = V.accent;
        gDrawLine(c, campaign.priceTag || `${campaign.discountNum}만원`, W / 2, heroY + 70, W - 80, 64, 36, GENRE_FONTS.serif, 900);
        c.restore();
      }
      // 아주 얇은 진행선
      c.fillStyle = V.accent;
      c.globalAlpha = 0.8;
      c.fillRect(0, bar - 2, W * Math.min(1, t / (cutDur * totalCuts)), 2);
      c.globalAlpha = 1;
    }

    function drawEvMain(c, W, H, t, info) {
      const { V, cutIdx, local, caption, isPrice, cutDur, totalCuts } = info;
      c.fillStyle = 'rgba(2, 10, 24, 0.35)';
      c.fillRect(0, 0, W, H);
      // 모서리 브래킷
      c.strokeStyle = V.accent;
      c.lineWidth = 2;
      const br = (x, y, sx, sy) => {
        c.beginPath();
        c.moveTo(x, y + 30 * sy);
        c.lineTo(x, y);
        c.lineTo(x + 30 * sx, y);
        c.stroke();
      };
      br(18, 46, 1, 1);
      br(W - 18, 46, -1, 1);
      br(18, H - 110, 1, -1);
      br(W - 18, H - 110, -1, -1);
      // 상단 상태줄
      c.fillStyle = V.accent;
      c.font = gFont(500, 13, GENRE_FONTS.mono);
      c.textAlign = 'left';
      c.fillText(`SYS ▸ ${V.label}`, 28, 36);
      c.textAlign = 'right';
      c.fillText(`CUT ${String(cutIdx + 1).padStart(2, '0')}/${String(totalCuts).padStart(2, '0')}`, W - 28, 36);
      drawGenreProgress(c, W, t, cutDur, totalCuts, V.accent, 12, 'rgba(34,211,238,0.18)');
      // 스캔선
      const sy = 60 + ((t * 160) % (H - 180));
      const sg = c.createLinearGradient(0, sy - 30, 0, sy);
      sg.addColorStop(0, 'rgba(0,0,0,0)');
      sg.addColorStop(1, V.accent + '55');
      c.fillStyle = sg;
      c.fillRect(0, sy - 30, W, 30);

      if (V.sig === 'grid') {
        c.strokeStyle = 'rgba(34,211,238,0.12)';
        c.lineWidth = 1;
        for (let x = 0; x < W; x += 45) {
          c.beginPath();
          c.moveTo(x, 60);
          c.lineTo(x, H - 110);
          c.stroke();
        }
      } else if (V.sig === 'radar') {
        for (let k = 0; k < 3; k++) {
          const r = ((t * 120 + k * 90) % 270) + 20;
          c.strokeStyle = `rgba(56,189,248,${0.5 * (1 - r / 290)})`;
          c.lineWidth = 2;
          c.beginPath();
          c.arc(W / 2, 420, r, 0, Math.PI * 2);
          c.stroke();
        }
      } else if (V.sig === 'gauge' || V.sig === 'plug') {
        c.save();
        c.translate(W - 80, 140);
        c.strokeStyle = 'rgba(255,255,255,0.15)';
        c.lineWidth = 8;
        c.beginPath();
        c.arc(0, 0, 44, Math.PI * 0.75, Math.PI * 2.25);
        c.stroke();
        const p = Math.min(1, (t % 6) / 2);
        c.strokeStyle = V.accent;
        c.beginPath();
        c.arc(0, 0, 44, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * p);
        c.stroke();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.font = gFont(500, 20, GENRE_FONTS.mono);
        c.fillText(V.sig === 'gauge' ? `${Math.round(p * 100)}%` : `${(p * 3.6).toFixed(1)}`, 0, 7);
        c.font = gFont(500, 10, GENRE_FONTS.mono);
        c.fillText(V.sig === 'gauge' ? 'SOH' : 'kW V2L', 0, 24);
        c.restore();
      }

      // 컷 자막 — high: 위쪽 / 기본: 아래쪽, alt: 터미널에 글자가 타이핑되듯 나타남
      const a = gEase(local / 0.4);
      const high = info.high;
      const panelY = high ? 190 : 590;
      if (!info.alt) {
        c.save();
        c.globalAlpha = a;
        const wr = gWrap(c, caption, W - 100, 2, 36, 24, GENRE_FONTS.sans, 800);
        const lh = wr.size * 1.3;
        const ph = wr.lines.length * lh + 52;
        const pw = (W - 56) * (0.6 + 0.4 * a);
        gRoundRect(c, (W - pw) / 2, panelY, pw, ph, 6);
        c.fillStyle = 'rgba(6, 18, 32, 0.78)';
        c.fill();
        c.strokeStyle = V.accent;
        c.lineWidth = 1.5;
        c.stroke();
        c.fillStyle = V.accent;
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.textAlign = 'left';
        c.fillText(`> ${V.label.toLowerCase().replace(/\s/g, '_')}.log`, (W - pw) / 2 + 16, panelY + 22);
        c.fillStyle = '#ffffff';
        c.font = gFont(800, wr.size, GENRE_FONTS.sans);
        wr.lines.forEach((ln, i) => c.fillText(ln, (W - pw) / 2 + 16, panelY + 34 + lh * (i + 0.8)));
        c.restore();
      } else {
        const wr = gWrap(c, caption, W - 90, 3, 34, 22, GENRE_FONTS.sans, 800);
        const lh = wr.size * 1.3;
        const bandH = wr.lines.length * lh + 70;
        const bg = c.createLinearGradient(0, panelY - 20, 0, panelY + bandH);
        bg.addColorStop(0, 'rgba(2,10,24,0)');
        bg.addColorStop(0.25, 'rgba(2,10,24,0.82)');
        bg.addColorStop(1, 'rgba(2,10,24,0.82)');
        c.fillStyle = bg;
        c.fillRect(0, panelY - 20, W, bandH + 20);
        c.textAlign = 'left';
        c.fillStyle = V.accent;
        c.font = gFont(500, 14, GENRE_FONTS.mono);
        c.fillText(`$ run --cut ${cutIdx + 1}`, 40, panelY + 14);
        let left = Math.floor(caption.length * Math.min(1, local / 0.7));
        c.fillStyle = '#ffffff';
        c.font = gFont(800, wr.size, GENRE_FONTS.sans);
        let lastX = 40;
        let lastY = panelY + 40;
        wr.lines.forEach((ln, i) => {
          const part = ln.slice(0, Math.max(0, left));
          left -= ln.length + 1;
          const y = panelY + 40 + lh * (i + 0.8);
          c.fillText(part, 40, y);
          if (part.length > 0) {
            lastX = 40 + c.measureText(part).width + 4;
            lastY = y;
          }
        });
        if (Math.sin(t * 10) > 0) {
          c.fillStyle = V.accent;
          c.fillRect(lastX, lastY - wr.size * 0.8, wr.size * 0.45, wr.size * 0.9);
        }
      }

      const heroY = high ? 640 : 420;
      if (isPrice) {
        const p = gEase((local - 0.1) / 0.5);
        c.textAlign = 'center';
        c.fillStyle = V.accent2;
        c.font = gFont(500, 16, GENRE_FONTS.mono);
        c.fillText('SAVING', W / 2, heroY);
        c.fillStyle = V.accent;
        c.shadowColor = V.accent;
        c.shadowBlur = 18;
        gDrawLine(c, arPriceAnim(p), W / 2, heroY + 80, W - 80, 76, 40, GENRE_FONTS.mono, 700);
        c.shadowBlur = 0;
      } else if (cutIdx === 0) {
        c.textAlign = 'center';
        c.fillStyle = '#ffffff';
        c.globalAlpha = a;
        gDrawLine(c, campaign.vehicle, W / 2, high ? 470 : 540, W - 70, 40, 24, GENRE_FONTS.sans, 900);
        c.globalAlpha = 1;
      }
    }

    function drawSportsMain(c, W, H, t, info) {
      const { V, cutIdx, local, caption, isPrice, cutDur, totalCuts } = info;
      // 속도선
      c.save();
      c.globalAlpha = 0.35;
      c.strokeStyle = '#ffffff';
      c.lineWidth = 2;
      for (let i = 0; i < 18; i++) {
        const y = (gHash('s' + i) % H);
        const x = ((t * 900 + gHash('x' + i)) % (W + 300)) - 300;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + 120 + (i % 4) * 40, y);
        c.stroke();
      }
      c.restore();
      // 상단 연석 띠
      const kerb = 22;
      for (let x = -40; x < W + 40; x += 40) {
        c.fillStyle = (Math.floor((x + 40) / 40) % 2) ? V.accent : '#ffffff';
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x + 40, 0);
        c.lineTo(x + 30, kerb);
        c.lineTo(x - 10, kerb);
        c.closePath();
        c.fill();
      }
      c.fillStyle = '#0a0a0a';
      c.fillRect(0, kerb, W, 44);
      c.fillStyle = V.accent;
      c.textAlign = 'left';
      c.font = gFont(400, 24, GENRE_FONTS.impact);
      c.fillText(V.label, 20, kerb + 32);
      c.textAlign = 'right';
      c.fillStyle = '#ffffff';
      c.font = gFont(700, 16, GENRE_FONTS.mono);
      c.fillText(V.sig === 'checker' ? `LAP ${cutIdx + 1}/${totalCuts}` : `${String(cutIdx + 1).padStart(2, '0')} / ${String(totalCuts).padStart(2, '0')}`, W - 20, kerb + 30);
      drawGenreProgress(c, W, t, cutDur, totalCuts, V.accent, kerb + 46, 'rgba(255,255,255,0.15)');

      if (V.sig === 'flame') {
        const fg = c.createLinearGradient(0, H - 260, 0, H);
        fg.addColorStop(0, 'rgba(251,146,60,0)');
        fg.addColorStop(1, `rgba(234,88,12,${0.45 + 0.15 * Math.sin(t * 20)})`);
        c.fillStyle = fg;
        c.fillRect(0, H - 260, W, 260);
      } else if (V.sig === 'timer') {
        c.textAlign = 'right';
        c.fillStyle = V.accent;
        c.font = gFont(700, 34, GENRE_FONTS.mono);
        c.fillText(`${Math.min(3.4, (t % 4)).toFixed(1)}s`, W - 24, 150);
        c.font = gFont(500, 12, GENRE_FONTS.mono);
        c.fillStyle = '#ffffff';
        c.fillText('0 → 100 km/h', W - 24, 170);
      } else if (V.sig === 'checker') {
        const s = 12;
        for (let r = 0; r < 2; r++) {
          for (let k = 0; k < W / s; k++) {
            c.fillStyle = (k + r) % 2 ? '#000' : '#fff';
            c.fillRect(k * s, H - 24 + r * s, s, s);
          }
        }
      }

      // 컷 자막 — high: 위쪽 / 기본: 아래쪽, alt: 블록 없이 거대한 외곽선 이탤릭 글씨
      const p = gEase(local / 0.3);
      const high = info.high;
      const by = high ? 190 : 600;
      if (!info.alt) {
        const wr = gWrap(c, caption, W - 120, 2, 44, 28, GENRE_FONTS.impact, 400);
        const lh = wr.size * 1.18;
        const bh = wr.lines.length * lh + 30;
        c.save();
        // 기울임(-0.18)으로 왼쪽으로 밀리는 만큼 오른쪽으로 보정
        c.translate((1 - p) * -W + 0.18 * (by + bh / 2), 0);
        c.transform(1, 0, -0.18, 1, 0, 0);
        c.fillStyle = V.accent;
        c.fillRect(14, by, W - 28, bh);
        c.fillStyle = '#000000';
        c.fillRect(14, by + bh, W - 28, 8);
        c.fillStyle = '#ffffff';
        c.textAlign = 'left';
        c.font = gFont(400, wr.size, GENRE_FONTS.impact);
        wr.lines.forEach((ln, i) => c.fillText(ln, 40, by + 14 + lh * (i + 0.82)));
        c.restore();
      } else {
        const wr = gWrap(c, caption, W - 80, 2, 58, 34, GENRE_FONTS.impact, 400);
        const lh = wr.size * 1.05;
        c.save();
        c.translate((1 - p) * W * 0.7 + 0.18 * (by + lh), 0);
        c.transform(1, 0, -0.18, 1, 0, 0);
        c.textAlign = 'left';
        c.lineJoin = 'round';
        c.font = gFont(400, wr.size, GENRE_FONTS.impact);
        wr.lines.forEach((ln, i) => {
          const y = by + lh * (i + 0.9);
          kLongShadow(c, ln, 24, y, i === 0 ? '#ffffff' : V.accent, 'rgba(0,0,0,0.62)', 12, 0.85, 1);
        });
        c.restore();
      }

      if (isPrice) {
        // 타코미터
        const q = gEase((local - 0.05) / 0.6);
        c.save();
        c.translate(W / 2, high ? 600 : 470);
        c.strokeStyle = 'rgba(255,255,255,0.2)';
        c.lineWidth = 14;
        c.beginPath();
        c.arc(0, 0, 110, Math.PI * 0.8, Math.PI * 2.2);
        c.stroke();
        c.strokeStyle = V.accent;
        c.beginPath();
        c.arc(0, 0, 110, Math.PI * 0.8, Math.PI * 0.8 + Math.PI * 1.4 * q);
        c.stroke();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        if (campaign.priceTag) {
          gDrawLine(c, campaign.priceTag, 0, 18, 190, 52, 22, GENRE_FONTS.impact, 400);
          c.font = gFont(400, 22, GENRE_FONTS.impact);
          c.fillText('특별 혜택', 0, 52);
        } else {
        c.font = gFont(400, 64, GENRE_FONTS.impact);
        c.fillText(`-${Math.round((campaign.discountNum || 0) * q)}`, 0, 18);
        c.font = gFont(400, 22, GENRE_FONTS.impact);
        c.fillText('만원 할인', 0, 52);
        }
        c.restore();
      } else if (cutIdx === 0) {
        const ty = high ? 470 : 560;
        c.save();
        c.translate(0.18 * ty, 0);
        c.transform(1, 0, -0.18, 1, 0, 0);
        c.fillStyle = '#ffffff';
        c.textAlign = 'left';
        c.globalAlpha = p;
        gDrawLine(c, campaign.vehicle.toUpperCase(), 30, ty, W - 70, 46, 26, GENRE_FONTS.impact, 400);
        c.restore();
      }
    }

    function drawFinanceMain(c, W, H, t, info) {
      const { V, d, cutIdx, local, caption, isPrice, cutDur, totalCuts } = info;
      const split = V.sig === 'split';
      const top = split ? 430 : 0;
      // 아래쪽을 밝은 앱 화면으로
      c.fillStyle = '#f8fafc';
      if (split) c.fillRect(0, top, W, H - top);
      else {
        const g = c.createLinearGradient(0, H * 0.4, 0, H);
        g.addColorStop(0, 'rgba(248,250,252,0)');
        g.addColorStop(0.35, 'rgba(248,250,252,0.94)');
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      }
      // 상단 앱 헤더
      c.fillStyle = 'rgba(255,255,255,0.96)';
      c.fillRect(0, 0, W, 78);
      drawGenreAvatar(c, d, 38, 44, 20, V.accent, 2);
      c.fillStyle = '#0f172a';
      c.textAlign = 'left';
      gDrawLine(c, `${d.name} ${d.title}`, 68, 40, 300, 17, 12, GENRE_FONTS.sans, 800);
      c.fillStyle = '#10b981';
      c.font = gFont(600, 12, GENRE_FONTS.sans);
      c.fillText('● 지금 상담 가능', 68, 60);
      c.fillStyle = V.accent;
      c.textAlign = 'right';
      gDrawLine(c, V.label, W - 18, 50, 170, 15, 11, GENRE_FONTS.sans, 800);
      drawGenreProgress(c, W, t, cutDur, totalCuts, V.accent, 80, 'rgba(15,23,42,0.08)');

      if (!info.alt) {
      // 지금까지의 컷 자막을 채팅 말풍선으로 쌓음 (최근 3개)
      const bubbles = [];
      for (let i = Math.max(0, cutIdx - 2); i <= cutIdx; i++) {
        bubbles.push({ text: gCleanCaption(campaign.cutCaptions[i] || ''), mine: i % 2 === 1, current: i === cutIdx });
      }
      let y = isPrice ? (split ? 770 : 660) : split ? 470 : 560;
      if (isPrice) bubbles.splice(0, bubbles.length - 1);
      bubbles.forEach((b) => {
        const appear = b.current ? gBack(local / 0.35) : 1;
        const wr = gWrap(c, b.text, W - 170, 3, 22, 16, GENRE_FONTS.sans, 700);
        const lh = wr.size * 1.35;
        c.font = gFont(700, wr.size, GENRE_FONTS.sans);
        const tw = Math.max(...wr.lines.map((l) => c.measureText(l).width));
        const bw = tw + 36;
        const bh = wr.lines.length * lh + 22;
        const bx = b.mine ? W - 24 - bw : 24;
        c.save();
        c.globalAlpha = Math.min(1, appear);
        c.translate(bx + bw / 2, y + bh / 2);
        c.scale(appear, appear);
        gRoundRect(c, -bw / 2, -bh / 2, bw, bh, 20);
        c.fillStyle = b.mine ? V.accent : '#ffffff';
        c.shadowColor = 'rgba(15,23,42,0.12)';
        c.shadowBlur = 10;
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = b.mine ? '#ffffff' : '#0f172a';
        c.textAlign = 'left';
        wr.lines.forEach((ln, i) => c.fillText(ln, -bw / 2 + 18, -bh / 2 + 11 + lh * (i + 0.8)));
        c.restore();
        y += bh + 14;
      });

      } else {
        // alt: 휴대폰 푸시 알림 카드가 위에서 내려옴 (지난 컷은 흐리게 아래 쌓임)
        let ny = isPrice ? (split ? 770 : 660) : split ? 470 : 540;
        const items = [];
        for (let i = Math.max(0, cutIdx - (isPrice ? 0 : 1)); i <= cutIdx; i++) items.push(i);
        items.reverse().forEach((ci, order) => {
          const current = ci === cutIdx;
          const drop = current ? gBack(local / 0.35) : 1;
          const txt = gCleanCaption(campaign.cutCaptions[ci] || '');
          const wr = gWrap(c, txt, W - 140, 2, 21, 15, GENRE_FONTS.sans, 700);
          const lh = wr.size * 1.35;
          const nh = wr.lines.length * lh + 58;
          c.save();
          c.globalAlpha = current ? Math.min(1, drop) : 0.55;
          c.translate(0, (1 - drop) * -60);
          gRoundRect(c, 24, ny, W - 48, nh, 18);
          c.fillStyle = 'rgba(255,255,255,0.97)';
          c.shadowColor = 'rgba(15,23,42,0.18)';
          c.shadowBlur = 16;
          c.fill();
          c.shadowBlur = 0;
          gRoundRect(c, 40, ny + 14, 24, 24, 6);
          c.fillStyle = V.accent;
          c.fill();
          c.textAlign = 'left';
          c.fillStyle = '#64748b';
          c.font = gFont(700, 13, GENRE_FONTS.sans);
          c.fillText(`${V.label} · ${current ? '지금' : '방금'}`, 74, ny + 31);
          c.fillStyle = '#0f172a';
          c.font = gFont(700, wr.size, GENRE_FONTS.sans);
          wr.lines.forEach((ln, i) => c.fillText(ln, 40, ny + 48 + lh * (i + 0.8)));
          c.restore();
          ny += nh + 12;
        });
      }

      if (isPrice) {
        // 견적서 카드
        const a = gEase(local / 0.45);
        const cx = 34;
        const cy = split ? 450 : 330;
        const cw = W - 68;
        c.save();
        c.globalAlpha = a;
        c.translate(0, (1 - a) * 30);
        gRoundRect(c, cx, cy, cw, 300, 18);
        c.fillStyle = '#ffffff';
        c.shadowColor = 'rgba(15,23,42,0.18)';
        c.shadowBlur = 20;
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#64748b';
        c.textAlign = 'left';
        c.font = gFont(700, 15, GENRE_FONTS.sans);
        c.fillText(V.sig === 'receipt' && IND.key === 'auto' ? '사업자 비용처리 견적서' : '맞춤 견적서', cx + 24, cy + 36);
        const rows = [
          ['차종', campaign.vehicle],
          ['특별 할인', arPriceTag()],
          IND.key !== 'auto' ? ['안내', campaign.discount || '-'] : [V.sig === 'receipt' ? '비용처리' : '초기비용', V.sig === 'receipt' ? '100% 가능' : '0원 가능']
        ];
        rows.forEach((r, i) => {
          const ry = cy + 80 + i * 44;
          c.fillStyle = '#475569';
          c.font = gFont(600, 17, GENRE_FONTS.sans);
          c.textAlign = 'left';
          c.fillText(r[0], cx + 24, ry);
          c.fillStyle = i === 1 ? '#e11d48' : '#0f172a';
          c.textAlign = 'right';
          gDrawLine(c, r[1], cx + cw - 24, ry, cw - 160, 18, 12, GENRE_FONTS.sans, 800);
        });
        c.strokeStyle = '#e2e8f0';
        c.setLineDash([5, 5]);
        c.beginPath();
        c.moveTo(cx + 24, cy + 214);
        c.lineTo(cx + cw - 24, cy + 214);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = '#0f172a';
        c.textAlign = 'left';
        c.font = gFont(700, 16, GENRE_FONTS.sans);
        c.fillText('월 납입', cx + 24, cy + 262);
        c.fillStyle = V.accent;
        c.textAlign = 'right';
        gDrawLine(c, gMonthlyText() || campaign.discount, cx + cw - 24, cy + 266, cw - 140, 34, 18, GENRE_FONTS.sans, 900);
        c.restore();
      }
    }

    function drawTrustMain(c, W, H, t, info) {
      const { V, cutIdx, local, caption, isPrice, cutDur, totalCuts } = info;
      // 상단 인증 배지
      gRoundRect(c, 18, 26, 200, 40, 20);
      c.fillStyle = 'rgba(255,255,255,0.95)';
      c.fill();
      c.fillStyle = V.accent;
      c.beginPath();
      c.arc(40, 46, 11, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#ffffff';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(34, 46);
      c.lineTo(39, 51);
      c.lineTo(47, 41);
      c.stroke();
      c.fillStyle = '#0f172a';
      c.textAlign = 'left';
      gDrawLine(c, V.label, 58, 52, 150, 16, 11, GENRE_FONTS.sans, 800);
      drawGenreProgress(c, W, t, cutDur, totalCuts, V.accent, 10, 'rgba(255,255,255,0.6)');

      if (V.sig === 'checklist') {
        const done = Math.min(120, Math.round(((t / (cutDur * totalCuts)) * 120)));
        gRoundRect(c, W - 150, 26, 132, 40, 20);
        c.fillStyle = V.accent;
        c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.font = gFont(800, 16, GENRE_FONTS.sans);
        c.fillText(`검수 ${done}/120`, W - 84, 52);
      } else if (V.sig === 'heart') {
        c.save();
        c.translate(W - 50, 46);
        const s = 1 + 0.08 * Math.sin(t * 5);
        c.scale(s, s);
        c.fillStyle = V.accent;
        c.beginPath();
        c.moveTo(0, 10);
        c.bezierCurveTo(-22, -6, -12, -22, 0, -10);
        c.bezierCurveTo(12, -22, 22, -6, 0, 10);
        c.fill();
        c.restore();
      }

      // 컷 자막 카드 — high: 위쪽 / 기본: 아래쪽, alt: 진한 색 카드 + 큰 체크 아이콘
      const a = gEase(local / 0.4);
      const high = info.high;
      const textX = info.alt ? 98 : 46;
      const wr = gWrap(c, caption, W - 76 - textX, 2, 32, 22, GENRE_FONTS.sans, 800);
      const lh = wr.size * 1.32;
      const ch = wr.lines.length * lh + 60;
      const cy = high ? 86 + (1 - a) * -30 : H - 120 - ch + (1 - a) * 40;
      c.save();
      c.globalAlpha = a;
      gRoundRect(c, 22, cy, W - 44, ch, 22);
      c.fillStyle = info.alt ? V.accent : '#ffffff';
      c.shadowColor = 'rgba(15,23,42,0.22)';
      c.shadowBlur = 24;
      c.fill();
      c.shadowBlur = 0;
      if (info.alt) {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(60, cy + ch / 2, 20, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = V.accent;
        c.lineWidth = 4;
        c.beginPath();
        c.moveTo(50, cy + ch / 2);
        c.lineTo(57, cy + ch / 2 + 7);
        c.lineTo(70, cy + ch / 2 - 8);
        c.stroke();
      }
      c.fillStyle = info.alt ? 'rgba(255,255,255,0.75)' : V.accent;
      c.font = gFont(800, 14, GENRE_FONTS.sans);
      c.textAlign = 'left';
      c.fillText(`POINT ${cutIdx + 1}`, textX, cy + 30);
      c.fillStyle = info.alt ? '#ffffff' : '#0f172a';
      c.font = gFont(800, wr.size, GENRE_FONTS.sans);
      wr.lines.forEach((ln, i) => c.fillText(ln, textX, cy + 40 + lh * (i + 0.85)));
      c.restore();
      const heroTop = high ? 600 : 300;

      if (isPrice) {
        const p = gEase((local - 0.1) / 0.5);
        c.save();
        c.globalAlpha = p;
        gRoundRect(c, W / 2 - 150, heroTop, 300, 150, 24);
        c.fillStyle = 'rgba(255,255,255,0.96)';
        c.fill();
        c.fillStyle = '#64748b';
        c.textAlign = 'center';
        c.font = gFont(700, 16, GENRE_FONTS.sans);
        c.fillText('이번 달 혜택', W / 2, heroTop + 40);
        c.fillStyle = V.accent;
        gDrawLine(c, arPriceAnim(p), W / 2, heroTop + 110, 260, 58, 30, GENRE_FONTS.sans, 900);
        c.restore();
      } else if (cutIdx === 0) {
        c.save();
        c.globalAlpha = a;
        gRoundRect(c, 22, heroTop, W - 44, 76, 18);
        c.fillStyle = 'rgba(15,23,42,0.72)';
        c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        gDrawLine(c, campaign.vehicle, W / 2, heroTop + 50, W - 90, 34, 20, GENRE_FONTS.sans, 900);
        c.restore();
      }
    }

    // ==========================================================================
    // 장르별 마지막 명함
    // ==========================================================================
    function drawStoreOutro(c, W, H, t, local, V, d) {
      const a = gEase(local / 0.45);
      const e = gBack(local / 0.55);
      const cta = arCta();
      const promo = gCleanCaption(d.promoTag || '');
      const accent = (V && V.accent) || '#f97316';
      const inkOnAccent = gLuminance(accent) > 0.55 ? '#0b1220' : '#ffffff';

      // 전체 화면 그라데이션 오버레이 (상단 배경 사진이 비치면서 하단 가독성 확보)
      const bgGrad = c.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, 'rgba(10, 10, 12, 0.35)');
      bgGrad.addColorStop(0.45, 'rgba(10, 10, 12, 0.72)');
      bgGrad.addColorStop(1, 'rgba(10, 10, 12, 0.94)');
      c.fillStyle = bgGrad;
      c.fillRect(0, 0, W, H);

      // 상단 쇼케이스 사진 카드 (명함 원형 얼굴 대신 큼직한 업장/매장 대표 사진)
      const heroImg = (d.avatarImg && (d.avatarImg.naturalWidth || d.avatarImg.width) ? d.avatarImg : null)
        || (typeof campaign !== 'undefined' && Array.isArray(campaign.uploadedPhotos) && campaign.uploadedPhotos[0])
        || d.avatarImg;
      const fx = 32, fy = 96, fw = W - 64, fh = 320;
      c.save();
      c.globalAlpha = a;
      c.translate(W / 2, fy + fh / 2);
      const sc = 0.94 + 0.06 * Math.min(1, e);
      c.scale(sc, sc);
      c.translate(-W / 2, -(fy + fh / 2));
      gRoundRect(c, fx, fy, fw, fh, 22);
      c.save();
      c.clip();
      if (heroImg && (heroImg.naturalWidth || heroImg.width)) {
        const sw = heroImg.naturalWidth || heroImg.width;
        const sh = heroImg.naturalHeight || heroImg.height;
        const k = Math.max(fw / sw, fh / sh);
        c.drawImage(heroImg, fx + (fw - sw * k) / 2, fy + (fh - sh * k) / 2, sw * k, sh * k);
      } else {
        c.fillStyle = '#1c1917';
        c.fillRect(fx, fy, fw, fh);
      }
      const imgVignette = c.createLinearGradient(0, fy + fh * 0.5, 0, fy + fh);
      imgVignette.addColorStop(0, 'rgba(0,0,0,0)');
      imgVignette.addColorStop(1, 'rgba(0,0,0,0.72)');
      c.fillStyle = imgVignette;
      c.fillRect(fx, fy, fw, fh);
      c.restore();

      c.strokeStyle = 'rgba(255,255,255,0.22)';
      c.lineWidth = 2;
      gRoundRect(c, fx, fy, fw, fh, 22);
      c.stroke();

      // 사진 위 업종/방문 안내 뱃지
      const badgeTxt = `${IND.icon || '📍'} ${IND.place || '매장'} 방문 · ${IND.cta || '예약'} 안내`;
      c.font = gFont(800, 15, GENRE_FONTS.sans);
      const bw = Math.min(fw - 32, c.measureText(badgeTxt).width + 28);
      gRoundRect(c, fx + 16, fy + 16, bw, 34, 17);
      c.fillStyle = accent;
      c.fill();
      c.fillStyle = inkOnAccent;
      c.textAlign = 'left';
      c.fillText(badgeTxt, fx + 30, fy + 38);
      c.restore();

      // 매장 이름 (큰 에디토리얼 포스터 타이틀)
      c.save();
      c.globalAlpha = a;
      c.textAlign = 'center';
      c.fillStyle = '#ffffff';
      c.shadowColor = 'rgba(0,0,0,0.6)';
      c.shadowBlur = 14;
      gDrawLine(c, d.name || '', W / 2, 492, W - 64, 52, 28, GENRE_FONTS.sans, 900);
      c.shadowBlur = 0;

      // 대표 메뉴 / 혜택 강조 라인
      c.fillStyle = accent;
      gDrawLine(c, arPriceLine(), W / 2, 554, W - 64, 34, 20, GENRE_FONTS.sans, 900);

      c.fillStyle = 'rgba(255,255,255,0.88)';
      gDrawLine(c, (typeof campaign !== 'undefined' && campaign.vehicle) || '', W / 2, 596, W - 72, 20, 14, GENRE_FONTS.sans, 700);

      if (promo) {
        c.fillStyle = 'rgba(255,255,255,0.68)';
        gDrawLine(c, promo, W / 2, 632, W - 72, 17, 12, GENRE_FONTS.sans, 500);
      }

      // 매장 주소 & 전화번호 안내 카드 (명함 대신 실제 방문·예약에 필요한 위치/연락처 강조)
      const addrText = String(d.branch || '').trim();
      const phoneText = String(d.phone || '').trim();
      if (addrText || phoneText) {
        const boxW = W - 64;
        const boxX = 32;
        const boxY = 656;
        const boxH = addrText && phoneText ? 86 : 52;
        gRoundRect(c, boxX, boxY, boxW, boxH, 16);
        c.fillStyle = 'rgba(255,255,255,0.10)';
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.22)';
        c.lineWidth = 1.2;
        c.stroke();

        c.textAlign = 'center';
        if (addrText) {
          c.fillStyle = '#f4f4f5';
          gDrawLine(c, `📍 ${addrText}`, W / 2, boxY + 30, boxW - 32, 18, 13, GENRE_FONTS.sans, 700);
        }
        if (phoneText) {
          c.fillStyle = accent;
          const py = addrText ? boxY + 66 : boxY + 33;
          gDrawLine(c, `📞 예약·문의  ${phoneText}`, W / 2, py, boxW - 32, 22, 15, GENRE_FONTS.sans, 800);
        }
      }
      c.restore();

      // 하단 펄스 CTA 버튼
      c.save();
      c.globalAlpha = gEase((local - 0.15) / 0.45);
      const pulse = 1 + 0.03 * Math.sin(t * 7);
      c.translate(W / 2, 810);
      c.scale(pulse, pulse);
      gRoundRect(c, -(W - 64) / 2, -37, W - 64, 74, 37);
      c.fillStyle = accent;
      c.fill();
      c.fillStyle = inkOnAccent;
      c.textAlign = 'center';
      gDrawLine(c, cta, 0, 10, W - 110, 28, 17, GENRE_FONTS.sans, 900);
      c.restore();
    }

    function drawGenreOutro(c, W, H, t, local, V, d) {
      if (typeof IND !== 'undefined' && IND.outroMode === 'store') {
        return drawStoreOutro(c, W, H, t, local, V, d);
      }
      const e = gBack(local / 0.55);
      const a = gEase(local / 0.4);
      const cta = arCta();
      const promo = gCleanCaption(d.promoTag || '');
      c.textAlign = 'center';

      if (V.genre === 'sale') {
        const bgGrad = c.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, 'rgba(10, 10, 14, 0.68)');
        bgGrad.addColorStop(0.45, 'rgba(10, 10, 14, 0.88)');
        bgGrad.addColorStop(1, 'rgba(10, 10, 14, 0.96)');
        c.fillStyle = bgGrad;
        c.fillRect(0, 0, W, H);

        // 모던 다크 글래스 딜러 명함 카드
        c.save();
        c.translate(W / 2, 455);
        c.scale(0.92 + 0.08 * e, 0.92 + 0.08 * e);
        c.globalAlpha = a;

        const cw = 448;
        const ch = 540;
        const cx = -cw / 2;
        const cy = -ch / 2;

        // 카드 그림자 및 본체
        c.shadowColor = 'rgba(0, 0, 0, 0.55)';
        c.shadowBlur = 32;
        c.shadowOffsetY = 12;
        gRoundRect(c, cx, cy, cw, ch, 28);
        c.fillStyle = 'rgba(20, 20, 24, 0.94)';
        c.fill();
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;

        // 카드 상단 은은한 포인트 하이라이트
        c.save();
        gRoundRect(c, cx, cy, cw, ch, 28);
        c.clip();
        const topGlow = c.createLinearGradient(0, cy, 0, cy + 150);
        topGlow.addColorStop(0, V.accent + '38');
        topGlow.addColorStop(1, 'rgba(20, 20, 24, 0)');
        c.fillStyle = topGlow;
        c.fillRect(cx, cy, cw, 150);
        c.fillStyle = V.accent;
        c.fillRect(cx, cy, cw, 4);
        c.restore();

        // 얇은 유리 테두리
        c.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        c.lineWidth = 1.5;
        gRoundRect(c, cx, cy, cw, ch, 28);
        c.stroke();

        // 상단 캡슐 배지 (특가 진행중)
        c.font = gFont(700, 14, GENRE_FONTS.sans);
        const badgeText = V.label || '특가 진행중';
        const badgeW = Math.max(116, c.measureText(badgeText).width + 42);
        gRoundRect(c, -badgeW / 2, cy + 28, badgeW, 32, 16);
        c.fillStyle = 'rgba(255, 255, 255, 0.07)';
        c.fill();
        c.strokeStyle = V.accent + '88';
        c.lineWidth = 1;
        c.stroke();
        c.fillStyle = V.accent;
        c.beginPath();
        c.arc(-badgeW / 2 + 16, cy + 44, 4, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#f4f4f5';
        c.textAlign = 'center';
        c.fillText(badgeText, 7, cy + 49);

        // 프로필 아바타
        drawGenreAvatar(c, d, 0, cy + 142, 60, V.accent, 3);

        // 이름 · 직함 · 전시장
        c.fillStyle = '#ffffff';
        gDrawLine(c, `${d.name} ${d.title}`, 0, cy + 244, cw - 64, 34, 22, GENRE_FONTS.sans, 800);
        c.fillStyle = '#a1a1aa';
        gDrawLine(c, d.branch || '', 0, cy + 278, cw - 64, 16, 12, GENRE_FONTS.sans, 500);

        // 하단 혜택 인포 박스 (빈 공간 없이 밀도 있게 구성)
        const bx = cx + 26;
        const by = cy + 312;
        const bw = cw - 52;
        const bh = 194;
        gRoundRect(c, bx, by, bw, bh, 20);
        c.fillStyle = 'rgba(255, 255, 255, 0.045)';
        c.fill();
        c.strokeStyle = 'rgba(255, 255, 255, 0.09)';
        c.lineWidth = 1;
        c.stroke();

        c.fillStyle = '#a1a1aa';
        c.font = gFont(600, 13, GENRE_FONTS.sans);
        c.fillText((typeof campaign !== 'undefined' && campaign.vehicle) ? campaign.vehicle : '이달의 특별 프로모션', 0, by + 36);

        c.fillStyle = V.accent2 || '#fde047';
        gDrawLine(c, arPriceLine(), 0, by + 94, bw - 36, 46, 26, GENRE_FONTS.sans, 900);

        // 구분선 + 부가 혜택/상담 안내
        c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        c.beginPath();
        c.moveTo(bx + 24, by + 128);
        c.lineTo(bx + bw - 24, by + 128);
        c.stroke();

        const subBenefit = promo || (typeof gMonthlyText === 'function' && gMonthlyText()) || '1:1 맞춤 견적 · 즉시출고 상담';
        c.fillStyle = '#e4e4e7';
        gDrawLine(c, subBenefit, 0, by + 162, bw - 36, 16, 12, GENRE_FONTS.sans, 600);

        c.restore();

        // 하단 세련된 CTA 버튼
        c.save();
        c.globalAlpha = a;
        const pulse = 1 + 0.025 * Math.sin(t * 6);
        c.translate(W / 2, 818);
        c.scale(pulse, pulse);
        gRoundRect(c, -210, -35, 420, 70, 35);
        c.fillStyle = V.accent;
        c.shadowColor = V.accent + '55';
        c.shadowBlur = 20;
        c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#ffffff';
        gDrawLine(c, cta, 0, 9, 370, 24, 16, GENRE_FONTS.sans, 800);
        c.restore();
        return;
      }

      if (V.genre === 'luxury') {
        c.fillStyle = V.sig === 'wave' ? 'rgba(8,24,46,0.9)' : 'rgba(0,0,0,0.88)';
        c.fillRect(0, 0, W, H);
        c.save();
        c.globalAlpha = a;
        c.strokeStyle = V.accent;
        c.lineWidth = 1;
        c.strokeRect(40, 120, W - 80, H - 240);
        c.strokeRect(48, 128, W - 96, H - 256);
        c.fillStyle = V.accent;
        c.font = gFont(700, 16, GENRE_FONTS.serif);
        c.fillText(V.label.split('').join(' '), W / 2, 190);
        drawGenreAvatar(c, d, W / 2, 330, 74, V.accent, 1.5);
        c.fillStyle = '#ffffff';
        gDrawLine(c, d.name, W / 2, 480, W - 160, 48, 28, GENRE_FONTS.serif, 900);
        c.fillStyle = V.accent;
        gDrawLine(c, d.title, W / 2, 516, W - 160, 20, 14, GENRE_FONTS.serif, 700);
        c.beginPath();
        c.moveTo(W / 2 - 40, 548);
        c.lineTo(W / 2 + 40, 548);
        c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.75)';
        gDrawLine(c, d.branch || '', W / 2, 588, W - 160, 17, 12, GENRE_FONTS.serif, 700);
        gDrawLine(c, promo, W / 2, 640, W - 160, 15, 11, GENRE_FONTS.serif, 700);
        c.fillStyle = V.accent;
        gDrawLine(c, IND.outroMode === 'store' ? `${IND.place || '매장'} 방문 안내` : 'Private Consultation', W / 2, 730, W - 160, 15, 11, GENRE_FONTS.serif, 700);
        c.fillStyle = '#ffffff';
        gDrawLine(c, IND.outroMode === 'store' ? cta : '댓글로 1:1 프라이빗 상담', W / 2, 770, W - 160, 26, 16, GENRE_FONTS.serif, 900);
        c.restore();
        return;
      }

      if (V.genre === 'ev') {
        c.fillStyle = 'rgba(2,8,20,0.9)';
        c.fillRect(0, 0, W, H);
        c.save();
        c.globalAlpha = a;
        const cx = 50;
        const cy = 180;
        const cw = W - 100;
        const chh = 560;
        gRoundRect(c, cx, cy, cw, chh, 14);
        c.fillStyle = 'rgba(8, 24, 40, 0.92)';
        c.fill();
        c.strokeStyle = V.accent;
        c.lineWidth = 2;
        c.stroke();
        c.fillStyle = V.accent;
        c.textAlign = 'left';
        c.font = gFont(500, 13, GENRE_FONTS.mono);
        c.fillText(`ID ▸ ${String(d.token || 'dealer').toUpperCase()}`, cx + 22, cy + 34);
        c.textAlign = 'right';
        c.fillText(V.label, cx + cw - 22, cy + 34);
        c.textAlign = 'center';
        drawGenreAvatar(c, d, W / 2, cy + 150, 70, V.accent, 3);
        // 스캔선
        const sy = cy + 80 + ((t * 140) % 150);
        c.fillStyle = V.accent + '66';
        c.fillRect(W / 2 - 80, sy, 160, 3);
        c.fillStyle = '#ffffff';
        gDrawLine(c, `${d.name} ${d.title}`, W / 2, cy + 278, cw - 40, 34, 20, GENRE_FONTS.sans, 900);
        c.fillStyle = 'rgba(255,255,255,0.65)';
        gDrawLine(c, d.branch || '', W / 2, cy + 310, cw - 40, 16, 11, GENRE_FONTS.sans, 600);
        const rows = [['SAVING', arPriceTag()], ['BENEFIT', promo]];
        rows.forEach((r, i) => {
          const ry = cy + 370 + i * 46;
          c.textAlign = 'left';
          c.fillStyle = V.accent;
          c.font = gFont(500, 13, GENRE_FONTS.mono);
          c.fillText(r[0], cx + 26, ry);
          c.fillStyle = '#ffffff';
          c.textAlign = 'right';
          gDrawLine(c, r[1], cx + cw - 26, ry, cw - 140, 17, 11, GENRE_FONTS.sans, 700);
        });
        c.restore();
        c.save();
        c.globalAlpha = a;
        gRoundRect(c, 60, 790, W - 120, 66, 8);
        c.fillStyle = V.accent;
        c.fill();
        c.fillStyle = '#021018';
        c.textAlign = 'center';
        gDrawLine(c, cta, W / 2, 833, W - 160, 26, 16, GENRE_FONTS.sans, 900);
        c.restore();
        return;
      }

      if (V.genre === 'sports') {
        c.fillStyle = 'rgba(0,0,0,0.82)';
        c.fillRect(0, 0, W, H);
        // 사선 줄무늬
        c.save();
        c.globalAlpha = 0.9;
        c.fillStyle = V.accent;
        c.beginPath();
        c.moveTo(0, 150);
        c.lineTo(W, 60);
        c.lineTo(W, 130);
        c.lineTo(0, 220);
        c.closePath();
        c.fill();
        c.restore();
        c.save();
        c.translate((1 - e) * W, 0);
        c.transform(1, 0, -0.12, 1, 0, 0);
        c.fillStyle = '#ffffff';
        c.textAlign = 'left';
        c.font = gFont(400, 26, GENRE_FONTS.impact);
        c.fillText('DRIVER', 90, 320);
        gDrawLine(c, d.name, 90, 400, W - 140, 84, 44, GENRE_FONTS.impact, 400);
        c.fillStyle = V.accent;
        gDrawLine(c, d.title, 90, 446, W - 140, 28, 18, GENRE_FONTS.impact, 400);
        c.restore();
        drawGenreAvatar(c, d, W - 110, 330, 70, V.accent, 5);
        c.fillStyle = 'rgba(255,255,255,0.8)';
        c.textAlign = 'left';
        gDrawLine(c, d.branch || '', 60, 510, W - 120, 17, 12, GENRE_FONTS.sans, 700);
        // 번호판 스타일 할인
        c.save();
        c.globalAlpha = a;
        gRoundRect(c, 60, 560, W - 120, 120, 12);
        c.fillStyle = '#ffffff';
        c.fill();
        c.strokeStyle = '#000';
        c.lineWidth = 4;
        c.stroke();
        c.fillStyle = '#000';
        c.textAlign = 'center';
        gDrawLine(c, arPriceTag(), W / 2, 646, W - 160, 70, 36, GENRE_FONTS.impact, 400);
        c.restore();
        c.save();
        c.globalAlpha = a;
        c.fillStyle = V.accent;
        c.fillRect(0, 760, W, 80);
        c.fillStyle = '#000';
        c.textAlign = 'center';
        gDrawLine(c, cta, W / 2, 812, W - 60, 32, 20, GENRE_FONTS.impact, 400);
        c.restore();
        return;
      }

      if (V.genre === 'finance') {
        c.fillStyle = '#f8fafc';
        c.fillRect(0, 0, W, H);
        c.save();
        c.globalAlpha = a;
        drawGenreAvatar(c, d, 110, 200, 66, V.accent, 4);
        c.textAlign = 'left';
        c.fillStyle = '#0f172a';
        gDrawLine(c, d.name, 200, 186, W - 220, 34, 20, GENRE_FONTS.sans, 900);
        c.fillStyle = '#475569';
        gDrawLine(c, `${d.title} · ${d.branch || ''}`, 200, 220, W - 220, 15, 11, GENRE_FONTS.sans, 600);
        // 프로필 통계
        const stats = [['차종', String(campaign.vehicle || '').replace(/^20\d\d\s*/, '')], ['혜택', campaign.priceTag || `-${campaign.discountNum}만`], IND.key === 'auto' ? ['월 납입', gMonthlyText().replace(/^월/, '') || '맞춤'] : [IND.cta, '상담 가능']];
        stats.forEach((s2, i) => {
          const sx = W / 6 + i * (W / 3);
          c.textAlign = 'center';
          c.fillStyle = '#0f172a';
          gDrawLine(c, s2[1], sx, 320, W / 3 - 20, 24, 13, GENRE_FONTS.sans, 900);
          c.fillStyle = '#64748b';
          c.font = gFont(600, 13, GENRE_FONTS.sans);
          c.fillText(s2[0], sx, 344);
        });
        // DM 말풍선
        const bubble = (txt, mine, y) => {
          c.font = gFont(700, 20, GENRE_FONTS.sans);
          const f = gFitLine(c, txt, W - 160, 20, 13, GENRE_FONTS.sans, 700);
          const bw = c.measureText(f.text).width + 40;
          const bx = mine ? W - 30 - bw : 30;
          gRoundRect(c, bx, y, bw, 54, 24);
          c.fillStyle = mine ? V.accent : '#e2e8f0';
          c.fill();
          c.fillStyle = mine ? '#ffffff' : '#0f172a';
          c.textAlign = 'left';
          c.fillText(f.text, bx + 20, y + 34);
        };
        bubble('견적', true, 420);
        bubble(`${campaign.vehicle} 견적서 바로 보내드릴게요!`, false, 490);
        bubble(gMonthlyText() ? `${gMonthlyText()} 가능합니다 🙌` : promo, false, 560);
        c.restore();
        c.save();
        c.globalAlpha = a;
        gRoundRect(c, 40, 760, W - 80, 72, 36);
        c.fillStyle = V.accent;
        c.fill();
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        gDrawLine(c, cta, W / 2, 806, W - 120, 27, 16, GENRE_FONTS.sans, 900);
        c.restore();
        return;
      }

      // trust: 인증서
      c.fillStyle = 'rgba(241,245,249,0.94)';
      c.fillRect(0, 0, W, H);
      c.save();
      c.globalAlpha = a;
      c.translate(0, (1 - a) * 30);
      gRoundRect(c, 34, 110, W - 68, 700, 24);
      c.fillStyle = '#ffffff';
      c.shadowColor = 'rgba(15,23,42,0.15)';
      c.shadowBlur = 30;
      c.fill();
      c.shadowBlur = 0;
      c.fillStyle = V.accent;
      c.fillRect(34, 110, W - 68, 10);
      c.textAlign = 'center';
      c.fillStyle = V.accent;
      gDrawLine(c, V.label, W / 2, 168, W - 120, 18, 12, GENRE_FONTS.sans, 800);
      drawGenreAvatar(c, d, W / 2, 270, 68, V.accent, 4);
      // 인증 도장
      c.save();
      c.translate(W / 2 + 62, 318);
      c.rotate(-0.25);
      c.fillStyle = V.accent;
      c.beginPath();
      c.arc(0, 0, 26, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.font = gFont(900, 14, GENRE_FONTS.sans);
      c.fillText('인증', 0, 5);
      c.restore();
      c.fillStyle = '#0f172a';
      gDrawLine(c, `${d.name} ${d.title}`, W / 2, 392, W - 120, 34, 20, GENRE_FONTS.sans, 900);
      c.fillStyle = '#64748b';
      gDrawLine(c, d.branch || '', W / 2, 424, W - 120, 16, 11, GENRE_FONTS.sans, 600);
      const checks = [campaign.priceLine || `최대 -${campaign.discountNum}만원 혜택`, promo || '출고 고객 사은품', '1:1 맞춤 견적 상담'];
      checks.forEach((txt, i) => {
        const ry = 492 + i * 56;
        c.fillStyle = V.accent2;
        gRoundRect(c, 64, ry - 28, W - 128, 44, 12);
        c.fill();
        c.fillStyle = V.accent;
        c.beginPath();
        c.arc(90, ry - 6, 10, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ffffff';
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(85, ry - 6);
        c.lineTo(89, ry - 2);
        c.lineTo(96, ry - 11);
        c.stroke();
        c.fillStyle = '#0f172a';
        c.textAlign = 'left';
        gDrawLine(c, txt, 110, ry, W - 200, 17, 11, GENRE_FONTS.sans, 700);
        c.textAlign = 'center';
      });
      c.restore();
      c.save();
      c.globalAlpha = a;
      gRoundRect(c, 64, 718, W - 128, 66, 33);
      c.fillStyle = V.accent;
      c.fill();
      c.fillStyle = '#ffffff';
      c.textAlign = 'center';
      gDrawLine(c, cta, W / 2, 761, W - 160, 26, 16, GENRE_FONTS.sans, 900);
      c.restore();
    }

    // 두 번째 명함 디자인: 사진을 화면 가득 깔고 아래쪽에 큰 이름을 얹는 잡지 표지형
    function drawCoverOutro(c, W, H, t, local, V, d) {
      if (typeof IND !== 'undefined' && IND.outroMode === 'store') {
        return drawStoreOutro(c, W, H, t, local, V, d);
      }
      const light = V.genre === 'trust' || V.genre === 'finance';
      const font = V.genre === 'luxury' ? GENRE_FONTS.serif : V.genre === 'sale' || V.genre === 'sports' ? GENRE_FONTS.impact : GENRE_FONTS.sans;
      const weight = V.genre === 'luxury' ? 900 : V.genre === 'sale' || V.genre === 'sports' ? 400 : 900;
      const a = gEase(local / 0.5);
      const g = c.createLinearGradient(0, H * 0.25, 0, H);
      g.addColorStop(0, light ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)');
      g.addColorStop(0.55, light ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)');
      g.addColorStop(1, light ? 'rgba(255,255,255,0.98)' : 'rgba(0,0,0,0.95)');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      const ink = light ? '#0f172a' : '#ffffff';
      const sub = light ? '#475569' : 'rgba(255,255,255,0.72)';
      // 위쪽 라벨
      c.save();
      c.globalAlpha = a;
      c.font = gFont(800, 15, GENRE_FONTS.sans);
      const lw = c.measureText(V.label).width + 32;
      gRoundRect(c, 24, 40, lw, 36, V.genre === 'luxury' ? 2 : 18);
      c.fillStyle = V.accent;
      c.fill();
      c.fillStyle = light || V.genre === 'ev' ? '#0b1220' : '#ffffff';
      if (V.genre === 'trust' || V.genre === 'finance') c.fillStyle = '#ffffff';
      c.textAlign = 'left';
      c.fillText(V.label, 40, 64);
      c.restore();
      // 이름 블록
      const slide = gEase(local / 0.45);
      c.save();
      c.globalAlpha = a;
      c.translate((1 - slide) * -40, 0);
      drawGenreAvatar(c, d, 74, 520, 50, V.accent, 4);
      c.textAlign = 'left';
      c.fillStyle = V.accent;
      gDrawLine(c, d.title, 32, 618, W - 64, 24, 15, font, weight);
      c.fillStyle = ink;
      gDrawLine(c, d.name, 30, 696, W - 60, 78, 40, font, weight);
      c.fillStyle = sub;
      gDrawLine(c, d.branch || '', 32, 734, W - 64, 17, 12, GENRE_FONTS.sans, 600);
      c.restore();
      // 혜택 줄 + CTA
      c.save();
      c.globalAlpha = gEase((local - 0.15) / 0.5);
      c.fillStyle = V.accent;
      c.fillRect(32, 758, 60, 4);
      c.fillStyle = ink;
      c.textAlign = 'left';
      gDrawLine(c, [arPriceLine(), gCleanCaption(d.promoTag || '')].filter(Boolean).join(' · '), 32, 796, W - 64, 18, 12, GENRE_FONTS.sans, 700);
      gRoundRect(c, 24, 830, W - 48, 70, V.genre === 'luxury' ? 4 : 35);
      c.fillStyle = V.accent;
      c.fill();
      c.fillStyle = V.genre === 'ev' || (V.genre === 'luxury' && V.grade !== 'cool') ? '#0b1220' : '#ffffff';
      c.textAlign = 'center';
      gDrawLine(c, arCta(), W / 2, 875, W - 90, 27, 16, font, weight);
      c.restore();
    }
