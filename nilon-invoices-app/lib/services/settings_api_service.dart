import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/app_settings_model.dart';
import 'supabase_service.dart';

/// Service to interact with app_settings table on Supabase
/// The settings table uses id=1 as a single-row config (upsert pattern)
class SettingsApiService {
  static SupabaseClient get _db => SupabaseService.client;

  static const int _settingsId = 1;

  // ─────────────────────────────────────────────
  // FETCH SETTINGS
  // ─────────────────────────────────────────────
  static Future<AppSettingsModel> fetchSettings() async {
    try {
      final data = await _db
          .from('app_settings')
          .select()
          .eq('id', _settingsId)
          .maybeSingle();

      if (data == null) {
        // Return defaults if no settings row exists yet
        return AppSettingsModel.defaults();
      }

      return AppSettingsModel.fromSupabase(data);
    } catch (e) {
      // Return safe defaults on error
      return AppSettingsModel.defaults();
    }
  }

  // ─────────────────────────────────────────────
  // SAVE SETTINGS (upsert single row with id=1)
  // ─────────────────────────────────────────────
  static Future<bool> saveSettings(AppSettingsModel settings) async {
    try {
      await _db.from('app_settings').upsert({
        'id': _settingsId,
        ...settings.toSupabase(),
      });
      return true;
    } catch (e) {
      throw Exception('[SettingsApiService] saveSettings failed: $e');
    }
  }
}
