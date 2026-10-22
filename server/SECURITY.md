# Website security checklist (GP Pharmacy CMS)

## Production setup
1. Set `JWT_SECRET` to a long random value (32+ characters) in Netlify / server env.
2. Set `CORS_ORIGINS` to your real site origin(s) only.
3. Change default admin passwords (or set `CMS_ADMIN_PASSWORD` / `CMS_EDITOR_PASSWORD` before first seed).
4. Force HTTPS (Netlify does this; HSTS header is enabled).

## What is enabled
- Security headers (nosniff, frame deny/same-origin, referrer, permissions, HSTS, CSP)
- JWT auth for all CMS write/read admin routes (token in sessionStorage, 4h expiry)
- Login rate limit + lockout after repeated failures
- Upload rate limit + magic-byte image validation (JPEG/PNG/WebP/GIF only, 5 MB)
- CMS payload XSS sanitization on save
- Password hashes never accepted from the client
- CORS allowlist
- `npm run backup` copies `data/cms.json` into `server/backups/` (keeps last 30)

## Backup
```bash
cd server
npm run backup
```
