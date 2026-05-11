import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  try {
    // In a real application, you would fetch these from a database
    // For now, we use mock data to demonstrate the format
    const mockReport = {
      totalOrders: 15,
      revenue: "25.500.000đ",
      contacts: 8,
      bestSeller: "Nilon lót sàn khổ 2m",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    const telegramMsg = `
<b>📊 BÁO CÁO CUỐI NGÀY</b>

<b>🛒 Tổng đơn:</b> ${mockReport.totalOrders}
<b>💰 Doanh thu:</b> ${mockReport.revenue}
<b>👥 Khách liên hệ:</b> ${mockReport.contacts}
<b>🔥 Sản phẩm bán chạy:</b>
${mockReport.bestSeller}

<b>📅 Ngày:</b> ${mockReport.date}
    `.trim();

    const result = await sendTelegramMessage(telegramMsg);

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({
      success: true,
      message: "Báo cáo ngày đã được gửi đến Telegram.",
    });
  } catch (error) {
    console.error("Daily Report Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
