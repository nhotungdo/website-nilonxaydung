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
  createOrder: (order: Omit<ExtendedOrderPayload, 'id' | 'createdAt' | 'printStatus' | 'orderStatus' | 'paperSize'> & { id?: string; createdAt?: string; printStatus?: string; orderStatus?: string; paymentMethod?: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
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

    createOrder: async (orderData) => {
      set({ isLoading: true });
      try {
        const id = orderData.id || crypto.randomUUID();
        const orderDto = {
          id,
          order_code: orderData.orderCode,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone || 'N/A',
          customer_address: orderData.customerAddress || 'N/A',
          total_amount: orderData.totalAmount || 0,
          payment_method: orderData.paymentMethod || 'COD',
          print_status: orderData.printStatus || 'waiting',
          note: orderData.note || '',
          items: orderData.items.map((item: any) => ({
            product_id: item.productId || 'fallback-product-id',
            product_name: item.name || item.product_name,
            price: Number(item.price),
            quantity: Number(item.quantity)
          }))
        };

        if (window.electronAPI?.database?.createOrder) {
          const res = await window.electronAPI.database.createOrder(orderDto);
          if (res && res.success) {
            // Re-fetch all orders to keep status and everything in sync
            await useOrderStore.getState().fetchOrders();
            set({ isLoading: false });
            return { success: true, data: res.data };
          } else {
            set({ isLoading: false });
            return { success: false, error: res?.error || 'Database insert failed' };
          }
        } else {
          // Fallback logic for browser environments if running in development outside electron
          const newOrder: ExtendedOrderPayload = {
            id,
            orderCode: orderData.orderCode,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone || 'N/A',
            customerAddress: orderData.customerAddress || 'N/A',
            totalAmount: orderData.totalAmount || 0,
            paperSize: orderData.totalAmount < 5000000 ? 'K58' : 'K80',
            pdfUrl: undefined,
            printStatus: 'waiting',
            orderStatus: 'pending',
            note: orderData.note || '',
            createdAt: new Date().toISOString(),
            items: orderData.items.map((item: any) => ({
              name: item.name,
              quantity: Number(item.quantity),
              price: Number(item.price),
              unit: 'sp'
            }))
          };
          set((state) => ({
            orders: [newOrder, ...state.orders],
            isLoading: false
          }));
          return { success: true, data: newOrder };
        }
      } catch (err: any) {
        console.error('Failed to create order:', err);
        set({ isLoading: false });
        return { success: false, error: err.message };
      }
    },

    deleteOrder: async (orderId) => {
      set({ isLoading: true });
      try {
        if (window.electronAPI?.database?.deleteOrder) {
          const res = await window.electronAPI.database.deleteOrder(orderId);
          if (res && res.success) {
            set((state) => ({
              orders: state.orders.filter(o => o.id !== orderId),
              isLoading: false
            }));
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: res?.error || 'Database delete failed' };
          }
        } else {
          // Fallback
          set((state) => ({
            orders: state.orders.filter(o => o.id !== orderId),
            isLoading: false
          }));
          return { success: true };
        }
      } catch (err: any) {
        console.error('Failed to delete order:', err);
        set({ isLoading: false });
        return { success: false, error: err.message };
      }
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
