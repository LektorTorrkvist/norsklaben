/* ══════════════════════════════════════════════════════
  MENGDETRENING – oppgåvebank + motor (importert fra V1)
══════════════════════════════════════════════════════ */
const MT_BANK = [

/* ── OG / Å (10) ── */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg rett ord: «Hun liker ___ danse.»',
 alt:['og','å'],fasit:'å',
 regel:'«Å» kommer foran et verb i infinitiv. Test: «det å danse» – ja → bruk «å».',
 eks:'Hun liker å danse. Han prøver å lese.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg rett ord: «Han et pizza ___ drikk brus.»',
 alt:['og','å'],fasit:'og',
 regel:'«Og» binder sammen to ord, ledd eller setninger. Test: bytt ut med «pluss» – gir det mening?',
 eks:'Han et pizza og drikk brus. Hun synger og danser.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: «Jeg prøver ___ lese mer.»',
 hint:'«Å» er et infinitivsmerke som kommer foran verb (å lese, å skrive). «Og» er et bindeord som binder sammen ledd og setninger.',
 fasit:'å',fasit_v:['å'],
 regel:'«Å» + infinitiv. «Prøver å lese» = rett.',
 eks:'Jeg prøver å lese. De forsøker å forstå.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Hva er rett? «Det er gøy ___ spele fotball.»',
 alt:['og spele','å spele'],fasit:'å spele',
 regel:'«Å» kommer foran infinitiv. Etter adjektiv/adverb + «er» kommer ofte «å + verb».',
 eks:'Det er gøy å spele. Det er viktig å øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn rett ord: «Katten ___ hunden liker hverandre.»',
 hint:'Test: kan du bytte ut med «pluss» og setningen gir fremdeles mening?',
 fasit:'og',fasit_v:['og'],
 regel:'«Og» binder sammen to subjekt.',
 eks:'Katten og hunden leker. Per og Kari er venner.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Hva er feil i denne setningen? «Hun ville og hjelpe, og rydde rommet.»',
 alt:['«og hjelpe» er feil – rett er «ville å hjelpe og rydde»','«og rydde» er feil – skal være «å rydde»','Begge «og» er rette','Setninga er helt uten feil'],
 fasit:'«og hjelpe» er feil – rett er «ville å hjelpe og rydde»',
 regel:'Etter modalverbet «ville» kommer infinitiv med «å»: «ville å hjelpe». To infinitiver kopla med «og»: «ville å hjelpe og rydde».',
 eks:'Hun ville å hjelpe og rydde rommet.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Det er viktig ___ ete frukost hver dag.»',
 hint:'Etter «Det er viktig» + blank kommer et verb. Hva form er det – infinitiv?',
 fasit:'å',fasit_v:['å'],
 regel:'«Det er viktig å …» – infinitivskonstruksjon med «å».',
 eks:'Det er viktig å sove nok. Det er lurt å øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskelig',
 q:'Hva av disse setningene er FEIL?',
 alt:['Jeg liker å lese og å skrive.','Jeg liker og lese og skrive.','Jeg liker å lese og skrive.','De ville hjelpe og rydde.'],
 fasit:'Jeg liker og lese og skrive.',
 fasit_v:['Jeg liker og lese og skrive.'],
 regel:'Etter «liker» kommer infinitiv med «å». «Og lese» er feil – det skal være «å lese». Merk: Både «Jeg liker å lese og skrive» og «Jeg liker å lese og å skrive» er riktige.',
 eks:'FEIL: «og lese» / RETT: «å lese». Både «å lese og skrive» og «å lese og å skrive» er normerte.'},



{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskelig',
 q:'Hva er ALLE feila i: «Jeg ville og hjelpe, og lære, og det var gøy og gjøre.»?',
 alt:['Alle tre skal være «å»','Bare «og hjelpe» er feil','«og det» er feil','Setningen er rett'],
 fasit:'Alle tre skal være «å»',
 regel:'Modalverb (ville) og adjektiv (gøy) styrer infinitiv med «å». Bare det midtre «og» (mellom hjelpe og lære) er et bindeord.',
 eks:'Jeg ville å hjelpe og å lære, og det var gøy å gjøre.'},

/* ── OG / Å – ekstra 15 (finn_feil · klikk_marker · drag_ord · drag_kolonne · open · mc · cloze) ── */

/* — finn_feil: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'lett',
 q:'Klikk på det ene ordet som er FEIL brukt i setningen.',
 tekst:'Læraren bad elevene og tenke over spørsmålet.',
 fasit_feil:['og'],
 regel:'Etter «bad» kommer infinitiv → infinitivsmerket er «å», ikke «og»: «bad elevene å tenke».',
 eks:'«bad noen å gjøre noe» – alltid «å + infinitiv» etter «be» eller «bad».'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'medium',
 q:'To ord er feil brukte. Klikk på begge.',
 tekst:'Hun hadde lyst og synge, å alle i klassen ville høyre henne.',
 fasit_feil:['og','å'],
 regel:'«Hadde lyst og synge» → feil; rett er «lyst TIL å synge». «Å alle» → «å» er ikke bindeord; rett er «og alle».',
 eks:'RETT: «Hun hadde lyst til å synge, og alle i klassen ville høyre henne.»'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'vanskelig',
 q:'To ord er feil brukte. Klikk på begge.',
 tekst:'Jeg tror det er svært viktig og forstå grammatikk, å jeg øver derfor hver dag.',
 fasit_feil:['og','å'],
 regel:'«Viktig og forstå» → «viktig Å forstå» (infinitiv). «Å jeg øver» → «OG jeg øver» (bindeord mellom to helsetninger).',
 eks:'RETT: «Det er viktig å forstå grammatikk, og jeg øver hver dag.»'},

/* — klikk_marker: helt ny type i hele banken — */
{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'lett',
 q:'Klikk på det eine ordet i teksten som er et infinitivsmerke («å»).',
 tekst:'Hun og venninna tok bussen og gikk inn i butikken for å handle.',
 maalordklasse:'å (infinitivsmerke)',
 fasit_ord:['å'],
 regel:'«For å handle» = infinitivsmerket «å» + verbet «handle» i infinitiv. De andre «og»-ene er bindeord som binder sammen ledd.',
 eks:'«for å handle, til å hjelpe, nok til å forstå» = infinitiv. «Hun og venninna, bussen og gikk» = bindeord.'},

{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'medium',
 q:'Klikk på det eine ordet i teksten som er et BINDEORD («og»).',
 tekst:'Hun prøvde å rydde, å skrive og å forstå alt på én gang.',
 maalordklasse:'og (bindeord)',
 fasit_ord:['og'],
 regel:'«Og» binder sammen de tre infinitivene: «å rydde, å skrive og å forstå». De tre «å»-ene er infinitivsmerke foran hvert verb.',
 eks:'Listeform: å rydde, å skrive og å forstå • Kortform (normert): å rydde, skrive og forstå'},

/* — drag_ord: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_ord',vanske:'middels',
 q:'Trykk ordene inn i rett rekkefølge – hvor hører «å» og «og» hjemme?',
 ord:['Hun','liker','å','lese','og','skrive'],
 fasit:'Hun liker å lese og skrive',
 regel:'«Liker å lese» = infinitiv etter «liker». «Og skrive» = koordinert infinitiv uten nytt «å» (normert kortform).',
 eks:'«Hun liker å lese og (å) skrive» – begge varianter er riktige.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_ord',vanske:'middels',
 q:'Trykk ordene inn i rett rekkefølge – sett «å» og «og» på rett plass.',
 ord:['Det','er','viktig','å','sove','nok,','og','det','vet','de','fleste'],
 fasit:'Det er viktig å sove nok, og det vet de fleste',
 regel:'«Viktig å sove» = infinitiv etter adjektiv. «Og det vet de fleste» = ny helsetning bundet sammen med bindeordet «og».',
 eks:'[Adjektiv] + å + [infinitiv]. Ny setning etter komma → og + [setning].'},

/* — drag_kolonne: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Hva setning bruker «å» som infinitivsmerke, og hva bruker «og» som bindeord?',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
   {tekst:'Hun liker å danse.',fasit:0},
   {tekst:'Katten og hunden leker.',fasit:1},
   {tekst:'Det er gøy å svømme.',fasit:0},
   {tekst:'Han er sterk og modig.',fasit:1},
   {tekst:'Jeg prøver å lese.',fasit:0},
   {tekst:'Hun syng og ler.',fasit:1},
 ],
 regel:'«Å» kommer foran et verb i infinitiv. «Og» binder sammen ord, ledd eller setninger.',
 eks:'å danse = infinitiv. katten og hunden = koordinasjon av subjekt.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Bruker uttrykket «å» (infinitivsmerke) eller «og» (bindeord)?',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
   {tekst:'Hun hadde lyst til å hjelpe.',fasit:0},
   {tekst:'både mat og drikke',fasit:1},
   {tekst:'Det er dumt å lyge.',fasit:0},
   {tekst:'sterk, klok og snill',fasit:1},
   {tekst:'nøye nok til å bestå',fasit:0},
   {tekst:'brød og smør',fasit:1},
   {tekst:'Hun lærte seg å symje.',fasit:0},
   {tekst:'sol og regn om hverandre',fasit:1},
 ],
 regel:'«Til å + infinitiv» og «nok til å + infinitiv» er faste infinitivskonstruksjonar. «Og» mellom substantiv og adjektiv er bindeord.',
 eks:'lyst til å hjelpe • nøye nok til å bestå • mat og drikke • sterk og klok'},

/* — sorter-oppgave i stedet for open — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Hva funksjon har «å» og «og» i hver av disse setningene?',
 kolonner:['Å (infinitivsmerke)','Og (bindeord)'],
 ord:[
   {tekst:'Jeg prøver å forstå reglane.',fasit:0},
   {tekst:'Katten og hunden leikar sammen.',fasit:1},
   {tekst:'Det er gøy å skrive.',fasit:0},
   {tekst:'Hun les og skriver hver dag.',fasit:1},
   {tekst:'Vi drog for å oppleve noe nytt.',fasit:0},
   {tekst:'Han åt pizza og drakk brus.',fasit:1},
 ],
 regel:'«Å» kommer foran infinitiv (å forstå, å skrive). «Og» binder sammen ledd eller setninger.',
 eks:'å forstå, å lese = infinitivsmerke • katten og hunden, les og skriver = bindeord'},

/* — mc: nye scenario inkl. modalverb-regel — */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Velg rett ord: «Vi reiste ___ oppleve noe nytt.»',
 alt:['for å','for og','å','og'],
 fasit:'for å',
 regel:'«For å + infinitiv» betyr «med det formålet å». «For og» finnes ikke som konstruksjon.',
 eks:'Vi reiste for å oppleve noe nytt. Hun sparer for å kjøpe sykkel.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Hva er rett? «Han ___ hjelpe til.»',
 alt:['vil å hjelpe','vil hjelpe','og hjelpe','ynskjer å ikke hjelpe'],
 fasit:'vil hjelpe',
 regel:'Etter modalverbene «vil», «kan», «skal», «bør», «må» kommer infinitiv UTEN «å»: «vil hjelpe», «kan gå», «skal komme».',
 eks:'FEIL: «kan å komme» / RETT: «kan komme». Sammenlign: «ønsker å komme» – «ønsker» er ikke modalverb → bruker «å».'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskelig',
 q:'Hva er FEIL?',
 alt:['Hun kan ikke å komme i morgon.','Hun kan ikke komme i morgon.','Hun klarer ikke å komme i morgon.','Hun er ikke i stand til å komme i morgon.'],
 fasit:'Hun kan ikke å komme i morgon.',
 regel:'«Kan» er modalverb → bare infinitiv UTEN «å»: «kan komme». «Klarer» og «er i stand til» er ikke modalverb → de styrer «å + infinitiv».',
 eks:'FEIL: «kan å + infinitiv». RETT: «kan + infinitiv». «klarer å», «prøver å», «ønsker å» = korrekt med «å».'},

/* — cloze: nye kontekstar — */
{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn rett ord: «Vi bestemte oss for ___ reise til fjells i helga.»',
 hint:'«Bestemte seg for» blir alltid følgt av «å + infinitiv».',
 fasit:'å',fasit_v:['å'],
 regel:'«Bestemte seg for å + infinitiv» er en fast konstruksjon. «For» er ikke bindeord her – det er en del av verbet «bestemme seg for».',
 eks:'bestemme seg for å gjøre noe • planlegge å gjøre noe • beslutte å gjøre noe'},


/* ── SAMANSETTE ORD (10) ── */
{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte?',
 alt:['sjokolade kake','sjokoladekake','sjokolate kake','sjokolat kake'],
 fasit:'sjokoladekake',
 regel:'Sammensatte ord skriver man SAMMEN i norsk. «Sjokolade» + «kake» = «sjokoladekake».',
 eks:'sjokoladekake, fotballbane, barneskule'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett (ett ord): «Han spelar på ___» (fotball + bane)',
 hint:'Slå sammen de to delene til ett ord – ingen mellomrom.',
 fasit:'fotballbane',fasit_v:['fotballbane'],
 regel:'«Fotball» + «bane» = «fotballbane» – ett ord.',
 eks:'fotballbane, basketballbane, sandvolleyballbane'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Hva skjer viss du skriver «lamme lår» i stedet for «lammelår»?',
 alt:['Det betyr lår fra lam (mat)','Det betyr lår som er lamme og kan trenge rullestol','Det er samme mening begge veier','Det betyr at lårene får lamunger'],
 fasit:'Det betyr lår som er lamme og kan trenge rullestol',
 regel:'Særskriving kan gi helt feil mening. «Lammelår» = mat. «Lamme lår» = paralyserte lår.',
 eks:'lammelår vs. lamme lår, tunfiskbitar vs. tunfisk biter'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett (ett ord): «Hun fekk en ___ av besteveninna» (kjempe + klem)',
 hint:'«Kjempe-» og «klem» – skriver de sammen til ett ord.',
 fasit:'kjempeklem',fasit_v:['kjempeklem'],
 regel:'«Kjempe-» som forleddd skriver en sammen med ordet det beskriver.',
 eks:'kjempeklem, kjempestor, kjempebra'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'medium',
 q:'Hva av disse er FEIL skrive?',
 alt:['barneskule','ungdoms skule','vidaregåande skule','folkehøgskule'],
 fasit:'ungdoms skule',
 regel:'«Ungdomsskule» er ett ord – ikke to. Mellomleddet «ungdoms-» kommer fra «ungdom».',
 eks:'barneskule, ungdomsskule, vidaregåande skule'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'medium',
 q:'Skriv rett (ett ord): «Vi et ___ til påske» (påske + middag)',
 hint:'«Påske» + «middag» sett sammen – høgtidsmat skriver en alltid i ett ord.',
 fasit:'påskemiddag',fasit_v:['påskemiddag'],
 regel:'Høgtidsmåltid skriver en sammen: julefrokost, påskemiddag, pinnekjøttmiddag.',
 eks:'julefrokost, påskemiddag, bursdagskake'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'medium',
 q:'«Ananas ringer» i stedet for «ananasringar» – hva betyr særskrivinga?',
 alt:['Ringar laget av ananas','Ananas med mobiltelefon? 🍍📱','Samme mening','Ei slags ringform til frukt'],
 fasit:'Ananas med mobiltelefon? 🍍📱',
 regel:'«Ringer» er presensform av «å ringe». Særskriving gjør «ananasringar» om til noe helt annet!',
 eks:'ananasringar (mat) vs. ananas ringer (ananas med mobiltelefon? 🍍📱)'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'medium',
 q:'Skriv rett (ett ord): «Hun er ___ i nynorsk» (kjempe + god)',
 hint:'«Kjempe-» skriver alltid sammen med adjektivet det forsterkar.',
 fasit:'kjempegod',fasit_v:['kjempegod'],
 regel:'«Kjempe-» som forsterkingsforleddd skriver alltid sammen med adjektivet.',
 eks:'kjempegod, kjempestor, kjempeflott, kjempefin'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'vanskelig',
 q:'Hva av disse trenger bindestrek?',
 alt:['barnetv','barneskule','barnehage','barnebidrag'],
 fasit:'barnetv',
 regel:'Bindestrek brukes mellom et norsk ord og ei forkorting/tal: barne-tv, mini-golf, 10-åring.',
 eks:'barne-tv, mini-golf, nrk-programmet, 8-klassing'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'vanskelig',
 q:'Skriv rett (ett ord): «Det er en ___ i dag» (sol + skin + dag)',
 hint:'Noen sammensetninger har et -s- mellom leddene (fugeform). Sol + skinn + dag → ?',
 fasit:'solskinnsdag',fasit_v:['solskinnsdag','solskinsdag'],
 regel:'Noen sammensetninger har fugeform med -s-: solskinnsdag, fredagskveld, julenissedrakt.',
 eks:'fredagskveld, julenisse, solskinnsdag, juletre'},

