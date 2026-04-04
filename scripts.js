(function() {
    var cur = 0, total = 9;
    var startX = 0;

    function render() {
      document.querySelectorAll('.nov-slide').forEach(function(s) {
        s.style.display = parseInt(s.dataset.idx) === cur ? 'block' : 'none';
      });
      document.getElementById('nov-count').textContent = 'Oppgåve ' + (cur + 1) + ' av ' + total;
      // Dots
      var dots = document.getElementById('nov-dots');
      dots.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var d = document.createElement('div');
        d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + (i === cur ? 'var(--c5)' : 'var(--line)') + ';transition:background 0.2s;cursor:pointer';
        d.dataset.i = i;
        d.onclick = function() { cur = parseInt(this.dataset.i); render(); };
        dots.appendChild(d);
      }
      document.getElementById('nov-prev').style.opacity = cur === 0 ? '0.35' : '1';
      document.getElementById('nov-next').style.opacity = cur === total - 1 ? '0.35' : '1';
      if(cur === 7 && typeof novKmInit === 'function') { setTimeout(novKmInit, 80); }
    }

    window.novNav = function(dir) {
      cur = Math.max(0, Math.min(total - 1, cur + dir));
      render();
      // Init krim-slide når ho vert synleg
      if(cur === 7) { setTimeout(novKmInit, 50); }
    };

    // Sveip touch
    var slides = document.getElementById('novelle-karussel');
    if (slides) {
      slides.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
      slides.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) novNav(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    function fsToggle(target) {
      if (!target) return;
      if (document.fullscreenElement === target) {
        document.exitFullscreen();
        return;
      }
      if (document.fullscreenElement && document.fullscreenElement !== target) {
        document.exitFullscreen().then(function() {
          target.requestFullscreen();
        });
        return;
      }
      target.requestFullscreen();
    }

    function initNovelleFullscreen() {
      var carousel = document.getElementById('novelle-karussel');
      if (!carousel || document.getElementById('nov-fs-btn')) return;

      function calcZoom() {
        var baseW = 1280;
        var baseH = 800;
        var z = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
        return Math.max(0.95, Math.min(1.65, z));
      }

      function applyZoom() {
        var activeCard = document.querySelector('.nov-slide[style*="display:block"] .card');
        document.querySelectorAll('#nov-slides .nov-slide .card').forEach(function(card) {
          card.style.zoom = '';
        });
        if (document.fullscreenElement === carousel && activeCard) {
          activeCard.style.zoom = calcZoom().toFixed(2);
        }
      }

      function mountButton() {
        var activeCard = document.querySelector('.nov-slide[style*="display:block"] .card');
        if (!activeCard) return;
        if (getComputedStyle(activeCard).position === 'static') {
          activeCard.style.position = 'relative';
        }
        if (btn.parentElement !== activeCard) {
          activeCard.appendChild(btn);
        }
      }

      var btn = document.createElement('button');
      btn.id = 'nov-fs-btn';
      btn.className = 'fs-btn fs-btn-card';
      btn.type = 'button';
      btn.textContent = '⛶ Fullskjerm';
      btn.setAttribute('aria-label', 'Vis novelle-karusell i fullskjerm');
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fsToggle(carousel);
      });
      mountButton();

      document.addEventListener('fullscreenchange', function() {
        btn.textContent = document.fullscreenElement === carousel ? '✕ Lukk fullskjerm' : '⛶ Fullskjerm';
        mountButton();
        applyZoom();
      });

      window.addEventListener('resize', applyZoom);

      var prevRender = render;
      render = function() {
        prevRender();
        mountButton();
        applyZoom();
      };
    }

    render();
    initNovelleFullscreen();
  
/* ── Krimnovelle klikk-og-marker ── */
const NOV_KM_SETNINGAR = [
  {
    txt: 'Regnet låg som nåler i lufta då Emilie drog opp glidelåsen på den våte jakka og sprang over den tomme skulegarden.',
    tags: ['miljo', 'spenning', 'utvida'],
    ord: { nåler: ['symbol'], våte: ['adjektiv'], tomme: ['adjektiv'] }
  },
  {
    txt: 'Lyset frå gymnastikksalen blinka tre gonger, som om bygget prøvde å varsle henne om at nokon allereie var inne.',
    tags: ['miljo', 'frampeik', 'spenning'],
    ord: { blinka: ['spenning'], varsle: ['frampeik'] }
  },
  {
    txt: 'I gangen stod den gamle pokalen frå 1978, og det skeive spegelbiletet hennar i metallet fekk henne til å sjå dobbelt så liten ut.',
    tags: ['miljo', 'symbol', 'utvida'],
    ord: { gamle: ['adjektiv'], skeive: ['adjektiv'], pokalen: ['symbol'] }
  },
  {
    txt: 'Telefonen vibrerte, og på skjermen stod det berre: Eg veit kva du gøymde i skap 14.',
    tags: ['frampeik', 'konflikt', 'spenning'],
    ord: { vibrerte: ['spenning'], gøymde: ['konflikt'] }
  },
  {
    txt: 'Ho visste at nøkkelen låg i penalhuset til Nora, men viss ho henta han no, ville bestevenninna bli skulda for noko ho ikkje hadde gjort.',
    tags: ['konflikt', 'utvida'],
    ord: { bestevenninna: ['symbol'] }
  },
  {
    txt: 'Emilie stod heilt stille, høyrde dråpane treffe takrenna ein etter ein, og kjende korleis kvart sekund strekte seg som tyggegummi.',
    tags: ['utvida', 'spenning'],
    ord: { stille: ['adjektiv'], strekte: ['utvida'] }
  },
  {
    txt: 'Då døra til lagerrommet gjekk opp av seg sjølv, såg ho raudmåla tal på veggen: 14, 14, 14.',
    tags: ['spenning', 'symbol', 'vendepunkt'],
    ord: { raudmåla: ['adjektiv'], tal: ['symbol'] }
  },
  {
    txt: 'Bak hylla stod rektor med mobilen hennar i handa, og han sa lågt at meldinga ikkje var ein spøk, men eit val: snakk no, eller lat Nora ta skulda åleine.',
    tags: ['konflikt', 'vendepunkt', 'spenning'],
    ord: { val: ['vendepunkt'] }
  },
  {
    txt: 'I det same Emilie opna munnen, slokna lyset i heile bygget, og stillheita vart så tung at ho høyrde sitt eige hjarte slå mot ribbeina.',
    tags: ['spenning', 'utvida', 'vendepunkt'],
    ord: { stillheita: ['symbol'], tung: ['adjektiv'] }
  }
];

function novKmByggTekst(){
  const tokens = [];
  NOV_KM_SETNINGAR.forEach(function(s, sIdx){
    s.txt.split(/\s+/).forEach(function(w){
      const clean = w.toLowerCase().replace(/^[^a-zA-ZæøåÆØÅ0-9]+|[^a-zA-ZæøåÆØÅ0-9]+$/g, '');
      const ordTags = (s.ord && s.ord[clean]) ? s.ord[clean] : [];
      const types = Array.from(new Set([].concat(s.tags || [], ordTags)));
      tokens.push({ w: w, t: types, s: String(sIdx) });
    });
    tokens.push({ w: '__BR__', t: [], s: String(sIdx) });
  });
  return tokens;
}

const NOV_KM_TEKST = novKmByggTekst();

let _novKmAktiv = null;
const _novKmFargar = {
  miljo:  {bg:'#dce8ff',border:'#1a56db'},
  adjektiv:{bg:'#e8f6f0',border:'#1a5c42'},
  frampeik:{bg:'#fffbe8',border:'#f5d878'},
  symbol: {bg:'#fdf2f8',border:'#831843'},
  spenning:{bg:'#fff0ed',border:'#f0a090'},
  utvida:  {bg:'#ede9fe',border:'#6d28d9'},
  konflikt:{bg:'#ffe7d6',border:'#c2410c'},
  vendepunkt:{bg:'#e6fff6',border:'#0f766e'},
};
let _novKmModus = 'ord';

function novKmInit(){
  const el = document.getElementById('nov-km-tekst');
  if(!el) return;
  _novKmModus = 'ord';
  let html = '';
  NOV_KM_TEKST.forEach((tok,i)=>{
    if(tok.w === '__BR__'){ html+='<br>'; return; }
    html+=`<span class="nov-km-tok" data-i="${i}" data-s="${tok.s}" data-types="${tok.t.join(',')}" onclick="novKmKlikk(this)"
      style="display:inline;cursor:pointer;padding:1px 4px;border-radius:4px;border:1px solid transparent;margin:1px;transition:background 0.12s">${tok.w}</span> `;
  });
  el.innerHTML = html;
  const firstModeBtn = document.querySelector('.nov-km-mode-btn');
  if(firstModeBtn) novKmSetModus('ord', firstModeBtn);
}

function novKmSetModus(modus, btn){
  _novKmModus = modus;
  document.querySelectorAll('.nov-km-mode-btn').forEach(function(b){
    b.style.fontWeight = 'normal';
    b.style.borderColor = 'var(--line)';
    b.style.background = '#fff';
  });
  if(btn){
    btn.style.fontWeight = '700';
    btn.style.borderColor = '#1a56db';
    btn.style.background = '#eef4ff';
  }
}

function novKmSetMark(span, type, on){
  const f = _novKmFargar[type];
  if(!f) return;
  span.dataset['mark_'+type] = on ? '1' : '0';
  if(on){
    span.style.background = f.bg;
    span.style.borderColor = f.border;
  } else {
    novKmOppdaterFarge(span);
  }
}

function novKmOppdaterScore(visFasit){
  const box = document.getElementById('nov-km-score');
  if(!box) return;
  if(!_novKmAktiv){
    box.style.display = 'none';
    box.innerHTML = '';
    return;
  }

  const type = _novKmAktiv;
  let total = 0;
  let marked = 0;
  let correct = 0;
  let wrong = 0;

  document.querySelectorAll('.nov-km-tok').forEach(function(span){
    const types = span.dataset.types ? span.dataset.types.split(',').filter(Boolean) : [];
    const inFasit = types.includes(type);
    const inMark = span.dataset['mark_'+type] === '1';
    if(inFasit) total++;
    if(inMark) marked++;
    if(inFasit && inMark) correct++;
    if(!inFasit && inMark) wrong++;
  });
  const missed = Math.max(0, total - correct);

  box.style.display = 'block';
  box.style.background = visFasit ? '#eef4ff' : '#f8f9fb';
  box.style.border = visFasit ? '1px solid #b6ccff' : '1px solid #d8dee6';
  box.style.color = '#1a2a5e';
  box.innerHTML = '<strong>Oversikt for valt verkemiddel:</strong> '
    + correct + ' rette · '
    + wrong + ' feilmarkerte · '
    + missed + ' manglar'
    + ' <span style="opacity:0.75">(' + marked + ' markert, ' + total + ' i fasit)</span>'
    + (visFasit ? '<div style="margin-top:4px;font-size:12px;opacity:0.9">Fasit er vist for denne kategorien.</div>' : '');
}

function novKmVelg(btn, type, bg, col){
  _novKmAktiv = type;
  document.querySelectorAll('.nov-km-btn').forEach(b=>b.style.fontWeight='normal');
  btn.style.fontWeight='700';
  const aktiv = document.getElementById('nov-km-aktiv');
  if(aktiv) aktiv.textContent='Valt: '+btn.textContent.trim();
  novKmOppdaterScore(false);
}

function novKmKlikk(span){
  if(!_novKmAktiv) return;
  const type = _novKmAktiv;
  if(_novKmModus === 'setning'){
    const sid = span.dataset.s;
    const gruppe = document.querySelectorAll('.nov-km-tok[data-s="'+sid+'"]');
    const allOn = Array.from(gruppe).every(function(t){ return t.dataset['mark_'+type] === '1'; });
    gruppe.forEach(function(t){ novKmSetMark(t, type, !allOn); });
  } else {
    const cur = span.dataset['mark_'+type];
    novKmSetMark(span, type, cur !== '1');
  }
  novKmOppdaterScore(false);
}

function novKmOppdaterFarge(span){
  const marks = Object.keys(_novKmFargar).filter(t=>span.dataset['mark_'+t]==='1');
  if(marks.length===0){
    span.style.background=''; span.style.borderColor='transparent';
  } else {
    const f=_novKmFargar[marks[marks.length-1]];
    span.style.background=f.bg; span.style.borderColor=f.border;
  }
}

function novKmVis(){
  if(!_novKmAktiv) return;
  const type = _novKmAktiv;
  const f = _novKmFargar[type];
  document.querySelectorAll('.nov-km-tok').forEach(span=>{
    const types = span.dataset.types ? span.dataset.types.split(',').filter(Boolean) : [];
    const hit = types.includes(type);
    span.style.outline = '';
    if(hit){
      span.style.background = f.bg;
      span.style.borderColor = f.border;
      span.style.outline = '2px solid '+f.border;
    } else {
      span.style.background = '';
      span.style.borderColor = 'transparent';
    }
  });
  novKmOppdaterScore(true);
}

function novKmReset(){
  _novKmAktiv=null;
  document.querySelectorAll('.nov-km-btn').forEach(b=>b.style.fontWeight='normal');
  document.querySelectorAll('.nov-km-mode-btn').forEach(function(b){
    b.style.fontWeight = 'normal';
    b.style.borderColor = 'var(--line)';
    b.style.background = '#fff';
  });
  const aktiv=document.getElementById('nov-km-aktiv');
  if(aktiv) aktiv.textContent='Ingen valt';
  _novKmModus = 'ord';
  document.querySelectorAll('.nov-km-tok').forEach(span=>{
    span.style.background=''; span.style.borderColor='transparent'; span.style.outline='';
    Object.keys(_novKmFargar).forEach(t=>{ delete span.dataset['mark_'+t]; });
  });
  novKmOppdaterScore(false);
}

// Init krimnovelle-slide viss ho er synleg ved sideopning
document.addEventListener('DOMContentLoaded',()=>{
  const slide = document.querySelector('.nov-slide[data-idx="7"]');
  if(slide && slide.style.display==='block') novKmInit();
});

window.novKmInit = novKmInit;
window.novKmVelg = novKmVelg;
window.novKmKlikk = novKmKlikk;
window.novKmVis = novKmVis;
window.novKmReset = novKmReset;
window.novKmSetModus = novKmSetModus;

})();

/* ── Mad Libs ── */
const ML_HUMORTYPAR = {
  barnehage: { label: 'Barnehage', alder: '3-6 år' },
  '1klasse': { label: '1.klasse', alder: '6 år' },
  '5klasse': { label: '5.klasse', alder: '10 år' },
  ungdomsskule: { label: 'Ungdomsskule', alder: '13-16 år' }
};

