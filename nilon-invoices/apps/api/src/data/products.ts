export interface ProductData {
  name: string;
  categorySlug: string;
  unit: string;
  bestseller?: boolean;
}

export const PRODUCTS: ProductData[] = [
  // 1. Bảo hộ đầu
  { name: 'Mũ bảo hộ công trình', categorySlug: 'bao-ho-dau', unit: 'Cái' },
  { name: 'Nón bảo hộ cách điện', categorySlug: 'bao-ho-dau', unit: 'Cái' },
  { name: 'Mũ chống va đập', categorySlug: 'bao-ho-dau', unit: 'Cái' },
  { name: 'Kính gắn mũ bảo hộ', categorySlug: 'bao-ho-dau', unit: 'Cái' },

  // 2. Bảo hộ tay
  { name: 'Găng tay sợi', categorySlug: 'bao-ho-tay', unit: 'Đôi' },
  { name: 'Găng tay phủ cao su', categorySlug: 'bao-ho-tay', unit: 'Đôi' },
  { name: 'Găng tay chống cắt', categorySlug: 'bao-ho-tay', unit: 'Đôi' },
  { name: 'Găng tay hàn', categorySlug: 'bao-ho-tay', unit: 'Đôi' },
  { name: 'Găng tay cách điện', categorySlug: 'bao-ho-tay', unit: 'Đôi' },

  // 3. Bảo hộ chân
  { name: 'Giày bảo hộ', categorySlug: 'bao-ho-chan', unit: 'Đôi' },
  { name: 'Ủng bảo hộ', categorySlug: 'bao-ho-chan', unit: 'Đôi' },
  { name: 'Giày chống tĩnh điện', categorySlug: 'bao-ho-chan', unit: 'Đôi' },
  { name: 'Giày chống đinh', categorySlug: 'bao-ho-chan', unit: 'Đôi' },

  // 4. Quần áo bảo hộ
  { name: 'Đồng phục công nhân', categorySlug: 'quan-ao-bao-ho', unit: 'Bộ' },
  { name: 'Quần áo phản quang', categorySlug: 'quan-ao-bao-ho', unit: 'Cái' },
  {
    name: 'Quần áo chống hóa chất',
    categorySlug: 'quan-ao-bao-ho',
    unit: 'Bộ',
  },
  { name: 'Quần áo phòng sạch', categorySlug: 'quan-ao-bao-ho', unit: 'Bộ' },
  { name: 'Áo mưa công trình', categorySlug: 'quan-ao-bao-ho', unit: 'Cái' },

  // 5. Thiết bị chống rơi
  { name: 'Dây đai an toàn', categorySlug: 'thiet-bi-chong-roi', unit: 'Bộ' },
  {
    name: 'Móc khóa chống rơi',
    categorySlug: 'thiet-bi-chong-roi',
    unit: 'Cái',
  },
  { name: 'Dây cứu sinh', categorySlug: 'thiet-bi-chong-roi', unit: 'Mét' },
  {
    name: 'Bộ chống rơi tự rút',
    categorySlug: 'thiet-bi-chong-roi',
    unit: 'Bộ',
  },

  // 6. Thiết bị an toàn khác
  {
    name: 'Bình chữa cháy',
    categorySlug: 'thiet-bi-an-toan-khac',
    unit: 'Bình',
  },
  {
    name: 'Biển cảnh báo an toàn',
    categorySlug: 'thiet-bi-an-toan-khac',
    unit: 'Tấm',
  },
  {
    name: 'Lưới đen công trình',
    categorySlug: 'thiet-bi-an-toan-khac',
    unit: 'm2',
  },
  {
    name: 'Lưới xanh công trình',
    categorySlug: 'thiet-bi-an-toan-khac',
    unit: 'm2',
  },

  // 7. Vật tư che chắn & bảo vệ công trình
  {
    name: 'Bạt che công trình',
    categorySlug: 'vat-tu-che-chan',
    unit: 'm2',
    bestseller: true,
  },
  {
    name: 'Màng PE quấn hàng',
    categorySlug: 'vat-tu-che-chan',
    unit: 'Cuộn',
    bestseller: true,
  },
  {
    name: 'Băng keo công nghiệp',
    categorySlug: 'vat-tu-che-chan',
    unit: 'Cuộn',
    bestseller: true,
  },
  { name: 'Băng keo dán nền', categorySlug: 'vat-tu-che-chan', unit: 'Cuộn' },
  { name: 'Tấm carton lót sàn', categorySlug: 'vat-tu-che-chan', unit: 'Tấm' },
  {
    name: 'Lưới bao che xây dựng',
    categorySlug: 'vat-tu-che-chan',
    unit: 'm2',
  },
  { name: 'Tấm phủ chống bụi', categorySlug: 'vat-tu-che-chan', unit: 'Tấm' },
  { name: 'Tấm nhựa corrugated', categorySlug: 'vat-tu-che-chan', unit: 'Tấm' },
  { name: 'Xốp chống sốc', categorySlug: 'vat-tu-che-chan', unit: 'Cuộn' },
  { name: 'Bạt sọc xanh cam', categorySlug: 'vat-tu-che-chan', unit: 'm2' },

  // 8. Dụng cụ thi công cầm tay
  { name: 'Dao rọc giấy', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Bay trét', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Cọ sơn', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Ru lô sơn', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Thước cuộn', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Búa', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  { name: 'Kìm', categorySlug: 'dung-cu-cam-tay', unit: 'Cái' },
  {
    name: 'Súng bắn keo silicon',
    categorySlug: 'dung-cu-cam-tay',
    unit: 'Cái',
  },

  // 9. Thiết bị hỗ trợ sơn & hoàn thiện nội thất
  {
    name: 'Băng keo giấy che sơn',
    categorySlug: 'ho-tro-son-noi-that',
    unit: 'Cuộn',
  },
  {
    name: 'Nilon che nội thất',
    categorySlug: 'ho-tro-son-noi-that',
    unit: 'Cuộn',
  },
  { name: 'Khay sơn', categorySlug: 'ho-tro-son-noi-that', unit: 'Cái' },
  { name: 'Thang nhôm', categorySlug: 'ho-tro-son-noi-that', unit: 'Cái' },
  { name: 'Máy phun sơn', categorySlug: 'ho-tro-son-noi-that', unit: 'Bộ' },
  { name: 'Giấy nhám', categorySlug: 'ho-tro-son-noi-that', unit: 'Tờ' },
  { name: 'Keo silicone', categorySlug: 'ho-tro-son-noi-that', unit: 'Chai' },
  {
    name: 'Keo dán xây dựng',
    categorySlug: 'ho-tro-son-noi-that',
    unit: 'Tuýp',
  },
  {
    name: 'Khăn lau công nghiệp',
    categorySlug: 'ho-tro-son-noi-that',
    unit: 'kg',
  },
  { name: 'Xe đẩy hàng', categorySlug: 'ho-tro-son-noi-that', unit: 'Cái' },
  { name: 'Giàn giáo tre', categorySlug: 'ho-tro-son-noi-that', unit: 'Cây' },
];
