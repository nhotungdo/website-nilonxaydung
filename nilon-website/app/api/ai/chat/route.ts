import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Tool } from '@google/genai';
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

const GEMINI_TOOLS: Tool[] = [{
  functionDeclarations: [
    {
      name: 'search_products',
      description: 'Tìm kiếm sản phẩm trong cơ sở dữ liệu theo từ khóa hoặc nhu cầu sử dụng. Trả về danh sách thu gọn các sản phẩm phù hợp.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING, description: 'Từ khóa tên sản phẩm (vd: màng pe, nilon, giày)' },
          useCase: { type: Type.STRING, description: 'Mục đích sử dụng (vd: quấn pallet, lót sàn, bảo hộ)' }
        }
      }
    },
    {
      name: 'get_product_detail',
      description: 'Lấy chi tiết giá, quy cách và thông tin kỹ thuật của một mã sản phẩm cụ thể (cần dùng sau khi đã tìm kiếm).',
      parameters: {
        type: Type.OBJECT,
        properties: {
          productId: { type: Type.STRING, description: 'ID của sản phẩm (vd: mang-pe-2zem)' }
        },
        required: ['productId']
      }
    },
    {
      name: 'calculate_provisional_quote',
      description: 'Tính toán chi tiết báo giá tạm tính (có chiết khấu khối lượng) cho một mã sản phẩm cụ thể.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          productId: { type: Type.STRING, description: 'ID của sản phẩm' },
          quantityKg: { type: Type.NUMBER, description: 'Số lượng / Khối lượng tính bằng kg hoặc cái' }
        },
        required: ['productId', 'quantityKg']
      }
    },
    {
      name: 'create_sales_lead_and_pdf',
      description: 'Thu thập thông tin khách hàng B2B để xuất File Báo giá PDF và gửi Lead cho Sales. CHỈ GỌI KHI KHÁCH ĐÃ ĐỒNG Ý BÁO GIÁ TẠM TÍNH.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING },
          phone: { type: Type.STRING },
          address: { type: Type.STRING },
          productId: { type: Type.STRING },
          quantityKg: { type: Type.NUMBER },
          notes: { type: Type.STRING }
        },
        required: ['customerName', 'phone', 'address', 'productId', 'quantityKg']
      }
    }
  ]
}];

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

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error('[Gemini AI] GEMINI_API_KEY is not set or loaded.');
      return handleFallbackBot();
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const systemPrompt = buildSystemPrompt();

    // Chuyển đổi định dạng message từ UI sang định dạng Gemini content
    const contents: any[] = [];
    for (const m of messages) {
      if (m.role === 'system') continue;
      
      if (m.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: m.content }] });
      } else if (m.role === 'assistant') {
        const parts = [];
        if (m.content) parts.push({ text: m.content });
        if (m.tool_calls && m.tool_calls.length > 0) {
          for (const tc of m.tool_calls) {
            parts.push({
              functionCall: {
                name: (tc as any).function.name,
                args: JSON.parse((tc as any).function.arguments || '{}')
              }
            });
          }
        }
        if (parts.length > 0) {
          contents.push({ role: 'model', parts });
        }
      } else if (m.role === 'tool') {
        contents.push({
          role: 'user',
          parts: [{
            functionResponse: {
              name: m.name || '',
              response: JSON.parse(m.content || '{}')
            }
          }]
        });
      }
    }

    const modelParams = {
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        tools: GEMINI_TOOLS,
        temperature: 0.3
      }
    };

    const response = await ai.models.generateContent(modelParams);

    // Xử lý Function Call
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;
      const args = call.args || {};

      let toolResult: any = {};
      let pdfData = null;
      let quoteSummary = null;
      let quoteDataForUI = null;

      if (functionName === 'search_products') {
        toolResult = await searchProductsDB(args.keyword as string, args.useCase as string);
      } else if (functionName === 'get_product_detail') {
        toolResult = await getProductDetailDB(args.productId as string);
      } else if (functionName === 'calculate_provisional_quote') {
        toolResult = await calculateQuoteDetails(args.productId as string, args.quantityKg as number);
        quoteDataForUI = toolResult;
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
      const nextContents = [
        ...contents,
        { role: 'model', parts: response.candidates?.[0]?.content?.parts || [] },
        {
          role: 'user',
          parts: [{
            functionResponse: {
              name: functionName,
              response: toolResult
            }
          }]
        }
      ];

      const secondResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: nextContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3
        }
      });

      const finalContent = secondResponse.text || '';

      // Create a compatible tool_calls array for the frontend
      const frontendToolCalls = [{
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: functionName,
          arguments: JSON.stringify(args)
        }
      }];

      return NextResponse.json({
        role: 'assistant',
        content: sanitizeNoAsterisks(finalContent),
        tool_calls: frontendToolCalls,
        ...(pdfData && { pdfData, quoteSummary }),
        ...(quoteDataForUI && { quoteData: quoteDataForUI })
      });
    }

    // NẾU AI TRẢ VỀ TEXT TRỰC TIẾP
    return NextResponse.json({
      role: 'assistant',
      content: sanitizeNoAsterisks(response.text || '')
    });

  } catch (error: any) {
    console.error('[Gemini AI Chat API Error]:', error);
    return handleFallbackBot();
  }
}

function handleFallbackBot() {
  return NextResponse.json({
    role: 'assistant',
    content: sanitizeNoAsterisks(`Dạ em là AI Sales Assistant của Nilon Xây Dựng! Hiện tại hệ thống tư vấn sâu đang bận, anh/chị vui lòng liên hệ Zalo OA: [Nilon Xây Dựng](${ZALO_CONTACT_URL}) hoặc Hotline: 0931982568 để được hỗ trợ nhanh nhất nhé ạ!`)
  });
}
