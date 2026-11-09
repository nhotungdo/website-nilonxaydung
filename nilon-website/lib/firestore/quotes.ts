import { adminDb } from '../firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface QuoteInquiryInput {
  quoteCode?: string;
  customerName: string;
  phone: string;
  address?: string;
  productName: string;
  thicknessZem?: string;
  quantityKg: number;
  unitPrice: number;
  subtotal: number;
  shippingFee?: number;
  totalAmount: number;
  status?: string;
  aiNotes?: string;
}

export async function createQuoteInquiry(input: QuoteInquiryInput) {
  const quoteCode = input.quoteCode || `BG-AI-${Date.now()}`;
  const data = {
    quoteCode,
    customerName: input.customerName,
    phone: input.phone.trim().replace(/\s/g, ''),
    address: input.address || '',
    productName: input.productName,
    thicknessZem: input.thicknessZem || '4 zem',
    quantityKg: input.quantityKg,
    unitPrice: input.unitPrice,
    subtotal: input.subtotal,
    shippingFee: input.shippingFee || 0,
    totalAmount: input.totalAmount,
    status: input.status || 'pending',
    aiNotes: input.aiNotes || '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const docRef = await adminDb.collection('quote_inquiries').add(data);
  return {
    id: docRef.id,
    ...data,
  };
}

