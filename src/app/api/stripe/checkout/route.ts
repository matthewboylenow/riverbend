import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const { items, customerInfo, shippingInfo, shippingCost } =
      await request.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map(
        (item: {
          productName: string;
          variantName?: string;
          price: number;
          quantity: number;
        }) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.productName}${
                item.variantName ? ` - ${item.variantName}` : ""
              }`,
            },
            unit_amount: item.price, // already in cents from client
          },
          quantity: item.quantity,
        })
      );

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: customerInfo?.email,
      metadata: {
        customerName: customerInfo?.name || "",
        phone: customerInfo?.phone || "",
        shippingAddress: shippingInfo ? JSON.stringify(shippingInfo) : "",
      },
    };

    // Add shipping as a line item if applicable
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
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
