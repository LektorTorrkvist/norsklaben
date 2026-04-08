/* ══════════════════════════════════════════════════════
  MENGDETRENING – oppgåvebank + motor (importert frå V1)
══════════════════════════════════════════════════════ */
const MT_BANK = [

/* ── OG / Å (10) ── */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Ho likar ___ danse.»',
 alt:['og','å'],fasit:'å',
 regel:'«Å» kjem framfor eit verb i infinitiv. Test: «det å danse» – ja → bruk «å».',
 eks:'Ho likar å danse. Han prøver å lese.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Han et pizza ___ drikk brus.»',
 alt:['og','å'],fasit:'og',
 regel:'«Og» bind saman to ord, ledd eller setningar. Test: bytt ut med «pluss» – gir det meining?',
 eks:'Han et pizza og drikk brus. Ho syng og dansar.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'lett',
 q:'Fyll inn «og» eller «å»: «Eg prøver ___ lese meir.»',
 hint:'«Å» er eit infinitivsmerke som kjem framfor verb (å lese, å skrive). «Og» er eit bindeord som bind saman ledd og setningar.',
 fasit:'å',fasit_v:['å'],
 regel:'«Å» + infinitiv. «Prøver å lese» = rett.',
 eks:'Eg prøver å lese. Dei forsøker å forstå.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Kva er rett? «Det er gøy ___ spele fotball.»',
 alt:['og spele','å spele'],fasit:'å spele',
 regel:'«Å» kjem framfor infinitiv. Etter adjektiv/adverb + «er» kjem ofte «å + verb».',
 eks:'Det er gøy å spele. Det er viktig å øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn rett ord: «Katten ___ hunden likar kvarandre.»',
 hint:'Test: kan du byte ut med «pluss» og setninga gir framleis meining?',
 fasit:'og',fasit_v:['og'],
 regel:'«Og» bind saman to subjekt.',
 eks:'Katten og hunden leikar. Per og Kari er vener.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Kva er feil i denne setninga? «Ho ville og hjelpe, og rydde rommet.»',
 alt:['«og hjelpe» er feil – rett er «ville å hjelpe og rydde»','«og rydde» er feil – skal vere «å rydde»','Begge «og» er rette','Setninga er heilt utan feil'],
 fasit:'«og hjelpe» er feil – rett er «ville å hjelpe og rydde»',
 regel:'Etter modalverbet «ville» kjem infinitiv med «å»: «ville å hjelpe». To infinitivar kopla med «og»: «ville å hjelpe og rydde».',
 eks:'Ho ville å hjelpe og rydde rommet.'},

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Det er viktig ___ ete frukost kvar dag.»',
 hint:'Etter «Det er viktig» + blank kjem eit verb. Kva form er det – infinitiv?',
 fasit:'å',fasit_v:['å'],
 regel:'«Det er viktig å …» – infinitivskonstruksjon med «å».',
 eks:'Det er viktig å sove nok. Det er lurt å øve.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse setningane er FEIL?',
 alt:['Eg likar å lese og å skrive.','Eg likar og lese og skrive.','Eg likar å lese og skrive.','Dei ville hjelpe og rydde.'],
 fasit:'Eg likar og lese og skrive.',
 fasit_v:['Eg likar og lese og skrive.'],
 regel:'Etter «likar» kjem infinitiv med «å». «Og lese» er feil – det skal vere «å lese». Merk: Begge «Eg likar å lese og skrive» og «Eg likar å lese og å skrive» er rette.',
 eks:'FEIL: «og lese» / RETT: «å lese». Begge «å lese og skrive» og «å lese og å skrive» er normerte.'},



{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskeleg',
 q:'Kva er ALLE feila i: «Eg ville og hjelpe, og lære, og det var gøy og gjere.»?',
 alt:['Alle tre skal vere «å»','Berre «og hjelpe» er feil','«og det» er feil','Setninga er rett'],
 fasit:'Alle tre skal vere «å»',
 regel:'Modalverb (ville) og adjektiv (gøy) styrer infinitiv med «å». Berre det midtre «og» (mellom hjelpe og lære) er eit bindeord.',
 eks:'Eg ville å hjelpe og å lære, og det var gøy å gjere.'},

/* ── OG / Å – ekstra 15 (finn_feil · klikk_marker · drag_ord · drag_kolonne · open · mc · cloze) ── */

/* — finn_feil: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'lett',
 q:'Klikk på det eine ordet som er FEIL brukt i setninga.',
 tekst:'Læraren bad elevane og tenke over spørsmålet.',
 fasit_feil:['og'],
 regel:'Etter «bad» kjem infinitiv → infinitivsmerket er «å», ikkje «og»: «bad elevane å tenke».',
 eks:'«bad nokon å gjere noko» – alltid «å + infinitiv» etter «be» eller «bad».'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'medium',
 q:'To ord er feil brukte. Klikk på begge.',
 tekst:'Ho hadde lyst og synge, å alle i klassen ville høyre henne.',
 fasit_feil:['og','å'],
 regel:'«Hadde lyst og synge» → feil; rett er «lyst TIL å synge». «Å alle» → «å» er ikkje bindeord; rett er «og alle».',
 eks:'RETT: «Ho hadde lyst til å synge, og alle i klassen ville høyre henne.»'},

{kat:'og_aa',kat_label:'Og / å',type:'finn_feil',vanske:'vanskeleg',
 q:'To ord er feil brukte. Klikk på begge.',
 tekst:'Eg trur det er svært viktig og forstå grammatikk, å eg øver derfor kvar dag.',
 fasit_feil:['og','å'],
 regel:'«Viktig og forstå» → «viktig Å forstå» (infinitiv). «Å eg øver» → «OG eg øver» (bindeord mellom to heilsetningar).',
 eks:'RETT: «Det er viktig å forstå grammatikk, og eg øver kvar dag.»'},

/* — klikk_marker: heilt ny type i heile banken — */
{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'lett',
 q:'Klikk på det eine ordet i teksten som er eit infinitivsmerke («å»).',
 tekst:'Ho og venninna tok bussen og gjekk inn i butikken for å handle.',
 maalordklasse:'å (infinitivsmerke)',
 fasit_ord:['å'],
 regel:'«For å handle» = infinitivsmerket «å» + verbet «handle» i infinitiv. Dei andre «og»-ane er bindeord som bind saman ledd.',
 eks:'«for å handle, til å hjelpe, nok til å forstå» = infinitiv. «Ho og venninna, bussen og gjekk» = bindeord.'},

{kat:'og_aa',kat_label:'Og / å',type:'klikk_marker',vanske:'medium',
 q:'Klikk på det eine ordet i teksten som er eit BINDEORD («og»).',
 tekst:'Ho prøvde å rydde, å skrive og å forstå alt på éin gong.',
 maalordklasse:'og (bindeord)',
 fasit_ord:['og'],
 regel:'«Og» bind saman dei tre infinitivane: «å rydde, å skrive og å forstå». Dei tre «å»-ane er infinitivsmerke framfor kvart verb.',
 eks:'Listeform: å rydde, å skrive og å forstå • Kortform (normert): å rydde, skrive og forstå'},

/* — drag_ord: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_ord',vanske:'middels',
 q:'Trykk orda inn i rett rekkjefølge – kvar høyrer «å» og «og» heime?',
 ord:['Ho','likar','å','lese','og','skrive'],
 fasit:'Ho likar å lese og skrive',
 regel:'«Likar å lese» = infinitiv etter «likar». «Og skrive» = koordinert infinitiv utan nytt «å» (normert kortform).',
 eks:'«Ho likar å lese og (å) skrive» – begge variantar er rette.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_ord',vanske:'middels',
 q:'Trykk orda inn i rett rekkjefølge – set «å» og «og» på rett plass.',
 ord:['Det','er','viktig','å','sove','nok,','og','det','veit','dei','fleste'],
 fasit:'Det er viktig å sove nok, og det veit dei fleste',
 regel:'«Viktig å sove» = infinitiv etter adjektiv. «Og det veit dei fleste» = ny heilsetning bunden saman med bindeordet «og».',
 eks:'[Adjektiv] + å + [infinitiv]. Ny setning etter komma → og + [setning].'},

/* — drag_kolonne: ny type for og_aa — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Kva setning brukar «å» som infinitivsmerke, og kva brukar «og» som bindeord?',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
   {tekst:'Ho likar å danse.',fasit:0},
   {tekst:'Katten og hunden leikar.',fasit:1},
   {tekst:'Det er gøy å svømme.',fasit:0},
   {tekst:'Han er sterk og modig.',fasit:1},
   {tekst:'Eg prøver å lese.',fasit:0},
   {tekst:'Ho syng og ler.',fasit:1},
 ],
 regel:'«Å» kjem framfor eit verb i infinitiv. «Og» bind saman ord, ledd eller setningar.',
 eks:'å danse = infinitiv. katten og hunden = koordinasjon av subjekt.'},

{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'lett',
 q:'Sorter: Brukar uttrykket «å» (infinitivsmerke) eller «og» (bindeord)?',
 kolonner:['Bruker «å» (infinitivsmerke)','Bruker «og» (bindeord)'],
 ord:[
   {tekst:'Ho hadde lyst til å hjelpe.',fasit:0},
   {tekst:'både mat og drikke',fasit:1},
   {tekst:'Det er dumt å lyge.',fasit:0},
   {tekst:'sterk, klok og snill',fasit:1},
   {tekst:'nøye nok til å bestå',fasit:0},
   {tekst:'brød og smør',fasit:1},
   {tekst:'Ho lærte seg å symje.',fasit:0},
   {tekst:'sol og regn om kvarandre',fasit:1},
 ],
 regel:'«Til å + infinitiv» og «nok til å + infinitiv» er faste infinitivskonstruksjonar. «Og» mellom substantiv og adjektiv er bindeord.',
 eks:'lyst til å hjelpe • nøye nok til å bestå • mat og drikke • sterk og klok'},

/* — sorter-oppgåve i staden for open — */
{kat:'og_aa',kat_label:'Og / å',type:'drag_kolonne',vanske:'medium',
 q:'Sorter: Kva funksjon har «å» og «og» i kvar av desse setningane?',
 kolonner:['Å (infinitivsmerke)','Og (bindeord)'],
 ord:[
   {tekst:'Eg prøver å forstå reglane.',fasit:0},
   {tekst:'Katten og hunden leikar saman.',fasit:1},
   {tekst:'Det er gøy å skrive.',fasit:0},
   {tekst:'Ho les og skriv kvar dag.',fasit:1},
   {tekst:'Vi drog for å oppleve noko nytt.',fasit:0},
   {tekst:'Han åt pizza og drakk brus.',fasit:1},
 ],
 regel:'«Å» kjem framfor infinitiv (å forstå, å skrive). «Og» bind saman ledd eller setningar.',
 eks:'å forstå, å lese = infinitivsmerke • katten og hunden, les og skriv = bindeord'},

/* — mc: nye scenario inkl. modalverb-regel — */
{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'lett',
 q:'Vel rett ord: «Vi reiste ___ oppleve noko nytt.»',
 alt:['for å','for og','å','og'],
 fasit:'for å',
 regel:'«For å + infinitiv» tyder «med det formålet å». «For og» finst ikkje som konstruksjon.',
 eks:'Vi reiste for å oppleve noko nytt. Ho sparer for å kjøpe sykkel.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'medium',
 q:'Kva er rett? «Han ___ hjelpe til.»',
 alt:['vil å hjelpe','vil hjelpe','og hjelpe','ynskjer å ikkje hjelpe'],
 fasit:'vil hjelpe',
 regel:'Etter modalverba «vil», «kan», «skal», «bør», «må» kjem infinitiv UTAN «å»: «vil hjelpe», «kan gå», «skal kome».',
 eks:'FEIL: «kan å kome» / RETT: «kan kome». Samanlikn: «ynskjer å kome» – «ynskjer» er ikkje modalverb → bruker «å».'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskeleg',
 q:'Kva er FEIL?',
 alt:['Ho kan ikkje å kome i morgon.','Ho kan ikkje kome i morgon.','Ho klarer ikkje å kome i morgon.','Ho er ikkje i stand til å kome i morgon.'],
 fasit:'Ho kan ikkje å kome i morgon.',
 regel:'«Kan» er modalverb → bare infinitiv UTAN «å»: «kan kome». «Klarer» og «er i stand til» er ikkje modalverb → dei styrer «å + infinitiv».',
 eks:'FEIL: «kan å + infinitiv». RETT: «kan + infinitiv». «klarer å», «prøver å», «ynskjer å» = correct med «å».'},

/* — cloze: nye kontekstar — */
{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'medium',
 q:'Fyll inn rett ord: «Vi bestemte oss for ___ reise til fjells i helga.»',
 hint:'«Bestemte seg for» vert alltid følgt av «å + infinitiv».',
 fasit:'å',fasit_v:['å'],
 regel:'«Bestemte seg for å + infinitiv» er ein fast konstruksjon. «For» er ikkje bindeord her – det er ein del av verbet «bestemme seg for».',
 eks:'bestemme seg for å gjere noko • planlegge å gjere noko • beslutte å gjere noko'},


/* ── SAMANSETTE ORD (10) ── */
{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte?',
 alt:['sjokolade kake','sjokoladekake','sjokolate kake','sjokolat kake'],
 fasit:'sjokoladekake',
 regel:'Samansette ord skriv ein SAMAN i norsk. «Sjokolade» + «kake» = «sjokoladekake».',
 eks:'sjokoladekake, fotballbane, barneskule'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett (eitt ord): «Han spelar på ___» (fotball + bane)',
 hint:'Slå saman dei to delane til eitt ord – ingen mellomrom.',
 fasit:'fotballbana',fasit_v:['fotballbana','fotballbane'],
 regel:'«Fotball» + «bane» = «fotballbane/fotballbana» – eitt ord. «Bane» er hokjønn på nynorsk, difor «bana» i bunden form.',
 eks:'fotballbana, basketballbane, sandvolleyballbane'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva skjer viss du skriv «lamme lår» i staden for «lammelår»?',
 alt:['Det tyder lår frå lam (mat)','Det tyder lår som er lamme/paralyserte 😬','Det er same meining begge vegar','Det er berre ein stavefeil'],
 fasit:'Det tyder lår som er lamme/paralyserte 😬',
 regel:'Særskriving kan gi heilt feil meining. «Lammelår» = mat. «Lamme lår» = paralyserte lår.',
 eks:'lammelår vs. lamme lår, tunfiskbitar vs. tunfisk bitar'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett (eitt ord): «Ho fekk ein ___ av besteveninna» (kjempe + klem)',
 hint:'«Kjempe-» og «klem» – skriv dei saman til eitt ord.',
 fasit:'kjempeklem',fasit_v:['kjempeklem'],
 regel:'«Kjempe-» som forleddd skriv ein saman med ordet det beskriv.',
 eks:'kjempeklem, kjempestor, kjempebra'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'medium',
 q:'Kva av desse er FEIL skrive?',
 alt:['barneskule','ungdoms skule','vidaregåande skule','folkehøgskule'],
 fasit:'ungdoms skule',
 regel:'«Ungdomsskule» er eitt ord – ikkje to. Mellomleddet «ungdoms-» kjem frå «ungdom».',
 eks:'barneskule, ungdomsskule, vidaregåande skule'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'medium',
 q:'Skriv rett (eitt ord): «Vi et ___ til påske» (påske + middag)',
 hint:'«Påske» + «middag» sett saman – høgtidsmat skriv ein alltid i eitt ord.',
 fasit:'påskemiddag',fasit_v:['påskemiddag'],
 regel:'Høgtidsmåltid skriv ein saman: julefrokost, påskemiddag, pinnekjøttmiddag.',
 eks:'julefrokost, påskemiddag, bursdagskake'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'medium',
 q:'«Ananas ringer» i staden for «ananasringar» – kva tyder særskrivinga?',
 alt:['Ringar laga av ananas','Ananas med mobiltelefon? 🍍📱','Same meining','Ei slags ringform til frukt'],
 fasit:'Ananas med mobiltelefon? 🍍📱',
 regel:'«Ringer» er presensform av «å ringe». Særskriving gjer «ananasringar» om til noko heilt anna!',
 eks:'ananasringar (mat) vs. ananas ringer (ananas med mobiltelefon? 🍍📱)'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'medium',
 q:'Skriv rett (eitt ord): «Ho er ___ i nynorsk» (kjempe + god)',
 hint:'«Kjempe-» skriv alltid saman med adjektivet det forsterkar.',
 fasit:'kjempegod',fasit_v:['kjempegod'],
 regel:'«Kjempe-» som forsterkingsforleddd skriv alltid saman med adjektivet.',
 eks:'kjempegod, kjempestor, kjempeflott, kjempekjem'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse treng bindestrek?',
 alt:['barnetv','barneskule','barnehage','barnebidrag'],
 fasit:'barnetv',
 regel:'Bindestrek brukast mellom eit norsk ord og ei forkorting/tal: barne-tv, mini-golf, 10-åring.',
 eks:'barne-tv, mini-golf, nrk-programmet, 8-klassing'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'vanskeleg',
 q:'Skriv rett (eitt ord): «Det er ein ___ i dag» (sol + skin + dag)',
 hint:'Nokre samansettingar har eit -s- mellom ledda (fugeform). Sol + skinn + dag → ?',
 fasit:'solskinnsdag',fasit_v:['solskinnsdag','solskinsdag'],
 regel:'Nokre samansetningar har fugeform med -s-: solskinnsdag, fredagskveld, julenissedrakt.',
 eks:'fredagskveld, julenisse, solskinnsdag, juletre'},

