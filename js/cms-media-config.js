/**
 * Media upload settings for Admin CMS (Phase 1).
 *
 * Option A — Server upload (recommended when CMS server is running):
 * Images save to /uploads/ on the Node server — no extra config needed.
 *
 * Option B — Cloudinary (recommended for production CDN + auto-optimization):
 * 1. Create free account at https://cloudinary.com
 * 2. Settings → Upload → Add upload preset → Signing Mode: Unsigned
 * 3. Fill cloudName and uploadPreset below (or set CLOUDINARY_* in server/.env)
 *
 * Option C — ImgBB:
 * 1. Get API key from https://api.imgbb.com
 * 2. Fill imgbb.apiKey below
 *
 * If none is configured, staff can still paste image URLs manually.
 */
window.GP_CMS_MEDIA = {
  cloudinary: {
    cloudName: '',
    uploadPreset: '',
  },
  imgbb: {
    apiKey: '',
  },
};
