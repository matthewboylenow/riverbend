"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPriceDollars } from "@/lib/utils";
import type { StaticProduct } from "@/lib/store-data";

interface ProductDetailProps {
  product: StaticProduct;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants.length === 0 ? null : null
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  const hasVariants = product.variants.length > 0;
  const canAdd = !hasVariants || selectedVariant !== null;

  function handleAddToCart() {
    if (!canAdd) return;
    const variant = product.variants.find((v) => v.id === selectedVariant);
    addItem({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      variantName: variant?.name,
      price: parseFloat(product.price),
      quantity,
      image: product.image,
      slug: product.slug,
    });
    setQuantity(1);
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-medium text-bark hover:text-camp-red transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
            <Image
              src={product.images[mainImage] || product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.category && (
              <span className="absolute top-4 left-4 badge-camp text-xs">
                {product.category}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === mainImage
                      ? "border-camp-red"
                      : "border-sand hover:border-stone"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-charcoal leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-camp-red mt-2">
              {formatPriceDollars(product.price)}
            </p>
          </div>

          {product.description && (
            <p className="text-bark leading-relaxed">{product.description}</p>
          )}

          {/* Variant selector */}
          {hasVariants && (
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selectedVariant === v.id
                        ? "border-camp-red bg-camp-red text-white"
                        : "border-sand text-charcoal hover:border-camp-red"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">
              Quantity
            </label>
            <div className="inline-flex items-center rounded-lg border border-sand">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-bark hover:text-charcoal transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-medium text-charcoal min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-bark hover:text-charcoal transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold transition-colors ${
              canAdd
                ? "bg-camp-red text-white hover:bg-red-700"
                : "bg-sand text-stone cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {hasVariants && !selectedVariant
              ? "Select a Size"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
