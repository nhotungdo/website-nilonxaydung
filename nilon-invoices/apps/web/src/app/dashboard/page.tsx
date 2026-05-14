'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Users, FileCheck, DollarSign, Bell, AlertCircle, Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/charts/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';
import { dashboardApi, type DashboardStats } from '@/services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}Mđ`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}Kđ`;
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  const statCards = stats
    ? [
        {
          label: 'Doanh thu hôm nay',
          value: formatCurrency(Number(stats.todayRevenue)),
          icon: <DollarSign size={24} />,
          color: 'bg-blue-500',
        },
        {
          label: 'Đơn hàng hôm nay',
          value: String(stats.todayOrders),
          icon: <ShoppingBag size={24} />,
          color: 'bg-emerald-500',
        },
        {
          label: 'Tổng khách hàng',
          value: String(stats.totalCustomers),
          icon: <Users size={24} />,
          color: 'bg-amber-500',
        },
        {
          label: 'Hóa đơn chờ xử lý',
          value: String(stats.totalInvoices),
          icon: <FileCheck size={24} />,
          color: 'bg-purple-500',
        },
      ]
    : [];

  return (
    <div className="space-y-10 pb-10">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-slate-500 font-semibold mt-1">Dữ liệu thực từ database, cập nhật theo thời gian thực.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/orders?create=true"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            Tạo đơn hàng mới
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse h-32" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Lỗi tải dữ liệu</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      )}

      {/* Low Stock Warning */}
      {!loading && stats && stats.lowStockProducts > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Cảnh báo tồn kho thấp</p>
            <p className="text-xs text-amber-700 font-medium">
              Có {stats.lowStockProducts} sản phẩm đang sắp hết hàng (≤ 20 đơn vị). Vui lòng cập nhật.
            </p>
          </div>
          <Link href="/dashboard/products" className="text-xs font-black text-amber-900 hover:underline">
            Xem ngay
          </Link>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white relative overflow-hidden h-full min-h-[450px]">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Thống kê tổng quan</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Số liệu tính từ database.</p>

              {loading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              ) : stats ? (
                <div className="space-y-5">
                  {[
                    { label: 'Tổng sản phẩm', value: stats.totalProducts, color: 'bg-blue-500' },
                    { label: 'Tổng đơn hàng', value: stats.totalOrders, color: 'bg-emerald-500' },
                    { label: 'Tổng doanh thu', value: formatCurrency(Number(stats.totalRevenue)), color: 'bg-amber-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-2 h-2 ${item.color} rounded-full mt-1.5 shrink-0`} />
                      <div>
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-lg font-black text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
};

export default DashboardOverview;
