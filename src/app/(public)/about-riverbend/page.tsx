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
import { TreeLine } from "@/components/illustrations/TreeLine";
import { MountainRange } from "@/components/illustrations/MountainRange";
import { Campfire } from "@/components/illustrations/Campfire";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { ABOUT_DEFAULTS as D } from "@/lib/page-defaults/about-riverbend";

export const metadata: Metadata = {
  title: "About Camp Riverbend | Legacy & Tradition Since 1962",
  description:
    "Founded in 1962 by the Breene family, Camp Riverbend in Warren, NJ has hosted generations of families. ACA accredited since season one.",
};

const PAGE_SLUG = "about-riverbend";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("about-riverbend: page content load failed, using defaults:", err);
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

    legacyHeading: t("legacy_heading", D.legacy_heading),
    legacyHtml: r("legacy", D.legacy_html),
    legacyVideoId: t("legacy_video_id", D.legacy_video_id),

    philosophyCaption: t("philosophy_caption", D.philosophy_caption),
    philosophyHeadingHtml: r("philosophy_heading", D.philosophy_heading_html),
    philosophyHtml: r("philosophy", D.philosophy_html),
    philosophyImage: i(
      "philosophy_image",
      D.philosophy_image_url,
      D.philosophy_image_alt
    ),

    locationCaption: t("location_caption", D.location_caption),
    locationHeading: t("location_heading", D.location_heading),
    locationHtml: r("location", D.location_html),
    locationPhone: t("location_phone", D.location_phone),
    locationPhoneHref: t("location_phone_href", D.location_phone_href),
    locationEmail: t("location_email", D.location_email),
    locationMap: i("location_map", D.location_map_url, D.location_map_alt),

    staffPullquote: t("staff_pullquote", D.staff_pullquote),
    staffHtml: r("staff", D.staff_html),
    staffVideoId: t("staff_video_id", D.staff_video_id),

    learnMore1Title: t("learn_more_1_title", D.learn_more_card_1_title),
    learnMore1Image: i("learn_more_1_image", D.learn_more_card_1_image),
    learnMore2Title: t("learn_more_2_title", D.learn_more_card_2_title),
    learnMore2Image: i("learn_more_2_image", D.learn_more_card_2_image),
    learnMore3Title: t("learn_more_3_title", D.learn_more_card_3_title),
    learnMore3Image: i("learn_more_3_image", D.learn_more_card_3_image),
  };
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);

  return (
    <InnerPageLayout>
      {/* Page Header */}
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Riverbend" },
        ]}
      />

      {/* Section 1: Legacy (id="legacy") */}
      <Section id="legacy" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">{c.legacyHeading}</h2>
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.legacyHtml) }}
              />
            </div>
          </AnimateIn>

          {/* Video */}
          {c.legacyVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-12">
                <p className="text-center text-sm font-semibold text-bark mb-4 tracking-wide uppercase">
                  Watch the video to learn more
                </p>
                <VideoEmbed vimeoId={c.legacyVideoId} title="Camp Riverbend Legacy" />
              </div>
            </AnimateIn>
          )}

          <AnimateIn delay={0.3}>
            <div className="mt-10 text-center">
              <Button variant="primary" href="/breene-family">
                Meet our Directors &amp; Senior Staff
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Illustration: TreeLine between Legacy and Philosophy */}
      <div className="py-8 bg-cream">
        <TreeLine />
      </div>

      {/* Section 2: Our Philosophy (id="philosophy") */}
      <Section id="philosophy" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <span className="text-caption text-camp-red tracking-widest">
                  {c.philosophyCaption}
                </span>
                <div
                  className="font-camp text-3xl lg:text-4xl text-charcoal [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.philosophyHeadingHtml) }}
                />
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.philosophyHtml) }}
                />
              </div>
            </AnimateIn>

            {/* Image */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.philosophyImage.url || D.philosophy_image_url}
                  alt={c.philosophyImage.alt || D.philosophy_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 3: Camp Map & Location (id="facilities-location") */}
      <Section id="facilities-location" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <span className="text-caption text-camp-red tracking-widest">
                  {c.locationCaption}
                </span>
                <h2 className="font-camp">{c.locationHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.locationHtml) }}
                />
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="primary" href={EXTERNAL_LINKS.inquiryForm} external>
                    Book a Tour
                  </Button>
                  <Button variant="secondary" href={EXTERNAL_LINKS.inquiryForm} external>
                    Request More Info
                  </Button>
                </div>
                <div className="pt-4 text-sm text-bark space-y-1">
                  <p className="font-semibold">Call or email us to book a tour</p>
                  <p>
                    <a href={c.locationPhoneHref} className="text-camp-red hover:underline">
                      {c.locationPhone}
                    </a>
                    {" · "}
                    <a
                      href={`mailto:${c.locationEmail}`}
                      className="text-camp-red hover:underline"
                    >
                      {c.locationEmail}
                    </a>
                  </p>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg bg-sand">
                  <Image
                    src={c.locationMap.url || D.location_map_url}
                    alt={c.locationMap.alt || D.location_map_alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="primary" href="/camp-map">
                    Explore Interactive Map
                  </Button>
                  <a
                    href={c.locationMap.url || D.location_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-camp-red hover:underline"
                  >
                    Download Camp Map →
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Illustration: MountainRange below map */}
      <div className="py-8 bg-cream">
        <MountainRange />
      </div>

      {/* Section 4: Our Staff (id="staff") */}
      <Section id="staff" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <p className="pull-quote text-center border-none pl-0">
                {c.staffPullquote}
              </p>
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.staffHtml) }}
              />
            </div>
          </AnimateIn>

          {/* Staff video */}
          {c.staffVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-12">
                <p className="text-center text-sm font-semibold text-bark mb-4 tracking-wide uppercase">
                  Watch the video to learn more
                </p>
                <VideoEmbed vimeoId={c.staffVideoId} title="Camp Riverbend Staff" />
              </div>
            </AnimateIn>
          )}

          <AnimateIn delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button variant="primary" href={EXTERNAL_LINKS.staffApp} external>
                Apply to Join Our Staff
              </Button>
              <Button variant="secondary" href="/breene-family">
                Meet our Directors &amp; Senior Staff
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Illustration: Campfire between Staff and Learn More */}
      <div className="py-10 bg-white">
        <Campfire />
      </div>

      {/* Section 5: Learn More Links */}
      <Section bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Learn More</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <LinkCard
              title={c.learnMore1Title}
              href="/activities"
              image={c.learnMore1Image.url || D.learn_more_card_1_image}
              index={0}
            />
            <LinkCard
              title={c.learnMore2Title}
              href="/rates-dates-application-2026"
              image={c.learnMore2Image.url || D.learn_more_card_2_image}
              index={1}
            />
            <LinkCard
              title={c.learnMore3Title}
              href="/programs"
              image={c.learnMore3Image.url || D.learn_more_card_3_image}
              index={2}
            />
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
