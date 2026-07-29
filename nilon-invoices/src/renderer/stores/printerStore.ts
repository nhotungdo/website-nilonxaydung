import { create } from 'zustand';
import { IPrinter } from '../../shared/types';

interface PrinterState {
  printers: IPrinter[];
  isLoading: boolean;
  
  fetchPrinters: () => Promise<void>;
  addPrinter: (printer: Omit<IPrinter, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updatePrinter: (printer: Partial<IPrinter> & { id: string }) => Promise<void>;
  deletePrinter: (id: string) => Promise<void>;
  setDefaultPrinter: (id: string) => Promise<void>;
  testPrinter: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const usePrinterStore = create<PrinterState>((set, get) => ({
  printers: [],
  isLoading: false,

  fetchPrinters: async () => {
    set({ isLoading: true });
    try {
      if (window.electronAPI?.printers?.getList) {
        const printers = await window.electronAPI.printers.getList();
        set({ printers: printers || [], isLoading: false });
      } else {
        set({ printers: [], isLoading: false });
      }
    } catch (err) {
      console.error('Failed to fetch printers:', err);
      set({ printers: [], isLoading: false });
    }
  },

  addPrinter: async (printer) => {
    try {
      if (window.electronAPI?.printers?.add) {
        await window.electronAPI.printers.add(printer);
        await get().fetchPrinters();
      } else {
        const newPrinter: IPrinter = {
          ...printer,
          id: `PRN-0${get().printers.length + 1}`,
          status: 'ONLINE',
          created_at: new Date().toISOString()
        };
        set({ printers: [...get().printers, newPrinter] });
      }
    } catch (err) {
      console.error('Failed to add printer:', err);
    }
  },

  updatePrinter: async (printer) => {
    try {
      if (window.electronAPI?.printers?.update) {
        await window.electronAPI.printers.update(printer);
        await get().fetchPrinters();
      } else {
        const updated = get().printers.map((p) =>
          p.id === printer.id ? { ...p, ...printer } as IPrinter : p
        );
        set({ printers: updated });
      }
    } catch (err) {
      console.error('Failed to update printer:', err);
    }
  },

  deletePrinter: async (id) => {
    try {
      if (window.electronAPI?.printers?.delete) {
        await window.electronAPI.printers.delete(id);
        await get().fetchPrinters();
      } else {
        set({ printers: get().printers.filter((p) => p.id !== id) });
      }
    } catch (err) {
      console.error('Failed to delete printer:', err);
    }
  },

  setDefaultPrinter: async (id) => {
    try {
      if (window.electronAPI?.printers?.setDefault) {
        await window.electronAPI.printers.setDefault(id);
        await get().fetchPrinters();
      } else {
        const updated = get().printers.map((p) => ({
          ...p,
          is_default: p.id === id ? 1 : 0
        }));
        set({ printers: updated });
      }
    } catch (err) {
      console.error('Failed to set default printer:', err);
    }
  },

  testPrinter: async (id) => {
    try {
      if (window.electronAPI?.printers?.testPage) {
        return await window.electronAPI.printers.testPage(id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const printer = get().printers.find((p) => p.id === id);
        if (printer?.status === 'OFFLINE') {
          return { success: false, error: 'PRINTER_OFFLINE: Could not reach target printer.' };
        }
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}));
