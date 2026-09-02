/**
 * Core Technical & Commercial RAG Knowledge Base for Nilon Xây Dựng AI Sales Assistant
 */

import { PRODUCTS } from '@/data/products';
import { prisma } from '@/lib/prisma';

export interface EstimateRequest {
  areaSqM: number;
  usageType: string;
  usageTypeName?: string;
  layersCount?: number;
  peQualityGrade?: 'auto' | 'recycled' | 'virgin';
  notes?: string;
  projectDescription?: string;
}

export interface EstimateResult {
  recommendedProduct: string;
  thicknessZem: number;
  thicknessMm: number;
  color: string;
  rollWidth: string;
  layersCount: number;
  effectiveAreaSqM: number;
  exactWeightKg: number;
  totalWeightKg: number;
  rollCount: number;
  peGradeName: string;
  pricePerKg: number;
  totalPriceExact: number;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  overlapPercentage: number;
  volumeTierLabel: string;
  savingsVnd: number;
  technicalTips: string[];
  explanation: string;
  isAiGenerated: boolean;
}

export function enforceStrictPhysicsEngine(
  input: EstimateRequest,
  aiParams?: {
    recommendedProduct?: string;
    thicknessZem?: number;
    color?: string;
    rollWidth?: string;
    overlapPercentage?: number;
    technicalTips?: string[];
    explanation?: string;
    peQualityGrade?: 'recycled' | 'virgin';
  }
): EstimateResult {
  const areaSqM = Math.max(1, input.areaSqM || 1);
  const layersCount = Math.max(1, input.layersCount || 1);
  const usageType = input.usageType || 'lot-san-be-tong-mang';

  let zem = aiParams?.thicknessZem || 4;
  let overlapPct = aiParams?.overlapPercentage || 15;
  let color = aiParams?.color || 'Màu đen / xám lót công trình';
  let rollWidth = aiParams?.rollWidth || 'Khổ 2m (xòe 4m) x 100m';
  let productName = aiParams?.recommendedProduct || 'Nilon lót sàn bê tông 4zem chống mất nước';
  let isVirgin = input.peQualityGrade === 'virgin' || aiParams?.peQualityGrade === 'virgin';

  if (!aiParams?.thicknessZem) {
    if (usageType.includes('chong-tham') || usageType.includes('mong-sau')) {
      zem = 10;
      productName = 'Màng PE đen chống thấm chuyên dụng 10zem (0.10mm)';
      rollWidth = 'Khổ 2m (xòe 4m) x 50m';
      color = 'Màu đen bóng chống thấm';
      overlapPct = 15;
      isVirgin = false;
    } else if (usageType.includes('nong-nghiep') || usageType.includes('nha-kinh')) {
      zem = 7;
      productName = 'Màng nilon phủ nông nghiệp & nhà kính 7zem';
      rollWidth = 'Khổ 1.4m - 2m trong suốt';
      color = 'Màu trong suốt phủ UV';
      overlapPct = 10;
      isVirgin = true;
    } else if (usageType.includes('quan-pallet') || usageType.includes('boc-hang')) {
      zem = 2;
      productName = 'Màng PE quấn pallet & bọc hàng hóa 2zem (20 micron)';
      rollWidth = 'Khổ 50cm (cuộn 3.8kg - 5kg)';
      color = 'Màu trong suốt siêu dẻo';
      overlapPct = 10;
      isVirgin = true;
    } else if (usageType.includes('dan-dung')) {
      zem = areaSqM > 500 ? 4 : 2;
      productName = `Nilon lót sàn bê tông nhà dân dụng ${zem}zem`;
      overlapPct = 15;
    } else if (areaSqM > 1000) {
      zem = 6;
      productName = 'Nilon lót sàn bê tông móng công trình lớn 6zem (0.06mm)';
      overlapPct = 15;
    }
  }

  if (input.peQualityGrade === 'recycled') isVirgin = false;
  if (input.peQualityGrade === 'virgin') isVirgin = true;

  const effectiveAreaSqM = Number((areaSqM * layersCount * (1 + overlapPct / 100)).toFixed(2));
  const exactWeightKg = Number((effectiveAreaSqM * zem * 0.0093).toFixed(2));
  const totalWeightKg = Math.max(1, Math.ceil(exactWeightKg));

  const stdRollWeight = usageType.includes('quan-pallet') ? 5 : 50;
  const rollCount = Math.max(1, Math.ceil(totalWeightKg / stdRollWeight));

  let pricePerKgRecycled = 36000;
  let pricePerKgVirgin = 45000;
  let volumeTierLabel = 'Báo giá bán lẻ';

  if (usageType.includes('quan-pallet')) {
    pricePerKgRecycled = totalWeightKg >= 50 ? 38000 : 42000;
    pricePerKgVirgin = pricePerKgRecycled;
    volumeTierLabel = totalWeightKg >= 50 ? 'Bán sỉ quấn pallet' : 'Bán lẻ quấn pallet';
  } else {
    if (totalWeightKg >= 1000) {
      pricePerKgRecycled = 30000;
      volumeTierLabel = 'Giá sỉ xuất xưởng (> 1 Tấn)';
    } else if (totalWeightKg >= 200) {
      pricePerKgRecycled = 32000;
      volumeTierLabel = 'Giá đại lý công trình (> 200kg)';
    } else if (totalWeightKg >= 50) {
      pricePerKgRecycled = 34000;
      volumeTierLabel = 'Giá sỉ theo cuộn (> 50kg)';
    } else {
      pricePerKgRecycled = 36000;
      volumeTierLabel = 'Giá lẻ dưới 50kg';
    }

    if (totalWeightKg >= 1000) {
      pricePerKgVirgin = 36000;
    } else if (totalWeightKg >= 200) {
      pricePerKgVirgin = 39000;
    } else if (totalWeightKg >= 50) {
      pricePerKgVirgin = 42000;
    } else {
      pricePerKgVirgin = 45000;
    }
  }

  const selectedPricePerKg = isVirgin ? pricePerKgVirgin : pricePerKgRecycled;
  const peGradeName = isVirgin ? 'Nhựa PE Nguyên Sinh Trắng Trong' : 'Nhựa PE Tái Sinh Chuyên Lót Bê Tông';

  const totalPriceExact = totalWeightKg * selectedPricePerKg;
  const estimatedPriceMin = totalWeightKg * pricePerKgRecycled;
  const estimatedPriceMax = totalWeightKg * pricePerKgVirgin;

  const retailBasePrice = isVirgin ? 45000 : 36000;
  const savingsVnd = Math.max(0, (retailBasePrice - selectedPricePerKg) * totalWeightKg);

  const technicalTips = aiParams?.technicalTips && aiParams.technicalTips.length > 0
    ? aiParams.technicalTips
    : [
        `Gối chồng mí giữa 2 dải nilon tối thiểu ${overlapPct}cm để ngăn nước xi măng thấm mất vào đất móng.`,
        `Trải nilon ${layersCount > 1 ? `thành ${layersCount} lớp chồng chéo` : 'phủ kín diện tích'}, dán kín các mép giáp ranh bằng băng dính xây dựng.`,
        'Kiểm tra mặt bằng dọn dẹp vật sắc nhọn trước khi trải màng để tránh đâm thủng.'
      ];

  const explanation = aiParams?.explanation
    ? aiParams.explanation
    : `Dự toán tính toán chính xác cho diện tích ${areaSqM.toLocaleString('vi-VN')} m² (${layersCount} lớp nilon), độ dày ${zem}zem (${(zem / 100).toFixed(2)}mm), gối mí ${overlapPct}%. Khối lượng vật lý PE chuẩn là ${totalWeightKg} kg (~${rollCount} cuộn).`;

  return {
    recommendedProduct: productName,
    thicknessZem: zem,
    thicknessMm: Number((zem / 100).toFixed(2)),
    color: color,
    rollWidth: rollWidth,
    layersCount: layersCount,
    effectiveAreaSqM: effectiveAreaSqM,
    exactWeightKg: exactWeightKg,
    totalWeightKg: totalWeightKg,
    rollCount: rollCount,
    peGradeName: peGradeName,
    pricePerKg: selectedPricePerKg,
    totalPriceExact: totalPriceExact,
    estimatedPriceMin: estimatedPriceMin,
    estimatedPriceMax: estimatedPriceMax,
    overlapPercentage: overlapPct,
    volumeTierLabel: volumeTierLabel,
    savingsVnd: savingsVnd,
    technicalTips: technicalTips,
    explanation: explanation,
    isAiGenerated: false
  };
}

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
    address: "KCN Tân Bình, Hà Nội & KCN Sóng Thần, Bình Dương",
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
    { region: "Nội thành Hà Nội / Bình Dương / Đồng Nai", estimatedFee: "200.000đ - 350.000đ / chuyến xe tải (Giao hỏa tốc 2h - 4h)", freeShippingMinKg: 1000 },
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

