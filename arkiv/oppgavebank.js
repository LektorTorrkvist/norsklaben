/* ══════════════════════════════════════════════════════
   OPPGÅVEBANK – nynorsk – v2
══════════════════════════════════════════════════════ */

const MT_BANK = [
  /* Oppgåver vert lagde til her */
]; // end MT_BANK

if (typeof window !== 'undefined') window.MT_BANK = MT_BANK;
if (typeof globalThis !== 'undefined') globalThis.MT_BANK = MT_BANK;

/* ══════════════════════════════════════════════════════
   MENGDETRENING – state & logikk
══════════════════════════════════════════════════════ */
const MTS = {
  tasks: [], idx: 0, score: 0, answered: false,
  streak: 0, history: [], level: 'lett'
};

/* ── Hjelparar ── */
function mtShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function mtShuffleBank() {
  for (let i = MT_BANK.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [MT_BANK[i], MT_BANK[j]] = [MT_BANK[j], MT_BANK[i]];
  }
}
function $mt(id) { return document.getElementById(id); }
function mtEsc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}

/* ── Kategori-veljar ── */
function mtToggleKat(el) {
  const sel = el.dataset.sel === '1';
  if (sel) {
    el.dataset.sel = '0';
    el.style.background = '#f3f0ea'; el.style.borderColor = '#e5e2db';
    el.style.color = '#4a4a46'; el.style.fontWeight = '400';
  } else {
    el.dataset.sel = '1';
    el.style.background = '#fff3e0'; el.style.borderColor = '#e5822a';
    el.style.color = '#7a3800'; el.style.fontWeight = '600';
  }
}
function mtVelAlle() {
  document.querySelectorAll('.mt-kat-btn').forEach(function (el) {
    el.dataset.sel = '1';
    el.style.background = '#fff3e0'; el.style.borderColor = '#e5822a';
    el.style.color = '#7a3800'; el.style.fontWeight = '600';
  });
  mtUpdateAntalMeta();
}
function mtFjernAlle() {
  document.querySelectorAll('.mt-kat-btn').forEach(function (el) {
    el.dataset.sel = '0';
    el.style.background = '#f3f0ea'; el.style.borderColor = '#e5e2db';
    el.style.color = '#4a4a46'; el.style.fontWeight = '400';
  });
  mtUpdateAntalMeta();
}

function mtGetTilgjengelegeOppgaver() {
  var valgte = [].slice.call(document.querySelectorAll('.mt-kat-btn[data-sel="1"]')).map(function (b) { return b.dataset.kat; });
  if (!valgte.length) return 0;
  var vanskeEl = $mt('mt-vanske');
  var vanske = vanskeEl ? vanskeEl.value : 'adaptiv';
  var pool = MT_BANK.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
  if (vanske !== 'adaptiv') pool = pool.filter(function (t) { return t.vanske === vanske; });
  return pool.length;
}

function mtUpdateAntalMeta() {
  var inp = $mt('mt-antal');
  var hint = $mt('mt-antal-hint');
  if (!inp) return;
  var tilgjengeleg = mtGetTilgjengelegeOppgaver();
  var maks = Math.min(25, tilgjengeleg || 25);
  inp.max = String(maks);
  var val = parseInt(inp.value, 10);
  if (Number.isFinite(val) && val > maks) inp.value = String(maks);
  if (hint) {
    if (tilgjengeleg === 0) {
      hint.textContent = 'Vel minst \u00E9in kategori for \u00E5 sj\u00E5 kor mange oppg\u00E5ver som er tilgjengelege.';
    } else {
      hint.textContent = 'Tilgjengelege med vala dine: ' + tilgjengeleg + '. Du kan starte med opptil ' + maks + '.';
    }
  }
}

function mtInitKategoriVeljar() {
  var root = document.getElementById('mengdetrening');
  if (!root || root.dataset.mtKategoriInit === '1') return;
  root.dataset.mtKategoriInit = '1';
  root.querySelectorAll('.mt-kat-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { mtToggleKat(btn); mtUpdateAntalMeta(); });
  });
  var velAlleBtn = root.querySelector('[data-mt-action="vel-alle"]');
  var fjernAlleBtn = root.querySelector('[data-mt-action="fjern-alle"]');
  if (velAlleBtn) velAlleBtn.addEventListener('click', mtVelAlle);
  if (fjernAlleBtn) fjernAlleBtn.addEventListener('click', mtFjernAlle);
  var vanskeEl = $mt('mt-vanske');
  if (vanskeEl) vanskeEl.addEventListener('change', mtUpdateAntalMeta);
  var antalEl = $mt('mt-antal');
  if (antalEl) antalEl.addEventListener('input', mtUpdateAntalMeta);
  mtUpdateAntalMeta();
}

/* ── Init ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { mtShuffleBank(); mtInitKategoriVeljar(); });
} else {
  mtShuffleBank(); mtInitKategoriVeljar();
}
window.mtToggleKat = mtToggleKat;
window.mtVelAlle = mtVelAlle;
window.mtFjernAlle = mtFjernAlle;

/* ══════════════════════════════════════════════════════
   SESJON – start / stopp / framgang
══════════════════════════════════════════════════════ */
function mtStart() {
  mtShuffleBank();
  var valgte = [].slice.call(document.querySelectorAll('.mt-kat-btn[data-sel="1"]')).map(function (b) { return b.dataset.kat; });
  if (!valgte.length) { alert('Vel minst \u00E9in kategori for \u00E5 starte.'); return; }
  var vanske = $mt('mt-vanske').value;
  var onskja = parseInt($mt('mt-antal').value, 10);
  var grunnTal = Number.isFinite(onskja) ? onskja : 8;

  var pool = MT_BANK.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
  if (vanske !== 'adaptiv') pool = pool.filter(function (t) { return t.vanske === vanske; });
  var maksTillate = Math.min(25, pool.length);
  var antal = Math.min(maksTillate, Math.max(3, grunnTal));

  if (pool.length && grunnTal > maksTillate) {
    alert('Du bad om ' + grunnTal + ' oppg\u00E5ver, men med desse vala er maks ' + maksTillate + '. Startar med ' + maksTillate + '.');
  }

  pool = mtShuffle(pool).slice(0, antal);
  if (vanske === 'adaptiv') {
    var lett = mtShuffle(pool.filter(function (t) { return t.vanske === 'lett'; }));
    var medium = mtShuffle(pool.filter(function (t) { return t.vanske === 'medium'; }));
    var vanskeleg = mtShuffle(pool.filter(function (t) { return t.vanske === 'vanskeleg'; }));
    pool = [].concat(lett, medium, vanskeleg);
  }

  if (!pool.length) { alert('Ingen oppg\u00E5ver passar desse vala. Pr\u00F8v ein annan kombinasjon.'); return; }

  MTS.tasks = pool; MTS.idx = 0; MTS.score = 0; MTS.answered = false;
  MTS.streak = 0; MTS.history = []; MTS.level = 'lett';
  $mt('mt-start-btn').disabled = true;
  var rb = $mt('mt-reset-btn'); if (rb) rb.style.display = 'inline-flex';
  $mt('mt-quiz-area').style.display = 'block';
  $mt('mt-summary').style.display = 'none';
  $mt('mt-task-wrap').innerHTML = '';
  mtUpdateProgress();
  mtRenderTask();
}

