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

  factory PrintJobModel.fromSupabase(Map<String, dynamic> json) {
    // Handle joined data: orders(order_code, customers(full_name))
    final order = json['orders'] as Map<String, dynamic>?;
    final customer = order?['customers'] as Map<String, dynamic>?;

    return PrintJobModel(
      id: json['id'] as String,
      orderId: json['order_id'] as String? ?? '',
      orderCode: order?['order_code'] as String? ?? json['order_code'] as String? ?? '',
      customerName: customer?['full_name'] as String? ?? json['customer_name'] as String? ?? '',
      status: json['status'] as String? ?? 'PENDING',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String).toLocal()
          : DateTime.now(),
      printerName: json['printer_name'] as String?,
    );
  }

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
