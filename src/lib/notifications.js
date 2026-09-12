import { Resend } from 'resend';
import QRCode from 'qrcode';
import twilio from 'twilio';
import { generateICS } from './ics';
import { SITE_CONFIG } from './data';
import connectDB from './mongodb';
import NotificationLog from '@/models/NotificationLog';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === 'true';
const SMS_ENABLED = process.env.SMS_ENABLED === 'true';

function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function eventWindow() {
  const start = new Date(SITE_CONFIG.countdownTarget);
  const end = new Date(SITE_CONFIG.eventDates.end + 'T18:00:00+05:30');
  return { start, end };
}

async function logNotification(entry) {
  try {
    await connectDB();
    await NotificationLog.create(entry);
  } catch (e) {
    console.error('NotificationLog write failed:', e.message);
  }
}

export async function generateQrPngBase64(qrCode) {
  const qrDataUrl = await QRCode.toDataURL(qrCode, {
    width: 300,
    margin: 2,
    color: { dark: '#b71c1c', light: '#ffffff' },
  });
  return qrDataUrl.split(',')[1];
}

/**
 * Registration confirmation email (+ optional SMS / WhatsApp).
 */
export async function sendRegistrationEmail(registration) {
  const { start, end } = eventWindow();
  const venueLine =
    typeof SITE_CONFIG.venue === 'string'
      ? SITE_CONFIG.venue
      : `${SITE_CONFIG.venue.name}, ${SITE_CONFIG.venue.address}`;

  const qrBase64 = await generateQrPngBase64(registration.qrCode);
  const icsContent = generateICS({
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.theme}`,
    description: `Your registration is confirmed! QR: ${registration.qrCode}. Present it at the entrance.`,
    location: venueLine,
    startDate: start,
    endDate: end,
  });
  const icsBase64 = Buffer.from(icsContent).toString('base64');

  const subject = `You're registered for ${SITE_CONFIG.name}!`;
  const eventList = (registration.events || []).join(', ');
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #b71c1c; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SITE_CONFIG.name}</h1>
        <p style="color: #ffcdd2; margin: 8px 0 0;">${SITE_CONFIG.theme}</p>
      </div>
      <div style="padding: 20px; border: 1px solid #eaeaea;">
        <h2>You're In!</h2>
        <p>Hi ${registration.name},</p>
        <p>Your registration for ${SITE_CONFIG.name} is confirmed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #b71c1c;">Registration ID</h3>
          <p style="font-family: monospace; font-size: 1.2rem; margin-bottom: 0;">${registration.qrCode}</p>
        </div>
        <p><strong>Events:</strong> ${eventList || 'See website'}</p>
        <p>Your <strong>QR Pass</strong> and <strong>Calendar Invite</strong> are attached. Show the QR at venue check-in.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 0.85rem; color: #666;">
          <strong>Venue:</strong> ${venueLine}<br/>
          <strong>Dates:</strong> ${SITE_CONFIG.eventDates.start} to ${SITE_CONFIG.eventDates.end}<br/>
          <strong>Contact:</strong> ${SITE_CONFIG.email}
        </p>
      </div>
    </div>
  `;

  let emailOk = false;
  let emailStatus = 'not_configured';
  let emailError = null;
  let whatsappSent = false;
  let smsSent = false;

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ICON KJSIM <onboarding@resend.dev>',
        to: [registration.email],
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
        subject,
        html: htmlBody,
        attachments: [
          {
            filename: `ICON2026-Pass-${registration.qrCode}.png`,
            content: qrBase64,
          },
          {
            filename: 'ICON2026-Invite.ics',
            content: icsBase64,
            contentType: 'text/calendar',
          },
        ],
      });

      if (error) {
        emailStatus = 'failed';
        emailError = error.message || JSON.stringify(error);
        await logNotification({
          type: 'email',
          recipient: registration.email,
          subject,
          content: 'registration_confirmation',
          status: 'failed',
          registrationId: registration._id,
          error: emailError,
        });
        console.error('Resend API error:', error);
      } else {
        emailOk = true;
        emailStatus = 'sent';
        await logNotification({
          type: 'email',
          recipient: registration.email,
          subject,
          content: 'registration_confirmation',
          status: 'sent',
          registrationId: registration._id,
          isBroadcast: false,
        });
        console.log('Email sent via Resend to', registration.email, 'id:', data?.id);
      }
    } catch (error) {
      emailStatus = 'failed';
      emailError = error.message;
      await logNotification({
        type: 'email',
        recipient: registration.email,
        subject,
        content: 'registration_confirmation',
        status: 'failed',
        registrationId: registration._id,
        error: error.message,
      });
      console.error('Failed to send registration email:', error);
    }
  } else {
    emailStatus = 'not_configured';
    emailError = 'RESEND_API_KEY is missing in .env — email was NOT delivered';
    console.warn('\n⚠️  [EMAIL NOT CONFIGURED] Would have sent to:', registration.email);
    console.warn('   Add RESEND_API_KEY to .env (see docs/EMAIL_SMS_SETUP.md)\n');
    await logNotification({
      type: 'email',
      recipient: registration.email,
      subject,
      content: 'registration_confirmation_skipped',
      status: 'skipped',
      registrationId: registration._id,
      error: emailError,
    });
  }

  // Optional SMS (Twilio trial: verified numbers only)
  if (SMS_ENABLED && registration.mobile) {
    const sms = await sendSms(
      registration.mobile,
      `ICON 2026 confirmed! ID ${registration.qrCode}. Venue: KJSIM. Keep your QR ready.`,
      registration._id
    );
    smsSent = sms.ok;
    if (!sms.ok) console.warn('SMS skipped/failed:', sms.reason);
  }

  if (WHATSAPP_ENABLED && registration.mobile) {
    const wa = await sendWhatsApp(
      registration.mobile,
      `🎉 *ICON 2026 Registration Confirmed!*\nID: ${registration.qrCode}\nShow your QR at entry.`,
      registration._id
    );
    whatsappSent = wa.ok;
  }

  return { success: emailOk, emailStatus, emailError, whatsappSent, smsSent };
}

export async function sendSms(mobile, message, registrationId = null, isBroadcast = false) {
  const client = getTwilioClient();
  const to = mobile.startsWith('+') ? mobile : `+91${mobile}`;

  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    await logNotification({
      type: 'sms',
      recipient: to,
      content: message,
      status: 'skipped',
      registrationId,
      isBroadcast,
      error: 'Twilio not configured (trial SMS only reaches verified numbers)',
    });
    return { ok: false, reason: 'not_configured' };
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    await logNotification({
      type: 'sms',
      recipient: to,
      content: message,
      status: 'sent',
      registrationId,
      isBroadcast,
    });
    return { ok: true };
  } catch (error) {
    await logNotification({
      type: 'sms',
      recipient: to,
      content: message,
      status: 'failed',
      registrationId,
      isBroadcast,
      error: error.message,
    });
    return { ok: false, reason: error.message };
  }
}

export async function sendWhatsApp(mobile, message, registrationId = null, isBroadcast = false) {
  if (!WHATSAPP_ENABLED) {
    return { ok: false, reason: 'disabled' };
  }

  const client = getTwilioClient();
  const to = `whatsapp:+91${String(mobile).replace(/\D/g, '').slice(-10)}`;
  const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (!client) {
    await logNotification({
      type: 'whatsapp',
      recipient: to,
      content: message,
      status: 'skipped',
      registrationId,
      isBroadcast,
      error: 'Twilio not configured — use sandbox for demo',
    });
    return { ok: false, reason: 'not_configured' };
  }

  try {
    await client.messages.create({ body: message, from, to });
    await logNotification({
      type: 'whatsapp',
      recipient: to,
      content: message,
      status: 'sent',
      registrationId,
      isBroadcast,
    });
    return { ok: true };
  } catch (error) {
    await logNotification({
      type: 'whatsapp',
      recipient: to,
      content: message,
      status: 'failed',
      registrationId,
      isBroadcast,
      error: error.message,
    });
    return { ok: false, reason: error.message };
  }
}

export async function sendBroadcastEmail({ subject, message, recipients }) {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    if (!resend) {
      console.log('📩 [BROADCAST MOCK]', recipient.email, subject);
      sent += 1;
      await logNotification({
        type: 'email',
        recipient: recipient.email,
        subject,
        content: message,
        status: 'sent',
        registrationId: recipient._id,
        isBroadcast: true,
      });
      continue;
    }

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ICON KJSIM <onboarding@resend.dev>',
        to: recipient.email,
        subject,
        html: `<div style="font-family:sans-serif;padding:16px"><p>Hi ${recipient.name},</p><p>${message.replace(/\n/g, '<br/>')}</p><p>— Team ICON</p></div>`,
      });
      sent += 1;
      await logNotification({
        type: 'email',
        recipient: recipient.email,
        subject,
        content: message,
        status: 'sent',
        registrationId: recipient._id,
        isBroadcast: true,
      });
    } catch (error) {
      failed += 1;
      await logNotification({
        type: 'email',
        recipient: recipient.email,
        subject,
        content: message,
        status: 'failed',
        registrationId: recipient._id,
        isBroadcast: true,
        error: error.message,
      });
    }
  }

  return { sent, failed };
}

/**
 * Sends due reminders based on days until event start.
 * Types: 7-day, 3-day, 1-day. Marks reminderSent on registration.
 */
export async function processReminders() {
  await connectDB();
  const Registration = (await import('@/models/Registration')).default;
  const start = new Date(SITE_CONFIG.countdownTarget);
  const now = new Date();
  const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

  const pending = await Registration.find({
    reminderSent: false,
    confirmationSent: true,
  }).limit(200);

  let sent = 0;
  for (const reg of pending) {
    let subject = '';
    let body = '';

    if (daysUntil === 7) {
      subject = 'ICON 2026 is in 7 days';
      body = `Hi ${reg.name}, ICON 2026 starts in one week. Keep QR ${reg.qrCode} ready.`;
    } else if (daysUntil === 3) {
      subject = 'ICON 2026 is in 3 days';
      body = `Hi ${reg.name}, ICON 2026 is in 3 days. Venue: KJSIM. QR: ${reg.qrCode}`;
      if (SMS_ENABLED) await sendSms(reg.mobile, body, reg._id);
    } else if (daysUntil === 1) {
      subject = 'ICON 2026 is TOMORROW';
      body = `Hi ${reg.name}, ICON 2026 is tomorrow! Gates ~9 AM. QR: ${reg.qrCode}`;
      if (WHATSAPP_ENABLED) await sendWhatsApp(reg.mobile, body, reg._id);
    } else if (daysUntil === 0) {
      subject = 'See you today at ICON 2026';
      body = `Hi ${reg.name}, ICON 2026 is today! Show QR ${reg.qrCode} at entry.`;
      if (SMS_ENABLED) await sendSms(reg.mobile, body, reg._id);
    } else {
      continue;
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'ICON KJSIM <onboarding@resend.dev>',
          to: reg.email,
          subject,
          html: `<p>${body}</p>`,
        });
      } catch (e) {
        console.error('Reminder email failed', reg.email, e.message);
        continue;
      }
    }

    reg.reminderSent = true;
    await reg.save();
    sent += 1;
    await logNotification({
      type: 'email',
      recipient: reg.email,
      subject,
      content: body,
      status: 'sent',
      registrationId: reg._id,
    });
  }

  return { daysUntil, processed: pending.length, sent };
}
