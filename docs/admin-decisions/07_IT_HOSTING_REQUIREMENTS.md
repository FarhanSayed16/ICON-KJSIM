# ICON Website — Hosting Requirements for College IT Department  
**K J Somaiya Institute of Management (KJSIM) / Somaiya Vidyavihar University**

**Document purpose:** Formal requirement list so IT can host the ICON techfest website on college infrastructure (Linux/Windows server, AWS, Nginx, etc.).

**Prepared by:** ICON Student Admin / Web Team  
**Application name:** ICON Techfest Official Website  
**Suggested public URL:** `icon.kjsim.somaiya.edu` / `icon.somaiya.edu` / subdomain allotted by IT  

---

## 1. What we are asking IT for (short)

We request IT to provide **one production hosting environment** where we can run the ICON website permanently (or at least until fest + 30 days after), including:

1. A **server** (preferred: **Linux**) — VM / physical / AWS EC2 as per IT policy  
2. **Nginx** (or IIS reverse proxy) as front HTTPS gateway  
3. Ability to run a **Node.js** application (long-running process)  
4. **Outbound internet** from server (for database + email APIs)  
5. A **subdomain + SSL certificate** under Somaiya / KJSIM domain  
6. Coordination on **firewall / ports / DNS**  
7. Optional: access for student admin to deploy updates (SSH / panel / CI)

We will provide the application build, environment variables, and deployment steps.

---

## 2. How the system is built (architecture for IT)

### Stack summary

| Layer | Technology |
|-------|------------|
| Frontend + Backend | **Next.js 16** (React 19) — single full-stack app |
| Runtime | **Node.js** (LTS recommended: **20.x or 22.x**) |
| Database | **MongoDB** (currently MongoDB Atlas cloud; can discuss on-prem Mongo if IT prefers) |
| Email | **Resend API** (HTTPS outbound) — registration confirmation mails |
| Optional SMS | Twilio (can stay disabled) |
| Process model | `next build` → `next start` (listens on internal port, e.g. **3000**) |
| Reverse proxy | **Nginx** terminates SSL and proxies to Node on `127.0.0.1:3000` |

### High-level flow

```text
Internet users
    │
    ▼
DNS: icon.<college-domain>
    │
    ▼
Nginx (443 HTTPS)  ──►  Node.js / Next.js app (port 3000)
                            │
                            ├──► MongoDB (Atlas OR college Mongo)
                            ├──► Resend API (email) via HTTPS outbound
                            └──► (optional) Twilio
```

### What the website does
- Public pages: home, events, schedule, team, register  
- **Online registration** (stores participant data)  
- Sends **confirmation email** with QR pass  
- Admin login panel (analytics, check-in helpers, broadcasts)  
- API routes under `/api/*`  
- Optional scheduled reminder job (cron / systemd timer)

This is **not** a static HTML site. It needs a running Node process + database.

---

## 3. Preferred hosting options (please choose one)

### Option A — College Linux server + Nginx (**recommended**)
- Ubuntu 22.04 / 24.04 LTS (or RHEL equivalent)  
- Nginx reverse proxy + Let’s Encrypt / college SSL  
- Node.js via systemd service (`icon-web.service`)  
- App directory e.g. `/var/www/icon-kjsim`  
- Student deploy via Git pull + `npm ci && npm run build` (or IT-controlled pipeline)

### Option B — AWS (under college AWS account)
- EC2 (t3.small or better) **or** Elastic Beanstalk / App Runner / ECS  
- Application Load Balancer or Nginx on instance  
- Security groups: 80/443 in; Node port not public  
- Same Node + Mongo + outbound HTTPS needs  

### Option C — Windows Server (possible, not preferred)
- Possible with IIS as reverse proxy to Node  
- More friction for Node hosting; Linux preferred if available  

**Student team preference:** **Option A (Linux + Nginx)** or **Option B (AWS Linux)**.

---

## 4. Exact technical requirements to request

