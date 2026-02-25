# 13 — Deployment

## Overview
Deploy to Vercel from the GitHub repository. Configure custom domain, environment variables, Blob storage, and DNS.

## Step 1: GitHub Repository

Ensure the repo is pushed to GitHub. Vercel connects directly to GitHub for automatic deployments.

```bash
git init
git add .
git commit -m "Initial commit — Camp Riverbend website"
git remote add origin https://github.com/[YOUR_ORG]/camp-riverbend.git
git push -u origin main
```

## Step 2: Vercel Project Setup

1. Go to vercel.com/new
2. Import from GitHub → select `camp-riverbend` repo
3. Framework preset: Next.js (auto-detected)
4. Root directory: `./` (default)
5. Build command: `next build` (default)
6. Output directory: `.next` (default)

## Step 3: Environment Variables

Set ALL environment variables in Vercel Dashboard → Project → Settings → Environment Variables:

```
# Database
DATABASE_URL = [Neon connection string]

# Auth
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://campriverbend.com

# Vercel Blob
BLOB_READ_WRITE_TOKEN = [from Vercel Blob store]

# Stripe
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...

# Resend
RESEND_API_KEY = re_...

# Fathom
NEXT_PUBLIC_FATHOM_SITE_ID = [from Fathom dashboard]

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID = 2163419317208125

# Site
NEXT_PUBLIC_SITE_URL = https://campriverbend.com
ADMIN_EMAIL = abby@campriverbend.com

# Initial Admin (only needed for first seed, can remove after)
ADMIN_INITIAL_PASSWORD = [set a strong password]
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.

## Step 4: Vercel Blob Store

1. In Vercel Dashboard → Storage → Create → Blob
2. Name: `camp-riverbend-assets`
3. Link to the project
4. The `BLOB_READ_WRITE_TOKEN` will be auto-set
5. Note the store ID (needed for the rewrite URL in next.config.ts)

## Step 5: Neon Database

1. Create a Neon project at neon.tech
2. Create a database: `camp_riverbend`
3. Copy the connection string → set as `DATABASE_URL`
4. Run migrations: `npx drizzle-kit migrate`
5. Run seed: `npx tsx src/lib/db/seed.ts`

## Step 6: Custom Domain

1. In Vercel Dashboard → Project → Settings → Domains
2. Add: `campriverbend.com`
3. Add: `www.campriverbend.com` (redirect to apex)
4. Vercel will show DNS records to configure

### DNS Configuration

In your DNS provider, set:

**Option A: Vercel Nameservers (recommended)**
Change nameservers to Vercel's nameservers. Vercel manages all DNS.

**Option B: External DNS (if keeping current DNS provider)**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

Wait for DNS propagation (can take up to 48 hours, usually much faster).

Vercel automatically provisions SSL certificates.

## Step 7: Stripe Webhook

After deployment, set up the Stripe webhook:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://campriverbend.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired` (optional)
4. Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`

## Step 8: Resend Domain Verification

1. Go to Resend Dashboard → Domains
2. Add: `campriverbend.com`
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Once verified, emails will send from `noreply@campriverbend.com` or similar

## Step 9: Redirects for Old WordPress URLs

Already configured in `next.config.ts`, but verify these 301 redirects work:

```
/camp-during-covid → /health-safety (301)
/rates-dates-application-2025-draft → /rates-dates-application-2026 (301)
/rates-dates → /rates-dates-application-2026 (301)
```

Also consider redirects for WordPress-specific URLs that might have been indexed:
```
/wp-admin → /admin (or 404)
/wp-login.php → /admin/login (or 404)
/?p=* → 404
/wp-content/* → 404
```

## Step 10: SEO Checklist

- [ ] `robots.txt` — allow all, point to sitemap
  ```
  User-agent: *
  Allow: /
  Sitemap: https://campriverbend.com/sitemap.xml
  ```
- [ ] `sitemap.xml` — auto-generate with Next.js metadata API
  ```typescript
  // src/app/sitemap.ts
  export default function sitemap() {
    const pages = [
      '/', '/about-riverbend', '/breene-family', '/programs',
      '/clubhouse', '/riverbend-experience', '/day-trippers',
      '/activities', '/sports', '/videos', '/testimonials',
      '/faq', '/health-safety', '/lunch', '/transportation',
      '/calendar', '/staff', '/rates-dates-application-2026',
      '/camp-riverbend-app', '/shop',
    ];
    return pages.map(page => ({
      url: `https://campriverbend.com${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page === '/' ? 1 : 0.8,
    }));
  }
  ```
- [ ] Dynamic sitemap entries for product pages (`/shop/[slug]`)
- [ ] Canonical URLs on all pages
- [ ] Open Graph metadata on all pages
- [ ] Structured data (JSON-LD) for Organization:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Camp Riverbend",
    "url": "https://campriverbend.com",
    "logo": "https://campriverbend.com/assets/site/logo-white.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "116 Hillcrest Road",
      "addressLocality": "Warren",
      "addressRegion": "NJ",
      "postalCode": "07059"
    },
    "telephone": "(908) 580-2267",
    "email": "info@campriverbend.com"
  }
  ```
- [ ] Favicon and apple-touch-icon
- [ ] 404 page (custom, on-brand)
- [ ] `noindex` on admin pages

## Step 11: Performance Checklist

- [ ] Lighthouse score > 90 on all metrics
- [ ] Images optimized via next/image
- [ ] Fonts preloaded
- [ ] Third-party scripts load `afterInteractive`
- [ ] Static pages use ISR or static generation where possible
- [ ] API routes have appropriate caching headers

## Step 12: Go-Live Checklist

1. [ ] All pages built and content verified
2. [ ] Store functional (Stripe test mode → live mode)
3. [ ] Admin login works, all CRUD operations verified
4. [ ] Emails sending correctly (order confirmations, account billing notifications)
5. [ ] All redirects working (old URLs → new)
6. [ ] DNS propagated, SSL active
7. [ ] Analytics tracking (Fathom + FB Pixel)
8. [ ] Mobile responsive on real devices
9. [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
10. [ ] SEO: sitemap, robots.txt, structured data, OG tags
11. [ ] 404 page works
12. [ ] Admin pages not indexable
13. [ ] Initial super admin password changed from seed value
14. [ ] Stripe webhook verified in production
15. [ ] Backup: Neon automatic backups enabled

## Completion Criteria
- [ ] Site live at campriverbend.com with SSL
- [ ] www redirects to apex
- [ ] All environment variables set
- [ ] Blob store connected and rewrite working
- [ ] Database connected and seeded
- [ ] Stripe webhook receiving events
- [ ] Resend sending emails from verified domain
- [ ] Old WordPress URLs redirecting properly
- [ ] SEO metadata, sitemap, robots.txt in place
- [ ] Performance acceptable (Lighthouse > 90)
