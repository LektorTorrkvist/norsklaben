(function() {
  'use strict';

  var ANALYSIS_KEY = 'norsklaben-elevprofil-v1';
  var LEGACY_ANALYSIS_KEYS = ['norsklaben-elevprofil-nn-v1', 'norsklaben-elevprofil-bm-v1'];
  var RADAR_FILTER_KEY = 'norsklaben-radar-excluded-v1';

  function readRadarExcluded() {
    var arr = readLocalJson(RADAR_FILTER_KEY, []);
    return Array.isArray(arr) ? arr : [];
  }
  function writeRadarExcluded(list) {
    writeLocalJson(RADAR_FILTER_KEY, Array.isArray(list) ? list : []);
  }
  function toggleRadarAnalysis(ts, included) {
    var excluded = readRadarExcluded();
    var key = String(ts);
    var idx = excluded.indexOf(key);
    if (included) {
      if (idx !== -1) excluded.splice(idx, 1);
    } else {
      if (idx === -1) excluded.push(key);
    }
    writeRadarExcluded(excluded);
  }
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
    var cleaned = scores.map(function(v, i) {
      var n = Number(v);
      var minVal = (i === 5) ? 0 : 1; // Allow 0 for kjeldebruk (ikkje vurdert)
      if (isNaN(n) || n < minVal || n > 6) { valid = false; return 0; }
      return Math.round(n * 10) / 10;
    });
    return valid ? cleaned : null;
  }

  function buildRadarSvg(scores, labels, borrowedAxes) {
    borrowedAxes = Array.isArray(borrowedAxes) ? borrowedAxes : [];
    var cx = 200, cy = 200, maxR = 150, n = 6;
    function angle(i) { return -Math.PI / 2 + i * 2 * Math.PI / n; }
    function pt(i, r) { return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) }; }
    var svg = '<svg class="ep-radar-svg" viewBox="-60 -40 520 490" overflow="visible" xmlns="http://www.w3.org/2000/svg">';
    for (var ring = 1; ring <= 6; ring++) {
      var r = maxR * ring / 6;
      var pts = [];
      for (var i = 0; i < n; i++) { var p = pt(i, r); pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1)); }
      svg += '<polygon points="' + pts.join(' ') + '" fill="' + (ring % 2 === 0 ? 'rgba(200,131,42,.08)' : 'none') + '" stroke="#e6dfd2" stroke-width="1"/>';
    }
    for (var i = 0; i < n; i++) {
      var p = pt(i, maxR);
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p.x.toFixed(1) + '" y2="' + p.y.toFixed(1) + '" stroke="#cdbfa6" stroke-width="1"/>';
    }
    for (var ring = 1; ring <= 6; ring++) {
      svg += '<text x="' + (cx + 5) + '" y="' + (cy - maxR * ring / 6 + 12).toFixed(1) + '" font-size="10" fill="#c8a06a">' + ring + '</text>';
    }
    if (scores) {
      var dataPts = [];
      for (var i = 0; i < n; i++) {
        var val = Math.max(0, Math.min(6, scores[i] || 0));
        var p = pt(i, maxR * val / 6);
        dataPts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
      }
      svg += '<polygon points="' + dataPts.join(' ') + '" fill="rgba(200,131,42,.22)" stroke="#C8832A" stroke-width="2.5"/>';
      for (var i = 0; i < n; i++) {
        var val = Math.max(0, Math.min(6, scores[i] || 0));
        var p = pt(i, maxR * val / 6);
        var isBorrowed = borrowedAxes.indexOf(i) !== -1;
        if (isBorrowed) {
          svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5.5" fill="#fffdf8" stroke="#5A8E7A" stroke-width="2.5"/>';
          svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 9).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#5A8E7A">' + val.toFixed(1) + ' *</text>';
        } else {
          svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4.5" fill="#C8832A"/>';
          svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 8).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#7a4a10">' + val.toFixed(1) + '</text>';
        }
      }
    }
    var labelR = maxR + 18;
    for (var i = 0; i < n; i++) {
      var p = pt(i, labelR);
      var isBorrowed = borrowedAxes.indexOf(i) !== -1;
      var labelFill = isBorrowed ? '#5A8E7A' : '#1A3D2B';
      var labelText = labels[i] + (isBorrowed ? ' *' : '');
      var anchor = 'middle';
      if (p.x < cx - 10) anchor = 'end';
      else if (p.x > cx + 10) anchor = 'start';
      var dy = p.y < cy - 10 ? '-0.3em' : (p.y > cy + 10 ? '1.1em' : '0.35em');
      var spIdx = labelText.length > 16 ? labelText.lastIndexOf(' ', Math.floor(labelText.length / 2) + 2) : -1;
      if (spIdx > 0) {
        svg += '<text x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="11" font-weight="600" fill="' + labelFill + '"><tspan x="' + p.x.toFixed(1) + '" dy="' + dy + '">' + escapeHtml(labelText.substring(0, spIdx)) + '</tspan><tspan x="' + p.x.toFixed(1) + '" dy="1.2em">' + escapeHtml(labelText.substring(spIdx + 1)) + '</tspan></text>';
      } else {
        svg += '<text x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="11" font-weight="600" fill="' + labelFill + '" dy="' + dy + '">' + escapeHtml(labelText) + '</text>';
      }
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
    var primary = readLocalJson(ANALYSIS_KEY, defaultAnalysisStore());
    var store = primary && typeof primary === 'object' ? primary : defaultAnalysisStore();
    if (!Array.isArray(store.analyses)) store.analyses = [];
    // Slå saman med legacy-nøklar (per målform) for bakoverkompatibilitet.
    var combined = store.analyses.slice();
    LEGACY_ANALYSIS_KEYS.forEach(function(legacyKey) {
      var legacy = readLocalJson(legacyKey, null);
      if (legacy && Array.isArray(legacy.analyses)) {
        combined = combined.concat(legacy.analyses);
      }
    });
    var seen = {};
    store.analyses = combined.map(sanitizeAnalysisEntry).filter(function(item) {
      if (!(item.categories.length || item.textExcerpt)) return false;
      var key = item.ts + '|' + item.source + '|' + (item.title || '').slice(0, 40);
      if (seen[key]) return false;
      seen[key] = 1;
      return true;
    }).sort(function(a, b) {
      return (b.ts || '').localeCompare(a.ts || '');
    }).slice(0, ANALYSIS_LIMIT);
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

  function clearProfileData() {
    var keys = [
      ANALYSIS_KEY,
      'nl_ta_history_v1'
    ].concat(LEGACY_ANALYSIS_KEYS);
    keys.forEach(function(key) {
      try { window.localStorage.removeItem(key); } catch (e) {}
    });
  }

  // Berre skriveprofil-data: analysar frå Tekstsjekk + radar-filter. Rører ikkje XP, økter, feillogg.
  function clearSkriveprofilData() {
    var keys = [ANALYSIS_KEY, RADAR_FILTER_KEY, 'nl_ta_history_v1'].concat(LEGACY_ANALYSIS_KEYS);
    keys.forEach(function(key) {
      try { window.localStorage.removeItem(key); } catch (e) {}
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

  // Vekta tilrådingar: tekstanalyse=3, feillogg=2, øvingshistorikk=1.
  // Kategoriar i fleire kjelder får summert vekt.
  var SOURCE_LABELS = {
    tekstanalyse: 'Frå tekstanalyse',
    feillogg: 'Gjentekne feil',
    ovingshistorikk: 'Frå øvingshistorikk'
  };

  function buildRecommendations(categoryStats, analyses, feilloggCounts) {
    var latest = analyses[0] || null;
    var map = {};

    function ensure(id, label) {
      if (!map[id]) {
        map[id] = { id: id, label: label || getCategoryLabel(id), score: 0, sources: [], reasons: [] };
      }
      return map[id];
    }

    // Vekt 3 — kategori funnen i siste tekstanalyse
    if (latest && Array.isArray(latest.categories)) {
      latest.categories.forEach(function(item) {
        if (!item || !item.id) return;
        var entry = ensure(item.id, getCategoryLabel(item.id));
        entry.score += 3;
        if (entry.sources.indexOf('tekstanalyse') === -1) entry.sources.push('tekstanalyse');
        if (item.reason) entry.reasons.push('Frå siste tekstanalyse: ' + item.reason);
      });
    }

    // Vekt 2 — kategori funnen i feillogg
    Object.keys(feilloggCounts || {}).forEach(function(catId) {
      var count = feilloggCounts[catId];
      if (!count) return;
      var entry = ensure(catId);
      entry.score += 2;
      if (entry.sources.indexOf('feillogg') === -1) entry.sources.push('feillogg');
      entry.reasons.push(count + ' tidlegare feil i feilloggen.');
    });

    // Vekt 1 — kategori funnen i øvingshistorikk (låg treffprosent)
    categoryStats.filter(function(item) {
      return item.total > 0 && item.pct < 75;
    }).forEach(function(item) {
      var entry = ensure(item.id, item.label);
      entry.score += 1;
      if (entry.sources.indexOf('ovingshistorikk') === -1) entry.sources.push('ovingshistorikk');
      entry.reasons.push('Låg treffprosent i øvingsoppgåvene (' + item.pct + ' %).');
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
        '<a class="ob-btn ob-btn-primary" href="skrivemeisteren.html?kat=' + encodeURIComponent(item.id) + '&auto=1#nl-adaptive">Start i Skrivemeisteren</a>' +
        '<a class="ob-btn" href="tekstsjekk.html?kat=' + encodeURIComponent(item.id) + '&mode=manual">Sjå oppgåver</a>' +
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

    var excludedSet = {};
    readRadarExcluded().forEach(function(k) { excludedSet[String(k)] = true; });
    var includedAnalyses = analysisStore.analyses.filter(function(a) { return !excludedSet[String(a.ts)]; });
    var feilloggCounts = aggregateFeillogg(mastery.feillogg);
    var recommendations = buildRecommendations(categoryStats, includedAnalyses, feilloggCounts);
    var recentAnalyses = analysisStore.analyses.slice(0, 8);
    var recentHistory = adaptiveHistory.slice(-6);
    var radarSums = [0,0,0,0,0,0], radarCount = 0;
    var kildebrukSum = 0, kildebrukCount = 0;
    for (var ri = 0; ri < analysisStore.analyses.length; ri++) {
      var aItem = analysisStore.analyses[ri];
      var rs = aItem.radarScores;
      if (!rs) continue;
      if (excludedSet[String(aItem.ts)]) continue;
      var hasKildebruk = aItem.hasKildebruk !== undefined
        ? aItem.hasKildebruk
        : (/kjeld|kilde|tilvising|referans|kjeldeliste|kildeliste|i\s*f(?:ø|o)lgj?e|https?:\/\/|snl\.no|wikipedia|\(\s*\w+[^)]{0,40}\b(?:19|20)\d{2}\s*\)|\[[1-9]\d?\]/i.test(String(aItem.oppgaveExcerpt || '') + ' ' + String(aItem.textExcerpt || ''))
           || (Number(rs[5]) || 0) > 1);
      for (var rj = 0; rj < 5; rj++) radarSums[rj] += rs[rj];
      radarCount++;
      if (hasKildebruk) {
        kildebrukSum += rs[5];
        kildebrukCount++;
      }
    }
    var averageRadar = radarCount > 0 ? radarSums.slice(0, 5).map(function(s) { return Math.round(s / radarCount * 10) / 10; }).concat([kildebrukCount > 0 ? Math.round(kildebrukSum / kildebrukCount * 10) / 10 : 0]) : null;
    var kildebrukIsBorrowed = radarCount > 0 && kildebrukCount > 0 && kildebrukCount < radarCount;

    function buildRadarInsights(avg, analyses) {
      var totalAnalyses = (analyses || []).length;
      if (!avg) {
        return { strengths: [], weaknesses: [], totalAnalyses: totalAnalyses, hasRadar: false };
      }
      var axisDefs = [
        { idx: 0, label: 'Innhald' },
        { idx: 1, label: 'Struktur' },
        { idx: 2, label: 'Språk og stil' },
        { idx: 3, label: 'Rettskriving' },
        { idx: 4, label: 'Grammatikk og teiknsetting' },
        { idx: 5, label: 'Kjeldebruk' }
      ];
      var axes = axisDefs.map(function(d) {
        var note = '';
        if (d.idx === 5) {
          if (kildebrukCount === 0) return null; // ingen tekstar med kjeldekrav – hopp over
          if (kildebrukIsBorrowed) note = 'snitt frå ' + kildebrukCount + ' av ' + radarCount + ' tekstar';
          else note = 'snitt frå ' + kildebrukCount + ' tekst' + (kildebrukCount === 1 ? '' : 'ar');
        } else {
          note = 'snitt frå ' + radarCount + ' tekst' + (radarCount === 1 ? '' : 'ar');
        }
        return { label: d.label, score: avg[d.idx] || 0, note: note, isAxis: true };
      }).filter(Boolean).filter(function(a) { return a.score > 0; });

      var strengths = axes.slice().sort(function(a, b) { return b.score - a.score; }).slice(0, 3);
      var weaknesses = axes.slice().sort(function(a, b) { return a.score - b.score; }).slice(0, 3);

      // Aggregert AI-forslag (utviklingsområde) frå tekstanalysane.
      var forslagMap = {};
      (analyses || []).forEach(function(a) {
        var seen = {};
        (a && Array.isArray(a.categories) ? a.categories : []).forEach(function(cat) {
          if (!cat || !cat.id || seen[cat.id]) return;
          seen[cat.id] = true;
          if (!forslagMap[cat.id]) {
            forslagMap[cat.id] = { id: cat.id, label: getCategoryLabel(cat.id), hits: 0, reason: '' };
          }
          forslagMap[cat.id].hits += 1;
          if (!forslagMap[cat.id].reason && cat.reason) forslagMap[cat.id].reason = String(cat.reason);
        });
      });
      var forslag = Object.keys(forslagMap).map(function(k) { return forslagMap[k]; })
        .sort(function(a, b) { return b.hits - a.hits; })
        .slice(0, 3);

      return {
        strengths: strengths,
        weaknesses: weaknesses,
        forslag: forslag,
        totalAnalyses: totalAnalyses,
        hasRadar: true,
        radarCount: radarCount
      };
    }

    var insights = buildRadarInsights(averageRadar, includedAnalyses);
    var strengths = insights.strengths;
    var weaknesses = insights.weaknesses;

    // Velkomst-melding basert på mønster i data.
    var totalAnalyses = analysisStore.analyses.length;
    var welcomeTitle, welcomeText;
    if (totalAnalyses === 0 && sessionCount === 0) {
      welcomeTitle = 'Velkomen til elevprofilen din!';
      welcomeText = 'Her ser du framgangen din. Start med å øve i Skrivemeisteren eller få ein eigen tekst analysert i Tekstsjekk – så fyller profilen seg automatisk.';
    } else if (totalAnalyses === 0) {
      welcomeTitle = 'Godt jobba med øvingane!';
      welcomeText = 'Du har ' + sessionCount + ' øving' + (sessionCount === 1 ? '' : 'ar') + ' i Skrivemeisteren. Prøv Tekstsjekk neste gong du skriv – då får profilen din ein heilskapleg vurdering.';
    } else if (sessionCount === 0) {
      welcomeTitle = 'Fin start med Tekstsjekk!';
      welcomeText = 'Du har ' + totalAnalyses + ' analyserte tekst' + (totalAnalyses === 1 ? '' : 'ar') + '. Prøv Skrivemeisteren for øvingsoppgåver tilpassa svake punkt.';
    } else {
      welcomeTitle = 'Sterk innsats!';
      welcomeText = 'Du har ' + sessionCount + ' øving' + (sessionCount === 1 ? '' : 'ar') + ' og ' + totalAnalyses + ' analysert' + (totalAnalyses === 1 ? '' : 'e') + ' tekst' + (totalAnalyses === 1 ? '' : 'ar') + '. Hald fram – progresjonen er tydeleg i diagrammet under.';
    }

    function kpiCard(title, value, meta) {
      return '<article class="ep-kpi"><span class="ep-kpi-label">' + escapeHtml(title) + '</span><strong>' + escapeHtml(value) + '</strong><span class="ep-kpi-meta">' + escapeHtml(meta) + '</span></article>';
    }

    function statRows(list, emptyText, variant) {
      if (!list.length) return '<div class="ep-empty">' + escapeHtml(emptyText) + '</div>';
      return list.map(function(item) {
        if (item.isAxis) {
          var scoreText = (Math.round((item.score || 0) * 10) / 10).toFixed(1) + ' / 6';
          return '<div class="ep-stat-row ' + variant + '"><div><div class="ep-stat-row-label">' + escapeHtml(item.label) + '</div><div class="ep-stat-row-meta">' + escapeHtml(item.note || '') + '</div></div><span class="ep-stat-row-pct">' + escapeHtml(scoreText) + '</span></div>';
        }
        var hasTaskData = item.hasTaskData !== false && item.pct !== null;
        var meta = hasTaskData
          ? (item.hits + ' tekstanalysefunn · ' + item.total + ' oppgåver')
          : (item.hits + ' tekstanalysefunn · inga øvingsdata enno');
        var pctText = hasTaskData ? (item.pct + ' %') : '—';
        return '<div class="ep-stat-row ' + variant + '"><div><div class="ep-stat-row-label">' + escapeHtml(item.label) + '</div><div class="ep-stat-row-meta">' + escapeHtml(meta) + '</div></div><span class="ep-stat-row-pct">' + escapeHtml(pctText) + '</span></div>';
      }).join('');
    }

    function forslagRows(list) {
      if (!list || !list.length) return '';
      var rows = list.map(function(it) {
        var meta = it.hits + ' gjentaking' + (it.hits === 1 ? '' : 'ar') + ' i tekstanalysane' + (it.reason ? ' · ' + it.reason : '');
        return '<div class="ep-ai-strength">' + escapeHtml(getCategoryIcon(it.id) + ' ' + it.label) + '<span class="ep-ai-strength-meta">' + escapeHtml(meta) + '</span></div>';
      }).join('');
      return '<div class="ep-ai-strengths">' + rows + '</div>';
    }

    function aiStrengthRows(analyses) {
      var seen = {};
      var items = [];
      (analyses || []).forEach(function(a) {
        var arr = Array.isArray(a && a.strengths) ? a.strengths : [];
        arr.forEach(function(s) {
          var txt = String(s || '').trim();
          if (!txt) return;
          var key = txt.toLowerCase().slice(0, 80);
          if (seen[key]) return;
          seen[key] = true;
          items.push({ text: txt, ts: a.ts, title: a.title || '' });
        });
      });
      if (!items.length) return '';
      var top = items.slice(0, 4);
      var rows = top.map(function(it) {
        var meta = (it.title ? escapeHtml(it.title) + ' · ' : '') + escapeHtml(formatDate(it.ts));
        return '<div class="ep-ai-strength">' + escapeHtml(it.text) + '<span class="ep-ai-strength-meta">' + meta + '</span></div>';
      }).join('');
      return '<div class="ep-ai-strengths"><p class="ep-ai-strengths-title">Frå tekstanalysane dine</p>' + rows + '</div>';
    }

    function recommendationRows(list) {
      if (!list.length) return '<div class="ep-empty">Ingen tydelege tilrådingar enno. Lim inn ein oppgåvetekst eller fullfør nokre økter først.</div>';
      return list.map(function(item) {
        var src = (item.sources || []);
        var primarySrc = src.indexOf('tekstanalyse') !== -1 ? 'analyse' : (src.indexOf('feillogg') !== -1 ? 'feillogg' : 'historikk');
        var sourceText = primarySrc === 'analyse' ? 'Frå tekstanalyse' : (primarySrc === 'feillogg' ? 'Gjentekne feil' : 'Frå øvingshistorikk');
        return '' +
          '<article class="ep-reco src-' + primarySrc + '">' +
            '<div class="ep-reco-top"><div class="ep-reco-title">' + escapeHtml(getCategoryIcon(item.id) + ' ' + item.label) + '</div><span class="ep-reco-source ' + primarySrc + '">' + sourceText + '</span></div>' +
            '<div class="ep-reco-desc">' + escapeHtml(item.reasons[0] || 'Bygg vidare på denne kategorien.') + '</div>' +
            '<a class="ep-reco-btn" href="skrivemeisteren.html?kat=' + encodeURIComponent(item.id) + '&auto=1#nl-adaptive">Start øving</a>' +
          '</article>';
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
        var hasRadar = !!item.radarScores;
        var included = hasRadar && !excludedSet[String(item.ts)];
        var stateClass = !hasRadar ? 'is-noradar' : (included ? 'is-included' : 'is-excluded');
        var checkbox = hasRadar
          ? '<label class="ep-radar-toggle" title="Tel med i radarsnittet"><input type="checkbox" data-ep-radar-toggle="' + escapeHtml(String(item.ts)) + '"' + (included ? ' checked' : '') + '> <span>' + (included ? 'Tel med i radar' : 'Hak av for radar') + '</span></label>'
          : '<span class="ep-radar-toggle-disabled" title="Denne teksten har ikkje radarvurdering enno">⚠︎ Inga radarvurdering</span>';
        return '<article class="ep-analysis ' + stateClass + '"><div class="ep-analysis-top"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(formatDate(item.ts)) + '</span></div><p>' + escapeHtml(item.textExcerpt || '') + '</p><div class="ep-chip-row">' + chips + '</div><div class="ep-analysis-foot">' + checkbox + '</div></article>';
      }).join('');
    }

    var zoneGame = document.getElementById('ep-zone-game');
    var zoneWriting = document.getElementById('ep-zone-writing');
    var zoneReco = document.getElementById('ep-zone-reco');
    var zoneHistory = document.getElementById('ep-zone-history');
    if (!zoneGame || !zoneWriting || !zoneReco || !zoneHistory) {
      root.innerHTML = '<p class="ep-loading">Manglar sonestruktur for elevprofil.</p>';
      return;
    }

    zoneGame.innerHTML = '' +
      '<div class="ep-game">' +
        '<div class="ep-game-level">' +
          '<div class="ep-game-level-top"><span class="ep-game-icon">' + escapeHtml(levelInfo.current.icon) + '</span><span class="ep-game-level-name">' + escapeHtml(levelInfo.current.name) + '</span><span class="ep-game-level-num">Nivå ' + escapeHtml(String(levelInfo.current.level)) + '</span></div>' +
          '<div class="ep-game-bar-wrap"><div class="ep-game-bar-fill" style="width:' + escapeHtml(String(levelProgress)) + '%"></div></div>' +
          '<div class="ep-game-bar-label">' + escapeHtml(String(totalXp)) + ' XP · ' + escapeHtml(levelInfo.next ? (nextXp + ' XP att til ' + levelInfo.next.name) : 'Høgaste nivå nådd') + '</div>' +
        '</div>' +
        '<div class="ep-game-kpis">' +
          '<div class="ep-game-kpi"><div class="ep-game-kpi-icon">🔥</div><div class="ep-game-kpi-val">' + escapeHtml(String(streak)) + '</div><div class="ep-game-kpi-lbl">Dagar på rad</div></div>' +
          '<div class="ep-game-kpi"><div class="ep-game-kpi-icon">🏆</div><div class="ep-game-kpi-val">' + escapeHtml(String(bestPct)) + ' %</div><div class="ep-game-kpi-lbl">Beste økt</div></div>' +
          '<div class="ep-game-kpi"><div class="ep-game-kpi-icon">🎯</div><div class="ep-game-kpi-val">' + escapeHtml(sessionCount + '') + '</div><div class="ep-game-kpi-lbl">Økter</div></div>' +
          '<div class="ep-game-kpi"><div class="ep-game-kpi-icon">📋</div><div class="ep-game-kpi-val">' + escapeHtml(String((mastery.feillogg || []).length)) + '</div><div class="ep-game-kpi-lbl">I feillogg</div></div>' +
        '</div>' +
      '</div>';

    zoneWriting.innerHTML = '' +
      '<div class="ep-welcome-mini"><span class="ep-welcome-mini-icon">👋</span><span class="ep-welcome-mini-copy"><strong>' + escapeHtml(welcomeTitle) + '</strong> ' + escapeHtml(welcomeText) + '</span></div>' +
      '<div class="ep-writing">' +
        '<div class="ep-radar-card">' +
          '<div class="ep-panel-title">Skrivemeistring</div>' +
          '<div class="ep-panel-meta">Radardiagrammet vurderar skrivekompetansen din som ein streng sensor på norskeksamen.</div>' +
          '<div class="ep-panel-sub">Snitt av ' + escapeHtml(String(radarCount)) + ' vurdert' + (radarCount === 1 ? '' : 'e') + ' tekst' + (radarCount === 1 ? '' : 'ar') + ' (1–6)</div>' +
          (averageRadar ? buildRadarSvg(averageRadar, RADAR_CATEGORIES, kildebrukIsBorrowed ? [5] : []) + (kildebrukIsBorrowed ? '<div class="ep-radar-note">* Kjeldebruk: snittet er rekna ut frå ' + kildebrukCount + ' av ' + radarCount + ' tekstar. Tekstar utan krav til kjeldebruk (t.d. forteljingar) er haldne utanfor, slik at aksen ikkje blir trekt ned av irrelevant data.</div>' : '') : '<div class="ep-radar-empty">Radardiagrammet kjem når tekstar har blitt vurderte i Tekstsjekk.</div>') +
        '</div>' +
        '<div class="ep-strengths-weak">' +
          '<div class="ep-sw-panel"><div class="ep-sw-head"><div class="ep-sw-head-text"><h3>Styrkar</h3><span>Dei tre høgaste aksane i radardiagrammet – snitt frå tekstanalysane.</span></div><span class="ep-sw-icon">🌟</span></div>' + statRows(strengths, 'Ingen styrkedata enno. Få ein tekst vurdert i Tekstsjekk først.', 'ok') + aiStrengthRows(includedAnalyses) + '</div>' +
          '<div class="ep-sw-panel"><div class="ep-sw-head"><div class="ep-sw-head-text"><h3>Svakheiter</h3><span>Dei tre lågaste aksane i radardiagrammet – det er mest å hente på.</span></div><span class="ep-sw-icon">🎯</span></div>' + statRows(weaknesses, 'Ingen svakheitsdata enno. Få ein tekst vurdert i Tekstsjekk først.', 'warn') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ep-sp-actions"><button type="button" class="ep-btn-ghost" data-ep-reset-skriveprofil="1">Tilbakestill skriveprofil</button><span class="ep-sp-actions-hint">Slettar berre tekstanalysane og radarvalet på denne eininga. XP, økter og feillogg blir tatt vare på.</span></div>';

    zoneReco.innerHTML = '' +
      '<div class="ep-reco-grid">' + recommendationRows(recommendations) + '</div>';

    zoneHistory.innerHTML = '' +
      '<div class="ep-history">' +
        '<div class="ep-hist-panel"><div class="ep-panel-title">Progresjon i Skrivemeisteren</div><div class="ep-panel-sub">Dei siste seks øktene</div>' + historyBars(recentHistory) + '</div>' +
        '<div class="ep-hist-panel ep-hist-analyses"><div class="ep-panel-title">Siste tekstanalysar</div><div class="ep-panel-sub">Hak av kva tekstar som skal vise i Skriveprofilen</div><div class="ep-analysis-list">' + analysisCards(recentAnalyses) + '</div></div>' +
      '</div>';

    var resetBtn = root.querySelector('[data-ep-reset-skriveprofil="1"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        var ok = window.confirm('Tilbakestille skriveprofilen? Dette slettar alle lagra tekstanalysar og radarvalet på denne eininga. XP, økter og feillogg blir ikkje rørt.');
        if (!ok) return;
        clearSkriveprofilData();
        renderProfilePage();
      });
    }

    // Avmerkingsboksar for radarsnittet — togglar inkludering og re-rendrar.
    root.querySelectorAll('[data-ep-radar-toggle]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        toggleRadarAnalysis(cb.getAttribute('data-ep-radar-toggle'), cb.checked);
        renderProfilePage();
      });
    });
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
      // initScanPanel() er deaktivert: Hetzner-widget (tekstanalyse.js) eig #ob-ai-scan no.
      renderProfilePage();
    });
  } else {
    renderProfilePage();
  }
})();