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

/**
 * Sanitizes response text to guarantee ZERO asterisk (*) characters.
 */
function sanitizeNoAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

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

// Off-topic keywords that are clearly unrelated to construction PE film, màng PE, or safety equipment on site
const OFF_TOPIC_KEYWORDS = [
  // Tech & programming
  'code', 'lập trình', 'javascript', 'python', 'react', 'ai tổng quát', 'chatgpt', 'gemini', 'html', 'css',
  // Food & cooking
  'nấu ăn', 'công thức', 'món ăn', 'nhà hàng', 'ẩm thực', 'quán ăn', 'bánh', 'cơm',
  // Entertainment & Sports
  'phim', 'âm nhạc', 'game', 'bóng đá', 'thể thao', 'giải trí', 'ca sĩ', 'diễn viên',
  // Weather & General Knowledge
  'thời tiết', 'dự báo', 'mưa', 'nắng', 'nhiệt độ', 'địa lý', 'lịch sử',
  // Medical
  'bệnh viện', 'thuốc', 'y tế', 'sức khỏe', 'bác sĩ', 'khám bệnh',
  // Unrelated construction items (not sold on website)
  'xi măng', 'gạch', 'ngói', 'sắt thép', 'thép xiên', 'đá hộc', 'cát xây dựng', 'sơn tường',
  // Finance/crypto/lifestyle
  'bitcoin', 'crypto', 'forex', 'chứng khoán', 'coin', 'tình yêu', 'bạn gái', 'hôn nhân', 'gia đình'
];

// On-topic keywords related to construction film & labor safety equipment business
const ON_TOPIC_KEYWORDS = [
  'nilon', 'màng', 'pe', 'nhựa', 'zem', 'micron', 'lót sàn', 'bê tông', 'móng',
  'chống thấm', 'iso', 'astm', 'chứng chỉ', 'xé rách', 'bền kéo', 'nguyên sinh',
  'tái sinh', 'lldpe', 'ldpe', 'kg', 'tấn', 'giá', 'báo giá', 'pdf', 'giao hàng',
  'công trình', 'nhà xưởng', 'vật tư', 'pallet', 'nông nghiệp', 'nhà kính',
  'khổ', 'cuộn', 'sản phẩm', 'mua', 'đặt hàng', 'liên hệ', 'tư vấn', 'hỗ trợ',
  // Labor safety & protection equipment keywords
  'bảo hộ', 'bảo hộ lao động', 'mũ', 'mũ bảo hộ', 'nón bảo hộ', 'găng', 'găng tay',
  'giày', 'giày bảo hộ', 'ủng', 'ủng bảo hộ', 'quần áo', 'áo phản quang', 'đồng phục',
  'dây đai', 'dây đai an toàn', 'chống rơi', 'bạt', 'bạt che', 'bạc che', 'băng keo',
  'bình chữa cháy', 'kính', 'kính bảo hộ', 'khẩu trang', 'lưới', 'lưới bao che'
];

const OFF_TOPIC_REPLY = `Dạ xin lỗi Anh/Chị, em là AI Sales Assistant của Nilon Xây Dựng nên chỉ có thể hỗ trợ các câu hỏi liên quan đến sản phẩm vật tư nilon xây dựng, màng PE, trang thiết bị bảo hộ lao động và báo giá công trình có trên website ạ.

Anh/Chị vui lòng liên hệ trực tiếp với chúng em qua:
👉 Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL})
📞 Hotline: 0931982568

Em có thể giúp gì cho Anh/Chị về sản phẩm nilon lót sàn bê tông hoặc thiết bị bảo hộ lao động công trình không ạ? 😊`;

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
Phong cách giao tiếp: Chuyên nghiệp, am hiểu sâu sắc về kỹ thuật vật tư công trình & trang thiết bị bảo hộ lao động, lịch sự, tư vấn nhanh gọn.

QUY TẮC BẮT BUỘC (TUÂN THỦ 100%):

1. CẤM SỬ DỤNG DẤU SAO '*':
   - Tuyệt đối KHÔNG SỬ DỤNG bất kỳ ký hiệu dấu sao '*' nào trong toàn bộ câu trả lời.
   - KHÔNG dùng ** để bôi đậm, KHÔNG dùng * để in nghiêng, KHÔNG dùng * để làm gạch đầu dòng.
   - Hãy dùng chữ thường, chữ HOA, emoji hoặc gạch đầu dòng (-) / dải chấm (•) để trình bày.

