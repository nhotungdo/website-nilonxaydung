"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, Truck, Send, CheckCircle2, Zap } from 'lucide-react';
import { isValidVnPhone, VN_PHONE_ERROR_MSG } from '@/lib/validations/phone';

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate số điện thoại Việt Nam
    if (!isValidVnPhone(formData.phone)) {
      toast.error(VN_PHONE_ERROR_MSG);
      return;
    }

    setIsSubmitting(true);
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          need: 'Báo giá nhanh tại trang chủ'
        }),
      });

      if (response.ok) {
        setStatus('success');
        toast.success('Yêu cầu báo giá đã được gửi!');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        setStatus('error');
        toast.error('Gửi thất bại, vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-[#1a365d] text-white overflow-hidden py-16 lg:py-24 border-b border-[#2b6cb0]/30">
      {/* Modern Industrial Grid & Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#2b6cb0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Content */}
          <div className="w-full lg:w-[55%]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2b6cb0]/30 border border-[#63b3ed]/40 text-[#63b3ed] font-semibold text-sm rounded-[12px] mb-6 uppercase tracking-wider backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#63b3ed]" /> Nhà Máy Sản Xuất Nilon Công Trình
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mb-6 leading-[1.2] tracking-tight font-heading">
              Bảng Giá Nilon Lót Sàn <span className="text-[#63b3ed]">Bê Tông</span> 2026
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-[1.6] font-sans font-normal">
              Cung cấp nilon lót sàn PE đa dạng độ dày <strong className="text-white font-semibold">2zem, 4zem, 6zem</strong> cho các dự án nhà xưởng, cầu đường và hạ tầng. Đảm bảo chất lượng tiêu chuẩn, giao hàng tận nơi.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/10 border border-white/15 rounded-[12px] px-5 py-3.5 backdrop-blur-md shadow-1">
                <ShieldCheck className="w-6 h-6 text-[#63b3ed] mr-3 shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm font-heading">Cam kết chất lượng</div>
                  <div className="text-slate-300 text-xs">Cam kết độ dày chuẩn 100%</div>
                </div>
              </div>
              <div className="flex items-center bg-white/10 border border-white/15 rounded-[12px] px-5 py-3.5 backdrop-blur-md shadow-1">
                <Truck className="w-6 h-6 text-[#63b3ed] mr-3 shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm font-heading">Giao hàng 24/7</div>
                  <div className="text-slate-300 text-xs">Vận chuyển tận công trình</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="w-full lg:w-[45%]">
            <div className="bg-white text-slate-900 rounded-[12px] shadow-2 p-6 sm:p-8 border border-slate-200/80 relative">
              <div className="text-center mb-6">
                <span className="text-xs font-semibold text-[#2b6cb0] uppercase tracking-widest block mb-1">TƯ VẤN BÁO GIÁ NHANH</span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading leading-[1.2]">Yêu Cầu Báo Giá Tận Gốc</h3>
              </div>

              {status === 'success' ? (
                <div className="bg-emerald-50 text-emerald-800 p-6 rounded-[12px] border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-semibold font-heading">Gửi yêu cầu thành công!</h3>
                  <p className="text-base leading-[1.6]">Chúng tôi đã nhận được thông tin và sẽ phản hồi báo giá trong vòng 15 phút.</p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="mt-2 text-sm text-emerald-700 font-semibold underline hover:text-emerald-900"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider">Họ và tên *</label>
                    <input 
                      type="text" 
                      placeholder="Nhập họ tên của bạn" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full min-h-[44px] px-4 py-3 rounded-[12px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] transition-all text-base placeholder:text-sm leading-[1.5]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      placeholder="Ví dụ: 0931982568" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full min-h-[44px] px-4 py-3 rounded-[12px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] transition-all text-base placeholder:text-sm leading-[1.5]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider">Email (Không bắt buộc)</label>
                    <input 
                      type="email" 
                      placeholder="Ví dụ: email@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full min-h-[44px] px-4 py-3 rounded-[12px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] transition-all text-base placeholder:text-sm leading-[1.5]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider">Loại Nilon & Số lượng cuộn</label>
                    <textarea 
                      rows={2} 
                      placeholder="Ví dụ: Nilon 4zem, số lượng 50 cuộn cho dự án Quận 2" 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full min-h-[80px] px-4 py-3 rounded-[12px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] transition-all text-base placeholder:text-sm resize-none leading-[1.5]"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] bg-[#2b6cb0] hover:bg-[#3182ce] text-white font-semibold text-base py-3 px-6 rounded-[12px] transition-all shadow-1 disabled:opacity-70 flex items-center justify-center gap-2 leading-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>ĐANG GỬI...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>NHẬN BÁO GIÁ NGAY</span>
                      </>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center font-medium">Đã có lỗi xảy ra, vui lòng kiểm tra lại.</p>
                  )}
                  <p className="text-center text-xs text-slate-500 pt-1">Phản hồi nhanh trong 15 phút làm việc</p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
