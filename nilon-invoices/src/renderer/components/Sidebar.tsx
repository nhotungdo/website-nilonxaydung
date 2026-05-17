import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Printer,
  History,
  AlertOctagon,
  Activity,
  Eye,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Realtime Orders', path: '/orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Print Queue', path: '/queue', icon: <Layers className="h-5 w-5" /> },
    { name: 'Printers', path: '/printers', icon: <Printer className="h-5 w-5" /> },
    { name: 'Invoice Preview', path: '/preview', icon: <Eye className="h-5 w-5" /> },
    { name: 'Order History', path: '/history', icon: <History className="h-5 w-5" /> },
    { name: 'Failed Jobs', path: '/failed', icon: <AlertOctagon className="h-5 w-5" /> },
    { name: 'Diagnostics', path: '/diagnostics', icon: <Activity className="h-5 w-5" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full flex flex-col bg-slate-950/40 border-r border-white/5 backdrop-blur-xl ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide leading-none">NILON INVOICES</span>
                <span className="text-[9px] text-blue-400 font-semibold tracking-widest mt-0.5">AUTOPRINT</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
            N
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/15 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`
            }
          >
            {item.icon}
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for Collapsed Sidebar */}
            {isCollapsed && (
              <div className="absolute left-16 z-50 rounded-md bg-slate-950 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border border-white/10 pointer-events-none transition-opacity whitespace-nowrap">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-white/5 flex flex-col gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/15 border border-transparent transition-all group relative"
        >
          <LogOut className="h-5 w-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Disconnect
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
};
