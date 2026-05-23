import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { LinkCard } from "@/components/ui/LinkCard";
import Image from "next/image";
import { Fragment } from "react";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { loadOrderedSectionKeys } from "@/lib/page-section-layout";
import { ACTIVITIES_SCHEMA } from "@/lib/page-schemas/activities";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  ACTIVITIES_DEFAULTS as D,
  type ActivityCard,
  type NinjaElement,
} from "@/lib/page-defaults/activities";

export const metadata: Metadata = {
  title: "Activities | Camp Riverbend",
  description:
    "Located along the gentle Passaic River in Warren Township, New Jersey, Camp Riverbend has shady woods, open fields, nature trails, a wetlands sanctuary and a variety of athletic fields.",
};

const PAGE_SLUG = "activities";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("activities: page content load failed, using defaults:", err);
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

    swimmingHeading: t("swimming_heading", D.swimming_heading),
    swimmingHtml: r("swimming", D.swimming_html),
    swimmingImage: i("swimming_image", D.swimming_image_url, D.swimming_image_alt),
    swimmingVideoId: t("swimming_video_id", D.swimming_video_id),

    sportsHeading: t("sports_heading", D.sports_heading),
    sportsHtml: r("sports", D.sports_html),
    sportsImage: i("sports_image", D.sports_image_url, D.sports_image_alt),
    sportsButtonLabel: t("sports_button_label", D.sports_button_label),
    sportsVideoId: t("sports_video_id", D.sports_video_id),

    moreActivitiesHeading: t("more_activities_heading", D.more_activities_heading),
    activityCards: readBlock<{ rows: ActivityCard[] }>(blocks, "activity_cards", {
      rows: D.activity_cards,
    }).rows,
    adventureVideoId: t("adventure_video_id", D.adventure_video_id),

    ninjaHeading: t("ninja_heading", D.ninja_heading),
    ninjaIntro: t("ninja_intro", D.ninja_intro),
    ninjaElements: readBlock<{ rows: NinjaElement[] }>(blocks, "ninja_elements", {
      rows: D.ninja_elements,
    }).rows,

    performingHeading: t("performing_heading", D.performing_heading),
    performingHtml: r("performing", D.performing_html),
    choiceHeading: t("choice_heading", D.choice_heading),
    choiceHtml: r("choice", D.choice_html),

    indoorHeading: t("indoor_heading", D.indoor_heading),
    indoorHtml: r("indoor", D.indoor_html),

    learnMoreHeading: t("learn_more_heading", D.learn_more_heading),
    learnMore1Title: t("learn_more_1_title", D.learn_more_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_3_image),
  };
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);
  const orderedKeys = await loadOrderedSectionKeys(ACTIVITIES_SCHEMA);

  // Each editable section is rendered into a map keyed by its schema
  // section key, so we can both reorder them via the admin layout and
  // skip the ones the admin has hidden. The Page Header is rendered
  // separately above this map — it always stays pinned at the top.
  const renderedByKey: Record<string, React.ReactNode> = {
    intro: (
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
    ),
    swimming: (
      <Section id="swimming" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">{c.swimmingHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.swimmingHtml) }}
                />
              </div>
            </AnimateIn>
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.swimmingImage.url || D.swimming_image_url}
                  alt={c.swimmingImage.alt || D.swimming_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>

          {c.swimmingVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-12">
                <VideoEmbed vimeoId={c.swimmingVideoId} title={D.swimming_video_title} />
              </div>
            </AnimateIn>
          )}
        </Container>
      </Section>
    ),
    sports: (
      <Section id="sports" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimateIn direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.sportsImage.url || D.sports_image_url}
                  alt={c.sportsImage.alt || D.sports_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="space-y-6">
                <h2 className="font-camp">{c.sportsHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.sportsHtml) }}
                />
                <Button variant="primary" href="/sports">
                  {c.sportsButtonLabel}
                </Button>
              </div>
            </AnimateIn>
          </div>

          {c.sportsVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-12">
                <VideoEmbed vimeoId={c.sportsVideoId} title={D.sports_video_title} />
              </div>
            </AnimateIn>
          )}
        </Container>
      </Section>
    ),
    "more-activities": (
      <Section id="more-activities" bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.moreActivitiesHeading}</h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.activityCards
              .filter((a) => a.name && a.image)
              .map((activity, index) => (
                <AnimateIn key={`${activity.name}-${index}`} delay={index * 0.1}>
                  <div className="group">
                    <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3 className="font-camp text-lg">{activity.name}</h3>
                  </div>
                </AnimateIn>
              ))}
          </div>

          {c.adventureVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-12">
                <VideoEmbed vimeoId={c.adventureVideoId} title={D.adventure_video_title} />
              </div>
            </AnimateIn>
          )}
        </Container>
      </Section>
    ),
    ninja: (
      <Section id="ninja-course" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">{c.ninjaHeading}</h2>
              <p className="text-body-lg text-bark leading-relaxed">{c.ninjaIntro}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {c.ninjaElements.map((element, idx) => (
                  <span
                    key={`${element.label}-${idx}`}
                    className="inline-block bg-white border border-sand rounded-full px-4 py-2 text-sm font-semibold text-bark shadow-sm"
                  >
                    {element.label}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ),
    "performing-arts": (
      <Section id="performing-arts" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">{c.performingHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.performingHtml) }}
                />
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="space-y-6">
                <h2 className="font-camp">{c.choiceHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.choiceHtml) }}
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>
    ),
    "indoor-facilities": (
      <Section id="indoor-facilities" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">{c.indoorHeading}</h2>
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.indoorHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    ),
    "learn-more": (
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
              href="/programs"
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
              href="/sports"
              image={c.learnMore3Image.url || D.learn_more_3_image}
              index={2}
            />
          </div>
        </Container>
      </Section>
    ),
  };

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Activities" },
        ]}
      />
      {orderedKeys.map((k) => (
        <Fragment key={k}>{renderedByKey[k]}</Fragment>
      ))}
    </InnerPageLayout>
  );
}
