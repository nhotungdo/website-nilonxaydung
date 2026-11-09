import { getFirestoreDb } from '../firestore';
import { logger } from '../../utils/logger';
import type { IOrderPayload } from '../../../shared/types';
import type { QuerySnapshot, DocumentChange } from 'firebase-admin/firestore';

export class FirestoreOrderSync {
  private static unsubscribe: (() => void) | null = null;
  private static processedOrderCodes: Set<string> = new Set();

  public static startListening(): void {
    try {
      const db = getFirestoreDb();
      logger.info('[FirestoreSync] 🚀 Starting real-time listener for waiting orders...');

      this.unsubscribe = db
        .collection('orders')
        .where('printStatus', '==', 'waiting')
        .onSnapshot(
          (snapshot: QuerySnapshot) => {
            snapshot.docChanges().forEach(async (change: DocumentChange) => {
              if (change.type === 'added' || change.type === 'modified') {
                const doc = change.doc;
                const data = doc.data();
                const orderCode = data.orderCode || doc.id;

                if (this.processedOrderCodes.has(orderCode)) {
                  return;
                }

                logger.info(`[FirestoreSync] 🔔 New waiting order received: ${orderCode}`);
                this.processedOrderCodes.add(orderCode);

                const customer = data.customer || {};
                const orderPayload: IOrderPayload = {
                  id: doc.id,
                  orderCode,
                  customerName: customer.fullName || customer.full_name || 'Khách lẻ',
                  customerPhone: customer.phone || '',
                  totalAmount: Number(data.total || data.subtotal || 0),
                  pdfUrl: data.invoicePdf || data.invoice_pdf || undefined,
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                  items: data.items || [],
                };

                try {
                  const { invoiceService } = require('../../services/invoice.service');
                  await invoiceService.processIncomingOrder(orderPayload);
                  logger.info(`[FirestoreSync] ✅ Dispatched print job for order: ${orderCode}`);
                } catch (err: any) {
                  logger.error(`[FirestoreSync] ❌ Error processing order ${orderCode}: ${err.message}`);
                  this.processedOrderCodes.delete(orderCode); // Allow retry on failure
                }
              }
            });
          },
          (err: Error) => {
            logger.error(`[FirestoreSync] ❌ Firestore order listener error: ${err.message}`);
          }
        );
    } catch (err: any) {
      logger.error(`[FirestoreSync] Failed to initialize Firestore listener: ${err.message}`);
    }
  }

  public static async markOrderAsPrinted(orderIdOrCode: string): Promise<void> {
    try {
      const db = getFirestoreDb();
      const docRef = db.collection('orders').doc(orderIdOrCode);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        await docRef.update({
          printStatus: 'printed',
          printedAt: new Date(),
          printedBy: 'Desktop Auto-Print',
        });
        logger.info(`[FirestoreSync] Marked order ${orderIdOrCode} as printed in Firestore.`);
        return;
      }

      const querySnap = await db.collection('orders').where('orderCode', '==', orderIdOrCode).get();
      for (const d of querySnap.docs) {
        await d.ref.update({
          printStatus: 'printed',
          printedAt: new Date(),
          printedBy: 'Desktop Auto-Print',
        });
        logger.info(`[FirestoreSync] Marked order ${orderIdOrCode} as printed in Firestore.`);
      }
    } catch (err: any) {
      logger.warn(`[FirestoreSync] Failed to mark order printed in Firestore: ${err.message}`);
    }
  }

  public static stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      logger.info('[FirestoreSync] Real-time listener stopped.');
    }
  }
}
