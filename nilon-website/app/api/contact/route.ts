import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { MailService } from "@/services/mail.service";
import { createOrder } from "@/lib/firestore/orders";
import { PrinterService } from "@/services/printer.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate data
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const issueMsg = result.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json(
        { success: false, message: issueMsg, error: issueMsg, errors: result.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, need, message, company } = result.data;
    const phoneClean = phone.trim().replace(/\s/g, '');

    // 2. Save contact / quote inquiry to Firestore
    const orderCode = `BG-${Date.now()}`;
    const prodName = need || 'Yêu cầu tư vấn & báo giá';
    const noteText = [
      need ? `Nhu cầu: ${need}` : '',
      company ? `Công ty: ${company}` : '',
      email ? `Email: ${email}` : '',
      message ? `Ghi chú: ${message}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      const order = await createOrder({
        orderCode,
        customer: {
          fullName: name,
          phone: phoneClean,
          address: company ? `Cty: ${company}` : 'Website User',
        },
        items: [
          {
            productId: 'contact-inquiry',
            productName: prodName,
            price: 0,
            quantity: 1,
            unit: 'Lượt',
            total: 0,
          },
        ],
        subtotal: 0,
        shippingFee: 0,
        total: 0,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        printStatus: 'waiting',
        note: noteText,
      });

      console.log(`[Firestore] ✅ Saved contact inquiry: ${order.orderCode}`);
      await PrinterService.sendToPrinter(order.id, order);
    } catch (dbErr) {
      console.error('[Firestore Save Contact Error]:', dbErr);
    }

    // 3. Send Telegram Notification
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const telegramMsg = `📞 <b>YÊU CẦU BÁO GIÁ / LIÊN HỆ MỚI (#${orderCode})</b>
👤 <b>Họ tên:</b> ${escapeHTML(name)}
📱 <b>Số điện thoại:</b> ${escapeHTML(phoneClean)}
📧 <b>Email:</b> ${escapeHTML(email || 'Không có')}
🏢 <b>Công ty:</b> ${escapeHTML(company || 'Không có')}
🎯 <b>Nhu cầu:</b> ${escapeHTML(need || 'Liên hệ chung')}
📝 <b>Nội dung:</b>
${escapeHTML(message || '')}
⏰ <b>Thời gian:</b> ${now}`;

    await sendTelegramMessage(telegramMsg);

    // 4. Send Email Notification to Admin
    try {
      await MailService.sendContactNotification({
        name,
        phone: phoneClean,
        email: email || undefined,
        company: company || undefined,
        need: need || undefined,
        content: message || undefined,
      });
    } catch (mailErr) {
      console.error('[Contact API Email Error]:', mailErr);
    }

    return NextResponse.json({
      success: true,
      orderCode,
      message: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!",
    });
  } catch (error) {
    console.error("API Contact Error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi xử lý yêu cầu của bạn." },
      { status: 500 }
    );
  }
}
