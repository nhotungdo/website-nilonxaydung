import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact.schema";
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { MailService } from "@/services/mail.service";
import { prisma } from "@/lib/prisma";
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

    // 2. Save quote inquiry / order to database for nilon-invoices app
    const orderCode = `BG-${Date.now()}`;
    let createdOrderId: string | null = null;

    try {
      const order = await prisma.$transaction(async (tx) => {
        // Find or create customer based on phone
        let dbCustomer = await tx.customer.findUnique({
          where: { phone: phoneClean }
        });

        if (!dbCustomer) {
          dbCustomer = await tx.customer.create({
            data: {
              fullName: name,
              phone: phoneClean,
              address: company ? `Cty: ${company}` : 'Website User',
            }
          });
        }

        // Fallback product for contact / quick quote inquiry
        const prodName = need || 'Yêu cầu tư vấn & báo giá';
        let product = await tx.product.findFirst({
          where: { name: prodName }
        });

        if (!product) {
          const sku = `SKU-CONTACT-${Date.now()}`;
          product = await tx.product.create({
            data: {
              name: prodName,
              sku,
              slug: sku,
              image: '',
              category: 'Liên hệ',
              categorySlug: 'lien-he',
              subCategory: '',
              price: 0,
              stock: 999,
            }
          });
        }

        const noteText = [
          need ? `Nhu cầu: ${need}` : '',
          company ? `Công ty: ${company}` : '',
          message ? `Ghi chú: ${message}` : ''
        ].filter(Boolean).join(' | ');

        const newOrder = await tx.order.create({
          data: {
            orderCode,
            customerId: dbCustomer.id,
            subtotal: 0,
            shippingFee: 0,
            total: 0,
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            printStatus: 'waiting',
            note: noteText,
            items: {
              create: [
                {
                  productId: product.id,
                  productName: prodName,
                  price: 0,
                  quantity: 1,
                  total: 0
                }
              ]
            }
          }
        });

        return newOrder;
      });

      createdOrderId = order.id;
      console.log(`[DB] ✅ Saved contact quote request to database: ${order.orderCode}`);

      if (createdOrderId) {
        await PrinterService.sendToPrinter(createdOrderId);
      }
    } catch (dbErr) {
      console.error('[DB Save Contact Error]:', dbErr);
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
        content: message || undefined 
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

