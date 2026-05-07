/**
 * Seed page_content with the existing hardcoded values for rates-dates-application-2026
 * so admins open the editor pre-populated with current site content.
 *
 * Idempotent — only inserts if a (pageSlug, blockKey) row doesn't already exist.
 * Re-run safe; never overwrites admin edits.
 *
 * Pulls defaults from src/lib/page-defaults/rates-dates so the seed can never
 * drift from the public-page fallbacks.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { RATES_DEFAULTS } from "../src/lib/page-defaults/rates-dates";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const PAGE_SLUG = "rates-dates-application-2026";

const blocks: Array<{ blockKey: string; blockType: string; contentJson: object }> = [
  { blockKey: "hero_title", blockType: "text", contentJson: { value: RATES_DEFAULTS.hero_title } },
  { blockKey: "hero_subtitle", blockType: "text", contentJson: { value: RATES_DEFAULTS.hero_subtitle } },
  { blockKey: "intro", blockType: "richtext", contentJson: { html: RATES_DEFAULTS.intro_html } },
  { blockKey: "tuition_note", blockType: "text", contentJson: { value: RATES_DEFAULTS.tuition_note } },
  { blockKey: "tuition_rows", blockType: "rows", contentJson: { rows: RATES_DEFAULTS.tuition_rows } },
  { blockKey: "tuition_extras", blockType: "richtext", contentJson: { html: RATES_DEFAULTS.tuition_extras_html } },
  { blockKey: "discounts", blockType: "rows", contentJson: { rows: RATES_DEFAULTS.discounts } },
  { blockKey: "payment_schedule", blockType: "rows", contentJson: { rows: RATES_DEFAULTS.payment_schedule } },
];

async function main() {
  console.log(`Seeding page_content for ${PAGE_SLUG}…`);
  let inserted = 0;
  let skipped = 0;
  for (const b of blocks) {
    const existing = await db
      .select()
      .from(schema.pageContent)
      .where(
        and(
          eq(schema.pageContent.pageSlug, PAGE_SLUG),
          eq(schema.pageContent.blockKey, b.blockKey)
        )
      )
      .limit(1);
    if (existing.length) {
      skipped++;
      continue;
    }
    await db.insert(schema.pageContent).values({
      pageSlug: PAGE_SLUG,
      blockKey: b.blockKey,
      blockType: b.blockType,
      contentJson: b.contentJson,
    });
    inserted++;
  }
  console.log(`✓ ${inserted} inserted, ${skipped} skipped (already existed)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
