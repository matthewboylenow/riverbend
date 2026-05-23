/**
 * Layer admin-controlled section order + visibility on top of the
 * code-defined PageSchema.
 *
 * The schema's `sections` array is the canon of *which* sections exist;
 * the `page_section_layout` table optionally overrides their order or
 * marks them hidden. Absence of a row means "schema default."
 *
 * Used by:
 *   - GenericPageEditor (admin): renders sections in the customized order,
 *     marks hidden ones, lets admins drag + toggle.
 *   - Public pages: `applyLayout(schema, layout)` returns the *visible*
 *     sections in their intended order, so each page can render them
 *     accordingly.
 */
import { db } from "@/lib/db";
import { pageSectionLayout } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sectionKey, type PageSchema, type SectionSchema } from "@/lib/page-schemas/types";

export interface SectionLayoutRow {
  sectionKey: string;
  sortOrder: number;
  hidden: boolean;
}

/** Fetch the layout overrides for a page. Returns an empty array if none. */
export async function loadSectionLayout(pageSlug: string): Promise<SectionLayoutRow[]> {
  try {
    const rows = await db
      .select({
        sectionKey: pageSectionLayout.sectionKey,
        sortOrder: pageSectionLayout.sortOrder,
        hidden: pageSectionLayout.hidden,
      })
      .from(pageSectionLayout)
      .where(eq(pageSectionLayout.pageSlug, pageSlug));
    return rows;
  } catch (err) {
    console.error("loadSectionLayout failed:", err);
    return [];
  }
}

/**
 * Merge layout overrides into a schema's sections.
 *
 * Returns sections in their effective order with a `hidden` flag attached.
 * Sections without a layout row keep their schema order and default to
 * visible. Page-Header is always returned first and is never reorderable —
 * the breadcrumb hero shouldn't slide around.
 */
export function applyLayout(
  sections: SectionSchema[],
  layout: SectionLayoutRow[]
): Array<SectionSchema & { key: string; hidden: boolean }> {
  const byKey = new Map(layout.map((r) => [r.sectionKey, r]));

  const annotated = sections.map((s, i) => {
    const key = sectionKey(s);
    const row = byKey.get(key);
    return {
      ...s,
      key,
      hidden: row?.hidden ?? false,
      _order: row?.sortOrder ?? i,
      _schemaIndex: i,
    };
  });

  // Page-Header–style first section (first index in schema with a key
  // suggesting it's a header) is pinned. Otherwise, sort by effective order
  // with schema index as the stable tiebreaker.
  annotated.sort((a, b) => {
    if (a._schemaIndex === 0) return -1;
    if (b._schemaIndex === 0) return 1;
    if (a._order !== b._order) return a._order - b._order;
    return a._schemaIndex - b._schemaIndex;
  });

  return annotated.map((entry) => {
    const { _order: _o, _schemaIndex: _s, ...rest } = entry;
    void _o;
    void _s;
    return rest;
  });
}

/** Convenience: read layout + schema → return only the *visible* sections in order. */
export async function loadVisibleSections(schema: PageSchema) {
  const layout = await loadSectionLayout(schema.slug);
  return applyLayout(schema.sections, layout).filter((s) => !s.hidden);
}

/** Convenience for public pages: returns a `visible(key)` predicate. */
export async function loadSectionVisibility(pageSlug: string) {
  const layout = await loadSectionLayout(pageSlug);
  const hidden = new Set(layout.filter((r) => r.hidden).map((r) => r.sectionKey));
  const order = new Map(layout.map((r) => [r.sectionKey, r.sortOrder]));
  return {
    /** True if the section should render. */
    visible: (key: string) => !hidden.has(key),
    /** Effective sort order — lower comes first. Schema default index used when no override. */
    orderOf: (key: string, fallback: number) => order.get(key) ?? fallback,
  };
}

/**
 * Public-page helper: load the section layout for `schema` and return the
 * ordered list of visible section keys, ready to drive the page render.
 *
 * The first section in the schema is treated as a pinned "page header" and
 * is excluded from the result — render it yourself above the reorderable
 * sections.
 *
 * Typical usage:
 *
 *   const orderedKeys = await loadOrderedSectionKeys(SCHEMA);
 *   ...
 *   {orderedKeys.map((k) => <Fragment key={k}>{renderedByKey[k]}</Fragment>)}
 */
export async function loadOrderedSectionKeys(schema: PageSchema): Promise<string[]> {
  const layout = await loadSectionVisibility(schema.slug);
  return schema.sections
    .map((s, i) => ({ key: sectionKey(s), idx: i }))
    .filter((s) => s.idx > 0)
    .sort((a, b) => layout.orderOf(a.key, a.idx) - layout.orderOf(b.key, b.idx))
    .filter((s) => layout.visible(s.key))
    .map((s) => s.key);
}
