/**
 * Core Technical & Commercial RAG Knowledge Base for Nilon Xây Dựng AI Sales Assistant
 */

export interface ProductSpec {
  id: string;
  name: string;
  category: string;
  thicknessZem: string;
  thicknessMm: string;
  resinType: string; // 'Nguyên sinh LLDPE 100%' | 'Tái sinh cao cấp Grade A' | 'Hỗn hợp'
  tearStrength: string; // e.g. ASTM D1922 (180 - 420 g/mil)
  tensileStrength: string; // e.g. ASTM D882 (22 - 38 MPa)
  isoCertificates: string[];
  color: string;
  rollWidth: string;
  rollLength: string;
  pricePerKgBase: number;
  bestFor: string;
}

export interface PriceTier {
  minKg: number;
  maxKg: number;
  discountPercentage: number;
  note: string;
}

export interface ShippingPolicy {
  region: string;
  estimatedFee: string;
  freeShippingMinKg: number;
}

export const AI_KNOWLEDGE_BASE = {
  company: {
    name: "Công ty TNHH Sản Xuất & Thương Mại Nilon Xây Dựng",
    shortName: "Nilon Xây Dựng",
    hotline: "0901.234.567 / 0988.999.888",
    email: "baogia@nilonxaydung.vn",
    address: "KCN Tân Bình, TPHCM & KCN Sóng Thần, Bình Dương",
    isoCertificates: [
      {
        code: "ISO 9001:2015",
        title: "Hệ thống Quản lý Chất lượng Sản xuất Màng PE & Nilon Xây dựng",
        issuedBy: "QUATEST 3 & TUV Rheinland",
        validity: "2024 - 2027"
      },
      {
        code: "ISO 14001:2015",
        title: "Hệ thống Quản lý Môi trường & Hạt nhựa Tái chế An toàn",
        issuedBy: "QUATEST 3",
        validity: "2024 - 2027"
      },
      {
        code: "TCVN 6407:1998",
        title: "Tiêu chuẩn Quốc gia về vật liệu nhựa màng lót nền móng bê tông",
        issuedBy: "Bộ Xây Dựng",
        validity: "Đạt chuẩn kỹ thuật"
      }
    ]
  },

  technicalGlossary: {
    zemExplanation: "1 Zem = 0.01 mm = 10 Micron. Ví dụ: 4 zem = 0.04 mm, 10 zem = 0.1 mm (100 micron).",
    resinComparison: {
      virginResin: "Hạt nhựa LLDPE/LDPE nguyên sinh 100%: Màng trong suốt, dẻo dai cao, chịu lực xé rách cực tốt (ASTM D1922 > 350 g/mil), không mùi, chịu nắng mưa UV từ 2-5 năm.",
      recycledResin: "Hạt nhựa tái sinh Grade A (đen/xám/xanh): Sản xuất từ nilon chọn lọc tái chế, độ bền xé rách vừa phải (ASTM D1922 > 200 g/mil), chi phí tiết kiệm 25-35%, rất phù hợp lót sàn đổ bê tông lót móng 1 lần."
    },
    tearStrengthTest: "Tiêu chuẩn đo độ xé rách ASTM D1922 (Elmendorf Tear Strength) đảm bảo màng nilon không bị thủng/xé rách khi công nhân di chuyển, kéo thép hoặc đổ bê tông đá 1x2 tươi trực tiếp lên trên."
  },

  products: [
    {
      id: "nilon-lot-san-4zem",
      name: "Nilon lót sàn bê tông 4zem (Màu Đen / Xám)",
      category: "Nilon lót sàn móng",
      thicknessZem: "4 zem",
      thicknessMm: "0.04 mm (40 micron)",
      resinType: "Tái sinh Grade A cao cấp",
      tearStrength: "ASTM D1922 (220 g/mil)",
      tensileStrength: "ASTM D882 (24 MPa)",
      isoCertificates: ["ISO 9001:2015", "TCVN 6407"],
      color: "Đen / Xám đen bóng",
      rollWidth: "Khổ 2m (xung đôi 4m)",
      rollLength: "Cuộn 50kg (~330m²)",
      pricePerKgBase: 34000,
      bestFor: "Lót đường bê tông nông thôn, lót sàn tầng nhà dân dụng, chống mất nước xi măng"
    },
    {
      id: "nilon-lot-san-6zem",
      name: "Nilon lót sàn bê tông công trình 6zem (Màu Đen)",
      category: "Nilon lót sàn móng",
      thicknessZem: "6 zem",
      thicknessMm: "0.06 mm (60 micron)",
      resinType: "Hỗn hợp nguyên sinh & tái sinh chọn lọc",
      tearStrength: "ASTM D1922 (310 g/mil)",
      tensileStrength: "ASTM D882 (28 MPa)",
      isoCertificates: ["ISO 9001:2015", "ISO 14001:2015", "TCVN 6407"],
      color: "Đen tuyền",
      rollWidth: "Khổ 2m (xung đôi 4m) / Khổ 3m (xung đôi 6m)",
      rollLength: "Cuộn 50kg (~220m²)",
      pricePerKgBase: 33000,
      bestFor: "Lót móng nhà xưởng, đường bê tông tải trọng lớn, công trình hạ tầng KCN"
    },
    {
      id: "mang-pe-nguyen-sinh-trang-10zem",
      name: "Màng PE nguyên sinh 100% trong suốt 10zem",
      category: "Màng PE cao cấp",
      thicknessZem: "10 zem",
      thicknessMm: "0.10 mm (100 micron)",
      resinType: "Nguyên sinh LLDPE 100% nhập khẩu",
      tearStrength: "ASTM D1922 (450 g/mil - Siêu xé rách)",
      tensileStrength: "ASTM D882 (36 MPa)",
      isoCertificates: ["ISO 9001:2015", "ISO 14001:2015"],
      color: "Trong suốt kính",
      rollWidth: "Khổ 2m (xung 4m) / Khổ 1.4m",
      rollLength: "Cuộn 50kg (~130m²)",
      pricePerKgBase: 42000,
      bestFor: "Chống thấm hầm ngầm, lót móng công trình trọng điểm, bọc hàng cao cấp, chống ẩm tuyệt đối"
    },
    {
      id: "mang-phu-nong-nghiep-7zem",
      name: "Màng phủ nông nghiệp & nhà kính 7zem",
      category: "Màng nông nghiệp",
      thicknessZem: "7 zem",
      thicknessMm: "0.07 mm (70 micron)",
      resinType: "Nguyên sinh phủ UV kháng tia cực tím",
      tearStrength: "ASTM D1922 (380 g/mil)",
      tensileStrength: "ASTM D882 (32 MPa)",
      isoCertificates: ["ISO 9001:2015"],
      color: "Mặt đen mặt bạc / Trong suốt",
      rollWidth: "Khổ 1m - 2m",
      rollLength: "Cuộn 50kg (~170m²)",
      pricePerKgBase: 39000,
      bestFor: "Làm nhà kính trồng rau hoa quả, phủ luống chống cỏ dại, giữ ẩm đất"
    },
    {
      id: "mang-pe-quan-pallet-2zem",
      name: "Màng PE quấn Pallet bọc hàng hóa 2zem",
      category: "Màng co quấn hàng",
      thicknessZem: "2 zem",
      thicknessMm: "0.02 mm (20 micron)",
      resinType: "Nguyên sinh LLDPE bám dính cao",
      tearStrength: "Độ co dãn 300%",
      tensileStrength: "ASTM D882 (40 MPa)",
      isoCertificates: ["ISO 9001:2015"],
      color: "Trong suốt",
      rollWidth: "Khổ 50cm",
      rollLength: "Cuộn 3.8kg / 5kg",
      pricePerKgBase: 44000,
      bestFor: "Quấn pallet hàng hóa xuất khẩu, bọc máy móc thiết bị tránh trầy xước"
    }
  ] as ProductSpec[],

  wholesalePricingTiers: [
    { minKg: 0, maxKg: 499, discountPercentage: 0, note: "Giá bán lẻ tiêu chuẩn" },
    { minKg: 500, maxKg: 1499, discountPercentage: 5, note: "Chiết khấu đại lý & công trình vừa (Giảm 5%)" },
    { minKg: 1500, maxKg: 4999, discountPercentage: 8, note: "Giá sỉ nhà máy công trình lớn (Giảm 8%)" },
    { minKg: 5000, maxKg: 999999, discountPercentage: 12, note: "Giá sỉ đại lý cấp 1 & Miễn phí vận chuyển (Giảm 12%)" }
  ] as PriceTier[],

  shippingFees: [
    { region: "Nội thành TP.HCM / Bình Dương / Đồng Nai", estimatedFee: "200.000đ - 350.000đ / chuyến xe tải", freeShippingMinKg: 1000 },
    { region: "Tỉnh Miền Tây & Đông Nam Bộ (Long An, Tiền Giang, Tây Ninh...)", estimatedFee: "500đ - 800đ / kg (Gửi xe chành hoặc giao tận công trình)", freeShippingMinKg: 3000 },
    { region: "Tỉnh Tây Nguyên & Miền Trung (Lâm Đồng, Đắk Lắk, Bình Thuận...)", estimatedFee: "800đ - 1.200đ / kg", freeShippingMinKg: 5000 },
    { region: "Các tỉnh Miền Bắc & Hà Nội", estimatedFee: "1.200đ - 1.800đ / kg (Gửi xe container/tàu hỏa)", freeShippingMinKg: 10000 }
  ] as ShippingPolicy[]
};

