import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { sendOrderEmails } from "@/lib/email";

interface ItemPayload {
  productId?: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number; // dollars
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: ItemPayload[] = body.items || [];
    const customerInfo = body.customerInfo || {};
    const shippingInfo = body.shippingInfo || null;

    if (!items.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.camperName) {
      return NextResponse.json(
        { error: "Name, email, and camper name are required" },
        { status: 400 }
      );
    }

    const subtotal = Number(body.subtotal ?? 0);
    const shippingCost = Number(body.shippingCost ?? 0);
    const total = Number(body.total ?? subtotal + shippingCost);

    const [order] = await db
      .insert(orders)
      .values({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        camperName: customerInfo.camperName,
        phone: customerInfo.phone ?? null,
        shippingAddress: shippingInfo,
        paymentMethod: "account_billing",
        status: "pending_invoice",
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        total: total.toFixed(2),
      })
      .returning();

    await db.insert(orderItems).values(
      items.map((it) => ({
        orderId: order.id,
        productId: it.productId || null,
        variantId: it.variantId || null,
        productName: it.productName,
        variantName: it.variantName ?? null,
        quantity: it.quantity,
        unitPrice: Number(it.price).toFixed(2),
      }))
    );

    // Fire-and-forget email; don't block order success on Resend
    void sendOrderEmails({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      camperName: order.camperName,
      phone: order.phone,
      subtotal,
      shippingCost,
      total,
      items: items.map((i) => ({
        productName: i.productName,
        variantName: i.variantName ?? null,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      shippingAddress: shippingInfo,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    console.error("Account billing order failed:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
