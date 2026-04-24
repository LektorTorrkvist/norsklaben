#!/usr/bin/env node
/**
 * test-oppgavebank.js
 * 
 * Streng kvalitetstest for Skrivemeisteren-bankar (NN og BM).
 * 
 * Bruk:
 *   node test-oppgavebank.js oppgavebank-v2.js oppgavebank-bm-v2.js
 *   node test-oppgavebank.js --json oppgavebank-v2.js    (for maskinlesbart output)
 *   node test-oppgavebank.js --only=ERROR oppgavebank-v2.js    (berre kritiske)
 * 
 * Tre nivå av funn:
 *   ERROR – bugs som gir eleven feil svar. Må rettast.
 *   WARN  – kvalitetsproblem (manglande felt, målformblanding, inkonsistens).
 *   INFO  – pedagogisk stil (karikerte distraktorar, overdrivne forsterkarar).
 * 
 * Krev ingen npm-pakkar. Køyrast med vanleg Node.js.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// KONFIGURASJON
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  // Bokmålsord som ikkje bør finnast i nynorskbanken
  bokmaalFlagg: [
    'forsinket', 'bare ', 'ikke ', 'noen ', 'jeg ', 'hun ', 'dere ',
    'meget ', 'mye mer ', 'selv ', 'deres '
  ],
  
  // Nynorskord som ikkje bør finnast i bokmålsbanken
  nynorskFlagg: [
    'ikkje ', 'berre ', 'noko ', 'eg ', 'ho ', 'dokker ',
    'mykje ', 'sjølv ', 'dykkar ', 'dykk '
  ],
  
  // Karikerte/absurde distraktorar som sjeldan er reelle elevfeil
  karikerteForstavingar: ['chrort', 'shjort', 'shjenn', 'chorr'],
  
  // Overdrivne forsterkarar i oppgåvetekst (uheldig for register-læring)
  overforsterkarar: ['!!!', '!!', 'SKRIKER', 'heilt sjukt', 'super mega'],
  
  // Typograferingsproblem (ekskluderer ellipsis "...")
  typofeilMonster: [
    { regex: /(?<!\.)\s\.(?!\.)/g, text: 'punktum med mellomrom framfor', nivå: 'ERROR' },
    { regex: /\s,/g, text: 'komma med mellomrom framfor', nivå: 'ERROR' },
    { regex: /,,/g, text: 'dobbeltkomma', nivå: 'ERROR' },
    { regex: /\s{2,}/g, text: 'fleire mellomrom på rad', nivå: 'WARN' }
  ],
  
  // Kjende bugs frå runde 1 og 2 – sjekk at dei er retta
  kjendeBugs: [
    { monster: /alt:\['sover','sovver'\].*fasit:'søv'/s, melding: 'Cloze-bug: søv som fasit utanfor alternativ (runde 1)', nivå: 'ERROR' },
    { monster: /\{tekst:'grønn',fasit:0\}.*\{tekst:'grønn',fasit:1\}/s, melding: 'Duplikat-bug: grønn står to gonger med ulik fasit', nivå: 'ERROR' },
    { monster: /henstiller til/, melding: 'For formelt uttrykk «henstiller til» for målgruppa', nivå: 'INFO' }
  ]
};

// ═══════════════════════════════════════════════════════════════
// PARSING – enkel lesar for JS-baserte oppgåvebanker
// ═══════════════════════════════════════════════════════════════

/**
 * Parsar ei oppgåvebank-fil og returnerer ein array av oppgåve-objekt.
 * Dette er ein enkel parser som går ut frå standardstrukturen i BANKV2.
 * Han støttar kommentarer, trailing commas og mellomromformat.
 */
