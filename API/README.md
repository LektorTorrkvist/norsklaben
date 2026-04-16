# Norsklab-API – lokal elevtekstanalyse

Lokal Node.js-server som tek imot ein elevtekst, sender han til **NorMistral 7B** via **Ollama**, og returnerer 3–5 konkrete øvingsforslag som lenkjer direkte til kategoriar i oppgåvebanken på Norsklaben.

Språket i svaret er tilpassa elevar i 8. klasse med svakt fagvokabular.

## Kva ligg i mappa

```
norsklab-api/
├── server.js              # Express-server (endepunkt + Ollama-kall)
├── prompt.js              # Systemprompt for NorMistral (nn + bm)
├── categories.js          # Alle 24/27 kategoriane med label, URL og forklaring
├── package.json
├── .env.example
└── public/
    ├── tekstanalyse.js    # Frontend-widget (CSS + JS i eitt)
    └── demo.html          # Testside for widgeten
```

## 1) Installer Ollama og last ned NorMistral

1. Installer Ollama frå <https://ollama.com/download>
2. Last ned modellen (éin gong):
   ```bash
   ollama pull normistral:7b
   ```
   > Viss du har ei anna NorMistral-variant (t.d. `normistral:7b-warm-instruct`), oppdater `OLLAMA_MODEL` i `.env`.
3. Sjekk at Ollama køyrer:
   ```bash
   curl http://localhost:11434/api/tags
   ```

## 2) Start API-et

```bash
cd norsklab-api
npm install
npm start
```

Serveren køyrer då på <http://localhost:3000>.

Sjekk at alt er i orden:
```bash
curl http://localhost:3000/api/health
```
Du skal sjå `"ollama":"tilkopla"` og ei liste over installerte modellar.

## 3) Test i nettlesaren

Opne <http://localhost:3000/demo.html>, lim inn ein elevtekst, trykk **Analyser**. Du får:

- eit vennleg samandrag
- eit positivt punkt
- **3–5 kategorikort** med forklaring + sitat frå eleven sin tekst
- éin knapp per kort som opnar rett kategori i **oppgåvebanken**
- ein stor gul knapp som startar **Skrivemeisteren** med dei same kategoriane (viss widgeten er bygd inn på sjølve `skrivelab.html`)

## 4) Bygg widgeten inn i Norsklaben

Widgeten **auto-mounter** seg sjølv i den fyrste plassholdaren han finn på sida, i denne rekkjefølgja:

1. `#nl-tekstanalyse` – eksplisitt div du set inn der du vil
2. `#ob-ai-scan` – den grøne *«Tekstskanning (kjem snart)»*-plassholdaren i `oppgavebank.html` og `oppgavebank-bm.html`
3. `#nl-skrivelab-ai` – valfri plassholdar du kan legge inn i `skrivelab.html`

Målform vert automatisk vald frå filnamn (`-bm.html` → bokmål) eller `<html lang>`, men kan overstyrast med `data-maal="nn"`.

### Oppgåvebanken (`oppgavebank.html` / `oppgavebank-bm.html`)

Plassholdaren finst allereie! Legg berre til scriptet nedst i fila, rett før `</body>`:

```html
<script>window.NL_API_BASE = 'http://localhost:3000';</script>
<script src="http://localhost:3000/tekstanalyse.js"></script>
```

Widgeten overtek `#ob-ai-scan`-blokka og får same breidd og plassering som plassholdaren hadde frå før. Designet brukar Norsklaben sine CSS-variablar (`--primary`, `--accent`, `--plight`, osv.), så han fell naturleg inn blant kategori-kortlista.

### Skrivelab (`skrivelab.html` / `skrivelab-bm.html`)

Skrivelab har ingen ferdig plassholdar, så legg ein inn der du vil ha analysen – t.d. rett **etter** `<section class="adp">`-blokka slik at eleven ser Skrivemeisteren først, og tekstanalysen rett under:

```html
</section>

<!-- Norsklaben tekstanalyse -->
<div id="nl-skrivelab-ai" style="max-width:900px;margin:0 auto 2rem;padding:0 1rem"></div>

<main class="main" id="nl-bank-main" aria-label="Oppgavebank"></main>
```

Og nedst i fila, rett før `</body>`:

```html
<script>window.NL_API_BASE = 'http://localhost:3000';</script>
<script src="http://localhost:3000/tekstanalyse.js"></script>
```

Når eleven trykkjer **«Start Skrivemeisteren med desse kategoriane»**, finn widgeten automatisk `#nl-ad-cats`-boksen på sida, tømer gamle val, hakar av dei 3–5 kategoriane som LLMen foreslo, og trykkjer `#nl-ad-start` – nøyaktig same flyt som om eleven hadde valt dei manuelt.

Om widgeten ligg på oppgåvebanken (ei anna side enn Skrivemeisteren), navigerer knappen i staden til `skrivelab.html?kats=og_aa,setningsbygging&auto=1#nl-adaptive`. For å få autostart til å fungere på tvers av sider må du leggje til nokre linjer i `skrivelab.js` – sjå **punkt 8** nedanfor.

