# 02 — Database (Neon + Drizzle)

## Overview
Set up Neon PostgreSQL with Drizzle ORM. This covers the full schema for: admin users, products, orders, staff members, shipping rates, and categories.

## Step 1: Database Connection

Create `src/lib/db/index.ts`:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## Step 2: Full Schema

Create `src/lib/db/schema.ts`:

```typescript
import {
  pgTable, uuid, text, timestamp, boolean, integer, decimal, jsonb, serial, pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const adminRoleEnum = pgEnum('admin_role', ['super_admin', 'admin']);
export const staffSectionEnum = pgEnum('staff_section', ['directors', 'division_heads', 'assistant_heads', 'founders']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'account_billing']);
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'paid', 'shipped', 'fulfilled', 'cancelled',
  'pending_invoice', 'invoiced'
]);

// ─── Admin Users ────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: adminRoleEnum('role').notNull().default('admin'),
  createdBy: uuid('created_by').references(() => adminUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Categories ─────────────────────────────────────────
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Products ───────────────────────────────────────────
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  images: text('images').array().default([]),
  isActive: boolean('is_active').default(true),
  requiresShipping: boolean('requires_shipping').default(true),
  weightOz: integer('weight_oz'),
  externalUrl: text('external_url'), // For Yessirr.com linked products
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Product Variants ───────────────────────────────────
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(), // e.g. "Youth S", "Adult M"
  sku: text('sku'),
  stock: integer('stock').default(0), // 0 = unlimited/not tracked
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
});

// ─── Orders ─────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: serial('order_number'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  camperName: text('camper_name'), // For account billing
  phone: text('phone'),
  shippingAddress: jsonb('shipping_address'), // { line1, line2, city, state, zip }
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  stripeSessionId: text('stripe_session_id'),
  status: orderStatusEnum('status').notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Order Items ────────────────────────────────────────
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  productName: text('product_name').notNull(), // Snapshot
  variantName: text('variant_name'),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// ─── Staff Members ──────────────────────────────────────
export const staffMembers = pgTable('staff_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  section: staffSectionEnum('section').notNull(),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Shipping Rates ─────────────────────────────────────
export const shippingRates = pgTable('shipping_rates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  minWeightOz: integer('min_weight_oz').default(0),
  maxWeightOz: integer('max_weight_oz'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
});

// ─── Relations ──────────────────────────────────────────
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
```

## Step 3: Drizzle Config

Create `drizzle.config.ts` at project root:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Step 4: Run Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Step 5: Seed Data

Create `src/lib/db/seed.ts`. Run with `npx tsx src/lib/db/seed.ts`.

### Seed Super Admin
```typescript
import { hash } from 'bcryptjs';
// Prompt for password or use env var
const passwordHash = await hash(process.env.ADMIN_INITIAL_PASSWORD || 'changeme', 12);

await db.insert(adminUsers).values({
  email: 'YOUR_EMAIL_HERE', // The super admin's email
  passwordHash,
  name: 'Admin',
  role: 'super_admin',
});
```

### Seed Categories
```typescript
const categoryData = [
  { name: 'Adult Clothing', slug: 'adult-clothing', sortOrder: 0 },
  { name: 'Boys Clothing', slug: 'boys-clothing', sortOrder: 1 },
  { name: 'Girls Clothing', slug: 'girls-clothing', sortOrder: 2 },
  { name: 'Accessories', slug: 'accessories', sortOrder: 3 },
  { name: 'Backpacks', slug: 'backpacks', sortOrder: 4 },
];
```

