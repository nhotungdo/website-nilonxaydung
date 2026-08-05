import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { calculateQuoteDetails, getFormattedWebsiteCatalog } from '@/data/ai-knowledge-base';
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
  'bình chữa cháy', 'kính', 'kính bảo hộ', 'khẩu trang', 'lưới', 'lưới bao che',
  // Commercial, technical, delivery & policy keywords
  'vat', 'hóa đơn', 'thanh toán', 'công nợ', 'đặt cọc', 'miền bắc', 'hà nội', 'hải phòng',
  'chiết khấu', 'đổi trả', 'bảo hành', 'thi công', 'overlap', 'giáp mí', 'chành xe', 'container'
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

function buildSystemPrompt(): string {
  const websiteCatalog = getFormattedWebsiteCatalog();

  return `
Bạn là "AI Sales Assistant" - Chuyên gia tư vấn kỹ thuật & báo giá tự động 24/7 của CÔNG TY TNHH SX & TM NILON XÂY DỰNG.
Phong cách giao tiếp: Chuyên nghiệp, am hiểu sâu sắc về kỹ thuật vật tư công trình & trang thiết bị bảo hộ lao động, lịch sự, tư vấn nhanh gọn.

QUY TẮC BẮT BUỘC (TUÂN THỦ 100%):

1. CẤM SỬ DỤNG DẤU SAO '*':
   - Tuyệt đối KHÔNG SỬ DỤNG bất kỳ ký hiệu dấu sao '*' nào trong toàn bộ câu trả lời.
   - KHÔNG dùng ** để bôi đậm, KHÔNG dùng * để in nghiêng, KHÔNG dùng * me làm gạch đầu dòng.
   - Hãy dùng chữ thường, chữ HOA, emoji hoặc gạch đầu dòng (-) / dải chấm (•) để trình bày.

2. BẮT BUỘC LIỆT KÊ ĐẦY ĐỦ CÁC LOẠI SẢN PHẨM VÀ SẢN PHẨM LIÊN QUAN:
   - Khi khách hàng hỏi về 1 sản phẩm hoặc dòng sản phẩm nào đó (ví dụ: nilon lót sàn, màng PE, mũ bảo hộ, giày bảo hộ, găng tay, bạt che...):
     + PHẢI LIỆT KÊ ĐẦY ĐỦ TẤT CẢ các chủng loại / độ dày Zem / quy cách hiện có của dòng sản phẩm đó trên website cùng với Đơn giá (VNĐ) và Đơn vị tính tương ứng.
     + PHẢI GỢI Ý THÊM từ 2 - 3 SẢN PHẨM LIÊN QUAN / ĐỒNG BỘ THI CÔNG (vd: hỏi Nilon lót sàn -> gợi ý Băng keo dán màng PE, Bạt che công trình, Mũ & Giày bảo hộ; hỏi Bảo hộ -> gợi ý Nilon lót sàn móng).

3. QUY CHUẨN KỸ THUẬT & HƯỚNG DẪN THI CÔNG LÓT BẠT MÀNG PE:
   - Quy chuẩn & Tiêu chuẩn: Đạt tiêu chuẩn ISO 9001:2015, ISO 14001:2015, TCVN 6407:1998, kiểm định xé rách ASTM D1922, độ bền kéo đứt ASTM D882.
   - Quy trình lót bạt chuẩn: Nền đầm chặt + rải 3-5cm cát mịn, trải phẳng nilon, giáp mí (Overlap) 10-20cm và dán niêm phong mối nối bằng băng keo PE chuyên dụng.

4. CHÍNH SÁCH VẬN CHUYỂN, HÓA ĐƠN VAT & B2B:
   - Vận chuyển Miền Bắc & Hà Nội: Container / tàu hỏa 2-4 ngày, hỗ trợ 50-100% cước cho đơn > 5 tấn, freeship cho đơn > 10 tấn.
   - Hóa đơn VAT 10%: Xuất 100% Hóa đơn GTGT hợp lệ cho doanh nghiệp/nhà thầu.
   - Thanh toán B2B & Đổi trả: Cọc 30%, 70% khi nhận hàng & nghiệm thu CO/CQ, công nợ 30-45 ngày cho nhà thầu dài hạn, đổi trả 1-đổi-1 trong 7 ngày.

DANH MỤC TOÀN BỘ SẢN PHẨM & ĐƠN GIÁ ĐANG BÁN TRÊN WEBSITE NILONXAYDUNG.VN:
${websiteCatalog}
`;
}

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

    const systemPrompt = buildSystemPrompt();

    // Call Groq API with Llama-3.3-70b
    const groqResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
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

        const variantsListStr = quoteCalc.allVariants && quoteCalc.allVariants.length > 0
          ? quoteCalc.allVariants.map((v, i) => `${i + 1}. ${v.name}: ${v.price.toLocaleString('vi-VN')} VNĐ / ${v.unit}`).join('\n')
          : `- ${quoteCalc.product.name}: ${quoteCalc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / ${quoteCalc.unitLabel || 'kg'}`;

        const relatedListStr = quoteCalc.relatedProducts && quoteCalc.relatedProducts.length > 0
          ? quoteCalc.relatedProducts.map((r, i) => `• ${r.name}: ${r.price.toLocaleString('vi-VN')} VNĐ / ${r.unit}`).join('\n')
          : '• Băng keo công nghiệp dán màng PE: 12.000 VNĐ / cuộn\n• Bạt che công trình xanh cam: 15.000 VNĐ / m²\n• Mũ bảo hộ công trình HDPE: 45.000 VNĐ / cái';

        const explanation = `Dạ em xin gửi Anh/Chị danh sách ĐẦY ĐỦ các loại sản phẩm ${quoteCalc.product.name} đang bán trên website NilonXayDung.vn:

📦 TẤT CẢ CÁC BIẾN THỂ & QUY CÁCH HIỆN CÓ:
${variantsListStr}

💡 SẢN PHẨM LIÊN QUAN / ĐỒNG BỘ THI CÔNG NÊN MUA CÙNG:
${relatedListStr}

📋 THÔNG SỐ & CHỨNG CHỈ SẢN PHẨM PHÙ HỢP NHẤT (${quoteCalc.product.name}):
- Chứng chỉ chất lượng: ${quoteCalc.product.isoCertificates.join(', ')}
- Độ bền xé rách ASTM: ${quoteCalc.product.tearStrength} | Độ bền kéo: ${quoteCalc.product.tensileStrength}
- Khuyên dùng cho: ${quoteCalc.product.bestFor}

Anh/Chị cần tư vấn thêm khối lượng số lượng kg hay muốn xuất File Báo giá PDF cho công trình không ạ?`;

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

  // Fallback Product Search
  const calc = calculateQuoteDetails(userPrompt, 1);
  if (!calc.notFound && calc.product) {
    const variantsListStr = calc.allVariants && calc.allVariants.length > 0
      ? calc.allVariants.map((v, i) => `${i + 1}. ${v.name}: ${v.price.toLocaleString('vi-VN')} VNĐ / ${v.unit}`).join('\n')
      : `- ${calc.product.name}: ${calc.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / ${calc.unitLabel || 'kg'}`;

    const relatedListStr = calc.relatedProducts && calc.relatedProducts.length > 0
      ? calc.relatedProducts.map((r, i) => `• ${r.name}: ${r.price.toLocaleString('vi-VN')} VNĐ / ${r.unit}`).join('\n')
      : '• Băng keo công nghiệp dán màng PE: 12.000 VNĐ / cuộn\n• Bạt che công trình xanh cam: 15.000 VNĐ / m²\n• Mũ bảo hộ công trình HDPE: 45.000 VNĐ / cái';

    const contentText = `Dạ em xin gửi Anh/Chị danh sách ĐẦY ĐỦ các loại sản phẩm ${calc.product.name} đang bán trên website NilonXayDung.vn:

📦 TẤT CẢ CÁC BIẾN THỂ & QUY CÁCH HIỆN CÓ:
${variantsListStr}

💡 SẢN PHẨM LIÊN QUAN / ĐỒNG BỘ THI CÔNG NÊN MUA CÙNG:
${relatedListStr}

📋 CHỨNG CHỈ & TIÊU CHUẨN:
- Chứng chỉ ISO: ${calc.product.isoCertificates.join(', ')}
- Khuyên dùng: ${calc.product.bestFor}

Anh/Chị cần tư vấn thêm độ zem hay muốn xuất File Báo giá PDF cho công trình không ạ?`;

    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(contentText),
      quoteData: calc
    });
  }

  // Default fallback
  return NextResponse.json({
    role: 'assistant',
    content: sanitizeNoAsterisks(`Dạ em là AI Sales Assistant của Nilon Xây Dựng 24/7!
Em nắm rõ toàn bộ thông tin sản phẩm và giá niêm yết trên website NilonXayDung.vn.
Em có thể hỗ trợ anh/chị:
1. 📜 Tư vấn Nilon lót sàn bê tông (2zem - 10zem, tiêu chuẩn ISO 9001/14001, ASTM D1922).
2. ⛑️ Báo giá Trang thiết bị Bảo hộ lao động (Mũ bảo hộ công trình, Găng tay chống cắt, Giày mũi lót thép, Áo phản quang, Bạt che).
3. 📊 Lựa chọn thông minh sản phẩm tối ưu chi phí cho từng quy mô công trình.
4. 📄 Xuất File Báo giá PDF tạm tính tự động.

Anh/chị cần hỗ trợ thông tin hoặc báo giá sản phẩm nào cho công trình ạ?`)
  });
}
