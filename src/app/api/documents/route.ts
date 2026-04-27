import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import slugify from "slugify";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(documents).orderBy(desc(documents.uploadedAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const key = String(formData.get("key") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }

    const safeKey = key
      ? slugify(key, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const blobPath = `documents/${safeKey}.${ext}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type || "application/pdf",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const [row] = await db
      .insert(documents)
      .values({
        key: safeKey,
        title,
        blobPath,
        blobUrl: `/assets/${blobPath}`,
        contentType: file.type || "application/pdf",
        sizeBytes: file.size,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ ...row, fullBlobUrl: blob.url }, { status: 201 });
  } catch (err) {
    console.error("Document upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
