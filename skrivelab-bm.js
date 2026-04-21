(function(){

if (typeof window !== 'undefined') {
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    window.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (window.HTMLCollection && !window.HTMLCollection.prototype.forEach) {
    window.HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }
}

function nlBoot() {

  var nlUseV2Adaptive = (typeof window !== 'undefined' && typeof window.mtStart === 'function');

  if (document.body) {
    document.body.classList.add('nl-js-collapsible');
  }

  function nlSafeInit(label, fn) {
    try {
      fn();
    } catch (err) {
      if (window.console && console.error) {
        console.error('[Skrivelab:init]', label, err);
      }
    }
  }

  nlSafeInit('ensure-bank-ob-styles', nlEnsureBankObStyles);

  nlSafeInit('ensure-bank-shell', nlEnsureBankShell);
  nlSafeInit('load-tekstanalyse', nlLoadTekstanalyseWidget);
  nlSafeInit('import-bank-tasks', nlImportMTBankTasks);
  nlSafeInit('normalize-categories', nlNormalizeCategories);
  nlSafeInit('normalize-types-and-titles', nlNormalizeExerciseMetaFromType);

  /* ── Card open/close + exercise modal (delegated for robustness) ── */
  document.addEventListener('click', function(e) {
    var catStartBtn = e.target.closest('.nl-ob-start-cat');
    if (catStartBtn) {
      e.preventDefault();
      e.stopPropagation();
      var cat = String(catStartBtn.getAttribute('data-cat') || '').trim();
      if (!cat) return;
      var firstEi = document.querySelector('.main .card[data-cat="' + cat + '"] .exlist > .ei');
      if (!firstEi) {
        if (window.alert) window.alert('Ingen oppgaver er klare i denne kategorien ennå.');
        return;
      }
      nlSafeInit('open-bank-category', function() { nlOpenManualQueueInMt(firstEi); });
      return;
    }

    var cardHead = e.target.closest('.ch');
    if (cardHead) {
      var card = cardHead.closest('.card');
      if (card) card.classList.toggle('open');
      return;
    }

    var exBtn = e.target.closest('.etog');
    if (!exBtn) return;
    var ei = exBtn.closest('.ei');
    if (!ei) return;
    nlSafeInit('open-bank-exercise', function() { nlOpenManualQueueInMt(ei); });
  });

  /* ── Search ── */
  var si = document.getElementById('search-input');
  if (si) {
    si.addEventListener('input', function() {
      nlFilter(si.value.toLowerCase().trim(), nlOp());
    });
  }

  /* ── Chips ── */
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(c) {
    c.addEventListener('click', function() {
      Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(x){ x.classList.remove('active'); });
      c.classList.add('active');
      nlFilter(si ? si.value.toLowerCase().trim() : '', c.dataset.op);
    });
  });

  /* ── Fasit buttons ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-fasit');
    if (!btn) return;
    var box = document.getElementById(btn.dataset.fasit);
    if (!box) return;
    box.classList.toggle('vis');
    var fb = box.querySelector('.fb');
    if (fb) fb.classList.toggle('shown', box.classList.contains('vis'));
    var fl = box.querySelector('.fl');
    var title = fl ? fl.textContent.toLowerCase() : '';
    var isR = title.indexOf('rettlei') !== -1;
    var isH = title.indexOf('hint') !== -1;
    var open = box.classList.contains('vis');
    btn.textContent = open
      ? (isH ? 'Skjul hint' : (isR ? 'Skjul rettleiing' : 'Skjul fasit'))
      : (isH ? 'Vis hint' : (isR ? 'Vis rettleiing' : 'Vis fasit'));
  });

  /* ── Check buttons ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-check');
    if (!btn) return;
    var t = btn.dataset.check, tgt = btn.dataset.target, sid = btn.dataset.score;
    if (t === 'fill') nlCheckFill(tgt, sid);
    if (t === 'fix')  nlCheckFix(tgt, sid);
    if (t === 'rank') nlCheckRank(tgt, sid);
    if (t === 'mark') nlCheckMark(tgt, sid);
    if (t === 'sort') nlCheckSort(tgt, sid);
    if (t === 'burger') nlCheckBurger(tgt, sid);
    if (t === 'mc') nlCheckMc(tgt, sid);
    if (t === 'mcset') nlCheckMcSet(tgt, sid);
    if (t === 'fillsel') nlCheckFillSel(tgt, sid);
    if (t === 'drag-ord') nlCheckDragOrd(tgt, sid);
    if (t === 'write') nlCheckWrite(tgt, sid);
    if (t === 'rhythm') nlCheckRhythm(btn);
  });

  /* ── Reset buttons ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-reset');
    if (!btn || !btn.dataset.reset) return;
    var t = btn.dataset.reset, tgt = btn.dataset.target, sid = btn.dataset.score;
    if (t === 'fill') nlResetFill(tgt, sid);
    if (t === 'fix')  nlResetFix(tgt, sid);
    if (t === 'rank') { nlBuildRank(tgt); if(sid) nlClearScore(sid); }
    if (t === 'mark') nlResetMark(tgt, sid);
    if (t === 'sort') { nlBuildSort(tgt); if(sid) nlClearScore(sid); }
    if (t === 'burger') nlResetBurger(tgt, sid);
    if (t === 'mc') nlResetMc(tgt, sid);
    if (t === 'mcset') nlResetMcSet(tgt, sid);
    if (t === 'fillsel') nlResetFillSel(tgt, sid);
    if (t === 'drag-ord') nlResetDragOrd(tgt, sid);
    if (t === 'rhythm') nlResetRhythm(tgt, sid);
  });

  /* ── Rhythm pick click handling ── */
  document.addEventListener('click', function(e) {
    var pick = e.target.closest('.rhythm-pick');
    if (!pick) return;
    var wrap = pick.closest('.rhythm-wrap');
    if (!wrap) return;
    wrap.querySelectorAll('.rhythm-pick').forEach(function(p) {
      p.style.borderColor = 'transparent'; p.style.background = '';
    });
    pick.style.borderColor = 'var(--mid)';
    pick.style.background = 'var(--plight)';
    var hid = document.getElementById('rhythm-val-' + wrap.id.replace('rhythm-', ''));
    if (hid) hid.value = pick.getAttribute('data-val');
  });

  /* ── Drag-ord click handling ── */
  document.addEventListener('click', function(e) {
    var tok = e.target.closest('.drag-ord-token');
    if (tok) {
      if (tok.dataset.nlTouchDragged === '1') return;
      nlDragOrdMoveToAnswer(tok);
      return;
    }
    var picked = e.target.closest('.drag-ord-picked');
    if (picked) {
      if (picked.dataset.nlTouchDragged === '1') return;
      nlDragOrdMoveToBank(picked);
    }
  });

  /* ── MC radio changes: auto-check in adaptive mode, else clear score ── */
  document.addEventListener('change', function(e) {
    var inp = e.target && e.target.matches && e.target.matches('input[type="radio"]') ? e.target : null;
    if (!inp) return;
    var area = inp.closest('.mcq-area');
    if (!area) return;

    // Adaptive mode + single-MC: auto-check immediately
    if (nlAdState && nlAdState.active) {
      var cur = nlAdCurrentExercise ? nlAdCurrentExercise() : null;
      if (cur && cur.contains(area) && !nlAdState.checked.has(cur)) {
        var checkEl = cur.querySelector('.btn-check');
        if (checkEl && checkEl.dataset.check === 'mc') {
          setTimeout(function() { nlAdTriggerCheck(); }, 60);
          return;
        }
      }
    }

    area.querySelectorAll('.mcq-opt').forEach(function(opt){ opt.classList.remove('ok', 'err'); });
    if (area.dataset.score) nlClearScore(area.dataset.score);
  });

  /* ── Click-and-mark items ── */
  document.addEventListener('click', function(e) {
    var item = e.target.closest('.mark-item');
    if (!item) return;
    item.classList.toggle('sel');
    item.classList.remove('ok', 'err', 'missed');

    var area = item.closest('.mark-area');
    if (!area) return;
    var sid = area.dataset.score;
    if (sid) nlClearScore(sid);
  });

  /* ── Build all rank exercises ── */
  Array.prototype.forEach.call(document.querySelectorAll('.rank-list[data-items]'), function(el) {
    nlBuildRank(el.id);
  });
  /* ── Build all sort exercises ── */
  Array.prototype.forEach.call(document.querySelectorAll('.sort-ex'), function(el) {
    nlBuildSort(el.id);
  });
  Array.prototype.forEach.call(document.querySelectorAll('.burger-ex'), function(el) {
    nlBuildBurger(el.id);
  });
  nlSafeInit('init-drag-ord', nlInitDragOrd);

  nlSafeInit('init-write-checks', nlInitWriteChecks);
  nlSafeInit('init-multi-part-inputs', nlInitMultiPartInputs);
  nlSafeInit('init-contextual-placeholders', nlInitContextualWritePlaceholders);
  nlSafeInit('hide-fix-fasit-buttons', nlHideFixFasitButtons);
  nlSafeInit('reset-visibility-state', nlResetExerciseVisibilityState);

  nlSafeInit('init-bank-modal', nlInitBankModal);
  nlSafeInit('refresh-counts', nlRefreshCounts);
  if (!nlUseV2Adaptive) {
    nlSafeInit('init-adaptive', nlInitAdaptive);
    nlSafeInit('front-insights', nlRenderFrontInsights);
    nlSafeInit('welcome-modal', nlShowWelcomeModal);
  } else {
    nlSafeInit('bind-v2-retry', function() {
      var retryBtn = document.getElementById('nl-ad-retry');
      if (!retryBtn || retryBtn.dataset.nlV2Bound === '1') return;
      retryBtn.dataset.nlV2Bound = '1';
      retryBtn.addEventListener('click', function() {
        if (typeof window.mtStartFeillogg !== 'function') return;
        /* Sjekk om det finst feil å øve på først */
        var logg = (typeof window.mtFeilloggGet === 'function') ? window.mtFeilloggGet() : [];
        if (!logg || !logg.length) {
          alert('Ingen tidligere feil å øve på ennå.');
          return;
        }
        /* Skjul skrivelab-eige UI før vi opnar v2-modalen */
        var mainEl = document.querySelector('.main');
        var adaptivePanel = document.getElementById('nl-adaptive');
        if (mainEl) mainEl.style.display = 'none';
        if (adaptivePanel) adaptivePanel.style.display = 'none';
        window.mtStartFeillogg();
      });
    });

    /* Wrap mtAbort slik at skrivelab-UI kjem tilbake etter lukking */
    nlSafeInit('wrap-v2-abort', function() {
      var origAbort = window.mtAbort;
      if (typeof origAbort !== 'function') return;
      window.mtAbort = function() {
        origAbort();
        var mainEl = document.querySelector('.main');
        var adaptivePanel = document.getElementById('nl-adaptive');
        if (mainEl) mainEl.style.display = '';
        if (adaptivePanel) adaptivePanel.style.display = '';
      };
    });
  }

  // Safety net: if adaptive categories are still empty, rebuild once.
  if (!nlUseV2Adaptive) {
    nlSafeInit('adaptive-cats-fallback', function() {
      var catsWrap = document.getElementById('nl-ad-cats');
      if (!catsWrap) return;
      if (catsWrap.querySelector('.adp-cat')) return;
      nlInitAdaptive();
    });
  }

  if (typeof window !== 'undefined') {
    window.__nlSkrivelabBootDone = true;
  }

  /* ── Deep-link: ?kat=og_aa auto-selects category and starts ── */
  nlSafeInit('url-kat-autostart', function() {
    try {
      var params = new URLSearchParams(window.location.search);
      var katParam = params.get('kat');
      if (!katParam) return;
      var requested = katParam.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      if (!requested.length) return;
      var modeParam = String(params.get('mode') || '').toLowerCase();
      var wantsManual = (modeParam === 'manual' || modeParam === 'manuell' || modeParam === 'mt');

      if (nlUseV2Adaptive && typeof window.mtStart === 'function') {
        /* V2: velg bare etterspurte kategorier */
        document.querySelectorAll('#nl-ad-cats .adp-cat').forEach(function(btn) {
          btn.classList.remove('on');
        });
        requested.forEach(function(kat) {
          var btn = document.querySelector('#nl-ad-cats .adp-cat[data-cat="' + kat + '"]');
          if (btn) btn.classList.add('on');
        });
        var secV2 = document.getElementById('nl-adaptive');
        if (secV2) secV2.scrollIntoView({ behavior:'smooth', block:'start' });
        if (wantsManual) {
          setTimeout(function() {
            var firstCat = requested[0];
            var resolvedCat = firstCat;
            if (resolvedCat && !document.querySelector('.main .card[data-cat="' + resolvedCat + '"]')) {
              var mappedCat = (typeof nlMtResolveCard === 'function') ? nlMtResolveCard(resolvedCat) : '';
              if (mappedCat) resolvedCat = mappedCat;
            }
            var firstEi = resolvedCat
              ? document.querySelector('.main .card[data-cat="' + resolvedCat + '"] .exlist > .ei')
              : null;
            if (firstEi) nlOpenManualQueueInMt(firstEi);
            else if (typeof window.mtStartManualQueue === 'function' && Array.isArray(window.BANKV2)) {
              var manualTasks = window.BANKV2.filter(function(t) {
                return t && requested.indexOf(String(t.kat || '').trim()) !== -1;
              });
              if (manualTasks.length) window.mtStartManualQueue(manualTasks);
              else window.mtStart();
            } else window.mtStart();
          }, 180);
        } else {
          setTimeout(function() { window.mtStart(); }, 180);
        }
      } else {
        /* Legacy: Deselect all, then select only requested */
        nlAdSetAllCats(false);
        requested.forEach(function(kat) {
          var btn = document.querySelector('#nl-ad-cats .adp-cat[data-cat="' + kat + '"]');
          if (btn) btn.classList.add('on');
        });
        /* Scroll to adaptive section */
        var sec = document.getElementById('nl-adaptive');
        if (sec) sec.scrollIntoView({ behavior:'smooth', block:'start' });
        /* Auto-start after a short delay so UI is ready */
        setTimeout(function() { nlAdStart(); }, 350);
      }

      var secAny = document.getElementById('nl-adaptive');
      if (secAny) secAny.scrollIntoView({ behavior:'smooth', block:'start' });
      /* Clean URL without reload */
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch(_) {}
  });

} // end nlBoot

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', nlBoot);
} else {
  nlBoot();
}

window.addEventListener('pageshow', function() {
  try { nlResetExerciseVisibilityState(); } catch (err) {}
  try {
    if (typeof window !== 'undefined' && typeof window.mtStart === 'function') return;
    var catsWrap = document.getElementById('nl-ad-cats');
    if (catsWrap && !catsWrap.querySelector('.adp-cat')) {
      nlInitAdaptive();
    }
  } catch (err) {}
});

var nlCategoryData = [
  // Gruppe 1 – Grunnleggende grammatikk (7 kategorier)
  [
    {n: 'Og / Å',             d: 'Forskjellen mellom bindeordet «og» og infinitivsmerket «å».'},
    {n: 'Bindeord',           d: 'Bruk bindeord til å binde setninger og avsnitt sammen.'},
    {n: 'Konsonantdobling',   d: 'Kort vokal = dobbel konsonant. Lang vokal = enkel.'},
    {n: 'Tegnsetting',       d: 'Komma, kolon, semikolon og hermetegn – når bruker du hva?'},
    {n: 'Særskriving',        d: 'Skal det være ett ord eller to? Reglene for sammensetning.'},
    {n: 'Ordklasser',         d: 'Substantiv, verb, adjektiv – kjenner du igjen ordklassene?'},
    {n: 'Forstå oppgaven',     d: 'Hva vil egentlig oppgaven? Nøkkelord og oppgaveord.'}
  ],
  // Gruppe 2 – Setning og avsnitt (5 kategorier)
  [
    {n: 'Setningsbygging',    d: 'Klipp løpende setninger, varier åpninger, slå sammen og analyser rytme.'},
    {n: 'Temasetning',        d: 'Hvert avsnitt trenger en temasetning – skriver og finn dem.'},
    {n: 'Årsak og virkning',   d: '«Fordi», «derfor», «som følge av» – bygg logiske kjeder.'},
    {n: 'Referansebinding',   d: 'Unngå å gjenta samme ord – varier referansene i teksten.'},
    {n: 'Disposisjon',        d: 'Planlegg teksten – sett avsnitt i rett rekkefølge.'}
  ],
  // Gruppe 3 – Tekst og sjanger (5 kategorier)
  [
    {n: 'Tekststruktur',         d: 'Ingress, hoveddel og avslutning – hva hører hjemme hvor?'},
    {n: 'Sjanger og register',   d: 'Fagartikkel, blogg eller kåseri – kjenner du sjangrene?'},
    {n: 'Drøfting',              d: 'Se begge sider, vei argumenter og trekk en slutning.'},
    {n: 'Overskrift og ingress', d: 'En god overskrift fanger leseren. Hvordan lager du en?'},
    {n: 'Tekstopning',           d: 'Unngå klisjeer – åpne teksten med noe som griper tak.'}
  ],
  // Gruppe 4 – Kildebruk (4 kategorier)
  [
    {n: 'Kildebruk',        d: 'Korrekt format på kildeliste og kildehenvisninger i teksten.'},
    {n: 'Parafrase',         d: 'Skriv om med egne ord – ikke kopier fra kilden.'},
    {n: 'Sitat',             d: 'Hvordan integrerer du et sitat grammatisk og korrekt?'},
    {n: 'Tal og statistikk', d: 'Gjør tall forståelige og skriver om usikre statistikker.'}
  ],
  // Gruppe 5 – Språk og stil (3 kategorier)
  [
    {n: 'Ordvalg og presisjon',  d: 'Velg presise ord – ikke bare «farlig», «problem», «mange ting».'},
    {n: 'Bruke eksempel',       d: 'Gode eksempler gjør meningene dine tydelige og troverdige.'},
    {n: 'Tilpass til leseren',  d: 'Forklar fagord og uttrykk slik at leseren forstår.'}
  ]
];

var nlCategoryIdsByGroup = [
  ['og-aa', 'bindeord-overganger', 'dobbel-konsonant', 'teiknsetting', 'saerskriving-sammensetning', 'ordklasse', 'oppgaveforstaing'],
  ['setningsbygging', 'temasetning', 'aarsak-sammenheng', 'referansekjede', 'logisk-struktur'],
  ['tekststruktur-delar', 'sjangerkompetanse', 'debattinnlegg', 'overskrift-ingress', 'fagartikkel'],
  ['kjeldebruk', 'parafrase', 'sitat', 'tal-og-statistikk'],
  ['ordval', 'bruke-eksempel', 'tilpass-til-lesaren']
];

var nlGroupTitles = [
  'Grunnleggende grammatikk',
  'Setning og avsnitt',
  'Tekst og sjanger',
  'Kildebruk',
  'Språk og stil'
];

function nlEnsureBankObStyles() {
  if (document.getElementById('nl-ob-bank-css')) return;
  var s = document.createElement('style');
  s.id = 'nl-ob-bank-css';
  s.textContent = [
    '.nl-bank-scan{max-width:960px;margin:0 auto 1.2rem;padding:0 1rem}',
    '.nl-bank-scan .ob-ai{background:linear-gradient(135deg,#f0f7f2 0%,#e8f3ec 100%);border:1.5px dashed #9fc4a8;border-radius:1rem;padding:1.1rem 1.2rem;text-align:center}',
    '.nl-bank-scan .ob-ai-icon{font-size:1.6rem;margin-bottom:.2rem}',
    '.nl-bank-scan .ob-ai h3{font-family:"Playfair Display",serif;font-size:1.05rem;margin:0 0 .2rem;color:var(--fg,var(--primary,#1A3D2B))}',
    '.nl-bank-scan .ob-ai p{font-size:.88rem;color:#5a6a5e;margin:0;line-height:1.4}',
    '.main .grp .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1rem}',
    '.main .card[data-cat]{background:#fff;border:1px solid #dce6df;border-radius:.85rem;padding:1rem 1rem .85rem;transition:box-shadow .15s,transform .15s}',
    '.main .card[data-cat]:hover{box-shadow:0 4px 14px rgba(26,61,43,.10);transform:translateY(-2px)}',
    '.main .card[data-cat] .ch{background:transparent;border:none;padding:0;width:100%;text-align:left;cursor:pointer;display:block}',
    '.main .card[data-cat] .cn{display:block;font-family:"Playfair Display",serif;font-size:1.05rem;font-weight:600;color:var(--fg,var(--primary,#1A3D2B));margin:0 0 .45rem}',
    '.main .card[data-cat] .exc{display:inline-block;font-size:.72rem;padding:.18rem .5rem;border-radius:9px;font-weight:600;background:#e8f3ec;color:#1A7A50;margin:0 0 .45rem}',
    '.main .card[data-cat] .cd{display:block;font-size:.78rem;color:#7a8a7e;line-height:1.4;margin:0 0 .65rem}',
    '.main .card[data-cat] .nl-ob-actions{display:flex;gap:.45rem;flex-wrap:wrap;margin:0 0 .5rem}',
    '.main .card[data-cat] .nl-ob-start-cat{display:inline-flex;align-items:center;gap:.3rem;padding:.35rem .7rem;border-radius:.5rem;font-size:.8rem;font-weight:600;border:1px solid var(--primary,#1A3D2B);background:var(--primary,#1A3D2B);color:#fff;cursor:pointer}',
    '.main .card[data-cat] .nl-ob-start-cat:hover{background:#155a3a;border-color:#155a3a}',
    '.main .card[data-cat] .exlist{margin-top:.25rem}',
    '@media(max-width:600px){.main .grp .grid{grid-template-columns:1fr}}'
  ].join('\n');
  document.head.appendChild(s);
}

function nlEnsureBankShell() {
  var paused = document.querySelector('section[aria-labelledby="nl-bank-paused-title"]');
  if (paused && paused.parentNode) paused.parentNode.removeChild(paused);

  var mainEl = document.querySelector('main.main');
  if (!mainEl) {
    mainEl = document.createElement('main');
    mainEl.className = 'main';
    var footer = document.querySelector('footer');
    if (footer && footer.parentNode) footer.parentNode.insertBefore(mainEl, footer);
    else document.body.appendChild(mainEl);
  }

  if (mainEl.querySelector('.card[data-cat]')) return;

  nlCategoryData.forEach(function(group, gi) {
    var grp = document.createElement('section');
    grp.className = 'grp';

    var glabel = document.createElement('h2');
    glabel.className = 'glabel';
    glabel.textContent = nlGroupTitles[gi] || ('Gruppe ' + (gi + 1));
    grp.appendChild(glabel);

    var grid = document.createElement('div');
    grid.className = 'grid';

    group.forEach(function(catInfo, ci) {
      var catId = (nlCategoryIdsByGroup[gi] && nlCategoryIdsByGroup[gi][ci]) || ('kategori-' + gi + '-' + ci);

      var card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-cat', catId);

      var header = document.createElement('button');
      header.className = 'ch';
      header.type = 'button';

      var cn = document.createElement('span');
      cn.className = 'cn';
      cn.textContent = (catInfo && catInfo.n) ? catInfo.n : 'Kategori';

      var exc = document.createElement('span');
      exc.className = 'exc';
      exc.textContent = '0 oppg.';

      var cd = document.createElement('span');
      cd.className = 'cd';
      cd.textContent = (catInfo && catInfo.d) ? catInfo.d : '';

      header.appendChild(cn);
      header.appendChild(exc);
      header.appendChild(cd);

      var exlist = document.createElement('div');
      exlist.className = 'exlist';

      var actions = document.createElement('div');
      actions.className = 'nl-ob-actions';

      var startBtn = document.createElement('button');
      startBtn.type = 'button';
      startBtn.className = 'nl-ob-start-cat';
      startBtn.setAttribute('data-cat', catId);
      startBtn.textContent = '▶ Start øvelse';
      actions.appendChild(startBtn);

      card.appendChild(header);
      card.appendChild(actions);
      card.appendChild(exlist);
      grid.appendChild(card);
    });

    grp.appendChild(grid);
    mainEl.appendChild(grp);
  });
}

