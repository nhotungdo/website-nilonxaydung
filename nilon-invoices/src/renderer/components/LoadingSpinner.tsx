import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullPage = false,
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-3'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Glow backdrop */}
        <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-md ${size === 'lg' ? 'scale-125' : ''}`}></div>
        {/* Spinning ring */}
        <div className={`animate-spin rounded-full border-current border-t-transparent text-blue-500 relative ${sizeClasses[size]}`}></div>
      </div>
      {label && <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};
