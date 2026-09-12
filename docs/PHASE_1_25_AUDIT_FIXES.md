# ICON 2026 — Post–Phase 25 Audit Report

> **Date:** 12 Sep 2026  
> **Scope:** Full audit of Phases 01–25 against `docs/MASTER_PLAN.md` and the implemented codebase  
> **Build check:** `npm run build` **succeeds** (Next.js 16.3.5 + next-sitemap)  
> **Verdict:** Core public site and several backend flows exist, but the project is **not fully complete** vs the master plan. Multiple critical gaps remain before production/demo readiness.

---

## Executive summary

| Area | Status | Notes |
|------|--------|--------|
| Public pages & UI shell | ✅ Mostly done | Home + all main routes render; design system in place |
| Registration + QR UI | ⚠️ Partial | Works end-to-end in UI, but schema/validation/dupe logic incomplete |
| Admin auth + dashboard | ⚠️ Partial | Login/JWT works; analytics incomplete; extras unfinished |
| QR check-in | 🔴 Broken / fragile | Schema lacks `checkedIn` fields; check-in likely will not persist correctly |
| Notifications | ⚠️ Partial | Email via Resend OK; SMS/WhatsApp/broadcast/cron missing |
| Live stream | ⚠️ Partial | UI works with mock Lofi/placeholder data |
| Deploy / ops / SEO polish | ⚠️ Partial | README + sitemap exist; `vercel.json`/cron missing; OG placeholder |
| Master-plan API routes | 🔴 Missing | Empty `src/app/api/*` folders; logic lives in Server Actions instead |

**Overall completion estimate vs master plan: ~65–75%.**

---

## How this audit was run

1. Compared repo structure to Phase 01–25 checklist  
2. Inspected models, actions, middleware, notifications, admin, check-in, data  
3. Verified assets under `public/images`  
4. Ran production `npm run build`  
5. Did **not** run live MongoDB/email/Twilio integration tests in this pass  

---

## Phase-by-phase scorecard

| Phase | Title | Score | Verdict |
|------:|-------|:-----:|---------|
| 01 | Foundation & repository | 🟡 | Done with stack drift (Next 16 vs planned 14); empty API stubs; `.env` risk |
| 02 | Design system | 🟢 | Tokens, fonts, globals look solid |
| 03 | App shell & layout | 🟢 | Layout, metadata, 404, error page exist |
| 04 | Static data & content | 🟡 | Data model present; missing posters/sponsors assets; thin team; placeholder socials |
| 05 | Nav & footer | 🟢 | Nav links correct (no Arcades); ScrollToTop present |
| 06 | Loading & transitions | 🟢 | LoadingScreen + PageTransition + toasts |
| 07 | Hero & countdown | 🟢 | Present with particles |
| 08 | About & stats | 🟢 | About + StatsBar |
| 09 | Event schedule (home) | 🟡 | Tabs/cards/modal work; **posters not shown**; no poster assets |
| 10 | Home remainder | 🟡 | Gallery/location/sponsors/contact OK; **brochure is fake** |
| 11 | `/events` | 🟢 | Listing page exists |
| 12 | `/sponsors` | 🟡 | Page exists; logos are placehold.co; tiers mismatch |
| 13 | `/hackathon` | 🟢 | Page exists |
| 14 | `/gallery` | 🟢 | Page + webp assets exist |
| 15 | `/team` | 🟡 | Only 4 members; many planned sections empty; LinkedIn `#` |
| 16 | DB & models | 🔴 | Registration schema incomplete vs plan; no NotificationLog; no indexes |
| 17 | Core APIs | 🔴 | **No `route.js` files**; Server Actions used instead; no rate limit; weak validation |
| 18 | Registration UI | 🟡 | Good UX; missing department; weak phone rules; no dupe email UX |
| 19 | Admin auth | 🟢 | JWT httpOnly cookie + middleware + login/logout |
| 20 | QR check-in | 🔴 | Scanner UI exists; **schema gap breaks persistence**; `/checkin` unprotected |
| 21 | Analytics & admin | 🟡 | Basic charts/table; no range filter, CSV, 30s auto-refresh, skeletons |
| 22 | Notifications & broadcast | 🔴 | Email only; broadcast is placeholder; no SMS/WhatsApp/cron/logs |
| 23 | Live streaming | 🟡 | UI OK; mock schedule; not wired to `LIVE_SCHEDULE` / real stream |
| 24 | Polish / a11y / SEO | 🟡 | Reduced motion + sitemap OK; OG placeholder; no JSON-LD; Lighthouse not verified |
| 25 | Deploy / docs / sign-off | 🟡 | README/ops notes good; no `vercel.json`; env template incomplete; sign-off not met |

