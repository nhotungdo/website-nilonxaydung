import 'package:flutter/material.dart';
import '../models/app_settings_model.dart';
import '../services/mock_data_service.dart';

class SettingsProvider extends ChangeNotifier {
  late AppSettingsModel _settings;
  bool _isSaving = false;

  AppSettingsModel get settings => _settings;
  bool get isSaving => _isSaving;

  SettingsProvider() {
    _settings = MockDataService.getInitialSettings();
  }

  Future<bool> updateSettings(AppSettingsModel newSettings) async {
    _isSaving = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    _settings = newSettings;
    _isSaving = false;
    notifyListeners();
    return true;
  }
}
