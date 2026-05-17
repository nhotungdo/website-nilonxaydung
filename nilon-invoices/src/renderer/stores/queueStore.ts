import { create } from 'zustand';
import { IPrintJob } from '../../shared/types';
import { mockJobs } from '../mock/data';

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
  // Listen for simulated orders to create a dynamic realtime flow
  if (typeof window !== 'undefined') {
    window.addEventListener('simulated_order_arrived', (e: any) => {
      const order = e.detail;
      const newJob: IPrintJob = {
        id: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
        order_id: order.id,
        customer_name: order.customerName,
        printer_id: order.paperSize === 'K80' ? 'PRN-01' : 'PRN-03',
        pdf_path: `C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\${order.orderCode}.pdf`,
        status: 'PENDING',
        retry_count: 0,
        max_retries: 3,
        error_message: null,
        created_at: new Date().toISOString(),
        printed_at: null
      };

      set({ jobs: [newJob, ...get().jobs] });

      // Automatically transition status from PENDING -> PRINTING -> SUCCESS
      setTimeout(() => {
        get().updateJobStatus(newJob.id, 'PRINTING');
      }, 5000);

      setTimeout(() => {
        // 90% Success rate, 10% failure simulation
        const isSuccess = Math.random() > 0.1;
        if (isSuccess) {
          get().updateJobStatus(newJob.id, 'SUCCESS', null, new Date().toISOString());
        } else {
          get().updateJobStatus(newJob.id, 'FAILED', 'ERROR_PAPER_JAM: Paper jam at cutter spindle.');
        }
      }, 10000);
    });
  }

  return {
    jobs: mockJobs,
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
          set({ jobs: get().jobs, isLoading: false });
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
          const updated = get().jobs.map((j) => {
            if (j.id === id) {
              return {
                ...j,
                status: 'PENDING',
                retry_count: 0,
                error_message: null,
                created_at: new Date().toISOString(),
                printed_at: null
              } as IPrintJob;
            }
            return j;
          });
          set({ jobs: updated });

          // Mock status update progression
          setTimeout(() => get().updateJobStatus(id, 'PRINTING'), 2000);
          setTimeout(() => get().updateJobStatus(id, 'SUCCESS', null, new Date().toISOString()), 6000);
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
      // Logic for pausing printer queue
      console.log('Spooler queue paused.');
    },

    resumeQueue: () => {
      // Logic for resuming printer queue
      console.log('Spooler queue resumed.');
    },

    retryJob: async (id) => {
      await get().reprintJob(id);
    },

    forcePrintJob: async (id) => {
      try {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const updated = get().jobs.map((j) => {
          if (j.id === id) {
            return {
              ...j,
              status: 'SUCCESS',
              retry_count: j.retry_count + 1,
              error_message: null,
              printed_at: new Date().toISOString()
            } as IPrintJob;
          }
          return j;
        });
        set({ jobs: updated, isLoading: false });
      } catch (e) {
        console.error(e);
        set({ isLoading: false });
      }
    },

    // Helper method to mutate state programmatically for mockup updates
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
