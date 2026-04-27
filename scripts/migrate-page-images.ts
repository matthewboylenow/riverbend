/**
 * Migrate ALL remaining hero/page-header/gallery images to Vercel Blob:
 *  - 15 local files from public/images/ → blob `site/`
 *  - All cdn.campriverbend.com URLs hardcoded in tsx pages → blob `site/`
 *
 * Then rewrites source code so every `<Image src=...>` and `bgImage=...`
 * reference uses `/assets/<path>` (campriverbend.com via Next rewrite).
 *
 * Idempotent. Run via: tsx scripts/migrate-page-images.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { put, list } from "@vercel/blob";
import * as fs from "node:fs";
import * as path from "node:path";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN required");
}
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// CDN URLs found by grepping tsx files. Map each to a stable blob path.
const CDN_URLS: { url: string; blobPath: string }[] = [
  // camp-riverbend-app
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190056/MEC_9306.jpg", blobPath: "site/MEC_9306.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/06/15185945/apple-storeArtboard-1.png", blobPath: "site/apple-store-badge.png" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/06/15185945/google-play-badge.png", blobPath: "site/google-play-badge.png" },
  // calendar
  { url: "https://cdn.campriverbend.com/2026/01/23122356/2026-program-calendar-1-791x1024.png", blobPath: "site/2026-program-calendar.png" },
  // sports
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185907/DSC07326-scaled.jpg", blobPath: "site/DSC07326-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185908/DSC07389-scaled.jpg", blobPath: "site/DSC07389-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185908/DSC07606-scaled.jpg", blobPath: "site/DSC07606-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185909/MEC_9087-scaled.jpg", blobPath: "site/MEC_9087-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185910/DSC07242-scaled.jpg", blobPath: "site/DSC07242-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185911/DSC07236-scaled.jpg", blobPath: "site/DSC07236-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185912/DSC07032-scaled.jpg", blobPath: "site/DSC07032-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185912/DSC07402-scaled.jpg", blobPath: "site/DSC07402-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/2024/04/16124150/Volleyball-Riverbend.jpg", blobPath: "site/Volleyball-Riverbend.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185923/DSC07565.jpg-marketing-scaled.jpg", blobPath: "site/DSC07565-marketing-scaled.jpg" },
  // activities
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185914/ADV02128-scaled.jpg", blobPath: "site/ADV02128-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185917/ADV07000-scaled.jpg", blobPath: "site/ADV07000-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185918/DSC07172-scaled.jpg", blobPath: "site/DSC07172-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185919/ADV01095-scaled.jpg", blobPath: "site/ADV01095-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185914/ADV06848-scaled.jpg", blobPath: "site/ADV06848-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185915/ADV06766-scaled.jpg", blobPath: "site/ADV06766-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185903/DSC_0553-scaled.jpg", blobPath: "site/DSC_0553-scaled.jpg" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185913/ADV06281-scaled.jpg", blobPath: "site/ADV06281-scaled.jpg" },
  // staff
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2022/02/23171034/d-22-1024x682.jpg", blobPath: "site/d-22-1024x682.jpg" },
];

async function alreadyUploaded(pathname: string): Promise<boolean> {
  const r = await list({ prefix: pathname, token: TOKEN, limit: 1 });
  return r.blobs.some((b) => b.pathname === pathname);
}

async function uploadFromBuffer(blobPath: string, buffer: Buffer, contentType: string) {
  if (await alreadyUploaded(blobPath)) {
    return;
  }
  await put(blobPath, buffer, {
    access: "public",
    contentType,
    token: TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function uploadFromUrl(item: { url: string; blobPath: string }) {
  if (await alreadyUploaded(item.blobPath)) {
    return { ...item, skipped: true };
  }
  const res = await fetch(item.url);
  if (!res.ok) throw new Error(`fetch ${item.url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  await put(item.blobPath, buf, {
    access: "public",
    contentType,
    token: TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return { ...item, skipped: false };
}

function mimeFromExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return (
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    }[ext] || "application/octet-stream"
  );
}

async function uploadLocalImages() {
  console.log("\n— Local public/images → site/ —");
  const dir = "public/images";
  if (!fs.existsSync(dir)) {
    console.log("  (no public/images dir)");
    return [];
  }
  const files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  const results: { localFile: string; blobPath: string }[] = [];
  for (const file of files) {
    const localPath = path.join(dir, file);
    const blobPath = `site/${file}`;
    const buf = fs.readFileSync(localPath);
    await uploadFromBuffer(blobPath, buf, mimeFromExt(file));
    console.log(`  ✓ ${file} → ${blobPath}`);
    results.push({ localFile: file, blobPath });
  }
  return results;
}

async function uploadCdnImages() {
  console.log("\n— CDN URLs → site/ —");
  for (const item of CDN_URLS) {
    try {
      const r = await uploadFromUrl(item);
      console.log(`  ${r.skipped ? "·" : "✓"} ${item.blobPath}`);
    } catch (err) {
      console.error(`  ✗ ${item.blobPath}: ${(err as Error).message}`);
    }
  }
}

function rewriteSourceFiles(localImages: { localFile: string; blobPath: string }[]) {
  console.log("\n— Rewriting tsx source references —");
  const exts = [".tsx", ".ts"];
  const replacements: { from: string; to: string }[] = [];

  // Local: `/images/X` → `/assets/site/X`
  for (const li of localImages) {
    replacements.push({ from: `/images/${li.localFile}`, to: `/assets/${li.blobPath}` });
  }
  // CDN: full URL → `/assets/site/...`
  for (const c of CDN_URLS) {
    replacements.push({ from: c.url, to: `/assets/${c.blobPath}` });
  }

  function walk(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const out: string[] = [];
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next") continue;
        out.push(...walk(p));
      } else if (exts.includes(path.extname(e.name))) {
        out.push(p);
      }
    }
    return out;
  }

  const files = walk("src");
  let totalReplacements = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    let touched = false;
    for (const r of replacements) {
      if (content.includes(r.from)) {
        content = content.split(r.from).join(r.to);
        totalReplacements++;
        touched = true;
      }
    }
    if (touched) {
      fs.writeFileSync(file, content);
      console.log(`  ✓ ${file}`);
    }
  }
  console.log(`  → ${totalReplacements} replacements across ${files.length} files`);
}

async function main() {
  const local = await uploadLocalImages();
  await uploadCdnImages();
  rewriteSourceFiles(local);
  console.log("\n✅ Done. Verify with `grep -rn '/images/\\|cdn.campriverbend.com' src/`");
  console.log("   You can delete public/images/ once everything looks good.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
