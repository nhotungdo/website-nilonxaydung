import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { initDatabase, db } from '../database/sqlite';
import { db as postgresDb } from '../database/postgres';
import { registerDatabaseIpcHandlers } from '../ipc/database.ipc';
import { logger } from '../utils/logger';
import { createMainWindow, getMainWindow } from './window';
import { createSystemTray } from './tray';
import { printerManager } from '../printer/printer.manager';
import { socketClient } from '../socket/socket.client';
import IPC_CHANNELS from '../../shared/events';
import { IPrinter, IPrintJob, ISystemLog, IUpdateStatus } from '../../shared/types';
import path from 'path';
import fs from 'fs';

// Auto-Updater status tracking state
let currentUpdateStatus: IUpdateStatus = {
  status: 'idle',
  message: 'Ứng dụng đã sẵn sàng.'
};

function broadcastUpdateStatus(newStatus: IUpdateStatus): void {
  currentUpdateStatus = newStatus;
  const win = getMainWindow();
  if (win && win.webContents) {
    win.webContents.send(IPC_CHANNELS.UPDATER?.ON_STATUS || 'updater:on-status', currentUpdateStatus);
  }
}

// Prevent multiple instances of the app from running concurrently on the same machine
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // If a second instance is started, focus the primary window instead
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    }
  });

  // Main application startup lifecycle
  app.whenReady().then(async () => {
    logger.info('[Main] Electron Bootstrapper active.');

    // 1. Initialize local SQLite Database & seeding
    initDatabase();

    // 2. Initialize PostgreSQL connection (Auto-migrations and seeds disabled to prevent schema overwrites and sync issues)
    try {
      await postgresDb.connectDatabase();
      logger.info('[Main] PostgreSQL database connection established successfully.');
    } catch (dbErr: any) {
      logger.error('[Main] CRITICAL PostgreSQL Startup Error:', dbErr.message);
    }

    // 3. Initialize active physical printer queues
    printerManager.initializeActiveQueues();

    // 4. Connect real-time WebSocket client to cloud backend NestJS
    socketClient.connect();

    // 5. Create main application window and tray
    createMainWindow();
    createSystemTray();

    // 6. Register all IPC events
    registerIpcHandlers();
    registerDatabaseIpcHandlers();

    // 7. Setup Auto-Updater for automatic background updates
    setupAutoUpdater();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

function setupAutoUpdater() {
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
      logger.info('[AutoUpdater] Checking for updates...');
      broadcastUpdateStatus({
        status: 'checking',
        message: 'Đang kiểm tra phiên bản mới nhất từ server...'
      });
    });

    autoUpdater.on('update-available', (info: any) => {
      logger.info(`[AutoUpdater] New update available: v${info.version}`);
      broadcastUpdateStatus({
        status: 'available',
        message: `Phát hiện phiên bản mới v${info.version}! Đang tự động tải về...`,
        version: info.version
      });
    });

    autoUpdater.on('update-not-available', () => {
      logger.info('[AutoUpdater] App is up to date.');
      broadcastUpdateStatus({
        status: 'not-available',
        message: 'Bạn đang sử dụng phiên bản mới nhất (v1.0.0).'
      });
    });

    autoUpdater.on('error', (err: any) => {
      logger.error(`[AutoUpdater] Error: ${err?.message || err}`);
      broadcastUpdateStatus({
        status: 'error',
        message: `Lỗi kết nối máy chủ cập nhật: ${err?.message || err}`
      });
    });

    autoUpdater.on('download-progress', (progressObj: any) => {
      const percent = Math.round(progressObj.percent);
      logger.info(`[AutoUpdater] Downloading: ${percent}%`);
      broadcastUpdateStatus({
        status: 'downloading',
        message: `Đang tự động tải bản mới: ${percent}%`,
        progress: percent
      });
    });

    autoUpdater.on('update-downloaded', (info: any) => {
      logger.info('[AutoUpdater] Update downloaded. Ready to install.');
      broadcastUpdateStatus({
        status: 'downloaded',
        message: `Bản mới v${info?.version || '1.0.0'} đã tải xong. Nhấn để cập nhật ngay!`,
        version: info?.version
      });
    });

    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify().catch((err: any) => {
        logger.error('[AutoUpdater] Initial update check failed:', err?.message || err);
      });

      // Check for updates every 30 minutes
      setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify().catch((err: any) => {
          logger.error('[AutoUpdater] Periodic update check failed:', err?.message || err);
        });
      }, 30 * 60 * 1000);
    }
  } catch (err: any) {
    logger.error('[AutoUpdater] Setup error:', err?.message || err);
  }
}


// Windows auto-minimizing hooks
app.on('window-all-closed', () => {
  // On Windows, keep running in the tray background silently
  if (process.platform !== 'darwin') {
    // Do not quit app, just hide windows
  }
});

app.on('will-quit', () => {
  socketClient.disconnect();
  console.log('[Main] Socket client disconnected. Shutting down clean.');
});

