import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AI_KNOWLEDGE_BASE } from '@/data/ai-knowledge-base';

export interface QuotePDFData {
  quoteCode: string;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  thicknessZem: string;
  quantityKg: number;
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  shippingFee: number;
  grandTotal: number;
  estimatedAreaSqM?: number;
  notes?: string;
  createdAt?: string;
}

/**
 * Generate PDF Quote Document as base64 string or Uint8Array
 */
export function generateQuotePDF(data: QuotePDFData): { pdfBase64: string; pdfDataUri: string; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const quoteCode = data.quoteCode || `BG-${Date.now().toString().slice(-6)}`;
  const dateStr = data.createdAt || new Date().toLocaleDateString('vi-VN');

  // --- BRAND HEADER ---
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CONG TY TNHH SX & TM NILON XAY DUNG', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Hotline: ${AI_KNOWLEDGE_BASE.company.hotline} | Email: ${AI_KNOWLEDGE_BASE.company.email}`, 14, 23);
  doc.text(`Dia chi: ${AI_KNOWLEDGE_BASE.company.address}`, 14, 29);

  // Status Badge right aligned
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.roundedRect(145, 10, 50, 16, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BAO GIA TAM TINH', 148, 17);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ma: ${quoteCode}`, 148, 23);

  // --- DOCUMENT TITLE ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BANG BAO GIA VAT TU & CUOC GIAO HANG CONG TRINH', 14, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Ngay lap: ${dateStr} | Hieu luc: 07 ngay ke tu ngay lap`, 14, 54);

  // --- CUSTOMER & PROJECT INFO BOX ---
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, 58, 182, 30, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('THONG TIN KHACH HANG & CONG TRINH B2B:', 18, 65);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`KHACH HANG: ${data.customerName.toUpperCase()}`, 18, 72);
  doc.text(`DIEN THOAI: ${data.phone}`, 18, 78);
  doc.text(`DIA CHI CONG TRINH: ${data.address}`, 18, 84);

  // --- SPECIFICATIONS TABLE ---
  const tableRows = [
    [
      '1',
      `${data.productName}\n- Quy cach / Do day: ${data.thicknessZem}\n- Tieu chuan: ISO 9001:2015, TCVN 6407\n- Dien tich uoc tính: ~${data.estimatedAreaSqM || '-'} m2`,
      'Kg',
      data.quantityKg.toLocaleString('vi-VN'),
      `${data.unitPrice.toLocaleString('vi-VN')} VND`,
      `${data.subtotal.toLocaleString('vi-VN')} VND`
    ]
  ];

  if (data.shippingFee > 0) {
    tableRows.push([
      '2',
      'Cuoc van chuyen & giao hang xe tai tan cong trinh',
      'Chuyen',
      '1',
      `${data.shippingFee.toLocaleString('vi-VN')} VND`,
      `${data.shippingFee.toLocaleString('vi-VN')} VND`
    ]);
  } else {
    tableRows.push([
      '2',
      'Cuoc van chuyen tan cong trinh (Chinh sach mien phi gia sỉ > 1 ton)',
      'Giao hang',
      '1',
      '0 VND',
      '0 VND (MIEN PHI)'
    ]);
  }

  autoTable(doc, {
    startY: 94,
    head: [['STT', 'TÊN SAN PHAM / QUY CACH KY THUAT', 'DON VI', 'SO LUONG', 'DON GIA SI', 'THANH TIEN']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 90 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 20, halign: 'right' }
    }
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 140) + 8;

  // --- SUMMARY TOTALS BOX ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(110, finalY, 86, 32, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Tien vat tu:', 114, finalY + 8);
  doc.text(`${data.subtotal.toLocaleString('vi-VN')} VND`, 190, finalY + 8, { align: 'right' });

  doc.text('Chi phi van chuyen:', 114, finalY + 15);
  doc.text(`${data.shippingFee.toLocaleString('vi-VN')} VND`, 190, finalY + 15, { align: 'right' });

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(114, finalY + 19, 192, finalY + 19);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TONG TAM TINH:', 114, finalY + 26);
  doc.setTextColor(37, 99, 235);
  doc.text(`${data.grandTotal.toLocaleString('vi-VN')} VND`, 190, finalY + 26, { align: 'right' });

  // --- TECHNICAL NOTES & ISO FOOTER ---
  const notesY = Math.max(finalY + 38, 195);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CAM KET CHAT LUONG & GHI CHU KY THUAT:', 14, notesY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('- Hang dat tieu chuan ISO 9001:2015 & TCVN 6407. Cam ket màng PE dẻo dai, chống xé rách ASTM D1922.', 14, notesY + 5);
  doc.text('- Báo giá trên là báo giá tạm tính theo số kg thực tế. Tổng chi phí có thể điều chỉnh nhẹ theo cân nặng thực xuất kho.', 14, notesY + 10);
  doc.text('- Khi thi công lót bê tông, vui lòng cho gối chồng mí tối thiểu 15cm giữa 2 dải nilon để chống mất nước bê tông.', 14, notesY + 15);

  // Signature lines
  const sigY = notesY + 28;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('DAI DIEN KHACH HANG', 30, sigY);
  doc.text('DAI DIEN NILON XAY DUNG (AI SALES)', 130, sigY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('(Ky & ghi ro ho ten)', 36, sigY + 5);
  doc.text('(Bao gia tu dong bang AI System)', 135, sigY + 5);

  const pdfBase64 = doc.output('datauristring');
  const filename = `Bao_Gia_${quoteCode}_${data.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  return {
    pdfBase64,
    pdfDataUri: pdfBase64,
    filename
  };
}
