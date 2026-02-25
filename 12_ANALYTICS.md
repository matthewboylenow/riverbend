# 12 — Analytics

## Overview
Two analytics systems: Fathom Analytics (primary, privacy-first) and Facebook Pixel (retained from existing site for ad targeting).

## Fathom Analytics

### Setup
1. Create a Fathom account at usefathom.com
2. Add site: campriverbend.com
3. Get the Site ID
4. Set `NEXT_PUBLIC_FATHOM_SITE_ID` in `.env.local`

### Implementation

Install Fathom's official Next.js package:
```bash
npm install fathom-client
```

Create a Fathom provider component (`src/components/analytics/FathomAnalytics.tsx`):

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { load, trackPageview } from 'fathom-client';

export function FathomAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID!, {
      auto: false, // We'll track manually for SPA navigation
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackPageview({
      url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}
```

Add to root layout (`src/app/layout.tsx`):
```tsx
import { Suspense } from 'react';
import { FathomAnalytics } from '@/components/analytics/FathomAnalytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Suspense fallback={null}>
          <FathomAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
```

### Custom Events (optional)
Track key conversion events:
```typescript
import { trackEvent } from 'fathom-client';

// On "Apply Now" click
trackEvent('apply_now_click');

// On store purchase
trackEvent('store_purchase', { _value: totalInCents });

// On "Request Info" click
trackEvent('request_info_click');
```

## Facebook Pixel

### Setup
Pixel ID: `2163419317208125` (existing, keep)

### Implementation

Create a Facebook Pixel component (`src/components/analytics/FacebookPixel.tsx`):

```typescript
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !window.fbq) return;
    window.fbq('track', 'PageView');
  }, [pathname]);

  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
```

Add TypeScript declaration for fbq (`src/types/facebook.d.ts`):
```typescript
interface Window {
  fbq: (...args: any[]) => void;
  _fbq: (...args: any[]) => void;
}
```

Add to root layout alongside Fathom.

### Facebook Pixel Events
```typescript
// Store purchase
window.fbq('track', 'Purchase', { value: total, currency: 'USD' });

// Add to cart
window.fbq('track', 'AddToCart', { value: price, currency: 'USD' });

// Initiate checkout
window.fbq('track', 'InitiateCheckout');
```

## Performance Considerations

- Both scripts load `afterInteractive` (not blocking render)
- Fathom is ~1KB — negligible impact
- Facebook Pixel is heavier but loads async
- Neither requires a cookie consent banner (Fathom is cookieless; FB Pixel uses first-party cookies)

## Completion Criteria
- [ ] Fathom tracks all page views including SPA navigation
- [ ] Facebook Pixel fires PageView on all pages
- [ ] Both load without blocking initial render
- [ ] Custom events fire on key actions (Apply Now, Add to Cart, Purchase)
- [ ] TypeScript types for fbq
- [ ] No console errors