### Seed Products (24 products)
```typescript
const productData = [
  { name: 'Adult Performance Dri-Fit Long Sleeve Hoodie', slug: 'adult-performance-dri-fit-long-sleeve-hoodie', price: '25.00', category: 'adult-clothing', variants: ['Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Camp Riverbend Embroidered Backpack', slug: 'camp-riverbend-embroidered-backpack', price: '30.00', category: 'backpacks', variants: [] },
  { name: 'Camp Riverbend Performance Grey Hat (Adult)', slug: 'camp-riverbend-performance-grey-hat-adult', price: '25.00', category: 'adult-clothing', variants: [] },
  { name: 'Camp Riverbend White Hat (Adult)', slug: 'camp-riverbend-white-hat-adult', price: '25.00', category: 'adult-clothing', variants: [] },
  { name: 'Girls Ribbed Tank Tops (Red)', slug: 'girls-ribbed-tank-tops-red', price: '20.00', category: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L'] },
  { name: 'Kids Performance Dri-Fit Short Sleeve Hoodie', slug: 'kids-performance-dri-fit-short-sleeve-hoodie', price: '20.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Youth XL'] },
  { name: 'Camper T-Shirt', slug: 'camper-t-shirt', price: '12.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Camper Tank Top', slug: 'camper-tank-top', price: '15.00', category: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Crewneck Sweatshirt (Grey)', slug: 'crewneck-sweatshirt-grey', price: '30.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Crewneck Sweatshirt (Red)', slug: 'crewneck-sweatshirt-red', price: '30.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Hooded Sweatshirt (Red)', slug: 'hooded-sweatshirt-red', price: '30.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Hooded Sweatshirt (Grey)', slug: 'hooded-sweatshirt-grey', price: '30.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Boys / Mens Shorts', slug: 'boys-mens-shorts', price: '25.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Girls / Womens Shorts', slug: 'girls-womens-shorts', price: '25.00', category: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Rash Guard', slug: 'rash-guard', price: '30.00', category: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Socks', slug: 'socks', price: '12.00', category: 'accessories', variants: ['Youth', 'Adult'] },
  { name: 'Baseball Hats', slug: 'baseball-hats', price: '25.00', category: 'boys-clothing', variants: ['Youth', 'Adult'] },
  { name: 'Winter Beanie', slug: 'winter-beanie', price: '15.00', category: 'boys-clothing', variants: [] },
  { name: 'Gaga Gloves', slug: 'gaga-gloves', price: '25.00', category: 'accessories', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Neck Gaiter', slug: 'neck-gaiter', price: '5.00', category: 'boys-clothing', variants: [] },
  { name: 'Backpack #1', slug: 'backpack-1', price: '30.00', category: 'backpacks', variants: [] },
  { name: 'Lace Up Sweatshirt', slug: 'lace-up-sweatshirt', price: '30.00', category: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Duffel Bag', slug: 'duffel-bag', price: '35.00', category: 'backpacks', variants: [] },
  { name: 'Backpack (Original)', slug: 'backpack-original', price: '30.00', category: 'backpacks', variants: [] },
];
```