const ML_HISTORIER = [
  {
    tittel: 'Skuledag på månen',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (stad)', ph:'t.d. biblioteket'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. enorm'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. hoppa'},
      {id:'ml3', lbl:'Eit substantiv (dyr)', ph:'t.d. kamel'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. stille'},
      {id:'ml5', lbl:'Eit adjektiv', ph:'t.d. rosenraud'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. danse'},
      {id:'ml7', lbl:'Eit substantiv (mat)', ph:'t.d. spagetti'},
    ],
    mal: (v)=>`Ein ${v[1]} dag på månen byrja då læraren vår ${v[2]} inn i ${v[0]} ridande på ein ${v[3]}. Alle sat ${v[4]} og stirra. «God morgon!» ropte læraren ${v[4]}, og huda hennar var ${v[5]}. «I dag skal vi lære å ${v[6]}!» sa ho, og la fram ein tallerken med ${v[7]}. Ingen visste kva som skjedde, men alle lo høgt.`
  },
  {
    tittel: 'Helten og draken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn (person)', ph:'t.d. Sigrid'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. modige'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. paraply'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. kviskra'},
      {id:'ml4', lbl:'Eit adjektiv', ph:'t.d. grøn'},
      {id:'ml5', lbl:'Eit substantiv (stad)', ph:'t.d. kjøkkenet'},
      {id:'ml6', lbl:'Eit adverb', ph:'t.d. sakte'},
      {id:'ml7', lbl:'Eit verb i infinitiv', ph:'t.d. synge'},
    ],
    mal: (v)=>`${v[0]}, den ${v[1]} helten, stod med ein ${v[2]} i handa. Draken ${v[3]} med si ${v[4]} røyst: «Gå bort frå ${v[5]}!» Men ${v[0]} gjekk ${v[6]} nærare og byrja å ${v[7]}. Draken vart så overraska at han berre flaut vekk.`
  },
  {
    tittel: 'Dagdrøm i norsktimen',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit verb i preteritum', ph:'t.d. drøymde'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. mystisk'},
      {id:'ml2', lbl:'Eit substantiv (dyr, fleirtal)', ph:'t.d. pingvinar'},
      {id:'ml3', lbl:'Eit adverb', ph:'t.d. ivrig'},
      {id:'ml4', lbl:'Eit substantiv (ting)', ph:'t.d. fjernkontroll'},
      {id:'ml5', lbl:'Eit verb i preteritum', ph:'t.d. eksploderte'},
      {id:'ml6', lbl:'Eit adjektiv', ph:'t.d. forvirra'},
      {id:'ml7', lbl:'Eit substantiv (mat)', ph:'t.d. vaflar'},
    ],
    mal: (v)=>`Midt i norsktimen ${v[0]} eg om eit ${v[1]} land der ${v[2]} sat og ${v[3]} peika med ein ${v[4]}. Plutseleg ${v[5]} alt, og eg vakna opp, heilt ${v[6]}, med ansiktet fullt av ${v[7]}.`
  },
  {
    tittel: 'Skuleturen til Paris',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting, eintal)', ph:'t.d. koffert'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. enorm'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. gret'},
      {id:'ml3', lbl:'Eit substantiv (dyr, fleirtal)', ph:'t.d. pingvinar'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. roleg'},
      {id:'ml5', lbl:'Eit tal (mellom 1-100)', ph:'t.d. 47'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. strikke'},
      {id:'ml7', lbl:'Eit substantiv (mat)', ph:'t.d. lutefisk'},
    ],
    mal: (v)=>`Då klassa landa i Paris, viste det seg at ${v[0]} var gøymd i ein ${v[1]} koffert. Læraren ${v[2]} då ho opna den. Inne sat det ${v[5]} ${v[3]} som ${v[4]} heldt på med å ${v[6]}. Dei ville berre ha ${v[7]}.`
  },
  {
    tittel: 'Prøvedagen',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit verb i preteritum', ph:'t.d. hoppa'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. glinsande'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. brødskive'},
      {id:'ml3', lbl:'Eit tal (høgt)', ph:'t.d. 9000'},
      {id:'ml4', lbl:'Eit verb i infinitiv', ph:'t.d. nynne'},
      {id:'ml5', lbl:'Eit adjektiv', ph:'t.d. forvirra'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. vikarlæraren'},
      {id:'ml7', lbl:'Eit adverb', ph:'t.d. desperat'},
    ],
    mal: (v)=>`Prøva starta kl. 08.15. Alle ${v[0]} då ${v[6]} kom inn med ein ${v[1]} ${v[2]} og ${v[3]} sider med oppgåver. Elevane sat ${v[5]} og byrja ${v[7]} å ${v[4]}.`
  },
  {
    tittel: 'Straumbrotet',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. mystisk'},
      {id:'ml1', lbl:'Eit substantiv (stad)', ph:'t.d. gymsalen'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. kviskra'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. joggesko'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. febrilsk'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. kvesse'},
      {id:'ml6', lbl:'Eit tal', ph:'t.d. 12'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. triumferande'},
    ],
    mal: (v)=>`Det kom eit ${v[0]} straumbrott i ${v[1]}. ${v[2]} lyden spreidde seg då ${v[6]} ${v[3]} begynte å ${v[5]} seg ${v[4]}. Etter ${v[6]} minutt var alt normalt – bortsett frå rektoren som stod ${v[7]} på taket.`
  },
  {
    tittel: 'Roboten',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn på ein robot', ph:'t.d. Robo-Ola'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. rugglete'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. viskelær'},
      {id:'ml3', lbl:'Eit verb i infinitiv', ph:'t.d. breakdanse'},
      {id:'ml4', lbl:'Eit tal', ph:'t.d. 3'},
      {id:'ml5', lbl:'Eit adverb', ph:'t.d. engsteleg'},
      {id:'ml6', lbl:'Eit substantiv (dyr)', ph:'t.d. alpakka'},
      {id:'ml7', lbl:'Eit verb i preteritum', ph:'t.d. rømdde'},
    ],
    mal: (v)=>`Skulen kjøpte ein ${v[1]} robot som heitte ${v[0]}. Første dag gjekk ${v[0]} rett til tavla og byrja å ${v[3]} med ${v[2]}. Etter ${v[4]} minutt ${v[7]} ein ${v[6]} ${v[5]} ut av klasserommet.`
  },
  {
    tittel: 'Dei mystiske leksene',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit verb i presens', ph:'t.d. søv'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. glinsande'},
      {id:'ml2', lbl:'Eit substantiv (mat, fleirtal)', ph:'t.d. kjøttkaker'},
      {id:'ml3', lbl:'Eit tal (mellom 1-20)', ph:'t.d. 7'},
      {id:'ml4', lbl:'Eit verb i infinitiv', ph:'t.d. klatre'},
      {id:'ml5', lbl:'Eit adverb', ph:'t.d. sakte'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. grandonkelen'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. nøgd'},
    ],
    mal: (v)=>`${v[6]} ${v[0]} aldri på skuledagar, for leksene skriv seg sjølv. ${v[3]} ${v[2]} og ein ${v[1]} penn er alt ein treng. Etter ${v[3]} minutt er alt klart, og eleven er ${v[7]} nok til å ${v[4]} ${v[5]} ut vindauga.`
  },
  {
    tittel: 'Bursdag i dyrehagen',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Ola'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. tullete'},
      {id:'ml2', lbl:'Eit substantiv (dyr)', ph:'t.d. giraff'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. dansa'},
      {id:'ml4', lbl:'Eit substantiv (mat)', ph:'t.d. gelé'},
      {id:'ml5', lbl:'Eit adverb', ph:'t.d. sakte'},
      {id:'ml6', lbl:'Eit adjektiv', ph:'t.d. lilla'},
      {id:'ml7', lbl:'Eit verb i infinitiv', ph:'t.d. hoppe'},
    ],
    mal: (v)=>`${v[0]} hadde bursdag i dag, og ein ${v[1]} ${v[2]} ${v[3]} rett inn med ei kake av ${v[4]}. Alle klappa ${v[5]}, medan den ${v[6]} løva prøvde å ${v[7]} på bordet.`
  },
  {
    tittel: 'Pannekake-raketten',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (mat)', ph:'t.d. pannekake'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. klissete'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. susa'},
      {id:'ml3', lbl:'Eit substantiv (stad)', ph:'t.d. sandkassa'},
      {id:'ml4', lbl:'Eit tal', ph:'t.d. 4'},
      {id:'ml5', lbl:'Eit dyr', ph:'t.d. mus'},
      {id:'ml6', lbl:'Eit adverb', ph:'t.d. fort'},
      {id:'ml7', lbl:'Eit verb i infinitiv', ph:'t.d. synge'},
    ],
    mal: (v)=>`Ein ${v[1]} ${v[0]} ${v[2]} opp frå ${v[3]} som ein rakett. Etter ${v[4]} sekund landa han på hovudet til ein ${v[5]}, som byrja ${v[6]} å ${v[7]}.`
  },
  {
    tittel: 'Den snakkande matboksen',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Mina'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. rar'},
      {id:'ml2', lbl:'Eit substantiv (mat)', ph:'t.d. banan'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. kviskra'},
      {id:'ml4', lbl:'Eit substantiv (ting)', ph:'t.d. blyant'},
      {id:'ml5', lbl:'Eit adverb', ph:'t.d. høgt'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. rulle'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. fnisete'},
    ],
    mal: (v)=>`Då ${v[0]} opna matboksen sin, låg det ein ${v[1]} ${v[2]} inni som ${v[3]}: «Eg vil ha ein ${v[4]}!» Heile klassa lo ${v[5]}, og matboksen byrja å ${v[6]} over golvet som om han var heilt ${v[7]}.`
  },
  {
    tittel: 'Gymtime med dinosaurar',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. svett'},
      {id:'ml1', lbl:'Eit dyr', ph:'t.d. dinosaur'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. snubla'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. rockering'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. vilt'},
      {id:'ml5', lbl:'Eit namn', ph:'t.d. Emma'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. brøle'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. mjuk'},
    ],
    mal: (v)=>`I gymtimen kom ein ${v[0]} ${v[1]} inn døra og ${v[2]} over ein ${v[3]}. ${v[5]} lo ${v[4]} og prøvde å ${v[6]} tilbake. Då sette dinosauren seg på den ${v[7]} matta og sovna.`
  },
  {
    tittel: 'Fotballkampen som gjekk skeis',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting)', ph:'t.d. sokk'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. slimete'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. føyk'},
      {id:'ml3', lbl:'Eit substantiv (person)', ph:'t.d. vaktmeisteren'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. dramatisk'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 11'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. juble'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. forfjamsa'},
    ],
    mal: (v)=>`Under finalen vart ballen bytt ut med ein ${v[1]} ${v[0]}. Han ${v[2]} rett i panna på ${v[3]}, som ${v[4]} blåste av kampen etter ${v[5]} sekund. Publikum byrja å ${v[6]}, medan dommaren såg heilt ${v[7]} ut.`
  },
  {
    tittel: 'Den rare vikaren',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Sofie'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. mystisk'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. banjo'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. kvein'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. høfleg'},
      {id:'ml5', lbl:'Eit substantiv (dyr)', ph:'t.d. hamster'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. rappe'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. blank'},
    ],
    mal: (v)=>`Vikaren presenterte seg som ${v[0]} den ${v[1]} og sette ein ${v[2]} på kateteret. Så ${v[3]} ho at alle måtte sitje ${v[4]} og sjå på medan ein ${v[5]} lærte klassa å ${v[6]}. På tavla stod det berre eitt ord med ${v[7]} tusj: «Kvifor?»`
  },
  {
    tittel: 'Skuleavslutninga',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (mat)', ph:'t.d. muffins'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. skeiv'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. velta'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. mikrofon'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. pinleg'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 28'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. viske'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. skjelven'},
    ],
    mal: (v)=>`På skuleavslutninga skulle alle få ${v[0]}, men bordet ${v[2]} idet rektor tok opp ein ${v[1]} ${v[3]}. Etter ${v[5]} sekund vart det ${v[4]} stille, før heile klassa byrja å ${v[6]}. Rektoren stod igjen med eit ${v[7]} smil.`
  },
  {
    tittel: 'Kantinemysteriet',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. mistenkeleg'},
      {id:'ml1', lbl:'Eit substantiv (mat)', ph:'t.d. toast'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. forsvann'},
      {id:'ml3', lbl:'Eit substantiv (person)', ph:'t.d. elevrådsleiaren'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. diskret'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. skulde'},
      {id:'ml6', lbl:'Eit substantiv (ting)', ph:'t.d. hettegenser'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. suspekt'},
    ],
    mal: (v)=>`Kvar dag klokka 11.12 ${v[2]} ein ${v[0]} ${v[1]} frå kantina. Til slutt byrja ${v[3]} ${v[4]} å ${v[5]} alle som gjekk med ${v[6]}. Det gjorde stemninga ganske ${v[7]}.`
  },
  {
    tittel: 'Klasseturen med drama',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (stad)', ph:'t.d. ferja'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. klein'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. sklei'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. energidrikk'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. overdrivent'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. forklare'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. kontaktlæraren'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. flau'},
    ],
    mal: (v)=>`På klasseturen til ${v[0]} gjekk alt fint heilt til nokon ${v[2]} i ein ${v[1]} sølepytt med ein ${v[3]} i handa. Alle lo ${v[4]}, medan ${v[6]} prøvde å ${v[5]} at dette eigentleg var heilt normalt. Det var ingen som trudde på det, særleg ikkje den mest ${v[7]} eleven i klassa.`
  },
  {
    tittel: 'Den forheksa klassechatten',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. hektisk'},
      {id:'ml1', lbl:'Eit substantiv (dyr)', ph:'t.d. geit'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. dukka opp'},
      {id:'ml3', lbl:'Eit substantiv (ting)', ph:'t.d. caps'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. desperat'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. slette'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. norsklæraren'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. kaotisk'},
    ],
    mal: (v)=>`Klassechatten vart plutseleg ${v[0]} då eit bilete av ein ${v[1]} med ${v[3]} ${v[2]} i kvar einaste tråd. Alle prøvde ${v[4]} å ${v[5]} det, men så skreiv ${v[6]} berre: «Kven eig denne?» Etter det vart alt heilt ${v[7]}.`
  },
  {
    tittel: 'Munnleg framføring gone wrong',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (ting)', ph:'t.d. klikker'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. desperat'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. pep'},
      {id:'ml3', lbl:'Eit substantiv (dyr)', ph:'t.d. måke'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. kunstig'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. imponere'},
      {id:'ml6', lbl:'Eit substantiv (person)', ph:'t.d. sensor'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. mislukka'},
    ],
    mal: (v)=>`Då framføringa starta, nekta ${v[0]} å virke, prosjektoren ${v[2]}, og første lysbiletet viste ein ${v[1]} ${v[3]}. Presentatøren prøvde ${v[4]} å ${v[5]} ${v[6]}, men heile opplegget fekk ein ganske ${v[7]} avslutning.`
  },
  /* ── 10 nye historier ── */
  {
    tittel: 'Trollet som ville leike',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Nora'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. bustete'},
      {id:'ml2', lbl:'Eit substantiv (mat)', ph:'t.d. potetmos'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. trilla'},
      {id:'ml4', lbl:'Eit adjektiv (farge)', ph:'t.d. lilla'},
      {id:'ml5', lbl:'Eit leikety', ph:'t.d. sparkesykkel'},
      {id:'ml6', lbl:'Eit adverb', ph:'t.d. ivrig'},
      {id:'ml7', lbl:'Eit verb i infinitiv', ph:'t.d. klappe'},
    ],
    mal: (v)=>`Under senga til ${v[0]} budde eit ${v[1]} troll som berre åt ${v[2]}. Ein dag ${v[3]} trollet ut og peika på den ${v[4]} ${v[5]}. «Eg vil også ${v[7]}!» ropte trollet ${v[6]}.`
  },
  {
    tittel: 'Superkappa til Knut',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Knut'},
      {id:'ml1', lbl:'Eit adjektiv (farge)', ph:'t.d. raud'},
      {id:'ml2', lbl:'Eit substantiv (dyr)', ph:'t.d. katt'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. flaug'},
      {id:'ml4', lbl:'Eit substantiv (stad)', ph:'t.d. leikerommet'},
      {id:'ml5', lbl:'Eit adverb', ph:'t.d. superhurtig'},
      {id:'ml6', lbl:'Eit substantiv (mat)', ph:'t.d. eplejuice'},
      {id:'ml7', lbl:'Eit verb i infinitiv', ph:'t.d. redde'},
    ],
    mal: (v)=>`${v[0]} tok på seg den ${v[1]} superkappa og ${v[3]} rundt i ${v[4]}. Ein ${v[2]} sat fast i gardinene og ropa. ${v[0]} kom ${v[5]}, drakk ein slurk ${v[6]}, og klarte å ${v[7]} ${v[2]}en.`
  },
  {
    tittel: 'Isbjørnen i barnehagen',
    humortype: 'barnehage',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. mjuk'},
      {id:'ml1', lbl:'Eit verb i preteritum', ph:'t.d. stabba'},
      {id:'ml2', lbl:'Eit leikety', ph:'t.d. duplo'},
      {id:'ml3', lbl:'Eit adverb', ph:'t.d. forsiktig'},
      {id:'ml4', lbl:'Eit substantiv (mat)', ph:'t.d. kakao'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 3'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. sove'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. snill'},
    ],
    mal: (v)=>`Ein dag kom ein ${v[0]} isbjørn inn i barnehagen og ${v[1]} bort til ${v[2]}. Alle barna lo ${v[3]} og rekte han ${v[4]}. Han drakk ${v[5]} koppar og bestemte seg for å ${v[6]} der for alltid. Han var eigentleg veldig ${v[7]}.`
  },
  {
    tittel: 'Spøkelset i skulesekken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Lars'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. gjennomsiktig'},
      {id:'ml2', lbl:'Eit substantiv (ting)', ph:'t.d. pennal'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. hylte'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. skummelt'},
      {id:'ml5', lbl:'Eit substantiv (mat)', ph:'t.d. knekkebrød'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. rope'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. nøgd'},
    ],
    mal: (v)=>`${v[0]} opna skulesekken og fann eit ${v[1]} spøkelse som sat oppå ${v[2]}. Det ${v[3]} ${v[4]}. «Vil du ha ${v[5]}?» spurde ${v[0]}. Spøkelset nikka, åt opp alt, og forsvann med eit ${v[7]} smil.`
  },
  {
    tittel: 'Den blinkande fisken',
    humortype: '1klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv (farge)', ph:'t.d. blå'},
      {id:'ml1', lbl:'Eit verb i preteritum', ph:'t.d. spruta'},
      {id:'ml2', lbl:'Eit substantiv (stad)', ph:'t.d. klasserommet'},
      {id:'ml3', lbl:'Eit adverb', ph:'t.d. vilt'},
      {id:'ml4', lbl:'Eit namn', ph:'t.d. Tiril'},
      {id:'ml5', lbl:'Eit substantiv (mat)', ph:'t.d. sjokolade'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. symje'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. vått'},
    ],
    mal: (v)=>`Ein ${v[0]} fisk ${v[1]} inn i ${v[2]} og byrja ${v[3]} å ${v[6]} rundt pulten til ${v[4]}. Alt vart ${v[7]}, men ingen brydde seg fordi fisken delte ut ${v[5]} til alle saman.`
  },
  {
    tittel: 'Nattevakta på biblioteket',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. støvete'},
      {id:'ml1', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. ordbøker'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. snika'},
      {id:'ml3', lbl:'Eit adverb', ph:'t.d. mistenksomt'},
      {id:'ml4', lbl:'Eit substantiv (mat)', ph:'t.d. nuggets'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 13'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. stave'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. forfjamsa'},
    ],
    mal: (v)=>`Klokka 23.47 byrja dei ${v[0]} ${v[1]} å bevege seg. Dei ${v[2]} ${v[3]} rundt i biblioteket og leita etter ${v[4]}. For kvar dei fann eit stykke, lærte dei seg å ${v[6]} eit nytt ord. Vakta stod igjen heilt ${v[7]}.`
  },
  {
    tittel: 'Leksemaskina 3000',
    humortype: '5klasse',
    felt: [
      {id:'ml0', lbl:'Eit namn', ph:'t.d. Tobias'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. skranglete'},
      {id:'ml2', lbl:'Eit substantiv (mat)', ph:'t.d. riskrem'},
      {id:'ml3', lbl:'Eit verb i preteritum', ph:'t.d. spydde'},
      {id:'ml4', lbl:'Eit substantiv (ting)', ph:'t.d. tannbørste'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 42'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. levere'},
      {id:'ml7', lbl:'Eit adverb', ph:'t.d. skamfullt'},
    ],
    mal: (v)=>`${v[0]} bygde Leksemaskina 3000 av ein ${v[1]} kasse og ein brukt ${v[4]}. Første prøvekøyring: maskinen ${v[3]} ut ${v[5]} ark med berre «${v[2]}» på kvar side. ${v[0]} måtte ${v[7]} ${v[6]} dei med eit vedlagt notat: «Maskinlaga.»`
  },
  {
    tittel: 'Kva skjer på lærarrommet?',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. kaotisk'},
      {id:'ml1', lbl:'Eit substantiv (mat)', ph:'t.d. lefse'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. diskuterte'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. rettepennar'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. intenst'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 6'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. fordele'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. smilande'},
    ],
    mal: (v)=>`Tidleg ein måndag låg ${v[3]} overalt og stemninga var heilt ${v[0]}. ${v[5]} lærarar sat rundt bordet og ${v[2]} ${v[4]} om korleis dei best kunne ${v[6]} ${v[1]}. Då klassedøra opna seg, var alle ${v[7]}.`
  },
  {
    tittel: 'Gruppearbeidet',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit adjektiv', ph:'t.d. ambisiøs'},
      {id:'ml1', lbl:'Eit substantiv (stad)', ph:'t.d. kjellaren'},
      {id:'ml2', lbl:'Eit verb i preteritum', ph:'t.d. krangla'},
      {id:'ml3', lbl:'Eit substantiv (ting, fleirtal)', ph:'t.d. Post-it-lappar'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. heftig'},
      {id:'ml5', lbl:'Eit tal', ph:'t.d. 3'},
      {id:'ml6', lbl:'Eit verb i infinitiv', ph:'t.d. presentere'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. utmatta'},
    ],
    mal: (v)=>`Gruppa møttest i ${v[1]} med ein ${v[0]} plan. Dei ${v[2]} ${v[4]} om ${v[3]} i ${v[5]} timar og klarte aldri å ${v[6]} det ferdige resultatet. Alle gjekk heim ${v[7]}.`
  },
  {
    tittel: 'Karakterjakta',
    humortype: 'ungdomsskule',
    felt: [
      {id:'ml0', lbl:'Eit substantiv (person)', ph:'t.d. norsklæraren'},
      {id:'ml1', lbl:'Eit adjektiv', ph:'t.d. nervøs'},
      {id:'ml2', lbl:'Eit substantiv (mat, fleirtal)', ph:'t.d. lefsar'},
      {id:'ml3', lbl:'Eit tal', ph:'t.d. 47'},
      {id:'ml4', lbl:'Eit adverb', ph:'t.d. stille'},
      {id:'ml5', lbl:'Eit verb i infinitiv', ph:'t.d. bestikke'},
      {id:'ml6', lbl:'Eit substantiv (ting)', ph:'t.d. blomsterbukett'},
      {id:'ml7', lbl:'Eit adjektiv', ph:'t.d. gjennomskoda'},
    ],
    mal: (v)=>`Eleven sat ${v[1]} utanfor kontoret til ${v[0]}, med ${v[3]} heimebakte ${v[2]} og ein ${v[6]} i sekken – eit forsøk på å ${v[5]} seg til betre karakter. ${v[0]} opna døra. Begge stirra ${v[4]} på kvarandre. Blikkene var like ${v[7]}.`
  }
];

