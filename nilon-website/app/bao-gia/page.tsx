"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingCart, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { isValidVnPhone, VN_PHONE_ERROR_MSG } from "@/lib/validations/phone";

export default function QuotePage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    // Validate số điện thoại Việt Nam
    if (!isValidVnPhone(formData.phone)) {
      toast.error(VN_PHONE_ERROR_MSG);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items,
          totalAmount,
        }),
      });

      if (res.ok) {
        toast.success("Yêu cầu của bạn đã được gửi!", {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
          }
        });
        clearCart();
        router.push("/");
      } else {
        throw new Error("Lỗi khi gửi yêu cầu");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ Zalo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50 py-12"></div>;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Chưa có sản phẩm nào</h1>
        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào danh sách yêu cầu báo giá.</p>
        <Link 
          href="/danh-muc/bao-ho-lao-dong"
          className="bg-[#0B2147] hover:bg-stone-900 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Quay lại xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B2147] mb-8">Yêu cầu báo giá</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm ({items.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover mix-blend-multiply" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4">
                        <div><span className="font-medium text-gray-800">Độ dày:</span> {item.thickness}</div>
                        <div><span className="font-medium text-gray-800">Kích thước:</span> {item.size}</div>
                        {item.note && <div className="col-span-2 text-[#2b6cb0]"><span className="font-medium text-gray-800">Ghi chú:</span> {item.note}</div>}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-700 text-sm">Số lượng:</span>
                          <div className="flex border border-gray-300 rounded-[12px] overflow-hidden h-9 w-32">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 flex items-center justify-center bg-[#f4f9fc] hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-full text-center font-bold text-gray-800 outline-none border-x border-gray-200"
                              min="1"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 flex items-center justify-center bg-[#f4f9fc] hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Thành tiền</div>
                          <div className="font-bold text-[#2b6cb0] text-lg font-mono">
                            {item.price ? formatPrice(item.price * item.quantity) : "Liên hệ"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary & Form */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-[12px] shadow-1 border border-gray-100 p-6 lg:p-8 sticky top-28 space-y-8">
              {/* Price Summary */}
              <div className="bg-[#f4f9fc] p-6 rounded-[12px] border border-gray-100">
                <h2 className="text-lg font-bold text-[#1a365d] mb-4 font-heading">Tổng cộng đơn hàng</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({items.length} sản phẩm)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-sm italic">Liên hệ sau</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                    <span className="font-bold text-[#1a365d] font-heading">Tổng thanh toán</span>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-[#2b6cb0] leading-none font-mono">
                        {formatPrice(totalAmount)}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 italic">(Giá đã bao gồm VAT nếu có)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] mb-6 flex items-center gap-2 font-heading">
                  Thông tin liên hệ
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nhập họ tên của bạn"
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="09xx..."
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@..."
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ giao hàng / Công trình</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Nhập địa chỉ..."
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Yêu cầu khác (nếu có)</label>
                    <textarea 
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      placeholder="Ghi chú về thời gian giao hàng, VAT..."
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#fc6c29] focus:ring-1 focus:ring-[#fc6c29] transition-all bg-gray-50 focus:bg-white resize-none h-24"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-[#fc6c29] hover:bg-[#e65a1f] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Gửi yêu cầu báo giá
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Chúng tôi sẽ liên hệ lại với bạn trong vòng 15 phút.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

