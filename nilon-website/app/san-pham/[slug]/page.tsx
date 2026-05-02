import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/formatPrice';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);
  
  if (!product) return {};

  return generateSEO({
    title: product.name,
    description: product.description,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }


  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.categorySlug === 'nilon-lot-san-be-tong' ? 'Nilon Lót Sàn' : 'Bảo Hộ'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="text-3xl font-bold text-orange-600 mb-6">
              {formatPrice(product.price)} <span className="text-lg font-normal text-gray-500">/{product.unit}</span>
            </div>

            <div className="prose prose-blue mb-8 text-gray-600">
              <p>{product.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:0931982568"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-md text-center transition-colors"
              >
                Gọi Mua Ngay
              </a>
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

            <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500 space-y-2">
              <p>✓ Giao hàng toàn quốc.</p>
              <p>✓ Đảm bảo chất lượng 100%.</p>
              <p>✓ Giá tốt nhất cho đơn hàng số lượng lớn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
