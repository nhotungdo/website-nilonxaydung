class StockInReceiptModel {
  final String id;
  final String receiptCode;
  final String productId;
  final String productName;
  final double quantity;
  final String unit;
  final double importPrice;
  final double totalAmount;
  final String batchCode;
  final String? supplier;
  final String? notes;
  final DateTime createdAt;
  final String createdBy;

  StockInReceiptModel({
    required this.id,
    required this.receiptCode,
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.unit,
    required this.importPrice,
    required this.totalAmount,
    required this.batchCode,
    this.supplier,
    this.notes,
    required this.createdAt,
    required this.createdBy,
  });

  factory StockInReceiptModel.fromJson(Map<String, dynamic> json) {
    return StockInReceiptModel(
      id: json['id']?.toString() ?? '',
      receiptCode: json['receipt_code']?.toString() ?? '',
      productId: json['product_id']?.toString() ?? '',
      productName: json['product_name']?.toString() ?? '',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 0,
      unit: json['unit']?.toString() ?? 'Cuộn',
      importPrice: (json['import_price'] as num?)?.toDouble() ?? 0,
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0,
      batchCode: json['batch_code']?.toString() ?? '',
      supplier: json['supplier']?.toString(),
      notes: json['notes']?.toString(),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
      createdBy: json['created_by']?.toString() ?? 'Staff',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'receipt_code': receiptCode,
      'product_id': productId,
      'product_name': productName,
      'quantity': quantity,
      'unit': unit,
      'import_price': importPrice,
      'total_amount': totalAmount,
      'batch_code': batchCode,
      'supplier': supplier,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'created_by': createdBy,
    };
  }
}
