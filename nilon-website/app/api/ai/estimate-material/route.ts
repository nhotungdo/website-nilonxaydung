import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { EstimateRequest, EstimateResult, enforceStrictPhysicsEngine } from '@/data/ai-knowledge-base';

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
