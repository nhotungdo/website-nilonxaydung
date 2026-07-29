import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import AiMaterialEstimator from '@/components/AiMaterialEstimator';
import { Sparkles, HelpCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Công Cụ AI Dự Toán Vật Tư Nilon Lót Sàn & Màng PE Xây Dựng | NilonXayDung.vn',
  description: 'Tính toán chính xác quy cách nilon lót sàn bê tông (2zem - 10zem), khối lượng kg, số cuộn và dự toán chi phí tự động bằng công nghệ AI Groq Llama-3.1 8B Instant.',
  keywords: ['ai dự toán nilon', 'tính nilon lót sàn bê tông', 'định mức màng PE', 'báo giá nilon lót sàn', 'nilon xây dựng'],
};

export default function DuToanVatTuPage() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Dự toán AI vật tư', href: '/du-toan-vat-tu' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Hero Header */}
        <div className="text-center mt-6 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Công Nghệ AI Thế Hệ Mới</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#1a365d] mb-4">
            Dự Toán Vật Tư Nilon Bằng <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">Trí Tuệ Nhân Tạo</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Giải quyết bài toán hao hụt vật tư & chọn đúng độ dày nilon lót sàn bê tông cho công trình của bạn chỉ trong dưới 1 giây.
          </p>
        </div>

        {/* Main AI Tool Component */}
        <AiMaterialEstimator />

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1a365d] mb-2">Tính Toán Siêu Tốc</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mô hình AI Groq Llama-3.1 8B Instant phản hồi định mức công trình trong dưới 1 giây với độ chính xác cao.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1a365d] mb-2">Chuẩn Định Mức Ngành</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tính toán hệ số gối mí 10-15%, tỷ trọng nhựa PE 0.93 kg/dm³ giúp tránh lãng phí vật tư thừa thiếu tại công trình.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#1a365d] mb-2">Báo Giá Tận Gốc</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dự toán chi phí minh bạch trực tiếp từ nhà máy sản xuất nilon lót sàn bê tông hàng đầu Việt Nam.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm mt-12">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold font-heading text-[#1a365d]">Câu Hỏi Thường Gặp Về Định Mức Nilon Lót Sàn</h2>
          </div>

          <div className="space-y-6 text-sm">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1a365d] mb-2">
                1. Đổ bê tông lót sàn nên dùng nilon độ dày bao nhiêu zem?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Thông thường với sàn dân dụng, nilon lót 2zem - 4zem (0.02 - 0.04mm) là đủ để chống mất nước xi măng. Đối với sàn nhà xưởng chịu tải trọng lớn, móng cầu đường nên dùng 4zem - 6zem hoặc 10zem để chống rách khi công nhân di chuyển và buộc thép.
              </p>
            </div>

            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1a365d] mb-2">
                2. Tại sao phải cộng thêm hệ số hao hụt gối mí 10 - 15%?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Khi trải nilon lót sàn, các dải nilon phải chồng đè lên nhau từ 15cm đến 20cm để nước xi măng không bị thấm xuống đất. Ngoài ra còn có góc chéo và chân cột, do đó cần cộng thêm 10-15% diện tích để không bị thiếu hụt.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1a365d] mb-2">
                3. 1 cuộn nilon lót sàn bê tông nặng bao nhiêu kg?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Quy cách chuẩn nhà máy đóng gói 1 cuộn nilon là 50 kg/cuộn (khổ gập 1.4m xòe 2.8m hoặc khổ 2m xòe 4m). Khách hàng có thể đặt gia công cắt cuộn nhỏ hơn theo yêu cầu công trình.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
