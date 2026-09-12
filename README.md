# ICON 2026 — DATATRON

Official techfest website for **K J Somaiya Institute of Management (KJSIM)**. Central hub for event discovery, registration, QR check-in, live streaming, and admin operations.

## Features

- Dark DATATRON-themed UI (CSS Modules + Framer Motion)
- Multi-event registration with QR pass + `.ics` calendar invite
- Confirmation email via **Resend** (optional Twilio SMS / WhatsApp)
- Volunteer QR check-in (`/checkin`) with PIN gate
- Admin dashboard: analytics, CSV export, broadcast, reminders
- Live stream page driven by `LIVE_STREAM` + `LIVE_SCHEDULE` in `src/lib/data.js`
- SEO: metadata, OG image, JSON-LD Event, `next-sitemap`

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router) + React 19 |
| Styling | Vanilla CSS Modules |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (`jose`) httpOnly cookie |
| Email | Resend |
| SMS/WhatsApp | Twilio (optional, env-flagged) |
| Charts | Recharts |
| QR | `qrcode` (server) + `qrcode.react` / `html5-qrcode` (client) |

> **Architecture note:** UI mutations primarily use **Server Actions**. REST routes under `src/app/api/*` are also implemented for plan compatibility and integrations (cron, external clients).

## Local setup

```bash
npm install
cp .env.example .env.local
# fill MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD, RESEND_API_KEY, etc.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Important env vars

See `.env.example` for the full list. Minimum for local demo:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `CHECKIN_PIN` (optional; falls back to admin password)
- `RESEND_API_KEY` + `EMAIL_FROM` (optional; falls back to console mock)
- `CRON_SECRET` (for `/api/cron/reminders`)
- `WHATSAPP_ENABLED` / `SMS_ENABLED` (default `false`)

**Never commit `.env` / `.env.local`.** Rotate secrets if they were ever committed.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build + sitemap |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Ops quick reference

| Task | How |
|------|-----|
| Admin | `/admin/login` → password from `ADMIN_PASSWORD` |
| Broadcast / reminders | `/admin/broadcast` |
| Check-in | `/checkin` → enter `CHECKIN_PIN` |
| Edit events / team / sponsors | `src/lib/data.js` then redeploy |
| Go live on stream | Set `LIVE_STREAM.isLive` + `youtubeVideoId` in `data.js` |
| Atlas + Vercel | Allow `0.0.0.0/0` (or Atlas–Vercel integration) |

## Deploy (Vercel)

1. Push to GitHub and import in Vercel  
2. Copy env vars from `.env.example`  
3. Ensure MongoDB Atlas network access allows Vercel  
4. `vercel.json` registers daily cron → `/api/cron/reminders`  

---

Built for KJSIM · ICON 2026 — DATATRON
