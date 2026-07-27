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
    return OrderItemModel(
      productId: json['productId'],
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? 1,
      price: (json['price'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'sp',
    );
  }

  /// Parse from Supabase order_items row (uses snake_case column names)
  factory OrderItemModel.fromSupabase(Map<String, dynamic> json) {
    return OrderItemModel(
      productId: json['product_id'] as String?,
      name: json['product_name'] as String? ?? '',
      quantity: (json['quantity'] as int?) ?? 1,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      unit: 'sp', // unit is not stored in DB, default
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'name': name,
      'quantity': quantity,
      'price': price,
      'unit': unit,
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

  /// Parse from Supabase SELECT with joined customers + order_items
  factory OrderModel.fromSupabase(Map<String, dynamic> json) {
    final customer = json['customers'] as Map<String, dynamic>?;
    final rawItems = json['order_items'] as List<dynamic>? ?? [];

    return OrderModel(
      id: json['id'] as String,
      orderCode: json['order_code'] as String? ?? '',
      customerName: customer?['full_name'] as String? ?? 'Khách lẻ',
      customerPhone: customer?['phone'] as String? ?? '',
      customerAddress: customer?['address'] as String? ?? '',
      totalAmount: (json['total'] as num?)?.toDouble() ?? 0.0,
      note: json['note'] as String? ?? '',
      paymentMethod: json['payment_method'] as String? ?? 'COD',
      printStatus: json['print_status'] as String? ?? 'waiting',
      orderStatus: json['order_status'] as String? ?? 'pending',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String).toLocal()
          : DateTime.now(),
      items: rawItems
          .map((item) => OrderItemModel.fromSupabase(item as Map<String, dynamic>))
          .toList(),
    );
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
