import { eq } from 'drizzle-orm';
import { db } from '../index';
import { tuitionRates, tuitionDiscounts, paymentSchedule } from '../schema';

const rates = [
  { duration: '7 Weeks',       inCamp: '$8,375', dayTripper: '$9,170', threeQuarter: '$7,450', sortOrder: 0 },
  { duration: 'Any 6 Weeks',   inCamp: '$7,820', dayTripper: '$8,640', threeQuarter: '$6,570', sortOrder: 1 },
  { duration: 'Any 5 Weeks',   inCamp: '$7,230', dayTripper: '$7,950', threeQuarter: '$5,765', sortOrder: 2 },
  { duration: 'Any 4 Weeks',   inCamp: '$6,470', dayTripper: '$7,200', threeQuarter: '$4,840', sortOrder: 3 },
  { duration: 'Any 3 Weeks',   inCamp: '$5,215', dayTripper: '$6,150', threeQuarter: '$3,800', sortOrder: 4 },
  { duration: 'Any 2 Weeks',   inCamp: '$3,970', dayTripper: '$4,875', threeQuarter: '$2,710', sortOrder: 5 },
];

const discounts = [
  { heading: 'Sibling Discount (2nd Child)', body: 'Deduct $300 from 7 or 6 week tuition, $250 from 5 week, $200 from 4 or 3 week, or $150 from 2 week tuition.', sortOrder: 0 },
  { heading: '3rd+ Child', body: 'Deduct $500 from 7 or 6 week, $400 from 5 week, $300 from 4 or 3 week, or $200 from 2 week tuition.', sortOrder: 1 },
  { heading: 'Early Bird (First Two Weeks Only)', body: 'If you enroll only for the first two weeks of camp (June 29 and July 7), deduct $300 from total tuition.', sortOrder: 2 },
];

const payments = [
  { label: 'At Application', detail: '$500 deposit per camper ($200 becomes non-refundable registration fee)', sortOrder: 0 },
  { label: 'January 6', detail: '$2,000 per camper payment', sortOrder: 1 },
  { label: 'April 1', detail: 'Final tuition payment due', sortOrder: 2 },
];

export async function seedRates() {
  for (const r of rates) {
    const exists = await db.query.tuitionRates.findFirst({ where: eq(tuitionRates.duration, r.duration) });
    if (!exists) { await db.insert(tuitionRates).values(r); console.log(`  + rate: ${r.duration}`); }
  }
  for (const d of discounts) {
    const exists = await db.query.tuitionDiscounts.findFirst({ where: eq(tuitionDiscounts.heading, d.heading) });
    if (!exists) { await db.insert(tuitionDiscounts).values(d); console.log(`  + discount: ${d.heading}`); }
  }
  for (const p of payments) {
    const exists = await db.query.paymentSchedule.findFirst({ where: eq(paymentSchedule.label, p.label) });
    if (!exists) { await db.insert(paymentSchedule).values(p); console.log(`  + payment: ${p.label}`); }
  }
}
