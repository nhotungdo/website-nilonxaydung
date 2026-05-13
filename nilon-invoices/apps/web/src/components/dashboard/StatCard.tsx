'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  isPositive: boolean;
  color: string;
}

const StatCard = ({ label, value, icon, trend, isPositive, color }: StatCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
      </div>
      <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden mt-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isPositive ? '70%' : '30%' }}
          className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'} rounded-full`}
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
