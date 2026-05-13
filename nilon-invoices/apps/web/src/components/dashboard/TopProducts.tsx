'use client';

import { Package, TrendingUp } from 'lucide-react';

const products = [
  { name: 'Nilon lót sàn bê tông', sales: 1540, stock: 850, price: '15.000đ', growth: '+12%' },
  { name: 'Màng PE quấn hàng', sales: 1200, stock: 240, price: '45.000đ', growth: '+8%' },
  { name: 'Túi nilon HDPE', sales: 850, stock: 1200, price: '25.000đ', growth: '+15%' },
];

const TopProducts = () => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Sản phẩm bán chạy</h3>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {products.map((product, idx) => (
          <div key={idx} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <Package size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{product.name}</div>
                <div className="text-xs text-slate-400 font-semibold">{product.sales} đã bán • {product.stock} tồn kho</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900">{product.price}</div>
              <div className="text-[10px] font-bold text-emerald-500">{product.growth}</div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold transition-all">
        Xem báo cáo chi tiết
      </button>
    </div>
  );
};

export default TopProducts;
