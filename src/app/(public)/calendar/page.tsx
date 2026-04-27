import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import Image from "next/image";

export const metadata: Metadata = {
  title: "2026 Summer Calendar | Camp Riverbend",
  description:
    "View the summer calendar of events and important dates for Camp Riverbend's 2026 season.",
};

const keyDates = [
  { date: "January 6", event: "$2,000 per camper tuition payment charged" },
  { date: "April 1", event: "Final tuition payment charged" },
  { date: "Mid-April", event: "Bus assignments distributed" },
  { date: "May 15", event: "Camper medical forms and authorization documents due" },
  {
    date: "Mid-May",
    event: "Parent Handbook distribution and Riverbend App setup",
  },
  {
    date: "Early June",
    event: "Division head orientation sessions; Lunch orders open",
  },
  { date: "June 18", event: "Week 1 lunch orders close" },
  { date: "June 19", event: "Bus rider introductions sent" },
  { date: "June 20–21", event: "Welcome Weekend at Camp" },
  { date: "June 29", event: "Opening day of the 2026 season" },
  { date: "July 3", event: "Camp is closed" },
  { date: "July 4", event: "Group lists and counselor introductions go out" },
  { date: "Mid-July", event: "Tour weekend for prospective families" },
  {
    date: "Early August",
    event: "2027 applications open for enrolled families",
  },
  { date: "Mid-August", event: "2027 applications open for all" },
  { date: "August 14", event: "Last day of the 2026 season" },
];

export default function CalendarPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="2026 Calendar"
        subtitle="Important dates for the upcoming season"
        bgImage="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calendar" },
        ]}
      />

      {/* Section 1: Calendar Image */}
      <Section id="calendar-image" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <div className="relative aspect-[3/4] max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/assets/site/2026-program-calendar.png"
                alt="2026 Camp Riverbend Program Calendar"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href="/assets/site/2026-program-calendar.png"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-camp-red hover:underline"
              >
                View full size →
              </a>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Key Dates */}
      <Section id="key-dates" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Key Dates</h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="space-y-6">
              {keyDates.map((d) => (
                <div key={d.date} className="flex gap-6 items-start">
                  <div className="font-camp text-camp-red whitespace-nowrap min-w-[140px] text-right">
                    {d.date}
                  </div>
                  <div className="text-bark">{d.event}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Carnival Video */}
      <Section id="carnival" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">Carnival &amp; Special Days</h2>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="mt-8">
              <VideoEmbed vimeoId="382946042" title="Carnival & Special Days" />
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
