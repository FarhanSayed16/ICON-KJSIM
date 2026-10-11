# ICON Techfest Website — Hosting Support Request  
**K J Somaiya Institute of Management | Somaiya Vidyavihar University**

| Field | Details |
|-------|---------|
| Document type | Hosting support request for college IT Department |
| Project | Official ICON Techfest Website |
| Prepared by | ICON Organising Committee (Student Admin / Web Team) |
| Date | _______________ |
| Intended audience | IT Department, KJSIM / Somaiya Vidyavihar University |

---

## 1. Introduction

This document requests hosting support from the college IT Department for the **official ICON techfest website**.

The website will be used for fest information, event details, **online registration**, confirmation communication, and limited organising-team admin functions.

During discussion, it was indicated that IT may be able to provide hosting on a **college server (Linux / Windows)**, **AWS**, and related services such as **Nginx**. This document explains the system briefly and lists the support needed so IT can advise the most suitable setup under college policy.

---

## 2. Purpose of the website

The website is planned to:

- Publish ICON information, theme, schedule, and event details  
- Accept **online participant registrations**  
- Store registration data in a database  
- Send **confirmation emails** (including QR pass where applicable)  
- Provide a limited **admin panel** for the organising team  

This will help run registrations in a structured way and reduce manual form handling.

---

## 3. System overview

The application is a **full-stack website** (not a static HTML-only site).

| Component | Details |
|-----------|---------|
| Framework | Next.js (React-based) |
| Runtime | Node.js (recommended LTS: **20.x or 22.x**) |
| Database | MongoDB (MongoDB Atlas planned; college-hosted MongoDB can be used if preferred) |
| Email | Transactional email via approved API (**Resend**) **or** college SMTP |
| Reverse proxy | Nginx (preferred) for HTTPS and routing to the application |
| Application port | Internal port **3000** (not exposed publicly; public access via 80/443) |

### Request flow

```text
Internet users
    → College subdomain (HTTPS)
    → Nginx
    → Node.js / Next.js application
    → Database + Email service
```

Because registration and email are included, the site needs:

- A continuously running application process  
- Database connectivity  
- Controlled outbound access for email (if an external email service is used)

---

## 4. Hosting support requested

The following support is requested, subject to IT feasibility and policy.

### 4.1 Server / platform
- Production hosting environment for the ICON website  
- Preference: **Linux server** (Ubuntu LTS or equivalent), or **AWS** under the college account  
- Suggested planning size: **2 vCPU**, **2–4 GB RAM**, **20–40 GB disk**

### 4.2 Web gateway
- Nginx (or equivalent reverse proxy)  
- HTTPS enabled  
- HTTP redirected to HTTPS  

### 4.3 Domain and SSL
- Preferred subdomain: **`icon.somaiya.edu`** (short, official, easy for marketing/posters)  
- Fallback (if university DNS cannot allot the above): `icon.kjsim.somaiya.edu` or any subdomain allotted by IT  
- Valid SSL/TLS certificate and clarity on renewal ownership  

### 4.4 Network access
- Public inbound access on ports **80** and **443**  
- Restricted administrative access (SSH or IT-approved deploy method)  
- Outbound HTTPS access as required for:  
  - Database (if MongoDB Atlas is used)  
  - Email service (if external email API is used)  

### 4.5 Database options (IT to advise preferred option)
- **Option A:** MongoDB Atlas, if outbound access is permitted  
- **Option B:** College-managed MongoDB instance  

### 4.6 Email options (IT to advise preferred option)
- **Option A:** College SMTP / institutional mailbox for ICON emails  
- **Option B:** Approved external transactional email API with outbound HTTPS  

The student team will adapt the application to the option approved by IT.

### 4.7 Uptime / process management
- Application configured as a background service (for example systemd or an IT-approved process manager)  
- Auto-start after server reboot  

### 4.8 Deployment process
Clarity is requested on the approved update method, such as:
- Limited SSH access for the student technical team, or  
- Deployment through IT after release submission, or  
- Any other process preferred by the department  

---

## 5. Responsibility split

### ICON Student Web Team
- Develop and maintain the application  
- Provide deployment steps and configuration requirements  
- Configure environment variables as per IT guidance  
- Test pages, registration, and email after hosting is ready  
- Manage content updates before the fest  
- Follow IT security and data-handling instructions  

### IT Department (requested support)
- Advise and/or provision the approved hosting option  
- Arrange DNS and SSL for the allotted subdomain  
- Configure required firewall / proxy rules  
- Advise on database and email approach  
- Confirm the approved deployment and support process  

---

## 6. Data and security

Registration may collect basic participant details such as:

- Name  
- Email  
- Phone number  
- College / institute  
- Selected events  

IT guidance is requested on:

- Applicable college data / privacy requirements  
- Suggested retention or deletion practice after the fest  
- Any security review or approval steps required before go-live  

---

## 7. Acceptance criteria

Hosting may be treated as complete when:

1. Website opens on the allotted HTTPS domain  
2. Information and event pages load correctly  
3. Registration works and data is stored successfully  
4. Confirmation email works as configured  
5. Application service recovers after reboot (as configured)  
6. Contact process for downtime is clear to both teams  

---

## 8. Points for IT confirmation

1. Feasibility of hosting a Node.js (Next.js) application behind Nginx / AWS  
2. Preferred platform: on-prem Linux, Windows, or AWS  
3. Subdomain that can be allotted  
4. SSL certificate process and ownership  
5. Whether outbound HTTPS to database/email services is allowed  
6. Preferred database approach (Atlas vs college MongoDB)  
7. Preferred email approach (college SMTP vs approved external API)  
8. Access model for deployment and updates  
9. Required forms, approvals, or security checks before go-live  
10. Approximate timeline after approval  

---

## 9. Next step

Once IT advises the approved hosting option and subdomain, the student web team will proceed with deployment preparation and share any additional technical files requested (for example sample Nginx config, service unit, or deployment steps).

---

## 10. Student team contacts

| Role | Name | Mobile | Email |
|------|------|--------|-------|
| Student Admin / Coordinator | | | |
| Web Technical Lead | | | |
| Faculty Mentor (if applicable) | | | |

**IT Single Point of Contact:** ______________________________  

---

## Appendix (available on request)

- Technical architecture one-pager  
- Sample deployment steps  
- Registration data-field list  
- Sample Nginx / service configuration  

---

*Final hosting design, access rights, and security controls will be as decided by the IT Department.*
