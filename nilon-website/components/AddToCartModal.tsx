"use client";
import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import toast from "react-hot-toast";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    price?: number;
  };
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [thickness, setThickness] = useState("Phổ thông (2 zem)");
  const [size, setSize] = useState("Cuộn 2m");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThickness("Phổ thông (2 zem)");
      setSize("Cuộn 2m");
      setQuantity(1);
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      thickness,
      size,
      quantity,
      note,
      price: product.price,
    });
    toast.success("Đã thêm vào danh sách báo giá!", {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#fff',
        color: '#1E3A8A',
        fontWeight: 'bold'
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 font-heading mb-4 pr-8">Tùy Chọn Quy Cách</h3>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                className="object-cover" 
              />
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight mb-1 font-heading">{product.name}</div>
              <div className="text-xs text-slate-500 leading-relaxed">Thêm vào danh sách báo giá để nhận ưu đãi chiết khấu trực tiếp.</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider mb-1.5">Độ dày / Thông số</label>
              <select 
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full min-h-[44px] border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all bg-white text-base leading-[1.5]"
              >
                <option value="Phổ thông (2 zem)">Phổ thông (2 zem)</option>
                <option value="Tiêu chuẩn (4 zem)">Tiêu chuẩn (4 zem)</option>
                <option value="Dày (6 zem)">Dày (6 zem)</option>
                <option value="Cực dày (>10 zem)">Cực dày ({">"}10 zem)</option>
                <option value="Theo yêu cầu">Theo yêu cầu / Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider mb-1.5">Kích thước</label>
              <select 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full min-h-[44px] border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all bg-white text-base leading-[1.5]"
              >
                <option value="Khổ 1m">Khổ 1m</option>
                <option value="Khổ 2m">Khổ 2m</option>
                <option value="Khổ 3m">Khổ 3m</option>
                <option value="Khổ 4m">Khổ 4m</option>
                <option value="Theo yêu cầu">Theo yêu cầu (Cắt theo size)</option>
              </select>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider mb-1.5">Số lượng (Cuộn/Kg)</label>
                <div className="flex border border-slate-300 rounded-[12px] overflow-hidden min-h-[44px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 flex items-center justify-center bg-[#f4f9fc] hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center font-bold text-slate-900 outline-none text-base"
                    min="1"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 flex items-center justify-center bg-[#f4f9fc] hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider mb-1.5">Ghi chú thêm (Không bắt buộc)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Dùng cho công trình nền móng..."
                className="w-full border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all resize-none h-20 text-base placeholder:text-sm leading-[1.5]"
              />
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full min-h-[44px] bg-[#2b6cb0] hover:bg-[#3182ce] text-white font-semibold text-base py-3 px-6 rounded-[12px] transition-all shadow-1 flex items-center justify-center gap-2 leading-none"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Xác nhận thêm vào báo giá</span>
          </button>
        </div>
      </div>
    </div>
  );
}
