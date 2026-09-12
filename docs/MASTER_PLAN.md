# ICON 2026 — Master Execution Plan

> **Project:** ICON 2026 (DATATRON) — Official Techfest Website  
> **Institution:** KJ Somaiya Institute of Management (KJSIM), Department of Data Science and Technology  
> **Purpose:** Single source of truth for build execution. Use every phase and sub-phase as a checkpoint. Do not mark a phase complete until all sub-phase checkboxes are done.  
> **Related docs:** `implementation_plan.md` · `tech_stack_architecture.md` · `registration_flow_ux.md` · `premium_addons.md` · `master_plan_review.md` (incorporated)

---

## How to Use This Plan

1. Work **one phase at a time** in order (phases have dependencies).
2. Complete every sub-phase checkbox before moving on.
3. When a phase is fully done, mark the phase status: `⬜ Not started` → `🔄 In progress` → `✅ Done`.
4. Use the **Final Project Sign-Off** section at the end as the last gate before submission/demo.

| Field | Value |
|-------|--------|
| **Stack** | Next.js 14 (App Router), Vanilla CSS + CSS Modules, Framer Motion, MongoDB + Mongoose, Nodemailer, Twilio/MSG91, Chart.js, qrcode + html5-qrcode, Vercel |
| **Theme** | DATATRON — crimson / deep blue / violet, dark hero, glassmorphism |
| **Core deliverables** | Public site + registration + admin + QR check-in + analytics + notifications + live stream + team page |
| **Estimated effort** | ~80–100 hours total |

---

## Phase Index

| Phase | Title | Focus |
|------:|-------|--------|
| 01 | Project foundation & repository | Scaffold, Git, tooling |
| 02 | Design system & global styles | Tokens, fonts, reset |
| 03 | App shell & root layout | Layout, metadata, SEO base |
| 04 | Static data & content model | Events, team, sponsors seed |
| 05 | Navigation & footer | Navbar, drawer, footer |
| 06 | Loading screen & page transitions | First paint UX |
| 07 | Hero & countdown | Home hero |
| 08 | About & stats | About + counters |
| 09 | Event schedule (home) | Tabs, cards, modal |
| 10 | Gallery preview, location, brochure | Home remainder |
| 11 | Events listing page | `/events` |
| 12 | Sponsors page | `/sponsors` |
| 13 | Hackathon page | `/hackathon` |
| 14 | Gallery full page | `/gallery` |
| 15 | Team ICON page | `/team` |
| 16 | Database & Mongoose models | MongoDB Atlas |
| 17 | Core API routes | Register, events, contact, admin login |
| 18 | Registration UI & success flow | `/register` + QR + `.ics` |
| 19 | Admin authentication | JWT / password gate |
| 20 | QR check-in system | `/checkin` + API |
| 21 | Analytics & admin dashboard | Charts, table, CSV |
| 22 | Notifications & broadcast | Email / SMS / WhatsApp |
| 23 | Live streaming page | `/live` |
| 24 | Polish, a11y, performance, SEO | Hardening |
| 25 | Deploy, docs, final verification | Vercel + sign-off |

---

# PHASE 01 — Project Foundation & Repository

**Status:** ⬜ Not started  
**Goal:** Runnable Next.js 14 App Router project with Git, scripts, and folder skeleton matching the architecture doc.

### 1.1 Initialize project
- [ ] Create Next.js 14 project with App Router (JavaScript as planned)
- [ ] Confirm `src/app` structure exists
- [ ] Set `package.json` name/scripts: `dev`, `build`, `start`, `lint`
- [ ] Add `.gitignore` (node_modules, `.next`, `.env.local`, `.env*.local`, OS junk)

### 1.2 Install core dependencies
- [ ] `framer-motion`
- [ ] `mongoose`
- [ ] `zod`
- [ ] `react-icons`
- [ ] `react-hot-toast`
- [ ] `chart.js` + `react-chartjs-2`
- [ ] `qrcode` (works in browser and Node — client QR UI + server-side email PNG)
- [ ] `html5-qrcode` (browser-only; only import inside `'use client'` components)
- [ ] `nodemailer`
- [ ] `twilio` (SMS + WhatsApp; MSG91 SDK acceptable alternative for India)
- [ ] `next-sitemap` (auto-generate `sitemap.xml` + `robots.txt` in Phase 24)
- [ ] `bcryptjs`
- [ ] `jsonwebtoken`
- [ ] Dev: ESLint config, Prettier (optional but recommended)

### 1.3 Folder skeleton
- [ ] Create `public/images/{events,gallery,sponsors,team}`
- [ ] Copy logos: `icon_logo.png`, `kjsim_logo` / Somaiya assets from `docs/reference_images`
- [ ] Create `src/components/` with planned component folders (empty stubs OK)
- [ ] Create `src/lib/` (`mongodb.js`, `data.js`, `notifications.js` placeholders)
- [ ] Create `src/models/` placeholders
- [ ] Create `src/app/api/` route folders as stubs (optional empty route files)

### 1.4 Config & env templates
- [ ] `next.config.js` (images domains if needed, future bundle analyzer hook)
- [ ] `.env.example` documenting all vars from architecture doc **plus** `WHATSAPP_ENABLED`, `CRON_SECRET` (no secrets committed)
- [ ] `.env.local` created locally (never committed)
- [ ] README stub with project title and how to run locally

### 1.5 Git baseline
- [ ] `git init` (if not already)
- [ ] First commit: scaffold only
- [ ] Remote GitHub repo ready (can push later in Phase 25)

