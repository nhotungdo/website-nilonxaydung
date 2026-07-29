import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
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
  items: z.array(z.object({
    id: z.string().max(100).optional(),
    productId: z.string().max(100).optional(),
    productName: z.string().min(1).max(200),
    quantity: z.number().int().positive().max(10000),
    price: z.number().positive().max(1000000000),
    thickness: z.string().max(50).optional(),
    size: z.string().max(50).optional(),
  })).min(1).max(100), // Limit max items per order
});

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
          retryAfter: rateLimitResult.reset 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfigs.orders.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          }
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

    // Additional validation: check if total is reasonable
    if (subtotal <= 0 || subtotal > 10000000000) {
      return NextResponse.json(
        { success: false, message: 'Tổng giá trị đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    // Create order code (e.g., DH-1715750400000)
    const orderCode = `DH-${Date.now()}`;

    // 1. Transaction to save customer, order, items
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Find or create customer
      let dbCustomer = await tx.customer.findUnique({
        where: { phone: validatedData.phone }
      });

      if (!dbCustomer) {
        dbCustomer = await tx.customer.create({
          data: {
            fullName: validatedData.customerName,
            phone: validatedData.phone,
            address: validatedData.address,
          }
        });
      }
      console.log(`[DB]\nCustomer inserted: ${dbCustomer.id}\n`);

      // Map items to database order items, checking product associations
      const mappedItems = [];
      for (const item of validatedData.items) {
        let product = await tx.product.findUnique({
          where: { id: item.productId || item.id }
        });

        if (!product) {
          // Look up by name
          const productsByName = await tx.product.findMany({
            where: { name: item.productName }
          });
          
          if (productsByName.length > 0) {
            product = productsByName[0];
          } else {
            // Create fallback product if it doesn't exist
            const sku = `SKU-PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            product = await tx.product.create({
              data: {
                id: item.productId || item.id || `prod-${Date.now()}`,
                name: item.productName,
                sku,
                price: item.price,
                stock: 999,
              }
            });
          }
        }

        const price = item.price;
        const qty = item.quantity;

        mappedItems.push({
          productId: product.id,
          productName: item.thickness && item.size 
            ? `${item.productName} (${item.thickness}, ${item.size})`
            : item.productName,
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
          subtotal,
          shippingFee: 0,
          total: subtotal,
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          orderStatus: 'pending',
          printStatus: 'waiting',
          note: validatedData.note || '',
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

    // 2. Trigger sync and notification
    try {
      // Send real-time notify to Printer App using PostgreSQL NOTIFY
      const sent = await PrinterService.sendToPrinter(order.id);
      
      // Send Telegram Notification
      await TelegramService.sendOrderNotification(order);

      if (!sent) {
        await TelegramService.sendPrintErrorNotification(order.orderCode, 'Lỗi kích hoạt notify in hóa đơn');
      }
    } catch (notifyErr) {
      console.error('[Orders API Notification Error]:', notifyErr);
    }

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      message: 'Đơn hàng đã được tạo và đang chuyển sang bộ phận in',
    });

  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    // Don't expose internal error details to client
    return NextResponse.json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại.' 
    }, { status: 500 });
  }
}

