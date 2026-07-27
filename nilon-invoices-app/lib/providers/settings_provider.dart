import 'package:flutter/material.dart';
import '../models/app_settings_model.dart';
import '../services/settings_api_service.dart';

class SettingsProvider extends ChangeNotifier {
  late AppSettingsModel _settings;
  bool _isSaving = false;
  bool _isLoading = false;
  String? _error;

  AppSettingsModel get settings => _settings;
  bool get isSaving => _isSaving;
  bool get isLoading => _isLoading;
  String? get error => _error;

  SettingsProvider() {
    _settings = AppSettingsModel.defaults();
    _initialize();
  }

  // ─────────────────────────────────────────────
  // INITIALIZE — Load settings from Supabase
  // ─────────────────────────────────────────────
  Future<void> _initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      _settings = await SettingsApiService.fetchSettings();
    } catch (e) {
      _settings = AppSettingsModel.defaults();
      _error = 'Không thể tải cài đặt từ Supabase';
      debugPrint('[SettingsProvider] _initialize error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE SETTINGS — Save to Supabase
  // ─────────────────────────────────────────────
  Future<bool> updateSettings(AppSettingsModel newSettings) async {
    _isSaving = true;
    notifyListeners();

    try {
      await SettingsApiService.saveSettings(newSettings);
      _settings = newSettings;
      _error = null;
      return true;
    } catch (e) {
      _error = 'Không thể lưu cài đặt: $e';
      debugPrint('[SettingsProvider] updateSettings error: $e');
      return false;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // REFRESH SETTINGS FROM SUPABASE
  // ─────────────────────────────────────────────
  Future<void> refreshSettings() async {
    await _initialize();
  }
}
