# Camp Riverbend — Backend Buildout Handoff

**Branch:** `claude/review-codebase-backend-VvCiD`
**Last commit:** `c12e54e add seed scripts; fix migrate to actually execute SQL`
**Status:** Paused mid-build. DB schema + seed code written but not yet run against Neon (blocked by IP allowlist).

---

## ⚠️ Blocker — Fix First in Codespaces

Neon project has an **IP allowlist** that rejects the previous environment. Before anything else:

1. **Neon console → your project → Settings → IP Allow**
2. Either disable the allowlist, or add `0.0.0.0/0` temporarily, or add GitHub Codespaces egress ranges.
3. Verify by running:

```bash
npm install
npm run db:migrate   # creates 13 tables
npm run db:seed      # populates admin, 5 categories, 24 products, 18 staff, 3 shipping, 6 tuition rates, 3 discounts, 3 payment schedule rows, ~22 page content blocks
```

Expected seed output ends with `✓ Seed complete.`

If 403 persists, the allowlist still isn't open. Codespaces uses dynamic IPs — the allowlist needs to be disabled or widened.

---

## Environment (already configured)

`.env.local` is gitignored and contains:

- `DATABASE_URL` — Neon connection string (production creds provided by user)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (real token provided)
- `NEXTAUTH_SECRET` — generated
- `ADMIN_INITIAL_EMAIL=matthew@adventii.com`
- `ADMIN_INITIAL_PASSWORD=Dunkindonuts3!@`
- `ADMIN_INITIAL_NAME=Matthew Boyle`
- Placeholders for `STRIPE_*`, `RESEND_API_KEY`, `NEXT_PUBLIC_FATHOM_SITE_ID`
- `NEXT_PUBLIC_FB_PIXEL_ID=2163419317208125` (from README)

**Codespaces:** `.env.local` needs to be recreated there. Contents are listed in this session's conversation; or copy from your local machine.

---

## What's Done

### Schema (committed, migrations generated)
Extended `src/lib/db/schema.ts` with CMS tables on top of the existing spec:
- **Existing:** `admin_users`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `staff_members`, `shipping_rates`
- **New (added this session):**
  - `tuition_rates` — duration / in-camp / day-tripper / three-quarter columns
  - `tuition_discounts` — heading + body
  - `payment_schedule` — label + detail
  - `site_settings` — key/value store
  - `page_content` — **the CMS**. One row per `(page_slug, section_key)`. `content_type` enum is `text` or `rich_html`.

Migration file: `drizzle/0000_huge_doctor_strange.sql` (23 statements, idempotent runner).

### Seed scripts
`src/lib/db/seed/` — modular, each idempotent:
- `index.ts` — runner (order: admin → categories → products → staff → shipping → rates → page-content)
- `env.ts` — loads `.env.local` before `db/index.ts` is evaluated
- `admin.ts` — creates `super_admin` from env vars
- `categories.ts` — 5 categories
- `products.ts` — 24 products + variants
- `staff-data.ts` + `staff.ts` — 18 staff with full bios
- `shipping.ts` — 3 shipping rates
- `rates.ts` — 6 tuition rates + 3 discounts + 3 payment milestones
- `page-content-data.ts` + `page-content.ts` — ~22 default content blocks for the CMS

### Dependencies installed
- `tsx`, `dotenv`, `ws`, `@types/ws`, `fathom-client`

### Bug fix
`src/lib/db/migrate.ts` was using `sql.unsafe(stmt)` which **only wraps a string — it does not execute**. Awaiting it was a no-op. Fixed to use `sql.query(stmt)`. Earlier "successful" migrations did nothing.

---

## What's Outstanding (Build Order)

Todos, in the order the previous session planned to build them. Each bullet is ~15–45 min for Claude Code.

### 1. NextAuth + admin login (FIRST after DB is live)
- `src/lib/auth.ts` — NextAuth v5 config with Credentials provider, bcryptjs, JWT callbacks injecting `role` and `id`
- `src/app/api/auth/[...nextauth]/route.ts` — handlers export
- `src/lib/admin-auth.ts` — `requireAdmin()` and `requireSuperAdmin()` helpers for API routes
- `src/app/admin/login/page.tsx` — email + password form, calls `signIn('credentials')`, redirects to `/admin`
- `src/app/admin/layout.tsx` — wrap with `const session = await auth(); if (!session?.user) redirect('/admin/login')`
- `middleware.ts` at project root — protect `/admin/*` except `/admin/login`

