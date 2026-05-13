'use client';

import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Send, 
  Printer, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const invoices = [
  { id: 'INV-10024', orderId: 'ORD-8821', customer: 'Nguyễn Văn A', total: '1.200.000đ', vat: '120.000đ', status: 'Đã thanh toán', date: '2024-05-12' },
  { id: 'INV-10025', orderId: 'ORD-8822', customer: 'Công ty TNHH B', total: '3.500.000đ', vat: '350.000đ', status: 'Nháp', date: '2024-05-11' },
  { id: 'INV-10026', orderId: 'ORD-8823', customer: 'Trần Thị C', total: '450.000đ', vat: '45.000đ', status: 'Đã gửi', date: '2024-05-10' },
  { id: 'INV-10027', orderId: 'ORD-8824', customer: 'Lê Văn D', total: '2.100.000đ', vat: '210.000đ', status: 'Quá hạn', date: '2024-05-09' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Đã thanh toán': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Nháp': return 'bg-slate-50 text-slate-500 border-slate-100';
    case 'Đã gửi': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Quá hạn': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const InvoicesPage = () => {
  const [previewId, setPreviewId] = useState<string | null>(null);

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
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Plus size={18} />
            Tạo hóa đơn mới
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng hóa đơn', value: '1.284', color: 'bg-blue-500' },
          { label: 'Đã thanh toán', value: '1.102', color: 'bg-emerald-500' },
          { label: 'Đang chờ', value: '154', color: 'bg-amber-500' },
          { label: 'Quá hạn', value: '28', color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg opacity-20`}>
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        {/* Search */}
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Mã hóa đơn, tên khách hàng..."
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700"
            />
          </div>
        </div>

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
              {invoices.map((inv, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={inv.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-blue-600">{inv.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{inv.orderId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{inv.customer}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{inv.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{inv.total}</td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-semibold">{inv.vat}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(inv.status)}`}>
                      {inv.status}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {previewId && (
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
                    <p className="text-2xl font-black text-slate-900">{previewId}</p>
                    <p className="text-sm font-bold text-slate-400 mt-1">Ngày tạo: 12/05/2024</p>
                    <div className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block">
                      Đã thanh toán
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
                      <h4 className="text-lg font-black text-slate-900">Ông Nguyễn Văn Nhân</h4>
                      <p className="text-sm text-slate-500 font-semibold leading-relaxed">456 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                      <p className="text-sm text-slate-500 font-semibold">Số điện thoại: 0901 234 567</p>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-[11px] font-black uppercase text-slate-400">Nội dung</th>
                      <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-center">ĐVT</th>
                      <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-center">SL</th>
                      <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-right">Đơn giá</th>
                      <th className="py-4 text-[11px] font-black uppercase text-slate-400 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="py-4">
                      <td className="py-6 text-sm font-bold text-slate-900">Nilon lót sàn bê tông loại 1</td>
                      <td className="py-6 text-sm text-slate-500 text-center font-semibold">Kg</td>
                      <td className="py-6 text-sm text-slate-500 text-center font-semibold">80</td>
                      <td className="py-6 text-sm text-slate-500 text-right font-semibold">15.000</td>
                      <td className="py-6 text-sm font-black text-slate-900 text-right">1.200.000</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end border-t-4 border-slate-900 pt-8">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Cộng tiền hàng:</span>
                      <span>1.200.000đ</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Thuế VAT (10%):</span>
                      <span>120.000đ</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 pt-3">
                      <span>TỔNG CỘNG:</span>
                      <span>1.320.000đ</span>
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
