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

  /// Parse from Supabase printers row (snake_case)
  factory PrinterModel.fromSupabase(Map<String, dynamic> json) {
    return PrinterModel(
      id: json['id'] as String,
      name: json['name'] as String,
      paperSize: json['paper_size'] as String? ?? 'K80',
      connectionType: json['connection_type'] as String? ?? 'USB',
      ipAddress: json['ip_address'] as String?,
      port: null, // port not stored in DB schema
      status: (json['is_active'] as bool? ?? true) ? 'ONLINE' : 'OFFLINE',
      isDefault: json['is_default'] as bool? ?? false,
    );
  }

  /// Convert to Supabase insert/update map
  Map<String, dynamic> toSupabase() {
    return {
      'id': id.isEmpty ? 'pr-${DateTime.now().millisecondsSinceEpoch}' : id,
      'name': name,
      'paper_size': paperSize,
      'connection_type': connectionType,
      'ip_address': ipAddress,
      'is_default': isDefault,
      'is_active': status != 'OFFLINE',
    };
  }

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
