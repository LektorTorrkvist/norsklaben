/* ══════════════════════════════════════════════════════
   OPPGÅVEBANK – nynorsk – v2
   Adaptiv mengdetreningsmotor med pedagogisk djupne
   ────────────────────────────────────────────────────
   Funksjonar:
   • Dynamisk adaptiv oppgåveval (glidande mestringsvindu)
   • Retry-kø med pedagogisk kommentar
   • Delvis poeng (mcset, fillsel, finn_feil, klikk_marker)
   • Levenshtein-tilbakemelding for cloze/fix
   • vanlege_feil + forklaring-felt
   • Tidsmåling per oppgåve
   • localStorage-historikk per kategori
   • Nye typar: sann_usann_serie, omskriv, sorter_rekke
   • Tastaturnavigering i mc (1-4)
   • «Vis regel først»-toggle
══════════════════════════════════════════════════════ */

/* ─── LEGACY-FILTER (for kortimport i Skrivelab) ─── */
var MT_LEGACY_BLOCKLIST = [
  'jule middag',
  'jule treet',
  'brettspel er bra',
  'brettspel som monopol er populære'
];

function mtTaskLooksLegacy(task) {
  if (!task || typeof task !== 'object') return false;

  function addText(buf, value) {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(function(v) { addText(buf, v); });
      return;
    }
    if (typeof value === 'object') {
      Object.keys(value).forEach(function(k) {
        addText(buf, value[k]);
      });
      return;
    }
    buf.push(String(value));
  }

  var corpus = [];
  addText(corpus, task.q);
  addText(corpus, task.tekst);
  addText(corpus, task.alt);
  addText(corpus, task.items);
  addText(corpus, task.errors);
  addText(corpus, task.fasit);
  addText(corpus, task.fasit_feil);

  var hay = corpus.join(' ').toLowerCase();
  return MT_LEGACY_BLOCKLIST.some(function(needle) {
    return hay.indexOf(String(needle).toLowerCase()) !== -1;
  });
}

