import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.invoice.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { invoiceNo: { contains: search, mode: 'insensitive' } },
                {
                  order: {
                    customer: {
                      name: { contains: search, mode: 'insensitive' },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        order: {
          include: {
            customer: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, deletedAt: null },
      include: {
        order: {
          include: {
            customer: true,
            items: { include: { product: true } },
          },
        },
      },
    });
    if (!invoice) throw new NotFoundException('Hóa đơn không tồn tại');
    return invoice;
  }

  async getStats() {
    const [total, paid, pending, overdue] = await Promise.all([
      this.prisma.invoice.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count({
        where: { deletedAt: null, status: 'PAID' },
      }),
      this.prisma.invoice.count({
        where: { deletedAt: null, status: 'ISSUED' },
      }),
      this.prisma.invoice.count({
        where: {
          deletedAt: null,
          status: 'ISSUED',
          dueDate: { lt: new Date() },
        },
      }),
    ]);
    return { total, paid, pending, overdue };
  }
}
