import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * Finalize a replace after the client has already uploaded the new file
 * directly to Vercel Blob (at the same `blobPath` as the existing asset).
 *
 * Body: JSON { contentType?, sizeBytes? }
 *
 * The blob URL is stable across replaces because we overwrite the same
 * pathname, so every page that references this asset shows the new file
 * automatically.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as {
    contentType?: string | null;
    sizeBytes?: number;
  };

  const [row] = await db
    .update(mediaAssets)
    .set({
      contentType: body.contentType ?? existing.contentType,
      sizeBytes: typeof body.sizeBytes === "number" ? body.sizeBytes : existing.sizeBytes,
      uploadedAt: new Date(),
      uploadedBy: session.user.id,
    })
    .where(eq(mediaAssets.id, id))
    .returning();

  return NextResponse.json(row);
}
