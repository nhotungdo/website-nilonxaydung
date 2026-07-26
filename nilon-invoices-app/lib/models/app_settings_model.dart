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
