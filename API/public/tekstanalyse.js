/* ══════════════════════════════════════════════════════
   tekstanalyse.js – Norsklaben Skriveprofil-widget
   ────────────────────────────────────────────────────
   • Mountar seg i #nl-tekstanalyse (eller #ob-ai-scan / #nl-skrivelab-ai)
   • POST /api/analyser-tekst → renderar samandrag, radar, styrker, forslag
   • Knappar: open kategori i oppgåvebanken, eller start Skrivemeisteren
══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Konfigurasjon ───────────────────────────────── */
  var SCRIPT = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  var SRC = SCRIPT && SCRIPT.src ? SCRIPT.src : '';
  function defaultApiBase() {
    var h = (location.hostname || '').toLowerCase();
    if (h === 'localhost' || h === '127.0.0.1' || h === '') return 'http://localhost:3000';
    return 'http://46.224.113.120:3000';
  }
  var API_BASE =
    (typeof window !== 'undefined' && window.NL_API_BASE) ||
    (SRC ? SRC.replace(/\/[^\/]*$/, '') : defaultApiBase());

  function detectMaal() {
    if (SCRIPT && SCRIPT.dataset && SCRIPT.dataset.maal) return SCRIPT.dataset.maal === 'bm' ? 'bm' : 'nn';
    var path = (location.pathname || '').toLowerCase();
    if (/-bm\.html?$/.test(path)) return 'bm';
    var lang = (document.documentElement.lang || '').toLowerCase();
    if (lang.indexOf('nb') === 0 || lang === 'bm' || lang === 'no') return 'bm';
    return 'nn';
  }
  var MAAL = detectMaal();

  var T = MAAL === 'bm' ? {
    title: 'Skriveprofil',
    intro: 'Lim inn den siste teksten du har levert. Du får en grundig analyse, en skriveprofil og konkrete oppgaver å øve på.',
    label: 'Lim inn elevteksten din',
    placeholder: 'Lim inn teksten din her …',
    analyze: 'Analyser teksten',
    analyzing: 'Analyserer …',
    again: 'Analyser ny tekst',
    radarTitle: 'Skriveprofilen din',
    strengthsTitle: 'Det du gjør bra',
    suggestTitle: 'Øvingsforslag basert på teksten din',
    quote: 'Fra teksten din:',
    open: 'Åpne oppgaver',
    startAll: 'Start Skrivemesteren med disse kategoriene',
    empty: 'Skriv eller lim inn minst noen setninger først.',
    error: 'Noe gikk galt. Sjekk at API-et kjører.',
    short: 'Teksten er kort – analysen blir bedre med en lengre tekst.'
  } : {
    title: 'Skriveprofil',
    intro: 'Lim inn den siste teksten du har levert. Du får ein grundig analyse, ein skriveprofil og konkrete oppgåver å øve på.',
    label: 'Lim inn elevteksten din',
    placeholder: 'Lim inn teksten din her …',
    analyze: 'Analyser teksten',
    analyzing: 'Analyserer …',
    again: 'Analyser ny tekst',
    radarTitle: 'Skriveprofilen din',
    strengthsTitle: 'Det du gjer bra',
    suggestTitle: 'Øvingsforslag basert på teksten din',
    quote: 'Frå teksten din:',
    open: 'Opne oppgåver',
    startAll: 'Start Skrivemeisteren med desse kategoriane',
    empty: 'Skriv eller lim inn minst nokre setningar først.',
    error: 'Noko gjekk gale. Sjekk at API-et køyrer.',
    short: 'Teksten er kort – analysen blir betre med ein lengre tekst.'
  };

  var RADAR_AKSAR = [
    { key: 'innhald',      label: MAAL === 'bm' ? 'Innhold'         : 'Innhald' },
    { key: 'struktur',     label: 'Struktur' },
    { key: 'spraak_stil',  label: MAAL === 'bm' ? 'Språk og stil'   : 'Språk og stil' },
    { key: 'rettskriving', label: MAAL === 'bm' ? 'Rettskriving'    : 'Rettskriving' },
    { key: 'kjeldebruk',   label: MAAL === 'bm' ? 'Kildebruk'       : 'Kjeldebruk' }
  ];

  /* ─── CSS ─────────────────────────────────────────── */
  var CSS = '' +
