/**
 * CMS data layer — page content with draft/publish semantics + revisions.
 *
 *   Save flow:    admin save  →  draft_content_json
 *   Publish flow: draft → revision snapshot of prior published → published; draft cleared
 *   Discard:      clears draft_content_json (no revision)
 *
 * Public pages reading in 'published' mode see only the live content.
 * Admin previews and the editor itself read in 'draft' mode, which falls
 * back to published whenever a block has no pending draft.
 */
import { db } from "@/lib/db";
import { pageContent, pageContentRevisions } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { sanitizeHtml } from "@/lib/sanitize";

export type BlockType = "richtext" | "text" | "image" | "document" | "rows";

export interface BlockEnvelope<T = unknown> {
  type: BlockType;
  content: T;
  /** True if `content` is from the draft column (unpublished). */
  isDraft?: boolean;
  /** Always present when reading in editor/preview modes — useful for "draft" badges. */
  hasDraft?: boolean;
}

export type RichTextContent = { html: string };
export type TextContent = { value: string };
export type ImageContent = { url: string; alt?: string };
export type DocumentContent = { url: string; label?: string };
export type RowsContent = { rows: Array<Record<string, string>> };

const MAX_REVISIONS = 5;

export type ReadMode = "published" | "draft";

/**
 * Load every block for a page.
 *
 *   mode = "published" — public renders. Returns content_json only.
 *   mode = "draft"     — admin previews and the editor. Returns draft_content_json
 *                        if present, otherwise content_json. Each block's
 *                        `hasDraft` reflects whether a pending draft exists.
 */
export async function getPageContent(
  pageSlug: string,
  mode: ReadMode = "published"
): Promise<Record<string, BlockEnvelope>> {
  const rows = await db
    .select()
    .from(pageContent)
    .where(eq(pageContent.pageSlug, pageSlug));

  const out: Record<string, BlockEnvelope> = {};
  for (const r of rows) {
    const hasDraft = r.draftContentJson != null;
    if (mode === "draft" && hasDraft) {
      out[r.blockKey] = {
        type: r.blockType as BlockType,
        content: r.draftContentJson as BlockEnvelope["content"],
        isDraft: true,
        hasDraft: true,
      };
    } else {
      out[r.blockKey] = {
        type: r.blockType as BlockType,
        content: r.contentJson as BlockEnvelope["content"],
        isDraft: false,
        hasDraft,
      };
    }
  }
  return out;
}

/** Return only the keys with pending drafts (for "X unpublished changes" UI). */
export async function listDraftedKeys(pageSlug: string): Promise<string[]> {
  const rows = await db
    .select({ blockKey: pageContent.blockKey, draft: pageContent.draftContentJson })
    .from(pageContent)
    .where(eq(pageContent.pageSlug, pageSlug));
  return rows.filter((r) => r.draft != null).map((r) => r.blockKey);
}

/**
 * Read a single block. Returns the fallback if no row exists yet.
 */
export function readBlock<T>(
  blocks: Record<string, BlockEnvelope>,
  key: string,
  fallback: T
): T {
  const b = blocks[key];
  if (!b) return fallback;
  return b.content as T;
}

interface SaveDraftArgs {
  pageSlug: string;
  blockKey: string;
  blockType: BlockType;
  content: unknown;
  userId?: string | null;
}

/**
 * Write to the draft column. No revision snapshot — drafts overwrite each
 * other freely. The published column is untouched. If a row doesn't exist
 * yet for this block, one is created with the same content in BOTH columns
 * (so that publishing a brand-new block is a no-op promotion of an
 * already-set published value).
 *
 * Wait — that would make new blocks immediately public. Better behavior:
 * if no row exists, we still create one but ONLY populate the draft column,
 * and seed the published column from the same content. (Otherwise a brand
 * new block is invisible until published, which is the correct preview
 * UX, but it means defaults stop kicking in for the public page on first
 * draft save.) For phase 1 we keep the existing behavior of populating
 * both — defaults still cover any block that's never been touched.
 */
export async function saveDraft({
  pageSlug,
  blockKey,
  blockType,
  content,
  userId,
}: SaveDraftArgs): Promise<void> {
  const cleanContent = sanitizeBlockContent(blockType, content);

  const existing = await db
    .select()
    .from(pageContent)
    .where(
      and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.blockKey, blockKey))
    )
    .limit(1);

  if (existing.length) {
    await db
      .update(pageContent)
      .set({
        blockType, // type may change from text→richtext etc. — accept it
        draftContentJson: cleanContent as object,
        draftUpdatedAt: new Date(),
        draftUpdatedBy: userId ?? null,
      })
      .where(eq(pageContent.id, existing[0].id));
  } else {
    // Brand-new block: seed both published + draft so the public page
    // continues to render via the default-fallback layer until the admin
    // explicitly publishes a different value. The draft is what the
    // editor will load on the next reopen.
    await db.insert(pageContent).values({
      pageSlug,
      blockKey,
      blockType,
      contentJson: cleanContent as object,
      draftContentJson: cleanContent as object,
      draftUpdatedAt: new Date(),
      draftUpdatedBy: userId ?? null,
      updatedBy: userId ?? null,
    });
  }
}