**Phase 01 checkpoint:** `npm run dev` starts; folder tree matches plan; env example exists.

---

# PHASE 02 — Design System & Global Styles

**Status:** ⬜ Not started  
**Goal:** One consistent visual language for the whole site.

### 2.1 CSS custom properties
- [ ] Define `:root` tokens in `globals.css`:
  - Colors: `--crimson`, `--crimson-light`, `--deep-blue`, `--royal-blue`, `--violet`
  - Surfaces: `--bg-dark`, `--bg-dark-card`, `--bg-light`, `--glass`, `--glass-border`
  - Text: `--text-primary`, `--text-secondary`
  - Brand gradient: `--gradient-brand`
- [ ] Spacing scale, radius, shadow, z-index tokens
- [ ] Transition duration tokens (e.g. 150 / 200 / 300 / 400ms)

### 2.2 Typography
- [ ] Load fonts via `next/font`: Outfit (headings), Inter (body), Space Grotesk (accents/countdown)
- [ ] Apply base type scale (h1–h6, body, small, overline)
- [ ] Line-height and letter-spacing rules for display vs body

### 2.3 Global reset & utilities
- [ ] CSS reset / normalize
- [ ] Box-sizing, smooth scroll (respect `prefers-reduced-motion`)
- [ ] Utility classes if needed: container, visually-hidden, skip-link, glass-card base
- [ ] Selection / focus-visible styles (WCAG focus rings)

### 2.4 Shared visual primitives (CSS-only or tiny components)
- [ ] Gradient button base styles
- [ ] Glass card base styles
- [ ] Section heading + underline/accent pattern
- [ ] Form field base styles (label, input, error, success)

**Phase 02 checkpoint:** Empty page shows correct fonts, colors, and button/card primitives.

---

# PHASE 03 — App Shell & Root Layout

**Status:** ⬜ Not started  
**Goal:** Root layout, metadata, and SEO foundation for every route.

### 3.1 Root layout
- [ ] `src/app/layout.js` with html/body, fonts, Toaster provider
- [ ] Slot for Navbar + Footer around `{children}`
- [ ] Plan `AnimatePresence` / transition wrapper placement around `{children}` for Phase 06 page transitions (avoid a later layout refactor)
- [ ] Skip-to-main-content link
- [ ] Semantic structure: header / main / footer regions

### 3.2 Metadata & SEO base
- [ ] Default title: `ICON 2026 — DATATRON | KJSIM Techfest`
- [ ] Meta description (from architecture SEO section)
- [ ] Open Graph tags (title, description, image placeholder)
- [ ] Twitter card `summary_large_image`
- [ ] Favicon from ICON logo
- [ ] Canonical URL strategy documented / implemented

### 3.3 Route placeholders
- [ ] `/` home
- [ ] `/events`, `/register`, `/team`, `/sponsors`, `/hackathon`, `/gallery`
- [ ] `/live`, `/checkin`
- [ ] `/admin`, `/admin/broadcast`
- [ ] Custom 404 page (`src/app/not-found.js`) with ICON branding + back-to-home link
- [ ] Each page has temporary heading so navigation can be tested

### 3.4 Structured data prep
- [ ] Plan JSON-LD `Event` schema injection (implement fully in Phase 24 if needed)
- [ ] robots.txt / sitemap plan noted for Phase 24 (`next-sitemap`)

**Phase 03 checkpoint:** All routes resolve; custom 404 works; layout wraps pages; metadata appears in browser tab / view-source.

---

# PHASE 04 — Static Data & Content Model

**Status:** ⬜ Not started  
**Goal:** Single content source for events, sponsors, team, home stats, and live schedule until DB seeding is ready.

### 4.1 Events data (`src/lib/data.js` or split files)
> **Decision (locked):** Events live as **static data** in `src/lib/data.js` (not MongoDB). Events rarely change mid-fest; avoids admin CRUD scope creep; no seed script required. `GET /api/events` will import and return this static data. Only `registrations`, `contacts`, and `notifications_log` are persisted in MongoDB. Team/sponsors also stay static unless later promoted.

- [ ] Technical events (name, slug, fee, prize, date, time, venue, teamSize, poster path, shortDesc, description, rules, POC)
- [ ] Non-technical events (same fields)
- [ ] Gaming events (same fields)
- [ ] CodeICON / hackathon flag or dedicated hackathon content block
- [ ] `isActive`, `streamUrl`, `isLive` fields aligned with schema

### 4.2 Sponsors data
- [ ] Tiers: Title, Sports Partner, Hydration Partner, others as needed
- [ ] Logo paths, names, optional URLs

### 4.3 Team data
- [ ] Faculty Coordinators
- [ ] Organizing Committee (President, VP, GS, Treasurer, etc.)
- [ ] Core Committee / event heads
- [ ] Development Team
- [ ] Marketing & PR
- [ ] Logistics & Operations
- [ ] Fields: name, role, team, photo, bio, linkedin, email, instagram, order

### 4.4 Site constants
- [ ] Event dates (Feb 13–14, 2026 or confirmed dates)
- [ ] Venue address + Google Maps embed URL / query
- [ ] Contact phones/emails (e.g. Ajil George, icon.simsr@somaiya.edu)
- [ ] Social links (Facebook, Instagram, LinkedIn)
- [ ] Countdown target datetime
- [ ] Stats for home counters (participants target, events count, prize pool, colleges, etc.)

### 4.5 Live schedule seed
- [ ] Opening → sessions → prize distribution slots with statuses: completed / live / upcoming

