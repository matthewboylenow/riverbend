# 07 — Breene Family / Directors & Staff Page

## Overview
The `/breene-family/` page displays all directors, division heads, assistant division heads, and founders with their photos, names, titles, and bios. The content is fully managed through the admin backend — no code changes needed to update staff.

## Public Page: `src/app/(public)/breene-family/page.tsx`

### SEO
- Title: "Directors & Senior Staff | Camp Riverbend"
- Meta description: "Meet the Breene family and senior staff who have been running Camp Riverbend since 1962."

### Data Fetching
Server component. Fetch all active staff members from DB, ordered by section then sort_order:

```typescript
const staff = await db.query.staffMembers.findMany({
  where: eq(staffMembers.isActive, true),
  orderBy: [asc(staffMembers.sortOrder)],
});

const directors = staff.filter(s => s.section === 'directors');
const divisionHeads = staff.filter(s => s.section === 'division_heads');
const assistantHeads = staff.filter(s => s.section === 'assistant_heads');
const founders = staff.filter(s => s.section === 'founders');
```

### Page Layout

**Header:**
- "BACK" link → `/about-riverbend/`
- Title: "Directors & Senior Staff"

**Section 1: Directors**
No section heading needed (or subtle one). Display 4 directors in a grid.

**Section 2: Division Heads**
Display 7 division heads in a grid.

**Section 3: Assistant Division Heads**
Display 5 assistant division heads in a grid.

**Section 4: Founders**
Special treatment — slightly different visual styling to honor the founders. Maybe a different background color (sand), or a border treatment. Display 2 founders side by side.

### Staff Card Design

Each staff member uses the `StaffCard` component:

**Layout Option A — Expandable Cards:**
- Photo (3:4 portrait, `object-cover`, rounded)
- Name (h4, bold)
- Title (caption, muted color)
- Click/tap → expands to show full bio below the card (accordion-style)
- Bio text in readable body font, generous line-height

**Layout Option B — Grid with Modal:**
- Same photo/name/title layout
- Click → opens a modal/dialog with full bio and larger photo
- Better for mobile since bios are long

**Recommended: Option A (expandable).** It keeps users on the page and feels more natural for browsing. Use Radix Accordion underneath, one item open at a time per section.

**Grid:** 3 columns on desktop, 2 on tablet, 1 on mobile. Cards should be evenly spaced with generous gap.

**Photo treatment:** All photos should be consistently sized. Apply consistent crop/aspect ratio. Some original photos are landscape, some portrait — normalize to 3:4 portrait with `object-cover object-top` (faces are usually in the top half).

### CTA Strip + Footer

Shared components at bottom.

---

## Admin Page: `src/app/admin/staff/page.tsx`

### Admin Staff List View

**Layout:** Table or sortable card grid showing all staff members.

**Columns/Fields:**
- Drag handle (for reordering)
- Photo thumbnail (small)
- Name
- Title
- Section (badge)
- Active toggle (switch)
- Edit button
- Delete button (soft delete — confirm dialog)

**Features:**
- Filter by section (tabs: All | Directors | Division Heads | Assistant Heads | Founders)
- Drag-and-drop reordering within sections (update `sort_order` in DB)
- Quick toggle active/inactive
- "Add New Staff Member" button

### Admin Staff Edit/Create: `src/app/admin/staff/[id]/page.tsx`

**Form Fields:**
- **Photo:** Image upload area. Click to upload or drag-and-drop. Shows current photo preview. Uploads via Vercel Blob client-side upload (see `11_IMAGES.md` for upload implementation). Max display size ~400px. Accepts JPG, PNG, WebP.
- **Name:** Text input (required)
- **Title:** Text input (required) — e.g. "Director", "Clubhouse Division Head"
- **Section:** Select dropdown — Directors, Division Heads, Assistant Division Heads, Founders (required)
- **Bio:** Rich text editor using Tiptap. Supports: bold, italic, links. No need for images/headings in bios — keep it simple. Stores HTML in DB.
- **Active:** Toggle switch

**Save Button:** Creates or updates the staff member. On save:
1. Validate required fields
2. If new photo uploaded, confirm Blob URL is stored
3. Upsert to DB
4. Redirect to staff list with success toast
5. Revalidate the public `/breene-family/` page cache (`revalidatePath`)

### API Routes

**`src/app/api/staff/route.ts`** — GET (list all), POST (create new)
**`src/app/api/staff/[id]/route.ts`** — GET (single), PUT (update), DELETE (soft delete)
**`src/app/api/staff/reorder/route.ts`** — PUT (accepts array of { id, sortOrder })

All admin API routes must verify the admin session (NextAuth).

### Photo Upload Flow

```
1. User clicks "Upload Photo" in admin form
2. Client-side: call /api/upload to get a Vercel Blob upload token
3. Client-side: upload directly to Vercel Blob (bypasses 4.5MB server limit)
4. On success: receive Blob URL
5. Store Blob URL in the photo_url field
6. On the public page, photos served via /assets/* rewrite
```

Upload API route (`src/app/api/upload/route.ts`):
```typescript
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => {
      // Verify admin session here
      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
      };
    },
    onUploadCompleted: async ({ blob }) => {
      // Optional: log upload, process image
    },
  });
  return Response.json(jsonResponse);
}
```

## Completion Criteria
- [ ] Public page fetches staff from DB and renders by section
- [ ] Staff cards with photos, names, titles, expandable bios
- [ ] Consistent photo sizing/cropping
- [ ] Admin list view with section filtering
- [ ] Drag-and-drop reordering that persists
- [ ] Admin create/edit form with all fields
- [ ] Photo upload via Vercel Blob (client-side)
- [ ] Rich text bio editor (Tiptap)
- [ ] Active/inactive toggle
- [ ] Soft delete with confirmation
- [ ] API routes protected by admin auth
- [ ] Cache revalidation on save
- [ ] Fully responsive