### Seed Staff Members (18 people)
```typescript
const staffData = [
  // Directors
  { name: 'Roger Breene', title: 'Director', section: 'directors', sortOrder: 0, bio: 'Roger Breene is Marianne and Harold\'s oldest child. Camp has been a part of Roger\'s life since it started in 1962. He was a camper, and then worked on the maintenance staff, as a swim instructor and lifeguard and then as the Waterfront Director. It was during his time as Waterfront Director that Roger met his wife, Debbie, who was then a counselor. To this day, she continues to serve as the head of F Division. Roger returned to Camp in approximately 1997 as an Assistant Director, after working full-time as a practicing attorney. Now retired from the practice of law, Roger loves to spend the off-season pursuing his hobbies, which include golf, cycling, skiing and paddle tennis, and of course visiting his grandchildren in Colorado and spending time with his grandchildren in Summit!' },
  { name: 'Jill Breene Cheng', title: 'Director', section: 'directors', sortOrder: 1, bio: 'Jill Breene Cheng has been at Camp Riverbend since she was 5 years old. She started typing camper lists (on a typewriter, with carbon paper!) while she was still in high school. She worked side by side with her Dad, Harold, learning how to run a camp from a very young age. Jill graduated from the College of New Jersey with a degree in Art Therapy. She has three children who have all been campers and counselors at Camp Riverbend and now is the grandmother to two girls and one boy. Her interests are travel and design and playing with her grandchildren.' },
  { name: 'Paul Breene', title: 'Director', section: 'directors', sortOrder: 2, bio: 'Paul Breene grew up at Riverbend and only left for a few years to get a law degree. Paul is married to our program director, Miriam Peretsman and is the father of two former campers and counselors. Paul loves everything about camp and looks forward every year to the first day of staff orientation, which is kind of like baseball spring training in that it is filled with anticipation of another great season with our incredibly talented and devoted staff. Paul loves to help lead morning assemblies and especially loves leading the campfires when D, E and F Division groups have their late nights. In his spare time, Paul gardens, skis, golfs (badly), and reads.' },
  { name: 'Robin Breene Hetrick', title: 'Waterfront Director', section: 'directors', sortOrder: 3, bio: 'Robin Breene Hetrick was too young to be a camper when Camp Riverbend opened, so she toddled around camp with her babysitter. Robin graduated from the University of Delaware with a degree in Physical Therapy. She worked as a physical therapist full time for 6 years and then came back to camp. Robin has been the Waterfront Director since the early 1990s. Both her daughters worked at camp and got married here too. In the off-season she spends time in Florida playing golf and of course swimming! Continuing a tradition started by her father, Robin does cartwheels every Friday afternoon to mark the successful completion of another week at camp.' },
  // Division Heads
  { name: 'Miriam Peretsman Breene', title: 'Program Director', section: 'division_heads', sortOrder: 0, bio: 'Miriam Peretsman Breene had her first summer camp experience as a Girl Scout on Long Island. She has been here at Camp Riverbend since 1988, first as the newspaper editor for one year, and then as the program director every year since then. Miriam studied at the University of Pennsylvania and she met her husband Paul Breene during her (and his) junior year abroad in London. Miriam likes to read, snowshoe, bake and travel.' },
  { name: 'Katie Higgins', title: 'Clubhouse Division Head', section: 'division_heads', sortOrder: 1, bio: 'Katie Higgins has a BA in Art Education and holds a MA in Early Childhood and Elementary Education. She is currently an Art Teacher at a local elementary school. She loves working with kids and getting them excited about new experiences! Katie remembers her first summer working as a junior counselor when she realized she wanted to continue to work with kids and make an impact in their lives. In her free time, Katie loves to travel, explore new places, go to museums, watch movies, snowboard and play sports.' },
  { name: 'Jenni Hetrick Lawrence', title: 'B Division Head', section: 'division_heads', sortOrder: 2, bio: 'Jenni Hetrick has been a Riverbender all her life and is part of the third generation of Breenes at Riverbend. She was a camper, a lifeguard, and a counselor before becoming a Division Head. Jenni has a Master\'s Degree in Elementary Education and worked as a teacher before becoming an Assistant Principal on the Upper West Side in Manhattan. Jenni currently lives in Hoboken and looks forward to the summer along with her two kids who are Riverbend regulars.' },
  { name: 'Mike Glackin', title: 'C Division Head', section: 'division_heads', sortOrder: 3, bio: 'Mike Glackin has been a counselor at Camp Riverbend since he was in college in 2005, following in the tracks of his mother who was a counselor in the 1970\'s. Mike is a high school teacher in Edison now. Mike met his wife Jen at Camp (another Riverbend romance) and at their wedding the happy couple came to Riverbend for a game of gaga after the ceremony! Now Mike and Jen have two kids who are also Riverbenders! Mike is an accomplished bagpiper who has performed at many of our Counselor Talent Shows.' },
  { name: 'Brian Bigelow', title: 'D Division Head', section: 'division_heads', sortOrder: 4, bio: 'Brian has been at Riverbend since 2005, as a group counselor and the Spirit specialist. During the school year, he teaches high school biology. Brian has degrees in Biology and Secondary Education. He\'s the father of two campers and, in his free time, he enjoys playing disc golf, coaching his son in soccer, beating Super Mario Odyssey, and obsessing over the 49ers, NJ Devils, and Yankees.' },
  { name: 'Jeff Kaesshaefer', title: 'E Division Head', section: 'division_heads', sortOrder: 5, bio: 'Jeff Kaesshaefer has worked at Riverbend since 2003. He has taught elementary physical education at South Mountain School in South Orange since 1997. Jeff has 3 kids, all of whom were Riverbend campers in their day and later became counselors. During the school year, he coaches boys and girls lacrosse in his home town. To stay active, Jeff likes to run, play basketball, and spend time outdoors.' },
  { name: 'Debbie Breene', title: 'F Division Head', section: 'division_heads', sortOrder: 6, bio: 'Debbie Breene met her husband Roger Breene at Camp Riverbend in 1977 and has been working at camp ever since that time. She was a Spanish teacher for 5 years, had her family and then taught at the Co-op Nursery School in Summit for 20 years. Debbie is a substitute teacher in Summit at several elementary schools. She enjoys mah jongg, skiing, collecting sea glass at the Jersey shore, cooking and exercising with her Peloton. Debbie and Roger have four grandchildren who attend camp during the summer.' },
  // Assistant Division Heads
  { name: 'Emily Tomasulo', title: 'Assistant Division Head', section: 'assistant_heads', sortOrder: 0, bio: 'Camp Riverbend has always been a summer home for Emily. She was a Riverbend camper for 10 years, then worked as an E Division group counselor before becoming an Assistant Division Head. During the year she is a fourth grade teacher in Scotch Plains. This year Emily became a mom, and is excited for the day her son will love Riverbend too! In her spare time, Emily loves to hike, travel, go to country concerts, and bake!' },
  { name: 'Samira Brito', title: 'Assistant Division Head', section: 'assistant_heads', sortOrder: 1, bio: 'Samira first worked as a counselor at Camp Riverbend in 2007. After a few years away, she returned to Camp in 2019 and has been hooked ever since. Samira holds a B.A. in English from Seton Hall University and is a Primary Lead teacher in a Montessori school in Jersey City. Samira is a proud daughter of Jersey City girl, but thoroughly enjoys her summers outdoors at Riverbend. In her free time, Samira is a full-time soccer mom who cheers her son on from the side lines.' },
  { name: 'Emily "Goldie" Goldstein', title: 'Assistant Division Head', section: 'assistant_heads', sortOrder: 2, bio: 'Emily has been teaching in Westfield for many years and takes great pride in her class, also known as "Goldie\'s Firsties". Emily has her Masters in Educational Leadership and Administration and an undergraduate sociology degree. She grew up going to day camp and loves that she gets to share the experience with her son. Emily likes to bake, listen to audiobooks and take walks outside.' },
  { name: 'Tamie Stearns', title: 'Assistant Division Head', section: 'assistant_heads', sortOrder: 3, bio: 'Tamie has been a Special Education teacher since 2008, when she graduated from Seton Hall University. She instantly fell in love with the energy and atmosphere of Camp Riverbend when she joined the staff in 2021. Tamie loves to spend time with her husband and her two daughters (aka "the ladies"). She\'s a self-proclaimed "foodie" with an appreciation for houseplants. Her summers are now dedicated to the ladies and Camp Riverbend.' },
  { name: 'Mike Wnoroski', title: 'Assistant Division Head', section: 'assistant_heads', sortOrder: 4, bio: 'Michael joined the Camp Riverbend team as a group counselor in 2019. He has worked as a public school counselor in Passaic County for over a decade, helping countless elementary and middle school students navigate their academic and personal challenges. In addition to his professional achievements, Mike is a proud parent; his daughter was a camper and now works here too! In his free time, Mike enjoys spending time with his family, exploring the great outdoors, and playing the guitar.' },
  // Founders
  { name: 'Harold Breene', title: 'Founder', section: 'founders', sortOrder: 0, bio: 'The late Harold Breene was involved in camping his whole life! After a stint in the Army during World War II, he earned a Masters Degree in Camping Education from NYU. He was the Athletic Director of a local private school, and then a college professor of Recreation and Camp Administration. Harold was a proud Eagle Scout, and was a scoutmaster in Berkeley Heights for many years. He was also a stalwart member of the American Camp Association, serving as President of the New Jersey section and of the Association of Independent Camps. He worked to improve camp quality nationwide as a member of the national ACA Standards Board. Harold passed away in 2019 but his legacy will continue to inspire generations of campers and counselors.' },
  { name: 'Marianne Breene', title: 'Founder', section: 'founders', sortOrder: 1, bio: 'The late Marianne Breene was the very first counselor for our preschool campers. For many years she was the director of the Summit Co-Op Nursery School. She earned a degree in Early Childhood Education from Kean University when her own children were in college and high school. She was an avid bridge player and loved to read and go to the theater. She and Harold had 4 children and 10 grandchildren, who have been campers and then counselors. Marianne passed away in 2017 but her values continue to inspire how Camp Riverbend is run.' },
];
```

### Seed Shipping Rates
```typescript
const shippingData = [
  { name: 'Standard Shipping', minWeightOz: 0, maxWeightOz: 32, price: '5.99' },
  { name: 'Standard Shipping (Heavy)', minWeightOz: 33, maxWeightOz: 160, price: '9.99' },
  { name: 'Free Pickup at Camp', minWeightOz: 0, maxWeightOz: null, price: '0.00' },
];
```

## Step 6: Seed Script Runner

The seed script should:
1. Hash the initial admin password
2. Insert admin user
3. Insert categories
4. Insert products with their variants
5. Insert staff members with bios
6. Insert shipping rates

Make it idempotent — check for existing data before inserting.

## Completion Criteria
- [ ] All tables created in Neon
- [ ] Drizzle schema compiles
- [ ] Migrations generated and applied
- [ ] Seed data inserted: 1 super admin, 5 categories, 24 products with variants, 18 staff members, 3 shipping rates
- [ ] `db` export works from `src/lib/db/index.ts`
