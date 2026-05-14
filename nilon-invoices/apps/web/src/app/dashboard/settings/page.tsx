'use client';

import { useState, useCallback } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Moon, 
  Sun, 
  Globe, 
  Camera,
  ShieldCheck,
  Smartphone,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api';

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [darkMode, setDarkMode] = useState(false);
  const { data: profileRes, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Sync profile data to form states when it loads
  const [prevProfileId, setPrevProfileId] = useState<string | undefined>(undefined);
  if (profileRes?.success && profileRes.data.id !== prevProfileId) {
    setPrevProfileId(profileRes.data.id);
    setFullName(profileRes.data.fullName || '');
    setEmail(profileRes.data.email || '');
    setPhone(profileRes.data.phone || '');
  }

  const showFeedback = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const user = profileRes?.data || null;
  const loading = loadingProfile;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await usersApi.updateProfile({ fullName, email, phone });
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        showFeedback('success', 'Cập nhật thông tin thành công');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cập nhật thất bại';
      showFeedback('error', message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showFeedback('error', 'Mật khẩu mới không khớp');
      return;
    }
    if (newPass.length < 6) {
      showFeedback('error', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    setSavingPassword(true);
    try {
      const res = await usersApi.changePassword({ oldPass, newPass });
      if (res.success) {
        showFeedback('success', 'Đổi mật khẩu thành công');
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đổi mật khẩu thất bại';
      showFeedback('error', message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10 pb-20 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-10 right-10 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-black">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cài đặt cá nhân</h2>
        <p className="text-slate-500 font-semibold mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <UserIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Thông tin cá nhân</h3>
            <p className="text-sm font-semibold text-slate-400">Cập nhật hồ sơ nhân viên của bạn</p>
          </div>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="p-10">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-[2rem] bg-gradient-to-tr ${user?.role === 'ADMIN' ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-indigo-600'} flex items-center justify-center text-4xl font-black text-white shadow-2xl`}>
                  {user?.role === 'ADMIN' ? 'AD' : 'NV'}
                </div>
                <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-blue-600 hover:scale-110 transition-transform">
                  <Camera size={20} />
                </button>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ảnh đại diện</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên của bạn"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@nilon.com"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    value={user?.role === 'ADMIN' ? 'Admin Account' : 'Staff Member'} 
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-black ${user?.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'} outline-none cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-end">
            <button 
              type="submit"
              disabled={savingProfile}
              className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingProfile && <Loader2 size={18} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
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
        <form onSubmit={handleChangePassword} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" 
              />
            </div>
            <div className="space-y-2 invisible hidden md:block">
              {/* Spacer */}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
              <input 
                type="password" 
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Nhập mật khẩu mới" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
              <input 
                type="password" 
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Xác nhận mật khẩu mới" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={savingPassword}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {savingPassword && <Loader2 size={18} className="animate-spin" />}
              Đổi mật khẩu
            </button>
          </div>
        </form>
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
