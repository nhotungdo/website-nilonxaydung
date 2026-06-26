"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartWidget from './CartWidget';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bảo hộ lao động', href: '/danh-muc/bao-ho-lao-dong' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Công dụng', href: '/cong-dung' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary-container shadow-md">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center -ml-4 lg:-ml-20 xl:-ml-32">
            <Link href="/" className="text-xl font-extrabold text-white tracking-tight">
              NILON lót sàn Việt
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-5 xl:gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-2 py-2 text-sm transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'text-white font-bold border-b-2 border-secondary' 
                      : 'text-white/80 font-semibold hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:0931982568" className="bg-secondary hover:bg-secondary-container text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Gọi: 0931.982.568
            </a>
            <a href="https://zalo.me/0931982568" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.047 3.01C7.82 3.01 4.388 5.432 4.388 8.42c0 1.636.945 3.093 2.417 4.103-.13.475-.465 1.705-.533 1.956-.1.353.116.34.243.257.1-.065 1.595-1.077 2.228-1.51.433.125.885.19 1.348.19 4.228 0 7.659-2.422 7.659-5.41 0-2.988-3.431-5.41-7.659-5.41l-.046-.006zm3.327 7.91l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.327-1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.328 1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002z" />
              </svg>
              Zalo
            </a>
            <div className="pl-2 border-l border-white/20">
              <CartWidget />
            </div>
          </div>

          {/* Mobile menu button & Cart */}
          <div className="flex items-center gap-4 md:hidden">
            <CartWidget />
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none">
              <span className="sr-only">Mở menu</span>
              {/* Icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
