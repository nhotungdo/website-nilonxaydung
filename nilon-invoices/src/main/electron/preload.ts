import { contextBridge, ipcRenderer } from 'electron';
import IPC_CHANNELS from '../../shared/events';

// Safe IPC API exposed to the React UI Renderer Process
const electronAPI = {
  // Printer Hardware Management
  printers: {
    getList: () => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.GET_LIST),
    getStatus: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.GET_STATUS, id),
    add: (printer: any) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.ADD, printer),
    update: (printer: any) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.UPDATE, printer),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.DELETE, id),
    setDefault: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.SET_DEFAULT, id),
    testPage: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.TEST, id),
  },

  // Invoice Print Jobs
  jobs: {
    getActive: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.GET_ACTIVE),
    getHistory: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.GET_HISTORY),
    reprint: (jobId: string) => ipcRenderer.invoke(IPC_CHANNELS.JOB.REPRINT, jobId),
    cancel: (jobId: string) => ipcRenderer.invoke(IPC_CHANNELS.JOB.CANCEL, jobId),
    clearHistory: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.CLEAR_HISTORY),
    onUpdate: (callback: (event: any, data: any) => void) => {
      ipcRenderer.on(IPC_CHANNELS.JOB.ON_UPDATE, callback);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.JOB.ON_UPDATE, callback);
    },
  },

  // Local Preferences
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
    update: (settings: any) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.UPDATE, settings),
    setStartup: (value: boolean) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.SET_STARTUP, value),
  },

  // Socket.IO Events
  socket: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SOCKET.GET_STATUS),
    onStatusChange: (callback: (status: string) => void) => {
      const listener = (_event: any, status: string) => callback(status);
      ipcRenderer.on(IPC_CHANNELS.SOCKET.ON_STATUS_CHANGE, listener);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SOCKET.ON_STATUS_CHANGE, listener);
    },
    onNewOrder: (callback: (order: any) => void) => {
      const listener = (_event: any, order: any) => callback(order);
      ipcRenderer.on(IPC_CHANNELS.SOCKET.ON_NEW_ORDER, listener);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SOCKET.ON_NEW_ORDER, listener);
    },
  },

  // Telemetry Diagnostic Logs
  system: {
    getLogs: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_LOGS),
    clearLogs: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.CLEAR_LOGS),
  },

  // PostgreSQL Safe Bridge
  database: {
    getOrders: () => ipcRenderer.invoke('db:get-orders'),
    createOrder: (order: any) => ipcRenderer.invoke('db:create-order', order),
    deleteOrder: (id: string) => ipcRenderer.invoke('db:delete-order', id),
    getPrinters: () => ipcRenderer.invoke('db:get-printers'),
    addPrinter: (printer: any) => ipcRenderer.invoke('db:add-printer', printer),
    getQueueJobs: () => ipcRenderer.invoke('db:get-queue-jobs'),
    retryFailedJob: (failedId: string) => ipcRenderer.invoke('db:retry-failed-job', failedId),
    getSettings: () => ipcRenderer.invoke('db:get-settings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('db:save-settings', settings),
    getProducts: () => ipcRenderer.invoke('db:get-products'),
    createProduct: (product: any) => ipcRenderer.invoke('db:create-product', product),
  },

  // Auto-Updater Operations
  updater: {
    check: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER?.CHECK || 'updater:check'),
    install: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER?.INSTALL || 'updater:install'),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER?.GET_STATUS || 'updater:get-status'),
    onStatus: (callback: (statusData: any) => void) => {
      const channel = IPC_CHANNELS.UPDATER?.ON_STATUS || 'updater:on-status';
      const listener = (_event: any, data: any) => callback(data);
      ipcRenderer.on(channel, listener);
      return () => ipcRenderer.removeListener(channel, listener);
    },
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPIType = typeof electronAPI;
export default electronAPI;
