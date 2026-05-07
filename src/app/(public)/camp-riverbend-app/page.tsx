import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  CAMP_RIVERBEND_APP_DEFAULTS as D,
  type FeatureRow,
} from "@/lib/page-defaults/camp-riverbend-app";

export const metadata: Metadata = {
  title: "Camp Riverbend App | Camp Riverbend",
  description:
    "Stay connected with Camp Riverbend via our mobile app. See photos, get notifications, and connect to your parent portal.",
};

const PAGE_SLUG = "camp-riverbend-app";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("camp-riverbend-app: page content load failed, using defaults:", err);
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

    downloadHeading: t("download_heading", D.download_heading),
    downloadHtml: r("download", D.download_html),
    appStoreUrl: t("app_store_url", D.app_store_url),
    appStoreBadge: i("app_store_badge", D.app_store_badge_url, "Download on the App Store"),
    googlePlayUrl: t("google_play_url", D.google_play_url),
    googlePlayBadge: i("google_play_badge", D.google_play_badge_url, "Get it on Google Play"),

    featuresHeading: t("features_heading", D.features_heading),
    features: readBlock<{ rows: FeatureRow[] }>(blocks, "features", {
      rows: D.features,
    }).rows,
  };
}

export default async function CampAppPage({
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
          { label: "Camp App" },
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

      {/* Section 2: How to Get It */}
      <Section id="download" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">{c.downloadHeading}</h2>
              <div
                className="prose prose-lg max-w-none mx-auto text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0 [&_a]:text-camp-red [&_a]:font-semibold [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.downloadHtml) }}
              />
              <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
                {c.appStoreUrl && (
                  <a href={c.appStoreUrl} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.appStoreBadge.url || D.app_store_badge_url}
                      alt={c.appStoreBadge.alt || "Download on the App Store"}
                      className="max-h-12 w-auto"
                    />
                  </a>
                )}
                {c.googlePlayUrl && (
                  <a href={c.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.googlePlayBadge.url || D.google_play_badge_url}
                      alt={c.googlePlayBadge.alt || "Get it on Google Play"}
                      className="max-h-12 w-auto"
                    />
                  </a>
                )}
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Features */}
      <Section id="features" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.featuresHeading}</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.features.map((feature, index) => (
              <AnimateIn key={`${feature.title}-${index}`} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-camp text-lg mb-3">{feature.title}</h3>
                  <p className="text-bark leading-relaxed">{feature.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
