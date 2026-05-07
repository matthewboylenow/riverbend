import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  HEALTH_SAFETY_DEFAULTS as D,
  type SafetyPoint,
} from "@/lib/page-defaults/health-safety";

export const metadata: Metadata = {
  title: "Health & Safety | Camp Riverbend",
  description:
    "Camper safety is our number one priority. Camp Riverbend exceeds all standards of the New Jersey Youth Camp Safety Act.",
};

const PAGE_SLUG = "health-safety";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("health-safety: page content load failed, using defaults:", err);
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
    safetyVideoId: t("safety_video_id", D.safety_video_id),

    nurseHeading: t("nurse_heading", D.nurse_heading),
    nurseHtml: r("nurse", D.nurse_html),
    nurseImage: i("nurse_image", D.nurse_image_url, D.nurse_image_alt),

    safetyPointsHeading: t("safety_points_heading", D.safety_points_heading),
    safetyPoints: readBlock<{ rows: SafetyPoint[] }>(blocks, "safety_points", {
      rows: D.safety_points,
    }).rows,

    ctaText: t("cta_text", D.cta_text),
    ctaButtonLabel: t("cta_button_label", D.cta_button_label),
  };
}

export default async function HealthSafetyPage({
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
          { label: "Health & Safety" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div
              className="prose prose-lg max-w-none mx-auto text-center text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.overviewHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Video */}
      {c.safetyVideoId && (
        <Section id="safety-video" bg="cream" padding="default">
          <Container>
            <AnimateIn>
              <VideoEmbed
                vimeoId={c.safetyVideoId}
                title={D.safety_video_title}
              />
            </AnimateIn>
          </Container>
        </Section>
      )}

      {/* Section 3: Our Camp Nurse */}
      <Section id="camp-nurse" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">{c.nurseHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.nurseHtml) }}
                />
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.nurseImage.url || D.nurse_image_url}
                  alt={c.nurseImage.alt || D.nurse_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 4: Key Safety Points */}
      <Section id="safety-points" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.safetyPointsHeading}</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.safetyPoints.map((point, i) => (
              <AnimateIn key={`${point.heading}-${i}`} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="font-camp text-lg mb-3">{point.heading}</h3>
                  <p className="text-bark leading-relaxed">{point.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 5: CTA */}
      <Section id="cta" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <p className="text-body-lg text-bark leading-relaxed">{c.ctaText}</p>
              <Button variant="primary" href="/faq">
                {c.ctaButtonLabel}
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
