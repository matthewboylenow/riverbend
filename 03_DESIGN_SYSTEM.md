# 03 — Design System

## Overview
Camp Riverbend's new site should feel warm, family-oriented, and premium — a modern 2026 camp website that respects the brand's 60+ year legacy while feeling fresh and current. NOT generic, NOT corporate, NOT "AI slop."

## Design Direction
**Tone:** Warm, inviting, energetic but grounded. Think "family-run institution with heart" not "startup" or "corporate brand."
**Aesthetic:** Clean editorial layout with organic warmth. Large photography, generous whitespace, playful but refined typography hierarchy. Subtle motion that feels alive, not gimmicky.

## Brand Colors

Extract from existing site (red/maroon is the primary brand color):

```css
:root {
  /* Primary — Camp Riverbend Red */
  --color-primary: #C41E3A;        /* Camp red — headers, CTAs, accents */
  --color-primary-dark: #9B1830;   /* Hover states, depth */
  --color-primary-light: #E8324F;  /* Lighter variant */

  /* Secondary — Nature */
  --color-forest: #2D5016;         /* Deep forest green */
  --color-sage: #7A8F6D;           /* Softer green for accents */
  --color-river: #3B7EA1;          /* River blue */
  --color-sky: #87CEEB;            /* Light sky blue */

  /* Neutrals — Warm Palette */
  --color-cream: #FAF7F2;          /* Page background — warm, not stark white */
  --color-sand: #F0EBE1;           /* Card backgrounds, sections */
  --color-stone: #D4CFC6;          /* Borders, dividers */
  --color-bark: #6B5B4E;           /* Secondary text */
  --color-charcoal: #2C2C2C;       /* Primary text */
  --color-white: #FFFFFF;          /* Pure white for contrast */

  /* Functional */
  --color-success: #2D7D46;
  --color-warning: #D4930A;
  --color-error: #C41E3A;
}
```

**IMPORTANT:** The cream background (`#FAF7F2`) is essential — pure white is too cold for a camp brand. Every section should alternate between cream and white (or cream and sand) to create visual rhythm.

## Typography

### Custom Font
The user will provide their custom font file. Load it as the **display/heading font** using `next/font/local` with CSS variable `--font-camp`.

### Body Font
Use a clean, warm sans-serif. Recommended: `DM Sans` from Google Fonts via `next/font/google`. It's humanist, warm, and extremely readable.

```typescript
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const campFont = localFont({
  src: '../../public/fonts/[FILENAME].woff2',
  variable: '--font-camp',
  display: 'swap',
});
```

### Type Scale
```css
/* Heading hierarchy — use --font-camp */
.h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
.h3 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; line-height: 1.2; }
.h4 { font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: 600; line-height: 1.3; }

/* Body — use --font-body (DM Sans) */
.body-lg { font-size: 1.125rem; line-height: 1.7; }
.body { font-size: 1rem; line-height: 1.7; }
.body-sm { font-size: 0.875rem; line-height: 1.6; }
.caption { font-size: 0.75rem; line-height: 1.5; letter-spacing: 0.05em; text-transform: uppercase; }
```

## Spacing System

Use Tailwind's default scale, but establish section rhythm:

```css
/* Section padding */
.section-padding { padding: clamp(4rem, 8vw, 8rem) 0; }
.section-padding-sm { padding: clamp(2rem, 4vw, 4rem) 0; }

/* Container */
.container-width { max-width: 1280px; margin: 0 auto; padding: 0 clamp(1rem, 4vw, 2rem); }
.container-narrow { max-width: 900px; }
.container-wide { max-width: 1440px; }
```

## Component Patterns

### Buttons
```
Primary:    bg-primary, text-white, rounded-full, px-8 py-3, hover:bg-primary-dark, transition
Secondary:  border-2 border-primary, text-primary, rounded-full, hover:bg-primary hover:text-white
Ghost:      text-charcoal, underline-offset-4, hover:text-primary
```

Buttons should feel tactile — slight scale on hover (`hover:scale-[1.02]`), smooth transitions (300ms).

### Cards
- Rounded corners (`rounded-2xl`)
- Subtle shadow that deepens on hover
- Image overflow with `rounded-t-2xl` or `rounded-2xl` with `overflow-hidden`
- Background: white or sand on cream sections

### Navigation
- Sticky header with backdrop-blur (`backdrop-blur-md bg-white/90`)
- Transparent on homepage hero, transitions to solid on scroll
- Mega menu for desktop (Future Families, Current Families, Get Started, Staff)
- Slide-out drawer for mobile
- Logo always visible

### Footer
- Dark background (charcoal or forest green)
- White text
- Camp Riverbend logo + ACA badge
- Contact info, social links, nav links
- "Want to visit?" CTA strip above footer

## Animation Principles

Use Framer Motion. Keep animations subtle and purposeful.

### Page Load
- Stagger reveal: elements fade up with 50ms delay between siblings
- Hero: image/video loads first, text animates in from left

### Scroll Animations
- Sections fade in as they enter viewport (IntersectionObserver or Framer `whileInView`)
- `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`
- Duration: 0.6s, ease: `[0.22, 1, 0.36, 1]` (custom ease-out)

### Hover States
- Cards: slight lift + shadow deepening
- Buttons: scale(1.02) + color shift
- Links: underline animation (width from 0 to 100%)
- Images: subtle scale(1.03) with overflow hidden

### Page Transitions
- Simple crossfade between routes (optional, don't overcomplicate)

## Image Treatment

- All images served through `/assets/*` rewrite (Vercel Blob)
- Use `next/image` with `sizes` prop for responsive loading
- Staff photos: consistent aspect ratio (3:4 portrait), `object-cover`
- Hero images: full-width, `object-cover`, with gradient overlay for text readability
- Product images: consistent square (1:1), white/clean background

## Responsive Breakpoints

Follow Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Mobile-first. Navigation switches to hamburger at `lg` breakpoint.

## Dark Section Pattern

Some sections (hero, CTA strips, footer) use dark backgrounds. Use:
- Background: `var(--color-charcoal)` or `var(--color-forest)`
- Text: white
- Accents: `var(--color-primary-light)` or `var(--color-sky)`

## Accessibility

- All interactive elements have focus-visible rings
- Color contrast meets WCAA AA minimum
- Alt text on all images
- Semantic HTML (proper heading hierarchy, landmarks)
- Skip-to-content link
- Keyboard navigable menus

## Completion Criteria
- [ ] CSS variables defined in globals.css
- [ ] Custom font loaded via next/font/local (or placeholder if file not yet provided)
- [ ] DM Sans loaded via next/font/google
- [ ] Tailwind theme extended with brand tokens
- [ ] Base component styles (buttons, cards) established
- [ ] Animation utilities defined
- [ ] Responsive container and section spacing ready
