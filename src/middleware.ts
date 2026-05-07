import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",
  "/admin/login/verify",
  "/admin/forgot",
  "/admin/reset",
]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.has(pathname);

  if (pathname.startsWith("/admin") && !isPublicAdmin) {
    if (!isLoggedIn) {
      const url = new URL("/admin/login", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // If a logged-in user lands on a public admin auth page, send them to the
  // dashboard. /admin/reset is exempt so a signed-in admin can still complete
  // a reset flow they started in another tab.
  if (isPublicAdmin && isLoggedIn && pathname !== "/admin/reset") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
