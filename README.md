# Camp Riverbend — Claude Code Instruction Files

## Project
Rebuild campriverbend.com from WordPress/WooCommerce to Next.js 15 + Neon DB + Vercel Blob, deployed on Vercel.

## Execution Order

Read and execute these files **in sequence**. Each file builds on the previous.

| # | File | What It Does |
|---|------|-------------|
| 01 | `01_PROJECT_SETUP.md` | Initialize Next.js project, install deps, configure environment |
| 02 | `02_DATABASE.md` | Set up Neon + Drizzle schema, run migrations, seed data |
| 03 | `03_DESIGN_SYSTEM.md` | Brand colors, typography, spacing, animation patterns |
| 04 | `04_COMPONENTS.md` | Build shared component library (Nav, Footer, Cards, etc.) |
| 05 | `05_HOMEPAGE.md` | Build the homepage |
| 06 | `06_ABOUT_PAGE.md` | Build the About/Legacy & Tradition page |
| 07 | `07_BREENE_FAMILY.md` | Build staff page + admin CRUD backend |
| 08 | `08_ALL_PAGES.md` | Build remaining 19 content pages |
| 09 | `09_STORE.md` | Build store: products, cart, checkout (Stripe + account billing) |
| 10 | `10_ADMIN.md` | Build admin dashboard: auth, products, orders, users |
| 11 | `11_IMAGES.md` | Migrate images from old CDN to Vercel Blob |
| 12 | `12_ANALYTICS.md` | Set up Fathom Analytics + Facebook Pixel |
| 13 | `13_DEPLOYMENT.md` | Deploy to Vercel, configure domain, DNS, go-live checklist |

## Phase 1 (For Client Approval)
Build files 01-07 first. This delivers:
- Homepage (modern 2026 redesign)
- About page (demonstrates full component library)
- Breene Family page (demonstrates admin backend capability)

## Phase 2 (After Approval)
Build files 08-13 to complete the full site.

## Key Context
- **Client:** Camp Riverbend — family-run summer day camp in Warren, NJ since 1962
- **Domain:** campriverbend.com (client controls DNS)
- **Custom font:** User will provide .woff2 file directly. Load via next/font/local.
- **Order notifications:** abby@campriverbend.com via Resend
- **Stripe:** TBD — may need account setup. Scaffold integration, plug in keys later.
- **External services preserved:** CampInTouch (login/apps), Vimeo (video hosting), Yessirr.com (merch)
- **Facebook Pixel ID:** 2163419317208125

## Important Notes
- All images must be downloaded from cdn.campriverbend.com and uploaded to Vercel Blob
- All public image URLs use the `/assets/*` rewrite pattern for SEO
- Admin uploads use Vercel Blob client-side upload (no 4.5MB limit)
- Super admin can create other admin users; regular admins cannot
- "Bill to Camp Riverbend Account" checkout creates a pending_invoice order and emails the admin
- Remove/redirect stale pages: COVID page, 2025 draft, old rates page
