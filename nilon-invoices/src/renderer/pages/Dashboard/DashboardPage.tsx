import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Printer, 
  AlertCircle, 
  Layers, 
  Clock, 
  Radio, 
  Play, 
  Square,
  FileSpreadsheet
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrderStore } from '../../stores/orderStore';
import { usePrinterStore } from '../../stores/printerStore';
import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Connect to Zustand stores for unified, dynamic state!
  const { orders, isSimulating, startSimulation, stopSimulation, triggerChime } = useOrderStore();
  const printers = usePrinterStore((s) => s.printers);
  const { jobs, fetchJobs } = useQueueStore();
  const socketStatus = useSettingsStore((s) => s.socketStatus);

  useEffect(() => {
    fetchJobs();
    // Auto-start simulation in mock mode to make the UI feel alive!
    if (!isSimulating) {
      startSimulation();
    }
  }, []);

  // Compute live widget statistics
  const totalOrders = orders.length;
  const onlinePrinters = printers.filter((p) => p.status === 'ONLINE').length;
  const failedJobsCount = jobs.filter((j) => j.status === 'FAILED').length;
  const activeQueueCount = jobs.filter((j) => j.status === 'PENDING' || j.status === 'PRINTING').length;

  const recentJobs = jobs.slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getPrinterName = (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : 'System Driver';
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Industrial Telemetry Dashboard"
        subtitle="Real-time monitor for local thermal print queues & NestJS API sockets."
        actions={
          <div className="flex items-center gap-3">
            {/* Simulation Controller */}
            {isSimulating ? (
              <button
                onClick={stopSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/20 text-amber-400 transition-all active:scale-[0.98]"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop Order Simulator
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 transition-all active:scale-[0.98]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Start Order Simulator
              </button>
            )}

            <button
              onClick={triggerChime}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
            >
              Test Chime
            </button>
          </div>
        }
      />

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Orders Today */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Orders Today</span>
            <span className="text-2xl font-black text-white">{totalOrders}</span>
            <span className="text-[10px] text-blue-400 font-bold block mt-0.5">Live arrivals</span>
          </div>
        </GlassCard>

        {/* Active Printers */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Printer className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Printers</span>
            <span className="text-2xl font-black text-white">{onlinePrinters} <span className="text-xs font-normal text-slate-400">/ {printers.length}</span></span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Spoolers online</span>
          </div>
        </GlassCard>

        {/* Failed Jobs */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Failed Spool Jobs</span>
            <span className="text-2xl font-black text-white">{failedJobsCount}</span>
            <span className="text-[10px] text-red-400 font-bold block mt-0.5">Requires retry</span>
          </div>
        </GlassCard>

        {/* Active Queue Waiting */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Spool Queue Waiting</span>
            <span className="text-2xl font-black text-white">{activeQueueCount}</span>
            <span className="text-[10px] text-amber-400 font-bold block mt-0.5">Background execution</span>
          </div>
        </GlassCard>

      </div>

      {/* Main Core Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (Recent activities & queue telemetry) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-white/5">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Spooler Queue Activity
              </h3>
              <button 
                onClick={() => navigate('/queue')}
                className="text-xs text-blue-400 hover:underline"
              >
                View Full Spooler
              </button>
            </div>

            {/* Print Jobs table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Printer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Spool Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">{job.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{job.customer_name}</td>
                      <td className="py-3 px-4 text-xs text-slate-400">{getPrinterName(job.printer_id)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-500">
                        {new Date(job.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right column (System telemetry indicators) */}
        <div className="space-y-6">
          
          {/* Socket & Network Status Card */}
          <GlassCard className="border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <Radio className="h-5 w-5 text-blue-500" />
              Socket.IO System Health
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Connection State:</span>
                {socketStatus === 'CONNECTED' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ESTABLISHED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    DISCONNECTED
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Network Latency:</span>
                <span className="text-xs font-mono font-bold text-slate-300">42ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Socket Port:</span>
                <span className="text-xs font-mono font-bold text-slate-300">80/443 (Secure WSS)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Listener Subscriptions:</span>
                <span className="text-xs font-bold text-slate-300">orders, printers, spool</span>
              </div>
            </div>
          </GlassCard>

          {/* Latest Order Alert panel */}
          <GlassCard className="border-white/5 relative overflow-hidden">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
              Latest Arrived Order
            </h3>

            {orders.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-white font-mono">{orders[0].orderCode}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{orders[0].customerName}</span>
                  </div>
                  <span className="text-sm font-black text-blue-400">{formatCurrency(orders[0].totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Method: COD / Bank Transfer</span>
                  <span>{new Date(orders[0].createdAt).toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  Interact in Spooler
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">Waiting for new orders...</p>
            )}
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
