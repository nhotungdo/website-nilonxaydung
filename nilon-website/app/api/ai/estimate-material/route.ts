import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface EstimateRequest {
  areaSqM: number;
  usageType: string; // e.g. 'lot-san-be-tong' | 'chong-tham' | 'mang-nong-nghiep' | 'quan-pallet' | 'khac'
  usageTypeName?: string;
  notes?: string;
  projectDescription?: string;
}

export interface EstimateResult {
  recommendedProduct: string;
  thicknessZem: number;
  thicknessMm: number;
  color: string;
  rollWidth: string;
  totalWeightKg: number;
  rollCount: number;
  pricePerKg: number;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  overlapPercentage: number;
  technicalTips: string[];
  explanation: string;
  isAiGenerated: boolean;
}

// Fallback calculation logic when Groq API key is missing or encounters network issue
function calculateDeterministicEstimate(areaSqM: number, usageType: string): EstimateResult {
  let zem = 4;
  let color = 'Màu đen / xám';
  let rollWidth = 'Khổ 2m (xung đôi 4m)';
  let productName = 'Nilon lót sàn bê tông 4zem chống mất nước';
  let pricePerKg = 34000;
  let overlapPct = 15;

  if (usageType.includes('chong-tham') || usageType.includes('mong-sau')) {
    zem = 10;
    productName = 'Màng PE đen chống thấm chuyên dụng 10zem (100 micron)';
    pricePerKg = 38000;
    rollWidth = 'Khổ 2m (xung 4m)';
  } else if (usageType.includes('nong-nghiep') || usageType.includes('nha-kinh')) {
    zem = 7;
    color = 'Màu trong suốt / phủ nông nghiệp';
    productName = 'Màng nilon phủ nông nghiệp & nhà kính 7zem';
    pricePerKg = 39000;
    rollWidth = 'Khổ 1.4m - 2m';
  } else if (usageType.includes('quan-pallet') || usageType.includes('boc-hang')) {
    zem = 2;
    color = 'Màu trong suốt (PE quấn tay/máy)';
    productName = 'Màng PE quấn pallet bọc hàng hoá 2zem';
    pricePerKg = 42000;
    rollWidth = 'Khổ 50cm';
    overlapPct = 10;
  } else if (areaSqM > 1000) {
    zem = 6;
    productName = 'Nilon lót sàn bê tông móng công trình lớn 6zem (0.06mm)';
    pricePerKg = 33000;
  }

  // PE density ≈ 0.93 kg/dm³ = 930 kg/m³
  // Volume (m3) = area (m2) * (zem * 0.00001 m) * (1 + overlapPct / 100)
  // Weight (kg) = Volume * 930
  const effectiveArea = areaSqM * (1 + overlapPct / 100);
  const thicknessMeter = zem * 0.00001;
  const rawWeight = effectiveArea * thicknessMeter * 930;
  const totalWeightKg = Math.max(5, Math.ceil(rawWeight));
  
  // Standard 50kg roll size
  const stdRollWeight = 50;
  const rollCount = Math.max(1, Math.ceil(totalWeightKg / stdRollWeight));

  const totalMin = Math.round(totalWeightKg * pricePerKg * 0.95);
  const totalMax = Math.round(totalWeightKg * pricePerKg * 1.05);

  return {
    recommendedProduct: productName,
    thicknessZem: zem,
    thicknessMm: zem / 100,
    color: color,
    rollWidth: rollWidth,
    totalWeightKg: totalWeightKg,
    rollCount: rollCount,
    pricePerKg: pricePerKg,
    estimatedPriceMin: totalMin,
    estimatedPriceMax: totalMax,
    overlapPercentage: overlapPct,
    technicalTips: [
      `Cần gối chồng mí giữa 2 dải nilon tối thiểu ${overlapPct}cm để đảm bảo không bị dồn nilon khi đổ bê tông.`,
      'Gia cố mối nối bằng băng keo dán chuyên dụng hoặc trải gối xuôi chiều đổ bê tông.',
      'Kiểm tra và dọn dẹp vật sắc nhọn trên bề mặt nền trước khi trải nilon.'
    ],
    explanation: `Dựa trên diện tích ${areaSqM.toLocaleString('vi-VN')} m², hệ thống tính toán khối lượng màng PE độ dày ${zem}zem với hệ số hao hụt gối mí ${overlapPct}% giúp tối ưu chi phí vật tư tốt nhất.`,
    isAiGenerated: false
  };
}

