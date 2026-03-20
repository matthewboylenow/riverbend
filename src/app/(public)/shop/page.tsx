import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { PRODUCTS, CATEGORIES } from "@/lib/store-data";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Riverbend Gear",
  description:
    "Shop Camp Riverbend merchandise — shirts, hoodies, hats, backpacks and more. Camp Riverbend does not require campers to wear a camp uniform.",
};

export default function ShopPage() {
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

          <ShopGrid products={PRODUCTS} categories={CATEGORIES} />
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
