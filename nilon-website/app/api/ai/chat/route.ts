import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { calculateQuoteDetails } from '@/data/ai-knowledge-base';
import { generateQuotePDF, QuotePDFData } from '@/lib/pdf-quote-generator';
import { sendTelegramMessage, escapeHTML } from '@/lib/telegram';
import { prisma } from '@/lib/prisma';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// Groq Function Definitions
const GROQ_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'calculate_provisional_quote',
      description: 'Tính toán chi tiết báo giá tạm tính bao gồm đơn giá sỉ theo kg, chiết khấu khối lượng và phí vận chuyển công trình.',
      parameters: {
        type: 'object',
        properties: {
          productName: { type: 'string', description: 'Tên hoặc loại sản phẩm (vd: nilon 4zem, màng pe 10zem)' },
          quantityKg: { type: 'number', description: 'Khối lượng tính bằng kg (vd: 500, 1000)' },
          destinationRegion: { type: 'string', description: 'Khu vực giao hàng (vd: TPHCM, Bình Dương, Long An, Hà Nội)' }
        },
        required: ['productName', 'quantityKg']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_quote_pdf_and_lead',
      description: 'Thu thập thông tin khách hàng B2B (Họ tên, SĐT, Địa chỉ công trình) để xuất File Báo giá PDF tạm tính và gửi thông báo Telegram cho nhân viên kinh doanh.',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: 'string', description: 'Họ và tên người nhận báo giá' },
          phone: { type: 'string', description: 'Số điện thoại liên hệ' },
          address: { type: 'string', description: 'Địa chỉ công trình hoặc địa điểm nhận hàng' },
          productName: { type: 'string', description: 'Tên sản phẩm báo giá' },
          thicknessZem: { type: 'string', description: 'Độ dày Zem (vd: 4 zem, 6 zem, 10 zem)' },
          quantityKg: { type: 'number', description: 'Số kg vật tư' },
          destinationRegion: { type: 'string', description: 'Tỉnh/Thành công trình' },
          notes: { type: 'string', description: 'Ghi chú thêm từ khách hàng' }
        },
        required: ['customerName', 'phone', 'address', 'productName', 'quantityKg']
      }
    }
  }
];

const ZALO_CONTACT_URL = 'https://zalo.me/nilonxaydung';

// Off-topic keywords that are clearly unrelated to construction PE film / plastics
const OFF_TOPIC_KEYWORDS = [
  // Tech & programming
  'code', 'lập trình', 'javascript', 'python', 'react', 'ai tổng quát', 'chatgpt', 'gemini',
  // Food & cooking
  'nấu ăn', 'công thức', 'món ăn', 'nhà hàng', 'ẩm thực',
  // Entertainment
  'phim', 'âm nhạc', 'game', 'bóng đá', 'thể thao', 'giải trí',
  // Medical
  'bệnh viện', 'thuốc', 'y tế', 'sức khỏe', 'bác sĩ',
  // Finance/crypto unrelated to business
  'bitcoin', 'crypto', 'forex', 'chứng khoán', 'coin',
  // Personal
  'tình yêu', 'bạn gái', 'hôn nhân', 'gia đình'
];

// On-topic keywords related to construction film / plastics business
const ON_TOPIC_KEYWORDS = [
  'nilon', 'màng', 'pe', 'nhựa', 'zem', 'micron', 'lót sàn', 'bê tông', 'móng',
  'chống thấm', 'iso', 'astm', 'chứng chỉ', 'xé rách', 'bền kéo', 'nguyên sinh',
  'tái sinh', 'lldpe', 'ldpe', 'kg', 'tấn', 'giá', 'báo giá', 'pdf', 'giao hàng',
  'công trình', 'nhà xưởng', 'vật tư', 'pallet', 'nông nghiệp', 'nhà kính',
  'khổ', 'cuộn', 'sản phẩm', 'mua', 'đặt hàng', 'liên hệ', 'tư vấn', 'hỗ trợ'
];

