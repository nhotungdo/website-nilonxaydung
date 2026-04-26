import Link from 'next/link';

export default function BlogSection() {
  const categories = [
    { name: 'Kỹ thuật thi công', count: 12, active: true },
    { name: 'Báo giá vật liệu', count: 8 },
    { name: 'Tiêu chuẩn ISO', count: 5 },
    { name: 'Tin tức công trường', count: 15 },
  ];

  const posts = [
    {
      id: 1,
      tag: 'KỸ THUẬT',
      tagColor: 'bg-orange-500',
      title: 'Tại sao cần nilon lót sàn bê tông?',
      excerpt: 'Việc sử dụng nilon lót sàn trước khi đổ bê tông không chỉ giúp ngăn nước thoát nhanh mà còn bảo vệ kết cấu thép khỏi bị ox...',
      date: '15/10/2023',
      views: '2.4K',
      image: 'https://images.unsplash.com/photo-1618090584126-129cd1f3f40f?q=80&w=1974&auto=format&fit=crop',
    },
    {
      id: 2,
      tag: 'SẢN PHẨM',
      tagColor: 'bg-blue-800',
      title: 'So sánh nilon 2zem vs 3zem',
      excerpt: 'Lựa chọn độ dày nilon lót sàn phù hợp giúp tối ưu chi phí và đảm bảo chất lượng thi công. Bài viết phân tích ưu nhược điể...',
      date: '12/10/2023',
      views: '1.8K',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop',
    },
    {
      id: 3,
      tag: 'THỊ TRƯỜNG',
      tagColor: 'bg-green-600',
      title: 'Báo giá nilon mới nhất',
      excerpt: 'Cập nhật bảng giá nilon lót sàn, màng PE chống thấm cho các đại lý và nhà thầu xây dựng. Ưu đãi chiết khấu cao cho đơn ...',
      date: '10/10/2023',
      views: '5.2K',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9ff]">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-primary mb-4 leading-tight">Kiến thức Kỹ thuật & Vật liệu</h2>
          <p className="text-gray-600 text-lg">
            Cập nhật những thông tin mới nhất về tiêu chuẩn thi công, báo giá vật liệu và hướng dẫn sử dụng nilon lót sàn cho các công trình trọng điểm.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                Danh mục
              </h3>
              <ul className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {categories.map((cat, index) => (
                  <li key={index} className={`flex justify-between items-center p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${cat.active ? 'bg-blue-50/50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Tư vấn miễn phí</h3>
              <p className="text-blue-200 text-sm mb-6 relative z-10">Liên hệ ngay để nhận bảng tính định mức vật tư cho công trình của bạn.</p>
              <button className="w-full bg-secondary-container hover:bg-[#e65a1f] text-white font-bold py-3 rounded-md transition-colors text-sm shadow-md relative z-10">
                NHẬN BÁO GIÁ NGAY
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-3/4 flex flex-col space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-2/5 md:w-1/3 aspect-[4/3] sm:aspect-auto">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider ${post.tagColor}`}>
                    {post.tag}
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center flex-grow">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      {post.views}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-secondary transition-colors mt-auto">
                    Xem chi tiết
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 pt-8">
              <button className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 bg-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-10 h-10 rounded bg-primary text-white font-bold flex items-center justify-center">1</button>
              <button className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium">2</button>
              <button className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium">3</button>
              <button className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 bg-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
