import type { Metadata } from "next";
import { Fragment } from "react";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { getPageContent, readBlock, type TableContent } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { loadOrderedSectionKeys } from "@/lib/page-section-layout";
import { RATES_DATES_NEXT_SCHEMA } from "@/lib/page-schemas/rates-dates-next";
import { sanitizeHtml } from "@/lib/sanitize";
import { RATES_NEXT_DEFAULTS as DEFAULTS } from "@/lib/page-defaults/rates-dates-next";
import type { DiscountRow, PaymentRow } from "@/lib/page-defaults/rates-dates";
import {
  DEFAULT_TUITION_COLUMNS,
  normalizeTable,
  nonBlankRows,
  TuitionTableSection,
  DiscountsSection,
  PaymentScheduleSection,
  ExtrasSection,
  PoliciesSection,
} from "@/components/rates/sections";

const DEFAULT_HERO_BG = "/assets/site/Canoe.jpg";

export const metadata: Metadata = {
  title: "2027 Rates, Dates & Application | Camp Riverbend",
  description:
    "Rates, session dates, and application information for Camp Riverbend's 2027 season.",
};

// Revalidate so admin edits show within a minute without redeploy
export const revalidate = 60;

const PAGE_SLUG = RATES_DATES_NEXT_SCHEMA.slug;

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("rates-dates-next: page content load failed, using defaults:", err);
  }

  const tuition = normalizeTable(
    readBlock<Partial<TableContent>>(blocks, "tuition_rows", {
      columns: DEFAULT_TUITION_COLUMNS,
      rows: DEFAULTS.tuition_rows as unknown as Array<Record<string, string>>,
    })
  );

  return {
    heroTitle: readBlock<{ value: string }>(blocks, "hero_title", { value: DEFAULTS.hero_title }).value,
    heroSubtitle: readBlock<{ value: string }>(blocks, "hero_subtitle", { value: DEFAULTS.hero_subtitle }).value,
    introHtml: readBlock<{ html: string }>(blocks, "intro", { html: DEFAULTS.intro_html }).html,
    introCtaLabel: readBlock<{ value: string }>(blocks, "intro_cta_label", { value: DEFAULTS.intro_cta_label }).value,
    introCtaHref: readBlock<{ value: string }>(blocks, "intro_cta_href", { value: DEFAULTS.intro_cta_href }).value,
    ctaHeading: readBlock<{ value: string }>(blocks, "cta_heading", { value: DEFAULTS.cta_heading }).value,
    ctaPrimaryLabel: readBlock<{ value: string }>(blocks, "cta_primary_label", { value: DEFAULTS.cta_primary_label }).value,
    ctaPrimaryHref: readBlock<{ value: string }>(blocks, "cta_primary_href", { value: DEFAULTS.cta_primary_href }).value,
    ctaSecondaryLabel: readBlock<{ value: string }>(blocks, "cta_secondary_label", { value: DEFAULTS.cta_secondary_label }).value,
    ctaSecondaryHref: readBlock<{ value: string }>(blocks, "cta_secondary_href", { value: DEFAULTS.cta_secondary_href }).value,
    tuitionHeading: readBlock<{ value: string }>(blocks, "tuition_heading", { value: DEFAULTS.tuition_heading }).value,
    tuitionNote: readBlock<{ value: string }>(blocks, "tuition_note", { value: DEFAULTS.tuition_note }).value,
    tuitionColumns: tuition.columns,
    tuitionRows: tuition.rows,
    tuitionExtrasHtml: readBlock<{ html: string }>(blocks, "tuition_extras", { html: DEFAULTS.tuition_extras_html }).html,
    discountsHeading: readBlock<{ value: string }>(blocks, "discounts_heading", { value: DEFAULTS.discounts_heading }).value,
    discounts: nonBlankRows(readBlock<{ rows: DiscountRow[] }>(blocks, "discounts", { rows: DEFAULTS.discounts }).rows),
    paymentHeading: readBlock<{ value: string }>(blocks, "payment_heading", { value: DEFAULTS.payment_heading }).value,
    paymentSchedule: nonBlankRows(readBlock<{ rows: PaymentRow[] }>(blocks, "payment_schedule", { rows: DEFAULTS.payment_schedule }).rows),
    paymentExtrasHtml: readBlock<{ html: string }>(blocks, "payment_extras", { html: DEFAULTS.payment_extras_html }).html,
    policiesHeading: readBlock<{ value: string }>(blocks, "policies_heading", { value: DEFAULTS.policies_heading }).value,
    policiesBody: readBlock<{ html: string }>(blocks, "policies_body", { html: DEFAULTS.policies_body_html }).html,
    heroBg: readBlock<{ url: string; alt?: string }>(blocks, "hero_bg", { url: DEFAULT_HERO_BG, alt: "" }),
  };
}