'.nl-ta{font-family:"Source Sans 3",system-ui,sans-serif;color:#1A3D2B;line-height:1.5;}' +
'.nl-ta-card{background:#fff;border:1.5px solid #E6DFD2;border-radius:18px;padding:1.4rem 1.5rem;box-shadow:0 6px 20px rgba(26,61,43,.08);margin-bottom:1rem;}' +
'.nl-ta h3{font-family:"Playfair Display",serif;font-size:1.3rem;color:#1A3D2B;margin:0 0 .4rem;}' +
'.nl-ta h4{font-family:"Playfair Display",serif;font-size:1.05rem;color:#1A3D2B;margin:0 0 .6rem;}' +
'.nl-ta p{margin:0 0 .6rem;color:#3a4a3f;}' +
'.nl-ta-intro{color:#3a4a3f;margin:.2rem 0 1rem;font-size:.95rem;}' +
'.nl-ta-label{display:block;font-weight:600;margin:.2rem 0 .4rem;color:#1A3D2B;font-size:.92rem;}' +
'.nl-ta-textarea{width:100%;min-height:160px;padding:.85rem 1rem;border:1.5px solid #E6DFD2;border-radius:12px;font-family:inherit;font-size:1rem;line-height:1.55;color:#1A3D2B;background:#fffdf8;resize:vertical;box-sizing:border-box;}' +
'.nl-ta-textarea:focus{outline:none;border-color:#1A3D2B;box-shadow:0 0 0 3px rgba(26,61,43,.12);}' +
'.nl-ta-actions{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.8rem;}' +
'.nl-ta-btn{display:inline-flex;align-items:center;gap:.4rem;background:#1A3D2B;color:#fff;border:none;border-radius:10px;padding:.65rem 1.2rem;font:600 .95rem "Source Sans 3",sans-serif;cursor:pointer;transition:background .2s;}' +
'.nl-ta-btn:hover{background:#2E6B4F;}' +
'.nl-ta-btn[disabled]{opacity:.65;cursor:wait;}' +
'.nl-ta-btn-ghost{background:#fff;color:#1A3D2B;border:1.5px solid #E6DFD2;}' +
'.nl-ta-btn-ghost:hover{background:#f5f1ea;}' +
'.nl-ta-btn-gold{background:#C8832A;}' +
'.nl-ta-btn-gold:hover{background:#A66A1F;}' +
'.nl-ta-status{margin-top:.6rem;font-size:.9rem;color:#7a6a4a;}' +
'.nl-ta-status.err{color:#a73e23;}' +
'.nl-ta-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:nl-ta-spin .7s linear infinite;}' +
'@keyframes nl-ta-spin{to{transform:rotate(360deg);}}' +
'.nl-ta-summary{background:linear-gradient(135deg,#f6fbf7 0%,#eef7f2 100%);border:1px solid #d4e8d9;border-radius:14px;padding:1rem 1.1rem;margin-bottom:1rem;}' +
'.nl-ta-summary p{margin:0;color:#1A3D2B;font-size:.98rem;}' +
'.nl-ta-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;margin-bottom:1rem;}' +
'@media(max-width:720px){.nl-ta-grid{grid-template-columns:1fr;}}' +
'.nl-ta-radar-wrap{display:flex;justify-content:center;align-items:center;padding:.4rem 0;}' +
'.nl-ta-radar{width:100%;max-width:340px;height:auto;}' +
'.nl-ta-radar .axis{stroke:#cdbfa6;stroke-width:1;}' +
'.nl-ta-radar .grid{stroke:#e6dfd2;stroke-width:1;fill:none;}' +
'.nl-ta-radar .area{fill:rgba(200,131,42,.28);stroke:#C8832A;stroke-width:2;stroke-linejoin:round;}' +
'.nl-ta-radar .point{fill:#C8832A;}' +
'.nl-ta-radar .label{font:600 11px "Source Sans 3",sans-serif;fill:#1A3D2B;}' +
'.nl-ta-strengths{list-style:none;padding:0;margin:0;display:grid;gap:.5rem;}' +
'.nl-ta-strength{display:flex;align-items:flex-start;gap:.5rem;background:#fffaf1;border:1px solid #f1e2c4;border-left:4px solid #C8832A;border-radius:0 10px 10px 0;padding:.6rem .8rem;color:#5a4a25;font-size:.93rem;line-height:1.5;}' +
'.nl-ta-strength::before{content:"\u2728";flex:0 0 auto;}' +
'.nl-ta-suggest-list{display:grid;gap:.8rem;margin-top:.5rem;}' +
'.nl-ta-suggest{background:#fff;border:1.5px solid #E6DFD2;border-left:4px solid #1A3D2B;border-radius:0 12px 12px 0;padding:1rem 1.1rem;}' +
'.nl-ta-suggest h5{font-family:"Playfair Display",serif;font-size:1.05rem;color:#1A3D2B;margin:0 0 .35rem;}' +
'.nl-ta-suggest p{margin:0 0 .6rem;color:#3a4a3f;font-size:.94rem;}' +
'.nl-ta-quote{border-left:3px solid #C8832A;background:#fffaf1;padding:.5rem .7rem;margin:.4rem 0 .7rem;border-radius:0 8px 8px 0;font-style:italic;color:#5a4a25;font-size:.9rem;}' +
'.nl-ta-quote-lbl{display:block;font-style:normal;font-weight:600;color:#8b5815;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.15rem;}' +
'.nl-ta-suggest-actions{margin-top:.5rem;}' +
'.nl-ta-suggest-actions a{color:#1A3D2B;text-decoration:none;font-weight:600;font-size:.9rem;border-bottom:1px dashed #C8832A;}' +
'.nl-ta-suggest-actions a:hover{color:#C8832A;}' +
'.nl-ta-startall{display:block;margin:1.1rem 0 0;text-align:center;}' +
'.nl-ta-empty{padding:1rem;border:1.5px dashed #cdbfa6;border-radius:12px;color:#7a6a4a;text-align:center;font-style:italic;}';

  function injectCss() {
    if (document.getElementById('nl-ta-css')) return;
    var s = document.createElement('style');
    s.id = 'nl-ta-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ─── Mount-punkt ─────────────────────────────────── */
  function findMount() {
    return document.getElementById('nl-tekstanalyse')
        || document.getElementById('ob-ai-scan')
        || document.getElementById('nl-skrivelab-ai');
  }

  /* ─── Helpers ─────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildRadarSvg(radar) {
    var size = 280;
    var cx = size / 2, cy = size / 2;
    var rMax = 105;
    var n = RADAR_AKSAR.length;
    var levels = 6;

    function point(i, val) {
      var ang = -Math.PI / 2 + (i * 2 * Math.PI / n);
      var r = rMax * (val / levels);
      return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
    }

    var grids = '';
    for (var lvl = 1; lvl <= levels; lvl++) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = point(i, lvl);
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      }
      grids += '<polygon class="grid" points="' + pts.join(' ') + '"/>';
    }

    var axes = '', labels = '';
    for (var j = 0; j < n; j++) {
      var pe = point(j, levels);
      axes += '<line class="axis" x1="' + cx + '" y1="' + cy + '" x2="' + pe[0].toFixed(1) + '" y2="' + pe[1].toFixed(1) + '"/>';
      var lp = point(j, levels + 1.05);
      var anchor = 'middle';
      if (lp[0] < cx - 4) anchor = 'end';
      else if (lp[0] > cx + 4) anchor = 'start';
      labels += '<text class="label" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 4).toFixed(1) + '" text-anchor="' + anchor + '">' + esc(RADAR_AKSAR[j].label) + '</text>';
    }

    var areaPts = [], dots = '';
    for (var k = 0; k < n; k++) {
      var v = Number(radar[RADAR_AKSAR[k].key]);
      if (!Number.isFinite(v)) v = 1;
      v = Math.max(1, Math.min(6, v));
      var pp = point(k, v);
      areaPts.push(pp[0].toFixed(1) + ',' + pp[1].toFixed(1));
      dots += '<circle class="point" cx="' + pp[0].toFixed(1) + '" cy="' + pp[1].toFixed(1) + '" r="3.5"/>';
    }

    return '<svg class="nl-ta-radar" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + esc(T.radarTitle) + '">' +
           grids + axes +
           '<polygon class="area" points="' + areaPts.join(' ') + '"/>' +
           dots + labels + '</svg>';
  }

  function renderResult(host, data) {
    var html = '<div class="nl-ta-card">';
    html += '<h3>' + esc(T.title) + '</h3>';

    if (data.sammendrag) {
      html += '<div class="nl-ta-summary"><p>' + esc(data.sammendrag) + '</p></div>';
    }

    var hasRadar = data.radar && Object.keys(data.radar).some(function (k) { return Number.isFinite(Number(data.radar[k])); });
    var styrker = Array.isArray(data.styrker) && data.styrker.length ? data.styrker
                : (data.positivt ? [data.positivt] : []);
    var hasStrengths = styrker.length > 0;

    if (hasRadar || hasStrengths) {
      html += '<div class="nl-ta-grid">';
      if (hasRadar) {
        html += '<div><h4>' + esc(T.radarTitle) + '</h4><div class="nl-ta-radar-wrap">' + buildRadarSvg(data.radar) + '</div></div>';
      }
      if (hasStrengths) {
        html += '<div><h4>' + esc(T.strengthsTitle) + '</h4><ul class="nl-ta-strengths">';
        styrker.forEach(function (s) { html += '<li class="nl-ta-strength">' + esc(s) + '</li>'; });
        html += '</ul></div>';
      }
      html += '</div>';
    }

    var forslag = Array.isArray(data.forslag) ? data.forslag : [];
    if (forslag.length) {
      html += '<h4>' + esc(T.suggestTitle) + '</h4>';
      html += '<div class="nl-ta-suggest-list">';
      forslag.forEach(function (f) {
        html += '<article class="nl-ta-suggest">';
        html += '<h5>' + esc(f.tittel || f.kategori) + '</h5>';
        if (f.forklaring) html += '<p>' + esc(f.forklaring) + '</p>';
        if (f.eksempel_fra_teksten) {
          html += '<div class="nl-ta-quote"><span class="nl-ta-quote-lbl">' + esc(T.quote) + '</span>«' + esc(f.eksempel_fra_teksten) + '»</div>';
        }
        if (f.url) {
          html += '<div class="nl-ta-suggest-actions"><a href="' + esc(f.url) + '">' + esc(T.open) + ' →</a></div>';
        }
        html += '</article>';
      });
      html += '</div>';

      var kats = forslag.map(function (f) { return f.kategori; }).filter(Boolean);
      if (kats.length) {
        html += '<div class="nl-ta-startall">';
        html += '<button type="button" class="nl-ta-btn nl-ta-btn-gold" data-nl-ta-startall="' + esc(kats.join(',')) + '">' + esc(T.startAll) + ' →</button>';
        html += '</div>';
      }
    }

    if (data.merknad) {
      html += '<p class="nl-ta-status">' + esc(data.merknad) + '</p>';
    }

    html += '<div class="nl-ta-actions" style="margin-top:1rem"><button type="button" class="nl-ta-btn nl-ta-btn-ghost" data-nl-ta-reset="1">' + esc(T.again) + '</button></div>';
    html += '</div>';

    var resultsEl = host.querySelector('[data-nl-ta-results]');
    if (resultsEl) resultsEl.innerHTML = html;
  }

  function startSkrivemeisterenMedKats(kats) {
    var katList = kats.split(',').filter(Boolean);
    if (!katList.length) return;
    var wrap = document.getElementById('nl-ad-cats');
    if (wrap && wrap.querySelector('.adp-cat')) {
      var clear = document.getElementById('nl-ad-cats-clear');
      if (clear) clear.click();
      katList.forEach(function (k) {
        var b = wrap.querySelector('.adp-cat[data-cat="' + k + '"]');
        if (b && !b.classList.contains('on')) b.click();
      });
      var startBtn = document.getElementById('nl-ad-start');
      if (startBtn) {
        var adp = document.getElementById('nl-adaptive');
        if (adp && adp.scrollIntoView) adp.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () { startBtn.click(); }, 300);
        return;
      }
    }
    // Anna side: naviger til skrivelab med autostart
    var page = MAAL === 'bm' ? 'skrivelab-bm.html' : 'skrivelab.html';
    location.href = page + '?kats=' + encodeURIComponent(katList.join(',')) + '&auto=1#nl-adaptive';
  }

  function mount() {
    injectCss();
    var host = findMount();
    if (!host) return;
    if (host.dataset.nlTaMounted === '1') return;
    host.dataset.nlTaMounted = '1';
    host.classList.add('nl-ta');

    host.innerHTML =
      '<div class="nl-ta-card">' +
        '<h3>' + esc(T.title) + '</h3>' +
        '<p class="nl-ta-intro">' + esc(T.intro) + '</p>' +
        '<label class="nl-ta-label" for="nl-ta-input">' + esc(T.label) + '</label>' +
        '<textarea id="nl-ta-input" class="nl-ta-textarea" placeholder="' + esc(T.placeholder) + '"></textarea>' +
        '<div class="nl-ta-actions">' +
          '<button type="button" class="nl-ta-btn" data-nl-ta-go="1">' + esc(T.analyze) + '</button>' +
        '</div>' +
        '<div class="nl-ta-status" data-nl-ta-status></div>' +
      '</div>' +
      '<div data-nl-ta-results></div>';

    host.addEventListener('click', function (e) {
      var go = e.target.closest('[data-nl-ta-go]');
      if (go) { e.preventDefault(); doAnalyse(host, go); return; }

      var reset = e.target.closest('[data-nl-ta-reset]');
      if (reset) {
        e.preventDefault();
        var resultsEl = host.querySelector('[data-nl-ta-results]');
        if (resultsEl) resultsEl.innerHTML = '';
        var ta = host.querySelector('#nl-ta-input');
        if (ta) { ta.focus(); }
        return;
      }

      var sa = e.target.closest('[data-nl-ta-startall]');
      if (sa) {
        e.preventDefault();
        startSkrivemeisterenMedKats(sa.getAttribute('data-nl-ta-startall') || '');
        return;
      }
    });
  }

  function doAnalyse(host, btn) {
    var ta = host.querySelector('#nl-ta-input');
    var status = host.querySelector('[data-nl-ta-status]');
    var tekst = (ta && ta.value || '').trim();

    status.classList.remove('err');
    status.textContent = '';

    if (tekst.length < 40) {
      status.classList.add('err');
      status.textContent = T.empty;
      return;
    }

    btn.disabled = true;
    var origLabel = btn.textContent;
    btn.innerHTML = '<span class="nl-ta-spinner"></span> ' + esc(T.analyzing);
    if (tekst.length < 200) status.textContent = T.short;

    fetch(API_BASE + '/api/analyser-tekst', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tekst: tekst, maal: MAAL })
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.feil || ('HTTP ' + r.status)); });
        return r.json();
      })
      .then(function (data) {
        renderResult(host, data);
        status.textContent = '';
        var resEl = host.querySelector('[data-nl-ta-results]');
        if (resEl && resEl.scrollIntoView) resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function (err) {
        status.classList.add('err');
        status.textContent = T.error + ' (' + (err.message || err) + ')';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = origLabel;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