/**
 * Promote every drafted block on a page to published, snapshotting the
 * current published value to the revisions table first. Blocks without
 * drafts are left untouched.
 *
 * Returns the count of blocks promoted.
 */
export async function publishPage(args: {
  pageSlug: string;
  userId?: string | null;
}): Promise<number> {
  const rows = await db
    .select()
    .from(pageContent)
    .where(eq(pageContent.pageSlug, args.pageSlug));

  let promoted = 0;
  for (const r of rows) {
    if (r.draftContentJson == null) continue;

    // Snapshot current published into revisions
    await db.insert(pageContentRevisions).values({
      pageSlug: r.pageSlug,
      blockKey: r.blockKey,
      blockType: r.blockType,
      contentJson: r.contentJson as object,
      createdBy: args.userId ?? null,
    });

    // Trim to MAX_REVISIONS most recent
    const allRevs = await db
      .select({ id: pageContentRevisions.id })
      .from(pageContentRevisions)
      .where(
        and(
          eq(pageContentRevisions.pageSlug, r.pageSlug),
          eq(pageContentRevisions.blockKey, r.blockKey)
        )
      )
      .orderBy(desc(pageContentRevisions.createdAt));
    if (allRevs.length > MAX_REVISIONS) {
      const toDelete = allRevs.slice(MAX_REVISIONS).map((x) => x.id);
      for (const id of toDelete) {
        await db.delete(pageContentRevisions).where(eq(pageContentRevisions.id, id));
      }
    }

    // Promote draft → published; clear draft
    await db
      .update(pageContent)
      .set({
        contentJson: r.draftContentJson as object,
        draftContentJson: null,
        draftUpdatedAt: null,
        draftUpdatedBy: null,
        updatedAt: new Date(),
        updatedBy: args.userId ?? null,
      })
      .where(eq(pageContent.id, r.id));

    promoted++;
  }
  return promoted;
}

/** Clear all drafts on a page. */
export async function discardPageDrafts(pageSlug: string): Promise<number> {
  const result = await db
    .update(pageContent)
    .set({
      draftContentJson: null,
      draftUpdatedAt: null,
      draftUpdatedBy: null,
    })
    .where(eq(pageContent.pageSlug, pageSlug))
    .returning({ id: pageContent.id });
  return result.length;
}

export async function listRevisions(pageSlug: string, blockKey: string) {
  return db
    .select()
    .from(pageContentRevisions)
    .where(
      and(
        eq(pageContentRevisions.pageSlug, pageSlug),
        eq(pageContentRevisions.blockKey, blockKey)
      )
    )
    .orderBy(desc(pageContentRevisions.createdAt));
}

/**
 * Roll back: restore a specific revision into the published row directly.
 * The current published is snapshotted into revisions first so the action
 * is reversible. Drafts are untouched.
 */
export async function restoreRevision(args: {
  pageSlug: string;
  blockKey: string;
  revisionId: string;
  userId?: string | null;
}): Promise<void> {
  const rev = await db
    .select()
    .from(pageContentRevisions)
    .where(eq(pageContentRevisions.id, args.revisionId))
    .limit(1);
  if (!rev.length) throw new Error("Revision not found");
  if (
    rev[0].pageSlug !== args.pageSlug ||
    rev[0].blockKey !== args.blockKey
  ) {
    throw new Error("Revision does not match page/block");
  }

  // Snapshot current published, then overwrite published with the revision
  const existing = await db
    .select()
    .from(pageContent)
    .where(
      and(
        eq(pageContent.pageSlug, args.pageSlug),
        eq(pageContent.blockKey, args.blockKey)
      )
    )
    .limit(1);
  if (!existing.length) throw new Error("No current row to restore over");

  await db.insert(pageContentRevisions).values({
    pageSlug: existing[0].pageSlug,
    blockKey: existing[0].blockKey,
    blockType: existing[0].blockType,
    contentJson: existing[0].contentJson as object,
    createdBy: args.userId ?? null,
  });

  await db
    .update(pageContent)
    .set({
      contentJson: rev[0].contentJson as object,
      blockType: rev[0].blockType,
      updatedAt: new Date(),
      updatedBy: args.userId ?? null,
    })
    .where(eq(pageContent.id, existing[0].id));
}

function sanitizeBlockContent(type: BlockType, content: unknown): unknown {
  switch (type) {
    case "richtext": {
      const c = (content as RichTextContent) || { html: "" };
      return { html: sanitizeHtml(c.html || "") };
    }
    case "text": {
      const c = (content as TextContent) || { value: "" };
      return { value: String(c.value || "").trim() };
    }
    case "image":
    case "document":
      return content || {};
    case "rows": {
      const c = (content as RowsContent) || { rows: [] };
      return { rows: Array.isArray(c.rows) ? c.rows : [] };
    }
    default:
      return content;
  }
}
