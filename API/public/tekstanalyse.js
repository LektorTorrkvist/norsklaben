/* ══════════════════════════════════════════════════════
  tekstanalyse.js – Norsklaben Elevprofil-widget
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
    if (location.protocol === 'http:' && (h === 'localhost' || h === '127.0.0.1')) return 'http://localhost:3000';
    return 'https://api.norsklaben.no';
  }
  var API_BASE =
    (typeof window !== 'undefined' && window.NL_API_BASE) ||
    (SRC ? SRC.replace(/\/[^\/]*$/, '') : defaultApiBase());
  var STORAGE_KEY = 'nl_ta_history_v1';
  var ELEVPROFIL_KEY = 'norsklaben-elevprofil-v1';
  var ELEVPROFIL_LEGACY_KEYS = ['norsklaben-elevprofil-nn-v1', 'norsklaben-elevprofil-bm-v1'];
  var ELEVPROFIL_LIMIT = 24;
  var MAX_HISTORY = 15;

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
    title: 'Elevprofil',
    intro: 'Lim inn den siste teksten du har levert. Du får en grundig analyse, en elevprofil og konkrete oppgaver å øve på.',
    maalLabel: 'Målform',
    sjangerLabel: 'Sjanger',
    sjangerPlaceholder: 'Velg sjanger (valgfritt)',
    oppgaveLabel: 'Oppgavetekst (valgfritt, men anbefalt)',
    oppgavePlaceholder: 'Lim inn oppgaveteksten du fikk – da kan AI-en vurdere om innholdet treffer.',
    oppgaveHint: 'Uten oppgavetekst settes innhold til maks 4 av 6 i radardiagrammet.',
    oppgavePickLabel: 'Vil du teste skriveprofilen din? Velg en åpen oppgave fra Skrivemesteren',
    oppgavePickPlaceholder: '— Velg en øvingsoppgave —',
    oppgavePickHint: 'Skriv et svar på oppgaven, lim det inn nedenfor, og få en personlig analyse av skrivekompetansen din.',
    formatBold: 'Fet',
    formatItalic: 'Kursiv',
    formatUnderline: 'Understreket',
    formatBoldTitle: 'Gjør markert tekst fet (Ctrl+B)',
    formatItalicTitle: 'Gjør markert tekst kursiv (Ctrl+I)',
    formatUnderlineTitle: 'Understrek markert tekst (Ctrl+U)',
    label: 'Lim inn elevteksten din',
    placeholder: 'Lim inn teksten din her …',
    richHint: 'Tips: lim inn rett frå Word eller Google Docs – feit skrift på overskrifter og ingress blir teken vare på, og AI-en kan dermed skilje dei frå brødtekst.',
    analyze: 'Analyser teksten',
    analyzing: 'Analyserer …',
    again: 'Analyser ny tekst',
    openLast: 'Siste lagra analyse',
    history: 'Historikk',
    clearHistory: 'Tom historikk',
    historyTitle: 'Tidlegare analysar',
    latestSaved: 'Sist lagra:',
    noSaved: 'Ingen lagra analysar enno.',
    viewingSaved: 'Viser lagra analyse frå',
    openSaved: 'Opne',
    noGenre: 'Utan sjanger',
    historyEmpty: 'Du har inga lagra historikk enno.',
    radarTitle: 'Elevprofilen din',
    strengthsTitle: 'Det du gjør bra',
    suggestTitle: 'Øvingsforslag basert på teksten din',
    quote: 'Fra teksten din:',
    open: 'Åpne oppgaver',
    startAll: 'Start Skrivemesteren med disse kategoriene',
    empty: 'Skriv eller lim inn minst noen setninger først.',
    error: 'Noe gikk galt. Sjekk at API-et kjører.',
    short: 'Teksten er kort – analysen blir bedre med en lengre tekst.',
    gemma4Info: 'Lokal LLM: Gemma 4',
    etaPrefix: 'Analyserer med Gemma 4 – ca.',
    etaSuffix: 'sek. igjen (estimat) …',
    queueWaiting: 'Du er nummer {n} i køen. Det startar straks …',
    queueNext: 'Du er neste i køen …',
    runningMsgs: [
      'Magien skjer i bakgrunnen – Gemma 4 leser teksten din ord for ord …',
      'AI-en studerer setningsbygging og sammenheng nøye …',
      'Vurderer ordvalg, stil og språklig variasjon …',
      'Sammenligner mot læreplanen i norsk …',
      'Bygger den personlige elevprofilen din …',
      'Det er verdt å vente – grundig vurdering tar tid …',
      'Velger ut de mest treffende øvingene til deg …'
    ],
    overtimeMsgs: [
      'Tar litt lenger enn ventet – AI-en leser nøye …',
      'Bygger elevprofilen din …',
      'Sjekker struktur og setningsbygging …',
      'Vurderer ordvalg og språklig variasjon …',
      'Velger ut de mest treffende øvingene …',
      'Næsten ferdig – takk for tålmodigheten!'
    ]
  } : {
    title: 'Elevprofil',
    intro: 'Lim inn den siste teksten du har levert. Du får ein grundig analyse, ein elevprofil og konkrete oppgåver å øve på.',
    maalLabel: 'Målform',
    sjangerLabel: 'Sjanger',
    sjangerPlaceholder: 'Vel sjanger (valfritt)',
    oppgaveLabel: 'Oppgåvetekst (valfritt, men tilrådd)',
    oppgavePlaceholder: 'Lim inn oppgåveteksten du fekk – då kan AI-en vurdere om innhaldet treff.',
    oppgaveHint: 'Utan oppgåvetekst blir innhald sett til maks 4 av 6 i radardiagrammet.',
    oppgavePickLabel: 'Vil du teste skriveprofilen din? Vel ei open oppgåve frå Skrivemeisteren',
    oppgavePickPlaceholder: '— Vel ei øvingsoppgåve —',
    oppgavePickHint: 'Skriv eit svar på oppgåva, lim det inn nedanfor, og få ein personleg analyse av skrivekompetansen din.',
    formatBold: 'Feit',
    formatItalic: 'Kursiv',
    formatUnderline: 'Understreking',
    formatBoldTitle: 'Gjer markert tekst feit (Ctrl+B)',
    formatItalicTitle: 'Gjer markert tekst kursiv (Ctrl+I)',
    formatUnderlineTitle: 'Understrek markert tekst (Ctrl+U)',
    label: 'Lim inn elevteksten din',
    placeholder: 'Lim inn teksten din her …',
    richHint: 'Tips: lim inn rett fra Word eller Google Docs – fet skrift på overskrifter og ingress blir tatt vare på, og AI-en kan dermed skille dem fra brødteksten.',
    analyze: 'Analyser teksten',
    analyzing: 'Analyserer …',
    again: 'Analyser ny tekst',
    openLast: 'Siste lagrede analyse',
    history: 'Historikk',
    clearHistory: 'Tøm historikk',
    historyTitle: 'Tidligere analyser',
    latestSaved: 'Sist lagret:',
    noSaved: 'Ingen lagrede analyser ennå.',
    viewingSaved: 'Viser lagret analyse fra',
    openSaved: 'Åpne',
    noGenre: 'Uten sjanger',
    historyEmpty: 'Du har ingen lagret historikk ennå.',
    radarTitle: 'Elevprofilen din',
    strengthsTitle: 'Det du gjer bra',
    suggestTitle: 'Øvingsforslag basert på teksten din',
    quote: 'Frå teksten din:',
    open: 'Opne oppgåver',
    startAll: 'Start Skrivemeisteren med desse kategoriane',
    empty: 'Skriv eller lim inn minst nokre setningar først.',
    error: 'Noko gjekk gale. Sjekk at API-et køyrer.',
    short: 'Teksten er kort – analysen blir betre med ein lengre tekst.',
    gemma4Info: 'Lokal LLM: Gemma 4',
    etaPrefix: 'Analyserer med Gemma 4 – om lag',
    etaSuffix: 'sek. att (estimat) …',
    queueWaiting: 'Du er nummer {n} i køen. Det startar straks …',
    queueNext: 'Du er neste i køen …',
    runningMsgs: [
      'Magien skjer i bakgrunnen – Gemma 4 les teksten din ord for ord …',
      'AI-en studerer setningsbygging og samanheng nøye …',
      'Vurderer ordval, stil og språkleg variasjon …',
      'Samanliknar mot læreplanen i norsk …',
      'Byggjer den personlege elevprofilen din …',
      'Det er verdt å vente – grundig vurdering tek tid …',
      'Vel ut dei mest treffande øvingane til deg …'
    ],
    overtimeMsgs: [
      'Tek litt lenger enn venta – AI-en les nøye …',
      'Byggjer elevprofilen din …',
      'Sjekkar struktur og setningsbygging …',
      'Vurderer ordval og språkleg variasjon …',
      'Vel ut dei mest treffande øvingane …',
      'Snart ferdig – takk for tålmodet!'
    ]
  };

  var MAAL_ALTERNATIV = MAAL === 'bm'
    ? [
      { value: 'bm', label: 'Bokmål' },
      { value: 'nn', label: 'Nynorsk' }
    ]
    : [
      { value: 'nn', label: 'Nynorsk' },
      { value: 'bm', label: 'Bokmål' }
    ];

  var SJANGER_ALTERNATIV = MAAL === 'bm'
    ? [
      { value: 'fortellende tekst', label: 'Fortellende tekst' },
      { value: 'beskrivende tekst', label: 'Beskrivende tekst' },
      { value: 'argumenterende tekst', label: 'Argumenterende tekst' },
      { value: 'fagtekst', label: 'Fagtekst' },
      { value: 'refleksjonstekst', label: 'Refleksjonstekst' }
    ]
    : [
      { value: 'forteljande tekst', label: 'Forteljande tekst' },
      { value: 'skildrande tekst', label: 'Skildrande tekst' },
      { value: 'argumenterande tekst', label: 'Argumenterande tekst' },
      { value: 'fagtekst', label: 'Fagtekst' },
      { value: 'refleksjonstekst', label: 'Refleksjonstekst' }
    ];

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
'.nl-ta-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin:.2rem 0 .65rem;}' +
'.nl-ta-meta-field{display:flex;flex-direction:column;}' +
'.nl-ta-select{width:100%;padding:.55rem .7rem;border:1.5px solid #E6DFD2;border-radius:10px;font:500 .95rem "Source Sans 3",sans-serif;color:#1A3D2B;background:#fffdf8;box-sizing:border-box;}' +
'.nl-ta-select:focus{outline:none;border-color:#1A3D2B;box-shadow:0 0 0 3px rgba(26,61,43,.12);}' +
'.nl-ta-textarea{width:100%;min-height:160px;padding:.85rem 1rem;border:1.5px solid #E6DFD2;border-radius:12px;font-family:inherit;font-size:1rem;line-height:1.55;color:#1A3D2B;background:#fffdf8;resize:vertical;box-sizing:border-box;}' +
'.nl-ta-textarea:focus{outline:none;border-color:#1A3D2B;box-shadow:0 0 0 3px rgba(26,61,43,.12);}' +
'.nl-ta-textarea-small{min-height:78px;background:#fffaf0;border-color:#E6CFA8;}' +
'.nl-ta-richinput{width:100%;min-height:200px;max-height:520px;overflow-y:auto;padding:.85rem 1rem;border:1.5px solid #E6DFD2;border-radius:12px;font-family:inherit;font-size:1rem;line-height:1.6;color:#1A3D2B;background:#fffdf8;box-sizing:border-box;white-space:pre-wrap;word-wrap:break-word;cursor:text;}' +
'.nl-ta-richinput:focus{outline:none;border-color:#1A3D2B;box-shadow:0 0 0 3px rgba(26,61,43,.12);}' +
'.nl-ta-richinput[data-empty="1"]::before{content:attr(data-placeholder);color:#a89c82;pointer-events:none;font-style:italic;}' +
'.nl-ta-richinput strong,.nl-ta-richinput b{font-weight:700;color:#1A3D2B;}' +
'.nl-ta-richinput em,.nl-ta-richinput i{font-style:italic;color:#1A3D2B;}' +
'.nl-ta-richinput u{text-decoration:underline;text-decoration-color:#C8832A;text-decoration-thickness:2px;text-underline-offset:2px;}' +
'.nl-ta-richinput p{margin:0 0 .55rem;}' +
'.nl-ta-richinput p:last-child{margin-bottom:0;}' +
'.nl-ta-toolbar{display:flex;gap:.35rem;flex-wrap:wrap;margin:.1rem 0 .35rem;}' +
'.nl-ta-pickbox{background:linear-gradient(135deg,#fff8e7 0%,#fff5e0 100%);border:1.5px solid #E6CFA8;border-left:4px solid #C8832A;border-radius:0 12px 12px 0;padding:.75rem .9rem .55rem;margin:.1rem 0 .85rem;}' +
'.nl-ta-pick-label{display:flex;align-items:center;gap:.25rem;color:#8b5815;margin-bottom:.45rem;}' +
'.nl-ta-pick-icon{font-size:1.05em;line-height:1;}' +
'.nl-ta-pick-hint{margin:.4rem 0 0;color:#7a5a25;font-style:italic;font-size:.85rem;}' +
'.nl-ta-fbtn{display:inline-flex;align-items:center;justify-content:center;min-width:2.2rem;padding:.35rem .55rem;border:1.5px solid #E6DFD2;background:#fffdf8;color:#1A3D2B;border-radius:8px;font:600 .92rem "Source Sans 3",sans-serif;cursor:pointer;line-height:1;transition:background .15s,border-color .15s;}' +
'.nl-ta-fbtn:hover{background:#f5f1ea;border-color:#C8832A;}' +
'.nl-ta-fbtn:active{background:#efe7d8;}' +
'.nl-ta-fbtn-b{font-weight:800;}' +
'.nl-ta-fbtn-i{font-style:italic;}' +
'.nl-ta-fbtn-u{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:2px;}' +
'.nl-ta-hint{font-size:.85rem;color:#7d6a3d;margin:.25rem 0 .9rem;font-style:italic;}' +
'.nl-ta-actions{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.8rem;}' +
'.nl-ta-actions-top{margin-top:0;margin-bottom:.85rem;}' +
'.nl-ta-btn{display:inline-flex;align-items:center;gap:.4rem;background:#1A3D2B;color:#fff;border:none;border-radius:10px;padding:.65rem 1.2rem;font:600 .95rem "Source Sans 3",sans-serif;cursor:pointer;transition:background .2s;}' +
'.nl-ta-btn:hover{background:#2E6B4F;}' +
'.nl-ta-btn[disabled]{opacity:.65;cursor:wait;}' +
'.nl-ta-btn-ghost{background:#fff;color:#1A3D2B;border:1.5px solid #E6DFD2;}' +
'.nl-ta-btn-ghost:hover{background:#f5f1ea;}' +
'.nl-ta-btn-gold{background:#C8832A;}' +
'.nl-ta-btn-gold:hover{background:#A66A1F;}' +
'.nl-ta-status{margin-top:.6rem;font-size:.9rem;color:#7a6a4a;}' +
'.nl-ta-storage-note{margin:-.15rem 0 .7rem;color:#7a6a4a;font-size:.88rem;}' +
'.nl-ta-status.err{color:#a73e23;}' +
'.nl-ta-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:nl-ta-spin .7s linear infinite;}' +
'@keyframes nl-ta-spin{to{transform:rotate(360deg);}}' +
'.nl-ta-summary{background:linear-gradient(135deg,#f6fbf7 0%,#eef7f2 100%);border:1px solid #d4e8d9;border-radius:14px;padding:1rem 1.1rem;margin-bottom:1rem;}' +
'.nl-ta-summary p{margin:0;color:#1A3D2B;font-size:.98rem;}' +
'.nl-ta-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;margin-bottom:1rem;}' +
'@media(max-width:720px){.nl-ta-grid{grid-template-columns:1fr;}}' +
'@media(max-width:720px){.nl-ta-meta{grid-template-columns:1fr;}}' +
'.nl-ta-radar-wrap{display:flex;justify-content:center;align-items:center;padding:.4rem 1.5rem;overflow:visible;}' +
'.nl-ta-radar{width:100%;max-width:340px;height:auto;}' +
'.nl-ta-radar .axis{stroke:#cdbfa6;stroke-width:1;}' +
'.nl-ta-radar .grid{stroke:#e6dfd2;stroke-width:1;fill:none;}' +
'.nl-ta-radar .area{fill:rgba(200,131,42,.28);stroke:#C8832A;stroke-width:2;stroke-linejoin:round;}' +
'.nl-ta-radar .point{fill:#C8832A;}' +
'.nl-ta-radar .point-hit{cursor:pointer;}' +
'.nl-ta-radar .label{font:600 11px "Source Sans 3",sans-serif;fill:#1A3D2B;}' +
'.nl-ta-radar-tip{min-height:1.6em;margin:.45rem auto 0;padding:.35rem .8rem;background:#1A3D2B;color:#fff;border-radius:8px;font-size:.86rem;line-height:1.4;text-align:center;max-width:300px;opacity:0;transition:opacity .15s;pointer-events:none;}' +
'.nl-ta-radar-tip.vis{opacity:1;}' +
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
'.nl-ta-empty{padding:1rem;border:1.5px dashed #cdbfa6;border-radius:12px;color:#7a6a4a;text-align:center;font-style:italic;}' +
'.nl-ta-history-list{display:grid;gap:.75rem;}' +
'.nl-ta-history-item{display:grid;gap:.45rem;background:#fffaf6;border:1px solid #eadfce;border-radius:12px;padding:.9rem 1rem;}' +
'.nl-ta-history-meta{display:flex;gap:.55rem;flex-wrap:wrap;font-size:.84rem;color:#7a6a4a;}' +
'.nl-ta-history-chip{display:inline-flex;align-items:center;padding:.12rem .5rem;border-radius:999px;background:#efe7d8;color:#6b5430;}' +
'.nl-ta-history-excerpt{margin:0;color:#314338;font-size:.93rem;}' +
'.nl-ta-history-actions{display:flex;gap:.5rem;flex-wrap:wrap;}' +
'.nl-ta-model-info{display:flex;align-items:center;gap:.45rem;margin-top:.5rem;font-size:.82rem;color:#6b5a3a;}' +
'.nl-ta-model-dot{width:8px;height:8px;border-radius:50%;background:#2E6B4F;flex-shrink:0;display:inline-block;}' +
'.nl-ta-model-dot--pulse{animation:nl-ta-pulse 1.4s ease-in-out infinite;}' +
'.nl-ta-model-info{flex-wrap:wrap;}' +
'.nl-ta-rotmsg{display:inline-block;width:100%;margin-top:.25rem;color:#7b5fb1;font-style:italic;font-size:.82rem;animation:nl-ta-fade .5s ease-in;}' +
'@keyframes nl-ta-fade{from{opacity:0;}to{opacity:1;}}' +
'@keyframes nl-ta-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(1.3);}}';

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

  /* ─── Rik-tekst (contenteditable) ─────────────────── */
  // Hent tekst frå contenteditable og marker feit skrift med **…**
  // (Markdown-stil) slik at AI-en ser kva som er overskrifter/ingress.
  function getRichText(el) {
    if (!el) return '';
    var out = [];
    function isBoldNode(node) {
      if (!node || node.nodeType !== 1) return false;
      var tag = node.nodeName;
      if (tag === 'STRONG' || tag === 'B') return true;
      if (/^H[1-6]$/.test(tag)) return true;
      var fw = node.style && node.style.fontWeight;
      if (fw && (fw === 'bold' || (parseInt(fw, 10) >= 600))) return true;
      return false;
    }
    function isItalicNode(node) {
      if (!node || node.nodeType !== 1) return false;
      var tag = node.nodeName;
      if (tag === 'EM' || tag === 'I') return true;
      var fs = node.style && node.style.fontStyle;
      if (fs && fs.indexOf('italic') !== -1) return true;
      return false;
    }
    function isUnderlineNode(node) {
      if (!node || node.nodeType !== 1) return false;
      var tag = node.nodeName;
      if (tag === 'U') return true;
      var td = node.style && node.style.textDecoration;
      if (td && td.indexOf('underline') !== -1) return true;
      return false;
    }
    function isBlockNode(node) {
      if (!node || node.nodeType !== 1) return false;
      var tag = node.nodeName;
      return tag === 'P' || tag === 'DIV' || tag === 'LI' || /^H[1-6]$/.test(tag) ||
             tag === 'BLOCKQUOTE' || tag === 'TR' || tag === 'PRE';
    }
    function walk(node, boldDepth, italicDepth, underlineDepth) {
      if (node.nodeType === 3) {
        var t = node.nodeValue || '';
        if (!t) return;
        // Wrap i fast rekkefølgje: bold → italic → underline (innerst → ytst).
        if (boldDepth > 0) t = '**' + t + '**';
        if (italicDepth > 0) t = '*' + t + '*';
        if (underlineDepth > 0) t = '__' + t + '__';
        out.push(t);
        return;
      }
      if (node.nodeType !== 1) return;
      if (node.nodeName === 'BR') { out.push('\n'); return; }
      var addedBlock = false;
      if (isBlockNode(node) && out.length && !/\n$/.test(out[out.length - 1])) {
        out.push('\n');
        addedBlock = true;
      }
      var b = boldDepth + (isBoldNode(node) ? 1 : 0);
      var i2 = italicDepth + (isItalicNode(node) ? 1 : 0);
      var u = underlineDepth + (isUnderlineNode(node) ? 1 : 0);
      var c = node.childNodes;
      for (var i = 0; i < c.length; i++) walk(c[i], b, i2, u);
      if (addedBlock && !/\n$/.test(out.length ? out[out.length - 1] : '')) {
        out.push('\n');
      } else if (isBlockNode(node)) {
        out.push('\n');
      }
    }
    walk(el, 0, 0, 0);
    // Rydd opp: kollaps tomme markørar og fjern dobbel/tredobbel newline
    var s = out.join('')
      .replace(/\*\*\s*\*\*/g, '')
      .replace(/(?:^|[^*])\*\s*\*(?!\*)/g, function (m) { return m.charAt(0) === '*' ? '' : m.charAt(0); })
      .replace(/__\s*__/g, '')
      .replace(/\*\*([^*]*)\*\*\*\*([^*]*)\*\*/g, '**$1$2**')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
    return s;
  }

  // Set tekst i contenteditable og rendr **bold**-merker som <strong>.
  function setRichText(el, str) {
    if (!el) return;
    var s = String(str == null ? '' : str);
    if (!s) {
      el.innerHTML = '';
      el.setAttribute('data-empty', '1');
      return;
    }
    var paras = s.split(/\n{2,}/);
    var html = paras.map(function (p) {
      var lines = p.split('\n').map(function (ln) {
        // Konverter **…** til <strong>…</strong> (esc først)
        var safe = esc(ln);
        // Vi mista dei opphavlege ** i esc? Nei – ** er ikkje special.
        return safe.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
      });
      return '<p>' + lines.join('<br>') + '</p>';
    }).join('');
    el.innerHTML = html;
    el.setAttribute('data-empty', html ? '0' : '1');
  }

  function updateRichEmptyState(el) {
    if (!el) return;
    var hasText = (el.textContent || '').replace(/\s+/g, '') !== '';
    el.setAttribute('data-empty', hasText ? '0' : '1');
  }

  // Reinsk pasta-HTML: behald berre tekst, feit skrift og linjeskift.
  function sanitizePastedHtml(html) {
    var doc;
    try {
      doc = new DOMParser().parseFromString(html, 'text/html');
    } catch (err) {
      return null;
    }
    if (!doc || !doc.body) return null;
    function clean(node) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === 1) {
          var tag = child.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'META' || tag === 'LINK') {
            child.remove(); return;
          }
          // Marker H1–H6 og element med font-weight≥600 som <strong>
          var fw = child.style && child.style.fontWeight;
          var fs = child.style && child.style.fontStyle;
          var td = child.style && child.style.textDecoration;
          var isBold = tag === 'B' || tag === 'STRONG' || /^H[1-6]$/.test(tag) ||
                       (fw && (fw === 'bold' || parseInt(fw, 10) >= 600));
          var isItalic = tag === 'I' || tag === 'EM' || (fs && fs.indexOf('italic') !== -1);
          var isUnderline = tag === 'U' || (td && td.indexOf('underline') !== -1);
          // Behald struktur for blokkelement; alt anna blir spans/strong/em/u/br.
          if (isBold && tag !== 'STRONG') {
            var s = doc.createElement('strong');
            while (child.firstChild) s.appendChild(child.firstChild);
            child.parentNode.replaceChild(s, child);
            child = s;
          } else if (isItalic && tag !== 'EM' && tag !== 'I') {
            var em = doc.createElement('em');
            while (child.firstChild) em.appendChild(child.firstChild);
            child.parentNode.replaceChild(em, child);
            child = em;
          } else if (isUnderline && tag !== 'U') {
            var u = doc.createElement('u');
            while (child.firstChild) u.appendChild(child.firstChild);
            child.parentNode.replaceChild(u, child);
            child = u;
          }
          if (child.removeAttribute) {
            // Fjern alle attributt
            var attrs = Array.prototype.slice.call(child.attributes || []);
            attrs.forEach(function (a) { child.removeAttribute(a.name); });
          }
          clean(child);
        }
      });
    }
    clean(doc.body);
    return doc.body.innerHTML;
  }


  function loadHistory() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (entry) {
        return entry && entry.id && entry.savedAt && entry.resultat;
      });
    } catch (err) {
      return [];
    }
  }

  function saveHistory(items) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
    } catch (err) {}
  }

  function formatTs(ts) {
    try {
      return new Intl.DateTimeFormat(MAAL === 'bm' ? 'nb-NO' : 'nn-NO', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(ts));
    } catch (err) {
      return String(ts || '');
    }
  }

  function textExcerpt(text) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= 140) return clean;
    return clean.slice(0, 137) + '...';
  }

  function maalLabel(value) {
    return value === 'bm' ? 'Bokmal' : 'Nynorsk';
  }

  function addHistoryEntry(payload) {
    var items = loadHistory();
    var entry = {
      id: 'nlta-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      savedAt: new Date().toISOString(),
      maal: payload.maal === 'bm' ? 'bm' : 'nn',
      sjanger: String(payload.sjanger || '').trim(),
      oppgaveText: String(payload.oppgaveText || ''),
      tekst: String(payload.tekst || ''),
      resultat: payload.resultat || null
    };
    items.unshift(entry);
    saveHistory(items);
    return entry;
  }

  function syncToElevprofilStore(payload) {
    var radar = payload.resultat && payload.resultat.radar ? payload.resultat.radar : {};
    var forslag = Array.isArray(payload.resultat && payload.resultat.forslag) ? payload.resultat.forslag : [];
    var categories = forslag.map(function (f) {
      var id = String((f && f.kategori) || '').trim();
      if (!id) return null;
      return {
        id: id,
        label: String((f && (f.tittel || f.kat_label || f.kategori)) || id),
        reason: String((f && f.forklaring) || '').trim(),
        score: 12
      };
    }).filter(Boolean).slice(0, 6);

    var hasOppgave = String(payload.oppgaveText || '').trim().length >= 20;
    var oppgaveStr = String(payload.oppgaveText || '');
    var elevStr = String(payload.tekst || '');
    var kildebrukRe = /kjeld|kilde|tilvising|referans|kjeldeliste|kildeliste|i\s*f(?:ø|o)lgj?e|https?:\/\/|snl\.no|wikipedia|\(\s*\w+[^)]{0,40}\b(?:19|20)\d{2}\s*\)|\[[1-9]\d?\]/i;
    var aiKjeldeScore = Number(radar.kjeldebruk) || 0;
    // hasKildebruk er sann om: oppgava nemner kjelder, eleven faktisk har kjelder i teksten,
    // eller AI-en sjolv vurderte kjeldebruk (score > 1, der 1 = ikkje relevant per prompt).
    var hasKildebruk = kildebrukRe.test(oppgaveStr) || kildebrukRe.test(elevStr) || aiKjeldeScore > 1;
    var innhaldRaw = Number(radar.innhald) || 0;
    var innhaldDekning = Number((payload.resultat && payload.resultat.innholdDekning && payload.resultat.innholdDekning.score)) || 0;
    var innhaldFinal = innhaldRaw;
    if (hasOppgave && innhaldDekning > 0) {
      // AI har vurdert om teksten treff oppgåva – vekt 60/40 mellom innhald og dekning.
      innhaldFinal = (innhaldRaw * 0.6) + (innhaldDekning * 0.4);
    } else if (!hasOppgave) {
      // Ingen oppgåvetekst = vi kan ikkje vurdere om innhaldet treff. Cap på 4 av 6.
      innhaldFinal = Math.min(innhaldRaw || 4, 4);
    }

    var radarScores = [
      innhaldFinal,
      Number(radar.struktur) || 0,
      Number(radar.spraak_stil) || 0,
      Number(radar.rettskriving) || 0,
      Number(radar.rettskriving) || 0,
      Number(radar.kjeldebruk) || 0
    ].map(function (v) {
      return Math.max(1, Math.min(6, v || 1));
    });

    var entry = {
      ts: new Date().toISOString(),
      title: payload.sjanger ? ('Sjanger: ' + payload.sjanger) : 'Elevtekst',
      textExcerpt: String(payload.tekst || '').slice(0, 280),
      source: payload.maal === 'bm' ? 'tekstsjekk-bm' : 'tekstsjekk-nn',
      categories: categories,
      radarScores: radarScores,
      hasOppgaveText: hasOppgave,
      hasKildebruk: hasKildebruk,
      oppgaveExcerpt: String(payload.oppgaveText || '').slice(0, 280),
      summary: String((payload.resultat && payload.resultat.sammendrag) || '').slice(0, 600),
      strengths: Array.isArray(payload.resultat && payload.resultat.styrker)
        ? payload.resultat.styrker.slice(0, 3)
        : []
    };

    try {
      var storeRaw = window.localStorage.getItem(ELEVPROFIL_KEY);
      var store = storeRaw ? JSON.parse(storeRaw) : null;
      if (!store || typeof store !== 'object') store = { version: 1, updatedAt: '', analyses: [] };
      if (!Array.isArray(store.analyses)) store.analyses = [];
      store.analyses.unshift(entry);
      if (store.analyses.length > ELEVPROFIL_LIMIT) {
        store.analyses = store.analyses.slice(0, ELEVPROFIL_LIMIT);
      }
      store.updatedAt = new Date().toISOString();
      store.version = 1;
      window.localStorage.setItem(ELEVPROFIL_KEY, JSON.stringify(store));
    } catch (err) {}
  }

  function updateSavedControls(host) {
    var items = loadHistory();
    var latestBtn = host.querySelector('[data-nl-ta-open-last]');
    var historyBtn = host.querySelector('[data-nl-ta-show-history]');
    var note = host.querySelector('[data-nl-ta-storage-note]');
    var hasItems = items.length > 0;

    if (latestBtn) latestBtn.disabled = !hasItems;
    if (historyBtn) historyBtn.disabled = !hasItems;
    if (note) {
      note.textContent = hasItems
        ? (T.latestSaved + ' ' + formatTs(items[0].savedAt))
        : T.noSaved;
    }
  }

  function applyEntryToForm(host, entry) {
    var ta = host.querySelector('#nl-ta-input');
    var oppgaveEl = host.querySelector('#nl-ta-oppgave');
    var maalSel = host.querySelector('#nl-ta-maal');
    var sjangerSel = host.querySelector('#nl-ta-sjanger');
    if (ta) setRichText(ta, String(entry.tekst || ''));
    if (oppgaveEl) oppgaveEl.value = String(entry.oppgaveText || '');
    if (maalSel) maalSel.value = entry.maal === 'bm' ? 'bm' : 'nn';
    if (sjangerSel) sjangerSel.value = String(entry.sjanger || '');
  }

  function showSavedEntry(host, entry) {
    if (!entry || !entry.resultat) return;
    applyEntryToForm(host, entry);
    renderResult(host, entry.resultat);
    var status = host.querySelector('[data-nl-ta-status]');
    if (status) {
      status.classList.remove('err');
      status.textContent = T.viewingSaved + ' ' + formatTs(entry.savedAt) + '.';
    }
    var resEl = host.querySelector('[data-nl-ta-results]');
    if (resEl && resEl.scrollIntoView) resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderHistory(host) {
    var resultsEl = host.querySelector('[data-nl-ta-results]');
    if (!resultsEl) return;

    var items = loadHistory();
    if (!items.length) {
      resultsEl.innerHTML = '<div class="nl-ta-card"><h3>' + esc(T.historyTitle) + '</h3><div class="nl-ta-empty">' + esc(T.historyEmpty) + '</div></div>';
      return;
    }

    var html = '<div class="nl-ta-card">';
    html += '<h3>' + esc(T.historyTitle) + '</h3>';
    html += '<div class="nl-ta-actions nl-ta-actions-top"><button type="button" class="nl-ta-btn nl-ta-btn-ghost" data-nl-ta-clear-history="1">' + esc(T.clearHistory) + '</button></div>';
    html += '<div class="nl-ta-history-list">';
    items.forEach(function (entry) {
      html += '<article class="nl-ta-history-item">';
      html += '<div class="nl-ta-history-meta">';
      html += '<span class="nl-ta-history-chip">' + esc(formatTs(entry.savedAt)) + '</span>';
      html += '<span class="nl-ta-history-chip">' + esc(maalLabel(entry.maal)) + '</span>';
      html += '<span class="nl-ta-history-chip">' + esc(entry.sjanger || T.noGenre) + '</span>';
      html += '</div>';
      html += '<p class="nl-ta-history-excerpt">' + esc(textExcerpt(entry.tekst)) + '</p>';
      html += '<div class="nl-ta-history-actions"><button type="button" class="nl-ta-btn nl-ta-btn-ghost" data-nl-ta-open-id="' + esc(entry.id) + '">' + esc(T.openSaved) + '</button></div>';
      html += '</article>';
    });
    html += '</div></div>';
    resultsEl.innerHTML = html;
  }

  function buildRadarSvg(radar, forklaring) {
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
      var key = RADAR_AKSAR[k].key;
      var v = Number(radar[key]);
      if (!Number.isFinite(v)) v = 1;
      v = Math.max(1, Math.min(6, v));
      var pp = point(k, v);
      var tipTxt = (forklaring && forklaring[key]) ? String(forklaring[key]) : '';
      areaPts.push(pp[0].toFixed(1) + ',' + pp[1].toFixed(1));
      dots += '<g class="nl-ta-point-group" data-nl-ax="' + key +
              '" data-nl-score="' + v +
              '" data-nl-tip="' + esc(tipTxt) +
              '" data-nl-label="' + esc(RADAR_AKSAR[k].label) + '">' +
              '<circle class="point" cx="' + pp[0].toFixed(1) + '" cy="' + pp[1].toFixed(1) + '" r="3.5"/>' +
              '<circle class="point-hit" cx="' + pp[0].toFixed(1) + '" cy="' + pp[1].toFixed(1) + '" r="14" fill="transparent"/>' +
              '<title>' + esc(RADAR_AKSAR[k].label + ' ' + v + '/6' + (tipTxt ? ': ' + tipTxt : '')) + '</title>' +
              '</g>';
    }

    return '<svg class="nl-ta-radar" viewBox="0 0 ' + size + ' ' + size + '" overflow="visible" role="img" aria-label="' + esc(T.radarTitle) + '">' +
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
        html += '<div><h4>' + esc(T.radarTitle) + '</h4><div class="nl-ta-radar-wrap">' + buildRadarSvg(data.radar, data.radar_forklaring) + '</div><div class="nl-ta-radar-tip" data-nl-radar-tip></div></div>';
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

    var tipEl = resultsEl && resultsEl.querySelector('[data-nl-radar-tip]');
    var ptGroups = resultsEl ? Array.prototype.slice.call(resultsEl.querySelectorAll('.nl-ta-point-group')) : [];
    if (tipEl && ptGroups.length) {
      ptGroups.forEach(function (g) {
        g.addEventListener('mouseenter', function () {
          var lbl = g.getAttribute('data-nl-label') || '';
          var sc  = g.getAttribute('data-nl-score') || '';
          var tip = g.getAttribute('data-nl-tip') || '';
          tipEl.textContent = lbl + ' ' + sc + '/6' + (tip ? ' – ' + tip : '');
          tipEl.classList.add('vis');
        });
        g.addEventListener('mouseleave', function () { tipEl.classList.remove('vis'); });
      });
    }
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
    // Anna side: naviger til skrivemeisteren med autostart
    var page = MAAL === 'bm' ? 'skrivemeisteren-bm.html' : 'skrivemeisteren.html';
    location.href = page + '?kats=' + encodeURIComponent(katList.join(',')) + '&auto=1#nl-adaptive';
  }

  function mount() {
    injectCss();
    var host = findMount();
    if (!host) return;
    if (host.dataset.nlTaMounted === '1') return;
    host.dataset.nlTaMounted = '1';
    host.classList.add('nl-ta');

    var maalOptions = MAAL_ALTERNATIV.map(function (m) {
      return '<option value="' + esc(m.value) + '"' + (m.value === MAAL ? ' selected' : '') + '>' + esc(m.label) + '</option>';
    }).join('');

    var sjangerOptions = '<option value="">' + esc(T.sjangerPlaceholder) + '</option>' +
      SJANGER_ALTERNATIV.map(function (s) {
        return '<option value="' + esc(s.value) + '">' + esc(s.label) + '</option>';
      }).join('');

    host.innerHTML =
      '<div class="nl-ta-card">' +
        '<h3>' + esc(T.title) + '</h3>' +
        '<p class="nl-ta-intro">' + esc(T.intro) + '</p>' +
        '<div class="nl-ta-actions nl-ta-actions-top">' +
          '<button type="button" class="nl-ta-btn nl-ta-btn-ghost" data-nl-ta-open-last="1">' + esc(T.openLast) + '</button>' +
          '<button type="button" class="nl-ta-btn nl-ta-btn-ghost" data-nl-ta-show-history="1">' + esc(T.history) + '</button>' +
        '</div>' +
        '<div class="nl-ta-storage-note" data-nl-ta-storage-note></div>' +
        '<div class="nl-ta-meta">' +
          '<div class="nl-ta-meta-field">' +
            '<label class="nl-ta-label" for="nl-ta-maal">' + esc(T.maalLabel) + '</label>' +
            '<select id="nl-ta-maal" class="nl-ta-select">' + maalOptions + '</select>' +
          '</div>' +
          '<div class="nl-ta-meta-field">' +
            '<label class="nl-ta-label" for="nl-ta-sjanger">' + esc(T.sjangerLabel) + '</label>' +
            '<select id="nl-ta-sjanger" class="nl-ta-select">' + sjangerOptions + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="nl-ta-pickbox" data-nl-ta-oppgave-pick-wrap hidden>' +
          '<label class="nl-ta-label nl-ta-pick-label" for="nl-ta-oppgave-pick">' +
            '<span class="nl-ta-pick-icon" aria-hidden="true">📝</span> ' + esc(T.oppgavePickLabel) +
          '</label>' +
          '<select id="nl-ta-oppgave-pick" class="nl-ta-select"><option value="">' + esc(T.oppgavePickPlaceholder) + '</option></select>' +
          '<p class="nl-ta-hint nl-ta-pick-hint">' + esc(T.oppgavePickHint) + '</p>' +
        '</div>' +
        '<label class="nl-ta-label" for="nl-ta-oppgave">' + esc(T.oppgaveLabel) + '</label>' +
        '<textarea id="nl-ta-oppgave" class="nl-ta-textarea nl-ta-textarea-small" placeholder="' + esc(T.oppgavePlaceholder) + '" rows="3"></textarea>' +
        '<p class="nl-ta-hint">' + esc(T.oppgaveHint) + '</p>' +
        '<label class="nl-ta-label" for="nl-ta-input">' + esc(T.label) + '</label>' +
        '<div class="nl-ta-toolbar" role="toolbar" aria-label="Tekstformatering">' +
          '<button type="button" class="nl-ta-fbtn nl-ta-fbtn-b" data-nl-ta-fmt="bold" title="' + esc(T.formatBoldTitle) + '" aria-label="' + esc(T.formatBold) + '">B</button>' +
          '<button type="button" class="nl-ta-fbtn nl-ta-fbtn-i" data-nl-ta-fmt="italic" title="' + esc(T.formatItalicTitle) + '" aria-label="' + esc(T.formatItalic) + '">I</button>' +
          '<button type="button" class="nl-ta-fbtn nl-ta-fbtn-u" data-nl-ta-fmt="underline" title="' + esc(T.formatUnderlineTitle) + '" aria-label="' + esc(T.formatUnderline) + '">U</button>' +
        '</div>' +
        '<div id="nl-ta-input" class="nl-ta-richinput" contenteditable="true" role="textbox" aria-multiline="true" spellcheck="true" data-placeholder="' + esc(T.placeholder) + '" data-empty="1"></div>' +
        '<p class="nl-ta-hint">' + esc(T.richHint) + '</p>' +
        '<div class="nl-ta-actions">' +
          '<button type="button" class="nl-ta-btn" data-nl-ta-go="1">' + esc(T.analyze) + '</button>' +
        '</div>' +
        '<div class="nl-ta-model-info" data-nl-ta-model-info>' +
          '<span class="nl-ta-model-dot"></span> ' + esc(T.gemma4Info) +
        '</div>' +
        '<div class="nl-ta-status" data-nl-ta-status></div>' +
      '</div>' +
      '<div data-nl-ta-results></div>';

    updateSavedControls(host);

    host.addEventListener('click', function (e) {
      var go = e.target.closest('[data-nl-ta-go]');
      if (go) { e.preventDefault(); doAnalyse(host, go); return; }

      var openLast = e.target.closest('[data-nl-ta-open-last]');
      if (openLast) {
        e.preventDefault();
        var latestItems = loadHistory();
        if (latestItems.length) showSavedEntry(host, latestItems[0]);
        return;
      }

      var showHistoryBtn = e.target.closest('[data-nl-ta-show-history]');
      if (showHistoryBtn) {
        e.preventDefault();
        renderHistory(host);
        return;
      }

      var reset = e.target.closest('[data-nl-ta-reset]');
      if (reset) {
        e.preventDefault();
        var resultsEl = host.querySelector('[data-nl-ta-results]');
        if (resultsEl) resultsEl.innerHTML = '';
        var statusEl = host.querySelector('[data-nl-ta-status]');
        if (statusEl) {
          statusEl.classList.remove('err');
          statusEl.textContent = '';
        }
        var ta = host.querySelector('#nl-ta-input');
        if (ta) { ta.focus(); }
        return;
      }

      var openSavedBtn = e.target.closest('[data-nl-ta-open-id]');
      if (openSavedBtn) {
        e.preventDefault();
        var id = openSavedBtn.getAttribute('data-nl-ta-open-id') || '';
        var entry = loadHistory().find(function (item) { return item.id === id; });
        if (entry) showSavedEntry(host, entry);
        return;
      }

      var clearHistoryBtn = e.target.closest('[data-nl-ta-clear-history]');
      if (clearHistoryBtn) {
        e.preventDefault();
        saveHistory([]);
        updateSavedControls(host);
        renderHistory(host);
        return;
      }

      var sa = e.target.closest('[data-nl-ta-startall]');
      if (sa) {
        e.preventDefault();
        startSkrivemeisterenMedKats(sa.getAttribute('data-nl-ta-startall') || '');
        return;
      }
    });

    /* ─── Rik-tekst-input: paste-sanitering + tom-status ─── */
    var richInput = host.querySelector('#nl-ta-input');
    if (richInput) {
      richInput.addEventListener('paste', function (e) {
        var cd = e.clipboardData || window.clipboardData;
        if (!cd) return;
        var html = cd.getData && cd.getData('text/html');
        var txt = cd.getData && cd.getData('text/plain');
        e.preventDefault();
        var insert = '';
        if (html) {
          var clean = sanitizePastedHtml(html);
          if (clean != null) insert = clean;
        }
        if (!insert && txt) {
          insert = esc(txt).replace(/\n/g, '<br>');
        }
        if (!insert) return;
        if (document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
          document.execCommand('insertHTML', false, insert);
        } else {
          // Fallback: append som tekst
          richInput.appendChild(document.createTextNode(txt || ''));
        }
        updateRichEmptyState(richInput);
      });
      richInput.addEventListener('input', function () { updateRichEmptyState(richInput); });
      richInput.addEventListener('blur', function () { updateRichEmptyState(richInput); });
    }

    /* ─── Format-toolbar (B/I/U) ─── */
    var fmtBtns = host.querySelectorAll('[data-nl-ta-fmt]');
    for (var fi = 0; fi < fmtBtns.length; fi++) {
      fmtBtns[fi].addEventListener('mousedown', function (e) {
        // Hindre at knappen tek fokus frå contenteditable (slik at vi mister markeringa).
        e.preventDefault();
      });
      fmtBtns[fi].addEventListener('click', function (e) {
        e.preventDefault();
        var cmd = this.getAttribute('data-nl-ta-fmt') || '';
        if (!cmd) return;
        var ta = host.querySelector('#nl-ta-input');
        if (!ta) return;
        // Sørg for at fokus er i contenteditable før kommando.
        if (document.activeElement !== ta) ta.focus();
        try {
          document.execCommand(cmd, false, null);
        } catch (err) { /* noop */ }
        updateRichEmptyState(ta);
      });
    }

    /* ─── Oppgåve-picker frå Skrivemeisteren-banken ─── */
    var pickEl = host.querySelector('#nl-ta-oppgave-pick');
    var pickWrap = host.querySelector('[data-nl-ta-oppgave-pick-wrap]');
    if (pickEl && pickWrap && typeof window !== 'undefined' && Array.isArray(window.BANKV2)) {
      var djupne = window.BANKV2.filter(function (t) { return t && t.kat === 'djupneoppgaver' && t.q; });
      if (djupne.length) {
        var frag = document.createDocumentFragment();
        djupne.forEach(function (t, idx) {
          var opt = document.createElement('option');
          opt.value = String(idx);
          var label = String(t.q || '');
          if (label.length > 90) label = label.slice(0, 87) + '…';
          opt.textContent = label;
          frag.appendChild(opt);
        });
        pickEl.appendChild(frag);
        pickWrap.hidden = false;
        pickEl.addEventListener('change', function () {
          var idx = parseInt(pickEl.value, 10);
          if (isNaN(idx)) return;
          var task = djupne[idx];
          if (!task) return;
          var oppgaveEl = host.querySelector('#nl-ta-oppgave');
          if (!oppgaveEl) return;
          var txt = String(task.q || '');
          if (task.hint) txt += '\n\nTips: ' + String(task.hint);
          oppgaveEl.value = txt;
          oppgaveEl.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    }
  }

  function doAnalyse(host, btn) {
    var ta = host.querySelector('#nl-ta-input');
    var oppgaveEl = host.querySelector('#nl-ta-oppgave');
    var maalSel = host.querySelector('#nl-ta-maal');
    var sjangerSel = host.querySelector('#nl-ta-sjanger');
    var status = host.querySelector('[data-nl-ta-status]');
    var tekst = (ta ? getRichText(ta) : '').trim();
    var oppgaveText = (oppgaveEl && oppgaveEl.value || '').trim();
    var valgtMaal = (maalSel && maalSel.value === 'bm') ? 'bm' : 'nn';
    var sjanger = (sjangerSel && sjangerSel.value || '').trim();
    var oppgave = oppgaveText || (sjanger ? ('Sjanger: ' + sjanger) : '');

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

    var wordCount = Math.round(tekst.length / 5);
    // Realistisk ETA for Gemma 4 e4b Q4 paa CX53 CPU (~12 tokens/sek output,
    // ~50 tokens/sek prefill). JSON-svaret er typisk 700–1400 output-tokens.
    var inputTokens = Math.round(wordCount * 1.4);
    var outputTokens = 900;
    var etaSec = Math.round(inputTokens / 50 + outputTokens / 12 + 6);
    etaSec = Math.max(35, Math.min(180, etaSec));
    var etaStart = Date.now();
    var etaTotal = etaSec;
    var queuePos = 0;
    var phase = 'pending';   // 'pending' (i kø) | 'running' | 'overtime'
    var overtimeIdx = 0;
    var runningIdx = 0;
    var lastRotateAt = Date.now();
    var modelInfo = host.querySelector('[data-nl-ta-model-info]');

    function renderProgress() {
      if (!modelInfo) return;
      var dot = '<span class="nl-ta-model-dot nl-ta-model-dot--pulse"></span> ';
      if (phase === 'pending' && queuePos > 1) {
        modelInfo.innerHTML = dot + esc(T.queueWaiting.replace('{n}', String(queuePos - 1)));
        return;
      }
      if (phase === 'overtime') {
        var oMsgs = T.overtimeMsgs || [];
        var oMsg = oMsgs[overtimeIdx % Math.max(1, oMsgs.length)] || '';
        modelInfo.innerHTML = dot + esc(oMsg);
        return;
      }
      var elapsed = Math.round((Date.now() - etaStart) / 1000);
      var remaining = Math.max(0, etaTotal - elapsed);
      var rMsgs = T.runningMsgs || [];
      var rMsg = rMsgs.length ? rMsgs[runningIdx % rMsgs.length] : '';
      modelInfo.innerHTML = dot + esc(T.etaPrefix) + ' <strong>' + remaining + '</strong> ' + esc(T.etaSuffix) +
        (rMsg ? '<br><span class="nl-ta-rotmsg">' + esc(rMsg) + '</span>' : '');
    }

    // Poll kø-status kvart 2. sek.
    var queueInterval = setInterval(function () {
      fetch(API_BASE + '/api/koe').then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data) return;
          queuePos = data.lengd || 0;
          if (queuePos <= 1 && phase === 'pending') {
            phase = 'running';
            etaStart = Date.now(); // resett ETA når vi faktisk startar
            lastRotateAt = etaStart;
            runningIdx = 0;
          }
          renderProgress();
        })
        .catch(function () {});
    }, 2000);

    // Tick kvart sek for nedteljing/rotasjon
    var etaInterval = setInterval(function () {
      var now = Date.now();
      if (phase === 'running') {
        var elapsed = Math.round((now - etaStart) / 1000);
        if (elapsed >= etaTotal) {
          phase = 'overtime';
          overtimeIdx = 0;
          lastRotateAt = now;
        } else if (now - lastRotateAt >= 5000) {
          runningIdx++;
          lastRotateAt = now;
        }
      } else if (phase === 'overtime') {
        if (now - lastRotateAt >= 6000) {
          overtimeIdx++;
          lastRotateAt = now;
        }
      }
      renderProgress();
    }, 1000);

    renderProgress();

    fetch(API_BASE + '/api/analyser-tekst', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tekst: tekst, maal: valgtMaal, sjanger: sjanger, oppgave: oppgave, oppgaveText: oppgaveText })
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.feil || ('HTTP ' + r.status)); });
        return r.json();
      })
      .then(function (data) {
        var payload = {
          tekst: tekst,
          maal: valgtMaal,
          sjanger: sjanger,
          oppgaveText: oppgaveText,
          resultat: data
        };
        addHistoryEntry(payload);
        syncToElevprofilStore(payload);
        updateSavedControls(host);
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
        clearInterval(etaInterval);
        clearInterval(queueInterval);
        var mi = host.querySelector('[data-nl-ta-model-info]');
        if (mi) mi.innerHTML = '<span class="nl-ta-model-dot"></span> ' + esc(T.gemma4Info);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