function mtTilbakestill() {
  MTS.tasks = []; MTS.idx = 0; MTS.score = 0; MTS.answered = false;
  $mt('mt-start-btn').disabled = false;
  var rb = $mt('mt-reset-btn'); if (rb) rb.style.display = 'none';
  $mt('mt-quiz-area').style.display = 'none';
  $mt('mt-summary').style.display = 'none';
  $mt('mt-task-wrap').innerHTML = '';
}

function mtReset() {
  $mt('mt-start-btn').disabled = false;
  var rb = $mt('mt-reset-btn'); if (rb) rb.style.display = 'none';
  $mt('mt-quiz-area').style.display = 'none';
  $mt('mt-summary').style.display = 'none';
  $mt('mt-task-wrap').innerHTML = '';
}

function mtUpdateProgress() {
  var total = MTS.tasks.length;
  var pct = total > 0 ? Math.round((MTS.idx / total) * 100) : 0;
  var fill = $mt('mt-progress-fill');
  var lbl = $mt('mt-progress-label');
  if (fill) fill.style.width = pct + '%';
  if (lbl) lbl.textContent = MTS.idx + ' / ' + total;
  var badge = $mt('mt-score-badge');
  if (badge) badge.textContent = 'Poeng: ' + MTS.score;
}

/* ══════════════════════════════════════════════════════
   RENDER – bygg HTML for kvar oppg\u00E5vetype
══════════════════════════════════════════════════════ */
function mtRenderTask() {
  MTS.answered = false;
  var t = MTS.tasks[MTS.idx];
  if (!t) { mtShowSummary(); return; }

  var vCls = { lett: 'background:#e8f2f8;color:#1a567a', medium: 'background:#fffbe8;color:#6b4a00', vanskeleg: 'background:#fff0ed;color:#8b2a0a' }[t.vanske] || '';
  var vLbl = { lett: 'Lett', medium: 'Medium', vanskeleg: 'Vanskeleg' }[t.vanske] || '';

  var hintHTML = t.hint
    ? '<div style="background:#fffbe8;border:1px solid #f5d878;border-radius:8px;padding:0.55rem 1rem;margin-top:0.7rem;font-size:13px;color:#6b4a00">\uD83D\uDCA1 Hint: ' + mtEsc(t.hint) + '</div>'
    : '';

  /* Vis lese-tekst viss oppg\u00E5va har t.tekst og ikkje er type som rendrar tekst sjølv */
  var tekstHTML = '';
  if (t.tekst && t.type !== 'finn_feil' && t.type !== 'klikk_marker' && t.type !== 'fix' && t.type !== 'avsnitt_klikk') {
    tekstHTML = '<div style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;margin-top:0.7rem;font-family:\'Fraunces\',serif;font-size:14px;line-height:1.8;color:#1a1a18">' + mtEsc(t.tekst) + '</div>';
  }

  var inputHTML = '';

  /* ── mc ── */
  if (t.type === 'mc') {
    var alts = mtShuffle(t.alt);
    inputHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:0.8rem">';
    alts.forEach(function (a) {
      inputHTML += '<button class="mt-alt-btn" data-val="' + mtEsc(a) + '" onclick="mtChoose(this)" style="background:#f8f7f4;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'DM Sans\',sans-serif;font-size:14px;padding:8px 16px;cursor:pointer;transition:background 0.12s,border-color 0.12s;text-align:left">' + mtEsc(a) + '</button>';
    });
    inputHTML += '</div>';

  /* ── mcset ── */
  } else if (t.type === 'mcset') {
    var qs = t.questions || [];
    inputHTML = '<div id="mt-mcset-wrap" style="margin-top:0.8rem">';
    qs.forEach(function (sq, qi) {
      inputHTML += '<div class="mt-mcset-q" data-qi="' + qi + '" data-fasit="' + sq.fasit + '" style="margin-bottom:1rem">';
      inputHTML += '<p style="font-size:14px;font-weight:600;margin-bottom:6px">' + mtEsc(sq.q) + '</p>';
      inputHTML += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
      var salts = mtShuffle(sq.alt.map(function (a, i) { return { txt: a, idx: i }; }));
      salts.forEach(function (o) {
        inputHTML += '<button class="mt-mcset-btn" data-qi="' + qi + '" data-idx="' + o.idx + '" onclick="mtMcsetChoose(this)" style="background:#f8f7f4;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:6px 14px;cursor:pointer;text-align:left">' + mtEsc(o.txt) + '</button>';
      });
      inputHTML += '</div></div>';
    });
    inputHTML += '<button onclick="mtMcsetSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>';
    inputHTML += '</div>';

  /* ── cloze ── */
  } else if (t.type === 'cloze') {
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<input id="mt-cloze-inp" type="text" autocomplete="off" autocorrect="off" spellcheck="false" ' +
      'style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'DM Sans\',sans-serif;font-size:15px;padding:9px 14px;outline:none;transition:border-color 0.15s" ' +
      'placeholder="Skriv svaret ditt her\u2026" onkeydown="if(event.key===\'Enter\')mtCheck()">' +
      '<button onclick="mtCheck()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>' +
      '</div>';

  /* ── open ── */
  } else if (t.type === 'open') {
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<textarea id="mt-open-inp" rows="3" autocomplete="off" spellcheck="false" ' +
      'style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'DM Sans\',sans-serif;font-size:14px;padding:9px 14px;outline:none;resize:vertical;line-height:1.6" ' +
      'placeholder="Skriv svaret ditt her\u2026"></textarea>' +
      '<button onclick="mtCheckOpen()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>' +
      '</div>';

  /* ── finn_feil ── */
  } else if (t.type === 'finn_feil') {
    var ffWords = t.tekst.split(' ');
    var ffSpans = ffWords.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="ff-word" data-i="' + i + '" data-clean="' + clean + '" onclick="ffClick(this)" ' +
        'style="display:inline;padding:2px 3px;border-radius:3px;cursor:pointer;transition:background 0.15s;border-bottom:2px solid transparent">' + mtEsc(w) + '</span>';
    }).join(' ');
    var nFeil = Array.isArray(t.fasit_feil) ? t.fasit_feil.length : '?';
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Finn <strong>' + nFeil + ' feil</strong> i teksten. Klikk p\u00E5 kvart ord du meiner er feil.</p>' +
      '<div id="ff-tekst" style="background:#fff;border:1.5px solid #e5e2db;border-radius:8px;padding:0.8rem 1rem;line-height:2;font-family:\'Fraunces\',serif;font-size:15px;margin-bottom:0.8rem">' + ffSpans + '</div>' +
      '<button onclick="ffSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button> ' +
      '<button onclick="ffReset()" style="background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill \u21BA</button>' +
      '</div>';

  /* ── klikk_marker ── */
  } else if (t.type === 'klikk_marker') {
    var kmWords = t.tekst.split(' ');
    var kmSpans = kmWords.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="km-word" data-i="' + i + '" data-clean="' + clean + '" onclick="kmClick(this)" ' +
        'style="display:inline-block;margin:2px 3px;padding:3px 8px;border-radius:5px;cursor:pointer;border:1px solid transparent;transition:background 0.12s,border-color 0.12s;font-size:15px;line-height:1.8">' + mtEsc(w) + '</span>';
    }).join(' ');
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk p\u00E5 orda du meiner er <strong>' + mtEsc(t.maalordklasse) + '</strong>. Klikk igjen for \u00E5 fjerne markeringa.</p>' +
      '<div id="km-tekst" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2;font-family:\'Fraunces\',serif;font-size:15px;margin-bottom:0.8rem">' + kmSpans + '</div>' +
      '<button onclick="kmSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk markeringar</button> ' +
      '<button onclick="kmReset()" style="background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill \u21BA</button>' +
      '</div>';

  /* ── fix (rett feil i tekst) ── */
  } else if (t.type === 'fix') {
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Rett feila direkte i teksten under.</p>' +
      '<textarea id="mt-fix-inp" rows="5" spellcheck="false" ' +
      'style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'Fraunces\',serif;font-size:14px;padding:0.8rem 1rem;outline:none;resize:vertical;line-height:1.7">' + mtEsc(t.tekst) + '</textarea>' +
      '<button onclick="mtFixSjekk()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>' +
      '</div>';

  /* ── fillsel (nedtrekksmenyer) ── */
  } else if (t.type === 'fillsel') {
    var fillItems = t.items || [];
    inputHTML = '<div id="mt-fillsel-wrap" style="margin-top:0.8rem;background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2.2;font-size:14px">';
    fillItems.forEach(function (item, fi) {
      var opts = '<option value="">\u2013 vel \u2013</option>';
      mtShuffle(item.alt).forEach(function (a) {
        opts += '<option value="' + mtEsc(a) + '">' + mtEsc(a) + '</option>';
      });
      inputHTML += '<p class="mt-fillsel-s" style="margin-bottom:0.4rem">' + mtEsc(item.pre) +
        ' <select class="mt-fill-select" data-fi="' + fi + '" data-answer="' + mtEsc(item.fasit) + '" ' +
        'style="font-family:\'DM Sans\',sans-serif;font-size:14px;padding:4px 8px;border:1px solid #d5d2cb;border-radius:6px;background:#fff">' + opts + '</select> ' +
        mtEsc(item.post || '') + '</p>';
    });
    inputHTML += '</div>' +
      '<button onclick="mtFillselSjekk()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>';

  /* ── drag_kolonne ── */
  } else if (t.type === 'drag_kolonne') {
    var dkShuffled = mtShuffle(t.ord.map(function (o, i) { return { tekst: (typeof o === 'string' ? o : o.tekst), fasit: (typeof o === 'string' ? null : o.fasit), _i: i }; }));
    var k0 = mtEsc(t.kolonner[0]);
    var k1 = mtEsc(t.kolonner[1]);
    var c0l = String(t.kolonner[0]).toLowerCase();
    var c1l = String(t.kolonner[1]).toLowerCase();
    var isRW = (/\b(riktig|rett)\b/.test(c0l) && /\b(feil|gal)\b/.test(c1l)) || (/\b(riktig|rett)\b/.test(c1l) && /\b(feil|gal)\b/.test(c0l));
    var col0Bg = isRW ? '#e8f6f0' : '#f8f7f4';
    var col0Br = isRW ? '#82c9a8' : '#d5d2cb';
    var col0Lb = isRW ? '#1a5c42' : '#4a4a46';
    var col1Bg = isRW ? '#fff0ed' : '#f8f7f4';
    var col1Br = isRW ? '#f0a090' : '#d5d2cb';
    var col1Lb = isRW ? '#7f1d1d' : '#4a4a46';

    var tokensDk = dkShuffled.map(function (o) {
      return '<div class="mtdk-token" draggable="true" data-i="' + o._i + '" data-fasit="' + o.fasit + '" data-placed="-1" ' +
        'onclick="mtkMove(this)" ondragstart="mtkDragStart(event,' + o._i + ')" ' +
        'style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:6px 14px;cursor:grab;user-select:none;transition:background 0.12s">' + mtEsc(o.tekst) + '</div>';
    }).join('');

    inputHTML = '<div style="margin-top:0.8rem">' +
      '<div id="mtdk-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px" ondragover="event.preventDefault()" ondrop="mtkDropBank(event)">' + tokensDk + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div id="mtdk-col-0" style="background:' + col0Bg + ';border:2px dashed ' + col0Br + ';border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px" ondragover="event.preventDefault()" ondrop="mtkDropCol(event,0)">' +
      '<div style="font-weight:600;color:' + col0Lb + ';margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">' + k0 + '</div>' +
      '<div id="mtdk-placed-0" style="display:flex;flex-wrap:wrap;gap:6px"></div></div>' +
      '<div id="mtdk-col-1" style="background:' + col1Bg + ';border:2px dashed ' + col1Br + ';border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px" ondragover="event.preventDefault()" ondrop="mtkDropCol(event,1)">' +
      '<div style="font-weight:600;color:' + col1Lb + ';margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">' + k1 + '</div>' +
      '<div id="mtdk-placed-1" style="display:flex;flex-wrap:wrap;gap:6px"></div></div></div>' +
      '<button onclick="mtkSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>' +
      '</div>';

  /* ── drag_ord ── */
  } else if (t.type === 'drag_ord') {
    var doShuffled = mtShuffle([].concat(t.ord));
    var doTokens = doShuffled.map(function (w, i) {
      return '<button class="mtdo-token" data-w="' + mtEsc(w) + '" data-idx="' + i + '" onclick="mtoMove(this)" ' +
        'style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:\'DM Sans\',sans-serif;font-size:14px;padding:6px 14px;cursor:pointer">' + mtEsc(w) + '</button>';
    }).join('');
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<div id="mtdo-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:0.8rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px">' + doTokens + '</div>' +
      '<div id="mtdo-answer" style="min-height:44px;padding:0.6rem;background:#fff;border:2px dashed #c5c2bb;border-radius:8px;display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:#8a8a84">' +
      '<span id="mtdo-placeholder" style="font-size:13px;color:#aaa">Trykk p\u00E5 orda over i rett rekkjef\u00F8lgje\u2026</span></div>' +
      '<button onclick="mtoSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk rekkjef\u00F8lgje</button> ' +
      '<button onclick="mtoReset()" style="margin-top:10px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill \u21BA</button>' +
      '</div>';

  /* ── burger_sort ── */
  } else if (t.type === 'burger_sort') {
    var bsShuffled = mtShuffle(t.avsnitt.map(function (a, i) { return { tekst: a.tekst, _i: i }; }));
    var lagColors = [
      { bg: '#fff3e0', border: '#f5c282', lbl: '#6b3800' },
      { bg: '#e8f6f0', border: '#82c9a8', lbl: '#1a5c42' },
      { bg: '#fdf0eb', border: '#f0a090', lbl: '#7f1d1d' }
    ];
    var bsBuckets = (t.lag || []).map(function (lbl, li) {
      var c = lagColors[li] || lagColors[0];
      return '<div id="mtbs-bucket-' + li + '" data-lagidx="' + li + '" style="flex:1;min-width:120px;background:' + c.bg + ';border:2px dashed ' + c.border + ';border-radius:10px;padding:0.5rem;min-height:70px" ondragover="event.preventDefault()" ondrop="mtbsDrop(event,' + li + ')">' +
        '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:' + c.lbl + ';margin-bottom:5px">' + mtEsc(lbl) + '</div>' +
        '<div id="mtbs-placed-' + li + '" style="display:flex;flex-direction:column;gap:5px"></div></div>';
    }).join('');
    var bsTokens = bsShuffled.map(function (a) {
      return '<div class="mtbs-token" draggable="true" data-i="' + a._i + '" data-placed="-1" ' +
        'ondragstart="mtbsDragStart(event,' + a._i + ')" onclick="mtbsClick(this)" ' +
        'style="background:#fff;border:1px solid #d5d2cb;border-radius:7px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:7px 12px;cursor:grab;line-height:1.5;touch-action:manipulation">' + mtEsc(a.tekst) + '</div>';
    }).join('');
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<div id="mtbs-bank" style="display:flex;flex-direction:column;gap:6px;padding:0.6rem;background:#f8f7f4;border-radius:8px;margin-bottom:0.8rem">' + bsTokens + '</div>' +
      '<div id="mtbs-buckets" style="display:flex;gap:8px;flex-wrap:wrap">' + bsBuckets + '</div>' +
      '<button onclick="mtbsSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button> ' +
      '<button onclick="mtbsReset()" style="margin-top:10px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill \u21BA</button>' +
      '</div>';

  /* ── avsnitt_klikk ── */
  } else if (t.type === 'avsnitt_klikk') {
    var segs = t.segments || [];
    var akItems = segs.map(function (seg) {
      if (!seg.first_word) {
        return '<span style="font-family:\'Fraunces\',serif;font-size:14px;line-height:1.9">' + mtEsc(seg.tekst) + ' </span>';
      }
      var rest = seg.tekst.slice(seg.first_word.length);
      return '<span data-sid="' + seg.id + '" class="ak-break" onclick="akToggle(this,\'' + seg.id + '\')" ' +
        'style="font-family:\'Fraunces\',serif;font-size:14px;line-height:1.9;cursor:pointer;border-bottom:2px dotted #c5c2bb;transition:color 0.15s" title="Klikk for avsnittsskifte">' + mtEsc(seg.first_word) + '</span>' +
        '<span data-sid-rest="' + seg.id + '" style="font-family:\'Fraunces\',serif;font-size:14px;line-height:1.9">' + mtEsc(rest) + ' </span>';
    }).join('');
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk p\u00E5 det <strong>f\u00F8rste ordet</strong> i kvar setning der du vil starte eit nytt avsnitt.</p>' +
      '<div id="ak-text" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2.2">' + akItems + '</div>' +
      '<button onclick="akSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk avsnitt</button> ' +
      '<button onclick="akReset()" style="margin-top:10px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill \u21BA</button>' +
      '</div>';

  /* ── Fallback: cloze-felt ── */
  } else {
    inputHTML = '<div style="margin-top:0.8rem">' +
      '<input id="mt-cloze-inp" type="text" autocomplete="off" autocorrect="off" spellcheck="false" ' +
      'style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:\'DM Sans\',sans-serif;font-size:15px;padding:9px 14px;outline:none;transition:border-color 0.15s" ' +
      'placeholder="Skriv svaret ditt her\u2026" onkeydown="if(event.key===\'Enter\')mtCheck()">' +
      '<button onclick="mtCheck()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>' +
      '</div>';
  }

  var nextLabel = MTS.idx + 1 < MTS.tasks.length ? 'Neste oppg\u00E5ve \u2192' : 'Sj\u00E5 resultat \u2192';
  $mt('mt-task-wrap').innerHTML =
    '<div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;padding:1.5rem;margin-bottom:1rem;border-left:4px solid #e5822a">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:0.8rem">' +
        '<span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:99px;font-weight:500;background:#fff3e0;color:#7a3800">' + mtEsc(t.kat_label) + '</span>' +
        '<span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:99px;font-weight:500;' + vCls + '">' + vLbl + '</span>' +
      '</div>' +
      '<p style="font-size:15px;line-height:1.65;color:#1a1a18;margin:0 0 0.2rem;font-family:\'Fraunces\',serif;font-style:italic">' + mtEsc(t.q || t.sporsmal || '') + '</p>' +
      tekstHTML +
      hintHTML +
      inputHTML +
      '<div id="mt-feedback" style="display:none;border-radius:10px;padding:0.9rem 1.1rem;margin-top:1rem;font-size:14px;line-height:1.7"></div>' +
    '</div>' +
    '<div id="mt-next-wrap" style="display:none;margin-top:0.2rem">' +
      '<button onclick="mtNext()" style="background:#e5822a;color:#fff;border:none;border-radius:99px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;padding:10px 24px;cursor:pointer">' + nextLabel + '</button>' +
    '</div>';

  if (t.type === 'cloze') setTimeout(function () { var el = $mt('mt-cloze-inp'); if (el) el.focus(); }, 80);
  if (t.type === 'open') setTimeout(function () { var el = $mt('mt-open-inp'); if (el) el.focus(); }, 80);
  if (t.type === 'fix') setTimeout(function () { var el = $mt('mt-fix-inp'); if (el) el.focus(); }, 80);
}

