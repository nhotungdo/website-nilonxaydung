class DailyProductionLogModel {
  final String id;
  final DateTime productionDate;
  final String shift;
  final String machineId;
  final String operatorName;
  final String productId;
  final String productName;
  final double producedQuantity;
  final double wasteQuantity;
  final String unit;
  final bool autoAddedToStock;
  final String? notes;
  final DateTime createdAt;

  DailyProductionLogModel({
    required this.id,
    required this.productionDate,
    required this.shift,
    required this.machineId,
    required this.operatorName,
    required this.productId,
    required this.productName,
    required this.producedQuantity,
    required this.wasteQuantity,
    required this.unit,
    required this.autoAddedToStock,
    this.notes,
    required this.createdAt,
  });

  factory DailyProductionLogModel.fromJson(Map<String, dynamic> json) {
    return DailyProductionLogModel(
      id: json['id']?.toString() ?? '',
      productionDate: json['production_date'] != null
          ? DateTime.parse(json['production_date'].toString())
          : DateTime.now(),
      shift: json['shift']?.toString() ?? 'Ca 1 (Sáng)',
      machineId: json['machine_id']?.toString() ?? '',
      operatorName: json['operator_name']?.toString() ?? '',
      productId: json['product_id']?.toString() ?? '',
      productName: json['product_name']?.toString() ?? '',
      producedQuantity: (json['produced_quantity'] as num?)?.toDouble() ?? 0,
      wasteQuantity: (json['waste_quantity'] as num?)?.toDouble() ?? 0,
      unit: json['unit']?.toString() ?? 'Cuộn',
      autoAddedToStock: json['auto_added_to_stock'] as bool? ?? true,
      notes: json['notes']?.toString(),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'].toString()) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'production_date': productionDate.toIso8601String().split('T')[0],
      'shift': shift,
      'machine_id': machineId,
      'operator_name': operatorName,
      'product_id': productId,
      'product_name': productName,
      'produced_quantity': producedQuantity,
      'waste_quantity': wasteQuantity,
      'unit': unit,
      'auto_added_to_stock': autoAddedToStock,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
