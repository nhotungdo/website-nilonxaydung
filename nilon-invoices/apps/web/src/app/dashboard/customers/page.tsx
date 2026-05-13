'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Download,
  MoreVertical,
  Edit,
  Eye,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { customersApi, type Customer } from '@/services/api';

const PAGE_SIZE = 15;

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCustomers = useCallback(() => {
    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);
    customersApi
      .getAll(debouncedSearch || undefined)
      .then((res) => {
        setCustomers(res.data);
        setPage(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);


  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const paginated = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cơ sở khách hàng</h2>
          <p className="text-slate-500 font-semibold mt-1">Quản lý thông tin và lịch sử giao dịch khách hàng.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách, số điện thoại, email..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-semibold"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="text-red-400" size={36} />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Lỗi tải dữ liệu</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && customers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
              <Users className="text-slate-300" size={36} />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-600">Chưa có khách hàng</p>
              <p className="text-sm text-slate-400 mt-1">
                {debouncedSearch ? `Không tìm thấy kết quả cho "${debouncedSearch}"` : 'Thêm khách hàng đầu tiên để bắt đầu'}
              </p>
            </div>
            {!debouncedSearch && (
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                <UserPlus size={18} />
                Thêm khách hàng
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && !error && customers.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Đơn hàng</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((cus, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      key={cus.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
                            {cus.name.split(' ').pop()?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{cus.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{cus.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          {cus.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                              <Phone size={12} className="text-slate-400" />
                              {cus.phone}
                            </div>
                          )}
                          {cus.email && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                              <Mail size={12} className="text-slate-400" />
                              {cus.email}
                            </div>
                          )}
                          {!cus.phone && !cus.email && (
                            <span className="text-xs text-slate-300 italic">Chưa có thông tin</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                          {cus._count?.orders ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400 font-bold">
                        {new Date(cus.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem lịch sử">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Gửi báo giá">
                            <FileText size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                            <Edit size={18} />
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
              <p className="text-sm text-slate-400 font-bold">
                Tổng cộng: {customers.length} khách hàng
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 text-slate-400 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-slate-500 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 text-slate-400 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all disabled:opacity-40"
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

export default CustomersPage;
