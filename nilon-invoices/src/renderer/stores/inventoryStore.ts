import { create } from 'zustand';
import {
  IInventoryItem,
  IStockInReceipt,
  IDailyProductionLog,
  IInventoryTransaction,
  ProductCategory
} from '../../shared/types/inventory';

interface InventoryState {
  items: IInventoryItem[];
  stockInReceipts: IStockInReceipt[];
  productionLogs: IDailyProductionLog[];
  transactions: IInventoryTransaction[];
  searchQuery: string;
  categoryFilter: ProductCategory | 'ALL';
  isStockInModalOpen: boolean;
  isProductionModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: ProductCategory | 'ALL') => void;
  setIsStockInModalOpen: (open: boolean) => void;
  setIsProductionModalOpen: (open: boolean) => void;

  addStockIn: (data: Omit<IStockInReceipt, 'id' | 'receipt_code' | 'created_at'>) => void;
  recordDailyProduction: (data: Omit<IDailyProductionLog, 'id' | 'created_at'>) => void;
  addNewProduct: (data: Omit<IInventoryItem, 'id' | 'last_updated'>) => void;
}

const INITIAL_ITEMS: IInventoryItem[] = [
  {
    id: 'PROD-001',
    sku: 'PE-LOT-005',
    name: 'Nilon Lót Sàn PE Trắng Trẻo 0.05mm',
    category: 'Nilon Lót Sàn PE',
    unit: 'Cuộn',
    current_stock: 145,
    min_stock_alert: 30,
    import_price: 320000,
    selling_price: 450000,
    specs: 'Khổ 2m x 400m x 0.05mm',
    location: 'Kho A - Kệ 01',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-002',
    sku: 'PE-LOT-010',
    name: 'Nilon Lót Sàn PE Trắng Đục 0.10mm',
    category: 'Nilon Lót Sàn PE',
    unit: 'Cuộn',
    current_stock: 82,
    min_stock_alert: 25,
    import_price: 580000,
    selling_price: 780000,
    specs: 'Khổ 2m x 200m x 0.10mm',
    location: 'Kho A - Kệ 02',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-003',
    sku: 'PE-DEN-008',
    name: 'Nilon Đen Che Phủ Công Trình 0.08mm',
    category: 'Nilon Đen Công Trình',
    unit: 'Cuộn',
    current_stock: 18, // Low stock alert!
    min_stock_alert: 20,
    import_price: 410000,
    selling_price: 590000,
    specs: 'Khổ 2m x 300m (Tái sinh)',
    location: 'Kho B - Kệ 01',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-004',
    sku: 'BAT-SOC-3M',
    name: 'Bạt Sọc 3 Màu Che Nắng Mưa Khổ 4m',
    category: 'Bạt Dứa / Bạt Sọc',
    unit: 'Cuộn',
    current_stock: 64,
    min_stock_alert: 15,
    import_price: 850000,
    selling_price: 1150000,
    specs: 'Khổ 4m x 50m (Bạt dứa 3 sọc)',
    location: 'Kho B - Kệ 04',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-005',
    sku: 'PE-TRONG-015',
    name: 'Màng PE Trong Suốt Cao Cấp 0.15mm',
    category: 'Nilon Trong Suốt',
    unit: 'Cuộn',
    current_stock: 8, // Low stock alert!
    min_stock_alert: 10,
    import_price: 920000,
    selling_price: 1280000,
    specs: 'Khổ 2m x 150m (Nhựa nguyên sinh)',
    location: 'Kho A - Kệ 04',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-006',
    sku: 'PE-CO-50CM',
    name: 'Màng Quấn Pallet / Màng Co Hand Stretch 50cm',
    category: 'Màng Vấn Màng Co',
    unit: 'Cuộn',
    current_stock: 210,
    min_stock_alert: 40,
    import_price: 65000,
    selling_price: 95000,
    specs: 'Nặng 2.4kg/cuộn (Khổ 50cm)',
    location: 'Kho C - Phụ kiện',
    last_updated: new Date().toISOString()
  }
];

