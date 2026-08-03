export type ProductCategory =
  | 'Nilon Lót Sàn PE'
  | 'Nilon Đen Công Trình'
  | 'Nilon Trong Suốt'
  | 'Bạt Dứa / Bạt Sọc'
  | 'Màng Vấn Màng Co'
  | 'Vật Liệu Khác';

export interface IInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unit: 'Cuộn' | 'Kg' | 'm²' | 'Tấm' | 'Bao';
  current_stock: number;
  min_stock_alert: number;
  import_price: number; // Giá vốn nhập kho
  selling_price: number; // Giá bán
  specs?: string; // Ví dụ: 0.05mm x 2m x 400m
  location?: string; // Ví dụ: Kệ A1, Kho 2
  last_updated: string;
}

export interface IStockInReceipt {
  id: string;
  receipt_code: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  import_price: number;
  total_amount: number;
  batch_code: string; // Mã lô sản xuất / nhập hàng
  supplier: string; // Xưởng SX / Nhà cung cấp
  notes: string;
  created_at: string;
  created_by: string;
}

export interface IDailyProductionLog {
  id: string;
  production_date: string; // YYYY-MM-DD
  shift: 'Ca sáng (06:00 - 14:00)' | 'Ca chiều (14:00 - 22:00)' | 'Ca đêm (22:00 - 06:00)';
  machine_id: string; // Máy đùn PE-01, Máy cắt C-02, v.v.
  operator_name: string;
  product_id: string;
  product_name: string;
  produced_quantity: number;
  waste_quantity: number; // Phế phẩm (Kg)
  unit: string;
  auto_added_to_stock: boolean;
  notes?: string;
  created_at: string;
}

export interface IInventoryTransaction {
  id: string;
  type: 'STOCK_IN' | 'PRODUCTION_ADD' | 'STOCK_OUT' | 'ADJUSTMENT';
  product_id: string;
  product_name: string;
  quantity_change: number; // Số dương nếu tăng, âm nếu giảm
  balance_after: number;
  reference_code: string; // Mã phiếu nhập hoặc mã lượt sản xuất
  notes: string;
  created_at: string;
  created_by: string;
}
