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

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

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
                href="tel:0901234567"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-md text-center transition-colors"
              >
                Gọi Mua Ngay
              </a>
              <a
                href="https://zalo.me/0901234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md text-center transition-colors"
              >
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
