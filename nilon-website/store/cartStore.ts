import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  thickness: string;
  size: string;
  quantity: number;
  note: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        // Check if an item with same productId, thickness, and size already exists
        const existingItemIndex = state.items.findIndex(
          (item) => 
            item.productId === newItem.productId && 
            item.thickness === newItem.thickness && 
            item.size === newItem.size
        );

        if (existingItemIndex >= 0) {
          // If exists, just update quantity
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          if (newItem.note && newItems[existingItemIndex].note !== newItem.note) {
            newItems[existingItemIndex].note += ` | ${newItem.note}`;
          }
          return { items: newItems };
        }

        // If not exists, add new item with unique id
        const id = `${newItem.productId}_${Date.now()}`;
        return { items: [...state.items, { ...newItem, id }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'nilon-cart-storage',
    }
  )
);
