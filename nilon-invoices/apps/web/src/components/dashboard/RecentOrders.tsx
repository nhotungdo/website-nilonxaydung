'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoreHorizontal, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';
import { ordersApi, type Order } from '@/services/api';

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Chờ xử lý', style: 'bg-slate-50 text-slate-600 border-slate-100' },
  CONFIRMED: { label: 'Đã xác nhận', style: 'bg-blue-50 text-blue-600 border-blue-100' },
  SHIPPING: { label: 'Đang giao', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  COMPLETED: { label: 'Hoàn thành', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  CANCELLED: { label: 'Đã hủy', style: 'bg-red-50 text-red-600 border-red-100' },
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersApi.getRecent(5)
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Đơn hàng mới nhất</h3>
        <Link href="/dashboard/orders" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả <ExternalLink size={14} />
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="text-sm font-bold text-red-500">Lỗi tải dữ liệu</p>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="text-slate-300" size={28} />
          </div>
          <p className="text-sm font-bold text-slate-400">Chưa có đơn hàng nào</p>
        </div>
      )}

      {/* Data */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4 flex-1">
          {orders.map((order, idx) => {
            const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP['PENDING'];
            const shortId = order.orderCode.slice(-4);
            const timeStr = new Date(order.createdAt).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600 text-xs">
                    {shortId}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{order.customer.name}</div>
                    <div className="text-xs text-slate-400 font-semibold">
                      {order.orderCode} • {timeStr}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-black text-slate-900">
                      {Number(order.total).toLocaleString('vi-VN')}đ
                    </div>
                    <div
                      className={`mt-1 inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusInfo.style}`}
                    >
                      {statusInfo.label}
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
