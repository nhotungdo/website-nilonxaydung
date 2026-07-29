import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { VN_PHONE_REGEX, VN_PHONE_ERROR_MSG } from '@/lib/validations/phone';
import { rateLimit, getClientIdentifier, rateLimitConfigs } from '@/lib/ratelimit';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required').max(100),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .transform((v) => v.trim().replace(/\s/g, ''))
    .refine((v) => VN_PHONE_REGEX.test(v), VN_PHONE_ERROR_MSG),
  email: z.string().min(1, 'Email is required').email('Invalid email format').max(100),
  company: z.string().max(200).optional(),
  product: z.string().min(1, 'Interested Product is required').max(200),
  quantity: z.string().min(1, 'Quantity is required').max(50),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const rateLimitResult = await rateLimit(identifier, rateLimitConfigs.contact);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
          retryAfter: rateLimitResult.reset 
        },
        { status: 429 }
      );
    }

    console.log('[Telegram API] 1. Receiving POST request...');
    const body = await req.json();
    console.log('[Telegram API] 2. Request body:', body);
    
    const parsedData = formSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    
    const { fullName, phone, email, company, product, quantity, message } = parsedData.data;
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const telegramMessage = `📦 <b>NEW QUOTE REQUEST</b>
👤 <b>Name:</b> ${escapeHTML(fullName)}
📞 <b>Phone:</b> ${escapeHTML(phone)}
📧 <b>Email:</b> ${escapeHTML(email)}
🏢 <b>Company:</b> ${escapeHTML(company || 'N/A')}
🛒 <b>Product:</b> ${escapeHTML(product)}
📦 <b>Quantity:</b> ${escapeHTML(quantity)}
📝 <b>Message:</b>
${escapeHTML(message)}
⏰ <b>Time:</b> ${now}`;

    console.log('[Telegram API] 4. Sending request to Telegram via Utility...');
    const result = await sendTelegramMessage(telegramMessage);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Không thể gửi thông tin. Vui lòng thử lại.',
      }, { status: 500 });
    }

    console.log('[Telegram API] 6. Success!');
    return NextResponse.json({ success: true, message: 'Gửi thông tin thành công!' });
  } catch (error: unknown) {
    console.error('[Telegram API] Catch Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.' 
    }, { status: 500 });
  }
}

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^["']|["']$/g, '');
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim().replace(/^["']|["']$/g, '');

  const hasBotToken = Boolean(botToken && botToken.length > 10);
  const hasChatId = Boolean(chatId && chatId.length > 3);

  const maskedToken = botToken 
    ? `${botToken.slice(0, 5)}...${botToken.slice(-4)}` 
    : 'MISSING';
  const maskedChat = chatId 
    ? `${chatId.slice(0, 5)}...${chatId.slice(-4)}` 
    : 'MISSING';

  if (!hasBotToken || !hasChatId) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Thiếu biến môi trường TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trên Vercel.',
      diagnostics: {
        hasBotToken,
        hasChatId,
        maskedToken,
        maskedChat,
      }
    }, { status: 500 });
  }

  const testMessage = `🤖 <b>TEST DIAGNOSTIC MESSAGE</b>\nHệ thống thông báo Telegram Nilon Xây Dựng kết nối thành công lúc: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
  
  const testResult = await sendTelegramMessage(testMessage);

  return NextResponse.json({
    status: testResult.success ? 'OK' : 'TELEGRAM_FAILED',
    message: testResult.success 
      ? 'Gửi tin nhắn thử nghiệm tới Telegram thành công! Bot hoạt động bình thường.' 
      : `Không thể gửi tin nhắn tới Telegram. Lỗi: ${testResult.error}`,
    diagnostics: {
      hasBotToken,
      hasChatId,
      maskedToken,
      maskedChat,
      testResult
    }
  });
}

