import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(staffMembers)
      .orderBy(asc(staffMembers.section), asc(staffMembers.sortOrder));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/staff failed:", err);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const [row] = await db
      .insert(staffMembers)
      .values({
        name: body.name,
        title: body.title,
        bio: body.bio ?? null,
        photoUrl: body.photoUrl ?? null,
        section: body.section,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/staff failed:", err);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}
