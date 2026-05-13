import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfToday = new Date(startOfToday.getTime() + 86400000);

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInvoices,
      todayOrders,
      todayRevenue,
      totalRevenue,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.order.count({ where: { deletedAt: null } }),
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count({
        where: { deletedAt: null, status: 'ISSUED' },
      }),
      this.prisma.order.count({
        where: {
          deletedAt: null,
          createdAt: { gte: startOfToday, lt: endOfToday },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          deletedAt: null,
          createdAt: { gte: startOfToday, lt: endOfToday },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { deletedAt: null, status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.product.count({
        where: { deletedAt: null, stock: { lte: 20 } },
      }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInvoices,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount ?? 0,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      lowStockProducts,
    };
  }

  async getRevenueChart() {
    const days = 7;
    const result: {
      name: string;
      date: string;
      revenue: number;
      orders: number;
    }[] = [];
    const dayNames = [
      'Chủ Nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const end = new Date(start.getTime() + 86400000);

      const [revenue, orders] = await Promise.all([
        this.prisma.order.aggregate({
          where: {
            deletedAt: null,
            createdAt: { gte: start, lt: end },
          },
          _sum: { totalAmount: true },
        }),
        this.prisma.order.count({
          where: {
            deletedAt: null,
            createdAt: { gte: start, lt: end },
          },
        }),
      ]);

      result.push({
        name: dayNames[date.getDay()],
        date: start.toISOString().split('T')[0],
        revenue: Number(revenue._sum.totalAmount ?? 0),
        orders,
      });
    }

    return result;
  }

  async getTopProducts(limit = 5) {
    const items = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, price: true, stock: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity ?? 0,
        };
      }),
    );

    return products.filter(Boolean);
  }

  async getOrderStatusCounts() {
    const statuses = [
      'PENDING',
      'CONFIRMED',
      'SHIPPING',
      'COMPLETED',
      'CANCELLED',
    ];
    const result = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await this.prisma.order.count({
          where: { deletedAt: null, status: status as OrderStatus },
        }),
      })),
    );
    return result;
  }
}
