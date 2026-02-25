# 05 — Homepage

## Overview
The homepage is the first impression. It should communicate: "This is a warm, family-run summer day camp with 60+ years of tradition, incredible facilities, and a philosophy of confidence, not competition."

Design should feel modern 2026 — not a dated camp site. Think premium editorial meets outdoor warmth.

## Page: `src/app/(public)/page.tsx`

## Section 1: Hero (Full Viewport)

**Layout:** Full-screen hero (100vh) with video background.

**Video:** The existing site has a background video. For now, use a high-quality camp image as a fallback/poster. The video source will be from Vimeo or a self-hosted MP4 uploaded to Vercel Blob.

**Content (centered or left-aligned over video/image):**
- Tagline: "Where Tradition Meets Tomorrow"
- Subtitle: "A summer day camp for 3-14 year olds in Warren, New Jersey"
- Two buttons: "Learn More" (scrolls to programs section) + "Book A Tour" (→ CampInTouch inquiry form)

**Visual Treatment:**
- Dark gradient overlay on video/image for text readability
- Text animates in on page load (stagger: tagline → subtitle → buttons)
- Subtle scroll indicator (animated chevron or "scroll" text) at bottom

**Sound Toggle:** The current site has a sound on/off toggle for the hero video. Include this as a small button in the corner if video has audio.

## Section 2: Program Cards Grid

**Background:** Cream (`var(--color-cream)`)

**Heading:** "Our Programs" or omit heading — let the cards speak.

**Layout:** 2x4 grid on desktop, 2x columns on tablet, 1 column on mobile. Each card is a `LinkCard` component.

**Cards (8 total, matching current site):**
1. **Our Programs** → `/programs/` | Image: ADV06620.jpg
2. **Rates, Dates & Application 2026** → `/rates-dates-application-2026/` | Image: Canoe.jpg
3. **Legacy & Tradition** → `/about-riverbend/` | Image: ADV07104.jpg
4. **Activities** → `/activities/` | Image: ADV01169.jpg (tennis)
5. **Transportation** → `/transportation/` | Image: DSC06927.jpg
6. **Lunch & Snacks** → `/lunch/` | Image: IMG_370.jpg
7. **Health & Safety** → `/health-safety/` | Image: ADV06446.jpg
8. **Video Library** → `/videos/` | Image: ADV07400.jpg

Each card: full-bleed image with gradient overlay, title text, hover zoom effect.

**Animation:** Cards stagger in as section enters viewport.

## Section 3: Programs Detail

**Background:** White

**Layout:** Three program blocks stacked vertically, alternating image left/right.

### Block 1: The Clubhouse
- **Badge:** "Pre-K3 to Kindergarten"
- **Title:** "The Clubhouse"
- **Description:** "The Clubhouse is a wonderful introduction to the summer camp experience for campers aged three, four and five years old. They are introduced to arts and crafts, sports, cooking, nature, swimming and other fun activities geared to their age and ability that encourage growth, confidence and learning. Clubhouse campers also have the option of coming three, four or five days a week."
- **Links:** "Learn About The Clubhouse" → `/clubhouse/` | "A Day in the Life: Clubhouse" → `/clubhouse#video`
- **Image:** Right side, camp photo

### Block 2: Riverbend Experience
- **Badge:** "Grades 1 to 8"
- **Title:** "Riverbend Experience"
- **Description:** "Campers entering 1st through 8th grades explore, grow and gain confidence! During the day, each group rotates through seven different activities and has many new experiences. There are days packed full of fabulous activities and fun for kids; this is the place to make new friends and life-long memories!"
- **Links:** "Learn About Riverbend Experience" → `/riverbend-experience/` | "A Day in the Life: Riverbend Experience" → `/riverbend-experience#video`
- **Image:** Left side

### Block 3: Day Trippers
- **Badge:** "Grades 7 to 9"
- **Title:** "Day Trippers"
- **Description:** "The Day Trippers program takes young teens out of camp and on the road for day trips and short overnight trips in our region. You'll find us down at the beach and up in the mountains. We'll be boating, cooking, climbing, seeing the sights and exploring the world!"
- **Links:** "Learn About The Day Trippers" → `/day-trippers/` | "A Day in the Life: Day Trippers" → `/day-trippers#video`
- **Image:** Right side

### Layout Pattern:
Each block is a two-column layout (image + text) that alternates sides. On mobile, image stacks above text. Generous padding between blocks.

## Section 4: CTA Strip

Use the shared `CTAStrip` component:
- "Want to visit? Call us: 908-580-CAMP"
- "Apply Now!" → CampInTouch camper application
- "Interested? Request More Information" → CampInTouch inquiry form

## Section 5: Footer

Use the shared `Footer` component.

## Homepage-Specific Considerations

1. **Registration Banner:** The current site has a "Registration for Summer 2026 Now Open!" banner. Include this as a slim, dismissible announcement bar at the very top of the page (above the nav). Link to `/rates-dates-application-2026/`.

2. **SEO:**
   - Title: "Camp Riverbend | Summer Day Camp in Warren, NJ"
   - Meta description: "Camp Riverbend is a family-run summer day camp in Warren, New Jersey for ages 3-14. Over 60 years of tradition. Confidence, not competition."
   - Open Graph image: Hero image

3. **Performance:**
   - Hero image/video should be optimized (WebP, lazy video load)
   - Below-fold images use `loading="lazy"`
   - Program cards images are sized appropriately (768px wide max)

## Completion Criteria
- [ ] Hero section with video/image background, text overlay, CTAs
- [ ] Announcement bar at top
- [ ] 8-card grid section
- [ ] 3 program detail blocks with alternating layout
- [ ] CTA strip
- [ ] Footer
- [ ] Smooth scroll animations throughout
- [ ] Fully responsive at all breakpoints
- [ ] SEO metadata set
- [ ] All links work (internal + external)
