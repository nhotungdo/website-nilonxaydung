import { adminDb } from '../firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface OrderCustomer {
  id?: string;
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
  unit?: string;
  total: number;
  thickness?: string;
  size?: string;
}

export interface CreateOrderInput {
  orderCode?: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  printStatus?: string;
  note?: string;
}

export interface FirestoreOrder extends CreateOrderInput {
  id: string;
  orderCode: string;
  createdAt: any;
  updatedAt: any;
  printedAt?: any;
  printedBy?: string;
}

export async function saveCustomer(customer: OrderCustomer): Promise<string> {
  const phoneClean = customer.phone.trim().replace(/\s/g, '');
  const customerRef = adminDb.collection('customers').doc(phoneClean);
  await customerRef.set(
    {
      fullName: customer.fullName,
      phone: phoneClean,
      address: customer.address || '',
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return phoneClean;
}

export async function createOrder(input: CreateOrderInput): Promise<FirestoreOrder> {
  const orderCode = input.orderCode || `DH-${Date.now()}`;
  
  // Save/update customer profile
  const customerId = await saveCustomer(input.customer);

  const orderData = {
    orderCode,
    customer: {
      id: customerId,
      fullName: input.customer.fullName,
      phone: input.customer.phone.trim().replace(/\s/g, ''),
      address: input.customer.address || '',
    },
    items: input.items.map((it) => ({
      productId: it.productId || '',
      productName: it.productName,
      price: it.price,
      quantity: it.quantity,
      unit: it.unit || 'Cuộn',
      total: it.total || it.price * it.quantity,
      thickness: it.thickness || '',
      size: it.size || '',
    })),
    subtotal: input.subtotal,
    shippingFee: input.shippingFee || 0,
    total: input.total,
    paymentMethod: input.paymentMethod || 'COD',
    paymentStatus: input.paymentStatus || 'pending',
    orderStatus: input.orderStatus || 'pending',
    printStatus: input.printStatus || 'waiting',
    note: input.note || '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const docRef = await adminDb.collection('orders').add(orderData);
  console.log(`[Firestore] ✅ Created Order ${orderCode} (ID: ${docRef.id})`);

  // Auto-enqueue a print_job for Desktop Auto-Print
  try {
    await adminDb.collection('print_jobs').add({
      orderId: docRef.id,
      orderCode,
      customerName: input.customer.fullName,
      customerPhone: input.customer.phone,
      total: input.total,
      status: 'WAITING',
      retryCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`[Firestore] 🖨️ Enqueued print job for order ${orderCode}`);
  } catch (err: any) {
    console.warn('[Firestore] Failed to enqueue print job:', err.message);
  }

  return {
    id: docRef.id,
    ...orderData,
  };
}

export async function getOrders(limitCount = 50): Promise<FirestoreOrder[]> {
  const snap = await adminDb
    .collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      orderCode: data.orderCode || doc.id,
      customer: data.customer || {},
      items: data.items || [],
      subtotal: data.subtotal || 0,
      shippingFee: data.shippingFee || 0,
      total: data.total || 0,
      paymentMethod: data.paymentMethod || 'COD',
      paymentStatus: data.paymentStatus || 'pending',
      orderStatus: data.orderStatus || 'pending',
      printStatus: data.printStatus || 'waiting',
      note: data.note || '',
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      printedAt: data.printedAt?.toDate ? data.printedAt.toDate().toISOString() : data.printedAt,
      printedBy: data.printedBy,
    };
  });
}

export async function getOrderById(id: string): Promise<FirestoreOrder | null> {
  const doc = await adminDb.collection('orders').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    id: doc.id,
    orderCode: data.orderCode || doc.id,
    customer: data.customer || {},
    items: data.items || [],
    subtotal: data.subtotal || 0,
    shippingFee: data.shippingFee || 0,
    total: data.total || 0,
    paymentMethod: data.paymentMethod || 'COD',
    paymentStatus: data.paymentStatus || 'pending',
    orderStatus: data.orderStatus || 'pending',
    printStatus: data.printStatus || 'waiting',
    note: data.note || '',
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
}

