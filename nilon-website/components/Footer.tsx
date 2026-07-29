"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import QuickQuoteModal from './QuickQuoteModal';

export default function Footer() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      {/* Action Banner */}
      <div className="bg-[#1a365d] text-white py-12 border-t border-[#2b6cb0]/30">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#1a365d] to-[#0f2847] p-8 rounded-[12px] border border-[#63b3ed]/30 shadow-2">
            <div>
              <div className="flex items-center gap-2 text-[#63b3ed] text-sm font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-[#63b3ed]" /> TƯ VẤN KỸ THUẬT CÔNG TRÌNH
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading leading-[1.2]">
                Bạn cần báo giá & tư vấn quy cách nilon?
              </h2>
              <p className="text-slate-300 text-base max-w-xl leading-[1.6]">
                Đội ngũ kỹ sư của chúng tôi sẵn sàng hỗ trợ bạn lựa chọn độ dày 2zem, 4zem, 6zem tối ưu chi phí nhất.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="min-h-[44px] bg-[#2b6cb0] hover:bg-[#3182ce] text-white font-semibold text-base py-3 px-6 rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-1 border border-[#63b3ed]/30 leading-none"
              >
                <Send className="w-4 h-4" />
                <span>Nhận báo giá ngay</span>
              </button>
              <Link 
                href="/danh-muc/bao-ho-lao-dong" 
                className="min-h-[44px] bg-white/10 hover:bg-white/20 text-white font-semibold text-base py-3 px-6 rounded-[12px] transition-all flex items-center justify-center gap-2 border border-white/20 leading-none"
              >
                <span>Xem sản phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <QuickQuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        key={isQuoteModalOpen ? 'open' : 'closed'}
      />

      {/* Main Footer */}
      <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-[12px] bg-[#2b6cb0] flex items-center justify-center font-black text-white text-lg">
                  N
                </div>
                <span className="text-lg font-black text-white tracking-tight uppercase font-heading">
                  NILON <span className="text-[#63b3ed]">LÓT SÀN</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Đơn vị cung cấp giải pháp vật liệu xây dựng và nilon lót sàn bê tông hàng đầu Việt Nam. Đảm bảo chất lượng, giao hàng tận công trình.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-9 h-9 rounded-[12px] bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-[#2b6cb0] hover:text-white hover:border-[#2b6cb0] transition-colors text-slate-300 font-bold">
                  f
                </a>
                <a href="#" className="w-9 h-9 rounded-[12px] bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-[#2b6cb0] hover:text-white hover:border-[#2b6cb0] transition-colors text-slate-300 font-bold">
                  in
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-xs font-bold text-[#63b3ed] mb-6 uppercase tracking-widest font-heading">SẢN PHẨM CHÍNH</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/danh-muc/nilon-lot-san-be-tong" className="hover:text-[#63b3ed] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-slate-500" /> Nilon lót nền bê tông 2zem-6zem</Link></li>
                <li><Link href="/danh-muc/nilon-lot-san-be-tong" className="hover:text-[#63b3ed] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-slate-500" /> Nilon chống thấm PE công trình</Link></li>
                <li><Link href="/danh-muc/nilon-lot-san-be-tong" className="hover:text-[#63b3ed] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-slate-500" /> Màng phủ nông nghiệp & nhà kính</Link></li>
                <li><Link href="/danh-muc/bao-ho-lao-dong" className="hover:text-[#63b3ed] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-slate-500" /> Trang thiết bị bảo hộ lao động</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-xs font-bold text-[#63b3ed] mb-6 uppercase tracking-widest font-heading">CHÍNH SÁCH & THÔNG TIN</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/ve-chung-toi" className="hover:text-[#63b3ed] transition-colors">Về chúng tôi</Link></li>
                <li><Link href="/chinh-sach-bao-mat" className="hover:text-[#63b3ed] transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="/dich-vu" className="hover:text-[#63b3ed] transition-colors">Dịch vụ & Vận chuyển</Link></li>
                <li><Link href="/bao-gia" className="hover:text-[#63b3ed] transition-colors">Bảng báo giá tổng hợp</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-xs font-bold text-[#63b3ed] mb-6 uppercase tracking-widest font-heading">THÔNG TIN LIÊN HỆ</h3>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#63b3ed] shrink-0 mt-0.5" />
                  <a href="https://maps.app.goo.gl/yfYGDKv1KsiDEbSQ7" target="_blank" rel="noopener noreferrer" className="hover:text-[#63b3ed] transition-colors">
                    Châu Ninh, Khoái Châu, Hưng Yên, Việt Nam
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#63b3ed] shrink-0" />
                  <span className="font-semibold text-white">0931.982.568</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#63b3ed] shrink-0" />
                  <span>contact@vatlieuxaydung.vn</span>
                </li>
              </ul>
              
              <div className="mt-5 rounded-[12px] overflow-hidden border border-slate-700 shadow-1 opacity-90 hover:opacity-100 transition-opacity">
                <iframe 
                  width="100%" 
                  height="140" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  src="https://maps.google.com/maps?q=Ch%C3%A2u%20Ninh,%20Kho%C3%A1i%20Ch%C3%A2u,%20H%C6%B0ng%20Y%C3%AAn,%20Vi%E1%BB%87t%20Nam&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  title="Bản đồ địa chỉ xưởng"
                ></iframe>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            <p>&copy; 2026 NILON LÓT SÀN VIỆT NAM. Tất cả các quyền được bảo lưu. Tokenized DesignUI Architecture.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