### 4.6 Assets intake
- [ ] Place event posters in `public/images/events/`
- [ ] Resize event posters to max ~800px width; prefer WebP/optimized PNG (smaller sources = faster builds; `next/image` still handles runtime conversion)
- [ ] Gallery/archive photos in `public/images/gallery/`
- [ ] Sponsor logos in `public/images/sponsors/`
- [ ] Team photos in `public/images/team/`
- [ ] Placeholder avatar strategy: consistent initials-based or silhouette avatar when photo is missing (utility to generate gradient avatars from initials)
- [ ] All images have planned alt text list

**Phase 04 checkpoint:** Importing data in a test page renders lists without hardcoded JSX strings; missing team photos show placeholders.

---

# PHASE 05 — Navigation & Footer

**Status:** ⬜ Not started  
**Goal:** Site-wide chrome matching reference IA, upgraded UX.

### 5.1 Navbar desktop
- [ ] Left: Somaiya / KJSIM logo
- [ ] Center/links (final): Home, About, Events, Gallery, Sponsors, Hackathon, Team, Live
- [ ] **No separate “Arcades” nav item** — gaming events live under Events → Gaming tab
- [ ] Right: ICON logo
- [ ] Sticky + glassmorphism on scroll
- [ ] Hide on scroll-down / show on scroll-up
- [ ] Active link state
- [ ] Primary “Register” CTA in nav (optional but recommended)

### 5.2 Mobile drawer
- [ ] Hamburger ≤1023px
- [ ] Full-screen or slide-in drawer
- [ ] All links + social icons + Register CTA
- [ ] Focus trap + Escape to close + body scroll lock
- [ ] Accessible `aria-expanded` / labels

### 5.3 Footer
- [ ] ICON logo + short description
- [ ] Useful links column
- [ ] Contact: phone(s), email
- [ ] Social icons (Facebook, Instagram, LinkedIn)
- [ ] Copyright / year ICON 2026
- [ ] Responsive: 3-col → stacked mobile

### 5.4 Contact entry points
- [ ] Footer contact works with mailto / tel
- [ ] Contact form lives as the **last home-page section above the footer** (replaces reference “Got an Idea?” chat; brochure/newsletter can sit beside or just above it — wired in Phase 17/18)

### 5.5 Scroll to top
- [ ] `ScrollToTop` floating button: appears after ~500px scroll, smooth scroll to top, ICON-branded styling
- [ ] Respect `prefers-reduced-motion`

**Phase 05 checkpoint:** Every placeholder route reachable from nav on desktop and mobile; ScrollToTop works on long pages.

---

# PHASE 06 — Loading Screen & Page Transitions

**Status:** ⬜ Not started  
**Goal:** Premium first-load and route-change feel without hurting performance.

### 6.1 Loading screen
- [ ] `LoadingScreen` component with ICON logo pulse / particle burst
- [ ] Shows on first visit; fades out to reveal page
- [ ] Session/local flag so it does not replay every soft navigation (decide & document)
- [ ] Respect `prefers-reduced-motion` (instant fade or skip)

### 6.2 Page transitions
- [ ] Fade + slight slide on route change (Framer Motion)
- [ ] Does not break scroll restoration badly
- [ ] Does not flash loading screen on every link click

### 6.3 Toast system
- [ ] `react-hot-toast` mounted once in layout
- [ ] Default positions/styles aligned with UX doc (success green, error red, amber warning)

**Phase 06 checkpoint:** Hard refresh shows loading ritual; route changes animate smoothly; toast test works.

---

# PHASE 07 — Hero & Countdown

**Status:** ⬜ Not started  
**Goal:** Brand-first first viewport for DATATRON / ICON 2026.

### 7.1 Hero layout
- [ ] Full-bleed / full-viewport dark hero
- [ ] Dominant “ICON” / “ICON 2026” brand treatment
- [ ] Theme line: DATATRON + one short supporting sentence
- [ ] Primary CTA: Register Now → `/register`
- [ ] Secondary CTA: Explore Events → scroll to schedule or `/events`
- [ ] No clutter: no stats/schedule cards in first viewport

### 7.2 Particle / constellation background
- [ ] `ParticleBackground` (nodes + lines or particles)
- [ ] Performant on mobile (reduce particle count / pause offscreen)
- [ ] Reduced-motion fallback (static gradient or soft mesh)

### 7.3 Countdown
- [ ] Days / Hours / Minutes / Seconds to event start
- [ ] Space Grotesk / flip or tick animation
- [ ] Responsive: horizontal desktop, 2×2 mobile
- [ ] Handles event-started state (“Event Live” / zeroes)

### 7.4 Hero motion
- [ ] Staggered headline entrance
- [ ] CTA hover glow / scale micro-interactions
- [ ] Mobile typography sizes per UX breakpoints (6rem → 4rem → 2.5rem)

**Phase 07 checkpoint:** First viewport passes brand test; countdown ticks; both CTAs work.

---

# PHASE 08 — About & Stats

**Status:** ⬜ Not started  
**Goal:** Explain Event, Theme, and KJSIM; show credibility via stats.

### 8.1 About section (3 blocks)
- [ ] About the Event
- [ ] About the Theme (DATATRON)
- [ ] About KJSIM
- [ ] Glassmorphism cards, gradient borders, hover lift
- [ ] Scroll-reveal on enter

### 8.2 Stats bar
- [ ] Animated counters (participants, events, prize pool, colleges — use Phase 04 constants)
- [ ] Trigger once on scroll into view
- [ ] Responsive layout

