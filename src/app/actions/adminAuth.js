'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const COOKIE_NAME = 'icon_admin_token';

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

/**
 * Validates password and sets HTTP-only JWT cookie
 */
export async function loginAdmin(prevState, formData) {
  const password = formData.get('password');

  if (!password) {
    return { success: false, message: 'Password is required' };
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, message: 'Invalid credentials' };
  }

  try {
    const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(SECRET_KEY);

    (await cookies()).set(COOKIE_NAME, token, {
      ...cookieBase,
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

/**
 * Clears the admin token cookie (must match path used at login)
 */
export async function logoutAdmin() {
  const jar = await cookies();
  // Explicit expire — more reliable than delete() alone in App Router
  jar.set(COOKIE_NAME, '', {
    ...cookieBase,
    maxAge: 0,
  });
  try {
    jar.delete(COOKIE_NAME);
  } catch {
    /* ignore */
  }
  return { success: true };
}
