import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Health & Safety | Camp Riverbend",
  description:
    "Camper safety is our number one priority. Camp Riverbend exceeds all standards of the New Jersey Youth Camp Safety Act.",
};

const safetyPoints = [
  {
    heading: "ACA Accredited",
    body: "Accredited by the American Camp Association since our very first season.",
  },
  {
    heading: "Annual Inspections",
    body: "Rigorous annual inspections by local and state officials covering every aspect of camp operations.",
  },
  {
    heading: "1:5 Ratio",
    body: "One dedicated counselor for every five campers, ensuring personal attention and supervision.",
  },
  {
    heading: "Secret Password",
    body: "No camper is ever released without the family's confidential password for added security.",
  },
];

export default function HealthSafetyPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Safety & Security"
        subtitle="Your child's safety is our number one priority"
        bgImage="/assets/site/ADV06446-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Health & Safety" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                Camper safety is our number one priority, and we are committed
                to keeping Camp Riverbend as safe and secure as possible!
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                We exceed all standards of the New Jersey Youth Camp Safety Act,
                and through the American Camp Association we keep current with
                the newest developments in camp safety and operations. We
                undergo rigorous annual inspections by local and state officials
                who evaluate every aspect of Camp Riverbend including
                sanitation, transportation, food safety, staff qualifications,
                fire prevention and medical record keeping.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Video */}
      <Section id="safety-video" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <VideoEmbed
              vimeoId="380563616"
              title="Safety & Health at Camp Riverbend"
            />
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Our Camp Nurse */}
      <Section id="camp-nurse" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">Our Camp Nurse</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  Our on-site camp nurse treats minor injuries that occur during
                  the day, such as bug bites and scrapes.
                </p>
                <p className="text-body-lg text-bark leading-relaxed">
                  A camper who feels sick or is injured will first go to the
                  Nurse&rsquo;s office to be evaluated. In case of serious
                  illness or injury, the nurse will contact the child&rsquo;s
                  parents to pick the child up. Otherwise, the nurse will treat
                  the child with over-the-counter, or prescription medications
                  that have been authorized by the parents. Our camp doctor is
                  on call.
                </p>
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/assets/site/ADV06446-scaled.jpg"
                  alt="Camp Riverbend health and safety"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 4: Key Safety Points */}
      <Section id="safety-points" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Our Safety Commitments</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyPoints.map((point, i) => (
              <AnimateIn key={point.heading} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="font-camp text-lg mb-3">{point.heading}</h3>
                  <p className="text-bark leading-relaxed">{point.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 5: CTA */}
      <Section id="cta" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <p className="text-body-lg text-bark leading-relaxed">
                Have questions about our safety policies?
              </p>
              <Button variant="primary" href="/faq">
                Visit Our FAQ
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
