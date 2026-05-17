import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp,
  Printer,
  AlertCircle,
  Layers,
  Clock,
  Radio,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrderStore } from '../../stores/orderStore';
import { usePrinterStore } from '../../stores/printerStore';
import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../locales';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const orders = useOrderStore((s) => s.orders);
  const printers = usePrinterStore((s) => s.printers);
  const jobs = useQueueStore((s) => s.jobs);
  const { socketStatus } = useSettingsStore();

  const totalOrders = orders.length;
  const onlinePrinters = printers.filter((p) => p.status === 'ONLINE').length;
  const failedJobsCount = jobs.filter((j) => j.status === 'FAILED').length;
  const activeQueueCount = jobs.filter((j) => j.status === 'PENDING' || j.status === 'PRINTING').length;
  const recentJobs = jobs.slice(0, 5);

  const getPrinterName = (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : t('common.unknown');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };


  return (
    <div className="space-y-6">
      
      {/* Header and Telemetry */}
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              {t('dashboard.realtimeActive')}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t('dashboard.refreshTelemetry')}
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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t('dashboard.ordersToday')}</span>
            <span className="text-2xl font-black text-slate-800">{totalOrders}</span>
            <span className="text-[10px] text-blue-500 font-bold block mt-0.5">{t('dashboard.liveArrivals')}</span>
          </div>
        </GlassCard>

        {/* Active Printers */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Printer className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t('dashboard.activePrinters')}</span>
            <span className="text-2xl font-black text-slate-800">{onlinePrinters} <span className="text-xs font-normal text-slate-400">/ {printers.length}</span></span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">{t('dashboard.spoolersOnline')}</span>
          </div>
        </GlassCard>

        {/* Failed Jobs */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t('dashboard.failedSpoolJobs')}</span>
            <span className="text-2xl font-black text-slate-800">{failedJobsCount}</span>
            <span className="text-[10px] text-red-500 font-bold block mt-0.5">{t('dashboard.requiresRetry')}</span>
          </div>
        </GlassCard>

        {/* Active Queue Waiting */}
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t('dashboard.spoolQueueWaiting')}</span>
            <span className="text-2xl font-black text-slate-800">{activeQueueCount}</span>
            <span className="text-[10px] text-amber-500 font-bold block mt-0.5">{t('dashboard.backgroundExecution')}</span>
          </div>
        </GlassCard>

      </div>

      {/* Main Core Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (Recent activities & queue telemetry) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#005B52]" />
                {t('dashboard.spoolerQueueActivity')}
              </h3>
              <button 
                onClick={() => navigate('/queue')}
                className="text-xs text-[#005B52] font-semibold hover:underline"
              >
                {t('buttons.viewFullSpooler')}
              </button>
            </div>

            {/* Print Jobs table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200/80 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">{t('queueTable.jobId')}</th>
                    <th className="py-3 px-4">{t('queueTable.customer')}</th>
                    <th className="py-3 px-4">{t('queueTable.printer')}</th>
                    <th className="py-3 px-4">{t('queueTable.status')}</th>
                    <th className="py-3 px-4 text-right">{t('queueTable.spoolTime')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-[#005B52] font-semibold">{job.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{job.customer_name}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{getPrinterName(job.printer_id)}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-slate-400">
                          {new Date(job.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs italic font-medium">
                        {t('empty.waitingOrders')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right column (System telemetry indicators) */}
        <div className="space-y-6">
          
          {/* Socket & Network Status Card */}
          <GlassCard>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <Radio className="h-5 w-5 text-[#005B52]" />
              {t('socket.title')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('socket.connectionState')}:</span>
                {socketStatus === 'CONNECTED' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t('common.established')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    {t('common.disconnected')}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('socket.networkLatency')}:</span>
                <span className="text-xs font-mono font-bold text-slate-700">42ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('socket.socketPort')}:</span>
                <span className="text-xs font-mono font-bold text-slate-700">80/443 (Secure WSS)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('socket.listenerSubscriptions')}:</span>
                <span className="text-xs font-bold text-slate-700">ORDER_CREATED, printers, spool</span>
              </div>
            </div>
          </GlassCard>

          {/* Latest Order Alert panel */}
          <GlassCard className="relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-[#005B52]" />
              {t('dashboard.latestArrivedOrder')}
            </h3>

            {orders.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-800 font-mono">{orders[0].orderCode}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{orders[0].customerName}</span>
                  </div>
                  <span className="text-sm font-black text-[#005B52]">{formatCurrency(orders[0].totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{t('dashboard.methodCodBank')}</span>
                  <span>{new Date(orders[0].createdAt).toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-2 rounded-lg text-xs font-bold bg-[#005B52]/10 border border-[#005B52]/20 text-[#005B52] hover:bg-[#005B52]/20 transition-colors"
                >
                  {t('dashboard.interactInSpooler')}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 font-medium italic">
                {t('empty.waitingOrders')}
              </p>
            )}
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
