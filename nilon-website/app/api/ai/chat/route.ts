import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { calculateQuoteDetails, searchProductsDB, getProductDetailDB, AI_KNOWLEDGE_BASE, enforceStrictPhysicsEngine } from '@/data/ai-knowledge-base';
import { generateQuotePDF, QuotePDFData } from '@/lib/pdf-quote-generator';
import { sendTelegramMessage, escapeHTML } from '@/lib/telegram';
import { prisma } from '@/lib/prisma';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

function sanitizeNoAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

const GROQ_TOOLS: any[] = [
  {
    type: 'function',
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
    type: 'function',
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
    type: 'function',
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
    type: 'function',
    function: {
      name: 'estimate_material_requirement',
      description: 'Tính toán vật lý chính xác lượng vật tư nilon/màng PE cần thiết dựa trên diện tích công trình.',
      parameters: {
        type: 'object',
        properties: {
          areaSqM: { type: 'number', description: 'Diện tích thi công (m2)' },
          usageType: { type: 'string', description: 'Mục đích sử dụng (vd: lot-san-be-tong-mang, chong-tham-mong-sau, quan-pallet-boc-hang)' },
          layersCount: { type: 'number', description: 'Số lớp lót dự kiến (thường là 1)' }
        },
        required: ['areaSqM']
      }
    }
  },
  {
    type: 'function',
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

function buildSystemPrompt(currentUrl?: string): string {
  const kbData = JSON.stringify({
    commercialPolicies: AI_KNOWLEDGE_BASE.commercialPolicies,
    shippingFees: AI_KNOWLEDGE_BASE.shippingFees,
    wholesalePricingTiers: AI_KNOWLEDGE_BASE.wholesalePricingTiers,
    technicalGlossary: AI_KNOWLEDGE_BASE.technicalGlossary
  }, null, 2);

  const contextInstruction = currentUrl 
    ? `\nNGỮ CẢNH HIỆN TẠI (CONTEXT): Khách hàng đang xem trang web tại đường dẫn: ${currentUrl}. Hãy dựa vào đó để chủ động tư vấn đúng sản phẩm nếu cần thiết.` 
    : '';

  return `
Bạn là "AI Sales Assistant" - Chuyên gia tư vấn kỹ thuật & báo giá tự động 24/7 của CÔNG TY TNHH SX & TM NILON XÂY DỰNG.
Phong cách giao tiếp: Thân thiện, lịch sự, chuyên nghiệp, tự nhiên và KHÔNG ÉP BUỘC khách mua hàng.
TRẢ LỜI NGẮN GỌN, TRỌNG TÂM.
${contextInstruction}

QUY TẮC QUAN TRỌNG NHẤT:
1. KHÔNG SỬ DỤNG DẤU SAO '*': Tuyệt đối không dùng * để bôi đậm hay in nghiêng. Hãy dùng chữ HOA hoặc gạch đầu dòng (-).
2. KHÔNG TỰ BỊA GIÁ, TỒN KHO: Nếu khách hỏi giá, BẮT BUỘC dùng tool get_product_detail hoặc calculate_provisional_quote. Nếu khách tìm sản phẩm, dùng tool search_products.
3. KHI KHÁCH YÊU CẦU DỰ TOÁN VẬT TƯ: Bắt buộc gọi tool estimate_material_requirement để hệ thống vật lý tính toán độ dày, số cuộn, số kg chính xác thay vì tự tính.
4. QUY TRÌNH BÁO GIÁ: 
   - Tư vấn -> Chốt số lượng -> Tính giá tạm bằng Tool -> Cho khách xem giá -> Nếu khách đồng ý, xin Tên, SĐT, Địa chỉ -> Tạo PDF bằng Tool.
   - KHÔNG tự động tạo PDF nếu khách chưa cho thông tin hoặc chưa chốt số lượng.
5. TỪ CHỐI KHÉO LÉO: Nếu khách hỏi chuyện ngoài lề, hãy từ chối khéo léo.

DỮ LIỆU CÔNG TY (KNOWLEDGE BASE):
Sử dụng các thông tin chính thức sau đây để trả lời các câu hỏi về chính sách vận chuyển, chiết khấu, VAT, kỹ thuật (tuyệt đối không bịa số liệu):
${kbData}
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];
    const currentUrl: string | undefined = body.currentUrl;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Danh sách tin nhắn không hợp lệ' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey || groqApiKey.includes('your_groq_api_key_here')) {
      console.error('[Groq AI] GROQ_API_KEY is not set or loaded.');
      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(`Dạ hệ thống AI đang thiếu cấu hình API Key. Anh/chị (hoặc Admin) vui lòng cập nhật GROQ_API_KEY hợp lệ trong file .env.local để sử dụng tính năng này nhé!`)
      });
    }

    const groq = new Groq({ apiKey: groqApiKey });
    const systemPrompt = buildSystemPrompt(currentUrl);

    // Chuyển đổi định dạng message từ UI sang định dạng Groq content
    const groqMessages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    for (const m of messages) {
      if (m.role === 'system') continue;
      // UI only sends user and assistant text messages
      groqMessages.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || ''
      });
    }

    const modelParams = {
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: groqMessages,
      tools: GROQ_TOOLS,
      tool_choice: 'auto' as const,
      temperature: 0.3
    };

    const completion = await groq.chat.completions.create(modelParams);
    const responseMessage = completion.choices[0]?.message;

    // Xử lý Function Call
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');

      let toolResult: any = {};
      let pdfData = null;
      let quoteSummary = null;
      let quoteDataForUI = null;
      let productsList = null;

      if (functionName === 'search_products') {
        toolResult = await searchProductsDB(args.keyword as string, args.useCase as string);
        productsList = toolResult;
      } else if (functionName === 'get_product_detail') {
        toolResult = await getProductDetailDB(args.productId as string);
      } else if (functionName === 'calculate_provisional_quote') {
        toolResult = await calculateQuoteDetails(args.productId as string, args.quantityKg as number);
        quoteDataForUI = toolResult;
      } else if (functionName === 'estimate_material_requirement') {
        const estimateReq = {
          areaSqM: args.areaSqM,
          usageType: args.usageType || 'lot-san-be-tong-mang',
          layersCount: args.layersCount || 1
        };
        const estimateRes = enforceStrictPhysicsEngine(estimateReq);
        toolResult = estimateRes;
      } else if (functionName === 'create_sales_lead_and_pdf') {
        const quoteCalc = await calculateQuoteDetails(args.productId as string, args.quantityKg as number);
        if (!quoteCalc.notFound && quoteCalc.product) {
          const quoteCode = `BG-${Date.now().toString().slice(-6)}`;
          const pdfDataInput: QuotePDFData = {
            quoteCode,
            customerName: args.customerName as string,
            phone: args.phone as string,
            address: args.address as string,
            productName: quoteCalc.product.name,
            thicknessZem: quoteCalc.product.thicknessZem,
            quantityKg: args.quantityKg as number,
            unitPrice: quoteCalc.unitPriceAfterDiscount,
            subtotal: quoteCalc.subtotal,
            discountPercentage: quoteCalc.discountPercentage,
            shippingFee: quoteCalc.shippingFee,
            grandTotal: quoteCalc.grandTotal,
            estimatedAreaSqM: quoteCalc.estimatedAreaSqM,
            notes: (args.notes as string) || 'Báo giá tự động AI Sales Assistant'
          };

          pdfData = generateQuotePDF(pdfDataInput);
          quoteSummary = pdfDataInput;

          try {
            await prisma.quoteInquiry.create({
              data: {
                quoteCode,
                customerName: args.customerName as string,
                phone: args.phone as string,
                address: args.address as string,
                productName: quoteCalc.product.name,
                thicknessZem: quoteCalc.product.thicknessZem,
                quantityKg: args.quantityKg as number,
                unitPrice: quoteCalc.unitPriceAfterDiscount,
                subtotal: quoteCalc.subtotal,
                shippingFee: quoteCalc.shippingFee,
                totalAmount: quoteCalc.grandTotal,
                aiNotes: (args.notes as string) || 'Báo giá AI'
              }
            });
          } catch (dbErr) {
            console.warn('[AI DB Error]', dbErr);
          }

          const telegramText = `
🤖 <b>LEAD BÁO GIÁ AI CHATBOT MỚI</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${escapeHTML(args.customerName as string)}
📞 <b>SĐT:</b> ${escapeHTML(args.phone as string)}
🏗️ <b>Công trình:</b> ${escapeHTML(args.address as string)}
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

      // Vòng lặp thứ 2: Gửi kết quả tool về cho LLM
      groqMessages.push(responseMessage);
      groqMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: functionName,
        content: JSON.stringify(toolResult)
      });

      const secondResponse = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.3
      });

      let finalContent = secondResponse.choices[0]?.message?.content || '';

      if (!finalContent) {
        if (functionName === 'search_products') finalContent = "Dạ đây là các sản phẩm phù hợp em tìm được ạ.";
        else if (functionName === 'calculate_provisional_quote') finalContent = "Dạ bảng tính dự toán của anh/chị đây ạ.";
        else finalContent = "Dạ em đã xử lý xong yêu cầu của anh/chị ạ.";
      }

      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(finalContent),
        ...(pdfData && { pdfData, quoteSummary }),
        ...(quoteDataForUI && { quoteData: quoteDataForUI }),
        ...(productsList && { productsList })
      });
    }

    // NẾU AI TRẢ VỀ TEXT TRỰC TIẾP
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(responseMessage?.content || '')
    });

  } catch (error: any) {
    console.error('[Groq AI Chat API Error]:', error);
    
    // Bắt lỗi Rate Limit hoặc Quota
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(`Dạ hiện tại hệ thống AI đang quá tải do có nhiều lượt truy cập hoặc đã hết hạn mức (Quota) miễn phí. Anh/chị vui lòng thử lại sau ít phút hoặc liên hệ Hotline/Zalo để được hỗ trợ nhé ạ!`)
      });
    }

    return handleFallbackBot();
  }
}

function handleFallbackBot() {
  return NextResponse.json({
    role: 'assistant',
    content: sanitizeNoAsterisks(`Dạ em là AI Sales Assistant của Nilon Xây Dựng! Hiện tại hệ thống tư vấn sâu đang bận, anh/chị vui lòng liên hệ Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để được hỗ trợ nhanh nhất nhé ạ!`)
  });
}