/* ── SETNINGSBYGGING (10) ── */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva er problemet med setningen: «Han gikk tur og det var kaldt og han hadde ikke lue og det var dumt.»?',
 alt:['For mange «og» – setningen bør delast opp','«tur» skal være «turen»','«kaldt» er feil','«lue» er feil ord'],
 fasit:'For mange «og» – setningen bør delast opp',
 regel:'Unngå lang sammenkopling av setninger med mange «og». Del opp med punktum og varièr setningsoppbyggingen.',
 eks:'Han gikk tur. Det var kaldt, og han angret på at han hadde glemt lua.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva setning er best skriven?',
 alt:['Det er bra å trene fordi det er bra.','Regelmessig trening styrkjer hjartet og bedre humøret.','Regelmessig trening styrkjer hjartet og betrar humøret.','Trening er bra for deg.'],
 fasit:'Regelmessig trening styrkjer hjartet og betrar humøret.',
 regel:'Unngå å repetere samme ord («bra og bra»). Bruk presis og variert ordval.',
 eks:'Regelmessig trening styrkjer hjartet og betrar humøret.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva er den beste oppdelingen av: «Det var kaldt ute og han ville ikke gå og han ble hjemme.»?',
 alt:[
   'Det var kaldt ute. Han ville ikke gå og ble hjemme.',
   'Det var kaldt, ute og han ville ikke gå. Han ble hjemme.',
   'Det var kaldt ute og han ville ikke gå. Og han ble hjemme.',
   'Det var kaldt. Ute og han ville ikke gå og han ble hjemme.'
 ],
 fasit:'Det var kaldt ute. Han ville ikke gå og ble hjemme.',
 regel:'Del opp der et nytt hovedpoeng starter. «Det var kaldt ute» = én setning. «Han ville ikke gå og ble hjemme» = én setning med to verb til samme subjekt.',
 eks:'Det var kaldt ute. Han ville ikke gå og ble hjemme.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva er et muntlig uttrykk som ikke hører hjemme i en fagartikkel?',
 alt:['og sånn','dessuten','til eksempel','imidlertid'],
 fasit:'og sånn',
 regel:'Unngå muntlige uttrykk i formell tekst: «og sånn», «liksom», «osv.», «på en måte».',
 eks:'UNNGÅ: «Det er bra og sånn.» BRUK: «Dette har flere fordelar.»'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Hva feil er det i: «KI altså kunstig intelligens er et dataprogram.»?',
 alt:['Setninga er for lang og ustrukturert','«altså» er feil ord her','«dataprogram» er feil','Det er ingen feil'],
 fasit:'Setninga er for lang og ustrukturert',
 regel:'Forklaringar i parentes eller komma-innsetning gir bedre flyt: «KI (kunstig intelligens) er et dataprogram.»',
 eks:'KI (kunstig intelligens) er et dataprogram som kan lærast opp.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Hva er den beste sammenslåingen av: «Brettspill er bra. Brettspill samler folk. Brettspill er sosialt.»?',
 alt:[
   'Brettspill er sosialt og samler folk til felles aktivitet.',
   'Brettspill er bra, samler folk og brettspill er sosialt.',
   'Brettspill er bra. Og sosialt. Og samler folk.',
   'Brettspill er bra fordi brettspill er sosialt og samler folk.'
 ],
 fasit:'Brettspill er sosialt og samler folk til felles aktivitet.',
 regel:'Slå sammen setninger med samme tema. Unngå å gjenta «Brettspill» flere ganger. Pronomen eller effektiv sammensetning gir bedre flyt.',
 eks:'Brettspill er sosialt og samler folk til felles aktivitet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Hva setningsstarter UNNGÅR du helst å bruke to ganger på rad?',
 alt:['Samme åpningsord gjentar seg fra setning til setning','«Dessuten» er et bra bindeord å variere med','«Imidlertid» er et fint formelt alternativ','«Derfor» gir god kontrast mellom setninger'],
 fasit:'Samme åpningsord gjentar seg fra setning til setning',
 regel:'Variasjon i setningsstartere gjør teksten mer lesevennlig. Bruk pronomen, synonym eller varier oppbyggingen.',
 eks:'Brettspill er sosialt. Det samler folk og... / Slike spill kan...'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskelig',
 q:'Hva er den beste omskrivinga av: «Det er lurt å bruke KI fordi det gjør arbeidet raskere og mer effektivt.»?',
 alt:['KI gjør arbeidet raskere og effektivare, noe som frigjer tid til dypere læring (Jensen, 2024).','Det er lurt å bruke KI fordi KI er effektivt og raskt og bra.','KI er bra. Det er effektivt.','Bruk KI. Det er lurt.'],
 fasit:'KI gjør arbeidet raskere og effektivare, noe som frigjer tid til dypere læring (Jensen, 2024).',
 regel:'Utdjup hvorfor noe er lurt. Bruk presise ord, unngå gjentak, og legg til kilde.',
 eks:'KI gjør arbeidet raskere og effektivare, noe som frigjer tid til dypere læring (Jensen, 2024).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskelig',
 q:'Hva er den beste faglige omskrivinga av: «Klimaendringer er et veldig stort problem og sånn, og det påverkar alle og vi bør gjøre noe.»?',
 alt:[
   'Klimaendringer er et alvorlig globalt problem som krever handling fra alle.',
   'Klimaendringer er et veldig alvorlig problem og det er viktig å gjøre noe.',
   'Klimaendringene er store og alle bør gjøre noe.',
   'Klimaendringer er et problem som påverkar oss, og vi må handle.'
 ],
 fasit:'Klimaendringer er et alvorlig globalt problem som krever handling fra alle.',
 regel:'Fjern «og sånn», vage ord og samankopling av setningarar. Bruk presist og variert ordval. «Veldig stort» → «alvorlig globalt», «vi bør gjøre noe» → «krever handling fra alle».',
 eks:'Klimaendringer er et alvorlig globalt problem som krever handling fra alle.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskelig',
 q:'Hva virkemiddel gjør denne setningen sterkere: «Klimaet endrer seg.» → «Klimaet endrer seg – og ingen kan se på lenger.»?',
 alt:['Tankestrek og appell til ansvar','Et komma','Et spørsmålsteikn','Lengre setning'],
 fasit:'Tankestrek og appell til ansvar',
 regel:'Tankestrek kan skape dramatisk pause og tyngde. Appell til ansvar engasjerer leseren i debattsjanger.',
 eks:'Klimaet endrer seg – og ingen kan se på lenger.'},

/* ── TEKSTSTRUKTUR (10) ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Hva er en ingress?',
 alt:['En til to setninger som innleder og presenterer temaet','Den lengste hoveddelen av teksten','Kildelisten nederst i teksten','Avslutningen av teksten'],
 fasit:'En til to setninger som innleder og presenterer temaet',
 regel:'Ingressen kommer etter overskrifta og gir leseren et raskt overblikk over hva teksten handler om.',
 eks:'«Plasten i havet utgjer en av vår tids største miljøkatastrofar. Her er det du trenger å vite.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Hva delar bør en fagartikkel ha?',
 alt:['Ingress, innledning, hoveddel, avslutning','Bare hoveddel','Overskrift og kildeliste','Tal på delar spelar inga rolle'],
 fasit:'Ingress, innledning, hoveddel, avslutning',
 regel:'En fagartikkel bør ha tydelig struktur med ingress, innledning, hoveddel og avslutning.',
 eks:'Ingress + innledning gir retning. Hovuddelen forklarer. Avslutninga rundar av.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Hva er ei temasetning?',
 alt:['Den første setningen som angir hva hele avsnittet handler om','Den siste og oppsummerande setningen i avsnittet','En tittel på et avsnitt','Ei setning med kilde'],
 fasit:'Den første setningen som angir hva hele avsnittet handler om',
 regel:'Temasetning = første setning i avsnittet. Resten av avsnittet utdyper denne eine tanken.',
 eks:'«Klimaendringer påverkar vintersportsesongen direkte.» – resten av avsnittet utdyper dette.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Et godt avsnitt har: temasetning → ___ → (eventuell) avslutningssetning',
 hint:'Tenkjer du på det som utdyper hovedpoenget? Det kan kallast flere ting.',
 fasit:'utdypende setninger',
 fasit_v:['utdypende setninger','kommentarsetninger','kommentarsetning','utfyllende kommentarsetninger','utdypende kommentarsetninger','forklaringer og eksempel','forklaring og eksempel','bevis og forklaring','utdyping','kommentarer'],
 regel:'Etter temasetning kommer utdypende kommentarsetninger med forklaring, bevis og eksempel.',
 eks:'Temasetning → forklaring → bevis/kilde → konsekvens/kommentar'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Hva er FEIL om ei avslutning i en fagartikkel?',
 alt:['Hun skal oppsummere hovudpoenga','Hun skal introdusere ny informasjon','Hun bør knyte an til innledningen','Hun bør være kortere enn hoveddelen'],
 fasit:'Hun skal introdusere ny informasjon',
 regel:'Avslutninga oppsummerer og avrundar – hun tar ikke opp nye tema eller argument.',
 eks:'FEIL: «Forresten er det og et problem med havforsuring...» (nytt tema i avslutning)'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Hva skil strukturen i et debattinnlegg fra en fagartikkel?',
 alt:['Debattinnlegg: påstand tidlig. Fagartikkel: nøytral','Fagartikkelen har alltid flere avsnitt','Debattinnlegget trenger ikke innledning','Fagartikkelen bruker aldri kilder'],
 fasit:'Debattinnlegg: påstand tidlig. Fagartikkel: nøytral',
 regel:'Fagartikkel: nøytral, informativ. Debattinnlegg: tar tydelig standpunkt fra første avsnitt.',
 eks:'FA: «Plastforurensning er et stort problem.» DI: «Jeg mener plastposen bør forbydast no!»'},



{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Hvor hører et motargument hjemme i et debattinnlegg?',
 alt:['I hoveddelen, der det blir presentert og tilbakevist','Bare i avslutninga','I innledningen','Motargument skal ikke tas med'],
 fasit:'I hoveddelen, der det blir presentert og tilbakevist',
 regel:'Å nemne og tilbakevise motargument styrkjer truverdet ditt. Det viser at du kjenner saka fra flere sider.',
 eks:'«Noen vil hevde at plastpose-forbod er upraktisk – men miljøkonsekvensane overstig denne ulempa.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'vanskelig',
 q:'Hva er ring-komposisjon i en tekst?',
 alt:['Avslutninga vender tilbake til et motiv eller bilder fra innledningen','Teksten er skriven i sirklar','Alle avsnitt startar med samme ord','Konklusjonen kommer først'],
 fasit:'Avslutninga vender tilbake til et motiv eller bilder fra innledningen',
 regel:'Ring-komposisjon gir teksten heilskap og avsluttar elegant ved å knyte sammen start og slutt.',
 eks:'Innledning: «Snøen smelter...» Avslutning: «Og smelter snøen helt – hva har vi igjen?»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'vanskelig',
 q:'Hva retorisk appelform bruker en når en refererer til forsking og tal i et debattinnlegg?',
 hint:'Det er en av de tre klassiske appelformane. Fornuft og fakta – ikke kjensler eller truverd.',
 fasit:'logos',fasit_v:['logos'],
 regel:'Logos = fornuftsappell. Bruk av fakta, statistikk og logisk argumentasjon.',
 eks:'«Ifølge SSB (2024) har plastforurensningen i norske farvann doblet seg siden 2010.» (logos)'},

/* ── KJELDEBRUK (10) ── */
{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvordan skriver du ei kjeldetilvising i teksten?',
 alt:['(Etternavn, årstal) – t.d. (Jensen, 2024)','[lenke til nettsida]','«sitat» - forfatter','Forfatter: tittel'],
 fasit:'(Etternavn, årstal) – t.d. (Jensen, 2024)',
 regel:'Bruk parentesar med etternavn og årstal etter påstander hentet fra kjelder.',
 eks:'Plasten har økt med 40 % siden 2010 (Jensen, 2024).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hver i teksten skal kildelista stå?',
 alt:['Helt til slutt i dokumentet','I innledningen','Midt i teksten','Rett etter den første kilden er brukt'],
 fasit:'Helt til slutt i dokumentet',
 regel:'Kildelista kommer alltid aller sist i teksten, gjerne med overskrifta «Kjeldeliste».',
 eks:'Hovudtekst → ... → Avslutning → Kjeldeliste'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvordan skal kildene i lista være sorterte?',
 alt:['Alfabetisk etter forfatterens etternavn','Etter dato de er hentet','Tilfeldig rekkefølge','Etter hvor viktige de er'],
 fasit:'Alfabetisk etter forfatterens etternavn',
 regel:'Kildelista er alfabetisk sortert etter forfatterens etternavn.',
 eks:'Andersen (2022) kommer før Berg (2023), som kommer før Dahl (2021).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'cloze',vanske:'lett',
 q:'Fyll inn: Alle kjelder du bruker i teksten med ___ skal og stå i kildelista.',
 hint:'Hva skriver du rundt (Etternavn, årstal) – hva type tegn er det?',
 fasit:'parentes',fasit_v:['parentes','parentesar','parentesreferansar','(Etternavn, årstal)'],
 regel:'Hver kjeldetilvising i teksten (Etternavn, årstal) skal ha en tilsvarande fullstendig referanse i kildelista.',
 eks:'I tekst: (Jensen, 2024) → I lista: Jensen, K. (2024). Tittel. Hentet fra: lenke'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva er rett format for en kjeldelistepost fra ei nettside?',
 alt:['Etternavn, F. (årstal). Tittel. Hentet [dato] fra: lenke','Lenke – tittel – forfatter','Tittel (årstal): lenke','Forfatter: tittel, årstal'],
 fasit:'Etternavn, F. (årstal). Tittel. Hentet [dato] fra: lenke',
 regel:'Standardformat: Etternavn, Fornavn-initial (årstal). Tittel. Hentet [dato] fra: [URL]',
 eks:'Jensen, K. (2024). Plast i havet. Hentet 15. mars 2026 fra: miljodirektoratet.no/...'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva er etos i sammenheng med kildebruk?',
 alt:['Troverdigheten teksten får når en bruker pålitelige kilder','Følelser en vekker hos leseren','Logiske argumenter med tall','Lengden på kildelisten'],
 fasit:'Troverdigheten teksten får når en bruker pålitelige kilder',
 regel:'Etos = troverdighet. Gode kilder styrker din etos som skribent – leseren stoler mer på deg.',
 eks:'«Ifølge Havforskningsinstituttet (2023)…» gir sterkere etos enn «Jeg tror at…»'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Ifølge ___ (2024) har snøsesongen blitt kortere.»',
 hint:'Bakgrunn: En NRK-sak fra 2024 rapporterte om kortere vintersesong. Hvordan skriver du kilden når du ikke vet forfatternavnet?',
 fasit:'NRK',fasit_v:['NRK','Etternavn','Forfatternavn','forfatternavn','[Etternavn]','[Forfatter]'],
 regel:'Når en kilde mangler personlig forfatter, bruker en organisasjonens navn: (NRK, 2024).',
 eks:'Ifølge NRK (2024) har snøsesongen blitt kortere.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva er FEIL kildebruk?',
 alt:['Kopiere hele avsnitt fra ei nettside uten sitat og kilde','Bruke en faktapåstand med (Jensen, 2024)','Ha kildeliste på slutten','Skrive «Ifølge Miljødirektoratet (2023)…»'],
 fasit:'Kopiere hele avsnitt fra ei nettside uten sitat og kilde',
 regel:'Å kopiere tekst uten å markere det som sitat og oppgi kilde er plagiat. Alltid parfraser eller bruk sitat med kilde.',
 eks:'FEIL: (kopiert tekst uten kilde). RETT: «…» (Jensen, 2024). / Parafrase (Jensen, 2024).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskelig',
 q:'Hva av disse er et korrekt sitat med kjeldetilvising?',
 alt:['"Det har aldri vore mer kunstsnø i skibakkene" (NRK, 2022).','NRK skreiv i 2022 at det er mye kunstsnø.','Kunstsnø er mye brukt (kilden er NRK).','(NRK) Det er mye kunstsnø.'],
 fasit:'"Det har aldri vore mer kunstsnø i skibakkene" (NRK, 2022).',
 regel:'Direkte sitat: bruk hermetegn rundt det eksakte sitatet, deretter (Kilde, årstal) i parentes.',
 eks:'«Det har aldri vore mer kunstsnø» (NRK, 2022).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'cloze',vanske:'vanskelig',
 q:'Ei kilde i teksten er (Villspor, 2023). Skriv hvordan dette ser ut i kildelista (fyll inn manglande del):\n«Villspor. (2023). Friluftsliv fra 1970 til i dag. ___ 15. mars 2026 fra: magasinetvillspor.no/...»',
 hint:'Hva ord bruker en i kildelista for å fortelle at en har besøkt ei nettside en bestemt dato?',
 fasit:'Hentet',fasit_v:['Hentet','hentet'],
 regel:'Standardfrasen er «Hentet [dato] fra:» i kildelista for nettkjelder.',
 eks:'Jensen, K. (2024). Tittel. Hentet 15. mars 2026 fra: lenke.no'},



{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (vanlig rekkefølge):',
 ord:['Jenta','las','ei','bok','på','senga','.'],
 fasit:'Jenta las ei bok på senga .',
 regel:'Grunnrekkefølge: Subjekt – Verbal – Objekt – Adverbial.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (V2, tidsadverbial fremst):',
 ord:['I','dag','skal','vi','ha','prøve','.'],
 fasit:'I dag skal vi ha prøve .',
 regel:'«I dag» er adverbial fremst → verb (skal) kommer på plass 2.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (V2, stadadverbial fremst):',
 ord:['Her','bur','mange','innvandrarar','.'],
 fasit:'Her bur mange innvandrarar .',
 regel:'«Her» fremst → verb (bur) på plass 2 FØR subjektet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (spørresetning):',
 ord:['Hvorfor','kom','du','ikke','i','går','?'],
 fasit:'Hvorfor kom du ikke i går ?',
 regel:'I spørresetninger: spørreord – verb – subjekt – resten.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (leddsetning etter «at»):',
 ord:['Hun','sier','at','han','ikke','kommer','.'],
 fasit:'Hun sier at han ikke kommer .',
 regel:'I leddsetning («at…»): ikke kommer FØR verbet etter subjektet.'},


/* ── BINDEORD (15) ── */
{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Hvilket bindeord passer best? «Hun var trøtt, ___ gikk hun hjem.»',
 alt:['derfor','men','og','fordi'],fasit:'derfor',
 fasit_v:['derfor'],
 regel:'«Derfor» viser konsekvens: hun var trøtt, og derfor (= derfor) gikk hun hjem.',
 eks:'Hun var trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Hvilket bindeord passer best? «Det regner, ___ vi går ut likevel.»',
 alt:['men','derfor','fordi','og'],fasit:'men',
 regel:'«Men» viser kontrast – to ting som går mot hverandre.',
 eks:'Det regner, men vi går ut likevel.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Hvilket bindeord viser årsak? «Han gikk til legen ___ han var syk.»',
 alt:['fordi','men','derfor','og'],fasit:'fordi',
 regel:'«Fordi» forklarer hvorfor noe skjer.',
 eks:'Han gikk til legen fordi han var syk.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Hvilket bindeord passer best? «Hun liker å lese ___ skrive.»',
 alt:['og','men','derfor','fordi'],fasit:'og',
 regel:'«Og» binder sammen to like ledd (addisjon).',
 eks:'Hun liker å lese og skrive.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hva bindeord viser at noe er ekstra i tillegg til det som allerede er sagt?',
 alt:['dessuten','men','fordi','selv om'],fasit:'dessuten',
 regel:'«Dessuten» betyr «i tillegg» – adderer informasjon.',
 eks:'Det er billig; dessuten er det nyttig.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hvilket bindeord passer best? «___ det regner, vil jeg gå tur.»',
 alt:['selv om','fordi','derfor','dessuten'],fasit:'selv om',
 regel:'«Selv om» viser at noe skjer trass i en hindring.',
 eks:'Selv om det regner, vil jeg gå tur.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hvilket bindeord passer best? «Forskning viser positive resultater; ___ er det også utfordringer.»',
 alt:['likevel','derfor','og','fordi'],fasit:'likevel',
 regel:'«Likevel» viser kontrast – trass i det positive finnes det utfordringer.',
 eks:'Resultatene er gode; likevel er det rom for forbedring.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hvilket bindeord passer best? «KI kan være nyttig, ___ det også kan misbrukes.»',
 alt:['selv om','men','og','fordi'],fasit:'men',
 regel:'«Men» viser motsetnad mellom to påstander.',
 eks:'KI kan være nyttig, men det kan òg misbrukes.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hva er forskjellen mellom «men» og «selv om»?',
 alt:['«Men» knytter to hovedsetninger; «selv om» innleder en leddsetning','De betyr det samme','«Selv om» er sterkere enn «men»','«Men» er bokmål; «selv om» er nynorsk'],
 fasit:'«Men» knytter to hovedsetninger; «selv om» innleder en leddsetning',
 regel:'«Men» = koordinerende (mellom to hovedsetninger). «Selv om» = subordinerende (innleder leddsetning).',
 eks:'Hun er trøtt, men hun leser. / Selv om hun er trøtt, leser hun.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskelig',
 q:'Hva er forskjellen på «fordi» og «siden» som bindeord?',
 alt:['Begge viser årsak; «siden» antyder at grunnen er kjent','«Fordi» er nynorsk; «siden» er bokmål','«Siden» viser tid; «fordi» viser sted','De betyr det samme, ingen forskjell'],
 fasit:'Begge viser årsak; «siden» antyder at grunnen er kjent',
 regel:'«Fordi» gir ny årsak. «Siden» (kausal) brukes når grunnen er kjent for begge: «Siden du er ekspert, kan du svare.»',
 eks:'Hun reiste hjem fordi hun var syk. / Siden det regner, tar vi bussen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Velg rett bindeord: «Sosiale medier kan være nyttig; ___ er det viktig å bruke det med omhu.»',
 alt:['likevel','fordi','og','selv om'],fasit:'likevel',
 hint:'Hva ord viser kontrast – at noe er sant trass i det positive?',
 regel:'«Likevel» viser kontrast etter et positivt utsagn.',
 eks:'Det er billig; likevel er det risikabelt.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Velg rett bindeord: «___ ungdom skriver mer enn noen gang, betyr det ikke at de skriver bedre.»',
 alt:['selv om','fordi','dessuten','derfor'],fasit:'selv om',
 hint:'Hva bindeord viser at noe skjer trass i en annen realitet?',
 regel:'«Selv om» innleder en leddsetning som viser kontrast.',
 eks:'Selv om det er vanskelig, prøver hun.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskelig',
 q:'Hva bindeord er FEIL i setningen: «Han studerte mye, altså stryk han på eksamen.»?',
 alt:['altså','mye','Han','eksamen'],fasit:'altså',
 regel:'«Altså» viser positiv konsekvens. Her er resultatet negativt. Rett: «likevel» eller «men».',
 eks:'Han studerte mye, men strøyk på eksamen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskelig',
 q:'Hva gruppe hører «mens», «etter at» og «før» til?',
 alt:['Tidsadverbial','Kontrastbindeord','Konsekvensbindeord','Årsaksadverbial'],
 fasit:'Tidsadverbial',
 regel:'«Mens», «etter at» og «før» viser tidsforhold mellom to hendelser.',
 eks:'Mens det regner, leser jeg. Etter at hun kom, gikk vi.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskelig',
 q:'Hva setning er korrekt formulert?',
 alt:['Fordi hun øvde mye, derfor vant hun.','Fordi hun øvde mye, vant hun.','Hun øvde mye, fordi hun vant.','Hun vant, fordi øvde hun mye.'],
 fasit:'Fordi hun øvde mye, vant hun.',
 regel:'Leddsetning med «fordi» som kommer først → komma + hovedsetning med rett V2-ordstilling. Ikke bruk «derfor» i tillegg.',
 eks:'Fordi hun øvde mye, vant hun. (ikke: ...derfor vant hun)'},
{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge: bindeordet kommer mellom de to setningene.',
 hint:'Hvilket bindeord hører hjemme her?',
 ord:['Hun ble','trøtt','derfor','gikk','hun hjem'],
 fasit:['Hun ble','trøtt','derfor','gikk','hun hjem'],
 regel:'«Derfor» kommer mellom de to setningene. Merk V2: etter «derfor» kommer verbet «gikk» før subjektet «hun».',
 eksempel:'Hun ble trøtt, derfor gikk hun hjem.',kontrast_bm:'Hun ble trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge.',
 hint:'«Selv om» innleder en leddsetning – hva kommer etter kommaet?',
 ord:['Selv om','det regner','vil','jeg','gå tur'],
 fasit:['Selv om','det regner','vil','jeg','gå tur'],
 regel:'Etter leddsetning med «selv om» kommer V2: verb + subjekt.',
 eksempel:'Selv om det regner, vil jeg gå tur.',kontrast_bm:'Selv om det regner, vil jeg gå tur.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Hvilket bindeord passer best? «Hun trente mye, ___ vant hun konkurransen.»',
 alt:['og derfor','fordi','men','selv om'],fasit:'og derfor',
 regel:'«Og derfor» viser positiv konsekvens av noe som ble gjort.',
 eks:'Hun trente mye, og derfor vant hun konkurransen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Hvilket bindeord er FEIL brukt? «Han åt mye, dessuten gikk han tidlig til sengs.»',
 alt:['dessuten','mye','Han','tidlig'],fasit:'dessuten',
 regel:'«Dessuten» betyr «i tillegg» og brukes når noe legges til. Her er det ikke et tillegg – bruk «derfor» eller «og».',
 eks:'Han åt mye og gikk tidlig til sengs.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskelig',
 q:'Hva bindeord gjør det klart at to ting skjer samtidig?',
 alt:['mens','derfor','fordi','men'],fasit:'mens',
 regel:'«Mens» viser at to hendelser pågår samtidig. Eks: «Hun leste mens han sov».',
 eks:'Hun leste mens han sov.'},


