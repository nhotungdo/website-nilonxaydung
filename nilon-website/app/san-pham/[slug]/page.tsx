import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/formatPrice';
import { generateSEO } from '@/lib/seo';
import ProductDetailActions from '@/components/ProductDetailActions';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });
  
  if (!product) return {};

  return generateSEO({
    title: product.name,
    description: product.description || '',
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) {
    // Fallback search by id
    product = await prisma.product.findUnique({
      where: { id: resolvedParams.slug },
    });
  }

  if (!product) {
    notFound();
  }

  // Parse specs if they exist as JSON
  let parsedSpecs: {label: string, value: string}[] = [];
  if (product.specs) {
    try {
      parsedSpecs = typeof product.specs === 'string' 
        ? JSON.parse(product.specs) 
        : product.specs as {label: string, value: string}[];
    } catch { }
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
              <span className="text-sm font-medium text-[#2b6cb0] bg-[#f4f9fc] border border-[#2b6cb0]/20 px-3 py-1 rounded-[12px] uppercase tracking-wider">
                {product.categorySlug === 'nilon-lot-san-be-tong' ? 'Nilon Lót Sàn' : 'Bảo Hộ'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="text-3xl font-bold text-[#2b6cb0] mb-6">
              {formatPrice(product.price)} <span className="text-lg font-normal text-gray-500">/{product.unit}</span>
            </div>

            <div className="prose prose-blue mb-8 text-gray-600">
              <p>{product.description}</p>
            </div>

            {parsedSpecs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Thông số kỹ thuật</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {parsedSpecs.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : ''}>
                          <td className="py-2 px-3 font-medium text-gray-700 w-1/3">{spec.label}</td>
                          <td className="py-2 px-3 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <ProductDetailActions product={{ id: product.id, name: product.name, image: product.image }} />

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
