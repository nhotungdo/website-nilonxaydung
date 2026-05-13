'use client';

import { useEffect, useState } from 'react';
import { Package, TrendingUp, Loader2 } from 'lucide-react';
import { dashboardApi, type TopProduct } from '@/services/api';

const TopProducts = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getTopProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Sản phẩm bán chạy</h3>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <TrendingUp size={20} />
        </div>
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
      {!loading && !error && products.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Package className="text-slate-300" size={28} />
          </div>
          <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu sản phẩm</p>
          <p className="text-xs text-slate-300">Dữ liệu sẽ hiển thị sau khi có đơn hàng</p>
        </div>
      )}

      {/* Data */}
      {!loading && !error && products.length > 0 && (
        <div className="space-y-6 flex-1">
          {products.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <Package size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{product.name}</div>
                  <div className="text-xs text-slate-400 font-semibold">
                    {product.totalSold} đã bán • {product.stock} tồn kho
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">
                  {Number(product.price).toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href="/dashboard/products"
        className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold transition-all text-center block"
      >
        Xem báo cáo chi tiết
      </a>
    </div>
  );
};

export default TopProducts;
