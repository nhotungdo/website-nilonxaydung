import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/services/telegram.service';
import { PrinterService } from '@/services/printer.service';
import { z } from 'zod';

const OrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  note: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(),
    productId: z.string().optional(),
    productName: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    thickness: z.string().optional(),
    size: z.string().optional(),
  })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = OrderSchema.parse(body);

    // Calculate total amount
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Create order code (e.g., DH-1715750400000)
    const orderCode = `DH-${Date.now()}`;

    // 1. Transaction to save customer, order, items
    const order = await prisma.$transaction(async (tx) => {
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

    // 2. Trigger sync and notification (async)
    Promise.resolve().then(async () => {
      // Send real-time notify to Printer App using PostgreSQL NOTIFY
      const sent = await PrinterService.sendToPrinter(order.id);
      
      // Send Telegram Notification
      await TelegramService.sendOrderNotification(order);

      if (!sent) {
        await TelegramService.sendPrintErrorNotification(order.orderCode, 'Lỗi kích hoạt notify in hóa đơn');
      }
    });

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
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
