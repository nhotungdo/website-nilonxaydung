"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { slideUp, staggerContainer } from '@/lib/animations';
import { 
  MapPin, Phone, MessageCircle, Mail, 
  Clock, Headset, Package, ShieldCheck, Truck,
  ChevronDown
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    need: '',
    content: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', need: '', content: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  const contactCards = [
    { icon: <MapPin className="w-6 h-6 text-primary" />, title: "Địa chỉ", desc: "Châu Ninh, Khoái Châu, Hưng Yên, Việt Nam" },
    { icon: <Phone className="w-6 h-6 text-primary" />, title: "Hotline", desc: "0931.982.568" },
    { icon: <MessageCircle className="w-6 h-6 text-primary" />, title: "Zalo", desc: "Nhắn tin nhận báo giá nhanh chóng qua Zalo OA" },
    { icon: <Mail className="w-6 h-6 text-primary" />, title: "Email", desc: "baogia@nilonlotsan.vn\ninfo@nilonlotsan.vn" },
  ];

  const reasons = [
    { icon: <Clock className="w-8 h-8 text-white" />, title: "Báo giá nhanh", desc: "Tối ưu quy trình xử lý đơn hàng, giúp nhà thầu kịp tiến độ đấu thầu và thi công." },
    { icon: <Headset className="w-8 h-8 text-white" />, title: "Tư vấn miễn phí", desc: "Tính toán định mức nilon cần dùng dựa trên diện tích sàn công trình thực tế." },
    { icon: <Package className="w-8 h-8 text-white" />, title: "Hàng sẵn tại kho", desc: "Đa dạng độ dày (0.05mm - 2mm). Khổ rộng từ 1m - 6m luôn có sẵn số lượng lớn." },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-gray-900 flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?q=80&w=2070&auto=format&fit=crop" 
            alt="Warehouse" 
            fill
            className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
        </div>
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6"
            >
              Liên hệ với chúng tôi
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-lg mb-8 leading-relaxed"
            >
              Tư vấn kỹ thuật và báo giá nhanh trong 10 phút. Đội ngũ chuyên gia sẵn sàng hỗ trợ giải pháp nilon lót sàn tối ưu cho công trình của bạn.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a href="tel:0931982568" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg flex items-center gap-2">
                <Phone className="w-5 h-5" /> Gọi ngay: 0931 982 568
              </a>
              <Link href="/" className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-md font-bold transition-all flex items-center gap-2">
                <Mail className="w-5 h-5" /> Nhận báo giá
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards - Overlapping Hero */}
      <section className="relative z-20 -mt-20 pb-20">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Trust Section */}
      <section id="form" className="py-16 bg-gray-50">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left: Form */}
            <motion.div 
              className="lg:w-5/12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Yêu cầu tư vấn & báo giá</h2>
              
              {status === 'success' ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-lg border border-green-200 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gửi thành công!</h3>
                  <p>Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại trong vòng 10 phút.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="0931 xxx xxx"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="need" className="block text-sm font-semibold text-gray-700 mb-2">Nhu cầu của bạn</label>
                    <div className="relative">
                      <select
                        id="need"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
                        value={formData.need}
                        onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                      >
                        <option value="">Chọn nhu cầu</option>
                        <option value="Báo giá nilon lót sàn">Báo giá nilon lót sàn</option>
                        <option value="Tư vấn thi công">Tư vấn thi công</option>
                        <option value="Khác">Khác</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">Nội dung chi tiết</label>
                    <textarea
                      id="content"
                      placeholder="Ví dụ: Cần 50 cuộn nilon 0.5mm giao tại Hưng Yên..."
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0b2149] hover:bg-[#16346b] text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : 'Gửi yêu cầu ngay'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right: Trust indicators */}
            <motion.div 
              className="lg:w-7/12 flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
                <Image 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2064&auto=format&fit=crop" 
                  alt="Đội ngũ hỗ trợ" 
                  width={800}
                  height={300}
                  className="w-full h-[300px] object-cover object-center" 
                />
              </div>

              <div className="bg-orange-50 border-l-4 border-[#fc6c29] p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-bold text-[#d45218] mb-2">Cam kết báo giá 5-10 phút</h3>
                <p className="text-orange-800">Đội ngũ kinh doanh trực tuyến luôn sẵn sàng phản hồi mọi yêu cầu của khách hàng trong thời gian ngắn nhất.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="mt-1"><ShieldCheck className="text-primary w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chất lượng ISO</h4>
                    <p className="text-sm text-gray-600">Đạt tiêu chuẩn vật liệu xây dựng Việt Nam</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><Truck className="text-primary w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Giao hàng toàn quốc</h4>
                    <p className="text-sm text-gray-600">Hệ thống vận chuyển tận chân công trình</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="h-[450px] w-full relative overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3728.3242686884355!2d105.93116900000001!3d20.832123999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDQ5JzU1LjciTiAxMDXCsDU1JzUyLjIiRQ!5e0!3m2!1svi!2svn!4v1714659132145!5m2!1svi!2svn" 
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 inline-block relative">
              Tại sao nên chọn chúng tôi?
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fc6c29]"></div>
            </h2>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-12 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {reasons.map((item, idx) => (
              <motion.div key={idx} variants={slideUp} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#0b2149] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20 transform rotate-3 hover:rotate-0 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 px-4 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0b2149] py-12 border-b border-blue-800">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Cần báo giá nhanh nhất?</h2>
              <p className="text-blue-200">Gọi ngay hoặc nhắn tin Zalo để được hỗ trợ tức thì.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0931982568" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors flex items-center gap-2 shadow-lg">
                <Phone className="w-5 h-5" /> 0931.982.568
              </a>
              <a href="https://zalo.me/0931982568" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-md font-bold transition-colors flex items-center gap-2 shadow-lg">
                <MessageCircle className="w-5 h-5 text-blue-500" /> Nhắn Zalo Ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
