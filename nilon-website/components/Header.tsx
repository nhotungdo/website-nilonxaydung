"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Công dụng', href: '/cong-dung' },
    { name: 'Bảo hộ lao động', href: '/danh-muc/bao-ho-lao-dong' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-extrabold text-primary tracking-tight">
              NILON lót sàn Việt
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-2 py-2 text-sm transition-colors ${
                    isActive 
                      ? 'text-primary font-bold border-b-2 border-primary' 
                      : 'text-gray-600 font-semibold hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:0901234567" className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Gọi: 090xxxxxxx
            </a>
            <a href="https://zalo.me/0901234567" target="_blank" rel="noopener noreferrer" className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-md text-sm font-bold transition-colors">
              Zalo
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
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
