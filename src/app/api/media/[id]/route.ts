import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { del } from "@vercel/blob";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

// Update editable metadata only — title and alt. Key/blob path are immutable
// here so we don't accidentally orphan references in page_content blocks.
// (Use POST /[id]/replace to change the underlying file.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as { title?: string; alt?: string | null };

  const updates: Partial<typeof mediaAssets.$inferInsert> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.alt === "string" || body.alt === null) updates.alt = body.alt ?? null;

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [row] = await db
    .update(mediaAssets)
    .set(updates)
    .where(eq(mediaAssets.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Best-effort blob cleanup; don't fail the request if Blob delete errors.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobUrl = existing.url.startsWith("http")
        ? existing.url
        : process.env.BLOB_STORE_ID
        ? `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/${existing.blobPath}`
        : null;
      if (blobUrl) await del(blobUrl);
    } catch (err) {
      console.warn("Blob delete failed for", existing.blobPath, err);
    }
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  return NextResponse.json({ success: true });
}
