import { NextResponse } from 'next/server';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { formatPrice } from "@/lib/formatPrice";
import { createOrder } from '@/lib/firestore/orders';
import { PrinterService } from '@/services/printer.service';
import { TelegramService } from '@/services/telegram.service';
import { MailService } from '@/services/mail.service';
import { VN_PHONE_REGEX, VN_PHONE_ERROR_MSG } from '@/lib/validations/phone';
import { rateLimit, getClientIdentifier, rateLimitConfigs } from '@/lib/ratelimit';
import { z } from 'zod';

interface QuoteItem {
  id: string;
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

const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Vui lòng nhập họ và tên').max(100),
    phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
    email: z.string().optional().nullable().or(z.literal('')),
    address: z.string().optional().nullable().or(z.literal('')),
    note: z.string().optional().nullable().or(z.literal('')),
  }),
  items: z
    .array(
      z.object({
        id: z.string().max(100),
        name: z.string().min(1).max(200),
        thickness: z.string().optional().nullable().transform((v) => v || 'Tiêu chuẩn'),
        size: z.string().optional().nullable().transform((v) => v || 'Tiêu chuẩn'),
        quantity: z.number().int().positive().max(10000),
        price: z.number().nonnegative().max(1000000000).optional(),
      })
    )
    .min(1, 'Danh sách chọn phải có ít nhất 1 sản phẩm')
    .max(100),
  totalAmount: z.number().nonnegative().max(10000000000).optional(),
});

export async function POST(req: Request) {
  try {
    const identifier = getClientIdentifier(req);
    const rateLimitResult = await rateLimit(identifier, rateLimitConfigs.quotes);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfigs.quotes.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          },
        }
      );
    }

    const body = await req.json();
    const parseResult = QuoteSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || 'Dữ liệu không hợp lệ';
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const { customer, items, totalAmount } = parseResult.data;
    const phoneClean = customer.phone.trim().replace(/\s/g, '');

    if (!VN_PHONE_REGEX.test(phoneClean)) {
      return NextResponse.json({ success: false, message: VN_PHONE_ERROR_MSG }, { status: 400 });
    }

    const orderCode = `BG-${Date.now()}`;

    // Create Order in Firestore
    const order = await createOrder({
      orderCode,
      customer: {
        fullName: customer.name,
        phone: phoneClean,
        address: customer.address || 'N/A',
      },
      items: items.map((it) => ({
        productId: it.id,
        productName: it.thickness && it.size ? `${it.name} (${it.thickness}, ${it.size})` : it.name,
        price: it.price || 0,
        quantity: it.quantity,
        unit: 'Cuộn',
        total: (it.price || 0) * it.quantity,
        thickness: it.thickness,
        size: it.size,
      })),
      subtotal: totalAmount || 0,
      shippingFee: 0,
      total: totalAmount || 0,
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      printStatus: 'waiting',
      note: customer.note || '',
    });

    console.log(`[Firestore] ✅ Created quote order: ${order.orderCode}`);

    // Telegram notification
    const itemsList = items
      .map((item: QuoteItem) => {
        const priceStr = item.price ? ` [${formatPrice(item.price)}/sp]` : '';
        const totalItemStr = item.price ? ` -> ${formatPrice(item.price * item.quantity)}` : '';
        return `- ${item.name} (${item.thickness}, ${item.size}) x${item.quantity}${priceStr}${totalItemStr}`;
      })
      .join('\n');

    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const telegramMsg = `🛒 <b>ĐƠN YÊU CẦU BÁO GIÁ MỚI (#${orderCode})</b>
👤 <b>Khách hàng:</b> ${escapeHTML(customer.name)}
📱 <b>Số điện thoại:</b> ${escapeHTML(phoneClean)}
📧 <b>Email:</b> ${escapeHTML(customer.email || 'N/A')}
📍 <b>Địa chỉ:</b> ${escapeHTML(customer.address || 'N/A')}

📦 <b>Sản phẩm:</b>
${escapeHTML(itemsList)}

💰 <b>Tổng giá trị:</b> ${formatPrice(totalAmount || 0)}

📝 <b>Ghi chú:</b> ${escapeHTML(customer.note || 'Không có')}
⏰ <b>Thời gian:</b> ${now}`;

    try {
      await sendTelegramMessage(telegramMsg);
      await PrinterService.sendToPrinter(order.id, order);

      if (customer.email) {
        const customerWithEmail: CustomerInfo = {
          name: customer.name,
          email: customer.email,
          phone: phoneClean,
          address: customer.address || 'N/A',
          note: customer.note || '',
        };
        await MailService.sendInvoiceEmail(orderCode, customerWithEmail, items, totalAmount || 0);
      }
    } catch (notifErr) {
      console.error('[Quote API Notification Error]:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Gửi yêu cầu báo giá thành công!',
      orderCode,
    });
  } catch (error) {
    console.error('API Quote Error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
