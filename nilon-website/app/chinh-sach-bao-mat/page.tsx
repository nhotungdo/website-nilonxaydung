"use client";

import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/lib/animations";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const policies = [
    {
      icon: <Eye className="w-6 h-6 text-[#fc6c29]" />,
      title: "Mục đích thu thập thông tin cá nhân",
      content: "Việc thu thập dữ liệu chủ yếu trên website bao gồm: email, điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ khách hàng. Đây là các thông tin mà chúng tôi cần khách hàng cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho người tiêu dùng."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#fc6c29]" />,
      title: "Phạm vi sử dụng thông tin",
      content: "Website sử dụng thông tin khách hàng cung cấp để:\n- Cung cấp các dịch vụ đến Khách hàng.\n- Giao hàng theo địa chỉ mà Khách hàng cung cấp.\n- Gửi email tiếp thị, khuyến mại về hàng hóa do chúng tôi bán.\n- Liên lạc và giải quyết với khách hàng trong những trường hợp đặc biệt.\n- Không sử dụng thông tin cá nhân của khách hàng ngoài mục đích xác nhận và liên hệ có liên quan đến giao dịch tại website."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#fc6c29]" />,
      title: "Thời gian lưu trữ thông tin",
      content: "Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của chúng tôi."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#fc6c29]" />,
      title: "Cam kết bảo mật thông tin cá nhân khách hàng",
      content: "Thông tin cá nhân của khách hàng trên website được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của công ty. Việc thu thập và sử dụng thông tin của mỗi khách hàng chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.\nKhông sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của khách hàng khi không có sự cho phép đồng ý từ khách hàng."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-24">
      {/* Header */}
      <section className="bg-primary py-16 text-center">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={slideUp} className="flex justify-center mb-4">
              <ShieldCheck className="w-16 h-16 text-[#fc6c29]" />
            </motion.div>
            <motion.h1 variants={slideUp} className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Chính Sách Bảo Mật
            </motion.h1>
            <motion.p variants={slideUp} className="text-blue-100 text-lg">
              Cập nhật lần cuối: 01/01/2026
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="lead text-xl font-medium text-gray-800 mb-10 border-b pb-6">
              Chúng tôi hiểu rằng bạn quan tâm đến việc thông tin cá nhân của mình được sử dụng và chia sẻ như thế nào. Chúng tôi cam kết bảo vệ sự riêng tư của bạn. Dưới đây là chi tiết về chính sách bảo mật thông tin của công ty.
            </p>

            <div className="space-y-12">
              {policies.map((policy, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                      {policy.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">{policy.title}</h3>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {policy.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Thông tin liên hệ</h3>
              <p>Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:</p>
              <ul className="mt-3 space-y-2 list-none pl-0">
                <li><strong>Hotline:</strong> 090 xxx xxxx</li>
                <li><strong>Email:</strong> contact@nilonlotsan.vn</li>
                <li><strong>Địa chỉ:</strong> Châu Ninh, Khoái Châu, Hưng Yên, Việt Nam</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