function nlLoadTekstanalyseWidget() {
  var target = document.getElementById('nl-tekstanalyse') || document.getElementById('nl-skrivelab-ai');
  if (!target) return;
  if (target.dataset.nlApiMounted === '1' || document.querySelector('script[data-nl-api-widget="1"]')) return;

  var fallback = document.getElementById('nl-api-fallback');
  var params = new URLSearchParams(window.location.search);
  var api = params.get('api');

  if (api) {
    if (!/^https?:\/\//.test(api)) api = 'http://' + api;
    try { localStorage.setItem('nl_api_base', api); } catch (err) {}
  } else {
    try { api = localStorage.getItem('nl_api_base'); } catch (err) {}
  }

  if (!api) {
    var h = (location.hostname || '').toLowerCase();
    api = (h === 'localhost' || h === '127.0.0.1' || h === '')
      ? 'http://localhost:3000'
      : 'http://46.224.113.120:3000';
  }
  window.NL_API_BASE = api;
  target.dataset.nlApiMounted = 'loading';

  var script = document.createElement('script');
  script.src = api + '/tekstanalyse.js';
  script.setAttribute('data-nl-api-widget', '1');
  script.onload = function() {
    target.dataset.nlApiMounted = '1';
    if (fallback) fallback.hidden = true;
  };
  script.onerror = function() {
    target.dataset.nlApiMounted = 'error';
    if (fallback) {
      fallback.hidden = false;
      var apiSafe = (typeof nlMtEscHtml === 'function') ? nlMtEscHtml(api) : String(api).replace(/</g, '&lt;');
      fallback.innerHTML = '<strong>API-et svarer ikke ennå.</strong><span>Start den lokale tjenesten på <code>' + apiSafe + '</code> eller åpne siden med <code>?api=adresse</code> for å peke til riktig server.</span>';
    }
    if (window.console && console.warn) {
      console.warn('Tekstanalyse API ikke tilgjengelig på ' + api);
    }
  };
  document.body.appendChild(script);
}

function nlNormalizeCategories() {
  if (document.body.dataset.nlNormalized === '1') return;

  // Legacy splitter should not run when groups already have curated category cards.
  var targetByGroup = [7, 5, 5, 8, 7];
  var groups = document.querySelectorAll('.main .grp');

  var hasCuratedStructure = Array.prototype.some.call(groups, function(grp) {
    var cards = grp.querySelectorAll('.grid > .card[data-cat]');
    return cards.length > 1;
  });
  if (hasCuratedStructure) {
    document.body.dataset.nlNormalized = '1';
    return;
  }

  groups.forEach(function(grp, gi) {
    var grid = grp.querySelector('.grid');
    if (!grid) return;

    var base = grid.querySelector('.card');
    if (!base) return;

    var exlist = base.querySelector('.exlist');
    if (!exlist) return;

    var allExercises = [];
    try {
      // Prefer direct-child lookup, but keep a safe fallback for engines with weak :scope support.
      allExercises = Array.prototype.slice.call(exlist.querySelectorAll(':scope > .ei'));
    } catch (err) {
      allExercises = Array.prototype.slice.call(exlist.children).filter(function(node) {
        return node && node.classList && node.classList.contains('ei');
      });
    }
    if (!allExercises.length) return;

    var wanted = targetByGroup[gi] || 1;
    if (wanted < 1) wanted = 1;
    if (allExercises.length <= wanted) return;

    var minPerCard = Math.floor(allExercises.length / wanted);
    var extra = allExercises.length % wanted;
    var chunks = [];
    var cursor = 0;

    for (var i = 0; i < wanted; i++) {
      var size = minPerCard + (i < extra ? 1 : 0);
      chunks.push(allExercises.slice(cursor, cursor + size));
      cursor += size;
    }

    while (exlist.firstChild) exlist.removeChild(exlist.firstChild);
    chunks[0].forEach(function(ei) { exlist.appendChild(ei); });
    nlSetCardMeta(base, base.querySelector('.cn') ? base.querySelector('.cn').textContent : 'Kategori', chunks[0].length);

    for (var ci = 1; ci < chunks.length; ci++) {
      var newCard = base.cloneNode(false);
      newCard.classList.remove('open');
      newCard.dataset.cat = (base.dataset.cat || 'kategori') + '-auto-' + (ci + 1);

      var ch = base.querySelector('.ch').cloneNode(true);
      var ex = document.createElement('div');
      ex.className = 'exlist';

      var catInfo = (nlCategoryData[gi] && nlCategoryData[gi][ci]) || {n: 'Kategori ' + (ci + 1), d: ''};
      nlSetCardMetaFromHeader(ch, catInfo.n, catInfo.d, chunks[ci].length);

      chunks[ci].forEach(function(ei) { ex.appendChild(ei); });

      newCard.appendChild(ch);
      newCard.appendChild(ex);
      grid.appendChild(newCard);
    }
  });

  document.body.dataset.nlNormalized = '1';
}

function nlMtEscHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nlMtFasitText(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

/* Resolve fasit for display: MC index → actual alt text */
function nlMtResolveFasitDisplay(task) {
  if (!task) return '';
  var type = String(task.type || '').toLowerCase();
  var alts = Array.isArray(task.alt) ? task.alt : [];
  if ((type === 'mc' || type === 'mcset') && alts.length) {
    var idx = nlMtResolveMcAnswerIndex(task, alts);
    if (idx >= 0 && idx < alts.length) return String(alts[idx]);
  }
  return nlMtFasitText(task.fasit);
}

function nlMtHasFasitValue(v) {
  if (v == null) return false;
  if (Array.isArray(v)) {
    return v.some(function(x) { return x != null && String(x).trim(); });
  }
  return !!String(v).trim();
}

function nlMtPickPrompt(task) {
  if (!task) return 'Oppgave';
  return String(task.q || task.sporsmal || 'Oppgave');
}

function nlMtCleanPromptForTitle(prompt) {
  var text = String(prompt == null ? '' : prompt).trim();
  if (!text) return 'Oppgave';

  // Remove verbose/imported lead-ins so titles are short and student-facing.
  text = text
    .replace(/^skriver\s+ei\s+informasjon\s+på\s+tre\s+ulike\s+m[aå]tar\s*[-–:]+\s*/i, '')
    .replace(/^her\s+kan\s+du\s+l[aæ]re\s+mer\s*[-–:]+\s*/i, '')
    .replace(/^rekkef[øo]lgjeoppg[aå]ve\s*:\s*/i, '')
    .replace(/^forbodsoppg[aå]ve\s*:\s*/i, '')
    .replace(/^variasjonsoppg[aå]ve\s*:\s*/i, '')
    .replace(/^krymparen\s*:\s*/i, '')
    .replace(/^mt-bank\s*:\s*/i, '')
    .replace(/^variasjon\s*:\s*/i, '')
    .trim();

  text = nlStripTaskTypePrefix(text);

  return text || String(prompt).trim() || 'Oppgave';
}

function nlMtEscOrEmpty(v) {
  return nlMtEscHtml(v == null ? '' : String(v));
}

function nlMtBuildGuideHtml(task, options) {
  var opts = options || {};
  var includeHint = opts.includeHint !== false;
  var parts = [];
  if (includeHint && task && task.hint) {
    parts.push('<div class="subinst"><strong>Hint:</strong> ' + nlMtEscOrEmpty(task.hint) + '</div>');
  }
  if (task && (task.tekst || task.kontekst || task.context)) {
    var ctx = task.tekst || task.kontekst || task.context;
    parts.push('<div class="ibox" style="margin-top:8px"><p style="margin:0">' + nlMtEscOrEmpty(ctx) + '</p></div>');
  }
  if (task && task.maalordklasse) {
    parts.push('<div class="subinst"><strong>Mål:</strong> ' + nlMtEscOrEmpty(task.maalordklasse) + '</div>');
  }
  return parts.join('');
}

function nlMtBuildFasitMetaHtml(task) {
  var bits = [];
  if (task && task.regel) bits.push('<div class="fr"><strong>Regel:</strong> ' + nlMtEscOrEmpty(task.regel) + '</div>');
  if (task && task.eks) bits.push('<div class="fr"><strong>Eksempel:</strong> ' + nlMtEscOrEmpty(task.eks) + '</div>');
  if (task && task.kommentar) bits.push('<div class="fr"><strong>Kommentar:</strong> ' + nlMtEscOrEmpty(task.kommentar) + '</div>');
  if (task && task.eksempel_svak) bits.push('<div class="fr"><strong>Kan bli bedre:</strong> ' + nlMtEscOrEmpty(task.eksempel_svak) + '</div>');
  if (task && task.eksempel_god) bits.push('<div class="fr"><strong>Sterkt svar:</strong> ' + nlMtEscOrEmpty(task.eksempel_god) + '</div>');
  return bits.join('');
}

function nlMtResolveMcAnswerIndex(task, alts) {
  if (!Array.isArray(alts) || !alts.length) return -1;

  var numeric = Number(task && task.fasit);
  if (Number.isFinite(numeric) && numeric >= 0 && numeric < alts.length) return numeric;

  var targets = [];
  if (task && task.fasit != null) targets.push(String(task.fasit).trim().toLowerCase());
  if (task && Array.isArray(task.fasit_v)) {
    task.fasit_v.forEach(function(v) {
      if (v != null) targets.push(String(v).trim().toLowerCase());
    });
  }

  var uniq = {};
  targets = targets.filter(function(t) {
    if (!t) return false;
    if (uniq[t]) return false;
    uniq[t] = true;
    return true;
  });

  for (var i = 0; i < alts.length; i++) {
    var val = String(alts[i]).trim().toLowerCase();
    if (targets.indexOf(val) !== -1) return i;
  }

  return -1;
}

function nlMtToArray(v) {
  if (Array.isArray(v)) return v.filter(function(x) { return x != null && String(x).trim(); }).map(function(x) { return String(x); });
  if (v == null) return [];
  var s = String(v).trim();
  return s ? [s] : [];
}

function nlMtNormWord(v) {
  return String(v == null ? '' : v)
    .toLowerCase()
    .replace(/^[^a-zA-Z\u00C0-\u017F0-9]+|[^a-zA-Z\u00C0-\u017F0-9]+$/g, '')
    .trim();
}

function nlMtSplitWords(v) {
  return String(v == null ? '' : v)
    .split(/\s+/)
    .map(function(x) { return String(x || '').trim(); })
    .filter(function(x) { return !!x; });
}

function nlMtShuffle(arr) {
  var out = arr.slice();
  for (var i = out.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function nlMtDifficultyBadge(vanske) {
  var v = String(vanske || '').toLowerCase();
  if (v === 'lett') return '<span class="b dg">Lett</span>';
  if (v === 'middels' || v === 'medium') return '<span class="b dm">Middels</span>';
  return '<span class="b da">Viderekommende</span>';
}

function nlStripTaskTypePrefix(text) {
  var out = String(text == null ? '' : text).trim();
  if (!out) return out;
  return out.replace(/^\s*(?:feilretting|fylloppg[aå]ve|fyll\s+inn\s+rett\s+ord|fyll\s+inn\s+riktig\s+ord|sorter(?:ing)?|rangere|rangering|identifisering|analyse|bygg(?:je|e)?(?:oppg[aå]ve)?|omskriving|korrigering|rekkef[øo]lgeoppgave)\s*:\s*/i, '').trim();
}

function nlMtOperationMeta(task) {
  var raw = String((task && (task.op || task.operasjon || task.operation)) || '').toLowerCase();
  raw = raw.replace(/[\s_-]+/g, '');
  var explicit = {
    korrigere: { cls: 'ok', label: 'Korrigere' },
    fylloppgave: { cls: 'of', label: 'Fylloppgave' },
    'fyllopp\u00E5ve': { cls: 'of', label: 'Fylloppgave' },
    identifisere: { cls: 'oi', label: 'Identifisere' },
    omskrive: { cls: 'oo', label: 'Omskrive' },
    byggje: { cls: 'ob', label: 'Bygge' },
    bygge: { cls: 'ob', label: 'Bygge' },
    analysere: { cls: 'oa', label: 'Analysere' },
    rangere: { cls: 'or', label: 'Sortere' },
    sortering: { cls: 'or', label: 'Sortere' },
    sortere: { cls: 'or', label: 'Sortere' }
  };
  if (explicit[raw]) return explicit[raw];

  var type = String(task && task.type || '').toLowerCase();
  if (type === 'finn_feil') return { cls: 'ok', label: 'Korrigere' };
  if (type === 'cloze') return { cls: 'of', label: 'Fylloppgave' };
  if (type === 'klikk_marker' || type === 'mc') return { cls: 'oi', label: 'Identifisere' };
  if (type === 'drag_ord') return { cls: 'ob', label: 'Bygge' };
  if (type === 'drag_kolonne' || type === 'burger_sort' || type === 'avsnitt_klikk') return { cls: 'or', label: 'Sortere' };
  if (type === 'open') return { cls: 'oo', label: 'Omskrive' };
  if (type === 'rhythm') return { cls: 'oi', label: 'Identifisere' };
  return { cls: 'oa', label: 'Analysere' };
}

function nlMtOperationBadge(task) {
  var meta = nlMtOperationMeta(task);
  return '<span class="b ' + meta.cls + '">' + meta.label + '</span>';
}

function nlMtResolveCard(kat) {
  var map = {
    og_aa: 'og-aa',
    dobbel_konsonant: 'dobbel-konsonant',
    teiknsetting: 'teiknsetting',
    tegnsetting: 'teiknsetting',
    samansett: 'saerskriving-sammensetning',
    sammensatt: 'saerskriving-sammensetning',
    ordklasse: 'ordklasse',
    ordklassar: 'ordklasse',
    ordklasser: 'ordklasse',
    setningsbygging: 'setningsbygging',
    tekststruktur: 'tekststruktur-delar',
    bindeord: 'bindeord-overganger',
    kjeldebruk: 'kjeldebruk',
    kildebruk: 'kjeldebruk',
    oppgavetolking: 'oppgaveforstaing',
    spraak_stil: 'spraak-stil',
    kj_skj: 'kj-skj',
    aarsak_sammenheng: 'aarsak-sammenheng',
    referansekjede: 'referansekjede',
    logisk_struktur: 'logisk-struktur',
    sjangerkompetanse: 'sjangerkompetanse',
    fagartikkel: 'fagartikkel',
    debattinnlegg: 'debattinnlegg',
    overskrift_ingress: 'overskrift-ingress',
    novelle: 'novelle',
    parafrase: 'parafrase',
    sitat: 'sitat',
    tal_og_statistikk: 'tal-og-statistikk',
    ordval: 'ordval',
    bruke_eksempel: 'bruke-eksempel',
    tilpass_til_lesaren: 'tilpass-til-lesaren',
    tilpass_til_lesaran: 'tilpass-til-lesaren'
  };
  return map[kat] || '';
}

function nlMtBuildExercise(task, i, localIx) {
  var html = nlMtBuildExerciseCore(task, i, localIx);
  if (!html) return '';
  var attrs = ' data-mt-index="' + String(i) + '"';
  if (task && task.regel) attrs += ' data-regel="' + nlMtEscHtml(task.regel) + '"';
  if (task && task.eks) attrs += ' data-eks="' + nlMtEscHtml(task.eks) + '"';
  var ft = nlMtResolveFasitDisplay(task);
  if (ft) attrs += ' data-fasit-text="' + nlMtEscHtml(ft) + '"';
  return attrs ? html.replace('<article class="ei">', '<article class="ei"' + attrs + '>') : html;
}

function nlMtBuildExerciseCore(task, i, localIx) {
  var type = String(task && task.type || '').toLowerCase();
  var promptRaw = nlMtPickPrompt(task);
  var titleText = nlMtCleanPromptForTitle(promptRaw);
  var q = nlMtEscHtml(titleText);
  var fasit = nlMtEscHtml(nlMtResolveFasitDisplay(task));
  var hasFasit = nlMtHasFasitValue(task && task.fasit) || nlMtHasFasitValue(task && task.fasit_v);
  var hasHint = nlMtHasFasitValue(task && task.hint);
  var guideHtml = nlMtBuildGuideHtml(task, { includeHint: hasFasit || !hasHint });
  var metaHtml = nlMtBuildFasitMetaHtml(task);
  var revealLabel = hasFasit ? 'Vis fasit' : (hasHint ? 'Vis hint' : 'Vis rettleiing');
  var revealTitle = hasFasit ? 'Fasit' : (hasHint ? 'Hint' : 'Rettleiing');
  var revealBody = hasFasit ? fasit : (hasHint ? nlMtEscOrEmpty(task && task.hint) : fasit);
  var uniq = 'nlmt-' + i + '-' + localIx;
  var header =
    '<button class="etog" type="button">' +
    '<span class="etit">' + q + '</span>' +
    '<span class="tags">' + nlMtOperationBadge(task) + nlMtDifficultyBadge(task && task.vanske) + '</span>' +
    '</button>';
  var promptBoxHtml = '<div class="ibox"><div class="box"><p>' + q + '</p></div></div>';

  if (type === 'mc') {
    var alts = Array.isArray(task.alt) ? task.alt : [];
    var answerIx = nlMtResolveMcAnswerIndex(task, alts);
    if (!alts.length || answerIx < 0 || answerIx >= alts.length) return '';

    var areaId = 'mcq-' + uniq;
    var scoreId = 'score-' + uniq;
    var radioName = 'grp-' + uniq;
    var opts = alts.map(function(opt, oi) {
      return '<label class="mcq-opt"><input type="radio" name="' + radioName + '" value="' + oi + '"><span>' + nlMtEscHtml(opt) + '</span></label>';
    }).join('');

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Vel ett alternativ.</div>' +
      guideHtml +
      '<div id="' + areaId + '" class="mcq-area" data-answer="' + answerIx + '">' + opts + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="mc" data-target="' + areaId + '" data-score="' + scoreId + '">Sjekk svar</button><button class="btn-reset" data-reset="mc" data-target="' + areaId + '" data-score="' + scoreId + '">Start på nytt</button><span id="' + scoreId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'cloze') {
    var fillId = 'fill-' + uniq;
    var scoreFillId = 'score-' + uniq;
    var rawQ = String(promptRaw || '');
    if (rawQ.indexOf('___') === -1) rawQ += ' ___';
    var parts = rawQ.split('___');
    var ansRaw = task && task.fasit_v != null ? task.fasit_v : task && task.fasit;
    var accepted = Array.isArray(ansRaw) ? ansRaw : [ansRaw];
    var ansJson = nlMtEscHtml(JSON.stringify(accepted.filter(function(v){ return v != null && String(v).trim(); })));
    var hintText = task && task.hint ? String(task.hint).trim() : '';
    var inputPlaceholder = hintText ? hintText : 'Skriv svar';
    var inputTitle = hintText ? ' title="' + nlMtEscHtml(hintText) + '"' : '';
    var prompt = nlMtEscHtml(parts[0] || '') + '<input class="blank-input" data-ans="' + ansJson + '" placeholder="' + inputPlaceholder + '" aria-label="Skriv inn manglende ord"' + inputTitle + ' style="min-width:160px">' + nlMtEscHtml(parts.slice(1).join(' ___ '));

    return '<article class="ei">' + header +
      '<div class="ec">' +
      '<div id="' + fillId + '" class="ibox">' + prompt + '</div>' +
      '<div class="inst">Skriv ordet som mangler.</div>' +
      guideHtml +
      '<div class="ex-controls"><button class="btn-check" data-check="fill" data-target="' + fillId + '" data-score="' + scoreFillId + '">Sjekk svar</button><button class="btn-reset" data-reset="fill" data-target="' + fillId + '" data-score="' + scoreFillId + '">Start på nytt</button><span id="' + scoreFillId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'open') {
    var writeId = 'write-' + uniq;
    var scoreWriteId = 'score-' + uniq;
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Skriv 1-3 setninger.</div>' +
      guideHtml +
      '<textarea id="' + writeId + '" class="write-area" rows="4" placeholder="Skriv svaret ditt her..."></textarea>' +
      '<div class="ex-controls"><button class="btn-check" data-check="write" data-target="' + writeId + '" data-score="' + scoreWriteId + '">Sjekk svar</button><span id="' + scoreWriteId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'drag_ord') {
    var dragWords = Array.isArray(task && task.ord) ? task.ord.map(function(w) { return String(w); }).filter(function(w) { return !!w.trim(); }) : [];
    if (!dragWords.length) return '';

    var correctDrag = [];
    if (Array.isArray(task && task.fasit)) {
      correctDrag = task.fasit.map(function(w) { return String(w); }).filter(function(w) { return !!w.trim(); });
    } else if (task && task.fasit != null) {
      correctDrag = nlMtSplitWords(task.fasit);
    }
    if (!correctDrag.length) correctDrag = dragWords.slice();

    var dragId = 'dord-' + uniq;
    var scoreDragId = 'score-' + uniq;
    var shuffledWords = nlMtShuffle(dragWords);
    var dragBtns = shuffledWords.map(function(w, wi) {
      return '<button type="button" class="drag-ord-token" data-order="' + wi + '" data-word="' + nlMtEscHtml(w) + '">' + nlMtEscHtml(w) + '</button>';
    }).join('');

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Set ordene i rett rekkefølge.</div>' +
      guideHtml +
      '<div id="' + dragId + '" class="drag-ord-area" data-score="' + scoreDragId + '" data-correct="' + nlMtEscHtml(JSON.stringify(correctDrag)) + '">' +
        '<div class="drag-ord-bank">' + dragBtns + '</div>' +
        '<div class="drag-ord-answer"></div>' +
      '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="drag-ord" data-target="' + dragId + '" data-score="' + scoreDragId + '">Sjekk svar</button><button class="btn-reset" data-reset="drag-ord" data-target="' + dragId + '" data-score="' + scoreDragId + '">Start på nytt</button><span id="' + scoreDragId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'drag_kolonne') {
    var rawCols = Array.isArray(task && task.kolonner) ? task.kolonner : [];
    var useObjCols = rawCols.length > 0 && typeof rawCols[0] === 'object' && rawCols[0].id;
    var bucketDefs;
    if (useObjCols) {
      bucketDefs = rawCols.map(function(c) { return { id: String(c.id), label: String(c.label || c.id) }; });
    } else {
      var cols = rawCols.map(function(c) { return String(c); }).filter(function(c) { return !!c.trim(); });
      if (cols.length < 2) cols = ['Kolonne 1', 'Kolonne 2'];
      bucketDefs = cols.map(function(c, ci) { return { id: 'k' + ci, label: c }; });
    }

    var rawItems = Array.isArray(task && task.ord) ? task.ord : [];
    if (!rawItems.length) return '';
    var fasitMap = task.fasit_map || null;

    var seenText = {};
    var words = [];
    var answers = {};
    rawItems.forEach(function(item) {
      var txt = typeof item === 'string' ? item : item && item.tekst;
      if (txt == null) return;
      txt = String(txt).trim();
      if (!txt) return;

      var key = txt;
      if (seenText[key]) {
        seenText[key]++;
        key = txt + ' [' + seenText[key] + ']';
      } else {
        seenText[key] = 1;
      }

      words.push(key);

      if (fasitMap && fasitMap[txt] !== undefined) {
        answers[key] = String(fasitMap[txt]);
      } else {
        var idx = Number(typeof item === 'string' ? 0 : item.fasit);
        if (!Number.isFinite(idx) || idx < 0 || idx >= bucketDefs.length) idx = 0;
        answers[key] = bucketDefs[idx].id;
      }
    });

    if (!words.length) return '';

    var sortId = 'sort-' + uniq;
    var scoreSortId = 'score-' + uniq;

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Dra hvert element til rett kolonne.</div>' +
      guideHtml +
      '<div class="sort-ex" id="' + sortId + '" data-words="' + nlMtEscHtml(JSON.stringify(words)) + '" data-buckets="' + nlMtEscHtml(JSON.stringify(bucketDefs)) + '" data-answers="' + nlMtEscHtml(JSON.stringify(answers)) + '"></div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="sort" data-target="' + sortId + '" data-score="' + scoreSortId + '">Sjekk svar</button><button class="btn-reset" data-reset="sort" data-target="' + sortId + '" data-score="' + scoreSortId + '">Start på nytt</button><span id="' + scoreSortId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'finn_feil' || type === 'klikk_marker') {
    var markText = String(task && (task.tekst || task.q || task.sporsmal) || '').trim();
    if (!markText) return '';

    var answerSource = [];
    if (type === 'finn_feil') answerSource = nlMtToArray(task && task.fasit_feil);
    else answerSource = nlMtToArray((task && task.fasit_ord) || (task && task.fasit_v) || (task && task.fasit));

    var answerWordMap = {};
    answerSource.forEach(function(a) {
      var k = nlMtNormWord(a);
      if (k) answerWordMap[k] = true;
    });

    var tokens = markText.split(/\s+/).filter(function(w) { return !!w; });
    if (!tokens.length) return '';

    var answers = [];
    var markItems = tokens.map(function(tok, ti) {
      var key = 't' + ti;
      if (answerWordMap[nlMtNormWord(tok)]) answers.push(key);
      return '<span class="mark-item" data-key="' + key + '">' + nlMtEscHtml(tok) + '</span>';
    }).join(' ');

    var markId = 'mark-' + uniq;
    var scoreMarkId = 'score-' + uniq;
    var inst = type === 'finn_feil'
      ? 'Finn ' + answers.length + ' feil i teksten.'
      : 'Klikk på de rette ordene.';
    var markCls = 'mark-area' + (type === 'finn_feil' ? ' mark-inline' : '');

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">' + inst + '</div>' +
      guideHtml +
      '<div id="' + markId + '" class="' + markCls + '" data-score="' + scoreMarkId + '" data-answers="' + nlMtEscHtml(JSON.stringify(answers)) + '">' + markItems + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="mark" data-target="' + markId + '" data-score="' + scoreMarkId + '">Sjekk svar</button><button class="btn-reset" data-reset="mark" data-target="' + markId + '" data-score="' + scoreMarkId + '">Start på nytt</button><span id="' + scoreMarkId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'fix') {
    var fixTekst = String(task && (task.tekst || task.q || '') || '').trim();
    if (!fixTekst) return '';
    var fixErrors = task && task.errors || {};
    var fixId = 'fix-' + uniq;
    var scoreFixId = 'score-' + uniq;
    /* Build "Foreslått versjon" — original text with all errors replaced */
    var fixSuggested = fixTekst;
    Object.keys(fixErrors).forEach(function(wrong) {
      var right = String(fixErrors[wrong] || '').trim();
      if (wrong === right || !wrong || !right) return;
      fixSuggested = fixSuggested.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'), right);
    });
    var fixFasitBody = nlMtEscHtml(fixSuggested);
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Rett feilene direkte i teksten.</div>' +
      guideHtml +
      '<div class="fix-area ibox" id="' + fixId + '" contenteditable="true" spellcheck="false" data-original="' + nlMtEscHtml(fixTekst) + '" data-errors="' + nlMtEscHtml(JSON.stringify(fixErrors)) + '">' + nlMtEscHtml(fixTekst) + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="fix" data-target="' + fixId + '" data-score="' + scoreFixId + '">Sjekk svar</button><button class="btn-reset" data-reset="fix" data-target="' + fixId + '" data-score="' + scoreFixId + '">Start på nytt</button><span id="' + scoreFixId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">Vis foreslått versjon</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">Foreslått versjon</div><p class="fb-ans">' + fixFasitBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'rank') {
    var rankItems = Array.isArray(task && task.items) ? task.items : [];
    var rankCorrect = Array.isArray(task && task.correct) ? task.correct : [];
    if (!rankItems.length || !rankCorrect.length) return '';
    var rankId = 'rank-' + uniq;
    var scoreRankId = 'score-' + uniq;
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Dra elementene i riktig rekkefølge.</div>' +
      guideHtml +
      '<div class="rank-list" id="' + rankId + '" data-items="' + nlMtEscHtml(JSON.stringify(rankItems)) + '" data-correct="' + nlMtEscHtml(JSON.stringify(rankCorrect)) + '"></div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="rank" data-target="' + rankId + '" data-score="' + scoreRankId + '">Sjekk rekkefølge</button><button class="btn-reset" data-reset="rank" data-target="' + rankId + '" data-score="' + scoreRankId + '">Bland på nytt</button><span id="' + scoreRankId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'fillsel') {
    var sentences = Array.isArray(task && task.items) ? task.items : (Array.isArray(task && task.sentences) ? task.sentences : []);
    if (!sentences.length) return '';
    var fillselId = 'fillsel-' + uniq;
    var scoreFillselId = 'score-' + uniq;
    var fillselHtml = sentences.map(function(s, si) {
      var opts = (Array.isArray(s.alt) ? s.alt : (Array.isArray(s.options) ? s.options : [])).map(function(o) {
        return '<option value="' + nlMtEscHtml(o) + '">' + nlMtEscHtml(o) + '</option>';
      }).join('');
      var answer = s.fasit != null ? s.fasit : (s.answer || '');
      return '<p class="fillsel-sentence">' + nlMtEscHtml(s.pre || '') +
        '<select class="fill-select" data-answer="' + nlMtEscHtml(answer) + '"><option value="">– velg –</option>' + opts + '</select>' +
        nlMtEscHtml(s.post || '') + '</p>';
    }).join('');
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Velg riktig alternativ i hver rullegardin.</div>' +
      guideHtml +
      '<div class="ibox" id="' + fillselId + '">' + fillselHtml + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="fillsel" data-target="' + fillselId + '" data-score="' + scoreFillselId + '">Sjekk svar</button><button class="btn-reset" data-reset="fillsel" data-target="' + fillselId + '" data-score="' + scoreFillselId + '">Start på nytt</button><span id="' + scoreFillselId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'mcset') {
    var mcsetQs = Array.isArray(task && task.questions) ? task.questions : [];
    if (!mcsetQs.length) return '';
    var mcsetId = 'mcset-' + uniq;
    var scoreMcsetId = 'score-' + uniq;
    var mcsetHtml = mcsetQs.map(function(mq, mi) {
      var mqId = mcsetId + '-' + mi;
      var alts = Array.isArray(mq.alt) ? mq.alt : [];
      var opts = alts.map(function(a, ai) {
        return '<label class="mcq-opt"><input type="radio" name="' + mqId + '" value="' + ai + '"><span>' + nlMtEscHtml(a) + '</span></label>';
      }).join('');
      return '<div class="mcq-area" id="' + mqId + '" data-answer="' + (mq.fasit != null ? mq.fasit : 0) + '">' +
        '<p>' + nlMtEscHtml(mq.q || '') + '</p>' + opts + '</div>';
    }).join('');
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Velg ett alternativ på hvert spørsmål.</div>' +
      guideHtml +
      '<div id="' + mcsetId + '">' + mcsetHtml + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="mcset" data-target="' + mcsetId + '" data-score="' + scoreMcsetId + '">Sjekk svar</button><button class="btn-reset" data-reset="mcset" data-target="' + mcsetId + '" data-score="' + scoreMcsetId + '">Start på nytt</button><span id="' + scoreMcsetId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'burger_sort') {
    var burgerAvsnitt = Array.isArray(task && task.avsnitt) ? task.avsnitt : [];
    var burgerLag = Array.isArray(task && task.lag) ? task.lag : [];
    if (!burgerAvsnitt.length || !burgerLag.length) return '';
    var burgerId = 'burger-' + uniq;
    var scoreBurgerId = 'score-' + uniq;
    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Dra hvert avsnitt til riktig lag.</div>' +
      guideHtml +
      '<div class="burger-ex" id="' + burgerId + '" data-paragraphs="' + nlMtEscHtml(JSON.stringify(burgerAvsnitt)) + '" data-layers="' + nlMtEscHtml(JSON.stringify(burgerLag)) + '"></div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="burger" data-target="' + burgerId + '" data-score="' + scoreBurgerId + '">Sjekk svar</button><button class="btn-reset" data-reset="burger" data-target="' + burgerId + '" data-score="' + scoreBurgerId + '">Start på nytt</button><span id="' + scoreBurgerId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  if (type === 'rhythm') {
    var va = String(task.versjon_a || '').trim();
    var vb = String(task.versjon_b || '').trim();
    if (!va || !vb) return '';
    var fasitIdx = Number(task.fasit);
    if (!Number.isFinite(fasitIdx)) fasitIdx = 1;
    var rhythmId = 'rhythm-' + uniq;
    var scoreRhythmId = 'score-' + uniq;

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">Les begge versjonene – klikk på den beste.</div>' +
      guideHtml +
      '<div class="cols rhythm-wrap" id="' + rhythmId + '">' +
      '<div class="rhythm-pick" data-val="0" style="cursor:pointer;border:2px solid transparent;border-radius:10px;padding:0.8rem;transition:border-color .2s,background .2s"><h4>Versjon A</h4><p>' + nlMtEscHtml(va) + '</p></div>' +
      '<div class="rhythm-pick" data-val="1" style="cursor:pointer;border:2px solid transparent;border-radius:10px;padding:0.8rem;transition:border-color .2s,background .2s"><h4>Versjon B</h4><p>' + nlMtEscHtml(vb) + '</p></div>' +
      '</div>' +
      '<input type="hidden" id="rhythm-val-' + uniq + '" value="">' +
      '<div class="ex-controls"><button class="btn-check" data-check="rhythm" data-target="' + rhythmId + '" data-answer="' + fasitIdx + '" data-score="' + scoreRhythmId + '">Sjekk svar</button><button class="btn-reset" data-reset="rhythm" data-target="' + rhythmId + '" data-score="' + scoreRhythmId + '">Start på nytt</button><span id="' + scoreRhythmId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  // Generic fallback: show the task with guidance/fasit instead of dropping unsupported MT types.
  var fallbackId = 'write-' + uniq;
  return '<article class="ei">' + header +
    '<div class="ec">' +
    promptBoxHtml +
    '<div class="inst">Denne oppgavetypen er delvis importert. Svar i feltet under og bruk veiledningen.</div>' +
    '<div class="subinst"><strong>Type:</strong> ' + nlMtEscHtml(type || 'ukjent') + '</div>' +
    guideHtml +
    '<textarea id="' + fallbackId + '" class="write-area" rows="4" placeholder="Skriv svaret ditt her..."></textarea>' +
    '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
    '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
    '</div></article>';
}

function nlMtValidateTaskForImport(task) {
  var type = String(task && task.type || '').toLowerCase();
  var prompt = nlMtPickPrompt(task);
  var hasPrompt = !!String(prompt || '').trim();
  var hasExplanation = nlMtHasFasitValue(task && task.forklaring) || nlMtHasFasitValue(task && task.regel);
  var hasExample = nlMtHasFasitValue(task && task.eks);

  function nlNormOpt(v) {
    return String(v == null ? '' : v).trim().toLowerCase();
  }

  function nlCountUnclearDistractors(options, answerIx) {
    var unclearRx = /(vet\s*ikkje|vet\s*ikke|usikker|kanskje|kjem\s*an\s*på|kommer\s*an\s*på|ingen\s*av\s*(desse|disse)|alle\s*over|alt\s*over|både\s*a\s*og\s*b|kan\s*variere)/i;
    var n = 0;
    options.forEach(function(opt, ix) {
      if (ix === answerIx) return;
      if (unclearRx.test(String(opt || ''))) n++;
    });
    return n;
  }
  var supported = {
    mc: 1,
    cloze: 1,
    open: 1,
    drag_ord: 1,
    drag_kolonne: 1,
    finn_feil: 1,
    klikk_marker: 1,
    fix: 1,
    rank: 1,
    fillsel: 1,
    mcset: 1,
    burger_sort: 1,
    rhythm: 1,
    sann_usann_serie: 1,
    sorter_rekke: 1,
    avsnitt_klikk: 1,
    omskriv: 1
  };

  if (!supported[type]) return { ok: false, reason: 'unsupported-type' };
  if (!hasPrompt) return { ok: false, reason: 'missing-prompt' };
  // New bank entries may temporarily miss one of these fields.
  // Keep importing tasks that are otherwise valid so categories and adaptive mode stay usable.
  if (!hasExplanation || !hasExample) {
    // Intentionally non-blocking quality signal.
  }

  if (type === 'mc') {
    var alts = Array.isArray(task && task.alt) ? task.alt : [];
    if (alts.length < 2) return { ok: false, reason: 'mc-too-few-options' };
    var answerIx = nlMtResolveMcAnswerIndex(task, alts);
    if (answerIx < 0) return { ok: false, reason: 'mc-no-valid-answer' };
    var mcNorm = alts.map(nlNormOpt).filter(function(v) { return !!v; });
    if (mcNorm.length !== alts.length) return { ok: false, reason: 'mc-empty-option' };
    if (new Set(mcNorm).size !== mcNorm.length) return { ok: false, reason: 'mc-duplicate-options' };
    if (nlCountUnclearDistractors(alts, answerIx) > 1) return { ok: false, reason: 'mc-too-many-unclear-distractors' };
    return { ok: true };
  }

  if (type === 'cloze') {
    var hasAnswer = nlMtHasFasitValue(task && task.fasit) || (Array.isArray(task && task.fasit_v) && task.fasit_v.length > 0);
    return hasAnswer ? { ok: true } : { ok: false, reason: 'cloze-missing-answer' };
  }

  if (type === 'fillsel') {
    var fillItems = Array.isArray(task && task.items) ? task.items : (Array.isArray(task && task.sentences) ? task.sentences : []);
    if (!fillItems.length) return { ok: false, reason: 'fillsel-no-items' };
    var fillOk = fillItems.every(function(s) {
      var opts = Array.isArray(s && s.alt) ? s.alt : (Array.isArray(s && s.options) ? s.options : []);
      var ans = s && (s.fasit != null ? s.fasit : s.answer);
      if (!(opts.length >= 2 && ans != null && String(ans).trim())) return false;
      var norm = opts.map(nlNormOpt).filter(function(v) { return !!v; });
      if (norm.length !== opts.length) return false;
      if (new Set(norm).size !== norm.length) return false;
      var ansIx = norm.indexOf(nlNormOpt(ans));
      if (ansIx < 0) return false;
      if (nlCountUnclearDistractors(opts, ansIx) > 1) return false;
      return true;
    });
    return fillOk ? { ok: true } : { ok: false, reason: 'fillsel-invalid-item' };
  }

  if (type === 'mcset') {
    var qs = Array.isArray(task && task.questions) ? task.questions : [];
    if (qs.length < 2) return { ok: false, reason: 'mcset-too-few-questions' };
    var qsOk = qs.every(function(q) {
      if (!(Array.isArray(q && q.alt) && q.alt.length >= 2 && q && q.fasit != null)) return false;
      var qNorm = q.alt.map(nlNormOpt).filter(function(v) { return !!v; });
      if (qNorm.length !== q.alt.length) return false;
      if (new Set(qNorm).size !== qNorm.length) return false;
      var qAnswerIx = nlMtResolveMcAnswerIndex(q, q.alt);
      if (qAnswerIx < 0) return false;
      if (nlCountUnclearDistractors(q.alt, qAnswerIx) > 1) return false;
      return true;
    });
    return qsOk ? { ok: true } : { ok: false, reason: 'mcset-invalid-question' };
  }

  if (type === 'drag_kolonne') {
    var words = Array.isArray(task && task.ord) ? task.ord : [];
    var cols = Array.isArray(task && task.kolonner) ? task.kolonner : [];
    return (words.length >= 3 && cols.length >= 2) ? { ok: true } : { ok: false, reason: 'drag-kolonne-too-thin' };
  }

  if (type === 'drag_ord') {
    var dragWords = Array.isArray(task && task.ord) ? task.ord : [];
    return dragWords.length >= 3 ? { ok: true } : { ok: false, reason: 'drag-ord-too-short' };
  }

  if (type === 'finn_feil') {
    var feils = nlMtToArray(task && task.fasit_feil);
    return (String(task && task.tekst || '').trim() && feils.length > 0) ? { ok: true } : { ok: false, reason: 'finn-feil-invalid' };
  }

  if (type === 'klikk_marker') {
    var keys = nlMtToArray((task && task.fasit_ord) || (task && task.fasit_v) || (task && task.fasit));
    return (String(task && task.tekst || '').trim() && keys.length > 0) ? { ok: true } : { ok: false, reason: 'klikk-marker-invalid' };
  }

  if (type === 'fix') {
    var fixText = String(task && task.tekst || '').trim();
    var fixErrors = task && task.errors;
    return (fixText && fixErrors && Object.keys(fixErrors).length > 0) ? { ok: true } : { ok: false, reason: 'fix-invalid' };
  }

  if (type === 'rank' || type === 'sorter_rekke') {
    var rItems = Array.isArray(task && task.items) ? task.items : [];
    return rItems.length >= 3 ? { ok: true } : { ok: false, reason: 'rank-too-few-items' };
  }

  if (type === 'burger_sort') {
    var layers = Array.isArray(task && task.lag) ? task.lag : [];
    var paras = Array.isArray(task && task.avsnitt) ? task.avsnitt : [];
    return (layers.length >= 2 && paras.length >= 3) ? { ok: true } : { ok: false, reason: 'burger-too-few-parts' };
  }

  if (type === 'rhythm') {
    return (String(task && task.versjon_a || '').trim() && String(task && task.versjon_b || '').trim())
      ? { ok: true }
      : { ok: false, reason: 'rhythm-invalid' };
  }

  if (type === 'sann_usann_serie') {
    var claims = Array.isArray(task && task.paastandar) ? task.paastandar : [];
    var claimsOk = claims.length >= 3 && claims.every(function(p) {
      return p && String(p.tekst || '').trim() && typeof p.sann === 'boolean';
    });
    return claimsOk ? { ok: true } : { ok: false, reason: 'sann-usann-invalid' };
  }

  if (type === 'avsnitt_klikk') {
    var segs = Array.isArray(task && task.segments) ? task.segments : [];
    var breaks = Array.isArray(task && task.fasit_breaks) ? task.fasit_breaks : [];
    return (segs.length >= 3 && breaks.length >= 1) ? { ok: true } : { ok: false, reason: 'avsnitt-klikk-invalid' };
  }

  if (type === 'omskriv') {
    var rewriteText = String(task && task.tekst || '').trim();
    var req = Array.isArray(task && task.maa_ha) ? task.maa_ha : [];
    return (rewriteText && req.length >= 1) ? { ok: true } : { ok: false, reason: 'omskriv-invalid' };
  }

  return { ok: true };
}

function nlImportMTBankTasks() {
  if (document.body.dataset.nlMtImported === '1') return;
  var bank = null;
  if (typeof BANKV2 !== 'undefined' && Array.isArray(BANKV2)) bank = BANKV2;
  else if (typeof window !== 'undefined' && Array.isArray(window.BANKV2)) bank = window.BANKV2;
  else if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.BANKV2)) bank = globalThis.BANKV2;
  if (!bank || !bank.length) return;

  /* Clear all static exercises — bank is the single source of truth */
  document.querySelectorAll('.exlist').forEach(function(el) { el.innerHTML = ''; });
  document.querySelectorAll('.exc').forEach(function(el) { el.textContent = '0 oppg.'; });

  var maxPerCategory = 30;
  var counters = {};
  var imported = 0;
  var skipped = 0;
  var skippedReasons = {};
  var stableBank = bank.map(function(task, bankIndex) {
    return { task: task, bankIndex: bankIndex };
  }).sort(function(aWrap, bWrap) {
    var a = aWrap.task;
    var b = bWrap.task;
    var ak = String((a && a.kat) || '');
    var bk = String((b && b.kat) || '');
    if (ak !== bk) return ak < bk ? -1 : 1;

    var at = String((a && a.type) || '');
    var bt = String((b && b.type) || '');
    if (at !== bt) return at < bt ? -1 : 1;

    var aq = String((a && a.q) || '');
    var bq = String((b && b.q) || '');
    if (aq !== bq) return aq < bq ? -1 : 1;
    return 0;
  });

  stableBank.forEach(function(entry) {
    var task = entry.task;
    var bankIndex = entry.bankIndex;
    var cat = nlMtResolveCard(task && task.kat);
    if (!cat) return;

    if (typeof mtTaskLooksLegacy === 'function' && mtTaskLooksLegacy(task)) {
      skipped++;
      skippedReasons['legacy-blocked'] = (skippedReasons['legacy-blocked'] || 0) + 1;
      return;
    }

    counters[cat] = counters[cat] || 0;
    if (counters[cat] >= maxPerCategory) return;

    var validation = nlMtValidateTaskForImport(task);
    if (!validation.ok) {
      skipped++;
      skippedReasons[validation.reason] = (skippedReasons[validation.reason] || 0) + 1;
      return;
    }

    var exlist = document.querySelector('.card[data-cat="' + cat + '"] .exlist');
    if (!exlist) return;

    var html = nlMtBuildExercise(task, bankIndex, counters[cat] + 1);
    if (!html) return;

    exlist.insertAdjacentHTML('beforeend', html);
    counters[cat]++;
    imported++;
  });

  document.body.dataset.nlMtImported = '1';

  /* Update badge counts to reflect imported exercises */
  Object.keys(counters).forEach(function(cat) {
    var card = document.querySelector('.card[data-cat="' + cat + '"]');
    if (!card) return;
    var exc = card.querySelector('.exc');
    if (exc) exc.textContent = counters[cat] + ' oppg.';
  });

  if (imported > 0 && window.console && console.info) {
    console.info('[Skrivelab] Importerte', imported, 'oppgaver fra BANKV2.');
  }
  if (skipped > 0 && window.console && console.info) {
    console.info('[Skrivelab] Hoppet over', skipped, 'oppgaver (kvalitetsfilter):', skippedReasons);
  }
}

function nlSetCardMetaFromHeader(header, title, desc, count) {
  var cn = header.querySelector('.cn');
  if (cn) cn.textContent = title;

  var exc = header.querySelector('.exc');
  if (exc) exc.textContent = count + ' oppg.';

  var cd = header.querySelector('.cd');
  if (cd && desc) cd.textContent = desc;
}

function nlSetCardMeta(card, title, count) {
  var ch = card.querySelector('.ch');
  if (!ch) return;
  var cn = ch.querySelector('.cn');
  if (cn) cn.textContent = title;
  var exc = ch.querySelector('.exc');
  if (exc) exc.textContent = count + ' oppg.';
}

/* ── Word count ── */
window.nlWC = function(el, cid) {
  var n = el.value.trim() ? el.value.trim().split(/\s+/).length : 0;
  var c = document.getElementById(cid);
  if (c) {
    c.textContent = n + ' ord';
    c.classList.remove('warn', 'limit');
    if (n >= 20) c.classList.add('limit');
    else if (n >= 15) c.classList.add('warn');
  }
};

/* ── Score helpers ── */
function nlSetScore(sid, text, cls) {
  var el = document.getElementById(sid);
  if (!el) return;
  el.textContent = text;
  el.className = 'ex-score' + (cls ? ' ' + cls : '');
}
function nlClearScore(sid) { nlSetScore(sid, ''); }

/* ── FILL BLANKS ── */
function nlNormFillToken(raw) {
  var s = String(raw == null ? '' : raw)
    .toLowerCase()
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  // For entries like ": (kolon før oppramsing)", keep the answer token only.
  if ((s.indexOf(':') !== -1 || s.indexOf(';') !== -1) && s.indexOf('(') !== -1) {
    s = s.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Allow optional wrapping punctuation in user input (e.g. citation parentheses).
  s = s.replace(/^\s*["'([{]+\s*/, '').replace(/\s*["')\]}.,;:!?]+\s*$/, '').trim();

  return s;
}

function nlCheckFill(cid, sid) {
  var container = document.getElementById(cid);
  if (!container) return;
  var inputs = container.querySelectorAll('.blank-input');
  var correct = 0, unanswered = 0, total = 0;
  inputs.forEach(function(inp) {
    inp.classList.remove('inp-ok', 'inp-err');

    var ans = [];
    try { ans = JSON.parse(inp.dataset.ans || '[]'); } catch(e) {}

    var accepted = ans
      .map(nlNormFillToken)
      .filter(function(v) { return !!v; });

    // Some blanks are intentionally open (data-ans='[]') and should not be auto-scored.
    if (!accepted.length) return;

    total++;
    var val = nlNormFillToken(inp.value);
    if (!val) { unanswered++; return; }

    if (accepted.indexOf(val) !== -1) {
      inp.classList.add('inp-ok');
      correct++;
    } else {
      inp.classList.add('inp-err');
    }
  });

  if (total === 0) {
    nlSetScore(sid, 'Ingen autosjekk i denne oppgaven. Bruk "Vis fasit" for sammenligning.');
    return;
  }

  if (unanswered > 0) {
    nlSetScore(sid, 'Fyll inn alle felta.');
  } else {
    nlSetScore(sid, correct + ' av ' + total + ' rette', correct === total ? 'ok' : 'err');
  }
}
function nlResetFill(cid, sid) {
  var c = document.getElementById(cid);
  if (c) c.querySelectorAll('.blank-input').forEach(function(i){ i.value=''; i.classList.remove('inp-ok','inp-err'); });
  nlClearScore(sid);
}

/* ── MULTIPLE CHOICE (V1 import) ── */
function nlCheckMc(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;

  var answer = String(area.dataset.answer || '').trim();
  var selected = area.querySelector('input[type="radio"]:checked');
  var opts = area.querySelectorAll('.mcq-opt');
  opts.forEach(function(opt){ opt.classList.remove('ok', 'err'); });

  if (!selected) {
    nlSetScore(sid, 'Vel ett alternativ før du sjekkar.');
    return;
  }

  var selectedOpt = selected.closest('.mcq-opt');
  var correctInput = area.querySelector('input[type="radio"][value="' + answer + '"]');
  var correctOpt = correctInput ? correctInput.closest('.mcq-opt') : null;

  if (selected.value === answer) {
    if (selectedOpt) selectedOpt.classList.add('ok');
    nlSetScore(sid, '1 av 1 rett', 'ok');
  } else {
    if (selectedOpt) selectedOpt.classList.add('err');
    if (correctOpt) correctOpt.classList.add('ok');
    nlSetScore(sid, 'Sjå markeringa.', 'err');
  }
}

function nlResetMc(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;
  area.querySelectorAll('input[type="radio"]').forEach(function(inp){ inp.checked = false; });
  area.querySelectorAll('.mcq-opt').forEach(function(opt){ opt.classList.remove('ok', 'err'); });
  nlClearScore(sid);
}

/* ── MULTIPLE CHOICE SET (several MC blocks in one exercise) ── */
function nlCheckMcSet(tid, sid) {
  var container = document.getElementById(tid);
  if (!container) return;

  var areas = container.querySelectorAll('.mcq-area[data-answer]');
  if (!areas.length) {
    nlSetScore(sid, 'Ingen autosjekk i denne oppgaven.');
    return;
  }

  var total = 0;
  var correct = 0;
  var unanswered = 0;

  areas.forEach(function(area) {
    var answer = String(area.dataset.answer || '').trim();
    if (!answer) return;

    total++;
    var selected = area.querySelector('input[type="radio"]:checked');
    var opts = area.querySelectorAll('.mcq-opt');
    opts.forEach(function(opt){ opt.classList.remove('ok', 'err'); });

    if (!selected) {
      unanswered++;
      return;
    }

    var selectedOpt = selected.closest('.mcq-opt');
    var correctInput = area.querySelector('input[type="radio"][value="' + answer + '"]');
    var correctOpt = correctInput ? correctInput.closest('.mcq-opt') : null;

    if (selected.value === answer) {
      if (selectedOpt) selectedOpt.classList.add('ok');
      correct++;
    } else {
      if (selectedOpt) selectedOpt.classList.add('err');
      if (correctOpt) correctOpt.classList.add('ok');
    }
  });

  if (unanswered > 0) {
    nlSetScore(sid, 'Vel ett alternativ på alle delspørsmål.');
    return;
  }

  nlSetScore(sid, correct + ' av ' + total + ' rette', correct === total ? 'ok' : 'err');
}

function nlResetMcSet(tid, sid) {
  var container = document.getElementById(tid);
  if (!container) return;
  container.querySelectorAll('.mcq-area').forEach(function(area) {
    area.querySelectorAll('input[type="radio"]').forEach(function(inp){ inp.checked = false; });
    area.querySelectorAll('.mcq-opt').forEach(function(opt){ opt.classList.remove('ok', 'err'); });
  });
  nlClearScore(sid);
}

/* ── INLINE SELECT FILL (fillsel) ── */
function nlCheckFillSel(tid, sid) {
  var container = document.getElementById(tid);
  if (!container) return;
  var selects = container.querySelectorAll('select.fill-select');
  if (!selects.length) return;
  var total = 0, correct = 0, unanswered = 0;
  selects.forEach(function(sel) {
    sel.classList.remove('sel-ok', 'sel-err');
    var answer = sel.dataset.answer;
    if (answer == null) return;
    total++;
    if (!sel.value) { unanswered++; return; }
    if (sel.value === answer) {
      sel.classList.add('sel-ok');
      correct++;
    } else {
      sel.classList.add('sel-err');
    }
  });
  if (unanswered > 0) {
    nlSetScore(sid, 'Velg ett alternativ i hvert felt.');
    return;
  }
  nlSetScore(sid, correct + ' av ' + total + ' rette', correct === total ? 'ok' : 'err');
}

function nlResetFillSel(tid, sid) {
  var container = document.getElementById(tid);
  if (!container) return;
  container.querySelectorAll('select.fill-select').forEach(function(sel) {
    sel.selectedIndex = 0;
    sel.classList.remove('sel-ok', 'sel-err');
  });
  nlClearScore(sid);
}

/* ── DRAG-ORD (V1 import, click-to-build) ── */
var _dragOrdBtn = null;
function nlInitDragOrd() {
  document.querySelectorAll('.drag-ord-area').forEach(function(area) {
    var bank = area.querySelector('.drag-ord-bank');
    var answer = area.querySelector('.drag-ord-answer');

    /* Make bank and answer zones accept HTML5 drops */
    [bank, answer].forEach(function(zone) {
      if (!zone || zone.dataset.nlDragOrdZone === '1') return;
      zone.dataset.nlDragOrdZone = '1';
      zone.addEventListener('dragover', function(e) {
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
      zone.addEventListener('drop', function(e) {
        e.preventDefault(); zone.classList.remove('drag-over');
        if (!_dragOrdBtn) return;
        _dragOrdBtn.classList.remove('dragging');
        if (zone === answer) {
          nlDragOrdMoveToAnswer(_dragOrdBtn);
        } else {
          nlDragOrdMoveToBank(_dragOrdBtn);
        }
        _dragOrdBtn = null;
      });
    });

    area.querySelectorAll('.drag-ord-bank button, .drag-ord-answer button').forEach(function(btn, i) {
      if (!btn.dataset.order) btn.dataset.order = String(i);
      btn.classList.add('drag-ord-token');
      btn.classList.remove('drag-ord-picked');
      btn.type = 'button';
      /* HTML5 drag support */
      btn.draggable = true;
      if (btn.dataset.nlDragOrdBound !== '1') {
        btn.dataset.nlDragOrdBound = '1';
        btn.addEventListener('dragstart', function(e) {
          _dragOrdBtn = btn; btn.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });
        btn.addEventListener('dragend', function() {
          btn.classList.remove('dragging'); _dragOrdBtn = null;
        });
        nlAttachTouchDrag(btn, 'drag-ord');
      }
    });
  });
}

function nlDragOrdMoveToAnswer(btn) {
  var area = btn.closest('.drag-ord-area');
  if (!area) return;
  var answer = area.querySelector('.drag-ord-answer');
  if (!answer) return;
  btn.classList.remove('drag-ord-token');
  btn.classList.add('drag-ord-picked');
  answer.appendChild(btn);
  if (area.dataset.score) nlClearScore(area.dataset.score);
}

function nlDragOrdMoveToBank(btn) {
  var area = btn.closest('.drag-ord-area');
  if (!area) return;
  var bank = area.querySelector('.drag-ord-bank');
  if (!bank) return;
  btn.classList.remove('drag-ord-picked');
  btn.classList.add('drag-ord-token');
  bank.appendChild(btn);
  if (area.dataset.score) nlClearScore(area.dataset.score);
}

function nlCheckDragOrd(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;
  var answer = area.querySelector('.drag-ord-answer');
  if (!answer) return;

  var chosen = Array.prototype.slice.call(answer.querySelectorAll('button')).map(function(btn) {
    return (btn.dataset.word || btn.textContent || '').trim().toLowerCase();
  });

  var correct = [];
  try { correct = JSON.parse(area.dataset.correct || '[]'); } catch(e) {}
  correct = correct.map(function(w) { return String(w).trim().toLowerCase(); });

  answer.querySelectorAll('button').forEach(function(btn){ btn.classList.remove('ok', 'err'); });

  if (!chosen.length) {
    nlSetScore(sid, 'Bygg setningen før du sjekkar.');
    return;
  }

  var exact = chosen.length === correct.length && chosen.every(function(w, i) { return w === correct[i]; });

  if (exact) {
    answer.querySelectorAll('button').forEach(function(btn){ btn.classList.add('ok'); });
    nlSetScore(sid, 'Rett rekkefølge.', 'ok');
    return;
  }

  var inPos = 0;
  var len = Math.min(chosen.length, correct.length);
  for (var i = 0; i < len; i++) {
    if (chosen[i] === correct[i]) {
      inPos++;
      if (answer.children[i]) answer.children[i].classList.add('ok');
    } else {
      if (answer.children[i]) answer.children[i].classList.add('err');
    }
  }
  for (var j = len; j < answer.children.length; j++) {
    answer.children[j].classList.add('err');
  }

  nlSetScore(sid, inPos + ' av ' + correct.length + ' ord på rett plass', 'err');
}

function nlResetDragOrd(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;
  var bank = area.querySelector('.drag-ord-bank');
  var answer = area.querySelector('.drag-ord-answer');
  if (!bank || !answer) return;

  Array.prototype.slice.call(answer.querySelectorAll('button')).forEach(function(btn) {
    btn.classList.remove('ok', 'err', 'drag-ord-picked');
    btn.classList.add('drag-ord-token');
    bank.appendChild(btn);
  });

  Array.prototype.slice.call(bank.querySelectorAll('button'))
    .sort(function(a, b) { return Number(a.dataset.order || '0') - Number(b.dataset.order || '0'); })
    .forEach(function(btn) { bank.appendChild(btn); });

  nlClearScore(sid);
}

/* ── FIX (contenteditable) ── */
function nlEscRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function nlEscHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function nlFixCorrects(val) {
  if (Array.isArray(val)) return val.map(function(v){ return String(v||'').trim(); }).filter(Boolean);
  var s = String(val||'').trim();
  return s ? [s] : [];
}

function nlMarkFixText(text, errors) {
  var html = nlEscHtml(text || '');

  /* First pass: mark correctly-fixed words green */
  Object.keys(errors || {}).forEach(function(wrong) {
    var w = String(wrong || '').trim();
    if (!w) return;
    var rights = nlFixCorrects(errors[wrong]);
    /* Skip entries where wrong === every correct variant (not a real error) */
    var allSame = rights.every(function(r) { return r.toLowerCase() === w.toLowerCase(); });
    if (allSame) return;
    rights.forEach(function(right) {
      if (right.toLowerCase() === w.toLowerCase()) return;
      var rxRight = new RegExp(nlEscRe(right), 'gi');
      html = html.replace(rxRight, '<span class="fix-mark-ok">$&</span>');
    });
  });

  /* Second pass: mark remaining wrong words red */
  Object.keys(errors || {}).forEach(function(wrong) {
    var w = String(wrong || '').trim();
    if (!w) return;
    var rights = nlFixCorrects(errors[wrong]);
    var allSame = rights.every(function(r) { return r.toLowerCase() === w.toLowerCase(); });
    if (allSame) return;
    var rxWrong = new RegExp(nlEscRe(w), 'gi');
    html = html.replace(rxWrong, '<span class="fix-mark-err">$&</span>');
  });

  return html.replace(/\n/g, '<br>');
}

function nlHideFixFasitButtons() {
  document.querySelectorAll('.btn-check[data-check="fix"]').forEach(function(btn) {
    var targetId = btn.dataset.target;
    if (!targetId) return;

    var fixArea = document.getElementById(targetId);
    if (!fixArea) return;

    var errors = {};
    try { errors = JSON.parse(fixArea.dataset.errors || '{}'); } catch (e) { errors = {}; }

    if (Object.keys(errors).length === 0) return;

    var controls = btn.closest('.ex-controls');
    if (!controls) return;
    var fasitBtn = controls.querySelector('.btn-fasit');
    if (fasitBtn) fasitBtn.style.display = 'none';
  });
}

function nlCheckFix(tid, sid) {
  var el = document.getElementById(tid);
  if (!el) return;

  var errors = {};
  try { errors = JSON.parse(el.dataset.errors || '{}'); } catch(e) {}

  var current = (el.innerText || el.textContent || '');
  var total = Object.keys(errors).length;
  var found = 0;

  Object.keys(errors).forEach(function(wrong) {
    var corrects = nlFixCorrects(errors[wrong]);
    var matched = corrects.some(function(c) {
      return current.toLowerCase().indexOf(c.toLowerCase()) !== -1;
    });
    if (matched) found++;
  });

  if (total === 0) {
    var original = (el.dataset.original || '').trim();
    var now = current.trim();
    if (!now || now === original) nlSetScore(sid, 'Gjør endringer i teksten før du sjekkar.');
    else nlSetScore(sid, 'Svar registrert. Denne oppgaven har open vurdering.', 'ok');
  } else {
    // Show direct inline feedback in the student's own text.
    el.innerHTML = nlMarkFixText(current, errors);
    el.contentEditable = 'false';
    nlSetScore(sid, found + ' av ' + total + ' retta', found === total ? 'ok' : 'err');
    /* Auto-reveal fasit ("Foreslått versjon") */
    var fixEi = el.closest('.ei');
    if (fixEi) {
      var fasitBox = fixEi.querySelector('.fasit-box');
      if (fasitBox) fasitBox.classList.add('show');
    }
  }
}

function nlResetFix(tid, sid) {
  var el = document.getElementById(tid);
  if (el) {
    el.innerText = el.dataset.original || '';
    el.contentEditable = 'true';
  }
  /* Hide fasit box on reset */
  var fixEi = el && el.closest('.ei');
  if (fixEi) {
    var fasitBox = fixEi.querySelector('.fasit-box');
    if (fasitBox) fasitBox.classList.remove('show');
  }
  nlClearScore(sid);
}

/* ── MARK (click and mark) ── */
function nlCheckMark(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;

  var answers = [];
  try { answers = JSON.parse(area.dataset.answers || '[]'); } catch(e) {}

  var items = [].slice.call(area.querySelectorAll('.mark-item'));
  var selected = items.filter(function(it) { return it.classList.contains('sel'); });
  var selKeys = selected.map(function(it) { return it.dataset.key || ''; });

  items.forEach(function(it) { it.classList.remove('ok', 'err', 'missed'); });

  if (!selected.length) {
    nlSetScore(sid, 'Klikk og marker minst ett svar før du sjekker.');
    return;
  }

  var hits = 0;
  var wrong = 0;

  selected.forEach(function(it) {
    var k = it.dataset.key || '';
    if (answers.indexOf(k) !== -1) {
      it.classList.add('ok');
      hits++;
    } else {
      it.classList.add('err');
      wrong++;
    }
  });

  var missed = 0;
  answers.forEach(function(a) {
    var found = items.find(function(it) { return (it.dataset.key || '') === a; });
    if (found && !found.classList.contains('sel')) {
      found.classList.add('missed');
      missed++;
    }
  });

  if (wrong === 0 && missed === 0) {
    nlSetScore(sid, 'Perfekt! ' + answers.length + ' av ' + answers.length + ' rette markeringar.', 'ok');
  } else {
    nlSetScore(sid, 'Rette: ' + hits + '. Feilmarkert: ' + wrong + '. Mangler: ' + missed + '.', 'err');
  }
}

function nlResetMark(tid, sid) {
  var area = document.getElementById(tid);
  if (!area) return;
  area.querySelectorAll('.mark-item').forEach(function(it) {
    it.classList.remove('sel', 'ok', 'err', 'missed');
  });
  nlClearScore(sid);
}

/* ── WRITE (textarea, heuristic feedback) ── */
function nlInitWriteChecks() {
  // Langsvar skal vurderes med fasit/eigenvurdering, ikke autosjekk.
  return;

  document.querySelectorAll('.ei').forEach(function(ei) {
    var ta = ei.querySelector('.write-area');
    var controls = ei.querySelector('.ex-controls');
    if (!ta || !controls || !ta.id) return;

    if (controls.querySelector('.btn-check[data-check="write"]')) return;

    var sid = 'score-' + ta.id.replace(/^ta-/, '');
    var score = document.getElementById(sid) || controls.querySelector('.ex-score');
    if (!score) {
      score = document.createElement('span');
      score.className = 'ex-score';
      score.id = sid;
      controls.appendChild(score);
    } else if (!score.id) {
      score.id = sid;
    }

    var checkBtn = document.createElement('button');
    checkBtn.className = 'btn-check';
    checkBtn.dataset.check = 'write';
    checkBtn.dataset.target = ta.id;
    checkBtn.dataset.score = score.id;
    checkBtn.textContent = 'Sjekk svar';

    var fasitBtn = controls.querySelector('.btn-fasit');
    if (fasitBtn) controls.insertBefore(checkBtn, fasitBtn);
    else controls.insertBefore(checkBtn, controls.firstChild);
  });
}

function nlDetectPartLabels(text) {
  var labels = [];
  var seen = {};

  var lm = text.match(/(?:^|\s)([a-f])\)/gim) || [];
  lm.forEach(function(hit) {
    var m = (hit.match(/([a-f])\)/i) || [])[1];
    if (!m) return;
    var l = m.toLowerCase();
    if (!seen[l]) {
      labels.push(l + ')');
      seen[l] = 1;
    }
  });
  if (labels.length >= 2) return labels;

  labels = [];
  seen = {};
  var nm = text.match(/(?:^|\s)([1-6])\./g) || [];
  nm.forEach(function(hit) {
    var m = (hit.match(/([1-6])\./) || [])[1];
    if (!m) return;
    if (!seen[m]) {
      labels.push(m + '.');
      seen[m] = 1;
    }
  });
  if (labels.length >= 2) return labels;

  return [];
}

function nlInitMultiPartInputs() {
  document.querySelectorAll('.ei').forEach(function(ei) {
    if (ei.dataset.multiSplitReady === '1') return;

    var ta = ei.querySelector('.write-area');
    if (!ta) return;

    var box = ei.querySelector('.box');
    var promptText = (box ? (box.innerText || box.textContent || '') : '').trim();
    var labels = nlDetectPartLabels(promptText);
    if (labels.length < 2) return;

    var wc = ei.querySelector('.word-count');
    var wcId = wc ? wc.id : '';

    var wrap = document.createElement('div');
    wrap.className = 'multi-inputs';

    labels.forEach(function(lbl) {
      var row = document.createElement('div');
      row.className = 'multi-input-row';

      var lab = document.createElement('label');
      lab.className = 'multi-input-label';
      lab.textContent = 'Del ' + lbl;

      var sub = document.createElement('textarea');
      sub.className = 'write-area multi-write-area';
      sub.placeholder = 'Skriv svar til ' + lbl;
      sub.rows = 3;
      sub.addEventListener('input', function() {
        nlSyncMultiInputs(ei, ta, wcId);
      });

      row.appendChild(lab);
      row.appendChild(sub);
      wrap.appendChild(row);
    });

    ta.style.display = 'none';
    ta.dataset.multiHidden = '1';
    ta.parentNode.insertBefore(wrap, ta);

    var resetBtn = ei.querySelector('.ex-controls .btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        wrap.querySelectorAll('.multi-write-area').forEach(function(t) { t.value = ''; });
        nlSyncMultiInputs(ei, ta, wcId);
      });
    }

    nlSyncMultiInputs(ei, ta, wcId);
    ei.dataset.multiSplitReady = '1';
  });
}

function nlExtractContextText(ei) {
  var sub = ei.querySelector('.subinst');
  if (sub) {
    var s = (sub.innerText || sub.textContent || '').trim();
    if (s) return s;
  }

  var inst = ei.querySelector('.inst');
  if (inst) {
    var t = (inst.innerText || inst.textContent || '').trim();
    if (t) return t;
  }

  var box = ei.querySelector('.box');
  if (box) {
    var b = (box.innerText || box.textContent || '').replace(/\s+/g, ' ').trim();
    if (b) return b.slice(0, 120);
  }

  return '';
}

function nlBuildWritePlaceholder(ei, ta) {
  var id = ta.id || '';
  var m = id.match(/-([a-f])$/i);
  var part = m ? m[1].toLowerCase() : '';
  var context = nlExtractContextText(ei);

  if (part) {
    return context
      ? ('Svar pa del ' + part + ') - ' + context)
      : ('Svar pa del ' + part + ') her.');
  }

  if (context) return 'Skriv svaret ditt her. ' + context;
  return 'Skriv svaret ditt her.';
}

function nlInitContextualWritePlaceholders() {
  document.querySelectorAll('.ei').forEach(function(ei) {
    ei.querySelectorAll('.write-area').forEach(function(ta) {
      if (!ta || ta.classList.contains('multi-write-area')) return;
      var ph = (ta.getAttribute('placeholder') || '').trim().toLowerCase();
      if (ph && ph !== 'skriver her...' && ph !== 'skriver her') return;
      ta.setAttribute('placeholder', nlBuildWritePlaceholder(ei, ta));
    });

    ei.querySelectorAll('.multi-write-area').forEach(function(ta, idx) {
      var lbl = ei.querySelectorAll('.multi-input-label')[idx];
      var part = lbl ? (lbl.textContent || '').replace(/^del\s*/i, '').trim() : (idx + 1 + '.');
      var context = nlExtractContextText(ei);
      ta.setAttribute('placeholder', context
        ? ('Svar pa del ' + part + ' - ' + context)
        : ('Svar pa del ' + part + ' her.'));
    });
  });
}

function nlSyncMultiInputs(ei, hiddenTa, wcId) {
  var vals = [];
  ei.querySelectorAll('.multi-write-area').forEach(function(t, i) {
    var v = (t.value || '').trim();
    if (!v) return;
    vals.push((i + 1) + '. ' + v);
  });
  hiddenTa.value = vals.join('\n');
  if (wcId) nlWC(hiddenTa, wcId);
}

function nlTokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-zA-Z\u00C0-\u017F\u00F8\u00E6\u00E5\u00D8\u00C6\u00C5\s-]/g, ' ')
    .split(/\s+/)
    .filter(function(w) { return w && w.length > 2; });
}

function nlKeyTermsFromFasit(fasitText) {
  var stop = {
    'som':1, 'det':1, 'den':1, 'de':1, 'for':1, 'med':1, 'til':1,
    'og':1, 'er':1, 'var':1, 'kan':1, 'skal':1, 'ikke':1, 'eller':1,
    'på':1, 'av':1, 'om':1, 'en':1, 'ei':1, 'et':1, 'har':1, 'vil':1
  };
  var freq = {};
  nlTokenize(fasitText).forEach(function(w) {
    if (stop[w]) return;
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.keys(freq)
    .sort(function(a, b) { return freq[b] - freq[a]; })
    .slice(0, 14);
}

function nlCheckWrite(tid, sid) {
  var ta = document.getElementById(tid);
  if (!ta) return;

  var text = (ta.value || '').trim();
  if (!text) {
    nlSetScore(sid, 'Skriv et svar før du sjekkar.');
    return;
  }

  var words = text.split(/\s+/).filter(Boolean).length;
  if (words < 4) {
    nlSetScore(sid, 'For kort svar enno. Prøv minst 1-2 hele setninger.', 'err');
    return;
  }

  var ei = ta.closest('.ei');
  var fasitText = '';
  if (ei) {
    var fb = ei.querySelector('.fasit-box .fb');
    if (fb) fasitText = (fb.innerText || fb.textContent || '').trim();
  }

  var keyTerms = nlKeyTermsFromFasit(fasitText);
  var studentSet = {};
  nlTokenize(text).forEach(function(w) { studentSet[w] = 1; });

  /* Open-ended task: no key terms or very few → pedagogical feedback + always OK */
  if (keyTerms.length <= 2) {
    var openMsg = 'Bra forsøk! ';
    if (words >= 20) openMsg = 'Godt og utfyllande svar! ';
    if (fasitText) {
      openMsg += 'Sjå eksempel på god formulering i fasiten under.';
    } else {
      openMsg += 'Samanlikn gjerne med ein medelev.';
    }
    nlSetScore(sid, openMsg, 'ok');
    /* Auto-reveal fasit so the student sees the example */
    if (ei) {
      var fasitBox = ei.querySelector('.fasit-box');
      if (fasitBox) fasitBox.style.display = 'block';
    }
    return;
  }

  var hits = keyTerms.filter(function(k) { return !!studentSet[k]; }).length;
  var ratio = keyTerms.length ? (hits / keyTerms.length) : 0;

  if (words >= 30 && ratio >= 0.45) {
    nlSetScore(sid, 'Sterkt utkast. Du treff flere sentrale punkt (' + hits + '/' + keyTerms.length + ').', 'ok');
    return;
  }

  if (words >= 15 && ratio >= 0.25) {
    nlSetScore(sid, 'God start. Du har med nokre sentrale punkt (' + hits + '/' + keyTerms.length + ').', 'ok');
    return;
  }

  nlSetScore(sid, 'Delvis treff. Samanlikn med fasit og bygg ut med flere fagord/punkt. (' + hits + '/' + keyTerms.length + ')', 'err');
}

/* ── RANK (drag-drop) ── */
var _rd = null;

function nlBuildRank(lid) {
  var list = document.getElementById(lid);
  if (!list) return;
  list.innerHTML = '';
  var items = [];
  try { items = JSON.parse(list.dataset.items || '[]'); } catch(e) {}
  // Shuffle
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }
  items.forEach(function(item, idx) {
    list.appendChild(nlMakeRI(item, idx, lid));
  });
}

function nlMakeRI(item, idx, lid) {
  var el = document.createElement('div');
  el.className = 'rank-item';
  el.draggable = true;
  el.dataset.id = item.id;
  el.innerHTML =
    '<svg class="rank-grip" width="12" height="16" viewBox="0 0 12 16" fill="currentColor">' +
    '<circle cx="4" cy="3" r="1.5"/><circle cx="4" cy="8" r="1.5"/><circle cx="4" cy="13" r="1.5"/>' +
    '<circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>' +
    '<div class="rank-num">' + (idx + 1) + '</div>' +
    '<div style="flex:1">' + item.text + '</div>';

  el.addEventListener('dragstart', function(e) {
    _rd = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move';
  });
  el.addEventListener('dragend', function() {
    el.classList.remove('dragging'); _rd = null; nlRNums(lid);
  });
  el.addEventListener('dragover', function(e) {
    e.preventDefault();
    if (!_rd || _rd === el) return;
    document.querySelectorAll('#' + lid + ' .rank-item').forEach(function(r){ r.classList.remove('drag-over'); });
    el.classList.add('drag-over');
  });
  el.addEventListener('dragleave', function() { el.classList.remove('drag-over'); });
  el.addEventListener('drop', function(e) {
    e.preventDefault(); el.classList.remove('drag-over');
    if (!_rd || _rd === el) return;
    document.getElementById(lid).insertBefore(_rd, el);
    nlRNums(lid);
  });

  /* Touch support for rank reorder */
  (function(el, lid) {
    var _rt = null;
    el.addEventListener('touchstart', function(ev) {
      var t = (ev.touches && ev.touches[0]);
      if (!t) return;
      _rt = { startX: t.clientX, startY: t.clientY, active: false, ghost: null, target: null };
    }, { passive: true });
    el.addEventListener('touchmove', function(ev) {
      if (!_rt) return;
      var t = (ev.touches && ev.touches[0]);
      if (!t) return;
      var dx = t.clientX - _rt.startX, dy = t.clientY - _rt.startY;
      if (!_rt.active && Math.sqrt(dx*dx + dy*dy) < 8) return;
      if (!_rt.active) {
        _rt.active = true;
        el.classList.add('dragging');
        _rt.ghost = el.cloneNode(true);
        _rt.ghost.classList.add('touch-drag-ghost');
        _rt.ghost.style.cssText = 'position:fixed;pointer-events:none;opacity:.85;z-index:9999;width:' + el.offsetWidth + 'px';
        document.body.appendChild(_rt.ghost);
      }
      ev.preventDefault();
      _rt.ghost.style.left = t.clientX + 'px';
      _rt.ghost.style.top = t.clientY + 'px';
      _rt.ghost.style.transform = 'translate(-50%,-50%)';
      var hit = document.elementFromPoint(t.clientX, t.clientY);
      var tgt = hit ? hit.closest('.rank-item') : null;
      if (tgt && tgt === el) tgt = null;
      var list = document.getElementById(lid);
      if (tgt && list && !list.contains(tgt)) tgt = null;
      if (tgt !== _rt.target) {
        if (_rt.target) _rt.target.classList.remove('drag-over');
        _rt.target = tgt;
        if (_rt.target) _rt.target.classList.add('drag-over');
      }
    }, { passive: false });
    el.addEventListener('touchend', function(ev) {
      if (!_rt) return;
      if (_rt.active) {
        ev.preventDefault();
        if (_rt.target) {
          _rt.target.classList.remove('drag-over');
          document.getElementById(lid).insertBefore(el, _rt.target);
          nlRNums(lid);
        }
        if (_rt.ghost && _rt.ghost.parentNode) _rt.ghost.parentNode.removeChild(_rt.ghost);
        el.classList.remove('dragging');
      }
      _rt = null;
    }, { passive: false });
    el.addEventListener('touchcancel', function() {
      if (_rt) {
        if (_rt.target) _rt.target.classList.remove('drag-over');
        if (_rt.ghost && _rt.ghost.parentNode) _rt.ghost.parentNode.removeChild(_rt.ghost);
        el.classList.remove('dragging');
        _rt = null;
      }
    }, { passive: true });
  })(el, lid);

  return el;
}

function nlRNums(lid) {
  var list = document.getElementById(lid);
  if (!list) return;
  list.querySelectorAll('.rank-item').forEach(function(el, i) {
    el.querySelector('.rank-num').textContent = i + 1;
    el.classList.remove('rank-ok', 'rank-err');
  });
}

function nlCheckRank(lid, sid) {
  var list = document.getElementById(lid);
  if (!list) return;
  var co = [];
  try { co = JSON.parse(list.dataset.correct || '[]'); } catch(e) {}
  var items = list.querySelectorAll('.rank-item');
  var correct = 0;
  items.forEach(function(el, i) {
    el.classList.remove('rank-ok', 'rank-err');
    if (el.dataset.id === co[i]) { el.classList.add('rank-ok'); correct++; }
    else { el.classList.add('rank-err'); }
    el.querySelector('.rank-num').textContent = i + 1;
  });
  nlSetScore(sid, correct + ' av ' + items.length + ' på rett plass', correct === items.length ? 'ok' : 'err');
}

/* ── SORT (drag-to-bucket) ── */
var _sd = null;
var _sp = null;
var _bd = null;
var _bp = null;
var _td = null;

function nlTouchPoint(ev) {
  if (!ev) return null;
  var t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]);
  if (!t) return null;
  return { x: t.clientX, y: t.clientY };
}

function nlTouchDropSelector(kind) {
  if (kind === 'drag-ord') {
    return '.drag-ord-answer, .drag-ord-bank';
  }
  return kind === 'burger'
    ? '.burger-bucket-drop, .burger-bank'
    : '.sort-bucket-drop, .sort-bank';
}

function nlTouchCreateGhost(chip, p) {
  var g = chip.cloneNode(true);
  g.classList.add('touch-drag-ghost');
  g.style.position = 'fixed';
  g.style.left = p.x + 'px';
  g.style.top = p.y + 'px';
  g.style.transform = 'translate(-50%, -50%)';
  g.style.pointerEvents = 'none';
  document.body.appendChild(g);
  return g;
}

function nlTouchApplyTarget(kind, chip, target) {
  if (!target) return false;
  if (kind === 'drag-ord') {
    if (target.matches('.drag-ord-answer')) {
      chip.classList.remove('drag-ord-token', 'picked');
      chip.classList.add('drag-ord-picked');
      target.appendChild(chip);
      return true;
    }
    if (target.matches('.drag-ord-bank')) {
      chip.classList.remove('drag-ord-picked', 'picked');
      chip.classList.add('drag-ord-token');
      target.appendChild(chip);
      return true;
    }
    return false;
  }

  if (kind === 'burger') {
    if (target.matches('.burger-bucket-drop') || target.matches('.burger-bank')) {
      chip.classList.remove('picked');
      target.appendChild(chip);
      if (_bp === chip) _bp = null;
      return true;
    }
    return false;
  }

  if (target.matches('.sort-bucket-drop') || target.matches('.sort-bank')) {
    chip.classList.remove('picked');
    target.appendChild(chip);
    if (_sp === chip) _sp = null;
    return true;
  }
  return false;
}

function nlTouchClearDrag() {
  if (!_td) return;
  if (_td.target) _td.target.classList.remove('drag-over');
  if (_td.ghost && _td.ghost.parentNode) _td.ghost.parentNode.removeChild(_td.ghost);
  if (_td.chip) _td.chip.classList.remove('dragging');
  _td = null;
}

function nlAttachTouchDrag(chip, kind) {
  if (!chip) return;

  chip.addEventListener('touchstart', function(ev) {
    var p = nlTouchPoint(ev);
    if (!p) return;
    _td = {
      kind: kind,
      chip: chip,
      startX: p.x,
      startY: p.y,
      active: false,
      ghost: null,
      target: null,
      moved: false
    };
  }, { passive: true });

  chip.addEventListener('touchmove', function(ev) {
    if (!_td || _td.chip !== chip) return;
    var p = nlTouchPoint(ev);
    if (!p) return;

    var dx = p.x - _td.startX;
    var dy = p.y - _td.startY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (!_td.active && dist < 8) return;

    if (!_td.active) {
      _td.active = true;
      _td.moved = true;
      chip.classList.add('dragging');
      _td.ghost = nlTouchCreateGhost(chip, p);
    }

    ev.preventDefault();
    if (_td.ghost) {
      _td.ghost.style.left = p.x + 'px';
      _td.ghost.style.top = p.y + 'px';
    }

    var el = document.elementFromPoint(p.x, p.y);
    var target = el ? el.closest(nlTouchDropSelector(kind)) : null;
    if (target !== _td.target) {
      if (_td.target) _td.target.classList.remove('drag-over');
      _td.target = target;
      if (_td.target && _td.target.matches('.sort-bucket-drop, .burger-bucket-drop, .drag-ord-answer, .drag-ord-bank')) {
        _td.target.classList.add('drag-over');
      }
    }
  }, { passive: false });

  chip.addEventListener('touchend', function(ev) {
    if (!_td || _td.chip !== chip) return;
    var wasActive = _td.active;
    var target = _td.target;

    if (wasActive) {
      ev.preventDefault();
      if (!target) {
        var p = nlTouchPoint(ev);
        var el = p ? document.elementFromPoint(p.x, p.y) : null;
        target = el ? el.closest(nlTouchDropSelector(kind)) : null;
      }
      nlTouchApplyTarget(kind, chip, target);
      chip.dataset.nlTouchDragged = '1';
      setTimeout(function() { chip.dataset.nlTouchDragged = ''; }, 50);
    }

    nlTouchClearDrag();
  }, { passive: false });

  chip.addEventListener('touchcancel', function() {
    if (_td && _td.chip === chip) nlTouchClearDrag();
  }, { passive: true });
}

function nlSortPlacePicked(target) {
  if (!_sp || !target) return;
  _sp.classList.remove('picked');
  target.appendChild(_sp);
  _sp = null;
}

function nlBurgerPlacePicked(target) {
  if (!_bp || !target) return;
  _bp.classList.remove('picked');
  target.appendChild(_bp);
  _bp = null;
}

function nlBuildSort(eid) {
  var ex = document.getElementById(eid);
  if (!ex) return;
  var words = [], buckets = [];
  try { words   = JSON.parse(ex.dataset.words   || '[]'); } catch(e) {}
  try { buckets = JSON.parse(ex.dataset.buckets || '[]'); } catch(e) {}
  // Shuffle (skip if data-noshuffle)
  if (!ex.hasAttribute('data-noshuffle')) {
    for (var i = words.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = words[i]; words[i] = words[j]; words[j] = tmp;
    }
  }
  ex.innerHTML = '';
  // Word bank
  var bank = document.createElement('div');
  bank.className = 'sort-bank';
  var lbl = document.createElement('div');
  lbl.className = 'sort-bank-label';
  lbl.textContent = 'Ordbank:';
  bank.appendChild(lbl);
  words.forEach(function(w) { bank.appendChild(nlMakeSortChip(w)); });
  bank.addEventListener('dragover', function(e) { e.preventDefault(); });
  bank.addEventListener('drop', function(e) {
    e.preventDefault();
    if (!_sd) return;
    _sd.classList.remove('dragging');
    bank.appendChild(_sd);
    _sd = null;
  });
  bank.addEventListener('click', function(e) {
    if (e.target.closest('.sort-chip')) return;
    nlSortPlacePicked(bank);
  });
  ex.appendChild(bank);
  // Buckets grid
  var grid = document.createElement('div');
  grid.className = 'sort-buckets';
  buckets.forEach(function(b) {
    var bucket = document.createElement('div');
    bucket.className = 'sort-bucket';
    var bl = document.createElement('div');
    bl.className = 'sort-bucket-label';
    bl.textContent = b.label;
    var drop = document.createElement('div');
    drop.className = 'sort-bucket-drop';
    drop.dataset.bucketId = b.id;
    drop.addEventListener('dragover', function(e) {
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      drop.classList.add('drag-over');
    });
    drop.addEventListener('dragleave', function() { drop.classList.remove('drag-over'); });
    drop.addEventListener('drop', function(e) {
      e.preventDefault(); drop.classList.remove('drag-over');
      if (!_sd) return;
      _sd.classList.remove('dragging');
      drop.appendChild(_sd);
      _sd = null;
    });
    drop.addEventListener('click', function(e) {
      if (e.target.closest('.sort-chip') && !_sp) return;
      nlSortPlacePicked(drop);
    });
    bucket.addEventListener('click', function(e) {
      if (!_sp) return;
      if (e.target.closest('.sort-chip')) return;
      nlSortPlacePicked(drop);
    });
    bl.addEventListener('click', function() {
      nlSortPlacePicked(drop);
    });
    bucket.appendChild(bl);
    bucket.appendChild(drop);
    grid.appendChild(bucket);
  });
  ex.appendChild(grid);
}

function nlMakeSortChip(word) {
  var chip = document.createElement('span');
  chip.className = 'sort-chip';
  chip.textContent = word;
  chip.draggable = true;
  chip.dataset.word = word;
  chip.addEventListener('dragstart', function(e) {
    _sd = chip; chip.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  chip.addEventListener('dragend', function() {
    chip.classList.remove('dragging'); _sd = null;
  });
  chip.addEventListener('click', function(e) {
    if (chip.dataset.nlTouchDragged === '1') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    var targetDrop = chip.closest('.sort-bucket-drop');
    if (_sp && _sp !== chip && targetDrop) {
      nlSortPlacePicked(targetDrop);
      return;
    }
    chip.classList.remove('chip-ok', 'chip-err');
    if (_sp === chip) {
      chip.classList.remove('picked'); _sp = null;
    } else {
      if (_sp) _sp.classList.remove('picked');
      _sp = chip; chip.classList.add('picked');
    }
  });
  nlAttachTouchDrag(chip, 'sort');
  return chip;
}

function nlCheckSort(eid, sid) {
  var ex = document.getElementById(eid);
  if (!ex) return;
  var inBank = ex.querySelectorAll('.sort-bank .sort-chip').length;
  if (inBank > 0) {
    nlSetScore(sid, 'Plasser alle ordene i ei bøtte før du sjekkar (' + inBank + ' att).');
    return;
  }
  var answers = {};
  try { answers = JSON.parse(ex.dataset.answers || '{}'); } catch(e) {}
  var total = 0, correct = 0;
  ex.querySelectorAll('.sort-bucket-drop').forEach(function(drop) {
    var bid = drop.dataset.bucketId;
    drop.querySelectorAll('.sort-chip').forEach(function(chip) {
      total++;
      chip.classList.remove('chip-ok', 'chip-err', 'picked');
      if (answers[chip.dataset.word] === bid) { chip.classList.add('chip-ok'); correct++; }
      else { chip.classList.add('chip-err'); }
    });
  });
  nlSetScore(sid, correct + ' av ' + total + ' rette', correct === total ? 'ok' : 'err');
}

/* ── BURGER SORT (V1 import) ── */
function nlBuildBurger(eid) {
  var ex = document.getElementById(eid);
  if (!ex) return;

  var items = [], buckets = [];
  try { items = JSON.parse(ex.dataset.items || '[]'); } catch(e) {}
  try { buckets = JSON.parse(ex.dataset.buckets || '[]'); } catch(e) {}

  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }

  ex.innerHTML = '';

  var bank = document.createElement('div');
  bank.className = 'burger-bank';
  var bankLbl = document.createElement('div');
  bankLbl.className = 'burger-bank-label';
  bankLbl.textContent = 'Kort som skal sorteres:';
  bank.appendChild(bankLbl);
  items.forEach(function(txt) { bank.appendChild(nlMakeBurgerChip(txt)); });

  bank.addEventListener('dragover', function(e) { e.preventDefault(); });
  bank.addEventListener('drop', function(e) {
    e.preventDefault();
    if (!_bd) return;
    _bd.classList.remove('dragging');
    bank.appendChild(_bd);
    _bd = null;
  });
  bank.addEventListener('click', function(e) {
    if (e.target.closest('.burger-chip')) return;
    nlBurgerPlacePicked(bank);
  });
  ex.appendChild(bank);

  var grid = document.createElement('div');
  grid.className = 'burger-buckets';
  buckets.forEach(function(b) {
    var bucket = document.createElement('div');
    bucket.className = 'burger-bucket';

    var label = document.createElement('div');
    label.className = 'burger-bucket-label';
    label.textContent = b.label;

    var drop = document.createElement('div');
    drop.className = 'burger-bucket-drop';
    drop.dataset.bucketId = b.id;

    drop.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      drop.classList.add('drag-over');
    });
    drop.addEventListener('dragleave', function() { drop.classList.remove('drag-over'); });
    drop.addEventListener('drop', function(e) {
      e.preventDefault();
      drop.classList.remove('drag-over');
      if (!_bd) return;
      _bd.classList.remove('dragging');
      drop.appendChild(_bd);
      _bd = null;
    });
    drop.addEventListener('click', function(e) {
      if (e.target.closest('.burger-chip') && !_bp) return;
      nlBurgerPlacePicked(drop);
    });
    bucket.addEventListener('click', function(e) {
      if (!_bp) return;
      if (e.target.closest('.burger-chip')) return;
      nlBurgerPlacePicked(drop);
    });
    label.addEventListener('click', function() {
      nlBurgerPlacePicked(drop);
    });

    bucket.appendChild(label);
    bucket.appendChild(drop);
    grid.appendChild(bucket);
  });
  ex.appendChild(grid);
}

