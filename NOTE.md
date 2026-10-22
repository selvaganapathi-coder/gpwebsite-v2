# Setup & run (quick note)

## What you need
- Node.js 20+ (npm included)
- Two terminals

## First time only
```powershell
cd "D:\gp website"
npm install
npm install --prefix server
npm install --prefix web
copy server\.env.example server\.env
copy web\.env.example web\.env.local
```

## Run every time
**Terminal 1 — CMS API**
```powershell
npm run dev:cms
```
→ http://localhost:3001  
→ Health: http://localhost:3001/api/health  

**Terminal 2 — Website + Admin**
```powershell
npm run dev:web
```
→ Site: http://127.0.0.1:5173/  
→ Admin: http://127.0.0.1:5173/admin  

## Admin
Sign in with the seeded admin email/password from your CMS data.  
If login fails, make sure Terminal 1 is running and `/api/health` returns OK.

## Stop
`Ctrl+C` in each terminal.
