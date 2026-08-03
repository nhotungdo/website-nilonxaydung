import React from 'react';
import { Factory, Calendar, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

export const ProductionLogTable: React.FC = () => {
  const { productionLogs } = useInventoryStore();

  const totalProduced = productionLogs.reduce((acc, log) => acc + log.produced_quantity, 0);
  const totalWaste = productionLogs.reduce((acc, log) => acc + log.waste_quantity, 0);

  return (
    <div className="space-y-4">
      {/* Daily Summary Banner */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-700">Tổng Hoàn Thành Trong Nhật Ký</div>
            <div className="text-xl font-black text-blue-900">{totalProduced.toLocaleString('vi-VN')} cuộn/kg</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-600 text-white rounded-xl">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-700">Tổng Phế Phẩm / Hao Hụt</div>
            <div className="text-xl font-black text-amber-900">{totalWaste.toFixed(1)} kg</div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-[#005B52] text-white rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-700">Tỷ Lệ Đạt Chuẩn Kỹ Thuật</div>
            <div className="text-xl font-black text-emerald-900">
              {totalProduced > 0 ? (100 - (totalWaste / (totalProduced * 10)) * 100).toFixed(1) : 100}%
            </div>
          </div>
        </div>
      </div>

      {/* Production Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ngày & Ca Sản Xuất</th>
                <th className="py-3.5 px-4">Dây Chuyển / Máy</th>
                <th className="py-3.5 px-4">Thợ Vận Hành</th>
                <th className="py-3.5 px-4">Sản Phẩm Đùn / Cắt</th>
                <th className="py-3.5 px-4 text-center">Sản Lượng Hoàn Thành</th>
                <th className="py-3.5 px-4 text-center">Phế Phẩm (Kg)</th>
                <th className="py-3.5 px-4 text-center">Tự Động Tăng Kho</th>
                <th className="py-3.5 px-4">Ghi Chú Vận Hành</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {productionLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">Chưa có nhật ký sản xuất nào được lưu trong ngày</p>
                    <p className="text-xs mt-1">Bấm nút "Ghi Nhận Sản Xuất" để thêm lượt sản xuất mới</p>
                  </td>
                </tr>
              ) : (
                productionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Date & Shift */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{log.production_date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{log.shift}</span>
                      </div>
                    </td>

                    {/* Machine */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                        {log.machine_id}
                      </span>
                    </td>

                    {/* Operator */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {log.operator_name}
                    </td>

                    {/* Product Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      {log.product_name}
                    </td>

                    {/* Produced Quantity */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 font-black rounded-xl text-sm border border-emerald-200">
                        +{log.produced_quantity} {log.unit}
                      </span>
                    </td>

                    {/* Waste */}
                    <td className="py-3.5 px-4 text-center font-bold text-amber-700">
                      {log.waste_quantity > 0 ? `${log.waste_quantity} kg` : '0 kg'}
                    </td>

                    {/* Auto Added Status */}
                    <td className="py-3.5 px-4 text-center">
                      {log.auto_added_to_stock ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đã cộng kho
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Không cộng</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-500 text-xs italic">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