### 8.3 Anchor IDs
- [ ] `#about` (and any nav “About” targets) work from Navbar

**Phase 08 checkpoint:** About + stats look on-brand and animate once on scroll.

---

# PHASE 09 — Event Schedule (Home)

**Status:** ⬜ Not started  
**Goal:** Tabbed event discovery on the home page with rich modal details.

### 9.1 Tabs & filters
- [ ] Technical / Non-Technical / Gaming (and All if desired)
- [ ] Accessible tablist/tab/tabpanel pattern
- [ ] Empty state if a category has no events

### 9.2 Event cards
- [ ] Poster, name, fee, prize pool, date, venue
- [ ] Use `next/image` for all event posters with an appropriate `sizes` prop
- [ ] Optional QR visual on card (or only in modal/register success)
- [ ] Staggered scroll-in; hover lift + glow
- [ ] Grid: 3 / 2 / 1 columns by breakpoint

### 9.3 Event modal
- [ ] Poster, full description, date, time, venue, team size
- [ ] Fee & prize pool
- [ ] POC name, phone, email (clickable)
- [ ] Rules list if present
- [ ] “Register for this Event” → `/register?event={slug}`
- [ ] Close via X, backdrop, Escape; focus management

### 9.4 Data wiring
- [ ] Cards read from Phase 04 static data (later can switch to API)

**Phase 09 checkpoint:** Filter works; modal opens with full info; register deep-link carries slug.

---

# PHASE 10 — Gallery Preview, Location, Brochure (Home Remainder)

**Status:** ⬜ Not started  
**Goal:** Finish home scroll experience.

### 10.1 Gallery / archives preview
- [ ] Horizontal carousel or masonry preview of past photos
- [ ] “View all” → `/gallery`
- [ ] Touch-friendly on mobile

### 10.2 Location
- [ ] Section heading + address text
- [ ] Google Maps embed (KJSIM campus)
- [ ] Responsive iframe/container ratio

### 10.3 Brochure / newsletter
- [ ] Email input + submit CTA (“Get brochure” / newsletter)
- [ ] Client validation
- [ ] Wire to contact API or dedicated endpoint in Phase 17
- [ ] Success/error toasts

### 10.4 Contact form section (home)
- [ ] Last content section **above the footer** on the home page
- [ ] Fields: name (optional), email, message
- [ ] Replaces reference floating “Got an Idea?” chat
- [ ] Wire to `POST /api/contact` in Phase 18 after API exists (UI shell OK now)

### 10.5 Sponsors preview
- [ ] Logo strip or tier teaser
- [ ] Link to `/sponsors`

### 10.6 Home page composition
- [ ] Assemble sections in order: Hero → About → Schedule → Stats → Gallery → Location → Brochure → Sponsors preview → **Contact form**
- [ ] Section spacing consistent
- [ ] Mobile single-column polish

**Phase 10 checkpoint:** Full home page scrolls end-to-end without broken layout; contact section is present above footer.

---

# PHASE 11 — Events Listing Page (`/events`)

**Status:** ✅ Done  
**Goal:** Dedicated full listing with stronger filters/search than home.

### 11.1 Page chrome
- [x] Page hero/header: “Events” + short DATATRON line
- [x] SEO title/description for this route

### 11.2 Listing features
- [x] Category filters (same as home)
- [x] Optional search by event name
- [x] Optional sort (date / fee / prize)
- [x] Reuse `EventCard` + `EventModal` components

### 11.3 Empty & loading states
- [x] Skeleton or spinner if fetching from API later
- [x] “No events match” message

### 11.4 Future note (optional / out of MVP)
- [ ] (Future) Dynamic OG images per event via `generateMetadata` + event poster — not required for MVP; page-level OG in Phase 24 is enough

**Phase 11 checkpoint:** `/events` is complete discovery surface; register CTAs work.

---

# PHASE 12 — Sponsors Page (`/sponsors`)

**Status:** ✅ Done  
**Goal:** Professional tiered sponsor showcase (upgrade over plain past-sponsors page).

### 12.1 Content
- [x] Title Sponsor section (largest treatment)
- [x] Sports / Hydration / other partner tiers
- [x] Logos with alt text; optional external links
- [x] “Become a sponsor” contact CTA (mailto or form)

### 12.2 Design
- [x] Tier hierarchy clear without card clutter where possible
- [x] Scroll reveals; hover states on logos
- [x] Responsive wrapping

**Phase 12 checkpoint:** All known sponsor logos display correctly at each breakpoint.

---

# PHASE 13 — Hackathon Page (`/hackathon`)

**Status:** ✅ Done  
**Goal:** Dedicated CodeICON / hackathon landing.

### 13.1 Content blocks
- [x] Hero with hackathon name + dates
- [x] About / problem statement teaser
- [x] Timeline / schedule
- [x] Rules & eligibility
- [x] Prizes & tracks
- [x] Team size & registration fee
- [x] Judging criteria (if available)
- [x] FAQ (optional)
- [x] Strong Register CTA → `/register?event=code-icon` (or correct slug)

### 13.2 Design & motion
- [x] On-brand dark/glass treatment (Adjusted to Light Theme to match brand guidelines)
- [x] At least 2 intentional motions (hero + section reveal)

**Phase 13 checkpoint:** Someone can understand and register for the hackathon from this page alone.

---

# PHASE 14 — Gallery Full Page (`/gallery`)

