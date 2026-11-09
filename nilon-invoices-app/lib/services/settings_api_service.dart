import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_settings_model.dart';
import 'firebase_service.dart';

/// Service to interact with app_settings collection on Cloud Firestore
class SettingsApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static DocumentReference get _settingsDoc => _db.collection('app_settings').doc('default');

  // ─────────────────────────────────────────────
  // FETCH SETTINGS
  // ─────────────────────────────────────────────
  static Future<AppSettingsModel> fetchSettings() async {
    try {
      final doc = await _settingsDoc.get();
      if (!doc.exists || doc.data() == null) {
        return AppSettingsModel.defaults();
      }

      return AppSettingsModel.fromMap(doc.data() as Map<String, dynamic>);
    } catch (e) {
      return AppSettingsModel.defaults();
    }
  }

  // ─────────────────────────────────────────────
  // SAVE SETTINGS
  // ─────────────────────────────────────────────
  static Future<bool> saveSettings(AppSettingsModel settings) async {
    try {
      await _settingsDoc.set({
        ...settings.toMap(),
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
      return true;
    } catch (e) {
      throw Exception('[SettingsApiService] saveSettings failed: $e');
    }
  }
}
