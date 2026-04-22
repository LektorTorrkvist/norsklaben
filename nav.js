document.addEventListener('DOMContentLoaded', function () {
  let dropdowns = [];
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('nav') : null;
  const logo = document.querySelector('.logo');
  const footer = document.querySelector('footer');
  let navToggle = null;

  function formatLastUpdated() {
    const raw = document.lastModified;
    const d = raw ? new Date(raw) : new Date();
    if (Number.isNaN(d.getTime())) return '';

    const dateStr = d.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return 'Sist oppdatert ' + dateStr + ' kl. ' + timeStr;
  }

  function renderSharedFooter() {
    if (!footer) return;

    footer.innerHTML = [
      '<p class="footer-main">Norsklaben \u2022 av Lektor T\u00f8rrkvist \u2022 2026</p>',
      '<p class="footer-sub" id="nl-sist-oppdatert"></p>'
    ].join('');

    const updated = footer.querySelector('#nl-sist-oppdatert');
    if (updated) {
      try { updated.textContent = formatLastUpdated(); } catch (_) {}
    }
  }

  function showEggModal() {
    const old = document.getElementById('nl-egg-modal');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'nl-egg-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:18px',
      'background:rgba(18, 17, 15, 0.62)'
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'width:min(760px, 100%)',
      'max-height:min(86vh, 860px)',
      'overflow:auto',
      'background:#fffdf8',
      'color:#1d1b18',
      'border-radius:14px',
      'padding:20px 22px',
      'box-shadow:0 16px 40px rgba(0,0,0,.30)',
      'font-family:Source Sans 3, sans-serif',
      'line-height:1.55'
    ].join(';');

    const title = document.createElement('h3');
    title.style.cssText = 'margin:0 0 12px;font-size:22px;line-height:1.2;font-family:Playfair Display, serif;';
    title.textContent = '\ud83e\udd5a Lektor T\u00f8rrkvist';

    const body = document.createElement('p');
    body.style.cssText = 'margin:0 0 16px;font-size:16px;white-space:pre-line;';
    body.textContent = 'Lektor T\u00f8rrkvist er pseudonymet til ein norskl\u00e6rar og datanerd ved Spjelkavik ungdomsskule i \u00c5lesund. Han var lei av \u00e5 bruke utalege timar p\u00e5 \u00e5 skrive dei same tilbakemeldingane om og/\u00e5-regelen, kjeldef\u00f8ring og s\u00e6rskrivingsfeil, og bestemte seg for \u00e5 setje opp ein oppg\u00e5vebank som han i staden kunne vise til for \u00f8ving og mengdetrening. Slik vart Norsklaben til.\n\nSidan eg brukar mykje tid p\u00e5 \u00e5 finpusse denne nettstaden, tek eg gladeleg imot brukarerfaringar, tips til oppg\u00e5ver, forbetringar og hint om eventuelle bugs som m\u00e5 fiksast. Send meg gjerne eit pip p\u00e5 mail: norsklaben@proton.me\nTakk for at du stakk innom! \ud83d\ude4f';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Lukk';
    close.style.cssText = [
      'border:1px solid #d8d2c5',
      'background:#fff',
      'color:#1d1b18',
      'border-radius:8px',
      'padding:8px 14px',
      'font-size:14px',
      'cursor:pointer'
    ].join(';');
    close.addEventListener('click', function () { overlay.remove(); });

    panel.appendChild(title);
    panel.appendChild(body);
    panel.appendChild(close);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  renderSharedFooter();

  function inferLangFromHref(href) {
    return /-bm\.html(?:$|[?#])/i.test(String(href || '')) ? 'bm' : 'nn';
  }

  function setupLanguageMemory() {
    const key = 'norsklaben-malform';
    const toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;

    const links = Array.from(toggle.querySelectorAll('a[href]'));
    if (!links.length) return;

    let saved = null;
    try {
      saved = localStorage.getItem(key);
    } catch (_) {
      saved = null;
    }

    const activeLink = links.find(function (a) {
      return a.classList.contains('active');
    }) || null;

    const currentLang = activeLink
      ? inferLangFromHref(activeLink.getAttribute('href'))
      : (document.documentElement.lang || '').toLowerCase().startsWith('nb') ? 'bm' : 'nn';

    if (saved === 'bm' || saved === 'nn') {
      if (saved !== currentLang) {
        const targetLink = links.find(function (a) {
          return inferLangFromHref(a.getAttribute('href')) === saved;
        });
        if (targetLink) {
          const target = targetLink.getAttribute('href');
          if (target) {
            window.location.replace(target);
            return;
          }
        }
      }
    }

    links.forEach(function (a) {
      a.addEventListener('click', function () {
        try {
          localStorage.setItem(key, inferLangFromHref(a.getAttribute('href')));
        } catch (_) {
          // Ignore storage errors in locked-down browsers.
        }
      });
    });
  }

  setupLanguageMemory();

  function ensureOppgavebankNavLink() {
    if (!nav) return;
    var path = String((window.location && window.location.pathname) || '').toLowerCase();
    var docLang = (document.documentElement.lang || '').toLowerCase();
    var isBm = path.indexOf('-bm.html') !== -1 || docLang.indexOf('nb') === 0;
    var targetHref = isBm ? 'tekstsjekk-bm.html' : 'tekstsjekk.html';
    var targetText = isBm ? 'Tekstsjekk' : 'Tekstsjekk';

    var link = nav.querySelector('a[data-nl-nav="oppgavebank"]') ||
      nav.querySelector('a[href*="tekstsjekk.html"], a[href*="tekstsjekk-bm.html"]');

    if (!link) {
      link = document.createElement('a');
    }

    link.setAttribute('data-nl-nav', 'oppgavebank');
    link.href = targetHref;
    link.textContent = targetText;

    if (path.indexOf('tekstsjekk.html') !== -1 || path.indexOf('tekstsjekk-bm.html') !== -1) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    var firstLink = nav.querySelector('a[href*="skrivemeisteren"]');
    if (firstLink) {
      nav.insertBefore(link, firstLink.nextSibling);
    } else {
      nav.insertBefore(link, nav.firstChild);
    }
  }

  ensureOppgavebankNavLink();

  function ensureVerktoykasseDropdown() {
    if (!nav) return;

    var path = String((window.location && window.location.pathname) || '').toLowerCase();
    var docLang = (document.documentElement.lang || '').toLowerCase();
    var isBm = path.indexOf('-bm.html') !== -1 || docLang.indexOf('nb') === 0;
    var toolsHomeHref = isBm ? 'verktoyskasse-bm.html' : 'verktoyskasse.html';
    var teacherHref = isBm ? 'undervisingsbank-bm.html' : 'undervisingsbank.html';
    var teacherLabel = isBm ? 'Undervisningsbank' : 'Undervisingsbank';
    var teacherSection = isBm ? 'For lærer' : 'For lærar';
    var studentSection = isBm ? 'For elev' : 'For elev';

    Array.from(nav.children).forEach(function (child) {
      if (child.tagName !== 'A') return;
      var href = String(child.getAttribute('href') || '').toLowerCase();
      if (href.indexOf('verktoyskasse') !== -1 || href.indexOf('undervisingsbank') !== -1) {
        child.remove();
      }
    });

    var dropdown = nav.querySelector('.nav-dropdown[data-nl-nav="verktoykassa"]') || nav.querySelector('.nav-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'nav-dropdown';
    }
    dropdown.setAttribute('data-nl-nav', 'verktoykassa');

    Array.from(nav.querySelectorAll('.nav-dropdown')).forEach(function (dd) {
      if (dd !== dropdown) dd.remove();
    });

    var btn = dropdown.querySelector('.nav-dropbtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-dropbtn';
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.textContent = 'Verktøykassa';

    var menu = dropdown.querySelector('.nav-dropmenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'nav-dropmenu';
    }

    menu.innerHTML = [
      '<div class="nav-dropsection">' + teacherSection + '</div>',
      '<a href="' + teacherHref + '">' + teacherLabel + '</a>',
      '<div class="nav-dropdivider" role="separator" aria-hidden="true"></div>',
      '<div class="nav-dropsection">' + studentSection + '</div>',
      '<a href="' + toolsHomeHref + '">Verktøykasse</a>',
      '<a href="mad-libs.html">Mad Libs</a>',
      '<a href="vurderingslab.html">Vurderingslab</a>'
    ].join('');

    dropdown.innerHTML = '';
    dropdown.appendChild(btn);
    dropdown.appendChild(menu);

    var activeMap = {
      'undervisingsbank.html': teacherHref,
      'undervisingsbank-bm.html': teacherHref,
      'verktoyskasse.html': toolsHomeHref,
      'verktoyskasse-bm.html': toolsHomeHref,
      'mad-libs.html': 'mad-libs.html',
      'vurderingslab.html': 'vurderingslab.html'
    };

    var activeTarget = '';
    Object.keys(activeMap).forEach(function (p) {
      if (path.indexOf(p) !== -1) activeTarget = activeMap[p];
    });

    var hasActive = false;
    Array.from(menu.querySelectorAll('a')).forEach(function (a) {
      var href = String(a.getAttribute('href') || '');
      if (href === activeTarget) {
        a.classList.add('active');
        hasActive = true;
      } else {
        a.classList.remove('active');
      }
    });

    if (hasActive) btn.classList.add('active');
    else btn.classList.remove('active');

    var anchor = nav.querySelector('a[href*="nynorsklab"]') || nav.querySelector('a[data-nl-nav="oppgavebank"]');
    if (anchor) nav.insertBefore(dropdown, anchor.nextSibling);
    else nav.appendChild(dropdown);
  }

  ensureVerktoykasseDropdown();

  function closeMobileNav() {
    if (!header || !navToggle) return;
    header.classList.remove('nl-nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function ensureMobileNavToggle() {
    if (!header || !nav) return;
    if (header.querySelector('.nav-hamburger')) {
      navToggle = header.querySelector('.nav-hamburger');
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Opne meny');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'nl-main-nav');
    btn.innerHTML = '<span></span><span></span><span></span>';

    if (!nav.id) nav.id = 'nl-main-nav';
    header.insertBefore(btn, nav);

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const willOpen = !header.classList.contains('nl-nav-open');
      header.classList.toggle('nl-nav-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (!header.classList.contains('nl-nav-open')) return;
      const target = e.target.closest('a');
      if (target) closeMobileNav();
    });

    navToggle = btn;
  }

  ensureMobileNavToggle();

  if (footer) {
    footer.style.cursor = 'pointer';
    footer.addEventListener('click', function () {
      showEggModal();
    });
  }

  if (logo) {
    logo.addEventListener('click', function () {
      const updated = footer ? footer.querySelector('#nl-sist-oppdatert') : null;
      if (updated) updated.textContent = formatLastUpdated();
    });
  }

  dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (!dropdowns.length) return;

  function closeAll() {
    dropdowns.forEach(function (dd) {
      dd.classList.remove('open');
      const btn = dd.querySelector('.nav-dropbtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(function (dd) {
    const btn = dd.querySelector('.nav-dropbtn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const wasOpen = dd.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        dd.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) closeAll();
    if (header && header.classList.contains('nl-nav-open') && !e.target.closest('header')) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      closeMobileNav();
    }
  });
});
