import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { TRANSPORTATION_DEFAULTS as D } from "@/lib/page-defaults/transportation";

export const metadata: Metadata = {
  title: "Transportation | Camp Riverbend",
  description:
    "Camp tuition includes either bus transportation or a place in the extended day program. Campers travel in small yellow school buses with a riding counselor.",
};

const PAGE_SLUG = "transportation";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("transportation: page content load failed, using defaults:", err);
  }

  const t = (key: string, fallback: string) =>
    readBlock<{ value: string }>(blocks, key, { value: fallback }).value;
  const r = (key: string, fallbackHtml: string) =>
    readBlock<{ html: string }>(blocks, key, { html: fallbackHtml }).html;
  const i = (key: string, fallbackUrl: string, fallbackAlt = "") =>
    readBlock<{ url: string; alt?: string }>(blocks, key, {
      url: fallbackUrl,
      alt: fallbackAlt,
    });

  return {
    heroTitle: t("hero_title", D.hero_title),
    heroSubtitle: t("hero_subtitle", D.hero_subtitle),
    heroBg: i("hero_bg", D.hero_bg_url, D.hero_bg_alt),

    overviewHtml: r("overview", D.overview_html),

    busServiceHeading: t("bus_service_heading", D.bus_service_heading),
    busServiceHtml: r("bus_service", D.bus_service_html),
    busServiceImage: i(
      "bus_service_image",
      D.bus_service_image_url,
      D.bus_service_image_alt
    ),

    threeQuarterHeading: t("three_quarter_heading", D.three_quarter_heading),
    threeQuarterHtml: r("three_quarter", D.three_quarter_html),

    extendedDayHeading: t("extended_day_heading", D.extended_day_heading),
    extendedDayHtml: r("extended_day", D.extended_day_html),
  };
}

export default async function TransportationPage({
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
          { label: "Transportation" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div
              className="space-y-6 text-center prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.overviewHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Bus Service Details */}
      <Section id="bus-service" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">{c.busServiceHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.busServiceHtml) }}
                />
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.busServiceImage.url || D.bus_service_image_url}
                  alt={c.busServiceImage.alt || D.bus_service_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 3: Three-Quarter Day Transportation */}
      <Section id="three-quarter-day" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">
                {c.threeQuarterHeading}
              </h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.threeQuarterHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Extended Day */}
      <Section id="extended-day" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">{c.extendedDayHeading}</h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.extendedDayHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
