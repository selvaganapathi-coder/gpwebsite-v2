/**
 * G.P. Pharmacy College — Notice & Events Rendering
 * Renders dynamic notice board, events, and detail pages from GPNotices data (ERP-ready)
 */
(function () {
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('gpcms:patched', () => {
    if (!window.GPNotices) return;
    if (document.getElementById('homeNoticeBoard')) renderHomeSection();
    if (document.getElementById('newsNoticeBoard')) renderNewsPage();
    if (document.getElementById('mediaNewsList')) renderMediaNewsPage();
    if (document.getElementById('mediaEventsList')) renderMediaEventsPage();
  });

  const sec = () => window.GPSecurity;

  function safeLink(url, fallback) {
    const fb = fallback || '#';
    if (!url) return fb;
    const safe = sec()?.sanitizeUrl
      ? sec().sanitizeUrl(url, { allowRelative: true })
      : (/^javascript:/i.test(url) ? '' : url);
    return safe || fb;
  }

  function safeImg(url) {
    return sec()?.sanitizeImageUrl ? sec().sanitizeImageUrl(url) : (url || '');
  }

  function safeContent(html, fallback) {
    if (!html) return `<p>${escapeHtml(fallback || '')}</p>`;
    const cleaned = sec()?.stripScripts ? sec().stripScripts(html) : escapeHtml(html);
    return cleaned;
  }

  async function init() {
    if (!window.GPNotices) return;

    // Wait briefly for CMS public bootstrap when available
    try {
      if (window.GPCMS?.initAsync) await GPCMS.initAsync();
    } catch (_) { /* use seed data */ }

    // ERP: await GPNotices.loadFromERP('/api/notices');

    const page = document.body.dataset.page;

    if (document.getElementById('homeNoticeBoard')) renderHomeSection();
    if (document.getElementById('newsNoticeBoard')) renderNewsPage();
    if (document.getElementById('mediaNewsList')) renderMediaNewsPage();
    if (document.getElementById('mediaEventsList')) renderMediaEventsPage();
    if (document.getElementById('eventDetail')) renderEventDetail();
    if (page === 'news') initNoticeFilters();
    if (page === 'media-news') initMediaNewsFilters();
  }

  /* ─── Homepage ─── */
  function renderHomeSection() {
    renderNoticeBoard('homeNoticeBoard', 3);
    renderUpcomingEvents('homeUpcomingEvents', 4);
    renderNewsHighlights('homeNewsHighlights', 3);
    renderNoticeTicker('homeNoticeTicker');
  }

  function renderNoticeTicker(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const notices = GPNotices.getPublishedNotices().slice(0, 5);
    const items = notices.map(n => `
      <a href="${safeLink(n.link, `event.html?id=${encodeURIComponent(n.id)}`)}" class="notice-ticker__item">
        <span class="notice-ticker__dot" aria-hidden="true"></span>
        ${escapeHtml(n.title)}
      </a>
    `).join('');
    const animate = el.closest('.notice-ticker-wrap');
    el.innerHTML = animate ? items + items : items;
  }

  function noticeBoardItem(n) {
    const d = GPNotices.formatEventDate(n.date);
    const urgent = n.priority === 'high';
    return `
      <a href="${safeLink(n.link, 'news.html')}" class="notice-board__item${urgent ? ' notice-board__item--urgent' : ''}">
        <time class="notice-board__date" datetime="${n.date}">
          <strong>${d.day}</strong>
          <span>${d.month.slice(0, 3)}</span>
        </time>
        <div class="notice-board__body">
          <div class="notice-board__meta">
            <span class="notice-board__cat">${GPNotices.categoryLabel(n.category)}</span>
            ${urgent ? '<span class="notice-board__badge">Urgent</span>' : ''}
          </div>
          <strong class="notice-board__title">${escapeHtml(n.title)}</strong>
          <p class="notice-board__summary">${escapeHtml(n.summary)}</p>
        </div>
        <span class="notice-board__arrow" aria-hidden="true"></span>
      </a>
    `;
  }

  function renderNoticeBoard(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const notices = GPNotices.getPublishedNotices().slice(0, limit);
    el.innerHTML = notices.length
      ? notices.map(noticeBoardItem).join('')
      : '<p class="notice-board__empty">No notices at this time.</p>';
  }

  function renderUpcomingEvents(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const events = GPNotices.getUpcomingEvents().slice(0, limit);

    el.innerHTML = events.map(e => {
      const d = GPNotices.formatEventDate(e.date);
      return `
        <a href="event.html?id=${encodeURIComponent(e.id)}" class="event-card">
          <div class="event-card__date">
            <span class="event-card__month">${d.month}</span>
            <strong class="event-card__day">${d.day}</strong>
          </div>
          <div class="event-card__body">
            <span class="event-card__cat">${GPNotices.categoryLabel(e.category)}</span>
            <strong>${escapeHtml(e.title)}</strong>
            <p>${escapeHtml(e.summary)}</p>
            <span class="event-card__link">View event →</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function renderNewsHighlights(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const news = GPNotices.getPublishedNews().slice(0, limit);

    el.innerHTML = news.map(n => `
      <a href="event.html?id=${encodeURIComponent(n.id)}" class="news-card">
        <div class="news-card__img">
          <img src="${escapeHtml(safeImg(n.image))}" alt="" loading="lazy">
        </div>
        <div class="news-card__body">
          <span class="news-card__badge">📢 ${GPNotices.categoryLabel(n.category)}</span>
          <strong>${escapeHtml(n.title)}</strong>
          <p>${escapeHtml(n.summary)}</p>
        </div>
      </a>
    `).join('');
  }

  /* ─── Media News Page ─── */
  function renderMediaNewsPage() {
    renderNoticeTicker('newsNoticeTicker');
    renderMediaNewsList('all');
  }

  function renderMediaNewsList(category) {
    const el = document.getElementById('mediaNewsList');
    if (!el) return;

    let notices = GPNotices.getPublishedNotices();
    let news = GPNotices.getPublishedNews();
    if (category !== 'all') {
      notices = notices.filter(n => n.category === category);
      news = news.filter(n => n.category === category);
    }

    const items = [
      ...notices.map(n => ({ ...n, type: 'notice' })),
      ...news.map(n => ({ ...n, type: 'news' })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!items.length) {
      el.innerHTML = '<p class="section__desc">No news or announcements at this time.</p>';
      return;
    }

    el.innerHTML = items.map(item => {
      const d = GPNotices.formatEventDate(item.date);
      const href = item.type === 'news'
        ? `event.html?id=${encodeURIComponent(item.id)}`
        : safeLink(item.link, `event.html?id=${encodeURIComponent(item.id)}`);
      return `
        <a href="${href}" class="media-news-item">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
          </div>
          <div class="media-news-item__meta">
            <time class="media-news-item__date" datetime="${item.date}">${d.short}</time>
            <span class="media-news-item__cat">${GPNotices.categoryLabel(item.category)}</span>
            <span class="media-news-item__arrow" aria-hidden="true">→</span>
          </div>
        </a>`;
    }).join('');
  }

  function initMediaNewsFilters() {
    const filters = document.querySelectorAll('[data-notice-filter]');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('notice-filter--active'));
        btn.classList.add('notice-filter--active');
        renderMediaNewsList(btn.dataset.noticeFilter);
      });
    });
  }

  /* ─── Media Events Page ─── */
  function renderMediaEventsPage() {
    const el = document.getElementById('mediaEventsList');
    if (!el) return;

    const events = GPNotices.getUpcomingEvents();
    if (!events.length) {
      el.innerHTML = '<p class="section__desc">No upcoming events scheduled. Check back soon.</p>';
      return;
    }

    el.innerHTML = events.map(e => {
      const d = GPNotices.formatEventDate(e.date);
      return `
        <a href="event.html?id=${encodeURIComponent(e.id)}" class="media-event-row">
          <div class="media-event-row__date">
            <strong>${d.month} ${d.day}</strong>
            <span>${d.year}${e.time ? ' · ' + escapeHtml(e.time) : ''}</span>
          </div>
          <div class="media-event-row__body">
            <h3>${escapeHtml(e.title)}</h3>
            <p>${escapeHtml(e.summary)}${e.location ? ' · ' + escapeHtml(e.location) : ''}</p>
            <span class="media-event-row__tag">${GPNotices.categoryLabel(e.category)}</span>
          </div>
        </a>`;
    }).join('');
  }

  /* ─── News & Events Page (legacy hub) ─── */
  function renderNewsPage() {
    renderNoticeBoard('newsNoticeBoard', 999);
    renderUpcomingEvents('newsUpcomingEvents', 999);
    renderNewsHighlights('newsHighlightsGrid', 999);
    renderNoticeTicker('newsNoticeTicker');

    const erpBadge = document.getElementById('noticesErpBadge');
    if (erpBadge) {
      erpBadge.textContent = GPNotices.source === 'erp'
        ? '✓ Synced from ERP'
        : '🔌 Notices publish via ERP when connected';
    }
  }

  function initNoticeFilters() {
    const filters = document.querySelectorAll('[data-notice-filter]');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('notice-filter--active'));
        btn.classList.add('notice-filter--active');
        const cat = btn.dataset.noticeFilter;
        filterNotices(cat);
      });
    });
  }

  function filterNotices(category) {
    const board = document.getElementById('newsNoticeBoard');
    if (!board) return;
    let notices = GPNotices.getPublishedNotices();
    if (category !== 'all') notices = notices.filter(n => n.category === category);

    board.innerHTML = notices.map(n => {
      const d = GPNotices.formatEventDate(n.date);
      return `
        <a href="${n.link || 'news-events.html#notices'}" class="notice-board__item ${n.priority === 'high' ? 'notice-board__item--urgent' : ''}">
          <span class="notice-board__icon" aria-hidden="true">📢</span>
          <div class="notice-board__body">
            <span class="notice-board__cat">${GPNotices.categoryLabel(n.category)}</span>
            <strong>${escapeHtml(n.title)}</strong>
            <p>${escapeHtml(n.summary)}</p>
            <time datetime="${n.date}">${d.short}</time>
          </div>
          <span class="notice-board__arrow">→</span>
        </a>
      `;
    }).join('');
  }

  /* ─── Event Detail Page ─── */
  function renderEventDetail() {
    const el = document.getElementById('eventDetail');
    if (!el) return;

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const item = id ? GPNotices.getEvent(id) : null;

    if (!item) {
      el.innerHTML = `
        <div class="container">
          <div class="event-not-found">
            <h1>Event Not Found</h1>
            <p>The event or notice you're looking for doesn't exist or has been removed.</p>
            <a href="news.html" class="btn btn--red">Back to News</a>
          </div>
        </div>
      `;
      return;
    }

    const d = GPNotices.formatEventDate(item.date);
    const isEvent = GPNotices.events.some(e => e.id === id);
    const breadcrumb = isEvent ? 'Event' : 'News';

    document.title = `${item.title} | G.P. Pharmacy College`;

    el.innerHTML = `
      <section class="page-hero page-hero--compact">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">Home</a> / <a href="news.html">Media</a> / ${breadcrumb}</div>
          <h1 class="page-hero__title">${escapeHtml(item.title)}</h1>
          <p class="page-hero__subtitle">${escapeHtml(item.summary)}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="event-detail fade-up">
            ${item.image ? `<div class="event-detail__img"><img src="${escapeHtml(safeImg(item.image))}" alt="${escapeHtml(item.title)}" loading="lazy"></div>` : ''}
            <div class="event-detail__meta">
              <div class="event-detail__date-block">
                <span>${d.month}</span>
                <strong>${d.day}</strong>
                <small>${d.year}</small>
              </div>
              <div class="event-detail__info">
                ${item.time ? `<p><strong>Time:</strong> ${escapeHtml(item.time)}</p>` : ''}
                ${item.location ? `<p><strong>Location:</strong> ${escapeHtml(item.location)}</p>` : ''}
                <p><strong>Category:</strong> ${GPNotices.categoryLabel(item.category)}</p>
              </div>
            </div>
            <div class="event-detail__content">${safeContent(item.content, item.summary)}</div>
            <div class="event-detail__actions">
              <a href="${isEvent ? 'events.html' : 'news.html'}" class="btn btn--outline">← ${isEvent ? 'All Events' : 'All News'}</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
})();
