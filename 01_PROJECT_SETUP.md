# 01 — Project Setup

## Overview
Initialize a Next.js 15 project for Camp Riverbend's website rebuild. This is a summer day camp in Warren, NJ (campriverbend.com). The site replaces a WordPress + WooCommerce site with a modern stack.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Neon (PostgreSQL) via `@neondatabase/serverless` + Drizzle ORM
- **File Storage:** Vercel Blob (`@vercel/blob`)
- **Payments:** Stripe Checkout (`stripe` + `@stripe/stripe-js`)
- **Email:** Resend (`resend`)
- **Analytics:** Fathom Analytics + Facebook Pixel
- **Auth:** NextAuth.js v5 (credentials provider for admin)
- **Deployment:** Vercel

## Step 1: Initialize Project

```bash
npx create-next-app@latest camp-riverbend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd camp-riverbend
```

## Step 2: Install Dependencies

```bash
# Database
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Auth
npm install next-auth@beta @auth/drizzle-adapter

# File storage
npm install @vercel/blob

# Payments
npm install stripe @stripe/stripe-js

# Email
npm install resend

# UI/UX
npm install framer-motion lucide-react clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-accordion @radix-ui/react-toast @radix-ui/react-select @radix-ui/react-switch

# Rich text (for admin bio editor)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link

# Utilities
npm install slugify bcryptjs
npm install -D @types/bcryptjs
```

## Step 3: Project Structure

```
src/
├── app/
│   ├── (public)/              # Public-facing pages
│   │   ├── page.tsx           # Homepage
│   │   ├── about-riverbend/
│   │   ├── breene-family/
│   │   ├── programs/
│   │   ├── clubhouse/
│   │   ├── riverbend-experience/
│   │   ├── day-trippers/
│   │   ├── activities/
│   │   ├── sports/
│   │   ├── videos/
│   │   ├── testimonials/
│   │   ├── faq/
│   │   ├── health-safety/
│   │   ├── lunch/
│   │   ├── transportation/
│   │   ├── calendar/
│   │   ├── staff/
│   │   ├── rates-dates-application-2026/
│   │   ├── camp-riverbend-app/
│   │   └── shop/
│   │       ├── page.tsx       # Product grid
│   │       └── [slug]/
│   │           └── page.tsx   # Product detail
│   ├── (checkout)/
│   │   ├── cart/
│   │   └── checkout/
│   ├── admin/                 # Admin dashboard (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── products/
│   │   ├── orders/
│   │   ├── staff/
│   │   ├── users/
│   │   └── login/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── upload/
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   └── webhook/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── staff/
│   │   └── admin-users/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Base UI components
│   ├── navigation/            # Nav, MobileNav, Footer
│   ├── home/                  # Homepage sections
│   ├── shop/                  # Store components
│   └── admin/                 # Admin components
├── lib/
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── index.ts           # DB connection
│   │   └── seed.ts            # Seed data
│   ├── auth.ts                # NextAuth config
│   ├── stripe.ts              # Stripe helpers
│   ├── email.ts               # Resend helpers
│   ├── blob.ts                # Vercel Blob helpers
│   └── utils.ts               # Shared utilities
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript types
└── public/
    └── fonts/                 # Custom font files (.woff2, .woff)
```

## Step 4: Environment Variables

Create `.env.local`:

```env
# Database (Neon)
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=generate-a-random-string
NEXTAUTH_URL=http://localhost:3000

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Fathom
NEXT_PUBLIC_FATHOM_SITE_ID=...

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=2163419317208125

# Site
NEXT_PUBLIC_SITE_URL=https://campriverbend.com
ADMIN_EMAIL=abby@campriverbend.com
```

## Step 5: Next.js Configuration

```javascript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/:path*`,
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
```

## Step 6: Utility Setup

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
```

## Step 7: Custom Font Setup

The user will provide the custom font file (.woff2 / .woff / .ttf). Place it in `public/fonts/`.

In `src/app/layout.tsx`, load via `next/font/local`:

```typescript
import localFont from 'next/font/local';

const campFont = localFont({
  src: [
    {
      path: '../../public/fonts/CampRiverbendFont.woff2',
      weight: '400',
      style: 'normal',
    },
    // Add additional weights/styles as provided
  ],
  variable: '--font-camp',
  display: 'swap',
});
```

If the user provides multiple font files, register each weight. Use this as the display/heading font. Pair with a clean sans-serif body font.

## Step 8: Tailwind Config

The design should feel warm, family-oriented, and premium — not generic. Use Camp Riverbend's brand colors (red/maroon and nature greens/blues from the existing site).

Configure Tailwind with custom theme tokens:

```css
/* In globals.css or tailwind config */
/* Brand colors extracted from existing site */
/* Primary: Camp red/maroon */
/* Secondary: Nature greens */
/* Accent: River blues */
/* Neutrals: Warm grays */
```

Set up the `--font-camp` CSS variable for headings and the body font for paragraphs.

## Completion Criteria
- [ ] Project initializes and runs with `npm run dev`
- [ ] All dependencies installed
- [ ] Directory structure created
- [ ] Environment variables template ready
- [ ] next.config.ts with rewrites and redirects
- [ ] Utility functions ready
- [ ] Font loaded (if file provided) or placeholder ready
- [ ] Tailwind configured with brand tokens
