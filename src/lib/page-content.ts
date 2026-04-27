/**
 * CMS data layer — fetch + save page content blocks with a 5-revision history.
 */
import { db } from "@/lib/db";
import { pageContent, pageContentRevisions } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { sanitizeHtml } from "@/lib/sanitize";

export type BlockType = "richtext" | "text" | "image" | "document" | "rows";

export interface BlockEnvelope<T = unknown> {
  type: BlockType;
  content: T;
}

export type RichTextContent = { html: string };
export type TextContent = { value: string };
export type ImageContent = { url: string; alt?: string };
export type DocumentContent = { url: string; label?: string };
export type RowsContent = { rows: Array<Record<string, string>> };

const MAX_REVISIONS = 5;

/**
 * Load every block for a page, keyed by blockKey. If a block doesn't exist
 * yet, the caller falls back to its hardcoded default — so pages keep
 * rendering correctly before any admin edits.
 */
export async function getPageContent(
  pageSlug: string
): Promise<Record<string, BlockEnvelope>> {
  const rows = await db
    .select()
    .from(pageContent)
    .where(eq(pageContent.pageSlug, pageSlug));

  const out: Record<string, BlockEnvelope> = {};
  for (const r of rows) {
    out[r.blockKey] = {
      type: r.blockType as BlockType,
      content: r.contentJson as BlockEnvelope["content"],
    };
  }
  return out;
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

interface SaveBlockArgs {
  pageSlug: string;
  blockKey: string;
  blockType: BlockType;
  content: unknown;
  userId?: string | null;
}

/**
 * Save a block atomically:
 *   1. Sanitize richtext html
 *   2. Push current row (if any) into the revisions table
 *   3. Trim revisions to keep only the most recent 5
 *   4. Upsert the new content
 */
export async function saveBlock({
  pageSlug,
  blockKey,
  blockType,
  content,
  userId,
}: SaveBlockArgs): Promise<void> {
  const cleanContent = sanitizeBlockContent(blockType, content);

  const existing = await db
    .select()
    .from(pageContent)
    .where(
      and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.blockKey, blockKey))
    )
    .limit(1);

  if (existing.length) {
    // Snapshot the prior version into revisions
    const prior = existing[0];
    await db.insert(pageContentRevisions).values({
      pageSlug,
      blockKey,
      blockType: prior.blockType,
      contentJson: prior.contentJson as object,
      createdBy: userId ?? null,
    });

    // Trim to MAX_REVISIONS most recent
    const allRevs = await db
      .select({ id: pageContentRevisions.id })
      .from(pageContentRevisions)
      .where(
        and(
          eq(pageContentRevisions.pageSlug, pageSlug),
          eq(pageContentRevisions.blockKey, blockKey)
        )
      )
      .orderBy(desc(pageContentRevisions.createdAt));
    if (allRevs.length > MAX_REVISIONS) {
      const toDelete = allRevs.slice(MAX_REVISIONS).map((r) => r.id);
      for (const id of toDelete) {
        await db
          .delete(pageContentRevisions)
          .where(eq(pageContentRevisions.id, id));
      }
    }

    // Update the current row
    await db
      .update(pageContent)
      .set({
        blockType,
        contentJson: cleanContent as object,
        updatedAt: new Date(),
        updatedBy: userId ?? null,
      })
      .where(eq(pageContent.id, prior.id));
  } else {
    await db.insert(pageContent).values({
      pageSlug,
      blockKey,
      blockType,
      contentJson: cleanContent as object,
      updatedBy: userId ?? null,
    });
  }
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
 * Roll back: restore a specific revision into the current row.
 * (The current row is itself snapshotted to revisions first, so the
 * action is reversible.)
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

  await saveBlock({
    pageSlug: args.pageSlug,
    blockKey: args.blockKey,
    blockType: rev[0].blockType as BlockType,
    content: rev[0].contentJson,
    userId: args.userId,
  });
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
