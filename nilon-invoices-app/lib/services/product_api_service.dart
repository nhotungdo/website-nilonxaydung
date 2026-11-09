import 'package:cloud_firestore/cloud_firestore.dart';
import 'firebase_service.dart';

/// Service to interact with the products collection on Cloud Firestore.
class ProductApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _productsCol => _db.collection('products');

  // ─────────────────────────────────────────────
  // FETCH ALL ACTIVE PRODUCTS
  // ─────────────────────────────────────────────
  static Future<List<Map<String, dynamic>>> fetchProducts() async {
    try {
      final snap = await _productsCol.orderBy('name').get();
      return snap.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return {
          'id': doc.id,
          ...data,
        };
      }).toList();
    } catch (e) {
      try {
        final snap = await _productsCol.get();
        return snap.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return {
            'id': doc.id,
            ...data,
          };
        }).toList();
      } catch (inner) {
        throw Exception('[ProductApiService] fetchProducts failed: $e');
      }
    }
  }

  // ─────────────────────────────────────────────
  // CREATE PRODUCT
  // ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> createProduct(Map<String, dynamic> data) async {
    try {
      final docRef = await _productsCol.add({
        ...data,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
      return {
        'id': docRef.id,
        ...data,
      };
    } catch (e) {
      throw Exception('[ProductApiService] createProduct failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE PRODUCT
  // ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      await _productsCol.doc(id).set({
        ...data,
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
      return {
        'id': id,
        ...data,
      };
    } catch (e) {
      throw Exception('[ProductApiService] updateProduct failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRODUCT
  // ─────────────────────────────────────────────
  static Future<void> deleteProduct(String id) async {
    try {
      await _productsCol.doc(id).delete();
    } catch (e) {
      throw Exception('[ProductApiService] deleteProduct failed: $e');
    }
  }
}
