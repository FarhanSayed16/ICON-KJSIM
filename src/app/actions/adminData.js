'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { EVENTS } from '@/lib/data';

async function verifyAdmin() {
  const token = (await cookies()).get('icon_admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    throw new Error('Unauthorized');
  }
}

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

    const eventsMap = EVENTS.reduce((acc, evt) => {
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

export async function getRegistrations(page = 1, limit = 10, search = '', event = '') {
  await verifyAdmin();
  await connectDB();

  try {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { qrCode: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }
    if (event) {
      query.events = event;
    }

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

  const query = event ? { events: event } : {};
  const rows = await Registration.find(query).sort({ createdAt: -1 }).lean();

  const header = [
    'qrCode',
    'name',
    'email',
    'mobile',
    'college',
    'department',
    'events',
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
        (r.events || []).join('|'),
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
