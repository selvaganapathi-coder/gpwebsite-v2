document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSlider();
  initMobileMenu();
  initScrollAnimations();
  initGalleryLightbox();
  initDeptTabs();
});

function initHeader() {
  const siteHeader = document.getElementById('siteHeader');
  const header = document.querySelector('.header');
  if (!siteHeader && !header) return;
  const el = siteHeader || header;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    el.classList.toggle('scrolled', y > 20);
    el.classList.toggle('header--compact', y > 120);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
  el.classList.add('header--ready');
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 7000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay();
    });
  });

  startAutoplay();
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.querySelector('.mobile-nav__close');
  if (!toggle || !nav) return;

  nav.querySelectorAll('.mobile-nav__item').forEach((item, i) => {
    item.style.setProperty('--nav-i', i);
  });

  nav.querySelectorAll('.mobile-nav__group-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.mobile-nav__group');
      const open = group.classList.toggle('open');
      group.classList.toggle('is-active', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  function setOpen(open) {
    toggle.classList.toggle('active', open);
    toggle.classList.toggle('is-open', open);
    nav.classList.toggle('open', open);
    nav.classList.toggle('is-open', open);
    overlay?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    overlay?.setAttribute('aria-hidden', String(!open));
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  closeBtn?.addEventListener('click', () => setOpen(false));
  overlay?.addEventListener('click', () => setOpen(false));

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
}

function initScrollAnimations() {
  /* Handled by js/animations.js */
}

function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.dataset.full || img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}


function initDeptTabs() {
  document.querySelectorAll('.dept-tabs').forEach((group) => {
    if (group.dataset.bound === '1') return;
    group.dataset.bound = '1';

    const directory = group.closest('.faculty-directory') || group.parentElement;
    const grid = directory?.querySelector('.faculty-grid');
    const empty = directory?.querySelector('.faculty-directory__empty');

    const applyFilter = (filter) => {
      if (!grid) return;
      let visible = 0;
      grid.querySelectorAll('.faculty-card').forEach((card) => {
        const dept = card.dataset.dept || '';
        const show = filter === 'all' || dept === filter;
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    };

    group.addEventListener('click', (e) => {
      const tab = e.target.closest('.dept-tab');
      if (!tab || !group.contains(tab)) return;

      group.querySelectorAll('.dept-tab').forEach((t) => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      applyFilter(tab.dataset.dept || 'all');
    });
  });
}

document.addEventListener('gpcms:patched', () => {
  initDeptTabs();
});