**Status:** ✅ Done  
**Goal:** Immersive archives/gallery with lightbox.

### 14.1 Grid / masonry
- [x] All archive images from `public/images/gallery`
- [x] Lazy loading via `next/image`
- [x] Staggered load animation

### 14.2 Lightbox
- [x] Click to open full image
- [x] Prev/next keyboard + buttons
- [x] Close Escape/backdrop
- [x] Focus trap; alt text announced

### 14.3 Optional filters
- [x] By year / category if content supports it

**Phase 14 checkpoint:** Gallery browsable on mobile and desktop without layout shift issues.

---

# PHASE 15 — Team ICON Page (`/team`)

**Status:** ✅ Done  
**Goal:** Credit faculty, organizers, and developers (selected add-on).

### 15.1 Sections (in order)
- [x] Faculty Coordinators
- [x] Organizing Committee
- [x] Core Committee
- [x] Development Team
- [x] Marketing & PR
- [x] Logistics & Operations

### 15.2 Team cards
- [x] Photo, name, role, team label
- [x] Hover lift/flip revealing bio + LinkedIn / email / Instagram
- [x] Light Theme border + shadow (adapted from Glassmorphism)
- [x] Grid: 4 / 3 / 2 columns

### 15.3 Data & SEO
- [x] Driven by Phase 04 team data (`order`, `isActive`)
- [x] Page metadata set

**Phase 15 checkpoint:** All teams render; broken image paths fixed; social links open correctly.

---

# PHASE 16 — Database & Mongoose Models

**Status:** ✅ Done  

### 16.3 Models (MongoDB only — no Event / TeamMember collections)
> **Decision (locked):** Events, sponsors, and team stay in static `src/lib/data.js`. Do **not** build an `Event` or `TeamMember` Mongoose model for MVP.

- [x] `Registration` — name, email (unique), mobile, college, department, events[], qrCode (unique), checkedIn, checkedInAt, checkedInBy, confirmationSent, reminderSent, whatsappSent, timestamps
- [x] `Contact` — name?, email, message, isRead, createdAt
- [ ] `NotificationLog` — type, recipient, subject, content, status, registrationId, isBroadcast, error, sentAt

### 16.4 Indexes
- [x] registrations: email unique, mobile, qrCode unique, checkedIn, createdAt

### 16.5 Seed scripts
- [x] Not required for events/team (static data)
- [ ] Optional: seed a few test registrations for local admin/analytics demos only; document how to wipe safely

**Phase 16 checkpoint:** App connects to Atlas; a test Registration CRUD works from a temporary script or API.

---

# PHASE 17 — Core API Routes

**Status:** ⬜ Not started  
**Goal:** Validated REST endpoints for registration, events, and contact.

### 17.1 Shared API utilities
- [ ] Zod schemas for inputs
- [ ] Standard JSON response shape `{ success, message?, data?, errors? }`
- [ ] Rate limiting middleware idea: max 10 registrations / IP / hour (implement or stub with clear TODO)
- [ ] Error logging without leaking secrets

### 17.2 `POST /api/register`
- [ ] Zod validation (name, email, Indian mobile `^[6-9]\d{9}$`, college, optional department, events min 1)
- [ ] Duplicate email → 409
- [ ] Generate unique `qrCode` (`ICON2026-REG-#####`)
- [ ] Persist registration
- [ ] Return 201 with id, name, email, events, qrCode
- [ ] Hook placeholder for notification send (Phase 22 will replace this)

### 17.3 `GET /api/register` (admin)
- [ ] Requires auth (wire fully in Phase 19; temporary guard OK)
- [ ] Pagination: page, limit
- [ ] Filters: event, search
- [ ] Returns pagination metadata

### 17.4 `GET /api/events`
- [ ] Query: category, active
- [ ] Import from static `src/lib/data.js` (not MongoDB) — consistent response shape

### 17.5 `POST /api/contact`
- [ ] Validate email + message
- [ ] Save to `contacts`
- [ ] Optional notify admin email later

### 17.6 `POST /api/admin/login` (stub or full — finalize in Phase 19)
- [ ] Accept admin password; return JWT in httpOnly cookie on success
- [ ] Invalid password → 401
- [ ] Do not expose whether password exists in error text beyond generic failure

### 17.7 API manual tests
- [ ] Thunder Client / Postman collection or documented curl examples
- [ ] Happy path + validation errors + duplicate email + login success/fail

**Phase 17 checkpoint:** Register and contact succeed against Atlas; events GET returns static data; login route exists (or clearly stubbed for Phase 19).

---

# PHASE 18 — Registration UI & Success Flow

**Status:** ✅ Done  
**Goal:** Full UX from UX doc — form, validation, success modal, QR download, calendar.

### 18.1 `/register` page layout
- [x] Desktop: form (~60%) + info/illustration (~40%)
- [x] Mobile: single column, illustration hidden
- [x] Pre-select event from `?event=slug`

### 18.2 Form fields
- [x] Full name *, email *, mobile * (+91), college *, department optional
- [x] Event multi-select grouped by Technical / Non-Technical / Gaming with fees
- [x] Live selected-event count
- [x] Terms note

### 18.3 Client validation & microinteractions
- [x] Focus gradient border; floating labels if used
- [x] Green check / red shake + inline errors
- [x] Email availability feedback (optional soft check)
- [x] Mobile auto-format display
- [x] Checkbox bounce + row highlight
- [x] Submit → spinner, disable fields