/* ══════════════════════════════════════════════════════
   SJEKK-LOGIKK – per type
══════════════════════════════════════════════════════ */

/* ── mc ── */
function mtChoose(btn) {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var chosen = btn.getAttribute('data-val');
  var correct = mtIsCorrect(chosen, t);
  document.querySelectorAll('.mt-alt-btn').forEach(function (b) {
    b.disabled = true; b.style.cursor = 'default';
    var v = b.getAttribute('data-val');
    if (v === chosen) {
      b.style.background = correct ? '#e8f6f0' : '#fff0ed';
      b.style.borderColor = correct ? '#2e8b6a' : '#d45a2f';
      b.style.color = correct ? '#1a5c42' : '#8b2a0a';
    }
    if (!correct && mtIsCorrect(v, t)) {
      b.style.background = '#e8f6f0'; b.style.borderColor = '#2e8b6a'; b.style.color = '#1a5c42';
    }
  });
  mtFinish(correct, chosen, t);
}

/* ── mcset ── */
var _mcsetChoices = {};
function mtMcsetChoose(btn) {
  if (MTS.answered) return;
  var qi = btn.getAttribute('data-qi');
  _mcsetChoices[qi] = parseInt(btn.getAttribute('data-idx'), 10);
  document.querySelectorAll('.mt-mcset-btn[data-qi="' + qi + '"]').forEach(function (b) {
    if (b === btn) {
      b.style.background = '#fff3e0'; b.style.borderColor = '#e5822a'; b.style.fontWeight = '600';
    } else {
      b.style.background = '#f8f7f4'; b.style.borderColor = '#e5e2db'; b.style.fontWeight = '400';
    }
  });
}
function mtMcsetSjekk() {
  if (MTS.answered) return;
  var t = MTS.tasks[MTS.idx];
  var qs = t.questions || [];
  var allCorrect = true;
  qs.forEach(function (sq, qi) {
    var chosen = _mcsetChoices[qi];
    var isRight = chosen === sq.fasit;
    if (!isRight) allCorrect = false;
    document.querySelectorAll('.mt-mcset-btn[data-qi="' + qi + '"]').forEach(function (b) {
      b.disabled = true; b.style.cursor = 'default';
      var idx = parseInt(b.getAttribute('data-idx'), 10);
      if (idx === chosen) {
        b.style.background = isRight ? '#e8f6f0' : '#fff0ed';
        b.style.borderColor = isRight ? '#2e8b6a' : '#d45a2f';
      }
      if (!isRight && idx === sq.fasit) {
        b.style.background = '#e8f6f0'; b.style.borderColor = '#2e8b6a';
      }
    });
  });
  MTS.answered = true;
  _mcsetChoices = {};
  mtFinish(allCorrect, null, t);
}

