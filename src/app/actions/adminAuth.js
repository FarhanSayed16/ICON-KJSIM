'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const COOKIE_NAME = 'icon_admin_token';

/**
 * Validates password and sets HTTP-only JWT cookie
 */
export async function loginAdmin(prevState, formData) {
  const password = formData.get('password');

  if (!password) {
    return { success: false, message: 'Password is required' };
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    // Return generic error for security
    return { success: false, message: 'Invalid credentials' };
  }

  try {
    const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
    // Create JWT
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // 1 day expiration
      .sign(SECRET_KEY);

    // Set cookie
    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

/**
 * Clears the admin token cookie
 */
export async function logoutAdmin() {
  (await cookies()).delete(COOKIE_NAME);
  return { success: true };
}
