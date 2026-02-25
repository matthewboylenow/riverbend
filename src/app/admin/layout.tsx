import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: {
    default: "Admin | Camp Riverbend",
    template: "%s | Admin | Camp Riverbend",
  },
  robots: "noindex, nofollow",
};

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-charcoal text-white">
        <Container>
          <div className="flex items-center justify-between h-14">
            <Link href="/admin" className="font-camp text-lg font-bold text-white">
              Camp Riverbend <span className="text-camp-red-light font-sans text-xs font-normal ml-2 px-2 py-0.5 bg-white/10 rounded-full">Admin</span>
            </Link>
            <nav className="flex items-center gap-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <span className="ml-3 text-white/30">|</span>
              <Link
                href="/"
                className="ml-2 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                View Site →
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      {/* Admin content */}
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
