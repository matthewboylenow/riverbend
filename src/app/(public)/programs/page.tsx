import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { LinkCard } from "@/components/ui/LinkCard";
import { ProgramCard } from "@/components/ui/ProgramCard";

export const metadata: Metadata = {
  title: "Our Programs | Camp Riverbend",
  description:
    "Camp Riverbend offers 3 great options for children of different ages: for Pre-K 3 & 4 year olds and rising kindergartners, for campers entering grades 1-8, and for campers entering grades 7-9.",
};

export default function ProgramsPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Our Programs"
        subtitle="Three amazing programs for campers ages 3 through 14"
        bgImage="/images/ADV06620.jpg-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Programs" },
        ]}
      />

      {/* Intro */}
      <Section id="intro" bg="cream">
        <Container size="narrow">
          <AnimateIn direction="up">
            <div className="text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                Camp Riverbend offers three distinct programs designed to meet campers exactly where they are. Whether your child is just starting their camp journey or ready for off-site adventures, there&apos;s a perfect fit waiting for them here.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* The Clubhouse */}
      <Section id="clubhouse" bg="white">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge="Ages 3-5"
              title="The Clubhouse"
              description="The Clubhouse is a wonderful introduction to the classic summer camp experience for campers aged 3-5 years old. Everything is kid-sized, right down to the chairs and the athletic field, so they are right at home and comfortable!"
              links={[{ label: "Explore The Clubhouse", href: "/clubhouse" }]}
              image="/images/DSC_0553-scaled.jpg"
              imageAlt="Young campers in the Clubhouse program"
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Riverbend Experience */}
      <Section id="riverbend-experience" bg="cream">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge="Grades 1-8"
              title="Riverbend Experience"
              description="Where campers entering 1st through 8th grades explore, grow and gain confidence! Their days are packed full of fabulous activities and fun; this is the place to make new friends and life-long memories!"
              links={[
                {
                  label: "Explore Riverbend Experience",
                  href: "/riverbend-experience",
                },
              ]}
              image="/images/ADV07104-scaled.jpg"
              imageAlt="Campers enjoying activities in the Riverbend Experience program"
              reversed
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Day Trippers */}
      <Section id="day-trippers" bg="white">
        <Container>
          <AnimateIn direction="up">
            <ProgramCard
              badge="Grades 7-9"
              title="Day Trippers"
              description="The Day Trippers program takes young teens out of camp and on the road for day trips and short overnight trips in our region. You&apos;ll find us down at the beach and up in the mountains. We&apos;ll be boating, cooking, climbing, seeing the sights and exploring the world!"
              links={[
                { label: "Explore Day Trippers", href: "/day-trippers" },
              ]}
              image="/images/ADV06446-scaled.jpg"
              imageAlt="Day Trippers on an adventure outside of camp"
            />
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
                title="Activities Offered"
                href="/activities"
                image="/images/ADV01169.jpg"
                index={0}
              />
              <LinkCard
                title="Rates & Dates"
                href="/rates-dates-application-2026"
                image="/images/Canoe.jpg"
                index={1}
              />
              <LinkCard
                title="About Riverbend"
                href="/about-riverbend"
                image="/images/IMG_2726.jpg"
                index={2}
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
