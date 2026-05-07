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

const programs = [
  {
    badge: "Pre-K3 to Kindergarten",
    title: "The Clubhouse",
    description:
      "The Clubhouse is a wonderful introduction to the summer camp experience for campers aged three, four and five years old. They are introduced to arts and crafts, sports, cooking, nature, swimming and other fun activities geared to their age and ability that encourage growth, confidence and learning. Clubhouse campers also have the option of coming three, four or five days a week.",
    links: [
      { label: "Learn About The Clubhouse", href: "/clubhouse" },
      { label: "A Day in the Life", href: "/clubhouse#video" },
    ],
    image: "/assets/site/DSC_0553-scaled.jpg",
    imageAlt: "Young campers enjoying activities at The Clubhouse",
    reversed: false,
  },
  {
    badge: "Grades 1 to 8",
    title: "Riverbend Experience",
    description:
      "Campers entering 1st through 8th grades explore, grow and gain confidence! During the day, each group rotates through seven different activities and has many new experiences. There are days packed full of fabulous activities and fun for kids; this is the place to make new friends and life-long memories!",
    links: [
      { label: "Learn About Riverbend Experience", href: "/riverbend-experience" },
      { label: "A Day in the Life", href: "/riverbend-experience#video" },
    ],
    image: "/assets/site/DSC07006-scaled.jpg",
    imageAlt: "Kids exploring and playing at Riverbend Experience",
    reversed: true,
  },
  {
    badge: "Grades 7 to 9",
    title: "Day Trippers",
    description:
      "The Day Trippers program takes young teens out of camp and on the road for day trips and short overnight trips in our region. You\u2019ll find us down at the beach and up in the mountains. We\u2019ll be boating, cooking, climbing, seeing the sights and exploring the world!",
    links: [
      { label: "Learn About The Day Trippers", href: "/day-trippers" },
      { label: "A Day in the Life", href: "/day-trippers#video" },
    ],
    image: "/assets/site/IMG_1650-scaled.jpg",
    imageAlt: "Day Trippers on an outdoor adventure",
    reversed: false,
  },
];

export function HomepageContent({ navGroups }: { navGroups?: NavGroup[] } = {}) {
  return (
    <>
      {/* Nav */}
      <Navbar navGroups={navGroups} />

      <main id="main-content" className="relative z-0">
        {/* Hero */}
        <Hero />

        {/* Announcement bar — red bar below video */}
        <AnnouncementBar
          message="Now accepting applications for 2026 season — Limited spaces still available"
          href="/rates-dates-application-2026"
          linkText="Apply Now"
        />

        {/* Section 2: Bento Grid */}
        <Section bg="cream" padding="default">
          <Container size="wide">
            <BentoGrid />
          </Container>
        </Section>

        {/* Section 3: Big statement / philosophy */}
        <section className="relative py-24 sm:py-32 overflow-hidden bg-charcoal">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <Container size="narrow">
            <AnimateIn>
              <div className="text-center space-y-8">
                <span className="text-caption text-white/50 tracking-widest">
                  Our Philosophy
                </span>
                <h2 className="font-camp text-white">
                  &ldquo;Confidence,{" "}
                  <span className="text-white/70 italic">not</span>{" "}
                  Competition&rdquo;
                </h2>
                <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
                  We honor each camper&apos;s talents and efforts. Camp Riverbend is a
                  place where each child can be themself, explore the world and learn new
                  skills in a fun and supportive environment.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="primary" size="lg" href="/about-riverbend">
                    Our Story
                  </Button>
                  <Button
                    variant="white"
                    size="lg"
                    href={EXTERNAL_LINKS.inquiryForm}
                    external
                  >
                    Book a Tour
                  </Button>
                </div>
              </div>
            </AnimateIn>
          </Container>
        </section>

        {/* Section 4: Program Detail Blocks */}
        <Section bg="white" padding="default">
          <Container>
            <AnimateIn>
              <div className="text-center mb-16">
                <span className="text-caption text-camp-red tracking-widest">
                  Ages 3 to 14
                </span>
                <h2 className="font-camp mt-2">Our Programs</h2>
              </div>
            </AnimateIn>

            <div className="space-y-20 lg:space-y-28">
              {programs.map((program) => (
                <ProgramCard key={program.title} {...program} />
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
