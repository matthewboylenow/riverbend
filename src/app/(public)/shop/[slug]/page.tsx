import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/shop/ProductDetail";
import {
  getProductBySlug as getStaticProduct,
  PRODUCTS as STATIC_PRODUCTS,
  type StaticProduct,
} from "@/lib/store-data";
import { db } from "@/lib/db";
import { products, productVariants, categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function loadProduct(slug: string): Promise<StaticProduct | null> {
  try {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const p = rows[0];
    if (!p || !p.isActive) return null;

    const [variants, cat] = await Promise.all([
      db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, p.id))
        .orderBy(asc(productVariants.sortOrder)),
      p.categoryId
        ? db.select().from(categories).where(eq(categories.id, p.categoryId)).limit(1)
        : Promise.resolve([]),
    ]);

    const images = (p.images as string[] | null) ?? [];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      category: cat[0]?.name ?? "Other",
      categorySlug: cat[0]?.slug ?? "other",
      description: p.description ?? undefined,
      image: images[0] ?? "",
      images,
      variants: variants.map((v) => ({ id: v.id, name: v.name })),
      isActive: p.isActive ?? true,
    };
  } catch (err) {
    console.error("Product DB load failed, falling back to static:", err);
    const fallback = getStaticProduct(slug);
    return fallback ?? null;
  }
}

export async function generateStaticParams() {
  return STATIC_PRODUCTS.filter((p) => p.isActive).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `Shop ${product.name} — Camp Riverbend gear.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  return (
    <InnerPageLayout showCTA={false}>
      <Section className="pt-32 pb-16">
        <Container>
          <ProductDetail product={product} />
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
