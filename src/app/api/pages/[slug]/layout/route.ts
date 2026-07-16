import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageSectionLayout } from "@/lib/db/schema";
import { and, eq, inArray, not } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * Read or write the per-page section layout (ordering + hidden flag).
 *
 * GET  /api/pages/:slug/layout            → returns [{ sectionKey, sortOrder, hidden }]
 * PUT  /api/pages/:slug/layout            → body { sections: [{ sectionKey, sortOrder, hidden }] }
 *                                          full replace; sections not in the payload are removed.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const rows = await db
    .select({
      sectionKey: pageSectionLayout.sectionKey,
      sortOrder: pageSectionLayout.sortOrder,
      hidden: pageSectionLayout.hidden,
    })
    .from(pageSectionLayout)
    .where(eq(pageSectionLayout.pageSlug, slug));
  return NextResponse.json({ sections: rows });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    sections?: Array<{ sectionKey?: string; sortOrder?: number; hidden?: boolean }>;
  };
  const incoming = (body.sections || []).filter(
    (s): s is { sectionKey: string; sortOrder: number; hidden: boolean } =>
      typeof s.sectionKey === "string" &&
      typeof s.sortOrder === "number" &&
      typeof s.hidden === "boolean"
  );

  // Upsert each row, then delete any rows for this page whose sectionKey
  // wasn't in the payload (so removing a section from the schema/UI cleans
  // up its layout entry too).
  //
  // NOTE: the neon-http driver has no interactive-transaction support —
  // db.transaction() throws at runtime (which silently broke every layout
  // save from May until July 2026). db.batch() sends all statements in one
  // request and Neon runs them atomically, which is all we need here since
  // no statement depends on another's result.
  const upserts = incoming.map((row) =>
    db
      .insert(pageSectionLayout)
      .values({
        pageSlug: slug,
        sectionKey: row.sectionKey,
        sortOrder: row.sortOrder,
        hidden: row.hidden,
        updatedBy: session.user!.id,
      })
      .onConflictDoUpdate({
        target: [pageSectionLayout.pageSlug, pageSectionLayout.sectionKey],
        set: {
          sortOrder: row.sortOrder,
          hidden: row.hidden,
          updatedAt: new Date(),
          updatedBy: session.user!.id,
        },
      })
  );

  const keepKeys = incoming.map((r) => r.sectionKey);
  const cleanup =
    keepKeys.length > 0
      ? db
          .delete(pageSectionLayout)
          .where(
            and(
              eq(pageSectionLayout.pageSlug, slug),
              not(inArray(pageSectionLayout.sectionKey, keepKeys))
            )
          )
      : db.delete(pageSectionLayout).where(eq(pageSectionLayout.pageSlug, slug));

  const statements = [...upserts, cleanup] as const;
  await db.batch(statements as unknown as [(typeof statements)[number], ...Array<(typeof statements)[number]>]);

  return NextResponse.json({ ok: true, count: incoming.length });
}
