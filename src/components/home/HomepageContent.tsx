"use client";

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import { Hero } from "./Hero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { LinkCard } from "@/components/ui/LinkCard";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { CTAStrip } from "@/components/ui/CTAStrip";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { TreeLine } from "@/components/illustrations/TreeLine";
import { CanoeRiver } from "@/components/illustrations/CanoeRiver";
import { SunRays } from "@/components/illustrations/SunRays";
import { Campfire } from "@/components/illustrations/Campfire";

const gridCards = [
  {
    title: "Our Programs",
    href: "/programs",
    image: "/images/ADV06620.jpg-marketing-scaled.jpg",
  },
  {
    title: "Rates, Dates & Application 2026",
    href: "/rates-dates-application-2026",
    image: "/images/Canoe.jpg",
  },
  {
    title: "Legacy & Tradition",
    href: "/about-riverbend",
    image: "/images/ADV07104-scaled.jpg",
  },
  {
    title: "Activities",
    href: "/activities",
    image: "/images/ADV01169.jpg",
  },
  {
    title: "Transportation",
    href: "/transportation",
    image: "/images/DSC06927-scaled.jpg",
  },
  {
    title: "Lunch & Snacks",
    href: "/lunch",
    image: "/images/IMG_370.jpg",
  },
  {
    title: "Health & Safety",
    href: "/health-safety",
    image: "/images/ADV06446-scaled.jpg",
  },
  {
    title: "Video Library",
    href: "/videos",
    image: "/images/ADV07400.jpg-marketing-scaled.jpg",
  },
];

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
    image: "/images/ADV06620.jpg-marketing-scaled.jpg",
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
    image: "/images/ADV07104-scaled.jpg",
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
    image: "/images/ADV01169.jpg",
    imageAlt: "Day Trippers on an outdoor adventure",
    reversed: false,
  },
];

export function HomepageContent() {
  return (
    <>
      {/* Announcement bar */}
      <AnnouncementBar
        message="Registration for Summer 2026 Now Open!"
        href="/rates-dates-application-2026"
        linkText="Apply Now"
      />

      {/* Transparent nav for hero */}
      <Navbar transparent />

      <main id="main-content">
        {/* Hero */}
        <Hero />

        {/* Illustration: TreeLine between Hero and Card Grid */}
        <div className="py-8 bg-cream">
          <TreeLine />
        </div>

        {/* Section 2: Card Grid */}
        <Section bg="cream" padding="default">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {gridCards.map((card, i) => (
                <LinkCard
                  key={card.href}
                  title={card.title}
                  href={card.href}
                  image={card.image}
                  index={i}
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Illustration: CanoeRiver between Card Grid and Programs */}
        <div className="py-4 bg-white">
          <CanoeRiver />
        </div>

        {/* Section 3: Program Detail Blocks */}
        <Section bg="white" padding="default">
          <Container>
            <AnimateIn>
              <div className="text-center mb-16">
                <span className="text-caption text-camp-red tracking-widest">
                  Discover
                </span>
                <h2 className="font-camp mt-2">Our Programs</h2>
              </div>
            </AnimateIn>

            <div className="space-y-20 lg:space-y-28">
              {programs.map((program, i) => (
                <div key={program.title}>
                  <ProgramCard {...program} />
                  {i === 0 && (
                    <div className="flex justify-end mt-16 mr-8">
                      <SunRays />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Illustration: Campfire above CTA */}
        <div className="py-10 bg-white">
          <Campfire />
        </div>

        {/* Section 4: CTA Strip */}
        <CTAStrip variant="red" />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
