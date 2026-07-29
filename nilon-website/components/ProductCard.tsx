"use client";
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import AddToCartModal from './AddToCartModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    image: string;
    categorySlug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <motion.div 
      className="group bg-white rounded-[12px] border border-slate-200/80 shadow-1 hover:shadow-2 hover:border-[#2b6cb0]/40 transition-all duration-instant overflow-hidden flex flex-col relative"
      whileHover="hover"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
      }}
    >
      <Link href={`/san-pham/${product.slug}`} className="block relative aspect-square bg-[#f4f9fc] overflow-hidden border-b border-slate-100">
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full"
          variants={{
            hidden: { scale: 1 },
            hover: { scale: 1.06 }
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <div className="absolute top-3 left-3 bg-[#1a365d]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-[12px] uppercase tracking-wider shadow-1">
          {product.categorySlug === 'nilon-lot-san-be-tong' ? 'Nilon Lót Sàn' : 'Bảo Hộ'}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <Link href={`/san-pham/${product.slug}`}>
            <h3 className="font-heading font-semibold text-slate-900 text-xl mb-2 line-clamp-2 group-hover:text-[#2b6cb0] transition-colors leading-[1.2]">
              {product.name}
            </h3>
          </Link>
          <div className="text-sm text-slate-500 mb-4 font-mono">
            Quy cách chuẩn công trình
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Giá từ</span>
            <div className="font-bold text-[#2b6cb0] text-lg font-mono">
              {formatPrice(product.price)} <span className="text-xs font-normal text-slate-500">/{product.unit}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="min-h-[44px] text-base bg-[#2b6cb0] hover:bg-[#3182ce] text-white px-5 py-2.5 rounded-[12px] font-semibold transition-all inline-flex items-center gap-1.5 shadow-1 leading-none"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Báo giá</span>
            </button>
            <Link 
              href={`/san-pham/${product.slug}`}
              className="min-h-[44px] text-base bg-slate-100 text-slate-700 hover:bg-slate-200 px-3.5 py-2.5 rounded-[12px] font-semibold transition-all inline-flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>

    <AddToCartModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      product={{ id: product.id, name: product.name, image: product.image }}
    />
    </>
  );
}
