import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import { staffMembers } from '../schema';
import { STAFF_ROWS } from './staff-data';

export async function seedStaff() {
  for (const row of STAFF_ROWS) {
    const existing = await db.query.staffMembers.findFirst({
      where: and(
        eq(staffMembers.name, row.name),
        eq(staffMembers.section, row.section)
      ),
    });
    if (existing) continue;
    await db.insert(staffMembers).values({
      name: row.name,
      title: row.title,
      section: row.section,
      sortOrder: row.sortOrder,
      bio: row.bio,
      isActive: true,
    });
    console.log(`  + staff: ${row.name}`);
  }
}
