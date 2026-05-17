import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Pause, 
  Trash2, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  Zap
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useQueueStore } from '../../stores/queueStore';
import { usePrinterStore } from '../../stores/printerStore';

export const PrintQueuePage: React.FC = () => {
  const { jobs, reprintJob, cancelJob, pauseQueue, resumeQueue, forcePrintJob } = useQueueStore();
  const printers = usePrinterStore((s) => s.printers);

  const [isQueuePaused, setIsQueuePaused] = useState(false);

  const activeJobs = jobs.filter((j) => j.status === 'PENDING' || j.status === 'PRINTING');
  const completedJobs = jobs.filter((j) => j.status === 'SUCCESS');
  const failedJobs = jobs.filter((j) => j.status === 'FAILED');

  const handlePauseToggle = () => {
    if (isQueuePaused) {
      resumeQueue();
    } else {
      pauseQueue();
    }
    setIsQueuePaused(!isQueuePaused);
  };

  const getPrinterName = (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : 'Thermal Spooler';
  };

  const getQueueItem = (job: any, isActionable = true) => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 1000);
    const durationText = elapsedSeconds < 60 ? `${elapsedSeconds}s ago` : `${Math.floor(elapsedSeconds / 60)}m ago`;

    return (
      <div 
        key={job.id}
        className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 hover:bg-white/[0.02] transition-all"
      >
        {/* Progress bar for printing status */}
        {job.status === 'PRINTING' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/20 overflow-hidden">
            <div className="h-full bg-amber-500 animate-[shimmer_1.5s_infinite]" style={{ width: '60%' }}></div>
          </div>
        )}

        {/* Card Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-xs font-bold text-blue-400 font-mono">#{job.id}</span>
            <span className="text-xs font-semibold text-white block mt-0.5">{job.customer_name}</span>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Details list */}
        <div className="space-y-1 text-[11px] text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Printer:</span>
            <span className="text-slate-300 font-sans">{getPrinterName(job.printer_id)}</span>
          </div>
          <div className="flex justify-between">
            <span>Retries:</span>
            <span className="text-slate-300">{job.retry_count} / {job.max_retries}</span>
          </div>
          <div className="flex justify-between">
            <span>Settle Time:</span>
            <span className="text-slate-300">{durationText}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-white/5">
            <span className="text-slate-500 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              PDF Path:
            </span>
            <span className="text-slate-400 truncate text-[10px]" title={job.pdf_path}>{job.pdf_path}</span>
          </div>

          {job.error_message && (
            <div className="mt-2 p-2 rounded-lg bg-red-950/20 border border-red-500/10 text-red-400 text-[10px]">
              {job.error_message}
            </div>
          )}
        </div>

        {/* Action Controls */}
        {isActionable && (
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            {job.status === 'FAILED' ? (
              <>
                <button
                  onClick={() => reprintJob(job.id)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry Spool
                </button>
                <button
                  onClick={() => forcePrintJob(job.id)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <Zap className="h-3 w-3" />
                  Force Success
                </button>
              </>
            ) : (
              <button
                onClick={() => cancelJob(job.id)}
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Cancel Job
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Telemetry Print Queue"
        subtitle="Manage active hardware spool lines. Fully multi-threaded background printing pipeline."
        actions={
          <button
            onClick={handlePauseToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isQueuePaused 
                ? 'bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/20 text-amber-400'
            }`}
          >
            {isQueuePaused ? (
              <>
                <Play className="h-3.5 w-3.5" />
                Resume Spooler
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause Spooler
              </>
            )}
          </button>
        }
      />

      {/* Main 3 Column Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Active Queue */}
        <GlassCard className="border-white/5 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-blue-500" />
              Active Queue ({activeJobs.length})
            </h3>
            {isQueuePaused && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                PAUSED
              </span>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => getQueueItem(job))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Layers className="h-8 w-8 mb-2 opacity-30" />
                <span className="text-xs">No active spool jobs waiting.</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Column 2: Completed Queue */}
        <GlassCard className="border-white/5 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              Completed Queue ({completedJobs.length})
            </h3>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {completedJobs.length > 0 ? (
              completedJobs.map((job) => getQueueItem(job, false))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <CheckCircle2 className="h-8 w-8 mb-2 opacity-30" />
                <span className="text-xs">No completed print spools.</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Column 3: Failed Queue */}
        <GlassCard className="border-white/5 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="h-4.5 w-4.5 text-red-500" />
              Failed Queue ({failedJobs.length})
            </h3>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {failedJobs.length > 0 ? (
              failedJobs.map((job) => getQueueItem(job))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <ShieldAlert className="h-8 w-8 mb-2 opacity-30" />
                <span className="text-xs">No failed spool logs detected.</span>
              </div>
            )}
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
