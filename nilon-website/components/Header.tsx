"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CartWidget from './CartWidget';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Dự toán AI', href: '/du-toan-vat-tu', isSpecial: true },
    { name: 'Bảo hộ lao động', href: '/danh-muc/bao-ho-lao-dong' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Công dụng', href: '/cong-dung' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200/80 shadow-sm">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20 gap-3">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] flex items-center justify-center font-black text-white text-xl lg:text-2xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-black text-[#1a365d] tracking-tight leading-none uppercase font-heading whitespace-nowrap">
                  NILON <span className="text-[#2b6cb0]">LÓT SÀN</span>
                </span>
                <span className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1 mt-0.5 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" /> Cam kết chất lượng
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (Visible on lg: 1024px+) */}
          <nav className="hidden lg:flex gap-1 xl:gap-2.5 items-center shrink-0 flex-nowrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-3 py-2 text-xs xl:text-sm font-bold transition-all rounded-xl flex items-center gap-1.5 whitespace-nowrap ${
                    link.isSpecial 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white shadow-sm hover:shadow-md hover:brightness-110 active:scale-95'
                      : isActive 
                        ? 'bg-[#1a365d] text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#1a365d]'
                  }`}
                >
                  {link.isSpecial && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <a 
              href="tel:0931982568" 
              className="bg-[#1a365d] hover:bg-[#2b6cb0] text-white px-3.5 py-2.5 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>0931.982.568</span>
            </a>
            <a 
              href="https://zalo.me/0931982568" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-50 hover:bg-blue-100 text-[#2b6cb0] border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#2b6cb0] shrink-0" />
              <span>Zalo</span>
            </a>
            <div className="pl-1 border-l border-slate-200">
              <CartWidget />
            </div>
          </div>

          {/* Mobile & Tablet Action Section (< 1024px) */}
          <div className="flex items-center gap-2.5 lg:hidden shrink-0">
            <CartWidget />
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none border border-slate-200"
              aria-label="Mở menu điều hướng"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-1.5 bg-white rounded-b-2xl shadow-xl px-2 max-h-[calc(100vh-64px)] overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    link.isSpecial
                      ? 'bg-gradient-to-r from-blue-600 to-amber-500 text-white'
                      : isActive 
                        ? 'bg-[#1a365d] text-white' 
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.isSpecial && <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 px-2">
              <a 
                href="tel:0931982568" 
                className="w-full bg-[#1a365d] hover:bg-[#2b6cb0] text-white py-3 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Hotline: 0931.982.568</span>
              </a>
              <a 
                href="https://zalo.me/0931982568" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#2b6cb0] border border-blue-200 py-3 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#2b6cb0]" />
                <span>Chat Zalo Báo Giá</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
