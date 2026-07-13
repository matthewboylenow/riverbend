"use client";

/**
 * WordPress-style admin top bar — only renders for users with an admin
 * session. Floats over the public site content; non-logged-in users
 * never see it.
 *
 * The "Edit this page" link is built from a static href→slug map of CMS
 * pages. Pages without a CMS schema (e.g. /shop, /cart) just hide that
 * link.
 */
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut, Pencil } from "lucide-react";

// Mirrors `publicHref → slug` from src/lib/page-schemas/*. Keeping this
// as a flat literal avoids dragging the full schemas into the public
// JS bundle.
const PAGE_SLUG_BY_HREF: Record<string, string> = {
  "/": "home",
  "/about-riverbend": "about-riverbend",
  "/breene-family": "breene-family",
  "/camp-riverbend-app": "camp-riverbend-app",
  "/day-trippers": "day-trippers",
  "/health-safety": "health-safety",
  "/lunch": "lunch",
  "/rates-dates-application": "rates-dates-application-2026",
  "/rates-dates-application-2027": "rates-dates-application-next",
  "/sports": "sports",
  "/testimonials": "testimonials",
  "/activities": "activities",
  "/calendar": "calendar",
  "/clubhouse": "clubhouse",
  "/faq": "faq",
  "/programs": "programs",
  "/riverbend-experience": "riverbend-experience",
  "/staff": "staff",
  "/transportation": "transportation",
  "/videos": "videos",
};

export function AdminBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't render in the admin area itself; the admin shell already has its
  // own nav.
  if (pathname?.startsWith("/admin")) return null;

  // Only show for authenticated admins. While loading or when unauthenticated,
  // render nothing — keeps public site clean.
  if (status !== "authenticated" || !session?.user) return null;
  const role = session.user.role;
  if (role !== "admin" && role !== "super_admin") return null;

  const editSlug = pathname ? PAGE_SLUG_BY_HREF[pathname] : null;

  return (
    <>
      {/* Spacer so fixed bar doesn't overlap page content */}
      <div className="h-9" aria-hidden />

      <div className="fixed top-0 inset-x-0 z-[100] bg-charcoal text-white text-xs h-9 flex items-center px-3 gap-1 shadow-md">
        <Link
          href="/admin"
          className="px-2.5 py-1 rounded hover:bg-white/10 font-camp text-camp-red-light"
        >
          Camp Riverbend
        </Link>

        <span className="text-white/30 mx-1">·</span>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/10"
        >
          <LayoutDashboard className="h-3.5 w-3.5 opacity-80" />
          Dashboard
        </Link>

        {editSlug && (
          <Link
            href={`/admin/pages/${editSlug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/10"
          >
            <Pencil className="h-3.5 w-3.5 opacity-80" />
            Edit this page
          </Link>
        )}

        <div className="ml-auto inline-flex items-center gap-1">
          <Link
            href="/admin/profile"
            className="px-2.5 py-1 rounded hover:bg-white/10"
            title={session.user.email ?? undefined}
          >
            Hi, {session.user.name?.split(" ")[0] || "Admin"}
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/10"
          >
            <LogOut className="h-3.5 w-3.5 opacity-80" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
