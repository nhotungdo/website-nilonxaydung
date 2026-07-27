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

  /// Default settings when no row exists in Supabase yet
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

  /// Parse from Supabase app_settings row (snake_case columns)
  factory AppSettingsModel.fromSupabase(Map<String, dynamic> json) {
    return AppSettingsModel(
      apiUrl: json['api_url'] as String? ?? 'https://api.nilonxaydung.vn',
      branchId: json['socket_url'] as String? ?? 'NILON-CN1', // reuse socket_url for branchId
      apiKey: json['api_token'] as String? ?? '',
      autoPrint: json['notification_sound'] as bool? ?? true,
      soundAlert: json['notification_sound'] as bool? ?? true,
      runOnStartup: json['auto_startup'] as bool? ?? false,
    );
  }

  /// Convert to Supabase insert/update map (maps Flutter fields → DB columns)
  Map<String, dynamic> toSupabase() {
    return {
      'api_url': apiUrl,
      'socket_url': branchId,
      'api_token': apiKey,
      'auto_startup': runOnStartup,
      'notification_sound': soundAlert,
      'dark_mode': true,
    };
  }

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
