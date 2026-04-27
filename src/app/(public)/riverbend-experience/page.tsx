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
  title: "Riverbend Experience | Grades 1-8 | Camp Riverbend",
  description:
    "Campers entering 1st through 8th grades explore, grow and gain confidence! During the day, each group rotates through seven different activities and has many new experiences.",
};

export default function RiverbendExperiencePage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Riverbend Experience"
        subtitle="Where campers in grades 1-8 explore, grow, and gain confidence"
        bgImage="/assets/site/ADV07104-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: "Riverbend Experience" },
        ]}
      />

      {/* Overview */}
      <Section id="overview" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                Grades 1-8
              </span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              During the day, each group rotates through eight age-appropriate activities including team sports, arts &amp; crafts, swimming, outdoor adventures like high-ropes, zipline, canoeing, and much more! Campers can explore their favorite activities at midday clubs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Campers entering 4th &amp; 5th grades choose their own afternoon schedules twice a week in our tracking program. Campers entering 6th, 7th and 8th grades choose their own individualized afternoon schedules three times a week with &ldquo;SuperChoice.&rdquo;
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Swimming is an important part of each day at Riverbend, with group instruction each morning and a &ldquo;free&rdquo; swim in the afternoon.
            </p>
          </AnimateIn>
        </Container>
      </Section>

      {/* Video */}
      <Section id="video" bg="cream" padding="sm">
        <Container size="narrow">
          <AnimateIn direction="up">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              See the Riverbend Experience in action
            </p>
            <VideoEmbed vimeoId="361309028" title="Riverbend Experience" />
          </AnimateIn>
        </Container>
      </Section>

      {/* A Typical Day */}
      <Section id="typical-day" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    A Typical Day
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Each day begins and ends with a camp-wide assembly where our Camp Directors lead everyone in traditional and new camp songs.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Campers spend the day in all-boy or all-girl groups (8th grade group is co-ed) with others in the same grade.
                  </p>
                </div>
              </AnimateIn>
              <AnimateIn direction="right">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/site/ADV07400.jpg-marketing-scaled.jpg"
                    alt="Campers enjoying a typical day at Riverbend"
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

      {/* Supervision */}
      <Section id="supervision" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimateIn direction="left">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
                    alt="Counselors supervising campers at Riverbend"
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
                    Each group has two counselors leading them. Our group head counselors are teachers or older college students who have worked at Camp Riverbend before. Our group assistant counselors are college students or older high school students, many of them former Camp Riverbend campers themselves!
                  </p>
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Learn More */}
      <Section id="learn-more" bg="white">
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
