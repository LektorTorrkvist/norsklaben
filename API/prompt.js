/* ══════════════════════════════════════════════════════
   prompt.js  – Qwen3/Qwen2.5-optimalisert
   ────────────────────────────────────────────────────
   Endringar frå v1:
   • Kortare kategori-liste i systemprompt (nøkkel + label)
   • Detaljert JSON-eksempel med ekte verdiar i user-prompten
   • /no_think i user-prompt for å slå av Qwen3-tenking
   • Elevtekst-analyse vert sendt som user-melding, ikkje system
   Endringar frå v2:
   • Radar-vurdering (1–6) lagt til for fem kompetanseområde:
     innhald, struktur, spraak_stil, rettskriving, kjeldebruk
   • Brukast i radardiagram i elevprofilen på norsklaben.no
══════════════════════════════════════════════════════ */

const { CATEGORIES } = require('./categories');

function buildCategoryList(maal) {
  // Kortare format – berre nøkkel og label, så prompten ikkje vert for lang
  return CATEGORIES[maal]
    .map(c => `${c.key}: ${c.label}`)
    .join('\n');
}

function buildSystemPrompt(maal = 'nn') {
  const katListe = buildCategoryList(maal);

  if (maal === 'bm') {
    return `Du er en norsklærer-assistent. Du leser elevtekster, gir en grundig, helhetlig vurdering, og velger 3–5 øvingskategorier fra en fast liste.

REGLER:
- Svar KUN med et JSON-objekt. Ingen forklaring, ingen markdown, ingen kommentarer.
- Bruk bare kategorinøkler fra listen under (for "forslag").
- Skriv enkelt og vennlig, for en 8.-klassing. Bruk "du".
- Radar-feltet skal alltid inneholde alle fem nøklene med heltall fra 1 til 6.
- "styrker" skal være 2–3 korte, konkrete styrker eleven viser i teksten.
- Hvert forslag MA inneholde et kort, ordrett sitat fra elevteksten i "eksempel_fra_teksten" som viser hvorfor eleven bør jobbe med akkurat denne kategorien.

RADAR-VURDERING (1 = svak, 6 = framifrå):
  innhald       – Innhold og ideer: relevans, kreativitet, dybde
  struktur      – Struktur: innledning, hoveddel, avslutning, avsnitt
  spraak_stil   – Språk og stil: ordvalg, variasjon, tilpasning til sjanger
  rettskriving  – Rettskriving, grammatikk og tegnsetting
  kjeldebruk    – Kildebruk: referanser, sitat, kildeliste

KATEGORIER (for øvingsforslag):
${katListe}`;
  }

  return `Du er ein norsklærar-assistent. Du les elevtekstar, gjev ei grundig, heilskapleg vurdering, og vel 3–5 øvingskategoriar frå ei fast liste.

REGLAR:
- Svar KUN med eit JSON-objekt. Ingen forklaring, ingen markdown, ingen kommentarar.
- Bruk berre kategorinøklar frå lista under (for «forslag»).
- Skriv enkelt og vennleg, for ein 8.-klassing. Bruk «du».
- Radar-feltet skal alltid innehalde alle fem nøklane med heiltal frå 1 til 6.
- «styrker» skal vere 2–3 korte, konkrete styrker eleven viser i teksten.
- Kvart forslag MA innehalde eit kort, ordrett sitat frå elevteksten i «eksempel_fra_teksten» som viser kvifor eleven bør jobbe med akkurat denne kategorien.

RADAR-VURDERING (1 = svak, 6 = framifrå):
  innhald       – Innhald og idear: relevans, kreativitet, djupne
  struktur      – Struktur: innleiing, hovuddel, avslutning, avsnitt
  spraak_stil   – Språk og stil: ordval, variasjon, tilpassing til sjanger
  rettskriving  – Rettskriving, grammatikk og teiknsetting
  kjeldebruk    – Kjeldebruk: referansar, sitat, kjeldeliste

KATEGORIAR (for øvingsforslag):
${katListe}`;
}

