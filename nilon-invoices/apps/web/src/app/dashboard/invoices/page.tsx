'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Send,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { invoicesApi, type Invoice, type InvoiceStats } from '@/services/api';

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  DRAFT: { label: 'Nháp', style: 'bg-slate-50 text-slate-500 border-slate-100' },
  ISSUED: { label: 'Đã gửi', style: 'bg-blue-50 text-blue-600 border-blue-100' },
  PAID: { label: 'Đã thanh toán', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  VOID: { label: 'Đã hủy', style: 'bg-red-50 text-red-600 border-red-100' },
};

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchInvoices = useCallback(() => {
    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);
    Promise.all([
      invoicesApi.getAll(debouncedSearch || undefined),
      invoicesApi.getStats(),
    ])
      .then(([invRes, statsRes]) => {
        setInvoices(invRes.data);
        setStats(statsRes.data);
        setPage(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);


  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const totalPages = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const paginated = invoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const previewInvoice = invoices.find((inv) => inv.id === previewId);

  const statCards = stats
    ? [
        { label: 'Tổng hóa đơn', value: stats.total, color: 'bg-blue-500' },
        { label: 'Đã thanh toán', value: stats.paid, color: 'bg-emerald-500' },
        { label: 'Đang chờ', value: stats.pending, color: 'bg-amber-500' },
        { label: 'Quá hạn', value: stats.overdue, color: 'bg-red-500' },
      ]
    : [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hóa đơn điện tử</h2>
          <p className="text-slate-500 font-semibold mt-1">Quản lý hóa đơn và trạng thái thanh toán.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Printer size={18} />
            In hàng loạt
          </button>
          <Link
            href="/dashboard/orders?create=true"
            className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Tạo hóa đơn mới
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse h-24" />
            ))
          : statCards.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg opacity-80`}>
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-xl font-black text-slate-900">{stat.value.toLocaleString('vi-VN')}</h4>
                </div>
              </div>
            ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        {/* Search */}
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mã hóa đơn, tên khách hàng..."
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700"
            />
          </div>
        </div>

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
            <button onClick={fetchInvoices} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
              <FileText className="text-slate-300" size={36} />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-600">Chưa có hóa đơn</p>
              <p className="text-sm text-slate-400 mt-1">
                {debouncedSearch ? `Không tìm thấy hóa đơn với từ khóa "${debouncedSearch}"` : 'Tạo hóa đơn đầu tiên để bắt đầu'}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && invoices.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Mã hóa đơn</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">VAT (10%)</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((inv, idx) => {
                    const statusInfo = STATUS_MAP[inv.status] ?? STATUS_MAP['DRAFT'];
                    const vatAmount = Number(inv.totalAmount) * 0.1;
                    return (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        key={inv.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-blue-600">{inv.invoiceNo}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{inv.order?.orderCode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{inv.order?.customer?.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              {new Date(inv.issueDate).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-slate-900">
                          {Number(inv.totalAmount).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 font-semibold">
                          {vatAmount.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusInfo.style}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => setPreviewId(inv.id)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Download size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Send size={18} />
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
                {invoices.length} hóa đơn
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 text-slate-400 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-slate-500 px-2">{page} / {totalPages}</span>
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

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {previewId && previewInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-10 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                      <FileText size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Hóa đơn giá trị gia tăng</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">VAT INVOICE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{previewInvoice.invoiceNo}</p>
                    <p className="text-sm font-bold text-slate-400 mt-1">
                      Ngày tạo: {new Date(previewInvoice.issueDate).toLocaleDateString('vi-VN')}
                    </p>
                    <div className={`mt-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block border ${STATUS_MAP[previewInvoice.status]?.style}`}>
                      {STATUS_MAP[previewInvoice.status]?.label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị bán hàng</p>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">CÔNG TY TNHH NILON INVOICES</h4>
                      <p className="text-sm text-slate-500 font-semibold leading-relaxed">123 Đường Nilon, Quận Tân Bình, TP. Hồ Chí Minh</p>
                      <p className="text-sm text-slate-500 font-semibold">MST: 0101234567</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</p>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{previewInvoice.order?.customer?.name}</h4>
                    </div>
                  </div>
                </div>

                {previewInvoice.order?.items && previewInvoice.order.items.length > 0 && (
                  <table className="w-full mb-12">
                    <thead>
                      <tr className="border-b-2 border-slate-900">
                        <th className="py-4 text-[11px] font-black uppercase text-slate-400">Nội dung</th>
                        <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-center">SL</th>
                        <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-right">Đơn giá</th>
                        <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewInvoice.order.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-6 text-sm font-bold text-slate-900">{item.productNameSnapshot}</td>
                          <td className="py-6 text-sm text-slate-500 text-center font-semibold">{item.quantity}</td>
                          <td className="py-6 text-sm text-slate-500 text-right font-semibold">
                            {Number(item.priceSnapshot).toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-6 text-sm font-black text-slate-900 text-right">
                            {Number(item.subtotal).toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="flex justify-end border-t-4 border-slate-900 pt-8">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Cộng tiền hàng:</span>
                      <span>{Number(previewInvoice.totalAmount).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Thuế VAT (10%):</span>
                      <span>{(Number(previewInvoice.totalAmount) * 0.1).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 pt-3">
                      <span>TỔNG CỘNG:</span>
                      <span>{(Number(previewInvoice.totalAmount) * 1.1).toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <ShieldCheck size={16} />
                  Hóa đơn điện tử hợp lệ
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Download size={18} />
                    Tải PDF
                  </button>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Printer size={18} />
                    In hóa đơn
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoicesPage;
