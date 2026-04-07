document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
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
    if (updated) updated.textContent = formatLastUpdated();
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
