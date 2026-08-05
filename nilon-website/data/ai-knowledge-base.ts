/**
 * Core Technical & Commercial RAG Knowledge Base for Nilon Xây Dựng AI Sales Assistant
 */

import { PRODUCTS } from '@/data/products';

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
    tensileStrengthTest: "Tiêu chuẩn ASTM D882 đo độ bền kéo đứt màng PE (22 - 40 MPa), đảm bảo màng không bị biến dạng khi lót dưới tải trọng bê tông tươi nặng từ 2.4-2.5 tấn/m³.",
    safetyStandards: "Thiết bị bảo hộ lao động đạt tiêu chuẩn TCVN 6407:1998, CE S3, nhựa HDPE/ABS chịu lực chống va đập, đế/mũi lót thép chống đinh dập ngón."
  },

  constructionGuides: {
    foundationPreparation: "Quy trình lót màng nilon đổ bê tông chuẩn kỹ thuật:\n1. Nền đất/đá dăm cần được đầm chặt và phủ lớp cát mịn 3-5cm để tránh đá nhọn làm thủng màng.\n2. Trải cuộn nilon phẳng, không bị nhăn nheo hay đọng nước.\n3. Giáp mí (Overlap): Các dải nilon chồng lên nhau tối thiểu 10cm - 20cm để chống thất thoát nước xi măng và ngăn hơi ẩm từ đất chèn lên.\n4. Dán niêm phong mối nối: Sử dụng băng keo dán màng chuyên dụng hoặc keo dán PE tại các đoạn nối nilon.\n5. Đặt con kê bê tông và thi công cốt thép cẩn thận, tránh va đập nhọn trực tiếp vào màng."
  },

  commercialPolicies: {
    vatInvoice: {
      status: "Có hỗ trợ 100%",
      detail: "Công ty xuất đầy đủ Hóa đơn Giá trị Gia tăng (VAT 10%) hợp lệ cho các doanh nghiệp, tổng thầu thi công, công ty xây dựng. Giá niêm yết trên hợp đồng đã bao gồm hoặc chưa bao gồm VAT theo thỏa thuận."
    },
    b2bPaymentTerms: {
      standard: "Đặt cọc 30% khi ký hợp đồng/chốt đơn hàng, thanh toán 70% còn lại ngay khi giao hàng đến công trình và nghiệm thu chứng chỉ CO/CQ.",
      contractorCredit: "Hỗ trợ bảo lãnh / công nợ từ 30 - 45 ngày đối với các Nhà thầu chính, Tổng thầu xây dựng có hợp đồng cung ứng vật tư dài hạn hoặc đơn hàng lớn định kỳ."
    },
    returnAndExchange: {
      policy: "Chính sách đổi trả 1-đổi-1 trong vòng 7 ngày kể từ khi nhận hàng.",
      conditions: "Đổi mới miễn phí 100% nếu cuộn nilon bị rách rưới, sai độ zem, thiếu kg, rách nát do lỗi vận chuyển hoặc lỗi sản xuất từ nhà máy."
    },
    contractorDiscounts: {
      smallOrder: "Đơn hàng < 500kg: Giá sỉ tiêu chuẩn.",
      mediumOrder: "Đơn hàng 500kg - 1.500kg: Chiết khấu 5%.",
      largeOrder: "Đơn hàng 1.500kg - 5.000kg: Chiết khấu 8%.",
      vipContractor: "Đơn hàng > 5.000kg hoặc Đối tác Nhà thầu thân thiết: Chiết khấu 12% + Miễn phí vận chuyển tận công trình."
    }
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
    { region: "Nội thành TP.HCM / Bình Dương / Đồng Nai", estimatedFee: "200.000đ - 350.000đ / chuyến xe tải (Giao hỏa tốc 2h - 4h)", freeShippingMinKg: 1000 },
    { region: "Tỉnh Miền Tây & Đông Nam Bộ (Long An, Tiền Giang, Tây Ninh...)", estimatedFee: "500đ - 800đ / kg (Gửi xe chành hoặc xe tải giao tận công trình trong ngày)", freeShippingMinKg: 3000 },
    { region: "Tỉnh Tây Nguyên & Miền Trung (Lâm Đồng, Đắc Lắk, Bình Thuận...)", estimatedFee: "800đ - 1.200đ / kg (Thời gian giao 1 - 2 ngày)", freeShippingMinKg: 5000 },
    { region: "Các tỉnh Miền Bắc & Hà Nội (Hà Nội, Hải Phòng, Bắc Ninh, Quảng Ninh...)", estimatedFee: "1.200đ - 1.800đ / kg (Vận chuyển xe Container chuyên dụng / Tàu hỏa Bắc Nam 2 - 4 ngày). Hỗ trợ 50-100% cước cho đơn > 5 tấn, miễn phí giao tận kho cho đơn > 10 tấn.", freeShippingMinKg: 10000 }
  ] as ShippingPolicy[]
};

