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
import { CLUBHOUSE_DEFAULTS as D } from "@/lib/page-defaults/clubhouse";

export const metadata: Metadata = {
  title: "The Clubhouse | Ages 3-5 | Camp Riverbend",
  description:
    "The Clubhouse is a wonderful introduction to the classic Camp Riverbend summer camp experience for campers aged 3-5 years old.",
};

const PAGE_SLUG = "clubhouse";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("clubhouse: page content load failed, using defaults:", err);
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

    overviewAgeLabel: t("overview_age_label", D.overview_age_label),
    overviewHtml: r("overview", D.overview_html),

    videoCaption: t("video_caption", D.video_caption),
    videoId: t("video_id", D.video_id),
    videoTitle: t("video_title", D.video_title),

    programsThreeQuarterHeading: t(
      "programs_three_quarter_heading",
      D.programs_three_quarter_heading
    ),
    programsThreeQuarterHtml: r(
      "programs_three_quarter",
      D.programs_three_quarter_html
    ),
    programsFullDayHeading: t(
      "programs_full_day_heading",
      D.programs_full_day_heading
    ),
    programsFullDayHtml: r("programs_full_day", D.programs_full_day_html),

    supervisionHeading: t("supervision_heading", D.supervision_heading),
    supervisionHtml: r("supervision", D.supervision_html),
    supervisionImage: i(
      "supervision_image",
      D.supervision_image_url,
      D.supervision_image_alt
    ),

    schedulesHeading: t("schedules_heading", D.schedules_heading),
    schedulesIntro: t("schedules_intro", D.schedules_intro),
    schedulesCard1Title: t(
      "schedules_card_1_title",
      D.schedules_card_1_title
    ),
    schedulesCard1Subtitle: t(
      "schedules_card_1_subtitle",
      D.schedules_card_1_subtitle
    ),
    schedulesCard2Title: t(
      "schedules_card_2_title",
      D.schedules_card_2_title
    ),
    schedulesCard2Subtitle: t(
      "schedules_card_2_subtitle",
      D.schedules_card_2_subtitle
    ),

    learnMore1Title: t("learn_more_1_title", D.learn_more_card_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_card_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_card_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_card_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_card_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_card_3_image),
  };
}

export default async function ClubhousePage({
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
          { label: "The Clubhouse" },
        ]}
      />

      {/* Overview */}
      <Section id="overview" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {c.overviewAgeLabel}
              </span>
            </div>
            <div
              className="prose prose-lg max-w-none text-gray-700 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
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

      {/* Programs Grid */}
      <Section id="programs" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {c.programsThreeQuarterHeading}
                </h3>
                <div
                  className="prose max-w-none text-gray-700 [&_p]:leading-relaxed [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(c.programsThreeQuarterHtml),
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {c.programsFullDayHeading}
                </h3>
                <div
                  className="prose max-w-none text-gray-700 [&_p]:leading-relaxed [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(c.programsFullDayHtml),
                  }}
                />
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Supervision */}
      <Section id="supervision" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {c.supervisionHeading}
                </h2>
                <div
                  className="prose max-w-none text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(c.supervisionHtml),
                  }}
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={c.supervisionImage.url || D.supervision_image_url}
                  alt={c.supervisionImage.alt || D.supervision_image_alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Sample Schedules */}
      <Section id="sample-schedules" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              {c.schedulesHeading}
            </h2>
            <p className="text-center text-gray-700 mb-8">
              {c.schedulesIntro}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a
                href="/assets/documents/schedules/clubhouse-three-quarter-day.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-stone/30 rounded-xl hover:border-camp-red hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-charcoal">
                    {c.schedulesCard1Title}
                  </div>
                  <div className="text-sm text-bark">
                    {c.schedulesCard1Subtitle}
                  </div>
                </div>
                <span className="text-camp-red font-semibold text-sm">PDF →</span>
              </a>
              <a
                href="/assets/documents/schedules/clubhouse-full-day.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-stone/30 rounded-xl hover:border-camp-red hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-charcoal">
                    {c.schedulesCard2Title}
                  </div>
                  <div className="text-sm text-bark">
                    {c.schedulesCard2Subtitle}
                  </div>
                </div>
                <span className="text-camp-red font-semibold text-sm">PDF →</span>
              </a>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Learn More */}
      <Section id="learn-more" bg="white">
        <Container>
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Learn More
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LinkCard
                title={c.learnMore1Title}
                href="/programs"
                image={c.learnMore1Image.url || D.learn_more_card_1_image}
                index={0}
              />
              <LinkCard
                title={c.learnMore2Title}
                href="/activities"
                image={c.learnMore2Image.url || D.learn_more_card_2_image}
                index={1}
              />
              <LinkCard
                title={c.learnMore3Title}
                href="/rates-dates-application-2026"
                image={c.learnMore3Image.url || D.learn_more_card_3_image}
                index={2}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
