# ICON 2026 — KJSIM Techfest Full-Stack Website

## 🎯 Project Overview

Build a **complete, modern, full-stack website** for **ICON 2026** — the official techfest of the Department of Data Science and Technology at **K J Somaiya Institute of Management (KJSIM)**, Somaiya Vidyavihar University, Mumbai. The 2026 theme is **"DATATRON"** — celebrating the fusion of data, automation, and futuristic technology.

The website must be a **significant upgrade** over the existing reference site at `somaiya-kjsim-icon.netlify.app`, with premium aesthetics, smooth animations, full responsiveness, a working registration system backed by a database, and deployment-ready architecture.

---

## 📸 Reference Site Analysis

After analyzing all 10 reference screenshots and the logos, here is what the existing site contains and its shortcomings:

### What the Reference Site Has
| Section | Description |
|---------|-------------|
| **Hero** | Large "ICON" text with animated network/constellation background (nodes + lines) |
| **Navbar** | Somaiya logo (left) + nav links (Home, About, Events, Arcades, Gallery, Archives, Sponsors, Hackathon) + ICON logo (right) |
| **About** | Three blocks — About the Event, About the Theme (DATATRON), About KJSIM |
| **Event Schedule** | Tab-based filter (Technical / Non-Technical / Gaming Events) with event cards showing poster, registration fee, prize pool, date, venue, QR code |
| **Event Modal** | Click an event → popup with poster, description, date, venue, team size, POC contact, registration link |
| **Archives** | Horizontal image carousel of past event photos |
| **Location** | Embedded Google Map showing KJSIM campus |
| **Brochure** | Email input to receive the brochure |
| **Sponsors** | Separate `/pastsponsors` page showing Title Sponsor, Sports Partner, Hydration Partner logos |
| **Footer** | ICON logo, description, useful links, contact info (phone, email), social media icons (Facebook, Instagram, LinkedIn) |
| **Floating Chat** | "Got an Idea?" chat widget |

### Shortcomings to Fix
- ❌ **Very plain/basic design** — white backgrounds, minimal visual hierarchy, no gradients or depth
- ❌ **No smooth animations** — page loads are static, no scroll-triggered reveals
- ❌ **No registration form** — only QR codes pointing to external Google Forms
- ❌ **No backend/database** — purely static frontend
- ❌ **Inconsistent mobile responsiveness** — layout breaks on smaller screens
- ❌ **No countdown timer** for the event
- ❌ **No team/committee section**
- ❌ **Poor event detail pages** — modals are basic with no immersive detail
- ❌ **No dark mode or modern glassmorphism effects**
- ❌ **No loading animations or page transitions**
- ❌ **No live streaming capability**
- ❌ **No analytics or check-in system**
- ❌ **No notification system**

---

## 🚀 What We're Building

### Design & UX Enhancements
1. **Dark-themed hero** with animated particle/constellation background
2. **Glassmorphism cards** with blur, gradient borders, and hover effects
3. **Scroll-triggered animations** using Framer Motion (fade-in, slide-up, parallax)
4. **Animated countdown timer** to the event date
5. **Smooth page transitions** between routes
6. **Micro-interactions** — button hover ripples, card tilt effects, navbar scroll-hide/show
7. **Responsive hamburger menu** with slide-in drawer for mobile
8. **Loading screen** with ICON logo animation on first load
9. **Gradient color palette** — crimson-red + deep blue + violet (from the ICON logo)

### Functional Features (Core)
1. **Full registration form** — Name, Email, Mobile, College/Department, Event Selection
2. **Backend API** with Next.js API Routes
3. **MongoDB database** to store all registrations
4. **Server-side validation** and duplicate-email prevention
5. **Contact form** replacing the floating chat

### Add-On Features (Selected)
1. **📊 Live Analytics Dashboard** — real-time charts (registrations, check-ins, college distribution)
2. **📱 QR-Based Check-in System** — generate QR on registration, scan at venue, track attendance
3. **🔔 Real-Time Notifications** — Email confirmations + SMS reminders + WhatsApp messages + admin broadcast
4. **🎥 Live Event Streaming Page** — YouTube Live embed with live schedule sidebar
5. **👥 Team ICON Page** — Dev team + organizing committee + faculty coordinators showcase

---

## 🏗️ Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG for SEO, file-based routing, React ecosystem |
| **Styling** | Vanilla CSS + CSS Modules | Maximum control, no framework lock-in |
| **Animations** | Framer Motion | Scroll triggers, page transitions, gesture support |
| **Charts** | Chart.js + react-chartjs-2 | Analytics dashboard visualizations |
| **QR** | qrcode + html5-qrcode | QR generation & camera scanning |
| **Backend** | Next.js API Routes | Full-stack in one project |
| **Database** | MongoDB Atlas (free tier) | Cloud-hosted, schema-flexible |
| **ODM** | Mongoose | Schema validation, middleware |
| **Email** | Nodemailer + Gmail SMTP | Registration confirmations, reminders |
| **SMS/WhatsApp** | Twilio / MSG91 | Pre-event reminders, broadcast messages |
| **Streaming** | YouTube IFrame API | Live event stream embed |
| **Deployment** | Vercel | Native Next.js hosting, free tier |
| **Version Control** | Git + GitHub | Required per submission |

