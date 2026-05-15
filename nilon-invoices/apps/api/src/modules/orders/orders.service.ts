import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';
import { generateOrderCode } from '../../lib/generate-order-code';
import { generateInvoiceNo } from '../../lib/generate-invoice-no';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

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

    const order = await this.prisma.$transaction(async (tx) => {
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
      const createdOrder = await tx.order.create({
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

      // 6. Create Draft Invoice
      const invoiceNo = await generateInvoiceNo(tx);
      await tx.invoice.create({
        data: {
          invoiceNo,
          orderId: createdOrder.id,
          totalAmount: subtotal,
          status: 'DRAFT',
        },
      });

      return createdOrder;
    });

    // Send Telegram Notification
    try {
      const message = [
        `<b>🆕 ĐƠN HÀNG MỚI: ${order.orderCode}</b>`,
        `👤 Khách hàng: <b>${order.customer.name}</b>`,
        `💰 Tổng tiền: <b>${Number(order.total).toLocaleString('vi-VN')}đ</b>`,
        `📦 Số lượng SP: <b>${order.totalItems}</b> items`,
        `📝 Ghi chú: ${order.note || '<i>Không có</i>'}`,
        `🔗 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/orders/${order.id}">Xem chi tiết đơn hàng</a>`,
      ].join('\n');

      await this.telegramService.sendMessage(message);
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send Telegram notification:', error);
    }

    return order;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        customer: { select: { id: true, name: true } },
      },
    });

    // Send Notification for important status changes
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      try {
        const statusText = status === 'CONFIRMED' ? '✅ ĐÃ XÁC NHẬN' : '❌ ĐÃ HỦY';
        const message = [
          `<b>${statusText}: ${updatedOrder.orderCode}</b>`,
          `👤 Khách hàng: <b>${updatedOrder.customer.name}</b>`,
          `💰 Tổng tiền: <b>${Number(updatedOrder.total).toLocaleString('vi-VN')}đ</b>`,
          `🔗 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/orders/${updatedOrder.id}">Xem chi tiết đơn hàng</a>`,
        ].join('\n');

        await this.telegramService.sendMessage(message);
      } catch (error) {
        console.error('Failed to send status update notification:', error);
      }
    }

    return updatedOrder;
  }
}
