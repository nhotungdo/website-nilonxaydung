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
      <div className="relative p-2 text-gray-600">
        <ShoppingCart className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-white/80 hover:text-white transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">Yêu cầu báo giá ({items.length})</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300 opacity-50" />
                <p>Chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 relative">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-gray-900 truncate mb-1">{item.name}</h5>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div><span className="font-medium">Độ dày:</span> {item.thickness}</div>
                        <div><span className="font-medium">KT:</span> {item.size}</div>
                        <div><span className="font-medium">SL:</span> {item.quantity}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 shrink-0 self-start p-1"
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
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Link 
                href="/bao-gia"
                className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm group"
              >
                Gửi yêu cầu ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