/* ─── DATA ───────────────────────────────────────── */
var BANKV2 = [

/* ═══════════════════════════════════════════════════
   1. OG / Å  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Ho likar ___ danse.»',
 alt:['og','å'],fasit:'å',
 regel:'«Å» er infinitivsmerke og kjem framfor eit verb i infinitiv.',
 eks:'Ho likar å danse. Han prøver å lese.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Han et brød ___ drikk mjølk.»',
 alt:['og','å'],fasit:'og',
 regel:'«Og» er eit bindeord som bind saman to ledd eller setningar.',
 eks:'Han et brød og drikk mjølk. Ho les og skriv.'},

{kat:'og_aa',kat_label:'Og / å',type:'fillsel',vanske:'medium',
 q:'Vel «og» eller «å» i kvar setning.',
 items:[
  {pre:'Ho prøvde',alt:['og','å'],fasit:'å',post:'forstå oppgåva.'},
  {pre:'Katten',alt:['og','å'],fasit:'og',post:'hunden leikar saman.'},
  {pre:'Det er viktig',alt:['og','å'],fasit:'å',post:'sove nok.'},
  {pre:'Han kjøpte brød',alt:['og','å'],fasit:'og',post:'mjølk.'},
  {pre:'Vi drog for',alt:['og','å'],fasit:'å',post:'oppleve noko nytt.'}
 ],
 regel:'«Å» kjem framfor infinitiv (verb i grunnform). «Og» bind saman ledd.',
 eks:'prøvde å forstå · katten og hunden · for å oppleve'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'lett',
 q:'Klikk på det eine ordet som er feil brukt.',
 tekst:'Læraren bad elevane og tenke over spørsmålet før prøva.',
 fasit_feil:['og'],
 regel:'Etter «bad» kjem infinitiv → infinitivsmerket «å»: «bad elevane å tenke».',
 eks:'be nokon å gjere noko – alltid «å + infinitiv» etter «be/bad».'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'medium',
 q:'To ord er feil brukte. Klikk på begge.',
 tekst:'Det er viktig og forstå grammatikk, å alle i klassen bør øve kvar dag.',
 fasit_feil:['og','å'],
 regel:'«Viktig og forstå» → «viktig å forstå» (infinitiv). «Å alle» → «og alle» (bindeord).',
 eks:'Det er viktig å forstå grammatikk, og alle bør øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter setningane etter om dei brukar «å» (infinitivsmerke) eller «og» (bindeord).',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
  {tekst:'Ho likar å danse.',fasit:0},
  {tekst:'Katten og hunden leikar.',fasit:1},
  {tekst:'Det er gøy å symje.',fasit:0},
  {tekst:'Han er sterk og modig.',fasit:1},
  {tekst:'Eg prøver å forstå.',fasit:0},
  {tekst:'Ho syng og ler.',fasit:1}
 ],
 regel:'«Å» kjem framfor eit verb i infinitiv. «Og» bind saman ord eller ledd.',
 eks:'å danse = infinitiv · katten og hunden = samordning'},

{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'medium',
 q:'Klikk på kvart ord som er eit infinitivsmerke («å»).',
 tekst:'Ho prøvde å rydde rommet og å vaske kleda før middagen.',
 maalordklasse:'å (infinitivsmerke)',
 fasit_ord:['å','å'],
 regel:'«Å rydde» og «å vaske» er infinitivskonstruksjonar. «Og» mellom dei er bindeord.',
 eks:'å rydde = infinitiv · å vaske = infinitiv · og = bindeord'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Kva er rett? «Han ___ hjelpe til.»',
 alt:['vil å hjelpe','vil hjelpe','vil og hjelpe','ynskjer å ikkje hjelpe'],
 fasit:'vil hjelpe',
 regel:'Etter modalverba «vil», «kan», «skal», «bør», «må» kjem infinitiv utan «å».',
 eks:'vil hjelpe · kan gå · skal kome · bør lese'},

{kat:'og_aa',kat_label:'Og / å',type:'fix',vanske:'vanskeleg',
 q:'Rett dei fire og/å-feila i teksten.',
 tekst:'Eg har alltid hatt lyst og reise til Spania. Broren min lovde og kome med, men han prøvde og finne billigare billettar. Til slutt bestemte vi oss og dra til Sverige i staden.',
 errors:{'lyst og reise':'lyst å reise','lovde og kome':'lovde å kome','prøvde og finne':'prøvde å finne','oss og dra':'oss å dra'},
 fasit:'lyst å reise · lovde å kome · prøvde å finne · oss å dra',
 regel:'Infinitivsmerket «å» kjem etter verb som «ha lyst til», «love», «prøve», «bestemme seg».',
 eks:'hatt lyst å reise · lovde å kome · prøvde å finne'},

{kat:'og_aa',kat_label:'Og / å',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandane om «og» / «å» sanne eller usanne?',
 paastandar:[
  {tekst:'«Å» kjem alltid framfor eit verb i infinitiv.',sann:true},
  {tekst:'Etter modalverb som «kan» og «vil» brukar ein «å».',sann:false},
  {tekst:'«Og» bind saman ord, ledd eller setningar.',sann:true},
  {tekst:'«Ho likar og lese» er korrekt nynorsk.',sann:false},
  {tekst:'«Bestemte seg for å reise» er rett.',sann:true}
 ],
 regel:'«Å» = infinitivsmerke. «Og» = bindeord. Modalverb styrer infinitiv utan «å».',
 eks:'å lese (infinitiv) · ho og han (bindeord) · kan lese (utan å)'},

/* ═══════════════════════════════════════════════════
   2. SAMANSETTE ORD  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte?',
 alt:['sjokolade kake','sjokoladekake','sjokolade-kake','sjåkoladekake'],
 fasit:'sjokoladekake',
 regel:'Samansette ord skriv ein i eitt på norsk: «sjokolade» + «kake» = «sjokoladekake».',
 eks:'sjokoladekake, fotballbane, barneskule'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'medium',
 q:'«Ananas ringer» i staden for «ananasringar» – kva tyder særskrivinga?',
 alt:['Ringar laga av ananas','At ananasfrukta ringer med telefon','Same tyding begge vegar','At ringen er forma som ein ananas'],
 fasit:'At ananasfrukta ringer med telefon',
 regel:'Særskriving kan gi heilt ny tyding. «Ananasringar» = mat. «Ananas ringer» = frukt med telefon.',
 eks:'ananasringar (mat) vs. ananas ringer (absurd tyding)'},

{kat:'samansett',kat_label:'Samansette ord',type:'fix',vanske:'lett',
 q:'Rett dei fire særskrivingsfeila i teksten.',
 tekst:'Kvart år hamnar enorme mengder hav plast i sjøen. Sjø dyr som kval og sel set seg fast i plast bitar. Forskarar frå Hav forskings instituttet åtvarar om problemet.',
 errors:{'hav plast':'havplast','Sjø dyr':'Sjødyr','plast bitar':'plastbitar','Hav forskings instituttet':'Havforskingsinstituttet'},
 fasit:'havplast · Sjødyr · plastbitar · Havforskingsinstituttet',
 regel:'Samansette ord skriv ein alltid i eitt på norsk. Ingen mellomrom mellom ledda.',
 eks:'havplast, sjødyr, plastbitar, Havforskingsinstituttet'},

{kat:'samansett',kat_label:'Samansette ord',type:'fix',vanske:'medium',
 q:'Rett dei tre særskrivingsfeila i elevteksten.',
 tekst:'I dag skal vi ha jule middag med heile familien. Bestemora lagar pinnekjøt middag, og vi har pynta jule treet med lys. Etter middagen spelar vi brettspel og drikk varm sjokolade.',
 errors:{'jule middag':'julemiddag','pinnekjøt middag':'pinnekjøtmiddag','jule treet':'juletreet'},
 fasit:'julemiddag · pinnekjøtmiddag · juletreet',
 regel:'Høgtidsord skriv ein i eitt: julemiddag, juletre, påskemiddag.',
 eks:'julemiddag, juletreet, pinnekjøtmiddag'},

{kat:'samansett',kat_label:'Samansette ord',type:'drag_kolonne',vanske:'medium',
 q:'Kva ord er rett skrivne, og kva er feil (særskrivne)?',
 kolonner:['Rett skrive','Feil (særskrive)'],
 ord:[
  {tekst:'fotballbane',fasit:0},
  {tekst:'fotball bane',fasit:1},
  {tekst:'ungdomsskule',fasit:0},
  {tekst:'ungdoms skule',fasit:1},
  {tekst:'barnehage',fasit:0},
  {tekst:'barne hage',fasit:1}
 ],
 regel:'Samansette ord skriv ein alltid i eitt. Ingen mellomrom mellom ledda.',
 eks:'fotballbane, ungdomsskule, barnehage – alt i eitt'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett (eitt ord): «Ho spelar på ___» (fotball + bane)',
 hint:'Slå saman dei to delane til eitt ord.',
 fasit:'fotballbane',fasit_v:['fotballbane','fotballbana'],
 regel:'«Fotball» + «bane» = «fotballbane» – eitt samansett ord.',
 eks:'fotballbane, basketballbane, sandvolleyballbane'},

{kat:'samansett',kat_label:'Samansette ord',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om samansette ord sanne eller usanne?',
 paastandar:[
  {tekst:'Samansette ord skriv ein alltid i eitt på norsk.',sann:true},
  {tekst:'«Lamme lår» og «lammelår» tyder det same.',sann:false},
  {tekst:'Bindestrek brukast mellom eit norsk ord og ei forkorting (t.d. barne-tv).',sann:true},
  {tekst:'«Stor by» og «storby» tyder det same.',sann:false}
 ],
 regel:'Særskriving kan endre tydinga. «Storby» = fast omgrep. «Stor by» = ein by som er stor.',
 eks:'lammelår (mat) vs. lamme lår (lår som ikkje rører seg)'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse treng bindestrek?',
 alt:['barnehage','barneskule','barnetv','barnebidrag'],
 fasit:'barnetv',
 regel:'Bindestrek mellom norsk ord og forkorting: barne-tv, mini-golf, e-post.',
 eks:'barne-tv, e-post, 17-åring, IT-avdeling'},

/* ═══════════════════════════════════════════════════
   3. DOBBEL KONSONANT  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva er rett infinitivsform?',
 alt:['hope','hoppe','hoppa','hopa'],
 fasit:'hoppe',
 regel:'Etter kort vokal kjem dobbel konsonant: «hoppe» (kort o → pp).',
 eks:'hoppe, sitje, leggje, kaste'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kvifor skriv ein «mat» med éin t, men «matte» med dobbel t?',
 alt:['Det er tilfeldig','«Mat» har lang vokal, «matte» har kort vokal','«Mat» er nynorsk, «matte» er bokmål','Begge har kort vokal'],
 fasit:'«Mat» har lang vokal, «matte» har kort vokal',
 regel:'Lang vokal → éin konsonant. Kort vokal → dobbel konsonant.',
 eks:'mat (lang a) vs. matte (kort a) · bil (lang i) vs. bille (kort i)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter orda: kva er rett skrivne, og kva er feil?',
 kolonner:['Rett skrive','Feil skrive'],
 ord:[
  {tekst:'hoppe',fasit:0},
  {tekst:'sitje',fasit:0},
  {tekst:'hoper',fasit:1},
  {tekst:'siter',fasit:1},
  {tekst:'kaffe',fasit:0},
  {tekst:'kafe',fasit:1},
  {tekst:'løpe',fasit:0},
  {tekst:'løppe',fasit:1}
 ],
 regel:'Kort vokal → dobbel konsonant: hoppe, sitje, kaffe. Lang vokal → éin: løpe.',
 eks:'hoppe (kort o) · løpe (lang ø) · kaffe (kort a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Adjektiv – rett eller feil skrivemåte?',
 kolonner:['Rett skrive','Feil skrive'],
 ord:[
  {tekst:'stille',fasit:0},
  {tekst:'stile',fasit:1},
  {tekst:'grøn',fasit:0},
  {tekst:'grønn',fasit:1},
  {tekst:'liten',fasit:0},
  {tekst:'litten',fasit:1},
  {tekst:'bitter',fasit:0},
  {tekst:'biter',fasit:1}
 ],
 regel:'Dobbel konsonant etter kort vokal: stille, bitter. Éin konsonant etter lang: liten, grøn.',
 eks:'stille (kort i) · grøn (lang ø) · liten (lang i)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fix',vanske:'lett',
 q:'Rett dei fire rettskrivingsfeila.',
 tekst:'Mange unggdomar er opptekne av sosiale medium. Familien bør samlast rundt midagsbordet og snakke om daagen. Prøv å leggje ned telefonen og sjå ut vinnduet.',
 errors:{'unggdomar':'ungdomar','midagsbordet':'middagsbordet','daagen':'dagen','vinnduet':'vindauget'},
 fasit:'ungdomar · middagsbordet · dagen · vindauget',
 regel:'Dobbel konsonant berre etter kort vokal. «Dag» har lang a → éin g. «Middag» har kort i → dd.',
 eks:'ungdomar (lang u) · middagsbordet (kort i) · dagen (lang a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fillsel',vanske:'medium',
 q:'Vel rett form av verbet.',
 items:[
  {pre:'Ho',alt:['hopar','hoppar'],fasit:'hoppar',post:'over bekken.'},
  {pre:'Katten',alt:['sover','sovver'],fasit:'søv',post:'i sofaen.'},
  {pre:'Han',alt:['løper','løpper'],fasit:'løper',post:'fort.'},
  {pre:'Vi',alt:['lagar','laggar'],fasit:'lagar',post:'middag.'}
 ],
 regel:'«Hoppar» (kort o → pp). «Sover» (lang o → éin v). «Løper» (lang ø → éin p).',
 eks:'hoppar (kort vokal) · sover (lang vokal) · løper (lang vokal)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: «Ho ___ på stolen» (å sitje, presens).',
 hint:'Presensforma av «å sitje» har berre éin konsonant.',
 fasit:'sit',fasit_v:['sit'],
 regel:'Infinitiv: sitje (dobbel t). Presens: sit (éin t).',
 eks:'ho sit, han sit, dei sit'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandane om dobbel konsonant sanne eller usanne?',
 paastandar:[
  {tekst:'Etter kort vokal kjem alltid dobbel konsonant.',sann:true},
  {tekst:'«Bil» har dobbel l fordi i-en er kort.',sann:false},
  {tekst:'«Hoppe» har dobbel p fordi o-en er kort.',sann:true},
  {tekst:'«Dag» har éin g fordi a-en er lang.',sann:true}
 ],
 regel:'Lang vokal → éin konsonant. Kort vokal → dobbel konsonant. «Bil» har lang i.',
 eks:'bil (lang i, éin l) · ball (kort a, dobbel l)'},

/* ═══════════════════════════════════════════════════
   4. KJ / SKJ-LYDEN  (6 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av klesplagget med knappar?',
 alt:['kjorte','skjorte','sjorte','chorte'],
 fasit:'skjorte',
 regel:'«Skjorte» skriv ein med «skj».',
 eks:'Ei kvit skjorte. Eit skjørt.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av det grammatiske omgrepet (hankjønn, hokjønn, inkjekjønn)?',
 alt:['kjønn','skjønn','sjønn','kjøn'],
 fasit:'kjønn',
 regel:'«Kjønn» = grammatisk kjønn, skriv ein med «kj». «Skjønn» = vakker, eit anna ord.',
 eks:'kjønn (grammatikk) vs. skjønn (vakker)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'fillsel',vanske:'lett',
 q:'Vel rett skrivemåte i kvar setning.',
 items:[
  {pre:'Det var ein',alt:['kjønn','skjønn'],fasit:'skjønn',post:'solnedgang.'},
  {pre:'Ho ville ikkje',alt:['kjenne','skjenne'],fasit:'kjenne',post:'seg igjen.'},
  {pre:'Han tok på seg ei ny',alt:['kjorte','skjorte'],fasit:'skjorte',post:'til festen.'},
  {pre:'Dei ville',alt:['kjøpe','skjøpe'],fasit:'kjøpe',post:'ny bil.'}
 ],
 regel:'«Skjønn» = vakker. «Kjenne» = føle/vite. «Skjorte» = klesplagg. «Kjøpe» = handle.',
 eks:'skjønn dag · kjenne igjen · ny skjorte · kjøpe bil'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'drag_kolonne',vanske:'medium',
 q:'Sorter orda: skriv ein dei med «kj» eller «skj»?',
 kolonner:['Skriv med «kj»','Skriv med «skj»'],
 ord:[
  {tekst:'kjøpe',fasit:0},
  {tekst:'skjorte',fasit:1},
  {tekst:'kjøre',fasit:0},
  {tekst:'skjønn (vakker)',fasit:1},
  {tekst:'kjønn (grammatikk)',fasit:0},
  {tekst:'skjønne (forstå)',fasit:1}
 ],
 regel:'«Kj» og «skj» gir same lyd, men kva ein brukar kjem an på ordet.',
 eks:'kjøpe, kjøre, kjønn (kj) · skjorte, skjønn, skjønne (skj)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Ho ___ ikkje kvifor han var sint.» (å forstå, preteritum)',
 hint:'Preteritum av «å skjønne».',
 fasit:'skjønte',fasit_v:['skjønte'],
 regel:'«Å skjønne» → preteritum «skjønte». Skriv med «skj».',
 eks:'Ho skjønte det med ein gong. Eg skjønte ingenting.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «Ho ___ igjen lukta frå barndomen.» (å kjenne, preteritum)',
 hint:'Preteritum av «å kjenne». Skriv med «kj».',
 fasit:'kjende',fasit_v:['kjende','kjente'],
 regel:'«Å kjenne» → preteritum «kjende» (nynorsk). Skriv med «kj».',
 eks:'Ho kjende igjen lukta. Han kjende seg att.'},

/* ═══════════════════════════════════════════════════
   5. TEIKNSETTING  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kvar set du komma? «Eg likar fotball tennis og symjing.»',
 alt:['Eg likar fotball, tennis og symjing.','Eg likar, fotball, tennis, og, symjing.','Ingen stad – inga komma trengst.','Eg likar fotball, tennis, og symjing.'],
 fasit:'Eg likar fotball, tennis og symjing.',
 regel:'Komma mellom ledd i oppramsing, men ikkje framfor siste «og».',
 eks:'Eg kjøpte brød, mjølk og ost.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kvar set du komma? «Sidan ho var sjuk gjekk ho heim.»',
 alt:['Sidan ho var sjuk, gjekk ho heim.','Sidan, ho var sjuk gjekk ho heim.','Sidan ho var, sjuk gjekk ho heim.','Inga komma trengst.'],
 fasit:'Sidan ho var sjuk, gjekk ho heim.',
 regel:'Komma etter framskuven leddsetning: [leddsetning], [hovudsetning].',
 eks:'Fordi det regna, tok vi bussen. Sjølv om ho var trøytt, gjekk ho.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'fix',vanske:'lett',
 q:'Set inn dei fem kommaa som manglar.',
 tekst:'Sjølv om det var kaldt ute bestemte vi oss for å gå tur. Vi tok med mat drikke og varme klede. Lena som er raskast i klassen sprang foran. Då vi kom heim laga vi kakao.',
 errors:{'kaldt ute bestemte':'kaldt ute, bestemte','mat drikke':'mat, drikke','Lena som':'Lena, som','klassen sprang':'klassen, sprang','heim laga':'heim, laga'},
 fasit:'ute, bestemte · mat, drikke · Lena, som · klassen, sprang · heim, laga',
 regel:'Komma etter framskuven leddsetning, i oppramsing, og rundt innskoten relativsetning.',
 eks:'Sjølv om ..., [hovudsetning]. Lena, som ..., sprang.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'fix',vanske:'medium',
 q:'Rett teiknsettinga i teksten (2 feil).',
 tekst:'Ho sa at \"Det finst ingen enkel løysing\" og alle var einige. Rapporten konkluderer med at: mengda plast kan tredoble seg.',
 errors:{'\"Det finst ingen enkel løysing\"':'«Det finst ingen enkel løysing»','at: mengda':'at mengda'},
 fasit:'Bruk guillemet «» i staden for " ". Fjern kolon etter «at».',
 regel:'Bruk «guillemet» (« ») for sitat på norsk. Ikkje kolon etter «at» i leddsetning.',
 eks:'Ho sa: «Eg kjem.» · Rapporten viser at mengda aukar.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: treng setninga kolon (:) eller semikolon (;)?',
 kolonner:['Kolon (:)','Semikolon (;)'],
 ord:[
  {tekst:'Ho snakka om tre ting … klima, plast og energi.',fasit:0},
  {tekst:'Det regna heile dagen … likevel gjekk vi tur.',fasit:1},
  {tekst:'Resultata viste eitt funn … plastmengda hadde auka.',fasit:0},
  {tekst:'Eg er ikkje trøytt … eg er svolten.',fasit:1}
 ],
 regel:'Kolon innleier forklaring eller liste. Semikolon knyter to sjølvstendige setningar.',
 eks:'tre ting: a, b, c (kolon) · ikkje trøytt; eg er svolten (semikolon)'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'fillsel',vanske:'vanskeleg',
 q:'Vel rett teikn i kvar setning.',
 items:[
  {pre:'Ho gjekk heim',alt:[', og','. Og','og'],fasit:', og',post:'han vart att.'},
  {pre:'Ho las og skreiv',alt:[', heile','. Heile',' heile'],fasit:' heile',post:'dagen.'},
  {pre:'Ho sa',alt:[': «',', «',' «'],fasit:': «',post:'Eg kjem snart.»'}
 ],
 regel:'Komma + «og» mellom to hovudsetningar. Ingen komma når «og» bind to verb. Kolon før direkte tale.',
 eks:'Ho gjekk, og han vart. Ho las og skreiv. Ho sa: «Hei.»'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kvar er komma nødvendig? «Læraren som underviser i norsk heiter Kari.»',
 alt:['Læraren, som underviser i norsk, heiter Kari.','Læraren som underviser i norsk, heiter Kari.','Inga komma trengst.','Læraren, som underviser i norsk heiter Kari.'],
 fasit:'Læraren, som underviser i norsk, heiter Kari.',
 regel:'Komma rundt innskoten (ikkje-restriktiv) relativsetning som gir tilleggsinformasjon.',
 eks:'Læraren, som alltid er hyggeleg, heiter Kari.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om teiknsetting sanne eller usanne?',
 paastandar:[
  {tekst:'Ein set komma framfor «og» i ei oppramsing.',sann:false},
  {tekst:'Ein set komma etter framskuven leddsetning.',sann:true},
  {tekst:'Ein set komma framfor «at» i norsk.',sann:false},
  {tekst:'Kolon innleier ei forklaring eller ei liste.',sann:true},
  {tekst:'Semikolon knyter to sjølvstendige setningar utan bindeord.',sann:true}
 ],
 regel:'Ikkje komma framfor siste «og» i oppramsing. Ikkje komma framfor «at». Kolon = «nemleg».',
 eks:'brød, mjølk og ost (ikkje komma før og)'},

/* ═══════════════════════════════════════════════════
   6. ORDKLASSAR  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'lett',
 q:'Dra kvart ord til rett ordklasse: substantiv eller verb?',
 kolonner:['Substantiv','Verb'],
 ord:[
  {tekst:'bok',fasit:0},{tekst:'spring',fasit:1},
  {tekst:'hund',fasit:0},{tekst:'søv',fasit:1},
  {tekst:'skulen',fasit:0},{tekst:'skriv',fasit:1},
  {tekst:'glede',fasit:0},{tekst:'hoppar',fasit:1}
 ],
 regel:'Substantiv er namn på ting, personar, stader og omgrep. Verb seier kva nokon gjer eller er.',
 eks:'Substantiv: bok, hund, skulen. Verb: spring, søv, skriv.'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'medium',
 q:'Dra kvart ord til rett ordklasse: adjektiv eller adverb?',
 kolonner:['Adjektiv','Adverb'],
 ord:[
  {tekst:'rask',fasit:0},{tekst:'raskt',fasit:1},
  {tekst:'vakker',fasit:0},{tekst:'alltid',fasit:1},
  {tekst:'glad',fasit:0},{tekst:'svært',fasit:1},
  {tekst:'stor',fasit:0},{tekst:'sjeldan',fasit:1}
 ],
 regel:'Adjektiv skildrar substantiv. Adverb modifiserer verb, adjektiv eller andre adverb.',
 eks:'rask gut (adj.) · spring raskt (adv.) · alltid glad (adv. + adj.)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Dra kvart ord til rett ordklasse: pronomen eller konjunksjon?',
 kolonner:['Pronomen','Konjunksjon'],
 ord:[
  {tekst:'ho',fasit:0},{tekst:'og',fasit:1},
  {tekst:'dei',fasit:0},{tekst:'men',fasit:1},
  {tekst:'seg',fasit:0},{tekst:'eller',fasit:1},
  {tekst:'sin',fasit:0},{tekst:'for',fasit:1}
 ],
 regel:'Pronomen erstattar substantiv. Konjunksjonar bind saman setningar eller ledd.',
 eks:'Pronomen: ho, dei, seg. Konjunksjon: og, men, eller.'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'klikk_marker',vanske:'lett',
 q:'Klikk på alle verba i setninga.',
 tekst:'Hunden spring fort og bjeffer høgt når naboen kjem.',
 maalordklasse:'verb',
 fasit_ord:['spring','bjeffer','kjem'],
 regel:'Verb seier kva nokon gjer, tenkjer eller er.',
 eks:'spring, bjeffer, kjem = handlingsverb'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'klikk_marker',vanske:'medium',
 q:'Klikk på alle substantiva i setninga.',
 tekst:'Læraren skreiv ei lang oppgåve på tavla kvar dag.',
 maalordklasse:'substantiv',
 fasit_ord:['læraren','oppgåve','tavla','dag'],
 regel:'Substantiv er namn på personar, ting, stader og omgrep.',
 eks:'læraren (person), oppgåve (ting), tavla (ting), dag (tid/omgrep)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva ordklasse høyrer «rask» til i «Han er ein rask løpar»?',
 alt:['Substantiv','Adjektiv','Verb','Adverb'],
 fasit:'Adjektiv',
 regel:'Adjektiv skildrar substantiv. Her skildrar «rask» substantivet «løpar».',
 eks:'ein rask løpar · ei stor bok · eit raudt hus'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Kva ordklasse er «fort» i «Han spring fort»?',
 alt:['Adjektiv','Adverb','Verb','Preposisjon'],
 fasit:'Adverb',
 regel:'Adverb seier korleis, når eller kor mykje. Her seier «fort» korleis han spring.',
 eks:'fort, sakte, alltid, aldri, svært'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'finn_feil',vanske:'medium',
 q:'Klikk på kvart ord som er eit verb i setninga.',
 tekst:'Ho skreiv brevet raskt og sende det same kvelden.',
 fasit_feil:['skreiv','sende'],
 regel:'Verb seier kva nokon gjer. «Skreiv» og «sende» er handlingsverb i preteritum.',
 eks:'skreiv (å skrive) · sende (å sende)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'cloze',vanske:'lett',
 q:'«Raskt» i «Han sprang raskt» er eit ___.',
 hint:'Ordet seier noko om korleis han sprang – det endrar verbet.',
 fasit:'adverb',fasit_v:['adverb','biord'],
 regel:'Adverb modifiserer verb. Her modifiserer «raskt» verbet «sprang».',
 eks:'Han sprang raskt. Ho song vakkert. Dei jobba hardt.'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskeleg',
 q:'Kva ordklasse er «fordi» i «Ho gjekk heim fordi ho var trøytt»?',
 alt:['Subjunksjon','Konjunksjon','Adverb','Preposisjon'],
 fasit:'Subjunksjon',
 regel:'Subjunksjonar innleier leddsetningar. «Fordi» innleier ei årsaks-leddsetning.',
 eks:'fordi, at, når, om, sjølv om, medan, sidan, dersom'},

/* ═══════════════════════════════════════════════════
   7. SETNINGSBYGGING  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'lett',
 q:'Set orda i rett rekkjefølgje (V2-regelen, tidsadverbial fremst).',
 ord:['I','dag','skal','vi','ha','prøve','.'],
 fasit:'I dag skal vi ha prøve .',
 regel:'Etter framskuven adverbial kjem verbet på plass 2: «I dag skal vi …».',
 eks:'I dag skal vi … · I går gjekk ho …'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 q:'Set orda i rett rekkjefølgje (leddsetning med «at»).',
 ord:['Ho','seier','at','han','ikkje','kjem','.'],
 fasit:'Ho seier at han ikkje kjem .',
 regel:'I leddsetning («at …»): nektingsadverbet «ikkje» kjem framfor verbet.',
 eks:'Ho seier at han ikkje kjem. Eg trur at det ikkje stemmer.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 q:'Set orda i rett rekkjefølgje (spørjesetning).',
 ord:['Kvifor','kom','du','ikkje','i','går','?'],
 fasit:'Kvifor kom du ikkje i går ?',
 regel:'Spørjesetning: spørjeord – verb – subjekt – resten.',
 eks:'Kvifor kom du …? Kvar bur ho …?'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva er problemet med: «Han gjekk tur og det var kaldt og han hadde ikkje lue og det var dumt.»?',
 alt:['For mange «og» – teksten bør delast opp','«Tur» er feil ord','«Kaldt» er feil','Det er ingen feil'],
 fasit:'For mange «og» – teksten bør delast opp',
 regel:'Unngå lange kjeder med «og». Del opp med punktum og variér setningsoppbygginga.',
 eks:'Han gjekk tur. Det var kaldt, og han angra på at han hadde gløymt lua.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Kva er den beste samanslåinga av: «Brettspel er bra. Brettspel samlar folk. Brettspel er sosialt.»?',
 alt:['Brettspel er sosialt og samlar folk til felles aktivitet.','Brettspel er bra, samlar folk og brettspel er sosialt.','Brettspel er bra. Og sosialt. Og samlar folk.','Brettspel er bra fordi brettspel er sosialt og samlar folk.'],
 fasit:'Brettspel er sosialt og samlar folk til felles aktivitet.',
 regel:'Slå saman setningar med same tema. Unngå å gjenta same ord fleire gonger.',
 eks:'Brettspel er sosialt og samlar folk til felles aktivitet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskeleg',
 q:'Kva er den beste faglege omskrivinga av: «Klimaendringar er eit veldig stort problem og sånn, og det påverkar alle.»?',
 alt:['Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.','Klimaendringar er eit veldig alvorleg og stort problem.','Klimaendringane er store og alle bør gjere noko.','Klimaendringar er eit problem som påverkar oss.'],
 fasit:'Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.',
 regel:'Fjern «og sånn», vage ord og samankopling. Bruk presist og variert ordval.',
 eks:'«veldig stort» → «alvorleg globalt» · «og sånn» → fjern'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'sorter_rekke',vanske:'medium',
 q:'Set delane i rett rekkjefølgje for ein fagleg innleiing.',
 items:[
  {tekst:'Presentere temaet'},
  {tekst:'Gje bakgrunnsinformasjon'},
  {tekst:'Formulere problemstilling'},
  {tekst:'Varsle oppbygginga av teksten'}
 ],
 regel:'Ein god innleiing: tema → bakgrunn → problemstilling → oppbyggingssignal.',
 eks:'Klimaendringar er … [tema] → Forsking viser … [bakgrunn] → Spørsmålet er … [problemstilling]'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'fix',vanske:'vanskeleg',
 q:'Forbetr teksten: fjern gjentaking og munnlege uttrykk.',
 tekst:'Det er bra å trene fordi det er bra for helsa. Trening er bra og trening gjer at du vert sterkare og sånn.',
 errors:{'Det er bra å trene fordi det er bra for helsa.':'Regelmessig trening styrkjer helsa.','Trening er bra og trening gjer at du vert sterkare og sånn.':'Fysisk aktivitet betrar både kondisjon og muskelstyrke.'},
 fasit:'Regelmessig trening styrkjer helsa. Fysisk aktivitet betrar både kondisjon og muskelstyrke.',
 regel:'Unngå å gjenta same ord. Bruk synonym og variert ordval. Fjern «og sånn».',
 eks:'«bra» → «styrkjer helsa» · «sterkare og sånn» → «betrar kondisjon og muskelstyrke»'},

/* ═══════════════════════════════════════════════════
   8. BINDEORD  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Vel rett bindeord: «Ho var trøytt, ___ gjekk ho heim.»',
 alt:['difor','men','fordi','og'],
 fasit:'difor',
 regel:'«Difor» viser konsekvens: ho var trøytt → difor gjekk ho heim.',
 eks:'Ho var trøytt, difor gjekk ho heim.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Vel rett bindeord: «Det regnar, ___ vi går ut likevel.»',
 alt:['men','difor','fordi','og'],
 fasit:'men',
 regel:'«Men» viser kontrast – to ting som går mot kvarandre.',
 eks:'Det regnar, men vi går ut likevel.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva er skilnaden mellom «men» og «sjølv om»?',
 alt:['«Men» knyter to hovudsetningar; «sjølv om» innleier ein leddsetning','Dei tyder det same','«Sjølv om» er sterkare enn «men»','«Men» er bokmål; «sjølv om» er nynorsk'],
 fasit:'«Men» knyter to hovudsetningar; «sjølv om» innleier ein leddsetning',
 regel:'«Men» = koordinerande. «Sjølv om» = subordinerande (innleier leddsetning).',
 eks:'Ho er trøytt, men ho les. Sjølv om ho er trøytt, les ho.'},

{kat:'bindeord',kat_label:'Bindeord',type:'fillsel',vanske:'medium',
 q:'Vel rett bindeord i kvar setning.',
 items:[
  {pre:'Ho trena mykje,',alt:['difor','men','fordi'],fasit:'difor',post:'vann ho.'},
  {pre:'',alt:['Sjølv om','Fordi','Difor'],fasit:'Sjølv om',post:'det regnar, går vi tur.'},
  {pre:'Forsking viser gode resultat;',alt:['likevel','difor','fordi'],fasit:'likevel',post:'er det utfordringar.'},
  {pre:'Ho gjekk til legen',alt:['men','fordi','likevel'],fasit:'fordi',post:'ho var sjuk.'}
 ],
 regel:'Difor = konsekvens. Sjølv om = motsetnad. Likevel = kontrast. Fordi = årsak.',
 eks:'trena → difor vann · sjølv om det regnar → likevel'},

{kat:'bindeord',kat_label:'Bindeord',type:'fillsel',vanske:'vanskeleg',
 q:'Vel det mest presise bindeordet.',
 items:[
  {pre:'KI kan vere nyttig,',alt:['men','og','difor'],fasit:'men',post:'det reiser etiske spørsmål.'},
  {pre:'Ho øvde mykje.',alt:['Dessutan','Likevel','Difor'],fasit:'Dessutan',post:'las ho teori kvar kveld.'},
  {pre:'Han studerte flittig,',alt:['altså','likevel','og'],fasit:'likevel',post:'strauk han på eksamen.'}
 ],
 regel:'Men = motsetnad. Dessutan = tillegg. Likevel = uventa kontrast.',
 eks:'nyttig, men etiske spørsmål · øvde, dessutan las teori · studerte, likevel strauk'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 q:'Set orda i rett rekkjefølgje (V2 etter «difor»).',
 ord:['Difor','gjekk','ho','heim','tidleg','.'],
 fasit:'Difor gjekk ho heim tidleg .',
 regel:'Etter «difor» kjem verbet framfor subjektet (V2-regelen).',
 eks:'Difor gjekk ho … · Likevel møtte han …'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 q:'Set orda i rett rekkjefølgje (V2 etter «likevel»).',
 ord:['Likevel','møtte','han','opp','på','skulen','.'],
 fasit:'Likevel møtte han opp på skulen .',
 regel:'Etter «likevel» kjem verbet framfor subjektet (V2-regelen).',
 eks:'Likevel møtte han … · Dessutan er det …'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_kolonne',vanske:'medium',
 q:'Sorter bindeorda etter funksjon: årsak eller kontrast?',
 kolonner:['Årsak / konsekvens','Kontrast / motsetnad'],
 ord:[
  {tekst:'fordi',fasit:0},
  {tekst:'likevel',fasit:1},
  {tekst:'difor',fasit:0},
  {tekst:'men',fasit:1},
  {tekst:'ettersom',fasit:0},
  {tekst:'sjølv om',fasit:1}
 ],
 regel:'Fordi, difor, ettersom = årsak/konsekvens. Likevel, men, sjølv om = kontrast.',
 eks:'fordi ho øvde (årsak) · likevel strauk han (kontrast)'},

{kat:'bindeord',kat_label:'Bindeord',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Sosiale medium kan vere nyttige. ___, kan dei ha negative konsekvensar.»',
 hint:'Du treng eit bindeord som viser kontrast.',
 fasit:'Likevel',fasit_v:['Likevel','Derimot','Trass i dette','På den andre sida'],
 regel:'«Likevel», «derimot» og «på den andre sida» viser kontrast.',
 eks:'Sosiale medium er nyttige. Likevel kan dei ha negative konsekvensar.'},

{kat:'bindeord',kat_label:'Bindeord',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «___ ungdom skriv meir enn nokon gong, tyder det ikkje at dei skriv betre.»',
 hint:'Kva bindeord viser at noko skjer trass i noko anna?',
 fasit:'Sjølv om',fasit_v:['Sjølv om','Trass i at','Endå om'],
 regel:'«Sjølv om» innleier ein leddsetning som viser kontrast.',
 eks:'Sjølv om det er vanskeleg, prøver ho.'},

/* ═══════════════════════════════════════════════════
   9. TEKSTSTRUKTUR  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'lett',
 q:'Sorter avsnitta til rett del av fagartikkelen.',
 lag:['Innleiing','Hovuddel','Avslutning'],
 avsnitt:[
  {tekst:'Plast i havet er eit aukande problem som påverkar dyr og natur over heile verda.',lag:0},
  {tekst:'Éi løysing er å innføre strengare regulering av eingongsplast i alle EU-land.',lag:1},
  {tekst:'Kjeldesortering og betre infrastruktur kan òg redusere problemet.',lag:1},
  {tekst:'Alt i alt viser dette at plastforureining krev samarbeid på tvers av landegrenser.',lag:2}
 ],
 regel:'Innleiinga presenterer temaet. Hovuddelen utdjupar. Avsluttinga konkluderer.',
 eks:'Innleiing → tema · Hovuddel → argument · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'medium',
 q:'Sorter avsnitta frå eit debattinnlegg om skjermtid til rett del.',
 lag:['Innleiing med påstand','Argument for','Motargument og tilbakevising','Avslutning'],
 avsnitt:[
  {tekst:'Born under tolv år bør ikkje ha eigen mobiltelefon.',lag:0},
  {tekst:'Forsking viser at mykje skjermtid reduserer konsentrasjonsevna hos unge.',lag:1},
  {tekst:'Nokon vil hevde at mobilen er nødvendig for tryggleik, men det finst enklare alternativ.',lag:2},
  {tekst:'Samla sett er det gode grunnar til å avgrense tilgangen til mobilar for born.',lag:3}
 ],
 regel:'Debattinnlegg: påstand → argument → motargument + tilbakevising → konklusjon.',
 eks:'Påstand tidleg · Argument med kjelde · Motargument tilbakevist · Konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Kva er ein ingress?',
 alt:['Éi til to setningar som innleier og presenterer temaet','Den lengste hovuddelen av teksten','Kjeldelista nedst i teksten','Avslutninga av teksten'],
 fasit:'Éi til to setningar som innleier og presenterer temaet',
 regel:'Ingressen kjem etter overskrifta og gir lesaren eit raskt overblikk.',
 eks:'«Plasten i havet er ein av vår tids største miljøtruslar. Her er det du treng å vite.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Kva er feil med ei avslutting i ein fagartikkel?',
 alt:['Ho skal introdusere ny informasjon','Ho skal oppsummere hovudpoenga','Ho bør knyte an til innleiinga','Ho bør vere kortare enn hovuddelen'],
 fasit:'Ho skal introdusere ny informasjon',
 regel:'Avslutninga oppsummerer og avrundar – ho tek ikkje opp nye tema.',
 eks:'Feil: «Forresten er det òg eit problem med havforsuring …» (nytt tema i avslutting)'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'avsnitt_klikk',vanske:'lett',
 q:'Klikk på det første ordet der eit nytt avsnitt bør starte.',
 segments:[
  {id:'s0',tekst:'Klimaendringar er eit av dei største problema vi står overfor i dag.'},
  {id:'s1',tekst:'Gjennomsnittstemperaturen har stige med over éin grad sidan den industrielle revolusjonen.',first_word:'Gjennomsnittstemperaturen'},
  {id:'s2',tekst:'For å stoppe oppvarminga må verdssamfunnet kutte utslepp drastisk.',first_word:'For'},
  {id:'s3',tekst:'Mange land har allereie innført tiltak mot karbonutslepp.',first_word:'Mange'}
 ],
 fasit_breaks:['s2'],
 regel:'Nytt avsnitt ved nytt poeng. «For å stoppe …» skiftar frå problem til løysing.',
 eks:'Avsnitt 1: fakta om problemet · Avsnitt 2: kva som må gjerast'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'medium',
 q:'Kva overskrift er fagleg god, og kva er dårleg?',
 kolonner:['God fagleg overskrift','Dårleg overskrift'],
 ord:[
  {tekst:'Klimaendringar: kva ungdom kan gjere',fasit:0},
  {tekst:'DET ER VIKTIG Å REDDE PLANETEN VÅR!!!',fasit:1},
  {tekst:'Sosiale medium og psykisk helse hos ungdom',fasit:0},
  {tekst:'Ein liten tekst om klima og sånne ting',fasit:1}
 ],
 regel:'Ein god fagleg overskrift er presis, nøytral og lovar kva teksten handlar om.',
 eks:'God: «Klimaendringar: kva ungdom kan gjere» · Dårleg: vag, skrikande, uformell'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Kva høyrer heime i eit drøftande debattinnlegg og kva ikkje?',
 kolonner:['Høyrer heime','Høyrer IKKJE heime'],
 ord:[
  {tekst:'Argument for og mot påstanden',fasit:0},
  {tekst:'Konklusjon med eiga vurdering',fasit:0},
  {tekst:'Personleg forteljing om ein gong du var lei',fasit:1},
  {tekst:'Historia til mobiltelefonen frå 1973 til i dag',fasit:1},
  {tekst:'Kjeldetilvising til forsking',fasit:0},
  {tekst:'Korleis du lagar ein app',fasit:1}
 ],
 regel:'«Drøft» = argument for og mot + konklusjon. Personlege forteljingar og historikk utan kopling høyrer ikkje heime.',
 eks:'Høyrer heime: argument, kjelde, konklusjon · Ikkje: irrelevant historie'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Eit godt avsnitt har: temasetning → ___ → avslutningssetning.',
 hint:'Kva kjem mellom temasetning og avslutning – det som utdjupar hovudpoenget?',
 fasit:'utdjupande setningar',
 fasit_v:['utdjupande setningar','kommentarsetningar','forklaringar og døme','utdjuping','kommentarar'],
 regel:'Etter temasetning kjem utdjupande kommentarsetningar med forklaring, bevis og døme.',
 eks:'Temasetning → forklaring → bevis/kjelde → kommentar'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Fyll inn eit overgangsord: «KI kan effektivisere arbeidet, ___ reiser det òg etiske spørsmål.»',
 hint:'Du treng eit ord som viser motsetnad.',
 fasit:'men',fasit_v:['men','likevel','samstundes'],
 regel:'«Men» og «likevel» signaliserer motsetnad og er sentrale i drøftande tekstar.',
 eks:'KI er nyttig, men vi må stille kritiske spørsmål.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'sorter_rekke',vanske:'vanskeleg',
 q:'Set delane av eit fagleg avsnitt i rett rekkjefølgje.',
 items:[
  {tekst:'Temasetning: presenterer hovudpoenget i avsnittet'},
  {tekst:'Utdjuping: forklarer med fakta eller døme'},
  {tekst:'Kjeldetilvising: støttar påstanden med dokumentasjon'},
  {tekst:'Kommentar: oppsummerer og peikar mot neste avsnitt'}
 ],
 regel:'Temasetning → utdjuping → kjelde → kommentar = standard avsnittstruktur.',
 eks:'Plast er farleg [tema] → 80 % av sjøfuglar [utdjuping] → (WWF, 2023) [kjelde] → Dette viser … [komm.]'},

/* ═══════════════════════════════════════════════════
   10. KJELDEBRUK  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Korleis skriv du ei kjeldetilvising i teksten?',
 alt:['(Etternamn, årstal)','[lenke til nettsida]','Forfatter: tittel','«sitat» – kjelde'],
 fasit:'(Etternamn, årstal)',
 regel:'Standardformat: (Etternamn, årstal) i parentes etter påstanden.',
 eks:'Plasten har auka med 40 % (Jensen, 2024).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Kvar i teksten skal kjeldelista stå?',
 alt:['Heilt til slutt i dokumentet','I innleiinga','Midt i teksten','Rett etter første kjelde'],
 fasit:'Heilt til slutt i dokumentet',
 regel:'Kjeldelista kjem alltid aller sist, gjerne med overskrifta «Kjeldeliste».',
 eks:'Hovudtekst → avslutning → kjeldeliste'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva er feil kjeldebruk?',
 alt:['Kopiere eit avsnitt utan sitat og kjelde','Bruke ein påstand med (Jensen, 2024)','Skrive «Ifølge Miljødirektoratet (2023)»','Ha kjeldeliste på slutten'],
 fasit:'Kopiere eit avsnitt utan sitat og kjelde',
 regel:'Å kopiere utan å markere sitat og oppgi kjelde er plagiat.',
 eks:'Feil: kopiert tekst. Rett: «…» (Kjelde, årstal) eller parafrase (Kjelde, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om kjeldebruk sanne eller usanne?',
 paastandar:[
  {tekst:'Kjeldelista skal vere sortert alfabetisk etter etternamn.',sann:true},
  {tekst:'Wikipedia er alltid ei god kjelde å sitere i ein fagartikkel.',sann:false},
  {tekst:'Direkte sitat skal stå i hermeteikn med kjeldetilvising.',sann:true},
  {tekst:'Ein treng ikkje kjelde viss ein skriv med eigne ord.',sann:false}
 ],
 regel:'Alfabetisk kjeldeliste. Wikipedia er ikkje citerbar. Omskriving treng òg kjelde.',
 eks:'Omskriving: Di formulering (Kjelde, årstal). Sitat: «Ordrett» (Kjelde, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om kjeldekritikk sanne eller usanne?',
 paastandar:[
  {tekst:'Ei primærkjelde er ein original rapport eller ei lov.',sann:true},
  {tekst:'Sensasjonsoverskrifter er eit teikn på påliteleg journalistikk.',sann:false},
  {tekst:'Ein bør vurdere forfattarens kompetanse og mogleg agenda.',sann:true},
  {tekst:'Fagfellevurderte tidsskrift har høg standard.',sann:true},
  {tekst:'Alder på ei kjelde spelar aldri noka rolle.',sann:false}
 ],
 regel:'Vurder: kven, kvar, når, kvifor. Fagfellevurdering = kvalitetsstempel.',
 eks:'Primærkjelde: NOU-rapport. Sekundærkjelde: avisomtale av rapporten.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'drag_kolonne',vanske:'medium',
 q:'Kva treng hermeteikn (direkte sitat), og kva kan stå fritt med kjeldetilvising (omskriving)?',
 kolonner:['Treng hermeteikn (sitat)','Kan stå fritt (omskriving)'],
 ord:[
  {tekst:'«1,3 millionar tonn plast hamnar i havet kvart år»',fasit:0},
  {tekst:'Forsking viser at plast er eit aukande problem i verdshava.',fasit:1},
  {tekst:'«Mikroplast trengjer inn i næringskjeda og skadar dyrelivet»',fasit:0},
  {tekst:'Havpattedyr og fuglar er særleg utsette for plastforureining.',fasit:1}
 ],
 regel:'Set hermeteikn berre ved ordrett sitering. Eiga omskriving treng kjelde-, men ikkje hermeteikn.',
 eks:'Sitat: «Ordrett» (Kjelde, årstal). Omskriving: Di formulering (Kjelde, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Kva er teikn på truverdig kjelde, og kva er varselteikn?',
 kolonner:['Teikn på truverdig kjelde','Varselteikn'],
 ord:[
  {tekst:'Kjend forfattar med fagleg bakgrunn',fasit:0},
  {tekst:'Sensasjonsoverskrift med utropsteikn',fasit:1},
  {tekst:'Kjeldetilvisingar og publiseringsdato',fasit:0},
  {tekst:'Anonym avsendar utan datoen',fasit:1},
  {tekst:'Tilknyting til universitet eller forskingsmiljø',fasit:0},
  {tekst:'Berre eitt synspunkt utan motargument',fasit:1}
 ],
 regel:'Truverdig: kjend forfattar, kjelder, dato, institusjon. Varsel: anonym, sensasjon, einsidig.',
 eks:'Forskning.no: forfattar, fagredaksjon, kjelder. Anonym blogg: varselteikn.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'cloze',vanske:'medium',
 q:'Fyll inn det rette ordet: Villspor. (2023). Friluftsliv frå 1970 til i dag. ___ 15. mars 2026 frå: magasinetvillspor.no/…',
 hint:'Kva standardord brukast i kjeldelista for å fortelje at du har besøkt ei nettside?',
 fasit:'Henta',fasit_v:['Henta','henta'],
 regel:'Standardfrasen i kjeldelista er «Henta [dato] frå:» for nettkjelder.',
 eks:'Jensen, K. (2024). Tittel. Henta 15. mars 2026 frå: lenke.no'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse er eit korrekt sitat med kjeldetilvising?',
 alt:['«Det har aldri vore meir kunstsnø i skibakkane» (NRK, 2022).','NRK skreiv i 2022 at det er mykje kunstsnø.','Kunstsnø er mykje brukt (kjelda er NRK).','(NRK) Det er mykje kunstsnø.'],
 fasit:'«Det har aldri vore meir kunstsnø i skibakkane» (NRK, 2022).',
 regel:'Direkte sitat: hermeteikn rundt ordrett tekst, deretter (Kjelde, årstal) i parentes.',
 eks:'«Ordrett tekst» (Etternamn, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mcset',vanske:'vanskeleg',
 q:'Les setninga og svar: «Ifølge NRK (2024) har snøsesongen vorte kortare dei siste ti åra.»',
 questions:[
  {q:'Kva type kjeldebruk er dette?',alt:['Direkte sitat','Parafrase/omskriving','Plagiat'],fasit:1},
  {q:'Er kjeldetilvisinga rett plassert?',alt:['Ja','Nei – ho bør stå etter punktum','Nei – ho manglar hermeteikn'],fasit:0},
  {q:'Kva type kjelde er NRK?',alt:['Primærkjelde','Sekundærkjelde','Ikkje ei gyldig kjelde'],fasit:1}
 ],
 regel:'Parafrase = eiga formulering med kjelde. NRK rapporterer om annan forsking = sekundærkjelde.',
 eks:'Parafrase: «Ifølge NRK (2024) …» – eigne ord, med kjelde.'},

/* ═══════════════════════════════════════════════════
   11. OPPGÅVETOLKING  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva betyr bestillingsordet «drøft» i ei norskoppgåve?',
 alt:['Presenter berre eitt synspunkt','Vis to sider og veg dei mot kvarandre','Skriv ein kreativ tekst','Beskriv korleis noko ser ut'],
 fasit:'Vis to sider og veg dei mot kvarandre',
 regel:'«Drøft» = presenter argument for og mot, og trekk ein konklusjon.',
 eks:'«Drøft om skulen bør forby mobilar» = argument for + mot + konklusjon.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva betyr bestillingsordet «grei ut om»?',
 alt:['Ta tydeleg stilling','Forklar og informer grundig','Samanlikn to syn','Skriv kreativt'],
 fasit:'Forklar og informer grundig',
 regel:'«Grei ut om» = forklarande og informerande skriving utan å ta stilling.',
 eks:'«Grei ut om årsaker til utanforskap» = forklar kvifor det skjer.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva seier: «Presenter hovudkaraktaren, og drøft korleis forfattaren brukar kontrastar.» Kor mange delar har oppgåva?',
 alt:['Éin del','To delar','Tre delar','Fire delar'],
 fasit:'To delar',
 regel:'«Presenter … og drøft» = to bestillingsord = to delar. Telje alltid bestillingsorda.',
 eks:'Del 1: presenter hovudkaraktaren. Del 2: drøft bruken av kontrastar.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'lett',
 q:'Oppgåva er: «Drøft om skulen bør innføre mobilforbod.» Kva høyrer heime i svaret?',
 kolonner:['Passar til oppgåva','Passar IKKJE'],
 ord:[
  {tekst:'Argument for mobilforbod',fasit:0},
  {tekst:'Argument mot mobilforbod',fasit:0},
  {tekst:'Konklusjon med eiga vurdering',fasit:0},
  {tekst:'Historia til mobiltelefonen (1973–i dag)',fasit:1},
  {tekst:'Korleis ein lagar ein mobiltelefon',fasit:1},
  {tekst:'Personleg forteljing om mobiltjuveri',fasit:1}
 ],
 regel:'«Drøft» = argument for + mot + konklusjon. Irrelevant historikk og personlege forteljingar høyrer ikkje heime.',
 eks:'Høyrer heime: argument, kjelde, konklusjon. Ikkje: historie om mobilen.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'medium',
 q:'Oppgåva er: «Analyser korleis forfattaren brukar naturskildringar i novella.» Kva høyrer heime?',
 kolonner:['Høyrer heime','Høyrer IKKJE heime'],
 ord:[
  {tekst:'Kva funksjon har naturskildringa i teksten?',fasit:0},
  {tekst:'Kva litterære verkemiddel brukar forfattaren?',fasit:0},
  {tekst:'Handlingsreferat: kva skjer i novella?',fasit:1},
  {tekst:'Forfattarens biografi og liv',fasit:1},
  {tekst:'Korleis skapar naturskildringa stemning?',fasit:0},
  {tekst:'«Eg synest naturskildringa var fin»',fasit:1}
 ],
 regel:'«Analyser» = undersøk korleis noko er bygd opp og kva funksjon det har. Ikkje referat eller personlege meiningar.',
 eks:'Analyse = verkemiddel + funksjon. Ikkje = «eg synest dette er fint».'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om oppgåvetolking sanne eller usanne?',
 paastandar:[
  {tekst:'Bestillingsord er verba som fortel kva du skal gjere i oppgåva.',sann:true},
  {tekst:'«Presenter» og «drøft» krev same type tekst.',sann:false},
  {tekst:'«Samanlikn» betyr å peike på likskapar og skilnader.',sann:true},
  {tekst:'«Reflekter» betyr å gjenfortelje hendingar i rekkjefølgje.',sann:false}
 ],
 regel:'Presenter = gi oversyn. Drøft = veg argument. Samanlikn = likskapar/skilnader. Reflekter = tenkje over, vurdere.',
 eks:'Drøft ≠ presenter. Reflekter ≠ gjenfortel.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'cloze',vanske:'medium',
 q:'Oppgåva seier «analyser». Det tyder at du skal undersøkje ___ teksten er bygd opp og kva effekt grepa har.',
 hint:'Analyse handlar om å undersøkje ein bestemt ting: oppbygginga. Kva spørjeord passar?',
 fasit:'korleis',fasit_v:['korleis'],
 regel:'Analyse = systematisk undersøking av korleis noko er laga og kva det gjer med lesaren.',
 eks:'Korleis brukar forfattaren metaforar? Korleis skapar forteljarstemma nærleik?'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Tre elevar svarar på «Drøft om teknologi gjer oss meir isolerte». Kven er på bomskot?',
 alt:['Elev A viser argument for og mot, og konkluderer.','Elev B skriv om historia til internett og teknologien.','Elev C bruker tre kjelder og veg side mot side.','Elev D startar personleg, drøftar og konkluderer.'],
 fasit:'Elev B skriv om historia til internett og teknologien.',
 regel:'«Drøft» = veg argument for og mot. Å skrive historikk er «grei ut», ikkje drøfting.',
 eks:'Bomskot: svare med feil sjanger. «Grei ut»-svar der «drøft» var kravet.'},

/* ═══════════════════════════════════════════════════
   12. SPRÅK OG STIL  (10 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'lett',
 q:'Klikk på kvart ord som er for uformelt for ein fagartikkel.',
 tekst:'Plast i havet er jo heilt farleg for dyr og sånn.',
 fasit_feil:['jo','heilt','sånn'],
 regel:'Fagartiklar unngår forsterkingsord («heilt»), fyllord («jo») og vage uttrykk («og sånn»).',
 eks:'Unngå: «jo, heilt, og sånn». Skriv: «Plast i havet er ein dokumentert trussel mot dyrelivet.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Klikk på orda som gjer teksten for subjektiv for ein fagartikkel.',
 tekst:'Eg synest eigentleg at forskinga er superviktig, og at vi berre må handle no.',
 fasit_feil:['eg','synest','eigentleg','superviktig','berre'],
 regel:'I fagleg stil tonar ein ned personlege meiningar og forsterkarord.',
 eks:'Unngå: «Eg synest dette er superviktig». Skriv: «Forskinga tyder på at temaet er viktig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på orda som gjer argumentasjonen for kjensleladd.',
 tekst:'Kjeldene viser tydeleg at dette er ekstremt farleg, og alle forstår jo at vi må handle straks.',
 fasit_feil:['tydeleg','ekstremt','alle','forstår','jo','straks'],
 regel:'Absolutte og kjensleladde ord bør bytast med nøytrale, etterprøvbare formuleringar.',
 eks:'Unngå: «alle forstår jo». Skriv: «Fleire studiar peikar i same retning.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Kva setning er skriven i eit sakleg, fagleg register?',
 alt:['PLAST ER FARLEG!!!','Plast representerer ein dokumentert risiko for marint dyreliv.','Plast er jo farleg, det er liksom heilt klart.','Eg meiner plast er ganske skadeleg.'],
 fasit:'Plast representerer ein dokumentert risiko for marint dyreliv.',
 regel:'Fagleg autoritet kjem av presist ordval og kjeldetilvising, ikkje utropsteikn.',
 eks:'Fagleg: «ein dokumentert risiko» · Uformelt: «jo, heilt, liksom»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Kva er det beste faglege alternativet til: «Plast i havet er skikkeleg krise, og dyra slit skikkeleg mykje»?',
 alt:['Plast i havet er krise, og dyra slit mykje.','Det er heilt klart at plasten øydelegg for dyra.','Plastforureining i havet har alvorlege konsekvensar for dyrelivet.','Plast er eit veldig stort problem for dyr i havet.'],
 fasit:'Plastforureining i havet har alvorlege konsekvensar for dyrelivet.',
 regel:'Formell stil krev presise fagord og nøytral tone. Munnlege forsterkarar skal erstattast.',
 eks:'«skikkeleg krise» → «alvorlege konsekvensar» · «slit mykje» → «konsekvensar for dyrelivet»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykka: uformelle eller formelle?',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'liksom',fasit:0},
  {tekst:'jo',fasit:0},
  {tekst:'heilt sjukt',fasit:0},
  {tekst:'det tyder på at',fasit:1},
  {tekst:'forsking viser at',fasit:1},
  {tekst:'dokumenterte funn',fasit:1}
 ],
 regel:'Uformelle ord er munnlege og personlege. Formelle uttrykk er presise og faglege.',
 eks:'«jo/liksom» = uformelt · «forsking viser at» = formelt'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Publiseringsportalen: kva formulering vert blokkert som for skråsikker, og kva passerer?',
 kolonner:['Blokkert – for skråsikker','Passerer – fagleg nøyansert'],
 ord:[
  {tekst:'Dette beviser definitivt at tiltaket verkar.',fasit:0},
  {tekst:'Funna tyder på at tiltaket kan ha effekt.',fasit:1},
  {tekst:'Alle forskarar er einige om dette.',fasit:0},
  {tekst:'Fleire studiar indikerer ein mogleg samanheng.',fasit:1},
  {tekst:'Det er eit faktum at skulen sviktar ungdom.',fasit:0},
  {tekst:'Ein kan argumentere for at skulen treng meir ressursar.',fasit:1}
 ],
 regel:'Fagleg skriving uttrykker berre det ein kan dokumentere. «Tyder på» og «indikerer» viser nøyaktigheit.',
 eks:'Blokkert: «beviser definitivt». Passerer: «tyder på, indikerer, kan argumentere for».'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'lett',
 q:'Byt ut «kjempeviktig» med eit formelt ord: «Tiltaket var ___ for å redusere fråfall i skulen.»',
 hint:'Presist og formelt – ikkje «kjempe-» eller «super-».',
 fasit:'avgjerande',fasit_v:['avgjerande','kritisk','vesentleg','sentral','nødvendig','særleg viktig'],
 regel:'Uformelle forsterkarar som «kjempe-» erstattas med presise adjektiv.',
 eks:'«kjempeviktig» → «avgjerande» · «superbra» → «særleg vellykka»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'omskriv',vanske:'medium',
 q:'Skriv om setninga til fagleg stil.',
 tekst:'Eg trur eigentleg at skjermbruk er ganske dårleg for unge, for dei vert jo heilt oppslukte.',
 instruksjon:'Fjern personlege meiningsmarkørar og uformelle forsterkarar. Bruk nøytral, fagleg tone.',
 maa_ha:['skjermbruk','unge'],
 maa_ikkje_ha:['eg','trur','eigentleg','ganske','jo','heilt'],
 regel:'I fagtekst bør du prioritere nøytral ordbruk og etterprøvbare påstandar.',
 eks:'Mogleg svar: «Høg skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'fillsel',vanske:'medium',
 q:'Vel den mest faglege formuleringa.',
 items:[
  {pre:'',alt:['Det er jo klart at','Forsking tyder på at'],fasit:'Forsking tyder på at',post:'sosiale medium påverkar ungdom.'},
  {pre:'Tiltaket har',alt:['supergode resultat','dokumenterte positive effektar'],fasit:'dokumenterte positive effektar',post:'.'},
  {pre:'',alt:['Masse folk meiner at','Fleire studiar indikerer at'],fasit:'Fleire studiar indikerer at',post:'problemet aukar.'}
 ],
 regel:'Fagleg stil: «forsking tyder på», «dokumenterte effektar», «fleire studiar indikerer».',
 eks:'Uformelt → formelt: «jo klart» → «forsking tyder på»'},

/* ═══════════════════════════════════════════════════
   13. ÅRSAK OG SAMANHENG  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'mc',vanske:'lett',
 q:'Kva setning uttrykkjer ein årsak–verknad-samanheng?',
 alt:['Sola skin, og borna leikar ute.','Sola skin så sterkt at asfalten vert varm.','Sola skin. Borna leikar ute.','Sola skin, men det er kaldt.'],
 fasit:'Sola skin så sterkt at asfalten vert varm.',
 regel:'«Så … at» markerer at årsaka (solskin) fører til verknaden (varm asfalt).',
 eks:'«Ho las så mykje at ho vart trøytt.» = årsak–verknad'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'mc',vanske:'medium',
 q:'Kva setning brukar det mest presise årsaksuttrykket?',
 alt:['Luftforureininga aukar, og folk vert sjukare.','Luftforureininga aukar. Folk vert sjukare.','Den aukande luftforureininga fører til fleire luftvegssjukdomar.','Luftforureininga aukar, men folk vert sjukare.'],
 fasit:'Den aukande luftforureininga fører til fleire luftvegssjukdomar.',
 regel:'«Fører til» viser eksplisitt korleis A gir B. «Og» og to separate setningar er vagare.',
 eks:'Presist: «Røyking fører til større risiko.» Vagt: «Folk røykjer, og dei vert sjuke.»'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykka: årsaksuttrykk eller kontrastuttrykk?',
 kolonner:['Årsaksuttrykk','Kontrastuttrykk'],
 ord:[
  {tekst:'fordi',fasit:0},
  {tekst:'likevel',fasit:1},
  {tekst:'difor',fasit:0},
  {tekst:'derimot',fasit:1},
  {tekst:'ettersom',fasit:0},
  {tekst:'trass i',fasit:1},
  {tekst:'på grunn av',fasit:0},
  {tekst:'men',fasit:1}
 ],
 regel:'Fordi, difor, ettersom, på grunn av = årsak. Likevel, derimot, trass i, men = kontrast.',
 eks:'«Ho kom for seint fordi bussen var forseinka.» «Bussen var forseinka, men ho kom likevel.»'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: kva er årsaka og kva er verknaden?',
 kolonner:['Årsak','Verknad'],
 ord:[
  {tekst:'Utslepp av klimagassar aukar',fasit:0},
  {tekst:'Temperaturen på jorda stig',fasit:1},
  {tekst:'Skogane vert hogde ned',fasit:0},
  {tekst:'Dyreartar mistar leveområda sine',fasit:1},
  {tekst:'Isen på polane smeltar',fasit:1},
  {tekst:'Havnivået stig',fasit:1}
 ],
 regel:'Årsaka utløyser endringa. Verknaden er resultatet. Spør: «kvifor skjer dette?»',
 eks:'Utslepp aukar (årsak) → temperatur stig (verknad) → is smeltar (verknad)'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'klikk_marker',vanske:'lett',
 q:'Klikk på ordet som markerer ein årsakssamanheng.',
 tekst:'Mange artar er utryddingstruga fordi leveområda deira vert øydelagde av avskoging.',
 maalordklasse:'årsaksord',
 fasit_ord:['fordi'],
 regel:'«Fordi» knyter ei årsak til ei følgje: avskoging → utryddingstruga artar.',
 eks:'«fordi, sidan, ettersom» = årsaksord · «men, likevel, derimot» = kontrastord'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Matprisane stig, ___ mange familiar har dårlegare råd.»',
 hint:'Verknaden kjem etter årsaka. Kva ord viser konsekvens?',
 fasit:'difor',fasit_v:['difor','derfor','og difor'],
 regel:'«Difor» er eit årsaksadverb som viser at det som følgjer, er resultatet av årsaka.',
 eks:'Prisane steig, difor handla folk mindre. Vegen var glatt, difor køyrde ho sakte.'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'mcset',vanske:'medium',
 q:'Les teksten og svar.',
 tekst:'Når born les lite, utviklar dei eit smalare ordforråd. Eit smalt ordforråd gjer det vanskelegare å forstå fagtekstar. Difor heng lesevanskar og fagvanskar ofte saman.',
 questions:[
  {q:'Kva er den første årsaka?',alt:['Born les lite','Smalt ordforråd','Fagvanskar'],fasit:0},
  {q:'Kva er den mellomliggjande verknaden?',alt:['Borna les meir','Dei utviklar smalare ordforråd','Fagtekstane vert enklare'],fasit:1},
  {q:'Kva ord markerer den siste verknaden?',alt:['når','gjer','difor'],fasit:2}
 ],
 regel:'Årsak–verknad kan vere ei kjede: A → B → C. «Difor» signaliserer den endelege konsekvensen.',
 eks:'Lite lesing → smalt ordforråd → vanskeleg å forstå fagtekstar → fagvanskar'},

{kat:'aarsak_samanheng',kat_label:'Årsak og samanheng',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på det eine uttrykket som er feil brukt.',
 tekst:'Ho fekk gode karakterar trass i at ho jobba hardt kvar dag.',
 fasit_feil:['trass'],
 regel:'«Trass i» markerer noko uventa. At hardt arbeid gir gode resultat er forventa → bruk «fordi».',
 eks:'Rett: «Ho fekk gode karakterar fordi ho jobba hardt.» Kontrast: «… dårlege trass i at ho jobba hardt.»'},

/* ═══════════════════════════════════════════════════
   14. REFERANSEKJEDE  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'referansekjede',kat_label:'Referansekjede',type:'mc',vanske:'lett',
 q:'Kva ord kan erstatte «plast» i andre setning? «Plast i havet er farleg. ___ bryt ned til mikropartiklar.»',
 alt:['Plast','Materialet','Plasten','Ho'],fasit:'Materialet',
 regel:'Bruk synonym eller overomgrep for å unngå gjentaking. «Materialet» peikar tilbake på «plast».',
 eks:'plast → materialet / søppelet / forureininga'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'mc',vanske:'medium',
 q:'Kva er ein referansekjede?',
 alt:['Ei kjede av kjeldetilvisningar','Ein måte å variere ordval slik at teksten heng saman','Ei liste over alle substantiv i teksten','Same ordet gjenteke for å understreke poenget'],
 fasit:'Ein måte å variere ordval slik at teksten heng saman',
 regel:'Ein referansekjede er ulike ord/uttrykk som peikar til same referent gjennom ein tekst.',
 eks:'Greta Thunberg → klimaaktivisten → ho → den svenske tenåringen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'fillsel',vanske:'medium',
 q:'Vel det beste referanseuttrykket i kvar setning.',
 items:[
  {pre:'Ein isbjørn vart sett på Svalbard.',alt:['Isbjørnen','Dyret','Det'],fasit:'Dyret',post:'var tydeleg svelt.'},
  {pre:'Forskarar ved UiO har funne ein ny art.',alt:['Forskarane','Dei','Teamet'],fasit:'Teamet',post:'publiserte funnet i Nature.'},
  {pre:'Noreg produserer mykje olje.',alt:['Noreg','Landet','Dei'],fasit:'Landet',post:'investerer og i fornybar energi.'},
  {pre:'Eleven skreiv eit godt essay.',alt:['Eleven','Teksten hennar','Ho'],fasit:'Teksten hennar',post:'imponerte sensoren.'}
 ],
 regel:'Varier mellom pronomen (ho/dei), synonym (teamet) og overomgrep (dyret, landet) for samanheng.',
 eks:'isbjørn → dyret · forskarar → teamet · Noreg → landet'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykka: Er dei synonym, pronomen eller overomgrep for «Greta Thunberg»?',
 kolonner:['Pronomen','Synonym / omskriving','Overomgrep'],
 ord:[
  {tekst:'ho',fasit:0},
  {tekst:'klimaaktivisten',fasit:1},
  {tekst:'den svenske tenåringen',fasit:1},
  {tekst:'personen',fasit:2},
  {tekst:'henne',fasit:0},
  {tekst:'aktivisten',fasit:2}
 ],
 regel:'Pronomen (ho/henne) erstattar namn. Synonym omskriv (klimaaktivisten). Overomgrep generaliserer (personen).',
 eks:'ho = pronomen · klimaaktivisten = synonym · personen = overomgrep'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'klikk_marker',vanske:'medium',
 q:'Klikk på alle orda/uttrykka som refererer til «Greta Thunberg».',
 tekst:'Greta Thunberg heldt ein tale i FN. Den unge aktivisten var tydeleg sint. Ho sa at verdsleiarane svik ungdommen. Klimaforkjemparen fekk stor merksemd.',
 maalordklasse:'referanse til Greta',
 fasit_ord:['Den unge aktivisten','Ho','Klimaforkjemparen'],
 regel:'Finn alle uttrykk som peikar tilbake til same person (referent).',
 eks:'Greta → den unge aktivisten → ho → klimaforkjemparen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'fix',vanske:'medium',
 q:'Rett teksten slik at «plast» berre vert brukt éin gong. Erstatt gjentakingane.',
 tekst:'Plast er eit stort problem. Plast finst overalt i naturen. Plast bryt ned til små bitar. Plast skadar dyr og fuglar.',
 errors:{'Plast finst':'Det finst','Plast bryt':'Materialet bryt','Plast skadar':'Avfallet skadar'},
 fasit:'Det finst · Materialet bryt · Avfallet skadar',
 regel:'Erstatt gjenteke substantiv med pronomen, synonym eller overomgrep for betre flyt.',
 eks:'Plast → det / materialet / avfallet / forureininga'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandane om referansekjeder sanne eller usanne?',
 paastandar:[
  {tekst:'Pronomen som «ho» og «det» er ein del av referansekjeda.',sann:true},
  {tekst:'Ein bør alltid gjenta same ordet for å vere tydeleg.',sann:false},
  {tekst:'Overomgrep som «dyret» kan peike tilbake til «isbjørnen».',sann:true},
  {tekst:'Referansekjeder gjeld berre personar, ikkje ting.',sann:false},
  {tekst:'«Denne utfordringa» kan peike tilbake til eit heilt avsnitt.',sann:true}
 ],
 regel:'Referansekjeder brukar pronomen, synonym og overomgrep til å binde teksten saman utan gjentaking.',
 eks:'isbjørn → dyret · plastproblem → denne utfordringa'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv om avsnittet slik at «ungdom» berre vert brukt éin gong.',
 tekst:'Ungdom brukar mykje tid på sosiale medium. Ungdom vert påverka av det dei ser. Ungdom kan utvikle dårleg sjølvbilete. Ungdom treng rettleiing frå vaksne.',
 instruksjon:'Bruk pronomen, synonym og overomgrep i staden for gjentaking.',
 maa_ha:['dei','generasjonen'],
 maa_ikkje_ha:[],
 regel:'Varier med pronomen (dei), synonym (tenåringane) og overomgrep (generasjonen / dei unge).',
 eks:'Ungdom → dei → tenåringane → denne generasjonen → dei unge'},

/* ═══════════════════════════════════════════════════
   15. LOGISK STRUKTUR  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mc',vanske:'lett',
 q:'Kva rekkjefølgje er mest logisk i ein fagartikkel?',
 alt:['Avslutting → Hovuddel → Innleiing','Innleiing → Hovuddel → Avslutting','Hovuddel → Innleiing → Avslutting','Avslutting → Innleiing → Hovuddel'],
 fasit:'Innleiing → Hovuddel → Avslutting',
 regel:'Ein fagartikkel følgjer treleddsmodellen: innleiing – hovuddel – avslutting.',
 eks:'Innleiing: presenter tema → Hovuddel: utdjup → Avslutting: konkluder'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'sorter_rekke',vanske:'medium',
 q:'Set avsnitta i logisk rekkjefølgje for ein fagartikkel om plast i havet.',
 items:[
  {id:'B',tekst:'Kvart år hamnar millionar tonn plast i havet, og problemet veks raskt.'},
  {id:'D',tekst:'Plasten kjem frå fiskeri, skipstrafikk og forsøpling frå land.'},
  {id:'C',tekst:'Konsekvensane er alvorlege: dyr døyr, giftstoff spreier seg og strender vert øydelagde.'},
  {id:'A',tekst:'Det finst fleire løysingar: betre avfallssortering, internasjonale avtalar og forbrukarmakt.'}
 ],
 regel:'Logisk oppbygging: Problem → Årsaker → Konsekvensar → Løysingar.',
 eks:'Problem → Årsaker → Konsekvensar → Løysingar'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'drag_kolonne',vanske:'medium',
 q:'Sorter setningane etter kva del av teksten dei høyrer til.',
 kolonner:['Innleiing','Hovuddel','Avslutting'],
 ord:[
  {tekst:'I denne artikkelen skal eg sjå på …',fasit:0},
  {tekst:'For det første viser forsking at …',fasit:1},
  {tekst:'Alt i alt kan vi konkludere med at …',fasit:2},
  {tekst:'Kva veit vi eigentleg om …?',fasit:0},
  {tekst:'På den andre sida hevdar kritikarar at …',fasit:1},
  {tekst:'Oppsummert syner kjeldene at …',fasit:2}
 ],
 regel:'Innleiing: presenterer tema. Hovuddel: utdjupar med argument/døme. Avslutting: oppsummerer og konkluderer.',
 eks:'«I denne artikkelen …» = innleiing · «For det første …» = hovuddel · «Alt i alt …» = avslutting'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'finn_feil',vanske:'medium',
 q:'Klikk på avsnittet som bryt den logiske strukturen.',
 tekst:'KI er teknologi som let maskinar utføre oppgåver som tidlegare kravde menneskeleg intelligens. Eit anna døme er sjølvkøyrande bilar. Brettspel som Monopol er populære over heile verda. Likevel er KI omdiskutert.',
 fasit_feil:['Brettspel som Monopol er populære over heile verda.'],
 regel:'Kvart avsnitt må passe inn i den raude tråden. Eit avsnitt om brettspel bryt temaet om KI.',
 eks:'KI-tekst: KI-intro → døme → (brott: brettspel) → drøfting'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mc',vanske:'medium',
 q:'Kva er ein temasetning?',
 alt:['Overskrifta på teksten','Den første setninga i kvart avsnitt som fortel kva avsnittet handlar om','Den siste setninga i innleiinga','Ei setning som oppsummerer heile teksten'],
 fasit:'Den første setninga i kvart avsnitt som fortel kva avsnittet handlar om',
 regel:'Ein temasetning kjem først i avsnittet og signaliserer kva avsnittet dreier seg om.',
 eks:'«Plastforureining har alvorlege konsekvensar for dyrelivet.» → temasetning for konsekvens-avsnittet'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om logisk struktur sanne eller usanne?',
 paastandar:[
  {tekst:'Innleiinga bør presentere temaet og fange interessa til lesaren.',sann:true},
  {tekst:'Ein kan ta opp nye argument i avsluttinga.',sann:false},
  {tekst:'Avsnitt i hovuddelen bør kome i vilkårleg rekkjefølgje.',sann:false},
  {tekst:'Kvart avsnitt bør ha ein temasetning.',sann:true},
  {tekst:'Avsluttinga bør oppsummere og konkludere.',sann:true}
 ],
 regel:'God logikk: innleiing presenterer, hovuddelen utdjupar i naturleg rekkjefølgje, avsluttinga konkluderer.',
 eks:'Innleiing → tema. Hovuddel → argument i rekkjefølgje. Avslutting → konklusjon.'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mcset',vanske:'vanskeleg',
 q:'Les teksten og svar.',
 tekst:'Sosiale medium påverkar ungdom på fleire måtar. For det første vert sjølvbilete forma av redigerte bilete. For det andre kan netthets føre til psykiske plager. Likevel finst det positive sider: kreativitet og fellesskap.',
 questions:[
  {q:'Kva gjer den første setninga?',alt:['Gir eit døme','Presenterer hovudpåstanden','Konkluderer'],fasit:1},
  {q:'Kva type markørar brukar teksten?',alt:['Motsetjingsord','Nummereringsord','Samanlikningsord'],fasit:1},
  {q:'Kva funksjon har «Likevel»?',alt:['Viser årsak','Markerer nyansering/kontrast','Avsluttar teksten'],fasit:1}
 ],
 regel:'Tekstmarkørar som «for det første/andre» og «likevel» styrer logikken og gjer teksten oversiktleg.',
 eks:'for det første → for det andre → likevel (nyansering)'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'cloze',vanske:'vanskeleg',
 q:'Skriv inn rett tekstmarkør: «___ viser forsking at lesing aukar ordforrådet.»',
 hint:'Denne markøren signaliserer det første argumentet.',
 fasit:'For det første',fasit_v:['For det første','for det første'],
 regel:'Nummereringsmarkørar som «for det første», «for det andre», «til slutt» ordnar argument.',
 eks:'For det første … For det andre … Til slutt …'},

/* ═══════════════════════════════════════════════════
   16. SJANGERKOMPETANSE  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'lett',
 q:'Kva kjenneteiknar ein fagartikkel?',
 alt:['Subjektiv og kjensleladd språk','Sakleg framstilling med kjeldetilvisning','Dialogar og spenningskurve','Rim og rytme'],
 fasit:'Sakleg framstilling med kjeldetilvisning',
 regel:'Ein fagartikkel er sakprosa med sakleg språk, kjeldebruk og logisk oppbygging.',
 eks:'Fagartikkel: tema, innleiing, argument + kjelder, avslutting'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'lett',
 q:'Kva kjenneteiknar eit debattinnlegg?',
 alt:['Nøytral framstilling utan eiga meining','Klar meining, argument for og mot, og eit tydeleg standpunkt','Berre fakta utan vurdering','Korte dialogar mellom to personar'],
 fasit:'Klar meining, argument for og mot, og eit tydeleg standpunkt',
 regel:'Eit debattinnlegg argumenterer for eit standpunkt, brukar retoriske verkemiddel og avsluttar med ei oppmoding.',
 eks:'Påstand → argument for → motargument → tilbakevising → konklusjon/oppmoding'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'drag_kolonne',vanske:'medium',
 q:'Sorter trekka: Høyrer dei til fagartikkel, debattinnlegg eller novelle?',
 kolonner:['Fagartikkel','Debattinnlegg','Novelle'],
 ord:[
  {tekst:'Sakleg og nøytralt språk',fasit:0},
  {tekst:'Tydeleg standpunkt og oppmoding',fasit:1},
  {tekst:'Dialogar og spenningskurve',fasit:2},
  {tekst:'Kjeldetilvisingar i teksten',fasit:0},
  {tekst:'Retoriske spørsmål og gjentaking',fasit:1},
  {tekst:'Skildringar av personar og miljø',fasit:2}
 ],
 regel:'Fagartikkel = sakleg + kjelder. Debattinnlegg = standpunkt + retorikk. Novelle = fiksjon + spenning.',
 eks:'Fagartikkel: «Forsking viser …» · Debatt: «Vi krev at …» · Novelle: «Ho snudde seg sakte …»'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'fillsel',vanske:'medium',
 q:'Vel rett sjanger for kvar tekstbit.',
 items:[
  {pre:'«Forsking frå UiO syner at ungdom les 30 % mindre enn for ti år sidan.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Fagartikkel',post:''},
  {pre:'«Skulebiblioteka må styrkjast – no!»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Debattinnlegg',post:''},
  {pre:'«Det regna då ho opna døra. Innanfor var det stille.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Novelle',post:''},
  {pre:'«Vi oppmodar kommunestyret til å auke budsjettet for skulebibliotek.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Debattinnlegg',post:''}
 ],
 regel:'Sjangerval styrer språk og form. Fagartikkel = sakleg. Debatt = argumenterande. Novelle = skjønnlitterær.',
 eks:'Forsking → fagartikkel · oppmodar → debatt · «Det regna …» → novelle'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om sjangrar sanne eller usanne?',
 paastandar:[
  {tekst:'Ein fagartikkel kan bruke «eg meiner» som hovudargument.',sann:false},
  {tekst:'Eit debattinnlegg bør ha eit tydeleg standpunkt.',sann:true},
  {tekst:'Ein novelle har som regel ein spenningskurve.',sann:true},
  {tekst:'I ein fagartikkel er det viktig å vise til kjelder.',sann:true},
  {tekst:'Eit debattinnlegg treng ikkje ta omsyn til motargument.',sann:false}
 ],
 regel:'Kvar sjanger har eigne konvensjonar for språk, struktur og innhald.',
 eks:'Fagartikkel: kjelder viktig. Debatt: standpunkt + motargument. Novelle: spenningskurve.'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'vanskeleg',
 q:'Kva skil eit debattinnlegg frå eit lesarbrev?',
 alt:['Dei er identiske sjangrar','Debattinnlegget er lengre og meir argumenterande, lesarbrevet er personleg og kort','Lesarbrevet krev kjeldetilvisingar, debattinnlegget ikkje','Debattinnlegget er fiksjon, lesarbrevet er sakprosa'],
 fasit:'Debattinnlegget er lengre og meir argumenterande, lesarbrevet er personleg og kort',
 regel:'Debattinnlegg = grundig argumentasjon med fleire argument. Lesarbrev = kortare, meir personleg reaksjon.',
 eks:'Debattinnlegg: 500–1000 ord, fleire argument. Lesarbrev: 200–400 ord, personleg vinkling.'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'cloze',vanske:'lett',
 q:'Skriv inn sjangeren: Ein tekst med spenningskurve, dialogar og skildring av personar er ein ___.',
 hint:'Tenk skjønnlitterær kortprosa.',
 fasit:'novelle',fasit_v:['novelle','Novelle','novelletekst'],
 regel:'Ein novelle er ei kort forteljing med få personar, avgrensa handling og ofte eit vendepunkt.',
 eks:'Novelle = kort forteljing, vendepunkt, få personar'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'klikk_marker',vanske:'vanskeleg',
 q:'Klikk på dei tre setningane som høyrer til debattinnlegg-sjangeren.',
 tekst:'Vi meiner at skulen må innføre eit fag om digital tryggleik. Forsking viser at 60 % av ungdom har opplevd nettmobbing. Sola skein inn gjennom vindauget og varma ansiktet hennar. Politikarane må handle no – det hastar! Kveldsvinden la seg over fjorden.',
 maalordklasse:'debattinnlegg-setning',
 fasit_ord:['Vi meiner at skulen må innføre eit fag om digital tryggleik.','Forsking viser at 60 % av ungdom har opplevd nettmobbing.','Politikarane må handle no – det hastar!'],
 regel:'Debattinnlegg brukar argumenterande setningar med standpunkt, fakta og oppmoding.',
 eks:'«Vi meiner …» → standpunkt · «Forsking viser …» → faktaargument · «… må handle no!» → oppmoding'},

/* ═══════════════════════════════════════════════════
   17. FAGARTIKKEL  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mc',vanske:'lett',
 q:'Kva bør innleiinga i ein fagartikkel gjere?',
 alt:['Gje konklusjonen med éin gong','Presentere tema og fange interessa til lesaren','Innehalde alle kjeldetilvisingane','Vere ein personleg anekdote'],
 fasit:'Presentere tema og fange interessa til lesaren',
 regel:'Innleiinga skal presentere temaet, gjerne med ein fengande inngang, og fortelje kva teksten handlar om.',
 eks:'«Kvart år hamnar millionar tonn plast i havet. Kva gjer dette med livet under vatn?»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mc',vanske:'medium',
 q:'Kva av desse er eit sakleg argument med kjeldetilvising?',
 alt:['Eg synest plast er ekkelt.','Forsking frå NIVA (2023) syner at mikroplast finst i 80 % av norske innsjøar.','Alle veit at plast er farleg.','Plast burde vere forbode fordi det er stygt.'],
 fasit:'Forsking frå NIVA (2023) syner at mikroplast finst i 80 % av norske innsjøar.',
 regel:'Eit sakleg argument brukar fakta frå ei namngitt kjelde, ikkje personlege meiningar eller generaliseringar.',
 eks:'NIVA (2023) → namngitt kjelde med årstal. Unngå: «alle veit», «eg synest».'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'drag_kolonne',vanske:'medium',
 q:'Sorter setningane etter om dei høyrer i innleiing, hovuddel eller avslutting.',
 kolonner:['Innleiing','Hovuddel','Avslutting'],
 ord:[
  {tekst:'Denne artikkelen tek for seg korleis ungdom brukar sosiale medium.',fasit:0},
  {tekst:'Ei undersøking frå Medietilsynet (2024) viser at 95 % av 13-åringar har eigen mobil.',fasit:1},
  {tekst:'Oppsummert ser vi at dei positive og negative sidene må vegast mot kvarandre.',fasit:2},
  {tekst:'Kvifor les ungdom mindre enn før?',fasit:0},
  {tekst:'Kritikarane peikar på at skjermtid går ut over fysisk aktivitet (Helsedirektoratet, 2023).',fasit:1},
  {tekst:'Vidare forsking er nødvendig for å forstå langtidsverknadene.',fasit:2}
 ],
 regel:'Innleiing: presenterer tema. Hovuddel: fakta + kjelder. Avslutting: oppsummering + framover.',
 eks:'«Denne artikkelen …» = innleiing · «Ei undersøking …» = hovuddel · «Oppsummert …» = avslutting'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'fix',vanske:'medium',
 q:'Rett dei tre usaklege formuleringane til meir fagleg språk.',
 tekst:'Alle veit at plast er ekstremt farleg. Eg synest at vi er altfor late. Det er jo heilt dust å kaste plast i naturen.',
 errors:{'Alle veit at plast er ekstremt farleg':'Forsking tyder på at plast er skadeleg for miljøet','Eg synest at vi er altfor late':'Fleire forskarar peikar på at tiltaka kjem for seint','Det er jo heilt dust å kaste plast i naturen':'Forsøpling utgjer eit alvorleg miljøproblem'},
 fasit:'Forsking tyder på … · Fleire forskarar peikar på … · Forsøpling utgjer …',
 regel:'Fagleg språk brukar objektive formuleringar, ikkje slang, kjensleord eller «alle veit».',
 eks:'«Eg synest» → «Forsking viser» · «dust» → «problematisk» · «alle veit» → «studiar tyder på»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'fillsel',vanske:'lett',
 q:'Vel rett formulering for ein fagartikkel.',
 items:[
  {pre:'',alt:['Eg bryr meg ikkje om plast.','Forsking viser at plast er eit aukande problem.','Plast er mega irriterande.'],fasit:'Forsking viser at plast er eit aukande problem.',post:''},
  {pre:'',alt:['Ifølgje SSB (2023) har forbruket auka med 12 %.','Alle handlar altfor mykje.','Det er jo sjukt kor mykje folk kjøper.'],fasit:'Ifølgje SSB (2023) har forbruket auka med 12 %.',post:''},
  {pre:'',alt:['Seriøst, vi må gjere noko.','Det hastar å finne berekraftige løysingar.','Whatever, ingen gjer noko uansett.'],fasit:'Det hastar å finne berekraftige løysingar.',post:''}
 ],
 regel:'Fagartikkelspråk er sakleg, konkret og bygd på kjeldefesta informasjon.',
 eks:'«Forsking viser …» / «Ifølgje SSB …» / «Det hastar å finne …»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om fagartikkelsjangeren sanne eller usanne?',
 paastandar:[
  {tekst:'Ein fagartikkel er subjektiv.',sann:false},
  {tekst:'Kjeldetilvisingar styrkjer truverdet til teksten.',sann:true},
  {tekst:'Ein fagartikkel kan starte med eit retorisk spørsmål.',sann:true},
  {tekst:'Det er greitt å bruke «eg synest» som hovudargument.',sann:false},
  {tekst:'Avsluttinga bør oppsummere og eventuelt peike framover.',sann:true}
 ],
 regel:'Fagartikkelen er sakleg, kjeldefesta og logisk bygd opp. Retorisk spørsmål kan fengje lesaren i innleiinga.',
 eks:'Sakleg, ikkje subjektiv. Kjelder styrkjer. Retorisk spørsmål fungerer i innleiing.'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'cloze',vanske:'lett',
 q:'Skriv inn rett ord: «___ Helsedirektoratet (2023) har fysisk aktivitet minka blant ungdom.»',
 hint:'Eit ord som viser til ei namngitt kjelde.',
 fasit:'Ifølgje',fasit_v:['Ifølgje','ifølgje','Ifølge','ifølge','I følgje','I følge'],
 regel:'«Ifølgje» + kjelde innleier eit kjeldefesta argument i fagprosa.',
 eks:'Ifølgje SSB … / Ifølgje Helsedirektoratet … / Ifølgje forskarane …'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mcset',vanske:'vanskeleg',
 q:'Les fagartikkelutkastet og svar.',
 tekst:'Ungdom brukar i snitt 3 timar dagleg på sosiale medium (Medietilsynet, 2024). Det kan føre til søvnmangel, ifølgje FHI. Likevel finst det positive sider: kreativitet og fellesskap. Spørsmålet er om dei positive sidene veg opp for dei negative.',
 questions:[
  {q:'Kva kjelde vert brukt for skjermtid?',alt:['FHI','Medietilsynet','SSB'],fasit:1},
  {q:'Kva funksjon har «Likevel»?',alt:['Viser årsak','Nyanserer – peikar på motargument','Avsluttar teksten'],fasit:1},
  {q:'Er siste setninga ein påstand eller eit spørsmål?',alt:['Påstand','Retorisk spørsmål','Fakta'],fasit:1}
 ],
 regel:'God fagartikkel: kjelder, nyansering med «likevel» og avslutning som opnar for refleksjon.',
 eks:'Kjelde: Medietilsynet 2024. «Likevel» = nyansering. Retorisk spørsmål i avslutning.'},

/* ═══════════════════════════════════════════════════
   18. DEBATTINNLEGG  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'mc',vanske:'lett',
 q:'Korleis bør eit debattinnlegg starte?',
 alt:['Med ei lang kjeldeliste','Med eit tydeleg standpunkt eller ein provokasjon','Med ei personleg dagbok-skildring','Med ein tabell over statistikk'],
 fasit:'Med eit tydeleg standpunkt eller ein provokasjon',
 regel:'Innleiinga i eit debattinnlegg skal fange merksemda og presentere standpunktet tydeleg.',
 eks:'«Skulen bør forby mobiltelefonar i undervisninga – no!» → klart standpunkt'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'mc',vanske:'medium',
 q:'Kvifor bør ein ta opp motargument i eit debattinnlegg?',
 alt:['For å svekkje si eiga sak','For å vise at ein kjenner fleire sider og kan tilbakevise motargumenta','Fordi det er påkravd i læreplanen','For å gjere teksten lengre'],
 fasit:'For å vise at ein kjenner fleire sider og kan tilbakevise motargumenta',
 regel:'Å møte motargument og tilbakevise dei styrkjer truverdet (ethos) til skribenten.',
 eks:'«Nokon vil hevde at … men forsking viser at …» → tilbakevising'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'drag_kolonne',vanske:'medium',
 q:'Sorter verkemidla: Høyrer dei til etos, patos eller logos?',
 kolonner:['Etos (truverd)','Patos (kjensler)','Logos (logikk/fakta)'],
 ord:[
  {tekst:'Vise til ekspertise eller erfaring',fasit:0},
  {tekst:'Bruke eit sterkt bilete eller personleg historie',fasit:1},
  {tekst:'Vise til statistikk og forsking',fasit:2},
  {tekst:'Bruke eit sakleg og balansert språk',fasit:0},
  {tekst:'Stille eit retorisk spørsmål som vekkjer følelser',fasit:1},
  {tekst:'Presentere eit logisk resonnement med premiss og konklusjon',fasit:2}
 ],
 regel:'Etos = truverd. Patos = kjensler. Logos = logikk og fakta. God retorikk brukar alle tre.',
 eks:'Etos: «Som lege …» · Patos: «Tenk på borna» · Logos: «Statistikk viser at …»'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'fillsel',vanske:'medium',
 q:'Vel det retoriske verkemiddelet som passar best.',
 items:[
  {pre:'«Korleis kan vi akseptere at born går svoltne på skulen?»',alt:['Retorisk spørsmål','Gjentaking','Overdrivelse'],fasit:'Retorisk spørsmål',post:''},
  {pre:'«Vi krev handling. Vi krev rettferd. Vi krev endring.»',alt:['Retorisk spørsmål','Gjentaking (anafor)','Statistikk'],fasit:'Gjentaking (anafor)',post:''},
  {pre:'«Ifølgje FHI har angstdiagnosar blant unge auka med 40 % sidan 2015.»',alt:['Patos','Anekdote','Logos (faktaargument)'],fasit:'Logos (faktaargument)',post:''},
  {pre:'«Eg har sjølv jobba som barnevernspedagog i ti år.»',alt:['Logos','Etos (truverd)','Patos'],fasit:'Etos (truverd)',post:''}
 ],
 regel:'Retorisk spørsmål = engasjerer. Anafor = gjentaking for effekt. Logos = fakta. Etos = truverd.',
 eks:'Retorisk sp. / Anafor / Logos / Etos'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'sorter_rekke',vanske:'medium',
 q:'Set avsnitta i logisk rekkjefølgje for eit debattinnlegg.',
 items:[
  {id:'B',tekst:'Skulen bør innføre mobilforbod. Forsking viser at mobilen distrahere elevane.'},
  {id:'C',tekst:'Forskinga er tydeleg: mobilen øydelegg konsentrasjonen. Ein studie frå Universitetet i Bergen viser at elevar utan mobil presterte 15 % betre.'},
  {id:'A',tekst:'Nokon vil hevde at mobilforbod krenker elevane sin fridom, men skulens oppgåve er å lære, ikkje å underholde.'},
  {id:'D',tekst:'Vi oppmodar politikarane til å innføre eit nasjonalt mobilforbod i skulen – for elevane si skuld.'}
 ],
 regel:'Debattinnlegg: Standpunkt → Argument → Motargument + tilbakevising → Avsluttande oppmoding.',
 eks:'Standpunkt → Hovudargument → Møte motargument → Oppmoding'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'fix',vanske:'vanskeleg',
 q:'Gjer dei usaklege formuleringane meir overtydande med retoriske verkemiddel.',
 tekst:'Alle som er mot mobilforbod er dumme. Det er jo berre tull å ha mobil på skulen. Lærarane bryr seg ikkje om elevane.',
 errors:{'Alle som er mot mobilforbod er dumme':'Kan vi verkeleg forsvare at mobilen tar merksemda frå elevane?','Det er jo berre tull å ha mobil på skulen':'Forsking frå UiB (2023) viser at mobilfritt klasserom aukar læringsutbytet.','Lærarane bryr seg ikkje om elevane':'Lærarane fortenar verktøy som gjer det lettare å undervise.'},
 fasit:'Retorisk spørsmål · Fakta frå forsking · Positiv vinkling',
 regel:'Bytt ut personangrep med retoriske spørsmål, forskingsbaserte argument og konstruktive formuleringar.',
 eks:'«dumme» → retorisk spørsmål · «tull» → forsking viser · «bryr seg ikkje» → positiv formulering'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om debattinnlegg sanne eller usanne?',
 paastandar:[
  {tekst:'Eit debattinnlegg skal ha eit tydeleg standpunkt.',sann:true},
  {tekst:'Det er unødvendig å ta opp motargument.',sann:false},
  {tekst:'Ei oppmoding i avsluttinga er vanleg.',sann:true},
  {tekst:'Personangrep styrkjer argumentasjonen.',sann:false},
  {tekst:'Retoriske spørsmål kan fange merksemda til lesaren.',sann:true}
 ],
 regel:'Godt debattinnlegg: tydeleg standpunkt, argument + motargument, inga personangrep, avsluttande oppmoding.',
 eks:'Standpunkt → argument → motargument → oppmoding'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'cloze',vanske:'lett',
 q:'Skriv inn rett ord: «Vi ___ kommunepolitikarane til å auke budsjettet for skulebibliotek.»',
 hint:'Eit verb som tyder å be nokon om å handle.',
 fasit:'oppmodar',fasit_v:['oppmodar','oppfordrar','ber','henstiller til'],
 regel:'«Oppmodar» er eit vanleg verb i oppmoding/avslutning av debattinnlegg.',
 eks:'Vi oppmodar / Vi ber / Vi krev – typiske avslutningsverb i debatt'},

/* ═══════════════════════════════════════════════════
   19. OVERSKRIFT OG INGRESS  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'mc',vanske:'lett',
 q:'Kva er hovudoppgåva til ei overskrift?',
 alt:['Oppsummere heile teksten','Fange interessa og fortelje kva teksten handlar om','Vise kven som skreiv teksten','Innehalde alle nøkkelorda'],
 fasit:'Fange interessa og fortelje kva teksten handlar om',
 regel:'Ei god overskrift er kort, presis og vekker nysgjerrigheit.',
 eks:'«Ungdom les mindre – kvifor?» → kort, tema + spørsmål'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'mc',vanske:'medium',
 q:'Kva bør ein ingress innehalde?',
 alt:['Ei kort oppsummering av heile teksten med hovudfunna','Alle kjeldetilvisingane','Dialogar frå teksten','Forfattaren sin biografi'],
 fasit:'Ei kort oppsummering av heile teksten med hovudfunna',
 regel:'Ingressen gir lesaren det viktigaste med éin gong: kven, kva, kvifor.',
 eks:'«Ny forsking syner at skjermtid påverkar søvnkvaliteten til ungdom. Her er det du treng å vite.»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Er det ei god eller dårleg overskrift for ein fagartikkel?',
 kolonner:['God overskrift','Dårleg overskrift'],
 ord:[
  {tekst:'Plast i havet – eit aukande trugsmål',fasit:0},
  {tekst:'Ting om plast og sånn',fasit:1},
  {tekst:'Ungdom og søvn: Korleis skjermen stel nattero',fasit:0},
  {tekst:'Min artikkel om eit tema',fasit:1},
  {tekst:'KI på skulen: Moglegheit eller trugsmål?',fasit:0},
  {tekst:'Artikkel 1',fasit:1}
 ],
 regel:'Gode overskrifter er presise, informative og fengande. Dårlege er vage, uformelle eller intetsiande.',
 eks:'God: «Plast i havet – eit aukande trugsmål» · Dårleg: «Ting om plast og sånn»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'fillsel',vanske:'medium',
 q:'Vel den beste overskrifta for kvar tekst.',
 items:[
  {pre:'Fagartikkel om klimaendringar:',alt:['Klima','Isbreane smeltar – raskare enn nokon gong','Artikkel om klima og sånn'],fasit:'Isbreane smeltar – raskare enn nokon gong',post:''},
  {pre:'Debattinnlegg om leksefri skule:',alt:['Om lekser','Leksene må bort – la ungdommane få fri','Eit lesarbrev'],fasit:'Leksene må bort – la ungdommane få fri',post:''},
  {pre:'Fagartikkel om søvn og ungdom:',alt:['Kvifor søv ungdom for lite?','Søvn','Ein tekst eg har skrive'],fasit:'Kvifor søv ungdom for lite?',post:''}
 ],
 regel:'Ei god overskrift er konkret, vekker interesse og passar til sjangeren.',
 eks:'Klima → «Isbreane smeltar …» · Lekser → «Leksene må bort …» · Søvn → «Kvifor søv ungdom …?»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'fix',vanske:'medium',
 q:'Rett den dårlege overskrifta og ingressen til ein fagartikkel om plast.',
 tekst:'Min artikkel. Denne teksten handlar om plast. Plast er over alt og det er ganske ekkelt eigenleg.',
 errors:{'Min artikkel':'Plast i havet – ein trussel mot livet under vatn','Denne teksten handlar om plast. Plast er over alt og det er ganske ekkelt eigenleg.':'Kvart år hamnar millionar tonn plast i havet. Ny forsking viser korleis det truar heile næringskjeda.'},
 fasit:'Plast i havet – ein trussel … · Kvart år hamnar millionar tonn …',
 regel:'Overskrift: presis og fengande. Ingress: saklege hovudfunn, ikkje slang eller vage formuleringar.',
 eks:'«Min artikkel» → «Plast i havet – …» · «ganske ekkelt» → sakleg formulering'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om overskrift og ingress sanne eller usanne?',
 paastandar:[
  {tekst:'Ei god overskrift kan innehalde eit spørsmål.',sann:true},
  {tekst:'Ingressen bør vere lengre enn resten av teksten.',sann:false},
  {tekst:'Overskrifta bør vekke nysgjerrigheit.',sann:true},
  {tekst:'Ingressen gir lesaren hovudfunna med éin gong.',sann:true},
  {tekst:'Overskrifta treng ikkje passe til innhaldet.',sann:false}
 ],
 regel:'Overskrift: kort, presis, fengande. Ingress: oppsummerer det viktigaste. Begge gir lesaren lyst til å lese vidare.',
 eks:'Overskrift med spørsmål: «Kvifor søv ungdom for lite?» Ingress: «Ny forsking viser at …»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv ei betre overskrift og ein betre ingress for denne fagartikkelen.',
 tekst:'Tekst om ungdom. Ungdom brukar mykje telefon. Det er kanskje ikkje bra.',
 instruksjon:'Gjer overskrifta fengande og ingressen sakleg med minst éin faktareferanse.',
 maa_ha:['ungdom'],
 maa_ikkje_ha:['kanskje','tekst om'],
 regel:'Overskrift: konkret og fengande. Ingress: kort, sakleg, informativ.',
 eks:'«Skjermtid og ungdom: Kva seier forskinga?» + «Ny undersøking viser at …»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'cloze',vanske:'medium',
 q:'Fullfør ingressen: «Ny forsking frå FHI viser at ungdom søv i snitt éin time ___ enn for ti år sidan.»',
 hint:'Eit ord som viser retning (meir/mindre).',
 fasit:'mindre',fasit_v:['mindre','kortare'],
 regel:'Ein god ingress er konkret og brukar presise fakta til å fange lesaren.',
 eks:'«… éin time mindre/kortare enn …» – konkret og informativt'},

/* ═══════════════════════════════════════════════════
   20. NOVELLE  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'novelle',kat_label:'Novelle',type:'mc',vanske:'lett',
 q:'Kva kjenneteiknar ein novelle?',
 alt:['Lang forteljing med mange personar og handlingstrådar','Kort forteljing med få personar, avgrensa handling og ofte eit vendepunkt','Sakleg tekst med kjeldetilvisingar','Dikt med rim og rytme'],
 fasit:'Kort forteljing med få personar, avgrensa handling og ofte eit vendepunkt',
 regel:'Ein novelle er ei kort forteljing med avgrensa tid/stad, få personar og gjerne eit vendepunkt.',
 eks:'Novelle: kort, vendepunkt, få personar, konsentrert handling'},

{kat:'novelle',kat_label:'Novelle',type:'mc',vanske:'medium',
 q:'Kva er eit vendepunkt i ein novelle?',
 alt:['Innleiinga der personane vert presenterte','Det punktet der handlinga endrar retning','Avsluttinga der alt vert forklara','Eit dialogavsnitt'],
 fasit:'Det punktet der handlinga endrar retning',
 regel:'Vendepunktet er det avgjerande augeblinken der situasjonen, forståinga eller retninga i handlinga endrar seg.',
 eks:'«Plutseleg forstod han at brevet ikkje var frå far.» → vendepunkt'},

{kat:'novelle',kat_label:'Novelle',type:'drag_kolonne',vanske:'medium',
 q:'Sorter verkemidla: Høyrer dei til novelle, fagartikkel eller debattinnlegg?',
 kolonner:['Novelle','Fagartikkel','Debattinnlegg'],
 ord:[
  {tekst:'Skildring av miljø og stemning',fasit:0},
  {tekst:'Kjeldetilvisingar (APA)',fasit:1},
  {tekst:'Retoriske spørsmål og oppmoding',fasit:2},
  {tekst:'Dialog mellom personar',fasit:0},
  {tekst:'Nøytralt og sakleg språk',fasit:1},
  {tekst:'Personleg standpunkt',fasit:2}
 ],
 regel:'Novelle: skildring + dialog. Fagartikkel: kjelder + sakleg språk. Debatt: standpunkt + retorikk.',
 eks:'Novelle: «Regnet slo mot ruta …» · Fagartikkel: «Ifølgje …» · Debatt: «Vi krev at …»'},

{kat:'novelle',kat_label:'Novelle',type:'fillsel',vanske:'medium',
 q:'Vel det beste verkemiddelet for kvar novellesituasjon.',
 items:[
  {pre:'For å skildre stemning:',alt:['Statistikk frå SSB','Sanseskildring med lyd, lukt og syn','Eit logisk argument'],fasit:'Sanseskildring med lyd, lukt og syn',post:''},
  {pre:'For å vise kva ein person tenkjer:',alt:['Indre monolog','Kjeldetilvising','Overskrift og ingress'],fasit:'Indre monolog',post:''},
  {pre:'For å auke spenninga:',alt:['Presens-form og korte setningar','Langt avsnitt med forklaring','Fotnotar'],fasit:'Presens-form og korte setningar',post:''},
  {pre:'For å vise personlegdom:',alt:['Talemål i dialogen','Formell kildehenvisning','Statistikk'],fasit:'Talemål i dialogen',post:''}
 ],
 regel:'Novelleverkemiddel: sanseskildring (stemning), indre monolog (tankar), korte setningar (spenning), talemål (karakter).',
 eks:'Stemning: vind og regn · Tankar: «Ho tenkte at …» · Spenning: korte setningar · Karakter: dialekt'},

{kat:'novelle',kat_label:'Novelle',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om novella sanne eller usanne?',
 paastandar:[
  {tekst:'Ein novelle har ofte eit vendepunkt.',sann:true},
  {tekst:'Ein novelle skal alltid ha happy ending.',sann:false},
  {tekst:'Noveller har som regel få personar.',sann:true},
  {tekst:'Sanseskildring er eit vanleg verkemiddel i noveller.',sann:true},
  {tekst:'Ein novelle brukar kjeldetilvisingar som i fagartiklar.',sann:false}
 ],
 regel:'Novelle: kort, få personar, vendepunkt, sanseskildring. Ikkje kjelder eller fagspråk.',
 eks:'Vendepunkt, sanseskildring, dialog – typiske novelletrekk'},

{kat:'novelle',kat_label:'Novelle',type:'klikk_marker',vanske:'medium',
 q:'Klikk på dei to setningane som brukar sanseskildring.',
 tekst:'Døra slo att med eit brak. Ho gjekk bort til vindauget. Lukta av nysteikte bollar sveipa inn frå kjøkenet. Klokka var halv fire. Den kalde haustvinden reiv i håret hennar.',
 maalordklasse:'sanseskildring',
 fasit_ord:['Lukta av nysteikte bollar sveipa inn frå kjøkenet.','Den kalde haustvinden reiv i håret hennar.'],
 regel:'Sanseskildring formidlar inntrykk via syn, høyrsel, lukt, smak eller kjensle.',
 eks:'Lukt: «Lukta av bollar …» · Kjensle: «Den kalde vinden …»'},

{kat:'novelle',kat_label:'Novelle',type:'cloze',vanske:'lett',
 q:'Skriv inn rett omgrep: Det avgjerande augeblinken der handlinga endrar retning heiter eit ___.',
 hint:'Tenk på det dramatiske høgdepunktet.',
 fasit:'vendepunkt',fasit_v:['vendepunkt','Vendepunkt','vende-punkt'],
 regel:'Vendepunktet er det avgjerande øyeblikket i ein novelle der alt endrar seg.',
 eks:'«Plutseleg forstod ho sanninga.» → vendepunktet'},

{kat:'novelle',kat_label:'Novelle',type:'mcset',vanske:'vanskeleg',
 q:'Les utdraget og svar.',
 tekst:'Ho sto ved vindauget og såg ut. Regnet trommla mot ruta. «Kjem du?» ropte mora frå gangen. Ho svara ikkje. Brevet låg framleis på bordet, uopna.',
 questions:[
  {q:'Kva verkemiddel opnar utdraget med?',alt:['Dialog','Sanseskildring','Fakta'],fasit:1},
  {q:'Kva skaper spenning i slutten?',alt:['At mora ropar','At brevet er uopna','At det regnar'],fasit:1},
  {q:'Kva synsvinkel har teksten?',alt:['Førsteperson (eg)','Tredjeperson (ho)','Andreperson (du)'],fasit:1}
 ],
 regel:'Sanseskildring (regnet) skaper stemning. Uopna brevet skaper spenning (frampek). Tredjeperson = «ho».',
 eks:'Sanseskildring → stemning. Uopna brev → frampek/spenning. «Ho» → tredjeperson.'},

/* ═══════════════════════════════════════════════════
   21. PARAFRASE  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'parafrase',kat_label:'Parafrase',type:'mc',vanske:'lett',
 q:'Kva er ein parafrase?',
 alt:['Å kopiere ein tekst ord for ord','Å gjengi innhaldet i ein tekst med eigne ord','Å skrive eit direkte sitat','Å lage ei fotnotliste'],
 fasit:'Å gjengi innhaldet i ein tekst med eigne ord',
 regel:'Ein parafrase er ei omskriving av innhaldet med eigne ord, men same meining. Kjelda må oppgivast.',
 eks:'Original: «60 % les bøker dagleg.» Parafrase: «Over halvparten les kvar dag (SSB, 2023).»'},

{kat:'parafrase',kat_label:'Parafrase',type:'mc',vanske:'medium',
 q:'Kva er skilnaden mellom eit sitat og ein parafrase?',
 alt:['Sitat brukar eigne ord, parafrase brukar kjelden sine ord','Sitat gjengir ordrett, parafrase gjengir med eigne ord','Parafrase treng ikkje kjeldetilvising','Dei er identiske teknikkar'],
 fasit:'Sitat gjengir ordrett, parafrase gjengir med eigne ord',
 regel:'Sitat = ordrett gjengiving med hermeteikn. Parafrase = omskriving med eigne ord. Begge krev kjelde.',
 eks:'Sitat: «60 % les dagleg» (SSB, 2023). Parafrase: Over halvparten les kvar dag (SSB, 2023).'},

{kat:'parafrase',kat_label:'Parafrase',type:'fillsel',vanske:'medium',
 q:'Vel den beste parafraseringen av kvar kjelde.',
 items:[
  {pre:'Original: «Ungdom brukar i snitt 3 timar dagleg på sosiale medium» (Medietilsynet, 2024).',alt:['Ungdom brukar i snitt 3 timar dagleg på sosiale medium.','Unge menneske tilbringer gjennomsnittleg tre timar om dagen på sosiale plattformer.','Sosiale medium er populære.'],fasit:'Unge menneske tilbringer gjennomsnittleg tre timar om dagen på sosiale plattformer.',post:''},
  {pre:'Original: «Fysisk aktivitet blant barn har minka med 20 %» (FHI, 2023).',alt:['Born rører seg mindre enn før – nedgangen er på ein femtedel.','Fysisk aktivitet blant barn har minska med 20 %.','Born er late.'],fasit:'Born rører seg mindre enn før – nedgangen er på ein femtedel.',post:''},
  {pre:'Original: «Leseferdigheitene varierer stort mellom skular» (PISA, 2022).',alt:['Det er stor forskjell i leseferdigheit frå skule til skule.','Leseferdigheitene varierer stort mellom skular.','Nokre les bra, andre ikkje.'],fasit:'Det er stor forskjell i leseferdigheit frå skule til skule.',post:''}
 ],
 regel:'God parafrase: same innhald, nye ord og setningsstruktur. Ikkje kopier ordrett, men ver presis.',
 eks:'«3 timar dagleg» → «tre timar om dagen» · «minka med 20 %» → «nedgang på ein femtedel»'},

{kat:'parafrase',kat_label:'Parafrase',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er det ein god parafrase, eit direkte sitat, eller plagiat?',
 kolonner:['God parafrase','Direkte sitat','Plagiat (ulovleg kopi)'],
 ord:[
  {tekst:'Born rører seg mindre (FHI, 2023).',fasit:0},
  {tekst:'«Fysisk aktivitet blant barn har minska med 20 %» (FHI, 2023).',fasit:1},
  {tekst:'Fysisk aktivitet blant barn har minska med 20 %. (ingen kjelde)',fasit:2},
  {tekst:'Ifølgje FHI (2023) er det ein tydeleg nedgang i kor mykje born rører seg.',fasit:0},
  {tekst:'Forsking viser at barn beveger seg mye mindre nå. (ingen kjelde)',fasit:2},
  {tekst:'«Barn beveger seg mye mindre nå» (FHI, 2023).',fasit:1}
 ],
 regel:'God parafrase: eigne ord + kjelde. Direkte sitat: ordrett + hermeteikn + kjelde. Plagiat: andres ord utan kjelde.',
 eks:'Parafrase: eigne ord (FHI, 2023). Sitat: «…» (FHI, 2023). Plagiat: ordrett utan kjelde.'},

{kat:'parafrase',kat_label:'Parafrase',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om parafrase sanne eller usanne?',
 paastandar:[
  {tekst:'Ein parafrase treng ikkje kjeldetilvising.',sann:false},
  {tekst:'Ein god parafrase endrar ordval og setningsstruktur.',sann:true},
  {tekst:'Det held å byte ut eitt ord for å parafrasere.',sann:false},
  {tekst:'Parafrase og sitat er to ulike teknikkar.',sann:true},
  {tekst:'Ein parafrase skal formidle same innhald som originalen.',sann:true}
 ],
 regel:'Parafrase = nye ord, same meining. Krev kjelde. Ikkje berre synonymbytte – endre setningsstruktur.',
 eks:'Byt ordval + setningsstruktur. Oppgi alltid kjelda.'},

{kat:'parafrase',kat_label:'Parafrase',type:'fix',vanske:'vanskeleg',
 q:'Rett parafrasefeilen: Teksten er for lik originalen. Skriv om med eigne ord.',
 tekst:'Ungdom bruker i gjennomsnitt tre timer daglig på sosiale medier (Medietilsynet, 2024).',
 errors:{'Ungdom bruker i gjennomsnitt tre timer daglig på sosiale medier':'Unge menneske tilbringer om lag tre timar kvar dag på ulike sosiale plattformer'},
 fasit:'Unge menneske tilbringer om lag tre timar kvar dag på ulike sosiale plattformer',
 regel:'Ein god parafrase endrar både ordval og setningsstruktur, ikkje berre eitt og anna ord.',
 eks:'«bruker i gjennomsnitt» → «tilbringer om lag» · «sosiale medier» → «sosiale plattformer»'},

{kat:'parafrase',kat_label:'Parafrase',type:'cloze',vanske:'lett',
 q:'Å gjengi innhaldet i ein tekst med eigne ord, men same meining, heiter ein ___.',
 hint:'Eit gresk-latinsk omgrep for omskriving.',
 fasit:'parafrase',fasit_v:['parafrase','Parafrase'],
 regel:'Ein parafrase er ei omskriving med eigne ord. Kjelda må alltid oppgivast.',
 eks:'Original → parafrase (eigne ord) + kjeldetilvising'},

{kat:'parafrase',kat_label:'Parafrase',type:'omskriv',vanske:'vanskeleg',
 q:'Parafrasér denne kjelda med eigne ord: «Fysisk aktivitet blant barn og unge har minka med 20 prosent dei siste ti åra» (FHI, 2023).',
 tekst:'Fysisk aktivitet blant barn og unge har minska med 20 prosent dei siste ti åra (FHI, 2023).',
 instruksjon:'Skriv om med heilt nye ord og ny setningsstruktur. Behald kjeldetilvisinga.',
 maa_ha:['FHI'],
 maa_ikkje_ha:['minska med 20 prosent'],
 regel:'God parafrase: endre ordval og setningsstruktur. Kjelda (FHI, 2023) skal framleis vere med.',
 eks:'«Born rører seg ein femtedel mindre enn for eit tiår sidan (FHI, 2023).»'},

/* ═══════════════════════════════════════════════════
   22. SITAT  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mc',vanske:'lett',
 q:'Korleis skal eit direkte sitat markerast?',
 alt:['Med parentes','Med hermeteikn (« »)','Med kursiv','Med understrek'],
 fasit:'Med hermeteikn (« »)',
 regel:'Direkte sitat vert markert med hermeteikn (« ») og etterfølgd av kjeldetilvising.',
 eks:'«60 % les dagleg» (SSB, 2023). Hermeteikn = ordrett gjengiving.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mc',vanske:'medium',
 q:'Kva må alltid følgje eit direkte sitat i ein fagartikkel?',
 alt:['Eit utropsteikn','Ein forfattarbiografi','Ei kjeldetilvising med forfattar/årstal','Ei asterisk (*)'],
 fasit:'Ei kjeldetilvising med forfattar/årstal',
 regel:'Etter kvart sitat skal kjelda oppgivast: (Forfattar, årstal) eller (Organisasjon, årstal).',
 eks:'«Plast er eit globalt problem» (FN, 2022). Kjelde = (FN, 2022).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'fillsel',vanske:'medium',
 q:'Vel rett bruk av sitat i kvar situasjon.',
 items:[
  {pre:'Du vil gjengi ei eksakt formulering:',alt:['Parafrase','Direkte sitat med hermeteikn','Fotnotar utan tekst'],fasit:'Direkte sitat med hermeteikn',post:''},
  {pre:'Du vil fortelje kva ei kjelde meiner, men med eigne ord:',alt:['Direkte sitat','Parafrase med kjeldetilvising','Kopiere utan kjelde'],fasit:'Parafrase med kjeldetilvising',post:''},
  {pre:'Du vil framheve ein kort, slåande frase frå ei kjelde:',alt:['Lang parafrase','Kort direkte sitat integrert i setninga','Ignorere kjelda'],fasit:'Kort direkte sitat integrert i setninga',post:''},
  {pre:'Du vil gjengi meir enn 3 linjer frå ei kjelde:',alt:['Blokksitat (innrykka)','"..." i hermeteikn','Parafrase'],fasit:'Blokksitat (innrykka)',post:''}
 ],
 regel:'Direkte sitat = ordrett med « ». Parafrase = eigne ord. Blokksitat = lange sitat innrykka.',
 eks:'Kort sitat: « » + kjelde. Blokksitat: innrykka + kjelde. Parafrase: eigne ord + kjelde.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'fix',vanske:'medium',
 q:'Rett dei tre sitatfeila i teksten.',
 tekst:'Forsking viser at ungdom les mindre. Ifølgje SSB les 60 % av ungdom bøker dagleg. Eksperten sa at plast er farleg for dyr og det er eit stort problem.',
 errors:{'Ifølgje SSB les 60 % av ungdom bøker dagleg':'Ifølgje SSB (2023) les «60 % av ungdom bøker dagleg»','Eksperten sa at plast er farleg for dyr og det er eit stort problem':'Eksperten sa: «Plast er farleg for dyr, og det er eit stort problem» (Hansen, 2023)'},
 fasit:'SSB (2023) + hermeteikn · Eksperten sa: « » + kjelde',
 regel:'Direkte sitat krev hermeteikn (« ») og kjeldetilvising med årstal. Indirekte referat krev og kjelde.',
 eks:'«60 % les dagleg» (SSB, 2023). Eksperten sa: «…» (Hansen, 2023).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er det eit direkte sitat, eit indirekte sitat eller ein parafrase?',
 kolonner:['Direkte sitat','Indirekte sitat','Parafrase'],
 ord:[
  {tekst:'FN skriv: «Plasten i havet truar livet under vatn» (2022).',fasit:0},
  {tekst:'FN hevdar at plasten i havet truar marint liv (2022).',fasit:1},
  {tekst:'Ifølgje FN (2022) er havforureining eit aukande problem for dyrelivet.',fasit:2},
  {tekst:'«Vi må handle raskt» sa generalsekretæren (FN, 2022).',fasit:0},
  {tekst:'Generalsekretæren understreka at verda må handle fort (FN, 2022).',fasit:1},
  {tekst:'FN-leiinga peikar på at det hastar med tiltak mot havforureining (2022).',fasit:2}
 ],
 regel:'Direkte sitat: ordrett + « ». Indirekte sitat: refererer med «at» utan hermeteikn. Parafrase: heilt eigne ord.',
 eks:'Direkte: «…» · Indirekte: «sa at …» · Parafrase: eigne ord + kjelde'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om sitat sanne eller usanne?',
 paastandar:[
  {tekst:'Direkte sitat skal alltid ha hermeteikn.',sann:true},
  {tekst:'Ein parafrase treng ikkje kjeldetilvising.',sann:false},
  {tekst:'Indirekte sitat brukar «at» i staden for hermeteikn.',sann:true},
  {tekst:'Blokksitat er for sitat på meir enn ca. 3 linjer.',sann:true},
  {tekst:'Det er greitt å endre på ordlyden i eit direkte sitat.',sann:false}
 ],
 regel:'Direkte sitat: ordrett + « » + kjelde. Indirekte: «at» + kjelde. Parafrase: eigne ord + kjelde.',
 eks:'Hermeteikn + kjelde = direkte. «At» = indirekte. Eigne ord = parafrase.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'cloze',vanske:'lett',
 q:'Skriv inn rett teikn: Direkte sitat vert markerte med ___ i norsk.',
 hint:'Kva teikn brukar vi rundt ordrett gjengiving?',
 fasit:'hermeteikn',fasit_v:['hermeteikn','« »','«»','anførselsteikn','anførselsmerke','anførselstegn','hermetegn','guillemets'],
 regel:'I norsk brukar vi guillemets (« ») som hermeteikn for direkte sitat.',
 eks:'«Forsking viser at …» (SSB, 2023).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mcset',vanske:'vanskeleg',
 q:'Les utkastet og vurder sitatbruken.',
 tekst:'FN skriv at «Plasten i havet truar livet under vatn» (FN, 2022). Generalsekretæren sa: Vi må handle no. Forskarane meiner at problemet veks raskt.',
 questions:[
  {q:'Er det første sitatet korrekt?',alt:['Ja, det har hermeteikn og kjelde','Nei, det blandar indirekte og direkte sitat','Ja, men det manglar årstal'],fasit:0},
  {q:'Kva manglar i den andre setninga?',alt:['Ingenting','Hermeteikn rundt det direkte sitatet','Kjeldetilvising'],fasit:1},
  {q:'Kva type gjengiving er den tredje setninga?',alt:['Direkte sitat','Indirekte sitat','Parafrase'],fasit:1}
 ],
 regel:'Direkte sitat: «…» + kjelde. Indirekte: «sa at …» + kjelde. Kontroller at alle sitat er markerte rett.',
 eks:'OK: «…» (FN, 2022). Feil: sa: Vi må … (manglar « »). Indirekte: meiner at …'},

/* ═══════════════════════════════════════════════════
   23. TAL OG STATISTIKK  (8 oppgåver)
   ═══════════════════════════════════════════════════ */
{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'mc',vanske:'lett',
 q:'Korleis bør ein presentere tal i ein fagartikkel?',
 alt:['Utan kjelde','Med kjelde og samanheng som gjer talet meiningsfylt','Berre i tabellar','Berre i overskrifta'],
 fasit:'Med kjelde og samanheng som gjer talet meiningsfylt',
 regel:'Tal i fagtekstar skal ha kjelde og setjast i samanheng slik at lesaren forstår kva dei tyder.',
 eks:'«60 % av ungdom les dagleg (SSB, 2023) – ein nedgang på 15 prosentpoeng sidan 2013.»'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'mc',vanske:'medium',
 q:'Kva er skilnaden på prosent og prosentpoeng?',
 alt:['Dei tyder det same','Prosent er ein del av hundre; prosentpoeng er forskjellen mellom to prosenttal','Prosentpoeng er større enn prosent','Prosent brukast i fagartiklar, prosentpoeng i debattinnlegg'],
 fasit:'Prosent er ein del av hundre; prosentpoeng er forskjellen mellom to prosenttal',
 regel:'Prosentpoeng = forskjellen mellom to prosenttal. Auke frå 40 % til 60 % = 20 prosentpoeng, ikkje 20 %.',
 eks:'Frå 40 % til 60 % = 20 prosentpoeng. 20 % av 40 ville vore 8, altså 48 %.'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'fillsel',vanske:'medium',
 q:'Vel den mest presise formuleringa.',
 items:[
  {pre:'Frå 30 % til 45 %:',alt:['Auka med 15 %','Auka med 15 prosentpoeng','Nesten dobla seg'],fasit:'Auka med 15 prosentpoeng',post:''},
  {pre:'48 av 50 elevar bestod:',alt:['Nesten alle bestod','96 % bestod','Mange bestod'],fasit:'96 % bestod',post:''},
  {pre:'200 av 10 000 innbyggjarar:',alt:['Mange innbyggjarar','2 % av innbyggjarane','Tusenvis'],fasit:'2 % av innbyggjarane',post:''},
  {pre:'Prisen gjekk frå 100 til 200 kr:',alt:['Auka med 50 %','Dobla seg','Auka med 200 %'],fasit:'Dobla seg',post:''}
 ],
 regel:'Ver presis: bruk prosentpoeng for differanse mellom prosenttal, prosent for proporsjon, og konkrete tal.',
 eks:'15 prosentpoeng (ikkje 15 %) · 96 % bestod · 2 % · dobla seg'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Er talbruken presis og kjeldefesta, eller upresis og udokumentert?',
 kolonner:['Presis og kjeldefesta','Upresis / udokumentert'],
 ord:[
  {tekst:'Ifølgje SSB (2023) har forbruket auka med 12 %.',fasit:0},
  {tekst:'Ganske mange ungdomar les lite.',fasit:1},
  {tekst:'95 % av 13-åringar har eigen mobil (Medietilsynet, 2024).',fasit:0},
  {tekst:'Masse folk driv med idrett.',fasit:1},
  {tekst:'Ein studie syner at 7 av 10 elevar trenar minst tre gonger i veka (HUNT, 2022).',fasit:0},
  {tekst:'Det er veldig mange som brukar skjerm.',fasit:1}
 ],
 regel:'Presise tal med kjelde gjev truverdig tekst. Vage uttrykk som «mange» og «ganske» svekkjer argumentet.',
 eks:'Presis: «95 %» (Medietilsynet, 2024). Upresis: «Masse folk …» (ingen kjelde)'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'fix',vanske:'vanskeleg',
 q:'Gjer dei vage formuleringane meir presise med tal.',
 tekst:'Ganske mange ungdomar brukar telefonen mykje. Det er veldig mange som er på sosiale medium. Nokon les framleis bøker.',
 errors:{'Ganske mange ungdomar brukar telefonen mykje':'95 % av norske 13-åringar har eigen smarttelefon (Medietilsynet, 2024)','Det er veldig mange som er på sosiale medium':'Ungdom brukar i snitt tre timar dagleg på sosiale medium (Medietilsynet, 2024)','Nokon les framleis bøker':'60 % av ungdom mellom 16 og 24 år les bøker dagleg (SSB, 2023)'},
 fasit:'95 % … (Medietilsynet) · tre timar dagleg … · 60 % … (SSB)',
 regel:'Bytt ut vage uttrykk med presise tal og kjeldetilvisingar. Det gjer teksten meir truverdig.',
 eks:'«ganske mange» → «95 %» · «mykje» → «tre timar dagleg» · «nokon» → «60 %»'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om bruk av tal og statistikk sanne eller usanne?',
 paastandar:[
  {tekst:'Tal i fagartiklar bør alltid ha kjelde.',sann:true},
  {tekst:'«Mange» og «nokre» er presise nok i fagspråk.',sann:false},
  {tekst:'Prosentpoeng og prosent er det same.',sann:false},
  {tekst:'Å setje tal i samanheng gjer dei lettare å forstå.',sann:true},
  {tekst:'Statistikk frå offentlege kjelder (SSB, FHI) er meir truverdig enn anonyme bloggar.',sann:true}
 ],
 regel:'Presise tal med kjelder gjev truverdig fagprosa. Unngå vage uttrykk. Kjenn prosent vs. prosentpoeng.',
 eks:'«mange» = vagt · «60 %» = presist · prosentpoeng ≠ prosent'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'cloze',vanske:'medium',
 q:'Skriv inn rett omgrep: Forskjellen mellom to prosenttal (t.d. frå 40 % til 55 %) målast i ___.',
 hint:'Ikkje det same som vanleg prosent.',
 fasit:'prosentpoeng',fasit_v:['prosentpoeng','Prosentpoeng'],
 regel:'Prosentpoeng = differanse mellom prosenttal. Frå 40 % til 55 % = 15 prosentpoeng.',
 eks:'40 % → 55 % = 15 prosentpoeng (ikkje 15 %)'},

{kat:'tal_og_statistikk',kat_label:'Tal og statistikk',type:'mcset',vanske:'vanskeleg',
 q:'Les påstandane og svar.',
 tekst:'I 2013 las 75 % av ungdom bøker dagleg. I 2023 var talet 60 % (SSB, 2023). Skulane opplyser at dei har kjøpt fleire bøker dei siste åra.',
 questions:[
  {q:'Kor stor er nedgangen i lesing i prosentpoeng?',alt:['15 %','15 prosentpoeng','20 prosentpoeng'],fasit:1},
  {q:'Er kjelda til skuleinformasjonen sterk?',alt:['Ja, skulane er namngjeve','Nei, det er vagt og udokumentert','Ja, SSB er oppgjeve'],fasit:1},
  {q:'Kva hadde styrkja siste setning?',alt:['Bruke «ganske»','Fjerne setninga','Leggje til konkret tal og kjelde'],fasit:2}
 ],
 regel:'Prosentpoeng for differanse. Vage påstandar utan kjelde svekkjer teksten. Alltid konkret + kjelde.',
 eks:'75 % → 60 % = 15 prosentpoeng. «Skulane opplyser» → treng kjelde.'},

/* ═══════════════════════════════════════════════════
   EKSTRA: 10 lukka omskrivingsoppgåver (fix-type)
   ═══════════════════════════════════════════════════ */

{kat:'ordklassar',kat_label:'Ordklassar',type:'fix',vanske:'lett',
 q:'Rett dei tre verba som står i feil tid (skal vere fortid).',
 tekst:'I går besøkte vi bestemor. Ho lagar pannekaker til oss. Vi sit i stova og ser på ein morosam film etter middag.',
 errors:{'lagar':'laga','sit':'sat','ser':'såg'},
 fasit:'laga · sat · såg',
 regel:'Verb blir bøygde i rett tid. Forteljing om fortida brukar preteritum: lage → laga, sitje → sat, sjå → såg.',
 eks:'lagar → laga · sit → sat · ser → såg'},

{kat:'kj_skj',kat_label:'Kj- og skj-lyd',type:'fix',vanske:'lett',
 q:'Rett dei tre stavefeila med kj- og skj-lyd.',
 tekst:'Lise ville sjøpe ei ny sjorte i butikken. Ho sjende at det var mykje å velje mellom. Til slutt fann ho ei fin bluse i rett storleik.',
 errors:{'sjøpe':'kjøpe','sjorte':'skjorte','sjende':'kjende'},
 fasit:'kjøpe · skjorte · kjende',
 regel:'Kj-lyden blir skriven «kj» (kjøpe, kjenne, kjøre). Skj-lyden blir skriven «skj» (skjorte, skjule, skjerm).',
 eks:'kjøpe (kj-lyd) · kjenne (kj-lyd) · skjorte (skj-lyd)'},

{kat:'bindeord',kat_label:'Bindeord',type:'fix',vanske:'medium',
 q:'Rett dei tre feil brukte bindeorda.',
 tekst:'Eleven øvde mykje, så han fekk dårleg karakter på prøven. Han var skuffa, og han bestemde seg for å prøve igjen. Dessutan las han pensum på nytt og klarte det betre neste gong.',
 errors:{'mykje, så':'mykje, men','skuffa, og':'skuffa, difor','Dessutan':'Deretter'},
 fasit:'mykje, men · skuffa, difor · Deretter',
 regel:'Bindeord signaliserer tilhøvet mellom setningar: «men» = motsetnad, «difor» = årsak–verknad, «deretter» = rekkjefølgje.',
 eks:'Han øvde, men fekk dårleg resultat (motsetnad) · Han var skuffa, difor prøvde han igjen (verknad)'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'fix',vanske:'medium',
 q:'Byt ut dei fire uformelle uttrykka med sakleg språk.',
 tekst:'Undersøkingar viser at mange dreg til syden om sommaren. Det er dritkult med sol og varme. Turistar chillar på stranda og tek selfiar. Konklusjonen er at ferie liksom er viktig for helsa.',
 errors:{'dritkult':'svært populært','chillar':'slappar av','selfiar':'bilete av seg sjølve','liksom':'openbert'},
 fasit:'svært populært · slappar av · bilete av seg sjølve · openbert',
 regel:'Sakprosa brukar nøytralt, formelt språk. Slang og munnlege uttrykk høyrer heime i uformelle tekstar.',
 eks:'«dritkult» → «svært populært» · «chillar» → «slappar av» · «liksom» → «openbert»'},

{kat:'og_aa',kat_label:'Og / å',type:'fix',vanske:'medium',
 q:'Rett dei tre og/å-feila.',
 tekst:'Klassen bestemde seg for og arrangere ein konsert. Alle måtte hugse og øve på songane. Læraren lova og hjelpe med lydanlegget.',
 errors:{'for og arrangere':'for å arrangere','hugse og øve':'hugse å øve','lova og hjelpe':'lova å hjelpe'},
 fasit:'for å arrangere · hugse å øve · lova å hjelpe',
 regel:'Etter verb brukar ein infinitivsmerket «å», ikkje «og». Test: kan du setje inn «for» framfor? Då er det «å».',
 eks:'bestemde seg for å · hugse å · lova å'},

{kat:'samansett',kat_label:'Samansette ord',type:'fix',vanske:'medium',
 q:'Rett dei fire særskrivingsfeila.',
 tekst:'Ungdoms skulen arrangerte ein bok kveld i kultur huset. Elevar og foreldre var inviterte til ei koseleg lesestund med bolle sal.',
 errors:{'Ungdoms skulen':'Ungdomsskulen','bok kveld':'bokkveld','kultur huset':'kulturhuset','bolle sal':'bollesal'},
 fasit:'Ungdomsskulen · bokkveld · kulturhuset · bollesal',
 regel:'Samansette substantiv blir skrivne i eitt ord på norsk: ungdomsskule, bokkveld, kulturhus.',
 eks:'Ungdomsskulen (ungdom + skule) · kulturhuset (kultur + hus)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fix',vanske:'medium',
 q:'Rett dei fire feila med einskild og dobbel konsonant.',
 tekst:'Guten leikte med katen i hagen. Balen spratt over gjerdet og hamna hos naboen. Om nata drøymde han at han var fotballspelar.',
 errors:{'Guten':'Gutten','katen':'katten','Balen':'Ballen','nata':'natta'},
 fasit:'Gutten · katten · Ballen · natta',
 regel:'Etter kort vokal skriv ein dobbel konsonant: gutt (kort u), katt (kort a), ball (kort a), natt (kort a).',
 eks:'gutt (kort u → tt) · katt (kort a → tt) · ball (kort a → ll)'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'fix',vanske:'lett',
 q:'Rett dei tre teiknsettingsfeila.',
 tekst:'Kan du hjelpe meg med leksene. Mamma sa vi treng mjølk brød og ost frå butikken. Har du lyst til å bli med',
 errors:{'leksene.':'leksene?','mjølk brød':'mjølk, brød','bli med':'bli med?'},
 fasit:'leksene? · mjølk, brød · bli med?',
 regel:'Spørsmål blir avslutta med spørsmålsteikn. Komma blir brukt mellom ledd i oppramsing (unnateke framfor «og»).',
 eks:'Kan du hjelpe meg? (spørsmålsteikn) · mjølk, brød og ost (komma i oppramsing)'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'fix',vanske:'medium',
 q:'Rett dei tre setningane med feil ordstilling (V2-regelen).',
 tekst:'I går eg gjekk på kino med vener. Filmen var spennande, men litt lang. Etterpå vi åt pizza, og alle hadde det gøy. Diverre eg gløymde jakka mi på kinoen.',
 errors:{'I går eg gjekk':'I går gjekk eg','Etterpå vi åt':'Etterpå åt vi','Diverre eg gløymde':'Diverre gløymde eg'},
 fasit:'I går gjekk eg · Etterpå åt vi · Diverre gløymde eg',
 regel:'I norske hovudsetningar står verbet alltid på andreplass (V2). Når setninga opnar med adverb, kjem verbet rett etter.',
 eks:'I går gjekk eg (V2) · Etterpå åt vi (V2) · Diverre gløymde eg (V2)'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'fix',vanske:'lett',
 q:'Byt ut dei tre upresise orda med meir passande fagord.',
 tekst:'Forskaren fekk ein ting som viste at hypotesen var rett. Han var glad og fortalde om greiene til kollegaene. Dei sa at det var eit bra funn.',
 errors:{'ein ting':'eit resultat','greiene':'funna','bra':'viktig'},
 fasit:'eit resultat · funna · viktig',
 regel:'I sakprosa bør du bruke presise ord: «ting» og «greier» er for vage – bruk fagtermar som «resultat» og «funn».',
 eks:'«ein ting» → «eit resultat» · «greiene» → «funna» · «bra» → «viktig»'},

/* ═══════════════════════════════════════════════════
   EKSTRA: 30 lette oppgåver (4.–5. trinn)
   ═══════════════════════════════════════════════════ */

/* --- og/å (5) --- */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett: «Eg likar ___ ete is.»',
 alt:['og','å'],fasit:1,
 regel:'«Å» er infinitivsmerke og står framfor verb. «Og» bind saman to ting.',
 eks:'Eg likar å ete. (å + verb) · Kake og is. (og bind saman)'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett: «Mamma ___ pappa er heime.»',
 alt:['og','å'],fasit:0,
 regel:'«Og» bind saman to ord eller setningar. «Å» kjem framfor verb.',
 eks:'Mamma og pappa (og = bind saman) · likar å lese (å + verb)'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett: «Ho byrja ___ le.»',
 alt:['og','å'],fasit:1,
 regel:'Etter verb som «byrje», «slutte», «prøve» brukar vi «å» + nytt verb.',
 eks:'byrja å le · slutta å gråte · prøvde å hoppe'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: Per ___ Kari gjekk til skulen.',
 hint:'Bind vi saman to namn, eller er det eit verb?',
 fasit:'og',fasit_v:['og','Og'],
 regel:'«Og» bind saman to namn, ting eller setningar.',
 eks:'Per og Kari · eple og pærer · ho lo og han smilte'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: Han likar ___ teikne.',
 hint:'Kjem det eit verb etter?',
 fasit:'å',fasit_v:['å','Å'],
 regel:'«Å» er infinitivsmerke og står framfor verb (handlingsord).',
 eks:'likar å teikne · gløymde å ete · prøvde å sove'},

