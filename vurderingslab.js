/* ══════════════════════════════════════════════════════
   VURDERINGSLAB  –  V1 engine (ported to V2)
══════════════════════════════════════════════════════ */

/* Rubrikk-kategoriar */
const VRC = [
  { id:'innhald',  lbl:'Innhald',
    u:'Overflatisk innhald. Ser i liten grad fleire sider av temaet.',
    k:'Svarer på oppgåva. Ser på begge sider med noko utdjuping.',
    s:'Djup, nyansert analyse. Begge sider grundig utdjupa og vurderte mot kvarandre.' },
  { id:'struktur', lbl:'Struktur',
    u:'Uklar oppbygging. Manglar avsnitt, overskrift, innleiing eller avslutting.',
    k:'Tydeleg struktur med overskrift, avsnitt, innleiing og avslutting. Nokre overgangar.',
    s:'Gjennomtenkt komposisjon. Sterk innleiing, gode overgangar og heilskapleg avslutting.' },
  { id:'sprak',    lbl:'Språk og stil',
    u:'Uformelt, munnleg språk. Lite variasjon i ordval og setningsbygging.',
    k:'Formelt og sjangertilpassa. Faguttrykk. Noko variasjon i setningsbygging.',
    s:'Presist, variert og sjangerbevisst. Fagomgrep brukt korrekt. God flyt og rytme.' },
  { id:'rettskriving', lbl:'Rettskriving og teiknsetting',
    u:'Mange og systematiske feil. Manglar komma, punktum og stor forbokstav.',
    k:'Nokre feil, men grunnleggjande rettskriving og teiknsetting er på plass.',
    s:'Svært få feil. Medviten og korrekt bruk av teiknsetting som styrkjer teksten.' },
  { id:'kjelder', lbl:'Kjelder',
    u:'Lite eller ingen bruk av kjelder. Ingen kjeldetilvisingar i teksten.',
    k:'Brukar dei fleste kjeldene. Kjeldetilvisingar i teksten og kjeldeliste.',
    s:'Saumlaus og kritisk kjeldebruk. Alle kjeldene integrerte i teksten. Presis kjeldeliste.' },
];

