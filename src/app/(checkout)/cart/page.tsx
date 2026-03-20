"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPriceDollars } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Your Cart</h1>
        <p className="text-bark mb-8">
          {itemCount === 0
            ? "Your cart is empty."
            : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-stone mx-auto mb-4" />
            <p className="text-bark mb-6">
              Nothing here yet. Start shopping!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-camp-red px-8 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="divide-y divide-sand">
              {items.map((item) => {
                const key = `${item.productId}-${item.variantId || "base"}`;
                return (
                  <div
                    key={key}
                    className="flex gap-4 sm:gap-6 py-6"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-sand"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-base font-semibold text-charcoal hover:text-camp-red transition-colors"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-bark mt-0.5">
                          Size: {item.variantName}
                        </p>
                      )}
                      <p className="text-base font-bold text-camp-red mt-1">
                        {formatPriceDollars(item.price)}
                      </p>

                      {/* Quantity + Remove */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="inline-flex items-center rounded-lg border border-sand">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-bark hover:text-charcoal transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-bark hover:text-charcoal transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantId)
                          }
                          className="text-bark hover:text-camp-red transition-colors"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <p className="text-base font-bold text-charcoal">
                        {formatPriceDollars(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="border-t-2 border-charcoal/10 pt-6 mt-2">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium text-charcoal">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-charcoal">
                  {formatPriceDollars(subtotal)}
                </span>
              </div>
              <p className="text-sm text-bark mb-6">
                Shipping calculated at checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="flex-1 rounded-full border-2 border-charcoal py-3 text-center text-sm font-bold text-charcoal hover:bg-charcoal hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 rounded-full bg-camp-red py-3 text-center text-sm font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