## 5) Endepunkt

### `GET /api/health`
Sjekkar at Ollama svarar og kva modellar som er installerte.

### `GET /api/kategoriar?maal=nn`
Returnerer alle kategoriane med label + URL. Gir `maal=bm` for bokmål.

### `POST /api/analyser-tekst`
```json
{
  "tekst": "Eg likar og gå på tur. Det er kult å sjå dyr og natur...",
  "maal": "nn",
  "oppgave": "Skriv ein kort tekst om ein tur du har vore på."
}
```

Svar:
```json
{
  "sammendrag": "Fin tekst om ein tur! Du har gode idear.",
  "positivt": "Du skriv flyt og brukar konkrete ord.",
  "forslag": [
    {
      "kategori": "og_aa",
      "tittel": "Og / å",
      "forklaring": "Her blandar du «og» og «å». Øv litt på når du skal bruke kvart av dei.",
      "eksempel_fra_teksten": "Eg likar og gå på tur",
      "url": "oppgavebank.html?kat=og_aa&mode=manual#og_aa"
    }
  ]
}
```

## 6) Miljøvariablar

Sett før `npm start` om du vil overstyre standardverdiar:

| Variabel | Standard | Forklaring |
|---|---|---|
| `PORT` | `3000` | Port API-et lyttar på |
| `OLLAMA_URL` | `http://localhost:11434` | Adresse til Ollama |
| `OLLAMA_MODEL` | `normistral:7b` | Modell-tag (sjå `ollama list`) |
| `MAX_TEKST` | `6000` | Maks teikn i elevtekst |

Windows PowerShell:
```powershell
$env:OLLAMA_MODEL="normistral:7b-warm"; npm start
```

## 7) Om systemprompten

`prompt.js` byggjer ein streng systemprompt som:

1. Låser LLMen til å velje **berre kategoriar som faktisk finst i banken** (både nynorsk og bokmål).
2. Krev **3–5 forslag** som JSON-objekt.
3. Krev **enkelt 8.-klasse-språk**, ingen vanskelege faguttrykk utan forklaring.
4. Ber om eit **kort sitat frå eleven sin tekst** per forslag, slik at eleven ser kvar problemet er.
5. Brukar norsk målform likt eleven sitt (nn/bm) for heile svaret.

Etter LLM-svaret kjører `server.js` ein normaliseringsfase som:
- trekkjer ut JSON sjølv om modellen pakka det i markdown,
- droppar alle forslag med ugyldige kategorinøklar,
- fjernar duplikat,
- legg på ferdig `url` til rett oppgavebank-side.

## 8) Valfri utviding – autostart av Skrivemeisteren frå URL

Viss du vil at `skrivelab.html?kats=og_aa,setningsbygging&auto=1` skal autostarte, legg dette nedst i `skrivelab.js`:

```js
(function () {
  var p = new URLSearchParams(location.search);
  var kats = (p.get('kats') || '').split(',').filter(Boolean);
  if (!kats.length || p.get('auto') !== '1') return;
  var tryStart = function () {
    var wrap = document.getElementById('nl-ad-cats');
    if (!wrap || !wrap.querySelector('.adp-cat')) return setTimeout(tryStart, 150);
    var clear = document.getElementById('nl-ad-cats-clear');
    if (clear) clear.click();
    kats.forEach(function (k) {
      var b = wrap.querySelector('.adp-cat[data-cat="' + k + '"]');
      if (b && !b.classList.contains('on')) b.click();
    });
    var start = document.getElementById('nl-ad-start');
    if (start) start.click();
  };
  tryStart();
})();
```

## 9) Feilsøking

| Symptom | Løysing |
|---|---|
| `/api/health` viser `"ikkje tilkopla"` | Er Ollama starta? `ollama serve` |
| 502-feil "Klarte ikkje å tolke svaret" | NorMistral gav ikkje JSON. Senk `temperature` i `server.js` eller prøv ein instruct-variant av modellen. |
| Ingen forslag i UI | Elevteksten kan vere for kort. Widgeten krev 40+ teikn. |
| CORS-feil i nettlesar | Sjekk at `window.NL_API_BASE` peikar på serveren og at `cors()` er aktivert. |
| Skrivemester-knappen gjer ingenting | Widgeten må liggje på sjølve `skrivelab.html`, eller du må legge til fallback-autostart (punkt 8). |

## 10) Vidare forbetringar

- Legg til caching (minne eller Redis) for identiske tekstar så eleven slepp å vente på nytt.
- Lagre kvar analyse pr. elev i `localStorage` og vis historikk under «Skrivemeisterstatus».
- Bruk `GET /api/kategoriar` til å auto-generere ein kategorivelgar utanom LLM-flyten.
- Legg til eit ekstra LLM-pass som kommenterer **setningsnivå** (grammatikk + stavefeil) som supplement til kategori-forslaga.
