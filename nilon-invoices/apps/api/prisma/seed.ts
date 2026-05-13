import { PrismaClient } from '@prisma/client';
import { CATEGORIES } from '../src/data/categories';
import { PRODUCTS } from '../src/data/products';
import { generateSlug } from '../src/lib/slug';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomStock(): number {
  return Math.floor(Math.random() * 500) + 10;
}

async function main() {
  console.log('--- Starting Seed ---');

  // 0. Seed Admin User
  console.log('Seeding Admin User...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@nilon.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@nilon.com',
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
    },
  });

  // 1. Seed Categories
  console.log('Seeding Categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        featured: cat.featured,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        featured: cat.featured,
      },
    });
  }

  // 2. Pre-seed Tags
  console.log('Seeding Tags...');
  const tags = ['Bảo hộ lao động', 'Vật tư công trình'];
  for (const tagName of tags) {
    const tagSlug = generateSlug(tagName);
    await prisma.productTag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name: tagName, slug: tagSlug },
    });
  }

  // 3. Seed Products
  console.log('Seeding Products...');
  const allCategories = await prisma.category.findMany();
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found: ${prod.categorySlug} for product ${prod.name}`);
      continue;
    }

    const slug = generateSlug(prod.name);
    const price = randomPrice(10000, 500000);
    const stock = randomStock();
    const seoTitle = `${prod.name} - Chất lượng cao, Giá tốt | Nilon Xây Dựng`;
    const seoDescription = `Mua ${prod.name} uy tín, giá rẻ tại xưởng. ${prod.name} chuyên dụng cho công trình xây dựng và bảo hộ lao động.`;

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: prod.name,
        price: price,
        unit: prod.unit,
        stock: stock,
        bestseller: prod.bestseller || false,
        featured: true,
        description: `Sản phẩm ${prod.name} chất lượng cao, bền bỉ, đáp ứng tiêu chuẩn an toàn lao động.`,
        shortDescription: `Cung cấp ${prod.name} sỉ và lẻ cho các công trình.`,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        categoryId: categoryId,
        tags: {
          connect: tags.map(t => ({ slug: generateSlug(t) }))
        }
      },
      create: {
        name: prod.name,
        slug: slug,
        price: price,
        unit: prod.unit,
        stock: stock,
        bestseller: prod.bestseller || false,
        featured: true,
        description: `Sản phẩm ${prod.name} chất lượng cao, bền bỉ, đáp ứng tiêu chuẩn an toàn lao động.`,
        shortDescription: `Cung cấp ${prod.name} sỉ và lẻ cho các công trình.`,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        categoryId: categoryId,
        tags: {
          connect: tags.map(t => ({ slug: generateSlug(t) }))
        }
      },
    });
  }


  console.log('--- Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