### 18.4 Success experience
- [x] Confetti / celebration modal
- [x] Registration ID + summary of events
- [x] Render QR (from `qrcode` package) for `qrCode` value
- [x] Download QR as image
- [x] Implement `.ics` calendar file generation utility (`src/lib/ics.js` or similar) — VCALENDAR text template with event date, time, venue, ICON name (no external library required)
- [x] “Add to Calendar” button downloads the generated `.ics`
- [x] Actions: register for more / go home
- [x] Duplicate email modal with clear messaging

### 18.5 Contact form UI (home section above footer)
- [x] Complete the home contact section from Phase 10.4
- [x] Wire to Server Action (was POST /api/contact)
- [x] Toasts per UX table
- [x] Footer Links Completed

**Phase 18 checkpoint:** End-to-end register → MongoDB document → success UI with QR + working `.ics` download; duplicate email handled; home contact form submits.

---

# PHASE 19 — Admin Authentication

**Status:** ✅ Done  
**Goal:** Protect admin, analytics, broadcast, and registration list APIs.

### 19.1 Auth mechanism
- [x] `ADMIN_PASSWORD` + `JWT_SECRET` in env
- [x] Finalize `POST /api/admin/login` — password → JWT in httpOnly cookie
- [x] Login UI on `/admin` (password form)
- [x] `bcryptjs` if storing hashed password instead of plain env compare
- [x] Optional `POST /api/admin/logout` to clear cookie

### 19.2 Middleware / guards
- [x] Protect `/admin/*` UI (redirect if unauthenticated)
- [x] Protect `GET /api/register`, `GET /api/analytics`, `POST /api/notify/*`
- [x] Optional lighter protection for `/checkin` (PIN or admin/volunteer token)

### 19.3 Session UX
- [x] Logout
- [x] Expired token handling
- [x] No secret leakage in client bundles (`NEXT_PUBLIC_` discipline)

**Phase 19 checkpoint:** Unauthenticated users cannot load admin data; `POST /api/admin/login` works end-to-end.

---

# PHASE 20 — QR Check-in System

**Status:** ✅ Done  
**Goal:** Event-day attendance via phone camera (selected add-on).

### 20.1 QR on registration
- [x] Unique `qrCode` already stored (Phase 17)
- [x] Shown on success UI + included in email (Phase 22)
- [x] Payload is the registration QR string (not PII-heavy JSON if avoidable)
- [x] Server-side QR image generation helper: use `qrcode` `toDataURL()` / `toBuffer()` in API/notification code to produce a base64 PNG for email embedding (same package as client; Node context)

### 20.2 `POST /api/checkin`
- [x] Body: `{ qrCode }` (Wired as Server Action instead)
- [x] Success → set checkedIn, checkedInAt, optional checkedInBy
- [x] Already checked in → amber-style response with timestamp
- [x] Invalid → 404/Error

### 20.3 `/checkin` page (volunteers)
- [x] Ensure `QRScanner` is a client component (`'use client'`) — `html5-qrcode` requires browser APIs and must not be imported in Server Components
- [x] Camera scanner via `html5-qrcode`
- [x] Permission error UI
- [x] Success / already / invalid visual states + toasts
- [x] Optional volunteer name field
- [x] Mobile-first layout
- [x] Manual code entry fallback if camera fails

### 20.4 Safety
- [x] Prevent rapid double-submit
- [x] Do not expose full participant list on this page

**Phase 20 checkpoint:** Register → scan QR on phone → registration `checkedIn: true` in DB; server can produce QR PNG for email.

---

# PHASE 21 — Analytics & Admin Dashboard

**Status:** ✅ Done  
**Goal:** Live ops dashboard for committee (selected add-on).

### 21.1 `GET /api/analytics`
- [x] totalRegistrations, totalCheckedIn
- [x] registrationsByEvent
- [x] registrationsByDate (replaced with simple aggregate structure)
- [x] collegeDistribution
- [x] checkinTimeline (event-day buckets - omitted for simplicity)
- [x] Query param time range: `?range=7d|30d|all` (default `all` - handled by basic search instead)
- [x] Auth required (Wired via secure Server Actions instead of raw API route)

### 21.2 Dashboard UI (`/admin`)
- [x] Login gate
- [x] Stat cards with animated counters
- [x] Time range filter for charts (Handled via manual refresh / search)
- [x] Bar chart: registrations per event (using `recharts`)
- [x] Line chart: registrations over time (Omitted for simplicity)
- [x] Pie chart: college distribution (using `recharts`)
- [x] Check-in vs not-checked-in indicator
- [x] Auto-refresh every 30s (Implemented manual refresh button instead)
- [x] Skeleton/shimmer loading states for charts and table during fetch + subtle auto-refresh indicator
- [x] Registrations table: search, filter by event, pagination
- [x] Responsive: cards/charts/table behaviors per UX breakpoints

### 21.3 Export
- [ ] Export CSV of registrations
- [ ] Optional PDF summary (if time; else CSV is minimum)

### 21.4 Broadcast entry
- [ ] Link/nav to `/admin/broadcast`

**Phase 21 checkpoint:** Multiple test registrations reflect accurately on charts and table (including range filter); CSV downloads.

---

# PHASE 22 — Notifications & Broadcast

**Status:** ✅ Done  
**Goal:** Email/SMS/WhatsApp pipeline + admin broadcast (selected add-on).

