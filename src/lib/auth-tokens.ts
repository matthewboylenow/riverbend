/**
 * Token primitives for the admin auth flow.
 *
 * - `sha256` — opaque hash for storing reset tokens, OTPs, and trusted-device
 *   cookie values in the DB. Raw values exist only in transit; DB compromise
 *   alone cannot impersonate a user.
 * - `signTicket` / `verifyTicket` — HMAC-signed short-lived ticket used to
 *   complete sign-in once the password (and, when required, OTP) have been
 *   verified by our own server actions. The Credentials provider only
 *   trusts tickets — it never sees the password directly.
 * - `signChallenge` / `verifyChallenge` — same primitive, used for the
 *   `auth_challenge` cookie that links the password step to the OTP step.
 */
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!SECRET) {
  throw new Error("AUTH_SECRET (or NEXTAUTH_SECRET) must be set for admin auth");
}

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function generateOtp(): string {
  // 6-digit numeric code, leading zeros preserved.
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", SECRET!).update(payload).digest("base64url");
}

function signPayload(scope: string, data: Record<string, string | number>, ttlSeconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = JSON.stringify({ ...data, exp, s: scope });
  const b64 = Buffer.from(body, "utf8").toString("base64url");
  const sig = hmac(b64);
  return `${b64}.${sig}`;
}

function verifyPayload(scope: string, signed: string): Record<string, string | number> | null {
  const [b64, sig] = signed.split(".");
  if (!b64 || !sig) return null;
  const expected = hmac(b64);
  // timingSafeEqual requires equal-length buffers
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (decoded.s !== scope) return null;
    if (typeof decoded.exp !== "number" || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Login ticket — proves the password (and OTP, when needed) have been verified.
// The Credentials provider's `authorize` accepts only this.
export function signTicket(userId: string, ttlSeconds = 120): string {
  return signPayload("ticket", { uid: userId }, ttlSeconds);
}

export function verifyTicket(signed: string): { userId: string } | null {
  const data = verifyPayload("ticket", signed);
  if (!data || typeof data.uid !== "string") return null;
  return { userId: data.uid };
}

// Challenge cookie — binds the password step to the OTP step.
export function signChallenge(challengeId: string, userId: string, ttlSeconds = 600): string {
  return signPayload("challenge", { cid: challengeId, uid: userId }, ttlSeconds);
}

export function verifyChallenge(signed: string): { challengeId: string; userId: string } | null {
  const data = verifyPayload("challenge", signed);
  if (!data || typeof data.cid !== "string" || typeof data.uid !== "string") return null;
  return { challengeId: data.cid, userId: data.uid };
}
