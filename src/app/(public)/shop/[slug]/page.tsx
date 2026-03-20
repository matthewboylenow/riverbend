import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { getProductBySlug, PRODUCTS } from "@/lib/store-data";
import { ProductDetail } from "@/components/shop/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.filter((p) => p.isActive).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `Shop ${product.name} — Camp Riverbend gear.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
