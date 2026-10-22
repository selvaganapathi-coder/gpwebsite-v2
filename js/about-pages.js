/**
 * About section pages — recent news on about.html
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'about') return;
    renderRecentNews();
  });

  function renderRecentNews() {
    const grid = document.getElementById('aboutRecentNews');
    if (!grid || !window.GPNotices) return;

    const items = [
      ...GPNotices.getPublishedNews().slice(0, 2),
      ...GPNotices.getPublishedNotices().slice(0, 1),
    ].slice(0, 3);

    if (!items.length) {
      grid.innerHTML = '<p style="color:var(--text-light);grid-column:1/-1">No recent news at the moment.</p>';
      return;
    }

    grid.innerHTML = items.map(item => {
      const d = GPNotices.formatEventDate(item.date);
      const href = item.link || `event.html?id=${encodeURIComponent(item.id)}`;
      const cat = GPNotices.categoryLabel(item.category);
      return `
        <a href="${href}" class="about-news-mini fade-up">
          <span class="about-news-mini__cat">${esc(cat)}</span>
          <h4>${esc(item.title)}</h4>
          <time datetime="${esc(item.date)}">${esc(d.short)}</time>
        </a>`;
    }).join('');
  }

  function esc(s) {
    if (!window.GPSecurity?.escapeHtml) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return GPSecurity.escapeHtml(s);
  }
})();
