"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, ExternalLink, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import slugify from "slugify";
import { publicUrl } from "@/lib/public-url";

interface Document {
  id: string;
  key: string;
  title: string;
  blobPath: string;
  blobUrl: string;
  contentType: string | null;
  sizeBytes: number | null;
  uploadedAt: string;
}

function fmtBytes(n: number | null | undefined): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ title: "", key: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/documents");
    setDocs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload() {
    setError(null);
    if (!file || !draft.title) {
      setError("File and title required");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", draft.title);
      if (draft.key) fd.append("key", draft.key);
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (!res.ok) {
        const msg = (await res.json()).error || "Upload failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      setShowNew(false);
      setDraft({ title: "", key: "" });
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      await load();
      toast.success("Document uploaded");
    } finally {
      setUploading(false);
    }
  }

  async function replace(id: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,image/*";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch(`/api/documents/${id}`, { method: "PUT", body: fd });
      if (res.ok) {
        await load();
        toast.success("Document replaced");
      } else {
        toast.error((await res.json()).error || "Replace failed");
      }
    };
    input.click();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      toast.success(`"${title}" deleted`);
    } else {
      toast.error((await res.json()).error || "Delete failed");
    }
  }

  async function copyUrl(url: string) {
    // Copy the full shareable URL (with domain), not the site-relative path.
    await navigator.clipboard.writeText(publicUrl(url));
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Documents</h1>
          <p className="text-sm text-bark mt-1">
            PDFs, calendars, and downloads served from <code className="bg-sand px-1.5 py-0.5 rounded text-xs">/assets/...</code>
          </p>
        </div>
        {!showNew && (
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-camp-red-dark"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        )}
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-stone/30 p-5 mb-6">
          <h2 className="font-semibold text-charcoal mb-4">Upload new document</h2>
          {error && (
            <p className="mb-3 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Title (e.g. 2026 Parent Handbook)"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm"
            />
            <input
              type="text"
              placeholder={
                draft.title
                  ? `URL key (auto: ${slugify(draft.title, { lower: true, strict: true })})`
                  : "URL key (auto-generated from title)"
              }
              value={draft.key}
              onChange={(e) => setDraft({ ...draft, key: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm font-mono"
            />
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="md:col-span-2 px-4 py-2 rounded-lg border border-stone bg-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sand file:px-3 file:py-1 file:text-xs file:font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={upload}
              disabled={uploading || !file || !draft.title}
              className="inline-flex items-center gap-2 px-4 py-2 bg-camp-red text-white text-sm font-semibold rounded-full hover:bg-camp-red-dark disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button
              onClick={() => {
                setShowNew(false);
                setError(null);
                setDraft({ title: "", key: "" });
                setFile(null);
              }}
              className="px-4 py-2 text-sm hover:bg-sand rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {loading ? (
          <p className="px-4 py-6 text-sm text-bark">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="px-4 py-6 text-sm text-bark">No documents yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20 bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">URL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Size</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Updated</th>
                <th className="w-32" />
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b border-stone/10 hover:bg-cream/50">
                  <td className="px-4 py-3 text-sm font-semibold text-charcoal">
                    <div>{d.title}</div>
                    <div className="text-xs text-bark/70 font-mono">{d.key}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-bark">
                    <button
                      onClick={() => copyUrl(d.blobUrl)}
                      className="inline-flex items-center gap-1.5 hover:text-camp-red"
                      title="Copy URL"
                    >
                      {d.blobUrl}
                      {copied === d.blobUrl ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-bark">{fmtBytes(d.sizeBytes)}</td>
                  <td className="px-4 py-3 text-sm text-bark">
                    {new Date(d.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <a
                      href={d.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg"
                      title="Open"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => replace(d.id)}
                      className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg"
                      title="Replace file (keeps URL)"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(d.id, d.title)}
                      className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
