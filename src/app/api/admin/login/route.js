import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request) {
  try {
    const body = await request.json();
    const password = body.password;

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('icon_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 });
  }
}