{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (V2 etter «Derfor»):',
 ord:['Derfor','gikk','hun','hjem','tidlig','.'],
 fasit:'Derfor gikk hun hjem tidlig .',
 regel:'Etter «derfor» kommer verbet FØR subjektet (V2-regelen).'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (V2 etter «Likevel»):',
 ord:['Likevel','møtte','han','opp','på','skolen','.'],
 fasit:'Likevel møtte han opp på skolen .',
 regel:'Etter «likevel» kommer verbet FØR subjektet: Likevel møtte han.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (V2 etter «Dessuten»):',
 ord:['Dessuten','er','det','billigere','å','sykle','.'],
 fasit:'Dessuten er det billigere å sykle .',
 regel:'V2 etter adverbial: Dessuten er det. Verbet kommer på plass 2.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (leddsetning med «fordi»):',
 ord:['Hun','vant','fordi','hun','øvde','mye','.'],
 fasit:'Hun vant fordi hun øvde mye .',
 regel:'«Fordi» innleder leddsetning. Subjektet kommer FØR verbet i leddsetning.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett ordene i rett rekkefølge (kontrastsetning med «men»):',
 ord:['Han','prøvde','hardt',',','men','lykkast','ikke','.'],
 fasit:'Han prøvde hardt , men lykkast ikke .',
 regel:'«Men» binder sammen to hovedsetninger med komma foran.'},


/* ── SPØRJEORD – BANK (12 oppgaver) ── */












/* ── DOBBEL KONSONANT (20 oppgaver) ── */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av verbet i infinitiv?',
 alt:['hoppe','hoppa','hoppet','hopp'],fasit:'hoppe',
 regel:'Etter kort vokal kommer dobbel konsonant: «hoppe» (kort o → dobbel p).',
 eks:'hoppe, springe, kaste'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av verbet i infinitiv?',
 alt:['sitte','satt','sote','søtte'],fasit:'sitte',
 regel:'Etter kort vokal kommer dobbel konsonant: «sitte» (kort i → dobbel t).',
 eks:'sitte, legge, hoppe'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: «hun ___ på stolen» (å sitte, presens)',
 fasit:'sit',fasit_v:['sit'],
 hint:'I presens (notid) har «å sitte» bare én konsonant.',
 regel:'Infinitiv og fleirtal: «sitte», men presens eintal: «sit» (kort form). I nynorsk: sit.',
 eks:'hun sit, han sit'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av verbet i infinitiv?',
 alt:['la','legge','legget','lagt'],fasit:'legge',
 regel:'«Legge» (infinitiv) har dobbel g etter kort e: l-e-g-g-e.',
 eks:'å legge boka på bordet'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av verbet som handler om å gi et namn)?',
 alt:['kalle','kalte','kallet','kall'],fasit:'kalle',
 regel:'Etter kort vokal i rotstavinga kommer dobbel konsonant: «kalle» (kort a → dobbel l).',
 eks:'Jeg kallar han Per.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hva ord er FEIL skrive?',
 alt:['lese','skrive','hoppe','siting'],fasit:'siting',
 regel:'Substantiv av «å sitte» blir «sitting» (dobbel t) – ikke «siting».',
 eks:'sitting, hopping, kalling'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av adjektivet som handler om å lage lite lyd?',
 alt:['stille','stile','still','sttille'],fasit:'stille',
 regel:'«Stille» (roleg) har dobbel l etter kort i.',
 eks:'Det er stille i rommet. Ei stille natt.'},



{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hvorfor skriver en «mat» men «matte»?',
 alt:['«Mat» er substantiv med lang vokal; «matte» har kort vokal og dobbel t','Det er tilfeldig','«Mat» er bokmål; «matte» er nynorsk','Begge har lang vokal'],
 fasit:'«Mat» er substantiv med lang vokal; «matte» har kort vokal og dobbel t',
 regel:'Lang vokal → enkel konsonant. Kort vokal → dobbel konsonant. «Maat» (lang a) = mat. «Matt» (kort a) = matte.',
 eks:'mat (lang a) vs. matte (kort a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskelig',
 q:'Hva av disse ordene er FEIL skrive?',
 alt:['bate','batte','sitte','kalle'],fasit:'bate',
 regel:'«Bate» (= å ha bruke av) skriver en med dobbel t: «batte».',
 eks:'Det batta ikke å prøve.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskelig',
 q:'Hva er rett skrivemåte av verbet som betyr «å arbeide hardt for noe»?',
 alt:['streve','stræve','strivje','streve seg'],fasit:'streve',
 regel:'«Streve» har én v fordi vokalen (e) er lang. Lang vokal → enkel konsonant.',
 eks:'Hun streva hardt for å klare det.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'vanskelig',
 q:'Er «bil» eller «bill» rett skrivemåte?',
 fasit:'bil',fasit_v:['bil'],
 hint:'Tenk på vokalen – er «i»-en i «bil» lang eller kort?',
 regel:'«Bil» har lang i → én l. Kort vokal → dobbel konsonant. «Bill» ville hatt kort i.',
 eks:'bil (lang i), bill (finnes ikke i norsk)'},
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte? «Mora ___ og sprang bort til meg» (å rope, fortid)',
 alt:['ropa','roppa','robba','ropte'],fasit:'ropa',
 regel:'«Å rope» har lang vokal (lang o) → én konsonant i fortid: ropa.',
 eks:'Hun ropa, han ropa'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte? «Kampen er over. Ballen er ___ ferdig» (å rulle, partisipp)',
 alt:['rulla','rula','rulle','rullet'],fasit:'rulla',
 regel:'«Å rulle» har kort u → dobbel l i infinitiv og partisipp: rulle/rulla.',
 eks:'Hun rulla ballen. Ballen er rulla.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Velg rett form: «Hun ___ leksa godt» (å lese, fortid nynorsk)',
 alt:['las','leste','lasse','las leksa'],fasit:'las',
 regel:'«Å lese» er sterkt verb: las (fortid), lesen (partisipp). Lang e → én s.',
 eks:'Hun las boka. Hun las godt.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskelig',
 q:'Hva par er BEGGE riktig skrive?',
 alt:['katte – kater','katte – katte','katt – katter','kater – katter'],fasit:'katt – katter',
 regel:'«Katt» (kort a → dobbel t), «katter» (fleirtalsform, dobbel t bevart).',
 eks:'en katt, flere katter'},




/* ── DOBBEL KONSONANT – ekstra (8 nye) ── */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter ordene: hva er RIKTIG skrive, og hva er FEIL?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'hoppe', fasit:0},
   {tekst:'sitte', fasit:0},
   {tekst:'hoper', fasit:1},
   {tekst:'siter', fasit:1},
   {tekst:'kaffe', fasit:0},
   {tekst:'kafe', fasit:1},
   {tekst:'løpe', fasit:0},
   {tekst:'løppe', fasit:1},
 ],
 regel:'Dobbel konsonant etter kort vokal: hop-pe, sit-te, kaf-fe. Lang vokal → én konsonant: løpe (lang ø).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Hva av disse ordene er RIKTIG skrivne?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'ball', fasit:0},
   {tekst:'bal', fasit:1},
   {tekst:'fisk', fasit:0},
   {tekst:'fissk', fasit:1},
   {tekst:'eple', fasit:0},
   {tekst:'epple', fasit:1},
   {tekst:'hylle', fasit:0},
   {tekst:'hyle', fasit:1},
 ],
 regel:'Ikke alle ord med kort vokal får dobbel konsonant. "fisk" har lang konsonant, ikke dobbel.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskelig',
 q:'Verb i presens – riktig eller feil skrivemåte?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'hoppar', fasit:0},
   {tekst:'sit', fasit:0},
   {tekst:'hoper', fasit:1},
   {tekst:'løper', fasit:0},
   {tekst:'løpper', fasit:1},
   {tekst:'legg', fasit:0},
   {tekst:'lege', fasit:1},
   {tekst:'springer', fasit:0},
 ],
 regel:'Dobbel konsonant i presens etter kort vokal: hoppAR. Men «sit» (én t i presens) og «legg» (én g i presens imperativ/presens).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskelig',
 q:'Adjektiv – riktig eller feil skrivemåte?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'stille', fasit:0},
   {tekst:'stile', fasit:1},
   {tekst:'grønn', fasit:0},
   {tekst:'grønn', fasit:1},
   {tekst:'liten', fasit:0},
   {tekst:'litten', fasit:1},
   {tekst:'bitter', fasit:0},
   {tekst:'biter', fasit:1},
 ],
 regel:'Dobbel konsonant i adjektiv etter kort vokal: stil-le, grønn, bit-ter.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Hva setning er KORREKT skrive?',
 alt:['Hun hoppar over bekken hver morgon.','Hun hoper over bekken hver morgon.','Hun hoppar over becken hver morgon.','Hun hoppes over bekken hver morgon.'],
 fasit:'Hun hoppar over bekken hver morgon.',
 regel:'«Hoppar» har dobbel p fordi rota «hopp» har kort vokal.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Set inn rett ord: «Katten ligger og ___» (å sove, presens)',
 alt:['sover','sovver','sof','sovnar'],
 fasit:'sover',
 regel:'«Sove» har lang vokal – ikke dobbel konsonant. Presens: sover.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskelig',
 q:'Hva er rett skrivemåte av fortidsforma av «å sprette»?',
 alt:['spratt','sprat','sprett','sprette'],
 fasit:'spratt',
 regel:'«Sprette» er et sterkt verb. Fortid: spratt (kort a, dobbel t).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskelig',
 q:'Hva setning er FEIL skrive?',
 alt:['Glaset er fullt.','Huset er tomt.','Barnet spring fort.','Mannen er frisk.'],
 fasit:'Barnet spring fort.',
 regel:'«Spring» er rett i presens (ikke dobbel). Men sjekk kontekst: «spring» vs «sprang» (fortid).'},


/* ── KJ/SKJ-LYDEN (12 oppgaver) ── */
{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Hvordan skriver en lyden i «___ønn» (= det fine fargehaldet i hud/natur)?',
 alt:['skjønn','kjønn','shjønn','schønn'],fasit:'skjønn',
 regel:'«Skjønn» (= vakker) skriver en med «skj». «Kjønn» (= grammatisk kjønn) er et annet ord!',
 eks:'en skjønn solnedgang'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte: «___orte» (= det å forkorte)?',
 alt:['kjorte','skjorte','chrorte','shjorte'],fasit:'skjorte',
 regel:'«Skjorte» skriver en med «skj» – klesplagg.',
 eks:'ei kvit skjorte'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av det grammatiske omgrepet (hankjønn/hokjønn/inkjekjønn)?',
 alt:['kjønn','skjønn','sjønn','kjøn'],fasit:'kjønn',
 regel:'«Kjønn» (grammatisk kjønn) skriver en med «kj». Ikke forveksle med «skjønn» (= vakker).',
 eks:'et substantiv har et grammatisk kjønn: hankjønn, hokjønn eller inkjekjønn'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Hva er rett skrivemåte av det norske ordet for «forest»?',
 alt:['skog','skogg','skjog','kjog'],fasit:'skog',
 regel:'«Skog» skriver en med enkel sk, ikke skj.',
 eks:'en tett skog'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'lett',
 q:'Fyll inn: «Hun tok på seg ei ny ___» (klesplagg med knapper)',
 fasit:'skjorte',fasit_v:['skjorte'],
 hint:'Begynner med «skj-».',
 regel:'«Skjorte» begynner med «skj».',
 eks:'ei kvit skjorte, ei blå skjorte'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av «det å erkjenne noe» (= innrømme)?',
 alt:['erkjenne','erkjennje','ersjenne','erkjennne'],fasit:'erkjenne',
 regel:'«Erkjenne» (= innrømme/vedgå) skriver en med «kj».',
 eks:'Hun ville ikke erkjenne at hun tok feil.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av «___ede» (= å forstå/innsee)?',
 alt:['kjende','skjende','shjende','chende'],fasit:'kjende',
 regel:'«Kjende» (preteritum av å kjenne) skriver en med «kj».',
 eks:'Hun kjende igjen lukta.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Det var en ___ dag» (= vakker dag)',
 fasit:'skjønn',fasit_v:['skjønn'],
 hint:'«Vakker» heiter «___ønn» på nynorsk.',
 regel:'«Skjønn» = vakker. Ikke forveksle med «kjønn» (grammatisk kjønn).',
 eks:'en skjønn solnedgang, et skjønt syn'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Hva er rett skrivemåte av verbet som betyr «å forstå»?',
 alt:['skjønne','kjønne','shjønne','schjønne'],fasit:'skjønne',
 regel:'«Skjønne» (= forstå) skriver en med «skj». Kommer av «skjønn».',
 eks:'Jeg skjønner ikke oppgaven.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'vanskelig',
 q:'Hva alternativ inneheld en SKRIVEFEIL?',
 alt:['skjørte (for skjorte)','skjønne','kjøpe','kjøring'],fasit:'skjørte (for skjorte)',
 regel:'«Skjorte» skriver en med «-orte», ikke «-ørte». De andre alternativa er alle rette.',
 eks:'ei skjorte (rett), ikke «skjørte».'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'vanskelig',
 q:'Forklar forskjellen på «kj-» og «skj-»:',
 alt:['Begge gir samme lyd, men blir brukte i ulike ord','«Kj» er nynorsk; «skj» er bokmål','«Skj» er alltid foran o/ø; «kj» er alltid foran a/e','«Skj» er feil – en bruker alltid «kj»'],
 fasit:'Begge gir samme lyd, men blir brukte i ulike ord',
 regel:'«Kj» og «skj» gir samme lyd (palatalt kj). Hva som brukes avheng av ordet, ikke av vokalen etter.',
 eks:'kjøp, kjøre (kj) – skjorte, skjønn (skj)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'vanskelig',
 q:'Fyll inn: «Hun ___ ikke hvorfor han var sint» (å forstå, preteritum)',
 fasit:'skjønte',fasit_v:['skjønte','skjønnte'],
 hint:'Preteritum av «å skjønne» – ender på -te.',
 regel:'«Å skjønne» → preteritum «skjønte».',
 eks:'Hun skjønte ingenting. Jeg skjønte det med en gang.'},

