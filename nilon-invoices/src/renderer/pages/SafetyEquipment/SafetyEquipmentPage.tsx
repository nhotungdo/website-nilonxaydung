import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardHat, AlertTriangle, Search, MapPin, CheckCircle, PackagePlus } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { StockInModal } from '../Inventory/components/StockInModal';

export const SafetyEquipmentPage: React.FC = () => {
  const { items, setIsStockInModalOpen } = useInventoryStore();
  const [localSearch, setLocalSearch] = useState('');

  // Lọc riêng danh mục Bảo hộ lao động
  const safetyItems = items.filter(
    (item) => item.category === 'Bảo Hộ Lao Động'
  );

  const filteredItems = safetyItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(localSearch.toLowerCase()) ||
      (item.specs && item.specs.toLowerCase().includes(localSearch.toLowerCase()))
    );
  });

  const totalStock = safetyItems.reduce((sum, item) => sum + item.current_stock, 0);
  const lowStockCount = safetyItems.filter((item) => item.current_stock <= item.min_stock_alert).length;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Quản Lý Đồ Bảo Hộ
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Thiết Bị Bảo Hộ Lao Động
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Quản lý số lượng tồn kho các mặt hàng bảo hộ: mũ, găng tay, giày công trình...
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PackagePlus className="h-4 w-4" /> Nhập Kho Bảo Hộ
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng Tồn Kho Bảo Hộ
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalStock.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-500">Sản phẩm</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <HardHat className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
            lowStockCount > 0
              ? 'bg-red-50/60 border-red-200 text-red-900'
              : 'bg-white border-slate-200/80 text-slate-900'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cảnh Báo Sắp Hết
            </span>
            <div className={`text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {lowStockCount} <span className="text-sm font-semibold text-slate-500">Mặt hàng</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đồ bảo hộ (VD: Găng tay, Mũ...)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4 text-center">Tồn Kho</th>
                <th className="py-3.5 px-4 text-right">Giá Nhập</th>
                <th className="py-3.5 px-4 text-right">Giá Bán</th>
                <th className="py-3.5 px-4">Vị Trí</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">Chưa có sản phẩm bảo hộ nào</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLowStock = item.current_stock <= item.min_stock_alert;
                  const stockPercent = Math.min(Math.round((item.current_stock / (item.min_stock_alert * 4)) * 100), 100);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-xl mt-0.5 ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                            <HardHat className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                              <span className="font-mono font-bold text-slate-600">SKU: {item.sku}</span>
                              {item.specs && <span>• {item.specs}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-black text-sm ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                            {item.current_stock.toLocaleString('vi-VN')} {item.unit}
                          </span>
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.max(stockPercent, 10)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-600">
                        {formatVND(item.import_price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                        {formatVND(item.selling_price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.location || 'Chưa định vị'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> Tồn Thấp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3" /> An Toàn
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setIsStockInModalOpen(true)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold text-[11px] transition-colors inline-flex items-center gap-1 border border-amber-200/80"
                        >
                          <PackagePlus className="h-3.5 w-3.5" /> Nhập
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

      <StockInModal />
    </div>
  );
};
