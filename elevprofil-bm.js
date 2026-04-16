(function() {
  'use strict';

  var ANALYSIS_KEY = 'norsklaben-elevprofil-bm-v1';
  var ADAPTIVE_PROFILE_KEY = 'norsklaben-adaptive-profile-v1';
  var ADAPTIVE_HISTORY_KEY = 'norsklaben-adaptive-history-v1';
  var MT_SHARED_KEY = 'nlMestring';
  var MT_BACKUP_KEY = 'nlMestring_backup';
  var MT_LEGACY_KEY = 'nlMestringBM';
  var ANALYSIS_LIMIT = 24;

  var XP_LEVELS = [
    { name: 'Ordlærling',        xp: 0,     icon: '🌱' },
    { name: 'Bokstavjeger',      xp: 30,    icon: '🔍' },
    { name: 'Setningssmed',      xp: 80,    icon: '🔨' },
    { name: 'Ordkunstner',       xp: 150,   icon: '🖌️' },
    { name: 'Tekstbygger',       xp: 250,   icon: '🏗️' },
    { name: 'Avsnittarkitekt',   xp: 380,   icon: '📐' },
    { name: 'Grammatikksnekker', xp: 500,   icon: '⚙️' },
    { name: 'Kommakommandør',    xp: 650,   icon: '✏️' },
    { name: 'Ordklassemester',   xp: 800,   icon: '🏷️' },
    { name: 'Setningssamler',    xp: 1000,  icon: '🧱' },
    { name: 'Språkmester',       xp: 1200,  icon: '🏆' },
    { name: 'Tekstsmed',         xp: 1500,  icon: '⚒️' },
    { name: 'Ordformidler',      xp: 1800,  icon: '💬' },
    { name: 'Stilmester',        xp: 2200,  icon: '🎭' },
    { name: 'Norskentusiast',    xp: 2600,  icon: '📚' },
    { name: 'Tekstanalytiker',   xp: 3100,  icon: '🔬' },
    { name: 'Sjangerkjenner',    xp: 3700,  icon: '📝' },
    { name: 'Argumentator',      xp: 4400,  icon: '💡' },
    { name: 'Kildeforsker',      xp: 5200,  icon: '📖' },
    { name: 'Retorikksnekker',   xp: 6100,  icon: '🗣️' },
    { name: 'Ordpoet',           xp: 7200,  icon: '🖋️' },
    { name: 'Litteraturnerd',    xp: 8500,  icon: '📕' },
    { name: 'Språkvokter',       xp: 10000, icon: '🛡️' },
    { name: 'Skrivekunstner',    xp: 11800, icon: '🎨' },
    { name: 'Tekstmester',       xp: 13800, icon: '🏅' },
    { name: 'Norskmester',       xp: 16000, icon: '👑' },
    { name: 'Språkfilosof',      xp: 18500, icon: '🧠' },
    { name: 'Ordlegende',        xp: 21500, icon: '⭐' },
    { name: 'Norskprofessor',    xp: 25000, icon: '🎓' },
    { name: 'Stormester',        xp: 30000, icon: '💎' }
  ];

  var CATEGORY_META = {
    djupneoppgaver: { label: 'Dybdeoppgaver', icon: '🧠' },
    og_aa: { label: 'Og / å', icon: '✏️' },
    sammensatt: { label: 'Sammensatte ord', icon: '🔗' },
    dobbel_konsonant: { label: 'Dobbel konsonant', icon: '🔤' },
    kj_skj: { label: 'Kj / skj', icon: '👅' },
    tegnsetting: { label: 'Tegnsetting', icon: '❗' },
    ordklasser: { label: 'Ordklasser', icon: '🏷️' },
    setningsbygging: { label: 'Setningsbygging', icon: '🧱' },
    bindeord: { label: 'Bindeord', icon: '🔗' },
    tekststruktur: { label: 'Tekststruktur', icon: '📄' },
    kildebruk: { label: 'Kildebruk', icon: '📖' },
    oppgavetolking: { label: 'Forstå oppgaven', icon: '🎯' },
    spraak_stil: { label: 'Språk og stil', icon: '🎨' },
    aarsak_sammenheng: { label: 'Årsak og sammenheng', icon: '🔀' },
    referansekjede: { label: 'Referansekjede', icon: '🔁' },
    logisk_struktur: { label: 'Logisk struktur', icon: '🧩' },
    sjangerkompetanse: { label: 'Sjangerkompetanse', icon: '📝' },
    fagartikkel: { label: 'Fagartikkel', icon: '📰' },
    debattinnlegg: { label: 'Debattinnlegg', icon: '💬' },
    overskrift_ingress: { label: 'Overskrift og ingress', icon: '🗞️' },
    novelle: { label: 'Novelle', icon: '📕' },
    parafrase: { label: 'Parafrase', icon: '🔄' },
    sitat: { label: 'Sitat', icon: '💎' },
    tal_og_statistikk: { label: 'Tall og statistikk', icon: '📊' },
    ordval: { label: 'Ordvalg', icon: '💡' },
    bruke_eksempel: { label: 'Bruke eksempel', icon: '📌' },
    tilpass_til_lesaran: { label: 'Tilpass til leseren', icon: '👥' },
    tilpass_til_lesaren: { label: 'Tilpass til leseren', icon: '👥' }
  };

  var ANALYSIS_RULES = [
    { id: 'oppgavetolking', keywords: ['drøft', 'diskuter', 'sammenlign', 'analyser', 'tolk', 'gjør rede for', 'reflekter'], reason: 'Oppgaveteksten bruker styringsord som krever sikker oppgavetolking.' },
    { id: 'fagartikkel', keywords: ['fagartikkel', 'artikkel', 'saktekst'], reason: 'Oppgaven peker mot fagartikkel eller annen sakpreget skriving.' },
    { id: 'debattinnlegg', keywords: ['debattinnlegg', 'leserinnlegg', 'argumenter', 'argumenterende', 'overbevise'], reason: 'Oppgaven legger opp til argumentasjon og tydelig standpunkt.' },
    { id: 'novelle', keywords: ['novelle', 'fortelling', 'skjønnlitterær', 'personskildring', 'miljøskildring'], reason: 'Oppgaven handler om kreativ eller skjønnlitterær skriving.' },
    { id: 'tekststruktur', keywords: ['innledning', 'hoveddel', 'avslutning', 'avsnitt', 'struktur', 'disposisjon'], reason: 'Oppgaven nevner struktur, avsnitt eller oppbygging.' },
    { id: 'overskrift_ingress', keywords: ['overskrift', 'ingress'], reason: 'Oppgaven nevner overskrift eller ingress direkte.' },
    { id: 'kildebruk', keywords: ['kilde', 'kilder', 'kildeliste', 'henvisning', 'kildehenvisning', 'bruk kilder'], reason: 'Oppgaven krever bevisst bruk av kilder.' },
    { id: 'parafrase', keywords: ['parafrase', 'med egne ord', 'omskriv'], reason: 'Oppgaven krever at eleven omformulerer stoff med egne ord.' },
    { id: 'sitat', keywords: ['sitat', 'siter', 'direkte sitat'], reason: 'Oppgaven krever presis bruk av sitat.' },
    { id: 'tal_og_statistikk', keywords: ['statistikk', 'diagram', 'tabell', 'prosent', 'tallmateriale'], reason: 'Oppgaven trekker inn tallmateriale eller statistikk.' },
    { id: 'ordval', keywords: ['presist språk', 'fagspråk', 'variert språk', 'ordvalg', 'presise ord'], reason: 'Oppgaven krever presist og bevisst ordvalg.' },
    { id: 'bruke_eksempel', keywords: ['eksempel', 'konkretiser', 'vis med eksempel'], reason: 'Oppgaven forventer at eleven underbygger med eksempler.' },
    { id: 'tilpass_til_lesaran', keywords: ['målgruppe', 'leser', 'mottaker', 'tilpass språket'], reason: 'Oppgaven peker mot mottakerbevissthet og tilpassing til leser.' },
    { id: 'sjangerkompetanse', keywords: ['sjanger', 'register', 'formell', 'uformell'], reason: 'Oppgaven stiller krav til sjangerforståelse eller register.' },
    { id: 'spraak_stil', keywords: ['språk og stil', 'språkbruk', 'stil', 'tone'], reason: 'Oppgaven krever bevisst stil og språkføring.' },
    { id: 'aarsak_sammenheng', keywords: ['årsak', 'virkning', 'konsekvens', 'derfor', 'fordi'], reason: 'Oppgaven handler om å forklare sammenhenger og konsekvenser.' },
    { id: 'bindeord', keywords: ['sammenheng', 'bindeord', 'for det første', 'dessuten'], reason: 'Oppgaven krever sammenheng og gode overganger.' }
  ];

  var RADAR_CATEGORIES = ['Innhold', 'Struktur', 'Språk og stil', 'Rettskriving', 'Grammatikk og tegnsetting', 'Kildebruk'];

  function sanitizeRadarScores(scores) {
    if (!Array.isArray(scores) || scores.length !== 6) return null;
    var valid = true;
    var cleaned = scores.map(function(v) {
      var n = Number(v);
      if (isNaN(n) || n < 1 || n > 6) { valid = false; return 0; }
      return Math.round(n * 10) / 10;
    });
    return valid ? cleaned : null;
  }

  function buildRadarSvg(scores, labels) {
    var cx = 200, cy = 200, maxR = 150, n = 6;
    function angle(i) { return -Math.PI / 2 + i * 2 * Math.PI / n; }
    function pt(i, r) { return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) }; }
    var svg = '<svg class="ep-radar-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">';
    for (var ring = 1; ring <= 6; ring++) {
      var r = maxR * ring / 6;
      var pts = [];
      for (var i = 0; i < n; i++) { var p = pt(i, r); pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1)); }
      svg += '<polygon points="' + pts.join(' ') + '" fill="' + (ring % 2 === 0 ? 'rgba(232,243,236,.35)' : 'none') + '" stroke="#dce6df" stroke-width="1"/>';
    }
    for (var i = 0; i < n; i++) {
      var p = pt(i, maxR);
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p.x.toFixed(1) + '" y2="' + p.y.toFixed(1) + '" stroke="#dce6df" stroke-width="1"/>';
    }
    for (var ring = 1; ring <= 6; ring++) {
      svg += '<text x="' + (cx + 5) + '" y="' + (cy - maxR * ring / 6 + 12).toFixed(1) + '" font-size="10" fill="#9aad9e">' + ring + '</text>';
    }
    if (scores) {
      var dataPts = [];
      for (var i = 0; i < n; i++) {
        var val = Math.max(0, Math.min(6, scores[i] || 0));
        var p = pt(i, maxR * val / 6);
        dataPts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
      }
      svg += '<polygon points="' + dataPts.join(' ') + '" fill="rgba(26,122,80,.18)" stroke="#1a7a50" stroke-width="2.5"/>';
      for (var i = 0; i < n; i++) {
        var val = Math.max(0, Math.min(6, scores[i] || 0));
        var p = pt(i, maxR * val / 6);
        svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4.5" fill="#1a7a50"/>';
        svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 8).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#1a3d2b">' + val.toFixed(1) + '</text>';
      }
    }
    var labelR = maxR + 30;
    for (var i = 0; i < n; i++) {
      var p = pt(i, labelR);
      var anchor = 'middle';
      if (p.x < cx - 10) anchor = 'end';
      else if (p.x > cx + 10) anchor = 'start';
      var dy = p.y < cy - 10 ? '-0.3em' : (p.y > cy + 10 ? '1.1em' : '0.35em');
      svg += '<text x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="12" font-weight="600" fill="#3a5a42" dy="' + dy + '">' + escapeHtml(labels[i]) + '</text>';
    }
    svg += '</svg>';
    return svg;
  }

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function readLocalJson(key, fallback) {
    try {
      if (!window.localStorage) return fallback;
      return safeParse(window.localStorage.getItem(key), fallback);
    } catch (e) {
      return fallback;
    }
  }

  function writeLocalJson(key, value) {
    try {
      if (!window.localStorage) return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function defaultAnalysisStore() {
    return {
      version: 1,
      updatedAt: '',
      analyses: []
    };
  }

  function getCategoryLabel(id) {
    var meta = CATEGORY_META[id];
    if (meta && meta.label) return meta.label;
    return String(id || '').replace(/_/g, ' ').replace(/\b\w/g, function(letter) {
      return letter.toUpperCase();
    });
  }

  function getCategoryIcon(id) {
    var meta = CATEGORY_META[id];
    return meta && meta.icon ? meta.icon : '📋';
  }

  function buildAnalysisTitle(text) {
    var firstLine = String(text || '').split(/\r?\n/).map(function(line) {
      return String(line || '').trim();
    }).filter(Boolean)[0] || '';
    if (!firstLine) return 'Oppgavetekst';
    return firstLine.length > 72 ? firstLine.slice(0, 69) + '...' : firstLine;
  }

  function sanitizeCategory(cat) {
    if (!cat) return null;
    var id = String(cat.id || cat.kat || '').trim();
    if (!id) return null;
    return {
      id: id,
      label: String(cat.label || cat.kat_label || getCategoryLabel(id)),
      reason: String(cat.reason || '').trim(),
      score: Math.max(0, Number(cat.score) || 0)
    };
  }

  function sanitizeAnalysisEntry(entry) {
    var text = String((entry && (entry.text || entry.textExcerpt || entry.prompt)) || '').trim();
    var categories = Array.isArray(entry && entry.categories)
      ? entry.categories.map(sanitizeCategory).filter(Boolean)
      : [];
    var radarScores = sanitizeRadarScores(entry && entry.radarScores);
    return {
      ts: String((entry && entry.ts) || new Date().toISOString()),
      title: String((entry && entry.title) || buildAnalysisTitle(text)).trim(),
      textExcerpt: text.slice(0, 280),
      source: String((entry && entry.source) || 'oppgavebank-bm').trim(),
      categories: categories.slice(0, 6),
      radarScores: radarScores
    };
  }

  function getAnalysisStore() {
    var raw = readLocalJson(ANALYSIS_KEY, defaultAnalysisStore());
    var store = raw && typeof raw === 'object' ? raw : defaultAnalysisStore();
    if (!Array.isArray(store.analyses)) store.analyses = [];
    store.analyses = store.analyses.map(sanitizeAnalysisEntry).filter(function(item) {
      return item.categories.length || item.textExcerpt;
    });
    store.updatedAt = String(store.updatedAt || '');
    store.version = 1;
    return store;
  }

  function saveAnalysis(entry) {
    var store = getAnalysisStore();
    var cleaned = sanitizeAnalysisEntry(entry || {});
    store.analyses.unshift(cleaned);
    if (store.analyses.length > ANALYSIS_LIMIT) store.analyses = store.analyses.slice(0, ANALYSIS_LIMIT);
    store.updatedAt = new Date().toISOString();
    writeLocalJson(ANALYSIS_KEY, store);
    return cleaned;
  }

  function normalizeText(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function inferSuggestionsFromText(text) {
    var source = normalizeText(text);
    var scores = {};

    ANALYSIS_RULES.forEach(function(rule) {
      var matches = [];
      rule.keywords.forEach(function(keyword) {
        if (source.indexOf(keyword) !== -1) matches.push(keyword);
      });
      if (!matches.length) return;
      scores[rule.id] = {
        id: rule.id,
        label: getCategoryLabel(rule.id),
        score: matches.length * 12,
        reason: rule.reason + ' Trefford: ' + matches.slice(0, 3).join(', ') + '.'
      };
    });

    var ranked = Object.keys(scores).map(function(key) {
      return scores[key];
    }).sort(function(a, b) {
      return b.score - a.score;
    });

    if (!ranked.length) {
      ranked = [
        { id: 'oppgavetolking', label: getCategoryLabel('oppgavetolking'), score: 10, reason: 'Start med å avklare hva oppgaven faktisk krever.' },
        { id: 'tekststruktur', label: getCategoryLabel('tekststruktur'), score: 9, reason: 'De fleste oppgavetekster blir lettere å løse med tydelig struktur.' },
        { id: 'ordval', label: getCategoryLabel('ordval'), score: 8, reason: 'Presist ordvalg hjelper eleven med å svare mer treffsikkert.' }
      ];
    }

    return ranked.slice(0, 4);
  }

  function formatDate(ts, shortMode) {
    var date = ts ? new Date(ts) : new Date();
    if (isNaN(date.getTime())) return '-';
    if (shortMode) {
      return date.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit' });
    }
    return date.toLocaleString('nb-NO', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function readMasteryData() {
    var data = readLocalJson(MT_SHARED_KEY, null) || readLocalJson(MT_BACKUP_KEY, null) || readLocalJson(MT_LEGACY_KEY, {});
    if (!data || typeof data !== 'object') data = {};
    if (!Array.isArray(data.sessions)) data.sessions = [];
    if (!Array.isArray(data.feillogg)) data.feillogg = [];
    if (!data.streak || typeof data.streak !== 'object') data.streak = { current: 0, rekord: 0, dagar: [] };
    data.totalXP = Math.max(0, Number(data.totalXP) || 0);
    data.streak.current = Math.max(0, Number(data.streak.current) || 0);
    data.streak.rekord = Math.max(0, Number(data.streak.rekord) || 0);
    return data;
  }

  function readAdaptiveProfile() {
    var data = readLocalJson(ADAPTIVE_PROFILE_KEY, {});
    if (!data || typeof data !== 'object') data = {};
    return {
      xp: Math.max(0, Number(data.xp) || 0),
      sessions: Math.max(0, Number(data.sessions) || 0),
      streak: Math.max(0, Number(data.streak) || 0),
      lastPlayedDay: String(data.lastPlayedDay || ''),
      bestPct: Math.max(0, Math.min(100, Number(data.bestPct) || 0))
    };
  }

  function readAdaptiveHistory() {
    var list = readLocalJson(ADAPTIVE_HISTORY_KEY, []);
    if (!Array.isArray(list)) return [];
    return list.filter(function(item) {
      return item && typeof item === 'object';
    }).map(function(item) {
      return {
        ts: String(item.ts || ''),
        pct: Math.max(0, Math.min(100, Number(item.pct) || 0)),
        xp: Math.max(0, Number(item.xp) || 0),
        count: Math.max(0, Number(item.count) || 0),
        retryMode: !!item.retryMode,
        cats: Array.isArray(item.cats) ? item.cats : []
      };
    });
  }

  function getXpLevel(totalXp) {
    var safeXp = Math.max(0, Number(totalXp) || 0);
    var current = XP_LEVELS[0];
    var next = null;
    for (var index = XP_LEVELS.length - 1; index >= 0; index--) {
      if (safeXp >= XP_LEVELS[index].xp) {
        current = XP_LEVELS[index];
        next = index < XP_LEVELS.length - 1 ? XP_LEVELS[index + 1] : null;
        break;
      }
    }
    return { current: current, next: next };
  }

  function getCategoryStats(mastery) {
    var sessions = mastery && Array.isArray(mastery.sessions) ? mastery.sessions : [];
    var stats = {};
    sessions.forEach(function(session) {
      if (!session || !session.cats) return;
      Object.keys(session.cats).forEach(function(catId) {
        var row = session.cats[catId] || {};
        if (!stats[catId]) {
          stats[catId] = { id: catId, label: getCategoryLabel(catId), rett: 0, feil: 0, total: 0, pct: 0 };
        }
        stats[catId].rett += Math.max(0, Number(row.rett) || 0);
        stats[catId].feil += Math.max(0, Number(row.feil) || 0);
      });
    });

    return Object.keys(stats).map(function(catId) {
      var row = stats[catId];
      row.total = row.rett + row.feil;
      row.pct = row.total ? Math.round((row.rett / row.total) * 100) : 0;
      return row;
    }).sort(function(a, b) {
      if (b.total !== a.total) return b.total - a.total;
      return b.pct - a.pct;
    });
  }

  function aggregateFeillogg(feillogg) {
    var counts = {};
    (Array.isArray(feillogg) ? feillogg : []).forEach(function(item) {
      if (!item || !item.kat) return;
      counts[item.kat] = (counts[item.kat] || 0) + 1;
    });
    return counts;
  }

  function buildRecommendations(categoryStats, analyses, feilloggCounts) {
    var latest = analyses[0] || null;
    var map = {};

    categoryStats.filter(function(item) {
      return item.total > 0 && item.pct < 75;
    }).sort(function(a, b) {
      return a.pct - b.pct;
    }).slice(0, 3).forEach(function(item) {
      map[item.id] = map[item.id] || { id: item.id, label: item.label, score: 0, reasons: [] };
      map[item.id].score += 4;
      map[item.id].reasons.push('Lav treffprosent i øvingsoppgavene (' + item.pct + ' %).');
    });

    if (latest && Array.isArray(latest.categories)) {
      latest.categories.forEach(function(item) {
        if (!item || !item.id) return;
        map[item.id] = map[item.id] || { id: item.id, label: getCategoryLabel(item.id), score: 0, reasons: [] };
        map[item.id].score += 5;
        if (item.reason) map[item.id].reasons.push('Siste oppgavetekst: ' + item.reason);
      });
    }

    Object.keys(feilloggCounts || {}).forEach(function(catId) {
      var count = feilloggCounts[catId];
      if (!count) return;
      map[catId] = map[catId] || { id: catId, label: getCategoryLabel(catId), score: 0, reasons: [] };
      map[catId].score += Math.min(4, count);
      map[catId].reasons.push(count + ' tidligere feil i feilloggen.');
    });

    return Object.keys(map).map(function(catId) {
      return map[catId];
    }).sort(function(a, b) {
      return b.score - a.score;
    }).slice(0, 4);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderScanResults(resultsEl, statusEl, text, suggestions, savedEntry) {
    if (!resultsEl) return;
    var cards = suggestions.map(function(item) {
      return '' +
        '<article class="ob-ai-result">' +
          '<div class="ob-ai-result-top"><span class="ob-ai-badge">' + escapeHtml(getCategoryIcon(item.id)) + ' ' + escapeHtml(item.label) + '</span></div>' +
          '<p>' + escapeHtml(item.reason) + '</p>' +
          '<div class="ob-ai-result-actions">' +
            '<a class="ob-btn ob-btn-primary" href="skrivelab-bm.html?kat=' + encodeURIComponent(item.id) + '">Start i Skrivemesteren</a>' +
            '<a class="ob-btn" href="oppgavebank-bm.html?kat=' + encodeURIComponent(item.id) + '&mode=manual">Se oppgaver</a>' +
          '</div>' +
        '</article>';
    }).join('');

    resultsEl.innerHTML = '' +
      '<div class="ob-ai-summary">' +
        '<strong>Forslagene er lagret i elevprofilen.</strong>' +
        '<span>Sist lagret: ' + escapeHtml(formatDate(savedEntry.ts)) + '</span>' +
      '</div>' +
      '<div class="ob-ai-result-grid">' + cards + '</div>';

    if (statusEl) {
      statusEl.textContent = text.trim()
        ? 'Oppgaveteksten er lagret lokalt i denne nettleseren og brukes i elevprofilen.'
        : 'Forslagene er lagret i elevprofilen.';
    }
  }

  function initScanPanel() {
    var panel = document.getElementById('ob-ai-scan');
    if (!panel || panel.dataset.profileReady === '1') return;
    panel.dataset.profileReady = '1';

    panel.innerHTML = '' +
      '<div class="ob-ai-headline">' +
        '<div class="ob-ai-icon">🤖</div>' +
        '<div>' +
          '<h3>Tekstskanning og elevprofil</h3>' +
          '<p>Lim inn oppgaveteksten, få forslag til øvingskategorier og lagre anbefalingene lokalt til elevprofilen.</p>' +
        '</div>' +
      '</div>' +
      '<label class="ob-ai-label" for="ob-ai-text">Oppgavetekst</label>' +
      '<textarea id="ob-ai-text" class="ob-ai-text" placeholder="Lim inn oppgaveteksten her..."></textarea>' +
      '<div class="ob-ai-actions">' +
        '<button type="button" class="ob-btn ob-btn-primary" id="ob-ai-run">Få forslag og lagre</button>' +
        '<a class="ob-btn" href="elevprofil-bm.html">Åpne elevprofil</a>' +
      '</div>' +
      '<p class="ob-ai-status" id="ob-ai-status">Data lagres bare lokalt i nettleseren på denne enheten.</p>' +
      '<div class="ob-ai-results" id="ob-ai-results"></div>';

    var textEl = document.getElementById('ob-ai-text');
    var runBtn = document.getElementById('ob-ai-run');
    var statusEl = document.getElementById('ob-ai-status');
    var resultsEl = document.getElementById('ob-ai-results');
    var lastAnalysis = getAnalysisStore().analyses[0];

    if (lastAnalysis && statusEl) {
      statusEl.textContent = 'Siste lagrede analyse: ' + formatDate(lastAnalysis.ts) + '.';
    }

    if (!runBtn) return;
    runBtn.addEventListener('click', function() {
      var text = textEl ? String(textEl.value || '') : '';
      if (!text.trim()) {
        if (statusEl) statusEl.textContent = 'Lim inn en oppgavetekst først.';
        if (resultsEl) resultsEl.innerHTML = '';
        return;
      }

      var suggestions = inferSuggestionsFromText(text);
      var savedEntry = saveAnalysis({
        ts: new Date().toISOString(),
        title: buildAnalysisTitle(text),
        textExcerpt: text,
        source: 'oppgavebank-bm',
        categories: suggestions
      });

      renderScanResults(resultsEl, statusEl, text, suggestions, savedEntry);
    });
  }

  function renderProfilePage() {
    var root = document.getElementById('elevprofil-root');
    if (!root) return;

    var analysisStore = getAnalysisStore();
    var mastery = readMasteryData();
    var adaptiveProfile = readAdaptiveProfile();
    var adaptiveHistory = readAdaptiveHistory();
    var totalXp = mastery.totalXP || adaptiveProfile.xp || 0;
    var levelInfo = getXpLevel(totalXp);
    var nextXp = levelInfo.next ? Math.max(0, levelInfo.next.xp - totalXp) : 0;
    var levelSpan = levelInfo.next ? Math.max(1, levelInfo.next.xp - levelInfo.current.xp) : 1;
    var levelProgress = levelInfo.next ? Math.min(100, Math.round(((totalXp - levelInfo.current.xp) / levelSpan) * 100)) : 100;
    var sessionCount = Math.max(adaptiveProfile.sessions || 0, mastery.sessions.length || 0);
    var bestPct = Math.max(adaptiveProfile.bestPct || 0, adaptiveHistory.reduce(function(max, item) {
      return Math.max(max, item.pct || 0);
    }, 0));
    var streak = mastery.streak.current || adaptiveProfile.streak || 0;
    var categoryStats = getCategoryStats(mastery);
    var strengths = categoryStats.filter(function(item) {
      return item.total > 0;
    }).sort(function(a, b) {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return b.total - a.total;
    }).slice(0, 3);
    var weaknesses = categoryStats.filter(function(item) {
      return item.total > 0;
    }).sort(function(a, b) {
      if (a.pct !== b.pct) return a.pct - b.pct;
      return b.total - a.total;
    }).slice(0, 3);
    var feilloggCounts = aggregateFeillogg(mastery.feillogg);
    var recommendations = buildRecommendations(categoryStats, analysisStore.analyses, feilloggCounts);
    var recentAnalyses = analysisStore.analyses.slice(0, 4);
    var recentHistory = adaptiveHistory.slice(-6);
    var latestRadar = null;
    for (var ri = 0; ri < analysisStore.analyses.length; ri++) {
      if (analysisStore.analyses[ri].radarScores) { latestRadar = analysisStore.analyses[ri].radarScores; break; }
    }

    function kpiCard(title, value, meta) {
      return '' +
        '<article class="ep-kpi">' +
          '<span class="ep-kpi-label">' + escapeHtml(title) + '</span>' +
          '<strong>' + escapeHtml(value) + '</strong>' +
          '<span class="ep-kpi-meta">' + escapeHtml(meta) + '</span>' +
        '</article>';
    }

    function statRows(list, emptyText, variant) {
      if (!list.length) return '<div class="ep-empty">' + escapeHtml(emptyText) + '</div>';
      return list.map(function(item) {
        return '' +
          '<div class="ep-stat-row ' + variant + '">' +
            '<div><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.total + ' oppgaver') + '</span></div>' +
            '<span>' + escapeHtml(item.pct + ' %') + '</span>' +
          '</div>';
      }).join('');
    }

    function recommendationRows(list) {
      if (!list.length) return '<div class="ep-empty">Ingen tydelige anbefalinger ennå. Lim inn en oppgavetekst eller fullfør noen økter først.</div>';
      return list.map(function(item) {
        return '' +
          '<article class="ep-reco">' +
            '<div class="ep-reco-top"><span class="ep-chip">' + escapeHtml(getCategoryIcon(item.id)) + ' ' + escapeHtml(item.label) + '</span><span class="ep-reco-score">Prioritet ' + escapeHtml(String(item.score)) + '</span></div>' +
            '<p>' + escapeHtml(item.reasons[0] || 'Bygg videre på denne kategorien.') + '</p>' +
            '<div class="ep-reco-actions">' +
              '<a class="ep-btn ep-btn-pri" href="skrivelab-bm.html?kat=' + encodeURIComponent(item.id) + '">Øv i Skrivemesteren</a>' +
              '<a class="ep-btn" href="oppgavebank-bm.html?kat=' + encodeURIComponent(item.id) + '&mode=manual">Se oppgaver</a>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    function historyBars(list) {
      if (!list.length) return '<div class="ep-empty">Progresjon vises her etter at du har fullført økter i Skrivemesteren.</div>';
      return '<div class="ep-bars">' + list.map(function(item) {
        var height = Math.max(18, item.pct);
        return '' +
          '<div class="ep-bar-col">' +
            '<span class="ep-bar" style="height:' + height + '%"></span>' +
            '<strong>' + escapeHtml(String(item.pct)) + ' %</strong>' +
            '<small>' + escapeHtml(formatDate(item.ts, true)) + '</small>' +
            '<small>+' + escapeHtml(String(item.xp)) + ' XP</small>' +
          '</div>';
      }).join('') + '</div>';
    }

    function analysisCards(list) {
      if (!list.length) return '<div class="ep-empty">Ingen oppgavetekster er lagret ennå.</div>';
      return list.map(function(item) {
        var chips = (item.categories || []).slice(0, 3).map(function(cat) {
          return '<span class="ep-chip muted">' + escapeHtml(cat.label) + '</span>';
        }).join('');
        return '' +
          '<article class="ep-analysis">' +
            '<div class="ep-analysis-top"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(formatDate(item.ts)) + '</span></div>' +
            '<p>' + escapeHtml(item.textExcerpt || '') + '</p>' +
            '<div class="ep-chip-row">' + chips + '</div>' +
          '</article>';
      }).join('');
    }

    root.innerHTML = '' +
      '<section class="ep-hero-card">' +
        '<div class="ep-hero-copy">' +
          '<span class="ep-kicker">Lokal elevprofil</span>' +
          '<h1>' + escapeHtml(levelInfo.current.icon + ' ' + levelInfo.current.name) + '</h1>' +
          '<p>Profilen bygger på oppgavetekster som er limt inn i Oppgavebanken, pluss faktisk progresjon fra Skrivemesteren og øvingsoppgavene.</p>' +
        '</div>' +
        '<div class="ep-level-card">' +
          '<div class="ep-level-top"><strong>' + escapeHtml(String(totalXp)) + ' XP</strong><span>' + escapeHtml(sessionCount + ' økter') + '</span></div>' +
          '<div class="ep-level-bar"><span style="width:' + escapeHtml(String(levelProgress)) + '%"></span></div>' +
          '<div class="ep-level-meta"><span>' + escapeHtml(levelInfo.current.name) + '</span><span>' + escapeHtml(levelInfo.next ? (nextXp + ' XP til ' + levelInfo.next.name) : 'Høyeste nivå nådd') + '</span></div>' +
        '</div>' +
      '</section>' +
      '<section class="ep-grid ep-grid-kpis">' +
        kpiCard('Flyt', String(streak) + (streak === 1 ? ' dag' : ' dager'), 'Dager på rad') +
        kpiCard('Beste økt', String(bestPct) + ' %', 'Høyeste treffprosent') +
        kpiCard('Feillogg', String((mastery.feillogg || []).length), 'Oppgaver å ta opp igjen') +
        kpiCard('Siste analyse', recentAnalyses.length ? formatDate(recentAnalyses[0].ts, true) : '-', 'Oppgavetekst lagret lokalt') +
      '</section>' +
      '<section class="ep-grid ep-grid-main">' +
        '<article class="ep-panel"><div class="ep-panel-head"><h2>Styrker</h2><span>Det eleven treffer best på</span></div>' + statRows(strengths, 'Ingen styrkedata ennå. Kjør noen økter først.', 'ok') + '</article>' +
        '<article class="ep-panel"><div class="ep-panel-head"><h2>Svakheter</h2><span>Kategorier som bør prioriteres</span></div>' + statRows(weaknesses, 'Ingen svakhetsdata ennå.', 'warn') + '</article>' +
      '</section>' +
      '<section class="ep-panel">' +
        '<div class="ep-panel-head"><h2>Skrivemestring</h2><span>Vurdering fra analyserte tekster (1–6)</span></div>' +
        '<div class="ep-radar-wrap">' +
          (latestRadar ? buildRadarSvg(latestRadar, RADAR_CATEGORIES) : '<div class="ep-radar-empty">Radardiagrammet vises når tekster har blitt vurdert av analysetjenesten.</div>') +
        '</div>' +
      '</section>' +
      '<section class="ep-panel">' +
        '<div class="ep-panel-head"><h2>Dette bør du jobbe mer med</h2><span>Kombinerer siste oppgavetekst, feillogg og øvingshistorikk</span></div>' +
        '<div class="ep-reco-grid">' + recommendationRows(recommendations) + '</div>' +
      '</section>' +
      '<section class="ep-grid ep-grid-main">' +
        '<article class="ep-panel"><div class="ep-panel-head"><h2>Progresjon i Skrivemesteren</h2><span>De siste øktene med treffprosent og XP</span></div>' + historyBars(recentHistory) + '</article>' +
        '<article class="ep-panel"><div class="ep-panel-head"><h2>Siste oppgavetekster</h2><span>Analysehistorikk lagret fra Oppgavebanken</span></div>' + analysisCards(recentAnalyses) + '</article>' +
      '</section>';
  }

  window.NLBmProfile = {
    getAnalysisStore: getAnalysisStore,
    saveAnalysis: saveAnalysis,
    inferSuggestionsFromText: inferSuggestionsFromText,
    readLocalJson: readLocalJson,
    readMasteryData: readMasteryData,
    readAdaptiveProfile: readAdaptiveProfile,
    readAdaptiveHistory: readAdaptiveHistory,
    getCategoryLabel: getCategoryLabel,
    initScanPanel: initScanPanel,
    renderProfilePage: renderProfilePage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initScanPanel();
      renderProfilePage();
    });
  } else {
    initScanPanel();
    renderProfilePage();
  }
})();