/* ── SETNINGSBYGGING (10) ── */
{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva er problemet med setninga: «Han gjekk tur og det var kaldt og han hadde ikkje lue og det var dumt.»?',
 alt:['For mange «og» – setninga bør delast opp','«tur» skal vere «turen»','«kaldt» er feil','«lue» er feil ord'],
 fasit:'For mange «og» – setninga bør delast opp',
 regel:'Unngå lange samankopling av setningarar med mange «og». Del opp med punktum og variér setningsoppbygginga.',
 eks:'Han gjekk tur. Det var kaldt, og han angra på at han hadde gløymt lua.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva setning er best skriven?',
 alt:['Det er bra å trene fordi det er bra.','Regelmessig trening styrkjer hjartet og betre humøret.','Regelmessig trening styrkjer hjartet og betrar humøret.','Trening er bra for deg.'],
 fasit:'Regelmessig trening styrkjer hjartet og betrar humøret.',
 regel:'Unngå å repetere same ord («bra og bra»). Bruk presis og variert ordval.',
 eks:'Regelmessig trening styrkjer hjartet og betrar humøret.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva er den beste oppdelninga av: «Det var kaldt ute og han ville ikkje gå og han vart heime.»?',
 alt:[
   'Det var kaldt ute. Han ville ikkje gå og vart heime.',
   'Det var kaldt, ute og han ville ikkje gå. Han vart heime.',
   'Det var kaldt ute og han ville ikkje gå. Og han vart heime.',
   'Det var kaldt. Ute og han ville ikkje gå og han vart heime.'
 ],
 fasit:'Det var kaldt ute. Han ville ikkje gå og vart heime.',
 regel:'Del opp der eit nytt hovudpoeng startar. «Det var kaldt ute» = éi setning. «Han ville ikkje gå og vart heime» = éi setning med to verb til same subjekt.',
 eks:'Det var kaldt ute. Han ville ikkje gå og vart heime.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva er munnleg uttrykk som ikkje høyrer heime i ein fagartikkel?',
 alt:['og sånn','dessutan','til dømes','imidlertid'],
 fasit:'og sånn',
 regel:'Unngå munnlege uttrykk i formell tekst: «og sånn», «liksom», «osv.», «på ein måte».',
 eks:'UNNGÅ: «Det er bra og sånn.» BRUK: «Dette har fleire fordelar.»'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Kva feil er det i: «KI altså kunstig intelligens er eit dataprogram.»?',
 alt:['Setninga er for lang og ustrukturert','«altså» er feil ord her','«dataprogram» er feil','Det er ingen feil'],
 fasit:'Setninga er for lang og ustrukturert',
 regel:'Forklaringar i parentes eller komma-innsetning gir betre flyt: «KI (kunstig intelligens) er eit dataprogram.»',
 eks:'KI (kunstig intelligens) er eit dataprogram som kan lærast opp.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
 q:'Kva er den beste samanslåinga av: «Brettspel er bra. Brettspel samlar folk. Brettspel er sosialt.»?',
 alt:[
   'Brettspel er sosialt og samlar folk til felles aktivitet.',
   'Brettspel er bra, samlar folk og brettspel er sosialt.',
   'Brettspel er bra. Og sosialt. Og samlar folk.',
   'Brettspel er bra fordi brettspel er sosialt og samlar folk.'
 ],
 fasit:'Brettspel er sosialt og samlar folk til felles aktivitet.',
 regel:'Slå saman setningar med same tema. Unngå å gjenta «Brettspel» fleire gonger. Pronomen eller effektiv samansetning gir betre flyt.',
 eks:'Brettspel er sosialt og samlar folk til felles aktivitet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'lett',
 q:'Kva setningsstarter UNNGÅR du helst å bruke to gonger på rad?',
 alt:['Same opningsord gjentek seg frå setning til setning','«Dessutan» er eit bra bindeord å variere med','«Imidlertid» er eit fint formelt alternativ','«Difor» gir god kontrast mellom setningar'],
 fasit:'Same opningsord gjentek seg frå setning til setning',
 regel:'Variasjon i setningsstarter gjer teksten meir lesarvennleg. Bruk pronomen, synonym eller variér oppbygginga.',
 eks:'Brettspel er sosialt. Det samlar folk og... / Slike spel kan...'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskeleg',
 q:'Kva er den beste omskrivinga av: «Det er lurt å bruke KI fordi det gjer arbeidet raskare og meir effektivt.»?',
 alt:['KI gjer arbeidet raskare og effektivare, noko som frigjer tid til djupare læring (Jensen, 2024).','Det er lurt å bruke KI fordi KI er effektivt og raskt og bra.','KI er bra. Det er effektivt.','Bruk KI. Det er lurt.'],
 fasit:'KI gjer arbeidet raskare og effektivare, noko som frigjer tid til djupare læring (Jensen, 2024).',
 regel:'Utdjup kvifor noko er lurt. Bruk presise ord, unngå gjentak, og legg til kjelde.',
 eks:'KI gjer arbeidet raskare og effektivare, noko som frigjer tid til djupare læring (Jensen, 2024).'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskeleg',
 q:'Kva er den beste faglege omskrivinga av: «Klimaendringar er et veldig stort problem og sånn, og det påverkar alle og vi bør gjere noko.»?',
 alt:[
   'Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.',
   'Klimaendringar er eit veldig alvorleg problem og det er viktig å gjere noko.',
   'Klimaendringane er store og alle bør gjere noko.',
   'Klimaendringar er eit problem som påverkar oss, og vi må handle.'
 ],
 fasit:'Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.',
 regel:'Fjern «og sånn», vage ord og samankopling av setningarar. Bruk presist og variert ordval. «Veldig stort» → «alvorleg globalt», «vi bør gjere noko» → «krev handling frå alle».',
 eks:'Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'vanskeleg',
 q:'Kva verkemiddel gjer denne setninga sterkare: «Klimaet endrar seg.» → «Klimaet endrar seg – og ingen kan sjå på lenger.»?',
 alt:['Tankestrek og appell til ansvar','Eit komma','Eit spørsmålsteikn','Lengre setning'],
 fasit:'Tankestrek og appell til ansvar',
 regel:'Tankestrek kan skape dramatisk pause og tyngde. Appell til ansvar engasjerer lesaren i debattsjanger.',
 eks:'Klimaet endrar seg – og ingen kan sjå på lenger.'},

/* ── TEKSTSTRUKTUR (10) ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Kva er ein ingress?',
 alt:['Ein til to setningar som innleier og presenterer temaet','Den lengste hovuddelen av teksten','Kjeldelista nedst i teksten','Avslutninga av teksten'],
 fasit:'Ein til to setningar som innleier og presenterer temaet',
 regel:'Ingressen kjem etter overskrifta og gir lesaren eit raskt overblikk over kva teksten handlar om.',
 eks:'«Plasten i havet utgjer ein av vår tids største miljøkatastrofar. Her er det du treng å vite.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Kva delar bør ein fagartikkel ha?',
 alt:['Ingress, innleiing, hovuddel, avslutning','Berre hovuddel','Overskrift og kjeldeliste','Tal på delar spelar inga rolle'],
 fasit:'Ingress, innleiing, hovuddel, avslutning',
 regel:'Ein fagartikkel bør ha tydeleg struktur med ingress, innleiing, hovuddel og avslutning.',
 eks:'Ingress + innleiing gir retning. Hovuddelen forklarer. Avslutninga rundar av.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Kva er ei temasetning?',
 alt:['Den første setninga som angir kva heile avsnittet handlar om','Den siste og oppsummerande setninga i avsnittet','Ein tittel på eit avsnitt','Ei setning med kjelde'],
 fasit:'Den første setninga som angir kva heile avsnittet handlar om',
 regel:'Temasetning = første setning i avsnittet. Resten av avsnittet utdjupar denne eine tanken.',
 eks:'«Klimaendringar påverkar vintersportsesongen direkte.» – resten av avsnittet utdjupar dette.'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Eit godt avsnitt har: temasetning → ___ → (eventuell) avslutningssetning',
 hint:'Tenkjer du på det som utdjupar hovudpoenget? Det kan kallast fleire ting.',
 fasit:'utdjupande setningar',
 fasit_v:['utdjupande setningar','kommentarsetningar','kommentarsetning','kommentarsetninger','utfyllande kommentarsetningar','utdjupande kommentarsetningar','forklaringar og døme','forklaring og døme','bevis og forklaring','utdjuping','kommentarar'],
 regel:'Etter temasetning kjem utdjupande kommentarsetningar med forklaring, bevis og døme.',
 eks:'Temasetning → forklaring → bevis/kjelde → konsekvens/kommentar'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Kva er FEIL om ei avslutting i ein fagartikkel?',
 alt:['Ho skal oppsummere hovudpoenga','Ho skal introdusere ny informasjon','Ho bør knyte an til innleiinga','Ho bør vere kortare enn hovuddelen'],
 fasit:'Ho skal introdusere ny informasjon',
 regel:'Avslutninga oppsummerer og avrundar – ho tek ikkje opp nye tema eller argument.',
 eks:'FEIL: «Forresten er det og eit problem med havforsuring...» (nytt tema i avslutting)'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Kva skil strukturen i eit debattinnlegg frå ein fagartikkel?',
 alt:['Debattinnlegg: påstand tidleg. Fagartikkel: nøytral','Fagartikkelen har alltid fleire avsnitt','Debattinnlegget treng ikkje innleiing','Fagartikkelen brukar aldri kjelder'],
 fasit:'Debattinnlegg: påstand tidleg. Fagartikkel: nøytral',
 regel:'Fagartikkel: nøytral, informativ. Debattinnlegg: tek tydeleg standpunkt frå første avsnitt.',
 eks:'FA: «Plastforureining er eit stort problem.» DI: «Eg meiner plastposen bør forbydast no!»'},



{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Kvar høyrer eit motargument heime i eit debattinnlegg?',
 alt:['I hovuddelen, der det blir presentert og tilbakevist','Berre i avslutninga','I innleiinga','Motargument skal ikkje takast med'],
 fasit:'I hovuddelen, der det blir presentert og tilbakevist',
 regel:'Å nemne og tilbakevise motargument styrkjer truverdet ditt. Det viser at du kjenner saka frå fleire sider.',
 eks:'«Nokon vil hevde at plastpose-forbod er upraktisk – men miljøkonsekvensane overstig denne ulempa.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'vanskeleg',
 q:'Kva er ring-komposisjon i ein tekst?',
 alt:['Avslutninga vender tilbake til eit motiv eller bilete frå innleiinga','Teksten er skriven i sirklar','Alle avsnitt startar med same ord','Konklusjonen kjem først'],
 fasit:'Avslutninga vender tilbake til eit motiv eller bilete frå innleiinga',
 regel:'Ring-komposisjon gir teksten heilskap og avsluttar elegant ved å knyte saman start og slutt.',
 eks:'Innleiing: «Snøen smeltar...» Avslutting: «Og smeltar snøen heilt – kva har vi igjen?»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'vanskeleg',
 q:'Kva retorisk appelform brukar ein når ein refererer til forsking og tal i eit debattinnlegg?',
 hint:'Det er ein av dei tre klassiske appelformane. Fornuft og fakta – ikkje kjensler eller truverd.',
 fasit:'logos',fasit_v:['logos'],
 regel:'Logos = fornuftsappell. Bruk av fakta, statistikk og logisk argumentasjon.',
 eks:'«Ifølge SSB (2024) har plastforureininga i norske farvatn dobla seg sidan 2010.» (logos)'},

/* ── KJELDEBRUK (10) ── */
{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Korleis skriv du ei kjeldetilvising i teksten?',
 alt:['(Etternamn, årstal) – t.d. (Jensen, 2024)','[lenke til nettsida]','«sitat» - forfatter','Forfattar: tittel'],
 fasit:'(Etternamn, årstal) – t.d. (Jensen, 2024)',
 regel:'Bruk parentesar med etternamn og årstal etter påstandar henta frå kjelder.',
 eks:'Plasten har auka med 40 % sidan 2010 (Jensen, 2024).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Kvar i teksten skal kjeldelista stå?',
 alt:['Heilt til slutt i dokumentet','I innleiinga','Midt i teksten','Rett etter den første kjelda er brukt'],
 fasit:'Heilt til slutt i dokumentet',
 regel:'Kjeldelista kjem alltid aller sist i teksten, gjerne med overskrifta «Kjeldeliste».',
 eks:'Hovudtekst → ... → Avslutting → Kjeldeliste'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Korleis skal kjeldene i lista vere sorterte?',
 alt:['Alfabetisk etter forfattar sitt etternamn','Etter dato dei er henta','Tilfeldig rekkjefølge','Etter kor viktige dei er'],
 fasit:'Alfabetisk etter forfattar sitt etternamn',
 regel:'Kjeldelista er alfabetisk sortert etter forfattar sitt etternamn.',
 eks:'Andersen (2022) kjem før Berg (2023), som kjem før Dahl (2021).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'cloze',vanske:'lett',
 q:'Fyll inn: Alle kjelder du brukar i teksten med ___ skal og stå i kjeldelista.',
 hint:'Kva skriv du rundt (Etternamn, årstal) – kva type teikn er det?',
 fasit:'parentes',fasit_v:['parentes','parentesar','parentesreferansar','(Etternamn, årstal)'],
 regel:'Kvar kjeldetilvising i teksten (Etternamn, årstal) skal ha ein tilsvarande fullstendig referanse i kjeldelista.',
 eks:'I tekst: (Jensen, 2024) → I lista: Jensen, K. (2024). Tittel. Henta frå: lenke'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva er rett format for ein kjeldelistepost frå ei nettside?',
 alt:['Etternamn, F. (årstal). Tittel. Henta [dato] frå: lenke','Lenke – tittel – forfatter','Tittel (årstal): lenke','Forfatter: tittel, årstal'],
 fasit:'Etternamn, F. (årstal). Tittel. Henta [dato] frå: lenke',
 regel:'Standardformat: Etternamn, Fornavn-initial (årstal). Tittel. Henta [dato] frå: [URL]',
 eks:'Jensen, K. (2024). Plast i havet. Henta 15. mars 2026 frå: miljodirektoratet.no/...'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva er etos i samband med kjeldebruk?',
 alt:['Truverdet teksten får når ein brukar pålitelege kjelder','Kjensler ein vekkjer hos lesaren','Logiske argument med tal','Lengda på kjeldelista'],
 fasit:'Truverdet teksten får når ein brukar pålitelege kjelder',
 regel:'Etos = truverd. Gode kjelder styrkar din etos som skrivar – lesaren stolar meir på deg.',
 eks:'«Ifølge Havforskingsinstituttet (2023)…» gir sterkare etos enn «Eg trur at…»'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Ifølge ___ (2024) har snøsesongen blitt kortare.»',
 hint:'Bakgrunn: Ei NRK-sak frå 2024 rapporterte om kortare vintersesong. Korleis skriv du kjelda når du ikkje veit forfattarnamnet?',
 fasit:'NRK',fasit_v:['NRK','Etternamn','Forfattarnamn','forfattarnamn','[Etternamn]','[Forfattar]'],
 regel:'Når ei kjelde manglar personleg forfattar, brukar ein organisasjonen sitt namn: (NRK, 2024).',
 eks:'Ifølge NRK (2024) har snøsesongen blitt kortare.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva er FEIL kjeldebruk?',
 alt:['Kopiere heile avsnitt frå ei nettside utan sitat og kjelde','Bruke ein faktapåstand med (Jensen, 2024)','Ha kjeldeliste på slutten','Skrive «Ifølge Miljødirektoratet (2023)…»'],
 fasit:'Kopiere heile avsnitt frå ei nettside utan sitat og kjelde',
 regel:'Å kopiere tekst utan å markere det som sitat og oppgi kjelde er plagiat. Alltid parfraser eller bruk sitat med kjelde.',
 eks:'FEIL: (kopiert tekst utan kjelde). RETT: «…» (Jensen, 2024). / Parafrase (Jensen, 2024).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse er eit korrekt sitat med kjeldetilvising?',
 alt:['"Det har aldri vore meir kunstsnø i skibakkane" (NRK, 2022).','NRK skreiv i 2022 at det er mykje kunstsnø.','Kunstsnø er mykje brukt (kjelda er NRK).','(NRK) Det er mykje kunstsnø.'],
 fasit:'"Det har aldri vore meir kunstsnø i skibakkane" (NRK, 2022).',
 regel:'Direkte sitat: bruk hermeteikn rundt det eksakte sitatet, deretter (Kjelde, årstal) i parentes.',
 eks:'«Det har aldri vore meir kunstsnø» (NRK, 2022).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'cloze',vanske:'vanskeleg',
 q:'Ei kjelde i teksten er (Villspor, 2023). Skriv korleis dette ser ut i kjeldelista (fyll inn manglande del):\n«Villspor. (2023). Friluftsliv frå 1970 til i dag. ___ 15. mars 2026 frå: magasinetvillspor.no/...»',
 hint:'Kva ord brukar ein i kjeldelista for å fortelje at ein har besøkt ei nettside ein bestemt dato?',
 fasit:'Henta',fasit_v:['Henta','henta'],
 regel:'Standardfrasen er «Henta [dato] frå:» i kjeldelista for nettkjelder.',
 eks:'Jensen, K. (2024). Tittel. Henta 15. mars 2026 frå: lenke.no'},



