# AutoReels 디자인 시스템 & 스타일 추가 가이드

새 디자인·모션 스타일이나 UI를 추가할 때 반드시 따르는 기준입니다. (`AGENTS.md` 3장 및 `hyperframes-dealer-reels` 스킬과 동기화됨)

---

## 1. 스튜디오 UI 디자인 토큰 (`public/assets/app/app.css`)
- **배경/서피스**: `#0f0f10` (기본 배경), `#141415` / `#18181b` (카드), `#232325` (선택/활성 컨트롤)
- **텍스트**: `#ededed` (기본), `#a1a1a6` (보조), `#85858b` (캡션·힌트)
- **포인트 컬러**: `#ededed` (주요 CTA), `#4cc38a` (상태/배지/추천), `#3b82f6` (영상/타임라인 강조)
- **타이포그래피**: UI `Pretendard`, 수치/코드 `JetBrains Mono`
- **경로 규칙**: `/` 첫 방문은 랜딩페이지(`#arLandingView`), 재방문·`/studio`는 제작 화면(`#arStudioShell`).

---

## 2. 9:16 캔버스(1080×1920) 타이포·레이아웃 규칙
- **폭 비례 크기 필수** (`12~32px` 고정 픽셀 금지):
  - 메인 자막/카피: 약 `W * 0.06`
  - 작은 라벨/태그: 약 `W * 0.026`
  - 하단 서명/브랜드: 약 `W * 0.03`
- **하단 안전 영역**: 화면 아래 약 **9%**는 이름/매장 칩 자리로 비워 둡니다.
- **가독성 규칙**:
  - `strokeText`, 글자 둘레 굵은 테두리, 겹겹이 쌓은 긴 그림자 **금지**
  - 사진 위 밝은 글자에만 옅은 그림자(`shadowBlur <= 10`, 투명도 `<= 0.25`) 허용

---

## 3. 업종·감성 스타일 규칙
- **분류 (`DESIGN_CATS`)**: 새 분류를 만들지 않고 기존 **12개 분류**에만 넣습니다. (인스타 감성 스타일은 `'감성'` 또는 `'브이로그'`)
- **구성 금지 사항**: 자동차(`auto`) 외 업종에서 **위 사진·아래 단색 글자 분할 구성 금지** (`AR_SPLIT_MOTION_IDS`로 자동차 외 업종 숨김 처리). 사진은 화면을 꽉 채우거나 종이 위 인화지·폴라로이드처럼 '물건'처럼 배치합니다.
- **인스타 감성 톤**: 차분한 크림·베이지(`#f6f1e7`, `#efe7da`), 필름 그레인, 손글씨·에디토리얼 톤. **네온·글리치·이모지·영어 장식 문구 금지.**
- **숨김 목록**: 퇴역 스타일은 `AR_RETIRED_DESIGNS`에 등록.

---

## 4. 새 모션 스타일 추가 체크리스트 (`public/assets/app/07-motion-styles.js`)
새 스타일 ID(`<id>`)를 추가할 때는 반드시 아래 세 곳을 함께 수정합니다:
1. `MOTION_ROWS`에 스타일 행 추가
2. `MOTION_CAT`에 기존 12개 분류 중 하나 매핑
3. `renderMotionFrame`에 `M === '<id>'` 분기 추가
   - 기존 도우미 재사용: `inGrain`, `inWarm`, `inPhotoFade`, `inLabel`, `inSign`, `mCaption`
   - 엔딩 아웃트로는 `renderInstaOutro` 자동 처리

---

## 5. 컷 편집기 (`public/assets/app/08-cut-editor.js`)
- 컷별 편집 상태(`cutDecos`, `cutOverlays`, `cutFilters`, `cutFrames`, `cutStrokes`)는 `localStorage`에 남기지 않고 새로고침 시 초기화합니다.
- 지원 폰트 14종(`CUT_TEXT_FONTS`), 드로우 3브러시(`펜`·`형광`·`네온`), 사진 스티커(`round`·`circle`·`polaroid`·`rect`)를 유지합니다.
