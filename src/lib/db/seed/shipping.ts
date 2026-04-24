import { eq } from 'drizzle-orm';
import { db } from '../index';
import { shippingRates } from '../schema';

const data = [
  { name: 'Standard Shipping', minWeightOz: 0, maxWeightOz: 32, price: '5.99' },
  { name: 'Standard Shipping (Heavy)', minWeightOz: 33, maxWeightOz: 160, price: '9.99' },
  { name: 'Free Pickup at Camp', minWeightOz: 0, maxWeightOz: null, price: '0.00' },
];

export async function seedShipping() {
  for (const row of data) {
    const existing = await db.query.shippingRates.findFirst({
      where: eq(shippingRates.name, row.name),
    });
    if (existing) continue;
    await db.insert(shippingRates).values(row);
    console.log(`  + shipping: ${row.name}`);
  }
}