{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (vanleg rekkjefølge):',
 ord:['Jenta','las','ei','bok','på','senga','.'],
 fasit:'Jenta las ei bok på senga .',
 regel:'Grunnrekkjefølge: Subjekt – Verbal – Objekt – Adverbial.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (V2, tidsadverbial fremst):',
 ord:['I','dag','skal','vi','ha','prøve','.'],
 fasit:'I dag skal vi ha prøve .',
 regel:'«I dag» er adverbial fremst → verb (skal) kjem på plass 2.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (V2, stadadverbial fremst):',
 ord:['Her','bur','mange','innvandrarar','.'],
 fasit:'Her bur mange innvandrarar .',
 regel:'«Her» fremst → verb (bur) på plass 2 FØR subjektet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (spørjesetning):',
 ord:['Kvifor','kom','du','ikkje','i','går','?'],
 fasit:'Kvifor kom du ikkje i går ?',
 regel:'I spørjesetningar: spørjeord – verb – subjekt – resten.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (leddsetning etter «at»):',
 ord:['Ho','seier','at','han','ikkje','kjem','.'],
 fasit:'Ho seier at han ikkje kjem .',
 regel:'I leddsetning («at…»): ikkje kjem FØR verbet etter subjektet.'},


/* ── BINDEORD (15) ── */
{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Kva bindeord passar best? «Ho var trøytt, ___ gjekk ho heim.»',
 alt:['difor','men','og','fordi'],fasit:'difor',
 fasit_v:['difor'],
 regel:'«Difor» viser konsekvens: ho var trøytt, og difor (= derfor) gjekk ho heim.',
 eks:'Ho var trøytt, difor gjekk ho heim.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Kva bindeord passar best? «Det regnar, ___ vi går ut likevel.»',
 alt:['men','difor','fordi','og'],fasit:'men',
 regel:'«Men» viser kontrast – to ting som går mot kvarandre.',
 eks:'Det regnar, men vi går ut likevel.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Kva bindeord viser årsak? «Han gjekk til legen ___ han var sjuk.»',
 alt:['fordi','men','difor','og'],fasit:'fordi',
 regel:'«Fordi» forklarer kvifor noko skjer.',
 eks:'Han gjekk til legen fordi han var sjuk.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Kva bindeord passar best? «Ho likar å lese ___ skrive.»',
 alt:['og','men','difor','fordi'],fasit:'og',
 regel:'«Og» bind saman to like ledd (addisjon).',
 eks:'Ho likar å lese og skrive.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva bindeord viser at noko er ekstra i tillegg til det som allereie er sagt?',
 alt:['dessutan','men','fordi','sjølv om'],fasit:'dessutan',
 regel:'«Dessutan» tyder «i tillegg» – adderer informasjon.',
 eks:'Det er billeg; dessutan er det nyttig.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva bindeord passar best? «___ det regnar, vil eg gå tur.»',
 alt:['sjølv om','fordi','difor','dessutan'],fasit:'sjølv om',
 regel:'«Sjølv om» viser at noko skjer trass i ein hindring.',
 eks:'Sjølv om det regnar, vil eg gå tur.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva bindeord passar best? «Forsking viser positive resultat; ___ er det òg utfordringar.»',
 alt:['likevel','difor','og','fordi'],fasit:'likevel',
 regel:'«Likevel» viser kontrast – trass i det positive finst det utfordringar.',
 eks:'Resultata er gode; likevel er det rom for forbetring.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva bindeord passar best? «KI kan vere nyttig, ___ det òg kan misbrukast.»',
 alt:['sjølv om','men','og','fordi'],fasit:'men',
 regel:'«Men» viser motsetnad mellom to påstandar.',
 eks:'KI kan vere nyttig, men det kan òg misbrukast.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva er skilnaden mellom «men» og «sjølv om»?',
 alt:['«Men» knyter to hovudsetningar; «sjølv om» innleier ein leddsetning','Dei tyder det same','«Sjølv om» er sterkare enn «men»','«Men» er bokmål; «sjølv om» er nynorsk'],
 fasit:'«Men» knyter to hovudsetningar; «sjølv om» innleier ein leddsetning',
 regel:'«Men» = koordinerande (mellom to hovudsetningar). «Sjølv om» = subordinerande (innleier leddsetning).',
 eks:'Ho er trøytt, men ho les. / Sjølv om ho er trøytt, les ho.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskeleg',
 q:'Kva er forskjellen på «fordi» og «sidan» som bindeord?',
 alt:['Begge viser årsak; «sidan» antyder at grunnen er kjent','«Fordi» er nynorsk; «sidan» er bokmål','«Sidan» viser tid; «fordi» viser stad','Dei tyder det same, ingen skilnad'],
 fasit:'Begge viser årsak; «sidan» antyder at grunnen er kjent',
 regel:'«Fordi» gir ny årsak. «Sidan» (kausal) brukas når grunnen er kjent for begge: «Sidan du er ekspert, kan du svare.»',
 eks:'Ho reiste hjem fordi ho var sjuk. / Sidan det regnar, tek vi bussen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Vel rett bindeord: «Sosiale medium kan vere nyttig; ___ er det viktig å bruke det med omhu.»',
 alt:['likevel','fordi','og','sjølv om'],fasit:'likevel',
 hint:'Kva ord viser kontrast – at noko er sant trass i det positive?',
 regel:'«Likevel» viser kontrast etter eit positivt utsagn.',
 eks:'Det er billeg; likevel er det risikabelt.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Vel rett bindeord: «___ ungdom skriv meir enn nokon gong, tyder det ikkje at dei skriv betre.»',
 alt:['sjølv om','fordi','dessutan','difor'],fasit:'sjølv om',
 hint:'Kva bindeord viser at noko skjer trass i ein annan realitet?',
 regel:'«Sjølv om» innleier ein leddsetning som viser kontrast.',
 eks:'Sjølv om det er vanskeleg, prøver ho.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskeleg',
 q:'Kva bindeord er FEIL i setninga: «Han studerte mykje, altså stryk han på eksamen.»?',
 alt:['altså','mykje','Han','eksamen'],fasit:'altså',
 regel:'«Altså» viser positiv konsekvens. Her er resultatet negativt. Rett: «likevel» eller «men».',
 eks:'Han studerte mykje, men strøyk på eksamen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskeleg',
 q:'Kva gruppe høyrer «medan», «etter at» og «før» til?',
 alt:['Tidsadverbial','Kontrastbindeord','Konsekvensbindeord','Årsaksadverbial'],
 fasit:'Tidsadverbial',
 regel:'«Medan», «etter at» og «før» viser tidstilhøve mellom to hendingar.',
 eks:'Medan det regnar, les eg. Etter at ho kom, gjekk vi.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskeleg',
 q:'Kva setning er korrekt formulert?',
 alt:['Fordi ho øvde mykje, difor vann ho.','Fordi ho øvde mykje, vann ho.','Ho øvde mykje, fordi ho vann.','Ho vann, fordi øvde ho mykje.'],
 fasit:'Fordi ho øvde mykje, vann ho.',
 regel:'Leddsetning med «fordi» som kjem først → komma + hovudsetning med rett V2-ordstilling. Ikkje bruk «difor» i tillegg.',
 eks:'Fordi ho øvde mykje, vann ho. (ikkje: ...difor vann ho)'},
{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge: bindeordet kjem mellom dei to setningane.',
 hint:'Kva bindeord høyrer heime her?',
 ord:['Ho vart','trøytt','difor','gjekk','ho heim'],
 fasit:['Ho vart','trøytt','difor','gjekk','ho heim'],
 regel:'«Difor» kjem mellom dei to setningane. Merk V2: etter «difor» kjem verbet «gjekk» før subjektet «ho».',
 eksempel:'Ho vart trøytt, difor gjekk ho heim.',kontrast_bm:'Hun ble trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge.',
 hint:'«Sjølv om» innleier ein leddsetning – kva kjem etter kommaet?',
 ord:['Sjølv om','det regnar','vil','eg','gå tur'],
 fasit:['Sjølv om','det regnar','vil','eg','gå tur'],
 regel:'Etter leddsetning med «sjølv om» kjem V2: verb + subjekt.',
 eksempel:'Sjølv om det regnar, vil eg gå tur.',kontrast_bm:'Selv om det regner, vil jeg gå tur.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'lett',
 q:'Kva bindeord passar best? «Ho trena mykje, ___ vann ho konkurransen.»',
 alt:['og difor','fordi','men','sjølv om'],fasit:'og difor',
 regel:'«Og difor» viser positiv konsekvens av noko som vart gjort.',
 eks:'Ho trena mykje, og difor vann ho konkurransen.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'medium',
 q:'Kva bindeord er GALE brukt? «Han åt mykje, dessutan gjekk han tidleg til sengs.»',
 alt:['dessutan','mykje','Han','tidleg'],fasit:'dessutan',
 regel:'«Dessutan» tyder «i tillegg» og brukas når noko leggast til. Her er det ikkje eit tillegg – bruk «difor» eller «og».',
 eks:'Han åt mykje og gjekk tidleg til sengs.'},

{kat:'bindeord',kat_label:'Bindeord',type:'mc',vanske:'vanskeleg',
 q:'Kva bindeord gjer det klart at to ting skjer samstundes?',
 alt:['medan','difor','fordi','men'],fasit:'medan',
 regel:'«Medan» viser at to hendingar pågår samstundes. Eks: «Ho les medan han søv».',
 eks:'Ho les medan han søv.'},


{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Difor»):',
 ord:['Difor','gjekk','ho','heim','tidleg','.'],
 fasit:'Difor gjekk ho heim tidleg .',
 regel:'Etter «difor» kjem verbet FØR subjektet (V2-regelen).'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Likevel»):',
 ord:['Likevel','møtte','han','opp','på','skulen','.'],
 fasit:'Likevel møtte han opp på skulen .',
 regel:'Etter «likevel» kjem verbet FØR subjektet: Likevel møtte han.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Dessutan»):',
 ord:['Dessutan','er','det','billegare','å','sykle','.'],
 fasit:'Dessutan er det billegare å sykle .',
 regel:'V2 etter adverbial: Dessutan er det. Verbet kjem på plass 2.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (leddsetning med «fordi»):',
 ord:['Ho','vann','fordi','ho','øvde','mykje','.'],
 fasit:'Ho vann fordi ho øvde mykje .',
 regel:'«Fordi» innleier leddsetning. Subjektet kjem FØR verbet i leddsetning.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'middels',
 sporsmal:'Sett orda i rett rekkjefølge (kontrastsetning med «men»):',
 ord:['Han','prøvde','hardt',',','men','lykkast','ikkje','.'],
 fasit:'Han prøvde hardt , men lykkast ikkje .',
 regel:'«Men» bind saman to hovudsetningar med komma føre.'},


/* ── SPØRJEORD – BANK (12 oppgåver) ── */












/* ── DOBBEL KONSONANT (20 oppgåver) ── */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av verbet i infinitiv?',
 alt:['hoppe','hoppa','hoppet','hopp'],fasit:'hoppe',
 regel:'Etter kort vokal kjem dobbel konsonant: «hoppe» (kort o → dobbel p).',
 eks:'hoppe, springe, kaste'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av verbet i infinitiv?',
 alt:['sitte','satt','sote','søtte'],fasit:'sitte',
 regel:'Etter kort vokal kjem dobbel konsonant: «sitte» (kort i → dobbel t).',
 eks:'sitte, legge, hoppe'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'lett',
 q:'Fyll inn: «ho ___ på stolen» (å sitte, presens)',
 fasit:'sit',fasit_v:['sit'],
 hint:'I presens (notid) har «å sitte» berre éin konsonant.',
 regel:'Infinitiv og fleirtal: «sitte», men presens eintal: «sit» (kort form). I nynorsk: sit.',
 eks:'ho sit, han sit'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av verbet i infinitiv?',
 alt:['la','legge','legget','lagt'],fasit:'legge',
 regel:'«Legge» (infinitiv) har dobbel g etter kort e: l-e-g-g-e.',
 eks:'å legge boka på bordet'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av verbet som handlar om å gje eit namn)?',
 alt:['kalle','kalte','kallet','kall'],fasit:'kalle',
 regel:'Etter kort vokal i rotstavinga kjem dobbel konsonant: «kalle» (kort a → dobbel l).',
 eks:'Eg kallar han Per.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kva ord er FEIL skrive?',
 alt:['lese','skrive','hoppe','siting'],fasit:'siting',
 regel:'Substantiv av «å sitte» vert «sitting» (dobbel t) – ikkje «siting».',
 eks:'sitting, hopping, kalling'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av adjektivet som handlar om å lage lite lyd?',
 alt:['stille','stile','still','sttille'],fasit:'stille',
 regel:'«Stille» (roleg) har dobbel l etter kort i.',
 eks:'Det er stille i rommet. Ei stille natt.'},



{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kvifor skriv ein «mat» men «matte»?',
 alt:['«Mat» er substantiv med lang vokal; «matte» har kort vokal og dobbel t','Det er tilfeldig','«Mat» er bokmål; «matte» er nynorsk','Begge har lang vokal'],
 fasit:'«Mat» er substantiv med lang vokal; «matte» har kort vokal og dobbel t',
 regel:'Lang vokal → enkel konsonant. Kort vokal → dobbel konsonant. «Maat» (lang a) = mat. «Matt» (kort a) = matte.',
 eks:'mat (lang a) vs. matte (kort a)'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva av desse orda er FEIL skrive?',
 alt:['bate','batte','sitte','kalle'],fasit:'bate',
 regel:'«Bate» (= å ha nytte av) skriv ein med dobbel t: «batte».',
 eks:'Det batta ikkje å prøve.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva er rett skrivemåte av verbet som tyder «å arbeide hardt for noko»?',
 alt:['streve','stræve','strivje','streve seg'],fasit:'streve',
 regel:'«Streve» har éin v fordi vokalen (e) er lang. Lang vokal → enkel konsonant.',
 eks:'Ho streva hardt for å klare det.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'vanskeleg',
 q:'Er «bil» eller «bill» rett skrivemåte?',
 fasit:'bil',fasit_v:['bil'],
 hint:'Tenk på vokalen – er «i»-en i «bil» lang eller kort?',
 regel:'«Bil» har lang i → éin l. Kort vokal → dobbel konsonant. «Bill» ville hatt kort i.',
 eks:'bil (lang i), bill (finst ikkje i norsk)'},
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte? «Mora ___ og sprang bort til meg» (å rope, fortid)',
 alt:['ropa','roppa','robba','ropte'],fasit:'ropa',
 regel:'«Å rope» har lang vokal (lang o) → éin konsonant i fortid: ropa.',
 eks:'Ho ropa, han ropa'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte? «Kampen er over. Ballen er ___ ferdig» (å rulle, partisipp)',
 alt:['rulla','rula','rulle','rullet'],fasit:'rulla',
 regel:'«Å rulle» har kort u → dobbel l i infinitiv og partisipp: rulle/rulla.',
 eks:'Ho rulla ballen. Ballen er rulla.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Vel rett form: «Ho ___ leksa godt» (å lese, fortid nynorsk)',
 alt:['las','leste','lasse','las leksa'],fasit:'las',
 regel:'«Å lese» er sterkt verb: las (fortid), lesen (partisipp). Lang e → éin s.',
 eks:'Ho las boka. Ho las godt.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva par er BEGGE riktig skrive?',
 alt:['katte – kater','katte – katte','katt – katter','kater – katter'],fasit:'katt – katter',
 regel:'«Katt» (kort a → dobbel t), «katter» (fleirtalsform, dobbel t bevart).',
 eks:'ein katt, fleire katter'},




/* ── DOBBEL KONSONANT – ekstra (8 nye) ── */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter orda: kva er RIKTIG skrive, og kva er FEIL?',
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
 regel:'Dobbel konsonant etter kort vokal: hop-pe, sit-te, kaf-fe. Lang vokal → éin konsonant: løpe (lang ø).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Kva av desse orda er RIKTIG skrivne?',
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
 regel:'Ikkje alle ord med kort vokal får dobbel konsonant. "fisk" har lang konsonant, ikkje dobbel.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskeleg',
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
 regel:'Dobbel konsonant i presens etter kort vokal: hoppAR. Men «sit» (éin t i presens) og «legg» (éin g i presens imperativ/presens).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Adjektiv – riktig eller feil skrivemåte?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'stille', fasit:0},
   {tekst:'stile', fasit:1},
   {tekst:'grønn', fasit:0},
   {tekst:'grøn', fasit:1},
   {tekst:'liten', fasit:0},
   {tekst:'litten', fasit:1},
   {tekst:'bitter', fasit:0},
   {tekst:'biter', fasit:1},
 ],
 regel:'Dobbel konsonant i adjektiv etter kort vokal: stil-le, grønn, bit-ter.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Kva setning er KORREKT skrive?',
 alt:['Ho hoppar over bekken kvar morgon.','Ho hoper over bekken kvar morgon.','Ho hoppar over becken kvar morgon.','Ho hoppes over bekken kvar morgon.'],
 fasit:'Ho hoppar over bekken kvar morgon.',
 regel:'«Hoppar» har dobbel p fordi rota «hopp» har kort vokal.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'medium',
 q:'Set inn rett ord: «Katten ligg og ___» (å sove, presens)',
 alt:['sover','sovver','sof','sovnar'],
 fasit:'sover',
 regel:'«Sove» har lang vokal – ikkje dobbel konsonant. Presens: sover.'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva er rett skrivemåte av fortidsforma av «å sprette»?',
 alt:['spratt','sprat','sprett','sprette'],
 fasit:'spratt',
 regel:'«Sprette» er eit sterkt verb. Fortid: spratt (kort a, dobbel t).'},

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva setning er FEIL skrive?',
 alt:['Glaset er fullt.','Huset er tomt.','Barnet spring fort.','Mannen er frisk.'],
 fasit:'Barnet spring fort.',
 regel:'«Spring» er rett i presens (ikkje dobbel). Men sjekk kontekst: «spring» vs «sprang» (fortid).'},


