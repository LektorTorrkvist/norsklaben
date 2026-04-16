(function() {
  'use strict';

  var ANALYSIS_KEY = 'norsklaben-elevprofil-nn-v1';
  var ADAPTIVE_PROFILE_KEY = 'norsklaben-adaptive-profile-v1';
  var ADAPTIVE_HISTORY_KEY = 'norsklaben-adaptive-history-v1';
  var MT_SHARED_KEY = 'nlMestring';
  var MT_BACKUP_KEY = 'nlMestring_backup';
  var MT_LEGACY_KEY = 'nlMestringBM';
  var ANALYSIS_LIMIT = 24;

  var XP_LEVELS = [
    { name: 'Ordlærling',        xp: 0,     icon: '🌱' },
    { name: 'Bokstavjegar',      xp: 30,    icon: '🔍' },
    { name: 'Setningssmed',      xp: 80,    icon: '🔨' },
    { name: 'Ordkunstnar',       xp: 150,   icon: '🖌️' },
    { name: 'Tekstbyggjar',      xp: 250,   icon: '🏗️' },
    { name: 'Avsnittsarkitekt',  xp: 380,   icon: '📐' },
    { name: 'Grammatikksnekkar', xp: 500,   icon: '⚙️' },
    { name: 'Kommakommandør',    xp: 650,   icon: '✏️' },
    { name: 'Ordklassemeister',  xp: 800,   icon: '🏷️' },
    { name: 'Setningssamlar',    xp: 1000,  icon: '🧱' },
    { name: 'Språkmeister',      xp: 1200,  icon: '🏆' },
    { name: 'Tekstsmed',         xp: 1500,  icon: '⚒️' },
    { name: 'Ordformidlar',      xp: 1800,  icon: '💬' },
    { name: 'Stilmeister',       xp: 2200,  icon: '🎭' },
    { name: 'Norskentusiast',    xp: 2600,  icon: '📚' },
    { name: 'Tekstanalytikar',   xp: 3100,  icon: '🔬' },
    { name: 'Sjangerkjennar',    xp: 3700,  icon: '📝' },
    { name: 'Argumentator',      xp: 4400,  icon: '💡' },
    { name: 'Kjeldeforskar',     xp: 5200,  icon: '📖' },
    { name: 'Retorikksnekkar',   xp: 6100,  icon: '🗣️' },
    { name: 'Ordpoet',           xp: 7200,  icon: '🖋️' },
    { name: 'Litteraturnerd',    xp: 8500,  icon: '📕' },
    { name: 'Språkvaktar',       xp: 10000, icon: '🛡️' },
    { name: 'Skrivekunstnar',    xp: 11800, icon: '🎨' },
    { name: 'Tekstmeister',      xp: 13800, icon: '🏅' },
    { name: 'Norskmeister',      xp: 16000, icon: '👑' },
    { name: 'Språkfilosof',      xp: 18500, icon: '🧠' },
    { name: 'Ordlegende',        xp: 21500, icon: '⭐' },
    { name: 'Norskprofessor',    xp: 25000, icon: '🎓' },
    { name: 'Stormeister',       xp: 30000, icon: '💎' }
  ];

  var CATEGORY_META = {
    djupneoppgaver: { label: 'Djupneoppgåver', icon: '🧠' },
    og_aa: { label: 'Og / å', icon: '✏️' },
    sammensatt: { label: 'Samansette ord', icon: '🔗' },
    dobbel_konsonant: { label: 'Dobbel konsonant', icon: '🔤' },
    kj_skj: { label: 'Kj / skj', icon: '👅' },
    tegnsetting: { label: 'Teiknsetjing', icon: '❗' },
    ordklasser: { label: 'Ordklassar', icon: '🏷️' },
    setningsbygging: { label: 'Setningsbygging', icon: '🧱' },
    bindeord: { label: 'Bindeord', icon: '🔗' },
    tekststruktur: { label: 'Tekststruktur', icon: '📄' },
    kildebruk: { label: 'Kjeldebruk', icon: '📖' },
    oppgavetolking: { label: 'Forstå oppgåva', icon: '🎯' },
    spraak_stil: { label: 'Språk og stil', icon: '🎨' },
    aarsak_sammenheng: { label: 'Årsak og samanheng', icon: '🔀' },
    referansekjede: { label: 'Referansekjede', icon: '🔁' },
    logisk_struktur: { label: 'Logisk struktur', icon: '🧩' },
    sjangerkompetanse: { label: 'Sjangerkompetanse', icon: '📝' },
    fagartikkel: { label: 'Fagartikkel', icon: '📰' },
    debattinnlegg: { label: 'Debattinnlegg', icon: '💬' },
    overskrift_ingress: { label: 'Overskrift og ingress', icon: '🗞️' },
    novelle: { label: 'Novelle', icon: '📕' },
    parafrase: { label: 'Parafrase', icon: '🔄' },
    sitat: { label: 'Sitat', icon: '💎' },
    tal_og_statistikk: { label: 'Tal og statistikk', icon: '📊' },
    ordval: { label: 'Ordval', icon: '💡' },
    bruke_eksempel: { label: 'Bruke døme', icon: '📌' },
    tilpass_til_lesaran: { label: 'Tilpass til lesaren', icon: '👥' },
    tilpass_til_lesaren: { label: 'Tilpass til lesaren', icon: '👥' }
  };

  var ANALYSIS_RULES = [
    { id: 'oppgavetolking', keywords: ['drøft', 'diskuter', 'samanlikn', 'analyser', 'tolk', 'gjer greie for', 'reflekter'], reason: 'Oppgåveteksten bruker styringsord som krev sikker oppgåvetolking.' },
    { id: 'fagartikkel', keywords: ['fagartikkel', 'artikkel', 'saktekst'], reason: 'Oppgåva peikar mot fagartikkel eller annan sakprega skriving.' },
    { id: 'debattinnlegg', keywords: ['debattinnlegg', 'lesarinnlegg', 'argumenter', 'argumenterande', 'overtyde'], reason: 'Oppgåva legg opp til argumentasjon og tydeleg standpunkt.' },
    { id: 'novelle', keywords: ['novelle', 'forteljing', 'skjønnlitterær', 'personskildring', 'miljøskildring'], reason: 'Oppgåva handlar om kreativ eller skjønnlitterær skriving.' },
    { id: 'tekststruktur', keywords: ['innleiing', 'hovuddel', 'avslutning', 'avsnitt', 'struktur', 'disposisjon'], reason: 'Oppgåva nemner struktur, avsnitt eller oppbygging.' },
    { id: 'overskrift_ingress', keywords: ['overskrift', 'ingress'], reason: 'Oppgåva nemner overskrift eller ingress direkte.' },
    { id: 'kildebruk', keywords: ['kjelde', 'kjelder', 'kjeldeliste', 'tilvising', 'kjeldetilvising', 'bruk kjelder'], reason: 'Oppgåva krev medviten bruk av kjelder.' },
    { id: 'parafrase', keywords: ['parafrase', 'med eigne ord', 'omskriv'], reason: 'Oppgåva krev at eleven omformulerer stoff med eigne ord.' },
    { id: 'sitat', keywords: ['sitat', 'siter', 'direkte sitat'], reason: 'Oppgåva krev presis bruk av sitat.' },
    { id: 'tal_og_statistikk', keywords: ['statistikk', 'diagram', 'tabell', 'prosent', 'talmateriale'], reason: 'Oppgåva trekkjer inn talmateriale eller statistikk.' },
    { id: 'ordval', keywords: ['presist språk', 'fagspråk', 'variert språk', 'ordval', 'presise ord'], reason: 'Oppgåva krev presist og medvite ordval.' },
    { id: 'bruke_eksempel', keywords: ['døme', 'konkretiser', 'vis med døme'], reason: 'Oppgåva ventar at eleven underbyggjer med døme.' },
    { id: 'tilpass_til_lesaran', keywords: ['målgruppe', 'lesar', 'mottakar', 'tilpass språket'], reason: 'Oppgåva peikar mot mottakarmedvit og tilpassing til lesar.' },
    { id: 'sjangerkompetanse', keywords: ['sjanger', 'register', 'formell', 'uformell'], reason: 'Oppgåva stiller krav til sjangerforståing eller register.' },
    { id: 'spraak_stil', keywords: ['språk og stil', 'språkbruk', 'stil', 'tone'], reason: 'Oppgåva krev medviten stil og språkføring.' },
    { id: 'aarsak_sammenheng', keywords: ['årsak', 'verknad', 'konsekvens', 'derfor', 'fordi'], reason: 'Oppgåva handlar om å forklare samanhengar og konsekvensar.' },
    { id: 'bindeord', keywords: ['samanheng', 'bindeord', 'for det første', 'dessutan'], reason: 'Oppgåva krev samanheng og gode overgangar.' }
  ];

  var RADAR_CATEGORIES = ['Innhald', 'Struktur', 'Språk og stil', 'Rettskriving', 'Grammatikk og teiknsetting', 'Kjeldebruk'];

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
    try { return JSON.parse(raw); } catch (e) { return fallback; }
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
    return { version: 1, updatedAt: '', analyses: [] };
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
    if (!firstLine) return 'Oppgåvetekst';
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
    var categories = Array.isArray(entry && entry.categories) ? entry.categories.map(sanitizeCategory).filter(Boolean) : [];
    var radarScores = sanitizeRadarScores(entry && entry.radarScores);
    return {
      ts: String((entry && entry.ts) || new Date().toISOString()),
      title: String((entry && entry.title) || buildAnalysisTitle(text)).trim(),
      textExcerpt: text.slice(0, 280),
      source: String((entry && entry.source) || 'oppgavebank-nn').trim(),
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

    var ranked = Object.keys(scores).map(function(key) { return scores[key]; }).sort(function(a, b) {
      return b.score - a.score;
    });

    if (!ranked.length) {
      ranked = [
        { id: 'oppgavetolking', label: getCategoryLabel('oppgavetolking'), score: 10, reason: 'Start med å avklare kva oppgåva faktisk krev.' },
        { id: 'tekststruktur', label: getCategoryLabel('tekststruktur'), score: 9, reason: 'Dei fleste oppgåvetekstar blir lettare å løyse med tydeleg struktur.' },
        { id: 'ordval', label: getCategoryLabel('ordval'), score: 8, reason: 'Presist ordval hjelper eleven med å svare meir treffsikkert.' }
      ];
    }

    return ranked.slice(0, 4);
  }

  function formatDate(ts, shortMode) {
    var date = ts ? new Date(ts) : new Date();
    if (isNaN(date.getTime())) return '-';
    if (shortMode) return date.toLocaleDateString('nn-NO', { day: '2-digit', month: '2-digit' });
    return date.toLocaleString('nn-NO', {
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
        if (!stats[catId]) stats[catId] = { id: catId, label: getCategoryLabel(catId), rett: 0, feil: 0, total: 0, pct: 0 };
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
      map[item.id].reasons.push('Låg treffprosent i øvingsoppgåvene (' + item.pct + ' %).');
    });

    if (latest && Array.isArray(latest.categories)) {
      latest.categories.forEach(function(item) {
        if (!item || !item.id) return;
        map[item.id] = map[item.id] || { id: item.id, label: getCategoryLabel(item.id), score: 0, reasons: [] };
        map[item.id].score += 5;
        if (item.reason) map[item.id].reasons.push('Siste oppgåvetekst: ' + item.reason);
      });
    }

    Object.keys(feilloggCounts || {}).forEach(function(catId) {
      var count = feilloggCounts[catId];
      if (!count) return;
      map[catId] = map[catId] || { id: catId, label: getCategoryLabel(catId), score: 0, reasons: [] };
      map[catId].score += Math.min(4, count);
      map[catId].reasons.push(count + ' tidlegare feil i feilloggen.');
    });

    return Object.keys(map).map(function(catId) { return map[catId]; }).sort(function(a, b) {
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
      return '<article class="ob-ai-result">' +
        '<div class="ob-ai-result-top"><span class="ob-ai-badge">' + escapeHtml(getCategoryIcon(item.id)) + ' ' + escapeHtml(item.label) + '</span></div>' +
        '<p>' + escapeHtml(item.reason) + '</p>' +
        '<div class="ob-ai-result-actions">' +
        '<a class="ob-btn ob-btn-primary" href="skrivelab.html?kat=' + encodeURIComponent(item.id) + '">Start i Skrivemeisteren</a>' +
        '<a class="ob-btn" href="oppgavebank.html?kat=' + encodeURIComponent(item.id) + '&mode=manual">Sjå oppgåver</a>' +
        '</div>' +
        '</article>';
    }).join('');
    resultsEl.innerHTML = '<div class="ob-ai-summary"><strong>Forslaga er lagra i elevprofilen.</strong><span>Sist lagra: ' + escapeHtml(formatDate(savedEntry.ts)) + '</span></div><div class="ob-ai-result-grid">' + cards + '</div>';
    if (statusEl) {
      statusEl.textContent = text.trim() ? 'Oppgåveteksten er lagra lokalt i denne nettlesaren og brukt i elevprofilen.' : 'Forslaga er lagra i elevprofilen.';
    }
  }

  function initScanPanel() {
    var panel = document.getElementById('ob-ai-scan');
    if (!panel || panel.dataset.profileReady === '1') return;
    panel.dataset.profileReady = '1';
    panel.innerHTML = '<div class="ob-ai-headline"><div class="ob-ai-icon">🤖</div><div><h3>Tekstskanning og elevprofil</h3><p>Lim inn oppgåveteksten, få forslag til øvingskategoriar og lagre tilrådingane lokalt til elevprofilen.</p></div></div><label class="ob-ai-label" for="ob-ai-text">Oppgåvetekst</label><textarea id="ob-ai-text" class="ob-ai-text" placeholder="Lim inn oppgåveteksten her..."></textarea><div class="ob-ai-actions"><button type="button" class="ob-btn ob-btn-primary" id="ob-ai-run">Få forslag og lagre</button><a class="ob-btn" href="elevprofil.html">Opne elevprofil</a></div><p class="ob-ai-status" id="ob-ai-status">Data blir berre lagra lokalt i nettlesaren på denne eininga.</p><div class="ob-ai-results" id="ob-ai-results"></div>';
    var textEl = document.getElementById('ob-ai-text');
    var runBtn = document.getElementById('ob-ai-run');
    var statusEl = document.getElementById('ob-ai-status');
    var resultsEl = document.getElementById('ob-ai-results');
    var lastAnalysis = getAnalysisStore().analyses[0];
    if (lastAnalysis && statusEl) statusEl.textContent = 'Siste lagra analyse: ' + formatDate(lastAnalysis.ts) + '.';
    if (!runBtn) return;
    runBtn.addEventListener('click', function() {
      var text = textEl ? String(textEl.value || '') : '';
      if (!text.trim()) {
        if (statusEl) statusEl.textContent = 'Lim inn ein oppgåvetekst først.';
        if (resultsEl) resultsEl.innerHTML = '';
        return;
      }
      var suggestions = inferSuggestionsFromText(text);
      var savedEntry = saveAnalysis({ ts: new Date().toISOString(), title: buildAnalysisTitle(text), textExcerpt: text, source: 'oppgavebank-nn', categories: suggestions });
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
    var bestPct = Math.max(adaptiveProfile.bestPct || 0, adaptiveHistory.reduce(function(max, item) { return Math.max(max, item.pct || 0); }, 0));
    var streak = mastery.streak.current || adaptiveProfile.streak || 0;
    var categoryStats = getCategoryStats(mastery);
    var strengths = categoryStats.filter(function(item) { return item.total > 0; }).sort(function(a, b) { if (b.pct !== a.pct) return b.pct - a.pct; return b.total - a.total; }).slice(0, 3);
    var weaknesses = categoryStats.filter(function(item) { return item.total > 0; }).sort(function(a, b) { if (a.pct !== b.pct) return a.pct - b.pct; return b.total - a.total; }).slice(0, 3);
    var feilloggCounts = aggregateFeillogg(mastery.feillogg);
    var recommendations = buildRecommendations(categoryStats, analysisStore.analyses, feilloggCounts);
    var recentAnalyses = analysisStore.analyses.slice(0, 4);
    var recentHistory = adaptiveHistory.slice(-6);
    var radarSums = [0,0,0,0,0,0], radarCount = 0;
    for (var ri = 0; ri < analysisStore.analyses.length; ri++) {
      var rs = analysisStore.analyses[ri].radarScores;
      if (rs) {
        for (var rj = 0; rj < 6; rj++) radarSums[rj] += rs[rj];
        radarCount++;
      }
    }
    var averageRadar = radarCount > 0 ? radarSums.map(function(s) { return Math.round(s / radarCount * 10) / 10; }) : null;

    function kpiCard(title, value, meta) {
      return '<article class="ep-kpi"><span class="ep-kpi-label">' + escapeHtml(title) + '</span><strong>' + escapeHtml(value) + '</strong><span class="ep-kpi-meta">' + escapeHtml(meta) + '</span></article>';
    }

    function statRows(list, emptyText, variant) {
      if (!list.length) return '<div class="ep-empty">' + escapeHtml(emptyText) + '</div>';
      return list.map(function(item) {
        return '<div class="ep-stat-row ' + variant + '"><div><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.total + ' oppgåver') + '</span></div><span>' + escapeHtml(item.pct + ' %') + '</span></div>';
      }).join('');
    }

    function recommendationRows(list) {
      if (!list.length) return '<div class="ep-empty">Ingen tydelege tilrådingar enno. Lim inn ein oppgåvetekst eller fullfør nokre økter først.</div>';
      return list.map(function(item) {
        return '<article class="ep-reco"><div class="ep-reco-top"><span class="ep-chip">' + escapeHtml(getCategoryIcon(item.id)) + ' ' + escapeHtml(item.label) + '</span><span class="ep-reco-score">Prioritet ' + escapeHtml(String(item.score)) + '</span></div><p>' + escapeHtml(item.reasons[0] || 'Bygg vidare på denne kategorien.') + '</p><div class="ep-reco-actions"><a class="ep-btn ep-btn-pri" href="skrivelab.html?kat=' + encodeURIComponent(item.id) + '">Øv i Skrivemeisteren</a><a class="ep-btn" href="oppgavebank.html?kat=' + encodeURIComponent(item.id) + '&mode=manual">Sjå oppgåver</a></div></article>';
      }).join('');
    }

    function historyBars(list) {
      if (!list.length) return '<div class="ep-empty">Progresjon blir vist her etter at du har fullført økter i Skrivemeisteren.</div>';
      return '<div class="ep-bars">' + list.map(function(item) {
        var height = Math.max(18, item.pct);
        return '<div class="ep-bar-col"><span class="ep-bar" style="height:' + height + '%"></span><strong>' + escapeHtml(String(item.pct)) + ' %</strong><small>' + escapeHtml(formatDate(item.ts, true)) + '</small><small>+' + escapeHtml(String(item.xp)) + ' XP</small></div>';
      }).join('') + '</div>';
    }

    function analysisCards(list) {
      if (!list.length) return '<div class="ep-empty">Ingen oppgåvetekstar er lagra enno.</div>';
      return list.map(function(item) {
        var chips = (item.categories || []).slice(0, 3).map(function(cat) {
          return '<span class="ep-chip muted">' + escapeHtml(cat.label) + '</span>';
        }).join('');
        return '<article class="ep-analysis"><div class="ep-analysis-top"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(formatDate(item.ts)) + '</span></div><p>' + escapeHtml(item.textExcerpt || '') + '</p><div class="ep-chip-row">' + chips + '</div></article>';
      }).join('');
    }

    root.innerHTML = '<section class="ep-hero-card"><div class="ep-hero-copy"><span class="ep-kicker">Lokal elevprofil</span><h1>' + escapeHtml(levelInfo.current.icon + ' ' + levelInfo.current.name) + '</h1><p>Profilen byggjer på oppgåvetekstar som er limte inn i Oppgåvebanken, pluss faktisk progresjon frå Skrivemeisteren og øvingsoppgåvene.</p></div><div class="ep-level-card"><div class="ep-level-top"><strong>' + escapeHtml(String(totalXp)) + ' XP</strong><span>' + escapeHtml(sessionCount + ' økter') + '</span></div><div class="ep-level-bar"><span style="width:' + escapeHtml(String(levelProgress)) + '%"></span></div><div class="ep-level-meta"><span>' + escapeHtml(levelInfo.current.name) + '</span><span>' + escapeHtml(levelInfo.next ? (nextXp + ' XP til ' + levelInfo.next.name) : 'Høgaste nivå nådd') + '</span></div></div></section><section class="ep-grid ep-grid-kpis">' + kpiCard('Flyt', String(streak) + (streak === 1 ? ' dag' : ' dagar'), 'Dagar på rad') + kpiCard('Beste økt', String(bestPct) + ' %', 'Høgaste treffprosent') + kpiCard('Feillogg', String((mastery.feillogg || []).length), 'Oppgåver å ta opp att') + kpiCard('Siste analyse', recentAnalyses.length ? formatDate(recentAnalyses[0].ts, true) : '-', 'Oppgåvetekst lagra lokalt') + '</section><section class="ep-grid ep-grid-main"><article class="ep-panel"><div class="ep-panel-head"><h2>Styrkar</h2><span>Det eleven treff best på</span></div>' + statRows(strengths, 'Ingen styrkedata enno. Køyr nokre økter først.', 'ok') + '</article><article class="ep-panel"><div class="ep-panel-head"><h2>Svakheiter</h2><span>Kategoriar som bør prioriterast</span></div>' + statRows(weaknesses, 'Ingen svakheitsdata enno.', 'warn') + '</article></section><section class="ep-panel"><div class="ep-panel-head"><h2>Skrivemeistring</h2><span>Snitt av ' + escapeHtml(String(radarCount)) + ' vurdert' + (radarCount === 1 ? '' : 'e') + ' tekst' + (radarCount === 1 ? '' : 'ar') + ' (1–6)</span></div><div class="ep-radar-wrap">' + (averageRadar ? buildRadarSvg(averageRadar, RADAR_CATEGORIES) : '<div class="ep-radar-empty">Radardiagrammet kjem når tekstar har blitt vurderte av analysetenesta.</div>') + '</div></section><section class="ep-panel"><div class="ep-panel-head"><h2>Dette bør du jobbe meir med</h2><span>Kombinerer siste oppgåvetekst, feillogg og øvingshistorikk</span></div><div class="ep-reco-grid">' + recommendationRows(recommendations) + '</div></section><section class="ep-grid ep-grid-main"><article class="ep-panel"><div class="ep-panel-head"><h2>Progresjon i Skrivemeisteren</h2><span>Dei siste øktene med treffprosent og XP</span></div>' + historyBars(recentHistory) + '</article><article class="ep-panel"><div class="ep-panel-head"><h2>Siste oppgåvetekstar</h2><span>Analysehistorikk lagra frå Oppgåvebanken</span></div>' + analysisCards(recentAnalyses) + '</article></section>';
  }

  window.NLProfile = {
    getAnalysisStore: getAnalysisStore,
    saveAnalysis: saveAnalysis,
    inferSuggestionsFromText: inferSuggestionsFromText,
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