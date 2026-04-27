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

// ─── Page Content (CMS) ─────────────────────────────────
// One row per (page_slug, block_key). block_type tells the renderer how to
// interpret content_json:
//   - "richtext"  → { html: string }   (TipTap output, sanitized)
//   - "text"      → { value: string }  (single-line plain text — titles, subtitles)
//   - "image"     → { url: string, alt?: string }
//   - "document"  → { url: string, label?: string }
//   - "rows"      → { rows: Array<Record<string, string>> }  (structured tables)
export const pageContent = pgTable('page_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageSlug: text('page_slug').notNull(),
  blockKey: text('block_key').notNull(),
  blockType: text('block_type').notNull(),
  contentJson: jsonb('content_json').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id),
});

// Up to 5 prior revisions per (page_slug, block_key). App code trims older.
export const pageContentRevisions = pgTable('page_content_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageSlug: text('page_slug').notNull(),
  blockKey: text('block_key').notNull(),
  blockType: text('block_type').notNull(),
  contentJson: jsonb('content_json').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => adminUsers.id),
});

// ─── Documents (PDFs etc.) ──────────────────────────────
// Logical handles for PDFs/files admins manage. The CMS references these
// by id so replacing a file updates every page that uses it.
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(), // stable identifier e.g. "1st-grade-boys-schedule"
  title: text('title').notNull(),
  blobPath: text('blob_path').notNull(), // e.g. "documents/schedules/1st-grade-boys.pdf"
  blobUrl: text('blob_url').notNull(), // absolute Blob URL (or /assets/... if rewritten)
  contentType: text('content_type'),
  sizeBytes: integer('size_bytes'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
  uploadedBy: uuid('uploaded_by').references(() => adminUsers.id),
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
