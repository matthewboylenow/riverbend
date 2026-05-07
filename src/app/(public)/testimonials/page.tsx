import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import {
  TESTIMONIALS_DEFAULTS as D,
  type CamperQuote,
  type ParentQuote,
} from "@/lib/page-defaults/testimonials";

export const metadata: Metadata = {
  title: "Testimonials | Camp Riverbend",
  description:
    "Hear from Camp Riverbend campers and families about their experiences at our summer day camp.",
};

const PAGE_SLUG = "testimonials";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("testimonials: page content load failed, using defaults:", err);
  }

  const t = (key: string, fallback: string) =>
    readBlock<{ value: string }>(blocks, key, { value: fallback }).value;
  const i = (key: string, fallbackUrl: string, fallbackAlt = "") =>
    readBlock<{ url: string; alt?: string }>(blocks, key, {
      url: fallbackUrl,
      alt: fallbackAlt,
    });

  return {
    heroTitle: t("hero_title", D.hero_title),
    heroSubtitle: t("hero_subtitle", D.hero_subtitle),
    heroBg: i("hero_bg", D.hero_bg_url, D.hero_bg_alt),

    campersHeading: t("campers_heading", D.campers_heading),
    camperQuotes: readBlock<{ rows: CamperQuote[] }>(blocks, "camper_quotes", {
      rows: D.camper_quotes,
    }).rows,

    parentsHeading: t("parents_heading", D.parents_heading),
    parentQuotes: readBlock<{ rows: ParentQuote[] }>(blocks, "parent_quotes", {
      rows: D.parent_quotes,
    }).rows,

    ctaHeading: t("cta_heading", D.cta_heading),
    ctaApplyLabel: t("cta_apply_label", D.cta_apply_label),
    ctaInquiryLabel: t("cta_inquiry_label", D.cta_inquiry_label),
  };
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Testimonials" },
        ]}
      />

      {/* Section 1: Camper Quotes */}
      <Section id="camper-quotes" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <h2 className="font-camp text-center mb-10">{c.campersHeading}</h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.camperQuotes.map((cq, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="text-camp-red text-4xl font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-bark text-body leading-relaxed italic">{cq.quote}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 2: Parent Quotes */}
      <Section id="parent-quotes" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <h2 className="font-camp text-center mb-10">{c.parentsHeading}</h2>
          </AnimateIn>
          <div className="flex flex-col gap-6">
            {c.parentQuotes.map((item, i) => (
              <AnimateIn key={i} delay={i * 0.04}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-sand">
                  <div className="text-camp-red text-4xl font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-bark text-body leading-relaxed italic">{item.quote}</p>
                  <p className="mt-4 text-sm font-semibold text-camp-red">
                    &mdash; {item.name}, {item.town}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: CTA */}
      <section className="bg-charcoal py-16 md:py-20">
        <Container>
          <AnimateIn>
            <div className="text-center space-y-6">
              <h2 className="text-white font-camp">{c.ctaHeading}</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" href={EXTERNAL_LINKS.camperApp} external>
                  {c.ctaApplyLabel}
                </Button>
                <Button variant="white" href={EXTERNAL_LINKS.inquiryForm} external>
                  {c.ctaInquiryLabel}
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </section>
    </InnerPageLayout>
  );
}
