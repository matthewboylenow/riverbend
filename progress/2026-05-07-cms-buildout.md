# Camp Riverbend CMS Buildout — Progress Summary

**Date:** 2026-05-07
**Status:** All major phases shipped except store simplification (queued).

This document captures every change that landed during the CMS buildout, what's editable now, what was migrated, and what's still pending.

---

## TL;DR

The site has gone from "code-only edits" to a near-WordPress-level CMS. Admins can now edit:

- **All 18 public pages** (homepage + 17 inner pages) through `/admin/pages`
- **Navigation mega menu** (groups, columns, links, up to 2 featured red cards per group) through `/admin/navigation`
- **Site favicon** (and future global settings) through `/admin/settings`
- **Media library** of 147 images + 17 documents through `/admin/media`

Every page edit goes through a **Save Draft → Preview → Publish** workflow with per-block revisions and rollback. Public rendering is unchanged until an admin saves.

---

## Phase-by-phase

### Phase 1 — Foundation (committed `fefac8c…bb03b30`)

| Piece | Where |
|---|---|
| `media_assets` table (unified images + documents) | `src/lib/db/schema.ts` |
| Bulk import of 70 existing assets from `image-manifest.json` + legacy `documents` | `scripts/seed-media-library.ts` |
| Media API: list / upload / patch / replace / delete | `src/app/api/media/*` |
| WordPress-style media library UI | `src/app/admin/(authed)/media/MediaLibrary.tsx` |
| `draft_content_json` + `draft_updated_at` columns on `page_content` | schema |
| `saveDraft` / `publishPage` / `discardPageDrafts` data layer | `src/lib/page-content.ts` |
| Generic schema-driven page editor (`PageSchema` config) | `src/components/admin/GenericPageEditor.tsx` |
| Reusable `<MediaPicker>` (browse library + upload-new) | `src/components/admin/MediaPicker.tsx` |
| Save Draft / Publish / Discard / View Draft actions | inside the editor |
| `?preview=1` reader gated by admin cookie | `src/lib/preview-mode.ts` |
| Pilot page wired end-to-end: About Riverbend | `src/lib/page-defaults/about-riverbend.ts` + schema |

### Phase 2 — All 18 inner pages editable (`4246a81…d67691e`)

For each page, three artifacts: defaults file (verbatim live copy), schema (declares blocks), public page rewrite (reads from blocks, falls back to defaults). Pixel-faithful — public rendering is unchanged on commit until an admin saves.

| Page | Block count (approx) |
|---|---|
| Calendar | hero, intro, key dates rows, calendar image, carnival video |
| Lunch | hero, 3 sections (daily / snack shack / allergy), video |
| Transportation | hero, section copy |
| Videos | hero + structured video list (Vimeo ID + title rows) |
| Camp Riverbend App | hero, overview, download (badges + URLs), features |
| Health & Safety | hero, overview, video, nurse, commitments, CTA |
| Programs | hero, intro, 3 program cards, learn-more cards |
| Clubhouse | hero, sections, photos, videos |
| Staff Info | hero, 2 videos, why, roles, dates, CTA with phones |
| Breene Family | hero, section headings (bios stay in `/admin/staff`) |
| Day Trippers | hero, overview, program, video, supervision, 2026 calendar, learn-more |
| Sports | hero, intro, 11 sport cards, video, learn-more |
| Riverbend Experience | hero, overview, video, typical day, supervision, 13 schedule PDFs, learn-more |
| Testimonials | hero, 13 camper quotes, 16 parent quotes, CTA |
| FAQ | hero, 6 categories of Q&A, CTA |
| Activities | hero, 7 sections, ninja chips, activity cards, videos |
| Rates, Dates & Application | already wired in Phase 1.x |
| About Riverbend | already wired in Phase 1.5 |

Implementation note: testimonials was converted from `"use client"` to a server component (regaining the `metadata` export). FAQ kept its client `FAQClient` for accordion state, but the page wrapper is now server.

### Phase 3 — Navigation (`fa1487f…2024322`)

- `nav_groups` / `nav_columns` / `nav_links` / `nav_featured_cards` tables, FK CASCADE delete.
- `getNavGroups()` reader with hardcoded fallback if DB read fails.
- `InnerPageLayout`, `(checkout)/layout.tsx`, and `(public)/page.tsx` now async — fetch nav, pass to `Navbar` as a prop.
- `Navbar` / `MobileNav` accept `navGroups` prop; the hardcoded `NAV_GROUPS` is only used as a dev fallback.
- **Mega menu now renders up to 2 featured cards per group** (stacked vertically in the existing featured column).
- **`/admin/navigation` editor**: edit groups (label, tagline), columns (heading + links), and featured cards (title, description, href, CTA, external flag). Each link row has a ⭐ button to promote it to a featured card. Reorder via up/down chevrons at every level. Hard cap of 2 featured cards per group enforced both client and server.
- **Live preview pane** at the top of the editor renders the actual mega menu for the currently-selected group, reflecting unsaved edits.
- `EXTERNAL_LINKS` constants (CampMinder URLs, social) are still file-based — moveable to DB later if needed.

