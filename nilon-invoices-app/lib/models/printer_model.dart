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

  factory PrinterModel.fromMap(String id, Map<String, dynamic> json) {
    return PrinterModel(
      id: id,
      name: json['name'] as String? ?? 'Máy in',
      paperSize: json['paperSize'] ?? json['paper_size'] ?? 'K80',
      connectionType: json['connectionType'] ?? json['connection_type'] ?? 'USB',
      ipAddress: json['ipAddress'] ?? json['ip_address'] as String?,
      port: json['port'] as int?,
      status: (json['isActive'] ?? json['is_active'] as bool? ?? true) ? 'ONLINE' : 'OFFLINE',
      isDefault: json['isDefault'] ?? json['is_default'] as bool? ?? false,
    );
  }

  factory PrinterModel.fromSupabase(Map<String, dynamic> json) {
    return PrinterModel.fromMap(json['id']?.toString() ?? '', json);
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'paperSize': paperSize,
      'paper_size': paperSize,
      'connectionType': connectionType,
      'connection_type': connectionType,
      'ipAddress': ipAddress,
      'ip_address': ipAddress,
      'isDefault': isDefault,
      'is_default': isDefault,
      'isActive': status != 'OFFLINE',
      'is_active': status != 'OFFLINE',
    };
  }

  Map<String, dynamic> toSupabase() => toMap();

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
