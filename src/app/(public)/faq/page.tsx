import type { Metadata } from "next";
import FAQClient, { type FAQCategory } from "./FAQClient";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { FAQ_DEFAULTS as D, type FAQRow } from "@/lib/page-defaults/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Camp Riverbend — registration, transportation, daily schedule, lunch, health and safety, and more.",
};

const PAGE_SLUG = "faq";

interface CategoryDef {
  prefix: string;
  defaultHeading: string;
  defaultRows: FAQRow[];
}

const CATEGORIES: CategoryDef[] = [
  { prefix: "registration", defaultHeading: D.cat_registration_heading, defaultRows: D.cat_registration },
  { prefix: "transportation", defaultHeading: D.cat_transportation_heading, defaultRows: D.cat_transportation },
  { prefix: "staff", defaultHeading: D.cat_staff_heading, defaultRows: D.cat_staff },
  { prefix: "activities", defaultHeading: D.cat_activities_heading, defaultRows: D.cat_activities },
  { prefix: "food", defaultHeading: D.cat_food_heading, defaultRows: D.cat_food },
  { prefix: "safety", defaultHeading: D.cat_safety_heading, defaultRows: D.cat_safety },
];

export default async function FAQPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);

  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("faq: page content load failed, using defaults:", err);
  }

  const t = (key: string, fallback: string) =>
    readBlock<{ value: string }>(blocks, key, { value: fallback }).value;
  const i = (key: string, fallbackUrl: string, fallbackAlt = "") =>
    readBlock<{ url: string; alt?: string }>(blocks, key, {
      url: fallbackUrl,
      alt: fallbackAlt,
    });

  const heroBg = i("hero_bg", D.hero_bg_url, D.hero_bg_alt);

  const categories: FAQCategory[] = CATEGORIES.map(({ prefix, defaultHeading, defaultRows }) => ({
    title: t(`cat_${prefix}_heading`, defaultHeading),
    items: readBlock<{ rows: FAQRow[] }>(blocks, `cat_${prefix}`, { rows: defaultRows }).rows.map(
      (row, idx) => ({
        id: `${prefix}-${idx}`,
        question: row.question,
        answer: row.answer,
      })
    ),
  }));

  const heroTitle = t("hero_title", D.hero_title);
  const ctaHeading = t("cta_heading", D.cta_heading);
  const ctaPhoneLabel = t("cta_phone_label", D.cta_phone_label);
  const ctaPhoneHref = t("cta_phone_href", D.cta_phone_href);
  const ctaAfterPhone = t("cta_after_phone", D.cta_after_phone);
  const ctaInquiryLabel = t("cta_inquiry_label", D.cta_inquiry_label);
  const ctaApplyLabel = t("cta_apply_label", D.cta_apply_label);

  return (
    <InnerPageLayout>
      <PageHeader
        title={heroTitle}
        subtitle={t("hero_subtitle", D.hero_subtitle)}
        bgImage={heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
      />

      <Section id="faq" bg="cream" padding="default">
        <Container size="narrow">
          <FAQClient categories={categories} />
        </Container>
      </Section>

      <Section bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-4">
              <h2 className="font-camp text-charcoal">{ctaHeading}</h2>
              <p className="text-bark text-body leading-relaxed">
                Give us a call at{" "}
                <a href={ctaPhoneHref} className="text-camp-red font-semibold hover:underline">
                  {ctaPhoneLabel}
                </a>
                {ctaAfterPhone}
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button variant="primary" href={EXTERNAL_LINKS.inquiryForm} external>
                  {ctaInquiryLabel}
                </Button>
                <Button variant="secondary" href={EXTERNAL_LINKS.camperApp} external>
                  {ctaApplyLabel}
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
