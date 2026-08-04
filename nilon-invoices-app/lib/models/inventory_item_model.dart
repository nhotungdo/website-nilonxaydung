class InventoryItemModel {
  final String id;
  final String sku;
  final String name;
  final String category;
  final String unit;
  final double currentStock;
  final double minStockAlert;
  final double importPrice;
  final double sellingPrice;
  final String? specs;
  final String? location;
  final DateTime createdAt;
  final DateTime lastUpdated;

  InventoryItemModel({
    required this.id,
    required this.sku,
    required this.name,
    required this.category,
    required this.unit,
    required this.currentStock,
    required this.minStockAlert,
    required this.importPrice,
    required this.sellingPrice,
    this.specs,
    this.location,
    required this.createdAt,
    required this.lastUpdated,
  });

  bool get isLowStock => currentStock <= minStockAlert;

  factory InventoryItemModel.fromJson(Map<String, dynamic> json) {
    return InventoryItemModel(
      id: json['id']?.toString() ?? '',
      sku: json['sku']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      category: json['category']?.toString() ?? 'Chưa phân loại',
      unit: json['unit']?.toString() ?? 'Cuộn',
      currentStock: (json['current_stock'] as num?)?.toDouble() ?? 0,
      minStockAlert: (json['min_stock_alert'] as num?)?.toDouble() ?? 10,
      importPrice: (json['import_price'] as num?)?.toDouble() ?? 0,
      sellingPrice: (json['selling_price'] as num?)?.toDouble() ?? 0,
      specs: json['specs']?.toString(),
      location: json['location']?.toString(),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
      lastUpdated: json['last_updated'] != null ? DateTime.parse(json['last_updated'].toString()) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sku': sku,
      'name': name,
      'category': category,
      'unit': unit,
      'current_stock': currentStock,
      'min_stock_alert': minStockAlert,
      'import_price': importPrice,
      'selling_price': sellingPrice,
      'specs': specs,
      'location': location,
      'created_at': createdAt.toIso8601String(),
      'last_updated': lastUpdated.toIso8601String(),
    };
  }

  InventoryItemModel copyWith({
    String? id,
    String? sku,
    String? name,
    String? category,
    String? unit,
    double? currentStock,
    double? minStockAlert,
    double? importPrice,
    double? sellingPrice,
    String? specs,
    String? location,
    DateTime? createdAt,
    DateTime? lastUpdated,
  }) {
    return InventoryItemModel(
      id: id ?? this.id,
      sku: sku ?? this.sku,
      name: name ?? this.name,
      category: category ?? this.category,
      unit: unit ?? this.unit,
      currentStock: currentStock ?? this.currentStock,
      minStockAlert: minStockAlert ?? this.minStockAlert,
      importPrice: importPrice ?? this.importPrice,
      sellingPrice: sellingPrice ?? this.sellingPrice,
      specs: specs ?? this.specs,
      location: location ?? this.location,
      createdAt: createdAt ?? this.createdAt,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}
