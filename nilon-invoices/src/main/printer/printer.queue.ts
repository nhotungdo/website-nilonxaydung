import { print } from 'pdf-to-printer';
import { db } from '../database/sqlite';
import { IPrintJob } from '../../shared/types';
import IPC_CHANNELS from '../../shared/events';
import { BrowserWindow } from 'electron';
import fs from 'fs';

export class PrinterQueue {
  private queue: IPrintJob[] = [];
  private isProcessing = false;
  private printerId: string;
  private printerName: string;

  constructor(printerId: string, printerName: string) {
    this.printerId = printerId;
    this.printerName = printerName;
  }

  /**
   * Adds a new print job to the sequential queue
   */
  public enqueue(job: IPrintJob): void {
    console.log(`[Queue-${this.printerName}] Enqueuing job ${job.id} for order ${job.order_id}`);
    this.queue.push(job);
    this.processNext();
  }

  /**
   * Processes the next print job in the queue (sequential loop)
   */
  private async processNext(): Promise<void> {
    if (this.isProcessing) return;
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const currentJob = this.queue.shift()!;
    
    try {
      await this.executePrint(currentJob);
    } catch (error: any) {
      console.error(`[Queue-${this.printerName}] Uncaught error printing job ${currentJob.id}:`, error);
      await this.handlePrintFailure(currentJob, error.message || 'Unknown printer failure');
    } finally {
      this.isProcessing = false;
      // Loop to next job
      setTimeout(() => this.processNext(), 1000); // 1s cool-down between physical receipts
    }
  }

  /**
   * Triggers the physical print command via pdf-to-printer CLI
   */
  private async executePrint(job: IPrintJob): Promise<void> {
    console.log(`[Queue-${this.printerName}] Starting print for Job: ${job.id}, PDF: ${job.pdf_path}`);
    
    // 1. Verify file exists physically
    if (!fs.existsSync(job.pdf_path)) {
      throw new Error(`Invoice PDF file not found at: ${job.pdf_path}`);
    }

    // 2. Update status in Database to PRINTING
    this.updateJobStatus(job.id, 'PRINTING');

    // 3. Physical printing promise with timeout
    const printOptions = {
      printer: this.printerName,
      // Windows-specific scaling to prevent cutting off thermal sheets
      paperSize: job.pdf_path.includes('K58') ? 'K58' : 'K80', 
      silent: true,
    };

    // Race printing against a hardware-related 30s timeout
    await Promise.race([
      print(job.pdf_path, printOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Physical printer execution timeout (30s)')), 30000))
    ]);

    // 4. Update status in DB to SUCCESS on completion
    console.log(`[Queue-${this.printerName}] Physical print success for Job: ${job.id}`);
    this.updateJobStatus(job.id, 'SUCCESS', new Date().toISOString());

    // 5. Audit print logs inside SQLite
    db.prepare(`
      INSERT INTO printer_logs (level, printer_id, message) 
      VALUES (?, ?, ?)
    `).run('INFO', this.printerId, `Printed invoice for Order ${job.order_id} successfully.`);
  }

  /**
   * Handles physical failure, re-scheduling print job if retry budget exists
   */
  private async handlePrintFailure(job: IPrintJob, errorMessage: string): Promise<void> {
    const nextRetry = job.retry_count + 1;
    console.error(`[Queue-${this.printerName}] Print failure on Job: ${job.id}. Attempt ${nextRetry}/${job.max_retries}. Error: ${errorMessage}`);

    // Update job local fields
    job.retry_count = nextRetry;
    job.error_message = errorMessage;

    // Check if retry budget is exhausted
    if (nextRetry <= job.max_retries) {
      // Save retry progress in Database
      db.prepare(`
        UPDATE print_jobs 
        SET retry_count = ?, error_message = ?, status = 'PENDING' 
        WHERE id = ?
      `).run(nextRetry, errorMessage, job.id);

      // Notify UI of updated attempt count
      this.notifyWebContents(job.id, 'PENDING', nextRetry, errorMessage);

      // Exponential backoff wait (e.g. 5s, 15s, 45s) before enqueuing again
      const backoffDelay = Math.pow(3, nextRetry) * 1000 + 2000;
      console.log(`[Queue-${this.printerName}] Retrying job ${job.id} in ${backoffDelay / 1000}s...`);
      
      setTimeout(() => {
        this.enqueue(job);
      }, backoffDelay);
      
    } else {
      // Mark as permanently FAILED
      this.updateJobStatus(job.id, 'FAILED', null, errorMessage);

      // Write error detail to failed_jobs
      db.prepare(`
        INSERT INTO failed_jobs (id, job_id, error_type, error_message)
        VALUES (?, ?, ?, ?)
      `).run(`fail_${Date.now()}`, job.id, 'PRINTER_ERROR', errorMessage);

      // Log printer warning inside SQLite
      db.prepare(`
        INSERT INTO printer_logs (level, printer_id, message) 
        VALUES (?, ?, ?)
      `).run('ERROR', this.printerId, `Printing failed permanently for Order ${job.order_id}. Error: ${errorMessage}`);
    }
  }

  /**
   * Helper to write state updates to SQLite and notify active Chromium windows
   */
  private updateJobStatus(jobId: string, status: IPrintJob['status'], printedAt: string | null = null, error: string | null = null): void {
    if (printedAt) {
      db.prepare('UPDATE print_jobs SET status = ?, printed_at = ? WHERE id = ?').run(status, printedAt, jobId);
    } else if (error) {
      db.prepare('UPDATE print_jobs SET status = ?, error_message = ? WHERE id = ?').run(status, error, jobId);
    } else {
      db.prepare('UPDATE print_jobs SET status = ? WHERE id = ?').run(status, jobId);
    }

    this.notifyWebContents(jobId, status, undefined, error);
  }

  private notifyWebContents(jobId: string, status: IPrintJob['status'], retryCount?: number, error?: string | null): void {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
      win.webContents.send(IPC_CHANNELS.JOB.ON_UPDATE, {
        jobId,
        status,
        retryCount,
        error: error || null
      });
    });
  }
}