/* ── cloze ── */
function mtCheck() {
  if (MTS.answered) return;
  var t = MTS.tasks[MTS.idx];
  var el = $mt('mt-cloze-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var correct = mtIsCorrect(val, t);
  el.style.borderColor = correct ? '#2e8b6a' : '#d45a2f';
  el.style.background = correct ? '#e8f6f0' : '#fff0ed';
  el.disabled = true;
  mtFinish(correct, val, t);
}

/* ── open ── */
function mtCheckOpen() {
  if (MTS.answered) return;
  var t = MTS.tasks[MTS.idx];
  var el = $mt('mt-open-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  MTS.score++; MTS.streak++;
  mtUpdateProgress();
  el.disabled = true;
  el.style.borderColor = '#e5822a';

  var fb = $mt('mt-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  fb.style.background = '#fff8f0';
  fb.style.border = '1px solid #f5c282';
  fb.style.color = '#6b3800';

  var html = '<strong>Takk for svaret! Her er eit poeng for innsatsen. \uD83D\uDCDD</strong>';
  html += '<div style="margin-top:0.8rem;display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  if (t.eksempel_svak) html += '<div style="background:#fff0ed;border-radius:8px;padding:0.7rem 0.9rem;font-size:13px;color:#7f1d1d"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px">Kan bli betre \uD83D\uDD34</strong>' + mtEsc(t.eksempel_svak) + '</div>';
  if (t.eksempel_god) html += '<div style="background:#e8f6f0;border-radius:8px;padding:0.7rem 0.9rem;font-size:13px;color:#14532d"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px">Sterk formulering \u2705</strong>' + mtEsc(t.eksempel_god) + '</div>';
  html += '</div>';
  if (t.regel) html += '<div style="margin-top:0.6rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  fb.innerHTML = html;

  var nw = $mt('mt-next-wrap');
  if (nw) nw.style.display = 'block';
}

/* ── fix (rett feil) ── */
function mtFixSjekk() {
  if (MTS.answered) return;
  var t = MTS.tasks[MTS.idx];
  var el = $mt('mt-fix-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var errors = t.errors || {};
  var keys = Object.keys(errors);
  var hits = 0;
  keys.forEach(function (wrong) {
    var right = errors[wrong];
    if (val.indexOf(right) !== -1 && val.indexOf(wrong) === -1) hits++;
  });
  var correct = hits === keys.length;
  el.disabled = true;
  el.style.borderColor = correct ? '#2e8b6a' : '#d45a2f';
  el.style.background = correct ? '#e8f6f0' : '#fff0ed';
  mtFinish(correct, null, t);
}

/* ── fillsel ── */
function mtFillselSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var selects = document.querySelectorAll('.mt-fill-select');
  var allCorrect = true;
  selects.forEach(function (sel) {
    var answer = sel.getAttribute('data-answer');
    var chosen = sel.value;
    var ok = chosen.trim().toLowerCase() === answer.trim().toLowerCase();
    if (!ok) allCorrect = false;
    sel.disabled = true;
    sel.style.borderColor = ok ? '#2e8b6a' : '#d45a2f';
    sel.style.background = ok ? '#e8f6f0' : '#fff0ed';
  });
  mtFinish(allCorrect, null, t);
}

/* ── finn_feil ── */
function ffClick(el) {
  if (MTS.answered) return;
  el.classList.toggle('ff-sel');
  if (el.classList.contains('ff-sel')) {
    el.style.background = 'rgba(91,122,171,.14)';
    el.style.borderBottom = '2px solid #5b7aab';
    el.style.color = '#2b4f85';
  } else {
    el.style.background = '';
    el.style.borderBottom = '2px solid transparent';
    el.style.color = '';
  }
}
function ffSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var feil = (t.fasit_feil || []).map(function (w) { return w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase(); });
  var words = document.querySelectorAll('.ff-word');
  var hits = 0, falsePos = 0;
  words.forEach(function (el) {
    var clean = el.dataset.clean;
    var target = feil.indexOf(clean) !== -1;
    var sel = el.classList.contains('ff-sel');
    if (target && sel) { el.style.background = 'rgba(26,122,80,.14)'; el.style.borderBottom = '2px solid #1A7A50'; el.style.color = '#155f3e'; hits++; }
    else if (target && !sel) { el.style.background = 'rgba(176,90,0,.14)'; el.style.borderBottom = '2px solid #B05A00'; el.style.color = '#7a4800'; }
    else if (!target && sel) { el.style.background = 'rgba(192,57,43,.14)'; el.style.borderBottom = '2px solid #C0392B'; el.style.color = '#8a2319'; falsePos++; }
    else { el.style.borderBottom = '2px solid transparent'; }
    el.style.cursor = 'default';
  });
  var correct = hits === feil.length && falsePos === 0;
  if (!t.fasit) t.fasit = feil.join(', ');
  mtFinish(correct, null, t);
}
function ffReset() {
  if (MTS.answered) return;
  document.querySelectorAll('.ff-word').forEach(function (el) {
    el.classList.remove('ff-sel');
    el.style.background = ''; el.style.borderBottom = '2px solid transparent'; el.style.color = '';
  });
}

/* ── klikk_marker ── */
function kmClick(el) {
  if (MTS.answered) return;
  el.classList.toggle('km-sel');
  if (el.classList.contains('km-sel')) {
    el.style.background = '#e8eef8'; el.style.borderColor = '#5b7aab'; el.style.color = '#2b4f85';
  } else {
    el.style.background = ''; el.style.borderColor = 'transparent'; el.style.color = '';
  }
}
function kmSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var src = t.fasit_ord || t.fasit_v || t.fasit_feil || [];
  var targets = (Array.isArray(src) ? src : [src]).map(function (w) { return String(w).replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase(); });
  var words = document.querySelectorAll('.km-word');
  var hits = 0, falsePos = 0;
  words.forEach(function (el) {
    var clean = el.dataset.clean;
    var target = targets.indexOf(clean) !== -1;
    var sel = el.classList.contains('km-sel');
    if (target && sel) { el.style.background = 'rgba(26,122,80,.14)'; el.style.borderColor = '#1A7A50'; el.style.color = '#155f3e'; hits++; }
    else if (target && !sel) { el.style.background = 'rgba(176,90,0,.14)'; el.style.borderColor = '#B05A00'; el.style.color = '#7a4800'; }
    else if (!target && sel) { el.style.background = 'rgba(192,57,43,.14)'; el.style.borderColor = '#C0392B'; el.style.color = '#8a2319'; falsePos++; }
    el.style.cursor = 'default';
  });
  var correct = hits === targets.length && falsePos === 0;
  if (!t.fasit) t.fasit = targets.join(', ');
  mtFinish(correct, null, t);
}
function kmReset() {
  if (MTS.answered) return;
  document.querySelectorAll('.km-word').forEach(function (el) {
    el.classList.remove('km-sel');
    el.style.background = ''; el.style.borderColor = 'transparent'; el.style.color = '';
  });
}

/* ── drag_kolonne ── */
var _mtkDrag = -1;
function mtkDragStart(event, idx) { _mtkDrag = idx; event.dataTransfer.effectAllowed = 'move'; }
function mtkMove(el) {
  if (MTS.answered) return;
  var placed = el.getAttribute('data-placed');
  if (placed === '-1') {
    var col0 = document.getElementById('mtdk-placed-0');
    if (col0) { col0.appendChild(el); el.setAttribute('data-placed', '0'); }
  } else if (placed === '0') {
    var col1 = document.getElementById('mtdk-placed-1');
    if (col1) { col1.appendChild(el); el.setAttribute('data-placed', '1'); }
  } else {
    var bank = document.getElementById('mtdk-bank');
    if (bank) { bank.appendChild(el); el.setAttribute('data-placed', '-1'); }
  }
}
function mtkDropCol(event, colIdx) {
  event.preventDefault();
  if (MTS.answered) return;
  var token = document.querySelector('.mtdk-token[data-i="' + _mtkDrag + '"]');
  if (!token) return;
  var target = document.getElementById('mtdk-placed-' + colIdx);
  if (target) { target.appendChild(token); token.setAttribute('data-placed', String(colIdx)); }
}
function mtkDropBank(event) {
  event.preventDefault();
  if (MTS.answered) return;
  var token = document.querySelector('.mtdk-token[data-i="' + _mtkDrag + '"]');
  if (!token) return;
  var bank = document.getElementById('mtdk-bank');
  if (bank) { bank.appendChild(token); token.setAttribute('data-placed', '-1'); }
}
function mtkSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var tokens = document.querySelectorAll('.mtdk-token');
  var hits = 0, total = tokens.length;
  tokens.forEach(function (el) {
    var placed = parseInt(el.getAttribute('data-placed'), 10);
    var fasit = parseInt(el.getAttribute('data-fasit'), 10);
    var ok = placed === fasit;
    if (ok) hits++;
    el.style.background = ok ? '#e8f6f0' : '#fff0ed';
    el.style.borderColor = ok ? '#2e8b6a' : '#d45a2f';
    el.style.cursor = 'default';
    el.setAttribute('draggable', 'false');
    el.onclick = null;
  });
  var correct = hits === total;
  mtFinish(correct, null, t);
}

