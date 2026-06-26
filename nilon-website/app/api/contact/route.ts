import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { MailService } from "@/services/mail.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate data
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu không hợp lệ", errors: result.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, need, message, company } = result.data;

    // 2. Send Telegram Notification
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const telegramMsg = `📞 <b>YÊU CẦU LIÊN HỆ MỚI</b>
👤 <b>Họ tên:</b> ${escapeHTML(name)}
📱 <b>Số điện thoại:</b> ${escapeHTML(phone)}
📧 <b>Email:</b> ${escapeHTML(email || 'Không có')}
🏢 <b>Công ty:</b> ${escapeHTML(company || 'Không có')}
🎯 <b>Nhu cầu:</b> ${escapeHTML(need || 'Liên hệ chung')}
📝 <b>Nội dung:</b>
${escapeHTML(message || '')}
⏰ <b>Thời gian:</b> ${now}`;

    await sendTelegramMessage(telegramMsg);

    // 3. Send Email Notification to Admin
    Promise.resolve().then(async () => {
      await MailService.sendContactNotification({ name, phone, email, company, need, content: message });
    });

    return NextResponse.json({
      success: true,
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
