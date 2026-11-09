import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const PrinterService = {
  async sendToPrinter(orderId: string, orderData?: any) {
    try {
      if (!orderId || typeof orderId !== 'string') {
        throw new Error('Invalid orderId format');
      }

      // Add/update print job in Firestore
      await adminDb.collection('print_jobs').add({
        orderId,
        orderCode: orderData?.orderCode || '',
        customerName: orderData?.customer?.fullName || orderData?.customerName || '',
        customerPhone: orderData?.customer?.phone || orderData?.customerPhone || '',
        total: orderData?.total || orderData?.totalAmount || 0,
        status: 'WAITING',
        retryCount: 0,
        createdAt: FieldValue.serverTimestamp(),
      });

      console.log(`🔊 [Firestore] Queued print job for order: ${orderId}`);
      return true;
    } catch (error: any) {
      console.error('[Firestore] Error queuing print job:', error.message);
      return false;
    }
  },
};
