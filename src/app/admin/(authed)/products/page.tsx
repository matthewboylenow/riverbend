"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  isActive: boolean;
  sortOrder: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-camp-red-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {loading ? (
          <p className="px-4 py-6 text-sm text-bark">Loading…</p>
        ) : products.length === 0 ? (
          <p className="px-4 py-6 text-sm text-bark">No products yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20 bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Active</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-stone/10 hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 rounded-lg bg-sand overflow-hidden">
                      {p.images?.[0] && (
                        <Image src={p.images[0]} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-bark font-mono">{p.slug}</td>
                  <td className="px-4 py-3 text-sm text-bark">${p.price}</td>
                  <td className="px-4 py-3">
                    <div
                      className={cn("h-2.5 w-2.5 rounded-full", p.isActive ? "bg-green-500" : "bg-stone")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg transition-colors inline-flex"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
