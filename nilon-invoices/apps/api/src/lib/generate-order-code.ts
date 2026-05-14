import { Prisma } from '@prisma/client';

export async function generateOrderCode(
  prisma: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `DH-${year}-`;

  const lastOrder = await prisma.order.findFirst({
    where: {
      orderCode: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderCode: 'desc',
    },
  });

  let nextNumber = 1;
  if (lastOrder) {
    const lastCode = lastOrder.orderCode;
    const lastNumberStr = lastCode.split('-').pop();
    if (lastNumberStr) {
      nextNumber = parseInt(lastNumberStr) + 1;
    }
  }

  const paddedNumber = nextNumber.toString().padStart(5, '0');
  return `${prefix}${paddedNumber}`;
}