/**
 * Formats all website catalog products into a structured RAG text block
 * for the AI Sales Assistant prompt.
 */
export function getFormattedWebsiteCatalog(): string {
  const catalogLines = PRODUCTS.map(p => {
    const specsStr = p.specs ? p.specs.map(s => `${s.label}: ${s.value}`).join(', ') : '';
    return `- ${p.name} | Giá: ${p.price.toLocaleString('vi-VN')} VNĐ / ${p.unit} | Danh mục: ${p.category} | ${p.description || ''} ${specsStr ? `(${specsStr})` : ''}`.trim();
  });

  return catalogLines.join('\n');
}

export interface CatalogVariant {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  description?: string;
}

/**
 * Utility to calculate exact quote details programmatically
 * and list ALL matching product variants & related complementary products.
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
    'can', 'muon', 'tinh gia', 'tat ca', 'cac loai', 'cho toi hoi'
  ];

  let cleanedTerm = normalizedTerm;
  for (const phrase of questionPhrases) {
    cleanedTerm = cleanedTerm.replace(new RegExp(`\\b${phrase}\\b`, 'g'), '').trim();
  }
  cleanedTerm = cleanedTerm.replace(/\s+/g, ' ').trim();
  if (!cleanedTerm) {
    cleanedTerm = normalizedTerm;
  }

  // 1. Search through website catalog PRODUCTS to find ALL matching variants of the queried product group
  const allVariants: CatalogVariant[] = [];
  const relatedProducts: CatalogVariant[] = [];

  // Determine main category/family key
  let isNilonFamily = cleanedTerm.includes('nilon') || cleanedTerm.includes('pe') || cleanedTerm.includes('mang') || cleanedTerm.includes('lot san') || cleanedTerm.includes('zem');
  let isHatSafety = cleanedTerm.includes('mu') || cleanedTerm.includes('non') || cleanedTerm.includes('kinh');
  let isGloveSafety = cleanedTerm.includes('gang') || cleanedTerm.includes('tay');
  let isShoeSafety = cleanedTerm.includes('giay') || cleanedTerm.includes('ung') || cleanedTerm.includes('chan');
  let isClothesSafety = cleanedTerm.includes('quan') || cleanedTerm.includes('ao') || cleanedTerm.includes('phan quang') || cleanedTerm.includes('dong phuc');
  let isTarpSafety = cleanedTerm.includes('bat') || cleanedTerm.includes('keo') || cleanedTerm.includes('luoi') || cleanedTerm.includes('che');

  for (const p of PRODUCTS) {
    const pNameNorm = normalizeStr(p.name);
    const pSlugNorm = normalizeStr(p.slug);

    let isMatch = false;

    if (cleanedTerm === pNameNorm || cleanedTerm === pSlugNorm) {
      isMatch = true;
    } else if (cleanedTerm.length >= 3 && (pNameNorm.includes(cleanedTerm) || cleanedTerm.includes(pNameNorm))) {
      isMatch = true;
    } else if (isNilonFamily && (p.category === 'nilon-lot-san-be-tong' || pNameNorm.includes('nilon') || pNameNorm.includes('mang pe'))) {
      isMatch = true;
    } else if (isHatSafety && (p.subCategory === 'bao-ho-dau' || pNameNorm.includes('mu') || pNameNorm.includes('non'))) {
      isMatch = true;
    } else if (isGloveSafety && (p.subCategory === 'bao-ho-tay' || pNameNorm.includes('gang'))) {
      isMatch = true;
    } else if (isShoeSafety && (p.subCategory === 'bao-ho-chan' || pNameNorm.includes('giay') || pNameNorm.includes('ung'))) {
      isMatch = true;
    } else if (isClothesSafety && (p.subCategory === 'quan-ao-bao-ho' || pNameNorm.includes('ao') || pNameNorm.includes('quan'))) {
      isMatch = true;
    } else if (isTarpSafety && (p.subCategory === 'vat-tu-che-chan' || pNameNorm.includes('bat') || pNameNorm.includes('keo'))) {
      isMatch = true;
    }

    if (isMatch) {
      if (!allVariants.some(v => v.id === p.id)) {
        allVariants.push({
          id: p.id,
          name: p.name,
          price: p.price,
          unit: p.unit,
          category: p.category,
          description: p.description
        });
      }
    }
  }

  // Also match AI_KNOWLEDGE_BASE.products
  for (const p of AI_KNOWLEDGE_BASE.products) {
    const pNameNorm = normalizeStr(p.name);
    if (cleanedTerm === pNameNorm || (cleanedTerm.length >= 3 && (pNameNorm.includes(cleanedTerm) || cleanedTerm.includes(pNameNorm))) || (isNilonFamily && p.category.includes('Nilon'))) {
      if (!allVariants.some(v => v.id === p.id || v.name === p.name)) {
        allVariants.push({
          id: p.id,
          name: p.name,
          price: p.pricePerKgBase,
          unit: p.rollLength || "kg",
          category: p.category,
          description: p.bestFor
        });
      }
    }
  }

  // 2. Find complementary / RELATED products that are NOT in allVariants
  for (const p of PRODUCTS) {
    if (allVariants.some(v => v.id === p.id)) continue;

    let isRelated = false;
    if (isNilonFamily) {
      // If querying nilon, related products are tape, tarps, safety gloves, safety boots
      if (p.id === 'bang-keo-cong-nghiep' || p.id === 'bat-che-cong-trinh' || p.id === 'mu-bao-ho-cong-trinh' || p.id === 'giay-bao-ho') {
        isRelated = true;
      }
    } else {
      // If querying safety gear, related products are nilon lót sàn 4zem/6zem, bạt che
      if (p.id === 'nilon-lot-san-4zem' || p.id === 'nilon-lot-san-6zem' || p.id === 'bat-che-cong-trinh') {
        isRelated = true;
      }
    }

    if (isRelated && !relatedProducts.some(r => r.id === p.id)) {
      relatedProducts.push({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        category: p.category,
        description: p.description
      });
    }
  }

  // If no specific variants matched, pick the top matching product or default first variant
  let primaryMatched = allVariants[0] || null;
  if (!primaryMatched) {
    return {
      notFound: true,
      searchedTerm: productSearchTerm,
      product: null,
      allVariants: [],
      relatedProducts: [],
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

  const isSafetyEquipment = primaryMatched.category !== "Nilon lót sàn móng" && primaryMatched.category !== "nilon-lot-san-be-tong" && primaryMatched.unit !== "kg";
  const unitLabel = primaryMatched.unit || (isSafetyEquipment ? "Cái" : "kg");

  const product: ProductSpec = {
    id: primaryMatched.id,
    name: primaryMatched.name,
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
    pricePerKgBase: primaryMatched.price,
    bestFor: primaryMatched.description || "Thi công công trình"
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
    allVariants,
    relatedProducts,
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
