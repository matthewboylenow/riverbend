"use client";

/**
 * Schema-driven page editor. Render any page's CMS form by passing a
 * PageSchema. Handles loading, saving, defaults fallback, revisions,
 * and the right input UI per block type.
 *
 * Public pages should consume the same schema's defaults so the editor
 * + the rendered page never drift.
 */
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Reorder, useDragControls } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  AlertCircle,
  Eye,
  GripVertical,
  EyeOff,
  Upload as PublishIcon,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RevisionsButton } from "@/components/admin/RevisionsButton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type {
  PageSchema,
  BlockSchema,
  RowsBlockSchema,
  TableBlockSchema,
  SectionSchema,
} from "@/lib/page-schemas/types";
import { flattenBlocks, sectionKey } from "@/lib/page-schemas/types";
import type { TableColumn, TableContent } from "@/lib/page-content";

interface LayoutEntry {
  key: string;
  hidden: boolean;
}

function defaultLayout(schema: PageSchema): LayoutEntry[] {
  return schema.sections.map((s) => ({ key: sectionKey(s), hidden: false }));
}

function applyLayoutClient(
  schema: PageSchema,
  layout: LayoutEntry[]
): Array<SectionSchema & { _key: string; _hidden: boolean; _schemaIndex: number }> {
  const order = new Map(layout.map((e, i) => [e.key, i]));
  const hiddenSet = new Set(layout.filter((e) => e.hidden).map((e) => e.key));
  return schema.sections
    .map((s, i) => ({ ...s, _key: sectionKey(s), _hidden: hiddenSet.has(sectionKey(s)), _schemaIndex: i }))
    .sort((a, b) => {
      // Pin the schema's first section (e.g. Page Header) at the top.
      if (a._schemaIndex === 0) return -1;
      if (b._schemaIndex === 0) return 1;
      const ao = order.get(a._key) ?? a._schemaIndex + 1000;
      const bo = order.get(b._key) ?? b._schemaIndex + 1000;
      return ao - bo;
    });
}

type BlocksMap = Record<
  string,
  | {
      type: string;
      content: Record<string, unknown>;
      isDraft?: boolean;
      hasDraft?: boolean;
    }
  | undefined
>;

