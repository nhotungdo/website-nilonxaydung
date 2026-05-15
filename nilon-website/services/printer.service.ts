import axios from 'axios';
import { prisma } from '@/lib/prisma';

const PRINTER_API_URL = process.env.PRINTER_API_URL || 'http://localhost:5000/api/print-orders';
const API_SECRET_KEY = process.env.API_SECRET_KEY || '';

export const PrinterService = {
  async sendToPrinter(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }

    try {
      const response = await axios.post(
        PRINTER_API_URL,
        {
          orderCode: order.orderCode,
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
          totalAmount: order.totalAmount,
          items: order.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        {
          headers: {
            'x-api-key': API_SECRET_KEY,
          },
          timeout: 10000, // 10 seconds
        }
      );

      if (response.status === 200) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'sent_to_printer' },
        });

        await prisma.printQueue.update({
          where: { orderId },
          data: { status: 'sent', updatedAt: new Date() },
        });

        return true;
      }
    } catch (error: any) {
      console.error(`Error sending order ${order.orderCode} to printer:`, error.message);
      
      const retryCount = await this.updateRetryCount(orderId, error.message);
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'failed' },
      });

      return false;
    }
  },

  async updateRetryCount(orderId: string, error: string) {
    const queue = await prisma.printQueue.findUnique({
      where: { orderId },
    });

    if (queue) {
      const newRetryCount = queue.retryCount + 1;
      await prisma.printQueue.update({
        where: { orderId },
        data: {
          retryCount: newRetryCount,
          status: 'failed',
          lastError: error,
          updatedAt: new Date(),
        },
      });
      return newRetryCount;
    }
    return 0;
  }
};