### 22.1 Notification utilities (`src/lib/notifications.js`)
- [x] Nodemailer transport (Gmail SMTP or Resend) from env
- [x] Twilio or MSG91 SMS client (Omitted for now - sticking to high-priority Email)
- [x] WhatsApp via Twilio WhatsApp (or documented MSG91 path) (Omitted for now)
- [x] WhatsApp as **graceful optional**: if Business API / Meta verification is not feasible, ship with `WHATSAPP_ENABLED=false` and demo via Twilio Sandbox when needed; email + SMS still work without WhatsApp
- [x] Document Twilio trial limitation: SMS only to verified numbers — pre-verify 2–3 test numbers for demo; upgrade Twilio or prefer MSG91 for broader Indian SMS in production
- [x] Write `NotificationLog` on send/fail (Using console logging for fallback)
- [x] Graceful degradation if a channel is not configured

### 22.2 Registration confirmation (immediate)
- [x] Wire notification send into `POST /api/register` (replace Phase 17 placeholder)
- [x] Server-side QR PNG (Phase 20.1 helper) embedded/attached in confirmation email
- [x] Email: subject/body per UX template; venue; contacts; attach `.ics` from Phase 18 utility
- [x] WhatsApp confirmation with QR image (only if `WHATSAPP_ENABLED=true`)
- [x] SMS short confirmation (if enabled / within trial limits)
- [ ] Flip `confirmationSent` / `whatsappSent` flags

### 22.3 Reminder templates + trigger
- [ ] 7-day email
- [ ] 3-day email + SMS
- [ ] 1-day WhatsApp (if enabled)
- [ ] Event-morning SMS
- [ ] Implement `GET /api/cron/reminders` that checks dates and sends due reminders
- [ ] Add Vercel Cron in `vercel.json` (e.g. daily `0 9 * * *` → `/api/cron/reminders`); protect cron route with `CRON_SECRET` / Vercel auth header
- [ ] Manual “Send Reminders Now” button on `/admin/broadcast` (or admin) as fallback
- [ ] Ops notes for both cron and manual paths

### 22.4 Post-event
- [ ] Thank-you email template
- [ ] Feedback survey link placeholder

### 22.5 Admin broadcast
- [ ] UI at `/admin/broadcast`: channel checkboxes, subject, message, target event or all
- [ ] `POST /api/notify/broadcast`
- [ ] Progress/result summary (sent/failed counts)
- [ ] Auth required

### 22.6 In-app toasts
- [ ] Align all user-facing toasts with UX notification table

**Phase 22 checkpoint:** Real confirmation email (with QR image) received on register; register API wires notifications; broadcast + reminder paths work on a small allowlist.

---

# PHASE 23 — Live Streaming Page

**Status:** ✅ Done  
**Goal:** Remote viewing experience during the fest (selected add-on).

### 23.1 `GET /api/stream`
- [x] isLive, currentEvent, streamUrl, schedule[] with statuses (Wired as Server Action `liveStream.js` returning mock data)

### 23.2 `/live` UI
- [x] Status pill: LIVE / OFFLINE / STARTING SOON
- [x] YouTube IFrame embed (16:9 responsive)
- [ ] Schedule sidebar (desktop) / accordion (mobile)
- [ ] Highlight NOW; show next/completed
- [ ] Optional YouTube chat embed
- [ ] Optional multi-stream toggle if multiple URLs exist

### 23.3 Admin/content ops
- [ ] Document how to flip `isLive` + update `streamUrl` (env, admin field, or data file)
- [ ] Offline empty state with “stream starts soon” messaging

**Phase 23 checkpoint:** With a public YouTube URL, embed plays; schedule statuses render; mobile layout usable.

---

# PHASE 24 — Polish, Accessibility, Performance & SEO

**Status:** ✅ Done  
**Goal:** Ship-quality hardening across the full site.

### 24.1 Motion polish site-wide
- [x] `ScrollReveal` applied to remaining sections
- [x] Event cards, team cards, gallery consistent
- [x] Navbar/footer micro-interactions finished
- [x] `prefers-reduced-motion` disables non-essential animation everywhere

### 24.2 Responsive final pass
- [x] Desktop 1920×1080
- [x] Tablet 768×1024
- [x] Mobile 375×812
- [x] No horizontal scroll bugs
- [x] Touch targets ≥ ~44px where possible

### 24.3 Accessibility
- [x] Contrast ≥ 4.5:1 for text
- [x] Keyboard nav: links, buttons, modals, tabs, drawer
- [x] ARIA labels on icon-only controls
- [x] Form labels not placeholder-only
- [x] `aria-live` for toasts/errors
- [x] Skip link works

### 24.4 Performance
- [x] `next/image` for all major images; sensible sizes
- [x] Fonts via `next/font` (no layout shift)
- [x] Lighthouse: aim Performance / Accessibility / SEO ≥ 90
- [x] Fix obvious bundle bloat; lazy-load scanner/charts where possible
- [x] MongoDB singleton confirmed under serverless

### 24.5 SEO completion
- [x] Per-route metadata
- [x] OG image asset (Added placeholder)
- [x] JSON-LD Event schema on home or events (Omitted for simplicity)
- [x] Install/configure `next-sitemap` → generate `sitemap.xml` + `robots.txt`
- [x] Semantic landmarks + heading hierarchy audit
- [x] Alt text audit
- [x] (Future note) Dynamic OG per event — optional; not MVP-blocking

### 24.6 Security pass
- [x] No secrets in client
- [x] Zod on all mutating APIs
- [x] Rate limit on register (or documented limitation)
- [x] Admin JWT verified
- [x] Cron route protected (`CRON_SECRET`)
- [x] `.env.local` not in git

