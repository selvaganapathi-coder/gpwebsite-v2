/**
 * Departments page — render cards, side nav, scroll spy
 */
(function () {
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (document.body.dataset.page !== 'departments') return;
    if (!window.GPDepartments) return;

    renderSections();
    initSectionReveal();
  }

  function renderSections() {
    const mount = document.getElementById('deptSections');
    if (!mount) return;

    mount.innerHTML = GPDepartments.departments.map((dept, i) => {
      const cards = dept.programs.map((prog, pi) => `
        <a href="${escAttr(safeHref(prog.href))}" class="dept-card${pi === 0 && dept.programs.length === 1 ? ' dept-card--full' : ''}">
          <div class="dept-card__shell box-effect">
            <div class="dept-card__frame">
              <div class="dept-card__img half-circle" style="background-image:url('${escAttr(safeImg(prog.image))}')" role="img" aria-label="${escAttr(prog.name)}"></div>
            </div>
            <h3 class="dept-card__label">${esc(prog.name)}</h3>
            <p class="dept-card__meta">${esc(dept.title)}</p>
          </div>
        </a>`).join('');

      return `
        <section class="dept-section" id="${escAttr(dept.id)}" data-dept="${escAttr(dept.id)}">
          <div class="container">
            <header class="dept-section__head fade-up">
              <h2 class="dept-section__title">${esc(dept.title)}</h2>
              <div class="dept-section__divider" aria-hidden="true"><span></span><span></span><span></span></div>
            </header>
            <div class="dept-cards">${cards}</div>
          </div>
        </section>`;
    }).join('');
  }

  function initSectionReveal() {
    const sections = document.querySelectorAll('.dept-section');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach(section => observer.observe(section));
  }

  function safeHref(url) {
    if (window.GPSecurity?.sanitizeExternalUrl) {
      const clean = GPSecurity.sanitizeExternalUrl(url);
      if (clean) return clean;
    }
    return url && !/^javascript:/i.test(url) ? url : '#';
  }

  function safeImg(url) {
    if (window.GPSecurity?.sanitizeImageUrl) return GPSecurity.sanitizeImageUrl(url) || '';
    return url || '';
  }

  function esc(s) {
    if (window.GPSecurity?.escapeHtml) return GPSecurity.escapeHtml(s);
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }
})();
