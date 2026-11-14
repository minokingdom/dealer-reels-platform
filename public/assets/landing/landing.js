// AutoReels 랜딩 (/) — 업종별 미리보기 + 제작 화면으로 이동
// 업종 데이터는 배포 때 scripts/build-app.mjs 가 01-industries.js 에서 뽑아 industries.js(window.AR_LP_INDUSTRIES)로 만듦
(function () {
  var INDS = window.AR_LP_INDUSTRIES || {};
  var current = 'auto';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  function selectIndustry(key) {
    var ind = INDS[key] || INDS.auto;
    if (!ind) return;
    current = ind.key;
    var grid = document.getElementById('landingIndustryGrid');
    if (grid) {
      grid.innerHTML = Object.keys(INDS).map(function (k) {
        var it = INDS[k], on = it.key === ind.key;
        return '<button type="button" data-ind="' + esc(it.key) + '" class="px-3 py-2.5 rounded-[10px] border text-left cursor-pointer transition ' +
          (on ? 'bg-[#ededed] text-[#09090b] border-[#ededed] font-semibold' : 'bg-[#141415] hover:bg-[#1b1b1e] text-[#d4d4d8] border-[var(--border)]') + '">' +
          '<div class="text-[13px] truncate">' + esc(it.icon) + ' ' + esc(it.name) + '</div>' +
          '<div class="text-[11px] opacity-70 truncate mt-0.5">' + esc(it.role) + ' · ' + esc(it.product) + '</div></button>';
      }).join('');
    }
    var where = ind.branchPlaceholder || ind.place;
    setText('landingPhoneBadge', ind.icon + ' ' + ind.name);
    setText('landingPhoneHook', ind.vlogDone || (ind.name + ' 프로모션'));
    setText('landingPhoneSub', where + ' · "' + (ind.chatAsk || ind.cta) + '" — ' + ind.promise);
    var tags = document.getElementById('landingPhoneTags');
    if (tags) tags.innerHTML = (ind.hashtags || []).slice(0, 4).map(function (t) { return '<span class="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/80">#' + esc(t) + '</span>'; }).join('');
    setText('landingPhonePlace', where + ' · ' + ind.title);
    setText('landingPhonePromo', ind.promoPlaceholder || '');
    setText('landingStartIndustryBtn', ind.icon + ' ' + ind.name + '으로 바로 만들기 →');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-ind],[data-go],[data-go-ind]');
    if (!t) return;
    if (t.hasAttribute('data-ind')) { selectIndustry(t.getAttribute('data-ind')); return; }
    var url = t.hasAttribute('data-go-ind') ? '/studio?ind=' + encodeURIComponent(current) : t.getAttribute('data-go');
    try { localStorage.setItem('ar_visited_studio', '1'); } catch (err) {}
    location.href = url;
  });

  selectIndustry('auto');
})();
