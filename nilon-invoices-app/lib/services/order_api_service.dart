import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/order_model.dart';
import 'firebase_service.dart';

/// Service to interact with orders on Cloud Firestore
class OrderApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _ordersCol => _db.collection('orders');

  // ─────────────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────────────
  static Future<List<OrderModel>> fetchOrders({
    int limit = 50,
    String? printStatus,
  }) async {
    try {
      Query query = _ordersCol;
      if (printStatus != null) {
        query = query.where('printStatus', isEqualTo: printStatus);
      }

      // Order by createdAt descending
      query = query.orderBy('createdAt', descending: true).limit(limit);

      final snap = await query.get();
      return snap.docs.map((doc) => OrderModel.fromFirestore(doc)).toList();
    } catch (e) {
      // If composite index is pending, fallback without orderBy
      try {
        final fallbackSnap = await _ordersCol.limit(limit).get();
        final list = fallbackSnap.docs.map((doc) => OrderModel.fromFirestore(doc)).toList();
        list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        return list;
      } catch (innerErr) {
        throw Exception('[OrderApiService] fetchOrders failed: $e ($innerErr)');
      }
    }
  }

  // ─────────────────────────────────────────────
  // FETCH SINGLE ORDER
  // ─────────────────────────────────────────────
  static Future<OrderModel?> fetchOrderById(String orderId) async {
    try {
      final doc = await _ordersCol.doc(orderId).get();
      if (!doc.exists) return null;
      return OrderModel.fromFirestore(doc);
    } catch (e) {
      throw Exception('[OrderApiService] fetchOrderById failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE ORDER STATUS
  // ─────────────────────────────────────────────
  static Future<void> updateOrderStatus({
    required String orderId,
    String? orderStatus,
    String? printStatus,
    String? printedBy,
  }) async {
    try {
      final Map<String, dynamic> updates = {
        'updatedAt': FieldValue.serverTimestamp(),
      };

      if (orderStatus != null) updates['orderStatus'] = orderStatus;
      if (printStatus != null) updates['printStatus'] = printStatus;
      if (printedBy != null) {
        updates['printedBy'] = printedBy;
        updates['printedAt'] = FieldValue.serverTimestamp();
      }

      await _ordersCol.doc(orderId).update(updates);
    } catch (e) {
      throw Exception('[OrderApiService] updateOrderStatus failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // MARK ORDER AS PRINTED
  // ─────────────────────────────────────────────
  static Future<void> markAsPrinted(String orderId, {String? printedBy}) async {
    await updateOrderStatus(
      orderId: orderId,
      printStatus: 'printed',
      orderStatus: 'paid',
      printedBy: printedBy ?? 'Admin',
    );
  }

  // ─────────────────────────────────────────────
  // DELETE ORDER
  // ─────────────────────────────────────────────
  static Future<void> deleteOrder(String orderId) async {
    try {
      await _ordersCol.doc(orderId).delete();
    } catch (e) {
      throw Exception('[OrderApiService] deleteOrder failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // REALTIME SUBSCRIPTION
  // ─────────────────────────────────────────────
  /// Returns a StreamSubscription for orders collection
  static StreamSubscription<QuerySnapshot> subscribeToOrders({
    required void Function(OrderModel order) onNewOrder,
    required void Function(String orderId, Map<String, dynamic> updatedFields) onOrderUpdated,
    required void Function(String error) onError,
  }) {
    return _ordersCol
        .orderBy('createdAt', descending: true)
        .limit(100)
        .snapshots()
        .listen(
      (snapshot) {
        for (final change in snapshot.docChanges) {
          try {
            if (change.type == DocumentChangeType.added) {
              final order = OrderModel.fromFirestore(change.doc);
              onNewOrder(order);
            } else if (change.type == DocumentChangeType.modified) {
              final data = change.doc.data() as Map<String, dynamic>? ?? {};
              onOrderUpdated(change.doc.id, data);
            }
          } catch (e) {
            onError('Process snapshot change error: $e');
          }
        }
      },
      onError: (err) {
        onError('Firestore Realtime error: $err');
      },
    );
  }
}
