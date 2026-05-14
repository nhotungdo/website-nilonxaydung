'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Chờ xử lý', style: 'bg-slate-100 text-slate-600 border-slate-200' },
  CONFIRMED: { label: 'Đã xác nhận', style: 'bg-blue-100 text-blue-700 border-blue-200' },
  SHIPPING: { label: 'Đang giao', style: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  COMPLETED: { label: 'Hoàn thành', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', style: 'bg-red-100 text-red-700 border-red-200' },
};

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOne(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="w-32 h-10 bg-slate-200 rounded-xl" />
          <div className="flex gap-3">
            <div className="w-32 h-12 bg-slate-200 rounded-2xl" />
            <div className="w-32 h-12 bg-slate-200 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="h-32 bg-slate-200 rounded-[2.5rem]" />
            <div className="h-96 bg-slate-200 rounded-[2.5rem]" />
          </div>
          <div className="space-y-8">
            <div className="h-64 bg-slate-200 rounded-[2.5rem]" />
            <div className="h-64 bg-slate-200 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !res?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-900">Không tìm thấy đơn hàng</h2>
          <p className="text-slate-500 mt-2">Đơn hàng có thể đã bị xóa hoặc mã không hợp lệ.</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/orders')}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const order = res.data;
  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP['PENDING'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => router.push('/dashboard/orders')}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all group"
        >
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
            <ChevronLeft size={20} />
          </div>
          Quay lại danh sách
        </button>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Printer size={18} />
            In hóa đơn
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status & Code Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <FileText size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{order.orderCode}</h1>
                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-slate-400 font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền thanh toán</p>
              <p className="text-3xl font-black text-blue-600 tracking-tight mt-1">
                {Number(order.total).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </motion.div>

          {/* Product List Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Chi tiết sản phẩm</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                {order.totalItems} sản phẩm
              </span>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Số lượng</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Đơn giá</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                            {item.skuSnapshot || 'SP'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{item.productNameSnapshot}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.skuSnapshot}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-sm font-black text-slate-700">x{item.quantity}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-bold text-slate-500">{Number(item.priceSnapshot).toLocaleString('vi-VN')}đ</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-slate-900">{Number(item.subtotal).toLocaleString('vi-VN')}đ</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-slate-50/50 space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Tạm tính</span>
                <span>{Number(order.subtotal).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Thuế (0%)</span>
                <span>0đ</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base font-black text-slate-900">Tổng cộng</span>
                <span className="text-2xl font-black text-blue-600">{Number(order.total).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </motion.div>

          {/* Note Card */}
          {order.note && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 space-y-4"
            >
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} />
                Ghi chú
              </h3>
              <p className="text-slate-600 font-semibold leading-relaxed">
                {order.note}
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Customer Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 space-y-6"
          >
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={16} />
              Khách hàng
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                {order.customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-black text-slate-900">{order.customer.name}</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">ID: {order.customerId.slice(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điện thoại</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{order.customer.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{order.customer.email || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-sm font-bold text-slate-700 mt-1 leading-relaxed">
                    {order.customer.address || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline & Metadata Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-900/20 p-8 space-y-6 text-white"
          >
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} />
              Thông tin bổ sung
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Người tạo</p>
                  <p className="text-sm font-bold mt-1">Quản trị viên (Admin)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">ID: {order.createdBy.slice(0, 8)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời gian tạo</p>
                  <p className="text-sm font-bold mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-amber-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lần cuối cập nhật</p>
                  <p className="text-sm font-bold mt-1">{new Date(order.updatedAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