function nlMakeBurgerChip(text) {
  var chip = document.createElement('span');
  chip.className = 'burger-chip';
  chip.textContent = text;
  chip.draggable = true;
  chip.dataset.word = text;

  chip.addEventListener('dragstart', function(e) {
    _bd = chip;
    chip.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  chip.addEventListener('dragend', function() {
    chip.classList.remove('dragging');
    _bd = null;
  });
  chip.addEventListener('click', function(e) {
    if (chip.dataset.nlTouchDragged === '1') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    var targetDrop = chip.closest('.burger-bucket-drop');
    if (_bp && _bp !== chip && targetDrop) {
      nlBurgerPlacePicked(targetDrop);
      return;
    }
    chip.classList.remove('burger-ok', 'burger-err');
    if (_bp === chip) {
      chip.classList.remove('picked');
      _bp = null;
    } else {
      if (_bp) _bp.classList.remove('picked');
      _bp = chip;
      chip.classList.add('picked');
    }
  });

  nlAttachTouchDrag(chip, 'burger');

  return chip;
}

function nlCheckBurger(eid, sid) {
  var ex = document.getElementById(eid);
  if (!ex) return;

  var inBank = ex.querySelectorAll('.burger-bank .burger-chip').length;
  if (inBank > 0) {
    nlSetScore(sid, 'Plasser alle korta i et lag før du sjekkar (' + inBank + ' att).');
    return;
  }

  var answers = {};
  try { answers = JSON.parse(ex.dataset.answers || '{}'); } catch(e) {}

  var total = 0, correct = 0;
  ex.querySelectorAll('.burger-bucket-drop').forEach(function(drop) {
    var bid = drop.dataset.bucketId;
    drop.querySelectorAll('.burger-chip').forEach(function(chip) {
      total++;
      chip.classList.remove('burger-ok', 'burger-err', 'picked');
      if (answers[chip.dataset.word] === bid) {
        chip.classList.add('burger-ok');
        correct++;
      } else {
        chip.classList.add('burger-err');
      }
    });
  });

  nlSetScore(sid, correct + ' av ' + total + ' rette', correct === total ? 'ok' : 'err');
}

function nlResetBurger(eid, sid) {
  nlBuildBurger(eid);
  nlClearScore(sid);
}

function nlCheckRhythm(btn) {
  var tgt = btn.dataset.target;
  var sid = btn.dataset.score;
  var answer = btn.dataset.answer;
  var wrap = document.getElementById(tgt);
  if (!wrap) return;
  var uid = tgt.replace('rhythm-', '');
  var hid = document.getElementById('rhythm-val-' + uid);
  var sc = document.getElementById(sid);
  if (!hid || hid.value === '') { if (sc) { sc.textContent = 'Vel ein versjon først.'; sc.style.color = ''; sc.classList.remove('ok','err'); } return; }
  if (hid.value === String(answer)) {
    nlSetScore(sid, '✔ Rett!', 'ok');
  } else {
    nlSetScore(sid, '✘ Prøv igjen.', 'err');
  }
}

function nlResetRhythm(tgt, sid) {
  var wrap = document.getElementById(tgt);
  if (wrap) wrap.querySelectorAll('.rhythm-pick').forEach(function(p) {
    p.style.borderColor = 'transparent'; p.style.background = '';
  });
  var uid = tgt.replace('rhythm-', '');
  var hid = document.getElementById('rhythm-val-' + uid);
  if (hid) hid.value = '';
  nlClearScore(sid);
}

/* ── SEARCH / FILTER ── */
function nlOp() {
  var a = document.querySelector('.chip.active');
  return a ? a.dataset.op : 'alle';
}
function nlFilter(q, op) {
  document.querySelectorAll('.card').forEach(function(card) {
    var cn = (card.querySelector('.cn') || {}).textContent || '';
    var cd = (card.querySelector('.cd') || {}).textContent || '';
    var tits = [].map.call(card.querySelectorAll('.etit'), function(e) { return e.textContent; }).join(' ');
    var text = (cn + ' ' + cd + ' ' + tits).toLowerCase();
    var ms = !q || text.indexOf(q) !== -1;
    var opNeedles = [String(op || '').toLowerCase()];
    if (opNeedles[0] === 'rangere' || opNeedles[0] === 'sortere') opNeedles.push('sortering', 'sortere', 'rangere');
    if (opNeedles[0] === 'fylloppgave') opNeedles.push('fyllopp\u00E5ve');
    if (opNeedles[0] === 'fyllopp\u00E5ve') opNeedles.push('fylloppgave');
    if (opNeedles[0] === 'bygge') opNeedles.push('byggje');
    if (opNeedles[0] === 'byggje') opNeedles.push('bygge');
    var mo = op === 'alle' || [].some.call(card.querySelectorAll('.ei'), function(ei) {
      return [].some.call(ei.querySelectorAll('.b'), function(b) {
        var bt = b.textContent.toLowerCase();
        return opNeedles.some(function(needle) { return bt.indexOf(needle) !== -1; });
      });
    });
    card.classList.toggle('hidden', !(ms && mo));
  });
  document.querySelectorAll('.grp').forEach(function(g) {
    var v = [].some.call(g.querySelectorAll('.card'), function(c) { return !c.classList.contains('hidden'); });
    g.style.display = v ? '' : 'none';
  });
}

function nlTypeMetaFromCheckType(checkType) {
  var t = String(checkType || '').toLowerCase();
  if (t === 'fix') return { cls: 'ok', label: 'Korrigere' };
  if (t === 'fill') return { cls: 'of', label: 'Fylloppgave' };
  if (t === 'mark' || t === 'mc' || t === 'mcset') return { cls: 'oi', label: 'Identifisere' };
  if (t === 'drag-ord') return { cls: 'ob', label: 'Bygge' };
  if (t === 'rank' || t === 'sort' || t === 'burger') return { cls: 'or', label: 'Sortere' };
  if (t === 'write') return { cls: 'oo', label: 'Omskrive' };
  return { cls: 'oa', label: 'Analysere' };
}

function nlNormalizeExerciseMetaFromType() {
  var rankChip = document.querySelector('.chip[data-op="rangere"]');
  if (rankChip) rankChip.textContent = 'Sortere';

  document.querySelectorAll('.ei').forEach(function(ei) {
    var title = ei.querySelector('.etog .etit');
    if (title) title.textContent = nlStripTaskTypePrefix(title.textContent || '');

    var checkBtn = ei.querySelector('.btn-check[data-check]');
    var meta = nlTypeMetaFromCheckType(checkBtn ? checkBtn.dataset.check : '');
    var badge = ei.querySelector('.etog .b:not(.dg):not(.dm):not(.da)');
    if (!badge) return;
    badge.className = 'b ' + meta.cls;
    badge.textContent = meta.label;
  });
}

function nlRefreshCounts() {
  var cards = document.querySelectorAll('.card').length;
  var oppg = document.querySelectorAll('.ei').length;
  if (typeof window !== 'undefined' && Array.isArray(window.BANKV2) && window.BANKV2.length) {
    var catMap = {};
    window.BANKV2.forEach(function(t) {
      if (!t || !t.kat) return;
      catMap[String(t.kat)] = true;
    });
    cards = Object.keys(catMap).length;
    oppg = window.BANKV2.length;
  }
  var catsEl = document.getElementById('nl-stat-categories');
  var oppgEl = document.getElementById('nl-stat-tasks');

  if (catsEl) catsEl.textContent = String(cards);
  if (oppgEl) oppgEl.textContent = String(oppg);

  if (!catsEl || !oppgEl) {
    var stats = document.querySelectorAll('.hero-stats .stat-n');
    if (!catsEl && stats[0]) stats[0].textContent = String(cards);
    if (!oppgEl && stats[1]) stats[1].textContent = String(oppg);
  }

  document.querySelectorAll('.grp').forEach(function(grp) {
    var c = grp.querySelectorAll('.card').length;
    var gc = grp.querySelector('.gcnt');
    if (!gc) return;
    gc.textContent = c + ' kategori' + (c === 1 ? '' : 'ar');
  });

  document.querySelectorAll('.card').forEach(function(card) {
    var exc = card.querySelector('.exc');
    if (!exc) return;
    var count = card.querySelectorAll('.ei').length;
    exc.textContent = count + ' oppg.';
  });
}

function nlResetExerciseVisibilityState() {
  document.querySelectorAll('.main .ei').forEach(function(ei) {
    ei.classList.remove('nl-bank-modal-open', 'nl-ad-hidden');
  });
  document.querySelectorAll('.main .card').forEach(function(card) {
    card.classList.remove('nl-ad-hidden-card');
  });
}

/* ── NEW MANUAL FLOW (v2 oppgavebank-motor) ── */
function nlOpenManualQueueInMt(ei) {
  if (!ei) return;
  if (typeof window === 'undefined' || typeof window.mtStartManualQueue !== 'function') return;

  var card = ei.closest('.card');
  var cardList = card ? Array.prototype.slice.call(card.querySelectorAll('.exlist > .ei')) : [ei];
  var idxs = cardList.map(function(node) {
    return Number(node.getAttribute('data-mt-index'));
  }).filter(function(n) {
    return Number.isFinite(n) && n >= 0;
  });
  if (!idxs.length) return;

  var startIndex = cardList.indexOf(ei);
  if (startIndex < 0) startIndex = 0;
  if (startIndex >= idxs.length) startIndex = 0;
  window.mtStartManualQueue(idxs, startIndex);
}

/* ── ADAPTIVE PRACTICE ── */
/* ── MOTIVATIONAL WELCOME MODAL ── */
function nlShowWelcomeModal() {
  var overlay = document.getElementById('nl-welcome-overlay');
  if (!overlay) return;

  var profile = null;
  try {
    var raw = window.localStorage.getItem('norsklaben-adaptive-profile-v1');
    if (raw) profile = JSON.parse(raw);
  } catch (e) {}

  var data = null;
  if (typeof mtLsGet === 'function') {
    try { data = mtLsGet(); } catch (e) {}
  }

  var hasHistory = (profile && profile.sessions > 0) || (data && data.sessions && data.sessions.length > 0);

  var emojiEl = document.getElementById('nl-welcome-emoji');
  var titleEl = document.getElementById('nl-welcome-title');
  var msgEl = document.getElementById('nl-welcome-msg');
  var statsEl = document.getElementById('nl-welcome-stats');
  var tipsEl = document.getElementById('nl-welcome-tips');
  var tipsList = document.getElementById('nl-welcome-tips-list');

  if (!hasHistory) {
    /* First-time visitor */
    if (emojiEl) emojiEl.textContent = '🌱';
    if (titleEl) titleEl.textContent = 'Velkommen til Skrivelab!';
    if (msgEl) msgEl.textContent = 'Her kan du øve på norsk skriving – grammatikk, rettskriving, tekststruktur og meir. Velg kategoriar, trykk «Start øvelse», og tjen XP for kvart rett svar!';
  } else {
    /* Returning student */
    var xp = (profile && profile.xp) || (data && data.totalXP) || 0;
    var streak = (profile && profile.streak) || 0;
    var sessions = (profile && profile.sessions) || (data && data.sessions && data.sessions.length) || 0;

    /* Level lookup */
    var lvl = 1;
    if (typeof MT_XP_LEVELS !== 'undefined') {
      for (var i = MT_XP_LEVELS.length - 1; i >= 0; i--) {
        if (xp >= MT_XP_LEVELS[i].xp) { lvl = i + 1; break; }
      }
    }

    var greetings = [
      'Bra å sjå deg igjen! 💪',
      'Klar for ei ny økt? 🎯',
      'Velkommen tilbake, mester!',
      'Dags for norsk-trening! 📝'
    ];
    var greeting = greetings[Math.floor(Math.random() * greetings.length)];

    var icons = ['🔥', '⚡', '🚀', '🎯', '💪'];
    if (emojiEl) emojiEl.textContent = icons[Math.floor(Math.random() * icons.length)];
    if (titleEl) titleEl.textContent = greeting;

    var msgs = [];
    if (sessions === 1) msgs.push('Du har fullført 1 økt så langt.');
    else if (sessions > 1) msgs.push('Du har fullført ' + sessions + ' økter!');
    if (streak >= 3) msgs.push('Imponerande ' + streak + '-dagars streak – hald fram!');
    else if (streak === 2) msgs.push('2 dagar på rad – ein til og du har ein skikkeleg streak!');
    if (msgEl) msgEl.textContent = msgs.join(' ') || 'Klar for å trene meir?';

    /* Level showcase box */
    var lvlBoxEl = document.getElementById('nl-welcome-level-box');
    var lvlIconEl = document.getElementById('nl-welcome-lvl-icon');
    var lvlNameEl = document.getElementById('nl-welcome-lvl-name');
    var lvlFillEl = document.getElementById('nl-welcome-lvl-fill');
    var lvlXpEl = document.getElementById('nl-welcome-lvl-xp');
    if (lvlBoxEl && typeof MT_XP_LEVELS !== 'undefined') {
      var lvlDef = MT_XP_LEVELS[lvl - 1] || MT_XP_LEVELS[0];
      var nextDef = MT_XP_LEVELS[lvl] || null;
      if (lvlIconEl) lvlIconEl.textContent = lvlDef.icon || '\uD83C\uDF31';
      if (lvlNameEl) lvlNameEl.textContent = lvlDef.name || 'Ordl\u00e6rling';
      if (nextDef) {
        var range = nextDef.xp - lvlDef.xp;
        var prog = xp - lvlDef.xp;
        var pct = range > 0 ? Math.min(100, Math.round(prog / range * 100)) : 100;
        if (lvlFillEl) lvlFillEl.style.width = pct + '%';
        if (lvlXpEl) lvlXpEl.textContent = xp + ' / ' + nextDef.xp + ' XP';
      } else {
        if (lvlFillEl) lvlFillEl.style.width = '100%';
        if (lvlXpEl) lvlXpEl.textContent = xp + ' XP — Maks niv\u00e5!';
      }
      lvlBoxEl.hidden = false;
    }

    /* Stats pills */
    var xpEl = document.getElementById('nl-welcome-xp');
    var streakEl = document.getElementById('nl-welcome-streak');
    if (xpEl) xpEl.textContent = xp;
    if (streakEl) streakEl.textContent = streak;
    if (statsEl) statsEl.hidden = false;

    /* Weak categories from feillogg */
    if (typeof BANKV2 !== 'undefined' && typeof mtLsCatStats === 'function' && tipsList) {
      var labelMap = {};
      BANKV2.forEach(function(t) {
        if (t && t.kat && t.kat_label && !labelMap[t.kat]) labelMap[t.kat] = t.kat_label;
      });
      var weak = [];
      Object.keys(labelMap).forEach(function(kat) {
        var s = mtLsCatStats(kat);
        if (s.total >= 2 && s.pct < 70) weak.push({ label: labelMap[kat], pct: s.pct });
      });
      weak.sort(function(a, b) { return a.pct - b.pct; });
      weak = weak.slice(0, 3);
      if (weak.length) {
        tipsList.innerHTML = '';
        weak.forEach(function(w) {
          var li = document.createElement('li');
          li.textContent = w.label + ' (' + w.pct + ' % rett)';
          tipsList.appendChild(li);
        });
        if (tipsEl) tipsEl.hidden = false;
      }
    }
  }

  overlay.hidden = false;

  var btn = document.getElementById('nl-welcome-btn');
  if (btn) {
    btn.onclick = function() {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity .25s ease';
      setTimeout(function() { overlay.hidden = true; overlay.style.opacity = ''; }, 260);
    };
  }
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      if (btn) btn.onclick();
    }
  };
}

