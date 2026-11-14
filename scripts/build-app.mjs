// public/assets/app/NN-*.js 를 번호 순서대로 이어 붙여 public/assets/app/app.js 하나로 만든다.
// 이유: 파일을 따로따로 불러오면 파일 사이사이에 타이머·Promise 가 먼저 실행되어,
//       아직 안 불러온 뒤 파일의 함수를 부르다 멈추는 일이 생김(디자인 썸네일이 비던 문제).
//       하나로 합치면 예전 한 덩어리 스크립트처럼 끝까지 한 번에 실행된다.
// Vercel 배포(buildCommand), 로컬 서버(server.js), 스모크 테스트가 모두 이 스크립트를 먼저 돌린다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export function buildApp(repoRoot) {
  const dir = path.join(repoRoot, 'public', 'assets', 'app');
  const parts = fs.readdirSync(dir).filter((f) => /^\d\d-.+\.js$/.test(f)).sort();
  if (!parts.length) throw new Error('no app parts in ' + dir);
  const body = parts.map((f) => `// ===== ${f} =====\n` + fs.readFileSync(path.join(dir, f), 'utf8').replace(/\s+$/, '') + '\n').join('\n');
  const out = `// 자동 생성 파일 — 고치지 마세요. 원본: public/assets/app/NN-*.js (scripts/build-app.mjs)\n` + body;
  fs.writeFileSync(path.join(dir, 'app.js'), out);
  const lp = buildLandingIndustries(repoRoot);
  return { parts: parts.length, bytes: Buffer.byteLength(out), landingIndustries: lp };
}

// 랜딩(/)용 업종 데이터: 01-industries.js 의 AR_INDUSTRIES 에서 미리보기에 필요한 필드만 뽑아 작은 파일로
// (랜딩이 1.7MB 제작 화면 코드를 받지 않게)
export function buildLandingIndustries(repoRoot) {
  const src = fs.readFileSync(path.join(repoRoot, 'public', 'assets', 'app', '01-industries.js'), 'utf8');
  const a = src.indexOf('const AR_INDUSTRIES = {');
  if (a < 0) throw new Error('AR_INDUSTRIES not found');
  let depth = 0, i = src.indexOf('{', a), end = -1;
  for (; i < src.length; i++) { const ch = src[i]; if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } } }
  const obj = vm.runInNewContext('(' + src.slice(src.indexOf('{', a), end) + ')', {});
  const KEEP = ['key', 'name', 'icon', 'role', 'title', 'product', 'place', 'cta', 'promise', 'vlogDone', 'chatAsk', 'hashtags', 'branchPlaceholder', 'promoPlaceholder'];
  const slim = {};
  for (const [k, v] of Object.entries(obj)) { slim[k] = {}; for (const f of KEEP) if (v[f] !== undefined) slim[k][f] = v[f]; }
  const out = '// 자동 생성 — 고치지 마세요 (scripts/build-app.mjs, 원본 01-industries.js)\nwindow.AR_LP_INDUSTRIES = ' + JSON.stringify(slim) + ';\n';
  fs.mkdirSync(path.join(repoRoot, 'public', 'assets', 'landing'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'public', 'assets', 'landing', 'industries.js'), out);
  return Object.keys(slim).length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const r = buildApp(root);
  console.log(`app.js built from ${r.parts} parts, ${r.bytes} bytes; landing industries: ${r.landingIndustries}`);
}