/* ── TEIKNSETTING – KOMMAREGLAR (12) ── */
{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvor setter du komma? «Jeg liker fotball tennis og svømming.»',
 alt:['Jeg liker fotball, tennis og svømming.','Jeg liker, fotball, tennis, og, svømming.','Jeg liker fotball, tennis, og svømming.','Ingen sted – setningen trenger ikke komma.'],
 fasit:'Jeg liker fotball, tennis og svømming.',
 regel:'Komma mellom oppramsing, men IKKE foran siste «og» i lista (norsk regel).',
 eks:'Jeg kjøpte mjølk, brød og ost.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hver set du komma? «Hun gikk hjem og han ble att.»',
 alt:['Hun gikk hjem, og han ble att.','Hun gikk hjem og, han ble att.','Hun gikk, hjem og han ble att.','Ingen komma – setningen er rett.'],
 fasit:'Hun gikk hjem, og han ble att.',
 regel:'Komma foran sideordnende bindeord (og, men, eller) som knytter to fullstendige setninger.',
 eks:'Hun gikk hjem, og han ble att.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Trenger denne setningen komma? «Hun las og skreiv hele dagen.»',
 alt:['Nei – «og» knytter to verb til samme subjekt, ikke to setninger','Ja, foran «og»','Ja, etter «las»','Ja, etter «skreiv»'],
 fasit:'Nei – «og» knytter to verb til samme subjekt, ikke to setninger',
 regel:'Komma kommer IKKE foran «og» når det bare knytter sammen to verb med samme subjekt.',
 eks:'Hun las og skreiv. (ikke komma) vs. Hun las, og han skreiv. (komma)'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hvor setter du komma? «Siden hun var syk gikk hun hjem.»',
 alt:['Siden hun var syk, gikk hun hjem.','Siden, hun var syk gikk hun hjem.','Siden hun var, syk gikk hun hjem.','Ingen komma.'],
 fasit:'Siden hun var syk, gikk hun hjem.',
 regel:'Komma etter framskutt leddsetning: [leddsetning], [hovedsetning].',
 eks:'Fordi det regner, tar vi bussen.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hva er rett? «Boka som hun las var interessant.»',
 alt:['Boka, som hun las, var interessant.','Boka som, hun las, var interessant.','Boka som hun las, var interessant.','Boka, som hun las var interessant.'],
 fasit:'Boka, som hun las, var interessant.',
 regel:'Komma rundt innskutte relativsetningar som gir tilleggsinformasjon (ikke identifiserande).',
 eks:'Læraren, som er fra Bergen, er veldig flink.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Set inn komma rett: «Hun sa at hun ikke ville komme.»',
 alt:['Hun sa at hun ikke ville komme. (ingen komma nødvendig)','Hun sa, at hun ikke ville komme.','Hun sa at, hun ikke ville komme.','Hun sa at hun ikke, ville komme.'],
 fasit:'Hun sa at hun ikke ville komme. (ingen komma nødvendig)',
 regel:'IKKE komma foran «at» i underordnede setninger på norsk.',
 eks:'Han mener at det er viktig. (ikke: mener, at)'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hva er rett tegnsetting? «Jeg blir trøtt av å arbeide for mye»',
 alt:['Jeg blir trøtt av å arbeide for mye.','Jeg blir trøtt, av å arbeide for mye.','Jeg blir, trøtt av å arbeide for mye.','Jeg blir trøtt av, å arbeide for mye.'],
 fasit:'Jeg blir trøtt av å arbeide for mye.',
 regel:'Ingen komma mellom preposisjonsfrase og infinitivskonstruksjon når de ikke er innskotne.',
 eks:'Jeg er lei av å vente.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hva er rett? «Han spring fort men hun spring fortare.»',
 alt:['Han spring fort, men hun spring fortare.','Han spring, fort men hun spring fortare.','Han spring fort men, hun spring fortare.','Han spring fort men hun spring fortare. (ingen komma)'],
 fasit:'Han spring fort, men hun spring fortare.',
 regel:'Komma foran «men» når det knytter to hovedsetninger.',
 eks:'Det er kaldt, men vi går likevel.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hvilket tegn passer best? «Jeg er ikke trøtt ___ jeg er sulten.»',
 alt:['semikolon (;)','kolon (:)','bindestrek (-)','komma (,)'],fasit:'semikolon (;)',
 regel:'Semikolon brukes mellom to nært knytte hovedsetninger uten bindeord.',
 eks:'Jeg er ikke trøtt; jeg er sulten.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hva er forskjellen på kolon og semikolon?',
 alt:['Kolon introduserer en forklaring/liste; semikolon knytter to setninger','De betyr det samme','Semikolon er sterkere enn kolon','Kolon er bokmål; semikolon er nynorsk'],
 fasit:'Kolon introduserer en forklaring/liste; semikolon knytter to setninger',
 regel:'Kolon (:) = «nemlig» / «dette er:». Semikolon (;) = knytter to selvstendige setninger uten bindeord.',
 eks:'Han hadde én ting på lista: melk. / Han er trøtt; hun er pigg.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hva er rett bruk av tankestrek?',
 alt:['Han kom hjem – seint, som vanlig.','Han – kom – hjem – seint.','Han kom, hjem – seint, som vanlig.','Tankestrek brukes aldri i nynorsk.'],
 fasit:'Han kom hjem – seint, som vanlig.',
 regel:'Tankestrek brukes for å legge til et kommentarledd med ekstra trykk eller dramatisk pause.',
 eks:'Det var én ting hun gløymde – nøklane.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hver kommer hermeteikna? «Hun sa jeg er ikke redd.»',
 alt:['Hun sa: «Jeg er ikke redd.»','Hun sa «jeg er ikke redd».','Hun sa: jeg er ikke redd.','«Hun sa» jeg er ikke redd.'],
 fasit:'Hun sa: «Jeg er ikke redd.»',
 regel:'Direkte tale: kolon etter innleiingsverbet, hermetegn rundt det som blir sagt, stor bokstav inni.',
 eks:'Hun svarte: «Det er greitt.»'},
{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hva er rett tegnsetting? «Jeg liker ikke regn ___ kaldt vær»',
 alt:['eller','og','men','–'],fasit:'eller',
 regel:'«Eller» binder alternativ sammen. Mellom to ledd uten subjekt trengs ikke komma.',
 eks:'Jeg liker ikke regn eller kaldt vær.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'lett',
 q:'Hvor setter du komma? «Selv om hun var trøtt gikk hun på skolen.»',
 alt:['Selv om hun var trøtt, gikk hun på skolen.','Selv, om hun var trøtt gikk hun på skolen.','Selv om hun var trøtt gikk, hun på skolen.','Ingen komma nødvendig.'],fasit:'Selv om hun var trøtt, gikk hun på skolen.',
 regel:'Etter innledende leddsetning setter en komma.',
 eks:'Selv om hun var trøtt, gikk hun på skolen.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hva er riktig bruk av tankestrek (–)?',
 alt:['Hun opna døra – og fraus til is.','Hun opna – døra og fraus til is.','Hun opna døra og – fraus til is.','Hun opna – døra – og fraus til is.'],fasit:'Hun opna døra – og fraus til is.',
 regel:'Tankestrek brukes for å markere ei dramatisk pause eller et uventa skifte.',
 eks:'Hun opna døra – og fraus til is.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'medium',
 q:'Hva er feil bruk av kolon?',
 alt:['Hun hadde én draum: å bli lege.','Hun hadde: en draum om å bli lege.','Hun kjøpte tre ting: brød, mjølk og smør.','Det er bare én regel: vær ærleg.'],fasit:'Hun hadde: en draum om å bli lege.',
 regel:'Kolon brukes etter et fullstendig ledd, ikke midt i en setningsdel.',
 eks:'Hun hadde én draum: å bli lege.'},

{kat:'tegnsetting',kat_label:'Tegnsetting',type:'mc',vanske:'vanskelig',
 q:'Hver er komma nødvendig? «Læraren som underviser i norsk heiter Kari.»',
 alt:['Læraren, som underviser i norsk, heiter Kari. – fordi bisetningen er ikke-restriktiv','Ingen komma – bisetningen er en integrert del av meningen','Læraren som underviser i norsk, heiter Kari. – éitt komma etter leddsetning','Komma bare etter «norsk» – etter adverbial'],fasit:'Læraren, som underviser i norsk, heiter Kari. – fordi bisetningen er ikke-restriktiv',
 regel:'Ikke-restriktiv relativsetning (tilleggsinfo) omsluttast av komma. Restriktiv (identifiserande) trenger ikke komma.',
 eks:'Læraren, som alltid er snill, heiter Kari. vs. Læraren som er streng er min favoritt.'},



/* ── ORDKLASSAR (20 oppgaver) ── */
{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Hva ordklasse hører «rask» til i setningen «Han er en rask løpar»?',
 alt:['Adjektiv','Substantiv','Verb','Adverb'],fasit:'Adjektiv',
 regel:'Adjektiv beskriver et substantiv. Her beskriver «rask» substantivet «løper».',
 eks:'en rask løpar, ei stor jente, et raudt hus'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Hva ordklasse er «spring» i «Han spring fort»?',
 alt:['Verb','Substantiv','Adjektiv','Adverb'],fasit:'Verb',
 regel:'Verb sier noe om hva noen gjør, tenkjer eller er. «Spring» er handlingsverbet her.',
 eks:'spring, hoppar, les, skriver, søv'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Hva ordklasse er «fort» i «Han spring fort»?',
 alt:['Adverb','Adjektiv','Verb','Preposisjon'],fasit:'Adverb',
 regel:'Adverb sier noe om hvordan, når, hvor mye eller hvor. Her sier «fort» hvordan han spring.',
 eks:'fort, sakte, alltid, aldri, svært, ganske'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Hva ordklasse er «skolen» i «Jeg går på skolen»?',
 alt:['Substantiv','Verb','Adjektiv','Pronomen'],fasit:'Substantiv',
 regel:'Substantiv er namn på personar, ting, steder og begrep. «Skolen» er et substantiv.',
 eks:'skolen, huset, læreren, kjærleik, fred'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskelig',
 q:'Hva ordklasse er «etter» i «Hun kom etter skolen»?',
 alt:['Preposisjon','Adverb','Konjunksjon','Adjektiv'],fasit:'Preposisjon',
 regel:'Preposisjonar viser forhold (tid, sted, retting) mellom ledd i setningen. «Etter» viser her tidsforhold.',
 eks:'etter, før, på, i, med, til, fra, over'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Hva ordklasse er «vakker» i «Hun er ei vakker jente»?',
 alt:['Adjektiv','Substantiv','Verb','Adverb'],fasit:'Adjektiv',
 regel:'Adjektiv beskriver et substantiv og svarer på spørsmålet «hvordan er det?». «Vakker» beskriver her substantivet «jente».',
 eks:'ei vakker jente · en høy gutt · et rolig hus'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Hva ordklasse er «hun» i «Hun les ei bok»?',
 alt:['Pronomen','Substantiv','Adjektiv','Verb'],fasit:'Pronomen',
 regel:'Pronomen erstatter eller peker på et substantiv. «Hun» viser til en bestemt person og erstatter et egennavn.',
 eks:'hun, han, de, jeg, du, vi, det, sin, seg'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Hva ordklasse er «og» i «Jeg ete og drikk»?',
 alt:['Konjunksjon','Preposisjon','Adverb','Pronomen'],fasit:'Konjunksjon',
 regel:'Konjunksjoner binder sammen setninger eller setningsledd av samme type. «Og» binder her to verb sammen.',
 eks:'og, men, for, eller, samt, men · binder ledd av samme grammatiske rang'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Hva ordklasse er «aldri» i «Han kommer aldri»?',
 alt:['Adverb','Adjektiv','Konjunksjon','Preposisjon'],fasit:'Adverb',
 regel:'Adverb sier noe om tid, sted, måte eller grad. «Aldri» er et tidsadverb som nekter handlingen.',
 eks:'aldri, alltid, ofte, sjeldnere, svært, nesten, akkurat nå'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskelig',
 q:'Hvilken ordklasse er «fordi» i «Hun gikk hjem fordi hun var trøtt»?',
 alt:['Subjunksjon','Konjunksjon','Adverb','Preposisjon'],fasit:'Subjunksjon',
 regel:'Subjunksjoner innleder leddsetninger og binder dem til hovedsetningen. «Fordi» innleder en årsaks-leddsetning. Til forskjell fra konjunksjoner binder subjunksjoner aldri to jamstilte setninger.',
 eks:'fordi, at, når, om, selv om, mens, siden, hvis'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskelig',
 q:'Hva ordklasse er «eigen» i «Hun har si egen mening»?',
 alt:['Adjektiv','Pronomen','Adverb','Substantiv'],fasit:'Adjektiv',
 regel:'«Eigen/si egen» er et possessivt adjektiv. Det bøyes etter substantivet det beskriver (eget/eigen/egen/egne) og viser tilhørighet.',
 eks:'sin eigen draum, si egen bok, sitt eget val, sine egne ord'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'cloze',vanske:'lett',
 q:'«raskt» i «Han sprang raskt» er et ___.',
 hint:'Ordet sier noe om hvordan han sprang. Det endrer et verb.',
 fasit:'adverb',fasit_v:['adverb','adverb (måtesadverb)'],
 regel:'Adverb modifiserer verb, adjektiv eller andre adverb. Her modifiserer «raskt» verbet «sprang» og sier noe om hvordan.',
 eks:'Han sprang raskt · Hun sang vakkert · De jobbet hardt'},



{kat:'ordklassar',kat_label:'Ordklassar',type:'cloze',vanske:'medium',
 q:'«på» i «Boka ligger på bordet» er ei ___.',
 hint:'Ordet viser en romlig relasjon, der noe er plassert i forhold til noe annet.',
 fasit:'preposisjon',fasit_v:['preposisjon'],
 regel:'Preposisjoner uttrykker forhold (sted, tid, retning) mellom ledd i setningen. De kommer alltid foran et substantiv eller pronomen.',
 eks:'på bordet · i huset · til skolen · fra byen · over brua'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'lett',
 q:'Ordklasse-sorteraren: Dra hvert ord til rett boks – Substantiv eller Verb.',
 kolonner:['Substantiv','Verb'],
 ord:[
  {tekst:'bok',fasit:0},{tekst:'spring',fasit:1},{tekst:'hund',fasit:0},
  {tekst:'søv',fasit:1},{tekst:'skolen',fasit:0},{tekst:'skriver',fasit:1},
  {tekst:'glede',fasit:0},{tekst:'hoppar',fasit:1}
 ],
 regel:'Substantiv er namn på ting, personar, steder og begrep. Verb sier noe om hva noen gjør, tenkjer eller er.',
 eks:'Substantiv: bok, hund, skolen, glede · Verb: spring, søv, skriver, hoppar'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'medium',
 q:'Ordklasse-sorteraren: Dra hvert ord til rett boks – Adjektiv eller Adverb.',
 kolonner:['Adjektiv','Adverb'],
 ord:[
  {tekst:'rask',fasit:0},{tekst:'raskt',fasit:1},{tekst:'vakker',fasit:0},
  {tekst:'alltid',fasit:1},{tekst:'stille (stille hus)',fasit:0},{tekst:'stille (sit stille)',fasit:1},
  {tekst:'glad',fasit:0},{tekst:'svært',fasit:1}
 ],
 regel:'Adjektiv beskriver substantiv og bøyes etter dem. Adverb modifiserer verb, adjektiv eller andre adverb og bøyes ikke.',
 eks:'rask gut (adjektiv) · spring raskt (adverb) · glad (adj) · alltid (adv)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'vanskelig',
 q:'Ordklasse-sorteraren: Dra hvert ord til rett boks – Pronomen eller Konjunksjon.',
 kolonner:['Pronomen','Konjunksjon'],
 ord:[
  {tekst:'hun',fasit:0},{tekst:'og',fasit:1},{tekst:'de',fasit:0},
  {tekst:'men',fasit:1},{tekst:'seg',fasit:0},{tekst:'eller',fasit:1},
  {tekst:'sin',fasit:0},{tekst:'for (=for at)',fasit:1}
 ],
 regel:'Pronomen erstatter eller peker på substantiv. Konjunksjoner binder sammen setninger eller setningsledd av samme type.',
 eks:'Pronomen: hun, de, seg, sin · Konjunksjon: og, men, eller, for'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'finn_feil',vanske:'medium',
 q:'Ordklasse-spottaren: Klikk på hvert ord som er et VERB i setningen nedenfor.',
 tekst:'Hunden spring fort og bjeffer høyt når naboen kommer.',
 fasit_feil:['spring','bjeffer','kommer'],
 regel:'Verb sier noe om hva noen gjør, tenker eller er. I denne setningen: «spring», «bjeff er» og «kommer» er handlings- og tilstandsverb.',
 eks:'Finittverb bøyes etter tid og person: spring (presens), sprang (preteritum)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'finn_feil',vanske:'medium',
 q:'Ordklasse-spottaren: Klikk på hvert ord som er et SUBSTANTIV i setningen nedenfor.',
 tekst:'Læraren skreiv ei lang oppgave på tavla hver dag.',
 fasit_feil:['læreren','oppgave','tavla'],
 regel:'Substantiv er namn på personar, ting, steder og begrep. Her: «læreren» (person), «oppgave» (ting/abstrakt), «tavla» (ting/sted).',
 eks:'«dag» er òg substantiv her – «hver dag» (adverbial). Merk: tidsuttrykk kan være substantiv i adverbiell bruk.'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_ord',vanske:'middels',
 q:'Kjernerekkefølge: Trykk ordene inn i rett rekkefølge – adjektivet MÅ komme rett FØR substantivet det beskriver.',
 ord:['blå','En','himmel','klar','og'],
 fasit:'En blå og klar himmel',
 regel:'Adjektiv kommer normalt direkte FØR substantivet de beskriver. Flere adjektiv på rad bindes med «og». Rekkefølge: [artikkel] + [adj] + [og] + [adj] + [subst].',
 eks:'en stor og gammel mann · et blått og stille hav'},

/* ── KJELDEKRITIKK (10 nye oppgaver i kildebruk) ── */
{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hva er den viktigaste grunnen til å sjekke kilden før du bruker hun?',
 alt:['For å vite om informasjonen er påliteleg og korrekt','For å finne lengste artikkelen','For å unngå å lese for mye','For å finne flest mulige kjelder'],
 fasit:'For å vite om informasjonen er påliteleg og korrekt',
 regel:'Kjeldekritikk handler om å vurdere truverd, aktualitet og relevans før du bruker ei kilde.',
 eks:'Sjekk: Hvem skreiv det? Når? Hva er formålet med siden?'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hva er ei primærkjelde?',
 alt:['En original kilde, t.d. en rapport eller ei lov','En artikkel som oppsummerer andre kjelder','En Wikipedia-artikkel','Ei lærebok'],
 fasit:'En original kilde, t.d. en rapport eller ei lov',
 regel:'Primærkjelde = originalkjelda. Sekundærkjelde = en annen sin omtale av primærkjelda.',
 eks:'NOU-rapport = primærkjelde. Avisartikkel om rapporten = sekundærkjelde.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'lett',
 q:'Hvorfor er Wikipedia ikke alltid ei påliteleg kilde?',
 alt:['Alle kan redigere artiklane, så innhaldet kan være feil','Wikipedia har aldri rett','Wikipedia er bare på engelsk','Wikipedia kostar pengar'],
 fasit:'Alle kan redigere artiklane, så innhaldet kan være feil',
 regel:'Wikipedia er et godt startpunkt, men ikke en citerbar kilde. Bruk heller originalkilder Wikipedia lenkar til.',
 eks:'Finn kilden Wikipedia oppgir – det er den du bør sitere.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Du finn to artiklar om klimaendringer. Éin er fra Miljødirektoratet (2024), én er fra en anonym blogg (2019). Hva vel du?',
 alt:['Miljødirektoratet – offisiell, faglig og nylig','Bloggen – han er enklare å lese','Begge er like gode','Ingen av de – du trenger bare Wikipedia'],
 fasit:'Miljødirektoratet – offisiell, faglig og nylig',
 regel:'Prioriter: offisielle organer, forskere, fagblad og nyhetsbyråer foran anonyme blogger.',
 eks:'Miljødirektoratet.no > anonym blogg'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva spørsmål bør du stille om KVEN som har skrive ei kilde?',
 alt:['Er forfattaren ekspert? Har forfattaren interesser i saka?','Hvor lang er artikkelen?','Hvor mange ord er i artikkelen?','Er artikkelen på nynorsk?'],
 fasit:'Er forfattaren ekspert? Har forfattaren interesser i saka?',
 regel:'Vurder: kompetanse (er forfattaren ekspert?) og agenda (kan forfattaren ha grunn til å vri sanninga?).',
 eks:'En tobakksforskar betalt av tobakksindustrien kan ha en agenda.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Hva vil det si at ei kilde er «aktuell»?',
 alt:['Hun er ny nok til at informasjonen fremdeles er gyldig','Hun er spennande å lese','Hun har mange bilder','Hun er fra Noreg'],
 fasit:'Hun er ny nok til at informasjonen fremdeles er gyldig',
 regel:'Aktualitet = er kilden ny nok? Statistikk fra 2005 om sosiale medier er ikke aktuell i 2025.',
 eks:'Medisinsk forskning: maks 5–10 år. Historisk kilde: alder spiller mindre rolle.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Du finn en artikkel med overskrifta «SJOKK: Skular dreper kreativiteten!». Hva bør du tenke?',
 alt:['Kritisk – clickbait-overskrifter kan indikere upålitelig kilde','Dette er sikkert sant siden det er dramatisk','Dramatiske overskrifter er alltid mer pålitelige','Det spiller ingen rolle hvordan overskriften er'],
 fasit:'Kritisk – clickbait-overskrifter kan indikere upålitelig kilde',
 regel:'Sensasjonsoverskrifter er et varseltegn. Sjekk: hvem skrev det, hva er kilden, er det dekning for påstanden?',
 eks:'«SJOKK», «DU VIL IKKE TRO», «SKJULT SANNHET» = typisk clickbait.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskelig',
 q:'Hva er forskjellen på en faktabasert kilde og en meningskilde?',
 alt:['Faktakilde presenterer dokumenterbare fakta; meningskilde presenterer synspunkt','Faktakilder er alltid lengre','Meningskilder er alltid upålitelige','De er det samme – alle kilder er meninger'],
 fasit:'Faktakilde presenterer dokumenterbare fakta; meningskilde presenterer synspunkt',
 regel:'Faktakilder: statistikk, forskning, lovtekster. Meningskilder: lederartikler, blogginnlegg, debattinnlegg. Begge kan være relevante – men du må vite hva type du bruker.',
 eks:'SSB-statistikk = faktakilde. Kronikk i Aftenposten = meningskilde.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskelig',
 q:'Du leser at «Forskning viser at sjokolade kurerer forkjøling». Hva bør du sjekke?',
 alt:['Hvilken forskning? Hvor er studien publisert? Er den fagfellevurdert?','Ingenting – forskning er alltid sant','Hvor mye sjokolade det gjelder','Om sjokolade smaker godt'],
 fasit:'Hvilken forskning? Hvor er studien publisert? Er den fagfellevurdert?',
 regel:'«Forskning viser» uten referanse er et varseltegn. Sjekk: hvilken studie, hvor er den publisert, er den fagfellevurdert?',
 eks:'Fagfellevurderte tidsskrift (peer review) = høy standard.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskelig',
 q:'Hva er det beste teiknet på at ei nettside er truverdig?',
 alt:['Kjend forfatter med faglig bakgrunn, kjeldetilvisingar og publiseringsdato','Mange bilder og god design','Lang URL','At siden er gratis'],
 fasit:'Kjend forfatter med faglig bakgrunn, kjeldetilvisingar og publiseringsdato',
 regel:'Truverdig nettside: klar forfatter, faglig bakgrunn, kjeldar oppgitt, dato, organisasjon bak oppgitt.',
 eks:'Forskning.no: forfatter oppgjeven, faglig redaksjon, kjeldar lenka.'},