/* ── KJ/SKJ-LYDEN (12 oppgåver) ── */
{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Korleis skriv ein lyden i «___ønn» (= det fine fargehaldet i hud/natur)?',
 alt:['skjønn','kjønn','shjønn','schønn'],fasit:'skjønn',
 regel:'«Skjønn» (= vakker) skriv ein med «skj». «Kjønn» (= grammatisk kjønn) er eit anna ord!',
 eks:'ein skjønn solnedgang'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte: «___orte» (= det å forkorte)?',
 alt:['kjorte','skjorte','chrorte','shjorte'],fasit:'skjorte',
 regel:'«Skjorte» skriv ein med «skj» – klesplagg.',
 eks:'ei kvit skjorte'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av det grammatiske omgrepet (hankjønn/hokjønn/inkjekjønn)?',
 alt:['kjønn','skjønn','sjønn','kjøn'],fasit:'kjønn',
 regel:'«Kjønn» (grammatisk kjønn) skriv ein med «kj». Ikkje forveksle med «skjønn» (= vakker).',
 eks:'eit substantiv har eit grammatisk kjønn: hankjønn, hokjønn eller inkjekjønn'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte av det norske ordet for «forest»?',
 alt:['skog','skogg','skjog','kjog'],fasit:'skog',
 regel:'«Skog» skriv ein med enkel sk, ikkje skj.',
 eks:'ein tett skog'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'lett',
 q:'Fyll inn: «Ho tok på seg ei ny ___» (klesplagg med knapper)',
 fasit:'skjorte',fasit_v:['skjorte'],
 hint:'Byrjar med «skj-».',
 regel:'«Skjorte» byrjar med «skj».',
 eks:'ei kvit skjorte, ei blå skjorte'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av «det å erkjenne noko» (= innrømme)?',
 alt:['erkjenne','erkjennje','ersjenne','erkjennne'],fasit:'erkjenne',
 regel:'«Erkjenne» (= innrømme/vedgå) skriv ein med «kj».',
 eks:'Ho ville ikkje erkjenne at ho tok feil.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av «___ede» (= å forstå/innsee)?',
 alt:['kjende','skjende','shjende','chende'],fasit:'kjende',
 regel:'«Kjende» (preteritum av å kjenne) skriv ein med «kj».',
 eks:'Ho kjende igjen lukta.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Det var ein ___ dag» (= vakker dag)',
 fasit:'skjønn',fasit_v:['skjønn'],
 hint:'«Vakker» heiter «___ønn» på nynorsk.',
 regel:'«Skjønn» = vakker. Ikkje forveksle med «kjønn» (grammatisk kjønn).',
 eks:'ein skjønn solnedgang, eit skjønt syn'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'medium',
 q:'Kva er rett skrivemåte av verbet som tyder «å forstå»?',
 alt:['skjønne','kjønne','shjønne','schjønne'],fasit:'skjønne',
 regel:'«Skjønne» (= forstå) skriv ein med «skj». Kjem av «skjønn».',
 eks:'Eg skjønner ikkje oppgåva.'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'vanskeleg',
 q:'Kva alternativ inneheld ein SKRIVEFEIL?',
 alt:['skjørte (for skjorte)','skjønne','kjøpe','kjøring'],fasit:'skjørte (for skjorte)',
 regel:'«Skjorte» skriv ein med «-orte», ikkje «-ørte». Dei andre alternativa er alle rette.',
 eks:'ei skjorte (rett), ikkje «skjørte».'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'mc',vanske:'vanskeleg',
 q:'Forklar skilnaden på «kj-» og «skj-»:',
 alt:['Begge gir same lyd, men vert brukte i ulike ord','«Kj» er nynorsk; «skj» er bokmål','«Skj» er alltid foran o/ø; «kj» er alltid foran a/e','«Skj» er feil – ein brukar alltid «kj»'],
 fasit:'Begge gir same lyd, men vert brukte i ulike ord',
 regel:'«Kj» og «skj» gir same lyd (palatalt kj). Kva som brukast avheng av ordet, ikkje av vokalen etter.',
 eks:'kjøp, kjøre (kj) – skjorte, skjønn (skj)'},

{kat:'kj_skj',kat_label:'Kj / skj-lyden',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn: «Ho ___ ikkje kvifor han var sint» (å forstå, preteritum)',
 fasit:'skjønte',fasit_v:['skjønte','skjønnte'],
 hint:'Preteritum av «å skjønne» – ender på -te.',
 regel:'«Å skjønne» → preteritum «skjønte».',
 eks:'Ho skjønte ingenting. Eg skjønte det med ein gong.'},

/* ── TEIKNSETTING – KOMMAREGLAR (12) ── */
{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kvar set du komma? «Eg likar fotball tennis og svømming.»',
 alt:['Eg likar fotball, tennis og svømming.','Eg likar, fotball, tennis, og, svømming.','Eg likar fotball, tennis, og svømming.','Ingen stad – setninga treng ikkje komma.'],
 fasit:'Eg likar fotball, tennis og svømming.',
 regel:'Komma mellom oppremsing, men IKKJE framfor siste «og» i lista (norsk regel).',
 eks:'Eg kjøpte mjølk, brød og ost.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kvar set du komma? «Ho gjekk heim og han vart att.»',
 alt:['Ho gjekk heim, og han vart att.','Ho gjekk heim og, han vart att.','Ho gjekk, heim og han vart att.','Ingen komma – setninga er rett.'],
 fasit:'Ho gjekk heim, og han vart att.',
 regel:'Komma framfor sideordnande bindeord (og, men, eller) som knyter to fullstendige setningar.',
 eks:'Ho gjekk heim, og han vart att.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Treng denne setninga komma? «Ho las og skreiv heile dagen.»',
 alt:['Nei – «og» knyter to verb til same subjekt, ikkje to setningar','Ja, framfor «og»','Ja, etter «las»','Ja, etter «skreiv»'],
 fasit:'Nei – «og» knyter to verb til same subjekt, ikkje to setningar',
 regel:'Komma kjem IKKJE framfor «og» når det berre knyter saman to verb med same subjekt.',
 eks:'Ho las og skreiv. (ikkje komma) vs. Ho las, og han skreiv. (komma)'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kvar set du komma? «Sidan ho var sjuk gjekk ho heim.»',
 alt:['Sidan ho var sjuk, gjekk ho heim.','Sidan, ho var sjuk gjekk ho heim.','Sidan ho var, sjuk gjekk ho heim.','Ingen komma.'],
 fasit:'Sidan ho var sjuk, gjekk ho heim.',
 regel:'Komma etter framskutt leddsetning: [leddsetning], [hovudsetning].',
 eks:'Fordi det regnar, tek vi bussen.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kva er rett? «Boka som ho las var interessant.»',
 alt:['Boka, som ho las, var interessant.','Boka som, ho las, var interessant.','Boka som ho las, var interessant.','Boka, som ho las var interessant.'],
 fasit:'Boka, som ho las, var interessant.',
 regel:'Komma rundt innskutte relativsetningar som gir tilleggsinformasjon (ikkje identifiserande).',
 eks:'Læraren, som er frå Bergen, er veldig flink.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Set inn komma rett: «Ho sa at ho ikkje ville kome.»',
 alt:['Ho sa at ho ikkje ville kome. (ingen komma nødvendig)','Ho sa, at ho ikkje ville kome.','Ho sa at, ho ikkje ville kome.','Ho sa at ho ikkje, ville kome.'],
 fasit:'Ho sa at ho ikkje ville kome. (ingen komma nødvendig)',
 regel:'IKKJE komma framfor «at» i underordna setningar på norsk.',
 eks:'Han meiner at det er viktig. (ikkje: meiner, at)'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kva er rett tegnsetting? «Eg vert trøytt av å arbeide for mykje»',
 alt:['Eg vert trøytt av å arbeide for mykje.','Eg vert trøytt, av å arbeide for mykje.','Eg vert, trøytt av å arbeide for mykje.','Eg vert trøytt av, å arbeide for mykje.'],
 fasit:'Eg vert trøytt av å arbeide for mykje.',
 regel:'Ingen komma mellom preposisjonsfrase og infinitivskonstruksjon når dei ikkje er innskotne.',
 eks:'Eg er lei av å vente.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kva er rett? «Han spring fort men ho spring fortare.»',
 alt:['Han spring fort, men ho spring fortare.','Han spring, fort men ho spring fortare.','Han spring fort men, ho spring fortare.','Han spring fort men ho spring fortare. (ingen komma)'],
 fasit:'Han spring fort, men ho spring fortare.',
 regel:'Komma framfor «men» når det knyter to hovudsetningar.',
 eks:'Det er kaldt, men vi går likevel.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kva teikn passar best? «Eg er ikkje trøytt ___ eg er svolten.»',
 alt:['semikolon (;)','kolon (:)','bindestrek (-)','komma (,)'],fasit:'semikolon (;)',
 regel:'Semikolon brukas mellom to nært knytte hovudsetningar utan bindeord.',
 eks:'Eg er ikkje trøytt; eg er svolten.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kva er skilnaden på kolon og semikolon?',
 alt:['Kolon introduserer ei forklaring/liste; semikolon knyter to setningar','Dei tyder det same','Semikolon er sterkare enn kolon','Kolon er bokmål; semikolon er nynorsk'],
 fasit:'Kolon introduserer ei forklaring/liste; semikolon knyter to setningar',
 regel:'Kolon (:) = «nemleg» / «dette er:». Semikolon (;) = knyter to sjølvstendige setningar utan bindeord.',
 eks:'Han hadde éin ting på lista: melk. / Han er trøytt; ho er pigg.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kva er rett bruk av tankestrek?',
 alt:['Han kom heim – seint, som vanleg.','Han – kom – heim – seint.','Han kom, heim – seint, som vanleg.','Tankestrek brukast aldri i nynorsk.'],
 fasit:'Han kom heim – seint, som vanleg.',
 regel:'Tankestrek brukast for å legge til eit kommentarledd med ekstra trykk eller dramatisk pause.',
 eks:'Det var éin ting ho gløymde – nøklane.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kvar kjem hermeteikna? «Ho sa eg er ikkje redd.»',
 alt:['Ho sa: «Eg er ikkje redd.»','Ho sa «eg er ikkje redd».','Ho sa: eg er ikkje redd.','«Ho sa» eg er ikkje redd.'],
 fasit:'Ho sa: «Eg er ikkje redd.»',
 regel:'Direkte tale: kolon etter innleiingsverbet, hermeteikn rundt det som vert sagt, stor bokstav inni.',
 eks:'Ho svarte: «Det er greitt.»'},
{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kva er rett teiknsetting? «Eg likar ikkje regn ___ kaldt vêr»',
 alt:['eller','og','men','–'],fasit:'eller',
 regel:'«Eller» bind alternativ saman. Mellom to ledd utan subjekt trengst ikkje komma.',
 eks:'Eg likar ikkje regn eller kaldt vêr.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'lett',
 q:'Kor set du komma? «Sjølv om ho var trøytt gjekk ho på skulen.»',
 alt:['Sjølv om ho var trøytt, gjekk ho på skulen.','Sjølv, om ho var trøytt gjekk ho på skulen.','Sjølv om ho var trøytt gjekk, ho på skulen.','Ingen komma nødvendig.'],fasit:'Sjølv om ho var trøytt, gjekk ho på skulen.',
 regel:'Etter innleiande leddsetning set ein komma.',
 eks:'Sjølv om ho var trøytt, gjekk ho på skulen.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kva er riktig bruk av tankestrek (–)?',
 alt:['Ho opna døra – og fraus til is.','Ho opna – døra og fraus til is.','Ho opna døra og – fraus til is.','Ho opna – døra – og fraus til is.'],fasit:'Ho opna døra – og fraus til is.',
 regel:'Tankestrek brukast for å markere ei dramatisk pause eller eit uventa skifte.',
 eks:'Ho opna døra – og fraus til is.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'medium',
 q:'Kva er feil bruk av kolon?',
 alt:['Ho hadde éin draum: å bli lege.','Ho hadde: ein draum om å bli lege.','Ho kjøpte tre ting: brød, mjølk og smør.','Det er berre éin regel: vær ærleg.'],fasit:'Ho hadde: ein draum om å bli lege.',
 regel:'Kolon brukast etter eit fullstendig ledd, ikkje midt i ein setningsdel.',
 eks:'Ho hadde éin draum: å bli lege.'},

{kat:'teiknsetting',kat_label:'Teiknsetting',type:'mc',vanske:'vanskeleg',
 q:'Kvar er komma nødvendig? «Læraren som underviser i norsk heiter Kari.»',
 alt:['Læraren, som underviser i norsk, heiter Kari. – fordi bisetningen er ikkje-restriktiv','Ingen komma – bisetningen er ein integrert del av meininga','Læraren som underviser i norsk, heiter Kari. – éitt komma etter leddsetning','Komma berre etter «norsk» – etter adverbial'],fasit:'Læraren, som underviser i norsk, heiter Kari. – fordi bisetningen er ikkje-restriktiv',
 regel:'Ikkje-restriktiv relativsetning (tilleggsinfo) omsluttast av komma. Restriktiv (identifiserande) treng ikkje komma.',
 eks:'Læraren, som alltid er snill, heiter Kari. vs. Læraren som er streng er min favoritt.'},



/* ── ORDKLASSAR (20 oppgåver) ── */
{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva ordklasse høyrer «rask» til i setninga «Han er ein rask løpar»?',
 alt:['Adjektiv','Substantiv','Verb','Adverb'],fasit:'Adjektiv',
 regel:'Adjektiv skildrar eit substantiv. Her skildrar «rask» substantivet «løpar».',
 eks:'ein rask løpar, ei stor jente, eit raudt hus'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva ordklasse er «spring» i «Han spring fort»?',
 alt:['Verb','Substantiv','Adjektiv','Adverb'],fasit:'Verb',
 regel:'Verb seier noko om kva nokon gjer, tenkjer eller er. «Spring» er handlingsverbet her.',
 eks:'spring, hoppar, les, skriv, søv'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Kva ordklasse er «fort» i «Han spring fort»?',
 alt:['Adverb','Adjektiv','Verb','Preposisjon'],fasit:'Adverb',
 regel:'Adverb seier noko om korleis, når, kor mykje eller kor. Her seier «fort» korleis han spring.',
 eks:'fort, sakte, alltid, aldri, svært, ganske'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Kva ordklasse er «skulen» i «Eg går på skulen»?',
 alt:['Substantiv','Verb','Adjektiv','Pronomen'],fasit:'Substantiv',
 regel:'Substantiv er namn på personar, ting, stader og omgrep. «Skulen» er eit substantiv.',
 eks:'skulen, huset, læraren, kjærleik, fred'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskeleg',
 q:'Kva ordklasse er «etter» i «Ho kom etter skulen»?',
 alt:['Preposisjon','Adverb','Konjunksjon','Adjektiv'],fasit:'Preposisjon',
 regel:'Preposisjonar viser tilhøve (tid, stad, retting) mellom ledd i setninga. «Etter» viser her tidsforhold.',
 eks:'etter, før, på, i, med, til, frå, over'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva ordklasse er «vakker» i «Ho er ei vakker jente»?',
 alt:['Adjektiv','Substantiv','Verb','Adverb'],fasit:'Adjektiv',
 regel:'Adjektiv skildrar eit substantiv og svarar på spørsmålet «korleis er det?». «Vakker» skildrar her substantivet «jente».',
 eks:'ei vakker jente · ein høg gut · eit roleg hus'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'lett',
 q:'Kva ordklasse er «ho» i «Ho les ei bok»?',
 alt:['Pronomen','Substantiv','Adjektiv','Verb'],fasit:'Pronomen',
 regel:'Pronomen erstattar eller peiker på eit substantiv. «Ho» viser til ei bestemt person og erstattar eit eigennamn.',
 eks:'ho, han, dei, eg, du, vi, det, sin, seg'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Kva ordklasse er «og» i «Eg ete og drikk»?',
 alt:['Konjunksjon','Preposisjon','Adverb','Pronomen'],fasit:'Konjunksjon',
 regel:'Konjunksjonar bind saman setningar eller setningsledd av same type. «Og» bind her to verb saman.',
 eks:'og, men, for, eller, samt, men · binder ledd av same grammatisk rang'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'medium',
 q:'Kva ordklasse er «aldri» i «Han kjem aldri»?',
 alt:['Adverb','Adjektiv','Konjunksjon','Preposisjon'],fasit:'Adverb',
 regel:'Adverb seier noko om tid, stad, måte eller grad. «Aldri» er eit tidsadverb som nektar handlinga.',
 eks:'aldri, alltid, ofte, sjeldnare, svært, nesten, nett no'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskeleg',
 q:'Kva ordklasse er «fordi» i «Ho gjekk heim fordi ho var trøytt»?',
 alt:['Subjunksjon','Konjunksjon','Adverb','Preposisjon'],fasit:'Subjunksjon',
 regel:'Subjunksjonar innleier leddsetningar og bind dei til hovudsetningen. «Fordi» innleier ei årsaks-leddsetning. Til skilnad frå konjunksjonar bind subjunksjonar aldri to jamstilte setningar.',
 eks:'fordi, at, når, om, sjølv om, medan, sidan, dersom'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'mc',vanske:'vanskeleg',
 q:'Kva ordklasse er «eigen» i «Ho har si eiga meining»?',
 alt:['Adjektiv','Pronomen','Adverb','Substantiv'],fasit:'Adjektiv',
 regel:'«Eigen/si eiga» er eit possessivt adjektiv. Det bøyast etter substantivet det skildrar (eige/eigen/eiga/eigne) og viser tilhøyrsle.',
 eks:'sin eigen draum, si eiga bok, sitt eige val, sine eigne ord'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'cloze',vanske:'lett',
 q:'«raskt» i «Han sprang raskt» er eit ___.',
 hint:'Ordet seier noko om korleis han sprang. Det endrar eit verb.',
 fasit:'adverb',fasit_v:['adverb','adverb (måtesadverb)'],
 regel:'Adverb modifiserer verb, adjektiv eller andre adverb. Her modifiserer «raskt» verbet «sprang» og seier noko om korleis.',
 eks:'Han sprang raskt · Ho song vakkert · Dei jobba hardt'},



