# AutoReels — 업종별 프로모션 숏폼/릴스 자동 제작 & 멀티 SNS 발행 플랫폼

자동차 딜러(카마스터)용으로 시작해, 지금은 **자영업·전문직 10개 업종**의 9:16 프로모션 릴스를 만들고 검수한 뒤 여러 SNS에 한 번에 올리는 구독형 플랫폼입니다.
공통 본편 위에 사용자별 정보(이름·매장·연락처·혜택)를 합성하는 **원소스 멀티유즈** 구조를 유지합니다.

## 지원 업종

| 키 | 업종 | 호칭 | 엔딩 카드 |
| --- | --- | --- | --- |
| `auto` | 자동차 영업 | 카마스터 | 개인 명함 |
| `restaurant` | 음식점 | 사장님 | 매장 안내 |
| `cafe` | 카페·디저트 | 사장님 | 매장 안내 |
| `beauty` | 미용·네일·뷰티 | 원장님 | 매장 안내 |
| `realestate` | 부동산 중개 | 공인중개사 | 매장 안내 |
| `academy` | 학원·교육 | 원장님 | 매장 안내 |
| `clinic` | 병원·의원 | 원장님 | 매장 안내 |
| `fitness` | 헬스·필라테스 | 트레이너 | 매장 안내 |
| `shop` | 쇼핑몰·소매 | 스토어 | 매장 안내 |
| `interior` | 인테리어·시공 | 실장님 | 매장 안내 |

업종마다 입력 항목 이름, 기본 문구, 해시태그, AI 카피 역할, 장면 사진(`public/assets/scenes/<업종>/1~10.jpg`)이 따로 정의되어 있습니다. 업종 정의는 `public/assets/app/01-industries.js`, 서버 쪽 허용 목록은 `api/account.js`의 `INDUSTRY_KEYS`에 있습니다.

## 주요 기능

1. **업종별 릴스 자동 합성**
   - 공통 프로모션 본편 하단에 사용자 정보 바를 띄우고, 마지막에 엔딩 카드를 붙입니다. 자동차는 개인 명함, 나머지 업종은 매장 안내 카드(매장명·위치·혜택)입니다.
   - 컷별 레이아웃, 자막, 장식, 키네틱 타이포, 화면 전환 테마를 고를 수 있는 디자인 키트가 있습니다.
   - 브라우저(Canvas + `mp4-muxer`)에서 미리보기와 영상 추출을 하고, 서버용으로 `ffmpeg-compositor.js`, `hyperframes-renderer.js`가 있습니다.
2. **AI 대본 · 성우 내레이션**
   - `api/generate-script.js`: 한 줄 상황 입력으로 컷 자막, 내레이션 대본, 카톡 상담 대화, 컬러 테마, 컷 구성을 만듭니다.
   - `api/tts*.js`: Fish Audio 한국어 AI 성우. 대본 전체를 한 번에 녹음한 뒤 문장별로 잘라 씁니다.
3. **업종별 트렌드 릴스 참고**
   - `api/trends.js`: 업종 키워드로 인스타그램 인기 릴스를 가져오고(Apify 또는 Instagram Graph API), 없으면 YouTube Shorts로 대신합니다. 결과는 Postgres(`ar_trend_cache`)에 캐시합니다.
4. **검수 · 승인 후 멀티 SNS 발행**
   - 인스타그램, 페이스북, 유튜브, 틱톡, 스레드 계정을 연결하고 한 번에 발행합니다(`api/sns.js`, `lib/server/sns.js`).
   - 예약 발행을 지원하며, `api/cron-sns.js`가 매일 예약분을 처리합니다.
5. **회원 · 구독 결제**
   - 회원가입, 로그인, 구독, 해지, 결제 내역은 `api/account.js`에서 처리합니다. 카드 정기결제는 베이온을 씁니다(`lib/server/billing.js`, `api/veyon-webhook.js`).
   - 자동 갱신 결제는 `api/cron-billing.js`가 매일 실행합니다.

## 요금제 (`lib/server/plans.js`)

| 요금제 | 금액 | 주기 | 성우 글자 수 / AI 대본 (월) |
| --- | --- | --- | --- |
| 주간 스타터 | 50,000원 | 7일 | 30,000자 / 150회 |
| 월간 PRO | 150,000원 | 1개월 | 120,000자 / 600회 |
| 연간 VIP | 1,200,000원 | 12개월 | 120,000자 / 600회 |

무료 회원은 월 2,000자 / 10회, 비로그인 방문자는 하루 400자 / 3회입니다. 한도는 환경변수 `PLAN_LIMITS_JSON`으로 바꿀 수 있습니다.

## 프로젝트 구조

- `public/index.html` + `public/assets/app/*.js` — 올인원 스튜디오 (업종 선택, 디자인 키트, 9:16 실시간 미리보기, 영상 추출, 발행). 파일 구성과 규칙은 `docs/code-structure.md`
- `public/assets/scenes/` — 업종별 장면 사진
- `api/` — Vercel 서버리스 함수 (계정·결제, AI 대본, TTS, 트렌드, SNS 발행, 크론)
- `lib/server/` — DB, 세션, 요금제·사용량, 결제, SNS 공통 모듈
- `lib/fish-voices.js`, `lib/korean-numbers.js` — 성우 목록, 숫자의 한국어 읽기 변환
- `rust-engine/` → `public/autoreels_core.wasm` — 라이선스 검증 Wasm 코어
- `server.js` — 로컬 실행용 Node.js 서버
- `ffmpeg-compositor.js`, `hyperframes-renderer.js` — 서버 쪽 영상 합성·렌더링 모듈
- `instagram-api.js`, `multi-sns-publisher.js` — 초기 인스타그램 / 멀티 SNS 발행 모듈

## 배포

Vercel에 배포합니다(`vercel.json`). `/api/`, `/assets/`가 아닌 경로는 모두 `index.html`로 보냅니다.
크론은 매일 01:00(UTC) `cron-billing`, 02:00(UTC) `cron-sns`가 실행됩니다.