/* ── drag_ord ── */
var _mtoAnswered = [];
function mtoMove(btn) {
  if (MTS.answered) return;
  var answerBox = document.getElementById('mtdo-answer');
  var bank = document.getElementById('mtdo-bank');
  var placeholder = document.getElementById('mtdo-placeholder');
  if (!answerBox || !bank) return;
  if (btn.parentNode === bank) {
    if (placeholder) placeholder.style.display = 'none';
    answerBox.appendChild(btn);
    btn.style.background = '#fff3e0'; btn.style.borderColor = '#e5822a';
  } else {
    bank.appendChild(btn);
    btn.style.background = '#fff'; btn.style.borderColor = '#d5d2cb';
    if (!answerBox.querySelector('.mtdo-token')) {
      if (placeholder) placeholder.style.display = '';
    }
  }
}
function mtoSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var answerBox = document.getElementById('mtdo-answer');
  var tokens = answerBox ? answerBox.querySelectorAll('.mtdo-token') : [];
  var attempt = [];
  tokens.forEach(function (b) { attempt.push(b.getAttribute('data-w')); });
  var studentAnswer = attempt.join(' ');
  var correct = studentAnswer.trim().toLowerCase() === String(t.fasit).trim().toLowerCase();
  tokens.forEach(function (b) {
    b.disabled = true; b.style.cursor = 'default';
    b.style.background = correct ? '#e8f6f0' : '#fff0ed';
    b.style.borderColor = correct ? '#2e8b6a' : '#d45a2f';
  });
  mtFinish(correct, studentAnswer, t);
}
function mtoReset() {
  if (MTS.answered) return;
  var answerBox = document.getElementById('mtdo-answer');
  var bank = document.getElementById('mtdo-bank');
  var placeholder = document.getElementById('mtdo-placeholder');
  if (!answerBox || !bank) return;
  var tokens = answerBox.querySelectorAll('.mtdo-token');
  tokens.forEach(function (b) {
    bank.appendChild(b);
    b.style.background = '#fff'; b.style.borderColor = '#d5d2cb';
  });
  if (placeholder) placeholder.style.display = '';
}

