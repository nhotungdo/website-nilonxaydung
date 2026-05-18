import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface OrderNotificationPayload {
  orderCode: string;
  total?: number;
  totalAmount?: number;
  customer?: {
    fullName: string;
    phone: string;
    address: string;
  };
  customerName?: string;
  phone?: string;
  address?: string;
}

export const TelegramService = {
  async sendMessage(message: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram bot token or chat ID not found');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  },

  async sendOrderNotification(order: OrderNotificationPayload) {
    const customerName = order.customer?.fullName || order.customerName || 'N/A';
    const phone = order.customer?.phone || order.phone || 'N/A';
    const address = order.customer?.address || order.address || 'N/A';
    const total = order.total ?? order.totalAmount ?? 0;

    const message = `
🛒 <b>Đơn hàng mới #${order.orderCode}</b>

<b>Khách:</b> ${customerName}
<b>SĐT:</b> ${phone}
<b>Địa chỉ:</b> ${address}
<b>Tổng tiền:</b> ${total.toLocaleString('vi-VN')}đ

✅ <i>Đã chuyển sang app in hóa đơn</i>
    `;
    await this.sendMessage(message.trim());
  },

  async sendPrintErrorNotification(orderCode: string, error: string) {
    const message = `
❌ <b>Lỗi in hóa đơn #${orderCode}</b>

<b>Nội dung:</b> ${error}
<b>Nội dung lỗi:</b> Hóa đơn không thể in tự động.
⚠️ <i>Hệ thống sẽ tự động retry sau 30s</i>
    `;
    await this.sendMessage(message.trim());
  }
};
