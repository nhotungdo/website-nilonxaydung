import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/app.store';
import { 
  Printer, 
  Wifi, 
  WifiOff, 
  Trash2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Activity, 
  Sliders, 
  FileText,
  Clock,
  Terminal,
  Database
} from 'lucide-react';

export default function Dashboard() {
  const {
    printers,
    activeJobs,
    jobHistory,
    settings,
    logs,
    socketStatus,
    fetchPrinters,
    fetchJobs,
    fetchSettings,
    fetchLogs,
    addPrinter,
    deletePrinter,
    setDefaultPrinter,
    testPrinter,
    reprintJob,
    clearJobHistory,
    updateSettings,
    setStartup,
    setSocketStatus,
    addSystemLog
  } = useAppStore();

  // Dialog forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrinterName, setNewPrinterName] = useState('');
  const [newPrinterPaper, setNewPrinterPaper] = useState<'K58' | 'K80'>('K80');
  const [newPrinterType, setNewPrinterType] = useState<'USB' | 'LAN' | 'WIFI'>('USB');
  const [newPrinterIp, setNewPrinterIp] = useState('');
  const [newPrinterPort, setNewPrinterPort] = useState('9100');
  const [newPrinterDefault, setNewPrinterDefault] = useState(false);

  // Connection inputs
  const [editApiUrl, setEditApiUrl] = useState('');
  const [editBranchId, setEditBranchId] = useState('');
  const [editApiKey, setEditApiKey] = useState('');



  // Run initial state fetching loops
  useEffect(() => {
    fetchPrinters();
    fetchJobs();
    fetchSettings();
    fetchLogs();

    // Set polling timers for log diagnostic outputs
    const timer = setInterval(() => {
      fetchJobs();
      fetchLogs();
      fetchPrinters();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Sync settings properties locally when loaded
  useEffect(() => {
    if (settings) {
      setEditApiUrl(settings.api_url);
      setEditBranchId(settings.branch_id);
      setEditApiKey(settings.api_key);
      setSocketStatus(settings.is_online ? 'CONNECTED' : 'DISCONNECTED');
    }
  }, [settings]);

  // IPC Event listeners hook
  useEffect(() => {
    // 1. New print updates
    const unbindJobUpdate = window.electronAPI.jobs.onUpdate((_event: any, data: any) => {
      fetchJobs();
      fetchLogs();
      
      if (data.status === 'SUCCESS') {
        addSystemLog({
          id: Date.now(),
          level: 'INFO',
          printer_id: null,
          message: `Printed spool job successfully. ID: ${data.jobId}`,
          timestamp: new Date().toISOString()
        });
      } else if (data.status === 'FAILED') {
        addSystemLog({
          id: Date.now(),
          level: 'ERROR',
          printer_id: null,
          message: `Print failed on Job: ${data.jobId}. Error: ${data.error}`,
          timestamp: new Date().toISOString()
        });
      }
    });

    // 2. Real-time API Connection state drops
    const unbindSocketChange = window.electronAPI.socket.onStatusChange((status: any) => {
      setSocketStatus(status);
      addSystemLog({
        id: Date.now(),
        level: status === 'CONNECTED' ? 'INFO' : 'WARN',
        printer_id: null,
        message: `Socket.IO Client status altered: ${status}`,
        timestamp: new Date().toISOString()
      });
    });

    // 3. New real-time order alerts
    const unbindNewOrder = window.electronAPI.socket.onNewOrder((order: any) => {
      addSystemLog({
        id: Date.now(),
        level: 'INFO',
        printer_id: null,
        message: `Real-time order arrived! Code: ${order.orderCode || order.id}`,
        timestamp: new Date().toISOString()
      });
      fetchJobs();
    });

    return () => {
      unbindJobUpdate();
      unbindSocketChange();
      unbindNewOrder();
    };
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      api_url: editApiUrl,
      branch_id: editBranchId,
      api_key: editApiKey,
    });
    addSystemLog({
      id: Date.now(),
      level: 'INFO',
      printer_id: null,
      message: 'App settings updated. System reconnect initiated.',
      timestamp: new Date().toISOString()
    });
  };

  const handleAddPrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrinterName.trim()) return;

    await addPrinter({
      name: newPrinterName,
      connection_type: newPrinterType,
      ip_address: newPrinterType !== 'USB' ? newPrinterIp : null,
      port: newPrinterType !== 'USB' ? parseInt(newPrinterPort) : null,
      paper_size: newPrinterPaper,
      is_default: newPrinterDefault ? 1 : 0
    });

    // Reset Form
    setNewPrinterName('');
    setNewPrinterIp('');
    setNewPrinterPort('9100');
    setNewPrinterDefault(false);
    setShowAddModal(false);
  };

  const handleTestPrint = async (id: string) => {
    addSystemLog({
      id: Date.now(),
      level: 'INFO',
      printer_id: id,
      message: 'Triggering thermal test diagnostic print page...',
      timestamp: new Date().toISOString()
    });
    const result = await testPrinter(id);
    if (!result.success) {
      alert(`Test print error: ${result.error}`);
    }
  };

  // Math summary statistics
  const successJobs = jobHistory.filter(j => j.status === 'SUCCESS').length;
  const failedJobs = jobHistory.filter(j => j.status === 'FAILED').length;
  const totalCompleted = successJobs + failedJobs;
  const successPercentage = totalCompleted > 0 ? Math.round((successJobs / totalCompleted) * 100) : 100;

  return (
    <div className="h-screen w-screen flex flex-col p-4 space-y-4 relative bg-premium-glow">
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center p-4 rounded-2xl glass-panel relative overflow-hidden shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20 text-brand-400">
            <Printer className="h-6 w-6 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
              NILON INVOICES <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full ml-2 font-mono border border-brand-500/30">CLIENT v1.0.0</span>
            </h1>
            <p className="text-xs text-slate-400">Thiết bị in hóa đơn tự động realtime chuyên nghiệp</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Branch tag */}
          {settings && (
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs text-slate-400">Chi Nhánh Cửa Hàng</span>
              <span className="text-xs font-semibold text-slate-200">{settings.branch_id}</span>
            </div>
          )}

          {/* Connection state */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
            socketStatus === 'CONNECTED'
              ? 'bg-accent-success/10 border-accent-success/30 text-accent-success neon-glow-success'
              : 'bg-accent-error/10 border-accent-error/30 text-accent-error neon-glow-error'
          }`}>
            {socketStatus === 'CONNECTED' ? (
              <>
                <Wifi className="h-4 w-4 animate-pulse" />
                <span className="text-xs font-semibold font-mono">REALTIME ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span className="text-xs font-semibold font-mono">OFFLINE CACHE</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT GRID */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COMPONENT: PRINT QUEUE & STATS (5 columns) */}
        <section className="lg:col-span-4 flex flex-col space-y-4 min-h-0">
          {/* Metrics summary widgets */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl glass-card relative overflow-hidden">
              <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Đã in thành công</div>
              <div className="text-2xl font-bold mt-1 text-accent-success tracking-tight">{successJobs}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1 text-accent-success" /> Tỷ lệ: {successPercentage}%
              </div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card relative overflow-hidden">
              <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Lỗi kẹt máy in</div>
              <div className="text-2xl font-bold mt-1 text-accent-error tracking-tight">{failedJobs}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1 text-accent-warning" /> Hàng đợi: {activeJobs.length} đơn
              </div>
            </div>
          </div>

          {/* Active queue list */}
          <div className="flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0 relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <Activity className="h-4 w-4 mr-1.5 text-brand-400" />
                Hàng Đợi Spooling ({activeJobs.length})
              </h2>
              {activeJobs.length > 0 && (
                <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {activeJobs.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-slate-500 py-12">
                  <FileText className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-xs">Không có hóa đơn nào trong hàng đợi</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Sẵn sàng nhận hóa đơn từ website...</p>
                </div>
              ) : (
                activeJobs.map((job) => (
                  <div key={job.id} className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                    job.status === 'PRINTING'
                      ? 'bg-brand-500/10 border-brand-500/40 animate-pulse'
                      : 'bg-white/5 border-white/5'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        job.status === 'PRINTING' ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Printer className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Đơn hàng: {job.order_id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.customer_name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {job.status === 'PRINTING' ? (
                        <span className="text-[10px] font-bold text-brand-400 animate-pulse font-mono">ĐANG IN...</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">CHỜ IN</span>
                          {job.retry_count > 0 && (
                            <span className="text-[9px] text-accent-warning mt-0.5">Thử lại: {job.retry_count} lần</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* MIDDLE COMPONENT: PRINTER REGISTRY & SETTINGS (4 columns) */}
        <section className="lg:col-span-4 flex flex-col space-y-4 min-h-0">
          
          {/* Physical printers directory */}
          <div className="flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <Database className="h-4 w-4 mr-1.5 text-brand-400" />
                Cấu Hình Máy In ({printers.length})
              </h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="p-1 bg-brand-500 hover:bg-brand-600 rounded-lg text-white transition-all flex items-center text-xs px-2 py-1"
              >
                <Plus className="h-3 w-3 mr-0.5" /> Thêm máy
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {printers.map((printer) => (
                <div key={printer.id} className="p-3 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-brand-500/30 transition-all">
                  
                  {/* Default Tag */}
                  {printer.is_default === 1 && (
                    <span className="absolute top-0 right-0 text-[8px] bg-brand-500/20 text-brand-300 border-l border-b border-brand-500/30 px-2 py-0.5 font-bold uppercase font-mono tracking-wider rounded-bl-lg">
                      Mặc định
                    </span>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center">
                        <Printer className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {printer.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                          {printer.paper_size}
                        </span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {printer.connection_type}
                        </span>
                        {printer.connection_type !== 'USB' && (
                          <span className="text-[9px] text-slate-400 font-mono">{printer.ip_address}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 mt-3 pt-2.5">
                    <span className={`h-2 w-2 rounded-full ${
                      printer.status === 'ONLINE' ? 'bg-accent-success' : 'bg-accent-error'
                    }`}></span>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleTestPrint(printer.id)}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-all flex items-center"
                      >
                        <Play className="h-2.5 w-2.5 mr-0.5" /> In thử
                      </button>
                      
                      {printer.is_default === 0 && (
                        <button 
                          onClick={() => setDefaultPrinter(printer.id)}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-all"
                        >
                          Mặc định
                        </button>
                      )}

                      <button 
                        onClick={() => deletePrinter(printer.id)}
                        className="text-[10px] hover:bg-accent-error/20 text-slate-400 hover:text-accent-error p-1 rounded-md transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COMPONENT: PRINT HISTORY & TELEMETRY LOGS (3 columns) */}
        <section className="lg:col-span-4 flex flex-col space-y-4 min-h-0">
          
          {/* History print list */}
          <div className="flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <Sliders className="h-4 w-4 mr-1.5 text-brand-400" />
                Lịch Sử In Gần Đây
              </h2>
              {jobHistory.length > 0 && (
                <button 
                  onClick={clearJobHistory}
                  className="text-[10px] text-slate-400 hover:text-accent-error flex items-center font-mono"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {jobHistory.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-slate-500 py-12">
                  <Clock className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-xs">Chưa có lịch sử in đơn hàng</p>
                </div>
              ) : (
                jobHistory.map((job) => (
                  <div key={job.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center hover:border-brand-500/10 transition-all">
                    <div>
                      <div className="text-xs font-bold text-slate-200">Đơn hàng: {job.order_id}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{job.customer_name}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {job.status === 'SUCCESS' ? (
                        <div className="flex items-center text-accent-success text-[10px] font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        </div>
                      ) : (
                        <div className="flex items-center text-accent-error text-[10px] font-bold" title={job.error_message || ''}>
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                        </div>
                      )}

                      <button 
                        onClick={() => reprintJob(job.id)}
                        className="text-[9px] bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 hover:text-brand-200 px-2 py-0.5 rounded transition-all font-mono"
                      >
                        In lại
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System status & debug console */}
          <div className="h-44 rounded-2xl glass-panel p-4 flex flex-col shrink-0 min-h-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center mb-2 shrink-0">
              <Terminal className="h-4 w-4 mr-1.5 text-brand-400" />
              Báo cáo log hệ thống
            </h2>
            <div className="flex-1 bg-black/40 rounded-xl p-2 font-mono text-[9px] text-slate-400 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center py-6">Chưa ghi nhận log hoạt động</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`leading-relaxed ${
                    log.level === 'ERROR' ? 'text-accent-error' : log.level === 'WARN' ? 'text-accent-warning' : 'text-slate-400'
                  }`}>
                    [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER BAR: LOCAL STORAGE & PREFERENCES (Shrink-0) */}
      <footer className="rounded-2xl glass-panel p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shrink-0">
        
        {/* Toggle preference switches */}
        {settings && (
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.auto_print} 
                onChange={(e) => updateSettings({ auto_print: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4"
              />
              <span>Tự động in đơn</span>
            </label>



            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.run_on_startup} 
                onChange={(e) => setStartup(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4"
              />
              <span>Khởi động cùng Windows</span>
            </label>
          </div>
        )}

        {/* Dynamic connection endpoint form */}
        <form onSubmit={handleSaveSettings} className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <input 
            type="text" 
            placeholder="NestJS Server API URL"
            value={editApiUrl}
            onChange={(e) => setEditApiUrl(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono placeholder:text-slate-500 w-full sm:w-56 focus:outline-none focus:border-brand-500"
          />
          <input 
            type="password" 
            placeholder="Authorization API Key"
            value={editApiKey}
            onChange={(e) => setEditApiKey(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono placeholder:text-slate-500 w-full sm:w-40 focus:outline-none focus:border-brand-500"
          />
          <button 
            type="submit" 
            className="text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-all"
          >
            Lưu kết nối
          </button>
        </form>
      </footer>

      {/* MODAL: ADD PRINTER FORM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4">Thêm máy in nhiệt mới</h3>
            
            <form onSubmit={handleAddPrinter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tên Máy In Hệ Thống</label>
                <input 
                  type="text" 
                  placeholder="e.g. Xprinter XP-80C"
                  value={newPrinterName}
                  onChange={(e) => setNewPrinterName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Khổ giấy</label>
                  <select 
                    value={newPrinterPaper}
                    onChange={(e) => setNewPrinterPaper(e.target.value as 'K58' | 'K80')}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="K80">K80 (80mm - Receipt)</option>
                    <option value="K58">K58 (58mm - Mini)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kiểu kết nối</label>
                  <select 
                    value={newPrinterType}
                    onChange={(e) => setNewPrinterType(e.target.value as 'USB' | 'LAN' | 'WIFI')}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="USB">USB (Cổng cục bộ)</option>
                    <option value="LAN">LAN (Cáp mạng)</option>
                    <option value="WIFI">Wi-Fi (Không dây)</option>
                  </select>
                </div>
              </div>

              {newPrinterType !== 'USB' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Địa chỉ IP</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 192.168.1.100"
                      value={newPrinterIp}
                      onChange={(e) => setNewPrinterIp(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Port</label>
                    <input 
                      type="text" 
                      placeholder="9100"
                      value={newPrinterPort}
                      onChange={(e) => setNewPrinterPort(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer pt-2">
                <input 
                  type="checkbox" 
                  checked={newPrinterDefault}
                  onChange={(e) => setNewPrinterDefault(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4"
                />
                <span>Chọn máy in mặc định cho kích cỡ này</span>
              </label>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2 rounded-lg transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
