/**
 * Image CDN + performance settings.
 * When Cloudinary is configured (server/.env or cms-media-config.js),
 * GPImages.optimize() applies f_auto,q_auto transforms automatically.
 */
window.GP_IMAGES = {
  cdnOrigin: 'https://gppharmacycollege.com',
  cdnBase: 'https://gppharmacycollege.com/wp-content/uploads/2025/03',
  sizes: {
    thumb: 120,
    avatar: 160,
    card: 480,
    content: 800,
    wide: 1200,
    hero: 1920,
  },
  defaults: {
    format: 'auto',
    quality: 'auto',
  },
};
