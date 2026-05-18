import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, items: true }
    });
    console.log(`[CHECK] Orders count: ${orders.length}`);
    console.log(JSON.stringify(orders, null, 2));

    const customers = await prisma.customer.findMany();
    console.log(`[CHECK] Customers count: ${customers.length}`);

    const products = await prisma.product.findMany();
    console.log(`[CHECK] Products count: ${products.length}`);
  } catch (err: any) {
    console.error('[CHECK] Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
