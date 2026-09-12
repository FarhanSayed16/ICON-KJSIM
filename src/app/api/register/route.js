import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { rateLimit } from '@/lib/rateLimit';
import { sendRegistrationEmail } from '@/lib/notifications';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/),
  college: z.string().trim().min(2).max(200),
  department: z.string().trim().max(200).optional().or(z.literal('')),
  events: z.array(z.string()).min(1),
});

async function requireAdmin(request) {
  const auth = request.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  const cookieToken = (await cookies()).get('icon_admin_token')?.value;
  const token = bearer || cookieToken;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const limited = rateLimit(`api-register:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const mobile = String(body.mobile || body.phone || '').replace(/\D/g, '').slice(-10);
    const validated = registrationSchema.parse({ ...body, mobile });

    await connectDB();
    const existing = await Registration.findOne({ email: validated.email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already registered' },
        { status: 409 }
      );
    }

    const qrCode = `ICON2026-REG-${Date.now().toString().slice(-5)}${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    const doc = await Registration.create({ ...validated, qrCode });

    try {
      const emailResult = await sendRegistrationEmail(doc);
      if (emailResult?.success) {
        doc.confirmationSent = true;
        if (emailResult.whatsappSent) doc.whatsappSent = true;
        await doc.save();
      }
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful!',
        data: {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          events: doc.events,
          qrCode: doc.qrCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: (error.issues || []).map((i) => ({
            field: i.path[0],
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'This email is already registered' },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
  const search = searchParams.get('search') || '';
  const event = searchParams.get('event') || '';

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { qrCode: { $regex: search, $options: 'i' } },
    ];
  }
  if (event) query.events = event;

  const [registrations, total] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Registration.countDocuments(query),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
}
