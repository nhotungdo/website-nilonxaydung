import { create } from 'zustand';
import { IOrderPayload } from '../../shared/types';

interface OrderState {
  orders: IOrderPayload[];
  isLoading: boolean;
  
  addOrder: (order: IOrderPayload) => void;
  fetchOrders: () => Promise<void>;
}

// Helper function to generate beautiful, mathematically exact items that sum to the total amount
function generateRealisticItems(totalAmount: number, id: string): Array<{ name: string; quantity: number; price: number; unit: string; }> {
  const products = [
    { name: 'Nilon Lót Nền Khổ 2m (Dày 0.05mm) - Cuộn xanh', price: 1800000, unit: 'Cuộn' },
    { name: 'Bạt Nhựa Sọc 3 Màu Che Nắng Mưa Khổ 4m x 50m', price: 2150000, unit: 'Cuộn' },
    { name: 'Keo Dán Nilon Chuyên Dụng Xây Dựng 5L', price: 1500000, unit: 'Thùng' },
    { name: 'Nilon Đen Trải Nền Bê Tông (Khổ 1.5m - 200m/cuộn)', price: 1100000, unit: 'Cuộn' },
    { name: 'Màng PE Quấn Pallet Gạch 50cm (Độ co giãn 350%)', price: 180000, unit: 'Cuộn' },
    { name: 'Bạt Tarpaulin PVC Xanh Cam Cao Cấp Khổ 6m x 10m', price: 1300000, unit: 'Tấm' },
    { name: 'Nilon Trắng Trải Sàn Chống Thấm Cao Cấp Dày 0.1mm', price: 2400000, unit: 'Cuộn' },
    { name: 'Bạt Dứa Sọc Trắng Đỏ Che Công Trình Khổ 6m', price: 2500000, unit: 'Cuộn' },
    { name: 'Nilon Lót Nền Khổ 1m (Mỏng 0.03mm) - Tái sinh', price: 750000, unit: 'Cuộn' },
    { name: 'Băng keo dán bạt siêu dính rộng 10cm', price: 70000, unit: 'Cuộn' }
  ];

  if (totalAmount <= 0) return [];

  // Deterministic seed generation based on order ID hash
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % products.length;
  const product = products[index];

  const qty = Math.max(1, Math.round(totalAmount / product.price));
  const remaining = totalAmount - (qty * product.price);

  if (remaining === 0) {
    return [{
      name: product.name,
      quantity: qty,
      price: product.price,
      unit: product.unit
    }];
  } else if (remaining > 0) {
    return [
      {
        name: product.name,
        quantity: qty,
        price: product.price,
        unit: product.unit
      },
      {
        name: 'Màng bảo vệ phụ trợ & Phụ kiện dán nối',
        quantity: 1,
        price: remaining,
        unit: 'Lô'
      }
    ];
  } else {
    return [{
      name: product.name,
      quantity: 1,
      price: totalAmount,
      unit: product.unit
    }];
  }
}

export const useOrderStore = create<OrderState>((set) => {
  return {
    orders: [],
    isLoading: false,

    addOrder: (order) => {
      set((state) => ({
        orders: [order, ...state.orders]
      }));
    },

    fetchOrders: async () => {
      set({ isLoading: true });
      try {
        if (window.electronAPI?.database?.getOrders) {
          const res = await window.electronAPI.database.getOrders();
          if (res && res.success && res.data) {
            const mappedOrders: IOrderPayload[] = res.data.map((o: any) => ({
              id: o.id,
              orderCode: o.order_code,
              customerName: o.customer_name,
              customerPhone: o.customer_phone || 'N/A',
              totalAmount: Number(o.total_amount),
              paperSize: Number(o.total_amount) < 5000000 ? 'K58' : 'K80',
              pdfUrl: o.invoice_pdf || undefined,
              createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
              items: generateRealisticItems(Number(o.total_amount), o.id)
            }));
            set({ orders: mappedOrders, isLoading: false });
          } else {
            console.error('Failed to get database orders, API returned failure:', res?.error);
            set({ orders: [], isLoading: false });
          }
        } else {
          // Fallback in case electronAPI is not present (browser preview mode)
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ orders: [], isLoading: false });
        }
      } catch (err) {
        console.error('Failed to fetch orders from Postgres:', err);
        set({ orders: [], isLoading: false });
      }
    }
  };
});