/* ── burger_sort ── */
var _mtbsDrag = -1;
function mtbsDragStart(event, idx) { _mtbsDrag = idx; event.dataTransfer.effectAllowed = 'move'; }
function mtbsClick(el) {
  if (MTS.answered) return;
  var placed = parseInt(el.getAttribute('data-placed'), 10);
  var t = MTS.tasks[MTS.idx];
  var nBuckets = (t.lag || []).length;
  if (placed === -1) {
    var target = document.getElementById('mtbs-placed-0');
    if (target) { target.appendChild(el); el.setAttribute('data-placed', '0'); }
  } else if (placed < nBuckets - 1) {
    var next = document.getElementById('mtbs-placed-' + (placed + 1));
    if (next) { next.appendChild(el); el.setAttribute('data-placed', String(placed + 1)); }
  } else {
    var bank = document.getElementById('mtbs-bank');
    if (bank) { bank.appendChild(el); el.setAttribute('data-placed', '-1'); }
  }
}
function mtbsDrop(event, bucketIdx) {
  event.preventDefault();
  if (MTS.answered) return;
  var token = document.querySelector('.mtbs-token[data-i="' + _mtbsDrag + '"]');
  if (!token) return;
  var target = document.getElementById('mtbs-placed-' + bucketIdx);
  if (target) { target.appendChild(token); token.setAttribute('data-placed', String(bucketIdx)); }
}
function mtbsSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var tokens = document.querySelectorAll('.mtbs-token');
  var hits = 0, total = tokens.length;
  tokens.forEach(function (el) {
    var placed = parseInt(el.getAttribute('data-placed'), 10);
    var origIdx = parseInt(el.getAttribute('data-i'), 10);
    var fasit = t.avsnitt[origIdx] ? t.avsnitt[origIdx].lag : -1;
    var ok = placed === fasit;
    if (ok) hits++;
    el.style.background = ok ? '#e8f6f0' : '#fff0ed';
    el.style.borderColor = ok ? '#2e8b6a' : '#d45a2f';
    el.style.cursor = 'default';
    el.setAttribute('draggable', 'false');
    el.onclick = null;
  });
  var correct = hits === total;
  mtFinish(correct, null, t);
}
function mtbsReset() {
  if (MTS.answered) return;
  var bank = document.getElementById('mtbs-bank');
  if (!bank) return;
  document.querySelectorAll('.mtbs-token').forEach(function (el) {
    bank.appendChild(el);
    el.setAttribute('data-placed', '-1');
    el.style.background = '#fff'; el.style.borderColor = '#d5d2cb';
  });
}

