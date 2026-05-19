import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Printer,
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  TrendingUp,
  Activity,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Bảng điều khiển', path: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { name: 'Đơn hàng realtime', path: '/orders', icon: <TrendingUp className="h-[18px] w-[18px]" /> },
    { name: 'Hàng đợi in', path: '/queue', icon: <Layers className="h-[18px] w-[18px]" /> },
    { name: 'Cài đặt máy in', path: '/printers', icon: <Printer className="h-[18px] w-[18px]" /> },
    { name: 'Lịch sử đơn hàng', path: '/history', icon: <History className="h-[18px] w-[18px]" /> },
    { name: 'Xem trước hóa đơn', path: '/preview', icon: <Activity className="h-[18px] w-[18px]" /> }
  ];



  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full flex flex-col bg-[#EBF3FC] border-r border-[#D2E3F6] ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-5 pt-2">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-[17px] font-black text-[#005B52] tracking-tight leading-none">
                Nilon Invoices
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">
                v2.4.0-Stable
              </span>
            </motion.div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#005B52] font-bold text-white shadow-md">
              N
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all group relative ${isActive
                ? 'text-[#005B52] bg-white/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/20'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors ${isActive ? 'text-[#005B52]' : 'text-slate-500 group-hover:text-slate-800'}`}>
                  {item.icon}
                </span>

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

                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#005B52] rounded-l-md" />
                )}

                {/* Tooltip for Collapsed Sidebar */}
                {isCollapsed && (
                  <div className="absolute left-16 z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border border-slate-800 pointer-events-none transition-opacity whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="my-4 border-t border-[#D2E3F6] mx-2" />

        {bottomMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all group relative ${isActive
                ? 'text-[#005B52] bg-white/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/20'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors ${isActive ? 'text-[#005B52]' : 'text-slate-500 group-hover:text-slate-800'}`}>
                  {item.icon}
                </span>

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

                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#005B52] rounded-l-md" />
                )}

                {/* Tooltip for Collapsed Sidebar */}
                {isCollapsed && (
                  <div className="absolute left-16 z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border border-slate-800 pointer-events-none transition-opacity whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-[#D2E3F6] flex flex-col gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all group relative"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Ngắt kết nối
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mx-auto flex h-8 w-8 items-center justify-center bg-white/50 border border-[#D2E3F6] text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
};
