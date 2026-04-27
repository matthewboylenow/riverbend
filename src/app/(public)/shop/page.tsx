import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES as STATIC_CATEGORIES, type StaticProduct } from "@/lib/store-data";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { products, productVariants, categories } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Shop Riverbend Gear",
  description:
    "Shop Camp Riverbend merchandise — shirts, hoodies, hats, backpacks and more. Camp Riverbend does not require campers to wear a camp uniform.",
};

export const revalidate = 60;

async function loadShop(): Promise<{ products: StaticProduct[]; categories: { name: string; slug: string }[] }> {
  try {
    const [prodRows, varRows, catRows] = await Promise.all([
      db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.sortOrder), asc(products.name)),
      db.select().from(productVariants).orderBy(asc(productVariants.sortOrder)),
      db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
    ]);

    const catById = new Map(catRows.map((c) => [c.id, c]));
    const variantsByProduct = new Map<string, typeof varRows>();
    for (const v of varRows) {
      const arr = variantsByProduct.get(v.productId) || [];
      arr.push(v);
      variantsByProduct.set(v.productId, arr);
    }

    const mapped: StaticProduct[] = prodRows.map((p) => {
      const cat = p.categoryId ? catById.get(p.categoryId) : null;
      const images = (p.images as string[] | null) ?? [];
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: String(p.price),
        category: cat?.name ?? "Other",
        categorySlug: cat?.slug ?? "other",
        description: p.description ?? undefined,
        image: images[0] ?? "",
        images,
        variants: (variantsByProduct.get(p.id) ?? []).map((v) => ({ id: v.id, name: v.name })),
        isActive: p.isActive ?? true,
      };
    });

    const cats = [
      { name: "All", slug: "all" },
      ...catRows.map((c) => ({ name: c.name, slug: c.slug })),
    ];

    return { products: mapped, categories: cats };
  } catch (err) {
    console.error("Shop DB load failed, falling back to static:", err);
    return { products: STATIC_PRODUCTS, categories: STATIC_CATEGORIES };
  }
}

export default async function ShopPage() {
  const { products: prods, categories: cats } = await loadShop();

  return (
    <InnerPageLayout showCTA={false}>
      <PageHeader
        title="Shop Riverbend Gear"
        subtitle="Camp Riverbend does not require campers to wear a camp uniform; each camper will receive one free camper t-shirt prior to the start of camp."
      />

      <Section>
        <Container>
          <div className="mb-8 text-center">
            <a
              href="https://yessirr.com/collections/campriverbend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-camp-red hover:text-red-700 transition-colors"
            >
              Shop Trendy Camp Clothes at Yessirr
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <ShopGrid products={prods} categories={cats} />
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
