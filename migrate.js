const fs = require('fs');

const dataStr = fs.readFileSync('f:/OJT-Review/website-nilonxaydung/nilon-website/data/products.ts', 'utf8');

// Quick and dirty way to extract PRODUCTS array:
const startIdx = dataStr.indexOf('export const PRODUCTS: Product[] = [');
const endIdx = dataStr.indexOf('];', startIdx);
let productsStr = dataStr.substring(startIdx + 'export const PRODUCTS: Product[] = '.length, endIdx + 1);

// evaluate the array
// It has some TS stuff? No, PRODUCTS is purely JSON-like objects.
let products = [];
try {
  products = eval('(' + productsStr + ')');
} catch (e) {
  console.error("Eval error", e);
}

const safetyProducts = products.filter(p => p.category === 'bao-ho-lao-dong');

let inventoryItems = safetyProducts.map((p, i) => {
  return `{
    id: 'PROD-BHLD-${String(i+1).padStart(3, '0')}',
    sku: 'BHLD-${p.slug.substring(0, 10).toUpperCase()}',
    name: '${p.name.replace(/'/g, "\\'")}',
    category: 'Bảo Hộ Lao Động',
    unit: '${p.unit || 'Cái'}',
    current_stock: Math.floor(Math.random() * 100) + 20,
    min_stock_alert: 10,
    import_price: Math.round(${p.price} * 0.7),
    selling_price: ${p.price},
    specs: '${(p.specs && p.specs.length > 0) ? p.specs[0].value.replace(/'/g, "\\'") : ''}',
    location: 'Kho BHLD',
    last_updated: new Date().toISOString()
  }`;
});

const storePath = 'f:/OJT-Review/website-nilonxaydung/nilon-invoices/src/renderer/stores/inventoryStore.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// Find INITIAL_ITEMS in store
// It ends with:
//     location: 'Kho C - Tủ Bảo Hộ',
//     last_updated: new Date().toISOString()
//   }
// ];

const initItemsMatch = /const INITIAL_ITEMS: IInventoryItem\[\] = \[([\s\S]*?)\];/g;
const match = initItemsMatch.exec(storeContent);

if (match) {
  // Keep the first 6 items which are not BHLD (or just filter them out if they are)
  // Let's replace the whole INITIAL_ITEMS with a new array
  // Wait, I will just append to the first 6 items.
  const oldItemsStr = match[1];
  
  // Let's just create a new array
  // First 6 items
  const first6 = `  {
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
  }`;

  const newArray = `const INITIAL_ITEMS: IInventoryItem[] = [\n${first6},\n  ${inventoryItems.join(',\n  ')}\n];`;
  storeContent = storeContent.replace(initItemsMatch, newArray);

  fs.writeFileSync(storePath, storeContent, 'utf8');
  console.log("Successfully migrated " + inventoryItems.length + " products!");
} else {
  console.log("Could not match INITIAL_ITEMS");
}
