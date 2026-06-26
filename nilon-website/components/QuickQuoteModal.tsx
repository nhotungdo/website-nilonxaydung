"use client";
import { useState } from 'react';
import { X, Send, Phone, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
          company: formData.company,
          message: formData.content
        }),
      });

      if (response.ok) {
        toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.', {
          duration: 5000,
          style: {
            background: '#0B2147',
            color: '#fff',
            borderRadius: '10px',
          }
        });
        onClose();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0B2147] p-6 text-white relative">
            <h3 className="text-xl font-bold">Nhận báo giá nhanh</h3>
            <p className="text-blue-100 text-sm mt-1">Vui lòng để lại thông tin, chúng tôi sẽ phản hồi sau 5-10 phút.</p>
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 text-blue-200 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#fc6c29]" /> Họ tên *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#fc6c29]" /> Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all"
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#fc6c29]" /> Công ty / Đơn vị
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all"
                  placeholder="Công ty xây dựng ABC..."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#fc6c29]" /> Nội dung cần tư vấn *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#fc6c29] hover:bg-[#e65a1f] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
