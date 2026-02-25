import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CTAStrip } from "@/components/ui/CTAStrip";

interface InnerPageLayoutProps {
  children: React.ReactNode;
  showCTA?: boolean;
  ctaVariant?: "red" | "charcoal" | "forest";
}

export function InnerPageLayout({
  children,
  showCTA = true,
  ctaVariant = "red",
}: InnerPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      {showCTA && <CTAStrip variant={ctaVariant} />}
      <Footer />
    </>
  );
}
