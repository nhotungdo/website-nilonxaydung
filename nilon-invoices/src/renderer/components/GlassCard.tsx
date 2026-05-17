import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'brand' | 'success' | 'warning' | 'error' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'none',
  onClick
}) => {
  const glowClasses = {
    brand: 'border-[#005B52]/20 shadow-[#005B52]/5 shadow-sm',
    success: 'border-emerald-500/20 shadow-emerald-500/5 shadow-sm',
    warning: 'border-amber-500/20 shadow-amber-500/5 shadow-sm',
    error: 'border-red-500/20 shadow-red-500/5 shadow-sm',
    none: 'border-slate-200/80 shadow-slate-200/5 shadow-sm'
  };

  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.015)] transition-all duration-300 ${glowClasses[glowColor]} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
};
