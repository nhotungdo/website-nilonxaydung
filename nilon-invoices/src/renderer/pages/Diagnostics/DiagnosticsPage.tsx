import React, { useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Server 
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useSettingsStore } from '../../stores/settingsStore';

export const DiagnosticsPage: React.FC = () => {
  const { logs } = useSettingsStore();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // System parameters
  const sysInfo = [
    { label: 'Electron Version', val: '33.4.11' },
    { label: 'Node.js Version', val: 'v20.18.0' },
    { label: 'SQLite Version', val: '3.45.1' },
    { label: 'Windows Version', val: 'Windows 11 Home 23H2 (Build 22631.3447)' },
    { label: 'Application Version', val: 'Nilon Client v1.0.0-spooler-prod' }
  ];

  // Printer Latency Array
  const printerLatency = [
    { name: 'Thermal Cashier K80-A', latency: '42ms', delay: '0.1s spool delay', status: 'GOOD' },
    { name: 'Warehouse Delivery K80-B', latency: '87ms', delay: '0.4s spool delay', status: 'GOOD' },
    { name: 'Counter Helper K58', latency: '12ms (Direct USB)', delay: '0.0s spool delay', status: 'EXCELLENT' },
    { name: 'Backup POS-58 (Offline)', latency: 'TIMEOUT', delay: 'N/A', status: 'ERROR' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Hardware Telemetry Diagnostics"
        subtitle="Live diagnostics panel for host system health and local spool latency monitors."
      />

      {/* Grid: System & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hardware gauges */}
        <GlassCard className="border-white/5 lg:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Cpu className="h-4.5 w-4.5 text-blue-500" />
            Hardware Resource Monitor
          </h3>

          <div className="space-y-6">
            
            {/* CPU Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">CPU Spindle Load</span>
                <span className="text-slate-200 font-mono font-bold">14.8%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '14.8%' }}></div>
              </div>
            </div>

            {/* RAM Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">RAM Usage</span>
                <span className="text-slate-200 font-mono font-bold">186 MB <span className="text-slate-500">/ 16.0 GB</span></span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '4.2%' }}></div>
              </div>
            </div>

            {/* Disk space */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Disk Storage (C:)</span>
                <span className="text-slate-200 font-mono font-bold">428 GB Free</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '38.4%' }}></div>
              </div>
            </div>

          </div>
        </GlassCard>

        {/* System Information */}
        <GlassCard className="border-white/5 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Server className="h-4.5 w-4.5 text-blue-500" />
            Software Telemetry Context
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sysInfo.map((info, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.005] space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{info.label}</span>
                <span className="text-xs font-bold text-white font-mono block">{info.val}</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Printer Latency Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency Table Left */}
        <GlassCard className="border-white/5 lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Activity className="h-4.5 w-4.5 text-blue-500" />
            Hardware Spool Latency
          </h3>

          <div className="space-y-3">
            {printerLatency.map((prn, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.005] flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white block">{prn.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{prn.delay}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-black ${
                    prn.status === 'EXCELLENT' ? 'text-emerald-400' : prn.status === 'GOOD' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {prn.latency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Console Log Terminal Right */}
        <GlassCard className="border-white/5 lg:col-span-2 flex flex-col h-[350px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-emerald-500" />
              Live Spooler Telemetry Console
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              STREAMING
            </span>
          </div>

          {/* Terminal log panel */}
          <div className="flex-1 bg-black/60 rounded-xl p-4 overflow-y-auto font-mono text-xs border border-white/5 space-y-2 max-h-[250px] scrollbar-thin">
            {logs.map((log) => {
              const severityColor = 
                log.level === 'ERROR' ? 'text-red-400' :
                log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400';

              return (
                <div key={log.id} className="flex gap-2 leading-relaxed">
                  <span className="text-slate-600 flex-shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={`font-bold flex-shrink-0 ${severityColor}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 select-all">
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