/* --- samansette ord (5) --- */
{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Korleis skriv ein det rett?',
 alt:['mot gang','motgang'],fasit:1,
 regel:'Samansette ord blir alltid skrivne i eitt ord på norsk.',
 eks:'motgang, medgang, fotball, iskrem'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva ord er rett skrive?',
 alt:['hunde valp','hundevalp'],fasit:1,
 regel:'Når to ord blir sette saman til eitt omgrep, skriv ein dei i eitt ord.',
 eks:'hundevalp, kattemat, fuglebur'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva ord er rett?',
 alt:['sjokoladekake','sjokolade kake'],fasit:0,
 regel:'Samansette ord blir skrivne i eitt: sjokolade + kake = sjokoladekake.',
 eks:'sjokoladekake, jordbærsyltetøy, pannekake'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv som eitt ord: fotball + bane = ___',
 hint:'Set dei to orda saman utan mellomrom.',
 fasit:'fotballbane',fasit_v:['fotballbane','Fotballbane'],
 regel:'Set orda rett etter kvarandre utan mellomrom.',
 eks:'fotball + bane = fotballbane · is + krem = iskrem'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv som eitt ord: is + krem = ___',
 hint:'Set orda saman.',
 fasit:'iskrem',fasit_v:['iskrem','Iskrem'],
 regel:'Samansette ord blir skrivne i eitt utan mellomrom.',
 eks:'iskrem, iskrembeger, ispinne'},

