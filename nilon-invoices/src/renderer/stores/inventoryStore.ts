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
    current_stock: 18,
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
    current_stock: 8,
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
  },
  {
    id: 'PROD-BHLD-001',
    sku: 'BHLD-MU-BAO-HO-',
    name: 'Mũ bảo hộ công trình',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Nhựa HDPE / ABS chịu lực',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-002',
    sku: 'BHLD-NON-BAO-HO',
    name: 'Nón bảo hộ cách điện',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(120000 * 0.7),
    selling_price: 120000,
    specs: 'Nhựa HDPE / ABS chịu lực',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-003',
    sku: 'BHLD-MU-CHONG-V',
    name: 'Mũ chống va đập',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(35000 * 0.7),
    selling_price: 35000,
    specs: 'Nhựa HDPE / ABS chịu lực',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-004',
    sku: 'BHLD-KINH-GAN-M',
    name: 'Kính gắn mũ bảo hộ',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(25000 * 0.7),
    selling_price: 25000,
    specs: 'Nhựa HDPE / ABS chịu lực',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-005',
    sku: 'BHLD-GANG-TAY-S',
    name: 'Găng tay sợi',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(5000 * 0.7),
    selling_price: 5000,
    specs: 'Sợi Cotton / Sợi Poly / Cao su',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-006',
    sku: 'BHLD-GANG-TAY-P',
    name: 'Găng tay phủ cao su',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Sợi Cotton / Sợi Poly / Cao su',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-007',
    sku: 'BHLD-GANG-TAY-C',
    name: 'Găng tay chống cắt',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(85000 * 0.7),
    selling_price: 85000,
    specs: 'Sợi Cotton / Sợi Poly / Cao su',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-008',
    sku: 'BHLD-GANG-TAY-H',
    name: 'Găng tay hàn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(75000 * 0.7),
    selling_price: 75000,
    specs: 'Sợi Cotton / Sợi Poly / Cao su',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-009',
    sku: 'BHLD-GANG-TAY-C',
    name: 'Găng tay cách điện',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(250000 * 0.7),
    selling_price: 250000,
    specs: 'Sợi Cotton / Sợi Poly / Cao su',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-010',
    sku: 'BHLD-GIAY-BAO-H',
    name: 'Giày bảo hộ',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(350000 * 0.7),
    selling_price: 350000,
    specs: 'Lót thép chống dập ngón',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-011',
    sku: 'BHLD-UNG-BAO-HO',
    name: 'Ủng bảo hộ',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(85000 * 0.7),
    selling_price: 85000,
    specs: 'Lót thép chống dập ngón',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-012',
    sku: 'BHLD-GIAY-CHONG',
    name: 'Giày chống tĩnh điện',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(450000 * 0.7),
    selling_price: 450000,
    specs: 'Lót thép chống dập ngón',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-013',
    sku: 'BHLD-GIAY-CHONG',
    name: 'Giày chống đinh',
    category: 'Bảo Hộ Lao Động',
    unit: 'Đôi',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(550000 * 0.7),
    selling_price: 550000,
    specs: 'Lót thép chống dập ngón',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-014',
    sku: 'BHLD-DONG-PHUC-',
    name: 'Đồng phục công nhân',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(180000 * 0.7),
    selling_price: 180000,
    specs: 'Vải Kaki / Pangrim Hàn Quốc / Nilon',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-015',
    sku: 'BHLD-QUAN-AO-PH',
    name: 'Quần áo phản quang',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Vải Kaki / Pangrim Hàn Quốc / Nilon',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-016',
    sku: 'BHLD-QUAN-AO-CH',
    name: 'Quần áo chống hóa chất',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(250000 * 0.7),
    selling_price: 250000,
    specs: 'Vải Kaki / Pangrim Hàn Quốc / Nilon',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-017',
    sku: 'BHLD-QUAN-AO-PH',
    name: 'Quần áo phòng sạch',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(120000 * 0.7),
    selling_price: 120000,
    specs: 'Vải Kaki / Pangrim Hàn Quốc / Nilon',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-018',
    sku: 'BHLD-AO-MUA-CON',
    name: 'Áo mưa công trình',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(65000 * 0.7),
    selling_price: 65000,
    specs: 'Vải Kaki / Pangrim Hàn Quốc / Nilon',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-019',
    sku: 'BHLD-DAY-DAI-AN',
    name: 'Dây đai an toàn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(250000 * 0.7),
    selling_price: 250000,
    specs: 'Sợi dù cường lực, Móc thép mạ kẽm',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-020',
    sku: 'BHLD-MOC-KHOA-C',
    name: 'Móc khóa chống rơi',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(85000 * 0.7),
    selling_price: 85000,
    specs: 'Sợi dù cường lực, Móc thép mạ kẽm',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-021',
    sku: 'BHLD-DAY-CUU-SI',
    name: 'Dây cứu sinh',
    category: 'Bảo Hộ Lao Động',
    unit: 'Mét',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Sợi dù cường lực, Móc thép mạ kẽm',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-022',
    sku: 'BHLD-BO-CHONG-R',
    name: 'Bộ chống rơi tự rút',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(1500000 * 0.7),
    selling_price: 1500000,
    specs: 'Sợi dù cường lực, Móc thép mạ kẽm',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-023',
    sku: 'BHLD-BINH-CHUA-',
    name: 'Bình chữa cháy',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bình',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(280000 * 0.7),
    selling_price: 280000,
    specs: '12 tháng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-024',
    sku: 'BHLD-BIEN-CANH-',
    name: 'Biển cảnh báo an toàn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tấm',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: '12 tháng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-025',
    sku: 'BHLD-LUOI-DEN-X',
    name: 'Lưới đen và lưới xanh công trình',
    category: 'Bảo Hộ Lao Động',
    unit: 'm2',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(12000 * 0.7),
    selling_price: 12000,
    specs: '12 tháng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-026',
    sku: 'BHLD-BAT-CHE-CO',
    name: 'Bạt che công trình',
    category: 'Bảo Hộ Lao Động',
    unit: 'm2',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-027',
    sku: 'BHLD-MANG-PE-QU',
    name: 'Màng PE quấn hàng',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(85000 * 0.7),
    selling_price: 85000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-028',
    sku: 'BHLD-BANG-KEO-C',
    name: 'Băng keo công nghiệp',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(12000 * 0.7),
    selling_price: 12000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-029',
    sku: 'BHLD-BANG-KEO-D',
    name: 'Băng keo dán nền',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(25000 * 0.7),
    selling_price: 25000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-030',
    sku: 'BHLD-TAM-CARTON',
    name: 'Tấm carton lót sàn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tấm',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(8000 * 0.7),
    selling_price: 8000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-031',
    sku: 'BHLD-LUOI-BAO-C',
    name: 'Lưới bao che xây dựng',
    category: 'Bảo Hộ Lao Động',
    unit: 'm2',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(18000 * 0.7),
    selling_price: 18000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-032',
    sku: 'BHLD-TAM-PHU-CH',
    name: 'Tấm phủ chống bụi',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tấm',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(35000 * 0.7),
    selling_price: 35000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-033',
    sku: 'BHLD-TAM-NHUA-C',
    name: 'Tấm nhựa corrugated',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tấm',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-034',
    sku: 'BHLD-XOP-CHONG-',
    name: 'Xốp chống sốc',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(150000 * 0.7),
    selling_price: 150000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-035',
    sku: 'BHLD-BAT-SOC-XA',
    name: 'Bạt sọc xanh cam',
    category: 'Bảo Hộ Lao Động',
    unit: 'm2',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(18000 * 0.7),
    selling_price: 18000,
    specs: 'Nhựa PE / HDPE / Nilon nguyên sinh',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-036',
    sku: 'BHLD-DAO-ROC-GI',
    name: 'Dao rọc giấy',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-037',
    sku: 'BHLD-BAY-TRET',
    name: 'Bay trét',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(25000 * 0.7),
    selling_price: 25000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-038',
    sku: 'BHLD-CO-SON',
    name: 'Cọ sơn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(12000 * 0.7),
    selling_price: 12000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-039',
    sku: 'BHLD-RU-LO-SON',
    name: 'Ru lô sơn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(35000 * 0.7),
    selling_price: 35000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-040',
    sku: 'BHLD-THUOC-CUON',
    name: 'Thước cuộn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-041',
    sku: 'BHLD-BUA',
    name: 'Búa',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(85000 * 0.7),
    selling_price: 85000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-042',
    sku: 'BHLD-KIM',
    name: 'Kìm',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(65000 * 0.7),
    selling_price: 65000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-043',
    sku: 'BHLD-SUNG-BAN-K',
    name: 'Súng bắn keo silicon',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Thép hợp kim cao cấp / Nhựa cứng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-044',
    sku: 'BHLD-BANG-KEO-G',
    name: 'Băng keo giấy che sơn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-045',
    sku: 'BHLD-NILON-CHE-',
    name: 'Nilon che nội thất',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cuộn',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(25000 * 0.7),
    selling_price: 25000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-046',
    sku: 'BHLD-KHAY-SON',
    name: 'Khay sơn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(15000 * 0.7),
    selling_price: 15000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-047',
    sku: 'BHLD-THANG-NHOM',
    name: 'Thang nhôm',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(1200000 * 0.7),
    selling_price: 1200000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-048',
    sku: 'BHLD-MAY-PHUN-S',
    name: 'Máy phun sơn',
    category: 'Bảo Hộ Lao Động',
    unit: 'Bộ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(3500000 * 0.7),
    selling_price: 3500000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-049',
    sku: 'BHLD-GIAY-NHAM',
    name: 'Giấy nhám',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tờ',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(5000 * 0.7),
    selling_price: 5000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-050',
    sku: 'BHLD-KEO-SILICO',
    name: 'Keo silicone',
    category: 'Bảo Hộ Lao Động',
    unit: 'Chai',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(45000 * 0.7),
    selling_price: 45000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-051',
    sku: 'BHLD-KEO-DAN-XA',
    name: 'Keo dán xây dựng',
    category: 'Bảo Hộ Lao Động',
    unit: 'Tuýp',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(65000 * 0.7),
    selling_price: 65000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-052',
    sku: 'BHLD-KHAN-LAU-C',
    name: 'Khăn lau công nghiệp',
    category: 'Bảo Hộ Lao Động',
    unit: 'kg',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(25000 * 0.7),
    selling_price: 25000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-053',
    sku: 'BHLD-XE-DAY-HAN',
    name: 'Xe đẩy hàng',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cái',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(1500000 * 0.7),
    selling_price: 1500000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  },
  {
    id: 'PROD-BHLD-054',
    sku: 'BHLD-GIAN-GIAO-',
    name: 'Giàn giáo tre',
    category: 'Bảo Hộ Lao Động',
    unit: 'Cây',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(50000 * 0.7),
    selling_price: 50000,
    specs: 'Nhựa, Nhôm, Giấy chuyên dụng',
    location: 'Kho BHLD',
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

  addNewProduct: async (data) => {
    const state = get();
    const newProduct: IInventoryItem = {
      ...data,
      id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      last_updated: new Date().toISOString()
    };

    // Update local state first for optimistic UI
    set({
      items: [newProduct, ...state.items]
    });

    // Save to Supabase via IPC
    try {
      if (window.electronAPI && window.electronAPI.database && window.electronAPI.database.createProduct) {
        await window.electronAPI.database.createProduct({
          name: newProduct.name,
          sku: newProduct.sku,
          price: newProduct.selling_price || newProduct.import_price || 0,
          stock: newProduct.current_stock || 0,
          category: newProduct.category,
          unit: newProduct.unit,
        });
      }
    } catch (error) {
      console.error('Failed to sync product to Supabase:', error);
    }
  }
}));

function newDateString() {
  const d = new Date();
  return `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
}
