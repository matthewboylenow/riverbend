import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { LUNCH_DEFAULTS as D } from "@/lib/page-defaults/lunch";

export const metadata: Metadata = {
  title: "Lunch & Snacks | Camp Riverbend",
  description:
    "Camp Riverbend's allergy-aware kitchen provides lunch daily with the perfect combination of kid favorites and healthy choices.",
};

const PAGE_SLUG = "lunch";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("lunch: page content load failed, using defaults:", err);
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
  const doc = (key: string, fallbackUrl: string, fallbackLabel: string) =>
    readBlock<{ url: string; label?: string }>(blocks, key, {
      url: fallbackUrl,
      label: fallbackLabel,
    });

  return {
    heroTitle: t("hero_title", D.hero_title),
    heroSubtitle: t("hero_subtitle", D.hero_subtitle),
    heroBg: i("hero_bg", D.hero_bg_url, D.hero_bg_alt),

    menuHeading: t("menu_heading", D.menu_heading),
    menuIntro: t("menu_intro", D.menu_intro),
    menuDoc: doc("menu_doc", D.menu_url, D.menu_label),

    overviewHeading: t("overview_heading", D.overview_heading),
    overviewHtml: r("overview", D.overview_html),
    overviewImage: i(
      "overview_image",
      D.overview_image_url,
      D.overview_image_alt
    ),

    snackShackHeading: t("snack_shack_heading", D.snack_shack_heading),
    snackShackHtml: r("snack_shack", D.snack_shack_html),

    allergyHeading: t("allergy_heading", D.allergy_heading),
    allergyHtml: r("allergy", D.allergy_html),

    videoId: t("video_id", D.video_id),
    videoTitle: t("video_title", D.video_title),
  };
}

export default async function LunchPage({
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
          { label: "Lunch" },
        ]}
      />

      {/* Lunch Menu PDF button — only shown once a menu PDF is uploaded */}
      {c.menuDoc.url && (
        <Section id="lunch-menu" bg="white" padding="default">
          <Container size="narrow">
            <AnimateIn>
              <div className="bg-cream border border-camp-red/20 rounded-3xl shadow-sm px-6 py-8 sm:px-10 sm:py-10 text-center space-y-4">
                <h2 className="font-camp">{c.menuHeading}</h2>
                {c.menuIntro && (
                  <p className="text-body-lg leading-relaxed text-bark max-w-2xl mx-auto">
                    {c.menuIntro}
                  </p>
                )}
                <div className="pt-2">
                  <Button href={c.menuDoc.url} external size="lg">
                    <FileText className="h-5 w-5" />
                    {c.menuDoc.label || D.menu_label}
                  </Button>
                </div>
              </div>
            </AnimateIn>
          </Container>
        </Section>
      )}

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">{c.overviewHeading}</h2>
                <div
                  className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.overviewHtml) }}
                />
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={c.overviewImage.url || D.overview_image_url}
                  alt={c.overviewImage.alt || D.overview_image_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 2: Snack Shack */}
      <Section id="snack-shack" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp">{c.snackShackHeading}</h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.snackShackHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Allergy Info */}
      <Section id="allergy-info" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="bg-white border-l-4 border-camp-red p-6 rounded-xl shadow-sm">
              <h2 className="font-camp text-2xl mb-4">{c.allergyHeading}</h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.allergyHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Video */}
      {c.videoId && (
        <Section id="lunch-video" bg="white" padding="default">
          <Container>
            <AnimateIn>
              <VideoEmbed vimeoId={c.videoId} title={c.videoTitle} />
            </AnimateIn>
          </Container>
        </Section>
      )}
    </InnerPageLayout>
  );
}
