import { Prisma } from '@prisma/client';

export async function generateInvoiceNo(
  prisma: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV-${year}${month}-`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNo: 'desc',
    },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    const lastNo = lastInvoice.invoiceNo;
    const lastNumberStr = lastNo.split('-').pop();
    if (lastNumberStr) {
      nextNumber = parseInt(lastNumberStr) + 1;
    }
  }

  const paddedNumber = nextNumber.toString().padStart(5, '0');
  return `${prefix}${paddedNumber}`;
}
