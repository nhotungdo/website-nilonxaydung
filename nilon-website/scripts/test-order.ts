import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const orderCode = `DH-${Date.now()}`;
  const customerName = 'Khách Hàng Thử Nghiệm';
  const phone = '0987654321';
  const address = '123 Đường Thử Nghiệm, TP. HCM';
  const note = 'Đơn hàng thử nghiệm hệ thống';
  
  const items = [
    {
      productName: 'Nilon lót sàn PE',
      price: 150000,
      quantity: 2,
      thickness: '0.1mm',
      size: '2m x 50m'
    },
    {
      productName: 'Nilon lót sàn PVC',
      price: 250000,
      quantity: 1,
      thickness: '0.2mm',
      size: '1.5m x 50m'
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  try {
    console.log('🏁 Starting test order insertion transaction...');

    const order = await prisma.$transaction(async (tx) => {
      // 1. Find or create customer
      let dbCustomer = await tx.customer.findUnique({
        where: { phone }
      });

      if (!dbCustomer) {
        dbCustomer = await tx.customer.create({
          data: {
            fullName: customerName,
            phone,
            address,
          }
        });
      }
      console.log(`[DB]\nCustomer inserted: ${dbCustomer.id}\n`);

      // 2. Process items
      const mappedItems = [];
      for (const item of items) {
        // Look up by name
        let product = await tx.product.findFirst({
          where: { name: item.productName }
        });
        
        if (!product) {
          const sku = `SKU-PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          product = await tx.product.create({
            data: {
              id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              name: item.productName,
              sku,
              price: item.price,
              stock: 999,
            }
          });
        }

        mappedItems.push({
          productId: product.id,
          productName: item.thickness && item.size 
            ? `${item.productName} (${item.thickness}, ${item.size})`
            : item.productName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        });
      }
      console.log(`[DB]\nOrder items inserted: ${mappedItems.length} items\n`);

      // 3. Create new Order
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
          note,
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

  } catch (err: any) {
    console.error('❌ Test transaction failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
