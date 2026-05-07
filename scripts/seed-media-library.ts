/**
 * One-time bulk import for the unified media library:
 *   1. Pulls every blob already migrated to Vercel Blob (per scripts/image-manifest.json)
 *      and registers it in `media_assets` with kind = 'image' or 'document'.
 *   2. Migrates every row from the legacy `documents` table into `media_assets`
 *      (kind = 'document') so the new library has full coverage from day one.
 *
 * Idempotent — keys are unique, existing rows are skipped.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

interface Manifest {
  site?: Record<string, string>;
  staff?: Record<string, string>;
  products?: Record<string, string>;
}

const MANIFEST_PATH = path.resolve(__dirname, "image-manifest.json");

function makeKey(blobPath: string): string {
  // "site/ADV06620.jpg-marketing-scaled.jpg" -> "site-adv06620-jpg-marketing-scaled"
  const noExt = blobPath.replace(/\.[a-z0-9]+$/i, "");
  return slugify(noExt.replace(/\//g, "-"), { lower: true, strict: true });
}

function inferContentType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() || "";
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

function titleFromPath(blobPath: string): string {
  const base = blobPath.split("/").pop() || blobPath;
  return base.replace(/\.[a-z0-9]+$/i, "");
}

async function importBlob(args: {
  kind: "image" | "document";
  blobPath: string;
  title?: string;
}): Promise<"inserted" | "skipped"> {
  const key = makeKey(args.blobPath);
  const existing = await db
    .select()
    .from(schema.mediaAssets)
    .where(eq(schema.mediaAssets.key, key))
    .limit(1);
  if (existing.length) return "skipped";

  await db.insert(schema.mediaAssets).values({
    kind: args.kind,
    key,
    title: args.title || titleFromPath(args.blobPath),
    blobPath: args.blobPath,
    url: `/assets/${args.blobPath}`,
    contentType: inferContentType(args.blobPath),
  });
  return "inserted";
}

async function main() {
  console.log("Seeding media library…");

  // 1. Manifest-tracked blobs ----------------------------------------------
  let manifest: Manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
  } else {
    console.warn(`Manifest not found at ${MANIFEST_PATH}; skipping image import`);
  }

  let inserted = 0;
  let skipped = 0;

  // site/* — mostly images, a few docs (camp-map.pdf etc)
  for (const blobPath of Object.keys(manifest.site || {})) {
    const kind: "image" | "document" = blobPath.toLowerCase().endsWith(".pdf")
      ? "document"
      : "image";
    const r = await importBlob({ kind, blobPath });
    r === "inserted" ? inserted++ : skipped++;
  }

  // staff/* — name-keyed in the manifest, derive blobPath from the URL
  for (const [name, url] of Object.entries(manifest.staff || {})) {
    const blobPath = url.split(".vercel-storage.com/")[1];
    if (!blobPath) continue;
    const r = await importBlob({ kind: "image", blobPath, title: name });
    r === "inserted" ? inserted++ : skipped++;
  }

  // products/*
  for (const blobPath of Object.keys(manifest.products || {})) {
    const r = await importBlob({ kind: "image", blobPath });
    r === "inserted" ? inserted++ : skipped++;
  }

  // 2. Migrate legacy documents table -------------------------------------
  const legacyDocs = await db.select().from(schema.documents);
  for (const d of legacyDocs) {
    const key = `doc-${d.key}`;
    const existing = await db
      .select()
      .from(schema.mediaAssets)
      .where(eq(schema.mediaAssets.key, key))
      .limit(1);
    if (existing.length) {
      skipped++;
      continue;
    }
    await db.insert(schema.mediaAssets).values({
      kind: "document",
      key,
      title: d.title,
      blobPath: d.blobPath,
      url: d.blobUrl,
      contentType: d.contentType,
      sizeBytes: d.sizeBytes,
      uploadedAt: d.uploadedAt,
      uploadedBy: d.uploadedBy,
    });
    inserted++;
  }

  console.log(`✓ inserted ${inserted}, skipped ${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