function buildUserPrompt(elevtekst, maal = 'nn', oppgavetekst = '') {
  const oppg = oppgavetekst ? `Oppgåve: ${oppgavetekst}\n\n` : '';
  const maalKontekst = maal === 'bm'
    ? 'MALFORM: bokmal\n'
    : 'MALFORM: nynorsk\n';

  const eksempel = maal === 'bm'
    ? `{
  "sammendrag": "Du skriver om et spennende tema og har noen gode ideer.",
  "styrker": [
    "Du bruker konkrete eksempler som gjør teksten levende.",
    "Du har en tydelig stemme og tar leseren med inn i historien."
  ],
  "radar": {
    "innhald": 4,
    "struktur": 3,
    "spraak_stil": 3,
    "rettskriving": 2,
    "kjeldebruk": 1
  },
  "forslag": [
    {
      "kategori": "og_aa",
      "tittel": "Og / å",
      "forklaring": "Du blander av og til 'og' og 'å'. Øv på når du skal bruke hvert av dem.",
      "eksempel_fra_teksten": "likar og gå på tur"
    },
    {
      "kategori": "tegnsetting",
      "tittel": "Tegnsetting",
      "forklaring": "Noen setninger mangler punktum på slutten.",
      "eksempel_fra_teksten": "Det var veldig kult"
    },
    {
      "kategori": "setningsbygging",
      "tittel": "Setningsbygging",
      "forklaring": "Noen setninger er veldig korte og hakker litt. Prøv å koble dem sammen.",
      "eksempel_fra_teksten": "Det var kult. Det var bra. Jeg likte det."
    }
  ]
}`
    : `{
  "sammendrag": "Du skriv om eit spanande tema og har nokre gode idear.",
  "styrker": [
    "Du brukar konkrete eksempel som gjer teksten levande.",
    "Du har ei tydeleg stemme og tek lesaren med inn i forteljinga."
  ],
  "radar": {
    "innhald": 4,
    "struktur": 3,
    "spraak_stil": 3,
    "rettskriving": 2,
    "kjeldebruk": 1
  },
  "forslag": [
    {
      "kategori": "og_aa",
      "tittel": "Og / å",
      "forklaring": "Du blandar av og til 'og' og 'å'. Øv på når du skal bruke kvart av dei.",
      "eksempel_fra_teksten": "likar og gå på tur"
    },
    {
      "kategori": "teiknsetting",
      "tittel": "Teiknsetting",
      "forklaring": "Nokre setningar manglar punktum på slutten.",
      "eksempel_fra_teksten": "Det var veldig kult"
    },
    {
      "kategori": "setningsbygging",
      "tittel": "Setningsbygging",
      "forklaring": "Nokre setningar er veldig korte og hakkar litt. Prøv å binde dei saman.",
      "eksempel_fra_teksten": "Det var kult. Det var bra. Eg likte det."
    }
  ]
}`;

  const radarInstr = maal === 'bm'
    ? `- "radar": objekt med nøyaktig disse fem nøklene (heltall 1–6): innhald, struktur, spraak_stil, rettskriving, kjeldebruk`
    : `- "radar": objekt med nøyaktig desse fem nøklane (heiltal 1–6): innhald, struktur, spraak_stil, rettskriving, kjeldebruk`;

  return `${maalKontekst}${oppg}ELEVTEKST:
"""
${elevtekst}
"""

Analyser teksten. Returner eit JSON-objekt med nøyaktig dette formatet (3–5 forslag):
${eksempel}

KRAV TIL JSON-SVARET:
- "sammendrag": kort oppsummering av teksten (1–2 setningar)
- "styrker": liste med 2–3 korte, konkrete styrker eleven viser
${radarInstr}
- "forslag": liste med 3–5 øvingsforslag knytt til kategorinøklar frå lista. Kvart forslag MA ha eit kort, ordrett sitat frå teksten i "eksempel_fra_teksten".

VIKTIG: Skriv KUN JSON. Ingen tekst utanfor JSON-objektet.`;
}

module.exports = { buildSystemPrompt, buildUserPrompt };
