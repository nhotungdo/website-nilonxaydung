"use client";

import { motion } from "framer-motion";
import { slideUp, staggerContainer, fadeIn } from "@/lib/animations";
import Link from "next/link";
import { CheckCircle2, Droplets, Shield, Hammer, XOctagon, PaintBucket, DollarSign, ChevronDown, Check, X } from "lucide-react";
import { useState } from "react";

export default function CongDungPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    { icon: <Droplets className="w-8 h-8 text-primary" />, title: "Chống mất nước bê tông", desc: "Ngăn chặn nước trong hỗn hợp bê tông bị thấm xuống nền đất, đảm bảo quá trình thủy hóa xi măng ổn định." },
    { icon: <Shield className="w-8 h-8 text-primary" />, title: "Chống thấm ngược", desc: "Ngăn chặn hơi ẩm và mạch nước ngầm từ dưới đất ngấm lên sàn, bảo vệ lớp hoàn thiện và trang trí phía trên." },
    { icon: <Hammer className="w-8 h-8 text-primary" />, title: "Tăng độ bền sàn", desc: "Đảm bảo mác bê tông đạt chuẩn thiết kế, tránh các hiện tượng rỗ mặt hoặc bở kết cấu nền." },
    { icon: <XOctagon className="w-8 h-8 text-primary" />, title: "Ngăn nứt bề mặt", desc: "Hạn chế sự co ngót quá nhanh của bê tông trong giai đoạn đầu, giảm thiểu tối đa các vết nứt chân chim." },
    { icon: <PaintBucket className="w-8 h-8 text-primary" />, title: "Vệ sinh công trình", desc: "Giữ cho khu vực thi công sạch sẽ, ngăn bùn đất trào lên vào bê tông tươi khi đổ móng hoặc sàn." },
    { icon: <DollarSign className="w-8 h-8 text-primary" />, title: "Tiết kiệm chi phí", desc: "Giải pháp rẻ hơn nhiều so với các loại phụ gia chống thấm khác, mà vẫn đảm bảo hiệu quả kỹ thuật." },
  ];

  const faqs = [
    { q: "Nên chọn độ dày nilon bao nhiêu cho sàn nhà dân dụng?", a: "Thông thường và phổ biến nhất, nilon lót độ dày 2 zem (0.02mm) đến 4 zem (0.04mm) là đủ để chống mất nước và ngăn ẩm. Với các công trình chịu lực cao, nên dùng từ 6 zem trở lên." },
    { q: "Một cuộn nilon lót sàn nặng bao nhiêu và trải được bao nhiêu m2?", a: "Trọng lượng và diện tích trải phụ thuộc vào độ dày của nilon. Ví dụ, một cuộn nilon đen 4zem thường nặng khoảng 50-60kg và có thể trải được diện tích hàng trăm mét vuông. Liên hệ trực tiếp để có thông số chính xác cho từng loại." },
    { q: "Có cần dán băng keo ở các mối nối nilon không?", a: "Rất cần thiết. Để đảm bảo hiệu quả chống thấm tuyệt đối, các tấm nilon lót sàn cần được trải chồng lên nhau ít nhất 15-20cm và phải được dán kín bằng băng keo chuyên dụng để nước xi măng không bị rỉ xuống dưới." },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gray-50">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 variants={slideUp} className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight mb-6">
                Công dụng của Nilon lót sàn bê tông
              </motion.h1>
              <motion.p variants={slideUp} className="text-gray-600 text-lg mb-8 leading-relaxed">
                Giải pháp tối ưu để bảo vệ kết cấu sàn, chống mất nước xi măng và ngăn chặn thấm ngược hiệu quả cho mọi công trình từ nhà dân dụng đến nhà xưởng công nghiệp.
              </motion.p>
              <motion.div variants={slideUp} className="flex flex-wrap gap-4">
                <Link href="#contact" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg shadow-orange-500/30 flex items-center">
                  Nhận báo giá ngay
                </Link>
                <Link href="/san-pham" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary px-8 py-4 rounded-md font-bold transition-all">
                  Xem sản phẩm
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" alt="Thi công lót nilon sàn" className="w-full h-auto object-cover" />
                <div className="absolute bottom-6 left-6 bg-primary text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[#fc6c29]" />
                  <div>
                    <div className="font-extrabold text-xl">100%</div>
                    <div className="text-sm opacity-90">Chống thấm hiệu quả</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-[4/3] flex items-center justify-center relative">
                {/* Placeholder graphic for 3D slab */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50"></div>
                <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop" alt="Cấu trúc sàn bê tông" className="relative z-10 w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={slideUp} className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-2">Kiến thức ngành</motion.div>
              <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Nilon lót sàn là gì?</motion.h2>
              <motion.p variants={slideUp} className="text-gray-600 mb-6 leading-relaxed">
                Nilon lót sàn bê tông là một màng PE (Polyethylene) chuyên dụng, được trải lên lớp nền/đất trước khi đổ bê tông (đặc biệt là bê tông nền, sàn).
              </motion.p>
              <motion.p variants={slideUp} className="text-gray-600 mb-8 leading-relaxed">
                Vật liệu này đóng vai trò như một lớp màng ngăn cách vật lý hoàn hảo, bảo vệ quá trình thủy hóa của xi măng diễn ra hoàn thiện nhất.
              </motion.p>
              <motion.div variants={slideUp} className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#fc6c29]" />
                  <span className="font-semibold text-primary">Chất liệu: Nhựa PE</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#fc6c29]" />
                  <span className="font-semibold text-primary">Độ dày đa dạng (2 - 6 zem)</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Các công dụng chính trong thi công</h2>
            <div className="w-16 h-1 bg-[#fc6c29] mx-auto rounded"></div>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={slideUp}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Phân tích hiệu quả kỹ thuật</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pros */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border-t-4 border-green-500 p-8 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary">CÓ Nilon lót sàn</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-700">Mác bê tông đạt 100% yêu cầu kỹ thuật.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-700">Sàn khô ráo, không có hiện tượng nồm ẩm từ dưới đất lên.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-700">Bề mặt sàn láng mịn, không nứt nẻ.</span>
                </li>
              </ul>
            </motion.div>

            {/* Cons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-t-4 border-red-500 p-8 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary">KHÔNG CÓ Nilon lót</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <X className="w-6 h-6 text-red-500 shrink-0" />
                  <span className="text-gray-700">Mất nước xi măng làm bê tông xốp, dễ rỗ, sụt lún.</span>
                </li>
                <li className="flex gap-4">
                  <X className="w-6 h-6 text-red-500 shrink-0" />
                  <span className="text-gray-700">Hơi ẩm từ đất bốc lên làm hỏng sàn gỗ, bong mảng sơn.</span>
                </li>
                <li className="flex gap-4">
                  <X className="w-6 h-6 text-red-500 shrink-0" />
                  <span className="text-gray-700">Tốn nhiều công sức bảo dưỡng sau khi đổ bê tông.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery / Use Cases */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Ứng dụng thực tế</h2>
              <p className="text-gray-600">Đa dạng kích thước cho mọi loại hình kiến trúc</p>
            </div>
            <Link href="/san-pham" className="text-primary font-bold hover:text-[#fc6c29] transition-colors flex items-center gap-1">
              Xem tất cả dự án <ChevronDown className="w-4 h-4 -rotate-90" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Nhà xưởng công nghiệp", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" },
              { title: "Nhà dân dụng", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop" },
              { title: "Tổ hợp thương mại", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" },
              { title: "Đổ đường giao thông", img: "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?q=80&w=1933&auto=format&fit=crop" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-200"
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg">{item.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Câu hỏi thường gặp</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 font-bold text-primary flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-primary relative overflow-hidden" id="contact">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Bạn cần báo giá nilon lót sàn ngay?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Chúng tôi cung cấp đủ mọi kích cỡ, độ dày với mức giá cạnh tranh nhất thị trường. Hàng luôn có sẵn tại kho.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:0901234567" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg">
              Gọi ngay: 090 xxx xxxx
            </a>
            <Link href="/lien-he" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-colors">
              Nhận báo giá chi tiết
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
