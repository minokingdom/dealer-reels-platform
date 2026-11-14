// 랜딩(/) 전용 tailwind 설정 — 제작 화면은 기존대로 CDN 을 씀
module.exports = {
  darkMode: 'class',
  content: ['./public/index.html', './public/assets/landing/landing.js'],
  theme: { extend: {} },
  plugins: []
};