/* --- dobbel konsonant (5) --- */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva ord er rett stava?',
 alt:['katt','kat'],fasit:0,
 regel:'Etter kort vokal skriv ein dobbel konsonant: katt (kort a).',
 eks:'katt, hatt, natt, ratt'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva ord er rett?',
 alt:['balen','ballen'],fasit:1,
 regel:'«Ball» har kort a, difor dobbel l: ballen.',
 eks:'ballen, hallen'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Vel rett stavemåte:',
 alt:['gutt','gut'],fasit:0,
 regel:'«Gutt» har kort u, difor dobbel t.',
 eks:'gutt, gutten, gutar'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn rett: Eg har ein ___ som heiter Pusur.',
 hint:'Husdyr som seier mjau. Kort a-lyd.',
 fasit:'katt',fasit_v:['katt','Katt'],
 regel:'Etter kort vokal brukar ein dobbel konsonant.',
 eks:'katt (kort a → tt) · hund (lang u → einskild d)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: Vi spelte ___ i friminuttet.',
 hint:'Rund ting ein sparkar. Kort a-lyd.',
 fasit:'ball',fasit_v:['ball','Ball','fotball'],
 regel:'«Ball» har kort a-lyd, difor dobbel l.',
 eks:'ball (kort a → ll) · bok (lang o → einskild k)'},

