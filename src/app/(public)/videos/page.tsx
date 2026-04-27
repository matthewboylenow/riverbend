import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

export const metadata: Metadata = {
  title: "Video Library | Camp Riverbend",
  description:
    "Watch videos to learn more about Camp Riverbend programs, activities, staff, and summer camp life.",
};

const videos = [
  { id: "383347420", title: "The Breene's Legacy" },
  { id: "361307397", title: "Clubhouse" },
  { id: "361309028", title: "Riverbend Experience" },
  { id: "361308491", title: "Day Trippers" },
  { id: "361310178", title: "Aquatics Program" },
  { id: "380563616", title: "Safety & Health" },
  { id: "382946042", title: "Transportation" },
  { id: "382945475", title: "Sports" },
  { id: "382946991", title: "Adventure Course & High Ropes" },
  { id: "367278383", title: "Arts & Crafts" },
  { id: "382947510", title: "Choice Clubs, Tracking & Superchoice" },
  { id: "382946475", title: "Lunch & Snacks" },
  { id: "361309800", title: "Counselors / Staff" },
  { id: "386555082", title: "Family Camp Day" },
  { id: "386555546", title: "Carnival & Special Days" },
  { id: "386592102", title: "Testimonials from Campers, Staff & Parents" },
];

export default function VideosPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Video Library"
        subtitle="Learn more about Camp Riverbend — watch our videos!"
        bgImage="/assets/site/ADV07400.jpg-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Videos" },
        ]}
      />

      <Section id="videos" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {videos.map((video, i) => (
              <AnimateIn key={video.id} delay={i * 0.05}>
                <div>
                  <h3 className="font-camp text-lg mb-3">{video.title}</h3>
                  <VideoEmbed vimeoId={video.id} title={video.title} />
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
