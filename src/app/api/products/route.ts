import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || !body.price) {
    return NextResponse.json({ error: "name and price required" }, { status: 400 });
  }

  const slug = body.slug?.trim() || slugify(body.name, { lower: true, strict: true });

  try {
    const [row] = await db
      .insert(products)
      .values({
        name: body.name,
        slug,
        description: body.description ?? null,
        price: String(body.price),
        categoryId: body.categoryId || null,
        images: body.images ?? [],
        isActive: body.isActive ?? true,
        requiresShipping: body.requiresShipping ?? true,
        weightOz: body.weightOz ?? null,
        externalUrl: body.externalUrl ?? null,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/products failed:", err);
    return NextResponse.json({ error: "Failed to create product (slug may already exist)" }, { status: 500 });
  }
}