/* ── avsnitt_klikk ── */
var _akSelected = {};
function akToggle(el, sid) {
  if (MTS.answered) return;
  if (_akSelected[sid]) {
    delete _akSelected[sid];
    el.style.background = ''; el.style.color = ''; el.style.borderBottom = '2px dotted #c5c2bb';
  } else {
    _akSelected[sid] = true;
    el.style.background = '#e8eef8'; el.style.color = '#2b4f85'; el.style.borderBottom = '2px solid #5b7aab';
  }
}
function akSjekk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.tasks[MTS.idx];
  var fasitSet = {};
  (t.fasit_breaks || []).forEach(function (sid) { fasitSet[sid] = true; });
  var segs = t.segments || [];
  var hits = 0, falsePos = 0;
  segs.forEach(function (seg) {
    if (!seg.first_word) return;
    var el = document.querySelector('.ak-break[data-sid="' + seg.id + '"]');
    if (!el) return;
    var target = !!fasitSet[seg.id];
    var sel = !!_akSelected[seg.id];
    if (target && sel) { el.style.background = 'rgba(26,122,80,.14)'; el.style.borderBottom = '2px solid #1A7A50'; el.style.color = '#155f3e'; hits++; }
    else if (target && !sel) { el.style.background = 'rgba(176,90,0,.14)'; el.style.borderBottom = '2px solid #B05A00'; el.style.color = '#7a4800'; }
    else if (!target && sel) { el.style.background = 'rgba(192,57,43,.14)'; el.style.borderBottom = '2px solid #C0392B'; el.style.color = '#8a2319'; falsePos++; }
    el.style.cursor = 'default';
    el.onclick = null;
  });
  _akSelected = {};
  var totalFasit = Object.keys(fasitSet).length;
  var correct = hits === totalFasit && falsePos === 0;
  mtFinish(correct, null, t);
}
function akReset() {
  if (MTS.answered) return;
  _akSelected = {};
  document.querySelectorAll('.ak-break').forEach(function (el) {
    el.style.background = ''; el.style.color = ''; el.style.borderBottom = '2px dotted #c5c2bb';
  });
}