const VR_TEKSTAR = [
  {
    id: 'A',
    tittel: 'Sosiale medier og språk',
    tekst: `sosiale medie er noe all ungdom bruker og det er mange apper som tiktok og snapchat og instagram. Jeg og vennene mine bruker det hvert dag og vi skriver mye til hverandre. Mange voksne synes det er dumt og at vi lærer dårlig norsk av det men jeg synes ikke det er sant.

Det er mange og skriver feil på sosiale medie. dom bruker forkortlser som lol og btw og sånt og det kan være dumt hvis man glemmer å skrive riktig. Noen ganger skriver jeg feil på skolen og det er fordi jeg er vant til å skrive fort på mobilen. Lærerene klager på at vi ikke kan rettskrivning men jeg synes vi bare skriver anderledes ikke feil.`,
  },
  {
    id: 'B',
    tittel: 'Sosiale medium og ungdomsspråket – ei tosidig utvikling',
    tekst: `I dag bruker dei fleste ungdomar sosiale medium kvar dag. Plattformar som TikTok, Instagram og Snapchat har blitt ein naturleg del av kvardagen, og dette påverkar korleis unge kommuniserer. I denne artikkelen skal eg sjå på korleis sosiale medium påverkar språket til ungdom, og peike på både positive og negative sider.

Negative konsekvensar

Mange er bekymra for at sosiale medium fører til dårlegare språk. På plattformar som Snapchat er det vanleg å bruke forkortingar og emoji. Ord som "lol" og "btw" er heilt vanleg for mange unge. Ifølge NDLA kan dette gjere det vanskelegare og skilje mellom uformell og formell skriving. Lærarar peikar på at elevar har problem med rettskriving.

Eit anna problem er at mange bruker engelske ord i stede for norske. Dette kan på sikt svekke det norske språket viss ungdom alltid vel engelske uttrykk.

Positive konsekvensar

Samstundes er det viktig å sjå dei positive sidene. Forskning.no skriv at ungdomsspråket er betre enn sitt rykte. Forskarar meiner at ungdom utviklar eit breiare språkleg repertoar gjennom sosiale medium, fordi dei tilpassar språket til ulike situasjonar. Dei kan veksle mellom slang med vennar og meir formelt språk på skulen.

I tillegg fører sosiale medium til at ungdom skriv meir generelt. Dei skriv heile tida, sjølv om det er på ein annan måte en før. Sosiale medium har og gjort det mogleg og kommunisere med folk i andre land.

Avslutning

Sosiale medium påverkar språket til ungdom på fleire måtar. Det er klart at det finst negative konsekvensar, særleg knytt til overgangen mellom uformelt og formelt språk. Men forsking viser at ungdom og utviklar eit rikt og fleksibelt språk. Det viktigaste er at ungdom er bevisste på kva situasjon dei er i og tilpassar språket etter det.`,
  },
  {
    id: 'C',
    tittel: 'Mellom lol og lingvistikk – sosiale medium som språkleg laboratorium',
    tekst: `Kvar dag sender norske ungdommar millionar av meldingar, kommentarar og innlegg på sosiale medium – på eit språk mange vaksne knapt kjenner att. Men øydelegg dette eigentleg språket til dei unge, eller er det noko heilt anna som skjer?

Sosiale medium har blitt ein uløyseleg del av kvardagen til ungdom. Plattformar som TikTok, Instagram og Snapchat er ikkje berre underhaldning – dei er arenaer der unge kommuniserer, diskuterer og uttrykker seg skriftleg heile tida. I denne artikkelen vil eg sjå nærare på korleis sosiale medium påverkar språket til ungdom, og argumentere for at biletet er langt meir samansett enn den vanlege bekymringa skulle tilseie.

Fleire språk – ikkje dårlegare språk

Det er lett å tenke at forkortingar og emoji er eit teikn på at unge ikkje kan skrive. Men ifølgje Forskning.no er ungdomsspråket betre enn sitt rykte. Forskarar meiner at ungdom faktisk er flinke til å tilpasse språket sitt etter situasjonen – dei veit godt at det er forskjell på å skrive ei melding til ein kamerat og å skrive ein fagartikkel på skulen. Forskning.no peikar òg på at sosiale medium gir unge eit breiare språkleg repertoar, fordi dei lærer å kommunisere på ulike måtar og i ulike samanhengar. Denne tilpassingsevna er eigentleg ein viktig språkleg kompetanse, ikkje ein mangel.

Generasjonen som aldri slutta å skrive

Ein ting som ofte vert gløymt i debatten er at sosiale medium har gjort ungdom til den mest skrivande generasjonen nokosinne. Tidlegare skreiv unge kanskje berre i norsktimane; no skriv dei heile tida. NDLA peikar på at den digitale skriftkulturen har endra korleis vi kommuniserer, men det treng ikkje bety at det er negativt. I tillegg lærer mange unge seg engelsk på eit høgt nivå gjennom kontakt med folk frå heile verda – ein kompetanse som vil kome godt med seinare i livet.

Når grensene viskar seg ut

Samstundes er det reelle utfordringar ein ikkje kan sjå vekk frå. NDLA åtvarar om at grensene mellom uformelt og formelt språk kan bli utydlege når ein skriv på same måten heile tida. Viss ein elev alltid skriv korte, uformelle setningar, kan det bli vansklegare å produsere ein grundig og velformulert tekst når det trengs. Det er òg ein legitim diskusjon om kva som skjer med det norske ordforrådet når engelske ord som «vibe», «cringe» og «lowkey» erstattar norske uttrykk – og om dette på sikt svekkjer evna til å uttrykke seg presist på eige språk.

Millionar av meldingar – og kva dei fortel oss

Dei millionane av meldingane norske ungdommar sender kvar einaste dag er ikkje eit teikn på språkleg forfall. Dei er eit teikn på eit levande, tilpassingsdyktig språk i endring. Utfordringa er ikkje å stoppe denne utviklinga, men å sørgje for at unge òg meistrar dei formelle sjangrane dei treng – på skulen, i arbeidslivet og i samfunnsdebatten. Det ansvaret ligg hos skulen, ikkje algoritmen.`,
  },
];

/* State */
const VRS2 = {
  step: 0,
  rubrikk: [{}, {}, {}],
  notat: ['', '', ''],
  karakterar: [null, null, null],
  grunngjeving: ['', '', ''],
};

