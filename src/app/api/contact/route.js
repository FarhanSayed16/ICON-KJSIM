import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ContactMsg from '@/models/ContactMsg';
import { rateLimit } from '@/lib/rateLimit';

const schema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email(),
  message: z.string().trim().min(2),
});

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(`api-contact:${ip}`, { limit: 20 }).ok) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const data = schema.parse(body);
    await connectDB();
    await ContactMsg.create({
      name: data.name || '',
      email: data.email,
      message: data.message,
    });

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you soon.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
