import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const slug = body.slug?.trim() || slugify(body.name, { lower: true, strict: true });
  try {
    const [row] = await db
      .insert(categories)
      .values({ name: body.name, slug, sortOrder: body.sortOrder ?? 0 })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/categories failed:", err);
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }
}
