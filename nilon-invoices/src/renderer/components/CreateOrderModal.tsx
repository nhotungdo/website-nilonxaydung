import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { useOrderStore } from '../stores/orderStore';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const createOrder = useOrderStore((s) => s.createOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbProducts, setDbProducts] = useState<Array<{ id: string; name: string; price: number; sku: string }>>([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  // Form states
  const [orderCode, setOrderCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<Array<{ name: string; price: number; quantity: number; productId?: string }>>([
    { name: '', price: 0, quantity: 1 }
  ]);

  // Load products from DB
  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      if (window.electronAPI?.database?.getProducts) {
        const res = await window.electronAPI.database.getProducts();
        if (res && res.success && res.data) {
          setDbProducts(res.data);
        }
      } else {
        // Fallback for web browser preview
        setDbProducts([
          { id: 'vat-tu-che-chan', name: 'Bạt che công trình', price: 15000, sku: 'SKU-BAT-CHE' },
          { id: 'gang-tay-soi', name: 'Găng tay sợi', price: 5000, sku: 'SKU-GANG-TAY-SOI' },
          { id: 'gang-tay-phu-cao-su', name: 'Găng tay phủ cao su', price: 15000, sku: 'SKU-GANG-TAY-PHU-CAO-SU' },
          { id: 'giay-bao-ho', name: 'Giày bảo hộ', price: 350000, sku: 'SKU-GIAY-BAO-HO' },
          { id: 'nilon-che-noi-that', name: 'Nilon che nội thất', price: 25000, sku: 'SKU-NILON-CHE' }
        ]);
      }
    };

    loadProducts();
    setOrderCode('NL-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setPaymentMethod('COD');
    setNote('');
    setItems([{ name: '', price: 0, quantity: 1 }]);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    setItems([...items, { name: '', price: 0, quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleItemSelect = (index: number, product: { id: string; name: string; price: number }) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { 
          ...item, 
          name: product.name, 
          price: product.price,
          productId: product.id 
        };
      }
      return item;
    });
    setItems(updatedItems);
    setActiveDropdownIndex(null);
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !orderCode.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    
    // Validate negative/invalid price or quantity across items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const nameLabel = item.name.trim() || `Sản phẩm ${i + 1}`;
      if (Number(item.price) < 0) {
        alert(`Lỗi: "${nameLabel}" có đơn giá âm (${item.price}đ). Đơn giá không được nhỏ hơn 0.`);
        return;
      }
      if (Number(item.quantity) <= 0) {
        alert(`Lỗi: "${nameLabel}" có số lượng không hợp lệ (${item.quantity}). Số lượng phải lớn hơn 0.`);
        return;
      }
    }

    // Check if at least one item is valid
    const validItems = items.filter(item => item.name.trim() !== '' && Number(item.price) >= 0 && Number(item.quantity) > 0);
    if (validItems.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 sản phẩm hợp lệ (với tên sản phẩm, đơn giá không âm và số lượng lớn hơn 0).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        orderCode,
        customerName,
        customerPhone,
        customerAddress,
        totalAmount,
        note,
        paymentMethod,
        items: validItems.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          unit: 'sp'
        }))
      });

      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        if (res.error?.includes('duplicate key value') || res.error?.includes('unique constraint')) {
          alert('Mã đơn hàng này đã tồn tại trên hệ thống. Vui lòng bấm vào nút xoay tròn bên cạnh trường nhập mã đơn hàng để sinh mã mới.');
        } else {
          alert(`Lỗi tạo đơn hàng: ${res.error}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`Đã xảy ra lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Tạo đơn hàng mới</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Nhập thông tin đơn hàng và danh sách sản phẩm cần tạo</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mã đơn hàng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={orderCode} 
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setOrderCode('NL-' + Math.random().toString(36).substring(2, 8).toUpperCase())}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#005B52] p-1 rounded transition-colors"
                  title="Tự tạo mã mới"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Phương thức thanh toán
              </label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]"
              >
                <option value="COD">COD (Thanh toán khi nhận hàng)</option>
                <option value="TRANSFER">Chuyển khoản ngân hàng</option>
                <option value="CASH">Tiền mặt tại cửa hàng</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Ví dụ: Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]" 
                required 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Ví dụ: 0901234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Địa chỉ giao hàng
            </label>
            <input 
              type="text" 
              placeholder="Nhập địa chỉ nhận hàng của khách..."
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Ghi chú đơn hàng
            </label>
            <input 
              type="text" 
              placeholder="Ghi chú đóng gói hoặc thông tin thêm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-[#005B52]" 
            />
          </div>

          {/* Product Items Table */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Danh sách sản phẩm ({items.length})
              </label>
              <button 
                type="button" 
                onClick={handleAddItemRow}
                className="text-xs font-bold text-[#005B52] hover:text-[#00473F] flex items-center gap-1 bg-[#005B52]/10 hover:bg-[#005B52]/20 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="h-3 w-3" /> Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0 relative">
                    <label className="block text-[9px] font-semibold text-slate-400 mb-0.5">Tên sản phẩm</label>
                    <input 
                      type="text" 
                      placeholder="Tìm sản phẩm..."
                      value={item.name}
                      onChange={(e) => {
                        handleItemChange(idx, 'name', e.target.value);
                        handleItemChange(idx, 'productId', undefined);
                      }}
                      onFocus={() => setActiveDropdownIndex(idx)}
                      onBlur={() => {
                        setTimeout(() => {
                          setActiveDropdownIndex(prev => prev === idx ? null : prev);
                        }, 250);
                      }}
                      className="w-full text-xs px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005B52]"
                      required
                      autoComplete="off"
                    />
                    {activeDropdownIndex === idx && (
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-250 rounded-lg shadow-lg z-50 py-1">
                        {dbProducts.filter(p => 
                          p.name.toLowerCase().includes(item.name.toLowerCase())
                        ).slice(0, 8).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleItemSelect(idx, p)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-700 flex justify-between items-center transition-colors border-b border-slate-100 last:border-0"
                          >
                            <span className="font-medium truncate mr-2">{p.name}</span>
                            <span className="text-[10px] text-[#005B52] font-semibold flex-shrink-0">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                            </span>
                          </button>
                        ))}
                        {dbProducts.filter(p => 
                          p.name.toLowerCase().includes(item.name.toLowerCase())
                        ).length === 0 && (
                          <div className="px-3 py-2 text-xs text-slate-400 italic">
                            Không tìm thấy sản phẩm nào
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="w-28">
                    <label className="block text-[9px] font-semibold text-slate-400 mb-0.5">Đơn giá (đ)</label>
                    <input 
                      type="number" 
                      min={0}
                      placeholder="0"
                      value={item.price || ''}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleItemChange(idx, 'price', isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      className="w-full text-xs px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-800"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[9px] font-semibold text-slate-400 mb-0.5">Số lượng</label>
                    <input 
                      type="number" 
                      min={1}
                      placeholder="1"
                      value={item.quantity || ''}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleItemChange(idx, 'quantity', isNaN(val) ? 1 : Math.max(1, val));
                      }}
                      className="w-full text-xs px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-800"
                      required
                    />
                  </div>
                  <div className="w-24 text-right pr-2">
                    <label className="block text-[9px] font-semibold text-slate-400 mb-0.5">Thành tiền</label>
                    <span className="text-xs font-bold text-slate-750 block py-1.5">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price) * Number(item.quantity))}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    disabled={items.length === 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-4 self-center disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Action Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tổng thanh toán đơn hàng</span>
              <span className="text-xl font-black text-[#005B52]">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
            </div>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#005B52] hover:bg-[#00473F] disabled:bg-[#005B52]/50 text-white transition-all shadow-md shadow-[#005B52]/10 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang tạo...
                  </>
                ) : 'Tạo đơn hàng'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
