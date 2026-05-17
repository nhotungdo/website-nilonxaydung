import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b border-white/5 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
