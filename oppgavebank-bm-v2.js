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

/* ─── DATA ───────────────────────────────────────── */
var MT_BANK = [

/* ═══════════════════════════════════════════════════
  1. OG / Å  (10 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Hun liker ___ danse.»',
 alt:['og','å'],fasit:'å',
 regel:'«Å» er infinitivsmerke og kommer foran et verb i infinitiv.',
 eks:'Hun liker å danse. Han prøver å lese.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Han spiser brød ___ drikker melk.»',
 alt:['og','å'],fasit:'og',
 regel:'«Og» er et bindeord som binder sammen to ledd eller setninger.',
 eks:'Han spiser brød og drikker melk. Hun leser og skriver.'},

{kat:'og_aa',kat_label:'Og / å',type:'fillsel',vanske:'medium',
 q:'Vel «og» eller «å» i hver setning.',
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
 fasit:'At ananasfrukta ringer med telefon',
 regel:'Særskriving kan gi helt ny betydning. «Ananasringer» = mat. «Ananas ringer» = frukt med telefon.',
 eks:'ananasringer (mat) vs. ananas ringer (absurd betydning)'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'fix',vanske:'lett',
 q:'Rett de fem særskrivingsfeilene i teksten.',
 tekst:'Hvert år havner enorme mengder havplast i sjøen. Sjødyr som hval og sel setter seg fast i plastbiter. Forskere fra Havforskningsinstituttet advarer om problemet.',
 errors:{'hav plast':'havplast','Sjø dyr':'Sjødyr','plast bitar':'plastbitar','Hav forskings instituttet':'Havforskingsinstituttet'},
 fasit:'havplast · Sjødyr · plastbitar · Havforskingsinstituttet',
 regel:'Sammensatte ord skriver man alltid i ett på norsk. Ingen mellomrom mellom leddene.',
 eks:'havplast, sjødyr, plastbiter, Havforskningsinstituttet'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'fix',vanske:'medium',
 q:'Rett de fire særskrivingsfeilene i elevteksten.',
 tekst:'I dag skal vi ha julemiddag med hele familien. Bestemor lager pinnekjøttmiddag, og vi har pyntet juletreet med lys. Etter middagen spiller vi brettspill og drikker varm sjokolade.',
 errors:{'jule middag':'julemiddag','pinnekjøt middag':'pinnekjøtmiddag','jule treet':'juletreet'},
 fasit:'julemiddag · pinnekjøtmiddag · juletreet',
 regel:'Høytidsord skriver man i ett: julemiddag, juletre, påskemiddag.',
 eks:'julemiddag, juletreet, pinnekjøtmiddag'},

{kat:'sammensatt',kat_label:'Sammensatte ord',type:'drag_kolonne',vanske:'medium',
 q:'Hvilke ord er riktig skrevet, og hvilke er feil (særskrevne)?',
 kolonner:['Rett skrive','Feil (særskrive)'],
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
  {tekst:'«Lamme lår» og «lammelår» tyder det same.',sann:false},
  {tekst:'Bindestrek brukes mellom et norsk ord og en forkorting (f.eks. barne-tv).',sann:true},
  {tekst:'«Stor by» og «storby» tyder det same.',sann:false}
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
  3. DOBBEL KONSONANT  (8 oppgåver)
  ═══════════════════════════════════════════════════ */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett infinitivsform?',
 alt:['hope','hoppe','hoppa','hopa'],
 fasit:'hoppe',
 regel:'Etter kort vokal kjem dobbel konsonant: «hoppe» (kort o → pp).',
 eks:'hoppe, sitje, leggje, kaste'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hvorfor skriver en «mat» med én t, men «matte» med dobbel t?',
 alt:['Det er tilfeldig','«Mat» har lang vokal, «matte» har kort vokal','«Mat» er nynorsk, «matte» er bokmål','Begge har kort vokal'],
 fasit:'«Mat» har lang vokal, «matte» har kort vokal',
 regel:'Lang vokal → éin konsonant. Kort vokal → dobbel konsonant.',
 eks:'mat (lang a) vs. matte (kort a) · bil (lang i) vs. bille (kort i)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter ordene: hva er rett skrevet, og hva er feil?',
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
 q:'Rett de fire rettskrivingsfeilene.',
 tekst:'Mange unggdomar er opptekne av sosiale medium. Familien bør samlast rundt midagsbordet og snakke om daagen. Prøv å leggje ned telefonen og sjå ut vinnduet.',
 errors:{'unggdomar':'ungdomar','midagsbordet':'middagsbordet','daagen':'dagen','vinnduet':'vindauget'},
 fasit:'ungdomar · middagsbordet · dagen · vindauget',
 regel:'Dobbel konsonant berre etter kort vokal. «Dag» har lang a → éin g. «Middag» har kort i → dd.',
 eks:'ungdomar (lang u) · middagsbordet (kort i) · dagen (lang a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'fillsel',vanske:'medium',
 q:'Vel rett form av verbet.',
 items:[
  {pre:'Hun',alt:['hopper','hopperr'],fasit:'hopper',post:'over bekken.'},
  {pre:'Katten',alt:['sover','sovver'],fasit:'sover',post:'i sofaen.'},
  {pre:'Han',alt:['løper','løpper'],fasit:'løper',post:'fort.'},
  {pre:'Vi',alt:['lagar','laggar'],fasit:'lagar',post:'middag.'}
 ],
 regel:'«Hoppar» (kort o → pp). «Sover» (lang o → éin v). «Løper» (lang ø → éin p).',
 eks:'hoppar (kort vokal) · sover (lang vokal) · løper (lang vokal)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: «Hun ___ på stolen» (å sitte, presens).',
 hint:'Presensforma av «å sitje» har berre éin konsonant.',
 fasit:'sit',fasit_v:['sit'],
 regel:'Infinitiv: sitje (dobbel t). Presens: sit (éin t).',
 eks:'hun sitter, han sitter, de sitter'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'sann_usann_serie',vanske:'vanskeleg',
 q:'Er påstandene om dobbel konsonant sanne eller usanne?',
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
 q:'Vel rett skrivemåte i hver setning.',
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
 fasit:'kjende',fasit_v:['kjende','kjente'],
 regel:'«Å kjenne» → preteritum «kjende» (nynorsk). Skriv med «kj».',
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
 regel:'Komma etter framskuven leddsetning: [leddsetning], [hovudsetning].',
 eks:'Fordi det regnet, tok vi bussen. Selv om hun var trøtt, gikk hun.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fix',vanske:'lett',
 q:'Sett inn de fem kommaene som mangler.',
 tekst:'Selv om det var kaldt ute bestemte vi oss for å gå tur. Vi tok med mat drikke og varme klær. Lena som er raskest i klassen sprang foran. Da vi kom hjem lagde vi kakao.',
 errors:{'kaldt ute bestemte':'kaldt ute, bestemte','mat drikke':'mat, drikke','Lena som':'Lena, som','klassen sprang':'klassen, sprang','heim laga':'heim, laga'},
 fasit:'ute, bestemte · mat, drikke · Lena, som · klassen, sprang · heim, laga',
 regel:'Komma etter fremskutt leddsetning, i oppramsing, og rundt innskutt relativsetning.',
 eks:'Selv om ..., [hovedsetning]. Lena, som ..., sprang.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'fix',vanske:'medium',
 q:'Rett tegnsettinga i teksten (3 feil).',
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
  {tekst:'bok',fasit:0},{tekst:'spring',fasit:1},
  {tekst:'hund',fasit:0},{tekst:'søv',fasit:1},
  {tekst:'skulen',fasit:0},{tekst:'skriv',fasit:1},
  {tekst:'glede',fasit:0},{tekst:'hoppar',fasit:1}
 ],
 regel:'Substantiv er navn på ting, personer, steder og begreper. Verb sier hva noen gjør eller er.',
 eks:'Substantiv: bok, hund, skulen. Verb: spring, søv, skriv.'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'drag_kolonne',vanske:'medium',
 q:'Dra hvert ord til riktig ordklasse: adjektiv eller adverb?',
 kolonner:['Adjektiv','Adverb'],
 ord:[
  {tekst:'rask',fasit:0},{tekst:'raskt',fasit:1},
  {tekst:'vakker',fasit:0},{tekst:'alltid',fasit:1},
  {tekst:'glad',fasit:0},{tekst:'svært',fasit:1},
  {tekst:'stor',fasit:0},{tekst:'sjeldan',fasit:1}
 ],
 regel:'Adjektiv skildrar substantiv. Adverb modifiserer verb, adjektiv eller andre adverb.',
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
 q:'Klikk på alle verba i setninga.',
 tekst:'Hunden løper fort og bjeffer høyt når naboen kommer.',
 maalordklasse:'verb',
 fasit_ord:['spring','bjeffer','kjem'],
 regel:'Verb sier hva noen gjør, tenker eller er.',
 eks:'spring, bjeffer, kjem = handlingsverb'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'klikk_marker',vanske:'medium',
 q:'Klikk på alle substantiva i setninga.',
 tekst:'Læreren skreiv ei lang oppgave på tavla hver dag.',
 maalordklasse:'substantiv',
 fasit_ord:['læreren','oppgave','tavla','dag'],
 regel:'Substantiv er navn på personer, ting, steder og begreper.',
 eks:'læreren (person), oppgave (ting), tavla (ting), dag (tid/begrep)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'lett',
 q:'Hva ordklasse hører «rask» til i «Han er en rask løper»?',
 alt:['Substantiv','Adjektiv','Verb','Adverb'],
 fasit:'Adjektiv',
 regel:'Adjektiv beskriver substantiv. Her beskriver «rask» substantivet «løper».',
 eks:'en rask løper · en stor bok · et rødt hus'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'medium',
 q:'Hva ordklasse er «fort» i «Han springer fort»?',
 alt:['Adjektiv','Adverb','Verb','Preposisjon'],
 fasit:'Adverb',
 regel:'Adverb sier hvordan, når eller hvor mye. Her sier «fort» hvordan han løper.',
 eks:'fort, sakte, alltid, aldri, svært'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'finn_feil',vanske:'medium',
 q:'Klikk på hvert ord som er et verb i setningen.',
 tekst:'Hun skrev brevet raskt og sendte det samme kvelden.',
 fasit_feil:['skreiv','sende'],
 regel:'Verb sier hva noen gjør. «Skrev» og «sendte» er handlingsverb i preteritum.',
 eks:'skreiv (å skrive) · sende (å sende)'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'cloze',vanske:'lett',
 q:'«Raskt» i «Han sprang raskt» er et ___.',
 hint:'Ordet sier noe om hvordan han sprang – det endrer verbet.',
 fasit:'adverb',fasit_v:['adverb'],
 regel:'Adverb modifiserer verb. Her modifiserer «raskt» verbet «sprang».',
 eks:'Han sprang raskt. Hun sang vakkert. De jobbet hardt.'},