export async function POST(request: Request) {
  try {
    const body: EstimateRequest = await request.json();
    const { areaSqM, usageType, usageTypeName, notes, projectDescription } = body;

    if (!areaSqM || areaSqM <= 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập diện tích thi công hợp lệ (> 0 m²)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Check if Groq API key is present
    if (!apiKey) {
      const fallback = calculateDeterministicEstimate(areaSqM, usageType || '');
      return NextResponse.json(fallback);
    }

    try {
      const groq = new Groq({ apiKey });

      const systemPrompt = `Bạn là chuyên gia kỹ thuật hàng đầu về nilon xây dựng, màng PE chống thấm và vật tư lót sàn bê tông tại Việt Nam (nilonxaydung.vn).
Nhiệm vụ của bạn là nhận thông tin diện tích (m²) và mục đích sử dụng công trình từ người dùng, sau đó trả về bản dự toán chi tiết dạng JSON chuẩn.

QUY TẮC KỸ THUẬT & ĐỊNH MỨC PE:
1. Độ dày nilon lót sàn:
   - Sàn dân dụng / nhỏ (< 300m²): 2 - 4 zem (0.02 - 0.04mm).
   - Sàn bê tông nhà xưởng / công trình vừa (300m² - 1500m²): 4 - 6 zem (0.04 - 0.06mm).
   - Sàn chịu lực lớn / móng màng chống thấm sâu (> 1500m² hoặc công trình móng): 6 - 10 zem.
   - Chống thấm hồ sơ / hầm / bạt nông nghiệp: 8 - 15 zem.
2. Tỷ trọng nhựa PE: ~0.93 kg/m³. Độ dày 1 zem = 0.01mm = 0.00001m.
3. Hao hụt gối mí: 10% - 15% diện tích sàn.
4. Đơn giá trung bình nilon lót sàn xây dựng: 30,000 - 45,000 VNĐ/kg tùy độ dày và loại nhựa.
5. Quy cách cuộn: Khổ 1m4 gập thành 2m8, hoặc Khổ 2m gập thành 4m. Khối lượng 1 cuộn chuẩn: 50 kg.

YÊU CẦU TRẢ VỀ JSON DUY NHẤT VỚI CÁC TRƯỜNG:
{
  "recommendedProduct": string (tên sản phẩm đầy đủ),
  "thicknessZem": number (số zem ví dụ 4 hoặc 6),
  "thicknessMm": number (độ dày mm ví dụ 0.04),
  "color": string (ví dụ "Màu đen xám" hoặc "Trong suốt"),
  "rollWidth": string (ví dụ "Khổ 2m (xung đôi 4m)"),
  "totalWeightKg": number (tổng số kg tròn),
  "rollCount": number (số cuộn tròn 50kg/cuộn),
  "pricePerKg": number (đơn giá VNĐ/kg ví dụ 34000),
  "estimatedPriceMin": number (tổng tiền min VNĐ),
  "estimatedPriceMax": number (tổng tiền max VNĐ),
  "overlapPercentage": number (phần trăm gối mí ví dụ 15),
  "technicalTips": string[] (3 lời khuyên kỹ thuật thi công thực tế ngắn gọn),
  "explanation": string (lý giải tư vấn ngắn gọn chuyên nghiệp dưới 3 câu)
}`;

      const userPrompt = `Hãy dự toán vật tư nilon cho công trình:
- Diện tích thi công: ${areaSqM} m²
- Hạng mục / Mục đích: ${usageTypeName || usageType}
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

      const parsed: EstimateResult = JSON.parse(responseText);
      parsed.isAiGenerated = true;

      return NextResponse.json(parsed);
    } catch (aiError) {
      console.warn('Groq AI Call failed, falling back to algorithm:', aiError);
      const fallback = calculateDeterministicEstimate(areaSqM, usageType || '');
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
