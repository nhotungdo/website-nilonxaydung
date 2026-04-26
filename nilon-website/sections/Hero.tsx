export default function Hero() {
  return (
    <section className="relative bg-[#001838] overflow-hidden py-20 lg:py-28">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')" }}
        />
      </div>
      
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%]">
            <span className="inline-block px-3 py-1 bg-secondary-container text-white font-bold text-xs rounded mb-6 uppercase tracking-wider">
              Báo giá trực tiếp 2024
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Bảng Giá Nilon Lót Sàn Công Trình
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
              Cung cấp nilon lót sàn đa dạng độ dày 2zem, 3zem, 5zem cho các dự án xây dựng, cầu đường và hạ tầng. Đảm bảo chất lượng tiêu chuẩn ISO, giao hàng tận công trình.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-[#00234e]/80 border border-blue-800/50 rounded-md px-4 py-2.5 backdrop-blur-sm">
                <svg className="w-5 h-5 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span className="text-white font-semibold text-sm">Tiêu chuẩn ISO</span>
              </div>
              <div className="flex items-center bg-[#00234e]/80 border border-blue-800/50 rounded-md px-4 py-2.5 backdrop-blur-sm">
                <svg className="w-5 h-5 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.968a2 2 0 011.536.721l2.4 3.2A2 2 0 0118 14.52V16a1 1 0 001-1v-2.28a4 4 0 00-1.233-2.88L15.34 7.42A2 2 0 0013.926 7H11V5a1 1 0 00-1-1H3z" /></svg>
                <span className="text-white font-semibold text-sm">Giao hàng 24/7</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="w-full lg:w-[45%]">
            <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">Yêu cầu báo giá nhanh</h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                  <input type="text" placeholder="Nhập họ và tên của bạn" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                  <input type="tel" placeholder="Ví dụ: 0912345678" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Loại Nilon & Số lượng</label>
                  <textarea rows={3} placeholder="Ví dụ: Nilon 3zem, số lượng 50 cuộn cho công trình Quận 2" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
                </div>
                <button type="button" className="w-full bg-secondary-container hover:bg-[#e65a1f] text-white font-bold text-lg py-4 rounded-md transition-colors shadow-lg shadow-orange-500/30">
                  NHẬN BÁO GIÁ NGAY
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">Cam kết phản hồi trong vòng 15 phút làm việc</p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
