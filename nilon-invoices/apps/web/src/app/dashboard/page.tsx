'use client';

import { ShoppingBag, Users, FileCheck, DollarSign, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/charts/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';

const DashboardOverview = () => {
  const stats = [
    { label: 'Doanh thu hôm nay', value: '12.8Mđ', icon: <DollarSign size={24} />, trend: '+12.5%', isPositive: true, color: 'bg-blue-500' },
    { label: 'Đơn hàng mới', value: '43', icon: <ShoppingBag size={24} />, trend: '+3.2%', isPositive: true, color: 'bg-emerald-500' },
    { label: 'Khách hàng mới', value: '12', icon: <Users size={24} />, trend: '-2.1%', isPositive: false, color: 'bg-amber-500' },
    { label: 'Hóa đơn đã xuất', value: '852', icon: <FileCheck size={24} />, trend: '+5.4%', isPositive: true, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-slate-500 font-semibold mt-1">Chào buổi sáng, Nhân! Đây là những gì đang diễn ra hôm nay.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            Xuất báo cáo
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            Tạo đơn hàng mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

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
              <h3 className="text-xl font-bold mb-2">Thông báo hệ thống</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Bạn có 3 cập nhật mới cần xử lý.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Cập nhật giá nilon loại 1</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">10 phút trước</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Khách hàng mới: Công ty ABC</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">2 giờ trước</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Sắp hết hàng: Màng PE quấn</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">5 giờ trước</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-12 w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-sm font-bold transition-all">
                Xem tất cả thông báo
              </button>
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
