/* ══════════════════════════════════════════════════════
   MAD LIBS  –  V1 engine (ported to V2)
══════════════════════════════════════════════════════ */

const ML_HUMORTYPAR = {
  barnehage:    { label: 'Barnehage',    alder: '3–6 år' },
  '1klasse':    { label: '1.klasse',     alder: '6 år' },
  '5klasse':    { label: '5.klasse',     alder: '10 år' },
  ungdomsskule: { label: 'Ungdomsskule', alder: '13–16 år' }
};

const ML_HISTORIER = [
  /* ── Original 9 ── */
  {
    tittel: 'Skuledag på månen',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (stad)',    ph:'t.d. biblioteket'},
      {id:'ml1', lbl:'Eit adjektiv',             ph:'t.d. enorm'},
      {id:'ml2', lbl:'Eit verb i preteritum',    ph:'t.d. hoppa'},
      {id:'ml3', lbl:'Eit substantiv (dyr)',     ph:'t.d. kamel'},
      {id:'ml4', lbl:'Eit adverb',               ph:'t.d. stille'},
      {id:'ml5', lbl:'Eit adjektiv',             ph:'t.d. rosenraud'},
      {id:'ml6', lbl:'Eit verb i infinitiv',     ph:'t.d. danse'},
      {id:'ml7', lbl:'Eit substantiv (mat)',     ph:'t.d. spagetti'},
    ],
    mal: (v)=>`Ein ${v[1]} dag på månen byrja då læraren vår ${v[2]} inn i ${v[0]} ridande på ein ${v[3]}. Alle sat ${v[4]} og stirra. «God morgon!» ropte læraren ${v[4]}, og huda hennar var ${v[5]}. «I dag skal vi lære å ${v[6]}!» sa ho, og la fram ein tallerken med ${v[7]}. Ingen visste kva som skjedde, men alle lo høgt.`
  },
  {
    tittel: 'Helten og draken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn (person)',        ph:'t.d. Sigrid'},
      {id:'ml1', lbl:'Eit adjektiv',             ph:'t.d. modige'},
      {id:'ml2', lbl:'Eit substantiv (ting)',    ph:'t.d. paraply'},
      {id:'ml3', lbl:'Eit verb i preteritum',    ph:'t.d. kviskra'},
      {id:'ml4', lbl:'Eit adjektiv',             ph:'t.d. grøn'},
      {id:'ml5', lbl:'Eit substantiv (stad)',    ph:'t.d. kjøkkenet'},
      {id:'ml6', lbl:'Eit adverb',               ph:'t.d. sakte'},
      {id:'ml7', lbl:'Eit verb i infinitiv',     ph:'t.d. synge'},
    ],
    mal: (v)=>`${v[0]}, den ${v[1]} helten, stod med ein ${v[2]} i handa. Draken ${v[3]} med si ${v[4]} røyst: «Gå bort frå ${v[5]}!» Men ${v[0]} gjekk ${v[6]} nærare og byrja å ${v[7]}. Draken vart så overraska at han berre flaut vekk.`
  },
  {
    tittel: 'Dagdrøm i norsktimen',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit verb i preteritum',         ph:'t.d. drøymde'},
      {id:'ml1', lbl:'Eit adjektiv',                  ph:'t.d. mystisk'},
      {id:'ml2', lbl:'Eit substantiv (dyr, fleirtal)',ph:'t.d. pingvinar'},
      {id:'ml3', lbl:'Eit adverb',                    ph:'t.d. ivrig'},
      {id:'ml4', lbl:'Eit substantiv (ting)',         ph:'t.d. fjernkontroll'},
      {id:'ml5', lbl:'Eit verb i preteritum',         ph:'t.d. eksploderte'},
      {id:'ml6', lbl:'Eit adjektiv',                  ph:'t.d. forvirra'},
      {id:'ml7', lbl:'Eit substantiv (mat)',          ph:'t.d. vaflar'},
    ],
    mal: (v)=>`Midt i norsktimen ${v[0]} eg om eit ${v[1]} land der ${v[2]} sat og ${v[3]} peika med ein ${v[4]}. Plutseleg ${v[5]} alt, og eg vakna opp, heilt ${v[6]}, med ansiktet fullt av ${v[7]}.`
  },
  {
    tittel: 'Skuleturen til Paris',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting, eintal)',  ph:'t.d. koffert'},
      {id:'ml1', lbl:'Eit adjektiv',                   ph:'t.d. enorm'},
      {id:'ml2', lbl:'Eit verb i preteritum',          ph:'t.d. gret'},
      {id:'ml3', lbl:'Eit substantiv (dyr, fleirtal)', ph:'t.d. pingvinar'},
      {id:'ml4', lbl:'Eit adverb',                     ph:'t.d. roleg'},
      {id:'ml5', lbl:'Eit tal (mellom 1-100)',          ph:'t.d. 47'},
      {id:'ml6', lbl:'Eit verb i infinitiv',           ph:'t.d. strikke'},
      {id:'ml7', lbl:'Eit substantiv (mat)',           ph:'t.d. lutefisk'},
    ],
    mal: (v)=>`Då klassa landa i Paris, viste det seg at ${v[0]} var gøymd i ein ${v[1]} koffert. Læraren ${v[2]} då ho opna den. Inne sat det ${v[5]} ${v[3]} som ${v[4]} heldt på med å ${v[6]}. Dei ville berre ha ${v[7]}.`
  },
  {
    tittel: 'Prøvedagen',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit verb i preteritum',    ph:'t.d. hoppa'},
      {id:'ml1', lbl:'Eit adjektiv',             ph:'t.d. glinsande'},
      {id:'ml2', lbl:'Eit substantiv (ting)',    ph:'t.d. brødskive'},
      {id:'ml3', lbl:'Eit tal (høgt)',           ph:'t.d. 9000'},
      {id:'ml4', lbl:'Eit verb i infinitiv',     ph:'t.d. nynne'},
      {id:'ml5', lbl:'Eit adjektiv',             ph:'t.d. forvirra'},
      {id:'ml6', lbl:'Eit substantiv (person)',  ph:'t.d. vikarlæraren'},
      {id:'ml7', lbl:'Eit adverb',               ph:'t.d. desperat'},
    ],
    mal: (v)=>`Prøva starta kl. 08.15. Alle ${v[0]} då ${v[6]} kom inn med ein ${v[1]} ${v[2]} og ${v[3]} sider med oppgåver. Elevane sat ${v[5]} og byrja ${v[7]} å ${v[4]}.`
  },
  {
    tittel: 'Straumbrotet',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',                    ph:'t.d. mystisk'},
      {id:'ml1', lbl:'Eit substantiv (stad)',           ph:'t.d. gymsalen'},
      {id:'ml2', lbl:'Eit verb i preteritum',           ph:'t.d. kviskra'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. joggesko'},
      {id:'ml4', lbl:'Eit adverb',                      ph:'t.d. febrilsk'},
      {id:'ml5', lbl:'Eit verb i infinitiv',            ph:'t.d. kvesse'},
      {id:'ml6', lbl:'Eit tal',                         ph:'t.d. 12'},
      {id:'ml7', lbl:'Eit adjektiv',                    ph:'t.d. triumferande'},
    ],
    mal: (v)=>`Det kom eit ${v[0]} straumbrott i ${v[1]}. ${v[2]} lyden spreidde seg då ${v[6]} ${v[3]} begynte å ${v[5]} seg ${v[4]}. Etter ${v[6]} minutt var alt normalt – bortsett frå rektoren som stod ${v[7]} på taket.`
  },
  {
    tittel: 'Roboten',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn på ein robot',    ph:'t.d. Robo-Ola'},
      {id:'ml1', lbl:'Eit adjektiv',             ph:'t.d. rugglete'},
      {id:'ml2', lbl:'Eit substantiv (ting)',    ph:'t.d. viskelær'},
      {id:'ml3', lbl:'Eit verb i infinitiv',     ph:'t.d. breakdanse'},
      {id:'ml4', lbl:'Eit tal',                  ph:'t.d. 3'},
      {id:'ml5', lbl:'Eit adverb',               ph:'t.d. engsteleg'},
      {id:'ml6', lbl:'Eit substantiv (dyr)',     ph:'t.d. alpakka'},
      {id:'ml7', lbl:'Eit verb i preteritum',    ph:'t.d. rømdde'},
    ],
    mal: (v)=>`Skulen kjøpte ein ${v[1]} robot som heitte ${v[0]}. Første dag gjekk ${v[0]} rett til tavla og byrja å ${v[3]} med ${v[2]}. Etter ${v[4]} minutt ${v[7]} ein ${v[6]} ${v[5]} ut av klasserommet.`
  },
  {
    tittel: 'Dei mystiske leksene',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit verb i presens',                ph:'t.d. søv'},
      {id:'ml1', lbl:'Eit adjektiv',                      ph:'t.d. glinsande'},
      {id:'ml2', lbl:'Eit substantiv (mat, fleirtal)',    ph:'t.d. kjøttkaker'},
      {id:'ml3', lbl:'Eit tal (mellom 1-20)',             ph:'t.d. 7'},
      {id:'ml4', lbl:'Eit verb i infinitiv',              ph:'t.d. klatre'},
      {id:'ml5', lbl:'Eit adverb',                        ph:'t.d. sakte'},
      {id:'ml6', lbl:'Eit substantiv (person)',           ph:'t.d. grandonkelen'},
      {id:'ml7', lbl:'Eit adjektiv',                      ph:'t.d. nøgd'},
    ],
    mal: (v)=>`${v[6]} ${v[0]} aldri på skuledagar, for leksene skriv seg sjølv. ${v[3]} ${v[2]} og ein ${v[1]} penn er alt ein treng. Etter ${v[3]} minutt er alt klart, og eleven er ${v[7]} nok til å ${v[4]} ${v[5]} ut vindauga.`
  },
  {
    tittel: 'Bursdag i dyrehagen',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Ola'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. tullete'},
      {id:'ml2', lbl:'Eit substantiv (dyr)',  ph:'t.d. giraff'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. dansa'},
      {id:'ml4', lbl:'Eit substantiv (mat)',  ph:'t.d. gelé'},
      {id:'ml5', lbl:'Eit adverb',            ph:'t.d. sakte'},
      {id:'ml6', lbl:'Eit adjektiv',          ph:'t.d. lilla'},
      {id:'ml7', lbl:'Eit verb i infinitiv',  ph:'t.d. hoppe'},
    ],
    mal: (v)=>`${v[0]} hadde bursdag i dag, og ein ${v[1]} ${v[2]} ${v[3]} rett inn med ei kake av ${v[4]}. Alle klappa ${v[5]}, medan den ${v[6]} løva prøvde å ${v[7]} på bordet.`
  },
  /* ── Utvida samling ── */
  {
    tittel: 'Pannekake-raketten',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (mat)',  ph:'t.d. pannekake'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. klissete'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. susa'},
      {id:'ml3', lbl:'Eit substantiv (stad)', ph:'t.d. sandkassa'},
      {id:'ml4', lbl:'Eit tal',               ph:'t.d. 4'},
      {id:'ml5', lbl:'Eit dyr',               ph:'t.d. mus'},
      {id:'ml6', lbl:'Eit adverb',            ph:'t.d. fort'},
      {id:'ml7', lbl:'Eit verb i infinitiv',  ph:'t.d. synge'},
    ],
    mal: (v)=>`Ein ${v[1]} ${v[0]} ${v[2]} opp frå ${v[3]} som ein rakett. Etter ${v[4]} sekund landa han på hovudet til ein ${v[5]}, som byrja ${v[6]} å ${v[7]}.`
  },
  {
    tittel: 'Den snakkande matboksen',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Mina'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. rar'},
      {id:'ml2', lbl:'Eit substantiv (mat)',  ph:'t.d. banan'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. kviskra'},
      {id:'ml4', lbl:'Eit substantiv (ting)', ph:'t.d. blyant'},
      {id:'ml5', lbl:'Eit adverb',            ph:'t.d. høgt'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. rulle'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. fnisete'},
    ],
    mal: (v)=>`Då ${v[0]} opna matboksen sin, låg det ein ${v[1]} ${v[2]} inni som ${v[3]}: «Eg vil ha ein ${v[4]}!» Heile klassa lo ${v[5]}, og matboksen byrja å ${v[6]} over golvet som om han var heilt ${v[7]}.`
  },
  {
    tittel: 'Gymtime med dinosaurar',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',          ph:'t.d. svett'},
      {id:'ml1', lbl:'Eit dyr',               ph:'t.d. dinosaur'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. snubla'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. rockering'},
      {id:'ml4', lbl:'Eit adverb',            ph:'t.d. vilt'},
      {id:'ml5', lbl:'Eit namn',              ph:'t.d. Emma'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. brøle'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. mjuk'},
    ],
    mal: (v)=>`I gymtimen kom ein ${v[0]} ${v[1]} inn døra og ${v[2]} over ein ${v[3]}. ${v[5]} lo ${v[4]} og prøvde å ${v[6]} tilbake. Då sette dinosauren seg på den ${v[7]} matta og sovna.`
  },
  {
    tittel: 'Fotballkampen som gjekk skeis',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting)',   ph:'t.d. sokk'},
      {id:'ml1', lbl:'Eit adjektiv',            ph:'t.d. slimete'},
      {id:'ml2', lbl:'Eit verb i preteritum',   ph:'t.d. føyk'},
      {id:'ml3', lbl:'Eit substantiv (person)', ph:'t.d. vaktmeisteren'},
      {id:'ml4', lbl:'Eit adverb',              ph:'t.d. dramatisk'},
      {id:'ml5', lbl:'Eit tal',                 ph:'t.d. 11'},
      {id:'ml6', lbl:'Eit verb i infinitiv',    ph:'t.d. juble'},
      {id:'ml7', lbl:'Eit adjektiv',            ph:'t.d. forfjamsa'},
    ],
    mal: (v)=>`Under finalen vart ballen bytt ut med ein ${v[1]} ${v[0]}. Han ${v[2]} rett i panna på ${v[3]}, som ${v[4]} blåste av kampen etter ${v[5]} sekund. Publikum byrja å ${v[6]}, medan dommaren såg heilt ${v[7]} ut.`
  },
  {
    tittel: 'Den rare vikaren',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Sofie'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. mystisk'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. banjo'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. kvein'},
      {id:'ml4', lbl:'Eit adverb',            ph:'t.d. høfleg'},
      {id:'ml5', lbl:'Eit substantiv (dyr)',  ph:'t.d. hamster'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. rappe'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. blank'},
    ],
    mal: (v)=>`Vikaren presenterte seg som ${v[0]} den ${v[1]} og sette ein ${v[2]} på kateteret. Så ${v[3]} ho at alle måtte sitje ${v[4]} og sjå på medan ein ${v[5]} lærte klassa å ${v[6]}. På tavla stod det berre eitt ord med ${v[7]} tusj: «Kvifor?»`
  },
  {
    tittel: 'Skuleavslutninga',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (mat)',  ph:'t.d. muffins'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. skeiv'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. velta'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. mikrofon'},
      {id:'ml4', lbl:'Eit adverb',            ph:'t.d. pinleg'},
      {id:'ml5', lbl:'Eit tal',               ph:'t.d. 28'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. viske'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. skjelven'},
    ],
    mal: (v)=>`På skuleavslutninga skulle alle få ${v[0]}, men bordet ${v[2]} idet rektor tok opp ein ${v[1]} ${v[3]}. Etter ${v[5]} sekund vart det ${v[4]} stille, før heile klassa byrja å ${v[6]}. Rektoren stod igjen med eit ${v[7]} smil.`
  },
  {
    tittel: 'Kantinemysteriet',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',            ph:'t.d. mistenkeleg'},
      {id:'ml1', lbl:'Eit substantiv (mat)',    ph:'t.d. toast'},
      {id:'ml2', lbl:'Eit verb i preteritum',   ph:'t.d. forsvann'},
      {id:'ml3', lbl:'Eit substantiv (person)', ph:'t.d. elevrådsleiaren'},
      {id:'ml4', lbl:'Eit adverb',              ph:'t.d. diskret'},
      {id:'ml5', lbl:'Eit verb i infinitiv',    ph:'t.d. skulde'},
      {id:'ml6', lbl:'Eit substantiv (ting)',   ph:'t.d. hettegenser'},
      {id:'ml7', lbl:'Eit adjektiv',            ph:'t.d. suspekt'},
    ],
    mal: (v)=>`Kvar dag klokka 11.12 ${v[2]} ein ${v[0]} ${v[1]} frå kantina. Til slutt byrja ${v[3]} ${v[4]} å ${v[5]} alle som gjekk med ${v[6]}. Det gjorde stemninga ganske ${v[7]}.`
  },
  {
    tittel: 'Klasseturen med drama',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (stad)',   ph:'t.d. ferja'},
      {id:'ml1', lbl:'Eit adjektiv',            ph:'t.d. klein'},
      {id:'ml2', lbl:'Eit verb i preteritum',   ph:'t.d. sklei'},
      {id:'ml3', lbl:'Eit substantiv (ting)',   ph:'t.d. energidrikk'},
      {id:'ml4', lbl:'Eit adverb',              ph:'t.d. overdrivent'},
      {id:'ml5', lbl:'Eit verb i infinitiv',    ph:'t.d. forklare'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. kontaktlæraren'},
      {id:'ml7', lbl:'Eit adjektiv',            ph:'t.d. flau'},
    ],
    mal: (v)=>`På klasseturen til ${v[0]} gjekk alt fint heilt til nokon ${v[2]} i ein ${v[1]} sølepytt med ein ${v[3]} i handa. Alle lo ${v[4]}, medan ${v[6]} prøvde å ${v[5]} at dette eigentleg var heilt normalt. Det var ingen som trudde på det, særleg ikkje den mest ${v[7]} eleven i klassa.`
  },
  {
    tittel: 'Den forheksa klassechatten',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',            ph:'t.d. hektisk'},
      {id:'ml1', lbl:'Eit substantiv (dyr)',    ph:'t.d. geit'},
      {id:'ml2', lbl:'Eit verb i preteritum',   ph:'t.d. dukka opp'},
      {id:'ml3', lbl:'Eit substantiv (ting)',   ph:'t.d. caps'},
      {id:'ml4', lbl:'Eit adverb',              ph:'t.d. desperat'},
      {id:'ml5', lbl:'Eit verb i infinitiv',    ph:'t.d. slette'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. norsklæraren'},
      {id:'ml7', lbl:'Eit adjektiv',            ph:'t.d. kaotisk'},
    ],
    mal: (v)=>`Klassechatten vart plutseleg ${v[0]} då eit bilete av ein ${v[1]} med ${v[3]} ${v[2]} i kvar einaste tråd. Alle prøvde ${v[4]} å ${v[5]} det, men så skreiv ${v[6]} berre: «Kven eig denne?» Etter det vart alt heilt ${v[7]}.`
  },
  {
    tittel: 'Munnleg framføring gone wrong',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting)',   ph:'t.d. klikker'},
      {id:'ml1', lbl:'Eit adjektiv',            ph:'t.d. desperat'},
      {id:'ml2', lbl:'Eit verb i preteritum',   ph:'t.d. pep'},
      {id:'ml3', lbl:'Eit substantiv (dyr)',    ph:'t.d. måke'},
      {id:'ml4', lbl:'Eit adverb',              ph:'t.d. kunstig'},
      {id:'ml5', lbl:'Eit verb i infinitiv',    ph:'t.d. imponere'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. sensor'},
      {id:'ml7', lbl:'Eit adjektiv',            ph:'t.d. mislukka'},
    ],
    mal: (v)=>`Då framføringa starta, nekta ${v[0]} å virke, prosjektoren ${v[2]}, og første lysbiletet viste ein ${v[1]} ${v[3]}. Presentatøren prøvde ${v[4]} å ${v[5]} ${v[6]}, men heile opplegget fekk ein ganske ${v[7]} avslutning.`
  },
  /* ── 10 nye historier ── */
  {
    tittel: 'Trollet som ville leike',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn',               ph:'t.d. Nora'},
      {id:'ml1', lbl:'Eit adjektiv',           ph:'t.d. bustete'},
      {id:'ml2', lbl:'Eit substantiv (mat)',   ph:'t.d. potetmos'},
      {id:'ml3', lbl:'Eit verb i preteritum',  ph:'t.d. trilla'},
      {id:'ml4', lbl:'Eit adjektiv (farge)',   ph:'t.d. lilla'},
      {id:'ml5', lbl:'Eit leikety',            ph:'t.d. sparkesykkel'},
      {id:'ml6', lbl:'Eit adverb',             ph:'t.d. ivrig'},
      {id:'ml7', lbl:'Eit verb i infinitiv',   ph:'t.d. klappe'},
    ],
    mal: (v)=>`Under senga til ${v[0]} budde eit ${v[1]} troll som berre åt ${v[2]}. Ein dag ${v[3]} trollet ut og peika på den ${v[4]} ${v[5]}. «Eg vil også ${v[7]}!» ropte trollet ${v[6]}.`
  },
  {
    tittel: 'Superkappa til Knut',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Knut'},
      {id:'ml1', lbl:'Eit adjektiv (farge)',  ph:'t.d. raud'},
      {id:'ml2', lbl:'Eit substantiv (dyr)',  ph:'t.d. katt'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. flaug'},
      {id:'ml4', lbl:'Eit substantiv (stad)', ph:'t.d. leikerommet'},
      {id:'ml5', lbl:'Eit adverb',            ph:'t.d. superhurtig'},
      {id:'ml6', lbl:'Eit substantiv (mat)',  ph:'t.d. eplejuice'},
      {id:'ml7', lbl:'Eit verb i infinitiv',  ph:'t.d. redde'},
    ],
    mal: (v)=>`${v[0]} tok på seg den ${v[1]} superkappa og ${v[3]} rundt i ${v[4]}. Ein ${v[2]} sat fast i gardinene og ropa. ${v[0]} kom ${v[5]}, drakk ein slurk ${v[6]}, og klarte å ${v[7]} ${v[2]}en.`
  },
  {
    tittel: 'Isbjørnen i barnehagen',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',          ph:'t.d. mjuk'},
      {id:'ml1', lbl:'Eit verb i preteritum', ph:'t.d. stabba'},
      {id:'ml2', lbl:'Eit leikety',           ph:'t.d. duplo'},
      {id:'ml3', lbl:'Eit adverb',            ph:'t.d. forsiktig'},
      {id:'ml4', lbl:'Eit substantiv (mat)',  ph:'t.d. kakao'},
      {id:'ml5', lbl:'Eit tal',               ph:'t.d. 3'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. sove'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. snill'},
    ],
    mal: (v)=>`Ein dag kom ein ${v[0]} isbjørn inn i barnehagen og ${v[1]} bort til ${v[2]}. Alle barna lo ${v[3]} og rekte han ${v[4]}. Han drakk ${v[5]} koppar og bestemte seg for å ${v[6]} der for alltid. Han var eigentleg veldig ${v[7]}.`
  },
  {
    tittel: 'Spøkelset i skulesekken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Lars'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. gjennomsiktig'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. pennal'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. hylte'},
      {id:'ml4', lbl:'Eit adverb',            ph:'t.d. skummelt'},
      {id:'ml5', lbl:'Eit substantiv (mat)',  ph:'t.d. knekkebrød'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. rope'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. nøgd'},
    ],
    mal: (v)=>`${v[0]} opna skulesekken og fann eit ${v[1]} spøkelse som sat oppå ${v[2]}. Det ${v[3]} ${v[4]}. «Vil du ha ${v[5]}?» spurde ${v[0]}. Spøkelset nikka, åt opp alt, og forsvann med eit ${v[7]} smil.`
  },
  {
    tittel: 'Den blinkande fisken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv (farge)',  ph:'t.d. blå'},
      {id:'ml1', lbl:'Eit verb i preteritum', ph:'t.d. spruta'},
      {id:'ml2', lbl:'Eit substantiv (stad)', ph:'t.d. klasserommet'},
      {id:'ml3', lbl:'Eit adverb',            ph:'t.d. vilt'},
      {id:'ml4', lbl:'Eit namn',              ph:'t.d. Tiril'},
      {id:'ml5', lbl:'Eit substantiv (mat)',  ph:'t.d. sjokolade'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. symje'},
      {id:'ml7', lbl:'Eit adjektiv',          ph:'t.d. vått'},
    ],
    mal: (v)=>`Ein ${v[0]} fisk ${v[1]} inn i ${v[2]} og byrja ${v[3]} å ${v[6]} rundt pulten til ${v[4]}. Alt vart ${v[7]}, men ingen brydde seg fordi fisken delte ut ${v[5]} til alle saman.`
  },
  {
    tittel: 'Nattevakta på biblioteket',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',                    ph:'t.d. støvete'},
      {id:'ml1', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. ordbøker'},
      {id:'ml2', lbl:'Eit verb i preteritum',           ph:'t.d. snika'},
      {id:'ml3', lbl:'Eit adverb',                      ph:'t.d. mistenksomt'},
      {id:'ml4', lbl:'Eit substantiv (mat)',            ph:'t.d. nuggets'},
      {id:'ml5', lbl:'Eit tal',                         ph:'t.d. 13'},
      {id:'ml6', lbl:'Eit verb i infinitiv',            ph:'t.d. stave'},
      {id:'ml7', lbl:'Eit adjektiv',                    ph:'t.d. forfjamsa'},
    ],
    mal: (v)=>`Klokka 23.47 byrja dei ${v[0]} ${v[1]} å bevege seg. Dei ${v[2]} ${v[3]} rundt i biblioteket og leita etter ${v[4]}. For kvar dei fann eit stykke, lærte dei seg å ${v[6]} eit nytt ord. Vakta stod igjen heilt ${v[7]}.`
  },
  {
    tittel: 'Leksemaskina 3000',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn',              ph:'t.d. Tobias'},
      {id:'ml1', lbl:'Eit adjektiv',          ph:'t.d. skranglete'},
      {id:'ml2', lbl:'Eit substantiv (mat)',  ph:'t.d. riskrem'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. spydde'},
      {id:'ml4', lbl:'Eit substantiv (ting)', ph:'t.d. tannbørste'},
      {id:'ml5', lbl:'Eit tal',               ph:'t.d. 42'},
      {id:'ml6', lbl:'Eit verb i infinitiv',  ph:'t.d. levere'},
      {id:'ml7', lbl:'Eit adverb',            ph:'t.d. skamfullt'},
    ],
    mal: (v)=>`${v[0]} bygde Leksemaskina 3000 av ein ${v[1]} kasse og ein brukt ${v[4]}. Første prøvekøyring: maskinen ${v[3]} ut ${v[5]} ark med berre «${v[2]}» på kvar side. ${v[0]} måtte ${v[7]} ${v[6]} dei med eit vedlagt notat: «Maskinlaga.»`
  },
  {
    tittel: 'Kva skjer på lærarrommet?',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',                    ph:'t.d. kaotisk'},
      {id:'ml1', lbl:'Eit substantiv (mat)',            ph:'t.d. lefse'},
      {id:'ml2', lbl:'Eit verb i preteritum',           ph:'t.d. diskuterte'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. rettepennar'},
      {id:'ml4', lbl:'Eit adverb',                      ph:'t.d. intenst'},
      {id:'ml5', lbl:'Eit tal',                         ph:'t.d. 6'},
      {id:'ml6', lbl:'Eit verb i infinitiv',            ph:'t.d. fordele'},
      {id:'ml7', lbl:'Eit adjektiv',                    ph:'t.d. smilande'},
    ],
    mal: (v)=>`Tidleg ein måndag låg ${v[3]} overalt og stemninga var heilt ${v[0]}. ${v[5]} lærarar sat rundt bordet og ${v[2]} ${v[4]} om korleis dei best kunne ${v[6]} ${v[1]}. Då klassedøra opna seg, var alle ${v[7]}.`
  },
  {
    tittel: 'Gruppearbeidet',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv',                    ph:'t.d. ambisiøs'},
      {id:'ml1', lbl:'Eit substantiv (stad)',           ph:'t.d. kjellaren'},
      {id:'ml2', lbl:'Eit verb i preteritum',           ph:'t.d. krangla'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. Post-it-lappar'},
      {id:'ml4', lbl:'Eit adverb',                      ph:'t.d. heftig'},
      {id:'ml5', lbl:'Eit tal',                         ph:'t.d. 3'},
      {id:'ml6', lbl:'Eit verb i infinitiv',            ph:'t.d. presentere'},
      {id:'ml7', lbl:'Eit adjektiv',                    ph:'t.d. utmatta'},
    ],
    mal: (v)=>`Gruppa møttest i ${v[1]} med ein ${v[0]} plan. Dei ${v[2]} ${v[4]} om ${v[3]} i ${v[5]} timar og klarte aldri å ${v[6]} det ferdige resultatet. Alle gjekk heim ${v[7]}.`
  },
  {
    tittel: 'Karakterjakta',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (person)',          ph:'t.d. norsklæraren'},
      {id:'ml1', lbl:'Eit adjektiv',                     ph:'t.d. nervøs'},
      {id:'ml2', lbl:'Eit substantiv (mat, fleirtal)',   ph:'t.d. lefsar'},
      {id:'ml3', lbl:'Eit tal',                          ph:'t.d. 47'},
      {id:'ml4', lbl:'Eit adverb',                       ph:'t.d. stille'},
      {id:'ml5', lbl:'Eit verb i infinitiv',             ph:'t.d. bestikke'},
      {id:'ml6', lbl:'Eit substantiv (ting)',            ph:'t.d. blomsterbukett'},
      {id:'ml7', lbl:'Eit adjektiv',                     ph:'t.d. gjennomskoda'},
    ],
    mal: (v)=>`Eleven sat ${v[1]} utanfor kontoret til ${v[0]}, med ${v[3]} heimebakte ${v[2]} og ein ${v[6]} i sekken – eit forsøk på å ${v[5]} seg til betre karakter. ${v[0]} opna døra. Begge stirra ${v[4]} på kvarandre. Blikkene var like ${v[7]}.`
  },
];

