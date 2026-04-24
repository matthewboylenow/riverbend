import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import { pageContent } from '../schema';
import { PAGE_CONTENT } from './page-content-data';

export async function seedPageContent() {
  for (const block of PAGE_CONTENT) {
    const existing = await db.query.pageContent.findFirst({
      where: and(
        eq(pageContent.pageSlug, block.pageSlug),
        eq(pageContent.sectionKey, block.sectionKey)
      ),
    });
    if (existing) continue;
    await db.insert(pageContent).values(block);
    console.log(`  + content: ${block.pageSlug}/${block.sectionKey}`);
  }
}
