import { ipcMain } from 'electron';
import { OrderService } from '../database/services/order.service';
import { PrinterService } from '../database/services/printer.service';
import { QueueService } from '../database/services/queue.service';
import { FailedJobService } from '../database/services/failed-job.service';
import { SettingsService } from '../database/services/settings.service';
import { logger } from '../utils/logger';
import { CreateOrderDTO, CreatePrinterDTO, AppSettings } from '../database/types';

// Instantiate our business service layers
const orderService = new OrderService();
const printerService = new PrinterService();
const queueService = new QueueService();
const failedJobService = new FailedJobService();
const settingsService = new SettingsService();

export function registerDatabaseIpcHandlers(): void {
  logger.info('[IPC] Registering secure database IPC handlers...');

  // 1. getOrders()
  ipcMain.handle('db:get-orders', async () => {
    logger.ipc('db:get-orders', {});
    try {
      const orders = await orderService.getOrders();
      return { success: true, data: orders };
    } catch (err: any) {
      logger.error(`[IPC db:get-orders] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 2. createOrder()
  ipcMain.handle('db:create-order', async (_event, orderDto: CreateOrderDTO) => {
    logger.ipc('db:create-order', orderDto);
    try {
      if (!orderDto) throw new Error('Order payload is required.');
      const newOrder = await orderService.createOrder(orderDto);
      return { success: true, data: newOrder };
    } catch (err: any) {
      logger.error(`[IPC db:create-order] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 3. getPrinters()
  ipcMain.handle('db:get-printers', async () => {
    logger.ipc('db:get-printers', {});
    try {
      const printers = await printerService.getPrinters();
      return { success: true, data: printers };
    } catch (err: any) {
      logger.error(`[IPC db:get-printers] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 4. addPrinter()
  ipcMain.handle('db:add-printer', async (_event, printerDto: CreatePrinterDTO) => {
    logger.ipc('db:add-printer', printerDto);
    try {
      if (!printerDto) throw new Error('Printer payload is required.');
      const newPrinter = await printerService.addPrinter(printerDto);
      return { success: true, data: newPrinter };
    } catch (err: any) {
      logger.error(`[IPC db:add-printer] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 5. getQueueJobs()
  ipcMain.handle('db:get-queue-jobs', async () => {
    logger.ipc('db:get-queue-jobs', {});
    try {
      const jobs = await queueService.getActiveJobs();
      return { success: true, data: jobs };
    } catch (err: any) {
      logger.error(`[IPC db:get-queue-jobs] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 6. retryFailedJob()
  ipcMain.handle('db:retry-failed-job', async (_event, failedId: string) => {
    logger.ipc('db:retry-failed-job', { failedId });
    try {
      if (!failedId) throw new Error('Failed job troubleshooting ID is required.');
      const res = await failedJobService.retryFailedJob(failedId);
      return res;
    } catch (err: any) {
      logger.error(`[IPC db:retry-failed-job] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 7. getSettings()
  ipcMain.handle('db:get-settings', async () => {
    logger.ipc('db:get-settings', {});
    try {
      const settings = await settingsService.getSettings();
      return { success: true, data: settings };
    } catch (err: any) {
      logger.error(`[IPC db:get-settings] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });

  // 8. saveSettings()
  ipcMain.handle('db:save-settings', async (_event, settingsDto: Partial<Omit<AppSettings, 'id'>>) => {
    logger.ipc('db:save-settings', settingsDto);
    try {
      if (!settingsDto) throw new Error('Settings payload is required.');
      const updated = await settingsService.saveSettings(settingsDto);
      return { success: true, data: updated };
    } catch (err: any) {
      logger.error(`[IPC db:save-settings] Failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  });
}
