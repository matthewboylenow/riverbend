# 06 — About Page

## Overview
The About page (`/about-riverbend/`) is the most content-diverse page on the site. It contains text sections, images, video, a downloadable PDF, anchor-linked sections, and links to the staff page. Building this page validates the full component library.

## Page: `src/app/(public)/about-riverbend/page.tsx`

## SEO
- Title: "About Camp Riverbend | Legacy & Tradition Since 1962"
- Meta description: "Founded in 1962 by the Breene family, Camp Riverbend in Warren, NJ has hosted generations of families. ACA accredited since season one."

## Section 1: Page Header

**Full-width header banner** with camp photo background.
- Subtitle (above title, small caps): "Camp Riverbend has hosted generations of families for over 60 years in Warren Township, New Jersey"
- Title: "Legacy & Tradition"
- Link: "Meet our Directors & Senior Staff" → `/breene-family/`

## Section 2: Legacy Content (id="legacy")

**Background:** Cream

**Content:**
"Founded by Marianne and Harold Breene in 1962, Camp Riverbend is a family affair. The four Breene children—Roger, Jill, Paul and Robin, and daughters-in-law Debbie and Miriam, now run the camp, and the newest generation of Breene great-grandchildren are becoming campers! Each member of the family is here to provide a personal, hands-on camp experience you'll never forget! Camp Riverbend is proud to be accredited by the American Camp Association, and has been since its very first season. Camp Riverbend traditions create lifelong memories for campers."

Include a prominent video embed here (Vimeo) — "Watch the video to learn more!"

CTA button: "Meet our Directors & Senior Staff" → `/breene-family/`

## Section 3: Our Philosophy (id="philosophy")

**Background:** White

**Layout:** Two columns — text left, image right.

**Image:** `ADV01122-1024x682.jpg` (camper and staff member talking)

**Content:**
"Our philosophy builds 'confidence, not competition!' We honor each camper's talents and efforts. Camp Riverbend is a place where each child can be themself, explore the world and learn new skills in a fun and supportive environment. We encourage every camper to participate in all activities and we applaud every achievement – from a camper's first at-bat to a grand-slam home run!"

**Design note:** The phrase "confidence, not competition" should be visually emphasized — larger text, different color, or pull-quote treatment.

## Section 4: Camp Map & Location (id="facilities-location")

**Background:** Cream

**Content:**
"Located in beautiful Somerset County, just 35 minutes from NYC, Camp Riverbend sits on a 30-acre site along the Passaic River. The environment is perfect for explorers of all ages, with vibrant woods, open fields, nature trails, a wetlands sanctuary, athletic facilities and the river bank. Take a look at all the activities and amenities Camp Riverbend has to offer!"

**Elements:**
- "Book A Tour" CTA button
- Contact info callout: "Call or email us to book a tour"
- "Request More Information" link → CampInTouch inquiry form
- "Download Camp Map" link → PDF download (stored in Vercel Blob)
- Full camp map image: `2022-Camp-Map-JPG-scaled.jpg` (clickable to enlarge/download)
- Alongside photo: `ADV01134.jpg`

## Section 5: Our Staff (id="staff")

**Background:** White

**Pull Quote:** "A camp is only as good as its counselors."

**Content:**
"We take pride in our mature, talented staff of dedicated teachers and enthusiastic college students and older high school students, many of whom were once Riverbend campers themselves. There is no CIT program."

**Video embed** — "Watch the video to learn more!"

**CTAs:**
- "Apply to Join Our Staff" → CampInTouch staff application
- "Meet our Directors & Senior Staff" → `/breene-family/`

## Section 6: Learn More Links

**Background:** Cream

Quick links grid (3 columns):
- "Activities Offered" → `/activities/`
- "Rates & Dates" → `/rates-dates-application-2026/`
- "Our Programs" → `/programs/`

## Section 7: CTA Strip + Footer

Shared components.

## Anchor Navigation

The About page uses anchor links from the main navigation:
- `#philosophy` → scrolls to Philosophy section
- `#facilities-location` → scrolls to Map section
- `#staff` → scrolls to Staff section

Implement smooth scrolling with offset for the sticky header height. Each section should have the corresponding `id` attribute.

## Completion Criteria
- [ ] Page header with background image
- [ ] Legacy section with video embed
- [ ] Philosophy section with "confidence, not competition" emphasis
- [ ] Camp map section with downloadable PDF and image
- [ ] Staff section with video embed and CTAs
- [ ] Learn more links grid
- [ ] Anchor navigation works from main nav
- [ ] Smooth scroll with header offset
- [ ] All images loaded via BlobImage/next/image
- [ ] Fully responsive
- [ ] CTA strip and footer
