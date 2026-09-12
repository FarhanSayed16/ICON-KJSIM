import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { sendRemindersNow } from '@/app/actions/broadcast';

async function requireAdmin() {
  const token = (await cookies()).get('icon_admin_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

/** Manual notify trigger for admins */
export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const result = await sendRemindersNow();
  return NextResponse.json(result);
}
