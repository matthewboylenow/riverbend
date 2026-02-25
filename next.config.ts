import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.campriverbend.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: process.env.BLOB_STORE_ID
          ? `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/:path*`
          : '/placeholder-assets/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/camp-during-covid',
        destination: '/health-safety',
        permanent: true,
      },
      {
        source: '/rates-dates-application-2025-draft',
        destination: '/rates-dates-application-2026',
        permanent: true,
      },
      {
        source: '/rates-dates',
        destination: '/rates-dates-application-2026',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
