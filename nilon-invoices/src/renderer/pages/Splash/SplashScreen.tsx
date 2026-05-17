import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Printer, CheckCircle, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../locales';

export const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const steps = [
    { label: t('splash.initializingDb'), icon: <Database className="h-4 w-4" /> },
    { label: t('splash.connectingSocket'), icon: <Server className="h-4 w-4" /> },
    { label: t('splash.loadingPrinters'), icon: <Printer className="h-4 w-4" /> },
    { label: t('splash.systemReady'), icon: <CheckCircle className="h-4 w-4 text-emerald-400" /> }
  ];

  const runStartupSequence = async () => {
    setErrorStep(null);
    setErrorMessage('');
    
    try {
      // Step 0: DB Check
      setCurrentStep(0);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Step 1: Socket Check
      setCurrentStep(1);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate rare network hiccup (10% chance) for demonstration
          if (Math.random() < 0.05) {
            reject(new Error(t('splash.socketTimeoutError')));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      // Step 2: Printer Spooler Check
      setCurrentStep(2);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: Done
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Navigate to Dashboard if logged in, otherwise Login Page
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setErrorStep(currentStep);
      setErrorMessage(err.message || t('splash.unknownError'));
    }
  };

  useEffect(() => {
    runStartupSequence();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A13] overflow-hidden">
      {/* Dynamic Cosmic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]"></div>
      
      {/* Pulsing glow dots */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl animate-pulse"></div>

      <div className="relative w-full max-w-sm px-4">
        <GlassCard className="border-white/10 p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-3xl shadow-xl shadow-blue-500/30 mb-4 relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-white/10 blur-sm"></div>
            N
          </motion.div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-tight text-white"
          >
            Nilon Invoices
          </motion.h2>
          
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-blue-400 font-semibold tracking-widest uppercase mt-1"
          >
            {t('sidebar.autoprint')} CLIENT
          </motion.span>

          {/* Realtime progress tracker */}
          <div className="w-full mt-8 space-y-4">
            <AnimatePresence mode="wait">
              {errorStep !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400"
                >
                  <AlertCircle className="h-6 w-6 text-red-500 animate-bounce" />
                  <p className="text-xs font-semibold">{errorMessage}</p>
                  <button
                    onClick={runStartupSequence}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    {t('splash.retryConnection')}
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3 text-left">
                  {steps.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                          isActive ? 'text-white font-bold scale-[1.02]' : isCompleted ? 'text-blue-400' : 'text-slate-600'
                        }`}
                      >
                        <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                          isActive 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 animate-pulse' 
                            : isCompleted 
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                            : 'border-white/5 bg-white/[0.01]'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : step.icon}
                        </div>
                        <span className="text-xs leading-none">{step.label}</span>
                      </div>
                    );
                  })}
                  
                  {/* Miniature bottom loader line */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};
