import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import { sanitizeHtml } from "@/lib/sanitize";
import { STAFF_DEFAULTS as D, type StaffRole } from "@/lib/page-defaults/staff";

export const metadata: Metadata = {
  title: "Join Our Staff | Camp Riverbend",
  description:
    "Interested in being a part of the Camp Riverbend family? Explore the various ways counselors make Camp Riverbend the best place to be for summer!",
};

const PAGE_SLUG = "staff";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("staff: page content load failed, using defaults:", err);
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

    video1Heading: t("video_1_heading", D.video_1_heading),
    video1Id: t("video_1_id", D.video_1_id),
    video2Heading: t("video_2_heading", D.video_2_heading),
    video2Id: t("video_2_id", D.video_2_id),

    whyHeading: t("why_heading", D.why_heading),
    whyHtml: r("why", D.why_html),

    rolesHeading: t("roles_heading", D.roles_heading),
    rolesIntro: t("roles_intro", D.roles_intro),
    roles: readBlock<{ rows: StaffRole[] }>(blocks, "roles", { rows: D.roles }).rows,

    logisticsHeading: t("logistics_heading", D.logistics_heading),
    logisticsHtml: r("logistics", D.logistics_html),

    ctaHeading: t("cta_heading", D.cta_heading),
    ctaButtonLabel: t("cta_button_label", D.cta_button_label),
    ctaPhoneMainLabel: t("cta_phone_main_label", D.cta_phone_main_label),
    ctaPhoneMainHref: t("cta_phone_main_href", D.cta_phone_main_href),
    ctaPhoneTextLabel: t("cta_phone_text_label", D.cta_phone_text_label),
    ctaPhoneTextHref: t("cta_phone_text_href", D.cta_phone_text_href),
  };
}

export default async function StaffPage({
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
          { label: "Staff" },
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

      {/* Section 2: Videos */}
      {(c.video1Id || c.video2Id) && (
        <Section id="videos" bg="cream" padding="default">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {c.video1Id && (
                <AnimateIn direction="left">
                  <div className="space-y-3">
                    <h3 className="font-camp text-center">{c.video1Heading}</h3>
                    <VideoEmbed vimeoId={c.video1Id} title={c.video1Heading} />
                  </div>
                </AnimateIn>
              )}
              {c.video2Id && (
                <AnimateIn direction="right">
                  <div className="space-y-3">
                    <h3 className="font-camp text-center">{c.video2Heading}</h3>
                    <VideoEmbed vimeoId={c.video2Id} title={c.video2Heading} />
                  </div>
                </AnimateIn>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Section 3: Why Camp Riverbend */}
      <Section id="why-riverbend" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">{c.whyHeading}</h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.whyHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Roles */}
      <Section id="roles" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.rolesHeading}</h2>
              <p className="text-body-lg text-bark leading-relaxed mt-4 max-w-2xl mx-auto">
                {c.rolesIntro}
              </p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {c.roles.map((role, index) => (
              <AnimateIn key={`${role.title}-${index}`} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-camp text-lg mb-3">{role.title}</h3>
                  <p className="text-bark leading-relaxed">{role.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 5: Dates & Logistics */}
      <Section id="logistics" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">{c.logisticsHeading}</h2>
              <div
                className="prose prose-lg max-w-none text-bark [&_p]:text-body-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.logisticsHtml) }}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 6: CTA */}
      <Section id="apply" bg="dark" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <h2 className="font-camp">{c.ctaHeading}</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="primary" href={EXTERNAL_LINKS.staffApp} external>
                  {c.ctaButtonLabel}
                </Button>
              </div>
              <p className="text-body text-white/80">
                Questions? Call{" "}
                <a href={c.ctaPhoneMainHref} className="font-semibold text-white hover:underline">
                  {c.ctaPhoneMainLabel}
                </a>{" "}
                or text{" "}
                <a href={c.ctaPhoneTextHref} className="font-semibold text-white hover:underline">
                  {c.ctaPhoneTextLabel}
                </a>
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
