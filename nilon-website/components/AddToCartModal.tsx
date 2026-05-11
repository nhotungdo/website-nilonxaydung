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
    toast.success("Đã thêm vào yêu cầu báo giá!", {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#0B2147',
        fontWeight: 'bold'
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-[#0B2147] mb-4 pr-8">Tùy chọn sản phẩm</h3>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                className="object-cover mix-blend-multiply" 
              />
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight mb-1">{product.name}</div>
              <div className="text-sm text-gray-500">Thêm vào danh sách báo giá để nhận chiết khấu tốt nhất.</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Độ dày / Thông số</label>
              <select 
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-white"
              >
                <option value="Phổ thông (2 zem)">Phổ thông (2 zem)</option>
                <option value="Tiêu chuẩn (4 zem)">Tiêu chuẩn (4 zem)</option>
                <option value="Dày (6 zem)">Dày (6 zem)</option>
                <option value="Cực dày (>10 zem)">Cực dày ({">"}10 zem)</option>
                <option value="Theo yêu cầu">Theo yêu cầu / Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kích thước</label>
              <select 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-white"
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng (Cuộn/Kg)</label>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden h-[42px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center font-bold text-gray-800 outline-none"
                    min="1"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú thêm (Không bắt buộc)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Dùng cho công trình nền móng..."
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all resize-none h-20"
              />
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-[#fc6c29] hover:bg-[#e65a1f] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Xác nhận thêm
          </button>
        </div>
      </div>
    </div>
  );
}
