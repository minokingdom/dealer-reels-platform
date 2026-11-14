// 매일 새벽 업종별 인기 키워드를 미리 받아 public/trends-today.json 에 저장
// - GitHub Actions(.github/workflows/refresh-trends.yml)가 한국 시간 새벽 4시에 실행
// - 운영 서버 /api/trends 를 refresh=1 로 불러 최신 인기 릴스 제목·해시태그를 받음 (Apify 토큰은 Vercel 서버에만 있음)
// - 화면의 "오늘의 주제" 추천이 이 파일을 먼저 읽어 인기 키워드를 바로 반영함 (DB 없이도 빠르게)
// 사용: node scripts/refresh-trends.mjs [사이트 주소]
import { writeFile, readFile } from 'node:fs/promises';

const BASE = process.argv[2] || process.env.SITE_URL || 'https://dealer-reels-platform.vercel.app';
const INDUSTRIES = ['auto', 'restaurant', 'cafe', 'beauty', 'realestate', 'academy', 'clinic', 'fitness', 'shop', 'interior'];
const OUT = new URL('../public/trends-today.json', import.meta.url);

let prev = { industries: {} };
try { prev = JSON.parse(await readFile(OUT, 'utf8')); } catch (e) { /* 처음 실행 */ }

const kst = new Date(Date.now() + 9 * 3600000);
const out = { date: kst.toISOString().slice(0, 10), updatedAt: new Date().toISOString(), industries: {} };
let okCount = 0;
for (const ind of INDUSTRIES) {
  try {
    const res = await fetch(`${BASE}/api/trends?industry=${ind}&refresh=1`, { signal: AbortSignal.timeout(70000) });
    const j = await res.json();
    const items = (Array.isArray(j.items) ? j.items : [])
      .map((it) => {
        // 제목(해시태그 뺀 앞부분 50자) + 해시태그 4개
        const title = String(it.title || (it.theme && it.theme.hookCaption) || '').replace(/#[^\s#]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 50);
        const tags = (String(it.fullCaption || it.title || '').match(/#[가-힣a-zA-Z0-9_]+/g) || []).slice(0, 4).join(' ');
        return [title, tags].join(' ').trim();
      })
      .filter(Boolean)
      .slice(0, 8);
    if (items.length) {
      out.industries[ind] = { source: j.source || '', keywords: items };
      okCount++;
    } else if (prev.industries && prev.industries[ind]) {
      out.industries[ind] = { ...prev.industries[ind], stale: true }; // 이번에 못 받으면 어제 것 유지
    }
    console.log(ind, j.source, items.length);
  } catch (e) {
    console.log(ind, 'error', e.message);
    if (prev.industries && prev.industries[ind]) out.industries[ind] = { ...prev.industries[ind], stale: true };
  }
}
if (!okCount) {
  console.log('받은 업종이 없어 파일을 바꾸지 않습니다');
  process.exit(0);
}
await writeFile(OUT, JSON.stringify(out, null, 1) + '\n');
console.log('saved', okCount, 'industries');