let _mlIdx = 0;
let _mlHumortype = 'ungdomsskule';

function mlGetHistorierForHumortype(){
  if(_mlHumortype === 'alle') return ML_HISTORIER;
  return ML_HISTORIER.filter(function(h){ return h.humortype === _mlHumortype; });
}

function mlGetAktivHistorie(){
  const historier = mlGetHistorierForHumortype();
  if(!historier.length) return null;
  if(!historier[_mlIdx]) _mlIdx = 0;
  return historier[_mlIdx];
}

function mlOppdaterMeta(h){
  const meta = ML_HUMORTYPAR[h.humortype] || { label: h.humortype, alder: '' };
  const formMeta = document.getElementById('ml-current-meta');
  const resultMeta = document.getElementById('ml-result-meta');
  const heading = document.getElementById('ml-result-heading');
  const tekst = '<strong>'+h.tittel+'</strong><br>Humortype: '+meta.label+' · Passar best for '+meta.alder;
  if(formMeta) formMeta.innerHTML = tekst;
  if(resultMeta) resultMeta.innerHTML = tekst;
  if(heading) heading.textContent = 'Her er historia di: ' + h.tittel;
  const sel = document.getElementById('ml-humortype');
  if(sel && _mlHumortype !== 'alle') sel.value = h.humortype;
}

function mlInit(){
  const h = mlGetAktivHistorie();
  const inp = document.getElementById('ml-inputs');
  if(!inp || !h) return;
  mlOppdaterMeta(h);
  inp.innerHTML = h.felt.map(f=>`
    <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;color:#4a4a46;font-weight:500">
      ${f.lbl}
      <input id="${f.id}" type="text" autocomplete="off" spellcheck="false" placeholder="${f.ph}"
        style="border:1px solid #d0d8df;border-radius:8px;padding:8px 12px;font-size:14px;font-family:'DM Sans',sans-serif;color:#1a1a18;outline:none;transition:border-color 0.15s"
        onfocus="this.style.borderColor='#1a56db'" onblur="this.style.borderColor='#d0d8df'">
    </label>`).join('');
  document.getElementById('ml-result').style.display='none';
  document.getElementById('ml-form').style.display='block';
}

function mlLag(){
  const h = mlGetAktivHistorie();
  if(!h) return;
  const vals = h.felt.map(f=>{
    const el=document.getElementById(f.id);
    return el&&el.value.trim() ? el.value.trim() : '';
  });

  const esc = function(s){
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const markorar = h.felt.map(function(_, i){ return '__ML_'+i+'__'; });
  const story = h.mal(markorar);
  let storyHtml = esc(story);
  markorar.forEach(function(m, i){
    const v = vals[i];
    const repl = v
      ? `<strong style="color:#1a56db;text-decoration:underline;text-decoration-style:dotted">${esc(v)}</strong>`
      : '<span style="color:#8a8a88;border-bottom:1px dotted #b9b9b6">____</span>';
    storyHtml = storyHtml.split(m).join(repl);
  });

  document.getElementById('ml-story').innerHTML = storyHtml;
  document.getElementById('ml-form').style.display='none';
  document.getElementById('ml-result').style.display='block';
  mlOppdaterMeta(h);
}

function mlReset(){
  mlInit();
}

function mlNyHistorie(){
  const historier = mlGetHistorierForHumortype();
  if(!historier.length) return;
  let next;
  do { next = Math.floor(Math.random() * historier.length); } while(next === _mlIdx && historier.length > 1);
  _mlIdx = next;
  mlInit();
}

function mlSetHumortype(value){
  _mlHumortype = value;
  _mlIdx = 0;
  mlNyHistorie();
}

function mlPrøvLykken(){
  _mlHumortype = 'alle';
  const sel = document.getElementById('ml-humortype');
  if(sel) sel.value = 'alle';
  _mlIdx = Math.floor(Math.random() * ML_HISTORIER.length);
  mlInit();
}

document.addEventListener('DOMContentLoaded', ()=>{
  const sel = document.getElementById('ml-humortype');
  if(sel && sel.value) _mlHumortype = sel.value;
  const historier = mlGetHistorierForHumortype();
  _mlIdx = historier.length ? Math.floor(Math.random() * historier.length) : 0;
  mlInit();
});

/* ── Nav dropdown ── */
function navToggle(id){
  var el=document.getElementById(id);
  if(!el) return;
  var wasOpen=el.classList.contains('open');
  document.querySelectorAll('.nav-dropdown').forEach(function(d){ d.classList.remove('open'); });
  if(!wasOpen) el.classList.add('open');
}
document.addEventListener('click',function(e){
  if(!e.target.closest('.nav-dropdown'))
    document.querySelectorAll('.nav-dropdown').forEach(function(d){ d.classList.remove('open'); });
});

/* ══════════════════════════════════════════════════════
   OPPGÅVEBANK  – 63 nynorskoppgåver
══════════════════════════════════════════════════════ */
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
 sporsmal:'Skriv «å skrive» i fortid (preteritum).',setning:'Dei ___ ein lang brev til kvarandre.',
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

const EMNE_LABELS = {
  blanda:'Blanda', substantiv:'Substantiv', verb:'Verb',
  pronomen:'Pronomen', adjektiv:'Adjektiv',
  ordstilling:'Ordstilling', eigedomsord:'Eigedomsord',
  spørjeord:'Spørjeord',
  typiske_ord:'Typiske ord',
};

function $(id){ return document.getElementById(id); }

/* ── Shuffle ── */
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

/* ══════════════════════════════════════════════════════
   START
══════════════════════════════════════════════════════ */
function gramStart(){
  const emne   = $('gc-emne').value;
  const type   = $('gc-type').value;
  const antal  = Math.min(15, Math.max(3, parseInt($('gc-antal').value)||8));
  const vanske = $('gc-vanske').value;

  GS.config = {
    emne, type, antal, vanske,
    kontrast: $('gc-kontrast').value==='true',
  };
  GS.tasks=[]; GS.idx=0; GS.score=0; GS.answered=false; GS.streak=0; GS.history=[];

  /* Filter bank by emne */
  let pool = emne==='blanda' ? [...BANK] : BANK.filter(t=>t.emne===emne);

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
  $('gram-start-btn').disabled=false;
  $('gram-quiz-area').classList.remove('active');
  $('gram-summary').classList.remove('show');
  $('gram-task-wrap').innerHTML='';
  $('gram-progress-wrap').style.display='none';
  $('gram-score-badge').style.display='none';
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
    const parts=t.setning.split('___');
    // Vis instruksjon (sporsmal) over sjølve setninga
    questionHTML=`<p class="gram-task-instr">${escH(t.sporsmal)}</p>`;
    questionHTML+=`<p class="gram-task-q">`;
    parts.forEach((part,i)=>{
      questionHTML+=escH(part);
      if(i<parts.length-1){
        questionHTML+=`<input type="text" class="gram-blank" id="gram-blank-${i}" placeholder="…" autocomplete="off" autocorrect="off" spellcheck="false" onkeydown="if(event.key==='Enter')gramCheck()">`;
      }
    });
    questionHTML+=`</p>`;
  } else {
    questionHTML=`<p class="gram-task-q">${escH(t.sporsmal)}</p>`;
  }

  /* Input HTML */
  let inputHTML='';
  if(t.type==='drag_ord'&&t.ord&&t.ord.length){
    const shuffled=shuffle([...t.ord]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink3);margin-bottom:6px">Trekkbare ord – trykk for å setje dei i ei kasse:</div>
      <div class="drag-tokens" id="go-bank" style="min-height:40px;margin-bottom:10px">${shuffled.map(w=>`<div class="drag-token" draggable="true" ondragstart="dragStart(event,'${w.replace(/'/g,'&#39;')}')" ondragend="dragEnd(event)" id="got-${encodeURIComponent(w)}" data-word="${w.replace(/'/g,'&#39;')}">${w}</div>`).join('')}</div>
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink3);margin-bottom:6px">Bygg setninga her (trykk eit ord for å fjerne det):</div>
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
  } else if(t.type==='cloze'){
    inputHTML=`<div id="gram-actions-cloze"><button class="gram-btn primary" onclick="gramCheck()">Sjekk svar</button></div>`;
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
        ${GS.idx+1<GS.tasks.length?'Neste oppgåve →':'Sjå resultat →'}
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
  const n=s=>s.trim().toLowerCase();
  const variants=Array.isArray(t.fasit_variant)&&t.fasit_variant.length?t.fasit_variant:[t.fasit];
  return variants.some(v=>n(v)===n(val));
}

function finishAnswer(correct,chosen,t){
  if(correct){GS.score++;GS.streak++;}else{GS.streak=0;}
  $('gram-score-txt').textContent=GS.score;
  GS.history.push({ sporsmal:t.sporsmal, setning:t.setning||null, fasit:t.fasit, chosen, correct, emne_label:t.emne_label, vanske:t.vanske });

  const fb=$('gram-feedback');
  fb.className='gram-feedback show '+(correct?'correct-fb':'wrong-fb');

  let html=`<div class="fb-heading">${correct?'✓ Rett!':'✗ Feil'}</div>`;
  if(!correct) html+=`<div>Rett svar: <strong>${escH(t.fasit)}</strong></div>`;
  if(t.regel) html+=`<div class="fb-regel"><strong>Regel:</strong> ${escH(t.regel)}</div>`;
  if(t.eksempel) html+=`<div class="fb-regel"><em>Eks.: ${escH(t.eksempel)}</em></div>`;
  if(t.kontrast_bm&&GS.config.kontrast)
    html+=`<div class="fb-kontrast">Bokmål: «${escH(t.kontrast_bm)}» → Nynorsk: «${escH(t.fasit)}»</div>`;
  fb.innerHTML=html;

  $('gram-main-actions').style.display='flex';
}


/* ── Drag-ord (ordstilling) ─────────────────── */
let _goPlaced = [];

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

