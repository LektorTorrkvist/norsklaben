/* ══════════════════════════════════════════════════════
   OPPGAVEBANK – bokmål – v2
   Adaptiv mengdetreningsmotor med pedagogisk dybde
   ────────────────────────────────────────────────────
   Funksjoner:
   • Dynamisk adaptivt oppgavevalg (glidende mestringsvindu)
   • Retry-kø med pedagogisk kommentar
   • Delvis poeng (mcset, fillsel, finn_feil, klikk_marker)
   • Levenshtein-tilbakemelding for cloze/fix
   • vanlige_feil + forklaring-felt
   • Tidsmåling per oppgave
   • localStorage-historikk per kategori
   • Nye typer: sann_usann_serie, omskriv, sorter_rekke
   • Tastaturnavigering i mc (1-4)
   • «Vis regel først»-toggle
══════════════════════════════════════════════════════ */

/* ─── LEGACY-FILTER (for kortimport i Skrivelab) ─── */
var MT_LEGACY_BLOCKLIST = [
  'jule middag',
  'jule treet',
  'brettspill er bra',
  'brettspill som monopol er populære'
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
  1. OG / Å  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg rett ord: «Hun liker ___ danse.»',
 alt:['og','å'],fasit:'å',
 regel:'«Å» er infinitivsmerke og kommer foran et verb i infinitiv.',
 eks:'Hun liker å danse. Han prøver å lese.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg rett ord: «Han spiser brød ___ drikker melk.»',
 alt:['og','å'],fasit:'og',
 regel:'«Og» er et bindeord som binder sammen to ledd eller setninger.',
 eks:'Han spiser brød og drikker melk. Hun leser og skriver.'},

{kat:'og_aa',kat_label:'Og / å',type:'fillsel',vanske:'medium',
 q:'Velg «og» eller «å» i hver setning.',
 items:[
  {pre:'Hun prøvde',alt:['og','å'],fasit:'å',post:'forstå oppgaven.'},
  {pre:'Katten',alt:['og','å'],fasit:'og',post:'hunden leker sammen.'},
  {pre:'Det er viktig',alt:['og','å'],fasit:'å',post:'sove nok.'},
  {pre:'Han kjøpte brød',alt:['og','å'],fasit:'og',post:'melk.'},
  {pre:'Vi dro for',alt:['og','å'],fasit:'å',post:'oppleve noe nytt.'}
 ],
 regel:'«Å» kommer foran infinitiv (verb i grunnform). «Og» binder sammen ledd.',
 eks:'prøvde å forstå · katten og hunden · for å oppleve'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'lett',
 q:'Klikk på det ene ordet som er feil brukt.',
 tekst:'Læreren ba elevene og tenke over spørsmålet før prøven.',
 fasit_feil:['og'],
 regel:'Etter «ba» kommer infinitiv → infinitivsmerket «å»: «ba elevene å tenke».',
 eks:'be noen å gjøre noe – alltid «å + infinitiv» etter «be/ba».'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'medium',
 q:'To ord er feil brukt. Klikk på begge.',
 tekst:'Det er viktig og forstå grammatikk, å alle i klassen bør øve hver dag.',
 fasit_feil:['og','å'],
 regel:'«Viktig og forstå» → «viktig å forstå» (infinitiv). «Å alle» → «og alle» (bindeord).',
 eks:'Det er viktig å forstå grammatikk, og alle bør øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter setningene etter om de bruker «å» (infinitivsmerke) eller «og» (bindeord).',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
  {tekst:'Hun liker å danse.',fasit:0},
  {tekst:'Katten og hunden leker.',fasit:1},
  {tekst:'Det er gøy å svømme.',fasit:0},
  {tekst:'Han er sterk og modig.',fasit:1},
  {tekst:'Jeg prøver å forstå.',fasit:0},
  {tekst:'Hun synger og ler.',fasit:1}
 ],
 regel:'«Å» kommer foran et verb i infinitiv. «Og» binder sammen ord eller ledd.',
 eks:'å danse = infinitiv · katten og hunden = samordning'},

{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'medium',
 q:'Klikk på hvert ord som er et infinitivsmerke («å»).',
 tekst:'Hun prøvde å rydde rommet og å vaske klærne før middagen.',
 maalordklasse:'å (infinitivsmerke)',
 fasit_ord:['å','å'],
 regel:'«Å rydde» og «å vaske» er infinitivskonstruksjoner. «Og» mellom dem er bindeord.',
 eks:'å rydde = infinitiv · å vaske = infinitiv · og = bindeord'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Hva er rett? «Han ___ hjelpe til.»',
 alt:['vil å hjelpe','vil hjelpe','vil og hjelpe','ønsker å ikke hjelpe'],
 fasit:'vil hjelpe',
 regel:'Etter modalverbene «vil», «kan», «skal», «bør», «må» kommer infinitiv uten «å».',
 eks:'vil hjelpe · kan gå · skal komme · bør lese'},

{kat:'og_aa',kat_label:'Og / å',type:'fix',vanske:'vanskeleg',
 q:'Rett de fire og/å-feilene i teksten.',
 tekst:'Jeg har alltid hatt lyst og reise til Spania. Broren min lovde og komme med, men han prøvde og finne billigere billetter. Til slutt bestemte vi oss og dra til Sverige i stedet.',
 errors:{'lyst og reise':'lyst å reise','lovde og komme':'lovde å komme','prøvde og finne':'prøvde å finne','oss og dra':'oss å dra'},
 fasit:'lyst å reise · lovde å komme · prøvde å finne · oss å dra',
 regel:'Infinitivsmerket «å» kommer etter verb som «ha lyst til», «love», «prøve», «bestemme seg».',
 eks:'hatt lyst å reise · lovde å komme · prøvde å finne'},

{kat:'og_aa',kat_label:'Og / å',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandene om «og» / «å» sanne eller usanne?',
 paastandar:[
  {tekst:'«Å» kommer alltid foran et verb i infinitiv.',sann:true},
  {tekst:'Etter modalverb som «kan» og «vil» bruker en «å».',sann:false},
  {tekst:'«Og» binder sammen ord, ledd eller setninger.',sann:true},
  {tekst:'«Hun liker og lese» er korrekt nynorsk.',sann:false},
  {tekst:'«Bestemte seg for å reise» er rett.',sann:true}
 ],
 regel:'«Å» = infinitivsmerke. «Og» = bindeord. Modalverb styrer infinitiv uten «å».',
 eks:'å lese (infinitiv) · hun og han (bindeord) · kan lese (uten å)'},

