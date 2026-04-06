/* ═══════════════════════════════════════════
   Norsklaben – Felles JavaScript
   Brukt av: skrivelab.html, nynorsklab.html
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Toggle kategorikort ───
  document.querySelectorAll('.ch').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.card').classList.toggle('open');
    });
  });

  // ─── Toggle enkeltoppgåver ───
  document.querySelectorAll('.etog').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ei').classList.toggle('open');
    });
  });

  // ─── Søk ───
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      filterCards(q, activeOp());
    });
  }

  // ─── Operasjonsfilter-chips ───
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterCards(q, chip.dataset.op);
    });
  });

});

// ─── Hent aktiv operasjon ───
function activeOp() {
  const active = document.querySelector('.chip.active');
  return active ? active.dataset.op : 'alle';
}

// ─── Hovudfilterfunksjon ───
function filterCards(q, op) {
  document.querySelectorAll('.card').forEach(card => {
    const textContent = [
      card.querySelector('.cn')?.textContent || '',
      card.querySelector('.cd')?.textContent || '',
      ...[...card.querySelectorAll('.etit')].map(e => e.textContent)
    ].join(' ').toLowerCase();

    const matchesSearch = !q || textContent.includes(q);

    const matchesOp = op === 'alle' || [...card.querySelectorAll('.ei')].some(ei =>
      [...ei.querySelectorAll('.b')].some(b => b.textContent.toLowerCase().includes(op))
    );

    card.classList.toggle('hidden', !matchesSearch || !matchesOp);
  });

  // Skjul tomme grupper
  document.querySelectorAll('.grp').forEach(grp => {
    const hasVisible = [...grp.querySelectorAll('.card')].some(c => !c.classList.contains('hidden'));
    grp.style.display = hasVisible ? '' : 'none';
  });
}

// ─── Fasit-toggle (kalla frå inline onclick) ───
function toggleF(btn) {
  btn.classList.toggle('shown');
  const fb = btn.nextElementSibling;
  fb.classList.toggle('shown');

  const fl = fb.querySelector('.fl');
  const isRett = fl && fl.textContent.toLowerCase().includes('rettlei');
  const isShown = btn.classList.contains('shown');

  btn.textContent = isShown
    ? (isRett ? 'Skjul rettleiing' : 'Skjul fasit')
    : (isRett ? 'Vis rettleiing' : 'Vis fasit');
}
