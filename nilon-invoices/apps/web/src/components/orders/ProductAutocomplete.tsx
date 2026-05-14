'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Loader2, Package, AlertTriangle, X } from 'lucide-react';
import { useProductSearch } from '@/hooks/useProductSearch';
import type { Product } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductAutocompleteProps {
  value: Product | null;
  onChange: (product: Product | null) => void;
  error?: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function ProductAutocomplete({ value, onChange, error }: ProductAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { query, setQuery, products, isLoading } = useProductSearch(300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [prevProducts, setPrevProducts] = useState(products);
  if (products !== prevProducts) {
    setPrevProducts(products);
    setActiveIndex(-1);
  }

  const handleSelect = (product: Product) => {
    onChange(product);
    setQuery('');
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true);
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, products.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && products[activeIndex]) {
      e.preventDefault();
      handleSelect(products[activeIndex]);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const hasResults = products.length > 0;
  const showDropdown = open && (query.trim().length > 0 || isLoading);

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* Selected state */}
      {value && !open ? (
        <div
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={`flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-all ${error ? 'border-red-300 bg-red-50' : ''}`}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{value.name}</p>
            <p className="text-[10px] text-slate-500">
              {formatPrice(Number(value.price))} • Tồn: {value.stock}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className={`flex items-center gap-2 px-3 py-2.5 bg-white border-2 rounded-xl transition-all ${
            open ? 'border-indigo-400 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
          } ${error ? 'border-red-300' : ''}`}
        >
          {isLoading ? (
            <Loader2 size={16} className="text-indigo-500 animate-spin flex-shrink-0" />
          ) : (
            <Search size={16} className={`flex-shrink-0 ${open ? 'text-indigo-500' : 'text-slate-400'}`} />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tên hoặc mã sản phẩm..."
            className="flex-1 bg-transparent outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1 text-[10px] font-semibold text-red-500 ml-1">{error}</p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[340px]"
          >
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-5 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-semibold">Đang tìm kiếm...</span>
              </div>
            )}

            {!isLoading && !hasResults && query.trim() && (
              <div className="py-6 px-4 text-center">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Package size={18} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-600">Không tìm thấy sản phẩm</p>
                <p className="text-xs text-slate-400 mt-1">Thử tìm với từ khóa khác</p>
              </div>
            )}

            {!isLoading && hasResults && (
              <ul ref={listRef} className="max-h-64 overflow-y-auto py-1.5">
                {products.map((product, idx) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeIndex === idx ? 'bg-indigo-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {product.sku && (
                            <span className="text-[10px] font-semibold text-slate-400">SKU: {product.sku}</span>
                          )}
                          <span
                            className={`flex items-center gap-1 text-[10px] font-bold ${
                              product.stock <= 5 ? 'text-red-500' : product.stock <= 20 ? 'text-amber-500' : 'text-emerald-600'
                            }`}
                          >
                            {product.stock <= 5 && <AlertTriangle size={10} />}
                            Tồn: {product.stock}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-black text-slate-900">{formatPrice(Number(product.price))}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
