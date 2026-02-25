# 09 — Camp Store (E-Commerce)

## Overview
Lightweight custom store replacing WooCommerce. ~24 camp merch products with size variants. Two checkout paths: Stripe for card payments, and "Bill to Camp Riverbend Account" for manual invoicing.

## Public Store Pages

### `/shop/` — Product Grid (`src/app/(public)/shop/page.tsx`)

**Server Component.** Fetch active products with categories from DB.

**Layout:**
- Page header: "Shop Riverbend Gear"
- Subtitle: "Camp Riverbend does not require campers to wear a camp uniform; each camper will receive one free camper t-shirt prior to the start of camp."
- External link: "Shop Trendy Camp Clothes" → https://yessirr.com/collections/campriverbend (opens new tab)
- Category filter tabs: All | Adult Clothing | Boys Clothing | Girls Clothing | Accessories | Backpacks
- Sort dropdown: Default | Price Low-High | Price High-Low | Newest
- Product grid: 4 columns desktop, 3 tablet, 2 mobile
- Each product uses `ProductCard` component

**ProductCard:**
- Square image (1:1)
- Product name
- Price (formatted: $25.00)
- Category badge
- If has variants: "Select Options" button → links to product detail
- If no variants: "Add to Cart" button → adds directly and opens cart drawer

### `/shop/[slug]` — Product Detail (`src/app/(public)/shop/[slug]/page.tsx`)

**Server Component** with **Client Component** for interactivity.

**Layout:**
- Back link → `/shop/`
- Two columns: Image gallery (left) | Product info (right)
- **Image gallery:** Main image + thumbnail strip. Click thumbnails to change main image. Images from product.images array.
- **Product info:**
  - Product name (h1)
  - Price
  - Category
  - Description (if exists)
  - Variant selector (radio buttons or dropdown for sizes)
  - Quantity selector (number input, min 1)
  - "Add to Cart" button (primary)
  - Disabled until variant selected (if product has variants)

**On Add to Cart:**
1. Add item to cart context (client-side state)
2. Show success toast
3. Open cart drawer

### Cart State Management

Use React Context + localStorage for cart persistence:

```typescript
// src/hooks/useCart.tsx
interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}
```

Wrap the app in `CartProvider` in the root layout.

### Cart Drawer — `components/shop/CartDrawer.tsx`

Slide-out from right. Shows:
- List of cart items (image, name, variant, price, quantity +/- buttons, remove)
- Subtotal
- "View Full Cart" link → `/cart`
- "Checkout" button → `/checkout`
- "Continue Shopping" to close

### `/cart` — Full Cart Page (`src/app/(checkout)/cart/page.tsx`)

Full-page cart view:
- Table/list of items with image, name, variant, unit price, quantity control, line total, remove
- Subtotal
- Shipping estimate (based on total weight, using shipping_rates table)
- "Proceed to Checkout" button
- "Continue Shopping" link

### `/checkout` — Checkout Page (`src/app/(checkout)/checkout/page.tsx`)

**Two-tab or two-path checkout:**

#### Path A: Pay with Card (Stripe)
1. Customer info: Name, Email, Phone
2. Shipping address: Line 1, Line 2, City, State, ZIP
3. Shipping method selection (from shipping_rates)
4. Order summary (items, subtotal, shipping, total)
5. "Pay Now" button → creates Stripe Checkout Session → redirects to Stripe

**Stripe Checkout Session creation** (`src/app/api/stripe/checkout/route.ts`):
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { items, customerInfo, shippingInfo, shippingCost } = await request.json();

  // Create order in DB with status 'pending'
  const order = await createOrder({
    ...customerInfo,
    shippingAddress: shippingInfo,
    paymentMethod: 'stripe',
    status: 'pending',
    items,
    shippingCost,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: `${item.productName}${item.variantName ? ` - ${item.variantName}` : ''}` },
        unit_amount: item.price, // in cents
      },
      quantity: item.quantity,
    })),
    // Add shipping as a line item
    ...(shippingCost > 0 && {
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingCost, currency: 'usd' },
          display_name: 'Shipping',
        },
      }],
    }),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    metadata: { orderId: order.id },
  });

  return Response.json({ url: session.url });
}
```

**Stripe Webhook** (`src/app/api/stripe/webhook/route.ts`):
```typescript
// Listen for checkout.session.completed
// Update order status to 'paid'
// Send confirmation email via Resend
```

#### Path B: Bill to Camp Riverbend Account
1. Customer info: Name, Email, Phone
2. **Camper Name** (required for account billing)
3. Shipping: option for pickup at camp (free) or ship (address required)
4. Order summary
5. "Place Order" button → creates order with status `pending_invoice`

**On submit:**
1. Create order in DB with `payment_method: 'account_billing'`, `status: 'pending_invoice'`
2. Send email to `abby@campriverbend.com` via Resend:
   ```
   Subject: New Camp Store Order #[number] — Account Billing
   
   A new order has been placed with account billing:
   
   Customer: [name]
   Email: [email]
   Camper: [camper name]
   Phone: [phone]
   
   Items:
   - [product] x [qty] — $[price]
   - ...
   
   Subtotal: $XX.XX
   Shipping: $X.XX
   Total: $XX.XX
   
   Shipping to: [address or "Pickup at Camp"]
   
   Please invoice this family's account.
   Manage this order: https://campriverbend.com/admin/orders/[id]
   ```
3. Send confirmation email to customer
4. Redirect to order confirmation page
5. Clear cart

### Order Confirmation Page — `/shop/order-confirmation`

- "Thank you for your order!"
- Order number
- Items ordered
- For Stripe: "Your payment has been received."
- For Account Billing: "Your order has been placed. Camp Riverbend will invoice your account."
- Link back to shop

## Email Templates

Use Resend with simple HTML emails (no need for React Email for this scope):

1. **Order confirmation to customer** (both payment methods)
2. **New account billing order notification** to abby@campriverbend.com
3. **Stripe payment received** confirmation

## Completion Criteria
- [ ] Product grid page with category filtering and sorting
- [ ] Product detail page with variant selection
- [ ] Cart context with localStorage persistence
- [ ] Cart drawer (slide-out)
- [ ] Full cart page with quantity controls
- [ ] Checkout page with two paths (Stripe + Account Billing)
- [ ] Stripe Checkout Session creation
- [ ] Stripe webhook handling
- [ ] Account billing order creation + email notification
- [ ] Order confirmation page
- [ ] Resend emails working
- [ ] Yessirr.com external link preserved
- [ ] Responsive at all breakpoints
