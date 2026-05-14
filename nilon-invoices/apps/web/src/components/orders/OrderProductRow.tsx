'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { ProductAutocomplete } from './ProductAutocomplete';
import type { Product } from '@/services/api';
import { motion } from 'framer-motion';

export interface OrderItem {
  product: Product | null;
  quantity: number;
}

interface OrderProductRowProps {
  item: OrderItem;
  index: number;
  onUpdate: (index: number, data: Partial<OrderItem>) => void;
  onRemove: (index: number) => void;
  productError?: string;
  quantityError?: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function OrderProductRow({
  item,
  index,
  onUpdate,
  onRemove,
  productError,
  quantityError,
}: OrderProductRowProps) {
  const subtotal = item.product ? Number(item.product.price) * item.quantity : 0;
  const stockExceeded = item.product && item.quantity > item.product.stock;
  const lowStock = item.product && item.product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-start bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative group"
    >
      {/* Row number badge */}
      <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm">
        {index + 1}
      </div>

      {/* Product Search */}
      <ProductAutocomplete
        value={item.product}
        onChange={(product) => onUpdate(index, { product, quantity: 1 })}
        error={productError}
      />

      {/* Quantity */}
      <div className="w-28 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
          Số lượng
        </label>
        <input
          type="number"
          min={1}
          max={item.product?.stock ?? undefined}
          value={item.quantity}
          onChange={(e) => {
            const qty = Math.max(1, parseInt(e.target.value) || 1);
            onUpdate(index, { quantity: qty });
          }}
          className={`w-full bg-white border-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all text-center ${
            stockExceeded
              ? 'border-red-300 focus:ring-4 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
          }`}
        />
        {stockExceeded && (
          <div className="flex items-center gap-1 mt-1">
            <AlertTriangle size={10} className="text-red-500 flex-shrink-0" />
            <span className="text-[10px] font-bold text-red-500">Vượt quá tồn kho</span>
          </div>
        )}
        {lowStock && !stockExceeded && item.product && (
          <span className="text-[10px] font-semibold text-amber-500 block mt-1">
            Còn {item.product.stock} {item.product.unit || 'cái'}
          </span>
        )}
        {quantityError && (
          <span className="text-[10px] font-bold text-red-500 block mt-1">{quantityError}</span>
        )}
      </div>

      {/* Unit Price */}
      <div className="w-32 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
          Đơn giá
        </label>
        <div className="px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 text-right">
          {item.product ? formatPrice(Number(item.product.price)) : '—'}
        </div>
      </div>

      {/* Subtotal */}
      <div className="w-36 space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
          Thành tiền
        </label>
        <div className="px-3 py-2.5 bg-blue-50 border-2 border-blue-100 rounded-xl text-sm font-black text-blue-700 text-right">
          {subtotal > 0 ? formatPrice(subtotal) : '—'}
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="self-end mb-0.5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        title="Xóa sản phẩm"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
