"use client";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CartWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useCartStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!mounted) {
    return (
      <div className="relative p-2 text-blue-100">
        <ShoppingCart className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-blue-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 flex items-center justify-center"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-black leading-none text-white bg-blue-500 rounded-full border-2 border-[#1E3A8A] shadow-sm">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-heading font-bold text-slate-900 text-sm">Yêu cầu báo giá ({items.length})</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
                <p className="text-sm font-medium">Chưa có sản phẩm nào trong danh sách báo giá.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative border border-slate-200/60">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-slate-900 truncate mb-1">{item.name}</h5>
                      <div className="text-xs text-slate-500 space-y-0.5 font-mono">
                        <div><span className="font-medium text-slate-700">Độ dày:</span> {item.thickness}</div>
                        <div><span className="font-medium text-slate-700">Quy cách:</span> {item.size}</div>
                        <div><span className="font-medium text-slate-700">SL:</span> {item.quantity}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 shrink-0 self-start p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link 
                href="/bao-gia"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 group text-sm"
              >
                Gửi yêu cầu báo giá ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
