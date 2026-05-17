import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/app.store';
import { Printer, Wifi, WifiOff, Trash2, Play, CheckCircle2, XCircle, AlertTriangle, Plus, Activity, Sliders, Volume2, VolumeX, FileText, Clock, Terminal, Database } from 'lucide-react';
export default function Dashboard() {
    const { printers, activeJobs, jobHistory, settings, logs, socketStatus, fetchPrinters, fetchJobs, fetchSettings, fetchLogs, addPrinter, deletePrinter, setDefaultPrinter, testPrinter, reprintJob, clearJobHistory, updateSettings, setStartup, setSocketStatus, addSystemLog } = useAppStore();
    // Dialog forms
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPrinterName, setNewPrinterName] = useState('');
    const [newPrinterPaper, setNewPrinterPaper] = useState('K80');
    const [newPrinterType, setNewPrinterType] = useState('USB');
    const [newPrinterIp, setNewPrinterIp] = useState('');
    const [newPrinterPort, setNewPrinterPort] = useState('9100');
    const [newPrinterDefault, setNewPrinterDefault] = useState(false);
    // Connection inputs
    const [editApiUrl, setEditApiUrl] = useState('');
    const [editBranchId, setEditBranchId] = useState('');
    const [editApiKey, setEditApiKey] = useState('');
    // Synthesize premium high-fidelity notify sound via Web Audio API (zero asset dependency)
    const playNewOrderChime = () => {
        if (settings && !settings.sound_alert)
            return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            // Tone 1 (C5 - Ding)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
            gain1.gain.setValueAtTime(0.15, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(ctx.currentTime + 0.4);
            // Tone 2 (E5 - Dong)
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
                gain2.gain.setValueAtTime(0.20, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.5);
            }, 150);
        }
        catch (e) {
            console.warn('Web Audio synthesis blocked or unsupported:', e);
        }
    };
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
        const unbindJobUpdate = window.electronAPI.jobs.onUpdate((_event, data) => {
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
            }
            else if (data.status === 'FAILED') {
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
        const unbindSocketChange = window.electronAPI.socket.onStatusChange((status) => {
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
        const unbindNewOrder = window.electronAPI.socket.onNewOrder((order) => {
            playNewOrderChime();
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
    const handleSaveSettings = async (e) => {
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
    const handleAddPrinter = async (e) => {
        e.preventDefault();
        if (!newPrinterName.trim())
            return;
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
    const handleTestPrint = async (id) => {
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
    return (_jsxs("div", { className: "h-screen w-screen flex flex-col p-4 space-y-4 relative bg-premium-glow", children: [_jsxs("header", { className: "flex justify-between items-center p-4 rounded-2xl glass-panel relative overflow-hidden shrink-0", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20 text-brand-400", children: _jsx(Printer, { className: "h-6 w-6 animate-pulse-glow" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold tracking-tight text-white flex items-center", children: ["NILON INVOICES ", _jsx("span", { className: "text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full ml-2 font-mono border border-brand-500/30", children: "CLIENT v1.0.0" })] }), _jsx("p", { className: "text-xs text-slate-400", children: "Thi\u1EBFt b\u1ECB in h\u00F3a \u0111\u01A1n t\u1EF1 \u0111\u1ED9ng realtime chuy\u00EAn nghi\u1EC7p" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [settings && (_jsxs("div", { className: "flex flex-col text-right hidden sm:flex", children: [_jsx("span", { className: "text-xs text-slate-400", children: "Chi Nh\u00E1nh C\u1EEDa H\u00E0ng" }), _jsx("span", { className: "text-xs font-semibold text-slate-200", children: settings.branch_id })] })), _jsx("div", { className: `flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${socketStatus === 'CONNECTED'
                                    ? 'bg-accent-success/10 border-accent-success/30 text-accent-success neon-glow-success'
                                    : 'bg-accent-error/10 border-accent-error/30 text-accent-error neon-glow-error'}`, children: socketStatus === 'CONNECTED' ? (_jsxs(_Fragment, { children: [_jsx(Wifi, { className: "h-4 w-4 animate-pulse" }), _jsx("span", { className: "text-xs font-semibold font-mono", children: "REALTIME ONLINE" })] })) : (_jsxs(_Fragment, { children: [_jsx(WifiOff, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs font-semibold font-mono", children: "OFFLINE CACHE" })] })) })] })] }), _jsxs("main", { className: "flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4", children: [_jsxs("section", { className: "lg:col-span-4 flex flex-col space-y-4 min-h-0", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3 shrink-0", children: [_jsxs("div", { className: "p-3.5 rounded-2xl glass-card relative overflow-hidden", children: [_jsx("div", { className: "text-[10px] uppercase font-mono text-slate-400 tracking-wider", children: "\u0110\u00E3 in th\u00E0nh c\u00F4ng" }), _jsx("div", { className: "text-2xl font-bold mt-1 text-accent-success tracking-tight", children: successJobs }), _jsxs("div", { className: "text-[10px] text-slate-400 mt-1 flex items-center", children: [_jsx(CheckCircle2, { className: "h-3 w-3 mr-1 text-accent-success" }), " T\u1EF7 l\u1EC7: ", successPercentage, "%"] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl glass-card relative overflow-hidden", children: [_jsx("div", { className: "text-[10px] uppercase font-mono text-slate-400 tracking-wider", children: "L\u1ED7i k\u1EB9t m\u00E1y in" }), _jsx("div", { className: "text-2xl font-bold mt-1 text-accent-error tracking-tight", children: failedJobs }), _jsxs("div", { className: "text-[10px] text-slate-400 mt-1 flex items-center", children: [_jsx(AlertTriangle, { className: "h-3 w-3 mr-1 text-accent-warning" }), " H\u00E0ng \u0111\u1EE3i: ", activeJobs.length, " \u0111\u01A1n"] })] })] }), _jsxs("div", { className: "flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0 relative overflow-hidden", children: [_jsxs("div", { className: "flex justify-between items-center mb-3 shrink-0", children: [_jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center", children: [_jsx(Activity, { className: "h-4 w-4 mr-1.5 text-brand-400" }), "H\u00E0ng \u0110\u1EE3i Spooling (", activeJobs.length, ")"] }), activeJobs.length > 0 && (_jsx("span", { className: "h-2 w-2 rounded-full bg-brand-500 animate-ping" }))] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-2.5 pr-1", children: activeJobs.length === 0 ? (_jsxs("div", { className: "h-full flex flex-col justify-center items-center text-slate-500 py-12", children: [_jsx(FileText, { className: "h-10 w-10 mb-2 opacity-20" }), _jsx("p", { className: "text-xs", children: "Kh\u00F4ng c\u00F3 h\u00F3a \u0111\u01A1n n\u00E0o trong h\u00E0ng \u0111\u1EE3i" }), _jsx("p", { className: "text-[10px] opacity-75 mt-0.5", children: "S\u1EB5n s\u00E0ng nh\u1EADn h\u00F3a \u0111\u01A1n t\u1EEB website..." })] })) : (activeJobs.map((job) => (_jsxs("div", { className: `p-3 rounded-xl border flex justify-between items-center transition-all ${job.status === 'PRINTING'
                                                ? 'bg-brand-500/10 border-brand-500/40 animate-pulse'
                                                : 'bg-white/5 border-white/5'}`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `p-2 rounded-lg ${job.status === 'PRINTING' ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'}`, children: _jsx(Printer, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-xs font-bold text-slate-200", children: ["\u0110\u01A1n h\u00E0ng: ", job.order_id] }), _jsxs("div", { className: "text-[10px] text-slate-400 mt-0.5 flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), job.customer_name] })] })] }), _jsx("div", { className: "text-right", children: job.status === 'PRINTING' ? (_jsx("span", { className: "text-[10px] font-bold text-brand-400 animate-pulse font-mono", children: "\u0110ANG IN..." })) : (_jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: "text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono", children: "CH\u1EDC IN" }), job.retry_count > 0 && (_jsxs("span", { className: "text-[9px] text-accent-warning mt-0.5", children: ["Th\u1EED l\u1EA1i: ", job.retry_count, " l\u1EA7n"] }))] })) })] }, job.id)))) })] })] }), _jsx("section", { className: "lg:col-span-4 flex flex-col space-y-4 min-h-0", children: _jsxs("div", { className: "flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0", children: [_jsxs("div", { className: "flex justify-between items-center mb-3 shrink-0", children: [_jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center", children: [_jsx(Database, { className: "h-4 w-4 mr-1.5 text-brand-400" }), "C\u1EA5u H\u00ECnh M\u00E1y In (", printers.length, ")"] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "p-1 bg-brand-500 hover:bg-brand-600 rounded-lg text-white transition-all flex items-center text-xs px-2 py-1", children: [_jsx(Plus, { className: "h-3 w-3 mr-0.5" }), " Th\u00EAm m\u00E1y"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-3 pr-1", children: printers.map((printer) => (_jsxs("div", { className: "p-3 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-brand-500/30 transition-all", children: [printer.is_default === 1 && (_jsx("span", { className: "absolute top-0 right-0 text-[8px] bg-brand-500/20 text-brand-300 border-l border-b border-brand-500/30 px-2 py-0.5 font-bold uppercase font-mono tracking-wider rounded-bl-lg", children: "M\u1EB7c \u0111\u1ECBnh" })), _jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsxs("div", { className: "text-xs font-bold text-slate-200 flex items-center", children: [_jsx(Printer, { className: "h-3.5 w-3.5 mr-1 text-slate-400" }), printer.name] }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("span", { className: "text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold", children: printer.paper_size }), _jsx("span", { className: "text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono", children: printer.connection_type }), printer.connection_type !== 'USB' && (_jsx("span", { className: "text-[9px] text-slate-400 font-mono", children: printer.ip_address }))] })] }) }), _jsxs("div", { className: "flex items-center justify-between border-t border-white/5 mt-3 pt-2.5", children: [_jsx("span", { className: `h-2 w-2 rounded-full ${printer.status === 'ONLINE' ? 'bg-accent-success' : 'bg-accent-error'}` }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => handleTestPrint(printer.id), className: "text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-all flex items-center", children: [_jsx(Play, { className: "h-2.5 w-2.5 mr-0.5" }), " In th\u1EED"] }), printer.is_default === 0 && (_jsx("button", { onClick: () => setDefaultPrinter(printer.id), className: "text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-all", children: "M\u1EB7c \u0111\u1ECBnh" })), _jsx("button", { onClick: () => deletePrinter(printer.id), className: "text-[10px] hover:bg-accent-error/20 text-slate-400 hover:text-accent-error p-1 rounded-md transition-all", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] })] }, printer.id))) })] }) }), _jsxs("section", { className: "lg:col-span-4 flex flex-col space-y-4 min-h-0", children: [_jsxs("div", { className: "flex-1 rounded-2xl glass-panel p-4 flex flex-col min-h-0", children: [_jsxs("div", { className: "flex justify-between items-center mb-3 shrink-0", children: [_jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center", children: [_jsx(Sliders, { className: "h-4 w-4 mr-1.5 text-brand-400" }), "L\u1ECBch S\u1EED In G\u1EA7n \u0110\u00E2y"] }), jobHistory.length > 0 && (_jsx("button", { onClick: clearJobHistory, className: "text-[10px] text-slate-400 hover:text-accent-error flex items-center font-mono", children: "X\u00F3a l\u1ECBch s\u1EED" }))] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1", children: jobHistory.length === 0 ? (_jsxs("div", { className: "h-full flex flex-col justify-center items-center text-slate-500 py-12", children: [_jsx(Clock, { className: "h-10 w-10 mb-2 opacity-20" }), _jsx("p", { className: "text-xs", children: "Ch\u01B0a c\u00F3 l\u1ECBch s\u1EED in \u0111\u01A1n h\u00E0ng" })] })) : (jobHistory.map((job) => (_jsxs("div", { className: "p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center hover:border-brand-500/10 transition-all", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-xs font-bold text-slate-200", children: ["\u0110\u01A1n h\u00E0ng: ", job.order_id] }), _jsx("div", { className: "text-[9px] text-slate-400 mt-0.5", children: job.customer_name })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [job.status === 'SUCCESS' ? (_jsx("div", { className: "flex items-center text-accent-success text-[10px] font-bold", children: _jsx(CheckCircle2, { className: "h-3.5 w-3.5 mr-1" }) })) : (_jsx("div", { className: "flex items-center text-accent-error text-[10px] font-bold", title: job.error_message || '', children: _jsx(XCircle, { className: "h-3.5 w-3.5 mr-1" }) })), _jsx("button", { onClick: () => reprintJob(job.id), className: "text-[9px] bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 hover:text-brand-200 px-2 py-0.5 rounded transition-all font-mono", children: "In l\u1EA1i" })] })] }, job.id)))) })] }), _jsxs("div", { className: "h-44 rounded-2xl glass-panel p-4 flex flex-col shrink-0 min-h-0", children: [_jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center mb-2 shrink-0", children: [_jsx(Terminal, { className: "h-4 w-4 mr-1.5 text-brand-400" }), "B\u00E1o c\u00E1o log h\u1EC7 th\u1ED1ng"] }), _jsx("div", { className: "flex-1 bg-black/40 rounded-xl p-2 font-mono text-[9px] text-slate-400 overflow-y-auto space-y-1", children: logs.length === 0 ? (_jsx("div", { className: "text-slate-600 text-center py-6", children: "Ch\u01B0a ghi nh\u1EADn log ho\u1EA1t \u0111\u1ED9ng" })) : (logs.map((log, index) => (_jsxs("div", { className: `leading-relaxed ${log.level === 'ERROR' ? 'text-accent-error' : log.level === 'WARN' ? 'text-accent-warning' : 'text-slate-400'}`, children: ["[", new Date(log.timestamp).toLocaleTimeString(), "] ", log.message] }, index)))) })] })] })] }), _jsxs("footer", { className: "rounded-2xl glass-panel p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shrink-0", children: [settings && (_jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [_jsxs("label", { className: "flex items-center space-x-2 text-xs font-semibold cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.auto_print, onChange: (e) => updateSettings({ auto_print: e.target.checked }), className: "rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4" }), _jsx("span", { children: "T\u1EF1 \u0111\u1ED9ng in \u0111\u01A1n" })] }), _jsxs("label", { className: "flex items-center space-x-2 text-xs font-semibold cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.sound_alert, onChange: (e) => updateSettings({ sound_alert: e.target.checked }), className: "rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4" }), _jsxs("span", { className: "flex items-center", children: [settings.sound_alert ? _jsx(Volume2, { className: "h-3.5 w-3.5 mr-1" }) : _jsx(VolumeX, { className: "h-3.5 w-3.5 mr-1 text-slate-500" }), "\u00C2m b\u00E1o khi c\u00F3 \u0111\u01A1n"] })] }), _jsxs("label", { className: "flex items-center space-x-2 text-xs font-semibold cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.run_on_startup, onChange: (e) => setStartup(e.target.checked), className: "rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4" }), _jsx("span", { children: "Kh\u1EDFi \u0111\u1ED9ng c\u00F9ng Windows" })] })] })), _jsxs("form", { onSubmit: handleSaveSettings, className: "flex flex-wrap items-center gap-3 w-full md:w-auto justify-end", children: [_jsx("input", { type: "text", placeholder: "NestJS Server API URL", value: editApiUrl, onChange: (e) => setEditApiUrl(e.target.value), className: "text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono placeholder:text-slate-500 w-full sm:w-56 focus:outline-none focus:border-brand-500" }), _jsx("input", { type: "password", placeholder: "Authorization API Key", value: editApiKey, onChange: (e) => setEditApiKey(e.target.value), className: "text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono placeholder:text-slate-500 w-full sm:w-40 focus:outline-none focus:border-brand-500" }), _jsx("button", { type: "submit", className: "text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-all", children: "L\u01B0u k\u1EBFt n\u1ED1i" })] })] }), showAddModal && (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Th\u00EAm m\u00E1y in nhi\u1EC7t m\u1EDBi" }), _jsxs("form", { onSubmit: handleAddPrinter, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1.5", children: "T\u00EAn M\u00E1y In H\u1EC7 Th\u1ED1ng" }), _jsx("input", { type: "text", placeholder: "e.g. Xprinter XP-80C", value: newPrinterName, onChange: (e) => setNewPrinterName(e.target.value), className: "w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1.5", children: "Kh\u1ED5 gi\u1EA5y" }), _jsxs("select", { value: newPrinterPaper, onChange: (e) => setNewPrinterPaper(e.target.value), className: "w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-brand-500", children: [_jsx("option", { value: "K80", children: "K80 (80mm - Receipt)" }), _jsx("option", { value: "K58", children: "K58 (58mm - Mini)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1.5", children: "Ki\u1EC3u k\u1EBFt n\u1ED1i" }), _jsxs("select", { value: newPrinterType, onChange: (e) => setNewPrinterType(e.target.value), className: "w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-brand-500", children: [_jsx("option", { value: "USB", children: "USB (C\u1ED5ng c\u1EE5c b\u1ED9)" }), _jsx("option", { value: "LAN", children: "LAN (C\u00E1p m\u1EA1ng)" }), _jsx("option", { value: "WIFI", children: "Wi-Fi (Kh\u00F4ng d\u00E2y)" })] })] })] }), newPrinterType !== 'USB' && (_jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1.5", children: "\u0110\u1ECBa ch\u1EC9 IP" }), _jsx("input", { type: "text", placeholder: "e.g. 192.168.1.100", value: newPrinterIp, onChange: (e) => setNewPrinterIp(e.target.value), className: "w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1.5", children: "Port" }), _jsx("input", { type: "text", placeholder: "9100", value: newPrinterPort, onChange: (e) => setNewPrinterPort(e.target.value), className: "w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none", required: true })] })] })), _jsxs("label", { className: "flex items-center space-x-2 text-xs font-semibold cursor-pointer pt-2", children: [_jsx("input", { type: "checkbox", checked: newPrinterDefault, onChange: (e) => setNewPrinterDefault(e.target.checked), className: "rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 h-4 w-4" }), _jsx("span", { children: "Ch\u1ECDn m\u00E1y in m\u1EB7c \u0111\u1ECBnh cho k\u00EDch c\u1EE1 n\u00E0y" })] }), _jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-white/5 mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowAddModal(false), className: "text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg transition-all", children: "H\u1EE7y b\u1ECF" }), _jsx("button", { type: "submit", className: "text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2 rounded-lg transition-all", children: "X\u00E1c nh\u1EADn" })] })] })] }) }))] }));
}
