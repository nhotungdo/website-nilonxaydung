import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  PackageCheck,
  Building2,
  Tag,
  Calculator,
  Layers,
  Edit3,
  ListFilter
} from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

export const StockInModal: React.FC = () => {
  const { items, isStockInModalOpen, setIsStockInModalOpen, addStockIn } = useInventoryStore();

  const [inputMode, setInputMode] = useState<'SELECT' | 'CUSTOM'>('SELECT');
  const [selectedProductId, setSelectedProductId] = useState<string>(items[0]?.id || '');
  const [productName, setProductName] = useState<string>(items[0]?.name || '');
  const [unit, setUnit] = useState<string>(items[0]?.unit || 'Cuộn');
  const [quantity, setQuantity] = useState<number>(100);
  const [importPrice, setImportPrice] = useState<number>(320000);
  const [totalAmount, setTotalAmount] = useState<number>(32000000);
  const [batchCode, setBatchCode] = useState<string>(
    `LO-${new Date().toISOString().slice(5, 10).replace('-', '')}`
  );
  const [supplier, setSupplier] = useState<string>('Xưởng Đùn Nilon Bình Tân');
  const [createdBy, setCreatedBy] = useState<string>('Quản Kho Vận');
  const [notes, setNotes] = useState<string>('');

  // Update calculated total amount when quantity or import price changes
  useEffect(() => {
    setTotalAmount(Number(quantity || 0) * Number(importPrice || 0));
  }, [quantity, importPrice]);

  if (!isStockInModalOpen) return null;

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const prod = items.find((i) => i.id === productId);
    if (prod) {
      setProductName(prod.name);
      setUnit(prod.unit);
      setImportPrice(prod.import_price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || quantity <= 0) return;

    addStockIn({
      product_id: inputMode === 'SELECT' ? selectedProductId : `CUSTOM-${Date.now()}`,
      product_name: productName.trim(),
      quantity: Number(quantity),
      unit: unit,
      import_price: Number(importPrice),
      total_amount: Number(totalAmount),
      batch_code: batchCode || `LO-${Date.now()}`,
      supplier: supplier || 'Xưởng sản xuất',
      notes: notes,
      created_by: createdBy || 'Nhân viên kho'
    });
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const unitOptions = ['Cuộn', 'Cân / Kg', 'Bao', 'm²', 'Tấm', 'Lô', 'Cái'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#005B52] to-[#00796B] text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <PackageCheck className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Thêm Hàng Vào Kho (Stock In)</h3>
                <p className="text-xs text-emerald-100/80">
                  Xử lý nghiệp vụ nhập hàng nilon/vật liệu & tính tự động thành tiền
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsStockInModalOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700">
            {/* Input Mode Selector (Select from catalogue vs Type custom name) */}
            <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setInputMode('SELECT');
                  if (items[0]) handleProductSelect(items[0].id);
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'SELECT'
                    ? 'bg-white text-[#005B52] shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" /> Chọn Từ Danh Mục Kho
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode('CUSTOM');
                  setProductName('');
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'CUSTOM'
                    ? 'bg-white text-[#005B52] shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Nhập Tên Hàng Mới
              </button>
            </div>

            {/* 1. TÊN HÀNG NHẬP VÀO */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-[#005B52]" /> 1. Tên Hàng Nhập Vào <span className="text-red-500">*</span>
              </label>

              {inputMode === 'SELECT' ? (
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52] font-semibold text-slate-900"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.sku}] {item.name} — (Tồn: {item.current_stock} {item.unit})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Gõ tên hàng nilon/vật liệu nhập mới..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52] font-semibold text-slate-900"
                  required
                />
              )}
            </div>

            {/* 2. SỐ LƯỢNG & ĐƠN VỊ TÍNH GRID */}
            <div className="grid grid-cols-2 gap-4">
              {/* Số Lượng */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-[#005B52]" /> 2. Số Lượng Nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52] font-bold text-slate-900 text-base"
                  required
                />
              </div>

              {/* Đơn Vị Tính (Cân, Bao, Cuộn...) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Đơn Vị Tính (Cân, Bao, Cuộn...) <span className="text-red-500">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52] font-semibold text-slate-900"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. ĐƠN GIÁ HÀNG NHẬP */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Calculator className="h-3.5 w-3.5 text-[#005B52]" /> 3. Đơn Giá Nhập (VNĐ / {unit})
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={importPrice}
                onChange={(e) => setImportPrice(Number(e.target.value))}
                placeholder="Nhập đơn giá cho 1 đơn vị..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#005B52] font-bold text-slate-900"
              />
            </div>

            {/* 4. TỔNG GIÁ HÀNG NHẬP (HIGHLIGHTED BANNER) */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/90 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                  4. Tổng Giá Hàng Nhập (Thành Tiền)
                </span>
                <div className="text-xl font-black text-[#005B52] mt-0.5">
                  {formatVND(totalAmount)}
                </div>
                <div className="text-[11px] text-emerald-700/80 font-medium mt-0.5">
                  = {quantity.toLocaleString('vi-VN')} {unit} × {formatVND(importPrice)}
                </div>
              </div>

              <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm text-xs font-bold text-emerald-900">
                Lô nhập: {batchCode}
              </div>
            </div>

            {/* Supplier & Created By Details */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-slate-400" /> Mã Lô / Phiếu
                </label>
                <input
                  type="text"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="VD: LO-PE-0803"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#005B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" /> Nhà Cung Cấp
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="VD: Xưởng đùn PE"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#005B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Người Lập Phiếu</label>
                <input
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  placeholder="Tên nhân viên"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#005B52]"
                />
              </div>
            </div>


            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Nhập Kho</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú thêm cho lô hàng nhập..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#005B52]"
              />
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsStockInModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#005B52] text-white font-bold hover:bg-[#004740] shadow-md shadow-[#005B52]/20 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Xác Nhận Thêm Hàng Vào Kho
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
