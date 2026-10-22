# GP Pharmacy CMS Server (Phase 2)

Shared content + image uploads for the college website.

## Quick start

```bash
cd server
copy .env.example .env
npm install
npm start
```

Open:
- Website: http://localhost:3001
- Admin: http://localhost:3001/admin.html

### Default admin login
- Email: `admin@gppharmacycollege.com`
- Password: `gpadmin2026`

## How it works

```
Admin edits content → saves to server/database (cms.json)
Public website → loads content from /api/content/public
Image upload → POST /api/upload → Cloudinary or local /uploads/
```

## Configuration

### `server/.env`
| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 3001) |
| `JWT_SECRET` | Change in production |
| `CLOUDINARY_*` | Optional image hosting |

### `js/cms-api-config.js`
| Setting | When to use |
|---------|-------------|
| `baseUrl: ''` | Site served from Node (`npm start`) |
| `baseUrl: 'http://localhost:3001'` | Static site on port 8080 + API on 3001 |

## Deploy to production (Hostinger / Railway / Render)

1. Upload project files
2. Set environment variables in hosting panel
3. Run `npm install && npm start` in `server/`
4. Point domain to the Node app
5. Set `PUBLIC_URL` in `.env` to your domain
6. Set `js/cms-api-config.js` → `baseUrl: ''` if same domain

## Image hosting & performance

| Method | Best for | Auto-optimize |
|--------|----------|---------------|
| **CMS server upload** (`POST /api/upload`) | Admin panel when Node server is running | Cloudinary `f_auto,q_auto` if configured; else local `/uploads/` |
| **Cloudinary** (`server/.env` CLOUDINARY_*) | Production CDN, responsive images | Yes — `GPImages.optimize()` adds transforms |
| **WordPress CDN** (current default) | Legacy images on gppharmacycollege.com | Preconnect + lazy-load via `js/images.js` |

### Performance features (built-in)
- `js/images.js` — CDN preconnect, lazy images, hero slide prefetch, Cloudinary srcset
- Homepage hero — only first slide loads immediately; others prefetch on rotation
- `_headers` / `.htaccess` — long cache for CSS/JS, 30-day cache for images

### Enable Cloudinary (recommended for production)
1. Create account at https://cloudinary.com
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `server/.env`
3. Re-upload key images via Admin — URLs will use `f_auto,q_auto,w_*` transforms

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/content/public` | No | Published content for website |
| GET | `/api/content` | Yes | Full content for admin |
| PUT | `/api/content` | Yes | Save all content |
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/upload` | Yes | Upload image |

## Migrate existing content

1. Open admin (old browser-only mode)
2. Click **Export** → save JSON file
3. Start server, login to admin
4. Click **Import** → select JSON file
5. Content syncs to server for all visitors