const INITIAL_RECEIPTS: IStockInReceipt[] = [
  {
    id: 'REC-001',
    receipt_code: 'NK-20260803-01',
    product_id: 'PROD-001',
    product_name: 'Nilon Lót Sàn PE Trắng Trẻo 0.05mm',
    quantity: 50,
    unit: 'Cuộn',
    import_price: 320000,
    total_amount: 16000000,
    batch_code: 'LO-PE-0803A',
    supplier: 'Xưởng Đùn Nilon Bình Tân',
    notes: 'Nhập lô hàng sản xuất ca sáng 03/08',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    created_by: 'Nguyễn Văn Quản Kho'
  },
  {
    id: 'REC-002',
    receipt_code: 'NK-20260802-02',
    product_id: 'PROD-004',
    product_name: 'Bạt Sọc 3 Màu Che Nắng Mưa Khổ 4m',
    quantity: 20,
    unit: 'Cuộn',
    import_price: 850000,
    total_amount: 17000000,
    batch_code: 'LO-BAT-0802',
    supplier: 'Công ty Bạt Nhựa Nam Định',
    notes: 'Nhập bạt dứa gia công ngoài',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    created_by: 'Trần Thị Thu Ngân'
  }
];

const INITIAL_PRODUCTION_LOGS: IDailyProductionLog[] = [
  {
    id: 'PROD-LOG-001',
    production_date: new Date().toISOString().split('T')[0],
    shift: 'Ca sáng (06:00 - 14:00)',
    machine_id: 'Máy Thổi PE-01',
    operator_name: 'Lê Văn Hùng',
    product_id: 'PROD-001',
    product_name: 'Nilon Lót Sàn PE Trắng Trẻo 0.05mm',
    produced_quantity: 45,
    waste_quantity: 1.5,
    unit: 'Cuộn',
    auto_added_to_stock: true,
    notes: 'Chạy máy ổn định, tốc độ đùn đạt 98%',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'PROD-LOG-002',
    production_date: new Date().toISOString().split('T')[0],
    shift: 'Ca sáng (06:00 - 14:00)',
    machine_id: 'Máy Cắt Màng-02',
    operator_name: 'Phạm Minh Tuấn',
    product_id: 'PROD-006',
    product_name: 'Màng Quấn Pallet / Màng Co Hand Stretch 50cm',
    produced_quantity: 120,
    waste_quantity: 3.2,
    unit: 'Cuộn',
    auto_added_to_stock: true,
    notes: 'Đóng gói 120 cuộn màng co 2.4kg',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const INITIAL_TRANSACTIONS: IInventoryTransaction[] = [
  {
    id: 'TX-001',
    type: 'STOCK_IN',
    product_id: 'PROD-001',
    product_name: 'Nilon Lót Sàn PE Trắng Trẻo 0.05mm',
    quantity_change: 50,
    balance_after: 145,
    reference_code: 'NK-20260803-01',
    notes: 'Nhập kho lô LO-PE-0803A',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    created_by: 'Nguyễn Văn Quản Kho'
  },
  {
    id: 'TX-002',
    type: 'PRODUCTION_ADD',
    product_id: 'PROD-006',
    product_name: 'Màng Quấn Pallet / Màng Co Hand Stretch 50cm',
    quantity_change: 120,
    balance_after: 210,
    reference_code: 'PROD-LOG-002',
    notes: 'Cộng dồn từ sản xuất Ca sáng (03/08)',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    created_by: 'Phạm Minh Tuấn'
  }
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: INITIAL_ITEMS,
  stockInReceipts: INITIAL_RECEIPTS,
  productionLogs: INITIAL_PRODUCTION_LOGS,
  transactions: INITIAL_TRANSACTIONS,
  searchQuery: '',
  categoryFilter: 'ALL',
  isStockInModalOpen: false,
  isProductionModalOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setIsStockInModalOpen: (isStockInModalOpen) => set({ isStockInModalOpen }),
  setIsProductionModalOpen: (isProductionModalOpen) => set({ isProductionModalOpen }),

  addStockIn: (data) => {
    const state = get();
    const receiptCode = `NK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `REC-${Date.now()}`;

    const existingIndex = state.items.findIndex(
      (i) => i.id === data.product_id || i.name.toLowerCase() === data.product_name.toLowerCase()
    );

    let updatedItems = [...state.items];
    let finalProductId = data.product_id;
    let newStock = data.quantity;

    if (existingIndex >= 0) {
      finalProductId = updatedItems[existingIndex].id;
      newStock = updatedItems[existingIndex].current_stock + data.quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        current_stock: newStock,
        unit: (data.unit as any) || updatedItems[existingIndex].unit,
        import_price: data.import_price > 0 ? data.import_price : updatedItems[existingIndex].import_price,
        last_updated: new Date().toISOString()
      };
    } else {
      finalProductId = `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProductItem: IInventoryItem = {
        id: finalProductId,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.product_name,
        category: 'Nilon Lót Sàn PE',
        unit: (data.unit as any) || 'Cuộn',
        current_stock: data.quantity,
        min_stock_alert: 20,
        import_price: data.import_price,
        selling_price: Math.round(data.import_price * 1.3),
        location: 'Kho Nhập Mới',
        last_updated: new Date().toISOString()
      };
      updatedItems = [newProductItem, ...updatedItems];
    }

    const newReceipt: IStockInReceipt = {
      ...data,
      id: newId,
      product_id: finalProductId,
      receipt_code: receiptCode,
      created_at: new Date().toISOString()
    };

    const newTx: IInventoryTransaction = {
      id: `TX-${Date.now()}`,
      type: 'STOCK_IN',
      product_id: finalProductId,
      product_name: data.product_name,
      quantity_change: data.quantity,
      balance_after: newStock,
      reference_code: receiptCode,
      notes: `Nhập kho (${data.unit}): ${data.notes || 'Không có ghi chú'}`,
      created_at: new Date().toISOString(),
      created_by: data.created_by
    };

    set({
      stockInReceipts: [newReceipt, ...state.stockInReceipts],
      items: updatedItems,
      transactions: [newTx, ...state.transactions],
      isStockInModalOpen: false
    });
  },


  recordDailyProduction: (data) => {
    const state = get();
    const newId = `PROD-LOG-${Date.now()}`;
    const newLog: IDailyProductionLog = {
      ...data,
      id: newId,
      created_at: new Date().toISOString()
    };

    let updatedItems = state.items;
    let newTxList = state.transactions;

    if (data.auto_added_to_stock) {
      updatedItems = state.items.map((item) => {
        if (item.id === data.product_id) {
          return {
            ...item,
            current_stock: item.current_stock + data.produced_quantity,
            last_updated: new Date().toISOString()
          };
        }
        return item;
      });

      const targetItem = state.items.find(i => i.id === data.product_id);
      const newStock = (targetItem?.current_stock || 0) + data.produced_quantity;

      const newTx: IInventoryTransaction = {
        id: `TX-${Date.now()}`,
        type: 'PRODUCTION_ADD',
        product_id: data.product_id,
        product_name: data.product_name,
        quantity_change: data.produced_quantity,
        balance_after: newStock,
        reference_code: `LOG-${newDateString()}`,
        notes: `Tự động cộng dồn từ sản xuất ca [${data.shift}]`,
        created_at: new Date().toISOString(),
        created_by: data.operator_name
      };

      newTxList = [newTx, ...state.transactions];
    }

    set({
      productionLogs: [newLog, ...state.productionLogs],
      items: updatedItems,
      transactions: newTxList,
      isProductionModalOpen: false
    });
  },

  addNewProduct: (data) => {
    const state = get();
    const newProduct: IInventoryItem = {
      ...data,
      id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      last_updated: new Date().toISOString()
    };

    set({
      items: [newProduct, ...state.items]
    });
  }
}));

function newDateString() {
  const d = new Date();
  return `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
}
