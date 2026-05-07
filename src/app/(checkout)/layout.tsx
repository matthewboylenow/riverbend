import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { getNavGroups } from "@/lib/navigation-db";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navGroups = await getNavGroups();
  return (
    <>
      <Navbar navGroups={navGroups} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