/* ── State ── */
let _mlIdx = 0;
let _mlHumortype = 'ungdomsskule';

/* ── Runtime funksjonar ── */
function mlGetHistorierForHumortype() {
  if (_mlHumortype === 'alle') return ML_HISTORIER;
  return ML_HISTORIER.filter(h => h.humortype === _mlHumortype);
}

function mlGetAktivHistorie() {
  const historier = mlGetHistorierForHumortype();
  if (!historier.length) return null;
  if (!historier[_mlIdx]) _mlIdx = 0;
  return historier[_mlIdx];
}

function mlOppdaterMeta(h) {
  const meta = ML_HUMORTYPAR[h.humortype] || { label: h.humortype, alder: '' };
  const formMeta = document.getElementById('ml-current-meta');
  const resultMeta = document.getElementById('ml-result-meta');
  const heading = document.getElementById('ml-result-heading');
  const tekst = '<strong>' + h.tittel + '</strong><br>Humortype: ' + meta.label + ' · Passar best for ' + meta.alder;
  if (formMeta) formMeta.innerHTML = tekst;
  if (resultMeta) resultMeta.innerHTML = tekst;
  if (heading) heading.textContent = 'Her er historia di: ' + h.tittel;
  const sel = document.getElementById('ml-humortype');
  if (sel && _mlHumortype !== 'alle') sel.value = h.humortype;
}

