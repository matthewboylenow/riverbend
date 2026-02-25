# 10 — Admin Dashboard

## Overview
Protected admin area at `/admin/*` for managing products, orders, staff, and admin users. Uses NextAuth.js v5 with credentials provider. Role-based access: `super_admin` and `admin`.

## Authentication

### NextAuth Config — `src/lib/auth.ts`

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './db';
import { adminUsers } from './db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.email, credentials.email as string),
        });

        if (!user) return null;

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
});
```

### Auth API Route — `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

### Admin Layout — `src/app/admin/layout.tsx`

Wraps all admin pages. Checks for valid session. Redirects to `/admin/login` if not authenticated.

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar user={session.user} />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
```

### Admin Login Page — `src/app/admin/login/page.tsx`

Simple login form. Email + password. Submit → NextAuth signIn. On success → redirect to `/admin`. This page does NOT use the admin layout (it's the entry point).

### Admin Sidebar — `components/admin/AdminSidebar.tsx`

Fixed left sidebar (256px wide):
- Camp Riverbend logo (small)
- Nav links:
  - Dashboard (`/admin`)
  - Products (`/admin/products`)
  - Orders (`/admin/orders`)
  - Staff (`/admin/staff`)
  - Users (`/admin/users`) — **only visible to super_admin**
- Divider
- "View Site" link → `/` (opens new tab)
- User name + role
- Sign out button

## Admin Dashboard — `/admin` (`src/app/admin/page.tsx`)

Overview cards:
- Total active products
- Pending orders count
- Account billing orders awaiting invoice
- Total revenue (this month)

Recent orders table (last 10).

Quick links to common actions.

## Product Management — `/admin/products`

### Product List — `src/app/admin/products/page.tsx`

**Table view:**
| Image | Name | Price | Category | Variants | Active | Actions |
|-------|------|-------|----------|----------|--------|---------|

- Thumbnail image (small)
- Product name (link to edit)
- Price formatted
- Category name
- Variant count
- Active toggle (inline switch — updates via API)
- Actions: Edit | Duplicate | Delete

**Features:**
- Search by name
- Filter by category
- Filter by active/inactive
- "Add New Product" button
- Bulk actions: activate, deactivate

### Product Edit/Create — `src/app/admin/products/[id]/page.tsx`

**Form Fields:**
- **Name** (text, required)
- **Slug** (auto-generated from name, editable)
- **Description** (textarea)
- **Price** (number input, required)
- **Category** (select dropdown)
- **Images** (multi-image upload via Vercel Blob client-side)
  - Drag to reorder
  - Delete individual images
  - First image = primary/thumbnail
- **Requires Shipping** (toggle)
- **Weight (oz)** (number, for shipping calculation)
- **External URL** (optional — for linking to Yessirr.com)
- **Active** (toggle)

**Variants Section:**
- Table of variants below the main form
- Each variant: Name, SKU (optional), Stock (0 = unlimited), Active toggle
- "Add Variant" button
- Delete variant (with confirmation if it's been ordered)
- Drag to reorder

**Save:** Upsert product + variants. Revalidate `/shop` and `/shop/[slug]` paths.

**Easy Product Swapping:** The key workflow is seasonal product swaps. Admin should be able to:
1. Toggle a product inactive (hides from store instantly)
2. Create a new product (or duplicate an existing one and modify)
3. Toggle the new product active
This should feel effortless — no more than 2-3 clicks to swap a product.

### Product API Routes

- `GET /api/products` — List products (with query params for filtering)
- `POST /api/products` — Create product
- `GET /api/products/[id]` — Get single product
- `PUT /api/products/[id]` — Update product
- `DELETE /api/products/[id]` — Soft delete (set isActive = false)
- `PUT /api/products/[id]/variants` — Bulk update variants

## Order Management — `/admin/orders`

### Order List — `src/app/admin/orders/page.tsx`

**Table view:**
| # | Date | Customer | Items | Total | Payment | Status | Actions |
|---|------|----------|-------|-------|---------|--------|---------|

**Features:**
- Filter by status (tabs: All | Pending | Paid | Shipped | Fulfilled | Pending Invoice | Invoiced)
- Filter by payment method (All | Stripe | Account Billing)
- Search by customer name/email or order number
- Date range filter
- Sort by date (newest first default)

**Account Billing highlight:** Orders with `payment_method: 'account_billing'` and `status: 'pending_invoice'` should be visually prominent (badge, highlight color) so admin immediately sees orders that need manual invoicing.

### Order Detail — `src/app/admin/orders/[id]/page.tsx`

**Full order details:**
- Order number + date
- Status (with status change dropdown)
- Customer info (name, email, phone, camper name if account billing)
- Shipping address
- Payment method badge
- Stripe session link (if Stripe)
- Items table (product, variant, qty, unit price, line total)
- Subtotal, shipping, total
- Admin notes (textarea, editable)
- Status history / timeline

**Status Flow:**

For Stripe orders:
```
pending → paid (via webhook) → shipped (manual) → fulfilled (manual)
```

For Account Billing:
```
pending_invoice → invoiced (manual) → paid (manual) → shipped (manual) → fulfilled (manual)
```

Any order can be cancelled at any point.

**Status change:** Dropdown to change status. On change, updates DB and sends appropriate email to customer.

### Order API Routes

- `GET /api/orders` — List orders (with query params)
- `GET /api/orders/[id]` — Get single order with items
- `PUT /api/orders/[id]` — Update status/notes
- No create via API (orders created through checkout flow only)

## Admin User Management — `/admin/users`

**Super Admin Only.** Check `session.user.role === 'super_admin'` in both the page component and API routes.

### User List — `src/app/admin/users/page.tsx`

**Table:**
| Name | Email | Role | Created By | Created | Actions |
|------|-------|------|------------|---------|---------|

- "Add New Admin" button
- Edit role
- Delete user (cannot delete yourself, cannot delete last super_admin)
- Reset password

### Create/Edit User — `src/app/admin/users/[id]/page.tsx`

**Fields:**
- Name (required)
- Email (required, unique)
- Role (select: admin | super_admin)
- Password (required on create, optional on edit — blank = no change)

### User API Routes

- `GET /api/admin-users` — List all (super_admin only)
- `POST /api/admin-users` — Create new (super_admin only)
- `PUT /api/admin-users/[id]` — Update (super_admin only)
- `DELETE /api/admin-users/[id]` — Delete (super_admin only, with safeguards)

## Admin API Middleware

Create a helper to verify admin auth on all API routes:

```typescript
// src/lib/admin-auth.ts
import { auth } from './auth';

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function requireSuperAdmin() {
  const user = await requireAdmin();
  if (user.role !== 'super_admin') {
    throw new Error('Forbidden');
  }
  return user;
}
```

## Completion Criteria
- [ ] NextAuth credentials login working
- [ ] Admin layout with sidebar navigation
- [ ] Role-based route protection (super_admin vs admin)
- [ ] Dashboard with overview stats
- [ ] Product CRUD with image upload and variant management
- [ ] Product active/inactive toggle (easy seasonal swapping)
- [ ] Order list with filtering by status and payment method
- [ ] Order detail with status management
- [ ] Account billing orders prominently flagged
- [ ] Admin user CRUD (super_admin only)
- [ ] All API routes authenticated
- [ ] Cache revalidation on content changes
- [ ] Responsive admin UI (works on tablet at minimum)
