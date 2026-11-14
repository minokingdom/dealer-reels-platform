// AutoReels — 10-studio-steps.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // 스튜디오 우측 단계 탭 전환 (대본 · 사진 · 사운드 · 명함 · 발행)
    // ==========================================================================
    // ★ 오늘의 주제: 처음에 막막하지 않게 "오늘 무엇을 올릴지"부터 고름
    //   - 요일·계절·시간대·다가오는 기념일(21일 안) + 그날 인기 키워드(/api/trends)를 AI에 넘겨 주제 6개를 받음
    //   - 같은 날·같은 업종은 브라우저에 저장해 다시 묻지 않음 ([다른 주제 보기]는 새로 받음)
    //   - AI가 실패하면 날짜로 만든 기본 주제를 보여 줌
    //   - 주제를 고르면 그 주제로 AI 대본 3안을 바로 만듦
    // ==========================================================================
    const AR_KO_WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    function arNthWeekday(y, m, weekday, n) { // m: 0~11, n번째 weekday(0=일)
      const d = new Date(y, m, 1);
      const shift = (weekday - d.getDay() + 7) % 7;
      return new Date(y, m, 1 + shift + (n - 1) * 7);
    }
    function arUpcomingEvents(now) {
      const y = now.getFullYear();
      const fixed = [[0, 1, '새해'], [1, 14, '발렌타인데이'], [2, 1, '삼일절'], [2, 14, '화이트데이'], [4, 5, '어린이날'], [4, 8, '어버이날'],
        [4, 15, '스승의 날'], [5, 6, '현충일'], [7, 15, '광복절'], [9, 3, '개천절'], [9, 9, '한글날'], [9, 31, '핼러윈'], [10, 11, '빼빼로데이'],
        [11, 24, '크리스마스이브'], [11, 25, '크리스마스'], [11, 31, '연말']];
      const lunar = { 2026: [[1, 17, '설날'], [8, 25, '추석']], 2027: [[1, 7, '설날'], [8, 15, '추석']], 2028: [[0, 27, '설날'], [9, 3, '추석']] };
      const list = [];
      [y, y + 1].forEach((yy) => {
        fixed.forEach(([m, d, n]) => list.push([new Date(yy, m, d), n]));
        (lunar[yy] || []).forEach(([m, d, n]) => list.push([new Date(yy, m, d), n]));
        list.push([arNthWeekday(yy, 10, 4, 3), '수능']); // 11월 셋째 목요일
        list.push([arNthWeekday(yy, 10, 5, 4), '블랙프라이데이']); // 11월 넷째 금요일
      });
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return list
        .map(([d, n]) => ({ name: n, days: Math.round((d - today) / 86400000) }))
        .filter((e) => e.days >= 0 && e.days <= 21)
        .sort((a, b) => a.days - b.days)
        .map((e) => (e.days === 0 ? `오늘 ${e.name}` : `${e.name} D-${e.days}`));
    }
    function arDateContext() {
      const now = new Date();
      const m = now.getMonth() + 1;
      const h = now.getHours();
      return {
        dateKey: `${now.getFullYear()}-${String(m).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        dateStr: `${m}월 ${now.getDate()}일`,
        weekday: AR_KO_WEEKDAYS[now.getDay()],
        weekend: now.getDay() === 0 || now.getDay() === 6,
        season: m >= 3 && m <= 5 ? '봄' : m >= 6 && m <= 8 ? '여름' : m >= 9 && m <= 11 ? '가을' : '겨울',
        timeOfDay: h < 11 ? '오전' : h < 14 ? '점심' : h < 18 ? '오후' : '저녁',
        events: arUpcomingEvents(now)
      };
    }
    // AI가 안 될 때 쓰는 기본 주제 (날짜·업종 단어로 만듦)
    function arFallbackTopics(dc) {
      const P = IND.product || '상품';
      const out = [];
      if (dc.events[0]) {
        const ev = dc.events[0].replace(/ D-\d+$|^오늘 /g, '');
        out.push({ title: `${ev} 맞이 ${P}`, why: dc.events[0], prompt: `${ev}에 어울리는 ${P} 추천과 혜택` });
      }
      if (IND.key === 'auto') {
        out.push({ title: '즉시출고 재고 안내', why: '바로 받을 수 있는 차 찾는 고객', prompt: '이번 주 즉시출고 가능한 재고 안내' });
        out.push({ title: '이달의 프로모션', why: `${dc.dateStr.split(' ')[0]} 조건 정리`, prompt: '이달 할인·금리 프로모션 핵심 정리' });
        out.push({ title: '출고 현장 보여주기', why: '신뢰를 주는 현장 영상', prompt: '오늘 출고 현장과 꼼꼼한 검수 과정' });
      } else {
        out.push({ title: `오늘의 추천 ${P}`, why: `${dc.weekday} ${dc.timeOfDay} 추천`, prompt: `오늘 꼭 소개하고 싶은 추천 ${P}` });
        out.push({ title: dc.weekend ? '주말 방문 혜택' : '평일 한정 혜택', why: dc.weekend ? '주말 나들이 수요' : `${dc.weekday} 한산한 시간 공략`, prompt: dc.weekend ? `주말에 방문하면 받는 ${P} 혜택` : `평일에만 드리는 ${P} 혜택` });
        out.push({ title: '준비 과정 보여주기', why: '정성과 신뢰를 보여 주기', prompt: `${P}을(를) 준비하는 과정과 정성` });
      }
      out.push({ title: `${dc.season} 시즌 추천`, why: `${dc.season}에 찾는 사람이 많음`, prompt: `${dc.season}에 딱 맞는 ${P} 추천` });
      out.push({ title: '자주 묻는 질문 답하기', why: '문의를 줄이고 신뢰를 높임', prompt: `손님들이 자주 묻는 ${P} 질문에 답하기` });
      return out.slice(0, 6);
    }
    let arTopicsLoading = 0;
    function arRenderTopics(topics, statusText) {
      const box = document.getElementById('topicCards');
      if (!box) return;
      window.__arTopics = topics;
      const esc = (v) => String(v || '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
      box.innerHTML = topics.map((t, i) => `
        <button type="button" data-topic-idx="${i}" class="text-left p-3.5 rounded-[10px] bg-[#141415] hover:bg-[#1c1c20] border border-[var(--border)] hover:border-[#4cc38a] cursor-pointer transition">
          <div class="text-[14px] font-semibold text-[#ededed]">${esc(t.title)}</div>
          <div class="text-[12px] text-[#4cc38a] mt-0.5">${esc(t.why)}</div>
          <div class="text-[11px] text-[#85858b] mt-1">${esc(t.prompt)}</div>
        </button>`).join('');
      const st = document.getElementById('topicStatus');
      if (st) st.textContent = statusText || '';
    }
    async function arLoadTopics(force) {
      const dc = arDateContext();
      const line = document.getElementById('topicDateLine');
      if (line) line.textContent = `${dc.dateStr} ${dc.weekday} · ${dc.season}${dc.events.length ? ' · ' + dc.events.slice(0, 2).join(' · ') : ''}`;
      const cacheKey = `ar_topics_${IND.key}_${dc.dateKey}`;
      if (!force) {
        try {
          const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
          if (cached && Array.isArray(cached.topics) && cached.topics.length) {
            arRenderTopics(cached.topics, '오늘의 추천 주제예요. 마음에 드는 게 없으면 [다른 주제 보기]를 눌러 보세요.');
            return;
          }
        } catch (e) {}
      }
      // 먼저 기본 주제를 바로 보여 주고, AI 추천이 오면 바꿈
      const myJob = ++arTopicsLoading;
      arRenderTopics(arFallbackTopics(dc), '오늘 요일·계절·인기 키워드로 주제를 고르는 중… (10초 정도)');
      if (!window.location.protocol.startsWith('http')) return;
      // 인기 키워드: 매일 새벽 4시에 미리 받아 둔 파일(trends-today.json)을 먼저 읽고, 없으면 실시간 조회(최대 6초)
      let trends = [];
      try {
        const pre = await fetch('/trends-today.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null));
        const row = pre && pre.industries && pre.industries[IND.key];
        const ageDays = pre && pre.date ? (Date.now() - Date.parse(pre.date)) / 86400000 : 99;
        if (row && Array.isArray(row.keywords) && ageDays < 3) trends = row.keywords.slice(0, 8);
      } catch (e) {}
      if (!trends.length) try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 6000);
        const tr = await fetch(`/api/trends?industry=${encodeURIComponent(IND.key)}`, { signal: ctrl.signal }).then((r) => r.json());
        clearTimeout(timer);
        trends = (tr && Array.isArray(tr.items) ? tr.items : [])
          .map((it) => [String(it.title || (it.theme && it.theme.hookCaption) || '').replace(/#[^\s#]+/g, '').trim().slice(0, 50), (String(it.fullCaption || it.title || '').match(/#[가-힣a-zA-Z0-9_]+/g) || []).slice(0, 4).join(' ')].join(' ').trim())
          .filter(Boolean).slice(0, 8);
      } catch (e) {}
      if (myJob !== arTopicsLoading) return;
      try {
        const d = typeof getSelectedDealer === 'function' ? getSelectedDealer() : null;
        const copy = d && typeof arDealerForCopy === 'function' ? arDealerForCopy(d) : null;
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'topics',
            industry: IND.key,
            industryInfo: { name: IND.name, role: IND.role, product: IND.product, aiRole: IND.aiRole },
            dateContext: dc,
            trends,
            storeHint: copy ? [copy.name, copy.branch].filter(Boolean).join(' ') : ''
          })
        }).then((r) => r.json());
        if (myJob !== arTopicsLoading) return;
        if (res && res.ok && Array.isArray(res.topics) && res.topics.length) {
          try { localStorage.setItem(cacheKey, JSON.stringify({ topics: res.topics, at: Date.now() })); } catch (e) {}
          arRenderTopics(res.topics, `오늘 날짜${trends.length ? '와 요즘 인기 키워드' : ''}로 고른 주제예요. 하나를 누르면 대본을 바로 만들어요.`);
          return;
        }
      } catch (e) {}
      if (myJob === arTopicsLoading) {
        const st = document.getElementById('topicStatus');
        if (st) st.textContent = 'AI 추천을 받지 못해 기본 주제를 보여 드려요. 잠시 뒤 [다른 주제 보기]를 눌러 보세요.';
      }
    }
    // 주제 선택 → 대본 탭으로 이동해 그 주제로 AI 대본을 바로 만듦
    function arPickTopic(topic) {
      if (!topic || !topic.prompt) return;
      window.arTodayTopic = topic;
      const promptEl = document.getElementById('aiPromptInput');
      if (promptEl) promptEl.value = topic.prompt;
      const badge = document.getElementById('todayTopicBadge');
      if (badge) { badge.textContent = `오늘 주제: ${topic.title} — 이 주제로 대본을 만들고 있어요`; badge.classList.remove('hidden'); }
      switchStudioTab('script');
      if (typeof generateStoryboardFromPrompt === 'function') {
        Promise.resolve(generateStoryboardFromPrompt()).finally(() => {
          if (badge) badge.textContent = `오늘 주제: ${topic.title}`;
        });
      }
    }
    function arPickCustomTopic() {
      const el = document.getElementById('topicCustomInput');
      const v = (el && el.value || '').trim();
      if (!v) { if (el) el.focus(); return; }
      arPickTopic({ title: v.slice(0, 20), why: '직접 입력', prompt: v });
    }
    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('[data-topic-idx]');
      if (!btn) return;
      const t = (window.__arTopics || [])[Number(btn.getAttribute('data-topic-idx'))];
      if (t) arPickTopic(t);
    });

    const STUDIO_TABS = ['topic', 'script', 'photo', 'sound', 'card', 'publish'];
    // ★ 성우 목소리는 단계를 순서대로 명함까지 마친 뒤 발행 단계에서 처음 들려줌
    //   그 전에는 성우 녹음을 받지도 틀지도 않음 (배경음악 미리 듣기는 가능)
    //   발행 단계에 들어오면 고른 배경음악 + 성우 목소리를 섞은 완성본을 처음부터 재생
    const arStepsVisited = new Set(['topic']);
    let arFinalAudioUnlocked = false;
    function arVoiceAllowed() { return arFinalAudioUnlocked; }
    function arFirstMissingStep() {
      return ['topic', 'script', 'photo', 'sound', 'card'].find((k) => !arStepsVisited.has(k)) || null;
    }
    function arSetFinalPreviewStatus(text) {
      const el = document.getElementById('finalPreviewStatus');
      if (el) el.textContent = text;
    }
    // 발행 단계 진입: 완성본(배경음악 + 성우) 준비 후 처음부터 재생
    function arStartFinalPreview() {
      arFinalAudioUnlocked = true;
      if (window.innerWidth < 1024) scrollToMainMonitor();
      if (!AudioEngine.enabled) toggleAudioMaster(true);
      if (AudioEngine.ttsVoice === 'off') {
        arSetFinalPreviewStatus('성우를 끈 상태라 배경음악만 들어갑니다. 처음부터 재생합니다.');
        triggerFullAudioPreview();
        return;
      }
      arSetFinalPreviewStatus('완성본 준비 중… 성우가 대본을 한 번에 녹음하고 있어요 (10초 정도)');
      AudioEngine.stopTts();
      // 녹음이 끝나면 처음부터 배경음악과 함께 재생
      Promise.resolve(AudioEngine.scriptPending || AudioEngine.prefetchTtsBuffers()).then(() => {
        triggerFullAudioPreview();
        arSetFinalPreviewStatus(AudioEngine.masterBuffer
          ? '완성본 재생 중 — 고른 배경음악과 성우 목소리가 함께 들어갑니다.'
          : '성우 녹음을 받지 못해 배경음악만 재생합니다. 잠시 뒤 [처음부터 다시 보기]를 눌러 주세요.');
      });
    }
    function arReplayFinalPreview() {
      if (!arFinalAudioUnlocked) return arStartFinalPreview();
      if (window.innerWidth < 1024) scrollToMainMonitor();
      triggerFullAudioPreview();
    }
    function switchStudioTab(key) {
      if (!STUDIO_TABS.includes(key)) return;
      // 발행 단계는 명함까지 순서대로 마쳐야 열림
      if (key === 'publish' && !arFinalAudioUnlocked) {
        const missing = arFirstMissingStep();
        if (missing) {
          const names = { topic: '주제', script: '대본', photo: '사진', sound: '사운드', card: '명함' };
          if (typeof arToast === 'function') arToast(`${names[missing]} 단계부터 순서대로 마쳐 주세요. 명함까지 끝내면 완성본을 들려드려요.`);
          key = missing;
        }
      }
      arStepsVisited.add(key);
      if (key === 'sound') AudioEngine.loadVoiceList();
      // 사진 탭의 컷 카드에 대본 탭에서 고친 문구를 반영
      if (key === 'photo' && typeof renderDynamicCutCardsUI === 'function') renderDynamicCutCardsUI();
      STUDIO_TABS.forEach((k) => {
        const panel = document.getElementById(`studioPanel_${k}`);
        const btn = document.getElementById(`studioTabBtn_${k}`);
        const active = k === key;
        if (panel) panel.classList.toggle('hidden', !active);
        if (btn) {
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
          btn.className = active
            ? 'studio-tab bg-[#232325] text-[#ededed] font-medium'
            : 'studio-tab text-[#85858b] hover:text-[#ededed] font-normal';
        }
      });
      // 탭을 바꾸면 패널 맨 위가 보이도록 (긴 화면에서 아래쪽에 머무는 것 방지)
      const bar = document.querySelector('.studio-tablist');
      if (bar && bar.getBoundingClientRect().top < 0) {
        bar.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      arUpdateEasyGuide(key);
      if (key === 'publish' && !arFinalAudioUnlocked) arStartFinalPreview();
    }

    // ==========================================================================
    // ★ 쉬운 모드: 단계마다 꼭 필요한 것만 보이고 고급 기능([data-advanced])은 숨김
    //   body.ar-easy 클래스로 전환, 선택은 localStorage 'ar_ui_mode' 에 기억 (기본: 쉬운 모드)
    // ==========================================================================
    function arUpdateEasyGuide(key) {
      const steps = {
        topic: ['오늘의 주제', '오늘 올릴 주제를 골라 주세요. 고르면 그 주제로 AI가 대본 3안을 바로 만들어 드려요.'],
        script: ['대본 고르기', '상품 이름과 혜택을 확인하고 [AI로 만들기]를 누르세요. 대본 3안 중 마음에 드는 것을 고르면 됩니다.'],
        photo: ['사진 넣기', '내 사진이나 영상을 올리세요. 올리지 않으면 기본 사진으로 만들어집니다.'],
        sound: ['소리 고르기', '배경음악과 성우 목소리를 고르세요. 성우 목소리는 명함까지 마치면 발행 단계에서 음악과 함께 완성본으로 들려드려요.'],
        card: ['마지막 화면 확인', '영상 마지막에 나올 이름·소속·연락처·혜택이 맞는지 확인하세요.'],
        publish: ['완성본 확인 · SNS에 올리기', '배경음악과 성우가 들어간 완성본을 확인하고, 올릴 SNS를 고른 뒤 [선택한 SNS에 발행]을 누르세요.']
      };
      const idx = STUDIO_TABS.indexOf(key);
      const step = steps[key];
      if (idx < 0 || !step) return;
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('easyStepCount', `${idx + 1} / ${STUDIO_TABS.length}`);
      set('easyStepTitle', step[0]);
      set('easyStepText', step[1]);
    }

    function arSetUiMode(mode, remember) {
      const easy = mode !== 'full';
      document.body.classList.toggle('ar-easy', easy);
      document.querySelectorAll('[data-ui-mode]').forEach((b) => {
        b.setAttribute('aria-pressed', String((b.getAttribute('data-ui-mode') === 'easy') === easy));
      });
      if (remember) {
        try { localStorage.setItem('ar_ui_mode', easy ? 'easy' : 'full'); } catch (e) {}
      }
    }

    function arLoadUiMode() {
      try { return localStorage.getItem('ar_ui_mode') === 'full' ? 'full' : 'easy'; } catch (e) { return 'easy'; }
    }

    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-ui-mode]');
      if (!b) return;
      arSetUiMode(b.getAttribute('data-ui-mode'), true);
    });

    function switchMainTab(tab) {
      document.getElementById('viewPreview').classList.toggle('hidden', tab !== 'preview');
      document.getElementById('viewAdmin').classList.toggle('hidden', tab !== 'admin');
      document.getElementById('viewTech').classList.toggle('hidden', tab !== 'tech');

      const tabs = [
        { id: 'tabBtnPreview', key: 'preview' },
        { id: 'tabBtnAdmin', key: 'admin' },
        { id: 'tabBtnTech', key: 'tech' }
      ];
      tabs.forEach((t) => {
        const el = document.getElementById(t.id);
        if (t.key === tab) {
          el.className = 'whitespace-nowrap h-8 px-3.5 rounded-[6px] text-[13px] font-medium transition-colors bg-[#232325] text-[#ededed]';
        } else {
          el.className = 'whitespace-nowrap h-8 px-3.5 rounded-[6px] text-[13px] font-normal transition-colors text-[#85858b] hover:text-[#ededed]';
        }
      });

      syncPreviewPanel();
      syncTechPanel();
    }

    function selectDealer(id, goPreview = false) {
      selectedDealerId = id;
      renderQuickSelector();
      renderAdminDealerList();
      syncPreviewPanel();
      syncTechPanel();
      document.getElementById('publishLogBox').classList.add('hidden');
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
      if (goPreview) switchMainTab('preview');
    }

    function renderQuickSelector() {
      const container = document.getElementById('dealerQuickSelector');
      container.innerHTML = dealers
        .map((d) => {
          const active = d.id === selectedDealerId;
          return `<button onclick="selectDealer('${d.id}')" class="h-8 px-3 rounded-[8px] text-[12px] font-medium transition-colors border cursor-pointer flex items-center gap-2 ${
            active
              ? 'bg-[#232325] text-[#ededed] border-[rgba(237,237,237,0.22)]'
              : 'bg-[#141415] text-[#85858b] border-[var(--border)] hover:text-[#ededed]'
          }"><span class="w-1.5 h-1.5 rounded-full ${active ? 'bg-[#4cc38a]' : 'bg-[#85858b]'}"></span>${d.name} ${d.title} <span class="text-[#85858b] font-normal">${d.branch.split(' ')[0]}</span></button>`;
        })
        .join('');
    }

    function renderAdminDealerList() {
      const listEl = document.getElementById('adminDealerList');
      const statBadge = document.getElementById('statSummaryBadge');
      statBadge.textContent = `${dealers.length}명 구독 중 · 주간 ${(dealers.length * 50000).toLocaleString()}원`;

      listEl.innerHTML = dealers
        .map((d) => {
          const badgeHtml =
            d.status === 'PUBLISHED'
              ? `<span class="tag-chip px-2 py-0.5 text-[11px] text-[#4cc38a]">발행 완료</span>`
              : d.status === 'REVISION'
              ? `<span class="tag-chip px-2 py-0.5 text-[11px] text-[#d97706]">수정 요청</span>`
              : `<span class="tag-chip px-2 py-0.5 text-[11px] text-[#a1a1a6]">검수 대기</span>`;

          const vLabel = d.variation ? d.variation.label : '기본 변주';
          return `
            <div class="p-4 rounded-[12px] bg-[#141415] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="w-2 h-2 rounded-full inline-block" style="background:${d.accentColor}"></span>
                  <span class="text-[14px] font-medium text-[#ededed]">${d.name} ${d.title}</span>
                  <span class="text-[12px] text-[#85858b]">${d.branch}</span>
                  ${badgeHtml}
                  <span class="font-mono text-[11px] text-[#85858b]">${vLabel}</span>
                </div>
                <div class="text-[12px] font-mono text-[#85858b]">
                  ${d.phone} · ${d.igUsername} · ${d.licenseKey}
                </div>
              </div>
              <button onclick="selectDealer('${d.id}', true)" class="btn-secondary h-8 px-3 text-[12px] cursor-pointer">
                스튜디오 열기
              </button>
            </div>
          `;
        })
        .join('');
    }

    function syncPreviewPanel() {
      const d = getSelectedDealer();
      const v = d.variation || VARIATION_RECIPES[0];
      document.getElementById('stagingUrlText').textContent = `https://staging.autoreels.kr/v/${d.token}`;
      document.getElementById('previewDealerHeader').textContent = '오늘의 릴스 만들기';
      document.getElementById('dlrInputName').value = d.name;
      document.getElementById('dlrInputTitle').value = d.title;
      document.getElementById('dlrInputPhone').value = d.phone;
      document.getElementById('dlrInputBranch').value = d.branch;
      document.getElementById('dlrInputPromo').value = d.promoTag;
      document.getElementById('igAccountBadge').textContent = window.AR_SERVER && AR_SERVER.mode ? ((AR_SNS_STATE && AR_SNS_STATE.targets.instagram.name) || '') : `${d.igUsername}`;
      document.getElementById('dlrCaptionTextarea').value = buildCaption(d);

      const hookInput = document.getElementById('inputHook');
      if (hookInput) hookInput.value = v.hook || campaign.hook;
      const bulletsInput = document.getElementById('inputBullets');
      if (bulletsInput && v.bullets) bulletsInput.value = v.bullets.join('\n');

      const totalCuts = getTargetCutCount();
      renderDynamicCutCardsUI(totalCuts);
      for (let i = 0; i < totalCuts; i++) {
        const cutEl = document.getElementById(`cutSub${i}`);
        if (cutEl && campaign.cutCaptions && campaign.cutCaptions[i] !== undefined) {
          cutEl.value = campaign.cutCaptions[i];
        }
        const ttsEl = document.getElementById(`cutTts${i}`);
        if (ttsEl) {
          ttsEl.value =
            (campaign.ttsLines && campaign.ttsLines[i]) ||
            (campaign.cutCaptions && campaign.cutCaptions[i]) ||
            '';
        }
      }

      syncScenePlanUI();
      syncDrmAndSnsUI();
      renderDealerVariationSummary();

      const statusContainer = document.getElementById('previewStatusBadge');
      if (d.status === 'PUBLISHED') {
        statusContainer.innerHTML = `<span class="tag-chip px-2.5 py-1 text-[12px] text-[#4cc38a]">발행 완료</span>`;
      } else if (d.status === 'REVISION') {
        statusContainer.innerHTML = `<span class="tag-chip px-2.5 py-1 text-[12px] text-[#d97706]">수정 요청됨</span>`;
      } else {
        statusContainer.innerHTML = `<span class="tag-chip px-2.5 py-1 text-[12px] text-[#a1a1a6]">편집 중</span>`;
      }
    }

    function evaluateDealerDrmStatus(d) {
      if (!d) return 0;
      const curP8 = extractPhoneLast8(d.phone);
      const regP8 = extractPhoneLast8(d.licensedPhone || d.phone);
      const sig = parseProvidedLicenseSig(d.licenseKey);
      const expiry = d.expiryYmd || 20261231;
      const today = 20261112;
      const domFlag = getCurrentDomainFlag();
      if (RustWasmCore && typeof RustWasmCore.verify_subscription_drm === 'function') {
        return RustWasmCore.verify_subscription_drm(curP8, regP8, sig, expiry, today, domFlag) >>> 0;
      }
      if (curP8 !== regP8) return 3;
      return sig > 0 ? 1 : 0;
    }

    function syncDrmAndSnsUI() {
      const d = getSelectedDealer();
      if (!d) return;

      const keyEl = document.getElementById('dlrLicenseKeyInput');
      if (keyEl) keyEl.value = d.licenseKey || '';
      const boundPhoneEl = document.getElementById('dlrLicensedPhoneView');
      if (boundPhoneEl) boundPhoneEl.value = d.licensedPhone || d.phone;
      const boundTextEl = document.getElementById('drmBoundPhoneText');
      if (boundTextEl) boundTextEl.textContent = d.licensedPhone || d.phone;
      const expEl = document.getElementById('dlrExpiryView');
      if (expEl) {
        const ymdStr = String(d.expiryYmd || 20261231);
        expEl.value = ymdStr.length === 8
          ? `PRO 무제한 (${ymdStr.slice(0, 4)}-${ymdStr.slice(4, 6)}-${ymdStr.slice(6, 8)})`
          : 'PRO 무제한 구독';
      }

      const hdrNameEl = document.getElementById('headerDealerNameText');
      if (hdrNameEl) hdrNameEl.textContent = `${d.name} ${d.title}`;
      const hdrPhoneEl = document.getElementById('headerDealerPhoneText');
      if (hdrPhoneEl) hdrPhoneEl.textContent = d.phone || '';

      const drmCode = evaluateDealerDrmStatus(d);
      const badgeEl = document.getElementById('drmStatusBadge');
      const hdrDotEl = document.getElementById('headerDrmDot');
      if (badgeEl) {
        if (drmCode === 1) {
          badgeEl.className = 'tag-chip px-2.5 py-1 text-[12px] font-medium text-[#4cc38a]';
          badgeEl.textContent = '정품 구독 인증됨 (워터마크 제거)';
          if (hdrDotEl) hdrDotEl.style.background = '#4cc38a';
        } else if (drmCode === 3) {
          badgeEl.className = 'tag-chip px-2.5 py-1 text-[12px] font-medium text-[#e5484d]';
          badgeEl.textContent = '타 카마스터 번호 도용 감지 · 공유 차단됨';
          if (hdrDotEl) hdrDotEl.style.background = '#e5484d';
        } else {
          badgeEl.className = 'tag-chip px-2.5 py-1 text-[12px] font-medium text-[#d97706]';
          badgeEl.textContent = '미구독 · 체험판 상태 (워터마크 표시)';
          if (hdrDotEl) hdrDotEl.style.background = '#d97706';
        }
      }

      // 4대 SNS 연결 상태 UI 업데이트
      const sns = d.snsAccounts || { ig: d.igUsername, yt: '', tt: '', fb: '' };
      ['ig', 'yt', 'tt', 'fb'].forEach((ch) => {
        const handleEl = document.getElementById(`snsHandle_${ch}`);
        const btnEl = document.getElementById(`snsStatusBtn_${ch}`);
        const val = (sns[ch] || '').trim();
        if (handleEl) {
          handleEl.textContent = val || '미연결';
          handleEl.className = val ? 'text-[12px] text-[#a1a1a6] font-mono' : 'text-[12px] text-[#85858b] font-mono';
        }
        if (btnEl) {
          btnEl.textContent = val ? '연결됨' : '연결하기';
          btnEl.className = val
            ? 'tag-chip px-2 py-1 text-[11px] text-[#4cc38a] cursor-pointer'
            : 'tag-chip px-2 py-1 text-[11px] text-[#85858b] cursor-pointer';
        }
      });
    }

    function onDealerLicenseInput() {
      const d = getSelectedDealer();
      const val = document.getElementById('dlrLicenseKeyInput')?.value.trim() || '';
      d.licenseKey = val;
      syncDrmAndSnsUI();
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
    }

    function simulateDrmMode(mode) {
      const d = getSelectedDealer();
      if (mode === 'PRO') {
        d.phone = d.licensedPhone;
        d.expiryYmd = 20261231;
        d.licenseKey = formatWasmLicenseKey(d.licensedPhone, 20261231);
      } else if (mode === 'TRIAL') {
        d.phone = d.licensedPhone;
        d.licenseKey = 'AR-000000 (미결제/만료)';
      } else if (mode === 'TAMPER') {
        d.phone = '010-9999-8282';
        d.licenseKey = formatWasmLicenseKey(d.licensedPhone, 20261231);
      }
      document.getElementById('dlrInputPhone').value = d.phone;
      syncDrmAndSnsUI();
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
    }

    function openSnsConnectModal(focusKey) {
      if (window.AR_SERVER && AR_SERVER.mode) return arSnsConnectClick(focusKey);
      const d = getSelectedDealer();
      const sns = d.snsAccounts || { ig: d.igUsername, yt: '', tt: '', fb: '' };
      document.getElementById('snsModalHeaderTitle').textContent = `[${d.name} ${d.title}] 내 4대 SNS 계정 연결 설정`;
      document.getElementById('snsInput_ig').value = sns.ig || '';
      document.getElementById('snsInput_yt').value = sns.yt || '';
      document.getElementById('snsInput_tt').value = sns.tt || '';
      document.getElementById('snsInput_fb').value = sns.fb || '';
      const notice = document.getElementById('snsModalNotice');
      if (notice) notice.classList.add('hidden');
      const modal = document.getElementById('snsConnectModal');
      if (modal) modal.classList.remove('hidden');
      if (focusKey && document.getElementById(`snsInput_${focusKey}`)) {
        setTimeout(() => document.getElementById(`snsInput_${focusKey}`).focus(), 80);
      }
    }

    function closeSnsConnectModal() {
      const modal = document.getElementById('snsConnectModal');
      if (modal) modal.classList.add('hidden');
    }

    function quickOAuthSimulate(channel) {
      const d = getSelectedDealer();
      const slug = d.token.replace('tok_', '');
      const defaults = {
        ig: `@${slug}_official_motors`,
        yt: `@${slug}_shorts_tv`,
        tt: `@${slug}_car_master`,
        fb: `${d.branch} ${d.name} ${d.title} 공식페이지`
      };
      const inputEl = document.getElementById(`snsInput_${channel}`);
      if (inputEl && !inputEl.value.trim()) {
        inputEl.value = defaults[channel];
      }
      const notice = document.getElementById('snsModalNotice');
      if (notice) {
        notice.classList.remove('hidden');
        notice.textContent = `OAuth 인증 토큰이 연결되었습니다. 아래 [저장 완료]를 눌러 반영하세요.`;
      }
    }

    function saveDealerSnsAccounts() {
      const d = getSelectedDealer();
      d.snsAccounts = {
        ig: document.getElementById('snsInput_ig').value.trim(),
        yt: document.getElementById('snsInput_yt').value.trim(),
        tt: document.getElementById('snsInput_tt').value.trim(),
        fb: document.getElementById('snsInput_fb').value.trim()
      };
      if (d.snsAccounts.ig) d.igUsername = d.snsAccounts.ig;
      saveDealerProfileToLocal(d);
      syncDrmAndSnsUI();
      closeSnsConnectModal();
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
    }

    function saveDealerProfileToLocal(d) {
      try {
        localStorage.setItem(
          'autoreels_my_dealer_profile_' + d.id,
          JSON.stringify({
            name: d.name,
            title: d.title,
            phone: d.phone,
            branch: d.branch,
            promoTag: d.promoTag,
            snsAccounts: d.snsAccounts
          })
        );
        const badge = document.getElementById('mobileSavedBadge');
        if (badge) {
          badge.textContent = `[${d.name} ${d.title}] 명함 정보가 로컬에 자동 저장됨`;
        }
      } catch (e) {}
    }

    function loadSavedDealerProfiles() {
      try {
        dealers.forEach((d) => {
          const raw = localStorage.getItem('autoreels_my_dealer_profile_' + d.id);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.name) d.name = parsed.name;
            if (parsed.title) d.title = parsed.title;
            if (parsed.phone) d.phone = parsed.phone;
            if (parsed.branch) d.branch = parsed.branch;
            if (parsed.promoTag) d.promoTag = parsed.promoTag;
            if (parsed.snsAccounts) d.snsAccounts = parsed.snsAccounts;
          }
        });
      } catch (e) {}
    }

    function updateCurrentDealerFromPreview() {
      const d = getSelectedDealer();
      d.name = document.getElementById('dlrInputName').value;
      d.title = document.getElementById('dlrInputTitle').value;
      d.phone = document.getElementById('dlrInputPhone').value;
      d.branch = document.getElementById('dlrInputBranch').value;
      d.promoTag = document.getElementById('dlrInputPromo').value;
      // 명함을 비우거나 채우면 명함 화면 유무·마지막 멘트가 바뀌므로 길이와 성우 녹음을 다시 맞춤
      const cardEmptyNow = arCardEmpty();
      if (cardEmptyNow !== d._cardEmptyLast) {
        d._cardEmptyLast = cardEmptyNow;
        applyVideoDurations();
      }
      if (typeof AudioEngine !== 'undefined' && AudioEngine.enabled && arVoiceAllowed()) {
        AudioEngine.masterBuffer = null;
        AudioEngine.masterDuration = 0;
        AudioEngine.schedulePrefetch();
      }
      document.getElementById('dlrCaptionTextarea').value = buildCaption(d);
      saveDealerProfileToLocal(d);
      syncDrmAndSnsUI();
      renderQuickSelector();
      renderAdminDealerList();
      renderDealerVariationSummary();
      syncTechPanel();
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
    }

    function copyDealerCaption() {
      const d = getSelectedDealer();
      const text = document.getElementById('dlrCaptionTextarea')?.value || buildCaption(d);
      const btn = document.getElementById('copyCaptionBtn');
      const notice = document.getElementById('saveStatusNotice');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (btn) btn.textContent = '복사 완료';
          if (notice) {
            notice.textContent = '본문과 해시태그가 복사되었습니다. 업로드 시 붙여넣기 하세요.';
          }
          setTimeout(() => {
            if (btn) btn.textContent = '본문 복사';
          }, 2500);
        }).catch(() => {});
      }
    }

    function syncScenePlanUI() {
      const themeObj = DIRECTOR_THEMES[campaign.themeId] || DIRECTOR_THEMES.royal;
      const themeName = themeObj.name || themeObj.label || '로얄 골드';
      const totalCuts = getTargetCutCount();
      const badgeEl = document.getElementById('activeSceneRecipeBadge');
      if (badgeEl) {
        badgeEl.textContent = `테마: ${themeName} · ${totalCuts}컷 AI 위젯`;
      }
      if (Array.isArray(campaign.scenePlan)) {
        for (let i = 0; i < totalCuts; i++) {
          const cutBadge = document.getElementById(`cutWidgetBadge${i}`);
          const wKey = campaign.scenePlan[i]?.widget || WIDGET_POOL[i % WIDGET_POOL.length];
          if (cutBadge) {
            cutBadge.textContent = WIDGET_LABELS[wKey] || wKey;
          }
        }
      }
      if (typeof renderVisualStoryboardTrack === 'function') {
        renderVisualStoryboardTrack();
      }
    }

    function proceduralRestyleCurrentScene() {
      const themeKeys = Object.keys(DIRECTOR_THEMES);
      const positions = ['top', 'center', 'bottom'];
      const cameras = [0, 1, 2, 3];
      const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
      const totalCuts = getTargetCutCount();

      if (RustWasmCore && typeof RustWasmCore.compute_scene_slot === 'function') {
        const firstSlot = RustWasmCore.compute_scene_slot(seed, 0) >>> 0;
        const themeIdx = (firstSlot >>> 24) & 0xff;
        campaign.themeId = themeKeys[themeIdx % themeKeys.length] || themeKeys[0];

        campaign.scenePlan = Array.from({ length: totalCuts }, (_, idx) => {
          const packed = RustWasmCore.compute_scene_slot(seed, idx) >>> 0;
          const wIdx = packed & 0xff;
          const pIdx = (packed >>> 8) & 0xff;
          const cIdx = (packed >>> 16) & 0xff;
          return {
            cut: idx + 1,
            widget: WIDGET_POOL[wIdx % WIDGET_POOL.length],
            pos: positions[pIdx % positions.length],
            cam: cameras[cIdx % cameras.length]
          };
        });
      } else {
        const otherThemes = themeKeys.filter((k) => k !== campaign.themeId);
        campaign.themeId = otherThemes[Math.floor(Math.random() * otherThemes.length)] || themeKeys[0];
        const shuffled = [...WIDGET_POOL].sort(() => Math.random() - 0.5);
        campaign.scenePlan = Array.from({ length: totalCuts }, (_, idx) => ({
          cut: idx + 1,
          widget: shuffled[idx % shuffled.length],
          pos: positions[(idx + Math.floor(Math.random() * 3)) % positions.length],
          cam: cameras[(idx + Math.floor(Math.random() * 4)) % cameras.length]
        }));
      }

      syncScenePlanUI();
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      window.__timelines['main'].seek((window.__timelines['main'].currentTime + mainDur / totalCuts) % mainDur);
    }

    function updateCustomCutCaptions() {
      const totalCuts = getTargetCutCount();
      if (!Array.isArray(campaign.ttsLines)) campaign.ttsLines = [];
      for (let i = 0; i < totalCuts; i++) {
        const el = document.getElementById(`cutSub${i}`);
        if (el) campaign.cutCaptions[i] = el.value;
        const ttsEl = document.getElementById(`cutTts${i}`);
        if (ttsEl) campaign.ttsLines[i] = ttsEl.value;
      }
      AudioEngine.masterBuffer = null;
      AudioEngine.masterDuration = 0;
      if (AudioEngine.enabled) AudioEngine.schedulePrefetch();
      if (typeof renderVisualStoryboardTrack === 'function') renderVisualStoryboardTrack();
      window.__timelines['main'].seek(window.__timelines['main'].currentTime);
    }

    function saveAdminAiKeys() {
      try {
        const oa = document.getElementById('adminOpenAiKeyInput')?.value.trim() || '';
        const gm = document.getElementById('adminGeminiKeyInput')?.value.trim() || '';
        localStorage.setItem('autoreels_admin_openai_key', oa);
        localStorage.setItem('autoreels_admin_gemini_key', gm);
        const statusEl = document.getElementById('adminAiKeyStatus');
        const badgeEl = document.getElementById('aiEngineStatusBadge');
        if (oa) {
          if (statusEl) statusEl.textContent = '전용 OpenAI (GPT-4o-mini) 키가 연결되었습니다.';
          if (badgeEl) badgeEl.textContent = 'OpenAI GPT-4o-mini 전용 엔진';
        } else if (gm) {
          if (statusEl) statusEl.textContent = '전용 Google Gemini 2.0 Flash 키가 연결되었습니다.';
          if (badgeEl) badgeEl.textContent = 'Gemini 2.0 Flash 전용 엔진';
        } else {
          if (statusEl) statusEl.textContent = '현재 상태: AutoReels 기본 클라우드 LLM 엔진 활성';
          if (badgeEl) badgeEl.textContent = '중앙 AI 엔진 활성';
        }
      } catch (e) {}
    }

    function loadAdminAiKeys() {
      try {
        const oa = localStorage.getItem('autoreels_admin_openai_key') || '';
        const gm = localStorage.getItem('autoreels_admin_gemini_key') || '';
        const oaEl = document.getElementById('adminOpenAiKeyInput');
        const gmEl = document.getElementById('adminGeminiKeyInput');
        if (oaEl) oaEl.value = oa;
        if (gmEl) gmEl.value = gm;
        saveAdminAiKeys();
      } catch (e) {}
    }

    // 클라이언트 측 차종/타겟 정밀 파서 (예: "30대 여성 , 그랜저" 입력 시 차종 즉시 변경 & 30대 연령 오인 방지)
    function parsePromptVehicleAndTargetClient(rawPrompt) {
      const text = String(rawPrompt || '').trim();
      const carMap = [
        { kw: ['그랜저', '그랜져', 'gn7'], vehicle: '디 올 뉴 그랜저 하이브리드', discountNum: 450, discount: '월 48만원대 · 캘리그라피 즉시배정' },
        { kw: ['싼타페', '산타페'], vehicle: '디 올 뉴 싼타페 하이브리드', discountNum: 420, discount: '월 44만원대 · 선점재고 즉시출고' },
        { kw: ['쏘렌토', '소렌토'], vehicle: '2026 쏘렌토 하이브리드', discountNum: 480, discount: '월 46만원대 · 3일 즉시출고' },
        { kw: ['카니발', '하이리무진'], vehicle: '더 뉴 카니발 하이브리드 9인승', discountNum: 390, discount: '월 52만원대 · 부가세 환급 가능' },
        { kw: ['스포티지'], vehicle: '더 뉴 스포티지 하이브리드', discountNum: 310, discount: '월 36만원대 · 사회초년생·여성 추천' },
        { kw: ['아반떼'], vehicle: '더 뉴 아반떼 CN7 인스퍼레이션', discountNum: 220, discount: '월 27만원대 · 첫차 베스트셀러' },
        { kw: ['캐스퍼'], vehicle: '캐스퍼 일렉트릭 인스퍼레이션', discountNum: 340, discount: '월 24만원대 · 보조금 추가지원' },
        { kw: ['코나'], vehicle: '디 올 뉴 코나 하이브리드', discountNum: 280, discount: '월 32만원대 · 여성 오너 선호 1위' },
        { kw: ['투싼'], vehicle: '더 뉴 투싼 하이브리드', discountNum: 330, discount: '월 37만원대 · 즉시출고 특판' },
        { kw: ['팰리세이드', '펠리세이드'], vehicle: '디 올 뉴 팰리세이드 하이브리드', discountNum: 510, discount: '월 56만원대 · 패밀리 플래그십' },
        { kw: ['gv80'], vehicle: '제네시스 GV80 페이스리프트', discountNum: 620, discount: '월 78만원대 · 법인·사업자 비용처리' },
        { kw: ['gv70'], vehicle: '제네시스 GV70 스포츠 패키지', discountNum: 540, discount: '월 64만원대 · 3040 워너비 SUV' },
        { kw: ['g80'], vehicle: '제네시스 더 뉴 G80', discountNum: 590, discount: '월 69만원대 · 프리미엄 세단 특판' },
        { kw: ['bmw', '520i', '5시리즈'], vehicle: 'BMW 520i M Sport 패키지', discountNum: 1150, discount: '월 59만원대 · 즉시출고 가능' },
        { kw: ['벤츠', 'e클래스'], vehicle: '벤츠 E200 아방가르드', discountNum: 1080, discount: '월 68만원대 · 공식 프로모션' },
        { kw: ['테슬라', '모델y'], vehicle: '테슬라 Model Y RWD', discountNum: 650, discount: '월 49만원대 · 전기차 보조금 확정' }
      ];
      const lower = text.toLowerCase();
      let matchedCar = null;
      for (const item of carMap) {
        if (item.kw.some((k) => lower.includes(k))) {
          matchedCar = item;
          break;
        }
      }
      const ageMatch = text.match(/(20대|30대|40대|50대|60대)\s*(여성|여자|남성|남자|주부|직장인| 워킹맘|대표님|사장님|부부)?/);
      const targetPersona = ageMatch ? ageMatch[0].trim() : text.includes('여성') ? '여성 오너 맞춤' : '';
      const cleanedForStock = text.replace(/(20|30|40|50|60)\s*대\s*(여성|여자|남성|남자|주부|직장인|워킹맘|초반|중반|후반)?/g, '');
      const stockMatch = cleanedForStock.match(/(?:재고|선점|물량|한정|딱)\s*(\d{1,2})\s*대|([1-9])\s*대\s*(?:남음|한정|즉시|출고)/);
      const stockNum = stockMatch ? (stockMatch[1] || stockMatch[2]) : '3';
      return { matchedCar, targetPersona, stockNum };
    }

    async function generateStoryboardFromPrompt() {
      const promptEl = document.getElementById('aiPromptInput');
      const excludeEl = document.getElementById('aiExcludeInput');
      const btnEl = document.getElementById('aiGenBtn');
      const noticeEl = document.getElementById('aiGenNotice');
      const raw = (promptEl?.value || '').trim();
      const excludeRaw = (excludeEl?.value || '').trim();
      const stripExcludedLocal = (txt) => {
        let out = typeof indWord === 'function' ? indWord(String(txt || '')) : String(txt || '');
        if (!excludeRaw) return out;
        const terms = excludeRaw.split(/[,，/\n]+/).map((s) => s.trim()).filter(Boolean);
        terms.forEach((term) => {
          const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          out = out.replace(new RegExp(esc, 'gi'), '');
        });
        return out.replace(/\s{2,}/g, ' ').trim();
      };
      const d = getSelectedDealer();
      const totalCuts = getTargetCutCount();

      // 사용자 클릭 제스처 시점에 오디오/TTS 엔진을 즉시 활성화하여 음성이 100% 나오도록 보장
      if (!AudioEngine.enabled) {
        toggleAudioMaster(true);
      } else {
        AudioEngine.ensureContext();
      }

      // 1) 클라이언트에서 먼저 차종('그랜저' 등)을 즉시 인식하여 반영
      const parsedLocal = IND.key === 'auto' ? parsePromptVehicleAndTargetClient(raw) : {};
      if (parsedLocal.matchedCar) {
        campaign.vehicle = parsedLocal.matchedCar.vehicle;
        campaign.discountNum = parsedLocal.matchedCar.discountNum;
        campaign.discount = parsedLocal.matchedCar.discount;
      }

      if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = `AI ${totalCuts}컷 영상·성우 생성 중...`;
      }
      if (noticeEl) {
        noticeEl.classList.remove('hidden');
        noticeEl.textContent = `중앙 AI 엔진이 [${raw || campaign.vehicle}] 맞춤 ${totalCuts}컷 영상 대본·성우 음성·카톡 대화를 생성 중입니다...`;
      }

      try {
        const adminOpenAiKey = localStorage.getItem('autoreels_admin_openai_key') || '';
        const adminGeminiKey = localStorage.getItem('autoreels_admin_gemini_key') || '';

        const response = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: raw,
            exclude: excludeRaw,
            vehicle: campaign.vehicle,
            discountNum: campaign.discountNum,
            discount: campaign.discount,
            // 아직 바꾸지 않은 예시 매장 정보는 빼고 보냄 (자동차는 그대로)
            dealerName: arDealerForCopy(d).name,
            dealerTitle: arDealerForCopy(d).title,
            dealerBranch: arDealerForCopy(d).branch,
            dealerPromo: arDealerForCopy(d).promoTag,
            cutCount: totalCuts,
            bullets: campaign.bullets,
            // 오늘의 주제로 만든 대본이면 주제(계기·이유)를 같이 보내 "계기 → 손님 마음 → 우리 가게" 이야기로 이어지게 함
            topic: (window.arTodayTopic && raw === window.arTodayTopic.prompt) ? { title: window.arTodayTopic.title, why: window.arTodayTopic.why, prompt: window.arTodayTopic.prompt } : null,
            industry: IND.key,
            industryInfo: IND.key === 'auto' ? null : { name: IND.name, role: IND.role, product: IND.product, cta: IND.cta, aiRole: IND.aiRole, caution: IND.caution, place: IND.place },
            adminOpenAiKey,
            adminGeminiKey
          })
        });

        const result = await response.json();
        if (!response.ok || !result.ok || !result.data) {
          throw new Error(result.error || 'AI 서버 응답 오류');
        }

        // 대본 3안 저장 (예전 서버 응답이면 data 1개만)
        const variants = Array.isArray(result.variants) && result.variants.length ? result.variants : [result.data];
        arScriptVariants.list = variants;
        arScriptVariants.index = 0;
        arScriptVariants.strip = stripExcludedLocal;
        applyAiScriptToCampaign(variants[0], d, stripExcludedLocal);
        renderScriptVariantPicker();
      } catch (err) {
        arScriptVariants.list = [];
        renderScriptVariantPicker();
        if (IND.key !== 'auto') {
          // 자동차가 아닌 업종: 실패하면 지금 상품 프리셋 대본으로 되돌림
          if (campaign.presetKey && (AR_INDUSTRY_PRESETS[IND.key] || {})[campaign.presetKey]) applyIndustryPreset(campaign.presetKey);
          if (noticeEl) noticeEl.textContent = `AI 대본을 만들지 못해 기본 대본으로 채웠습니다. (${err.message || '연결 오류'})`;
          return;
        }
        arFillAutoScriptOffline(parsedLocal, d);
      } finally {
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.textContent = 'AI로 다시 만들기';
        }
      }

      arFinishScriptApply(totalCuts);
    }
