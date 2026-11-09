import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/firestore/orders';
import { TelegramService } from '@/services/telegram.service';
import { PrinterService } from '@/services/printer.service';
import { z } from 'zod';
import { VN_PHONE_REGEX, VN_PHONE_ERROR_MSG } from '@/lib/validations/phone';
import { rateLimit, getClientIdentifier, rateLimitConfigs } from '@/lib/ratelimit';

const OrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .transform((v) => v.trim().replace(/\s/g, ''))
    .refine((v) => VN_PHONE_REGEX.test(v), VN_PHONE_ERROR_MSG),
  address: z.string().min(5).max(500),
  note: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        id: z.string().max(100).optional(),
        productId: z.string().max(100).optional(),
        productName: z.string().min(1).max(200),
        quantity: z.number().int().positive().max(10000),
        price: z.number().positive().max(1000000000),
        thickness: z.string().max(50).optional(),
        size: z.string().max(50).optional(),
      })
    )
    .min(1)
    .max(100),
});

export async function GET() {
  try {
    const orders = await getOrders(50);
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('[Orders API GET Error]:', error);
    return NextResponse.json({ success: false, message: 'Lỗi tải đơn hàng' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - prevent spam/DDoS
    const identifier = getClientIdentifier(req);
    const rateLimitResult = await rateLimit(identifier, rateLimitConfigs.orders);

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
            'X-RateLimit-Limit': rateLimitConfigs.orders.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          },
        }
      );
    }

    const body = await req.json();
    const validatedData = OrderSchema.parse(body);

    // Calculate total amount
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    if (subtotal <= 0 || subtotal > 10000000000) {
      return NextResponse.json(
        { success: false, message: 'Tổng giá trị đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    const orderCode = `DH-${Date.now()}`;

    const order = await createOrder({
      orderCode,
      customer: {
        fullName: validatedData.customerName,
        phone: validatedData.phone,
        address: validatedData.address,
      },
      items: validatedData.items.map((it) => ({
        productId: it.productId || it.id || '',
        productName:
          it.thickness && it.size ? `${it.productName} (${it.thickness}, ${it.size})` : it.productName,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
        thickness: it.thickness,
        size: it.size,
      })),
      subtotal,
      shippingFee: 0,
      total: subtotal,
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      printStatus: 'waiting',
      note: validatedData.note || '',
    });

    console.log(`[Firestore Order Created] Code: ${order.orderCode}, ID: ${order.id}`);

    // Trigger sync & notification
    try {
      await PrinterService.sendToPrinter(order.id, order);

      // Telegram format compatibility
      const telegramPayload: any = {
        id: order.id,
        orderCode: order.orderCode,
        total: order.total,
        note: order.note,
        customer: {
          fullName: order.customer.fullName,
          phone: order.customer.phone,
          address: order.customer.address,
        },
        items: order.items.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
          price: it.price,
          total: it.total,
        })),
      };

      await TelegramService.sendOrderNotification(telegramPayload);
    } catch (notifyErr) {
      console.error('[Orders API Notification Error]:', notifyErr);
    }

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      message: 'Đơn hàng đã được tạo thành công!',
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại.',
      },
      { status: 500 }
    );
  }
}
