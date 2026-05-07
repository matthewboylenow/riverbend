import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CTAStrip } from "@/components/ui/CTAStrip";
import { getNavGroups } from "@/lib/navigation-db";

interface InnerPageLayoutProps {
  children: React.ReactNode;
  showCTA?: boolean;
  ctaVariant?: "red" | "charcoal" | "forest";
}

export async function InnerPageLayout({
  children,
  showCTA = true,
  ctaVariant = "red",
}: InnerPageLayoutProps) {
  const navGroups = await getNavGroups();
  return (
    <>
      <Navbar navGroups={navGroups} />
      <main id="main-content">{children}</main>
      {showCTA && <CTAStrip variant={ctaVariant} />}
      <Footer />
    </>
  );
}
