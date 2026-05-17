import { create } from 'zustand';
import { IAppSettings, ISystemLog } from '../../shared/types';
import { mockSettings, mockSystemLogs } from '../mock/data';

interface SettingsState {
  settings: IAppSettings;
  logs: ISystemLog[];
  socketStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<IAppSettings>) => Promise<void>;
  setSocketStatus: (status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR') => void;
  addSystemLog: (log: Omit<ISystemLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  // Setup standard telemetry loop to simulate system log feeds
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const phrases = [
        'Heartbeat checked. Latency: 42ms.',
        'Spooler status: Idle. Queue is empty.',
        'Telemetry sync: Branch-01 status reporting - online.',
        'Cleared cached PDF resources older than 7 days.',
        'Printers online status ping: Cashier K80 is active.'
      ];
      
      get().addSystemLog({
        level: 'INFO',
        printer_id: null,
        message: phrases[Math.floor(Math.random() * phrases.length)]
      });
    }, 30000);
  }

  return {
    settings: mockSettings,
    logs: mockSystemLogs,
    socketStatus: 'CONNECTED',

    fetchSettings: async () => {
      try {
        if (window.electronAPI?.settings?.get) {
          const settings = await window.electronAPI.settings.get();
          set({ settings });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    },

    updateSettings: async (newSettings) => {
      try {
        if (window.electronAPI?.settings?.update) {
          await window.electronAPI.settings.update(newSettings);
        }
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      } catch (err) {
        console.error('Failed to update settings:', err);
      }
    },

    setSocketStatus: (socketStatus) => {
      set({ socketStatus });
      set((state) => ({
        settings: { ...state.settings, is_online: socketStatus === 'CONNECTED' }
      }));

      get().addSystemLog({
        level: socketStatus === 'CONNECTED' ? 'INFO' : 'ERROR',
        printer_id: null,
        message: `Socket.IO connection status changed: ${socketStatus}`
      });
    },

    addSystemLog: (log) => {
      const newLog: ISystemLog = {
        ...log,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString()
      };
      set((state) => ({
        logs: [newLog, ...state.logs].slice(0, 100) // Cap to last 100 entries for efficiency
      }));
    },

    clearLogs: () => set({ logs: [] })
  };
});