function showSummary(){
  $('gram-task-wrap').innerHTML='';
  $('gram-progress-wrap').style.display='none';
  $('gram-score-badge').style.display='none';

  const total=GS.tasks.length;
  const pct=total>0?Math.round((GS.score/total)*100):0;
  $('sum-score-txt').textContent=`${GS.score}/${total}`;
  $('sum-rett').textContent=GS.score;
  $('sum-feil').textContent=total-GS.score;
  $('sum-pct').textContent=pct+' %';

  const msgs=[[90,'Framifrå! Du meistrar nynorsk grammatikk svært godt.'],[70,'Bra jobba! Du har solid forståing – hald fram slik.'],[50,'Greitt! Nokre emne kan det vere lurt å øve meir på.'],[0,'Ikkje gi opp! Grammatikk krev øving – prøv igjen.']];
  $('sum-msg').textContent=(msgs.find(([t])=>pct>=t)||msgs[msgs.length-1])[1];

  /* ── Oppgåveoversikt ── */
  const histEl=$('sum-history');
  if(histEl&&GS.history.length){
    const vLbl={lett:'Lett',medium:'Medium',vanskeleg:'Vanskeleg'};
    let rows='';
    GS.history.forEach((h,i)=>{
      const icon=h.correct?'✓':'✗';
      const iconCol=h.correct?'#6ee7b7':'#fca5a5';
      const rowBg=h.correct?'rgba(110,231,183,0.07)':'rgba(252,165,165,0.07)';
      const border=h.correct?'rgba(110,231,183,0.2)':'rgba(252,165,165,0.2)';
      // Spørsmål: viss setning, vis den med blank markert, elles vis spørsmål
      let qTxt = h.setning
        ? h.setning.replace('___', `<span style="text-decoration:underline;color:rgba(255,255,255,0.5)">___</span>`)
        : escH(h.sporsmal);
      const fasitTxt=escH(h.fasit);
      const chosenTxt=escH(h.chosen||'–');
      rows+=`
        <div style="display:grid;grid-template-columns:28px 1fr auto;align-items:start;gap:8px;background:${rowBg};border:1px solid ${border};border-radius:10px;padding:0.65rem 0.9rem;margin-bottom:6px">
          <div style="font-size:16px;font-weight:700;color:${iconCol};line-height:1.4">${icon}</div>
          <div>
            <div style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:2px">${escH(h.emne_label)} · ${vLbl[h.vanske]||h.vanske}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.55">${qTxt}</div>
            ${!h.correct?`<div style="margin-top:4px;font-size:12.5px">
              <span style="color:#fca5a5">Svaret ditt: «${chosenTxt}»</span>
              <span style="color:rgba(255,255,255,0.3);margin:0 5px">→</span>
              <span style="color:#6ee7b7">Rett: «${fasitTxt}»</span>
            </div>`:''}
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.3);white-space:nowrap;padding-top:2px">${i+1}</div>
        </div>`;
    });
    histEl.innerHTML=`
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:0.6rem;font-weight:500">Gjennomgang – alle oppgåver</div>
      ${rows}`;
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

/* ══════════════════════════════════════════════════════
   SJANGER-STEGVISARAR
══════════════════════════════════════════════════════ */
function makeStepper(prefix, total, colorClass) {
  const dotsEl = document.getElementById(prefix + '-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  for (let i = 0; i < total; i++) {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'sj-dot-line';
      line.id = prefix + '-line-' + i;
      dotsEl.appendChild(line);
    }
    const dot = document.createElement('button');
    dot.className = 'sj-dot' + (i === 0 ? ' active ' + colorClass : '');
    dot.textContent = i + 1;
    dot.onclick = () => goStep(prefix, i, total, colorClass);
    dot.id = prefix + '-dot-' + i;
    dotsEl.appendChild(dot);
  }
}

function goStep(prefix, target, total, colorClass) {
  for (let i = 0; i < total; i++) {
    const step = document.getElementById(prefix + '-step-' + i);
    const dot  = document.getElementById(prefix + '-dot-' + i);
    const line = document.getElementById(prefix + '-line-' + i);
    if (!step || !dot) continue;
    const active = i === target;
    const done   = i < target;
    step.classList.toggle('active', active);
    dot.className = 'sj-dot' + (active ? ' active ' + colorClass : done ? ' done' : '');
    if (line) line.classList.toggle('done', done);
  }
  document.getElementById(prefix + '-done')?.classList.remove('show');
  document.getElementById(prefix + '-step-' + target)?.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function getCurrent(prefix, total) {
  for (let i = 0; i < total; i++) {
    if (document.getElementById(prefix + '-step-' + i)?.classList.contains('active')) return i;
  }
  return 0;
}

// Fagartikkel (5 steg)
const FA_TOTAL = 7;
function faNav(dir) {
  const cur = getCurrent('fa', FA_TOTAL);
  const next = cur + dir;
  if (next >= 0 && next < FA_TOTAL) goStep('fa', next, FA_TOTAL, 'fa');
}
function faDone() {
  for (let i = 0; i < FA_TOTAL; i++) {
    const step = document.getElementById('fa-step-' + i);
    const dot  = document.getElementById('fa-dot-' + i);
    if (step) step.classList.remove('active');
    if (dot)  dot.className = 'sj-dot done';
    const line = document.getElementById('fa-line-' + i);
    if (line) line.classList.add('done');
  }
  document.getElementById('fa-done').classList.add('show');
  document.getElementById('fa-done').scrollIntoView({behavior:'smooth', block:'nearest'});
}
function faRestart() {
  document.getElementById('fa-done').classList.remove('show');
  goStep('fa', 0, FA_TOTAL, 'fa');
}

// Debattinnlegg (5 steg)
const DI_TOTAL = 7;
function diNav(dir) {
  const cur = getCurrent('di', DI_TOTAL);
  const next = cur + dir;
  if (next >= 0 && next < DI_TOTAL) goStep('di', next, DI_TOTAL, 'di');
}
function diDone() {
  for (let i = 0; i < DI_TOTAL; i++) {
    const step = document.getElementById('di-step-' + i);
    const dot  = document.getElementById('di-dot-' + i);
    if (step) step.classList.remove('active');
    if (dot)  dot.className = 'sj-dot done';
    const line = document.getElementById('di-line-' + i);
    if (line) line.classList.add('done');
  }
  document.getElementById('di-done').classList.add('show');
  document.getElementById('di-done').scrollIntoView({behavior:'smooth', block:'nearest'});
}
function diRestart() {
  document.getElementById('di-done').classList.remove('show');
  goStep('di', 0, DI_TOTAL, 'di');
}


/* ══════════════════════════════════════════════════════
   MENGDETRENING – oppgåvebank (50 oppgåver, 5 kategoriar)
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

{kat:'og_aa',kat_label:'Og / å',type:'cloze',vanske:'vanskeleg',
 q:'Fyll inn BERRE første blank: «Ola prøvde ___ synge, og det høyrdest litt rart ut.»',
 hint:'Kva kjem etter «prøvde»? Eit verb i infinitiv. Kva ord markerer infinitiv?',
 fasit:'å',fasit_v:['å'],
 regel:'«Prøvde å synge» (infinitiv). «Og det høyrdest» (bindeord mellom setningar).',
 eks:'Han prøvde å synge, og det høyrdest rart ut.'},

{kat:'og_aa',kat_label:'Og / å',type:'mc',vanske:'vanskeleg',
 q:'Kva er ALLE feila i: «Eg ville og hjelpe, og lære, og det var gøy og gjere.»?',
 alt:['«og hjelpe», «og lære» og «og gjere» skal alle vere «å»','Berre «og hjelpe» er feil','«og det» er feil','Setninga er rett'],
 fasit:'«og hjelpe», «og lære» og «og gjere» skal alle vere «å»',
 regel:'Modalverb (ville) og adjektiv (gøy) styrer infinitiv med «å». Berre det midtre «og» (mellom hjelpe og lære) er eit bindeord.',
 eks:'Eg ville å hjelpe og å lære, og det var gøy å gjere.'},

/* ── SAMANSETTE ORD (10) ── */
{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva er rett skrivemåte?',
 alt:['sjokolade kake','sjokoladekake','sjokolate kake','sjokolat kake'],
 fasit:'sjokoladekake',
 regel:'Samansette ord skriv ein SAMAN i norsk. «Sjokolade» + «kake» = «sjokoladekake».',
 eks:'sjokoladekake, fotballbane, barneskule'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett: «Han spelar på fotball ___» (fotball + bane)',
 hint:'Slå saman dei to delane til eitt ord – ingen mellomrom.',
 fasit:'fotballbane',fasit_v:['fotballbane'],
 regel:'«Fotball» + «bane» = «fotballbane» – eitt ord.',
 eks:'fotballbane, basketballbane, sandvolleyballbane'},

{kat:'samansett',kat_label:'Samansette ord',type:'mc',vanske:'lett',
 q:'Kva skjer viss du skriv «lamme lår» i staden for «lammelår»?',
 alt:['Det tyder lår frå lam (mat)','Det tyder lår som er lamme/paralyserte 😬','Det er same meining begge vegar','Det er berre ein stavefeil'],
 fasit:'Det tyder lår som er lamme/paralyserte 😬',
 regel:'Særskriving kan gi heilt feil meining. «Lammelår» = mat. «Lamme lår» = paralyserte lår.',
 eks:'lammelår vs. lamme lår, tunfiskbitar vs. tunfisk bitar'},

{kat:'samansett',kat_label:'Samansette ord',type:'cloze',vanske:'lett',
 q:'Skriv rett: «Ho fekk ein stor ___ av besteveninna» (kjempe + klem)',
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

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'open',vanske:'lett',
 q:'Del opp til to setningar: «Det var kaldt ute og han ville ikkje gå og han vart heime.»',
 hint:'Del opp der eit nytt hovudpoeng startar. Sett punktum og stor bokstav.',
 eksempel_svak:'«Det var kaldt ute og han ville ikkje gå.»  (framleis samankopling av setningar)',
 eksempel_god:'«Det var kaldt ute. Han ville ikkje gå og vart heime.»',
 regel:'Del opp samankopling av setningarar. Ein tanke per setning gir betre flyt.',
 eks:'Det var kaldt ute. Han ville ikkje gå og vart heime.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
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

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'open',vanske:'medium',
 q:'Skriv om til éi god setning: «Brettspel er bra. Brettspel samlar folk. Brettspel er sosialt.»',
 hint:'Slå saman til éi setning. Bruk eit pronomen eller synonym i staden for «Brettspel» fleire gonger.',
 eksempel_svak:'«Brettspel er bra, sosialt og samlar folk.»  (litt flat, men betre)',
 eksempel_god:'«Brettspel er sosialt og samlar folk til felles aktivitet.»',
 regel:'Slå saman setningar med same tema. Unngå å starte fleire setningar på rad med same ord.',
 eks:'Brettspel er sosialt og samlar folk til felles aktivitet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'mc',vanske:'medium',
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

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'open',vanske:'vanskeleg',
 q:'Skriv om utan munnleg språk: «Klimaendringar er et veldig stort problem og sånn, og det påverkar alle og vi bør gjere noko.»',
 hint:'Fjern «og sånn». Bytt «veldig stort» med eit meir presist ord. Del opp samankopling av setningarane.',
 eksempel_svak:'«Klimaendringar er eit stort problem som påverkar oss alle.»  (bra, men kan vere meir presist)',
 eksempel_god:'«Klimaendringar er eit alvorleg globalt problem som krev handling frå alle.»',
 regel:'Fjern «og sånn», vage ord og samankopling av setningarar. Bruk presist og variert ordval.',
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
 q:'Kor mange avsnitt bør ein fagartikkel minimum ha?',
 alt:['3 (innleiing, hovuddel, avslutting)','1 (berre hovuddel)','5','Tal på avsnitt spelar inga rolle'],
 fasit:'3 (innleiing, hovuddel, avslutting)',
 regel:'Alle tekstar bør ha minimum tre delar: innleiing, hovuddel og avslutting.',
 eks:'Innleiing: 1–2 avsnitt. Hovuddel: 2–4 avsnitt. Avslutting: 1 avsnitt.'},

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
 alt:['Debattinnlegget presenterer påstand/meining tidleg; fagartikkelen er nøytral','Fagartikkelen har alltid fleire avsnitt','Debattinnlegget treng ikkje innleiing','Fagartikkelen brukar aldri kjelder'],
 fasit:'Debattinnlegget presenterer påstand/meining tidleg; fagartikkelen er nøytral',
 regel:'Fagartikkel: nøytral, informativ. Debattinnlegg: tek tydeleg standpunkt frå første avsnitt.',
 eks:'FA: «Plastforureining er eit stort problem.» DI: «Eg meiner plastposen bør forbydast no!»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'cloze',vanske:'medium',
 q:'Debattinnlegget sin avslutting bør ha ein tydeleg ___ til lesaren.',
 hint:'Kva kallar vi det når ein oppmodar nokon til å endre meining eller handle? Byrjar på «a».',
 fasit:'appell',fasit_v:['appell','oppmoding','handlingsoppmoding','oppfordring'],
 regel:'I debattinnlegg avsluttar ein gjerne med ein appell – ei oppmoding om handling eller haldningsendring.',
 eks:'«Det er på tide at vi alle tek ansvar – start i dag!»'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'mc',vanske:'medium',
 q:'Kor høyrer eit motargument heime i eit debattinnlegg?',
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



{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'lett',
 sporsmal:'Sett orda i rett rekkjefølge (vanleg rekkjefølge):',
 ord:['Jenta','las','ei','bok','på','senga','.'],
 fasit:'Jenta las ei bok på senga .',
 regel:'Grunnrekkjefølge: Subjekt – Verbal – Objekt – Adverbial.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 sporsmal:'Sett orda i rett rekkjefølge (V2, tidsadverbial fremst):',
 ord:['I','dag','skal','vi','ha','prøve','.'],
 fasit:'I dag skal vi ha prøve .',
 regel:'«I dag» er adverbial fremst → verb (skal) kjem på plass 2.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'medium',
 sporsmal:'Sett orda i rett rekkjefølge (V2, stadadverbial fremst):',
 ord:['Her','bur','mange','innvandrarar','.'],
 fasit:'Her bur mange innvandrarar .',
 regel:'«Her» fremst → verb (bur) på plass 2 FØR subjektet.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'vanskeleg',
 sporsmal:'Sett orda i rett rekkjefølge (spørjesetning):',
 ord:['Kvifor','kom','du','ikkje','i','går','?'],
 fasit:'Kvifor kom du ikkje i går ?',
 regel:'I spørjesetningar: spørjeord – verb – subjekt – resten.'},

{kat:'setningsbygging',kat_label:'Setningsbygging',type:'drag_ord',vanske:'vanskeleg',
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
{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'lett',
 sporsmal:'Sett orda i rett rekkjefølge: bindeordet kjem mellom dei to setningane.',
 hint:'Kva bindeord høyrer heime her?',
 ord:['Ho vart','trøytt','difor','gjekk','ho heim'],
 fasit:['Ho vart','trøytt','difor','gjekk','ho heim'],
 regel:'«Difor» kjem mellom dei to setningane. Merk V2: etter «difor» kjem verbet «gjekk» før subjektet «ho».',
 eksempel:'Ho vart trøytt, difor gjekk ho heim.',kontrast_bm:'Hun ble trøtt, derfor gikk hun hjem.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
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


{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Difor»):',
 ord:['Difor','gjekk','ho','heim','tidleg','.'],
 fasit:'Difor gjekk ho heim tidleg .',
 regel:'Etter «difor» kjem verbet FØR subjektet (V2-regelen).'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Likevel»):',
 ord:['Likevel','møtte','han','opp','på','skulen','.'],
 fasit:'Likevel møtte han opp på skulen .',
 regel:'Etter «likevel» kjem verbet FØR subjektet: Likevel møtte han.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'medium',
 sporsmal:'Sett orda i rett rekkjefølge (V2 etter «Dessutan»):',
 ord:['Dessutan','er','det','billegare','å','sykle','.'],
 fasit:'Dessutan er det billegare å sykle .',
 regel:'V2 etter adverbial: Dessutan er det. Verbet kjem på plass 2.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'vanskeleg',
 sporsmal:'Sett orda i rett rekkjefølge (leddsetning med «fordi»):',
 ord:['Ho','vann','fordi','ho','øvde','mykje','.'],
 fasit:'Ho vann fordi ho øvde mykje .',
 regel:'«Fordi» innleier leddsetning. Subjektet kjem FØR verbet i leddsetning.'},

{kat:'bindeord',kat_label:'Bindeord',type:'drag_ord',vanske:'vanskeleg',
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

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'cloze',vanske:'medium',
 q:'Fyll inn: «Ho er ei ___ jente» (stille, adjektiv)',
 fasit:'stille',fasit_v:['stille'],
 hint:'Adjektivet «stille» – skriv det med dobbel konsonant.',
 regel:'«Stille» (roleg) har alltid dobbel l.',
 eks:'ei stille natt, ein stille dag'},

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
 q:'Kva er rett skrivemåte? «Mora ropa ___ bort til meg» (å rope, fortid)',
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

{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'mc',vanske:'vanskeleg',
 q:'Kva ord HAR dobbel konsonant?',
 alt:['bate (å ha nytte)','bile (å køyre bil)','kake (ei søt mat)','hake (ein hakk)'],fasit:'bate (å ha nytte)',
 regel:'«Å bate» (= å nytte) SKAL ha dobbel t: «batte». Utan dobbel t endrar det tyding.',
 eks:'Det batta ikkje å prøve.'},


/* ── DOBBEL KONSONANT – ekstra (8 nye) ── */
{kat:'dobbel_konsonant',kat_label:'Dobbel konsonant',type:'drag_kolonne',vanske:'medium',
 q:'Sorter orda: kva er RIKTIG skrive, og kva er FEIL?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'hoppe', fasit:0},
   {tekst:'hoppe', fasit:0},
   {tekst:'sitte', fasit:0},
   {tekst:'hoper', fasit:1},
   {tekst:'siter', fasit:1},
   {tekst:'kaffe', fasit:0},
   {tekst:'kafe', fasit:1},
   {tekst:'løpe', fasit:0},
 ],
 regel:'Dobbel konsonant etter kort vokal: hop-pe, sit-te, kaf-fe.'},

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
 q:'Verb i presens – riktig eller feil?',
 kolonner:['Riktig skrive','Feil skrive'],
 ord:[
   {tekst:'hoppar', fasit:0},
   {tekst:'hoppar', fasit:0},
   {tekst:'sitter', fasit:0},
   {tekst:'hoper', fasit:1},
   {tekst:'løper', fasit:0},
   {tekst:'løpper', fasit:1},
   {tekst:'legger', fasit:0},
   {tekst:'leger', fasit:1},
 ],
 regel:'I presens kan verbet ha dobbel konsonant viss rota har kort vokal: hoppAR, sittER.'},

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
 q:'Kva er rett skrivemåte?',
 alt:['kjønn','skjønn','chønn','kjønn'],fasit:'kjønn',
 regel:'«Kjønn» (hankjønn/hokjønn/inkjekjønn) skriv ein med «kj».',
 eks:'eit substantiv har eit grammatisk kjønn'},

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



/* ── ORDKLASSAR (5 oppgåver) ── */
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

/* ── OPPGÅVETOLKING (14) ── */
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

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'open',vanske:'medium',
 q:'Bryt ned oppgåva til ei sjekkboksliste: «Presenter temaet plast i havet, grei ut om dei viktigaste årsakene, og drøft moglege løysingar. Bruk minst to kjelder.»',
 hint:'Finn kvart bestillingsord. Kvar del blir eitt punkt på lista.',
 eksempel_svak:'[ ] Skriv om plast i havet.  (for vagt, dekkjer ikkje alle delane)',
 eksempel_god:'[ ] Presentere temaet plast i havet.  [ ] Greie ut om dei viktigaste årsakene.  [ ] Drøfte moglege løysingar (argument for og mot).  [ ] Bruke minst to kjelder.',
 regel:'Identifiser kvart bestillingsord og gjer det om til eit konkret handlingspunkt. Kvar del av oppgåva = eitt sjekkpunkt.',
 eks:'Oppgåva inneheld tre bestillingsord: presenter, grei ut, drøft. + eitt krav: minst to kjelder.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'medium',
 q:'Oppgåva ber om å «drøfte». Kva innleiar er eit BOMSKOT?',
 alt:['«Det er ulike meiningar om dette temaet…»','«I denne teksten vil eg sjå på argument for og mot…»','«Her kjem historia om då eg sjølv opplevde…»','«Mange meiner at X, men andre hevdar at Y…»'],
 fasit:'«Her kjem historia om då eg sjølv opplevde…»',
 regel:'«Drøft» ber om ein resonnerande tekst, ikkje ei personleg forteljing. Innleiinga skal signalisere at du vil vurdere ulike sider av saka.',
 eks:'BOMSKOT: starte som ei novelle. RETT: presentere saka og varsle om at du vil drøfte ho.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'cloze',vanske:'medium',
 q:'Oppgåva seier «reflekter». Det betyr at du skal ___ emnet med eigne argument og innsikter.',
 hint:'«Reflekter» er meir enn å beskrive – du skal tenke over og vurdere.',
 fasit:'vurdere og tenke kritisk over',
 fasit_v:['vurdere','tenke kritisk','reflektere over','drøfte'],
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

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'open',vanske:'vanskeleg',
 q:'Les oppgåva og skriv éi presis problemstilling: «Ungdom bruker meir tid på sosiale medium enn nokonsinne. Drøft kva konsekvensar dette har for identitetsutvikling.»',
 hint:'Problemstillinga skal gjere instruksen om til eit spørsmål som teksten din svarar på. Hugs at «drøft» betyr fleire sider.',
 eksempel_svak:'«Kva er sosiale medium?»  (for breitt – svarar ikkje på instruksen)',
 eksempel_god:'«Kva positive og negative konsekvensar har auka bruk av sosiale medium for korleis ungdom utviklar identiteten sin?»',
 regel:'Problemstillinga skal (1) spegle bestillingsord (drøft = fleire sider), (2) innehalde emnet (identitetsutvikling), og (3) vere presis nok til å avgrense teksten.',
 eks:'Ei god problemstilling gjer «drøft» synleg: ho inviterer til argument for og mot.'},

{kat:'oppgavetolking',kat_label:'Oppgåvetolking',type:'mc',vanske:'vanskeleg',
 q:'Oppgåva seier: «Analyser ein av kjeldene du har brukt.» Kva avgrensing overser elevar oftast?',
 alt:['At dei skal bruke fagomgrep','At teksten skal vere lang nok','At dei skal velje berre éin kjelde','At dei skal skrive på nynorsk'],
 fasit:'At dei skal velje berre éin kjelde',
 regel:'«Ein av kjeldene» er ei eksplisitt avgrensing. Mange skriv om alle kjeldene fordi dei les for fort. Marker alltid talord i oppgåva som ein del av sjekkbokslista di.',
 eks:'«Ein av» = berre éi kjelde. «Minst to» = minimum to. Talord i oppgåva avgrensar omfanget.'},

/* ── TEKSTSTRUKTUR: Sorter burgeren, Linjeskift-kuttaren, Overskrifts-ruletten ── */
{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'lett',
 q:'Sorter burgeren! Dra kvart avsnitt til rett lag: Topp-brød (Innleiing), Kjøt (Hovuddel) eller Botn-brød (Avslutning).',
 lag:['🍞 Topp-brød · Innleiing','🥩 Kjøt · Hovuddel','🍞 Botn-brød · Avslutning'],
 avsnitt:[
  {tekst:'Plast i havet er eit aukande problem som påverkar dyr og natur over heile verda.',fasit:0},
  {tekst:'Éi løysing er å innføre strengare regulering av eingongsplast i alle EU-land.',fasit:1},
  {tekst:'I tillegg kan produsentar påleggjast å bruke meir resirkulert materiale.',fasit:1},
  {tekst:'Kjeldesortering og betre infrastruktur i fattigare land kan òg redusere problemet.',fasit:1},
  {tekst:'Alt i alt viser dette at løysinga på plastforureining krev samarbeid på tvers av landegrenser.',fasit:2}
 ],
 regel:'Innleiinga presenterer temaet, hovuddelen utdjupar argumenta, og avsluttinga summerer eller konkluderer.',
 eks:'Innleiing → presentasjon · Hovuddel → argument/analyse · Avslutning → konklusjon'},

