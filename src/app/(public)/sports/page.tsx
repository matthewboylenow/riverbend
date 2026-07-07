import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { LinkCard } from "@/components/ui/LinkCard";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { SPORTS_DEFAULTS as D, type SportCard } from "@/lib/page-defaults/sports";

export const metadata: Metadata = {
  title: "Sports | Camp Riverbend",
  description:
    "Explore the various sports activities of Camp Riverbend, a traditional summer day camp located along the gentle Passaic River in Warren Township, New Jersey.",
};

const PAGE_SLUG = "sports";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("sports: page content load failed, using defaults:", err);
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

    introHtml: r("intro", D.intro_html),

    sports: readBlock<{ rows: SportCard[] }>(blocks, "sports", { rows: D.sports }).rows,

    videoId: t("video_id", D.video_id),
    videoTitle: t("video_title", D.video_title),

    learnMoreHeading: t("learn_more_heading", D.learn_more_heading),
    learnMore1Title: t("learn_more_1_title", D.learn_more_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_3_image),
  };
}

export default async function SportsPage({
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
          { label: "Activities", href: "/activities" },
          { label: "Sports" },
        ]}
      />

      {/* Section 1: Intro */}
      <Section id="intro" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div
              className="prose prose-lg max-w-none mx-auto text-center text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.introHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Sports Grid */}
      <Section id="sports-grid" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.sports.map((sport, index) => (
              <AnimateIn key={`${sport.name}-${index}`} delay={index * 0.1}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-camp text-lg">{sport.name}</h3>
                  {sport.description && (
                    <p className="text-sm text-bark leading-relaxed mt-2">
                      {sport.description}
                    </p>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: Sports Video */}
      {c.videoId && (
        <Section id="sports-video" bg="cream" padding="default">
          <Container size="narrow">
            <AnimateIn>
              <VideoEmbed vimeoId={c.videoId} title={c.videoTitle} />
            </AnimateIn>
          </Container>
        </Section>
      )}

      {/* Section 4: Learn More */}
      <Section bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.learnMoreHeading}</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <LinkCard
              title={c.learnMore1Title}
              href="/activities"
              image={c.learnMore1Image.url || D.learn_more_1_image}
              index={0}
            />
            <LinkCard
              title={c.learnMore2Title}
              href="/programs"
              image={c.learnMore2Image.url || D.learn_more_2_image}
              index={1}
            />
            <LinkCard
              title={c.learnMore3Title}
              href="/rates-dates-application"
              image={c.learnMore3Image.url || D.learn_more_3_image}
              index={2}
            />
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
