# Email & SMS Setup — ICON 2026

Emails only send when **Resend** is configured. SMS/WhatsApp need **Twilio**.

## Why email is not arriving right now

Your `.env` has `EMAIL_FROM` but **no `RESEND_API_KEY`**.  
Without that key, registration still saves to MongoDB, but **no real email is delivered**.

---

## 1) Email via Resend (required for inbox delivery)

### Steps
1. Go to [https://resend.com](https://resend.com) → sign up / log in  
2. **API Keys** → Create API Key → copy `re_...`  
3. Add to `.env` (project root):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM="ICON KJSIM <onboarding@resend.dev>"
EMAIL_REPLY_TO=icon.simsr@somaiya.edu
```

4. **Restart** the dev server (`Ctrl+C`, then `npm run dev`)

### Important Resend limits
| From address | Who can receive? |
|--------------|------------------|
| `onboarding@resend.dev` (default) | **Only the email you used to sign up on Resend** |
| Your verified domain (e.g. `orders@yourdomain.com`) | Any recipient |

If you want confirmation emails to **any** registrant:
1. Resend → **Domains** → Add + verify your domain (DNS records)  
2. Set `EMAIL_FROM="ICON KJSIM <noreply@yourdomain.com>"`

### Test email (recommended)

```bash
node --env-file=.env scripts/send-test-email.js your-inbox@gmail.com
```

- Success → you’ll see `✅ Sent!` and mail arrives  
- Failure → script prints the Resend error (domain / key / recipient restriction)

### Test via registration
1. Open `/register`  
2. Use an email that Resend is allowed to send to  
3. Submit  
4. Watch terminal for: `Email sent via Resend to ...`  
5. Check inbox + spam  

UI toast will also say if email was sent, failed, or not configured.

---

## 2) SMS via Twilio (optional)

```env
SMS_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

**Trial accounts** can only SMS numbers you verify in Twilio Console.

Restart `npm run dev` after editing `.env`.

---

## 3) WhatsApp via Twilio (optional)

```env
WHATSAPP_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Use Twilio WhatsApp Sandbox for demos. Production needs Meta Business approval.

---

## Quick checklist

- [ ] `RESEND_API_KEY` set in `.env`  
- [ ] Dev server restarted after changing env  
- [ ] `node --env-file=.env scripts/send-test-email.js you@email.com` succeeds  
- [ ] For any registrant email: custom domain verified in Resend  
- [ ] SMS only if Twilio env + `SMS_ENABLED=true`  
- [ ] Check spam folder  

## Debug

```bash
node scripts/check-env-keys.js
```

Shows which keys are SET / MISSING / PLACEHOLDER (no secret values printed).