### Phase 4 — Homepage (`0a643e9`)

The homepage is editable from `/admin/pages/home`, same Save Draft / Publish flow.

60+ blocks across 18 sections in the editor:

- **Hero** — overline, headline (2 lines), subtitle, primary button (label + URL), secondary button label, fallback image (used when video can't play).
- **Announcement bar** — message, link text, link URL.
- **Bento grid** — every visible card: 9 image cards + the live countdown tile (label, target ISO date, click URL) + the stat tile (number, label, URL). Layout / icons / cell sizes stay structurally fixed by index.
- **Philosophy section** — caption, heading (rich text, supports italic emphasis), body, two button labels + Story button URL.
- **Programs section** — section caption + heading + 3 program cards (badge, title, description as richtext, photo, two link/URL pairs each).

Hero **video URL** still code-managed — can be promoted to editable if requested.

### Phase 4.5 — Polish (this session)

- **Navigation preview** — `/admin/navigation` now shows a live mega-menu render at the top of the page, with tab buttons to switch between groups. Mirrors the public mega menu but without absolute positioning or framer-motion entrance, so admins see exactly what they're shipping before clicking Save All. (`src/components/admin/MegaMenuPreview.tsx`)
- **Site Settings + Favicon admin** — new `site_settings` table (key/value), `/api/site-settings` GET/PATCH endpoint, and `/admin/settings` page with a favicon picker (browse library or upload). Root layout now uses `generateMetadata()` to pull the favicon URL from DB; falls back to `/favicon.ico` if not set. Adds the foundation for future global settings (default OG image, contact info, etc.).
- **Migration v3** — picked up the Elementor hero backgrounds. The original Breeze-cached CSS bundles weren't being scanned; now the migration script fetches every linked stylesheet on each page and extracts `url(...)` references inside. Re-running added **17 net-new images** including the actual page-specific heroes (`Clubhouse-home-page-photo-scaled.jpg`, `DSC07006-scaled.jpg`, `IMG_1650-scaled.jpg`, `IMG_2726.jpg`, `ADV06620.jpg-marketing-1-scaled.jpg`, etc.).

---

## Old-site image migration — final tally

| Source | Count |
|---|---|
| Pre-existing in `image-manifest.json` (site/, staff/, products/) | 53 images |
| Legacy `documents` table (PDFs) | 17 documents |
| `migrate-old-site-images.ts` v1 (HTML scrape) | +77 images |
| `migrate-old-site-images.ts` v3 (CSS bundle scrape — Elementor heroes) | +17 images |
| **Library total** | **147 images + 17 documents** |

The script is idempotent on the unique `key` column. Re-run anytime the old site adds new content:

```sh
npx tsx scripts/migrate-old-site-images.ts
```

### Hero images now in `/admin/media` (use these to swap on each page's editor)

These are the page-specific heroes the old Elementor site used. Each one is now in the library — pick them via the MediaPicker in each page's hero block:

| New-site page | Old-site hero (search this in `/admin/media`) |
|---|---|
| `/about-riverbend` | `IMG_2726` |
| `/clubhouse` | `Clubhouse-home-page-photo-scaled` |
| `/riverbend-experience` | `DSC07006-scaled` |
| `/day-trippers` | `IMG_1650-scaled` |
| `/programs` | `ADV06620.jpg-marketing-1-scaled` |
| `/camp-riverbend-app` | `Camp-Riverbend-App-Mockup` |
| Various decorative bgs | `ADV02105-1`, `MEC_9066`, `ADV01253`, `ADV02244`, `ADV02081`, `DSC_0042` |

---

## Database schema additions (cumulative)

| Table | Purpose |
|---|---|
| `media_assets` | Unified images + documents library |
| `media_kind` enum | `image` / `document` |
| `page_content.draft_content_json` (column) | Pending unpublished edits |
| `page_content.draft_updated_at` (column) | Draft timestamp |
| `page_content.draft_updated_by` (column) | Draft author |
| `nav_groups` / `nav_columns` / `nav_links` / `nav_featured_cards` | Navigation mega menu |
| `site_settings` | Global key/value config |

All pushed to prod via `drizzle-kit push`. No SQL migration files (project uses push-based schema sync).

---

## API surface added

| Endpoint | Purpose |
|---|---|
| `GET / POST /api/media` | List, upload assets |
| `GET / PATCH / DELETE /api/media/[id]` | Read, edit metadata, delete |
| `POST /api/media/[id]/replace` | Replace blob in place (URL stays stable) |
| `GET /api/pages/[slug]` | Returns blocks in draft mode + `hasDraft` flag |
| `PUT /api/pages/[slug]/blocks/[key]` | Save a single block to draft |
| `POST /api/pages/[slug]/publish` | Promote drafts → live, snapshot prior published to revisions |
| `POST /api/pages/[slug]/discard-draft` | Clear unpublished drafts |
| `GET / PUT /api/navigation` | Read full nav tree / replace wholesale |
| `GET / PATCH /api/site-settings` | Read / write global settings (favicon etc.) |

---

## Admin sidebar (current order)

1. Dashboard
2. Pages
3. Navigation
4. Media
5. Documents
6. Staff
7. Products
8. Categories
9. Orders
10. Users
11. Settings

The vertical sidebar replaced the original horizontal flex-wrap nav, which was overflowing.

---

## Operational notes

- **Push-based schema** — to sync new schema changes: `DATABASE_URL=… npx drizzle-kit push --force`
- **Re-seed media library** — `npx tsx scripts/seed-media-library.ts` (idempotent)
- **Re-pull from old site** — `npx tsx scripts/migrate-old-site-images.ts` (idempotent)
- **No `Co-Authored-By` footers** — directive saved to memory, dropped from all future commits
- **Sanitize-html, not isomorphic-dompurify** — DOMPurify caused 500s on Vercel serverless because of JSDOM. Don't switch back without solving that root cause.

---

## Pending / queued

Not yet shipped, on the docket:

1. **Store simplification** — remove Stripe checkout, ship-to flow, etc. Move to "post to camp account manually" as the only payment method, with pickup at camp (no shipping rates). Existing `payment_method` enum already has `account_billing`; need to remove the public Stripe path and simplify the checkout form. ~half-day of work.
2. **Mobile mega menu featured cards** — currently desktop-only (matches prior behavior). Could surface on mobile if requested.
3. **`EXTERNAL_LINKS` to DB** — the CampMinder inquiry / camper-app / staff-app URLs are still file-managed in `src/lib/navigation.ts`. Could move to `site_settings` so admins can update without a deploy.
4. **History rewrite** — the user opted to leave past `Co-Authored-By` commits in place. Future commits are clean.

---

## How to test the deploy

1. Visit `/admin/pages` — every page is "Ready" with a description.
2. Open `/admin/pages/home` (or any other page). Make a small change. Click **Save Draft** — see the blue "1 block has unpublished draft changes" banner. Click **View Draft** — opens the public page in a new tab with `?preview=1`. Confirm change is visible only in preview tab. Click **Publish** — change goes live.
3. `/admin/navigation` — click any group label in the preview row at the top. The mega menu renders below. Edit a link, add a featured card, watch the preview update live. Click Save All when ready.
4. `/admin/media` — search `Clubhouse-home-page-photo` to find the clubhouse hero. Click into any asset; edit alt text; close. Try uploading a new image via the Upload button.
5. `/admin/settings` — pick a square PNG from the library or upload one as the favicon. Save. After deploy, browser tabs should show the new icon (may need a hard refresh / new tab).
6. `/admin/pages/clubhouse` (or riverbend-experience, day-trippers) — go to the Hero section, click Replace on the background image, search for the matching slug from the table above, pick it, Save Draft, View Draft to confirm it's the right image, then Publish.

---

## File changes by area (this session, end-to-end)

```
schema.ts                       +media_assets, +nav_*, +site_settings, +draft cols on page_content
src/lib/page-content.ts         draft/publish/discard, ReadMode arg
src/lib/preview-mode.ts         new — admin-cookie-gated ?preview=1 detector
src/lib/site-settings.ts        new — typed get/set for site_settings table
src/lib/navigation-db.ts        new — DB-backed nav reader with fallback
src/lib/home-content.ts         new — typed homepage content loader
src/lib/page-defaults/*.ts      new — 17 files (one per page + home)
src/lib/page-schemas/*.ts       new — 18 schemas + types

src/components/admin/
  GenericPageEditor.tsx         new — schema-driven editor
  MediaPicker.tsx               new — reusable media picker
  MegaMenuPreview.tsx           new — admin nav preview

src/app/admin/(authed)/
  layout.tsx                    horizontal nav → vertical sidebar with icons
  media/                        new — library page
  navigation/                   new — nav editor
  settings/                     new — site settings + favicon admin
  pages/[slug]/page.tsx         routes every editable slug to GenericPageEditor

src/app/api/
  media/                        new — full CRUD
  pages/[slug]/publish/         new
  pages/[slug]/discard-draft/   new
  navigation/                   new — wholesale GET/PUT
  site-settings/                new

src/app/(public)/*              every page rewritten to read from blocks
src/app/(public)/page.tsx       async, fetches nav + content
src/app/layout.tsx              generateMetadata reads favicon from DB
src/app/(checkout)/layout.tsx   async, fetches nav

src/components/navigation/
  Navbar.tsx                    accepts navGroups prop
  MobileNav.tsx                 accepts navGroups prop
  MegaMenu.tsx                  renders up to 2 featured cards
  InnerPageLayout.tsx           async, fetches nav

src/components/home/
  HomepageContent.tsx           accepts content + navGroups
  Hero.tsx                      accepts hero content
  BentoGrid.tsx                 accepts bento content
  HomepageLayout.tsx            removed (unused orphan)

scripts/
  seed-media-library.ts         new — bulk import
  seed-navigation.ts            new — copies hardcoded NAV_GROUPS to DB
  migrate-old-site-images.ts    new — v3, walks HTML + linked CSS
```
