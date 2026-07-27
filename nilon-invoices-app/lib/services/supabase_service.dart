import 'package:supabase_flutter/supabase_flutter.dart';

/// Supabase credentials for project: wtezillfvsdkjfctrimi
/// 
/// ⚠️  IMPORTANT: Replace the placeholder values below with your actual keys from:
///     Supabase Dashboard → Settings → API
///
/// - SUPABASE_URL: Always https://[project-id].supabase.co
/// - SUPABASE_ANON_KEY: The "anon public" key (safe to embed in client apps)
class SupabaseConfig {
  static const String supabaseUrl = 'https://wtezillfvsdkjfctrimi.supabase.co';

  /// Replace this with your actual Supabase anon key from:
  /// Supabase Dashboard → Settings → API → Project API keys → anon public
  static const String supabaseAnonKey = 'sb_publishable_cAJhDWxpKcVlsP-OlQALbQ_YXBGIRw1';
}

/// Singleton wrapper for Supabase client initialization
class SupabaseService {
  static SupabaseClient get client => Supabase.instance.client;

  /// Initialize Supabase — call this once in main() before runApp()
  static Future<void> initialize() async {
    await Supabase.initialize(
      url: SupabaseConfig.supabaseUrl,
      // ignore: deprecated_member_use
      anonKey: SupabaseConfig.supabaseAnonKey, // publishableKey in newer versions
      debug: false, // Set to true during development to see query logs
    );
  }

  /// Check if Supabase client is ready
  static bool get isInitialized {
    try {
      Supabase.instance.client;
      return true;
    } catch (_) {
      return false;
    }
  }
}
