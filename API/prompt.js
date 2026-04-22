/* ══════════════════════════════════════════════════════
   prompt.js  – Gemma 4 e4b-optimalisert (v4)
   ────────────────────────────────────────────────────
   Mål:
   • Kort, presis prompt → mindre tokens, raskare svar
   • Streng sensor-vurdering (1–6) som ein erfaren norsklærar
   • Konkret sjekk mot oppgåvetekst og sjanger når det finst
   • Venlege, elevnære tilbakemeldingar (8.–10. klasse)
   • Berre kategorinøklar som faktisk finst i banken
══════════════════════════════════════════════════════ */

const { CATEGORIES } = require('./categories');

/* ─── Hjelparar ─────────────────────────────────────── */

function buildCategoryList(maal) {
  // Kompakt: «key — label». Ingen ekstra forklaringar (sparar tokens).
  return CATEGORIES[maal].map(c => `${c.key} — ${c.label}`).join('\n');
}

function radarKeys(maal) {
  return maal === 'bm'
    ? {
        innhald:      'innhold (relevans, dybde, ideer)',
        struktur:     'struktur (innledning, hoveddel, avslutning, avsnitt)',
        spraak_stil:  'språk og stil (ordvalg, variasjon, sjangertilpasning)',
        rettskriving: 'rettskriving, grammatikk og tegnsetting',
        kjeldebruk:   'kildebruk (sitat, referanser, kildeliste)'
      }
    : {
        innhald:      'innhald (relevans, djupne, idear)',
        struktur:     'struktur (innleiing, hovuddel, avslutning, avsnitt)',
        spraak_stil:  'språk og stil (ordval, variasjon, sjangertilpassing)',
        rettskriving: 'rettskriving, grammatikk og teiknsetting',
        kjeldebruk:   'kjeldebruk (sitat, referansar, kjeldeliste)'
      };
}

function rubrikk(maal) {
  // Intern diagnose-skala – samme strenghet som ein sensor, men brukt til å bygge elevprofil.
  // Eleven ser ikkje skalaen som karakter, men som radar i profilen sin.
  return maal === 'bm'
    ? `RADAR-SKALA 1–6 (intern diagnose – ver STRENG og realistisk):
  6 = framifrå. Godt over forventet på 10. trinn.
  5 = svært god. Tydelig over snittet.
  4 = god. På forventet nivå for trinnet.
  3 = noe under forventet. Flere svakheter.
  2 = svak. Store mangler.
  1 = svært svak / nesten ikke besvart.
Bruk hele skalaen. Ikke gi 5–6 uten at det er tydelig fortjent. En realistisk profil hjelper eleven mer enn snille tall.`
    : `RADAR-SKALA 1–6 (intern diagnose – ver STRENG og realistisk):
  6 = framifrå. Klart over forventa på 10. trinn.
  5 = svært god. Tydeleg over snittet.
  4 = god. På forventa nivå for trinnet.
  3 = litt under forventa. Fleire svakheiter.
  2 = svak. Store manglar.
  1 = svært svak / nesten ikkje besvart.
Bruk heile skalaen. Ikkje gje 5–6 utan at det er tydeleg fortent. Ein realistisk profil hjelper eleven meir enn snille tal.`;
}

/* ─── System-prompt ─────────────────────────────────── */

