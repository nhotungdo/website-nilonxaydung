'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Plus,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { productsApi, type Product } from '@/services/api';

const PAGE_SIZE = 10;

const getStockStatus = (stock: number): { label: string; style: string } => {
  if (stock === 0) return { label: 'Hết hàng', style: 'bg-red-50 text-red-600 border-red-100' };
  if (stock <= 20) return { label: 'Sắp hết', style: 'bg-amber-50 text-amber-600 border-amber-100' };
  return { label: 'Còn hàng', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProducts = useCallback(() => {
    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);
    productsApi
      .getAll(debouncedSearch || undefined)
      .then((res) => {
        setProducts(res.data);
        setPage(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };


  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStockCount = products.filter((p) => p.stock <= 20).length;

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Low Stock Warning - only from real data */}
      {!loading && !error && lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Thông báo tồn kho thấp</p>
            <p className="text-xs text-amber-700 font-medium">
              Bạn có {lowStockCount} sản phẩm đang sắp hết hoặc đã hết hàng. Vui lòng cập nhật.
            </p>
          </div>
          <button className="text-xs font-black text-amber-900 hover:underline">Xử lý ngay</button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="text-red-400" size={36} />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Lỗi tải dữ liệu</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
            <button onClick={fetchProducts} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
              <Package className="text-slate-300" size={36} />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-600">Chưa có sản phẩm</p>
              <p className="text-sm text-slate-400 mt-1">
                {debouncedSearch ? `Không tìm thấy sản phẩm với từ khóa "${debouncedSearch}"` : 'Thêm sản phẩm đầu tiên để bắt đầu'}
              </p>
            </div>
            {!debouncedSearch && (
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">SKU</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Giá bán</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tồn kho</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((prod, idx) => {
                    const stockStatus = getStockStatus(prod.stock);
                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
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
                        <td className="px-6 py-5 text-sm text-slate-400 font-mono font-bold tracking-tighter">
                          {prod.sku ?? '—'}
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-slate-900">
                          {Number(prod.price).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-900 font-black text-center">{prod.stock}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${stockStatus.style}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <p className="text-sm text-slate-400 font-bold">
                Trang {page} / {totalPages} ({products.length} sản phẩm)
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
