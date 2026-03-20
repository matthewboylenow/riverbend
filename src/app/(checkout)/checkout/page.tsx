"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, FileText, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPriceDollars } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PaymentMethod = "stripe" | "account";

interface FormData {
  name: string;
  email: string;
  phone: string;
  camperName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  pickupAtCamp: boolean;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  camperName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "NJ",
  zip: "",
  pickupAtCamp: false,
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = form.pickupAtCamp ? 0 : subtotal >= 75 ? 0 : 8.95;
  const total = subtotal + shippingCost;

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      if (method === "stripe") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              productName: i.productName,
              variantName: i.variantName,
              price: Math.round(i.price * 100), // cents
              quantity: i.quantity,
            })),
            customerInfo: {
              name: form.name,
              email: form.email,
              phone: form.phone,
            },
            shippingInfo: form.pickupAtCamp
              ? null
              : {
                  line1: form.addressLine1,
                  line2: form.addressLine2,
                  city: form.city,
                  state: form.state,
                  zip: form.zip,
                },
            shippingCost: Math.round(shippingCost * 100),
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      } else {
        // Account billing
        const res = await fetch("/api/orders/account-billing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              productName: i.productName,
              variantName: i.variantName,
              price: i.price,
              quantity: i.quantity,
            })),
            customerInfo: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              camperName: form.camperName,
            },
            shippingInfo: form.pickupAtCamp
              ? { pickup: true }
              : {
                  line1: form.addressLine1,
                  line2: form.addressLine2,
                  city: form.city,
                  state: form.state,
                  zip: form.zip,
                },
            subtotal,
            shippingCost,
            total,
          }),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          router.push(
            `/shop/order-confirmation?method=account&order=${data.orderNumber || ""}`
          );
          return;
        }
        throw new Error(data.error || "Failed to place order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-stone mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-camp-red px-8 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-bark hover:text-camp-red transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-charcoal mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-8">
              {/* Payment method toggle */}
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("stripe")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      method === "stripe"
                        ? "border-camp-red bg-camp-red/5"
                        : "border-sand hover:border-stone"
                    }`}
                  >
                    <CreditCard
                      className={`h-5 w-5 ${
                        method === "stripe" ? "text-camp-red" : "text-bark"
                      }`}
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-charcoal">
                        Pay with Card
                      </p>
                      <p className="text-xs text-bark">
                        Visa, Mastercard, Amex
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("account")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      method === "account"
                        ? "border-camp-red bg-camp-red/5"
                        : "border-sand hover:border-stone"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 ${
                        method === "account" ? "text-camp-red" : "text-bark"
                      }`}
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-charcoal">
                        Bill to Account
                      </p>
                      <p className="text-xs text-bark">
                        Invoice to camp account
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer info */}
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                    />
                  </div>
                  {method === "account" && (
                    <input
                      type="text"
                      placeholder="Camper Name *"
                      required
                      value={form.camperName}
                      onChange={(e) => update("camperName", e.target.value)}
                      className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  Shipping
                </h2>

                {method === "account" && (
                  <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.pickupAtCamp}
                      onChange={(e) =>
                        update("pickupAtCamp", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-sand text-camp-red focus:ring-camp-red"
                    />
                    <span className="text-sm text-charcoal">
                      Pick up at camp (free)
                    </span>
                  </label>
                )}

                {!form.pickupAtCamp && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      required
                      value={form.addressLine1}
                      onChange={(e) =>
                        update("addressLine1", e.target.value)
                      }
                      className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={form.addressLine2}
                      onChange={(e) =>
                        update("addressLine2", e.target.value)
                      }
                      className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                      />
                      <input
                        type="text"
                        placeholder="ZIP *"
                        required
                        value={form.zip}
                        onChange={(e) => update("zip", e.target.value)}
                        className="w-full rounded-lg border border-sand px-4 py-3 text-sm text-charcoal placeholder:text-stone focus:border-camp-red focus:ring-1 focus:ring-camp-red outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-camp-red py-4 text-base font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {submitting
                  ? "Processing..."
                  : method === "stripe"
                  ? `Pay ${formatPriceDollars(total)}`
                  : "Place Order"}
              </button>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-sand/50 p-6 sticky top-32">
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  Order Summary
                </h2>
                <ul className="space-y-4 mb-6">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.variantId || "base"}`}
                      className="flex gap-3"
                    >
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[0.6rem] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-bark">
                            {item.variantName}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-charcoal">
                        {formatPriceDollars(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 border-t border-sand pt-4 text-sm">
                  <div className="flex justify-between text-bark">
                    <span>Subtotal</span>
                    <span>{formatPriceDollars(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-bark">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "Free"
                        : formatPriceDollars(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-charcoal pt-2 border-t border-sand">
                    <span>Total</span>
                    <span>{formatPriceDollars(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
