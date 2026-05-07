import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import Image from "next/image";
import { getPageContent, readBlock } from "@/lib/page-content";
import { loadContentMode } from "@/lib/preview-mode";
import {
  CALENDAR_DEFAULTS as D,
  type KeyDateRow,
} from "@/lib/page-defaults/calendar";

export const metadata: Metadata = {
  title: "2026 Summer Calendar | Camp Riverbend",
  description:
    "View the summer calendar of events and important dates for Camp Riverbend's 2026 season.",
};

const PAGE_SLUG = "calendar";

async function loadContent(mode: "published" | "draft") {
  let blocks = {};
  try {
    blocks = await getPageContent(PAGE_SLUG, mode);
  } catch (err) {
    console.error("calendar: page content load failed, using defaults:", err);
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

    calendarImage: i(
      "calendar_image",
      D.calendar_image_url,
      D.calendar_image_alt
    ),

    keyDatesHeading: t("key_dates_heading", D.key_dates_heading),
    keyDates: readBlock<{ rows: KeyDateRow[] }>(blocks, "key_dates", {
      rows: D.key_dates,
    }).rows,

    carnivalHeading: t("carnival_heading", D.carnival_heading),
    carnivalVideoId: t("carnival_video_id", D.carnival_video_id),
  };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const c = await loadContent(mode);

  const calendarImageUrl = c.calendarImage.url || D.calendar_image_url;
  const calendarImageAlt = c.calendarImage.alt || D.calendar_image_alt;

  return (
    <InnerPageLayout>
      <PageHeader
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        bgImage={c.heroBg.url || D.hero_bg_url}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calendar" },
        ]}
      />

      {/* Section 1: Calendar Image */}
      <Section id="calendar-image" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="relative aspect-[3/4] max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={calendarImageUrl}
                alt={calendarImageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={calendarImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-camp-red hover:underline"
              >
                View full size →
              </a>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Key Dates */}
      <Section id="key-dates" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">{c.keyDatesHeading}</h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="space-y-6">
              {c.keyDates.map((d, idx) => (
                <div key={`${d.date}-${idx}`} className="flex gap-6 items-start">
                  <div className="font-camp text-camp-red whitespace-nowrap min-w-[140px] text-right">
                    {d.date}
                  </div>
                  <div className="text-bark">{d.event}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Carnival Video */}
      <Section id="carnival" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">{c.carnivalHeading}</h2>
            </div>
          </AnimateIn>
          {c.carnivalVideoId && (
            <AnimateIn delay={0.2}>
              <div className="mt-8">
                <VideoEmbed
                  vimeoId={c.carnivalVideoId}
                  title="Carnival & Special Days"
                />
              </div>
            </AnimateIn>
          )}
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
