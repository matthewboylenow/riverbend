"use client";

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import { Hero } from "./Hero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { CTAStrip } from "@/components/ui/CTAStrip";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { BentoGrid } from "@/components/home/BentoGrid";
import { EXTERNAL_LINKS, type NavGroup } from "@/lib/navigation";
import { Button } from "@/components/ui/Button";
import { sanitizeHtml } from "@/lib/sanitize";
import type { HomeContent } from "@/lib/home-content";
import { HOME_KEYS as K } from "@/lib/page-schemas/home";

export function HomepageContent({
  navGroups,
  content,
  visibleSections,
}: {
  navGroups?: NavGroup[];
  content: HomeContent;
  /**
   * Visible section keys in saved order (hero excluded — it's pinned).
   * Omitted (e.g. previews without a layout) = everything visible.
   */
  visibleSections?: string[];
}) {
  const show = (key: string) => !visibleSections || visibleSections.includes(key);

  // 2027 promo card: hidden via eye toggle, top when dragged above the
  // other Bento Grid sections, bottom row otherwise.
  const bentoOrder = (visibleSections ?? []).filter((k) => k.startsWith("bento-grid-"));
  const promoPosition: "top" | "bottom" | "hidden" = !show(K.card11)
    ? "hidden"
    : bentoOrder.length > 0 && bentoOrder[0] === K.card11
      ? "top"
      : "bottom";

  const hiddenTiles = (
    [
      [K.card0, "card0"],
      [K.card1, "card1"],
      [K.countdown, "countdown"],
      [K.stat, "stat"],
      [K.card4, "card4"],
      [K.card5, "card5"],
      [K.card6, "card6"],
      [K.card7, "card7"],
      [K.card8, "card8"],
      [K.card9, "card9"],
      [K.card10, "card10"],
    ] as const
  )
    .filter(([key]) => !show(key))
    .map(([, tile]) => tile);
  return (
    <>
      {/* Nav */}
      <Navbar navGroups={navGroups} />

      <main id="main-content" className="relative z-0">
        {/* Hero */}
        <Hero content={content.hero} />

        {/* Announcement bar — red bar below video */}
        {show(K.announcement) && (
          <AnnouncementBar
            message={content.announcement.message}
            href={content.announcement.linkHref}
            linkText={content.announcement.linkText}
          />
        )}

        {/* Section 2: Bento Grid */}
        <Section bg="cream" padding="default">
          <Container size="wide">
            <BentoGrid
              content={content.bento}
              promoPosition={promoPosition}
              hiddenTiles={hiddenTiles}
            />
          </Container>
        </Section>

        {/* Section 3: Big statement / philosophy */}
        {show(K.philosophy) && (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-charcoal">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <Container size="narrow">
            <AnimateIn>
              <div className="text-center space-y-8">
                <span className="text-caption text-white/50 tracking-widest">
                  {content.philosophy.caption}
                </span>
                <div
                  className="font-camp text-white text-4xl sm:text-5xl [&_p]:m-0 [&_em]:text-white/70 [&_em]:not-italic"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(content.philosophy.headingHtml),
                  }}
                />
                <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
                  {content.philosophy.body}
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="primary" size="lg" href={content.philosophy.storyHref}>
                    {content.philosophy.storyLabel}
                  </Button>
                  <Button
                    variant="white"
                    size="lg"
                    href={EXTERNAL_LINKS.inquiryForm}
                    external
                  >
                    {content.philosophy.tourLabel}
                  </Button>
                </div>
              </div>
            </AnimateIn>
          </Container>
        </section>
        )}

        {/* Section 4: Program Detail Blocks */}
        <Section bg="white" padding="default">
          <Container>
            {show(K.programsHeading) && (
              <AnimateIn>
                <div className="text-center mb-16">
                  <span className="text-caption text-camp-red tracking-widest">
                    {content.programsCaption}
                  </span>
                  <h2 className="font-camp mt-2">{content.programsHeading}</h2>
                </div>
              </AnimateIn>
            )}

            <div className="space-y-20 lg:space-y-28">
              {content.programs
                .filter((_, i) => show([K.program1, K.program2, K.program3][i] ?? ""))
                .map((program, idx) => (
                  <ProgramCard
                    key={program.title}
                    badge={program.badge}
                    title={program.title}
                    description={htmlToPlain(program.description)}
                    links={[
                      { label: program.link1Label, href: program.link1Href },
                      { label: program.link2Label, href: program.link2Href },
                    ]}
                    image={program.imageUrl}
                    imageAlt={program.imageAlt}
                    reversed={idx % 2 === 1}
                  />
                ))}
            </div>
          </Container>
        </Section>

        {/* Section 5: CTA Strip */}
        <CTAStrip variant="red" />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

// ProgramCard expects a plain string description; admins author it as
// richtext for formatting flexibility. Strip tags + decode common entities.
function htmlToPlain(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/g, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "’")
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .trim();
}
