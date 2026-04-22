/* ══════════════════════════════════════════════════════
   server.js
   Norsklaben – lokal analyse-API for elevtekstar
   Node.js + Express + Ollama (NorMistral 7B)
   ────────────────────────────────────────────────────
   Endepunkt:
     GET  /api/health             – statussjekk
     GET  /api/kategoriar?maal=nn – liste over kategoriar
     POST /api/analyser-tekst     – analyser ein elevtekst
                                    body: { tekst, maal, oppgave }
   ────────────────────────────────────────────────────
   Køyr:
     npm install
     node server.js
══════════════════════════════════════════════════════ */

const express = require('express');
const cors    = require('cors');
const os      = require('os');
const path    = require('path');
const { CATEGORIES } = require('./categories');
const { buildSystemPrompt, buildUserPrompt } = require('./prompt');

const PORT              = process.env.PORT               || 3000;
const OLLAMA_URL        = process.env.OLLAMA_URL         || 'http://localhost:11434';
const OLLAMA_MODEL      = process.env.OLLAMA_MODEL       || 'gemma4:e4b';
const MAX_TEKST         = parseInt(process.env.MAX_TEKST || '6000', 10);
const OLLAMA_NUM_CTX    = parseInt(process.env.OLLAMA_NUM_CTX || '2048', 10);
const OLLAMA_NUM_PREDICT= parseInt(process.env.OLLAMA_NUM_PREDICT || '700', 10);
const OLLAMA_KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || '15m';
const OLLAMA_TIMEOUT_MS = parseInt(process.env.OLLAMA_TIMEOUT_MS || '90000', 10);
const JOB_TTL_MS        = parseInt(process.env.ANALYSE_JOB_TTL_MS || String(15 * 60 * 1000), 10);
const ESTIMERT_ANALYSE_MS = parseInt(process.env.ANALYSE_ESTIMAT_MS || '45000', 10);

const analyseJobs = new Map();
const analyseQueue = [];
let analysererNo = false;
let aktivJobbId = null;
let jobbTeller = 0;

// Finn lokal IP-adresse (første ikke-interne nettverksadresse)
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'ukjent';
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

// 1) Serve widget og demo frå /public
app.use(express.static(path.join(__dirname, 'public')));

// 2) Serve heile Norsklaben-mappa (foreldremappa) –
//    slik at elevar kan opne skrivemeisteren.html, tekstsjekk.html osv.
app.use(express.static(path.join(__dirname, '..')));

/* ─── Hjelpefunksjonar ─────────────────────────────── */

function validKey(maal, key) {
  return CATEGORIES[maal].some(c => c.key === key);
}

function getLabel(maal, key) {
  const c = CATEGORIES[maal].find(c => c.key === key);
  return c ? c.label : key;
}

function buildOppgaveUrl(maal, key) {
  // Matchar eksisterande URL-mønster i oppgavebank(-bm).html
  const base = maal === 'bm' ? 'tekstsjekk-bm.html' : 'tekstsjekk.html';
  return `${base}?kat=${encodeURIComponent(key)}&mode=manual#${encodeURIComponent(key)}`;
}

/**
 * Prøv å trekke ut eit JSON-objekt frå ein rå LLM-respons.
 * NorMistral 7B følgjer ikkje alltid format-instruksjonar perfekt,
 * så vi leitar etter den fyrste «{ ... }» som parser som gyldig JSON.
 */
function extractJson(raw) {
  if (!raw || typeof raw !== 'string') return null;

  // Fjern <think>...</think>-blokkar (Qwen3 og andre reasoning-modellar)
  let txt = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Fjern markdown-code-fences om dei finst
  txt = txt
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  // Direkte forsøk
  try { return JSON.parse(txt); } catch (_) {}

  // Finn fyrste balanserte { ... }
  const start = txt.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < txt.length; i++) {
    const c = txt[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        const candidate = txt.slice(start, i + 1);
        try { return JSON.parse(candidate); } catch (_) { /* prøv vidare */ }
      }
    }
  }
  return null;
}

/**
 * Normaliser og valider svaret frå LLMen.
 * Kastar ut forslag med ugyldige kategorinøklar og legg til
 * label + URL slik at frontend kan vise ferdige lenker.
 * Inkluderer radar-vurdering (1–6) for fem kompetanseområde.
 */

const RADAR_NØKLAR = ['innhald', 'struktur', 'spraak_stil', 'rettskriving', 'kjeldebruk'];

function normaliserRadar(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const radar = {};
  let harVerdiar = false;

  for (const nøkkel of RADAR_NØKLAR) {
    const val = Number(raw[nøkkel]);
    if (Number.isInteger(val) && val >= 1 && val <= 6) {
      radar[nøkkel] = val;
      harVerdiar = true;
    } else {
      radar[nøkkel] = null; // manglar eller ugyldig verdi
    }
  }

  return harVerdiar ? radar : null;
}

