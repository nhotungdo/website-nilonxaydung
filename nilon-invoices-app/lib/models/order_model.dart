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
