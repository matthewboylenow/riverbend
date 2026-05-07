import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import slugify from "slugify";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

// List media assets, optionally filtered by kind / search.
//   GET /api/media?kind=image&q=hero&limit=50
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind"); // 'image' | 'document' | null
  const q = searchParams.get("q")?.trim() || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10) || 100, 500);

  const wheres = [];
  if (kind === "image" || kind === "document") {
    wheres.push(eq(mediaAssets.kind, kind));
  }
  if (q) {
    const like = `%${q}%`;
    wheres.push(or(ilike(mediaAssets.title, like), ilike(mediaAssets.key, like))!);
  }

  const rows = await db
    .select()
    .from(mediaAssets)
    .where(wheres.length ? and(...wheres) : sql`true`)
    .orderBy(desc(mediaAssets.uploadedAt))
    .limit(limit);

  return NextResponse.json({ items: rows });
}

// Upload a new asset.
// Multipart fields:
//   file       (required)
//   kind       'image' | 'document' (required)
//   title      optional — defaults to filename
//   alt        optional, image-only
//   key        optional — derived from title if omitted
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "");
    const title = String(formData.get("title") || "").trim();
    const alt = String(formData.get("alt") || "").trim() || null;
    const keyInput = String(formData.get("key") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    if (kind !== "image" && kind !== "document") {
      return NextResponse.json({ error: "kind must be 'image' or 'document'" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }

    const baseTitle = title || file.name.replace(/\.[a-z0-9]+$/i, "");
    const safeKey = slugify(keyInput || baseTitle, { lower: true, strict: true });
    if (!safeKey) {
      return NextResponse.json({ error: "Could not derive key from title" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || (kind === "image" ? "jpg" : "bin")).toLowerCase();
    const folder = kind === "image" ? "site" : "documents";
    const blobPath = `${folder}/${safeKey}.${ext}`;

    await put(blobPath, file, {
      access: "public",
      contentType: file.type || (kind === "image" ? "image/jpeg" : "application/octet-stream"),
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const [row] = await db
      .insert(mediaAssets)
      .values({
        kind,
        key: safeKey,
        title: baseTitle,
        alt: kind === "image" ? alt : null,
        blobPath,
        url: `/assets/${blobPath}`,
        contentType: file.type || null,
        sizeBytes: file.size,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("Media upload failed:", err);
    const msg = err instanceof Error && err.message.includes("duplicate key")
      ? "An asset with that key already exists — pick a different title."
      : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
