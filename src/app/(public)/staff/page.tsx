import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Join Our Staff | Camp Riverbend",
  description:
    "Interested in being a part of the Camp Riverbend family? Explore the various ways counselors make Camp Riverbend the best place to be for summer!",
};

const roles = [
  {
    title: "Group Counselors",
    description:
      "Work with one group of children all summer. Assist activity instructors and at the pool.",
  },
  {
    title: "Specialty Instructors",
    description:
      "Teach specific skills — arts & crafts, ceramics, woodworking, baseball, canoeing, cooking, drama, team building and soccer. Camp pays for required certifications.",
  },
  {
    title: "Waterfront Counselors",
    description:
      "Teach swimming lessons every morning and lifeguard every afternoon. Must have or earn Lifeguard certification.",
  },
  {
    title: "Photographer",
    description:
      "Takes photos of campers daily. Strong interest in photography is a plus but training provided.",
  },
];

export default function StaffPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Join Our Riverbend Family"
        subtitle="Make a difference this summer"
        bgImage="https://cdn.campriverbend.com/wp-content/uploads/2022/02/23171034/d-22-1024x682.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Staff" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                Looking for a summer job? Look no further than Camp Riverbend!
                We are a children&apos;s summer camp located in Warren Township,
                New Jersey.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                We have been serving the local area for over 60 years and take
                great pride in our Riverbend staff!
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Videos */}
      <Section id="videos" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimateIn direction="left">
              <div className="space-y-3">
                <h3 className="font-camp text-center">
                  Life as a Riverbend Counselor
                </h3>
                <VideoEmbed
                  vimeoId="670781165"
                  title="Life as a Riverbend Counselor"
                />
              </div>
            </AnimateIn>
            <AnimateIn direction="right">
              <div className="space-y-3">
                <h3 className="font-camp text-center">About Our Staff</h3>
                <VideoEmbed vimeoId="361309800" title="About Our Staff" />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 3: Why Camp Riverbend */}
      <Section id="why-riverbend" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">Why Camp Riverbend?</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                At Camp Riverbend, our philosophy builds &ldquo;confidence, not
                competition!&rdquo; We honor each camper&apos;s talents and
                efforts. Camp Riverbend is a place where each child can be
                themself, explore the world and learn new skills in a fun and
                supportive environment.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                We also work hard to give each of our counselors and staff
                opportunities to grow as both individuals and leaders, while
                building their resum&eacute; in a fun, outdoor environment.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Roles */}
      <Section id="roles" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Roles at Camp Riverbend</h2>
              <p className="text-body-lg text-bark leading-relaxed mt-4 max-w-2xl mx-auto">
                In order to join our Riverbend staff, we ask that all
                prospective staff be a high school junior (11th grade) or older.
              </p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <AnimateIn key={role.title} delay={index * 0.1}>
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
              <h2 className="font-camp text-center">2026 Dates &amp; Logistics</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Camp Riverbend is a 7 week summer day camp. Regular staff hours
                are Monday&ndash;Friday, 8:30 AM&ndash;4:00 PM. Camp
                Riverbend&apos;s 2026 season begins Monday, June 29.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                Unfortunately, we are unable to provide lodging. We recommend
                finding accommodation within about 20 miles of Camp.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 6: CTA */}
      <Section id="apply" bg="dark" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <h2 className="font-camp">Ready to Apply?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="primary" href={EXTERNAL_LINKS.staffApp} external>
                  Apply to Join Our Staff
                </Button>
              </div>
              <p className="text-body text-white/80">
                Questions? Call{" "}
                <a
                  href="tel:9085802267"
                  className="font-semibold text-white hover:underline"
                >
                  908-580-CAMP
                </a>
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
