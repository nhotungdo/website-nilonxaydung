import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useSettingsStore } from '../stores/settingsStore';
import { usePrinterStore } from '../stores/printerStore';

export const MainLayout: React.FC = () => {
  const socketStatus = useSettingsStore((s) => s.socketStatus);
  const printers = usePrinterStore((s) => s.printers);
  const defaultPrinter = printers.find((p) => p.is_default === 1) || printers[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar Telemetry Header */}
        <Topbar />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 pb-14 bg-[#F4F6F9]">
          <div className="mx-auto max-w-7xl h-full flex flex-col">
            <Outlet />
          </div>
        </main>

        {/* Sticky Bottom Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#EBF3FC]/95 backdrop-blur-sm border-t border-[#D2E3F6] flex items-center justify-between px-6 text-[11px] font-semibold text-slate-650 z-30 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${socketStatus === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              Socket.IO: <span className="font-bold text-slate-800">{socketStatus === 'CONNECTED' ? 'Connected' : 'Disconnected'}</span>
            </span>
            <span className="text-[#BCCFE5]">|</span>
            <span>DB Cluster: <span className="font-bold text-slate-800">01</span></span>
            <span className="text-[#BCCFE5]">|</span>
            <span>
              Default Printer:{' '}
              <span className="font-bold text-slate-800">
                {defaultPrinter ? `${defaultPrinter.name} (${defaultPrinter.status === 'ONLINE' ? 'Online' : 'Offline'})` : 'HP-LaserJet-9000 (Online)'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <a href="#/docs" className="hover:text-slate-800 transition-colors">Documentation</a>
            <span>|</span>
            <a href="#/logs" className="hover:text-slate-800 transition-colors">System Logs</a>
          </div>
        </div>
      </div>
    </div>
  );
};