/* ── OPPGÅVETOLKING (20) ── */
{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva er et «bestillingsord» i ei oppgåveformulering?',
 alt:['Ord som handler om bestilling av varer','Verba som fortel hva du faktisk skal gjøre i oppgaven','De lengste ordene i teksten','Ord som definerer emnet du skal skrive om'],
 fasit:'Verba som fortel hva du faktisk skal gjøre i oppgaven',
 regel:'Bestillingsord er verba som styrer oppgaven – t.d. drøft, grei ut, presenter, samanlikn, reflekter. De fortel nøyaktig hva handling du skal utføre.',
 eks:'«Drøft konsekvensene av klimaendringer.» – «drøft» er bestillingsord.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsord «drøft» i ei norskoppgåve?',
 alt:['Presenter bare ett synspunkt','Skriv en kreativ forteljing om emnet','Vis fram to sider av ei sak og veg de opp mot hverandre','Beskriver hvordan noe ser ut'],
 fasit:'Vis fram to sider av ei sak og veg de opp mot hverandre',
 regel:'«Drøft» = presenter argument for og mot, og trekk ei konklusjon. Unngå å bare liste opp synspunkt – du skal verdivurdere de.',
 eks:'«Drøft om skolen bør forby mobiltelefonar.» = argument for + mot + konklusjon.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsord «grei ut om» i ei oppgave?',
 alt:['Ta tydelig stilling for én side av saka','Forklar og informer grundig om et emne','Samanlikn to ulike syn','Skriv en kreativ tekst'],
 fasit:'Forklar og informer grundig om et emne',
 regel:'«Grei ut om» = forklarande og informerande skriving. Du skal presentere fakta og samanhengar uten nødvendigvis å ta stilling.',
 eks:'«Grei ut om årsaker til utenforskap» = skriver en forklarande tekst om hvorfor utenforskap oppstår.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva er «konteksten» i ei oppgåveformulering?',
 alt:['Sjølve instruksen – det du skal gjøre','Kjeldelistekrava i oppgaven','Bakgrunnsinformasjonen om emnet','Tittelforslaget du skal bruke'],
 fasit:'Bakgrunnsinformasjonen om emnet',
 regel:'En oppgave er ofte delt i to: kontekst (bakgrunnsinfo/emne) + instruks (hva du faktisk skal gjøre). Bare instruksen er det du svarer på.',
 eks:'«Plast i havet er et aukande problem. [kontekst] → Drøft mulige løsninger. [instruks]»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsord «samanlikn» i ei oppgave?',
 alt:['Ta tydelig stilling til hva som er best','Beskriver bare én av tinga grundig','Peik på likskapar og skilnader mellom to eller flere ting','Skriv historia til begge tinga'],
 fasit:'Peik på likskapar og skilnader mellom to eller flere ting',
 regel:'«Samanlikn» = finn og forklar det som er likt og det som er ulikt. Strukturer gjerne: først det eine, så det andre, deretter samanlikninga.',
 eks:'«Samanlikn to poetiske tekster» = skriver om likskapar og skilnader i tema, form og virkemiddel.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Les oppgaven: «Noreg er et av verdas rikaste land. Reflekter over hvordan dette påverkar identiteten til nordmenn.» Hva er bestillingsord?',
 alt:['Noreg','påverkar','reflekter','rikaste'],
 fasit:'reflekter',
 regel:'Bestillingsord er verbet som sier hva du skal gjøre. «Reflekter» = tenk over, vurder kritisk og skriver tanker og innsikter.',
 eks:'«Noreg er et av verdas rikaste land» er kontekst. «Reflekter» er det som styrer hva du skal skrive.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva sier: «Presenter hovudkaraktaren, og drøft hvordan forfattaren bruker kontrastar.» Hvor mange delar har oppgaven?',
 alt:['Éi del','To delar','Tre delar','Fire delar'],
 fasit:'To delar',
 regel:'Bruk komma og bindeord som signal: «presenter … OG drøft» = to krav. Telje alltid hvor mange bestillingsord oppgaven inneheld.',
 eks:'Del 1: presenter hovudkaraktaren. Del 2: drøft bruken av kontrastar.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva er: «Presenter temaet plast i havet, grei ut om de viktigaste årsakene, og drøft mulige løsninger. Bruk minst to kjelder.» Hvor mange bestillingsord (oppgåveord) inneheld oppgaven?',
 alt:['Éitt (drøft)','To (presenter og drøft)','Tre (presenter, grei ut, drøft)','Fire (presenter, grei ut, drøft, bruk)'],
 fasit:'Tre (presenter, grei ut, drøft)',
 regel:'Bestillingsord er verb som sier hva du skal gjøre: presenter, grei ut, drøft. «Bruk minst to kjelder» er et metodekrav, ikke et bestillingsord.',
 eks:'Del 1: presenter temaet. Del 2: grei ut om årsaker. Del 3: drøft løsninger. + krav: minst to kjelder.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva ber om å «drøfte». Hva innleiar er et BOMSKOT?',
 alt:['«Det er ulike meiningar om dette temaet…»','«I denne teksten vil jeg se på argument for og mot…»','«Her kommer historia om da jeg selv opplevde…»','«Mange mener at X, men andre hevder at Y…»'],
 fasit:'«Her kommer historia om da jeg selv opplevde…»',
 regel:'«Drøft» ber om en resonnerende tekst, ikke ei personlig forteljing. Innleiinga skal signalisere at du vil vurdere ulike sider av saka.',
 eks:'BOMSKOT: starte som ei novelle. RETT: presentere saka og varsle om at du vil drøfte hun.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva sier «reflekter». Hva betyr det?',
 alt:['Gjenfortell hendelsene i rekkefølge','Vurder emnet kritisk med egne tanker og innsikter','Skriv et kort sammendrag av fakta','Beskriv emnet så objektivt som mulig'],
 fasit:'Vurder emnet kritisk med eigne tankar og innsikter',
 regel:'«Reflekter» = se tilbake, tenke over, vurdere med eget perspektiv. Bruk gjerne «jeg»-stemma kombinert med faglig grunngjeving.',
 eks:'«Reflekter over hvordan reklame påverkar deg.» = hva ser du, hvorfor skjer det, hva mener du om det.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskelig',
 q:'Oppgåva lyder: «Med utgangspunkt i to av tekstane du har lese dette semesteret, analyser hvordan tema kommer til uttrykk gjennom virkemiddel.» Hva er den mest presise tolkinga?',
 alt:['Samanlikn to tekster generelt','Vel to frie tekster og skriver om de','Analyser virkemiddel i to sjølvvalde tekster fra pensum','Presenter to favoritttekstar dine'],
 fasit:'Analyser virkemiddel i to sjølvvalde tekster fra pensum',
 regel:'«Med utgangspunkt i» = bruk disse som grunnlag. «Analyser» = undersøk systematisk. «To av tekstane … dette semesteret» = fra pensum. Oppgåva set tre avgrensingar: tal tekster, hver fra, hva du skal gjøre.',
 eks:'Alle tre avgrensingar må være med: to tekster, fra pensum, fokus på virkemiddel og tema.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskelig',
 q:'Tre elever svarer på «Drøft om teknologi gjør oss mer isolerte». Hvem er på BOMMERT?',
 alt:['Elev A viser argument for og mot, og konkluderer','Elev B skriver om historia til internett og teknologien sin utvikling','Elev C bruker tre kjelder og veg side mot side','Elev D startar med ei personlig oppleving, drøftar og konkluderer'],
 fasit:'Elev B skriver om historia til internett og teknologien sin utvikling',
 regel:'«Drøft» = veg argument for og mot påstanden. Å skrive historia til noe er et «grei ut»-svar, ikke drøfting.',
 eks:'Bomskot: svare med feil sjanger. Her er et «grei ut»-svar brukt der «drøft» var kravet.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskelig',
 q:'Oppgåva sier: «Drøft hva konsekvenser økt sosiale medier-bruk har for identitetsutvikling hjå ungdom.» Hva er den BESTE problemstillinga?',
 alt:[
  'Hva er sosiale medier?',
  'Er sosiale medier bra eller dårlig for ungdom?',
  'Hva positive og negative konsekvenser har økt bruk av sosiale medier for hvordan ungdom utviklar identiteten sin?',
  'Hvorfor bruker ungdom så mye sosiale medier?'
 ],
 fasit:'Hva positive og negative konsekvenser har økt bruk av sosiale medier for hvordan ungdom utviklar identiteten sin?',
 regel:'Problemstillinga skal (1) spegle bestillingsord (drøft = flere sider), (2) innehalde emnet (identitetsutvikling), og (3) være presis nok til å avgrense teksten.',
 eks:'«Hva er sosiale medier?» er for breitt. «Bra eller dårlig?» er for enkel. Den gode problemstillinga inviterer til å drøfte begge sider av konsekvensene.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskelig',
 q:'Oppgåva sier: «Analyser en av kildene du har brukt.» Hva avgrensing overser elever oftast?',
 alt:['At de skal bruke fagomgrep','At teksten skal være lang nok','At de skal velje bare én kilde','At de skal skrive på nynorsk'],
 fasit:'At de skal velje bare én kilde',
 regel:'«En av kildene» er ei eksplisitt avgrensing. Mange skriver om alle kildene fordi de les for fort. Marker alltid talord i oppgaven som en del av sjekkbokslista di.',
 eks:'«En av» = bare én kilde. «Minst to» = minimum to. Talord i oppgaven avgrensar omfanget.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'lett',
 q:'Oppgaven er: «Drøft om skolen bør innføre mobilforbud.» Sorter hvert kort: passer formuleringene til oppgaven, eller passer de IKKE?',
 kolonner:['Passer til oppgaven','Passer IKKE til oppgaven'],
 ord:[
  {tekst:'Argument for mobilforbod',fasit:0},
  {tekst:'Argument mot mobilforbod',fasit:0},
  {tekst:'Konklusjon/egen vurdering',fasit:0},
  {tekst:'Personleg forteljing om mobiltjuveri',fasit:1},
  {tekst:'Historia til mobiltelefonen (1973–i dag)',fasit:1},
  {tekst:'Hvordan en lager en mobiltelefon',fasit:1}
 ],
 regel:'«Drøft» = presenter argument for og mot + konklusjon. Personlige fortellinger og historiske utredninger hører ikke hjemme uten tydelig kobling til selve drøftingsspørsmålet.',
 eks:'HØRER HJEMME: «Forsking viser at mobilbruk i undervisningen reduserer konsentrasjonen» · HØRER IKKE HJEMME: «I 1973 skapte Martin Cooper den første mobilen»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'medium',
 q:'Oppgaven er: «Analyser hvordan forfatteren bruker naturskildringer i novellen.» Sorter hva som hører hjemme i svaret ditt.',
 kolonner:['Hører hjemme i svaret','Hører IKKE hjemme i svaret'],
 ord:[
  {tekst:'Hvilken funksjon har naturskildringa i teksten?',fasit:0},
  {tekst:'Hvordan skaper naturskildringen stemning?',fasit:0},
  {tekst:'Hvilke litterære virkemidler bruker forfatteren?',fasit:0},
  {tekst:'Handlingsreferat: hva skjer i novellen?',fasit:1},
  {tekst:'Egen mening om at naturskildringene er fine',fasit:1},
  {tekst:'Forfatterens biografi og liv',fasit:1}
 ],
 regel:'«Analyser» = undersøk systematisk hvordan noe er bygd opp og hvilken funksjon det har. Handlingsreferat og egne meninger uten faglig begrunnelse er ikke analyse.',
 eks:'Analyse = virkemiddel + funksjon. IKKE = «jeg synes dette er fint» eller «i novellen skjer det at...»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'vanskelig',
 q:'Oppgaven er: «Sammenlign to tekster fra pensum med hensyn til tema og fortellerperspektiv.» Sorter hvert forslag.',
 kolonner:['Svarer på oppgaven','Svarer IKKE på oppgaven'],
 ord:[
  {tekst:'Likheter og forskjeller i tema mellom tekstene',fasit:0},
  {tekst:'Hvem er fortelleren i hver tekst og hvilken effekt gir det?',fasit:0},
  {tekst:'Sammenlignende analyse med konklusjon',fasit:0},
  {tekst:'Grundig analyse av bare én tekst',fasit:1},
  {tekst:'Generell utgreiing om fortellerteori',fasit:1},
  {tekst:'Personlig leserrespons uten tekstbelegg',fasit:1}
 ],
 regel:'«Sammenlign» = likheter + forskjeller, begge tekstene, samme fokus (tema + fortellerperspektiv). Å analysere bare én tekst svarer ikke på oppgaven.',
 eks:'Sammenligning krever: tekst A og tekst B analysert langs samme dimensjoner → konklusjon om likheter/forskjeller'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Hva betyr bestillingsord «presenter» i ei oppgave?',
 alt:['Ta stilling for og mot emnet','Gi ei kortfatta, informativ fremstilling av emnet','Skriv en kreativ tekst om emnet','Diskuter emnet med en medelev'],
 fasit:'Gi ei kortfatta, informativ fremstilling av emnet',
 regel:'«Presenter» = gi et oversyn, introduser emnet på en klar og ordna måte. Du trenger ikke ta stilling. Det er ofte første del av ei lengre oppgave.',
 eks:'«Presenter hovudkaraktaren» = namn, egenskaper, rolle i handlinga. Ikke analyse, ikke meiningar.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'cloze',vanske:'medium',
 q:'Oppgåva sier «analyser». Det betyr at du skal undersøke ___ teksten er bygd opp og hva effekt de ulike grepa har.',
 hint:'Analyse er ikke å meine noe om teksten – det er å undersøke en bestemt ting: strukturen.',
 fasit:'hvordan',fasit_v:['hvordan','hvordan/hvorfor'],
 regel:'Analyse = systematisk undersøking av hvordan noe er laget og hva det gjør med leseren. Spørsmålet «hvordan» er nøkkelen.',
 eks:'«Hvordan bruker forfattaren metaforar?» · «Hvordan skaper forteljarstemma nærleik?»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskelig',
 q:'Oppgåva lyder: «Grei ut om årsaker til einsemd blant unge, og drøft hva samfunnet kan gjøre for å motverke dette.» Hva er den BESTE to-stegs-planen?',
 alt:[
  'Del 1: drøft tiltak mot einsemd. Del 2: grei ut om årsaker til einsemd.',
  'Skriv om einsemd fra et personlig perspektiv, deretter presenter løsninger.',
  'Del 1: grei ut om årsaker til einsemd (forklarande del). Del 2: drøft tiltak mot einsemd (argumenterande del).',
  'Skriv generelt om einsemd og nemn årsaker og tiltak undervegs.'
 ],
 fasit:'Del 1: grei ut om årsaker til einsemd (forklarande del). Del 2: drøft tiltak mot einsemd (argumenterande del).',
 regel:'En oppgave med flere bestillingsord krever en plan som behandler hvert krav i rett rekkefølge. «Gjør rede for» kommer alltid FØR «drøft» – du må forstå problemet før du kan diskutere løsninger.',
 eks:'Bomskot: bytte om rekkjefølga. «Grei ut» kommer alltid FØRST – du kan ikke drøfte løsninger på et problem du ikke har forklart.'},