/* --- ordklassar (5) --- */
{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva slags ord er «spring»?',
 alt:['Substantiv (namnord)','Verb (handlingsord)','Adjektiv (eigenskapsord)'],fasit:1,
 regel:'Verb er handlingsord – dei fortel kva nokon gjer: springe, hoppe, sove.',
 eks:'spring, et, les – alle er verb'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva slags ord er «hund»?',
 alt:['Substantiv (namnord)','Verb (handlingsord)','Adjektiv (eigenskapsord)'],fasit:0,
 regel:'Substantiv er namnord – namn på ting, dyr og personar: hund, bok, jente.',
 eks:'hund, katt, skule, ball – alle er substantiv'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva slags ord er «stor»?',
 alt:['Substantiv (namnord)','Verb (handlingsord)','Adjektiv (eigenskapsord)'],fasit:2,
 regel:'Adjektiv beskriv korleis noko er: stor, liten, raud, fin.',
 eks:'stor, liten, pen, morosam – alle er adjektiv'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva av desse orda er eit verb?',
 alt:['bok','hoppar','raud'],fasit:1,
 regel:'Verb fortel kva nokon gjer. Test: «å ___» – fungerer det? Då er det eit verb.',
 eks:'å hoppe (verb) · bok (substantiv) · raud (adjektiv)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva av desse orda er eit adjektiv?',
 alt:['et','liten','skule'],fasit:1,
 regel:'Adjektiv beskriv eigenskapar. Test: «noko er ___» – fungerer det? Då er det adjektiv.',
 eks:'noko er liten (adjektiv) · et (verb) · skule (substantiv)'},

/* --- teiknsetting (5) --- */
{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kva teikn passar: «Kva heiter du___»',
 alt:['.','?','!'],fasit:1,
 regel:'Spørsmål blir avslutta med spørsmålsteikn (?).',
 eks:'Kva heiter du? · Kvar bur du? · Likar du is?'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kva teikn passar: «Eg likar å lese___»',
 alt:['.','?','!'],fasit:0,
 regel:'Vanlege forteljande setningar blir avslutta med punktum (.).',
 eks:'Eg likar å lese. · Ho bur i Bergen. · Vi åt frukost.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kva teikn passar: «Pass deg___»',
 alt:['.','?','!'],fasit:2,
 regel:'Utrop og åtvaringar blir avslutta med utropsteikn (!).',
 eks:'Pass deg! · Stopp! · Hurra!'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'cloze',vanske:'lett',
 q:'Skriv rett teikn etter setninga: «Kvar bur du»',
 hint:'Er dette ei forteljing, eit spørsmål eller eit utrop?',
 fasit:'?',fasit_v:['?'],
 regel:'Spørsmål blir avslutta med spørsmålsteikn.',
 eks:'Kvar bur du? · Kva gjer du? · Kven er det?'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'cloze',vanske:'lett',
 q:'Skriv rett teikn etter setninga: «Hunden min er snill»',
 hint:'Er dette ei forteljing, eit spørsmål eller eit utrop?',
 fasit:'.',fasit_v:['.'],
 regel:'Forteljande setningar blir avslutta med punktum.',
 eks:'Hunden min er snill. · Katten søv. · Sola skin.'},

/* --- setningsbygging (5) --- */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva setning er rett?',
 alt:['Hund brun er den.','Den brune hunden er fin.','Er brun hund den.'],fasit:1,
 regel:'Ei norsk setning har vanlegvis rekkjefølgja subjekt – verb – objekt.',
 eks:'Den brune hunden (subjekt) er (verb) fin (skildring).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Vel den rette setninga:',
 alt:['Likar eg is.','Eg likar is.','Is eg likar.'],fasit:1,
 regel:'Vanleg rekkjefølgje på norsk: subjekt + verb + resten.',
 eks:'Eg (subjekt) likar (verb) is (objekt).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva setning er rett?',
 alt:['Vi gjekk til skulen i dag.','Til i dag skulen vi gjekk.','Gjekk vi til dag i skulen.'],fasit:0,
 regel:'Tid og stad kjem gjerne til slutt i setninga.',
 eks:'Vi gjekk til skulen i dag. · Ho las boka i går.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Vel rett setning:',
 alt:['Katten sov på sofaen.','Sov katten sofaen på.','På katten sofaen sov.'],fasit:0,
 regel:'Subjektet (den som gjer noko) kjem først, deretter verbet.',
 eks:'Katten (subjekt) sov (verb) på sofaen (stad).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva setning er rett?',
 alt:['Boka las guten.','Guten las boka.','Las boka guten.'],fasit:1,
 regel:'Den som gjer handlinga (subjektet) kjem vanlegvis først.',
 eks:'Guten (subjekt) las (verb) boka (objekt).'}

]; // end BANKV2
if (typeof window !== 'undefined') window.BANKV2 = BANKV2;

/* ─── STATE ──────────────────────────────────────── */
var MTS = {
  pool: [],           // tilgjengeleg for dynamisk plukking
  manualQueue: [],
  manualCursor: 0,
  manualMode: false,
  served: 0,          // oppgåver vist so langt
  targetCount: 8,
  score: 0,           // opptent poeng (inkl. delvis)
  maxScore: 0,        // teoretisk maks
  answered: false,
  streak: 0,
  history: [],        // [{task,correct,points,maxPts,time,isRetry}]
  current: null,

  /* adaptiv */
  catHistory: {},     // { kat: [true,false,…] } siste 5
  retryQueue: [],
  sinceLastRetry: 0,
  feilLog: {},
  level: 'adaptiv',

  /* tidsmåling */
  taskStart: 0,

  /* gamification */
  sessionXP: 0,

  /* innstillingar */
  showRule: false,
  selectedCats: [],
  active: false
};

/* ─── HJELPEFUNKSJONAR ───────────────────────────── */
function mtShuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function $mt(id) { return document.getElementById(id); }

function mtEsc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}

function mtTaskLabel(task) {
  var txt = String((task && (task.q || task.sporsmal)) || 'Oppgåve').replace(/\s+/g, ' ').trim();
  if (!txt) txt = 'Oppgåve';
  if (txt.length > 96) txt = txt.slice(0, 93) + '...';
  return txt;
}

function mtNorm(s) { return String(s).trim().toLowerCase(); }

/* Levenshtein-avstand */
function mtLevenshtein(a, b) {
  a = mtNorm(a); b = mtNorm(b);
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  var m = [];
  for (var i = 0; i <= b.length; i++) m[i] = [i];
  for (var j = 0; j <= a.length; j++) m[0][j] = j;
  for (var i2 = 1; i2 <= b.length; i2++) {
    for (var j2 = 1; j2 <= a.length; j2++) {
      var cost = b.charAt(i2 - 1) === a.charAt(j2 - 1) ? 0 : 1;
      m[i2][j2] = Math.min(m[i2 - 1][j2] + 1, m[i2][j2 - 1] + 1, m[i2 - 1][j2 - 1] + cost);
    }
  }
  return m[b.length][a.length];
}

/* ─── LOCALSTORAGE ───────────────────────────────── */
var MT_LS_KEY = 'nlMestring';
var MT_LS_BACKUP_KEY = 'nlMestring_backup';
var MT_LS_VERSION = 2;

function mtLsReadKey(key) {
  var raw = localStorage.getItem(key);
  if (!raw) return null;
  var parsed = JSON.parse(raw);
  return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : null;
}

function mtLsSanitize(data) {
  var out = (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};

  if (!Array.isArray(out.sessions)) out.sessions = [];
  if (typeof out.totalXP !== 'number' || !isFinite(out.totalXP) || out.totalXP < 0) out.totalXP = 0;
  if (!out.badges || typeof out.badges !== 'object' || Array.isArray(out.badges)) out.badges = {};
  if (!Array.isArray(out.feillogg)) out.feillogg = [];

  if (!out.streak || typeof out.streak !== 'object' || Array.isArray(out.streak)) {
    out.streak = { dagar: [], current: 0, rekord: 0 };
  }
  if (!Array.isArray(out.streak.dagar)) out.streak.dagar = [];
  out.streak.current = Math.max(0, Number(out.streak.current) || 0);
  out.streak.rekord = Math.max(out.streak.current, Number(out.streak.rekord) || 0);

  out._v = MT_LS_VERSION;
  return out;
}

function mtLsGet() {
  try {
    var primary = mtLsReadKey(MT_LS_KEY);
    if (primary) return mtLsSanitize(primary);
    var backup = mtLsReadKey(MT_LS_BACKUP_KEY);
    if (backup) return mtLsSanitize(backup);
    return mtLsSanitize({});
  }
  catch (e) { return {}; }
}
function mtLsSet(data) {
  try {
    var clean = mtLsSanitize(data || {});
    clean._savedAt = new Date().toISOString();
    var payload = JSON.stringify(clean);
    localStorage.setItem(MT_LS_KEY, payload);
    localStorage.setItem(MT_LS_BACKUP_KEY, payload);
  }
  catch (e) { /* privat modus */ }
}
function mtLsSaveSession() {
  var data = mtLsGet();
  if (!data.sessions) data.sessions = [];
  var catScores = {};
  MTS.history.forEach(function (h) {
    var k = h.task.kat;
    if (!catScores[k]) catScores[k] = { rett: 0, feil: 0, poeng: 0, maks: 0 };
    catScores[k].poeng += h.points;
    catScores[k].maks += h.maxPts;
    if (h.correct) catScores[k].rett++; else catScores[k].feil++;
  });
  data.sessions.push({
    dato: new Date().toISOString(),
    cats: catScores,
    totalPoeng: MTS.score,
    totalMaks: MTS.maxScore
  });
  if (data.sessions.length > 100) data.sessions = data.sessions.slice(-100);
  mtLsSet(data);
}
function mtLsCatStats(kat) {
  var data = mtLsGet();
  var s = data.sessions || [];
  var rett = 0, feil = 0;
  s.forEach(function (ses) {
    if (ses.cats && ses.cats[kat]) { rett += ses.cats[kat].rett; feil += ses.cats[kat].feil; }
  });
  var total = rett + feil;
  return { rett: rett, feil: feil, total: total, pct: total > 0 ? Math.round(rett / total * 100) : -1 };
}

/* ─── XP / NIVÅ ──────────────────────────────────── */
var MT_XP_LEVELS = [
  { name: 'Ordlærling',         xp: 0,    icon: '\uD83C\uDF31' },
  { name: 'Setningssmed',       xp: 80,   icon: '\uD83D\uDD28' },
  { name: 'Tekstbyggjar',       xp: 250,  icon: '\uD83C\uDFD7' },
  { name: 'Grammatikksnekkar',  xp: 500,  icon: '\u2699\uFE0F' },
  { name: 'Språkmeister',       xp: 900,  icon: '\uD83C\uDFC6' },
  { name: 'Norskmeistar',       xp: 1500, icon: '\uD83D\uDC51' }
];

function mtXpCalc(correct, pts, maxPts, vanske, streak, isRetry) {
  if (!correct && pts === 0) return 0;
  var base = { lett: 8, medium: 15, vanskeleg: 25 };
  var b = base[vanske] || 12;
  var ratio = maxPts > 0 ? pts / maxPts : (correct ? 1 : 0);
  var xp = Math.round(b * ratio);
  if (streak >= 5) xp = Math.round(xp * 1.5);
  else if (streak >= 3) xp = Math.round(xp * 1.25);
  if (isRetry) xp = Math.max(1, Math.round(xp * 0.5));
  return xp;
}

function mtXpGetTotal() {
  var data = mtLsGet();
  return data.totalXP || 0;
}

function mtXpSave(earned) {
  var data = mtLsGet();
  data.totalXP = (data.totalXP || 0) + earned;
  mtLsSet(data);
  return data.totalXP;
}

function mtXpLevel(totalXP) {
  var lvl = MT_XP_LEVELS[0];
  for (var i = MT_XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= MT_XP_LEVELS[i].xp) { lvl = MT_XP_LEVELS[i]; break; }
  }
  var next = null;
  var idx = MT_XP_LEVELS.indexOf(lvl);
  if (idx < MT_XP_LEVELS.length - 1) next = MT_XP_LEVELS[idx + 1];
  return { current: lvl, next: next, index: idx };
}

/* ─── PERSONLEG FEILLOGG ─────────────────────────── */
var MT_FEILLOGG_MAX = 50;

function mtFeilloggGet() {
  var data = mtLsGet();
  return data.feillogg || [];
}

function mtFeilloggPush(task, chosen) {
  var data = mtLsGet();
  if (!data.feillogg) data.feillogg = [];
  data.feillogg.push({
    id: task.id || null,
    kat: task.kat,
    kat_label: task.kat_label || task.kat,
    vanske: task.vanske,
    sporsmal: task.sporsmal || task.tekst || '',
    fasit: task.fasit || '',
    svart: typeof chosen === 'string' ? chosen : JSON.stringify(chosen),
    dato: new Date().toISOString()
  });
  if (data.feillogg.length > MT_FEILLOGG_MAX) data.feillogg = data.feillogg.slice(-MT_FEILLOGG_MAX);
  mtLsSet(data);
}

/* Start økt basert på feillogg-oppgåver */
function mtStartFeillogg() {
  var logg = mtFeilloggGet();
  if (!logg.length) { alert('Ingen tidlegare feil å øva på enno!'); return; }
  /* Finn unike oppgåve-IDar frå feilloggen */
  var ids = {};
  logg.forEach(function (e) { if (e.id) ids[e.id] = true; });
  var pool = BANKV2.filter(function (t) { return t.id && ids[t.id]; });
  /* Fallback: match på kategori + vanske */
  if (!pool.length) {
    var katSet = {};
    logg.forEach(function (e) { katSet[e.kat] = true; });
    pool = BANKV2.filter(function (t) { return katSet[t.kat]; });
  }
  if (!pool.length) { alert('Fann ikkje oppgåver som matchlar feilloggen din.'); return; }
  pool = mtShuffle(pool);
  var count = Math.min(pool.length, 10);

  mtResetSessionState({
    pool: pool,
    targetCount: count,
    level: 'adaptiv',
    selectedCats: [],
    manualMode: false,
    manualQueue: []
  });
  mtOpenSessionUi();

  mtUpdateProgress();
  mtServeNext();
}

/* ─── DAGLEG STREAK ──────────────────────────────── */
function mtStreakToday() {
  return new Date().toISOString().slice(0, 10);
}

function mtStreakGet() {
  var data = mtLsGet();
  return data.streak || { dagar: [], current: 0, rekord: 0 };
}

function mtStreakRegister() {
  var data = mtLsGet();
  if (!data.streak) data.streak = { dagar: [], current: 0, rekord: 0 };
  var today = mtStreakToday();
  var d = data.streak.dagar;
  if (d.length && d[d.length - 1] === today) { mtLsSet(data); return data.streak; }
  /* Sjekk om i går er med */
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (d.length && d[d.length - 1] === yesterday) {
    data.streak.current++;
  } else {
    data.streak.current = 1;
  }
  d.push(today);
  if (d.length > 60) d.splice(0, d.length - 60);
  if (data.streak.current > data.streak.rekord) data.streak.rekord = data.streak.current;
  mtLsSet(data);
  return data.streak;
}

/* ─── BADGES / PRESTASJONAR ──────────────────────── */
var MT_BADGE_DEFS = [
  { id: 'first_session',   icon: '\uD83C\uDF1F', namn: 'Fyrste økt',             beskriving: 'Fullførte fyrste øvingsøkt',                 check: function (d) { return d.sessions >= 1; } },
  { id: 'ten_correct',     icon: '\uD83C\uDFAF', namn: '10 rette',               beskriving: '10 rette svar totalt',                        check: function (d) { return d.totalRett >= 10; } },
  { id: 'fifty_correct',   icon: '\uD83D\uDD25', namn: '50 rette',               beskriving: '50 rette svar totalt',                        check: function (d) { return d.totalRett >= 50; } },
  { id: 'hundred_tasks',   icon: '\uD83D\uDCAF', namn: '100 oppgåver',           beskriving: 'Svart på 100 oppgåver totalt',                check: function (d) { return d.totalTasks >= 100; } },
  { id: 'all_cats',        icon: '\uD83C\uDF08', namn: 'Allsidig',               beskriving: 'Prøvd alle kategoriar',                       check: function (d) { return d.allCats; } },
  { id: 'streak3',         icon: '\u26A1',        namn: '3 dagar på rad',         beskriving: 'Øvd 3 dagar på rad',                         check: function (d) { return d.streakCurrent >= 3; } },
  { id: 'streak7',         icon: '\uD83D\uDD25', namn: '7 dagar på rad',         beskriving: 'Øvd ei heil veke på rad',                    check: function (d) { return d.streakCurrent >= 7; } },
  { id: 'perfect_session', icon: '\uD83C\uDFC5', namn: 'Perfekt økt',            beskriving: 'Fullført ei økt med 100 % rett',             check: function (d) { return d.sessionPerfect; } },
  { id: 'hard_session',    icon: '\uD83E\uDDD7', namn: 'Utfordrar seg sjølv',    beskriving: 'Fullført ei økt på vanskeleg nivå',          check: function (d) { return d.hardSession; } },
  { id: 'xp500',           icon: '\uD83D\uDE80', namn: '500 XP',                 beskriving: 'Tent 500 erfaringspoeng totalt',             check: function (d) { return d.totalXP >= 500; } },
  { id: 'xp1500',          icon: '\uD83D\uDC51', namn: '1500 XP',                beskriving: 'Tent 1500 erfaringspoeng totalt',            check: function (d) { return d.totalXP >= 1500; } },
  { id: 'retry_hero',      icon: '\uD83D\uDD04', namn: 'Lærer av feil',          beskriving: 'Klart 5 retry-oppgåver rett',                check: function (d) { return d.retryWins >= 5; } }
];

function mtBadgesGet() {
  var data = mtLsGet();
  return data.badges || {};
}

function mtBadgesCheck(sessionData) {
  var data = mtLsGet();
  if (!data.badges) data.badges = {};
  /* Saml statistikk */
  var sessions = data.sessions || [];
  var totalRett = 0, totalTasks = 0, retryWins = 0;
  var seenCats = {};
  sessions.forEach(function (s) {
    if (s.cats) {
      Object.keys(s.cats).forEach(function (k) {
        seenCats[k] = true;
        totalRett += s.cats[k].rett || 0;
        totalTasks += (s.cats[k].rett || 0) + (s.cats[k].feil || 0);
      });
    }
  });
  /* Retry-wins frå alle historikk-sessionar */
  if (data.retryWins) retryWins = data.retryWins;
  var allBankCats = {};
  BANKV2.forEach(function (t) { allBankCats[t.kat] = true; });
  var allCats = Object.keys(allBankCats).length > 0 && Object.keys(allBankCats).every(function (k) { return seenCats[k]; });

  var str = mtStreakGet();
  var ctx = {
    sessions: sessions.length,
    totalRett: totalRett,
    totalTasks: totalTasks,
    allCats: allCats,
    streakCurrent: str.current,
    sessionPerfect: sessionData && sessionData.pct === 100,
    hardSession: sessionData && sessionData.level === 'vanskeleg',
    totalXP: data.totalXP || 0,
    retryWins: retryWins
  };

  var newBadges = [];
  MT_BADGE_DEFS.forEach(function (bd) {
    if (!data.badges[bd.id] && bd.check(ctx)) {
      data.badges[bd.id] = { dato: new Date().toISOString() };
      newBadges.push(bd);
    }
  });
  mtLsSet(data);
  return newBadges;
}

function mtBadgesCountRetryWin() {
  var data = mtLsGet();
  data.retryWins = (data.retryWins || 0) + 1;
  mtLsSet(data);
}

function mtBadgesLatestUnlocked() {
  var badges = mtBadgesGet();
  var latestId = null;
  var latestTs = -1;

  Object.keys(badges).forEach(function (id) {
    var item = badges[id] || {};
    var ts = item.dato ? Date.parse(item.dato) : 0;
    if (!isFinite(ts)) ts = 0;
    if (ts > latestTs) {
      latestTs = ts;
      latestId = id;
    }
  });

  if (!latestId) return null;
  for (var i = 0; i < MT_BADGE_DEFS.length; i++) {
    if (MT_BADGE_DEFS[i].id === latestId) return MT_BADGE_DEFS[i];
  }
  return null;
}

/* ─── ADAPTIV MOTOR ──────────────────────────────── */

function mtCatMastery(kat) {
  var h = MTS.catHistory[kat];
  if (!h || !h.length) return -1;
  var r = 0; h.forEach(function (v) { if (v) r++; });
  return r / h.length;
}

function mtEffectiveLevel(kat) {
  var m = mtCatMastery(kat);
  if (m < 0) return 'lett';
  if (m >= 0.8) return 'vanskeleg';
  if (m < 0.5) return 'lett';
  return 'medium';
}

function mtPickNext() {
  if (MTS.manualMode) {
    if (MTS.manualCursor >= MTS.manualQueue.length) return null;
    return { task: MTS.manualQueue[MTS.manualCursor++], isRetry: false };
  }
  /* 1) Retry-kø kvar 3.–5. oppgåve */
  if (MTS.retryQueue.length && MTS.sinceLastRetry >= 3) {
    MTS.sinceLastRetry = 0;
    return { task: MTS.retryQueue.shift(), isRetry: true };
  }
  /* 2) Plukk frå pool adaptivt */
  if (!MTS.pool.length) return null;
  var preferred = {};
  MTS.selectedCats.forEach(function (kat) {
    preferred[kat] = (MTS.level === 'adaptiv') ? mtEffectiveLevel(kat) : MTS.level;
  });
  var best = -1;
  for (var i = 0; i < MTS.pool.length; i++) {
    if (preferred[MTS.pool[i].kat] === MTS.pool[i].vanske) { best = i; break; }
  }
  if (best < 0) best = 0;
  var task = MTS.pool.splice(best, 1)[0];
  MTS.sinceLastRetry++;
  return { task: task, isRetry: false };
}

function mtResetSessionState(opts) {
  var cfg = opts || {};
  MTS.pool = Array.isArray(cfg.pool) ? cfg.pool : [];
  MTS.manualQueue = Array.isArray(cfg.manualQueue) ? cfg.manualQueue : [];
  MTS.manualCursor = 0;
  MTS.manualMode = !!cfg.manualMode;
  MTS.served = 0;
  MTS.targetCount = Math.max(1, Number(cfg.targetCount) || 8);
  MTS.score = 0;
  MTS.maxScore = 0;
  MTS.answered = false;
  MTS.streak = 0;
  MTS.history = [];
  MTS.current = null;
  MTS.catHistory = {};
  MTS.retryQueue = [];
  MTS.sinceLastRetry = 0;
  MTS.feilLog = {};
  MTS.level = String(cfg.level || 'adaptiv');
  MTS.selectedCats = Array.isArray(cfg.selectedCats) ? cfg.selectedCats.slice() : [];
  MTS.active = true;
  MTS.showRule = false;
  MTS.sessionXP = 0;
  MTS.baseXP = mtXpGetTotal();
  MTS._uiCache = { score: 0, xp: 0, streak: 0 };
}

function mtOpenSessionUi() {
  var win = $mt('nl-ad-win');
  var summary = $mt('nl-ad-summary');
  var body = $mt('nl-ad-win-body');
  var actions = $mt('nl-ad-actions');
  if (win) win.hidden = false;
  if (summary) summary.hidden = true;
  if (body) body.innerHTML = '';
  if (actions) actions.style.display = 'flex';
}

/* ─── SESJON ─────────────────────────────────────── */

function mtStart() {
  var valgte = [];
  document.querySelectorAll('#nl-ad-cats .adp-cat.on').forEach(function (el) {
    valgte.push(el.dataset.cat);
  });
  if (!valgte.length) { alert('Vel minst éin kategori.'); return; }

  var levelEl = $mt('nl-ad-level');
  var countEl = $mt('nl-ad-count');
  var level = levelEl ? levelEl.value : 'adaptiv';
  var count = countEl ? parseInt(countEl.value, 10) : 8;
  if (!Number.isFinite(count) || count < 3) count = 3;
  if (count > 25) count = 25;

  var pool = BANKV2.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
  if (level !== 'adaptiv') pool = pool.filter(function (t) { return t.vanske === level; });
  pool = mtShuffle(pool);
  if (!pool.length) { alert('Ingen oppgåver passar vala dine.'); return; }
  if (count > pool.length) count = pool.length;

  mtResetSessionState({
    pool: pool,
    targetCount: count,
    level: level,
    selectedCats: valgte,
    manualMode: false,
    manualQueue: []
  });
  mtOpenSessionUi();

  mtUpdateProgress();
  mtServeNext();
}

function mtStartManualQueue(taskIndexes, startIndex) {
  var idxs = Array.isArray(taskIndexes) ? taskIndexes : [];
  var tasks = idxs.map(function (idx) {
    return BANKV2[Number(idx)];
  }).filter(function (task) {
    return !!task;
  });
  if (!tasks.length) {
    alert('Fann ingen manuelle oppgåver å starte.');
    return;
  }

  var start = Number(startIndex);
  if (!Number.isFinite(start) || start < 0 || start >= tasks.length) start = 0;
  var ordered = tasks.slice(start).concat(tasks.slice(0, start));
  var cats = [];
  ordered.forEach(function (task) {
    if (cats.indexOf(task.kat) === -1) cats.push(task.kat);
  });

  mtResetSessionState({
    pool: [],
    targetCount: ordered.length,
    level: 'manuell',
    selectedCats: cats,
    manualMode: true,
    manualQueue: ordered
  });
  mtOpenSessionUi();

  mtUpdateProgress();
  mtServeNext();
}

function mtAbort() {
  MTS.active = false;
  MTS.pool = [];
  var win = $mt('nl-ad-win');
  if (win) win.hidden = true;
  var body = $mt('nl-ad-win-body');
  if (body) body.innerHTML = '';
}

function mtUpdateProgress() {
  var retries = MTS.history.filter(function (h) { return h.isRetry; }).length;
  var total = MTS.targetCount + retries;
  var done = MTS.history.length;
  var pct = total > 0 ? Math.round(done / total * 100) : 0;

  var liveP = $mt('mt-live-progress');
  var liveBar = $mt('mt-live-bar-fill');
  var liveScore = $mt('mt-live-score');
  var liveXp = $mt('mt-live-xp');
  var liveStreak = $mt('mt-live-streak');
  var masteryIcon = $mt('mt-live-mastery-icon');
  var masteryName = $mt('mt-live-mastery-name');
  var masteryTrophies = $mt('mt-live-mastery-trophies');
  var masteryFill = $mt('mt-live-mastery-fill');
  var masteryText = $mt('mt-live-mastery-text');
  var prev = MTS._uiCache || { score: 0, xp: 0, streak: 0 };

  if (liveP) liveP.textContent = 'Oppgåve ' + Math.min(done + 1, total) + ' av ' + total;
  if (liveBar) liveBar.style.width = Math.min(pct, 100) + '%';
  if (liveScore) {
    if (prev.score !== MTS.score) mtFxAnimatePill(liveScore.parentElement, 'pill-pop');
    liveScore.textContent = String(MTS.score);
  }
  if (liveXp) {
    if (prev.xp !== (MTS.sessionXP || 0)) mtFxAnimatePill(liveXp.parentElement, 'pill-pop');
    liveXp.textContent = String(MTS.sessionXP || 0);
  }
  if (liveStreak) {
    if (prev.streak !== (MTS.streak || 0)) {
      mtFxAnimatePill(liveStreak.parentElement, 'pill-pop');
      if ((MTS.streak || 0) >= 3 && (MTS.streak || 0) > (prev.streak || 0)) {
        mtFxAnimatePill(liveStreak.parentElement, 'streak-fire');
      }
    }
    liveStreak.textContent = String(MTS.streak || 0);
  }

  var totalXpNow = Math.max(0, Number(MTS.baseXP || 0) + Number(MTS.sessionXP || 0));
  var lvl = mtXpLevel(totalXpNow);
  var remain = lvl.next ? Math.max(0, lvl.next.xp - totalXpNow) : 0;
  var unlocked = Object.keys(mtBadgesGet()).length;
  var totalBadges = MT_BADGE_DEFS.length;
  var progressPct = 100;
  var progressText = 'Maks nivå';
  if (lvl.next) {
    var span = Math.max(1, lvl.next.xp - lvl.current.xp);
    var earned = Math.max(0, totalXpNow - lvl.current.xp);
    progressPct = Math.max(0, Math.min(100, Math.round((earned / span) * 100)));
    progressText = earned + ' / ' + span + ' XP';
  }

  if (masteryIcon) masteryIcon.innerHTML = lvl.current.icon;
  if (masteryName) masteryName.textContent = lvl.current.name;
  if (masteryTrophies) masteryTrophies.textContent = unlocked + '/' + totalBadges + ' trofé';
  if (masteryFill) masteryFill.style.width = progressPct + '%';
  if (masteryText) masteryText.textContent = lvl.next ? ('Til neste nivå: ' + remain + ' XP') : progressText;

  MTS._uiCache = {
    score: MTS.score,
    xp: MTS.sessionXP || 0,
    streak: MTS.streak || 0
  };
}

