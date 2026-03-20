"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPriceDollars } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
  } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (isDrawerOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({itemCount})
          </h2>
          <button
            onClick={closeDrawer}
            className="rounded-full p-2 text-bark hover:bg-sand transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-stone mb-4" />
              <p className="text-bark font-medium">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="mt-4 text-sm text-camp-red font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId || "base"}`}
                  className="flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-charcoal leading-tight truncate">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-bark mt-0.5">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-sm font-bold text-camp-red mt-1">
                      {formatPriceDollars(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className="rounded-md border border-sand p-1 text-bark hover:bg-sand transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium text-charcoal w-6 text-center">
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
                        className="rounded-md border border-sand p-1 text-bark hover:bg-sand transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="ml-auto text-xs text-bark hover:text-camp-red transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-bark">Subtotal</span>
              <span className="text-lg font-bold text-charcoal">
                {formatPriceDollars(subtotal)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full rounded-full border-2 border-charcoal py-3 text-center text-sm font-bold text-charcoal hover:bg-charcoal hover:text-white transition-colors"
            >
              View Full Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full rounded-full bg-camp-red py-3 text-center text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