### 4.1 Compute
| Item | Minimum | Recommended |
|------|---------|-------------|
| OS | Linux (Ubuntu 22.04+) | Ubuntu 24.04 LTS |
| vCPU | 2 | 2–4 |
| RAM | **2 GB** | **4 GB** |
| Disk | 20 GB SSD | 40 GB SSD |
| Swap | 1–2 GB if RAM = 2 GB | optional with 4 GB |

Peak load note: registration bursts around fest week; 2 vCPU / 4 GB is safer.

### 4.2 Software to be installed (by IT or with IT approval)
- [ ] Node.js **20 LTS or 22 LTS** + npm  
- [ ] Nginx  
- [ ] Git  
- [ ] PM2 **or** systemd (we prefer systemd)  
- [ ] Optional: Certbot (if IT uses Let’s Encrypt)  
- [ ] Optional: MongoDB server **only if** not using Atlas  

### 4.3 Network / firewall
| Direction | Port / service | Why |
|-----------|----------------|-----|
| Inbound | **443** (HTTPS) | Public website |
| Inbound | **80** (HTTP) | Redirect to HTTPS |
| Inbound | SSH **22** (restricted IPs) | Deploy/admin only |
| Outbound | **443 HTTPS** | MongoDB Atlas, Resend email API, npm (build time) |
| Outbound | **53 DNS** | Name resolution |
| Internal | `127.0.0.1:3000` | App behind Nginx (not exposed publicly) |

**Please confirm:** server is allowed **outbound HTTPS** to:
- `*.mongodb.net` (if Atlas)  
- `api.resend.com` (email)  

If outbound is blocked by default, email + DB will fail.

### 4.4 Domain / DNS / SSL
Please provide / configure:
- [ ] Subdomain (examples): `icon.kjsim.somaiya.edu` / `icon.somaiya.edu`  
- [ ] DNS **A/AAAA** (or CNAME) pointing to server / load balancer  
- [ ] Valid **SSL/TLS certificate** (college CA / DigiCert / Let’s Encrypt)  
- [ ] Auto-renewal process owner (IT or us, as per policy)

Public URL will be set in app as `NEXT_PUBLIC_APP_URL=https://<allotted-domain>`

### 4.5 Database
**Current design:** MongoDB Atlas (managed cloud).

**Ask IT:**
1. Is outbound to MongoDB Atlas allowed?  
2. Or should we use **college-hosted MongoDB** instead?  

If college MongoDB:
- MongoDB 6/7  
- Database name e.g. `icon`  
- User with read/write on that DB only  
- Connection string for app `.env`  
- Backup policy (daily recommended during fest window)

### 4.6 Email delivery
Registration sends confirmation emails.

**Ask IT:**
1. Can server call external email API (**Resend**) over HTTPS? **OR**  
2. Will IT provide **SMTP relay** (`smtp.somaiya.edu` or similar) with authenticated mailbox?  

If SMTP is provided, we can adapt the app to college SMTP.  
If only external API is allowed, we need outbound HTTPS to Resend.

**Ideal college setup:** mailbox like `icon@somaiya.edu` or `icon.simsr@somaiya.edu` as From/Reply-To (already used institutionally).

### 4.7 Process / uptime
- App must run **24×7** as a service (systemd/PM2), not only when someone is logged in  
- Auto-restart on crash  
- Boot-start on server reboot  
- Log location (e.g. journalctl / `/var/log/nginx/` + app logs)

### 4.8 Access for student web team
Please clarify what IT can grant:
- [ ] SSH access (limited sudo) **or**  
- [ ] Deploy only via IT ticket **or**  
- [ ] GitHub Actions / CI deploy into server  

We need a clear update path for content/event changes before fest.

---

## 5. Environment / secrets (what we will configure)

IT does **not** need our passwords in email. We will place secrets on server in a protected `.env` (permissions `600`).

