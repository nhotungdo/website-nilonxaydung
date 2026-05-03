"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { staggerContainer, slideUp } from "@/lib/animations";

export default function FeaturedProducts() {
  const products = [
    {
      title: 'Nilon Lót Sàn 2zem',
      badge: 'PHỔ BIẾN',
      badgeColor: 'bg-primary text-white',
      desc: 'Độ dày tiết kiệm, phù hợp cho lót nền đổ bê tông dân dụng, ngăn thấm nước bề mặt sàn.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '850.000đ/c' },
        { label: '10 - 50 cuộn', value: '790.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Liên hệ ngay', highlight: true }
      ],
      btnText: 'Xem chi tiết',
      btnClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1927&auto=format&fit=crop'
    },
    {
      title: 'Nilon Lót Sàn 4zem',
      badge: 'BÁN CHẠY NHẤT',
      badgeColor: 'bg-secondary-container text-white',
      featured: true,
      desc: 'Độ bền cao, chịu lực xé tốt. Chuyên dùng cho các công trình hạ tầng, nhà xưởng quy mô lớn.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '1.150.000đ/c' },
        { label: '10 - 50 cuộn', value: '1.080.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Chiết khấu 15%', highlight: true }
      ],
      btnText: 'Đặt hàng ngay',
      btnClass: 'bg-primary text-white hover:bg-primary-container',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop'
    },
    {
      title: 'Nilon Lót Sàn 6zem',
      desc: 'Độ dày vượt trội, chống thấm tuyệt đối và chống rách cực tốt. Dùng cho công trình đặc thù.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '1.650.000đ/c' },
        { label: '10 - 50 cuộn', value: '1.550.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Giá sỉ tận gốc', highlight: true }
      ],
      btnText: 'Xem chi tiết',
      btnClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1974&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[32px] font-extrabold text-primary mb-4">Chi tiết bảng giá nilon lót sàn</h2>
          <div className="w-16 h-1 bg-[#fc6c29] mx-auto rounded"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              className={`bg-white rounded-xl shadow-sm border ${product.featured ? 'border-secondary-container shadow-lg relative lg:scale-105 z-10' : 'border-gray-200'} overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="relative h-48 bg-gray-100">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill
                  className="w-full h-full object-cover" 
                />
                {product.badge && (
                  <div className={`absolute top-4 ${product.featured ? 'right-0 rounded-l-md' : 'left-4 rounded-md'} px-3 py-1 text-xs font-bold ${product.badgeColor}`}>
                    {product.badge}
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-primary mb-3">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">{product.desc}</p>

                <div className="space-y-4 mb-8">
                  {product.prices.map((price, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">{price.label}</span>
                      <span className={`font-bold ${price.highlight ? 'text-secondary underline decoration-1 underline-offset-2 cursor-pointer' : 'text-gray-900'}`}>
                        {price.value}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-md font-bold text-sm transition-colors ${product.btnClass}`}
                >
                  {product.btnText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
