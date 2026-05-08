"use client";

import { SessionProvider } from "next-auth/react";
import { AdminBar } from "@/components/AdminBar";

/**
 * Wraps the public site with a SessionProvider so the admin bar can read
 * the current session on the client. Public pages stay statically
 * renderable — the bar only mounts after the JS hydrates and resolves
 * the session.
 */
export function AdminBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AdminBar />
    </SessionProvider>
  );
}
