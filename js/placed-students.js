/**
 * Placed Students — render year cards & expandable name lists
 */
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (document.body.dataset.page !== 'placed-students') return;
    if (!window.GPPlacedStudents) return;

    renderCards();
    initCounters();
  }

  function renderCards() {
    const grid = document.getElementById('placedGrid');
    if (!grid) return;

    grid.innerHTML = GPPlacedStudents.batches.map(batch => {
      const rows = (batch.students || []).map(s => `
        <tr>
          <td>${esc(s.name)}</td>
          <td>${esc(s.course)}</td>
          <td>${esc(s.company)}</td>
        </tr>`).join('');

      return `
        <article class="placed-card fade-up" data-batch="${escAttr(batch.id)}">
          <div class="placed-card__body">
            <h2 class="placed-card__year">${esc(batch.label)}</h2>
            <p class="placed-card__count">
              <strong data-count="${batch.count}">0</strong>
              students placed
            </p>
          </div>
          <button type="button" class="placed-card__action" aria-expanded="false" aria-controls="placed-list-${escAttr(batch.id)}">
            <span class="placed-card__action-icon" aria-hidden="true">📄</span>
            View Name List
          </button>
          <div class="placed-card__list" id="placed-list-${escAttr(batch.id)}" hidden>
            <div class="placed-card__list-inner">
              <p class="placed-card__list-note">Sample listing — full records via Training &amp; Placement Cell</p>
              <table class="placed-student-table">
                <thead>
                  <tr><th>Name</th><th>Course</th><th>Company</th></tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        </article>`;
    }).join('');

    grid.querySelectorAll('.placed-card__action').forEach(btn => {
      btn.addEventListener('click', () => toggleList(btn));
    });
  }

  function toggleList(btn) {
    const card = btn.closest('.placed-card');
    const list = card?.querySelector('.placed-card__list');
    if (!list) return;

    const open = btn.getAttribute('aria-expanded') === 'true';

    gridCloseAll(btn);

    if (!open) {
      list.hidden = false;
      list.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = '<span class="placed-card__action-icon" aria-hidden="true">✕</span> Close List';
    }
  }

  function gridCloseAll(exceptBtn) {
    document.querySelectorAll('.placed-card__action').forEach(btn => {
      if (btn === exceptBtn) return;
      const list = btn.closest('.placed-card')?.querySelector('.placed-card__list');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="placed-card__action-icon" aria-hidden="true">📄</span> View Name List';
      if (list) {
        list.classList.remove('is-open');
        list.hidden = true;
      }
    });
  }

  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.count) || 0;
          if (reduced) {
            el.textContent = String(target);
          } else {
            animateCount(el, target);
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    els.forEach(el => observer.observe(el));
  }

  function animateCount(el, target) {
    const duration = 1200;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function esc(s) {
    if (window.GPSecurity?.escapeHtml) return GPSecurity.escapeHtml(s);
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }
})();
