class PrinterModel {
  final String id;
  final String name;
  final String paperSize; // 'K80', 'K58'
  final String connectionType; // 'LAN', 'USB', 'WIFI'
  final String? ipAddress;
  final int? port;
  final String status; // 'ONLINE', 'OFFLINE', 'ERROR'
  final bool isDefault;

  PrinterModel({
    required this.id,
    required this.name,
    required this.paperSize,
    required this.connectionType,
    this.ipAddress,
    this.port,
    required this.status,
    required this.isDefault,
  });

  PrinterModel copyWith({
    String? id,
    String? name,
    String? paperSize,
    String? connectionType,
    String? ipAddress,
    int? port,
    String? status,
    bool? isDefault,
  }) {
    return PrinterModel(
      id: id ?? this.id,
      name: name ?? this.name,
      paperSize: paperSize ?? this.paperSize,
      connectionType: connectionType ?? this.connectionType,
      ipAddress: ipAddress ?? this.ipAddress,
      port: port ?? this.port,
      status: status ?? this.status,
      isDefault: isDefault ?? this.isDefault,
    );
  }
}