/* ── TEKSTSTRUKTUR: Sorter burgeren, Linjeskift-kuttaren, Overskriftsruletten ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'lett',
 q:'Tekstburgeren: Dra hvert avsnitt til rett del av teksten.',
 kolonner:['Innledning','Hovuddel','Avslutning'],
 ord:[
  {tekst:'Plast i havet er et aukande problem som påverkar dyr og natur over hele verden.',fasit:0},
  {tekst:'Éi løsning er å innføre strengare regulering av eingongsplast i alle EU-land.',fasit:1},
  {tekst:'I tillegg kan produsentar påleggjast å bruke mer resirkulert materiale.',fasit:1},
  {tekst:'Kjeldesortering og bedre infrastruktur i fattigare land kan òg redusere problemet.',fasit:1},
  {tekst:'Alt i alt viser dette at løysinga på plastforurensning krever samarbeid på tvers av landegrenser.',fasit:2}
 ],
 regel:'Innleiinga presenterer temaet, hoveddelen utdyper argumentene, og avslutningen summerer eller konkluderer.',
 eks:'Innledning → presentasjon · Hovuddel → argument/analyse · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'medium',
 q:'Tekstburgeren: Dra hvert avsnitt fra en fagartikkel om sosiale medier til rett del av teksten.',
 kolonner:['Innledning','Hovuddel','Avslutning'],
 ord:[
  {tekst:'Hva konsekvenser har den eksploderande veksten i sosiale medier for ungdommen si psykiske helse?',fasit:0},
  {tekst:'Sosiale medier bruker algoritmane sine til å vise oss innhold vi allerede er enige i.',fasit:1},
  {tekst:'Studiar fra flere land viser at mye tid på sosiale medier heng sammen med økt angst.',fasit:1},
  {tekst:'Samla sett er det tydelig at bruken av sosiale medier krever medvit, grenser og digital folkeskikk.',fasit:2}
 ],
 regel:'Innleiinga stiller gjerne et spørsmål eller presenterer problemet. Hovuddelen analyserer med fakta og argument. Avslutningen konkluderer.',
 eks:'Spørsmål/problem → analyse → konklusjon = god fagartikkelstruktur'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'avsnitt_klikk',vanske:'lett',
 q:'Linjeskift-kuttaren: Klikk på det første ordet i hvert avsnitt for å lage et nytt avsnittsskifte.',
 segments:[
  {id:'s0',tekst:'Klimaendringer er et av de største problemene vi står overfor i dag.'},
  {id:'s1',tekst:'Gjennomsnittstemperaturen på jorda har steget med over 1,1 grad siden den industrielle revolusjonen.',first_word:'Gjennomsnittstemperaturen',break_before:true},
  {id:'s2',tekst:'For å stoppe oppvarmingen må verdenssamfunnet redusere utslipp dramatisk.',first_word:'For',break_before:true},
  {id:'s3',tekst:'Mange land har allerede innført lover og begrensninger på karbonutslipp.',first_word:'Mange',break_before:false}
 ],
 fasit_breaks:['s1','s2'],
 regel:'Nytt avsnitt = ny tanke eller nytt poeng. Ikke hvert punkt på ny linje, men logiske steg i resonnementet.',
 eks:'Innledning (problem) → Fakta-avsnittet → Løsningsavsnittet'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Overskrifts-ruletten: Hva er den mest presise og faglige overskrifta for en fagartikkel om klimaendringer og ungdom?',
 alt:[
  'Klimaendringer: hva ungdom kan gjøre',
  'Det er veldig viktig å redde planeten vår no!!!',
  'En liten tekst om klima og sånne ting',
  'Klimakrisa forklarert av meg selv'
 ],
 fasit:'Klimaendringer: hva ungdom kan gjøre',
 regel:'En god faglig overskrift er presis, nøytral i tone og lovar leseren hva teksten handler om. Unngå utropsteikn, skrivefeil og vage formuleringar.',
 eks:'GOD: «Sosiale medier og psykisk helse hos ungdom». DÅRLEG: «Sosiale medier er kjempeskadelege!!!»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Overskriftsruletten: Hva er den mest faglige overskrifta for en analyse av to dikt om einsemd?',
 alt:[
  'Einsemd i lys av to dikt: ei samanliknande analyse',
  'To dikt som handler om einsemd og trist stemning osv.',
  'EINSEMD I DIKT (veldig interessant tekst!!!)',
  'Jeg synes disse dikta er kjempefine'
 ],
 fasit:'Einsemd i lys av to dikt: ei samanliknande analyse',
 regel:'En faglig tittel namngjev teksttype (analyse), emne (einsemd) og metoden (samanliknande). Unngå subjektive meiningar og overdrivne tegn.',
 eks:'Format: [Emne]: ei [sjanger/metode] – t.d. «Klimakrisa: ei drøfting av tiltak og ansvar»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'vanskelig',
 q:'Overskriftsruletten: Hva overskrift er best for et drøftende debattinnlegg om skjermtid hos born?',
 alt:[
  'Skjermtid og born: ei drøfting av grenser og ansvar',
  'Bør born bruke mobil? Ja eller nei?',
  'Jeg mener at born ikke bør bruke skjerm for mye',
  'Skjerm, born, foreldre og problem – ei utgreiing'
 ],
 fasit:'Skjermtid og born: ei drøfting av grenser og ansvar',
 regel:'Overskrifta presiserer emnet (skjermtid + born), sjangeren (drøfting) og hva aspekt som blir handsama (grenser + ansvar). Unngå slagord, ja/nei-spørsmål og lange oppramsingar.',
 eks:'Godt format: «[Emne]: ei [sjanger/metode] av [aspekt(ar)]»'},

/* ── SPRÅK OG STIL (23) ── */
{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'lett',
 q:'Følelseskutteren: Klikk på hvert ord i teksten som er for subjektivt eller uformelt til å høre hjemme i en fagartikkel.',
 tekst:'Sosiale medier er jo helt avhengigheitsskapande, og jeg mener utvilsamt at dette er skikkelig skadelig.',
 fasit_feil:['jo','helt','jeg','mener','utvilsamt','skikkelig'],
 regel:'Fagartiklar unngår forsterkingsord som «helt» og «skikkelig», interjeksjonar som «jo», og meiningssignal som «jeg mener». Set fakta og forsking i sentrum.',
 eks:'UNNGÅ: «jeg mener at dette er helt sjukt farlig» · SKRIV: «Forsking viser at dette er en alvorlig risiko.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Utropsteikn-fengselet: Hva versjon av setningen er skriven i et sakleg, faglig register?',
 alt:['PLAST ER FARLEG!!!','Plast er faktisk VELDIG farlig for dyr og natur!!!','Plast representerer en dokumentert risiko for marint dyreliv.','Plast er jo farlig!! Dette må vi ta alvorlig!!'],
 fasit:'Plast representerer en dokumentert risiko for marint dyreliv.',
 regel:'Store bokstavar og utropsteikn signaliserer kjensler, ikke kunnskap. Fagleg autoritet kommer av presis formulering og kjeldetilvising – ikke av å skrike på skjermen.',
 eks:'DÅRLEG: «KLIMAET ER I FARE!!!» · GOD: «Klimaendringer utgør en alvorlig trussel mot globale økosystem.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Skru opp alvoret: Hvilken versjon av setningen passer best i en fagartikkel om havforurensning?',
 alt:['Plast i havet er liksom ikke så bra for dyr og sånn','PLAST DREP DYR!!! Det er jo klart!!!','Plast i havet utgør en alvorlig trussel mot marint liv.','Jeg tror plast i havet er ganske ille for dyra'],
 fasit:'Plast i havet utgør en alvorlig trussel mot marint liv.',
 regel:'Faglig skriving er nøytral, presis og saklig. Unngå muntlige uttrykk («og sånn»), utropstegn og direkte meningsmarkører («jeg tror»).',
 eks:'Formelt register: objektiv tone, presis ordbruk, ingen kjensleladde forsterkingar.'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Skru opp alvoret: Hvilken versjon passer best i et strukturert debattinnlegg om sosiale medier?',
 alt:['Folk er jo skikkelig avhengige av sosiale medier, det er helt tydelig','Forsking viser at overdreven bruk av sosiale medier kan svekke konsentrasjonsevna.','Sosiale medier ødelegger hjernen, og det er jo sanninga','OMG sosiale medier er livsfarlig!!! Jeg er så lei!'],
 fasit:'Forsking viser at overdreven bruk av sosiale medier kan svekke konsentrasjonsevna.',
 regel:'Det formelle registeret unngår overgeneralisering («ødelegger hjernen») og subjektive utrop («OMG»). Ei god fagsetning peker mot ei kilde og er etterprøvbar.',
 eks:'Mønster: «[Forsking/studiar] viser at [presis påstand] (kilde).»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Fra dagbok til fagtekst: «Kjære dagbok, i dag lærte jeg at plast dreper skjelpadder, det er jo helt sjukt :(» Hva versjon er riktig omsett til faglig stil?',
 alt:[
  'Plast er jo helt klart farlig, særlig for skjelpadder i havet.',
  'Plastsøppel i havet utgør en reell trussel mot sjødyr som skjelpadder, som kan forveksle plastbiter med mat.',
  'I dag fann jeg ut at plast i havet er skadelig for skjelpadder.',
  'Jeg mener at plast i havet er et reelt problem for skjelpadder og andre dyr.'
 ],
 fasit:'Plastsøppel i havet utgør en reell trussel mot sjødyr som skjelpadder, som kan forveksle plastbiter med mat.',
 regel:'Fagartiklar startar ikke med «kjære dagbok» eller «i dag lærte jeg». Set fakta og forskningsspørsmål først – uten forfattaren i sentrum.',
 eks:'«I dag lærte jeg at…» → «Forsking viser at…» · «helt sjukt :(» → «en dokumentert trussel»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Avslutnings-fikseren: En fagartikkel om plastforurensning slutter med «No håpar jeg de lærte noe, hadet bra!» Hva faglig avslutning bør erstatte han?',
 alt:[
  'No håpar jeg de forsto hvor viktig dette er! Ha det bra!',
  'Det var alt jeg hadde å si om plast. Kjekkast å skrive om dette.',
  'Samla sett viser dette at plastforurensning krever koordinert innsats fra politikere, næringsliv og enkeltpersonar.',
  'Plast er et stort problem, og vi alle må ta ansvar. Se deg rundt neste gang du kaster noe!'
 ],
 fasit:'Samla sett viser dette at plastforurensning krever koordinert innsats fra politikere, næringsliv og enkeltpersonar.',
 regel:'Ei faglig avslutning summerer, konkluderer eller peker framover. Hun henvendar seg aldri direkte til leseren med uformelt språk.',
 eks:'UNNGÅ: «Håpar de lærte noe!» · SKRIV: «Dette viser at tiltak på flere nivå er nødvendig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Emoji-filteret: En fagartikkel inneheld setningen «Klimaendringer er 😢 for alle». Hva sakleg formulering bør erstatte emojien?',
 alt:['svært alvorlige','😢😢😢','ei stor trist sak','triste greier'],
 fasit:'svært alvorlige',
 regel:'Emojiar hører til i private meldingar, ikke i fagtekstar. Bruk presise adjektiv som «alvorlig», «kritisk» eller «dramatisk» i stedet.',
 eks:'UNNGÅ: «klimaet er 🔥» · SKRIV: «klimaendringer har fått dramatiske konsekvenser»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Emoji-filteret: Teksten sier «🌍 blir øydelaód av klimagasser». Hva faglig formulering erstattar setningsopninga best?',
 alt:['Jorda er trua av aukande utslipp av klimagasser.','Den grønne kloden er ødelagt pga. CO2!!!','🌍 er i alvorlig fare pga. utslipp.','Kloden blir påvirket av slike gassar.'],
 fasit:'Jorda er trua av aukande utslipp av klimagasser.',
 regel:'Emojiar og forkortingar som «pga.» bør erstattast med fullstendige, presise formuleringar. Fagleg skriving identifiserer subjektet klart («Jorda» i stedet for 🌍).',
 eks:'🌍 → «Jorda» · pga. → «på grunn av» · 😢 → «alvorlig», «kritisk»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Trykk på de overflødige eller upassande ordene: Klikk på alle ord som gjør setningen uformell eller unødvendig subjektiv.',
 tekst:'Jeg synes egentlig at forskinga er helt superviktig, og at vi bare må ta oss sammen no.',
 fasit_feil:['jeg','synes','egentlig','helt','bare'],
 regel:'I faglig stil toner du ned personlige meninger og forsterkningsord. Skriv nøytralt og presist.',
 eks:'UNNGÅ: «Jeg synes dette er helt superviktig» · SKRIV: «Forskningen peker på at temaet er viktig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Trykk på de overflødige eller upassende ordene: Marker ord som ikke hører hjemme i en saklig fagtekst.',
 tekst:'Dette tiltaket er jo ganske smart, men det funkar liksom ikke skikkelig i praksis.',
 fasit_feil:['jo','ganske','liksom','skikkelig'],
 regel:'Fyllord og muntlige markører («jo», «liksom») svekker presisjon og troverdighet i fagtekst.',
 eks:'UNNGÅ: «det funkar liksom ikke» · SKRIV: «tiltaket har avgrensa effekt i praksis»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskelig',
 q:'Trykk på de overflødige eller upassande ordene: Klikk på ord som gjør argumentasjonen for kjensleladd i stedet for faglig.',
 tekst:'Kildene viser tydelig at dette er ekstremt farlig, og alle skjønar jo at vi må handle straks.',
 fasit_feil:['tydelig','ekstremt','alle','skjønar','jo','straks'],
 regel:'Absolutte og kjensleladde ord («alle», «ekstremt») bør bytast ut med nøytrale, etterprøvbare formuleringar.',
 eks:'UNNGÅ: «alle skjønar jo dette» · SKRIV: «flere studiar peker i samme retning»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Omformuleraren: Hva er den beste faglige versjonen av setningen «Jeg tror egentlig at skjermbruk er ganske dårlig for unge, for de blir jo helt oppslukte»?',
 alt:[
  'Skjermbruk er dårlig for unge fordi de blir oppslukte.',
  'Høy skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.',
  'Jeg synes skjermbruk er skadelig – ungdommen er jo avhengige.',
  'Det er klart at skjerm er negativt, og alle vet jo det egentlig.'
 ],
 fasit:'Høy skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.',
 regel:'I fagtekst bør du prioritere nøytral ordbruk, konkret virkning og etterprøvbare påstander.',
 eks:'«Jeg tror» → «studiar betyr på» · «helt oppslukte» → «redusert konsentrasjon»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'vanskelig',
 q:'Omformulereren: Hva er den beste faglige versjonen av setningen «Plast i havet er skikkelig krise, og dyrene sliter skikkelig mye fordi folk bare kaster ting overalt»?',
 alt:[
  'Plast i havet er krise, og dyrene sliter mye fordi folk kaster ting.',
  'Det er helt klart at plasten ødelegger for dyrene, og det er folks skyld.',
  'Plastforurensning i havet har alvorlige konsekvenser for dyrelivet, særlig der avfallshåndtering er utilstrekkelig.',
  'Plast er et veldig stort problem som gjør at dyrene i havet sliter.'
 ],
 fasit:'Plastforurensning i havet har alvorlige konsekvenser for dyrelivet, særlig der avfallshåndtering er utilstrekkelig.',
 regel:'Formell stil krever presise fagord og nøytral tone. Muntlige forsterkere og vage formuleringer skal erstattes.',
 eks:'«skikkelig krise» → «alvorlige konsekvenser» · «kaster ting overalt» → «mangelfull avfallshåndtering»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'lett',
 q:'Dra ordene til riktig side: Sorter uttrykkene i «Uformelle formuleringar» eller «Formelle formuleringar».',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'liksom',fasit:0},
  {tekst:'jo',fasit:0},
  {tekst:'helt sjukt',fasit:0},
  {tekst:'jeg mener',fasit:0},
  {tekst:'det betyr på at',fasit:1},
  {tekst:'forsking viser at',fasit:1},
  {tekst:'dokumenterte funn',fasit:1},
  {tekst:'i et faglig perspektiv',fasit:1}
 ],
 regel:'Uformelle ord er muntlige og personlige. Formelle uttrykk er presise, nøytrale og egnet i fagtekst.',
 eks:'«jo/liksom» = uformelt · «forskning viser at» = formelt'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'medium',
 q:'Dra ordene til riktig side: Hva hører til uformell stil, og hva hører til formell stil?',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'kjempeviktig',fasit:0},
  {tekst:'superbra',fasit:0},
  {tekst:'folk flest skjønar',fasit:0},
  {tekst:'på grunn av dette',fasit:1},
  {tekst:'en mulig konsekvens er',fasit:1},
  {tekst:'samla sett',fasit:1},
  {tekst:'det finnes indikasjonar på',fasit:1}
 ],
 regel:'Formelle formuleringar bruker faglige overganger og nyanserte vurderingar i stedet for overdriving.',
 eks:'«kjempeviktig» → «særlig viktig» · «superbra» → «føremålstenleg»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'vanskelig',
 q:'Dra ordene til riktig side: Sorter uttrykkene etter språkregister.',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'det er jo klart',fasit:0},
  {tekst:'jeg føler at',fasit:0},
  {tekst:'masse problem',fasit:0},
  {tekst:'trolig sammenheng',fasit:1},
  {tekst:'empirisk grunnlag',fasit:1},
  {tekst:'kan indikere',fasit:1},
  {tekst:'faglig avgrensing',fasit:1},
  {tekst:'metodisk svakheit',fasit:1}
 ],
 regel:'Formell stil nyttar analytiske faguttrykk og forsiktige konklusjonar, ikke personlege kjensler eller skråsikre utrop.',
 eks:'«jeg føler at» = uformelt · «kan indikere» = formelt og faglig'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Hva setning har best språklig presisjon i en fagartikkel?',
 alt:['Dette er jo ganske ille, liksom.','Dette framstår som ei alvorlig utfordring.','Det er helt sjukt hvor gale det er.','Jeg synes dette er veldig dårlig.'],
 fasit:'Dette framstår som ei alvorlig utfordring.',
 regel:'P'Presis, nøytral ordbruk gjør argumentasjonen mer troverdig.',
 eks:'UNNGÅ muntlige fyllord · VELG presise faglige uttrykk'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'medium',
 q:'Fyll inn et formelt overgangsord i denne setningen fra ei drøfting om skulehelsetenesta:\n«Forsking viser at tidlig intervensjon reduserer fråfall, og flere skular har allerede sett gode resultat. ___ betyr funnene på at tiltaket har effekt.»',
 hint:'Velg et ord eller uttrykk som knytter sammen de foregående argumentene og trekker en konklusjon.',
 fasit:'Samla sett',
 fasit_v:['Samla sett','Alt i alt','Dermed','Derfor','Såleis','På bakgrunn av dette','Dette betyr på at'],
 regel:'Overgangsord som oppsummerer argumenter holder teksten stram og faglig. «Samlet sett», «Alt i alt» og «Således» signaliserer konklusjon, mens «Dermed» og «Derfor» viser årsakssammenheng.',
 eks:'«Samlet sett betyr funnene at…» · «Derfor kan en hevde at…» · «Således bekrefter undersøkelsen…»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskelig',
 q:'Tekstlegen 🩺 Pasienten er syk! Analysen nedenfor er nesten faglig – men 5 uformelle symptom har sneket seg inn. Klikk på hvert sykt ord og redd innleveringen!',
 tekst:'Analysen av diktet er jo veldig interessant, fordi forfattaren bruker skikkelig mange bilder som egentlig gjør teksten dypere – men dette er liksom ikke alltid tydelig.',
 fasit_feil:['jo','veldig','skikkelig','egentlig','liksom'],
 regel:'Interjeksjoner (jo), forsterkningsord (veldig, skikkelig) og muntlige fyllord (egentlig, liksom) bryter det faglige registeret. Hver av dem svekker troverdigheten til analysen.',
 eks:'«jo» → fjern · «veldig» → «svært» · «skikkelig» → «særlig» · «egentlig» → fjern · «liksom» → fjern'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Agenten si dekke 🕵️ Du er hemmeleg agent og MÅ komme deg inn på en akademisk konferanse. Vaktane slepper bare inn de som snakkar faglig. Hva setning er agentsvaret ditt?',
 alt:[
  'Dette er jo helt sjukt viktig for oss som virkelig bryr oss om dette!',
  'Funnene indikerer en mulig sammenheng, men ytterlegare forsking er nødvendig for å stadfeste dette.',
  'Jeg mener forskerne egentlig er ganske enige, selv om media sier noe annet.',
  'Det er jo tydelegvis bevist at dette alltid stemmer – alle vet jo det!'
 ],
 fasit:'Funnene indikerer en mulig sammenheng, men ytterlegare forsking er nødvendig for å stadfeste dette.',
 regel:'Det akademiske registeret bruker forsiktige påstander («indikerer», «mulig sammenheng»), erkjenner uvisse («ytterlegare forsking er nødvendig») og unngår skråsikkerheit («alltid stemmer», «alle vet»).',
 eks:'AGENTSVAR: «indikere», «mulig», «nødvendig forsking» · AVSLØRTE: «jo», «egentlig», «tydelegvis», «alltid»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'medium',
 q:'Oppgraderingsportalen 🔒 Fagleg publisering krever godkjenning. Sorter hver formulering: blir hun blokkert av portalen, eller passerer hun?',
 kolonner:['Blokkert – for absolutt og skråsikker','Passerer portalen – nøyansert og faglig'],
 ord:[
  {tekst:'Dette beviser definitivt at tiltaket virker.',fasit:0},
  {tekst:'Funnene betyr på at tiltaket kan ha effekt.',fasit:1},
  {tekst:'Alle forskere er enige om dette.',fasit:0},
  {tekst:'Flere studiar indikerer en mulig sammenheng.',fasit:1},
  {tekst:'Det er et faktum at skolen sviktar ungdom.',fasit:0},
  {tekst:'En kan argumentere for at skolen trenger mer ressurser.',fasit:1}
 ],
 regel:'Fagleg skriving uttrykker bare det en kan dokumentere. «Beviser definitivt» og «alle er enige» er for absolutte. «Betyr på», «indikere» og «kan argumentere for» viser faglig nøyaktigheit.',
 eks:'BLOKKERT: «beviser» → PASSERER: «betyr på» · BLOKKERT: «alle er enige» → PASSERER: «flere studiar indikerer»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_ord',vanske:'middels',
 q:'Setningssmeden 🔨 Smi en faglig avslutningssetning ved å trykke ordene inn i rett rekkefølge. Bare én rekkefølge er faglig korrekt og logisk.',
 ord:['Det','er','derfor','viktig','å','tilpasse','registeret','til','mottakaren','.'],
 fasit:'Det er derfor viktig å tilpasse registeret til mottakaren .',
 regel:'«Derfor» viser årsakssammenheng og er et typisk formelt overgangsord i avslutningen. «Registeret» og «mottakeren» er faglige termer som hører hjemme i en faglig oppsummering.',
 eks:'Mønster for faglig avslutning: [Derfor/Samla sett] + [er det viktig å] + [faglig handling] + [faglig mål]'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'lett',
 q:'Stiloppgraderaren 🎮 Teksten er NESTEN faglig – men ett uformelt ord ødelegger heilskapen. Skriv et formelt erstatningsord for «kjempeviktig» i setningen nedenfor:\n\n«Tiltaket var kjempeviktig for å redusere fråfall i skolen.»',
 hint:'Formelt og presist – ikke «kjempe-» eller «super-». Hva adjektiv beskriver noe som er absolutt nødvendig og av stor virkning?',
 fasit:'avgjørende',
 fasit_v:['avgjørende','kritisk','vesentlig','sentral','nødvendig','særlig viktig'],
 regel:'Uformelle forsterkarar som «kjempe-», «super-» og «skikkelig» erstattas med presise adjektiv: «avgjørende», «kritisk», «vesentlig» eller «sentral».',
 eks:'«kjempeviktig» → «avgjørende» · «superbra» → «særlig vellykka» · «skikkelig vanskelig» → «krevjande»'},