{kat:'ordklassar',kat_label:'Ordklassar',type:'cloze',vanske:'medium',
 q:'«på» i «Boka ligg på bordet» er ei ___.',
 hint:'Ordet viser ein romleg relasjon, der noko er plassert i høve til noko anna.',
 fasit:'preposisjon',fasit_v:['preposisjon'],
 regel:'Preposisjonar uttrykker tilhøve (stad, tid, retting) mellom ledd i setninga. Dei kjem alltid framfor eit substantiv eller pronomen.',
 eks:'på bordet · i huset · til skulen · frå byen · over brua'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'lett',
 q:'Ordklasse-sorteraren: Dra kvart ord til rett boks – Substantiv eller Verb.',
 kolonner:['Substantiv','Verb'],
 ord:[
  {tekst:'bok',fasit:0},{tekst:'spring',fasit:1},{tekst:'hund',fasit:0},
  {tekst:'søv',fasit:1},{tekst:'skulen',fasit:0},{tekst:'skriv',fasit:1},
  {tekst:'glede',fasit:0},{tekst:'hoppar',fasit:1}
 ],
 regel:'Substantiv er namn på ting, personar, stader og omgrep. Verb seier noko om kva nokon gjer, tenkjer eller er.',
 eks:'Substantiv: bok, hund, skulen, glede · Verb: spring, søv, skriv, hoppar'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'medium',
 q:'Ordklasse-sorteraren: Dra kvart ord til rett boks – Adjektiv eller Adverb.',
 kolonner:['Adjektiv','Adverb'],
 ord:[
  {tekst:'rask',fasit:0},{tekst:'raskt',fasit:1},{tekst:'vakker',fasit:0},
  {tekst:'alltid',fasit:1},{tekst:'stille (stille hus)',fasit:0},{tekst:'stille (sit stille)',fasit:1},
  {tekst:'glad',fasit:0},{tekst:'svært',fasit:1}
 ],
 regel:'Adjektiv skildrar substantiv og bøyast etter dei. Adverb modifiserer verb, adjektiv eller andre adverb og bøyast ikkje.',
 eks:'rask gut (adjektiv) · spring raskt (adverb) · glad (adj) · alltid (adv)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Ordklasse-sorteraren: Dra kvart ord til rett boks – Pronomen eller Konjunksjon.',
 kolonner:['Pronomen','Konjunksjon'],
 ord:[
  {tekst:'ho',fasit:0},{tekst:'og',fasit:1},{tekst:'dei',fasit:0},
  {tekst:'men',fasit:1},{tekst:'seg',fasit:0},{tekst:'eller',fasit:1},
  {tekst:'sin',fasit:0},{tekst:'for (=for at)',fasit:1}
 ],
 regel:'Pronomen erstattar eller peiker på substantiv. Konjunksjonar bind saman setningar eller setningsledd av same type.',
 eks:'Pronomen: ho, dei, seg, sin · Konjunksjon: og, men, eller, for'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'finn_feil',vanske:'medium',
 q:'Ordklasse-spottaren: Klikk på kvart ord som er eit VERB i setninga nedanfor.',
 tekst:'Hunden spring fort og bjeffer høgt når naboen kjem.',
 fasit_feil:['spring','bjeffer','kjem'],
 regel:'Verb seier noko om kva nokon gjer, tenkjer eller er. I denne setninga: «spring», «bjeffer» og «kjem» er handlings- og tilstandsverb.',
 eks:'Finittverb bøyast etter tid og person: spring (presens), sprang (preteritum)'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'finn_feil',vanske:'medium',
 q:'Ordklasse-spottaren: Klikk på kvart ord som er eit SUBSTANTIV i setninga nedanfor.',
 tekst:'Læraren skreiv ei lang oppgåve på tavla kvar dag.',
 fasit_feil:['læraren','oppgåve','tavla'],
 regel:'Substantiv er namn på personar, ting, stader og omgrep. Her: «læraren» (person), «oppgåve» (ting/abstrakt), «tavla» (ting/stad).',
 eks:'«dag» er òg substantiv her – «kvar dag» (adverbial). Merk: tidsuttrykk kan vere substantiv i adverbiell bruk.'},

{kat:'ordklassar',kat_label:'Ordklassar',type:'drag_ord',vanske:'middels',
 q:'Kjernerekkjefølge: Trykk orda inn i rett rekkjefølge – adjektivet MÅ kome rett FØR substantivet det skildrar.',
 ord:['blå','Ein','himmel','klår','og'],
 fasit:'Ein blå og klår himmel',
 regel:'Adjektiv kjem normalt direkte FØR substantivet dei skildrar. Fleire adjektiv i rad bindast med «og». Rekkjefølge: [artikkel] + [adj] + [og] + [adj] + [subst].',
 eks:'ein stor og gamal mann · eit blått og stille hav'},

/* ── KJELDEKRITIKK (10 nye oppgåver i kjeldebruk) ── */
{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Kva er den viktigaste grunnen til å sjekke kjelda før du brukar ho?',
 alt:['For å vite om informasjonen er påliteleg og korrekt','For å finne lengste artikkelen','For å unngå å lese for mykje','For å finne flest moglege kjelder'],
 fasit:'For å vite om informasjonen er påliteleg og korrekt',
 regel:'Kjeldekritikk handlar om å vurdere truverd, aktualitet og relevans før du brukar ei kjelde.',
 eks:'Sjekk: Kven skreiv det? Når? Kva er formålet med sida?'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Kva er ei primærkjelde?',
 alt:['Ein original kjelde, t.d. ein rapport eller ei lov','Ein artikkel som oppsummerer andre kjelder','Ein Wikipedia-artikkel','Ei lærebok'],
 fasit:'Ein original kjelde, t.d. ein rapport eller ei lov',
 regel:'Primærkjelde = originalkjelda. Sekundærkjelde = ein annan sin omtale av primærkjelda.',
 eks:'NOU-rapport = primærkjelde. Avisartikkel om rapporten = sekundærkjelde.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'lett',
 q:'Kvifor er Wikipedia ikkje alltid ei påliteleg kjelde?',
 alt:['Alle kan redigere artiklane, så innhaldet kan vere feil','Wikipedia har aldri rett','Wikipedia er berre på engelsk','Wikipedia kostar pengar'],
 fasit:'Alle kan redigere artiklane, så innhaldet kan vere feil',
 regel:'Wikipedia er eit godt startpunkt, men ikkje ein citerbar kjelde. Bruk heller originalkilder Wikipedia lenkar til.',
 eks:'Finn kjelda Wikipedia oppgir – det er den du bør sitere.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Du finn to artiklar om klimaendringar. Éin er frå Miljødirektoratet (2024), éin er frå ein anonym blogg (2019). Kva vel du?',
 alt:['Miljødirektoratet – offisiell, fagleg og nyleg','Bloggen – han er enklare å lese','Begge er like gode','Ingen av dei – du treng berre Wikipedia'],
 fasit:'Miljødirektoratet – offisiell, fagleg og nyleg',
 regel:'Prioriter: offisielle organ, forskarar, fagblad og nyhendebyråer framfor anonyme bloggar.',
 eks:'Miljødirektoratet.no > anonym blogg'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva spørsmål bør du stille om KVEN som har skrive ei kjelde?',
 alt:['Er forfattaren ekspert? Har forfattaren interesser i saka?','Kor lang er artikkelen?','Kor mange ord er i artikkelen?','Er artikkelen på nynorsk?'],
 fasit:'Er forfattaren ekspert? Har forfattaren interesser i saka?',
 regel:'Vurder: kompetanse (er forfattaren ekspert?) og agenda (kan forfattaren ha grunn til å vri sanninga?).',
 eks:'Ein tobakksforskar betalt av tobakksindustrien kan ha ein agenda.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Kva vil det seie at ei kjelde er «aktuell»?',
 alt:['Ho er ny nok til at informasjonen framleis er gyldig','Ho er spennande å lese','Ho har mange bilete','Ho er frå Noreg'],
 fasit:'Ho er ny nok til at informasjonen framleis er gyldig',
 regel:'Aktualitet = er kjelda ny nok? Statistikk frå 2005 om sosiale medium er ikkje aktuell i 2025.',
 eks:'Medisinsk forsking: maks 5–10 år. Historisk kjelde: alder spelar mindre rolle.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Du finn ein artikkel med overskrifta «SJOKK: Skular drep kreativiteten!». Kva bør du tenkje?',
 alt:['Kritisk – clickbait-overskrifter kan indikere upåliteleg kjelde','Dette er sikkert sant sidan det er dramatisk','Dramatiske overskrifter er alltid meir pålitelege','Det spelar inga rolle korleis overskrifta er'],
 fasit:'Kritisk – clickbait-overskrifter kan indikere upåliteleg kjelde',
 regel:'Sensasjonsoverskrifter er eit varselteikn. Sjekk: kven skreiv det, kva er kjelda, er det dekning for påstanden?',
 eks:'«SJOKK», «DU VIL IKKJE TRU», «SKJULT SANNING» = typisk clickbait.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Kva er skilnaden på ei faktabasert kjelde og ei meiningskjelde?',
 alt:['Faktakjelde presenterer dokumenterbare fakta; meiningskjelde presenterer synspunkt','Faktakjelder er alltid lengre','Meiningskjelder er alltid upålitelege','Dei er det same – all kjelde er meiningar'],
 fasit:'Faktakjelde presenterer dokumenterbare fakta; meiningskjelde presenterer synspunkt',
 regel:'Faktakjelder: statistikk, forsking, lovtekstar. Meiningskjelder: leiarartiklar, blogginnlegg, debattinnlegg. Begge kan vere relevante – men du må vite kva type du brukar.',
 eks:'SSB-statistikk = faktakjelde. Kronikk i Aftenposten = meiningskjelde.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Du les at «Forsking viser at sjokolade kurerer forkjøling». Kva bør du sjekke?',
 alt:['Kva forsking? Kvar er studien publisert? Er han fagfellevurdert?','Ingenting – forsking er alltid sant','Kor mykje sjokolade det gjeld','Om sjokolade smaker godt'],
 fasit:'Kva forsking? Kvar er studien publisert? Er han fagfellevurdert?',
 regel:'«Forsking viser» utan referanse er eit varselteikn. Sjekk: kva studie, kvar er han publisert, er han fagfellevurdert?',
 eks:'Fagfellevurderte tidsskrift (peer review) = høg standard.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Kva er det beste teiknet på at ei nettside er truverdig?',
 alt:['Kjend forfattar med fagleg bakgrunn, kjeldetilvisingar og publiseringsdato','Mange bilete og god design','Lang URL','At sida er gratis'],
 fasit:'Kjend forfattar med fagleg bakgrunn, kjeldetilvisingar og publiseringsdato',
 regel:'Truverdig nettside: klar forfatter, fagleg bakgrunn, kjeldar oppgitt, dato, organisasjon bak oppgitt.',
 eks:'Forskning.no: forfattar oppgjeven, fagleg redaksjon, kjeldar lenka.'},

