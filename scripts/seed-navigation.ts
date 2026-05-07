/**
 * One-time seed: copy the hardcoded NAV_GROUPS into the new
 * nav_groups / nav_columns / nav_links / nav_featured_cards tables.
 *
 * Idempotent — wipes and re-inserts so re-running it doesn't duplicate.
 * After this runs, the DB is the source of truth and src/lib/navigation.ts
 * is only kept around for the EXTERNAL_LINKS / SOCIAL_LINKS constants.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { NAV_GROUPS } from "../src/lib/navigation";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding navigation…");

  // Wipe and re-seed. CASCADE on FKs handles columns/links/featured_cards.
  await db.delete(schema.navGroups);
  console.log("  cleared existing nav rows");

  let groupOrder = 0;
  for (const g of NAV_GROUPS) {
    const [groupRow] = await db
      .insert(schema.navGroups)
      .values({
        label: g.label,
        tagline: g.tagline ?? null,
        sortOrder: groupOrder++,
      })
      .returning();

    let columnOrder = 0;
    for (const col of g.columns) {
      const [colRow] = await db
        .insert(schema.navColumns)
        .values({
          groupId: groupRow.id,
          heading: col.heading ?? null,
          sortOrder: columnOrder++,
        })
        .returning();

      let linkOrder = 0;
      for (const link of col.links) {
        await db.insert(schema.navLinks).values({
          columnId: colRow.id,
          label: link.label,
          href: link.href,
          external: !!link.external,
          description: link.description ?? null,
          sortOrder: linkOrder++,
        });
      }
    }

    if (g.featured) {
      await db.insert(schema.navFeaturedCards).values({
        groupId: groupRow.id,
        title: g.featured.title,
        description: g.featured.description,
        href: g.featured.href,
        cta: g.featured.cta,
        external: !!g.featured.external,
        sortOrder: 0,
      });
    }

    console.log(`  ✓ ${g.label}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