export default async function RatesDatesNextPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);
  const orderedKeys = await loadOrderedSectionKeys(RATES_DATES_NEXT_SCHEMA);

  // Every section collapses to nothing while its content is empty, so
  // the page can be drafted incrementally in the admin — customers only
  // ever see filled-in sections.
  const renderedByKey: Record<string, React.ReactNode> = {
    intro: c.introHtml ? (
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.introHtml) }}
              />
              {c.introCtaLabel && c.introCtaHref && (
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    href={c.introCtaHref}
                    external={/^https?:\/\//.test(c.introCtaHref)}
                  >
                    {c.introCtaLabel}
                  </Button>
                </div>
              )}
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ) : null,
    tuition:
      c.tuitionRows.length > 0 && c.tuitionColumns.length > 0 ? (
        <TuitionTableSection
          id="tuition-rates"
          heading={c.tuitionHeading}
          note={c.tuitionNote}
          columns={c.tuitionColumns}
          rows={c.tuitionRows}
        />
      ) : null,
    "tuition-extras": c.tuitionExtrasHtml ? (
      <Section id="tuition-extras" bg="white" padding="sm">
        <Container>
          <AnimateIn>
            <div
              className="prose prose-sm max-w-2xl mx-auto text-bark [&_h2]:font-camp [&_h2]:text-charcoal [&_h2]:text-center [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-camp [&_h3]:text-charcoal [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.tuitionExtrasHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>
    ) : null,
    discounts:
      c.discounts.length > 0 ? (
        <DiscountsSection id="discounts" heading={c.discountsHeading} rows={c.discounts} />
      ) : null,
    "payment-schedule":
      c.paymentSchedule.length > 0 ? (
        <PaymentScheduleSection
          id="payment-schedule"
          heading={c.paymentHeading}
          rows={c.paymentSchedule}
        />
      ) : null,
    "payment-extras": c.paymentExtrasHtml ? (
      <ExtrasSection id="payment-extras" html={c.paymentExtrasHtml} />
    ) : null,
    policies: c.policiesBody ? (
      <PoliciesSection id="policies" heading={c.policiesHeading} html={c.policiesBody} />
    ) : null,
  };

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || DEFAULT_HERO_BG}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: c.heroTitle },
        ]}
      />

      {orderedKeys.map((k) => (
        <Fragment key={k}>{renderedByKey[k]}</Fragment>
      ))}

      {/* CTA — pinned at the bottom, content editable via the "Bottom
          call-to-action" section. The section's hide toggle removes the
          whole band (orderedKeys excludes hidden sections). */}
      {orderedKeys.includes("cta") && (
        <Section id="cta" bg="dark" padding="default">
          <Container size="narrow">
            <AnimateIn>
              <div className="text-center space-y-6">
                {c.ctaHeading && <h2 className="font-camp text-white">{c.ctaHeading}</h2>}
                <div className="flex flex-wrap gap-4 justify-center">
                  {c.ctaPrimaryLabel && c.ctaPrimaryHref && (
                    <Button
                      variant="primary"
                      size="lg"
                      href={c.ctaPrimaryHref}
                      external={/^https?:\/\//.test(c.ctaPrimaryHref)}
                    >
                      {c.ctaPrimaryLabel}
                    </Button>
                  )}
                  {c.ctaSecondaryLabel && c.ctaSecondaryHref && (
                    <Button
                      variant="white"
                      size="lg"
                      href={c.ctaSecondaryHref}
                      external={/^https?:\/\//.test(c.ctaSecondaryHref)}
                    >
                      {c.ctaSecondaryLabel}
                    </Button>
                  )}
                </div>
              </div>
            </AnimateIn>
          </Container>
        </Section>
      )}
    </InnerPageLayout>
  );
}
