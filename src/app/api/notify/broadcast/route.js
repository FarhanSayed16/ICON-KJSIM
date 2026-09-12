import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { broadcastNotification } from '@/app/actions/broadcast';

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
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const result = await broadcastNotification(body);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
