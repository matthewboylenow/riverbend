"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

const MAX_FEATURED = 2;

interface LinkRow {
  label: string;
  href: string;
  external: boolean;
  description: string;
}
interface ColumnRow {
  heading: string;
  links: LinkRow[];
}
interface FeaturedRow {
  title: string;
  description: string;
  href: string;
  cta: string;
  external: boolean;
}
interface GroupRow {
  label: string;
  tagline: string;
  columns: ColumnRow[];
  featured: FeaturedRow[];
}

const blankLink = (): LinkRow => ({ label: "", href: "", external: false, description: "" });
const blankColumn = (): ColumnRow => ({ heading: "", links: [blankLink()] });
const blankFeatured = (): FeaturedRow => ({
  title: "",
  description: "",
  href: "",
  cta: "Learn more",
  external: false,
});
const blankGroup = (): GroupRow => ({
  label: "New Group",
  tagline: "",
  columns: [blankColumn()],
  featured: [],
});

export default function NavigationEditor() {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/navigation");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setGroups(
        data.groups.map(
          (g: {
            label: string;
            tagline: string | null;
            columns: Array<{
              heading: string | null;
              links: Array<{
                label: string;
                href: string;
                external: boolean;
                description: string | null;
              }>;
            }>;
            featured: Array<{
              title: string;
              description: string;
              href: string;
              cta: string;
              external: boolean;
            }>;
          }): GroupRow => ({
            label: g.label,
            tagline: g.tagline || "",
            columns: g.columns.map((c) => ({
              heading: c.heading || "",
              links: c.links.map((l) => ({
                label: l.label,
                href: l.href,
                external: !!l.external,
                description: l.description || "",
              })),
            })),
            featured: g.featured.map((f) => ({
              title: f.title,
              description: f.description,
              href: f.href,
              cta: f.cta,
              external: !!f.external,
            })),
          })
        )
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      setSavedAt(new Date());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function updateGroup(idx: number, patch: Partial<GroupRow>) {
    setGroups((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  }
  function moveGroup(idx: number, dir: -1 | 1) {
    setGroups((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }
  function removeGroup(idx: number) {
    if (!confirm("Delete this whole nav group?")) return;
    setGroups((prev) => prev.filter((_, i) => i !== idx));
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Navigation</h1>
          <p className="text-sm text-bark mt-1">
            Edit the mega-menu groups, columns, links, and featured (red) cards. Up to{" "}
            {MAX_FEATURED} featured cards per group.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-green-700">
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="space-y-6">
        {groups.map((g, gi) => (
          <GroupCard
            key={gi}
            group={g}
            onChange={(patch) => updateGroup(gi, patch)}
            onMoveUp={gi > 0 ? () => moveGroup(gi, -1) : undefined}
            onMoveDown={gi < groups.length - 1 ? () => moveGroup(gi, 1) : undefined}
            onDelete={() => removeGroup(gi)}
          />
        ))}

        <button
          onClick={() => setGroups((prev) => [...prev, blankGroup()])}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone/40 text-bark hover:border-camp-red/40 hover:text-camp-red"
        >
          <Plus className="h-4 w-4" />
          Add nav group
        </button>

        <div className="flex justify-end pt-2 border-t border-stone/30">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Group card ──────────────────────────────────────────
function GroupCard({
  group,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  group: GroupRow;
  onChange: (patch: Partial<GroupRow>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
}) {
  function updateColumn(ci: number, patch: Partial<ColumnRow>) {
    onChange({
      columns: group.columns.map((c, i) => (i === ci ? { ...c, ...patch } : c)),
    });
  }
  function addColumn() {
    onChange({ columns: [...group.columns, blankColumn()] });
  }
  function removeColumn(ci: number) {
    onChange({ columns: group.columns.filter((_, i) => i !== ci) });
  }
  function moveColumn(ci: number, dir: -1 | 1) {
    const cols = [...group.columns];
    const j = ci + dir;
    if (j < 0 || j >= cols.length) return;
    [cols[ci], cols[j]] = [cols[j], cols[ci]];
    onChange({ columns: cols });
  }

  function updateLink(ci: number, li: number, patch: Partial<LinkRow>) {
    const col = group.columns[ci];
    updateColumn(ci, { links: col.links.map((l, i) => (i === li ? { ...l, ...patch } : l)) });
  }
  function addLink(ci: number) {
    updateColumn(ci, { links: [...group.columns[ci].links, blankLink()] });
  }
  function removeLink(ci: number, li: number) {
    updateColumn(ci, { links: group.columns[ci].links.filter((_, i) => i !== li) });
  }
  function moveLink(ci: number, li: number, dir: -1 | 1) {
    const links = [...group.columns[ci].links];
    const j = li + dir;
    if (j < 0 || j >= links.length) return;
    [links[li], links[j]] = [links[j], links[li]];
    updateColumn(ci, { links });
  }

  function promoteToFeatured(ci: number, li: number) {
    if (group.featured.length >= MAX_FEATURED) {
      alert(`This group already has ${MAX_FEATURED} featured cards. Remove one first.`);
      return;
    }
    const link = group.columns[ci].links[li];
    onChange({
      featured: [
        ...group.featured,
        {
          title: link.label,
          description: link.description || "",
          href: link.href,
          cta: "Learn more",
          external: link.external,
        },
      ],
      columns: group.columns.map((c, i) =>
        i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c
      ),
    });
  }

  function updateFeatured(fi: number, patch: Partial<FeaturedRow>) {
    onChange({
      featured: group.featured.map((f, i) => (i === fi ? { ...f, ...patch } : f)),
    });
  }
  function addFeatured() {
    if (group.featured.length >= MAX_FEATURED) return;
    onChange({ featured: [...group.featured, blankFeatured()] });
  }
  function removeFeatured(fi: number) {
    onChange({ featured: group.featured.filter((_, i) => i !== fi) });
  }

  return (
    <section className="bg-white rounded-2xl border border-stone/30 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="p-0.5 text-bark/60 hover:text-charcoal disabled:opacity-20"
            title="Move group up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="p-0.5 text-bark/60 hover:text-charcoal disabled:opacity-20"
            title="Move group down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1">
              Label
            </label>
            <input
              type="text"
              value={group.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1">
              Tagline (optional)
            </label>
            <input
              type="text"
              value={group.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone/30"
            />
          </div>
        </div>

        <button
          onClick={onDelete}
          className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded"
          title="Delete this group"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Columns */}
      <div className="mt-2 space-y-3">
        {group.columns.map((col, ci) => (
          <div key={ci} className="rounded-xl border border-stone/20 bg-cream/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Column heading (optional)"
                value={col.heading}
                onChange={(e) => updateColumn(ci, { heading: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone/30 text-sm font-medium"
              />
              <button
                onClick={() => moveColumn(ci, -1)}
                disabled={ci === 0}
                className="p-1 text-bark/60 hover:text-charcoal disabled:opacity-20"
                title="Move column up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveColumn(ci, 1)}
                disabled={ci === group.columns.length - 1}
                className="p-1 text-bark/60 hover:text-charcoal disabled:opacity-20"
                title="Move column down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeColumn(ci)}
                className="p-1 text-bark hover:text-red-600 hover:bg-red-50 rounded"
                title="Delete column"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {col.links.map((link, li) => (
                <div key={li} className="grid grid-cols-12 gap-2 items-start text-sm">
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateLink(ci, li, { label: e.target.value })}
                    className="col-span-3 px-2 py-1.5 rounded border border-stone/30"
                  />
                  <input
                    type="text"
                    placeholder="/path or https://…"
                    value={link.href}
                    onChange={(e) => updateLink(ci, li, { href: e.target.value })}
                    className="col-span-4 px-2 py-1.5 rounded border border-stone/30 font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={link.description}
                    onChange={(e) => updateLink(ci, li, { description: e.target.value })}
                    className="col-span-3 px-2 py-1.5 rounded border border-stone/30"
                  />
                  <label
                    className="col-span-1 inline-flex items-center justify-center gap-1 text-xs text-bark"
                    title="External link (opens in new tab)"
                  >
                    <input
                      type="checkbox"
                      checked={link.external}
                      onChange={(e) => updateLink(ci, li, { external: e.target.checked })}
                    />
                    <ExternalLink className="h-3 w-3" />
                  </label>
                  <div className="col-span-1 flex items-center justify-end gap-0.5">
                    <button
                      onClick={() => moveLink(ci, li, -1)}
                      disabled={li === 0}
                      className="p-0.5 text-bark/60 hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveLink(ci, li, 1)}
                      disabled={li === col.links.length - 1}
                      className="p-0.5 text-bark/60 hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => promoteToFeatured(ci, li)}
                      disabled={group.featured.length >= MAX_FEATURED}
                      className="p-1 text-bark hover:text-camp-red disabled:opacity-20"
                      title={
                        group.featured.length >= MAX_FEATURED
                          ? `Already at ${MAX_FEATURED} featured cards`
                          : "Promote to featured (red) card"
                      }
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeLink(ci, li)}
                      className="p-1 text-bark hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addLink(ci)}
              className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-xs text-camp-red hover:bg-camp-red/10 rounded"
            >
              <Plus className="h-3 w-3" />
              Add link
            </button>
          </div>
        ))}

        <button
          onClick={addColumn}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <Plus className="h-3 w-3" />
          Add column
        </button>
      </div>

      {/* Featured cards */}
      <div className="mt-5 pt-5 border-t border-stone/20">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-camp-red" />
          <h3 className="font-semibold text-charcoal">Featured cards</h3>
          <span className="text-xs text-bark">
            ({group.featured.length} / {MAX_FEATURED})
          </span>
        </div>
        <div className="space-y-3">
          {group.featured.map((f, fi) => (
            <div key={fi} className="rounded-xl bg-camp-red/5 border border-camp-red/20 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <input
                  type="text"
                  placeholder="Title"
                  value={f.title}
                  onChange={(e) => updateFeatured(fi, { title: e.target.value })}
                  className="px-2 py-1.5 rounded border border-stone/30 font-semibold"
                />
                <input
                  type="text"
                  placeholder="CTA button label (e.g. Learn more)"
                  value={f.cta}
                  onChange={(e) => updateFeatured(fi, { cta: e.target.value })}
                  className="px-2 py-1.5 rounded border border-stone/30"
                />
                <textarea
                  placeholder="Description"
                  value={f.description}
                  onChange={(e) => updateFeatured(fi, { description: e.target.value })}
                  rows={2}
                  className="sm:col-span-2 px-2 py-1.5 rounded border border-stone/30 resize-y"
                />
                <input
                  type="text"
                  placeholder="/path or https://…"
                  value={f.href}
                  onChange={(e) => updateFeatured(fi, { href: e.target.value })}
                  className="sm:col-span-2 px-2 py-1.5 rounded border border-stone/30 font-mono text-xs"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="inline-flex items-center gap-1 text-xs text-bark">
                  <input
                    type="checkbox"
                    checked={f.external}
                    onChange={(e) => updateFeatured(fi, { external: e.target.checked })}
                  />
                  <ExternalLink className="h-3 w-3" />
                  External link
                </label>
                <button
                  onClick={() => removeFeatured(fi)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-bark hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          {group.featured.length < MAX_FEATURED && (
            <button
              onClick={addFeatured}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              Add featured card
            </button>
          )}
        </div>
        <p className="text-xs text-bark/70 mt-2">
          Tip: click the <Star className="inline h-3 w-3" /> icon next to any link in a column to
          promote it to a featured card.
        </p>
      </div>
    </section>
  );
}