/* ── OPPGÅVETOLKING (20) ── */
{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva er eit «bestillingsord» i ei oppgåveformulering?',
 alt:['Ord som handlar om bestilling av varer','Verba som fortel kva du faktisk skal gjere i oppgåva','Dei lengste orda i teksten','Ord som definerer emnet du skal skrive om'],
 fasit:'Verba som fortel kva du faktisk skal gjere i oppgåva',
 regel:'Bestillingsord er verba som styrer oppgåva – t.d. drøft, grei ut, presenter, samanlikn, reflekter. Dei fortel nøyaktig kva handling du skal utføre.',
 eks:'«Drøft konsekvensane av klimaendringar.» – «drøft» er bestillingsord.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva betyr bestillingsord «drøft» i ei norskoppgåve?',
 alt:['Presenter berre eitt synspunkt','Skriv ein kreativ forteljing om emnet','Vis fram to sider av ei sak og veg dei opp mot kvarandre','Beskriv korleis noko ser ut'],
 fasit:'Vis fram to sider av ei sak og veg dei opp mot kvarandre',
 regel:'«Drøft» = presenter argument for og mot, og trekk ei konklusjon. Unngå å berre liste opp synspunkt – du skal verdivurdere dei.',
 eks:'«Drøft om skulen bør forby mobiltelefonar.» = argument for + mot + konklusjon.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva betyr bestillingsord «grei ut om» i ei oppgåve?',
 alt:['Ta tydeleg stilling for éi side av saka','Forklar og informer grundig om eit emne','Samanlikn to ulike syn','Skriv ein kreativ tekst'],
 fasit:'Forklar og informer grundig om eit emne',
 regel:'«Grei ut om» = forklarande og informerande skriving. Du skal presentere fakta og samanhengar utan nødvendigvis å ta stilling.',
 eks:'«Grei ut om årsaker til utenforskap» = skriv ein forklarande tekst om kvifor utenforskap oppstår.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva er «konteksten» i ei oppgåveformulering?',
 alt:['Sjølve instruksen – det du skal gjere','Kjeldelistekrava i oppgåva','Bakgrunnsinformasjonen om emnet','Tittelforslaget du skal bruke'],
 fasit:'Bakgrunnsinformasjonen om emnet',
 regel:'Ei oppgåve er ofte delt i to: kontekst (bakgrunnsinfo/emne) + instruks (kva du faktisk skal gjere). Berre instruksen er det du svarar på.',
 eks:'«Plast i havet er eit aukande problem. [kontekst] → Drøft moglege løysingar. [instruks]»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva betyr bestillingsord «samanlikn» i ei oppgåve?',
 alt:['Ta tydeleg stilling til kva som er best','Beskriv berre éin av tinga grundig','Peik på likskapar og skilnader mellom to eller fleire ting','Skriv historia til begge tinga'],
 fasit:'Peik på likskapar og skilnader mellom to eller fleire ting',
 regel:'«Samanlikn» = finn og forklar det som er likt og det som er ulikt. Strukturer gjerne: først det eine, så det andre, deretter samanlikninga.',
 eks:'«Samanlikn to poetiske tekstar» = skriv om likskapar og skilnader i tema, form og verkemiddel.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Les oppgåva: «Noreg er eit av verdas rikaste land. Reflekter over korleis dette påverkar identiteten til nordmenn.» Kva er bestillingsord?',
 alt:['Noreg','påverkar','reflekter','rikaste'],
 fasit:'reflekter',
 regel:'Bestillingsord er verbet som seier kva du skal gjere. «Reflekter» = tenk over, vurder kritisk og skriv tankar og innsikter.',
 eks:'«Noreg er eit av verdas rikaste land» er kontekst. «Reflekter» er det som styrer kva du skal skrive.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva seier: «Presenter hovudkaraktaren, og drøft korleis forfattaren brukar kontrastar.» Kor mange delar har oppgåva?',
 alt:['Éi del','To delar','Tre delar','Fire delar'],
 fasit:'To delar',
 regel:'Bruk komma og bindeord som signal: «presenter … OG drøft» = to krav. Telje alltid kor mange bestillingsord oppgåva inneheld.',
 eks:'Del 1: presenter hovudkaraktaren. Del 2: drøft bruken av kontrastar.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva er: «Presenter temaet plast i havet, grei ut om dei viktigaste årsakene, og drøft moglege løysingar. Bruk minst to kjelder.» Kor mange bestillingsord (oppgåveord) inneheld oppgåva?',
 alt:['Éitt (drøft)','To (presenter og drøft)','Tre (presenter, grei ut, drøft)','Fire (presenter, grei ut, drøft, bruk)'],
 fasit:'Tre (presenter, grei ut, drøft)',
 regel:'Bestillingsord er verb som seier kva du skal gjere: presenter, grei ut, drøft. «Bruk minst to kjelder» er eit metodekrav, ikkje eit bestillingsord.',
 eks:'Del 1: presenter temaet. Del 2: grei ut om årsaker. Del 3: drøft løysingar. + krav: minst to kjelder.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva ber om å «drøfte». Kva innleiar er eit BOMSKOT?',
 alt:['«Det er ulike meiningar om dette temaet…»','«I denne teksten vil eg sjå på argument for og mot…»','«Her kjem historia om då eg sjølv opplevde…»','«Mange meiner at X, men andre hevdar at Y…»'],
 fasit:'«Her kjem historia om då eg sjølv opplevde…»',
 regel:'«Drøft» ber om ein resonnerande tekst, ikkje ei personleg forteljing. Innleiinga skal signalisere at du vil vurdere ulike sider av saka.',
 eks:'BOMSKOT: starte som ei novelle. RETT: presentere saka og varsle om at du vil drøfte ho.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva seier «reflekter». Kva betyr det?',
 alt:['Gjenfortel hendingane i rekkjefølgje','Vurder emnet kritisk med eigne tankar og innsikter','Skriv ei kort oppsummering av fakta','Skildra emnet så objektivt som mogleg'],
 fasit:'Vurder emnet kritisk med eigne tankar og innsikter',
 regel:'«Reflekter» = sjå tilbake, tenke over, vurdere med eige perspektiv. Bruk gjerne «eg»-stemma kombinert med fagleg grunngjeving.',
 eks:'«Reflekter over korleis reklame påverkar deg.» = kva ser du, kvifor skjer det, kva meiner du om det.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Oppgåva lyder: «Med utgangspunkt i to av tekstane du har lese dette semesteret, analyser korleis tema kjem til uttrykk gjennom verkemiddel.» Kva er den mest presise tolkinga?',
 alt:['Samanlikn to tekstar generelt','Vel to frie tekstar og skriv om dei','Analyser verkemiddel i to sjølvvalde tekstar frå pensum','Presenter to favoritttekstar dine'],
 fasit:'Analyser verkemiddel i to sjølvvalde tekstar frå pensum',
 regel:'«Med utgangspunkt i» = bruk desse som grunnlag. «Analyser» = undersøk systematisk. «To av tekstane … dette semesteret» = frå pensum. Oppgåva set tre avgrensingar: tal tekstar, kvar frå, kva du skal gjere.',
 eks:'Alle tre avgrensingar må vere med: to tekstar, frå pensum, fokus på verkemiddel og tema.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Tre elevar svarar på «Drøft om teknologi gjer oss meir isolerte». Kven er på BOMSKOT?',
 alt:['Elev A viser argument for og mot, og konkluderer','Elev B skriv om historia til internett og teknologien sin utvikling','Elev C bruker tre kjelder og veg side mot side','Elev D startar med ei personleg oppleving, drøftar og konkluderer'],
 fasit:'Elev B skriv om historia til internett og teknologien sin utvikling',
 regel:'«Drøft» = veg argument for og mot påstanden. Å skrive historia til noko er eit «grei ut»-svar, ikkje drøfting.',
 eks:'Bomskot: svare med feil sjanger. Her er eit «grei ut»-svar brukt der «drøft» var kravet.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Oppgåva seier: «Drøft kva konsekvensar auka sosiale medium-bruk har for identitetsutvikling hjå ungdom.» Kva er den BESTE problemstillinga?',
 alt:[
  'Kva er sosiale medium?',
  'Er sosiale medium bra eller dårleg for ungdom?',
  'Kva positive og negative konsekvensar har auka bruk av sosiale medium for korleis ungdom utviklar identiteten sin?',
  'Kvifor brukar ungdom så mykje sosiale medium?'
 ],
 fasit:'Kva positive og negative konsekvensar har auka bruk av sosiale medium for korleis ungdom utviklar identiteten sin?',
 regel:'Problemstillinga skal (1) spegle bestillingsord (drøft = fleire sider), (2) innehalde emnet (identitetsutvikling), og (3) vere presis nok til å avgrense teksten.',
 eks:'«Kva er sosiale medium?» er for breitt. «Bra eller dårleg?» er for enkel. Den gode problemstillinga inviterer til å drøfte begge sider av konsekvensane.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Oppgåva seier: «Analyser ein av kjeldene du har brukt.» Kva avgrensing overser elevar oftast?',
 alt:['At dei skal bruke fagomgrep','At teksten skal vere lang nok','At dei skal velje berre éin kjelde','At dei skal skrive på nynorsk'],
 fasit:'At dei skal velje berre éin kjelde',
 regel:'«Ein av kjeldene» er ei eksplisitt avgrensing. Mange skriv om alle kjeldene fordi dei les for fort. Marker alltid talord i oppgåva som ein del av sjekkbokslista di.',
 eks:'«Ein av» = berre éi kjelde. «Minst to» = minimum to. Talord i oppgåva avgrensar omfanget.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'lett',
 q:'Oppgåva er: «Drøft om skulen bør innføre mobilforbod.» Sorter kvart kort: passar formuleringane til oppgåva, eller passar dei IKKJE?',
 kolonner:['Passar til oppgåva','Passar IKKJE til oppgåva'],
 ord:[
  {tekst:'Argument for mobilforbod',fasit:0},
  {tekst:'Argument mot mobilforbod',fasit:0},
  {tekst:'Konklusjon/eiga vurdering',fasit:0},
  {tekst:'Personleg forteljing om mobiltjuveri',fasit:1},
  {tekst:'Historia til mobiltelefonen (1973–i dag)',fasit:1},
  {tekst:'Korleis ein lagar ein mobiltelefon',fasit:1}
 ],
 regel:'«Drøft» = presenter argument for og mot + konklusjon. Personlege forteljingar og historiske utgreidingar høyrer ikkje heime utan tydeleg kopling til sjølve drøftingsspørsmålet.',
 eks:'HØYRER HEIME: «Forsking viser at mobilbruk i undervisninga reduserer konsentrasjonen» · HØYRER IKKJE HEIME: «I 1973 skapte Martin Cooper den første mobilen»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'medium',
 q:'Oppgåva er: «Analyser korleis forfattaren brukar naturskildringar i novella.» Sorter kva som høyrer heime i svaret ditt.',
 kolonner:['Høyrer heime i svaret','Høyrer IKKJE heime i svaret'],
 ord:[
  {tekst:'Kva funksjon har naturskildringa i teksten?',fasit:0},
  {tekst:'Korleis skapar naturskildringa stemning?',fasit:0},
  {tekst:'Kva litterære verkemiddel brukar forfattaren?',fasit:0},
  {tekst:'Handlingsreferat: kva skjer i novella?',fasit:1},
  {tekst:'Eiga meining om naturskildringane er fine',fasit:1},
  {tekst:'Forfattarens biografi og liv',fasit:1}
 ],
 regel:'«Analyser» = undersøk systematisk korleis noko er bygd opp og kva funksjon det har. Handlingsreferat og eigne meiningar utan fagleg grunngjeving er ikkje analyse.',
 eks:'Analyse = verkemiddel + funksjon. IKKJE = «eg synest dette er fint» eller «i novella skjer det at...»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Oppgåva er: «Samanlikn to tekstar frå pensum med omsyn til tema og forteljarperspektiv.» Sorter kvart framlegg.',
 kolonner:['Svarar på oppgåva','Svarar IKKJE på oppgåva'],
 ord:[
  {tekst:'Likskapar og skilnader i tema mellom tekstane',fasit:0},
  {tekst:'Kven er forteljaren i kvar tekst og kva effekt gir det?',fasit:0},
  {tekst:'Samanliknande analyse med konklusjon',fasit:0},
  {tekst:'Grundig analyse av berre éin tekst',fasit:1},
  {tekst:'Generell utgreiing om forteljarteori',fasit:1},
  {tekst:'Personleg lesarrespons utan tekstbelegg',fasit:1}
 ],
 regel:'«Samanlikn» = likskapar + skilnader, begge tekstane, same fokus (tema + forteljarper­spektiv). Å analysere berre éin tekst svarer ikkje på oppgåva.',
 eks:'Samanlikning krev: tekst A og tekst B analysert langs same dimensjonar → konklusjon om likskapar/skilnader'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'lett',
 q:'Kva tyder bestillingsord «presenter» i ei oppgåve?',
 alt:['Ta stilling for og mot emnet','Gje ei kortfatta, informativ framstilling av emnet','Skriv ein kreativ tekst om emnet','Diskuter emnet med ein medelev'],
 fasit:'Gje ei kortfatta, informativ framstilling av emnet',
 regel:'«Presenter» = gi eit oversyn, introduser emnet på ein klar og ordna måte. Du treng ikkje ta stilling. Det er ofte første del av ei lengre oppgåve.',
 eks:'«Presenter hovudkaraktaren» = namn, eigenskapar, rolle i handlinga. Ikkje analyse, ikkje meiningar.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'cloze',vanske:'medium',
 q:'Oppgåva seier «analyser». Det tyder at du skal undersøke ___ teksten er bygd opp og kva effekt dei ulike grepa har.',
 hint:'Analyse er ikkje å meine noko om teksten – det er å undersøke ein bestemt ting: strukturen.',
 fasit:'korleis',fasit_v:['korleis','korleis/kvifor'],
 regel:'Analyse = systematisk undersøking av korleis noko er laga og kva det gjer med lesaren. Spørsmålet «korleis» er nøkkelen.',
 eks:'«Korleis brukar forfattaren metaforar?» · «Korleis skapar forteljarstemma nærleik?»'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Oppgåva lyder: «Grei ut om årsaker til einsemd blant unge, og drøft kva samfunnet kan gjere for å motverke dette.» Kva er den BESTE to-stegs-planen?',
 alt:[
  'Del 1: drøft tiltak mot einsemd. Del 2: grei ut om årsaker til einsemd.',
  'Skriv om einsemd frå eit personleg perspektiv, deretter presenter løysingar.',
  'Del 1: grei ut om årsaker til einsemd (forklarande del). Del 2: drøft tiltak mot einsemd (argumenterande del).',
  'Skriv generelt om einsemd og nemn årsaker og tiltak undervegs.'
 ],
 fasit:'Del 1: grei ut om årsaker til einsemd (forklarande del). Del 2: drøft tiltak mot einsemd (argumenterande del).',
 regel:'Ei oppgåve med fleire bestillingsord krev ein plan som handsamar kvart krav i rett rekkjefølge. «Grei ut» kjem alltid FØR «drøft» – du må forstå problemet før du kan diskutere løysingar.',
 eks:'Bomskot: bytte om rekkjefølga. «Grei ut» kjem alltid FØRST – du kan ikkje drøfte løysingar på eit problem du ikkje har forklart.'},

