import { prisma } from '../lib/prisma';
import { PrinterService } from '../services/printer.service';
import cron from 'node-cron';

// Retry every 30 seconds
export const startRetryJob = () => {
  console.log('🚀 Starting Printer Retry Job...');
  
  cron.schedule('*/30 * * * * *', async () => {
    console.log('🔍 Checking for waiting order notifications...');
    
    // Find orders that are waiting to be printed
    const waitingOrders = await prisma.order.findMany({
      where: {
        printStatus: 'waiting',
        orderStatus: { not: 'cancelled' }
      },
      orderBy: { createdAt: 'asc' },
      take: 5, // Process 5 at a time
    });

    if (waitingOrders.length === 0) {
      console.log('✅ No waiting orders to process.');
      return;
    }

    console.log(`🔄 Retrying ${waitingOrders.length} notifications...`);

    for (const order of waitingOrders) {
      console.log(`   Retriggering notify for order ${order.orderCode} (id: ${order.id})`);
      await PrinterService.sendToPrinter(order.id);
    }
  });
};

// If run directly
if (require.main === module) {
  startRetryJob();
}
