import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { publishPage } from "@/lib/page-content";
import { revalidatePath } from "next/cache";

// Promote every drafted block on a page to published. Snapshots the prior
// published value into revisions so it's reversible.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const promoted = await publishPage({ pageSlug: slug, userId: session.user.id });

  // Hint Next to refresh the public page on next request.
  try {
    revalidatePath(`/${slug}`);
  } catch {
    // revalidatePath isn't available in all build contexts; safe to ignore.
  }

  return NextResponse.json({ success: true, promoted });
}