/**
 * Maps IPC invocation events between Renderer and Main processes
 */
function registerIpcHandlers(): void {
  // --- PRINTER REGISTER ---
  ipcMain.handle(IPC_CHANNELS.PRINTER.GET_LIST, () => {
    return db.prepare('SELECT * FROM printers ORDER BY is_default DESC, created_at ASC').all() as IPrinter[];
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.GET_STATUS, async () => {
    // Returns active printers installed in the Windows OS Spooler
    return await printerManager.getSystemPrinters();
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.ADD, (_event, printerPayload: any) => {
    const id = `printer_${Date.now()}`;
    const printer: Omit<IPrinter, 'created_at'> = {
      id,
      name: printerPayload.name,
      connection_type: printerPayload.connection_type || 'USB',
      ip_address: printerPayload.ip_address || null,
      port: printerPayload.port || null,
      paper_size: printerPayload.paper_size || 'K80',
      is_default: printerPayload.is_default ? 1 : 0,
      status: 'ONLINE' // Assume driver online on creation
    };
    
    printerManager.addPrinter(printer);
    return { success: true, id };
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.UPDATE, (_event, printer: any) => {
    printerManager.updatePrinter(printer);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.DELETE, (_event, id: string) => {
    printerManager.deletePrinter(id);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.SET_DEFAULT, (_event, id: string) => {
    printerManager.updatePrinter({ id, is_default: 1 });
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.PRINTER.TEST, async (_event, id: string) => {
    try {
      await printerManager.printTestPage(id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // --- PRINT JOBS REGISTER ---
  ipcMain.handle(IPC_CHANNELS.JOB.GET_ACTIVE, () => {
    return db.prepare("SELECT * FROM print_jobs WHERE status IN ('PENDING', 'PRINTING') ORDER BY created_at ASC").all() as IPrintJob[];
  });

  ipcMain.handle(IPC_CHANNELS.JOB.GET_HISTORY, () => {
    return db.prepare("SELECT * FROM print_jobs WHERE status IN ('SUCCESS', 'FAILED') ORDER BY created_at DESC LIMIT 100").all() as IPrintJob[];
  });

  ipcMain.handle(IPC_CHANNELS.JOB.REPRINT, (_event, jobId: string) => {
    const job = db.prepare('SELECT * FROM print_jobs WHERE id = ?').get(jobId) as IPrintJob | undefined;
    if (!job) throw new Error('Target print job not found in history cache.');

    console.log(`[IPC] Reprint triggered for Job: ${job.id}, Order: ${job.order_id}`);

    // Re-initialize queue metrics and set status PENDING
    const reprintedJob: IPrintJob = {
      ...job,
      id: `reprint_${Date.now()}_${Math.floor(Math.random() * 100)}`,
      status: 'PENDING',
      retry_count: 0,
      created_at: new Date().toISOString(),
      printed_at: null,
      error_message: null
    };

    db.prepare(`
      INSERT INTO print_jobs (id, order_id, customer_name, printer_id, pdf_path, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(reprintedJob.id, reprintedJob.order_id, reprintedJob.customer_name, reprintedJob.printer_id, reprintedJob.pdf_path, 'PENDING');

    printerManager.routeToQueue(reprintedJob);
    return { success: true, id: reprintedJob.id };
  });

  ipcMain.handle(IPC_CHANNELS.JOB.CANCEL, (_event, jobId: string) => {
    db.prepare("UPDATE print_jobs SET status = 'FAILED', error_message = 'Cancelled by operator' WHERE id = ?").run(jobId);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.JOB.CLEAR_HISTORY, () => {
    db.prepare("DELETE FROM print_jobs WHERE status IN ('SUCCESS', 'FAILED')").run();
    return { success: true };
  });

  // --- SETTINGS REGISTER ---
  ipcMain.handle(IPC_CHANNELS.SETTINGS.GET, () => {
    const rows = db.prepare('SELECT * FROM app_settings').all() as Array<{ setting_key: string; setting_value: string }>;
    const settings: Record<string, any> = {};
    rows.forEach(r => {
      let val: any = r.setting_value;
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      settings[r.setting_key] = val;
    });
    return settings;
  });

  ipcMain.handle(IPC_CHANNELS.SETTINGS.UPDATE, (_event, settingsPayload: any) => {
    db.transaction(() => {
      const stmt = db.prepare('UPDATE app_settings SET setting_value = ? WHERE setting_key = ?');
      Object.entries(settingsPayload).forEach(([key, val]) => {
        stmt.run(String(val), key);
      });
    })();

    // Re-trigger socket connection if API server coordinates have changed
    if (settingsPayload.api_url || settingsPayload.api_key || settingsPayload.branch_id) {
      console.log('[IPC] Settings altered, rebooting Socket Client.');
      socketClient.connect();
    }

    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SETTINGS.SET_STARTUP, (_event, shouldRunOnStartup: boolean) => {
    const appFolder = path.dirname(process.execPath);
    const exeName = path.basename(process.execPath);
    const appPath = path.join(appFolder, exeName);

    console.log(`[IPC] Modifying Windows Login Startup Settings: ${shouldRunOnStartup}`);

    app.setLoginItemSettings({
      openAtLogin: shouldRunOnStartup,
      path: appPath,
      args: ['--hidden'] // Boot in system tray mode
    });

    db.prepare("UPDATE app_settings SET setting_value = ? WHERE setting_key = 'run_on_startup'").run(String(shouldRunOnStartup));
    return { success: true };
  });

  // --- SOCKET.IO REGISTER ---
  ipcMain.handle(IPC_CHANNELS.SOCKET.GET_STATUS, () => {
    return socketClient.getStatus();
  });

  // --- TELEMETRY SYSTEM LOGS ---
  ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_LOGS, () => {
    return db.prepare('SELECT * FROM printer_logs ORDER BY timestamp DESC LIMIT 200').all() as ISystemLog[];
  });

  ipcMain.handle(IPC_CHANNELS.SYSTEM.CLEAR_LOGS, () => {
    db.prepare('DELETE FROM printer_logs').run();
    return { success: true };
  });

  // --- AUTO UPDATER IPC HANDLERS ---
  ipcMain.handle(IPC_CHANNELS.UPDATER.GET_STATUS, () => {
    return currentUpdateStatus;
  });

  ipcMain.handle(IPC_CHANNELS.UPDATER.CHECK, async () => {
    logger.info('[IPC] Auto-update check manually triggered.');
    broadcastUpdateStatus({
      status: 'checking',
      message: 'Đang kết nối hệ thống để tìm bản cập nhật mới nhất...'
    });

    if (app.isPackaged) {
      try {
        const { autoUpdater } = require('electron-updater');
        const checkResult = await autoUpdater.checkForUpdates();
        return { success: true, checkResult };
      } catch (err: any) {
        broadcastUpdateStatus({
          status: 'error',
          message: `Không thể tìm thấy bản cập nhật trực tuyến: ${err.message}`
        });
        return { success: false, error: err.message };
      }
    }

    // Local / Dev Mode Fallback check for compiled latest installer or unpacked binary
    const releaseInstaller = path.join(app.getAppPath(), 'release', 'Nilon Invoices Setup 1.0.0.exe');
    const unpackedExe = path.join(app.getAppPath(), 'release', 'win-unpacked', 'Nilon Invoices.exe');

    if (fs.existsSync(releaseInstaller)) {
      broadcastUpdateStatus({
        status: 'downloaded',
        message: 'Đã phát hiện bộ cài bản mới nhất (Nilon Invoices Setup 1.0.0.exe). Bạn có thể nâng cấp ngay!',
        version: '1.0.0'
      });
      return { success: true, hasLocalUpdate: true };
    } else if (fs.existsSync(unpackedExe)) {
      broadcastUpdateStatus({
        status: 'downloaded',
        message: 'Đã phát hiện bản thực thi mới nhất (Nilon Invoices.exe). Sẵn sàng khởi chạy!',
        version: '1.0.0'
      });
      return { success: true, hasLocalUpdate: true };
    } else {
      broadcastUpdateStatus({
        status: 'not-available',
        message: 'Ứng dụng hiện tại đã ở phiên bản mới nhất v1.0.0.'
      });
      return { success: true, isLatest: true };
    }
  });

  ipcMain.handle(IPC_CHANNELS.UPDATER.INSTALL, async () => {
    logger.info('[IPC] Auto-update installation triggered.');

    if (app.isPackaged) {
      try {
        const { autoUpdater } = require('electron-updater');
        autoUpdater.quitAndInstall(false, true);
        return { success: true };
      } catch (err: any) {
        logger.error('[AutoUpdater] Quit and install failed:', err);
      }
    }

    // Local execution fallback
    const releaseInstaller = path.join(app.getAppPath(), 'release', 'Nilon Invoices Setup 1.0.0.exe');
    const unpackedExe = path.join(app.getAppPath(), 'release', 'win-unpacked', 'Nilon Invoices.exe');

    if (fs.existsSync(releaseInstaller)) {
      broadcastUpdateStatus({
        status: 'installing',
        message: 'Đang mở bộ cài bản mới nhất Nilon Invoices Setup 1.0.0.exe...'
      });
      shell.openPath(releaseInstaller);
      setTimeout(() => {
        app.quit();
      }, 1500);
      return { success: true };
    } else if (fs.existsSync(unpackedExe)) {
      broadcastUpdateStatus({
        status: 'installing',
        message: 'Đang khởi chạy phiên bản mới nhất Nilon Invoices.exe...'
      });
      shell.openPath(unpackedExe);
      setTimeout(() => {
        app.quit();
      }, 1500);
      return { success: true };
    } else {
      broadcastUpdateStatus({
        status: 'error',
        message: 'Không tìm thấy tệp cài đặt bản mới trong thư mục release.'
      });
      return { success: false, error: 'Installer file not found' };
    }
  });
}
