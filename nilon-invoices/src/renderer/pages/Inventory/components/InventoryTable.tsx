import React from 'react';
import { AlertTriangle, CheckCircle, PackagePlus, MapPin, Tag } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

export const InventoryTable: React.FC = () => {

  const { items, searchQuery, categoryFilter, setIsStockInModalOpen } = useInventoryStore();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' ? true : item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Sản Phẩm & Quy Cách</th>
              <th className="py-3.5 px-4">Danh Mục</th>
              <th className="py-3.5 px-4 text-center">Tồn Kho Hiện Tại</th>
              <th className="py-3.5 px-4 text-right">Giá Vốn Nhập</th>
              <th className="py-3.5 px-4 text-right">Giá Bán Niêm Yết</th>
              <th className="py-3.5 px-4">Vị Trí Kho</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái Tồn</th>
              <th className="py-3.5 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-sm">Không tìm thấy sản phẩm nào trong kho</p>
                  <p className="text-xs mt-1">Thử thay đổi từ khóa hoặc bộ lọc danh mục</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isLowStock = item.current_stock <= item.min_stock_alert;
                const stockPercent = Math.min(
                  Math.round((item.current_stock / (item.min_stock_alert * 4)) * 100),
                  100
                );

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Product Name & Specs */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-2 rounded-xl mt-0.5 ${
                            isLowStock
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-emerald-50 text-[#005B52] border border-emerald-100'
                          }`}
                        >
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-[#005B52] transition-colors">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                            <span className="font-mono font-bold text-slate-600">SKU: {item.sku}</span>
                            {item.specs && <span>• {item.specs}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                        {item.category}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-black text-sm ${
                            isLowStock ? 'text-red-600' : 'text-slate-800'
                          }`}
                        >
                          {item.current_stock.toLocaleString('vi-VN')} {item.unit}
                        </span>
                        {/* Visual stock progress */}
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLowStock ? 'bg-red-500' : 'bg-[#005B52]'
                            }`}
                            style={{ width: `${Math.max(stockPercent, 10)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Import Price */}
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-600">
                      {formatVND(item.import_price)}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      {formatVND(item.selling_price)}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.location || 'Chưa định vị'}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Cảnh Báo Tồn Thấp
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" /> An Toàn
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setIsStockInModalOpen(true)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-[#005B52] hover:bg-[#005B52] hover:text-white font-semibold text-[11px] transition-colors inline-flex items-center gap-1 border border-emerald-200/80"
                        title="Nhập thêm hàng cho sản phẩm này"
                      >
                        <PackagePlus className="h-3.5 w-3.5" /> Nhập Kho
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