var nlAdState = {
  active: false,
  list: [],
  idx: 0,
  checked: new Set(),
  results: new Map(),
  cats: [],
  prevSearch: '',
  prevOp: 'alle',
  profile: null,
  xpGain: 0,
  isFeillogg: false,
  hintSource: null,
  mountedEi: null,
  mountParent: null,
  mountNext: null
};

var NL_AD_PROFILE_KEY = 'norsklaben-adaptive-profile-v1';
var NL_AD_HISTORY_KEY = 'norsklaben-adaptive-history-v1';

function nlAdTodayKey() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return String(d.getFullYear()) + '-' + m + '-' + day;
}

function nlAdPrevDayKey(dateKey) {
  var d = new Date(dateKey + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() - 1);
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return String(d.getFullYear()) + '-' + m + '-' + day;
}

function nlAdLevelFromXp(xp) {
  var safeXp = Math.max(0, Number(xp) || 0);
  if (typeof window !== 'undefined' && Array.isArray(window.MT_XP_LEVELS) && window.MT_XP_LEVELS.length) {
    var level = 1;
    for (var i = 0; i < window.MT_XP_LEVELS.length; i++) {
      var def = window.MT_XP_LEVELS[i] || {};
      var threshold = Math.max(0, Number(def.xp) || 0);
      if (safeXp >= threshold) level = i + 1;
    }
    return level;
  }
  return Math.floor(safeXp / 150) + 1;
}

