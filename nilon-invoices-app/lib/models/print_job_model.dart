import 'package:cloud_firestore/cloud_firestore.dart';

class PrintJobModel {
  final String id;
  final String orderId;
  final String orderCode;
  final String customerName;
  final String status; // 'PROCESSING', 'PENDING', 'SUCCESS', 'FAILED', 'WAITING'
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

  factory PrintJobModel.fromMap(String id, Map<String, dynamic> json) {
    final order = json['orders'] as Map<String, dynamic>?;
    final customer = order?['customers'] as Map<String, dynamic>?;

    DateTime parseDate(dynamic val) {
      if (val == null) return DateTime.now();
      if (val is Timestamp) return val.toDate();
      if (val is String) return DateTime.tryParse(val)?.toLocal() ?? DateTime.now();
      return DateTime.now();
    }

    return PrintJobModel(
      id: id,
      orderId: json['orderId'] ?? json['order_id'] ?? '',
      orderCode: json['orderCode'] ?? json['order_code'] ?? order?['order_code'] ?? '',
      customerName: json['customerName'] ?? json['customer_name'] ?? customer?['full_name'] ?? '',
      status: json['status'] ?? 'WAITING',
      createdAt: parseDate(json['createdAt'] ?? json['created_at']),
      printerName: json['printerName'] ?? json['printer_name'],
    );
  }

  factory PrintJobModel.fromSupabase(Map<String, dynamic> json) {
    return PrintJobModel.fromMap(json['id']?.toString() ?? '', json);
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
