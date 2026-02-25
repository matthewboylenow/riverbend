# 08 — All Remaining Pages

## Overview
After the homepage, about page, and breene family page are built and approved, build the remaining 19 pages. Each page follows the same pattern: PageHeader → Content Sections → CTA Strip → Footer. Most are straightforward content pages. The shop pages are covered in `09_STORE.md`.

## Shared Pattern for All Inner Pages
1. Page header (banner image + title)
2. Content sections using `Section` wrapper with alternating backgrounds
3. Images via `BlobImage` / `next/image`
4. Video embeds via `VideoEmbed` component where applicable
5. CTA Strip above footer
6. Footer
7. SEO metadata (title, description, og:image)

---

## Page-by-Page Specs

### 1. `/programs/` — Our Programs Hub

**Content:** Overview page that links to the three program pages. Display three `ProgramCard` components in a row:
- The Clubhouse (Ages 3-5) → `/clubhouse/`
- Riverbend Experience (Grades 1-8) → `/riverbend-experience/`
- Day Trippers (Grades 7-9) → `/day-trippers/`

Each card has a representative photo, program name, age range, short description, and "Learn More" link.

### 2. `/clubhouse/` — The Clubhouse

**Content to crawl from existing page.** Key elements:
- Program description for Pre-K3 through Kindergarten
- Activities offered for this age group
- Schedule/daily routine info
- Video embed (id="video" anchor)
- Photo gallery or featured images
- CTA: "Apply Now" + "Request Information"

### 3. `/riverbend-experience/` — Riverbend Experience

**Content to crawl from existing page.** Key elements:
- Program for Grades 1-8
- Activity rotation description
- Specialist activities
- Video embed (id="video" anchor)
- Photos
- CTA: "Apply Now" + "Request Information"

### 4. `/day-trippers/` — Day Trippers

**Content to crawl from existing page.** Key elements:
- Program for Grades 7-9
- Trip descriptions and destinations
- Overnight trip info
- Video embed (id="video" anchor)
- Photos
- CTA: "Apply Now" + "Request Information"

### 5. `/activities/` — Activities

**Content:** Comprehensive listing of all camp activities. The existing page has activity categories with descriptions and photos. Organize in a grid or categorized sections:
- Arts & Crafts
- Sports & Athletics
- Aquatics / Swimming
- Nature & Science
- Performing Arts
- Cooking
- Special Events

Each activity: name, short description, photo.

### 6. `/sports/` — Sports

**Content:** Sports-specific activities page. Subset of activities focused on athletics. May include:
- Soccer, basketball, baseball, tennis, volleyball, etc.
- Gaga (very popular at camps)
- Photos of each sport area

### 7. `/videos/` — Video Library

**Content:** Grid of Vimeo video embeds. Each video has a title and lazy-loaded embed.

**Layout:** Grid of video thumbnails. Click to play (either inline expand or modal). Responsive grid: 2 columns desktop, 1 mobile.

**Implementation:** Store video Vimeo URLs/IDs. Use `VideoEmbed` component for each. Consider showing poster images first, load iframe on click for performance.

### 8. `/testimonials/` — Testimonials

**Content:** Parent/family testimonials. Each testimonial has:
- Quote text
- Attribution (family name, year, or "Current Parent")

**Layout:** Masonry-style or stacked cards. Alternating subtle backgrounds. Large quotation mark decorative element. Consider a featured/hero testimonial at top, then grid below.

### 9. `/faq/` — Frequently Asked Questions

**Content:** Accordion-style Q&A. Use Radix Accordion component.

**Crawl existing FAQ content** from the current page. Common categories:
- Enrollment & Registration
- Schedule & Calendar
- What to Bring
- Food & Allergies
- Transportation
- Health & Safety
- Communication

Each Q&A: question (accordion trigger), answer (accordion content with rich text).

### 10. `/health-safety/` — Health & Safety

**Content:** Camp health and safety policies. Text-heavy page with sections:
- Health protocols
- Staff training
- Emergency procedures
- Nurse/medical staff on site
- COVID redirect catches old COVID page traffic (301 redirect configured)

### 11. `/lunch/` — Lunch & Snacks

**Content:** Information about the camp food program:
- Daily hot lunch provided
- Snack times
- Allergy accommodations
- Sample menus (if available)
- Photos of food/dining area

### 12. `/transportation/` — Transportation

**Content:** Bus transportation information:
- Bus routes and coverage areas
- Drop-off/pick-up procedures
- Drive-in option
- Bus monitors and safety
- Map or route coverage area

### 13. `/calendar/` — Camp Calendar

**Content:** Season dates and special events calendar.

**Options for implementation:**
- Simple table/grid of dates with descriptions
- Or embed an external calendar if they use one
- Include session start/end dates, special event days, holidays

### 14. `/staff/` — Staff Overview

**Content:** General information about the camp staff (separate from the Breene Family page).
- Staff philosophy and hiring standards
- "No CIT program" emphasis
- Training and qualifications
- Link to "Meet our Directors & Senior Staff" → `/breene-family/`
- Link to "Staff Application" → CampInTouch

### 15. `/rates-dates-application-2026/` — Rates, Dates & Application

**Content:** Enrollment information page:
- Session dates (weekly sessions, multi-week options)
- Pricing tables by program (Clubhouse, Riverbend Experience, Day Trippers)
- Early bird discounts or sibling discounts if applicable
- Application link → CampInTouch
- Payment schedule info

**Layout:** Clean pricing tables. Highlight most popular option. Clear CTA buttons to apply.

### 16. `/camp-riverbend-app/` — Camp Riverbend App

**Content:** Information about the camp's mobile app:
- What the app does (daily updates, photos, communication)
- Download links (iOS, Android)
- Screenshots or app previews
- Setup instructions for parents

### 17-19. `/shop/`, `/shop/[slug]`, `/cart`, `/checkout`

**Covered in `09_STORE.md`.**

---

## Content Crawling Instructions

For each page, Claude Code should:

1. **Fetch the existing page** from `https://campriverbend.com/[slug]/`
2. **Extract the main content** (ignore nav, footer, scripts)
3. **Preserve all text content** — copy verbatim into the new page
4. **Identify all images** — download and upload to Vercel Blob
5. **Identify video embeds** — extract Vimeo URLs/IDs
6. **Map to components** — use the shared component library

## Build Priority

After Phase 1 approval (homepage + about + breene family), build in this order:

**Tier 1 (Core enrollment funnel):**
1. `/programs/` + `/clubhouse/` + `/riverbend-experience/` + `/day-trippers/`
2. `/rates-dates-application-2026/`
3. `/activities/`

**Tier 2 (Supporting pages):**
4. `/faq/`
5. `/testimonials/`
6. `/videos/`
7. `/calendar/`

**Tier 3 (Informational):**
8. `/health-safety/`
9. `/lunch/`
10. `/transportation/`
11. `/staff/`
12. `/camp-riverbend-app/`
13. `/sports/`

**Tier 4 (Store):**
14. Shop pages (see `09_STORE.md`)

## Completion Criteria
- [ ] All 19 remaining pages built
- [ ] Content crawled from existing site and populated
- [ ] All images migrated to Vercel Blob
- [ ] Video embeds working
- [ ] Accordion FAQ functional
- [ ] All internal navigation links work
- [ ] All external links (CampInTouch) open in new tabs
- [ ] SEO metadata on every page
- [ ] Responsive at all breakpoints
- [ ] Consistent design system across all pages
