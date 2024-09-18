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
};

export default nextConfig;
