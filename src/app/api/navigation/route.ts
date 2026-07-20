/**
 * Navigation editor API. One endpoint that returns the entire
 * mega-menu tree, and a single PUT that replaces it wholesale.
 *
 * Wholesale-replace is simpler than per-row CRUD given the small data
 * volume (4 groups × ~3 columns × handful of links). The editor sends
 * the full intended state and the server clears + re-inserts inside
 * a single round-trip.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navGroups, navColumns, navLinks, navFeaturedCards } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";

// Featured cards, tolerating a DB that predates the secondary_label /
// secondary_href columns (see migration note in schema.ts). Remove the
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

// True once the secondary-link migration has run. Checked before the
// wipe-and-rewrite in PUT so a missing column can never fail a save
// halfway through (the wipe is not transactional on neon-http).
async function hasSecondaryColumns(): Promise<boolean> {
  try {
    await db
      .select({ s: navFeaturedCards.secondaryLabel })
      .from(navFeaturedCards)
      .limit(1);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [groups, columns, links, featured] = await Promise.all([
    db.select().from(navGroups).orderBy(asc(navGroups.sortOrder)),
    db.select().from(navColumns).orderBy(asc(navColumns.sortOrder)),
    db.select().from(navLinks).orderBy(asc(navLinks.sortOrder)),
    loadFeaturedCards(),
  ]);

  return NextResponse.json({
    groups: groups.map((g) => ({
      id: g.id,
      label: g.label,
      tagline: g.tagline,
      sortOrder: g.sortOrder,
      columns: columns
        .filter((c) => c.groupId === g.id)
        .map((c) => ({
          id: c.id,
          heading: c.heading,
          sortOrder: c.sortOrder,
          links: links.filter((l) => l.columnId === c.id).map((l) => ({
            id: l.id,
            label: l.label,
            href: l.href,
            external: l.external,
            description: l.description,
            sortOrder: l.sortOrder,
          })),
        })),
      featured: featured
        .filter((f) => f.groupId === g.id)
        .map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          href: f.href,
          cta: f.cta,
          external: f.external,
          secondaryLabel: f.secondaryLabel,
          secondaryHref: f.secondaryHref,
          sortOrder: f.sortOrder,
        })),
    })),
  });
}

interface IncomingLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string | null;
}
interface IncomingColumn {
  heading?: string | null;
  links: IncomingLink[];
}
interface IncomingFeatured {
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
}
interface IncomingGroup {
  label: string;
  tagline?: string | null;
  columns: IncomingColumn[];
  featured: IncomingFeatured[];
}

const MAX_FEATURED_PER_GROUP = 2;

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { groups: IncomingGroup[] };
  if (!body || !Array.isArray(body.groups)) {
    return NextResponse.json({ error: "Expected { groups: [] }" }, { status: 400 });
  }

  // Basic shape + business-rule validation
  for (const g of body.groups) {
    if (!g.label?.trim()) return NextResponse.json({ error: "Group missing label" }, { status: 400 });
    if (g.featured && g.featured.length > MAX_FEATURED_PER_GROUP) {
      return NextResponse.json(
        { error: `Up to ${MAX_FEATURED_PER_GROUP} featured cards per group.` },
        { status: 400 }
      );
    }
    for (const col of g.columns || []) {
      for (const link of col.links || []) {
        if (!link.label?.trim() || !link.href?.trim()) {
          return NextResponse.json({ error: "Each link needs a label and href" }, { status: 400 });
        }
      }
    }
  }

  // Probe BEFORE the destructive wipe: if the secondary-link migration
  // hasn't run yet, save without those fields rather than failing mid-write.
  const secondarySupported = await hasSecondaryColumns();

  // Wipe-and-rewrite. CASCADE on FKs cleans up columns/links/featured automatically.
  await db.delete(navGroups);

  let groupOrder = 0;
  for (const g of body.groups) {
    const [groupRow] = await db
      .insert(navGroups)
      .values({
        label: g.label.trim(),
        tagline: g.tagline?.trim() || null,
        sortOrder: groupOrder++,
      })
      .returning();

    let colOrder = 0;
    for (const col of g.columns || []) {
      const [colRow] = await db
        .insert(navColumns)
        .values({
          groupId: groupRow.id,
          heading: col.heading?.trim() || null,
          sortOrder: colOrder++,
        })
        .returning();

      let linkOrder = 0;
      for (const link of col.links || []) {
        await db.insert(navLinks).values({
          columnId: colRow.id,
          label: link.label.trim(),
          href: link.href.trim(),
          external: !!link.external,
          description: link.description?.trim() || null,
          sortOrder: linkOrder++,
        });
      }
    }

    let featOrder = 0;
    for (const f of g.featured || []) {
      await db.insert(navFeaturedCards).values({
        groupId: groupRow.id,
        title: f.title.trim(),
        description: f.description.trim(),
        href: f.href.trim(),
        cta: f.cta.trim(),
        external: !!f.external,
        ...(secondarySupported
          ? {
              secondaryLabel: f.secondaryLabel?.trim() || null,
              secondaryHref: f.secondaryHref?.trim() || null,
            }
          : {}),
        sortOrder: featOrder++,
      });
    }
  }

  return NextResponse.json({
    success: true,
    ...(secondarySupported
      ? {}
      : {
          warning:
            "Second-link fields were not saved: run the nav_featured_cards migration (npm run db:push) to enable them.",
        }),
  });
}