/* ── TEKSTSTRUKTUR – tillegg (4) ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Fiks «hoppet»: Avsnitt 1 handler om klimaendringer. Avsnitt 2 startar brått om teknologi. Hva overgangssetning fiksar flyten best?',
 alt:['Teknologi er bra.','No skal jeg skrive om teknologi.','Teknologisk utvikling kan være en del av løysinga på klimaproblema.','Og da er det teknologi som kommer inn.'],
 fasit:'Teknologisk utvikling kan være en del av løysinga på klimaproblema.',
 regel:'En god overgangssetning knytter det nye emnet logisk til det foregående. Den peker tilbake med et referansepunkt («løsningen på klimaproblemene») og framover mot nytt tema («teknologisk utvikling»).',
 eks:'Mønster: «[Nytt tema] kan ses i sammenheng med [gammelt tema]» · «Utover [dette] må vi også sjekke [nytt]»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Motsetnings-maskinen: Fyll inn et bindeord som viser kontrast: «Sosiale medier kan være nyttige. ___, kan de òg ha negative konsekvenser.»',
 hint:'Du trenger et bindeord som sier at det neste er overraskende eller i motsetning til det første.',
 fasit:'Likevel',
 fasit_v:['Likevel','Derimot','På den andre siden','Trass i dette','Men'],
 regel:'«Likevel», «derimot» og «på den andre siden» viser kontrast eller motsetnad. De er uunngåelege i drøftende tekster der du balanserer argument.',
 eks:'«Sosiale medier er nyttige. Likevel kan overdreven bruk gå ut over konsentrasjonen.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Motsetnings-maskinen: Fyll inn et bindeord som nyanserer påstanden: «KI kan effektivisere skolearbeidet, ___ reiser det òg viktige etiske spørsmål.»',
 hint:'Bindeordet skal vise at det neste nyanserande eller i motsetnad til bruke-påstanden.',
 fasit:'men',
 fasit_v:['men','likevel','samtidig'],
 regel:'«Men» og «likevel» signaliserer motsetnad. De er signalorda i drøftende tekster som viser at du tar begge sider på alvor.',
 eks:'«KI er nyttig, men vi må stille kritiske spørsmål om personvern og etikk.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Start-motor for avsnitt: Tre avsnitt om klimatiltak er allerede skrivne. Hva er den BESTE åpningen på et nytt avsnitt?',
 alt:['En annen ting er at mange land har innført CO2-avgift.','For det tredje kan en nemne CO2-avgifta.','Utover de allerede nemnde tiltaka har flere land innført CO2-avgifter.','Ok, no skal jeg skrive om CO2-avgift.'],
 fasit:'Utover de allerede nemnde tiltaka har flere land innført CO2-avgifter.',
 regel:'Unngå «En annen ting er…» og mekanisk «For det første/andre/tredje»-oppramsing. Knytt hvert avsnitt logisk til det føregåande med et referanseord.',
 eks:'«Utover de presenterte tiltaka…» · «I tillegg til dette…» · «Sett i lys av de nemnde tendensane…»'},

/* ── KJELDEBRUK – tillegg (5) ── */
{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Papegøye-alarmen: Kilden sier: «Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.» Hva elevversjon er et plagiat?',
 alt:['Forsking syner at nesten alle sjøfuglar i Nordsjøen er påvirket av plast.','Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.','Fuglelivet i Nordsjøen er hardt pressa av plastforurensning.','Studiar dokumenterer at plastpåverknad er svært utbreidd blant sjøfuglar.'],
 fasit:'Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.',
 regel:'Å kopiere kjeldeteksten ordrett uten hermetegn og kjeldetilvising er plagiat. Omskrivinga må endre ordval og setningsstruktur – ikke bare byte ut ett ord.',
 eks:'PLAGIAT: kopiert ordrett. RIKTIG: Eiga formulering + kjeldetilvising (Forfatter, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'vanskelig',
 q:'Krymparen: Kilden sier: «De siste hundre årene har menneskeskapt utslipp av klimagasser som CO2 og metan ført til ei gradvis stigende gjennomsnittstemperatur over hele kloden, noe som truer økosystem og værmønster verden over.» Hva kjernesetning på maks 10 ord fangar best innhaldet?',
 alt:[
  'Klimaendringer er et problem fordi vi slepper ut CO2 og metan.',
  'CO2 og metan fra menneske har stige de siste hundre årene.',
  'Klimagassutslipp øker temperaturen og truer naturlige system.',
  'Menneskeskapt CO2 og metan fører til klimaendringer globalt i dag.'
 ],
 fasit:'Klimagassutslipp øker temperaturen og truer naturlige system.',
 regel:'Å krynga ei kilde tvinger deg til å forstå hun – og hindrar deg i å kopiere setninger ordrett. Finn kjernen og la resten gå.',
 eks:'Lang kilde + 10-ords-grense = di egen formulering. Alternativ 1 og 4 er over 10 ord eller for vage. Alternativ 2 mangler konsekvensen.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'drag_kolonne',vanske:'medium',
 q:'Sitering eller omskriving? Klikk på hvert kort og sorter det i rett boks.',
 kolonner:['Trenger hermetegn (direkte sitat)','Kan stå fritt med kjeldetilvising (omskrive)'],
 ord:[
  {tekst:'«1,3 millioner tonn plast havner i havet hvert år»',fasit:0},
  {tekst:'Forsking viser at plast blir et stadig større problem i verdenshavene',fasit:1},
  {tekst:'«Mikroplast trengjer inn i næringsrekkja og skadar dyrelivet»',fasit:0},
  {tekst:'Havpattedyr og fugler er særlig utsette for skadar fra plast',fasit:1}
 ],
 regel:'Set hermetegn bare ved ordrett sitering fra kilden. Eiga omskriving trenger kjeldetilvising (forfatter, årstal), men ikke hermetegn.',
 eks:'Sitat: «ord fra kilde» (Forfatter, årstal). Omskriving: Di formulering av samme innhold (Forfatter, årstal).'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Tolken: Kilden sier «Mikroplastpartiklar er funnet i blodet hos 80 % av testa vaksne.» Hva er den BESTE tolkinga som kan følge sitatet?',
 alt:[
  'Dette betyr egentlig at mikroplast er funnet i blod.',
  'Dette betyr egentlig at 80 % er et høyt tal og det er bekymringsverdig.',
  'Dette betyr egentlig at plast ikke bare er et miljøproblem, men òg en direkte helsetrussel for hvert eneste menneske.',
  'Dette betyr egentlig at vi bør slutte å bruke plast.'
 ],
 fasit:'Dette betyr egentlig at plast ikke bare er et miljøproblem, men òg en direkte helsetrussel for hvert eneste menneske.',
 regel:'Etter et sitat kommer alltid di egen forklaring av hva det betyr. Sitatet åleine er ikke argumentet – tolkinga er det.',
 eks:'SVAK tolking: repeterer bare faktumet. GOD tolking: trekker en ny konsekvens eller innsikt ut av faktumet.'},

{kat:'kildebruk',kat_label:'Kildebruk',type:'mc',vanske:'medium',
 q:'Metatekst-støvsugaren: Hva setning er metatekst – der forfattaren snakkar om sin eigen tekst i stedet for å komme rett til saka?',
 alt:['I denne teksten skal jeg skrive om klimaendringer.','Klimaendringer har ført til mer ekstremvær de siste tiårene.','Mange land har innført CO2-avgifter for å redusere utslipp.','Plastforurensning truer marint dyreliv i Nordsjøen.'],
 fasit:'I denne teksten skal jeg skrive om klimaendringer.',
 regel:'Metatekst er setninger der forfattaren omtalar seg selv og sin eigen tekst («I denne teksten skal jeg…», «No skal jeg forklare…»). Slike setninger er bortkasta ord – kom rett til saka i stedet.',
 eks:'METATEKST: «I denne teksten kommer jeg til å…» · FAGLEG: Start med fakta, problemstilling eller definisjon.'},
]; // end MT_BANK

// Expose task bank for other scripts that run on the samme page.
if(typeof window!=='undefined') window.MT_BANK = MT_BANK;
if(typeof globalThis!=='undefined') globalThis.MT_BANK = MT_BANK;

/* ══════════════════════════════════════════════════════
   MENGDETRENING – state & logikk
══════════════════════════════════════════════════════ */
const MTS = { tasks:[], idx:0, score:0, answered:false, config:{}, streak:0, history:[] };

function mtShuffle(arr){ const a=[...arr]; for(lar i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function mtShuffleBank(){
  for(lar i=MT_BANK.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [MT_BANK[i],MT_BANK[j]]=[MT_BANK[j],MT_BANK[i]];
  }
}
function $mt(id){ return document.getElementById(id); }
function mtEsc(s){ if(!s)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>'); }

function mtToggleKat(el){
  const sel = el.dataset.sel === '1';
  if(sel){
    el.dataset.sel='0';
    el.style.background='#f3f0ea'; el.style.borderColor='#e5e2db';
    el.style.color='#4a4a46'; el.style.fontWeight='400';
  } else {
    el.dataset.sel='1';
    el.style.background='#fff3e0'; el.style.borderColor='#e5822a';
    el.style.color='#7a3800'; el.style.fontWeight='600';
  }
}
function mtVelAlle(){
  document.querySelectorAll('.mt-kat-btn').forEach(el=>{
    el.dataset.sel='1';
    el.style.background='#fff3e0'; el.style.borderColor='#e5822a';
    el.style.color='#7a3800'; el.style.fontWeight='600';
  });
  mtUpdateAntalMeta();
}
function mtFjernAlle(){
  document.querySelectorAll('.mt-kat-btn').forEach(el=>{
    el.dataset.sel='0';
    el.style.background='#f3f0ea'; el.style.borderColor='#e5e2db';
    el.style.color='#4a4a46'; el.style.fontWeight='400';
  });
  mtUpdateAntalMeta();
}

function mtGetTilgjengelegeOppgaver(){
  const valgte=[...document.querySelectorAll('.mt-kat-btn[data-sel="1"]')].map(b=>b.dataset.kat);
  if(!valgte.length) return 0;
  const vanskeEl=$mt('mt-vanske');
  const vanske=vanskeEl?vanskeEl.value:'adaptiv';
  lar pool=MT_BANK.filter(t=>valgte.includes(t.kat));
  if(vanske!=='adaptiv') pool=pool.filter(t=>t.vanske===vanske);
  return pool.length;
}

function mtUpdateAntalMeta(){
  const inp=$mt('mt-antal');
  const hint=$mt('mt-antal-hint');
  if(!inp) return;

  const tilgjengelig=mtGetTilgjengelegeOppgaver();
  const maks=Math.min(25, tilgjengelig||25);
  inp.max=String(maks);

  const val=parseInt(inp.value,10);
  if(Number.isFinite(val) && val>maks) inp.value=String(maks);

  if(hint){
    if(tilgjengelig===0){
      hint.textContent='Vel minst én kategori for å se hvor mange oppgaver som er tilgjengelege.';
    } else {
      hint.textContent=`Tilgjengelege med vala dine: ${tilgjengelig}. Du kan starte med opptil ${maks}.`;
    }
  }
}

function mtInitKategoriVeljar(){
  const root=document.getElementById('mengdetrening');
  if(!root || root.dataset.mtKategoriInit==='1') return;
  root.dataset.mtKategoriInit='1';

  root.querySelectorAll('.mt-kat-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      mtToggleKat(btn);
      mtUpdateAntalMeta();
    });
  });

  const velAlleBtn=root.querySelector('[data-mt-action="vel-alle"]');
  const fjernAlleBtn=root.querySelector('[data-mt-action="fjern-alle"]');
  if(velAlleBtn) velAlleBtn.addEventListener('click', mtVelAlle);
  if(fjernAlleBtn) fjernAlleBtn.addEventListener('click', mtFjernAlle);

  const vanskeEl=$mt('mt-vanske');
  if(vanskeEl) vanskeEl.addEventListener('change', mtUpdateAntalMeta);

  const antalEl=$mt('mt-antal');
  if(antalEl) antalEl.addEventListener('input', mtUpdateAntalMeta);

  mtUpdateAntalMeta();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>{
    mtShuffleBank();
    mtInitKategoriVeljar();
  });
} else {
  mtShuffleBank();
  mtInitKategoriVeljar();
}

// Keep functions available for any existing inline hooks.
window.mtToggleKat=mtToggleKat;
window.mtVelAlle=mtVelAlle;
window.mtFjernAlle=mtFjernAlle;

function mtStart(){
  // Fresh shuffle for each new session to avoid repeated task order/selection.
  mtShuffleBank();
  const valgte = [...document.querySelectorAll('.mt-kat-btn[data-sel="1"]')].map(b=>b.dataset.kat);
  if(!valgte.length){ alert('Vel minst én kategori for å starte.'); return; }
  const vanske = $mt('mt-vanske').value;
  const onskja = parseInt($mt('mt-antal').value,10);
  const grunnTal = Number.isFinite(onskja) ? onskja : 8;

  lar pool = MT_BANK.filter(t=>valgte.includes(t.kat));
  if(vanske!=='adaptiv') pool = pool.filter(t=>t.vanske===vanske);
  const maksTillate = Math.min(25, pool.length);
  const antal = Math.min(maksTillate, Math.max(3, grunnTal));

  if(pool.length && grunnTal>maksTillate){
    alert(`Du bad om ${grunnTal} oppgaver, men med disse vala er maks ${maksTillate}. Startar med ${maksTillate}.`);
  }

  pool = mtShuffle(pool).slice(0, antal);
  if(vanske==='adaptiv'){
    const lett = mtShuffle(pool.filter(t=>t.vanske==='lett'));
    const medium = mtShuffle(pool.filter(t=>t.vanske==='medium'));
    const vanskelig = mtShuffle(pool.filter(t=>t.vanske==='vanskelig'));
    pool = [...lett, ...medium, ...vanskelig];
  }

  if(!pool.length){ alert('Ingen oppgaver passer disse valgene. Prøv en annen kombinasjon.'); return; }

  MTS.tasks=pool; MTS.idx=0; MTS.score=0; MTS.answered=false; MTS.streak=0; MTS.history=[];
  $mt('mt-start-btn').disabled=true;
  const rb=$mt('mt-reset-btn'); if(rb) rb.style.display='inline-flex';
  $mt('mt-quiz-area').style.display='block';
  $mt('mt-summary').style.display='none';
  $mt('mt-task-wrap').innerHTML='';
  mtUpdateProgress();
  mtRenderTask();
}

function mtTilbakestill(){
  // Stop current session and return to config
  MTS.tasks=[]; MTS.idx=0; MTS.score=0; MTS.answered=false;
  $mt('mt-start-btn').disabled=false;
  const rb=$mt('mt-reset-btn'); if(rb) rb.style.display='none';
  $mt('mt-quiz-area').style.display='none';
  $mt('mt-summary').style.display='none';
  $mt('mt-task-wrap').innerHTML='';
}

function mtReset(){
  $mt('mt-start-btn').disabled=false;
  const rb=$mt('mt-reset-btn'); if(rb) rb.style.display='none';
  $mt('mt-quiz-area').style.display='none';
  $mt('mt-summary').style.display='none';
  $mt('mt-task-wrap').innerHTML='';
}

function mtUpdateProgress(){
  const total=MTS.tasks.length;
  const pct=total>0?Math.round((MTS.idx/total)*100):0;
  const fill=$mt('mt-progress-fill');
  const lbl=$mt('mt-progress-label');
  if(fill) fill.style.width=pct+'%';
  if(lbl)  lbl.textContent=MTS.idx+' / '+total;
  const badge=$mt('mt-score-badge');
  if(badge) badge.textContent='Poeng: '+MTS.score;
}

