import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Camp Riverbend App | Camp Riverbend",
  description:
    "Stay connected with Camp Riverbend via our mobile app. See photos, get notifications, and connect to your parent portal.",
};

const features = [
  {
    title: "Photo & Video Access",
    description:
      "See and download photos and videos from camp for FREE throughout the summer.",
  },
  {
    title: "Push Notifications",
    description:
      "Get important notifications and texts directly from camp staff.",
  },
  {
    title: "Parent Portal",
    description:
      "Connect directly to your CampMinder Parent Portal from the app.",
  },
  {
    title: "Camp Calendar",
    description:
      "View important dates on the camp calendar and link directly to your own.",
  },
  {
    title: "Contact Staff",
    description: "Easily reach camp staff with questions at any time.",
  },
];

export default function CampAppPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Camp Riverbend App"
        subtitle="Stay connected with your camper all summer"
        bgImage="https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190056/MEC_9306.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Camp App" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                Enrolled families can now stay connected with Camp Riverbend via
                our app! See and download photos and videos from camp for FREE,
                get important notifications and texts from camp, connect to your
                CampMinder Parent Portal, view important dates on the camp
                calendar &amp; link directly to yours, and easily contact camp
                staff.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: How to Get It */}
      <Section id="download" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">How to Get It</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Search on the App Store or Google Play for{" "}
                <strong>&ldquo;Camp Riverbend NJ&rdquo;</strong> to download.
                You will need an access code to install the app; this code is
                listed in our Parent Handbook.
              </p>
              <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
                <a
                  href="https://apps.apple.com/app/camp-riverbend-nj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn.campriverbend.com/wp-content/uploads/2019/06/15185945/apple-storeArtboard-1.png"
                    alt="Download on the App Store"
                    className="max-h-12 w-auto"
                  />
                </a>
                <a
                  href="https://play.google.com/store/search?q=camp+riverbend+nj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn.campriverbend.com/wp-content/uploads/2019/06/15185945/google-play-badge.png"
                    alt="Get it on Google Play"
                    className="max-h-12 w-auto"
                  />
                </a>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Features */}
      <Section id="features" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">App Features</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimateIn key={feature.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-camp text-lg mb-3">{feature.title}</h3>
                  <p className="text-bark leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
