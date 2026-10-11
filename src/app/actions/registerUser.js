'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { rateLimit } from '@/lib/rateLimit';
import {
  getEvents,
  getSiteConfig,
  getPayableAmount,
  getPaymentQrForAmount,
  DEFAULT_EDITION,
} from '@/lib/content';
import { uploadImage } from '@/lib/cloudinary';

const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  college: z.string().trim().min(2, 'Please enter your college name').max(200),
  department: z.string().trim().max(200).optional().or(z.literal('')),
  eventSlug: z.string().trim().min(1, 'Please choose an event to register for'),
  paymentTxnId: z.string().trim().max(80).optional().or(z.literal('')),
});

let indexesReady = false;

async function ensureRegistrationIndexes() {
  if (indexesReady) return;
  try {
    const col = Registration.collection;
    // Legacy: one email → one registration (blocks multi-event)
    try {
      await col.dropIndex('email_1');
    } catch {
      /* index may not exist */
    }
    await col.updateMany(
      {
        $or: [
          { eventSlug: { $exists: false } },
          { eventSlug: null },
          { eventSlug: '' },
        ],
        'events.0': { $exists: true },
      },
      [{ $set: { eventSlug: { $arrayElemAt: ['$events', 0] } } }]
    );
    await Registration.syncIndexes();
    indexesReady = true;
  } catch (err) {
    console.error('ensureRegistrationIndexes:', err.message);
  }
}

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

export async function getRegistrationBootstrap() {
  const [events, siteConfig] = await Promise.all([
    getEvents({ activeOnly: true, registrationOpenOnly: true }),
    getSiteConfig(),
  ]);
  return {
    success: true,
    events,
    siteConfig: {
      name: siteConfig.name,
      theme: siteConfig.theme,
      slogan: siteConfig.slogan,
      tagline: siteConfig.tagline,
      registrationOpen: siteConfig.registrationOpen !== false,
      countdownTarget: siteConfig.countdownTarget,
      eventDates: siteConfig.eventDates,
      venue: siteConfig.venue,
      paymentQrs: siteConfig.paymentQrs || [],
    },
  };
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

    const siteConfig = await getSiteConfig();
    if (siteConfig.registrationOpen === false) {
      return { success: false, message: 'Registrations are currently closed.' };
    }

    // Prefer single eventSlug; ignore multi-select leftovers
    const eventSlug = String(
      formData.get('eventSlug') || formData.get('events') || ''
    ).trim();
    const rawMobile = String(formData.get('mobile') || formData.get('phone') || '').replace(
      /\D/g,
      ''
    );
    const mobile = rawMobile.length > 10 ? rawMobile.slice(-10) : rawMobile;
    const paymentTxnId = String(formData.get('paymentTxnId') || '')
      .trim()
      .toUpperCase();

    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobile,
      college: formData.get('college'),
      department: formData.get('department') || '',
      eventSlug,
      paymentTxnId,
    };

    const validatedData = registrationSchema.parse(rawData);

    const catalog = await getEvents({ activeOnly: true, registrationOpenOnly: true });
    const event = catalog.find((e) => e.slug === validatedData.eventSlug);
    if (!event) {
      return {
        success: false,
        message: 'This event is not open for registration.',
      };
    }

    const payableAmount = getPayableAmount(catalog, [validatedData.eventSlug]);
    const qrTier = getPaymentQrForAmount(siteConfig, payableAmount);
    if (payableAmount > 0 && (!qrTier || !qrTier.qrImageUrl)) {
      return {
        success: false,
        message: `No payment QR is configured for ₹${payableAmount}. Please contact the organisers.`,
      };
    }

    if (payableAmount > 0 && (!paymentTxnId || paymentTxnId.length < 4)) {
      return {
        success: false,
        message: 'Enter the payment transaction / UTR ID.',
      };
    }

    const screenshot = formData.get('paymentScreenshot');
    let paymentScreenshotUrl = '';
    if (payableAmount > 0) {
      if (!screenshot || typeof screenshot !== 'object' || !screenshot.size) {
        return { success: false, message: 'Please upload a payment screenshot.' };
      }
      const uploaded = await uploadImage(screenshot, {
        folder: 'icon-kjsim/payment-proofs',
      });
      if (uploaded.error) return { success: false, message: uploaded.error };
      paymentScreenshotUrl = uploaded.url;
    }

    await connectDB();
    await ensureRegistrationIndexes();

    const edition = siteConfig.edition || DEFAULT_EDITION;
    const existing = await Registration.findOne({
      email: validatedData.email,
      eventSlug: validatedData.eventSlug,
      edition,
    });
    if (existing) {
      return {
        success: false,
        duplicate: true,
        message: `You are already registered for ${event.name}.`,
        existingQrCode: existing.qrCode,
        eventName: event.name,
      };
    }

    if (paymentTxnId) {
      const txnDup = await Registration.findOne({ paymentTxnId });
      if (txnDup) {
        return {
          success: false,
          message:
            'This transaction / UTR ID was already used. Contact organisers if this is a mistake.',
        };
      }
    }

    const qrCode = nextQrCode();

    const newRegistration = await Registration.create({
      name: validatedData.name,
      email: validatedData.email,
      mobile: validatedData.mobile,
      college: validatedData.college,
      department: validatedData.department || '',
      eventSlug: validatedData.eventSlug,
      events: [validatedData.eventSlug],
      qrCode,
      edition,
      payableAmount,
      paymentScreenshotUrl,
      paymentTxnId: payableAmount > 0 ? paymentTxnId : '',
      paymentStatus: payableAmount > 0 ? 'pending' : 'not_required',
      confirmationSent: false,
    });

    return {
      success: true,
      message:
        payableAmount > 0
          ? `Registration for ${event.name} received. Payment is under verification — you will get a confirmation email after approval.`
          : `Registered for ${event.name} successfully!`,
      registrationId: newRegistration._id.toString(),
      qrCode: newRegistration.qrCode,
      paymentStatus: newRegistration.paymentStatus,
      payableAmount,
      eventSlug: validatedData.eventSlug,
      eventName: event.name,
      emailStatus: 'pending_verification',
    };
  } catch (error) {
    console.error('Registration Submission Error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, errors: zodFieldErrors(error) };
    }

    if (error?.code === 11000) {
      const keys = Object.keys(error.keyPattern || {});
      if (keys.includes('paymentTxnId')) {
        return {
          success: false,
          message: 'This transaction / UTR ID was already used.',
        };
      }
      if (keys.includes('eventSlug') || keys.includes('email')) {
        return {
          success: false,
          duplicate: true,
          message: 'You are already registered for this event.',
        };
      }
      return {
        success: false,
        duplicate: true,
        message: 'You are already registered for this event.',
      };
    }

    return {
      success: false,
      message: error.message || 'Registration failed. Please try again later.',
    };
  }
}
