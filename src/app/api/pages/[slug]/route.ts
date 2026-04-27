import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/page-content";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Public read — pages need this for SSR. Still require auth so admin
  // editing tools authoritatively bypass any caching, but since pages
  // SSR via lib calls directly, this endpoint is mainly for admin form
  // hydration. Make it auth-gated to be safe.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const blocks = await getPageContent(slug);
  return NextResponse.json({ pageSlug: slug, blocks });
}
