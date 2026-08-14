import type { Metadata } from "next";
import { HomepageContent } from "@/components/home/HomepageContent";
import { getNavGroups } from "@/lib/navigation-db";
import { loadHomeContent } from "@/lib/home-content";
import { loadContentMode } from "@/lib/preview-mode";
import { loadOrderedSectionKeys } from "@/lib/page-section-layout";
import { HOME_SCHEMA } from "@/lib/page-schemas/home";

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const mode = await loadContentMode(await searchParams);
  const [navGroups, content, orderedKeys] = await Promise.all([
    getNavGroups(),
    loadHomeContent(mode),
    loadOrderedSectionKeys(HOME_SCHEMA),
  ]);

  // The homepage layout is hand-designed, so the editor's drag order is
  // mostly cosmetic — but hide toggles are honored for every section, and
  // the 2027 promo card moves to the top of the bento grid when dragged
  // above the other Bento Grid sections. orderedKeys carries both signals
  // (hidden sections are excluded; order is preserved).
  return <HomepageContent navGroups={navGroups} content={content} visibleSections={orderedKeys} />;
}
