/**
 * Media pages — blog, magazine layouts
 */
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const page = document.body.dataset.page;
    if (page === 'media-blog') renderBlog();
    if (page === 'media-magazine') renderMagazine();
  }

  function renderBlog() {
    const grid = document.getElementById('mediaBlogGrid');
    if (!grid || !window.GPMedia?.blog) return;

    if (!GPMedia.blog.length) {
      grid.innerHTML = '<p class="media-empty">Articles will appear here when published.</p>';
      return;
    }

    grid.innerHTML = GPMedia.blog.map(post => {
      const d = formatDate(post.date);
      const href = safeHref(post.href);
      const img = safeImg(post.image);
      return `
        <a href="${escAttr(href)}" class="media-blog-card fade-up">
          <div class="media-blog-card__img">
            <img src="${escAttr(img)}" alt="" loading="lazy" decoding="async">
          </div>
          <div class="media-blog-card__body">
            <span class="media-blog-card__date">${esc(d)}</span>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.excerpt)}</p>
            <span class="media-blog-card__author">${esc(post.author)}</span>
          </div>
        </a>`;
    }).join('');
  }

  function renderMagazine() {
    const featuredEl = document.getElementById('mediaMagazineFeatured');
    const grid = document.getElementById('mediaMagazineGrid');
    if (!window.GPMedia?.magazine) return;

    const issues = GPMedia.magazine.slice();
    if (!issues.length) {
      if (featuredEl) featuredEl.innerHTML = '<p class="media-empty">Magazine issues will appear when published.</p>';
      if (grid) grid.innerHTML = '';
      return;
    }

    const featured = issues.find(m => m.featured) || issues[0];
    const archive = issues.filter(m => m !== featured);

    if (featuredEl) {
      const img = safeImg(featured.cover);
      featuredEl.innerHTML = `
        <div class="media-magazine-featured fade-up">
          <div class="media-magazine-featured__cover">
            <img src="${escAttr(img)}" alt="${escAttr(featured.title)}" loading="lazy" decoding="async">
            <span class="media-magazine-featured__year">${esc(featured.year)}</span>
          </div>
          <div class="media-magazine-featured__body">
            <span class="media-magazine-featured__issue">${esc(featured.issue)}</span>
            <h3>${esc(featured.title)}</h3>
            <p>${esc(featured.desc)}</p>
            <div class="media-magazine-featured__actions">
              <a href="contact.html" class="btn btn--red">Request a Copy</a>
              <a href="admissions.html" class="btn btn--amber">Talk to Admin</a>
            </div>
          </div>
        </div>`;
    }

    if (!grid) return;

    if (!archive.length) {
      grid.innerHTML = '';
      return;
    }

    const label = document.getElementById('mediaMagazineArchiveLabel');
    if (label) label.hidden = false;

    grid.innerHTML = archive.map(mag => {
      const img = safeImg(mag.cover);
      return `
        <article class="media-magazine-card fade-up">
          <div class="media-magazine-card__cover">
            <img src="${escAttr(img)}" alt="${escAttr(mag.title)}" loading="lazy" decoding="async">
            <span class="media-magazine-card__year">${esc(mag.year)}</span>
          </div>
          <div class="media-magazine-card__body">
            <h3>${esc(mag.title)}</h3>
            <p class="media-magazine-card__issue">${esc(mag.issue)}</p>
            <p>${esc(mag.desc)}</p>
            <a href="contact.html" class="btn btn--red btn--sm">Request Copy</a>
          </div>
        </article>`;
    }).join('');
  }

  function formatDate(dateStr) {
    if (window.GPNotices?.formatEventDate) {
      return GPNotices.formatEventDate(dateStr).short;
    }
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  function safeHref(url) {
    if (window.GPSecurity?.sanitizeExternalUrl) {
      const clean = GPSecurity.sanitizeExternalUrl(url, { allowRelative: true });
      if (clean) return clean;
    }
    if (window.GPSecurity?.sanitizeUrl) {
      const clean = GPSecurity.sanitizeUrl(url, { allowRelative: true });
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