function mtFxAnimatePill(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(function () { el.classList.remove(className); }, 700);
}

function mtFxSpawnFloat(anchor, text, big) {
  if (!anchor || !text) return;
  var host = anchor.closest('.adp-win-card') || document.body;
  if (!host) return;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  var rHost = host.getBoundingClientRect();
  var rAnchor = anchor.getBoundingClientRect();
  var el = document.createElement('span');
  el.className = 'xp-float' + (big ? ' xp-big' : '');
  el.textContent = text;
  el.style.left = (rAnchor.left - rHost.left + rAnchor.width / 2) + 'px';
  el.style.top = (rAnchor.top - rHost.top - 4) + 'px';
  host.appendChild(el);
  el.addEventListener('animationend', function () { el.remove(); });
}

function mtFxSpawnSparks(anchor, count) {
  if (!anchor) return;
  var host = anchor.closest('.adp-win-card') || document.body;
  if (!host) return;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  var rHost = host.getBoundingClientRect();
  var rAnchor = anchor.getBoundingClientRect();
  var cx = rAnchor.left - rHost.left + rAnchor.width / 2;
  var cy = rAnchor.top - rHost.top + rAnchor.height / 2;
  var colors = ['#7b2fbe', '#c8832a', '#1d6a45', '#1D6FD1', '#C0392B', '#f5c542'];

  for (var i = 0; i < count; i++) {
    var spark = document.createElement('span');
    spark.className = 'xp-spark';
    var angle = ((Math.PI * 2) / count) * i + (Math.random() * 0.5 - 0.25);
    var dist = 26 + Math.random() * 46;
    spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
    spark.style.background = colors[i % colors.length];
    spark.style.left = cx + 'px';
    spark.style.top = cy + 'px';
    host.appendChild(spark);
    spark.addEventListener('animationend', function (e) { e.currentTarget.remove(); });
  }
}

function mtFxFlashCard() {
  var card = document.querySelector('#nl-ad-win-body .mt-card');
  if (!card) return;
  card.classList.remove('nl-ad-correct-flash');
  void card.offsetWidth;
  card.classList.add('nl-ad-correct-flash');
  setTimeout(function () { card.classList.remove('nl-ad-correct-flash'); }, 1050);
}

function mtFxGlowHeaderStreak() {
  var streakEl = document.getElementById('nl-ad-prof-streak');
  if (!streakEl) return;
  var pill = streakEl.closest('.adp-g-pill');
  if (!pill) return;
  pill.classList.remove('streak-glow');
  void pill.offsetWidth;
  pill.classList.add('streak-glow');
  setTimeout(function () { pill.classList.remove('streak-glow'); }, 2200);
}

function mtFxLevelUpFlash() {
  var fx = document.createElement('div');
  fx.className = 'level-up-flash';
  document.body.appendChild(fx);
  setTimeout(function () { fx.remove(); }, 1900);
}

function mtFxModalConfetti() {
  var host = document.querySelector('#nl-ad-win .adp-win-card') || document.body;
  if (!host) return;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  var rect = host.getBoundingClientRect();
  var cx = rect.width / 2;
  var cy = Math.min(120, rect.height * 0.2);
  var colors = ['#f5c542', '#7b2fbe', '#1d6a45', '#1D6FD1', '#C0392B', '#f08b2d'];

  for (var i = 0; i < 28; i++) {
    var p = document.createElement('span');
    p.className = 'xp-spark';
    var angle = (Math.PI * 2 * Math.random()) - Math.PI;
    var dist = 90 + Math.random() * 170;
    p.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--sy', Math.sin(angle) * dist + 120 + 'px');
    p.style.background = colors[i % colors.length];
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    host.appendChild(p);
    p.addEventListener('animationend', function (e) { e.currentTarget.remove(); });
  }
}

function mtEscHighlight(text, tokens, className) {
  var html = mtEsc(String(text || ''));
  (tokens || []).forEach(function (tok) {
    if (!tok) return;
    var e = mtEsc(String(tok));
    html = html.split(e).join('<span class="' + className + '">' + e + '</span>');
  });
  return html;
}

function mtBuildFixCorrectionHtml(task) {
  var text = String(task.tekst || '');
  var map = task.errors || {};
  var wrongs = Object.keys(map);
  if (!wrongs.length || !text) return '';

  var corrected = text;
  wrongs.forEach(function (wrong) {
    corrected = corrected.split(wrong).join(map[wrong]);
  });

  var correctedTokens = wrongs.map(function (w) { return map[w]; });
  return '<div class="mt-fb-correction">' +
    '<div class="mt-fb-corr-row"><strong>Retting i teksten:</strong> ' + mtEscHighlight(text, wrongs, 'mt-mark-bad') + '</div>' +
    '<div class="mt-fb-corr-row"><strong>Føreslått versjon:</strong> ' + mtEscHighlight(corrected, correctedTokens, 'mt-mark-ok') + '</div>' +
    '</div>';
}

function mtBuildFillselCorrectionHtml(task, selects) {
  var items = task.items || [];
  if (!items.length) return '';

  var rows = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i] || {};
    var sel = selects[i];
    var chosen = sel ? String(sel.value || '') : '';
    var answer = String(item.fasit || '');
    var ok = mtNorm(chosen) === mtNorm(answer);
    var token = '<span class="' + (ok ? 'mt-mark-ok' : 'mt-mark-bad') + '">' + mtEsc(chosen || '∅') + '</span>';
    var fasit = ok ? '' : ' <span class="mt-fb-fasit-inline">→ ' + mtEsc(answer) + '</span>';
    rows.push('<div class="mt-fb-corr-row">' + mtEsc(item.pre || '') + ' ' + token + ' ' + mtEsc(item.post || '') + fasit + '</div>');
  }
  return '<div class="mt-fb-correction"><strong>Retting:</strong>' + rows.join('') + '</div>';
}

function mtUpdateHeaderProfile(totalXP, streakCurrent) {
  var levelEl = document.getElementById('nl-ad-prof-level');
  var xpEl = document.getElementById('nl-ad-prof-xp');
  var nextEl = document.getElementById('nl-ad-prof-next');
  var streakEl = document.getElementById('nl-ad-prof-streak');
  var levelNameEl = document.getElementById('nl-ad-prof-level-name');
  var levelIconEl = document.getElementById('nl-ad-prof-level-icon');
  var progressFillEl = document.getElementById('nl-ad-prof-progress-fill');
  var progressTextEl = document.getElementById('nl-ad-prof-progress-text');
  var trophiesEl = document.getElementById('nl-ad-prof-trophies');
  var lastBadgeEl = document.getElementById('nl-ad-prof-last-badge');
  var lvl = mtXpLevel(totalXP || 0);
  var badges = mtBadgesGet();
  var latestBadge = mtBadgesLatestUnlocked();
  var unlocked = Object.keys(badges).length;
  var totalBadges = MT_BADGE_DEFS.length;

  if (levelEl) levelEl.textContent = String(lvl.index + 1);
  if (xpEl) xpEl.textContent = String(totalXP || 0);

  var remain = lvl.next ? Math.max(0, lvl.next.xp - (totalXP || 0)) : 0;
  var progressPct = 100;
  var progressText = 'Maks nivå';
  if (lvl.next) {
    var span = Math.max(1, lvl.next.xp - lvl.current.xp);
    var earned = Math.max(0, (totalXP || 0) - lvl.current.xp);
    progressPct = Math.max(0, Math.min(100, Math.round((earned / span) * 100)));
    progressText = earned + ' / ' + span + ' XP';
  }

  if (nextEl) {
    nextEl.textContent = lvl.next ? (remain + ' XP') : 'Maks nivå';
  }
  if (streakEl) {
    var s = Math.max(0, Number(streakCurrent) || 0);
    streakEl.textContent = s + (s === 1 ? ' dag' : ' dagar');
  }
  if (levelNameEl) levelNameEl.textContent = lvl.current.name;
  if (levelIconEl) levelIconEl.innerHTML = lvl.current.icon;
  if (progressFillEl) {
    var prevPct = Number(progressFillEl.dataset.pct || '0');
    progressFillEl.style.width = progressPct + '%';
    progressFillEl.dataset.pct = String(progressPct);
    if (progressPct > prevPct + 0.5) {
      progressFillEl.classList.remove('adp-prof-progress-up');
      void progressFillEl.offsetWidth;
      progressFillEl.classList.add('adp-prof-progress-up');
      setTimeout(function () { progressFillEl.classList.remove('adp-prof-progress-up'); }, 850);
    }
  }
  if (progressTextEl) progressTextEl.textContent = progressText;
  if (trophiesEl) trophiesEl.textContent = unlocked + '/' + totalBadges;
  if (lastBadgeEl) {
    if (latestBadge) {
      var prevBadgeId = lastBadgeEl.dataset.badgeId || '';
      lastBadgeEl.hidden = false;
      lastBadgeEl.textContent = latestBadge.icon + ' Siste pokal: ' + latestBadge.namn;
      lastBadgeEl.dataset.badgeId = latestBadge.id;
      if (prevBadgeId && prevBadgeId !== latestBadge.id) {
        lastBadgeEl.classList.remove('adp-g-hero-last-pop');
        void lastBadgeEl.offsetWidth;
        lastBadgeEl.classList.add('adp-g-hero-last-pop');
        setTimeout(function () { lastBadgeEl.classList.remove('adp-g-hero-last-pop'); }, 700);
      }
    } else {
      lastBadgeEl.hidden = true;
      lastBadgeEl.dataset.badgeId = '';
    }
  }
}

function mtServeNext() {
  if (MTS.served >= MTS.targetCount && !MTS.retryQueue.length) {
    mtShowSummary();
    return;
  }
  var pick = mtPickNext();
  if (!pick) { mtShowSummary(); return; }
  MTS.current = pick.task;
  MTS.current._isRetry = pick.isRetry;
  MTS.answered = false;
  MTS.taskStart = Date.now();
  if (!pick.isRetry) MTS.served++;
  mtUpdateProgress();
  mtRenderTask(pick.task, pick.isRetry);
}

/* ══════════════════════════════════════════════════════
   RENDER – bygg HTML for kvar oppgåvetype
══════════════════════════════════════════════════════ */

function mtRenderTask(t, isRetry) {
  var body = $mt('nl-ad-win-body');
  if (!body) return;

  /* Vanskebadge */
  var vMap = { lett: 'Lett', medium: 'Medium', vanskeleg: 'Vanskeleg' };
  var vLabel = vMap[t.vanske] || '';

  /* Retry-badge */
  var retryBadge = isRetry
    ? '<span class="mt-badge mt-badge-retry">&#128260; Prøv igjen</span>'
    : '';

  /* Vis regel først (om toggle er på) */
  var ruleFirst = '';
  if (MTS.showRule && t.regel) {
    ruleFirst = '<div class="mt-rule-first"><strong>&#128218; Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  }

  /* Lesetekst dersom oppgåva har t.tekst og typen ikkje rendrar det sjølv */
  var noOwnText = ['finn_feil', 'klikk_marker', 'fix', 'avsnitt_klikk', 'omskriv'];
  var tekstHTML = '';
  if (t.tekst && noOwnText.indexOf(t.type) === -1) {
    tekstHTML = '<div class="mt-context-text">' + mtEsc(t.tekst) + '</div>';
  }

  /* Hint */
  var hintHTML = t.hint
    ? '<div class="mt-hint">&#128161; <span>' + mtEsc(t.hint) + '</span></div>'
    : '';

  /* Oppgåve-input (bygt per type) */
  var inputHTML = mtBuildInput(t);

  /* Enkel veljar i manuell modus: byt mellom oppgåver i same kategori */
  var manualNavHTML = '';
  if (MTS.manualMode && Array.isArray(MTS.manualQueue) && MTS.manualQueue.length > 1) {
    var currentIx = MTS.manualQueue.indexOf(t);
    if (currentIx < 0) currentIx = 0;
    var sameCat = [];
    MTS.manualQueue.forEach(function (task, i) {
      if (task && t && task.kat === t.kat) sameCat.push({ i: i, task: task });
    });
    var options = sameCat.length > 1 ? sameCat : MTS.manualQueue.map(function (task, i) {
      return { i: i, task: task };
    });
    if (options.length > 1) {
      var optsHtml = options.map(function (o, pos) {
        var selected = o.i === currentIx ? ' selected' : '';
        var label = (pos + 1) + '. ' + mtTaskLabel(o.task);
        return '<option value="' + o.i + '"' + selected + '>' + mtEsc(label) + '</option>';
      }).join('');
      manualNavHTML =
        '<div class="mt-manual-nav" style="margin:.5rem 0 .7rem">' +
          '<label for="mt-manual-task-select" style="display:block;font-size:.78rem;font-weight:700;color:var(--tmid);margin-bottom:.35rem">Vel oppgåve i kategorien</label>' +
          '<select id="mt-manual-task-select" class="gram-blank" onchange="mtManualJump(this.value)" style="width:100%;font-size:.9rem;padding:.48rem .62rem;border:1.5px solid var(--b2,#ddd);border-radius:8px">' +
            optsHtml +
          '</select>' +
        '</div>';
    }
  }

  body.innerHTML =
    '<div class="mt-card">' +
      '<div class="mt-live">' +
        '<div class="mt-live-bar"><span id="mt-live-bar-fill"></span></div>' +
        '<div class="mt-live-top">' +
          '<div class="mt-live-progress" id="mt-live-progress">Oppgåve 1 av 1</div>' +
          '<div class="mt-live-kpis">' +
            '<span class="mt-live-pill">Poeng <strong id="mt-live-score">0</strong></span>' +
            '<span class="mt-live-pill">XP <strong id="mt-live-xp">0</strong></span>' +
            '<span class="mt-live-pill">Streak <strong id="mt-live-streak">0</strong></span>' +
          '</div>' +
        '</div>' +
        '<div class="mt-live-mastery">' +
          '<div class="mt-live-mastery-head"><span id="mt-live-mastery-icon">&#127793;</span><strong id="mt-live-mastery-name">Ordlærling</strong><span id="mt-live-mastery-trophies">0/12 trofé</span></div>' +
          '<div class="mt-live-mastery-bar"><span id="mt-live-mastery-fill"></span></div>' +
          '<div class="mt-live-mastery-text" id="mt-live-mastery-text">Til neste nivå: 80 XP</div>' +
        '</div>' +
      '</div>' +
      '<div class="mt-badges">' +
        '<span class="mt-badge mt-badge-cat">' + mtEsc(t.kat_label || t.kat) + '</span>' +
        '<span class="mt-badge mt-badge-' + (t.vanske || 'lett') + '">' + vLabel + '</span>' +
        retryBadge +
      '</div>' +
      manualNavHTML +
      ruleFirst +
      '<p class="mt-question">' + mtEsc(t.q || t.sporsmal || '') + '</p>' +
      tekstHTML +
      hintHTML +
      inputHTML +
      '<div class="mt-feedback" id="mt-feedback"></div>' +
    '</div>';

  /* Knytt sjekk-knapp og neste-knapp */
  var checkBtn = $mt('nl-ad-check');
  var nextBtn = $mt('nl-ad-next');
  if (checkBtn) { checkBtn.style.display = ''; checkBtn.disabled = false; }
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.disabled = true;
    nextBtn.textContent = 'Neste oppgåve \u2192';
  }

  /* Autofokus for tekstinput */
  var focusEl = body.querySelector('.mt-text-input');
  if (focusEl) setTimeout(function () { focusEl.focus(); }, 60);

  /* Tastaturnavigering for mc */
  if (t.type === 'mc') mtBindMcKeys();

  mtUpdateProgress();
}

/* ─── Bygg input-HTML per type ─────────────────── */

function mtBuildInput(t) {
  switch (t.type) {

  /* ── mc ── */
  case 'mc': {
    var alts = t.ikkje_stokk ? t.alt : mtShuffle(t.alt);
    var h = '<div class="mt-mc-grid">';
    alts.forEach(function (a, i) {
      h += '<button class="mt-mc-btn" data-val="' + mtEsc(a) + '" data-idx="' + i + '" onclick="mtCheckMc(this)">'
        + '<span class="mt-mc-key">' + (i + 1) + '</span>' + mtEsc(a) + '</button>';
    });
    return h + '</div>';
  }

  /* ── mcset ── */
  case 'mcset': {
    var qs = t.questions || [];
    var h = '<div class="mt-mcset">';
    qs.forEach(function (sq, qi) {
      h += '<div class="mt-mcset-q" data-qi="' + qi + '">';
      h += '<p class="mt-mcset-label">' + mtEsc(sq.q) + '</p>';
      h += '<div class="mt-mc-grid mt-mc-grid-sm">';
      var salts = sq.ikkje_stokk ? sq.alt.map(function(a,i){return{txt:a,idx:i};}) : mtShuffle(sq.alt.map(function (a, i) { return { txt: a, idx: i }; }));
      salts.forEach(function (o) {
        h += '<button class="mt-mc-btn mt-mc-sm" data-qi="' + qi + '" data-idx="' + o.idx + '" onclick="mtMcsetPick(this)">' + mtEsc(o.txt) + '</button>';
      });
      h += '</div></div>';
    });
    return h + '</div>';
  }

  /* ── cloze ── */
  case 'cloze':
    return '<div class="mt-input-row">' +
      '<input id="mt-cloze-inp" class="mt-text-input" type="text" autocomplete="off" spellcheck="false" placeholder="Skriv svaret ditt her\u2026" onkeydown="if(event.key===\'Enter\')mtTriggerCheck()">' +
      '</div>';

  /* ── open ── */
  case 'open':
    return '<div class="mt-input-row">' +
      '<textarea id="mt-open-inp" class="mt-text-input mt-textarea" rows="3" spellcheck="false" placeholder="Skriv svaret ditt her\u2026"></textarea>' +
      '</div>';

  /* ── fix ── */
  case 'fix':
    return '<div class="mt-input-row">' +
      '<p class="mt-instruction">Rett feila direkte i teksten under.</p>' +
      '<textarea id="mt-fix-inp" class="mt-text-input mt-textarea mt-mono" rows="4" spellcheck="false">' + mtEsc(t.tekst) + '</textarea>' +
      '</div>';

  /* ── fillsel ── */
  case 'fillsel': {
    var items = t.items || [];
    var h = '<div class="mt-fillsel">';
    items.forEach(function (item, fi) {
      var opts = '<option value="">\u2013 vel \u2013</option>';
      var alts = item.ikkje_stokk ? item.alt : mtShuffle(item.alt);
      alts.forEach(function (a) { opts += '<option value="' + mtEsc(a) + '">' + mtEsc(a) + '</option>'; });
      h += '<p class="mt-fillsel-line">' + mtEsc(item.pre) +
        ' <select class="mt-fill-select" data-fi="' + fi + '" data-answer="' + mtEsc(item.fasit) + '">' + opts + '</select> ' +
        mtEsc(item.post || '') + '</p>';
    });
    return h + '</div>';
  }

  /* ── finn_feil ── */
  case 'finn_feil': {
    var words = t.tekst.split(' ');
    var spans = words.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="mt-ff-word" data-i="' + i + '" data-clean="' + clean + '" onclick="mtFfClick(this)">' + mtEsc(w) + '</span>';
    }).join(' ');
    var nFeil = Array.isArray(t.fasit_feil) ? t.fasit_feil.length : '?';
    return '<div class="mt-ff">' +
      '<p class="mt-instruction">Finn <strong>' + nFeil + ' feil</strong> i teksten. Klikk på kvart feilord.</p>' +
      '<div class="mt-ff-text">' + spans + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtFfReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── klikk_marker ── */
  case 'klikk_marker': {
    var words = t.tekst.split(' ');
    var spans = words.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="mt-km-word" data-i="' + i + '" data-clean="' + clean + '" onclick="mtKmClick(this)">' + mtEsc(w) + '</span>';
    }).join(' ');
    return '<div class="mt-km">' +
      '<p class="mt-instruction">Klikk på orda som er <strong>' + mtEsc(t.maalordklasse) + '</strong>.</p>' +
      '<div class="mt-km-text">' + spans + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtKmReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── drag_kolonne ── */
  case 'drag_kolonne': {
    var cols = Array.isArray(t.kolonner) && t.kolonner.length ? t.kolonner : ['Kolonne 1', 'Kolonne 2'];
    var items = mtShuffle(t.ord.map(function (o, i) { return { tekst: typeof o === 'string' ? o : o.tekst, fasit: typeof o === 'string' ? null : o.fasit, _i: i }; }));
    var tokens = items.map(function (o) {
      return '<div class="mt-dk-token" draggable="true" data-i="' + o._i + '" data-fasit="' + o.fasit + '" data-placed="-1" onclick="mtDkMove(this)" ondragstart="mtDkDragStart(event,' + o._i + ')">' + mtEsc(o.tekst) + '</div>';
    }).join('');
    var colsHtml = cols.map(function (label, ci) {
      return '<div class="mt-dk-col mt-dk-col-' + ci + '" ondragover="event.preventDefault()" ondrop="mtDkDropCol(event,' + ci + ')"><div class="mt-dk-col-label">' + mtEsc(label) + '</div><div id="mt-dk-placed-' + ci + '" class="mt-dk-placed"></div></div>';
    }).join('');
    return '<div class="mt-dk">' +
      '<div id="mt-dk-bank" class="mt-dk-bank" ondragover="event.preventDefault()" ondrop="mtDkDropBank(event)">' + tokens + '</div>' +
      '<div class="mt-dk-cols">' +
      colsHtml +
      '</div></div>';
  }

  /* ── drag_ord ── */
  case 'drag_ord': {
    var shuffled = mtShuffle(t.ord.slice());
    var tokens = shuffled.map(function (w, i) {
      return '<button class="mt-do-token" data-w="' + mtEsc(w) + '" data-idx="' + i + '" onclick="mtDoMove(this)">' + mtEsc(w) + '</button>';
    }).join('');
    return '<div class="mt-do">' +
      '<div id="mt-do-bank" class="mt-do-bank">' + tokens + '</div>' +
      '<div id="mt-do-answer" class="mt-do-answer"><span id="mt-do-placeholder" class="mt-do-placeholder">Trykk på orda i rett rekkjefølgje\u2026</span></div>' +
      '<button class="mt-btn-secondary" onclick="mtDoReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── burger_sort ── */
  case 'burger_sort': {
    var shuffled = mtShuffle(t.avsnitt.map(function (a, i) { return { tekst: a.tekst, _i: i }; }));
    var buckets = (t.lag || []).map(function (lbl, li) {
      return '<div class="mt-bs-bucket" data-lagidx="' + li + '" ondragover="event.preventDefault()" ondrop="mtBsDrop(event,' + li + ')">' +
        '<div class="mt-bs-bucket-label">' + mtEsc(lbl) + '</div>' +
        '<div id="mt-bs-placed-' + li + '" class="mt-bs-placed"></div></div>';
    }).join('');
    var tokens = shuffled.map(function (a) {
      return '<div class="mt-bs-token" draggable="true" data-i="' + a._i + '" data-placed="-1" ondragstart="mtBsDragStart(event,' + a._i + ')" onclick="mtBsClick(this)">' + mtEsc(a.tekst) + '</div>';
    }).join('');
    return '<div class="mt-bs">' +
      '<div id="mt-bs-bank" class="mt-bs-bank">' + tokens + '</div>' +
      '<div class="mt-bs-buckets">' + buckets + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtBsReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── avsnitt_klikk ── */
  case 'avsnitt_klikk': {
    var segs = t.segments || [];
    var items = segs.map(function (seg) {
      if (!seg.first_word) return '<span class="mt-ak-text">' + mtEsc(seg.tekst) + ' </span>';
      var rest = seg.tekst.slice(seg.first_word.length);
      return '<span class="mt-ak-break" data-sid="' + seg.id + '" onclick="mtAkToggle(this,\'' + seg.id + '\')">' + mtEsc(seg.first_word) + '</span>' +
        '<span class="mt-ak-text">' + mtEsc(rest) + ' </span>';
    }).join('');
    return '<div class="mt-ak">' +
      '<p class="mt-instruction">Klikk på det <strong>første ordet</strong> i kvar setning der du vil starte eit nytt avsnitt.</p>' +
      '<div class="mt-ak-body">' + items + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtAkReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── sann_usann_serie ── */
  case 'sann_usann_serie': {
    var ps = t.paastandar || [];
    var h = '<div class="mt-su">';
    ps.forEach(function (p, pi) {
      h += '<div class="mt-su-row" data-pi="' + pi + '" data-sann="' + (p.sann ? '1' : '0') + '">' +
        '<span class="mt-su-text">' + mtEsc(p.tekst || p.p) + '</span>' +
        '<div class="mt-su-btns">' +
        '<button class="mt-su-btn" data-val="1" onclick="mtSuPick(this,' + pi + ',1)">Sann</button>' +
        '<button class="mt-su-btn" data-val="0" onclick="mtSuPick(this,' + pi + ',0)">Usann</button>' +
        '</div></div>';
    });
    return h + '</div>';
  }

  /* ── omskriv ── */
  case 'omskriv':
    return '<div class="mt-omskriv">' +
      '<div class="mt-context-text">' + mtEsc(t.tekst) + '</div>' +
      '<p class="mt-instruction">' + mtEsc(t.instruksjon || 'Skriv om teksten.') + '</p>' +
      '<textarea id="mt-omskriv-inp" class="mt-text-input mt-textarea" rows="4" spellcheck="false" placeholder="Skriv omskrivinga di her\u2026"></textarea>' +
      '</div>';

  /* ── sorter_rekke ── */
  case 'sorter_rekke': {
    var shuffled = mtShuffle(t.items.map(function (item, i) { return { tekst: item.tekst || item, _i: i }; }));
    var tokens = shuffled.map(function (item) {
      return '<div class="mt-sr-token" draggable="true" data-i="' + item._i + '" ondragstart="mtSrDragStart(event,' + item._i + ')" onclick="mtSrClick(this)">' + mtEsc(item.tekst) + '</div>';
    }).join('');
    return '<div class="mt-sr">' +
      '<p class="mt-instruction">Dra eller klikk elementa i rett rekkjefølgje.</p>' +
      '<div id="mt-sr-list" class="mt-sr-list">' + tokens + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtSrReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  /* ── Fallback → cloze ── */
  default:
    return '<div class="mt-input-row">' +
      '<input id="mt-cloze-inp" class="mt-text-input" type="text" autocomplete="off" spellcheck="false" placeholder="Skriv svaret\u2026" onkeydown="if(event.key===\'Enter\')mtTriggerCheck()">' +
      '</div>';
  }
}

/* ══════════════════════════════════════════════════════
   SJEKK-LOGIKK – per type
══════════════════════════════════════════════════════ */

function mtTriggerCheck() {
  if (MTS.answered || !MTS.current) return;
  var t = MTS.current;
  switch (t.type) {
    case 'mc': break; /* mc har eigen onclick */
    case 'mcset': mtCheckMcset(); break;
    case 'cloze': mtCheckCloze(); break;
    case 'open': mtCheckOpen(); break;
    case 'fix': mtCheckFix(); break;
    case 'fillsel': mtCheckFillsel(); break;
    case 'finn_feil': mtCheckFf(); break;
    case 'klikk_marker': mtCheckKm(); break;
    case 'drag_kolonne': mtCheckDk(); break;
    case 'drag_ord': mtCheckDo(); break;
    case 'burger_sort': mtCheckBs(); break;
    case 'avsnitt_klikk': mtCheckAk(); break;
    case 'sann_usann_serie': mtCheckSu(); break;
    case 'omskriv': mtCheckOmskriv(); break;
    case 'sorter_rekke': mtCheckSr(); break;
    default: mtCheckCloze(); break;
  }
}

/* ── mc ── */
function mtCheckMc(btn) {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var chosen = btn.getAttribute('data-val');
  var correct = mtIsCorrect(chosen, t);
  document.querySelectorAll('.mt-mc-btn').forEach(function (b) {
    b.disabled = true;
    var v = b.getAttribute('data-val');
    if (v === chosen) b.className = 'mt-mc-btn ' + (correct ? 'mt-correct' : 'mt-wrong');
    if (!correct && mtIsCorrect(v, t)) b.className = 'mt-mc-btn mt-correct';
  });
  mtFinish(correct, 1, correct ? 1 : 0, chosen, t);
}

/* ── mcset (delvis poeng) ── */
var _mcsetPicks = {};
function mtMcsetPick(btn) {
  if (MTS.answered) return;
  var qi = btn.getAttribute('data-qi');
  _mcsetPicks[qi] = parseInt(btn.getAttribute('data-idx'), 10);
  document.querySelectorAll('.mt-mc-btn[data-qi="' + qi + '"]').forEach(function (b) {
    b.classList.toggle('mt-selected', b === btn);
  });
}
function mtCheckMcset() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var qs = t.questions || [];
  var hits = 0;
  qs.forEach(function (sq, qi) {
    var pick = _mcsetPicks[qi];
    var ok = pick === sq.fasit;
    if (ok) hits++;
    document.querySelectorAll('.mt-mc-btn[data-qi="' + qi + '"]').forEach(function (b) {
      b.disabled = true;
      var idx = parseInt(b.getAttribute('data-idx'), 10);
      if (idx === pick) b.className = 'mt-mc-btn mt-mc-sm ' + (ok ? 'mt-correct' : 'mt-wrong');
      if (!ok && idx === sq.fasit) b.className = 'mt-mc-btn mt-mc-sm mt-correct';
    });
  });
  _mcsetPicks = {};
  var maxPts = qs.length;
  mtFinish(hits === maxPts, maxPts, hits, hits + ' av ' + maxPts + ' rette', t);
}

/* ── cloze ── */
function mtCheckCloze() {
  if (MTS.answered) return;
  var el = $mt('mt-cloze-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  var correct = mtIsCorrect(val, t);
  el.disabled = true;
  el.className = 'mt-text-input ' + (correct ? 'mt-inp-correct' : 'mt-inp-wrong');
  var feedback = correct ? null : mtSmartFeedback(val, t);
  mtFinish(correct, 1, correct ? 1 : 0, val, t, feedback);
}

/* ── open ── */
/* ── fagord-liste for open/omskriv XP-bonus ── */
var MT_FAGORD = [
  'argumentere','drøfte','påstand','grunngje','konklusjon','konsekvens','årsak','verknad',
  'perspektiv','hypotese','analyse','analysere','kjelde','kjeldebruk','referere','parafrase',
  'sitat','dokumentere','etterprøvbar','truverdig','truverde','reliabilitet','validitet',
  'fagomgrep','relevant','samanlikne','kontrastere','vurdere','strategi','metode',
  'innleiing','hovuddel','avslutting','drøfting','argumentasjon','motargument',
  'retorisk','ethos','pathos','logos','mottakar','formål','sjanger','teksttype',
  'koherens','samanheng','avsnitt','temasetning','disposisjon','struktur'
];

function mtDetectFagord(text) {
  var lower = text.toLowerCase();
  var found = [];
  MT_FAGORD.forEach(function(w) {
    if (lower.indexOf(w) !== -1 && found.indexOf(w) === -1) found.push(w);
  });
  return found;
}

function mtIsGibberish(text) {
  /* Heuristikk: for kort, berre same bokstav, eller ingen vokal */
  var trimmed = text.trim();
  if (trimmed.length < 8) return true;
  var words = trimmed.split(/\s+/);
  if (words.length < 2) return true;
  /* Sjekk at det finst minst ein vokal */
  if (!/[aeiouyæøå]/i.test(trimmed)) return true;
  /* Sjekk gjentaking: same teikn >60% */
  var freq = {};
  for (var i = 0; i < trimmed.length; i++) {
    var c = trimmed[i].toLowerCase();
    freq[c] = (freq[c] || 0) + 1;
  }
  var maxFreq = 0;
  for (var k in freq) { if (freq[k] > maxFreq) maxFreq = freq[k]; }
  if (maxFreq / trimmed.length > 0.6) return true;
  return false;
}

function mtCheckOpen() {
  if (MTS.answered) return;
  var el = $mt('mt-open-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  el.disabled = true;

  /* Gibberish-sjekk → 0 XP */
  if (mtIsGibberish(val)) {
    el.className = 'mt-text-input mt-textarea mt-inp-wrong';
    mtFinish(false, 1, 0, val, t, 'Svaret ser ikkje ut til å vere eit skikkeleg forsøk. Prøv å skrive eit ordentleg svar.', true);
    return;
  }

  /* Fagord-bonus */
  var fagord = mtDetectFagord(val);
  var extra = null;
  if (fagord.length >= 2) {
    extra = 'Flott fagspråk! Du brukte: ' + fagord.join(', ');
  } else if (fagord.length === 1) {
    extra = 'Bra, du brukte fagomgrepet «' + fagord[0] + '».';
  }

  el.className = 'mt-text-input mt-textarea mt-inp-neutral';
  mtFinish(true, 1, 1, val, t, extra, true);
}

/* ── fix ── */
function mtCheckFix() {
  if (MTS.answered) return;
  var el = $mt('mt-fix-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  var errors = t.errors || {};
  var keys = Object.keys(errors);
  var hits = 0;
  keys.forEach(function (wrong) {
    var right = errors[wrong];
    if (val.indexOf(right) !== -1 && val.indexOf(wrong) === -1) hits++;
  });
  var correct = hits === keys.length;
  var partial = !correct && hits > 0;
  el.disabled = true;
  el.className = 'mt-text-input mt-textarea mt-mono ' + (correct ? 'mt-inp-correct' : (partial ? 'mt-inp-neutral' : 'mt-inp-wrong'));
  var feedback = correct ? null : mtSmartFeedback(val, t);
  mtFinish(correct, keys.length, hits, val, t, feedback);

  if (!correct) {
    var fb = $mt('mt-feedback');
    if (fb) fb.innerHTML += mtBuildFixCorrectionHtml(t);
  }
}

/* ── fillsel (delvis poeng) ── */
function mtCheckFillsel() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var sels = document.querySelectorAll('.mt-fill-select');
  var hits = 0, total = sels.length;
  sels.forEach(function (sel) {
    var answer = sel.getAttribute('data-answer');
    var ok = mtNorm(sel.value) === mtNorm(answer);
    if (ok) hits++;
    sel.disabled = true;
    sel.className = 'mt-fill-select ' + (ok ? 'mt-inp-correct' : 'mt-inp-wrong');
  });
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' rette', t);

  var fb = $mt('mt-feedback');
  if (fb) fb.innerHTML += mtBuildFillselCorrectionHtml(t, Array.prototype.slice.call(sels));
}

/* ── finn_feil (delvis poeng) ── */
function mtFfClick(el) {
  if (MTS.answered) return;
  el.classList.toggle('mt-ff-sel');
}
function mtFfReset() {
  if (MTS.answered) return;
  document.querySelectorAll('.mt-ff-word').forEach(function (el) { el.classList.remove('mt-ff-sel'); });
}
function mtCheckFf() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var feil = (t.fasit_feil || []).map(function (w) { return w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase(); });
  var words = document.querySelectorAll('.mt-ff-word');
  var hits = 0, falsePos = 0;
  words.forEach(function (el) {
    var clean = el.dataset.clean;
    var target = feil.indexOf(clean) !== -1;
    var sel = el.classList.contains('mt-ff-sel');
    if (target && sel) { el.className = 'mt-ff-word mt-ff-hit'; hits++; }
    else if (target && !sel) { el.className = 'mt-ff-word mt-ff-missed'; }
    else if (!target && sel) { el.className = 'mt-ff-word mt-ff-false'; falsePos++; }
    el.style.cursor = 'default';
  });
  var maxPts = feil.length;
  var pts = Math.max(0, hits - falsePos);
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' feil funne', t);
}

