"use server";

import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adminUsers,
  loginOtps,
  passwordResetTokens,
  trustedDevices,
} from "@/lib/db/schema";
import { randomToken, sha256 } from "@/lib/auth-tokens";
import { rateLimit } from "@/lib/auth-rate-limit";
import { logAuthEvent, clientIp } from "@/lib/auth-audit";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TTL_MS = 15 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;

export type ForgotResult = { ok: true } | { ok: false; message: string };
export type ResetResult = { ok: true } | { ok: false; message: string };

function appBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function requestReset(email: string): Promise<ForgotResult> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return { ok: false, message: "Enter your email" };

  const ip = await clientIp();
  const limit = rateLimit(`reset:${cleanEmail}|${ip}`, 5, 30 * 60 * 1000);
  if (!limit.ok) {
    await logAuthEvent({ event: "rate_limited", email: cleanEmail });
    // Same response as success to avoid leaking which emails exist or are throttled.
    return { ok: true };
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, cleanEmail))
    .limit(1);
  const user = rows[0];

  if (!user) {
    await logAuthEvent({ event: "reset_request_unknown_email", email: cleanEmail });
    // Don't reveal whether the email exists.
    return { ok: true };
  }

  // Invalidate any existing unused tokens for this user.
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(passwordResetTokens.userId, user.id),
        isNull(passwordResetTokens.usedAt),
      ),
    );

  const raw = randomToken(32);
  const tokenHash = sha256(raw);
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  const resetUrl = `${appBaseUrl()}/admin/reset?token=${encodeURIComponent(raw)}`;
  await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  await logAuthEvent({ event: "reset_request", userId: user.id, email: user.email });

  return { ok: true };
}

export async function completeReset(
  token: string,
  newPassword: string,
): Promise<ResetResult> {
  if (!token) return { ok: false, message: "Missing reset token" };
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }

  const ip = await clientIp();
  const limit = rateLimit(`reset-complete:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, message: "Too many attempts. Try again later." };
  }

  const tokenHash = sha256(token);
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const resetRow = rows[0];

  if (!resetRow) {
    return { ok: false, message: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(adminUsers)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, resetRow.userId));

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, resetRow.id));

  // Force re-2FA on all devices and invalidate any pending OTP challenges.
  await db.delete(trustedDevices).where(eq(trustedDevices.userId, resetRow.userId));
  await db
    .update(loginOtps)
    .set({ consumedAt: new Date() })
    .where(and(eq(loginOtps.userId, resetRow.userId), isNull(loginOtps.consumedAt)));

  await logAuthEvent({ event: "reset_complete", userId: resetRow.userId });
  return { ok: true };
}
