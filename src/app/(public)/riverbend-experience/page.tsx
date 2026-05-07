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
import {
  RIVERBEND_EXPERIENCE_DEFAULTS as D,
  type ScheduleLink,
} from "@/lib/page-defaults/riverbend-experience";

export const metadata: Metadata = {
  title: "Riverbend Experience | Grades 1-8 | Camp Riverbend",
  description:
    "Campers entering 1st through 8th grades explore, grow and gain confidence! During the day, each group rotates through eight different activities and has many new experiences.",
};

const PAGE_SLUG = "riverbend-experience";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("riverbend-experience: page content load failed, using defaults:", err);
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
    overviewHtml: r("overview", D.overview_html),

    videoCaption: t("video_caption", D.video_caption),
    videoId: t("video_id", D.video_id),
    videoTitle: t("video_title", D.video_title),

    typicalDayHeading: t("typical_day_heading", D.typical_day_heading),
    typicalDayHtml: r("typical_day", D.typical_day_html),
    typicalDayImage: i("typical_day_image", D.typical_day_image_url, D.typical_day_image_alt),

    supervisionHeading: t("supervision_heading", D.supervision_heading),
    supervisionHtml: r("supervision", D.supervision_html),
    supervisionImage: i("supervision_image", D.supervision_image_url, D.supervision_image_alt),

    schedulesHeading: t("schedules_heading", D.schedules_heading),
    schedulesSubheading: t("schedules_subheading", D.schedules_subheading),
    schedules: readBlock<{ rows: ScheduleLink[] }>(blocks, "schedules", { rows: D.schedules }).rows,

    learnMoreHeading: t("learn_more_heading", D.learn_more_heading),
    learnMore1Title: t("learn_more_1_title", D.learn_more_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_3_image),
  };
}

export default async function RiverbendExperiencePage({
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
          { label: "Riverbend Experience" },
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
            <div
              className="text-lg text-gray-700 leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.overviewHtml) }}
            />
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
              <VideoEmbed vimeoId={c.videoId} title={c.videoTitle} />
            </AnimateIn>
          </Container>
        </Section>
      )}

      {/* A Typical Day */}
      <Section id="typical-day" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">{c.typicalDayHeading}</h2>
                  <div
                    className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.typicalDayHtml) }}
                  />
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={c.typicalDayImage.url || D.typical_day_image_url}
                    alt={c.typicalDayImage.alt || D.typical_day_image_alt}
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

      {/* Supervision */}
      <Section id="supervision" bg="cream">
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
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Sample Schedules */}
      <Section id="sample-schedules" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.schedulesHeading}</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">{c.schedulesSubheading}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {c.schedules.map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-stone/30 rounded-lg hover:border-camp-red hover:shadow-sm transition-all text-sm"
                >
                  <span className="font-medium text-charcoal">{s.label}</span>
                  <span className="text-camp-red font-semibold">PDF →</span>
                </a>
              ))}
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Learn More */}
      <Section id="learn-more" bg="white">
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
