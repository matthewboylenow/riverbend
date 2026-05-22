import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";

/**
 * Signing endpoint for direct browser → Vercel Blob uploads.
 *
 * The browser calls `upload()` from `@vercel/blob/client`, which hits this
 * route to negotiate a short-lived token. We authenticate the session and
 * cap the upload at 50 MB. The actual DB row is written separately by the
 * client after upload completes (see `/api/media/register` and
 * `/api/media/[id]/replace`).
 *
 * Bypasses Vercel's ~4.5 MB serverless body limit — large files no longer
 * stream through this function.
 */

const ALLOWED_FOLDERS = ["site", "documents", "staff", "products", "uploads"];
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const folder = pathname.split("/")[0];
        if (!ALLOWED_FOLDERS.includes(folder)) {
          throw new Error(`Folder "${folder}" not allowed`);
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "application/pdf",
          ],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
      onUploadCompleted: async () => {
        // No-op. The client makes a follow-up call to register/replace
        // which is the source of truth in dev (this webhook isn't fired
        // locally) and acts as a redundant signal in prod.
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const msg = (err as Error).message || "Upload sign failed";
    console.error("Blob sign failed:", err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
