'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { authApi } from '@/services/api';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const target = e.currentTarget as HTMLFormElement;
    const email = (target.elements.namedItem('email') as HTMLInputElement).value;
    const password = (target.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await authApi.login({ email, password });
      
      // Store tokens and user info
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.fullName || 'Người dùng');
      
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative z-10 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập</h1>
          <p className="text-slate-500 font-semibold tracking-tight">Hệ thống quản lý hóa đơn Nilon</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email công việc</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@nilon.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-slate-700 font-bold"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-slate-700 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Ghi nhớ tôi</span>
            </label>
            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden relative group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <div className="absolute right-[-100%] group-hover:right-6 transition-all duration-300">
                  <ShieldCheck size={20} />
                </div>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-500">
            Bạn chưa có tài khoản?{' '}
            <a href="#" className="font-black text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-4">Liên hệ quản trị</a>
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        &copy; 2024 Nilon Invoices. Toàn bộ quyền được bảo lưu.
      </div>
    </div>
  );
};

export default LoginPage;
