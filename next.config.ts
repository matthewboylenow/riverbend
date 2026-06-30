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
  async headers() {
    // Light-touch security headers. Intentionally NO Content-Security-Policy
    // — a strict CSP is high-risk to add right before launch and easy to
    // break Next.js with. The headers below are response-only, don't
    // change rendering, and apply to every route.
    return [
      {
        source: '/:path*',
        headers: [
          // Clickjacking — block embedding except by the same origin.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Don't let browsers MIME-sniff responses into a different type.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Strip referrer when leaving the origin (privacy, defense-in-depth).
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Deny camera/mic/geolocation by default. Site doesn't use any.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Force HTTPS for a year. No `preload` so we can back out without
          // touching the public HSTS preload list.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Legacy WordPress media. The campriverbend.com domain used to point at
      // the old WordPress install, so historical assets — most notably the
      // images hard-coded into CampMinder email templates — live at
      // /wp-content/uploads/... URLs on this domain. Now that the domain serves
      // this Next app those paths 404. Proxy them back to the still-running old
      // WP origin so the exact original URLs keep resolving. The origin holds
      // the files at these same plain paths (cdn.campriverbend.com only serves
      // numeric-segment optimized variants, so it is not a drop-in source).
      {
        source: '/wp-content/uploads/:path*',
        destination:
          'https://wordpress-272284-846919.cloudwaysapps.com/wp-content/uploads/:path*',
      },
      {
        source: '/assets/:path*',
        destination: process.env.BLOB_STORE_ID
          ? `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/:path*`
          : '/placeholder-assets/:path*',
      },
      // Browsers that hit /favicon.ico directly (the legacy auto-request)
      // get the same PNG that <link rel="icon"> declares. Lets us drop the
      // old .ico file without leaving a 404 in network logs.
      {
        source: '/favicon.ico',
        destination: '/riverbend-favicon.png',
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
