"use client";
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col"
      whileHover="hover"
      initial="initial"
    >
      <Link href={`/san-pham/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {/* Using standard img instead of Next Image to avoid config issues for now, since we have mock paths */}
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full"
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.1 }
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute inset-0 bg-black/10"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/danh-muc/${product.categorySlug}`} className="text-xs text-gray-500 uppercase tracking-wider hover:text-blue-600 mb-1 block">
          {product.categorySlug === 'nilon-lot-san-be-tong' ? 'Nilon Lót Sàn' : 'Bảo Hộ'}
        </Link>
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div className="font-bold text-orange-600 text-lg">
            {formatPrice(product.price)} <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
          </div>
          <motion.div
            variants={{
              initial: { y: 15, opacity: 0 },
              hover: { y: 0, opacity: 1 }
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link 
              href={`/san-pham/${product.slug}`}
              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-md font-medium transition-colors inline-block"
            >
              Chi tiết
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
