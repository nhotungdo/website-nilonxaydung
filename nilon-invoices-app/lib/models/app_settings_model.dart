class AppSettingsModel {
  final String apiUrl;
  final String branchId;
  final String apiKey;
  final bool autoPrint;
  final bool soundAlert;
  final bool runOnStartup;

  AppSettingsModel({
    required this.apiUrl,
    required this.branchId,
    required this.apiKey,
    required this.autoPrint,
    required this.soundAlert,
    required this.runOnStartup,
  });

  /// Default settings when no doc exists in Firestore yet
  factory AppSettingsModel.defaults() {
    return AppSettingsModel(
      apiUrl: 'https://api.nilonxaydung.vn',
      branchId: 'NILON-CN1',
      apiKey: '',
      autoPrint: true,
      soundAlert: true,
      runOnStartup: true,
    );
  }

  factory AppSettingsModel.fromMap(Map<String, dynamic> json) {
    return AppSettingsModel(
      apiUrl: json['apiUrl'] ?? json['api_url'] ?? 'https://api.nilonxaydung.vn',
      branchId: json['branchId'] ?? json['socket_url'] ?? 'NILON-CN1',
      apiKey: json['apiKey'] ?? json['api_token'] ?? '',
      autoPrint: json['autoPrint'] ?? json['notification_sound'] ?? true,
      soundAlert: json['soundAlert'] ?? json['notification_sound'] ?? true,
      runOnStartup: json['autoStartup'] ?? json['auto_startup'] ?? false,
    );
  }

  factory AppSettingsModel.fromSupabase(Map<String, dynamic> json) => AppSettingsModel.fromMap(json);

  Map<String, dynamic> toMap() {
    return {
      'apiUrl': apiUrl,
      'api_url': apiUrl,
      'branchId': branchId,
      'socket_url': branchId,
      'apiKey': apiKey,
      'api_token': apiKey,
      'autoStartup': runOnStartup,
      'auto_startup': runOnStartup,
      'soundAlert': soundAlert,
      'notification_sound': soundAlert,
      'autoPrint': autoPrint,
    };
  }

  Map<String, dynamic> toSupabase() => toMap();

  AppSettingsModel copyWith({
    String? apiUrl,
    String? branchId,
    String? apiKey,
    bool? autoPrint,
    bool? soundAlert,
    bool? runOnStartup,
  }) {
    return AppSettingsModel(
      apiUrl: apiUrl ?? this.apiUrl,
      branchId: branchId ?? this.branchId,
      apiKey: apiKey ?? this.apiKey,
      autoPrint: autoPrint ?? this.autoPrint,
      soundAlert: soundAlert ?? this.soundAlert,
      runOnStartup: runOnStartup ?? this.runOnStartup,
    );
  }
}
