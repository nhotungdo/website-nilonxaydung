import React, { useState } from 'react';
import { Bell, Printer, Shield, User, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { usePrinterStore } from '../stores/printerStore';
import { useOrderStore } from '../stores/orderStore';
import { StatusBadge } from './StatusBadge';

export const Topbar: React.FC = () => {
  const socketStatus = useSettingsStore((s) => s.socketStatus);
  const settings = useSettingsStore((s) => s.settings);
  const printers = usePrinterStore((s) => s.printers);
  const soundEnabled = useOrderStore((s) => s.soundEnabled);
  const toggleSound = useOrderStore((s) => s.toggleSound);

  const [showNotifications, setShowNotifications] = useState(false);

  const defaultPrinter = printers.find((p) => p.is_default === 1) || printers[0];

  const mockAlerts = [
    { id: 1, title: 'New Order NLN-78932', time: '2 mins ago', read: false },
    { id: 2, title: 'Printer Cashier K80 online', time: '10 mins ago', read: true },
    { id: 3, title: 'Queue execution complete', time: '25 mins ago', read: true }
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-slate-950/20 border-b border-white/5 backdrop-blur-md relative z-40">
      
      {/* Telemetry info */}
      <div className="flex items-center gap-4">
        {/* Branch Info */}
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-300">
            {settings?.branch_id || 'BRANCH-HCM-01'}
          </span>
        </div>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>

        {/* Default Printer Info */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <Printer className="h-4 w-4 text-slate-500" />
          <span className="text-xs">
            Default: <span className="font-semibold text-white">{defaultPrinter?.name || 'None'}</span>
          </span>
          {defaultPrinter && (
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${defaultPrinter.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          )}
        </div>
      </div>

      {/* Action Telemetry Controls */}
      <div className="flex items-center gap-4">
        
        {/* Socket Status Badge */}
        <div className="flex items-center gap-2">
          {socketStatus === 'CONNECTED' ? (
            <StatusBadge status="ONLINE" className="font-bold tracking-wide" />
          ) : (
            <StatusBadge status="OFFLINE" className="font-bold tracking-wide bg-red-500/10 text-red-400 border-red-500/20" />
          )}
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-slate-900 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                  <h4 className="font-bold text-white text-sm">Notifications</h4>
                  <button className="text-xs text-blue-400 hover:underline">Mark all read</button>
                </div>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold ${alert.read ? 'text-slate-300' : 'text-blue-400 font-bold'}`}>
                          {alert.title}
                        </span>
                        {!alert.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>}
                      </div>
                      <span className="text-[10px] text-slate-500">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-white">Operator</span>
            <span className="text-[10px] text-slate-400">Main Cashier</span>
          </div>
        </div>

      </div>
    </header>
  );
};