{kat:'tekststruktur',kat_label:'Tekststruktur',type:'burger_sort',vanske:'medium',
 q:'Sorter burgeren! Dra kvart avsnitt til rett lag i ein fagartikkel om sosiale medium.',
 lag:['🍞 Topp-brød · Innleiing','🥩 Kjøt · Hovuddel','🍞 Botn-brød · Avslutning'],
 avsnitt:[
  {tekst:'Sosiale medium brukar algoritmane sine til å vise oss innhald vi allereie er einige i.',fasit:1},
  {tekst:'Kva konsekvensar har den eksploderande veksten i sosiale medium for ungdommen si psykiske helse?',fasit:0},
  {tekst:'Samla sett er det tydeleg at bruken av sosiale medium krev medvit, grenser og digital folkeskikk.',fasit:2},
  {tekst:'Studiar frå fleire land viser at mykje tid på sosiale medium heng saman med auka angst.',fasit:1}
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

/* ── SPRÅK OG STIL (18) ── */
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

{kat:'spraak_stil',kat_label:'Språk og stil',type:'open',vanske:'medium',
 q:'Frå dagbok til fagtekst: Skriv om teksten under til ei sakleg innleiing for ein fagartikkel. Behåld fakta, men bytt ut dagbokstilen.\n\n«Kjære dagbok, i dag lærte eg at plast drep skjelpadder, det er jo heilt sjukt :(»',
 hint:'Fjern «Kjære dagbok», «i dag lærte eg», :( og uformelle uttrykk. Start med det faktiske faktumet som subjekt.',
 eksempel_svak:'Plast i havet er farleg for dyr som skjelpadder. (Rett retning, men manglar presisjon og fagleg tone.)',
 eksempel_god:'Plastsøppel i havet utgør ein reell trussel mot sjødyr som skjelpadder, som kan forveksle plastbitar med mat.',
 regel:'Fagartiklar startar ikkje med «kjære dagbok» eller «i dag lærte eg». Set fakta og forskingsspørsmål først – utan forfattaren i sentrum.',
 eks:'«I dag lærte eg at…» → «Forskinga viser at…» · «heilt sjukt :(» → «ein dokumentert trussel»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'open',vanske:'medium',
 q:'Avslutnings-fikseren: Teksten sluttar slik: «No håpar eg de lærte noko, hadet bra!» Skriv ei fagleg avslutning på maks 20 ord som passar ein fagartikkel om plastforureining i staden.',
 hint:'Avsluttinga bør oppsummere hovudpoenget og/eller peike framover. Ikkje henvend deg til lesaren som om dei er vener.',
 eksempel_svak:'Dette var alt om plast. Håpar de likte teksten! (Framleis for uformell.)',
 eksempel_god:'Samla sett viser dette at plastforureining krev koordinert innsats frå politikarar, næringsliv og enkeltpersonar.',
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

{kat:'spraak_stil',kat_label:'Språk og stil',type:'open',vanske:'medium',
 q:'Skriv omformuleringa: Gjer setninga sakleg og fagleg utan å miste innhaldet.\n\n«Eg trur eigentleg at skjermbruk er ganske dårleg for unge, for dei blir jo heilt oppslukte.»',
 hint:'Fjern «eg trur», «eigentleg», «ganske», «jo» og «heilt». Bruk ein nøytral formulering med presis verknad.',
 eksempel_svak:'Skjermbruk er dårleg for unge fordi dei blir oppslukte. (Mindre munnleg, men framleis lite presist.)',
 eksempel_god:'Høg skjermbruk kan redusere konsentrasjon og søvnkvalitet hos unge.',
 regel:'I fagtekst bør du prioritere nøytral ordbruk, konkret verknad og etterprøvbare påstandar.',
 eks:'«Eg trur» → «studiar tyder på» · «heilt oppslukte» → «redusert konsentrasjon»'},

{kat:'spraak_stil',kat_label:'Språk og stil',type:'open',vanske:'vanskeleg',
 q:'Skriv omformuleringa: Omskriv til formell stil med same meining.\n\n«Plast i havet er skikkeleg krise, og dyra slit skikkeleg mykje fordi folk berre kastar ting overalt.»',
 hint:'Byt ut «skikkeleg» og «berre». Bruk faglege ord som «forureining», «konsekvensar» og «avfallshandtering».',
 eksempel_svak:'Plast i havet er krise, og dyra slit mykje fordi folk kastar ting. (Ryddigare, men ikkje heilt formell.)',
 eksempel_god:'Plastforureining i havet har alvorlege konsekvensar for dyrelivet, særleg der avfallshandtering er utilstrekkeleg.',
 regel:'Formell stil krev presise fagord og mindre munnleg uttrykk.',
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
 q:'Fyll inn eit formelt overgangsord: «___ tyder funna på at tiltaket har effekt.»',
 hint:'Vel eit ord som oppsummerer fleire punkt og bind saman argumenta.',
 fasit:'Samla sett',
 fasit_v:['Samla sett','Alt i alt'],
 regel:'Overgangsord som oppsummerer argument gjer teksten strammare og meir fagleg.',
 eks:'«Samla sett» er ofte betre enn munnlege overgangar som «uansett» i fagtekst.'},

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

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'open',vanske:'vanskeleg',
 q:'Krymparen – ti-ords-utfordring: Reduser avsnittet under til éi kjerne-setning på maks 10 ord.\n\n«Dei siste hundre åra har menneskeskapt utslepp av klimagassar som CO2 og metan ført til ei gradvis stigande gjennomsnittstemperatur over heile kloden, noko som truar økosystem og værmønster verda over.»',
 hint:'Finn hovudpoenga: kva skjer (temperaturen stig), kvifor (utslepp) og kva konsekvens (truar natur). Ta med berre kjernen.',
 eksempel_svak:'Menneskeskapt CO2 og metan fører til klimaendringar globalt. (11 ord – prøv igjen!)',
 eksempel_god:'Klimagassutslepp aukar temperaturen og truar naturlege system. (8 ord ✓)',
 regel:'Å krynga ei kjelde tvingar deg til å forstå ho – og hindrar deg i å kopiere setningar ordrett. Finn kjernen og la resten gå.',
 eks:'Lang kjelde + 10-ords-grense = di eiga formulering. Det er ikkje mogleg å plagiere og samstundes halde seg til grensa.'},

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

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'open',vanske:'medium',
 q:'Tolken: Les sitatet, og skriv neste setning. Ho MÅ starte med: «Dette betyr eigentleg at…»\n\n«Mikroplastpartiklar er funne i blodet hos 80 % av testa vaksne.»',
 hint:'Forklar kva sitatet betyr i praksis – ikkje berre gjenta faktumet. Kva konsekvensar har det? Kven gjeld det?',
 eksempel_svak:'Dette betyr eigentleg at mikroplast er funne i blod. (Repeterer berre sitatet, gir inga ny innsikt.)',
 eksempel_god:'Dette betyr eigentleg at plast ikkje berre er eit miljøproblem, men òg ein direkte helsetrussel for kvart einaste menneske.',
 regel:'Etter eit sitat kjem alltid di eiga forklaring av kva det betyr. Sitatet åleine er ikkje argumentet – tolkinga er det.',
 eks:'Struktur: [Sitat.] + «Dette betyr eigentleg at [din analyse av konsekvens/tyding].»'},

{kat:'kjeldebruk',kat_label:'Kjeldebruk',type:'mc',vanske:'medium',
 q:'Metatekst-støvsugaren: Kva setning er metatekst – der forfattaren snakkar om sin eigen tekst i staden for å kome rett til saka?',
 alt:['I denne teksten skal eg skrive om klimaendringar.','Klimaendringar har ført til meir ekstremvær dei siste tiåra.','Mange land har innført CO2-avgifter for å redusere utslepp.','Plastforureining truar marint dyreliv i Nordsjøen.'],
 fasit:'I denne teksten skal eg skrive om klimaendringar.',
 regel:'Metatekst er setningar der forfattaren omtalar seg sjølv og sin eigen tekst («I denne teksten skal eg…», «No skal eg forklare…»). Slike setningar er bortkasta ord – kom rett til saka i staden.',
 eks:'METATEKST: «I denne teksten kjem eg til å…» · FAGLEG: Start med fakta, problemstilling eller definisjon.'},
]; // end MT_BANK

/* ══════════════════════════════════════════════════════
   MENGDETRENING – state & logikk
══════════════════════════════════════════════════════ */
const MTS = { tasks:[], idx:0, score:0, answered:false, config:{}, streak:0, history:[] };

function mtShuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function $mt(id){ return document.getElementById(id); }
function mtEsc(s){ if(!s)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>'); }

function mtStart(){
  const kat    = $mt('mt-kat').value;
  const vanske = $mt('mt-vanske').value;
  const antal  = Math.min(15, Math.max(3, parseInt($mt('mt-antal').value)||8));

  let pool = kat==='blanda' ? [...MT_BANK] : MT_BANK.filter(t=>t.kat===kat);
  if(vanske!=='adaptiv') pool = pool.filter(t=>t.vanske===vanske);
  pool = mtShuffle(pool).slice(0, antal);
  if(vanske==='adaptiv'){ const o={lett:0,medium:1,vanskeleg:2}; pool.sort((a,b)=>o[a.vanske]-o[b.vanske]); }

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

  const vCls={ lett:'background:#e8f6f0;color:#1a5c42', medium:'background:#fffbe8;color:#6b4a00', vanskeleg:'background:#fff0ed;color:#8b2a0a' }[t.vanske]||'';
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
    const k0 = mtEsc(t.kolonner[0]);
    const k1 = mtEsc(t.kolonner[1]);
    inputHTML=`<div style="margin-top:0.8rem">
      <div id="mtdk-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1rem;padding:0.6rem;background:#f8f7f4;border-radius:8px;min-height:40px">
        ${shuffled.map((o,i)=>`<button class="mtdk-token" data-i="${i}" data-fasit="${o.fasit}" data-placed="-1" onclick="mtkMove(this)"
          style="background:#fff;border:1px solid #d5d2cb;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;padding:6px 14px;cursor:pointer;transition:background 0.12s">${mtEsc(o.tekst)}</button>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div id="mtdk-col-0" style="background:#e8f6f0;border:2px dashed #82c9a8;border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px">
          <div style="font-weight:600;color:#1a5c42;margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">${k0}</div>
          <div id="mtdk-placed-0" style="display:flex;flex-wrap:wrap;gap:6px"></div>
        </div>
        <div id="mtdk-col-1" style="background:#fff0ed;border:2px dashed #f0a090;border-radius:8px;min-height:80px;padding:0.6rem;font-size:13px">
          <div style="font-weight:600;color:#7f1d1d;margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">${k1}</div>
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


/* ══════════════════════════════════════════════════════
   VURDERINGSØVING – state & logikk
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   VURDERINGSØVING – hardkoda tekstar + steg-logikk
══════════════════════════════════════════════════════ */

/* Rubrikk-kategoriar – same som Fagdag V26 */
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
  step: 0,          // 0-2 = tekstar, 3 = karaktersetjing
  rubrikk: [        // per tekst: {kat_id: 'u'|'k'|'s'}
    {}, {}, {}
  ],
  notat: ['','',''],   // fritext-notat per tekst
  karakterar: [null, null, null],
  grunngjeving: ['','',''],
};

/* Helpers */
function $vr(id){ return document.getElementById(id); }
function escVr(s){
  if(!s)return'';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/\n/g,'<br>');
}

/* ── Step indicator ──────────────────────────── */
function vrBuildSteps(){
  const wrap=$vr('vr-steps');
  if(!wrap)return;
  const labels=['Tekst A','Tekst B','Tekst C','Karaktersetjing'];
  wrap.innerHTML='';
  labels.forEach((lbl,i)=>{
    if(i>0){
      const line=document.createElement('div');
      line.id=`vr-step-line-${i}`;
      line.style.cssText=`flex:1;height:2px;background:${i<=VRS2.step?'#be185d':'#e5e2db'};max-width:40px;min-width:12px;transition:background 0.3s`;
      wrap.appendChild(line);
    }
    const btn=document.createElement('button');
    btn.id=`vr-step-btn-${i}`;
    const done=i<VRS2.step;
    const active=i===VRS2.step;
    btn.style.cssText=`width:36px;height:36px;border-radius:50%;border:2px solid ${active?'#be185d':done?'#be185d':'#e5e2db'};background:${active?'#be185d':done?'#fce7f3':'#fff'};color:${active?'#fff':done?'#be185d':'#8a8a84'};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:${done?'pointer':'default'};transition:all 0.2s;flex-shrink:0;display:flex;align-items:center;justify-content:center`;
    btn.textContent=done?'✓':(i+1);
    btn.title=lbl;
    btn.onclick=()=>{ if(i<VRS2.step) vrGoStep(i); };
    // Label below
    const grp=document.createElement('div');
    grp.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px';
    grp.appendChild(btn);
    const lbl_el=document.createElement('span');
    lbl_el.style.cssText=`font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${active?'#be185d':done?'#be185d':'#8a8a84'};font-weight:${active||done?'500':'400'};white-space:nowrap`;
    lbl_el.textContent=lbl;
    grp.appendChild(lbl_el);
    wrap.appendChild(grp);
  });
}

function vrGoStep(i){
  VRS2.step=i;
  vrRender();
}

/* ── Main render dispatcher ─────────────────── */
function vrRender(){
  vrBuildSteps();
  if(VRS2.step<3) vrRenderTekst(VRS2.step);
  else            vrRenderKarakter();
}

/* ── Steg 1-3: tekst + rubrikk ──────────────── */
function vrRenderTekst(idx){
  const t=VR_TEKSTAR[idx];
  const rub=VRS2.rubrikk[idx];
  const filled=Object.keys(rub).length;
  const total=VRC.length;
  const allDone=filled===total;

  // Build rubric rows
  let rubRows='';
  VRC.forEach(kat=>{
    const cur=rub[kat.id]||'';
    rubRows+=`<tr style="border-bottom:1px solid #f3f0ea">
      <td style="padding:0.7rem 0.9rem;font-size:13px;font-weight:500;color:#1a1a18;vertical-align:top;width:18%">${kat.lbl}</td>
      ${['u','k','s'].map((v,vi)=>{
        const bg  =['#fff0ed','#fffbe8','#e8f6f0'][vi];
        const sel =['#d45a2f','#c7922e','#2e8b6a'][vi];
        const selLight=['#ffd6c8','#ffe9a0','#a3dfc5'][vi];
        const txt=[kat.u,kat.k,kat.s][vi];
        const isSelected=cur===v;
        return `<td style="padding:0.35rem 0.4rem;vertical-align:top;background:${bg};width:27%">
          <label style="display:flex;align-items:flex-start;gap:7px;cursor:pointer;padding:0.45rem 0.6rem;border-radius:8px;background:${isSelected?selLight:'transparent'};border:2px solid ${isSelected?sel:'transparent'};transition:all 0.15s">
            <input type="radio" name="vr_${idx}_${kat.id}" value="${v}" ${isSelected?'checked':''} onchange="vrSetRub(${idx},'${kat.id}','${v}')" style="margin-top:2px;accent-color:${sel};flex-shrink:0">
            <span style="font-size:12px;color:#2a2a28;line-height:1.55">${txt}</span>
          </label>
        </td>`;
      }).join('')}
    </tr>`;
  });

  // Notat field
  const savedNotat=VRS2.notat[idx]||'';

  $vr('vr-panel').innerHTML=`
    <!-- Tekst-kort -->
    <div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;overflow:hidden;margin-bottom:1.5rem">
      <div style="background:#fdf2f8;border-bottom:1px solid #f9a8d4;padding:0.9rem 1.4rem;display:flex;align-items:baseline;gap:12px">
        <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#be185d;font-weight:500">Tekst ${escVr(t.id)}</span>
        <h3 style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:600;color:#1a1a18;margin:0">${escVr(t.tittel)}</h3>
      </div>
      <div style="padding:1.4rem 1.6rem;font-size:14px;color:#2a2a28;line-height:1.85;white-space:pre-line;font-family:'Fraunces',serif;font-style:italic">${escVr(t.tekst)}</div>
    </div>

    <!-- Rubrikk -->
    <div style="margin-bottom:1.2rem">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.8rem;flex-wrap:wrap">
        <h3 style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:600;color:#1a1a18;margin:0">Vurder tekst ${escVr(t.id)} med rubrikken</h3>
        <span id="vr-rubr-progress" style="font-size:12px;background:${allDone?'#e8f6f0':'#f3f0ea'};color:${allDone?'#1a5c42':'#8a8a84'};padding:3px 10px;border-radius:99px">${filled}/${total} fylt inn</span>
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

    <!-- Notat -->
    <div style="margin-bottom:1.5rem">
      <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Notatar til teksten (valfritt)</label>
      <textarea id="vr-notat-${idx}" rows="3" style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:10px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;outline:none;resize:vertical;line-height:1.6;transition:border-color 0.15s" placeholder="Skriv observasjonar, sitat frå teksten eller eigne kommentarar…" oninput="vrSaveNotat(${idx})">${escVr(savedNotat)}</textarea>
    </div>

    <!-- Navigation -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      ${idx>0?`<button onclick="vrGoStep(${idx-1})" style="background:transparent;border:1px solid #e5e2db;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 22px;cursor:pointer;color:#4a4a46">← Førre tekst</button>`:'<span></span>'}
      <div style="display:flex;gap:10px;align-items:center">
        <button onclick="vrNext(${idx})" style="background:#be185d;color:#fff;border:none;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 26px;cursor:pointer;transition:all 0.2s">
          ${idx<2?'Neste tekst →':'Til karaktersetjing →'}
        </button>
      </div>
    </div>`;

  // Restore textarea focus/value (re-query after innerHTML)
  const ta=$vr(`vr-notat-${idx}`);
  if(ta) ta.value=VRS2.notat[idx]||'';
}

function vrSetRub(idx, kat, val){
  VRS2.rubrikk[idx][kat]=val;
  vrRenderTekst(idx); // re-render to update progress + highlight
  // Restore scroll position by keeping rubric in view
}

function vrSaveNotat(idx){
  const ta=$vr(`vr-notat-${idx}`);
  if(ta) VRS2.notat[idx]=ta.value;
}

function vrNext(idx){
  vrSaveNotat(idx);
  VRS2.step=idx+1;
  vrRender();
  document.getElementById('vr-outer').scrollIntoView({behavior:'smooth',block:'start'});
}

