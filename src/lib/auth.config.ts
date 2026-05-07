import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config — no DB, no Node `crypto`, no bcrypt.
 *
 * Used by middleware to decode JWTs without pulling Node-only deps into the
 * Edge runtime bundle. The full provider list (with credentials + ticket
 * verification) lives in `src/lib/auth.ts`.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: "super_admin" | "admin" }).role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "super_admin" | "admin") || "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
