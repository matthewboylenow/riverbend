import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { adminUsers } from '../schema';

export async function seedAdmin() {
  const email = process.env.ADMIN_INITIAL_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const name = process.env.ADMIN_INITIAL_NAME || 'Admin';

  if (!email || !password) {
    console.log('  skip admin: ADMIN_INITIAL_EMAIL / ADMIN_INITIAL_PASSWORD not set');
    return;
  }

  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  if (existing) {
    console.log(`  admin exists: ${email}`);
    return;
  }

  const passwordHash = await hash(password, 12);
  await db.insert(adminUsers).values({
    email,
    passwordHash,
    name,
    role: 'super_admin',
  });
  console.log(`  + super_admin: ${email}`);
}
