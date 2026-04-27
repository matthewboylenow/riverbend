/**
 * Migrate images from cdn.campriverbend.com → Vercel Blob, then update DB rows
 * to point at the new Blob URLs.
 *
 * Run via: npm run images:migrate
 *
 * Idempotent: skips uploads if a blob with the same pathname already exists
 * (matched by Vercel Blob's `list({ prefix })` lookup).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { put, list } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql as sqlOp } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { PRODUCTS } from "../src/lib/store-data";
import * as fs from "node:fs";
import * as path from "node:path";

if (!process.env.DATABASE_URL || !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("DATABASE_URL and BLOB_READ_WRITE_TOKEN required");
}

const dbSql = neon(process.env.DATABASE_URL);
const db = drizzle(dbSql, { schema });
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

interface MigrationItem {
  originalUrl: string;
  blobPath: string;
}

// Map staff name → blob path so we can update DB
const STAFF_PHOTO_MAP: Record<string, MigrationItem> = {
  "Roger Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111636/ROGER-1-scaled-e1700583441427.jpg",
    blobPath: "staff/roger-breene.jpg",
  },
  "Jill Breene Cheng": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111308/JILL-2-scaled-e1700583298834.jpg",
    blobPath: "staff/jill-breene-cheng.jpg",
  },
  "Paul Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Paul.jpg",
    blobPath: "staff/paul-breene.jpg",
  },
  "Robin Breene Hetrick": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Robin.jpg",
    blobPath: "staff/robin-breene-hetrick.jpg",
  },
  "Miriam Peretsman Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Miriam.jpg",
    blobPath: "staff/miriam-peretsman-breene.jpg",
  },
  "Katie Higgins": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Katie.jpg",
    blobPath: "staff/katie-higgins.jpg",
  },
  "Jenni Hetrick Lawrence": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185933/Jenni.jpg",
    blobPath: "staff/jenni-hetrick-lawrence.jpg",
  },
  "Mike Glackin": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Mike.jpg",
    blobPath: "staff/mike-glackin.jpg",
  },
  "Brian Bigelow": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185930/Brian.jpg",
    blobPath: "staff/brian-bigelow.jpg",
  },
  "Jeff Kaesshaefer": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185929/Jeff.jpg",
    blobPath: "staff/jeff-kaesshaefer.jpg",
  },
  "Debbie Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111829/DEBBIE-1-scaled-e1700583556726.jpg",
    blobPath: "staff/debbie-breene.jpg",
  },
  "Emily Tomasulo": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2022/01/04102033/Emily-Koprowski-2021-scaled.jpg",
    blobPath: "staff/emily-tomasulo.jpg",
  },
  "Samira Brito": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112004/SAMIRA-2-scaled-e1700583646185.jpg",
    blobPath: "staff/samira-brito.jpg",
  },
  'Emily "Goldie" Goldstein': {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112157/GOLDIE-scaled-e1700583751565.jpg",
    blobPath: "staff/emily-goldstein.jpg",
  },
  "Tamie Stearns": {
    originalUrl: "https://cdn.campriverbend.com/2024/05/01145618/IMG_9867-scaled.jpg",
    blobPath: "staff/tamie-stearns.jpg",
  },
  "Mike Wnoroski": {
    originalUrl: "https://cdn.campriverbend.com/2024/05/01150635/IMG_9873-scaled.jpg",
    blobPath: "staff/mike-wnoroski.jpg",
  },
  "Harold Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190100/Harold-Breene-LR.jpg",
    blobPath: "staff/harold-breene.jpg",
  },
  "Marianne Breene": {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190059/Marianne-Breene-LR.jpg",
    blobPath: "staff/marianne-breene.jpg",
  },
};

// Site / page-header images that pages reference
const SITE_IMAGES: MigrationItem[] = [
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190010/Camp-Riverbend-Logo-white-1.png",
    blobPath: "site/logo-white.png",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190012/ACA-logo-white.png",
    blobPath: "site/aca-logo-white.png",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185925/ADV06620.jpg-marketing-scaled.jpg",
    blobPath: "site/ADV06620.jpg-marketing-scaled.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/04/15185958/Canoe-768x512.jpg",
    blobPath: "site/canoe.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185921/ADV07104-768x512.jpg",
    blobPath: "site/ADV07104.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190040/ADV01169-768x512.jpg",
    blobPath: "site/ADV01169.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185922/DSC06927-768x512.jpg",
    blobPath: "site/DSC06927.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185906/IMG_370.jpg",
    blobPath: "site/IMG_370.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185926/ADV06446-scaled.jpg",
    blobPath: "site/ADV06446-scaled.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185924/ADV07400.jpg-marketing-scaled.jpg",
    blobPath: "site/ADV07400.jpg-marketing-scaled.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190025/ADV01122-1024x682.jpg",
    blobPath: "site/ADV01122.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2022/06/13143521/2022-Camp-Map-JPG-scaled.jpg",
    blobPath: "site/camp-map.jpg",
  },
  {
    originalUrl: "https://cdn.campriverbend.com/wp-content/uploads/2022/06/13143533/2022-Camp-Map-1.pdf",
    blobPath: "documents/camp-map.pdf",
  },
];

// Product images: use slug-based path so we can match DB rows
function productBlobPath(slug: string, originalUrl: string): string {
  const ext = path.extname(new URL(originalUrl).pathname).toLowerCase() || ".jpg";
  return `products/${slug}${ext}`;
}

async function alreadyUploaded(pathname: string): Promise<string | null> {
  const r = await list({ prefix: pathname, token: TOKEN, limit: 1 });
  const match = r.blobs.find((b) => b.pathname === pathname);
  return match ? match.url : null;
}

async function fetchAndUpload(item: MigrationItem): Promise<string> {
  const existing = await alreadyUploaded(item.blobPath);
  if (existing) {
    return existing;
  }
  const res = await fetch(item.originalUrl);
  if (!res.ok) {
    throw new Error(`Fetch ${item.originalUrl} → ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const blob = await put(item.blobPath, buf, {
    access: "public",
    contentType,
    token: TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

async function migrateStaff() {
  console.log("\n— Staff photos —");
  const manifest: Record<string, string> = {};
  for (const [name, item] of Object.entries(STAFF_PHOTO_MAP)) {
    try {
      const url = await fetchAndUpload(item);
      manifest[name] = url;
      // Store DB references as /assets/* (campriverbend.com domain via Next rewrite)
      const dbUrl = `/assets/${item.blobPath}`;
      await db
        .update(schema.staffMembers)
        .set({ photoUrl: dbUrl, updatedAt: new Date() })
        .where(eq(schema.staffMembers.name, name));
      console.log(`  ✓ ${name} → ${item.blobPath}`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${(err as Error).message}`);
    }
  }
  return manifest;
}

async function migrateSite() {
  console.log("\n— Site / page-header images —");
  const manifest: Record<string, string> = {};
  for (const item of SITE_IMAGES) {
    try {
      const url = await fetchAndUpload(item);
      manifest[item.blobPath] = url;
      console.log(`  ✓ ${item.blobPath}`);
    } catch (err) {
      console.error(`  ✗ ${item.blobPath}: ${(err as Error).message}`);
    }
  }
  return manifest;
}

async function migrateProducts() {
  console.log("\n— Product images —");
  const manifest: Record<string, string> = {};
  for (const p of PRODUCTS) {
    const newImages: string[] = [];
    for (let i = 0; i < p.images.length; i++) {
      const original = p.images[i];
      const blobPath = i === 0 ? productBlobPath(p.slug, original) : productBlobPath(`${p.slug}-${i}`, original);
      try {
        const url = await fetchAndUpload({ originalUrl: original, blobPath });
        newImages.push(`/assets/${blobPath}`);
        manifest[blobPath] = url;
      } catch (err) {
        console.error(`  ✗ ${p.slug} [${i}]: ${(err as Error).message}`);
        newImages.push(original);
      }
    }
    if (newImages.length) {
      // Drizzle's text().array() column — pass as array
      await db
        .update(schema.products)
        .set({ images: newImages, updatedAt: new Date() })
        .where(eq(schema.products.slug, p.slug));
      console.log(`  ✓ ${p.slug} (${newImages.length})`);
    }
  }
  return manifest;
}

async function main() {
  console.log("Migrating images: cdn.campriverbend.com → Vercel Blob");
  const staffManifest = await migrateStaff();
  const siteManifest = await migrateSite();
  const productManifest = await migrateProducts();

  const out = {
    migratedAt: new Date().toISOString(),
    staff: staffManifest,
    site: siteManifest,
    products: productManifest,
  };
  fs.mkdirSync("scripts", { recursive: true });
  fs.writeFileSync("scripts/image-manifest.json", JSON.stringify(out, null, 2));
  console.log("\n✅ Done. Manifest → scripts/image-manifest.json");
  // Suppress unused import warning; keep for future ad-hoc count queries
  void sqlOp;
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
