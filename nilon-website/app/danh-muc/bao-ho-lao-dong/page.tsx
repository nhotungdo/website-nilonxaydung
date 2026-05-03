"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

export default function BaoHoLaoDongPage() {
  return (
    <motion.div 
      className="bg-[#f8f9fa] min-h-screen py-10 font-sans"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Tabs */}
        <motion.div variants={slideUp} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-[32px] font-bold text-[#0B2147] uppercase tracking-wide mb-2">Danh mục vật tư</h1>
            <p className="text-gray-500 text-sm max-w-md">Cung cấp giải pháp bảo vệ bề mặt và an toàn công trình chuyên nghiệp.</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-wrap text-sm font-medium">
            <button className="bg-[#0B2147] text-white px-6 py-3 transition-colors">Tất cả</button>
            <button className="text-gray-600 hover:bg-gray-50 px-6 py-3 border-l border-gray-200 transition-colors">Nilon Lót Sàn</button>
            <button className="text-gray-600 hover:bg-gray-50 px-6 py-3 border-l border-gray-200 transition-colors">Găng tay</button>
            <button className="text-gray-600 hover:bg-gray-50 px-6 py-3 border-l border-gray-200 transition-colors">Mũ bảo hộ</button>
            <button className="text-gray-600 hover:bg-gray-50 px-6 py-3 border-l border-gray-200 transition-colors">Giày công trình</button>
          </div>
        </motion.div>

        {/* Section 1: Nilon */}
        <motion.div 
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#C43A1B] rounded-full"></div>
            <h2 className="text-xl font-bold text-[#0B2147] uppercase">Cuộn nilon lót sàn đổ bê tông</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div variants={slideUp} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-[240px] w-full bg-gray-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1541088737380-60b731e07b81?q=80&w=800" 
                  alt="Nilon Trắng Trong" 
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#0B2147] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">BÁN CHẠY</span>
                  <span className="bg-[#C43A1B] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">LOẠI DÀY</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[17px] font-bold text-[#0B2147] mb-4 group-hover:text-[#C43A1B] transition-colors">Nilon Trắng Trong Loại 1</h3>
                <div className="flex gap-3 mb-6">
                  <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded p-3 flex-1">
                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Độ dày</div>
                    <div className="text-[13px] font-semibold text-[#0B2147]">0.05mm - 0.2mm</div>
                  </div>
                  <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded p-3 flex-1">
                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Khổ rộng</div>
                    <div className="text-[13px] font-semibold text-[#0B2147]">1m - 6m</div>
                  </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <span className="text-[#C43A1B] font-semibold text-sm">Liên hệ báo giá</span>
                  <button className="w-9 h-9 bg-[#0B2147] group-hover:bg-[#C43A1B] text-white rounded flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={slideUp} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-[240px] w-full bg-gray-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800" 
                  alt="Nilon Đen Lót Nền" 
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#333] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">SIÊU BỀN</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[17px] font-bold text-[#0B2147] mb-4 group-hover:text-[#C43A1B] transition-colors">Nilon Đen Lót Nền Kỹ Thuật</h3>
                <div className="flex gap-3 mb-6">
                  <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded p-3 flex-1">
                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Độ dày</div>
                    <div className="text-[13px] font-semibold text-[#0B2147]">0.15mm</div>
                  </div>
                  <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded p-3 flex-1">
                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Diện tích</div>
                    <div className="text-[13px] font-semibold text-[#0B2147]">500m²/cuộn</div>
                  </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <span className="text-[#C43A1B] font-semibold text-sm">Liên hệ báo giá</span>
                  <button className="w-9 h-9 bg-[#0B2147] group-hover:bg-[#C43A1B] text-white rounded flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Spec Card */}
            <motion.div variants={slideUp} className="bg-[#0f2d5c] rounded-xl p-7 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border-t-4 border-[#C43A1B]">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-white">Bảng Thông Số Nilon</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-blue-100/70 text-[13px]">Chống thấm</span>
                    <span className="font-semibold text-[13px]">Tuyệt đối 100%</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-blue-100/70 text-[13px]">Khả năng chịu lực</span>
                    <span className="font-semibold text-[13px]">Cao (PE nguyên sinh)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-blue-100/70 text-[13px]">Quy cách khổ</span>
                    <span className="font-semibold text-[13px]">Đa dạng, cắt theo yêu cầu</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-blue-100/70 text-[13px]">Màu sắc</span>
                    <span className="font-semibold text-[13px]">Trắng, Đen, Xanh</span>
                  </div>
                </div>
                
                <p className="text-[11px] text-blue-100/50 mt-6 italic leading-relaxed">
                  * Đạt chứng chỉ tiêu chuẩn chất lượng vật liệu xây dựng Việt Nam.
                </p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#C43A1B] hover:bg-[#db4b2a] text-white font-bold py-3.5 px-4 rounded-md mt-6 transition-colors relative z-10 text-[13px] uppercase tracking-wide shadow-md"
              >
                Nhận Báo Giá
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Section 2: Bao ho */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#0B2147] rounded-full"></div>
              <h2 className="text-xl font-bold text-[#0B2147] uppercase">Trang thiết bị bảo hộ</h2>
            </div>
            <Link href="#" className="text-[13px] font-semibold text-gray-600 hover:text-[#C43A1B] transition-colors flex items-center group">
              Xem tất cả bảo hộ 
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Bao ho cards */}
            {[
              { img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=400", title: "Găng tay da thợ hàn" },
              { img: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=400", title: "Mũ bảo hộ Thùy Dương" },
              { img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=400", title: "Giày bảo hộ mũi thép" },
              { img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=400", title: "Áo phản quang kỹ sư" }
            ].map((item, index) => (
              <motion.div key={index} variants={slideUp} className="group cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-gray-50 rounded-lg overflow-hidden aspect-[4/3] relative mb-4">
                  <Image 
                    src={item.img} 
                    alt={item.title} 
                    fill
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800 text-sm group-hover:text-[#C43A1B] transition-colors pb-1">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#0a1e40] rounded-xl p-8 lg:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-lg relative overflow-hidden border border-[#16336a]"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#C43A1B]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-[#4299e1]/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-[26px] md:text-3xl font-light mb-4 leading-tight">Bạn cần báo giá số lượng lớn cho dự án?</h2>
            <p className="text-blue-100/70 text-[15px] leading-relaxed max-w-xl">
              Chúng tôi cung cấp chính sách chiết khấu tốt nhất cho các nhà thầu và đơn vị thi công. Hỗ trợ giao hàng tận nơi trong 24h.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#FE6230] hover:bg-[#db4b2a] text-white font-bold py-3.5 px-8 rounded-md transition-colors text-[14px] shadow-md w-full md:w-auto text-center">
              Nhận báo giá ngay
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="border border-white/20 hover:bg-white/5 text-white font-bold py-3.5 px-8 rounded-md transition-colors text-[14px] w-full md:w-auto text-center">
              Tư vấn kỹ thuật
            </motion.button>
          </div>
        </motion.div>

        {/* Features Bottom */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 flex flex-wrap justify-center lg:justify-center gap-10 lg:gap-16 pt-8 pb-4"
        >
          {[
            { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", text: "Tiêu chuẩn ISO 9001" },
            { icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z", text: "Giao hàng hỏa tốc" },
            { icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z", text: "Hỗ trợ 24/7" },
            { icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", text: "Top vật liệu 2023" }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="flex items-center gap-2.5 text-gray-500 hover:text-gray-800 transition-colors cursor-default">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={feature.icon} /></svg>
              <span className="text-[13px] font-bold uppercase tracking-wide">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
