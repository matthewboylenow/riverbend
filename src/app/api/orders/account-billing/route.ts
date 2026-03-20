import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { items, customerInfo, shippingInfo, subtotal, shippingCost, total } =
      await request.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.camperName) {
      return NextResponse.json(
        { error: "Name, email, and camper name are required" },
        { status: 400 }
      );
    }

    // Generate a simple order number for now
    const orderNumber = `CR-${Date.now().toString(36).toUpperCase()}`;

    // TODO: When DB is connected and seeded, create order in DB:
    // const order = await db.insert(orders).values({
    //   customerName: customerInfo.name,
    //   customerEmail: customerInfo.email,
    //   camperName: customerInfo.camperName,
    //   phone: customerInfo.phone,
    //   shippingAddress: shippingInfo,
    //   paymentMethod: 'account_billing',
    //   status: 'pending_invoice',
    //   subtotal,
    //   shippingCost,
    //   total,
    // }).returning();

    // TODO: Send notification email to abby@campriverbend.com via Resend
    // TODO: Send confirmation email to customer

    console.log("Account billing order:", {
      orderNumber,
      customer: customerInfo,
      items,
      subtotal,
      shippingCost,
      total,
      shipping: shippingInfo,
    });

    return NextResponse.json({ success: true, orderNumber });
  } catch (err) {
    console.error("Account billing error:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
