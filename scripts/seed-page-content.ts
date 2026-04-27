/**
 * Seed page_content with the existing hardcoded values for rates-dates-application-2026
 * so admins open the editor pre-populated with current site content.
 *
 * Idempotent — only inserts if a (pageSlug, blockKey) row doesn't already exist.
 * Re-run safe; never overwrites admin edits.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const PAGE_SLUG = "rates-dates-application-2026";

const blocks: Array<{
  blockKey: string;
  blockType: string;
  contentJson: object;
}> = [
  { blockKey: "hero_title", blockType: "text", contentJson: { value: "Rates, Dates & Application" } },
  { blockKey: "hero_subtitle", blockType: "text", contentJson: { value: "2026 Season — June 29 through August 14" } },
  {
    blockKey: "intro",
    blockType: "richtext",
    contentJson: {
      html:
        "<p>Camp Riverbend is a 7 week program. Campers can attend from a minimum of 2 consecutive weeks up to the full 7 week season. Minimum enrollment for our Three-Quarter Day campers is 3 days per week. Grouping is done based on the grade a child will enter in September after the camp season.</p><p>Camp Riverbend will run Monday June 29 to Friday August 14, 2026. Camp will be closed on July 3. Camp hours are 9 am to 4 pm, with extended hours from 8 am to 6 pm.</p>",
    },
  },
  {
    blockKey: "tuition_note",
    blockType: "text",
    contentJson: { value: "2025 rates shown for reference. 2026 rates will be updated soon." },
  },
  {
    blockKey: "tuition_rows",
    blockType: "rows",
    contentJson: {
      rows: [
        { duration: "7 Weeks", inCamp: "$8,375", dayTripper: "$9,170", threeQuarter: "$7,450" },
        { duration: "Any 6 Weeks", inCamp: "$7,820", dayTripper: "$8,640", threeQuarter: "$6,570" },
        { duration: "Any 5 Weeks", inCamp: "$7,230", dayTripper: "$7,950", threeQuarter: "$5,765" },
        { duration: "Any 4 Weeks", inCamp: "$6,470", dayTripper: "$7,200", threeQuarter: "$4,840" },
        { duration: "Any 3 Weeks", inCamp: "$5,215", dayTripper: "$6,150", threeQuarter: "$3,800" },
        { duration: "Any 2 Weeks", inCamp: "$3,970", dayTripper: "$4,875", threeQuarter: "$2,710" },
      ],
    },
  },
  {
    blockKey: "tuition_footer",
    blockType: "text",
    contentJson: {
      value:
        "3 and 4 Year Old Three-Quarter Day tuition rates and discounts listed above are for 5 days a week and will be pro-rated for 3 or 4 days a week.",
    },
  },
  {
    blockKey: "discounts",
    blockType: "rows",
    contentJson: {
      rows: [
        { heading: "Sibling Discount (2nd Child)", body: "Deduct $300 from 7 or 6 week tuition, $250 from 5 week, $200 from 4 or 3 week, or $150 from 2 week tuition." },
        { heading: "Sibling Discount (3rd Child)", body: "Deduct $600 from 7 or 6 week tuition, $500 from 5 week, $400 from 4 or 3 week, or $300 from 2 week tuition." },
        { heading: "July 4 Holiday Discount", body: "If you enroll only for the first two weeks of camp (June 29 and July 7), deduct $300 from total tuition." },
        { heading: "Referral Discount", body: "Receive a $100 discount on your summer tuition for each first-time camper you refer ($50 for Three-Quarter Day)." },
      ],
    },
  },
  {
    blockKey: "payment_schedule",
    blockType: "rows",
    contentJson: {
      rows: [
        { label: "At Application", detail: "$500 deposit per camper ($200 becomes non-refundable registration fee)" },
        { label: "January 6", detail: "$1,500 per camper payment" },
        { label: "April 1", detail: "Final tuition payment due" },
      ],
    },
  },
  {
    blockKey: "payment_footer",
    blockType: "richtext",
    contentJson: {
      html:
        "<p><strong>Note:</strong> All tuition payments made on or after January 6 are non-refundable.</p><p>Payment plans available for EFT/echeck or credit card — all payments must be completed by April 1.</p>",
    },
  },
  {
    blockKey: "whats_included",
    blockType: "richtext",
    contentJson: {
      html:
        "<p>Each camper&rsquo;s tuition includes either bus transportation to and from camp <em>or</em> a place in our extended day program at camp (8:00&ndash;9:00 am and 4:00&ndash;6:00 pm). There is an additional fee if your family wants to use bus transportation <em>and</em> extended day daily or hold seats for a camper on two different buses.</p><p>2.9% convenience fee for credit card payments. No charge for EFT or debit card payments.</p>",
    },
  },
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
