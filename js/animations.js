/**
 * G.P. Pharmacy College — Motion & Scroll Animations
 * Hero cascade · stagger reveals · stat counters · journey pulse
 */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (REDUCED) {
      document.documentElement.classList.add('motion-reduced');
      document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
      return;
    }

    initHeroCascade();
    initScrollAnimations();
    initStaggerGrids();
    initPageHero();
    initCounters();
    initJourney();
    initCardShine();
    initHeaderMotion();
    initDropdownMotion();
    initTiltCards();
    initSectionReveal();
  }

  /* ─── Hero text cascade on load ─── */
  function initHeroCascade() {
    const hero = document.querySelector('.hero--strong .hero__text');
    if (!hero) return;

    hero.classList.add('hero-cascade');
    const items = [
      hero.querySelector('.hero__badge'),
      hero.querySelector('.hero__title'),
      hero.querySelector('.hero__subtitle'),
      hero.querySelector('.hero__actions'),
    ].filter(Boolean);

    items.forEach((el, i) => {
      el.classList.add('anim-cascade-item');
      el.style.setProperty('--anim-delay', `${0.15 + i * 0.12}s`);
    });

    requestAnimationFrame(() => hero.classList.add('hero-cascade--play'));
  }

  /* ─── Scroll fade-up (enhanced) ─── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          staggerChildren(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ─── Auto-stagger card grids ─── */
  function initStaggerGrids() {
    const selectors = [
      '.portal-hub',
      '.programs-grid',
      '.advantages-grid',
      '.placement-modules-grid',
      '.research-modules',
      '.hero-trust__grid',
      '.faculty-grid',
      '.dept-cards',
      '.placed-grid',
      '.about-board',
      '.steps',
      '.home-courses__grid',
      '.home-courses__track',
      '.resource-grid',
      '.alumni-modules-grid',
      '.media-blog-grid',
      '.media-magazine-grid',
      '.media-news-list',
      '.media-events-list',
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(grid => {
        grid.classList.add('anim-stagger-grid');
        grid.querySelectorAll(':scope > *').forEach((child, i) => {
          child.classList.add('anim-stagger-item');
          child.style.setProperty('--stagger-i', i);
        });
      });
    });
  }

  function staggerChildren(container) {
    const grids = [];
    if (container.classList.contains('anim-stagger-grid')) grids.push(container);
    container.querySelectorAll('.anim-stagger-grid').forEach(g => grids.push(g));
    grids.forEach(g => g.classList.add('anim-stagger-grid--play'));
  }

  /* ─── Inner page hero entrance ─── */
  function initPageHero() {
    const hero = document.querySelector('.page-hero .container');
    if (!hero) return;

    hero.classList.add('page-hero-animate');
    ['.breadcrumb', '.page-hero__title', '.page-hero__subtitle'].forEach((sel, i) => {
      const el = hero.querySelector(sel);
      if (el) {
        el.classList.add('anim-cascade-item');
        el.style.setProperty('--anim-delay', `${0.1 + i * 0.1}s`);
      }
    });

    requestAnimationFrame(() => hero.classList.add('page-hero-animate--play'));
  }

  /* ─── Count-up stats ─── */
  function initCounters() {
    const counters = document.querySelectorAll(
      '.placement-portal-stat strong, .research-stat strong, .placement-portal-stat-card strong, .home-stat strong'
    );
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d,.]+)\s*(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    const hasPlus = raw.includes('+');
    const hasPercent = raw.includes('%');
    const isDecimal = match[1].includes('.');
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;

      let display;
      if (isDecimal) display = current.toFixed(1);
      else display = Math.round(current).toString();

      if (hasPlus) display += '+';
      if (hasPercent) display += '%';
      else if (suffix && !hasPlus) display += (suffix.startsWith(' ') ? '' : ' ') + suffix;

      el.textContent = display;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    }

    el.textContent = '0' + (hasPlus ? '+' : hasPercent ? '%' : '');
    requestAnimationFrame(tick);
  }

  /* ─── Student journey step pulse ─── */
  function initJourney() {
    const track = document.querySelector('.journey-track');
    if (!track) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          track.classList.add('journey-track--animate');
          track.querySelectorAll('.journey-step').forEach((step, i) => {
            step.style.setProperty('--step-delay', `${i * 0.08}s`);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(track);
  }

  /* ─── Subtle shine sweep on primary CTAs ─── */
  function initCardShine() {
    document.querySelectorAll('.btn--red, .btn--amber, .portal-card--featured, .placed-card__action').forEach(el => {
      el.classList.add('anim-shine');
    });
  }

  /* ─── Header entrance on load ─── */
  function initHeaderMotion() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    header.classList.add('site-header--animate');
    requestAnimationFrame(() => header.classList.add('site-header--animate-play'));
  }

  /* ─── Dropdown link stagger ─── */
  function initDropdownMotion() {
    document.querySelectorAll('.nav__dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const menu = btn.closest('.nav__dropdown')?.querySelector('.nav__dropdown-menu');
        if (!menu) return;
        menu.querySelectorAll('.nav__dropdown-link').forEach((link, i) => {
          link.style.setProperty('--dropdown-i', i);
        });
      });
    });
  }

  /* ─── Subtle 3D tilt on premium cards ─── */
  function initTiltCards() {
    /* Intentionally light motion only — skip 3D tilt */
  }

  /* ─── Section title line draw ─── */
  function initSectionReveal() {
    const titles = document.querySelectorAll('.section__title');
    if (!titles.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('section__title--revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    titles.forEach(el => observer.observe(el));
  }
})();
