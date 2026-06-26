import nodemailer from 'nodemailer';
import { formatPrice } from '@/lib/formatPrice';

interface QuoteItem {
  name: string;
  thickness: string;
  size: string;
  quantity: number;
  price?: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}

export class MailService {
  private static getTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  public static async sendInvoiceEmail(
    orderCode: string,
    customer: CustomerInfo,
    items: QuoteItem[],
    totalAmount: number
  ) {
    if (!customer.email) {
      console.log('Customer email not provided, skipping email invoice.');
      return false;
    }

    try {
      const itemsHtml = items.map((item) => {
        const priceStr = item.price ? formatPrice(item.price) : 'Liên hệ';
        const totalItemStr = item.price ? formatPrice(item.price * item.quantity) : 'Liên hệ';
        const attributes = [item.thickness, item.size].filter(Boolean).join(', ');
        const productName = attributes ? `${item.name} (${attributes})` : item.name;

        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${productName}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${priceStr}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${totalItemStr}</td>
          </tr>
        `;
      }).join('');

      const mailOptions = {
        from: `"Nilon Xây Dựng" <${process.env.GMAIL_USER}>`,
        to: customer.email,
        bcc: 'donhotung2808@gmail.com',
        subject: `Hóa đơn đặt hàng từ Nilon Xây Dựng - #CD_${orderCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #ea580c; margin-bottom: 5px;">Cảm ơn bạn đã đặt hàng!</h2>
              <p style="color: #666;">Đơn yêu cầu báo giá/đặt hàng của bạn đã được ghi nhận.</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Thông tin đơn hàng #${orderCode}</h3>
              <p><strong>Khách hàng:</strong> ${customer.name}</p>
              <p><strong>Số điện thoại:</strong> ${customer.phone}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Địa chỉ:</strong> ${customer.address || 'N/A'}</p>
              ${customer.note ? `<p><strong>Ghi chú:</strong> ${customer.note}</p>` : ''}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1;">Sản phẩm</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #cbd5e1;">SL</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1;">Đơn giá</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 16px;">Tổng cộng:</td>
                  <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 16px; color: #ea580c;">
                    ${formatPrice(totalAmount || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style="text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng.</p>
              <p>Nilon Xây Dựng - Uy tín, chất lượng.</p>
            </div>
          </div>
        `,
      };

      const info = await this.getTransporter().sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  public static async sendContactNotification(data: { name: string; phone: string; email?: string; company?: string; content?: string; need?: string }) {
    try {
      const mailOptions = {
        from: `"Nilon Xây Dựng" <${process.env.GMAIL_USER}>`,
        to: 'donhotung2808@gmail.com',
        subject: `[Website Nilon] Yêu cầu liên hệ / Báo giá nhanh từ ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ea580c;">
              <h3 style="margin-top: 0; color: #1e293b;">Có yêu cầu tư vấn / báo giá mới!</h3>
              <p><strong>Khách hàng:</strong> ${data.name}</p>
              <p><strong>Số điện thoại:</strong> ${data.phone}</p>
              <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
              <p><strong>Công ty:</strong> ${data.company || 'N/A'}</p>
              <p><strong>Nhu cầu:</strong> ${data.need || 'N/A'}</p>
              <p><strong>Nội dung:</strong> ${data.content || 'N/A'}</p>
            </div>
          </div>
        `,
      };

      const info = await this.getTransporter().sendMail(mailOptions);
      console.log('Contact notification sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending contact notification email:', error);
      return false;
    }
  }
}