2. GIỚI HẠN PHẠM VI SẢN PHẨM:
   - Chỉ tư vấn các sản phẩm Nilon lót sàn bê tông, màng PE chống thấm, màng nông nghiệp, màng quấn pallet và trang thiết bị bảo hộ lao động (mũ, giày, găng tay, ủng, bạt che, áo phản quang...) có trong danh mục của Nilon Xây Dựng.
   - Nếu khách hàng hỏi câu hỏi KHÔNG LIÊN QUAN đến sản phẩm hoặc hỏi về thời tiết, lập trình, đá bóng, nấu ăn, các vật liệu khác (xi măng, gạch, sắt thép...), hãy LỊCH SỰ TỪ CHỐI và hướng dẫn khách quay lại các sản phẩm có trên website hoặc Zalo OA: ${ZALO_CONTACT_URL}.

3. QUY TẮC BÁO GIÁ SẢN PHẨM:
   - Khi hỏi Nilon lót sàn / Màng PE: Trả lời chi tiết tên sản phẩm, độ dày Zem/mm, chất liệu nhựa (nguyên sinh/tái sinh), tiêu chuẩn xé rách ASTM D1922, quy cách khổ & chiều dài cuộn (~50kg), ứng dụng thực tế và ĐƠN GIÁ (đơn giá/1 kg và đơn giá/1 cuộn).
   - Khi hỏi Trang thiết bị Bảo hộ lao động (Mũ, Giày, Găng tay, Ủng, Áo phản quang, Bạt che...): BẠN CHỈ ĐƯỢC HIỂN THỊ TÊN SẢN PHẨM VÀ GIÁ CỦA 1 SẢN PHẨM ĐÓ (Ví dụ: "Mũ bảo hộ công trình: 45.000đ/cái", "Giày bảo hộ CE S3: 350.000đ/đôi"). TUYỆT ĐỐI KHÔNG tự động nhân số lượng lớn để tính tổng tiền.

