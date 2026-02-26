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
import { TreeLine } from "@/components/illustrations/TreeLine";
import { MountainRange } from "@/components/illustrations/MountainRange";
import { Campfire } from "@/components/illustrations/Campfire";

export const metadata: Metadata = {
  title: "About Camp Riverbend | Legacy & Tradition Since 1962",
  description:
    "Founded in 1962 by the Breene family, Camp Riverbend in Warren, NJ has hosted generations of families. ACA accredited since season one.",
};

export default function AboutPage() {
  return (
    <InnerPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Legacy & Tradition"
        subtitle="Camp Riverbend has hosted generations of families for over 60 years in Warren Township, New Jersey"
        bgImage="/images/ADV07104-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Riverbend" },
        ]}
      />

      {/* Section 1: Legacy (id="legacy") */}
      <Section id="legacy" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">A Family Affair</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Founded by Marianne and Harold Breene in 1962, Camp Riverbend is a family
                affair. The four Breene children—Roger, Jill, Paul and Robin, and
                daughters-in-law Debbie and Miriam, now run the camp, and the newest
                generation of Breene great-grandchildren are becoming campers! Each member
                of the family is here to provide a personal, hands-on camp experience
                you&apos;ll never forget!
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                Camp Riverbend is proud to be accredited by the American Camp Association,
                and has been since its very first season. Camp Riverbend traditions create
                lifelong memories for campers.
              </p>
            </div>
          </AnimateIn>

          {/* Video */}
          <AnimateIn delay={0.2}>
            <div className="mt-12">
              <p className="text-center text-sm font-semibold text-bark mb-4 tracking-wide uppercase">
                Watch the video to learn more
              </p>
              <VideoEmbed
                vimeoId="383347420"
                title="Camp Riverbend Legacy"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="mt-10 text-center">
              <Button variant="primary" href="/breene-family">
                Meet our Directors &amp; Senior Staff
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Illustration: TreeLine between Legacy and Philosophy */}
      <div className="py-8 bg-cream">
        <TreeLine />
      </div>

      {/* Section 2: Our Philosophy (id="philosophy") */}
      <Section id="philosophy" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <span className="text-caption text-camp-red tracking-widest">Our Philosophy</span>
                <h2 className="font-camp">
                  <span className="text-camp-red">&ldquo;Confidence,</span>{" "}
                  not Competition&rdquo;
                </h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  We honor each camper&apos;s talents and efforts. Camp Riverbend is a
                  place where each child can be themself, explore the world and learn new
                  skills in a fun and supportive environment.
                </p>
                <p className="text-body-lg text-bark leading-relaxed">
                  We encourage every camper to participate in all activities and we
                  applaud every achievement – from a camper&apos;s first at-bat to a
                  grand-slam home run!
                </p>
              </div>
            </AnimateIn>

            {/* Image */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/ADV01122.jpg"
                  alt="Camper and staff member talking together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 3: Camp Map & Location (id="facilities-location") */}
      <Section id="facilities-location" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <span className="text-caption text-camp-red tracking-widest">
                  Our Campus
                </span>
                <h2 className="font-camp">Facilities & Location</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  Located in beautiful Somerset County, just 35 minutes from NYC, Camp
                  Riverbend sits on a 30-acre site along the Passaic River. The
                  environment is perfect for explorers of all ages, with vibrant woods,
                  open fields, nature trails, a wetlands sanctuary, athletic facilities
                  and the river bank.
                </p>
                <p className="text-body text-bark leading-relaxed">
                  Take a look at all the activities and amenities Camp Riverbend has
                  to offer!
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="primary" href={EXTERNAL_LINKS.inquiryForm} external>
                    Book a Tour
                  </Button>
                  <Button variant="secondary" href={EXTERNAL_LINKS.inquiryForm} external>
                    Request More Info
                  </Button>
                </div>
                <div className="pt-4 text-sm text-bark space-y-1">
                  <p className="font-semibold">Call or email us to book a tour</p>
                  <p>
                    <a href="tel:9085802267" className="text-camp-red hover:underline">
                      (908) 580-CAMP
                    </a>
                    {" · "}
                    <a
                      href="mailto:info@campriverbend.com"
                      className="text-camp-red hover:underline"
                    >
                      info@campriverbend.com
                    </a>
                  </p>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg bg-sand">
                  <Image
                    src="/images/2022-Camp-Map-JPG-scaled.jpg"
                    alt="Camp Riverbend campus map"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="primary" href="/camp-map">
                    Explore Interactive Map
                  </Button>
                  <a
                    href="/images/2022-Camp-Map-JPG-scaled.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-camp-red hover:underline"
                  >
                    Download Camp Map →
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Illustration: MountainRange below map */}
      <div className="py-8 bg-cream">
        <MountainRange />
      </div>

      {/* Section 4: Our Staff (id="staff") */}
      <Section id="staff" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-6">
              <p className="pull-quote text-center border-none pl-0">
                &ldquo;A camp is only as good as its counselors.&rdquo;
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                We take pride in our mature, talented staff of dedicated teachers and
                enthusiastic college students and older high school students, many of
                whom were once Riverbend campers themselves. There is no CIT program.
              </p>
            </div>
          </AnimateIn>

          {/* Staff video */}
          <AnimateIn delay={0.2}>
            <div className="mt-12">
              <p className="text-center text-sm font-semibold text-bark mb-4 tracking-wide uppercase">
                Watch the video to learn more
              </p>
              <VideoEmbed
                vimeoId="361309800"
                title="Camp Riverbend Staff"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button variant="primary" href={EXTERNAL_LINKS.staffApp} external>
                Apply to Join Our Staff
              </Button>
              <Button variant="secondary" href="/breene-family">
                Meet our Directors &amp; Senior Staff
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Illustration: Campfire between Staff and Learn More */}
      <div className="py-10 bg-white">
        <Campfire />
      </div>

      {/* Section 5: Learn More Links */}
      <Section bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Learn More</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
              title="Our Programs"
              href="/programs"
              image="/images/ADV06620.jpg-marketing-scaled.jpg"
              index={2}
            />
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
