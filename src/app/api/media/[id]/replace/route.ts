import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

const MAX_BYTES = 25 * 1024 * 1024;

// Replace the underlying blob while keeping the same key + URL — so every
// page that referenced this asset shows the new file automatically.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not configured" }, { status: 503 });
  }

  const { id } = await params;
  const [existing] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
  }

  // Overwrite the same blob path. Stable URL = stable references.
  await put(existing.blobPath, file, {
    access: "public",
    contentType: file.type || existing.contentType || "application/octet-stream",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  const [row] = await db
    .update(mediaAssets)
    .set({
      contentType: file.type || existing.contentType,
      sizeBytes: file.size,
      uploadedAt: new Date(),
      uploadedBy: session.user.id,
    })
    .where(eq(mediaAssets.id, id))
    .returning();

  return NextResponse.json(row);
}