/**
 * Utility to calculate exact quote details programmatically
 */
export function calculateQuoteDetails(
  productSearchTerm: string,
  quantityKg: number,
  destinationRegion: string = "Nội thành TP.HCM / Bình Dương / Đồng Nai"
) {
  // Find matching product or default to 4zem
  let product = AI_KNOWLEDGE_BASE.products.find(p => 
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.thicknessZem.includes(productSearchTerm)
  );

  if (!product) {
    product = AI_KNOWLEDGE_BASE.products[0]; // Default 4zem
  }

  // Find tier discount
  const tier = AI_KNOWLEDGE_BASE.wholesalePricingTiers.find(
    t => quantityKg >= t.minKg && quantityKg <= t.maxKg
  ) || AI_KNOWLEDGE_BASE.wholesalePricingTiers[0];

  const unitPriceAfterDiscount = Math.round(product.pricePerKgBase * (1 - tier.discountPercentage / 100));
  const subtotal = Math.round(unitPriceAfterDiscount * quantityKg);

  // Shipping estimation
  const shippingPolicy = AI_KNOWLEDGE_BASE.shippingFees.find(
    s => s.region.toLowerCase().includes(destinationRegion.toLowerCase())
  ) || AI_KNOWLEDGE_BASE.shippingFees[0];

  let shippingFee = 0;
  if (quantityKg < shippingPolicy.freeShippingMinKg) {
    if (shippingPolicy.region.includes("Nội thành")) {
      shippingFee = quantityKg < 300 ? 250000 : 350000;
    } else {
      const ratePerKg = shippingPolicy.region.includes("Miền Tây") ? 650 : 1200;
      shippingFee = Math.max(300000, Math.round(quantityKg * ratePerKg));
    }
  }

  const grandTotal = subtotal + shippingFee;
  const estimatedAreaSqM = Math.round(quantityKg * (product.thicknessZem === "4 zem" ? 6.6 : product.thicknessZem === "6 zem" ? 4.4 : 2.6));

  return {
    product,
    quantityKg,
    unitPriceBeforeDiscount: product.pricePerKgBase,
    discountPercentage: tier.discountPercentage,
    unitPriceAfterDiscount,
    subtotal,
    shippingFee,
    grandTotal,
    estimatedAreaSqM,
    tierNote: tier.note,
    shippingNote: shippingFee === 0 ? "Miễn phí giao hàng tận công trình" : `Phí giao dự kiến: ${shippingFee.toLocaleString('vi-VN')} đ`
  };
}
