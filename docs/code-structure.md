# 화면 코드 구조 (2026-11-14 정리)

예전에는 화면 전체가 `public/index.html` 한 파일(약 1.8MB, 2만 6천 줄)에 들어 있었습니다.
지금은 HTML 뼈대만 `public/index.html`에 두고, 스크립트와 CSS는 `public/assets/app/`로 나눴습니다.

| 파일 | 내용 |
|---|---|
| `00-wasm-core.js` | Rust/Wasm 코어 |
| `01-industries.js` | 이징 함수, 업종 설정(10개 업종 문구·프리셋) |
| `02-story-presets.js` | 색 테마, 스토리 아키타입 데이터 |
| `03-campaign-timing.js` | 카마스터별 변주, 영상 길이·컷 길이 |
| `04-audio-engine.js` | 배경음악, AI 성우(TTS), 효과음 |
| `05-genre-engine.js` | 캔버스 준비, 장르 엔진 |
| `06-design-kit.js` | 디자인 스타일 목록, 디자인 키트, 분류 |
| `07-motion-styles.js` | 모션·인스타 감성 스타일 (`MOTION_ROWS`, `renderMotionFrame`) |
| `08-cut-editor.js` | 컷 편집(스티커·필터·그리기) |
| `09-renderer.js` | 한 프레임 그리기(`renderHyperFramesComposition`), 재생 루프 |
| `10-studio-steps.js` | 오늘의 주제, 단계 진행, 쉬운 모드, 명함 |
| `11-script-presets.js` | AI 대본, 프리셋, 영상 저장, 내장 사진 |
| `12-account-billing-sns.js` | 관리자 모드, 로그인·가입, 구독 결제, 서버 모드, SNS 연결 |
| `app.css`, `readability.css` | 스타일 |

## 규칙
- 스크립트는 `index.html`에서 **위 순서대로** 일반 `<script src>`로 불러옵니다. `type="module"`이나 `defer`로 바꾸지 마세요. 모든 파일이 전역 이름을 공유합니다.
- 어떤 파일이 **불러오는 순간** 실행하는 코드에서 뒤 번호 파일의 함수·변수를 쓰면 안 됩니다. (버튼을 누른 뒤나 화면이 다 뜬 뒤 실행되는 코드는 괜찮습니다.)
- 루트의 `index.html` 복사본은 없앴습니다. Vercel은 `public/`만 배포합니다. 고칠 곳은 `public/` 아래뿐입니다.

## 검사
- `tests/smoke-render.mjs`: 실제 브라우저로 페이지를 열어 모든 디자인을 5개 업종 × 5개 시점으로 그려 보고, 버튼에 걸린 함수가 모두 있는지, 단계 탭이 열리는지 확인합니다. 오류가 하나라도 있으면 실패합니다.
  - 로컬: `npm i --no-save playwright@1.48.2 && npx playwright install chromium && node tests/smoke-render.mjs`
- GitHub Actions `smoke` 워크플로가 main에 올라올 때마다 같은 검사를 돌립니다.
