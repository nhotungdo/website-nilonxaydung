"use client";

import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/lib/animations";
import { Award, CheckCircle2, ShieldCheck, Factory } from "lucide-react";
import Link from "next/link";

export default function IsoCertificatePage() {
  const criteria = [
    "Hệ thống quản lý chất lượng đạt tiêu chuẩn quốc tế",
    "Quy trình sản xuất được kiểm soát nghiêm ngặt từ nguyên liệu đầu vào",
    "Sản phẩm đầu ra đạt độ đồng đều cao về độ dày, độ dai và khả năng chống thấm",
    "Cam kết bảo vệ môi trường trong quá trình sản xuất",
    "Đội ngũ nhân sự được đào tạo bài bản, chuyên nghiệp",
    "Liên tục cải tiến để nâng cao sự hài lòng của khách hàng"
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={slideUp} className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#fc6c29] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                <Award className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Chứng Chỉ Chất Lượng ISO
            </motion.h1>
            <motion.p variants={slideUp} className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Cam kết mang đến sản phẩm nilon lót sàn đạt tiêu chuẩn quốc tế, đảm bảo chất lượng bền vững cho mọi công trình.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container max-w-[1280px] mx-auto px-4 -mt-16 relative z-20 mb-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left image area */}
            <div className="lg:w-2/5 bg-gray-50 p-8 md:p-12 flex flex-col items-center justify-center border-r border-gray-100">
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 w-full max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* ISO Certificate Placeholder */}
                <div className="border-4 border-double border-gray-300 p-6 text-center h-[400px] flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                  <Award className="w-16 h-16 text-yellow-500 mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">CERTIFICATE</h3>
                  <p className="font-serif text-sm text-gray-600 mb-6 uppercase tracking-widest">of Registration</p>
                  <p className="text-xs text-gray-500 mb-4">This is to certify that the Quality Management System of</p>
                  <h4 className="font-bold text-primary text-lg mb-4">NILON LÓT SÀN VN</h4>
                  <p className="text-xs text-gray-500 mb-6">has been assessed and found to conform to the requirements of</p>
                  <div className="font-bold text-2xl text-gray-800 border-y border-gray-400 py-2 w-full">ISO 9001:2015</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center italic">Chứng nhận Hệ thống Quản lý Chất lượng ISO 9001:2015</p>
            </div>

            {/* Right content area */}
            <div className="lg:w-3/5 p-8 md:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-[#fc6c29] rounded-full text-sm font-bold mb-6">
                <ShieldCheck className="w-4 h-4" /> Tiêu chuẩn quốc tế
              </div>
              <h2 className="text-3xl font-extrabold text-primary mb-6">Chất lượng được chứng nhận</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Việc đạt được chứng nhận ISO 9001:2015 là minh chứng rõ ràng nhất cho cam kết của chúng tôi đối với chất lượng sản phẩm và dịch vụ. Chúng tôi không ngừng tối ưu hóa quy trình hoạt động để mang lại giá trị tốt nhất cho khách hàng.
              </p>

              <div className="space-y-4 mb-10">
                {criteria.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <Factory className="w-5 h-5" /> Hệ thống nhà máy
                  </div>
                  <p className="text-sm text-gray-600">Dây chuyền nhập khẩu hiện đại, công nghệ ép đùn màng PE tiên tiến nhất.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <CheckCircle2 className="w-5 h-5" /> KCS Nghiêm ngặt
                  </div>
                  <p className="text-sm text-gray-600">Kiểm tra 100% lô hàng xuất xưởng về độ dày, độ dai và kích thước.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-50 py-16 text-center">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Bạn cần tư vấn sản phẩm đạt chuẩn cho công trình?</h2>
          <p className="text-gray-600 mb-8">Đội ngũ kỹ sư của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn giải pháp tối ưu nhất.</p>
          <Link href="/lien-he" className="inline-block bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg">
            Liên hệ chuyên gia
          </Link>
        </div>
      </section>
    </div>
  );
}
