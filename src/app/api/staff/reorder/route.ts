import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // body should be: { items: [{ id: string, sortOrder: number }] }
    return NextResponse.json({ success: true, updated: body.items?.length || 0 });
  } catch {
    return NextResponse.json(
      { error: "Failed to reorder staff" },
      { status: 500 }
    );
  }
}
