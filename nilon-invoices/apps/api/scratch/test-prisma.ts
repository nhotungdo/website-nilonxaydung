import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.order.aggregate({
    _sum: {
      total: true
    }
  });
  console.log('Result:', result);
}

main();
