'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  // optional trend
  trend?: string;
  isPositive?: boolean;
}

const StatCard = ({ label, value, icon, color, trend, isPositive }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${color}/10 text-white`} style={{ background: `color-mix(in srgb, currentColor 10%, transparent)` }}>
          <div className={`${color.replace('bg-', 'text-')} opacity-100`}>
            {icon}
          </div>
        </div>
        {trend && isPositive !== undefined && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
