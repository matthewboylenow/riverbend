/**
 * Pulls every image currently referenced on campriverbend.com (the old
 * WordPress site), uploads each to Vercel Blob, and registers a row in
 * `media_assets` so admins can see/use them in the new media library.
 *
 *   1. Walk page-sitemap1.xml for all live pages
 *   2. Fetch each page's HTML, extract <img src>, <img srcset>, <source>,
 *      and inline style="background-image:url(...)" references
 *   3. Filter to campriverbend.com-hosted images, normalize WP size
 *      suffixes ("foo-300x200.jpg" → "foo.jpg") so we get originals
 *   4. Dedupe, skip already-imported (by key), upload missing ones
 *
 * Idempotent — keys are unique on `media_assets`, so re-running only
 * imports newly discovered images.
 *
 * Skipped pages: /shop /cart /checkout /my-account (commerce noise).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import slugify from "slugify";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const SITEMAP = "https://campriverbend.com/page-sitemap1.xml";
const ROOT_PAGE = "https://campriverbend.com/";
const SKIP_PATTERNS = [
  /\/shop\/?/,
  /\/cart\/?/,
  /\/checkout\/?/,
  /\/my-account\/?/,
  /\/(camp-during-covid)\/?/, // redirected on new site
  /\/(rates-dates-application-2025-draft)\/?/, // redirected on new site
];
const IMG_HOST_OK = /campriverbend\.com/i;
// Strip WordPress size suffixes: foo-300x200.jpg → foo.jpg
const WP_SIZE_RE = /-(\d{2,4})x(\d{2,4})(?=\.[a-zA-Z]{2,4}$)/;

async function fetchPageList(): Promise<string[]> {
  const xml = await fetch(SITEMAP).then((r) => r.text());
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return [ROOT_PAGE, ...urls].filter(
    (u) => !SKIP_PATTERNS.some((re) => re.test(new URL(u).pathname))
  );
}

interface FoundImage {
  rawUrl: string;
  /** URL with WP size suffix stripped — what we actually fetch & store */
  originalUrl: string;
  alt: string;
  source: string;
}

function extractImagesFromHtml(html: string, sourcePage: string): FoundImage[] {
  const found: FoundImage[] = [];

  // <img src="..." alt="...">
  for (const match of html.matchAll(
    /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?[^>]*>/gi
  )) {
    found.push(toFoundImage(match[1], match[2] || "", sourcePage));
  }

  // srcset entries — pick the largest
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/gi)) {
    const candidates = match[1]
      .split(",")
      .map((c) => c.trim().split(/\s+/));
    for (const [url] of candidates) {
      if (url) found.push(toFoundImage(url, "", sourcePage));
    }
  }

  // background-image: url(...)
  for (const match of html.matchAll(/background-image\s*:\s*url\(["']?([^"')]+)/gi)) {
    found.push(toFoundImage(match[1], "", sourcePage));
  }

  return found.filter((f) => IMG_HOST_OK.test(f.rawUrl));
}

function toFoundImage(rawUrl: string, alt: string, sourcePage: string): FoundImage {
  // Strip query strings (?w=, ?ssl=, etc)
  const noQuery = rawUrl.split("?")[0];
  const originalUrl = noQuery.replace(WP_SIZE_RE, "");
  return { rawUrl: noQuery, originalUrl, alt: alt.trim(), source: sourcePage };
}

function deriveKey(url: string): string {
  // /wp-content/uploads/2024/05/ADV01122-1024x683.jpg → "old-2024-05-adv01122"
  const path = new URL(url).pathname.replace(/^\//, "");
  const noExt = path.replace(/\.[a-z0-9]+$/i, "");
  // wp-content/uploads/2024/05/foo → 2024-05-foo
  const trimmed = noExt
    .replace(/^wp-content\/uploads\//, "")
    .replace(/\//g, "-");
  return slugify(`old-${trimmed}`, { lower: true, strict: true });
}

function deriveTitle(url: string): string {
  const path = new URL(url).pathname;
  const base = path.split("/").pop() || path;
  return base.replace(/\.[a-z0-9]+$/i, "");
}

function inferContentType(url: string): string {
  const ext = url.toLowerCase().split(".").pop()?.split("?")[0] || "";
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

async function main() {
  console.log("Fetching page list…");
  const pages = await fetchPageList();
  console.log(`  ${pages.length} pages to scan\n`);

  console.log("Scanning pages for images…");
  const byOriginalUrl = new Map<string, FoundImage>();
  for (const page of pages) {
    try {
      const html = await fetch(page).then((r) => r.text());
      const found = extractImagesFromHtml(html, page);
      for (const img of found) {
        // Keep the first occurrence (so alt text from a regular <img> wins
        // over an empty alt from srcset / background-image of the same file)
        if (!byOriginalUrl.has(img.originalUrl)) {
          byOriginalUrl.set(img.originalUrl, img);
        } else if (!byOriginalUrl.get(img.originalUrl)!.alt && img.alt) {
          byOriginalUrl.set(img.originalUrl, img);
        }
      }
      console.log(`  ${page} → ${found.length} refs (${new Set(found.map(f=>f.originalUrl)).size} unique)`);
    } catch (e) {
      console.warn(`  ! failed ${page}: ${(e as Error).message}`);
    }
  }
  const all = [...byOriginalUrl.values()];
  console.log(`\n${all.length} unique images discovered.\n`);

  console.log("Importing missing into media library…");
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const img of all) {
    const key = deriveKey(img.originalUrl);

    // Skip if already imported (idempotent)
    const existing = await db
      .select({ id: schema.mediaAssets.id })
      .from(schema.mediaAssets)
      .where(eq(schema.mediaAssets.key, key))
      .limit(1);
    if (existing.length) {
      skipped++;
      continue;
    }

    try {
      // Fetch the original-size image. If 404 (some old links broken),
      // fall back to the raw URL we found in the HTML.
      let res = await fetch(img.originalUrl);
      let usedUrl = img.originalUrl;
      if (!res.ok && img.rawUrl !== img.originalUrl) {
        res = await fetch(img.rawUrl);
        usedUrl = img.rawUrl;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} on ${img.originalUrl}`);
      const buf = Buffer.from(await res.arrayBuffer());

      const ext = (usedUrl.split(".").pop() || "jpg").toLowerCase().split("?")[0];
      const blobPath = `site/migrated/${key}.${ext}`;
      await put(blobPath, buf, {
        access: "public",
        contentType: inferContentType(usedUrl),
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      await db.insert(schema.mediaAssets).values({
        kind: "image",
        key,
        title: deriveTitle(usedUrl),
        alt: img.alt || null,
        blobPath,
        url: `/assets/${blobPath}`,
        contentType: inferContentType(usedUrl),
        sizeBytes: buf.length,
      });

      inserted++;
      if (inserted % 10 === 0) console.log(`  …${inserted} imported so far`);
    } catch (e) {
      console.warn(`  ! ${img.originalUrl}: ${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\n✓ inserted ${inserted}, skipped ${skipped} (already present), failed ${failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
