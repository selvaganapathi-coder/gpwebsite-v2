/**
 * Route Map — QR code cards for campus navigation
 */
(function () {
  const ROUTES = [
    {
      id: 'main',
      label: 'Main Campus',
      title: 'GP Pharmacy College',
      desc: 'Scan to open the college location on Google Maps — Vaniyambadi Main Road, Mandalavadi, Jolarpet.',
      url: 'https://www.google.com/maps/place/GP+PHARMACY+COLLEGE/@12.612339,78.599926,17z',
    },
    {
      id: 'jolarpet',
      label: 'From Jolarpet',
      title: 'Jolarpet Railway Station',
      desc: 'Turn-by-turn directions from Jolarpet Railway Station to the college campus (~5 km).',
      url: 'https://www.google.com/maps/dir/Jolarpet+Railway+Station,+Jolarpet,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
    {
      id: 'tirupattur',
      label: 'From Tirupattur',
      title: 'Tirupattur Town',
      desc: 'Driving directions from Tirupattur via Vaniyambadi Main Road to GP Pharmacy College.',
      url: 'https://www.google.com/maps/dir/Tirupattur,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
  ];

  document.addEventListener('DOMContentLoaded', renderQrCards);

  function renderQrCards() {
    const grid = document.getElementById('routeQrGrid');
    if (!grid) return;

    grid.innerHTML = ROUTES.map(route => {
      const safeUrl = sanitizeUrl(route.url);
      const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(safeUrl)}`;
      return `
        <article class="route-qr-card fade-up">
          <div class="route-qr-card__frame">
            <img src="${escAttr(qrSrc)}" width="220" height="220" alt="QR code — ${esc(route.title)}" loading="lazy">
          </div>
          <span class="route-qr-card__label">${esc(route.label)}</span>
          <h3>${esc(route.title)}</h3>
          <p>${esc(route.desc)}</p>
          <a href="${escAttr(safeUrl)}" class="route-qr-card__link" target="_blank" rel="noopener noreferrer">Open in Maps →</a>
        </article>`;
    }).join('');
  }

  function sanitizeUrl(url) {
    if (window.GPSecurity?.sanitizeExternalUrl) {
      return GPSecurity.sanitizeExternalUrl(url) || url;
    }
    return url;
  }

  function esc(s) {
    if (window.GPSecurity?.escapeHtml) return GPSecurity.escapeHtml(s);
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }
})();
