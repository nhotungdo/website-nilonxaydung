import React, { useState } from 'react';
import { Bell, Printer, Shield, User } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { usePrinterStore } from '../stores/printerStore';
import { StatusBadge } from './StatusBadge';
import { useTranslation } from '../locales';

export const Topbar: React.FC = () => {
  const socketStatus = useSettingsStore((s) => s.socketStatus);
  const settings = useSettingsStore((s) => s.settings);
  const printers = usePrinterStore((s) => s.printers);
  const { t } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);

  const defaultPrinter = printers.find((p) => p.is_default === 1) || printers[0];

  const mockAlerts = [
    { id: 1, title: t('topbar.newOrderAlert', { code: 'NLN-78932' }), time: t('topbar.agoMinutes', { n: 2 }), read: false },
    { id: 2, title: t('topbar.printerAlert', { name: 'Cashier K80' }), time: t('topbar.agoMinutes', { n: 10 }), read: true },
    { id: 3, title: t('topbar.queueAlert'), time: t('topbar.agoMinutes', { n: 25 }), read: true }
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/80 relative z-40">
      
      {/* Telemetry info */}
      <div className="flex items-center gap-4">
        {/* Branch Info */}
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#005B52]" />
          <span className="text-sm font-semibold text-slate-700">
            {settings?.branch_id || 'BRANCH-HCM-01'}
          </span>
        </div>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* Default Printer Info */}
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <Printer className="h-4 w-4 text-slate-400" />
          <span className="text-xs">
            {t('topbar.defaultPrinter')}: <span className="font-semibold text-slate-800">{defaultPrinter?.name || t('topbar.none')}</span>
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
            <StatusBadge status="OFFLINE" className="font-bold tracking-wide bg-red-50 text-red-600 border-red-200" />
          )}
        </div>



        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#005B52]"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-slate-800 text-sm">{t('topbar.notifications')}</h4>
                  <button className="text-xs text-[#005B52] hover:underline">{t('topbar.markAllRead')}</button>
                </div>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold ${alert.read ? 'text-slate-600' : 'text-[#005B52] font-bold'}`}>
                          {alert.title}
                        </span>
                        {!alert.read && <span className="h-1.5 w-1.5 rounded-full bg-[#005B52]"></span>}
                      </div>
                      <span className="text-[10px] text-slate-400">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-[#005B52]/10 border border-[#005B52]/20 flex items-center justify-center text-[#005B52]">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800">{t('topbar.operator')}</span>
            <span className="text-[10px] text-slate-500">{t('topbar.mainCashier')}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
