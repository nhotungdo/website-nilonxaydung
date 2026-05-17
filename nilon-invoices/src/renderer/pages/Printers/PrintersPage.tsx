import React, { useState } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  Loader2, 
  X
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { usePrinterStore } from '../../stores/printerStore';
import { useTranslation } from '../../locales';

export const PrintersPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    printers, 
    addPrinter, 
    deletePrinter, 
    setDefaultPrinter, 
    testPrinter 
  } = usePrinterStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Form states for new printer
  const [name, setName] = useState('');
  const [paperSize, setPaperSize] = useState<'K58' | 'K80'>('K80');
  const [connectionType, setConnectionType] = useState<'USB' | 'LAN' | 'WIFI'>('LAN');
  const [ipAddress, setIpAddress] = useState('192.168.1.');
  const [port, setPort] = useState('9100');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addPrinter({
      name,
      paper_size: paperSize,
      connection_type: connectionType,
      ip_address: connectionType === 'USB' ? null : ipAddress,
      port: connectionType === 'USB' ? null : parseInt(port) || 9100,
      is_default: 0
    });

    // Reset Form
    setName('');
    setPaperSize('K80');
    setConnectionType('LAN');
    setIpAddress('192.168.1.');
    setPort('9100');
    setShowAddModal(false);
  };

  const handleTestPrint = async (printerId: string) => {
    setTestingId(printerId);
    const result = await testPrinter(printerId);
    setTestingId(null);
    if (result.success) {
      alert(t('printers.testPrintSuccess'));
    } else {
      alert(t('printers.testPrintFailed', { error: result.error || t('common.unknownError') }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title={t('printers.title')}
        subtitle={t('printers.subtitle')}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {t('printers.addPrinter')}
          </button>
        }
      />

      {/* Printers Table Card */}
      <GlassCard className="border-white/5 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">{t('printers.printerName')}</th>
                <th className="py-4 px-6">{t('printers.paperSize')}</th>
                <th className="py-4 px-6">{t('printers.connectionType')}</th>
                <th className="py-4 px-6">{t('printers.driverTarget')}</th>
                <th className="py-4 px-6">{t('queueTable.status')}</th>
                <th className="py-4 px-6">{t('printers.default')}</th>
                <th className="py-4 px-6 text-right">{t('failed.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {printers.map((printer) => (
                <tr key={printer.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Printer className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-white">{printer.name}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 font-mono text-xs text-slate-300">
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/10">{printer.paper_size}</span>
                  </td>

                  <td className="py-4 px-6 font-bold text-xs text-slate-400">{printer.connection_type}</td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-400">
                    {printer.connection_type === 'USB' ? t('printers.usbLocalSpool') : `${printer.ip_address}:${printer.port}`}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={printer.status} />
                  </td>

                  <td className="py-4 px-6">
                    {printer.is_default === 1 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <Check className="h-4.5 w-4.5 text-emerald-400" />
                        {t('printers.default')}
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultPrinter(printer.id)}
                        className="text-xs text-slate-500 hover:text-white hover:underline transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {t('printers.setDefault')}
                      </button>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {/* Print Test Page */}
                    <button
                      onClick={() => handleTestPrint(printer.id)}
                      disabled={testingId !== null}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      {testingId === printer.id ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {t('printers.testing')}
                        </span>
                      ) : (
                        t('printers.printTest')
                      )}
                    </button>

                    {/* Delete Printer */}
                    <button
                      onClick={() => deletePrinter(printer.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Printer Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            {/* Glow backing */}
            <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-xl opacity-30"></div>
            
            <GlassCard className="relative p-6 border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Printer className="h-5 w-5 text-blue-500" />
                  {t('printers.addPrinter')}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Printer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('printers.printerName')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('printers.namePlaceholder')}
                    required
                    className="w-full px-3 py-2 text-sm bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40"
                  />
                </div>

                {/* Paper size / Conn layout */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('printers.paperSize')}</label>
                    <select
                      value={paperSize}
                      onChange={(e: any) => setPaperSize(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40"
                    >
                      <option value="K80">K80 (Width 80mm)</option>
                      <option value="K58">K58 (Width 58mm)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('printers.connectionType')}</label>
                    <select
                      value={connectionType}
                      onChange={(e: any) => setConnectionType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40"
                    >
                      <option value="LAN">LAN (Ethernet)</option>
                      <option value="USB">USB Local</option>
                      <option value="WIFI">WIFI Network</option>
                    </select>
                  </div>
                </div>

                {/* IP Address & Port (only if LAN/WIFI) */}
                {connectionType !== 'USB' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('printers.ipAddress')}</label>
                      <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="192.168.1.100"
                        required
                        className="w-full px-3 py-2 text-sm bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('printers.port')}</label>
                      <input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="9100"
                        required
                        className="w-full px-3 py-2 text-sm bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    {t('buttons.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 font-bold text-white transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
                  >
                    {t('printers.saveSpooler')}
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}

    </div>
  );
};
