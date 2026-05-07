import type { Metadata } from "next";
import { HomepageContent } from "@/components/home/HomepageContent";
import { getNavGroups } from "@/lib/navigation-db";

export const metadata: Metadata = {
  title: "Camp Riverbend | Summer Day Camp in Warren, NJ",
  description:
    "Camp Riverbend is a family-run summer day camp in Warren, New Jersey for ages 3-14. Over 60 years of tradition. Confidence, not competition.",
  openGraph: {
    title: "Camp Riverbend | Summer Day Camp in Warren, NJ",
    description:
      "A family-run summer day camp in Warren, New Jersey for ages 3-14. Over 60 years of tradition.",
    images: [
      {
        url: "/assets/site/ADV07400.jpg-marketing-scaled.jpg",
        width: 1920,
        height: 1080,
        alt: "Camp Riverbend",
      },
    ],
  },
};

export default async function HomePage() {
  const navGroups = await getNavGroups();
  return <HomepageContent navGroups={navGroups} />;
}
