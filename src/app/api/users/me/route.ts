import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * Authenticated self-serve profile endpoints.
 * - GET  /api/users/me            → current admin's profile
 * - PUT  /api/users/me            → update name (no password change here)
 * - PUT  /api/users/me/password   → change password (separate route)
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.user.id))
    .limit(1);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.email === "string" && body.email.trim()) {
    updates.email = body.email.toLowerCase().trim();
  }

  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, session.user.id))
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      });
    return NextResponse.json(row);
  } catch (err) {
    console.error("Self-update failed:", err);
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }
}

/**
 * Reusable: validates a password against the rules we want for new passwords.
 */
export function validatePasswordStrength(password: string): string | null {
  if (typeof password !== "string") return "Password is required";
  if (password.length < 12) return "Password must be at least 12 characters";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must include a number";
  // Block obvious weakness
  if (/^(password|admin|riverbend|camp)/i.test(password)) {
    return "Password is too predictable";
  }
  return null;
}

/**
 * Verify a plaintext password against the current user's stored hash.
 * Used by the password-change endpoint to require re-auth.
 */
export async function verifyCurrentUserPassword(
  userId: string,
  plaintext: string
): Promise<boolean> {
  const rows = await db
    .select({ passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1);
  if (!rows.length) return false;
  return bcrypt.compare(plaintext, rows[0].passwordHash);
}
