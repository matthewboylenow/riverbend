import { eq } from 'drizzle-orm';
import { db } from '../index';
import { categories, products, productVariants } from '../schema';

type Row = {
  name: string;
  slug: string;
  price: string;
  categorySlug: string;
  variants: string[];
  description?: string;
};

const rows: Row[] = [
  { name: 'Adult Performance Dri-Fit Long Sleeve Hoodie', slug: 'adult-performance-dri-fit-long-sleeve-hoodie', price: '25.00', categorySlug: 'adult-clothing', variants: ['Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Camp Riverbend Embroidered Backpack', slug: 'camp-riverbend-embroidered-backpack', price: '30.00', categorySlug: 'backpacks', variants: [] },
  { name: 'Camp Riverbend Performance Grey Hat (Adult)', slug: 'camp-riverbend-performance-grey-hat-adult', price: '25.00', categorySlug: 'adult-clothing', variants: [] },
  { name: 'Camp Riverbend White Hat (Adult)', slug: 'camp-riverbend-white-hat-adult', price: '25.00', categorySlug: 'adult-clothing', variants: [] },
  { name: 'Girls Ribbed Tank Tops (Red)', slug: 'girls-ribbed-tank-tops-red', price: '20.00', categorySlug: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L'] },
  { name: 'Kids Performance Dri-Fit Short Sleeve Hoodie', slug: 'kids-performance-dri-fit-short-sleeve-hoodie', price: '20.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Youth XL'] },
  { name: 'Camper T-Shirt', slug: 'camper-t-shirt', price: '12.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Camper Tank Top', slug: 'camper-tank-top', price: '15.00', categorySlug: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Crewneck Sweatshirt (Grey)', slug: 'crewneck-sweatshirt-grey', price: '30.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Crewneck Sweatshirt (Red)', slug: 'crewneck-sweatshirt-red', price: '30.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Hooded Sweatshirt (Red)', slug: 'hooded-sweatshirt-red', price: '30.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Hooded Sweatshirt (Grey)', slug: 'hooded-sweatshirt-grey', price: '30.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { name: 'Boys / Mens Shorts', slug: 'boys-mens-shorts', price: '25.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Girls / Womens Shorts', slug: 'girls-womens-shorts', price: '25.00', categorySlug: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Rash Guard', slug: 'rash-guard', price: '30.00', categorySlug: 'boys-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Socks', slug: 'socks', price: '12.00', categorySlug: 'accessories', variants: ['Youth', 'Adult'] },
  { name: 'Baseball Hats', slug: 'baseball-hats', price: '25.00', categorySlug: 'boys-clothing', variants: ['Youth', 'Adult'] },
  { name: 'Winter Beanie', slug: 'winter-beanie', price: '15.00', categorySlug: 'boys-clothing', variants: [] },
  { name: 'Gaga Gloves', slug: 'gaga-gloves', price: '25.00', categorySlug: 'accessories', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Neck Gaiter', slug: 'neck-gaiter', price: '5.00', categorySlug: 'boys-clothing', variants: [] },
  { name: 'Backpack #1', slug: 'backpack-1', price: '30.00', categorySlug: 'backpacks', variants: [] },
  { name: 'Lace Up Sweatshirt', slug: 'lace-up-sweatshirt', price: '30.00', categorySlug: 'girls-clothing', variants: ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L'] },
  { name: 'Duffel Bag', slug: 'duffel-bag', price: '35.00', categorySlug: 'backpacks', variants: [] },
  { name: 'Backpack (Original)', slug: 'backpack-original', price: '30.00', categorySlug: 'backpacks', variants: [] },
];

export async function seedProducts() {
  const cats = await db.select().from(categories);
  const bySlug = new Map(cats.map((c) => [c.slug, c.id]));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const categoryId = bySlug.get(row.categorySlug) ?? null;

    const existing = await db.query.products.findFirst({
      where: eq(products.slug, row.slug),
    });
    if (existing) continue;

    const [inserted] = await db
      .insert(products)
      .values({
        name: row.name,
        slug: row.slug,
        price: row.price,
        categoryId,
        description: row.description ?? null,
        images: [],
        isActive: true,
        requiresShipping: true,
        sortOrder: i,
      })
      .returning({ id: products.id });

    for (let v = 0; v < row.variants.length; v++) {
      await db.insert(productVariants).values({
        productId: inserted.id,
        name: row.variants[v],
        stock: 0,
        isActive: true,
        sortOrder: v,
      });
    }
    console.log(`  + product: ${row.name} (${row.variants.length} variants)`);
  }
}
