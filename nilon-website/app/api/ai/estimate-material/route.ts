import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export interface EstimateRequest {
  areaSqM: number;
  usageType: string; // e.g. 'lot-san-be-tong-mang' | 'lot-san-dan-dung' | 'chong-tham-mong-sau' | 'mang-nong-nghiep' | 'quan-pallet-boc-hang' | 'khac-mo-ta-rieng'
  usageTypeName?: string;
  layersCount?: number; // 1 or 2 layers
  peQualityGrade?: 'auto' | 'recycled' | 'virgin'; // quality tier
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

/**
 * Strict Physics & Price Engine for PE Film Estimation
 * Guarantees 100% mathematical accuracy without any calculation error or AI hallucination.
 */
function enforceStrictPhysicsEngine(
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

  // 1. Determine recommended Zem thickness & product parameters if not provided by AI
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

  // Honor user quality override
  if (input.peQualityGrade === 'recycled') isVirgin = false;
  if (input.peQualityGrade === 'virgin') isVirgin = true;

  // 2. Strict Mathematical Calculation according to PE Density
  // Formula: Effective Area = Area * Layers * (1 + Overlap / 100)
  const effectiveAreaSqM = Number((areaSqM * layersCount * (1 + overlapPct / 100)).toFixed(2));
  
  // Volume (m³) = Effective Area (m²) * Thickness (zem * 0.00001 m)
  // PE Density = 930 kg/m³
  // Weight (kg) = Effective Area * zem * 0.00001 * 930 = Effective Area * zem * 0.0093
  const exactWeightKg = Number((effectiveAreaSqM * zem * 0.0093).toFixed(2));
  const totalWeightKg = Math.max(1, Math.ceil(exactWeightKg));

  // 3. Roll Count Calculation (Standard 50kg roll)
  const stdRollWeight = usageType.includes('quan-pallet') ? 5 : 50;
  const rollCount = Math.max(1, Math.ceil(totalWeightKg / stdRollWeight));

  // 4. Factory Price Matrix & Tiered Bulk Volume Discounts (VNĐ / kg)
  let pricePerKgRecycled = 36000;
  let pricePerKgVirgin = 45000;
  let volumeTierLabel = 'Báo giá bán lẻ';

  if (usageType.includes('quan-pallet')) {
    pricePerKgRecycled = totalWeightKg >= 50 ? 38000 : 42000;
    pricePerKgVirgin = pricePerKgRecycled;
    volumeTierLabel = totalWeightKg >= 50 ? 'Bán sỉ quấn pallet' : 'Bán lẻ quấn pallet';
  } else {
    // Tái sinh tier
    if (totalWeightKg >= 1000) {
      pricePerKgRecycled = 30000; // Giá sỉ xưởng > 1 tấn
      volumeTierLabel = 'Giá sỉ xuất xưởng (> 1 Tấn)';
    } else if (totalWeightKg >= 200) {
      pricePerKgRecycled = 32000; // Giá công trình > 200kg
      volumeTierLabel = 'Giá đại lý công trình (> 200kg)';
    } else if (totalWeightKg >= 50) {
      pricePerKgRecycled = 34000; // Giá sỉ cuộn > 50kg
      volumeTierLabel = 'Giá sỉ theo cuộn (> 50kg)';
    } else {
      pricePerKgRecycled = 36000; // Giá lẻ
      volumeTierLabel = 'Giá lẻ dưới 50kg';
    }

    // Nguyên sinh tier
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

  // 5. Zero-Error Direct Price Multiplication
  const totalPriceExact = totalWeightKg * selectedPricePerKg;
  const estimatedPriceMin = totalWeightKg * pricePerKgRecycled;
  const estimatedPriceMax = totalWeightKg * pricePerKgVirgin;

  // Calculate volume discount savings compared to base retail rate
  const retailBasePrice = isVirgin ? 45000 : 36000;
  const savingsVnd = Math.max(0, (retailBasePrice - selectedPricePerKg) * totalWeightKg);

  // Technical Tips fallback
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

export async function POST(request: Request) {
  try {
    const body: EstimateRequest = await request.json();
    const { areaSqM, usageType, usageTypeName, layersCount, peQualityGrade, notes, projectDescription } = body;

    if (!areaSqM || areaSqM <= 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập diện tích thi công hợp lệ (> 0 m²)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Direct fallback if Groq API key is missing
    if (!apiKey) {
      const fallback = enforceStrictPhysicsEngine(body);
      return NextResponse.json(fallback);
    }

    try {
      const groq = new Groq({ apiKey });

      const systemPrompt = `Bạn là chuyên gia kỹ thuật hàng đầu về nilon xây dựng, màng PE chống thấm và vật tư lót sàn bê tông tại Việt Nam (nilonxaydung.vn).
Nhiệm vụ của bạn là nhận thông tin diện tích (m²), mục đích sử dụng công trình, mô tả thực tế từ người dùng, sau đó tư vấn chủng loại và thông số kỹ thuật chuẩn dạng JSON.

QUY TẮC TƯ VẤN KỸ THUẬT PE:
1. Độ dày nilon lót sàn bê tông:
   - Sàn dân dụng / nhỏ (< 300m²): 2 - 4 zem (0.02 - 0.04mm).
   - Sàn bê tông nhà xưởng / công trình vừa (300m² - 1500m²): 4 - 6 zem (0.04 - 0.06mm).
   - Sàn móng chịu lực lớn, cầu đường (> 1500m²): 6 - 10 zem.
   - Chống thấm hầm / hồ chứa / bạt nông nghiệp: 8 - 15 zem.
2. Tỷ lệ gối mí: 10% - 20% tùy bề mặt thi công.
3. Chất liệu: Tái sinh (lót sàn tiết kiệm) hoặc Nguyên sinh (trong suốt, chống thấm dẻo dai).

YÊU CẦU TRẢ VỀ JSON DUY NHẤT VỚI CÁC TRƯỜNG KỸ THUẬT:
{
  "recommendedProduct": string (tên sản phẩm khuyến nghị đầy đủ),
  "thicknessZem": number (số zem ví dụ 4 hoặc 6),
  "color": string (ví dụ "Màu đen xám" hoặc "Trong suốt"),
  "rollWidth": string (ví dụ "Khổ 2m (xòe 4m)"),
  "overlapPercentage": number (phần trăm gối mí ví dụ 15),
  "peQualityGrade": string ("recycled" hoặc "virgin"),
  "technicalTips": string[] (3 lời khuyên kỹ thuật thi công thực tế ngắn gọn),
  "explanation": string (lý giải tư vấn ngắn gọn chuyên nghiệp dưới 3 câu)
}`;

      const userPrompt = `Hãy tư vấn quy cách nilon vật tư cho công trình:
- Diện tích thi công: ${areaSqM} m²
- Số lớp trải: ${layersCount || 1} lớp
- Hạng mục / Mục đích: ${usageTypeName || usageType}
- Loại chất liệu yêu cầu: ${peQualityGrade === 'virgin' ? 'Nguyên sinh' : peQualityGrade === 'recycled' ? 'Tái sinh' : 'Tự động AI tư vấn'}
- Mô tả chi tiết công trình của khách: ${projectDescription || 'Không có'}
- Ghi chú / Yêu cầu thêm: ${notes || 'Không có'}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const responseText = chatCompletion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('Groq returned empty response');
      }

      const parsedAi = JSON.parse(responseText);

      // CRITICAL STEP: Pass AI recommendations through the Strict Physics & Price Engine
      // to ensure 100% mathematical precision for weight, roll count, and total price!
      const strictResult = enforceStrictPhysicsEngine(body, {
        recommendedProduct: parsedAi.recommendedProduct,
        thicknessZem: typeof parsedAi.thicknessZem === 'number' ? parsedAi.thicknessZem : undefined,
        color: parsedAi.color,
        rollWidth: parsedAi.rollWidth,
        overlapPercentage: typeof parsedAi.overlapPercentage === 'number' ? parsedAi.overlapPercentage : undefined,
        technicalTips: Array.isArray(parsedAi.technicalTips) ? parsedAi.technicalTips : undefined,
        explanation: parsedAi.explanation,
        peQualityGrade: parsedAi.peQualityGrade === 'virgin' ? 'virgin' : 'recycled'
      });

      strictResult.isAiGenerated = true;

      return NextResponse.json(strictResult);
    } catch (aiError) {
      console.warn('Groq AI Call failed, executing strict physics engine fallback:', aiError);
      const fallback = enforceStrictPhysicsEngine(body);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error('API estimate error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tính toán dự toán vật tư' },
      { status: 500 }
    );
  }
}
