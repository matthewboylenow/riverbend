/**
 * Migrate sample-schedule PDFs and the Day-Trippers calendar to Vercel Blob.
 * Idempotent.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { put, list } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN required");
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

interface Item {
  url: string;
  blobPath: string;
}

const ITEMS: Item[] = [
  // Clubhouse sample schedules
  { url: "https://cdn.campriverbend.com/2025/08/21114315/8-period-34-day.pdf", blobPath: "documents/schedules/clubhouse-three-quarter-day.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185946/8-period-full-day-pre-K-and-K.pdf", blobPath: "documents/schedules/clubhouse-full-day.pdf" },
  // Riverbend Experience sample schedules
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185952/8-period-1st-grade-boys.pdf", blobPath: "documents/schedules/1st-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185951/8-period-1st-grade-girls.pdf", blobPath: "documents/schedules/1st-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185951/8-period-2nd-grade-boys.pdf", blobPath: "documents/schedules/2nd-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185950/8-period-2nd-grade-girls.pdf", blobPath: "documents/schedules/2nd-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185950/8-period-3rd-grade-boys.pdf", blobPath: "documents/schedules/3rd-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185950/8-period-3rd-grade-girls.pdf", blobPath: "documents/schedules/3rd-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185949/8-period-4th-grade-boys.pdf", blobPath: "documents/schedules/4th-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185949/8-period-4th-grade-girls.pdf", blobPath: "documents/schedules/4th-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185948/8-period-5th-grade-boys.pdf", blobPath: "documents/schedules/5th-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185948/8-period-5th-grade-girls.pdf", blobPath: "documents/schedules/5th-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185948/8-period-6th-7th-grade-boys.pdf", blobPath: "documents/schedules/6th-7th-grade-boys.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185947/8-period-6th-7th-grade-girls.pdf", blobPath: "documents/schedules/6th-7th-grade-girls.pdf" },
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/05/15185947/8-period-8th-grade-coed.pdf", blobPath: "documents/schedules/8th-grade-coed.pdf" },
  // Camp map (alt PDF)
  { url: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185928/Camp-Riverbend-Map.pdf", blobPath: "documents/Camp-Riverbend-Map.pdf" },
  // Day Trippers calendar (PNG, but treated as document)
  { url: "https://cdn.campriverbend.com/2026/03/25095049/Day-Trippers-2026-1.png", blobPath: "site/Day-Trippers-2026.png" },
];

async function alreadyUploaded(pathname: string): Promise<boolean> {
  const r = await list({ prefix: pathname, token: TOKEN, limit: 1 });
  return r.blobs.some((b) => b.pathname === pathname);
}

async function main() {
  console.log("Migrating PDFs + Day Trippers calendar to Blob...");
  for (const item of ITEMS) {
    if (await alreadyUploaded(item.blobPath)) {
      console.log(`  · ${item.blobPath}  (skipped)`);
      continue;
    }
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "application/octet-stream";
      await put(item.blobPath, buf, { access: "public", contentType: ct, token: TOKEN, addRandomSuffix: false, allowOverwrite: true });
      console.log(`  ✓ ${item.blobPath}  (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ ${item.blobPath}: ${(err as Error).message}`);
    }
  }
  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
