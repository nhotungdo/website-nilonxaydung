import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Factory, CheckCircle2, ShieldAlert, Cpu, Calendar } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

export const DailyProductionModal: React.FC = () => {
  const { items, isProductionModalOpen, setIsProductionModalOpen, recordDailyProduction } =
    useInventoryStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(items[0]?.id || '');
  const [productionDate, setProductionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [shift, setShift] = useState<
    'Ca sáng (06:00 - 14:00)' | 'Ca chiều (14:00 - 22:00)' | 'Ca đêm (22:00 - 06:00)'
  >('Ca sáng (06:00 - 14:00)');
  const [machineId, setMachineId] = useState<string>('Máy Thổi PE-01');
  const [operatorName, setOperatorName] = useState<string>('Nguyễn Văn Thợ Đùn');
  const [producedQuantity, setProducedQuantity] = useState<number>(50);
  const [wasteQuantity, setWasteQuantity] = useState<number>(2);
  const [autoAddToStock, setAutoAddToStock] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  if (!isProductionModalOpen) return null;

  const selectedProduct = items.find((i) => i.id === selectedProductId) || items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || producedQuantity <= 0) return;

    recordDailyProduction({
      production_date: productionDate,
      shift: shift,
      machine_id: machineId,
      operator_name: operatorName || 'Thợ vận hành',
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      produced_quantity: Number(producedQuantity),
      waste_quantity: Number(wasteQuantity),
      unit: selectedProduct.unit,
      auto_added_to_stock: autoAddToStock,
      notes: notes
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Factory className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ghi Nhận Sản Lượng Sản Xuất</h3>
                <p className="text-xs text-blue-100/80">Lưu lại số lượng hàng nilon đã đùn/cắt sản xuất trong ngày</p>
              </div>
            </div>
            <button
              onClick={() => setIsProductionModalOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700">
            {/* Date & Shift Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Ngày Sản Xuất
                </label>
                <input
                  type="date"
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ca Sản Xuất</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="Ca sáng (06:00 - 14:00)">Ca sáng (06:00 - 14:00)</option>
                  <option value="Ca chiều (14:00 - 22:00)">Ca chiều (14:00 - 22:00)</option>
                  <option value="Ca đêm (22:00 - 06:00)">Ca đêm (22:00 - 06:00)</option>
                </select>
              </div>
            </div>

            {/* Machine & Operator */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-slate-400" /> Máy / Dây Chuyền
                </label>
                <select
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="Máy Thổi PE-01">Máy Thổi PE-01 (Khổ lớn)</option>
                  <option value="Máy Thổi PE-02">Máy Thổi PE-02 (Tái sinh)</option>
                  <option value="Máy Cắt Màng-01">Máy Cắt Màng-01</option>
                  <option value="Máy Quấn Màng Co-02">Máy Quấn Màng Co-02</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thợ Vận Hành / Kỹ Thuật</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="Tên người vận hành"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Choose Product */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sản Phẩm Thành Phẩm <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.sku}] {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Produced Quantity & Waste Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sản Lượng Hoàn Thành ({selectedProduct?.unit || 'Cuộn'}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={producedQuantity}
                  onChange={(e) => setProducedQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Phế Phẩm / Hao Hụt (Kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={wasteQuantity}
                  onChange={(e) => setWasteQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-amber-700"
                />
              </div>
            </div>

            {/* Auto Add to Stock Checkbox */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/80 flex items-center gap-3">
              <input
                type="checkbox"
                id="autoAdd"
                checked={autoAddToStock}
                onChange={(e) => setAutoAddToStock(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoAdd" className="text-xs text-blue-900 font-medium cursor-pointer">
                <strong>Tự động cộng sản lượng này vào kho tồn hiện tại</strong>
                <span className="block text-[11px] text-blue-700/80">
                  (Cộng +{producedQuantity} {selectedProduct?.unit} vào kho {selectedProduct?.name})
                </span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Vận Hành</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Tốc độ máy đùn 95%, nguyên liệu hạt PE HDPE..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProductionModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" /> Lưu Nhật Ký Sản Xuất
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
