import { eq } from 'drizzle-orm';
import { db } from '../index';
import { categories } from '../schema';

const data = [
  { name: 'Adult Clothing', slug: 'adult-clothing', sortOrder: 0 },
  { name: 'Boys Clothing', slug: 'boys-clothing', sortOrder: 1 },
  { name: 'Girls Clothing', slug: 'girls-clothing', sortOrder: 2 },
  { name: 'Accessories', slug: 'accessories', sortOrder: 3 },
  { name: 'Backpacks', slug: 'backpacks', sortOrder: 4 },
];

export async function seedCategories() {
  for (const row of data) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, row.slug),
    });
    if (existing) continue;
    await db.insert(categories).values(row);
    console.log(`  + category: ${row.name}`);
  }
}
