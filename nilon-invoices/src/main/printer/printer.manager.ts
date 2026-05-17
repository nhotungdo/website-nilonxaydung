import { db } from '../database/sqlite';
import { PrinterQueue } from './printer.queue';
import { IPrinter, IPrintJob } from '../../shared/types';
import { BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';

class PrinterManager {
  private queues: Map<string, PrinterQueue> = new Map();

  constructor() {
    // We will initialize queues lazily or when requested
  }

  /**
   * Loads all active printers in SQLite and initializes their FIFO queues
   */
  public initializeActiveQueues(): void {
    console.log('[PrinterManager] Initializing printer queues from database cache...');
    const printers = db.prepare('SELECT * FROM printers').all() as IPrinter[];
    
    printers.forEach(printer => {
      if (!this.queues.has(printer.id)) {
        this.queues.set(printer.id, new PrinterQueue(printer.id, printer.name));
        console.log(`[PrinterManager] Initialized sequential worker queue for: ${printer.name}`);
      }
    });
  }

  /**
   * Dynamic router: Maps a print job to its specific physical printer queue worker
   */
  public routeToQueue(job: IPrintJob): void {
    // Lazily initialize queue if missing
    if (!this.queues.has(job.printer_id)) {
      const printer = db.prepare('SELECT * FROM printers WHERE id = ?').get(job.printer_id) as IPrinter | undefined;
      if (printer) {
        this.queues.set(printer.id, new PrinterQueue(printer.id, printer.name));
      } else {
        console.error(`[PrinterManager] Target printer ID ${job.printer_id} not found in SQLite! Routing to default.`);
        const defaultPrinter = db.prepare('SELECT * FROM printers WHERE is_default = 1').get() as IPrinter | undefined;
        if (defaultPrinter) {
          job.printer_id = defaultPrinter.id;
          if (!this.queues.has(defaultPrinter.id)) {
            this.queues.set(defaultPrinter.id, new PrinterQueue(defaultPrinter.id, defaultPrinter.name));
          }
        } else {
          throw new Error('No thermal printers seeded or configured in local cache database!');
        }
      }
    }

    const queue = this.queues.get(job.printer_id)!;
    queue.enqueue(job);
  }

  /**
   * Retrieves active OS-level drivers installed on the Windows system
   */
  public async getSystemPrinters(): Promise<Array<{ name: string; isDefault: boolean }>> {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) return [];
    
    // Electron's Chromium webContents API fetches physical driver hooks
    return await windows[0].webContents.getPrintersAsync();
  }

  /**
   * Triggers a physical diagnostic receipt test (K58 / K80 sizing)
   */
  public async printTestPage(printerId: string): Promise<boolean> {
    const printer = db.prepare('SELECT * FROM printers WHERE id = ?').get(printerId) as IPrinter | undefined;
    if (!printer) throw new Error('Thermal printer does not exist in SQLite registry.');

    console.log(`[PrinterManager] Printing thermal diagnostic test page on ${printer.name}`);

    // Create a mock job
    const isDev = process.env.NODE_ENV !== 'production';
    const storageDir = isDev 
      ? path.resolve(__dirname, '../../../storage') 
      : path.join(process.resourcesPath, 'storage'); // Fallback during packaging

    const testPdfPath = path.join(storageDir, 'pdf', `test-receipt-${printer.paper_size}.pdf`);
    
    // Write a tiny dummy text/receipt PDF if missing
    if (!fs.existsSync(testPdfPath)) {
      const dummySource = path.resolve(__dirname, '../../assets/templates/sample-k80.pdf');
      if (fs.existsSync(dummySource)) {
        fs.copyFileSync(dummySource, testPdfPath);
      } else {
        // Fallback placeholder write
        fs.writeFileSync(testPdfPath, '%PDF-1.4 ... (Thermal Diagnostic Test Receipt) ...');
      }
    }

    const testJob: IPrintJob = {
      id: `test_${Date.now()}`,
      order_id: 'TEST-000000',
      customer_name: 'DIAGNOSTIC TEST PASS',
      printer_id: printer.id,
      pdf_path: testPdfPath,
      status: 'PENDING',
      retry_count: 0,
      max_retries: 1,
      error_message: null,
      created_at: new Date().toISOString(),
      printed_at: null
    };

    // Insert to database for rendering tracking
    db.prepare(`
      INSERT INTO print_jobs (id, order_id, customer_name, printer_id, pdf_path, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(testJob.id, testJob.order_id, testJob.customer_name, testJob.printer_id, testJob.pdf_path, 'PENDING');

    this.routeToQueue(testJob);
    return true;
  }

  /**
   * Adds new printer to local register and spins up its worker queue
   */
  public addPrinter(printer: Omit<IPrinter, 'created_at'>): void {
    db.transaction(() => {
      // If setting as default, clear others
      if (printer.is_default === 1) {
        db.prepare('UPDATE printers SET is_default = 0').run();
      }

      db.prepare(`
        INSERT INTO printers (id, name, connection_type, ip_address, port, paper_size, is_default, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        printer.id,
        printer.name,
        printer.connection_type,
        printer.ip_address,
        printer.port,
        printer.paper_size,
        printer.is_default,
        printer.status
      );
    })();

    // Spin up active worker queue
    this.queues.set(printer.id, new PrinterQueue(printer.id, printer.name));
    console.log(`[PrinterManager] Registered and spun up worker for: ${printer.name}`);
  }

  public updatePrinter(printer: Partial<IPrinter> & { id: string }): void {
    db.transaction(() => {
      if (printer.is_default === 1) {
        db.prepare('UPDATE printers SET is_default = 0 WHERE id != ?').run(printer.id);
      }

      const fields: string[] = [];
      const values: any[] = [];

      Object.entries(printer).forEach(([key, val]) => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      });

      values.push(printer.id);
      db.prepare(`UPDATE printers SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    })();

    // Update internal queue mapping if printer name changed
    if (printer.name) {
      this.queues.set(printer.id, new PrinterQueue(printer.id, printer.name));
    }
  }

  public deletePrinter(printerId: string): void {
    db.prepare('DELETE FROM printers WHERE id = ?').run(printerId);
    this.queues.delete(printerId);
    console.log(`[PrinterManager] Terminated and deleted worker for printer ID: ${printerId}`);
  }
}

export const printerManager = new PrinterManager();
export default printerManager;
