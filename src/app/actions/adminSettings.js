'use server';

import connectDB from '@/lib/mongodb';
import SiteConfig from '@/models/SiteConfig';
import { verifyAdmin } from '@/lib/adminAuth';
import { getSiteConfig, DEFAULT_EDITION } from '@/lib/content';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function getAdminSiteConfig() {
  await verifyAdmin();
  try {
    const config = await getSiteConfig();
    return { success: true, config };
  } catch (err) {
    console.error('getAdminSiteConfig:', err);
    return { success: false, message: 'Failed to load settings', config: null };
  }
}

export async function saveSiteConfig(formData) {
  await verifyAdmin();
  await connectDB();

  try {
    const paymentQrsRaw = String(formData.get('paymentQrsJson') || '[]');
    let paymentQrs = [];
    try {
      paymentQrs = JSON.parse(paymentQrsRaw);
      if (!Array.isArray(paymentQrs)) paymentQrs = [];
    } catch {
      return { success: false, message: 'Invalid payment QR JSON' };
    }

    // Optional per-tier file uploads: qrFile_149, qrFile_299, ...
    for (const tier of paymentQrs) {
      const key = `qrFile_${tier.amount}`;
      const file = formData.get(key);
      if (file && typeof file === 'object' && file.size > 0) {
        const uploaded = await uploadImage(file, { folder: 'icon-kjsim/payment-qrs' });
        if (uploaded.error) return { success: false, message: uploaded.error };
        tier.qrImageUrl = uploaded.url;
      }
    }

    const payload = {
      key: 'default',
      edition: String(formData.get('edition') || DEFAULT_EDITION),
      name: String(formData.get('name') || 'ICON'),
      theme: String(formData.get('theme') || ''),
      slogan: String(formData.get('slogan') || ''),
      tagline: String(formData.get('tagline') || ''),
      description: String(formData.get('description') || ''),
      institution: String(formData.get('institution') || ''),
      university: String(formData.get('university') || ''),
      eventDates: {
        start: String(formData.get('eventStart') || ''),
        end: String(formData.get('eventEnd') || ''),
      },
      countdownTarget: String(formData.get('countdownTarget') || ''),
      venue: {
        name: String(formData.get('venueName') || ''),
        address: String(formData.get('venueAddress') || ''),
        mapsQuery: String(formData.get('mapsQuery') || ''),
        mapsEmbed: String(formData.get('mapsEmbed') || ''),
      },
      email: String(formData.get('email') || ''),
      registrationOpen:
        formData.get('registrationOpen') === 'on' ||
        formData.get('registrationOpen') === 'true',
      paymentQrs: paymentQrs.map((q) => ({
        amount: Number(q.amount) || 0,
        label: String(q.label || `₹${q.amount}`),
        qrImageUrl: String(q.qrImageUrl || ''),
        payUrl: String(q.payUrl || ''),
      })),
    };

    await SiteConfig.findOneAndUpdate({ key: 'default' }, payload, {
      upsert: true,
      new: true,
    });

    revalidatePath('/');
    revalidatePath('/register');
    revalidatePath('/events');
    return { success: true, message: 'Settings saved' };
  } catch (err) {
    console.error('saveSiteConfig:', err);
    return { success: false, message: err.message || 'Failed to save settings' };
  }
}
