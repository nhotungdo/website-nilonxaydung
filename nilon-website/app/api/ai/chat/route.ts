import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { calculateQuoteDetails, searchProductsDB, getProductDetailDB } from '@/data/ai-knowledge-base';
import { generateQuotePDF, QuotePDFData } from '@/lib/pdf-quote-generator';
import { sendTelegramMessage, escapeHTML } from '@/lib/telegram';
import { prisma } from '@/lib/prisma';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Record<string, unknown>[];
}



function sanitizeNoAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

const GROQ_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'search_products',
      description: 'Tìm kiếm sản phẩm trong cơ sở dữ liệu theo từ khóa hoặc nhu cầu sử dụng. Trả về danh sách thu gọn các sản phẩm phù hợp.',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Từ khóa tên sản phẩm (vd: màng pe, nilon, giày)' },
          useCase: { type: 'string', description: 'Mục đích sử dụng (vd: quấn pallet, lót sàn, bảo hộ)' }
        }
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_product_detail',
      description: 'Lấy chi tiết giá, quy cách và thông tin kỹ thuật của một mã sản phẩm cụ thể (cần dùng sau khi đã tìm kiếm).',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'ID của sản phẩm (vd: mang-pe-2zem)' }
        },
        required: ['productId']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate_provisional_quote',
      description: 'Tính toán chi tiết báo giá tạm tính (có chiết khấu khối lượng) cho một mã sản phẩm cụ thể.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'ID của sản phẩm' },
          quantityKg: { type: 'number', description: 'Số lượng / Khối lượng tính bằng kg hoặc cái' }
        },
        required: ['productId', 'quantityKg']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_sales_lead_and_pdf',
      description: 'Thu thập thông tin khách hàng B2B để xuất File Báo giá PDF và gửi Lead cho Sales. CHỈ GỌI KHI KHÁCH ĐÃ ĐỒNG Ý BÁO GIÁ TẠM TÍNH.',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          productId: { type: 'string' },
          quantityKg: { type: 'number' },
          notes: { type: 'string' }
        },
        required: ['customerName', 'phone', 'address', 'productId', 'quantityKg']
      }
    }
  }
];

const ZALO_CONTACT_URL = 'https://zalo.me/nilonxaydung';

