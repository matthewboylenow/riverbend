import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Placeholder for Vercel Blob client upload handler
    // When BLOB_READ_WRITE_TOKEN is configured, this will use handleUpload from @vercel/blob/client
    const body = await request.json();
    return NextResponse.json({
      url: `/assets/uploads/${Date.now()}.jpg`,
      ...body,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload not configured. Set BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }
}
