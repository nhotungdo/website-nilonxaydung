import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Link, Key, Check, Loader2, ArrowRight } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [apiUrl, setApiUrl] = useState('https://api.nilonxaydung.vn/v1');
  const [apiKey, setApiKey] = useState('nl_live_8f39c298ae234fd98c12a893e9a');
  const [clientId, setClientId] = useState('BRANCH-HCM-01');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(apiUrl, apiKey, clientId, rememberMe);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A13] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>

      <div className="relative w-full max-w-md px-4">
        {/* Glow overlay */}
        <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-xl opacity-30"></div>

        <GlassCard className="relative border-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 neon-glow-success">
                  <Check className="h-8 w-8 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Authenticated Successfully</h2>
                <p className="text-sm text-slate-400">Loading your branch dashboard metrics...</p>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-2xl shadow-lg mb-4">
                    N
                  </div>
                  <h2 className="text-xl font-bold text-white">Connect Nilon Invoices</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure telemetry connection and branch authorization token</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-xs bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 font-semibold">
                      {error}
                    </div>
                  )}

                  {/* API Base URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Link className="h-3.5 w-3.5 text-slate-500" />
                      API Base URL
                    </label>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="e.g. https://api.nilonxaydung.vn/v1"
                      disabled={isLoading}
                      required
                      className="w-full pl-4 pr-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                    />
                  </div>

                  {/* API Token / Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-slate-500" />
                      API Authorization Token
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="nl_live_..."
                      disabled={isLoading}
                      required
                      className="w-full pl-4 pr-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                    />
                  </div>

                  {/* Client ID / Branch ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-slate-500" />
                      Client ID (Branch ID)
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="e.g. BRANCH-HCM-01"
                      disabled={isLoading}
                      required
                      className="w-full pl-4 pr-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
                    />
                  </div>

                  {/* Checkbox Remember */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                        className="rounded border-white/10 bg-white/[0.02] text-blue-600 focus:ring-blue-500/20"
                      />
                      Remember System Settings
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 font-bold text-white text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting System...
                      </>
                    ) : (
                      <>
                        Connect System
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </GlassCard>
      </div>
    </div>
  );
};
