import { contextBridge, ipcRenderer } from 'electron';
import IPC_CHANNELS from '../../shared/events';
// Safe IPC API exposed to the React UI Renderer Process
const electronAPI = {
    // Printer Hardware Management
    printers: {
        getList: () => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.GET_LIST),
        getStatus: (id) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.GET_STATUS, id),
        add: (printer) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.ADD, printer),
        update: (printer) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.UPDATE, printer),
        delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.DELETE, id),
        setDefault: (id) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.SET_DEFAULT, id),
        testPage: (id) => ipcRenderer.invoke(IPC_CHANNELS.PRINTER.TEST, id),
    },
    // Invoice Print Jobs
    jobs: {
        getActive: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.GET_ACTIVE),
        getHistory: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.GET_HISTORY),
        reprint: (jobId) => ipcRenderer.invoke(IPC_CHANNELS.JOB.REPRINT, jobId),
        cancel: (jobId) => ipcRenderer.invoke(IPC_CHANNELS.JOB.CANCEL, jobId),
        clearHistory: () => ipcRenderer.invoke(IPC_CHANNELS.JOB.CLEAR_HISTORY),
        onUpdate: (callback) => {
            ipcRenderer.on(IPC_CHANNELS.JOB.ON_UPDATE, callback);
            return () => ipcRenderer.removeListener(IPC_CHANNELS.JOB.ON_UPDATE, callback);
        },
    },
    // Local Preferences
    settings: {
        get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
        update: (settings) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.UPDATE, settings),
        setStartup: (value) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.SET_STARTUP, value),
    },
    // Socket.IO Events
    socket: {
        getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SOCKET.GET_STATUS),
        onStatusChange: (callback) => {
            const listener = (_event, status) => callback(status);
            ipcRenderer.on(IPC_CHANNELS.SOCKET.ON_STATUS_CHANGE, listener);
            return () => ipcRenderer.removeListener(IPC_CHANNELS.SOCKET.ON_STATUS_CHANGE, listener);
        },
        onNewOrder: (callback) => {
            const listener = (_event, order) => callback(order);
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
        createOrder: (order) => ipcRenderer.invoke('db:create-order', order),
        getPrinters: () => ipcRenderer.invoke('db:get-printers'),
        addPrinter: (printer) => ipcRenderer.invoke('db:add-printer', printer),
        getQueueJobs: () => ipcRenderer.invoke('db:get-queue-jobs'),
        retryFailedJob: (failedId) => ipcRenderer.invoke('db:retry-failed-job', failedId),
        getSettings: () => ipcRenderer.invoke('db:get-settings'),
        saveSettings: (settings) => ipcRenderer.invoke('db:save-settings', settings),
    }
};
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
export default electronAPI;
