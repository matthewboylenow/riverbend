import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { InteractiveCampMap } from "@/components/camp-map/InteractiveCampMap";

export const metadata: Metadata = {
  title: "Interactive Camp Map | Explore Our 30-Acre Campus",
  description:
    "Explore Camp Riverbend's 30-acre campus with our interactive map. Click on any zone to discover activities, facilities, and everything camp has to offer.",
};

export default function CampMapPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Explore Our Campus"
        subtitle="30 acres of adventure along the Passaic River"
        bgImage="/images/ADV07104-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Camp Map" },
        ]}
      />

      <Section bg="cream" padding="default">
        <Container size="wide">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-body-lg text-bark leading-relaxed">
              Click or tap any zone on the map to learn about the activities and
              facilities at Camp Riverbend. Use the category filters to explore
              by type.
            </p>
          </div>
          <InteractiveCampMap />
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
