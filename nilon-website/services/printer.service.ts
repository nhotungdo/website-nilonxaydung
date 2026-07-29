import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const PrinterService = {
  async sendToPrinter(orderId: string) {
    try {
      // Validate orderId format to prevent SQL injection
      if (!orderId || typeof orderId !== 'string' || orderId.length > 100) {
        throw new Error('Invalid orderId format');
      }
      
      // Sanitize orderId - only allow alphanumeric, hyphens, and underscores
      const sanitizedOrderId = orderId.replace(/[^a-zA-Z0-9\-_]/g, '');
      
      // Use parameterized query to prevent SQL injection
      await prisma.$executeRaw(
        Prisma.sql`NOTIFY new_order, ${sanitizedOrderId}`
      );
      console.log(`🔊 Triggered PostgreSQL NOTIFY for new order: ${sanitizedOrderId}`);
      return true;
    } catch (error) {
      console.error('Error triggering PostgreSQL NOTIFY:', error);
      return false;
    }
  }
};
