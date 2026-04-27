"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import slugify from "slugify";

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState({ name: "", slug: "", sortOrder: 0 });

  async function load() {
    const res = await fetch("/api/categories");
    setCats(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(id?: string) {
    const payload = {
      name: draft.name,
      slug: draft.slug || slugify(draft.name, { lower: true, strict: true }),
      sortOrder: draft.sortOrder,
    };
    const url = id ? `/api/categories/${id}` : "/api/categories";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert((await res.json()).error || "Save failed");
      return;
    }
    setEditing(null);
    setDraft({ name: "", slug: "", sortOrder: 0 });
    await load();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) await load();
    else alert("Delete failed");
  }

  function startEdit(c: Category) {
    setEditing(c.id);
    setDraft({ name: c.name, slug: c.slug, sortOrder: c.sortOrder });
  }

  function startNew() {
    setEditing("new");
    setDraft({ name: "", slug: "", sortOrder: cats.length });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Categories</h1>
        {editing !== "new" && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-camp-red-dark"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {loading ? (
          <p className="px-4 py-6 text-sm text-bark">Loading…</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20 bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider w-24">Order</th>
                <th className="w-32" />
              </tr>
            </thead>
            <tbody>
              {editing === "new" && (
                <EditingRow draft={draft} setDraft={setDraft} onSave={() => save()} onCancel={() => setEditing(null)} />
              )}
              {cats.map((c) =>
                editing === c.id ? (
                  <EditingRow
                    key={c.id}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={() => save(c.id)}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <tr key={c.id} className="border-b border-stone/10 hover:bg-cream/50">
                    <td className="px-4 py-3 text-sm font-semibold text-charcoal">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-bark font-mono">{c.slug}</td>
                    <td className="px-4 py-3 text-sm text-bark">{c.sortOrder}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button onClick={() => startEdit(c)} className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(c.id, c.name)} className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EditingRow({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: { name: string; slug: string; sortOrder: number };
  setDraft: (d: { name: string; slug: string; sortOrder: number }) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <tr className="border-b border-stone/10 bg-cream/30">
      <td className="px-4 py-3">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          autoFocus
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone bg-white"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={draft.slug}
          onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          placeholder="(auto)"
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone bg-white font-mono"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={draft.sortOrder}
          onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
          className="w-20 px-3 py-1.5 text-sm rounded-lg border border-stone bg-white"
        />
      </td>
      <td className="px-4 py-3 flex gap-1">
        <button onClick={onSave} className="p-2 text-green-700 hover:bg-green-50 rounded-lg">
          <Save className="h-4 w-4" />
        </button>
        <button onClick={onCancel} className="p-2 text-bark hover:bg-sand rounded-lg">
          <X className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
