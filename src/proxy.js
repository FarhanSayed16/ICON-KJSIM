import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE = 'icon_admin_token';
const loginPath = '/admin/login';

async function hasValidToken(request) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return { token: null, valid: false };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return { token, valid: true };
  } catch {
    return { token, valid: false };
  }
}

function clearCookie(response) {
  response.cookies.set(COOKIE, '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === loginPath;
  const { token, valid } = await hasValidToken(request);

  if (isLoginPath) {
    if (valid) return NextResponse.redirect(new URL('/admin', request.url));
    return token ? clearCookie(NextResponse.next()) : NextResponse.next();
  }

  if (!valid) {
    const response = NextResponse.redirect(new URL(loginPath, request.url));
    return token ? clearCookie(response) : response;
  }

  return NextResponse.next();
}

export const config = {
  // Only admin pages need auth. Keeping public pages and all /_next/* assets
  // out of the proxy avoids an extra hop on every request.
  matcher: ['/admin', '/admin/:path*'],
};
