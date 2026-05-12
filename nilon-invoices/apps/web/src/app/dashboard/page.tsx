import { ShoppingBag, Users, FileCheck, DollarSign } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { label: 'Total Sales', value: '$128,430', icon: <DollarSign className="text-blue-600" />, trend: '+12.5%' },
    { label: 'Active Orders', value: '43', icon: <ShoppingBag className="text-emerald-600" />, trend: '+3.2%' },
    { label: 'Customers', value: '1,240', icon: <Users className="text-amber-600" />, trend: '+18.1%' },
    { label: 'Invoices Issued', value: '852', icon: <FileCheck className="text-purple-600" />, trend: '+5.4%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400 border-dashed">
          <p>Sales Analytics Chart Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400 border-dashed">
          <p>Recent Activities Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