/* ── TEKSTSTRUKTUR: Sorter burgeren, Linjeskift-kuttaren, Overskrifts-ruletten ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'lett',
 q:'Tekstburgeren: Dra kvart avsnitt til rett del av teksten.',
 kolonner:['Innleiing','Hovuddel','Avslutning'],
 ord:[
  {tekst:'Plast i havet er eit aukande problem som påverkar dyr og natur over heile verda.',fasit:0},
  {tekst:'Éi løysing er å innføre strengare regulering av eingongsplast i alle EU-land.',fasit:1},
  {tekst:'I tillegg kan produsentar påleggjast å bruke meir resirkulert materiale.',fasit:1},
  {tekst:'Kjeldesortering og betre infrastruktur i fattigare land kan òg redusere problemet.',fasit:1},
  {tekst:'Alt i alt viser dette at løysinga på plastforureining krev samarbeid på tvers av landegrenser.',fasit:2}
 ],
 regel:'Innleiinga presenterer temaet, hovuddelen utdjupar argumenta, og avsluttinga summerer eller konkluderer.',
 eks:'Innleiing → presentasjon · Hovuddel → argument/analyse · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'drag_kolonne',vanske:'medium',
 q:'Tekstburgeren: Dra kvart avsnitt frå ein fagartikkel om sosiale medium til rett del av teksten.',
 kolonner:['Innleiing','Hovuddel','Avslutning'],
 ord:[
  {tekst:'Kva konsekvensar har den eksploderande veksten i sosiale medium for ungdommen si psykiske helse?',fasit:0},
  {tekst:'Sosiale medium brukar algoritmane sine til å vise oss innhald vi allereie er einige i.',fasit:1},
  {tekst:'Studiar frå fleire land viser at mykje tid på sosiale medium heng saman med auka angst.',fasit:1},
  {tekst:'Samla sett er det tydeleg at bruken av sosiale medium krev medvit, grenser og digital folkeskikk.',fasit:2}
 ],
 regel:'Innleiinga stiller gjerne eit spørsmål eller presenterer problemet. Hovuddelen analyserer med fakta og argument. Avsluttinga konkluderer.',
 eks:'Spørsmål/problem → analyse → konklusjon = god fagartikkelstruktur'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'avsnitt_klikk',vanske:'lett',
 q:'Linjeskift-kuttaren: Klikk på det første ordet i kvart avsnitt for å lage eit nytt avsnittsskifte.',
 segments:[
  {id:'s0',tekst:'Klimaendringar er eit av dei største problema me står overfor i dag.'},
  {id:'s1',tekst:'Gjennomsnittstemperaturen på jorda har stige med over 1,1 grad sidan den industrielle revolusjonen.',first_word:'Gjennomsnittstemperaturen',break_before:true},
  {id:'s2',tekst:'For å stoppe oppvarminga må verdssamfunnet redusere utslepp dramatisk.',first_word:'For',break_before:true},
  {id:'s3',tekst:'Mange land har allereie innført lover og avgrensingar på karbonutslepp.',first_word:'Mange',break_before:false}
 ],
 fasit_breaks:['s1','s2'],
 regel:'Nytt avsnitt = ny tanke eller nytt poeng. Ikkje kvart punkt på ny linje, men logiske steg i resonnementet.',
 eks:'Innleiing (problem) → Fakta avsnittet → Løysing-avsnittet'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'lett',
 q:'Overskrifts-ruletten: Kva er den mest presise og faglege overskrifta for ein fagartikkel om klimaendringar og ungdom?',
 alt:[
  'Klimaendringar: kva ungdom kan gjere',
  'Det er veldig viktig å redde planeten vår no!!!',
  'Ein liten tekst om klima og sånne ting',
  'Klimakrisa forklarert av meg sjølv'
 ],
 fasit:'Klimaendringar: kva ungdom kan gjere',
 regel:'Ein god fagleg overskrift er presis, nøytral i tone og lovar lesaren kva teksten handlar om. Unngå utropsteikn, skrivefeil og vage formuleringar.',
 eks:'GOD: «Sosiale medium og psykisk helse hos ungdom». DÅRLEG: «Sosiale medium er kjempeskadelege!!!»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Overskrifts-ruletten: Kva er den mest faglege overskrifta for ein analyse av to dikt om einsemd?',
 alt:[
  'Einsemd i lys av to dikt: ei samanliknande analyse',
  'To dikt som handlar om einsemd og trist stemning osv.',
  'EINSEMD I DIKT (veldig interessant tekst!!!)',
  'Eg synest desse dikta er kjempefine'
 ],
 fasit:'Einsemd i lys av to dikt: ei samanliknande analyse',
 regel:'Ein fagleg tittel namngjev teksttype (analyse), emne (einsemd) og metoden (samanliknande). Unngå subjektive meiningar og overdrivne teikn.',
 eks:'Format: [Emne]: ei [sjanger/metode] – t.d. «Klimakrisa: ei drøfting av tiltak og ansvar»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'vanskeleg',
 q:'Overskrifts-ruletten: Kva overskrift er best for eit drøftande debattinnlegg om skjermtid hos born?',
 alt:[
  'Skjermtid og born: ei drøfting av grenser og ansvar',
  'Bør born bruke mobil? Ja eller nei?',
  'Eg meiner at born ikkje bør bruke skjerm for mykje',
  'Skjerm, born, foreldre og problem – ei utgreiing'
 ],
 fasit:'Skjermtid og born: ei drøfting av grenser og ansvar',
 regel:'Overskrifta presiserer emnet (skjermtid + born), sjangeren (drøfting) og kva aspekt som vert handsama (grenser + ansvar). Unngå slagord, ja/nei-spørsmål og lange oppramsingar.',
 eks:'Godt format: «[Emne]: ei [sjanger/metode] av [aspekt(ar)]»'},

/* ── SPRÅK OG STIL (23) ── */
{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'lett',
 q:'Kjensle-kuttaren: Klikk på kvart ord i teksten som er for subjektivt eller uformelt til å høyre heime i ein fagartikkel.',
 tekst:'Sosiale medium er jo heilt avhengigheitsskapande, og eg meiner utvilsamt at dette er skikkeleg skadeleg.',
 fasit_feil:['jo','heilt','eg','meiner','utvilsamt','skikkeleg'],
 regel:'Fagartiklar unngår forsterkingsord som «heilt» og «skikkeleg», interjeksjonar som «jo», og meiningssignal som «eg meiner». Set fakta og forsking i sentrum.',
 eks:'UNNGÅ: «eg meiner at dette er heilt sjukt farleg» · SKRIV: «Forsking viser at dette er ein alvorleg risiko.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Utropsteikn-fengselet: Kva versjon av setninga er skriven i eit sakleg, fagleg register?',
 alt:['PLAST ER FARLEG!!!','Plast er faktisk VELDIG farleg for dyr og natur!!!','Plast representerer ein dokumentert risiko for marint dyreliv.','Plast er jo farleg!! Dette må vi ta alvorleg!!'],
 fasit:'Plast representerer ein dokumentert risiko for marint dyreliv.',
 regel:'Store bokstavar og utropsteikn signaliserer kjensler, ikkje kunnskap. Fagleg autoritet kjem av presis formulering og kjeldetilvising – ikkje av å skrike på skjermen.',
 eks:'DÅRLEG: «KLIMAET ER I FARE!!!» · GOD: «Klimaendringar utgør ein alvorleg trussel mot globale økosystem.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Skru opp alvoret: Kva versjon av setninga passar best i ein fagartikkel om havforureining?',
 alt:['Plast i havet er liksom ikkje så bra for dyr og sånn','PLAST DREP DYR!!! Det er jo klart!!!','Plast i havet utgør ein alvorleg trussel mot marint liv.','Eg trur plast i havet er ganske ille for dyra'],
 fasit:'Plast i havet utgør ein alvorleg trussel mot marint liv.',
 regel:'Fagleg skriving er nøytral, presis og sakleg. Unngå munnlege uttrykk («og sånn»), utropsteikn og direkte meiningsmarkørar («eg trur»).',
 eks:'Formelt register: objektiv tone, presis ordbruk, ingen kjensleladde forsterkingar.'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Skru opp alvoret: Kva versjon passar best i eit strukturert debattinnlegg om sosiale medium?',
 alt:['Folk er jo skikkeleg avhengige av sosiale medium, det er heilt tydeleg','Forsking viser at overdreven bruk av sosiale medium kan svekke konsentrasjonsevna.','Sosiale medium øydelegg hjernen, og det er jo sanninga','OMG sosiale medium er livsfarleg!!! Eg er så lei!'],
 fasit:'Forsking viser at overdreven bruk av sosiale medium kan svekke konsentrasjonsevna.',
 regel:'Det formelle registeret unngår overgeneralisering («øydelegg hjernen») og subjektive utrop («OMG»). Ei god fagsetning peikar mot ei kjelde og er etterprøvbar.',
 eks:'Mønster: «[Forsking/studiar] viser at [presis påstand] (kjelde).»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Frå dagbok til fagtekst: «Kjære dagbok, i dag lærte eg at plast drep skjelpadder, det er jo heilt sjukt :(» Kva versjon er riktig omsett til fagleg stil?',
 alt:[
  'Plast er jo heilt klart farleg, særleg for skjelpadder i havet.',
  'Plastsøppel i havet utgør ein reell trussel mot sjødyr som skjelpadder, som kan forveksle plastbitar med mat.',
  'I dag fann eg ut at plast i havet er skadeleg for skjelpadder.',
  'Eg meiner at plast i havet er eit reelt problem for skjelpadder og andre dyr.'
 ],
 fasit:'Plastsøppel i havet utgør ein reell trussel mot sjødyr som skjelpadder, som kan forveksle plastbitar med mat.',
 regel:'Fagartiklar startar ikkje med «kjære dagbok» eller «i dag lærte eg». Set fakta og forskingsspørsmål først – utan forfattaren i sentrum.',
 eks:'«I dag lærte eg at…» → «Forsking viser at…» · «heilt sjukt :(» → «ein dokumentert trussel»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Avslutnings-fikseren: Ein fagartikkel om plastforureining sluttar med «No håpar eg de lærte noko, hadet bra!» Kva fagleg avslutning bør erstatte han?',
 alt:[
  'No håpar eg de forsto kor viktig dette er! Ha det bra!',
  'Det var alt eg hadde å seie om plast. Kjekkast å skrive om dette.',
  'Samla sett viser dette at plastforureining krev koordinert innsats frå politikarar, næringsliv og enkeltpersonar.',
  'Plast er eit stort problem, og vi alle må ta ansvar. Sjå deg rundt neste gong du kastar noko!'
 ],
 fasit:'Samla sett viser dette at plastforureining krev koordinert innsats frå politikarar, næringsliv og enkeltpersonar.',
 regel:'Ei fagleg avslutting summerer, konkluderer eller peikar framover. Ho henvendar seg aldri direkte til lesaren med uformelt språk.',
 eks:'UNNGÅ: «Håpar de lærte noko!» · SKRIV: «Dette viser at tiltak på fleire nivå er nødvendig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Emoji-filteret: Ein fagartikkel inneheld setninga «Klimaendringar er 😢 for alle». Kva sakleg formulering bør erstatte emojien?',
 alt:['svært alvorlege','😢😢😢','ei stor trist sak','triste greier'],
 fasit:'svært alvorlege',
 regel:'Emojiar høyrer til i private meldingar, ikkje i fagtekstar. Bruk presise adjektiv som «alvorleg», «kritisk» eller «dramatisk» i staden.',
 eks:'UNNGÅ: «klimaet er 🔥» · SKRIV: «klimaendringar har fått dramatiske konsekvensar»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Emoji-filteret: Teksten seier «🌍 vert øydelaód av klimagassar». Kva fagleg formulering erstattar setningsopninga best?',
 alt:['Jorda er trua av aukande utslepp av klimagassar.','Den grøne kloden er øydelagd pga. CO2!!!','🌍 er i alvorleg fare pga. utslepp.','Kloden vert påverka av slike gassar.'],
 fasit:'Jorda er trua av aukande utslepp av klimagassar.',
 regel:'Emojiar og forkortingar som «pga.» bør erstattast med fullstendige, presise formuleringar. Fagleg skriving identifiserer subjektet klart («Jorda» i staden for 🌍).',
 eks:'🌍 → «Jorda» · pga. → «på grunn av» · 😢 → «alvorleg», «kritisk»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Trykk på dei overflødige eller upassande orda: Klikk på alle ord som gjer setninga uformell eller unødvendig subjektiv.',
 tekst:'Eg synest eigentleg at forskinga er heilt superviktig, og at vi berre må ta oss saman no.',
 fasit_feil:['eg','synest','eigentleg','heilt','berre'],
 regel:'I fagleg stil tonar du ned personlege meiningar og forsterkarord. Skriv nøytralt og presist.',
 eks:'UNNGÅ: «Eg synest dette er heilt superviktig» · SKRIV: «Forskinga peikar på at temaet er viktig.»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'medium',
 q:'Trykk på dei overflødige eller upassande orda: Marker ord som ikkje høyrer heime i ein sakleg fagtekst.',
 tekst:'Dette tiltaket er jo ganske smart, men det funkar liksom ikkje skikkeleg i praksis.',
 fasit_feil:['jo','ganske','liksom','skikkeleg'],
 regel:'Fyllord og munnlege markørar («jo», «liksom») svekkjer presisjon og truverd i fagtekst.',
 eks:'UNNGÅ: «det funkar liksom ikkje» · SKRIV: «tiltaket har avgrensa effekt i praksis»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskeleg',
 q:'Trykk på dei overflødige eller upassande orda: Klikk på ord som gjer argumentasjonen for kjensleladd i staden for fagleg.',
 tekst:'Kjeldene viser tydeleg at dette er ekstremt farleg, og alle skjønar jo at vi må handle straks.',
 fasit_feil:['tydeleg','ekstremt','alle','skjønar','jo','straks'],
 regel:'Absolutte og kjensleladde ord («alle», «ekstremt») bør bytast ut med nøytrale, etterprøvbare formuleringar.',
 eks:'UNNGÅ: «alle skjønar jo dette» · SKRIV: «fleire studiar peikar i same retning»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Omformuleraren: Kva er den beste faglege versjonen av setninga «Eg trur eigentleg at skjermbruk er ganske dårleg for unge, for dei blir jo heilt oppslukte»?',
 alt:[
  'Skjermbruk er dårleg for unge fordi dei blir oppslukte.',
  'Høg skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.',
  'Eg synest skjermbruk er skadeleg – ungdommen er jo avhengige.',
  'Det er klart at skjerm er negativt, og alle veit jo det eigentleg.'
 ],
 fasit:'Høg skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.',
 regel:'I fagtekst bør du prioritere nøytral ordbruk, konkret verknad og etterprøvbare påstandar.',
 eks:'«Eg trur» → «studiar tyder på» · «heilt oppslukte» → «redusert konsentrasjon»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'vanskeleg',
 q:'Omformuleraren: Kva er den beste faglege versjonen av setninga «Plast i havet er skikkeleg krise, og dyra slit skikkeleg mykje fordi folk berre kastar ting overalt»?',
 alt:[
  'Plast i havet er krise, og dyra slit mykje fordi folk kastar ting.',
  'Det er heilt klart at plasten øydelegg for dyra, og det er folk si skuld.',
  'Plastforureining i havet har alvorlege konsekvensar for dyrelivet, særleg der avfallshandtering er utilstrekkeleg.',
  'Plast er eit veldig stort problem som gjer at dyra i havet slit.'
 ],
 fasit:'Plastforureining i havet har alvorlege konsekvensar for dyrelivet, særleg der avfallshandtering er utilstrekkeleg.',
 regel:'Formell stil krev presise fagord og nøytral tone. Munnlege forsterkarar og vage formuleringar skal erstattast.',
 eks:'«skikkeleg krise» → «alvorlege konsekvensar» · «kastar ting overalt» → «mangelfull avfallshandtering»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'lett',
 q:'Dra orda til riktig side: Sorter uttrykka i «Uformelle formuleringar» eller «Formelle formuleringar».',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'liksom',fasit:0},
  {tekst:'jo',fasit:0},
  {tekst:'heilt sjukt',fasit:0},
  {tekst:'eg meiner',fasit:0},
  {tekst:'det tyder på at',fasit:1},
  {tekst:'forsking viser at',fasit:1},
  {tekst:'dokumenterte funn',fasit:1},
  {tekst:'i eit fagleg perspektiv',fasit:1}
 ],
 regel:'Uformelle ord er munnlege og personlege. Formelle uttrykk er presise, nøytrale og eigna i fagtekst.',
 eks:'«jo/liksom» = uformelt · «forsking viser at» = formelt'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'medium',
 q:'Dra orda til riktig side: Kva høyrer til uformell stil, og kva høyrer til formell stil?',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'kjempeviktig',fasit:0},
  {tekst:'superbra',fasit:0},
  {tekst:'folk flest skjønar',fasit:0},
  {tekst:'på grunn av dette',fasit:1},
  {tekst:'ein mogleg konsekvens er',fasit:1},
  {tekst:'samla sett',fasit:1},
  {tekst:'det finst indikasjonar på',fasit:1}
 ],
 regel:'Formelle formuleringar brukar faglege overgangar og nyanserte vurderingar i staden for overdriving.',
 eks:'«kjempeviktig» → «særleg viktig» · «superbra» → «føremålstenleg»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'vanskeleg',
 q:'Dra orda til riktig side: Sorter uttrykka etter språkregister.',
 kolonner:['Uformelle formuleringar','Formelle formuleringar'],
 ord:[
  {tekst:'det er jo klart',fasit:0},
  {tekst:'eg føler at',fasit:0},
  {tekst:'masse problem',fasit:0},
  {tekst:'truleg samanheng',fasit:1},
  {tekst:'empirisk grunnlag',fasit:1},
  {tekst:'kan indikere',fasit:1},
  {tekst:'fagleg avgrensing',fasit:1},
  {tekst:'metodisk svakheit',fasit:1}
 ],
 regel:'Formell stil nyttar analytiske faguttrykk og forsiktige konklusjonar, ikkje personlege kjensler eller skråsikre utrop.',
 eks:'«eg føler at» = uformelt · «kan indikere» = formelt og fagleg'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'lett',
 q:'Kva setning har best språkleg presisjon i ein fagartikkel?',
 alt:['Dette er jo ganske ille, liksom.','Dette framstår som ei alvorleg utfordring.','Det er heilt sjukt kor gale det er.','Eg synest dette er veldig dårleg.'],
 fasit:'Dette framstår som ei alvorleg utfordring.',
 regel:'Presis, nøytral ordbruk gjer argumentasjonen meir truverdig.',
 eks:'UNNGÅ munnlege fyllord · VEL presise faglege uttrykk'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'medium',
 q:'Fyll inn eit formelt overgangsord i denne setninga frå ei drøfting om skulehelsetenesta:\n«Forsking viser at tidleg intervensjon reduserer fråfall, og fleire skular har allereie sett gode resultat. ___ tyder funna på at tiltaket har effekt.»',
 hint:'Vel eit ord eller uttrykk som knyter saman dei føregåande argumenta og trekkjer ein konklusjon.',
 fasit:'Samla sett',
 fasit_v:['Samla sett','Alt i alt','Dermed','Difor','Såleis','På bakgrunn av dette','Dette tyder på at'],
 regel:'Overgangsord som oppsummerer argument held teksten stram og fagleg. «Samla sett», «Alt i alt» og «Såleis» signaliserer konklusjon, medan «Dermed» og «Difor» viser årsakssamanheng.',
 eks:'«Samla sett tyder funna på…» · «Difor kan ein hevde at…» · «Såleis stadfester undersøkinga…»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'finn_feil',vanske:'vanskeleg',
 q:'Tekstlegen 🩺 Pasienten er sjuk! Analysen nedanfor er nesten fagleg – men 5 uformelle symptom har sneikt seg inn. Klikk på kvart sjukt ord og redd innleveringa!',
 tekst:'Analysen av diktet er jo veldig interessant, fordi forfattaren brukar skikkeleg mange bilete som eigentleg gjer teksten djupare – men dette er liksom ikkje alltid tydeleg.',
 fasit_feil:['jo','veldig','skikkeleg','eigentleg','liksom'],
 regel:'Interjeksjonar (jo), forsterkingsord (veldig, skikkeleg) og munnlege fyllord (eigentleg, liksom) bryt det faglege registeret. Kvar av dei svekker truverdet til analysen.',
 eks:'«jo» → fjern · «veldig» → «svært» · «skikkeleg» → «særleg» · «eigentleg» → fjern · «liksom» → fjern'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'mc',vanske:'medium',
 q:'Agenten si dekke 🕵️ Du er hemmeleg agent og MÅ kome deg inn på ein akademisk konferanse. Vaktane slepper berre inn dei som snakkar fagleg. Kva setning er agentsvaret ditt?',
 alt:[
  'Dette er jo heilt sjukt viktig for oss som verkeleg bryr oss om dette!',
  'Funna indikerer ein mogleg samanheng, men ytterlegare forsking er nødvendig for å stadfeste dette.',
  'Eg meiner forskarane eigentleg er ganske einige, sjølv om media seier noko anna.',
  'Det er jo tydelegvis bevist at dette alltid stemmer – alle veit jo det!'
 ],
 fasit:'Funna indikerer ein mogleg samanheng, men ytterlegare forsking er nødvendig for å stadfeste dette.',
 regel:'Det akademiske registeret brukar forsiktige påstandar («indikerer», «mogleg samanheng»), erkjenner uvisse («ytterlegare forsking er nødvendig») og unngår skråsikkerheit («alltid stemmer», «alle veit»).',
 eks:'AGENTSVAR: «indikere», «mogleg», «nødvendig forsking» · AVSLØRTE: «jo», «eigentleg», «tydelegvis», «alltid»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_kolonne',vanske:'medium',
 q:'Oppgraderingsportalen 🔒 Fagleg publisering krev godkjenning. Sorter kvar formulering: vert ho blokkert av portalen, eller passerer ho?',
 kolonner:['Blokkert – for absolutt og skråsikker','Passerer portalen – nøyansert og fagleg'],
 ord:[
  {tekst:'Dette beviser definitivt at tiltaket verkar.',fasit:0},
  {tekst:'Funna tyder på at tiltaket kan ha effekt.',fasit:1},
  {tekst:'Alle forskarar er einige om dette.',fasit:0},
  {tekst:'Fleire studiar indikerer ein mogleg samanheng.',fasit:1},
  {tekst:'Det er eit faktum at skulen sviktar ungdom.',fasit:0},
  {tekst:'Ein kan argumentere for at skulen treng meir ressursar.',fasit:1}
 ],
 regel:'Fagleg skriving uttrykker berre det ein kan dokumentere. «Beviser definitivt» og «alle er einige» er for absolutte. «Tyder på», «indikere» og «kan argumentere for» viser fagleg nøyaktigheit.',
 eks:'BLOKKERT: «beviser» → PASSERER: «tyder på» · BLOKKERT: «alle er einige» → PASSERER: «fleire studiar indikerer»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'drag_ord',vanske:'middels',
 q:'Setningssmeden 🔨 Smi ei fagleg avslutningssetning ved å trykke orda inn i rett rekkjefølge. Berre éi rekkjefølge er fagleg korrekt og logisk.',
 ord:['Det','er','difor','viktig','å','tilpasse','registeret','til','mottakaren','.'],
 fasit:'Det er difor viktig å tilpasse registeret til mottakaren .',
 regel:'«Difor» viser årsakssamanheng og er eit typisk formelt overgangsord i avsluttinga. «Registeret» og «mottakaren» er faglege termar som høyrer heime i ei fagleg oppsummering.',
 eks:'Mønster for fagleg avslutning: [Difor/Samla sett] + [er det viktig å] + [fagleg handling] + [fagleg mål]'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'cloze',vanske:'lett',
 q:'Stiloppgraderaren 🎮 Teksten er NESTEN fagleg – men eitt uformelt ord øydelegg heilskapen. Skriv eit formelt erstatningsord for «kjempeviktig» i setninga nedanfor:\n\n«Tiltaket var kjempeviktig for å redusere fråfall i skulen.»',
 hint:'Formelt og presist – ikkje «kjempe-» eller «super-». Kva adjektiv beskriv noko som er absolutt nødvendig og av stor verknad?',
 fasit:'avgjerande',
 fasit_v:['avgjerande','kritisk','vesentleg','sentral','nødvendig','særleg viktig'],
 regel:'Uformelle forsterkarar som «kjempe-», «super-» og «skikkeleg» erstattas med presise adjektiv: «avgjerande», «kritisk», «vesentleg» eller «sentral».',
 eks:'«kjempeviktig» → «avgjerande» · «superbra» → «særleg vellykka» · «skikkeleg vanskeleg» → «krevjande»'},

