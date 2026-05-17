import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, Info } from 'lucide-react';
import { GlassCard } from './GlassCard';
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen)
        return null;
    const icons = {
        danger: _jsx(AlertTriangle, { className: "h-6 w-6 text-red-500" }),
        warning: _jsx(AlertTriangle, { className: "h-6 w-6 text-amber-500" }),
        info: _jsx(Info, { className: "h-6 w-6 text-blue-500" })
    };
    const buttonClasses = {
        danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500/30',
        warning: 'bg-amber-600 hover:bg-amber-500 focus:ring-amber-500/30',
        info: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500/30'
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in", children: _jsxs("div", { className: "relative w-full max-w-md", children: [_jsx("div", { className: `absolute -inset-1 rounded-2xl blur-lg opacity-30 ${type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}` }), _jsx(GlassCard, { className: "relative overflow-hidden border-white/10 shadow-2xl", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center", children: icons[type] }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: title }), _jsx("p", { className: "text-sm text-slate-400 mb-6 leading-relaxed", children: message }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-colors", children: cancelText }), _jsx("button", { onClick: () => {
                                                    onConfirm();
                                                    onClose();
                                                }, className: `px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all shadow-md focus:outline-none focus:ring-2 ${buttonClasses[type]}`, children: confirmText })] })] })] }) })] }) }));
};
