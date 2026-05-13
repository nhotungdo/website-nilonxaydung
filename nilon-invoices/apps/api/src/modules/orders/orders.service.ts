import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, status?: string) {
    return this.prisma.order.findMany({
      where: {
        deletedAt: null,
        ...(status ? { status: status as OrderStatus } : {}),
        ...(search
          ? {
              OR: [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                {
                  customer: {
                    name: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  customer: {
                    phone: { contains: search, mode: 'insensitive' },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        customer: true,
        items: { include: { product: true } },
        invoice: true,
      },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async findRecent(limit = 5) {
    return this.prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        customer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });
  }
}