/* ═══════════════════════════════════════════════════
  2. SAMMENSATTE ORD  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte?',
 alt:['sjokolade kake','sjokoladekake','sjokolade-kake','sjåkoladekake'],
 fasit:'sjokoladekake',
 regel:'Sammensatte ord skriver man i ett på norsk: «sjokolade» + «kake» = «sjokoladekake».',
 eks:'sjokoladekake, fotballbane, barneskole'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'medium',
 q:'«Ananas ringer» i stedet for «ananasringer» – hva betyr særskrivingen?',
 alt:['Ringer laget av ananas','At ananasfrukten ringer med telefon','Samme betydning begge veier','At ringen er formet som en ananas'],
 fasit:'At ananasfrukten ringer med telefon',
 regel:'Særskriving kan gi helt ny betydning. «Ananasringer» = mat. «Ananas ringer» = frukt med telefon.',
 eks:'ananasringer (mat) vs. ananas ringer (absurd betydning)'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'fix',vanske:'lett',
 q:'Rett de fire særskrivingsfeilene i teksten.',
 tekst:'Hvert år havner enorme mengder hav plast i sjøen. Sjø dyr som hval og sel setter seg fast i plast biter. Forskere fra Hav forsknings instituttet advarer om problemet.',
 errors:{'hav plast':'havplast','Sjø dyr':'Sjødyr','plast biter':'plastbiter','Hav forsknings instituttet':'Havforskningsinstituttet'},
 fasit:'havplast · Sjødyr · plastbiter · Havforskningsinstituttet',
 regel:'Sammensatte ord skriver man alltid i ett på norsk. Ingen mellomrom mellom leddene.',
 eks:'havplast, sjødyr, plastbiter, Havforskningsinstituttet'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'fix',vanske:'medium',
 q:'Rett de tre særskrivingsfeilene i elevteksten.',
 tekst:'I dag skal vi ha jule middag med hele familien. Bestemor lager pinnekjøtt middag, og vi har pyntet jule treet med lys. Etter middagen spiller vi brettspill og drikker varm sjokolade.',
 errors:{'jule middag':'julemiddag','pinnekjøtt middag':'pinnekjøttmiddag','jule treet':'juletreet'},
 fasit:'julemiddag · pinnekjøttmiddag · juletreet',
 regel:'Høytidsord skriver man i ett: julemiddag, juletre, påskemiddag.',
 eks:'julemiddag, juletreet, pinnekjøttmiddag'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'drag_kolonne',vanske:'medium',
 q:'Hvilke ord er riktig skrevet, og hvilke er feil (særskrevne)?',
 kolonner:['Rett skrevet','Feil (særskrevet)'],
 ord:[
  {tekst:'fotballbane',fasit:0},
  {tekst:'fotball bane',fasit:1},
  {tekst:'ungdomsskole',fasit:0},
  {tekst:'ungdoms skole',fasit:1},
  {tekst:'barnehage',fasit:0},
  {tekst:'barne hage',fasit:1}
 ],
 regel:'Sammensatte ord skriver man alltid i ett. Ingen mellomrom mellom leddene.',
 eks:'fotballbane, ungdomsskole, barnehage – alt i ett'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'cloze',vanske:'lett',
 q:'Skriv riktig (ett ord): «Hun spiller på ___» (fotball + bane)',
 hint:'Slå sammen de to delene til ett ord.',
 fasit:'fotballbane',fasit_v:['fotballbane','fotballbana'],
 regel:'«Fotball» + «bane» = «fotballbane» – ett sammensatt ord.',
 eks:'fotballbane, basketballbane, sandvolleyballbane'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om sammensatte ord sanne eller usanne?',
 paastandar:[
  {tekst:'Sammensatte ord skriver en alltid i ett på norsk.',sann:true},
  {tekst:'«Lamme lår» og «lammelår» betyr det samme.',sann:false},
  {tekst:'Bindestrek brukes mellom et norsk ord og en forkorting (f.eks. barne-tv).',sann:true},
  {tekst:'«Stor by» og «storby» betyr det samme.',sann:false}
 ],
 regel:'Særskriving kan endre betydningen. «Storby» = fast begrep. «Stor by» = en by som er stor.',
 eks:'lammelår (mat) vs. lamme lår (lår som ikke rører seg)'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'vanskeleg',
 q:'Hva av disse trenger bindestrek?',
 alt:['barnehage','barneskule','barnetv','barnebidrag'],
 fasit:'barnetv',
 regel:'Bindestrek mellom norsk ord og forkorting: barne-tv, mini-golf, e-post.',
 eks:'barne-tv, e-post, 17-åring, IT-avdeling'},

/* ═══════════════════════════════════════════════════
  3. DOBBEL KONSONANT  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett infinitivsform?',
 alt:['hope','hoppe','hoppa','hopa'],
 fasit:'hoppe',
 regel:'Etter kort vokal kommer dobbel konsonant: «hoppe» (kort o -> pp).',
 eks:'hoppe, sitte, legge, kaste'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hvorfor skriver en «mat» med én t, men «matte» med dobbel t?',
 alt:['Det er tilfeldig','«Mat» har lang vokal, «matte» har kort vokal','«Mat» er nynorsk, «matte» er bokmål','Begge har kort vokal'],
 fasit:'«Mat» har lang vokal, «matte» har kort vokal',
 regel:'Lang vokal -> en konsonant. Kort vokal -> dobbel konsonant.',
 eks:'mat (lang a) vs. matte (kort a) · bil (lang i) vs. bille (kort i)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter ordene: hva er rett skrevet, og hva er feil?',
 kolonner:['Rett skrevet','Feil skrevet'],
 ord:[
  {tekst:'hoppe',fasit:0},
  {tekst:'sitte',fasit:0},
  {tekst:'hoper',fasit:1},
  {tekst:'siter',fasit:1},
  {tekst:'kaffe',fasit:0},
  {tekst:'kafe',fasit:1},
  {tekst:'løpe',fasit:0},
  {tekst:'løppe',fasit:1}
 ],
 regel:'Kort vokal -> dobbel konsonant: hoppe, sitte, kaffe. Lang vokal -> en: lope.',
 eks:'hoppe (kort o) · lope (lang o) · kaffe (kort a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Adjektiv – rett eller feil skrivemåte?',
 kolonner:['Rett skrevet','Feil skrevet'],
 ord:[
  {tekst:'stille',fasit:0},
  {tekst:'stile',fasit:1},
  {tekst:'grønn',fasit:0},
  {tekst:'gron',fasit:1},
  {tekst:'liten',fasit:0},
  {tekst:'litten',fasit:1},
  {tekst:'bitter',fasit:0},
  {tekst:'biter',fasit:1}
 ],
 regel:'Dobbel konsonant etter kort vokal: stille, bitter. En konsonant etter lang vokal: liten.',
 eks:'stille (kort i) · gronn (kort o) · liten (lang i)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fix',vanske:'lett',
 q:'Rett de fire rettskrivingsfeilene.',
 tekst:'Mange ungdommer er opptatt av sosiale medier. Familien bor samles rundt midagsbordet og snakke om daagen. Prov a legge ned telefonen og se ut vinnduet.',
 errors:{'bor':'bør','midagsbordet':'middagsbordet','daagen':'dagen','vinnduet':'vinduet'},
 fasit:'bør · middagsbordet · dagen · vinduet',
 regel:'Dobbel konsonant brukes etter kort vokal. «Dag» har lang a -> en g. «Middag» har kort i -> dd.',
 eks:'ungdommer (kort o) · middagsbordet (kort i) · dagen (lang a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fillsel',vanske:'medium',
 q:'Velg rett form av verbet.',
 items:[
  {pre:'Hun',alt:['hopper','hopperr'],fasit:'hopper',post:'over bekken.'},
  {pre:'Katten',alt:['sover','sovver'],fasit:'sover',post:'i sofaen.'},
  {pre:'Han',alt:['løper','løpper'],fasit:'løper',post:'fort.'},
  {pre:'Vi',alt:['lager','lagger'],fasit:'lager',post:'middag.'}
 ],
 regel:'«Hopper» (kort o -> pp). «Sover» (lang o -> en v). «Loper» (lang o -> en p).',
 eks:'hopper (kort vokal) · sover (lang vokal) · loper (lang vokal)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: «Hun ___ på stolen» (å sitte, presens).',
 hint:'Presensformen av «å sitte» skrives med dobbel t.',
 fasit:'sitter',fasit_v:['sitter'],
 regel:'Infinitiv: sitte. Presens: sitter.',
 eks:'hun sitter, han sitter, de sitter'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandene om dobbel konsonant sanne eller usanne?',
 paastandar:[
  {tekst:'Etter kort vokal kommer ofte dobbel konsonant.',sann:true},
  {tekst:'«Bil» har dobbel l fordi i-en er kort.',sann:false},
  {tekst:'«Hoppe» har dobbel p fordi o-en er kort.',sann:true},
  {tekst:'«Dag» har en g fordi a-en er lang.',sann:true}
 ],
 regel:'Lang vokal -> en konsonant. Kort vokal -> dobbel konsonant. «Bil» har lang i.',
 eks:'bil (lang i, en l) · ball (kort a, dobbel l)'},

/* ═══════════════════════════════════════════════════
  4. KJ / SKJ-LYDEN  (6 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av klesplagget med knapper?',
 alt:['kjorte','skjorte','sjorte','chorte'],
 fasit:'skjorte',
 regel:'«Skjorte» skriver man med «skj».',
 eks:'En hvit skjorte. Et skjørt.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av det grammatiske begrepet (hankjønn, hunkjønn, intetkjønn)?',
 alt:['kjønn','skjønn','sjønn','kjøn'],
 fasit:'kjønn',
 regel:'«Kjønn» = grammatisk kjønn, skriver man med «kj». «Skjønn» = vakker, et annet ord.',
 eks:'kjønn (grammatikk) vs. skjønn (vakker)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'fillsel',vanske:'lett',
 q:'Velg rett skrivemåte i hver setning.',
 items:[
  {pre:'Det var en',alt:['kjønn','skjønn'],fasit:'skjønn',post:'solnedgang.'},
  {pre:'Hun ville ikke',alt:['kjenne','skjenne'],fasit:'kjenne',post:'seg igjen.'},
  {pre:'Han tok på seg en ny',alt:['kjorte','skjorte'],fasit:'skjorte',post:'til festen.'},
  {pre:'De ville',alt:['kjøpe','skjøpe'],fasit:'kjøpe',post:'ny bil.'}
 ],
 regel:'«Skjønn» = vakker. «Kjenne» = føle/vite. «Skjorte» = klesplagg. «Kjøpe» = handle.',
 eks:'skjønn dag · kjenne igjen · ny skjorte · kjøpe bil'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'drag_kolonne',vanske:'medium',
 q:'Sorter ordene: skriver en dem med «kj» eller «skj»?',
 kolonner:['Skriv med «kj»','Skriv med «skj»'],
 ord:[
  {tekst:'kjøpe',fasit:0},
  {tekst:'skjorte',fasit:1},
  {tekst:'kjøre',fasit:0},
  {tekst:'skjønn (vakker)',fasit:1},
  {tekst:'kjønn (grammatikk)',fasit:0},
  {tekst:'skjønne (forstå)',fasit:1}
 ],
 regel:'«Kj» og «skj» gir samme lyd, men hva en bruker kommer an på ordet.',
 eks:'kjøpe, kjøre, kjønn (kj) · skjorte, skjønn, skjønne (skj)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Hun ___ ikke hvorfor han var sint.» (å forstå, preteritum)',
 hint:'Preteritum av «å skjønne».',
 fasit:'skjønte',fasit_v:['skjønte'],
 regel:'«Å skjønne» → preteritum «skjønte». Skriv med «skj».',
 eks:'Hun skjønte det med en gang. Jeg skjønte ingenting.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «Hun ___ igjen lukta fra barndommen.» (å kjenne, preteritum)',
 hint:'Preteritum av «å kjenne». Skriv med «kj».',
 fasit:'kjente',fasit_v:['kjente','kjende'],
 regel:'«Å kjenne» → preteritum «kjente». Skriv med «kj».',
 eks:'Hun kjente igjen lukta. Han kjente seg igjen.'},

/* ═══════════════════════════════════════════════════
  5. TEGNSETTING  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvor setter du komma? «Jeg liker fotball tennis og svømming.»',
 alt:['Jeg liker fotball, tennis og svømming.','Jeg liker, fotball, tennis, og, svømming.','Ingen steder – ingen komma trengs.','Jeg liker fotball, tennis, og svømming.'],
 fasit:'Jeg liker fotball, tennis og svømming.',
 regel:'Komma mellom ledd i oppramsing, men ikke foran siste «og».',
 eks:'Jeg kjøpte brød, melk og ost.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hvor setter du komma? «Siden hun var syk gikk hun hjem.»',
 alt:['Siden hun var syk, gikk hun hjem.','Siden, hun var syk gikk hun hjem.','Siden hun var, syk gikk hun hjem.','Ingen komma trengs.'],
 fasit:'Siden hun var syk, gikk hun hjem.',
 regel:'Komma etter fremskutt leddsetning: [leddsetning], [hovedsetning].',
 eks:'Fordi det regnet, tok vi bussen. Selv om hun var trøtt, gikk hun.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fix',vanske:'lett',
 q:'Sett inn de fem kommaene som mangler.',
 tekst:'Selv om det var kaldt ute bestemte vi oss for å gå tur. Vi tok med mat drikke og varme klær. Lena som er raskest i klassen sprang foran. Da vi kom hjem lagde vi kakao.',
 errors:{'kaldt ute bestemte':'kaldt ute, bestemte','mat drikke':'mat, drikke','Lena som':'Lena, som','klassen sprang':'klassen, sprang','hjem lagde':'hjem, lagde'},
 fasit:'ute, bestemte · mat, drikke · Lena, som · klassen, sprang · hjem, lagde',
 regel:'Komma etter fremskutt leddsetning, i oppramsing, og rundt innskutt relativsetning.',
 eks:'Selv om ..., [hovedsetning]. Lena, som ..., sprang.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fix',vanske:'medium',
 q:'Rett tegnsettinga i teksten (2 feil).',
 tekst:'Hun sa at "Det finnes ingen enkel løsning" og alle var enige. Rapporten konkluderer med at: mengden plast kan tredoble seg.',
 errors:{'"Det finnes ingen enkel løsning"':'«Det finnes ingen enkel løsning»','at: mengden':'at mengden'},
 fasit:'Bruk guillemet «» i stedet for " ". Fjern kolon etter «at».',
 regel:'Bruk «guillemet» (« ») for sitat på norsk. Ikke kolon etter «at» i leddsetning.',
 eks:'Hun sa: «Jeg kommer.» · Rapporten viser at mengden øker.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: treng setninga kolon (:) eller semikolon (;)?',
 kolonner:['Kolon (:)','Semikolon (;)'],
 ord:[
  {tekst:'Hun snakket om tre ting … klima, plast og energi.',fasit:0},
  {tekst:'Det regnet hele dagen … likevel gikk vi tur.',fasit:1},
  {tekst:'Resultatene viste ett funn … plastmengden hadde økt.',fasit:0},
  {tekst:'Jeg er ikke trøtt … jeg er sulten.',fasit:1}
 ],
 regel:'Kolon innleder forklaring eller liste. Semikolon knytter to selvstendige setninger.',
 eks:'tre ting: a, b, c (kolon) · ikke trøtt; jeg er sulten (semikolon)'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fillsel',vanske:'vanskeleg',
 q:'Velg riktig tegn i hver setning.',
 items:[
  {pre:'Hun gikk hjem',alt:[', og','. Og','og'],fasit:', og',post:'han ble igjen.'},
  {pre:'Hun leste og skrev',alt:[', hele','. Hele',' hele'],fasit:' hele',post:'dagen.'},
  {pre:'Hun sa',alt:[': «',', «',' «'],fasit:': «',post:'Jeg kommer snart.»'}
 ],
 regel:'Komma + «og» mellom to hovedsetninger. Ingen komma når «og» binder to verb. Kolon før direkte tale.',
 eks:'Hun gikk, og han ble igjen. Hun leste og skrev. Hun sa: «Hei.»'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskeleg',
 q:'Hvor er komma nødvendig? «Læreren som underviser i norsk heter Kari.»',
 alt:['Læreren, som underviser i norsk, heter Kari.','Læreren som underviser i norsk, heter Kari.','Ingen komma trengs.','Læreren, som underviser i norsk heter Kari.'],
 fasit:'Læreren, som underviser i norsk, heter Kari.',
 regel:'Komma rundt innskutt (ikke-restriktiv) relativsetning som gir tilleggsinformasjon.',
 eks:'Læreren, som alltid er hyggelig, heter Kari.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om tegnsetting sanne eller usanne?',
 paastandar:[
  {tekst:'En setter komma foran «og» i en oppramsing.',sann:false},
  {tekst:'En setter komma etter fremskutt leddsetning.',sann:true},
  {tekst:'En setter komma foran «at» i norsk.',sann:false},
  {tekst:'Kolon innleder en forklaring eller en liste.',sann:true},
  {tekst:'Semikolon knytter to selvstendige setninger uten bindeord.',sann:true}
 ],
 regel:'Ikke komma foran siste «og» i oppramsing. Ikke komma foran «at». Kolon = «nemlig».',
 eks:'brød, melk og ost (ikke komma før og)'},

/* ═══════════════════════════════════════════════════
  6. ORDKLASSER  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'ordklasser',kat_label:'Ordklasser',type:'drag_kolonne',vanske:'lett',
 q:'Dra hvert ord til riktig ordklasse: substantiv eller verb?',
 kolonner:['Substantiv','Verb'],
 ord:[
  {tekst:'bok',fasit:0},{tekst:'løper',fasit:1},
  {tekst:'hund',fasit:0},{tekst:'sover',fasit:1},
  {tekst:'skole',fasit:0},{tekst:'skriver',fasit:1},
  {tekst:'glede',fasit:0},{tekst:'hopper',fasit:1}
 ],
 regel:'Substantiv er navn på ting, personer, steder og begreper. Verb sier hva noen gjør eller er.',
 eks:'Substantiv: bok, hund, skole. Verb: løper, sover, skriver.'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'drag_kolonne',vanske:'medium',
 q:'Dra hvert ord til riktig ordklasse: adjektiv eller adverb?',
 kolonner:['Adjektiv','Adverb'],
 ord:[
  {tekst:'rask',fasit:0},{tekst:'raskt',fasit:1},
  {tekst:'vakker',fasit:0},{tekst:'alltid',fasit:1},
  {tekst:'glad',fasit:0},{tekst:'svært',fasit:1},
  {tekst:'stor',fasit:0},{tekst:'sjelden',fasit:1}
 ],
 regel:'Adjektiv beskriver substantiv. Adverb modifiserer verb, adjektiv eller andre adverb.',
 eks:'rask gut (adj.) · spring raskt (adv.) · alltid glad (adv. + adj.)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Dra hvert ord til riktig ordklasse: pronomen eller konjunksjon?',
 kolonner:['Pronomen','Konjunksjon'],
 ord:[
  {tekst:'hun',fasit:0},{tekst:'og',fasit:1},
  {tekst:'de',fasit:0},{tekst:'men',fasit:1},
  {tekst:'seg',fasit:0},{tekst:'eller',fasit:1},
  {tekst:'sin',fasit:0},{tekst:'for',fasit:1}
 ],
 regel:'Pronomen erstatter substantiv. Konjunksjoner binder sammen setninger eller ledd.',
 eks:'Pronomen: hun, de, seg. Konjunksjon: og, men, eller.'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'klikk_marker',vanske:'lett',
 q:'Klikk på alle verbene i setningen.',
 tekst:'Hunden løper fort og bjeffer høyt når naboen kommer.',
 maalordklasse:'verb',
 fasit_ord:['løper','bjeffer','kommer'],
 regel:'Verb sier hva noen gjør, tenker eller er.',
 eks:'løper, bjeffer, kommer = handlingsverb'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'klikk_marker',vanske:'medium',
 q:'Klikk på alle substantivene i setningen.',
 tekst:'Læreren skrev en lang oppgave på tavlen hver dag.',
 maalordklasse:'substantiv',
 fasit_ord:['læreren','oppgave','tavlen','dag'],
 regel:'Substantiv er navn på personer, ting, steder og begreper.',
 eks:'læreren (person), oppgave (ting), tavlen (ting), dag (tid/begrep)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hvilken ordklasse hører «rask» til i «Han er en rask løper»?',
 alt:['Substantiv','Adjektiv','Verb','Adverb'],
 fasit:'Adjektiv',
 regel:'Adjektiv beskriver substantiv. Her beskriver «rask» substantivet «løper».',
 eks:'en rask løper · en stor bok · et rødt hus'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'medium',
 q:'Hvilken ordklasse er «fort» i «Han løper fort»?',
 alt:['Adjektiv','Adverb','Verb','Preposisjon'],
 fasit:'Adverb',
 regel:'Adverb sier hvordan, når eller hvor mye. Her sier «fort» hvordan han løper.',
 eks:'fort, sakte, alltid, aldri, svært'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'klikk_marker',vanske:'medium',
 q:'Klikk på hvert ord som er et verb i setningen.',
 tekst:'Hun skrev brevet raskt og sendte det samme kvelden.',
 fasit_ord:['skrev','sendte'],
 regel:'Verb sier hva noen gjør. «Skrev» og «sendte» er handlingsverb i preteritum.',
 eks:'skrev (å skrive) · sendte (å sende)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'cloze',vanske:'lett',
 q:'«Raskt» i «Han sprang raskt» er et ___.',
 hint:'Ordet sier noe om hvordan han sprang – det endrer verbet.',
 fasit:'adverb',fasit_v:['adverb','biord'],
 regel:'Adverb modifiserer verb. Her modifiserer «raskt» verbet «sprang».',
 eks:'Han sprang raskt. Hun sang vakkert. De jobbet hardt.'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'vanskeleg',
 q:'Hvilken ordklasse er «fordi» i «Hun gikk hjem fordi hun var trøtt»?',
 alt:['Subjunksjon','Konjunksjon','Adverb','Preposisjon'],
 fasit:'Subjunksjon',
 regel:'Subjunksjoner innleder leddsetninger. «Fordi» innleder en årsaks-leddsetning.',
 eks:'fordi, at, når, om, selv om, mens, siden, dersom'},

/* ═══════════════════════════════════════════════════
  7. SETNINGSBYGGING  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'lett',
 q:'Sett ordene i riktig rekkefølge (V2-regelen, tidsadverbial først).',
 ord:['I','dag','skal','vi','ha','prøve','.'],
 fasit:'I dag skal vi ha prøve .',
 regel:'Etter fremskutt adverbial kommer verbet på plass 2: «I dag skal vi …».',
 eks:'I dag skal vi … · I går gikk hun …'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 q:'Sett ordene i riktig rekkefølge (leddsetning med «at»).',
 ord:['Hun','sier','at','han','ikke','kommer','.'],
 fasit:'Hun sier at han ikke kommer .',
 regel:'I leddsetning («at …»): nektingsadverbet «ikke» kommer foran verbet.',
 eks:'Hun sier at han ikke kommer. Jeg tror at det ikke stemmer.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 q:'Sett ordene i riktig rekkefølge (spørresetning).',
 ord:['Hvorfor','kom','du','ikke','i','går','?'],
 fasit:'Hvorfor kom du ikke i går ?',
 regel:'Spørresetning: spørreord – verb – subjekt – resten.',
 eks:'Hvorfor kom du …? Hvor bor hun …?'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva er problemet med: «Han gikk tur og det var kaldt og han hadde ikke lue og det var dumt.»?',
 alt:['For mange «og» - teksten bør deles opp','«Tur» er feil ord','«Kaldt» er feil','Det er ingen feil'],
 fasit:'For mange «og» - teksten bør deles opp',
 regel:'Unngå lange kjeder med «og». Del opp med punktum og varier setningsoppbyggingen.',
 eks:'Han gikk tur. Det var kaldt, og han angret på at han hadde glemt lua.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Hva er den beste sammenslåingen av: «Brettspill er bra. Brettspill samler folk. Brettspill er sosialt.»?',
 alt:['Brettspill er sosialt og samler folk til felles aktivitet.','Brettspill er bra, samler folk og brettspill er sosialt.','Brettspill er bra. Og sosialt. Og samler folk.','Brettspill er bra fordi brettspill er sosialt og samler folk.'],
 fasit:'Brettspill er sosialt og samler folk til felles aktivitet.',
 regel:'Slå sammen setninger med samme tema. Unngå å gjenta samme ord flere ganger.',
 eks:'Brettspill er sosialt og samler folk til felles aktivitet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskeleg',
 q:'Hva er den beste faglige omskrivingen av: «Klimaendringer er et veldig stort problem og sånn, og det påvirker alle.»?',
 alt:['Klimaendringer er et alvorlig globalt problem som krever handling fra alle.','Klimaendringer er et veldig alvorlig og stort problem.','Klimaendringene er store og alle bør gjøre noe.','Klimaendringer er et problem som påvirker oss.'],
 fasit:'Klimaendringer er et alvorlig globalt problem som krever handling fra alle.',
 regel:'Fjern «og sånn», vage ord og samkobling. Bruk presist og variert ordvalg.',
 eks:'«veldig stort» -> «alvorlig globalt» · «og sånn» -> fjern'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'sorter_rekke',vanske:'medium',
 q:'Sett delene i riktig rekkefolge for en faglig innledning.',
 items:[
  {tekst:'Presentere temaet'},
  {tekst:'Gi bakgrunnsinformasjon'},
  {tekst:'Formulere problemstilling'},
  {tekst:'Varsle oppbyggingen av teksten'}
 ],
 regel:'En god innledning: tema → bakgrunn → problemstilling → oppbyggingssignal.',
 eks:'Klimaendringer er … [tema] → Forskning viser … [bakgrunn] → Spørsmålet er … [problemstilling]'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'fix',vanske:'vanskeleg',
 q:'Forbedre teksten: fjern gjentakelse og muntlige uttrykk.',
 tekst:'Det er bra å trene fordi det er bra for helsa. Trening er bra og trening gjør at du blir sterkere og sånt.',
 errors:{'Det er bra å trene fordi det er bra for helsa.':'Regelmessig trening styrker helsa.','Trening er bra og trening gjør at du blir sterkere og sånt.':'Fysisk aktivitet forbedrer både kondisjon og muskelstyrke.'},
 fasit:'Regelmessig trening styrker helsa. Fysisk aktivitet forbedrer både kondisjon og muskelstyrke.',
 regel:'Unngå å gjenta samme ord. Bruk synonymer og variert ordvalg. Fjern «og sånt».',
 eks:'«bra» → «styrker helsa» · «sterkere og sånt» → «forbedrer kondisjon og muskelstyrke»'},

/* ═══════════════════════════════════════════════════
  8. BINDEORD  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Velg riktig bindeord: «Hun var trøtt, ___ gikk hun hjem.»',
 alt:['derfor','men','fordi','og'],
 fasit:'derfor',
 regel:'«Derfor» viser konsekvens: hun var trøtt → derfor gikk hun hjem.',
 eks:'Hun var trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Velg rett bindeord: «Det regner, ___ vi går ut likevel.»',
 alt:['men','derfor','fordi','og'],
 fasit:'men',
 regel:'«Men» viser kontrast – to ting som går mot hverandre.',
 eks:'Det regner, men vi går ut likevel.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hva er forskjellen mellom «men» og «selv om»?',
 alt:['«Men» knytter to hovedsetninger; «selv om» innleder en leddsetning','De betyr det samme','«Selv om» er sterkere enn «men»','«Men» er bokmål; «selv om» er nynorsk'],
 fasit:'«Men» knytter to hovedsetninger; «selv om» innleder en leddsetning',
 regel:'«Men» = koordinerende. «Selv om» = subordinerende (innleder leddsetning).',
 eks:'Hun er trøtt, men hun leser. Selv om hun er trøtt, leser hun.'},

{kat:'bindeord',kat_label:'Bindeord',type:'fillsel',vanske:'medium',
 q:'Velg riktig bindeord i hver setning.',
 items:[
  {pre:'Hun trente mye,',alt:['derfor','men','fordi'],fasit:'derfor',post:'vant hun.'},
  {pre:'',alt:['Selv om','Fordi','Derfor'],fasit:'Selv om',post:'det regner, går vi tur.'},
  {pre:'Forskning viser gode resultater;',alt:['likevel','derfor','fordi'],fasit:'likevel',post:'er det utfordringer.'},
  {pre:'Hun gikk til legen',alt:['men','fordi','likevel'],fasit:'fordi',post:'hun var syk.'}
 ],
 regel:'Derfor = konsekvens. Selv om = motsetning. Likevel = kontrast. Fordi = årsak.',
 eks:'trente → derfor vant · selv om det regner → likevel'},

{kat:'bindeord',kat_label:'Bindeord',type:'fillsel',vanske:'vanskeleg',
 q:'Velg det mest presise bindeordet.',
 items:[
  {pre:'KI kan være nyttig,',alt:['men','og','derfor'],fasit:'men',post:'det reiser etiske spørsmål.'},
  {pre:'Hun øvde mye.',alt:['Dessuten','Likevel','Derfor'],fasit:'Dessuten',post:'leste hun teori hver kveld.'},
  {pre:'Han studerte flittig,',alt:['altså','likevel','og'],fasit:'likevel',post:'strøk han på eksamen.'}
 ],
 regel:'Men = motsetning. Dessuten = tillegg. Likevel = uventet kontrast.',
 eks:'nyttig, men etiske spørsmål · øvde, dessuten leste teori · studerte, likevel strøk'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 q:'Sett ordene i riktig rekkefølge (V2 etter «derfor»).',
 ord:['Derfor','gikk','hun','hjem','tidlig','.'],
 fasit:'Derfor gikk hun hjem tidlig .',
 regel:'Etter «derfor» kommer verbet foran subjektet (V2-regelen).',
 eks:'Derfor gikk hun … · Likevel møtte han …'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 q:'Sett ordene i riktig rekkefølge (V2 etter «likevel»).',
 ord:['Likevel','møtte','han','opp','på','skolen','.'],
 fasit:'Likevel møtte han opp på skolen .',
 regel:'Etter «likevel» kommer verbet foran subjektet (V2-regelen).',
 eks:'Likevel møtte han … · Dessuten er det …'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_kolonne',vanske:'medium',
 q:'Sorter bindeordene etter funksjon: årsak eller kontrast?',
 kolonner:['Årsak / konsekvens','Kontrast / motsetning'],
 ord:[
  {tekst:'fordi',fasit:0},
  {tekst:'likevel',fasit:1},
  {tekst:'derfor',fasit:0},
  {tekst:'men',fasit:1},
  {tekst:'ettersom',fasit:0},
  {tekst:'selv om',fasit:1}
 ],
 regel:'Fordi, derfor, ettersom = årsak/konsekvens. Likevel, men, selv om = kontrast.',
 eks:'fordi hun øvde (årsak) · likevel strøk han (kontrast)'},

{kat:'bindeord',kat_label:'Bindeord',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Sosiale medier kan være nyttige. ___, kan de ha negative konsekvenser.»',
 hint:'Du trenger et bindeord som viser kontrast.',
 fasit:'Likevel',fasit_v:['Likevel','Derimot','Til tross for dette','På den andre siden'],
 regel:'«Likevel», «derimot» og «på den andre siden» viser kontrast.',
 eks:'Sosiale medier er nyttige. Likevel kan de ha negative konsekvenser.'},

{kat:'bindeord',kat_label:'Bindeord',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «___ ungdom skriver mer enn noen gang, betyr det ikke at de skriver bedre.»',
 hint:'Hvilket bindeord viser at noe skjer til tross for noe annet?',
 fasit:'Selv om',fasit_v:['Selv om','Til tross for at'],
 regel:'«Selv om» innleder en leddsetning som viser kontrast.',
 eks:'Selv om det er vanskelig, prøver hun.'},

/* ═══════════════════════════════════════════════════
  9. TEKSTSTRUKTUR  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'lett',
 q:'Sorter avsnittene til riktig del av fagartikkelen.',
 lag:['Innledning','Hoveddel','Avslutning'],
 avsnitt:[
  {tekst:'Plast i havet er et økende problem som påvirker dyr og natur over hele verden.',lag:0},
  {tekst:'En løsning er å innføre strengere regulering av engangsplast i alle EU-land.',lag:1},
  {tekst:'Kildesortering og bedre infrastruktur kan også redusere problemet.',lag:1},
  {tekst:'Alt i alt viser dette at plastforurensning krever samarbeid på tvers av landegrenser.',lag:2}
 ],
 regel:'Innledningen presenterer temaet. Hoveddelen utdyper. Avslutningen konkluderer.',
 eks:'Innledning → tema · Hoveddel → argument · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'medium',
 q:'Sorter avsnittene fra et debattinnlegg om skjermtid til riktig del.',
 lag:['Innledning med påstand','Argument for','Motargument og tilbakevisning','Avslutning'],
 avsnitt:[
  {tekst:'Barn under tolv år bør ikke ha egen mobiltelefon.',lag:0},
  {tekst:'Forskning viser at mye skjermtid reduserer konsentrasjonsevnen hos unge.',lag:1},
  {tekst:'Noen vil hevde at mobilen er nødvendig for trygghet, men det finnes enklere alternativ.',lag:2},
  {tekst:'Alt i alt er det gode grunner til å begrense tilgangen til mobiler for barn.',lag:3}
 ],
 regel:'Debattinnlegg: påstand → argument → motargument + tilbakevisning → konklusjon.',
 eks:'Påstand tidlig · Argument med kilde · Motargument tilbakevist · Konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Hva er en ingress?',
 alt:['En til to setninger som innleder og presenterer temaet','Den lengste hoveddelen av teksten','Kildelista nederst i teksten','Avslutningen av teksten'],
 fasit:'En til to setninger som innleder og presenterer temaet',
 regel:'Ingressen kommer etter overskriften og gir leseren et raskt overblikk.',
 eks:'«Plasten i havet er en av vår tids største miljøtrusler. Her er det du trenger å vite.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Hva er feil med en avslutning i en fagartikkel?',
 alt:['Den skal introdusere ny informasjon','Den skal oppsummere hovedpoengene','Den bør knytte an til innledningen','Den bør være kortere enn hoveddelen'],
 fasit:'Den skal introdusere ny informasjon',
 regel:'Avslutningen oppsummerer og avrunder – den tar ikke opp nye tema.',
 eks:'Feil: «Forresten er det også et problem med havforsuring …» (nytt tema i avslutningen)'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'avsnitt_klikk',vanske:'lett',
 q:'Klikk på det første ordet der et nytt avsnitt bør starte.',
 segments:[
  {id:'s0',tekst:'Klimaendringer er et av de største problemene vi står overfor i dag.'},
  {id:'s1',tekst:'Gjennomsnittstemperaturen har steget med over én grad siden den industrielle revolusjonen.',first_word:'Gjennomsnittstemperaturen'},
  {id:'s2',tekst:'For å stoppe oppvarmingen må verdenssamfunnet kutte utslipp drastisk.',first_word:'For'},
  {id:'s3',tekst:'Mange land har allerede innført tiltak mot karbonutslipp.',first_word:'Mange'}
 ],
 fasit_breaks:['s2'],
 regel:'Nytt avsnitt ved nytt poeng. «For å stoppe …» skifter fra problem til løsning.',
 eks:'Avsnitt 1: fakta om problemet · Avsnitt 2: hva som må gjøres'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'medium',
 q:'Hvilken overskrift er faglig god, og hvilken er dårlig?',
 kolonner:['God faglig overskrift','Dårlig overskrift'],
 ord:[
  {tekst:'Klimaendringer: hva ungdom kan gjøre',fasit:0},
  {tekst:'DET ER VIKTIG Å REDDE PLANETEN VÅR!!!',fasit:1},
  {tekst:'Sosiale medium og psykisk helse hos ungdom',fasit:0},
  {tekst:'En liten tekst om klima og sånne ting',fasit:1}
 ],
 regel:'En god faglig overskrift er presis, nøytral og lover hva teksten handler om.',
 eks:'God: «Klimaendringer: hva ungdom kan gjøre» · Dårlig: vag, skrikende, uformell'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Hva hører hjemme i et drøftende debattinnlegg og hva ikke?',
 kolonner:['Hører hjemme','Hører IKKE hjemme'],
 ord:[
  {tekst:'Argument for og mot påstanden',fasit:0},
  {tekst:'Konklusjon med egen vurdering',fasit:0},
  {tekst:'Personlig fortelling om en gang du var lei',fasit:1},
  {tekst:'Historien til mobiltelefonen fra 1973 til i dag',fasit:1},
  {tekst:'Kildetilvisning til forskning',fasit:0},
  {tekst:'Hvordan du lager en app',fasit:1}
 ],
 regel:'«Drøft» = argument for og mot + konklusjon. Personlige fortellinger og historikk uten tilknytning hører ikke hjemme.',
 eks:'Hører hjemme: argument, kilde, konklusjon · Ikke: irrelevant historie'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Et godt avsnitt har: temasetning → ___ → avslutningssetning.',
 hint:'Hva kommer mellom temasetning og avslutning - det som utdyper hovedpoenget?',
 fasit:'utdypende setninger',
 fasit_v:['utdypende setninger','kommentarsetninger','forklaringer og eksempler','utdyping','kommentarer'],
 regel:'Etter temasetning kommer utdypende kommentarsetninger med forklaring, bevis og eksempler.',
 eks:'Temasetning → forklaring → bevis/kilde → kommentar'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Fyll inn et overgangsord: «KI kan effektivisere arbeidet, ___ reiser det også etiske spørsmål.»',
 hint:'Du trenger et ord som viser motsetning.',
 fasit:'men',fasit_v:['men','likevel','samtidig'],
 regel:'«Men» og «likevel» signaliserer motsetning og er sentrale i drøftende tekster.',
 eks:'KI er nyttig, men vi må stille kritiske spørsmål.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'sorter_rekke',vanske:'vanskeleg',
 q:'Sett delene av et faglig avsnitt i riktig rekkefølge.',
 items:[
  {tekst:'Temasetning: presenterer hovedpoenget i avsnittet'},
  {tekst:'Utdyping: forklarer med fakta eller eksempler'},
  {tekst:'Kildetilvisning: støtter påstanden med dokumentasjon'},
  {tekst:'Kommentar: oppsummerer og peker mot neste avsnitt'}
 ],
 regel:'Temasetning → utdyping → kilde → kommentar = standard avsnittstruktur.',
 eks:'Plast er farlig [tema] → 80 % av sjøfugler [utdyping] → (WWF, 2023) [kilde] → Dette viser … [komm.]'},

/* ═══════════════════════════════════════════════════
  10. KILDEBRUK  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvordan skriver du en kildetilvisning i teksten?',
 alt:['(Etternavn, årstall)','[lenke til nettsiden]','Forfatter: tittel','«sitat» – kilde'],
 fasit:'(Etternavn, årstall)',
 regel:'Standardformat: (Etternavn, årstall) i parentes etter påstanden.',
 eks:'Plasten har økt med 40 % (Jensen, 2024).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvor i teksten skal kildelisten stå?',
 alt:['Helt til slutt i dokumentet','I innledningen','Midt i teksten','Rett etter første kilde'],
 fasit:'Helt til slutt i dokumentet',
 regel:'Kildelisten kommer alltid aller sist, gjerne med overskriften «Kildeliste».',
 eks:'Hovedtekst → avslutning → kildeliste'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva er feil kildebruk?',
 alt:['Kopiere et avsnitt uten sitat og kilde','Bruke en påstand med (Jensen, 2024)','Skrive «Ifølge Miljødirektoratet (2023)»','Ha kildeliste på slutten'],
 fasit:'Kopiere et avsnitt uten sitat og kilde',
 regel:'Å kopiere uten å markere sitat og oppgi kilde er plagiat.',
 eks:'Feil: kopiert tekst. Rett: «…» (Kilde, årstall) eller parafrase (Kilde, årstall).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om kildebruk sanne eller usanne?',
 paastandar:[
  {tekst:'Kildelisten skal være sortert alfabetisk etter etternavn.',sann:true},
  {tekst:'Wikipedia er alltid en god kilde å sitere i en fagartikkel.',sann:false},
  {tekst:'Direkte sitat skal stå i hermetegn med kildetilvisning.',sann:true},
  {tekst:'Man trenger ikke kilde hvis man skriver med egne ord.',sann:false}
 ],
 regel:'Alfabetisk kildeliste. Wikipedia er ikke siterbar. Omskriving trenger også kilde.',
 eks:'Omskriving: Din formulering (Kilde, årstall). Sitat: «Ordrett» (Kilde, årstall).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om kildekritikk sanne eller usanne?',
 paastandar:[
  {tekst:'En primærkilde er en original rapport eller en lov.',sann:true},
  {tekst:'Sensasjonsoverskrifter er et tegn på pålitelig journalistikk.',sann:false},
  {tekst:'Man bør vurdere forfatterens kompetanse og mulig agenda.',sann:true},
  {tekst:'Fagfellevurderte tidsskrift har høy standard.',sann:true},
  {tekst:'Alder på en kilde spiller aldri noen rolle.',sann:false}
 ],
 regel:'Vurder: hvem, hvor, når, hvorfor. Fagfellevurdering = kvalitetsstempel.',
 eks:'Primærkilde: NOU-rapport. Sekundærkilde: avisomtale av rapporten.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'drag_kolonne',vanske:'medium',
 q:'Hva trenger hermetegn (direkte sitat), og hva kan stå fritt med kildetilvisning (omskriving)?',
 kolonner:['Trenger hermetegn (sitat)','Kan stå fritt (omskriving)'],
 ord:[
  {tekst:'«1,3 millioner tonn plast havner i havet hvert år»',fasit:0},
  {tekst:'Forskning viser at plast er et økende problem i verdenshavene.',fasit:1},
  {tekst:'«Mikroplast trenger inn i næringskjeden og skader dyrelivet»',fasit:0},
  {tekst:'Havpattedyr og fugler er særlig utsatt for plastforurensning.',fasit:1}
 ],
 regel:'Sett hermetegn bare ved ordrett sitering. Egen omskriving trenger kilde, men ikke hermetegn.',
 eks:'Sitat: «Ordrett» (Kilde, årstall). Omskriving: Din formulering (Kilde, årstall).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Hva er tegn på troverdig kilde, og hva er varselsignaler?',
 kolonner:['Tegn på troverdig kilde','Varseltegn'],
 ord:[
  {tekst:'Kjent forfatter med faglig bakgrunn',fasit:0},
  {tekst:'Sensasjonsoverskrift med utropstegn',fasit:1},
  {tekst:'Kildetilvisninger og publiseringsdato',fasit:0},
  {tekst:'Anonym avsender uten dato',fasit:1},
  {tekst:'Tilknytning til universitet eller forskningsmiljø',fasit:0},
  {tekst:'Bare ett synspunkt uten motargument',fasit:1}
 ],
 regel:'Troverdig: kjent forfatter, kilder, dato, institusjon. Varsel: anonym, sensasjon, ensidig.',
 eks:'Forskning.no: forfatter, fagredaksjon, kilder. Anonym blogg: varseltegn.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'cloze',vanske:'medium',
 q:'Fyll inn det rette ordet: Villspor. (2023). Friluftsliv fra 1970 til i dag. ___ 15. mars 2026 fra: magasinetvillspor.no/…',
 hint:'Hvilket standardord brukes i kildelisten for å fortelle at du har besøkt en nettside?',
 fasit:'Hentet',fasit_v:['Hentet','hentet'],
 regel:'Standardfrasen i kildelisten er «Hentet [dato] fra:» for nettkilder.',
 eks:'Jensen, K. (2024). Tittel. Hentet 15. mars 2026 fra: lenke.no'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskeleg',
 q:'Hvilket av disse er et korrekt sitat med kildetilvisning?',
 alt:['«Det har aldri vært mer kunstsnø i skibakkene» (NRK, 2022).','NRK skrev i 2022 at det er mye kunstsnø.','Kunstsnø er mye brukt (kilden er NRK).','(NRK) Det er mye kunstsnø.'],
 fasit:'«Det har aldri vært mer kunstsnø i skibakkene» (NRK, 2022).',
 regel:'Direkte sitat: hermetegn rundt ordrett tekst, deretter (Kilde, årstall) i parentes.',
 eks:'«Ordrett tekst» (Etternavn, årstall).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mcset',vanske:'vanskeleg',
 q:'Les setningen og svar: «Ifølge NRK (2024) har snøsesongen blitt kortere de siste ti årene.»',
 questions:[
  {q:'Hvilken type kildebruk er dette?',alt:['Direkte sitat','Parafrase/omskriving','Plagiat'],fasit:1},
  {q:'Er kildetilvisningen riktig plassert?',alt:['Ja','Nei – den bør stå etter punktum','Nei – den mangler hermetegn'],fasit:0},
  {q:'Hvilken type kilde er NRK?',alt:['Primærkilde','Sekundærkilde','Ikke en gyldig kilde'],fasit:1}
 ],
 regel:'Parafrase = egen formulering med kilde. NRK rapporterer om annen forskning = sekundærkilde.',
 eks:'Parafrase: «Ifølge NRK (2024) …» – egne ord, med kilde.'},

/* ═══════════════════════════════════════════════════
  11. OPPGAVETOLKING  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsordet «drøft» i en norskoppgave?',
 alt:['Presenter bare ett synspunkt','Vis to sider og vei dem mot hverandre','Skriv en kreativ tekst','Beskriv hvordan noe ser ut'],
 fasit:'Vis to sider og vei dem mot hverandre',
 regel:'«Drøft» = presenter argument for og mot, og trekk en konklusjon.',
 eks:'«Drøft om skolen bør forby mobiler» = argument for + mot + konklusjon.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsordet «grei ut om»?',
 alt:['Ta tydelig stilling','Forklar og informer grundig','Sammenlign to syn','Skriv kreativt'],
 fasit:'Forklar og informer grundig',
 regel:'«Grei ut om» = forklarende og informerende skriving uten å ta stilling.',
 eks:'«Grei ut om årsaker til utenforskap» = forklar hvorfor det skjer.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'medium',
 q:'Oppgaven sier: «Presenter hovedkarakteren, og drøft hvordan forfatteren bruker kontraster.» Hvor mange deler har oppgaven?',
 alt:['Én del','To deler','Tre deler','Fire deler'],
 fasit:'To deler',
 regel:'«Presenter … og drøft» = to bestillingsord = to deler. Tell alltid bestillingsordene.',
 eks:'Del 1: presenter hovedkarakteren. Del 2: drøft bruken av kontraster.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'drag_kolonne',vanske:'lett',
 q:'Oppgaven er: «Drøft om skolen bør innføre mobilforbud.» Hva hører hjemme i svaret?',
 kolonner:['Passer til oppgaven','Passer IKKE'],
 ord:[
  {tekst:'Argument for mobilforbud',fasit:0},
  {tekst:'Argument mot mobilforbud',fasit:0},
  {tekst:'Konklusjon med egen vurdering',fasit:0},
  {tekst:'Historien til mobiltelefonen (1973–i dag)',fasit:1},
  {tekst:'Hvordan man lager en mobiltelefon',fasit:1},
  {tekst:'Personlig fortelling om mobiltyveri',fasit:1}
 ],
 regel:'«Drøft» = argument for + mot + konklusjon. Irrelevant historikk og personlige fortellinger hører ikke hjemme.',
 eks:'Hører hjemme: argument, kilde, konklusjon. Ikke: historie om mobilen.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'drag_kolonne',vanske:'medium',
 q:'Oppgaven er: «Analyser hvordan forfatteren bruker naturskildringer i novellen.» Hva hører hjemme?',
 kolonner:['Hører hjemme','Hører IKKE hjemme'],
 ord:[
  {tekst:'Hvilken funksjon har naturskildringen i teksten?',fasit:0},
  {tekst:'Hvilke litterære virkemidler bruker forfatteren?',fasit:0},
  {tekst:'Handlingsreferat: hva skjer i novellen?',fasit:1},
  {tekst:'Forfatterens biografi og liv',fasit:1},
  {tekst:'Hvordan skaper naturskildringen stemning?',fasit:0},
  {tekst:'«Jeg synes naturskildringen var fin»',fasit:1}
 ],
 regel:'«Analyser» = undersøk hvordan noe er bygd opp og hvilken funksjon det har. Ikke referat eller personlige meninger.',
 eks:'Analyse = virkemidler + funksjon. Ikke = «jeg synes dette er fint».'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om oppgavetolking sanne eller usanne?',
 paastandar:[
  {tekst:'Bestillingsord er verbene som forteller hva du skal gjøre i oppgaven.',sann:true},
  {tekst:'«Presenter» og «drøft» krever samme type tekst.',sann:false},
  {tekst:'«Sammenlign» betyr å peke på likheter og forskjeller.',sann:true},
  {tekst:'«Reflekter» betyr å gjenfortelle hendelser i rekkefølge.',sann:false}
 ],
 regel:'Presenter = gi oversikt. Drøft = vei argument. Sammenlign = likheter/forskjeller. Reflekter = tenke over, vurdere.',
 eks:'Drøft ≠ presenter. Reflekter ≠ gjenfortell.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'cloze',vanske:'medium',
 q:'Oppgaven sier «analyser». Det betyr at du skal undersøke ___ teksten er bygd opp og hvilken effekt grepene har.',
 hint:'Analyse handler om å undersøke en bestemt ting: oppbyggingen. Hvilket spørreord passer?',
 fasit:'hvordan',fasit_v:['hvordan'],
 regel:'Analyse = systematisk undersøkelse av hvordan noe er laget og hva det gjør med leseren.',
 eks:'Hvordan bruker forfatteren metaforer? Hvordan skaper fortellerstemmen nærhet?'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'vanskeleg',
 q:'Tre elever svarer på «Drøft om teknologi gjør oss mer isolerte». Hvem er på bom?',
 alt:['Elev A viser argument for og mot, og konkluderer.','Elev B skriver om historien til internett og teknologien.','Elev C bruker tre kilder og veier side mot side.','Elev D starter personlig, drøfter og konkluderer.'],
 fasit:'Elev B skriver om historien til internett og teknologien.',
 regel:'«Drøft» = vei argument for og mot. Å skrive historikk er «grei ut», ikke drøfting.',
 eks:'Bom: svare med feil sjanger. «Grei ut»-svar der «drøft» var kravet.'},

/* ═══════════════════════════════════════════════════
  12. SPRÅK OG STIL  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'lett',
 q:'Klikk på hvert ord som er for uformelt for en fagartikkel.',
 tekst:'Plast i havet er jo helt farlig for dyr og sånn.',
 fasit_feil:['jo','helt','sånn'],
 regel:'Fagartikler unngår forsterkningsord («helt»), fyllord («jo») og vage uttrykk («og sånn»).',
 eks:'Unngå: «jo, helt, og sånn». Skriv: «Plast i havet er en dokumentert trussel mot dyrelivet.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Klikk på ordene som gjør teksten for subjektiv for en fagartikkel.',
 tekst:'Jeg synes egentlig at forskningen er superviktig, og at vi bare må handle nå.',
 fasit_feil:['jeg','synes','egentlig','superviktig','bare'],
 regel:'I faglig stil toner man ned personlige meninger og forsterkerord.',
 eks:'Unngå: «Jeg synes dette er superviktig». Skriv: «Forskningen tyder på at temaet er viktig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på ordene som gjør argumentasjonen for følelsesladet.',
 tekst:'Kildene viser tydelig at dette er ekstremt farlig, og alle forstår jo at vi må handle straks.',
 fasit_feil:['tydelig','ekstremt','alle','forstår','jo','straks'],
 regel:'Absolutte og følelsesladete ord bør byttes med nøytrale, etterprøvbare formuleringer.',
 eks:'Unngå: «alle forstår jo». Skriv: «Flere studier peker i samme retning.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Hvilken setning er skrevet i et saklig, faglig register?',
 alt:['PLAST ER FARLIG!!!','Plast representerer en dokumentert risiko for marint dyreliv.','Plast er jo farlig, det er liksom helt klart.','Jeg mener plast er ganske skadelig.'],
 fasit:'Plast representerer en dokumentert risiko for marint dyreliv.',
 regel:'Faglig autoritet kommer av presist ordvalg og kildetilvisning, ikke utropstegn.',
 eks:'Faglig: «en dokumentert risiko» · Uformelt: «jo, helt, liksom»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Hva er det beste faglige alternativet til: «Plast i havet er skikkelig krise, og dyrene sliter skikkelig mye»?',
 alt:['Plast i havet er krise, og dyrene sliter mye.','Det er helt klart at plasten ødelegger for dyrene.','Plastforurensning i havet har alvorlige konsekvenser for dyrelivet.','Plast er et veldig stort problem for dyr i havet.'],
 fasit:'Plastforurensning i havet har alvorlige konsekvenser for dyrelivet.',
 regel:'Formell stil krever presise fagord og nøytral tone. Muntlige forsterkerord skal erstattes.',
 eks:'«skikkelig krise» → «alvorlige konsekvenser» · «sliter mye» → «konsekvenser for dyrelivet»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykkene: uformelle eller formelle?',
 kolonner:['Uformelle formuleringer','Formelle formuleringer'],
 ord:[
  {tekst:'liksom',fasit:0},
  {tekst:'jo',fasit:0},
  {tekst:'helt sykt',fasit:0},
  {tekst:'det tyder på at',fasit:1},
  {tekst:'forskning viser at',fasit:1},
  {tekst:'dokumenterte funn',fasit:1}
 ],
 regel:'Uformelle ord er muntlige og personlige. Formelle uttrykk er presise og faglige.',
 eks:'«jo/liksom» = uformelt · «forskning viser at» = formelt'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Publiseringsportalen: hvilken formulering blir blokkert som for skråsikker, og hva passerer?',
 kolonner:['Blokkert – for skråsikker','Passerer – faglig nyansert'],
 ord:[
  {tekst:'Dette beviser definitivt at tiltaket virker.',fasit:0},
  {tekst:'Funnene tyder på at tiltaket kan ha effekt.',fasit:1},
  {tekst:'Alle forskere er enige om dette.',fasit:0},
  {tekst:'Flere studier indikerer en mulig sammenheng.',fasit:1},
  {tekst:'Det er et faktum at skolen svikter ungdom.',fasit:0},
  {tekst:'Man kan argumentere for at skolen trenger mer ressurser.',fasit:1}
 ],
 regel:'Faglig skriving uttrykker bare det man kan dokumentere. «Tyder på» og «indikerer» viser nøyaktighet.',
 eks:'Blokkert: «beviser definitivt». Passerer: «tyder på, indikerer, kan argumentere for».'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'lett',
 q:'Bytt ut «kjempeviktig» med et formelt ord: «Tiltaket var ___ for å redusere frafall i skolen.»',
 hint:'Presist og formelt – ikke «kjempe-» eller «super-».',
 fasit:'avgjørende',fasit_v:['avgjørende','kritisk','vesentlig','sentral','nødvendig','særlig viktig'],
 regel:'Uformelle forsterkere som «kjempe-» erstattes med presise adjektiv.',
 eks:'«kjempeviktig» → «avgjørende» · «superbra» → «særlig vellykket»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'omskriv',vanske:'medium',
 q:'Skriv om setningen til faglig stil.',
 tekst:'Jeg tror egentlig at skjermbruk er ganske dårlig for unge, for de blir jo helt oppslukte.',
 instruksjon:'Fjern personlige meningsmarkører og uformelle forsterkere. Bruk nøytral, faglig tone.',
 maa_ha:['skjermbruk','unge'],
 maa_ikkje_ha:['jeg','tror','egentlig','ganske','jo','helt'],
 regel:'I fagtekst bør du prioritere nøytral ordbruk og etterprøvbare påstander.',
 eks:'Mulig svar: «Høyt skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'fillsel',vanske:'medium',
 q:'Velg den mest faglige formuleringen.',
 items:[
  {pre:'',alt:['Det er jo klart at','Forskning tyder på at'],fasit:'Forskning tyder på at',post:'sosiale medier påvirker ungdom.'},
  {pre:'Tiltaket har',alt:['supergode resultater','dokumenterte positive effekter'],fasit:'dokumenterte positive effekter',post:'.'},
  {pre:'',alt:['Masse folk mener at','Flere studier indikerer at'],fasit:'Flere studier indikerer at',post:'problemet øker.'}
 ],
 regel:'Faglig stil: «forskning tyder på», «dokumenterte effekter», «flere studier indikerer».',
 eks:'Uformelt → formelt: «jo klart» → «forskning tyder på»'},

/* ═══════════════════════════════════════════════════
  13. ÅRSAK OG SAMMENHENG  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mc',vanske:'lett',
 q:'Hvilken setning uttrykker en årsak–virkning-sammenheng?',
 alt:['Sola skinner, og barna leker ute.','Sola skinner så sterkt at asfalten blir varm.','Sola skinner. Barna leker ute.','Sola skinner, men det er kaldt.'],
 fasit:'Sola skinner så sterkt at asfalten blir varm.',
 regel:'«Så … at» markerer at årsaken (solskinn) fører til virkningen (varm asfalt).',
 eks:'«Hun leste så mye at hun ble trøtt.» = årsak–virkning'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mc',vanske:'medium',
 q:'Hvilken setning bruker det mest presise årsaksuttrykket?',
 alt:['Luftforurensningen øker, og folk blir sykere.','Luftforurensningen øker. Folk blir sykere.','Den økende luftforurensningen fører til flere luftveissykdommer.','Luftforurensningen øker, men folk blir sykere.'],
 fasit:'Den økende luftforurensningen fører til flere luftveissykdommer.',
 regel:'«Fører til» viser eksplisitt hvordan A gir B. «Og» og to separate setninger er vagere.',
 eks:'Presist: «Røyking fører til større risiko.» Vagt: «Folk røyker, og de blir syke.»'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykkene: årsaksuttrykk eller kontrastuttrykk?',
 kolonner:['Årsaksuttrykk','Kontrastuttrykk'],
 ord:[
  {tekst:'fordi',fasit:0},
  {tekst:'likevel',fasit:1},
  {tekst:'derfor',fasit:0},
  {tekst:'derimot',fasit:1},
  {tekst:'ettersom',fasit:0},
  {tekst:'trass i',fasit:1},
  {tekst:'på grunn av',fasit:0},
  {tekst:'men',fasit:1}
 ],
 regel:'Fordi, derfor, ettersom, på grunn av = årsak. Likevel, derimot, trass i, men = kontrast.',
 eks:'«Hun kom for sent fordi bussen var forsinket.» «Bussen var forsinket, men hun kom likevel.»'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: hva er årsaken og hva er virkningen?',
 kolonner:['Årsak','Virkning'],
 ord:[
  {tekst:'Utslipp av klimagasser øker',fasit:0},
  {tekst:'Temperaturen på jorda stiger',fasit:1},
  {tekst:'Skogene blir hugget ned',fasit:0},
  {tekst:'Dyrearter mister leveområdene sine',fasit:1},
  {tekst:'Forbruket av fossil energi vokser',fasit:0},
  {tekst:'Isen på polene smelter',fasit:1},
  {tekst:'Jordbruk utvider seg inn i regnskogen',fasit:0},
  {tekst:'Havnivået stiger',fasit:1}
 ],
 regel:'Årsaken utløser endringen. Virkningen er resultatet. Spør: «hvorfor skjer dette?»',
 eks:'Utslipp øker (årsak) → temperatur stiger (virkning) → is smelter (virkning)'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'klikk_marker',vanske:'lett',
 q:'Klikk på ordet som markerer en årsakssammenheng.',
 tekst:'Mange arter er utrydningstruet fordi leveområdene deres blir ødelagt av avskoging.',
 maalordklasse:'årsaksord',
 fasit_ord:['fordi'],
 regel:'«Fordi» knytter en årsak til en følge: avskoging → utrydningstruede arter.',
 eks:'«fordi, siden, ettersom» = årsaksord · «men, likevel, derimot» = kontrastord'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Matprisene stiger, ___ mange familier har dårligere råd.»',
 hint:'Virkningen kommer etter årsaken. Hvilket ord viser konsekvens?',
 fasit:'derfor',fasit_v:['derfor'],
 regel:'«Derfor» er et årsaksadverb som viser at det som følger, er resultatet av årsaken.',
 eks:'Prisene steg, derfor handlet folk mindre. Veien var glatt, derfor kjørte hun sakte.'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mcset',vanske:'medium',
 q:'Les teksten og svar.',
 tekst:'Når barn leser lite, utvikler de et smalere ordforråd. Et smalt ordforråd gjør det vanskeligere å forstå fagtekster. Derfor henger lesevansker og fagvansker ofte sammen.',
 questions:[
  {q:'Hva er den første årsaken?',alt:['Barn leser lite','Smalt ordforråd','Fagvansker'],fasit:0},
  {q:'Hva er den mellomliggende virkningen?',alt:['Barna leser mer','De utvikler smalere ordforråd','Fagtekstene blir enklere'],fasit:1},
  {q:'Hvilket ord markerer den siste virkningen?',alt:['når','gjør','derfor'],fasit:2}
 ],
 regel:'Årsak–virkning kan være en kjede: A → B → C. «Derfor» signaliserer den endelige konsekvensen.',
 eks:'Lite lesing → smalt ordforråd → vanskelig å forstå fagtekster → fagvansker'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på det ene uttrykket som er feil brukt.',
 tekst:'Hun fikk gode karakterer til tross for at hun jobbet hardt hver dag.',
 fasit_feil:['tross'],
 regel:'«Til tross for» markerer noe uventet. At hardt arbeid gir gode resultater er forventet → bruk «fordi».',
 eks:'Rett: «Hun fikk gode karakterer fordi hun jobbet hardt.» Kontrast: «… dårlige til tross for at hun jobbet hardt.»'},

/* ═══════════════════════════════════════════════════
   14. REFERANSEKJEDE  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'referansekjede',kat_label:'Referansekjede',type:'mc',vanske:'lett',
 q:'Hvilket ord kan erstatte «plast» i andre setning? «Plast i havet er farlig. ___ brytes ned til mikropartikler.»',
 alt:['Plast','Materialet','Plasten','Hun'],fasit:'Materialet',
 regel:'Bruk synonym eller overbegrep for å unngå gjentagelse. «Materialet» peker tilbake på «plast».',
 eks:'plast → materialet / søppelet / forurensningen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'mc',vanske:'medium',
 q:'Hva er en referansekjede?',
 alt:['En kjede av kildehenvisninger','En måte å variere ordvalg slik at teksten henger sammen','En liste over alle substantiv i teksten','Samme ordet gjentatt for å understreke poenget'],
 fasit:'En måte å variere ordvalg slik at teksten henger sammen',
 regel:'En referansekjede er ulike ord/uttrykk som peker til samme referent gjennom en tekst.',
 eks:'Greta Thunberg → klimaaktivisten → hun → den svenske tenåringen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'fillsel',vanske:'medium',
 q:'Velg det beste referanseuttrykket i hver setning.',
 items:[
  {pre:'En isbjørn ble sett på Svalbard.',alt:['Isbjørnen','Dyret','Det'],fasit:'Dyret',post:'var tydelig utsultet.'},
  {pre:'Forskere ved UiO har funnet en ny art.',alt:['Forskerne','De','Teamet'],fasit:'Teamet',post:'publiserte funnet i Nature.'},
  {pre:'Norge produserer mye olje.',alt:['Norge','Landet','De'],fasit:'Landet',post:'investerer også i fornybar energi.'},
  {pre:'Eleven skrev et godt essay.',alt:['Eleven','Teksten hennes','Hun'],fasit:'Teksten hennes',post:'imponerte sensoren.'}
 ],
 regel:'Varier mellom pronomen (hun/de), synonym (teamet) og overbegrep (dyret, landet) for sammenheng.',
 eks:'isbjørn → dyret · forskere → teamet · Norge → landet'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykkene: Er de pronomen, synonym eller overbegrep for «Greta Thunberg»?',
 kolonner:['Pronomen','Synonym / omskriving','Overbegrep'],
 ord:[
  {tekst:'hun',fasit:0},
  {tekst:'klimaaktivisten',fasit:1},
  {tekst:'den svenske tenåringen',fasit:1},
  {tekst:'personen',fasit:2},
  {tekst:'henne',fasit:0},
  {tekst:'aktivisten',fasit:2}
 ],
 regel:'Pronomen (hun/henne) erstatter navn. Synonym omskriver (klimaaktivisten). Overbegrep generaliserer (personen).',
 eks:'hun = pronomen · klimaaktivisten = synonym · personen = overbegrep'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'klikk_marker',vanske:'medium',
 q:'Klikk på alle ordene/uttrykkene som refererer til «Greta Thunberg».',
 tekst:'Greta Thunberg holdt en tale i FN. Den unge aktivisten var tydelig sint. Hun sa at verdenslederne svikter ungdommen. Klimaforkjemperen fikk stor oppmerksomhet.',
 maalordklasse:'referanse til Greta',
 fasit_ord:['Den unge aktivisten','Hun','Klimaforkjemperen'],
 regel:'Finn alle uttrykk som peker tilbake til samme person (referent).',
 eks:'Greta → den unge aktivisten → hun → klimaforkjemperen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'fix',vanske:'medium',
 q:'Rett teksten slik at «plast» bare brukes én gang. Erstatt gjentagelsene.',
 tekst:'Plast er et stort problem. Plast finnes overalt i naturen. Plast brytes ned til små biter. Plast skader dyr og fugler.',
 errors:{'Plast finnes':'Det finnes','Plast brytes':'Materialet brytes','Plast skader':'Avfallet skader'},
 fasit:'Det finnes · Materialet brytes · Avfallet skader',
 regel:'Erstatt gjentatte substantiv med pronomen, synonym eller overbegrep for bedre flyt.',
 eks:'Plast → det / materialet / avfallet / forurensningen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandene om referansekjeder sanne eller usanne?',
 paastandar:[
  {tekst:'Pronomen som «hun» og «det» er en del av referansekjeden.',sann:true},
  {tekst:'Man bør alltid gjenta samme ord for å være tydelig.',sann:false},
  {tekst:'Overbegrep som «dyret» kan peke tilbake til «isbjørnen».',sann:true},
  {tekst:'Referansekjeder gjelder bare personer, ikke ting.',sann:false},
  {tekst:'«Denne utfordringen» kan peke tilbake til et helt avsnitt.',sann:true}
 ],
 regel:'Referansekjeder bruker pronomen, synonym og overbegrep til å binde teksten sammen uten gjentagelse.',
 eks:'isbjørn → dyret · plastproblem → denne utfordringen'},

{kat:'referansekjede',kat_label:'Referansekjede',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv om avsnittet slik at «ungdom» bare brukes én gang.',
 tekst:'Ungdom bruker mye tid på sosiale medier. Ungdom blir påvirket av det de ser. Ungdom kan utvikle dårlig selvbilde. Ungdom trenger veiledning fra voksne.',
 instruksjon:'Bruk pronomen, synonym og overbegrep i stedet for gjentagelse.',
 maa_ha:['de','generasjonen'],
 maa_ikkje_ha:[],
 regel:'Varier med pronomen (de), synonym (tenåringene) og overbegrep (generasjonen / de unge).',
 eks:'Ungdom → de → tenåringene → denne generasjonen → de unge'},

/* ═══════════════════════════════════════════════════
   15. LOGISK STRUKTUR  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mc',vanske:'lett',
 q:'Hvilken rekkefølge er mest logisk i en fagartikkel?',
 alt:['Avslutning → Hoveddel → Innledning','Innledning → Hoveddel → Avslutning','Hoveddel → Innledning → Avslutning','Avslutning → Innledning → Hoveddel'],
 fasit:'Innledning → Hoveddel → Avslutning',
 regel:'En fagartikkel følger treleddsmodellen: innledning – hoveddel – avslutning.',
 eks:'Innledning: presenter tema → Hoveddel: utdyp → Avslutning: konkluder'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'sorter_rekke',vanske:'medium',
 q:'Sett avsnittene i logisk rekkefølge for en fagartikkel om plast i havet.',
 items:[
  {id:'B',tekst:'Hvert år havner millioner tonn plast i havet, og problemet vokser raskt.'},
  {id:'D',tekst:'Plasten kommer fra fiskeri, skipstrafikk og forsøpling fra land.'},
  {id:'C',tekst:'Konsekvensene er alvorlige: dyr dør, giftstoffer spres og strender ødelegges.'},
  {id:'A',tekst:'Det finnes flere løsninger: bedre avfallssortering, internasjonale avtaler og forbrukermakt.'}
 ],
 regel:'Logisk oppbygging: Problem → Årsaker → Konsekvenser → Løsninger.',
 eks:'Problem → Årsaker → Konsekvenser → Løsninger'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'drag_kolonne',vanske:'medium',
 q:'Sorter setningene etter hvilken del av teksten de hører til.',
 kolonner:['Innledning','Hoveddel','Avslutning'],
 ord:[
  {tekst:'I denne artikkelen skal jeg se på …',fasit:0},
  {tekst:'For det første viser forskning at …',fasit:1},
  {tekst:'Alt i alt kan vi konkludere med at …',fasit:2},
  {tekst:'Hva vet vi egentlig om …?',fasit:0},
  {tekst:'På den andre siden hevder kritikere at …',fasit:1},
  {tekst:'Oppsummert viser kildene at …',fasit:2}
 ],
 regel:'Innledning: presenterer tema. Hoveddel: utdyper med argument/eksempler. Avslutning: oppsummerer og konkluderer.',
 eks:'«I denne artikkelen …» = innledning · «For det første …» = hoveddel · «Alt i alt …» = avslutning'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'finn_feil',vanske:'medium',
 q:'Klikk på avsnittet som bryter den logiske strukturen.',
 tekst:'KI er teknologi som lar maskiner utføre oppgaver som tidligere krevde menneskelig intelligens. Et annet eksempel er selvkjørende biler. Brettspill som Monopol er populære over hele verden. Likevel er KI omdiskutert.',
 fasit_feil:['Brettspill som Monopol er populære over hele verden.'],
 regel:'Hvert avsnitt må passe inn i den røde tråden. Et avsnitt om brettspill bryter temaet om KI.',
 eks:'KI-tekst: KI-intro → eksempel → (brudd: brettspill) → drøfting'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mc',vanske:'medium',
 q:'Hva er en temasetning?',
 alt:['Overskriften på teksten','Den første setningen i hvert avsnitt som forteller hva avsnittet handler om','Den siste setningen i innledningen','En setning som oppsummerer hele teksten'],
 fasit:'Den første setningen i hvert avsnitt som forteller hva avsnittet handler om',
 regel:'En temasetning kommer først i avsnittet og signaliserer hva avsnittet dreier seg om.',
 eks:'«Plastforurensning har alvorlige konsekvenser for dyrelivet.» → temasetning for konsekvens-avsnittet'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om logisk struktur sanne eller usanne?',
 paastandar:[
  {tekst:'Innledningen bør presentere temaet og fange interessen til leseren.',sann:true},
  {tekst:'Man kan ta opp nye argumenter i avslutningen.',sann:false},
  {tekst:'Avsnitt i hoveddelen bør komme i vilkårlig rekkefølge.',sann:false},
  {tekst:'Hvert avsnitt bør ha en temasetning.',sann:true},
  {tekst:'Avslutningen bør oppsummere og konkludere.',sann:true}
 ],
 regel:'God logikk: innledning presenterer, hoveddelen utdyper i naturlig rekkefølge, avslutningen konkluderer.',
 eks:'Innledning → tema. Hoveddel → argument i rekkefølge. Avslutning → konklusjon.'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'mcset',vanske:'vanskeleg',
 q:'Les teksten og svar.',
 tekst:'Sosiale medier påvirker ungdom på flere måter. For det første formes selvbildet av redigerte bilder. For det andre kan nettmobbing føre til psykiske plager. Likevel finnes det positive sider: kreativitet og fellesskap.',
 questions:[
  {q:'Hva gjør den første setningen?',alt:['Gir et eksempel','Presenterer hovedpåstanden','Konkluderer'],fasit:1},
  {q:'Hvilken type markører bruker teksten?',alt:['Motsetningsord','Nummereringsord','Sammenligningsord'],fasit:1},
  {q:'Hvilken funksjon har «Likevel»?',alt:['Viser årsak','Markerer nyansering/kontrast','Avslutter teksten'],fasit:1}
 ],
 regel:'Tekstmarkører som «for det første/andre» og «likevel» styrer logikken og gjør teksten oversiktlig.',
 eks:'for det første → for det andre → likevel (nyansering)'},

{kat:'logisk_struktur',kat_label:'Logisk struktur',type:'cloze',vanske:'vanskeleg',
 q:'Skriv inn rett tekstmarkør: «___ viser forskning at lesing øker ordforrådet.»',
 hint:'Denne markøren signaliserer det første argumentet.',
 fasit:'For det første',fasit_v:['For det første','for det første'],
 regel:'Nummereringsmarkører som «for det første», «for det andre», «til slutt» ordner argumenter.',
 eks:'For det første … For det andre … Til slutt …'},

/* ═══════════════════════════════════════════════════
   16. SJANGERKOMPETANSE  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'lett',
 q:'Hva kjennetegner en fagartikkel?',
 alt:['Subjektivt og følelsesladet språk','Saklig framstilling med kildehenvisning','Dialoger og spenningskurve','Rim og rytme'],
 fasit:'Saklig framstilling med kildehenvisning',
 regel:'En fagartikkel er sakprosa med saklig språk, kildebruk og logisk oppbygging.',
 eks:'Fagartikkel: tema, innledning, argument + kilder, avslutning'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'lett',
 q:'Hva kjennetegner et debattinnlegg?',
 alt:['Nøytral framstilling uten egen mening','Klar mening, argumenter for og mot, og et tydelig standpunkt','Bare fakta uten vurdering','Korte dialoger mellom to personer'],
 fasit:'Klar mening, argumenter for og mot, og et tydelig standpunkt',
 regel:'Et debattinnlegg argumenterer for et standpunkt, bruker retoriske virkemidler og avslutter med en oppfordring.',
 eks:'Påstand → argument for → motargument → tilbakevisning → konklusjon/oppfordring'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'drag_kolonne',vanske:'medium',
 q:'Sorter trekkene: Hører de til fagartikkel, debattinnlegg eller novelle?',
 kolonner:['Fagartikkel','Debattinnlegg','Novelle'],
 ord:[
  {tekst:'Saklig og nøytralt språk',fasit:0},
  {tekst:'Tydelig standpunkt og oppfordring',fasit:1},
  {tekst:'Dialoger og spenningskurve',fasit:2},
  {tekst:'Kildehenvisninger i teksten',fasit:0},
  {tekst:'Retoriske spørsmål og gjentagelse',fasit:1},
  {tekst:'Skildringer av personer og miljø',fasit:2}
 ],
 regel:'Fagartikkel = saklig + kilder. Debattinnlegg = standpunkt + retorikk. Novelle = fiksjon + spenning.',
 eks:'Fagartikkel: «Forskning viser …» · Debatt: «Vi krever at …» · Novelle: «Hun snudde seg sakte …»'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'fillsel',vanske:'medium',
 q:'Velg riktig sjanger for hver tekstbit.',
 items:[
  {pre:'«Forskning fra UiO viser at ungdom leser 30 % mindre enn for ti år siden.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Fagartikkel',post:''},
  {pre:'«Skolebibliotekene må styrkes – nå!»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Debattinnlegg',post:''},
  {pre:'«Det regnet da hun åpnet døra. Inne var det stille.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Novelle',post:''},
  {pre:'«Vi oppfordrer kommunestyret til å øke budsjettet for skolebibliotek.»',alt:['Fagartikkel','Novelle','Debattinnlegg'],fasit:'Debattinnlegg',post:''}
 ],
 regel:'Sjangervalg styrer språk og form. Fagartikkel = saklig. Debatt = argumenterende. Novelle = skjønnlitterær.',
 eks:'Forskning → fagartikkel · oppfordrer → debatt · «Det regnet …» → novelle'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om sjangre sanne eller usanne?',
 paastandar:[
  {tekst:'En fagartikkel kan bruke «jeg mener» som hovedargument.',sann:false},
  {tekst:'Et debattinnlegg bør ha et tydelig standpunkt.',sann:true},
  {tekst:'En novelle har som regel en spenningskurve.',sann:true},
  {tekst:'I en fagartikkel er det viktig å vise til kilder.',sann:true},
  {tekst:'Et debattinnlegg trenger ikke ta hensyn til motargumenter.',sann:false}
 ],
 regel:'Hver sjanger har egne konvensjoner for språk, struktur og innhold.',
 eks:'Fagartikkel: kilder viktig. Debatt: standpunkt + motargument. Novelle: spenningskurve.'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'mc',vanske:'vanskeleg',
 q:'Hva skiller et debattinnlegg fra et leserbrev?',
 alt:['De er identiske sjangre','Debattinnlegget er lengre og mer argumenterende, leserbrevet er personlig og kort','Leserbrevet krever kildehenvisninger, debattinnlegget ikke','Debattinnlegget er fiksjon, leserbrevet er sakprosa'],
 fasit:'Debattinnlegget er lengre og mer argumenterende, leserbrevet er personlig og kort',
 regel:'Debattinnlegg = grundig argumentasjon med flere argumenter. Leserbrev = kortere, mer personlig reaksjon.',
 eks:'Debattinnlegg: 500–1000 ord, flere argumenter. Leserbrev: 200–400 ord, personlig vinkling.'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'cloze',vanske:'lett',
 q:'Skriv inn sjangeren: En tekst med spenningskurve, dialoger og skildring av personer er en ___.',
 hint:'Tenk skjønnlitterær kortprosa.',
 fasit:'novelle',fasit_v:['novelle','Novelle','novelletekst'],
 regel:'En novelle er en kort fortelling med få personer, avgrenset handling og ofte et vendepunkt.',
 eks:'Novelle = kort fortelling, vendepunkt, få personer'},

{kat:'sjangerkompetanse',kat_label:'Sjangerkompetanse',type:'klikk_marker',vanske:'vanskeleg',
 q:'Klikk på de tre setningene som hører til debattinnlegg-sjangeren.',
 tekst:'Vi mener at skolen må innføre et fag om digital trygghet. Forskning viser at 60 % av ungdom har opplevd nettmobbing. Solen skinte inn gjennom vinduet og varmet ansiktet hennes. Politikerne må handle nå – det haster! Kveldsvinden la seg over fjorden.',
 maalordklasse:'debattinnlegg-setning',
 fasit_ord:['Vi mener at skolen må innføre et fag om digital trygghet.','Forskning viser at 60 % av ungdom har opplevd nettmobbing.','Politikerne må handle nå – det haster!'],
 regel:'Debattinnlegg bruker argumenterende setninger med standpunkt, fakta og oppfordring.',
 eks:'«Vi mener …» → standpunkt · «Forskning viser …» → faktaargument · «… må handle nå!» → oppfordring'},

/* ═══════════════════════════════════════════════════
   17. FAGARTIKKEL  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mc',vanske:'lett',
 q:'Hva bør innledningen i en fagartikkel gjøre?',
 alt:['Gi konklusjonen med én gang','Presentere tema og fange interessen til leseren','Inneholde alle kildehenvisningene','Være en personlig anekdote'],
 fasit:'Presentere tema og fange interessen til leseren',
 regel:'Innledningen skal presentere temaet, gjerne med en fengende inngang, og fortelle hva teksten handler om.',
 eks:'«Hvert år havner millioner tonn plast i havet. Hva gjør dette med livet under vann?»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mc',vanske:'medium',
 q:'Hvilket av disse er et saklig argument med kildehenvisning?',
 alt:['Jeg synes plast er ekkelt.','Forskning fra NIVA (2023) viser at mikroplast finnes i 80 % av norske innsjøer.','Alle vet at plast er farlig.','Plast burde vært forbudt fordi det er stygt.'],
 fasit:'Forskning fra NIVA (2023) viser at mikroplast finnes i 80 % av norske innsjøer.',
 regel:'Et saklig argument bruker fakta fra en navngitt kilde, ikke personlige meninger eller generaliseringer.',
 eks:'NIVA (2023) → navngitt kilde med årstall. Unngå: «alle vet», «jeg synes».'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'drag_kolonne',vanske:'medium',
 q:'Sorter setningene etter om de hører i innledning, hoveddel eller avslutning.',
 kolonner:['Innledning','Hoveddel','Avslutning'],
 ord:[
  {tekst:'Denne artikkelen tar for seg hvordan ungdom bruker sosiale medier.',fasit:0},
  {tekst:'En undersøkelse fra Medietilsynet (2024) viser at 95 % av 13-åringer har egen mobil.',fasit:1},
  {tekst:'Oppsummert ser vi at de positive og negative sidene må veies mot hverandre.',fasit:2},
  {tekst:'Hvorfor leser ungdom mindre enn før?',fasit:0},
  {tekst:'Kritikerne peker på at skjermtid går utover fysisk aktivitet (Helsedirektoratet, 2023).',fasit:1},
  {tekst:'Videre forskning er nødvendig for å forstå langtidsvirkningene.',fasit:2}
 ],
 regel:'Innledning: presenterer tema. Hoveddel: fakta + kilder. Avslutning: oppsummering + framover.',
 eks:'«Denne artikkelen …» = innledning · «En undersøkelse …» = hoveddel · «Oppsummert …» = avslutning'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'fix',vanske:'medium',
 q:'Rett de tre usaklige formuleringene til mer faglig språk.',
 tekst:'Alle vet at plast er ekstremt farlig. Jeg synes at vi er altfor late. Det er jo helt dust å kaste plast i naturen.',
 errors:{'Alle vet at plast er ekstremt farlig':'Forskning tyder på at plast er skadelig for miljøet','Jeg synes at vi er altfor late':'Flere forskere peker på at tiltakene kommer for sent','Det er jo helt dust å kaste plast i naturen':'Forsøpling utgjør et alvorlig miljøproblem'},
 fasit:'Forskning tyder på … · Flere forskere peker på … · Forsøpling utgjør …',
 regel:'Faglig språk bruker objektive formuleringer, ikke slang, følelsesord eller «alle vet».',
 eks:'«Jeg synes» → «Forskning viser» · «dust» → «problematisk» · «alle vet» → «studier tyder på»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'fillsel',vanske:'lett',
 q:'Velg riktig formulering for en fagartikkel.',
 items:[
  {pre:'',alt:['Jeg bryr meg ikke om plast.','Forskning viser at plast er et økende problem.','Plast er mega irriterende.'],fasit:'Forskning viser at plast er et økende problem.',post:''},
  {pre:'',alt:['Ifølge SSB (2023) har forbruket økt med 12 %.','Alle handler altfor mye.','Det er jo sykt hvor mye folk kjøper.'],fasit:'Ifølge SSB (2023) har forbruket økt med 12 %.',post:''},
  {pre:'',alt:['Seriøst, vi må gjøre noe.','Det haster å finne bærekraftige løsninger.','Whatever, ingen gjør noe uansett.'],fasit:'Det haster å finne bærekraftige løsninger.',post:''}
 ],
 regel:'Fagartikkelspråk er saklig, konkret og bygd på kildefestet informasjon.',
 eks:'«Forskning viser …» / «Ifølge SSB …» / «Det haster å finne …»'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om fagartikkelsjangeren sanne eller usanne?',
 paastandar:[
  {tekst:'En fagartikkel er subjektiv.',sann:false},
  {tekst:'Kildehenvisninger styrker troverdigheten til teksten.',sann:true},
  {tekst:'En fagartikkel kan starte med et retorisk spørsmål.',sann:true},
  {tekst:'Det er greit å bruke «jeg synes» som hovedargument.',sann:false},
  {tekst:'Avslutningen bør oppsummere og eventuelt peke framover.',sann:true}
 ],
 regel:'Fagartikkelen er saklig, kildefestet og logisk bygd opp. Retorisk spørsmål kan fenge leseren i innledningen.',
 eks:'Saklig, ikke subjektiv. Kilder styrker. Retorisk spørsmål fungerer i innledning.'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'cloze',vanske:'lett',
 q:'Skriv inn riktig ord: «___ Helsedirektoratet (2023) har fysisk aktivitet minket blant ungdom.»',
 hint:'Et ord som viser til en navngitt kilde.',
 fasit:'Ifølge',fasit_v:['Ifølge','ifølge','I følge','Ifølgje','ifølgje'],
 regel:'«Ifølge» + kilde innleder et kildefestet argument i fagprosa.',
 eks:'Ifølge SSB … / Ifølge Helsedirektoratet … / Ifølge forskerne …'},

{kat:'fagartikkel',kat_label:'Fagartikkel',type:'mcset',vanske:'vanskeleg',
 q:'Les fagartikkelutkastet og svar.',
 tekst:'Ungdom bruker i snitt 3 timer daglig på sosiale medier (Medietilsynet, 2024). Det kan føre til søvnmangel, ifølge FHI. Likevel finnes det positive sider: kreativitet og fellesskap. Spørsmålet er om de positive sidene veier opp for de negative.',
 questions:[
  {q:'Hvilken kilde brukes for skjermtid?',alt:['FHI','Medietilsynet','SSB'],fasit:1},
  {q:'Hvilken funksjon har «Likevel»?',alt:['Viser årsak','Nyanserer – peker på motargument','Avslutter teksten'],fasit:1},
  {q:'Er siste setningen en påstand eller et spørsmål?',alt:['Påstand','Retorisk spørsmål','Fakta'],fasit:1}
 ],
 regel:'God fagartikkel: kilder, nyansering med «likevel» og avslutning som åpner for refleksjon.',
 eks:'Kilde: Medietilsynet 2024. «Likevel» = nyansering. Retorisk spørsmål i avslutning.'},

/* ═══════════════════════════════════════════════════
   18. DEBATTINNLEGG  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'mc',vanske:'lett',
 q:'Hvordan bør et debattinnlegg starte?',
 alt:['Med en lang kildeliste','Med et tydelig standpunkt eller en provokasjon','Med en personlig dagbokskildring','Med en tabell over statistikk'],
 fasit:'Med et tydelig standpunkt eller en provokasjon',
 regel:'Innledningen i et debattinnlegg skal fange oppmerksomheten og presentere standpunktet tydelig.',
 eks:'«Skolen bør forby mobiltelefoner i undervisningen – nå!» → klart standpunkt'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'mc',vanske:'medium',
 q:'Hvorfor bør man ta opp motargumenter i et debattinnlegg?',
 alt:['For å svekke sin egen sak','For å vise at man kjenner flere sider og kan tilbakevise motargumentene','Fordi det er påkrevd i læreplanen','For å gjøre teksten lengre'],
 fasit:'For å vise at man kjenner flere sider og kan tilbakevise motargumentene',
 regel:'Å møte motargumenter og tilbakevise dem styrker troverdigheten (ethos) til skribenten.',
 eks:'«Noen vil hevde at … men forskning viser at …» → tilbakevisning'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'drag_kolonne',vanske:'medium',
 q:'Sorter virkemidlene: Hører de til etos, patos eller logos?',
 kolonner:['Etos (troverdighet)','Patos (følelser)','Logos (logikk/fakta)'],
 ord:[
  {tekst:'Vise til ekspertise eller erfaring',fasit:0},
  {tekst:'Bruke et sterkt bilde eller personlig historie',fasit:1},
  {tekst:'Vise til statistikk og forskning',fasit:2},
  {tekst:'Bruke et saklig og balansert språk',fasit:0},
  {tekst:'Stille et retorisk spørsmål som vekker følelser',fasit:1},
  {tekst:'Presentere et logisk resonnement med premiss og konklusjon',fasit:2}
 ],
 regel:'Etos = troverdighet. Patos = følelser. Logos = logikk og fakta. God retorikk bruker alle tre.',
 eks:'Etos: «Som lege …» · Patos: «Tenk på barna» · Logos: «Statistikk viser at …»'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'fillsel',vanske:'medium',
 q:'Velg det retoriske virkemiddelet som passer best.',
 items:[
  {pre:'«Hvordan kan vi akseptere at barn går sultne på skolen?»',alt:['Retorisk spørsmål','Gjentagelse','Overdrivelse'],fasit:'Retorisk spørsmål',post:''},
  {pre:'«Vi krever handling. Vi krever rettferdighet. Vi krever endring.»',alt:['Retorisk spørsmål','Gjentagelse (anafor)','Statistikk'],fasit:'Gjentagelse (anafor)',post:''},
  {pre:'«Ifølge FHI har angstdiagnoser blant unge økt med 40 % siden 2015.»',alt:['Patos','Anekdote','Logos (faktaargument)'],fasit:'Logos (faktaargument)',post:''},
  {pre:'«Jeg har selv jobbet som barnevernspedagog i ti år.»',alt:['Logos','Etos (troverdighet)','Patos'],fasit:'Etos (troverdighet)',post:''}
 ],
 regel:'Retorisk spørsmål = engasjerer. Anafor = gjentagelse for effekt. Logos = fakta. Etos = troverdighet.',
 eks:'Retorisk sp. / Anafor / Logos / Etos'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'sorter_rekke',vanske:'medium',
 q:'Sett avsnittene i logisk rekkefølge for et debattinnlegg.',
 items:[
  {id:'B',tekst:'Skolen bør innføre mobilforbud. Forskning viser at mobilen distraherer elevene.'},
  {id:'C',tekst:'Forskningen er tydelig: mobilen ødelegger konsentrasjonen. En studie fra Universitetet i Bergen viser at elever uten mobil presterte 15 % bedre.'},
  {id:'A',tekst:'Noen vil hevde at mobilforbud krenker elevenes frihet, men skolens oppgave er å lære, ikke å underholde.'},
  {id:'D',tekst:'Vi oppfordrer politikerne til å innføre et nasjonalt mobilforbud i skolen – for elevenes skyld.'}
 ],
 regel:'Debattinnlegg: Standpunkt → Argument → Motargument + tilbakevisning → Avsluttende oppfordring.',
 eks:'Standpunkt → Hovedargument → Møte motargument → Oppfordring'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'fix',vanske:'vanskeleg',
 q:'Gjør de usaklige formuleringene mer overbevisende med retoriske virkemidler.',
 tekst:'Alle som er mot mobilforbud er dumme. Det er jo bare tull å ha mobil på skolen. Lærerne bryr seg ikke om elevene.',
 errors:{'Alle som er mot mobilforbud er dumme':'Kan vi virkelig forsvare at mobilen tar oppmerksomheten fra elevene?','Det er jo bare tull å ha mobil på skolen':'Forskning fra UiB (2023) viser at mobilfritt klasserom øker læringsutbyttet.','Lærerne bryr seg ikke om elevene':'Lærerne fortjener verktøy som gjør det lettere å undervise.'},
 fasit:'Retorisk spørsmål · Fakta fra forskning · Positiv vinkling',
 regel:'Bytt ut personangrep med retoriske spørsmål, forskningsbaserte argumenter og konstruktive formuleringer.',
 eks:'«dumme» → retorisk spørsmål · «tull» → forskning viser · «bryr seg ikke» → positiv formulering'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om debattinnlegg sanne eller usanne?',
 paastandar:[
  {tekst:'Et debattinnlegg skal ha et tydelig standpunkt.',sann:true},
  {tekst:'Det er unødvendig å ta opp motargumenter.',sann:false},
  {tekst:'En oppfordring i avslutningen er vanlig.',sann:true},
  {tekst:'Personangrep styrker argumentasjonen.',sann:false},
  {tekst:'Retoriske spørsmål kan fange oppmerksomheten til leseren.',sann:true}
 ],
 regel:'Godt debattinnlegg: tydelig standpunkt, argument + motargument, ingen personangrep, avsluttende oppfordring.',
 eks:'Standpunkt → argument → motargument → oppfordring'},

{kat:'debattinnlegg',kat_label:'Debattinnlegg',type:'cloze',vanske:'lett',
 q:'Skriv inn riktig ord: «Vi ___ kommunepolitikerne til å øke budsjettet for skolebibliotek.»',
 hint:'Et verb som betyr å be noen om å handle.',
 fasit:'oppfordrer',fasit_v:['oppfordrer','ber','henstiller til'],
 regel:'«Oppfordrer» er et vanlig verb i oppfordring/avslutning av debattinnlegg.',
 eks:'Vi oppfordrer / Vi ber / Vi krever – typiske avslutningsverb i debatt'},

/* ═══════════════════════════════════════════════════
   19. OVERSKRIFT OG INGRESS  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'mc',vanske:'lett',
 q:'Hva er hovedoppgaven til en overskrift?',
 alt:['Oppsummere hele teksten','Fange interessen og fortelle hva teksten handler om','Vise hvem som skrev teksten','Inneholde alle nøkkelordene'],
 fasit:'Fange interessen og fortelle hva teksten handler om',
 regel:'En god overskrift er kort, presis og vekker nysgjerrighet.',
 eks:'«Ungdom leser mindre – hvorfor?» → kort, tema + spørsmål'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'mc',vanske:'medium',
 q:'Hva bør en ingress inneholde?',
 alt:['En kort oppsummering av hele teksten med hovedfunnene','Alle kildehenvisningene','Dialoger fra teksten','Forfatterens biografi'],
 fasit:'En kort oppsummering av hele teksten med hovedfunnene',
 regel:'Ingressen gir leseren det viktigste med én gang: hvem, hva, hvorfor.',
 eks:'«Ny forskning viser at skjermtid påvirker søvnkvaliteten til ungdom. Her er det du trenger å vite.»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Er det en god eller dårlig overskrift for en fagartikkel?',
 kolonner:['God overskrift','Dårlig overskrift'],
 ord:[
  {tekst:'Plast i havet – en økende trussel',fasit:0},
  {tekst:'Ting om plast og sånn',fasit:1},
  {tekst:'Ungdom og søvn: Hvordan skjermen stjeler nattero',fasit:0},
  {tekst:'Min artikkel om et tema',fasit:1},
  {tekst:'KI på skolen: Mulighet eller trussel?',fasit:0},
  {tekst:'Artikkel 1',fasit:1}
 ],
 regel:'Gode overskrifter er presise, informative og fengende. Dårlige er vage, uformelle eller intetsigende.',
 eks:'God: «Plast i havet – en økende trussel» · Dårlig: «Ting om plast og sånn»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'fillsel',vanske:'medium',
 q:'Velg den beste overskriften for hver tekst.',
 items:[
  {pre:'Fagartikkel om klimaendringer:',alt:['Klima','Isbreene smelter – raskere enn noen gang','Artikkel om klima og sånn'],fasit:'Isbreene smelter – raskere enn noen gang',post:''},
  {pre:'Debattinnlegg om leksefri skole:',alt:['Om lekser','Leksene må bort – la ungdommene få fri','Et leserbrev'],fasit:'Leksene må bort – la ungdommene få fri',post:''},
  {pre:'Fagartikkel om søvn og ungdom:',alt:['Hvorfor sover ungdom for lite?','Søvn','En tekst jeg har skrevet'],fasit:'Hvorfor sover ungdom for lite?',post:''}
 ],
 regel:'En god overskrift er konkret, vekker interesse og passer til sjangeren.',
 eks:'Klima → «Isbreene smelter …» · Lekser → «Leksene må bort …» · Søvn → «Hvorfor sover ungdom …?»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'fix',vanske:'medium',
 q:'Rett den dårlige overskriften og ingressen til en fagartikkel om plast.',
 tekst:'Min artikkel. Denne teksten handler om plast. Plast er overalt og det er ganske ekkelt egentlig.',
 errors:{'Min artikkel':'Plast i havet – en trussel mot livet under vann','Denne teksten handler om plast. Plast er overalt og det er ganske ekkelt egentlig.':'Hvert år havner millioner tonn plast i havet. Ny forskning viser hvordan det truer hele næringskjeden.'},
 fasit:'Plast i havet – en trussel … · Hvert år havner millioner tonn …',
 regel:'Overskrift: presis og fengende. Ingress: saklige hovedfunn, ikke slang eller vage formuleringer.',
 eks:'«Min artikkel» → «Plast i havet – …» · «ganske ekkelt» → saklig formulering'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om overskrift og ingress sanne eller usanne?',
 paastandar:[
  {tekst:'En god overskrift kan inneholde et spørsmål.',sann:true},
  {tekst:'Ingressen bør være lengre enn resten av teksten.',sann:false},
  {tekst:'Overskriften bør vekke nysgjerrighet.',sann:true},
  {tekst:'Ingressen gir leseren hovedfunnene med én gang.',sann:true},
  {tekst:'Overskriften trenger ikke passe til innholdet.',sann:false}
 ],
 regel:'Overskrift: kort, presis, fengende. Ingress: oppsummerer det viktigste. Begge gir leseren lyst til å lese videre.',
 eks:'Overskrift med spørsmål: «Hvorfor sover ungdom for lite?» Ingress: «Ny forskning viser at …»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv en bedre overskrift og en bedre ingress for denne fagartikkelen.',
 tekst:'Tekst om ungdom. Ungdom bruker mye telefon. Det er kanskje ikke bra.',
 instruksjon:'Gjør overskriften fengende og ingressen saklig med minst én faktareferanse.',
 maa_ha:['ungdom'],
 maa_ikkje_ha:['kanskje','tekst om'],
 regel:'Overskrift: konkret og fengende. Ingress: kort, saklig, informativ.',
 eks:'«Skjermtid og ungdom: Hva sier forskningen?» + «Ny undersøkelse viser at …»'},

{kat:'overskrift_ingress',kat_label:'Overskrift og ingress',type:'cloze',vanske:'medium',
 q:'Fullfør ingressen: «Ny forskning fra FHI viser at ungdom sover i snitt én time ___ enn for ti år siden.»',
 hint:'Et ord som viser retning (mer/mindre).',
 fasit:'mindre',fasit_v:['mindre','kortere'],
 regel:'En god ingress er konkret og bruker presise fakta til å fange leseren.',
 eks:'«… én time mindre/kortere enn …» – konkret og informativt'},

/* ═══════════════════════════════════════════════════
   20. NOVELLE  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'novelle',kat_label:'Novelle',type:'mc',vanske:'lett',
 q:'Hva kjennetegner en novelle?',
 alt:['Lang fortelling med mange personer og handlingstråder','Kort fortelling med få personer, avgrenset handling og ofte et vendepunkt','Saklig tekst med kildehenvisninger','Dikt med rim og rytme'],
 fasit:'Kort fortelling med få personer, avgrenset handling og ofte et vendepunkt',
 regel:'En novelle er en kort fortelling med avgrenset tid/sted, få personer og gjerne et vendepunkt.',
 eks:'Novelle: kort, vendepunkt, få personer, konsentrert handling'},

{kat:'novelle',kat_label:'Novelle',type:'mc',vanske:'medium',
 q:'Hva er et vendepunkt i en novelle?',
 alt:['Innledningen der personene presenteres','Det punktet der handlingen endrer retning','Avslutningen der alt forklares','Et dialogavsnitt'],
 fasit:'Det punktet der handlingen endrer retning',
 regel:'Vendepunktet er det avgjørende øyeblikket der situasjonen, forståelsen eller retningen i handlingen endrer seg.',
 eks:'«Plutselig forsto han at brevet ikke var fra far.» → vendepunkt'},

{kat:'novelle',kat_label:'Novelle',type:'drag_kolonne',vanske:'medium',
 q:'Sorter virkemidlene: Hører de til novelle, fagartikkel eller debattinnlegg?',
 kolonner:['Novelle','Fagartikkel','Debattinnlegg'],
 ord:[
  {tekst:'Skildring av miljø og stemning',fasit:0},
  {tekst:'Kildehenvisninger (APA)',fasit:1},
  {tekst:'Retoriske spørsmål og oppfordring',fasit:2},
  {tekst:'Dialog mellom personer',fasit:0},
  {tekst:'Nøytralt og saklig språk',fasit:1},
  {tekst:'Personlig standpunkt',fasit:2}
 ],
 regel:'Novelle: skildring + dialog. Fagartikkel: kilder + saklig språk. Debatt: standpunkt + retorikk.',
 eks:'Novelle: «Regnet slo mot ruta …» · Fagartikkel: «Ifølge …» · Debatt: «Vi krever at …»'},

{kat:'novelle',kat_label:'Novelle',type:'fillsel',vanske:'medium',
 q:'Velg det beste virkemiddelet for hver novellesituasjon.',
 items:[
  {pre:'For å skildre stemning:',alt:['Statistikk fra SSB','Sanseskildring med lyd, lukt og syn','Et logisk argument'],fasit:'Sanseskildring med lyd, lukt og syn',post:''},
  {pre:'For å vise hva en person tenker:',alt:['Indre monolog','Kildehenvisning','Overskrift og ingress'],fasit:'Indre monolog',post:''},
  {pre:'For å øke spenningen:',alt:['Presensform og korte setninger','Langt avsnitt med forklaring','Fotnoter'],fasit:'Presensform og korte setninger',post:''},
  {pre:'For å vise personlighet:',alt:['Talemål i dialogen','Formell kildehenvisning','Statistikk'],fasit:'Talemål i dialogen',post:''}
 ],
 regel:'Novellevirkemidler: sanseskildring (stemning), indre monolog (tanker), korte setninger (spenning), talemål (karakter).',
 eks:'Stemning: vind og regn · Tanker: «Hun tenkte at …» · Spenning: korte setninger · Karakter: dialekt'},

{kat:'novelle',kat_label:'Novelle',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om novellen sanne eller usanne?',
 paastandar:[
  {tekst:'En novelle har ofte et vendepunkt.',sann:true},
  {tekst:'En novelle skal alltid ha happy ending.',sann:false},
  {tekst:'Noveller har som regel få personer.',sann:true},
  {tekst:'Sanseskildring er et vanlig virkemiddel i noveller.',sann:true},
  {tekst:'En novelle bruker kildehenvisninger som i fagartikler.',sann:false}
 ],
 regel:'Novelle: kort, få personer, vendepunkt, sanseskildring. Ikke kilder eller fagspråk.',
 eks:'Vendepunkt, sanseskildring, dialog – typiske novelletrekk'},

{kat:'novelle',kat_label:'Novelle',type:'klikk_marker',vanske:'medium',
 q:'Klikk på de to setningene som bruker sanseskildring.',
 tekst:'Døra smalt igjen med et brak. Hun gikk bort til vinduet. Lukten av nystekte boller strømmet inn fra kjøkkenet. Klokka var halv fire. Den kalde høstvinden rev i håret hennes.',
 maalordklasse:'sanseskildring',
 fasit_ord:['Lukten av nystekte boller strømmet inn fra kjøkkenet.','Den kalde høstvinden rev i håret hennes.'],
 regel:'Sanseskildring formidler inntrykk via syn, hørsel, lukt, smak eller berøring.',
 eks:'Lukt: «Lukten av boller …» · Berøring: «Den kalde vinden …»'},

{kat:'novelle',kat_label:'Novelle',type:'cloze',vanske:'lett',
 q:'Skriv inn riktig begrep: Det avgjørende øyeblikket der handlingen endrer retning heter et ___.',
 hint:'Tenk på det dramatiske høydepunktet.',
 fasit:'vendepunkt',fasit_v:['vendepunkt','Vendepunkt','vende-punkt'],
 regel:'Vendepunktet er det avgjørende øyeblikket i en novelle der alt endrer seg.',
 eks:'«Plutselig forsto hun sannheten.» → vendepunktet'},

{kat:'novelle',kat_label:'Novelle',type:'mcset',vanske:'vanskeleg',
 q:'Les utdraget og svar.',
 tekst:'Hun sto ved vinduet og så ut. Regnet trommet mot ruta. «Kommer du?» ropte mora fra gangen. Hun svarte ikke. Brevet lå fremdeles på bordet, uåpnet.',
 questions:[
  {q:'Hvilket virkemiddel åpner utdraget med?',alt:['Dialog','Sanseskildring','Fakta'],fasit:1},
  {q:'Hva skaper spenning i slutten?',alt:['At mora roper','At brevet er uåpnet','At det regner'],fasit:1},
  {q:'Hvilket synsvinkel har teksten?',alt:['Førsteperson (jeg)','Tredjeperson (hun)','Andreperson (du)'],fasit:1}
 ],
 regel:'Sanseskildring (regnet) skaper stemning. Uåpnet brev skaper spenning (frampek). Tredjeperson = «hun».',
 eks:'Sanseskildring → stemning. Uåpnet brev → frampek/spenning. «Hun» → tredjeperson.'},

/* ═══════════════════════════════════════════════════
   21. PARAFRASE  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'parafrase',kat_label:'Parafrase',type:'mc',vanske:'lett',
 q:'Hva er en parafrase?',
 alt:['Å kopiere en tekst ord for ord','Å gjengi innholdet i en tekst med egne ord','Å skrive et direkte sitat','Å lage en fotnoteliste'],
 fasit:'Å gjengi innholdet i en tekst med egne ord',
 regel:'En parafrase er en omskriving av innholdet med egne ord, men samme mening. Kilden må oppgis.',
 eks:'Original: «60 % leser bøker daglig.» Parafrase: «Over halvparten leser hver dag (SSB, 2023).»'},

{kat:'parafrase',kat_label:'Parafrase',type:'mc',vanske:'medium',
 q:'Hva er forskjellen mellom et sitat og en parafrase?',
 alt:['Sitat bruker egne ord, parafrase bruker kildens ord','Sitat gjengir ordrett, parafrase gjengir med egne ord','Parafrase trenger ikke kildehenvisning','De er identiske teknikker'],
 fasit:'Sitat gjengir ordrett, parafrase gjengir med egne ord',
 regel:'Sitat = ordrett gjengivelse med anførselstegn. Parafrase = omskriving med egne ord. Begge krever kilde.',
 eks:'Sitat: «60 % leser daglig» (SSB, 2023). Parafrase: Over halvparten leser hver dag (SSB, 2023).'},

{kat:'parafrase',kat_label:'Parafrase',type:'fillsel',vanske:'medium',
 q:'Velg den beste parafraseringen av hver kilde.',
 items:[
  {pre:'Original: «Ungdom bruker i snitt 3 timer daglig på sosiale medier» (Medietilsynet, 2024).',alt:['Ungdom bruker i snitt 3 timer daglig på sosiale medier.','Unge mennesker tilbringer gjennomsnittlig tre timer om dagen på sosiale plattformer.','Sosiale medier er populære.'],fasit:'Unge mennesker tilbringer gjennomsnittlig tre timer om dagen på sosiale plattformer.',post:''},
  {pre:'Original: «Fysisk aktivitet blant barn har minket med 20 %» (FHI, 2023).',alt:['Barn beveger seg mindre enn før – nedgangen er på en femtedel.','Fysisk aktivitet blant barn har minket med 20 %.','Barn er late.'],fasit:'Barn beveger seg mindre enn før – nedgangen er på en femtedel.',post:''},
  {pre:'Original: «Leseferdighetene varierer stort mellom skoler» (PISA, 2022).',alt:['Det er stor forskjell i leseferdighet fra skole til skole.','Leseferdighetene varierer stort mellom skoler.','Noen leser bra, andre ikke.'],fasit:'Det er stor forskjell i leseferdighet fra skole til skole.',post:''}
 ],
 regel:'God parafrase: samme innhold, nye ord og setningsstruktur. Ikke kopier ordrett, men vær presis.',
 eks:'«3 timer daglig» → «tre timer om dagen» · «minket med 20 %» → «nedgang på en femtedel»'},

{kat:'parafrase',kat_label:'Parafrase',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er det en god parafrase, et direkte sitat, eller plagiat?',
 kolonner:['God parafrase','Direkte sitat','Plagiat (ulovlig kopi)'],
 ord:[
  {tekst:'Barn beveger seg mindre (FHI, 2023).',fasit:0},
  {tekst:'«Fysisk aktivitet blant barn har minket med 20 %» (FHI, 2023).',fasit:1},
  {tekst:'Fysisk aktivitet blant barn har minket med 20 %. (ingen kilde)',fasit:2},
  {tekst:'Ifølge FHI (2023) er det en tydelig nedgang i hvor mye barn beveger seg.',fasit:0},
  {tekst:'Forskning viser at barn beveger seg mye mindre nå. (ingen kilde)',fasit:2},
  {tekst:'«Barn beveger seg mye mindre nå» (FHI, 2023).',fasit:1}
 ],
 regel:'God parafrase: egne ord + kilde. Direkte sitat: ordrett + anførselstegn + kilde. Plagiat: andres ord uten kilde.',
 eks:'Parafrase: egne ord (FHI, 2023). Sitat: «…» (FHI, 2023). Plagiat: ordrett uten kilde.'},

{kat:'parafrase',kat_label:'Parafrase',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om parafrase sanne eller usanne?',
 paastandar:[
  {tekst:'En parafrase trenger ikke kildehenvisning.',sann:false},
  {tekst:'En god parafrase endrer ordvalg og setningsstruktur.',sann:true},
  {tekst:'Det holder å bytte ut ett ord for å parafrasere.',sann:false},
  {tekst:'Parafrase og sitat er to ulike teknikker.',sann:true},
  {tekst:'En parafrase skal formidle samme innhold som originalen.',sann:true}
 ],
 regel:'Parafrase = nye ord, samme mening. Krever kilde. Ikke bare synonymbytte – endre setningsstruktur.',
 eks:'Bytt ordvalg + setningsstruktur. Oppgi alltid kilden.'},

{kat:'parafrase',kat_label:'Parafrase',type:'omskriv',vanske:'vanskeleg',
 q:'Rett parafrasefeilen: Teksten er for lik originalen. Skriv om med egne ord.',
 tekst:'Ungdom bruker i gjennomsnitt tre timer daglig på sosiale medier (Medietilsynet, 2024).',
 instruksjon:'Skriv om med egne ord og ny setningsstruktur. Behold kilden.',
 maa_ha:['Medietilsynet'],
 maa_ikkje_ha:['bruker i gjennomsnitt tre timer daglig på sosiale medier'],
 errors:{'Ungdom bruker i gjennomsnitt tre timer daglig på sosiale medier':'Unge mennesker tilbringer omtrent tre timer hver dag på ulike sosiale plattformer'},
 fasit:'Unge mennesker tilbringer omtrent tre timer hver dag på ulike sosiale plattformer',
 regel:'En god parafrase endrer både ordvalg og setningsstruktur, ikke bare ett og annet ord.',
 eks:'«bruker i gjennomsnitt» → «tilbringer omtrent» · «sosiale medier» → «sosiale plattformer»'},

{kat:'parafrase',kat_label:'Parafrase',type:'cloze',vanske:'lett',
 q:'Å gjengi innholdet i en tekst med egne ord, men samme mening, heter en ___.',
 hint:'Et gresk-latinsk begrep for omskriving.',
 fasit:'parafrase',fasit_v:['parafrase','Parafrase'],
 regel:'En parafrase er en omskriving med egne ord. Kilden må alltid oppgis.',
 eks:'Original → parafrase (egne ord) + kildehenvisning'},

{kat:'parafrase',kat_label:'Parafrase',type:'omskriv',vanske:'vanskeleg',
 q:'Parafrasér denne kilden med egne ord: «Fysisk aktivitet blant barn og unge har minket med 20 prosent de siste ti årene» (FHI, 2023).',
 tekst:'Fysisk aktivitet blant barn og unge har minket med 20 prosent de siste ti årene (FHI, 2023).',
 instruksjon:'Skriv om med helt nye ord og ny setningsstruktur. Behold kildehenvisningen.',
 maa_ha:['FHI'],
 maa_ikkje_ha:['minket med 20 prosent'],
 regel:'God parafrase: endre ordvalg og setningsstruktur. Kilden (FHI, 2023) skal fortsatt være med.',
 eks:'«Barn beveger seg en femtedel mindre enn for et tiår siden (FHI, 2023).»'},

/* ═══════════════════════════════════════════════════
   22. SITAT  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mc',vanske:'lett',
 q:'Hvordan skal et direkte sitat markeres?',
 alt:['Med parentes','Med anførselstegn (« »)','Med kursiv','Med understreking'],
 fasit:'Med anførselstegn (« »)',
 regel:'Direkte sitat markeres med anførselstegn (« ») og etterfølges av kildehenvisning.',
 eks:'«60 % leser daglig» (SSB, 2023). Anførselstegn = ordrett gjengivelse.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mc',vanske:'medium',
 q:'Hva må alltid følge et direkte sitat i en fagartikkel?',
 alt:['Et utropstegn','En forfatterbiografi','En kildehenvisning med forfatter/årstall','En asterisk (*)'],
 fasit:'En kildehenvisning med forfatter/årstall',
 regel:'Etter hvert sitat skal kilden oppgis: (Forfatter, årstall) eller (Organisasjon, årstall).',
 eks:'«Plast er et globalt problem» (FN, 2022). Kilde = (FN, 2022).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'fillsel',vanske:'medium',
 q:'Velg rett bruk av sitat i hver situasjon.',
 items:[
  {pre:'Du vil gjengi en eksakt formulering:',alt:['Parafrase','Direkte sitat med anførselstegn','Fotnoter uten tekst'],fasit:'Direkte sitat med anførselstegn',post:''},
  {pre:'Du vil fortelle hva en kilde mener, men med egne ord:',alt:['Direkte sitat','Parafrase med kildehenvisning','Kopiere uten kilde'],fasit:'Parafrase med kildehenvisning',post:''},
  {pre:'Du vil framheve en kort, slående frase fra en kilde:',alt:['Lang parafrase','Kort direkte sitat integrert i setningen','Ignorere kilden'],fasit:'Kort direkte sitat integrert i setningen',post:''},
  {pre:'Du vil gjengi mer enn 3 linjer fra en kilde:',alt:['Blokksitat (innrykket)','"..." i anførselstegn','Parafrase'],fasit:'Blokksitat (innrykket)',post:''}
 ],
 regel:'Direkte sitat = ordrett med « ». Parafrase = egne ord. Blokksitat = lange sitat innrykket.',
 eks:'Kort sitat: « » + kilde. Blokksitat: innrykket + kilde. Parafrase: egne ord + kilde.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'fix',vanske:'medium',
 q:'Rett de tre sitatfeilene i teksten.',
 tekst:'Forskning viser at ungdom leser mindre. Ifølge SSB leser 60 % av ungdom bøker daglig. Eksperten sa at plast er farlig for dyr og det er et stort problem.',
 errors:{'Ifølge SSB leser 60 % av ungdom bøker daglig':'Ifølge SSB (2023) leser «60 % av ungdom bøker daglig»','Eksperten sa at plast er farlig for dyr og det er et stort problem':'Eksperten sa: «Plast er farlig for dyr, og det er et stort problem» (Hansen, 2023)'},
 fasit:'SSB (2023) + anførselstegn · Eksperten sa: « » + kilde',
 regel:'Direkte sitat krever anførselstegn (« ») og kildehenvisning med årstall. Indirekte referat krever også kilde.',
 eks:'«60 % leser daglig» (SSB, 2023). Eksperten sa: «…» (Hansen, 2023).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er det et direkte sitat eller en indirekte gjengivelse (parafrase)?',
 kolonner:['Direkte sitat','Indirekte gjengivelse / parafrase'],
 ord:[
  {tekst:'FN skriver: «Plasten i havet truer livet under vann» (2022).',fasit:0},
  {tekst:'FN hevder at plasten i havet truer marint liv (2022).',fasit:1},
  {tekst:'Ifølge FN (2022) er havforurensning et økende problem for dyrelivet.',fasit:1},
  {tekst:'«Vi må handle raskt» sa generalsekretæren (FN, 2022).',fasit:0},
  {tekst:'Generalsekretæren understreket at verden må handle fort (FN, 2022).',fasit:1},
  {tekst:'FN-ledelsen peker på at det haster med tiltak mot havforurensning (2022).',fasit:1}
 ],
 regel:'Direkte sitat: ordrett + « » + kilde. Indirekte gjengivelse / parafrase: egne ord eller referat med «at» + kilde.',
 eks:'Direkte: «…» (kilde) · Indirekte/parafrase: egne ord eller «sa at …» + kilde'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om sitat sanne eller usanne?',
 paastandar:[
  {tekst:'Direkte sitat skal alltid ha anførselstegn.',sann:true},
  {tekst:'En parafrase trenger ikke kildehenvisning.',sann:false},
  {tekst:'Indirekte sitat bruker «at» i stedet for anførselstegn.',sann:true},
  {tekst:'Blokksitat er for sitat på mer enn ca. 3 linjer.',sann:true},
  {tekst:'Det er greit å endre på ordlyden i et direkte sitat.',sann:false}
 ],
 regel:'Direkte sitat: ordrett + « » + kilde. Indirekte: «at» + kilde. Parafrase: egne ord + kilde.',
 eks:'Anførselstegn + kilde = direkte. «At» = indirekte. Egne ord = parafrase.'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'cloze',vanske:'lett',
 q:'Skriv inn riktig tegn: Direkte sitat markeres med ___ på norsk.',
 hint:'Hva slags tegn bruker vi rundt ordrett gjengivelse?',
 fasit:'anførselstegn',fasit_v:['anførselstegn','« »','«»','hermetegn','hermeteikn','anførselsteikn','guillemets'],
 regel:'På norsk bruker vi guillemets (« ») som anførselstegn for direkte sitat.',
 eks:'«Forskning viser at …» (SSB, 2023).'},

{kat:'sitat',kat_label:'Sitat og sitatbruk',type:'mcset',vanske:'vanskeleg',
 q:'Les utkastet og vurder sitatbruken.',
 tekst:'FN skriver at «Plasten i havet truer livet under vann» (FN, 2022). Generalsekretæren sa: Vi må handle nå. Forskerne mener at problemet vokser raskt.',
 questions:[
  {q:'Er det første sitatet korrekt?',alt:['Ja, det har anførselstegn og kilde','Nei, det blander indirekte og direkte sitat','Ja, men det mangler årstall'],fasit:0},
  {q:'Hva mangler i den andre setningen?',alt:['Ingenting','Anførselstegn rundt det direkte sitatet','Kildehenvisning'],fasit:1},
  {q:'Hvilken type gjengivelse er den tredje setningen?',alt:['Direkte sitat','Indirekte gjengivelse / parafrase','Sitat uten kilde'],fasit:1}
 ],
 regel:'Direkte sitat: «…» + kilde. Indirekte: «sa at …» + kilde. Kontroller at alle sitat er markert riktig.',
 eks:'OK: «…» (FN, 2022). Feil: sa: Vi må … (mangler « »). Indirekte: mener at …'},

/* ═══════════════════════════════════════════════════
   23. TALL OG STATISTIKK  (8 oppgaver)
   ═══════════════════════════════════════════════════ */
{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'mc',vanske:'lett',
 q:'Hvordan bør man presentere tall i en fagartikkel?',
 alt:['Uten kilde','Med kilde og sammenheng som gjør tallet meningsfullt','Bare i tabeller','Bare i overskriften'],
 fasit:'Med kilde og sammenheng som gjør tallet meningsfullt',
 regel:'Tall i fagtekster skal ha kilde og settes i sammenheng slik at leseren forstår hva de betyr.',
 eks:'«60 % av ungdom leser daglig (SSB, 2023) – en nedgang på 15 prosentpoeng siden 2013.»'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'mc',vanske:'medium',
 q:'Hva er forskjellen på prosent og prosentpoeng?',
 alt:['De betyr det samme','Prosent er en del av hundre; prosentpoeng er forskjellen mellom to prosenttall','Prosentpoeng er større enn prosent','Prosent brukes i fagartikler, prosentpoeng i debattinnlegg'],
 fasit:'Prosent er en del av hundre; prosentpoeng er forskjellen mellom to prosenttall',
 regel:'Prosentpoeng = forskjellen mellom to prosenttall. Økning fra 40 % til 60 % = 20 prosentpoeng, ikke 20 %.',
 eks:'Fra 40 % til 60 % = 20 prosentpoeng. 20 % av 40 ville vært 8, altså 48 %.'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'fillsel',vanske:'medium',
 q:'Velg den mest presise formuleringen.',
 items:[
  {pre:'Fra 30 % til 45 %:',alt:['Økte med 15 %','Økte med 15 prosentpoeng','Nesten doblet seg'],fasit:'Økte med 15 prosentpoeng',post:''},
  {pre:'48 av 50 elever bestod:',alt:['Nesten alle bestod','96 % bestod','Mange bestod'],fasit:'96 % bestod',post:''},
  {pre:'200 av 10 000 innbyggere:',alt:['Mange innbyggere','2 % av innbyggerne','Tusenvis'],fasit:'2 % av innbyggerne',post:''},
  {pre:'Prisen gikk fra 100 til 200 kr:',alt:['Økte med 50 %','Doblet seg','Økte med 200 %'],fasit:'Doblet seg',post:''}
 ],
 regel:'Vær presis: bruk prosentpoeng for differanse mellom prosenttall, prosent for proporsjon, og konkrete tall.',
 eks:'15 prosentpoeng (ikke 15 %) · 96 % bestod · 2 % · doblet seg'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Er tallbruken presis og kildefestet, eller upresis og udokumentert?',
 kolonner:['Presis og kildefestet','Upresis / udokumentert'],
 ord:[
  {tekst:'Ifølge SSB (2023) har forbruket økt med 12 %.',fasit:0},
  {tekst:'Ganske mange ungdommer leser lite.',fasit:1},
  {tekst:'95 % av 13-åringer har egen mobil (Medietilsynet, 2024).',fasit:0},
  {tekst:'Masse folk driver med idrett.',fasit:1},
  {tekst:'En studie viser at 7 av 10 elever trener minst tre ganger i uka (HUNT, 2022).',fasit:0},
  {tekst:'Det er veldig mange som bruker skjerm.',fasit:1}
 ],
 regel:'Presise tall med kilde gir troverdig tekst. Vage uttrykk som «mange» og «ganske» svekker argumentet.',
 eks:'Presis: «95 %» (Medietilsynet, 2024). Upresis: «Masse folk …» (ingen kilde)'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'fix',vanske:'vanskeleg',
 q:'Gjør de vage formuleringene mer presise med tall.',
 tekst:'Ganske mange ungdommer bruker telefonen mye. Det er veldig mange som er på sosiale medier. Noen leser fremdeles bøker.',
 errors:{'Ganske mange ungdommer bruker telefonen mye':'95 % av norske 13-åringer har egen smarttelefon (Medietilsynet, 2024)','Det er veldig mange som er på sosiale medier':'Ungdom bruker i snitt tre timer daglig på sosiale medier (Medietilsynet, 2024)','Noen leser fremdeles bøker':'60 % av ungdom mellom 16 og 24 år leser bøker daglig (SSB, 2023)'},
 fasit:'95 % … (Medietilsynet) · tre timer daglig … · 60 % … (SSB)',
 regel:'Bytt ut vage uttrykk med presise tall og kildehenvisninger. Det gjør teksten mer troverdig.',
 eks:'«ganske mange» → «95 %» · «mye» → «tre timer daglig» · «noen» → «60 %»'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om bruk av tall og statistikk sanne eller usanne?',
 paastandar:[
  {tekst:'Tall i fagartikler bør alltid ha kilde.',sann:true},
  {tekst:'«Mange» og «noen» er presise nok i fagspråk.',sann:false},
  {tekst:'Prosentpoeng og prosent er det samme.',sann:false},
  {tekst:'Å sette tall i sammenheng gjør dem lettere å forstå.',sann:true},
  {tekst:'Statistikk fra offentlige kilder (SSB, FHI) er mer troverdig enn anonyme blogger.',sann:true}
 ],
 regel:'Presise tall med kilder gir troverdig fagprosa. Unngå vage uttrykk. Kjenn prosent vs. prosentpoeng.',
 eks:'«mange» = vagt · «60 %» = presist · prosentpoeng ≠ prosent'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'cloze',vanske:'medium',
 q:'Skriv inn riktig begrep: Forskjellen mellom to prosenttall (f.eks. fra 40 % til 55 %) måles i ___.',
 hint:'Ikke det samme som vanlig prosent.',
 fasit:'prosentpoeng',fasit_v:['prosentpoeng','Prosentpoeng'],
 regel:'Prosentpoeng = differanse mellom prosenttall. Fra 40 % til 55 % = 15 prosentpoeng.',
 eks:'40 % → 55 % = 15 prosentpoeng (ikke 15 %)'},

