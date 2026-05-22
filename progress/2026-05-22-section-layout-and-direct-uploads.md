# Section reorder/hide + client-side uploads + Book a Tour email

**Date:** 2026-05-22
**Status:** Shipped. One follow-up batch remains: wiring 16 remaining public pages to honor section layout (Activities is wired; others get the controls in admin but the public render still uses schema order).

---

## 1. Book a Tour → mailto:info@campriverbend.com

Get Started mega-menu's "Book a Tour" text link now opens an email to `info@campriverbend.com` instead of the campintouch inquiry form.

- Updated source seed: `src/lib/navigation.ts` (link + featured-card fallback)
- Updated live DB row via `scripts/update-book-a-tour-to-email.ts` (idempotent — safe to re-run; targets only the Get Started group)
- **Featured-card status:** the Get Started featured-card area had already been customized via admin to two cards ("Camper Application" + "Request Information") — no "Book a Tour" card existed to swap. The "Request Information" card still points to the inquiry form. **Pending client decision** whether to (a) swap that card too, (b) add a new mailto card, or (c) leave it.

---

## 2. Client-side direct-to-Blob uploads with live % progress

**Root cause of "Upload failed" on <25MB files:** Vercel serverless functions cap request bodies at ~4.5MB regardless of our 25MB code check. Anything 5MB+ hit the platform limit before reaching the route handler.

**Fix:** browser uploads straight to Vercel Blob via `@vercel/blob/client.upload()`. The serverless function only mints a signed token. Real per-byte progress falls out of the SDK for free.

| File | Purpose |
|---|---|
| `src/app/api/blob/sign/route.ts` | `handleUpload` signing endpoint; auth-gated, allowed folders, 50MB cap |
| `src/app/api/media/register/route.ts` | After upload, registers the asset in `media_assets` |
| `src/app/api/media/[id]/replace/route.ts` | Now accepts JSON post-upload (was multipart) |
| `src/lib/client-upload.ts` | Shared `uploadToBlob` + `buildMediaPathname` helper |
| `src/components/admin/MediaPicker.tsx` | UploadPane → client upload + progress bar |
| `src/app/admin/(authed)/media/MediaLibrary.tsx` | UploadDialog + replace flow → client upload + progress bar |

Toast notifications already worked (sonner mounted in `src/app/admin/(authed)/layout.tsx`); they now fire with real success messages from the new flow.

The old `/api/media` POST (multipart) is still present but no longer called by the UI.

---

## 3. Section reorder + hide on every page

Sections are defined in code under `src/lib/page-schemas/*.ts`. Admins couldn't change which sections appear or in what order — they could only edit content within sections. Now they can drag-reorder and hide/show sections from the admin page editor.

### New DB table

`page_section_layout` — keyed by `(page_slug, section_key)`, holds `sort_order` + `hidden`. Absence of a row = schema default. Pushed via `drizzle-kit push`.

### Section keys

Added an explicit, stable `key` to `SectionSchema` (auto-derived from label as fallback). Populated explicit keys on `activities.ts` so admin reorder is durable across label renames. **Other schemas still use the label-derived fallback** — fine for now, but worth adding explicit keys before any label changes there.

### API

`GET /api/pages/[slug]/layout` → returns layout rows
`PUT /api/pages/[slug]/layout` → full replace (upsert + delete missing)

### Editor UI (`GenericPageEditor.tsx`)

- Drag handle (framer-motion `Reorder`) on every non-pinned section
- Hide/Show button per section; hidden sections render dimmed with a "Hidden" pill in the editor
- Page Header is pinned at the top (intentional — the breadcrumb hero shouldn't slide around)
- Saves to the layout endpoint immediately on each change (debounceless; each toggle/drag = one PUT)

**Also:** rows inside `rows`-type blocks (e.g. `activity_cards` with the "Canoeing" entry) are now drag-reorderable too. Same framer-motion `Reorder` pattern. Saves with the rest of the block on Save Draft.

### Public render

Activities page (`src/app/(public)/activities/page.tsx`) is fully wired — each section is built into a `renderedByKey` map and rendered in DB order, skipping hidden ones. The Page Header always renders first.

**Verified end-to-end:** hide → ninja-course disappears; reorder ninja to second → renders right after intro. Test layout state cleaned up after.

### Remaining work — wire the other 16 public pages

Each page that uses `GenericPageEditor` already shows the reorder/hide UI today. To make the public render actually honor the layout for pages other than Activities, repeat the Activities pattern (~25 lines per page):

1. Import `loadSectionVisibility` + the page's schema + `sectionKey`
2. Build a `renderedByKey` map (one entry per JSX section)
3. Render `reorderable.map(s => renderedByKey[s.key])` ordered + filtered by the layout

Pages still using static section order: about-riverbend, breene-family, calendar, camp-riverbend-app, clubhouse, day-trippers, faq, health-safety, lunch, programs, rates-dates-application-2026, riverbend-experience, sports, staff, testimonials, transportation, videos. (Home/videos may not need it depending on structure.)

---

## Touched files

```
M  src/lib/navigation.ts
A  scripts/update-book-a-tour-to-email.ts

A  src/app/api/blob/sign/route.ts
A  src/app/api/media/register/route.ts
M  src/app/api/media/[id]/replace/route.ts
A  src/lib/client-upload.ts
M  src/components/admin/MediaPicker.tsx
M  src/app/admin/(authed)/media/MediaLibrary.tsx

M  src/lib/db/schema.ts                       (page_section_layout)
M  src/lib/page-schemas/types.ts              (section key + helper)
M  src/lib/page-schemas/activities.ts         (explicit keys)
A  src/lib/page-section-layout.ts             (load/apply helpers)
A  src/app/api/pages/[slug]/layout/route.ts   (GET + PUT)
M  src/components/admin/GenericPageEditor.tsx (drag/hide + row reorder)
M  src/app/(public)/activities/page.tsx       (honors layout)
```
