import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, Printer, History, AlertOctagon, Activity, Eye, ChevronLeft, ChevronRight, LogOut, Layers } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
export const Sidebar = ({ className = '' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: _jsx(LayoutDashboard, { className: "h-5 w-5" }) },
        { name: 'Realtime Orders', path: '/orders', icon: _jsx(ShoppingCart, { className: "h-5 w-5" }) },
        { name: 'Print Queue', path: '/queue', icon: _jsx(Layers, { className: "h-5 w-5" }) },
        { name: 'Printers', path: '/printers', icon: _jsx(Printer, { className: "h-5 w-5" }) },
        { name: 'Invoice Preview', path: '/preview', icon: _jsx(Eye, { className: "h-5 w-5" }) },
        { name: 'Order History', path: '/history', icon: _jsx(History, { className: "h-5 w-5" }) },
        { name: 'Failed Jobs', path: '/failed', icon: _jsx(AlertOctagon, { className: "h-5 w-5" }) },
        { name: 'Diagnostics', path: '/diagnostics', icon: _jsx(Activity, { className: "h-5 w-5" }) }
    ];
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs(motion.div, { animate: { width: isCollapsed ? 76 : 260 }, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, className: `relative h-full flex flex-col bg-slate-950/40 border-r border-white/5 backdrop-blur-xl ${className}`, children: [_jsxs("div", { className: "flex h-16 items-center justify-between px-4 border-b border-white/5", children: [_jsx(AnimatePresence, { mode: "wait", children: !isCollapsed && (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 }, className: "flex items-center gap-2", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30", children: "N" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-bold text-white tracking-wide leading-none", children: "NILON INVOICES" }), _jsx("span", { className: "text-[9px] text-blue-400 font-semibold tracking-widest mt-0.5", children: "AUTOPRINT" })] })] })) }), isCollapsed && (_jsx("div", { className: "mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg", children: "N" }))] }), _jsx("nav", { className: "flex-1 space-y-1.5 px-3 py-4 overflow-y-auto", children: menuItems.map((item) => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/15 shadow-inner'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent'}`, children: [item.icon, _jsx(AnimatePresence, { children: !isCollapsed && (_jsx(motion.span, { initial: { opacity: 0, width: 0 }, animate: { opacity: 1, width: 'auto' }, exit: { opacity: 0, width: 0 }, className: "whitespace-nowrap overflow-hidden", children: item.name })) }), isCollapsed && (_jsx("div", { className: "absolute left-16 z-50 rounded-md bg-slate-950 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border border-white/10 pointer-events-none transition-opacity whitespace-nowrap", children: item.name }))] }, item.path))) }), _jsxs("div", { className: "p-3 border-t border-white/5 flex flex-col gap-2", children: [_jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/15 border border-transparent transition-all group relative", children: [_jsx(LogOut, { className: "h-5 w-5" }), _jsx(AnimatePresence, { children: !isCollapsed && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "whitespace-nowrap", children: "Disconnect" })) })] }), _jsx("button", { onClick: () => setIsCollapsed(!isCollapsed), className: "mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all", children: isCollapsed ? _jsx(ChevronRight, { className: "h-4 w-4" }) : _jsx(ChevronLeft, { className: "h-4 w-4" }) })] })] }));
};