/* Helpers */
function $vr(id) { return document.getElementById(id); }
function escVr(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/* ── Step indicator ──────────────────────────── */
function vrBuildSteps() {
  const wrap = $vr('vr-steps');
  if (!wrap) return;
  const labels = ['Tekst A', 'Tekst B', 'Tekst C', 'Karaktersetjing'];
  wrap.innerHTML = '';
  labels.forEach((lbl, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.id = `vr-step-line-${i}`;
      line.style.cssText = `flex:1;height:2px;background:${i <= VRS2.step ? '#be185d' : '#e5e2db'};max-width:40px;min-width:12px;transition:background 0.3s`;
      wrap.appendChild(line);
    }
    const done = i < VRS2.step;
    const active = i === VRS2.step;
    const btn = document.createElement('button');
    btn.id = `vr-step-btn-${i}`;
    btn.style.cssText = `width:36px;height:36px;border-radius:50%;border:2px solid ${active ? '#be185d' : done ? '#be185d' : '#e5e2db'};background:${active ? '#be185d' : done ? '#fce7f3' : '#fff'};color:${active ? '#fff' : done ? '#be185d' : '#8a8a84'};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:${done ? 'pointer' : 'default'};transition:all 0.2s;flex-shrink:0;display:flex;align-items:center;justify-content:center`;
    btn.textContent = done ? '✓' : (i + 1);
    btn.title = lbl;
    btn.onclick = () => { if (i < VRS2.step) vrGoStep(i); };
    const grp = document.createElement('div');
    grp.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px';
    grp.appendChild(btn);
    const lbl_el = document.createElement('span');
    lbl_el.style.cssText = `font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${active ? '#be185d' : done ? '#be185d' : '#8a8a84'};font-weight:${active || done ? '500' : '400'};white-space:nowrap`;
    lbl_el.textContent = lbl;
    grp.appendChild(lbl_el);
    wrap.appendChild(grp);
  });
}

function vrGoStep(i) {
  VRS2.step = i;
  vrRender();
}

/* ── Main render dispatcher ─────────────────── */
function vrRender() {
  vrBuildSteps();
  if (VRS2.step < 3) vrRenderTekst(VRS2.step);
  else vrRenderKarakter();
}

