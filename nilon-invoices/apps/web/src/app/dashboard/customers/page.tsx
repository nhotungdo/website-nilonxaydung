'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  Edit, 
  Eye, 
  Mail, 
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const customers = [
  { id: 'CUS-001', name: 'Nguyễn Văn A', phone: '0901 234 567', email: 'vana@gmail.com', orders: 12, spent: '12.500.000đ', date: '12/05/2024' },
  { id: 'CUS-002', name: 'Công ty TNHH B', phone: '028 1122 3344', email: 'contact@companyb.com', orders: 45, spent: '85.000.000đ', date: '11/05/2024' },
  { id: 'CUS-003', name: 'Trần Thị C', phone: '0987 654 321', email: 'thic@outlook.com', orders: 5, spent: '2.450.000đ', date: '10/05/2024' },
  { id: 'CUS-004', name: 'Lê Văn D', phone: '0905 556 677', email: 'levand@gmail.com', orders: 2, spent: '4.200.000đ', date: '09/05/2024' },
  { id: 'CUS-005', name: 'Phạm Thị E', phone: '0912 233 445', email: 'thie@hotmail.com', orders: 28, spent: '32.890.000đ', date: '08/05/2024' },
];

const CustomersPage = () => {
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

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên khách, số điện thoại, email..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-semibold"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Đơn hàng</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tổng chi tiêu</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((cus, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={cus.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
                        {cus.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{cus.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{cus.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                        <Phone size={12} className="text-slate-400" />
                        {cus.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                        <Mail size={12} className="text-slate-400" />
                        {cus.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                      {cus.orders}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{cus.spent}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-bold">{cus.date}</td>
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
          <p className="text-sm text-slate-400 font-bold">Tổng cộng: 1.250 khách hàng</p>
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
    </div>
  );
};

export default CustomersPage;
