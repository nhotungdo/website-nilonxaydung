'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', content: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-gray-600">
              Hãy để lại thông tin, chúng tôi sẽ liên hệ lại tư vấn và báo giá trong thời gian sớm nhất.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Info */}
              <div className="bg-blue-600 p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-6">Thông Tin Liên Hệ</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📍</span>
                    <div>
                      <h3 className="font-semibold mb-1">Địa Chỉ</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">123 Đường Công Trình, Quận Xây Dựng, TP. HCM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📞</span>
                    <div>
                      <h3 className="font-semibold mb-1">Hotline</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">090.123.4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">✉️</span>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">info@nilonxaydung.vn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Yêu Cầu</h2>
                
                {status === 'success' ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
                    Cảm ơn bạn! Yêu cầu đã được gửi thành công. Chúng tôi sẽ sớm liên hệ lại.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ Tên</label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Nội Dung Yêu Cầu (Sản phẩm, số lượng...)</label>
                      <textarea
                        id="content"
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-70"
                    >
                      {status === 'loading' ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                    </button>
                    {status === 'error' && (
                      <p className="text-red-600 text-sm mt-2 text-center">Có lỗi xảy ra, vui lòng thử lại sau.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