Legend: 🟢 largely complete · 🟡 partial · 🔴 missing/broken

---

## P0 — Critical fixes (do first)

### 1. Registration schema incomplete — check-in will fail or silently not persist
**Evidence:** `src/models/Registration.js` has no `checkedIn`, `checkedInAt`, `checkedInBy`, notification flags, or unique indexes.  
`checkinUser.js` sets `registration.checkedIn = true` — under Mongoose strict mode these paths are **stripped** and not saved.

**Fix:**
- [ ] Add to Registration schema: `checkedIn` (Boolean, default false), `checkedInAt`, `checkedInBy`, `confirmationSent`, `reminderSent`, `whatsappSent`
- [ ] Add unique index on `email` and `qrCode`
- [ ] Index `mobile`/`phone`, `checkedIn`, `createdAt`
- [ ] Align field name: plan uses `mobile`; code uses `phone` — pick one and update form + schema + admin table

### 2. No duplicate-email prevention
**Evidence:** `registerUser.js` never checks existing email; schema has no `unique: true`.

**Fix:**
- [ ] Pre-check `Registration.findOne({ email })` → return friendly “already registered”
- [ ] Handle Mongo duplicate key error (11000)
- [ ] Success/error UX for duplicate on `/register`

### 3. Event poster & sponsor assets missing
**Evidence:** `public/images/events/` and `public/images/sponsors/` are **empty**. Data references `/images/events/*.png`. Sponsors use `placehold.co` URLs.

**Fix:**
- [ ] Add optimized event posters (≤800px, WebP/PNG) for every event in `data.js`
- [ ] Add real sponsor logos under `public/images/sponsors/`
- [ ] Update `SPONSORS[].logo` to local paths
- [ ] Show posters on EventCard / EventModal with `next/image` + `sizes`

### 4. `.env` is not gitignored
**Evidence:** `.gitignore` ignores `.env.local` etc. but **not** `.env`. Repo has a root `.env`.

**Fix:**
- [ ] Add `.env` to `.gitignore`
- [ ] Rotate any secrets that may have been committed
- [ ] Keep only `.env.example` in git; use `.env.local` locally

### 5. Broadcast notifications not built
**Evidence:** `src/app/admin/broadcast/page.js` is still a **placeholder** (“being built in Phase 23”).

**Fix:**
- [ ] Build broadcast UI (channels, subject, message, target event/all)
- [ ] Implement send action (email at minimum)
- [ ] Log results; protect with admin auth

### 6. Brochure form is fake
**Evidence:** `Brochure.js` uses `setTimeout` and always toasts success — no API/DB.

**Fix:**
- [ ] Wire to contact action or dedicated brochure endpoint
- [ ] Persist email / send brochure email
- [ ] Real error handling

---

## P1 — High priority (correctness / master-plan gaps)

### 7. Empty API route folders (architecture drift)
**Evidence:** `src/app/api/{register,checkin,analytics,contact,events,notify,stream,admin}/` exist as **empty directories** — no `route.js`. Logic is in Server Actions.

**Options (pick one and document):**
- [ ] **A (recommended for plan compliance):** Implement REST `route.js` endpoints and call them from the client, **or**
- [ ] **B:** Keep Server Actions as the official architecture; delete empty API folders; update MASTER_PLAN / README / Final Sign-Off to match

Either way, empty folders must not remain as “fake completeness.”

