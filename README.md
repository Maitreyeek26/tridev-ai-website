# TriDev.Ai Website (Frontend + Backend)

## Run in VS Code
1. Install Node.js (nodejs.org), open this folder in VS Code.
2. Terminal: `npm install` then `npm start`
3. Open http://localhost:3000

## Your logo
Put your transparent PNG at `public/assets/logo.png` (it replaces the placeholder automatically).
Rename "TriDev.Ai" in `public/index.html` to your company name.

## Messages
Contact form entries save to `data/inquiries.json`.
View via GET /api/inquiries with header `x-admin-key: <ADMIN_KEY>` (set env var ADMIN_KEY, default "change-me").
