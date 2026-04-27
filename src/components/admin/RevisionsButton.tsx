"use client";

import { useEffect, useState } from "react";
import { History, RotateCcw, X } from "lucide-react";

interface Revision {
  id: string;
  blockType: string;
  contentJson: unknown;
  createdAt: string;
}

interface RevisionsButtonProps {
  pageSlug: string;
  blockKey: string;
  onRestored: () => void;
}

/**
 * Inline button — when clicked, opens a small panel listing the most recent
 * revisions (up to 5) and lets the user roll back to one. After a successful
 * rollback, the parent reloads its current values via onRestored().
 */
export function RevisionsButton({ pageSlug, blockKey, onRestored }: RevisionsButtonProps) {
  const [open, setOpen] = useState(false);
  const [revs, setRevs] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void fetch(`/api/pages/${pageSlug}/blocks/${blockKey}`)
      .then((r) => r.json())
      .then((d) => setRevs(d.revisions || []))
      .finally(() => setLoading(false));
  }, [open, pageSlug, blockKey]);

  async function restore(revisionId: string) {
    if (!confirm("Roll back to this version? Your current draft will be saved as a new revision first.")) return;
    setRestoring(revisionId);
    try {
      const res = await fetch(`/api/pages/${pageSlug}/blocks/${blockKey}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      if (!res.ok) {
        alert((await res.json()).error || "Restore failed");
        return;
      }
      setOpen(false);
      onRestored();
    } finally {
      setRestoring(null);
    }
  }

  function previewOf(rev: Revision): string {
    const c = rev.contentJson as Record<string, unknown>;
    if (typeof c?.html === "string") {
      return (c.html as string).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
    }
    if (typeof c?.value === "string") return (c.value as string).slice(0, 80);
    if (Array.isArray(c?.rows)) return `${(c.rows as unknown[]).length} rows`;
    return "—";
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="View revision history"
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-bark hover:text-charcoal hover:bg-sand rounded-md"
      >
        <History className="h-3 w-3" />
        History
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-white border border-stone rounded-xl shadow-lg z-20">
          <div className="flex items-center justify-between px-3 py-2 border-b border-stone/30">
            <span className="text-xs font-semibold text-charcoal">Recent revisions</span>
            <button onClick={() => setOpen(false)} className="text-bark hover:text-charcoal">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="px-3 py-3 text-xs text-bark">Loading…</p>
            ) : revs.length === 0 ? (
              <p className="px-3 py-3 text-xs text-bark">No prior revisions yet.</p>
            ) : (
              revs.map((rev) => (
                <div key={rev.id} className="px-3 py-2 border-b border-stone/10 last:border-b-0">
                  <div className="text-[11px] text-bark mb-0.5">
                    {new Date(rev.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-charcoal mb-1.5 line-clamp-2">
                    {previewOf(rev)}
                  </div>
                  <button
                    type="button"
                    onClick={() => restore(rev.id)}
                    disabled={restoring === rev.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-camp-red hover:bg-camp-red/10 rounded disabled:opacity-50"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    {restoring === rev.id ? "Restoring…" : "Roll back"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