/* ── klikk_marker (delvis poeng) ── */
function mtKmClick(el) {
  if (MTS.answered) return;
  el.classList.toggle('mt-km-sel');
}
function mtKmReset() {
  if (MTS.answered) return;
  document.querySelectorAll('.mt-km-word').forEach(function (el) { el.classList.remove('mt-km-sel'); });
}
function mtCheckKm() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var src = t.fasit_ord || t.fasit_v || t.fasit_feil || [];
  var targets = (Array.isArray(src) ? src : [src]).map(function (w) { return String(w).replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase(); });
  var words = document.querySelectorAll('.mt-km-word');
  var hits = 0, falsePos = 0;
  words.forEach(function (el) {
    var clean = el.dataset.clean;
    var target = targets.indexOf(clean) !== -1;
    var sel = el.classList.contains('mt-km-sel');
    if (target && sel) { el.className = 'mt-km-word mt-km-hit'; hits++; }
    else if (target && !sel) { el.className = 'mt-km-word mt-km-missed'; }
    else if (!target && sel) { el.className = 'mt-km-word mt-km-false'; falsePos++; }
    el.style.cursor = 'default';
  });
  var maxPts = targets.length;
  var pts = Math.max(0, hits - falsePos);
  if (!t.fasit) t.fasit = targets.join(', ');
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' rette', t);
}

/* ── drag_kolonne ── */
var _dkDrag = -1;
function mtDkDragStart(ev, idx) { _dkDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtDkMove(el) {
  if (MTS.answered) return;
  var colCount = 0;
  if (MTS.current && Array.isArray(MTS.current.kolonner) && MTS.current.kolonner.length) colCount = MTS.current.kolonner.length;
  if (!colCount) colCount = document.querySelectorAll('.mt-dk-col').length;
  if (!colCount) colCount = 2;

  var p = parseInt(el.getAttribute('data-placed'), 10);
  if (p < 0) {
    var c0 = document.getElementById('mt-dk-placed-0');
    if (c0) { c0.appendChild(el); el.setAttribute('data-placed', '0'); }
    return;
  }

  var next = p + 1;
  if (next < colCount) {
    var cn = document.getElementById('mt-dk-placed-' + next);
    if (cn) { cn.appendChild(el); el.setAttribute('data-placed', String(next)); }
  } else {
    var b = document.getElementById('mt-dk-bank');
    if (b) { b.appendChild(el); el.setAttribute('data-placed', '-1'); }
  }
}
function mtDkDropCol(ev, ci) {
  ev.preventDefault(); if (MTS.answered) return;
  var tok = document.querySelector('.mt-dk-token[data-i="' + _dkDrag + '"]');
  if (!tok) return;
  var tgt = document.getElementById('mt-dk-placed-' + ci);
  if (tgt) { tgt.appendChild(tok); tok.setAttribute('data-placed', String(ci)); }
}
function mtDkDropBank(ev) {
  ev.preventDefault(); if (MTS.answered) return;
  var tok = document.querySelector('.mt-dk-token[data-i="' + _dkDrag + '"]');
  if (!tok) return;
  var b = document.getElementById('mt-dk-bank');
  if (b) { b.appendChild(tok); tok.setAttribute('data-placed', '-1'); }
}
function mtCheckDk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var toks = document.querySelectorAll('.mt-dk-token');
  var hits = 0, total = toks.length;
  toks.forEach(function (el) {
    var placed = parseInt(el.getAttribute('data-placed'), 10);
    var fasit = parseInt(el.getAttribute('data-fasit'), 10);
    var ok = placed === fasit;
    if (ok) hits++;
    el.className = 'mt-dk-token ' + (ok ? 'mt-correct' : 'mt-wrong');
    el.setAttribute('draggable', 'false'); el.onclick = null;
  });
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' rette', t);
}

/* ── drag_ord ── */
function mtDoMove(btn) {
  if (MTS.answered) return;
  var answer = document.getElementById('mt-do-answer');
  var bank = document.getElementById('mt-do-bank');
  var ph = document.getElementById('mt-do-placeholder');
  if (!answer || !bank) return;
  if (btn.parentNode === bank) {
    if (ph) ph.style.display = 'none';
    answer.appendChild(btn); btn.classList.add('mt-do-placed');
  } else {
    bank.appendChild(btn); btn.classList.remove('mt-do-placed');
    if (!answer.querySelector('.mt-do-token')) { if (ph) ph.style.display = ''; }
  }
}
function mtDoReset() {
  if (MTS.answered) return;
  var answer = document.getElementById('mt-do-answer');
  var bank = document.getElementById('mt-do-bank');
  var ph = document.getElementById('mt-do-placeholder');
  if (!answer || !bank) return;
  answer.querySelectorAll('.mt-do-token').forEach(function (b) { bank.appendChild(b); b.classList.remove('mt-do-placed'); });
  if (ph) ph.style.display = '';
}
function mtCheckDo() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var box = document.getElementById('mt-do-answer');
  var toks = box ? box.querySelectorAll('.mt-do-token') : [];
  var attempt = [];
  toks.forEach(function (b) { attempt.push(b.getAttribute('data-w')); });
  var student = attempt.join(' ');
  var correct = mtNorm(student) === mtNorm(String(t.fasit));
  toks.forEach(function (b) { b.disabled = true; b.className = 'mt-do-token ' + (correct ? 'mt-correct' : 'mt-wrong'); });
  mtFinish(correct, 1, correct ? 1 : 0, student, t);
}

/* ── burger_sort ── */
var _bsDrag = -1;
function mtBsDragStart(ev, idx) { _bsDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtBsClick(el) {
  if (MTS.answered) return;
  var t = MTS.current;
  var p = parseInt(el.getAttribute('data-placed'), 10);
  var nB = (t.lag || []).length;
  if (p === -1) { var tgt = document.getElementById('mt-bs-placed-0'); if (tgt) { tgt.appendChild(el); el.setAttribute('data-placed', '0'); } }
  else if (p < nB - 1) { var tgt = document.getElementById('mt-bs-placed-' + (p + 1)); if (tgt) { tgt.appendChild(el); el.setAttribute('data-placed', String(p + 1)); } }
  else { var b = document.getElementById('mt-bs-bank'); if (b) { b.appendChild(el); el.setAttribute('data-placed', '-1'); } }
}
function mtBsDrop(ev, bi) {
  ev.preventDefault(); if (MTS.answered) return;
  var tok = document.querySelector('.mt-bs-token[data-i="' + _bsDrag + '"]');
  if (!tok) return;
  var tgt = document.getElementById('mt-bs-placed-' + bi);
  if (tgt) { tgt.appendChild(tok); tok.setAttribute('data-placed', String(bi)); }
}
function mtBsReset() {
  if (MTS.answered) return;
  var b = document.getElementById('mt-bs-bank');
  if (!b) return;
  document.querySelectorAll('.mt-bs-token').forEach(function (el) { b.appendChild(el); el.setAttribute('data-placed', '-1'); });
}
function mtCheckBs() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var toks = document.querySelectorAll('.mt-bs-token');
  var hits = 0, total = toks.length;
  toks.forEach(function (el) {
    var placed = parseInt(el.getAttribute('data-placed'), 10);
    var origIdx = parseInt(el.getAttribute('data-i'), 10);
    var fasit = t.avsnitt[origIdx] ? t.avsnitt[origIdx].lag : -1;
    var ok = placed === fasit;
    if (ok) hits++;
    el.className = 'mt-bs-token ' + (ok ? 'mt-correct' : 'mt-wrong');
    el.setAttribute('draggable', 'false'); el.onclick = null;
  });
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' rette', t);
}

/* ── avsnitt_klikk ── */
var _akSel = {};
function mtAkToggle(el, sid) {
  if (MTS.answered) return;
  if (_akSel[sid]) { delete _akSel[sid]; el.classList.remove('mt-ak-on'); }
  else { _akSel[sid] = true; el.classList.add('mt-ak-on'); }
}
function mtAkReset() {
  if (MTS.answered) return;
  _akSel = {};
  document.querySelectorAll('.mt-ak-break').forEach(function (el) { el.classList.remove('mt-ak-on'); });
}
function mtCheckAk() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var fasitSet = {};
  (t.fasit_breaks || []).forEach(function (sid) { fasitSet[sid] = true; });
  var segs = t.segments || [];
  var hits = 0, falsePos = 0;
  segs.forEach(function (seg) {
    if (!seg.first_word) return;
    var el = document.querySelector('.mt-ak-break[data-sid="' + seg.id + '"]');
    if (!el) return;
    var target = !!fasitSet[seg.id];
    var sel = !!_akSel[seg.id];
    if (target && sel) { el.className = 'mt-ak-break mt-ak-hit'; hits++; }
    else if (target && !sel) { el.className = 'mt-ak-break mt-ak-missed'; }
    else if (!target && sel) { el.className = 'mt-ak-break mt-ak-false'; falsePos++; }
    el.style.cursor = 'default'; el.onclick = null;
  });
  _akSel = {};
  var maxPts = Object.keys(fasitSet).length;
  var pts = Math.max(0, hits - falsePos);
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' rette', t);
}

/* ── sann_usann_serie (delvis poeng) ── */
var _suPicks = {};
function mtSuPick(btn, pi, val) {
  if (MTS.answered) return;
  _suPicks[pi] = val;
  document.querySelectorAll('.mt-su-row[data-pi="' + pi + '"] .mt-su-btn').forEach(function (b) {
    b.classList.toggle('mt-selected', parseInt(b.getAttribute('data-val'), 10) === val);
  });
}
function mtCheckSu() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var ps = t.paastandar || [];
  var hits = 0;
  ps.forEach(function (p, pi) {
    var row = document.querySelector('.mt-su-row[data-pi="' + pi + '"]');
    if (!row) return;
    var picked = _suPicks[pi];
    var fasit = p.sann ? 1 : 0;
    var ok = picked === fasit;
    if (ok) hits++;
    row.className = 'mt-su-row ' + (ok ? 'mt-su-ok' : 'mt-su-wrong');
    row.querySelectorAll('.mt-su-btn').forEach(function (b) { b.disabled = true; });
  });
  _suPicks = {};
  var maxPts = ps.length;
  mtFinish(hits === maxPts, maxPts, hits, hits + ' av ' + maxPts + ' rette', t);
}