// const normalizeStr = (str: string) =>
//   str.toLowerCase()
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/đ/g, 'd')
//     .replace(/[^a-z0-9]/g, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();

export async function searchProductsDB(keyword: string, useCase?: string) {
  const term = keyword?.trim() || '';
  const uCase = useCase?.trim() || '';

  const whereConditions: Record<string, unknown> = {};
  const OR: Record<string, unknown>[] = [];

  if (term) {
    const terms = term.split(' ').filter(Boolean);
    const andConditions = terms.map(t => ({
      name: { contains: t, mode: 'insensitive' }
    }));
    OR.push({ AND: andConditions });
    OR.push({ category: { contains: term, mode: 'insensitive' } });
  }

  if (uCase) {
    OR.push({ name: { contains: uCase, mode: 'insensitive' } });
    OR.push({ description: { contains: uCase, mode: 'insensitive' } });
  }

  if (OR.length > 0) {
    whereConditions.OR = OR;
  }

  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: whereConditions,
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        category: true,
        description: true,
        image: true
      }
    });
  } catch (error) {
    console.error("AI DB Search Error:", error);
  }

  if (dbProducts.length === 0 && term) {
    const terms = term.split(' ').filter(Boolean).map(t => t.toLowerCase());
    const matched = PRODUCTS.filter(p => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase();
      return terms.every(t => pName.includes(t) || pCat.includes(t));
    }).slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      unit: p.unit,
      category: p.category,
      description: p.description || '',
      image: p.image
    }));
    return matched;
  }

  return dbProducts;
}

