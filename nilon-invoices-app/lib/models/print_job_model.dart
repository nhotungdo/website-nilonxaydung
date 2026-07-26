class PrintJobModel {
  final String id;
  final String orderId;
  final String orderCode;
  final String customerName;
  final String status; // 'PROCESSING', 'PENDING', 'SUCCESS', 'FAILED'
  final DateTime createdAt;
  final String? printerName;

  PrintJobModel({
    required this.id,
    required this.orderId,
    required this.orderCode,
    required this.customerName,
    required this.status,
    required this.createdAt,
    this.printerName,
  });

  PrintJobModel copyWith({
    String? id,
    String? orderId,
    String? orderCode,
    String? customerName,
    String? status,
    DateTime? createdAt,
    String? printerName,
  }) {
    return PrintJobModel(
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      orderCode: orderCode ?? this.orderCode,
      customerName: customerName ?? this.customerName,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      printerName: printerName ?? this.printerName,
    );
  }
}
