'use client';

import { useState } from 'react';
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
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const orders = [
  { id: 'ORD-8821', customer: 'Nguyễn Văn A', phone: '0901234567', total: '1.200.000đ', status: 'Hoàn thành', date: '2024-05-12' },
  { id: 'ORD-8822', customer: 'Công ty TNHH B', phone: '02811223344', total: '3.500.000đ', status: 'Đang xử lý', date: '2024-05-11' },
  { id: 'ORD-8823', customer: 'Trần Thị C', phone: '0987654321', total: '450.000đ', status: 'Đang giao', date: '2024-05-10' },
  { id: 'ORD-8824', customer: 'Lê Văn D', phone: '0905556677', total: '2.100.000đ', status: 'Đã hủy', date: '2024-05-09' },
  { id: 'ORD-8825', customer: 'Phạm Thị E', phone: '0912233445', total: '890.000đ', status: 'Hoàn thành', date: '2024-05-08' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Đang xử lý': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Đang giao': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Đã hủy': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const OrdersPage = () => {
  const [showModal, setShowModal] = useState(false);

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
            placeholder="Tìm theo mã đơn, khách hàng, số điện thoại..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700"
          />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
            <Filter size={18} />
            Lọc trạng thái
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
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
              {orders.map((order, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={order.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-blue-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-900">{order.customer}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-semibold">{order.phone}</td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{order.total}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-semibold">{order.date}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
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
          <p className="text-sm text-slate-400 font-bold">Hiển thị 1 - 5 trong 128 đơn hàng</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white hover:border-slate-200'}`}>
                  {p}
                </button>
              ))}
              <span className="px-2 self-center text-slate-400 tracking-widest">...</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Tạo đơn hàng mới</h3>
                  <p className="text-sm font-semibold text-slate-400">Điền thông tin chi tiết để tạo đơn hàng</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Khách hàng</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                      <option>Chọn khách hàng...</option>
                      <option>Nguyễn Văn A</option>
                      <option>Công ty TNHH B</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ngày hẹn giao</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sản phẩm</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Plus size={24} className="opacity-40" />
                    <p className="text-sm font-bold">Thêm sản phẩm vào đơn hàng</p>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
                      Chọn từ danh mục
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú đơn hàng</label>
                  <textarea 
                    rows={3} 
                    placeholder="Giao trong giờ hành chính..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-8 pt-0 flex justify-end gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                  Xác nhận tạo đơn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
