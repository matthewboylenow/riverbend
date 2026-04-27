import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { put, del } from "@vercel/blob";

/**
 * Replace a document's file (keeps the same id + key, so any page that
 * references the doc keeps working without an update).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!existing.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const newTitle = formData.get("title");

    const updates: Record<string, unknown> = { uploadedAt: new Date(), uploadedBy: session.user.id };
    if (typeof newTitle === "string" && newTitle.trim()) {
      updates.title = newTitle.trim();
    }

    if (file instanceof File && file.size > 0) {
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
      }
      const blob = await put(existing[0].blobPath, file, {
        access: "public",
        contentType: file.type || existing[0].contentType || "application/pdf",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      updates.contentType = file.type || existing[0].contentType;
      updates.sizeBytes = file.size;
      // blobPath unchanged → blobUrl unchanged → cached references stay valid
      void blob;
    }

    const [row] = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    return NextResponse.json(row);
  } catch (err) {
    console.error("Document replace failed:", err);
    return NextResponse.json({ error: "Replace failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!existing.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(existing[0].blobPath);
      } catch (err) {
        console.warn("Blob delete failed (continuing):", err);
      }
    }
    await db.delete(documents).where(eq(documents.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Document delete failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
