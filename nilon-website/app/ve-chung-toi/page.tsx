"use client";

import { motion } from "framer-motion";
import { slideUp, staggerContainer, fadeIn } from "@/lib/animations";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Shield, TrendingUp, Users, Target } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "5+", label: "Năm kinh nghiệm" },
    { number: "50+", label: "Đối tác tin cậy" },
    { number: "1000+", label: "Dự án hoàn thành" },
    { number: "50+", label: "Tỉnh thành phân phối" },
  ];

  const values = [
    { icon: <Shield className="w-8 h-8 text-white" />, title: "Chất lượng hàng đầu", desc: "Cam kết sản phẩm đạt tiêu chuẩn ISO, độ bền cao, đáp ứng mọi yêu cầu khắt khe nhất của công trình." },
    { icon: <Target className="w-8 h-8 text-white" />, title: "Giá cả cạnh tranh", desc: "Là nhà sản xuất trực tiếp, chúng tôi mang đến mức giá gốc tốt nhất cho các nhà thầu và đại lý." },
    { icon: <TrendingUp className="w-8 h-8 text-white" />, title: "Cải tiến liên tục", desc: "Không ngừng đầu tư công nghệ, máy móc hiện đại để nâng cao năng suất và chất lượng sản phẩm." },
    { icon: <Users className="w-8 h-8 text-white" />, title: "Phục vụ tận tâm", desc: "Đội ngũ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ 24/7. Giao hàng nhanh chóng đến tận chân công trình." },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-primary mix-blend-multiply" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=2070&auto=format&fit=crop')" }}
          />
        </div>
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6">
              Về Chúng Tôi
            </motion.h1>
            <motion.p variants={slideUp} className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Tự hào là đơn vị tiên phong trong lĩnh vực sản xuất và cung cấp nilon lót sàn bê tông chất lượng cao tại Việt Nam, đồng hành cùng sự phát triển của hàng ngàn công trình lớn nhỏ.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={slideUp} className="text-sm font-bold text-[#fc6c29] tracking-wider uppercase mb-2">Câu chuyện của chúng tôi</motion.div>
              <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Hành trình xây dựng niềm tin</motion.h2>
              <motion.p variants={slideUp} className="text-gray-600 mb-6 leading-relaxed">
                Được thành lập với tầm nhìn trở thành đối tác chiến lược của các nhà thầu xây dựng trên toàn quốc, chúng tôi hiểu rằng &quot;nền móng vững chắc là khởi đầu cho mọi công trình vĩ đại&quot;. Lớp nilon lót sàn tuy mỏng manh nhưng lại đóng vai trò tối quan trọng trong việc bảo vệ chất lượng bê tông.
              </motion.p>
              <motion.p variants={slideUp} className="text-gray-600 mb-8 leading-relaxed">
                Với hơn 10 năm kinh nghiệm, chúng tôi đã không ngừng cải tiến dây chuyền sản xuất, tối ưu hóa chi phí để mang đến cho khách hàng những sản phẩm đạt tiêu chuẩn kỹ thuật cao nhất với mức giá vô cùng hợp lý. Sự tin tưởng của quý khách hàng chính là động lực để chúng tôi phát triển không ngừng.
              </motion.p>
              <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="font-bold text-primary">Sản xuất trực tiếp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="font-bold text-primary">Kiểm định nghiêm ngặt</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop"
                  alt="Nhà máy sản xuất"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-[#fc6c29] mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Giá trị cốt lõi</h2>
            <div className="w-16 h-1 bg-[#fc6c29] mx-auto rounded"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-primary p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 bg-[#fc6c29] rounded-lg flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-blue-100 leading-relaxed text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-100 text-center">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-primary mb-6">Hợp tác cùng phát triển</h2>
          <p className="text-gray-600 mb-8 text-lg">Chúng tôi luôn tìm kiếm cơ hội hợp tác lâu dài với các nhà thầu, đại lý phân phối trên toàn quốc với chính sách chiết khấu cực kỳ hấp dẫn.</p>
          <Link href="/lien-he" className="inline-block bg-[#fc6c29] hover:bg-[#e65a1f] text-white px-8 py-4 rounded-md font-bold transition-colors shadow-lg">
            Liên hệ hợp tác ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