{kat:'tal_og_statistikk',kat_label:'Tall og statistikk',type:'mcset',vanske:'vanskeleg',
 q:'Les påstandene og svar.',
 tekst:'I 2013 leste 75 % av ungdom bøker daglig. I 2023 var tallet 60 % (SSB, 2023). Skolene opplyser at de har kjøpt flere bøker de siste årene.',
 questions:[
  {q:'Hvor stor er nedgangen i lesing i prosentpoeng?',alt:['15 %','15 prosentpoeng','20 prosentpoeng'],fasit:1},
  {q:'Er kilden til skoleinformasjonen sterk?',alt:['Ja, skolene er navngitt','Nei, det er vagt og udokumentert','Ja, SSB er oppgitt'],fasit:1},
  {q:'Hva hadde styrket siste setning?',alt:['Bruke «ganske»','Fjerne setningen','Legge til konkret tall og kilde'],fasit:2}
 ],
 regel:'Prosentpoeng for differanse. Vage påstander uten kilde svekker teksten. Alltid konkret + kilde.',
 eks:'75 % → 60 % = 15 prosentpoeng. «Skolene opplyser» → trenger kilde.'},

/* ═══════════════════════════════════════════════════
   24. ORDVALG OG PRESISJON  (8 oppgaver, kun BM)
   ═══════════════════════════════════════════════════ */
{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'mc',vanske:'lett',
 q:'Hvilket ord er mest presist? «Tingen er at mange ungdommer bruker mobilen mye.»',
 alt:['Tingen','Poenget','Problemet','Saken'],fasit:'Poenget',
 regel:'Unngå vage ord som «tingen» eller «greien». Bruk presise ord som «poenget», «utfordringen».',
 eks:'tingen → poenget / utfordringen / årsaken'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'mc',vanske:'medium',
 q:'Hva betyr «å drøfte» i en oppgavetekst?',
 alt:['Bare beskrive noe','Se på flere sider, veie argumenter og ta stilling','Gi et kort svar','Skrive en personlig mening uten begrunnelse'],
 fasit:'Se på flere sider, veie argumenter og ta stilling',
 regel:'«Drøfte» betyr å se saken fra flere sider, veie argumenter mot hverandre og konkludere.',
 eks:'Drøft = pro + contra + egen dom. Beskriv = kun observasjon.'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'fillsel',vanske:'medium',
 q:'Velg det mest presise alternativet.',
 items:[
  {pre:'Mange bruker telefonen',alt:['mye','i snitt tre timer daglig','hele tiden'],fasit:'i snitt tre timer daglig',post:'(Medietilsynet, 2024).'},
  {pre:'Problemet er',alt:['ganske stort','betydelig – det berører 95 % av unge','veldig ille'],fasit:'betydelig – det berører 95 % av unge',post:'(Medietilsynet, 2024).'},
  {pre:'Ungdom',alt:['gjør ting på nett','deltar aktivt i digitale fellesskap','henger på sosiale medier'],fasit:'deltar aktivt i digitale fellesskap',post:'.'},
  {pre:'Forskningen',alt:['sier noe om at det er ille','dokumenterer en nedgang på 20 %','viser at det er ganske dårlig'],fasit:'dokumenterer en nedgang på 20 %',post:'(FHI, 2023).'}
 ],
 regel:'Presist ordvalg bruker konkrete tall, fagspråk og nøyaktige beskrivelser.',
 eks:'«mye» → «tre timer daglig» · «ganske stort» → «betydelig» · «gjør ting» → «deltar aktivt»'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er uttrykket presist (faglig) eller upresist (uformelt)?',
 kolonner:['Presist / faglig','Upresist / uformelt'],
 ord:[
  {tekst:'dokumenterer',fasit:0},
  {tekst:'sier noe om',fasit:1},
  {tekst:'betydelig nedgang',fasit:0},
  {tekst:'ganske mye',fasit:1},
  {tekst:'ifølge forskning',fasit:0},
  {tekst:'folk sier',fasit:1}
 ],
 regel:'Fagspråk er konkret og presist. Uformelt språk er vagt og dagligdags.',
 eks:'dokumenterer = presist · sier noe om = upresist · betydelig = presist · ganske mye = vagt'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'fix',vanske:'medium',
 q:'Erstatt de vage uttrykkene med presise formuleringer.',
 tekst:'Det er en greie at ungdom bruker mye tid på sånt. Det er liksom ikke bra for dem.',
 errors:{'en greie':'en dokumentert utfordring','bruker mye tid på sånt':'bruker i snitt tre timer daglig på sosiale medier','Det er liksom ikke bra for dem':'Forskning fra FHI (2023) viser at dette kan påvirke søvnkvaliteten negativt'},
 fasit:'en dokumentert utfordring · tre timer daglig … · FHI (2023) viser …',
 regel:'Bytt ut dagligspråk (greie, sånt, liksom) med presise, faglige formuleringer.',
 eks:'greie → utfordring · sånt → sosiale medier · liksom ikke bra → påvirker negativt'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om ordvalg sanne eller usanne?',
 paastandar:[
  {tekst:'Fagartikler bør bruke presise og konkrete ord.',sann:true},
  {tekst:'«Greien er at …» er en god åpning i en fagartikkel.',sann:false},
  {tekst:'Verb som «drøfte» og «analysere» krever mer enn en enkel beskrivelse.',sann:true},
  {tekst:'Vage ord som «mye» og «ganske» er presise nok i fagtekst.',sann:false},
  {tekst:'Ordvalget bør tilpasses sjanger og formål.',sann:true}
 ],
 regel:'Godt ordvalg: presist, konkret og tilpasset sjangeren. Unngå slang og vage uttrykk i fagprosa.',
 eks:'Faglig: «dokumenterer», «betydelig». Uformelt: «greien», «liksom».'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'cloze',vanske:'medium',
 q:'Skriv inn et mer presist ord enn «ting»: «En viktig ___ er at elevene sov for lite.»',
 hint:'Tenk på et faglig ord for et poeng eller funn.',
 fasit:'faktor',fasit_v:['faktor','Faktor','observasjon','funn','poeng'],
 regel:'Erstatt vage ord som «ting», «greie», «sak» med presise fagord.',
 eks:'ting → faktor / funn / observasjon'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv om setningene til presist fagspråk.',
 tekst:'Det er mange greier som gjør at ungdom sover dårlig. Telefonen er liksom problemet. Folk sier det er ille.',
 instruksjon:'Bruk presise fagord, konkrete tall der mulig, og unngå slang og vage uttrykk.',
 maa_ha:['forskning'],
 maa_ikkje_ha:['greier','liksom','folk sier'],
 regel:'Fagspråk: konkrete ord, kildefestede tall og objektive formuleringer.',
 eks:'«greier» → «faktorer som skjermtid» · «liksom» → fjern · «folk sier» → «forskning viser»'},