const OFF_TOPIC_REPLY = `Dạ xin lỗi Anh/Chị, em chỉ có thể hỗ trợ các vấn đề liên quan đến **vật tư nilon xây dựng, màng PE và báo giá công trình** của Công ty Nilon Xây Dựng ạ.

Với câu hỏi này, Anh/Chị vui lòng liên hệ trực tiếp với chúng em qua:
👉 **Zalo OA**: [Nilon Xây Dựng](${ZALO_CONTACT_URL})
📞 **Hotline**: 0931982568

Em có thể giúp gì khác cho Anh/Chị về sản phẩm nilon hoặc báo giá vật tư không ạ? 😊`;

function detectOffTopic(message: string): boolean {
  const lower = message.toLowerCase().trim();
  // If it clearly matches on-topic keywords, allow it
  const isOnTopic = ON_TOPIC_KEYWORDS.some(kw => lower.includes(kw));
  if (isOnTopic) return false;
  // If it matches off-topic keywords, reject it
  return OFF_TOPIC_KEYWORDS.some(kw => lower.includes(kw));
}

const SYSTEM_PROMPT = `
Bạn là "AI Sales Assistant" - Chuyên gia tư vấn kỹ thuật & báo giá tự động 24/7 của CÔNG TY TNHH SX & TM NILON XÂY DỰNG.
Phong cách giao tiếp: Chuyên nghiệp, am hiểu sâu sắc về kỹ thuật vật tư công trình, lịch sự, tư vấn nhanh gọn và chủ động đề xuất xuất File Báo Giá PDF Tạm Tính.

PHẠM VI TRẢ LỜI (BẮT BUỘC TUÂN THỦ):
- CHỈ trả lời các câu hỏi liên quan đến: sản phẩm nilon/màng PE xây dựng, thông số kỹ thuật (Zem, ASTM, ISO), báo giá sỉ theo kg, phí giao hàng công trình, chứng chỉ chất lượng và các dịch vụ của Công ty Nilon Xây Dựng.
- TUYỆT ĐỐI KHÔNG trả lời các câu hỏi ngoài lĩnh vực kinh doanh: tin tức, giải trí, lập trình, y tế, tài chính cá nhân, hoặc bất kỳ chủ đề không liên quan.
- Khi gặp câu hỏi ngoài phạm vi: lịch sự từ chối và hướng dẫn khách liên hệ Zalo OA: ${ZALO_CONTACT_URL} hoặc Hotline: 0901.234.567.

THÔNG TIN RAG CHUYÊN SÂU NỀN TẢNG:
1. Doanh nghiệp: Nilon Xây Dựng (Hotline: 0901.234.567), Nhà máy KCN Tân Bình & KCN Sóng Thần.
2. Tiêu chuẩn chất lượng: Đạt chứng chỉ ISO 9001:2015, ISO 14001:2015 và TCVN 6407:1998.
3. Thông số Kỹ thuật Chuyên môn:
   - 1 Zem = 0.01mm = 10 Micron (vd: 4zem = 0.04mm, 10zem = 0.1mm).
   - Độ xé rách ASTM D1922: Màng PE đạt từ 220 g/mil (tái sinh 4zem) đến 450 g/mil (nguyên sinh 10zem), giúp màng dẻo dai, chống bọc bong bóng khí, chống đâm thủng khi kéo thép hoặc di chuyển trên công trường.
   - Tỷ lệ Hạt nhựa: 100% nhựa LLDPE/LDPE Nguyên sinh (trong suốt, dẻo siêu dai, kháng UV) vs Nhựa Tái sinh Grade A chọn lọc (màu đen/xám, tiết kiệm 30% chi phí lót móng bê tông 1 lần).
4. Bảng giá sỉ (VND/kg):
   - Nilon 4zem đen/xám: Giá lẻ ~34.000đ/kg.
   - Nilon 6zem đen: Giá lẻ ~33.000đ/kg.
   - Màng PE 10zem nguyên sinh trong suốt: Giá lẻ ~42.000đ/kg.
   - Màng phủ nông nghiệp 7zem: ~39.000đ/kg.
   - Màng PE quấn pallet 2zem: ~44.000đ/kg.
   - CHIẾT KHẤU SỈ: 500-1500kg (giảm 5%), 1500-5000kg (giảm 8%), >5000kg (giảm 12% + Miễn phí vận chuyển nội thành).
5. Phí giao hàng công trình: Nội thành TPHCM/Bình Dương 200k-350k (Miễn phí > 1 tấn); các tỉnh chành xe 500đ-1.200đ/kg.

NHIỆM VỤ CỦA BẠN:
1. Trả lời ngay thắc mắc kỹ thuật (độ xé rách, chứng chỉ ISO, nhựa nguyên sinh vs tái sinh, độ zem phù hợp với quy mô công trình).
2. Khi khách hàng hỏi giá hoặc số lượng kg, tự động gọi hàm \`calculate_provisional_quote\` để báo con số chính xác.
3. Khi khách hàng đồng ý nhận Báo giá / Muốn xem mẫu PDF / Cung cấp Tên + SĐT + Địa chỉ, ngay lập tức gọi hàm \`generate_quote_pdf_and_lead\`.
4. Nếu khách hỏi chưa đầy đủ SĐT hoặc Địa chỉ, nhẹ nhàng hỏi khéo: "Dạ anh/chị cho em xin Tên, SĐT và Địa chỉ công trình để em xuất File Báo giá PDF tạm tính chính xác nhất nhé ạ!".
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Danh sách tin nhắn không hợp lệ' }, { status: 400 });
    }

    const userLastMessage = messages[messages.length - 1]?.content || '';

    // Validate: reject off-topic questions before calling AI
    if (detectOffTopic(userLastMessage)) {
      return NextResponse.json({ role: 'assistant', content: OFF_TOPIC_REPLY });
    }

    // If Groq API key is not configured, run robust deterministic smart bot fallback
    if (!groq) {
      return handleFallbackBot(userLastMessage);
    }

    // Call Groq API with Llama-3.3-70b
    const groqResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      tools: GROQ_TOOLS,
      tool_choice: 'auto',
      temperature: 0.5,
      max_completion_tokens: 1024
    });

    const choice = groqResponse.choices[0];
    const assistantMessage = choice?.message;

    // Check if Groq called a tool / function
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');

      if (functionName === 'calculate_provisional_quote') {
        const quoteCalc = calculateQuoteDetails(
          args.productName || 'nilon 4zem',
          args.quantityKg || 500,
          args.destinationRegion || 'Nội thành TP.HCM / Bình Dương / Đồng Nai'
        );

        const explanation = `