### 8. Analytics chart label bug
**Evidence:** `adminData.js` maps `evt.title` but events use `evt.name` → charts show slugs/raw IDs.

**Fix:**
- [ ] Change map to `evt.name` (or rename data field consistently)

### 9. Date inconsistency (Feb vs March)
**Evidence:** `SITE_CONFIG.eventDates` / countdown = **2026-02-13/14**.  
`notifications.js` hardcodes **March 15–16, 2026** for ICS/email.

**Fix:**
- [ ] Single source of truth from `SITE_CONFIG` for countdown, ICS, emails, live copy
- [ ] Confirm real fest dates with organizers

### 10. Weak registration validation
**Evidence:** Phone is `min(10)` only — not Indian `^[6-9]\d{9}$`. No department field. No rate limiting.

**Fix:**
- [ ] Zod Indian mobile regex
- [ ] Optional `department` field
- [ ] Rate limit registrations (IP-based middleware or action throttle)

### 11. Admin dashboard gaps vs Phase 21
**Missing:**
- [ ] Time range filter (`7d` / `30d` / `all`)
- [ ] Registrations-over-time line chart
- [ ] Check-in timeline
- [ ] Auto-refresh every 30s
- [ ] Skeleton/shimmer loading states
- [ ] CSV export
- [ ] Filter table by event

**Also:** Admin includes `AdminImageCropper` / `AdminImageTuner` (out of plan). Fine as extras, but should not replace missing analytics features.

### 12. Check-in page unprotected
**Evidence:** `/checkin` is public; anyone with the URL can mark attendance.

**Fix:**
- [ ] Volunteer PIN / shared secret / admin session
- [ ] Optional `checkedInBy` capture

### 13. Notification stack incomplete (Phase 22)
**Present:** Resend email + server QR PNG + ICS attach + graceful fallback.  
**Missing:**
- [ ] Twilio/MSG91 SMS
- [ ] WhatsApp (`WHATSAPP_ENABLED` flag)
- [ ] `NotificationLog` model
- [ ] Flip `confirmationSent` after send
- [ ] Reminder templates (7d / 3d / 1d / morning)
- [ ] `GET /api/cron/reminders` + `vercel.json` cron + `CRON_SECRET`
- [ ] Manual “Send Reminders Now” in admin
- [ ] Wire confirmation flags on Registration

### 14. Live stream still mock
**Evidence:** `liveStream.js` uses hardcoded mock + Lofi Girl YouTube ID; ignores `LIVE_SCHEDULE` in `data.js`.

**Fix:**
- [ ] Drive schedule from `LIVE_SCHEDULE` / shared config
- [ ] Document how to set real `youtubeVideoId` + `isLive`
- [ ] Remove artificial 500ms delay in production path

### 15. `.env.example` incomplete
**Missing vs plan:** `TWILIO_*`, `WHATSAPP_ENABLED`, `CRON_SECRET`, SMTP (if used), clearer JWT length note already present.

**Fix:**
- [ ] Expand `.env.example` to all production keys
- [ ] Document which channels are optional

---

## P2 — Medium priority (quality / content)

### 16. Event cards omit posters
**Evidence:** `EventCard.js` never renders `posterImage`.

**Fix:**
- [ ] Add poster thumbnail with `next/image`
- [ ] Fallback placeholder when missing

### 17. Team content incomplete
**Evidence:** Only Faculty (1), Organizing (2), Dev (1). Missing Core Committee, Marketing & PR, Logistics; LinkedIn/Instagram often `#`.

**Fix:**
- [ ] Fill all planned team sections
- [ ] Real social URLs or omit icons
- [ ] Initials avatar fallback utility (planned) if photo missing

### 18. Sponsor tier mismatch
**Evidence:** `SPONSOR_TIERS` list ≠ actual `SPONSORS[].tier` values (`Beverage Partner` vs `Hydration Partner`, etc.).

**Fix:**
- [ ] Align tier strings so `/sponsors` grouping works