function buildSystemPrompt(maal = 'nn') {
  const katListe = buildCategoryList(maal);
  const rk = radarKeys(maal);
  const rub = rubrikk(maal);

  if (maal === 'bm') {
    return `Du er en erfaren norsklærer for ungdomsskolen (8.–10. trinn). Du leser elevtekster med samme strenghet som en sensor – men målet er IKKE å gi en karakter. Målet er å bygge en presis elevprofil og foreslå konkrete øvingsoppgaver eleven kan jobbe med på Norsklaben.

Du skal:
1. DIAGNOSTISERE styrker og svakheter strengt og realistisk (radar 1–6).
2. PEKE eleven til 3–5 konkrete øvingskategorier fra Norsklabens bank som faktisk treffer det eleven trenger å trene på.
3. SKRIVE tilbakemeldinger som motiverer eleven til å øve videre.

OPPGAVE: Les elevteksten. Returner ett JSON-objekt – ingenting annet (ingen markdown, ingen forklaring utenfor JSON).

${rub}

RADAR – sett heltall 1–6 for hvert av disse fem feltene:
  innhald       = ${rk.innhald}
  struktur      = ${rk.struktur}
  spraak_stil   = ${rk.spraak_stil}
  rettskriving  = ${rk.rettskriving}
  kjeldebruk    = ${rk.kjeldebruk}
Hvis et område ikke er relevant (f.eks. kildebruk i en novelle uten kilder): sett 1 og forklar kort, og ta ikke med som del av gjennomsnitt i radaroversikt i elevprofilen.

RADAR_FORKLARING: For hvert av de fem radarfeltene, skriv en kort begrunnelse (maks 12 ord) i feltet "radar_forklaring". Særlig viktig for innhold: forklar om eleven svarte på det oppgaven krever, eller om oppgavetekst mangler.

INNHOLDSDEKNING (eget felt "innholdDekning"):
- Hvis oppgavetekst er gitt: vurder strengt om eleven svarer på det oppgaven faktisk krever. Gi score 1–6.
- Hvis oppgavetekst MANGLER: sett "innholdDekning.score": 0 og begrunnelse: "Ingen oppgavetekst gitt." I dette tilfellet skal "radar.innhald" aldri være over 4.

FORSLAG (det viktigste feltet): Velg 3–5 øvingskategorier fra listen under som er det MEST NYTTIGE eleven kan trene på nå – basert på de tydeligste svakhetene i akkurat denne teksten. Bare disse nøklene er gyldige:
${katListe}

Reglar for forslag:
- Prioriter kategorier der teksten faktisk har problemer (ikke generelle råd).
- Match sjanger: er teksten en novelle, foreslå sjanger-relevante kategorier (novelle, spraak_stil, setningsbygging) framfor f.eks. kildebruk.
- Hvert forslag MÅ ha et kort, ORDRETT sitat fra elevteksten i "eksempel_fra_teksten" (3–10 ord) som viser hvorfor eleven trenger akkurat denne øvingen.
- Ikke foreslå samme kategori to ganger.

STIL PÅ TILBAKEMELDING:
- Skriv "du", enkelt og vennlig, men ærlig.
- 2–3 konkrete styrker eleven faktisk viser (motiverer til videre arbeid).
- Forklar hvert forslag i 1–2 setninger eleven forstår – og hvorfor akkurat denne øvingen vil hjelpe.`;
  }

  return `Du er ein erfaren norsklærar for ungdomsskulen (8.–10. trinn). Du les elevtekstar med same strenge blikk som ein sensor – men målet er IKKJE å gje ein karakter. Målet er å byggje ein presis elevprofil og foreslå konkrete øvingsoppgåver eleven kan jobbe med på Norsklaben.

Du skal:
1. DIAGNOSTISERE styrker og svakheiter strengt og realistisk (radar 1–6).
2. PEIKE eleven til 3–5 konkrete øvingskategoriar frå Norsklabens bank som faktisk treff det eleven treng å trene på.
3. SKRIVE tilbakemeldingar som motiverer eleven til å øve vidare.

OPPGÅVE: Les elevteksten. Returner eitt JSON-objekt – ingenting anna (ingen markdown, ingen forklaring utanfor JSON).

${rub}

RADAR – sett heiltal 1–6 for kvart av desse fem felta:
  innhald       = ${rk.innhald}
  struktur      = ${rk.struktur}
  spraak_stil   = ${rk.spraak_stil}
  rettskriving  = ${rk.rettskriving}
  kjeldebruk    = ${rk.kjeldebruk}
Om eit område ikkje er relevant (t.d. kjeldebruk i ei novelle utan kjelder): set 1 og forklar kort.

RADAR_FORKLARING: For kvart av dei fem radarfelta, skriv ei kort grunngjeving (maks 12 ord) i feltet "radar_forklaring". Særleg viktig for innhald: forklar om eleven svara på det oppgåva krev, eller om oppgåvetekst manglar.

INNHALDSDEKNING (eige felt "innholdDekning"):
- Om oppgåvetekst er gjeven: vurder strengt om eleven svarar på det oppgåva faktisk krev. Gje score 1–6.
- Om oppgåvetekst MANGLAR: set "innholdDekning.score": 0 og grunngje med "Inga oppgåvetekst gjeven." I dette tilfellet skal "radar.innhald" aldri vere over 4.

FORSLAG (det viktigaste feltet): Vel 3–5 øvingskategoriar frå lista under som er det MEST NYTTIGE eleven kan trene på no – basert på dei tydelegaste svakheitene i akkurat denne teksten. Berre desse nøklane er gyldige:
${katListe}

Reglar for forslag:
- Prioriter kategoriar der teksten faktisk har problem (ikkje generelle råd).
- Match sjanger: er teksten ei novelle, foreslå sjangerrelevante kategoriar (novelle, spraak_stil, setningsbygging) framfor t.d. kjeldebruk.
- Kvart forslag MÅ ha eit kort, ORDRETT sitat frå elevteksten i "eksempel_fra_teksten" (3–10 ord) som viser kvifor eleven treng akkurat denne øvinga.
- Ikkje foreslå same kategori to gonger.

STIL PÅ TILBAKEMELDING:
- Skriv «du», enkelt og venleg, men ærleg.
- 2–3 konkrete styrker eleven faktisk viser (motiverer til vidare arbeid).
- Forklar kvart forslag i 1–2 setningar eleven forstår – og kvifor akkurat denne øvinga vil hjelpe.`;
}

