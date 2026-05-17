import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatusBadge = ({ status, className = '' }) => {
    const normStatus = status.toUpperCase();
    const config = {
        PENDING: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Spooling', pulse: false },
        WAITING: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Waiting', pulse: false },
        PRINTING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Printing', pulse: true },
        SUCCESS: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Completed', pulse: false },
        COMPLETED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Completed', pulse: false },
        ONLINE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Online', pulse: true },
        FAILED: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Failed', pulse: false },
        ERROR: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Error', pulse: false },
        OFFLINE: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', label: 'Offline', pulse: false },
    };
    const current = config[normStatus] || { bg: 'bg-white/10', text: 'text-white/70', border: 'border-white/15', label: status, pulse: false };
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${current.bg} ${current.text} ${current.border} ${className}`, children: [current.pulse && (_jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-current" })] })), current.label] }));
};
