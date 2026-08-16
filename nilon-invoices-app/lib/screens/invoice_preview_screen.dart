import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../providers/order_provider.dart';
import '../providers/queue_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class InvoicePreviewScreen extends StatefulWidget {
  const InvoicePreviewScreen({super.key});

  @override
  State<InvoicePreviewScreen> createState() => _InvoicePreviewScreenState();
}

class _InvoicePreviewScreenState extends State<InvoicePreviewScreen> {
  String _selectedPaperSize = 'K80'; // 'K80' or 'K58'

  Future<void> _generateAndSharePdf(BuildContext context, dynamic order, String paperSize) async {
    final pdf = pw.Document();
    
    // Load Vietnamese supporting fonts
    final font = await PdfGoogleFonts.robotoRegular();
    final fontBold = await PdfGoogleFonts.robotoBold();

    final isK80 = paperSize == 'K80';
    final pageFormat = isK80 ? PdfPageFormat.roll80 : PdfPageFormat.roll57;

    pdf.addPage(
      pw.Page(
        pageFormat: pageFormat,
        margin: const pw.EdgeInsets.all(12),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              pw.Text('NILON XÂY DỰNG', style: pw.TextStyle(font: fontBold, fontSize: 16)),
              pw.SizedBox(height: 4),
              pw.Text('Chuyên Bạt Che, Găng Tay & Nilon Bê Tông', style: pw.TextStyle(font: font, fontSize: 10)),
              pw.Text('Hotline: 090 123 4567', style: pw.TextStyle(font: font, fontSize: 10)),
              pw.Divider(),
              pw.Text('HÓA ĐƠN BÁN HÀNG', style: pw.TextStyle(font: fontBold, fontSize: 14)),
              pw.Text('Số: ${order.orderCode}', style: pw.TextStyle(font: font, fontSize: 10)),
              pw.Text('Khách hàng: ${order.customerName}', style: pw.TextStyle(font: font, fontSize: 10)),
              pw.SizedBox(height: 10),
              pw.Table(
                columnWidths: {
                  0: const pw.FlexColumnWidth(3),
                  1: const pw.FlexColumnWidth(1),
                  2: const pw.FlexColumnWidth(2),
                },
                children: [
                  pw.TableRow(
                    children: [
                      pw.Text('Tên VT', style: pw.TextStyle(font: fontBold, fontSize: 10)),
                      pw.Text('SL', style: pw.TextStyle(font: fontBold, fontSize: 10), textAlign: pw.TextAlign.center),
                      pw.Text('Thành tiền', style: pw.TextStyle(font: fontBold, fontSize: 10), textAlign: pw.TextAlign.right),
                    ]
                  ),
                  ...order.items.map<pw.TableRow>((item) => pw.TableRow(
                    children: [
                      pw.Text(item.name, style: pw.TextStyle(font: font, fontSize: 10)),
                      pw.Text('${item.quantity}', style: pw.TextStyle(font: font, fontSize: 10), textAlign: pw.TextAlign.center),
                      pw.Text(NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(item.totalPrice), style: pw.TextStyle(font: font, fontSize: 10), textAlign: pw.TextAlign.right),
                    ]
                  )).toList(),
                ],
              ),
              pw.Divider(),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('TỔNG CỘNG:', style: pw.TextStyle(font: fontBold, fontSize: 12)),
                  pw.Text(NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(order.totalAmount), style: pw.TextStyle(font: fontBold, fontSize: 12)),
                ]
              ),
              pw.SizedBox(height: 10),
              pw.BarcodeWidget(
                barcode: pw.Barcode.qrCode(),
                data: 'https://nilonxaydung.vn/invoice/${order.orderCode}',
                width: 80,
                height: 80,
              ),
              pw.SizedBox(height: 10),
              pw.Text('CẢM ƠN QUÝ KHÁCH!', style: pw.TextStyle(font: fontBold, fontSize: 10)),
            ],
          );
        },
      ),
    );

    await Printing.sharePdf(bytes: await pdf.save(), filename: 'hoadon_${order.orderCode}.pdf');
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final queueProvider = context.read<QueueProvider>();
    final orders = orderProvider.orders;

    final targetOrder = orderProvider.previewOrder ?? (orders.isNotEmpty ? orders.first : null);
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < 650;

              final titleSection = Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Xem trước hóa đơn in',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                  ),
                  Text(
                    'Mô phỏng bản in thực tế trên khổ giấy nhiệt K80 và K58.',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              );

              final actionSection = SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(value: 'K80', label: Text('Khổ K80 (80mm)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold))),
                        ButtonSegment(value: 'K58', label: Text('Khổ K58 (58mm)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold))),
                      ],
                      selected: {_selectedPaperSize},
                      onSelectionChanged: (Set<String> newSelection) {
                        setState(() {
                          _selectedPaperSize = newSelection.first;
                        });
                      },
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryTeal),
                      onPressed: () {
                        if (targetOrder != null) {
                          queueProvider.addJob(targetOrder.id, targetOrder.orderCode, targetOrder.customerName, null);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Đã gửi lệnh in cho phiếu ${targetOrder.orderCode}')),
                          );
                        }
                      },
                      icon: const Icon(Icons.print_rounded, color: Colors.white, size: 18),
                      label: const Text('In phiếu ngay', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 12),
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.primaryTeal),
                      ),
                      onPressed: () {
                        if (targetOrder != null) {
                          _generateAndSharePdf(context, targetOrder, _selectedPaperSize);
                        }
                      },
                      icon: const Icon(Icons.picture_as_pdf_rounded, color: AppTheme.primaryTeal, size: 18),
                      label: const Text('Xuất PDF', style: TextStyle(color: AppTheme.primaryTeal, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              );

              if (isMobile) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    titleSection,
                    const SizedBox(height: 12),
                    actionSection,
                  ],
                );
              }

              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: titleSection),
                  const SizedBox(width: 12),
                  Flexible(child: actionSection),
                ],
              );
            },
          ),
          const SizedBox(height: 24),

          if (targetOrder == null)
            const Center(child: Text('Không tìm thấy dữ liệu hóa đơn nào.'))
          else
            Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: _selectedPaperSize == 'K80' ? 380 : 290,
                child: GlassCard(
                  padding: const EdgeInsets.all(20),
                  backgroundColor: Colors.white,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Thermal Receipt Header
                      const Text(
                        'NILON XÂY DỰNG',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 2),
                      const Text('Chuyên Bạt Che, Găng Tay & Nilon Bê Tông', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      const Text('Hotline: 090 123 4567 • Www.nilonxaydung.vn', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      const Text('Đ/c: 123 Nguyễn Văn Linh, Q.7, TP.HCM', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      const Divider(height: 20, thickness: 1, color: Colors.black12),

                      const Text('HÓA ĐƠN BÁN HÀNG', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900)),
                      Text('Số: ${targetOrder.orderCode}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      Text('Ngày: ${DateFormat('dd/MM/yyyy HH:mm').format(targetOrder.createdAt)}', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                      const SizedBox(height: 12),

                      // Customer Info
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Khách hàng: ${targetOrder.customerName}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            Text('SĐT: ${targetOrder.customerPhone}', style: const TextStyle(fontSize: 11)),
                            if (targetOrder.customerAddress.isNotEmpty)
                              Text('Địa chỉ: ${targetOrder.customerAddress}', style: const TextStyle(fontSize: 11)),
                            Text('Thanh toán: ${targetOrder.paymentMethod}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Item table header
                      Container(
                        color: Colors.grey.shade100,
                        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                        child: Row(
                          children: const [
                            Expanded(flex: 3, child: Text('Tên VT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                            Expanded(flex: 1, child: Text('SL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                            Expanded(flex: 2, child: Text('Thành tiền', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold), textAlign: TextAlign.right)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),

                      // Item list
                      ...targetOrder.items.map((item) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                flex: 3,
                                child: Text(item.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                              ),
                              Expanded(
                                flex: 1,
                                child: Text('${item.quantity}', style: const TextStyle(fontSize: 11), textAlign: TextAlign.center),
                              ),
                              Expanded(
                                flex: 2,
                                child: Text(
                                  currencyFormat.format(item.totalPrice),
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ],
                          ),
                        );
                      }),

                      const Divider(height: 20, thickness: 1, color: Colors.black12),

                      // Total Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Flexible(
                            child: Text('TỔNG CỘNG TIỀN:', overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerRight,
                              child: Text(
                                currencyFormat.format(targetOrder.totalAmount),
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.primaryTeal),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // QR Code
                      QrImageView(
                        data: 'https://nilonxaydung.vn/invoice/${targetOrder.orderCode}',
                        version: QrVersions.auto,
                        size: 100.0,
                      ),
                      const SizedBox(height: 6),
                      const Text('Quét mã QR để tra cứu hóa đơn điện tử', style: TextStyle(fontSize: 9, color: Colors.grey)),
                      const SizedBox(height: 12),

                      const Text('CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI!', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
