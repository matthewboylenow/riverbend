import { headers } from "next/headers";
import { db } from "@/lib/db";
import { adminAuthLog } from "@/lib/db/schema";

export type AuthEvent =
  | "login_password_ok"
  | "login_password_fail"
  | "login_password_unknown_email"
  | "otp_sent"
  | "otp_verify_ok"
  | "otp_verify_fail"
  | "otp_verify_expired"
  | "device_trusted"
  | "reset_request"
  | "reset_request_unknown_email"
  | "reset_complete"
  | "rate_limited";

export async function logAuthEvent(args: {
  event: AuthEvent;
  userId?: string | null;
  email?: string | null;
}): Promise<void> {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      null;
    const userAgent = h.get("user-agent") || null;
    await db.insert(adminAuthLog).values({
      event: args.event,
      userId: args.userId ?? null,
      email: args.email ?? null,
      ip,
      userAgent,
    });
  } catch (err) {
    console.error("[auth-audit] failed to write event:", err);
  }
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
