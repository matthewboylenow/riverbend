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

export const metadata: Metadata = {
  title: "Day Trippers | Grades 7-9 | Camp Riverbend",
  description:
    "Day Trippers is an option for boys and girls currently in 6th – 8th grades. This program gives teens a safe and supportive environment for learning social skills and independence.",
};

export default function DayTrippersPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Day Trippers"
        subtitle="Adventure awaits for campers in grades 7-9"
        bgImage="/assets/site/ADV06446-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: "Day Trippers" },
        ]}
      />

      {/* Overview */}
      <Section id="overview" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                Grades 7-9
              </span>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
              Welcome to the Day Trippers!
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Children currently in 6th and 7th grades can participate in our in-camp program or Day Trippers, or a combination of both (pending availability).
            </p>
          </AnimateIn>
        </Container>
      </Section>

      {/* Program Details */}
      <Section id="program-details" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Day Trippers Program
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    The group takes day trips every day, traveling on a regular camp bus. For summer 2026, we&apos;re planning trips that include the Jersey shore, amusement parks, drone racing, water tubing, challenge courses, boating, river rafting, art-making, martial arts, and cooking classes.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Four days a week the Day Trippers return back to camp in time to go home on the regular bus or into the extended day program. One night a week is a late night; parents must come to camp around 5:30 pm for pick up.
                  </p>
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/site/Canoe.jpg"
                    alt="Day Trippers on an adventure"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Video */}
      <Section id="video" bg="cream" padding="sm">
        <Container size="narrow">
          <AnimateIn direction="up">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              See the Day Trippers Program in action
            </p>
            <VideoEmbed vimeoId="361308491" title="Day Trippers Program" />
          </AnimateIn>
        </Container>
      </Section>

      {/* Supervision */}
      <Section id="supervision" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/site/DSC06927-scaled.jpg"
                    alt="Day Trippers counselors with teen campers"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Supervision
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    The Day Trippers counselors are experienced, mature male and female teachers who work with and understand young teens.
                  </p>
                  <div>
                    <Button variant="primary" href={EXTERNAL_LINKS.camperApp} external>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* 2026 Day Trippers Calendar */}
      <Section id="trippers-calendar" bg="white">
        <Container size="narrow">
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              2026 Day Trippers Calendar
            </h2>
            <p className="text-center text-gray-700 mb-8">
              See where this summer&apos;s adventures will take us.
            </p>
            <a
              href="/assets/site/Day-Trippers-2026.png"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-stone/30 hover:shadow-md transition-shadow"
            >
              <Image
                src="/assets/site/Day-Trippers-2026.png"
                alt="Camp Riverbend 2026 Day Trippers calendar"
                width={1200}
                height={1500}
                className="w-full h-auto"
              />
            </a>
          </AnimateIn>
        </Container>
      </Section>

      {/* Learn More */}
      <Section id="learn-more" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Learn More
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LinkCard
                title="All Programs"
                href="/programs"
                image="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
                index={0}
              />
              <LinkCard
                title="Activities"
                href="/activities"
                image="/assets/site/ADV01169.jpg"
                index={1}
              />
              <LinkCard
                title="Rates & Dates"
                href="/rates-dates-application-2026"
                image="/assets/site/Canoe.jpg"
                index={2}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
