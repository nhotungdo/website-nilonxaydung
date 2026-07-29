import { NextResponse } from 'next/server';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { formatPrice } from "@/lib/formatPrice";
import { prisma } from '@/lib/prisma';
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

// Input validation schema
const QuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Vui lòng nhập họ và tên').max(100),
    phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
    email: z.string().optional().nullable().or(z.literal('')),
    address: z.string().optional().nullable().or(z.literal('')),
    note: z.string().optional().nullable().or(z.literal('')),
  }),
  items: z.array(z.object({
    id: z.string().max(100),
    name: z.string().min(1).max(200),
    thickness: z.string().optional().nullable().transform(v => v || 'Tiêu chuẩn'),
    size: z.string().optional().nullable().transform(v => v || 'Tiêu chuẩn'),
    quantity: z.number().int().positive().max(10000),
    price: z.number().nonnegative().max(1000000000).optional(),
  })).min(1, 'Danh sách chọn phải có ít nhất 1 sản phẩm').max(100),
  totalAmount: z.number().nonnegative().max(10000000000).optional(),
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const rateLimitResult = await rateLimit(identifier, rateLimitConfigs.quotes);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
          retryAfter: rateLimitResult.reset 
        },
        { status: 429 }
      );
    }

    const data = await req.json();
    
    // Validate input
    const validatedData = QuoteSchema.parse(data);
    const { customer, items, totalAmount } = validatedData;

    // Validate số điện thoại Việt Nam
    const phoneClean = customer.phone.trim().replace(/\s/g, '');
    if (!VN_PHONE_REGEX.test(phoneClean)) {
      return NextResponse.json(
        { success: false, message: VN_PHONE_ERROR_MSG },
        { status: 400 }
      );
    }

    // 1. Generate unique order code for the quote request
    const orderCode = `BG-${Date.now()}`;

    // 2. Save quote request to database with a robust transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create customer based on phone
      let dbCustomer = await tx.customer.findUnique({
        where: { phone: phoneClean }
      });

      if (!dbCustomer) {
        dbCustomer = await tx.customer.create({
          data: {
            fullName: customer.name,
            phone: phoneClean,
            address: customer.address || 'N/A',
          }
        });
      }
      console.log(`[DB]\nCustomer inserted: ${dbCustomer.id}\n`);

      // Process items and link to Products
      const mappedItems = [];
      for (const item of items) {
        let product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          // Try to look up by name
          const productsByName = await tx.product.findMany({
            where: { name: item.name }
          });
          
          if (productsByName.length > 0) {
            product = productsByName[0];
          } else {
            // Create a dynamic custom product if it's not in DB yet
            const sku = `SKU-CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            product = await tx.product.create({
              data: {
                id: item.id || `cust-${Date.now()}`,
                name: item.name,
                sku,
                price: item.price || 0,
                stock: 999,
              }
            });
          }
        }

        const price = item.price || 0;
        const qty = item.quantity || 1;

        mappedItems.push({
          productId: product.id,
          productName: item.thickness && item.size 
            ? `${item.name} (${item.thickness}, ${item.size})`
            : item.name,
          price,
          quantity: qty,
          total: price * qty
        });
      }
      console.log(`[DB]\nOrder items inserted: ${mappedItems.length} items\n`);

      // Create new Order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerId: dbCustomer.id,
          subtotal: totalAmount || 0,
          shippingFee: 0,
          total: totalAmount || 0,
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          orderStatus: 'pending',
          printStatus: 'waiting',
          note: customer.note || '',
          items: {
            create: mappedItems,
          },
        },
        include: {
          items: true,
          customer: true
        },
      });
      console.log(`[DB]\nOrder inserted: ${newOrder.orderCode}\n`);

      return newOrder;
    });

    console.log('[DB]\ntransaction success\n');
    console.log('[ORDER CREATED]');
    console.log(`Order Code: ${order.orderCode}`);
    console.log('Saved to database successfully');

    // 3. Prepare items list string for Telegram notification
    const itemsList = items.map((item: QuoteItem) => {
      const priceStr = item.price ? ` [${formatPrice(item.price)}/sp]` : '';
      const totalItemStr = item.price ? ` -> ${formatPrice(item.price * item.quantity)}` : '';
      return `- ${item.name} (${item.thickness}, ${item.size}) x${item.quantity}${priceStr}${totalItemStr}`;
    }).join('\n');

    // 4. Send Telegram Notification & Sync to Printer App in background
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

    // 4. Send Telegram Notification & Sync to Printer App
    try {
      await sendTelegramMessage(telegramMsg);
      
      // Trigger Printer Spooler Sync via PostgreSQL NOTIFY
      const sent = await PrinterService.sendToPrinter(order.id);
      if (!sent) {
        await TelegramService.sendPrintErrorNotification(order.orderCode, 'Lỗi kích hoạt notify in hóa đơn');
      }

      // Send Email Invoice to Customer
      if (customer.email) {
        const customerWithEmail: CustomerInfo = {
          name: customer.name,
          email: customer.email,
          phone: phoneClean,
          address: customer.address || 'N/A',
          note: customer.note || undefined,
        };
        await MailService.sendInvoiceEmail(order.orderCode, customerWithEmail, items, totalAmount || 0);
      }
    } catch (bgErr) {
      console.error('[Quote API Background Task Error]:', bgErr);
    }

    return NextResponse.json({ success: true, orderCode: order.orderCode });
  } catch (error) {
    console.error('Lỗi API Quote:', error);
    if (error instanceof z.ZodError) {
      const issueMsg = error.issues[0]?.message || 'Dữ liệu không hợp lệ';
      return NextResponse.json(
        { success: false, message: issueMsg, error: issueMsg, details: error.issues },
        { status: 400 }
      );
    }
    const errMsg = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.';
    return NextResponse.json(
      { success: false, message: errMsg, error: errMsg },
      { status: 500 }
    );
  }
}

