/**
 * Achievements & Gallery rendering
 */
(function () {
  document.addEventListener('DOMContentLoaded', init);

  const sec = () => window.GPSecurity;

  function safeImg(url) {
    return sec()?.sanitizeImageUrl ? sec().sanitizeImageUrl(url) : (url || '');
  }

  function safeLink(url, fallback) {
    const fb = fallback || '#';
    if (!url) return fb;
    const safe = sec()?.sanitizeUrl ? sec().sanitizeUrl(url, { allowRelative: true }) : url;
    return safe || fb;
  }

  function init() {
    if (document.getElementById('achievementsGrid')) initAchievements();
    if (document.getElementById('homeAchievements')) renderHomeAchievements();
    if (document.getElementById('advancedGallery')) initGallery();
    if (document.getElementById('homeGalleryShowcase')) renderHomeGallery();
  }

  document.addEventListener('gpcms:patched', () => {
    if (document.getElementById('advancedGallery')) initGallery();
    if (document.getElementById('homeGalleryShowcase')) renderHomeGallery();
    if (document.getElementById('achievementsGrid')) initAchievements();
    if (document.getElementById('homeAchievements')) renderHomeAchievements();
  });

  /* ─── Achievements ─── */
  function initAchievements() {
    const grid = document.getElementById('achievementsGrid');
    const filters = document.querySelectorAll('[data-achievement-filter]');
    let active = 'all';

    function render(cat) {
      const items = window.GPAchievements?.getByCategory(cat) || [];
      grid.innerHTML = items.map(renderAchievementCard).join('');
    }

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('achievement-filter--active'));
        btn.classList.add('achievement-filter--active');
        active = btn.dataset.achievementFilter;
        render(active);
      });
    });

    render('all');
  }

  function renderHomeAchievements() {
    const el = document.getElementById('homeAchievements');
    if (!el || !window.GPAchievements) return;
    el.innerHTML = GPAchievements.items.slice(0, 6).map(renderAchievementCard).join('');
  }

  function renderAchievementCard(a) {
    const cat = GPAchievements.getCategory(a.category);
    return `
      <article class="achievement-card">
        <div class="achievement-card__photo">
          <img src="${a.photo}" alt="${escapeHtml(a.student)}" loading="lazy">
          <span class="achievement-card__badge">${cat?.icon || '🏆'} ${cat?.label || ''}</span>
        </div>
        <div class="achievement-card__body">
          <div class="achievement-card__student">
            <strong>${escapeHtml(a.student)}</strong>
            <span>${escapeHtml(a.course)}</span>
          </div>
          <h3 class="achievement-card__title">${escapeHtml(a.achievement)}</h3>
          <p class="achievement-card__event">${escapeHtml(a.event)}</p>
          <div class="achievement-card__meta">
            <time datetime="${a.date}">${GPAchievements.formatDate(a.date)}</time>
            ${a.certificate ? '<span class="achievement-card__cert">📜 Certificate</span>' : ''}
          </div>
        </div>
      </article>
    `;
  }

  /* ─── Advanced Gallery ─── */
  function initGallery() {
    const grid = document.getElementById('advancedGallery');
    const filterBar = document.getElementById('galleryFilterBar');
    if (!grid) return;

    if (filterBar && window.GPGallery) {
      filterBar.innerHTML = GPGallery.categories.map((c, i) =>
        `<button type="button" class="gallery-filter${i === 0 ? ' gallery-filter--active' : ''}" data-gallery-filter="${c.id}">${c.label}</button>`
      ).join('');
    }

    const filters = document.querySelectorAll('[data-gallery-filter]');

    function render(cat) {
      const items = window.GPGallery?.getByCategory(cat) || [];
      grid.innerHTML = items.map(renderGalleryTile).join('');
      bindGalleryClicks();
      bindLightbox(grid);
    }

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('gallery-filter--active'));
        btn.classList.add('gallery-filter--active');
        render(btn.dataset.galleryFilter);
      });
    });

    render('all');
  }

  function renderHomeGallery() {
    const el = document.getElementById('homeGalleryShowcase');
    if (!el || !window.GPGallery) return;
    const featured = GPGallery.items.filter(i => i.size === 'large' || i.size === 'wide' || i.type === '360').slice(0, 5);
    el.innerHTML = featured.map(renderGalleryTile).join('');
    bindGalleryClicks(el);
    bindLightbox(el);
  }

  function renderGalleryTile(item) {
    const sizeClass = item.size ? `gallery-tile--${item.size}` : '';
    const typeClass = `gallery-tile--${item.type}`;

    if (item.type === '360') {
      return `
        <a href="${safeLink(item.tourUrl, 'campus.html')}" class="gallery-tile gallery-tile--360 ${sizeClass}">
          <img src="${escapeHtml(safeImg(item.src))}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
          <div class="gallery-tile__overlay">
            <span class="gallery-tile__type">360° Tour</span>
            <strong>${escapeHtml(item.title)}</strong>
          </div>
        </a>
      `;
    }

    if (item.type === 'video') {
      return `
        <div class="gallery-tile gallery-tile--video ${sizeClass}" data-video="${item.id}" role="button" tabindex="0">
          <img src="${escapeHtml(safeImg(item.src))}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
          <div class="gallery-tile__overlay">
            <span class="gallery-tile__play" aria-hidden="true">▶</span>
            <strong>${escapeHtml(item.title)}</strong>
            <span class="gallery-tile__type">${item.videoLabel || 'Video'}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="gallery-tile gallery-tile--photo ${sizeClass} gallery-item" data-full="${escapeHtml(safeImg(item.src))}">
        <img src="${escapeHtml(safeImg(item.src))}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
        <div class="gallery-tile__overlay">
          <strong>${escapeHtml(item.title)}</strong>
          <span class="gallery-tile__type">Photo</span>
        </div>
      </div>
    `;
  }

  function bindGalleryClicks(root) {
    const scope = root || document;
    scope.querySelectorAll('.gallery-tile--video').forEach(tile => {
      tile.addEventListener('click', () => {
        alert('Video gallery will connect to media library via ERP. Sample preview.');
      });
    });
  }

  function bindLightbox(scope) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImg = lightbox.querySelector('img');
    scope.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;
        lightboxImg.src = item.dataset.full || img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
})();
