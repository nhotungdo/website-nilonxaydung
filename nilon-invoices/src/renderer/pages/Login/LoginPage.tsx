import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Lock, User as UserIcon, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../locales';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tài khoản.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, rememberMe: storedRemember } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: storedRemember !== undefined ? storedRemember : true,
    },
  });

  const rememberMeWatch = watch('rememberMe');

  useEffect(() => {
    // Auto-focus username field on mount is handled by native autoFocus prop on input
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    const success = await login(data.username, data.password, data.rememberMe);
    if (success) {
      const userRole = useAuthStore.getState().user?.role;
      setWelcomeMessage(userRole === 'admin' ? 'Xin chào Quản trị viên' : 'Xin chào Nhân viên');
      setIsSuccess(true);
      
      setTimeout(() => {
        // Both Admin and Staff can go to Dashboard now
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 overflow-hidden select-none">
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="relative w-full max-w-[420px] px-4 z-10">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005B52] text-white shadow-xl shadow-[#005B52]/20 mb-4">
            <Printer className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Nilon Invoices
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wider mt-1.5 uppercase">
            Hệ thống in hóa đơn doanh nghiệp
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200/60 p-8 shadow-2xl shadow-slate-200/50">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 border border-emerald-100">
                  <Check className="h-8 w-8 animate-bounce" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{welcomeMessage}</h2>
                <p className="text-sm text-slate-500">Đang chuyển hướng đến hệ thống...</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2.5 animate-fade-in">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span className="leading-tight">{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {t('login.username') || 'Tài khoản / Email'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                      <input
                        {...register('username')}
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        disabled={isLoading}
                        autoFocus
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50/50 border ${errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-[#005B52] focus:ring-[#005B52]/10'} rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-500 font-medium ml-1">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {t('login.password') || 'Mật khẩu'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-11 py-3 bg-slate-50/50 border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-[#005B52] focus:ring-[#005B52]/10'} rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center transition-all ${
                        rememberMeWatch ? 'bg-[#005B52] border-[#005B52] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {rememberMeWatch && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <input type="checkbox" {...register('rememberMe')} className="hidden" disabled={isLoading} />
                      <span className="text-sm font-medium text-slate-600 select-none">
                        {t('login.rememberMe') || 'Ghi nhớ đăng nhập'}
                      </span>
                    </label>
                    <a href="#" className="text-sm font-medium text-[#005B52] hover:underline" onClick={(e) => e.preventDefault()}>
                      Quên mật khẩu?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#005B52] hover:bg-[#004D44] active:scale-[0.99] disabled:bg-[#005B52]/60 disabled:cursor-not-allowed disabled:scale-100 font-bold text-white text-sm shadow-lg shadow-[#005B52]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập hệ thống'
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 text-center flex flex-col items-center gap-2">
           <p className="text-xs font-semibold text-slate-400">
             Phiên bản v1.0.0
           </p>
        </div>

      </div>
    </div>
  );
};