Typical variables:
- `MONGODB_URI`  
- `JWT_SECRET`  
- `ADMIN_PASSWORD`  
- `RESEND_API_KEY` / or SMTP credentials  
- `EMAIL_FROM` / `EMAIL_REPLY_TO`  
- `NEXT_PUBLIC_APP_URL`  
- `CRON_SECRET` (if reminders enabled)

**Ask IT:** approved location for secrets (`.env` file vs vault) and backup policy for `.env`.

---

## 6. Nginx (example requirement)

We need Nginx to:
- Listen 443 with SSL  
- Proxy pass to `http://127.0.0.1:3000`  
- Forward headers: `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`  
- Support large enough body size for form posts (e.g. `client_max_body_size 10m;`)  
- Optional gzip  

We can share a sample Nginx site config once domain is allotted.

---

## 7. Security & compliance asks

Please confirm:
- [ ] HTTPS only (HTTP → HTTPS redirect)  
- [ ] Server hardening baseline (SSH key auth, no password root login)  
- [ ] Who is allowed admin panel access (student admin only)  
- [ ] Data retention: registration PII (name, email, phone, college) — storage location + deletion after fest?  
- [ ] College privacy / student data guidelines we must follow  
- [ ] WAF / rate-limit at Nginx (optional but useful during registration rush)  
- [ ] Backup restore drill contact  

---

## 8. Capacity / timeline expectation

| Item | Estimate |
|------|----------|
| Concurrent users (normal) | dozens–low hundreds |
| Registration spike window | fest promo weeks |
| Go-live target | ASAP after theme/events freeze (within fest timeline) |
| Keep live until | Fest end + at least 30 days (certificates / queries) |

---

## 9. Division of responsibility

### Student ICON Web Team will
- Provide source code / release build instructions  
- Provide `.env.example` and final env values (securely)  
- Run app build (`npm ci`, `npm run build`, `npm start`)  
- Maintain content/events updates  
- Test registration + email after deploy  
- Report incidents to IT  

### College IT is requested to
- Provision server / AWS resource  
- Configure DNS + SSL  
- Install Node/Nginx (or approve our install)  
- Open required firewall rules  
- Approve outbound DB/email endpoints  
- Provide access method for deployment  
- Monitor host-level health (disk/CPU)  

---

## 10. Questions for IT (please reply point-wise)

1. Can you host a **Node.js (Next.js)** long-running app behind **Nginx**?  
2. Preferred platform: **on-prem Linux / Windows / AWS**?  
3. What subdomain can be allotted for ICON?  
4. Who issues SSL certificate and renewal?  
5. Is **outbound HTTPS** allowed to MongoDB Atlas + email API?  
6. Do you prefer **college MongoDB** instead of Atlas?  
7. Can you provide **SMTP** (`icon@…@somaiya.edu`) or must we use external email API?  
8. What access will students get (SSH / panel / ticket-only)?  
9. Any mandatory security review / change-request form before go-live?  
10. Expected provisioning time after this requirement sheet is approved?

---

## 11. Minimum acceptance criteria (definition of “hosted properly”)

Website is considered successfully hosted when:

- [ ] `https://<allotted-domain>` opens without certificate warnings  
- [ ] Home + Events pages load  
- [ ] Registration form submits and saves to database  
- [ ] Confirmation email is received by registrant  
- [ ] Admin login works  
- [ ] Service survives server reboot (auto-start)  
- [ ] IT and student team know who to call if site is down  

---

## 12. Contact

| Role | Name | Phone / Email |
|------|------|----------------|
| Student Admin / Coordinator | | |
| Web Technical Lead | | |
| Faculty Mentor (if any) | | |
| IT Single Point of Contact | *(IT to fill)* | |

---

## 13. Attachments we can send next (on request)

1. Sample Nginx config  
2. systemd service unit file  
3. Deployment step-by-step (Git → build → restart)  
4. Architecture one-pager PDF  
5. Data fields collected at registration (for privacy review)

---

**Thank you.**  
Please let us know which hosting option (A/B/C) is approved and the subdomain allotted so we can proceed with deployment immediately.
