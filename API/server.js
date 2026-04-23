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

const PORT        = process.env.PORT        || 3000;
const OLLAMA_URL  = process.env.OLLAMA_URL  || 'http://localhost:11434';
const OLLAMA_MODEL= process.env.OLLAMA_MODEL|| 'gemma4:e4b';
const MAX_TEKST   = parseInt(process.env.MAX_TEKST || '6000', 10);
const NUM_THREAD  = parseInt(process.env.OLLAMA_NUM_THREAD || String(Math.max(1, os.cpus().length)), 10);
const NUM_CTX     = parseInt(process.env.OLLAMA_NUM_CTX || '4096', 10);
const NUM_PREDICT = parseInt(process.env.OLLAMA_NUM_PREDICT || '2048', 10);
const KEEP_ALIVE  = process.env.OLLAMA_KEEP_ALIVE || '24h';

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

/* ─── Ollama-klient ────────────────────────────────── */

/* Enkel FIFO-kø: CPU-inferens er single-stream, så to samtidige
   requests blir samla tregare enn éin etter éin. Køen serialiserer
   kall til Ollama. */
let ollamaQueue = Promise.resolve();
let ollamaQueueLen = 0;
function enqueueOllama(taskFn) {
  ollamaQueueLen++;
  const myPos = ollamaQueueLen;
  if (myPos > 1) console.log(`┃ Kø: ventar (posisjon ${myPos})`);
  const run = ollamaQueue.then(() => {
    if (myPos > 1) console.log(`┃ Kø: startar (var posisjon ${myPos})`);
    return taskFn();
  });
  ollamaQueue = run.catch(() => {}).finally(() => { ollamaQueueLen--; });
  return run;
}

async function kallOllama(systemPrompt, userPrompt) {
  return enqueueOllama(() => kallOllamaRaw(systemPrompt, userPrompt));
}

async function kallOllamaRaw(systemPrompt, userPrompt) {
  // Brukar /api/chat med messages-format — fungerer best med
  // instruksjonsmodeller (NorMistral warm, Qwen, osv.)
  const body = {
    model: OLLAMA_MODEL,
    messages: [
      { role: 'system',    content: systemPrompt },
      { role: 'user',      content: userPrompt   }
    ],
    stream: false,
    keep_alive: KEEP_ALIVE,
    // Tvingar JSON-format frå Ollama (støtta av Gemma og dei fleste moderne modellar).
    // Gjer at modellen sluttar når JSON-objektet er ferdig → mykje raskare svar.
    format: 'json',
    options: {
      temperature: 0.3,   // lågare → meir konsistente vurderingar
      top_p: 0.9,
      num_ctx: NUM_CTX,
      num_predict: NUM_PREDICT,  // tak for JSON-svaret; aukast om svaret blir kutta
      repeat_penalty: 1.1,
      num_thread: NUM_THREAD
    },
    think: false
  };

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama-feil ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const doneReason = data.done_reason || data.done || '';
  const evalCount  = data.eval_count || 0;
  const promptCount = data.prompt_eval_count || 0;
  const totalMs    = data.total_duration ? Math.round(data.total_duration / 1e6) : 0;
  console.log(`\n─── OLLAMA-RESPONS ─── done_reason=${doneReason} prompt_tokens=${promptCount} eval_tokens=${evalCount} tid=${totalMs}ms`);
  console.log(JSON.stringify(data).slice(0, 600));
  console.log('─'.repeat(60) + '\n');

  if (doneReason === 'length') {
    console.warn(`⚠️  Svaret blei kutta (nådde num_predict=${NUM_PREDICT}). Vurder å auke OLLAMA_NUM_PREDICT.`);
  }

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
    res.json({
      status: 'ok',
      ollama: ok ? 'tilkopla' : 'ikkje tilkopla',
      modell: OLLAMA_MODEL,
      installerte_modellar: tags?.models?.map(m => m.name) || []
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

app.post('/api/analyser-tekst', async (req, res) => {
  try {
    const tekst = String(req.body?.tekst || '').trim();
    const maal  = req.body?.maal === 'bm' ? 'bm' : 'nn';
    const sjanger = String(req.body?.sjanger || '').trim().slice(0, 80);
    let oppgave = String(req.body?.oppgave || '').trim();

    if (sjanger) {
      const sjangerLinje = maal === 'bm' ? `Sjanger: ${sjanger}` : `Sjanger: ${sjanger}`;
      oppgave = oppgave ? `${sjangerLinje}\n${oppgave}` : sjangerLinje;
    }

    if (!tekst) {
      return res.status(400).json({ feil: 'Manglar "tekst" i body.' });
    }
    if (tekst.length > MAX_TEKST) {
      return res.status(400).json({ feil: `Teksten er for lang (maks ${MAX_TEKST} teikn).` });
    }

    const sys  = buildSystemPrompt(maal);
    const user = buildUserPrompt(tekst, maal, oppgave);

    let raw  = await kallOllama(sys, user);
    console.log('\n─── RAW LLM-SVAR ───────────────────────────────');
    console.log(raw.slice(0, 1500));
    console.log('─'.repeat(60) + '\n');

    let json = extractJson(raw);

    // Retry éin gong om svaret var tomt eller ikkje kunne tolkast som JSON
    if (!json || !raw) {
      console.warn('⚠️  Første forsok feila (tomt eller ugyldig JSON). Prøver éin gong til …');
      raw = await kallOllama(sys, user);
      console.log('\n─── RAW LLM-SVAR (retry) ──────────────────');
      console.log(raw.slice(0, 1500));
      console.log('─'.repeat(60) + '\n');
      json = extractJson(raw);
    }

    if (!json) {
      return res.status(502).json({
        feil: 'Klarte ikkje å tolke svaret frå modellen som JSON.',
        raw: raw.slice(0, 800)
      });
    }

    const normalisert = normaliser(json, maal);

    if (!normalisert.forslag.length) {
      return res.status(200).json({
        ...normalisert,
        merknad: 'Modellen gav ingen gyldige kategoriforslag. Prøv ein lengre tekst eller køyr på nytt.'
      });
    }

    res.json(normalisert);
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
  console.log(`║  Trådar: ${String(NUM_THREAD).padEnd(4)} · num_ctx: ${String(NUM_CTX).padEnd(5)} · keep_alive: ${KEEP_ALIVE.padEnd(6)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});