{kat:'djupneoppgaver',kat_label:'Langsvar og refleksjonsoppgaver',type:'open',vanske:'vanskeleg',
 q:'Skriv et reflekterende avsnitt (10-30 min): Hvordan påvirker sosiale medier måten ungdom leser og skriver på?',
 hint:'Ta med minst ett konkret eksempel, ett motargument og en kort avslutning.',
 regel:'Bygg resonnering med tydelig påstand, begrunnelse og nyansering. Bruk fagbegreper og presise overganger.',
 eksempel_svak:'Sosiale medier er både bra og dårlig. Mange bruker det mye. Det påvirker skriving.',
 eksempel_god:'Sosiale medier effektiviserer kommunikasjon, men belønner ofte korte og raske ytringer. For elever kan det styrke kreativitet i idéfasen, samtidig som dyp lesing blir utfordret. En bevisst veksling mellom raske og langsomme skriveformer kan derfor gi bedre læringsutbytte.',
 eks:'Start med en tydelig hovedpåstand, bruk eksempler fra hverdagen, og avslutt med en faglig vurdering.'},

{kat:'djupneoppgaver',kat_label:'Langsvar og refleksjonsoppgaver',type:'open',vanske:'vanskeleg',
 q:'Skriv et drøftende miniinnlegg (10-30 min): Bør kunstig intelligens være tillatt i norsk skriftlig arbeid?',
 hint:'Presenter to tydelige argumenter for og to mot, og ta stilling til slutt.',
 regel:'En god drøfting viser flere perspektiver før konklusjon. Bruk koblingsord som «på den ene siden», «samtidig» og «derfor».',
 eksempel_svak:'KI kan være bra, men også litt dumt. Jeg synes det kommer an på.',
 eksempel_god:'På den ene siden kan KI støtte elever i idéutvikling og struktur, særlig i tidlig skrivefase. Samtidig kan ukritisk bruk svekke egen språkmestring og kildekritikk. Derfor bør KI være tillatt som støtteverktøy, men med krav om åpen bruk og tydelig elevansvar.',
 eks:'Gjør argumentene konkrete med eksempler fra skolearbeid og skriv en tydelig konklusjon.'},

