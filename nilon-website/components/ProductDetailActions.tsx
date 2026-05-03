"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import AddToCartModal from "./AddToCartModal";

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    image: string;
  };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-md text-center transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Thêm vào báo giá
        </button>
        <a
          href={`https://zalo.me/0931982568?text=Tôi quan tâm đến sản phẩm: ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md text-center transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.047 3.01C7.82 3.01 4.388 5.432 4.388 8.42c0 1.636.945 3.093 2.417 4.103-.13.475-.465 1.705-.533 1.956-.1.353.116.34.243.257.1-.065 1.595-1.077 2.228-1.51.433.125.885.19 1.348.19 4.228 0 7.659-2.422 7.659-5.41 0-2.988-3.431-5.41-7.659-5.41l-.046-.006zm3.327 7.91l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.327-1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002zm-3.328 1.53l-1.396-1.53c-.11-.122-.16-.27-.14-.424l.115-.967c.02-.153.132-.284.286-.328.155-.044.318.006.425.122l1.396 1.53c.11.12.16.268.14.423l-.115.967c-.02.154-.132.285-.286.33-.153.04-.316-.01-.425-.125l-.015.002z" />
          </svg>
          Chat Zalo Tư Vấn
        </a>
      </div>
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
