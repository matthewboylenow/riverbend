/**
 * Rewrite image URLs in the database from absolute Blob URLs to relative
 * `/assets/<path>` URLs that go through the Next.js rewrite to Vercel Blob.
 *
 * Idempotent — safe to run multiple times. Rows already on `/assets/...`
 * are skipped.
 *
 * Why: keeps every public-facing image on the campriverbend.com domain
 * (better for branding, caching, SEO), while still being served from Blob.
 *
 * Run via: tsx scripts/rewrite-image-urls.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL required");
}
if (!process.env.BLOB_STORE_ID) {
  throw new Error("BLOB_STORE_ID required (e.g. csohkuv0cnosh3u9)");
}

const BLOB_PREFIX = `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/`;

function rewrite(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (url.startsWith("/assets/")) return url; // already done
  if (url.startsWith(BLOB_PREFIX)) {
    return "/assets/" + url.slice(BLOB_PREFIX.length);
  }
  // also catch any blob URL from another store id, generically
  const generic = url.match(/^https:\/\/[^./]+\.public\.blob\.vercel-storage\.com\/(.+)$/);
  if (generic) {
    return "/assets/" + generic[1];
  }
  return url; // leave external CDN URLs alone
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function rewriteStaff() {
  const rows = await db.select().from(schema.staffMembers);
  let changed = 0;
  for (const row of rows) {
    const next = rewrite(row.photoUrl);
    if (next !== row.photoUrl) {
      await db
        .update(schema.staffMembers)
        .set({ photoUrl: next, updatedAt: new Date() })
        .where(eq(schema.staffMembers.id, row.id));
      changed++;
    }
  }
  console.log(`✓ staff_members: ${changed}/${rows.length} rewritten`);
}

async function rewriteProducts() {
  const rows = await db.select().from(schema.products);
  let changed = 0;
  for (const row of rows) {
    const original = (row.images as string[] | null) ?? [];
    const next = original.map((u) => rewrite(u) ?? u);
    const isDifferent = next.some((u, i) => u !== original[i]);
    if (isDifferent) {
      await db
        .update(schema.products)
        .set({ images: next, updatedAt: new Date() })
        .where(eq(schema.products.id, row.id));
      changed++;
    }
  }
  console.log(`✓ products: ${changed}/${rows.length} rewritten`);
}

async function main() {
  console.log(`Rewriting Blob URLs (${BLOB_PREFIX}) → /assets/*`);
  await rewriteStaff();
  await rewriteProducts();
  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("Rewrite failed:", err);
  process.exit(1);
});