/* ═══════════════════════════════════════════════════
   25. BRUKE EKSEMPLER  (8 oppgaver, kun BM)
   ═══════════════════════════════════════════════════ */
{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'mc',vanske:'lett',
 q:'Hvorfor bruker man eksempler i en fagartikkel?',
 alt:['For å fylle plass','For å gjøre abstrakte poeng konkrete og levende','For å vise egne meninger','For å erstatte kilder'],
 fasit:'For å gjøre abstrakte poeng konkrete og levende',
 regel:'Eksempler illustrerer og konkretiserer påstander slik at leseren forstår bedre.',
 eks:'Påstand: «KI kan brukes i helsevesenet.» Eksempel: «Algoritmene kan oppdage kreft på røntgenbilder.»'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'mc',vanske:'medium',
 q:'Hvor bør eksempelet plasseres i et avsnitt?',
 alt:['Helt først, før påstanden','Etter påstanden, som illustrasjon','I en separat tekst','I overskriften'],
 fasit:'Etter påstanden, som illustrasjon',
 regel:'Påstand først, deretter eksempel som illustrerer. Slik vet leseren hva poenget er før illustrasjonen.',
 eks:'Påstand: «Skjermtid påvirker søvn.» → Eksempel: «En 15-åring som bruker telefonen til kl. 23 …»'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'fillsel',vanske:'medium',
 q:'Velg det beste eksempelet til påstanden.',
 items:[
  {pre:'Påstand: «Plast i havet skader dyrelivet.»',alt:['En skillpadde ble funnet med plastpose i magen.','Plast er dårlig.','Folk bør resirkulere.'],fasit:'En skillpadde ble funnet med plastpose i magen.',post:''},
  {pre:'Påstand: «Ungdom leser mindre enn før.»',alt:['Lesing er kjedelig.','En undersøkelse viser at 15-åringer leser 30 min kortere per uke enn i 2013.','Alle vet dette.'],fasit:'En undersøkelse viser at 15-åringer leser 30 min kortere per uke enn i 2013.',post:''},
  {pre:'Påstand: «KI kan brukes i helsevesenet.»',alt:['KI er bra.','Ved Haukeland sykehus brukes KI-algoritmer til å analysere røntgenbilder.','Roboter overtar alt.'],fasit:'Ved Haukeland sykehus brukes KI-algoritmer til å analysere røntgenbilder.',post:''}
 ],
 regel:'Et godt eksempel er konkret, relevant og illustrerer påstanden direkte.',
 eks:'Plast + dyr → skillpadde med plastpose. KI + helse → Haukeland røntgenanalyse.'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Er det et godt eksempel eller et dårlig eksempel?',
 kolonner:['Godt eksempel','Dårlig eksempel'],
 ord:[
  {tekst:'Ved Svalbard ble en isbjørn funnet med plast i magen (NRK, 2023).',fasit:0},
  {tekst:'Plast er ekkelt.',fasit:1},
  {tekst:'En 15-åring i Oslo rapporterte at hun sov 2 timer mindre etter å ha fått smarttelefon.',fasit:0},
  {tekst:'Alle vet at dette er et problem.',fasit:1},
  {tekst:'I 2023 opplevde 40 % av unge nettmobbing (Medietilsynet).',fasit:0},
  {tekst:'Det er mye rart på nettet.',fasit:1}
 ],
 regel:'Gode eksempler er konkrete, kildefestede og relevante. Dårlige er vage, uten kilde eller irrelevante.',
 eks:'Godt: konkret case + kilde. Dårlig: vag generalisering.'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandene om eksempelbruk sanne eller usanne?',
 paastandar:[
  {tekst:'Eksempler bør komme etter påstanden.',sann:true},
  {tekst:'Et godt eksempel er alltid en personlig anekdote.',sann:false},
  {tekst:'Eksempler gjør abstrakte poeng konkrete.',sann:true},
  {tekst:'Man trenger aldri kilde til eksempler.',sann:false},
  {tekst:'For mange eksempler uten analyse svekker teksten.',sann:true}
 ],
 regel:'Eksempler illustrerer påstander, men må være relevante og gjerne kildefestet. Balansér eksempel og analyse.',
 eks:'Påstand → eksempel → analyse. Ikke bare eksempler uten poeng.'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'fix',vanske:'vanskeleg',
 q:'Legg til konkrete eksempler i den eksempelløse teksten.',
 tekst:'Plast i havet er skadelig for dyr. Det påvirker også mennesker. Vi bør gjøre noe.',
 errors:{'Plast i havet er skadelig for dyr.':'Plast i havet er skadelig for dyr – for eksempel ble en hval funnet med 30 kg plast i magen utenfor Bergen i 2017.','Det påvirker også mennesker.':'Mikroplast er funnet i drikkevann og sjømat, noe som betyr at mennesker også eksponeres (WHO, 2022).','Vi bør gjøre noe.':'Tiltak som panteordning for fiskeutstyr kan redusere marin forsøpling – et pilotprosjekt i Lofoten viste 50 % nedgang.'},
 fasit:'hval + Bergen · mikroplast + WHO · panteordning + Lofoten',
 regel:'Konkrete eksempler med detaljer (sted, tall, kilde) gjør teksten levende og troverdig.',
 eks:'Dyr: hval i Bergen 2017. Mennesker: mikroplast i drikkevann (WHO). Tiltak: panteordning Lofoten.'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'cloze',vanske:'lett',
 q:'Skriv inn uttrykket som innleder et eksempel: «Mange dyr rammes av plast, ___ skilpadder som forveksler plastposer med maneter.»',
 hint:'Et vanlig uttrykk som introduserer et eksempel.',
 fasit:'for eksempel',fasit_v:['for eksempel','For eksempel','som for eksempel','blant annet'],
 regel:'«For eksempel», «blant annet» og «som» er vanlige eksempel-innledere i fagprosa.',
 eks:'for eksempel / blant annet / som'},

{kat:'bruke_eksempel',kat_label:'Bruke eksempler',type:'mcset',vanske:'vanskeleg',
 q:'Vurder eksempelbruken i teksten.',
 tekst:'Sosiale medier kan ha negative konsekvenser for ungdom. For eksempel viser en studie fra Medietilsynet (2024) at 40 % av 13-åringer har opplevd nettmobbing. Et annet eksempel er at søvnkvaliteten synker blant dem som bruker telefonen etter kl. 22 (FHI, 2023).',
 questions:[
  {q:'Er eksemplene relevante til påstanden?',alt:['Ja, begge illustrerer negative konsekvenser','Nei, de handler om noe annet','Bare det første er relevant'],fasit:0},
  {q:'Er eksemplene kildefestet?',alt:['Ja, begge har kilde','Bare det første','Nei, ingen har kilde'],fasit:0},
  {q:'Hva kunne styrke avsnittet ytterligere?',alt:['Fjerne kildene','Legge til en analyse av hva eksemplene viser','Legge til tre eksempler til'],fasit:1}
 ],
 regel:'Gode eksempler: relevante + kildefestede + fulgt av analyse. Eksempel uten analyse = bare oppramsing.',
 eks:'Eksempel + analyse = styrker teksten. Bare eksempel = oppramsing.'},

