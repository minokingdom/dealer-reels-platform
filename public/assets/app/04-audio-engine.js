// AutoReels — 04-audio-engine.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // 릴스·숏츠 음원(MP3 불러오기 + 내장 비트) & 한국어 AI 성우(TTS) 엔진
    // ============================================================================
    const AudioEngine = {
      ctx: null,
      masterGain: null,
      bgmGain: null,
      ttsGain: null,
      streamDest: null,
      enabled: false,
      bgmStyle: 'showroom',
      ttsVoice: '4e118bfbb83e401c84699c09b5f08257', // Fish Audio 보이스 ID | 'off'
      ttsSpeed: 1.1,
      voiceListLoaded: false,
      bgmTimer: null,
      stepIndex: 0,
      lastSpokenCut: -1,
      customBgmAudioEl: null,
      customBgmSourceNode: null,
      customBgmUrl: null,

      ensureContext() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return null;
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 0.95;
          this.bgmGain = this.ctx.createGain();
          this.bgmGain.gain.value = 0.42; // 성우 음성이 또렷하게 들리도록 BGM은 한 단계 낮게
          this.ttsGain = this.ctx.createGain();
          this.ttsGain.gain.value = 1.0;

          this.bgmGain.connect(this.masterGain);
          this.ttsGain.connect(this.masterGain);
          // BGM과 성우가 겹칠 때 소리가 깨지지 않도록 출력 직전에 리미터를 둠
          this.limiter = this.ctx.createDynamicsCompressor();
          this.limiter.threshold.value = -8;
          this.limiter.knee.value = 6;
          this.limiter.ratio.value = 12;
          this.limiter.attack.value = 0.003;
          this.limiter.release.value = 0.15;
          this.masterGain.connect(this.limiter);
          this.limiter.connect(this.ctx.destination);

          if (typeof this.ctx.createMediaStreamDestination === 'function') {
            this.streamDest = this.ctx.createMediaStreamDestination();
            this.limiter.connect(this.streamDest);
          }

          // 하이햇·클랩용 화이트노이즈 버퍼
          const len = Math.floor(this.ctx.sampleRate * 0.5);
          this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
          const ch = this.noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
        }
        if (this.ctx && this.ctx.state !== 'running') {
          this.ctx.resume().catch(() => {});
        }
        return this.ctx;
      },

      // 사용자가 직접 불러온 릴스·숏츠 MP3/오디오 파일 세팅
      loadCustomBgmFile(file) {
        const ctx = this.ensureContext();
        if (this.customBgmUrl) {
          URL.revokeObjectURL(this.customBgmUrl);
        }
        this.customBgmUrl = URL.createObjectURL(file);
        if (!this.customBgmAudioEl) {
          this.customBgmAudioEl = new Audio();
          this.customBgmAudioEl.loop = true;
          this.customBgmAudioEl.crossOrigin = 'anonymous';
          if (ctx) {
            try {
              this.customBgmSourceNode = ctx.createMediaElementSource(this.customBgmAudioEl);
              this.customBgmSourceNode.connect(this.bgmGain);
            } catch (e) {}
          }
        }
        this.customBgmAudioEl.src = this.customBgmUrl;
        this.customBgmAudioEl.volume = 0.65;
        this.bgmStyle = 'custom_mp3';

        const opt = document.getElementById('customBgmOption');
        const sel = document.getElementById('bgmStyleSelect');
        if (opt) {
          opt.classList.remove('hidden');
          opt.textContent = `🎵 내 음원: ${file.name.slice(0, 22)}`;
        }
        if (sel) sel.value = 'custom_mp3';

        const statusText = document.getElementById('customBgmStatusText');
        if (statusText) {
          statusText.classList.remove('hidden');
          statusText.textContent = `✅ 릴스·숏츠 음원 [${file.name}] 로드 완료! 영상 재생 및 추출 시 이 음악이 그대로 합성됩니다.`;
        }

        if (!this.enabled) {
          toggleAudioMaster(true);
        } else {
          this.startBgmLoop();
        }
      },

      // ★ 내장 릴스·숏츠 스타일 BGM 엔진 (코드 패드 + 베이스라인 + 아르페지오 리프 + 킥/클랩/하이햇)
      //   - AudioContext 시간 기준 룩어헤드 스케줄링으로 끊김 없이 재생
      BGM_STYLES: {
        // 4마디 코드 진행 (각 코드: [베이스 루트, 코드톤...] Hz)
        showroom: { bpm: 118, wave: 'sawtooth', cutoff: 1400, kick: [0, 4, 8, 12], clap: [4, 12], hat: 'offbeat',
          chords: [[110.0, 220.0, 261.63, 329.63, 392.0], [87.31, 174.61, 220.0, 261.63, 329.63],
                   [130.81, 261.63, 329.63, 392.0, 493.88], [98.0, 196.0, 246.94, 293.66, 392.0]] },
        urban: { bpm: 140, wave: 'square', cutoff: 900, kick: [0, 3, 6, 10, 11], clap: [8], hat: 'trap',
          chords: [[73.42, 146.83, 174.61, 220.0, 293.66], [77.78, 155.56, 196.0, 233.08, 311.13],
                   [65.41, 130.81, 155.56, 196.0, 261.63], [69.3, 138.59, 174.61, 207.65, 277.18]] },
        bright: { bpm: 112, wave: 'triangle', cutoff: 2600, kick: [0, 8, 10], clap: [4, 12], hat: 'eighth',
          chords: [[87.31, 174.61, 220.0, 261.63, 329.63], [98.0, 196.0, 246.94, 293.66, 349.23],
                   [82.41, 164.81, 207.65, 246.94, 329.63], [110.0, 220.0, 261.63, 329.63, 392.0]] },
        luxury: { bpm: 90, wave: 'sine', cutoff: 1800, kick: [0, 10], clap: [8], hat: 'sparse',
          chords: [[73.42, 220.0, 277.18, 329.63, 440.0], [61.74, 185.0, 246.94, 293.66, 369.99],
                   [82.41, 196.0, 246.94, 329.63, 392.0], [55.0, 164.81, 220.0, 277.18, 329.63]] },
        // ---- 추가 음악 9종 ----
        lofi: { bpm: 80, wave: 'triangle', cutoff: 900, kick: [0, 7, 10], clap: [4, 12], hat: 'eighth', swing: 0.22, bass: 'sub',
          arpWave: 'sine', arpEvery: 4, arpGain: 0.06, padGain: 0.12,
          chords: [[87.31, 174.61, 220.0, 261.63, 329.63], [82.41, 164.81, 196.0, 246.94, 293.66],
                   [73.42, 146.83, 174.61, 220.0, 261.63], [65.41, 130.81, 164.81, 196.0, 246.94]] },
        vlog: { bpm: 104, wave: 'triangle', cutoff: 2200, kick: [0, 8], clap: [4, 12], hat: 'eighth', bass: 'saw',
          arpWave: 'triangle', arpEvery: 1, arpGain: 0.045, arp: [1, 3, 2, 4, 3, 2, 4, 3],
          chords: [[65.41, 261.63, 329.63, 392.0, 523.25], [98.0, 246.94, 293.66, 392.0, 493.88],
                   [110.0, 261.63, 329.63, 440.0, 523.25], [87.31, 261.63, 349.23, 440.0, 523.25]] },
        cinema: { bpm: 70, wave: 'sawtooth', cutoff: 700, kick: [0], kickGain: 1.0, clap: [], hat: 'none', bass: 'sub', padGain: 0.16,
          arpWave: 'sine', arpEvery: 4, arpGain: 0.07, arp: [3, 4, 3, 2],
          chords: [[73.42, 146.83, 174.61, 220.0, 293.66], [58.27, 116.54, 146.83, 174.61, 233.08],
                   [87.31, 174.61, 220.0, 261.63, 349.23], [65.41, 130.81, 164.81, 196.0, 261.63]] },
        drive: { bpm: 100, wave: 'sawtooth', cutoff: 1900, kick: [0, 4, 8, 12], clap: [4, 12], hat: 'offbeat', bass: 'eighth',
          arpWave: 'square', arpEvery: 1, arpGain: 0.03, arp: [1, 2, 3, 4, 3, 2, 1, 2],
          chords: [[110.0, 220.0, 261.63, 329.63, 440.0], [87.31, 174.61, 220.0, 261.63, 349.23],
                   [65.41, 130.81, 164.81, 196.0, 261.63], [98.0, 196.0, 246.94, 293.66, 392.0]] },
        edm: { bpm: 128, wave: 'sawtooth', cutoff: 3000, kick: [0, 4, 8, 12], clap: [4, 12], hat: 'offbeat', bass: 'offbeat', padGain: 0.1,
          arpWave: 'sawtooth', arpEvery: 1, arpGain: 0.035, arp: [1, 4, 2, 4, 3, 4, 2, 4],
          chords: [[92.5, 185.0, 220.0, 277.18, 369.99], [73.42, 146.83, 185.0, 220.0, 293.66],
                   [110.0, 220.0, 277.18, 329.63, 440.0], [82.41, 164.81, 207.65, 246.94, 329.63]] },
        funk: { bpm: 108, wave: 'square', cutoff: 1500, kick: [0, 3, 8, 10], clap: [4, 12], hat: 'sixteenth', swing: 0.1, bass: 'funk',
          arpWave: 'square', arpEvery: 4, arpGain: 0.04, arp: [2, 3, 2, 4],
          chords: [[82.41, 164.81, 196.0, 246.94, 293.66], [110.0, 220.0, 261.63, 329.63, 392.0],
                   [82.41, 164.81, 196.0, 246.94, 293.66], [123.47, 246.94, 293.66, 369.99, 440.0]] },
        ballad: { bpm: 72, wave: 'sine', cutoff: 1500, kick: [0, 10], kickGain: 0.6, clap: [8], hat: 'sparse', bass: 'sub', padGain: 0.12,
          arpWave: 'sine', arpEvery: 2, arpGain: 0.09, arp: [1, 2, 3, 4, 3, 2, 1, 2],
          chords: [[65.41, 261.63, 329.63, 392.0, 523.25], [61.74, 246.94, 293.66, 392.0, 493.88],
                   [55.0, 220.0, 261.63, 329.63, 440.0], [87.31, 220.0, 261.63, 349.23, 440.0]] },
        news: { bpm: 120, wave: 'square', cutoff: 1200, kick: [0, 6, 8, 14], clap: [4, 12], hat: 'sixteenth', bass: 'saw',
          arpWave: 'square', arpEvery: 2, arpGain: 0.04, arp: [1, 1, 3, 1, 4, 1, 3, 2],
          chords: [[65.41, 130.81, 155.56, 196.0, 261.63], [103.83, 207.65, 261.63, 311.13, 415.3],
                   [77.78, 155.56, 196.0, 233.08, 311.13], [116.54, 233.08, 293.66, 349.23, 466.16]] },
        jazz: { bpm: 92, wave: 'sine', cutoff: 1600, kick: [0, 10], kickGain: 0.55, clap: [], hat: 'eighth', swing: 0.28, bass: 'walk',
          arpWave: 'sine', arpEvery: 4, arpGain: 0.06, arp: [2, 4, 3, 1],
          chords: [[73.42, 146.83, 174.61, 220.0, 261.63], [98.0, 196.0, 246.94, 293.66, 349.23],
                   [65.41, 130.81, 164.81, 196.0, 246.94], [110.0, 220.0, 277.18, 329.63, 392.0]] }
      },
      // 디자인 묶음별로 어울리는 기본 음악 (직접 불러온 음원·BGM 끄기는 바꾸지 않음)
      BGM_LABELS: {
        showroom: 'Chill House 쇼룸', urban: 'Phonk / Trap', bright: 'Upbeat City Pop', luxury: 'Luxury Lounge',
        lofi: 'Lo-fi 감성', vlog: 'Acoustic Pop 브이로그', cinema: 'Cinematic 트레일러', drive: 'Synthwave 드라이브',
        edm: 'EDM 페스티벌', funk: 'Funk 그루브', ballad: 'Piano 발라드', news: 'Breaking News', jazz: 'Jazz 라운지'
      },
      nextStepTime: 0,

      scheduleStep(step, when) {
        const ctx = this.ctx;
        const S = this.BGM_STYLES[this.bgmStyle] || this.BGM_STYLES.showroom;
        const stepDur = 60 / S.bpm / 4;
        const s16 = step % 16;
        const bar = Math.floor(step / 16) % 4;
        const chord = S.chords[bar];
        const out = this.bgmGain;
        if (S.swing && s16 % 4 === 2) when += S.swing * stepDur;

        // 1) 킥
        if (S.kick.includes(s16)) {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(150, when);
          o.frequency.exponentialRampToValueAtTime(42, when + 0.14);
          g.gain.setValueAtTime(S.kickGain || 0.9, when);
          g.gain.exponentialRampToValueAtTime(0.001, when + 0.28);
          o.connect(g); g.connect(out);
          o.start(when); o.stop(when + 0.3);
        }

        // 2) 클랩/스네어 (노이즈)
        if (S.clap.includes(s16) && this.noiseBuf) {
          const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
          n.buffer = this.noiseBuf;
          f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 1.4;
          g.gain.setValueAtTime(0.13, when);
          g.gain.exponentialRampToValueAtTime(0.001, when + 0.09);
          n.connect(f); f.connect(g); g.connect(out);
          n.start(when); n.stop(when + 0.1);
        }

        // 3) 하이햇 (노이즈 하이패스)
        const hatOn =
          S.hat === 'offbeat' ? s16 % 4 === 2 :
          S.hat === 'eighth' ? s16 % 2 === 0 :
          S.hat === 'trap' || S.hat === 'sixteenth' ? true :
          S.hat === 'none' ? false :
          s16 % 8 === 4;
        if (hatOn && this.noiseBuf) {
          const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
          n.buffer = this.noiseBuf;
          f.type = 'highpass'; f.frequency.value = 7000;
          const v = S.hat === 'trap' ? (s16 % 2 === 0 ? 0.045 : 0.025) : 0.05;
          g.gain.setValueAtTime(v, when);
          g.gain.exponentialRampToValueAtTime(0.001, when + 0.035);
          n.connect(f); f.connect(g); g.connect(out);
          n.start(when); n.stop(when + 0.06);
        }

        // 4) 코드 패드 (마디 시작마다 1마디 길이로 지속)
        if (s16 === 0) {
          const barDur = stepDur * 16;
          const f = ctx.createBiquadFilter(), g = ctx.createGain();
          f.type = 'lowpass'; f.frequency.value = S.cutoff; f.Q.value = 0.6;
          g.gain.setValueAtTime(0.0001, when);
          g.gain.linearRampToValueAtTime(S.padGain || 0.11, when + 0.25);
          g.gain.setValueAtTime(S.padGain || 0.11, when + barDur - 0.3);
          g.gain.linearRampToValueAtTime(0.0001, when + barDur);
          f.connect(g); g.connect(out);
          chord.slice(1, 4).forEach((hz, i) => {
            [-6, 6].forEach((detune) => {
              const o = ctx.createOscillator();
              o.type = S.wave === 'square' ? 'sawtooth' : S.wave;
              o.frequency.value = hz;
              o.detune.value = detune + i;
              o.connect(f);
              o.start(when); o.stop(when + barDur + 0.05);
            });
          });
        }

        // 5) 베이스라인
        const bassMode = S.bass || (this.bgmStyle === 'urban' ? 'sub' : 'saw');
        const funkHits = [0, 3, 6, 8, 10, 14];
        const bassHit =
          bassMode === 'sub' ? S.kick.includes(s16) || (S.kick.length < 2 && s16 === 8) :
          bassMode === 'offbeat' ? s16 % 4 === 2 :
          bassMode === 'eighth' ? s16 % 2 === 0 :
          bassMode === 'funk' ? funkHits.includes(s16) :
          bassMode === 'walk' ? s16 % 4 === 0 :
          (s16 % 4 === 0 || s16 % 4 === 3);
        if (bassHit) {
          const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
          o.type = bassMode === 'sub' || bassMode === 'walk' ? 'sine' : bassMode === 'funk' ? 'square' : 'sawtooth';
          o.frequency.value = bassMode === 'walk' ? chord[(s16 / 4) % 4] / (s16 === 0 ? 1 : 2) : chord[0];
          f.type = 'lowpass'; f.frequency.value = bassMode === 'funk' ? 700 : 420;
          const len = bassMode === 'sub' ? stepDur * 3.5 : bassMode === 'walk' ? stepDur * 3.2 : bassMode === 'eighth' || bassMode === 'offbeat' ? stepDur * 1.2 : stepDur * 1.6;
          g.gain.setValueAtTime(bassMode === 'funk' ? 0.3 : 0.38, when);
          g.gain.exponentialRampToValueAtTime(0.001, when + len);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(when); o.stop(when + len + 0.02);
        }

        // 6) 멜로디 리프 (음악마다 박자·음색이 다름)
        const every = S.arpEvery === undefined ? 2 : S.arpEvery;
        if (every && s16 % every === 0) {
          const pattern = S.arp || [1, 2, 3, 4, 3, 2, 4, 2];
          const hz = chord[pattern[(s16 / every) % pattern.length]] * 2;
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = S.arpWave || (this.bgmStyle === 'luxury' ? 'sine' : 'triangle');
          o.frequency.value = hz;
          const ag = S.arpGain || (this.bgmStyle === 'urban' ? 0.05 : 0.075);
          const al = stepDur * Math.max(1.8, every * 0.9);
          g.gain.setValueAtTime(0.0001, when);
          g.gain.linearRampToValueAtTime(ag, when + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, when + al);
          o.connect(g); g.connect(out);
          o.start(when); o.stop(when + al + 0.05);
        }
      },

      // 하위 호환: 단일 스텝 즉시 재생
      playBgmStep() {
        if (!this.enabled || this.bgmStyle === 'off' || this.bgmStyle === 'custom_mp3') return;
        const ctx = this.ensureContext();
        if (!ctx) return;
        this.scheduleStep(this.stepIndex++, ctx.currentTime + 0.02);
      },

      startBgmLoop() {
        this.stopBgmLoop();
        if (!this.enabled || this.bgmStyle === 'off') return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const resumed = ctx.state === 'running' ? Promise.resolve() : ctx.resume().catch(() => {});

        // 내가 불러온 릴스·숏츠 MP3: 컨텍스트 재개 후 재생 (재개 전 재생 시 무음 방지)
        if (this.bgmStyle === 'custom_mp3' && this.customBgmAudioEl) {
          resumed.then(() => this.customBgmAudioEl.play().catch(() => {}));
          return;
        }

        this.stepIndex = 0;
        resumed.then(() => {
          if (!this.enabled || this.bgmStyle === 'off' || this.bgmStyle === 'custom_mp3') return;
          this.nextStepTime = ctx.currentTime + 0.06;
          this.bgmTimer = setInterval(() => {
            if (!this.enabled) return;
            const S = this.BGM_STYLES[this.bgmStyle] || this.BGM_STYLES.showroom;
            const stepDur = 60 / S.bpm / 4;
            if (!isPlaying) {
              this.nextStepTime = ctx.currentTime + 0.06;
              return;
            }
            // 탭이 백그라운드였다가 돌아온 경우 밀린 스텝 건너뛰기
            if (this.nextStepTime < ctx.currentTime - 0.2) this.nextStepTime = ctx.currentTime + 0.05;
            while (this.nextStepTime < ctx.currentTime + 0.14) {
              this.scheduleStep(this.stepIndex++, this.nextStepTime);
              this.nextStepTime += stepDur;
            }
          }, 25);
        });
      },

      stopBgmLoop() {
        if (this.bgmTimer) {
          clearInterval(this.bgmTimer);
          this.bgmTimer = null;
        }
        if (this.customBgmAudioEl) {
          try {
            this.customBgmAudioEl.pause();
          } catch (e) {}
        }
      },

      // ------------------------------------------------------------------------
      // ★ 한국어 AI 성우(TTS): Fish Audio (/api/tts 서버 프록시)
      //   - MP3를 받아 AudioBuffer로 디코딩한 뒤 ttsGain에 연결하므로
      //     스피커 재생과 영상 추출 오디오 트랙에 같은 음성이 들어갑니다.
      //   - Fish Audio를 쓸 수 없을 때(키 미설정, 오프라인)만 브라우저 음성으로 대체합니다.
      //     브라우저 음성은 추출 영상에 녹음되지 않습니다.
      // ------------------------------------------------------------------------
      ttsCache: new Map(),
      ttsSeconds: new Map(), // 성우·문장별 실제 음성 길이(초)
      ttsPrefetchTimer: null,
      masterBuffer: null,
      masterSource: null,
      masterSourceGain: null,
      masterPeak: 1.0,
      masterDuration: 0,
      lastTimelineT: 0,
      ttsSource: null,
      ttsSourceGain: null,
      ttsSpeakToken: 0,
      ttsProvider: 'unknown', // 'fish' | 'browser' | 'unknown'
      ttsLastError: '',
      ttsBlockedUntil: 0,

      getCutNarration(cutIdx) {
        const d = getSelectedDealer();
        const totalCuts = getTargetCutCount();
        let text = '';
        if (cutIdx < totalCuts) {
          text =
            (campaign.ttsLines && campaign.ttsLines[cutIdx]) ||
            (campaign.cutCaptions && campaign.cutCaptions[cutIdx]) ||
            campaign.hook;
        } else {
          // 마지막 엔딩 카드(명함/매장) 클로징 멘트: 매장 중심 업종은 매장명으로, 인물 중심 업종은 호칭으로 안내
          // 명함을 아직 안 채웠으면 이름 없이 안내만
          if (arCardEmpty()) return ''; // 명함 화면이 없으면 마지막 멘트도 없음
          const who = (IND.outroMode === 'store' ? [d.name] : [d.name, d.title]).filter(Boolean).join(' ');
          const ask = `댓글에 ${IND.cta || (IND.outroMode === 'store' ? '예약' : '문의')} 남겨주세요!`;
          text = who ? `${who}입니다. ${ask}` : ask;
        }
        return indWord(String(text || ''))
          .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
          .replace(/[✔🚨✨💰🔑🏢📞🎁💬★]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 200);
      },

      setTtsProvider(provider, errorCode) {
        this.ttsProvider = provider;
        this.ttsLastError = errorCode || '';
        const badge = document.getElementById('ttsProviderBadge');
        if (!badge) return;
        if (provider === 'fish' && this.ttsFreeModel) {
          badge.textContent = '성우: Fish Audio 무료 모델 (크레딧 부족 · 음질 낮음)';
          badge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#f5a524]';
        } else if (provider === 'fish') {
          badge.textContent = '성우: Fish Audio';
          badge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#4cc38a]';
        } else if (provider === 'browser') {
          const reason =
            errorCode === 'fish_api_key_missing' ? 'API 키 미설정' :
            errorCode === 'http_401' ? 'API 키 오류' :
            errorCode === 'http_402' ? '크레딧 부족' :
            errorCode === 'offline' ? '서버 없이 실행 중' :
            errorCode === 'quota' ? '이번 사용량 한도 도달' : '연결 실패';
          badge.textContent = `성우: 브라우저 음성 (Fish Audio ${reason} · 추출 영상에는 녹음 안 됨)`;
          badge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#f5a524]';
        } else {
          badge.textContent = '성우: 준비 중';
          badge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#85858b]';
        }
      },

      // 서버가 알려 준 Fish Audio 모델 이름 확인 (/api/tts 의 X-TTS-Model, /api/tts-script 의 model)
      // 유료 크레딧이 떨어지면 서버가 무료 모델로 바꿔 음질이 기계음처럼 떨어지므로,
      // 배지를 바꾸고 관리자 모드에서는 한 번 알림을 띄움 (사장님·고객 화면에는 알림을 띄우지 않음)
      ttsFreeModel: false,
      ttsFreeNotified: false,
      noteTtsModel(model) {
        if (!model) return;
        const free = /free/i.test(String(model));
        if (free === this.ttsFreeModel) return;
        this.ttsFreeModel = free;
        if (this.ttsProvider === 'fish') this.setTtsProvider('fish');
        if (free) {
          console.warn('[AutoReels] Fish Audio 유료 크레딧 부족: 무료 모델로 음성을 만들고 있습니다 (' + model + ')');
          if (!this.ttsFreeNotified && typeof isAdminMode !== 'undefined' && isAdminMode && typeof arToast === 'function') {
            this.ttsFreeNotified = true;
            arToast('Fish Audio 크레딧이 부족해 성우가 무료 모델(음질 낮음)로 바뀌었습니다. fish.audio에서 충전하면 바로 고품질로 돌아갑니다.');
          }
        }
      },

      ttsKey(text) {
        return `${this.ttsVoice}@${this.ttsSpeed}|${text}`;
      },

      // Fish Audio 한국어 성우 목록을 받아 선택 상자에 채움 (한 번만)
      async loadVoiceList() {
        if (this.voiceListLoaded || !window.location.protocol.startsWith('http')) return;
        this.voiceListLoaded = true;
        try {
          const res = await fetch('/api/tts-voices');
          if (!res.ok) throw new Error(`http_${res.status}`);
          const body = await res.json();
          const sel = document.getElementById('ttsVoiceSelect');
          if (!sel || !Array.isArray(body.voices) || body.voices.length === 0) return;
          const offOpt = sel.querySelector('option[value="off"]');
          body.voices.forEach((v) => {
            let opt = sel.querySelector(`option[value="${v.id}"]`);
            if (!opt) {
              opt = document.createElement('option');
              opt.value = v.id;
              sel.insertBefore(opt, offOpt);
            }
            opt.textContent = v.title;
          });
        } catch (e) {
          this.voiceListLoaded = false; // 다음에 다시 시도
        }
      },

      // Fish Audio 요청은 한 번에 2개까지만 보냄 (한꺼번에 몰리면 일부가 거절되어 음성이 빠짐)
      ttsActive: 0,
      ttsWaiters: [],
      async runTtsRequest(fn) {
        if (this.ttsActive >= 2) await new Promise((resolve) => this.ttsWaiters.push(resolve));
        this.ttsActive++;
        try {
          return await fn();
        } finally {
          this.ttsActive--;
          const next = this.ttsWaiters.shift();
          if (next) next();
        }
      },

      // 문장 하나의 Fish Audio 음성을 받아 AudioBuffer로 디코딩 (성우·문장별 캐시)
      fetchTtsBuffer(text) {
        if (!arVoiceAllowed()) return Promise.reject(new Error('voice_locked'));
        const key = this.ttsKey(text);
        if (this.ttsCache.has(key)) return this.ttsCache.get(key);
        // 대본 전체 녹음이 아직 시작 전이면(대본을 고친 직후 등) 문장별로 따로 녹음하지 않고 전체 녹음을 먼저 시작함
        //   (문장마다 따로 녹음하면 톤·속도가 달라 끊어 읽은 티가 남. 문장별 녹음은 전체 녹음이 실패했을 때만)
        if (!this.scriptPending && Date.now() >= this.ttsBlockedUntil && this.enabled) this.prefetchTtsBuffers();
        // 대본 전체 녹음이 진행 중이면 그 결과를 기다려 같은 녹음에서 잘라낸 음성을 씀
        if (this.scriptPending) {
          return this.scriptPending.then(() => this.ttsCache.get(key) || this.fetchLineBuffer(text));
        }
        return this.fetchLineBuffer(text);
      },

      // ★ 대본 전체를 한 번에 녹음해 문장별로 잘라 둠 (/api/tts-script)
      //   문장마다 따로 녹음하면 톤·속도·크기가 서로 달라 이어 붙인 티가 나므로,
      //   한 호흡으로 녹음한 하나의 음성에서 컷별 구간만 잘라 씁니다.
      scriptCache: new Map(),
      scriptPending: null,
      fetchScriptNarration(lines) {
        const voice = this.ttsVoice;
        const speed = this.ttsSpeed;
        const scriptKey = `${voice}@${speed}|${lines.join('\n')}`;
        if (this.scriptCache.has(scriptKey)) return this.scriptCache.get(scriptKey);

        const ctx = this.ensureContext();
        const job = (async () => {
          if (!ctx) throw new Error('no_audio_context');
          if (!window.location.protocol.startsWith('http')) throw new Error('offline');
          const url = `/api/tts-script?v=6&speed=${speed}&ref=${encodeURIComponent(voice)}&lines=${encodeURIComponent(JSON.stringify(lines))}`;
          const res = await this.runTtsRequest(() => fetch(url));
          if (!res.ok) {
            let code = `http_${res.status}`;
            try {
              const errBody = await res.json();
              if (errBody && errBody.error === 'fish_api_key_missing') code = errBody.error;
              if (errBody && (errBody.error === 'quota_exceeded' || errBody.error === 'service_tts_cap')) {
                code = 'quota';
                if (window.arNotifyQuota) window.arNotifyQuota(errBody.message);
              }
            } catch (e) {}
            throw new Error(code);
          }
          const body = await res.json();
          this.noteTtsModel(body && body.model);
          if (!body || !body.audio_base64 || !Array.isArray(body.lines) || body.lines.length !== lines.length) {
            throw new Error('bad_script_response');
          }
          const bin = atob(body.audio_base64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const full = await ctx.decodeAudioData(bytes.buffer);

          // 전체 녹음의 최대 음량 (모든 문장을 같은 배율로 키워 문장 사이 크기를 일정하게 유지)
          const mono = full.getChannelData(0);
          let peak = 0;
          for (let i = 0; i < mono.length; i += 4) {
            const v = Math.abs(mono[i]);
            if (v > peak) peak = v;
          }

          // ★ 원테이크 마스터 오디오 버퍼 보관: 컷마다 끊어 치지 않고 한 호흡으로 자연스럽게 연속 재생
          this.masterBuffer = full;
          this.masterPeak = peak;
          this.masterDuration = full.duration;

          // 문장 경계: 글자 위치로 추정한 경계 근처(±0.4초)에서 실제로 가장 조용한 지점을 찾아 자름
          //   (추정 경계가 말끝·말머리에 걸리면 문장 끝 발음이 잘리거나 다음 문장 첫 소리가 섞임)
          const sr = full.sampleRate;
          const win = Math.max(1, Math.floor(sr * 0.06));
          const rmsAt = (t) => {
            const a = Math.max(0, Math.floor(t * sr) - (win >> 1));
            const b = Math.min(mono.length, a + win);
            let s = 0;
            for (let k = a; k < b; k++) s += mono[k] * mono[k];
            return Math.sqrt(s / Math.max(1, b - a));
          };
          const quietest = (center, lo, hi) => {
            let best = center;
            let bestV = Infinity;
            for (let t = Math.max(lo, 0); t <= Math.min(hi, full.duration); t += 0.01) {
              const v = rmsAt(t) + Math.abs(t - center) * 0.002;
              if (v < bestV) {
                bestV = v;
                best = t;
              }
            }
            return best;
          };
          const bounds = [Math.max(0, body.lines[0].start - 0.08)];
          for (let i = 0; i < lines.length - 1; i++) {
            // Fish 시각 정보는 문장 마지막 낱말을 짧게 잡는 경향이 있어 (예: 실제보다 0.5초 일찍 끝남)
            // 추정 경계보다 뒤쪽을 더 넓게(최대 1초) 살펴 실제 숨 쉬는 자리를 찾음
            const mid = (body.lines[i].end + body.lines[i + 1].start) / 2;
            const lo = Math.max(bounds[i] + 0.3, mid - 0.25);
            const hi = Math.min(full.duration - 0.1, mid + 1.0, body.lines[i + 1].end - 0.4);
            bounds.push(lo < hi ? quietest(mid, lo, hi) : mid);
          }
          // 마지막 문장은 녹음 끝까지 (말끝 여운이 잘리지 않게)
          bounds.push(full.duration);

          lines.forEach((line, i) => {
            const from = Math.max(0, Math.floor(bounds[i] * sr));
            const to = Math.min(full.length, Math.ceil(bounds[i + 1] * sr));
            const len = Math.max(1, to - from);
            const piece = ctx.createBuffer(full.numberOfChannels, len, sr);
            const fadeIn = Math.min(Math.floor(sr * 0.01), Math.floor(len / 4));
            const fadeOut = Math.min(Math.floor(sr * 0.04), Math.floor(len / 4));
            for (let c = 0; c < full.numberOfChannels; c++) {
              const data = full.getChannelData(c).slice(from, to);
              for (let k = 0; k < fadeIn; k++) data[k] *= k / fadeIn;
              for (let k = 0; k < fadeOut; k++) data[len - 1 - k] *= k / fadeOut;
              piece.copyToChannel(data, c);
            }
            piece.__peak = peak;
            piece.__start = 0;
            piece.__len = piece.duration;
            const key = `${voice}@${speed}|${line}`;
            this.ttsCache.set(key, Promise.resolve(piece));
            this.ttsSeconds.set(key, piece.duration);
          });
          return true;
        })();

        this.scriptCache.set(scriptKey, job);
        job.then(
          () => this.setTtsProvider('fish'),
          (err) => {
            this.scriptCache.delete(scriptKey);
            const code = String(err && err.message);
            if (['fish_api_key_missing', 'http_401', 'http_402', 'offline', 'quota'].includes(code)) {
              this.ttsBlockedUntil = Date.now() + (code === 'quota' ? 600000 : 60000);
              this.setTtsProvider('browser', code);
            }
          }
        );
        return job;
      },

      // 문장 하나만 따로 녹음 (전체 녹음을 쓸 수 없을 때의 대체 경로)
      fetchLineBuffer(text) {
        const voice = this.ttsVoice;
        const speed = this.ttsSpeed;
        const key = this.ttsKey(text);
        if (this.ttsCache.has(key)) return this.ttsCache.get(key);
        // 키 미설정·크레딧 부족처럼 바로 풀리지 않는 오류는 1분간 재요청하지 않음
        if (Date.now() < this.ttsBlockedUntil) return Promise.reject(new Error(this.ttsLastError || 'blocked'));

        const ctx = this.ensureContext();
        const job = (async () => {
          if (!ctx) throw new Error('no_audio_context');
          if (!window.location.protocol.startsWith('http')) throw new Error('offline');
          // v: 서버의 읽기 규칙이 바뀌면 올려서, 예전에 저장된 음성 대신 새 음성을 받게 함
          const url = `/api/tts?v=5&speed=${speed}` + (voice !== 'auto' ? `&ref=${encodeURIComponent(voice)}` : '') + `&text=${encodeURIComponent(text)}`;
          let res = await this.runTtsRequest(() => fetch(url));
          if (!res.ok && (res.status === 429 || res.status >= 500) && res.status !== 503) {
            await new Promise((r) => setTimeout(r, 900));
            res = await this.runTtsRequest(() => fetch(url));
          }
          if (!res.ok) {
            let code = `http_${res.status}`;
            try {
              const body = await res.json();
              if (body && body.error === 'fish_api_key_missing') code = body.error;
              if (body && (body.error === 'quota_exceeded' || body.error === 'service_tts_cap')) {
                code = 'quota';
                if (window.arNotifyQuota) window.arNotifyQuota(body.message);
              }
            } catch (e) {}
            throw new Error(code);
          }
          this.noteTtsModel(res.headers.get('X-TTS-Model'));
          const bytes = await res.arrayBuffer();
          const buffer = await ctx.decodeAudioData(bytes);
          // 앞뒤 무음 구간을 잘라 실제 말하는 구간만 사용 (컷 길이를 불필요하게 늘리지 않도록)
          const data = buffer.getChannelData(0);
          let peak = 0;
          for (let i = 0; i < data.length; i += 4) {
            const v = Math.abs(data[i]);
            if (v > peak) peak = v;
          }
          const threshold = peak * 0.012;
          let first = 0;
          let last = data.length - 1;
          while (first < last && Math.abs(data[first]) < threshold) first++;
          while (last > first && Math.abs(data[last]) < threshold) last--;
          const padHead = Math.floor(buffer.sampleRate * 0.05);
          const padTail = Math.floor(buffer.sampleRate * 0.18);
          first = Math.max(0, first - padHead);
          last = Math.min(data.length - 1, last + padTail);
          buffer.__peak = peak;
          buffer.__start = first / buffer.sampleRate;
          buffer.__len = Math.max(0.2, (last - first) / buffer.sampleRate);
          this.ttsSeconds.set(key, buffer.__len);
          return buffer;
        })();

        this.ttsCache.set(key, job);
        job.then(
          () => this.setTtsProvider('fish'),
          (err) => {
            this.ttsCache.delete(key); // 실패는 캐시하지 않아 다음 재생 때 다시 시도
            const code = String(err && err.message);
            if (['fish_api_key_missing', 'http_401', 'http_402', 'offline', 'quota'].includes(code)) {
              this.ttsBlockedUntil = Date.now() + (code === 'quota' ? 600000 : 60000);
            }
            if (Date.now() < this.ttsBlockedUntil || this.ttsProvider !== 'fish') this.setTtsProvider('browser', code);
          }
        );
        return job;
      },

      // 각 컷(0..컷수-1)과 마지막 명함 멘트(컷수)의 성우 음성 길이(초). 아직 모르면 0
      //  - 브라우저 음성으로 대체된 경우에는 글자 수로 어림
      getNarrationSeconds() {
        const totalCuts = getTargetCutCount();
        const out = [];
        for (let i = 0; i <= totalCuts; i++) {
          const text = this.getCutNarration(i);
          let sec = text ? (this.ttsSeconds.get(this.ttsKey(text)) || 0) : 0;
          if (!sec && text && this.ttsProvider === 'browser') {
            sec = text.replace(/[^0-9A-Za-z가-힣]/g, '').length * 0.17 + 0.3;
          }
          out.push(sec);
        }
        return out;
      },

      // 모든 컷 + 마지막 명함 멘트 음성을 미리 받아 두고, 받은 길이에 맞춰 영상 길이를 조정
      prefetchTtsBuffers() {
        // 명함 단계까지 마치기 전에는 성우 녹음을 받지 않음 (발행 단계에서 완성본으로 한 번에)
        if (this.ttsVoice === 'off' || !arVoiceAllowed()) {
          refitDurationToNarration();
          return Promise.resolve([]);
        }
        const totalCuts = getTargetCutCount();
        const lines = [];
        // 본편 컷들(0..totalCuts-1) + 마지막 엔딩 명함 멘트(totalCuts)
        for (let i = 0; i <= totalCuts; i++) {
          const text = this.getCutNarration(i);
          if (text) lines.push(text);
        }
        if (lines.length === 0) return Promise.resolve([]);
        // 예약된 (타이핑 후) 녹음이 있으면 지금 바로 받으므로 취소
        if (this.ttsPrefetchTimer) { clearTimeout(this.ttsPrefetchTimer); this.ttsPrefetchTimer = null; }

        // 1순위: 대본 전체를 한 번에 녹음. 실패하면 문장별 녹음으로 대체
        const perLine = () => Promise.all(lines.map((t) => this.fetchLineBuffer(t).catch(() => null)));
        const job = (Date.now() < this.ttsBlockedUntil ? perLine() : this.fetchScriptNarration(lines).catch(perLine)).then(
          (result) => {
            if (this.scriptPending === job) this.scriptPending = null;
            refitDurationToNarration();
            // 재생 중에 마스터 음성이 도착하면 즉시 타임라인 현재 시간에 맞춰 재생
            if (isPlaying && this.enabled && this.masterBuffer) {
              const curT = (window.__timelines && window.__timelines['main']) ? (window.__timelines['main'].currentTime || 0) : 0;
              this.playMasterAt(curT);
            }
            return result;
          }
        );
        this.scriptPending = job;
        return job;
      },

      // 대본을 타이핑하는 동안에는 받지 않고, 입력이 멈춘 뒤 한 번만 받음 (크레딧 낭비 방지)
      schedulePrefetch(delayMs = 1500) {
        if (this.ttsPrefetchTimer) clearTimeout(this.ttsPrefetchTimer);
        this.ttsPrefetchTimer = setTimeout(() => {
          this.ttsPrefetchTimer = null;
          if (this.enabled) this.prefetchTtsBuffers();
        }, delayMs);
      },

      playMasterAt(startT = 0) {
        const ctx = this.ensureContext();
        if (!ctx || !this.enabled || !this.masterBuffer || this.ttsVoice === 'off' || !arVoiceAllowed()) return;
        this.stopTts();
        const dur = this.masterBuffer.duration;
        if (startT >= dur - 0.05) return;
        const src = ctx.createBufferSource();
        src.buffer = this.masterBuffer;
        const g = ctx.createGain();
        g.gain.value = this.masterPeak > 0.01 ? Math.min(4, 0.9 / this.masterPeak) : 1.0;
        src.connect(g);
        g.connect(this.ttsGain);
        src.onended = () => {
          if (this.masterSource === src) {
            this.masterSource = null;
            this.masterSourceGain = null;
          }
        };
        src.start(0, Math.max(0, startT));
        this.masterSource = src;
        this.masterSourceGain = g;
      },

      stopMasterSource() {
        if (this.masterSource) {
          const src = this.masterSource;
          const g = this.masterSourceGain;
          this.masterSource = null;
          this.masterSourceGain = null;
          try {
            if (g && this.ctx) {
              const now = this.ctx.currentTime;
              g.gain.cancelScheduledValues(now);
              g.gain.setValueAtTime(g.gain.value, now);
              g.gain.linearRampToValueAtTime(0.0001, now + 0.05);
              src.stop(now + 0.06);
            } else {
              src.stop();
            }
          } catch (e) {}
        }
      },

      stopTts() {
        this.ttsSpeakToken++;
        this.stopMasterSource();
        if (this.ttsSource) {
          const src = this.ttsSource;
          const g = this.ttsSourceGain;
          this.ttsSource = null;
          this.ttsSourceGain = null;
          try {
            if (g && this.ctx) {
              const now = this.ctx.currentTime;
              g.gain.cancelScheduledValues(now);
              g.gain.setValueAtTime(g.gain.value, now);
              g.gain.linearRampToValueAtTime(0.0001, now + 0.06);
              src.stop(now + 0.07);
            } else {
              src.stop();
            }
          } catch (e) {}
        }
        if ('speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); } catch (e) {}
        }
      },

      playTtsBuffer(buffer, cutIdx) {
        const ctx = this.ctx;
        if (!ctx || !buffer) return;
        this.stopMasterSource();
        if (this.ttsSource) {
          const prevSrc = this.ttsSource;
          const prevG = this.ttsSourceGain;
          this.ttsSource = null;
          this.ttsSourceGain = null;
          try {
            if (prevG) {
              const now0 = ctx.currentTime;
              prevG.gain.cancelScheduledValues(now0);
              prevG.gain.setValueAtTime(prevG.gain.value, now0);
              prevG.gain.linearRampToValueAtTime(0.0001, now0 + 0.04);
              prevSrc.stop(now0 + 0.05);
            } else {
              prevSrc.stop();
            }
          } catch (e) {}
        }
        const src = ctx.createBufferSource();
        const g = ctx.createGain();
        src.buffer = buffer;

        // 문장이 컷 길이보다 조금 길면 살짝 빠르게 읽어 컷 안에 맞춤 (최대 1.12배)
        const totalCuts = getTargetCutCount();
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const slotDur = cutIdx < totalCuts ? getCutLengths()[cutIdx] : OUTRO_DURATION;
        const speechLen = typeof buffer.__len === 'number' ? buffer.__len : buffer.duration;
        const fit = speechLen / Math.max(0.5, slotDur - 0.1);
        const rate = Math.min(1.12, Math.max(1.0, fit));
        src.playbackRate.value = rate;

        // 성우 음량 자동 보정: 음성마다 녹음 크기가 달라 BGM에 묻히지 않게 최대 음량 기준으로 맞춤 (최대 4배)
        if (typeof buffer.__peak !== 'number') {
          let peak = 0;
          for (let c = 0; c < buffer.numberOfChannels; c++) {
            const data = buffer.getChannelData(c);
            for (let i = 0; i < data.length; i += 8) {
              const v = Math.abs(data[i]);
              if (v > peak) peak = v;
            }
          }
          buffer.__peak = peak;
        }
        const targetGain = buffer.__peak > 0.01 ? Math.min(4, 0.9 / buffer.__peak) : 1.0;
        const startOffset = buffer.__start || 0;
        const playDur = Math.min(Math.max(0.2, buffer.duration - startOffset), speechLen + 0.12);
        const realDur = playDur / rate;
        const now = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(targetGain, now + 0.015);
        if (realDur > 0.08) {
          g.gain.setValueAtTime(targetGain, now + realDur - 0.035);
          g.gain.linearRampToValueAtTime(0.0001, now + realDur);
        }
        src.connect(g);
        g.connect(this.ttsGain);
        src.onended = () => {
          if (this.ttsSource === src) {
            this.ttsSource = null;
            this.ttsSourceGain = null;
          }
        };
        src.start(now, startOffset, playDur);
        this.ttsSource = src;
        this.ttsSourceGain = g;
      },

      speakWithBrowserVoice(text) {
        if (!('speechSynthesis' in window) || !arVoiceAllowed()) return;
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(window.__koSpeech ? window.__koSpeech(text) : text);
          utter.lang = 'ko-KR';
          const voices = window.speechSynthesis.getVoices() || [];
          const koVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().includes('ko'));
          if (koVoices.length > 0) {
            utter.voice = (this.ttsVoice === 'male' && koVoices.length > 1) ? koVoices[koVoices.length - 1] : koVoices[0];
          }
          utter.pitch = this.ttsVoice === 'male' ? 0.86 : this.ttsVoice === 'energetic' ? 1.12 : 1.04;
          utter.rate = this.ttsVoice === 'energetic' ? 1.25 : 1.15;
          utter.volume = 1.0;
          window.speechSynthesis.speak(utter);
        } catch (e) {}
      },

      speakCutLine(cutIdx, forceSpeak = false) {
        if ((!this.enabled && !forceSpeak) || this.ttsVoice === 'off' || !arVoiceAllowed()) return;
        if (!forceSpeak && this.lastSpokenCut === cutIdx) return;
        this.lastSpokenCut = cutIdx;

        const text = this.getCutNarration(cutIdx);
        this.stopTts();
        if (!text) return;

        const ctx = this.ensureContext();
        const token = this.ttsSpeakToken;

        // 다음 컷 음성도 미리 받아 두어 컷이 넘어갈 때 지연 없이 재생
        const nextIdx = cutIdx < getTargetCutCount() ? cutIdx + 1 : 0;
        const nextText = this.getCutNarration(nextIdx);
        if (nextText && nextText !== text) this.fetchTtsBuffer(nextText).catch(() => {});
        const ctxReady = (ctx && ctx.state !== 'running') ? ctx.resume().catch(() => {}) : Promise.resolve();

        Promise.all([this.fetchTtsBuffer(text), ctxReady]).then(
          ([buffer]) => {
            // 음성을 받는 사이 다른 컷으로 넘어갔거나 사운드를 껐으면 재생하지 않음
            if (token !== this.ttsSpeakToken) return;
            if (!this.enabled && !forceSpeak) return;
            // 기다리는 사이 한 호흡 녹음이 도착해 재생 중이면 컷 조각은 겹쳐 틀지 않음
            if (this.masterBuffer && isPlaying && !forceSpeak) return;
            this.playTtsBuffer(buffer, cutIdx);
          },
          () => {
            if (token !== this.ttsSpeakToken) return;
            // 키 미설정·크레딧 부족 등 Fish Audio를 아예 못 쓸 때만 브라우저 음성으로 대체.
            // 한 문장만 일시적으로 실패한 경우에는 다른 목소리가 섞이지 않게 그 컷은 건너뜀
            if (Date.now() < this.ttsBlockedUntil) this.speakWithBrowserVoice(text);
          }
        );
      },

      // 재생/일시정지 전환 시 불러온 음원과 성우 음성도 함께 멈추고 이어 재생
      onPlayStateChange(playing) {
        if (!this.enabled) return;
        if (playing) {
          if (this.bgmStyle === 'custom_mp3' && this.customBgmAudioEl) {
            this.customBgmAudioEl.play().catch(() => {});
          }
          const curT = (window.__timelines && window.__timelines['main']) ? (window.__timelines['main'].currentTime || 0) : 0;
          if (this.masterBuffer) {
            this.playMasterAt(curT);
          } else {
            this.lastSpokenCut = -1;
            const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
            const totalCuts = getTargetCutCount();
            const slot = curT < mainDur ? getCutIndexAt(curT) : totalCuts;
            this.speakCutLine(slot, false);
          }
        } else {
          if (this.customBgmAudioEl) {
            try { this.customBgmAudioEl.pause(); } catch (e) {}
          }
          this.stopTts();
        }
      },

      // ---------- 장면 효과음: 우쉬 · 셔터 · 임팩트 · 틱 · 스와이프 · 차임 (장면이 바뀔 때만, 작게) ----------
      sfxMode: (() => { try { return localStorage.getItem('autoreels_sfx') || 'scene'; } catch (e) { return 'scene'; } })(),
      lastSfxSlot: -2,
      sfxOut() {
        if (!this.sfxGain) {
          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.value = 0.7;
          this.sfxGain.connect(this.masterGain);
        }
        return this.sfxGain;
      },
      sfxNoiseBuf(dur = 0.25) {
        const ctx = this.ctx;
        const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
        return buf;
      },
      sfxTone(when, f0, f1, dur, gain, type = 'sine', glide = 0.04) {
        const ctx = this.ctx;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f0, when);
        o.frequency.exponentialRampToValueAtTime(f1, when + glide);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
        o.connect(g); g.connect(this.sfxOut());
        o.start(when); o.stop(when + dur + 0.02);
      },
      // 바람 스윕 (Whoosh)
      sfxWhoosh(when, gain = 0.2) {
        const ctx = this.ctx;
        const src = ctx.createBufferSource();
        src.buffer = this.sfxNoiseBuf(0.24);
        const flt = ctx.createBiquadFilter();
        flt.type = 'bandpass';
        flt.Q.value = 1.6;
        flt.frequency.setValueAtTime(320, when);
        flt.frequency.exponentialRampToValueAtTime(2400, when + 0.09);
        flt.frequency.exponentialRampToValueAtTime(480, when + 0.22);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
        src.connect(flt); flt.connect(g); g.connect(this.sfxOut());
        src.start(when); src.stop(when + 0.24);
      },
      // 카메라 셔터 (Shutter)
      sfxShutter(when, gain = 0.18) {
        const ctx = this.ctx;
        [0, 0.045].forEach((off, idx) => {
          const t0 = when + off;
          const src = ctx.createBufferSource();
          src.buffer = this.sfxNoiseBuf(0.035);
          const flt = ctx.createBiquadFilter();
          flt.type = 'highpass';
          flt.frequency.setValueAtTime(idx === 0 ? 1800 : 1200, t0);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(gain * (idx === 0 ? 1 : 0.75), t0 + 0.003);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
          src.connect(flt); flt.connect(g); g.connect(this.sfxOut());
          src.start(t0); src.stop(t0 + 0.035);
        });
      },
      // 펀치 임팩트 (Impact)
      sfxImpact(when, gain = 0.26) {
        this.sfxTone(when, 150, 38, 0.18, gain, 'sine', 0.14);
        this.sfxTone(when, 420, 95, 0.045, gain * 0.45, 'triangle', 0.03);
      },
      // 깔끔한 UI 틱 (Tick)
      sfxTick(when, gain = 0.16) {
        this.sfxTone(when, 1900, 620, 0.032, gain, 'triangle', 0.022);
      },
      // 부드러운 카드 스와이프 (Swipe)
      sfxSwipe(when, gain = 0.14) {
        const ctx = this.ctx;
        const src = ctx.createBufferSource();
        src.buffer = this.sfxNoiseBuf(0.14);
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(900, when);
        flt.frequency.exponentialRampToValueAtTime(2800, when + 0.12);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 0.13);
        src.connect(flt); flt.connect(g); g.connect(this.sfxOut());
        src.start(when); src.stop(when + 0.15);
      },
      // 톡 튀는 팝
      sfxPop(when, gain = 0.18) {
        this.sfxTone(when, 320, 880, 0.07, gain, 'triangle', 0.025);
      },
      // 똑 떨어지는 물방울
      sfxDrop(when, gain = 0.18) {
        this.sfxTone(when, 620, 1650, 0.14, gain, 'sine', 0.06);
      },
      // 가격·혜택 장면: 맑은 두 음
      sfxChime(when, gain = 0.12) {
        this.sfxTone(when, 1318.5, 1318.5, 0.5, gain, 'sine', 0.01);
        this.sfxTone(when + 0.08, 1975.5, 1975.5, 0.55, gain * 0.8, 'sine', 0.01);
      },
      // 마지막 명함 장면: 올라가는 반짝임
      sfxSparkle(when, gain = 0.08) {
        [1046.5, 1318.5, 1568, 2093].forEach((hz, i) => this.sfxTone(when + i * 0.055, hz, hz, 0.3, gain, 'sine', 0.01));
      },
      playSceneSfx(t, slot, totalCuts) {
        const when = this.ctx.currentTime + 0.01;
        if (slot >= totalCuts) return this.sfxSparkle(when);
        if (this.sfxMode === 'whoosh') return this.sfxWhoosh(when);
        if (this.sfxMode === 'shutter') return this.sfxShutter(when);
        if (this.sfxMode === 'impact') return this.sfxImpact(when);
        if (this.sfxMode === 'tick') return this.sfxTick(when);
        if (this.sfxMode === 'drop') return this.sfxDrop(when);
        const ds = typeof getActiveDesign === 'function' ? getActiveDesign() : null;
        const cat = ds ? (ds.cat || '') : '';
        const cap = String((campaign.cutCaptions || [])[slot] || '');
        if (/만\s?원|\d+\s?%|할인|특가|혜택|\d+원|1\+1/.test(cap)) {
          this.sfxImpact(when, 0.18);
          return this.sfxChime(when + 0.1);
        }
        if (['타이포', '스포츠', '특가', '테크'].includes(cat)) {
          return [() => this.sfxImpact(when), () => this.sfxWhoosh(when), () => this.sfxTick(when)][slot % 3]();
        }
        if (['브이로그', '감성', '신규', '손글씨', '고급'].includes(cat)) {
          return [() => this.sfxShutter(when), () => this.sfxWhoosh(when), () => this.sfxSwipe(when)][slot % 3]();
        }
        return [() => this.sfxWhoosh(when), () => this.sfxTick(when), () => this.sfxShutter(when), () => this.sfxPop(when)][slot % 4]();
      },
      handleSceneSfx(t) {
        if (this.sfxMode === 'off' || !this.ctx) return;
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const totalCuts = getTargetCutCount();
        const slot = t < mainDur ? getCutIndexAt(t) : totalCuts;
        const dt = t - this.lastTimelineT;
        const moving = dt > 0 && dt < 0.6;
        if (slot === this.lastSfxSlot) return;
        this.lastSfxSlot = slot;
        if (!moving && !(t < 0.2 && slot === 0)) return; // 이리저리 넘겨 볼 때는 소리 없이
        this.playSceneSfx(t, slot, totalCuts);
      },

      syncWithTimeline(t) {
        if (!this.enabled) return;
        try { this.handleSceneSfx(t); } catch (e) {}
        // 1. 원테이크 마스터 음성이 있으면 컷 경계마다 끊지 않고 한 호흡으로 자연스럽게 이어서 재생!
        if (this.masterBuffer) {
          // 타임라인이 끝에 도달하여 0초로 루프되거나 처음으로 감긴 경우 마스터 트랙 재시작
          if (t < 0.15 && this.lastTimelineT > 1.0) {
            this.playMasterAt(0);
          }
          this.lastTimelineT = t;
          return;
        }
        this.lastTimelineT = t;

        // 2. 마스터 오디오가 준비되지 않은 개별 문장 폴백:
        const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
        const totalCuts = getTargetCutCount();
        const slot = t < mainDur ? getCutIndexAt(t) : totalCuts;
        if (slot !== this.lastSpokenCut) {
          this.speakCutLine(slot, false);
        }
      }
    };

    // 지난번에 고른 성우를 다시 선택
    try {
      const savedVoice = localStorage.getItem('autoreels_tts_voice');
      const voiceSel = document.getElementById('ttsVoiceSelect');
      if (savedVoice && voiceSel && [...voiceSel.options].some((o) => o.value === savedVoice)) {
        voiceSel.value = savedVoice;
        AudioEngine.ttsVoice = savedVoice;
      }
    } catch (e) {}

    // 브라우저 자동재생 정책 대응: 화면을 처음 터치/클릭하는 순간 오디오 엔진 잠금 해제
    ['pointerdown', 'touchend', 'keydown'].forEach((evt) => {
      document.addEventListener(evt, () => {
        if (AudioEngine.ctx && AudioEngine.ctx.state !== 'running') {
          AudioEngine.ctx.resume().catch(() => {});
        }
      }, { passive: true });
    });

    // 사용자가 릴스·숏츠 MP3/오디오 파일 업로드 시 호출
    function handleCustomBgmUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      AudioEngine.loadCustomBgmFile(file);
    }

    // 특정 컷의 성우 음성을 즉시 테스트 발화
    function testCutTts(cutIdx) {
      if (!AudioEngine.enabled) {
        toggleAudioMaster(true);
      }
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const totalCuts = getTargetCutCount();
      const seekT = cutIdx < totalCuts ? (getCutStart(cutIdx) + 0.1) : (mainDur + 0.1);
      window.__timelines['main'].seek(seekT);
      AudioEngine.speakCutLine(cutIdx, true);
    }

    function testCurrentCutTtsNow() {
      const t = window.__timelines['main'].currentTime || 0;
      const mainDur = Math.max(4.0, TOTAL_DURATION - OUTRO_DURATION);
      const totalCuts = getTargetCutCount();
      const slot = t < mainDur ? getCutIndexAt(t) : totalCuts;
      testCutTts(slot);
    }

    function toggleAudioMaster(forceState) {
      AudioEngine.enabled = typeof forceState === 'boolean' ? forceState : !AudioEngine.enabled;
      const btn = document.getElementById('soundToggleBtn');
      const dot = document.getElementById('soundDot');
      const lbl = document.getElementById('soundToggleLabel');
      const engineBadge = document.getElementById('audioEngineBadge');

      if (AudioEngine.enabled) {
        AudioEngine.ensureContext();
        AudioEngine.lastSpokenCut = -1;
        AudioEngine.startBgmLoop();
        AudioEngine.loadVoiceList();
        AudioEngine.prefetchTtsBuffers();
        AudioEngine.syncWithTimeline(window.__timelines['main'].currentTime);
        if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-[#4cc38a]';
        if (lbl) lbl.textContent = '사운드 켜짐';
        if (btn) {
          btn.className = 'btn-secondary h-9 px-2.5 text-[12px] cursor-pointer flex items-center justify-center gap-1.5 border-[#4cc38a] text-[#ededed]';
        }
        if (engineBadge) {
          engineBadge.textContent = '🔊 BGM + 한국어 성우(TTS) 작동중';
          engineBadge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#4cc38a]';
        }
      } else {
        AudioEngine.stopBgmLoop();
        AudioEngine.stopTts();
        refitDurationToNarration();
        if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-[#85858b]';
        if (lbl) lbl.textContent = '사운드 켜기';
        if (btn) {
          btn.className = 'btn-secondary h-9 px-2.5 text-[12px] cursor-pointer flex items-center justify-center gap-1.5';
        }
        if (engineBadge) {
          engineBadge.textContent = '🔇 사운드 일시정지됨 (클릭 시 켜짐)';
          engineBadge.className = 'tag-chip px-2 py-0.5 font-mono text-[11px] text-[#85858b]';
        }
      }
    }

    function onAudioConfigChange() {
      const bgmEl = document.getElementById('bgmStyleSelect');
      const ttsEl = document.getElementById('ttsVoiceSelect');
      if (bgmEl) AudioEngine.bgmStyle = bgmEl.value;
      if (ttsEl) AudioEngine.ttsVoice = ttsEl.value;
      const speedEl = document.getElementById('ttsSpeedSelect');
      if (speedEl) AudioEngine.ttsSpeed = Number(speedEl.value) || 1.1;
      try {
        if (ttsEl && ttsEl.value !== 'off') localStorage.setItem('autoreels_tts_voice', ttsEl.value);
      } catch (e) {}
      if (!AudioEngine.enabled) {
        AudioEngine.masterBuffer = null;
        AudioEngine.masterDuration = 0;
        toggleAudioMaster(true);
      } else {
        AudioEngine.startBgmLoop();
        AudioEngine.stopTts();
        AudioEngine.masterBuffer = null;
        AudioEngine.masterDuration = 0;
        AudioEngine.lastSpokenCut = -1;
        AudioEngine.prefetchTtsBuffers();
        AudioEngine.syncWithTimeline(window.__timelines['main'].currentTime);
      }
    }

    function triggerFullAudioPreview() {
      toggleAudioMaster(true);
      isPlaying = true;
      const ppBtn = document.getElementById('playPauseBtn');
      if (ppBtn) ppBtn.textContent = '⏸ 일시정지';
      window.__timelines['main'].seek(0);
      if (AudioEngine.masterBuffer) {
        AudioEngine.playMasterAt(0);
      } else if (AudioEngine.enabled && !AudioEngine.scriptPending) {
        AudioEngine.prefetchTtsBuffers();
      }
    }
