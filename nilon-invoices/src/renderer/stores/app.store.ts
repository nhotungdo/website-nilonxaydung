import { create } from 'zustand';
import { IPrinter, IPrintJob, IAppSettings, ISystemLog } from '../../shared/types';

// Extend window typing for strict typescript safety
declare global {
  interface Window {
    electronAPI: any;
  }
}

interface AppState {
  printers: IPrinter[];
  activeJobs: IPrintJob[];
  jobHistory: IPrintJob[];
  settings: IAppSettings | null;
  logs: ISystemLog[];
  socketStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  
  // Async operations
  fetchPrinters: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchLogs: () => Promise<void>;
  
  addPrinter: (printer: Omit<IPrinter, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updatePrinter: (printer: Partial<IPrinter> & { id: string }) => Promise<void>;
  deletePrinter: (id: string) => Promise<void>;
  setDefaultPrinter: (id: string) => Promise<void>;
  testPrinter: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  reprintJob: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  clearJobHistory: () => Promise<void>;
  
  updateSettings: (settings: Partial<IAppSettings>) => Promise<void>;
  setStartup: (value: boolean) => Promise<void>;
  setSocketStatus: (status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR') => void;
  
  addSystemLog: (log: ISystemLog) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  printers: [],
  activeJobs: [],
  jobHistory: [],
  settings: null,
  logs: [],
  socketStatus: 'DISCONNECTED',

  fetchPrinters: async () => {
    try {
      const printers = await window.electronAPI.printers.getList();
      set({ printers });
    } catch (err) {
      console.error('Failed to fetch printers from SQLite:', err);
    }
  },

  fetchJobs: async () => {
    try {
      const activeJobs = await window.electronAPI.jobs.getActive();
      const jobHistory = await window.electronAPI.jobs.getHistory();
      set({ activeJobs, jobHistory });
    } catch (err) {
      console.error('Failed to fetch jobs from SQLite:', err);
    }
  },

  fetchSettings: async () => {
    try {
      const settings = await window.electronAPI.settings.get();
      set({ settings });
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  },

  fetchLogs: async () => {
    try {
      const logs = await window.electronAPI.system.getLogs();
      set({ logs });
    } catch (err) {
      console.error('Failed to fetch telemetry logs:', err);
    }
  },

  addPrinter: async (printer) => {
    try {
      await window.electronAPI.printers.add(printer);
      await get().fetchPrinters();
      get().addSystemLog({
        id: Date.now(),
        level: 'INFO',
        printer_id: null,
        message: `Registered new printer driver: ${printer.name}`,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to add printer:', err);
    }
  },

  updatePrinter: async (printer) => {
    try {
      await window.electronAPI.printers.update(printer);
      await get().fetchPrinters();
    } catch (err) {
      console.error('Failed to update printer:', err);
    }
  },

  deletePrinter: async (id) => {
    try {
      await window.electronAPI.printers.delete(id);
      await get().fetchPrinters();
    } catch (err) {
      console.error('Failed to delete printer:', err);
    }
  },

  setDefaultPrinter: async (id) => {
    try {
      await window.electronAPI.printers.setDefault(id);
      await get().fetchPrinters();
    } catch (err) {
      console.error('Failed to set default printer:', err);
    }
  },

  testPrinter: async (id) => {
    try {
      return await window.electronAPI.printers.testPage(id);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  reprintJob: async (jobId) => {
    try {
      await window.electronAPI.jobs.reprint(jobId);
      await get().fetchJobs();
    } catch (err) {
      console.error('Failed to reprint job:', err);
    }
  },

  cancelJob: async (jobId) => {
    try {
      await window.electronAPI.jobs.cancel(jobId);
      await get().fetchJobs();
    } catch (err) {
      console.error('Failed to cancel print job:', err);
    }
  },

  clearJobHistory: async () => {
    try {
      await window.electronAPI.jobs.clearHistory();
      await get().fetchJobs();
    } catch (err) {
      console.error('Failed to purge job history:', err);
    }
  },

  updateSettings: async (newSettings) => {
    try {
      await window.electronAPI.settings.update(newSettings);
      set((state) => ({
        settings: state.settings ? { ...state.settings, ...newSettings } : null,
      }));
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  },

  setStartup: async (value) => {
    try {
      await window.electronAPI.settings.setStartup(value);
      set((state) => ({
        settings: state.settings ? { ...state.settings, run_on_startup: value } : null,
      }));
    } catch (err) {
      console.error('Failed to configure login items:', err);
    }
  },

  setSocketStatus: (socketStatus) => {
    set({ socketStatus });
    // Sync settings state as well
    set((state) => ({
      settings: state.settings ? { ...state.settings, is_online: socketStatus === 'CONNECTED' } : null,
    }));
  },

  addSystemLog: (log) => {
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 200), // Cap local array to 200 items
    }));
  }
}));
