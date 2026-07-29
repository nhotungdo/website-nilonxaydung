import { create } from 'zustand';
import { IAppSettings, ISystemLog } from '../../shared/types';
const defaultSettings: IAppSettings = {
  api_url: 'http://localhost:3000',
  branch_id: '',
  api_key: '',
  auto_print: true,
  sound_alert: true,
  run_on_startup: false,
  is_online: false,
};

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
  return {
    settings: defaultSettings,
    logs: [],
    socketStatus: 'DISCONNECTED',

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
