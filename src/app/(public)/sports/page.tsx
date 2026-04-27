import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { LinkCard } from "@/components/ui/LinkCard";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sports | Camp Riverbend",
  description:
    "Explore the various sports activities of Camp Riverbend, a traditional summer day camp located along the gentle Passaic River in Warren Township, New Jersey.",
};

const sportsCards = [
  {
    name: "Basketball",
    image:
      "/assets/site/DSC07326-scaled.jpg",
  },
  {
    name: "Tennis",
    image:
      "/assets/site/DSC07389-scaled.jpg",
  },
  {
    name: "Baseball",
    image:
      "/assets/site/DSC07606-scaled.jpg",
  },
  {
    name: "Gaga",
    image:
      "/assets/site/MEC_9087-scaled.jpg",
  },
  {
    name: "Soccer",
    image:
      "/assets/site/DSC07242-scaled.jpg",
  },
  {
    name: "Field Sports",
    image:
      "/assets/site/DSC07236-scaled.jpg",
  },
  {
    name: "Archery",
    image:
      "/assets/site/DSC07032-scaled.jpg",
  },
  {
    name: "Yoga",
    image:
      "/assets/site/DSC07402-scaled.jpg",
    description:
      "Campers learn the ancient techniques of yoga under the watchful eyes of an experienced instructor. Yoga provides opportunities for developing fitness, coordination and strength.",
  },
  {
    name: "Volleyball",
    image: "/assets/site/Volleyball-Riverbend.jpg",
    description:
      "Our volleyball court is the perfect spot for a great game of volleyball or newcomb.",
  },
];

export default function SportsPage() {
  return (
    <InnerPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Sports at Riverbend"
        subtitle="Building skills, sportsmanship, and team cooperation"
        bgImage="/assets/site/DSC07565-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Activities", href: "/activities" },
          { label: "Sports" },
        ]}
      />

      {/* Section 1: Intro */}
      <Section id="intro" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                At Camp Riverbend our campers enjoy a complete sports program
                that emphasizes learning new skills, sportsmanship and team
                cooperation. Our sports programs help campers discover new
                abilities and gain a sense of achievement and success in
                whatever they try. Coaches oversee and instruct sports
                activities in camp.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Sports Grid */}
      <Section id="sports-grid" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sportsCards.map((sport, index) => (
              <AnimateIn key={sport.name} delay={index * 0.1}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-camp text-lg">{sport.name}</h3>
                  {sport.description && (
                    <p className="text-sm text-bark leading-relaxed mt-2">
                      {sport.description}
                    </p>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: Sports Video */}
      <Section id="sports-video" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <VideoEmbed vimeoId="382945475" title="Sports at Camp Riverbend" />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Learn More */}
      <Section bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Learn More</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <LinkCard
              title="Activities"
              href="/activities"
              image="/assets/site/ADV01169.jpg"
              index={0}
            />
            <LinkCard
              title="Our Programs"
              href="/programs"
              image="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
              index={1}
            />
            <LinkCard
              title="Rates & Dates"
              href="/rates-dates-application-2026"
              image="/assets/site/Canoe.jpg"
              index={2}
            />
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
