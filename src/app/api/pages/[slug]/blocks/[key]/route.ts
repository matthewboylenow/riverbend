import { NextRequest, NextResponse } from "next/server";
import { saveDraft, listRevisions } from "@/lib/page-content";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; key: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug, key } = await params;
  const revisions = await listRevisions(slug, key);
  return NextResponse.json({ revisions });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; key: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, key } = await params;
  const body = await request.json();

  if (!body.blockType) {
    return NextResponse.json({ error: "blockType required" }, { status: 400 });
  }
  if (typeof body.content !== "object") {
    return NextResponse.json({ error: "content object required" }, { status: 400 });
  }

  await saveDraft({
    pageSlug: slug,
    blockKey: key,
    blockType: body.blockType,
    content: body.content,
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
}