function nlAdXpToNextLevel(xp) {
  var safeXp = Math.max(0, Number(xp) || 0);
  if (typeof window !== 'undefined' && Array.isArray(window.MT_XP_LEVELS) && window.MT_XP_LEVELS.length) {
    for (var i = 0; i < window.MT_XP_LEVELS.length; i++) {
      var def = window.MT_XP_LEVELS[i] || {};
      var threshold = Math.max(0, Number(def.xp) || 0);
      if (safeXp < threshold) return threshold - safeXp;
    }
    return 0;
  }
  var level = nlAdLevelFromXp(safeXp);
  var nextThreshold = level * 150;
  return Math.max(0, nextThreshold - safeXp);
}

function nlAdDefaultProfile() {
  return {
    xp: 0,
    sessions: 0,
    streak: 0,
    lastPlayedDay: '',
    bestPct: 0
  };
}

function nlAdLoadProfile() {
  var base = nlAdDefaultProfile();
  try {
    if (!window.localStorage) return base;
    var raw = window.localStorage.getItem(NL_AD_PROFILE_KEY);
    if (!raw) return base;
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    return {
      xp: Math.max(0, Number(parsed.xp) || 0),
      sessions: Math.max(0, Number(parsed.sessions) || 0),
      streak: Math.max(0, Number(parsed.streak) || 0),
      lastPlayedDay: String(parsed.lastPlayedDay || ''),
      bestPct: Math.max(0, Math.min(100, Number(parsed.bestPct) || 0))
    };
  } catch (e) {
    return base;
  }
}

