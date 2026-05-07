import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { auth, signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Admin | Camp Riverbend",
    template: "%s | Admin | Camp Riverbend",
  },
  robots: "noindex, nofollow",
};

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Pages", href: "/admin/pages" },
  { label: "Media", href: "/admin/media" },
  { label: "Documents", href: "/admin/documents" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-charcoal text-white">
        <Container>
          <div className="flex items-center justify-between h-14 gap-4">
            <Link href="/admin" className="font-camp text-lg font-bold text-white whitespace-nowrap">
              Camp Riverbend{" "}
              <span className="text-camp-red-light font-sans text-xs font-normal ml-2 px-2 py-0.5 bg-white/10 rounded-full">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1 flex-wrap justify-end">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <span className="ml-2 text-white/30">|</span>
              <Link
                href="/"
                className="ml-1 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                View Site →
              </Link>
              {session?.user && (
                <>
                  <Link
                    href="/admin/profile"
                    className="ml-1 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={session.user.email ?? undefined}
                  >
                    {session.user.name?.split(" ")[0] || "Profile"}
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/admin/login" });
                    }}
                    className="ml-1"
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </form>
                </>
              )}
            </nav>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
