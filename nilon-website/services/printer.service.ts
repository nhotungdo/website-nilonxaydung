import { prisma } from '@/lib/prisma';

export const PrinterService = {
  async sendToPrinter(orderId: string) {
    try {
      // Trigger PostgreSQL NOTIFY to let the desktop app know there is a new order
      await prisma.$executeRawUnsafe(`NOTIFY new_order, '${orderId}'`);
      console.log(`🔊 Triggered PostgreSQL NOTIFY for new order: ${orderId}`);
      return true;
    } catch (error) {
      console.error('Error triggering PostgreSQL NOTIFY:', error);
      return false;
    }
  }
};