function nlAdSaveProfile(profile) {
  try {
    if (!window.localStorage) return;
    window.localStorage.setItem(NL_AD_PROFILE_KEY, JSON.stringify(profile || nlAdDefaultProfile()));
  } catch (e) {}
}

/* Save incremental progress so XP isn't lost on page close */
function nlAdSaveProgress() {
  try {
    if (!window.localStorage) return;
    var pts = 0, maxPts = 0;
    nlAdState.results.forEach(function(r) {
      pts += r.points || 0;
      maxPts += r.pointsMax || 0;
    });
    var snap = {
      ts: new Date().toISOString(),
      idx: nlAdState.idx,
      total: nlAdState.list ? nlAdState.list.length : 0,
      pts: pts,
      maxPts: maxPts,
      answered: nlAdState.results.size || 0
    };
    window.localStorage.setItem(NL_AD_PROFILE_KEY + '-progress', JSON.stringify(snap));
  } catch (e) {}
}

function nlAdSaveSessionHistory(entry) {
  try {
    if (!window.localStorage) return;
    var raw = window.localStorage.getItem(NL_AD_HISTORY_KEY);
    var list = [];
    if (raw) {
      try { list = JSON.parse(raw) || []; } catch (e) { list = []; }
    }
    list.push(entry);
    if (list.length > 120) list = list.slice(-120);
    window.localStorage.setItem(NL_AD_HISTORY_KEY, JSON.stringify(list));
  } catch (e) {}
}

function nlAdRenderProfile(profile) {
  var p = profile || nlAdState.profile || nlAdDefaultProfile();
  var level = nlAdLevelFromXp(p.xp);
  var toNext = nlAdXpToNextLevel(p.xp);

  var levelEl = document.getElementById('nl-ad-prof-level');
  var xpEl = document.getElementById('nl-ad-prof-xp');
  var nextEl = document.getElementById('nl-ad-prof-next');
  var streakEl = document.getElementById('nl-ad-prof-streak');

  if (levelEl) levelEl.textContent = String(level);
  if (xpEl) xpEl.textContent = String(p.xp);
  if (nextEl) nextEl.textContent = String(toNext) + ' XP';
  if (streakEl) streakEl.textContent = String(p.streak) + (p.streak === 1 ? ' dag' : ' dager');
}

function nlAdAwardXp(totalPoints, totalMax, pct) {
  var profile = nlAdState.profile || nlAdLoadProfile();
  var base = Math.max(0, Number(totalPoints) || 0) * 10;
  var masteryBonus = pct >= 90 ? 40 : (pct >= 75 ? 25 : (pct >= 60 ? 10 : 0));
  var perfectBonus = (totalMax > 0 && totalPoints === totalMax) ? 30 : 0;
  var streakBonus = Math.min(7, profile.streak || 0) * 3;
  var gain = base + masteryBonus + perfectBonus + streakBonus;

  var today = nlAdTodayKey();
  var prevDay = nlAdPrevDayKey(today);
  if (profile.lastPlayedDay === today) {
    // same-day sessions keep streak unchanged
  } else if (profile.lastPlayedDay === prevDay) {
    profile.streak = (profile.streak || 0) + 1;
  } else {
    profile.streak = 1;
  }

  profile.sessions = (profile.sessions || 0) + 1;
  profile.lastPlayedDay = today;
  profile.bestPct = Math.max(profile.bestPct || 0, pct || 0);

  if (typeof window !== 'undefined' && typeof window.mtXpSave === 'function') {
    var total = Number(window.mtXpSave(gain));
    if (Number.isFinite(total) && total >= 0) profile.xp = total;
    else profile.xp = Math.max(0, (profile.xp || 0) + gain);
  } else {
    profile.xp = Math.max(0, (profile.xp || 0) + gain);
  }

  if (typeof window !== 'undefined' && typeof window.mtStreakRegister === 'function') {
    var st = window.mtStreakRegister();
    if (st && Number.isFinite(Number(st.current))) {
      profile.streak = Math.max(0, Number(st.current) || 0);
    }
  }

  nlAdState.profile = profile;
  nlAdState.xpGain = gain;
  nlAdSaveProfile(profile);
  nlAdRenderProfile(profile);
  return gain;
}

/* ── FRONT-PAGE STRENGTHS / WEAKNESSES ── */
function nlRenderFrontInsights() {
  var wrap = document.getElementById('nl-front-insights');
  var strBox = document.getElementById('nl-front-strengths');
  var weakBox = document.getElementById('nl-front-weak');
  if (!wrap || !strBox || !weakBox) return;
  if (typeof BANKV2 === 'undefined' || typeof mtLsCatStats !== 'function') return;

  var labelMap = {};
  BANKV2.forEach(function(t) {
    if (t && t.kat && t.kat_label && !labelMap[t.kat]) labelMap[t.kat] = t.kat_label;
  });

  var stats = [];
  Object.keys(labelMap).forEach(function(kat) {
    var s = mtLsCatStats(kat);
    if (s.total > 0) stats.push({ kat: kat, label: labelMap[kat], pct: s.pct, total: s.total });
  });
  if (!stats.length) return;

  stats.sort(function(a, b) { return b.pct - a.pct; });
  var strengths = stats.filter(function(s) { return s.pct >= 75; }).slice(0, 3);
  var weakest = stats.filter(function(s) { return s.pct < 75; });
  weakest.sort(function(a, b) { return a.pct - b.pct; });
  weakest = weakest.slice(0, 2);

  if (!strengths.length && !weakest.length) return;

  function row(s, cls) {
    return '<div class="adp-front-row ' + cls + '"><span>' + s.label + '</span><span>' + s.pct + ' %</span></div>';
  }

  strBox.innerHTML = '<h5>Styrker 💪</h5>' + (strengths.length
    ? strengths.map(function(s) { return row(s, 'ok'); }).join('')
    : '<div class="adp-front-row">Ingen data ennå</div>');
  weakBox.innerHTML = '<h5>Øv mer på 🎯</h5>' + (weakest.length
    ? weakest.map(function(s) { return row(s, 'weak'); }).join('')
    : '<div class="adp-front-row">Alt over 75 % – flott!</div>');

  wrap.hidden = false;
}

function nlInitAdaptive() {
  var root = document.getElementById('nl-adaptive');
  if (!root) return;

  var catsWrap = document.getElementById('nl-ad-cats');
  if (!catsWrap) return;

  var seen = {};

  function nlAdCreateCatButton(id, title) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'adp-cat on';
    b.dataset.cat = id;
    b.textContent = title;
    b.addEventListener('click', function() {
      b.classList.toggle('on');
    });
    return b;
  }

  var groups = Array.prototype.slice.call(document.querySelectorAll('.main .grp'));
  groups.forEach(function(grp, gi) {
    var groupCards = Array.prototype.slice.call(grp.querySelectorAll('.grid .card[data-cat]'));
    if (!groupCards.length) return;

    var groupTitleEl = grp.querySelector('.glabel');
    var groupTitle = groupTitleEl ? groupTitleEl.textContent.trim() : ('Gruppe ' + (gi + 1));

    var groupBox = document.createElement('div');
    groupBox.className = 'adp-cat-group';

    var heading = document.createElement('h4');
    heading.className = 'adp-cat-group-title';
    heading.textContent = groupTitle;
    groupBox.appendChild(heading);

    var list = document.createElement('div');
    list.className = 'adp-cat-group-list';

    groupCards.forEach(function(card) {
      var id = card.dataset.cat || '';
      if (!id || seen[id]) return;
      seen[id] = 1;
      var titleEl = card.querySelector('.cn');
      var title = titleEl ? titleEl.textContent.trim() : id;
      list.appendChild(nlAdCreateCatButton(id, title));
    });

    if (!list.children.length) return;
    groupBox.appendChild(list);
    catsWrap.appendChild(groupBox);
  });

  // Fallback: include any categories that are outside .grp blocks.
  document.querySelectorAll('.main .card[data-cat]').forEach(function(card) {
    var id = card.dataset.cat || '';
    if (!id || seen[id]) return;
    seen[id] = 1;
    var titleEl = card.querySelector('.cn');
    var title = titleEl ? titleEl.textContent.trim() : id;
    catsWrap.appendChild(nlAdCreateCatButton(id, title));
  });

  var startBtn = document.getElementById('nl-ad-start');
  var retryBtn = document.getElementById('nl-ad-retry');
  var resetBtn = document.getElementById('nl-ad-reset');
  var catsClearBtn = document.getElementById('nl-ad-cats-clear');
  var catsAllBtn = document.getElementById('nl-ad-cats-all');
  var checkBtn = document.getElementById('nl-ad-check');
  var nextBtn = document.getElementById('nl-ad-next');
  var winCloseBtn = document.getElementById('nl-ad-win-close');
  var winBg = document.getElementById('nl-ad-win-bg');
  var sumNewBtn = document.getElementById('nl-ad-sum-new');
  var sumCloseBtn = document.getElementById('nl-ad-sum-close');

  if (startBtn) startBtn.addEventListener('click', nlAdStart);
  if (retryBtn) retryBtn.addEventListener('click', nlAdStartFeillogg);
  if (resetBtn) resetBtn.addEventListener('click', nlAdReset);
  if (catsClearBtn) catsClearBtn.addEventListener('click', function() { nlAdSetAllCats(false); });
  if (catsAllBtn) catsAllBtn.addEventListener('click', function() { nlAdSetAllCats(true); });
  if (checkBtn) checkBtn.addEventListener('click', nlAdTriggerCheck);
  if (nextBtn) nextBtn.addEventListener('click', nlAdNext);
  if (winCloseBtn) winCloseBtn.addEventListener('click', nlAdReset);
  if (winBg) winBg.addEventListener('click', nlAdReset);
  if (sumNewBtn) sumNewBtn.addEventListener('click', nlAdStart);
  if (sumCloseBtn) sumCloseBtn.addEventListener('click', nlAdReset);

  nlAdState.profile = nlAdLoadProfile();
  nlAdRenderProfile(nlAdState.profile);
}

function nlAdRestoreMountedExercise() {
  if (!nlAdState.mountedEi || !nlAdState.mountParent) return;
  nlAdRestoreExerciseControls(nlAdState.mountedEi);
  if (nlAdState.mountNext && nlAdState.mountNext.parentNode === nlAdState.mountParent) {
    nlAdState.mountParent.insertBefore(nlAdState.mountedEi, nlAdState.mountNext);
  } else {
    nlAdState.mountParent.appendChild(nlAdState.mountedEi);
  }
  nlAdState.mountedEi = null;
  nlAdState.mountParent = null;
  nlAdState.mountNext = null;
}

function nlAdMountCurrentExercise(current) {
  var winBody = document.getElementById('nl-ad-win-body');
  if (!winBody || !current) return false;

  nlAdRestoreMountedExercise();

  nlAdState.mountedEi = current;
  nlAdState.mountParent = current.parentNode;
  nlAdState.mountNext = current.nextSibling;
  winBody.appendChild(current);
  return true;
}

function nlAdSelectedCats() {
  return Array.prototype.slice.call(document.querySelectorAll('#nl-ad-cats .adp-cat.on'))
    .map(function(el) { return el.dataset.cat; });
}

function nlAdSetAllCats(enabled) {
  document.querySelectorAll('#nl-ad-cats .adp-cat').forEach(function(el) {
    el.classList.toggle('on', !!enabled);
  });
}

function nlAdStartFeillogg() {
  var cats = [];
  if (typeof window !== 'undefined' && typeof window.mtFeilloggGet === 'function') {
    try {
      var logg = window.mtFeilloggGet() || [];
      var seen = {};
      logg.forEach(function(entry) {
        var kat = String(entry && entry.kat || '').trim();
        if (!kat) return;
        var resolved = nlMtResolveCard(kat);
        if (!resolved || seen[resolved]) return;
        seen[resolved] = 1;
        cats.push(resolved);
      });
    } catch (e) {}
  }

  if (!cats.length) {
    alert('Ingen tidligere feil å øve på ennå.');
    return;
  }

  var count = Math.min(10, Math.max(3, cats.length * 2));
  var list = nlAdBuildList(cats, 'adaptiv', count);
  list = nlAdDiversify(list, 2, count);
  if (!list.length) {
    alert('Fant ingen egnede oppgaver fra feilloggen.');
    return;
  }

  var si = document.getElementById('search-input');
  if (si) si.value = '';
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(ch) {
    ch.classList.remove('active');
  });
  var allChip = document.querySelector('.chip[data-op="alle"]');
  if (allChip) allChip.classList.add('active');
  nlFilter('', 'alle');

  nlAdState.active = true;
  nlAdState.list = list;
  nlAdState.idx = 0;
  nlAdState.checked = new Set();
  nlAdState.results = new Map();
  nlAdState.cats = cats.slice();
  nlAdState.xpGain = 0;
  nlAdState.isFeillogg = true;
  nlAdStreak = 0;

  nlAdSetGlobalControls(false);

  // Hide the old card grid — only the adaptive dialog should be visible
  var mainEl = document.querySelector('.main');
  if (mainEl) mainEl.style.display = 'none';
  var adaptivePanel = document.getElementById('nl-adaptive');
  if (adaptivePanel) adaptivePanel.style.display = 'none';

  var win = document.getElementById('nl-ad-win');
  if (win) win.hidden = false;

  nlAdOpenCurrent();

  var run = document.getElementById('nl-ad-run');
  var reset = document.getElementById('nl-ad-reset');
  var actions = document.getElementById('nl-ad-actions');
  var summary = document.getElementById('nl-ad-summary');
  if (run) run.hidden = false;
  if (reset) reset.hidden = false;
  if (summary) summary.hidden = true;
  if (actions) actions.style.display = 'flex';
}

function nlAdDifficulty(ei) {
  if (ei.querySelector('.b.da')) return 'viderekommende';
  if (ei.querySelector('.b.dm')) return 'middels';
  return 'lett';
}

function nlAdIsAdaptiveEligible(ei) {
  if (!ei) return false;
  // Explicit opt-out via data-adaptive="no"
  if (ei.dataset.adaptive === 'no') return false;
  var checkBtn = ei.querySelector('.btn-check');
  if (!checkBtn) return false;

  var kind = String(checkBtn.dataset.check || '').toLowerCase();
  if (!kind) return false;

  if (kind === 'write') return false;

  // Rank exercises require a specific sequence — too strict for adaptive auto-scoring.
  if (kind === 'rank') return false;

  // Fix tasks without explicit error map cannot be auto-scored reliably.
  if (kind === 'fix') {
    var targetId = checkBtn.dataset.target || '';
    var fixArea = targetId ? document.getElementById(targetId) : null;
    if (!fixArea) return false;
    var errors = {};
    try { errors = JSON.parse(fixArea.dataset.errors || '{}'); } catch (e) { errors = {}; }
    if (!Object.keys(errors).length) return false;
  }

  // Mark/klikk exercises with many targets are too complex for adaptive scoring.
  if (kind === 'mark') {
    var markId = checkBtn.dataset.target || '';
    var markEl = markId ? document.getElementById(markId) : null;
    if (markEl) {
      var answers = [];
      try { answers = JSON.parse(markEl.dataset.answers || '[]'); } catch (e) {}
      if (answers.length > 3) return false;
    }
  }

  // Drag-ord sentences with many tokens are very demanding in adaptive mode.
  if (kind === 'drag') {
    var dragId = checkBtn.dataset.target || '';
    var dragEl = dragId ? document.getElementById(dragId) : null;
    if (dragEl) {
      var tokens = dragEl.querySelectorAll('.drag-ord-token');
      if (tokens.length > 9) return false;
    }
  }

  return true;
}

function nlAdCategoryFromExercise(ei) {
  if (!ei) return '';
  if (ei.dataset.adCat) return ei.dataset.adCat;
  var card = ei.closest('.card');
  var cnEl = card ? card.querySelector('.cn') : null;
  return cnEl ? cnEl.textContent.trim() : '';
}

function nlAdCategoryIdFromExercise(ei) {
  if (!ei) return '';
  if (ei.dataset.adCatId) return ei.dataset.adCatId;
  var card = ei.closest('.card');
  return card ? (card.dataset.cat || '') : '';
}

function nlAdTypeFromExercise(ei) {
  if (!ei) return '';
  var checkBtn = ei.querySelector('.btn-check');
  var kind = String(checkBtn && checkBtn.dataset ? (checkBtn.dataset.check || '') : '').toLowerCase();
  var map = {
    fix: 'Feilretting',
    fill: 'Fylloppgave',
    mc: 'Flervalg',
    mcset: 'Flervalg-sett',
    mark: 'Klikk og marker',
    sort: 'Sortering',
    burger: 'Tekstbygging',
    rank: 'Rangering',
    'drag-ord': 'Drag ord',
    write: 'Skriveoppgave'
  };
  if (map[kind]) return map[kind];

  var badge = ei.querySelector('.b');
  return badge ? badge.textContent.trim() : 'Oppgavetype';
}

function nlAdCleanCorrectionMessage(msg) {
  var text = String(msg || '').trim();
  if (!text) return '';
  return text
    .replace(/^feil svar\.?\s*/i, '')
    .replace(/^sj[aå]\s+markeringa\.?\s*/i, '')
    .trim();
}

