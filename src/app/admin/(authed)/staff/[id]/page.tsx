"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import slugify from "slugify";

const sectionOptions = [
  { value: "directors", label: "Directors" },
  { value: "division_heads", label: "Division Heads" },
  { value: "founders", label: "Founders" },
];

interface StaffForm {
  name: string;
  title: string;
  section: string;
  bio: string;
  photoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const empty: StaffForm = {
  name: "",
  title: "",
  section: "directors",
  bio: "",
  photoUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminStaffEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<StaffForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    void fetch(`/api/staff/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setForm({
          name: data.name || "",
          title: data.title || "",
          section: data.section || "directors",
          bio: data.bio || "",
          photoUrl: data.photoUrl || "",
          sortOrder: data.sortOrder ?? 0,
          isActive: data.isActive ?? true,
        });
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "staff");
      fd.append("slug", form.name || `staff-${Date.now()}`);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, photoUrl: data.url }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const url = isNew ? "/api/staff" : `/api/staff/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Auto-derive a stable slug-style key for re-uploads (not required by schema)
          _slug: slugify(form.name, { lower: true, strict: true }),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || "Save failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success(isNew ? "Staff member added" : "Staff member updated");
      router.push("/admin/staff");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-bark">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/staff"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">
          {isNew ? "Add Staff Member" : "Edit Staff Member"}
        </h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Photo</label>
          <div className="flex items-start gap-4">
            <div className="h-32 w-32 rounded-2xl bg-sand flex items-center justify-center border-2 border-dashed border-stone overflow-hidden">
              {form.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="h-8 w-8 text-stone" />
              )}
            </div>
            <div className="space-y-2 pt-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handlePhotoUpload(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-stone hover:bg-sand transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload Photo"}
              </button>
              {form.photoUrl && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, photoUrl: "" }))}
                  className="ml-2 inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
              <p className="text-xs text-bark">JPG, PNG, or WebP. Max 10MB.</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-charcoal mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="section" className="block text-sm font-semibold text-charcoal mb-2">
              Section *
            </label>
            <select
              id="section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            >
              {sectionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-semibold text-charcoal mb-2">
              Sort order
            </label>
            <input
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-semibold text-charcoal mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={10}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors resize-y"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              form.isActive ? "bg-camp-red" : "bg-stone"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                form.isActive ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <label className="text-sm font-medium text-charcoal">
            Active (visible on public site)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone/30">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.title}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full hover:bg-camp-red-dark transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Staff Member"}
          </button>
          <Link
            href="/admin/staff"
            className="inline-flex items-center px-6 py-2.5 text-charcoal hover:bg-sand rounded-full transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
