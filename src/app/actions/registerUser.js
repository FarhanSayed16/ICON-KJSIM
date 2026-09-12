'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { rateLimit } from '@/lib/rateLimit';
import { sendRegistrationEmail } from '@/lib/notifications';

const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  college: z.string().trim().min(2, 'Please enter your college name').max(200),
  department: z.string().trim().max(200).optional().or(z.literal('')),
  events: z.array(z.string()).min(1, 'Please select at least one event'),
});

function zodFieldErrors(error) {
  const fieldErrors = {};
  const issues = error.issues || error.errors || [];
  issues.forEach((err) => {
    const key = err.path?.[0] ?? 'form';
    if (!fieldErrors[key]) fieldErrors[key] = err.message;
  });
  return fieldErrors;
}

function nextQrCode() {
  const seq = Date.now().toString().slice(-5);
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ICON2026-REG-${seq}${rand}`;
}

export async function registerUser(prevState, formData) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      hdrs.get('x-real-ip') ||
      'unknown';

    const limited = rateLimit(`register:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!limited.ok) {
      return {
        success: false,
        message: 'Too many registration attempts. Please try again later.',
      };
    }

    const events = formData.getAll('events').filter(Boolean);
    const rawMobile = String(formData.get('mobile') || formData.get('phone') || '').replace(
      /\D/g,
      ''
    );
    const mobile = rawMobile.length > 10 ? rawMobile.slice(-10) : rawMobile;

    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobile,
      college: formData.get('college'),
      department: formData.get('department') || '',
      events,
    };

    const validatedData = registrationSchema.parse(rawData);

    await connectDB();

    const existing = await Registration.findOne({ email: validatedData.email });
    if (existing) {
      return {
        success: false,
        duplicate: true,
        message: 'This email is already registered for ICON 2026.',
        existingQrCode: existing.qrCode,
      };
    }

    const qrCode = nextQrCode();

    const newRegistration = await Registration.create({
      ...validatedData,
      qrCode,
    });

    // Send confirmation (await so flags update; failures are logged, not fatal)
    let emailStatus = 'not_configured';
    let emailError = null;
    try {
      const emailResult = await sendRegistrationEmail(newRegistration);
      emailStatus = emailResult?.emailStatus || (emailResult?.success ? 'sent' : 'failed');
      emailError = emailResult?.emailError || null;
      if (emailResult?.emailStatus === 'sent') {
        newRegistration.confirmationSent = true;
        if (emailResult.whatsappSent) newRegistration.whatsappSent = true;
        await newRegistration.save();
      }
    } catch (e) {
      console.error('Background email failed:', e);
      emailStatus = 'failed';
      emailError = e.message;
    }

    const message =
      emailStatus === 'sent'
        ? 'Registration successful! Check your email for your QR pass.'
        : emailStatus === 'not_configured'
          ? 'Registration saved, but email is not configured yet (missing RESEND_API_KEY).'
          : 'Registration saved, but confirmation email failed to send. Contact organizers with your Registration ID.';

    return {
      success: true,
      message,
      registrationId: newRegistration._id.toString(),
      qrCode: newRegistration.qrCode,
      emailStatus,
      emailError,
    };
  } catch (error) {
    console.error('Registration Submission Error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, errors: zodFieldErrors(error) };
    }

    if (error?.code === 11000) {
      return {
        success: false,
        duplicate: true,
        message: 'This email is already registered for ICON 2026.',
      };
    }

    return {
      success: false,
      message: error.message || 'Registration failed. Please try again later.',
    };
  }
}