function nlAdCleanFeedbackText(msg, isCorrect) {
  var text = String(msg || '').trim();
  if (!text) return '';

  if (isCorrect === true) {
    text = text.replace(/^rett svar\.?\s*/i, '').trim();
  } else if (isCorrect === false) {
    text = text
      .replace(/^feil svar\.?\s*/i, '')
      .replace(/^sj[aå]\s+markeringa\.?\s*/i, '')
      .trim();
  }

  return text;
}

function nlAdShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function nlAdTake(pool, n, out) {
  var p = nlAdShuffle(pool.slice());
  while (p.length && n > 0) {
    out.push(p.shift());
    n--;
  }
  return n;
}

function nlAdBuildList(cats, level, count) {
  var wantedLevel = String(level || 'adaptiv').toLowerCase();
  if (wantedLevel === 'medium') wantedLevel = 'middels';
  if (wantedLevel === 'vanskeleg' || wantedLevel === 'vanskelig') wantedLevel = 'viderekommende';

  var all = [];
  cats.forEach(function(cat) {
    Array.prototype.forEach.call(document.querySelectorAll('.main .card[data-cat="' + cat + '"] .ei'), function(ei) {
      if (nlAdIsAdaptiveEligible(ei)) {
        // Cache contextual info before the exercise is detached from its DOM
        var card = ei.closest('.card');
        var cnEl = card ? card.querySelector('.cn') : null;
        ei.dataset.adCatId = card ? (card.dataset.cat || '') : '';
        ei.dataset.adCat = cnEl ? cnEl.textContent.trim() : '';
        var grp = ei.closest('.grp');
        var grpH2 = grp ? grp.querySelector('.glabel') : null;
        ei.dataset.adGrp = grpH2 ? grpH2.textContent.trim() : '';
        all.push(ei);
      }
    });
  });

  if (!all.length) return [];

  if (wantedLevel !== 'adaptiv') {
    var filtered = all.filter(function(ei) {
      var d = nlAdDifficulty(ei);
      return d === wantedLevel;
    });
    if (filtered.length) {
      return nlAdShuffle(filtered).slice(0, Math.min(count, filtered.length));
    }
  }

  var easy = all.filter(function(ei) { return nlAdDifficulty(ei) === 'lett'; });
  var med = all.filter(function(ei) { return nlAdDifficulty(ei) === 'middels'; });
  var hard = all.filter(function(ei) { return nlAdDifficulty(ei) === 'viderekommende'; });

  var targetEasy = Math.round(count * 0.4);
  var targetMed = Math.round(count * 0.4);
  var targetHard = Math.max(0, count - targetEasy - targetMed);

  var out = [];
  targetEasy = nlAdTake(easy, targetEasy, out);
  targetMed = nlAdTake(med, targetMed, out);
  targetHard = nlAdTake(hard, targetHard, out);

  var restNeed = count - out.length;
  if (restNeed > 0) {
    var used = new Set(out);
    var restPool = all.filter(function(ei) { return !used.has(ei); });
    nlAdTake(restPool, restNeed, out);
  }

  return out.slice(0, Math.min(count, out.length));
}

// Soft diversity: prefer at most maxPerCat per category, but always
// fill back up to targetCount using remaining exercises so the requested
// session length is honoured even when few categories are selected.
function nlAdDiversify(list, maxPerCat, targetCount) {
  var catCounts = {};
  var kept = [];
  var leftover = [];
  list.forEach(function(ei) {
    var cat = nlAdCategoryFromExercise(ei) || '_';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
    if (catCounts[cat] <= maxPerCat) kept.push(ei);
    else leftover.push(ei);
  });
  // Fill back up to the requested count if needed.
  var shortage = (targetCount || 0) - kept.length;
  if (shortage > 0 && leftover.length) {
    kept = kept.concat(leftover.slice(0, shortage));
  }
  return kept;
}

function nlAdSetGlobalControls(enabled) {
  var si = document.getElementById('search-input');
  if (si) si.disabled = !enabled;
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(ch) {
    ch.disabled = !enabled;
  });
}

function nlAdApplyVisibility(list) {
  var keep = new Set(list);

  Array.prototype.forEach.call(document.querySelectorAll('.main .ei'), function(ei) {
    ei.classList.remove('nl-ad-current', 'nl-ad-done');
    if (keep.has(ei)) ei.classList.remove('nl-ad-hidden');
    else ei.classList.add('nl-ad-hidden');
  });

  Array.prototype.forEach.call(document.querySelectorAll('.main .card'), function(card) {
    var hasVisible = Array.prototype.slice.call(card.querySelectorAll('.ei')).some(function(ei) {
      return !ei.classList.contains('nl-ad-hidden');
    });
    card.classList.toggle('nl-ad-hidden-card', !hasVisible);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.main .grp'), function(grp) {
    var hasVisibleCard = Array.prototype.slice.call(grp.querySelectorAll('.card')).some(function(card) {
      return !card.classList.contains('nl-ad-hidden-card');
    });
    grp.style.display = hasVisibleCard ? '' : 'none';
  });
}

function nlAdUpdateBadges(current) {
  var el = document.getElementById('nl-ad-badges');
  if (!el) return;
  el.innerHTML = '';
  if (!current) { el.style.display = 'none'; return; }
  var grpName = current.dataset.adGrp || '';
  var catName = current.dataset.adCat || '';
  var typeName = nlAdTypeFromExercise(current);
  var diff = nlAdDifficulty(current);
  var diffLabel = diff === 'viderekommende' ? 'Viderekommende' : diff === 'middels' ? 'Middels' : 'Lett';
  var diffStyle = diff === 'viderekommende'
    ? 'background:#fff2ef;color:#8f2f1f;border-color:#f6c7bd;'
    : diff === 'middels'
    ? 'background:#fff8e8;color:#7c5b00;border-color:#f0d38a;'
    : 'background:#e8f2f8;color:#1a567a;border-color:#b5d4e6;';
  el.style.display = 'flex';
  if (grpName) {
    var grpBadge = document.createElement('span');
    grpBadge.className = 'gram-badge adp-grp-badge';
    grpBadge.textContent = grpName;
    el.appendChild(grpBadge);
  }
  if (catName) {
    var catBadge = document.createElement('span');
    catBadge.className = 'gram-badge';
    catBadge.textContent = catName;
    el.appendChild(catBadge);
  }
  if (typeName) {
    var typeBadge = document.createElement('span');
    typeBadge.className = 'gram-badge adp-type-badge';
    typeBadge.textContent = typeName;
    el.appendChild(typeBadge);
  }
  var diffBadge = document.createElement('span');
  diffBadge.className = 'gram-badge adp-diff-badge';
  diffBadge.setAttribute('style', diffStyle);
  diffBadge.textContent = diffLabel;
  el.appendChild(diffBadge);
}

function nlAdHideExerciseControls(ei) {
  if (!ei) return;
  // Hide all exercise-internal control bars and standalone fasit buttons
  ei.querySelectorAll('.ex-controls').forEach(function(el) { el.style.display = 'none'; });
  // Hide standalone btn-fasit buttons that are NOT inside .ex-controls
  ei.querySelectorAll('.btn-fasit').forEach(function(el) {
    if (!el.closest('.ex-controls')) el.style.display = 'none';
  });
}

function nlAdRestoreExerciseControls(ei) {
  if (!ei) return;
  ei.querySelectorAll('.ex-controls').forEach(function(el) { el.style.display = ''; });
  ei.querySelectorAll('.btn-fasit').forEach(function(el) { el.style.display = ''; });
}

function nlAdAutoRevealFasit(ei) {
  if (!ei) return;
  var fasitBoxes = ei.querySelectorAll('.fasit-box');
  fasitBoxes.forEach(function(box) {
    box.classList.add('vis');
    var fb = box.querySelector('.fb');
    if (fb) fb.classList.add('shown');
  });
}

function nlAdOpenCurrent() {
  var total = nlAdState.list.length;
  if (!total) return;
  var idx = nlAdState.idx;
  if (idx < 0) idx = 0;
  if (idx >= total) idx = total - 1;
  nlAdState.idx = idx;

  nlAdState.list.forEach(function(ei) {
    ei.classList.remove('nl-ad-current');
    ei.classList.remove('open');
  });

  var current = nlAdState.list[idx];
  if (!current) return;

  var summary = document.getElementById('nl-ad-summary');
  if (summary) summary.hidden = true;

  current.classList.add('nl-ad-current');
  current.classList.add('open');
  if (nlAdState.checked.has(current)) current.classList.add('nl-ad-done');

  var mountedInWindow = nlAdMountCurrentExercise(current);
  if (!mountedInWindow) {
    var card = current.closest('.card');
    if (card) card.classList.add('open');
    current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Hide exercise-internal controls in adaptive mode (Sjekk svar, Start på nytt, Vis fasit)
  nlAdHideExerciseControls(current);

  // Inject hint toggle if exercise has a .subinst hint
  nlAdInjectHintToggle(current);

  nlAdUpdateBadges(current);
  nlAdSetFeedback('', null, '');
  nlAdSyncActionButtons();
  nlAdUpdateStatus();
}

function nlAdInjectHintToggle(ei) {
  // Remove any previously injected hint UI
  var old = document.getElementById('nl-ad-hint-wrap');
  if (old) old.remove();

  if (nlAdState.hintSource) {
    nlAdState.hintSource.style.display = '';
    nlAdState.hintSource = null;
  }

  if (!ei) return;
  var hintEl = ei.querySelector('.subinst');
  if (!hintEl) return;

  var hintText = hintEl.textContent.trim();
  if (!hintText) return;

  // Hide the original hint element
  hintEl.style.display = 'none';
  nlAdState.hintSource = hintEl;

  var wrap = document.createElement('div');
  wrap.id = 'nl-ad-hint-wrap';
  wrap.style.marginBottom = '.5rem';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'adp-hint-toggle';
  btn.innerHTML = '<span class="hint-icon">&#128161;</span> Vis hint';

  var box = document.createElement('div');
  box.className = 'adp-hint-box';
  box.textContent = hintText.replace(/^hint:\s*/i, '');

  btn.addEventListener('click', function() {
    var showing = box.classList.contains('visible');
    box.classList.toggle('visible');
    btn.innerHTML = showing
      ? '<span class="hint-icon">&#128161;</span> Vis hint'
      : '<span class="hint-icon">&#128161;</span> Skjul hint';
  });

  wrap.appendChild(btn);
  wrap.appendChild(box);

  // Insert right after .inst inside the exercise content (before interactive area)
  var instEl = ei.querySelector('.ec .inst');
  if (instEl && instEl.parentNode) {
    instEl.parentNode.insertBefore(wrap, instEl.nextSibling);
  } else {
    // Fallback: at the top of .ec
    var ec = ei.querySelector('.ec');
    if (ec) ec.insertBefore(wrap, ec.firstChild);
  }
}

function nlAdCurrentExercise() {
  return nlAdState.list[nlAdState.idx] || null;
}

function nlAdLockExercise(ei) {
  if (!ei) return;

  ei.querySelectorAll('input, textarea, select, button').forEach(function(el) {
    if (el.classList.contains('btn-fasit')) return;
    if (el.classList.contains('btn-reset')) return;
    el.disabled = true;
  });

  ei.querySelectorAll('[contenteditable="true"]').forEach(function(el) {
    el.setAttribute('contenteditable', 'false');
  });

  ei.querySelectorAll('.mark-item').forEach(function(el) {
    el.style.pointerEvents = 'none';
  });

  ei.querySelectorAll('.drag-ord-token, .drag-ord-picked, .sort-chip, .burger-chip, .rank-item').forEach(function(el) {
    el.style.pointerEvents = 'none';
    el.draggable = false;
  });
}

function nlAdRuleFromExercise(ei) {
  if (!ei) return '';
  // Prefer data-attr (injected by nlMtBuildExercise wrapper)
  if (ei.dataset && ei.dataset.regel) return ei.dataset.regel;
  // Fallback: search DOM
  var frEls = ei.querySelectorAll('.fasit-box .fr');
  for (var i = 0; i < frEls.length; i++) {
    var txt = (frEls[i].textContent || '').trim();
    if (/^regel:/i.test(txt)) return txt.replace(/^regel:\s*/i, '');
  }

  var note = ei.querySelector('.fasit-box .note');
  if (note) return note.textContent.trim();

  var paragraphs = ei.querySelectorAll('.fasit-box .fb p');
  for (var i = 0; i < paragraphs.length; i++) {
    var txt = (paragraphs[i].textContent || '').trim();
    if (txt.toLowerCase().indexOf('regel:') === 0) return txt.replace(/^regel:\s*/i, '');
  }
  return '';
}

function nlAdEksFromExercise(ei) {
  if (!ei) return '';
  // Prefer data-attr
  if (ei.dataset && ei.dataset.eks) return ei.dataset.eks;
  // Fallback: search DOM
  var frEls = ei.querySelectorAll('.fasit-box .fr');
  for (var i = 0; i < frEls.length; i++) {
    var txt = (frEls[i].textContent || '').trim();
    if (/^eksempel:/i.test(txt)) return txt.replace(/^eksempel:\s*/i, '');
  }
  return '';
}

function nlAdFasitFromExercise(ei) {
  if (!ei) return '';
  // Prefer data-attr
  if (ei.dataset && ei.dataset.fasitText) return ei.dataset.fasitText;
  // Fallback: search DOM
  var ans = ei.querySelector('.fasit-box .fb-ans');
  return ans ? ans.textContent.trim() : '';
}

function nlAdTitleFromExercise(ei) {
  if (!ei) return 'Oppgave';
  var title = ei.querySelector('.etit');
  if (!title) title = ei.querySelector('h4, h3, h2');
  var text = title ? title.textContent.trim() : 'Oppgave';
  text = nlStripTaskTypePrefix(text);
  return text || 'Oppgave';
}

/* ══════ XP visual effects on correct answer ══════ */
var nlAdStreak = 0;

function nlAdSpawnXpFloat(anchor, points, isStreak) {
  if (!anchor) return;
  var el = document.createElement('span');
  el.className = 'xp-float' + (isStreak ? ' xp-big' : '');
  var label = '+' + points;
  if (isStreak) label += ' 🔥';
  el.textContent = label;
  anchor.style.position = 'relative';
  anchor.appendChild(el);
  el.addEventListener('animationend', function() { el.remove(); });
  setTimeout(function() { if (el.parentNode) el.remove(); }, 2500);
}

function nlAdPulseScore() {
  var pill = document.getElementById('nl-ad-score-pill');
  if (!pill) return;
  pill.classList.remove('xp-pulse');
  void pill.offsetWidth;
  pill.classList.add('xp-pulse');
  pill.addEventListener('animationend', function handler() {
    pill.classList.remove('xp-pulse');
    pill.removeEventListener('animationend', handler);
  });
}

function nlAdFlashExercise(ei) {
  if (!ei) return;
  ei.classList.remove('nl-ad-correct-flash');
  void ei.offsetWidth;
  ei.classList.add('nl-ad-correct-flash');
  ei.addEventListener('animationend', function handler() {
    ei.classList.remove('nl-ad-correct-flash');
    ei.removeEventListener('animationend', handler);
  });
}

function nlAdSpawnSparks(anchor, count) {
  if (!anchor) return;
  anchor.style.position = 'relative';
  var colors = ['#7b2fbe', '#c8832a', '#1d6a45', '#1D6FD1', '#C0392B', '#f5c542'];
  for (var i = 0; i < count; i++) {
    var spark = document.createElement('span');
    spark.className = 'xp-spark';
    var angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
    var dist = 28 + Math.random() * 40;
    spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
    spark.style.background = colors[i % colors.length];
    spark.style.left = '50%';
    spark.style.top = '50%';
    anchor.appendChild(spark);
    (function(s) {
      s.addEventListener('animationend', function() { s.remove(); });
      setTimeout(function() { if (s.parentNode) s.remove(); }, 1800);
    })(spark);
  }
}

function nlAdGlowStreak() {
  var streakPill = document.getElementById('nl-ad-prof-streak');
  if (!streakPill) return;
  var pill = streakPill.closest('.adp-g-pill');
  if (!pill) return;
  pill.classList.remove('streak-glow');
  void pill.offsetWidth;
  pill.classList.add('streak-glow');
  pill.addEventListener('animationend', function handler() {
    pill.classList.remove('streak-glow');
    pill.removeEventListener('animationend', handler);
  });
}

function nlAdPlayCorrectEffects(ei, points) {
  var pts = Math.max(1, points || 1);
  nlAdStreak++;
  nlAdFlashExercise(ei);
  var scorePill = document.getElementById('nl-ad-score-pill');
  nlAdSpawnXpFloat(scorePill, pts, nlAdStreak >= 3);
  nlAdPulseScore();
  if (nlAdStreak >= 3) {
    var sparkCount = nlAdStreak >= 5 ? 14 : 8;
    nlAdSpawnSparks(scorePill, sparkCount);
    nlAdGlowStreak();
  }
}

function nlAdPlayWrongEffects() {
  nlAdStreak = 0;
}

function nlAdExtractPoints(msg, isCorrect) {
  var out = { earned: isCorrect ? 1 : 0, max: 1 };
  if (!msg) return out;

  var m = msg.match(/(\d+)\s*av\s*(\d+)\s*rette/i);
  if (!m) m = msg.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) {
    var earned = parseInt(m[1], 10);
    var max = parseInt(m[2], 10);
    if (!isNaN(earned) && !isNaN(max) && max > 0) {
      out.earned = earned;
      out.max = max;
    }
  }
  return out;
}

function nlAdStoreResult(ei, msg, isCorrect, ruleText) {
  if (!ei) return;
  var pts = nlAdExtractPoints(msg, isCorrect);
  nlAdState.results.set(ei, {
    title: nlAdTitleFromExercise(ei),
    message: msg || 'Svar sjekket.',
    rule: ruleText || '',
    correct: !!isCorrect,
    points: pts.earned,
    pointsMax: pts.max
  });
}

function nlAdMasteryData(pct) {
  if (pct >= 90) return {
    medal: '&#127942;',
    heading: 'Fantastisk innsats!',
    comment: 'Du viser sterk mestring av stoffet. Fortsett slik, og utfordre deg selv med vanskeligere oppgaver neste gang!'
  };
  if (pct >= 70) return {
    medal: '&#11088;',
    heading: 'Bra jobba!',
    comment: 'Du er på god veg! Sjekk rettingane under for å se hva du kan forbetre. Øving gjør meister!'
  };
  if (pct >= 50) return {
    medal: '&#128170;',
    heading: 'Halvvegs der!',
    comment: 'Du har forstått mye, men det er nokre tema du bør øve mer på. Gå gjennom rettingane og prøv igjen – du kommer til å merke framgang!'
  /* Clear incremental progress – full session is about to be saved */
  try { window.localStorage.removeItem(NL_AD_PROFILE_KEY + '-progress'); } catch (e) {}

  };
  return {
    medal: '&#127793;',
    heading: 'En god start!',
    comment: 'Alle startar en sted! Sjekk rettingane under nøye og prøv samme kategoriane igjen – du vil bli bedre for hver runde.'
  };
}

function nlAdNowText() {
  try {
    return new Intl.DateTimeFormat('nn-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  } catch (e) {
    return new Date().toLocaleString();
  }
}

function nlAdResultId(total, points, max) {
  var d = new Date();
  function pad(v) { return String(v).padStart(2, '0'); }
  var stamp = String(d.getFullYear())
    + pad(d.getMonth() + 1)
    + pad(d.getDate())
    + '-'
    + pad(d.getHours())
    + pad(d.getMinutes());
  return 'NL-' + stamp + '-P' + points + 'of' + max + '-N' + total;
}

/* ── LEVEL-UP MODAL WITH FIREWORKS ── */
function nlGetLevelIndex(xp) {
  if (typeof MT_XP_LEVELS === 'undefined') return 0;
  var lvl = 0;
  for (var i = MT_XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= MT_XP_LEVELS[i].xp) { lvl = i; break; }
  }
  return lvl;
}

function nlLevelUpModal(lvlIdx) {
  var lvl = (typeof MT_XP_LEVELS !== 'undefined' && MT_XP_LEVELS[lvlIdx]) ? MT_XP_LEVELS[lvlIdx] : null;
  if (!lvl) return;
  /* Dismiss welcome modal if still visible */
  var welc = document.getElementById('nl-welcome-overlay');
  if (welc && !welc.hidden) { welc.hidden = true; welc.style.opacity = ''; }
  var overlay = document.getElementById('nl-levelup-overlay');
  if (!overlay) return;
  var iconEl = document.getElementById('nl-levelup-icon');
  var nameEl = document.getElementById('nl-levelup-name');
  var msgEl = document.getElementById('nl-levelup-msg');
  if (iconEl) iconEl.textContent = lvl.icon || '\uD83C\uDF89';
  if (nameEl) nameEl.textContent = lvl.name;
  if (msgEl) msgEl.textContent = 'Du har nådd nivå ' + (lvlIdx + 1) + ' – ' + lvl.name + '! Fantastisk innsats!';
  overlay.hidden = false;
  /* Spawn firework particles */
  var fw = document.getElementById('nl-levelup-fireworks');
  if (fw) {
    fw.innerHTML = '';
    var colors = ['#f5c542','#e91e63','#1D6FD1','#1A7A50','#c8832a','#7b2fbe','#00bcd4','#ff5722'];
    for (var i = 0; i < 50; i++) {
      var p = document.createElement('span');
      p.className = 'nl-fw-spark';
      p.style.setProperty('--fw-angle', (Math.random() * 360) + 'deg');
      p.style.setProperty('--fw-dist', (40 + Math.random() * 80) + 'px');
      p.style.setProperty('--fw-delay', (Math.random() * 0.4) + 's');
      p.style.background = colors[i % colors.length];
      fw.appendChild(p);
    }
  }
  /* Auto-dismiss after 5s */
  setTimeout(function() {
    overlay.classList.add('nl-lvl-fadeout');
    setTimeout(function() { overlay.hidden = true; overlay.classList.remove('nl-lvl-fadeout'); }, 500);
  }, 4500);
}

/* ── CONFETTI + BONUS XP ON SET COMPLETION ── */
function nlConfettiBurst(bonusXp) {
  var wrap = document.createElement('div');
  wrap.className = 'nl-confetti-wrap';
  var colors = ['#1A7A50', '#1D6FD1', '#c8832a', '#C0392B', '#7b2fbe', '#f5c542', '#e91e63', '#00bcd4'];
  var count = 60;
  for (var i = 0; i < count; i++) {
    var piece = document.createElement('div');
    piece.className = 'nl-confetti-piece';
    piece.style.left = (Math.random() * 100) + '%';
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--dur', (2 + Math.random() * 1.5) + 's');
    piece.style.setProperty('--delay', (Math.random() * 0.6) + 's');
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    wrap.appendChild(piece);
  }
  document.body.appendChild(wrap);
  setTimeout(function() { if (wrap.parentNode) wrap.remove(); }, 4500);

  if (bonusXp) {
    var label = document.createElement('div');
    label.className = 'nl-confetti-bonus';
    label.textContent = '🎉 +' + bonusXp + ' bonus-XP!';
    document.body.appendChild(label);
    setTimeout(function() { if (label.parentNode) label.remove(); }, 2500);
  }
}

