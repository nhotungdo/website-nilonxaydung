import { prisma } from '../lib/prisma';
import { PrinterService } from '../services/printer.service';
import cron from 'node-cron';

// Retry every 30 seconds
export const startRetryJob = () => {
  console.log('🚀 Starting Printer Retry Job...');
  
  cron.schedule('*/30 * * * * *', async () => {
    console.log('🔍 Checking for failed print jobs...');
    
    const failedJobs = await prisma.printQueue.findMany({
      where: {
        status: { in: ['pending', 'failed'] },
        retryCount: { lt: 10 },
      },
      orderBy: { createdAt: 'asc' },
      take: 5, // Process 5 at a time
    });

    if (failedJobs.length === 0) {
      console.log('✅ No failed jobs to process.');
      return;
    }

    console.log(`🔄 Retrying ${failedJobs.length} jobs...`);

    for (const job of failedJobs) {
      console.log(`   Attempting to sync order ${job.orderId} (Retry: ${job.retryCount})`);
      await PrinterService.sendToPrinter(job.orderId);
    }
  });
};

// If run directly
if (require.main === module) {
  startRetryJob();
}
