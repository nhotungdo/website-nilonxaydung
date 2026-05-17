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
import { useTranslation } from '../locales';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: t('sidebar.realtimeOrders'), path: '/orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: t('sidebar.printQueue'), path: '/queue', icon: <Layers className="h-5 w-5" /> },
    { name: t('sidebar.printers'), path: '/printers', icon: <Printer className="h-5 w-5" /> },
    { name: t('sidebar.invoicePreview'), path: '/preview', icon: <Eye className="h-5 w-5" /> },
    { name: t('sidebar.orderHistory'), path: '/history', icon: <History className="h-5 w-5" /> },
    { name: t('sidebar.failedJobs'), path: '/failed', icon: <AlertOctagon className="h-5 w-5" /> },
    { name: t('sidebar.diagnostics'), path: '/diagnostics', icon: <Activity className="h-5 w-5" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full flex flex-col bg-white border-r border-slate-200/80 ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005B52] font-bold text-white shadow-lg shadow-[#005B52]/20">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 tracking-wide leading-none">{t('sidebar.brand')}</span>
                <span className="text-[9px] text-[#005B52] font-bold tracking-widest mt-0.5">{t('sidebar.autoprint')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#005B52] font-bold text-white shadow-lg">
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
                  ? 'bg-[#005B52]/10 text-[#005B52] border border-[#005B52]/15 shadow-inner'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
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
              <div className="absolute left-16 z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border border-slate-800 pointer-events-none transition-opacity whitespace-nowrap">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-200/80 flex flex-col gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 border border-transparent transition-all group relative"
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
                {t('sidebar.disconnect')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mx-auto flex h-8 w-8 items-center justify-center bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
};
