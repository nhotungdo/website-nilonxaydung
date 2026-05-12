"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  HardHat,
  Hand,
  Footprints,
  Shirt,
  Construction,
  Wrench,
  Paintbrush,
  LifeBuoy,
  Shield
} from "lucide-react";

// Helper to map icon names to components
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PRODUCTS, Product, Category } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickQuoteModal from "@/components/QuickQuoteModal";
import { formatPrice } from "@/lib/formatPrice";

// Helper to map icon names to components
const CategoryIcon = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case "vat-tu-che-chan": return <Shield className={className} />;
    case "bao-ho-dau": return <HardHat className={className} />;
    case "bao-ho-tay": return <Hand className={className} />;
    case "bao-ho-chan": return <Footprints className={className} />;
    case "quan-ao-bao-ho": return <Shirt className={className} />;
    case "thiet-bi-chong-roi": return <LifeBuoy className={className} />;
    case "thiet-bi-an-toan-khac": return <Construction className={className} />;
    case "dung-cu-cam-tay": return <Wrench className={className} />;
    case "ho-tro-son-noi-that": return <Paintbrush className={className} />;
    default: return <Package className={className} />;
  }
};

export default function CategoryPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Filter products based on search term and active category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "all" || product.subCategory === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Group products by category for the main display
  const categoriesWithProducts = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      products: filteredProducts.filter(p => p.subCategory === cat.id)
    })).filter(cat => activeCategory === "all" ? cat.products.length > 0 : cat.id === activeCategory);
  }, [filteredProducts, activeCategory]);

  // Priority categories (Vật tư che chắn)
  const priorityCategories = categoriesWithProducts.filter(cat => cat.priority);
  const otherCategories = categoriesWithProducts.filter(cat => !cat.priority);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      thickness: "Tiêu chuẩn",
      size: "Tiêu chuẩn",
      quantity: 1,
      note: "",
      price: product.price,
    });
    
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#0B2147',
        fontWeight: 'bold'
      },
    });
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20 pt-8">
      {/* Category Navigation Hub */}
      <section className="relative z-20 mb-12">
        <div className="container max-w-[1280px] mx-auto px-4">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: "Bảo hộ lao động" }]} />
          </div>
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 lg:p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Search & Title */}
              <div className="lg:w-1/3 space-y-6 lg:border-r lg:border-gray-100 lg:pr-8">
                <div>
                  <h3 className="text-xl font-bold text-[#0B2147] mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-orange-600" />
                    Tìm kiếm nhanh
                  </h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tên sản phẩm bảo hộ..."
                      className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-gray-50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0B2147] text-white p-1.5 rounded-lg">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-orange-900 text-sm">Chất lượng cam kết</span>
                    </div>
                    <p className="text-xs text-orange-800 leading-relaxed">Tất cả sản phẩm đều đạt chứng chỉ an toàn lao động, độ bền cao cho môi trường xây dựng.</p>
                  </div>
                </div>
              </div>

              {/* Right: Category Grid */}
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Danh mục sản phẩm</h3>
                  <button 
                    onClick={() => setActiveCategory("all")}
                    className={`text-sm font-bold transition-colors ${activeCategory === "all" ? 'text-orange-600' : 'text-gray-400 hover:text-[#0B2147]'}`}
                  >
                    Xem tất cả
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border-2 text-center group ${
                        activeCategory === cat.id 
                        ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-md shadow-orange-100' 
                        : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-blue-100 hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl mb-3 transition-colors ${
                        activeCategory === cat.id ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50'
                      }`}>
                        <CategoryIcon id={cat.id} className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase leading-tight tracking-wide">{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-[1280px] mx-auto px-4 py-12">
        {/* Featured Products Section */}
        {searchTerm === "" && activeCategory === "all" && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#0B2147] uppercase tracking-wide">Sản phẩm nổi bật</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {PRODUCTS.filter(p => p.isBestSeller).slice(0, 5).map(product => (
                <ProductItem key={`featured-${product.id}`} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </section>
        )}

        {/* Priority Section */}
        {priorityCategories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ShieldCheck className="text-orange-600 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2147] uppercase tracking-wide">Giải pháp che chắn & bảo vệ công trình toàn diện</h2>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {priorityCategories.map(cat => (
                <CategorySection 
                  key={cat.id} 
                  category={cat} 
                  products={cat.products} 
                  onAddToCart={handleAddToCart} 
                  isPriority
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Categories */}
        <div className="grid grid-cols-1 gap-16">
          {otherCategories.map(cat => (
            <CategorySection 
              key={cat.id} 
              category={cat} 
              products={cat.products} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-gray-400">Vui lòng thử lại với từ khóa khác.</p>
          </div>
        )}

        {/* Highlight Section: Khách hàng thường mua cùng */}
        <section className="mt-24 bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0B2147] mb-2 uppercase tracking-wide">Khách hàng thường mua cùng</h2>
              <p className="text-gray-500">Các gói combo vật tư tiết kiệm và đồng bộ cho công trình.</p>
            </div>
            <Link href="/lien-he" className="text-orange-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Tư vấn combo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-blue-50">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Combo An Toàn Cơ Bản</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Mũ bảo hộ công trình (10 cái)</li>
                <li>• Găng tay sợi phủ sơn (50 đôi)</li>
                <li>• Áo phản quang kỹ sư (5 cái)</li>
              </ul>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">Nhận báo giá combo</button>
            </div>
            <div className="bg-[#fcf8f6] p-6 rounded-xl border border-orange-50">
              <TrendingUp className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Combo Che Chắn Sàn</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Cuộn Nilon lót sàn (5 cuộn)</li>
                <li>• Băng keo dán nền (10 cuộn)</li>
                <li>• Bạt che công trình (2 tấm)</li>
              </ul>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">Nhận báo giá combo</button>
            </div>
            <div className="bg-[#f8fcf8] p-6 rounded-xl border border-green-50">
              <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Combo Hoàn Thiện Nội Thất</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Nilon che nội thất (10 cuộn)</li>
                <li>• Băng keo giấy che sơn (10 cuộn)</li>
                <li>• Khăn lau công nghiệp (5kg)</li>
              </ul>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">Nhận báo giá combo</button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-[#0B2147] rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative z-10 px-8 py-16 lg:py-20 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Liên hệ ngay để nhận báo giá vật tư & bảo hộ công trình</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Chúng tôi hỗ trợ chiết khấu tốt nhất cho các dự án và nhà thầu xây dựng. Giao hàng nhanh chóng tận nơi.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-10 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 shadow-xl shadow-orange-900/20 transition-all hover:-translate-y-1"
              >
                Nhận báo giá ngay
              </button>
              <Link 
                href="/lien-he"
                className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                Tư vấn kỹ thuật
              </Link>
            </div>
          </div>
        </motion.section>
      </div>

      <QuickQuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </div>
  );
}

function CategorySection({ category, products, onAddToCart, isPriority = false }: { category: Category, products: Product[], onAddToCart: (p: Product) => void, isPriority?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id={category.id}
      className={`relative scroll-mt-24 ${isPriority ? 'bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-orange-100' : ''}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${isPriority ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-[#0B2147] text-white'}`}>
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-bold text-[#0B2147] uppercase tracking-tight">{category.title}</h2>
              {isPriority && <span className="bg-orange-100 text-orange-700 text-[11px] font-extrabold px-3 py-1 rounded-full border border-orange-200">BÁN CHẠY NHẤT</span>}
            </div>
            <p className="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed">{category.description}</p>
          </div>
        </div>
        <Link href={`/lien-he`} className="hidden md:flex items-center gap-2 text-sm font-bold text-[#0B2147] hover:text-orange-600 transition-colors uppercase tracking-wider">
          Tư vấn nhóm này <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </motion.div>
  );
}

function ProductItem({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <TrendingUp className="w-3 h-3" />
            <span>BÁN CHẠY</span>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 bg-white text-[#0B2147] rounded-xl font-bold text-sm shadow-xl hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-[#0B2147] text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mb-4">{product.description || "Thiết bị bảo hộ đạt tiêu chuẩn chất lượng cao."}</p>
        </div>
        
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Giá tham khảo</span>
            <span className="text-orange-600 font-extrabold text-lg">
              {product.price ? formatPrice(product.price) : "Liên hệ"}
            </span>
          </div>
          
          <Link 
            href={`/san-pham/${product.id}`}
            className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-[#0B2147] hover:text-white transition-all duration-300"
            title="Xem chi tiết"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
