/**
 * Canonical public origin for building shareable absolute URLs (e.g. the
 * "Copy URL" buttons in the media library / documents admin).
 *
 * NEXT_PUBLIC_SITE_URL is inlined at build time, so this works in client
 * components; production falls back to the canonical domain when unset.
 * All site domains (campriverbend.com, www, *.vercel.app) serve the same
 * deployment, so links copied under one domain also work on the others —
 * this just standardizes what gets copied.
 */
export const PUBLIC_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://campriverbend.com"
).replace(/\/+$/, "");

/** Absolute public URL for a site path. Already-absolute URLs pass through. */
export function publicUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${PUBLIC_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}