function mlInit() {
  const h = mlGetAktivHistorie();
  const inp = document.getElementById('ml-inputs');
  if (!inp || !h) return;
  mlOppdaterMeta(h);
  inp.innerHTML = h.felt.map(f => `
    <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;color:#4a4a46;font-weight:500">
      ${f.lbl}
      <input id="${f.id}" type="text" autocomplete="off" spellcheck="false" placeholder="${f.ph}"
        style="border:1px solid #d0d8df;border-radius:8px;padding:8px 12px;font-size:14px;font-family:'Source Sans 3',sans-serif;color:#1a1a18;outline:none;transition:border-color 0.15s"
        onfocus="this.style.borderColor='#1a56db'" onblur="this.style.borderColor='#d0d8df'">
    </label>`).join('');
  document.getElementById('ml-result').style.display = 'none';
  document.getElementById('ml-form').style.display = 'block';
}

function mlLag() {
  const h = mlGetAktivHistorie();
  if (!h) return;
  const vals = h.felt.map(f => {
    const el = document.getElementById(f.id);
    return el && el.value.trim() ? el.value.trim() : '';
  });

  const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const markorar = h.felt.map((_, i) => '__ML_' + i + '__');
  const story = h.mal(markorar);
  let storyHtml = esc(story);
  markorar.forEach((m, i) => {
    const v = vals[i];
    const repl = v
      ? `<strong style="color:#1a56db;text-decoration:underline;text-decoration-style:dotted">${esc(v)}</strong>`
      : '<span style="color:#8a8a88;border-bottom:1px dotted #b9b9b6">____</span>';
    storyHtml = storyHtml.split(m).join(repl);
  });

  document.getElementById('ml-story').innerHTML = storyHtml;
  document.getElementById('ml-form').style.display = 'none';
  document.getElementById('ml-result').style.display = 'block';
  mlOppdaterMeta(h);
}

function mlReset() {
  mlInit();
}

function mlNyHistorie() {
  const historier = mlGetHistorierForHumortype();
  if (!historier.length) return;
  let next;
  do { next = Math.floor(Math.random() * historier.length); } while (next === _mlIdx && historier.length > 1);
  _mlIdx = next;
  mlInit();
}

function mlSetHumortype(value) {
  _mlHumortype = value;
  _mlIdx = 0;
  mlNyHistorie();
}

function mlPrøvLykken() {
  _mlHumortype = 'alle';
  const sel = document.getElementById('ml-humortype');
  if (sel) sel.value = 'ungdomsskule'; // reset visual to default
  _mlIdx = Math.floor(Math.random() * ML_HISTORIER.length);
  mlInit();
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('ml-humortype');
  if (sel && sel.value) _mlHumortype = sel.value;
  const historier = mlGetHistorierForHumortype();
  _mlIdx = historier.length ? Math.floor(Math.random() * historier.length) : 0;
  mlInit();
});
