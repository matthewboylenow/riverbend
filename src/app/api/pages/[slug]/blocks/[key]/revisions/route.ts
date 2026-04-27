import { NextRequest, NextResponse } from "next/server";
import { restoreRevision } from "@/lib/page-content";
import { auth } from "@/lib/auth";

/**
 * POST { revisionId } — roll back to a prior revision.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; key: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, key } = await params;
  const body = await request.json();
  if (!body.revisionId) {
    return NextResponse.json({ error: "revisionId required" }, { status: 400 });
  }

  try {
    await restoreRevision({
      pageSlug: slug,
      blockKey: key,
      revisionId: body.revisionId,
      userId: session.user.id,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Restore failed" },
      { status: 400 }
    );
  }
}
