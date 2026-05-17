import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Key, HelpCircle, FileText, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../locales';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, apiUrl, clientId, apiKey: storedApiKey, rememberMe: storedRemember } = useAuthStore();

  const [apiKey, setApiKey] = useState(storedApiKey || '');
  const [rememberMe, setRememberMe] = useState(storedRemember !== undefined ? storedRemember : true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const activeApiUrl = apiUrl || 'https://api.nilonxaydung.vn/v1';
    const activeClientId = clientId || 'BRANCH-HCM-01';

    const success = await login(activeApiUrl, apiKey, activeClientId, rememberMe);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F6F9] overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Background Illustration: Robotic Arm (Top Right) */}
      <svg 
        width="340" 
        height="340" 
        viewBox="0 0 200 200" 
        fill="none" 
        className="absolute top-[5%] right-[5%] text-slate-200 pointer-events-none select-none opacity-80"
      >
        {/* Base platform */}
        <path d="M40 135 H140" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
        <rect x="50" y="123" width="80" height="12" fill="#E2E8F0" rx="2" />
        {/* Arm bottom column */}
        <path d="M65 123 L55 85" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
        {/* Elbow Joint */}
        <circle cx="55" cy="85" r="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="4" />
        <circle cx="55" cy="85" r="5" fill="#E2E8F0" />
        {/* Forearm */}
        <path d="M55 85 L115 55" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
        {/* Wrist Joint */}
        <circle cx="115" cy="55" r="10" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="3" />
        {/* Hand assembly */}
        <path d="M123 51 L138 51" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
        {/* Open Claw Fingers */}
        <path d="M138 43 C145 43 155 35 160 38" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M138 59 C145 59 155 67 160 64" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Background Illustration: Barcode Scanner Viewfinder (Bottom Left) */}
      <svg 
        width="240" 
        height="240" 
        viewBox="0 0 160 160" 
        fill="none" 
        className="absolute bottom-[8%] left-[5%] text-slate-200 pointer-events-none select-none opacity-80"
      >
        {/* Corner Brackets */}
        {/* Top Left */}
        <path d="M20 45 V20 H45" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Top Right */}
        <path d="M140 45 V20 H115" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom Left */}
        <path d="M20 115 V140 H45" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom Right */}
        <path d="M140 115 V140 H115" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Barcode lines */}
        <rect x="35" y="35" width="8" height="90" rx="2" fill="#E2E8F0" />
        <rect x="50" y="35" width="16" height="90" rx="2" fill="#E2E8F0" />
        <rect x="74" y="35" width="4" height="90" rx="1.5" fill="#E2E8F0" />
        <rect x="86" y="35" width="22" height="90" rx="3" fill="#E2E8F0" />
        <rect x="116" y="35" width="8" height="90" rx="2" fill="#E2E8F0" />
      </svg>

      {/* Main Console Center */}
      <div className="relative w-full max-w-[430px] px-4 flex flex-col items-center z-10">
        
        {/* Logo and Titles */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#005B52] text-white shadow-lg mb-3">
            <Printer className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Nilon Invoices
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-1.5 uppercase">
            {t('login.enterpriseTitle')}
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-white rounded-[20px] border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5 shadow-inner">
                  <Check className="h-8 w-8 animate-bounce" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1.5">{t('login.authSuccess')}</h2>
                <p className="text-sm text-slate-500">{t('login.authSuccessSubtitle')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 text-xs bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold flex items-center gap-2 animate-fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* API Token Input Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        {t('login.apiToken')}
                      </label>
                      <HelpCircle className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                    </div>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk_live_...................."
                        disabled={isLoading}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 font-mono text-sm focus:bg-white focus:outline-none focus:border-[#005B52] focus:ring-4 focus:ring-[#005B52]/5 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center pt-1">
                    <div 
                      onClick={() => !isLoading && setRememberMe(!rememberMe)}
                      className="flex items-center gap-3 cursor-pointer select-none group"
                    >
                      <div 
                        className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
                          rememberMe 
                            ? 'bg-[#005B52] border-[#005B52] text-white shadow-sm' 
                            : 'bg-white border-slate-300 group-hover:border-slate-400'
                        }`}
                      >
                        {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 select-none">
                        {t('login.saveLoginSession')}
                      </span>
                    </div>
                  </div>

                  {/* Submit Connect & Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#005B52] hover:bg-[#004D44] active:scale-[0.99] disabled:bg-[#005B52]/60 disabled:cursor-not-allowed font-bold text-white text-base shadow-lg shadow-[#005B52]/10 flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('login.connecting')}
                      </>
                    ) : (
                      <>
                        {t('login.connectLogin')}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* Status Indicators Footer */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-50"></span>
              </span>
              <span>{t('login.centralServer')}: {t('common.online')}</span>
            </div>
            <span>v2.4.0-Stable</span>
          </div>
        </div>

        {/* Footer Outside Links */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <FileText className="h-4 w-4 text-slate-400" />
            Tài liệu
          </a>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            Hỗ trợ
          </a>
        </div>
      </div>
    </div>
  );
};
