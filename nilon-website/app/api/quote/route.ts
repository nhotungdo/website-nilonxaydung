import { NextResponse } from 'next/server';
import { CartItem } from '@/store/cartStore';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customer, items } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Thiếu cấu hình Telegram');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Format products list
    const itemsList = items.map((item: CartItem, index: number) => {
      return `${index + 1}. ${item.name}
   - Độ dày: ${item.thickness}
   - Kích thước: ${item.size}
   - Số lượng: ${item.quantity}
   ${item.note ? `- Ghi chú: ${item.note}` : ''}`;
    }).join('\n\n');

    // Format message matching user's requirement format from previous context
    const message = `🛒 YÊU CẦU BÁO GIÁ TỪ GIỎ HÀNG

👤 Khách hàng: ${customer.name}
📞 SĐT: ${customer.phone}
${customer.email ? `📧 Email: ${customer.email}` : ''}
${customer.address ? `📍 Địa chỉ: ${customer.address}` : ''}
${customer.note ? `📝 Lời nhắn: ${customer.note}` : ''}

📦 DANH SÁCH SẢN PHẨM (${items.length} món):
${itemsList}

⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
`;

    // Gửi đến Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          // Không dùng markdown để tránh lỗi ký tự đặc biệt
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lỗi từ Telegram API:', errorText);
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi API Quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
