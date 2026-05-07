import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { discardPageDrafts } from "@/lib/page-content";

// Wipe every pending draft on a page. The published columns are untouched.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const cleared = await discardPageDrafts(slug);
  return NextResponse.json({ success: true, cleared });
}
