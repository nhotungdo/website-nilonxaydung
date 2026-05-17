import React from 'react';
import { useTranslation } from '../locales';

type BadgeType = 
  | 'PENDING' | 'WAITING'
  | 'PRINTING'
  | 'SUCCESS' | 'COMPLETED' | 'ONLINE'
  | 'FAILED' | 'ERROR' | 'OFFLINE';

interface StatusBadgeProps {
  status: BadgeType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { t } = useTranslation();
  const normStatus = status.toUpperCase();

  const config: Record<string, { bg: string, text: string, border: string, label: string, pulse: boolean }> = {
    PENDING: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: t('common.pending'), pulse: false },
    WAITING: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: t('common.waiting'), pulse: false },
    PRINTING: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: t('common.printing'), pulse: true },
    SUCCESS: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: t('common.completed'), pulse: false },
    COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: t('common.completed'), pulse: false },
    ONLINE: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: t('common.online'), pulse: true },
    FAILED: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: t('common.failed'), pulse: false },
    ERROR: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: t('common.error'), pulse: false },
    OFFLINE: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300/80', label: t('common.offline'), pulse: false },
  };

  const current = config[normStatus] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: status, pulse: false };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${current.bg} ${current.text} ${current.border} ${className}`}>
      {current.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {current.label}
    </span>
  );
};
