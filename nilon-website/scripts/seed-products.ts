import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PRODUCTS } from '../data/products';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL_STRICT === 'true'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding products from data/products.ts to database...');
  
  for (const p of PRODUCTS) {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: p.id },
      });

      const productData = {
        name: p.name,
        sku: p.id,
        slug: p.slug,
        description: p.description || undefined,
        image: p.image,
        images: p.images ? JSON.stringify(p.images) : Prisma.JsonNull,
        price: p.price,
        stock: 100, // default stock for seeded items
        unit: p.unit,
        category: p.category,
        categorySlug: p.categorySlug,
        subCategory: p.subCategory,
        isBestSeller: p.isBestSeller || false,
        isNew: p.isNew || false,
        specs: p.specs ? JSON.stringify(p.specs) : Prisma.JsonNull,
      };

      if (existingProduct) {
        await prisma.product.update({
          where: { sku: p.id },
          data: productData,
        });
        console.log(`Updated product: ${p.name}`);
      } else {
        await prisma.product.create({
          data: productData,
        });
        console.log(`Created product: ${p.name}`);
      }
    } catch (e) {
      console.error(`Error processing product ${p.name}:`, e);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
