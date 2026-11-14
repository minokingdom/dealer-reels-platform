// AutoReels — 00-wasm-core.js  (public/index.html 에서 나눔. 일반 <script> 로 순서대로 불러오며 전역 이름을 공유함)
    // ============================================================================
    // 🦀 Rust + WebAssembly (Wasm) Core Engine (rust-engine/src/lib.rs -> .wasm)
    // - 60fps Camera Motion Math & Generative Scene Permutation
    // - Anti-Clone Domain Lock & Phone-Number Bound Subscription DRM
    // ============================================================================
    const AUTOREELS_WASM_B64 =
      'AGFzbQEAAAABGgRgAn9/AX9gAAF/YAF/AX9gBn9/f39/fwF/AwgHAAAAAQACAwUDAQAQBgkBfwFBgIDAAAsHsQEIBm1lbW9yeQIAFWNvbXB1dGVfY2FtZXJhX3Bhbl9weAAAGmNvbXB1dGVfY2FtZXJhX3NjYWxlX21pbGxpAAESY29tcHV0ZV9zY2VuZV9zbG90AAIOZW5naW5lX3ZlcnNpb24AAxpnZW5lcmF0ZV9saWNlbnNlX3NpZ25hdHVyZQAEEnZlcmlmeV9kb21haW5faGFzaAAFF3ZlcmlmeV9zdWJzY3JpcHRpb25fZHJtAAYKvQQHTgEBfyAAQdAPIABB0A9JG0EBdkGMfGohAkEAIQACQAJAAkAgAUEDcUF/ag4CAAECCyACQThswUHoB23BDwsgAkFIbMFB6AdtwSEACyAAC1MBAX8gAEHQDyAAQdAPSRtBAXYhAkGU1QAhAAJAAkACQCABQQNxDgQBAgIAAQsgAkHQAGxB5ABuQaDRAGoPCyACQe4AbEHkAG5B2M8AaiEACyAAC8gBAQF/I4CAgIAAQRBrIgJCh4CAgLABNwIIIAJCgYCAgNAANwIAIAIgAEGV+Kn6B3MiAEEQdiAAc0HrlK+veGwiAEENdiAAc0G13MqVfGwiAEEQdiAAcyIAQQV2QQxxaigCACABQQNxbCAAQQxwakEMcCAAIAFBu772ImxBu772ImpzIgFBEHYgAXNB65Svr3hsIgFBDXYgAXNBtdzKlXxsIgFBEHYgAXMiAUEDcEEIdHIgAUELdEGAgAxxciAAQRV0QYCAgDhxcgsFAEHkAAtPACABQQt3QYuoh/QFcyAAQbnz3fF5bEHBpc6/enNqIgBBEHYgAHNB65Svr3hsIgBBDXYgAHNBtdzKlXxsIgBBEHYgAHNBoPc2cEGgjQZqCzkBAX9BASEBAkAgAEECSQ0AIABB5ae5wXtGDQAgAEG1gviLBEYNACAAQd7EqPIERg0AQQAhAQsgAQs+AAJAIAUQhYCAgAANAEEEDwsCQCAAIAFGDQBBAw8LAkAgAiAAIAMQhICAgABGDQBBAA8LQQJBASAEIANLGws=';

    const RustWasmCore = (() => {
      try {
        const binStr = atob(AUTOREELS_WASM_B64);
        const bytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
        const mod = new WebAssembly.Module(bytes);
        const inst = new WebAssembly.Instance(mod, {});
        return inst.exports;
      } catch (e) {
        console.error('Wasm init error:', e);
        return null;
      }
    })();

    function extractPhoneLast8(phoneStr) {
      const digits = String(phoneStr || '').replace(/\D/g, '');
      const last8 = digits.slice(-8);
      return Number(last8) || 48219032;
    }

    function getCurrentDomainFlag() {
      const host = (window.location.hostname || '').toLowerCase();
      if (!host || host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app') || host.endsWith('autoreels.kr')) {
        return 1;
      }
      // Compute FNV-1a 32-bit hash for unknown domains
      let h = 0x811c9dc5;
      for (let i = 0; i < host.length; i++) {
        h ^= host.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
      }
      return h;
    }

    function formatWasmLicenseKey(phoneStr, expiryYmd = 20261231) {
      const p8 = extractPhoneLast8(phoneStr);
      const sig = RustWasmCore ? (RustWasmCore.generate_license_signature(p8, expiryYmd) >>> 0) : 884920;
      return `AR-${sig}`;
    }

    function parseProvidedLicenseSig(licenseKeyStr) {
      const m = String(licenseKeyStr || '').trim().match(/(\d{6})/);
      return m ? Number(m[1]) : 0;
    }

    // 웹 사이트 무단 복제(Rea/Scraper) 방지 가드 (우클릭 및 소스 추출 단축키 방어)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) || e.key === 'F12') {
        e.preventDefault();
      }
    });