{kat:'ordklasser',kat_label:'Ordklasser',type:'mc',vanske:'vanskeleg',
 q:'Hva ordklasse er «fordi» i «Hun gikk hjem fordi hun var trøtt»?',
 alt:['Subjunksjon','Konjunksjon','Adverb','Preposisjon'],
 fasit:'Subjunksjon',
 regel:'Subjunksjonar innleier leddsetningar. «Fordi» innleier ei årsaks-leddsetning.',
 eks:'fordi, at, når, om, selv om, mens, siden, dersom'},

/* ═══════════════════════════════════════════════════
  7. SETNINGSBYGGING  (8 oppgåver)
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
 alt:['For mange «og» – teksten bør delast opp','«Tur» er feil ord','«Kaldt» er feil','Det er ingen feil'],
 fasit:'For mange «og» – teksten bør delast opp',
 regel:'Unngå lange kjeder med «og». Del opp med punktum og variér setningsoppbygginga.',
 eks:'Han gjekk tur. Det var kaldt, og han angra på at han hadde gløymt lua.'},

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
 regel:'Fjern «og sånn», vage ord og samankopling. Bruk presist og variert ordval.',
 eks:'«veldig stort» → «alvorleg globalt» · «og sånn» → fjern'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'sorter_rekke',vanske:'medium',
 q:'Sett delene i riktig rekkefølge for en faglig innledning.',
 items:[
  {tekst:'Presentere temaet'},
  {tekst:'Gje bakgrunnsinformasjon'},
  {tekst:'Formulere problemstilling'},
  {tekst:'Varsle oppbygginga av teksten'}
 ],
 regel:'En god innledning: tema → bakgrunn → problemstilling → oppbyggingssignal.',
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
 q:'Velg riktig bindeord: «Hun var trøtt, ___ gikk hun hjem.»',
 alt:['derfor','men','fordi','og'],
 fasit:'derfor',
 regel:'«Derfor» viser konsekvens: hun var trøtt → derfor gikk hun hjem.',
 eks:'Hun var trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Vel rett bindeord: «Det regnar, ___ vi går ut likevel.»',
 alt:['men','derfor','fordi','og'],
 fasit:'men',
 regel:'«Men» viser kontrast – to ting som går mot hverandre.',
 eks:'Det regnar, men vi går ut likevel.'},

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
 q:'Vel det mest presise bindeordet.',
 items:[
  {pre:'KI kan være nyttig,',alt:['men','og','derfor'],fasit:'men',post:'det reiser etiske spørsmål.'},
  {pre:'Hun øvde mye.',alt:['Dessuten','Likevel','Derfor'],fasit:'Dessuten',post:'leste hun teori hver kveld.'},
  {pre:'Han studerte flittig,',alt:['altså','likevel','og'],fasit:'likevel',post:'strauk han på eksamen.'}
 ],
 regel:'Men = motsetnad. Dessutan = tillegg. Likevel = uventa kontrast.',
 eks:'nyttig, men etiske spørsmål · øvde, dessutan las teori · studerte, likevel strauk'},

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
 eks:'Likevel møtte han … · Dessutan er det …'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_kolonne',vanske:'medium',
 q:'Sorter bindeorda etter funksjon: årsak eller kontrast?',
 kolonner:['Årsak / konsekvens','Kontrast / motsetnad'],
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
 fasit:'Likevel',fasit_v:['Likevel','Derimot','Trass i dette','På den andre sida'],
 regel:'«Likevel», «derimot» og «på den andre sida» viser kontrast.',
 eks:'Sosiale medier er nyttige. Likevel kan de ha negative konsekvenser.'},

{kat:'bindeord',kat_label:'Bindeord',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «___ ungdom skriver mer enn noen gang, betyr det ikke at de skriver bedre.»',
 hint:'Hvilket bindeord viser at noe skjer til tross for noe annet?',
 fasit:'Selv om',fasit_v:['Selv om','Til tross for at'],
 regel:'«Selv om» innleder en leddsetning som viser kontrast.',
 eks:'Selv om det er vanskelig, prøver hun.'},

/* ═══════════════════════════════════════════════════
  9. TEKSTSTRUKTUR  (10 oppgåver)
  ═══════════════════════════════════════════════════ */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'lett',
 q:'Sorter avsnitta til rett del av fagartikkelen.',
 lag:['Innleiing','Hovuddel','Avslutning'],
 avsnitt:[
  {tekst:'Plast i havet er et aukande problem som påverkar dyr og natur over heile verda.',lag:0},
  {tekst:'Éi løysing er å innføre strengare regulering av eingongsplast i alle EU-land.',lag:1},
  {tekst:'Kildesortering og bedre infrastruktur kan også redusere problemet.',lag:1},
  {tekst:'Alt i alt viser dette at plastforureining krev samarbeid på tvers av landegrenser.',lag:2}
 ],
 regel:'Innleiinga presenterer temaet. Hovuddelen utdjupar. Avsluttinga konkluderer.',
 eks:'Innleiing → tema · Hovuddel → argument · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'medium',
 q:'Sorter avsnitta frå et debattinnlegg om skjermtid til rett del.',
 lag:['Innleiing med påstand','Argument for','Motargument og tilbakevising','Avslutning'],
 avsnitt:[
  {tekst:'Barn under tolv år bør ikke ha egen mobiltelefon.',lag:0},
  {tekst:'Forsking viser at mykje skjermtid reduserer konsentrasjonsevna hos unge.',lag:1},
  {tekst:'Nokon vil hevde at mobilen er nødvendig for tryggleik, men det finst enklare alternativ.',lag:2},
  {tekst:'Samla sett er det gode grunnar til å avgrense tilgangen til mobilar for born.',lag:3}
 ],
 regel:'Debattinnlegg: påstand → argument → motargument + tilbakevising → konklusjon.',
 eks:'Påstand tidleg · Argument med kjelde · Motargument tilbakevist · Konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Hva er en ingress?',
 alt:['Éi til to setningar som innleier og presenterer temaet','Den lengste hovuddelen av teksten','Kjeldelista nedst i teksten','Avslutninga av teksten'],
 fasit:'Éi til to setningar som innleier og presenterer temaet',
 regel:'Ingressen kjem etter overskrifta og gir lesaren et raskt overblikk.',
 eks:'«Plasten i havet er en av vår tids største miljøtruslar. Her er det du treng å vite.»'},

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
  {id:'s1',tekst:'Gjennomsnittstemperaturen har stige med over éin grad sidan den industrielle revolusjonen.',first_word:'Gjennomsnittstemperaturen'},
  {id:'s2',tekst:'For å stoppe oppvarminga må verdssamfunnet kutte utslepp drastisk.',first_word:'For'},
  {id:'s3',tekst:'Mange land har allereie innført tiltak mot karbonutslepp.',first_word:'Mange'}
 ],
 fasit_breaks:['s2'],
 regel:'Nytt avsnitt ved nytt poeng. «For å stoppe …» skiftar frå problem til løysing.',
 eks:'Avsnitt 1: fakta om problemet · Avsnitt 2: hva som må gjerast'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'medium',
 q:'Hvilken overskrift er faglig god, og hvilken er dårlig?',
 kolonner:['God fagleg overskrift','Dårleg overskrift'],
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
 kolonner:['Høyrer heime','Høyrer IKKE heime'],
 ord:[
  {tekst:'Argument for og mot påstanden',fasit:0},
  {tekst:'Konklusjon med eiga vurdering',fasit:0},
  {tekst:'Personlig fortelling om en gang du var lei',fasit:1},
  {tekst:'Historia til mobiltelefonen frå 1973 til i dag',fasit:1},
  {tekst:'Kjeldetilvising til forsking',fasit:0},
  {tekst:'Hvordan du lager en app',fasit:1}
 ],
 regel:'«Drøft» = argument for og mot + konklusjon. Personlege forteljingar og historikk utan kopling høyrer ikke heime.',
 eks:'Høyrer heime: argument, kjelde, konklusjon · Ikke: irrelevant historie'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Et godt avsnitt har: temasetning → ___ → avslutningssetning.',
 hint:'Hva kommer mellom temasetning og avslutning – det som utdyper hovedpoenget?',
 fasit:'utdjupande setningar',
 fasit_v:['utdjupande setningar','kommentarsetningar','forklaringar og døme','utdjuping','kommentarar'],
 regel:'Etter temasetning kjem utdjupande kommentarsetningar med forklaring, bevis og døme.',
 eks:'Temasetning → forklaring → bevis/kjelde → kommentar'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Fyll inn et overgangsord: «KI kan effektivisere arbeidet, ___ reiser det også etiske spørsmål.»',
 hint:'Du treng et ord som viser motsetnad.',
 fasit:'men',fasit_v:['men','likevel','samstundes'],
 regel:'«Men» og «likevel» signaliserer motsetnad og er sentrale i drøftande tekstar.',
 eks:'KI er nyttig, men vi må stille kritiske spørsmål.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'sorter_rekke',vanske:'vanskeleg',
 q:'Set delane av et fagleg avsnitt i rett rekkjefølgje.',
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
{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvordan skriver du en kildetilvisning i teksten?',
 alt:['(Etternamn, årstal)','[lenke til nettsida]','Forfatter: tittel','«sitat» – kjelde'],
 fasit:'(Etternamn, årstal)',
 regel:'Standardformat: (Etternamn, årstal) i parentes etter påstanden.',
 eks:'Plasten har auka med 40 % (Jensen, 2024).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvor i teksten skal kjeldelista stå?',
 alt:['Heilt til slutt i dokumentet','I innleiinga','Midt i teksten','Rett etter første kjelde'],
 fasit:'Heilt til slutt i dokumentet',
 regel:'Kjeldelista kjem alltid aller sist, gjerne med overskrifta «Kjeldeliste».',
 eks:'Hovudtekst → avslutning → kjeldeliste'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva er feil kildebruk?',
 alt:['Kopiere et avsnitt uten sitat og kjelde','Bruke en påstand med (Jensen, 2024)','Skrive «Ifølge Miljødirektoratet (2023)»','Ha kjeldeliste på slutten'],
 fasit:'Kopiere et avsnitt uten sitat og kjelde',
 regel:'Å kopiere utan å markere sitat og oppgi kjelde er plagiat.',
 eks:'Feil: kopiert tekst. Rett: «…» (Kjelde, årstal) eller parafrase (Kjelde, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'sann_usann_serie',vanske:'lett',
 q:'Er påstandane om kildebruk sanne eller usanne?',
 paastandar:[
  {tekst:'Kjeldelista skal vere sortert alfabetisk etter etternamn.',sann:true},
  {tekst:'Wikipedia er alltid ei god kjelde å sitere i en fagartikkel.',sann:false},
  {tekst:'Direkte sitat skal stå i hermeteikn med kjeldetilvising.',sann:true},
  {tekst:'Man trenger ikke kjelde viss man skriver med eigne ord.',sann:false}
 ],
 regel:'Alfabetisk kjeldeliste. Wikipedia er ikke citerbar. Omskriving treng også kjelde.',
 eks:'Omskriving: Di formulering (Kjelde, årstal). Sitat: «Ordrett» (Kjelde, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om kjeldekritikk sanne eller usanne?',
 paastandar:[
  {tekst:'En primærkilde er en original rapport eller en lov.',sann:true},
  {tekst:'Sensasjonsoverskrifter er et teikn på påliteleg journalistikk.',sann:false},
  {tekst:'En bør vurdere forfattarens kompetanse og mogleg agenda.',sann:true},
  {tekst:'Fagfellevurderte tidsskrift har høg standard.',sann:true},
  {tekst:'Alder på ei kjelde spelar aldri noka rolle.',sann:false}
 ],
 regel:'Vurder: kven, hvor, når, hvorfor. Fagfellevurdering = kvalitetsstempel.',
 eks:'Primærkilde: NOU-rapport. Sekundærkilde: avisomtale av rapporten.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'drag_kolonne',vanske:'medium',
 q:'Hva trenger hermetegn (direkte sitat), og hva kan stå fritt med kildetilvisning (omskriving)?',
 kolonner:['Treng hermeteikn (sitat)','Kan stå fritt (omskriving)'],
 ord:[
  {tekst:'«1,3 millionar tonn plast hamnar i havet kvart år»',fasit:0},
  {tekst:'Forsking viser at plast er et aukande problem i verdshava.',fasit:1},
  {tekst:'«Mikroplast trengjer inn i næringskjeda og skadar dyrelivet»',fasit:0},
  {tekst:'Havpattedyr og fuglar er særleg utsette for plastforureining.',fasit:1}
 ],
 regel:'Sett hermetegn bare ved ordrett sitering. Egen omskriving trenger kilde, men ikke hermetegn.',
 eks:'Sitat: «Ordrett» (Kjelde, årstal). Omskriving: Di formulering (Kjelde, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Hva er tegn på troverdig kilde, og hva er varselsignaler?',
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

{kat:'kildebruk',kat_label:'Kildebruk',type:'cloze',vanske:'medium',
 q:'Fyll inn det rette ordet: Villspor. (2023). Friluftsliv frå 1970 til i dag. ___ 15. mars 2026 frå: magasinetvillspor.no/…',
 hint:'Hvilket standardord brukes i kildelista for å fortelle at du har besøkt en nettside?',
 fasit:'Henta',fasit_v:['Henta','henta'],
 regel:'Standardfrasen i kjeldelista er «Henta [dato] frå:» for nettkjelder.',
 eks:'Jensen, K. (2024). Tittel. Henta 15. mars 2026 frå: lenke.no'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskeleg',
 q:'Hvilket av disse er et korrekt sitat med kildetilvisning?',
 alt:['«Det har aldri vore meir kunstsnø i skibakkane» (NRK, 2022).','NRK skreiv i 2022 at det er mykje kunstsnø.','Kunstsnø er mykje brukt (kjelda er NRK).','(NRK) Det er mykje kunstsnø.'],
 fasit:'«Det har aldri vore meir kunstsnø i skibakkane» (NRK, 2022).',
 regel:'Direkte sitat: hermeteikn rundt ordrett tekst, deretter (Kjelde, årstal) i parentes.',
 eks:'«Ordrett tekst» (Etternamn, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mcset',vanske:'vanskeleg',
 q:'Les setninga og svar: «Ifølge NRK (2024) har snøsesongen vorte kortare de siste ti åra.»',
 questions:[
  {q:'Hvilken type kildebruk er dette?',alt:['Direkte sitat','Parafrase/omskriving','Plagiat'],fasit:1},
  {q:'Er kildetilvisningen riktig plassert?',alt:['Ja','Nei – den bør stå etter punktum','Nei – den mangler hermetegn'],fasit:0},
  {q:'Hvilken type kilde er NRK?',alt:['Primærkilde','Sekundærkilde','Ikke en gyldig kilde'],fasit:1}
 ],
 regel:'Parafrase = eiga formulering med kjelde. NRK rapporterer om annan forsking = sekundærkjelde.',
 eks:'Parafrase: «Ifølge NRK (2024) …» – eigne ord, med kjelde.'},

/* ═══════════════════════════════════════════════════
  11. OPPGÅVETOLKING  (8 oppgåver)
  ═══════════════════════════════════════════════════ */
{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsordet «drøft» i ei norskoppgåve?',
 alt:['Presenter berre eitt synspunkt','Vis to sider og veg de mot hverandre','Skriv en kreativ tekst','Beskriv hvordan noko ser ut'],
 fasit:'Vis to sider og veg de mot hverandre',
 regel:'«Drøft» = presenter argument for og mot, og trekk en konklusjon.',
 eks:'«Drøft om skulen bør forby mobilar» = argument for + mot + konklusjon.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsordet «grei ut om»?',
 alt:['Ta tydeleg stilling','Forklar og informer grundig','Samanlikn to syn','Skriv kreativt'],
 fasit:'Forklar og informer grundig',
 regel:'«Grei ut om» = forklarande og informerande skriving utan å ta stilling.',
 eks:'«Grei ut om årsaker til utanforskap» = forklar hvorfor det skjer.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'medium',
 q:'Oppgåva seier: «Presenter hovudkaraktaren, og drøft hvordan forfattaren brukar kontrastar.» Kor mange delar har oppgåva?',
 alt:['Éin del','To delar','Tre delar','Fire delar'],
 fasit:'To delar',
 regel:'«Presenter … og drøft» = to bestillingsord = to delar. Telje alltid bestillingsorda.',
 eks:'Del 1: presenter hovudkaraktaren. Del 2: drøft bruken av kontrastar.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'drag_kolonne',vanske:'lett',
 q:'Oppgåva er: «Drøft om skulen bør innføre mobilforbod.» Hva høyrer heime i svaret?',
 kolonner:['Passar til oppgåva','Passar IKKE'],
 ord:[
  {tekst:'Argument for mobilforbod',fasit:0},
  {tekst:'Argument mot mobilforbod',fasit:0},
  {tekst:'Konklusjon med eiga vurdering',fasit:0},
  {tekst:'Historia til mobiltelefonen (1973–i dag)',fasit:1},
  {tekst:'Hvordan en lagar en mobiltelefon',fasit:1},
  {tekst:'Personleg forteljing om mobiltjuveri',fasit:1}
 ],
 regel:'«Drøft» = argument for + mot + konklusjon. Irrelevant historikk og personlege forteljingar høyrer ikke heime.',
 eks:'Høyrer heime: argument, kjelde, konklusjon. Ikke: historie om mobilen.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'drag_kolonne',vanske:'medium',
 q:'Oppgåva er: «Analyser hvordan forfattaren brukar naturskildringar i novella.» Hva høyrer heime?',
 kolonner:['Høyrer heime','Høyrer IKKE heime'],
 ord:[
  {tekst:'Hva funksjon har naturskildringa i teksten?',fasit:0},
  {tekst:'Hva litterære verkemiddel brukar forfattaren?',fasit:0},
  {tekst:'Handlingsreferat: hva skjer i novella?',fasit:1},
  {tekst:'Forfattarens biografi og liv',fasit:1},
  {tekst:'Hvordan skapar naturskildringa stemning?',fasit:0},
  {tekst:'«Jeg synest naturskildringa var fin»',fasit:1}
 ],
 regel:'«Analyser» = undersøk hvordan noko er bygd opp og hva funksjon det har. Ikke referat eller personlege meiningar.',
 eks:'Analyse = verkemiddel + funksjon. Ikke = «jeg synest dette er fint».'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'sann_usann_serie',vanske:'medium',
 q:'Er påstandane om oppgavetolking sanne eller usanne?',
 paastandar:[
  {tekst:'Bestillingsord er verba som fortel hva du skal gjere i oppgåva.',sann:true},
  {tekst:'«Presenter» og «drøft» krev same type tekst.',sann:false},
  {tekst:'«Samanlikn» betyr å peike på likskapar og skilnader.',sann:true},
  {tekst:'«Reflekter» betyr å gjenfortelje hendingar i rekkjefølgje.',sann:false}
 ],
 regel:'Presenter = gi oversyn. Drøft = veg argument. Samanlikn = likskapar/skilnader. Reflekter = tenkje over, vurdere.',
 eks:'Drøft ≠ presenter. Reflekter ≠ gjenfortel.'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'cloze',vanske:'medium',
 q:'Oppgåva seier «analyser». Det tyder at du skal undersøkje ___ teksten er bygd opp og hva effekt grepa har.',
 hint:'Analyse handlar om å undersøkje en bestemt ting: oppbygginga. Hva spørjeord passar?',
 fasit:'hvordan',fasit_v:['hvordan'],
 regel:'Analyse = systematisk undersøking av hvordan noko er laga og hva det gjer med lesaren.',
 eks:'Hvordan brukar forfattaren metaforar? Hvordan skapar forteljarstemma nærleik?'},

{kat:'oppgavetolking',kat_label:'Oppgavetolking',type:'mc',vanske:'vanskeleg',
 q:'Tre elevar svarar på «Drøft om teknologi gjer oss meir isolerte». Kven er på bomskot?',
 alt:['Elev A viser argument for og mot, og konkluderer.','Elev B skriv om historia til internett og teknologien.','Elev C bruker tre kjelder og veg side mot side.','Elev D startar personleg, drøftar og konkluderer.'],
 fasit:'Elev B skriv om historia til internett og teknologien.',
 regel:'«Drøft» = veg argument for og mot. Å skrive historikk er «grei ut», ikke drøfting.',
 eks:'Bomskot: svare med feil sjanger. «Grei ut»-svar der «drøft» var kravet.'},

/* ═══════════════════════════════════════════════════
  12. SPRÅK OG STIL  (10 oppgåver)
  ═══════════════════════════════════════════════════ */
{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'lett',
 q:'Klikk på kvart ord som er for uformelt for en fagartikkel.',
 tekst:'Plast i havet er jo heilt farleg for dyr og sånn.',
 fasit_feil:['jo','heilt','sånn'],
 regel:'Fagartiklar unngår forsterkingsord («heilt»), fyllord («jo») og vage uttrykk («og sånn»).',
 eks:'Unngå: «jo, heilt, og sånn». Skriv: «Plast i havet er en dokumentert trussel mot dyrelivet.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Klikk på ordene som gjør teksten for subjektiv for en fagartikkel.',
 tekst:'Jeg synes egentlig at forskningen er superviktig, og at vi bare må handle nå.',
 fasit_feil:['jeg','synes','egentlig','superviktig','bare'],
 regel:'I faglig stil toner man ned personlige meninger og forsterkerord.',
 eks:'Unngå: «Jeg synes dette er superviktig». Skriv: «Forskningen tyder på at temaet er viktig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på orda som gjer argumentasjonen for kjensleladd.',
 tekst:'Kjeldene viser tydeleg at dette er ekstremt farleg, og alle forstår jo at vi må handle straks.',
 fasit_feil:['tydeleg','ekstremt','alle','forstår','jo','straks'],
 regel:'Absolutte og kjensleladde ord bør bytast med nøytrale, etterprøvbare formuleringar.',
 eks:'Unngå: «alle forstår jo». Skriv: «Fleire studiar peikar i same retning.»'},

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
 q:'Publiseringsportalen: hva formulering vert blokkert som for skråsikker, og hva passerer?',
 kolonner:['Blokkert – for skråsikker','Passerer – fagleg nøyansert'],
 ord:[
  {tekst:'Dette beviser definitivt at tiltaket verkar.',fasit:0},
  {tekst:'Funna tyder på at tiltaket kan ha effekt.',fasit:1},
  {tekst:'Alle forskarar er einige om dette.',fasit:0},
  {tekst:'Flere studier indikerer en mulig sammenheng.',fasit:1},
  {tekst:'Det er et faktum at skulen sviktar ungdom.',fasit:0},
  {tekst:'Man kan argumentere for at skolen trenger mer ressurser.',fasit:1}
 ],
 regel:'Faglig skriving uttrykker bare det man kan dokumentere. «Tyder på» og «indikerer» viser nøyaktighet.',
 eks:'Blokkert: «beviser definitivt». Passerer: «tyder på, indikerer, kan argumentere for».'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'lett',
 q:'Byt ut «kjempeviktig» med et formelt ord: «Tiltaket var ___ for å redusere fråfall i skulen.»',
 hint:'Presist og formelt – ikke «kjempe-» eller «super-».',
 fasit:'avgjerande',fasit_v:['avgjerande','kritisk','vesentleg','sentral','nødvendig','særleg viktig'],
 regel:'Uformelle forsterkarar som «kjempe-» erstattas med presise adjektiv.',
 eks:'«kjempeviktig» → «avgjerande» · «superbra» → «særleg vellykka»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'omskriv',vanske:'medium',
 q:'Skriv om setninga til fagleg stil.',
 tekst:'Jeg tror egentlig at skjermbruk er ganske dårlig for unge, for de blir jo helt oppslukte.',
 instruksjon:'Fjern personlege meiningsmarkørar og uformelle forsterkarar. Bruk nøytral, fagleg tone.',
 maa_ha:['skjermbruk','unge'],
 maa_ikkje_ha:['jeg','tror','egentlig','ganske','jo','helt'],
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
  13. ÅRSAK OG SAMMENHENG  (8 oppgaver)
  ═══════════════════════════════════════════════════ */
{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mc',vanske:'lett',
 q:'Hvilken setning uttrykker en årsak–virkning-sammenheng?',
 alt:['Sola skin, og borna leikar ute.','Sola skin så sterkt at asfalten vert varm.','Sola skin. Borna leikar ute.','Sola skin, men det er kaldt.'],
 fasit:'Sola skin så sterkt at asfalten vert varm.',
 regel:'«Så … at» markerer at årsaka (solskin) fører til verknaden (varm asfalt).',
 eks:'«Hun las så mykje at hun vart trøytt.» = årsak–verknad'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mc',vanske:'medium',
 q:'Hvilken setning bruker det mest presise årsaksuttrykket?',
 alt:['Luftforureininga aukar, og folk vert sjukare.','Luftforureininga aukar. Folk vert sjukare.','Den aukande luftforureininga fører til fleire luftvegssjukdomar.','Luftforureininga aukar, men folk vert sjukare.'],
 fasit:'Den aukande luftforureininga fører til fleire luftvegssjukdomar.',
 regel:'«Fører til» viser eksplisitt hvordan A gir B. «Og» og to separate setningar er vagare.',
 eks:'Presist: «Røyking fører til større risiko.» Vagt: «Folk røykjer, og de vert sjuke.»'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'drag_kolonne',vanske:'lett',
 q:'Sorter uttrykka: årsaksuttrykk eller kontrastuttrykk?',
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
 eks:'«Hun kom for seint fordi bussen var forseinka.» «Bussen var forseinka, men hun kom likevel.»'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: hva er årsaka og hva er verknaden?',
 kolonner:['Årsak','Verknad'],
 ord:[
  {tekst:'Utslepp av klimagassar aukar',fasit:0},
  {tekst:'Temperaturen på jorda stig',fasit:1},
  {tekst:'Skogane vert hogde ned',fasit:0},
  {tekst:'Dyreartar mistar leveområda sine',fasit:1},
  {tekst:'Isen på polane smeltar',fasit:1},
  {tekst:'Havnivået stig',fasit:1}
 ],
 regel:'Årsaka utløyser endringa. Verknaden er resultatet. Spør: «hvorfor skjer dette?»',
 eks:'Utslepp aukar (årsak) → temperatur stig (verknad) → is smeltar (verknad)'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'klikk_marker',vanske:'lett',
 q:'Klikk på ordet som markerer en årsakssamanheng.',
 tekst:'Mange artar er utryddingstruga fordi leveområda deira vert øydelagde av avskoging.',
 maalordklasse:'årsaksord',
 fasit_ord:['fordi'],
 regel:'«Fordi» knyter ei årsak til ei følgje: avskoging → utryddingstruga artar.',
 eks:'«fordi, sidan, ettersom» = årsaksord · «men, likevel, derimot» = kontrastord'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Matprisane stig, ___ mange familiar har dårlegare råd.»',
 hint:'Verknaden kjem etter årsaka. Hva ord viser konsekvens?',
 fasit:'derfor',fasit_v:['derfor'],
 regel:'«Derfor» er et årsaksadverb som viser at det som følgjer, er resultatet av årsaka.',
 eks:'Prisane steig, derfor handla folk mindre. Vegen var glatt, derfor køyrde hun sakte.'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'mcset',vanske:'medium',
 q:'Les teksten og svar.',
 tekst:'Når born les lite, utviklar de et smalare ordforråd. Et smalt ordforråd gjer det vanskelegare å forstå fagtekstar. Derfor heng lesevanskar og fagvanskar ofte saman.',
 questions:[
  {q:'Hva er den første årsaka?',alt:['Born les lite','Smalt ordforråd','Fagvanskar'],fasit:0},
  {q:'Hva er den mellomliggjande verknaden?',alt:['Borna les meir','De utviklar smalare ordforråd','Fagtekstane vert enklare'],fasit:1},
  {q:'Hva ord markerer den siste verknaden?',alt:['når','gjer','derfor'],fasit:2}
 ],
 regel:'Årsak–verknad kan vere ei kjede: A → B → C. «Derfor» signaliserer den endelege konsekvensen.',
 eks:'Lite lesing → smalt ordforråd → vanskeleg å forstå fagtekstar → fagvanskar'},

{kat:'aarsak_sammenheng',kat_label:'Årsak og sammenheng',type:'finn_feil',vanske:'vanskeleg',
 q:'Klikk på det eine uttrykket som er feil brukt.',
 tekst:'Hun fekk gode karakterar trass i at hun jobba hardt hver dag.',
 fasit_feil:['trass'],
 regel:'«Trass i» markerer noko uventa. At hardt arbeid gir gode resultat er forventa → bruk «fordi».',
 eks:'Rett: «Hun fekk gode karakterar fordi hun jobba hardt.» Kontrast: «… dårlege trass i at hun jobba hardt.»'}

]; // end MT_BANK
if (typeof window !== 'undefined') window.MT_BANK = MT_BANK;

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

