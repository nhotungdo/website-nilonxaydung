'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Loader2, User, Phone, Mail, Crown, UserPlus, X, ChevronDown } from 'lucide-react';
import { useCustomerSearch } from '@/hooks/useCustomerSearch';
import type { Customer } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerAutocompleteProps {
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
  onCreateNew?: () => void;
  error?: string;
}

export function CustomerAutocomplete({
  value,
  onChange,
  onCreateNew,
  error,
}: CustomerAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { query, setQuery, customers, isLoading } = useCustomerSearch(300);
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

  const [prevCustomers, setPrevCustomers] = useState(customers);
  if (customers !== prevCustomers) {
    setPrevCustomers(customers);
    setActiveIndex(-1);
  }

  const handleSelect = (customer: Customer) => {
    onChange(customer);
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
      setActiveIndex((i) => Math.min(i + 1, customers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && customers[activeIndex]) {
      e.preventDefault();
      handleSelect(customers[activeIndex]);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const hasResults = customers.length > 0;
  const showDropdown = open && (query.trim().length > 0 || isLoading);

  return (
    <div ref={containerRef} className="relative">
      {/* Selected state display */}
      {value && !open ? (
        <div
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={`flex items-center gap-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-2xl cursor-pointer group hover:border-blue-300 transition-all ${error ? 'border-red-300 bg-red-50' : ''}`}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{value.name}</p>
            <p className="text-xs text-slate-500 truncate">{value.phone || value.email || 'Không có thông tin liên hệ'}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 rounded-2xl transition-all ${
            open ? 'border-blue-400 bg-white ring-4 ring-blue-500/10' : 'border-slate-100 hover:border-slate-200'
          } ${error ? 'border-red-300' : ''}`}
        >
          {isLoading ? (
            <Loader2 size={18} className="text-blue-500 animate-spin flex-shrink-0" />
          ) : (
            <Search size={18} className={`flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-slate-400'}`} />
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
            placeholder="Nhập tên hoặc số điện thoại khách hàng..."
            className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
          />
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-500 ml-1">{error}</p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-semibold">Đang tìm kiếm...</span>
              </div>
            )}

            {!isLoading && !hasResults && query.trim() && (
              <div className="py-6 px-4 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <User size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-600">Không tìm thấy khách hàng</p>
                <p className="text-xs text-slate-400 mt-1">Thử tìm với từ khóa khác</p>
                {onCreateNew && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onCreateNew();
                    }}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold mx-auto hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus size={16} />
                    + Tạo khách hàng mới
                  </button>
                )}
              </div>
            )}

            {!isLoading && hasResults && (
              <ul ref={listRef} className="max-h-64 overflow-y-auto py-1.5">
                {customers.map((customer, idx) => (
                  <li key={customer.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(customer)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeIndex === idx ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">{customer.name}</span>
                          {customer._count && customer._count.orders >= 5 && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black">
                              <Crown size={10} />
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {customer.phone && (
                            <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                              <Phone size={10} />
                              {customer.phone}
                            </span>
                          )}
                          {customer.email && (
                            <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                              <Mail size={10} />
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Create new option at bottom */}
            {!isLoading && onCreateNew && hasResults && (
              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onCreateNew();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <UserPlus size={16} />
                  + Tạo khách hàng mới
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
