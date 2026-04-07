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

  nlSafeInit('normalize-categories', nlNormalizeCategories);
  nlSafeInit('import-mt-bank', nlImportMTBankTasks);

  /* ── Card open/close + exercise modal (delegated for robustness) ── */
  document.addEventListener('click', function(e) {
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
    nlSafeInit('open-bank-exercise', function() { nlBankOpenExercise(ei); });
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
    if (t === 'drag-ord') nlCheckDragOrd(tgt, sid);
    if (t === 'write') nlCheckWrite(tgt, sid);
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
    if (t === 'drag-ord') nlResetDragOrd(tgt, sid);
  });

  /* ── Drag-ord click handling ── */
  document.addEventListener('click', function(e) {
    var tok = e.target.closest('.drag-ord-token');
    if (tok) {
      nlDragOrdMoveToAnswer(tok);
      return;
    }
    var picked = e.target.closest('.drag-ord-picked');
    if (picked) nlDragOrdMoveToBank(picked);
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

    // Bank modal + MC: auto-check immediately
    if (nlBankModalState && nlBankModalState.open && !nlBankModalState.checked) {
      var bankEi = nlBankModalState.mountedEi;
      if (bankEi && bankEi.contains(area)) {
        var bankCheckEl = bankEi.querySelector('.btn-check');
        if (bankCheckEl && bankCheckEl.dataset.check === 'mc') {
          setTimeout(function() { nlBankTriggerCheck(); }, 60);
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
  nlSafeInit('init-adaptive', nlInitAdaptive);

  // Safety net: if adaptive categories are still empty, rebuild once.
  nlSafeInit('adaptive-cats-fallback', function() {
    var catsWrap = document.getElementById('nl-ad-cats');
    if (!catsWrap) return;
    if (catsWrap.querySelector('.adp-cat')) return;
    nlInitAdaptive();
  });

  if (typeof window !== 'undefined') {
    window.__nlSkrivelabBootDone = true;
  }

} // end nlBoot

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', nlBoot);
} else {
  nlBoot();
}

window.addEventListener('pageshow', function() {
  try { nlResetExerciseVisibilityState(); } catch (err) {}
  try {
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
  if (v === 'middels') return '<span class="b dm">Middels</span>';
  return '<span class="b da">Viderekommende</span>';
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
    rangere: { cls: 'or', label: 'Rangere' },
    sortering: { cls: 'or', label: 'Rangere' }
  };
  if (explicit[raw]) return explicit[raw];

  var type = String(task && task.type || '').toLowerCase();
  if (type === 'finn_feil') return { cls: 'ok', label: 'Korrigere' };
  if (type === 'cloze') return { cls: 'of', label: 'Fylloppgave' };
  if (type === 'klikk_marker' || type === 'mc') return { cls: 'oi', label: 'Identifisere' };
  if (type === 'drag_ord') return { cls: 'ob', label: 'Bygge' };
  if (type === 'drag_kolonne' || type === 'burger_sort' || type === 'avsnitt_klikk') return { cls: 'or', label: 'Rangere' };
  if (type === 'open') return { cls: 'oo', label: 'Omskrive' };
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
    ordklasse: 'ordklasse',
    ordklassar: 'ordklasse',
    setningsbygging: 'setningsbygging',
    tekststruktur: 'tekststruktur-delar',
    bindeord: 'bindeord-overganger',
    kjeldebruk: 'kjeldebruk',
    kildebruk: 'kjeldebruk',
    oppgavetolking: 'oppgaveforstaing',
    spraak_stil: 'spraak-stil'
  };
  return map[kat] || '';
}

function nlMtBuildExercise(task, i, localIx) {
  var type = String(task && task.type || '').toLowerCase();
  var promptRaw = nlMtPickPrompt(task);
  var titleText = nlMtCleanPromptForTitle(promptRaw);
  var q = nlMtEscHtml(titleText);
  var fasit = nlMtEscHtml(nlMtFasitText(task && task.fasit));
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
    var cols = Array.isArray(task && task.kolonner) ? task.kolonner.map(function(c) { return String(c); }).filter(function(c) { return !!c.trim(); }) : [];
    if (cols.length < 2) cols = ['Kolonne 1', 'Kolonne 2'];

    var bucketDefs = cols.map(function(c, ci) {
      return { id: 'k' + ci, label: c };
    });

    var rawItems = Array.isArray(task && task.ord) ? task.ord : [];
    if (!rawItems.length) return '';

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
        key = txt + ' [' + seenText[txt] + ']';
      } else {
        seenText[key] = 1;
      }

      words.push(key);

      var idx = Number(typeof item === 'string' ? 0 : item.fasit);
      if (!Number.isFinite(idx) || idx < 0 || idx >= bucketDefs.length) idx = 0;
      answers[key] = bucketDefs[idx].id;
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
      ? 'Klikk på feilen.'
      : 'Klikk på de rette ordene.';

    return '<article class="ei">' + header +
      '<div class="ec">' +
      promptBoxHtml +
      '<div class="inst">' + inst + '</div>' +
      guideHtml +
      '<div id="' + markId + '" class="mark-area" data-score="' + scoreMarkId + '" data-answers="' + nlMtEscHtml(JSON.stringify(answers)) + '">' + markItems + '</div>' +
      '<div class="ex-controls"><button class="btn-check" data-check="mark" data-target="' + markId + '" data-score="' + scoreMarkId + '">Sjekk svar</button><button class="btn-reset" data-reset="mark" data-target="' + markId + '" data-score="' + scoreMarkId + '">Start på nytt</button><span id="' + scoreMarkId + '" class="ex-score"></span></div>' +
      '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
      '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
      '</div></article>';
  }

  // Generic fallback: show the task with guidance/fasit instead of dropping unsupported MT types.
  var fallbackId = 'write-' + uniq;
  return '<article class="ei">' + header +
    '<div class="ec">' +
    promptBoxHtml +
    '<div class="inst">Denne oppgåvetypen er delvis importert. Svar i feltet under og bruk rettleiinga.</div>' +
    '<div class="subinst"><strong>Type:</strong> ' + nlMtEscHtml(type || 'ukjent') + '</div>' +
    guideHtml +
    '<textarea id="' + fallbackId + '" class="write-area" rows="4" placeholder="Skriv svaret ditt her..."></textarea>' +
    '<button class="btn-fasit" data-fasit="fb-' + uniq + '">' + revealLabel + '</button>' +
    '<div class="fasit-box" id="fb-' + uniq + '"><div class="fb"><div class="fl">' + revealTitle + '</div><p class="fb-ans">' + revealBody + '</p>' + metaHtml + '</div></div>' +
    '</div></article>';
}

function nlImportMTBankTasks() {
  if (document.body.dataset.nlMtImported === '1') return;
  var bank = null;
  if (typeof MT_BANK !== 'undefined' && Array.isArray(MT_BANK)) bank = MT_BANK;
  else if (typeof window !== 'undefined' && Array.isArray(window.MT_BANK)) bank = window.MT_BANK;
  else if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.MT_BANK)) bank = globalThis.MT_BANK;
  if (!bank || !bank.length) return;

  var maxPerCategory = 18;
  var counters = {};
  var imported = 0;
  var stableBank = bank.slice().sort(function(a, b) {
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

  stableBank.forEach(function(task, i) {
    var cat = nlMtResolveCard(task && task.kat);
    if (!cat) return;

    counters[cat] = counters[cat] || 0;
    if (counters[cat] >= maxPerCategory) return;

    var exlist = document.querySelector('.card[data-cat="' + cat + '"] .exlist');
    if (!exlist) return;

    var html = nlMtBuildExercise(task, i, counters[cat] + 1);
    if (!html) return;

    exlist.insertAdjacentHTML('beforeend', html);
    counters[cat]++;
    imported++;
  });

  document.body.dataset.nlMtImported = '1';
  if (imported > 0 && window.console && console.info) {
    console.info('[Skrivelab] Importerte', imported, 'oppgaver fra MT_BANK.');
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

/* ── DRAG-ORD (V1 import, click-to-build) ── */
function nlInitDragOrd() {
  document.querySelectorAll('.drag-ord-area').forEach(function(area) {
    var bank = area.querySelector('.drag-ord-bank');
    if (!bank) return;
    bank.querySelectorAll('button').forEach(function(btn, i) {
      if (!btn.dataset.order) btn.dataset.order = String(i);
      btn.classList.add('drag-ord-token');
      btn.classList.remove('drag-ord-picked');
      btn.type = 'button';
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

  Object.keys(errors || {}).forEach(function(wrong) {
    var rights = nlFixCorrects(errors[wrong]);
    rights.forEach(function(right) {
      var rxRight = new RegExp(nlEscRe(right), 'gi');
      html = html.replace(rxRight, '<span class="fix-mark-ok">$&</span>');
    });
  });

  Object.keys(errors || {}).forEach(function(wrong) {
    var w = String(wrong || '').trim();
    if (!w) return;
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
    nlSetScore(sid, found + ' av ' + total + ' retta', found === total ? 'ok' : 'err');
  }
}

function nlResetFix(tid, sid) {
  var el = document.getElementById(tid);
  if (el) {
    el.innerText = el.dataset.original || '';
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
  if (words < 8) {
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

  if (!keyTerms.length) {
    if (words >= 25) nlSetScore(sid, 'Svar registrert. God lengd - bruk fasit for eigenkontroll.', 'ok');
    else nlSetScore(sid, 'Svar registrert. Bygg gjerne ut svaret litt før du samanliknar med fasit.');
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
      if (_td.target && _td.target.matches('.sort-bucket-drop, .burger-bucket-drop')) {
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
    if (opNeedles[0] === 'rangere') opNeedles.push('sortering');
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

function nlRefreshCounts() {
  var cards = document.querySelectorAll('.card').length;
  var oppg = document.querySelectorAll('.ei').length;
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

/* ── BANK EXERCISE MODAL ── */
var nlBankModalState = {
  open: false,
  mountedEi: null,
  mountParent: null,
  mountNext: null,
  list: [],
  idx: -1,
  checked: false
};

function nlInitBankModal() {
  var win = document.getElementById('nl-bank-win');
  if (!win || win.dataset.bound === '1') return;
  win.dataset.bound = '1';

  var closeBtn = document.getElementById('nl-bank-win-close');
  var bg = document.getElementById('nl-bank-win-bg');
  var prevBtn = document.getElementById('nl-bank-prev');
  var nextBtn = document.getElementById('nl-bank-next');

  if (closeBtn) closeBtn.addEventListener('click', nlBankCloseModal);
  if (bg) bg.addEventListener('click', nlBankCloseModal);
  var checkBankBtn = document.getElementById('nl-bank-check');
  if (prevBtn) prevBtn.addEventListener('click', function() { nlBankGo(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { nlBankGo(1); });
  if (checkBankBtn) checkBankBtn.addEventListener('click', nlBankTriggerCheck);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nlBankModalState.open) {
      nlBankCloseModal();
    }
  });
}

function nlBankRestoreExercise() {
  if (!nlBankModalState.mountedEi || !nlBankModalState.mountParent) return;

  nlAdRestoreExerciseControls(nlBankModalState.mountedEi);

  if (nlBankModalState.mountNext && nlBankModalState.mountNext.parentNode === nlBankModalState.mountParent) {
    nlBankModalState.mountParent.insertBefore(nlBankModalState.mountedEi, nlBankModalState.mountNext);
  } else {
    nlBankModalState.mountParent.appendChild(nlBankModalState.mountedEi);
  }

  nlBankModalState.mountedEi.classList.remove('nl-bank-modal-open');
  nlBankModalState.mountedEi.classList.remove('open');
  nlBankModalState.mountedEi = null;
  nlBankModalState.mountParent = null;
  nlBankModalState.mountNext = null;
}

function nlBankUpdateNav() {
  var prevBtn = document.getElementById('nl-bank-prev');
  var nextBtn = document.getElementById('nl-bank-next');
  var pos = document.getElementById('nl-bank-pos');

  var total = nlBankModalState.list.length;
  var idx = nlBankModalState.idx;

  if (prevBtn) prevBtn.disabled = !(total > 1 && idx > 0);
  if (nextBtn) nextBtn.disabled = !(total > 1 && idx >= 0 && idx < total - 1);
  if (pos) pos.textContent = (idx >= 0 ? (idx + 1) : 0) + ' av ' + total;
}

function nlBankSyncButtons() {
  var checkBtn = document.getElementById('nl-bank-check');
  var nextBtn = document.getElementById('nl-bank-next');
  var prevBtn = document.getElementById('nl-bank-prev');
  if (!checkBtn || !nextBtn) return;

  var ei = nlBankModalState.mountedEi;
  var hasCheck = ei && !!ei.querySelector('.btn-check');
  var isChecked = nlBankModalState.checked;

  if (!hasCheck || isChecked) {
    checkBtn.style.display = 'none';
    nextBtn.style.display = '';
    if (prevBtn) prevBtn.style.display = '';
  } else {
    checkBtn.style.display = '';
    nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
  }
  nlBankUpdateNav();
}

function nlBankTriggerCheck() {
  var ei = nlBankModalState.mountedEi;
  if (!ei) return;

  var checkBtn = ei.querySelector('.btn-check');
  if (!checkBtn) { nlBankModalState.checked = true; nlBankSyncButtons(); return; }

  checkBtn.click();

  var scoreEl = null;
  if (checkBtn.dataset.score) scoreEl = document.getElementById(checkBtn.dataset.score);
  if (!scoreEl) scoreEl = ei.querySelector('.ex-score');

  var hasResult = scoreEl ? (scoreEl.classList.contains('ok') || scoreEl.classList.contains('err')) : true;
  if (!hasResult) return;  // User hasn't answered yet

  nlBankModalState.checked = true;
  nlAdAutoRevealFasit(ei);
  nlBankSyncButtons();
}

function nlBankGo(step) {
  var total = nlBankModalState.list.length;
  if (!total) return;

  var next = nlBankModalState.idx + step;
  if (next < 0 || next >= total) return;

  var target = nlBankModalState.list[next];
  if (!target) return;

  nlBankOpenExercise(target, nlBankModalState.list, next);
}

function nlBankOpenExercise(ei, list, idx) {
  var win = document.getElementById('nl-bank-win');
  var body = document.getElementById('nl-bank-win-body');
  var title = document.getElementById('nl-bank-win-title');
  if (!win || !body || !ei) return;

  var card = ei.closest('.card');
  var cardList = card ? Array.prototype.slice.call(card.querySelectorAll('.exlist > .ei')) : [ei];
  var useList = list && list.length ? list : cardList;
  var useIdx = (typeof idx === 'number') ? idx : useList.indexOf(ei);
  if (useIdx < 0) useIdx = 0;

  nlInitBankModal();
  nlBankRestoreExercise();

  nlBankModalState.list = useList;
  nlBankModalState.idx = useIdx;

  nlBankModalState.mountedEi = ei;
  nlBankModalState.mountParent = ei.parentNode;
  nlBankModalState.mountNext = ei.nextSibling;

  ei.classList.add('nl-bank-modal-open');
  ei.classList.add('open');
  body.appendChild(ei);

  nlAdHideExerciseControls(ei);

  var et = ei.querySelector('.etit');
  if (title) title.textContent = et ? et.textContent.trim() : 'Oppgave';

  win.hidden = false;
  nlBankModalState.open = true;
  nlBankModalState.checked = false;
  nlBankSyncButtons();
}

function nlBankCloseModal() {
  var win = document.getElementById('nl-bank-win');
  if (win) win.hidden = true;
  nlBankRestoreExercise();
  nlBankModalState.open = false;
  nlBankModalState.list = [];
  nlBankModalState.idx = -1;
  nlBankModalState.checked = false;
  nlBankUpdateNav();
}

/* ── ADAPTIVE PRACTICE ── */
var nlAdState = {
  active: false,
  list: [],
  idx: 0,
  checked: new Set(),
  results: new Map(),
  cats: [],
  prevSearch: '',
  prevOp: 'alle',
  hintSource: null,
  mountedEi: null,
  mountParent: null,
  mountNext: null
};

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

    var groupTitleEl = grp.querySelector('.glabel h2');
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
  if (resetBtn) resetBtn.addEventListener('click', nlAdReset);
  if (catsClearBtn) catsClearBtn.addEventListener('click', function() { nlAdSetAllCats(false); });
  if (catsAllBtn) catsAllBtn.addEventListener('click', function() { nlAdSetAllCats(true); });
  if (checkBtn) checkBtn.addEventListener('click', nlAdTriggerCheck);
  if (nextBtn) nextBtn.addEventListener('click', nlAdNext);
  if (winCloseBtn) winCloseBtn.addEventListener('click', nlAdReset);
  if (winBg) winBg.addEventListener('click', nlAdReset);
  if (sumNewBtn) sumNewBtn.addEventListener('click', nlAdStart);
  if (sumCloseBtn) sumCloseBtn.addEventListener('click', nlAdReset);
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
  var all = [];
  cats.forEach(function(cat) {
    Array.prototype.forEach.call(document.querySelectorAll('.main .card[data-cat="' + cat + '"] .ei'), function(ei) {
      if (nlAdIsAdaptiveEligible(ei)) {
        // Cache contextual info before the exercise is detached from its DOM
        var card = ei.closest('.card');
        var cnEl = card ? card.querySelector('.cn') : null;
        ei.dataset.adCat = cnEl ? cnEl.textContent.trim() : '';
        var grp = ei.closest('.grp');
        var grpH2 = grp ? grp.querySelector('.glabel h2') : null;
        ei.dataset.adGrp = grpH2 ? grpH2.textContent.trim() : '';
        all.push(ei);
      }
    });
  });

  if (!all.length) return [];

  if (level !== 'adaptiv') {
    var filtered = all.filter(function(ei) {
      var d = nlAdDifficulty(ei);
      return d === level;
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
  // MT_BANK tasks store rules/examples in .fasit-box .fr elements
  var frEls = ei.querySelectorAll('.fasit-box .fr');
  for (var i = 0; i < frEls.length; i++) {
    var txt = (frEls[i].textContent || '').trim();
    if (/^regel:/i.test(txt)) return txt;
  }

  var note = ei.querySelector('.fasit-box .note');
  if (note) return note.textContent.trim();

  var paragraphs = ei.querySelectorAll('.fasit-box .fb p');
  for (var i = 0; i < paragraphs.length; i++) {
    var txt = (paragraphs[i].textContent || '').trim();
    if (txt.toLowerCase().indexOf('regel:') === 0) return txt;
  }
  return '';
}

function nlAdEksFromExercise(ei) {
  if (!ei) return '';
  var frEls = ei.querySelectorAll('.fasit-box .fr');
  for (var i = 0; i < frEls.length; i++) {
    var txt = (frEls[i].textContent || '').trim();
    if (/^eksempel:/i.test(txt)) return txt.replace(/^eksempel:\s*/i, '');
  }
  return '';
}

function nlAdTitleFromExercise(ei) {
  if (!ei) return 'Oppgave';
  var title = ei.querySelector('.etit');
  if (!title) title = ei.querySelector('h4, h3, h2');
  var text = title ? title.textContent.trim() : 'Oppgave';
  // Strip pedagogical type prefixes like "Holoppgåve: ", "Metatekst-støvsugaren: "
  var m = text.match(/^[A-ZÆØÅ][^:]{3,35}:\s+(.+)$/);
  if (m && m[1].length >= 5) text = m[1];
  return text || 'Oppgave';
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
    comment: 'Du viser sterk meistring av stoffet. Hald fram slik, og utfordre deg selv med vanskeligere oppgaver neste gang!'
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

function nlAdShowSummary() {
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
  var retteEl = document.getElementById('nl-ad-sum-rette');
  var feilEl = document.getElementById('nl-ad-sum-feil');
  if (poengEl) poengEl.textContent = totalPoints + '/' + totalMax;
  if (retteEl) retteEl.textContent = String(totalCorrect);
  if (feilEl) feilEl.textContent = String(totalWrong);

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

    if (!strong.length) {
      strengthsEl.innerHTML = '';
      strengthsEl.style.display = 'none';
    } else {
      var strongHtml = '<h5>Dette fekk jeg til</h5>';
      strong.forEach(function(row) {
        strongHtml += '<div class="adp-summary-row ok"><strong>' + row.cat + '</strong><span>' + row.pct + '% treff</span></div>';
      });
      strengthsEl.innerHTML = strongHtml;
      strengthsEl.style.display = '';
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

  var p = document.getElementById('nl-ad-progress');
  var scoreVal = document.getElementById('nl-ad-score-val');
  var f = document.getElementById('nl-ad-bar-fill');
  if (p) p.textContent = 'Økt fullført';
  if (scoreVal) scoreVal.textContent = String(totalPoints);
  if (f) f.style.width = '100%';

  // Scroll summary into view
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nlAdSetFeedback(text, isCorrect, ruleText, eksText) {
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
  var pedagogy = nlAdPedagogicalMsg(text, isCorrect, ruleText);

  var html = '<div class="fb-heading">' + icon + heading + '</div>';
  if (pedagogy) html += '<div class="fb-pedagogy">' + pedagogy + '</div>';
  if (text) html += '<div class="fb-msg">' + text + '</div>';
  if (ruleText && isCorrect !== true) {
    var clean = ruleText.replace(/^regel:\s*/i, '');
    html += '<div class="adp-fb-rule"><strong>&#128218; Regel</strong>' + clean + '</div>';
  }
  if (eksText && isCorrect !== true) {
    var cleanEks = eksText.replace(/^eks(?:empel)?:\s*/i, '');
    html += '<div class="adp-fb-eks"><strong>&#128221; Eksempel:</strong> ' + cleanEks + '</div>';
  }

  box.innerHTML = html;
  box.classList.add('show');
  box.classList.add(isCorrect === true ? 'correct-fb' : 'wrong-fb');
}

function nlAdPedagogicalMsg(scoreText, isCorrect, ruleText) {
  if (isCorrect === null || isCorrect === undefined) return '';
  var hasRule = !!(ruleText && ruleText.replace(/^regel:\s*/i, '').trim());

  // Parse score like "3 av 5 rette" or "2 av 4 ord på rett plass"
  var m = String(scoreText).match(/^(\d+)\s+av\s+(\d+)/);
  var got = m ? parseInt(m[1], 10) : -1;
  var total = m ? parseInt(m[2], 10) : -1;
  var ratio = total > 0 ? got / total : -1;

  if (isCorrect === true) {
    // Correct answer — pick encouraging message
    var correctMsgs = [
      'Flott jobba! Du viser god forståing.',
      'Helt rett! Du har god kontroll på dette.',
      'Knallbra! Hald fram slik.',
      'Imponerande! Du meistrar dette godt.',
      'Topp! Du er godt på veg.'
    ];
    if (total > 1 && ratio === 1) {
      return 'Alle rett — utmerkt! Du har full kontroll.';
    }
    return correctMsgs[Math.floor(Math.random() * correctMsgs.length)];
  }

  // Wrong/partial answer
  if (ratio >= 0) {
    if (ratio >= 0.7) {
      return 'Nesten! Du har forstått det meste — se nøye på hva som mangler.';
    } else if (ratio >= 0.4) {
      return hasRule
        ? 'Du er på rett veg! Les regelen under for å forstå hvorfor.'
        : 'Du er på rett veg! Samanlikn svaret ditt med fasiten for å forstå hvorfor.';
    } else {
      return hasRule
        ? 'Ikke gi opp — studer regelen under og prøv liknande oppgaver.'
        : 'Ikke gi opp — samanlikn svaret ditt med fasiten og prøv på nytt.';
    }
  }
  return 'Sjå tilbakemeldinga — det hjelper til neste gang!';
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
  if (!checkBtn) {
    nlAdState.checked.add(current);
    nlAdSetFeedback('Svar registrert.', true, rule, eks);
    nlAdStoreResult(current, 'Svar registrert.', true, rule);
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
  nlAdLockExercise(current);
  nlAdSetFeedback(msg, correct, rule, eks);
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

  if (nlAdState.idx + 1 >= nlAdState.list.length) {
    nlAdShowSummary();
    return;
  }

  nlAdGo(1);
}

function nlAdStart() {
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

  nlAdSetGlobalControls(false);

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
