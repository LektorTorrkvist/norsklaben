if (typeof window !== 'undefined') {
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    window.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (window.HTMLCollection && !window.HTMLCollection.prototype.forEach) {
    window.HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }
}

/* ── Utility helpers ── */
function $(id){ return document.getElementById(id); }
function shuffle(arr){ var a=[].concat(arr); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var tmp=a[i]; a[i]=a[j]; a[j]=tmp; } return a; }
function repairMojibakeText(s){ return String(s||''); }

let _dragWord = '';
let _dragTokenId = '';

function dragStart(e, word){
  _dragWord = word;
  _dragTokenId = e && e.target ? e.target.id : '';
  try { if (e && e.dataTransfer) e.dataTransfer.setData('text/plain', word); } catch(_) {}
}

function dragEnd(_e) {}

function allowDrop(e){
  if (e) e.preventDefault();
}

const BANK = [
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett bestemt form eintal av «bok» (hokjønn)?',setning:null,
 alternativer:['boka','boken','boki','bøkene'],fasit:'boka',fasit_variant:['boka'],
 regel:'Hokjønnssubstantiv (ei-ord) får endinga -a i bestemt form eintal på nynorsk.',
 eksempel:'ei bok → boka, ei hytte → hytta',kontrast_bm:'boken'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'lett',
 sporsmal:'Skriv «bok» i bestemt form eintal.',setning:'Han la ___ på bordet.',
 fasit:'boka',fasit_variant:['boka'],
 regel:'Bestemt form eintal av hokjønnsord sluttar på -a.',
 eksempel:'boka, hytta, døra',kontrast_bm:'boken'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett ubestemt form fleirtal av «gut» (hankjønn)?',setning:null,
 alternativer:['gutar','gutter','gutar','gutane'],fasit:'gutar',fasit_variant:['gutar'],
 regel:'Hankjønnsord som «ein gut» får -ar i ubestemt fleirtal.',
 eksempel:'ein gut → gutar, ein bil → bilar',kontrast_bm:'gutter'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'lett',
 sporsmal:'Skriv «gut» i ubestemt form fleirtal.',setning:'Det var mange ___ på lekeplassen.',
 fasit:'gutar',fasit_variant:['gutar'],
 regel:'Ubestemt fleirtal av hankjønnsord som «ein gut» sluttar på -ar.',
 eksempel:'gutane (bestemt), gutar (ubestemt)',kontrast_bm:'gutter'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett bestemt form eintal av «hus» (inkjekjønn)?',setning:null,
 alternativer:['huset','huse','hus','husene'],fasit:'huset',fasit_variant:['huset'],
 regel:'Inkjekjønnssubstantiv (eit-ord) får endinga -et i bestemt form eintal.',
 eksempel:'eit hus → huset, eit bord → bordet',kontrast_bm:'huset'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett bestemt form fleirtal av «gut»?',setning:null,
 alternativer:['gutane','guttene','gutarne','gutar'],fasit:'gutane',fasit_variant:['gutane'],
 regel:'Bestemt form fleirtal av hankjønnsord som «ein gut» sluttar på -ane.',
 eksempel:'gutar → gutane, bilar → bilane',kontrast_bm:'guttene'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'medium',
 sporsmal:'Skriv «bok» i bestemt form fleirtal.',setning:'___ låg på golvet.',
 fasit:'Bøkene',fasit_variant:['bøkene','bøkane'],
 regel:'Bestemt form fleirtal av «bok» er «bøkene» (eller «bøkane»).',
 eksempel:'bøker (ubestemt) → bøkene (bestemt)',kontrast_bm:'Bøkene'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett ubestemt form fleirtal av «tre» (inkjekjønn)?',setning:null,
 alternativer:['tre','trær','treer','trene'],fasit:'tre',fasit_variant:['tre'],
 regel:'Mange inkjekjønnsord er ubestemd i fleirtal (null-ending): eitt tre → tre.',
 eksempel:'eit hus → hus, eit tre → tre',kontrast_bm:'trær'},
{emne:'substantiv',emne_label:'Substantiv – kjønn',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva kjønn har «sol» på nynorsk?',setning:null,
 alternativer:['hokjønn (ei sol)','hankjønn (ein sol)','inkjekjønn (eit sol)','kan vere begge'],
 fasit:'hokjønn (ei sol)',fasit_variant:['hokjønn (ei sol)'],
 regel:'«Sol» er hokjønn på nynorsk: ei sol → sola.',
 eksempel:'ei sol → sola, ei jord → jorda',kontrast_bm:'en sol (hankjønn på bokmål)'},
{emne:'substantiv',emne_label:'Substantiv – kjønn',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett artikkel (ubestemt form) for «veke»?',setning:null,
 alternativer:['ei veke','ein veke','eit veke','ein vekes'],
 fasit:'ei veke',fasit_variant:['ei veke'],
 regel:'«Veke» er hokjønn på nynorsk: ei veke → veka.',
 eksempel:'ei veke, veka, veker, vekene',kontrast_bm:'en uke (hankjønn på bokmål)'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'medium',
 sporsmal:'Skriv «skog» i bestemt form eintal.',setning:'Vi gjekk tur i ___.',
 fasit:'skogen',fasit_variant:['skogen'],
 regel:'Hankjønnsord får -en i bestemt form eintal: ein skog → skogen.',
 eksempel:'ein gut → guten, ein skog → skogen',kontrast_bm:'skogen'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett bestemt form fleirtal av «hand»?',setning:null,
 alternativer:['hendene','handane','handene','hender'],
 fasit:'hendene',fasit_variant:['hendene','handane'],
 regel:'«Hand» er uregelmessig: hender i fleirtal, hendene i bestemt form fleirtal.',
 eksempel:'ei hand → handa → hender → hendene',kontrast_bm:'hendene'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Skriv «fot» i ubestemt form fleirtal.',setning:'Ho såg to ___.',
 fasit:'føter',fasit_variant:['føter'],
 regel:'«Fot» er uregelmessig i nynorsk: ein fot → føter (ubestemt fl.) → føtene (bestemt fl.).',
 eksempel:'ein fot → føter → føtene',kontrast_bm:'føtter'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett bøying av «natt» i bestemt form fleirtal?',setning:null,
 alternativer:['nettene','nattane','nattene','netter'],
 fasit:'nettene',fasit_variant:['nettene','nettane'],
 regel:'«Natt» har omlyd i fleirtal: natt → netter → nettene.',
 eksempel:'ei natt → natta → netter → nettene',kontrast_bm:'nettene'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'lett',
 sporsmal:'Skriv «eple» i bestemt form eintal.',setning:'___ er stor og raud.',
 fasit:'Eplet',fasit_variant:['Eplet','eplet'],
 regel:'Inkjekjønnsord får -et i bestemt form eintal: eit eple → eplet.',
 eksempel:'eit eple → eplet, eit bord → bordet',kontrast_bm:'Eplet'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett ubestemt form fleirtal av «dør» (hokjønn)?',setning:null,
 alternativer:['dører','dørar','dørene','dørarne'],
 fasit:'dører',fasit_variant:['dører','dørar'],
 regel:'Hokjønnsord kan danne fleirtal med -er: ei dør → dører. Forma «dørar» er òg normert.',
 eksempel:'ei dør → dører/dørar → dørene',kontrast_bm:'dører'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'cloze',vanske:'medium',
 sporsmal:'Skriv «avis» i ubestemt form fleirtal.',setning:'Ho kjøpte to ___.',
 fasit:'aviser',fasit_variant:['aviser'],
 regel:'Hokjønnsord på -is/-us/-as får -er i ubestemt fleirtal: ei avis → aviser.',
 eksempel:'ei avis → aviser → avisene',kontrast_bm:'aviser'},
{emne:'substantiv',emne_label:'Substantiv – bøying',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett form: «mange år» eller «mange årar»?',setning:null,
 alternativer:['mange år','mange årar','mange årer','mange åra'],
 fasit:'mange år',fasit_variant:['mange år'],
 regel:'«År» er eit inkjekjønnsord med null-ending i ubestemt fleirtal: eitt år → år (fl.).',
 eksempel:'eitt år → år (fl.) → åra (bestemt fl.)',kontrast_bm:'mange år'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett presensform av «å kaste»? (presens = notid: ho ___ ballen)',setning:null,
 alternativer:['kastar','kaster','kaste','kastede'],
 fasit:'kastar',fasit_variant:['kastar'],
 regel:'Verb som sluttar på -e i infinitiv (t.d. kaste, lage, hoppe) får -ar i presens (notid): kastar, lagar, hoppar.',
 eksempel:'å kaste → kastar, å lage → lagar',kontrast_bm:'kaster'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'cloze',vanske:'lett',
 sporsmal:'Skriv «å kaste» i presens (notid = det som skjer no eller alltid). Eks: Ho ___ ballen.',setning:'Ho ___ ballen langt.',
 fasit:'kastar',fasit_variant:['kastar'],
 regel:'Verb på -e i infinitiv: byt -e med -ar i presens (notid): kaste → kastar.',
 eksempel:'kaste → kastar, lage → lagar',kontrast_bm:'kaster'},
{emne:'verb',emne_label:'Verb – preteritum',type:'multiple_choice',vanske:'lett',
 sporsmal:'Preteritum (fortid) = det som allereie har skjedd. Kva er rett preteritum av «å kaste»? Eks: Ho ___ ballen i går.',setning:null,
 alternativer:['kasta','kastet','kastede','kaste'],
 fasit:'kasta',fasit_variant:['kasta'],
 regel:'Verb på -e i infinitiv (t.d. kaste, lage) får -a i preteritum (fortid) på nynorsk: kasta, laga.',
 eksempel:'å kaste → kasta, å lage → laga',kontrast_bm:'kastet'},
{emne:'verb',emne_label:'Verb – preteritum',type:'cloze',vanske:'lett',
 sporsmal:'Skriv «å kaste» i preteritum (fortid = det som skjedde). Eks: Han ___ ut vindauget.',setning:'Han ___ ut vindauget.',
 fasit:'kasta',fasit_variant:['kasta'],
 regel:'Verb på -e: presens (notid) kastar → preteritum (fortid) kasta.',
 eksempel:'kaste → kasta, lage → laga',kontrast_bm:'kastet'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'multiple_choice',vanske:'medium',
 sporsmal:'Presens (notid) av «å lese» – kva er rett? Nokre verb har ingen ending i notid. Eks: Ho ___ boka.',setning:null,
 alternativer:['les','lesar','lese','leser'],
 fasit:'les',fasit_variant:['les'],
 regel:'Nokre verb har kort presens (notid) utan ending – verbet er lik stammen: å lese → les, å skrive → skriv.',
 eksempel:'å lese → les, å skrive → skriv',kontrast_bm:'leser'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'cloze',vanske:'medium',
 sporsmal:'Skriv «å lese» i presens (notid). Nokre verb har ingen ending – kva vert det då?',setning:'Ho ___ ei bok kvar kveld.',
 fasit:'les',fasit_variant:['les'],
 regel:'Nokre verb har ingen ending i presens (notid): å lese → les, å skrive → skriv.',
 eksempel:'å lese → les, å skrive → skriv',kontrast_bm:'leser'},
{emne:'verb',emne_label:'Verb – preteritum',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett preteritum av «å skrive»?',setning:null,
 alternativer:['skreiv','skrive','skrivar','skriv'],
 fasit:'skreiv',fasit_variant:['skreiv'],
 regel:'«Å skrive» er eit sterkt verb: skriv → skreiv → skrive.',
 eksempel:'å skrive → skreiv, å drive → dreiv',kontrast_bm:'skrev'},
{emne:'verb',emne_label:'Verb – preteritum',type:'cloze',vanske:'medium',
 sporsmal:'Skriv «å skrive» i fortid (preteritum).',setning:'Dei ___ eit langt brev til kvarandre.',
 fasit:'skreiv',fasit_variant:['skreiv'],
 regel:'Sterkt verb: å skrive → skreiv (vokalveksling i-ei).',
 eksempel:'skrive → skreiv, drive → dreiv',kontrast_bm:'skrev'},
{emne:'verb',emne_label:'Verb – infinitiv',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett infinitiv på nynorsk?',setning:null,
 alternativer:['å skrive','å skriva','å skriv','å skrevet'],
 fasit:'å skrive',fasit_variant:['å skrive','å skriva'],
 hint:'Nynorsk har to godkjende infinitivformer – éin av desse svara er faktisk òg rett!',
 regel:'Nynorsk har to gyldige infinitivformer: «å skrive» og «å skriva». Begge er normerte.',
 eksempel:'å skrive, å lese, å kaste',kontrast_bm:'å skrive (same)'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett presensform av «å spørje»?',setning:null,
 alternativer:['spør','spørjar','spørjer','spørar'],
 fasit:'spør',fasit_variant:['spør'],
 regel:'«Å spørje» er eit uregelmessig verb: infinitiv spørje → presens (notid) spør.',
 eksempel:'å spørje → spør → spurde → spurt',kontrast_bm:'spør (same)'},
{emne:'verb',emne_label:'Verb – preteritum',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Skriv «å spørje» i preteritum (fortid – det som skjedde).',setning:'Ho ___ kva klokka var.',
 fasit:'spurde',fasit_variant:['spurde','spurte'],
 regel:'«Å spørje» har preteritum (fortid) «spurde» (eller «spurte») på nynorsk.',
 eksempel:'spørje → spurde/spurte → spurt',kontrast_bm:'spurte'},
{emne:'verb',emne_label:'Verb – perfektum',type:'multiple_choice',vanske:'medium',
 sporsmal:'Korleis skriv ein «å kaste» om det skjedde på eit tidlegare tidspunkt (perfektum partisipp)?',setning:null,
 alternativer:['kasta','kastet','kast','kastande'],
 fasit:'kasta',fasit_variant:['kasta'],
 regel:'Verb på -e i infinitiv: perfektum partisipp (brukt etter «har») sluttar på -a: har kasta, har laga.',
 eksempel:'å kaste → har kasta, å lage → har laga',kontrast_bm:'kastet'},
{emne:'verb',emne_label:'Verb – perfektum',type:'cloze',vanske:'medium',
 sporsmal:'Perfektum er noko du har gjort. Skriv «å arbeide» i perfektum. Eks: Vi har ___ heile dagen.',setning:'Vi har ___ heile dagen.',
 fasit:'arbeidd',fasit_variant:['arbeidd','arbeida'],
 regel:'«Å arbeide» i perfektum (har + fortidsform) er «arbeidd» eller «arbeida» på nynorsk.',
 eksempel:'å arbeide → har arbeidd/arbeida',kontrast_bm:'arbeidet'},
{emne:'verb',emne_label:'Verb – presens (notid)',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett presensform av «å vera» (hjelpeverb)?',setning:null,
 alternativer:['er','vere','var','vær'],
 fasit:'er',fasit_variant:['er'],
 regel:'«Å vera» er uregelmessig: infinitiv vera, presens er, preteritum var.',
 eksempel:'Eg er glad. Ho er heime.',kontrast_bm:'er (same)'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «jeg»?',setning:null,
 alternativer:['e','jeg','ej','eg'],
 fasit:'eg',fasit_variant:['eg'],
 regel:'Førsteperson eintal er «eg» på nynorsk, ikkje «jeg».',
 eksempel:'Eg går heim. Eg heiter Kari.',kontrast_bm:'jeg'},
 {emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er «eg» på bokmål?',setning:null,
 alternativer:['eg','jeg','je','i'],
 fasit:'eg',fasit_variant:['jeg'],
 regel:'Førsteperson eintal er «eg» på nynorsk, ikkje «jeg».',
 eksempel:'Eg går heim. Eg heiter Kari.',kontrast_bm:'jeg'},
{emne:'pronomen',emne_label:'Pronomen',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «jeg» (subjektsform).',setning:'___ er glad i fotball.',
 fasit:'Eg',fasit_variant:['Eg','eg'],
 regel:'Førsteperson eintal er «eg» på nynorsk.',
 eksempel:'Eg spring. Eg syng.',kontrast_bm:'Jeg'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «hun»?',setning:null,
 alternativer:['ho','hun','henne','ho'],
 fasit:'ho',fasit_variant:['ho'],
 regel:'Tredjeperson eintal hokjønn subjektsform er «ho» på nynorsk, ikkje «hun».',
 eksempel:'Ho les. Ho spring.',kontrast_bm:'hun'},
{emne:'pronomen',emne_label:'Pronomen',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «hun» (subjektsform).',setning:'___ er systera mi.',
 fasit:'Ho',fasit_variant:['Ho','ho'],
 regel:'Hokjønn subjekt: «ho» på nynorsk (ikkje «hun»).',
 eksempel:'Ho går. Ho les.',kontrast_bm:'Hun'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett objektsform av «ho»?',setning:null,
 alternativer:['henne','ho','hun','seg'],
 fasit:'henne',fasit_variant:['henne'],
 regel:'Objektsforma av «ho» er «henne»: Eg ser henne.',
 eksempel:'Eg ringde henne. Dei hjelper henne.',kontrast_bm:'henne (same)'},
{emne:'pronomen',emne_label:'Pronomen',type:'cloze',vanske:'medium',
 sporsmal:'Skriv objektsforma av «ho».',setning:'Kan du hjelpe ___?',
 fasit:'henne',fasit_variant:['henne'],
 regel:'Objektsform av «ho» er «henne».',
 eksempel:'Eg ser henne. Dei hjelper henne.',kontrast_bm:'henne (same)'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett form: «vi» eller «me» i nynorsk?',setning:null,
 alternativer:['begge er normerte','berre vi','berre me','ingen av dei'],
 fasit:'begge er normerte',fasit_variant:['begge er normerte'],
 regel:'Båe formene «vi» og «me» er normerte i nynorsk. «Vi» er hovudforma, «me» er valfri.',
 eksempel:'Vi/me går på skulen. Vi/me liker fotball.',kontrast_bm:'vi (bokmål har berre vi)'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Eit refleksivt pronomen er når den som gjer noko òg er den som handlinga gjeng ut over. Kva er det refleksive pronomenet i «Han kjøpte noko til ___»?',setning:null,
 alternativer:['seg','han','ham','sin'],
 fasit:'seg',fasit_variant:['seg'],
 regel:'Refleksivt pronomen «seg» brukast når det viser tilbake til subjektet.',
 eksempel:'Ho kjøpte det til seg. Dei hjalp seg.',kontrast_bm:'seg (same)'},
{emne:'pronomen',emne_label:'Pronomen',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Refleksive pronomen: Mor er svolten. Ka skriv ein her når verbet er retta mot «ho» sjølv?',setning:'Ho lagar mat til ___ og familien sin.',
 fasit:'seg',fasit_variant:['seg'],
 regel:'«Seg» brukast refleksivt når pronomenet peikar tilbake på subjektet i same setning.',
 eksempel:'Han tørkar seg. Ho hjelper seg.',kontrast_bm:'seg (same)'},
{emne:'pronomen',emne_label:'Pronomen',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett form: «dykk» eller «deg» som objekt for «de»?',setning:null,
 alternativer:['dykk','deg','dere','dei'],
 fasit:'dykk',fasit_variant:['dykk'],
 regel:'Objektsforma av andreperson fleirtal «de» er «dykk» på nynorsk.',
 eksempel:'Eg ser dykk. Kan eg hjelpe dykk?',kontrast_bm:'dere'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett form av adjektivet «liten» framfor eit hankjønnsord?',setning:null,
 alternativer:['ein liten gut','ein lite gut','ein lita gut','ein litla gut'],
 fasit:'ein liten gut',fasit_variant:['ein liten gut'],
 regel:'Adjektivet «liten» bøyast: liten (mask.), lita (fem.), lite (nøyt.), små (fl.).',
 eksempel:'ein liten gut, ei lita jente, eit lite hus, små hus',kontrast_bm:'en liten gutt'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'lett',
 sporsmal:'Bøy adjektivet «liten» til inkjekjønn. Inkjekjønn = eit-ord (t.d. eit barn). Kva vert «liten» då?',setning:'Ho budde i eit ___ hus.',
 fasit:'lite',fasit_variant:['lite'],
 regel:'Adjektivet «liten» i inkjekjønn form er «lite»: eit lite hus.',
 eksempel:'eit lite bord, eit lite barn',kontrast_bm:'lite (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er rett form av «stor» framfor eit inkjekjønnsord? Inkjekjønn = eit-ord (t.d. eit hus, eit barn).',setning:null,
 alternativer:['stort','stor','store','stors'],
 fasit:'stort',fasit_variant:['stort'],
 regel:'Adjektiv i inkjekjønn ubestemt form eintal får -t: eit stort hus.',
 eksempel:'eit stort hus, eit godt svar, eit kaldt vatn',kontrast_bm:'stort (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'lett',
 sporsmal:'Bøy adjektivet «god» i hankjønn eintal. Hankjønn = ein-ord (t.d. ein gut, ein bil). Kva vert «god» då?',setning:'Det var ein ___ dag.',
 fasit:'god',fasit_variant:['god'],
 regel:'Adjektiv i hankjønn ubestemt form eintal får ingen ending: ein god dag.',
 eksempel:'ein god dag, ein stor gut',kontrast_bm:'god (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'multiple_choice',vanske:'medium',
 sporsmal:'Bestemt form: Kva er rett her?',setning:null,
 alternativer:['den store bilen','den stor bil','den stort bilen','den stores bil'],
 fasit:'den store bilen',fasit_variant:['den store bilen'],
 regel:'Adjektiv i bestemt form (etter den/det/dei) får alltid -e: den store, det store.',
 eksempel:'den store bilen, det store huset',kontrast_bm:'den store bilen (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'medium',
 sporsmal:'Adjektiv er ord som beskriv noko (ny, stor, grøn). Adjektiv bøyer seg etter substantivet. Skriv adjektivet «ny» i forma som passar saman med «dei bøkene» (bestemt form fleirtal).',setning:'Ho likte dei ___ bøkene.',
 fasit:'nye',fasit_variant:['nye'],
 regel:'Adjektiv i fleirtal og bestemt form får -e: dei nye bøkene.',
 eksempel:'nye bøker, dei nye bøkene',kontrast_bm:'nye (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – gradbøying',type:'multiple_choice',vanske:'medium',
 sporsmal:'Komparativ = samanlikningsform (betyr «meir»). Kva er komparativ av «god»? (God → ___?)',setning:null,
 alternativer:['betre','godare','godar','goodere'],
 fasit:'betre',fasit_variant:['betre'],
 regel:'«God» er uregelmessig i gradbøyinga: god → betre → best.',
 eksempel:'Denne kaka er betre enn den andre.',kontrast_bm:'bedre'},
{emne:'adjektiv',emne_label:'Adjektiv – gradbøying',type:'cloze',vanske:'medium',
 sporsmal:'Superlativ tyder «mest av alle» (god → betre → best). Skriv superlativ bestemt form av «god» – forma som passar med «den ___».',setning:'Dette er den ___ boka eg har lese.',
 fasit:'beste',fasit_variant:['beste'],
 regel:'Superlativ av «god» er «best» (ubest.) / «beste» (best.): den beste boka.',
 eksempel:'god → betre → best/beste',kontrast_bm:'beste (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – gradbøying',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Komparativ betyr «meir». Kva er komparativ av «lang»? (Lang → ___?)',setning:null,
 alternativer:['lengre','lenger','langare','langre'],
 fasit:'lengre',fasit_variant:['lengre'],
 regel:'«Lang» er uregelmessig: lang → lengre → lengst.',
 eksempel:'ein lengre veg, den lengste stranda',kontrast_bm:'lengre (same)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Adjektiv bøyer seg etter kjønn og tal. Hokjønn eintal tyder at substantivet er eit hokjønnsord (ei-ord) i eintal. Skriv adjektivet «grøn» i forma som passar med «ei veske».',setning:'Eg kjøpte ei ___ veske.',
 fasit:'grøn',fasit_variant:['grøn'],
 regel:'Adjektiv i hokjønn ubestemt eintal: ingen -t-ending. Ei grøn veske.',
 eksempel:'ei grøn veske, ein grøn bil, eit grønt tak',kontrast_bm:'grønn (bokmål dobbel n)'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Adjektivbøying tekstoppgåve: Fyll inn rett form av adjektiva i klammeparentesane. Adjektiv bøyast etter kjønn, tal og bestemt/ubestemt form på substantivet det skildrar.',setning:'Mor spurde om eg var [fornøyd] med den nye senga eg hadde fått. Eg svara [sjølvsagt] ja, men det var ikkje [heilt] sant. Det var ei anna seng som stod [øvarst] på ønskelista mi. Eg ville ha ei [gammal], staselig seng, ikkje ei ny seng som berre såg [gammal] ut. Dessutan var det [gal] farge på henne. Eg ønskte meg ei [grøn] seng, men denne senga var [raud]. Attpåtil var sengestolpane for [høge]. Likevel var eg [nøydd] til å bruke henne, for den [førre] senga hadde vi kasta. No var det for [seint]. Og i grunnen var eg for [trøytt] til å tenkje meir på det.',
 fasit:'fornøyd, sjølvsagt, heilt, øvarst, gammal, gammal, gal, grøn, raud, høge, nøydd, førre, seint, trøytt',fasit_variant:['fornøyd, sjølvsagt, heilt, øvarst, gammal, gammal, gal, grøn, raud, høge, nøydd, førre, seint, trøytt'],
 regel:'Adjektivbøying: Adjektiv må stemme overens med substantivet i kjønn (hankjønn «ein», hokjønn «ei», innskjønn «eit»), tal (eintal/fleirtal) og form (ubestemt/bestemt).',
 eksempel:'ein gammal bil, ei gammal hus, eit gammal barn, gamle biler',kontrast_bm:'en gammel bil, ei gammel hus (nynorsk), et gammalt barn'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Skriv inn rett form av adjektivet «liten» og «eigen». Hugs at adjektiv bøyast etter kjønn og tal på substantivet.',setning:'Ho drøymde om å ha si [eigen] hytte på fjellet. Universitetet ville berre ta opp ei [lita] gruppe studentar på kurset. De skal hente eksempel frå dykkar [eigen] samtid. Dette er ein [liten] auke jamført med i fjor. Til hausten flyttar vi inn i vårt [eige] hus. Det er framleis eit [lite] fleirtal av menn i leiinga. Vi må ta ansvar for våre [eigne] feil. Alle må følgje med på kva som hender i deira [eigen] grannelag. Dei [små] skulane har vanskeleg for å finne kvalifiserte lærarar.',
 fasit:'eigen, lita, eigen, liten, eige, lite, eigne, eigen, små',fasit_variant:['eigen, lita, eigen, liten, eige, lite, eigne, eigen, små'],
 regel:'«Liten» bøyast slik: ein liten (mask.), ei lita (fem.), eit lite (nøyt.), små (fl.). «Eigen» bøyast etter kjønn og vorm: si eigen, ei lita, vårt eige, våre eigne.',
 eksempel:'ein liten gut, ei lita jente, eit lite hus, små hus, si eigen, vårt eige hus',kontrast_bm:'en liten gutt, et lite hus'},
{emne:'adjektiv',emne_label:'Adjektiv – samsvar',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Fyll inn rett form av adjektiva «liten» og «eigen». Merka at adjektiv må stemme med substantivet i kjønn og tal.',setning:'Det er mange [små] kommunar i Noreg. Rektors tale er ein [eigen] post på programmet i dag. Dei må passe sine [eigne] saker. Det er venta ein [liten] oppgang i elevtalet neste haust. Vi må tole ei [lita] nedskjering i budsjettet.',
 fasit:'små, eigen, eigne, liten, lita',fasit_variant:['små, eigen, eigne, liten, lita'],
 regel:'Adjektivbøying: «Små» (fleirtal), «eigen» (hankjønn), «eigne» (hokjønn fleirtal), «liten» (hankjønn eintal), «lita» (hokjønn eintal).',
 eksempel:'mange små kommunar, ein eigen post, sine eigne saker, ein liten oppgang, ei lita nedskjering',kontrast_bm:'mange små kommuner, en egen post, deres egne saker'},
{emne:'ordstilling',emne_label:'Ordstilling – V2',type:'multiple_choice',vanske:'lett',
 sporsmal:'V2-regelen: I norske hovudsetningar er verbet alltid på andre plass. Viss setninga startar med noko anna enn subjektet, byt subjekt og verb plass. Kva setning er rett?',setning:null,
 alternativer:['I går gjekk han på kino.','I går han gjekk på kino.','I går han på kino gjekk.','Han gjekk i går på kino.'],
 fasit:'I går gjekk han på kino.',fasit_variant:['I går gjekk han på kino.'],
 regel:'V2-regelen: verbet skal alltid vere på andre plass i hovudsetningar. Etter eit framskutt adverbial kjem verbet FØR subjektet.',
 eksempel:'I går gjekk han. → Adverbial + verb + subjekt',kontrast_bm:'I går gikk han på kino.'},
{emne:'ordstilling',emne_label:'Ordstilling – V2',type:'drag_ord',vanske:'lett',
 sporsmal:'V2-regelen: verbet kjem alltid på andre plass. Sett orda i rett rekkjefølge.',
 hint:'«No» er på plass 1. Kva kjem på plass 2?',
 ord:['No','vi','ete','middag','skal'],
 fasit:['No','skal','vi','ete','middag'],
 regel:'Etter «No» (framskutt ledd) kjem verbet på plass 2, deretter subjektet.',
 eksempel:'No skal vi ete middag.',kontrast_bm:'Nå skal vi spise middag.'},
{emne:'ordstilling',emne_label:'Ordstilling – V2',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kvar plasserer du «ikkje» i setninga «Ho les ___ avisa»?',setning:null,
 alternativer:['Ho les ikkje avisa.','Ho ikkje les avisa.','Ikkje ho les avisa.','Ho les avisa ikkje.'],
 fasit:'Ho les ikkje avisa.',fasit_variant:['Ho les ikkje avisa.'],
 regel:'Nektingsadverbialet «ikkje» kjem etter det finitte verbet i hovudsetningar.',
 eksempel:'Ho les ikkje. Han spring ikkje.',kontrast_bm:'Hun leser ikke avisen.'},
{emne:'ordstilling',emne_label:'Ordstilling – leddsetning',type:'multiple_choice',vanske:'medium',
 sporsmal:'Ordstilling i leddsetning: Kvar høyrer «ikkje» heime? «…fordi ho ___ tid»',setning:null,
 alternativer:['…fordi ho ikkje hadde tid.','…fordi hadde ho ikkje tid.','…fordi ho hadde ikkje tid.','…fordi ikkje ho hadde tid.'],
 fasit:'…fordi ho ikkje hadde tid.',fasit_variant:['…fordi ho ikkje hadde tid.'],
 regel:'I leddsetningar kjem «ikkje» FØR det finitte verbet: …fordi ho ikkje hadde tid.',
 eksempel:'…at ho ikkje visste det. …sidan dei ikkje kom.',kontrast_bm:'…fordi hun ikke hadde tid'},
{emne:'ordstilling',emne_label:'Ordstilling – V2',type:'drag_ord',vanske:'vanskeleg',
 sporsmal:'V2 etter leddsetning: etter kommaet kjem alltid verbet. Sett orda i rett rekkjefølge.',
 hint:'Etter «Sidan eg var liten,» kjem verbet rett etterpå.',
 ord:['Sidan eg var liten,','eg','alltid','drøymt om å fly','har'],
 fasit:['Sidan eg var liten,','har','eg','alltid','drøymt om å fly'],
 regel:'V2 etter framskutt leddsetning: [leddsetning], VERB + SUBJEKT.',
 eksempel:'Sidan eg var liten, har eg alltid drøymt om å fly.',kontrast_bm:'har'},
{emne:'ordstilling',emne_label:'Ordstilling – V2',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er rett setning?',setning:null,
 alternativer:['Tidlegare budde familien i Bergen.','Tidlegare familien budde i Bergen.','Familien tidlegare budde i Bergen.','Budde familien tidlegare i Bergen.'],
 fasit:'Tidlegare budde familien i Bergen.',fasit_variant:['Tidlegare budde familien i Bergen.'],
 regel:'V2: Adverbial først → verb på plass 2 → subjekt på plass 3.',
 eksempel:'Tidlegare gjekk alle til fots.',kontrast_bm:'Tidligere bodde familien i Bergen.'},
{emne:'eigedomsord',emne_label:'Eigedomsord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Eigedomsord – kva er rett form av «min» framfor eit hokjønnsord (eit ho-ord som «jente» eller «bok»)?',
 hint:'Eigedomsord (t.d. min, mi, mitt, vår) viser kven noko tilhøyrer. Dei bøyast etter kjønn og tal på det dei skildrar.',setning:null,
 alternativer:['mi (mi bok)','min (min bok)','mitt (mitt bok)','mine (mine bok)'],
 fasit:'mi (mi bok)',fasit_variant:['mi (mi bok)'],
 regel:'Eigedomspronomen «mi» brukast med hokjønnsord: mi bok, mi søster.',
 eksempel:'mi bok, mi jakke, mi syster',kontrast_bm:'min bok (bokmål bruker ikkje mi for hokjønn)'},
{emne:'eigedomsord',emne_label:'Eigedomsord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv eigedomsordet til «eg» i hokjønn. (Eigedomsord viser kven noko tilhøyrer – «mi», «min» eller «mitt»?)',setning:'___ syster bur i Oslo.',
 fasit:'Mi',fasit_variant:['Mi','mi'],
 regel:'«Mi» er eigedomspronomenet i hokjønn eintal for «eg».',
 eksempel:'mi syster, mi bok',kontrast_bm:'Min'},
{emne:'eigedomsord',emne_label:'Eigedomsord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er rett form av eigedomsordet til «vi» i fleirtal? (Kva seier vi når vi eig fleire ting saman?)',setning:null,
 alternativer:['våre','vår','vårt','vår'],
 fasit:'våre',fasit_variant:['våre'],
 regel:'«Vår» bøyast: vår (mask./fem. eintal), vårt (nøyt. eintal), våre (fleirtal).',
 eksempel:'våre bøker, våre bilar',kontrast_bm:'våre (same)'},
{emne:'eigedomsord',emne_label:'Eigedomsord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv eigedomsordet til «vi» i inkjekjønn eintal. (Inkjekjønn = «eit»-ord, t.d. «eit hus»)',setning:'Det er ___ hus.',
 fasit:'vårt',fasit_variant:['vårt'],
 regel:'«Vårt» er forma for inkjekjønn eintal: vårt hus, vårt land.',
 eksempel:'vårt hus, vårt barn',kontrast_bm:'vårt (same)'},
{emne:'eigedomsord',emne_label:'Eigedomsord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Eigedomsord kan stå framfor eller etter substantivet. «Sin/si/sitt» brukast når eigaren er subjektet i setninga. Kva setning er rett?',setning:null,
 alternativer:['Han tok bilen sin.','Han tok sin bil.','Han tok sin bilen.','Han tok bilen hans.'],
 fasit:'Han tok bilen sin.',fasit_variant:['Han tok bilen sin.'],
 regel:'Når eigedomspronomenet viser tilbake til subjektet, brukast refleksiv form «sin/si/sitt/sine», og det står normalt etter substantivet i bestemt form.',
 eksempel:'Ho las boka si. Han henta sykkelen sin.',kontrast_bm:'Han tok bilen sin. (same)'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «ikke».',setning:'Det er ___ lov å springe inne.',
 hint:'Byrjar på «ikk-», men sluttar annleis enn på bokmål.',
 fasit:'ikkje',fasit_variant:['ikkje'],
 regel:'«Ikkje» er nynorsk for bokmål «ikke».',
 eksempel:'Eg likar ikkje regn.',kontrast_bm:'ikke'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «jeg».',setning:'___ heiter Kari.',
 hint:'Nynorsk for «jeg» er kortare og eldre.',
 fasit:'Eg',fasit_variant:['Eg','eg'],
 regel:'«Eg» er nynorsk for bokmål «jeg».',
 eksempel:'Eg går på skulen.',kontrast_bm:'jeg'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «hun».',setning:'___ er veldig flink.',
 hint:'Berre to bokstavar.',
 fasit:'Ho',fasit_variant:['Ho','ho'],
 regel:'«Ho» er nynorsk for bokmål «hun».',
 eksempel:'Ho les kvar dag.',kontrast_bm:'hun'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «hva».',setning:'___ heiter du?',
 hint:'Startar på «Kv-».',
 fasit:'Kva',fasit_variant:['Kva','kva'],
 regel:'«Kva» er nynorsk for bokmål «hva».',
 eksempel:'Kva vil du ha?',kontrast_bm:'hva'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «bare».',setning:'Det er ___ éin igjen.',
 hint:'Eit vanleg nynorsk-ord med fire bokstavar.',
 fasit:'berre',fasit_variant:['berre'],
 regel:'«Berre» er nynorsk for bokmål «bare».',
 eksempel:'Ho drikk berre vatn.',kontrast_bm:'bare'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «ikke» i setninga: «Han kjem ___ i dag.»',setning:'Han kjem ___ i dag.',
 hint:'Det same nynorskordet som tyder «ikke».',
 fasit:'ikkje',fasit_variant:['ikkje'],
 regel:'«Ikkje» er nynorsk for bokmål «ikke».',
 eksempel:'Han kjem ikkje i dag.',kontrast_bm:'ikke'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «hjem».',setning:'Ho gjekk ___.',
 hint:'Eit gamalt og vakkert nynorsk-ord.',
 fasit:'heim',fasit_variant:['heim'],
 regel:'«Heim» er nynorsk for bokmål «hjem».',
 eksempel:'Eg går heim etter skulen.',kontrast_bm:'hjem'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «skolen».',setning:'Han går på ___.',
 hint:'Nynorsk-forma av «skole» i bestemt form.',
 fasit:'skulen',fasit_variant:['skulen'],
 regel:'«Skulen» er nynorsk for bokmål «skolen». Sjå: «skule» (ubestemt).',
 eksempel:'Skulen startar kl. 8.',kontrast_bm:'skolen'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «noe».',setning:'Har du ___ å ete?',
 hint:'Lengre enn bokmål-ordet.',
 fasit:'noko',fasit_variant:['noko'],
 regel:'«Noko» er nynorsk for bokmål «noe».',
 eksempel:'Det er noko rart her.',kontrast_bm:'noe'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'lett',
 sporsmal:'Skriv nynorsk for «fra».',setning:'Ho kjem ___ Bergen.',
 hint:'Ein bokstav er lagt til samanlikna med bokmål.',
 fasit:'frå',fasit_variant:['frå'],
 regel:'«Frå» er nynorsk for bokmål «fra».',
 eksempel:'Han kjem frå Oslo.',kontrast_bm:'fra'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «bedre».',setning:'Dette er ___ enn det andre.',
 hint:'Byrjar på «b» og sluttar ulikt frå bokmål.',
 fasit:'betre',fasit_variant:['betre'],
 regel:'«Betre» er nynorsk for bokmål «bedre».',
 eksempel:'Det er betre å prøve.',kontrast_bm:'bedre'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «allerede».',setning:'Det er ___ for seint.',
 hint:'Tyder «already» – nynorsk-forma er noko annleis.',
 fasit:'allereie',fasit_variant:['allereie','alt'],
 regel:'«Allereie» (eller «alt») er nynorsk for bokmål «allerede».',
 eksempel:'Ho har allereie gått.',kontrast_bm:'allerede'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «fremdeles».',setning:'Han er ___ her.',
 hint:'To mogelege nynorsk-ord: «framleis» eller «enno».',
 fasit:'framleis',fasit_variant:['framleis','enno'],
 regel:'«Framleis» eller «enno» er nynorsk for bokmål «fremdeles».',
 eksempel:'Ho er framleis glad.',kontrast_bm:'fremdeles'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «dessuten».',setning:'Det er billeg og ___ nyttig.',
 hint:'Nynorsk-forma sluttar på -an.',
 fasit:'dessutan',fasit_variant:['dessutan'],
 regel:'«Dessutan» er nynorsk for bokmål «dessuten».',
 eksempel:'Dessutan er det gøy.',kontrast_bm:'dessuten'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «vanskelig».',setning:'Det er ___ å lære.',
 hint:'Sluttar på -eg i nynorsk.',
 fasit:'vanskeleg',fasit_variant:['vanskeleg'],
 regel:'Adjektiv med «-lig» på bokmål får «-leg» på nynorsk: «vanskeleg».',
 eksempel:'Det er vanskeleg å forstå.',kontrast_bm:'vanskelig'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «viktig».',setning:'Det er ___ å øve.',
 hint:'Denne enden på -ig på bokmål og -ig på nynorsk – same!',
 fasit:'viktig',fasit_variant:['viktig'],
 regel:'«Viktig» er likt på nynorsk og bokmål.',
 eksempel:'Det er viktig å prøve.',kontrast_bm:'viktig (same)'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «også».',setning:'Han kjem ___ på festen.',
 hint:'Nynorsk-forma er kortare og har ein gravis-aksent.',
 fasit:'òg',fasit_variant:['òg'],
 regel:'«Òg» (med gravis-aksent over ò) er nynorsk for bokmål «også».',
 eksempel:'Eg likar òg fotball.',kontrast_bm:'også'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'medium',
 sporsmal:'Skriv nynorsk for «derfor».',setning:'Ho trena mykje, ___ vann ho.',
 hint:'Nynorsk-forma er «difor» – «d» og «i» sett saman.',
 fasit:'difor',fasit_variant:['difor','derfor'],
 regel:'«Difor» er nynorsk for bokmål «derfor».',
 eksempel:'Det regnar; difor tar eg paraply.',kontrast_bm:'derfor'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Skriv nynorsk for «egentlig».',setning:'Det er ___ ein god idé.',
 hint:'Startar på «eig-» i nynorsk.',
 fasit:'eigentleg',fasit_variant:['eigentleg','eigenleg'],
 regel:'«Eigentleg» (eller «eigenleg») er nynorsk for bokmål «egentlig».',
 eksempel:'Det er eigentleg enkelt.',kontrast_bm:'egentlig'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'cloze',vanske:'vanskeleg',
 sporsmal:'Skriv nynorsk for «selvfølgelig» / «selvsagt».',setning:'Det er ___ lov.',
 hint:'Startar på «sjølv-» i nynorsk.',
 fasit:'sjølvsagt',fasit_variant:['sjølvsagt'],
 regel:'«Sjølvsagt» er nynorsk for bokmål «selvfølgelig»/«selvsagt».',
 eksempel:'Det er sjølvsagt greitt.',kontrast_bm:'selvfølgelig / selvsagt'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «gutt»?',setning:null,
 alternativer:['gut','gutt','gotte','gutten'],
 fasit:'gut',fasit_variant:['gut'],
 regel:'«Gut» er nynorsk for bokmål «gutt» (éin t).',
 eksempel:'ein gut, guten, gutar, gutane',kontrast_bm:'gutt'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «vatn» (drikkevatn)?',setning:null,
 alternativer:['vatn','vann','vannet','vatan'],
 fasit:'vatn',fasit_variant:['vatn'],
 regel:'«Vatn» er nynorsk for bokmål «vann».',
 eksempel:'Ho drikk vatn.',kontrast_bm:'vann'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «mor» i bestemt form?',setning:null,
 alternativer:['mora','moren','mori','morra'],
 fasit:'mora',fasit_variant:['mora'],
 regel:'Hokjønnsord får -a i bestemt form: mora, søstera, jenta.',
 eksempel:'Mora hans er lærar.',kontrast_bm:'moren'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «vei»?',setning:null,
 alternativer:['veg','vei','vee','veien'],
 fasit:'veg',fasit_variant:['veg'],
 regel:'«Veg» er nynorsk for bokmål «vei».',
 eksempel:'ein lang veg',kontrast_bm:'vei'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «rød»?',setning:null,
 alternativer:['raud','rød','rødt','rod'],
 fasit:'raud',fasit_variant:['raud'],
 regel:'«Raud» er nynorsk for bokmål «rød».',
 eksempel:'eit raudt hus',kontrast_bm:'rød'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «kirke»?',setning:null,
 alternativer:['kyrkje','kirke','kirsje','kirkje'],
 fasit:'kyrkje',fasit_variant:['kyrkje'],
 regel:'«Kyrkje» er nynorsk for bokmål «kirke».',
 eksempel:'gå i kyrkja',kontrast_bm:'kirke'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «melk»?',setning:null,
 alternativer:['mjølk','melk','mjøl','mjølke'],
 fasit:'mjølk',fasit_variant:['mjølk'],
 regel:'«Mjølk» er nynorsk for bokmål «melk».',
 eksempel:'Eg drikk mjølk kvar dag.',kontrast_bm:'melk'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «lørdag»?',setning:null,
 alternativer:['laurdag','lørdag','laurddag','laurrdag'],
 fasit:'laurdag',fasit_variant:['laurdag'],
 regel:'«Laurdag» er nynorsk for bokmål «lørdag».',
 eksempel:'Vi møtest på laurdag.',kontrast_bm:'lørdag'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «mandag»?',setning:null,
 alternativer:['måndag','mandag','møndag','månnddag'],
 fasit:'måndag',fasit_variant:['måndag'],
 regel:'«Måndag» er nynorsk for bokmål «mandag».',
 eksempel:'Skulen startar måndag.',kontrast_bm:'mandag'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «penger»?',setning:null,
 alternativer:['pengar','penger','pengene','pengen'],
 fasit:'pengar',fasit_variant:['pengar'],
 regel:'«Pengar» er nynorsk for bokmål «penger».',
 eksempel:'Ho har mange pengar.',kontrast_bm:'penger'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «drøm»?',setning:null,
 alternativer:['draum','drøm','drøym','dråm'],
 fasit:'draum',fasit_variant:['draum'],
 regel:'«Draum» er nynorsk for bokmål «drøm».',
 eksempel:'ein vakker draum',kontrast_bm:'drøm'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «gulv»?',setning:null,
 alternativer:['golv','gulv','golvv','gølv'],
 fasit:'golv',fasit_variant:['golv'],
 regel:'«Golv» er nynorsk for bokmål «gulv».',
 eksempel:'Boka låg på golvet.',kontrast_bm:'gulv'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «høst»?',setning:null,
 alternativer:['haust','høst','høust','hausten'],
 fasit:'haust',fasit_variant:['haust'],
 regel:'«Haust» er nynorsk for bokmål «høst».',
 eksempel:'om hausten fell lauvet',kontrast_bm:'høst'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «tro» (substantiv)?',setning:null,
 alternativer:['tru','tro','trua','trolig'],
 fasit:'tru',fasit_variant:['tru'],
 regel:'«Tru» er nynorsk for bokmål «tro» (substantiv: ei tru).',
 eksempel:'Ei sterk tru.',kontrast_bm:'tro'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «frihet»?',setning:null,
 alternativer:['fridom','frihet','frihed','frieheit'],
 fasit:'fridom',fasit_variant:['fridom'],
 regel:'«Fridom» er nynorsk for bokmål «frihet». Bokmål «-het» → nynorsk «-dom» eller «-heit».',
 eksempel:'Fridom er viktig.',kontrast_bm:'frihet'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er nynorsk for «kjærlighet»?',setning:null,
 alternativer:['kjærleik','kjærlighet','kjærleikheit','kjærdom'],
 fasit:'kjærleik',fasit_variant:['kjærleik'],
 regel:'«Kjærleik» er nynorsk for bokmål «kjærlighet».',
 eksempel:'stor kjærleik',kontrast_bm:'kjærlighet'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er nynorsk for «øyeblikk»?',setning:null,
 alternativer:['augeblink','øyeblikk','augeblikk','øyeblink'],
 fasit:'augeblink',fasit_variant:['augeblink'],
 regel:'«Augeblink» er nynorsk for bokmål «øyeblikk».',
 eksempel:'i eit augeblink',kontrast_bm:'øyeblikk'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er nynorsk for «mulighet»?',setning:null,
 alternativer:['moglegheit','mulighet','mogleheit','mogligheit'],
 fasit:'moglegheit',fasit_variant:['moglegheit'],
 regel:'«Moglegheit» er nynorsk for bokmål «mulighet». Merk: «mulig» → «mogleg».',
 eksempel:'ein stor moglegheit',kontrast_bm:'mulighet'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er nynorsk for «forskning»?',setning:null,
 alternativer:['forsking','forskning','forskninghe','forsk'],
 fasit:'forsking',fasit_variant:['forsking'],
 regel:'«Forsking» er nynorsk for bokmål «forskning» (utan «n»).',
 eksempel:'ny forsking viser at…',kontrast_bm:'forskning'},
{emne:'typiske_ord',emne_label:'Typiske ord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er nynorsk for «annerledes»?',setning:null,
 alternativer:['annleis','annerledes','anderls','anleis'],
 fasit:'annleis',fasit_variant:['annleis'],
 regel:'«Annleis» er nynorsk for bokmål «annerledes».',
 eksempel:'Det er annleis enn eg trudde.',kontrast_bm:'annerledes'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «hva»?',setning:null,
 alternativer:['kva','hva','kva for','kven'],fasit:'kva',fasit_variant:['kva'],
 regel:'«Kva» er nynorsk for bokmål «hva». Spørjeord startar på «kv-» på nynorsk.',
 eksempel:'Kva heiter du?',kontrast_bm:'hva'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «hvem»?',setning:null,
 alternativer:['kven','hvem','kva','kven for'],fasit:'kven',fasit_variant:['kven'],
 regel:'«Kven» er nynorsk for bokmål «hvem».',
 eksempel:'Kven er du?',kontrast_bm:'hvem'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «hvor»?',setning:null,
 alternativer:['kvar','kor','hvor','kvifor'],fasit:'kvar',fasit_variant:['kvar','kor'],
 regel:'«Kvar» (eller «kor») er nynorsk for bokmål «hvor». Begge er normerte.',
 eksempel:'Kvar bur du?',kontrast_bm:'hvor'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'lett',
 sporsmal:'Kva er nynorsk for «hvorfor»?',setning:null,
 alternativer:['kvifor','korfor','kvifor','hvorfor'],fasit:'kvifor',fasit_variant:['kvifor','korfor'],
 regel:'«Kvifor» (eller «korfor») er nynorsk for bokmål «hvorfor».',
 eksempel:'Kvifor kjem du ikkje?',kontrast_bm:'hvorfor'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'cloze',vanske:'lett',
 sporsmal:'Fyll inn rett spørjeord.',setning:'___ heiter du?',
 hint:'Spørjeord for namn/identitet – svar: «Eg heiter…»',
 fasit:'Kva',fasit_variant:['Kva','kva'],
 regel:'«Kva» brukast for namn og identitet: «Kva heiter du?»',
 eksempel:'Kva heiter du? – Eg heiter Kari.',kontrast_bm:'Hva'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'cloze',vanske:'lett',
 sporsmal:'Fyll inn rett spørjeord.',setning:'___ bur du?',
 hint:'Spørjeord for stad – svar: «Eg bur i…»',
 fasit:'Kvar',fasit_variant:['Kvar','kvar','Kor','kor'],
 regel:'«Kvar» (eller «kor») spør om stad.',
 eksempel:'Kvar bur du? – Eg bur i Bergen.',kontrast_bm:'Hvor'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «når» (spørjeord om tid)?',setning:null,
 alternativer:['når','nå','kva tid','kvifor'],fasit:'når',fasit_variant:['når','kva tid'],
 regel:'«Når» er likt på nynorsk og bokmål. «Kva tid» er alternativ nynorsk form.',
 eksempel:'Når kjem toget?',kontrast_bm:'når (same)'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'medium',
 sporsmal:'Kva er nynorsk for «hvordan»?',setning:null,
 alternativer:['korleis','korleis','kvifor','kvar'],fasit:'korleis',fasit_variant:['korleis'],
 regel:'«Korleis» er nynorsk for bokmål «hvordan».',
 eksempel:'Korleis har du det?',kontrast_bm:'hvordan'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'cloze',vanske:'medium',
 sporsmal:'Fyll inn rett spørjeord.',setning:'___ mange elevar er det i klassen?',
 hint:'Spørjeord for mengde/antal – svar: «Det er X elevar.»',
 fasit:'Kor',fasit_variant:['Kor','kor'],
 regel:'«Kor mange» (= «kor» + adjektiv) spør om antal.',
 eksempel:'Kor mange bøker les du?',kontrast_bm:'Hvor mange'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'cloze',vanske:'medium',
 sporsmal:'Fyll inn rett spørjeord.',setning:'___ for ein film vil du sjå?',
 hint:'«Kva for ein/ei/eit» spør om val mellom alternativ.',
 fasit:'Kva',fasit_variant:['Kva'],
 regel:'«Kva for ein/ei/eit» er nynorsk for «hvilken/hvilket». Brukas ved val mellom alternativ.',
 eksempel:'Kva for ein film vil du sjå?',kontrast_bm:'Hvilken'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva er skilnaden mellom «kva» og «kven»?',setning:null,
 alternativer:['«Kva» spør om ting/identitet; «kven» spør om personar','«Kva» er bokmål; «kven» er nynorsk','Dei tyder det same','«Kven» spør om ting; «kva» spør om personar'],
 fasit:'«Kva» spør om ting/identitet; «kven» spør om personar',fasit_variant:['«Kva» spør om ting/identitet; «kven» spør om personar'],
 regel:'«Kven» = person (hvem). «Kva» = ting eller eigenskap (hva). «Kven er det?» vs. «Kva er det?»',
 eksempel:'Kven er rektoren? – Kva er ein rektor?',kontrast_bm:'hvem vs. hva'},
{emne:'spørjeord',emne_label:'Spørjeord',type:'multiple_choice',vanske:'vanskeleg',
 sporsmal:'Kva spørjeord passar: «___ tid kjem toget?»',setning:null,
 alternativer:['Kva','Kven','Kor','Korleis'],fasit:'Kva',fasit_variant:['Kva'],
 regel:'«Kva tid» spør om tidspunkt. «Kva» er spørjeordet her.',
 eksempel:'Kva tid kjem toget? = Når kjem toget?',kontrast_bm:'Når (hva tid)'}
];