/* ── Steg 1-3: tekst + rubrikk ──────────────── */
function vrRenderTekst(idx) {
  const t = VR_TEKSTAR[idx];
  const rub = VRS2.rubrikk[idx];
  const filled = Object.keys(rub).length;
  const total = VRC.length;
  const allDone = filled === total;

  let rubRows = '';
  VRC.forEach(kat => {
    const cur = rub[kat.id] || '';
    rubRows += `<tr style="border-bottom:1px solid #f3f0ea">
      <td style="padding:0.7rem 0.9rem;font-size:13px;font-weight:500;color:#1a1a18;vertical-align:top;width:18%">${kat.lbl}</td>
      ${['u', 'k', 's'].map((v, vi) => {
        const bg = ['#fff0ed', '#fffbe8', '#e8f6f0'][vi];
        const sel = ['#d45a2f', '#c7922e', '#2e8b6a'][vi];
        const selLight = ['#ffd6c8', '#ffe9a0', '#a3dfc5'][vi];
        const txt = [kat.u, kat.k, kat.s][vi];
        const isSelected = cur === v;
        return `<td style="padding:0.35rem 0.4rem;vertical-align:top;background:${bg};width:27%">
          <label style="display:flex;align-items:flex-start;gap:7px;cursor:pointer;padding:0.45rem 0.6rem;border-radius:8px;background:${isSelected ? selLight : 'transparent'};border:2px solid ${isSelected ? sel : 'transparent'};transition:all 0.15s">
            <input type="radio" name="vr_${idx}_${kat.id}" value="${v}" ${isSelected ? 'checked' : ''} onchange="vrSetRub(${idx},'${kat.id}','${v}')" style="margin-top:2px;accent-color:${sel};flex-shrink:0">
            <span style="font-size:12px;color:#2a2a28;line-height:1.55">${txt}</span>
          </label>
        </td>`;
      }).join('')}
    </tr>`;
  });

  const savedNotat = VRS2.notat[idx] || '';

  $vr('vr-panel').innerHTML = `
    <div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;overflow:hidden;margin-bottom:1.5rem">
      <div style="background:#fdf2f8;border-bottom:1px solid #f9a8d4;padding:0.9rem 1.4rem;display:flex;align-items:baseline;gap:12px">
        <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#be185d;font-weight:500">Tekst ${escVr(t.id)}</span>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;color:#1a1a18;margin:0">${escVr(t.tittel)}</h3>
      </div>
      <div style="padding:1.4rem 1.6rem;font-size:14px;color:#2a2a28;line-height:1.85;white-space:pre-line;font-family:'Playfair Display',serif;font-style:italic">${escVr(t.tekst)}</div>
    </div>

    <div style="margin-bottom:1.2rem">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.8rem;flex-wrap:wrap">
        <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;color:#1a1a18;margin:0">Vurder tekst ${escVr(t.id)} med rubrikken</h3>
        <span style="font-size:12px;background:${allDone ? '#e8f6f0' : '#f3f0ea'};color:${allDone ? '#1a5c42' : '#8a8a84'};padding:3px 10px;border-radius:99px">${filled}/${total} fylt inn</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:580px">
          <thead>
            <tr style="background:#fdf2f8">
              <th style="padding:0.6rem 0.9rem;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a84;font-weight:500;border-bottom:2px solid #f9a8d4;width:18%">Kategori</th>
              <th style="padding:0.6rem 0.9rem;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a84;font-weight:500;border-bottom:2px solid #fca5a5;background:#fff0ed;width:27%">Under utvikling</th>
              <th style="padding:0.6rem 0.9rem;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a84;font-weight:500;border-bottom:2px solid #fde68a;background:#fffbe8;width:27%">Kompetent</th>
              <th style="padding:0.6rem 0.9rem;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a84;font-weight:500;border-bottom:2px solid #6ee7b7;background:#e8f6f0;width:28%">Svært kompetent</th>
            </tr>
          </thead>
          <tbody>${rubRows}</tbody>
        </table>
      </div>
    </div>

    <div style="margin-bottom:1.5rem">
      <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Notatar til teksten (valfritt)</label>
      <textarea id="vr-notat-${idx}" rows="3" style="width:100%;box-sizing:border-box;background:#fff;border:1px solid #e5e2db;border-radius:10px;color:#1a1a18;font-family:'Source Sans 3',sans-serif;font-size:14px;padding:10px 14px;outline:none;resize:vertical;line-height:1.6;transition:border-color 0.15s" placeholder="Skriv observasjonar, sitat frå teksten eller eigne kommentarar…" oninput="vrSaveNotat(${idx})">${escVr(savedNotat)}</textarea>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      ${idx > 0 ? `<button onclick="vrGoStep(${idx - 1})" style="background:transparent;border:1px solid #e5e2db;border-radius:99px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:500;padding:10px 22px;cursor:pointer;color:#4a4a46">← Førre tekst</button>` : '<span></span>'}
      <button onclick="vrNext(${idx})" style="background:#be185d;color:#fff;border:none;border-radius:99px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:500;padding:10px 26px;cursor:pointer;transition:all 0.2s">${idx < 2 ? 'Neste tekst →' : 'Til karaktersetjing →'}</button>
    </div>`;

  const ta = $vr(`vr-notat-${idx}`);
  if (ta) ta.value = VRS2.notat[idx] || '';
}

function vrSetRub(idx, kat, val) {
  VRS2.rubrikk[idx][kat] = val;
  vrRenderTekst(idx);
}

function vrSaveNotat(idx) {
  const ta = $vr(`vr-notat-${idx}`);
  if (ta) VRS2.notat[idx] = ta.value;
}

