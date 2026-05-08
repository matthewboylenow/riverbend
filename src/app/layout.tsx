import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AdminBarProvider } from "@/components/AdminBarProvider";
import { getFaviconUrl } from "@/lib/site-settings";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const campFont = localFont({
  src: [
    {
      path: "../../public/fonts/3832CC_0_0 (1).woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/3832CC_0_0 (1).woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-camp",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();
  return {
    title: {
      default: "Camp Riverbend | Summer Day Camp in Warren, NJ",
      template: "%s | Camp Riverbend",
    },
    description:
      "Camp Riverbend is a family-run summer day camp in Warren, New Jersey for ages 3-14. Over 60 years of tradition. Confidence, not competition.",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://campriverbend.com"
    ),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Camp Riverbend",
    },
    twitter: {
      card: "summary_large_image",
    },
    icons: {
      icon: faviconUrl || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${nunito.variable} ${campFont.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AdminBarProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AdminBarProvider>
      </body>
    </html>
  );
}
