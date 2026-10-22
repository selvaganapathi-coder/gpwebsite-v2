/**
 * Injects Open Graph, Twitter Card, and canonical URL from page title/description.
 */
(function () {
  const config = window.GP_SEO || {};
  const title = document.title || config.siteName;
  const desc =
    document.querySelector('meta[name="description"]')?.content || config.defaultDescription || '';
  const canonical = `${location.origin}${location.pathname}`;
  const image = config.defaultImage;

  function setMeta(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', config.siteName);
  setMeta('property', 'og:locale', 'en_IN');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', image);

  if (!document.querySelector('link[rel="canonical"]')) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    document.head.appendChild(link);
  }

  if (document.body?.dataset?.page === 'home' && !document.querySelector('script[type="application/ld+json"]')) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollegeOrUniversity',
      name: config.siteName,
      url: config.siteUrl || canonical,
      logo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/GP-Logo-neww.png',
      description: desc,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vaniyambadi Main Road, Mandalavadi (Vill&Po)',
        addressLocality: 'Jolarpet',
        addressRegion: 'Tamil Nadu',
        postalCode: '635851',
        addressCountry: 'IN',
      },
      telephone: '+91-94434-37487',
      email: 'gppharmacycollege@gmail.com',
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  if (!document.querySelector('script[src*="images.js"]')) {
    const origin = 'https://gppharmacycollege.com';
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = origin;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    }
    const cfg = document.createElement('script');
    cfg.src = 'js/images-config.js';
    cfg.onload = () => {
      const img = document.createElement('script');
      img.src = 'js/images.js';
      document.head.appendChild(img);
    };
    document.head.appendChild(cfg);
  }
})();
