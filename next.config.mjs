/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/drawing/:path*',
        destination: '/drawing/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; font-src 'self' https://cdnjs.cloudflare.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
