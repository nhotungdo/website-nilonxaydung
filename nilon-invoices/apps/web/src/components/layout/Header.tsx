'use client';

import { Bell, Search, User, ChevronDown, Settings, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState('STAFF');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng, hóa đơn, sản phẩm..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-8">
        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group">
          <Bell size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 group"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {role === 'ADMIN' ? 'Quản trị viên' : 'Nguyễn Văn Nhân'}
              </div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter">
                {role === 'ADMIN' ? 'Admin Member' : 'Staff Member'}
              </div>
            </div>
            <div className="relative">
              <div className={`w-11 h-11 rounded-2xl bg-slate-100 border-2 border-white shadow-md flex items-center justify-center ${role === 'ADMIN' ? 'text-purple-600' : 'text-slate-600'} overflow-hidden group-hover:border-blue-100 transition-colors`}>
                <User size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-sm border border-slate-100">
                <ChevronDown size={10} className={`text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/dashboard/settings'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <Shield size={18} />
                  Hồ sơ cá nhân
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/settings'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <Settings size={18} />
                  Cài đặt
                </button>
                <div className="h-px bg-slate-50 my-1" />
                <button 
                  onClick={() => {
                    localStorage.removeItem('userRole');
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
