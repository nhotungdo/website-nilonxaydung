import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../locales';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText,
  cancelText
}) => {
  const { t } = useTranslation();
  const activeConfirmText = confirmText || t('common.confirm');
  const activeCancelText = cancelText || t('common.cancel');

  if (!isOpen) return null;

  const icons = {
    danger: <AlertTriangle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />
  };

  const buttonClasses = {
    danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500/30',
    warning: 'bg-amber-600 hover:bg-amber-500 focus:ring-amber-500/30',
    info: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500/30'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md">
        {/* Backdrop Glow */}
        <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-30 ${
          type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        }`}></div>

        <GlassCard className="relative overflow-hidden border-white/10 shadow-2xl">
          <div className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              {icons[type]}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-colors"
                >
                  {activeCancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all shadow-md focus:outline-none focus:ring-2 ${buttonClasses[type]}`}
                >
                  {activeConfirmText}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
