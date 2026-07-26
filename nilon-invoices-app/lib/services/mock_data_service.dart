import '../models/order_model.dart';
import '../models/printer_model.dart';
import '../models/print_job_model.dart';
import '../models/app_settings_model.dart';

class MockDataService {
  static List<PrinterModel> getInitialPrinters() {
    return [
      PrinterModel(
        id: 'p1',
        name: 'HP LaserJet 9000 (Kho A)',
        paperSize: 'K80',
        connectionType: 'LAN',
        ipAddress: '192.168.1.200',
        port: 9100,
        status: 'ONLINE',
        isDefault: true,
      ),
      PrinterModel(
        id: 'p2',
        name: 'Xprinter XP-420B (Quầy Thu Ngân)',
        paperSize: 'K80',
        connectionType: 'USB',
        status: 'ONLINE',
        isDefault: false,
      ),
      PrinterModel(
        id: 'p3',
        name: 'Epson TM-T82III (Kho B)',
        paperSize: 'K58',
        connectionType: 'WIFI',
        ipAddress: '192.168.1.205',
        port: 9100,
        status: 'OFFLINE',
        isDefault: false,
      ),
    ];
  }

  static List<OrderModel> getInitialOrders() {
    final now = DateTime.now();
    return [
      OrderModel(
        id: 'ord-101',
        orderCode: 'NL-884920',
        customerName: 'Công ty TNHH Xây Dựng Hòa Bình',
        customerPhone: '0903123456',
        customerAddress: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
        totalAmount: 4850000,
        note: 'Giao trong giờ hành chính, gọi trước 30p',
        paymentMethod: 'Chuyển khoản',
        printStatus: 'waiting',
        orderStatus: 'pending',
        createdAt: now.subtract(const Duration(minutes: 5)),
        items: [
          OrderItemModel(productId: 'vat-tu-1', name: 'Bạt che công trình (xanh cam)', quantity: 20, price: 150000, unit: 'cuộn'),
          OrderItemModel(productId: 'gang-tay-1', name: 'Găng tay phủ cao su chống cắt', quantity: 50, price: 25000, unit: 'đôi'),
          OrderItemModel(productId: 'nilon-1', name: 'Nilon lót sàn bê tông 0.2mm', quantity: 10, price: 600000, unit: 'cuộn'),
        ],
      ),
      OrderModel(
        id: 'ord-102',
        orderCode: 'NL-773821',
        customerName: 'Anh Trần Minh Tâm (Nhà thầu Tân Bình)',
        customerPhone: '0988776655',
        customerAddress: '456 Trường Chinh, Q. Tân Bình, TP.HCM',
        totalAmount: 1250000,
        note: 'Thanh toán COD tại công trình',
        paymentMethod: 'COD',
        printStatus: 'printed',
        orderStatus: 'paid',
        createdAt: now.subtract(const Duration(hours: 1, minutes: 20)),
        items: [
          OrderItemModel(productId: 'gang-tay-2', name: 'Găng tay sợi len 50g', quantity: 100, price: 6500, unit: 'đôi'),
          OrderItemModel(productId: 'nilon-2', name: 'Nilon che chắn nội thất PE', quantity: 20, price: 30000, unit: 'cuộn'),
        ],
      ),
      OrderModel(
        id: 'ord-103',
        orderCode: 'NL-662910',
        customerName: 'Đại lý Vật liệu Xây dựng Hùng Phát',
        customerPhone: '0912345678',
        customerAddress: '789 Quốc lộ 1A, Bình Chánh, TP.HCM',
        totalAmount: 8900000,
        note: 'Đơn hàng đại lý xuất hóa đơn VAT',
        paymentMethod: 'Chuyển khoản',
        printStatus: 'printed',
        orderStatus: 'paid',
        createdAt: now.subtract(const Duration(hours: 3)),
        items: [
          OrderItemModel(productId: 'giay-bao-ho-1', name: 'Giày bảo hộ KPR chịu lực', quantity: 20, price: 350000, unit: 'đôi'),
          OrderItemModel(productId: 'vat-tu-1', name: 'Bạt che công trình (xanh cam)', quantity: 10, price: 190000, unit: 'cuộn'),
        ],
      ),
      OrderModel(
        id: 'ord-104',
        orderCode: 'NL-551029',
        customerName: 'Chị Lê Thị Thanh',
        customerPhone: '0933445566',
        customerAddress: '12 Đường số 5, KDC Him Lam, Q.7',
        totalAmount: 750000,
        note: 'Đã hủy do khách đổi quy cách bạt',
        paymentMethod: 'Tiền mặt',
        printStatus: 'waiting',
        orderStatus: 'cancelled',
        createdAt: now.subtract(const Duration(hours: 5)),
        items: [
          OrderItemModel(productId: 'nilon-2', name: 'Nilon che chắn nội thất PE', quantity: 25, price: 30000, unit: 'cuộn'),
        ],
      ),
    ];
  }

  static List<PrintJobModel> getInitialPrintJobs() {
    final now = DateTime.now();
    return [
      PrintJobModel(
        id: 'job-1',
        orderId: 'ord-101',
        orderCode: 'NL-884920',
        customerName: 'Công ty TNHH Xây Dựng Hòa Bình',
        status: 'PENDING',
        createdAt: now.subtract(const Duration(minutes: 5)),
        printerName: 'HP LaserJet 9000 (Kho A)',
      ),
      PrintJobModel(
        id: 'job-2',
        orderId: 'ord-102',
        orderCode: 'NL-773821',
        customerName: 'Anh Trần Minh Tâm (Nhà thầu Tân Bình)',
        status: 'SUCCESS',
        createdAt: now.subtract(const Duration(hours: 1, minutes: 20)),
        printerName: 'HP LaserJet 9000 (Kho A)',
      ),
      PrintJobModel(
        id: 'job-3',
        orderId: 'ord-103',
        orderCode: 'NL-662910',
        customerName: 'Đại lý Vật liệu Xây dựng Hùng Phát',
        status: 'SUCCESS',
        createdAt: now.subtract(const Duration(hours: 3)),
        printerName: 'Xprinter XP-420B (Quầy Thu Ngân)',
      ),
    ];
  }

  static AppSettingsModel getInitialSettings() {
    return AppSettingsModel(
      apiUrl: 'https://api.nilonxaydung.vn',
      branchId: 'NILON-CN1',
      apiKey: 'sk_live_998124718293712398',
      autoPrint: true,
      soundAlert: true,
      runOnStartup: true,
    );
  }

  static List<Map<String, dynamic>> getProductCatalog() {
    return [
      {'id': 'p1', 'name': 'Bạt che công trình (xanh cam)', 'price': 150000.0, 'unit': 'cuộn'},
      {'id': 'p2', 'name': 'Găng tay sợi len 50g', 'price': 6500.0, 'unit': 'đôi'},
      {'id': 'p3', 'name': 'Găng tay phủ cao su chống cắt', 'price': 25000.0, 'unit': 'đôi'},
      {'id': 'p4', 'name': 'Giày bảo hộ KPR chịu lực', 'price': 350000.0, 'unit': 'đôi'},
      {'id': 'p5', 'name': 'Nilon lót sàn bê tông 0.2mm', 'price': 600000.0, 'unit': 'cuộn'},
      {'id': 'p6', 'name': 'Nilon che chắn nội thất PE', 'price': 30000.0, 'unit': 'cuộn'},
    ];
  }
}