function nlAdShowSummary() {
  /* Clear incremental progress – full session is about to be saved */
  try { window.localStorage.removeItem(NL_AD_PROFILE_KEY + '-progress'); } catch (e) {}

  var summary = document.getElementById('nl-ad-summary');
  if (!summary) {
    nlAdReset();
    return;
  }

  // Keep summary clean: do not leave the last solved exercise mounted above it.
  nlAdRestoreMountedExercise();
  var hintWrap = document.getElementById('nl-ad-hint-wrap');
  if (hintWrap) hintWrap.remove();
  if (nlAdState.hintSource) {
    nlAdState.hintSource.style.display = '';
    nlAdState.hintSource = null;
  }
  var winBody = document.getElementById('nl-ad-win-body');
  if (winBody) winBody.innerHTML = '';

  var totalCorrect = 0;
  var totalWrong = 0;
  var totalPoints = 0;
  var totalMax = 0;
  var corrections = [];
  var categoryStats = {};

  nlAdState.list.forEach(function(ei) {
    var res = nlAdState.results.get(ei);
    if (!res) {
      res = {
        title: nlAdTitleFromExercise(ei),
        message: 'Ikke vurdert.',
        rule: '',
        correct: false,
        points: 0,
        pointsMax: 1
      };
    }

    totalPoints += res.points;
    totalMax += res.pointsMax;
    if (res.correct) totalCorrect++;
    else totalWrong++;

    var catName = nlAdCategoryFromExercise(ei) || 'Kategori';
    if (!res.correct) {
      res.cat = catName;
      corrections.push(res);
    }
    if (!categoryStats[catName]) {
      categoryStats[catName] = { points: 0, max: 0, count: 0 };
    }
    categoryStats[catName].points += res.points;
    categoryStats[catName].max += res.pointsMax;
    categoryStats[catName].count += 1;
  });

  var pct = totalMax ? Math.round((totalPoints / totalMax) * 100) : 0;
  var mastery = nlAdMasteryData(pct);

  /* Level-up detection: capture level BEFORE awarding XP */
  var preXp = ((nlAdState.profile || nlAdLoadProfile()).xp) || 0;
  var preLvl = nlGetLevelIndex(preXp);
  var sessionXp = nlAdAwardXp(totalPoints, totalMax, pct);

  /* Bonus XP + confetti for completing a full set */
  var setSize = nlAdState.list.length;
  var bonusXp = 0;
  if (setSize >= 8) bonusXp = 50;
  else if (setSize >= 5) bonusXp = 25;
  if (bonusXp > 0) {
    sessionXp += bonusXp;
    var prof = nlAdState.profile || nlAdLoadProfile();
    prof.xp = (prof.xp || 0) + bonusXp;
    nlAdSaveProfile(prof);
    nlAdRenderProfile(prof);
    setTimeout(function() { nlConfettiBurst(bonusXp); }, 400);
  }

  /* Check if level changed → show level-up modal (only during active practice) */
  var postXp = ((nlAdState.profile || nlAdLoadProfile()).xp) || 0;
  var postLvl = nlGetLevelIndex(postXp);
  if (postLvl > preLvl && nlAdState.active) {
    setTimeout(function() { nlLevelUpModal(postLvl); }, 900);
  }

  // Medal & heading
  var medalEl = document.getElementById('nl-ad-sum-medal');
  var headingEl = document.getElementById('nl-ad-sum-heading');
  if (medalEl) medalEl.innerHTML = mastery.medal;
  if (headingEl) headingEl.textContent = mastery.heading;

  // Animated percentage ring
  var ringEl = document.getElementById('nl-ad-ring');
  var ringPctEl = document.getElementById('nl-ad-ring-pct');
  var circumference = 2 * Math.PI * 42; // ~263.9
  if (ringEl) {
    ringEl.style.strokeDashoffset = String(circumference); // reset
    setTimeout(function() {
      var offset = circumference - (circumference * pct / 100);
      ringEl.style.strokeDashoffset = String(offset);
    }, 80);
  }
  if (ringPctEl) ringPctEl.textContent = pct + '%';

  // Pedagogical comment
  var commentEl = document.getElementById('nl-ad-sum-comment');
  if (commentEl) commentEl.textContent = mastery.comment;

  // KPIs
  var poengEl = document.getElementById('nl-ad-sum-poeng');
  var xpEl = document.getElementById('nl-ad-sum-xp');
  var retteEl = document.getElementById('nl-ad-sum-rette');
  var feilEl = document.getElementById('nl-ad-sum-feil');
  if (poengEl) poengEl.textContent = totalPoints + '/' + totalMax;
  if (xpEl) xpEl.textContent = '+' + String(sessionXp);
  if (retteEl) retteEl.textContent = String(totalCorrect);
  if (feilEl) feilEl.textContent = String(totalWrong);

  /* ── Språkmeister-boks (level progress) ── */
  var sumProgressFillEl = document.getElementById('nl-ad-sum-progress-fill');
  var sumProgressTextEl = document.getElementById('nl-ad-sum-progress-text');
  var sumLvlIconEl = document.getElementById('nl-ad-sum-lvl-icon');
  var sumLvlNameEl = document.getElementById('nl-ad-sum-lvl-name');
  var profProgressFillEl = document.getElementById('nl-ad-prof-progress-fill');
  var profProgressTextEl = document.getElementById('nl-ad-prof-progress-text');
  var progressWidth = profProgressFillEl ? String(profProgressFillEl.style.width || '0%') : '0%';
  if (sumProgressFillEl) {
    sumProgressFillEl.style.width = '0%';
    setTimeout(function() { sumProgressFillEl.style.width = progressWidth; }, 60);
  }
  if (sumProgressTextEl) {
    sumProgressTextEl.textContent = profProgressTextEl
      ? String(profProgressTextEl.textContent || '').trim()
      : (totalPoints + ' / ' + totalMax + ' poeng');
  }
  /* Level name + icon from profile hero */
  var profLvlNameEl = document.getElementById('nl-ad-prof-level-name');
  var profLvlIconEl = document.getElementById('nl-ad-prof-level-icon');
  if (sumLvlNameEl && profLvlNameEl) sumLvlNameEl.textContent = profLvlNameEl.textContent || 'Ordlærling';
  if (sumLvlIconEl && profLvlIconEl) sumLvlIconEl.textContent = profLvlIconEl.textContent || '\uD83C\uDF31';

  /* ── Streak-boks med grøne/raude klossar ── */
  var sumStreakEl = document.getElementById('nl-ad-sum-streak');
  var sumStreakRecordEl = document.getElementById('nl-ad-sum-streak-record');
  var sumStreakBlocksEl = document.getElementById('nl-ad-sum-streak-blocks');
  var profStreakEl = document.getElementById('nl-ad-prof-streak');
  if (sumStreakEl) {
    var defaultStreak = (document.documentElement && document.documentElement.lang === 'nb') ? '0 dager' : '0 dagar';
    sumStreakEl.textContent = profStreakEl
      ? String(profStreakEl.textContent || '').trim()
      : defaultStreak;
  }
  /* Streak record from MTS data */
  var mtsData = null;
  if (typeof mtLsGet === 'function') { try { mtsData = mtLsGet(); } catch(e) {} }
  if (mtsData && mtsData.streak) {
    if (sumStreakRecordEl) sumStreakRecordEl.textContent = String(mtsData.streak.rekord || 0);
  }
  /* Green/red blocks from session results */
  if (sumStreakBlocksEl) {
    sumStreakBlocksEl.innerHTML = '';
    nlAdState.list.forEach(function(ei, idx) {
      var res = nlAdState.results.get(ei);
      var ok = res && res.correct;
      var block = document.createElement('span');
      block.className = 'adp-sum-block ' + (ok ? 'ok' : 'err');
      block.title = (idx + 1) + '. ' + (res ? (res.title || '') : '') + ' – ' + (ok ? 'Rett' : 'Feil');
      sumStreakBlocksEl.appendChild(block);
    });
  }

  nlAdSaveSessionHistory({
    ts: new Date().toISOString(),
    points: totalPoints,
    max: totalMax,
    pct: pct,
    xp: sessionXp,
    retryMode: !!nlAdState.isFeillogg,
    cats: nlAdState.cats.slice(),
    count: nlAdState.list.length
  });

  if (typeof window !== 'undefined' && window.MTS && typeof window.mtLsSaveSession === 'function') {
    window.MTS.history = nlAdState.list.map(function(ei) {
      var res = nlAdState.results.get(ei) || { correct: false, points: 0, pointsMax: 1 };
      return {
        task: { kat: nlAdCategoryIdFromExercise(ei) || '_' },
        correct: !!res.correct,
        points: Math.max(0, Number(res.points) || 0),
        maxPts: Math.max(1, Number(res.pointsMax) || 1),
        time: new Date().toISOString(),
        isRetry: !!nlAdState.isFeillogg
      };
    });
    window.MTS.score = totalPoints;
    window.MTS.maxScore = totalMax;
    var levelElBridge = document.getElementById('nl-ad-level');
    window.MTS.level = nlAdState.isFeillogg ? 'feillogg' : (levelElBridge ? String(levelElBridge.value || 'adaptiv') : 'adaptiv');
    try { window.mtLsSaveSession(); } catch (e) {}
    if (typeof window.mtBadgesCheck === 'function') {
      try {
        var newBadges = window.mtBadgesCheck({ pct: pct, level: window.MTS.level }) || [];
        if (newBadges.length) {
          var strengthsEl2 = document.getElementById('nl-ad-sum-strengths');
          if (strengthsEl2) {
            var currentHtml = strengthsEl2.innerHTML || '';
            var badgeText = '<div class="adp-summary-row ok"><strong>Nye badges</strong><span>' + newBadges.length + ' låst opp</span></div>';
            strengthsEl2.innerHTML = currentHtml + badgeText;
            strengthsEl2.style.display = '';
          }
        }
      } catch (e) {}
    }
  }

  // Teacher screenshot section
  var timeEl = document.getElementById('nl-ad-sum-time');
  var idEl = document.getElementById('nl-ad-sum-id');
  if (timeEl) timeEl.textContent = nlAdNowText();
  if (idEl) idEl.textContent = nlAdResultId(nlAdState.list.length, totalPoints, totalMax);

  // Strengths by category (shown when mastery is clearly high in a category).
  var strengthsEl = document.getElementById('nl-ad-sum-strengths');
  if (strengthsEl) {
    var strong = Object.keys(categoryStats).map(function(cat) {
      var st = categoryStats[cat];
      var pctCat = st.max ? Math.round((st.points / st.max) * 100) : 0;
      return { cat: cat, pct: pctCat, count: st.count };
    }).filter(function(row) {
      return row.count >= 1 && row.pct >= 75;
    }).sort(function(a, b) {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return b.count - a.count;
    }).slice(0, 3);

    // Improvements – 2 weakest categories
    var weak = Object.keys(categoryStats).map(function(cat) {
      var st = categoryStats[cat];
      var pctCat = st.max ? Math.round((st.points / st.max) * 100) : 0;
      return { cat: cat, pct: pctCat, count: st.count };
    }).filter(function(row) {
      return row.count >= 1 && row.pct < 75;
    }).sort(function(a, b) {
      if (a.pct !== b.pct) return a.pct - b.pct;
      return b.count - a.count;
    }).slice(0, 2);

    var summaryHtml = '';
    if (strong.length) {
      summaryHtml += '<h5>Dette fekk jeg til</h5>';
      strong.forEach(function(row) {
        summaryHtml += '<div class="adp-summary-row ok"><strong>' + row.cat + '</strong><span>' + row.pct + '% treff</span></div>';
      });
    }
    if (weak.length) {
      summaryHtml += '<h5>Øv mer på</h5>';
      weak.forEach(function(row) {
        summaryHtml += '<div class="adp-summary-row"><strong>' + row.cat + '</strong><span>' + row.pct + '% treff</span></div>';
      });
    }

    if (summaryHtml) {
      strengthsEl.innerHTML = summaryHtml;
      strengthsEl.style.display = '';
    } else {
      strengthsEl.innerHTML = '';
      strengthsEl.style.display = 'none';
    }
  }

  // Corrections
  var rettingEl = document.getElementById('nl-ad-sum-retting');
  if (rettingEl) {
    if (!corrections.length) {
      rettingEl.innerHTML = '<div class="adp-summary-row ok"><strong>Null feil!</strong> Du klarte alle oppgavene rett – godt jobba!</div>';
    } else {
      var html = '<h5>Øv på disse igjen</h5>';
      var catCounts = {};
      corrections.forEach(function(item) {
        var c = item.cat || 'Kategori';
        if (!catCounts[c]) catCounts[c] = 0;
        catCounts[c]++;
      });
      Object.keys(catCounts).forEach(function(cat) {
        var n = catCounts[cat];
        html += '<div class="adp-summary-row">'
          + '<strong>' + cat + '</strong>'
          + '<span>' + n + (n === 1 ? ' feil' : ' feil') + '</span>'
          + '</div>';
      });
      rettingEl.innerHTML = html;
    }
  }

  nlAdSetFeedback('', null, '');
  summary.hidden = false;

  var actions = document.getElementById('nl-ad-actions');
  if (actions) actions.style.display = 'none';
  var headerClose = document.getElementById('nl-ad-win-close');
  if (headerClose) headerClose.style.display = 'none';

  var p = document.getElementById('nl-ad-progress');
  var scoreVal = document.getElementById('nl-ad-score-val');
  var f = document.getElementById('nl-ad-bar-fill');
  if (p) p.textContent = 'Økt fullført';
  if (scoreVal) scoreVal.textContent = String(totalPoints);
  if (f) f.style.width = '100%';

  // Scroll summary into view
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nlAdSetFeedback(text, isCorrect, ruleText, eksText, fasitText) {
  var box = document.getElementById('nl-ad-feedback');
  if (!box) return;

  box.classList.remove('show', 'correct-fb', 'wrong-fb');
  if (!text && !ruleText && !eksText) {
    box.innerHTML = '';
    return;
  }

  var icon = isCorrect === true ? '&#10003; ' : (isCorrect === false ? '&#10007; ' : '');
  var heading = isCorrect === true ? 'Rett svar!' : (isCorrect === false ? 'Feil' : 'Kommentar');
  text = nlAdCleanFeedbackText(text, isCorrect);

  // Build pedagogical encouragement based on result
  var pedagogy = nlAdPedagogicalMsg(text, isCorrect);

  var html = '<div class="fb-heading">' + icon + heading + '</div>';
  if (pedagogy) html += '<div class="fb-pedagogy">' + pedagogy + '</div>';
  if (text) html += '<div class="fb-msg">' + text + '</div>';

  // Show fasit (correct answer) on wrong answers so students can compare
  if (fasitText && isCorrect === false) {
    html += '<div class="adp-fb-fasit"><strong>&#9989; Fasit:</strong> ' + fasitText + '</div>';
  }

  // Always show regel when available — reinforces learning on both correct and wrong
  if (ruleText) {
    var clean = ruleText.replace(/^regel:\s*/i, '');
    if (clean) {
      html += '<div class="adp-fb-rule"><strong>&#128218; Regel:</strong> ' + clean + '</div>';
    }
  }
  // Always show eksempel when available
  if (eksText) {
    var cleanEks = eksText.replace(/^eks(?:empel)?:\s*/i, '');
    if (cleanEks) {
      html += '<div class="adp-fb-eks"><strong>&#128221; Eksempel:</strong> ' + cleanEks + '</div>';
    }
  }

  box.innerHTML = html;
  box.classList.add('show');
  box.classList.add(isCorrect === true ? 'correct-fb' : 'wrong-fb');
}

function nlAdPedagogicalMsg(scoreText, isCorrect) {
  if (isCorrect === null || isCorrect === undefined) return '';

  // Parse score like "3 av 5 rette" or "2 av 4 ord på rett plass"
  var m = String(scoreText).match(/^(\d+)\s+av\s+(\d+)/);
  var got = m ? parseInt(m[1], 10) : -1;
  var total = m ? parseInt(m[2], 10) : -1;
  var ratio = total > 0 ? got / total : -1;

  if (isCorrect === true) {
    if (total > 1 && ratio === 1) {
      return 'Alle rett — utmerket! Du har full kontroll.';
    }
    var correctMsgs = [
      'Flott jobba! Du viser god forståelse av mønsteret.',
      'Helt rett! Du har tydelig kontroll på dette temaet.',
      'Knallbra! Du kan dette — utfordre deg med neste nivå.',
      'Imponerende! Du mestrer dette godt.',
      'Topp! Stødig kunnskap — hold fram slik.'
    ];
    return correctMsgs[Math.floor(Math.random() * correctMsgs.length)];
  }

  // Wrong/partial answer — give substantive diagnosis
  if (ratio >= 0) {
    if (ratio >= 0.7) {
      return 'Nesten! Du har forstått hovedmønsteret — bare en liten detalj som mangler.';
    } else if (ratio >= 0.4) {
      return 'Du er på rett vei! Prøv å finne mønsteret som binder de riktige svarene sammen.';
    } else {
      return 'Ikke gi opp! Øv på å kjenne igjen hovedregelen i denne kategorien.';
    }
  }
  return 'Bruk tilbakemeldingen aktivt — det hjelper til neste gang!';
}

function nlAdSyncActionButtons() {
  var current = nlAdCurrentExercise();
  var checkBtn = document.getElementById('nl-ad-check');
  var nextBtn = document.getElementById('nl-ad-next');
  if (!current || !nextBtn) return;

  var isChecked = nlAdState.checked.has(current);

  // Always hide the separate check button — nextBtn handles everything
  if (checkBtn) checkBtn.style.display = 'none';

  nextBtn.disabled = false;
  if (isChecked) {
    // Already checked — button advances
    nextBtn.textContent = (nlAdState.idx + 1 < nlAdState.list.length) ? 'Neste oppgave →' : 'Fullfør økt →';
    nextBtn.classList.add('adp-btn-pri');
  } else {
    // Not yet checked — button acts as "Sjekk svar"
    nextBtn.textContent = 'Sjekk svar';
    nextBtn.classList.remove('adp-btn-pri');
  }
}

function nlAdTriggerCheck() {
  if (!nlAdState.active || !nlAdState.list.length) return;
  var current = nlAdCurrentExercise();
  if (!current) return;

  var checkBtn = current.querySelector('.btn-check');
  var rule = nlAdRuleFromExercise(current);
  var eks = nlAdEksFromExercise(current);
  var fasitText = nlAdFasitFromExercise(current);
  if (!checkBtn) {
    nlAdState.checked.add(current);
    nlAdSetFeedback('Svar registrert.', true, rule, eks, fasitText);
    nlAdStoreResult(current, 'Svar registrert.', true, rule);
    var noPts = nlAdExtractPoints('Svar registrert.', true);
    nlAdPlayCorrectEffects(current, noPts.earned);
    nlAdLockExercise(current);
    nlAdAutoRevealFasit(current);
    nlAdSyncActionButtons();
    nlAdUpdateStatus();
    return;
  }

  checkBtn.click();

  var scoreEl = null;
  if (checkBtn.dataset.score) scoreEl = document.getElementById(checkBtn.dataset.score);
  if (!scoreEl) scoreEl = current.querySelector('.ex-score');

  var msg = scoreEl ? (scoreEl.textContent || '').trim() : '';
  var correct = scoreEl ? scoreEl.classList.contains('ok') : false;
  // If score has neither 'ok' nor 'err', the user hasn't properly answered yet
  var hasResult = scoreEl ? (scoreEl.classList.contains('ok') || scoreEl.classList.contains('err')) : true;

  if (!hasResult) {
    // Show the prompt (e.g. "Vel ett alternativ") without marking as done
    if (msg) nlAdSetFeedback(msg, null, '');
    nlAdSyncActionButtons();
    return;
  }

  if (!msg) msg = 'Svar sjekket.';
  nlAdState.checked.add(current);
  nlAdStoreResult(current, msg, correct, rule);
  if (correct && nlAdState.isFeillogg && typeof window !== 'undefined' && typeof window.mtBadgesCountRetryWin === 'function') {
    try { window.mtBadgesCountRetryWin(); } catch (e) {}
  }
  // XP visual effects
  if (correct) {
    var efPts = nlAdExtractPoints(msg, correct);
    nlAdPlayCorrectEffects(current, efPts.earned);
  } else {
    nlAdPlayWrongEffects();
  }
  nlAdLockExercise(current);
  nlAdSetFeedback(msg, correct, rule, eks, fasitText);
  nlAdAutoRevealFasit(current);
  current.classList.add('nl-ad-done');
  nlAdSyncActionButtons();
  nlAdUpdateStatus();
}

function nlAdUpdateStatus() {
  var total = nlAdState.list.length;
  var idx = nlAdState.idx;

  var p = document.getElementById('nl-ad-progress');
  var scoreVal = document.getElementById('nl-ad-score-val');
  var f = document.getElementById('nl-ad-bar-fill');

  if (p) p.textContent = 'Oppgave ' + (idx + 1) + ' av ' + total;
  var pts = 0;
  nlAdState.results.forEach(function(r) { pts += r.points || 0; });
  if (scoreVal) scoreVal.textContent = String(pts);
  if (f) f.style.width = (total ? ((idx + 1) / total) * 100 : 0) + '%';
}

function nlAdGo(step) {
  if (!nlAdState.active || !nlAdState.list.length) return;
  var next = nlAdState.idx + step;
  if (next < 0 || next >= nlAdState.list.length) return;
  nlAdState.idx = next;
  nlAdOpenCurrent();
}

function nlAdNext() {
  if (!nlAdState.active || !nlAdState.list.length) return;

  var current = nlAdCurrentExercise();
  if (!current) return;
  var hasCheck = !!current.querySelector('.btn-check');
  var isChecked = nlAdState.checked.has(current);

  // If not yet checked: auto-check first so the user sees correction/feedback,
  // then stay on the exercise. The next click will advance.
  if (hasCheck && !isChecked) {
    nlAdTriggerCheck();
    return;
  }

  /* Save progress after each answered question */
  nlAdSaveProgress();

  if (nlAdState.idx + 1 >= nlAdState.list.length) {
    nlAdShowSummary();
    return;
  }

  nlAdGo(1);
}

function nlAdStart() {
  var winTitle = document.getElementById('nl-ad-win-title');
  if (winTitle) winTitle.textContent = 'Skrivemesteren - adaptive øvingsoppgaver';

  var si = document.getElementById('search-input');
  var activeChip = document.querySelector('.chip.active');

  nlAdState.prevSearch = si ? si.value : '';
  nlAdState.prevOp = activeChip ? (activeChip.dataset.op || 'alle') : 'alle';

  if (si) si.value = '';
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(ch) {
    ch.classList.remove('active');
  });
  var allChip = document.querySelector('.chip[data-op="alle"]');
  if (allChip) allChip.classList.add('active');
  nlFilter('', 'alle');

  var cats = nlAdSelectedCats();
  if (!cats.length) {
    alert('Vel minst én kategori før du startar økta.');
    return;
  }

  var levelEl = document.getElementById('nl-ad-level');
  var countEl = document.getElementById('nl-ad-count');
  var level = levelEl ? levelEl.value : 'adaptiv';
  var count = countEl ? parseInt(countEl.value, 10) : 8;

  if (!count || isNaN(count)) count = 8;
  if (count < 1) count = 1;
  if (count > 25) count = 25;
  if (countEl) countEl.value = String(count);

  var list = nlAdBuildList(cats, level, count);
  // Prefer at most 3 per category for variety, but fill back up to the
  // requested count so long sessions (e.g. 20 q from few categories) still work.
  list = nlAdDiversify(list, 3, count);
  if (!list.length) {
    alert('Ingen oppgaver passar vala dine. Prøv flere kategorier eller annet nivå.');
    return;
  }

  nlAdState.active = true;
  nlAdState.list = list;
  nlAdState.idx = 0;
  nlAdState.checked = new Set();
  nlAdState.results = new Map();
  nlAdState.cats = cats.slice();
  nlAdState.xpGain = 0;
  nlAdState.isFeillogg = false;
  nlAdStreak = 0;

  nlAdSetGlobalControls(false);

  // Hide the old card grid — only the adaptive dialog should be visible
  var mainEl = document.querySelector('.main');
  if (mainEl) mainEl.style.display = 'none';
  var adaptivePanel = document.getElementById('nl-adaptive');
  if (adaptivePanel) adaptivePanel.style.display = 'none';

  var win = document.getElementById('nl-ad-win');
  if (win) win.hidden = false;

  nlAdOpenCurrent();

  var run = document.getElementById('nl-ad-run');
  var reset = document.getElementById('nl-ad-reset');
  var actions = document.getElementById('nl-ad-actions');
  var summary = document.getElementById('nl-ad-summary');
  if (run) run.hidden = false;
  if (reset) reset.hidden = false;
  if (summary) summary.hidden = true;
  if (actions) actions.style.display = 'flex';
  var headerClose = document.getElementById('nl-ad-win-close');
  if (headerClose) headerClose.style.display = '';
}

function nlAdReset() {
  var prevSearch = nlAdState.prevSearch || '';
  var prevOp = nlAdState.prevOp || 'alle';

  nlAdState.active = false;
  nlAdState.list = [];
  nlAdState.idx = 0;
  nlAdState.checked = new Set();
  nlAdState.results = new Map();
  nlAdState.cats = [];
  nlAdState.prevSearch = '';
  nlAdState.prevOp = 'alle';
  nlAdState.isFeillogg = false;

  nlAdRestoreMountedExercise();

  Array.prototype.forEach.call(document.querySelectorAll('.main .ei'), function(ei) {
    ei.classList.remove('nl-ad-hidden', 'nl-ad-current', 'nl-ad-done');
  });
  Array.prototype.forEach.call(document.querySelectorAll('.main .card'), function(card) {
    card.classList.remove('nl-ad-hidden-card');
  });
  Array.prototype.forEach.call(document.querySelectorAll('.main .grp'), function(grp) {
    grp.style.display = '';
  });

  var run = document.getElementById('nl-ad-run');
  var reset = document.getElementById('nl-ad-reset');
  var win = document.getElementById('nl-ad-win');
  var actions = document.getElementById('nl-ad-actions');
  var summary = document.getElementById('nl-ad-summary');
  if (run) run.hidden = true;
  if (reset) reset.hidden = true;
  if (win) win.hidden = true;
  if (summary) summary.hidden = true;
  if (actions) actions.style.display = 'none';

  // Restore the card grid and adaptive config panel
  var mainEl = document.querySelector('.main');
  if (mainEl) mainEl.style.display = '';
  var adaptivePanel = document.getElementById('nl-adaptive');
  if (adaptivePanel) adaptivePanel.style.display = '';

  nlAdSetFeedback('', null, '');

  nlAdSetGlobalControls(true);

  var si = document.getElementById('search-input');
  if (si) si.value = prevSearch;

  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function(ch) {
    ch.classList.toggle('active', ch.dataset.op === prevOp);
  });

  if (!document.querySelector('.chip.active')) {
    var allChip = document.querySelector('.chip[data-op="alle"]');
    if (allChip) allChip.classList.add('active');
    prevOp = 'alle';
  }

  nlFilter(prevSearch, prevOp);
}

})();
