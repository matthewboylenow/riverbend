/**
 * Preview-mode detection for public pages.
 *
 * Public pages call `loadContentMode()` to decide whether to render
 * published blocks (default) or draft blocks (preview).
 *
 * Preview is gated by BOTH:
 *   - a valid admin session (cookie-based, set by NextAuth on /admin login)
 *   - the `?preview=1` query param on the request
 *
 * Either alone is insufficient: the query alone would expose drafts to
 * the world, the cookie alone would leak drafts into routine admin
 * navigation. The combination keeps preview opt-in.
 */
import { auth } from "@/lib/auth";
import type { ReadMode } from "@/lib/page-content";

export async function loadContentMode(searchParams: {
  preview?: string | string[];
}): Promise<ReadMode> {
  const wantsPreview = pickFirst(searchParams.preview) === "1";
  if (!wantsPreview) return "published";

  const session = await auth();
  return session?.user ? "draft" : "published";
}

function pickFirst(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
