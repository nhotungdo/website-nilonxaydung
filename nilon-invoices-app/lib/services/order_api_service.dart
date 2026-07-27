import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_model.dart';
import 'supabase_service.dart';

/// Service to interact with orders & order_items tables on Supabase
class OrderApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ORDERS (with customer + items join)
  // ─────────────────────────────────────────────
  /// Fetch all orders joined with customer info and order items.
  /// Orders are sorted newest-first.
  static Future<List<OrderModel>> fetchOrders({
    int limit = 50,
    String? printStatus,
  }) async {
    try {
      List<Map<String, dynamic>> data;

      const String selectQuery = '''
            id,
            order_code,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            payment_status,
            order_status,
            print_status,
            note,
            created_at,
            updated_at,
            printed_at,
            printed_by,
            customers (
              id,
              full_name,
              phone,
              address
            ),
            order_items (
              id,
              product_id,
              product_name,
              price,
              quantity,
              total
            )
          ''';

      if (printStatus != null) {
        data = await _db
            .from('orders')
            .select(selectQuery)
            .eq('print_status', printStatus)
            .order('created_at', ascending: false)
            .limit(limit);
      } else {
        data = await _db
            .from('orders')
            .select(selectQuery)
            .order('created_at', ascending: false)
            .limit(limit);
      }

      return data.map((json) => OrderModel.fromSupabase(json)).toList();
    } catch (e) {
      throw Exception('[OrderApiService] fetchOrders failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // FETCH SINGLE ORDER
  // ─────────────────────────────────────────────
  static Future<OrderModel?> fetchOrderById(String orderId) async {
    try {
      final data = await _db
          .from('orders')
          .select('''
            id,
            order_code,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            payment_status,
            order_status,
            print_status,
            note,
            created_at,
            updated_at,
            customers (id, full_name, phone, address),
            order_items (id, product_id, product_name, price, quantity, total)
          ''')
          .eq('id', orderId)
          .maybeSingle();

      if (data == null) return null;
      return OrderModel.fromSupabase(data);
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
        'updated_at': DateTime.now().toIso8601String(),
      };

      if (orderStatus != null) updates['order_status'] = orderStatus;
      if (printStatus != null) updates['print_status'] = printStatus;
      if (printedBy != null) {
        updates['printed_by'] = printedBy;
        updates['printed_at'] = DateTime.now().toIso8601String();
      }

      await _db.from('orders').update(updates).eq('id', orderId);
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
      await _db.from('orders').delete().eq('id', orderId);
    } catch (e) {
      throw Exception('[OrderApiService] deleteOrder failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // REALTIME SUBSCRIPTION
  // ─────────────────────────────────────────────
  /// Subscribe to real-time INSERT events on orders table.
  /// Returns a RealtimeChannel that should be unsubscribed when done.
  static RealtimeChannel subscribeToNewOrders({
    required void Function(OrderModel order) onNewOrder,
    required void Function(String error) onError,
  }) {
    final channel = _db
        .channel('orders-realtime')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'orders',
          callback: (payload) async {
            try {
              // Fetch full order with items when new order arrives
              final orderId = payload.newRecord['id'] as String?;
              if (orderId == null) return;

              final order = await fetchOrderById(orderId);
              if (order != null) {
                onNewOrder(order);
              }
            } catch (e) {
              onError('Realtime fetch error: $e');
            }
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.update,
          schema: 'public',
          table: 'orders',
          callback: (payload) async {
            // Also listen for order updates (e.g., print_status changes)
            try {
              final orderId = payload.newRecord['id'] as String?;
              if (orderId == null) return;
              final order = await fetchOrderById(orderId);
              if (order != null) {
                onNewOrder(order); // Reuse same callback for updates
              }
            } catch (_) {}
          },
        )
        .subscribe();

    return channel;
  }
}
