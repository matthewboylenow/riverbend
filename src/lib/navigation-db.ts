/**
 * DB-backed mega-menu navigation. Replaces the hardcoded NAV_GROUPS in
 * src/lib/navigation.ts (kept around as the seed source + for the
 * EXTERNAL_LINKS / SOCIAL_LINKS constants).
 *
 * Returns the same NavGroup shape the existing components already
 * consume so the rendering side is unchanged — we just pass the data
 * in as a prop instead of importing it.
 */
import { db } from "@/lib/db";
import { navGroups, navColumns, navLinks, navFeaturedCards } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import type { NavGroup } from "@/lib/navigation";

// Pulled fresh on every request. Inner pages already render dynamic so
// the cost is one query per page load (small table). If this becomes a
// hot path later, wrap with `unstable_cache` keyed by a "nav" tag.
// Featured cards, tolerating a production DB that predates the
// secondary_label/secondary_href columns: `select()` (all columns) fails
// there, so fall back to an explicit legacy column list. Remove the
// fallback once the migration has run everywhere.
async function loadFeaturedCards() {
  try {
    return await db.select().from(navFeaturedCards).orderBy(asc(navFeaturedCards.sortOrder));
  } catch {
    const legacy = await db
      .select({
        id: navFeaturedCards.id,
        groupId: navFeaturedCards.groupId,
        title: navFeaturedCards.title,
        description: navFeaturedCards.description,
        href: navFeaturedCards.href,
        cta: navFeaturedCards.cta,
        external: navFeaturedCards.external,
        sortOrder: navFeaturedCards.sortOrder,
      })
      .from(navFeaturedCards)
      .orderBy(asc(navFeaturedCards.sortOrder));
    return legacy.map((f) => ({ ...f, secondaryLabel: null, secondaryHref: null }));
  }
}

export async function getNavGroups(): Promise<NavGroup[]> {
  try {
    const [groups, columns, links, featured] = await Promise.all([
      db.select().from(navGroups).orderBy(asc(navGroups.sortOrder), asc(navGroups.label)),
      db.select().from(navColumns).orderBy(asc(navColumns.sortOrder)),
      db.select().from(navLinks).orderBy(asc(navLinks.sortOrder)),
      loadFeaturedCards(),
    ]);

    return groups.map((g) => {
      const myColumns = columns
        .filter((c) => c.groupId === g.id)
        .map((c) => ({
          heading: c.heading ?? undefined,
          links: links
            .filter((l) => l.columnId === c.id)
            .map((l) => ({
              label: l.label,
              href: l.href,
              external: l.external || undefined,
              description: l.description ?? undefined,
            })),
        }));

      // First featured card by sort_order becomes the singular `featured`
      // field the existing MegaMenu component already supports. Additional
      // featured cards (up to 2) are exposed via featuredExtras for the
      // soon-to-be-updated MegaMenu layout.
      const myFeatured = featured.filter((f) => f.groupId === g.id);
      const primaryFeatured = myFeatured[0]
        ? {
            title: myFeatured[0].title,
            description: myFeatured[0].description,
            href: myFeatured[0].href,
            cta: myFeatured[0].cta,
            external: myFeatured[0].external || undefined,
            secondaryLabel: myFeatured[0].secondaryLabel ?? undefined,
            secondaryHref: myFeatured[0].secondaryHref ?? undefined,
          }
        : undefined;

      const result: NavGroup & {
        featuredExtras?: NonNullable<NavGroup["featured"]>[];
      } = {
        label: g.label,
        tagline: g.tagline ?? undefined,
        columns: myColumns,
        featured: primaryFeatured,
      };
      if (myFeatured.length > 1) {
        result.featuredExtras = myFeatured.slice(1).map((f) => ({
          title: f.title,
          description: f.description,
          href: f.href,
          cta: f.cta,
          external: f.external || undefined,
          secondaryLabel: f.secondaryLabel ?? undefined,
          secondaryHref: f.secondaryHref ?? undefined,
        }));
      }
      return result;
    });
  } catch (err) {
    console.error("Failed to load nav from DB, falling back to hardcoded:", err);
    const { NAV_GROUPS } = await import("@/lib/navigation");
    return NAV_GROUPS;
  }
}
