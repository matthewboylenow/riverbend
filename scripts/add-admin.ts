/**
 * One-off: add an admin user.
 * Usage: tsx scripts/add-admin.ts <email> <password> [name] [role]
 *   role defaults to "super_admin"
 *
 * Example:
 *   tsx scripts/add-admin.ts matthew@adventii.com 'Hrz428486mb!@' 'Matthew Boyle'
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../src/lib/db/schema";

const [, , emailArg, passwordArg, nameArg, roleArg] = process.argv;

if (!emailArg || !passwordArg) {
  console.error("Usage: tsx scripts/add-admin.ts <email> <password> [name] [role]");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL required");
}

const role = roleArg === "admin" ? "admin" : "super_admin";
const name = nameArg || emailArg.split("@")[0];
const email = emailArg.toLowerCase().trim();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  const passwordHash = await bcrypt.hash(passwordArg, 10);

  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1);

  if (existing.length) {
    await db
      .update(schema.adminUsers)
      .set({ passwordHash, name, role, updatedAt: new Date() })
      .where(eq(schema.adminUsers.email, email));
    console.log(`✓ Updated admin: ${email} (role=${role})`);
  } else {
    await db.insert(schema.adminUsers).values({
      email,
      passwordHash,
      name,
      role,
    });
    console.log(`✓ Created admin: ${email} (role=${role})`);
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
