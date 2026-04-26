import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Tất cả sản phẩm',
  description: 'Danh sách các sản phẩm nilon lót sàn bê tông và bảo hộ lao động.',
});

export default function ProductsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tất Cả Sản Phẩm</h1>
          <p className="text-gray-600">Hiển thị {products.length} sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
