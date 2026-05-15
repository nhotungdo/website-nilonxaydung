import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/services/telegram.service';
import { PrinterService } from '@/services/printer.service';
import { z } from 'zod';

const OrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  items: z.array(z.object({
    productName: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = OrderSchema.parse(body);

    // Calculate total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Create order code (e.g., DH-1715750400000)
    const orderCode = `DH-${Date.now()}`;

    // 1. Save to PostgreSQL
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerName: validatedData.customerName,
          phone: validatedData.phone,
          address: validatedData.address,
          totalAmount,
          status: 'pending',
          items: {
            create: validatedData.items,
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Create Print Queue record
      await tx.printQueue.create({
        data: {
          orderId: newOrder.id,
          status: 'pending',
        },
      });

      return newOrder;
    });

    // 3. Trigger sync and notification (async)
    // We don't wait for these to return to the user, but we trigger them
    Promise.resolve().then(async () => {
      // Send to Printer App
      const sent = await PrinterService.sendToPrinter(order.id);
      
      // Send Telegram Notification
      await TelegramService.sendOrderNotification(order);

      if (!sent) {
        await TelegramService.sendPrintErrorNotification(order.orderCode, 'App in đang offline hoặc lỗi kết nối');
      }
    });

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      message: 'Đơn hàng đã được tạo và đang chuyển sang bộ phận in',
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