function normaliser(json, maal) {
  if (!json || typeof json !== 'object') return null;

  const forslagRaw = Array.isArray(json.forslag) ? json.forslag : [];
  const forslag = [];

  for (const f of forslagRaw) {
    if (!f || typeof f !== 'object') continue;
    const key = String(f.kategori || f.key || '').trim();
    if (!validKey(maal, key)) continue;                 // hopp over ugyldig nøkkel
    if (forslag.some(x => x.kategori === key)) continue; // unngå duplikat

    forslag.push({
      kategori: key,
      tittel:    f.tittel || getLabel(maal, key),
      forklaring: String(f.forklaring || '').slice(0, 400),
      eksempel_fra_teksten: String(f.eksempel_fra_teksten || f.eksempel || '').slice(0, 300),
      url: buildOppgaveUrl(maal, key)
    });

    if (forslag.length >= 5) break;
  }

  const radar = normaliserRadar(json.radar);

  // Styrker: array av 2–3 korte strenger. Aksepter gammal "positivt"-streng
  // som einaste element for bakoverkompatibilitet.
  let styrker = [];
  if (Array.isArray(json.styrker)) {
    styrker = json.styrker
      .map(s => String(s || '').trim())
      .filter(Boolean)
      .slice(0, 3)
      .map(s => s.slice(0, 220));
  }
  const positivt = String(json.positivt || '').slice(0, 300);
  if (!styrker.length && positivt) styrker = [positivt];

  return {
    sammendrag: String(json.sammendrag || '').slice(0, 600),
    positivt,
    styrker,
    radar,
    forslag
  };
}

function cleanupFinishedJobs() {
  const now = Date.now();
  for (const [id, job] of analyseJobs.entries()) {
    if ((job.status === 'done' || job.status === 'error') && (now - job.updatedAt) > JOB_TTL_MS) {
      analyseJobs.delete(id);
    }
  }
}

function getJobQueuePosition(jobId) {
  if (aktivJobbId === jobId) return 0;
  const idx = analyseQueue.indexOf(jobId);
  return idx === -1 ? null : idx + 1;
}

function serialiseJob(job) {
  const posisjon = getJobQueuePosition(job.id);
  let estimertVentetidSec = 0;

  if (job.status === 'queued' && posisjon != null) {
    estimertVentetidSec = Math.max(5, Math.round((posisjon * ESTIMERT_ANALYSE_MS) / 1000));
  } else if (job.status === 'processing') {
    estimertVentetidSec = Math.max(5, Math.round(ESTIMERT_ANALYSE_MS / 1000));
  }

  return {
    jobbId: job.id,
    status: job.status,
    posisjon,
    estimert_ventetid_sec: estimertVentetidSec,
    oppretta: job.createdAt,
    oppdatert: job.updatedAt,
    resultat: job.resultat || null,
    feil: job.error || null
  };
}

async function analysePayload(payload) {
  const tekst = String(payload?.tekst || '').trim();
  const maal  = payload?.maal === 'bm' ? 'bm' : 'nn';
  const sjanger = String(payload?.sjanger || '').trim().slice(0, 80);
  let oppgave = String(payload?.oppgave || '').trim();

  if (sjanger) {
    const sjangerLinje = `Sjanger: ${sjanger}`;
    oppgave = oppgave ? `${sjangerLinje}\n${oppgave}` : sjangerLinje;
  }

  const sys  = buildSystemPrompt(maal);
  const user = buildUserPrompt(tekst, maal, oppgave);

  const raw  = await kallOllama(sys, user);
  console.log('\n─── RAW LLM-SVAR ───────────────────────────────');
  console.log(raw.slice(0, 1500));
  console.log('────────────────────────────────────────────────\n');

  const json = extractJson(raw);
  if (!json) {
    throw new Error('Klarte ikkje å tolke svaret frå modellen som JSON.');
  }

  const normalisert = normaliser(json, maal);
  if (!normalisert) {
    throw new Error('Modellen gav ugyldig responsstruktur.');
  }

  if (!normalisert.forslag.length) {
    return {
      ...normalisert,
      merknad: 'Modellen gav ingen gyldige kategoriforslag. Prøv ein lengre tekst eller køyr på nytt.'
    };
  }

  return normalisert;
}

