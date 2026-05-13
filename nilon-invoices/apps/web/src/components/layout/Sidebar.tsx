'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  Users, 
  Settings, 
  Package, 
  BarChart3, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState('STAFF');
  const [name, setName] = useState('Người dùng');
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    if (savedRole || savedName) {
      setTimeout(() => {
        if (savedRole) setRole(savedRole);
        if (savedName) setName(savedName);
      }, 0);
    }
  }, []);

  
  const menuItems = [
    { icon: <Home size={20} />, label: 'Tổng quan', href: '/dashboard' },
    { icon: <ShoppingCart size={20} />, label: 'Đơn hàng', href: '/dashboard/orders' },
    { icon: <FileText size={20} />, label: 'Hóa đơn', href: '/dashboard/invoices' },
    { icon: <Package size={20} />, label: 'Sản phẩm', href: '/dashboard/products' },
    { icon: <Users size={20} />, label: 'Khách hàng', href: '/dashboard/customers' },
    { icon: <BarChart3 size={20} />, label: 'Báo cáo', href: '/dashboard/reports' },
    { icon: <Settings size={20} />, label: 'Cài đặt', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-72 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800/50 sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Nilon Invoices</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
              {!isActive && (
                <ChevronRight className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={14} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Mini */}
      <div className="p-6 mt-auto">
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${role === 'ADMIN' ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-indigo-600'} flex items-center justify-center text-white font-bold shadow-inner`}>
                {role === 'ADMIN' ? 'AD' : 'NV'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{name}</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{role === 'ADMIN' ? 'Admin Account' : 'Staff Account'}</div>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('access_token');
              localStorage.removeItem('userName');
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut size={14} />
            Đăng xuất hệ thống
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
