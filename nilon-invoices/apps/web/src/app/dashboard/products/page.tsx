'use client';

import { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  MoreVertical, 
  Edit, 
  Trash2,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const products = [
  { id: 'PROD-001', name: 'Nilon lót sàn bê tông', sku: 'NL-LS-001', price: '15.000đ', stock: 850, status: 'Còn hàng', category: 'Vật liệu xây dựng' },
  { id: 'PROD-002', name: 'Màng PE quấn hàng 50cm', sku: 'PE-QH-002', price: '45.000đ', stock: 12, status: 'Sắp hết', category: 'Đóng gói' },
  { id: 'PROD-003', name: 'Túi nilon HDPE size L', sku: 'HD-TL-003', price: '25.000đ', stock: 0, status: 'Hết hàng', category: 'Tiêu dùng' },
  { id: 'PROD-004', name: 'Màng chống thấm HDPE', sku: 'HD-CT-004', price: '85.000đ', stock: 240, status: 'Còn hàng', category: 'Vật liệu xây dựng' },
  { id: 'PROD-005', name: 'Cuộn nilon khổ 2m', sku: 'NL-K2-005', price: '32.000đ', stock: 120, status: 'Còn hàng', category: 'Vật liệu xây dựng' },
];

const getStockStyle = (status: string) => {
  switch (status) {
    case 'Còn hàng': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Sắp hết': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Hết hàng': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Danh mục sản phẩm</h2>
          <p className="text-slate-500 font-semibold mt-1">Quản lý tồn kho và thông tin sản phẩm.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Upload size={18} />
            Import
          </button>
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, SKU..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-semibold"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
            <Filter size={18} />
            Lọc
          </button>
          <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block" />
          <div className="flex bg-slate-50 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Warning for Low Stock */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-900">Thông báo tồn kho thấp</p>
          <p className="text-xs text-amber-700 font-medium">Bạn có 3 sản phẩm đang sắp hết hàng và 1 sản phẩm đã hết hàng. Vui lòng cập nhật.</p>
        </div>
        <button className="text-xs font-black text-amber-900 hover:underline">Xử lý ngay</button>
      </div>

      {/* Products Table/List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Phân loại</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Giá bán</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tồn kho</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((prod, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={prod.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                        <Package size={24} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{prod.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-mono font-bold tracking-tighter">{prod.sku}</td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {prod.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{prod.price}</td>
                  <td className="px-6 py-5 text-sm text-slate-900 font-black text-center">{prod.stock}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStockStyle(prod.status)}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-sm text-slate-400 font-bold">Trang 1 / 12</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
