/**
 * Page schemas describe the editable surface of a public page. A schema
 * is the single source of truth for:
 *
 *   - Which blocks exist on a page (their keys, types, defaults)
 *   - How those blocks are grouped + labelled in the admin form
 *   - The default content shown to admins on first edit (so the editor
 *     opens populated, mirroring the live page exactly)
 *
 * The public page reads the same schema's defaults via `readBlock(...)`,
 * so a string only ever lives in one place — the schema.
 *
 * Adding a new editable page = define a schema and consume it in the
 * public component. No bespoke per-page editor code required.
 */

import type {
  BlockType,
  RichTextContent,
  TextContent,
  ImageContent,
  DocumentContent,
  RowsContent,
} from "@/lib/page-content";

export interface RowColumn {
  key: string;
  label: string;
  multiline?: boolean;
  width?: string;
}

interface BaseBlock<T extends BlockType, C> {
  /** Stable key for this block within the page. Used in URLs and revisions — don't rename casually. */
  key: string;
  type: T;
  /** Field label shown above the input. Omit to render with no label. */
  label?: string;
  /** Help text below the field. */
  help?: string;
  /** Default content used as fallback when nothing is in the DB. */
  defaultContent: C;
}

export type TextBlockSchema = BaseBlock<"text", TextContent> & {
  placeholder?: string;
};
export type RichTextBlockSchema = BaseBlock<"richtext", RichTextContent> & {
  placeholder?: string;
};
export type ImageBlockSchema = BaseBlock<"image", ImageContent> & {
  aspectClass?: string;
};
export type DocumentBlockSchema = BaseBlock<"document", DocumentContent>;
export type RowsBlockSchema = BaseBlock<"rows", RowsContent> & {
  columns: RowColumn[];
  /** Empty row template for the "Add row" button. */
  blank: Record<string, string>;
};

export type BlockSchema =
  | TextBlockSchema
  | RichTextBlockSchema
  | ImageBlockSchema
  | DocumentBlockSchema
  | RowsBlockSchema;

export interface SectionSchema {
  /** Stable identifier for layout (reorder/hide) — never rename in code
   *  without a DB migration. If omitted, the label slug is used as a
   *  fallback, but explicit keys are strongly preferred. */
  key?: string;
  /** Heading shown above this group of blocks in the editor. */
  label: string;
  /** Optional helper sentence. */
  help?: string;
  blocks: BlockSchema[];
}

/** Resolves a section's stable layout key (explicit or derived from label). */
export function sectionKey(s: SectionSchema): string {
  if (s.key) return s.key;
  return s.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface PageSchema {
  slug: string;
  /** Human label shown in admin nav and page title. */
  label: string;
  /** Public URL path (e.g. `/about-riverbend`). Used for the "View public page" link. */
  publicHref: string;
  sections: SectionSchema[];
}

/** Convenience: enumerate every block in a schema. */
export function flattenBlocks(schema: PageSchema): BlockSchema[] {
  return schema.sections.flatMap((s) => s.blocks);
}