Dạ em xin gửi anh/chị Bảng tính Báo giá Tạm tính cho **${quoteCalc.product.name}**:
- **Khối lượng**: ${quoteCalc.quantityKg.toLocaleString('vi-VN')} kg (Dự kiến trải ~${quoteCalc.estimatedAreaSqM.toLocaleString('vi-VN')} m² sàn)
- **Đơn giá gốc**: ${quoteCalc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} đ/kg
- **Chiết khấu khối lượng (${quoteCalc.discountPercentage}%)**: Đơn giá sỉ chỉ còn **${quoteCalc.unitPriceAfterDiscount.toLocaleString('vi-VN')} đ/kg**
- **Tiền vật tư**: ${quoteCalc.subtotal.toLocaleString('vi-VN')} VNĐ
- **Phí vận chuyển công trình**: ${quoteCalc.shippingNote}
👉 **TỔNG TẠM TÍNH**: **${quoteCalc.grandTotal.toLocaleString('vi-VN')} VNĐ**

Anh/Chị cho em xin **Tên, Số điện thoại và Địa chỉ công trình** để em xuất **File Báo giá PDF tạm tính** chính xác gửi mình ngay nhé!`;

        return NextResponse.json({
          role: 'assistant',
          content: explanation,
          quoteData: quoteCalc
        });
      }

      if (functionName === 'generate_quote_pdf_and_lead') {
        const quoteCalc = calculateQuoteDetails(
          args.productName || 'nilon 4zem',
          args.quantityKg || 500,
          args.destinationRegion || args.address || 'Hưng Yên'
        );

        const quoteCode = `BG-${Date.now().toString().slice(-6)}`;
        const pdfDataInput: QuotePDFData = {
          quoteCode,
          customerName: args.customerName,
          phone: args.phone,
          address: args.address,
          productName: quoteCalc.product.name,
          thicknessZem: args.thicknessZem || quoteCalc.product.thicknessZem,
          quantityKg: args.quantityKg,
          unitPrice: quoteCalc.unitPriceAfterDiscount,
          subtotal: quoteCalc.subtotal,
          discountPercentage: quoteCalc.discountPercentage,
          shippingFee: quoteCalc.shippingFee,
          grandTotal: quoteCalc.grandTotal,
          estimatedAreaSqM: quoteCalc.estimatedAreaSqM,
          notes: args.notes || 'Báo giá tự động AI Sales Assistant'
        };

        // Generate PDF
        const pdfResult = generateQuotePDF(pdfDataInput);

        // Save to Database (Prisma)
        try {
          await prisma.quoteInquiry.create({
            data: {
              quoteCode,
              customerName: args.customerName,
              phone: args.phone,
              address: args.address,
              productName: quoteCalc.product.name,
              thicknessZem: args.thicknessZem || quoteCalc.product.thicknessZem,
              quantityKg: args.quantityKg,
              unitPrice: quoteCalc.unitPriceAfterDiscount,
              subtotal: quoteCalc.subtotal,
              shippingFee: quoteCalc.shippingFee,
              totalAmount: quoteCalc.grandTotal,
              aiNotes: args.notes || 'Báo giá tự động từ Chatbot AI Sales Assistant'
            }
          });
        } catch (dbErr) {
          console.warn('[AI Chat DB] Could not persist quote inquiry:', dbErr);
        }

        // Send Telegram Notification to Sales Team
        const telegramText = `