/* ── omskriv ── */
function mtCheckOmskriv() {
  if (MTS.answered) return;
  var el = $mt('mt-omskriv-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  el.disabled = true;

  /* Sjekk maa_ha / maa_ikkje_ha */
  var lower = val.toLowerCase();
  var ok = true;
  var missing = [];
  (t.maa_ha || []).forEach(function (kw) {
    if (lower.indexOf(kw.toLowerCase()) === -1) { ok = false; missing.push(kw); }
  });
  (t.maa_ikkje_ha || []).forEach(function (kw) {
    if (lower.indexOf(kw.toLowerCase()) !== -1) ok = false;
  });

  el.className = 'mt-text-input mt-textarea ' + (ok ? 'mt-inp-correct' : 'mt-inp-wrong');

  var extra = null;
  if (!ok && missing.length) extra = 'Hugs å bruke: ' + missing.join(', ');

  /* Fagord-bonus for omskriv */
  var fagord = mtDetectFagord(val);
  if (ok && fagord.length >= 2) {
    extra = 'Flott fagspråk! Du brukte: ' + fagord.join(', ');
  } else if (ok && fagord.length === 1) {
    extra = (extra ? extra + ' ' : '') + 'Bra, du brukte fagomgrepet «' + fagord[0] + '».';
  }

  mtFinish(ok, 1, ok ? 1 : 0, val, t, extra);
}

/* ── sorter_rekke ── */
var _srDrag = -1;
function mtSrDragStart(ev, idx) { _srDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtSrClick(el) {
  if (MTS.answered) return;
  var list = document.getElementById('mt-sr-list');
  if (!list) return;
  /* Flytt til neste posisjon (roter nedover) */
  if (el.nextSibling) list.insertBefore(el.nextSibling, el);
  else list.insertBefore(el, list.firstChild);
}
function mtSrReset() {
  if (MTS.answered) return;
  /* TODO: lagre originalrekkjefølgje og gjenopprett */
}
function mtCheckSr() {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var toks = document.querySelectorAll('.mt-sr-token');
  var hits = 0;
  toks.forEach(function (el, pos) {
    var origIdx = parseInt(el.getAttribute('data-i'), 10);
    var ok = origIdx === pos;
    if (ok) hits++;
    el.className = 'mt-sr-token ' + (ok ? 'mt-correct' : 'mt-wrong');
    el.setAttribute('draggable', 'false'); el.onclick = null;
  });
  var total = toks.length;
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' i rett rekkjefølgje', t);
}

/* ══════════════════════════════════════════════════════
   FELLES FASIT-SJEKK
══════════════════════════════════════════════════════ */

function mtIsCorrect(val, t) {
  var v = mtNorm(val);
  var variants = Array.isArray(t.fasit_v) && t.fasit_v.length ? t.fasit_v : [t.fasit];
  return variants.some(function (f) { return mtNorm(f) === v; });
}

/* Smart tilbakemelding: vanlege_feil → Levenshtein → generisk */
function mtSmartFeedback(chosen, t) {
  /* 1) Sjekk vanlege_feil */
  if (Array.isArray(t.vanlege_feil)) {
    var low = mtNorm(chosen);
    for (var i = 0; i < t.vanlege_feil.length; i++) {
      var vf = t.vanlege_feil[i];
      if (mtNorm(vf.feil) === low) return vf.melding;
    }
  }
  /* 2) Levenshtein-nærleik */
  var fasit = t.fasit || '';
  var dist = mtLevenshtein(chosen, fasit);
  if (dist === 1) return 'Nesten! Sjekk stavinga nøye.';
  if (dist === 2) return 'Du er veldig nær! Samanlikn med fasiten.';
  /* 3) Sjekk og/å-forveksling */
  var c = mtNorm(chosen), f = mtNorm(fasit);
  if (c.replace(/\bog\b/g, 'å') === f || c.replace(/\bå\b/g, 'og') === f) {
    return 'Du har forveksla og/å. Hugseregel: Kan du byte med «og» → skriv «og». Elles → «å».';
  }
  return null;
}

/* ══════════════════════════════════════════════════════
   TILBAKEMELDING OG POENG
══════════════════════════════════════════════════════ */

function mtFinish(correct, maxPts, pts, chosen, t, extraMsg, isOpenType) {
  /* Oppdater poeng */
  MTS.score += pts;
  MTS.maxScore += maxPts;
  if (correct) MTS.streak++; else MTS.streak = 0;

  /* Tidsbruk */
  var elapsed = Date.now() - MTS.taskStart;

  /* Kategorihistorikk (siste 5) */
  if (!MTS.catHistory[t.kat]) MTS.catHistory[t.kat] = [];
  MTS.catHistory[t.kat].push(correct);
  if (MTS.catHistory[t.kat].length > 5) MTS.catHistory[t.kat].shift();

  /* Feiltype-logging */
  if (!correct && t.feiltype) {
    if (!MTS.feilLog[t.feiltype]) MTS.feilLog[t.feiltype] = 0;
    MTS.feilLog[t.feiltype]++;
  }

  /* Retry-kø: legg til ved feil (ikkje i manuell modus) */
  if (!MTS.manualMode && !correct && !t._isRetry) {
    MTS.retryQueue.push(t);
  }

  /* Feillogg – lagre til localStorage */
  if (!correct) {
    mtFeilloggPush(t, chosen);
  }

  /* Retry-win teljar for badges */
  if (t._isRetry && correct) {
    mtBadgesCountRetryWin();
  }

  /* XP */
  var earnedXP = mtXpCalc(correct, pts, maxPts, t.vanske, MTS.streak, !!t._isRetry);

  /* Fagord-bonus for open / omskriv-svar */
  if (correct && typeof chosen === 'string' && (t.type === 'open' || t.type === 'omskriv')) {
    var fagordHit = mtDetectFagord(chosen);
    var fagBonus = Math.min(fagordHit.length * 3, 12);
    earnedXP += fagBonus;
  }

  MTS.sessionXP += earnedXP;

  if (correct && earnedXP > 0) {
    var xpAnchor = ($mt('mt-live-xp') && $mt('mt-live-xp').parentElement) || document.querySelector('#nl-ad-win-body .mt-live-kpis') || $mt('nl-ad-win-body');
    mtFxSpawnFloat(xpAnchor, '+' + earnedXP + ' XP', MTS.streak >= 5 || earnedXP >= 20);
    mtFxFlashCard();
    if (MTS.streak >= 3) {
      mtFxSpawnSparks(xpAnchor, MTS.streak >= 5 ? 14 : 8);
      mtFxGlowHeaderStreak();
    }
  }

  /* Lagre i history */
  MTS.history.push({
    task: t,
    correct: correct,
    points: pts,
    maxPts: maxPts,
    time: elapsed,
    isRetry: !!t._isRetry
  });

  /* Bygg tilbakemelding */
  var fb = $mt('mt-feedback');
  if (!fb) return;

  var isPartial = !correct && pts > 0;
  var cls = correct ? 'mt-fb-correct' : (isPartial ? 'mt-fb-partial' : 'mt-fb-wrong');
  fb.className = 'mt-feedback ' + cls;

  var html = '';

  if (isOpenType) {
    /* Opne svar: vis modellsvar */
    html += '<div class="mt-fb-heading">&#128221; Takk for svaret!</div>';
    if (t.eksempel_svak || t.eksempel_god) {
      html += '<div class="mt-fb-models">';
      if (t.eksempel_svak) html += '<div class="mt-fb-model mt-fb-model-weak"><div class="mt-fb-model-label">Kan bli betre</div>' + mtEsc(t.eksempel_svak) + '</div>';
      if (t.eksempel_god) html += '<div class="mt-fb-model mt-fb-model-good"><div class="mt-fb-model-label">Sterk formulering</div>' + mtEsc(t.eksempel_god) + '</div>';
      html += '</div>';
    }
  } else if (correct) {
    html += '<div class="mt-fb-heading">&#10003; Rett!</div>';
    if (maxPts > 1) html += '<div class="mt-fb-detail">' + mtEsc(String(chosen)) + '</div>';
    /* Streak-melding */
    if (MTS.streak >= 5) html += '<div class="mt-fb-streak">&#128293; ' + MTS.streak + ' på rad!</div>';
    else if (MTS.streak === 3) html += '<div class="mt-fb-streak">&#11088; 3 på rad – flott!</div>';
  } else {
    html += '<div class="mt-fb-heading">&#10007; ' + (isPartial ? 'Delvis rett' : 'Feil') + '</div>';
    if (maxPts > 1 && typeof chosen === 'string') html += '<div class="mt-fb-detail">' + mtEsc(chosen) + '</div>';
    if (!isPartial && t.fasit) html += '<div class="mt-fb-fasit">Rett svar: <strong>' + mtEsc(t.fasit) + '</strong></div>';
    if (extraMsg) html += '<div class="mt-fb-extra">' + mtEsc(extraMsg) + '</div>';
  }

  /* forklaring-felt (alltid vist) */
  if (t.forklaring) html += '<div class="mt-fb-forklaring">' + mtEsc(t.forklaring) + '</div>';

  /* Regel (ved feil) */
  if (!correct && t.regel) html += '<div class="mt-fb-rule"><strong>&#128218; Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  if (!correct && t.eks) html += '<div class="mt-fb-eks"><strong>&#128221; Døme:</strong> ' + mtEsc(t.eks) + '</div>';

  /* Retry-tips */
  if (!correct && !t._isRetry) html += '<div class="mt-fb-retry-tip">Denne oppgåva kjem att seinare i økta &#128260;</div>';
  if (t._isRetry && correct) html += '<div class="mt-fb-retry-win">&#127881; Du klarte det på andre forsøk! Godt lært!</div>';

  /* XP-badge i tilbakemelding */
  if (earnedXP > 0) html += '<div class="mt-fb-xp">+' + earnedXP + ' XP</div>';

  fb.innerHTML = html;
  fb.style.display = 'block';

  /* Vis neste-knapp, gøym sjekk-knapp */
  var checkBtn = $mt('nl-ad-check');
  var nextBtn = $mt('nl-ad-next');
  if (checkBtn) checkBtn.style.display = 'none';
  if (nextBtn) {
    var isLast = MTS.served >= MTS.targetCount && !MTS.retryQueue.length;
    nextBtn.textContent = isLast ? 'Sjå resultat \u2192' : 'Neste oppgåve \u2192';
    nextBtn.disabled = false;
    nextBtn.style.display = '';
  }

  mtUpdateProgress();
}

/* ══════════════════════════════════════════════════════
   NAVIGASJON
══════════════════════════════════════════════════════ */

function mtNext() {
  if (!MTS.answered && MTS.current) {
    /* Auto-sjekk ubesvarte tekstfelt */
    var t = MTS.current;
    if (t.type === 'cloze') {
      var el = $mt('mt-cloze-inp');
      if (el && el.value.trim()) { mtCheckCloze(); return; }
    } else if (t.type === 'fix') {
      var el = $mt('mt-fix-inp');
      if (el && el.value.trim() !== t.tekst) { mtCheckFix(); return; }
    } else if (t.type === 'omskriv') {
      var el = $mt('mt-omskriv-inp');
      if (el && el.value.trim()) { mtCheckOmskriv(); return; }
    }
    /* Hoppa over utan poeng */
    MTS.answered = true;
    MTS.history.push({ task: t, correct: false, points: 0, maxPts: 1, time: Date.now() - MTS.taskStart, isRetry: !!t._isRetry });
    MTS.maxScore += 1;
  }
  mtServeNext();
}

function mtManualJump(startIndex) {
  if (!MTS.manualMode || !Array.isArray(MTS.manualQueue) || !MTS.manualQueue.length) return;
  var start = Number(startIndex);
  if (!Number.isFinite(start) || start < 0 || start >= MTS.manualQueue.length) return;

  if (MTS.history.length > 0) {
    var ok = window.confirm('Bytte oppgåve startar den manuelle økta på nytt. Vil du halde fram?');
    if (!ok) {
      mtRenderTask(MTS.current || MTS.manualQueue[0], !!(MTS.current && MTS.current._isRetry));
      return;
    }
  }

  var ordered = MTS.manualQueue.slice(start).concat(MTS.manualQueue.slice(0, start));
  var cats = [];
  ordered.forEach(function (task) {
    if (task && cats.indexOf(task.kat) === -1) cats.push(task.kat);
  });

  mtResetSessionState({
    pool: [],
    targetCount: ordered.length,
    level: 'manuell',
    selectedCats: cats,
    manualMode: true,
    manualQueue: ordered
  });
  mtOpenSessionUi();
  mtUpdateProgress();
  mtServeNext();
}

/* ══════════════════════════════════════════════════════
   OPPSUMMERING
══════════════════════════════════════════════════════ */

function mtShowSummary() {
  MTS.active = false;

  /* Lagre XP til localStorage */
  var prevXP = mtXpGetTotal();
  var prevLvl = mtXpLevel(prevXP);
  var newTotalXP = mtXpSave(MTS.sessionXP);
  var newLvl = mtXpLevel(newTotalXP);
  var leveledUp = newLvl.index > prevLvl.index;

  /* Registrer dagleg streak */
  var streak = mtStreakRegister();
  mtUpdateHeaderProfile(newTotalXP, streak.current);
  if (leveledUp) {
    mtFxLevelUpFlash();
    mtFxModalConfetti();
  }

  /* Lagre til localStorage */
  mtLsSaveSession();

  /* Sjekk badges */
  var sessionCtx = { pct: MTS.maxScore > 0 ? Math.round(MTS.score / MTS.maxScore * 100) : 0, level: MTS.level };
  var newBadges = mtBadgesCheck(sessionCtx);

  var total = MTS.history.length;
  var rett = MTS.history.filter(function (h) { return h.correct; }).length;
  var feil = total - rett;
  var pct = MTS.maxScore > 0 ? Math.round(MTS.score / MTS.maxScore * 100) : 0;
  var retries = MTS.history.filter(function (h) { return h.isRetry; });
  var retriesWon = retries.filter(function (h) { return h.correct; });

  /* Medalje */
  var medal = pct >= 90 ? '&#127942;' : pct >= 70 ? '&#127941;' : pct >= 50 ? '&#128170;' : '&#128218;';
  var medalEl = $mt('nl-ad-sum-medal');
  if (medalEl) medalEl.innerHTML = medal;

  /* Ring-animasjon */
  var ring = $mt('nl-ad-ring');
  var ringPct = $mt('nl-ad-ring-pct');
  if (ring) {
    var circumference = 2 * Math.PI * 42;
    var offset = circumference * (1 - pct / 100);
    setTimeout(function () { ring.style.strokeDashoffset = String(offset); }, 50);
  }
  if (ringPct) ringPct.textContent = pct + '%';

  /* KPI */
  var poengEl = $mt('nl-ad-sum-poeng');
  var retteEl = $mt('nl-ad-sum-rette');
  var feilEl = $mt('nl-ad-sum-feil');
  var xpEl   = $mt('nl-ad-sum-xp');
  if (poengEl) poengEl.textContent = MTS.score + '/' + MTS.maxScore;
  if (retteEl) retteEl.textContent = String(rett);
  if (feilEl) feilEl.textContent = String(feil);
  if (xpEl)   xpEl.textContent = '+' + MTS.sessionXP;

  /* Kommentar */
  var commentEl = $mt('nl-ad-sum-comment');
  if (commentEl) {
    var msgs = [
      [90, 'Framifrå! Du meistrar dette svært godt.'],
      [70, 'Bra jobba! Du er på god veg.'],
      [50, 'Greitt! Øv litt meir på dei vanskelege oppgåvene.'],
      [0, 'Ikkje gi opp \u2013 prøv igjen!']
    ];
    var msg = msgs[msgs.length - 1][1];
    for (var m = 0; m < msgs.length; m++) { if (pct >= msgs[m][0]) { msg = msgs[m][1]; break; } }

    /* Retry-ros */
    if (retriesWon.length > 0) {
      msg += ' Du klarte ' + retriesWon.length + ' av ' + retries.length + ' oppgåve' + (retries.length > 1 ? 'r' : '') + ' på nytt \u2013 det viser at du har lært!';
    }

    commentEl.textContent = msg;
  }

  /* Styrkar */
  var strengthsEl = $mt('nl-ad-sum-strengths');
  if (strengthsEl) {
    var catStats = {};
    MTS.history.forEach(function (h) {
      var k = h.task.kat_label || h.task.kat;
      if (!catStats[k]) catStats[k] = { rett: 0, total: 0 };
      catStats[k].total++;
      if (h.correct) catStats[k].rett++;
    });
    var strong = [], weak = [];
    Object.keys(catStats).forEach(function (k) {
      var s = catStats[k];
      var p = Math.round(s.rett / s.total * 100);
      if (p >= 70) strong.push({ cat: k, pct: p });
      else weak.push({ cat: k, pct: p });
    });
    if (strong.length) {
      var html = '<h5>Styrkar</h5>';
      strong.forEach(function (r) { html += '<div class="adp-summary-row ok"><strong>' + mtEsc(r.cat) + '</strong><span>' + r.pct + '%</span></div>'; });
      strengthsEl.innerHTML = html;
      strengthsEl.style.display = '';
    } else {
      strengthsEl.innerHTML = '';
      strengthsEl.style.display = 'none';
    }

    /* Øvingsråd */
    var rettingEl = $mt('nl-ad-sum-retting');
    if (rettingEl) {
      if (!weak.length) {
        rettingEl.innerHTML = '<div class="adp-summary-row ok"><strong>Null feil!</strong> Du klarte alle oppgåvene \u2013 godt jobba!</div>';
      } else {
        var html2 = '<h5>Øv meir på desse</h5>';
        weak.sort(function (a, b) { return a.pct - b.pct; });
        weak.forEach(function (r) { html2 += '<div class="adp-summary-row"><strong>' + mtEsc(r.cat) + '</strong><span>' + r.pct + '%</span></div>'; });
        /* Konkret framovermelding */
        html2 += '<p class="mt-sum-advice">Tips: Start eit nytt sett med ' + mtEsc(weak[0].cat) + ' for å bli tryggare.</p>';
        rettingEl.innerHTML = html2;
      }
    }

    /* Feiltype-oppsummering */
    var feilKeys = Object.keys(MTS.feilLog);
    if (feilKeys.length && rettingEl) {
      var fhtml = '<h5 style="margin-top:.7rem">Typiske feil</h5>';
      feilKeys.sort(function (a, b) { return MTS.feilLog[b] - MTS.feilLog[a]; });
      feilKeys.forEach(function (ft) {
        fhtml += '<div class="adp-summary-row"><strong>' + mtEsc(ft) + '</strong><span>' + MTS.feilLog[ft] + ' gonger</span></div>';
      });
      rettingEl.innerHTML += fhtml;
    }
  }

  /* ═══ GAMIFICATION-PANEL ═══ */
  var sumEl = $mt('nl-ad-summary');
  if (sumEl) {
    /* Fjern tidlegare gamification-panel */
    var old = sumEl.querySelector('.mt-gami-panel');
    if (old) old.remove();

    var gp = document.createElement('div');
    gp.className = 'mt-gami-panel';
    var gpHtml = '';

    /* ── XP & Nivå ── */
    gpHtml += '<div class="mt-gami-xp">';
    gpHtml += '<div class="mt-gami-xp-header">';
    gpHtml += '<span class="mt-gami-level-icon">' + newLvl.current.icon + '</span>';
    gpHtml += '<span class="mt-gami-level-name">' + mtEsc(newLvl.current.name) + '</span>';
    gpHtml += '</div>';
    gpHtml += '<div class="mt-gami-xp-row">';
    gpHtml += '<span class="mt-gami-xp-earned">+' + MTS.sessionXP + ' XP denne økta</span>';
    gpHtml += '<span class="mt-gami-xp-total">' + newTotalXP + ' XP totalt</span>';
    gpHtml += '</div>';
    if (newLvl.next) {
      var pctToNext = Math.round((newTotalXP - newLvl.current.xp) / (newLvl.next.xp - newLvl.current.xp) * 100);
      gpHtml += '<div class="mt-gami-xp-bar-wrap">';
      gpHtml += '<div class="mt-gami-xp-bar" style="width:' + Math.min(pctToNext, 100) + '%"></div>';
      gpHtml += '</div>';
      gpHtml += '<div class="mt-gami-xp-next">' + (newLvl.next.xp - newTotalXP) + ' XP att til ' + mtEsc(newLvl.next.name) + ' ' + newLvl.next.icon + '</div>';
    }
    if (leveledUp) {
      gpHtml += '<div class="mt-gami-levelup">&#127881; Nytt nivå: <strong>' + mtEsc(newLvl.current.name) + '</strong> ' + newLvl.current.icon + '</div>';
    }
    gpHtml += '</div>';

    /* ── Dagleg streak ── */
    gpHtml += '<div class="mt-gami-streak">';
    gpHtml += '<div class="mt-gami-streak-count">';
    gpHtml += '<span class="mt-gami-streak-fire">&#128293;</span> ';
    gpHtml += '<strong>' + streak.current + '</strong> dag' + (streak.current !== 1 ? 'ar' : '') + ' på rad';
    if (streak.rekord > streak.current) gpHtml += ' <span class="mt-gami-streak-rekord">(rekord: ' + streak.rekord + ')</span>';
    gpHtml += '</div>';
    /* Mini-graf siste 14 dagar */
    var now = new Date();
    gpHtml += '<div class="mt-gami-streak-grid">';
    for (var si = 13; si >= 0; si--) {
      var d = new Date(now.getTime() - si * 86400000);
      var ds = d.toISOString().slice(0, 10);
      var active = streak.dagar.indexOf(ds) !== -1;
      gpHtml += '<div class="mt-gami-streak-day' + (active ? ' mt-gami-streak-active' : '') + '" title="' + ds + '"></div>';
    }
    gpHtml += '</div>';
    gpHtml += '</div>';

    /* ── Nye badges ── */
    if (newBadges.length) {
      gpHtml += '<div class="mt-gami-new-badges">';
      gpHtml += '<h5>&#127942; Nye prestasjonar!</h5>';
      newBadges.forEach(function (b) {
        gpHtml += '<div class="mt-gami-badge mt-gami-badge-new"><span class="mt-gami-badge-icon">' + b.icon + '</span>';
        gpHtml += '<div><strong>' + mtEsc(b.namn) + '</strong><br><span class="mt-gami-badge-desc">' + mtEsc(b.beskriving) + '</span></div></div>';
      });
      gpHtml += '</div>';
    }

    /* ── Alle badges (trofé-panel) ── */
    var unlockedBadges = mtBadgesGet();
    var unlockedKeys = Object.keys(unlockedBadges);
    if (unlockedKeys.length) {
      gpHtml += '<div class="mt-gami-trophies">';
      gpHtml += '<h5>&#127942; Troféskapet ditt (' + unlockedKeys.length + '/' + MT_BADGE_DEFS.length + ')</h5>';
      gpHtml += '<div class="mt-gami-trophy-grid">';
      MT_BADGE_DEFS.forEach(function (bd) {
        var unlocked = !!unlockedBadges[bd.id];
        gpHtml += '<div class="mt-gami-trophy' + (unlocked ? '' : ' mt-gami-trophy-locked') + '" title="' + mtEsc(bd.namn + ': ' + bd.beskriving) + '">';
        gpHtml += '<span class="mt-gami-trophy-icon">' + (unlocked ? bd.icon : '&#128274;') + '</span>';
        gpHtml += '<span class="mt-gami-trophy-label">' + mtEsc(bd.namn) + '</span>';
        gpHtml += '</div>';
      });
      gpHtml += '</div></div>';
    }

    /* ── Feillogg-knapp ── */
    var feillogg = mtFeilloggGet();
    if (feillogg.length) {
      gpHtml += '<div class="mt-gami-feillogg">';
      gpHtml += '<button class="mt-btn-secondary mt-feillogg-btn" onclick="mtStartFeillogg()">&#128260; Øv på tidlegare feil (' + feillogg.length + ' oppgåver)</button>';
      gpHtml += '</div>';
    }

    gp.innerHTML = gpHtml;
    /* Sett inn før summary-actions */
    var actionsDiv = sumEl.querySelector('.adp-summary-actions');
    if (actionsDiv) sumEl.insertBefore(gp, actionsDiv);
    else sumEl.appendChild(gp);
  }

  /* «Start ny økt med svakaste kategoriar»-knapp */
  var sumNewBtn = $mt('nl-ad-sum-new');
  if (sumNewBtn) {
    sumNewBtn.onclick = function () {
      /* Vel automatisk dei svakaste kategoriane */
      var weakCats = [];
      var catS = {};
      MTS.history.forEach(function (h) {
        var k = h.task.kat;
        if (!catS[k]) catS[k] = { rett: 0, total: 0 };
        catS[k].total++;
        if (h.correct) catS[k].rett++;
      });
      Object.keys(catS).forEach(function (k) {
        if (catS[k].rett / catS[k].total < 0.7) weakCats.push(k);
      });
      if (!weakCats.length) weakCats = MTS.selectedCats;
      /* Oppdater kategori-knappane */
      document.querySelectorAll('#nl-ad-cats .adp-cat').forEach(function (el) {
        el.classList.toggle('on', weakCats.indexOf(el.dataset.cat) !== -1);
      });
      mtStart();
    };
  }

  /* Vis oppsummeringa */
  var summary = $mt('nl-ad-summary');
  var actions = $mt('nl-ad-actions');
  var body = $mt('nl-ad-win-body');
  if (summary) summary.hidden = false;
  if (actions) actions.style.display = 'none';
  if (body) body.innerHTML = '';

  if (summary) summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════════════════════
   TASTATUR & BINDING
══════════════════════════════════════════════════════ */

var _mcKeyHandler = null;
function mtBindMcKeys() {
  if (_mcKeyHandler) document.removeEventListener('keydown', _mcKeyHandler);
  _mcKeyHandler = function (e) {
    if (MTS.answered) return;
    var num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      var btns = document.querySelectorAll('.mt-mc-btn');
      if (btns[num - 1]) { btns[num - 1].click(); }
    }
  };
  document.addEventListener('keydown', _mcKeyHandler);
}

/* ══════════════════════════════════════════════════════
   CSS – injiser motor-stilar
══════════════════════════════════════════════════════ */
(function mtInjectStyles() {
  if (document.getElementById('mt-motor-css')) return;
  var s = document.createElement('style');
  s.id = 'mt-motor-css';
  s.textContent = [
    /* ─── Card ─── */
    '.mt-card { animation: mtFadeIn .25s ease; }',
    '@keyframes mtFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }',

    /* ─── Live HUD ─── */
    '.mt-live { margin-bottom:.65rem; padding:.55rem .65rem; border:1px solid var(--border,#e0dbd2); border-radius:10px; background:linear-gradient(180deg,#fff,#fbfaf8); }',
    '.mt-live-top { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:.42rem; }',
    '.mt-live-progress { font-size:.82rem; font-weight:700; color:var(--text,#1a1a18); }',
    '.mt-live-kpis { display:flex; gap:6px; flex-wrap:wrap; }',
    '.mt-live-pill { font-size:.72rem; padding:2px 8px; border-radius:999px; background:#f3f1ec; color:var(--tmid,#4a4a46); border:1px solid #e6e1d7; }',
    '.mt-live-pill strong { color:var(--text,#1a1a18); font-weight:700; }',
    '.mt-live-bar { height:6px; border-radius:999px; background:#ebe6dc; overflow:hidden; }',
    '#mt-live-bar-fill { display:block; height:100%; width:0; background:linear-gradient(90deg,var(--mid,#2E6B4F),var(--accent,#C8832A)); transition:width .35s ease; }',
    '.mt-live-mastery { margin-top:.45rem; border:1px solid #e3d4b2; border-radius:8px; background:linear-gradient(145deg,#fff9ea,#fdf1d5); padding:.42rem .55rem; }',
    '.mt-live-mastery-head { display:flex; align-items:center; gap:7px; font-size:.78rem; color:#6b4a00; }',
    '#mt-live-mastery-icon { font-size:.98rem; }',
    '#mt-live-mastery-name { font-size:.82rem; font-weight:700; color:#5f4311; margin-right:auto; }',
    '#mt-live-mastery-trophies { font-size:.72rem; background:rgba(255,255,255,.55); border:1px solid rgba(193,139,46,.35); border-radius:999px; padding:1px 7px; }',
    '.mt-live-mastery-bar { margin-top:.28rem; height:5px; border-radius:99px; overflow:hidden; background:rgba(115,85,30,.16); }',
    '#mt-live-mastery-fill { display:block; height:100%; width:0; border-radius:99px; background:linear-gradient(90deg,#2c7a57,#c18b2e); transition:width .35s ease; }',
    '#mt-live-mastery-text { margin-top:.2rem; font-size:.7rem; color:#6f5a33; }',

    /* ─── Badges ─── */
    '.mt-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:.6rem; }',
    '.mt-badge { font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; padding:3px 10px; border-radius:99px; font-weight:600; }',
    '.mt-badge-cat { background:var(--alight,#fff3e0); color:var(--accent,#7a3800); }',
    '.mt-badge-lett { background:#e8f2f8; color:#1a567a; }',
    '.mt-badge-medium { background:#fffbe8; color:#6b4a00; }',
    '.mt-badge-vanskeleg { background:#fff0ed; color:#8b2a0a; }',
    '.mt-badge-retry { background:#eef0ff; color:#4a50a6; }',

    /* ─── Question ─── */
    '.mt-question { font-size:1rem; line-height:1.65; color:var(--text,#1a1a18); margin:0 0 .3rem; font-family:"Playfair Display",serif; font-style:italic; }',
    '.mt-context-text { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; margin:.6rem 0; font-size:.9rem; line-height:1.75; }',
    '.mt-hint { background:#fffbe8; border:1px solid #f5d878; border-radius:8px; padding:.5rem .8rem; margin:.5rem 0; font-size:.82rem; color:#6b4a00; }',
    '.mt-instruction { font-size:.82rem; color:var(--tmuted,#8a8a84); margin-bottom:.5rem; }',
    '.mt-rule-first { background:#eef5fc; border-left:3px solid #4a90d9; border-radius:0 8px 8px 0; padding:.5rem .75rem; margin-bottom:.6rem; font-size:.85rem; line-height:1.5; color:#1a2e45; }',

    /* ─── MC ─── */
    '.mt-mc-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:.6rem; }',
    '.mt-mc-grid-sm { gap:6px; }',
    '.mt-mc-btn { background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; color:var(--text,#1a1a18); font-family:inherit; font-size:.88rem; padding:8px 16px; cursor:pointer; transition:all .12s; text-align:left; display:inline-flex; align-items:center; gap:8px; }',
    '.mt-mc-btn:hover:not([disabled]) { border-color:var(--mid,#2E6B4F); background:var(--plight,#e8f2ec); }',
    '.mt-mc-sm { font-size:.82rem; padding:6px 12px; }',
    '.mt-mc-key { display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:4px; background:var(--bg,#f3f0ea); font-size:.72rem; font-weight:700; color:var(--tmuted,#8a8a84); flex-shrink:0; }',
    '.mt-mc-btn.mt-correct { background:rgba(26,122,80,.1); border-color:#1A7A50; color:#155f3e; }',
    '.mt-mc-btn.mt-wrong { background:rgba(192,57,43,.1); border-color:#C0392B; color:#8a2319; }',
    '.mt-mc-btn.mt-selected { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); font-weight:600; }',

    /* ─── Text input ─── */
    '.mt-input-row { margin-top:.6rem; }',
    '.mt-text-input { width:100%; border:1.5px solid var(--border,#e5e2db); border-radius:8px; background:#fff; color:var(--text,#1a1a18); font-family:inherit; font-size:.9rem; padding:9px 14px; outline:none; transition:border-color .15s; }',
    '.mt-text-input:focus { border-color:var(--mid,#2E6B4F); }',
    '.mt-textarea { resize:vertical; line-height:1.6; }',
    '.mt-mono { font-family:"JetBrains Mono",monospace; font-size:.85rem; }',
    '.mt-inp-correct { border-color:#1A7A50 !important; background:rgba(26,122,80,.06) !important; }',
    '.mt-inp-wrong { border-color:#C0392B !important; background:rgba(192,57,43,.06) !important; }',
    '.mt-inp-neutral { border-color:var(--accent,#e5822a) !important; }',

    /* ─── Fillsel ─── */
    '.mt-fillsel { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; margin-top:.6rem; }',
    '.mt-fillsel-line { margin-bottom:.35rem; font-size:.9rem; line-height:2; }',
    '.mt-fill-select { font-family:inherit; font-size:.88rem; padding:4px 8px; border:1.5px solid var(--border,#d5d2cb); border-radius:6px; background:#fff; }',

    /* ─── finn_feil ─── */
    '.mt-ff { margin-top:.6rem; }',
    '.mt-ff-text { background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; padding:.7rem .9rem; line-height:2; font-size:.92rem; margin-bottom:.6rem; }',
    '.mt-ff-word { display:inline; padding:2px 3px; border-radius:3px; cursor:pointer; transition:all .12s; border-bottom:2px solid transparent; }',
    '.mt-ff-word:hover { background:rgba(91,122,171,.08); }',
    '.mt-ff-word.mt-ff-sel { background:rgba(91,122,171,.14); border-bottom-color:#5b7aab; color:#2b4f85; }',
    '.mt-ff-word.mt-ff-hit { background:rgba(26,122,80,.12); border-bottom-color:#1A7A50; color:#155f3e; }',
    '.mt-ff-word.mt-ff-missed { background:rgba(176,90,0,.12); border-bottom-color:#B05A00; color:#7a4800; }',
    '.mt-ff-word.mt-ff-false { background:rgba(192,57,43,.12); border-bottom-color:#C0392B; color:#8a2319; }',

    /* ─── klikk_marker ─── */
    '.mt-km { margin-top:.6rem; }',
    '.mt-km-text { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; line-height:2; font-size:.92rem; margin-bottom:.6rem; }',
    '.mt-km-word { display:inline-block; margin:2px 3px; padding:3px 8px; border-radius:5px; cursor:pointer; border:1.5px solid transparent; transition:all .12s; }',
    '.mt-km-word:hover { border-color:var(--mid,#2E6B4F); }',
    '.mt-km-word.mt-km-sel { background:#e8eef8; border-color:#5b7aab; color:#2b4f85; }',
    '.mt-km-word.mt-km-hit { background:rgba(26,122,80,.12); border-color:#1A7A50; color:#155f3e; }',
    '.mt-km-word.mt-km-missed { background:rgba(176,90,0,.12); border-color:#B05A00; color:#7a4800; }',
    '.mt-km-word.mt-km-false { background:rgba(192,57,43,.12); border-color:#C0392B; color:#8a2319; }',

    /* ─── drag_kolonne ─── */
    '.mt-dk { margin-top:.6rem; }',
    '.mt-dk-bank { display:flex; flex-wrap:wrap; gap:8px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; min-height:40px; margin-bottom:.7rem; }',
    '.mt-dk-cols { display:grid; grid-template-columns:1fr 1fr; gap:10px; }',
    '.mt-dk-col { border:2px dashed var(--border,#d5d2cb); border-radius:8px; min-height:70px; padding:.5rem; }',
    '.mt-dk-col-0 { background:rgba(232,246,240,.5); border-color:rgba(130,201,168,.5); }',
    '.mt-dk-col-1 { background:rgba(255,240,237,.5); border-color:rgba(240,160,144,.5); }',
    '.mt-dk-col-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--tmuted,#8a8a84); margin-bottom:5px; }',
    '.mt-dk-placed { display:flex; flex-wrap:wrap; gap:6px; }',
    '.mt-dk-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:6px; font-size:.82rem; padding:6px 14px; cursor:grab; user-select:none; transition:all .12s; }',
    '.mt-dk-token:hover { border-color:var(--mid,#2E6B4F); }',

    /* ─── drag_ord ─── */
    '.mt-do { margin-top:.6rem; }',
    '.mt-do-bank { display:flex; flex-wrap:wrap; gap:8px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; min-height:40px; margin-bottom:.6rem; }',
    '.mt-do-answer { min-height:44px; padding:.5rem; background:#fff; border:2px dashed var(--border,#c5c2bb); border-radius:8px; display:flex; flex-wrap:wrap; gap:8px; margin-bottom:.5rem; }',
    '.mt-do-placeholder { font-size:.82rem; color:var(--tmuted,#aaa); }',
    '.mt-do-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:6px; font-size:.88rem; padding:6px 14px; cursor:pointer; transition:all .12s; }',
    '.mt-do-token.mt-do-placed { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); }',

    /* ─── burger_sort ─── */
    '.mt-bs { margin-top:.6rem; }',
    '.mt-bs-bank { display:flex; flex-direction:column; gap:6px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; margin-bottom:.6rem; }',
    '.mt-bs-buckets { display:flex; gap:8px; flex-wrap:wrap; }',
    '.mt-bs-bucket { flex:1; min-width:100px; border:2px dashed var(--border,#d5d2cb); border-radius:8px; padding:.5rem; min-height:60px; }',
    '.mt-bs-bucket:nth-child(1) { background:rgba(255,243,224,.6); border-color:rgba(245,194,130,.5); }',
    '.mt-bs-bucket:nth-child(2) { background:rgba(232,246,240,.6); border-color:rgba(130,201,168,.5); }',
    '.mt-bs-bucket:nth-child(3) { background:rgba(253,240,235,.6); border-color:rgba(240,160,144,.5); }',
    '.mt-bs-bucket-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--tmuted,#8a8a84); margin-bottom:5px; }',
    '.mt-bs-placed { display:flex; flex-direction:column; gap:5px; }',
    '.mt-bs-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:7px; font-size:.82rem; padding:7px 12px; cursor:grab; line-height:1.5; touch-action:manipulation; }',

    /* ─── avsnitt_klikk ─── */
    '.mt-ak { margin-top:.6rem; }',
    '.mt-ak-body { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; line-height:2.2; }',
    '.mt-ak-text { font-size:.9rem; }',
    '.mt-ak-break { font-size:.9rem; cursor:pointer; border-bottom:2px dotted var(--border,#c5c2bb); transition:all .15s; padding-bottom:1px; }',
    '.mt-ak-break:hover { border-bottom-color:var(--mid,#2E6B4F); }',
    '.mt-ak-break.mt-ak-on { background:rgba(91,122,171,.12); color:#2b4f85; border-bottom:2px solid #5b7aab; }',
    '.mt-ak-break.mt-ak-hit { background:rgba(26,122,80,.12); border-bottom-color:#1A7A50; color:#155f3e; }',
    '.mt-ak-break.mt-ak-missed { background:rgba(176,90,0,.12); border-bottom-color:#B05A00; color:#7a4800; }',
    '.mt-ak-break.mt-ak-false { background:rgba(192,57,43,.12); border-bottom-color:#C0392B; color:#8a2319; }',

    /* ─── sann_usann ─── */
    '.mt-su { margin-top:.6rem; display:flex; flex-direction:column; gap:8px; }',
    '.mt-su-row { display:flex; align-items:center; gap:10px; padding:.55rem .7rem; background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; transition:all .15s; }',
    '.mt-su-text { flex:1; font-size:.88rem; line-height:1.5; }',
    '.mt-su-btns { display:flex; gap:5px; flex-shrink:0; }',
    '.mt-su-btn { padding:5px 14px; border:1.5px solid var(--border,#e5e2db); border-radius:6px; background:#fff; font-size:.8rem; font-weight:600; cursor:pointer; transition:all .12s; }',
    '.mt-su-btn.mt-selected { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); color:var(--accent,#7a3800); }',
    '.mt-su-row.mt-su-ok { background:rgba(26,122,80,.06); border-color:#1A7A50; }',
    '.mt-su-row.mt-su-wrong { background:rgba(192,57,43,.06); border-color:#C0392B; }',

    /* ─── omskriv ─── */
    '.mt-omskriv { margin-top:.6rem; }',

    /* ─── sorter_rekke ─── */
    '.mt-sr { margin-top:.6rem; }',
    '.mt-sr-list { display:flex; flex-direction:column; gap:6px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; margin-bottom:.5rem; }',
    '.mt-sr-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:7px; font-size:.85rem; padding:8px 14px; cursor:grab; touch-action:manipulation; transition:all .12s; }',
    '.mt-sr-token:hover { border-color:var(--mid,#2E6B4F); }',

    /* ─── Generiske result-klassar ─── */
    '.mt-correct { background:rgba(26,122,80,.1) !important; border-color:#1A7A50 !important; color:#155f3e !important; }',
    '.mt-wrong { background:rgba(192,57,43,.1) !important; border-color:#C0392B !important; color:#8a2319 !important; }',

    /* ─── Secondary button ─── */
    '.mt-btn-secondary { background:transparent; border:1.5px solid var(--border,#d5d2cb); color:var(--tmid,#4a4a46); border-radius:8px; font-family:inherit; font-size:.82rem; padding:7px 14px; cursor:pointer; margin-top:.5rem; transition:all .12s; }',
    '.mt-btn-secondary:hover { border-color:var(--mid,#2E6B4F); color:var(--primary,#1A3D2B); }',

    /* ─── Feedback ─── */
    '.mt-feedback { display:none; border-radius:10px; padding:.75rem .9rem; margin-top:.8rem; font-size:.88rem; line-height:1.6; animation:mtFadeIn .2s ease; }',
    '.mt-fb-correct { background:rgba(26,122,80,.08); border:1px solid rgba(26,122,80,.25); color:#14532d; }',
    '.mt-fb-partial { background:rgba(176,90,0,.08); border:1px solid rgba(176,90,0,.25); color:#6b4a00; }',
    '.mt-fb-wrong { background:rgba(192,57,43,.08); border:1px solid rgba(192,57,43,.25); color:#7f1d1d; }',
    '.mt-fb-heading { font-weight:700; font-size:.95rem; margin-bottom:.3rem; }',
    '.mt-fb-detail { font-size:.84rem; opacity:.8; margin-bottom:.25rem; }',
    '.mt-fb-fasit { margin-top:.3rem; }',
    '.mt-fb-extra { margin-top:.4rem; padding:.4rem .6rem; background:rgba(74,80,166,.06); border-radius:6px; font-size:.84rem; }',
    '.mt-fb-forklaring { margin-top:.45rem; padding:.45rem .65rem; background:rgba(0,0,0,.03); border-radius:6px; font-size:.84rem; line-height:1.55; font-style:italic; }',
    '.mt-fb-rule { margin-top:.35rem; padding:0; border:none; background:transparent; font-size:.84rem; line-height:1.55; color:inherit; }',
    '.mt-fb-rule strong { color:inherit; opacity:.85; }',
    '.mt-fb-eks { margin-top:.2rem; padding:0; border:none; background:transparent; font-size:.83rem; line-height:1.55; font-family:inherit; color:inherit; }',
    '.mt-fb-eks strong { font-family:inherit; color:inherit; opacity:.85; }',
    '.mt-fb-correction { margin-top:.45rem; padding:.45rem .6rem; border-radius:6px; background:rgba(255,255,255,.35); border:1px solid rgba(140,115,66,.22); }',
    '.mt-fb-corr-row { margin-top:.24rem; font-size:.83rem; line-height:1.55; }',
    '.mt-fb-corr-row:first-child { margin-top:0; }',
    '.mt-mark-bad { color:#a32020; background:rgba(210,61,61,.14); border-radius:4px; padding:0 3px; }',
    '.mt-mark-ok { color:#17653e; background:rgba(26,122,80,.14); border-radius:4px; padding:0 3px; }',
    '.mt-fb-fasit-inline { color:#17653e; font-weight:600; font-size:.8rem; }',
    '.mt-fb-streak { margin-top:.35rem; font-weight:700; }',
    '.mt-fb-retry-tip { margin-top:.4rem; font-size:.82rem; color:var(--tmuted,#8a8a84); font-style:italic; }',
    '.mt-fb-retry-win { margin-top:.35rem; font-weight:700; color:#1a5c42; }',
    '.mt-fb-models { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:.5rem; }',
    '.mt-fb-model { padding:.55rem .7rem; border-radius:8px; font-size:.83rem; line-height:1.5; }',
    '.mt-fb-model-label { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }',
    '.mt-fb-model-weak { background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.15); color:#7f1d1d; }',
    '.mt-fb-model-good { background:rgba(26,122,80,.06); border:1px solid rgba(26,122,80,.15); color:#14532d; }',

    /* ─── Summary additions ─── */
    '.mt-sum-advice { margin-top:.5rem; font-size:.84rem; color:var(--tmid,#4a4a46); font-style:italic; }',

    /* ─── XP feedback badge ─── */
    '.mt-fb-xp { display:inline-block; margin-top:.35rem; padding:2px 10px; border-radius:99px; background:linear-gradient(135deg,#ffe066,#ffb347); color:#6b4a00; font-size:.76rem; font-weight:700; letter-spacing:.04em; animation:mtXpPop .35s ease; }',
    '@keyframes mtXpPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }',

    /* ─── Gamification panel ─── */
    '.mt-gami-panel { margin-top:1rem; display:flex; flex-direction:column; gap:.75rem; }',
    '.mt-gami-xp { background:linear-gradient(135deg,#f8f4ee,#fff8ef); border:1px solid #e8dcc8; border-radius:10px; padding:.7rem .85rem; }',
    '.mt-gami-xp-header { display:flex; align-items:center; gap:8px; margin-bottom:.4rem; }',
    '.mt-gami-level-icon { font-size:1.3rem; }',
    '.mt-gami-level-name { font-size:.95rem; font-weight:700; color:var(--primary,#1A3D2B); }',
    '.mt-gami-xp-row { display:flex; justify-content:space-between; font-size:.82rem; color:var(--tmid,#4a4a46); margin-bottom:.35rem; }',
    '.mt-gami-xp-earned { color:var(--accent,#C8832A); font-weight:600; }',
    '.mt-gami-xp-bar-wrap { height:6px; background:#e8e4dc; border-radius:3px; overflow:hidden; }',
    '.mt-gami-xp-bar { height:100%; background:linear-gradient(90deg,var(--mid,#2E6B4F),var(--accent,#C8832A)); border-radius:3px; transition:width .6s ease; }',
    '.mt-gami-xp-next { font-size:.75rem; color:var(--tmuted,#8a8a84); margin-top:.25rem; }',
    '.mt-gami-levelup { margin-top:.5rem; padding:.45rem .65rem; background:linear-gradient(135deg,#fff3d6,#ffe8b8); border:1px solid #f5d878; border-radius:8px; font-size:.88rem; color:#6b4a00; animation:mtLevelUp .5s ease; text-align:center; }',
    '@keyframes mtLevelUp { 0%{transform:scale(.8);opacity:0} 50%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }',

    '.mt-gami-streak { background:#fff; border:1px solid var(--border,#e0dbd2); border-radius:10px; padding:.6rem .8rem; }',
    '.mt-gami-streak-count { font-size:.88rem; color:var(--text,#1a1a18); margin-bottom:.4rem; }',
    '.mt-gami-streak-fire { font-size:1.05rem; }',
    '.mt-gami-streak-rekord { font-size:.75rem; color:var(--tmuted,#8a8a84); }',
    '.mt-gami-streak-grid { display:flex; gap:3px; }',
    '.mt-gami-streak-day { width:16px; height:16px; border-radius:3px; background:#eae6de; }',
    '.mt-gami-streak-active { background:var(--mid,#2E6B4F); }',

    '.mt-gami-new-badges { background:linear-gradient(135deg,#fffbe8,#fff3d0); border:1px solid #f5d878; border-radius:10px; padding:.6rem .8rem; }',
    '.mt-gami-new-badges h5 { margin:0 0 .4rem; font-size:.85rem; }',
    '.mt-gami-badge { display:flex; align-items:center; gap:10px; padding:.35rem 0; }',
    '.mt-gami-badge-new { animation:mtBadgeIn .4s ease; }',
    '@keyframes mtBadgeIn { 0%{transform:translateX(-12px);opacity:0} 100%{transform:translateX(0);opacity:1} }',
    '.mt-gami-badge-icon { font-size:1.35rem; }',
    '.mt-gami-badge-desc { font-size:.78rem; color:var(--tmid,#4a4a46); }',

    '.mt-gami-trophies { background:#fff; border:1px solid var(--border,#e0dbd2); border-radius:10px; padding:.6rem .8rem; }',
    '.mt-gami-trophies h5 { margin:0 0 .4rem; font-size:.85rem; }',
    '.mt-gami-trophy-grid { display:flex; flex-wrap:wrap; gap:6px; }',
    '.mt-gami-trophy { display:flex; flex-direction:column; align-items:center; width:56px; padding:6px 2px; border-radius:8px; background:var(--bg,#f8f7f4); transition:all .15s; cursor:default; }',
    '.mt-gami-trophy:hover { background:#eee; }',
    '.mt-gami-trophy-locked { opacity:.35; filter:grayscale(1); }',
    '.mt-gami-trophy-icon { font-size:1.2rem; }',
    '.mt-gami-trophy-label { font-size:.58rem; text-align:center; color:var(--tmid,#4a4a46); margin-top:2px; line-height:1.2; }',

    '.mt-gami-feillogg { text-align:center; }',
    '.mt-feillogg-btn { font-size:.84rem !important; padding:8px 18px !important; }',

    /* ─── Responsive ─── */
    '@media (max-width:600px) {',
    '  .mt-mc-grid { flex-direction:column; }',
    '  .mt-dk-cols { grid-template-columns:1fr; }',
    '  .mt-bs-buckets { flex-direction:column; }',
    '  .mt-fb-models { grid-template-columns:1fr; }',
    '  .mt-su-row { flex-direction:column; align-items:stretch; }',
    '  .mt-su-btns { justify-content:flex-end; }',
    '}'
  ].join('\n');
  document.head.appendChild(s);
})();

/* ══════════════════════════════════════════════════════
   INIT – knytt til eksisterande UI
══════════════════════════════════════════════════════ */

function mtInit() {
  // Fjern eventuell legacy feedback-node dersom han framleis finst i eldre markup.
  var legacyFeedback = $mt('nl-ad-feedback');
  if (legacyFeedback && legacyFeedback.parentNode) legacyFeedback.parentNode.removeChild(legacyFeedback);

  /* Bygg kategoriknappar frå BANKV2 dersom #nl-ad-cats er tomt */
  var catsWrap = $mt('nl-ad-cats');
  if (catsWrap && !catsWrap.querySelector('.adp-cat') && BANKV2.length) {
    var catGroups = (function () {
      var htmlToMt = {
        'og-aa': 'og_aa',
        'dobbel-konsonant': 'dobbel_konsonant',
        'kj-skj': 'kj_skj',
        teiknsetting: 'teiknsetting',
        'saerskriving-samansetjing': 'samansett',
        ordklasse: 'ordklassar',
        oppgaveforstaing: 'oppgavetolking',
        setningsbygging: 'setningsbygging',
        'aarsak-samanheng': 'aarsak_samanheng',
        referansekjede: 'referansekjede',
        'logisk-struktur': 'logisk_struktur',
        'tekststruktur-delar': 'tekststruktur',
        'bindeord-overgangar': 'bindeord',
        sjangerkompetanse: 'sjangerkompetanse',
        fagartikkel: 'fagartikkel',
        debattinnlegg: 'debattinnlegg',
        'overskrift-ingress': 'overskrift_ingress',
        'spraak-stil': 'spraak_stil',
        novelle: 'novelle',
        kjeldebruk: 'kjeldebruk',
        parafrase: 'parafrase',
        sitat: 'sitat',
        'tal-og-statistikk': 'tal_og_statistikk'
      };

      var groups = [];
      var htmlGroups = document.querySelectorAll('.main .grp');
      htmlGroups.forEach(function (grp) {
        var h = grp.querySelector('.glabel h2');
        var title = h ? String(h.textContent || '').trim() : '';
        if (!title) return;

        var cats = [];
        grp.querySelectorAll('.card[data-cat]').forEach(function (card) {
          var htmlCat = String(card.getAttribute('data-cat') || '').trim();
          var mtCat = htmlToMt[htmlCat] || '';
          if (mtCat && cats.indexOf(mtCat) === -1) cats.push(mtCat);
        });

        if (cats.length) groups.push({ title: title, cats: cats });
      });

      if (groups.length) return groups;

      /* Fallback dersom kortgrupper ikkje kan lesast frå DOM */
      return [
        { title: 'Rettskriving', cats: ['og_aa','samansett','dobbel_konsonant','kj_skj','teiknsetting'] },
        { title: 'Grammatikk', cats: ['ordklassar','setningsbygging','bindeord'] },
        { title: 'Tekst og skriving', cats: ['tekststruktur','kjeldebruk','oppgavetolking','spraak_stil','aarsak_samanheng','referansekjede','logisk_struktur'] },
        { title: 'Sjanger og formål', cats: ['sjangerkompetanse','fagartikkel','debattinnlegg','overskrift_ingress','novelle','parafrase','sitat','tal_og_statistikk'] }
      ];
    })();
    var labelMap = {};
    BANKV2.forEach(function (t) {
      if (t && t.kat && t.kat_label && !labelMap[t.kat]) labelMap[t.kat] = t.kat_label;
    });
    catGroups.forEach(function (grp) {
      var groupBox = document.createElement('div');
      groupBox.className = 'adp-cat-group';
      var heading = document.createElement('h4');
      heading.className = 'adp-cat-group-title';
      heading.textContent = grp.title;
      groupBox.appendChild(heading);
      var list = document.createElement('div');
      list.className = 'adp-cat-group-list';
      grp.cats.forEach(function (catId) {
        if (!labelMap[catId]) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'adp-cat on';
        b.dataset.cat = catId;
        b.textContent = labelMap[catId];
        b.addEventListener('click', function () { b.classList.toggle('on'); });
        list.appendChild(b);
      });
      if (list.children.length) {
        groupBox.appendChild(list);
        catsWrap.appendChild(groupBox);
      }
    });
  }

  /* Bind knappar frå skrivelab.html sin nl-ad-* UI */
  var startBtn = $mt('nl-ad-start');
  var resetBtn = $mt('nl-ad-reset');
  var checkBtn = $mt('nl-ad-check');
  var nextBtn = $mt('nl-ad-next');
  var closeBtn = $mt('nl-ad-win-close');
  var winBg = $mt('nl-ad-win-bg');
  var sumClose = $mt('nl-ad-sum-close');

  if (startBtn) startBtn.addEventListener('click', mtStart);
  if (resetBtn) resetBtn.addEventListener('click', mtAbort);
  if (checkBtn) checkBtn.addEventListener('click', mtTriggerCheck);
  if (nextBtn) nextBtn.addEventListener('click', mtNext);
  if (closeBtn) closeBtn.addEventListener('click', mtAbort);
  if (winBg) winBg.addEventListener('click', mtAbort);
  if (sumClose) sumClose.addEventListener('click', mtAbort);

  /* Synk toppcockpit med lagra nivå/xp/streak/trofé ved innlasting */
  var initXP = mtXpGetTotal();
  var initStreak = mtStreakGet();
  mtUpdateHeaderProfile(initXP, initStreak.current || 0);
}

function mtShouldAutoInit() {
  if (typeof window === 'undefined') return false;
  // Skrivelab has its own adaptive engine; avoid double-binding there.
  var page = String((window.location && window.location.pathname) || '').toLowerCase();
  return page.indexOf('skrivelab') === -1;
}

if (mtShouldAutoInit()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mtInit);
  } else {
    mtInit();
  }
}

/* Eksporter for inline onclick */
window.mtStart = mtStart;
window.mtStartManualQueue = mtStartManualQueue;
window.mtAbort = mtAbort;
window.mtStartFeillogg = mtStartFeillogg;
window.mtTriggerCheck = mtTriggerCheck;
window.mtNext = mtNext;
window.mtCheckMc = mtCheckMc;
window.mtMcsetPick = mtMcsetPick;
window.mtFfClick = mtFfClick;
window.mtFfReset = mtFfReset;
window.mtKmClick = mtKmClick;
window.mtKmReset = mtKmReset;
window.mtDkDragStart = mtDkDragStart;
window.mtDkMove = mtDkMove;
window.mtDkDropCol = mtDkDropCol;
window.mtDkDropBank = mtDkDropBank;
window.mtDoMove = mtDoMove;
window.mtDoReset = mtDoReset;
window.mtBsDragStart = mtBsDragStart;
window.mtBsClick = mtBsClick;
window.mtBsDrop = mtBsDrop;
window.mtBsReset = mtBsReset;
window.mtAkToggle = mtAkToggle;
window.mtAkReset = mtAkReset;
window.mtSuPick = mtSuPick;
window.mtSrDragStart = mtSrDragStart;
window.mtSrClick = mtSrClick;
window.mtSrReset = mtSrReset;
window.mtManualJump = mtManualJump;
