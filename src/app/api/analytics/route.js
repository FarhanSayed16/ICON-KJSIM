import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getDashboardStats } from '@/app/actions/adminData';

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

export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const range = new URL(request.url).searchParams.get('range') || 'all';
  const result = await getDashboardStats(range);
  const status = result.success ? 200 : 500;
  return NextResponse.json(result, { status });
}
