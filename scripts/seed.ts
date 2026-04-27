/**
 * Idempotent seed script. Run via: npm run db:seed
 *
 * Creates:
 *  - 1 super admin user
 *  - 5 product categories
 *  - 21 products + variants (from src/lib/store-data.ts)
 *  - 18 staff members (with CDN photo URLs — replaced by image-migration script)
 *  - Default shipping rate tiers
 *
 * Re-running is safe: existing rows (matched by unique fields) are updated, not duplicated.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // also load .env if present
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../src/lib/db/schema";
import { PRODUCTS, CATEGORIES } from "../src/lib/store-data";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const STAFF: Array<{
  name: string;
  title: string;
  section: "directors" | "division_heads" | "assistant_heads" | "founders";
  sortOrder: number;
  bio: string;
  photoUrl: string | null;
}> = [
  {
    name: "Roger Breene",
    title: "Director",
    section: "directors",
    sortOrder: 0,
    bio: "Roger Breene is Marianne and Harold's oldest child. Camp has been a part of Roger's life since it started in 1962. He was a camper, and then worked on the maintenance staff, as a swim instructor and lifeguard and then as the Waterfront Director. It was during his time as Waterfront Director that Roger met his wife, Debbie, who was then a counselor. To this day, she continues to serve as the head of F Division. Roger returned to Camp in approximately 1997 as an Assistant Director, after working full-time as a practicing attorney. Now retired from the practice of law, Roger loves to spend the off-season pursuing his hobbies, which include golf, cycling, skiing and paddle tennis, and of course visiting his grandchildren in Colorado and spending time with his grandchildren in Summit!",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111636/ROGER-1-scaled-e1700583441427.jpg",
  },
  {
    name: "Jill Breene Cheng",
    title: "Director",
    section: "directors",
    sortOrder: 1,
    bio: "Jill Breene Cheng has been at Camp Riverbend since she was 5 years old. She started typing camper lists (on a typewriter, with carbon paper!) while she was still in high school. She worked side by side with her Dad, Harold, learning how to run a camp from a very young age. Jill graduated from the College of New Jersey with a degree in Art Therapy. She has three children who have all been campers and counselors at Camp Riverbend and now is the grandmother to two girls and one boy. Her interests are travel and design and playing with her grandchildren.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111308/JILL-2-scaled-e1700583298834.jpg",
  },
  {
    name: "Paul Breene",
    title: "Director",
    section: "directors",
    sortOrder: 2,
    bio: "Paul Breene grew up at Riverbend and only left for a few years to get a law degree. Paul is married to our program director, Miriam Peretsman and is the father of two former campers and counselors. Paul loves everything about camp and looks forward every year to the first day of staff orientation, which is kind of like baseball spring training in that it is filled with anticipation of another great season with our incredibly talented and devoted staff. Paul loves to help lead morning assemblies and especially loves leading the campfires when D, E and F Division groups have their late nights. In his spare time, Paul gardens, skis, golfs (badly), and reads.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Paul.jpg",
  },
  {
    name: "Robin Breene Hetrick",
    title: "Waterfront Director",
    section: "directors",
    sortOrder: 3,
    bio: "Robin Breene Hetrick was too young to be a camper when Camp Riverbend opened, so she toddled around camp with her babysitter. Robin graduated from the University of Delaware with a degree in Physical Therapy. She worked as a physical therapist full time for 6 years and then came back to camp. Robin has been the Waterfront Director since the early 1990s. Both her daughters worked at camp and got married here too. In the off-season she spends time in Florida playing golf and of course swimming! Continuing a tradition started by her father, Robin does cartwheels every Friday afternoon to mark the successful completion of another week at camp.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Robin.jpg",
  },
  {
    name: "Miriam Peretsman Breene",
    title: "Program Director",
    section: "division_heads",
    sortOrder: 0,
    bio: "Miriam Peretsman Breene had her first summer camp experience as a Girl Scout on Long Island. She has been here at Camp Riverbend since 1988, first as the newspaper editor for one year, and then as the program director every year since then. Miriam studied at the University of Pennsylvania and she met her husband Paul Breene during her (and his) junior year abroad in London. Miriam likes to read, snowshoe, bake and travel.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Miriam.jpg",
  },
  {
    name: "Katie Higgins",
    title: "Clubhouse Division Head",
    section: "division_heads",
    sortOrder: 1,
    bio: "Katie Higgins has a BA in Art Education and holds a MA in Early Childhood and Elementary Education. She is currently an Art Teacher at a local elementary school. She loves working with kids and getting them excited about new experiences! Katie remembers her first summer working as a junior counselor when she realized she wanted to continue to work with kids and make an impact in their lives. In her free time, Katie loves to travel, explore new places, go to museums, watch movies, snowboard and play sports.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Katie.jpg",
  },
  {
    name: "Jenni Hetrick Lawrence",
    title: "B Division Head",
    section: "division_heads",
    sortOrder: 2,
    bio: "Jenni Hetrick has been a Riverbender all her life and is part of the third generation of Breenes at Riverbend. She was a camper, a lifeguard, and a counselor before becoming a Division Head. Jenni has a Master's Degree in Elementary Education and worked as a teacher before becoming an Assistant Principal on the Upper West Side in Manhattan. Jenni currently lives in Hoboken and looks forward to the summer along with her two kids who are Riverbend regulars.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185933/Jenni.jpg",
  },
  {
    name: "Mike Glackin",
    title: "C Division Head",
    section: "division_heads",
    sortOrder: 3,
    bio: "Mike Glackin has been a counselor at Camp Riverbend since he was in college in 2005, following in the tracks of his mother who was a counselor in the 1970's. Mike is a high school teacher in Edison now. Mike met his wife Jen at Camp (another Riverbend romance) and at their wedding the happy couple came to Riverbend for a game of gaga after the ceremony! Now Mike and Jen have two kids who are also Riverbenders! Mike is an accomplished bagpiper who has performed at many of our Counselor Talent Shows.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Mike.jpg",
  },
  {
    name: "Brian Bigelow",
    title: "D Division Head",
    section: "division_heads",
    sortOrder: 4,
    bio: "Brian has been at Riverbend since 2005, as a group counselor and the Spirit specialist. During the school year, he teaches high school biology. Brian has degrees in Biology and Secondary Education. He's the father of two campers and, in his free time, he enjoys playing disc golf, coaching his son in soccer, beating Super Mario Odyssey, and obsessing over the 49ers, NJ Devils, and Yankees.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185930/Brian.jpg",
  },
  {
    name: "Jeff Kaesshaefer",
    title: "E Division Head",
    section: "division_heads",
    sortOrder: 5,
    bio: "Jeff Kaesshaefer has worked at Riverbend since 2003. He has taught elementary physical education at South Mountain School in South Orange since 1997. Jeff has 3 kids, all of whom were Riverbend campers in their day and later became counselors. During the school year, he coaches boys and girls lacrosse in his home town. To stay active, Jeff likes to run, play basketball, and spend time outdoors.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185929/Jeff.jpg",
  },
  {
    name: "Debbie Breene",
    title: "F Division Head",
    section: "division_heads",
    sortOrder: 6,
    bio: "Debbie Breene met her husband Roger Breene at Camp Riverbend in 1977 and has been working at camp ever since that time. She was a Spanish teacher for 5 years, had her family and then taught at the Co-op Nursery School in Summit for 20 years. Debbie is a substitute teacher in Summit at several elementary schools. She enjoys mah jongg, skiing, collecting sea glass at the Jersey shore, cooking and exercising with her Peloton. Debbie and Roger have four grandchildren who attend camp during the summer.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111829/DEBBIE-1-scaled-e1700583556726.jpg",
  },
  {
    name: "Emily Tomasulo",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 0,
    bio: "Camp Riverbend has always been a summer home for Emily. She was a Riverbend camper for 10 years, then worked as an E Division group counselor before becoming an Assistant Division Head. During the year she is a fourth grade teacher in Scotch Plains. This year Emily became a mom, and is excited for the day her son will love Riverbend too! In her spare time, Emily loves to hike, travel, go to country concerts, and bake!",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2022/01/04102033/Emily-Koprowski-2021-scaled.jpg",
  },
  {
    name: "Samira Brito",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 1,
    bio: "Samira first worked as a counselor at Camp Riverbend in 2007. After a few years away, she returned to Camp in 2019 and has been hooked ever since. Samira holds a B.A. in English from Seton Hall University and is a Primary Lead teacher in a Montessori school in Jersey City. Samira is a proud daughter of Jersey City girl, but thoroughly enjoys her summers outdoors at Riverbend. In her free time, Samira is a full-time soccer mom who cheers her son on from the side lines.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112004/SAMIRA-2-scaled-e1700583646185.jpg",
  },
  {
    name: 'Emily "Goldie" Goldstein',
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 2,
    bio: 'Emily has been teaching in Westfield for many years and takes great pride in her class, also known as "Goldie\'s Firsties". Emily has her Masters in Educational Leadership and Administration and an undergraduate sociology degree. She grew up going to day camp and loves that she gets to share the experience with her son. Emily likes to bake, listen to audiobooks and take walks outside.',
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112157/GOLDIE-scaled-e1700583751565.jpg",
  },
  {
    name: "Tamie Stearns",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 3,
    bio: 'Tamie has been a Special Education teacher since 2008, when she graduated from Seton Hall University. She instantly fell in love with the energy and atmosphere of Camp Riverbend when she joined the staff in 2021. Tamie loves to spend time with her husband and her two daughters (aka "the ladies"). She\'s a self-proclaimed "foodie" with an appreciation for houseplants. Her summers are now dedicated to the ladies and Camp Riverbend.',
    photoUrl: "https://cdn.campriverbend.com/2024/05/01145618/IMG_9867-scaled.jpg",
  },
  {
    name: "Mike Wnoroski",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 4,
    bio: "Michael joined the Camp Riverbend team as a group counselor in 2019. He has worked as a public school counselor in Passaic County for over a decade, helping countless elementary and middle school students navigate their academic and personal challenges. In addition to his professional achievements, Mike is a proud parent; his daughter was a camper and now works here too! In his free time, Mike enjoys spending time with his family, exploring the great outdoors, and playing the guitar.",
    photoUrl: "https://cdn.campriverbend.com/2024/05/01150635/IMG_9873-scaled.jpg",
  },
  {
    name: "Harold Breene",
    title: "Founder",
    section: "founders",
    sortOrder: 0,
    bio: "The late Harold Breene was involved in camping his whole life! After a stint in the Army during World War II, he earned a Masters Degree in Camping Education from NYU. He was the Athletic Director of a local private school, and then a college professor of Recreation and Camp Administration. Harold was a proud Eagle Scout, and was a scoutmaster in Berkeley Heights for many years. He was also a stalwart member of the American Camp Association, serving as President of the New Jersey section and of the Association of Independent Camps. He worked to improve camp quality nationwide as a member of the national ACA Standards Board. Harold passed away in 2019 but his legacy will continue to inspire generations of campers and counselors.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190100/Harold-Breene-LR.jpg",
  },
  {
    name: "Marianne Breene",
    title: "Founder",
    section: "founders",
    sortOrder: 1,
    bio: "The late Marianne Breene was the very first counselor for our preschool campers. For many years she was the director of the Summit Co-Op Nursery School. She earned a degree in Early Childhood Education from Kean University when her own children were in college and high school. She was an avid bridge player and loved to read and go to the theater. She and Harold had 4 children and 10 grandchildren, who have been campers and then counselors. Marianne passed away in 2017 but her values continue to inspire how Camp Riverbend is run.",
    photoUrl: "https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190059/Marianne-Breene-LR.jpg",
  },
];

const SHIPPING_TIERS = [
  { name: "Light (under 1 lb)", minWeightOz: 0, maxWeightOz: 16, price: "5.00" },
  { name: "Medium (1–3 lb)", minWeightOz: 17, maxWeightOz: 48, price: "8.00" },
  { name: "Heavy (over 3 lb)", minWeightOz: 49, maxWeightOz: null, price: "12.00" },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@campriverbend.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMeNow!2026";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
  if (existing.length) {
    console.log(`✓ Admin already exists: ${email}`);
    return;
  }
  await db.insert(schema.adminUsers).values({
    email,
    passwordHash,
    name: "Camp Riverbend Admin",
    role: "super_admin",
  });
  console.log(`✓ Created super admin: ${email}`);
  console.log(`  Initial password: ${password}`);
  console.log(`  (override with ADMIN_EMAIL / ADMIN_PASSWORD env vars on next run)`);
}

async function seedCategories() {
  const cats = CATEGORIES.filter((c) => c.slug !== "all");
  for (let i = 0; i < cats.length; i++) {
    const c = cats[i];
    const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, c.slug)).limit(1);
    if (existing.length) continue;
    await db.insert(schema.categories).values({ name: c.name, slug: c.slug, sortOrder: i });
  }
  const all = await db.select().from(schema.categories);
  console.log(`✓ Categories: ${all.length}`);
  return new Map(all.map((c) => [c.slug, c.id]));
}

async function seedProducts(catMap: Map<string, string>) {
  let created = 0;
  let updated = 0;
  for (const p of PRODUCTS) {
    const existing = await db.select().from(schema.products).where(eq(schema.products.slug, p.slug)).limit(1);
    let productId: string;
    if (existing.length) {
      productId = existing[0].id;
      await db
        .update(schema.products)
        .set({
          name: p.name,
          price: p.price,
          categoryId: catMap.get(p.categorySlug) ?? null,
          images: p.images,
          isActive: p.isActive,
          updatedAt: new Date(),
        })
        .where(eq(schema.products.id, productId));
      updated++;
    } else {
      const [row] = await db
        .insert(schema.products)
        .values({
          name: p.name,
          slug: p.slug,
          price: p.price,
          categoryId: catMap.get(p.categorySlug) ?? null,
          images: p.images,
          isActive: p.isActive,
        })
        .returning();
      productId = row.id;
      created++;
    }

    // Variants — recreate for simplicity (small dataset)
    await db.delete(schema.productVariants).where(eq(schema.productVariants.productId, productId));
    if (p.variants.length) {
      await db.insert(schema.productVariants).values(
        p.variants.map((v, i) => ({
          productId,
          name: v.name,
          sortOrder: i,
        }))
      );
    }
  }
  console.log(`✓ Products: ${created} created, ${updated} updated, ${PRODUCTS.length} total`);
}

async function seedStaff() {
  let created = 0;
  let updated = 0;
  for (const s of STAFF) {
    // Match by name (no unique constraint, but names are stable)
    const existing = await db.select().from(schema.staffMembers).where(eq(schema.staffMembers.name, s.name)).limit(1);
    if (existing.length) {
      await db
        .update(schema.staffMembers)
        .set({
          title: s.title,
          bio: s.bio,
          section: s.section,
          sortOrder: s.sortOrder,
          // Only update photoUrl if currently null — preserves migrated Blob URLs
          ...(existing[0].photoUrl ? {} : { photoUrl: s.photoUrl }),
          updatedAt: new Date(),
        })
        .where(eq(schema.staffMembers.id, existing[0].id));
      updated++;
    } else {
      await db.insert(schema.staffMembers).values({
        name: s.name,
        title: s.title,
        bio: s.bio,
        section: s.section,
        sortOrder: s.sortOrder,
        photoUrl: s.photoUrl,
        isActive: true,
      });
      created++;
    }
  }
  console.log(`✓ Staff: ${created} created, ${updated} updated, ${STAFF.length} total`);
}

async function seedShipping() {
  for (const tier of SHIPPING_TIERS) {
    const existing = await db.select().from(schema.shippingRates).where(eq(schema.shippingRates.name, tier.name)).limit(1);
    if (existing.length) continue;
    await db.insert(schema.shippingRates).values(tier);
  }
  const all = await db.select().from(schema.shippingRates);
  console.log(`✓ Shipping rates: ${all.length}`);
}

async function main() {
  console.log("Seeding Camp Riverbend database…");
  await seedAdmin();
  const catMap = await seedCategories();
  await seedProducts(catMap);
  await seedStaff();
  await seedShipping();
  console.log("\n✅ Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
