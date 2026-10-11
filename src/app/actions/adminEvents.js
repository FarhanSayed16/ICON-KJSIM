'use server';

import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyAdmin } from '@/lib/adminAuth';
import { serializeEvent, DEFAULT_EDITION } from '@/lib/content';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function listAdminEvents(edition = DEFAULT_EDITION) {
  await verifyAdmin();
  await connectDB();
  const rows = await Event.find({ edition }).sort({ sortOrder: 1, name: 1 }).lean();
  return { success: true, events: rows.map(serializeEvent) };
}

export async function saveEvent(formData) {
  await verifyAdmin();
  await connectDB();

  try {
    const id = formData.get('id') || '';
    const name = String(formData.get('name') || '').trim();
    let slug = String(formData.get('slug') || '').trim() || slugify(name);
    slug = slugify(slug);
    const edition = String(formData.get('edition') || DEFAULT_EDITION);

    if (!name || !slug) {
      return { success: false, message: 'Name and slug are required.' };
    }

    const payload = {
      name,
      slug,
      edition,
      category: formData.get('category') || 'technical',
      shortDesc: String(formData.get('shortDesc') || ''),
      description: String(formData.get('description') || ''),
      date: String(formData.get('date') || ''),
      time: String(formData.get('time') || ''),
      venue: String(formData.get('venue') || ''),
      registrationFee: Number(formData.get('registrationFee') || 0),
      prizePool: Number(formData.get('prizePool') || 0),
      teamSize: String(formData.get('teamSize') || 'Solo'),
      maxParticipants: formData.get('maxParticipants')
        ? Number(formData.get('maxParticipants'))
        : null,
      posterImage: String(formData.get('posterImage') || ''),
      rules: String(formData.get('rules') || '')
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      poc: {
        name: String(formData.get('pocName') || ''),
        phone: String(formData.get('pocPhone') || ''),
        email: String(formData.get('pocEmail') || ''),
      },
      isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
      isRegistrationOpen:
        formData.get('isRegistrationOpen') === 'on' ||
        formData.get('isRegistrationOpen') === 'true',
      sortOrder: Number(formData.get('sortOrder') || 0),
    };

    const posterFile = formData.get('posterFile');
    if (posterFile && typeof posterFile === 'object' && posterFile.size > 0) {
      const uploaded = await uploadImage(posterFile, { folder: 'icon-kjsim/events' });
      if (uploaded.error) return { success: false, message: uploaded.error };
      payload.posterImage = uploaded.url;
    }

    const existing = await Event.findOne({
      edition,
      slug,
      ...(id ? { _id: { $ne: id } } : {}),
    });
    if (existing) {
      return { success: false, message: 'Another event already uses this slug.' };
    }

    let doc;
    if (id) {
      doc = await Event.findByIdAndUpdate(id, payload, { new: true });
      if (!doc) return { success: false, message: 'Event not found.' };
    } else {
      doc = await Event.create(payload);
    }

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/register');
    return { success: true, event: serializeEvent(doc) };
  } catch (err) {
    console.error('saveEvent:', err);
    return { success: false, message: err.message || 'Failed to save event' };
  }
}

export async function deleteEvent(id) {
  await verifyAdmin();
  await connectDB();
  if (!id) return { success: false, message: 'Missing id' };
  await Event.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/register');
  return { success: true };
}

export async function toggleEventFlag(id, field, value) {
  await verifyAdmin();
  await connectDB();
  if (!['isActive', 'isRegistrationOpen'].includes(field)) {
    return { success: false, message: 'Invalid field' };
  }
  const doc = await Event.findByIdAndUpdate(id, { [field]: !!value }, { new: true });
  if (!doc) return { success: false, message: 'Event not found' };
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/register');
  return { success: true, event: serializeEvent(doc) };
}
