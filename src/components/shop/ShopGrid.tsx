"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import type { StaticProduct } from "@/lib/store-data";

interface ShopGridProps {
  products: StaticProduct[];
  categories: { name: string; slug: string }[];
}

type SortOption = "default" | "price-asc" | "price-desc";

export function ShopGrid({ products, categories }: ShopGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.isActive);
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categorySlug === activeCategory);
    }
    if (sort === "price-asc") {
      result = [...result].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return result;
  }, [products, activeCategory, sort]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-camp-red text-white"
                  : "bg-sand text-bark hover:bg-stone/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-charcoal"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            image={product.image}
            category={product.category}
            hasVariants={product.variants.length > 0}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-bark py-12">
          No products found in this category.
        </p>
      )}
    </>
  );
}
