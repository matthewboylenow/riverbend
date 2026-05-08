"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import slugify from "slugify";

interface Variant {
  id?: string;
  name: string;
  sku?: string | null;
  stock?: number;
  isActive?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  categoryId: string;
  images: string[];
  isActive: boolean;
  requiresShipping: boolean;
  weightOz: string;
  externalUrl: string;
  sortOrder: number;
  variants: Variant[];
}

const empty: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "0.00",
  categoryId: "",
  images: [],
  isActive: true,
  requiresShipping: true,
  weightOz: "",
  externalUrl: "",
  sortOrder: 0,
  variants: [],
};

export default function AdminProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<ProductForm>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void fetch("/api/categories").then((r) => r.json()).then(setCategories);

    if (isNew) return;
    void fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          price: String(data.price ?? "0.00"),
          categoryId: data.categoryId || "",
          images: data.images || [],
          isActive: data.isActive ?? true,
          requiresShipping: data.requiresShipping ?? true,
          weightOz: data.weightOz != null ? String(data.weightOz) : "",
          externalUrl: data.externalUrl || "",
          sortOrder: data.sortOrder ?? 0,
          variants: data.variants || [],
        });
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      fd.append(
        "slug",
        `${form.slug || slugify(form.name, { lower: true, strict: true })}-${form.images.length}`
      );
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setForm((p) => ({ ...p, images: [...p.images, data.url] }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const url = isNew ? "/api/products" : `/api/products/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name, { lower: true, strict: true }),
        weightOz: form.weightOz ? Number(form.weightOz) : null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || "Save failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success(isNew ? "Product created" : "Product updated");
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Images</label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden bg-sand group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 text-red-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="h-24 w-24 rounded-xl border-2 border-dashed border-stone hover:border-camp-red hover:bg-cream/50 flex items-center justify-center text-stone hover:text-camp-red transition-colors disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleImageUpload(f);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-charcoal mb-2">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="(auto from name)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Price *</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Weight (oz)</label>
            <input
              type="number"
              value={form.weightOz}
              onChange={(e) => setForm({ ...form, weightOz: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">External URL (optional)</label>
          <input
            type="url"
            value={form.externalUrl}
            onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
            placeholder="If set, shop redirects buyers here instead of using cart"
            className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-charcoal">Variants (sizes, colors)</label>
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({ ...p, variants: [...p.variants, { name: "", stock: 0, isActive: true }] }))
              }
              className="inline-flex items-center gap-1 text-sm text-camp-red hover:text-camp-red-dark"
            >
              <Plus className="h-3.5 w-3.5" /> Add variant
            </button>
          </div>
          <div className="space-y-2">
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_100px_auto] gap-2">
                <input
                  type="text"
                  placeholder="Name (e.g. AS)"
                  value={v.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      variants: p.variants.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                    }))
                  }
                  className="px-3 py-2 rounded-lg border border-stone bg-white text-sm"
                />
                <input
                  type="text"
                  placeholder="SKU (optional)"
                  value={v.sku ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      variants: p.variants.map((x, j) => (j === i ? { ...x, sku: e.target.value } : x)),
                    }))
                  }
                  className="px-3 py-2 rounded-lg border border-stone bg-white text-sm font-mono"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock ?? 0}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      variants: p.variants.map((x, j) =>
                        j === i ? { ...x, stock: Number(e.target.value) } : x
                      ),
                    }))
                  }
                  className="px-3 py-2 rounded-lg border border-stone bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, variants: p.variants.filter((_, j) => j !== i) }))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4"
            />
            Active (visible in shop)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.requiresShipping}
              onChange={(e) => setForm({ ...form, requiresShipping: e.target.checked })}
              className="h-4 w-4"
            />
            Requires shipping
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone/30">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.price}
            className={cn(
              "inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full transition-colors",
              "hover:bg-camp-red-dark disabled:opacity-50"
            )}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Product"}
          </button>
          <Link
            href="/admin/products"
            className="inline-flex items-center px-6 py-2.5 text-charcoal hover:bg-sand rounded-full"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