/* ══════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════ */
const GS = { tasks:[], idx:0, score:0, answered:false, config:{}, streak:0, history:[] };

/* ══════════════════════════════════════════════════════
   CATEGORY GROUPS (v2-style)
══════════════════════════════════════════════════════ */
var NN_CAT_GROUPS = [
  { name: 'Bøying og ordklasse', cats: ['substantiv','pronomen','adjektiv','eigedomsord'] },
  { name: 'Verb',                cats: ['verb'] },
  { name: 'Setningslære',        cats: ['ordstilling'] },
  { name: 'Nynorsk ordforråd',   cats: ['spørjeord','typiske_ord'] }
];

function nnBuildCatButtons() {
  var wrap = document.getElementById('nn-cats');
  if (!wrap || wrap.querySelector('.adp-cat')) return;

  /* Build label map from BANK */
  var labelMap = {};
  BANK.forEach(function(t) {
    if (t.emne && !labelMap[t.emne]) {
      var lbl = t.emne_label || t.emne;
      /* Strip sub-labels like "Substantiv – bøying" → "Substantiv" */
      labelMap[t.emne] = lbl.split(/\s+[\u2013\u2014–—-]\s+/)[0];
    }
  });

  /* Override with nicer labels */
  var niceLabels = {
    substantiv:  'Substantiv',
    verb:        'Verb',
    pronomen:    'Pronomen',
    adjektiv:    'Adjektiv',
    ordstilling: 'Ordstilling',
    eigedomsord: 'Eigedomsord',
    'spørjeord': 'Spørjeord',
    typiske_ord: 'Typiske ord'
  };

  NN_CAT_GROUPS.forEach(function(grp) {
    var gDiv = document.createElement('div');
    gDiv.className = 'adp-cat-group';

    var title = document.createElement('h4');
    title.className = 'adp-cat-group-title';
    title.textContent = grp.name;
    gDiv.appendChild(title);

    var list = document.createElement('div');
    list.className = 'adp-cat-group-list';

    grp.cats.forEach(function(catId) {
      /* Only show cats that exist in BANK */
      var exists = BANK.some(function(t) { return t.emne === catId; });
      if (!exists) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'adp-cat on';
      btn.dataset.cat = catId;
      btn.textContent = niceLabels[catId] || labelMap[catId] || catId;
      btn.addEventListener('click', function() { btn.classList.toggle('on'); });
      list.appendChild(btn);
    });

    if (list.children.length) {
      gDiv.appendChild(list);
      wrap.appendChild(gDiv);
    }
  });

  /* Wire clear / select-all */
  var clearBtn = document.getElementById('nn-cats-clear');
  var allBtn   = document.getElementById('nn-cats-all');
  if (clearBtn) clearBtn.addEventListener('click', function() {
    wrap.querySelectorAll('.adp-cat').forEach(function(b) { b.classList.remove('on'); });
  });
  if (allBtn) allBtn.addEventListener('click', function() {
    wrap.querySelectorAll('.adp-cat').forEach(function(b) { b.classList.add('on'); });
  });
}

