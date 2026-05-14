'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersApi, type Order } from '@/services/api';
import { CreateOrderModal } from '@/components/orders/CreateOrderModal';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Chờ xử lý', style: 'bg-slate-50 text-slate-600 border-slate-100' },
  CONFIRMED: { label: 'Đã xác nhận', style: 'bg-blue-50 text-blue-600 border-blue-100' },
  SHIPPING: { label: 'Đang giao', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  COMPLETED: { label: 'Hoàn thành', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  CANCELLED: { label: 'Đã hủy', style: 'bg-red-50 text-red-600 border-red-100' },
};

const STATUS_FILTERS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const OrdersPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(searchParams.get('create') === 'true');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      router.replace('/dashboard/orders', { scroll: false });
    }
  }, [searchParams, router]);

  // Keyboard shortcut Ctrl+N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchOrders = useCallback(() => {
    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);
    ordersApi
      .getAll(debouncedSearch || undefined, statusFilter || undefined)
      .then((res) => {
        setOrders(res.data);
        setPage(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      await ordersApi.remove(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };


  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-slate-500 font-semibold mt-1">Quản lý và theo dõi các đơn hàng trong hệ thống.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Xuất Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Tạo đơn hàng mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, khách hàng, số điện thoại..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700"
          />
        </div>
        <div className="flex gap-3 relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-all"
          >
            <Filter size={18} />
            {statusFilter ? STATUS_MAP[statusFilter]?.label : 'Lọc trạng thái'}
          </button>
          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 min-w-[180px] overflow-hidden"
              >
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setStatusFilter(f.value); setShowFilterMenu(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${statusFilter === f.value ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
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
            <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
              <ShoppingBag className="text-slate-300" size={36} />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-600">Chưa có đơn hàng</p>
              <p className="text-sm text-slate-400 mt-1">
                {debouncedSearch || statusFilter ? 'Không tìm thấy kết quả phù hợp' : 'Tạo đơn hàng đầu tiên để bắt đầu'}
              </p>
            </div>
            {!debouncedSearch && !statusFilter && (
              <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                <Plus size={18} />
                Tạo đơn hàng mới
              </button>
            )}
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Mã đơn</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((order, idx) => {
                    const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP['PENDING'];
                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-blue-600">{order.orderCode}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-900">{order.customer.name}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 font-semibold">
                          {order.customer.phone ?? '—'}
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-slate-900">
                          {Number(order.total).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusInfo.style}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400 font-semibold">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
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
                Hiển thị {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, orders.length)} trong {orders.length} đơn hàng
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white hover:border hover:border-slate-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateOrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default OrdersPage;
