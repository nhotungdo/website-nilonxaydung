class InventoryTransactionModel {
  final String id;
  final String type; // STOCK_IN, PRODUCTION_ADD, STOCK_OUT, ADJUSTMENT
  final String productId;
  final String productName;
  final double quantityChange;
  final double balanceAfter;
  final String referenceCode;
  final String? notes;
  final DateTime createdAt;
  final String createdBy;

  InventoryTransactionModel({
    required this.id,
    required this.type,
    required this.productId,
    required this.productName,
    required this.quantityChange,
    required this.balanceAfter,
    required this.referenceCode,
    this.notes,
    required this.createdAt,
    required this.createdBy,
  });

  factory InventoryTransactionModel.fromJson(Map<String, dynamic> json) {
    return InventoryTransactionModel(
      id: json['id']?.toString() ?? '',
      type: json['type']?.toString() ?? 'STOCK_IN',
      productId: json['product_id']?.toString() ?? '',
      productName: json['product_name']?.toString() ?? '',
      quantityChange: (json['quantity_change'] as num?)?.toDouble() ?? 0,
      balanceAfter: (json['balance_after'] as num?)?.toDouble() ?? 0,
      referenceCode: json['reference_code']?.toString() ?? '',
      notes: json['notes']?.toString(),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
      createdBy: json['created_by']?.toString() ?? 'Staff',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'product_id': productId,
      'product_name': productName,
      'quantity_change': quantityChange,
      'balance_after': balanceAfter,
      'reference_code': referenceCode,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'created_by': createdBy,
    };
  }
}