function mtRenderTask(){
  MTS.answered=false;
  _mtoAnswered.length=0; // nullstill drag_ord-svar
  const t=MTS.tasks[MTS.idx];
  if(!t){ mtShowSummary(); return; }

  const vCls={ lett:'background:#e8f2f8;color:#1a567a', medium:'background:#fffbe8;color:#6b4a00', vanskelig:'background:#fff0ed;color:#8b2a0a' }[t.vanske]||'';
  const vLbl={ lett:'Lett', medium:'Medium', vanskelig:'Vanskelig' }[t.vanske]||'';

  const hintHTML = t.hint
    ? `<div style="background:#fffbe8;border:1px solid #f5d878;border-radius:8px;padding:0.55rem 1rem;margin-top:0.7rem;font-size:13px;color:#6b4a00">💡 Hint: ${mtEsc(t.hint)}</div>`
    : '';

  lar inputHTML='';
  if(t.type==='mc'){
    const alts=mtShuffle(t.alt);
    inputHTML='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:0.8rem">';
    alts.forEach(a=>{
      inputHTML+=`<button class="mt-alt-btn" data-val="${mtEsc(a)}" onclick="mtChoose(this)" style="background:#f8f7f4;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:14px;padding:8px 16px;cursor:pointer;transition:background 0.12s,border-color 0.12s">${mtEsc(a)}</button>`;
    });
    inputHTML+='</div>';
  } else if(t.type==='open'){
    inputHTML=`<div style="margin-top:0.8rem">
      <textarea id="mt-open-inp" rows="3" autocomplete="off" spellcheck="false"
        style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:14px;padding:9px 14px;outline:none;resize:vertical;line-height:1.6"
        placeholder="Skriv omformuleringa di her…"></textarea>
      <button onclick="mtCheckOpen()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>
    </div>`;
  } else if(t.type==='klikk_marker'){
    // Split tekst into clickable words
    const tknWds = t.tekst.split(' ');
    const wdSpans = tknWds.map((w,i)=>{
      const clean = w.replace(/[.,!?;:«»"()]/g,'').toLowerCase();
      return `<span class="km-word" data-i="${i}" data-clean="${clean}" onclick="kmClick(this)"
        style="display:inline-block;margin:2px 3px;padding:3px 8px;border-radius:5px;cursor:pointer;border:1px solid transparent;transition:background 0.12s,border-color 0.12s;font-size:15px;line-height:1.8">${mtEsc(w)}</span>`;
    }).join(' ');
    inputHTML=`<div style="margin-top:0.8rem">
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk på ordene du mener er <strong>${mtEsc(t.maalordklasse)}</strong>. Klikk igjen for å fjerne markeringa.</p>
      <div id="km-tekst" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2;font-family:'Fraunces',serif;font-size:15px;margin-bottom:0.8rem">${wdSpans}</div>
      <button onclick="kmSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk markeringar</button>
      <button onclick="kmReset()" style="margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='finn_feil'){
    // Samme as klikk_marker but marking errors
    const tknWds = t.tekst.split(' ');
    const wdSpans = tknWds.map((w,i)=>{
      const clean = w.replace(/[.,!?;:«»"()]/g,'').toLowerCase();
      return `<span class="ff-word" data-i="${i}" data-clean="${clean}" onclick="ffClick(this)"
        style="display:inline-block;margin:2px 3px;padding:3px 8px;border-radius:5px;cursor:pointer;border:1px solid transparent;transition:background 0.12s;font-size:15px;line-height:1.8">${mtEsc(w)}</span>`;
    }).join(' ');
    inputHTML=`<div style="margin-top:0.8rem">
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Det er <strong>${t.fasit_feil.length} feil</strong> gøymt i teksten. Klikk på hvert ord du mener er feil skrive eller feil brukt.</p>
      <div id="ff-tekst" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2;font-family:'Fraunces',serif;font-size:15px;margin-bottom:0.8rem">${wdSpans}</div>
      <button onclick="ffSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Vis fasit</button>
      <button onclick="ffReset()" style="margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='drag_kolonne'){
    // Trekk ord til riktig kolonne
    const shuffled = mtShuffle([...t.ord]);
    const c0 = String(t.kolonner?.[0]||'').toLowerCase();
    const c1 = String(t.kolonner?.[1]||'').toLowerCase();
    const c0Right = /\b(riktig|rett)\b/.test(c0);
    const c1Right = /\b(riktig|rett)\b/.test(c1);
    const c0Wrong = /\b(feil|gal)\b/.test(c0);
    const c1Wrong = /\b(feil|gal)\b/.test(c1);
    const isRightWrong = (c0Right && c1Wrong) || (c1Right && c0Wrong);
    const col0Bg = isRightWrong ? '#e8f6f0' : '#f8f7f4';
    const col0Border = isRightWrong ? '#82c9a8' : '#d5d2cb';
    const col0Label = isRightWrong ? '#1a5c42' : '#4a4a46';
    const col1Bg = isRightWrong ? '#fff0ed' : '#f8f7f4';
    const col1Border = isRightWrong ? '#f0a090' : '#d5d2cb';
    const col1Label = isRightWrong ? '#7f1d1d' : '#4a4a46';
    const k0 = mtEsc(t.kolonner[0]);
    const k1 = mtEsc(t.kolonner[1]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div id="mtdk-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px" ondragover="event.preventDefault()" ondrop="mtkDropBank(event)">
        ${shuffled.map((o,i)=>`<div class="mtdk-token" draggable="true" data-i="${i}" data-fasit="${o.fasit}" data-placed="-1" onclick="mtkMove(this)" ondragstart="mtkDragStart(event,${i})" ontouchstart="mtkTouchStart(event,${i})" ontouchend="mtkTouchEnd(event)"
          style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;padding:6px 14px;cursor:grab;user-select:none;touch-action:none;transition:background 0.12s">${mtEsc(o.tekst)}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div id="mtdk-col-0" style="background:${col0Bg};border:2px dashed ${col0Border};border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px" ondragover="event.preventDefault()" ondrop="mtkDropCol(event,0)">
          <div style="font-weight:600;color:${col0Label};margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">${k0}</div>
          <div id="mtdk-placed-0" style="display:flex;flex-wrap:wrap;gap:6px"></div>
        </div>
        <div id="mtdk-col-1" style="background:${col1Bg};border:2px dashed ${col1Border};border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px" ondragover="event.preventDefault()" ondrop="mtkDropCol(event,1)">
          <div style="font-weight:600;color:${col1Label};margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">${k1}</div>
          <div id="mtdk-placed-1" style="display:flex;flex-wrap:wrap;gap:6px"></div>
        </div>
      </div>
      <button onclick="mtkSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>
    </div>`;
  } else if(t.type==='burger_sort'){
    // Three-bucket drag: Innledning / Hovuddel / Avslutning
    const shuffledAv = mtShuffle(t.avsnitt.map((a,i)=>({...a,_i:i})));
    const lagColors = [
      {bg:'#fff3e0',border:'#f5c282',lbl:'#6b3800',card:'#fdf5e8'},
      {bg:'#e8f6f0',border:'#82c9a8',lbl:'#1a5c42',card:'#f0fdf4'},
      {bg:'#fdf0eb',border:'#f0a090',lbl:'#7f1d1d',card:'#fff5f3'}
    ];
    const buckets = t.lag.map((lbl,li)=>{
      const c=lagColors[li];
      return `<div id="mtbs-bucket-${li}" data-lagidx="${li}" style="flex:1;min-width:120px;background:${c.bg};border:2px dashed ${c.border};border-radius:10px;padding:0.5rem;min-height:70px" ondragover="event.preventDefault()" ondrop="mtbsDrop(event,${li})">
        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${c.lbl};margin-bottom:5px">${mtEsc(lbl)}</div>
        <div id="mtbs-placed-${li}" style="display:flex;flex-direction:column;gap:5px"></div>
      </div>`;
    }).join('');
    const tokens = shuffledAv.map(a=>{
      return `<div class="mtbs-token" draggable="true" data-i="${a._i}" data-placed="-1"
        ondragstart="mtbsDragStart(event,${a._i})" onclick="mtbsClick(this)"
        style="background:#fff;border:1px solid #d5d2cb;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:13px;padding:7px 12px;cursor:grab;line-height:1.5;touch-action:manipulation">
        ${mtEsc(a.tekst)}
      </div>`;
    }).join('');
    inputHTML=`<div style="margin-top:0.8rem">
      <div id="mtbs-bank" style="display:flex;flex-direction:column;gap:6px;padding:0.6rem;background:#f8f7f4;border-radius:8px;margin-bottom:0.8rem">${tokens}</div>
      <div id="mtbs-buckets" style="display:flex;gap:8px;flex-wrap:wrap">${buckets}</div>
      <button onclick="mtbsSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>
      <button onclick="mtbsReset()" style="margin-top:10px;margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='avsnitt_klikk'){
    // Click first word to insert paragraph break
    const segs=t.segments;
    const items=segs.map(seg=>{
      const first=seg.first_word;
      if(!first){
        return `<span data-sid="" style="font-family:'Fraunces',serif;font-size:14px;line-height:1.9">${mtEsc(seg.tekst)} </span>`;
      }
      const rest=seg.tekst.slice(first.length);
      return `<span data-sid="${seg.id}" class="ak-break" onclick="akToggle(this,'${seg.id}')" style="font-family:'Fraunces',serif;font-size:14px;line-height:1.9;cursor:pointer;border-bottom:2px dotted #c5c2bb;transition:color 0.15s" title="Klikk for avsnittsskifte">${mtEsc(first)}</span><span data-sid-rest="${seg.id}" style="font-family:'Fraunces',serif;font-size:14px;line-height:1.9">${mtEsc(rest)} </span>`;
    }).join('');
    inputHTML=`<div style="margin-top:0.8rem">
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk på det <strong>første ordet</strong> i hver setning der du vil starte et nytt avsnitt. Klikk igjen for å fjerne.</p>
      <div id="ak-text" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem 0.8rem;line-height:2.2">${items}</div>
      <button onclick="akSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk avsnitt</button>
      <button onclick="akReset()" style="margin-top:10px;margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='drag_ord'){
    // Sett ord i rett rekkefølge
    const shuffled = mtShuffle([...t.ord]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div id="mtdo-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:0.8rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px">
        ${shuffled.map((w,i)=>`<button class="mtdo-token" data-w="${mtEsc(w)}" data-idx="${i}" onclick="mtoMove(this)"
          style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:14px;padding:6px 14px;cursor:pointer">${mtEsc(w)}</button>`).join('')}
      </div>
      <div id="mtdo-answer" style="min-height:44px;padding:0.6rem;background:#fff;border:2px dashed #c5c2bb;border-radius:8px;display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:#8a8a84">
        <span id="mtdo-placeholder" style="font-size:13px;color:#aaa">Trykk på ordene over i rett rekkefølge…</span>
      </div>
      <button onclick="mtoSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk rekkefølge</button>
      <button onclick="mtoReset()" style="margin-top:10px;margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else {
    inputHTML=`<div style="margin-top:0.8rem">
      <input id="mt-cloze-inp" type="text" autocomplete="off" autocorrect="off" spellcheck="false"
        style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:15px;padding:9px 14px;outline:none;transition:border-color 0.15s"
        placeholder="Skriv svaret ditt her…"
        onkeydown="if(event.key==='Enter')mtCheck()">
      <button onclick="mtCheck()" style="margin-top:8px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk svar</button>
    </div>`;
  }

  $mt('mt-task-wrap').innerHTML=`
    <div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;padding:1.5rem;margin-bottom:1rem;border-left:4px solid #e5822a">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:0.8rem">
        <span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:99px;font-weight:500;background:#fff3e0;color:#7a3800">${mtEsc(t.kat_label)}</span>
        <span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:99px;font-weight:500;${vCls}">${vLbl}</span>
      </div>
      <p style="font-size:15px;line-height:1.65;color:#1a1a18;margin:0 0 0.2rem;font-family:'Fraunces',serif;font-style:italic">${mtEsc(t.q||t.sporsmal||"")}</p>
      ${hintHTML}
      ${inputHTML}
      <div id="mt-feedback" style="display:none;border-radius:10px;padding:0.9rem 1.1rem;margin-top:1rem;font-size:14px;line-height:1.7"></div>
    </div>
    <div id="mt-next-wrap" style="display:none;margin-top:0.2rem">
      <button onclick="mtNext()" style="background:#e5822a;color:#fff;border:none;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 24px;cursor:pointer">
        ${MTS.idx+1<MTS.tasks.length?'Neste oppgave →':'Sjå resultat →'}
      </button>
    </div>`;

  if(t.type==='cloze') setTimeout(()=>{ const el=$mt('mt-cloze-inp'); if(el)el.focus(); }, 80);
  if(t.type==='open')  setTimeout(()=>{ const el=$mt('mt-open-inp');  if(el)el.focus(); }, 80);
}

function mtChoose(btn){
  if(MTS.answered) return;
  MTS.answered=true;
  const t=MTS.tasks[MTS.idx];
  const chosen=btn.getAttribute('data-val');
  const correct=mtIsCorrect(chosen,t);

  document.querySelectorAll('.mt-alt-btn').forEach(b=>{
    b.disabled=true;
    b.style.cursor='default';
    const v=b.getAttribute('data-val');
    if(v===chosen){
      b.style.background=correct?'#e8f6f0':'#fff0ed';
      b.style.borderColor=correct?'#2e8b6a':'#d45a2f';
      b.style.color=correct?'#1a5c42':'#8b2a0a';
    }
    if(!correct && mtIsCorrect(v,t)){
      b.style.background='#e8f6f0';
      b.style.borderColor='#2e8b6a';
      b.style.color='#1a5c42';
    }
  });
  mtFinish(correct, chosen, t);
}

function mtCheck(){
  if(MTS.answered) return;
  const t=MTS.tasks[MTS.idx];
  const el=$mt('mt-cloze-inp');
  if(!el) return;
  const val=el.value.trim();
  if(!val){ el.focus(); return; }
  MTS.answered=true;
  const correct=mtIsCorrect(val,t);
  el.style.borderColor=correct?'#2e8b6a':'#d45a2f';
  el.style.background=correct?'#e8f6f0':'#fff0ed';
  el.disabled=true;
  mtFinish(correct, val, t);
}

function mtCheckOpen(){
  if(MTS.answered) return;
  const t=MTS.tasks[MTS.idx];
  const el=$mt('mt-open-inp');
  if(!el) return;
  const val=el.value.trim();
  if(!val){ el.focus(); return; }
  MTS.answered=true;
  // Open tasks always count as "answered" – score given for attempting
  MTS.score++;
  MTS.streak++;
  mtUpdateProgress();
  el.disabled=true;
  el.style.borderColor='#e5822a';

  const fb=$mt('mt-feedback');
  if(!fb) return;
  fb.style.display='block';
  fb.style.background='#fff8f0';
  fb.style.border='1px solid #f5c282';
  fb.style.color='#6b3800';

  lar html=`<strong>Takk for svaret! Her er et poeng for innsatsen. 📝</strong>`;
  html+=`<div style="margin-top:0.8rem;display:grid;grid-template-columns:1fr 1fr;gap:10px">`;
  if(t.eksempel_svak) html+=`<div style="background:#fff0ed;border-radius:8px;padding:0.7rem 0.9rem;font-size:13px;color:#7f1d1d"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px">Kan bli bedre 🟡</strong>${mtEsc(t.eksempel_svak)}</div>`;
  if(t.eksempel_god) html+=`<div style="background:#e8f6f0;border-radius:8px;padding:0.7rem 0.9rem;font-size:13px;color:#14532d"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px">Sterk formulering ✅</strong>${mtEsc(t.eksempel_god)}</div>`;
  html+=`</div>`;
  if(t.regel) html+=`<div style="margin-top:0.6rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`;
  fb.innerHTML=html;

  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}

function mtIsCorrect(val,t){
  const n=s=>s.trim().toLowerCase();
  const variants=Array.isArray(t.fasit_v)&&t.fasit_v.length?t.fasit_v:[t.fasit];
  return variants.some(v=>n(v)===n(val));
}

function mtFinish(correct, chosen, t){
  if(correct){MTS.score++;MTS.streak++;}else{MTS.streak=0;}
  MTS.history[MTS.idx]=correct;
  mtUpdateProgress();

  const fb=$mt('mt-feedback');
  if(!fb) return;
  fb.style.display='block';
  fb.style.background=correct?'#e8f6f0':'#fff0ed';
  fb.style.border=`1px solid ${correct?'#82c9a8':'#f0a090'}`;
  fb.style.color=correct?'#14532d':'#7f1d1d';

  lar html=`<strong>${correct?'✓ Rett!':'✗ Feil'}</strong>`;
  if(!correct) html+=` Rett svar: <strong>${mtEsc(t.fasit)}</strong>`;
  if(t.regel) html+=`<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`;
  if(t.eks)   html+=`<div style="margin-top:0.3rem;font-size:13px;opacity:0.75"><em>Eks.: ${mtEsc(t.eks)}</em></div>`;
  fb.innerHTML=html;

  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}

function mtNext(){
  // Auto-check viss eleven ikke har svart
  if(!MTS.answered){
    const t=MTS.tasks[MTS.idx];
    if(t){
      if(t.type==='cloze'){
        const el=$mt('mt-cloze-inp');
        if(el && el.value.trim()) mtCheck();
        else if(el){ MTS.answered=true; MTS.history[MTS.idx]=false; mtUpdateProgress(); }
      } else if(t.type==='open'){
        const el=$mt('mt-open-inp');
        if(el && el.value.trim()) mtCheckOpen();
        else { MTS.answered=true; MTS.history[MTS.idx]=false; }
      } else if(t.type==='mc'){
        // Ingen val gjort – tel som feil og gå videre
        MTS.answered=true; MTS.history[MTS.idx]=false; mtUpdateProgress();
      } else {
        MTS.answered=true; MTS.history[MTS.idx]=false;
      }
    }
  }
  // Auto-check viss eleven ikke har svart
  if(!MTS.answered){
    const t=MTS.tasks[MTS.idx];
    if(t){
      if(t.type==='cloze'){
        const el=$mt('mt-cloze-inp');
        if(el && el.value.trim()) mtCheck();
        else if(el){ MTS.answered=true; MTS.history[MTS.idx]=false; mtUpdateProgress(); }
      } else if(t.type==='open'){
        const el=$mt('mt-open-inp');
        if(el && el.value.trim()) mtCheckOpen();
        else { MTS.answered=true; MTS.history[MTS.idx]=false; }
      } else if(t.type==='mc'){
        // Ingen val gjort – tel som feil og gå videre
        MTS.answered=true; MTS.history[MTS.idx]=false; mtUpdateProgress();
      } else {
        MTS.answered=true; MTS.history[MTS.idx]=false;
      }
    }
  }
  MTS.idx++;
  mtUpdateProgress();
  if(MTS.idx>=MTS.tasks.length){ mtShowSummary(); return; }
  mtRenderTask();
}

function mtShowSummary(){
  $mt('mt-task-wrap').innerHTML='';
  const total=MTS.tasks.length;
  const pct=total>0?Math.round((MTS.score/total)*100):0;
  $mt('mt-sum-score').textContent=`${MTS.score}/${total}`;
  $mt('mt-sum-rett').textContent=MTS.score;
  $mt('mt-sum-feil').textContent=total-MTS.score;
  $mt('mt-sum-pct').textContent=pct+'%';
  const msgs=[[90,'Utmerket! Du mestrer dette svært godt.'],[70,'Bra jobba! Du er på god vei.'],[50,'Greit! Øv litt mer på de vanskelige oppgavene.'],[0,'Ikke gi opp – prøv igjen!']];
  $mt('mt-sum-msg').textContent=(msgs.find(([t])=>pct>=t)||msgs[msgs.length-1])[1];

  // Oppgåveoversikt – vis hva som var rett og feil
  const hist = $mt('mt-sum-history');
  if(hist){
    lar html='';
    MTS.tasks.forEach((t,i)=>{
      const ok=MTS.history&&MTS.history[i];
      const icon=ok?'✓':'✗';
      const bg=ok?'background:rgba(130,201,168,0.15);border-color:rgba(130,201,168,0.3)':'background:rgba(240,160,144,0.15);border-color:rgba(240,160,144,0.3)';
      const col=ok?'#82c9a8':'#f0a090';
      html+=`<div style="${bg};border:1px solid;border-radius:8px;padding:0.5rem 0.8rem;margin-bottom:6px;display:flex;gap:10px;align-items:flex-start;font-size:13px">
        <span style="color:${col};font-weight:600;flex-shrink:0">${icon}</span>
        <div style="color:rgba(255,255,255,0.8);flex:1">${mtEsc((t.q||t.sporsmal||'').substring(0,80))}${ok?'':` <span style="color:#f0a090">→ Rett: ${mtEsc(t.fasit)}</span>`}</div>
      </div>`;
    });
    hist.innerHTML=html;
  }

  $mt('mt-summary').style.display='block';
  $mt('mt-start-btn').disabled=false;
}

