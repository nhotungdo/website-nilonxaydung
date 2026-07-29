"use client";
import { useState } from 'react';
import { X, Send, Phone, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { isValidVnPhone, VN_PHONE_ERROR_MSG } from '@/lib/validations/phone';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function QuickQuoteModal({ isOpen, onClose, productName = "Nilon lót sàn" }: QuickQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    content: `Tôi cần báo giá ${productName}`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate số điện thoại Việt Nam
    if (!isValidVnPhone(formData.phone)) {
      toast.error(VN_PHONE_ERROR_MSG);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: '',
          company: formData.company,
          need: 'Nhận báo giá nhanh',
          message: formData.content
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success !== false) {
        toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.', {
          duration: 5000,
          style: {
            background: '#292524',
            color: '#fff',
            borderRadius: '12px',
          }
        });
        onClose();
      } else {
        throw new Error(resData.message || resData.error || 'Lỗi khi gửi yêu cầu báo giá');
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      toast.error(errMsg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-[12px] shadow-2 w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#1a365d] p-6 text-white relative">
            <span className="text-xs font-extrabold text-[#63b3ed] uppercase tracking-widest block mb-1 font-heading">TƯ VẤN NHANH</span>
            <h3 className="text-xl font-bold font-heading">Nhận báo giá nhanh</h3>
            <p className="text-slate-300 text-sm mt-1 font-sans">Vui lòng để lại thông tin, chúng tôi sẽ phản hồi sau 5-10 phút.</p>
            <button 
              onClick={onClose}
              className="absolute right-5 top-5 text-slate-300 hover:text-white transition-colors p-1.5 rounded-[12px] hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#2b6cb0]" /> Họ tên *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full min-h-[44px] border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all bg-white text-base placeholder:text-sm leading-[1.5]"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#2b6cb0]" /> Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full min-h-[44px] border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all bg-white text-base placeholder:text-sm leading-[1.5]"
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#2b6cb0]" /> Công ty / Đơn vị
                </label>
                <input
                  type="text"
                  className="w-full min-h-[44px] border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all bg-white text-base placeholder:text-sm leading-[1.5]"
                  placeholder="Công ty xây dựng ABC..."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#2b6cb0]" /> Nội dung cần tư vấn *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-[12px] px-4 py-3 outline-none focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20 transition-all resize-none text-base placeholder:text-sm leading-[1.5]"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full min-h-[44px] bg-[#2b6cb0] hover:bg-[#3182ce] disabled:bg-slate-300 text-white font-semibold text-base py-3 px-6 rounded-[12px] transition-all shadow-1 flex items-center justify-center gap-2 group leading-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
                Gửi yêu cầu ngay
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