/* ═══════════════════════════════════════════════════
   26. TILPASS TIL LESAREN  (8 oppgaver, kun BM)
   ═══════════════════════════════════════════════════ */
{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'mc',vanske:'lett',
 q:'Hvorfor er det viktig å tilpasse teksten til leseren?',
 alt:['For å gjøre teksten lengre','For å sikre at leseren forstår og engasjeres','For å imponere læreren','For å bruke flest mulig vanskelige ord'],
 fasit:'For å sikre at leseren forstår og engasjeres',
 regel:'Tilpasning til leseren betyr å velge språk, eksempler og tonefall som passer målgruppen.',
 eks:'Til ungdom: konkrete eksempler fra hverdagen. Til voksne: fagtermer og statistikk.'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'mc',vanske:'medium',
 q:'Hvilken tekst er best tilpasset ungdom som målgruppe?',
 alt:['«Hermeneutiske implikasjoner av digitaliseringen fordrer en paradigmatisk nyorientering.»','«Visste du at 9 av 10 tenåringer er på sosiale medier hver dag? Det påvirker mer enn du tror.»','«Det er veldig mye skjermbruk blant folk.»','«Ifølge diverse forskning er det problematisk.»'],
 fasit:'«Visste du at 9 av 10 tenåringer er på sosiale medier hver dag? Det påvirker mer enn du tror.»',
 regel:'Til ungdom: konkrete tall, direkte henvendelse (du/dere), dagligdagse eksempler. Unngå unødig akademisk sjargong.',
 eks:'Til ungdom: «Visste du at …» · Til fagfolk: «Forskning indikerer at …»'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Er formuleringen best tilpasset ungdom eller fagjury?',
 kolonner:['Tilpasset ungdom','Tilpasset fagjury'],
 ord:[
  {tekst:'Visste du at 95 % av 13-åringer har smarttelefon?',fasit:0},
  {tekst:'Kvantitative data indikerer signifikant økning i skjermtid blant unge respondenter.',fasit:1},
  {tekst:'Tenk deg at du våkner opp og det første du gjør er å sjekke Instagram.',fasit:0},
  {tekst:'Longitudinelle studier korrelerer økt skjermeksponering med redusert søvnkvalitet.',fasit:1},
  {tekst:'Det er faktisk ganske mange som sover dårligere på grunn av mobilen.',fasit:0},
  {tekst:'Helsedirektoratets rapport (2023) dokumenterer en statistisk signifikant nedgang.',fasit:1}
 ],
 regel:'Tilpass språknivå: ungdom = konkret, direkte, nær. Fagjury = fagtermer, presist, formelt.',
 eks:'Ungdom: «Visste du …» · Fagjury: «Kvantitative data indikerer …»'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'fillsel',vanske:'medium',
 q:'Velg formuleringen som passer best til målgruppen.',
 items:[
  {pre:'Til ungdomsskoleelever:',alt:['Digitaliseringsprosessen aksentuerer behovet for mediekompetanse.','Vet du hvordan du sjekker om en nyhet er ekte? Her er tre enkle tips.','Mediekompetanse i digitale kontekster.'],fasit:'Vet du hvordan du sjekker om en nyhet er ekte? Her er tre enkle tips.',post:''},
  {pre:'Til en sensor som vurderer eksamen:',alt:['Lol, plast er overalt.','Forskning fra NIVA (2023) dokumenterer en økning i mikroplastkonsentrasjonen i norske innsjøer.','Det er ganske mye plast i vannet.'],fasit:'Forskning fra NIVA (2023) dokumenterer en økning i mikroplastkonsentrasjonen i norske innsjøer.',post:''},
  {pre:'Til avisen (leserbrev):',alt:['Ifølge Habermas\' diskursetikk bør …','Vi som foreldre er bekymret for skolens mobilpolitikk. Barna forteller at de ikke klarer å konsentrere seg.','Det konstateres irregulariteter i skolens digitalpolitikk.'],fasit:'Vi som foreldre er bekymret for skolens mobilpolitikk. Barna forteller at de ikke klarer å konsentrere seg.',post:''}
 ],
 regel:'Tilpass språket til mottakeren: eleven = konkret og nært, sensoren = faglig og presist, avisen = engasjerende og saklig.',
 eks:'Elev: «Vet du …» · Sensor: «Forskning dokumenterer …» · Avis: «Vi er bekymret …»'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandene om lesetilpasning sanne eller usanne?',
 paastandar:[
  {tekst:'Man bør alltid bruke det mest avanserte språket mulig.',sann:false},
  {tekst:'Eksempler bør tilpasses det målgruppen kjenner seg igjen i.',sann:true},
  {tekst:'En tekst til ungdom kan bruke direkte henvendelse (du/dere).',sann:true},
  {tekst:'En fagtekst til sensor bør bruke presise fagtermer.',sann:true},
  {tekst:'Tilpasning betyr å endre fakta etter hva leseren vil høre.',sann:false}
 ],
 regel:'Tilpasning handler om språknivå, eksempler og tonefall – ikke om å endre fakta.',
 eks:'Ungdom: nær og konkret. Sensor: presist og faglig. Avis: engasjerende.'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'fix',vanske:'vanskeleg',
 q:'Tilpass denne teksten til ungdom som målgruppe (fra en akademisk stil).',
 tekst:'Kvantitative analyser av digitale medievaner blant respondenter i aldersgruppen 13–18 indikerer signifikant økning i daglig skjermeksponering.',
 errors:{'Kvantitative analyser av digitale medievaner blant respondenter i aldersgruppen 13–18 indikerer signifikant økning i daglig skjermeksponering':'Ny forskning viser at tenåringer bruker mobilen mye mer enn før – faktisk over tre timer daglig'},
 fasit:'Ny forskning viser at tenåringer bruker mobilen mye mer enn før – faktisk over tre timer daglig',
 regel:'Til ungdom: forenkle fagsjargong, bruk konkrete tall og direkte språk.',
 eks:'«respondenter i aldersgruppen 13–18» → «tenåringer» · «signifikant økning» → «mye mer»'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'cloze',vanske:'medium',
 q:'Skriv inn riktig ord: Å tilpasse språk og eksempler til den som skal lese teksten, kalles å skrive for en bestemt ___.',
 hint:'Hvem er teksten ment for?',
 fasit:'målgruppe',fasit_v:['målgruppe','Målgruppe','mottaker','mottakar','leser'],
 regel:'Målgruppen er den/de teksten er skrevet for. Språk, eksempler og tonefall tilpasses.',
 eks:'Målgruppe ungdom: nært og konkret. Målgruppe fagfolk: presist og formelt.'},

{kat:'tilpass_til_lesaren',kat_label:'Tilpass til leseren',type:'omskriv',vanske:'vanskeleg',
 q:'Skriv om teksten slik at den passer for en fagsensor (fra en uformell stil).',
 tekst:'Lol, det er sykt mange ungdommer som bruker telefonen hele tiden. Det er ikke bra for dem liksom.',
 instruksjon:'Bruk fagspråk, vær presis og objektiv. Legg til en kildehenvisning.',
 maa_ha:['forskning'],
 maa_ikkje_ha:['lol','sykt','liksom'],
 regel:'Til sensor: saklig fagspråk, konkrete tall, kildehenvisninger. Ingen slang eller vage uttrykk.',
 eks:'«sykt mange» → «en betydelig andel» · «ikke bra» → «dokumenterte negative konsekvenser»'},

/* ═══════════════════════════════════════════════════
   EKSTRA: 10 lukka omskrivingsoppgåver (fix-type)
   ═══════════════════════════════════════════════════ */

{kat:'ordklasser',kat_label:'Ordklasser',type:'fix',vanske:'lett',
 q:'Rett de tre verbene som står i feil tid (skal være fortid).',
 tekst:'I går besøkte vi bestemor. Hun lager pannekaker til oss. Vi sitter i stuen og se på en morsom film etter middag.',
 errors:{'lager':'lagde','sitter':'satt','se':'så'},
 fasit:'lagde · satt · så',
 regel:'Verb bøyes i riktig tid. Fortelling om fortiden bruker preteritum: lage → lagde, sitte → satt, se → så.',
 eks:'lager → lagde · sitter → satt · se → så'},

{kat:'kj_skj',kat_label:'Kj- og skj-lyd',type:'fix',vanske:'lett',
 q:'Rett de tre stavefeilene med kj- og skj-lyd.',
 tekst:'Lise ville sjøpe en ny sjorte i butikken. Hun sjente at det var mye å velge mellom. Til slutt fant hun en fin bluse i riktig størrelse.',
 errors:{'sjøpe':'kjøpe','sjorte':'skjorte','sjente':'kjente'},
 fasit:'kjøpe · skjorte · kjente',
 regel:'Kj-lyden skrives «kj» (kjøpe, kjenne, kjøre). Skj-lyden skrives «skj» (skjorte, skjule, skjerm).',
 eks:'kjøpe (kj-lyd) · kjenne (kj-lyd) · skjorte (skj-lyd)'},

{kat:'bindeord',kat_label:'Bindeord',type:'fix',vanske:'medium',
 q:'Rett de tre feil brukte bindeordene.',
 tekst:'Eleven øvde mye, så han fikk dårlig karakter på prøven. Han var skuffet, og han bestemte seg for å prøve igjen. Dessuten leste han pensum på nytt og klarte det bedre neste gang.',
 errors:{'mye, så':'mye, men','skuffet, og':'skuffet, derfor','Dessuten':'Deretter'},
 fasit:'mye, men · skuffet, derfor · Deretter',
 regel:'Bindeord signaliserer forholdet mellom setninger: «men» = motsetning, «derfor» = årsak–virkning, «deretter» = rekkefølge.',
 eks:'Han øvde, men fikk dårlig resultat (motsetning) · Han var skuffet, derfor prøvde han igjen (virkning)'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'fix',vanske:'medium',
 q:'Bytt ut de fire uformelle uttrykkene med saklig språk.',
 tekst:'Undersøkelser viser at mange drar til syden om sommeren. Det er dritkult med sol og varme. Turister chiller på stranda og tar selfier. Konklusjonen er at ferie liksom er viktig for helsa.',
 errors:{'dritkult':'svært populært','chiller':'slapper av','selfier':'bilder av seg selv','liksom':'åpenbart'},
 fasit:'svært populært · slapper av · bilder av seg selv · åpenbart',
 regel:'Sakprosa bruker nøytralt, formelt språk. Slang og muntlige uttrykk hører hjemme i uformelle tekster.',
 eks:'«dritkult» → «svært populært» · «chiller» → «slapper av» · «liksom» → «åpenbart»'},

{kat:'og_aa',kat_label:'Og / å',type:'fix',vanske:'medium',
 q:'Rett de tre og/å-feilene.',
 tekst:'Klassen bestemte seg for og arrangere en konsert. Alle måtte huske og øve på sangene. Læreren lovte og hjelpe med lydanlegget.',
 errors:{'for og arrangere':'for å arrangere','huske og øve':'huske å øve','lovte og hjelpe':'lovte å hjelpe'},
 fasit:'for å arrangere · huske å øve · lovte å hjelpe',
 regel:'Etter verb brukes infinitivsmerket «å», ikke «og». Test: kan du sette inn «for» foran? Da er det «å».',
 eks:'bestemte seg for å · huske å · lovte å'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'fix',vanske:'medium',
 q:'Rett de fire særskrivingsfeilene.',
 tekst:'Ungdoms skolen arrangerte en bok kveld i kultur huset. Elever og foreldre var invitert til en koselig lesestund med bolle salg.',
 errors:{'Ungdoms skolen':'Ungdomsskolen','bok kveld':'bokkveld','kultur huset':'kulturhuset','bolle salg':'bollesalg'},
 fasit:'Ungdomsskolen · bokkveld · kulturhuset · bollesalg',
 regel:'Sammensatte substantiv skrives i ett ord på norsk: ungdomsskole, bokkveld, kulturhus.',
 eks:'Ungdomsskolen (ungdom + skole) · kulturhuset (kultur + hus)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fix',vanske:'medium',
 q:'Rett de fire feilene med enkel og dobbel konsonant.',
 tekst:'Guten lekte med katen i hagen. Balen spratt over gjerdet og havnet hos naboen. Om naten drømte han at han var fotballspiller.',
 errors:{'Guten':'Gutten','katen':'katten','Balen':'Ballen','naten':'natten'},
 fasit:'Gutten · katten · Ballen · natten',
 regel:'Etter kort vokal skrives dobbel konsonant: gutt (kort u), katt (kort a), ball (kort a), natt (kort a).',
 eks:'gutt (kort u → tt) · katt (kort a → tt) · ball (kort a → ll)'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fix',vanske:'lett',
 q:'Rett de tre tegnsettingsfeilene.',
 tekst:'Kan du hjelpe meg med leksene. Mamma sa vi trenger melk brød og ost fra butikken. Har du lyst til å bli med',
 errors:{'leksene.':'leksene?','melk brød':'melk, brød','bli med':'bli med?'},
 fasit:'leksene? · melk, brød · bli med?',
 regel:'Spørsmål avsluttes med spørsmålstegn. Komma brukes mellom ledd i oppramsing (unntatt foran «og»).',
 eks:'Kan du hjelpe meg? (spørsmålstegn) · melk, brød og ost (komma i oppramsing)'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'fix',vanske:'medium',
 q:'Rett de tre setningene med feil ordstilling (V2-regelen).',
 tekst:'I går jeg gikk på kino med venner. Filmen var spennende, men litt lang. Etterpå vi spiste pizza, og alle hadde det gøy. Dessverre jeg glemte jakken min på kinoen.',
 errors:{'I går jeg gikk':'I går gikk jeg','Etterpå vi spiste':'Etterpå spiste vi','Dessverre jeg glemte':'Dessverre glemte jeg'},
 fasit:'I går gikk jeg · Etterpå spiste vi · Dessverre glemte jeg',
 regel:'I norske hovedsetninger står verbet alltid på andreplass (V2). Når setningen åpner med adverb, flyttes verbet foran subjektet.',
 eks:'I går gikk jeg (V2) · Etterpå spiste vi (V2) · Dessverre glemte jeg (V2)'},

{kat:'ordval',kat_label:'Ordvalg og presisjon',type:'fix',vanske:'lett',
 q:'Bytt ut de tre upresise ordene med mer passende fagord.',
 tekst:'Forskeren fikk en ting som viste at hypotesen var riktig. Han var glad og fortalte om greiene til kollegaene. De sa at det var et bra funn.',
 errors:{'en ting':'et resultat','greiene':'funnene','bra':'betydelig'},
 fasit:'et resultat · funnene · betydelig',
 regel:'I sakprosa bør du bruke presise ord: «ting» og «greier» er for vage – bruk fagtermer som «resultat» og «funn».',
 eks:'«en ting» → «et resultat» · «greiene» → «funnene» · «bra» → «betydelig»'},

/* ═══════════════════════════════════════════════════
   EKSTRA: 30 lette oppgaver (4.–5. trinn)
   ═══════════════════════════════════════════════════ */

/* --- og/å (5) --- */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg riktig: «Jeg liker ___ spise is.»',
 alt:['og','å'],fasit:1,
 regel:'«Å» er infinitivsmerke og står foran verb. «Og» binder sammen to ting.',
 eks:'Jeg liker å spise. (å + verb) · Kake og is. (og binder sammen)'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg riktig: «Mamma ___ pappa er hjemme.»',
 alt:['og','å'],fasit:0,
 regel:'«Og» binder sammen to ord eller setninger. «Å» kommer foran verb.',
 eks:'Mamma og pappa (og = binder sammen) · liker å lese (å + verb)'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg riktig: «Hun begynte ___ le.»',
 alt:['og','å'],fasit:1,
 regel:'Etter verb som «begynne», «slutte», «prøve» bruker vi «å» + nytt verb.',
 eks:'begynte å le · sluttet å gråte · prøvde å hoppe'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: Per ___ Kari gikk til skolen.',
 hint:'Binder vi sammen to navn, eller er det et verb?',
 fasit:'og',fasit_v:['og','Og'],
 regel:'«Og» binder sammen to navn, ting eller setninger.',
 eks:'Per og Kari · epler og pærer · hun lo og han smilte'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: Han liker ___ tegne.',
 hint:'Kommer det et verb etter?',
 fasit:'å',fasit_v:['å','Å'],
 regel:'«Å» er infinitivsmerke og står foran verb (handlingsord).',
 eks:'liker å tegne · glemte å spise · prøvde å sove'},

/* --- sammensatte ord (5) --- */
{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'lett',
 q:'Hvordan skrives det riktig?',
 alt:['mot gang','motgang'],fasit:1,
 regel:'Sammensatte ord skrives alltid i ett ord på norsk.',
 eks:'motgang, medgang, fotball, iskrem'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'lett',
 q:'Hvilket ord er riktig skrevet?',
 alt:['hunde valp','hundevalp'],fasit:1,
 regel:'Når to ord settes sammen til ett begrep, skrives de i ett ord.',
 eks:'hundevalp, kattemat, fuglebur'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'mc',vanske:'lett',
 q:'Hvilket ord er riktig?',
 alt:['sjokoladekake','sjokolade kake'],fasit:0,
 regel:'Sammensatte ord skrives i ett: sjokolade + kake = sjokoladekake.',
 eks:'sjokoladekake, jordbærsyltetøy, pannekake'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'cloze',vanske:'lett',
 q:'Skriv som ett ord: fotball + bane = ___',
 hint:'Sett de to ordene sammen uten mellomrom.',
 fasit:'fotballbane',fasit_v:['fotballbane','Fotballbane'],
 regel:'Sett ordene rett etter hverandre uten mellomrom.',
 eks:'fotball + bane = fotballbane · is + krem = iskrem'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'cloze',vanske:'lett',
 q:'Skriv som ett ord: is + krem = ___',
 hint:'Sett ordene sammen.',
 fasit:'iskrem',fasit_v:['iskrem','Iskrem'],
 regel:'Sammensatte ord skrives i ett uten mellomrom.',
 eks:'iskrem, iskrembeger, ispinne'},

/* --- dobbel konsonant (5) --- */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hvilket ord er riktig stavet?',
 alt:['katt','kat'],fasit:0,
 regel:'Etter kort vokal skriver vi dobbel konsonant: katt (kort a).',
 eks:'katt, hatt, natt, ratt'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hvilket ord er riktig?',
 alt:['balen','ballen'],fasit:1,
 regel:'«Ball» har kort a, derfor dobbel l: ballen.',
 eks:'ballen, hallen, vallen'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Velg riktig stavemåte:',
 alt:['gutt','gut'],fasit:0,
 regel:'«Gutt» har kort u, derfor dobbel t.',
 eks:'gutt, gutten, gutter'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn riktig: Jeg har en ___ som heter Pusur.',
 hint:'Husedyr som sier mjau. Kort a-lyd.',
 fasit:'katt',fasit_v:['katt','Katt'],
 regel:'Etter kort vokal bruker vi dobbel konsonant.',
 eks:'katt (kort a → tt) · hund (lang u → enkel d)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: Vi spilte ___ i friminuttet.',
 hint:'Rund ting man sparker. Kort a-lyd.',
 fasit:'ball',fasit_v:['ball','Ball','fotball'],
 regel:'«Ball» har kort a-lyd, derfor dobbel l.',
 eks:'ball (kort a → ll) · bok (lang o → enkel k)'},

/* --- ordklasser (5) --- */
{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hva slags ord er «løper»?',
 alt:['Substantiv (navneord)','Verb (handlingsord)','Adjektiv (beskrivelseord)'],fasit:1,
 regel:'Verb er handlingsord – de forteller hva noen gjør: løpe, hoppe, sove.',
 eks:'løper, spiser, leser – alle er verb'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hva slags ord er «hund»?',
 alt:['Substantiv (navneord)','Verb (handlingsord)','Adjektiv (beskrivelseord)'],fasit:0,
 regel:'Substantiv er navneord – navn på ting, dyr og personer: hund, bok, jente.',
 eks:'hund, katt, skole, ball – alle er substantiv'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hva slags ord er «stor»?',
 alt:['Substantiv (navneord)','Verb (handlingsord)','Adjektiv (beskrivelseord)'],fasit:2,
 regel:'Adjektiv beskriver hvordan noe er: stor, liten, rød, fin.',
 eks:'stor, liten, pen, morsom – alle er adjektiv'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hvilket av disse ordene er et verb?',
 alt:['bok','hopper','rød'],fasit:1,
 regel:'Verb forteller hva noen gjør. Test: «å ___» – fungerer det? Da er det et verb.',
 eks:'å hoppe (verb) · bok (substantiv) · rød (adjektiv)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hvilket av disse ordene er et adjektiv?',
 alt:['spiser','liten','skole'],fasit:1,
 regel:'Adjektiv beskriver egenskaper. Test: «noe er ___» – fungerer det? Da er det adjektiv.',
 eks:'noe er liten (adjektiv) · spiser (verb) · skole (substantiv)'},

/* --- tegnsetting (5) --- */
{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvilket tegn passer: «Hva heter du___»',
 alt:['.','?','!'],fasit:1,
 regel:'Spørsmål avsluttes med spørsmålstegn (?).',
 eks:'Hva heter du? · Hvor bor du? · Liker du is?'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvilket tegn passer: «Jeg liker å lese___»',
 alt:['.','?','!'],fasit:0,
 regel:'Vanlige fortellende setninger avsluttes med punktum (.).',
 eks:'Jeg liker å lese. · Hun bor i Oslo. · Vi spiste frokost.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvilket tegn passer: «Pass deg___»',
 alt:['.','?','!'],fasit:2,
 regel:'Utrop og advarsler avsluttes med utropstegn (!).',
 eks:'Pass deg! · Stopp! · Hurra!'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'cloze',vanske:'lett',
 q:'Skriv riktig tegn etter setningen: «Hvor bor du»',
 hint:'Er dette en fortelling, et spørsmål eller et utrop?',
 fasit:'?',fasit_v:['?'],
 regel:'Spørsmål avsluttes med spørsmålstegn.',
 eks:'Hvor bor du? · Hva gjør du? · Hvem er det?'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'cloze',vanske:'lett',
 q:'Skriv riktig tegn etter setningen: «Hunden min er snill»',
 hint:'Er dette en fortelling, et spørsmål eller et utrop?',
 fasit:'.',fasit_v:['.'],
 regel:'Fortellende setninger avsluttes med punktum.',
 eks:'Hunden min er snill. · Katten sover. · Solen skinner.'},

/* --- setningsbygging (5) --- */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hvilken setning er riktig?',
 alt:['Hund brun er den.','Den brune hunden er fin.','Er brun hund den.'],fasit:1,
 regel:'En norsk setning har vanligvis rekkefølgen subjekt – verb – objekt.',
 eks:'Den brune hunden (subjekt) er (verb) fin (beskrivelse).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Velg den riktige setningen:',
 alt:['Liker jeg is.','Jeg liker is.','Is jeg liker.'],fasit:1,
 regel:'Vanlig rekkefølge i norsk: subjekt + verb + resten.',
 eks:'Jeg (subjekt) liker (verb) is (objekt).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hvilken setning er riktig?',
 alt:['Vi gikk til skolen i dag.','Til i dag skolen vi gikk.','Gikk vi til dag i skolen.'],fasit:0,
 regel:'Tid og sted kommer gjerne til slutt i setningen.',
 eks:'Vi gikk til skolen i dag. · Hun leste boken i går.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Velg riktig setning:',
 alt:['Katten sov på sofaen.','Sov katten sofaen på.','På katten sofaen sov.'],fasit:0,
 regel:'Subjektet (den som gjør noe) kommer først, deretter verbet.',
 eks:'Katten (subjekt) sov (verb) på sofaen (sted).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hvilken setning er riktig?',
 alt:['Boken leste gutten.','Gutten leste boken.','Leste boken gutten.'],fasit:1,
 regel:'Den som gjør handlingen (subjektet) kommer vanligvis først.',
 eks:'Gutten (subjekt) leste (verb) boken (objekt).'}

]; // end BANKV2
if (typeof window !== 'undefined') window.BANKV2 = BANKV2;

/* ─── STATE ──────────────────────────────────────── */
var MTS = {
  pool: [],
  manualQueue: [],
  manualCursor: 0,
  manualMode: false,
  served: 0,
  targetCount: 8,
  score: 0,
  maxScore: 0,
  answered: false,
  streak: 0,
  history: [],
  current: null,
  catHistory: {},
  retryQueue: [],
  sinceLastRetry: 0,
  feilLog: {},
  level: 'adaptiv',
  taskStart: 0,

  /* gamification */
  sessionXP: 0,

  showRule: false,
  selectedCats: [],
  active: false
};

/* ─── HJELPEFUNKSJONER ───────────────────────────── */
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

function mtNorm(s) { return String(s).trim().toLowerCase(); }

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
var MT_LS_LEGACY_KEY = 'nlMestringBM';
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
    var shared = mtLsReadKey(MT_LS_KEY);
    if (shared && Object.keys(shared).length) return mtLsSanitize(shared);

    var backup = mtLsReadKey(MT_LS_BACKUP_KEY);
    if (backup && Object.keys(backup).length) return mtLsSanitize(backup);

    var legacy = mtLsReadKey(MT_LS_LEGACY_KEY);
    if (legacy && Object.keys(legacy).length) return mtLsSanitize(legacy);

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
  { name: 'Ordl\u00e6rling',         xp: 0,    icon: '\uD83C\uDF31' },
  { name: 'Setningssmed',       xp: 80,   icon: '\uD83D\uDD28' },
  { name: 'Tekstbygger',        xp: 250,  icon: '\uD83C\uDFD7' },
  { name: 'Grammatikksnekker',  xp: 500,  icon: '\u2699\uFE0F' },
  { name: 'Spr\u00e5kmester',       xp: 900,  icon: '\uD83C\uDFC6' },
  { name: 'Norskmester',        xp: 1500, icon: '\uD83D\uDC51' }
];

