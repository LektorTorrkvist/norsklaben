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

/* ─── DATA ───────────────────────────────────────── */
var MT_BANK = [

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
 q:'Rett dei fem særskrivingsfeila i teksten.',
 tekst:'Kvart år hamnar enorme mengder hav plast i sjøen. Sjø dyr som kval og sel set seg fast i plast bitar. Forskarar frå Hav forskings instituttet åtvarar om problemet.',
 errors:{'hav plast':'havplast','Sjø dyr':'Sjødyr','plast bitar':'plastbitar','Hav forskings instituttet':'Havforskingsinstituttet'},
 fasit:'havplast · Sjødyr · plastbitar · Havforskingsinstituttet',
 regel:'Samansette ord skriv ein alltid i eitt på norsk. Ingen mellomrom mellom ledda.',
 eks:'havplast, sjødyr, plastbitar, Havforskingsinstituttet'},

{kat:'samansett',kat_label:'Samansette ord',type:'fix',vanske:'medium',
 q:'Rett dei fire særskrivingsfeila i elevteksten.',
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
  {pre:'Katten',alt:['sover','sovver'],fasit:'sover',post:'i sofaen.'},
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
 q:'Rett teiknsettinga i teksten (3 feil).',
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
 fasit:'adverb',fasit_v:['adverb'],
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
 eks:'Rett: «Ho fekk gode karakterar fordi ho jobba hardt.» Kontrast: «… dårlege trass i at ho jobba hardt.»'}

]; // end MT_BANK
if (typeof window !== 'undefined') window.MT_BANK = MT_BANK;