Per user decision: **keep current top-nav admin header** (do NOT redesign to 256px sidebar).

### 2. Rates/Dates/Application editor (quick win — client priority #2)
- `src/app/admin/rates/page.tsx` — three-section editor:
  - Tuition rates table (editable grid, 4 text columns per row)
  - Discounts list (heading + body cards)
  - Payment schedule list (label + detail cards)
  - Save button per section, or one "Save all"
- API routes:
  - `src/app/api/tuition-rates/route.ts` (GET, POST)
  - `src/app/api/tuition-rates/[id]/route.ts` (PUT, DELETE)
  - Same pattern for `tuition-discounts` and `payment-schedule`
- Refactor `src/app/(public)/rates-dates-application-2026/page.tsx` to:
  - Mark as `dynamic = 'force-dynamic'` OR use `revalidatePath('/rates-dates-application-2026')` on save
  - Read tuition/discounts/payments from DB instead of hardcoded arrays (lines 16–53 of that file)
  - Read section copy from `page_content` table (see next step for CMS pattern)

### 3. Products admin + API
- `src/app/admin/products/page.tsx` — list with search, category filter, active-toggle inline switch, edit/duplicate/delete actions
- `src/app/admin/products/[id]/page.tsx` — form: name/slug/description/price/category/images (Vercel Blob client upload)/weightOz/externalUrl/active + variants subtable
- API: `src/app/api/products/route.ts` (GET list, POST), `src/app/api/products/[id]/route.ts` (GET/PUT/DELETE), `src/app/api/products/[id]/variants/route.ts` (PUT bulk)
- All routes call `requireAdmin()` and `revalidatePath('/shop')` on mutation

Vercel Blob client upload flow: use `@vercel/blob/client` with a server-side handler route that the widget calls for the signed URL — **don't** try to upload through a server function (4.5MB limit).

### 4. Orders admin + wire Stripe webhook + account-billing email
Files to touch:
- `src/app/admin/orders/page.tsx` — list with status tabs, payment method filter, search, date range
- `src/app/admin/orders/[id]/page.tsx` — detail with status change dropdown, customer info, items table, admin notes
- `src/app/api/orders/route.ts` (GET list), `src/app/api/orders/[id]/route.ts` (GET/PUT)
- **Fix stubs:**
  - `src/app/api/stripe/webhook/route.ts` line 29 — actually insert the order into DB on `checkout.session.completed`, retrieving line items from `session.line_items` (expand when creating the session) or from `metadata` you set on the session. Then Resend → customer confirmation.
  - `src/app/api/orders/account-billing/route.ts` lines 22–37 — insert order with status `pending_invoice`, Resend → notify `ADMIN_NOTIFICATION_EMAIL` and customer.

Account-billing orders must be visually prominent on the admin list (badge / highlight) per spec.

### 5. Admin users CRUD (super_admin only)
- `src/app/admin/users/page.tsx`, `[id]/page.tsx`
- `src/app/api/admin-users/route.ts`, `[id]/route.ts`
- Gate with `requireSuperAdmin()`. Safeguards: can't delete self, can't delete last super_admin.

### 6. Page Content CMS (client priority #1 — biggest piece)
Scope decision: **section-level rich text** (user confirmed). Each public page has named editable blocks keyed by `section_key`; admin picks page → edits blocks via Tiptap.