### 19. Social links are placeholders
**Evidence:** `SITE_CONFIG.socials` → generic facebook/instagram/linkedin.com.

**Fix:**
- [ ] Replace with real ICON / KJSIM accounts

### 20. SEO / OG polish incomplete
**Evidence:** OG/Twitter images use `placehold.co`. No JSON-LD Event schema found.

**Fix:**
- [ ] Add real OG image under `public/`
- [ ] Add JSON-LD `Event` on home or events
- [ ] Verify sitemap URLs use production domain (`NEXT_PUBLIC_APP_URL`)

### 21. Empty component stub folders
**Evidence:** Empty dirs: `components/Analytics`, `Gallery`, `LiveStream`, `QRScanner`, `RegistrationForm`, `TeamSection`.

**Fix:**
- [ ] Remove empty folders **or** move page-local logic into these shared components as planned

### 22. README / stack documentation drift
**Evidence:** README says “Next.js 14”; `package.json` has **Next 16.3.5** + React 19. Build warns middleware convention deprecated.

**Fix:**
- [ ] Update README to actual versions
- [ ] Note Server Actions vs API routes decision
- [ ] Track Next 16 middleware → proxy migration when ready

### 23. `paymentStatus` without payment flow
**Evidence:** Schema/default `paymentStatus: 'pending'`; success message says “Proceeding to payment…” but no payment integration.

**Fix:**
- [ ] Remove payment wording until Razorpay/etc. exists, **or**
- [ ] Implement payment and only then issue QR / confirmation email

### 24. No `vercel.json`
**Evidence:** Missing cron config and any deploy headers.

**Fix:**
- [ ] Add `vercel.json` with reminders cron when Phase 22 cron is implemented
- [ ] Confirm Atlas `0.0.0.0/0` in ops checklist before go-live

---

## P3 — Enhancements & polish

- [ ] Auto-refresh admin dashboard every 30s with subtle indicator  
- [ ] Skeleton states for charts/table  
- [ ] Event filter on registrations table  
- [ ] Protect check-in with volunteer auth  
- [ ] Confetti/`prefers-reduced-motion` already partly handled — audit all motion sites  
- [ ] Favicon: confirm real ICON favicon (not default Next assets only)  
- [ ] Remove default Next SVG leftovers in `public/` (`next.svg`, `vercel.svg`, etc.) if unused  
- [ ] Add Lighthouse run results to docs (target ≥90)  
- [ ] Cross-browser smoke checklist (Chrome/Firefox/Edge/Safari)  
- [ ] Demo script + backup screenshots (Phase 25.5)  
- [ ] Initials avatar generator for team photos  
- [ ] Brochure PDF asset if promising “send brochure”  
- [ ] Consider MSG91 for Indian SMS if Twilio trial is too limited  

---

## Bugs & risks list (quick reference)

| # | Severity | Issue |
|---|----------|--------|
| 1 | 🔴 Critical | `checkedIn*` not in schema → check-in persistence broken |
| 2 | 🔴 Critical | No unique email / duplicate handling |
| 3 | 🔴 Critical | Empty event poster & sponsor logo folders |
| 4 | 🔴 Critical | `.env` not gitignored → secret leak risk |
| 5 | 🔴 Critical | Broadcast page still placeholder |
| 6 | 🟠 High | Brochure fakes success with setTimeout |
| 7 | 🟠 High | Analytics uses `evt.title` instead of `evt.name` |
| 8 | 🟠 High | Email/ICS dates (March) ≠ site config (February) |
| 9 | 🟠 High | Empty API folders; plan vs implementation mismatch |
| 10 | 🟠 High | No SMS/WhatsApp/cron/NotificationLog |
| 11 | 🟠 High | `/checkin` publicly writable |
| 12 | 🟡 Medium | Weak phone validation; no department |
| 13 | 🟡 Medium | No CSV export / time-range analytics |
| 14 | 🟡 Medium | Live stream mock YouTube + unused `LIVE_SCHEDULE` |
| 15 | 🟡 Medium | Placeholder socials + OG image |
| 16 | 🟡 Medium | Team roster incomplete; `#` social links |
| 17 | 🟡 Medium | Sponsor tier labels inconsistent |
| 18 | 🟡 Medium | Payment copy without payment system |
| 19 | 🟢 Low | README version drift; Next middleware deprecation warning |
| 20 | 🟢 Low | Empty unused component directories |

