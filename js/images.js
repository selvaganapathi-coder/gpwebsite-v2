/**
 * Image CDN helpers, hero preloading, and sitewide performance defaults.
 */
(function (global) {
  if (global.__GP_IMAGES_INIT__) return;
  global.__GP_IMAGES_INIT__ = true;

  const config = global.GP_IMAGES || {};
  const CDN_BASE = config.cdnBase || 'https://gppharmacycollege.com/wp-content/uploads/2025/03';
  const CDN_ORIGIN = config.cdnOrigin || 'https://gppharmacycollege.com';
  const SIZES = config.sizes || { thumb: 120, card: 480, content: 800, hero: 1920 };

  function asset(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${CDN_BASE}/${String(path).replace(/^\//, '')}`;
  }

  function isCloudinary(url) {
    return /res\.cloudinary\.com\/.+\/upload\//i.test(url || '');
  }

  function optimize(url, options = {}) {
    if (!url) return '';
    const width = options.width || options.w;
    const quality = options.quality || config.defaults?.quality || 'auto';
    const format = options.format || config.defaults?.format || 'auto';

    if (isCloudinary(url)) {
      if (/\/upload\/[^/]+\//.test(url) && !url.includes('/upload/f_')) {
        const transforms = [`f_${format}`, `q_${quality}`];
        if (width) transforms.push(`w_${width}`);
        return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
      }
      return url;
    }

    return url;
  }

  function srcset(url, widths = [480, 800, 1200]) {
    if (!isCloudinary(url)) return '';
    return widths.map((w) => `${optimize(url, { width: w })} ${w}w`).join(', ');
  }

  function lazyAttrs(options = {}) {
    const eager = options.eager || options.priority === 'high';
    return eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  }

  function injectResourceHints() {
    if (!document.querySelector(`link[rel="preconnect"][href="${CDN_ORIGIN}"]`)) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = CDN_ORIGIN;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    }
    if (!document.querySelector(`link[rel="dns-prefetch"][href="${CDN_ORIGIN}"]`)) {
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = CDN_ORIGIN;
      document.head.appendChild(dns);
    }
  }

  function preloadImage(url, highPriority) {
    if (!url || document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimize(url, { width: SIZES.hero });
    if (highPriority) link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  }

  function loadSlideBackground(slide, url) {
    if (!slide || !url || slide.dataset.loaded === 'true') return;
    const optimized = optimize(url, { width: SIZES.hero });
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      slide.style.backgroundImage = `url('${optimized.replace(/'/g, '%27')}')`;
      slide.dataset.loaded = 'true';
      slide.classList.add('is-loaded');
    };
    img.src = optimized;
  }

  function getSlideUrl(slide) {
    if (slide.dataset.bg) return slide.dataset.bg;
    const match = slide.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      slide.dataset.bg = match[1];
      if (!slide.classList.contains('active')) slide.style.backgroundImage = '';
    }
    return slide.dataset.bg || '';
  }

  function initHeroSlides() {
    const slides = document.querySelectorAll('.hero__slide');
    if (!slides.length) return;

    slides.forEach((slide, index) => {
      const url = getSlideUrl(slide);
      if (!url) return;
      slide.dataset.bg = url;

      if (index === 0 || slide.classList.contains('active')) {
        if (index === 0) preloadImage(url, true);
        loadSlideBackground(slide, url);
      } else if (slide.style.backgroundImage) {
        slide.style.backgroundImage = '';
      }
    });
  }

  function prefetchHeroSlide(slides, index) {
    const slide = slides?.[index];
    if (!slide) return;
    loadSlideBackground(slide, getSlideUrl(slide));
  }

  function enhanceImages() {
    const hero = document.querySelector('.hero, .hero--srec');
    const header = document.querySelector('.header, .site-header');

    document.querySelectorAll('img').forEach((img) => {
      if (img.hasAttribute('loading') || img.hasAttribute('fetchpriority')) return;
      if (hero && hero.contains(img)) return;

      const inHeader = header && header.contains(img);
      const src = img.getAttribute('src') || '';
      if (src && isCloudinary(src) && !img.srcset) {
        const srcSet = srcset(src, [SIZES.card, SIZES.content, SIZES.wide]);
        if (srcSet) {
          img.srcset = srcSet;
          img.sizes = img.sizes || '(max-width: 768px) 100vw, 800px';
        }
        img.src = optimize(src, { width: SIZES.content });
      }

      if (inHeader) {
        img.decoding = 'async';
        return;
      }

      img.loading = 'lazy';
      img.decoding = 'async';
    });

    document.querySelectorAll('iframe[src]:not([loading])').forEach((frame) => {
      frame.loading = 'lazy';
    });
  }

  injectResourceHints();
  initHeroSlides();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceImages);
  } else {
    enhanceImages();
  }

  global.GPImages = {
    CDN_BASE,
    CDN_ORIGIN,
    SIZES,
    asset,
    optimize,
    srcset,
    lazyAttrs,
    preloadImage,
    initHeroSlides,
    prefetchHeroSlide,
    loadSlideBackground,
    enhanceImages,
    injectResourceHints,
  };
})();