export async function getProductDetailDB(productId: string) {
  try {
    let product: any = await prisma.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      const staticProd = PRODUCTS.find(p => p.id === productId || p.slug === productId);
      if (staticProd) {
        product = {
          id: staticProd.id,
          name: staticProd.name,
          price: staticProd.price,
          unit: staticProd.unit,
          category: staticProd.category,
          description: staticProd.description || '',
          specs: staticProd.specs || []
        };
      }
    }

    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      category: product.category,
      description: product.description,
      specs: product.specs || []
    };
  } catch (error) {
    console.error("AI DB GetDetail Error:", error);
    return null;
  }
}

export async function calculateQuoteDetails(productId: string, quantityKg: number) {
  let primaryMatched: any = null;
  try {
    primaryMatched = await prisma.product.findUnique({ where: { id: productId } });
  } catch (error) {
    console.error("AI DB Quote Error:", error);
  }

  if (!primaryMatched) {
    let staticProd = PRODUCTS.find(p => p.id === productId || p.slug === productId);
    
    if (!staticProd) {
      const terms = productId.split(' ').filter(Boolean).map(t => t.toLowerCase());
      staticProd = PRODUCTS.find(p => {
        const pName = p.name.toLowerCase();
        return terms.every(t => pName.includes(t));
      });
    }

    if (staticProd) {
      primaryMatched = {
        id: staticProd.id,
        name: staticProd.name,
        price: staticProd.price,
        unit: staticProd.unit,
        category: staticProd.category,
        description: staticProd.description || ''
      };
    }
  }

  if (!primaryMatched) {
    return { notFound: true };
  }

  const isSafetyEquipment = primaryMatched.category !== "Nilon lót sàn móng" && primaryMatched.category !== "nilon-lot-san-be-tong" && primaryMatched.unit !== "kg";
  const unitLabel = primaryMatched.unit || (isSafetyEquipment ? "Cái" : "kg");

  const product: ProductSpec = {
    id: primaryMatched.id,
    name: primaryMatched.name,
    category: isSafetyEquipment ? "Bảo hộ lao động" : "Nilon lót sàn móng",
    thicknessZem: "N/A",
    thicknessMm: "N/A",
    resinType: "Tiêu chuẩn",
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
    estimatedAreaSqM: 0,
    tierNote
  };
}
