import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { verifyTicket } from "@/lib/auth-tokens";
import { authConfig } from "@/lib/auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "super_admin" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "super_admin" | "admin";
  }
}

// The Credentials provider only accepts a signed login ticket. Password and
// OTP verification happen in our own server actions (src/app/admin/login/...).
// This keeps the two-step flow auditable and lets us own rate limiting,
// trusted-device handling, and the OTP step without bending NextAuth.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        ticket: { label: "Ticket", type: "text" },
      },
      authorize: async (credentials) => {
        const ticket = String(credentials?.ticket || "");
        if (!ticket) return null;

        const verified = verifyTicket(ticket);
        if (!verified) return null;

        const rows = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.id, verified.userId))
          .limit(1);
        const user = rows[0];
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
