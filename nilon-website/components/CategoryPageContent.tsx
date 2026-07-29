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
  ChevronDown,
  HardHat,
  Hand,
  Footprints,
  Shirt,
  Construction,
  Wrench,
  Paintbrush,
  LifeBuoy,
  Shield,
  Filter
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PRODUCTS, Product } from "@/data/products";
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
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Split categories for compact vs expanded view
  const INITIAL_CATEGORY_COUNT = 5;
  const visibleCategories = useMemo(() => {
    return showAllCategories ? CATEGORIES : CATEGORIES.slice(0, INITIAL_CATEGORY_COUNT);
  }, [showAllCategories]);

  const hiddenCategoryCount = CATEGORIES.length - INITIAL_CATEGORY_COUNT;

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
        borderRadius: '12px',
        background: '#fff',
        color: '#1E3A8A',
        fontWeight: 'bold'
      },
    });
  };

  return (
    <div className="bg-[#f4f9fc]/50 min-h-screen pb-20 pt-6">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: "Bảo hộ lao động & Vật tư" }]} />
        </div>

        {/* Compact Header & Category Control Bar */}
        <section className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-1 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input Bar */}
            <div className="relative flex-grow max-w-md">
              <input 
                type="text" 
                placeholder="Tìm sản phẩm bảo hộ, nilon lót sàn..."
                className="w-full pl-11 pr-4 py-3 min-h-[44px] rounded-[12px] border border-slate-300 focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] transition-all outline-none bg-[#f4f9fc] text-base placeholder:text-sm leading-[1.5]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-[#f4f9fc] rounded-[12px] border border-[#2b6cb0]/20 text-[#1a365d]">
              <ShieldCheck className="w-5 h-5 text-[#2b6cb0] shrink-0" />
              <span className="text-sm font-medium">Cam kết chất lượng - Giao hàng tận nơi</span>
            </div>
          </div>

          {/* Compact Category Chips with Show More toggle */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#2b6cb0]" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">Lọc theo nhóm sản phẩm</span>
              </div>
              <button 
                onClick={() => setActiveCategory("all")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${activeCategory === "all" ? 'text-[#2b6cb0] font-bold' : 'text-slate-500 hover:text-[#1a365d]'}`}
              >
                Tất cả ({PRODUCTS.length})
              </button>
            </div>

            {/* Category Chips Container */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 min-h-[40px] rounded-[12px] text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === "all"
                    ? 'bg-[#2b6cb0] text-white shadow-1 font-semibold'
                    : 'bg-[#f4f9fc] text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Tất cả sản phẩm</span>
              </button>

              {visibleCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 min-h-[40px] rounded-[12px] text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === cat.id 
                    ? 'bg-[#2b6cb0] text-white shadow-1 font-semibold' 
                    : 'bg-white text-slate-700 hover:bg-[#f4f9fc] border border-slate-200'
                  }`}
                >
                  <CategoryIcon id={cat.id} className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-[#2b6cb0]'}`} />
                  <span>{cat.title}</span>
                </button>
              ))}

              {/* Show More / Show Less Toggle Button */}
              {hiddenCategoryCount > 0 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-3.5 py-2 min-h-[40px] rounded-[12px] text-sm font-semibold text-[#2b6cb0] bg-[#f4f9fc] hover:bg-blue-100/60 border border-[#2b6cb0]/30 transition-all flex items-center gap-1.5"
                >
                  <span>{showAllCategories ? "Thu gọn" : `+ Xem thêm (${hiddenCategoryCount})`}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllCategories ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Above-The-Fold Main Products Display */}
        {searchTerm === "" && activeCategory === "all" && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#2b6cb0]/10 p-2.5 rounded-[12px] text-[#2b6cb0]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-heading leading-[1.2]">Sản Phẩm Bán Chạy Nhất</h2>
                  <p className="text-slate-500 text-sm">Các mặt hàng bảo hộ và nilon lót sàn được nhà thầu tin dùng nhiều nhất.</p>
                </div>
              </div>
            </div>

            {/* Responsive Grid: 5 cols Desktop, 3 Tablet, 2 Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {PRODUCTS.filter(p => p.isBestSeller).slice(0, 5).map(product => (
                <ProductItem key={`featured-${product.id}`} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </section>
        )}

        {/* Priority Categories Section */}
        {priorityCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1a365d]/10 p-2.5 rounded-[12px] text-[#1a365d]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-heading leading-[1.2]">Giải Pháp Che Chắn Công Trình</h2>
                <p className="text-slate-500 text-sm">Vật tư nilon lót sàn bê tông và bạt phủ chất lượng cao.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
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

        {/* Other Categories Sections */}
        {categoriesWithProducts.filter(cat => !cat.priority).length > 0 && (
          <div className="space-y-10">
            {categoriesWithProducts.filter(cat => !cat.priority).map(cat => (
              <CategorySection 
                key={cat.id} 
                category={cat} 
                products={cat.products} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[12px] border border-slate-200 shadow-1">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
            <h3 className="text-xl font-bold text-slate-800 font-heading">Không tìm thấy sản phẩm nào</h3>
            <p className="text-slate-500 text-base mt-2">Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
              className="mt-6 min-h-[44px] px-6 py-2.5 bg-[#2b6cb0] text-white font-semibold text-base rounded-[12px] hover:bg-[#3182ce] transition-all shadow-1"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        {/* Combo Savings Section */}
        <section className="mt-16 bg-white rounded-[12px] p-6 lg:p-10 border border-slate-200 shadow-1">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-[#2b6cb0] uppercase tracking-widest block mb-1 font-heading">GÓI VẬT TƯ TIẾT KIỆM</span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading leading-[1.2]">Combo Vật Tư Thi Công Trọn Gói</h2>
              <p className="text-slate-500 text-sm mt-1">Giải pháp kết hợp tiết kiệm chi phí tối đa cho nhà thầu.</p>
            </div>
            <Link href="/lien-he" className="min-h-[44px] bg-[#f4f9fc] hover:bg-slate-100 text-[#2b6cb0] px-5 py-2.5 rounded-[12px] font-semibold text-base transition-all flex items-center gap-2 border border-[#2b6cb0]/20">
              <span>Tư vấn gói combo</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f4f9fc] p-6 rounded-[12px] border border-slate-200 shadow-1 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-8 h-8 text-[#2b6cb0] mb-3" />
                <h3 className="font-semibold text-lg text-slate-900 mb-2 font-heading leading-[1.2]">Combo An Toàn Cơ Bản</h3>
                <ul className="text-sm text-slate-600 space-y-2 mb-6 leading-[1.6]">
                  <li>• Mũ bảo hộ công trình (10 cái)</li>
                  <li>• Găng tay sợi phủ sơn (50 đôi)</li>
                  <li>• Áo phản quang kỹ sư (5 cái)</li>
                </ul>
              </div>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full min-h-[44px] bg-[#2b6cb0] text-white rounded-[12px] font-semibold text-base hover:bg-[#3182ce] transition-colors shadow-1 leading-none">
                Nhận báo giá combo
              </button>
            </div>

            <div className="bg-[#f4f9fc] p-6 rounded-[12px] border border-[#2b6cb0]/40 shadow-2 flex flex-col justify-between relative">
              <div className="absolute top-3 right-3 bg-[#2b6cb0] text-white text-xs font-semibold px-2.5 py-1 rounded-[12px] uppercase">Bán chạy</div>
              <div>
                <TrendingUp className="w-8 h-8 text-[#2b6cb0] mb-3" />
                <h3 className="font-semibold text-lg text-slate-900 mb-2 font-heading leading-[1.2]">Combo Che Chắn Sàn</h3>
                <ul className="text-sm text-slate-600 space-y-2 mb-6 leading-[1.6]">
                  <li>• Cuộn Nilon lót sàn (5 cuộn)</li>
                  <li>• Băng keo dán nền (10 cuộn)</li>
                  <li>• Bạt che công trình (2 tấm)</li>
                </ul>
              </div>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full min-h-[44px] bg-[#1a365d] text-white rounded-[12px] font-semibold text-base hover:bg-[#2b6cb0] transition-colors shadow-1 leading-none">
                Nhận báo giá combo
              </button>
            </div>

            <div className="bg-[#f4f9fc] p-6 rounded-[12px] border border-slate-200 shadow-1 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-8 h-8 text-[#2b6cb0] mb-3" />
                <h3 className="font-semibold text-lg text-slate-900 mb-2 font-heading leading-[1.2]">Combo Hoàn Thiện Nội Thất</h3>
                <ul className="text-sm text-slate-600 space-y-2 mb-6 leading-[1.6]">
                  <li>• Nilon che nội thất (10 cuộn)</li>
                  <li>• Băng keo giấy che sơn (10 cuộn)</li>
                  <li>• Khăn lau công nghiệp (5kg)</li>
                </ul>
              </div>
              <button onClick={() => setIsQuoteModalOpen(true)} className="w-full min-h-[44px] bg-[#2b6cb0] text-white rounded-[12px] font-semibold text-base hover:bg-[#3182ce] transition-colors shadow-1 leading-none">
                Nhận báo giá combo
              </button>
            </div>
          </div>
        </section>

      </div>

      <QuickQuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </div>
  );
}

function CategorySection({ 
  category, 
  products, 
  onAddToCart,
  isPriority = false 
}: { 
  category: typeof CATEGORIES[0], 
  products: Product[], 
  onAddToCart: (p: Product) => void,
  isPriority?: boolean
}) {
  return (
    <motion.div 
      id={category.id} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-[12px] shrink-0 ${isPriority ? 'bg-[#2b6cb0] text-white shadow-1' : 'bg-[#1a365d] text-white'}`}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight font-heading leading-[1.2]">{category.title}</h2>
              {isPriority && <span className="bg-[#f4f9fc] text-[#2b6cb0] text-xs font-semibold px-2.5 py-0.5 rounded-[12px] border border-[#2b6cb0]/20 font-heading">ƯU TIÊN</span>}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{category.description}</p>
          </div>
        </div>
        <Link href={`/lien-he`} className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#2b6cb0] hover:text-[#1a365d] transition-colors uppercase tracking-wider">
          <span>Tư vấn nhóm này</span> <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: 5 cols on Desktop, 3 on Tablet, 2 on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-[12px] border border-slate-200/80 overflow-hidden shadow-1 hover:shadow-2 hover:border-[#2b6cb0]/40 transition-all duration-instant flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f9fc] border-b border-slate-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        
        {product.isBestSeller && (
          <div className="absolute top-2.5 left-2.5 bg-[#2b6cb0] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[12px] shadow-1 flex items-center gap-1 uppercase tracking-wider font-heading">
            <TrendingUp className="w-3 h-3" />
            <span>Bán chạy</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/san-pham/${product.slug || product.id}`}>
            <h3 className="font-heading font-semibold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-[#2b6cb0] transition-colors leading-[1.2]">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{product.description || "Vật tư đạt tiêu chuẩn chất lượng công trình."}</p>
        </div>
        
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Giá từ</span>
            <span className="text-[#2b6cb0] font-bold text-lg font-mono">
              {product.price ? formatPrice(product.price) : "Liên hệ"}
            </span>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full min-h-[44px] py-2.5 bg-[#2b6cb0] hover:bg-[#3182ce] text-white rounded-[12px] font-semibold text-base shadow-1 transition-colors flex items-center justify-center gap-2 leading-none"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Thêm vào báo giá</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
