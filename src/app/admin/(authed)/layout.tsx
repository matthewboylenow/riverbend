import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  FileType2,
  Users,
  Package,
  Tags,
  ShoppingCart,
  UserCog,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Admin | Camp Riverbend",
    template: "%s | Admin | Camp Riverbend",
  },
  robots: "noindex, nofollow",
};

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Documents", href: "/admin/documents", icon: FileType2 },
  { label: "Staff", href: "/admin/staff", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: UserCog },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-charcoal text-white flex flex-col sticky top-0 h-screen">
        <Link
          href="/admin"
          className="font-camp text-lg font-bold text-white whitespace-nowrap px-5 py-4 border-b border-white/10"
        >
          Camp Riverbend{" "}
          <span className="block mt-1 text-camp-red-light font-sans text-[10px] font-semibold tracking-wider uppercase">
            Admin
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-2 py-3 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span>View Site →</span>
          </Link>
          {session?.user && (
            <>
              <Link
                href="/admin/profile"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={session.user.email ?? undefined}
              >
                <span className="truncate">{session.user.name?.split(" ")[0] || "Profile"}</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0 opacity-80" />
                  <span>Sign out</span>
                </button>
              </form>
            </>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8">{children}</main>
    </div>
  );
}
