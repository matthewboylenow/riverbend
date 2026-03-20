import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lunch & Snacks | Camp Riverbend",
  description:
    "Camp Riverbend's allergy-aware kitchen provides lunch daily with the perfect combination of kid favorites and healthy choices.",
};

export default function LunchPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Lunch & Snacks"
        subtitle="Kid favorites and healthy choices, every day"
        bgImage="/images/IMG_370.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Lunch" },
        ]}
      />

      {/* Section 1: Overview */}
      <Section id="overview" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">Daily Lunch</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  Lunch is provided daily and is the perfect combination of kid
                  favorites and healthy choices, created by our very own Camp
                  Riverbend Dietician.
                </p>
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/IMG_370.jpg"
                  alt="Lunch at Camp Riverbend"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 2: Snack Shack */}
      <Section id="snack-shack" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6">
              <h2 className="font-camp">The Snack Shack</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Our Snack Shack provides campers with mid-morning or
                mid-afternoon snacks, such as goldfish crackers, pretzels,
                popcorn, fresh fruit and fresh veggies!
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                All campers have an ice cream or ice pop treat as they wrap up
                their day.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                As always at Riverbend, all snack items offered are tree nut
                and peanut free. Gluten-free items are also available. Snacks
                are included in camp tuition.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Allergy Info */}
      <Section id="allergy-info" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="bg-white border-l-4 border-camp-red p-6 rounded-xl shadow-sm">
              <h2 className="font-camp text-2xl mb-4">Allergy Aware Kitchen</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Our kitchen is &ldquo;allergy aware.&rdquo; We do not serve any
                tree nut or peanut products and can accommodate a variety of
                food allergies, such as: gluten, dairy, sesame and egg
                allergies.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Video */}
      <Section id="lunch-video" bg="white" padding="default">
        <Container>
          <AnimateIn>
            <VideoEmbed vimeoId="382946475" title="Lunch & Snacks" />
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
