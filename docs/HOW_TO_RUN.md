# How to Run ICON Website (Local)

Use this file whenever you (or a teammate) need to start the project without confusion.  
Commands below are for **Windows PowerShell** in the project folder: `D:\ICON-KJSIM`.

---

## 0) Prerequisites (one time on the machine)

Install if missing:

- **Node.js 20 or 22 LTS** — https://nodejs.org  
- **Git** (optional)  
- MongoDB Atlas connection string (or local Mongo)  
- Resend API key (for emails)  
- Cloudinary account (for payment screenshots / posters)

Check Node:

```powershell
node -v
npm -v
```

You should see versions (example: `v22.x` and `10.x`).

---

## 1) Go to project folder

```powershell
cd D:\ICON-KJSIM
```

---

## 2) Install dependencies (first time, or after pull)

```powershell
npm install
```

---

## 3) Create / fill `.env`

If `.env` does not exist:

```powershell
Copy-Item .env.example .env
```

Then open `.env` and fill at least:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
ADMIN_PASSWORD=your-admin-password
RESEND_API_KEY=re_...
EMAIL_FROM="ICON KJSIM <orders@your-verified-domain.com>"
EMAIL_REPLY_TO=your@email.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
ICON_EDITION=2026
```

**Do not commit `.env`.**

Quick check that keys exist:

```powershell
node scripts/check-env-keys.js
```

---

## 4) Seed database (events + site settings)

Run once on a new database (or after reset):

```powershell
npm run seed
```

Expected: `Seeded 13 events + SiteConfig for edition 2026`

If this fails, fix `MONGODB_URI` first.

---

## 5) Start the website (development)

```powershell
npm run dev
```

Open in browser:

- Site: http://localhost:3000  
- Register: http://localhost:3000/register  
- Admin login: http://localhost:3000/admin/login  

Stop server: `Ctrl + C` in the terminal.

---

## 6) First admin setup checklist (after server is running)

1. Login at `/admin/login` with `ADMIN_PASSWORD` from `.env`  
2. Go to **Settings** → upload Somaiya payment QR images for amounts (149 / 299 / 499)  
3. Go to **Events** → set fees so selected-event totals match those QR amounts  
4. Test one registration with screenshot + UTR  
5. In Admin dashboard → **Verify** payment → confirmation email should send  

---

## 7) Useful commands

| Task | Command |
|------|---------|
| Install packages | `npm install` |
| Seed events/settings | `npm run seed` |
| Dev server | `npm run dev` |
| Check env keys | `node scripts/check-env-keys.js` |
| Test email | `node --env-file=.env scripts/send-test-email.js you@gmail.com` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Production start (after build) | `npm start` |

---

## 8) Production-style local test (optional)

```powershell
cd D:\ICON-KJSIM
npm run build
npm start
```

Then open http://localhost:3000

---

## 9) Common issues

### `MONGODB_URI` / Mongo errors
- Check internet + Atlas IP allowlist (`0.0.0.0/0` for testing, or your IP)
- Re-run: `npm run seed`

### Port 3000 already in use
```powershell
npx next dev -p 3001
```
Also set `NEXT_PUBLIC_APP_URL=http://localhost:3001` in `.env` if needed.

### Payment says “No QR configured”
- Admin → Settings → upload QR image for that exact amount  
- Align event fees so total equals that amount  

### Screenshot upload fails
- Confirm Cloudinary keys in `.env`  
- Restart `npm run dev` after changing `.env`  

### Email not received
```powershell
node --env-file=.env scripts/send-test-email.js you@gmail.com
```
- Check Resend domain / `EMAIL_FROM`  
- Restart dev server after changing `.env`  

### Admin page redirects to login
- Use password from `ADMIN_PASSWORD` in `.env`  
- Clear cookies for localhost if stuck  

---

## 10) Daily workflow (short)

```powershell
cd D:\ICON-KJSIM
npm run dev
```

Then use browser:
- Edit events/fees: `/admin/events`  
- Theme / QR tiers: `/admin/settings`  
- Verify payments: `/admin`  

---

## 11) Related docs

- Email setup: [EMAIL_SMS_SETUP.md](./EMAIL_SMS_SETUP.md)  
- Enhancement tracker: [admin-decisions/10_WEBSITE_ENHANCEMENT_PLAN.md](./admin-decisions/10_WEBSITE_ENHANCEMENT_PLAN.md)  
- IT hosting request: [admin-decisions/08_IT_HOSTING_REQUEST_LETTER.md](./admin-decisions/08_IT_HOSTING_REQUEST_LETTER.md)  