export default function GenericPageEditor({ schema }: { schema: PageSchema }) {
  const [state, setState] = useState<Record<string, unknown>>(() => initialState(schema));
  const [draftedKeys, setDraftedKeys] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<LayoutEntry[]>(() => defaultLayout(schema));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"saving" | "publishing" | "discarding" | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaults, setUsingDefaults] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pages/${schema.slug}`);
      if (!res.ok) {
        setError(
          res.status === 401
            ? "Session expired — please reload."
            : "Couldn't load saved content. Showing current site copy as a starting point."
        );
        setUsingDefaults(true);
        setState(initialState(schema));
        setDraftedKeys(new Set());
        setLoading(false);
        return;
      }
      const data = await res.json();
      const blocks: BlocksMap = data.blocks || {};
      setState(hydrateState(schema, blocks));
      const drafted = new Set<string>();
      for (const b of flattenBlocks(schema)) {
        if (blocks[b.key]?.hasDraft) drafted.add(b.key);
      }
      setDraftedKeys(drafted);
      setUsingDefaults(
        flattenBlocks(schema).every((b) => blocks[b.key] == null)
      );

      // Layout overrides (section order + hidden). Sections in the schema
      // but not in DB rows fall back to schema order, visible by default.
      try {
        const layoutRes = await fetch(`/api/pages/${schema.slug}/layout`);
        if (layoutRes.ok) {
          const ld = (await layoutRes.json()) as {
            sections: Array<{ sectionKey: string; sortOrder: number; hidden: boolean }>;
          };
          const byKey = new Map(ld.sections.map((r) => [r.sectionKey, r]));
          const merged: LayoutEntry[] = schema.sections
            .map((s, i) => {
              const k = sectionKey(s);
              const row = byKey.get(k);
              return {
                key: k,
                hidden: row?.hidden ?? false,
                _order: row?.sortOrder ?? i,
                _schemaIndex: i,
              };
            })
            .sort((a, b) => {
              if (a._schemaIndex === 0) return -1;
              if (b._schemaIndex === 0) return 1;
              return a._order - b._order;
            })
            .map(({ key, hidden }) => ({ key, hidden }));
          setLayout(merged);
        }
      } catch (err) {
        console.error("layout load failed:", err);
      }
    } catch (e) {
      setError((e as Error).message);
      setUsingDefaults(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.slug]);

  async function saveDraft() {
    setBusy("saving");
    setError(null);
    setStatusMsg(null);
    try {
      await Promise.all(
        flattenBlocks(schema).map((b) =>
          saveBlock(schema.slug, b.key, b.type, state[b.key] as object)
        )
      );
      setStatusMsg(`Draft saved at ${new Date().toLocaleTimeString()}`);
      setUsingDefaults(false);
      // Reload to refresh the drafted-keys set so the badges line up.
      await load();
      toast.success("Draft saved");
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    if (
      !confirm(
        "Publish all draft changes to the live site? This will replace the current published version (which is saved to revisions and can be rolled back per-block)."
      )
    )
      return;
    setBusy("publishing");
    setError(null);
    setStatusMsg(null);
    try {
      // First flush any local edits to draft, so publish covers them.
      await Promise.all(
        flattenBlocks(schema).map((b) =>
          saveBlock(schema.slug, b.key, b.type, state[b.key] as object)
        )
      );
      const res = await fetch(`/api/pages/${schema.slug}/publish`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Publish failed");
      }
      const data = await res.json();
      setStatusMsg(`Published ${data.promoted} block${data.promoted === 1 ? "" : "s"}.`);
      await load();
      toast.success(`Published ${data.promoted} block${data.promoted === 1 ? "" : "s"} to live site`);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  async function discard() {
    if (
      !confirm(
        "Discard all unpublished draft changes on this page? The live site is unaffected."
      )
    )
      return;
    setBusy("discarding");
    setError(null);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/pages/${schema.slug}/discard-draft`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Discard failed");
      }
      setStatusMsg("Drafts discarded.");
      await load();
      toast.success("Draft changes discarded");
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  async function persistLayout(next: LayoutEntry[]) {
    setLayout(next);
    try {
      const res = await fetch(`/api/pages/${schema.slug}/layout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: next.map((e, i) => ({
            sectionKey: e.key,
            sortOrder: i,
            hidden: e.hidden,
          })),
        }),
      });
      if (!res.ok) throw new Error("Layout save failed");
    } catch (e) {
      const msg = (e as Error).message;
      toast.error(msg);
    }
  }

  function toggleHidden(key: string) {
    const next = layout.map((e) => (e.key === key ? { ...e, hidden: !e.hidden } : e));
    void persistLayout(next);
    const nowHidden = next.find((e) => e.key === key)?.hidden;
    toast.success(nowHidden ? "Section hidden from public site" : "Section visible on public site");
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Link
          href="/admin/pages"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-bold text-charcoal">{schema.label}</h1>
          <p className="text-sm text-bark mt-0.5">
            <a
              href={schema.publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-camp-red"
            >
              View public page
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statusMsg && <span className="text-xs text-green-700">{statusMsg}</span>}
          <a
            href={`${schema.publicHref}?preview=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-stone/30 hover:bg-cream"
            title="Open the public page with draft content visible"
          >
            <Eye className="h-3.5 w-3.5" />
            View Draft
          </a>
          <button
            onClick={discard}
            disabled={busy !== null || draftedKeys.size === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-stone/30 hover:bg-cream disabled:opacity-40"
            title="Discard all unpublished changes on this page"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {busy === "discarding" ? "Discarding…" : "Discard Draft"}
          </button>
          <button
            onClick={saveDraft}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-camp-red/40 text-camp-red hover:bg-camp-red/5 disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {busy === "saving" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={publish}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <PublishIcon className="h-4 w-4" />
            {busy === "publishing" ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      {usingDefaults && !loading && (
        <div className="mb-4 flex items-start gap-3 text-sm bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <strong>This page hasn&apos;t been saved through the editor yet.</strong> The
            fields below show the current live site copy. Click <em>Save Draft</em> then{" "}
            <em>Publish</em> to lock these values in.
          </div>
        </div>
      )}

      {draftedKeys.size > 0 && (
        <div className="mb-4 flex items-start gap-3 text-sm bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <strong>
              {draftedKeys.size} block{draftedKeys.size === 1 ? "" : "s"} have unpublished
              draft changes.
            </strong>{" "}
            <a
              href={`${schema.publicHref}?preview=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Preview them on the public page
            </a>{" "}
            before clicking Publish.
          </div>
        </div>
      )}

      {(() => {
        const ordered = applyLayoutClient(schema, layout);
        const pinned = ordered[0];
        const reorderable = ordered.slice(1);
        const reorderEntries = reorderable.map((s) => ({ key: s._key, hidden: s._hidden }));

        function onReorderEntries(next: Array<{ key: string; hidden: boolean }>) {
          // Prepend the pinned first section so its position never changes.
          const pinnedEntry = layout.find((e) => e.key === pinned._key) || {
            key: pinned._key,
            hidden: pinned._hidden,
          };
          void persistLayout([pinnedEntry, ...next]);
        }

        return (
          <div className="space-y-8">
            {pinned && (
              <SectionCard
                section={pinned}
                pageSlug={schema.slug}
                state={state}
                setState={setState}
                draftedKeys={draftedKeys}
                onRestored={load}
                pinned
              />
            )}

            <Reorder.Group
              axis="y"
              values={reorderEntries}
              onReorder={onReorderEntries}
              className="space-y-8"
            >
              {reorderable.map((section) => {
                const entry = reorderEntries.find((e) => e.key === section._key)!;
                return (
                  <ReorderableSectionCard
                    key={section._key}
                    entry={entry}
                    section={section}
                    pageSlug={schema.slug}
                    state={state}
                    setState={setState}
                    draftedKeys={draftedKeys}
                    onRestored={load}
                    onToggleHidden={() => toggleHidden(section._key)}
                  />
                );
              })}
            </Reorder.Group>
          </div>
        );
      })()}

      <div className="space-y-8 mt-8">
        <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-stone/30">
          <button
            onClick={saveDraft}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-camp-red/40 text-camp-red hover:bg-camp-red/5 disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
            {busy === "saving" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={publish}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <PublishIcon className="h-4 w-4" />
            {busy === "publishing" ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section card (shared by pinned + reorderable) ───────────────────────
function SectionInner({
  section,
  pageSlug,
  state,
  setState,
  onRestored,
}: {
  section: SectionSchema & { _hidden?: boolean };
  pageSlug: string;
  state: Record<string, unknown>;
  setState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onRestored: () => void;
}) {
  return (
    <div className={`space-y-4 ${section._hidden ? "opacity-50" : ""}`}>
      {section.blocks.map((block) => (
        <BlockField
          key={block.key}
          block={block}
          pageSlug={pageSlug}
          showRevisions={section.blocks.length > 1}
          value={state[block.key]}
          onChange={(v) => setState((s) => ({ ...s, [block.key]: v }))}
          onRestored={onRestored}
        />
      ))}
    </div>
  );
}

function SectionHeader({
  section,
  pageSlug,
  draftedKeys,
  onRestored,
  hidden,
  onToggleHidden,
  dragControls,
  pinned,
}: {
  section: SectionSchema;
  pageSlug: string;
  draftedKeys: Set<string>;
  onRestored: () => void;
  hidden: boolean;
  onToggleHidden?: () => void;
  dragControls?: ReturnType<typeof useDragControls>;
  pinned?: boolean;
}) {
  const sectionHasDraft = section.blocks.some((b) => draftedKeys.has(b.key));
  return (
    <div className="flex items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        {!pinned && dragControls && (
          <button
            type="button"
            aria-label="Drag section to reorder"
            onPointerDown={(e) => dragControls.start(e)}
            className="touch-none cursor-grab active:cursor-grabbing p-1.5 text-stone hover:text-bark -ml-1"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <h2 className="font-semibold text-charcoal truncate">{section.label}</h2>
        {sectionHasDraft && (
          <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
            Draft
          </span>
        )}
        {hidden && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-stone/40 text-bark uppercase tracking-wider">
            <EyeOff className="h-3 w-3" />
            Hidden
          </span>
        )}
        {section.help && (
          <p className="text-xs text-bark mt-0.5">{section.help}</p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!pinned && onToggleHidden && (
          <button
            type="button"
            onClick={onToggleHidden}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-bark hover:bg-cream"
            title={hidden ? "Show on public site" : "Hide from public site"}
          >
            {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {hidden ? "Show" : "Hide"}
          </button>
        )}
        {section.blocks.length === 1 && (
          <RevisionsButton
            pageSlug={pageSlug}
            blockKey={section.blocks[0].key}
            onRestored={onRestored}
          />
        )}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  pageSlug,
  state,
  setState,
  draftedKeys,
  onRestored,
  pinned,
}: {
  section: SectionSchema & { _hidden?: boolean };
  pageSlug: string;
  state: Record<string, unknown>;
  setState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  draftedKeys: Set<string>;
  onRestored: () => void;
  pinned?: boolean;
}) {
  const sectionHasDraft = section.blocks.some((b) => draftedKeys.has(b.key));
  return (
    <section
      className={`bg-white rounded-2xl border p-5 ${
        sectionHasDraft ? "border-blue-300/60 ring-1 ring-blue-100" : "border-stone/30"
      }`}
    >
      <SectionHeader
        section={section}
        pageSlug={pageSlug}
        draftedKeys={draftedKeys}
        onRestored={onRestored}
        hidden={!!section._hidden}
        pinned={pinned}
      />
      <SectionInner
        section={section}
        pageSlug={pageSlug}
        state={state}
        setState={setState}
        onRestored={onRestored}
      />
    </section>
  );
}

function ReorderableSectionCard({
  entry,
  section,
  pageSlug,
  state,
  setState,
  draftedKeys,
  onRestored,
  onToggleHidden,
}: {
  entry: { key: string; hidden: boolean };
  section: SectionSchema & { _hidden?: boolean; _key: string };
  pageSlug: string;
  state: Record<string, unknown>;
  setState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  draftedKeys: Set<string>;
  onRestored: () => void;
  onToggleHidden: () => void;
}) {
  const dragControls = useDragControls();
  const sectionHasDraft = section.blocks.some((b) => draftedKeys.has(b.key));
  return (
    <Reorder.Item
      value={entry}
      id={entry.key}
      dragListener={false}
      dragControls={dragControls}
      className={`bg-white rounded-2xl border p-5 ${
        sectionHasDraft ? "border-blue-300/60 ring-1 ring-blue-100" : "border-stone/30"
      }`}
    >
      <SectionHeader
        section={section}
        pageSlug={pageSlug}
        draftedKeys={draftedKeys}
        onRestored={onRestored}
        hidden={entry.hidden}
        onToggleHidden={onToggleHidden}
        dragControls={dragControls}
      />
      <SectionInner
        section={{ ...section, _hidden: entry.hidden }}
        pageSlug={pageSlug}
        state={state}
        setState={setState}
        onRestored={onRestored}
      />
    </Reorder.Item>
  );
}

// ─── Per-block field rendering ────────────────────────────────────────────
function BlockField({
  block,
  pageSlug,
  showRevisions,
  value,
  onChange,
  onRestored,
}: {
  block: BlockSchema;
  pageSlug: string;
  showRevisions: boolean;
  value: unknown;
  onChange: (v: unknown) => void;
  onRestored: () => void;
}) {
  return (
    <div>
      {block.label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-bark uppercase tracking-wider">
            {block.label}
          </label>
          {showRevisions && (
            <RevisionsButton
              pageSlug={pageSlug}
              blockKey={block.key}
              onRestored={onRestored}
            />
          )}
        </div>
      )}
      {!block.label && showRevisions && (
        <div className="flex justify-end mb-1.5">
          <RevisionsButton
            pageSlug={pageSlug}
            blockKey={block.key}
            onRestored={onRestored}
          />
        </div>
      )}
      {renderInput(block, value, onChange)}
      {block.help && <p className="text-xs text-bark mt-1.5">{block.help}</p>}
    </div>
  );
}

function renderInput(
  block: BlockSchema,
  value: unknown,
  onChange: (v: unknown) => void
) {
  switch (block.type) {
    case "text": {
      const v = (value as { value: string } | undefined)?.value || "";
      return (
        <input
          type="text"
          value={v}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={block.placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
        />
      );
    }
    case "richtext": {
      const v = (value as { html: string } | undefined)?.html || "";
      return (
        <RichTextEditor
          value={v}
          onChange={(html) => onChange({ html })}
          placeholder={block.placeholder}
        />
      );
    }
    case "image": {
      const v = (value as { url: string; alt?: string } | undefined) || { url: "", alt: "" };
      return (
        <div className="space-y-2">
          <MediaPicker
            kind="image"
            value={v.url || null}
            aspectClass={block.aspectClass}
            onChange={(url, asset) =>
              onChange({
                url: url || "",
                alt: asset?.alt || v.alt || "",
              })
            }
          />
          <div>
            <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
              Alt text
            </label>
            <input
              type="text"
              value={v.alt || ""}
              onChange={(e) => onChange({ ...v, alt: e.target.value })}
              placeholder="Describe the image for screen readers"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
            />
          </div>
        </div>
      );
    }
    case "document": {
      const v = (value as { url: string; label?: string } | undefined) || { url: "", label: "" };
      return (
        <div className="space-y-2">
          <MediaPicker
            kind="document"
            value={v.url || null}
            label={v.label}
            onChange={(url) => onChange({ ...v, url: url || "" })}
          />
          <div>
            <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
              Link label (optional)
            </label>
            <input
              type="text"
              value={v.label || ""}
              onChange={(e) => onChange({ ...v, label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
            />
          </div>
        </div>
      );
    }
    case "rows": {
      const rowsBlock = block as RowsBlockSchema;
      const rows =
        ((value as { rows: Record<string, string>[] } | undefined)?.rows) || [];
      return (
        <RowEditor
          rows={rows}
          onChange={(next) => onChange({ rows: next })}
          columns={rowsBlock.columns}
          blank={rowsBlock.blank}
        />
      );
    }
    case "table": {
      const tableBlock = block as TableBlockSchema;
      const v = (value as Partial<TableContent> | undefined) ?? {};
      const columns =
        Array.isArray(v.columns) && v.columns.length > 0
          ? v.columns
          : tableBlock.defaultContent.columns;
      const rows = Array.isArray(v.rows) ? v.rows : [];
      return (
        <TableEditor
          columns={columns}
          rows={rows}
          onChange={(next) => onChange(next)}
        />
      );
    }
  }
}

// ─── Rows editor (reused from RatesEditor — generic over any column set) ──
// Stable id per row so framer-motion's Reorder can track them across drags.
// Rows are stored as plain objects; we synthesize ids at editor time only.
interface RowWithId {
  __id: string;
  row: Record<string, string>;
}

function RowEditor({
  rows,
  onChange,
  columns,
  blank,
}: {
  rows: Record<string, string>[];
  onChange: (rows: Record<string, string>[]) => void;
  columns: { key: string; label: string; width?: string; multiline?: boolean }[];
  blank: Record<string, string>;
}) {
  const baseId = useId();
  const [withIds, setWithIds] = useState<RowWithId[]>(() =>
    rows.map((r, i) => ({ __id: `${baseId}-${i}`, row: r }))
  );

  // Re-sync from incoming `rows` only when the *count* changes (add/remove
  // from elsewhere). We don't reset on every keystroke because that would
  // wipe the stable __id mapping during dragging.
  useEffect(() => {
    if (withIds.length !== rows.length) {
      setWithIds(rows.map((r, i) => ({ __id: `${baseId}-${i}-${Date.now()}`, row: r })));
    }
  }, [rows, baseId, withIds.length]);

  function update(id: string, key: string, val: string) {
    const next = withIds.map((it) =>
      it.__id === id ? { ...it, row: { ...it.row, [key]: val } } : it
    );
    setWithIds(next);
    onChange(next.map((it) => it.row));
  }
  function remove(id: string) {
    const next = withIds.filter((it) => it.__id !== id);
    setWithIds(next);
    onChange(next.map((it) => it.row));
  }
  function add() {
    const next = [...withIds, { __id: `${baseId}-new-${Date.now()}`, row: { ...blank } }];
    setWithIds(next);
    onChange(next.map((it) => it.row));
  }
  function reorder(next: RowWithId[]) {
    setWithIds(next);
    onChange(next.map((it) => it.row));
  }

  return (
    <div>
      <div className="border border-stone/30 rounded-xl overflow-hidden">
        <div className="bg-cream/50 border-b border-stone/20 grid items-center text-xs font-semibold text-bark uppercase tracking-wider"
          style={{ gridTemplateColumns: `28px ${columns.map((c) => c.width || "1fr").join(" ")} 40px` }}>
          <span />
          {columns.map((c) => (
            <span key={c.key} className="px-3 py-2 text-left">{c.label}</span>
          ))}
          <span />
        </div>
        {withIds.length === 0 ? (
          <p className="px-3 py-4 text-center text-bark text-sm">No rows yet. Click &ldquo;Add row&rdquo; below.</p>
        ) : (
          <Reorder.Group axis="y" values={withIds} onReorder={reorder} className="divide-y divide-stone/10">
            {withIds.map((it) => (
              <RowItem
                key={it.__id}
                item={it}
                columns={columns}
                onUpdate={(k, v) => update(it.__id, k, v)}
                onRemove={() => remove(it.__id)}
                gridTemplate={`28px ${columns.map((c) => c.width || "1fr").join(" ")} 40px`}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
      >
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}

function RowItem({
  item,
  columns,
  onUpdate,
  onRemove,
  gridTemplate,
}: {
  item: RowWithId;
  columns: { key: string; label: string; width?: string; multiline?: boolean }[];
  onUpdate: (key: string, val: string) => void;
  onRemove: () => void;
  gridTemplate: string;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      id={item.__id}
      dragListener={false}
      dragControls={dragControls}
      className="bg-white"
    >
      <div className="grid items-center" style={{ gridTemplateColumns: gridTemplate }}>
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing p-2 text-stone hover:text-bark"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {columns.map((c) => (
          <div key={c.key} className="px-2 py-1.5">
            {c.multiline ? (
              <textarea
                value={item.row[c.key] || ""}
                onChange={(e) => onUpdate(c.key, e.target.value)}
                rows={2}
                className="w-full px-2 py-1 rounded border border-stone bg-white text-sm resize-y"
              />
            ) : (
              <input
                type="text"
                value={item.row[c.key] || ""}
                onChange={(e) => onUpdate(c.key, e.target.value)}
                className="w-full px-2 py-1 rounded border border-stone bg-white text-sm"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-bark hover:text-red-600 hover:bg-red-50 rounded mr-2"
          aria-label="Remove row"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ─── Table editor (rows + admin-editable column headers) ─────────────────
// Like RowEditor, but columns live in content (not the schema), so admins
// can rename headers and add/remove columns. New column keys are minted as
// `col_N` so they survive label renames.
function nextColumnKey(existing: TableColumn[]): string {
  const taken = new Set(existing.map((c) => c.key));
  for (let i = existing.length + 1; ; i++) {
    const k = `col_${i}`;
    if (!taken.has(k)) return k;
  }
}

interface TableRowWithId {
  __id: string;
  row: Record<string, string>;
}

function TableEditor({
  columns,
  rows,
  onChange,
}: {
  columns: TableColumn[];
  rows: Record<string, string>[];
  onChange: (next: TableContent) => void;
}) {
  const baseId = useId();
  const [withIds, setWithIds] = useState<TableRowWithId[]>(() =>
    rows.map((r, i) => ({ __id: `${baseId}-${i}`, row: r }))
  );

  useEffect(() => {
    if (withIds.length !== rows.length) {
      setWithIds(rows.map((r, i) => ({ __id: `${baseId}-${i}-${Date.now()}`, row: r })));
    }
  }, [rows, baseId, withIds.length]);

  function emit(nextCols: TableColumn[], nextRows: TableRowWithId[]) {
    onChange({ columns: nextCols, rows: nextRows.map((it) => it.row) });
  }

  function renameColumn(key: string, label: string) {
    const next = columns.map((c) => (c.key === key ? { ...c, label } : c));
    emit(next, withIds);
  }
  function addColumn() {
    const k = nextColumnKey(columns);
    emit([...columns, { key: k, label: "New column" }], withIds);
  }
  function removeColumn(key: string) {
    const col = columns.find((c) => c.key === key);
    if (
      !confirm(
        `Delete column "${col?.label ?? key}"? Cell values for this column will be cleared.`
      )
    ) {
      return;
    }
    const nextCols = columns.filter((c) => c.key !== key);
    const nextRows = withIds.map((it) => {
      const { [key]: _drop, ...rest } = it.row;
      void _drop;
      return { ...it, row: rest };
    });
    setWithIds(nextRows);
    emit(nextCols, nextRows);
  }

  function updateCell(id: string, key: string, val: string) {
    const next = withIds.map((it) =>
      it.__id === id ? { ...it, row: { ...it.row, [key]: val } } : it
    );
    setWithIds(next);
    emit(columns, next);
  }
  function removeRow(id: string) {
    const next = withIds.filter((it) => it.__id !== id);
    setWithIds(next);
    emit(columns, next);
  }
  function addRow() {
    const blank: Record<string, string> = {};
    for (const c of columns) blank[c.key] = "";
    const next = [...withIds, { __id: `${baseId}-new-${Date.now()}`, row: blank }];
    setWithIds(next);
    emit(columns, next);
  }
  function reorderRows(next: TableRowWithId[]) {
    setWithIds(next);
    emit(columns, next);
  }

  const gridTemplate = `28px ${columns.map(() => "1fr").join(" ")} 40px`;

  return (
    <div>
      {/* Column headers — editable labels with per-column delete */}
      <div className="border border-stone/30 rounded-xl overflow-hidden">
        <div
          className="bg-cream/50 border-b border-stone/20 grid items-center"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <span />
          {columns.map((c) => (
            <div key={c.key} className="px-2 py-1.5 flex items-center gap-1">
              <input
                type="text"
                value={c.label}
                onChange={(e) => renameColumn(c.key, e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 rounded border border-stone bg-white text-xs font-semibold text-bark uppercase tracking-wider"
                aria-label={`Column header: ${c.label}`}
              />
              <button
                type="button"
                onClick={() => removeColumn(c.key)}
                className="p-1 text-bark hover:text-red-600 hover:bg-red-50 rounded shrink-0"
                aria-label={`Remove column ${c.label}`}
                disabled={columns.length <= 1}
                title={
                  columns.length <= 1 ? "At least one column is required" : "Remove column"
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <span />
        </div>

        {/* Rows */}
        {withIds.length === 0 ? (
          <p className="px-3 py-4 text-center text-bark text-sm">
            No rows yet. Click &ldquo;Add row&rdquo; below.
          </p>
        ) : (
          <Reorder.Group
            axis="y"
            values={withIds}
            onReorder={reorderRows}
            className="divide-y divide-stone/10"
          >
            {withIds.map((it) => (
              <TableRowItem
                key={it.__id}
                item={it}
                columns={columns}
                onUpdate={(k, v) => updateCell(it.__id, k, v)}
                onRemove={() => removeRow(it.__id)}
                gridTemplate={gridTemplate}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
        >
          <Plus className="h-3.5 w-3.5" />
          Add row
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
        >
          <Plus className="h-3.5 w-3.5" />
          Add column
        </button>
      </div>
    </div>
  );
}

function TableRowItem({
  item,
  columns,
  onUpdate,
  onRemove,
  gridTemplate,
}: {
  item: TableRowWithId;
  columns: TableColumn[];
  onUpdate: (key: string, val: string) => void;
  onRemove: () => void;
  gridTemplate: string;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      id={item.__id}
      dragListener={false}
      dragControls={dragControls}
      className="bg-white"
    >
      <div className="grid items-center" style={{ gridTemplateColumns: gridTemplate }}>
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing p-2 text-stone hover:text-bark"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {columns.map((c) => (
          <div key={c.key} className="px-2 py-1.5">
            <input
              type="text"
              value={item.row[c.key] || ""}
              onChange={(e) => onUpdate(c.key, e.target.value)}
              className="w-full px-2 py-1 rounded border border-stone bg-white text-sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-bark hover:text-red-600 hover:bg-red-50 rounded mr-2"
          aria-label="Remove row"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function initialState(schema: PageSchema): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const b of flattenBlocks(schema)) {
    out[b.key] = structuredClone(b.defaultContent);
  }
  return out;
}

function hydrateState(schema: PageSchema, blocks: BlocksMap): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const b of flattenBlocks(schema)) {
    out[b.key] = blocks[b.key]?.content ?? structuredClone(b.defaultContent);
  }
  return out;
}

async function saveBlock(
  pageSlug: string,
  blockKey: string,
  blockType: string,
  content: object
) {
  const res = await fetch(`/api/pages/${pageSlug}/blocks/${blockKey}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blockType, content }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Save failed");
  }
}