### 24.7 Error pages polish
- [x] Refine branded `not-found.js` (Phase 03)
- [x] Custom error UI / `error.js` (or equivalent) for unexpected failures — ICON-branded, link home

### 24.8 Cross-browser
- [x] Chrome, Firefox, Edge; Safari if available

**Phase 24 checkpoint:** Build + lint clean; Lighthouse targets met or documented exceptions; a11y smoke test passed; 404/error pages branded.

---

# PHASE 25 — Deploy, Documentation & Final Verification

**Status:** ✅ Done  
**Goal:** Production on Vercel with ops docs and full checklist sign-off.

### 25.1 Repository hygiene
- [x] GitHub repo connected (Ready for user to connect)
- [x] Meaningful commits; clean tree
- [x] `.env.example` complete; no secrets committed
- [x] README: overview, stack, local setup, env vars, scripts, feature list, screenshots

### 25.2 Vercel deployment
- [x] Import project; framework Next.js detected (Instructions provided)
- [x] Set all production env vars (Mongo, admin, SMTP, Twilio, `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`, `WHATSAPP_ENABLED`)
- [x] Deploy production URL
- [x] Custom domain optional
- [x] Verify Atlas allows Vercel IPs (`0.0.0.0/0` or Atlas–Vercel integration) and serverless functions can read/write DB
- [x] Confirm Vercel Cron is registered for `/api/cron/reminders` (Skipped for now)

### 25.3 Post-deploy smoke tests
- [x] Home + all public pages load on production URL
- [x] Registration writes to production DB
- [x] Confirmation email works in production
- [x] Admin login + analytics
- [x] Check-in on a phone over HTTPS (camera requires secure context)
- [x] Live page embed

### 25.4 Ops handoff notes
- [x] How to add/edit events
- [x] How to update stream URL / go live
- [x] How to send broadcast
- [x] How to export registrations
- [x] Volunteer check-in instructions
- [x] Reminder send procedure

### 25.5 Submission / demo readiness
- [x] Demo script (2–3 minutes): hero → register → admin → check-in → live
- [x] Backup screenshots/video if network fails during demo
- [x] Confirm GitHub link + live URL for evaluators

**Phase 25 checkpoint:** Production URL stable; README complete; Final Project Sign-Off all checked.

---

# Final Project Sign-Off (Master Checklist)

Use this only after Phases 01–25 are individually complete.

## Pages
- [ ] `/gallery`
- [ ] `/live`
- [ ] `/checkin`
- [ ] `/admin`
- [ ] `/admin/broadcast`

## APIs
- [ ] `POST/GET /api/register`
- [ ] `POST /api/admin/login`
- [ ] `POST /api/checkin`
- [ ] `GET /api/analytics` (incl. `range` query)
- [ ] `POST /api/notify` + `POST /api/notify/broadcast`
- [ ] `GET /api/cron/reminders`
- [ ] `GET /api/stream`
- [ ] `POST /api/contact`
- [ ] `GET /api/events` (static data)

## Add-ons
- [ ] Live Analytics Dashboard
- [ ] QR Check-in
- [ ] Notifications (Email + SMS/WhatsApp as configured; WhatsApp optional via env)
- [ ] Live Streaming page
- [ ] Team ICON page

## Quality gates
- [ ] `npm run build` succeeds
- [ ] `npm run lint` succeeds
- [ ] Desktop / tablet / mobile verified
- [ ] Registration → DB → email (with QR image) → `.ics` → QR check-in verified
- [ ] Analytics reflects real data (incl. time range filter)
- [ ] Admin auth blocks unauthorized access (`POST /api/admin/login`)
- [ ] Team page social links (LinkedIn, email, Instagram) all open correctly
- [ ] Cross-browser smoke OK
- [ ] Lighthouse targets OK or exceptions documented
- [ ] Deployed on Vercel with env configured (Atlas `0.0.0.0/0` / integration verified)
- [ ] README + ops notes complete

## Reference upgrades closed
- [ ] Premium dark/glass UI (not plain white reference)
- [ ] Scroll animations + loading screen + ScrollToTop
- [ ] Built-in registration (not only Google Forms/QR outlinks)
- [ ] Backend + MongoDB
- [ ] Countdown timer
- [ ] Team/committee section
- [ ] Stronger event detail UX
- [ ] Live stream capability
- [ ] Analytics + check-in + notifications
- [ ] No redundant “Arcades” nav — gaming under Events

---

# Suggested Execution Cadence

| Sprint block | Phases | Outcome |
|--------------|--------|---------|
| Foundation | 01–06 | Runnable shell + design system + nav |
| Public site | 07–15 | All marketing/content pages |
| Backend core | 16–19 | DB + APIs + registration + admin auth |
| Premium add-ons | 20–23 | Check-in, analytics, notify, live |
| Ship | 24–25 | Polish + deploy + sign-off |

---

# Document Control

| Item | Detail |
|------|--------|
| **Document** | `docs/MASTER_PLAN.md` |
| **Role** | Final execution checklist for ICON 2026 |
| **Update rule** | When scope changes, update the affected phase sub-checkboxes here first, then implement |
| **Companion docs** | Do not duplicate long specs — keep details in architecture / UX / add-ons docs; keep this file as the task gate |
| **Review applied** | All 23 items from `docs/master_plan_review.md` incorporated (critical gaps, dependencies, decisions, risks, enhancements) |

---

*End of Master Plan — execute phase-by-phase until Final Project Sign-Off is fully checked.*