/* ── Steg 4: Karaktersetjing ────────────────── */
function vrRenderKarakter(){
  // Summary of rubric choices per text
  const lvlLbl={u:'Under utvikling',k:'Kompetent',s:'Svært kompetent'};
  const lvlBg ={u:'#fff0ed',k:'#fffbe8',s:'#e8f6f0'};
  const lvlCol={u:'#d45a2f',k:'#c7922e',s:'#2e8b6a'};

  let sumCards='';
  VR_TEKSTAR.forEach((t,i)=>{
    const rub=VRS2.rubrikk[i];
    let rows='';
    VRC.forEach(kat=>{
      const v=rub[kat.id]||'';
      rows+=`<tr style="border-bottom:1px solid #f3f0ea">
        <td style="padding:0.45rem 0.7rem;font-size:13px;color:#4a4a46;font-weight:500">${kat.lbl}</td>
        <td style="padding:0.45rem 0.7rem">
          <span style="font-size:12px;padding:2px 10px;border-radius:99px;background:${lvlBg[v]||'#f3f0ea'};color:${lvlCol[v]||'#8a8a84'}">${lvlLbl[v]||'–'}</span>
        </td>
      </tr>`;
    });
    const saved=VRS2.karakterar[i];
    const savedGr=VRS2.grunngjeving[i]||'';
    sumCards+=`
      <div style="background:#fff;border:1px solid #e5e2db;border-radius:14px;overflow:hidden;margin-bottom:1.2rem">
        <div style="background:#fdf2f8;border-bottom:1px solid #f9a8d4;padding:0.8rem 1.2rem;display:flex;align-items:baseline;gap:10px">
          <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#be185d;font-weight:500">Tekst ${t.id}</span>
          <span style="font-family:'Fraunces',serif;font-size:1rem;font-weight:600;color:#1a1a18">${escVr(t.tittel)}</span>
        </div>
        <div style="padding:1rem 1.2rem">
          <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">${rows}</table>
          ${VRS2.notat[i]?`<div style="background:#faf8f4;border-radius:8px;padding:0.6rem 0.9rem;font-size:13px;color:#4a4a46;margin-bottom:1rem;font-style:italic">"${escVr(VRS2.notat[i])}"</div>`:''}
          <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
            <div>
              <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Karakter</label>
              <select id="vr-kar-${i}" onchange="vrSaveKar(${i})" style="background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;padding:8px 14px;outline:none;appearance:auto;min-width:90px">
                <option value="">–</option>
                ${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${saved===n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;min-width:220px">
              <label style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a84;display:block;margin-bottom:5px">Grunngjeving (minst éi setning)</label>
              <textarea id="vr-gr-${i}" rows="2" oninput="vrSaveGr(${i})" style="width:100%;background:#fff;border:1px solid #e5e2db;border-radius:8px;color:#1a1a18;font-family:'DM Sans',sans-serif;font-size:14px;padding:8px 12px;outline:none;resize:vertical;line-height:1.6" placeholder="Kvifor denne karakteren?">${escVr(savedGr)}</textarea>
            </div>
          </div>
        </div>
      </div>`;
  });

  $vr('vr-panel').innerHTML=`
    <h3 style="font-family:'Fraunces',serif;font-size:1.2rem;font-weight:600;color:#1a1a18;margin-bottom:0.4rem">Setje karakter på tekstane</h3>
    <p style="font-size:14px;color:#4a4a46;margin-bottom:1.5rem;max-width:580px;line-height:1.65">Du har no vurdert alle tre tekstane med rubrikken. Set ein karakter (1–6) på kvar tekst og grunngjev valet ditt basert på rubrikken din.</p>
    ${sumCards}
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:1rem">
      <button onclick="vrGoStep(2)" style="background:transparent;border:1px solid #e5e2db;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 22px;cursor:pointer;color:#4a4a46">← Tilbake til Tekst C</button>
      <button onclick="vrLeverAlt()" style="background:#be185d;color:#fff;border:none;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 28px;cursor:pointer">Lever vurdering ✓</button>
    </div>
    <div id="vr-final" style="display:none;margin-top:1.5rem"></div>`;

  // Restore values
  VR_TEKSTAR.forEach((_,i)=>{
    const sel=$vr(`vr-kar-${i}`);
    if(sel&&VRS2.karakterar[i]) sel.value=VRS2.karakterar[i];
    const ta=$vr(`vr-gr-${i}`);
    if(ta) ta.value=VRS2.grunngjeving[i]||'';
  });
}

function vrSaveKar(i){
  const sel=$vr(`vr-kar-${i}`);
  if(sel) VRS2.karakterar[i]=parseInt(sel.value)||null;
}
function vrSaveGr(i){
  const ta=$vr(`vr-gr-${i}`);
  if(ta) VRS2.grunngjeving[i]=ta.value;
}

function vrLeverAlt(){
  // Validate all saved
  VR_TEKSTAR.forEach((_,i)=>{ vrSaveKar(i); vrSaveGr(i); });
  const missing=VR_TEKSTAR.filter((_,i)=>!VRS2.karakterar[i]||!VRS2.grunngjeving[i]?.trim());
  if(missing.length){
    alert('Fyll inn karakter og grunngjeving for alle tre tekstane.');
    return;
  }

  const lvlLbl={u:'Under utvikling',k:'Kompetent',s:'Svært kompetent'};
  const lvlCol={u:'#d45a2f',k:'#c7922e',s:'#2e8b6a'};
  const lvlBg ={u:'#fff0ed',k:'#fffbe8',s:'#e8f6f0'};

  let html=`
    <div style="background:#e8f6f0;border:1px solid #82c9a8;border-radius:14px;padding:1.4rem 1.6rem;margin-bottom:1.5rem">
      <div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:600;color:#1a5c42;margin-bottom:0.4rem">✓ Vurdering levert!</div>
      <p style="font-size:14px;color:#14532d;line-height:1.65">Du har fullført vurderingsoppgåva. Nedanfor ser du ei samanstilling av vurderingane dine. Læraren kan hjelpe deg samanlikne med fasit.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:1rem">`;

  VR_TEKSTAR.forEach((t,i)=>{
    const rub=VRS2.rubrikk[i];
    let rubSum='';
    VRC.forEach(kat=>{
      const v=rub[kat.id]||'';
      rubSum+=`<span style="font-size:12px;padding:2px 10px;border-radius:99px;background:${lvlBg[v]||'#f3f0ea'};color:${lvlCol[v]||'#8a8a84'};margin:2px">${kat.lbl}: ${lvlLbl[v]||'–'}</span>`;
    });
    html+=`
      <div style="background:#fff;border:1px solid #e5e2db;border-radius:12px;padding:1.2rem 1.4rem">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:0.6rem;flex-wrap:wrap">
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#be185d;font-weight:500">Tekst ${t.id}</span>
          <span style="font-family:'Fraunces',serif;font-size:1rem;font-weight:600;color:#1a1a18">${escVr(t.tittel)}</span>
          <span style="margin-left:auto;font-size:1.6rem;font-family:'Fraunces',serif;font-weight:700;color:#be185d">${VRS2.karakterar[i]}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:0.6rem">${rubSum}</div>
        <div style="font-size:13px;color:#4a4a46;font-style:italic">"${escVr(VRS2.grunngjeving[i])}"</div>
        ${VRS2.notat[i]?`<div style="margin-top:0.5rem;font-size:12px;color:#8a8a84;border-top:1px solid #f3f0ea;padding-top:0.5rem">Notat: ${escVr(VRS2.notat[i])}</div>`:''}
      </div>`;
  });
  html+=`</div>
    <button onclick="vrReset()" style="margin-top:1.5rem;background:#fce7f3;color:#831843;border:none;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:10px 24px;cursor:pointer">Start på nytt</button>`;

  const fin=$vr('vr-final');
  if(fin){ fin.innerHTML=html; fin.style.display='block'; }
  fin.scrollIntoView({behavior:'smooth',block:'start'});
}

function vrReset(){
  VRS2.step=0;
  VRS2.rubrikk=[{},{},{}];
  VRS2.notat=['','',''];
  VRS2.karakterar=[null,null,null];
  VRS2.grunngjeving=['','',''];
  vrRender();
  document.getElementById('vr-outer').scrollIntoView({behavior:'smooth',block:'start'});
}

/* Init */
vrBuildSteps();
vrRenderTekst(0);



/* ══════════════════════════════════════════════
   SJEKK-KNAPP (oppgåve 1–4 frisvarsoppgåver)
══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   SJEKK-KNAPP for mørk bakgrunn (typiske feil)
══════════════════════════════════════════════ */
function sjekkDarkEx(id) {
  const txt = document.getElementById(id + '-txt');
  const fb  = document.getElementById(id + '-fb');
  if (!fb) return;
  if (txt && !txt.value.trim()) {
    txt.style.borderColor = 'rgba(255,100,100,0.6)';
    txt.focus();
    return;
  }
  fb.style.display = 'block';
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function sjekkEx(id) {
  const txt = document.getElementById(id + '-txt');
  const fb  = document.getElementById(id + '-fb');
  if (!fb) return;
  if (txt && !txt.value.trim()) {
    txt.style.borderColor = '#d45a2f';
    txt.focus();
    return;
  }
  fb.classList.add('show');
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ══════════════════════════════════════════════
   DRA-SLEPP – bindeord
══════════════════════════════════════════════ */
let _dragWord = '';
let _dragTokenId = '';

function dragStart(e, word) {
  _dragWord    = word;
  _dragTokenId = e.target.id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', word);
}
function dragEnd(e) { /* nothing */ }

function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function drop(e, gapId, zoneId) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const gap = document.getElementById(gapId);
  if (!gap) return;

  // If the gap was already filled, return old token to bank
  const prev = gap.dataset.current;
  if (prev) returnTokenToBank(prev, zoneId);

  gap.textContent  = _dragWord;
  gap.dataset.current = _dragTokenId;
  gap.classList.add('filled');
  gap.classList.remove('correct', 'wrong');

  // Mark source token as used
  const tok = document.getElementById(_dragTokenId);
  if (tok) tok.classList.add('used');

  _dragWord = '';
  _dragTokenId = '';
}

function clearGap(gapId, zoneId) {
  const gap = document.getElementById(gapId);
  if (!gap || !gap.dataset.current) return;
  returnTokenToBank(gap.dataset.current, zoneId);
  gap.textContent = '';
  gap.dataset.current = '';
  gap.classList.remove('filled', 'correct', 'wrong');
}

function returnTokenToBank(tokenId, zoneId) {
  const tok = document.getElementById(tokenId);
  if (tok) tok.classList.remove('used');
}

function checkDrag(zoneId, words) {
  // Map word → gap for this zone by index
  const gaps = document.querySelectorAll(`#drag-zone-${zoneId} .drag-gap`);
  let allFilled = true;
  let allCorrect = true;
  gaps.forEach(gap => {
    if (!gap.dataset.current) { allFilled = false; return; }
    const correct = gap.textContent.trim().toLowerCase() === gap.dataset.fasit.toLowerCase();
    gap.classList.toggle('correct', correct);
    gap.classList.toggle('wrong', !correct);
    if (!correct) allCorrect = false;
  });

  const fb = document.getElementById(`drag-fb-${zoneId}`);
  if (!fb) return;
  fb.classList.add('show');

  if (!allFilled) {
    fb.className = 'drag-feedback show err';
    fb.textContent = 'Fyll inn alle blanke før du sjekkar.';
    return;
  }
  if (allCorrect) {
    fb.className = 'drag-feedback show ok';
    fb.textContent = '✓ Alle bindeord er på rett plass! Legg merke til korleis kvart bindeord knyt setningane saman på ulik måte.';
  } else {
    fb.className = 'drag-feedback show err';
    fb.textContent = '✗ Nokre bindeord er feil plasserte. Klikk på eit fylt felt for å fjerne det og prøve på nytt.';
  }
}

function resetDrag(zoneId, words, count) {
  // Clear all gaps
  const gaps = document.querySelectorAll(`#drag-zone-${zoneId} .drag-gap`);
  gaps.forEach(gap => {
    gap.textContent = '';
    gap.dataset.current = '';
    gap.classList.remove('filled', 'correct', 'wrong');
  });
  // Re-enable all tokens
  const bank = document.getElementById(`drag-bank-${zoneId}`);
  if (bank) {
    const toks = Array.from(bank.querySelectorAll('.drag-token'));
    toks.forEach(t => t.classList.remove('used'));
    // Shuffle order
    for (let i = toks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      bank.insertBefore(toks[j], toks[i]);
    }
  }
  // Clear feedback
  const fb = document.getElementById(`drag-fb-${zoneId}`);
  if (fb) { fb.className = 'drag-feedback'; fb.textContent = ''; }
}

/* Touch support for drag-drop */
(function addTouchDragSupport() {
  document.addEventListener('touchstart', e => {
    const tok = e.target.closest('.drag-token');
    if (!tok || tok.classList.contains('used')) return;
    _dragWord    = tok.dataset.word;
    _dragTokenId = tok.id;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!_dragWord) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const gap = el?.closest('.drag-gap');
    if (gap) {
      const zoneId = gap.id.replace(/dg(\d+)-\d+/, '$1');
      const prev = gap.dataset.current;
      if (prev) returnTokenToBank(prev, zoneId);
      gap.textContent = _dragWord;
      gap.dataset.current = _dragTokenId;
      gap.classList.add('filled');
      gap.classList.remove('correct', 'wrong');
      const tok = document.getElementById(_dragTokenId);
      if (tok) tok.classList.add('used');
    }
    _dragWord = '';
    _dragTokenId = '';
  }, { passive: true });
})();


