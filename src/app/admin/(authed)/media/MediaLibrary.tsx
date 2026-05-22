"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  X,
  Image as ImageIcon,
  FileText,
  Trash2,
  RefreshCcw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { uploadToBlob, buildMediaPathname } from "@/lib/client-upload";

export interface MediaAsset {
  id: string;
  kind: "image" | "document";
  key: string;
  title: string;
  alt: string | null;
  blobPath: string;
  url: string;
  contentType: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  uploadedAt: string;
}

type Filter = "all" | "image" | "document";

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("kind", filter);
    if (query.trim()) params.set("q", query.trim());
    params.set("limit", "300");
    try {
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setItems(data.items as MediaAsset[]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Media Library</h1>
          <p className="text-sm text-bark mt-1">
            All images and documents used across the site. Upload, replace, or rename.
          </p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="inline-flex bg-white border border-stone/30 rounded-full p-1">
          {(["all", "image", "document"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full capitalize transition-colors ${
                filter === f ? "bg-camp-red text-white" : "text-bark hover:text-charcoal"
              }`}
            >
              {f === "all" ? "All" : f === "image" ? "Images" : "Documents"}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bark/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or key…"
            className="w-full pl-9 pr-9 py-2 rounded-full border border-stone/30 bg-white text-sm focus:outline-none focus:border-camp-red"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bark/60 hover:text-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-bark">{items.length} assets</span>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      {loading && items.length === 0 ? (
        <p className="text-sm text-bark">Loading…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone/40">
          <ImageIcon className="h-10 w-10 text-bark/30 mx-auto mb-3" />
          <p className="text-bark">Nothing matches that filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <AssetTile key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
        </div>
      )}

      {selected && (
        <AssetDrawer
          asset={selected}
          onClose={() => setSelected(null)}
          onChanged={(next) => {
            if (next) {
              setItems((prev) => prev.map((p) => (p.id === next.id ? next : p)));
              setSelected(next);
            } else {
              setItems((prev) => prev.filter((p) => p.id !== selected.id));
              setSelected(null);
            }
          }}
        />
      )}

      {uploadOpen && (
        <UploadDialog
          defaultKind={filter === "document" ? "document" : "image"}
          onClose={() => setUploadOpen(false)}
          onUploaded={(asset) => {
            setItems((prev) => [asset, ...prev]);
            setUploadOpen(false);
            toast.success(`"${asset.title}" uploaded`);
          }}
        />
      )}
    </div>
  );
}

// ─── Tile ────────────────────────────────────────────────
function AssetTile({ item, onClick }: { item: MediaAsset; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white rounded-xl border border-stone/30 overflow-hidden text-left hover:shadow-md hover:border-camp-red/40 transition-all"
    >
      <div className="relative aspect-square bg-cream/50 flex items-center justify-center">
        {item.kind === "image" ? (
          <Image
            src={item.url}
            alt={item.alt || item.title}
            fill
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <FileText className="h-12 w-12 text-bark/40" />
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-charcoal truncate">{item.title}</p>
        <p className="text-[10px] text-bark/60 truncate">{item.key}</p>
      </div>
    </button>
  );
}

// ─── Drawer (edit/replace/delete) ────────────────────────
function AssetDrawer({
  asset,
  onClose,
  onChanged,
}: {
  asset: MediaAsset;
  onClose: () => void;
  // null => deleted
  onChanged: (next: MediaAsset | null) => void;
}) {
  const [title, setTitle] = useState(asset.title);
  const [alt, setAlt] = useState(asset.alt || "");
  const [busy, setBusy] = useState<"saving" | "replacing" | "deleting" | null>(null);
  const [replaceProgress, setReplaceProgress] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const replaceRef = useRef<HTMLInputElement>(null);

  const dirty = title !== asset.title || (alt || "") !== (asset.alt || "");

  async function save() {
    setBusy("saving");
    setErr(null);
    try {
      const res = await fetch(`/api/media/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, alt: alt || null }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
      onChanged((await res.json()) as MediaAsset);
      toast.success("Asset details saved");
    } catch (e) {
      const msg = (e as Error).message;
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  }

  async function replace(file: File) {
    setBusy("replacing");
    setReplaceProgress(0);
    setErr(null);
    try {
      // Overwrite at the existing blobPath so the public URL stays stable.
      await uploadToBlob({
        file,
        pathname: asset.blobPath,
        onProgress: setReplaceProgress,
      });
      const res = await fetch(`/api/media/${asset.id}/replace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type || asset.contentType,
          sizeBytes: file.size,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Replace failed");
      onChanged((await res.json()) as MediaAsset);
      toast.success("File replaced");
    } catch (e) {
      const msg = (e as Error).message;
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(null);
      setReplaceProgress(null);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${asset.title}"? This will break any pages currently using it.`)) return;
    setBusy("deleting");
    setErr(null);
    try {
      const res = await fetch(`/api/media/${asset.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Delete failed");
      onChanged(null);
      toast.success(`"${asset.title}" deleted`);
    } catch (e) {
      const msg = (e as Error).message;
      setErr(msg);
      toast.error(msg);
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="w-full max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone/20 px-5 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">Asset details</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-cream text-bark">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-cream/50 rounded-xl border border-stone/20 overflow-hidden">
            {asset.kind === "image" ? (
              <div className="relative aspect-video bg-stone/10">
                <Image
                  src={asset.url}
                  alt={asset.alt || asset.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <FileText className="h-16 w-16 text-bark/30" />
              </div>
            )}
          </div>

          <div className="text-xs text-bark/80 space-y-1 bg-cream/50 rounded-lg p-3">
            <div className="flex justify-between gap-2">
              <span className="text-bark">Kind</span>
              <span className="capitalize">{asset.kind}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-bark">Key</span>
              <code className="text-charcoal">{asset.key}</code>
            </div>
            {asset.contentType && (
              <div className="flex justify-between gap-2">
                <span className="text-bark">Type</span>
                <span>{asset.contentType}</span>
              </div>
            )}
            {asset.sizeBytes != null && (
              <div className="flex justify-between gap-2">
                <span className="text-bark">Size</span>
                <span>{prettySize(asset.sizeBytes)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={asset.url}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone/30 bg-cream/50 font-mono"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(asset.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-stone/30 hover:bg-cream inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy URL"}
            </button>
            <a
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs rounded-lg border border-stone/30 hover:bg-cream inline-flex items-center gap-1.5"
              title="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div>
            <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
            />
          </div>

          {asset.kind === "image" && (
            <div>
              <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
                Alt text
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image for screen readers"
                className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
              />
            </div>
          )}

          {err && <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{err}</p>}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={save}
              disabled={!dirty || busy !== null}
              className="bg-camp-red text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-camp-red-dark disabled:opacity-40"
            >
              {busy === "saving" ? "Saving…" : "Save"}
            </button>

            <input
              ref={replaceRef}
              type="file"
              hidden
              accept={asset.kind === "image" ? "image/*" : ".pdf,application/pdf"}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void replace(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => replaceRef.current?.click()}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-stone/30 hover:bg-cream disabled:opacity-40"
              title="Replace the file (URL stays the same)"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {busy === "replacing"
                ? `Replacing ${replaceProgress ?? 0}%…`
                : "Replace file"}
            </button>

            <div className="flex-1" />

            <button
              onClick={remove}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {busy === "deleting" ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Upload dialog ───────────────────────────────────────
function UploadDialog({
  defaultKind,
  onClose,
  onUploaded,
}: {
  defaultKind: "image" | "document";
  onClose: () => void;
  onUploaded: (asset: MediaAsset) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [kind, setKind] = useState<"image" | "document">(defaultKind);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function pick(f: File) {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[a-z0-9]+$/i, ""));
    setKind(f.type.startsWith("image/") ? "image" : "document");
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setErr(null);
    try {
      const pathname = buildMediaPathname({ kind, title, filename: file.name });
      await uploadToBlob({ file, pathname, onProgress: setProgress });

      const res = await fetch("/api/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          alt: alt || null,
          blobPath: pathname,
          contentType: file.type || null,
          sizeBytes: file.size,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
      onUploaded((await res.json()) as MediaAsset);
    } catch (e) {
      const msg = (e as Error).message;
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-5 py-3 border-b border-stone/20 flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">Upload to library</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-cream text-bark">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <FileDrop onPick={pick} file={file} />

          {file && (
            <>
              <div className="flex gap-2">
                {(["image", "document"] as const).map((k) => (
                  <label
                    key={k}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm cursor-pointer text-center capitalize ${
                      kind === k
                        ? "border-camp-red bg-camp-red/5 text-camp-red"
                        : "border-stone/30 text-bark hover:bg-cream"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={k}
                      checked={kind === k}
                      onChange={() => setKind(k)}
                      className="hidden"
                    />
                    {k}
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
                />
              </div>

              {kind === "image" && (
                <div>
                  <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
                    Alt text (optional)
                  </label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm"
                  />
                </div>
              )}
            </>
          )}

          {busy && progress !== null && (
            <div>
              <div className="flex items-center justify-between text-xs text-bark mb-1">
                <span>Uploading…</span>
                <span className="font-semibold tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full bg-camp-red transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {err && <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{err}</p>}
        </div>
        <div className="px-5 py-3 border-t border-stone/20 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm text-bark hover:bg-cream"
          >
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={!file || !title || busy}
            className="bg-camp-red text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-camp-red-dark disabled:opacity-40"
          >
            {busy ? `Uploading ${progress ?? 0}%…` : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FileDrop({ onPick, file }: { onPick: (f: File) => void; file: File | null }) {
  const [hover, setHover] = useState(false);
  return (
    <label
      className={`block border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition-colors ${
        hover ? "border-camp-red bg-camp-red/5" : "border-stone/40 hover:border-camp-red/60"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onPick(f);
      }}
    >
      <input
        type="file"
        hidden
        accept="image/*,.pdf,application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
      <Upload className="h-8 w-8 mx-auto mb-2 text-bark/40" />
      <p className="text-sm text-charcoal font-medium">
        {file ? file.name : "Click or drop a file here"}
      </p>
      <p className="text-xs text-bark mt-1">Images or PDFs · max 25 MB</p>
    </label>
  );
}

function prettySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