🤖 <b>LEAD BÁO GIÁ AI CHATBOT MỚI</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${escapeHTML(args.customerName)}
📞 <b>SĐT:</b> ${escapeHTML(args.phone)}
🏗️ <b>Công trình:</b> ${escapeHTML(args.address)}
📦 <b>Sản phẩm:</b> ${escapeHTML(quoteCalc.product.name)}
⚖️ <b>Khối lượng:</b> ${args.quantityKg} kg
💰 <b>Tổng tạm tính:</b> ${quoteCalc.grandTotal.toLocaleString('vi-VN')} VNĐ
📄 <b>Mã Báo Giá:</b> ${quoteCode}
⏰ <i>Cần nhân viên Sales liên hệ xác nhận đơn hàng!</i>`;

        sendTelegramMessage(telegramText).catch(e => console.error('[Telegram] Error:', e));

        return NextResponse.json({
          role: 'assistant',
          content: `Dạ em đã lập thành công **File Báo giá PDF Tạm tính** mã **${quoteCode}** cho anh/chị **${args.customerName}**! Nhân viên kinh doanh Nilon Xây Dựng cũng đã nhận được thông tin để hỗ trợ giao hàng tận công trình cho mình ạ.`,
          pdfData: pdfResult,
          quoteSummary: pdfDataInput
        });
      }
    }

    // Normal Text Response from Groq
    return NextResponse.json({
      role: 'assistant',
      content: assistantMessage?.content || 'Dạ em chào anh/chị! Em có thể giúp tư vấn thông số kỹ thuật nilon móng bê tông hay tính báo giá sỉ giao tận công trình cho mình ạ?'
    });

  } catch (error: unknown) {
    console.error('[Groq AI Chat API Error]:', error);
    // Fallback on error
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return handleFallbackBot(errMessage);
  }
}

/**
 * Fallback AI Sales Assistant Logic when API Key is missing or network fails
 */
function handleFallbackBot(userPrompt: string) {
  const promptLower = userPrompt.toLowerCase();

  // Guard: off-topic check in fallback too
  if (detectOffTopic(userPrompt)) {
    return NextResponse.json({ role: 'assistant', content: OFF_TOPIC_REPLY });
  }

  // Scenario 1: Inquiry about ISO / Technical specs / Tear strength
  if (promptLower.includes('iso') || promptLower.includes('xé rách') || promptLower.includes('chứng chỉ') || promptLower.includes('thông số') || promptLower.includes('nguyên sinh')) {
    return NextResponse.json({
      role: 'assistant',
      content: `Dạ chào anh/chị, các sản phẩm Nilon Xây Dựng đều đạt tiêu chuẩn quốc tế **ISO 9001:2015**, **ISO 14001:2015** và **TCVN 6407:1998**:
- **Độ xé rách (ASTM D1922)**: Đạt từ **220 - 450 g/mil**, đảm bảo không bị rách hay thủng khi công nhân kéo thép 12-16mm hoặc đổ bê tông đá 1x2 tươi.
- **Tỷ lệ nhựa**: Sử dụng 100% nhựa LLDPE Nguyên sinh (cho màng 10zem dẻo dai) và nhựa Tái sinh Grade A chọn lọc (cho nilon 4zem/6zem lót móng tiết kiệm chi phí).

Anh/chị cần tư vấn loại Zem nào cho công trình nhà xưởng hay nhà dân dụng ạ?`
    });
  }

  // Scenario 2: Pricing inquiry / Wholesale calculation
  if (promptLower.includes('giá') || promptLower.includes('báo giá') || promptLower.includes('kg') || promptLower.includes('tấn') || promptLower.includes('bao nhiêu')) {
    const numbers = userPrompt.match(/\d+/g);
    const kg = numbers ? parseInt(numbers[0]) : 500;
    const calc = calculateQuoteDetails('4zem', kg);

    return NextResponse.json({
      role: 'assistant',
      content: `Dạ em xin báo giá sỉ tạm tính cho **${kg} kg Nilon lót sàn 4zem (hoặc 6zem)**:
- **Đơn giá sỉ**: ${calc.unitPriceAfterDiscount.toLocaleString('vi-VN')} đ/kg (đã giảm ${calc.discountPercentage}% chiết khấu khối lượng)
- **Tiền hàng**: ${calc.subtotal.toLocaleString('vi-VN')} VNĐ
- **Phí giao hàng công trình**: ${calc.shippingNote}
👉 **TỔNG TẠM TÍNH**: **${calc.grandTotal.toLocaleString('vi-VN')} VNĐ**

Anh/chị vui lòng cho em xin **Họ tên, SĐT và Địa chỉ công trình** để em xuất **File Báo giá PDF tạm tính** tải về ngay nhé ạ!`,
      quoteData: calc
    });
  }

  // Default welcome / fallback response
  return NextResponse.json({
    role: 'assistant',
    content: `Dạ em là AI Sales Assistant của Nilon Xây Dựng 24/7! 
Em có thể hỗ trợ anh/chị:
1. 📜 Tư vấn thông số kỹ thuật (Độ xé rách ASTM, Chứng chỉ ISO 9001/14001, Hạt nhựa LLDPE nguyên sinh/tái sinh).
2. 📊 Tính giá sỉ theo kg & phí giao hàng tận công trình.
3. 📄 Xuất File Báo giá PDF tạm tính cho công trình của mình.

Anh/chị đang quan tâm đến dòng sản phẩm nilon lót sàn móng hay màng PE chống thấm ạ?`
  });
}
