import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { LinkCard } from "@/components/ui/LinkCard";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { DAY_TRIPPERS_DEFAULTS as D } from "@/lib/page-defaults/day-trippers";

export const metadata: Metadata = {
  title: "Day Trippers | Grades 7-9 | Camp Riverbend",
  description:
    "Day Trippers is an option for boys and girls currently in 6th – 8th grades. This program gives teens a safe and supportive environment for learning social skills and independence.",
};

const PAGE_SLUG = "day-trippers";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("day-trippers: page content load failed, using defaults:", err);
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

    overviewBadge: t("overview_badge", D.overview_badge),
    overviewHeading: t("overview_heading", D.overview_heading),
    overviewHtml: r("overview", D.overview_html),

    programHeading: t("program_heading", D.program_heading),
    programHtml: r("program", D.program_html),
    programImage: i("program_image", D.program_image_url, D.program_image_alt),

    videoCaption: t("video_caption", D.video_caption),
    videoId: t("video_id", D.video_id),

    supervisionHeading: t("supervision_heading", D.supervision_heading),
    supervisionHtml: r("supervision", D.supervision_html),
    supervisionImage: i("supervision_image", D.supervision_image_url, D.supervision_image_alt),
    supervisionButtonLabel: t("supervision_button_label", D.supervision_button_label),

    calendarHeading: t("calendar_heading", D.calendar_heading),
    calendarSubheading: t("calendar_subheading", D.calendar_subheading),
    calendarImage: i("calendar_image", D.calendar_image_url, D.calendar_image_alt),

    learnMoreHeading: t("learn_more_heading", D.learn_more_heading),
    learnMore1Title: t("learn_more_1_title", D.learn_more_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_3_image),
  };
}

export default async function DayTrippersPage({
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
          { label: "Programs", href: "/programs" },
          { label: "Day Trippers" },
        ]}
      />

      {/* Overview */}
      <Section id="overview" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {c.overviewBadge}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
              {c.overviewHeading}
            </h2>
            <div
              className="text-lg text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.overviewHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Program Details */}
      <Section id="program-details" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">{c.programHeading}</h2>
                  <div
                    className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.programHtml) }}
                  />
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={c.programImage.url || D.program_image_url}
                    alt={c.programImage.alt || D.program_image_alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Video */}
      {c.videoId && (
        <Section id="video" bg="cream" padding="sm">
          <Container size="narrow">
            <AnimateIn direction="up">
              <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                {c.videoCaption}
              </p>
              <VideoEmbed vimeoId={c.videoId} title="Day Trippers Program" />
            </AnimateIn>
          </Container>
        </Section>
      )}

      {/* Supervision */}
      <Section id="supervision" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={c.supervisionImage.url || D.supervision_image_url}
                    alt={c.supervisionImage.alt || D.supervision_image_alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">{c.supervisionHeading}</h2>
                  <div
                    className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.supervisionHtml) }}
                  />
                  <div>
                    <Button variant="primary" href={EXTERNAL_LINKS.camperApp} external>
                      {c.supervisionButtonLabel}
                    </Button>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* 2026 Day Trippers Calendar */}
      <Section id="trippers-calendar" bg="white">
        <Container size="narrow">
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              {c.calendarHeading}
            </h2>
            <p className="text-center text-gray-700 mb-8">{c.calendarSubheading}</p>
            <a
              href={c.calendarImage.url || D.calendar_image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-stone/30 hover:shadow-md transition-shadow"
            >
              <Image
                src={c.calendarImage.url || D.calendar_image_url}
                alt={c.calendarImage.alt || D.calendar_image_alt}
                width={1200}
                height={1500}
                className="w-full h-auto"
              />
            </a>
          </AnimateIn>
        </Container>
      </Section>

      {/* Learn More */}
      <Section id="learn-more" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              {c.learnMoreHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LinkCard
                title={c.learnMore1Title}
                href="/programs"
                image={c.learnMore1Image.url || D.learn_more_1_image}
                index={0}
              />
              <LinkCard
                title={c.learnMore2Title}
                href="/activities"
                image={c.learnMore2Image.url || D.learn_more_2_image}
                index={1}
              />
              <LinkCard
                title={c.learnMore3Title}
                href="/rates-dates-application-2026"
                image={c.learnMore3Image.url || D.learn_more_3_image}
                index={2}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