function nnGetSelectedCats() {
  var wrap = document.getElementById('nn-cats');
  if (!wrap) return [];
  var btns = wrap.querySelectorAll('.adp-cat.on');
  var cats = [];
  btns.forEach(function(b) { cats.push(b.dataset.cat); });
  return cats;
}

/* ══════════════════════════════════════════════════════
   GAMIFICATION – XP, LEVELS, PROFILE
══════════════════════════════════════════════════════ */
var NN_XP_LEVELS = [
  { name: 'Ordlærling',         xp: 0,    icon: '\uD83C\uDF31' },
  { name: 'Setningssmed',       xp: 80,   icon: '\uD83D\uDD28' },
  { name: 'Tekstbyggjar',       xp: 250,  icon: '\uD83C\uDFD7' },
  { name: 'Grammatikksnekkar',  xp: 500,  icon: '\u2699\uFE0F' },
  { name: 'Språkmeister',       xp: 900,  icon: '\uD83C\uDFC6' },
  { name: 'Norskmeistar',       xp: 1500, icon: '\uD83D\uDC51' }
];

var NN_PROFILE_KEY = 'norsklaben-nynorsklab-profile-v1';

function nnTodayKey() {
  var d = new Date();
  return String(d.getFullYear()) + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function nnPrevDayKey(dateKey) {
  var d = new Date(dateKey + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() - 1);
  return String(d.getFullYear()) + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function nnDefaultProfile() {
  return { xp: 0, sessions: 0, streak: 0, lastPlayedDay: '', bestPct: 0 };
}

function nnLoadProfile() {
  var base = nnDefaultProfile();
  try {
    if (!window.localStorage) return base;
    var raw = window.localStorage.getItem(NN_PROFILE_KEY);
    if (!raw) return base;
    var p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return base;
    return {
      xp: Math.max(0, Number(p.xp) || 0),
      sessions: Math.max(0, Number(p.sessions) || 0),
      streak: Math.max(0, Number(p.streak) || 0),
      lastPlayedDay: String(p.lastPlayedDay || ''),
      bestPct: Math.max(0, Math.min(100, Number(p.bestPct) || 0))
    };
  } catch (e) { return base; }
}

function nnSaveProfile(profile) {
  try {
    if (!window.localStorage) return;
    window.localStorage.setItem(NN_PROFILE_KEY, JSON.stringify(profile || nnDefaultProfile()));
  } catch (e) {}
}

function nnXpLevel(totalXP) {
  var lvl = NN_XP_LEVELS[0];
  for (var i = NN_XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= NN_XP_LEVELS[i].xp) { lvl = NN_XP_LEVELS[i]; break; }
  }
  var next = null;
  var idx = NN_XP_LEVELS.indexOf(lvl);
  if (idx < NN_XP_LEVELS.length - 1) next = NN_XP_LEVELS[idx + 1];
  return { current: lvl, next: next, index: idx };
}

function nnRenderCockpit(profile) {
  var p = profile || nnLoadProfile();
  var info = nnXpLevel(p.xp);
  var lvl = info.current;
  var next = info.next;

  var iconEl = document.getElementById('nn-prof-level-icon');
  var nameEl = document.getElementById('nn-prof-level-name');
  var levelEl = document.getElementById('nn-prof-level');
  var xpEl = document.getElementById('nn-prof-xp');
  var nextEl = document.getElementById('nn-prof-next');
  var streakEl = document.getElementById('nn-prof-streak');
  var fillEl = document.getElementById('nn-prof-progress-fill');
  var textEl = document.getElementById('nn-prof-progress-text');

  if (iconEl) iconEl.textContent = lvl.icon;
  if (nameEl) nameEl.textContent = lvl.name;
  if (levelEl) levelEl.textContent = String(info.index + 1);
  if (xpEl) xpEl.textContent = String(p.xp);
  if (streakEl) streakEl.textContent = String(p.streak) + (p.streak === 1 ? ' dag' : ' dagar');

  if (next) {
    var range = next.xp - lvl.xp;
    var progress = p.xp - lvl.xp;
    var pct = range > 0 ? Math.min(100, Math.round((progress / range) * 100)) : 100;
    if (fillEl) fillEl.style.width = pct + '%';
    if (textEl) textEl.textContent = progress + ' / ' + range + ' XP';
    if (nextEl) nextEl.textContent = (next.xp - p.xp) + ' XP';
  } else {
    if (fillEl) fillEl.style.width = '100%';
    if (textEl) textEl.textContent = 'Maks nivå!';
    if (nextEl) nextEl.textContent = 'Maks!';
  }
}

function nnAwardXp(totalCorrect, totalTasks, pct) {
  var profile = nnLoadProfile();
  var prevLevel = nnXpLevel(profile.xp).index;

  var base = Math.max(0, totalCorrect) * 10;
  var masteryBonus = pct >= 90 ? 40 : (pct >= 75 ? 25 : (pct >= 60 ? 10 : 0));
  var perfectBonus = (totalTasks > 0 && totalCorrect === totalTasks) ? 30 : 0;
  var streakBonus = Math.min(7, profile.streak || 0) * 3;
  var gain = base + masteryBonus + perfectBonus + streakBonus;

  var today = nnTodayKey();
  var prevDay = nnPrevDayKey(today);
  if (profile.lastPlayedDay === today) {
    /* same-day: keep streak */
  } else if (profile.lastPlayedDay === prevDay) {
    profile.streak = (profile.streak || 0) + 1;
  } else {
    profile.streak = 1;
  }

  profile.xp = Math.max(0, (profile.xp || 0) + gain);
  profile.sessions = (profile.sessions || 0) + 1;
  profile.lastPlayedDay = today;
  profile.bestPct = Math.max(profile.bestPct || 0, pct || 0);

  nnSaveProfile(profile);
  nnRenderCockpit(profile);

  var newLevel = nnXpLevel(profile.xp).index;
  if (newLevel > prevLevel) nnConfetti();

  return gain;
}

function nnConfetti() {
  var cockpit = document.getElementById('nn-gamify');
  if (!cockpit) return;
  for (var i = 0; i < 30; i++) {
    var s = document.createElement('span');
    s.className = 'adp-confetti';
    s.textContent = ['🎉','✨','⭐','🏆','🎊'][i % 5];
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 0.5 + 's';
    cockpit.appendChild(s);
    setTimeout(function(el){ try { el.remove(); } catch(e){} }, 2200, s);
  }
}

/* Initialise cockpit + category buttons on page load */
document.addEventListener('DOMContentLoaded', function() {
  nnRenderCockpit();
  nnBuildCatButtons();
});



/* ══════════════════════════════════════════════════════
   START
══════════════════════════════════════════════════════ */
function gramStart(){
  const selectedCats = nnGetSelectedCats();
  const type   = $('gc-type').value;
  const antal  = Math.min(15, Math.max(3, parseInt($('gc-antal').value)||8));
  const vanske = $('gc-vanske').value;

  GS.config = {
    emne: selectedCats.length ? 'val' : 'blanda',
    type, antal, vanske,
    kontrast: $('gc-kontrast').value==='true',
  };
  GS.tasks=[]; GS.idx=0; GS.score=0; GS.answered=false; GS.streak=0; GS.history=[];

  /* Filter bank by selected categories */
  let pool = selectedCats.length
    ? BANK.filter(t => selectedCats.indexOf(t.emne) !== -1)
    : [...BANK];

  /* Filter by type */
  if(type!=='blanda') pool = pool.filter(t=>t.type===type);

  /* Filter by vanske if not adaptive */
  if(vanske!=='adaptiv') pool = pool.filter(t=>t.vanske===vanske);

  /* Shuffle and pick */
  pool = shuffle(pool).slice(0, antal);

  /* If adaptive, sort: lett first, then medium, then vanskeleg */
  if(vanske==='adaptiv'){
    const order={lett:0,medium:1,vanskeleg:2};
    pool.sort((a,b)=>order[a.vanske]-order[b.vanske]);
  }

  if(pool.length===0){
    alert('Ingen oppgåver passar desse vala. Prøv eit anna emne eller oppgåvetype.');
    return;
  }

  GS.tasks = pool;

  $('gram-start-btn').disabled=true;
  if($('gram-reset-btn')) $('gram-reset-btn').disabled=false;
  $('gram-quiz-area').classList.add('active');
  $('gram-summary').classList.remove('show');
  $('gram-task-wrap').innerHTML='';
  $('gram-progress-wrap').style.display='flex';
  $('gram-score-badge').style.display='inline-flex';
  $('gram-score-txt').textContent='0';
  updateProgress();
  renderTask();
}

function gramReset(){
  GS.tasks=[];
  GS.idx=0;
  GS.score=0;
  GS.answered=false;
  GS.streak=0;
  GS.history=[];

  $('gram-start-btn').disabled=false;
  if($('gram-reset-btn')) $('gram-reset-btn').disabled=true;
  $('gram-quiz-area').classList.remove('active');
  $('gram-summary').classList.remove('show');
  $('gram-task-wrap').innerHTML='';
  $('gram-progress-wrap').style.display='none';
  $('gram-score-badge').style.display='none';
  if($('gram-score-txt')) $('gram-score-txt').textContent='0';
  if($('gram-progress-fill')) $('gram-progress-fill').style.width='0%';
  if($('gram-progress-label')) $('gram-progress-label').textContent='0 / 0';
}

/* ══════════════════════════════════════════════════════
   RENDER TASK
══════════════════════════════════════════════════════ */
function renderTask(){
  GS.answered=false;
  const t=GS.tasks[GS.idx];
  if(!t){showSummary();return;}

  const vanskeCls={lett:'vanske-lett',medium:'vanske-medium',vanskeleg:'vanske-vanskeleg'}[t.vanske]||'vanske-lett';
  const vanskeLabel={lett:'Lett',medium:'Medium',vanskeleg:'Vanskeleg'}[t.vanske]||'Lett';

  /* Question HTML */
  let questionHTML='';
  if(t.type==='cloze'&&t.setning){
    let setningTxt=String(t.setning||'');
    if(setningTxt.indexOf('___')!==-1){
      const firstIx=setningTxt.indexOf('___');
      const before=setningTxt.substring(0,firstIx);
      const after=setningTxt.substring(firstIx+3).replace(/___/g,'');
      setningTxt=before+' ___ '+after;
    }else{
      setningTxt=setningTxt+' ___';
    }
    const parts=setningTxt.split('___');
    // Vis instruksjon (sporsmal) over sjølve setninga
    questionHTML=`<p class="gram-task-instr">${escH(t.sporsmal)}</p>`;
    questionHTML+=`<p class="gram-task-q">`;
    questionHTML+=escH(parts[0]||'');
    questionHTML+=`<input type="text" class="gram-blank" id="gram-blank-0" placeholder="…" autocomplete="off" autocorrect="off" spellcheck="false" onkeydown="if(event.key==='Enter')gramCheck()">`;
    questionHTML+=escH(parts.slice(1).join('')||'');
    questionHTML+=`</p>`;
  } else {
    questionHTML=`<p class="gram-task-q">${escH(t.sporsmal)}</p>`;
  }

  /* Input HTML */
  let inputHTML='';
  if(t.type==='drag_ord'&&t.ord&&t.ord.length){
    const shuffled=shuffle([...t.ord]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink3);margin-bottom:6px">Trykk på orda i rett rekkjefølgje:</div>
      <div class="drag-tokens" id="go-bank" style="min-height:40px;margin-bottom:10px">${shuffled.map(w=>`<div class="drag-token" draggable="true" ondragstart="dragStart(event,'${w.replace(/'/g,'&#39;')}')" ondragend="dragEnd(event)" onclick="goTapAdd(this)" id="got-${encodeURIComponent(w)}" data-word="${w.replace(/'/g,'&#39;')}" style="cursor:pointer">${w}</div>`).join('')}</div>
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink3);margin-bottom:6px">Setninga di (trykk eit ord for å fjerne det):</div>
      <div id="go-slots" style="display:flex;flex-wrap:wrap;gap:6px;min-height:40px;background:#f0f4ff;border:1px dashed #93b4f8;border-radius:10px;padding:8px 10px" ondragover="allowDrop(event)" ondrop="goDropSlot(event)"></div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="gram-btn primary" onclick="goCheck()">Sjekk svar</button>
        <button class="gram-btn" onclick="goReset()">Start på nytt</button>
      </div>
    </div>`;
  } else if(t.type==='multiple_choice'&&t.alternativer&&t.alternativer.length){
    /* Shuffle alternatives */
    const alts=shuffle(t.alternativer);
    inputHTML=`<div class="gram-choices" id="gram-choices">`;
    alts.forEach((alt,i)=>{
      inputHTML+=`<button class="gram-choice-btn" data-val="${escH(alt)}" onclick="gramChoose(this)">${escH(alt)}</button>`;
    });
    inputHTML+=`</div>`;
  } else if(t.type==='cloze' && t.setning){
    inputHTML=`<div id="gram-actions-cloze"><button class="gram-btn primary" onclick="gramCheck()">Sjekk svar</button></div>`;
  } else if(t.type==='cloze'){
    inputHTML=`<div style="margin-top:0.6rem">
      <input type="text" class="gram-blank" id="gram-blank-0" placeholder="Skriv svar her…" autocomplete="off" autocorrect="off" spellcheck="false" onkeydown="if(event.key==='Enter')gramCheck()">
      <div id="gram-actions-cloze" style="margin-top:0.55rem"><button class="gram-btn primary" onclick="gramCheck()">Sjekk svar</button></div>
    </div>`;
  }

  $('gram-task-wrap').innerHTML=`
    <div class="gram-task-card">
      <div class="gram-task-meta">
        <span class="gram-badge emne">${escH(t.emne_label||t.emne)}</span>
        <span class="gram-badge ${vanskeCls}">${vanskeLabel}</span>
      </div>
      ${questionHTML}
      ${inputHTML}
      <div class="gram-feedback" id="gram-feedback"></div>
    </div>
    <div class="gram-actions" id="gram-main-actions" style="display:none">
      <button class="gram-btn primary" onclick="gramNext()">
        ${GS.idx+1<GS.tasks.length?'Neste oppgåve \u2192':'Sjå resultat \u2192'}
      </button>
    </div>`;

  if(t.type==='cloze') setTimeout(()=>{const el=$('gram-blank-0');if(el)el.focus();},80);
}

/* ══════════════════════════════════════════════════════
   ANSWER HANDLERS
══════════════════════════════════════════════════════ */
function gramChoose(btn){
  if(GS.answered)return;
  GS.answered=true;
  const t=GS.tasks[GS.idx];
  const chosen=btn.getAttribute('data-val');
  const correct=isCorrect(chosen,t);

  document.querySelectorAll('.gram-choice-btn').forEach(b=>{
    b.disabled=true;
    const v=b.getAttribute('data-val');
    if(v===chosen) b.classList.add(correct?'correct':'wrong');
    if(!correct&&isCorrect(v,t)) b.classList.add('correct');
  });

  finishAnswer(correct,chosen,t);
}

function gramCheck(){
  if(GS.answered)return;
  const t=GS.tasks[GS.idx];
  const blankEl=$('gram-blank-0');
  if(!blankEl)return;
  const chosen=blankEl.value.trim();
  if(!chosen){blankEl.focus();return;}
  GS.answered=true;

  const correct=isCorrect(chosen,t);
  blankEl.classList.add(correct?'correct':'wrong');
  blankEl.disabled=true;
  const ca=$('gram-actions-cloze');
  if(ca)ca.style.display='none';
  finishAnswer(correct,chosen,t);
}

function isCorrect(val,t){
  const n=s=>repairMojibakeText(String(s||'')).trim().toLowerCase();
  const variants=Array.isArray(t.fasit_variant)&&t.fasit_variant.length?t.fasit_variant:[t.fasit];
  return variants.some(v=>n(v)===n(val));
}

function finishAnswer(correct,chosen,t){
  if(correct){GS.score++;GS.streak++;}else{GS.streak=0;}
  $('gram-score-txt').textContent=GS.score;
  GS.history.push({ sporsmal:t.sporsmal, setning:t.setning||null, fasit:t.fasit, chosen, correct, emne_label:t.emne_label, vanske:t.vanske });

  const fb=$('gram-feedback');
  fb.className='gram-feedback show '+(correct?'correct-fb':'wrong-fb');

  let html=`<div class="fb-heading">${correct?'Rett!':'Feil'}</div>`;
  if(!correct) html+=`<div>Rett svar: <strong>${escH(t.fasit)}</strong></div>`;
  if(t.regel) html+=`<div class="fb-regel"><strong>Regel:</strong> ${escH(t.regel)}</div>`;
  if(t.eksempel) html+=`<div class="fb-regel"><em>Eks.: ${escH(t.eksempel)}</em></div>`;
  if(t.kontrast_bm&&GS.config.kontrast)
    html+=`<div class="fb-kontrast">Bokmål: "${escH(t.kontrast_bm)}" \u2192 Nynorsk: "${escH(t.fasit)}"</div>`;
  fb.innerHTML=html;

  $('gram-main-actions').style.display='flex';
}


/* ── Drag-ord (ordstilling) ─────────────────── */
let _goPlaced = [];

function goTapAdd(el) {
  if (!el || el.classList.contains('used')) return;
  var w = el.dataset.word || el.textContent.trim();
  _goPlaced.push(w);
  el.classList.add('used');
  goRenderSlots();
}

function goDropSlot(e){
  e.preventDefault();
  if(!_dragWord) return;
  _goPlaced.push(_dragWord);
  const tok = document.getElementById('got-' + encodeURIComponent(_dragWord));
  if(tok) tok.classList.add('used');
  goRenderSlots();
  _dragWord=''; _dragTokenId='';
}

function goRenderSlots(){
  const sl = document.getElementById('go-slots');
  if(!sl) return;
  sl.innerHTML = _goPlaced.map((w,i)=>
    `<div class="drag-token" style="cursor:pointer" onclick="goRemove(${i})" title="Trykk for å fjerne">${w} ✕</div>`
  ).join('');
}

function goRemove(i){
  const w = _goPlaced[i];
  _goPlaced.splice(i,1);
  const tok = document.getElementById('got-' + encodeURIComponent(w));
  if(tok) tok.classList.remove('used');
  goRenderSlots();
}

function goReset(){
  _goPlaced = [];
  document.querySelectorAll('.drag-token.used').forEach(t=>t.classList.remove('used'));
  goRenderSlots();
}

function goCheck(){
  const t = GS.tasks[GS.idx];
  if(!t||!t.fasit) return;
  if(_goPlaced.length === 0){ alert('Bygg setninga ved å dra orda ned.'); return; }
  const placed = _goPlaced.join(' ');
  const correct = placed === t.fasit.join(' ');
  goReset();
  finishAnswer(correct, placed, t);
}
function gramNext(){
  GS.idx++;
  updateProgress();
  if(GS.idx>=GS.tasks.length){showSummary();return;}
  renderTask();
}

/* ══════════════════════════════════════════════════════
   PROGRESS & SUMMARY
══════════════════════════════════════════════════════ */
function updateProgress(){
  const total=GS.tasks.length;
  const pct=total>0?Math.round((GS.idx/total)*100):0;
  const fill=$('gram-progress-fill');
  const label=$('gram-progress-label');
  if(fill)fill.style.width=pct+'%';
  if(label)label.textContent=`${GS.idx} / ${total}`;
}

function gramMasteryData(pct){
  if(pct>=90)return{medal:'🏆',heading:'Meisterleg!',comment:'Framifrå arbeid. Du viser særs god nynorsk meistring.'};
  if(pct>=75)return{medal:'🥇',heading:'Svært godt!',comment:'Solid økt. Du har god kontroll på det meste.'};
  if(pct>=60)return{medal:'🥈',heading:'God framgang!',comment:'Bra jobba. Litt meir øving vil løfte deg vidare.'};
  if(pct>=40)return{medal:'🥉',heading:'På rett veg',comment:'Du er i gang. Fokuser på dei vanlegaste feila og prøv igjen.'};
  return{medal:'📘',heading:'Nytt forsøk',comment:'God start. Øving steg for steg gir rask framgang.'};
}

function showSummary(){
  $('gram-task-wrap').innerHTML='';
  $('gram-progress-wrap').style.display='none';
  $('gram-score-badge').style.display='none';

  const total=GS.tasks.length;
  const pct=total>0?Math.round((GS.score/total)*100):0;
  const mastery=gramMasteryData(pct);
  const circumference=2*Math.PI*42;

  const medalEl=$('gram-sum-medal');
  const headingEl=$('gram-sum-heading');
  const ringEl=$('gram-sum-ring');

  if(medalEl)medalEl.textContent=mastery.medal;
  if(headingEl)headingEl.textContent=mastery.heading;
  if(ringEl){
    ringEl.style.strokeDashoffset=String(circumference);
    setTimeout(function(){
      const offset=circumference-(circumference*pct/100);
      ringEl.style.strokeDashoffset=String(offset);
    },80);
  }

  $('sum-score-txt').textContent=`${GS.score}/${total}`;
  $('sum-rett').textContent=GS.score;
  $('sum-feil').textContent=total-GS.score;
  $('sum-pct').textContent=pct+'%';
  $('sum-msg').textContent=mastery.comment;

  /* Award XP */
  var xpGain = nnAwardXp(GS.score, total, pct);
  var xpGainEl = $('sum-xp-gain');
  if (xpGainEl) xpGainEl.textContent = '+' + xpGain;

  const byTopic={};
  GS.history.forEach(function(h){
    const raw=h.emne_label||'Blanda';
    const k=raw.split(' \u2013 ')[0].split(' – ')[0];
    if(!byTopic[k])byTopic[k]={ok:0,fail:0};
    if(h.correct)byTopic[k].ok++; else byTopic[k].fail++;
  });

  const strengthsEl=$('sum-strengths');
  if(strengthsEl){
    const strengths=Object.keys(byTopic).filter(function(k){
      const t=byTopic[k],n=t.ok+t.fail;
      return n>0 && Math.round((t.ok/n)*100)>=75;
    }).sort(function(a,b){
      const pa=byTopic[a],pb=byTopic[b];
      const pctA=Math.round((pa.ok/(pa.ok+pa.fail))*100);
      const pctB=Math.round((pb.ok/(pb.ok+pb.fail))*100);
      return pctB-pctA;
    }).slice(0,3);

    const weak=Object.keys(byTopic).filter(function(k){
      const t=byTopic[k],n=t.ok+t.fail;
      return n>0 && Math.round((t.ok/n)*100)<75;
    }).sort(function(a,b){
      const pa=byTopic[a],pb=byTopic[b];
      const pctA=Math.round((pa.ok/(pa.ok+pa.fail))*100);
      const pctB=Math.round((pb.ok/(pb.ok+pb.fail))*100);
      return pctA-pctB;
    }).slice(0,2);

    var summaryHtml='';
    if(strengths.length){
      summaryHtml+='<h5>Dette fekk du til</h5>';
      strengths.forEach(function(k){
        const t=byTopic[k],n=t.ok+t.fail,p=Math.round((t.ok/n)*100);
        summaryHtml+='<div class="adp-summary-row ok"><strong>'+escH(k)+'</strong><span>'+p+'% treff</span></div>';
      });
    }
    if(weak.length){
      summaryHtml+='<h5>Øv meir på</h5>';
      weak.forEach(function(k){
        const t=byTopic[k],n=t.ok+t.fail,p=Math.round((t.ok/n)*100);
        summaryHtml+='<div class="adp-summary-row"><strong>'+escH(k)+'</strong><span>'+p+'% treff</span></div>';
      });
    }
    if(summaryHtml){
      strengthsEl.innerHTML=summaryHtml;
      strengthsEl.style.display='';
    } else {
      strengthsEl.innerHTML='';
      strengthsEl.style.display='none';
    }
  }

  const corrEl=$('sum-corrections');
  if(corrEl){
    const withErrors=Object.keys(byTopic).filter(function(k){ return byTopic[k].fail>0; });
    if(!withErrors.length){
      corrEl.innerHTML='<div class="adp-summary-row ok"><strong>Null feil!</strong><span>Du svara rett på alle oppgåvene.</span></div>';
    }else{
      let html='<h5>Øv på desse igjen</h5>';
      withErrors.forEach(function(k){
        html+='<div class="adp-summary-row"><strong>'+escH(k)+'</strong><span>'+byTopic[k].fail+' feil</span></div>';
      });
      corrEl.innerHTML=html;
    }
  }

  $('gram-summary').classList.add('show');
  $('gram-start-btn').disabled=false;
}

/* ══════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════ */
function escH(s){
  if(!s)return'';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

