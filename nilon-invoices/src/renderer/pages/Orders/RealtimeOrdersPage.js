import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Eye, Volume2, VolumeX, HeartHandshake } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrderStore } from '../../stores/orderStore';
import { useQueueStore } from '../../stores/queueStore';
export const RealtimeOrdersPage = () => {
    const navigate = useNavigate();
    const { orders, soundEnabled, toggleSound } = useOrderStore();
    const { jobs, reprintJob } = useQueueStore();
    const getOrderStatus = (orderId) => {
        const relatedJob = jobs.find((j) => j.order_id === orderId);
        return relatedJob ? relatedJob.status : 'PENDING';
    };
    const handlePrintNow = async (orderId) => {
        // Spawns/reprints a print job in the queue
        await reprintJob(orderId);
    };
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Real-time Socket Orders", subtitle: "Monitor incoming invoices from NestJS API. Fully automated printing spools.", actions: _jsx("div", { className: "flex items-center gap-2", children: _jsx("button", { onClick: toggleSound, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors", children: soundEnabled ? (_jsxs(_Fragment, { children: [_jsx(Volume2, { className: "h-3.5 w-3.5 text-blue-400" }), "Alert Sound: ON"] })) : (_jsxs(_Fragment, { children: [_jsx(VolumeX, { className: "h-3.5 w-3.5 text-slate-500" }), "Alert Sound: MUTED"] })) }) }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: _jsx(AnimatePresence, { initial: false, children: orders.map((order) => {
                        const status = getOrderStatus(order.id);
                        return (_jsx(motion.div, { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, children: _jsxs(GlassCard, { className: "border-white/5 flex flex-col h-full justify-between relative overflow-hidden group", children: [status === 'PRINTING' && (_jsx("div", { className: "absolute inset-0 border border-amber-500/30 rounded-2xl pointer-events-none animate-pulse" })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-white/5 mb-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-blue-400 font-mono tracking-wider", children: order.orderCode }), _jsx("span", { className: "text-[10px] text-slate-500 block mt-0.5", children: new Date(order.createdAt).toLocaleTimeString() })] }), _jsx(StatusBadge, { status: status })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-sm font-bold text-white block truncate", children: order.customerName }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-400", children: [_jsx(HeartHandshake, { className: "h-3.5 w-3.5 text-slate-500" }), _jsxs("span", { children: ["Phone: ", order.customerPhone] })] }), _jsx("div", { className: "mt-3 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5", children: order.items.map((item, idx) => (_jsxs("div", { className: "flex justify-between items-center text-xs text-slate-400", children: [_jsx("span", { className: "truncate max-w-[150px]", children: item.name }), _jsxs("span", { children: ["x", item.quantity] })] }, idx))) })] })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex justify-between items-center pb-4 border-b border-white/5 mb-4", children: [_jsx("span", { className: "text-xs text-slate-400", children: "Total Bill Amount:" }), _jsx("span", { className: "text-lg font-black text-white", children: formatCurrency(order.totalAmount) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("button", { onClick: () => handlePrintNow(order.id), disabled: status === 'PRINTING', className: "col-span-2 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/10", children: [_jsx(Printer, { className: "h-3.5 w-3.5" }), status === 'PRINTING' ? 'Printing...' : 'Print Now'] }), _jsxs("button", { onClick: () => navigate('/preview'), className: "py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors", children: [_jsx(Eye, { className: "h-3.5 w-3.5" }), "Preview"] })] })] })] }) }, order.id));
                    }) }) })] }));
};
