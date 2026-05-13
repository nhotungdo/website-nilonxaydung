'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, ExternalLink } from 'lucide-react';

const orders = [
  { id: 'ORD-8821', customer: 'Nguyễn Văn A', total: '1.200.000đ', status: 'Hoàn thành', date: '12:30 PM' },
  { id: 'ORD-8822', customer: 'Công ty TNHH B', total: '3.500.000đ', status: 'Đang xử lý', date: '11:45 AM' },
  { id: 'ORD-8823', customer: 'Trần Thị C', total: '450.000đ', status: 'Đang giao', date: '10:15 AM' },
  { id: 'ORD-8824', customer: 'Lê Văn D', total: '2.100.000đ', status: 'Hoàn thành', date: '09:30 AM' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Đang xử lý': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Đang giao': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const RecentOrders = () => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Đơn hàng mới nhất</h3>
        <button className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả <ExternalLink size={14} />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {orders.map((order, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={order.id} 
            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600 text-xs">
                {order.id.split('-')[1]}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{order.customer}</div>
                <div className="text-xs text-slate-400 font-semibold">{order.id} • {order.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900">{order.total}</div>
                <div className={`mt-1 inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
