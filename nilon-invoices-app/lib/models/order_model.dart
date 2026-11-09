import 'package:cloud_firestore/cloud_firestore.dart';

class OrderItemModel {
  final String? productId;
  final String name;
  final int quantity;
  final double price;
  final String unit;

  OrderItemModel({
    this.productId,
    required this.name,
    required this.quantity,
    required this.price,
    this.unit = 'sp',
  });

  double get totalPrice => quantity * price;

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel.fromMap(json);
  }

  factory OrderItemModel.fromMap(Map<String, dynamic> json) {
    return OrderItemModel(
      productId: json['productId'] ?? json['product_id'],
      name: json['productName'] ?? json['name'] ?? json['product_name'] ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      unit: json['unit'] ?? 'sp',
    );
  }

  /// Backward compatibility for legacy tests
  factory OrderItemModel.fromSupabase(Map<String, dynamic> json) {
    return OrderItemModel.fromMap(json);
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'productName': name,
      'name': name,
      'quantity': quantity,
      'price': price,
      'unit': unit,
      'total': totalPrice,
    };
  }
}

class OrderModel {
  final String id;
  final String orderCode;
  final String customerName;
  final String customerPhone;
  final String customerAddress;
  final double totalAmount;
  final String note;
  final String paymentMethod;
  final String printStatus; // 'waiting', 'printed'
  final String orderStatus; // 'pending', 'paid', 'cancelled'
  final DateTime createdAt;
  final List<OrderItemModel> items;

  OrderModel({
    required this.id,
    required this.orderCode,
    required this.customerName,
    required this.customerPhone,
    required this.customerAddress,
    required this.totalAmount,
    required this.note,
    required this.paymentMethod,
    required this.printStatus,
    required this.orderStatus,
    required this.createdAt,
    required this.items,
  });

  factory OrderModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return OrderModel.fromMap(doc.id, data);
  }

  factory OrderModel.fromMap(String id, Map<String, dynamic> data) {
    final customer = data['customer'] as Map<String, dynamic>? ??
        data['customers'] as Map<String, dynamic>?;
    final rawItems = (data['items'] ?? data['order_items']) as List<dynamic>? ?? [];

    DateTime parseDate(dynamic val) {
      if (val == null) return DateTime.now();
      if (val is Timestamp) return val.toDate();
      if (val is String) return DateTime.tryParse(val)?.toLocal() ?? DateTime.now();
      return DateTime.now();
    }

    return OrderModel(
      id: id,
      orderCode: data['orderCode'] ?? data['order_code'] ?? id,
      customerName: customer?['fullName'] ?? customer?['full_name'] ?? data['customerName'] ?? 'Khách lẻ',
      customerPhone: customer?['phone'] ?? data['customerPhone'] ?? '',
      customerAddress: customer?['address'] ?? data['customerAddress'] ?? '',
      totalAmount: ((data['total'] ?? data['totalAmount']) as num?)?.toDouble() ?? 0.0,
      note: data['note'] ?? '',
      paymentMethod: data['paymentMethod'] ?? data['payment_method'] ?? 'COD',
      printStatus: data['printStatus'] ?? data['print_status'] ?? 'waiting',
      orderStatus: data['orderStatus'] ?? data['order_status'] ?? 'pending',
      createdAt: parseDate(data['createdAt'] ?? data['created_at']),
      items: rawItems
          .map((item) => OrderItemModel.fromMap(item as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Backward compatibility
  factory OrderModel.fromSupabase(Map<String, dynamic> json) {
    return OrderModel.fromMap(json['id']?.toString() ?? '', json);
  }

  OrderModel copyWith({
    String? id,
    String? orderCode,
    String? customerName,
    String? customerPhone,
    String? customerAddress,
    double? totalAmount,
    String? note,
    String? paymentMethod,
    String? printStatus,
    String? orderStatus,
    DateTime? createdAt,
    List<OrderItemModel>? items,
  }) {
    return OrderModel(
      id: id ?? this.id,
      orderCode: orderCode ?? this.orderCode,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      customerAddress: customerAddress ?? this.customerAddress,
      totalAmount: totalAmount ?? this.totalAmount,
      note: note ?? this.note,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      printStatus: printStatus ?? this.printStatus,
      orderStatus: orderStatus ?? this.orderStatus,
      createdAt: createdAt ?? this.createdAt,
      items: items ?? this.items,
    );
  }
}
