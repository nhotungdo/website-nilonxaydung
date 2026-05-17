import { db } from '../database/sqlite';
import { pdfService } from './pdf.service';
import { printerManager } from '../printer/printer.manager';
import path from 'path';
import { app } from 'electron';
class InvoiceService {
    constructor() { }
    /**
     * Main orchestrator: coordinates order parsing -> downloader -> local registry -> printer queue routing
     */
    async processIncomingOrder(order) {
        console.log(`[InvoiceService] Processing transaction pipeline for Order: ${order.orderCode}`);
        // 1. Determine local SQLite target thermal printer
        const selectedPrinter = this.resolveTargetPrinter(order);
        console.log(`[InvoiceService] Routing order ${order.orderCode} to printer: ${selectedPrinter.name} (${selectedPrinter.paper_size})`);
        // 2. Set local path to store physical PDF file
        const isDev = process.env.NODE_ENV !== 'production';
        const storageDir = isDev
            ? path.resolve(__dirname, '../../../storage')
            : path.join(app.getPath('userData'), 'storage');
        const fileName = `${order.orderCode || order.id}_${selectedPrinter.paper_size}.pdf`;
        const localPdfPath = path.join(storageDir, 'pdf', fileName);
        // 3. Obtain/Download physical receipt PDF
        let pdfPath = '';
        if (order.pdfUrl && order.pdfUrl.startsWith('http')) {
            try {
                pdfPath = await pdfService.downloadPdf(order.pdfUrl, localPdfPath);
            }
            catch (err) {
                console.error(`[InvoiceService] S3 PDF download failed for ${order.orderCode}. Falling back to locally compiled layout template. Error: ${err.message}`);
                pdfPath = pdfService.generateFallbackPdf(order.orderCode, selectedPrinter.paper_size, localPdfPath);
            }
        }
        else {
            // Offline fallback template copy
            pdfPath = pdfService.generateFallbackPdf(order.orderCode, selectedPrinter.paper_size, localPdfPath);
        }
        // 4. Save print job record inside local SQLite cache DB
        const printJob = {
            id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            order_id: order.orderCode || order.id,
            customer_name: order.customerName || 'Khách Hàng Lẻ',
            printer_id: selectedPrinter.id,
            pdf_path: pdfPath,
            status: 'PENDING',
            retry_count: 0,
            max_retries: 3,
            error_message: null,
            created_at: new Date().toISOString(),
            printed_at: null
        };
        db.prepare(`
      INSERT INTO print_jobs (id, order_id, customer_name, printer_id, pdf_path, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(printJob.id, printJob.order_id, printJob.customer_name, printJob.printer_id, printJob.pdf_path, 'PENDING');
        // 5. Append print job to the sequential printer hardware queue worker
        printerManager.routeToQueue(printJob);
    }
    /**
     * Resolves which physical printer should handle this order based on size or fallback defaults
     */
    resolveTargetPrinter(order) {
        const paperSize = order.paperSize || 'K80';
        // Look up an online printer matching requested size
        let printer = db.prepare(`
      SELECT * FROM printers 
      WHERE paper_size = ? AND status = 'ONLINE'
      ORDER BY is_default DESC, created_at ASC
      LIMIT 1
    `).get(paperSize);
        if (!printer) {
            // Fallback 1: Any online default printer
            printer = db.prepare(`
        SELECT * FROM printers 
        WHERE is_default = 1
        LIMIT 1
      `).get();
        }
        if (!printer) {
            // Fallback 2: Any printer in system
            printer = db.prepare(`
        SELECT * FROM printers 
        LIMIT 1
      `).get();
        }
        if (!printer) {
            throw new Error('No physical thermal printers seeded or configured in SQLite local storage.');
        }
        return printer;
    }
}
export const invoiceService = new InvoiceService();
export default invoiceService;
