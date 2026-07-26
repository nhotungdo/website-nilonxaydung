import 'dart:math';
import 'package:flutter/material.dart';
import '../models/order_model.dart';
import '../services/mock_data_service.dart';

class OrderProvider extends ChangeNotifier {
  List<OrderModel> _orders = [];
  bool _isLoading = false;

  List<OrderModel> get orders => _orders;
  bool get isLoading => _isLoading;

  OrderProvider() {
    _orders = MockDataService.getInitialOrders();
  }

  void fetchOrders() {
    notifyListeners();
  }

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

    await Future.delayed(const Duration(milliseconds: 500));

    final newOrder = OrderModel(
      id: 'ord-${Random().nextInt(899999) + 100000}',
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

    _orders.insert(0, newOrder);
    _isLoading = false;
    notifyListeners();
    return true;
  }

  void deleteOrder(String id) {
    _orders.removeWhere((o) => o.id == id);
    notifyListeners();
  }

  void markOrderAsPrinted(String id) {
    final index = _orders.indexWhere((o) => o.id == id || o.orderCode == id);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(
        printStatus: 'printed',
        orderStatus: 'paid',
      );
      notifyListeners();
    }
  }

  String generateOrderCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rnd = Random();
    final code = String.fromCharCodes(Iterable.generate(6, (_) => chars.codeUnitAt(rnd.nextInt(chars.length))));
    return 'NL-$code';
  }
}
