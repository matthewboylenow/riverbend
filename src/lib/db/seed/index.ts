import './env';
import { seedAdmin } from './admin';
import { seedCategories } from './categories';
import { seedProducts } from './products';
import { seedStaff } from './staff';
import { seedShipping } from './shipping';
import { seedRates } from './rates';
import { seedPageContent } from './page-content';

async function run() {
  console.log('\n▶ Seeding database (idempotent)...\n');
  await seedAdmin();
  await seedCategories();
  await seedProducts();
  await seedStaff();
  await seedShipping();
  await seedRates();
  await seedPageContent();
  console.log('\n✓ Seed complete.\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
