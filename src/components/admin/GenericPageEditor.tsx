"use client";

/**
 * Schema-driven page editor. Render any page's CMS form by passing a
 * PageSchema. Handles loading, saving, defaults fallback, revisions,
 * and the right input UI per block type.
 *
 * Public pages should consume the same schema's defaults so the editor
 * + the rendered page never drift.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RevisionsButton } from "@/components/admin/RevisionsButton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type {
  PageSchema,
  BlockSchema,
  RowsBlockSchema,
} from "@/lib/page-schemas/types";
import { flattenBlocks } from "@/lib/page-schemas/types";

type BlocksMap = Record<string, { type: string; content: Record<string, unknown> } | undefined>;

export default function GenericPageEditor({ schema }: { schema: PageSchema }) {
  const [state, setState] = useState<Record<string, unknown>>(() => initialState(schema));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
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
        setLoading(false);
        return;
      }
      const data = await res.json();
      const blocks: BlocksMap = data.blocks || {};
      setState(hydrateState(schema, blocks));
      setUsingDefaults(
        flattenBlocks(schema).every((b) => blocks[b.key] == null)
      );
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

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        flattenBlocks(schema).map((b) =>
          saveBlock(schema.slug, b.key, b.type, state[b.key] as object)
        )
      );
      setSavedAt(new Date());
      setUsingDefaults(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/pages"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
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
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-green-700">
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All Changes"}
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
            fields below show the current live site copy. Click <em>Save All Changes</em>{" "}
            to lock these values into the editor — after that, every edit you make will
            persist and roll-back.
          </div>
        </div>
      )}

      <div className="space-y-8">
        {schema.sections.map((section, si) => (
          <section
            key={si}
            className="bg-white rounded-2xl border border-stone/30 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-charcoal">{section.label}</h2>
                {section.help && (
                  <p className="text-xs text-bark mt-0.5">{section.help}</p>
                )}
              </div>
              {/* If the section has exactly one block, show its revisions button here. */}
              {section.blocks.length === 1 && (
                <RevisionsButton
                  pageSlug={schema.slug}
                  blockKey={section.blocks[0].key}
                  onRestored={load}
                />
              )}
            </div>
            <div className="space-y-4">
              {section.blocks.map((block) => (
                <BlockField
                  key={block.key}
                  block={block}
                  pageSlug={schema.slug}
                  showRevisions={section.blocks.length > 1}
                  value={state[block.key]}
                  onChange={(v) => setState((s) => ({ ...s, [block.key]: v }))}
                  onRestored={load}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end pt-2 border-t border-stone/30">
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
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
  }
}

// ─── Rows editor (reused from RatesEditor — generic over any column set) ──
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
  function update(index: number, key: string, val: string) {
    onChange(rows.map((r, i) => (i === index ? { ...r, [key]: val } : r)));
  }
  function remove(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...rows, { ...blank }]);
  }

  return (
    <div>
      <div className="border border-stone/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream/50 border-b border-stone/20">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-3 py-2 text-xs font-semibold text-bark uppercase"
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-4 text-center text-bark text-sm"
                >
                  No rows yet. Click &ldquo;Add row&rdquo; below.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-stone/10 last:border-b-0">
                {columns.map((c) => (
                  <td key={c.key} className="px-2 py-1.5">
                    {c.multiline ? (
                      <textarea
                        value={row[c.key] || ""}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 rounded border border-stone bg-white text-sm resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[c.key] || ""}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        className="w-full px-2 py-1 rounded border border-stone bg-white text-sm"
                      />
                    )}
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-1.5 text-bark hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
