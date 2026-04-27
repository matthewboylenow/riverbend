import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface ItemPayload {
  productId?: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number; // cents
  quantity: number;
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Use Account Billing or contact the camp office." },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const body = await request.json();
    const items: ItemPayload[] = body.items || [];
    const customerInfo = body.customerInfo || {};
    const shippingInfo = body.shippingInfo || null;
    const shippingCost: number = Number(body.shippingCost ?? 0); // cents

    if (!items.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }
    if (!customerInfo.email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const subtotalCents = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalCents = subtotalCents + shippingCost;

    // Create a pending order so the webhook can flip it to paid
    const [order] = await db
      .insert(orders)
      .values({
        customerName: customerInfo.name || "Stripe customer",
        customerEmail: customerInfo.email,
        camperName: customerInfo.camperName ?? null,
        phone: customerInfo.phone ?? null,
        shippingAddress: shippingInfo,
        paymentMethod: "stripe",
        status: "pending",
        subtotal: (subtotalCents / 100).toFixed(2),
        shippingCost: (shippingCost / 100).toFixed(2),
        total: (totalCents / 100).toFixed(2),
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
        unitPrice: (it.price / 100).toFixed(2),
      }))
    );

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.productName}${item.variantName ? ` - ${item.variantName}` : ""}`,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        orderId: order.id,
        orderNumber: String(order.orderNumber),
        customerName: customerInfo.name || "",
        phone: customerInfo.phone || "",
      },
    };

    if (shippingCost > 0) {
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCost, currency: "usd" },
            display_name: "Standard Shipping",
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    await db
      .update(orders)
      .set({ stripeSessionId: session.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
