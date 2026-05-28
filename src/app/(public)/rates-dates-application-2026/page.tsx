import type { Metadata } from "next";
import { Fragment } from "react";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { getPageContent, readBlock, type TableContent } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { loadOrderedSectionKeys } from "@/lib/page-section-layout";
import { RATES_DATES_SCHEMA } from "@/lib/page-schemas/rates-dates";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  RATES_DEFAULTS as DEFAULTS,
  type DiscountRow,
  type PaymentRow,
} from "@/lib/page-defaults/rates-dates";

const DEFAULT_HERO_BG = "/assets/site/Canoe.jpg";

const DEFAULT_TUITION_COLUMNS = [
  { key: "duration", label: "Duration" },
  { key: "inCamp", label: "In Camp" },
  { key: "dayTripper", label: "Day Tripper" },
  { key: "threeQuarter", label: "Three-Quarter Day" },
];

export const metadata: Metadata = {
  title: "2026 Rates, Dates & Application | Camp Riverbend",
  description:
    "Camp Riverbend is a 7 week program. Campers can register for anywhere from 2 consecutive weeks through the full 7 week season.",
};

// Revalidate so admin edits show within a minute without redeploy
export const revalidate = 60;

const PAGE_SLUG = "rates-dates-application-2026";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("rates-dates: page content load failed, using defaults:", err);
  }

  // tuition_rows is now a "table" block — content is { columns, rows }.
  // Older saved content (from when it was a "rows" block) is missing
  // columns; fall back to the schema's default column layout in that case.
  const tuitionRaw = readBlock<Partial<TableContent>>(blocks, "tuition_rows", {
    columns: DEFAULT_TUITION_COLUMNS,
    rows: DEFAULTS.tuition_rows as unknown as Array<Record<string, string>>,
  });
  const rawColumns =
    Array.isArray(tuitionRaw.columns) && tuitionRaw.columns.length > 0
      ? tuitionRaw.columns
      : DEFAULT_TUITION_COLUMNS;
  const tuitionRows = Array.isArray(tuitionRaw.rows) ? tuitionRaw.rows : [];
  // Hide columns with no data — handles accidental "Add column" clicks in
  // the admin editor that left a placeholder column behind.
  const tuitionColumns = rawColumns.filter((col) =>
    tuitionRows.some((row) => (row[col.key] ?? "").toString().trim() !== "")
  );

  return {
    heroTitle: readBlock<{ value: string }>(blocks, "hero_title", { value: DEFAULTS.hero_title }).value,
    heroSubtitle: readBlock<{ value: string }>(blocks, "hero_subtitle", { value: DEFAULTS.hero_subtitle }).value,
    introHtml: readBlock<{ html: string }>(blocks, "intro", { html: DEFAULTS.intro_html }).html,
    tuitionNote: readBlock<{ value: string }>(blocks, "tuition_note", { value: DEFAULTS.tuition_note }).value,
    tuitionColumns,
    tuitionRows,
    tuitionExtrasHtml: readBlock<{ html: string }>(blocks, "tuition_extras", { html: DEFAULTS.tuition_extras_html }).html,
    discounts: readBlock<{ rows: DiscountRow[] }>(blocks, "discounts", { rows: DEFAULTS.discounts }).rows,
    paymentSchedule: readBlock<{ rows: PaymentRow[] }>(blocks, "payment_schedule", { rows: DEFAULTS.payment_schedule }).rows,
    paymentExtrasHtml: readBlock<{ html: string }>(blocks, "payment_extras", { html: DEFAULTS.payment_extras_html }).html,
    policiesHeading: readBlock<{ value: string }>(blocks, "policies_heading", { value: "Policies" }).value,
    policiesBody: readBlock<{ html: string }>(blocks, "policies_body", { html: "" }).html,
    heroBg: readBlock<{ url: string; alt?: string }>(blocks, "hero_bg", { url: DEFAULT_HERO_BG, alt: "" }),
  };
}

export default async function RatesDatePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);
  const orderedKeys = await loadOrderedSectionKeys(RATES_DATES_SCHEMA);

  // Each editable section is rendered into a map keyed by its schema
  // section key. The Page Header above is pinned and excluded from the
  // ordered list. Empty optional sections (e.g. blank Policies body)
  // simply return null so the page collapses cleanly.
  const renderedByKey: Record<string, React.ReactNode> = {
    intro: (
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.introHtml) }}
              />
              <div className="pt-2">
                <Button variant="primary" size="lg" href={EXTERNAL_LINKS.camperApp} external>
                  Apply Now
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ),
    tuition: (
      <Section id="tuition-rates" bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-8">
              <h2 className="font-camp">2026 Tuition Rates</h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            {c.tuitionNote && (
              <div className="mb-4 flex justify-center">
                <p className="inline-block bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2 text-sm font-medium">
                  {c.tuitionNote}
                </p>
              </div>
            )}
            <div className="overflow-x-auto rounded-2xl shadow-sm border border-stone/30">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-camp-red">
                    {c.tuitionColumns.map((col) => (
                      <th key={col.key} className="py-3 px-4 font-camp text-charcoal">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/30">
                  {c.tuitionRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}>
                      {c.tuitionColumns.map((col, ci) => (
                        <td
                          key={col.key}
                          className={
                            ci === 0
                              ? "py-3 px-4 font-semibold text-charcoal"
                              : "py-3 px-4 text-bark"
                          }
                        >
                          {row[col.key] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ),
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
    discounts: (
      <Section id="discounts" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Discounts</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.discounts.map((discount, i) => (
              <AnimateIn key={`${discount.heading}-${i}`} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="font-camp text-lg mb-3 text-camp-red">{discount.heading}</h3>
                  <p className="text-bark leading-relaxed">{discount.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    ),
    "payment-schedule": (
      <Section id="payment-schedule" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Payment Schedule</h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="space-y-4">
              {c.paymentSchedule.map((item, i) => (
                <div
                  key={`${item.label}-${i}`}
                  className="flex gap-5 items-start bg-cream/50 rounded-2xl p-5 border border-stone/20"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-camp-red text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal font-camp">{item.label}</p>
                    <p className="text-bark leading-relaxed mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ),
    "payment-extras": c.paymentExtrasHtml ? (
      <Section id="payment-extras" bg="white" padding="sm">
        <Container size="narrow">
          <AnimateIn>
            <div
              className="prose prose-lg max-w-2xl mx-auto text-bark [&_h2]:font-camp [&_h2]:text-charcoal [&_h2]:text-center [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-camp [&_h3]:text-charcoal [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paymentExtrasHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>
    ) : null,
    policies: c.policiesBody ? (
      <Section id="policies" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              {c.policiesHeading && (
                <h2 className="font-camp text-center">{c.policiesHeading}</h2>
              )}
              <div
                className="prose prose-lg max-w-none text-bark [&_h2]:font-camp [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-camp [&_h3]:text-charcoal [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.policiesBody) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
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

      {/* CTA — always pinned at the bottom */}
      <Section id="cta" bg="dark" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <h2 className="font-camp text-white">Ready to Join Camp Riverbend?</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="primary" size="lg" href={EXTERNAL_LINKS.camperApp} external>
                  Apply Now
                </Button>
                <Button variant="white" size="lg" href={EXTERNAL_LINKS.inquiryForm} external>
                  Request Information
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
