# Camp Riverbend — Build Progress

Single source of truth for backend completion.

## Status legend
- ✅ done
- 🟡 in progress
- ⬜ todo
- 🔒 blocked (external credentials required)

---

## Phase 1 — Database foundation
- ✅ Drizzle migrations generated from `src/lib/db/schema.ts`
- ✅ Schema pushed to Neon (8 tables: admin_users, categories, products, product_variants, orders, order_items, staff_members, shipping_rates)
- ✅ `scripts/seed.ts` — idempotent, run with `npm run db:seed`
- ✅ Seeded: 1 super admin · 5 categories · 21 products + variants · 18 staff · 3 shipping tiers

## Phase 2 — Authentication
- ✅ `src/lib/auth.ts` — NextAuth v5; Credentials provider accepts only signed login tickets
- ✅ `src/lib/auth.config.ts` — edge-safe shared config used by middleware
- ✅ `src/lib/auth-tokens.ts` — HMAC-signed tickets/challenges, OTP gen, sha256 helpers
- ✅ `src/lib/auth-rate-limit.ts` — in-memory token bucket
- ✅ `src/lib/auth-audit.ts` — `admin_auth_log` writer
- ✅ `src/app/api/auth/[...nextauth]/route.ts`
- ✅ `src/middleware.ts` — guards `/admin/*`; whitelists login/verify/forgot/reset
- ✅ `/admin/login` + `/admin/login/verify` — two-step login (password → 6-digit email code)
- ✅ Trusted-device cookie (30 days) skips OTP on remembered devices
- ✅ `/admin/forgot` + `/admin/reset` — email-based password reset (15-min, single-use, hashed)
- ✅ Reset wipes user's trusted devices and open OTPs
- ✅ Rate limits on password / OTP / reset endpoints
- ✅ Logout button (server action) in admin header
- ✅ Session-aware admin layout shows current user

## Phase 3 — Connect existing UI to DB
- ✅ `/api/staff`, `/api/staff/[id]`, `/api/staff/reorder` — live Drizzle queries, auth-gated mutations
- ✅ `/(public)/breene-family/page.tsx` — server component, fetches from DB (5 min revalidate)
- ✅ Admin staff list (`/admin/staff`) and edit (`/admin/staff/[id]`) wired to API + photo upload
- ✅ Shop (`/shop`, `/shop/[slug]`) hydrated from DB with static fallback for resilience

## Phase 4 — Admin CRUD
- ✅ `/admin` dashboard — live counts (staff, products, categories, orders, pending orders, users)
- ✅ `/admin/staff` + `/admin/staff/[id|new]` — full CRUD with photo upload
- ✅ `/admin/products` + `/admin/products/[id|new]` — full CRUD, multi-image upload, variants editor
- ✅ `/admin/categories` — inline list/create/edit/delete
- ✅ `/admin/orders` + `/admin/orders/[id]` — list, filter by status, detail view, status updates, internal notes
- ✅ `/admin/users` — admin user list, create (super_admin only), delete (with self-protection)

## Phase 5 — E-commerce
- ✅ Cart (`useCart` + `CartProvider` already wired into root layout)
- ✅ `/api/orders/account-billing` — sole order path; inserts order + line items, emails staff who manually charge the camper's account
- ✅ `src/lib/email.ts` — Resend helper for orders + admin auth emails (gracefully degrades to console log without `RESEND_API_KEY`)
- 🚫 Stripe removed — no card processor; account billing only (legacy `payment_method` column kept for historical orders)

## Phase 6 — Image migration
- ✅ `scripts/migrate-images.ts` — fetches CDN, uploads to Blob, updates DB rows
- ✅ Manifest persisted at `scripts/image-manifest.json`
- ✅ Migrated: 18 staff photos · 13 site/page-header assets · 23 product images
- ✅ `/api/upload` — auth-gated Vercel Blob upload (10MB cap, jpg/png/webp)

## Phase 7 — Polish
- ✅ FAQ split into server `page.tsx` (exports `metadata`) + client `FAQClient.tsx`
- ✅ `.env.example` documents every variable
- ✅ npm scripts: `db:generate`, `db:push`, `db:studio`, `db:seed`, `images:migrate`
- ✅ Full type-check + production build passes (65 routes, 31 admin/API + 34 public)

## External credentials (not blocking — features degrade gracefully)
- ✅ `RESEND_API_KEY` — set; domain verified
- 🔒 `NEXT_PUBLIC_FATHOM_SITE_ID` / `NEXT_PUBLIC_FB_PIXEL_ID` — analytics not yet wired (defer until launch)

---

## Smoke test results (against live Neon + Blob)

```
Public pages
  200 /             200 /breene-family   200 /shop          200 /shop/[slug]
  200 /about-riverbend   200 /faq        200 /cart          200 /checkout
  200 /staff        200 /testimonials    200 /calendar
Admin (unauth → 307 redirect to login)
  307 /admin   307 /admin/staff   307 /admin/products
  307 /admin/orders   307 /admin/users   307 /admin/categories
  200 /admin/login
APIs
  200 /api/staff (18 rows, blob photos)
  200 /api/products (21 rows, blob images)
  200 /api/categories (5 rows)
  401 /api/orders, /api/users (auth-gated as expected)
```

## Done log (chronological)

1. Generated + pushed schema → 8 tables in Neon
2. Wrote seed script + seeded super admin, categories, products, staff, shipping
3. Built image migration script + ran it: **54 images** uploaded to Vercel Blob, DB rows updated
4. Configured NextAuth v5 with credentials + bcrypt
5. Restructured admin into route groups: `(authed)/...` (shell + middleware) vs `login/` (no shell)
6. Added admin login page, logout server action, session-aware header
7. Replaced all staff API mocks with Drizzle queries (auth-gated mutations)
8. Converted breene-family page to server component pulling from DB
9. Built full admin CRUD: products, categories, orders (with status workflow + notes), users
10. Wired account-billing route to insert orders + items + emails
11. Wired Stripe checkout to create pending DB order; webhook flips to paid + emails
12. Created `src/lib/email.ts` Resend helper (no-ops without key)
13. Made `/api/upload` an auth-gated, validated Vercel Blob handler
14. Converted shop pages to DB-backed with static fallback
15. Split FAQ into server (metadata) + client component
16. Added `.env.example` with every required variable
17. Production build passes clean (65 routes)
18. Smoke-tested all public pages, admin redirects, API auth boundaries

## Default credentials
- Admin login: `admin@campriverbend.com` / `ChangeMeNow!2026`
- **Change immediately after first login** via `/admin/users` or by re-running seed with `ADMIN_PASSWORD=...`
