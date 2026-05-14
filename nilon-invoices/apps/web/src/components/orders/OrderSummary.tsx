'use client';

import { ShoppingCart, Package, Hash } from 'lucide-react';
import type { OrderItem } from './OrderProductRow';

interface OrderSummaryProps {
  items: OrderItem[];
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const validItems = items.filter((i) => i.product !== null);
  const totalQty = validItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = validItems.reduce(
    (acc, i) => acc + Number(i.product!.price) * i.quantity,
    0
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tóm tắt đơn hàng</h4>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
            <Package size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sản phẩm</span>
          </div>
          <p className="text-xl font-black text-slate-900">{validItems.length}</p>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
            <Hash size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Số lượng</span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalQty}</p>
        </div>

        <div className="bg-blue-600 rounded-xl p-3 text-center shadow-lg shadow-blue-600/20">
          <div className="flex items-center justify-center gap-1 text-blue-200 mb-1">
            <ShoppingCart size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Tạm tính</span>
          </div>
          <p className="text-sm font-black text-white leading-tight">{formatPrice(subtotal)}</p>
        </div>
      </div>
    </div>
  );
}
