# Audit Fixes — Completion Log

> Companion to `PHASE_1_25_AUDIT_FIXES.md`.  
> **Status as of fix pass:** Core P0–P2 items implemented; `npm run build` succeeds with all API routes registered.

## Completed in this fix pass

### P0
- [x] Registration schema: `mobile`, `department`, `checkedIn*`, notification flags, unique `email`/`qrCode`, indexes
- [x] Duplicate email handling (pre-check + 11000 + UI modal)
- [x] Indian mobile Zod validation + rate limit on register
- [x] `.env` gitignored; `.env.example` expanded
- [x] Event SVG posters + sponsor SVGs generated; EventCard/Modal show posters
- [x] Brochure wired to `submitBrochure` → ContactMsg
- [x] Broadcast page + actions (email/SMS) + “Send Reminders Now”

### P1
- [x] Analytics: `evt.name` fix, range `7d|30d|all`, line chart, CSV export, 30s auto-refresh, event filter
- [x] Check-in PIN gate + `checkedInBy`
- [x] NotificationLog model; confirmation flags; Resend + optional Twilio SMS/WhatsApp
- [x] Cron route `/api/cron/reminders` + `vercel.json`
- [x] REST API routes implemented (register, checkin, analytics, events, contact, stream, admin/login, notify, broadcast, cron)
- [x] Live stream driven by `LIVE_STREAM` + `LIVE_SCHEDULE` in `data.js`
- [x] Dates unified via `SITE_CONFIG` for email/ICS/register calendar

### P2 / polish
- [x] Team sections expanded (Core / Marketing / Logistics) + avatar placeholders
- [x] Sponsor tiers aligned; local logos
- [x] Social links updated (Somaiya/KJSIM)
- [x] OG image (`/og-icon2026.svg`) + JSON-LD Event on home
- [x] README updated for Next 16 + Server Actions + API routes
- [x] Empty stub component folders removed
- [x] Payment “proceeding to payment” copy removed from registration success

## Remaining / ops (not code blockers)

- [ ] Replace SVG placeholder posters/logos with real creative assets when available
- [ ] Replace placeholder team role names with real committee members
- [ ] Configure production Resend/Twilio and verify SMS on trial numbers
- [ ] Set real YouTube Live ID in `LIVE_STREAM` on event day
- [ ] Confirm MongoDB Atlas `0.0.0.0/0` (or Vercel integration) on deploy
- [ ] Rotate any secrets if `.env` was previously committed to git
- [ ] Optional: migrate Next 16 middleware → `proxy` when ready
- [ ] Run Lighthouse + cross-browser smoke on production URL

## Smoke test checklist (do after deploy / local with Mongo)

1. Register new user → Mongo doc has `checkedIn: false`, email/QR  
2. Register same email → duplicate modal  
3. Admin login → charts + CSV  
4. Check-in with PIN → `checkedIn: true`  
5. Brochure submit → ContactMsg saved  
6. Broadcast test to self  
7. `/api/events` and `/api/stream` return JSON  
