import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedPaths = ['/admin'];
const loginPath = '/admin/login';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path is under /admin but NOT /admin/login
  const isProtectedPath = protectedPaths.some(p => pathname === p || pathname.startsWith(`${p}/`));
  const isLoginPath = pathname === loginPath;

  if (isProtectedPath && !isLoginPath) {
    const token = request.cookies.get('icon_admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      // Valid token, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL(loginPath, request.url));
      response.cookies.delete('icon_admin_token');
      return response;
    }
  }

  // If user is already logged in and tries to access /admin/login, redirect to /admin
  if (isLoginPath) {
    const token = request.cookies.get('icon_admin_token')?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        // Just let them login if token is bad
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except API, Next static, and images
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
