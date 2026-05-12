import { NextResponse } from 'next/server';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { formatPrice } from "@/lib/formatPrice";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customer, items, totalAmount } = data;

    interface QuoteItem {
      name: string;
      thickness: string;
      size: string;
      quantity: number;
      price?: number;
    }

    // 1. Prepare items list string
    const itemsList = items.map((item: QuoteItem) => {
      const priceStr = item.price ? ` [${formatPrice(item.price)}/sp]` : '';
      const totalItemStr = item.price ? ` -> ${formatPrice(item.price * item.quantity)}` : '';
      return `- ${item.name} (${item.thickness}, ${item.size}) x${item.quantity}${priceStr}${totalItemStr}`;
    }).join('\n');

    // 2. Send Telegram Notification
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const telegramMsg = `🛒 <b>ĐƠN YÊU CẦU BÁO GIÁ MỚI</b>
👤 <b>Khách hàng:</b> ${escapeHTML(customer.name)}
📱 <b>Số điện thoại:</b> ${escapeHTML(customer.phone)}
📧 <b>Email:</b> ${escapeHTML(customer.email || 'N/A')}
📍 <b>Địa chỉ:</b> ${escapeHTML(customer.address || 'N/A')}

📦 <b>Sản phẩm:</b>
${escapeHTML(itemsList)}

💰 <b>Tổng giá trị:</b> ${formatPrice(totalAmount || 0)}

📝 <b>Ghi chú:</b> ${escapeHTML(customer.note || 'Không có')}
⏰ <b>Thời gian:</b> ${now}`;

    await sendTelegramMessage(telegramMsg);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi API Quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
