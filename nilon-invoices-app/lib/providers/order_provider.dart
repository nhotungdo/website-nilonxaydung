import 'dart:async';
import 'package:flutter/material.dart';
import '../models/order_model.dart';
import '../models/system_notification_model.dart';
import '../services/order_api_service.dart';
import '../services/notification_service.dart';
import '../providers/system_notification_provider.dart';

class OrderProvider extends ChangeNotifier {
  List<OrderModel> _orders = [];
  bool _isLoading = false;
  String? _error;
  StreamSubscription? _orderSubscription;
  OrderModel? _previewOrder;

  List<OrderModel> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;
  OrderModel? get previewOrder => _previewOrder;

  void setPreviewOrder(OrderModel? order) {
    _previewOrder = order;
    notifyListeners();
  }

  OrderProvider() {
    _initialize();
  }

  // ─────────────────────────────────────────────
  // INITIALIZE — Load from Firestore + Subscribe Realtime
  // ─────────────────────────────────────────────
  Future<void> _initialize() async {
    await fetchOrders();
    _subscribeRealtime();
  }

  // ─────────────────────────────────────────────
  // FETCH ORDERS FROM FIRESTORE
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
    _orderSubscription?.cancel();
    _orderSubscription = OrderApiService.subscribeToOrders(
      onNewOrder: (order) {
        final existingIndex = _orders.indexWhere((o) => o.id == order.id);
        if (existingIndex < 0) {
          _orders.insert(0, order);
          NotificationService.showNewOrderNotification(order);

          // Dispatch in-app notification history
          SystemNotificationProvider.dispatch(SystemNotificationModel(
            title: 'Đơn hàng mới',
            message: 'Đơn hàng ${order.orderCode} từ ${order.customerName} đã được tạo.',
            type: 'info',
            payloadRoute: '/orders',
          ));

          debugPrint('[OrderProvider] New order received via Firestore Realtime: ${order.orderCode}');
          notifyListeners();
        }
      },
      onOrderUpdated: (orderId, updatedFields) {
        final existingIndex = _orders.indexWhere((o) => o.id == orderId);
        if (existingIndex >= 0) {
          final oldOrder = _orders[existingIndex];
          _orders[existingIndex] = oldOrder.copyWith(
            printStatus: (updatedFields['printStatus'] ?? updatedFields['print_status']) as String?,
            orderStatus: (updatedFields['orderStatus'] ?? updatedFields['order_status']) as String?,
          );
          notifyListeners();
        }
      },
      onError: (error) {
        debugPrint('[OrderProvider] Realtime error: $error');
      },
    );
  }

  // ─────────────────────────────────────────────
  // CREATE ORDER
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

  String generateOrderCode() {
    final rnd = DateTime.now().millisecondsSinceEpoch;
    final code = rnd.toString().substring(rnd.toString().length - 6);
    return 'NL-$code';
  }

  @override
  void dispose() {
    _orderSubscription?.cancel();
    super.dispose();
  }
}
