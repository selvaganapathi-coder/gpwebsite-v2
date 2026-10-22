# G.P. Pharmacy College — React app (`web/`)

Vite + React + React Router port of the public site. Runs **in parallel** with the existing static HTML site and CMS API on port **3001**. Existing HTML is not deleted.

## Setup

```bash
cd web
npm install
```

## Run (dev)

1. Start the CMS / static server (from repo root):

```bash
cd server
npm start
```

Serves the HTML site and `GET /api/content/public` at **http://localhost:3001**.

2. In another terminal, start the React app:

```bash
cd web
npm run dev
```

Open **http://localhost:5173** (Vite default).

`predev` regenerates `src/styles/bundle.css` from the parent `css/` folder before Vite starts.

## How CMS content is loaded

- Vite proxies `/api`, `/uploads`, and `/images` to `http://localhost:3001` (see `vite.config.js`).
- On load, the app fetches `GET /api/content/public` and applies homepage fields (badge, titles, slides, about, campus, programs, people, outcomes, recruiters, approvals, campus tour, announcement, notices/events) similar to `js/cms-bridge.js`.
- If the API is offline, built-in defaults / seed notices are used so the homepage still renders.

## Talk to Admin model

WhatsApp prefill: `Hi, I want admission info — Code 889.`  
No online apply wizard — Call / WhatsApp / enquiry CTAs only.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Bundle CSS + Vite dev server (port 5173) |
| `npm run build` | Bundle CSS + production build → `dist/` |
| `npm run css:bundle` | Rebuild `src/styles/bundle.css` only |
| `npm run preview` | Preview production build |

## What’s in this first pass

- Shared chrome: announcement, header/nav, footer, mobile dock
- Homepage sections ported from `index.html`
- Stub routes for About / Admissions / Contact (and other nav targets)

## Still on HTML (:3001)

Full page content for About, Admissions, Courses, Campus, Placements, Faculty, Contact form, Admin CMS UI, etc. Use “Open HTML version” on stub pages, or browse `http://localhost:3001/…`.
