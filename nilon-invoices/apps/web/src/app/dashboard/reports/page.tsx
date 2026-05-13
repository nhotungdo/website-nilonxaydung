'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { dashboardApi, type RevenueChartPoint, type OrderStatusCount, type TopProduct, type DashboardStats } from '@/services/api';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981',
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  SHIPPING: '#6366f1',
  CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Hoàn thành',
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  CANCELLED: 'Đã hủy',
};

const ReportsPage = () => {
  const [revenueData, setRevenueData] = useState<RevenueChartPoint[]>([]);
  const [statusData, setStatusData] = useState<OrderStatusCount[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      dashboardApi.getRevenueChart(),
      dashboardApi.getOrderStatusCounts(),
      dashboardApi.getTopProducts(),
      dashboardApi.getStats(),
    ])
      .then(([revRes, statusRes, topRes, statsRes]) => {
        setRevenueData(revRes.data);
        setStatusData(statusRes.data.filter((s) => s.count > 0));
        setTopProducts(topRes.data);
        setStats(statsRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  const totalOrders = statusData.reduce((sum, s) => sum + s.count, 0);
  const completedOrders = statusData.find((s) => s.status === 'COMPLETED')?.count ?? 0;
  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0.0';

  const pieData = statusData.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
    color: STATUS_COLORS[s.status] ?? '#94a3b8',
  }));

  const barData = topProducts.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
    sales: p.totalSold,
  }));

  const formatRevenue = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
    return String(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="text-red-400" size={40} />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Lỗi tải báo cáo</p>
          <p className="text-xs text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Báo cáo & Thống kê</h2>
          <p className="text-slate-500 font-semibold mt-1">Phân tích hiệu suất kinh doanh từ dữ liệu thực tế.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Calendar size={18} />
            7 ngày qua
          </button>
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Tải báo cáo (PDF)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats ? (
          <>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng doanh thu</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatRevenue(Number(stats.totalRevenue))}đ
                </h3>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-600">
                  <TrendingUp size={12} />
                  Thực tế
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng đơn hàng</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats.totalOrders.toLocaleString('vi-VN')}
                </h3>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-600">
                  <TrendingUp size={12} />
                  Thực tế
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỷ lệ hoàn thành</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{completionRate}%</h3>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-600">
                  <TrendingUp size={12} />
                  Thực tế
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Biểu đồ doanh thu</h3>
                <p className="text-xs font-bold text-slate-400">7 ngày gần nhất (số liệu thực)</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
              <Filter size={18} />
            </button>
          </div>

          {revenueData.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu doanh thu</p>
                <p className="text-xs text-slate-300 mt-1">Biểu đồ sẽ hiện sau khi có đơn hàng</p>
              </div>
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
                    formatter={(v: any) => [`${Number(v || 0).toLocaleString('vi-VN')}đ`, 'Doanh thu']} // eslint-disable-line @typescript-eslint/no-explicit-any
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <PieIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Trạng thái đơn hàng</h3>
              <p className="text-xs font-bold text-slate-400">Tỷ lệ xử lý thực tế</p>
            </div>
          </div>

          {pieData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm font-bold text-slate-400 text-center">Chưa có đơn hàng</p>
            </div>
          ) : (
            <>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{totalOrders.toLocaleString('vi-VN')}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Tổng cộng</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                {pieData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-bold text-slate-500">{s.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Products Bar Chart */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Sản phẩm bán chạy</h3>
              <p className="text-xs font-bold text-slate-400">Top sản phẩm theo số lượng bán thực tế</p>
            </div>
          </div>

          {barData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu sản phẩm</p>
                <p className="text-xs text-slate-300 mt-1">Dữ liệu sẽ hiện sau khi có đơn hàng được tạo</p>
              </div>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} width={120} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="sales" fill="#10b981" radius={[0, 10, 10, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
