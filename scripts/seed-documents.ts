/**
 * Seed the documents table with the PDFs/calendars already in Vercel Blob,
 * so they show up in /admin/documents and clients can replace them.
 *
 * Idempotent. Run after migrate-pdfs.ts (which puts the actual files in Blob).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const DOCS = [
  // Riverbend Experience schedules
  { key: "1st-grade-boys-schedule", title: "1st Grade — Boys (sample schedule)", blobPath: "documents/schedules/1st-grade-boys.pdf" },
  { key: "1st-grade-girls-schedule", title: "1st Grade — Girls (sample schedule)", blobPath: "documents/schedules/1st-grade-girls.pdf" },
  { key: "2nd-grade-boys-schedule", title: "2nd Grade — Boys (sample schedule)", blobPath: "documents/schedules/2nd-grade-boys.pdf" },
  { key: "2nd-grade-girls-schedule", title: "2nd Grade — Girls (sample schedule)", blobPath: "documents/schedules/2nd-grade-girls.pdf" },
  { key: "3rd-grade-boys-schedule", title: "3rd Grade — Boys (sample schedule)", blobPath: "documents/schedules/3rd-grade-boys.pdf" },
  { key: "3rd-grade-girls-schedule", title: "3rd Grade — Girls (sample schedule)", blobPath: "documents/schedules/3rd-grade-girls.pdf" },
  { key: "4th-grade-boys-schedule", title: "4th Grade — Boys (sample schedule)", blobPath: "documents/schedules/4th-grade-boys.pdf" },
  { key: "4th-grade-girls-schedule", title: "4th Grade — Girls (sample schedule)", blobPath: "documents/schedules/4th-grade-girls.pdf" },
  { key: "5th-grade-boys-schedule", title: "5th Grade — Boys (sample schedule)", blobPath: "documents/schedules/5th-grade-boys.pdf" },
  { key: "5th-grade-girls-schedule", title: "5th Grade — Girls (sample schedule)", blobPath: "documents/schedules/5th-grade-girls.pdf" },
  { key: "6th-7th-grade-boys-schedule", title: "6th–7th Grade — Boys (sample schedule)", blobPath: "documents/schedules/6th-7th-grade-boys.pdf" },
  { key: "6th-7th-grade-girls-schedule", title: "6th–7th Grade — Girls (sample schedule)", blobPath: "documents/schedules/6th-7th-grade-girls.pdf" },
  { key: "8th-grade-coed-schedule", title: "8th Grade Coed (sample schedule)", blobPath: "documents/schedules/8th-grade-coed.pdf" },
  // Clubhouse
  { key: "clubhouse-three-quarter-day-schedule", title: "Clubhouse Three-Quarter Day (sample schedule)", blobPath: "documents/schedules/clubhouse-three-quarter-day.pdf" },
  { key: "clubhouse-full-day-schedule", title: "Clubhouse Full Day (sample schedule)", blobPath: "documents/schedules/clubhouse-full-day.pdf" },
  // Camp map
  { key: "camp-riverbend-map", title: "Camp Riverbend Map", blobPath: "documents/Camp-Riverbend-Map.pdf" },
];

async function main() {
  console.log("Seeding documents table…");
  let inserted = 0;
  let skipped = 0;
  for (const doc of DOCS) {
    const existing = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.key, doc.key))
      .limit(1);
    if (existing.length) {
      skipped++;
      continue;
    }
    await db.insert(schema.documents).values({
      key: doc.key,
      title: doc.title,
      blobPath: doc.blobPath,
      blobUrl: `/assets/${doc.blobPath}`,
      contentType: "application/pdf",
    });
    inserted++;
  }
  console.log(`✓ ${inserted} inserted, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