function mtLsGet() {
  try {
    var shared = JSON.parse(localStorage.getItem(MT_LS_KEY)) || {};
    if (shared && Object.keys(shared).length) return shared;
    var legacy = JSON.parse(localStorage.getItem(MT_LS_LEGACY_KEY)) || {};
    return legacy && typeof legacy === 'object' ? legacy : {};
  }
  catch (e) { return {}; }
}
function mtLsSet(data) {
  try { localStorage.setItem(MT_LS_KEY, JSON.stringify(data)); }
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
  var pool = MT_BANK.filter(function (t) { return t.id && ids[t.id]; });
  if (!pool.length) {
    var katSet = {};
    logg.forEach(function (e) { katSet[e.kat] = true; });
    pool = MT_BANK.filter(function (t) { return katSet[t.kat]; });
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
  MT_BANK.forEach(function (t) { allBankCats[t.kat] = true; });
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
}

function mtOpenSessionUi() {
  var win = $mt('nl-ad-win');
  var summary = $mt('nl-ad-summary');
  var body = $mt('nl-ad-win-body');
  var actions = $mt('nl-ad-actions');
  if (win) win.hidden = false;
  if (summary) summary.hidden = true;
  if (body) body.innerHTML = '';
  if (actions) actions.style.display = '';
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

  var pool = MT_BANK.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
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
  var idxs = Array.isArray(taskIndexes) ? taskIndexes : [];
  var tasks = idxs.map(function(idx) {
    return MT_BANK[Number(idx)];
  }).filter(function(task) {
    return !!task;
  });
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
  if (liveP) liveP.textContent = 'Oppgave ' + Math.min(done + 1, total) + ' av ' + total;
  if (liveBar) liveBar.style.width = Math.min(pct, 100) + '%';
  if (liveScore) liveScore.textContent = String(MTS.score);
  if (liveXp) liveXp.textContent = String(MTS.sessionXP || 0);
  if (liveStreak) liveStreak.textContent = String(MTS.streak || 0);
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

  var vMap = { lett: 'Lett', medium: 'Medium', vanskelig: 'Vanskelig' };
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

  mtUpdateProgress();
}

/* ─── Bygg input-HTML per type ─────────────────── */

function mtBuildInput(t) {
  switch (t.type) {

  case 'mc': {
    var alts = t.ikkje_stokk ? t.alt : mtShuffle(t.alt);
    var h = '<div class="mt-mc-grid">';
    alts.forEach(function (a, i) {
      h += '<button class="mt-mc-btn" data-val="' + mtEsc(a) + '" data-idx="' + i + '" onclick="mtCheckMc(this)">'
        + '<span class="mt-mc-key">' + (i + 1) + '</span>' + mtEsc(a) + '</button>';
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
  var correct = mtIsCorrect(chosen, t);
  document.querySelectorAll('.mt-mc-btn').forEach(function (b) {
    b.disabled = true;
    var v = b.getAttribute('data-val');
    if (v === chosen) b.className = 'mt-mc-btn ' + (correct ? 'mt-correct' : 'mt-wrong');
    if (!correct && mtIsCorrect(v, t)) b.className = 'mt-mc-btn mt-correct';
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

function mtCheckOpen() {
  if (MTS.answered) return;
  var el = $mt('mt-open-inp');
  if (!el) return;
  var val = el.value.trim();
  if (!val) { el.focus(); return; }
  MTS.answered = true;
  var t = MTS.current;
  el.disabled = true;
  el.className = 'mt-text-input mt-textarea mt-inp-neutral';
  mtFinish(true, 1, 1, val, t, null, true);
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
  el.disabled = true;
  el.className = 'mt-text-input mt-textarea mt-mono ' + (correct ? 'mt-inp-correct' : 'mt-inp-wrong');
  var feedback = correct ? null : mtSmartFeedback(val, t);
  mtFinish(correct, keys.length, hits, val, t, feedback);
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
  el.className = 'mt-text-input mt-textarea ' + (ok ? 'mt-inp-correct' : 'mt-inp-wrong');
  var extra = null;
  if (!ok && missing.length) extra = 'Husk \u00e5 bruke: ' + missing.join(', ');
  mtFinish(ok, 1, ok ? 1 : 0, val, t, extra);
}

var _srDrag = -1;
function mtSrDragStart(ev, idx) { _srDrag = idx; ev.dataTransfer.effectAllowed = 'move'; }
function mtSrClick(el) {
  if (MTS.answered) return;
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

function mtIsCorrect(val, t) {
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
  var fasit = t.fasit || '';
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

function mtFinish(correct, maxPts, pts, chosen, t, extraMsg, isOpenType) {
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
  MTS.sessionXP += earnedXP;

  MTS.history.push({ task: t, correct: correct, points: pts, maxPts: maxPts, time: elapsed, isRetry: !!t._isRetry });

  var fb = $mt('mt-feedback');
  if (!fb) return;
  var isPartial = !correct && pts > 0;
  var cls = correct ? 'mt-fb-correct' : (isPartial ? 'mt-fb-partial' : 'mt-fb-wrong');
  fb.className = 'mt-feedback ' + cls;
  var html = '';
  if (isOpenType) {
    html += '<div class="mt-fb-heading">&#128221; Takk for svaret!</div>';
    if (t.eksempel_svak || t.eksempel_god) {
      html += '<div class="mt-fb-models">';
      if (t.eksempel_svak) html += '<div class="mt-fb-model mt-fb-model-weak"><div class="mt-fb-model-label">Kan bli bedre</div>' + mtEsc(t.eksempel_svak) + '</div>';
      if (t.eksempel_god) html += '<div class="mt-fb-model mt-fb-model-good"><div class="mt-fb-model-label">Sterk formulering</div>' + mtEsc(t.eksempel_god) + '</div>';
      html += '</div>';
    }
  } else if (correct) {
    html += '<div class="mt-fb-heading">&#10003; Riktig!</div>';
    if (maxPts > 1) html += '<div class="mt-fb-detail">' + mtEsc(String(chosen)) + '</div>';
    if (MTS.streak >= 5) html += '<div class="mt-fb-streak">&#128293; ' + MTS.streak + ' p\u00e5 rad!</div>';
    else if (MTS.streak === 3) html += '<div class="mt-fb-streak">&#11088; 3 p\u00e5 rad \u2013 flott!</div>';
  } else {
    html += '<div class="mt-fb-heading">&#10007; ' + (isPartial ? 'Delvis riktig' : 'Feil') + '</div>';
    if (maxPts > 1 && typeof chosen === 'string') html += '<div class="mt-fb-detail">' + mtEsc(chosen) + '</div>';
    if (!isPartial && t.fasit) html += '<div class="mt-fb-fasit">Riktig svar: <strong>' + mtEsc(t.fasit) + '</strong></div>';
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
  if (poengEl) poengEl.textContent = MTS.score + '/' + MTS.maxScore;
  if (retteEl) retteEl.textContent = String(rett);
  if (feilEl) feilEl.textContent = String(feil);

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
    '.mt-live-pill { font-size:.72rem; padding:2px 8px; border-radius:999px; background:#f3f1ec; color:var(--tmid,#4a4a46); border:1px solid #e6e1d7; }',
    '.mt-live-pill strong { color:var(--text,#1a1a18); font-weight:700; }',
    '.mt-live-bar { height:6px; border-radius:999px; background:#ebe6dc; overflow:hidden; }',
    '#mt-live-bar-fill { display:block; height:100%; width:0; background:linear-gradient(90deg,var(--mid,#2E6B4F),var(--accent,#C8832A)); transition:width .35s ease; }',
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
    '.mt-fb-rule { margin-top:.45rem; padding:.55rem .7rem; border:1px solid rgba(26,86,219,.22); background:linear-gradient(135deg,rgba(26,86,219,.08),rgba(26,86,219,.02)); border-radius:8px; font-size:.84rem; line-height:1.55; }',
    '.mt-fb-eks { margin-top:.4rem; padding:.5rem .7rem; border:1px solid rgba(199,146,46,.28); background:linear-gradient(135deg,rgba(255,244,214,.86),rgba(255,250,239,.96)); border-radius:8px; font-size:.83rem; line-height:1.55; font-family:"JetBrains Mono",monospace; }',
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mtInit);
} else {
  mtInit();
}

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
