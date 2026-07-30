"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useState } from "react";
import AddToCartModal from "@/components/AddToCartModal";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const products = [
    {
      title: 'Nilon Lót Sàn 2zem',
      slug: 'nilon-lot-san-2zem',
      badge: 'PHỔ BIẾN DÂN DỤNG',
      badgeColor: 'bg-[#1a365d] text-white',
      desc: 'Độ dày tiết kiệm, phù hợp cho lót nền đổ bê tông dân dụng, lót chống thấm nền móng công trình.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '850.000đ/c' },
        { label: '10 - 50 cuộn', value: '790.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Liên hệ ngay', highlight: true }
      ],
      btnText: 'Xem chi tiết',
      btnClass: 'border border-slate-200 text-slate-700 hover:bg-[#f4f9fc]',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
      price: 850000
    },
    {
      title: 'Nilon Lót Sàn 4zem',
      slug: 'nilon-lot-san-4zem',
      badge: 'BÁN CHẠY NHẤT DỰ ÁN',
      badgeColor: 'bg-[#2b6cb0] text-white',
      featured: true,
      desc: 'Độ bền cao, chịu lực xé tốt. Chuyên dùng cho các dự án hạ tầng, đường giao thông, nhà xưởng quy mô lớn.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '1.150.000đ/c' },
        { label: '10 - 50 cuộn', value: '1.080.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Chiết khấu 15%', highlight: true }
      ],
      btnText: 'Xem chi tiết',
      btnClass: 'bg-[#1a365d] text-white hover:bg-[#2b6cb0]',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop',
      price: 1150000
    },
    {
      title: 'Nilon Lót Sàn 6zem',
      slug: 'nilon-lot-san-6zem',
      badge: 'CHUYÊN CÔNG TRÌNH NẶNG',
      badgeColor: 'bg-slate-800 text-white',
      desc: 'Độ dày vượt trội, chống thấm tuyệt đối và chống xé rách cực tốt. Dùng cho công trình đặc thù cao cấp.',
      prices: [
        { label: 'Dưới 10 cuộn', value: '1.650.000đ/c' },
        { label: '10 - 50 cuộn', value: '1.550.000đ/c' },
        { label: 'Trên 50 cuộn', value: 'Giá sỉ tận gốc', highlight: true }
      ],
      btnText: 'Xem chi tiết',
      btnClass: 'border border-slate-200 text-slate-700 hover:bg-[#f4f9fc]',
      image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1974&auto=format&fit=crop',
      price: 1650000
    }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; image: string; price?: number } | null>(null);

  const handleOpenModal = (p: { title: string; image: string; price?: number }) => {
    setSelectedProduct({
      id: p.title.toLowerCase().replace(/ /g, '-'),
      name: p.title,
      image: p.image,
      price: p.price
    });
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-[#f4f9fc] border-b border-slate-100">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-[#2b6cb0] uppercase tracking-widest block mb-2 font-heading">QUY CÁCH TIÊU CHUẨN</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 font-heading leading-[1.2]">Bảng Giá Nilon Lót Sàn Bê Tông</h2>
          <div className="w-16 h-1 bg-[#2b6cb0] mx-auto rounded-full"></div>
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
              className={`bg-white rounded-[12px] shadow-1 border ${product.featured ? 'border-[#2b6cb0] shadow-2 relative lg:-translate-y-2 z-10' : 'border-slate-200'} overflow-hidden flex flex-col group hover:shadow-2 transition-all duration-instant`}
            >
              <Link href={`/san-pham/${product.slug}`} className="relative h-52 bg-slate-100 overflow-hidden block">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {product.badge && (
                  <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-[12px] tracking-wider uppercase backdrop-blur-md shadow-1 ${product.badgeColor}`}>
                    {product.badge}
                  </div>
                )}
              </Link>

              <div className="p-6 flex-grow flex flex-col">
                <Link href={`/san-pham/${product.slug}`}>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 font-heading leading-[1.2] hover:text-[#2b6cb0] transition-colors">{product.title}</h3>
                </Link>
                <p className="text-slate-600 text-base mb-6 flex-grow leading-[1.6]">{product.desc}</p>

                <div className="space-y-3 mb-8 bg-[#f4f9fc] p-4 rounded-[12px] border border-slate-100">
                  {product.prices.map((price, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{price.label}</span>
                      <span className={`font-semibold font-mono ${price.highlight ? 'text-[#2b6cb0]' : 'text-slate-900'}`}>
                        {price.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 min-h-[44px] py-2.5 px-4 bg-[#2b6cb0] text-white rounded-[12px] font-semibold text-base transition-all hover:bg-[#3182ce] flex items-center justify-center gap-2 shadow-1 leading-none"
                  >
                    <ShoppingCart className="w-4 h-4" /> Báo giá
                  </motion.button>
                  <Link href={`/san-pham/${product.slug}`} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full min-h-[44px] py-2.5 px-4 rounded-[12px] font-semibold text-base transition-all flex items-center justify-center gap-1.5 leading-none ${product.btnClass}`}
                    >
                      <span>{product.btnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {selectedProduct && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </section>
  );
}
