import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_model.dart';
import '../services/order_api_service.dart';
import '../services/notification_service.dart';

class OrderProvider extends ChangeNotifier {
  List<OrderModel> _orders = [];
  bool _isLoading = false;
  String? _error;
  RealtimeChannel? _realtimeChannel;

  List<OrderModel> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  OrderProvider() {
    _initialize();
  }

  // ─────────────────────────────────────────────
  // INITIALIZE — Load from Supabase + Subscribe Realtime
  // ─────────────────────────────────────────────
  Future<void> _initialize() async {
    await fetchOrders();
    _subscribeRealtime();
  }

  // ─────────────────────────────────────────────
  // FETCH ORDERS FROM SUPABASE
  // ─────────────────────────────────────────────
  Future<void> fetchOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await OrderApiService.fetchOrders(limit: 100);
    } catch (e) {
      _error = 'Không thể tải danh sách đơn hàng: $e';
      debugPrint('[OrderProvider] fetchOrders error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // REALTIME SUBSCRIPTION — Listen for new/updated orders
  // ─────────────────────────────────────────────
  void _subscribeRealtime() {
    _realtimeChannel = OrderApiService.subscribeToNewOrders(
      onNewOrder: (order) {
        // Check if this order already exists in the list (update) or is new (insert)
        final existingIndex = _orders.indexWhere((o) => o.id == order.id);
        if (existingIndex >= 0) {
          // UPDATE: cập nhật đơn cũ — không thông báo
          _orders[existingIndex] = order;
        } else {
          // INSERT: đơn hàng mới — thêm vào đầu danh sách và thông báo
          _orders.insert(0, order);
          NotificationService.showNewOrderNotification(order);
          debugPrint('[OrderProvider] New order received — notification sent: ${order.orderCode}');
        }
        notifyListeners();
      },
      onError: (error) {
        debugPrint('[OrderProvider] Realtime error: $error');
      },
    );
  }

  // ─────────────────────────────────────────────
  // CREATE ORDER (via REST API / nilon-website handles this)
  // ─────────────────────────────────────────────
  Future<bool> createOrder({
    required String orderCode,
    required String customerName,
    required String customerPhone,
    required String customerAddress,
    required double totalAmount,
    required String note,
    required String paymentMethod,
    required List<OrderItemModel> items,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Optimistically add to local list while waiting for Realtime confirmation
      final tempOrder = OrderModel(
        id: 'temp-${DateTime.now().millisecondsSinceEpoch}',
        orderCode: orderCode,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        totalAmount: totalAmount,
        note: note,
        paymentMethod: paymentMethod,
        printStatus: 'waiting',
        orderStatus: 'pending',
        createdAt: DateTime.now(),
        items: items,
      );

      _orders.insert(0, tempOrder);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Không thể tạo đơn hàng: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // DELETE ORDER
  // ─────────────────────────────────────────────
  Future<void> deleteOrder(String id) async {
    final prevOrders = List<OrderModel>.from(_orders);
    _orders.removeWhere((o) => o.id == id);
    notifyListeners();

    try {
      await OrderApiService.deleteOrder(id);
    } catch (e) {
      // Revert on failure
      _orders = prevOrders;
      _error = 'Không thể xóa đơn hàng: $e';
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // MARK ORDER AS PRINTED
  // ─────────────────────────────────────────────
  Future<void> markOrderAsPrinted(String id, {String? printedBy}) async {
    final index = _orders.indexWhere((o) => o.id == id || o.orderCode == id);
    if (index == -1) return;

    // Optimistic update
    _orders[index] = _orders[index].copyWith(
      printStatus: 'printed',
      orderStatus: 'paid',
    );
    notifyListeners();

    try {
      await OrderApiService.markAsPrinted(_orders[index].id, printedBy: printedBy);
    } catch (e) {
      debugPrint('[OrderProvider] markAsPrinted error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // GENERATE ORDER CODE
  // ─────────────────────────────────────────────
  String generateOrderCode() {
    final rnd = DateTime.now().millisecondsSinceEpoch;
    final code = rnd.toString().substring(rnd.toString().length - 6);
    return 'NL-$code';
  }

  // ─────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────
  @override
  void dispose() {
    _realtimeChannel?.unsubscribe();
    super.dispose();
  }
}
