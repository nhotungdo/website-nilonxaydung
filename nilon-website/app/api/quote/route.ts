import { NextResponse } from 'next/server';
import { sendTelegramMessage, escapeHTML } from "@/lib/telegram";
import { formatPrice } from "@/lib/formatPrice";
import { prisma } from '@/lib/prisma';
import { PrinterService } from '@/services/printer.service';
import { TelegramService } from '@/services/telegram.service';

interface QuoteItem {
  id: string;
  name: string;
  thickness: string;
  size: string;
  quantity: number;
  price?: number;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customer, items, totalAmount } = data;

    // 1. Generate unique order code for the quote request
    const orderCode = `BG-${Date.now()}`;

    // 2. Save quote request to database with a robust transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create customer based on phone
      let dbCustomer = await tx.customer.findUnique({
        where: { phone: customer.phone }
      });

      if (!dbCustomer) {
        dbCustomer = await tx.customer.create({
          data: {
            fullName: customer.name,
            phone: customer.phone,
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
📱 <b>Số điện thoại:</b> ${escapeHTML(customer.phone)}
📧 <b>Email:</b> ${escapeHTML(customer.email || 'N/A')}
📍 <b>Địa chỉ:</b> ${escapeHTML(customer.address || 'N/A')}

📦 <b>Sản phẩm:</b>
${escapeHTML(itemsList)}

💰 <b>Tổng giá trị:</b> ${formatPrice(totalAmount || 0)}

📝 <b>Ghi chú:</b> ${escapeHTML(customer.note || 'Không có')}
⏰ <b>Thời gian:</b> ${now}`;

    Promise.resolve().then(async () => {
      // Send Telegram Quote Notification
      await sendTelegramMessage(telegramMsg);
      
      // Trigger Printer Spooler Sync via PostgreSQL NOTIFY
      const sent = await PrinterService.sendToPrinter(order.id);
      if (!sent) {
        await TelegramService.sendPrintErrorNotification(order.orderCode, 'Lỗi kích hoạt notify in hóa đơn');
      }
    });
    
    return NextResponse.json({ success: true, orderCode: order.orderCode });
  } catch (error) {
    console.error('Lỗi API Quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
