import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Transportation | Camp Riverbend",
  description:
    "Camp tuition includes either bus transportation or a place in the extended day program. Campers travel in small yellow school buses with a riding counselor.",
};

export default function TransportationPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Transportation"
        subtitle="Safe, convenient bus service to and from camp"
        bgImage="/assets/site/DSC06927-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Transportation" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                All bus service is at neighborhood or centralized bus stops,
                with the exception of three-quarter day afternoon bus drop offs.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                Camp tuition includes either bus transportation or a place in
                the extended day program. Campers travel in small or large
                yellow school buses; each bus has a riding counselor to
                supervise campers during the bus route and everyone wears a
                seat belt.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                Bus transportation to and from Camp Riverbend is provided from
                many communities in Essex, Hudson, Morris, Somerset and Union
                counties. Contact us for information about specific towns.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Bus Service Details */}
      <Section id="bus-service" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">Bus Service</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  Every bus driver has a Commercial Driver&apos;s License with
                  Passenger and School Bus endorsements. To earn this license,
                  drivers must undergo a physical exam and have significant
                  knowledge and on-road testing for safety. Bus drivers&apos;
                  safety records are reviewed each season.
                </p>
                <p className="text-body-lg text-bark leading-relaxed">
                  We try to arrange our bus routes so each camper&apos;s trip
                  is as short as possible. Most bus routes begin around 8:00 am
                  and arrive at Camp around 8:45 am. We dismiss at 4:00 pm and
                  almost all buses have delivered their campers home by 4:45 pm.
                </p>
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/assets/site/DSC06927-scaled.jpg"
                  alt="Yellow school bus for Camp Riverbend transportation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 3: Three-Quarter Day Transportation */}
      <Section id="three-quarter-day" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">
                Three-Quarter Day Transportation
              </h2>
              <p className="text-body-lg text-bark leading-relaxed">
                For the 3 and 4 year old three-quarter day Clubhouse program,
                morning transportation to camp is included in tuition; Camp
                provides bus service back to Summit, New Providence, Berkeley
                Heights and Westfield at 2:00 pm. For campers in other towns, a
                parent or guardian must pick up three-quarter day Clubhouse
                campers at 2:00 pm.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Extended Day */}
      <Section id="extended-day" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp text-center">Extended Day Program</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                If the timing of the bus does not work for your schedule, we
                also offer an extended day option. You can bring your camper
                here as early as 8:00 am and pick up as late as 6:00 pm.
                Counselors supervise extended day campers in games, swimming,
                crafts, sports and quiet activities.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                There is no extra fee for the extended day program if you use it
                instead of bus transportation. There is a small extra charge to
                use both extended day and bus service, or bus service to two
                different addresses.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
