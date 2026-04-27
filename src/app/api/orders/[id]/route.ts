import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

const VALID_STATUSES = [
  "pending",
  "paid",
  "shipped",
  "fulfilled",
  "cancelled",
  "pending_invoice",
  "invoiced",
] as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const orderRows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!orderRows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return NextResponse.json({ ...orderRows[0], items });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const [row] = await db
    .update(orders)
    .set({
      ...(body.status ? { status: body.status } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}
