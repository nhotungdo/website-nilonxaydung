import { NextResponse } from 'next/server';
import { CartItem } from '@/store/cartStore';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customer, items } = data;

    const orderId = `DH${Math.floor(Math.random() * 9000) + 1000}`;
    const totalPrice = items.reduce((sum: number, item: CartItem) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const formattedTotal = totalPrice > 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice) : 'Liên hệ';
    
    const message = `
<b>🛒 ĐƠN HÀNG MỚI</b>

<b>📦 Mã đơn:</b> ${orderId}
<b>👤 Khách hàng:</b> ${customer.name}
<b>📞 SĐT:</b> ${customer.phone}

<b>🧾 Sản phẩm:</b>
${items.map((item: CartItem) => `- ${item.name}\n- Số lượng: ${item.quantity} ${item.thickness ? `(${item.thickness})` : ''}`).join('\n')}

<b>💰 Tổng tiền:</b> ${formattedTotal}
<b>🚚 Trạng thái:</b> Chờ xác nhận
    `.trim();

    // Gửi đến Telegram qua service trung tâm
    const telegramResult = await sendTelegramMessage(message);

    if (!telegramResult.success) {
      console.error('Lỗi gửi báo giá Telegram:', telegramResult.error);
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
