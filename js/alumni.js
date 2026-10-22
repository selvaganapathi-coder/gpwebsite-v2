/**
 * Alumni Portal — registration & directory (localStorage demo, ERP-ready)
 */
(function () {
  const STORAGE_KEY = 'gp_alumni_registrations';

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('alumniRegisterForm')) initRegistration();
    if (document.getElementById('alumniDirectory')) renderDirectory('alumniDirectory');
    if (document.getElementById('homeAlumniDirectory')) renderDirectory('homeAlumniDirectory', 4);
  });

  function initRegistration() {
    const form = document.getElementById('alumniRegisterForm');
    const success = document.getElementById('alumniRegisterSuccess');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data.registeredAt = new Date().toISOString();
      data.id = 'ALM' + Date.now().toString(36).toUpperCase();

      const regs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      regs.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));

      form.hidden = true;
      success.hidden = false;
      document.getElementById('alumniRegId').textContent = data.id;
    });
  }

  function renderDirectory(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el || !window.GPAlumni) return;
    const list = limit ? GPAlumni.directory.slice(0, limit) : GPAlumni.directory;
    el.innerHTML = list.map(a => {
      const initials = a.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      return `
        <article class="alumni-card">
          <div class="alumni-card__avatar">${initials}</div>
          <div class="alumni-card__body">
            <strong>${esc(a.name)}</strong>
            <span class="alumni-card__batch">${esc(a.course)} · Batch ${esc(a.batch)}</span>
            <p>${esc(a.role)} @ ${esc(a.company)}</p>
            <span class="alumni-card__loc">📍 ${esc(a.location)}</span>
          </div>
        </article>
      `;
    }).join('');
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