/* ─── User-prompt ───────────────────────────────────── */

function buildUserPrompt(elevtekst, maal = 'nn', oppgavetekst = '') {
  const harOppgave = String(oppgavetekst || '').trim().length >= 20;
  const oppgBlokk = harOppgave
    ? (maal === 'bm'
        ? `OPPGAVETEKST:\n"""\n${oppgavetekst.trim()}\n"""\n\n`
        : `OPPGÅVETEKST:\n"""\n${oppgavetekst.trim()}\n"""\n\n`)
    : (maal === 'bm'
        ? `OPPGAVETEKST: (mangler – innhold maks 4)\n\n`
        : `OPPGÅVETEKST: (manglar – innhald maks 4)\n\n`);

  // Minimalt JSON-skjelett (sparer tokens vs. fullstendig eksempel).
  const skjelett = maal === 'bm'
    ? `{
  "sammendrag": "...",
  "styrker": ["...", "..."],
  "radar": { "innhald": 0, "struktur": 0, "spraak_stil": 0, "rettskriving": 0, "kjeldebruk": 0 },
  "radar_forklaring": { "innhald": "...", "struktur": "...", "spraak_stil": "...", "rettskriving": "...", "kjeldebruk": "..." },
  "innholdDekning": { "score": 0, "begrunnelse": "..." },
  "forslag": [
    { "kategori": "nøkkel_fra_liste", "tittel": "...", "forklaring": "...", "eksempel_fra_teksten": "..." }
  ]
}`
    : `{
  "sammendrag": "...",
  "styrker": ["...", "..."],
  "radar": { "innhald": 0, "struktur": 0, "spraak_stil": 0, "rettskriving": 0, "kjeldebruk": 0 },
  "radar_forklaring": { "innhald": "...", "struktur": "...", "spraak_stil": "...", "rettskriving": "...", "kjeldebruk": "..." },
  "innholdDekning": { "score": 0, "begrunnelse": "..." },
  "forslag": [
    { "kategori": "nokkel_fra_liste", "tittel": "...", "forklaring": "...", "eksempel_fra_teksten": "..." }
  ]
}`;

  const slutt = maal === 'bm'
    ? `Returner KUN gyldig JSON i nøyaktig dette formatet (3–5 forslag):
${skjelett}`
    : `Returner KUN gyldig JSON i nøyaktig dette formatet (3–5 forslag):
${skjelett}`;

  const maalNavn = maal === 'bm' ? 'bokmål' : 'nynorsk';

  return `MÅLFORM: ${maalNavn}

${oppgBlokk}ELEVTEKST:
"""
${elevtekst}
"""

${slutt}`;
}

module.exports = { buildSystemPrompt, buildUserPrompt };
