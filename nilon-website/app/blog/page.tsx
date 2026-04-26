import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Tin tức & Kinh nghiệm',
  description: 'Cập nhật tin tức và kinh nghiệm về nilon lót sàn bê tông và bảo hộ lao động.',
});

export default function BlogPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tin Tức & Kinh Nghiệm</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tổng hợp các kiến thức chuyên ngành, hướng dẫn lựa chọn sản phẩm và các tin tức mới nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.slug}`} className="block aspect-video bg-gray-200 overflow-hidden relative">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString('vi-VN')}</div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center">
                  Đọc tiếp 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
