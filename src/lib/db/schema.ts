import {
  pgTable, uuid, text, timestamp, boolean, integer, decimal, jsonb, serial, pgEnum, unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ──────────────────────────────────────────────
export const adminRoleEnum = pgEnum('admin_role', ['super_admin', 'admin']);
export const staffSectionEnum = pgEnum('staff_section', ['directors', 'division_heads', 'assistant_heads', 'founders']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'account_billing']);
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'paid', 'shipped', 'fulfilled', 'cancelled',
  'pending_invoice', 'invoiced'
]);
export const contentTypeEnum = pgEnum('content_type', ['text', 'rich_html']);

// ─── Admin Users ────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: adminRoleEnum('role').notNull().default('admin'),
  createdBy: uuid('created_by'),
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
  externalUrl: text('external_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Product Variants ───────────────────────────────────
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  sku: text('sku'),
  stock: integer('stock').default(0),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
});

// ─── Orders ─────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: serial('order_number'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  camperName: text('camper_name'),
  phone: text('phone'),
  shippingAddress: jsonb('shipping_address'),
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
  productName: text('product_name').notNull(),
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

// ─── Tuition Rates (Rates/Dates/Application page) ───────
export const tuitionRates = pgTable('tuition_rates', {
  id: uuid('id').primaryKey().defaultRandom(),
  duration: text('duration').notNull(), // "7 Weeks", "Any 6 Weeks", etc.
  inCamp: text('in_camp').notNull(),           // "$8,375"
  dayTripper: text('day_tripper').notNull(),   // "$9,170"
  threeQuarter: text('three_quarter').notNull(), // "$7,450"
  sortOrder: integer('sort_order').default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Tuition Discounts ──────────────────────────────────
export const tuitionDiscounts = pgTable('tuition_discounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  heading: text('heading').notNull(),
  body: text('body').notNull(),
  sortOrder: integer('sort_order').default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Payment Schedule ───────────────────────────────────
export const paymentSchedule = pgTable('payment_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),   // "At Application"
  detail: text('detail').notNull(), // "$500 deposit per camper..."
  sortOrder: integer('sort_order').default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Site Settings (singleton-style key/value) ──────────
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Page Content (CMS for public pages) ────────────────
// One row per (page_slug, section_key) — each is an editable content block
export const pageContent = pgTable(
  'page_content',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pageSlug: text('page_slug').notNull(),         // e.g. "homepage", "rates-dates-application-2026"
    sectionKey: text('section_key').notNull(),     // e.g. "hero_title", "intro_body"
    label: text('label').notNull(),                // Human-readable name for admin UI
    contentType: contentTypeEnum('content_type').notNull().default('text'),
    content: text('content').notNull().default(''),
    sortOrder: integer('sort_order').default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pageSection: unique('page_content_page_section_unique').on(t.pageSlug, t.sectionKey),
  })
);

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
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
