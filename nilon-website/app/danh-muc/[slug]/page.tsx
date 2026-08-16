import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { categories } from '@/data/categories';
import ProductCard from '@/components/ProductCard';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = categories.find((c) => c.slug === resolvedParams.slug);
  
  if (!category) return {};

  return generateSEO({
    title: category.name,
    description: category.description,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await prisma.product.findMany({
    where: { categorySlug: category.slug },
  });

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Hiện chưa có sản phẩm nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
