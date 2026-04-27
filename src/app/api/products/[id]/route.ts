import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .orderBy(asc(productVariants.sortOrder));
  return NextResponse.json({ ...rows[0], variants });
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
    .update(products)
    .set({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      price: String(body.price),
      categoryId: body.categoryId || null,
      images: body.images ?? [],
      isActive: body.isActive ?? true,
      requiresShipping: body.requiresShipping ?? true,
      weightOz: body.weightOz ?? null,
      externalUrl: body.externalUrl ?? null,
      sortOrder: body.sortOrder ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Replace variants if provided
  if (Array.isArray(body.variants)) {
    await db.delete(productVariants).where(eq(productVariants.productId, id));
    if (body.variants.length) {
      await db.insert(productVariants).values(
        body.variants.map((v: { name: string; sku?: string; stock?: number; isActive?: boolean }, i: number) => ({
          productId: id,
          name: v.name,
          sku: v.sku ?? null,
          stock: v.stock ?? 0,
          isActive: v.isActive ?? true,
          sortOrder: i,
        }))
      );
    }
  }

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
  // Soft delete by setting isActive false (keeps order history intact)
  await db.update(products).set({ isActive: false, updatedAt: new Date() }).where(eq(products.id, id));
  return NextResponse.json({ success: true, id });
}
