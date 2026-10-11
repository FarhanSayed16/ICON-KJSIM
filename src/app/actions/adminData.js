'use server';

import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { verifyAdmin } from '@/lib/adminAuth';
import { getEvents } from '@/lib/content';
import { sendRegistrationEmail } from '@/lib/notifications';

function rangeStart(range = 'all') {
  if (range === '7d') return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

export async function getDashboardStats(range = 'all') {
  await verifyAdmin();
  await connectDB();

  try {
    const start = rangeStart(range);
    const match = start ? { createdAt: { $gte: start } } : {};

    const totalRegistrations = await Registration.countDocuments(match);
    const totalCheckedIn = await Registration.countDocuments({
      ...match,
      checkedIn: true,
    });

    const eventCounts = await Registration.aggregate([
      ...(start ? [{ $match: match }] : []),
      { $unwind: '$events' },
      { $group: { _id: '$events', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const allEvents = await getEvents({});
    const eventsMap = allEvents.reduce((acc, evt) => {
      acc[evt.slug] = evt.name;
      return acc;
    }, {});

    const registrationsByEvent = eventCounts.map((item) => ({
      name: eventsMap[item._id] || item._id,
      count: item.count,
    }));

    const collegeCounts = await Registration.aggregate([
      ...(start ? [{ $match: match }] : []),
      { $group: { _id: '$college', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 5 },
    ]);

    const collegeDistribution = collegeCounts.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    const byDate = await Registration.aggregate([
      ...(start ? [{ $match: match }] : []),
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const registrationsByDate = byDate.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    const checkinTimeline = await Registration.aggregate([
      { $match: { checkedIn: true, checkedInAt: { $ne: null } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%H:00', date: '$checkedInAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      success: true,
      data: {
        totalRegistrations,
        totalCheckedIn,
        registrationsByEvent,
        collegeDistribution,
        registrationsByDate,
        checkinTimeline: checkinTimeline.map((t) => ({
          time: t._id,
          count: t.count,
        })),
        range,
      },
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { success: false, message: 'Failed to fetch dashboard stats' };
  }
}

export async function getRegistrations(
  page = 1,
  limit = 10,
  search = '',
  event = '',
  paymentStatus = ''
) {
  await verifyAdmin();
  await connectDB();

  try {
    const clauses = [];
    if (search) {
      clauses.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { qrCode: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
          { paymentTxnId: { $regex: search, $options: 'i' } },
        ],
      });
    }
    if (event) {
      // New regs use eventSlug; legacy multi-event regs use events[]
      clauses.push({ $or: [{ eventSlug: event }, { events: event }] });
    }
    if (paymentStatus) {
      clauses.push({ paymentStatus });
    }
    const query = clauses.length ? { $and: clauses } : {};

    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Registration.countDocuments(query),
    ]);

    const serializedRegistrations = registrations.map((reg) => ({
      ...reg,
      _id: reg._id.toString(),
      createdAt: reg.createdAt?.toISOString?.() || null,
      updatedAt: reg.updatedAt?.toISOString?.() || null,
      checkedInAt: reg.checkedInAt ? reg.checkedInAt.toISOString() : null,
      paymentVerifiedAt: reg.paymentVerifiedAt
        ? reg.paymentVerifiedAt.toISOString()
        : null,
      eventSlug: reg.eventSlug || (reg.events || [])[0] || '',
      events: reg.events || [],
      // Back-compat for older docs that stored `phone`
      mobile: reg.mobile || reg.phone || '',
    }));

    return {
      success: true,
      data: {
        registrations: serializedRegistrations,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        totalItems: total,
      },
    };
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return { success: false, message: 'Failed to fetch registrations' };
  }
}

export async function exportRegistrationsCsv(event = '') {
  await verifyAdmin();
  await connectDB();

  const query = event
    ? { $or: [{ eventSlug: event }, { events: event }] }
    : {};
  const rows = await Registration.find(query).sort({ createdAt: -1 }).lean();

  const header = [
    'qrCode',
    'name',
    'email',
    'mobile',
    'college',
    'department',
    'eventSlug',
    'events',
    'payableAmount',
    'paymentStatus',
    'paymentTxnId',
    'paymentScreenshotUrl',
    'checkedIn',
    'checkedInAt',
    'createdAt',
  ];

  const escape = (v) => {
    const s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.qrCode,
        r.name,
        r.email,
        r.mobile || r.phone || '',
        r.college,
        r.department || '',
        r.eventSlug || (r.events || [])[0] || '',
        (r.events || []).join('|'),
        r.payableAmount ?? 0,
        r.paymentStatus || 'pending',
        r.paymentTxnId || '',
        r.paymentScreenshotUrl || '',
        r.checkedIn ? 'yes' : 'no',
        r.checkedInAt ? new Date(r.checkedInAt).toISOString() : '',
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
      ]
        .map(escape)
        .join(',')
    );
  }

  return { success: true, csv: lines.join('\n'), filename: 'icon2026-registrations.csv' };
}

export async function getPaymentStats() {
  await verifyAdmin();
  await connectDB();
  const [pending, verified, rejected] = await Promise.all([
    Registration.countDocuments({ paymentStatus: 'pending' }),
    Registration.countDocuments({ paymentStatus: 'verified' }),
    Registration.countDocuments({ paymentStatus: 'rejected' }),
  ]);
  return { success: true, data: { pending, verified, rejected } };
}

export async function setPaymentStatus(registrationId, status, note = '') {
  await verifyAdmin();
  await connectDB();

  if (!['verified', 'rejected', 'pending'].includes(status)) {
    return { success: false, message: 'Invalid status' };
  }

  const reg = await Registration.findById(registrationId);
  if (!reg) return { success: false, message: 'Registration not found' };

  // Backfill for legacy docs created before eventSlug existed
  if (!reg.eventSlug && reg.events?.[0]) {
    reg.eventSlug = reg.events[0];
  }

  const prev = reg.paymentStatus;
  reg.paymentStatus = status;
  reg.paymentNote = String(note || '').slice(0, 500);
  if (status === 'verified') {
    reg.paymentVerifiedAt = new Date();
    reg.paymentVerifiedBy = 'admin';
  } else {
    reg.paymentVerifiedAt = null;
    reg.paymentVerifiedBy = '';
  }
  await reg.save();

  let emailStatus = 'skipped';
  if (status === 'verified' && prev !== 'verified' && !reg.confirmationSent) {
    try {
      const emailResult = await sendRegistrationEmail(reg);
      if (emailResult?.emailStatus === 'sent' || emailResult?.success) {
        reg.confirmationSent = true;
        await reg.save();
        emailStatus = 'sent';
      } else {
        emailStatus = emailResult?.emailStatus || 'failed';
      }
    } catch (e) {
      console.error('Confirm email after verify failed:', e.message);
      emailStatus = 'failed';
    }
  }

  return {
    success: true,
    message:
      status === 'verified'
        ? `Payment verified${emailStatus === 'sent' ? '; confirmation email sent' : ''}`
        : `Marked as ${status}`,
    emailStatus,
  };
}

function eventMatch(slug) {
  return { $or: [{ eventSlug: slug }, { events: slug }] };
}

export async function getEventOpsSummary() {
  await verifyAdmin();
  await connectDB();
  const events = await getEvents({});
  const rows = await Promise.all(
    events.map(async (ev) => {
      const match = eventMatch(ev.slug);
      const [total, pending, verified, checkedIn] = await Promise.all([
        Registration.countDocuments(match),
        Registration.countDocuments({ ...match, paymentStatus: 'pending' }),
        Registration.countDocuments({ ...match, paymentStatus: 'verified' }),
        Registration.countDocuments({ ...match, checkedIn: true }),
      ]);
      return {
        slug: ev.slug,
        name: ev.name,
        fee: ev.registrationFee,
        isActive: ev.isActive,
        total,
        pending,
        verified,
        checkedIn,
      };
    })
  );
  return { success: true, data: rows };
}
