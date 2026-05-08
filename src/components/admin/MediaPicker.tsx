"use client";

/**
 * Reusable media picker — used inside the page editor wherever a block
 * needs to reference an image or a document. Two tabs:
 *
 *   - Library: search + grid of existing media_assets (filtered by kind),
 *     click an asset to pick it
 *   - Upload: drag-drop or click; on success the new asset becomes the
 *     picked value
 *
 * Returns the picked asset's URL via onChange. The full asset object is
 * also passed for callers who need extra metadata (alt, dimensions, etc).
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Search, X, ImagePlus, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { MediaAsset } from "@/app/admin/(authed)/media/MediaLibrary";

interface Props {
  kind: "image" | "document";
  value: string | null;
  onChange: (url: string | null, asset?: MediaAsset) => void;
  // Optional preview hint — for documents you might want to show a label.
  label?: string;
  // Aspect ratio for image preview (defaults to 16/9 for images, 1/1 if not provided).
  aspectClass?: string;
}

export function MediaPicker({ kind, value, onChange, label, aspectClass }: Props) {
  const [open, setOpen] = useState(false);

  const previewClass =
    aspectClass || (kind === "image" ? "aspect-video" : "h-32");

  return (
    <div className="space-y-2">
      <div
        className={`relative ${previewClass} rounded-xl border border-stone/30 bg-cream/40 overflow-hidden flex items-center justify-center`}
      >
        {value ? (
          kind === "image" ? (
            <Image
              src={value}
              alt={label || ""}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-charcoal hover:text-camp-red"
            >
              <FileText className="h-8 w-8" />
              <span className="font-medium">{label || value.split("/").pop()}</span>
            </a>
          )
        ) : (
          <div className="text-bark/60 text-sm flex flex-col items-center gap-1">
            {kind === "image" ? (
              <ImagePlus className="h-8 w-8" />
            ) : (
              <FileText className="h-8 w-8" />
            )}
            <span>No {kind} selected</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-sm rounded-full bg-cream border border-stone/30 hover:bg-white"
        >
          {value ? "Replace" : `Choose ${kind}`}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-bark hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>

      {open && (
        <PickerDialog
          kind={kind}
          onClose={() => setOpen(false)}
          onPick={(asset) => {
            onChange(asset.url, asset);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Dialog with Library + Upload tabs ───────────────────
function PickerDialog({
  kind,
  onClose,
  onPick,
}: {
  kind: "image" | "document";
  onClose: () => void;
  onPick: (asset: MediaAsset) => void;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="px-5 py-3 border-b border-stone/20 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-cream rounded-full p-1">
            <button
              onClick={() => setTab("library")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                tab === "library" ? "bg-camp-red text-white" : "text-bark hover:text-charcoal"
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                tab === "upload" ? "bg-camp-red text-white" : "text-bark hover:text-charcoal"
              }`}
            >
              Upload new
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-cream text-bark">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "library" ? (
            <LibraryGrid kind={kind} onPick={onPick} />
          ) : (
            <UploadPane kind={kind} onUploaded={onPick} />
          )}
        </div>
      </div>
    </div>
  );
}

function LibraryGrid({
  kind,
  onPick,
}: {
  kind: "image" | "document";
  onPick: (asset: MediaAsset) => void;
}) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({ kind, limit: "200" });
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items as MediaAsset[]);
      }
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [kind, query]);

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bark/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${kind}s…`}
          className="w-full pl-9 pr-3 py-2 rounded-full border border-stone/30 text-sm focus:outline-none focus:border-camp-red"
        />
      </div>

      {loading && items.length === 0 ? (
        <p className="text-sm text-bark text-center py-12">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-bark text-center py-12">No matches.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item)}
              className="group bg-white rounded-lg border border-stone/30 overflow-hidden text-left hover:shadow-md hover:border-camp-red/40 transition-all"
            >
              <div className="relative aspect-square bg-cream/50 flex items-center justify-center">
                {item.kind === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.alt || item.title}
                    fill
                    sizes="20vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <FileText className="h-10 w-10 text-bark/40" />
                )}
              </div>
              <div className="p-1.5">
                <p className="text-[11px] font-medium text-charcoal truncate">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadPane({
  kind,
  onUploaded,
}: {
  kind: "image" | "document";
  onUploaded: (asset: MediaAsset) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(f: File) {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[a-z0-9]+$/i, ""));
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      fd.append("title", title);
      if (alt) fd.append("alt", alt);
      const res = await fetch("/api/media", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
      const asset = (await res.json()) as MediaAsset;
      toast.success(`"${asset.title}" uploaded`);
      onUploaded(asset);
    } catch (e) {
      const msg = (e as Error).message;
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-5 space-y-4">
      <label
        className={`block border-2 border-dashed rounded-xl px-4 py-10 text-center cursor-pointer transition-colors ${
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
          if (f) pick(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={kind === "image" ? "image/*" : ".pdf,application/pdf"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pick(f);
          }}
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-bark/40" />
        <p className="text-sm text-charcoal font-medium">
          {file ? file.name : `Click or drop a ${kind} here`}
        </p>
        <p className="text-xs text-bark mt-1">
          {kind === "image" ? "JPG / PNG / WebP / SVG" : "PDF"} · max 25 MB
        </p>
      </label>

      {file && (
        <>
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

      {err && <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{err}</p>}

      <div className="flex justify-end">
        <button
          onClick={upload}
          disabled={!file || !title || busy}
          className="bg-camp-red text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-camp-red-dark disabled:opacity-40"
        >
          {busy ? "Uploading…" : "Upload & use"}
        </button>
      </div>
    </div>
  );
}