/* ── Avsnittsinndeling-øving ── */
(function initAvsnitt(){
  const tekst = [
    {tekst:'Sosiale medium er ein viktig del av kvardagen til dei fleste unge i dag.',br:false},
    {tekst:'Plattformar som TikTok og Instagram brukast dagleg.',br:false},
    {tekst:'Mange lurer på om dette påverkar språket negativt.',br:false},
    {tekst:'Det er fleire positive sider ved sosiale medium.',br:true}, // correct break
    {tekst:'Forsking viser at unge skriv meir enn nokon gong tidlegare.',br:false},
    {tekst:'Dei tilpassar òg språket til ulike situasjonar.',br:false},
    {tekst:'Dette er ein viktig kompetanse.',br:false},
    {tekst:'Samstundes finst det utfordringar ein ikkje kan sjå vekk frå.',br:true}, // correct break
    {tekst:'Grensene mellom formelt og uformelt språk kan bli utydlege.',br:false},
    {tekst:'Det er difor viktig at skulen lærer elevar å meistre ulike sjangrar.',br:false},
  ];
  const CORRECT = [3, 7]; // index of sentences that start new paragraphs

  let marked = new Set();

  function render(){
    const el = document.getElementById('avsnitt-tekst');
    if(!el) return;
    el.innerHTML = tekst.map((s,i)=>{
      const isMarked = marked.has(i);
      return `<span id="av-s${i}" onclick="avsnittToggle(${i})" style="display:inline;padding:2px 3px;border-radius:3px;cursor:pointer;${i===0?'':''}${isMarked?'background:#dce8ff;border-bottom:2px solid #1a3a8a;':'border-bottom:2px solid transparent;'}" title="Trykk for å markere nytt avsnitt her">${i>0&&isMarked?'¶ ':' '}${s.tekst} </span>`;
    }).join('');
  }


/* ── Temasetningsøving ── */
(function initTema(){
  var avsnitt=[
    {label:'Avsnitt 1',s:['Klimaendringar påverkar vintersportsesongen direkte.','Snøsesongen har blitt kortare, og mange skiresortar stengte tidlegare enn planlagt.','Ifølgje NRK har behovet for kunstsnø aldri vore større (NRK, 2022).','Dette syner at naturleg snø ikkje lenger kan takast for gitt.'],fasit:0},
    {label:'Avsnitt 2',s:['Det kostar mykje energi å produsere kunstsnø.','Samstundes er det eit paradoks at skibakkar tek i bruk energikrevjande løysingar for å kompensere for klimaendringane.','Kunstsnøproduksjon er eit kontroversielt tema i miljødebatten.','Mange meiner bransjen bør satse på alternative aktivitetar i staden.'],fasit:2}
  ];
  var cur=0,sel=null;
  function render(){
    var el=document.getElementById('tema-exercise');
    if(!el)return;
    var av=avsnitt[cur];
    el.innerHTML='<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;margin-bottom:6px;font-family:sans-serif">'+av.label+'</div>'+av.s.map(function(s,i){return'<span onclick="temaSelect('+i+')" style="display:inline;padding:2px 4px;border-radius:4px;cursor:pointer;background:'+(sel===i?'#dce8ff':'transparent')+';border-bottom:2px solid '+(sel===i?'#1a3a8a':'transparent')+'">'+s+' </span>';}).join('');
  }
  window.temaSelect=function(i){sel=i;render();var f=document.getElementById('tema-fb');if(f)f.style.display='none';};
  window.temaSjekk=function(){
    if(sel===null){alert('Trykk på temasetning.');return;}
    var av=avsnitt[cur];var fb=document.getElementById('tema-fb');fb.style.display='block';
    if(sel===av.fasit){fb.setAttribute('style','display:block;background:#e8f6f0;color:#1a5c42;border-radius:8px;padding:0.6rem 0.9rem;font-size:13px;margin-top:0.6rem');fb.textContent='✓ Rett! '+av.s[av.fasit]+' er temasetning.';}
    else{fb.setAttribute('style','display:block;background:#fff0ed;color:#7f1d1d;border-radius:8px;padding:0.6rem 0.9rem;font-size:13px;margin-top:0.6rem');fb.textContent='Ikkje heilt. Sjå etter setninga som seier kva heile avsnittet handlar om.';}
  };
  window.temaReset=function(){sel=null;cur=(cur+1)%avsnitt.length;var f=document.getElementById('tema-fb');if(f)f.style.display='none';render();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else setTimeout(render,200);
})();

  window.avsnittToggle = function(i){
    if(i===0) return; // cannot start break before first sentence
    if(marked.has(i)) marked.delete(i);
    else marked.add(i);
    render();
  };

  window.avsnittSjekk = function(){
    const correct = new Set(CORRECT);
    const fb = document.getElementById('avsnitt-feedback');
    if(!fb) return;
    let hits=0, wrong=0;
    CORRECT.forEach(i=>{ if(marked.has(i)) hits++; });
    marked.forEach(i=>{ if(!correct.has(i)) wrong++; });
    fb.style.display='block';
    if(hits===CORRECT.length && wrong===0){
      fb.style.background='#e8f6f0'; fb.style.borderTop='1px solid #82c9a8'; fb.style.color='#1a5c42';
      fb.textContent='✓ Rett! Du fann begge avsnittsskifta. Teksten er delt inn i: 1) Innleiing om sosiale medium, 2) Positive sider, 3) Utfordringar.';
    } else {
      fb.style.background='#fff0ed'; fb.style.borderTop='1px solid #f0a090'; fb.style.color='#7f1d1d';
      fb.innerHTML=`Du fann ${hits} av ${CORRECT.length} riktige skift${wrong>0?`, og markerte ${wrong} feil stad${wrong>1?'ar':''}`:''}.`
        + ' Hint: Nye avsnitt startar der eit nytt hovudpoeng byrjar.';
    }
    render();
  };

  window.avsnittReset = function(){
    marked = new Set();
    const fb = document.getElementById('avsnitt-feedback');
    if(fb) fb.style.display='none';
    render();
  };

  // Init when DOM is ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();

// Init both steppers on load
makeStepper('fa', FA_TOTAL, 'fa');
makeStepper('di', DI_TOTAL, 'di');

/* ── Kinderegg ── */
function eggVis(){
  var m=document.getElementById('egg-modal');
  if(m){ m.style.display='flex'; }
}
function eggLukk(){
  var m=document.getElementById('egg-modal');
  if(m){ m.style.display='none'; }
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') eggLukk(); });

(function(){
  var btn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 400){
      btn.style.display='flex';
      btn.style.alignItems='center';
      btn.style.justifyContent='center';
      btn.style.opacity='1';
    } else {
      btn.style.opacity='0';
      setTimeout(function(){ if(window.scrollY<=400) btn.style.display='none'; }, 200);
    }
  }, {passive:true});
})();

/* Shuffle drag-token banks on page load */
(function shuffleDragBanks() {
  function shuffleBank(bankId) {
    const bank = document.getElementById(bankId);
    if (!bank) return;
    const tokens = Array.from(bank.querySelectorAll('.drag-token'));
    for (let i = tokens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      bank.insertBefore(tokens[j], tokens[i]);
    }
  }
  function init() {
    shuffleBank('drag-bank-1');
    shuffleBank('drag-bank-2');
    shuffleBank('drag-bank-3');
    shuffleBank('drag-bank-4');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ── Drag-kolonne (mtdk) ── */
function mtkMove(btn){
  if(MTS.answered) return;
  const placed = parseInt(btn.dataset.placed);
  const bank = document.getElementById('mtdk-bank');
  if(placed===-1){
    // Er i bank – flytt til neste ledige kolonne
    // Finn kva kolonne som er "aktiv" via sist klikka
    const col = (window._mtkLastCol||0);
    window._mtkLastCol = col===0?1:0;
    btn.dataset.placed = String(col);
    document.getElementById('mtdk-placed-'+col).appendChild(btn);
  } else {
    // Er i kolonne – flytt tilbake til bank
    btn.dataset.placed = '-1';
    bank.appendChild(btn);
  }
}
function mtkSetCol(btn, col){
  if(MTS.answered) return;
  const old = parseInt(btn.dataset.placed);
  const bank = document.getElementById('mtdk-bank');
  if(old>=0) document.getElementById('mtdk-placed-'+old)?.removeChild(btn);
  else bank.removeChild(btn);
  btn.dataset.placed = String(col);
  document.getElementById('mtdk-placed-'+col).appendChild(btn);
}
function mtkSjekk(){
  if(MTS.answered) return;
  MTS.answered = true;
  const t = MTS.tasks[MTS.idx];
  let correct=0, total=t.ord.length;
  document.querySelectorAll('.mtdk-token').forEach(btn=>{
    const placed = parseInt(btn.dataset.placed);
    const fasit = parseInt(btn.dataset.fasit);
    if(placed===fasit){ correct++; btn.style.background='#e8f6f0'; btn.style.borderColor='#82c9a8'; }
    else { btn.style.background='#fff0ed'; btn.style.borderColor='#f0a090'; }
  });
  const allRight = correct===total;
  if(allRight) MTS.score++;
  MTS.history[MTS.idx] = allRight;
  mtUpdateProgress();
  const fb=$mt('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background=allRight?'#e8f6f0':'#fff0ed';
    fb.style.border=`1px solid ${allRight?'#82c9a8':'#f0a090'}`;
    fb.style.color=allRight?'#14532d':'#7f1d1d';
    fb.innerHTML=`<strong>${allRight?'✓ Alle orda riktig plassert!':correct+' av '+total+' riktig plassert'}</strong>
      ${t.regel?`<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`:''}`;
  }
  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}

/* ── Drag-ord (mtdo) ── */
const _mtoAnswered=[];
function mtoMove(btn){
  if(MTS.answered) return;
  const ans = document.getElementById('mtdo-answer');
  const ph = document.getElementById('mtdo-placeholder');
  if(ph) ph.style.display='none';
  btn.style.opacity='0.4';
  btn.disabled=true;
  const w = btn.dataset.w;
  _mtoAnswered.push(w);
  const span=document.createElement('span');
  span.style.cssText='background:#fff3e0;border:1px solid #e5c077;border-radius:6px;padding:4px 12px;font-size:14px;cursor:pointer;color:#4a2a00';
  span.textContent=w;
  span.onclick=function(){
    if(MTS.answered) return;
    const idx=_mtoAnswered.indexOf(w);
    if(idx>=0) _mtoAnswered.splice(idx,1);
    ans.removeChild(this);
    btn.style.opacity='1';
    btn.disabled=false;
    if(!ans.querySelector('span')) { if(ph) ph.style.display=''; }
  };
  ans.appendChild(span);
}
function mtoReset(){
  MTS.answered=false;
  _mtoAnswered.length=0;
  const fb=document.getElementById('mt-feedback');
  if(fb) fb.style.display='none';
  const ans=document.getElementById('mtdo-answer');
  while(ans.firstChild) ans.removeChild(ans.firstChild);
  const ph=document.getElementById('mtdo-placeholder');
  if(ph){ ph.style.display=''; ans.appendChild(ph); }
  document.querySelectorAll('.mtdo-token').forEach(b=>{ b.style.opacity='1'; b.disabled=false; });
}
function mtoSjekk(){
  if(MTS.answered) return;
  MTS.answered=true;
  const t=MTS.tasks[MTS.idx];
  const fasitWords=t.fasit.trim().split(/\s+/).filter(Boolean);
  const ansNorm=_mtoAnswered.map(w=>w.trim()).filter(Boolean);
  const correct=JSON.stringify(ansNorm)===JSON.stringify(fasitWords);
  if(correct) MTS.score++;
  MTS.history[MTS.idx]=correct;
  mtUpdateProgress();
  const fb=$mt('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background=correct?'#e8f6f0':'#fff0ed';
    fb.style.border=`1px solid ${correct?'#82c9a8':'#f0a090'}`;
    fb.style.color=correct?'#14532d':'#7f1d1d';
    fb.innerHTML=`<strong>${correct?'✓ Rett rekkjefølge!':'✗ Feil rekkjefølge'}</strong>
      ${!correct?`<div style="margin-top:0.4rem;font-size:13px">Rett: <strong>${mtEsc(t.fasit)}</strong></div>`:''}
      ${t.regel?`<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`:''}`;
  }
  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}


/* ── Drag-kolonne kolonne-knappar ── */
function mtkToCol(col){
  // Move last token that was tapped to specific column
  const sel=document.querySelector('.mtdk-token.selected');
  if(!sel) return;
  mtkSetCol(sel,col);
  sel.classList.remove('selected');
}

/* ── Klikk-og-marker (km) ── */
function kmClick(span){
  if(MTS.answered) return;
  const sel=span.classList.contains('km-selected');
  if(sel){
    span.classList.remove('km-selected');
    span.style.background='';
    span.style.borderColor='transparent';
  } else {
    span.classList.add('km-selected');
    span.style.background='#fffbe8';
    span.style.borderColor='#f5d878';
  }
}
function kmReset(){
  MTS.answered=false;
  document.querySelectorAll('.km-word').forEach(s=>{
    s.classList.remove('km-selected','km-correct','km-wrong','km-missed');
    s.style.background='';
    s.style.borderColor='transparent';
  });
  const fb=document.getElementById('mt-feedback');
  if(fb) fb.style.display='none';
}
function kmSjekk(){
  if(MTS.answered) return;
  MTS.answered=true;
  const t=MTS.tasks[MTS.idx];
  const fasitSet=new Set(t.fasit_ord.map(w=>w.toLowerCase()));
  const selected=new Set([...document.querySelectorAll('.km-word.km-selected')].map(s=>s.dataset.clean));
  let ok=0,wrong=0,missed=0;
  document.querySelectorAll('.km-word').forEach(span=>{
    const w=span.dataset.clean;
    const inFasit=fasitSet.has(w);
    const inSel=selected.has(w);
    if(inFasit&&inSel){ok++;span.style.background='#e8f6f0';span.style.borderColor='#82c9a8';}
    else if(inFasit&&!inSel){missed++;span.style.background='#fff3cd';span.style.borderColor='#f5d878';}
    else if(!inFasit&&inSel){wrong++;span.style.background='#fff0ed';span.style.borderColor='#f0a090';}
  });
  const total=fasitSet.size;
  const allRight=ok===total&&wrong===0;
  if(allRight) MTS.score++;
  MTS.history[MTS.idx]=allRight;
  mtUpdateProgress();
  const fb=$mt('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background=allRight?'#e8f6f0':'#fff8f0';
    fb.style.border=`1px solid ${allRight?'#82c9a8':'#f5c282'}`;
    fb.style.color=allRight?'#14532d':'#6b3800';
    fb.innerHTML=`<strong>${allRight?'✓ Perfekt!':ok+' av '+total+' rette'}</strong>`
      +(missed>0?`<div style="font-size:13px;margin-top:4px">🟡 ${missed} ${t.maalordklasse} du ikkje markerte (gul)</div>`:'')
      +(wrong>0?`<div style="font-size:13px;margin-top:4px">✗ ${wrong} ord du markerte som ikkje er ${t.maalordklasse} (raud)</div>`:'')
      +(t.regel?`<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> ${mtEsc(t.regel)}</div>`:'');
  }
  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}


/* ── Sist oppdatert (GitHub siste commit) ── */
(function(){
  fetch('https://api.github.com/repos/LektorTorrkvist/norsklaben/commits?per_page=1')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var el = document.getElementById('sist-oppdatert');
      if(!el || !data || !data[0]) return;
      var d = new Date(data[0].commit.committer.date);
      var tz = 'Europe/Oslo';
      var dato = d.toLocaleDateString('nb-NO', { timeZone: tz, day: 'numeric', month: 'long', year: 'numeric' });
      var tid = d.toLocaleTimeString('nb-NO', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
      el.textContent = 'Sist oppdatert ' + dato + ' kl. ' + tid;
    })
    .catch(function(){});
})();

/* ── Finn feila (ff) ── */
function ffClick(span){
  if(MTS.answered) return;
  const sel=span.classList.contains('ff-selected');
  if(sel){
    span.classList.remove('ff-selected');
    span.style.background='';
    span.style.borderColor='transparent';
    span.style.textDecoration='';
  } else {
    span.classList.add('ff-selected');
    span.style.background='#fff0ed';
    span.style.borderColor='#f0a090';
    span.style.textDecoration='underline wavy #d45a2f';
  }
}
function ffReset(){
  MTS.answered=false;
  document.querySelectorAll('.ff-word').forEach(function(s){
    s.classList.remove('ff-selected');
    s.style.background='';
    s.style.borderColor='transparent';
    s.style.textDecoration='';
  });
  const fb=document.getElementById('mt-feedback');
  if(fb) fb.style.display='none';
  const nw=document.getElementById('mt-next-wrap');
  if(nw) nw.style.display='none';
}

function ffSjekk(){
  if(MTS.answered) return;
  MTS.answered=true;

  const t=MTS.tasks[MTS.idx];
  if(!t || !Array.isArray(t.fasit_feil)) return;

  const fasitSet=new Set(t.fasit_feil.map(function(w){ return String(w).toLowerCase(); }));
  const selected=[...document.querySelectorAll('.ff-word.ff-selected')];
  const selectedSet=new Set(selected.map(function(s){ return String(s.dataset.clean || '').toLowerCase(); }));

  let ok=0, wrong=0, missed=0;
  document.querySelectorAll('.ff-word').forEach(function(span){
    const w=String(span.dataset.clean || '').toLowerCase();
    const inFasit=fasitSet.has(w);
    const inSel=selectedSet.has(w);

    if(inFasit && inSel){
      ok++;
      span.style.background='#e8f6f0';
      span.style.borderColor='#82c9a8';
      span.style.textDecoration='underline wavy #1a7a50';
    } else if(inFasit && !inSel){
      missed++;
      span.style.background='#fff3cd';
      span.style.borderColor='#f5d878';
      span.style.textDecoration='underline wavy #d4a017';
    } else if(!inFasit && inSel){
      wrong++;
      span.style.background='#fff0ed';
      span.style.borderColor='#f0a090';
      span.style.textDecoration='underline wavy #d45a2f';
    }
  });

  const total=fasitSet.size;
  const allRight=ok===total && wrong===0;
  if(allRight) MTS.score++;
  MTS.history[MTS.idx]=allRight;
  mtUpdateProgress();

  const fb=$mt('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background=allRight?'#e8f6f0':'#fff8f0';
    fb.style.border='1px solid '+(allRight?'#82c9a8':'#f5c282');
    fb.style.color=allRight?'#14532d':'#6b3800';
    fb.innerHTML='<strong>'+(allRight?'✓ Perfekt!':'Treff: '+ok+' av '+total)+'</strong>'
      +(missed>0?'<div style="font-size:13px;margin-top:4px">🟡 '+missed+' ord du ikkje markerte (gul)</div>':'')
      +(wrong>0?'<div style="font-size:13px;margin-top:4px">✗ '+wrong+' ord du markerte feil (raud)</div>':'')
      +(t.regel?'<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> '+mtEsc(t.regel)+'</div>':'');
  }

  const nw=$mt('mt-next-wrap');
  if(nw) nw.style.display='block';
}

/* ══════════════════════════════════════════════════════
   PUNKTUM-SVEISEN (pvs) – Oppgåve 3F
══════════════════════════════════════════════════════ */
(function(){
  var SEGS=[
    {t:'tx',v:'Han gjekk til skulen '},
    {t:'og',i:0},
    {t:'cp',i:0,lo:'h',rest:'an møtte vennane sine '},
    {t:'og',i:1},
    {t:'cp',i:1,lo:'d',rest:'ei gjekk i kantina '},
    {t:'og',i:2},
    {t:'cp',i:2,lo:'d',rest:'ei spiste lunsj '},
    {t:'og',i:3},
    {t:'cp',i:3,lo:'d',rest:'ei snakka lenge '},
    {t:'og',i:4},
    {t:'cp',i:4,lo:'d',rest:'ei gløymde nesten å gå til timen.'}
  ];
  var CUT=[false,false,false,false,false];
  var CAP=[false,false,false,false,false];

  function render(){
    var el=document.getElementById('pvs-sentence');
    if(!el) return;
    var h='';
    for(var k=0;k<SEGS.length;k++){
      var s=SEGS[k];
      if(s.t==='tx'){
        h+=s.v;
      } else if(s.t==='og'){
        if(CUT[s.i]){
          h+='<span style="color:#1a7a50;font-style:normal;font-weight:700">. </span>';
        } else {
          h+='<span style="background:#fde68a;color:#92400e;font-weight:700;font-style:normal;border-radius:3px;padding:1px 5px;cursor:pointer" onclick="pvsCutOg('+s.i+')" title="Klikk for å kutte">og</span> ';
        }
      } else if(s.t==='cp'){
        if(!CUT[s.i]){
          h+=s.lo+s.rest;
        } else if(!CAP[s.i]){
          h+='<span style="background:#bfdbfe;color:#1e40af;font-weight:700;font-style:normal;border-radius:3px;padding:1px 4px;cursor:pointer;text-decoration:underline dotted" onclick="pvsCapLetter('+s.i+')" title="Klikk: gjer til stor bokstav">'+s.lo+'</span>'+s.rest;
        } else {
          h+='<span style="color:#1a7a50;font-weight:700;font-style:normal">'+s.lo.toUpperCase()+'</span>'+s.rest;
        }
      }
    }
    el.innerHTML=h;
    var allCut=CUT.every(Boolean);
    var allCap=CAP.every(Boolean);
    var st=document.getElementById('pvs-status');
    var s2=document.getElementById('pvs-step2');
    var dn=document.getElementById('pvs-done');
    if(!allCut){
      var rem=CUT.filter(function(x){return !x;}).length;
      if(st) st.textContent=rem+' «og» att å kutte.';
      if(s2) s2.style.display='none';
      if(dn) dn.style.display='none';
    } else if(!allCap){
      var remC=CAP.filter(function(x){return !x;}).length;
      if(st) st.textContent=remC+' bokstav(ar) att å gjere store.';
      if(s2) s2.style.display='block';
      if(dn) dn.style.display='none';
    } else {
      if(st) st.textContent='';
      if(s2) s2.style.display='none';
      if(dn) dn.style.display='block';
    }
  }

  window.pvsCutOg=function(i){ if(CUT[i]) return; CUT[i]=true; render(); };
  window.pvsCapLetter=function(i){ if(CAP[i]) return; CAP[i]=true; render(); };
  window.pvsReset=function(){
    CUT=[false,false,false,false,false];
    CAP=[false,false,false,false,false];
    render();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  } else { render(); }
})();

/* ══════════════════════════════════════════════════════
   KOMMA-MYSTERIET (kmalt) – Oppgåve 3H
══════════════════════════════════════════════════════ */
(function(){
  var SENTS=[
    {id:'kms1',
     words:['Ho','kjøpte','eple','pærer','bananer','og','druer','på','butikken.'],
     ok:[2,3,4],
     rule:'I ei oppramsing set du komma mellom kvart ledd, men ikkje rett før det siste «og»-leddet.'},
    {id:'kms2',
     words:['Han','ville','gjerne','hjelpe','men','han','hadde','dessverre','ikkje','tid.'],
     ok:[3],
     rule:'Set komma framfor «men» når det bind saman to sjølvstendige setningar.'},
    {id:'kms3',
     words:['Etter','skulen','gjekk','ho','heim','laga','mat','spiste','og','sov.'],
     ok:[4,6],
     rule:'Fleire verb i rad (oppramsing av handlingar) vert skilt med komma, men ikkje rett før «og» (siste handlinga).'}
  ];
  var placed={};
  SENTS.forEach(function(s){ placed[s.id]={}; });

  function render(){
    var wrap=document.getElementById('km-alt-wrap');
    if(!wrap) return;
    var h='';
    SENTS.forEach(function(s){
      h+='<div style="margin:0.5rem 0 0.9rem;font-family:\'Fraunces\',serif;font-style:italic;font-size:14.5px;line-height:3;color:var(--ink2)">';
      for(var i=0;i<s.words.length;i++){
        h+='<span>'+s.words[i]+'</span>';
        if(i<s.words.length-1){
          var has=placed[s.id][i];
          h+='<span data-sid="'+s.id+'" data-idx="'+i+'" onclick="kmaltToggle(\''+s.id+'\','+i+')" style="display:inline-block;width:18px;text-align:center;cursor:pointer;font-style:normal;font-weight:700;color:'+(has?'#e5822a':'rgba(0,0,0,0.13)')+';font-size:17px;vertical-align:middle;user-select:none;transition:color 0.15s" title="Klikk for komma">'+(has?',':'·')+'</span>';
        }
      }
      h+='</div>';
    });
    wrap.innerHTML=h;
  }

  window.kmaltToggle=function(sid,idx){
    var fb=document.getElementById('km-alt-feedback');
    if(fb) fb.style.display='none';
    placed[sid][idx]=!placed[sid][idx];
    render();
  };

  window.kmaltSjekk=function(){
    var msgs=[];
    var allOk=true;
    SENTS.forEach(function(s){
      var userKeys=Object.keys(placed[s.id]).filter(function(k){ return placed[s.id][k]; }).map(Number);
      var okSet=new Set(s.ok);
      var uSet=new Set(userKeys);
      var correct=s.ok.every(function(i){ return uSet.has(i); });
      var noExtra=userKeys.every(function(i){ return okSet.has(i); });
      if(!(correct&&noExtra)){
        allOk=false;
        var miss=s.ok.filter(function(i){ return !uSet.has(i); }).length;
        var extra=userKeys.filter(function(i){ return !okSet.has(i); }).length;
        var msg='';
        if(miss>0) msg+='Du mangla '+miss+' komma. ';
        if(extra>0) msg+='Du sette '+extra+' komma på feil stad. ';
        msgs.push(msg+'💡 '+s.rule);
      }
    });
    var fb=document.getElementById('km-alt-feedback');
    if(!fb) return;
    if(allOk){
      fb.innerHTML='<span style="color:#1a5c42;font-weight:600">✅ Alle komma rett plasserte!</span><div style="font-size:12.5px;color:var(--ink3);margin-top:0.25rem">Komma i oppramsing mellom kvart ledd (ikkje rett før siste «og»), og komma framfor «men» mellom to heilsetningar.</div>';
    } else {
      fb.innerHTML='<div style="color:#7f1d1d">'+msgs.map(function(m){ return '<div style="margin-bottom:0.35rem">✗ '+m+'</div>'; }).join('')+'</div>';
    }
    fb.style.display='block';
  };

  window.kmaltReset=function(){
    SENTS.forEach(function(s){ placed[s.id]={}; });
    var fb=document.getElementById('km-alt-feedback');
    if(fb) fb.style.display='none';
    render();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  } else { render(); }
})();

/* ══════════════════════════════════════════════════════
   SETNINGSLENGDE-ALARMEN (sla) – Oppgåve 3I
══════════════════════════════════════════════════════ */
function slaCheck(){
  var ta=document.getElementById('sla-input');
  var fb=document.getElementById('sla-feedback');
  if(!ta||!fb) return;
  var segs=ta.value.split(/[.!?;]/);
  var last=(segs[segs.length-1]||'').trim();
  var words=last?last.split(/\s+/).filter(function(w){ return w.length>0; }):[];
  var n=words.length;
  if(n>20){
    ta.style.borderColor='#ef4444';
    ta.style.boxShadow='0 0 0 3px rgba(239,68,68,0.25)';
    fb.innerHTML='🚨 <strong>Trekk pusten! Set punktum!</strong> Setninga er '+n+' ord lang utan teiknsetting.';
    fb.style.background='#fee2e2';
    fb.style.color='#991b1b';
  } else if(n>14){
    ta.style.borderColor='#f59e0b';
    ta.style.boxShadow='0 0 0 3px rgba(245,158,11,0.15)';
    fb.innerHTML='🟡 '+n+' ord – setninga er i lengste laget. Vurder å kutte ho i to.';
    fb.style.background='#fef9c3';
    fb.style.color='#78350f';
  } else if(n>0){
    ta.style.borderColor='#6abf8a';
    ta.style.boxShadow='';
    fb.innerHTML='✅ '+n+' ord. God setningslengde!';
    fb.style.background='#f0fdf4';
    fb.style.color='#14532d';
  } else {
    ta.style.borderColor='var(--line)';
    ta.style.boxShadow='';
    fb.innerHTML='';
    fb.style.background='transparent';
  }
}

/* ══════════════════════════════════════════════════════
   FIKS «OG DÅ»-FELLA (ogda) – Oppgåve 3J
══════════════════════════════════════════════════════ */
(function(){
  var ITEMS=[
    {id:'ogd1',
     bad:'Og då gjekk ho til skulen og møtte vennane sine.',
     opts:['Deretter gjekk ho til skulen og møtte vennane sine.','Ho gjekk deretter til skulen og møtte vennane sine.','Og etter det gjekk ho til skulen.'],
     ok:[0,1],
     hint:'«Og då» er eit munnleg uttrykk. Bruk «deretter», «etter dette» eller start med subjekt + verb.'},
    {id:'ogd2',
     bad:'Og då hadde han gløymt å levere oppgåva.',
     opts:['Som eit resultat hadde han gløymt å levere oppgåva.','Han hadde difor gløymt å levere oppgåva.','Og likevel hadde han gløymt det.'],
     ok:[0,1],
     hint:'«Og då» gir ikkje tydeleg logikk. «Som resultat» eller «difor» viser samanhengen tydelegare.'},
    {id:'ogd3',
     bad:'Og då begynte klimaet å endre seg.',
     opts:['Og snart blei klimaet endra.','I løpet av fleire tiår begynte klimaet å endre seg.','Over tid begynte klimaet gradvis å endre seg.'],
     ok:[1,2],
     hint:'«Og då» er utydeleg i tid. Bruk «i løpet av», «over tid» eller «gradvis» for å presisere tidsrommet.'},
    {id:'ogd4',
     bad:'Og då er det viktig å bruke kjelder.',
     opts:['Difor er det viktig å bruke kjelder.','Det er av den grunn viktig å bruke kjelder.','Og kanskje er kjelder viktige.'],
     ok:[0,1],
     hint:'«Og då» viser ikkje logisk samanheng. «Difor» eller «av den grunn» markerer konklusjonen tydeleg.'}
  ];
  var chosen={};
  ITEMS.forEach(function(it){ chosen[it.id]=null; });

  function render(){
    var wrap=document.getElementById('ogda-wrap');
    if(!wrap) return;
    var h='';
    ITEMS.forEach(function(it){
      h+='<div style="margin-bottom:1.1rem;border:1px solid var(--line);border-radius:10px;overflow:hidden">';
      h+='<div style="background:#fff0ed;padding:0.5rem 1rem;font-size:13.5px;font-family:\'Fraunces\',serif;font-style:italic;color:#7f1d1d"><span style="font-style:normal;font-size:10.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#d45a2f;margin-right:6px">Feil innleiing:</span>«'+it.bad+'»</div>';
      h+='<div style="padding:0.5rem 0.75rem;background:#fafaf9">';
      it.opts.forEach(function(opt,idx){
        var sel=chosen[it.id]===idx;
        var isOk=it.ok.indexOf(idx)!==-1;
        var bg=sel?(isOk?'#e8f6ee':'#fff0ed'):'';
        var col=sel?(isOk?'#14532d':'#7f1d1d'):'#1a1a18';
        var brd=sel?(isOk?'1px solid #6abf8a':'1px solid #f0a090'):'1px solid var(--line)';
        var ico=sel?(isOk?'✅ ':'✗ '):'';
        h+='<button onclick="ogdaChoose(\''+it.id+'\','+idx+')" style="display:block;width:100%;text-align:left;background:'+bg+';color:'+col+';border:'+brd+';border-radius:7px;padding:0.45rem 0.75rem;margin-bottom:0.3rem;font-family:\'DM Sans\',sans-serif;font-size:13px;cursor:pointer;transition:background 0.15s,border-color 0.15s">'+ico+opt+'</button>';
      });
      if(chosen[it.id]!==null){
        h+='<div style="font-size:12px;color:var(--ink3);padding:0.25rem 0.1rem 0.1rem">💡 '+it.hint+'</div>';
      }
      h+='</div></div>';
    });
    wrap.innerHTML=h;
  }

  window.ogdaChoose=function(id,idx){
    chosen[id]=(chosen[id]===idx?null:idx);
    render();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  } else { render(); }
})();

/* ══════════════════════════════════════════════════════
   BURGER SORT – MT-type 'burger_sort'
══════════════════════════════════════════════════════ */
var _mtbsDragging = -1;

function mtbsDragStart(e, idx){
  _mtbsDragging = idx;
  e.dataTransfer.effectAllowed = 'move';
}

function mtbsDrop(e, lagIdx){
  e.preventDefault();
  if(_mtbsDragging === -1) return;
  mtbsMoveToBucket(_mtbsDragging, lagIdx);
  _mtbsDragging = -1;
}

function mtbsClick(btn){
  if(MTS.answered) return;
  const idx = parseInt(btn.dataset.i);
  const placed = parseInt(btn.dataset.placed);
  // Sykl: bank → lag 0 → lag 1 → lag 2 → bank
  const next = placed < 2 ? placed + 1 : -1;
  if(next === -1){
    mtbsMoveToBank(idx);
  } else {
    mtbsMoveToBucket(idx, next);
  }
}

function mtbsMoveToBucket(idx, lagIdx){
  if(MTS.answered) return;
  const btn = document.querySelector('.mtbs-token[data-i="'+idx+'"]');
  if(!btn) return;
  const old = parseInt(btn.dataset.placed);
  if(old >= 0){
    const oldSlot = document.getElementById('mtbs-placed-'+old);
    if(oldSlot && oldSlot.contains(btn)) oldSlot.removeChild(btn);
  } else {
    const bank = document.getElementById('mtbs-bank');
    if(bank && bank.contains(btn)) bank.removeChild(btn);
  }
  btn.dataset.placed = String(lagIdx);
  btn.style.cursor = 'grab';
  const slot = document.getElementById('mtbs-placed-'+lagIdx);
  if(slot) slot.appendChild(btn);
}

function mtbsMoveToBank(idx){
  if(MTS.answered) return;
  const btn = document.querySelector('.mtbs-token[data-i="'+idx+'"]');
  if(!btn) return;
  const old = parseInt(btn.dataset.placed);
  if(old >= 0){
    const oldSlot = document.getElementById('mtbs-placed-'+old);
    if(oldSlot && oldSlot.contains(btn)) oldSlot.removeChild(btn);
  }
  btn.dataset.placed = '-1';
  const bank = document.getElementById('mtbs-bank');
  if(bank) bank.appendChild(btn);
}

function mtbsSjekk(){
  if(MTS.answered) return;
  const t = MTS.tasks[MTS.idx];
  const tokens = document.querySelectorAll('.mtbs-token');
  let allPlaced = true;
  tokens.forEach(function(btn){
    if(parseInt(btn.dataset.placed) === -1) allPlaced = false;
  });
  if(!allPlaced){
    const fb = document.getElementById('mt-feedback');
    if(fb){
      fb.style.display='block';
      fb.style.background='#fffbe8';
      fb.style.border='1px solid #f5d878';
      fb.style.color='#6b4a00';
      fb.innerHTML='Plasser alle avsnitt i eit lag før du sjekkar.';
    }
    return;
  }
  MTS.answered = true;
  let correct = 0;
  tokens.forEach(function(btn){
    const placed = parseInt(btn.dataset.placed);
    const fasit = t.avsnitt[parseInt(btn.dataset.i)].fasit;
    const ok = placed === fasit;
    if(ok){ correct++; btn.style.background='#e8f6f0'; btn.style.borderColor='#82c9a8'; btn.style.color='#14532d'; }
    else { btn.style.background='#fff0ed'; btn.style.borderColor='#f0a090'; btn.style.color='#7f1d1d'; }
  });
  const total = t.avsnitt.length;
  const allRight = correct === total;
  if(allRight) MTS.score++;
  MTS.history[MTS.idx] = allRight;
  mtUpdateProgress();
  const fb = document.getElementById('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background = allRight ? '#e8f6f0' : '#fff8f0';
    fb.style.border = 'supporting solid '+(allRight?'#82c9a8':'#f5c282');
    fb.style.border = '1px solid '+(allRight?'#82c9a8':'#f5c282');
    fb.style.color = allRight ? '#14532d' : '#6b3800';
    fb.innerHTML = '<strong>'+(allRight ? '✓ Alle avsnitt på rett plass!' : correct+' av '+total+' rett plasserte')+
      '</strong>'+(t.regel ? '<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> '+mtEsc(t.regel)+'</div>' : '');
  }
  const nw = document.getElementById('mt-next-wrap');
  if(nw) nw.style.display = 'block';
}

function mtbsReset(){
  MTS.answered = false;
  const tokens = document.querySelectorAll('.mtbs-token');
  const bank = document.getElementById('mtbs-bank');
  tokens.forEach(function(btn){
    btn.dataset.placed = '-1';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
    if(bank) bank.appendChild(btn);
  });
  const fb = document.getElementById('mt-feedback');
  if(fb) fb.style.display = 'none';
  const nw = document.getElementById('mt-next-wrap');
  if(nw) nw.style.display = 'none';
}

/* Touch support for burger sort */
(function(){
  var _tid = -1;
  document.addEventListener('touchstart', function(e){
    var btn = e.target.closest('.mtbs-token');
    if(!btn || MTS.answered) return;
    _tid = parseInt(btn.dataset.i);
  }, {passive:true});
  document.addEventListener('touchend', function(e){
    if(_tid === -1) return;
    var touch = e.changedTouches[0];
    var el = document.elementFromPoint(touch.clientX, touch.clientY);
    var bucket = el && el.closest('[id^="mtbs-bucket-"]');
    if(bucket){
      var lagIdx = parseInt(bucket.dataset.lagidx);
      mtbsMoveToBucket(_tid, lagIdx);
    }
    _tid = -1;
  }, {passive:true});
})();

/* ══════════════════════════════════════════════════════
   AVSNITT-KLIKK – MT-type 'avsnitt_klikk'
══════════════════════════════════════════════════════ */
var _akBreaks = {};

function akToggle(span, sid){
  if(MTS.answered) return;
  var on = _akBreaks[sid];
  _akBreaks[sid] = !on;
  _akApply();
}

function _akApply(){
  document.querySelectorAll('.ak-break').forEach(function(span){
    var sid = span.getAttribute('data-sid');
    if(!sid) return;
    var active = _akBreaks[sid];
    // Insert / remove visual paragraph break before this span
    var prev = span.previousSibling;
    if(active){
      span.style.background = '#bfdbfe';
      span.style.color = '#1e40af';
      span.style.borderRadius = '4px';
      span.style.padding = '1px 4px';
      // Insert <br> marker if not present
      if(!prev || prev.nodeType !== 1 || !prev.classList.contains('ak-br')){
        var br = document.createElement('div');
        br.className = 'ak-br';
        br.style.cssText = 'display:block;height:0.7em;width:100%';
        span.parentNode.insertBefore(br, span);
      }
    } else {
      span.style.background = '';
      span.style.color = '';
      span.style.borderRadius = '';
      span.style.padding = '';
      if(prev && prev.nodeType === 1 && prev.classList.contains('ak-br')){
        prev.parentNode.removeChild(prev);
      }
    }
  });
}

function akSjekk(){
  if(MTS.answered) return;
  const t = MTS.tasks[MTS.idx];
  MTS.answered = true;
  const fasit = new Set(t.fasit_breaks);
  const user  = new Set(Object.keys(_akBreaks).filter(function(k){ return _akBreaks[k]; }));
  let ok=0, wrong=0, missed=0;
  document.querySelectorAll('.ak-break').forEach(function(span){
    const sid = span.getAttribute('data-sid');
    if(!sid) return;
    const inF = fasit.has(sid);
    const inU = user.has(sid);
    if(inF && inU){ ok++; span.style.background='#e8f6f0'; span.style.color='#1a5c42'; }
    else if(!inF && inU){ wrong++; span.style.background='#fff0ed'; span.style.color='#7f1d1d'; }
    else if(inF && !inU){ missed++; span.style.background='#fef9c3'; span.style.color='#78350f'; }
  });
  const total = t.fasit_breaks.length;
  const allRight = ok===total && wrong===0;
  if(allRight) MTS.score++;
  MTS.history[MTS.idx] = allRight;
  mtUpdateProgress();
  const fb = document.getElementById('mt-feedback');
  if(fb){
    fb.style.display='block';
    fb.style.background = allRight?'#e8f6f0':'#fff8f0';
    fb.style.border = '1px solid '+(allRight?'#82c9a8':'#f5c282');
    fb.style.color = allRight?'#14532d':'#6b3800';
    let html = '<strong>'+(allRight ? '✓ Alle avsnittsskifte er på rett plass!' : ok+' av '+total+' rette')+' </strong>';
    if(missed > 0) html += '<div style="font-size:13px;margin-top:4px">🟡 '+missed+' avsnittsskifte du ikkje markerte (gul)</div>';
    if(wrong > 0)  html += '<div style="font-size:13px;margin-top:4px">✗ '+wrong+' ekstra skifte på feil stad (raud)</div>';
    if(t.regel)    html += '<div style="margin-top:0.4rem;font-size:13px;opacity:0.85"><strong>Regel:</strong> '+mtEsc(t.regel)+'</div>';
    fb.innerHTML = html;
  }
  const nw = document.getElementById('mt-next-wrap');
  if(nw) nw.style.display = 'block';
}

function akReset(){
  MTS.answered = false;
  _akBreaks = {};
  _akApply();
  document.querySelectorAll('.ak-br').forEach(function(el){ el.parentNode.removeChild(el); });
  document.querySelectorAll('.ak-break').forEach(function(span){
    span.style.background=''; span.style.color=''; span.style.borderRadius=''; span.style.padding='';
  });
  const fb = document.getElementById('mt-feedback');
  if(fb) fb.style.display='none';
  const nw = document.getElementById('mt-next-wrap');
  if(nw) nw.style.display='none';
}