function buildSystemPrompt(): string {
  return `
Bạn là "AI Sales Assistant" - Chuyên gia tư vấn kỹ thuật & báo giá tự động 24/7 của CÔNG TY TNHH SX & TM NILON XÂY DỰNG.
Phong cách giao tiếp: Thân thiện, lịch sự, chuyên nghiệp, tự nhiên và KHÔNG ÉP BUỘC khách mua hàng.
TRẢ LỜI NGẮN GỌN, TRỌNG TÂM.

QUY TẮC QUAN TRỌNG NHẤT:
1. KHÔNG SỬ DỤNG DẤU SAO '*': Tuyệt đối không dùng * để bôi đậm hay in nghiêng. Hãy dùng chữ HOA hoặc gạch đầu dòng (-).
2. KHÔNG TỰ BỊA GIÁ, TỒN KHO: Nếu khách hỏi giá, BẮT BUỘC dùng tool get_product_detail hoặc calculate_provisional_quote. Nếu khách tìm sản phẩm, dùng tool search_products.
3. QUY TRÌNH BÁO GIÁ: 
   - Tư vấn -> Chốt số lượng -> Tính giá tạm bằng Tool -> Cho khách xem giá -> Nếu khách đồng ý, xin Tên, SĐT, Địa chỉ -> Tạo PDF bằng Tool.
   - KHÔNG tự động tạo PDF nếu khách chưa cho thông tin hoặc chưa chốt số lượng.
4. TỪ CHỐI KHÉO LÉO: Nếu khách hỏi chuyện ngoài lề (code, nấu ăn, bóng đá, crypto...), hãy từ chối khéo léo và gợi ý các sản phẩm nilon lót sàn, màng PE, đồ bảo hộ lao động.

DANH MỤC KINH DOANH CHÍNH:
- Nilon lót sàn móng, lót đường, chống thấm
- Màng PE quấn hàng, quấn pallet, nhà kính
- Bạt che công trình, băng keo
- Thiết bị bảo hộ lao động: Giày, mũ, găng tay, áo phản quang

CHÍNH SÁCH CHUNG:
- Vận chuyển: Hỏa tốc TPHCM/Bình Dương 2h-4h. Gửi chành xe đi tỉnh. Vận chuyển xe Container/Tàu hỏa đi Bắc (2-4 ngày).
- Thanh toán: Đặt cọc 30%, thanh toán 70% khi nhận. Hỗ trợ VAT 10%.
- Đổi trả: 1 đổi 1 trong 7 ngày nếu lỗi sản xuất/vận chuyển.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Danh sách tin nhắn không hợp lệ' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

    if (!groq) {
      console.error('[Groq AI] GROQ_API_KEY is not set or loaded.');
      return NextResponse.json({
        role: 'assistant',
        content: 'Lỗi hệ thống: Chưa cấu hình khóa API Groq hoặc chưa tải được biến môi trường. Vui lòng kiểm tra lại file .env và restart server.'
      });
    }

    const systemPrompt = buildSystemPrompt();
    
    // Inject system prompt if not present, otherwise it's just handled implicitly by Groq
    const apiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const groqResponse = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'qwen/qwen3.6-27b',
      messages: apiMessages,
      tools: GROQ_TOOLS,
      tool_choice: 'auto',
      temperature: 0.3,
      max_completion_tokens: 1024
    });

    const choice = groqResponse.choices[0];
    const assistantMessage = choice?.message;

    // IF AI CALLED A TOOL
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');

      let toolResult: any = {};
      let pdfData = null;
      let quoteSummary = null;
      let quoteDataForUI = null;

      if (functionName === 'search_products') {
        toolResult = await searchProductsDB(args.keyword, args.useCase);
      } else if (functionName === 'get_product_detail') {
        toolResult = await getProductDetailDB(args.productId);
      } else if (functionName === 'calculate_provisional_quote') {
        toolResult = await calculateQuoteDetails(args.productId, args.quantityKg);
        quoteDataForUI = toolResult; // Send back to UI for rich rendering
      } else if (functionName === 'create_sales_lead_and_pdf') {
        const quoteCalc = await calculateQuoteDetails(args.productId, args.quantityKg);
        if (!quoteCalc.notFound && quoteCalc.product) {
          const quoteCode = `BG-${Date.now().toString().slice(-6)}`;
          const pdfDataInput: QuotePDFData = {
            quoteCode,
            customerName: args.customerName,
            phone: args.phone,
            address: args.address,
            productName: quoteCalc.product.name,
            thicknessZem: quoteCalc.product.thicknessZem,
            quantityKg: args.quantityKg,
            unitPrice: quoteCalc.unitPriceAfterDiscount,
            subtotal: quoteCalc.subtotal,
            discountPercentage: quoteCalc.discountPercentage,
            shippingFee: quoteCalc.shippingFee,
            grandTotal: quoteCalc.grandTotal,
            estimatedAreaSqM: quoteCalc.estimatedAreaSqM,
            notes: args.notes || 'Báo giá tự động AI Sales Assistant'
          };
          
          pdfData = generateQuotePDF(pdfDataInput);
          quoteSummary = pdfDataInput;

          try {
            await prisma.quoteInquiry.create({
              data: {
                quoteCode,
                customerName: args.customerName,
                phone: args.phone,
                address: args.address,
                productName: quoteCalc.product.name,
                thicknessZem: quoteCalc.product.thicknessZem,
                quantityKg: args.quantityKg,
                unitPrice: quoteCalc.unitPriceAfterDiscount,
                subtotal: quoteCalc.subtotal,
                shippingFee: quoteCalc.shippingFee,
                totalAmount: quoteCalc.grandTotal,
                aiNotes: args.notes || 'Báo giá AI'
              }
            });
          } catch (dbErr) {
            console.warn('[AI DB Error]', dbErr);
          }

          const telegramText = `
🤖 <b>LEAD BÁO GIÁ AI CHATBOT MỚI</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${escapeHTML(args.customerName)}
📞 <b>SĐT:</b> ${escapeHTML(args.phone)}
🏗️ <b>Công trình:</b> ${escapeHTML(args.address)}
📦 <b>Sản phẩm:</b> ${escapeHTML(quoteCalc.product.name)}
⚖️ <b>Khối lượng:</b> ${args.quantityKg} ${quoteCalc.unitLabel || 'kg'}
💰 <b>Tổng tạm tính:</b> ${quoteCalc.grandTotal.toLocaleString('vi-VN')} VNĐ
📄 <b>Mã Báo Giá:</b> ${quoteCode}`;

          await sendTelegramMessage(telegramText);
          toolResult = { status: 'success', quoteCode, message: 'PDF generated and Lead created.' };
        } else {
          toolResult = { status: 'error', message: 'Product not found' };
        }
      }

      // SECOND LOOP: Feed tool result back to LLM to get a natural language response
      apiMessages.push(assistantMessage);
      apiMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: functionName,
        content: JSON.stringify(toolResult)
      });

      const secondResponse = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'qwen/qwen3.6-27b',
        messages: apiMessages,
        temperature: 0.3,
        max_completion_tokens: 1024
      });

      const finalContent = secondResponse.choices[0]?.message?.content || '';

      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(finalContent),
        ...(pdfData && { pdfData, quoteSummary }),
        ...(quoteDataForUI && { quoteData: quoteDataForUI })
      });
    }

    // IF AI RETURNED DIRECT TEXT
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(assistantMessage?.content || '')
    });

  } catch (error: any) {
    console.error('[Groq AI Chat API Error]:', error);
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(`Lỗi hệ thống: ${error?.message || error}. Vui lòng thử lại.`)
    });
  }
}

function handleFallbackBot() {
  return NextResponse.json({
    role: 'assistant',
    content: sanitizeNoAsterisks(`Dạ em là AI Sales Assistant của Nilon Xây Dựng! Hiện tại hệ thống tư vấn sâu đang bận, anh/chị vui lòng liên hệ Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để được hỗ trợ nhanh nhất nhé ạ!`)
  });
}
