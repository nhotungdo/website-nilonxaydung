import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { PRODUCTS } from '../data/products';

async function main() {
  console.log('🌱 Seeding products from "data/products.ts" into PostgreSQL database...');
  
  try {
    let seededCount = 0;
    
    for (const p of PRODUCTS) {
      // Generate a mock SKU based on the slug or name if not exists
      const sku = `SKU-${p.id.toUpperCase()}`;
      
      await prisma.product.upsert({
        where: { sku },
        update: {
          name: p.name,
          price: p.price,
          stock: 999, // default stock quantity
          slug: p.slug,
          image: p.image || '',
          category: p.category || 'Khác',
          categorySlug: p.categorySlug || 'khac',
          subCategory: p.subCategory || '',
        },
        create: {
          id: p.id,
          name: p.name,
          sku,
          slug: p.slug,
          image: p.image || '',
          category: p.category || 'Khác',
          categorySlug: p.categorySlug || 'khac',
          subCategory: p.subCategory || '',
          price: p.price,
          stock: 999,
        },
      });
      seededCount++;
    }
    
    console.log(`✅ Seeding completed! Seeded ${seededCount} products successfully.`);
  } catch (error) {
    console.error('❌ Seeding failed!');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
