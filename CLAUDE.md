\# Norsklaben



Øvingsoppgåver og skrivelab for norskfaget, ungdomsskule 8.–10. klasse.



\## Teknisk stack

\- Vanilla HTML/CSS/JS (ingen rammeverk)

\- Node.js/Express backend (server.js)

\- Ollama lokalt for AI-analyse (NorMistral/Gemma4)

\- Hetzner CX53, kode på GitHub (LektorTorrkvist/norsklaben)



\## Filstruktur

\- styles.css — felles stilark, 4000+ linjer

\- nav.js — felles navigasjon, injisert på alle sider

\- index.html / index-bm.html — startside

\- skrivelab.html / skrivelab-bm.html — øvingsmotor

\- oppgavebank-v2.js / oppgavebank-bm-v2.js — oppgåvebank-motor

\- server.js — Express-server med Ollama-integrasjon

\- prompt.js — systemprompt for AI-analyse

\- categories.js — alle kategoriar med label og URL



\## styles.css — ikkje les heile fila

Søk etter desse ankerpunkta i staden for å lese frå topp:

\- CSS-variablar (:root): øvst i fila, linje 1–30

\- Header/nav (.header, nav): linje \~31–150

\- Hero (.hero): linje \~151–250

\- Lab-kort (.lcard): linje \~251–400

\- Oppgåvemotor (.mt-\*): linje \~400–800

\- Index-layout (.main-cards, .mcard, .extra-\*): linje \~600+

Les berre det seksjonen du skal endre. Ikkje les heile fila.



\## Konvensjonar

\- Nynorsk: filnamn utan suffiks (index.html, skrivelab.html)

\- Bokmål: filnamn med -bm (index-bm.html, skrivelab-bm.html)

\- Fargar alltid via CSS-variablar frå :root — aldri hardkoda

\- Ikkje slett filer utan eksplisitt godkjenning

\- Commit aldri utan at eg har godkjent endringane



\## Språk og målgruppe

\- Elevar 13–16 år

\- Enkelt og direkte språk i alle brukarflater

\- Nynorsk som hovudmålform, bokmål som parallellvariant



\## Arbeidsmåte

\- Vis plan før du startar — vent på godkjenning

\- Gjer éin ting om gongen

\- Ved tvil: spør heller enn å gjette

\- Når du les filer: les berre det du treng, ikkje heile filer unødvendig

