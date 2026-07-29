"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import CartWidget from './CartWidget';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bảo hộ lao động', href: '/danh-muc/bao-ho-lao-dong' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Công dụng', href: '/cong-dung' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1a365d] text-white border-b border-[#2b6cb0]/30 shadow-1">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-[12px] bg-[#2b6cb0] flex items-center justify-center font-black text-white text-xl shadow-1 group-hover:bg-[#3182ce] transition-colors">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none uppercase font-heading">
                  NILON <span className="text-[#63b3ed]">LÓT SÀN</span>
                </span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#63b3ed]" /> Cam kết chất lượng
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-3 py-2 text-base font-medium transition-all rounded-[12px] ${
                    isActive 
                      ? 'bg-[#2b6cb0] text-white font-semibold shadow-1' 
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="tel:0931982568" 
              className="bg-[#2b6cb0] hover:bg-[#3182ce] text-white px-5 min-h-[44px] py-2.5 rounded-[12px] text-base font-semibold transition-all flex items-center gap-2 shadow-1 border border-[#63b3ed]/40"
            >
              <Phone className="w-4 h-4 text-blue-100" />
              <span>0931.982.568</span>
            </a>
            <a 
              href="https://zalo.me/0931982568" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white/10 hover:bg-white/20 text-white px-5 min-h-[44px] py-2.5 rounded-[12px] text-base font-semibold transition-all flex items-center gap-2 border border-white/20"
            >
              <MessageSquare className="w-4 h-4 text-[#63b3ed]" />
              <span>Zalo</span>
            </a>
            <div className="pl-2 border-l border-white/20">
              <CartWidget />
            </div>
          </div>

          {/* Mobile menu button & Cart */}
          <div className="flex items-center gap-3 md:hidden">
            <CartWidget />
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-[12px] text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none border border-white/10"
            >
              <span className="sr-only">Mở menu</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/80 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-[12px] text-base font-semibold transition-all ${
                    isActive ? 'bg-[#2b6cb0] text-white' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2 px-2">
              <a 
                href="tel:0931982568" 
                className="w-full bg-[#2b6cb0] hover:bg-[#3182ce] text-white py-3 rounded-[12px] text-center font-bold text-sm flex items-center justify-center gap-2 shadow-1"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline: 0931.982.568</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
