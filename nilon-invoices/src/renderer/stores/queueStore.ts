import { create } from 'zustand';
import { IPrintJob } from '../../shared/types';

interface QueueState {
  jobs: IPrintJob[];
  isLoading: boolean;
  
  fetchJobs: () => Promise<void>;
  reprintJob: (id: string) => Promise<void>;
  cancelJob: (id: string) => Promise<void>;
  pauseQueue: () => void;
  resumeQueue: () => void;
  retryJob: (id: string) => Promise<void>;
  forcePrintJob: (id: string) => Promise<void>;
  updateJobStatus: (id: string, status: 'PENDING' | 'PRINTING' | 'SUCCESS' | 'FAILED', errorMsg?: string | null, printedAt?: string | null) => void;
}

export const useQueueStore = create<QueueState>((set, get) => {
  return {
    jobs: [],
    isLoading: false,

    fetchJobs: async () => {
      set({ isLoading: true });
      try {
        if (window.electronAPI?.jobs?.getActive) {
          const active = await window.electronAPI.jobs.getActive();
          const history = await window.electronAPI.jobs.getHistory();
          set({ jobs: [...active, ...history], isLoading: false });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ jobs: [], isLoading: false });
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        set({ isLoading: false });
      }
    },

    reprintJob: async (id) => {
      try {
        if (window.electronAPI?.jobs?.reprint) {
          await window.electronAPI.jobs.reprint(id);
          await get().fetchJobs();
        } else {
          console.warn('Electron API reprint not available');
        }
      } catch (err) {
        console.error('Failed to reprint job:', err);
      }
    },

    cancelJob: async (id) => {
      try {
        if (window.electronAPI?.jobs?.cancel) {
          await window.electronAPI.jobs.cancel(id);
          await get().fetchJobs();
        } else {
          set({ jobs: get().jobs.filter((j) => j.id !== id) });
        }
      } catch (err) {
        console.error('Failed to cancel job:', err);
      }
    },

    pauseQueue: () => {
      console.log('Spooler queue paused.');
    },

    resumeQueue: () => {
      console.log('Spooler queue resumed.');
    },

    retryJob: async (id) => {
      await get().reprintJob(id);
    },

    forcePrintJob: async (id) => {
      try {
        set({ isLoading: true });
        // Under production, we request a reprint through the actual printer service
        if (window.electronAPI?.jobs?.reprint) {
          await window.electronAPI.jobs.reprint(id);
          await get().fetchJobs();
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        set({ isLoading: false });
      } catch (e) {
        console.error(e);
        set({ isLoading: false });
      }
    },

    updateJobStatus: (id: string, status: 'PENDING' | 'PRINTING' | 'SUCCESS' | 'FAILED', errorMsg?: string | null, printedAt?: string | null) => {
      const updated = get().jobs.map((j) => {
        if (j.id === id) {
          return {
            ...j,
            status,
            error_message: errorMsg !== undefined ? errorMsg : j.error_message,
            printed_at: printedAt !== undefined ? printedAt : j.printed_at
          } as IPrintJob;
        }
        return j;
      });
      set({ jobs: updated });
    }
  };
});
