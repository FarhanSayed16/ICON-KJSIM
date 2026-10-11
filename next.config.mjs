/** @type {import('next').NextConfig} */
const nextConfig = {
  // LAN / phone testing against the machine IP (avoids blocked HMR)
  allowedDevOrigins: ['192.168.0.102', '192.168.0.105'],
  // Dev default disposes a page after 60s idle (then its CSS/JS 404 in open tabs
  // and it recompiles slowly on next visit). Keep compiled pages warm.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 50,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    // no-store only for documents — NEVER for /_next/static (CSS/JS),
    // or the browser shows bare HTML until a hard refresh.
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico|images/).*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
