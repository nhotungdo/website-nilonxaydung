import React from 'react';
import { HelpCircle, Mail, PhoneCall, MessageCircle, ExternalLink, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const faqs = [
    {
      q: 'Tại sao máy in không nhận lệnh?',
      a: 'Vui lòng kiểm tra cáp kết nối USB/LAN. Hãy đảm bảo máy in đã được bật nguồn và còn giấy in. Sau đó, vào phần "Cài đặt máy in" để kiểm tra trạng thái kết nối.'
    },
    {
      q: 'Tôi muốn in lại hóa đơn thì làm thế nào?',
      a: 'Bạn có thể vào tab "Đơn hàng realtime" hoặc "Lịch sử đơn hàng", tìm kiếm mã đơn và nhấn vào biểu tượng máy in để gửi lại lệnh.'
    },
    {
      q: 'Lỗi "Printer offline" là gì?',
      a: 'Đây là lỗi phổ biến khi máy tính không thể giao tiếp với máy in. Hãy thử rút cáp USB ra cắm lại, khởi động lại ứng dụng hoặc cập nhật driver máy in.'
    },
    {
      q: 'Làm sao để đổi kích thước giấy in sang K58 hoặc K80?',
      a: 'Vào phần "Cài đặt máy in", chọn máy in mặc định và chọn kích thước giấy tương ứng (K58 - 58mm hoặc K80 - 80mm).'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#005B52] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#005B52]/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          Hỗ trợ khách hàng
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contact Methods */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-[#005B52] rounded-2xl p-6 text-white shadow-xl shadow-[#005B52]/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-emerald-400/20 rotate-12 pointer-events-none">
              <PhoneCall className="w-32 h-32" />
            </div>
            
            <h2 className="text-lg font-bold mb-1 relative z-10">Cần hỗ trợ gấp?</h2>
            <p className="text-emerald-100 text-[13px] mb-6 relative z-10">Bộ phận kỹ thuật hoạt động 24/7 để xử lý các sự cố khẩn cấp.</p>
            
            <div className="space-y-4 relative z-10">
              <a href="tel:0901234567" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors backdrop-blur-sm">
                <PhoneCall className="h-5 w-5 text-emerald-300" />
                <div>
                  <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Hotline Kỹ thuật</div>
                  <div className="text-lg font-black tracking-wider">090 123 4567</div>
                </div>
              </a>

              <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#0068FF] hover:bg-[#0054D6] px-4 py-3 rounded-xl transition-colors shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
                <div>
                  <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Zalo Support</div>
                  <div className="text-sm font-black">Chat với Kỹ thuật viên</div>
                </div>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              Thông tin Email
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Lỗi hệ thống / Bugs</p>
                <a href="mailto:support@nilonxaydung.vn" className="text-[13px] font-bold text-[#005B52] hover:underline">support@nilonxaydung.vn</a>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Kinh doanh / Mở rộng</p>
                <a href="mailto:sales@nilonxaydung.vn" className="text-[13px] font-bold text-[#005B52] hover:underline">sales@nilonxaydung.vn</a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: FAQ & Documentation */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Câu hỏi thường gặp (FAQ)
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <h4 className="text-[13px] font-bold text-slate-800 flex items-start gap-2 mb-2">
                    <span className="text-[#005B52] font-black shrink-0">Q:</span>
                    {faq.q}
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-600 font-black shrink-0">A:</span>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col items-start">
              <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-3">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="text-[13px] font-bold text-amber-900 mb-1">Gửi báo cáo lỗi tự động</h3>
              <p className="text-[11px] text-amber-700/80 mb-4 leading-relaxed flex-1">
                Ứng dụng của chúng tôi sẽ tự động thu thập nhật ký in và gửi về hệ thống khi gặp sự cố, để chúng tôi khắc phục nhanh hơn.
              </p>
              <button className="text-[11px] font-bold text-amber-800 hover:text-amber-600 underline underline-offset-2">Xem nhật ký lỗi</button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col items-start">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-[13px] font-bold text-blue-900 mb-1">Cập nhật phần mềm</h3>
              <p className="text-[11px] text-blue-700/80 mb-4 leading-relaxed flex-1">
                Phiên bản hiện tại: <strong className="text-blue-800 font-black font-mono">v1.2.4</strong>. Bạn đang sử dụng bản mới nhất với các cải tiến về tốc độ in qua cổng LAN.
              </p>
              <button className="text-[11px] font-bold text-blue-800 hover:text-blue-600 underline underline-offset-2">Kiểm tra bản cập nhật mới</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
