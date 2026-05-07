import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { LinkCard } from "@/components/ui/LinkCard";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { PROGRAMS_DEFAULTS as D } from "@/lib/page-defaults/programs";

export const metadata: Metadata = {
  title: "Our Programs | Camp Riverbend",
  description:
    "Camp Riverbend offers 3 great options for children of different ages: for Pre-K 3 & 4 year olds and rising kindergartners, for campers entering grades 1-8, and for campers entering grades 7-9.",
};

const PAGE_SLUG = "programs";

// ProgramCard expects a plain string description. We expose richtext to admins
// for formatting flexibility, but strip back to text on render.
function htmlToPlain(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/g, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "’")
    .replace(/&apos;/g, "'")
    .trim();
}

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("programs: page content load failed, using defaults:", err);
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

    clubhouseBadge: t("clubhouse_badge", D.clubhouse_badge),
    clubhouseTitle: t("clubhouse_title", D.clubhouse_title),
    clubhouseDescription: htmlToPlain(r("clubhouse_description", `<p>${D.clubhouse_description}</p>`)),
    clubhouseLinkLabel: t("clubhouse_link_label", D.clubhouse_link_label),
    clubhouseImage: i("clubhouse_image", D.clubhouse_image_url, D.clubhouse_image_alt),

    riverbendBadge: t("riverbend_badge", D.riverbend_badge),
    riverbendTitle: t("riverbend_title", D.riverbend_title),
    riverbendDescription: htmlToPlain(r("riverbend_description", `<p>${D.riverbend_description}</p>`)),
    riverbendLinkLabel: t("riverbend_link_label", D.riverbend_link_label),
    riverbendImage: i("riverbend_image", D.riverbend_image_url, D.riverbend_image_alt),

    daytrippersBadge: t("daytrippers_badge", D.daytrippers_badge),
    daytrippersTitle: t("daytrippers_title", D.daytrippers_title),
    daytrippersDescription: htmlToPlain(r("daytrippers_description", `<p>${D.daytrippers_description}</p>`)),
    daytrippersLinkLabel: t("daytrippers_link_label", D.daytrippers_link_label),
    daytrippersImage: i("daytrippers_image", D.daytrippers_image_url, D.daytrippers_image_alt),

    learnMoreHeading: t("learn_more_heading", D.learn_more_heading),
    learnMore1Title: t("learn_more_1_title", D.learn_more_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_3_image),
  };
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);
  // Keep the unused `sanitizeHtml` reference dead-stripped — included only if
  // we later move intro to direct render. The intro is short enough we render
  // it as plain HTML below.
  const _ = sanitizeHtml;
  void _;

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Programs" },
        ]}
      />

      {/* Intro */}
      <Section id="intro" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div
              className="text-center prose max-w-none [&_p]:text-lg [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.introHtml) }}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* The Clubhouse */}
      <Section id="clubhouse" bg="white">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge={c.clubhouseBadge}
              title={c.clubhouseTitle}
              description={c.clubhouseDescription}
              links={[{ label: c.clubhouseLinkLabel, href: "/clubhouse" }]}
              image={c.clubhouseImage.url || D.clubhouse_image_url}
              imageAlt={c.clubhouseImage.alt || D.clubhouse_image_alt}
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Riverbend Experience */}
      <Section id="riverbend-experience" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge={c.riverbendBadge}
              title={c.riverbendTitle}
              description={c.riverbendDescription}
              links={[{ label: c.riverbendLinkLabel, href: "/riverbend-experience" }]}
              image={c.riverbendImage.url || D.riverbend_image_url}
              imageAlt={c.riverbendImage.alt || D.riverbend_image_alt}
              reversed
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Day Trippers */}
      <Section id="day-trippers" bg="white">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge={c.daytrippersBadge}
              title={c.daytrippersTitle}
              description={c.daytrippersDescription}
              links={[{ label: c.daytrippersLinkLabel, href: "/day-trippers" }]}
              image={c.daytrippersImage.url || D.daytrippers_image_url}
              imageAlt={c.daytrippersImage.alt || D.daytrippers_image_alt}
            />
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
                href="/activities"
                image={c.learnMore1Image.url || D.learn_more_1_image}
                index={0}
              />
              <LinkCard
                title={c.learnMore2Title}
                href="/rates-dates-application-2026"
                image={c.learnMore2Image.url || D.learn_more_2_image}
                index={1}
              />
              <LinkCard
                title={c.learnMore3Title}
                href="/about-riverbend"
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