THÔNG TIN RAG CHUYÊN SÂU NỀN TẢNG:
1. Doanh nghiệp: Nilon Xây Dựng (Hotline: 0901.234.567), Nhà máy KCN Tân Bình & KCN Sóng Thần.
2. Tiêu chuẩn chất lượng: ISO 9001:2015, ISO 14001:2015, TCVN 6407:1998, CE S3 (Giày bảo hộ).
3. Đơn giá niêm yết các Sản phẩm chính trên website:
   - Nilon lót sàn 2zem: ~8.500đ/kg hoặc 850.000đ/cuộn (PE tái sinh, lót bê tông móng)
   - Nilon lót sàn 4zem: ~34.000đ/kg hoặc 1.150.000đ/cuộn (PE tái sinh Grade A, ASTM D1922)
   - Nilon lót sàn 6zem: ~33.000đ/kg hoặc 1.650.000đ/cuộn (Hỗn hợp nguyên sinh, chống xé rách 310 g/mil)
   - Màng PE nguyên sinh 10zem: ~42.000đ/kg (100% LLDPE Nguyên sinh trong suốt, 450 g/mil)
   - Mũ bảo hộ công trình: 45.000đ/cái
   - Nón bảo hộ cách điện: 120.000đ/cái
   - Mũ chống va đập: 35.000đ/cái
   - Kính gắn mũ bảo hộ: 25.000đ/cái
   - Găng tay sợi: 5.000đ/đôi
   - Găng tay phủ cao su: 15.000đ/đôi
   - Găng tay chống cắt: 85.000đ/đôi
   - Găng tay hàn: 75.000đ/đôi
   - Găng tay cách điện: 250.000đ/đôi
   - Giày bảo hộ lao động CE S3: 350.000đ/đôi
   - Ủng bảo hộ: 85.000đ/đôi
   - Giày chống tĩnh điện: 450.000đ/đôi
   - Giày chống đinh: 550.000đ/đôi
   - Đồng phục công nhân: 180.000đ/bộ
   - Quần áo / Áo phản quang kỹ sư: 45.000đ/cái
   - Dây đai an toàn: 250.000đ/bộ
   - Bạt che công trình: 15.000đ/m²
   - Băng keo dán nền: 25.000đ/cuộn
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
      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(OFF_TOPIC_REPLY)
      });
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
      temperature: 0.3,
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
          1
        );

        if (quoteCalc.notFound || !quoteCalc.product) {
          return NextResponse.json({
            role: 'assistant',
            content: sanitizeNoAsterisks(`Dạ sản phẩm ${args.productName} hiện chưa có sẵn trong danh mục sản phẩm của website. Anh/Chị vui lòng liên hệ ngay qua Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để nhân viên kiểm tra kho và hỗ trợ báo giá trực tiếp cho mình nhé ạ!`)
          });
        }

        const unitStr = quoteCalc.unitLabel || 'cái';
        const isNilon = !quoteCalc.isSafetyEquipment;

        const explanation = isNilon
          ? `Dạ em xin gửi anh/chị Thông tin chi tiết Kỹ thuật & Báo giá sản phẩm ${quoteCalc.product.name}:

📋 THÔNG SỐ KỸ THUẬT & QUY CÁCH:
- Độ dày Zem: ${quoteCalc.product.thicknessZem} (${quoteCalc.product.thicknessMm})
- Loại nhựa: ${quoteCalc.product.resinType}
- Độ xé rách ASTM: ${quoteCalc.product.tearStrength}
- Quy cách khổ: ${quoteCalc.product.rollWidth} - ${quoteCalc.product.rollLength}
- Chứng chỉ chất lượng: ${quoteCalc.product.isoCertificates.join(', ')}
- Ứng dụng thi công: ${quoteCalc.product.bestFor}

💰 ĐƠN GIÁ NIÊM YẾT:
- Đơn giá tính theo 1 kg: ${quoteCalc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / kg
- Đơn giá 1 Cuộn (~50kg): ${(quoteCalc.unitPriceBeforeDiscount * 50).toLocaleString('vi-VN')} VNĐ / cuộn (Dự kiến trải ~${quoteCalc.estimatedAreaSqM || 330} m² sàn)

Anh/Chị cần tư vấn thêm độ zem hay muốn xuất File Báo giá PDF cho công trình không ạ?`
          : `Dạ em xin thông báo đơn giá của ${quoteCalc.product.name}:
- Sản phẩm: ${quoteCalc.product.name}
- Giá 1 sản phẩm: ${quoteCalc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / ${unitStr} (Đã bao gồm VAT)

Anh/Chị cần tư vấn thêm thông số kỹ thuật hay muốn xuất File Báo giá PDF theo số lượng công trình không ạ?`;

        return NextResponse.json({
          role: 'assistant',
          content: sanitizeNoAsterisks(explanation),
          quoteData: quoteCalc
        });
      }

      if (functionName === 'generate_quote_pdf_and_lead') {
        const quoteCalc = calculateQuoteDetails(
          args.productName || 'nilon 4zem',
          args.quantityKg || 500
        );

        if (quoteCalc.notFound || !quoteCalc.product) {
          return NextResponse.json({
            role: 'assistant',
            content: sanitizeNoAsterisks(`Dạ sản phẩm ${args.productName} hiện chưa có sẵn trong danh mục sản phẩm của website. Anh/Chị vui lòng liên hệ trực tiếp qua Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để nhân viên kiểm tra kho và hỗ trợ báo giá chi tiết cho mình nhé ạ!`)
          });
        }

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
⚖️ <b>Khối lượng:</b> ${args.quantityKg} ${quoteCalc.unitLabel || 'kg'}
💰 <b>Tổng tạm tính:</b> ${quoteCalc.grandTotal.toLocaleString('vi-VN')} VNĐ
📄 <b>Mã Báo Giá:</b> ${quoteCode}
⏰ <i>Cần nhân viên Sales liên hệ xác nhận đơn hàng!</i>`;

        await sendTelegramMessage(telegramText);

        return NextResponse.json({
          role: 'assistant',
          content: sanitizeNoAsterisks(`Dạ em đã lập thành công File Báo giá PDF Tạm tính mã ${quoteCode} cho anh/chị ${args.customerName}! Nhân viên kinh doanh Nilon Xây Dựng cũng đã nhận được thông tin để hỗ trợ giao hàng tận công trình cho mình ạ.`),
          pdfData: pdfResult,
          quoteSummary: pdfDataInput
        });
      }
    }

    // Normal Text Response from Groq (Ensure NO asterisks)
    const rawContent = assistantMessage?.content || 'Dạ em chào anh/chị! Em có thể giúp tư vấn thông số kỹ thuật nilon móng bê tông hay tính báo giá sỉ giao tận công trình cho mình ạ?';
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(rawContent)
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
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(OFF_TOPIC_REPLY)
    });
  }

  // Scenario 1: Inquiry about labor safety equipment / protection gear
  if (promptLower.includes('bảo hộ') || promptLower.includes('mũ') || promptLower.includes('găng') || promptLower.includes('giày') || promptLower.includes('ủng') || promptLower.includes('quần áo') || promptLower.includes('phản quang') || promptLower.includes('bạt') || promptLower.includes('dây đai')) {
    const calc = calculateQuoteDetails(userPrompt, 1);
    if (calc.notFound || !calc.product) {
      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(`Dạ sản phẩm ${userPrompt} hiện chưa có sẵn trong danh mục sản phẩm của website. Anh/Chị vui lòng liên hệ trực tiếp qua Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để nhân viên kiểm tra kho và báo giá chi tiết cho mình nhé ạ!`)
      });
    }

    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(`Dạ em xin thông báo đơn giá của ${calc.product.name}:
- Sản phẩm: ${calc.product.name}
- Giá 1 sản phẩm: ${calc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / ${calc.unitLabel || 'cái'} (Đã bao gồm VAT)

Anh/Chị cần tư vấn thêm thông số kỹ thuật hay muốn xuất File Báo giá PDF theo số lượng công trình không ạ?`),
      quoteData: calc
    });
  }

  // Scenario 2: Inquiry about ISO / Technical specs / Tear strength
  if (promptLower.includes('iso') || promptLower.includes('xé rách') || promptLower.includes('chứng chỉ') || promptLower.includes('thông số') || promptLower.includes('nguyên sinh')) {
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(`Dạ chào anh/chị, các sản phẩm Nilon Xây Dựng & Trang thiết bị Bảo hộ lao động đều đạt tiêu chuẩn quốc tế ISO 9001:2015, ISO 14001:2015, TCVN 6407:1998 và CE S3:
- Độ xé rách (ASTM D1922): Đạt từ 220 - 450 g/mil, đảm bảo không bị rách hay thủng khi công nhân kéo thép 12-16mm hoặc đổ bê tông đá 1x2 tươi.
- Tỷ lệ nhựa: Sử dụng 100% nhựa LLDPE Nguyên sinh (cho màng 10zem dẻo dai) và nhựa Tái sinh Grade A chọn lọc (cho nilon 4zem/6zem lót móng tiết kiệm chi phí).
- An toàn công nhân: Giày bảo hộ mũi lót thép, mũ bảo hộ HDPE chịu lực va đập cao.

Anh/chị cần tư vấn loại Zem nilon hay thiết bị bảo hộ nào cho công trình ạ?`)
    });
  }

  // Scenario 3: Pricing inquiry / Wholesale calculation
  if (promptLower.includes('giá') || promptLower.includes('báo giá') || promptLower.includes('kg') || promptLower.includes('tấn') || promptLower.includes('bao nhiêu')) {
    const numbers = userPrompt.match(/\d+/g);
    const qty = numbers ? parseInt(numbers[0]) : 10;
    const calc = calculateQuoteDetails(userPrompt, qty);

    if (calc.notFound || !calc.product) {
      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(`Dạ sản phẩm anh/chị đang hỏi hiện chưa có sẵn trong danh mục sản phẩm của website. Anh/Chị vui lòng liên hệ trực tiếp qua Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để nhân viên kiểm tra kho và hỗ trợ báo giá chi tiết cho mình nhé ạ!`)
      });
    }

    const unitStr = calc.unitLabel || 'cái';

    const contentText = `Dạ em xin thông báo đơn giá của ${calc.product.name}:
- Sản phẩm: ${calc.product.name}
- Đơn giá: ${calc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / ${unitStr} (Đã bao gồm VAT)

Anh/Chị cần tư vấn thêm thông số kỹ thuật hay muốn xuất File Báo giá PDF theo số lượng công trình không ạ?`;

    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(contentText),
      quoteData: calc
    });
  }

  // Default welcome / fallback response
  return NextResponse.json({
    role: 'assistant',
    content: sanitizeNoAsterisks(`Dạ em là AI Sales Assistant của Nilon Xây Dựng 24/7! 
Em có thể hỗ trợ anh/chị:
1. 📜 Tư vấn Nilon lót sàn bê tông (Độ xé rách ASTM, Chứng chỉ ISO 9001/14001, 2zem - 10zem).
2. ⛑️ Tư vấn Trang thiết bị Bảo hộ lao động (Mũ bảo hộ, Găng tay chống cắt, Giày mũi lót thép, Áo phản quang, Bạt che).
3. 📊 Tính giá sỉ theo kg/bộ & phí giao hàng tận công trình.
4. 📄 Xuất File Báo giá PDF tạm tính cho công trình của mình.

Anh/chị đang quan tâm đến sản phẩm Nilon lót móng hay Thiết bị Bảo hộ lao động ạ?`)
  });
}
