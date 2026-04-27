import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db.select().from(staffMembers).where(eq(staffMembers.id, id)).limit(1);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const [row] = await db
    .update(staffMembers)
    .set({
      name: body.name,
      title: body.title,
      bio: body.bio ?? null,
      photoUrl: body.photoUrl ?? null,
      section: body.section,
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(staffMembers.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(staffMembers).where(eq(staffMembers.id, id));
  return NextResponse.json({ success: true, id });
}
