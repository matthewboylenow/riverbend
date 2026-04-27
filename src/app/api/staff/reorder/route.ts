import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { items: { id: string; sortOrder: number }[] };
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: "items array required" }, { status: 400 });
    }
    for (const item of body.items) {
      await db
        .update(staffMembers)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(eq(staffMembers.id, item.id));
    }
    return NextResponse.json({ success: true, updated: body.items.length });
  } catch (err) {
    console.error("PUT /api/staff/reorder failed:", err);
    return NextResponse.json({ error: "Failed to reorder staff" }, { status: 500 });
  }
}
