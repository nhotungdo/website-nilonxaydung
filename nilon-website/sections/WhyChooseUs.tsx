export default function WhyChooseUs() {
  const specs = [
    { label: 'Chất liệu', value: 'Nilon PE nguyên sinh / tái sinh', status: 'Sẵn hàng' },
    { label: 'Khổ rộng', value: '1m, 2m, 3m, 4m, 6m (khổ trải)', status: 'Sẵn hàng' },
    { label: 'Chiều dài cuộn', value: '50m - 100m (tùy yêu cầu)', status: 'Sẵn hàng' },
    { label: 'Độ dày thực tế', value: 'Dung sai ± 5%', status: 'Sẵn hàng' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-10">Thông số kỹ thuật tiêu chuẩn</h2>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Table */}
          <div className="w-full lg:w-1/2">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-primary text-white grid grid-cols-3 p-4 font-bold text-sm">
                <div className="col-span-1">Đặc tính</div>
                <div className="col-span-1">Quy cách</div>
                <div className="col-span-1 text-right">Trạng thái</div>
              </div>
              <div className="divide-y divide-gray-100">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-3 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 font-semibold text-gray-700 text-sm">{spec.label}</div>
                    <div className="col-span-1 text-gray-600 text-sm">{spec.value}</div>
                    <div className="col-span-1 text-right flex justify-end">
                      <span className="inline-block bg-[#eaf8f0] text-[#1f8c56] px-3 py-1 rounded-full text-xs font-bold">
                        {spec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Images */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-1/2 rounded-xl overflow-hidden shadow-md h-64">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356db4?q=80&w=2070&auto=format&fit=crop" alt="Safe work" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-[#fc6c29] text-white font-extrabold px-6 py-3 rounded-md border-2 border-white transform -rotate-6 text-xl tracking-wider">
                  SAFE FOR WORK
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-full sm:w-1/2">
              <div className="bg-primary text-white rounded-xl overflow-hidden shadow-md h-36 flex flex-col items-center justify-center relative">
                <svg className="w-16 h-16 text-yellow-400 mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                <div className="font-bold">Safe work</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-5 flex items-center gap-4 flex-grow">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary">500+</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Công trình đã cấp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
