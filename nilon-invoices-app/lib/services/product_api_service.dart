import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_service.dart';

/// Service to interact with the products table on Supabase.
class ProductApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ALL ACTIVE PRODUCTS
  // ─────────────────────────────────────────────
  /// Trả về danh sách sản phẩm dạng Map để dùng trong dropdown tạo đơn.
  /// Mỗi item có: id, name, price, unit
  static Future<List<Map<String, dynamic>>> fetchProducts() async {
    try {
      final data = await _db
          .from('products')
          .select('id, name, price, unit')
          .eq('is_active', true)
          .order('name', ascending: true);

      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      throw Exception('[ProductApiService] fetchProducts failed: $e');
    }
  }
}
