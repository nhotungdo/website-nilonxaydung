'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Moon, 
  Sun, 
  Globe, 
  Camera,
  ShieldCheck,
  Smartphone,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState('STAFF');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setTimeout(() => setRole(savedRole), 0);
    }
  }, []);

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cài đặt cá nhân</h2>
        <p className="text-slate-500 font-semibold mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Thông tin cá nhân</h3>
            <p className="text-sm font-semibold text-slate-400">Cập nhật hồ sơ nhân viên của bạn</p>
          </div>
        </div>
        
        <div className="p-10">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-[2rem] bg-gradient-to-tr ${role === 'ADMIN' ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-indigo-600'} flex items-center justify-center text-4xl font-black text-white shadow-2xl`}>
                  {role === 'ADMIN' ? 'AD' : 'NV'}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:scale-110 transition-transform">
                  <Camera size={20} />
                </button>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ảnh đại diện</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder={role === 'ADMIN' ? 'Tên quản trị viên' : 'Họ và tên của bạn'}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email công việc</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    placeholder={role === 'ADMIN' ? 'admin@nilon.com' : 'email@nilon.com'}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    disabled 
                    defaultValue={role === 'ADMIN' ? 'Admin Account' : 'Staff Member'} 
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-black ${role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'} outline-none cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-end">
            <button className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Bảo mật</h3>
            <p className="text-sm font-semibold text-slate-400">Thay đổi mật khẩu và quản lý bảo mật</p>
          </div>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
              <input type="password" placeholder="Nhập mật khẩu mới" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Tùy chỉnh</h3>
            <p className="text-sm font-semibold text-slate-400">Ngôn ngữ và chế độ hiển thị</p>
          </div>
        </div>
        <div className="p-10 space-y-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Chế độ tối (Dark Mode)</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Tiết kiệm pin và bảo vệ mắt</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <motion.div 
                animate={{ x: darkMode ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg shadow-black/10"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Ngôn ngữ hiển thị</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Language preference</p>
              </div>
            </div>
            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
