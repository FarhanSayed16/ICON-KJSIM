/** @type {import('next').NextConfig} */
const nextConfig = {
  // LAN / phone testing against the machine IP (avoids blocked HMR)
  allowedDevOrigins: ['192.168.0.102', '192.168.0.105'],
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
    // Prevent the browser from reusing HTML/RSC from a previous bundler run
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
