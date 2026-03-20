import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

interface Props {
  searchParams: Promise<{ method?: string; order?: string; session_id?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { method, order } = await searchParams;
  const isAccount = method === "account";

  return (
    <InnerPageLayout showCTA={false}>
      <Section className="pt-32 pb-20">
        <Container className="max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/10">
              <CheckCircle2 className="h-10 w-10 text-forest" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-charcoal mb-4">
            Thank You for Your Order!
          </h1>

          {order && (
            <p className="text-lg text-bark mb-4">
              Order #{order}
            </p>
          )}

          {isAccount ? (
            <p className="text-bark leading-relaxed mb-8">
              Your order has been placed. Camp Riverbend will invoice your
              account. You&apos;ll receive a confirmation email shortly.
            </p>
          ) : (
            <p className="text-bark leading-relaxed mb-8">
              Your payment has been received. You&apos;ll receive a confirmation
              email shortly with your order details.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="rounded-full bg-camp-red px-8 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="rounded-full border-2 border-charcoal px-8 py-3 text-sm font-bold text-charcoal hover:bg-charcoal hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
