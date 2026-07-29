import Image from "next/image";
import { ShieldCheck, Building2, Ruler, CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const specs = [
    { label: 'Chất liệu PE', value: 'Nilon PE nguyên sinh / tái sinh cao cấp', status: 'Sẵn hàng' },
    { label: 'Khổ rộng cuộn', value: '1m, 2m, 3m, 4m, 6m (khổ gấp / trải)', status: 'Sẵn hàng' },
    { label: 'Chiều dài cuộn', value: '50m - 100m (sản xuất theo yêu cầu)', status: 'Sẵn hàng' },
    { label: 'Dung sai độ dày', value: 'Chuẩn ± 5% (Đạt tiêu chuẩn kỹ thuật)', status: 'Sẵn hàng' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-semibold text-[#2b6cb0] uppercase tracking-widest block mb-2 font-heading">TIÊU CHUẨN KỸ THUẬT</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading leading-[1.2]">Thông Số Kỹ Thuật Nilon Công Trình</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          {/* Left: Table */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="border border-slate-200 rounded-[12px] overflow-hidden shadow-1 flex-grow bg-white">
              <div className="bg-[#1a365d] text-white grid grid-cols-3 p-4 font-semibold text-base font-heading leading-[1.2]">
                <div className="col-span-1 flex items-center gap-1.5"><Ruler className="w-4 h-4 text-[#63b3ed]" /> Đặc tính</div>
                <div className="col-span-1">Quy cách tiêu chuẩn</div>
                <div className="col-span-1 text-right">Trạng thái</div>
              </div>
              <div className="divide-y divide-slate-100 font-sans">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-3 p-4.5 items-center hover:bg-[#f4f9fc] transition-colors">
                    <div className="col-span-1 font-semibold text-slate-800 text-base">{spec.label}</div>
                    <div className="col-span-1 text-slate-600 text-base font-normal">{spec.value}</div>
                    <div className="col-span-1 text-right flex justify-end">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {spec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Images & Stats */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-1/2 rounded-[12px] overflow-hidden shadow-1 h-64 sm:h-auto border border-slate-200">
              <Image 
                src="https://images.unsplash.com/photo-1504307651254-35680f356db4?q=80&w=2070&auto=format&fit=crop" 
                alt="Safe work" 
                fill
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center p-4">
                <div className="bg-[#2b6cb0]/90 backdrop-blur-md text-white font-bold px-6 py-3 rounded-[12px] border border-[#63b3ed]/50 transform -rotate-3 text-lg tracking-wider font-heading shadow-2">
                  CAM KẾT CHẤT LƯỢNG
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-full sm:w-1/2">
              <div className="bg-[#1a365d] text-white rounded-[12px] p-6 shadow-1 border border-[#2b6cb0]/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-12 h-12 rounded-[12px] bg-[#2b6cb0]/40 border border-[#63b3ed]/30 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-[#63b3ed]" />
                </div>
                <div className="font-heading font-semibold text-xl text-white leading-[1.2]">An Toàn Công Trình</div>
                <p className="text-slate-300 text-sm mt-2 leading-[1.6]">Đạt chứng nhận kiểm định chất lượng màng phủ PE</p>
              </div>
              
              <div className="bg-white rounded-[12px] shadow-1 border border-slate-200 p-6 flex items-center gap-4 flex-grow">
                <div className="w-14 h-14 bg-[#f4f9fc] rounded-[12px] border border-[#2b6cb0]/20 flex items-center justify-center text-[#2b6cb0] shrink-0">
                  <Building2 className="w-7 h-7 stroke-1.5" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1a365d] font-heading leading-[1.2]">500+</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Dự án lớn nhỏ đã cung cấp</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
