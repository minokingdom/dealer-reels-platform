# AGENTS.md — AutoReels 작업 지침

이 저장소를 고치는 모든 AI 에이전트(Claude, Codex, Gemini/Antigravity)와 사람이 따르는 규칙입니다.
같은 실수가 반복되지 않도록 실제로 겪은 문제를 기준으로 적었습니다. 사용자 답변과 코드 주석은 한국어로 씁니다.

## 1. 코드 위치 (2026-11-14 구조 변경)
- 화면은 `public/index.html`(HTML 뼈대만) + `public/assets/app/` 스크립트 13개·CSS 2개입니다. 파일별 내용은 `docs/code-structure.md`.
- **고칠 곳은 `public/` 아래뿐입니다.** Vercel은 `public/`만 배포합니다. 루트 `index.html`은 없앴으니 다시 만들거나 복사하지 마세요.
- 스크립트는 `index.html`에서 번호 순서대로 일반 `<script src>`로 불러오고 전역 이름을 공유합니다.
  - `type="module"`, `defer`, `async`로 바꾸지 마세요.
  - 파일을 **불러오는 순간** 실행되는 코드(최상위 호출·변수 초기값)에서 뒤 번호 파일의 함수·변수를 쓰면 안 됩니다. 버튼 클릭이나 화면이 다 뜬 뒤 실행되는 코드는 괜찮습니다.
  - 새 기능은 맞는 번호 파일에 넣습니다. 새 파일이 필요하면 `index.html`의 순서 목록과 `docs/code-structure.md`를 같이 고칩니다.
- 서버 함수는 `api/*.js`입니다. Vercel 무료 한도(함수 12개) 때문에 **새 API 파일을 만들지 말고** 기존 파일에 `mode`를 추가합니다(예: `generate-script.js`의 `mode:'topics'`).

## 2. 작업 순서
1. 시작 전 `git pull --ff-only`. 다른 에이전트가 같은 파일을 자주 고칩니다.
2. 필요한 곳만 고칩니다. 파일 전체 재정렬·포맷 변경·관련 없는 수정 금지.
3. 검사 (둘 다 통과해야 올림)
   - 문법: `for f in public/assets/app/*.js; do node --check "$f"; done`
   - 화면: `npm i --no-save playwright@1.48.2 && npx playwright install chromium && node tests/smoke-render.mjs`
     (모든 디자인을 5개 업종 × 5개 시점으로 그리고, 버튼 함수·단계 탭까지 확인. 오류 0이어야 함)
4. 관련 파일만 `git add`(`git add .` 금지 — 루트의 임시 `.ps1` 스크립트가 섞입니다). 커밋 후 `main`에 push하면 Vercel이 바로 운영에 배포합니다.
5. 배포 확인: `gh api repos/minokingdom/dealer-reels-platform/commits/<sha>/status` 가 `success`, GitHub Actions `smoke`가 통과. 운영 주소 https://dealer-reels-platform.vercel.app 에서 직접 확인한 뒤에 완료라고 보고합니다.
6. 확인 못 한 것은 못 했다고 말합니다. "될 것 같다"를 완료처럼 보고하지 않습니다.

## 3. 디자인 규칙 (사장님이 직접 지적한 것들)
- **분류를 새로 만들지 않습니다.** `DESIGN_CATS`의 기존 12개 분류에만 넣습니다. 인스타 감성 스타일은 '감성' 또는 '브이로그'.
- **글자 테두리 금지:** `strokeText`, 글자 둘레 굵은 선, 겹겹이 쌓은 긴 그림자 금지. 사진 위 밝은 글자에만 옅은 그림자(blur ≤ 10, 투명도 ≤ 0.25).
- **위 사진·아래 단색 글자로 나누는 구성 금지**(자동차 외 업종). 사진은 화면을 꽉 채우거나, 종이 위 인화지·폴라로이드처럼 '물건'으로 놓습니다.
- 인스타 감성: 차분한 크림·베이지·필름 그레인·손글씨·에디토리얼. 네온·글리치·이모지·영어 장식 문구 금지.
- 캔버스는 1080×1920입니다. 글자 크기는 폭 비례로: 자막 약 `W * 0.06`, 작은 라벨 `W * 0.026`, 서명 `W * 0.03`. 12~32px 같은 고정 크기 금지. 아래 약 9%는 이름 칩 자리.
- 새 모션 스타일은 `07-motion-styles.js`의 `MOTION_ROWS` 행 + `MOTION_CAT` 분류 + `renderMotionFrame`의 `M === '<id>'` 분기, 세 곳을 모두 추가합니다. 기존 `in_*` 스타일의 도우미(`inGrain`, `inWarm`, `inPhotoFade`, `inLabel`, `inSign`, `mCaption`)를 재사용하고, 엔딩은 자동(`renderInstaOutro`).
- 숨길 스타일은 `AR_RETIRED_DESIGNS`, 자동차 외 업종에서만 숨길 것은 `AR_SPLIT_MOTION_IDS`.
- 여러 에이전트에게 스타일을 나눠 맡길 때는 기존 스타일 목록을 주고, 아이디어 예시는 적지 않습니다(예시를 주면 서로 같은 걸 만듭니다).

## 4. 기능 규칙
- **성우는 대본 전체를 한 번에** 읽습니다(`/api/tts-script`, 한 덩어리 음성). 줄마다 끊어 읽거나 줄마다 감정 태그를 붙이지 않습니다.
- 성우 목소리는 단계(주제→대본→사진→사운드→명함)를 순서대로 마친 뒤 **발행 단계에서 처음** 들려줍니다(`arVoiceAllowed()`).
- 명함을 비우면 엔딩(명함·마무리 멘트) 없이 출력합니다(`arCardEmpty()`).
- 명함의 **견본 값**(예시 혜택·예시 지점명)은 대본·화면 장식에 절대 섞이지 않게 합니다(`arDealerForCopy`, `arDisplayDealer`).
- 대본 탭은 대본만, 사진·구도 변경은 사진 탭에서.
- 오늘의 주제 → AI 대본은 "계기 → 마음 → 상품 → 가게" 한 이야기로 이어져야 합니다(예: 수능 → 지친 몸과 마음 → 따뜻한 국물 → OO식당). 흔한 AI 말투 금지 규칙은 `api/generate-script.js`의 `HUMAN_TONE_RULES`.
- 스타일 섞기는 보이는 전체 스타일에서 무작위(연속 같은 분류 금지)로 고르고, 영상을 0초부터 다시 재생합니다.
- 인기 키워드는 GitHub Actions `refresh-trends`가 매일 새벽 4시(KST)에 `public/trends-today.json`으로 받아 둡니다.

## 5. 비밀값
- kie.ai, Fish Audio, Apify, 결제·DB 키는 Vercel 환경변수에만 둡니다. 코드·커밋·로그에 넣지 않습니다.
- 사용자 개인정보(이메일·전화)를 외부 요청이나 커밋 메시지에 넣지 않습니다.
