import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";
import { sendTelegramMessage } from "@/lib/telegram";

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

    const { name, phone, company, message } = result.data;
    
    // Helper to escape HTML special characters
    const escapeHTML = (str: string) => 
      str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      }[m] || m));

    const safeName = escapeHTML(name);
    const safeCompany = company ? escapeHTML(company) : "Không cung cấp";
    const safeMessage = message ? escapeHTML(message) : "Không có lời nhắn";


    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    // 2. Format Telegram message (HTML style for better reliability)
    const telegramMsg = `
<b>🔔 KHÁCH HÀNG MỚI</b>

<b>👤 Họ tên:</b> ${safeName}
<b>📞 SĐT:</b> ${phone}
<b>🏢 Công ty:</b> ${safeCompany}
<b>📝 Nội dung:</b>
${safeMessage}

<b>🕒 Thời gian:</b> ${time}
    `.trim();

    // 3. Send Telegram
    const telegramResult = await sendTelegramMessage(telegramMsg);

    if (!telegramResult.success) {
      // Log error but maybe still return something to user or fail gracefully
      console.error("Failed to notify Telegram:", telegramResult.error);
    }

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