function enqueueAnalyse(payload) {
  cleanupFinishedJobs();

  const id = `analyse-${Date.now()}-${++jobbTeller}`;
  const job = {
    id,
    status: 'queued',
    payload,
    resultat: null,
    error: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  job.promise = new Promise((resolve, reject) => {
    job.resolve = resolve;
    job.reject = reject;
  });

  analyseJobs.set(id, job);
  analyseQueue.push(id);
  processAnalyseQueue().catch(err => console.error('[analyseQueue]', err));
  return job;
}

async function processAnalyseQueue() {
  if (analysererNo) return;
  analysererNo = true;

  try {
    while (analyseQueue.length) {
      const jobId = analyseQueue.shift();
      const job = analyseJobs.get(jobId);
      if (!job) continue;

      aktivJobbId = jobId;
      job.status = 'processing';
      job.updatedAt = Date.now();

      try {
        job.resultat = await analysePayload(job.payload);
        job.status = 'done';
        if (typeof job.resolve === 'function') job.resolve(job.resultat);
      } catch (e) {
        job.error = String(e.message || e);
        job.status = 'error';
        if (typeof job.reject === 'function') job.reject(e);
        console.error('[analyser-tekst]', e);
      } finally {
        job.updatedAt = Date.now();
        aktivJobbId = null;
      }
    }
  } finally {
    analysererNo = false;
    cleanupFinishedJobs();
  }
}

/* ─── Ollama-klient ────────────────────────────────── */

async function kallOllama(systemPrompt, userPrompt) {
  // Brukar /api/chat med messages-format — fungerer best med
  // instruksjonsmodeller (NorMistral warm, Qwen, osv.)
  const body = {
    model: OLLAMA_MODEL,
    messages: [
      { role: 'system',    content: systemPrompt },
      { role: 'user',      content: userPrompt   }
    ],
    stream: false,
    format: 'json',
    keep_alive: OLLAMA_KEEP_ALIVE,
    options: {
      temperature: 0.2,
      top_p: 0.9,
      num_ctx: OLLAMA_NUM_CTX,
      num_predict: OLLAMA_NUM_PREDICT,
      repeat_penalty: 1.05
    },
    think: false
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(`Analysen brukte for lang tid (over ${Math.round(OLLAMA_TIMEOUT_MS / 1000)} sekund). Prøv på nytt.`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama-feil ${res.status}: ${txt}`);
  }

  const data = await res.json();
  console.log('\n─── FULL OLLAMA-RESPONS ─────────────────────────');
  console.log(JSON.stringify(data).slice(0, 800));
  console.log('─────────────────────────────────────────────────\n');

  // Qwen3: content kan vere tom om modellen berre fyllte thinking-feltet.
  // Prøv content fyrst, fall tilbake til thinking om content er tom.
  const content  = (data.message && data.message.content)  || '';
  const thinking = (data.message && data.message.thinking) || '';
  return content.trim() || thinking.trim();
}

/* ─── Endepunkt ────────────────────────────────────── */

app.get('/api/health', async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`);
    const ok = r.ok;
    const tags = ok ? await r.json() : null;
    cleanupFinishedJobs();
    res.json({
      status: 'ok',
      ollama: ok ? 'tilkopla' : 'ikkje tilkopla',
      modell: OLLAMA_MODEL,
      installerte_modellar: tags?.models?.map(m => m.name) || [],
      analysekø: {
        ventar: analyseQueue.length,
        behandlar_no: Boolean(aktivJobbId),
        estimert_per_tekst_sec: Math.round(ESTIMERT_ANALYSE_MS / 1000),
        num_ctx: OLLAMA_NUM_CTX,
        num_predict: OLLAMA_NUM_PREDICT
      }
    });
  } catch (e) {
    res.status(500).json({ status: 'feil', melding: String(e.message || e) });
  }
});

app.get('/api/kategoriar', (req, res) => {
  const maal = req.query.maal === 'bm' ? 'bm' : 'nn';
  const list = CATEGORIES[maal].map(c => ({
    key: c.key,
    label: c.label,
    short: c.short,
    url: buildOppgaveUrl(maal, c.key)
  }));
  res.json({ maal, kategoriar: list });
});

app.get('/api/analyser-status/:jobbId', (req, res) => {
  cleanupFinishedJobs();
  const job = analyseJobs.get(String(req.params.jobbId || ''));

  if (!job) {
    return res.status(404).json({ feil: 'Fann ikkje analysejobben.' });
  }

  res.json(serialiseJob(job));
});

app.post('/api/analyser-tekst', async (req, res) => {
  try {
    const tekst = String(req.body?.tekst || '').trim();
    const maal  = req.body?.maal === 'bm' ? 'bm' : 'nn';
    const sjanger = String(req.body?.sjanger || '').trim().slice(0, 80);
    const oppgave = String(req.body?.oppgave || '').trim();

    if (!tekst) {
      return res.status(400).json({ feil: 'Manglar "tekst" i body.' });
    }
    if (tekst.length > MAX_TEKST) {
      return res.status(400).json({ feil: `Teksten er for lang (maks ${MAX_TEKST} teikn).` });
    }

    const job = enqueueAnalyse({ tekst, maal, sjanger, oppgave });
    const resultat = await job.promise;
    return res.json(resultat);
  } catch (e) {
    console.error('[analyser-tekst]', e);
    res.status(500).json({ feil: String(e.message || e) });
  }
});

/* ─── Start ────────────────────────────────────────── */

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         NORSKLAB-API KØYRER                      ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Din PC:     http://localhost:${PORT}                ║`);
  console.log(`║  Elevar:     http://${ip}:${PORT}            ║`);
  console.log('║                                                  ║');
  console.log(`║  Skrivemeisteren: http://${ip}:${PORT}/skrivemeisteren.html ║`);
  console.log(`║  Tekstsjekk:      http://${ip}:${PORT}/tekstsjekk.html      ║`);
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Modell: ${OLLAMA_MODEL.padEnd(41)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});