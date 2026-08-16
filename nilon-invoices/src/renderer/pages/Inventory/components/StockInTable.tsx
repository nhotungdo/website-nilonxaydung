import React from 'react';
import { PackagePlus, Calendar, Box } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

export const StockInTable: React.FC = () => {
  const { stockInReceipts } = useInventoryStore();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <PackagePlus className="h-4 w-4 text-indigo-500" /> Lịch Sử Nhập Kho
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Ngày Nhập</th>
              <th className="py-3 px-4">Mã Phiếu & Lô</th>
              <th className="py-3 px-4">Sản Phẩm</th>
              <th className="py-3 px-4">Người Thực Hiện</th>
              <th className="py-3 px-4 text-center">Số Lượng Nhập</th>
              <th className="py-3 px-4 text-right">Tổng Tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {stockInReceipts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-sm">Chưa có phiếu nhập kho nào được lưu</p>
                </td>
              </tr>
            ) : (
              stockInReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(receipt.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-indigo-700">{receipt.receipt_code}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Lô: {receipt.batch_code}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <Box className="h-3.5 w-3.5 text-slate-400" />
                      <span>{receipt.product_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {receipt.created_by}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 font-black rounded-lg text-xs border border-emerald-200">
                      +{receipt.quantity} {receipt.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-800">
                    {receipt.total_amount.toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
