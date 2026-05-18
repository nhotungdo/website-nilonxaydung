import { create } from 'zustand';
import { IOrderPayload } from '../../shared/types';

interface ExtendedOrderPayload extends IOrderPayload {
  printStatus: string;
  orderStatus: string;
  customerAddress?: string;
  note?: string;
}

interface OrderState {
  orders: ExtendedOrderPayload[];
  isLoading: boolean;
  
  addOrder: (order: ExtendedOrderPayload) => void;
  fetchOrders: () => Promise<void>;
  updatePrintStatus: (orderId: string, printStatus: string) => void;
}

export const useOrderStore = create<OrderState>((set) => {
  return {
    orders: [],
    isLoading: false,

    addOrder: (order) => {
      set((state) => {
        // Avoid adding duplicate orders if already loaded
        const exists = state.orders.some(o => o.id === order.id);
        if (exists) return state;
        return {
          orders: [order, ...state.orders]
        };
      });
    },

    updatePrintStatus: (orderId, printStatus) => {
      set((state) => ({
        orders: state.orders.map(o => 
          o.id === orderId ? { ...o, printStatus } : o
        )
      }));
    },

    fetchOrders: async () => {
      set({ isLoading: true });
      try {
        if (window.electronAPI?.database?.getOrders) {
          const res = await window.electronAPI.database.getOrders();
          if (res && res.success && res.data) {
            const mappedOrders: ExtendedOrderPayload[] = res.data.map((o: any) => ({
              id: o.id,
              orderCode: o.order_code,
              customerName: o.customer_name,
              customerPhone: o.customer_phone || 'N/A',
              customerAddress: o.customer_address || 'N/A',
              totalAmount: Number(o.total_amount),
              paperSize: Number(o.total_amount) < 5000000 ? 'K58' : 'K80',
              pdfUrl: o.invoice_pdf || undefined,
              printStatus: o.print_status || 'waiting',
              orderStatus: o.order_status || 'pending',
              note: o.note || '',
              createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
              items: o.items ? o.items.map((item: any) => ({
                name: item.product_name,
                quantity: Number(item.quantity),
                price: Number(item.price),
                unit: 'sp' // Default label since database stores name/quantity/price
              })) : []
            }));
            set({ orders: mappedOrders, isLoading: false });
          } else {
            console.error('Failed to get database orders, API returned failure:', res?.error);
            set({ orders: [], isLoading: false });
          }
        } else {
          // Fallback for browser preview mode
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