function parseBank(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Finn BANKV2-array spesifikt (fila kan ha fleire arraydefinisjonar)
  const startMatch = content.match(/(?:const|var|let)\s+BANKV2\s*=\s*\[/)
    || content.match(/(?:const|var|let)\s+\w+\s*=\s*\[/);
  if (!startMatch) {
    return { tasks: [], error: 'Fann ikkje BANKV2-array i fila.' };
  }
  
  const startIdx = content.indexOf('[', startMatch.index);
  
  // Finn matchande ] – respekter nesting
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let inComment = false;
  let inBlockComment = false;
  let endIdx = -1;
  
  for (let i = startIdx; i < content.length; i++) {
    const c = content[i];
    const next = content[i + 1];
    
    if (inBlockComment) {
      if (c === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    }
    if (inComment) {
      if (c === '\n') inComment = false;
      continue;
    }
    if (inString) {
      if (c === '\\') { i++; continue; }
      if (c === stringChar) { inString = false; stringChar = null; }
      continue;
    }
    
    if (c === '/' && next === '/') { inComment = true; continue; }
    if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { inString = true; stringChar = c; continue; }
    
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0 && c === ']') { endIdx = i; break; }
    }
  }
  
  if (endIdx === -1) return { tasks: [], error: 'Fann ikkje slutt-] på array.' };
  
  const arrayStr = content.substring(startIdx, endIdx + 1);
  
  // Evaluer via Function-konstruktør (trygt sidan vi har vald kva filer som går inn)
  try {
    const tasks = new Function('return ' + arrayStr)();
    if (!Array.isArray(tasks)) return { tasks: [], error: 'Variabelen er ikkje ein array.' };
    return { tasks, error: null };
  } catch (e) {
    return { tasks: [], error: 'Parse-feil: ' + e.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// VALIDATORAR
// ═══════════════════════════════════════════════════════════════

const findings = [];

function report(nivå, kat, type, melding, kontekst) {
  findings.push({ nivå, kat, type, melding, kontekst, fil: currentFile });
}

let currentFile = '';
let isNynorsk = true;

function describeTask(t, idx) {
  const kat = t.kat || '?';
  const typ = t.type || '?';
  const qStart = (t.q || '').substring(0, 60).replace(/\n/g, ' ');
  return `[${idx}] ${kat}/${typ}: «${qStart}…»`;
}

// ─── ERROR-nivå: kritiske bugs ─────────────────────────────────

function sjekk_tomFasit(t, idx) {
  if (t.type === 'mc' || t.type === 'cloze') {
    if (t.fasit === undefined || t.fasit === null || t.fasit === '') {
      report('ERROR', t.kat, t.type, 'Tom eller manglande fasit', describeTask(t, idx));
    }
  }
  if (t.type === 'fillsel' && Array.isArray(t.items)) {
    t.items.forEach((it, j) => {
      if (it.fasit === undefined || it.fasit === null || it.fasit === '') {
        report('ERROR', t.kat, t.type, `Tom fasit i fillsel-item ${j}`, describeTask(t, idx));
      }
    });
  }
}

function sjekk_fasitUtanforAlternativ(t, idx) {
  // mc: fasit kan vere streng (verdi) eller number (indeks i alt-arrayet)
  if (t.type === 'mc' && Array.isArray(t.alt) && (t.fasit !== undefined && t.fasit !== null)) {
    if (typeof t.fasit === 'number') {
      if (!Number.isInteger(t.fasit) || t.fasit < 0 || t.fasit >= t.alt.length) {
        report('ERROR', t.kat, t.type,
          `Fasit-indeks ${t.fasit} er utanfor alt-rangen [0–${t.alt.length - 1}]`,
          describeTask(t, idx));
      }
    } else if (typeof t.fasit === 'string') {
      if (!t.alt.includes(t.fasit)) {
        report('ERROR', t.kat, t.type,
          `Fasit «${t.fasit}» finst IKKJE blant alternativa: [${t.alt.join(' | ')}]`,
          describeTask(t, idx));
      }
    }
  }
  if (t.type === 'fillsel' && Array.isArray(t.items)) {
    t.items.forEach((it, j) => {
      if (!Array.isArray(it.alt) || it.fasit === undefined || it.fasit === null) return;
      if (typeof it.fasit === 'number') {
        if (!Number.isInteger(it.fasit) || it.fasit < 0 || it.fasit >= it.alt.length) {
          report('ERROR', t.kat, t.type,
            `Fillsel-item ${j}: fasit-indeks ${it.fasit} utanfor alt-range`,
            describeTask(t, idx));
        }
      } else if (typeof it.fasit === 'string' && !it.alt.includes(it.fasit)) {
        report('ERROR', t.kat, t.type,
          `Fillsel-item ${j}: fasit «${it.fasit}» finst ikkje blant alt [${it.alt.join(' | ')}]`,
          describeTask(t, idx));
      }
    });
  }
}

function sjekk_duplikatAlternativ(t, idx) {
  // MC med duplikatalternativ
  if (t.type === 'mc' && Array.isArray(t.alt)) {
    const sett = new Set();
    t.alt.forEach(a => {
      const norm = String(a).trim().toLowerCase();
      if (sett.has(norm)) {
        report('ERROR', t.kat, t.type,
          `Duplikat alternativ: «${a}» finst fleire gonger`,
          describeTask(t, idx));
      }
      sett.add(norm);
    });
  }
  // drag_kolonne med same ord + ulik fasit (klassisk grøn/grønn-bug)
  if (t.type === 'drag_kolonne' && Array.isArray(t.ord)) {
    const map = new Map();
    t.ord.forEach(o => {
      if (!o || !o.tekst) return;
      const norm = String(o.tekst).trim().toLowerCase();
      if (map.has(norm) && map.get(norm) !== o.fasit) {
        report('ERROR', t.kat, t.type,
          `Duplikat-bug: ordet «${o.tekst}» står to gonger med ulik fasit`,
          describeTask(t, idx));
      }
      map.set(norm, o.fasit);
    });
  }
}

function sjekk_fillselItemsStruktur(t, idx) {
  if (t.type !== 'fillsel') return;
  if (!Array.isArray(t.items)) {
    report('ERROR', t.kat, t.type, 'Fillsel manglar items-array', describeTask(t, idx));
    return;
  }
  t.items.forEach((it, j) => {
    if (!Array.isArray(it.alt)) {
      report('ERROR', t.kat, t.type, `Fillsel-item ${j} manglar alt-array`, describeTask(t, idx));
    }
  });
}

function sjekk_sannUsannStruktur(t, idx) {
  if (t.type !== 'sann_usann_serie') return;
  if (!Array.isArray(t.paastandar) || t.paastandar.length === 0) {
    report('ERROR', t.kat, t.type, 'sann_usann_serie manglar paastandar', describeTask(t, idx));
    return;
  }
  t.paastandar.forEach((p, j) => {
    if (typeof p.sann !== 'boolean') {
      report('ERROR', t.kat, t.type, `Påstand ${j}: «sann» er ikkje boolean`, describeTask(t, idx));
    }
    if (!p.tekst) {
      report('ERROR', t.kat, t.type, `Påstand ${j} manglar tekst`, describeTask(t, idx));
    }
  });
}

function sjekk_fixErrorsKonsistens(t, idx) {
  if (t.type !== 'fix') return;
  if (!t.tekst) {
    report('ERROR', t.kat, t.type, 'Fix manglar tekst-felt', describeTask(t, idx));
    return;
  }
  if (!t.errors || typeof t.errors !== 'object') {
    report('ERROR', t.kat, t.type, 'Fix manglar errors-objekt', describeTask(t, idx));
    return;
  }
  // Alle error-nøklar må finnast i teksten
  Object.keys(t.errors).forEach(key => {
    if (!t.tekst.includes(key)) {
      report('ERROR', t.kat, t.type,
        `Fix-feilmål «${key}» finst IKKJE i tekstfeltet`,
        describeTask(t, idx));
    }
  });
}

function sjekk_dragKolonneStruktur(t, idx) {
  if (t.type !== 'drag_kolonne') return;
  const harOrd = Array.isArray(t.ord);
  const harKolonner = Array.isArray(t.kolonner);
  if (!harOrd || !harKolonner) {
    report('ERROR', t.kat, t.type, 
      `drag_kolonne manglar ${!harOrd ? 'ord' : ''}${!harOrd && !harKolonner ? ' og ' : ''}${!harKolonner ? 'kolonner' : ''}`,
      describeTask(t, idx));
    return;
  }
  // fasit må peike til gyldig kolonneindeks
  t.ord.forEach((o, j) => {
    if (typeof o.fasit !== 'number' || o.fasit < 0 || o.fasit >= t.kolonner.length) {
      report('ERROR', t.kat, t.type,
        `Ord ${j} («${o.tekst}»): fasit ${o.fasit} er utanfor kolonnerange [0-${t.kolonner.length - 1}]`,
        describeTask(t, idx));
    }
  });
}

function sjekk_typografi(t, idx) {
  const felt = [t.q, t.regel, t.eks, t.hint, t.tekst].filter(Boolean);
  felt.forEach((tekst, f) => {
    if (typeof tekst !== 'string') return;
    CONFIG.typofeilMonster.forEach(({ regex, text, nivå }) => {
      const match = tekst.match(regex);
      if (match) {
        report(nivå, t.kat, t.type,
          `Typografi: ${text} i felt ${['q','regel','eks','hint','tekst'][f] || f}`,
          describeTask(t, idx));
      }
    });
  });
  // Sjekk også alt-array for typografi
  if (Array.isArray(t.alt)) {
    t.alt.forEach((a, j) => {
      if (typeof a !== 'string') return;
      if (/^\s|\s$/.test(a)) {
        report('WARN', t.kat, t.type,
          `Alternativ ${j} har leading eller trailing whitespace: «${a}»`,
          describeTask(t, idx));
      }
      if (/\s\.|\s,/.test(a)) {
        report('ERROR', t.kat, t.type,
          `Alternativ ${j} har teikn med mellomrom framfor: «${a}»`,
          describeTask(t, idx));
      }
    });
  }
}

function sjekk_kjendeBugsIFil(rawJson) {
  // Køyrast ein gong per fil, ikkje per oppgåve
  CONFIG.kjendeBugs.forEach(({ monster, melding, nivå }) => {
    if (monster.test(rawJson)) {
      report(nivå, '(filnivå)', 'fil', melding, '(søkt i heile fila)');
    }
  });
}

// ─── WARN-nivå: kvalitet ──────────────────────────────────────

function sjekk_manglandePedagogiskeFelt(t, idx) {
  if (!t.regel) {
    report('WARN', t.kat, t.type, 'Manglar regel-felt (tilbakemelding)', describeTask(t, idx));
  } else if (t.regel.length < 20) {
    report('WARN', t.kat, t.type, `Regelfelt er kort (${t.regel.length} tegn) – gir sjeldan nyttig vegleiing`, describeTask(t, idx));
  }
  if (!t.eks && !['sann_usann_serie','drag_kolonne','sorter_rekke','klikk_marker','avsnitt_klikk','burger_sort','finn_feil'].includes(t.type)) {
    report('INFO', t.kat, t.type, 'Manglar eks-felt (døme)', describeTask(t, idx));
  }
}

function sjekk_maalformBlanding(t, idx) {
  const alleFelt = JSON.stringify({
    q: t.q, regel: t.regel, eks: t.eks, hint: t.hint, tekst: t.tekst, alt: t.alt
  }).toLowerCase();
  
  // Hjelpar: bygg regex med word boundary for å unngå substring-treff (t.d. "deg" inneheld "eg")
  const matchOrd = ord => {
    const rein = ord.trim().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`(^|[^a-zæøåA-ZÆØÅ])${rein}([^a-zæøåA-ZÆØÅ]|$)`, 'i').test(alleFelt);
  };
  
  if (isNynorsk) {
    CONFIG.bokmaalFlagg.forEach(ord => {
      if (matchOrd(ord)) {
        report('WARN', t.kat, t.type,
          `Mogleg bokmålsord i nynorskbank: «${ord.trim()}»`,
          describeTask(t, idx));
      }
    });
  } else {
    CONFIG.nynorskFlagg.forEach(ord => {
      if (matchOrd(ord)) {
        report('WARN', t.kat, t.type,
          `Mogleg nynorskord i bokmålsbank: «${ord.trim()}»`,
          describeTask(t, idx));
      }
    });
  }
}

function sjekk_fasitVarianter(t, idx) {
  // Når fasit_v finst: alle variantar bør vere representerte som alternativ i MC
  if (t.type === 'mc' && Array.isArray(t.fasit_v) && Array.isArray(t.alt)) {
    const altLower = t.alt.map(a => String(a).toLowerCase().trim());
    t.fasit_v.forEach(v => {
      if (!altLower.includes(String(v).toLowerCase().trim())) {
        report('WARN', t.kat, t.type,
          `fasit_v inneheld «${v}» som ikkje er blant alternativa – eleven kan ikkje velje det`,
          describeTask(t, idx));
      }
    });
  }
}

function sjekk_vanskegrad(t, idx) {
  const gyldige = ['lett', 'medium', 'middels', 'vanskeleg', 'vanskelig'];
  if (!t.vanske) {
    report('WARN', t.kat, t.type, 'Manglar vanske-felt', describeTask(t, idx));
  } else if (!gyldige.includes(t.vanske)) {
    report('WARN', t.kat, t.type, `Ukjent vanske-verdi: «${t.vanske}»`, describeTask(t, idx));
  }
}

function sjekk_burgerStandardisering(t, idx) {
  if (t.type !== 'burger_sort') return;
  if (!Array.isArray(t.avsnitt) || !Array.isArray(t.lag)) return;
  
  // Tel avsnitt per lag
  const laagTeljar = {};
  t.avsnitt.forEach(a => {
    laagTeljar[a.lag] = (laagTeljar[a.lag] || 0) + 1;
  });
  
  // Standardmønster: 1 innleiing + 2-3 hovuddel + 1 avslutning
  if (t.lag.length === 3) {
    const inn = laagTeljar[0] || 0;
    const hov = laagTeljar[1] || 0;
    const avs = laagTeljar[2] || 0;
    if (inn !== 1 || avs !== 1) {
      report('WARN', t.kat, t.type,
        `Burger-struktur ikkje standard: ${inn} innleiing, ${hov} hovuddel, ${avs} avslutning (forventa 1-[2-3]-1)`,
        describeTask(t, idx));
    }
    if (hov < 2 || hov > 3) {
      report('WARN', t.kat, t.type,
        `Hovuddel har ${hov} avsnitt – anbefalt 2-3 for konsistens på tvers av oppgåver`,
        describeTask(t, idx));
    }
  }
}

function sjekk_klikkMarkerKonsistens(t, idx) {
  if (t.type !== 'klikk_marker' && t.type !== 'finn_feil') return;
  const fasitOrd = t.fasit_ord || t.fasit_feil;
  if (!Array.isArray(fasitOrd)) return;
  if (!t.tekst) return;
  
  // Alle fasitord må finnast i teksten
  fasitOrd.forEach(ord => {
    if (!t.tekst.includes(ord)) {
      report('ERROR', t.kat, t.type,
        `${t.type}: fasit-ord «${ord}» finst ikkje i tekstfeltet`,
        describeTask(t, idx));
    }
  });
}

// ─── INFO-nivå: pedagogisk stil ───────────────────────────────

function sjekk_karikerteDistraktorar(t, idx) {
  if (!Array.isArray(t.alt)) return;
  t.alt.forEach((a, j) => {
    if (typeof a !== 'string') return;
    CONFIG.karikerteForstavingar.forEach(f => {
      if (a.toLowerCase().includes(f.toLowerCase())) {
        report('INFO', t.kat, t.type,
          `Mogleg karikert distraktor: «${a}» (startar med «${f}» – sjeldan reell elevfeil)`,
          describeTask(t, idx));
      }
    });
    // Alternativ som er openbert tulleball: CAPS, !!!, emojiar
    if (/^[A-ZÆØÅ\s!]+!{2,}/.test(a)) {
      report('INFO', t.kat, t.type,
        `Alternativ ${j} er i CAPS med utropsteikn: «${a}» – pedagogisk svakt`,
        describeTask(t, idx));
    }
  });
}

function sjekk_overforsterkarar(t, idx) {
  const tekst = [t.q, t.regel].filter(Boolean).join(' ');
  CONFIG.overforsterkarar.forEach(f => {
    if (tekst.includes(f)) {
      report('INFO', t.kat, t.type,
        `Overdriven forsterkar i oppgåvetekst: «${f}»`,
        describeTask(t, idx));
    }
  });
}

function sjekk_modelsvarTarStilling(t, idx) {
  if (t.type !== 'open') return;
  if (!t.eksempel_god) return;
  const sluttord = ['bør', 'må', 'skal', 'er nødvendig', 'er viktig'];
  const sisteSetning = t.eksempel_god.split(/[.!?]/).filter(s => s.trim()).slice(-1)[0] || '';
  const lavLagt = sisteSetning.toLowerCase();
  sluttord.forEach(ord => {
    if (lavLagt.includes(ord)) {
      report('INFO', t.kat, t.type,
        `Modellsvar sluttar med konklusjon som tek stilling: «…${sisteSetning.trim().substring(0, 50)}…» – drøftingsoppgåver bør vise korleis ein drøftar, ikkje kva ein landar på`,
        describeTask(t, idx));
      return; // berre ein rapport per oppgåve
    }
  });
}

function sjekk_maaIkkjeHaStrengt(t, idx) {
  if (!Array.isArray(t.maa_ikkje_ha) || t.maa_ikkje_ha.length === 0) return;
  if (t.type === 'omskriv') {
    report('INFO', t.kat, t.type,
      `Omskriv-oppgåve har maa_ikkje_ha: [${t.maa_ikkje_ha.join(', ')}] – vurder å gjere dette til vegleiing i regel-feltet i staden for strenge feilreglar`,
      describeTask(t, idx));
  }
}

// ═══════════════════════════════════════════════════════════════
// HOVUDFUNKSJON
// ═══════════════════════════════════════════════════════════════

function validateFile(filepath) {
  currentFile = path.basename(filepath);
  isNynorsk = !currentFile.includes('-bm-');
  
  const { tasks, error } = parseBank(filepath);
  if (error) {
    console.error(`\n[${currentFile}] KRITISK: Kan ikkje parse fila: ${error}`);
    return { tasks: 0, error };
  }
  
  // Rå JSON for regex-sjekkar
  const rawJson = fs.readFileSync(filepath, 'utf8');
  
  // Filnivå-sjekk av kjende bugs (ein gong per fil)
  sjekk_kjendeBugsIFil(rawJson);
  
  // Kategoristatistikk
  const katTel = {};
  tasks.forEach(t => {
    const k = t.kat || '(utan kategori)';
    katTel[k] = (katTel[k] || 0) + 1;
  });
  
  // Valideringar per oppgåve
  tasks.forEach((t, idx) => {
    // ERROR
    sjekk_tomFasit(t, idx);
    sjekk_fasitUtanforAlternativ(t, idx);
    sjekk_duplikatAlternativ(t, idx);
    sjekk_fillselItemsStruktur(t, idx);
    sjekk_sannUsannStruktur(t, idx);
    sjekk_fixErrorsKonsistens(t, idx);
    sjekk_dragKolonneStruktur(t, idx);
    sjekk_typografi(t, idx);
    sjekk_klikkMarkerKonsistens(t, idx);
    
    // WARN
    sjekk_manglandePedagogiskeFelt(t, idx);
    sjekk_maalformBlanding(t, idx);
    sjekk_fasitVarianter(t, idx);
    sjekk_vanskegrad(t, idx);
    sjekk_burgerStandardisering(t, idx);
    
    // INFO
    sjekk_karikerteDistraktorar(t, idx);
    sjekk_overforsterkarar(t, idx);
    sjekk_modelsvarTarStilling(t, idx);
    sjekk_maaIkkjeHaStrengt(t, idx);
  });
  
  // Global sjekk: duplikat oppgåvespørsmål (sjekkar kat + q + tekst/alt/items – ikkje berre q)
  const qMap = new Map();
  tasks.forEach((t, idx) => {
    if (!t.q) return;
    const innhald = (t.tekst || '') + JSON.stringify(t.alt || '') + JSON.stringify(t.items || '');
    const nøkkel = (t.kat || '') + '::' + t.q.trim().substring(0, 80) + '::' + innhald.substring(0, 200);
    if (qMap.has(nøkkel)) {
      report('WARN', t.kat || '?', t.type || '?',
        `Duplikat oppgåve: same kat+q+innhald som oppgåve ${qMap.get(nøkkel)}`,
        describeTask(t, idx));
    }
    qMap.set(nøkkel, idx);
  });
  
  return { tasks: tasks.length, katTel, error: null };
}

// ═══════════════════════════════════════════════════════════════
// RAPPORT
// ═══════════════════════════════════════════════════════════════

function printReport(args) {
  const filter = args.only ? args.only.split(',') : ['ERROR', 'WARN', 'INFO'];
  const byLevel = { ERROR: [], WARN: [], INFO: [] };
  findings.forEach(f => byLevel[f.nivå].push(f));
  
  if (args.json) {
    const out = {
      summary: {
        total: findings.length,
        error: byLevel.ERROR.length,
        warn: byLevel.WARN.length,
        info: byLevel.INFO.length
      },
      findings: findings.filter(f => filter.includes(f.nivå))
    };
    console.log(JSON.stringify(out, null, 2));
    return byLevel.ERROR.length;
  }
  
  // Tekstrapport
  const C = {
    red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[36m',
    gray: '\x1b[90m', bold: '\x1b[1m', reset: '\x1b[0m'
  };
  
  console.log('\n' + C.bold + '═══════════════════════════════════════════════════════════════' + C.reset);
  console.log(C.bold + '  SKRIVEMEISTEREN – KVALITETSRAPPORT' + C.reset);
  console.log(C.bold + '═══════════════════════════════════════════════════════════════' + C.reset);
  
  ['ERROR', 'WARN', 'INFO'].forEach(nivå => {
    if (!filter.includes(nivå)) return;
    const list = byLevel[nivå];
    if (list.length === 0) return;
    
    const fargeKode = { ERROR: C.red, WARN: C.yellow, INFO: C.blue }[nivå];
    const merking = {
      ERROR: 'KRITISKE FEIL (må rettast – gir eleven feil svar)',
      WARN:  'KVALITETSPROBLEM (bør rettast før testkøyring)',
      INFO:  'PEDAGOGISKE INNSPEL (vurder over tid)'
    }[nivå];
    
    console.log('\n' + fargeKode + C.bold + `── ${nivå} · ${list.length} funn ──` + C.reset);
    console.log(C.gray + merking + C.reset + '\n');
    
    // Gruppér per fil og kategori
    const gruppert = {};
    list.forEach(f => {
      const nøkkel = `${f.fil} / ${f.kat}`;
      if (!gruppert[nøkkel]) gruppert[nøkkel] = [];
      gruppert[nøkkel].push(f);
    });
    
    Object.keys(gruppert).sort().forEach(nøkkel => {
      console.log(C.bold + nøkkel + C.reset);
      gruppert[nøkkel].forEach(f => {
        console.log(`  ${fargeKode}●${C.reset} ${f.melding}`);
        console.log(`    ${C.gray}${f.kontekst}${C.reset}`);
      });
      console.log('');
    });
  });
  
  // Samandrag
  console.log(C.bold + '─── SAMANDRAG ───' + C.reset);
  console.log(`  ${C.red}ERROR${C.reset}: ${byLevel.ERROR.length}`);
  console.log(`  ${C.yellow}WARN${C.reset}:  ${byLevel.WARN.length}`);
  console.log(`  ${C.blue}INFO${C.reset}:  ${byLevel.INFO.length}`);
  console.log(`  Totalt: ${findings.length}\n`);
  
  if (byLevel.ERROR.length === 0) {
    console.log(C.bold + '  ✓ Ingen kritiske feil!' + C.reset + ' Banken kan takle testkøyring.\n');
  } else {
    console.log(C.red + C.bold + `  ⚠ ${byLevel.ERROR.length} kritiske feil må rettast før testkøyring.` + C.reset + '\n');
  }
  
  return byLevel.ERROR.length;
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

function parseArgs(argv) {
  const args = { files: [], json: false, only: null };
  argv.slice(2).forEach(a => {
    if (a === '--json') args.json = true;
    else if (a.startsWith('--only=')) args.only = a.substring(7).toUpperCase();
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else args.files.push(a);
  });
  return args;
}

function printHelp() {
  console.log(`
test-oppgavebank.js – kvalitetstest for Skrivemeisteren

BRUK:
  node test-oppgavebank.js [opsjonar] fil1.js [fil2.js ...]

OPSJONAR:
  --json                Skriv ut JSON i staden for tekstrapport
  --only=ERROR          Vis berre ERROR-funn (eller WARN, INFO, eller ERROR,WARN)
  --help                Denne hjelpeteksten

DØME:
  node test-oppgavebank.js oppgavebank-v2.js oppgavebank-bm-v2.js
  node test-oppgavebank.js --only=ERROR oppgavebank-v2.js
  node test-oppgavebank.js --json *.js > rapport.json

NIVÅ:
  ERROR  = Bugs som gir eleven feil svar (duplikatar, fasit utanfor alt, tomme felt)
  WARN   = Kvalitetsproblem (manglande regel, målformblanding, inkonsistens)
  INFO   = Pedagogisk stil (karikerte distraktorar, overdrivne forsterkarar)

Exit-kode = antall ERROR-funn (0 = ingen kritiske feil).
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.files.length === 0) {
    console.error('Feil: ingen filer spesifiserte. Bruk --help for hjelp.');
    process.exit(2);
  }
  
  args.files.forEach(f => {
    if (!fs.existsSync(f)) {
      console.error(`Feil: fila finst ikkje: ${f}`);
      process.exit(2);
    }
    const result = validateFile(f);
    if (result.error) return;
    if (!args.json) {
      console.log(`\n[${path.basename(f)}] ${result.tasks} oppgåver lasta inn.`);
      const katListe = Object.keys(result.katTel).sort();
      const katStr = katListe.map(k => `${k} (${result.katTel[k]})`).join(', ');
      console.log(`Kategoriar: ${katStr}`);
    }
  });
  
  const errorCount = printReport(args);
  process.exit(errorCount);
}

main();