---

## 📐 Project Structure

```
ICON-KJSIM/
├── public/
│   ├── images/
│   │   ├── icon_logo.png
│   │   ├── kjsim_logo.jpg
│   │   ├── events/           # Event poster images
│   │   ├── gallery/          # Gallery/archive photos
│   │   ├── sponsors/         # Sponsor logos
│   │   └── team/             # Team member photos
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js         # Root layout with fonts, metadata, navbar, footer
│   │   ├── page.js           # Home page (hero + about + schedule + archives + location)
│   │   ├── events/
│   │   │   └── page.js       # Full events listing page
│   │   ├── register/
│   │   │   └── page.js       # Registration form page
│   │   ├── team/
│   │   │   └── page.js       # Team ICON — dev team + organizing committee
│   │   ├── sponsors/
│   │   │   └── page.js       # Sponsors showcase page
│   │   ├── hackathon/
│   │   │   └── page.js       # CodeICON hackathon dedicated page
│   │   ├── gallery/
│   │   │   └── page.js       # Photo gallery with lightbox
│   │   ├── live/
│   │   │   └── page.js       # Live event streaming page
│   │   ├── checkin/
│   │   │   └── page.js       # QR code scanner (volunteer use)
│   │   ├── admin/
│   │   │   ├── page.js       # Admin dashboard (registrations + analytics)
│   │   │   └── broadcast/
│   │   │       └── page.js   # Send broadcast notifications
│   │   ├── globals.css       # Global styles, CSS custom properties, reset
│   │   └── api/
│   │       ├── register/
│   │       │   └── route.js  # POST: submit registration, GET: fetch registrations
│   │       ├── checkin/
│   │       │   └── route.js  # POST: validate QR + mark check-in
│   │       ├── analytics/
│   │       │   └── route.js  # GET: dashboard aggregation data
│   │       ├── notify/
│   │       │   ├── route.js  # POST: send individual notification
│   │       │   └── broadcast/
│   │       │       └── route.js  # POST: bulk notification to all participants
│   │       ├── stream/
│   │       │   └── route.js  # GET: live stream info + schedule
│   │       ├── contact/
│   │       │   └── route.js  # POST: submit contact message
│   │       └── events/
│   │           └── route.js  # GET: fetch events list
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.module.css
│   │   ├── Hero/
│   │   │   ├── Hero.js
│   │   │   ├── Hero.module.css
│   │   │   └── ParticleBackground.js
│   │   ├── About/
│   │   │   ├── About.js
│   │   │   └── About.module.css
│   │   ├── EventSchedule/
│   │   │   ├── EventSchedule.js
│   │   │   ├── EventSchedule.module.css
│   │   │   ├── EventCard.js
│   │   │   └── EventModal.js
│   │   ├── Countdown/
│   │   │   ├── Countdown.js
│   │   │   └── Countdown.module.css
│   │   ├── Gallery/
│   │   │   ├── Gallery.js
│   │   │   └── Gallery.module.css
│   │   ├── Location/
│   │   │   ├── Location.js
│   │   │   └── Location.module.css
│   │   ├── TeamSection/
│   │   │   ├── TeamSection.js
│   │   │   ├── TeamSection.module.css
│   │   │   └── TeamCard.js
│   │   ├── LiveStream/
│   │   │   ├── LiveStream.js
│   │   │   └── LiveStream.module.css
│   │   ├── QRScanner/
│   │   │   ├── QRScanner.js
│   │   │   └── QRScanner.module.css
│   │   ├── Analytics/
│   │   │   ├── AnalyticsDashboard.js
│   │   │   └── AnalyticsDashboard.module.css
│   │   ├── Sponsors/
│   │   │   ├── Sponsors.js
│   │   │   └── Sponsors.module.css
│   │   ├── RegistrationForm/
│   │   │   ├── RegistrationForm.js
│   │   │   └── RegistrationForm.module.css
│   │   ├── Footer/
│   │   │   ├── Footer.js
│   │   │   └── Footer.module.css
│   │   ├── ScrollReveal/
│   │   │   └── ScrollReveal.js
│   │   └── LoadingScreen/
│   │       ├── LoadingScreen.js
│   │       └── LoadingScreen.module.css
│   ├── lib/
│   │   ├── mongodb.js        # MongoDB connection utility (singleton)
│   │   ├── data.js           # Static event/sponsor/team data
│   │   └── notifications.js  # Email/SMS/WhatsApp sending utilities
│   └── models/
│       ├── Registration.js   # Mongoose schema for participant registrations
│       ├── Event.js          # Mongoose schema for events
│       ├── Contact.js        # Mongoose schema for contact messages
│       └── NotificationLog.js # Mongoose schema for notification tracking
├── .env.local                # Environment variables
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## 📄 Pages Overview

### 1. Home Page (`/`) — Single-page scroll
- Hero (particle bg + countdown + CTAs)
- About (Event + DATATRON + KJSIM)
- Event Schedule (tabs + cards + modals)
- Stats bar (animated counters)
- Gallery preview
- Location (Google Maps embed)
- Brochure / Newsletter
- Sponsors preview

### 2. Events Page (`/events`) — Full event listing with filters

### 3. Registration Page (`/register`) — Full registration form with validation

### 4. Team ICON Page (`/team`) — Faculty, committee, dev team showcase

### 5. Hackathon Page (`/hackathon`) — CodeICON details, rules, prizes

### 6. Sponsors Page (`/sponsors`) — Sponsors by tier

### 7. Gallery Page (`/gallery`) — Photo gallery with lightbox

### 8. Live Streaming Page (`/live`) — YouTube embed + live schedule

### 9. Check-in Page (`/checkin`) — QR scanner for volunteers

### 10. Admin Dashboard (`/admin`) — Registrations table + analytics charts + broadcast

---

## 🎨 Design System

### Color Palette
```css
:root {
  --crimson:        #B71C1C;
  --crimson-light:  #E53935;
  --deep-blue:      #1A237E;
  --royal-blue:     #1565C0;
  --violet:         #7B1FA2;
  --bg-dark:        #0a0a0f;
  --bg-dark-card:   rgba(255, 255, 255, 0.03);
  --bg-light:       #FAFAFA;
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --gradient-brand:  linear-gradient(135deg, #E53935, #1565C0, #7B1FA2);
  --glass:           rgba(255, 255, 255, 0.05);
  --glass-border:    rgba(255, 255, 255, 0.1);
}
```

### Typography
- **Headings**: `Outfit` — modern, geometric
- **Body**: `Inter` — highly legible
- **Accent**: `Space Grotesk` — countdown, stats

---

## 📋 Implementation Phases

### Phase 1: Project Setup (Steps 1–3)
1. Initialize Next.js 14 project
2. Set up global CSS, custom properties, fonts
3. Create root layout with metadata

### Phase 2: Core Components (Steps 4–10)
4. Build `Navbar` with responsive mobile drawer
5. Build `Hero` with particle background + countdown
6. Build `About` section with glassmorphism cards
7. Build `EventSchedule` with tabs, cards, modal
8. Build `Gallery` / Archives carousel
9. Build `Location` with Google Maps embed
10. Build `Footer` with contact info + social links

### Phase 3: Additional Pages (Steps 11–14)
11. Build `/sponsors` page
12. Build `/hackathon` page
13. Build `/gallery` full page
14. Build `/team` — Team ICON page (faculty + committee + dev team)

### Phase 4: Registration System (Steps 15–19)
15. Set up MongoDB Atlas connection + Mongoose
16. Create all Mongoose models
17. Build `/api/register` API route (POST + GET)
18. Build `RegistrationForm` component with validation
19. Build `/register` page with QR code generation

### Phase 5: Add-On Features (Steps 20–25)
20. Build `/api/checkin` + `/checkin` page (QR scanner)
21. Build `/api/analytics` + `AnalyticsDashboard` component
22. Build admin dashboard with charts + registrations table
23. Build notification utilities (email/SMS/WhatsApp)
24. Build broadcast notification system
25. Build `/live` streaming page with YouTube embed + schedule

### Phase 6: Polish (Steps 26–28)
26. Add scroll-reveal animations site-wide (Framer Motion)
27. Add loading screen animation
28. Final responsive pass — mobile/tablet/desktop testing

### Phase 7: Deploy (Steps 29–30)
29. Set up GitHub repo + write README.md
30. Deploy to Vercel with environment variables

---

## ✅ Verification Plan

### Automated Tests
```bash
npm run build    # Build check — no compilation errors
npm run lint     # Lint check
```

### Manual Verification
- [ ] **Desktop** (1920×1080): Full layout, animations, hover effects, navigation
- [ ] **Tablet** (768×1024): Responsive grid, touch-friendly, hamburger menu
- [ ] **Mobile** (375×812): Single-column, swipeable carousels, form usability
- [ ] **Registration flow**: Submit form → verify in MongoDB → verify admin panel
- [ ] **QR Check-in**: Register → get QR → scan at `/checkin` → verify status updates
- [ ] **Analytics**: Register multiple users → verify charts reflect accurate data
- [ ] **Notifications**: Verify confirmation email sends on registration
- [ ] **Live stream**: Verify YouTube embed loads and schedule displays correctly
- [ ] **Team page**: Verify all team members render with correct photos and links
- [ ] **Cross-browser**: Chrome, Firefox, Safari, Edge
- [ ] **Performance**: Lighthouse score ≥ 90 for Performance, Accessibility, SEO
