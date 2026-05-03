import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* Action Banner */}
      <div className="bg-[#003876] text-white py-12">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Bạn cần tư vấn kỹ thuật trực tiếp?</h2>
              <p className="text-blue-200">Đội ngũ kỹ sư của chúng tôi sẵn sàng hỗ trợ bạn lựa chọn độ dày phù hợp nhất.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#a63b00] hover:bg-[#fc6c29] text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                Nhận báo giá ngay
              </button>
              <Link href="/danh-muc/bao-ho-lao-dong" className="bg-white text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition-colors inline-block text-center">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-primary text-white pt-16 pb-8 border-t border-blue-900">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

            {/* Column 1 */}
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide">VẬT LIỆU XÂY DỰNG</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Đơn vị cung cấp giải pháp vật liệu xây dựng và nilon lót sàn hàng đầu Việt Nam. Chất lượng khẳng định thương hiệu.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                  f
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                  in
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-6 uppercase">SẢN PHẨM CHÍNH</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Nilon lót nền bê tông</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Nilon chống thấm PE</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Màng phủ nông nghiệp</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Vật liệu bảo hộ</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-6 uppercase">CHÍNH SÁCH</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/ve-chung-toi" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="/chung-chi-iso" className="hover:text-white transition-colors">Chứng chỉ ISO</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-6 uppercase">LIÊN HỆ</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  <a href="https://maps.app.goo.gl/yfYGDKv1KsiDEbSQ7" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    Châu Ninh, Khoái Châu, Hưng Yên, Việt Nam
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                  <span>0931.982.568</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  <span>contact@vatlieuxaydung.vn</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-blue-900 pt-8 text-center text-sm text-blue-200">
            <p>&copy; 2026 Nilon lót sàn Việt Nam. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
