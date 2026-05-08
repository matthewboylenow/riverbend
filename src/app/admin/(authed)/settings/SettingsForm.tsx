"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface Settings {
  favicon?: { url: string };
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to load");
      setSettings((await res.json()) as Settings);
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
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favicon: settings.favicon ?? { url: "" },
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSavedAt(new Date());
      toast.success("Site settings saved");
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Site Settings</h1>
          <p className="text-sm text-bark mt-1">
            Site-wide settings that apply across every page.
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
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="bg-white rounded-2xl border border-stone/30 p-5 space-y-5">
        <div>
          <h2 className="font-semibold text-charcoal mb-1">Favicon</h2>
          <p className="text-xs text-bark mb-3">
            The small icon shown in browser tabs and bookmarks. Use a square
            PNG (32x32 or 64x64 looks crisp).
          </p>
          <MediaPicker
            kind="image"
            value={settings.favicon?.url || null}
            aspectClass="aspect-square w-32"
            onChange={(url) =>
              setSettings((prev) => ({ ...prev, favicon: { url: url || "" } }))
            }
          />
        </div>
      </div>
    </div>
  );
}
