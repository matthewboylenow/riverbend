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
  title: "The Clubhouse | Ages 3-5 | Camp Riverbend",
  description:
    "The Clubhouse is a wonderful introduction to the classic Camp Riverbend summer camp experience for campers aged 3-5 years old.",
};

export default function ClubhousePage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="The Clubhouse"
        subtitle="A wonderful introduction to camp for ages 3-5"
        bgImage="/assets/site/DSC_0553-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: "The Clubhouse" },
        ]}
      />

      {/* Overview */}
      <Section id="overview" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                Ages 3-5
              </span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Clubhouse is a wonderful introduction to the classic summer camp experience for campers ages 3-5 years old (rising pre-K and kindergarteners). All our Clubhouse campers are in co-ed groups in a designated area of the camp built just for them. Everything is kid-sized, right down to the chairs and the athletic field, so they are right at home and comfortable!
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Clubhouse daily schedule alternates between quiet and dynamic activities and includes a rest time after lunch. Swimming is an important part of each day, with group instruction each morning and a &ldquo;free&rdquo; swim in the afternoon for splashing around and having fun (three-quarter day campers have a &ldquo;free&rdquo; swim immediately after their morning lesson). Other fun activities for our Clubhouse Campers include: sports, crafts, cooking, canoeing and nature.
            </p>
          </AnimateIn>
        </Container>
      </Section>

      {/* Video */}
      <Section id="video" bg="cream" padding="sm">
        <Container size="narrow">
          <AnimateIn direction="up">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              See our swim program in action!
            </p>
            <VideoEmbed vimeoId="361307397" title="Clubhouse Swim Program" />
          </AnimateIn>
        </Container>
      </Section>

      {/* Programs Grid */}
      <Section id="programs" bg="white">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Three-Quarter Day Programs
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our youngest campers attend camp 9:00 am &ndash; 2:00 pm and experience all the fun of Camp Riverbend! Campers must be toilet trained.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Full-Day Program
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Children entering their last year of preschool or Kindergarten and ready for a full day at camp attend our regular full-day program.
                </p>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Supervision */}
      <Section id="supervision" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Supervision
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Three counselors supervise about 16 boys and girls in each Clubhouse group. Smaller groups have two counselors.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The head group counselors are educators with experience in early childhood education. The assistant group counselors are college and older high school students who really enjoy being with young children. We nurture our Clubhouse campers with lots of individual attention and age-appropriate fun and exploration.
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
                  alt="Clubhouse counselors with young campers"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Sample Schedules */}
      <Section id="sample-schedules" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              Sample Schedules
            </h2>
            <p className="text-center text-gray-700 mb-8">
              See how a typical day is structured for our youngest campers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a
                href="/assets/documents/schedules/clubhouse-three-quarter-day.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-stone/30 rounded-xl hover:border-camp-red hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-charcoal">Three-Quarter Day</div>
                  <div className="text-sm text-bark">3-year-olds · 9:00 am – 2:00 pm</div>
                </div>
                <span className="text-camp-red font-semibold text-sm">PDF →</span>
              </a>
              <a
                href="/assets/documents/schedules/clubhouse-full-day.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white border border-stone/30 rounded-xl hover:border-camp-red hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-charcoal">Full Day</div>
                  <div className="text-sm text-bark">4–5 year-olds · Pre-K and K</div>
                </div>
                <span className="text-camp-red font-semibold text-sm">PDF →</span>
              </a>
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
                image="/assets/site/ADV07104-scaled.jpg"
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
