"use client";

import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/lib/animations";
import Link from "next/link";
import {
  Layers, Truck, Scissors, Headset, MapPin,
  ClipboardList, PhoneCall, Calculator, PackageCheck,
  CheckCircle2, Zap, HeartHandshake, Phone, MessageCircle, FileText, DollarSign
} from "lucide-react";

export default function DichVuPage() {
  const services = [
    { icon: <ClipboardList className="text-[#fc6c29] w-6 h-6" />, title: "Tư vấn chọn loại nilon", desc: "Đội ngũ kỹ sư hỗ trợ phân tích bản vẽ và lựa chọn vật liệu lót sàn tối ưu chi phí cho từng hạng mục công trình." },
    { icon: <Truck className="text-[#fc6c29] w-6 h-6" />, title: "Giao hàng tận nơi", desc: "Hệ thống xe vận tải 24/7, cam kết có mặt tại công trường trong vòng 2-4 tiếng nội thành." },
    { icon: <Scissors className="text-[#fc6c29] w-6 h-6" />, title: "Cắt theo yêu cầu", desc: "Gia công cắt cuộn, khổ nilon theo kích thước chính xác của hạng mục, giảm thiểu lãng phí vật tư." },
    { icon: <Headset className="text-[#fc6c29] w-6 h-6" />, title: "Hỗ trợ kỹ thuật", desc: "Hướng dẫn trải lót đúng tiêu chuẩn kỹ thuật để đảm bảo hiệu quả chống thấm cao nhất cho sàn." },
    { icon: <PackageCheck className="text-[#fc6c29] w-6 h-6" />, title: "Cung cấp bao tải", desc: "Vật tư phụ cho công trường: bao bì, bao tải dứa, bao PE tải trọng lớn đạt chuẩn ISO." },
  ];

  const steps = [
    { icon: <PhoneCall />, title: "Tiếp nhận", desc: "Ghi nhận thông tin qua Hotline/Zalo/Email" },
    { icon: <MapPin />, title: "Tư vấn", desc: "Đề xuất phương án & định lượng vật tư" },
    { icon: <Calculator />, title: "Báo giá", desc: "Gửi báo giá ưu đãi nhất tới nhà thầu" },
    { icon: <Truck />, title: "Giao hàng", desc: "Vận chuyển nhanh chóng đến công trường" },
    { icon: <HeartHandshake />, title: "Hỗ trợ", desc: "Chăm sóc sau bán & giải quyết phát sinh" },
  ];

  const values = [
    { icon: <DollarSign className="text-[#fc6c29] w-8 h-8" />, title: "Giá cạnh tranh", desc: "Cung cấp giá gốc từ xưởng cho các đơn hàng số lượng lớn." },
    { icon: <CheckCircle2 className="text-[#fc6c29] w-8 h-8" />, title: "Đúng chất lượng", desc: "Cam kết độ dày thực tế chuẩn 100% theo yêu cầu." },
    { icon: <Zap className="text-[#fc6c29] w-8 h-8" />, title: "Giao nhanh", desc: "Đội ngũ xe tải sẵn sàng phục vụ các đơn gấp trong ngày." },
    { icon: <HeartHandshake className="text-[#fc6c29] w-8 h-8" />, title: "Hỗ trợ tận tâm", desc: "Giải quyết mọi khiếu nại trong 24 giờ làm việc." },
  ];

  const locations = [
    { name: "Hưng Yên", desc: "Mật độ cao: KCN Phố Nối A, B, Thăng Long II, Yên Mỹ." },
    { name: "Hà Nội", desc: "Phủ sóng toàn bộ 12 quận và các huyện ngoại thành." },
    { name: "Bắc Ninh", desc: "Đồng hành cùng các dự án tại KCN Quế Võ, Tiên Sơn, Yên Phong." },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-primary flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2076&auto=format&fit=crop" alt="Construction services" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6"
            >
              DỊCH VỤ CỦA CHÚNG TÔI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100 text-lg mb-8 leading-relaxed"
            >
              Giải pháp cung ứng nilon lót sàn và vật tư xây dựng chuyên nghiệp. Đồng hành cùng các nhà thầu kiến tạo những công trình bền vững với tiêu chuẩn kỹ thuật khắt khe nhất.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#services" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg">
                Khám phá ngay
              </Link>
              <Link href="/san-pham" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-md font-bold transition-all">
                Xem Catalogue
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4 uppercase">Danh mục dịch vụ</h2>
            <div className="w-16 h-1 bg-[#fc6c29] mx-auto rounded"></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Big Card */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full group hover:shadow-lg transition-all">
                <div className="h-64 bg-gray-100 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1587393845576-2e86749bd00c?q=80&w=1964&auto=format&fit=crop" alt="Cuộn nilon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                    <Layers className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Cung cấp nilon đủ độ dày</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Chúng tôi sản xuất và cung ứng đa dạng từ nilon lót sàn bê tông PE, nilon đen công trình đến các loại màng chống thấm chuyên dụng với độ dày từ 0.01mm đến 0.5mm.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-semibold rounded-md">Dòng 2zem</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-semibold rounded-md">Dòng 4zem</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-semibold rounded-md">Dòng 6zem</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Cards */}
            <motion.div
              className="lg:col-span-7 grid sm:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  variants={slideUp}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg shrink-0">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-2">{service.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-primary text-white pt-24 pb-48 relative">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-[32px] font-extrabold mb-4 uppercase">Quy trình làm việc</h2>
          <p className="text-blue-100 mb-16">Chuyên nghiệp - Nhanh chóng - Tin cậy</p>

          <div className="hidden md:block relative max-w-5xl mx-auto mb-16">
            {/* Connecting line */}
            <div className="absolute top-8 left-12 right-12 h-0.5 bg-blue-800"></div>

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${idx === 0 ? 'bg-[#fc6c29]' : 'bg-white text-primary'}`}>
                    {step.icon}
                  </div>
                  <h4 className="font-bold mb-2">{step.title}</h4>
                  <p className="text-blue-100 text-xs px-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile steps */}
          <div className="md:hidden space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center text-left bg-blue-900/30 p-4 rounded-xl">
                <div className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center mr-4 ${idx === 0 ? 'bg-[#fc6c29]' : 'bg-white text-primary'}`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold">{step.title}</h4>
                  <p className="text-blue-100 text-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Cards overlapping the sections */}
      <section className="relative z-20 -mt-24 pb-24">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-[#fc6c29] text-center"
              >
                <div className="flex justify-center mb-6">{val.icon}</div>
                <h4 className="font-bold text-primary mb-3">{val.title}</h4>
                <p className="text-gray-500 text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-6 uppercase">Khu vực phục vụ trọng điểm</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Chúng tôi tập trung nguồn lực mạnh mẽ tại các &quot;thủ phủ&quot; công nghiệp và xây dựng phía Bắc, đảm bảo thời gian giao hàng ngắn nhất.
              </p>
              <div className="space-y-6">
                {locations.map((loc, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1"><MapPin className="text-primary w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{loc.name}</h4>
                      <p className="text-gray-600">{loc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg relative z-10 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-orange-100 text-[#fc6c29] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin />
                    </div>
                    <div className="font-bold text-primary text-xl">Phục vụ toàn Miền Bắc</div>
                    <div className="text-sm text-gray-500 mt-1">Nhanh chóng & Linh hoạt</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-primary text-center">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Liên hệ ngay để được tư vấn</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:0931982568" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" /> Gọi: 0931 982 568
            </a>
            <a href="https://zalo.me/0931982568" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Nhắn Zalo
            </a>
            <Link href="/lien-he" className="bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" /> Nhận báo giá ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
