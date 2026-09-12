'use server';

import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ContactMsg from '@/models/ContactMsg';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

const brochureSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
});

/**
 * Brochure / newsletter signup — stored as a ContactMsg with tagged message.
 */
export async function submitBrochure(prevState, formData) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      hdrs.get('x-real-ip') ||
      'unknown';
    const limited = rateLimit(`brochure:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 });
    if (!limited.ok) {
      return { success: false, message: 'Too many requests. Try again later.' };
    }

    const email = brochureSchema.parse({ email: formData.get('email') }).email;

    await connectDB();
    await ContactMsg.create({
      name: 'Brochure Request',
      email,
      message: '[BROCHURE] Please send the ICON 2026 brochure / rulebook.',
    });

    return {
      success: true,
      message: 'Thanks! We will send the brochure to your inbox shortly.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues?.[0]?.message || 'Invalid email';
      return { success: false, message: msg };
    }
    console.error('Brochure error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
