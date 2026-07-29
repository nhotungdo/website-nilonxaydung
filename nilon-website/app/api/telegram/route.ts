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

// SECURITY: Remove or protect this debug endpoint in production
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      success: false, 
      error: 'Endpoint not available' 
    }, { status: 404 });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Env Variables' 
      }, { status: 500 });
    }

    const testMessage = `🤖 <b>TEST MESSAGE</b>\nSystem is working properly at ${new Date().toISOString()}`;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    // SECURITY: Don't expose tokens in response
    return NextResponse.json({
      success: response.ok,
      message: data.ok ? 'Test message sent successfully' : 'Failed to send test message',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

