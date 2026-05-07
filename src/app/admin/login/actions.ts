"use server";

import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { adminUsers, loginOtps, trustedDevices } from "@/lib/db/schema";
import {
  generateOtp,
  randomToken,
  sha256,
  signChallenge,
  signTicket,
  verifyChallenge,
} from "@/lib/auth-tokens";
import { rateLimit } from "@/lib/auth-rate-limit";
import { logAuthEvent, clientIp } from "@/lib/auth-audit";
import { sendLoginCodeEmail } from "@/lib/email";
import { signIn } from "@/lib/auth";

const CHALLENGE_COOKIE = "auth_challenge";
const TRUST_COOKIE = "admin_trusted_device";
const TRUST_TTL_DAYS = 30;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export type PasswordStepResult =
  | { stage: "ok" }
  | { stage: "otp_required" }
  | { stage: "error"; message: string };

export type VerifyOtpResult =
  | { stage: "ok" }
  | { stage: "error"; message: string };

async function findTrustedDevice(userId: string): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(TRUST_COOKIE)?.value;
  if (!raw) return false;
  const tokenHash = sha256(raw);
  const rows = await db
    .select()
    .from(trustedDevices)
    .where(
      and(
        eq(trustedDevices.userId, userId),
        eq(trustedDevices.tokenHash, tokenHash),
        gt(trustedDevices.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (rows.length === 0) return false;
  await db
    .update(trustedDevices)
    .set({ lastUsedAt: new Date() })
    .where(eq(trustedDevices.id, rows[0].id));
  return true;
}

async function startOtpChallenge(user: { id: string; email: string; name: string }): Promise<void> {
  // Invalidate any prior open OTPs for this user.
  await db
    .update(loginOtps)
    .set({ consumedAt: new Date() })
    .where(and(eq(loginOtps.userId, user.id), isNull(loginOtps.consumedAt)));

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);
  const inserted = await db
    .insert(loginOtps)
    .values({
      userId: user.id,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    })
    .returning({ challengeId: loginOtps.challengeId });

  const challengeId = inserted[0].challengeId;
  const signed = signChallenge(challengeId, user.id, OTP_TTL_MS / 1000);

  const jar = await cookies();
  jar.set(CHALLENGE_COOKIE, signed, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OTP_TTL_MS / 1000,
  });

  await sendLoginCodeEmail({ to: user.email, name: user.name, code });
  await logAuthEvent({ event: "otp_sent", userId: user.id, email: user.email });
}

async function completeSignIn(userId: string): Promise<void> {
  const ticket = signTicket(userId, 120);
  await signIn("credentials", { ticket, redirect: false });
}

async function trustDevice(userId: string, label: string | null): Promise<void> {
  const raw = randomToken(32);
  const tokenHash = sha256(raw);
  await db.insert(trustedDevices).values({
    userId,
    tokenHash,
    label,
    expiresAt: new Date(Date.now() + TRUST_TTL_DAYS * 24 * 60 * 60 * 1000),
  });

  const jar = await cookies();
  jar.set(TRUST_COOKIE, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRUST_TTL_DAYS * 24 * 60 * 60,
  });

  await logAuthEvent({ event: "device_trusted", userId });
}

export async function passwordStep(
  email: string,
  password: string,
): Promise<PasswordStepResult> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !password) {
    return { stage: "error", message: "Email and password are required" };
  }

  const ip = await clientIp();
  const limit = rateLimit(`pw:${cleanEmail}|${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    await logAuthEvent({ event: "rate_limited", email: cleanEmail });
    return { stage: "error", message: "Too many attempts. Try again later." };
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, cleanEmail))
    .limit(1);
  const user = rows[0];

  if (!user) {
    await logAuthEvent({ event: "login_password_unknown_email", email: cleanEmail });
    return { stage: "error", message: "Invalid email or password" };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    await logAuthEvent({ event: "login_password_fail", userId: user.id, email: cleanEmail });
    return { stage: "error", message: "Invalid email or password" };
  }

  await logAuthEvent({ event: "login_password_ok", userId: user.id, email: cleanEmail });

  const trusted = await findTrustedDevice(user.id);
  if (trusted) {
    await completeSignIn(user.id);
    return { stage: "ok" };
  }

  await startOtpChallenge({ id: user.id, email: user.email, name: user.name });
  return { stage: "otp_required" };
}

export async function verifyOtpStep(
  rawCode: string,
  trustThisDevice: boolean,
  deviceLabel: string | null,
): Promise<VerifyOtpResult> {
  const code = rawCode.replace(/\s+/g, "").trim();
  if (!/^\d{6}$/.test(code)) {
    return { stage: "error", message: "Enter the 6-digit code from your email" };
  }

  const jar = await cookies();
  const cookieValue = jar.get(CHALLENGE_COOKIE)?.value;
  if (!cookieValue) {
    return { stage: "error", message: "Challenge expired. Start over." };
  }
  const verified = verifyChallenge(cookieValue);
  if (!verified) {
    return { stage: "error", message: "Challenge expired. Start over." };
  }

  const ip = await clientIp();
  const limit = rateLimit(`otp:${verified.userId}|${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    await logAuthEvent({ event: "rate_limited", userId: verified.userId });
    return { stage: "error", message: "Too many attempts. Try again later." };
  }

  const rows = await db
    .select()
    .from(loginOtps)
    .where(eq(loginOtps.challengeId, verified.challengeId))
    .limit(1);
  const otp = rows[0];

  if (!otp || otp.userId !== verified.userId) {
    return { stage: "error", message: "Challenge expired. Start over." };
  }
  if (otp.consumedAt) {
    return { stage: "error", message: "Code already used. Start over." };
  }
  if (otp.expiresAt.getTime() < Date.now()) {
    await logAuthEvent({ event: "otp_verify_expired", userId: otp.userId });
    return { stage: "error", message: "Code expired. Start over." };
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await db.update(loginOtps).set({ consumedAt: new Date() }).where(eq(loginOtps.id, otp.id));
    return { stage: "error", message: "Too many wrong codes. Start over." };
  }

  const ok = await bcrypt.compare(code, otp.codeHash);
  if (!ok) {
    await db
      .update(loginOtps)
      .set({ attempts: otp.attempts + 1 })
      .where(eq(loginOtps.id, otp.id));
    await logAuthEvent({ event: "otp_verify_fail", userId: otp.userId });
    return { stage: "error", message: "Incorrect code" };
  }

  await db
    .update(loginOtps)
    .set({ consumedAt: new Date() })
    .where(eq(loginOtps.id, otp.id));
  jar.delete(CHALLENGE_COOKIE);

  await logAuthEvent({ event: "otp_verify_ok", userId: otp.userId });

  if (trustThisDevice) {
    await trustDevice(otp.userId, deviceLabel);
  }

  await completeSignIn(otp.userId);
  return { stage: "ok" };
}

export async function cancelChallenge(): Promise<void> {
  const jar = await cookies();
  jar.delete(CHALLENGE_COOKIE);
}
