import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';

config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  const dir = path.resolve(process.cwd(), 'drizzle');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const content = readFileSync(path.join(dir, file), 'utf-8');
    const statements = content
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`\nApplying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt);
      } catch (err) {
        const msg = (err as Error).message;
        // Ignore already-exists errors — makes this idempotent
        if (msg.includes('already exists') || msg.includes('duplicate key')) {
          console.log(`  skip (exists): ${stmt.split('\n')[0].slice(0, 60)}...`);
          continue;
        }
        console.error(`  FAIL: ${stmt.split('\n')[0].slice(0, 80)}...`);
        throw err;
      }
    }
  }
  console.log('\n✓ Migrations applied');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