/* ── TEKSTSTRUKTUR – tillegg (4) ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Fiks «hoppet»: Avsnitt 1 handlar om klimaendringar. Avsnitt 2 startar brått om teknologi. Kva overgangssetning fiksar flyten best?',
 alt:['Teknologi er bra.','No skal eg skrive om teknologi.','Teknologisk utvikling kan vere ein del av løysinga på klimaproblema.','Og då er det teknologi som kjem inn.'],
 fasit:'Teknologisk utvikling kan vere ein del av løysinga på klimaproblema.',
 regel:'Ein god overgangssetning knyter det nye emnet logisk til det føregåande. Ho peikar tilbake med eit referansepunkt («løysinga på klimaproblema») og framover mot nytt tema («teknologisk utvikling»).',
 eks:'Mønster: «[Nytt tema] kan sjåast i samanheng med [gammalt tema]» · «Utover [dette] må vi òg sjekke [nytt]»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'lett',
 q:'Motsetnings-maskina: Fyll inn eit bindeord som viser kontrast: «Sosiale medium kan vere nyttige. ___, kan dei òg ha negative konsekvensar.»',
 hint:'Du treng eit bindeord som seier at det neste er overraskande eller i motsetnad til det første.',
 fasit:'Likevel',
 fasit_v:['Likevel','Derimot','På den andre sida','Trass i dette','Men'],
 regel:'«Likevel», «derimot» og «på den andre sida» viser kontrast eller motsetnad. Dei er uunngåelege i drøftande tekstar der du balanserer argument.',
 eks:'«Sosiale medium er nyttige. Likevel kan overdreven bruk gå ut over konsentrasjonen.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Motsetnings-maskina: Fyll inn eit bindeord som nyanserer påstanden: «KI kan effektivisere skulearbeidet, ___ reiser det òg viktige etiske spørsmål.»',
 hint:'Bindeordet skal vise at det neste nyanserande eller i motsetnad til nytte-påstanden.',
 fasit:'men',
 fasit_v:['men','likevel','samstundes'],
 regel:'«Men» og «likevel» signaliserer motsetnad. Dei er signalorda i drøftande tekstar som viser at du tek begge sider på alvor.',
 eks:'«KI er nyttig, men vi må stille kritiske spørsmål om personvern og etikk.»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Start-motor for avsnitt: Tre avsnitt om klimatiltak er allereie skrivne. Kva er den BESTE opninga på eit nytt avsnitt?',
 alt:['Ein annan ting er at mange land har innført CO2-avgift.','For det tredje kan ein nemne CO2-avgifta.','Utover dei allereie nemnde tiltaka har fleire land innført CO2-avgifter.','Ok, no skal eg skrive om CO2-avgift.'],
 fasit:'Utover dei allereie nemnde tiltaka har fleire land innført CO2-avgifter.',
 regel:'Unngå «Ein annan ting er…» og mekanisk «For det første/andre/tredje»-oppramsing. Knytt kvart avsnitt logisk til det føregåande med eit referanseord.',
 eks:'«Utover dei presenterte tiltaka…» · «I tillegg til dette…» · «Sett i lys av dei nemnde tendensane…»'},

/* ── KJELDEBRUK – tillegg (5) ── */
{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Papegøye-alarmen: Kjelda seier: «Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.» Kva elevversjon er eit plagiat?',
 alt:['Forsking syner at nesten alle sjøfuglar i Nordsjøen er påverka av plast.','Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.','Fuglelivet i Nordsjøen er hardt pressa av plastforureining.','Studiar dokumenterer at plastpåverknad er svært utbreidd blant sjøfuglar.'],
 fasit:'Plast har blitt funnet i 90 % av sjøfuglene som er undersøkt i Nordsjøen.',
 regel:'Å kopiere kjeldeteksten ordrett utan hermeteikn og kjeldetilvising er plagiat. Omskrivinga må endre ordval og setningsstruktur – ikkje berre byte ut eitt ord.',
 eks:'PLAGIAT: kopiert ordrett. RIKTIG: Eiga formulering + kjeldetilvising (Forfattar, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'vanskeleg',
 q:'Krymparen: Kjelda seier: «Dei siste hundre åra har menneskeskapt utslepp av klimagassar som CO2 og metan ført til ei gradvis stigande gjennomsnittstemperatur over heile kloden, noko som truar økosystem og værmønster verda over.» Kva kjernesetning på maks 10 ord fangar best innhaldet?',
 alt:[
  'Klimaendringar er eit problem fordi vi slepper ut CO2 og metan.',
  'CO2 og metan frå menneske har stige dei siste hundre åra.',
  'Klimagassutslepp aukar temperaturen og truar naturlege system.',
  'Menneskeskapt CO2 og metan fører til klimaendringar globalt i dag.'
 ],
 fasit:'Klimagassutslepp aukar temperaturen og truar naturlege system.',
 regel:'Å krynga ei kjelde tvingar deg til å forstå ho – og hindrar deg i å kopiere setningar ordrett. Finn kjernen og la resten gå.',
 eks:'Lang kjelde + 10-ords-grense = di eiga formulering. Alternativ 1 og 4 er over 10 ord eller for vage. Alternativ 2 manglar konsekvensen.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'drag_kolonne',vanske:'medium',
 q:'Sitering eller omskriving? Klikk på kvart kort og sorter det i rett boks.',
 kolonner:['Treng hermeteikn (direkte sitat)','Kan stå fritt med kjeldetilvising (omskrive)'],
 ord:[
  {tekst:'«1,3 millionar tonn plast hamnar i havet kvart år»',fasit:0},
  {tekst:'Forsking viser at plast vert eit stadig større problem i verdshava',fasit:1},
  {tekst:'«Mikroplast trengjer inn i næringsrekkja og skadar dyrelivet»',fasit:0},
  {tekst:'Havpattedyr og fuglar er særleg utsette for skadar frå plast',fasit:1}
 ],
 regel:'Set hermeteikn berre ved ordrett sitering frå kjelda. Eiga omskriving treng kjeldetilvising (forfattar, årstal), men ikkje hermeteikn.',
 eks:'Sitat: «ord frå kjelde» (Forfattar, årstal). Omskriving: Di formulering av same innhald (Forfattar, årstal).'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Tolken: Kjelda seier «Mikroplastpartiklar er funne i blodet hos 80 % av testa vaksne.» Kva er den BESTE tolkinga som kan følge sitatet?',
 alt:[
  'Dette betyr eigentleg at mikroplast er funne i blod.',
  'Dette betyr eigentleg at 80 % er eit høgt tal og det er bekymringsverdig.',
  'Dette betyr eigentleg at plast ikkje berre er eit miljøproblem, men òg ein direkte helsetrussel for kvart einaste menneske.',
  'Dette betyr eigentleg at vi bør slutte å bruke plast.'
 ],
 fasit:'Dette betyr eigentleg at plast ikkje berre er eit miljøproblem, men òg ein direkte helsetrussel for kvart einaste menneske.',
 regel:'Etter eit sitat kjem alltid di eiga forklaring av kva det betyr. Sitatet åleine er ikkje argumentet – tolkinga er det.',
 eks:'SVAK tolking: repeterer berre faktumet. GOD tolking: trekker ein ny konsekvens eller innsikt ut av faktumet.'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Metatekst-støvsugaren: Kva setning er metatekst – der forfattaren snakkar om sin eigen tekst i staden for å kome rett til saka?',
 alt:['I denne teksten skal eg skrive om klimaendringar.','Klimaendringar har ført til meir ekstremvær dei siste tiåra.','Mange land har innført CO2-avgifter for å redusere utslepp.','Plastforureining truar marint dyreliv i Nordsjøen.'],
 fasit:'I denne teksten skal eg skrive om klimaendringar.',
 regel:'Metatekst er setningar der forfattaren omtalar seg sjølv og sin eigen tekst («I denne teksten skal eg…», «No skal eg forklare…»). Slike setningar er bortkasta ord – kom rett til saka i staden.',
 eks:'METATEKST: «I denne teksten kjem eg til å…» · FAGLEG: Start med fakta, problemstilling eller definisjon.'},
]; // end MT_BANK

// Expose task bank for other scripts that run on the same page.
if(typeof window!=='undefined') window.MT_BANK = MT_BANK;
if(typeof globalThis!=='undefined') globalThis.MT_BANK = MT_BANK;

/* ══════════════════════════════════════════════════════
   MENGDETRENING – state & logikk
══════════════════════════════════════════════════════ */
const MTS = { tasks:[], idx:0, score:0, answered:false, config:{}, streak:0, history:[] };

function mtShuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function mtShuffleBank(){
  for(let i=MT_BANK.length-1;i>0;i--){
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
  let pool=MT_BANK.filter(t=>valgte.includes(t.kat));
  if(vanske!=='adaptiv') pool=pool.filter(t=>t.vanske===vanske);
  return pool.length;
}

function mtUpdateAntalMeta(){
  const inp=$mt('mt-antal');
  const hint=$mt('mt-antal-hint');
  if(!inp) return;

  const tilgjengeleg=mtGetTilgjengelegeOppgaver();
  const maks=Math.min(25, tilgjengeleg||25);
  inp.max=String(maks);

  const val=parseInt(inp.value,10);
  if(Number.isFinite(val) && val>maks) inp.value=String(maks);

  if(hint){
    if(tilgjengeleg===0){
      hint.textContent='Vel minst éin kategori for å sjå kor mange oppgåver som er tilgjengelege.';
    } else {
      hint.textContent=`Tilgjengelege med vala dine: ${tilgjengeleg}. Du kan starte med opptil ${maks}.`;
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
  if(!valgte.length){ alert('Vel minst éin kategori for å starte.'); return; }
  const vanske = $mt('mt-vanske').value;
  const onskja = parseInt($mt('mt-antal').value,10);
  const grunnTal = Number.isFinite(onskja) ? onskja : 8;

  let pool = MT_BANK.filter(t=>valgte.includes(t.kat));
  if(vanske!=='adaptiv') pool = pool.filter(t=>t.vanske===vanske);
  const maksTillate = Math.min(25, pool.length);
  const antal = Math.min(maksTillate, Math.max(3, grunnTal));

  if(pool.length && grunnTal>maksTillate){
    alert(`Du bad om ${grunnTal} oppgåver, men med desse vala er maks ${maksTillate}. Startar med ${maksTillate}.`);
  }

  pool = mtShuffle(pool).slice(0, antal);
  if(vanske==='adaptiv'){
    const lett = mtShuffle(pool.filter(t=>t.vanske==='lett'));
    const medium = mtShuffle(pool.filter(t=>t.vanske==='medium'));
    const vanskeleg = mtShuffle(pool.filter(t=>t.vanske==='vanskeleg'));
    pool = [...lett, ...medium, ...vanskeleg];
  }

  if(!pool.length){ alert('Ingen oppgåver passar desse vala. Prøv ein annan kombinasjon.'); return; }

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

  const vCls={ lett:'background:#e8f2f8;color:#1a567a', medium:'background:#fffbe8;color:#6b4a00', vanskeleg:'background:#fff0ed;color:#8b2a0a' }[t.vanske]||'';
  const vLbl={ lett:'Lett', medium:'Medium', vanskeleg:'Vanskeleg' }[t.vanske]||'';

  const hintHTML = t.hint
    ? `<div style="background:#fffbe8;border:1px solid #f5d878;border-radius:8px;padding:0.55rem 1rem;margin-top:0.7rem;font-size:13px;color:#6b4a00">💡 Hint: ${mtEsc(t.hint)}</div>`
    : '';

  let inputHTML='';
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
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk på orda du meiner er <strong>${mtEsc(t.maalordklasse)}</strong>. Klikk igjen for å fjerne markeringa.</p>
      <div id="km-tekst" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem;line-height:2;font-family:'Fraunces',serif;font-size:15px;margin-bottom:0.8rem">${wdSpans}</div>
      <button onclick="kmSjekk()" style="background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk markeringar</button>
      <button onclick="kmReset()" style="margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='finn_feil'){
    // Same as klikk_marker but marking errors
    const tknWds = t.tekst.split(' ');
    const wdSpans = tknWds.map((w,i)=>{
      const clean = w.replace(/[.,!?;:«»"()]/g,'').toLowerCase();
      return `<span class="ff-word" data-i="${i}" data-clean="${clean}" onclick="ffClick(this)"
        style="display:inline-block;margin:2px 3px;padding:3px 8px;border-radius:5px;cursor:pointer;border:1px solid transparent;transition:background 0.12s;font-size:15px;line-height:1.8">${mtEsc(w)}</span>`;
    }).join(' ');
    inputHTML=`<div style="margin-top:0.8rem">
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Det er <strong>${t.fasit_feil.length} feil</strong> gøymt i teksten. Klikk på kvart ord du meiner er feil skrive eller feil brukt.</p>
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
    // Three-bucket drag: Innleiing / Hovuddel / Avslutning
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
      <p style="font-size:12px;color:#8a8a84;margin-bottom:0.5rem">Klikk på det <strong>første ordet</strong> i kvar setning der du vil starte eit nytt avsnitt. Klikk igjen for å fjerne.</p>
      <div id="ak-text" style="background:#f8f7f4;border-radius:8px;padding:0.8rem 1rem 0.8rem;line-height:2.2">${items}</div>
      <button onclick="akSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk avsnitt</button>
      <button onclick="akReset()" style="margin-top:10px;margin-left:8px;background:transparent;border:1px solid #d5d2cb;color:#4a4a46;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;cursor:pointer">Nullstill ↺</button>
    </div>`;
  } else if(t.type==='drag_ord'){
    // Sett ord i rett rekkjefølge
    const shuffled = mtShuffle([...t.ord]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div id="mtdo-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:0.8rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px">
        ${shuffled.map((w,i)=>`<button class="mtdo-token" data-w="${mtEsc(w)}" data-idx="${i}" onclick="mtoMove(this)"
          style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:14px;padding:6px 14px;cursor:pointer">${mtEsc(w)}</button>`).join('')}
      </div>
      <div id="mtdo-answer" style="min-height:44px;padding:0.6rem;background:#fff;border:2px dashed #c5c2bb;border-radius:8px;display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:#8a8a84">
        <span id="mtdo-placeholder" style="font-size:13px;color:#aaa">Trykk på orda over i rett rekkjefølge…</span>
      </div>
      <button onclick="mtoSjekk()" style="margin-top:10px;background:#e5822a;color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:8px 18px;cursor:pointer">Sjekk rekkjefølge</button>
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
        ${MTS.idx+1<MTS.tasks.length?'Neste oppgåve →':'Sjå resultat →'}
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

  let html=`<strong>Takk for svaret! Her er eit poeng for innsatsen. 📝</strong>`;
  html+=`<div style="margin-top:0.8rem;display:grid;grid-template-columns:1fr 1fr;gap:10px">`;
  if(t.eksempel_svak) html+=`<div style="background:#fff0ed;border-radius:8px;padding:0.7rem 0.9rem;font-size:13px;color:#7f1d1d"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px">Kan bli betre 🟡</strong>${mtEsc(t.eksempel_svak)}</div>`;
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

  let html=`<strong>${correct?'✓ Rett!':'✗ Feil'}</strong>`;
  if(!correct) html+=` Rett svar: <strong>${mtEsc(t.fasit)}</strong>`;
  if(t.regel) html+=`<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`;
  if(t.eks)   html+=`<div style="margin-top:0.3rem;font-size:13px;opacity:0.75"><em>Eks.: ${mtEsc(t.eks)}</em></div>`;
  fb.innerHTML=html;

  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}

function mtNext(){
  // Auto-check viss eleven ikkje har svart
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
        // Ingen val gjort – tel som feil og gå vidare
        MTS.answered=true; MTS.history[MTS.idx]=false; mtUpdateProgress();
      } else {
        MTS.answered=true; MTS.history[MTS.idx]=false;
      }
    }
  }
  // Auto-check viss eleven ikkje har svart
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
        // Ingen val gjort – tel som feil og gå vidare
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
  const msgs=[[90,'Framifrå! Du meistrar dette svært godt.'],[70,'Bra jobba! Du er på god veg.'],[50,'Greitt! Øv litt meir på dei vanskelege oppgåvene.'],[0,'Ikkje gi opp – prøv igjen!']];
  $mt('mt-sum-msg').textContent=(msgs.find(([t])=>pct>=t)||msgs[msgs.length-1])[1];

  // Oppgåveoversikt – vis kva som var rett og feil
  const hist = $mt('mt-sum-history');
  if(hist){
    let html='';
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

