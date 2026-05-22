import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import slugify from "slugify";

/**
 * Registers an already-uploaded Vercel Blob as a media_assets row.
 *
 * Called by the client after a direct-to-Blob upload (via `/api/blob/sign`)
 * completes. Keeps the DB write path separate from the binary upload, so
 * uploads don't get capped by Vercel's serverless body size limit.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    kind?: string;
    title?: string;
    alt?: string | null;
    key?: string;
    blobPath?: string;
    contentType?: string | null;
    sizeBytes?: number;
  };

  const kind = body.kind;
  if (kind !== "image" && kind !== "document") {
    return NextResponse.json({ error: "kind must be 'image' or 'document'" }, { status: 400 });
  }
  if (!body.blobPath || typeof body.blobPath !== "string") {
    return NextResponse.json({ error: "blobPath required" }, { status: 400 });
  }
  const title = (body.title || "").trim();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const safeKey = slugify(body.key || title, { lower: true, strict: true });
  if (!safeKey) return NextResponse.json({ error: "Could not derive key from title" }, { status: 400 });

  try {
    const [row] = await db
      .insert(mediaAssets)
      .values({
        kind,
        key: safeKey,
        title,
        alt: kind === "image" ? (body.alt ?? null) : null,
        blobPath: body.blobPath,
        url: `/assets/${body.blobPath}`,
        contentType: body.contentType ?? null,
        sizeBytes: body.sizeBytes ?? 0,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    const msg =
      err instanceof Error && err.message.includes("duplicate key")
        ? "An asset with that key already exists — pick a different title."
        : "Register failed";
    console.error("Media register failed:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
