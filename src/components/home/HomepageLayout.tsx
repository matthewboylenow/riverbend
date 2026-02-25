"use client";

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar transparent />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