/* ══════════════════════════════════════════════════════
   FELLES FASIT-SJEKK OG TILBAKEMELDING
══════════════════════════════════════════════════════ */
function mtIsCorrect(val, t) {
  var n = function (s) { return s.trim().toLowerCase(); };
  var variants = Array.isArray(t.fasit_v) && t.fasit_v.length ? t.fasit_v : [t.fasit];
  return variants.some(function (v) { return n(v) === n(val); });
}

function mtFinish(correct, chosen, t) {
  if (correct) { MTS.score++; MTS.streak++; } else { MTS.streak = 0; }
  MTS.history[MTS.idx] = correct;
  mtUpdateProgress();

  var fb = $mt('mt-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  fb.style.background = correct ? '#e8f6f0' : '#fff0ed';
  fb.style.border = '1px solid ' + (correct ? '#82c9a8' : '#f0a090');
  fb.style.color = correct ? '#14532d' : '#7f1d1d';

  var html = '<strong>' + (correct ? '\u2713 Rett!' : '\u2717 Feil') + '</strong>';
  if (!correct && t.fasit) html += ' Rett svar: <strong>' + mtEsc(t.fasit) + '</strong>';
  if (t.regel) html += '<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  if (t.eks) html += '<div style="margin-top:0.3rem;font-size:13px;opacity:0.75"><em>Eks.: ' + mtEsc(t.eks) + '</em></div>';
  fb.innerHTML = html;

  var nw = $mt('mt-next-wrap');
  if (nw) nw.style.display = 'block';
}

/* ══════════════════════════════════════════════════════
   NAVIGASJON – neste oppg\u00E5ve / oppsummering
══════════════════════════════════════════════════════ */
function mtNext() {
  if (!MTS.answered) {
    var t = MTS.tasks[MTS.idx];
    if (t) {
      if (t.type === 'cloze') {
        var el = $mt('mt-cloze-inp');
        if (el && el.value.trim()) { mtCheck(); }
        else { MTS.answered = true; MTS.history[MTS.idx] = false; mtUpdateProgress(); }
      } else if (t.type === 'open') {
        var oel = $mt('mt-open-inp');
        if (oel && oel.value.trim()) { mtCheckOpen(); }
        else { MTS.answered = true; MTS.history[MTS.idx] = false; }
      } else if (t.type === 'fix') {
        var fel = $mt('mt-fix-inp');
        if (fel && fel.value.trim() !== t.tekst) { mtFixSjekk(); }
        else { MTS.answered = true; MTS.history[MTS.idx] = false; mtUpdateProgress(); }
      } else {
        MTS.answered = true; MTS.history[MTS.idx] = false; mtUpdateProgress();
      }
    }
  }
  MTS.idx++;
  mtUpdateProgress();
  if (MTS.idx >= MTS.tasks.length) { mtShowSummary(); return; }
  mtRenderTask();
}

function mtShowSummary() {
  $mt('mt-task-wrap').innerHTML = '';
  var total = MTS.tasks.length;
  var pct = total > 0 ? Math.round((MTS.score / total) * 100) : 0;
  $mt('mt-sum-score').textContent = MTS.score + '/' + total;
  $mt('mt-sum-rett').textContent = MTS.score;
  $mt('mt-sum-feil').textContent = total - MTS.score;
  $mt('mt-sum-pct').textContent = pct + '%';
  var msgs = [[90, 'Framifrå! Du meistrar dette svært godt.'], [70, 'Bra jobba! Du er på god veg.'], [50, 'Greitt! Øv litt meir på dei vanskelege oppgåvene.'], [0, 'Ikkje gi opp \u2013 prøv igjen!']];
  var msg = msgs[msgs.length - 1][1];
  for (var m = 0; m < msgs.length; m++) { if (pct >= msgs[m][0]) { msg = msgs[m][1]; break; } }
  $mt('mt-sum-msg').textContent = msg;

  var hist = $mt('mt-sum-history');
  if (hist) {
    var html = '';
    MTS.tasks.forEach(function (t, i) {
      var ok = MTS.history && MTS.history[i];
      var icon = ok ? '\u2713' : '\u2717';
      var bg = ok ? 'background:rgba(130,201,168,0.15);border-color:rgba(130,201,168,0.3)' : 'background:rgba(240,160,144,0.15);border-color:rgba(240,160,144,0.3)';
      var col = ok ? '#82c9a8' : '#f0a090';
      html += '<div style="' + bg + ';border:1px solid;border-radius:8px;padding:0.5rem 0.8rem;margin-bottom:6px;display:flex;gap:10px;align-items:flex-start;font-size:13px">' +
        '<span style="color:' + col + ';font-weight:600;flex-shrink:0">' + icon + '</span>' +
        '<div style="color:#1a1a18;flex:1">' + mtEsc((t.q || t.sporsmal || '').substring(0, 80)) + (ok ? '' : ' <span style="color:#f0a090">\u2192 Rett: ' + mtEsc(t.fasit) + '</span>') + '</div>' +
        '</div>';
    });
    hist.innerHTML = html;
  }

  $mt('mt-summary').style.display = 'block';
  $mt('mt-start-btn').disabled = false;
}
