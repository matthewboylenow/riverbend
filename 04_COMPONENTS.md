# 04 — Shared Components

## Overview
Build the reusable component library. Every page on the site shares these components. Build them first, then assemble pages.

## Component Inventory

### 1. Navigation — `components/navigation/Navbar.tsx`

**Desktop (≥1024px):**
- Sticky header, full width
- On homepage hero: transparent background, white text/logo
- On scroll (or on inner pages): solid white/cream background with backdrop-blur, dark text
- Left: Camp Riverbend logo (white version on transparent, color version on solid)
- Center/Right: Four mega menu triggers: "Future Families", "Current Families", "Get Started", "Staff"
- Far right: "RIVERBEND STORE" button link + "Family Log-In" link
- Phone number (908-580-CAMP) in top bar above nav, with social icons (Facebook, Instagram, Vimeo)

**Mega Menu Panels:**
Each menu trigger opens a full-width dropdown panel. See 01_PROJECT_SETUP.md for the complete nav structure. The mega menu should:
- Animate in smoothly (fade + slight translateY)
- Have organized columns of links
- Close on click outside or on Escape key
- Highlight external links (CampInTouch) subtly

**Mobile (<1024px):**
- Hamburger icon → slide-out drawer from right
- Full-screen overlay
- Accordion sections for each menu group
- Phone number, social links, and Store/Login buttons prominent
- Close button (X) top right

**External Links (open in new tab):**
```
Family Login:     https://riverbend.campintouch.com/v2/login/login.aspx?
Inquiry Form:     https://riverbend.campintouch.com/v2/family/inquiryForm.aspx
Camper App:       https://riverbend.campintouch.com/ui/forms/application/camper/App#ApplicationSeason
Staff App:        https://riverbend.campintouch.com/ui/forms/application/staff/App
Yessirr Store:    https://yessirr.com/collections/campriverbend
```

### 2. Footer — `components/navigation/Footer.tsx`

Dark background (charcoal or deep forest green). Contains:

**Left Column:**
- Camp Riverbend logo (white)
- Address: 116 Hillcrest Road, Warren, NJ 07059
- Phone: (908) 580-CAMP / (908) 580-2267
- Email: info@campriverbend.com

**Center Columns:**
- Quick links organized by category (Future Families, Current Families, Programs)

**Right Column:**
- ACA accreditation badge (white version)
- Social media links (Facebook, Instagram, Vimeo)

**Bottom Bar:**
- © 2026 Camp Riverbend. All rights reserved.
- Privacy Policy link → http://riverbend.campintouch.com/privacy-policy/

### 3. CTA Strip — `components/ui/CTAStrip.tsx`

A persistent call-to-action bar that appears above the footer (and optionally between sections). Three-column layout:

```
[ Want to visit?         ] [ Apply Now!              ] [ Interested?               ]
[ Call us: 908-580-CAMP  ] [ → CampInTouch App Link  ] [ Request More Information   ]
```

- Background: primary red or charcoal
- Text: white
- Each is a clickable link/button
- On mobile: stacks vertically

### 4. Hero Section — `components/home/Hero.tsx`

Full-viewport hero with video background. Details in `05_HOMEPAGE.md`.

### 5. Section Wrapper — `components/ui/Section.tsx`

Reusable section component that handles:
- Alternating backgrounds (cream/white/sand)
- Consistent padding (section-padding)
- Container width
- Optional anchor ID for in-page navigation
- Framer Motion `whileInView` animation

```tsx
interface SectionProps {
  id?: string;
  bg?: 'cream' | 'white' | 'sand' | 'dark';
  size?: 'default' | 'narrow' | 'wide';
  children: React.ReactNode;
}
```

### 6. Page Header — `components/ui/PageHeader.tsx`

Used on all inner pages (not homepage). Contains:
- Full-width background image or solid color
- Page title (h1) overlaid
- Optional subtitle
- Breadcrumb navigation

### 7. Card Components

**Program Card** — `components/ui/ProgramCard.tsx`
- Image (top)
- Title
- Age/grade range badge
- Short description
- "Learn More" link
- Hover: image subtle zoom, shadow deepens

**Link Card** — `components/ui/LinkCard.tsx`
- Image background with gradient overlay
- Title text overlay
- Clickable, full card is link
- Used on homepage grid (Activities, Transportation, etc.)

**Staff Card** — `components/ui/StaffCard.tsx`
- Portrait photo (3:4 ratio)
- Name (h4)
- Title (caption style)
- Click/tap to expand bio (accordion or modal)
- Used on /breene-family/ page

**Product Card** — `components/shop/ProductCard.tsx`
- Product image (1:1 square)
- Product name
- Price
- Category badge
- "Select Options" or "Add to Cart" button
- Link to product detail page

### 8. Accordion — `components/ui/Accordion.tsx`

Use Radix UI Accordion. Used for:
- FAQ page
- Mobile navigation
- Staff bio expansion

### 9. Video Embed — `components/ui/VideoEmbed.tsx`

Responsive Vimeo embed wrapper:
- 16:9 aspect ratio container
- Lazy loading (only load iframe when in viewport)
- Optional poster image before play
- Privacy-enhanced mode

### 10. Button — `components/ui/Button.tsx`

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'white';
  size: 'sm' | 'md' | 'lg';
  href?: string; // If provided, renders as <Link>
  external?: boolean; // Opens in new tab
  children: React.ReactNode;
}
```

### 11. Image with Blob — `components/ui/BlobImage.tsx`

Wrapper around `next/image` that:
- Accepts either a full Blob URL or an `/assets/...` path
- Handles responsive sizes
- Adds blur placeholder if available
- Consistent rounded corners and object-fit

### 12. Toast / Notification — `components/ui/Toast.tsx`

Use Radix UI Toast for:
- Cart add confirmation
- Form submission success
- Error messages

### 13. Cart Drawer — `components/shop/CartDrawer.tsx`

Slide-out drawer from right showing:
- Cart items with quantity controls
- Item total
- Subtotal
- "View Cart" and "Checkout" buttons
- Uses React Context for cart state (see `09_STORE.md`)

## Shared Utilities

### `components/ui/Container.tsx`
```tsx
export function Container({ size = 'default', children, className }: {
  size?: 'narrow' | 'default' | 'wide';
  children: React.ReactNode;
  className?: string;
}) {
  const widths = {
    narrow: 'max-w-[900px]',
    default: 'max-w-[1280px]',
    wide: 'max-w-[1440px]',
  };
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', widths[size], className)}>
      {children}
    </div>
  );
}
```

### `components/ui/AnimateIn.tsx`
Framer Motion wrapper for scroll-triggered animations:
```tsx
export function AnimateIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

## Build Order
1. Button, Container, Section, AnimateIn (base utilities)
2. Navbar + MobileNav + MegaMenu
3. Footer + CTAStrip
4. PageHeader
5. Card variants (Program, Link, Staff, Product)
6. Accordion, VideoEmbed, Toast
7. BlobImage
8. CartDrawer

## Completion Criteria
- [ ] All 13+ components built and exported
- [ ] Navigation works on desktop and mobile with all menu items
- [ ] Footer renders with all content and links
- [ ] Card components accept props and render correctly
- [ ] Animations smooth and performant
- [ ] Components use design system tokens (colors, fonts, spacing)
- [ ] All external links open in new tabs
- [ ] Mobile responsive at all breakpoints
