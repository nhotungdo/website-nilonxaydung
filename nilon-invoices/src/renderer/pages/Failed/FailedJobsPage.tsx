import React from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Trash2, 
  FileWarning, 
  Percent, 
  Activity,
  Printer
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useQueueStore } from '../../stores/queueStore';
import { usePrinterStore } from '../../stores/printerStore';

export const FailedJobsPage: React.FC = () => {
  const { jobs, reprintJob, cancelJob } = useQueueStore();
  const printers = usePrinterStore((s) => s.printers);

  const failedJobs = jobs.filter((j) => j.status === 'FAILED');

  const getPrinterName = (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : 'Unknown Driver';
  };

  const handleRetryAll = async () => {
    for (const job of failedJobs) {
      await reprintJob(job.id);
    }
    alert('Reprint commands sent for all failed spools.');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Failed Print Spools"
        subtitle="Troubleshoot and retry blocked print jobs. High contrast diagnostic signals."
        actions={
          failedJobs.length > 0 && (
            <button
              onClick={handleRetryAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-md shadow-red-500/10 active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Retry All Spools
            </button>
          )
        }
      />

      {/* Red Accent Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Failed */}
        <GlassCard className="border-red-500/10 bg-red-500/[0.01] flex items-center gap-4 relative overflow-hidden group">
          {/* Pulsing red backing */}
          <div className="absolute right-0 top-0 h-16 w-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <FileWarning className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-400/80 uppercase tracking-wider block">Blocked Spools</span>
            <span className="text-2xl font-black text-white">{failedJobs.length}</span>
            <span className="text-[10px] text-red-400 font-bold block mt-0.5">Spooler stack delayed</span>
          </div>
        </GlassCard>

        {/* Retry Success Rate */}
        <GlassCard className="border-red-500/10 bg-red-500/[0.01] flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-400/80 uppercase tracking-wider block">Spool Recovery Rate</span>
            <span className="text-2xl font-black text-white">92.4%</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">High printer resilience</span>
          </div>
        </GlassCard>

        {/* Most Common Error */}
        <GlassCard className="border-red-500/10 bg-red-500/[0.01] flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-400/80 uppercase tracking-wider block">Top Hardware Error</span>
            <span className="text-lg font-black text-white truncate max-w-[180px] block">PRINTER_OFFLINE</span>
            <span className="text-[10px] text-red-400 font-bold block mt-0.5">Check USB connection</span>
          </div>
        </GlassCard>

      </div>

      {/* Detailed Diagnostic logs grid */}
      <GlassCard className="border-red-500/10 bg-red-500/[0.005] p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-red-500/15 bg-red-500/[0.02] text-red-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Error Spool ID</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Hardware Target</th>
                <th className="py-4 px-6">Error Code / Diagnostic message</th>
                <th className="py-4 px-6">Retries</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {failedJobs.length > 0 ? (
                failedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-red-500/[0.01] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-red-400 font-bold">#{job.id}</td>
                    <td className="py-4 px-6 font-bold text-white">{job.customer_name}</td>
                    <td className="py-4 px-6 text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                      <Printer className="h-3.5 w-3.5 text-slate-500" />
                      {getPrinterName(job.printer_id)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-red-400 font-mono">PRINTER_OFFLINE</span>
                        <span className="text-[11px] text-slate-400 leading-relaxed font-sans">{job.error_message || 'Hardware did not acknowledge print query.'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-300">{job.retry_count} / {job.max_retries}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {/* Retry */}
                      <button
                        onClick={() => reprintJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Retry Spool"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => cancelJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Purge Spool Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-slate-600 mb-1" />
                      <span className="text-xs">No active failed jobs detected. Spooler health is normal.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