---

## What is actually in good shape

These areas are solid enough to keep and build on:

- App Router pages for home, events, register, team, sponsors, hackathon, gallery, live, check-in, admin, admin login  
- Design system (`globals.css`), fonts, glass/dark DATATRON look  
- Navbar / Footer / ScrollToTop / LoadingScreen / PageTransition / ScrollReveal  
- Home composition order matches plan (including ContactForm)  
- Admin JWT login with httpOnly cookie + middleware protection for `/admin`  
- Registration UI with confetti, QR display (`qrcode.react`), `.ics` download (`lib/ics.js`)  
- Server-side QR for email (`qrcode.toDataURL`) via Resend  
- Contact form wired to `submitContact` + `ContactMsg` model  
- Gallery assets present (webp)  
- `next-sitemap` generates sitemap/robots on build  
- Production build compiles successfully  

---

## Recommended fix order (execution checklist)

Use this as the next work queue:

### Sprint A — Make core flows correct
1. Fix Registration schema + indexes + duplicate email  
2. Align phone/mobile naming + Indian mobile Zod  
3. Fix date single-source (`SITE_CONFIG`)  
4. Gitignore `.env` + rotate secrets if needed  
5. Fix analytics `name` mapping  
6. Smoke-test: register → email → check-in → admin counts  

### Sprint B — Content & visuals
7. Add event posters + show on cards/modals  
8. Add sponsor logos + fix tiers  
9. Expand team data + real social links  
10. Real OG image; remove placehold.co  

### Sprint C — Complete planned add-ons
11. Decide API routes vs Server Actions; clean folders  
12. Build broadcast UI + send  
13. Wire brochure for real  
14. CSV export + analytics range + auto-refresh  
15. Protect `/checkin`  
16. Optional: SMS/WhatsApp + cron reminders + NotificationLog  

### Sprint D — Ship gate
17. Expand `.env.example` + `vercel.json`  
18. Update README to Next 16 / actual architecture  
19. Lighthouse + mobile/desktop pass  
20. Final Sign-Off checklist in MASTER_PLAN  

---

## Final Sign-Off (current truth)

Do **not** mark Phase 25 complete until these are checked:

### Pages
- [x] `/` home sections present  
- [x] `/events` `/register` `/team` `/sponsors` `/hackathon` `/gallery` `/live` `/checkin` `/admin` `/admin/login`  
- [ ] `/admin/broadcast` **functional** (not placeholder)  
- [x] Custom 404 / error  

### Backend / data
- [ ] Registration schema matches check-in + notifications needs  
- [ ] Duplicate email blocked  
- [ ] Indexes in place  
- [ ] Brochure persists / sends  
- [ ] API strategy documented or routes implemented  

### Add-ons
- [x] Team page (thin content)  
- [x] Live page (mock data)  
- [ ] Analytics complete (range/CSV/auto-refresh)  
- [ ] QR check-in **verified against DB** after schema fix  
- [ ] Notifications beyond email (or explicitly scoped out + documented)  
- [ ] Broadcast working  

### Quality / deploy
- [x] `npm run build` succeeds  
- [ ] `.env` secured  
- [ ] Real assets for events/sponsors  
- [ ] Dates consistent  
- [ ] README accurate  
- [ ] Production env + Atlas network verified  
- [ ] Demo script ready  

---

## Document control

| Item | Detail |
|------|--------|
| **File** | `docs/PHASE_1_25_AUDIT_FIXES.md` |
| **Purpose** | Single backlog of required fixes/improvements after claimed Phase 25 completion |
| **Next step** | Work Sprint A → D above; re-audit after Sprint A before demo |

---

*End of audit — treat P0 items as blockers for any live registration or event-day check-in.*