function mtXpCalc(correct, pts, maxPts, vanske, streak, isRetry) {
  if (!correct && pts === 0) return 0;
  var base = { lett: 8, medium: 15, vanskelig: 25 };
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

/* ─── PERSONLIG FEILLOGG ─────────────────────────── */
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

/* Start \u00f8kt basert p\u00e5 feillogg-oppgaver */
function mtStartFeillogg() {
  var logg = mtFeilloggGet();
  if (!logg.length) { alert('Ingen tidligere feil \u00e5 \u00f8ve p\u00e5 enn\u00e5!'); return; }
  var ids = {};
  logg.forEach(function (e) { if (e.id) ids[e.id] = true; });
  var pool = BANKV2.filter(function (t) { return t.id && ids[t.id]; });
  if (!pool.length) {
    var katSet = {};
    logg.forEach(function (e) { katSet[e.kat] = true; });
    pool = BANKV2.filter(function (t) { return katSet[t.kat]; });
  }
  if (!pool.length) { alert('Fant ikke oppgaver som matcher feilloggen din.'); return; }
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

/* ─── DAGLIG STREAK ──────────────────────────────── */
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

/* ─── BADGES / PRESTASJONER ──────────────────────── */
var MT_BADGE_DEFS = [
  { id: 'first_session',   icon: '\uD83C\uDF1F', namn: 'F\u00f8rste \u00f8kt',             beskriving: 'Fullf\u00f8rte f\u00f8rste \u00f8vings\u00f8kt',                  check: function (d) { return d.sessions >= 1; } },
  { id: 'ten_correct',     icon: '\uD83C\uDFAF', namn: '10 riktige',              beskriving: '10 riktige svar totalt',                       check: function (d) { return d.totalRett >= 10; } },
  { id: 'fifty_correct',   icon: '\uD83D\uDD25', namn: '50 riktige',              beskriving: '50 riktige svar totalt',                       check: function (d) { return d.totalRett >= 50; } },
  { id: 'hundred_tasks',   icon: '\uD83D\uDCAF', namn: '100 oppgaver',            beskriving: 'Svart p\u00e5 100 oppgaver totalt',                check: function (d) { return d.totalTasks >= 100; } },
  { id: 'all_cats',        icon: '\uD83C\uDF08', namn: 'Allsidig',                beskriving: 'Pr\u00f8vd alle kategorier',                       check: function (d) { return d.allCats; } },
  { id: 'streak3',         icon: '\u26A1',        namn: '3 dager p\u00e5 rad',         beskriving: '\u00d8vd 3 dager p\u00e5 rad',                          check: function (d) { return d.streakCurrent >= 3; } },
  { id: 'streak7',         icon: '\uD83D\uDD25', namn: '7 dager p\u00e5 rad',         beskriving: '\u00d8vd en hel uke p\u00e5 rad',                       check: function (d) { return d.streakCurrent >= 7; } },
  { id: 'perfect_session', icon: '\uD83C\uDFC5', namn: 'Perfekt \u00f8kt',            beskriving: 'Fullf\u00f8rt en \u00f8kt med 100 % riktig',           check: function (d) { return d.sessionPerfect; } },
  { id: 'hard_session',    icon: '\uD83E\uDDD7', namn: 'Utfordrer seg selv',       beskriving: 'Fullf\u00f8rt en \u00f8kt p\u00e5 vanskelig niv\u00e5',           check: function (d) { return d.hardSession; } },
  { id: 'xp500',           icon: '\uD83D\uDE80', namn: '500 XP',                  beskriving: 'Tjent 500 erfaringspoeng totalt',              check: function (d) { return d.totalXP >= 500; } },
  { id: 'xp1500',          icon: '\uD83D\uDC51', namn: '1500 XP',                 beskriving: 'Tjent 1500 erfaringspoeng totalt',             check: function (d) { return d.totalXP >= 1500; } },
  { id: 'retry_hero',      icon: '\uD83D\uDD04', namn: 'L\u00e6rer av feil',          beskriving: 'Klart 5 retry-oppgaver riktig',                check: function (d) { return d.retryWins >= 5; } }
];

function mtBadgesGet() {
  var data = mtLsGet();
  return data.badges || {};
}

function mtBadgesCheck(sessionData) {
  var data = mtLsGet();
  if (!data.badges) data.badges = {};
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
    hardSession: sessionData && sessionData.level === 'vanskelig',
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
  if (m >= 0.8) return 'vanskelig';
  if (m < 0.5) return 'lett';
  return 'medium';
}

function mtPickNext() {
  if (MTS.manualMode) {
    if (MTS.manualCursor >= MTS.manualQueue.length) return null;
    return { task: MTS.manualQueue[MTS.manualCursor++], isRetry: false };
  }
  if (MTS.retryQueue.length && MTS.sinceLastRetry >= 3) {
    MTS.sinceLastRetry = 0;
    return { task: MTS.retryQueue.shift(), isRetry: true };
  }
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
  MTS._leveledUpLive = false;
  MTS._uiCache = { score: 0, xp: 0, streak: 0 };
}

function mtOpenSessionUi() {
  var win = $mt('nl-ad-win');
  var summary = $mt('nl-ad-summary');
  var body = $mt('nl-ad-win-body');
  var actions = $mt('nl-ad-actions');
  var headerClose = $mt('nl-ad-win-close');
  var card = win ? win.querySelector('.adp-win-card') : null;
  if (win) win.hidden = false;
  if (summary) summary.hidden = true;
  if (body) body.innerHTML = '';
  if (actions) actions.style.display = 'flex';
  if (headerClose) headerClose.style.display = '';
  if (card) card.classList.toggle('mt-manual-mode', !!MTS.manualMode);
  mtUpdateWindowHeader();
}

function mtBuildManualNavHtml(currentTask) {
  if (!MTS.manualMode || !Array.isArray(MTS.manualQueue) || MTS.manualQueue.length <= 1) return '';

  var t = currentTask || MTS.current || MTS.manualQueue[0];
  if (!t) return '';

  var currentIx = MTS.manualQueue.indexOf(t);
  if (currentIx < 0) currentIx = 0;
  var sameCat = [];
  MTS.manualQueue.forEach(function (task, i) {
    if (task && t && task.kat === t.kat) sameCat.push({ i: i, task: task });
  });
  var options = sameCat.length > 1 ? sameCat : MTS.manualQueue.map(function (task, i) {
    return { i: i, task: task };
  });
  if (options.length <= 1) return '';

  var optsHtml = options.map(function (o, pos) {
    var selected = o.i === currentIx ? ' selected' : '';
    var label = (pos + 1) + '. ' + mtTaskLabel(o.task);
    return '<option value="' + o.i + '"' + selected + '>' + mtEsc(label) + '</option>';
  }).join('');

  return '<div class="mt-manual-nav-head">' +
    '<label for="mt-manual-task-select">Velg oppgave i kategorien</label>' +
    '<select id="mt-manual-task-select" class="gram-blank" onchange="mtManualJump(this.value)" aria-label="Velg oppgave i kategorien">' +
      optsHtml +
    '</select>' +
  '</div>';
}

function mtUpdateWindowHeader(currentTask) {
  var titleEl = $mt('nl-ad-win-title');
  if (titleEl) {
    titleEl.textContent = MTS.manualMode
      ? 'Skrivemesteren - manuell modus'
      : 'Skrivemesteren - adaptive øvingsoppgaver';
  }

  var head = titleEl ? titleEl.parentElement : null;
  if (!head) return;

  var oldNav = head.querySelector('.mt-head-manual-nav-wrap');
  if (oldNav && oldNav.parentNode) oldNav.parentNode.removeChild(oldNav);

  var navHtml = mtBuildManualNavHtml(currentTask);
  if (!navHtml) return;

  var wrap = document.createElement('div');
  wrap.className = 'mt-head-manual-nav-wrap';
  wrap.innerHTML = navHtml;
  head.appendChild(wrap);
}

/* ─── SESJON ─────────────────────────────────────── */

function mtStart() {
  var valgte = [];
  document.querySelectorAll('#nl-ad-cats .adp-cat.on').forEach(function (el) {
    valgte.push(el.dataset.cat);
  });
  if (!valgte.length) { alert('Velg minst \u00e9n kategori.'); return; }

  var levelEl = $mt('nl-ad-level');
  var countEl = $mt('nl-ad-count');
  var level = levelEl ? levelEl.value : 'adaptiv';
  var count = countEl ? parseInt(countEl.value, 10) : 8;
  if (!Number.isFinite(count) || count < 3) count = 3;
  if (count > 25) count = 25;

  var pool = BANKV2.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
  if (level !== 'adaptiv') pool = pool.filter(function (t) { return t.vanske === level; });
  pool = mtShuffle(pool);
  if (!pool.length) { alert('Ingen oppgaver passer valgene dine.'); return; }
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
  var input = Array.isArray(taskIndexes) ? taskIndexes : [];
  var tasks = [];

  input.forEach(function(entry) {
    if (entry == null) return;

    if (typeof entry === 'number' || (typeof entry === 'string' && String(entry).trim() !== '')) {
      var byIndex = BANKV2[Number(entry)];
      if (byIndex) tasks.push(byIndex);
      return;
    }

    if (typeof entry === 'object') {
      var idx = BANKV2.indexOf(entry);
      if (idx >= 0) tasks.push(BANKV2[idx]);
    }
  });

  if (!tasks.length && typeof startIndex === 'number' && startIndex >= 0 && startIndex < BANKV2.length) {
    tasks = [BANKV2[startIndex]];
  }

  if (!tasks.length) {
    alert('Fant ingen manuelle oppgaver å starte.');
    return;
  }

  var start = Number(startIndex);
  if (!Number.isFinite(start) || start < 0 || start >= tasks.length) start = 0;
  var ordered = tasks.slice(start).concat(tasks.slice(0, start));
  var cats = [];
  ordered.forEach(function(task) {
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

  if (liveP) liveP.textContent = 'Oppgave ' + Math.min(done + 1, total) + ' av ' + total;
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
  if (masteryTrophies) masteryTrophies.textContent = unlocked + '/' + totalBadges + ' troféer';
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
    '<div class="mt-fb-corr-row"><strong>Foreslått versjon:</strong> ' + mtEscHighlight(corrected, correctedTokens, 'mt-mark-ok') + '</div>' +
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
    streakEl.textContent = s + (s === 1 ? ' dag' : ' dager');
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
   RENDER
══════════════════════════════════════════════════════ */

function mtRenderTask(t, isRetry) {
  var body = $mt('nl-ad-win-body');
  if (!body) return;
  mtUpdateWindowHeader(t);

  var vMap = { lett: 'Lett', medium: 'Medium', vanskelig: 'Vanskelig', vanskeleg: 'Vanskelig' };
  var vLabel = vMap[t.vanske] || '';

  var retryBadge = isRetry
    ? '<span class="mt-badge mt-badge-retry">&#128260; Pr\u00f8v igjen</span>'
    : '';

  var ruleFirst = '';
  if (MTS.showRule && t.regel) {
    ruleFirst = '<div class="mt-rule-first"><strong>&#128218; Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  }

  var noOwnText = ['finn_feil', 'klikk_marker', 'fix', 'avsnitt_klikk', 'omskriv'];
  var tekstHTML = '';
  if (t.tekst && noOwnText.indexOf(t.type) === -1) {
    tekstHTML = '<div class="mt-context-text">' + mtEsc(t.tekst) + '</div>';
  }

  var hintHTML = t.hint
    ? '<div class="mt-hint">&#128161; <span>' + mtEsc(t.hint) + '</span></div>'
    : '';

  var inputHTML = mtBuildInput(t);

  body.innerHTML =
    '<div class="mt-card">' +
      '<div class="mt-live">' +
        '<div class="mt-live-top">' +
          '<div class="mt-live-progress" id="mt-live-progress">Oppgave 1 av 1</div>' +
          '<div class="mt-live-kpis">' +
            '<span class="mt-live-pill">Poeng <strong id="mt-live-score">0</strong></span>' +
            '<span class="mt-live-pill">XP <strong id="mt-live-xp">0</strong></span>' +
            '<span class="mt-live-pill">Streak <strong id="mt-live-streak">0</strong></span>' +
          '</div>' +
        '</div>' +
        '<div class="mt-live-bar"><span id="mt-live-bar-fill"></span></div>' +
        '<details class="mt-live-mastery-toggle">' +
          '<summary class="mt-live-mastery-summary"><span id="mt-live-mastery-icon">&#127793;</span> <strong id="mt-live-mastery-name">Ordlærling</strong></summary>' +
          '<div class="mt-live-mastery">' +
            '<div class="mt-live-mastery-head"><span id="mt-live-mastery-trophies">0/12 troféer</span></div>' +
            '<div class="mt-live-mastery-bar"><span id="mt-live-mastery-fill"></span></div>' +
            '<div class="mt-live-mastery-text" id="mt-live-mastery-text">Til neste nivå: 80 XP</div>' +
          '</div>' +
        '</details>' +
      '</div>' +
      '<div class="mt-badges">' +
        '<span class="mt-badge mt-badge-cat">' + mtEsc(t.kat_label || t.kat) + '</span>' +
        '<span class="mt-badge mt-badge-' + (t.vanske || 'lett') + '">' + vLabel + '</span>' +
        retryBadge +
      '</div>' +
      ruleFirst +
      '<p class="mt-question">' + mtEsc(t.q || t.sporsmal || '') + '</p>' +
      tekstHTML +
      hintHTML +
      inputHTML +
      '<div class="mt-feedback" id="mt-feedback"></div>' +
    '</div>';

  var checkBtn = $mt('nl-ad-check');
  var nextBtn = $mt('nl-ad-next');
  if (checkBtn) { checkBtn.style.display = ''; checkBtn.disabled = false; }
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.disabled = true;
    nextBtn.textContent = 'Neste oppgave \u2192';
  }

  var focusEl = body.querySelector('.mt-text-input');
  if (focusEl) setTimeout(function () { focusEl.focus(); }, 60);

  if (t.type === 'mc') mtBindMcKeys();

  mtBindTouchDragTokens(t.type);

  mtUpdateProgress();
}

var _mtTouchDrag = null;
function mtTouchPoint(ev) {
  if (!ev) return null;
  var t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]);
  if (!t) return null;
  return { x: t.clientX, y: t.clientY };
}

function mtTouchDropSelector(kind) {
  if (kind === 'dk') return '#mt-dk-bank, .mt-dk-placed';
  if (kind === 'bs') return '#mt-bs-bank, .mt-bs-placed';
  if (kind === 'sr') return '#mt-sr-list, #mt-sr-list .mt-sr-token';
  return '';
}

function mtBindTouchDragTokens(taskType) {
  var type = String(taskType || '').toLowerCase();
  if (type === 'drag_kolonne') {
    document.querySelectorAll('.mt-dk-token').forEach(function(el) { mtAttachTouchDragToken(el, 'dk'); });
    return;
  }
  if (type === 'burger_sort') {
    document.querySelectorAll('.mt-bs-token').forEach(function(el) { mtAttachTouchDragToken(el, 'bs'); });
    return;
  }
  if (type === 'sorter_rekke') {
    document.querySelectorAll('.mt-sr-token').forEach(function(el) { mtAttachTouchDragToken(el, 'sr'); });
  }
}

function mtAttachTouchDragToken(el, kind) {
  if (!el || el.dataset.mtTouchBound === '1') return;
  el.dataset.mtTouchBound = '1';
  el.style.touchAction = 'none';

  el.addEventListener('touchstart', function(ev) {
    if (MTS.answered) return;
    var p = mtTouchPoint(ev);
    if (!p) return;
    _mtTouchDrag = {
      kind: kind,
      el: el,
      startX: p.x,
      startY: p.y,
      active: false,
      target: null,
      ghost: null
    };
  }, { passive: true });

  el.addEventListener('touchmove', function(ev) {
    if (!_mtTouchDrag || _mtTouchDrag.el !== el) return;
    var p = mtTouchPoint(ev);
    if (!p) return;

    var dx = p.x - _mtTouchDrag.startX;
    var dy = p.y - _mtTouchDrag.startY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (!_mtTouchDrag.active && dist < 8) return;

    if (!_mtTouchDrag.active) {
      _mtTouchDrag.active = true;
      el.classList.add('dragging');
      var g = el.cloneNode(true);
      g.style.cssText = 'position:fixed;left:0;top:0;transform:translate(-50%,-50%);pointer-events:none;opacity:.88;z-index:9999;max-width:90vw';
      document.body.appendChild(g);
      _mtTouchDrag.ghost = g;
    }

    ev.preventDefault();

    if (_mtTouchDrag.ghost) {
      _mtTouchDrag.ghost.style.left = p.x + 'px';
      _mtTouchDrag.ghost.style.top = p.y + 'px';
    }

    var hit = document.elementFromPoint(p.x, p.y);
    var selector = mtTouchDropSelector(kind);
    var target = hit && selector ? hit.closest(selector) : null;

    if (kind === 'sr' && target === el) target = null;

    if (target !== _mtTouchDrag.target) {
      if (_mtTouchDrag.target) _mtTouchDrag.target.classList.remove('drag-over');
      _mtTouchDrag.target = target;
      if (_mtTouchDrag.target) _mtTouchDrag.target.classList.add('drag-over');
    }
  }, { passive: false });

  el.addEventListener('touchend', function(ev) {
    if (!_mtTouchDrag || _mtTouchDrag.el !== el) return;
    if (_mtTouchDrag.active) {
      ev.preventDefault();
      mtTouchApplyDrop(el, kind, _mtTouchDrag.target);
      el.dataset.mtTouchDragged = '1';
      setTimeout(function() { el.dataset.mtTouchDragged = ''; }, 60);
    }
    mtTouchCleanup();
  }, { passive: false });

  el.addEventListener('touchcancel', function() {
    if (_mtTouchDrag && _mtTouchDrag.el === el) mtTouchCleanup();
  }, { passive: true });
}

function mtTouchApplyDrop(el, kind, target) {
  if (!el || !target) return;

  if (kind === 'dk') {
    if (target.id === 'mt-dk-bank') {
      target.appendChild(el);
      el.setAttribute('data-placed', '-1');
      return;
    }
    if (target.classList.contains('mt-dk-placed')) {
      target.appendChild(el);
      var id = target.id || '';
      var ci = id.replace('mt-dk-placed-', '');
      el.setAttribute('data-placed', String(ci));
    }
    return;
  }

  if (kind === 'bs') {
    if (target.id === 'mt-bs-bank') {
      target.appendChild(el);
      el.setAttribute('data-placed', '-1');
      return;
    }
    if (target.classList.contains('mt-bs-placed')) {
      target.appendChild(el);
      var id = target.id || '';
      var bi = id.replace('mt-bs-placed-', '');
      el.setAttribute('data-placed', String(bi));
    }
    return;
  }

  if (kind === 'sr') {
    var list = document.getElementById('mt-sr-list');
    if (!list) return;
    if (target.classList.contains('mt-sr-token')) {
      list.insertBefore(el, target);
    } else {
      list.appendChild(el);
    }
  }
}

function mtTouchCleanup() {
  if (!_mtTouchDrag) return;
  if (_mtTouchDrag.target) _mtTouchDrag.target.classList.remove('drag-over');
  if (_mtTouchDrag.ghost && _mtTouchDrag.ghost.parentNode) _mtTouchDrag.ghost.parentNode.removeChild(_mtTouchDrag.ghost);
  if (_mtTouchDrag.el) _mtTouchDrag.el.classList.remove('dragging');
  _mtTouchDrag = null;
}

/* ─── Bygg input-HTML per type ─────────────────── */

function mtBuildInput(t) {
  switch (t.type) {

  case 'mc': {
    var alts = t.ikkje_stokk
      ? t.alt.map(function(a, i) { return { txt: a, idx: i }; })
      : mtShuffle(t.alt.map(function(a, i) { return { txt: a, idx: i }; }));
    var h = '<div class="mt-mc-grid">';
    alts.forEach(function (o, i) {
      h += '<button class="mt-mc-btn" data-val="' + mtEsc(o.txt) + '" data-idx="' + o.idx + '" onclick="mtCheckMc(this)">' 
        + '<span class="mt-mc-key">' + (i + 1) + '</span>' + mtEsc(o.txt) + '</button>';
    });
    return h + '</div>';
  }

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

  case 'cloze':
    return '<div class="mt-input-row">' +
      '<input id="mt-cloze-inp" class="mt-text-input" type="text" autocomplete="off" spellcheck="false" placeholder="Skriv svaret ditt her\u2026" onkeydown="if(event.key===\'Enter\')mtTriggerCheck()">' +
      '</div>';

  case 'open':
    return '<div class="mt-input-row">' +
      '<textarea id="mt-open-inp" class="mt-text-input mt-textarea" rows="3" spellcheck="false" placeholder="Skriv svaret ditt her\u2026"></textarea>' +
      '</div>';

  case 'fix':
    return '<div class="mt-input-row">' +
      '<p class="mt-instruction">Rett feilene direkte i teksten under.</p>' +
      '<textarea id="mt-fix-inp" class="mt-text-input mt-textarea mt-mono" rows="4" spellcheck="false">' + mtEsc(t.tekst) + '</textarea>' +
      '</div>';

  case 'fillsel': {
    var items = t.items || [];
    var h = '<div class="mt-fillsel">';
    items.forEach(function (item, fi) {
      var opts = '<option value="">\u2013 velg \u2013</option>';
      var alts = item.ikkje_stokk ? item.alt : mtShuffle(item.alt);
      alts.forEach(function (a) { opts += '<option value="' + mtEsc(a) + '">' + mtEsc(a) + '</option>'; });
      h += '<p class="mt-fillsel-line">' + mtEsc(item.pre) +
        ' <select class="mt-fill-select" data-fi="' + fi + '" data-answer="' + mtEsc(item.fasit) + '">' + opts + '</select> ' +
        mtEsc(item.post || '') + '</p>';
    });
    return h + '</div>';
  }

  case 'finn_feil': {
    var words = t.tekst.split(' ');
    var spans = words.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="mt-ff-word" data-i="' + i + '" data-clean="' + clean + '" onclick="mtFfClick(this)">' + mtEsc(w) + '</span>';
    }).join(' ');
    var nFeil = Array.isArray(t.fasit_feil) ? t.fasit_feil.length : '?';
    return '<div class="mt-ff">' +
      '<p class="mt-instruction">Finn <strong>' + nFeil + ' feil</strong> i teksten. Klikk p\u00e5 hvert feilord.</p>' +
      '<div class="mt-ff-text">' + spans + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtFfReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  case 'klikk_marker': {
    var words = t.tekst.split(' ');
    var spans = words.map(function (w, i) {
      var clean = w.replace(/[.,!?;:\xAB\xBB"()]/g, '').toLowerCase();
      return '<span class="mt-km-word" data-i="' + i + '" data-clean="' + clean + '" onclick="mtKmClick(this)">' + mtEsc(w) + '</span>';
    }).join(' ');
    return '<div class="mt-km">' +
      '<p class="mt-instruction">Klikk p\u00e5 ordene som er <strong>' + mtEsc(t.maalordklasse) + '</strong>.</p>' +
      '<div class="mt-km-text">' + spans + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtKmReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  case 'drag_kolonne': {
    var items = mtShuffle(t.ord.map(function (o, i) { return { tekst: typeof o === 'string' ? o : o.tekst, fasit: typeof o === 'string' ? null : o.fasit, _i: i }; }));
    var k0 = mtEsc(t.kolonner[0]), k1 = mtEsc(t.kolonner[1]);
    var tokens = items.map(function (o) {
      return '<div class="mt-dk-token" draggable="true" data-i="' + o._i + '" data-fasit="' + o.fasit + '" data-placed="-1" onclick="mtDkMove(this)" ondragstart="mtDkDragStart(event,' + o._i + ')">' + mtEsc(o.tekst) + '</div>';
    }).join('');
    return '<div class="mt-dk">' +
      '<div id="mt-dk-bank" class="mt-dk-bank" ondragover="event.preventDefault()" ondrop="mtDkDropBank(event)">' + tokens + '</div>' +
      '<div class="mt-dk-cols">' +
      '<div class="mt-dk-col mt-dk-col-0" ondragover="event.preventDefault()" ondrop="mtDkDropCol(event,0)"><div class="mt-dk-col-label">' + k0 + '</div><div id="mt-dk-placed-0" class="mt-dk-placed"></div></div>' +
      '<div class="mt-dk-col mt-dk-col-1" ondragover="event.preventDefault()" ondrop="mtDkDropCol(event,1)"><div class="mt-dk-col-label">' + k1 + '</div><div id="mt-dk-placed-1" class="mt-dk-placed"></div></div>' +
      '</div></div>';
  }

  case 'drag_ord': {
    var shuffled = mtShuffle(t.ord.slice());
    var tokens = shuffled.map(function (w, i) {
      return '<button class="mt-do-token" data-w="' + mtEsc(w) + '" data-idx="' + i + '" onclick="mtDoMove(this)">' + mtEsc(w) + '</button>';
    }).join('');
    return '<div class="mt-do">' +
      '<div id="mt-do-bank" class="mt-do-bank">' + tokens + '</div>' +
      '<div id="mt-do-answer" class="mt-do-answer"><span id="mt-do-placeholder" class="mt-do-placeholder">Trykk p\u00e5 ordene i riktig rekkef\u00f8lge\u2026</span></div>' +
      '<button class="mt-btn-secondary" onclick="mtDoReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

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

  case 'avsnitt_klikk': {
    var segs = t.segments || [];
    var items = segs.map(function (seg) {
      if (!seg.first_word) return '<span class="mt-ak-text">' + mtEsc(seg.tekst) + ' </span>';
      var rest = seg.tekst.slice(seg.first_word.length);
      return '<span class="mt-ak-break" data-sid="' + seg.id + '" onclick="mtAkToggle(this,\'' + seg.id + '\')">' + mtEsc(seg.first_word) + '</span>' +
        '<span class="mt-ak-text">' + mtEsc(rest) + ' </span>';
    }).join('');
    return '<div class="mt-ak">' +
      '<p class="mt-instruction">Klikk p\u00e5 det <strong>f\u00f8rste ordet</strong> i hver setning der du vil starte et nytt avsnitt.</p>' +
      '<div class="mt-ak-body">' + items + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtAkReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  case 'sann_usann_serie': {
    var ps = t.paastandar || [];
    var h = '<div class="mt-su">';
    ps.forEach(function (p, pi) {
      h += '<div class="mt-su-row" data-pi="' + pi + '" data-sann="' + (p.sann ? '1' : '0') + '">' +
        '<span class="mt-su-text">' + mtEsc(p.tekst || p.p) + '</span>' +
        '<div class="mt-su-btns">' +
        '<button class="mt-su-btn" data-val="1" onclick="mtSuPick(this,' + pi + ',1)">Sant</button>' +
        '<button class="mt-su-btn" data-val="0" onclick="mtSuPick(this,' + pi + ',0)">Usant</button>' +
        '</div></div>';
    });
    return h + '</div>';
  }

  case 'omskriv':
    return '<div class="mt-omskriv">' +
      '<div class="mt-context-text">' + mtEsc(t.tekst) + '</div>' +
      '<p class="mt-instruction">' + mtEsc(t.instruksjon || 'Skriv om teksten.') + '</p>' +
      '<textarea id="mt-omskriv-inp" class="mt-text-input mt-textarea" rows="4" spellcheck="false" placeholder="Skriv omskrivingen din her\u2026"></textarea>' +
      '</div>';

  case 'sorter_rekke': {
    var shuffled = mtShuffle(t.items.map(function (item, i) { return { tekst: item.tekst || item, _i: i }; }));
    var tokens = shuffled.map(function (item) {
      return '<div class="mt-sr-token" draggable="true" data-i="' + item._i + '" ondragstart="mtSrDragStart(event,' + item._i + ')" onclick="mtSrClick(this)">' + mtEsc(item.tekst) + '</div>';
    }).join('');
    return '<div class="mt-sr">' +
      '<p class="mt-instruction">Dra eller klikk elementene i riktig rekkef\u00f8lge.</p>' +
      '<div id="mt-sr-list" class="mt-sr-list">' + tokens + '</div>' +
      '<button class="mt-btn-secondary" onclick="mtSrReset()">Nullstill &#8634;</button>' +
      '</div>';
  }

  default:
    return '<div class="mt-input-row">' +
      '<input id="mt-cloze-inp" class="mt-text-input" type="text" autocomplete="off" spellcheck="false" placeholder="Skriv svaret\u2026" onkeydown="if(event.key===\'Enter\')mtTriggerCheck()">' +
      '</div>';
  }
}

/* ══════════════════════════════════════════════════════
   SJEKK-LOGIKK
══════════════════════════════════════════════════════ */

function mtTriggerCheck() {
  if (MTS.answered || !MTS.current) return;
  var t = MTS.current;
  switch (t.type) {
    case 'mc': break;
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

function mtCheckMc(btn) {
  if (MTS.answered) return;
  MTS.answered = true;
  var t = MTS.current;
  var chosen = btn.getAttribute('data-val');
  var chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);
  var correct = mtIsCorrect(chosen, t, chosenIdx);
  document.querySelectorAll('.mt-mc-btn').forEach(function (b) {
    b.disabled = true;
    var v = b.getAttribute('data-val');
    var idx = parseInt(b.getAttribute('data-idx'), 10);
    if (v === chosen) b.className = 'mt-mc-btn ' + (correct ? 'mt-correct' : 'mt-wrong');
    if (!correct && mtIsCorrect(v, t, idx)) b.className = 'mt-mc-btn mt-correct';
  });
  mtFinish(correct, 1, correct ? 1 : 0, chosen, t);
}

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
  mtFinish(hits === maxPts, maxPts, hits, hits + ' av ' + maxPts + ' riktige', t);
}

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

/* ── fagord-liste for open/omskriv XP-bonus ── */
var MT_FAGORD = [
  'argumentere','drøfte','påstand','begrunne','konklusjon','konsekvens','årsak','virkning',
  'perspektiv','hypotese','analyse','analysere','kilde','kildebruk','referere','parafrase',
  'sitat','dokumentere','etterprøvbar','troverdig','troverdighet','reliabilitet','validitet',
  'fagbegrep','relevant','sammenligne','kontrastere','vurdere','strategi','metode',
  'innledning','hoveddel','avslutning','drøfting','argumentasjon','motargument',
  'retorisk','ethos','pathos','logos','mottaker','formål','sjanger','teksttype',
  'koherens','sammenheng','avsnitt','temasetning','disposisjon','struktur'
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
  var trimmed = text.trim();
  if (trimmed.length < 8) return true;
  var words = trimmed.split(/\s+/);
  if (words.length < 2) return true;
  if (!/[aeiouyæøå]/i.test(trimmed)) return true;
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
    mtFinish(false, 1, 0, val, t, 'Svaret ser ikke ut til å være et ordentlig forsøk. Prøv å skrive et skikkelig svar.', true, true);
    return;
  }

  /* Fagord-bonus */
  var fagord = mtDetectFagord(val);
  var extra = null;
  if (fagord.length >= 2) {
    extra = 'Flott fagspråk! Du brukte: ' + fagord.join(', ');
  } else if (fagord.length === 1) {
    extra = 'Bra, du brukte fagbegrepet «' + fagord[0] + '».';
  }

  el.className = 'mt-text-input mt-textarea mt-inp-neutral';
  mtFinish(true, 1, 1, val, t, extra, true, true);
}

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
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' riktige', t);

  var fb = $mt('mt-feedback');
  if (fb) fb.innerHTML += mtBuildFillselCorrectionHtml(t, Array.prototype.slice.call(sels));
}

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
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' feil funnet', t);
}

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
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' riktige', t);
}

var _dkDrag = -1;
function mtDkDragStart(ev, idx) { _dkDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtDkMove(el) {
  if (MTS.answered) return;
  if (el && el.dataset && el.dataset.mtTouchDragged === '1') return;
  var p = parseInt(el.getAttribute('data-placed'), 10);
  if (p === -1) { var c = document.getElementById('mt-dk-placed-0'); if (c) { c.appendChild(el); el.setAttribute('data-placed', '0'); } }
  else if (p === 0) { var c = document.getElementById('mt-dk-placed-1'); if (c) { c.appendChild(el); el.setAttribute('data-placed', '1'); } }
  else { var b = document.getElementById('mt-dk-bank'); if (b) { b.appendChild(el); el.setAttribute('data-placed', '-1'); } }
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
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' riktige', t);
}

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

var _bsDrag = -1;
function mtBsDragStart(ev, idx) { _bsDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtBsClick(el) {
  if (MTS.answered) return;
  if (el && el.dataset && el.dataset.mtTouchDragged === '1') return;
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
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' riktige', t);
}

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
  mtFinish(hits === maxPts && falsePos === 0, maxPts, pts, hits + ' av ' + maxPts + ' riktige', t);
}

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
  mtFinish(hits === maxPts, maxPts, hits, hits + ' av ' + maxPts + ' riktige', t);
}

