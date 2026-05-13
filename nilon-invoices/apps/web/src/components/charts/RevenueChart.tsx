'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { dashboardApi, type RevenueChartPoint } from '@/services/api';

const RevenueChart = () => {
  const [data, setData] = useState<RevenueChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getRevenueChart()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Phân tích doanh thu</h3>
          <p className="text-sm font-semibold text-slate-400">Thống kê doanh thu 7 ngày gần nhất</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Doanh thu thực tế
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
      )}

      {error && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-bold text-red-500">Không thể tải biểu đồ</p>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu doanh thu</p>
            <p className="text-xs text-slate-300 mt-1">Dữ liệu sẽ hiển thị sau khi có đơn hàng</p>
          </div>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                cursor={{ stroke: '#2563eb', strokeWidth: 1 }}
                formatter={(value: any) => [`${Number(value || 0).toLocaleString('vi-VN')}đ`, 'Doanh thu']} // eslint-disable-line @typescript-eslint/no-explicit-any
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
