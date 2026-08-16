import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Factory,
  PackagePlus,
  AlertTriangle,
  Search,
  Filter,
  TrendingUp,
  History,
  Boxes,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { InventoryTable } from './components/InventoryTable';
import { StockInTable } from './components/StockInTable';
import { StockInModal } from './components/StockInModal';
import { ProductCategory } from '../../../shared/types/inventory';

export const InventoryPage: React.FC = () => {
  const {
    items,
    productionLogs,
    stockInReceipts,
    transactions,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    setIsStockInModalOpen
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'stockin' | 'history'>('inventory');

  // Stats Calculations
  const totalStockCount = items.reduce((sum, item) => sum + item.current_stock, 0);
  const lowStockCount = items.filter((item) => item.current_stock <= item.min_stock_alert).length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayProductionTotal = productionLogs
    .filter((log) => log.production_date === todayStr)
    .reduce((sum, log) => sum + log.produced_quantity, 0);

  const todayStockInCount = stockInReceipts.filter(
    (rec) => rec.created_at.split('T')[0] === todayStr
  ).length;

  const categories: ProductCategory[] = [
    'Nilon Lót Sàn PE',
    'Nilon Đen Công Trình',
    'Nilon Trong Suốt',
    'Bạt Dứa / Bạt Sọc',
    'Màng Vấn Màng Co',
    'Bảo Hộ Lao Động',
    'Vật Liệu Khác'
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#005B52] uppercase tracking-wider">
            <Boxes className="h-4 w-4" /> Quản Lý Kho & Sản Xuất Vận Hành
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Giao Diện Trong Kho (Inventory & Production)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Quản lý số lượng tồn kho nilon lót sàn, nhập hàng vào kho và ghi nhận sản lượng sản xuất trong ngày.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#005B52] text-white font-bold text-xs hover:bg-[#004740] shadow-md shadow-[#005B52]/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PackagePlus className="h-4 w-4" /> Thêm Hàng Vào Kho
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng Tồn Kho Hiện Tại
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalStockCount.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-500">cuộn/kg</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Đang lưu giữ tại 3 kho thành phẩm
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-[#005B52] rounded-2xl border border-emerald-100">
            <Package className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Today's Production Output */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sản Lượng Hôm Nay
            </span>
            <div className="text-2xl font-black text-blue-900 mt-1">
              {todayProductionTotal.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-500">cuộn/kg</span>
            </div>
            <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-1">
              <Factory className="h-3 w-3" /> Đùn & Cắt trong ngày {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
            <Factory className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Stock In Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lượt Nhập Kho Hôm Nay
            </span>
            <div className="text-2xl font-black text-indigo-900 mt-1">
              {todayStockInCount} <span className="text-sm font-semibold text-slate-500">phiếu nhập</span>
            </div>
            <div className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 mt-1">
              <ArrowDownLeft className="h-3 w-3" /> Cập nhật phiếu nhập kho mới
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
            <PackagePlus className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Low Stock Alert */}
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
              Cảnh Báo Tồn Kho Thấp
            </span>
            <div className={`text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {lowStockCount} <span className="text-sm font-semibold text-slate-500">sản phẩm</span>
            </div>
            <div className={`text-[11px] font-semibold flex items-center gap-1 mt-1 ${lowStockCount > 0 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              <AlertTriangle className="h-3 w-3" /> {lowStockCount > 0 ? 'Cần lên kế hoạch sản xuất gấp' : 'Tất cả mức tồn ổn định'}
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      {/* Main Tabs Navigation & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-[#005B52] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="h-4 w-4" /> Danh Sách Tồn Kho ({items.length})
          </button>

          <button
            onClick={() => setActiveTab('stockin')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'stockin'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackagePlus className="h-4 w-4" /> Lịch Sử Nhập Kho ({stockInReceipts.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="h-4 w-4" /> Biến Động Kho ({transactions.length})
          </button>
        </div>

        {/* Search & Category Filter (Only visible in inventory tab) */}
        {activeTab === 'inventory' && (
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên nilon, SKU, quy cách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52]"
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="pl-8 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52]"
              >
                <option value="ALL">Tất cả loại nilon</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tab View Contents */}
      {activeTab === 'inventory' && <InventoryTable />}

      {activeTab === 'stockin' && <StockInTable />}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-slate-500" /> Lịch Sử Nhật Ký Giao Dịch Kho & Sản Xuất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Thời Gian</th>
                  <th className="py-3 px-4">Loại Giao Dịch</th>
                  <th className="py-3 px-4">Sản Phẩm</th>
                  <th className="py-3 px-4 text-center">Biến Động</th>
                  <th className="py-3 px-4 text-center">Tồn Sau Thay Đổi</th>
                  <th className="py-3 px-4">Mã Tham Chiếu</th>
                  <th className="py-3 px-4">Người Thực Hiện</th>
                  <th className="py-3 px-4">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(tx.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      {tx.type === 'STOCK_IN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="h-3 w-3" /> Nhập Kho
                        </span>
                      )}
                      {tx.type === 'PRODUCTION_ADD' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Factory className="h-3 w-3" /> SX Thêm Kho
                        </span>
                      )}
                      {tx.type === 'STOCK_OUT' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <ArrowUpRight className="h-3 w-3" /> Xuất Bán
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{tx.product_name}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700 text-sm">
                      +{tx.quantity_change}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {tx.balance_after}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{tx.reference_code}</td>
                    <td className="py-3 px-4">{tx.created_by}</td>
                    <td className="py-3 px-4 text-slate-500 italic">{tx.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Render Modals */}
      <StockInModal />

    </div>
  );
};
