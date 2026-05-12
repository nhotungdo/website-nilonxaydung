import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";

const formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  phone: z.string().min(1, 'Phone Number is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  company: z.string().optional(),
  product: z.string().min(1, 'Interested Product is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  message: z.string().min(1, 'Message cannot be empty'),
});

export async function POST(req: Request) {
  try {
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
        error: result.error,
      }, { status: 500 });
    }

    console.log('[Telegram API] 6. Success!');
    return NextResponse.json({ success: true, message: 'Gửi thông tin thành công!' });
  } catch (error: unknown) {
    console.error('[Telegram API] Catch Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ 
      success: false, 
      error: `Lỗi hệ thống: ${errorMessage}` 
    }, { status: 500 });
  }
}

export async function GET() {
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

    return NextResponse.json({
      success: response.ok,
      telegramResponse: data,
      botToken_last4: botToken.slice(-4),
      chatId,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
