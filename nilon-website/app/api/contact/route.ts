import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, need, content } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ tên và số điện thoại' },
        { status: 400 }
      );
    }

    const messageContent = need ? `[${need}] ${content || ''}`.trim() : (content || 'Không có');
    let message = `📩 YÊU CẦU BÁO GIÁ MỚI

👤 Tên: ${name}
📞 SĐT: ${phone}
📝 Nội dung: ${messageContent}`;

    if (email) {
      message += `\n📧 Email: ${email}`;
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
      }
    } else {
      console.warn('Telegram bot token or chat ID is not configured.');
      console.log('New Contact Request:', { name, phone, email, need, content });
    }

    return NextResponse.json({ success: true, message: 'Yêu cầu đã được gửi thành công' }, { status: 200 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
