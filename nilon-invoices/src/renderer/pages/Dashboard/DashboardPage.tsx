import React from 'react';
import { 
  Plus,
  RefreshCw,
  Trash2,
  ShoppingBag,
  FileSpreadsheet,
  Wallet,
  TrendingUp,
  Crown,
  User,
  ChevronDown,
  Printer,
  CheckCircle,
  Award
} from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore';
import { useQueueStore } from '../../stores/queueStore';

export const DashboardPage: React.FC = () => {
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const reprintJob = useQueueStore((s) => s.reprintJob);

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const createOrder = useOrderStore((s) => s.createOrder);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dbProducts, setDbProducts] = React.useState<Array<{ id: string; name: string; price: number; sku: string }>>([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState<number | null>(null);

  // Form states
  const [orderCode, setOrderCode] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerAddress, setCustomerAddress] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('COD');
  const [note, setNote] = React.useState('');
  const [items, setItems] = React.useState<Array<{ name: string; price: number; quantity: number; productId?: string }>>([
    { name: '', price: 0, quantity: 1 }
  ]);

  // Load products from DB
  React.useEffect(() => {
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
    fetchOrders();
  }, [showCreateModal]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (showCreateModal) {
      setOrderCode('NL-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setPaymentMethod('COD');
      setNote('');
      setItems([{ name: '', price: 0, quantity: 1 }]);
    }
  }, [showCreateModal]);

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
    
    // Check if at least one item is valid
    const validItems = items.filter(item => item.name.trim() !== '' && Number(item.price) > 0 && Number(item.quantity) > 0);
    if (validItems.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 sản phẩm hợp lệ (tên sản phẩm, đơn giá và số lượng phải lớn hơn 0).');
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
        setShowCreateModal(false);
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // State for active order filter tab
  const [activeTab, setActiveTab] = React.useState<'Tất cả' | 'Pending' | 'Paid' | 'Printed' | 'Canceled'>('Tất cả');

  // Base mock orders from the mockup image
  // Helper calculations based on database orders
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // 1. Total number of orders in database
  const totalOrdersCount = orders.length;

  // 2. Orders this month vs last month
  const ordersThisMonth = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const lastMonthIdx = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const ordersLastMonthCount = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === lastMonthIdx && d.getFullYear() === lastMonthYear;
  }).length;

  const orderChangePercent = ordersLastMonthCount > 0
    ? Math.round(((ordersThisMonth.length - ordersLastMonthCount) / ordersLastMonthCount) * 100)
    : 0;

  const orderChangeText = orderChangePercent >= 0
    ? `↗ +${orderChangePercent}% so với tháng trước`
    : `↘ ${orderChangePercent}% so với tháng trước`;

  // 3. Monthly revenue
  const monthlyRevenue = ordersThisMonth.reduce((sum, o) => sum + o.totalAmount, 0);

  // 4. Yearly revenue
  const yearlyRevenue = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === thisYear;
  }).reduce((sum, o) => sum + o.totalAmount, 0);

  const lastYearRevenue = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === (thisYear - 1);
  }).reduce((sum, o) => sum + o.totalAmount, 0);

  const yearChangePercent = lastYearRevenue > 0
    ? Math.round(((yearlyRevenue - lastYearRevenue) / lastYearRevenue) * 100)
    : 0;

  const yearChangeText = yearChangePercent >= 0
    ? `↗ Vượt ${yearChangePercent}% so với ${thisYear - 1}`
    : `↘ Giảm ${Math.abs(yearChangePercent)}% so với ${thisYear - 1}`;

  // 5. Top Customer
  const customerStats = orders.reduce((acc, o) => {
    if (!o.customerName) return acc;
    const name = o.customerName.trim();
    if (!name) return acc;
    if (!acc[name]) {
      acc[name] = { name, count: 0, total: 0 };
    }
    acc[name].count += 1;
    acc[name].total += o.totalAmount;
    return acc;
  }, {} as Record<string, { name: string; count: number; total: number }>);

  const sortedCustomers = Object.values(customerStats).sort((a, b) => b.total - a.total);
  const topCustomer = sortedCustomers[0] || { name: 'Chưa có', count: 0, total: 0 };

  const getVipBadge = (totalSpent: number) => {
    if (totalSpent >= 50000000) return 'VIP DIAMOND';
    if (totalSpent >= 20000000) return 'VIP PLATINUM';
    if (totalSpent > 0) return 'VIP GOLD';
    return 'MỚI';
  };

  // 6. Top Loyal Customers (Limit to 3)
  const topLoyalCustomers = sortedCustomers.slice(0, 3);

  // 7. Monthly revenues for Chart (JAN to DEC)
  const monthRevenues = Array(12).fill(0);
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    if (d.getFullYear() === thisYear) {
      monthRevenues[d.getMonth()] += o.totalAmount;
    }
  });

  const maxRevenue = Math.max(...monthRevenues, 1);
  const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthlyData = monthLabels.map((m, idx) => {
    const rev = monthRevenues[idx];
    const valPercent = maxRevenue > 1 ? (rev / maxRevenue) * 75 + 15 : 12; // Base height of 15% for non-zero months
    return {
      m,
      val: rev > 0 ? `${valPercent}%` : '12%',
      revenue: rev,
      isActive: idx === thisMonth,
      isFuture: idx > thisMonth
    };
  });

  const formatCurrencyShort = (val: number) => {
    if (val >= 1e9) return (val / 1e9).toFixed(1) + ' tỷ';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(0) + 'k';
    return val + 'đ';
  };

  // 8. So sánh tăng trưởng (last 3 years)
  const revThisYear = yearlyRevenue;
  const revLastYear = lastYearRevenue;
  const revTwoYearsAgo = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === (thisYear - 2);
  }).reduce((sum, o) => sum + o.totalAmount, 0);

  const maxYearly = Math.max(revThisYear, revLastYear, revTwoYearsAgo, 1);
  const pctThisYear = maxYearly > 1 ? (revThisYear / maxYearly) * 100 : 0;
  const pctLastYear = maxYearly > 1 ? (revLastYear / maxYearly) * 100 : 0;
  const pctTwoYearsAgo = maxYearly > 1 ? (revTwoYearsAgo / maxYearly) * 100 : 0;

  // 9. Status Donut Chart Distribution
  const paidOrders = orders.filter(o => o.printStatus === 'printed' || o.printStatus === 'success').length;
  const pendingOrders = orders.filter(o => (o.printStatus === 'waiting' || o.printStatus === 'printing') && o.orderStatus !== 'cancelled').length;
  const failedOrders = orders.filter(o => o.printStatus === 'failed' && o.orderStatus !== 'cancelled').length;
  const canceledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

  const pctPaid = totalOrdersCount > 0 ? Math.round((paidOrders / totalOrdersCount) * 100) : 0;
  const pctPending = totalOrdersCount > 0 ? Math.round((pendingOrders / totalOrdersCount) * 100) : 0;
  const pctFailed = totalOrdersCount > 0 ? Math.round((failedOrders / totalOrdersCount) * 100) : 0;
  const pctCanceled = totalOrdersCount > 0 ? Math.round((canceledOrders / totalOrdersCount) * 100) : 0;

  const dashPaid = pctPaid;
  const dashPending = pctPending;
  const dashFailed = pctFailed;
  const dashCanceled = pctCanceled;

  const offsetPaid = 0;
  const offsetPending = -dashPaid;
  const offsetFailed = -(dashPaid + dashPending);
  const offsetCanceled = -(dashPaid + dashPending + dashFailed);

  // 10. Recent Orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getRelativeTime = (isoString: string) => {
    const diffMs = new Date().getTime() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return new Date(isoString).toLocaleDateString('vi-VN');
  };

  // Map store orders dynamically
  const mappedStoreOrders = orders.map((o) => {
    let statusText = 'Pending';
    if (o.orderStatus === 'cancelled') {
      statusText = 'Canceled';
    } else if (o.printStatus === 'success' || o.printStatus === 'printed') {
      statusText = 'Printed';
    } else if (o.printStatus === 'printing') {
      statusText = 'Pending';
    } else if (o.orderStatus === 'completed') {
      statusText = 'Paid';
    }
    return {
      id: o.id,
      orderCode: o.orderCode,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      productName: o.items?.[0]?.name || 'Túi nilon PE dẻo',
      totalAmount: o.totalAmount,
      printStatus: statusText,
      createdAt: new Date(o.createdAt).toLocaleDateString('vi-VN')
    };
  });

  const combinedOrders = mappedStoreOrders;

  // Filter orders based on active tab
  const filteredOrders = combinedOrders.filter((o) => {
    if (activeTab === 'Tất cả') return true;
    return o.printStatus.toLowerCase() === activeTab.toLowerCase();
  });

  // Action for physical printer printing
  const handlePrint = async (orderCode: string) => {
    try {
      if (reprintJob) {
        await reprintJob(orderCode);
      } else {
        alert(`Đang gửi lệnh in hóa đơn cho đơn hàng ${orderCode} xuống máy in mặc định...`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi in hóa đơn: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Tổng đơn hàng */}
        <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] relative overflow-hidden flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổng đơn hàng</span>
              <span className="text-[22px] font-black text-slate-800 block mt-1">{totalOrdersCount} đơn</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#005B52]">
            <span>{orderChangeText}</span>
          </div>
        </div>

        {/* Card 2: Doanh thu tháng */}
        <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] relative overflow-hidden flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Doanh thu tháng</span>
              <span className="text-[22px] font-black text-slate-800 block mt-1">{formatCurrency(monthlyRevenue)}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Mục tiêu: 150.000.000đ
          </div>
        </div>

        {/* Card 3: Doanh thu năm */}
        <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] relative overflow-hidden flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Doanh thu năm</span>
              <span className="text-[22px] font-black text-slate-800 block mt-1">{formatCurrency(yearlyRevenue)}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100/60 flex items-center justify-center text-rose-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
            <span>{yearChangeText}</span>
          </div>
        </div>

        {/* Card 4: Khách hàng tiêu biểu (with Crown and custom blue style) */}
        <div className="bg-[#EBF3FC] border-2 border-[#9CC5F2] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between h-[130px]">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">Khách hàng tiêu biểu</span>
              <span className="text-[15px] font-bold text-slate-850 block mt-1 leading-none truncate" title={topCustomer.name}>{topCustomer.name}</span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1.5 block">{topCustomer.count} đơn hàng</span>
            </div>
            {/* Avatar with crown */}
            <div className="relative shrink-0">
              <div className="absolute -top-3 -right-1 z-10 text-yellow-500">
                <Crown className="h-4.5 w-4.5 fill-yellow-500 stroke-yellow-750 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="h-9 w-9 rounded-full border border-slate-300 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                <User className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <span className="text-[15px] font-black text-[#005B52]">{formatCurrency(topCustomer.total)}</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#1E293B] text-[#FFD700] tracking-wider shrink-0">{getVipBadge(topCustomer.total)}</span>
          </div>
        </div>

      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doanh thu theo tháng */}
        <div className="lg:col-span-2 bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[16px] font-bold text-slate-800">Doanh thu theo tháng</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Báo cáo chi tiết luồng tiền hàng tháng</p>
            </div>
            
            {/* Dropdown year */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-650 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer px-3 py-1.5 rounded-lg transition-colors">
              <span>{thisYear}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="flex items-end justify-between h-48 px-4 border-b border-slate-100 pb-2 mt-4">
            {monthlyData.map((d, index) => (
              <div key={index} className="flex flex-col items-center flex-1 h-full justify-end relative group">
                
                {/* Bar element */}
                <div
                  className={`w-7 sm:w-8 rounded-t transition-all duration-300 relative ${
                    d.isActive
                      ? 'bg-[#005B52] shadow-md shadow-[#005B52]/20'
                      : d.isFuture
                      ? 'bg-[#D2E3F6] hover:bg-[#C2D7F2]'
                      : 'bg-[#B0CBE8] hover:bg-[#99BDDE]'
                  }`}
                  style={{ height: d.val }}
                >
                  {/* Tooltip above active bar */}
                  {d.isActive && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold whitespace-nowrap shadow-lg z-20 flex flex-col items-center leading-tight">
                      <span>Th{thisMonth + 1}:</span>
                      <span>{formatCurrencyShort(d.revenue)}</span>
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1E293B] rotate-45" />
                    </div>
                  )}
                </div>

                {/* Month labels */}
                <span className="text-[9px] font-bold text-slate-400 mt-2.5">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* So sánh tăng trưởng */}
        <div className="lg:col-span-1 bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">So sánh tăng trưởng</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Dữ liệu tổng hợp 3 năm gần nhất</p>
          </div>

          <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
            
            {/* currentYear */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span>{thisYear} (Hiện tại)</span>
                <span className="text-[#005B52]">{formatCurrencyShort(revThisYear)}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#005B52] rounded-full" style={{ width: `${pctThisYear}%` }} />
              </div>
            </div>

            {/* lastYear */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span>{thisYear - 1}</span>
                <span className="text-slate-500">{formatCurrencyShort(revLastYear)}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#B0CBE8] rounded-full" style={{ width: `${pctLastYear}%` }} />
              </div>
            </div>

            {/* twoYearsAgo */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span>{thisYear - 2}</span>
                <span className="text-slate-500">{formatCurrencyShort(revTwoYearsAgo)}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#B0CBE8] rounded-full" style={{ width: `${pctTwoYearsAgo}%` }} />
              </div>
            </div>

          </div>

          {/* Forecast Box */}
          <div className="bg-[#EBF3FC] rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500">Dự báo Quý 3</span>
            <span className="text-[24px] font-black text-[#D32F2F] mt-0.5">+15.2%</span>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">Dựa trên đơn hàng đặt trước</span>
          </div>

        </div>

      </div>

      {/* Bottom Row: Table & Side Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tất cả đơn hàng (Table) */}
        <div className="lg:col-span-2 bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[420px]">
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-bold text-slate-800">Tất cả đơn hàng</h3>
              
              {/* Create order button */}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#005B52] hover:bg-[#00473F] text-white transition-all shadow-md shadow-[#005B52]/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Tạo đơn hàng
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {(['Tất cả', 'Pending', 'Paid', 'Printed', 'Canceled'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-[#005B52] text-white' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D2E3F6] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Mã Đơn</th>
                    <th className="py-3 px-2">Khách Hàng</th>
                    <th className="py-3 px-2">Sản Phẩm</th>
                    <th className="py-3 px-2">Tổng Cộng</th>
                    <th className="py-3 px-2">Trạng Thái</th>
                    <th className="py-3 px-2">Ngày</th>
                    <th className="py-3 px-2 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-[#005B52]">
                          {order.orderCode}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-800">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{order.customerPhone}</div>
                        </td>
                        <td className="py-3 px-2 font-medium text-slate-650 max-w-[120px] truncate" title={order.productName}>
                          {order.productName}
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-800">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.printStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : order.printStatus === 'Pending'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : order.printStatus === 'Printed'
                              ? 'bg-[#005B52] text-white'
                              : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {order.printStatus}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-450 font-semibold">
                          {order.createdAt}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handlePrint(order.orderCode)}
                            className="p-1.5 rounded-lg bg-[#EBF3FC] text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                            title="In hóa đơn"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs italic font-medium">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer with pagination */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4 text-[11px] font-semibold text-slate-500">
            <span>Hiển thị {filteredOrders.length} trên {orders.length} đơn hàng</span>
            
            {/* Pagination */}
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all">&lt;</button>
              <button className="px-2.5 py-1 rounded bg-[#005B52] text-white font-bold transition-all">1</button>
              <button className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all">2</button>
              <button className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all">3</button>
              <button className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all">&gt;</button>
            </div>
          </div>

        </div>

        {/* Right Stack of Sub-indicators */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Khách hàng thân thiết */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="h-[18px] w-[18px] text-amber-650" />
                Khách hàng thân thiết
              </h3>
            </div>

            <div className="space-y-3.5">
              {topLoyalCustomers.length > 0 ? (
                topLoyalCustomers.map((cust, idx) => {
                  return (
                    <div key={idx} className="flex items-center gap-3.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className={`text-[17px] font-black ${idx === 0 ? 'text-[#005B52]' : 'text-slate-400'} w-6 shrink-0 text-center`}>#{idx + 1}</span>
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-300 bg-slate-200 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-slate-850 block truncate">{cust.name}</span>
                          {idx === 0 && (
                            <span className="h-3.5 w-3.5 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                              <CheckCircle className="h-2 w-2 fill-amber-700 stroke-white" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5">Rank: {getVipBadge(cust.total).replace('VIP ', '')}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-4">Chưa có khách hàng thân thiết nào.</div>
              )}
            </div>
          </div>

          {/* Card 2: Phân bố trạng thái */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h3 className="text-[14px] font-bold text-slate-800">Phân bố trạng thái</h3>
            </div>

            {/* Custom SVG Donut Chart */}
            <div className="flex items-center justify-center py-3 relative w-32 h-32">
              <svg width="110" height="110" viewBox="0 0 40 40" className="transform -rotate-90">
                {/* Background Ring */}
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="4.5" />
                {/* Paid */}
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#005B52" strokeWidth="4.5" strokeDasharray={`${dashPaid} 100`} strokeDashoffset={offsetPaid} />
                {/* Pending */}
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#90CAF9" strokeWidth="4.5" strokeDasharray={`${dashPending} 100`} strokeDashoffset={offsetPending} />
                {/* Failed */}
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#FFB74D" strokeWidth="4.5" strokeDasharray={`${dashFailed} 100`} strokeDashoffset={offsetFailed} />
                {/* Canceled */}
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#EF5350" strokeWidth="4.5" strokeDasharray={`${dashCanceled} 100`} strokeDashoffset={offsetCanceled} />
              </svg>
              {/* Central Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[18px] font-black text-slate-800 leading-none">{totalOrdersCount}</span>
                <span className="text-[8px] font-extrabold text-slate-400 mt-1 uppercase tracking-wider">Tổng đơn</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[10px] font-bold text-slate-500 w-full px-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#005B52] shrink-0" />
                <span>Paid ({pctPaid}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#90CAF9] shrink-0" />
                <span>Pending ({pctPending}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FFB74D] shrink-0" />
                <span>Failed ({pctFailed}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#EF5350] shrink-0" />
                <span>Canceled ({pctCanceled}%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Hoạt động gần đây */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col">
            <div className="w-full text-left mb-4">
              <h3 className="text-[14px] font-bold text-slate-800">Hoạt động gần đây</h3>
            </div>

            <div className="space-y-4 pl-1">
              {recentOrders.length > 0 ? (
                recentOrders.map((o, idx) => {
                  let activityText = '';
                  let bulletColor = 'bg-slate-400';
                  let bulletPing = false;

                  if (o.printStatus === 'success' || o.printStatus === 'printed') {
                    activityText = `Máy in đã in thành công đơn hàng ${o.orderCode} của ${o.customerName}`;
                    bulletColor = 'bg-emerald-500';
                  } else if (o.printStatus === 'printing') {
                    activityText = `Đang in hóa đơn ${o.orderCode} cho ${o.customerName}`;
                    bulletColor = 'bg-blue-500';
                    bulletPing = true;
                  } else if (o.printStatus === 'failed') {
                    activityText = `Lỗi in đơn hàng ${o.orderCode} của ${o.customerName}`;
                    bulletColor = 'bg-red-500';
                  } else {
                    activityText = `Khách hàng ${o.customerName} tạo đơn hàng ${o.orderCode}`;
                    bulletColor = 'bg-amber-500';
                  }

                  return (
                    <div key={o.id} className="flex gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${bulletColor} mt-1.5 shrink-0 ${bulletPing ? 'animate-ping' : ''}`} />
                      <div className="relative flex-1">
                        {idx < recentOrders.length - 1 && (
                          <div className="absolute left-[-15px] top-4 bottom-[-20px] w-[1px] bg-slate-100" />
                        )}
                        <p className="text-[11px] text-slate-650 leading-tight font-medium">
                          {activityText}
                        </p>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{getRelativeTime(o.createdAt)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-4">Không có hoạt động nào.</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: CREATE ORDER */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#D2E3F6] rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#005B52]" />
                  Tạo đơn hàng mới
                </h3>
                <p className="text-xs text-slate-400">Nhập thông tin chi tiết đơn hàng và danh sách sản phẩm cần in.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold p-1 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Customer Info Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin khách hàng & Giao hàng</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Mã đơn hàng <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Mã đơn hàng, ví dụ: NL-1234"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="w-full text-xs px-3 py-2 pr-10 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] font-mono text-slate-850"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setOrderCode('NL-' + Math.random().toString(36).substring(2, 8).toUpperCase())}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        title="Tạo mã ngẫu nhiên mới"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Phương thức thanh toán</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] text-slate-800"
                    >
                      <option value="COD">COD (Thu hộ)</option>
                      <option value="BANKING">BANKING (Chuyển khoản)</option>
                      <option value="CASH">CASH (Tiền mặt)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tên khách hàng <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: 0903123456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] text-slate-805"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Địa chỉ nhận hàng</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Châu Ninh, Khoái Châu, Hưng Yên, Việt Nam"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Ghi chú đơn hàng</label>
                  <textarea 
                    placeholder="Ghi chú giao hàng hoặc yêu cầu máy in..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005B52] text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách sản phẩm</h4>
                  <button 
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#005B52] hover:text-[#00473F] bg-[#005B52]/10 border border-[#005B52]/20 px-2.5 py-1 rounded-lg transition-colors"
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
                          onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
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
                    onClick={() => setShowCreateModal(false)}
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
      )}
    </div>
  );
};