function mtCheckOmskriv() {
  if (MTS.answered) return;
  var el = $mt('mt-omskriv-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  el.disabled = true;
  var lower = val.toLowerCase();
  var ok = true;
  var missing = [];
  (t.maa_ha || []).forEach(function (kw) {
    if (lower.indexOf(kw.toLowerCase()) === -1) { ok = false; missing.push(kw); }
  });
  (t.maa_ikkje_ha || []).forEach(function (kw) {
    if (lower.indexOf(kw.toLowerCase()) !== -1) ok = false;
  });
  el.className = 'mt-text-input mt-textarea mt-inp-neutral';
  var extra = null;
  if (!ok && missing.length) extra = 'Husk \u00e5 bruke: ' + missing.join(', ');

  /* Fagord-bonus for omskriv */
  var fagord = mtDetectFagord(val);
  if (ok && fagord.length >= 2) {
    extra = 'Flott fagspråk! Du brukte: ' + fagord.join(', ');
  } else if (ok && fagord.length === 1) {
    extra = (extra ? extra + ' ' : '') + 'Bra, du brukte fagbegrepet «' + fagord[0] + '».';
  }

  mtFinish(ok, 1, ok ? 1 : 0, val, t, extra, true, true);
}

var _srDrag = -1;
function mtSrDragStart(ev, idx) { _srDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtSrClick(el) {
  if (MTS.answered) return;
  if (el && el.dataset && el.dataset.mtTouchDragged === '1') return;
  var list = document.getElementById('mt-sr-list');
  if (!list) return;
  if (el.nextSibling) list.insertBefore(el.nextSibling, el);
  else list.insertBefore(el, list.firstChild);
}
function mtSrReset() {
  if (MTS.answered) return;
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
  mtFinish(hits === total, total, hits, hits + ' av ' + total + ' i riktig rekkef\u00f8lge', t);
}

/* ══════════════════════════════════════════════════════
   FELLES FASIT-SJEKK
══════════════════════════════════════════════════════ */

function mtResolveFasitText(t) {
  if (!t) return '';
  if (t.type === 'mc' && typeof t.fasit === 'number' && Array.isArray(t.alt)) {
    var altText = t.alt[t.fasit];
    if (typeof altText === 'string') return altText;
  }
  if (t.fasit === 0 || t.fasit) return String(t.fasit);
  return '';
}

function mtIsCorrect(val, t, idx) {
  if (t && t.type === 'mc' && typeof t.fasit === 'number') {
    if (typeof idx === 'number' && !isNaN(idx)) return idx === t.fasit;
    if (Array.isArray(t.alt) && typeof t.alt[t.fasit] !== 'undefined') {
      return mtNorm(t.alt[t.fasit]) === mtNorm(val);
    }
    return false;
  }
  var v = mtNorm(val);
  var variants = Array.isArray(t.fasit_v) && t.fasit_v.length ? t.fasit_v : [t.fasit];
  return variants.some(function (f) { return mtNorm(f) === v; });
}

function mtSmartFeedback(chosen, t) {
  if (Array.isArray(t.vanlege_feil)) {
    var low = mtNorm(chosen);
    for (var i = 0; i < t.vanlege_feil.length; i++) {
      var vf = t.vanlege_feil[i];
      if (mtNorm(vf.feil) === low) return vf.melding;
    }
  }
  var fasit = mtResolveFasitText(t);
  var dist = mtLevenshtein(chosen, fasit);
  if (dist === 1) return 'Nesten! Sjekk stavingen n\u00f8ye.';
  if (dist === 2) return 'Du er veldig n\u00e6r! Sammenlign med fasiten.';
  var c = mtNorm(chosen), f = mtNorm(fasit);
  if (c.replace(/\bog\b/g, '\u00e5') === f || c.replace(/\b\u00e5\b/g, 'og') === f) {
    return 'Du har forvekslet og/\u00e5. Huskeregel: Kan du bytte med \u00abog\u00bb \u2192 skriv \u00abog\u00bb. Ellers \u2192 \u00ab\u00e5\u00bb.';
  }
  return null;
}

/* ══════════════════════════════════════════════════════
   TILBAKEMELDING OG POENG
══════════════════════════════════════════════════════ */

function mtFinish(correct, maxPts, pts, chosen, t, extraMsg, isOpenType, forceQualitativeMode) {
  MTS.score += pts;
  MTS.maxScore += maxPts;
  if (correct) MTS.streak++; else MTS.streak = 0;
  var elapsed = Date.now() - MTS.taskStart;
  if (!MTS.catHistory[t.kat]) MTS.catHistory[t.kat] = [];
  MTS.catHistory[t.kat].push(correct);
  if (MTS.catHistory[t.kat].length > 5) MTS.catHistory[t.kat].shift();
  if (!correct && t.feiltype) {
    if (!MTS.feilLog[t.feiltype]) MTS.feilLog[t.feiltype] = 0;
    MTS.feilLog[t.feiltype]++;
  }
  if (!MTS.manualMode && !correct && !t._isRetry) MTS.retryQueue.push(t);

  /* Feillogg – lagre til localStorage */
  if (!correct) {
    mtFeilloggPush(t, chosen);
  }

  /* Retry-win teller for badges */
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

  if ((!!forceQualitativeMode || !!isOpenType) && t && t.kat === 'djupneoppgaver' && elapsed >= 600000) {
    earnedXP += 75;
  }

  MTS.sessionXP += earnedXP;

  /* Real-time level-up check */
  if (earnedXP > 0) {
    var prevTotalXP = MTS.baseXP + MTS.sessionXP - earnedXP;
    var newTotalXP = MTS.baseXP + MTS.sessionXP;
    var prevLvl = mtXpLevel(prevTotalXP);
    var curLvl = mtXpLevel(newTotalXP);
    if (curLvl.index > prevLvl.index) {
      MTS._leveledUpLive = true;
      var masteryToggle = document.querySelector('.mt-live-mastery-toggle');
      if (masteryToggle) masteryToggle.open = true;
      mtFxLevelUpFlash();
      mtFxModalConfetti();
    }
  }

  if (correct && earnedXP > 0) {
    var xpAnchor = ($mt('mt-live-xp') && $mt('mt-live-xp').parentElement) || document.querySelector('#nl-ad-win-body .mt-live-kpis') || $mt('nl-ad-win-body');
    mtFxSpawnFloat(xpAnchor, '+' + earnedXP + ' XP', MTS.streak >= 5 || earnedXP >= 20);
    mtFxFlashCard();
    if (MTS.streak >= 3) {
      mtFxSpawnSparks(xpAnchor, MTS.streak >= 5 ? 14 : 8);
      mtFxGlowHeaderStreak();
    }
  }

  MTS.history.push({ task: t, correct: correct, points: pts, maxPts: maxPts, time: elapsed, isRetry: !!t._isRetry });

  var fb = $mt('mt-feedback');
  if (!fb) return;
  var isPartial = !correct && pts > 0;
  var cls = correct ? 'mt-fb-correct' : (isPartial ? 'mt-fb-partial' : 'mt-fb-wrong');
  fb.className = 'mt-feedback ' + cls;
  var html = '';
  var qualitativeMode = !!forceQualitativeMode || !!isOpenType;

  if (qualitativeMode) {
    html += '<div class="mt-fb-heading">&#128221; Faglig tilbakemelding</div>';
    if (extraMsg) html += '<div class="mt-fb-extra">' + mtEsc(extraMsg) + '</div>';
    if (t.regel) html += '<div class="mt-fb-rule"><strong>&#128218; Regel:</strong> ' + mtEsc(t.regel) + '</div>';
    if (t.eksempel_svak || t.eksempel_god) {
      html += '<div class="mt-fb-models">';
      if (t.eksempel_svak) html += '<div class="mt-fb-model mt-fb-model-weak"><div class="mt-fb-model-label">Kan bli bedre</div>' + mtEsc(t.eksempel_svak) + '</div>';
      if (t.eksempel_god) html += '<div class="mt-fb-model mt-fb-model-good"><div class="mt-fb-model-label">Sterk formulering</div>' + mtEsc(t.eksempel_god) + '</div>';
      html += '</div>';
    }
    if (t.eks) html += '<div class="mt-fb-eks"><strong>&#128221; Eksempel:</strong> ' + mtEsc(t.eks) + '</div>';
  } else if (correct) {
    html += '<div class="mt-fb-heading">&#10003; Riktig!</div>';
    if (maxPts > 1) html += '<div class="mt-fb-detail">' + mtEsc(String(chosen)) + '</div>';
    if (MTS.streak >= 5) html += '<div class="mt-fb-streak">&#128293; ' + MTS.streak + ' p\u00e5 rad!</div>';
    else if (MTS.streak === 3) html += '<div class="mt-fb-streak">&#11088; 3 p\u00e5 rad \u2013 flott!</div>';
  } else {
    html += '<div class="mt-fb-heading">&#10007; ' + (isPartial ? 'Delvis riktig' : 'Feil') + '</div>';
    if (maxPts > 1 && typeof chosen === 'string') html += '<div class="mt-fb-detail">' + mtEsc(chosen) + '</div>';
    if (extraMsg) html += '<div class="mt-fb-extra">' + mtEsc(extraMsg) + '</div>';
  }
  if (t.forklaring) html += '<div class="mt-fb-forklaring">' + mtEsc(t.forklaring) + '</div>';
  if (!correct && t.regel) html += '<div class="mt-fb-rule"><strong>&#128218; Regel:</strong> ' + mtEsc(t.regel) + '</div>';
  if (!correct && t.eks) html += '<div class="mt-fb-eks"><strong>&#128221; Eksempel:</strong> ' + mtEsc(t.eks) + '</div>';
  if (!correct && !t._isRetry) html += '<div class="mt-fb-retry-tip">Denne oppgaven kommer igjen senere i \u00f8kta &#128260;</div>';
  if (t._isRetry && correct) html += '<div class="mt-fb-retry-win">&#127881; Du klarte det p\u00e5 andre fors\u00f8k! Godt l\u00e6rt!</div>';

  /* XP-badge i tilbakemelding */
  if (earnedXP > 0) html += '<div class="mt-fb-xp">+' + earnedXP + ' XP</div>';

  fb.innerHTML = html;
  fb.style.display = 'block';

  var checkBtn = $mt('nl-ad-check');
  var nextBtn = $mt('nl-ad-next');
  if (checkBtn) checkBtn.style.display = 'none';
  if (nextBtn) {
    var isLast = MTS.served >= MTS.targetCount && !MTS.retryQueue.length;
    nextBtn.textContent = isLast ? 'Se resultat \u2192' : 'Neste oppgave \u2192';
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
    MTS.answered = true;
    MTS.history.push({ task: t, correct: false, points: 0, maxPts: 1, time: Date.now() - MTS.taskStart, isRetry: !!t._isRetry });
    MTS.maxScore += 1;
  }
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

  /* Registrer daglig streak */
  var streak = mtStreakRegister();
  mtUpdateHeaderProfile(newTotalXP, streak.current);
  if (leveledUp && !MTS._leveledUpLive) {
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

  var medal = pct >= 90 ? '&#127942;' : pct >= 70 ? '&#127941;' : pct >= 50 ? '&#128170;' : '&#128218;';
  var medalEl = $mt('nl-ad-sum-medal');
  if (medalEl) medalEl.innerHTML = medal;

  var ring = $mt('nl-ad-ring');
  var ringPct = $mt('nl-ad-ring-pct');
  if (ring) {
    var circumference = 2 * Math.PI * 42;
    var offset = circumference * (1 - pct / 100);
    setTimeout(function () { ring.style.strokeDashoffset = String(offset); }, 50);
  }
  if (ringPct) ringPct.textContent = pct + '%';

  var poengEl = $mt('nl-ad-sum-poeng');
  var retteEl = $mt('nl-ad-sum-rette');
  var feilEl = $mt('nl-ad-sum-feil');
  var xpEl   = $mt('nl-ad-sum-xp');
  if (poengEl) poengEl.textContent = MTS.score + '/' + MTS.maxScore;
  if (retteEl) retteEl.textContent = String(rett);
  if (feilEl) feilEl.textContent = String(feil);
  if (xpEl)   xpEl.textContent = '+' + MTS.sessionXP;

  var commentEl = $mt('nl-ad-sum-comment');
  if (commentEl) {
    var msgs = [
      [90, 'Fantastisk! Du mestrer dette veldig godt.'],
      [70, 'Bra jobba! Du er p\u00e5 god vei.'],
      [50, 'Greit! \u00d8v litt mer p\u00e5 de vanskelige oppgavene.'],
      [0, 'Ikke gi opp \u2013 pr\u00f8v igjen!']
    ];
    var msg = msgs[msgs.length - 1][1];
    for (var m = 0; m < msgs.length; m++) { if (pct >= msgs[m][0]) { msg = msgs[m][1]; break; } }
    if (retriesWon.length > 0) {
      msg += ' Du klarte ' + retriesWon.length + ' av ' + retries.length + ' oppgave' + (retries.length > 1 ? 'r' : '') + ' p\u00e5 nytt \u2013 det viser at du har l\u00e6rt!';
    }
    commentEl.textContent = msg;
  }

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
      var html = '<h5>Styrker</h5>';
      strong.forEach(function (r) { html += '<div class="adp-summary-row ok"><strong>' + mtEsc(r.cat) + '</strong><span>' + r.pct + '%</span></div>'; });
      strengthsEl.innerHTML = html;
      strengthsEl.style.display = '';
    } else {
      strengthsEl.innerHTML = '';
      strengthsEl.style.display = 'none';
    }

    var rettingEl = $mt('nl-ad-sum-retting');
    if (rettingEl) {
      if (!weak.length) {
        rettingEl.innerHTML = '<div class="adp-summary-row ok"><strong>Null feil!</strong> Du klarte alle oppgavene \u2013 bra jobba!</div>';
      } else {
        var html2 = '<h5>\u00d8v mer p\u00e5 disse</h5>';
        weak.sort(function (a, b) { return a.pct - b.pct; });
        weak.forEach(function (r) { html2 += '<div class="adp-summary-row"><strong>' + mtEsc(r.cat) + '</strong><span>' + r.pct + '%</span></div>'; });
        html2 += '<p class="mt-sum-advice">Tips: Start et nytt sett med ' + mtEsc(weak[0].cat) + ' for \u00e5 bli tryggere.</p>';
        rettingEl.innerHTML = html2;
      }
    }

    var feilKeys = Object.keys(MTS.feilLog);
    if (feilKeys.length && rettingEl) {
      var fhtml = '<h5 style="margin-top:.7rem">Typiske feil</h5>';
      feilKeys.sort(function (a, b) { return MTS.feilLog[b] - MTS.feilLog[a]; });
      feilKeys.forEach(function (ft) {
        fhtml += '<div class="adp-summary-row"><strong>' + mtEsc(ft) + '</strong><span>' + MTS.feilLog[ft] + ' ganger</span></div>';
      });
      rettingEl.innerHTML += fhtml;
    }
  }

  /* ═══ GAMIFICATION-PANEL ═══ */
  var sumEl = $mt('nl-ad-summary');
  if (sumEl) {
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
    gpHtml += '<span class="mt-gami-xp-earned">+' + MTS.sessionXP + ' XP denne \u00f8kta</span>';
    gpHtml += '<span class="mt-gami-xp-total">' + newTotalXP + ' XP totalt</span>';
    gpHtml += '</div>';
    if (newLvl.next) {
      var pctToNext = Math.round((newTotalXP - newLvl.current.xp) / (newLvl.next.xp - newLvl.current.xp) * 100);
      gpHtml += '<div class="mt-gami-xp-bar-wrap">';
      gpHtml += '<div class="mt-gami-xp-bar" style="width:' + Math.min(pctToNext, 100) + '%"></div>';
      gpHtml += '</div>';
      gpHtml += '<div class="mt-gami-xp-next">' + (newLvl.next.xp - newTotalXP) + ' XP igjen til ' + mtEsc(newLvl.next.name) + ' ' + newLvl.next.icon + '</div>';
    }
    if (leveledUp) {
      gpHtml += '<div class="mt-gami-levelup">&#127881; Nytt niv\u00e5: <strong>' + mtEsc(newLvl.current.name) + '</strong> ' + newLvl.current.icon + '</div>';
    }
    gpHtml += '</div>';

    /* ── Daglig streak ── */
    gpHtml += '<div class="mt-gami-streak">';
    gpHtml += '<div class="mt-gami-streak-count">';
    gpHtml += '<span class="mt-gami-streak-fire">&#128293;</span> ';
    gpHtml += '<strong>' + streak.current + '</strong> dag' + (streak.current !== 1 ? 'er' : '') + ' p\u00e5 rad';
    if (streak.rekord > streak.current) gpHtml += ' <span class="mt-gami-streak-rekord">(rekord: ' + streak.rekord + ')</span>';
    gpHtml += '</div>';
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
      gpHtml += '<h5>&#127942; Nye prestasjoner!</h5>';
      newBadges.forEach(function (b) {
        gpHtml += '<div class="mt-gami-badge mt-gami-badge-new"><span class="mt-gami-badge-icon">' + b.icon + '</span>';
        gpHtml += '<div><strong>' + mtEsc(b.namn) + '</strong><br><span class="mt-gami-badge-desc">' + mtEsc(b.beskriving) + '</span></div></div>';
      });
      gpHtml += '</div>';
    }

    /* ── Trofé-panel ── */
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
      gpHtml += '<button class="mt-btn-secondary mt-feillogg-btn" onclick="mtStartFeillogg()">&#128260; \u00d8v p\u00e5 tidligere feil (' + feillogg.length + ' oppgaver)</button>';
      gpHtml += '</div>';
    }

    gp.innerHTML = gpHtml;
    var actionsDiv = sumEl.querySelector('.adp-summary-actions');
    if (actionsDiv) sumEl.insertBefore(gp, actionsDiv);
    else sumEl.appendChild(gp);
  }

  var sumNewBtn = $mt('nl-ad-sum-new');
  if (sumNewBtn) {
    sumNewBtn.onclick = function () {
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
      document.querySelectorAll('#nl-ad-cats .adp-cat').forEach(function (el) {
        el.classList.toggle('on', weakCats.indexOf(el.dataset.cat) !== -1);
      });
      mtStart();
    };
  }

  var summary = $mt('nl-ad-summary');
  var actions = $mt('nl-ad-actions');
  var body = $mt('nl-ad-win-body');
  var headerClose = $mt('nl-ad-win-close');
  if (summary) summary.hidden = false;
  if (actions) actions.style.display = 'none';
  if (body) body.innerHTML = '';
  if (headerClose) headerClose.style.display = 'none';

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
   CSS
══════════════════════════════════════════════════════ */
(function mtInjectStyles() {
  if (document.getElementById('mt-motor-css')) return;
  var s = document.createElement('style');
  s.id = 'mt-motor-css';
  s.textContent = [
    '.mt-card { animation: mtFadeIn .25s ease; }',
    '@keyframes mtFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }',
    '.mt-live { margin-bottom:.65rem; padding:.55rem .65rem; border:1px solid var(--border,#e0dbd2); border-radius:10px; background:linear-gradient(180deg,#fff,#fbfaf8); }',
    '.mt-live-top { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:.42rem; }',
    '.mt-live-progress { font-size:.82rem; font-weight:700; color:var(--text,#1a1a18); }',
    '.mt-live-kpis { display:flex; gap:6px; flex-wrap:wrap; }',
    '.mt-live-pill { font-size:.66rem; padding:1px 7px; border-radius:999px; background:#f7f6f3; color:var(--tmid,#6a6a66); border:1px solid #ece8e0; }',
    '.mt-live-pill strong { color:var(--tmid,#4a4a46); font-weight:600; }',
    '.mt-live-bar { height:6px; border-radius:999px; background:#ebe6dc; overflow:hidden; }',
    '#mt-live-bar-fill { display:block; height:100%; width:0; background:linear-gradient(90deg,var(--mid,#2E6B4F),var(--accent,#C8832A)); transition:width .35s ease; }',
    '.mt-live-mastery { margin-top:.25rem; border:1px solid #e3d4b2; border-radius:8px; background:linear-gradient(145deg,#fff9ea,#fdf1d5); padding:.35rem .55rem; }',
    '.mt-live-mastery-toggle { margin-top:.35rem; }',
    '.mt-live-mastery-summary { cursor:pointer; font-size:.76rem; color:#6b4a00; list-style:none; display:flex; align-items:center; gap:5px; padding:2px 0; }',
    '.mt-live-mastery-summary::-webkit-details-marker { display:none; }',
    '.mt-live-mastery-summary::before { content:"\\25B6"; font-size:.55rem; transition:transform .15s; }',
    '.mt-live-mastery-toggle[open] > .mt-live-mastery-summary::before { transform:rotate(90deg); }',
    '.mt-live-mastery-summary strong { font-size:.78rem; font-weight:700; color:#5f4311; }',
    '.mt-live-mastery-head { display:flex; align-items:center; gap:7px; font-size:.72rem; color:#6b4a00; }',
    '#mt-live-mastery-icon { font-size:.88rem; }',
    '#mt-live-mastery-name { font-size:.78rem; font-weight:700; color:#5f4311; }',
    '#mt-live-mastery-trophies { font-size:.68rem; background:rgba(255,255,255,.55); border:1px solid rgba(193,139,46,.35); border-radius:999px; padding:1px 7px; }',
    '.mt-live-mastery-bar { margin-top:.2rem; height:4px; border-radius:99px; overflow:hidden; background:rgba(115,85,30,.16); }',
    '#mt-live-mastery-fill { display:block; height:100%; width:0; border-radius:99px; background:linear-gradient(90deg,#2c7a57,#c18b2e); transition:width .35s ease; }',
    '#mt-live-mastery-text { margin-top:.15rem; font-size:.66rem; color:#6f5a33; }',
    '.mt-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:.6rem; }',
    '.mt-badge { font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; padding:3px 10px; border-radius:99px; font-weight:600; }',
    '.mt-badge-cat { background:var(--alight,#fff3e0); color:var(--accent,#7a3800); }',
    '.mt-badge-lett { background:#e8f2f8; color:#1a567a; }',
    '.mt-badge-medium { background:#fffbe8; color:#6b4a00; }',
    '.mt-badge-vanskelig { background:#fff0ed; color:#8b2a0a; }',
    '.mt-badge-vanskeleg { background:#fff0ed; color:#8b2a0a; }',
    '.mt-badge-retry { background:#eef0ff; color:#4a50a6; }',
    '.mt-question { font-size:1rem; line-height:1.65; color:var(--text,#1a1a18); margin:0 0 .3rem; font-family:"Playfair Display",serif; font-style:italic; }',
    '.mt-context-text { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; margin:.6rem 0; font-size:.9rem; line-height:1.75; }',
    '.mt-hint { background:#fffbe8; border:1px solid #f5d878; border-radius:8px; padding:.5rem .8rem; margin:.5rem 0; font-size:.82rem; color:#6b4a00; }',
    '.mt-instruction { font-size:.82rem; color:var(--tmuted,#8a8a84); margin-bottom:.5rem; }',
    '.mt-rule-first { background:#eef5fc; border-left:3px solid #4a90d9; border-radius:0 8px 8px 0; padding:.5rem .75rem; margin-bottom:.6rem; font-size:.85rem; line-height:1.5; color:#1a2e45; }',
    '.mt-mc-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:.6rem; }',
    '.mt-mc-grid-sm { gap:6px; }',
    '.mt-mc-btn { background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; color:var(--text,#1a1a18); font-family:inherit; font-size:.88rem; padding:8px 16px; cursor:pointer; transition:all .12s; text-align:left; display:inline-flex; align-items:center; gap:8px; }',
    '.mt-mc-btn:hover:not([disabled]) { border-color:var(--mid,#2E6B4F); background:var(--plight,#e8f2ec); }',
    '.mt-mc-sm { font-size:.82rem; padding:6px 12px; }',
    '.mt-mc-key { display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:4px; background:var(--bg,#f3f0ea); font-size:.72rem; font-weight:700; color:var(--tmuted,#8a8a84); flex-shrink:0; }',
    '.mt-mc-btn.mt-correct { background:rgba(26,122,80,.1); border-color:#1A7A50; color:#155f3e; }',
    '.mt-mc-btn.mt-wrong { background:rgba(192,57,43,.1); border-color:#C0392B; color:#8a2319; }',
    '.mt-mc-btn.mt-selected { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); font-weight:600; }',
    '.mt-input-row { margin-top:.6rem; }',
    '.mt-text-input { width:100%; border:1.5px solid var(--border,#e5e2db); border-radius:8px; background:#fff; color:var(--text,#1a1a18); font-family:inherit; font-size:.9rem; padding:9px 14px; outline:none; transition:border-color .15s; }',
    '.mt-text-input:focus { border-color:var(--mid,#2E6B4F); }',
    '.mt-textarea { resize:vertical; line-height:1.6; }',
    '.mt-mono { font-family:"JetBrains Mono",monospace; font-size:.85rem; }',
    '.mt-inp-correct { border-color:#1A7A50 !important; background:rgba(26,122,80,.06) !important; }',
    '.mt-inp-wrong { border-color:#C0392B !important; background:rgba(192,57,43,.06) !important; }',
    '.mt-inp-neutral { border-color:var(--accent,#e5822a) !important; }',
    '.mt-fillsel { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; margin-top:.6rem; }',
    '.mt-fillsel-line { margin-bottom:.35rem; font-size:.9rem; line-height:2; }',
    '.mt-fill-select { font-family:inherit; font-size:.88rem; padding:4px 8px; border:1.5px solid var(--border,#d5d2cb); border-radius:6px; background:#fff; }',
    '.mt-ff { margin-top:.6rem; }',
    '.mt-ff-text { background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; padding:.7rem .9rem; line-height:2; font-size:.92rem; margin-bottom:.6rem; }',
    '.mt-ff-word { display:inline; padding:2px 3px; border-radius:3px; cursor:pointer; transition:all .12s; border-bottom:2px solid transparent; }',
    '.mt-ff-word:hover { background:rgba(91,122,171,.08); }',
    '.mt-ff-word.mt-ff-sel { background:rgba(91,122,171,.14); border-bottom-color:#5b7aab; color:#2b4f85; }',
    '.mt-ff-word.mt-ff-hit { background:rgba(26,122,80,.12); border-bottom-color:#1A7A50; color:#155f3e; }',
    '.mt-ff-word.mt-ff-missed { background:rgba(176,90,0,.12); border-bottom-color:#B05A00; color:#7a4800; }',
    '.mt-ff-word.mt-ff-false { background:rgba(192,57,43,.12); border-bottom-color:#C0392B; color:#8a2319; }',
    '.mt-km { margin-top:.6rem; }',
    '.mt-km-text { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; line-height:2; font-size:.92rem; margin-bottom:.6rem; }',
    '.mt-km-word { display:inline-block; margin:2px 3px; padding:3px 8px; border-radius:5px; cursor:pointer; border:1.5px solid transparent; transition:all .12s; }',
    '.mt-km-word:hover { border-color:var(--mid,#2E6B4F); }',
    '.mt-km-word.mt-km-sel { background:#e8eef8; border-color:#5b7aab; color:#2b4f85; }',
    '.mt-km-word.mt-km-hit { background:rgba(26,122,80,.12); border-color:#1A7A50; color:#155f3e; }',
    '.mt-km-word.mt-km-missed { background:rgba(176,90,0,.12); border-color:#B05A00; color:#7a4800; }',
    '.mt-km-word.mt-km-false { background:rgba(192,57,43,.12); border-color:#C0392B; color:#8a2319; }',
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
    '.mt-do { margin-top:.6rem; }',
    '.mt-do-bank { display:flex; flex-wrap:wrap; gap:8px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; min-height:40px; margin-bottom:.6rem; }',
    '.mt-do-answer { min-height:44px; padding:.5rem; background:#fff; border:2px dashed var(--border,#c5c2bb); border-radius:8px; display:flex; flex-wrap:wrap; gap:8px; margin-bottom:.5rem; }',
    '.mt-do-placeholder { font-size:.82rem; color:var(--tmuted,#aaa); }',
    '.mt-do-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:6px; font-size:.88rem; padding:6px 14px; cursor:pointer; transition:all .12s; }',
    '.mt-do-token.mt-do-placed { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); }',
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
    '.mt-ak { margin-top:.6rem; }',
    '.mt-ak-body { background:var(--bg,#f8f7f4); border-radius:8px; padding:.7rem .9rem; line-height:2.2; }',
    '.mt-ak-text { font-size:.9rem; }',
    '.mt-ak-break { font-size:.9rem; cursor:pointer; border-bottom:2px dotted var(--border,#c5c2bb); transition:all .15s; padding-bottom:1px; }',
    '.mt-ak-break:hover { border-bottom-color:var(--mid,#2E6B4F); }',
    '.mt-ak-break.mt-ak-on { background:rgba(91,122,171,.12); color:#2b4f85; border-bottom:2px solid #5b7aab; }',
    '.mt-ak-break.mt-ak-hit { background:rgba(26,122,80,.12); border-bottom-color:#1A7A50; color:#155f3e; }',
    '.mt-ak-break.mt-ak-missed { background:rgba(176,90,0,.12); border-bottom-color:#B05A00; color:#7a4800; }',
    '.mt-ak-break.mt-ak-false { background:rgba(192,57,43,.12); border-bottom-color:#C0392B; color:#8a2319; }',
    '.mt-su { margin-top:.6rem; display:flex; flex-direction:column; gap:8px; }',
    '.mt-su-row { display:flex; align-items:center; gap:10px; padding:.55rem .7rem; background:#fff; border:1.5px solid var(--border,#e5e2db); border-radius:8px; transition:all .15s; }',
    '.mt-su-text { flex:1; font-size:.88rem; line-height:1.5; }',
    '.mt-su-btns { display:flex; gap:5px; flex-shrink:0; }',
    '.mt-su-btn { padding:5px 14px; border:1.5px solid var(--border,#e5e2db); border-radius:6px; background:#fff; font-size:.8rem; font-weight:600; cursor:pointer; transition:all .12s; }',
    '.mt-su-btn.mt-selected { background:var(--alight,#fff3e0); border-color:var(--accent,#e5822a); color:var(--accent,#7a3800); }',
    '.mt-su-row.mt-su-ok { background:rgba(26,122,80,.06); border-color:#1A7A50; }',
    '.mt-su-row.mt-su-wrong { background:rgba(192,57,43,.06); border-color:#C0392B; }',
    '.mt-omskriv { margin-top:.6rem; }',
    '.mt-sr { margin-top:.6rem; }',
    '.mt-sr-list { display:flex; flex-direction:column; gap:6px; padding:.5rem; background:var(--bg,#f8f7f4); border-radius:8px; margin-bottom:.5rem; }',
    '.mt-sr-token { background:#fff; border:1.5px solid var(--border,#d5d2cb); border-radius:7px; font-size:.85rem; padding:8px 14px; cursor:grab; touch-action:manipulation; transition:all .12s; }',
    '.mt-sr-token:hover { border-color:var(--mid,#2E6B4F); }',
    '.mt-correct { background:rgba(26,122,80,.1) !important; border-color:#1A7A50 !important; color:#155f3e !important; }',
    '.mt-wrong { background:rgba(192,57,43,.1) !important; border-color:#C0392B !important; color:#8a2319 !important; }',
    '.mt-btn-secondary { background:transparent; border:1.5px solid var(--border,#d5d2cb); color:var(--tmid,#4a4a46); border-radius:8px; font-family:inherit; font-size:.82rem; padding:7px 14px; cursor:pointer; margin-top:.5rem; transition:all .12s; }',
    '.mt-btn-secondary:hover { border-color:var(--mid,#2E6B4F); color:var(--primary,#1A3D2B); }',
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
   INIT
══════════════════════════════════════════════════════ */

function mtInit() {
  // Fjern eventuell legacy feedback-node dersom den finst i eldre markup.
  var legacyFeedback = $mt('nl-ad-feedback');
  if (legacyFeedback && legacyFeedback.parentNode) legacyFeedback.parentNode.removeChild(legacyFeedback);

  /* Bygg kategoriknappar frå BANKV2 dersom #nl-ad-cats er tomt */
  var catsWrap = $mt('nl-ad-cats');
  if (catsWrap && !catsWrap.querySelector('.adp-cat') && BANKV2.length) {
    var catGroups = [
      { title: 'Rettskriving', cats: ['og_aa','sammensatt','dobbel_konsonant','kj_skj','tegnsetting'] },
      { title: 'Grammatikk',   cats: ['ordklasser','setningsbygging','bindeord'] },
      { title: 'Tekst og skriving', cats: ['tekststruktur','kildebruk','oppgavetolking','spraak_stil','aarsak_sammenheng','referansekjede','logisk_struktur','ordval','bruke_eksempel','tilpass_til_lesaren'] },
      { title: 'Sjanger og formål', cats: ['sjangerkompetanse','fagartikkel','debattinnlegg','overskrift_ingress','novelle','parafrase','sitat','tal_og_statistikk'] }
    ];
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

  /* Synk toppcockpit med lagret nivå/xp/streak/troféer ved innlasting */
  var initXP = mtXpGetTotal();
  var initStreak = mtStreakGet();
  mtUpdateHeaderProfile(initXP, initStreak.current || 0);
}

function mtShouldAutoInit() {
  if (typeof window === 'undefined') return false;
  return true;
}

if (mtShouldAutoInit()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mtInit);
  } else {
    mtInit();
  }
}

window.mtStart = mtStart;
window.mtStartManualQueue = mtStartManualQueue;
window.mtAbort = mtAbort;
window.mtStartFeillogg = mtStartFeillogg;
window.mtFeilloggGet = mtFeilloggGet;
window.mtBadgesCountRetryWin = mtBadgesCountRetryWin;
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
