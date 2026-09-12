'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { sendBroadcastEmail, processReminders, sendSms } from '@/lib/notifications';

async function verifyAdmin() {
  const token = (await cookies()).get('icon_admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secret);
  return true;
}

export async function broadcastNotification({
  channel = 'email',
  subject,
  message,
  targetEvent = 'all',
}) {
  await verifyAdmin();

  if (!message?.trim()) {
    return { success: false, message: 'Message is required' };
  }
  if (channel === 'email' && !subject?.trim()) {
    return { success: false, message: 'Subject is required for email' };
  }

  await connectDB();
  const query = {};
  if (targetEvent && targetEvent !== 'all') {
    query.events = targetEvent;
  }

  const recipients = await Registration.find(query).select('name email mobile _id').lean();

  if (!recipients.length) {
    return { success: false, message: 'No recipients matched the filter' };
  }

  let sent = 0;
  let failed = 0;

  if (channel === 'email') {
    const result = await sendBroadcastEmail({
      subject: subject.trim(),
      message: message.trim(),
      recipients,
    });
    sent = result.sent;
    failed = result.failed;
  } else if (channel === 'sms') {
    for (const r of recipients) {
      const res = await sendSms(r.mobile, message.trim(), r._id, true);
      if (res.ok) sent += 1;
      else failed += 1;
    }
  } else {
    return { success: false, message: 'Unsupported channel' };
  }

  return {
    success: true,
    message: `Broadcast complete: ${sent} sent, ${failed} failed`,
    data: { sent, failed, total: recipients.length },
  };
}

export async function sendRemindersNow() {
  await verifyAdmin();
  const result = await processReminders();
  return {
    success: true,
    message: `Reminders: ${result.sent} sent (day offset ${result.daysUntil})`,
    data: result,
  };
}
