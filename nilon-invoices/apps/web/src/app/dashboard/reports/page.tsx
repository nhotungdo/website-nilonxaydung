'use client';

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
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const revenueData = [
  { name: 'Jan', revenue: 4500, orders: 120 },
  { name: 'Feb', revenue: 5200, orders: 145 },
  { name: 'Mar', revenue: 4800, orders: 132 },
  { name: 'Apr', revenue: 6100, orders: 180 },
  { name: 'May', revenue: 5900, orders: 165 },
  { name: 'Jun', revenue: 7200, orders: 210 },
];

const statusData = [
  { name: 'Hoàn thành', value: 400, color: '#10b981' },
  { name: 'Đang xử lý', value: 300, color: '#f59e0b' },
  { name: 'Đang giao', value: 200, color: '#3b82f6' },
  { name: 'Đã hủy', value: 100, color: '#ef4444' },
];

const topProducts = [
  { name: 'Nilon lót sàn', sales: 450 },
  { name: 'Màng PE', sales: 320 },
  { name: 'Túi HDPE', sales: 280 },
  { name: 'Màng HDPE', sales: 190 },
  { name: 'Nilon khổ 2m', sales: 150 },
];

const ReportsPage = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Báo cáo & Thống kê</h2>
          <p className="text-slate-500 font-semibold mt-1">Phân tích hiệu suất kinh doanh dành cho Staff.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Calendar size={18} />
            Tháng này
          </button>
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Tải báo cáo (PDF)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Doanh thu tháng này', value: '154.2Mđ', trend: '+18.2%', isPositive: true },
          { label: 'Tổng đơn hàng', value: '1,284', trend: '+5.4%', isPositive: true },
          { label: 'Tỷ lệ hoàn thành', value: '94.5%', trend: '-1.2%', isPositive: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
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
                <p className="text-xs font-bold text-slate-400">Xu hướng tăng trưởng 6 tháng qua</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <PieIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Trạng thái đơn hàng</h3>
              <p className="text-xs font-bold text-slate-400">Tỷ lệ xử lý đơn hàng</p>
            </div>
          </div>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">1,284</p>
                <p className="text-[10px] font-black text-slate-400 uppercase">Tổng cộng</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-bold text-slate-500">{s.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Sản phẩm bán chạy</h3>
              <p className="text-xs font-bold text-slate-400">Top 5 sản phẩm đạt doanh số cao nhất</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} width={120} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