function vrNext(idx) {
  vrSaveNotat(idx);
  VRS2.step = idx + 1;
  vrRender();
  document.getElementById('vr-outer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Steg 4: karaktersetjing ────────────────── */
function vrRenderKarakter() {
  const lvlLbl = { u: 'Under utvikling', k: 'Kompetent', s: 'Svært kompetent' };
  const lvlBg  = { u: '#fff0ed', k: '#fffbe8', s: '#e8f6f0' };
  const lvlCol = { u: '#d45a2f', k: '#c7922e', s: '#2e8b6a' };

  let sumCards = '';
  VR_TEKSTAR.forEach((t, i) => {
    const rub = VRS2.rubrikk[i];
    let rows = '';
    VRC.forEach(kat => {
      const v = rub[kat.id] || '';
      rows += `<tr style="border-bottom:1px solid #f3f0ea">
        <td style="padding:0.45rem 0.7rem;font-size:13px;color:#4a4a46;font-weight:500">${kat.lbl}</td>
        <td style="padding:0.45rem 0.7rem"><span style="font-size:12px;padding:2px 10px;border-radius:99px;background:${lvlBg[v] || '#f3f0ea'};color:${lvlCol[v] || '#8a8a84'}">${lvlLbl[v] || '–'}</span></td>
      </tr>`;
    });
    const saved = VRS2.karakterar[i];
    const savedGr = VRS2.grunngjeving[i] || '';
    sumCards += `
      <div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;overflow:hidden;margin-bottom:1.2rem">
        <div style="background:#fdf2f8;border-bottom:1px solid #f9a8d4;padding:0.8rem 1.2rem;display:flex;align-items:baseline;gap:10px">
          <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#be185d;font-weight:500">Tekst ${t.id}</span>
          <span style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:#1a1a18">${escVr(t.tittel)}</span>
        </div>
        <div style="padding:1rem 1.2rem">
          <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">${rows}</table>
          ${VRS2.notat[i] ? `<div style="background:#faf8f4;border-radius:8px;padding:0.6rem 0.9rem;font-size:13px;color:#4a4a46;margin-bottom:1rem;font-style:italic">"${escVr(VRS2.notat[i])}"</div>` : ''}
          <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
            <div>
              <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Karakter</label>
              <select id="vr-kar-${i}" onchange="vrSaveKar(${i})" style="background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'Source Sans 3',sans-serif;font-size:16px;font-weight:600;padding:8px 14px;outline:none;appearance:auto;min-width:90px">
                <option value="">–</option>
                ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${saved === n ? 'selected' : ''}>${n}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;min-width:220px">
              <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Grunngjeving (minst éi setning)</label>
              <textarea id="vr-gr-${i}" rows="2" oninput="vrSaveGr(${i})" style="width:100%;box-sizing:border-box;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'Source Sans 3',sans-serif;font-size:14px;padding:8px 12px;outline:none;resize:vertical;line-height:1.6" placeholder="Kvifor denne karakteren?">${escVr(savedGr)}</textarea>
            </div>
          </div>
        </div>
      </div>`;
  });

  $vr('vr-panel').innerHTML = `
    <h3 style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:600;color:#1a1a18;margin-bottom:0.4rem">Set karakter på tekstane</h3>
    <p style="font-size:14px;color:#4a4a46;margin-bottom:1.5rem;max-width:580px;line-height:1.65">Du har no vurdert alle tre tekstane med rubrikken. Set ein karakter (1–6) på kvar tekst og grunngjev valet ditt basert på rubrikken din.</p>
    ${sumCards}
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:1rem">
      <button onclick="vrGoStep(2)" style="background:transparent;border:1px solid #e5e2db;border-radius:99px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:500;padding:10px 22px;cursor:pointer;color:#4a4a46">← Tilbake til Tekst C</button>
      <button onclick="vrLeverAlt()" style="background:#be185d;color:#fff;border:none;border-radius:99px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:500;padding:10px 28px;cursor:pointer">Lever vurdering ✓</button>
    </div>
    <div id="vr-final" style="display:none;margin-top:2rem;padding-top:1.8rem;border-top:3px solid #be185d;background:#fdf8f4;border-radius:0 0 14px 14px;padding-left:0.2rem;padding-right:0.2rem"></div>`;

  VR_TEKSTAR.forEach((_, i) => {
    const sel = $vr(`vr-kar-${i}`);
    if (sel && VRS2.karakterar[i]) sel.value = VRS2.karakterar[i];
    const ta = $vr(`vr-gr-${i}`);
    if (ta) ta.value = VRS2.grunngjeving[i] || '';
  });
}

function vrSaveKar(i) {
  const sel = $vr(`vr-kar-${i}`);
  if (sel) VRS2.karakterar[i] = parseInt(sel.value) || null;
}
function vrSaveGr(i) {
  const ta = $vr(`vr-gr-${i}`);
  if (ta) VRS2.grunngjeving[i] = ta.value;
}

function vrLeverAlt() {
  VR_TEKSTAR.forEach((_, i) => { vrSaveKar(i); vrSaveGr(i); });
  const missing = VR_TEKSTAR.filter((_, i) => !VRS2.karakterar[i] || !VRS2.grunngjeving[i]?.trim());
  if (missing.length) {
    alert('Fyll inn karakter og grunngjeving for alle tre tekstane.');
    return;
  }

  const lvlLbl = { u: 'Under utvikling', k: 'Kompetent', s: 'Svært kompetent' };
  const lvlCol = { u: '#d45a2f', k: '#c7922e', s: '#2e8b6a' };
  const lvlBg  = { u: '#fff0ed', k: '#fffbe8', s: '#e8f6f0' };

  // Opa vurdering-poeng: 1 poeng per tekst der studenten har skrive notat (jf. mtCheckOpen-logikk)
  const notatPoeng = VR_TEKSTAR.filter((_, i) => VRS2.notat[i] && VRS2.notat[i].trim().length > 5).length;

  let html = `
    <div style="background:#e8f6f0;border:1px solid #82c9a8;border-radius:14px;padding:1.4rem 1.6rem;margin-bottom:1.5rem">
      <div style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;color:#1a5c42;margin-bottom:0.4rem">✓ Vurdering levert!</div>
      <p style="font-size:14px;color:#14532d;line-height:1.65;margin-bottom:0.7rem">Du har fullført vurderingsoppgåva. Nedanfor ser du ei samanstilling av vurderingane dine.</p>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
        <span style="font-size:13px;background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:99px;font-weight:500">📋 Rubrikk: 3/3</span>
        <span style="font-size:13px;background:${notatPoeng>0?'#d1fae5':'#f3f0ea'};color:${notatPoeng>0?'#065f46':'#8a8a84'};padding:4px 12px;border-radius:99px;font-weight:500">📝 Notat: ${notatPoeng}/3</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:1rem">`;

  VR_TEKSTAR.forEach((t, i) => {
    const rub = VRS2.rubrikk[i];
    let rubSum = '';
    VRC.forEach(kat => {
      const v = rub[kat.id] || '';
      rubSum += `<span style="font-size:12px;padding:2px 10px;border-radius:99px;background:${lvlBg[v] || '#f3f0ea'};color:${lvlCol[v] || '#8a8a84'};margin:2px">${kat.lbl}: ${lvlLbl[v] || '–'}</span>`;
    });
    html += `
      <div style="background:#fff;border:1px solid #e5e2db;border-radius:12px;padding:1.2rem 1.4rem">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:0.6rem;flex-wrap:wrap">
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#be185d;font-weight:500">Tekst ${t.id}</span>
          <span style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:#1a1a18">${escVr(t.tittel)}</span>
          <span style="margin-left:auto;font-size:1.6rem;font-family:'Playfair Display',serif;font-weight:700;color:#be185d">${VRS2.karakterar[i]}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:0.6rem">${rubSum}</div>
        <div style="font-size:13px;color:#4a4a46;font-style:italic">"${escVr(VRS2.grunngjeving[i])}"</div>
        ${VRS2.notat[i] ? `<div style="margin-top:0.5rem;font-size:12px;color:#8a8a84;border-top:1px solid #f3f0ea;padding-top:0.5rem">Notat: ${escVr(VRS2.notat[i])}</div>` : ''}
      </div>`;
  });
  html += `</div>
    <button onclick="vrReset()" style="margin-top:1.5rem;background:#fce7f3;color:#831843;border:none;border-radius:99px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:500;padding:10px 24px;cursor:pointer">Start på nytt</button>`;

  const fin = $vr('vr-final');
  if (fin) { fin.innerHTML = html; fin.style.display = 'block'; }
  fin.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function vrReset() {
  VRS2.step = 0;
  VRS2.rubrikk = [{}, {}, {}];
  VRS2.notat = ['', '', ''];
  VRS2.karakterar = [null, null, null];
  VRS2.grunngjeving = ['', '', ''];
  vrRender();
  document.getElementById('vr-outer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Init */
vrBuildSteps();
vrRenderTekst(0);
