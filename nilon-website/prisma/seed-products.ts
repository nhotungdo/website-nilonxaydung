import 'dotenv/config';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  const dataPath = path.resolve(__dirname, '../data/products.ts');
  const dataStr = fs.readFileSync(dataPath, 'utf8');
  
  const startIdx = dataStr.indexOf('export const PRODUCTS: Product[] = [');
  const endIdx = dataStr.indexOf('];', startIdx);
  let productsStr = dataStr.substring(startIdx + 'export const PRODUCTS: Product[] = '.length, endIdx + 1);

  let products = [];
  try {
    products = eval('(' + productsStr + ')');
  } catch (e) {
    console.error("Eval error", e);
  }

  const safetyProducts = products.filter(p => p.category === 'bao-ho-lao-dong' || p.categorySlug === 'bao-ho-lao-dong');
  
  console.log(`Found ${safetyProducts.length} safety products to sync.`);

  let count = 0;
  for (const prod of safetyProducts) {
    try {
      await prisma.product.upsert({
        where: { sku: 'BHLD-' + prod.id },
        update: {
          name: prod.name || 'Unnamed',
          slug: prod.slug || prod.id,
          description: prod.description || '',
          image: prod.image || '',
          images: prod.images || [],
          price: prod.price || 0,
          unit: prod.unit || 'Cái',
          category: prod.category || 'Bảo hộ lao động',
          categorySlug: prod.categorySlug || 'bao-ho-lao-dong',
          subCategory: prod.subCategory || 'Khác',
          isBestSeller: prod.isBestSeller || false,
          isNew: prod.isNew || false,
          specs: prod.specs || [],
          stock: Math.floor(Math.random() * 100) + 20
        },
        create: {
          name: prod.name || 'Unnamed',
          sku: 'BHLD-' + prod.id,
          slug: prod.slug || prod.id,
          description: prod.description || '',
          image: prod.image || '',
          images: prod.images || [],
          price: prod.price || 0,
          unit: prod.unit || 'Cái',
          category: prod.category || 'Bảo hộ lao động',
          categorySlug: prod.categorySlug || 'bao-ho-lao-dong',
          subCategory: prod.subCategory || 'Khác',
          isBestSeller: prod.isBestSeller || false,
          isNew: prod.isNew || false,
          specs: prod.specs || [],
          stock: Math.floor(Math.random() * 100) + 20
        }
      });
      count++;
    } catch (e) {
      console.error('Error inserting product', prod.id, e);
    }
  }

  console.log(`Successfully synced ${count} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
