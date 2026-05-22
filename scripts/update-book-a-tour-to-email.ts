/**
 * One-off: switch the "Get Started" mega-menu "Book a Tour" link and the
 * featured card to a mailto:info@campriverbend.com instead of the old
 * campintouch inquiry form.
 *
 * Idempotent — safe to re-run. Touches only the Get Started group.
 *
 * Run: npx tsx scripts/update-book-a-tour-to-email.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const db = drizzle(neon(process.env.DATABASE_URL), { schema });

const EMAIL = "mailto:info@campriverbend.com";

async function main() {
  const [group] = await db
    .select()
    .from(schema.navGroups)
    .where(eq(schema.navGroups.label, "Get Started"));
  if (!group) {
    console.error('No nav_group with label "Get Started" found.');
    process.exit(1);
  }

  const columns = await db
    .select()
    .from(schema.navColumns)
    .where(eq(schema.navColumns.groupId, group.id));
  const columnIds = columns.map((c) => c.id);

  let updatedLinks = 0;
  for (const colId of columnIds) {
    const res = await db
      .update(schema.navLinks)
      .set({ href: EMAIL, external: false, description: "Email us to schedule" })
      .where(and(eq(schema.navLinks.columnId, colId), eq(schema.navLinks.label, "Book a Tour")))
      .returning({ id: schema.navLinks.id });
    updatedLinks += res.length;
  }

  const featured = await db
    .update(schema.navFeaturedCards)
    .set({
      href: EMAIL,
      cta: "Email Us",
      description: "Come see Camp Riverbend in action. Email us to schedule your personal tour!",
      external: false,
    })
    .where(and(eq(schema.navFeaturedCards.groupId, group.id), eq(schema.navFeaturedCards.title, "Book a Tour")))
    .returning({ id: schema.navFeaturedCards.id });

  console.log(`Updated ${updatedLinks} nav link(s) and ${featured.length} featured card(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
