import { sendTelegramMessage } from '@/lib/telegram';

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
    return await sendTelegramMessage(message);
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
    `.trim();

    await this.sendMessage(message);
  },

  async sendPrintErrorNotification(orderCode: string, error: string) {
    const message = `
❌ <b>Lỗi in hóa đơn #${orderCode}</b>

<b>Nội dung:</b> ${error}
<b>Nội dung lỗi:</b> Hóa đơn không thể in tự động.
⚠️ <i>Hệ thống sẽ tự động retry sau 30s</i>
    `.trim();

    await this.sendMessage(message);
  }
};
