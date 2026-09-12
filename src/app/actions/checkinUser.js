'use server';

import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

/**
 * Checks in a user via their QR code string
 */
export async function checkinUser(qrCode, volunteerName = '') {
  if (!qrCode || typeof qrCode !== 'string') {
    return { success: false, status: 'invalid', message: 'Invalid QR code format' };
  }

  try {
    await connectDB();

    const registration = await Registration.findOne({ qrCode: qrCode.trim() });

    if (!registration) {
      return { success: false, status: 'invalid', message: 'Registration not found' };
    }

    if (registration.checkedIn) {
      return {
        success: false,
        status: 'already',
        message: 'Already checked in',
        timestamp: registration.checkedInAt,
      };
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    if (volunteerName) registration.checkedInBy = String(volunteerName).slice(0, 80);

    await registration.save();

    return {
      success: true,
      status: 'success',
      message: 'Check-in successful',
      data: {
        name: registration.name,
        events: registration.events,
      },
    };
  } catch (error) {
    console.error('Check-in error:', error);
    return { success: false, status: 'error', message: 'An unexpected error occurred' };
  }
}

/**
 * Validates volunteer PIN for /checkin access.
 */
export async function verifyCheckinPin(pin) {
  const expected = process.env.CHECKIN_PIN || process.env.ADMIN_PASSWORD;
  if (!expected) {
    // If no PIN configured, allow access (dev convenience) but warn
    return { success: true, warning: 'CHECKIN_PIN not set — open access' };
  }
  if (!pin || String(pin) !== String(expected)) {
    return { success: false, message: 'Invalid volunteer PIN' };
  }
  return { success: true };
}
