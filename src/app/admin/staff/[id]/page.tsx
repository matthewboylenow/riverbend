"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionOptions = [
  { value: "directors", label: "Directors" },
  { value: "division_heads", label: "Division Heads" },
  { value: "assistant_heads", label: "Assistant Division Heads" },
  { value: "founders", label: "Founders" },
];

export default function AdminStaffEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    name: "",
    title: "",
    section: "directors",
    bio: "",
    photoUrl: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Mock save — will connect to API when DB is ready
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    router.push("/admin/staff");
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
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

      {/* Form */}
      <div className="space-y-8">
        {/* Photo upload */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Photo
          </label>
          <div className="flex items-start gap-4">
            <div className="h-32 w-32 rounded-2xl bg-sand flex items-center justify-center border-2 border-dashed border-stone overflow-hidden">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="h-8 w-8 text-stone" />
              )}
            </div>
            <div className="space-y-2 pt-2">
              <button className="btn-camp btn-secondary btn-sm">
                Upload Photo
              </button>
              <p className="text-xs text-bark">
                JPG, PNG, or WebP. Max 10MB.
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            placeholder="Full name"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors"
            placeholder="e.g. Director, Clubhouse Division Head"
            required
          />
        </div>

        {/* Section */}
        <div>
          <label
            htmlFor="section"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
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

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-semibold text-charcoal mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={8}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-charcoal focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none transition-colors resize-y"
            placeholder="Staff member biography..."
          />
          <p className="text-xs text-bark mt-1">
            Rich text editor will be available when Tiptap is fully configured.
          </p>
        </div>

        {/* Active toggle */}
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

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-stone/30">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.title}
            className="btn-camp btn-primary"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Staff Member"}
          </button>
          <Link href="/admin/staff" className="btn-camp btn-ghost">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
