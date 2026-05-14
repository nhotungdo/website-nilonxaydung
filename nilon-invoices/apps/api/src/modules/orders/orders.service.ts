import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';
import { generateOrderCode } from '../../lib/generate-order-code.js';

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
                { orderCode: { contains: search, mode: 'insensitive' } },
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
        items: true,
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

  async create(data: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    note?: string;
    userId: string;
  }) {
    const { customerId, items, note, userId } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch all products and check stock
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== items.length) {
        throw new NotFoundException('Một hoặc nhiều sản phẩm không tồn tại');
      }

      // 2. Calculate totals and check stock
      let subtotal = 0;
      let totalQuantity = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        if (item.quantity > product.stock) {
          throw new Error(
            `Sản phẩm ${product.name} không đủ tồn kho (Còn ${product.stock})`,
          );
        }

        const priceSnapshot = Number(product.price);
        const itemSubtotal = priceSnapshot * item.quantity;

        subtotal += itemSubtotal;
        totalQuantity += item.quantity;

        orderItemsData.push({
          productId: product.id,
          productNameSnapshot: product.name,
          skuSnapshot: product.slug, // Using slug as SKU if SKU is not explicit
          priceSnapshot,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        });
      }

      // 3. Generate Order Code
      const orderCode = await generateOrderCode(tx);

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          orderCode,
          customerId,
          note,
          subtotal,
          total: subtotal, // Assuming total = subtotal for now (no tax/discount)
          totalItems: items.length,
          totalQuantity,
          status: 'PENDING',
          createdBy: userId,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // 5. Update Stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
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
