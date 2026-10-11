# ICON Website Enhancement Plan — Implementation Tracker

Full architecture and college IT alignment live in the Cursor plan.  
This file is the **working checklist** for the team.

## Goals
- Admin-managed events + site settings (no redeploy for content)
- Somaiya QR-tier payments + screenshot/UTR verification
- Coordinator-friendly per-event lists/exports
- Compatible with Linux + Nginx + SSL + MongoDB one-time deploy

## Build order
1. [x] Document this plan  
2. [x] Event + SiteConfig Mongo models + seed + DB read helpers  
3. [x] Admin Events CRUD + Site Settings  
4. [x] Registration payment fields + Cloudinary upload  
5. [x] Registration UX (amount, QR, screenshot, UTR)  
6. [x] Admin payment verify desk + CSV  
7. [x] Coordinator event ops summary table on dashboard  
8. [ ] Harden + college deploy checklist (Linux/Nginx/SSL smoke test)  

### How to operate now
1. `npm run seed` — load events/settings into Mongo (already run once)  
2. Admin → **Settings** — upload payment QR images for ₹149 / ₹299 / ₹499  
3. Admin → **Events** — set fees so totals match those QR amounts; edit/add events anytime  
4. Users register → pay → upload screenshot + UTR  
5. Admin → **Verify** → confirmation email sent  

### Important
Align event fees to your QR tiers (e.g. only amounts that have a QR). Until QR images are uploaded in Settings, paid registrations will be blocked with a clear error.

## Operating rules (locked)
- Confirmation email / venue pass **after payment verified**  
- Post IT SSH revoke: all content/fee/QR/event changes via **Admin panel**  
- Prefer MongoDB (do not migrate to MySQL without a separate project)  
