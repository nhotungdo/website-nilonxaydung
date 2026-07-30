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
    tearStrengthTest: "Tiêu chuẩn đo độ xé rách ASTM D1922 (Elmendorf Tear Strength) đảm bảo màng nilon không bị thủng/xé rách khi công nhân di chuyển, kéo thép hoặc đổ bê tông đá 1x2 tươi trực tiếp lên trên.",
    safetyStandards: "Thiết bị bảo hộ lao động đạt tiêu chuẩn TCVN 6407:1998, CE S3, nhựa HDPE/ABS chịu lực chống va đập, đế/mũi lót thép chống đinh dập ngón."
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
    },
    // Bảo hộ lao động & Vật tư phụ
    {
      id: "mu-bao-ho-cong-trinh",
      name: "Mũ bảo hộ công trình (Nhựa HDPE/ABS)",
      category: "Bảo hộ lao động",
      thicknessZem: "N/A",
      thicknessMm: "N/A",
      resinType: "Nhựa HDPE / ABS chịu va đập",
      tearStrength: "TCVN 6407:1998",
      tensileStrength: "Chịu lực va đập > 5000N",
      isoCertificates: ["ISO 9001:2015", "TCVN 6407"],
      color: "Trắng, Vàng, Xanh dương, Đỏ",
      rollWidth: "Free size (có núm vặn)",
      rollLength: "Cái",
      pricePerKgBase: 45000,
      bestFor: "Bảo vệ vùng đầu cho kỹ sư, công nhân trên công trường, chống vật rơi"
    },
    {
      id: "giay-bao-ho-lao-dong",
      name: "Giày bảo hộ lao động (Mũi lót thép)",
      category: "Bảo hộ lao động",
      thicknessZem: "N/A",
      thicknessMm: "N/A",
      resinType: "Da thật / Da công nghiệp, Đế PU",
      tearStrength: "Đạt chuẩn CE S3 / TCVN",
      tensileStrength: "Chịu va đập 200J",
      isoCertificates: ["CE S3", "ISO 9001:2015"],
      color: "Đen",
      rollWidth: "Size 38 - 44",
      rollLength: "Đôi",
      pricePerKgBase: 350000,
      bestFor: "Chống đinh, chống dập ngón, chống trơn trượt cho thợ công trình & nhà xưởng"
    },
    {
      id: "gang-tay-bao-ho",
      name: "Găng tay sợi / Găng tay chống cắt",
      category: "Bảo hộ lao động",
      thicknessZem: "N/A",
      thicknessMm: "N/A",
      resinType: "Sợi Cotton / Phủ cao su Nitrile",
      tearStrength: "Chống xước & chống cắt mức 3-5",
      tensileStrength: "Bền bỉ",
      isoCertificates: ["ISO 9001:2015"],
      color: "Trắng, Xám, Đen",
      rollWidth: "Free size",
      rollLength: "Đôi",
      pricePerKgBase: 15000,
      bestFor: "Bảo vệ tay công nhân khi bốc xếp, thi công kéo thép & gạch đá"
    },
    {
      id: "quan-ao-phan-quang",
      name: "Áo phản quang kỹ sư / Đồng phục bảo hộ",
      category: "Bảo hộ lao động",
      thicknessZem: "N/A",
      thicknessMm: "N/A",
      resinType: "Vải Kaki Pangrim / Vải lưới phản quang",
      tearStrength: "Dày dặn, thấm hút mồ hôi tốt",
      tensileStrength: "Bền màu",
      isoCertificates: ["ISO 9001:2015"],
      color: "Xanh công nhân, Cam, Vàng chanh",
      rollWidth: "Size M, L, XL, XXL",
      rollLength: "Bộ / Áo",
      pricePerKgBase: 45000,
      bestFor: "Bảo hộ nhận diện công nhân & kỹ sư ban đêm hoặc môi trường ánh sáng yếu"
    },
    {
      id: "bat-che-cong-trinh",
      name: "Bạt che công trình (Bạt xanh cam / Bạt sọc)",
      category: "Vật tư che chắn",
      thicknessZem: "3 zem",
      thicknessMm: "0.03 mm",
      resinType: "Nhựa PE dệt tráng phủ chống thấm",
      tearStrength: "Bền nắng mưa 1-3 năm",
      tensileStrength: "Chịu kéo tốt",
      isoCertificates: ["ISO 9001:2015"],
      color: "Xanh cam / Sọc 3 màu",
      rollWidth: "Khổ 2m, 4m, 6m",
      rollLength: "Cuộn / Tấm",
      pricePerKgBase: 18000,
      bestFor: "Che nắng mưa, che chắn vật tư xây dựng, bao che giàn giáo công trình"
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

import { PRODUCTS } from '@/data/products';

/**
 * Utility to calculate exact quote details programmatically
 */
export function calculateQuoteDetails(
  productSearchTerm: string,
  quantityKg: number
) {
  const termLower = productSearchTerm.toLowerCase().trim();

  // Helper to normalize vietnamese string for robust fuzzy matching
  const normalizeStr = (str: string) => 
    str.toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .replace(/đ/g, 'd')
       .replace(/[^a-z0-9]/g, ' ')
       .replace(/\s+/g, ' ')
       .trim();

  const normalizedTerm = normalizeStr(termLower);

  // Strip Vietnamese question phrases to isolate product name
  const questionPhrases = [
    'bao nhieu tien', 'bao nhieu', 'gia bao nhieu', 'gia ntn', 'xin gia', 
    'bao gia', 'la bao nhieu', 'gia', 'ban the nao', 'mua', 'cho xin', 
    'cung cap', '1 cai', '1 doi', '1 bo', '1 kg', '1 cuon', '1 m2', 'co khong', 
    'can', 'muon', 'tinh gia'
  ];

  let cleanedTerm = normalizedTerm;
  for (const phrase of questionPhrases) {
    cleanedTerm = cleanedTerm.replace(new RegExp(`\\b${phrase}\\b`, 'g'), '').trim();
  }
  cleanedTerm = cleanedTerm.replace(/\s+/g, ' ').trim();
  if (!cleanedTerm) {
    cleanedTerm = normalizedTerm;
  }

  // Search through website catalog PRODUCTS
  let matchedProduct: { id: string; name: string; price: number; unit: string; category: string; description?: string } | null = null;
  let bestScore = 0;

  for (const p of PRODUCTS) {
    const pNameNorm = normalizeStr(p.name);
    const pSlugNorm = normalizeStr(p.slug);

    let score = 0;

    // Check exact or substring containment with cleaned search term & full term
    if (cleanedTerm === pNameNorm || cleanedTerm === pSlugNorm) {
      score = 100 + pNameNorm.length;
    } else if (cleanedTerm.includes(pNameNorm) || pNameNorm.includes(cleanedTerm)) {
      score = 50 + Math.min(cleanedTerm.length, pNameNorm.length);
    } else if (normalizedTerm.includes(pNameNorm) || pNameNorm.includes(normalizedTerm)) {
      score = 40 + Math.min(normalizedTerm.length, pNameNorm.length);
    } else {
      // Word match scoring
      const words = cleanedTerm.split(/\s+/).filter(w => w.length >= 2);
      const matchedWords = words.filter(w => pNameNorm.includes(w) || pSlugNorm.includes(w));
      if (matchedWords.length > 0) {
        score = matchedWords.length * 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      matchedProduct = p;
    }
  }

  // Also check AI_KNOWLEDGE_BASE.products
  for (const p of AI_KNOWLEDGE_BASE.products) {
    const pNameNorm = normalizeStr(p.name);
    let score = 0;

    if (cleanedTerm === pNameNorm) {
      score = 110 + pNameNorm.length;
    } else if (cleanedTerm.includes(pNameNorm) || pNameNorm.includes(cleanedTerm)) {
      score = 55 + Math.min(cleanedTerm.length, pNameNorm.length);
    } else if (normalizedTerm.includes(pNameNorm) || pNameNorm.includes(normalizedTerm)) {
      score = 45 + Math.min(normalizedTerm.length, pNameNorm.length);
    } else if (p.thicknessZem !== "N/A" && (cleanedTerm.includes(normalizeStr(p.thicknessZem)) || normalizedTerm.includes(normalizeStr(p.thicknessZem)))) {
      score = 30;
    }

    if (score > bestScore) {
      bestScore = score;
      matchedProduct = {
        id: p.id,
        name: p.name,
        price: p.pricePerKgBase,
        unit: p.rollLength || (p.thicknessZem !== "N/A" ? "kg" : "cái"),
        category: p.category,
        description: p.bestFor
      };
    }
  }

  // If match score is too low (< 5) or no product matches: Return notFound (Zalo OA fallback trigger)
  if (!matchedProduct || bestScore < 5) {
    return {
      notFound: true,
      searchedTerm: productSearchTerm,
      product: null,
      quantityKg: 0,
      unitLabel: "",
      isSafetyEquipment: false,
      unitPriceBeforeDiscount: 0,
      discountPercentage: 0,
      unitPriceAfterDiscount: 0,
      subtotal: 0,
      shippingFee: 0,
      grandTotal: 0,
      estimatedAreaSqM: 0,
      tierNote: "",
      shippingNote: ""
    };
  }

  const isSafetyEquipment = matchedProduct.category !== "Nilon lót sàn móng" && matchedProduct.category !== "nilon-lot-san-be-tong" && matchedProduct.unit !== "kg";
  const unitLabel = matchedProduct.unit || (isSafetyEquipment ? "Cái" : "kg");

  const product: ProductSpec = {
    id: matchedProduct.id,
    name: matchedProduct.name,
    category: isSafetyEquipment ? "Bảo hộ lao động" : "Nilon lót sàn móng",
    thicknessZem: "N/A",
    thicknessMm: "N/A",
    resinType: "Tiêu chuẩn công trình",
    tearStrength: "TCVN",
    tensileStrength: "Bền bỉ",
    isoCertificates: ["ISO 9001:2015"],
    color: "Tiêu chuẩn",
    rollWidth: "Tiêu chuẩn",
    rollLength: unitLabel,
    pricePerKgBase: matchedProduct.price,
    bestFor: matchedProduct.description || "Thi công công trình"
  };

  // Tier discount calculation
  let discountPercentage = 0;
  let tierNote = "Giá bán lẻ tiêu chuẩn";

  if (isSafetyEquipment) {
    if (quantityKg >= 500) {
      discountPercentage = 12;
      tierNote = "Chiết khấu đại lý cấp 1 (Giảm 12%)";
    } else if (quantityKg >= 100) {
      discountPercentage = 8;
      tierNote = "Chiết khấu công trình lớn (Giảm 8%)";
    } else if (quantityKg >= 20) {
      discountPercentage = 5;
      tierNote = "Chiết khấu số lượng vừa (Giảm 5%)";
    }
  } else {
    const tier = AI_KNOWLEDGE_BASE.wholesalePricingTiers.find(
      t => quantityKg >= t.minKg && quantityKg <= t.maxKg
    ) || AI_KNOWLEDGE_BASE.wholesalePricingTiers[0];
    discountPercentage = tier.discountPercentage;
    tierNote = tier.note;
  }

  const unitPriceAfterDiscount = Math.round(product.pricePerKgBase * (1 - discountPercentage / 100));
  const subtotal = Math.round(unitPriceAfterDiscount * quantityKg);

  const grandTotal = subtotal;
  const estimatedAreaSqM = isSafetyEquipment 
    ? 0 
    : Math.round(quantityKg * (product.thicknessZem === "4 zem" ? 6.6 : product.thicknessZem === "6 zem" ? 4.4 : 2.6));

  return {
    notFound: false,
    product,
    quantityKg,
    unitLabel,
    isSafetyEquipment,
    unitPriceBeforeDiscount: product.pricePerKgBase,
    discountPercentage,
    unitPriceAfterDiscount,
    subtotal,
    shippingFee: 0,
    grandTotal,
    estimatedAreaSqM,
    tierNote,
    shippingNote: ""
  };
}
