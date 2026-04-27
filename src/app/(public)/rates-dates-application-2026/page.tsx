import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { getPageContent, readBlock } from "@/lib/page-content";
import { sanitizeHtml } from "@/lib/sanitize";

export const metadata: Metadata = {
  title: "2026 Rates, Dates & Application | Camp Riverbend",
  description:
    "Camp Riverbend is a 7 week program. Campers can register for anywhere from 2 consecutive weeks through the full 7 week season.",
};

// Revalidate so admin edits show within a minute without redeploy
export const revalidate = 60;

const PAGE_SLUG = "rates-dates-application-2026";

interface TuitionRow {
  duration: string;
  inCamp: string;
  dayTripper: string;
  threeQuarter: string;
}
interface DiscountRow {
  heading: string;
  body: string;
}
interface PaymentRow {
  label: string;
  detail: string;
}

const DEFAULTS = {
  hero_title: "Rates, Dates & Application",
  hero_subtitle: "2026 Season — June 29 through August 14",
  intro_html:
    "<p>Camp Riverbend is a 7 week program. Campers can attend from a minimum of 2 consecutive weeks up to the full 7 week season. Minimum enrollment for our Three-Quarter Day campers is 3 days per week. Grouping is done based on the grade a child will enter in September after the camp season.</p><p>Camp Riverbend will run Monday June 29 to Friday August 14, 2026. Camp will be closed on July 3. Camp hours are 9 am to 4 pm, with extended hours from 8 am to 6 pm.</p>",
  tuition_note: "2025 rates shown for reference. 2026 rates will be updated soon.",
  tuition_rows: [
    { duration: "7 Weeks", inCamp: "$8,375", dayTripper: "$9,170", threeQuarter: "$7,450" },
    { duration: "Any 6 Weeks", inCamp: "$7,820", dayTripper: "$8,640", threeQuarter: "$6,570" },
    { duration: "Any 5 Weeks", inCamp: "$7,230", dayTripper: "$7,950", threeQuarter: "$5,765" },
    { duration: "Any 4 Weeks", inCamp: "$6,470", dayTripper: "$7,200", threeQuarter: "$4,840" },
    { duration: "Any 3 Weeks", inCamp: "$5,215", dayTripper: "$6,150", threeQuarter: "$3,800" },
    { duration: "Any 2 Weeks", inCamp: "$3,970", dayTripper: "$4,875", threeQuarter: "$2,710" },
  ] as TuitionRow[],
  tuition_footer:
    "3 and 4 Year Old Three-Quarter Day tuition rates and discounts listed above are for 5 days a week and will be pro-rated for 3 or 4 days a week.",
  discounts: [
    { heading: "Sibling Discount (2nd Child)", body: "Deduct $300 from 7 or 6 week tuition, $250 from 5 week, $200 from 4 or 3 week, or $150 from 2 week tuition." },
    { heading: "Sibling Discount (3rd Child)", body: "Deduct $600 from 7 or 6 week tuition, $500 from 5 week, $400 from 4 or 3 week, or $300 from 2 week tuition." },
    { heading: "July 4 Holiday Discount", body: "If you enroll only for the first two weeks of camp (June 29 and July 7), deduct $300 from total tuition." },
    { heading: "Referral Discount", body: "Receive a $100 discount on your summer tuition for each first-time camper you refer ($50 for Three-Quarter Day)." },
  ] as DiscountRow[],
  payment_schedule: [
    { label: "At Application", detail: "$500 deposit per camper ($200 becomes non-refundable registration fee)" },
    { label: "January 6", detail: "$1,500 per camper payment" },
    { label: "April 1", detail: "Final tuition payment due" },
  ] as PaymentRow[],
  payment_footer_html:
    "<p><strong>Note:</strong> All tuition payments made on or after January 6 are non-refundable.</p><p>Payment plans available for EFT/echeck or credit card — all payments must be completed by April 1.</p>",
  whats_included_html:
    "<p>Each camper&rsquo;s tuition includes either bus transportation to and from camp <em>or</em> a place in our extended day program at camp (8:00&ndash;9:00 am and 4:00&ndash;6:00 pm). There is an additional fee if your family wants to use bus transportation <em>and</em> extended day daily or hold seats for a camper on two different buses.</p><p>2.9% convenience fee for credit card payments. No charge for EFT or debit card payments.</p>",
};

async function loadContent() {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG);
  } catch (err) {
    console.error("rates-dates: page content load failed, using defaults:", err);
  }
  return {
    heroTitle: readBlock<{ value: string }>(blocks, "hero_title", { value: DEFAULTS.hero_title }).value,
    heroSubtitle: readBlock<{ value: string }>(blocks, "hero_subtitle", { value: DEFAULTS.hero_subtitle }).value,
    introHtml: readBlock<{ html: string }>(blocks, "intro", { html: DEFAULTS.intro_html }).html,
    tuitionNote: readBlock<{ value: string }>(blocks, "tuition_note", { value: DEFAULTS.tuition_note }).value,
    tuitionRows: readBlock<{ rows: TuitionRow[] }>(blocks, "tuition_rows", { rows: DEFAULTS.tuition_rows }).rows,
    tuitionFooter: readBlock<{ value: string }>(blocks, "tuition_footer", { value: DEFAULTS.tuition_footer }).value,
    discounts: readBlock<{ rows: DiscountRow[] }>(blocks, "discounts", { rows: DEFAULTS.discounts }).rows,
    paymentSchedule: readBlock<{ rows: PaymentRow[] }>(blocks, "payment_schedule", { rows: DEFAULTS.payment_schedule }).rows,
    paymentFooterHtml: readBlock<{ html: string }>(blocks, "payment_footer", { html: DEFAULTS.payment_footer_html }).html,
    whatsIncludedHtml: readBlock<{ html: string }>(blocks, "whats_included", { html: DEFAULTS.whats_included_html }).html,
  };
}

export default async function RatesDatePage() {
  const c = await loadContent();

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage="/assets/site/Canoe.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: c.heroTitle },
        ]}
      />

      {/* Section 1: Overview */}
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

      {/* Section 2: Tuition Rates */}
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
                    <th className="py-3 px-4 font-camp text-charcoal">Duration</th>
                    <th className="py-3 px-4 font-camp text-charcoal">In Camp</th>
                    <th className="py-3 px-4 font-camp text-charcoal">Day Tripper</th>
                    <th className="py-3 px-4 font-camp text-charcoal">Three-Quarter Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/30">
                  {c.tuitionRows.map((row, i) => (
                    <tr
                      key={`${row.duration}-${i}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}
                    >
                      <td className="py-3 px-4 font-semibold text-charcoal">{row.duration}</td>
                      <td className="py-3 px-4 text-bark">{row.inCamp}</td>
                      <td className="py-3 px-4 text-bark">{row.dayTripper}</td>
                      <td className="py-3 px-4 text-bark">{row.threeQuarter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.tuitionFooter && (
              <p className="mt-4 text-sm text-bark/80 leading-relaxed max-w-2xl mx-auto text-center">
                {c.tuitionFooter}
              </p>
            )}
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Discounts */}
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

      {/* Section 4: Payment Schedule */}
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
            <div
              className="mt-6 prose prose-sm max-w-none text-bark [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-charcoal"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paymentFooterHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 5: What's Included */}
      <Section id="whats-included" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center mb-8">
              <h2 className="font-camp">What&rsquo;s Included</h2>
            </div>
            <div
              className="prose prose-lg max-w-none mx-auto text-center text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.whatsIncludedHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 6: CTA */}
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
