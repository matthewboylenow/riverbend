"use client";

/**
 * Shared helper for browser → Vercel Blob direct uploads.
 *
 * Bypasses Vercel's ~4.5 MB serverless function body limit, so the 25–50 MB
 * we advertise in the UI actually works. Also yields real per-file progress
 * (no fake spinners).
 *
 * Usage:
 *   await uploadToBlob({
 *     file,
 *     pathname: "site/my-image.jpg",
 *     onProgress: (p) => setPercent(p),
 *   });
 */
import { upload } from "@vercel/blob/client";
import slugify from "slugify";

export interface UploadResult {
  url: string;
  pathname: string;
}

export async function uploadToBlob({
  file,
  pathname,
  onProgress,
}: {
  file: File;
  /** Full blob path including folder, e.g. "site/hero.jpg". */
  pathname: string;
  /** 0–100 percentage. Fired as the upload streams. */
  onProgress?: (percent: number) => void;
}): Promise<UploadResult> {
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/blob/sign",
    contentType: file.type || undefined,
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round(e.percentage));
    },
  });
  return { url: blob.url, pathname: blob.pathname };
}

/**
 * Build a stable blob pathname for a new media-library asset.
 * Lives here (vs duplicated in the call sites) so the folder convention
 * stays in one place.
 */
export function buildMediaPathname({
  kind,
  title,
  filename,
}: {
  kind: "image" | "document";
  title: string;
  filename: string;
}): string {
  const slug = slugify(title, { lower: true, strict: true });
  const folder = kind === "image" ? "site" : "documents";
  const ext = (filename.split(".").pop() || (kind === "image" ? "jpg" : "bin")).toLowerCase();
  return `${folder}/${slug}.${ext}`;
}
