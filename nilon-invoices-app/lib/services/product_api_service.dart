import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_service.dart';

/// Service to interact with the products table on Supabase.
class ProductApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ALL ACTIVE PRODUCTS
  // ─────────────────────────────────────────────
  /// Trả về danh sách sản phẩm
  static Future<List<Map<String, dynamic>>> fetchProducts() async {
    try {
      final data = await _db
          .from('products')
          .select('*')
          .order('name', ascending: true);

      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      throw Exception('[ProductApiService] fetchProducts failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // CREATE PRODUCT
  // ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> createProduct(Map<String, dynamic> data) async {
    try {
      final response = await _db.from('products').insert(data).select().single();
      return response;
    } catch (e) {
      throw Exception('[ProductApiService] createProduct failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE PRODUCT
  // ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      final response = await _db.from('products').update(data).eq('id', id).select().single();
      return response;
    } catch (e) {
      throw Exception('[ProductApiService] updateProduct failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRODUCT
  // ─────────────────────────────────────────────
  static Future<void> deleteProduct(String id) async {
    try {
      await _db.from('products').delete().eq('id', id);
    } catch (e) {
      throw Exception('[ProductApiService] deleteProduct failed: $e');
    }
  }
}
