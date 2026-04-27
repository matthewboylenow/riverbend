import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.email));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden — super_admin only" }, { status: 403 });
  }

  const body = await request.json();
  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "email, password, name required" }, { status: 400 });
  }
  if (body.password.length < 10) {
    return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
  }

  try {
    const passwordHash = await bcrypt.hash(body.password, 10);
    const [row] = await db
      .insert(adminUsers)
      .values({
        email: body.email.toLowerCase().trim(),
        passwordHash,
        name: body.name,
        role: body.role === "super_admin" ? "super_admin" : "admin",
        createdBy: session.user.id,
      })
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      });
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/users failed:", err);
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
}