- `src/components/admin/RichTextEditor.tsx` — Tiptap wrapper. Packages already installed: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`.
- `src/app/admin/pages/page.tsx` — list of pages (derived from `DISTINCT page_slug` in `page_content`)
- `src/app/admin/pages/[slug]/page.tsx` — list each `section_key` for that page with inline editor (text input for `text`, Tiptap for `rich_html`)
- API: `src/app/api/page-content/route.ts` (GET list with `?slug=`), `[id]/route.ts` (PUT)
- Helper: `src/lib/page-content.ts` with `getPageContent(pageSlug: string)` returning `Record<sectionKey, string>` — cached with `unstable_cache` or plain React cache
- Refactor public pages to read from DB:
  - Priority: `rates-dates-application-2026` (already has seed blocks — easiest)
  - Then: `homepage`, `about-riverbend`, `breene-family`, `faq`, `testimonials`
  - Pattern: convert each affected page to async server component, pull content with `getPageContent('<slug>')`, pass strings to JSX. Use `dangerouslySetInnerHTML` for `rich_html` blocks.
- On save, `revalidatePath('/' + pageSlug)` for cache busting.

Future extension (not now): add new sections via admin UI — requires an "Add section" button that inserts a new row with a new `section_key`, plus a way for the public page code to render unknown sections. For v1, sections are fixed in code and seeded; admins only edit the content of known blocks.

### 7. Fix staff admin to use real DB
Currently all mock:
- `src/app/admin/staff/page.tsx` uses hardcoded `initialStaff`
- `src/app/admin/staff/[id]/page.tsx` fakes save with `setTimeout`
- `src/app/api/staff/route.ts` returns mock array
- `src/app/api/staff/[id]/route.ts` returns placeholder

Swap all to real Drizzle queries against `staff_members` table. Wire drag-to-reorder via `src/app/api/staff/reorder/route.ts`.

### 8. Dashboard real stats
`src/app/admin/page.tsx` has hardcoded counts (18/24/0/1). Replace with live queries:
- Active products: `SELECT COUNT(*) FROM products WHERE is_active = true`
- Pending orders: `SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'paid', 'pending_invoice')`
- Account billing awaiting invoice: `status = 'pending_invoice'`
- Revenue this month: `SUM(total) FROM orders WHERE status != 'cancelled' AND created_at >= date_trunc('month', CURRENT_DATE)`

### 9. Analytics
- `src/components/analytics/FathomAnalytics.tsx` — uses `fathom-client` package (already installed). Reads `NEXT_PUBLIC_FATHOM_SITE_ID`; no-ops if not set.
- `src/components/analytics/FacebookPixel.tsx` — loads fbq script, reads `NEXT_PUBLIC_FB_PIXEL_ID`.
- `src/types/facebook.d.ts` — `declare global { interface Window { fbq: ... } }`
- Mount both in `src/app/layout.tsx` just above `{children}`
- Track events on Apply Now buttons, Add to Cart, Purchase (webhook-triggered isn't possible client-side; fire on order-confirmation page load via a `useEffect`).

### 10. Build + deploy prep
- `npm run build` — fix any type errors (likely need to narrow drizzle types)
- Add `middleware.ts` if not already added for admin protection
- Vercel env vars — mirror `.env.local` into project
- Real Stripe keys + webhook endpoint configured in Stripe dashboard pointing to `/api/stripe/webhook`
- Real Resend key; verify sending domain `campriverbend.com` or use `onboarding@resend.dev` for testing
- Real Fathom site ID

---

## Architecture Notes Worth Remembering

- **Spec files:** `01_PROJECT_SETUP.md` through `13_DEPLOYMENT.md` are the source of truth. `10_ADMIN.md` has the admin spec; `02_DATABASE.md` has the original schema (CMS tables are extensions beyond spec).
- **Admin layout decision:** user chose to keep the current top-nav header (`src/app/admin/layout.tsx`) instead of rebuilding the 256px sidebar spec'd in `10_ADMIN.md`.
- **CMS scope decision:** section-level rich text, not every-string-editable.
- **Resend domain:** sending domain must be verified in Resend console. Until then, use `onboarding@resend.dev` as `from` for testing.
- **Vercel Blob:** the rewrite in `next.config.ts` maps `/assets/:path*` to the blob store. `BLOB_STORE_ID` env var controls this — may need to add it alongside `BLOB_READ_WRITE_TOKEN`.
- **Drizzle-kit push** hits 403 over WS against this Neon project — always use `generate` + custom `migrate.ts` runner instead.

## Stubs to Replace

| File | Current state | TODO |
|---|---|---|
| `src/app/api/stripe/webhook/route.ts:29` | Logs only | Insert order, Resend confirm |
| `src/app/api/orders/account-billing/route.ts:22-37` | Logs only | Insert order (status pending_invoice), Resend admin + customer |
| `src/app/api/staff/route.ts` | Mock array | Drizzle query |
| `src/app/api/staff/[id]/route.ts` | Placeholder | Drizzle query |
| `src/app/api/staff/reorder/route.ts` | No-op | Bulk update sort_order |
| `src/app/api/upload/route.ts` | Fake URL | Vercel Blob client upload handler |
| `src/app/admin/page.tsx` | Hardcoded counts | Live stats |
| `src/app/admin/staff/*.tsx` | Mock data | Fetch from API |

---

## Quick-start Prompt for New Session

> Read `HANDOFF.md` first. DB schema is extended; seed scripts are written but not yet run. Confirm Neon allowlist is open (`npm run db:migrate && npm run db:seed` should succeed). Then continue in the build order listed in HANDOFF.md starting with **NextAuth + admin login**. Commit after each numbered section. Branch: `claude/review-codebase-backend-VvCiD`.
