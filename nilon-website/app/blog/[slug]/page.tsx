import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import { generateSEO } from '@/lib/seo';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  
  if (!post) return {};

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }


  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/blog" className="hover:text-blue-600 transition-colors">Tin tức</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 line-clamp-1">{post.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-4">📅 {new Date(post.date).toLocaleDateString('vi-VN')}</span>
              <span>Đăng bởi: Nilon Xây Dựng</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-10 border border-gray-200">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <article 
            className="prose prose-lg prose-blue max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share & Tags (Optional) */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div className="font-semibold text-gray-900">Chia sẻ bài viết:</div>
            <div className="flex space-x-4">
              <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                FB
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                Zalo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
