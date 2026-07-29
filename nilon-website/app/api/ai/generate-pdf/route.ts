import { NextResponse } from 'next/server';
import { generateQuotePDF, QuotePDFData } from '@/lib/pdf-quote-generator';

export async function POST(request: Request) {
  try {
    const data: QuotePDFData = await request.json();

    if (!data.customerName || !data.phone || !data.address) {
      return NextResponse.json({ error: 'Thiếu thông tin người nhận báo giá (Tên, SĐT, Địa chỉ)' }, { status: 400 });
    }

    const pdfResult = generateQuotePDF(data);

    return NextResponse.json({
      success: true,
      pdfBase64: pdfResult.pdfBase64,
      filename: pdfResult.filename
    });
  } catch (error: unknown) {
    console.error('[Generate PDF API Error]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