/* ─── STATE ──────────────────────────────────────── */
var MTS = {
  pool: [],           // tilgjengeleg for dynamisk plukking
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

function mtLsGet() {
  try { return JSON.parse(localStorage.getItem(MT_LS_KEY)) || {}; }
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
  var pool = MT_BANK.filter(function (t) { return t.id && ids[t.id]; });
  /* Fallback: match på kategori + vanske */
  if (!pool.length) {
    var katSet = {};
    logg.forEach(function (e) { katSet[e.kat] = true; });
    pool = MT_BANK.filter(function (t) { return katSet[t.kat]; });
  }
  if (!pool.length) { alert('Fann ikkje oppgåver som matchlar feilloggen din.'); return; }
  pool = mtShuffle(pool);
  var count = Math.min(pool.length, 10);

  MTS.pool = pool;
  MTS.served = 0;
  MTS.targetCount = count;
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
  MTS.level = 'adaptiv';
  MTS.selectedCats = Object.keys(ids).length ? [] : [];
  MTS.active = true;
  MTS.showRule = false;
  MTS.sessionXP = 0;

  var win = $mt('nl-ad-win');
  var run = $mt('nl-ad-run');
  var summary = $mt('nl-ad-summary');
  var body = $mt('nl-ad-win-body');
  var actions = $mt('nl-ad-actions');
  if (win) win.hidden = false;
  if (run) run.hidden = false;
  if (summary) summary.hidden = true;
  if (body) body.innerHTML = '';
  if (actions) actions.style.display = '';

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

  var pool = MT_BANK.filter(function (t) { return valgte.indexOf(t.kat) !== -1; });
  if (level !== 'adaptiv') pool = pool.filter(function (t) { return t.vanske === level; });
  pool = mtShuffle(pool);
  if (!pool.length) { alert('Ingen oppgåver passar vala dine.'); return; }
  if (count > pool.length) count = pool.length;

  MTS.pool = pool;
  MTS.served = 0;
  MTS.targetCount = count;
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
  MTS.level = level;
  MTS.selectedCats = valgte;
  MTS.active = true;
  MTS.showRule = false;
  MTS.sessionXP = 0;

  var win = $mt('nl-ad-win');
  var run = $mt('nl-ad-run');
  var summary = $mt('nl-ad-summary');
  var body = $mt('nl-ad-win-body');
  var actions = $mt('nl-ad-actions');
  if (win) win.hidden = false;
  if (run) run.hidden = false;
  if (summary) summary.hidden = true;
  if (body) body.innerHTML = '';
  if (actions) actions.style.display = '';

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
  var p = $mt('nl-ad-progress');
  var bar = $mt('nl-ad-bar-fill');
  var sc = $mt('nl-ad-score-val');
  if (p) p.textContent = 'Oppgåve ' + Math.min(done + 1, total) + ' av ' + total;
  if (bar) bar.style.width = Math.min(pct, 100) + '%';
  if (sc) sc.textContent = String(MTS.score);

  var liveP = $mt('mt-live-progress');
  var liveBar = $mt('mt-live-bar-fill');
  var liveScore = $mt('mt-live-score');
  var liveXp = $mt('mt-live-xp');
  var liveStreak = $mt('mt-live-streak');
  if (liveP) liveP.textContent = 'Oppgåve ' + Math.min(done + 1, total) + ' av ' + total;
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

  body.innerHTML =
    '<div class="mt-card">' +
      '<div class="mt-live">' +
        '<div class="mt-live-top">' +
          '<div class="mt-live-progress" id="mt-live-progress">Oppgåve 1 av 1</div>' +
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
  /* Open-svar er alltid «rett» – gjev poeng for innsats */
  mtFinish(true, 1, 1, val, t, null, true);
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
  el.disabled = true;
  el.className = 'mt-text-input mt-textarea mt-mono ' + (correct ? 'mt-inp-correct' : 'mt-inp-wrong');
  var feedback = correct ? null : mtSmartFeedback(val, t);
  mtFinish(correct, keys.length, hits, val, t, feedback);
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

  /* Retry-kø: legg til ved feil (ikkje om det allereie er ein retry) */
  if (!correct && !t._isRetry) {
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
  MTS.sessionXP += earnedXP;

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
  if (poengEl) poengEl.textContent = MTS.score + '/' + MTS.maxScore;
  if (retteEl) retteEl.textContent = String(rett);
  if (feilEl) feilEl.textContent = String(feil);

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
  var run = $mt('nl-ad-run');
  var actions = $mt('nl-ad-actions');
  var body = $mt('nl-ad-win-body');
  if (summary) summary.hidden = false;
  if (run) {} /* la stå for visuell kontekst */
  if (actions) actions.style.display = 'none';
  if (body) body.innerHTML = '';

  /* Oppdater UI */
  var p = $mt('nl-ad-progress');
  var sc = $mt('nl-ad-score-val');
  var bar = $mt('nl-ad-bar-fill');
  if (p) p.textContent = 'Økt fullført';
  if (sc) sc.textContent = String(MTS.score);
  if (bar) bar.style.width = '100%';

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
    '.mt-fb-rule { margin-top:.4rem; padding:.4rem .6rem; border-left:3px solid #4a90d9; background:#eef5fc; border-radius:0 6px 6px 0; font-size:.84rem; line-height:1.5; }',
    '.mt-fb-eks { margin-top:.35rem; padding:.35rem .6rem; border-left:3px solid #d4a017; background:#fdfaf0; border-radius:0 6px 6px 0; font-size:.83rem; line-height:1.5; font-family:"JetBrains Mono",monospace; }',
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
  // Remove legacy adaptive chrome so only oppgavebank UI is shown in the modal.
  var legacyRun = $mt('nl-ad-run');
  if (legacyRun && legacyRun.parentNode) legacyRun.parentNode.removeChild(legacyRun);
  var legacyFeedback = $mt('nl-ad-feedback');
  if (legacyFeedback && legacyFeedback.parentNode) legacyFeedback.parentNode.removeChild(legacyFeedback);

  /* Bygg kategoriknappar frå MT_BANK dersom #nl-ad-cats er tomt */
  var catsWrap = $mt('nl-ad-cats');
  if (catsWrap && !catsWrap.querySelector('.adp-cat') && MT_BANK.length) {
    var catGroups = [
      { title: 'Rettskriving', cats: ['og_aa','samansett','dobbel_konsonant','kj_skj'] },
      { title: 'Grammatikk',   cats: ['ordklassar','setningsbygging','bindeord','teiknsetting'] },
      { title: 'Tekst og skriving', cats: ['tekststruktur','kjeldebruk','oppgavetolking','spraak_stil','aarsak_samanheng'] }
    ];
    var labelMap = {};
    MT_BANK.forEach(function (t) {
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
}

/* Auto-init ved DOMContentLoaded */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mtInit);
} else {
  mtInit();
}

/* Eksporter for inline onclick */
window.mtStart = mtStart;
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
