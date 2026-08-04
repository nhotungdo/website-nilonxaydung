import 'package:flutter/material.dart';
import '../models/inventory_item_model.dart';
import '../models/stock_in_receipt_model.dart';
import '../models/inventory_transaction_model.dart';
import '../services/inventory_api_service.dart';
import '../services/notification_service.dart';

class InventoryProvider extends ChangeNotifier {
  List<InventoryItemModel> _items = [];
  List<StockInReceiptModel> _receipts = [];
  List<InventoryTransactionModel> _transactions = [];
  bool _isLoading = false;
  String? _error;

  List<InventoryItemModel> get items => _items;
  List<StockInReceiptModel> get receipts => _receipts;
  List<InventoryTransactionModel> get transactions => _transactions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // KPI Metrics
  int get totalItemCount => _items.length;
  int get lowStockCount => _items.where((item) => item.isLowStock).length;
  double get totalInventoryValue => _items.fold(0, (sum, item) => sum + (item.currentStock * item.importPrice));
  int get totalStockInReceipts => _receipts.length;

  InventoryProvider() {
    loadAllData();
  }

  Future<void> loadAllData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        InventoryApiService.fetchInventoryItems(),
        InventoryApiService.fetchStockInReceipts(),
        InventoryApiService.fetchTransactions(),
      ]);

      _items = results[0] as List<InventoryItemModel>;
      _receipts = results[1] as List<StockInReceiptModel>;
      _transactions = results[2] as List<InventoryTransactionModel>;

      _checkLowStockNotifications();
    } catch (e) {
      _error = 'Không thể tải dữ liệu kho: $e';
      debugPrint('[InventoryProvider] loadAllData error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void _checkLowStockNotifications() {
    for (final item in _items) {
      if (item.isLowStock) {
        NotificationService.showLowStockNotification(item);
      }
    }
  }

  Future<bool> addInventoryItem(InventoryItemModel newItem) async {
    try {
      final created = await InventoryApiService.createInventoryItem(newItem);
      _items.add(created);
      if (created.isLowStock) {
        NotificationService.showLowStockNotification(created);
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Không thể thêm sản phẩm: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateInventoryItem(InventoryItemModel updatedItem) async {
    try {
      await InventoryApiService.updateInventoryItem(updatedItem);
      final index = _items.indexWhere((item) => item.id == updatedItem.id);
      if (index >= 0) {
        _items[index] = updatedItem;
        if (updatedItem.isLowStock) {
          NotificationService.showLowStockNotification(updatedItem);
        }
        notifyListeners();
      }
      return true;
    } catch (e) {
      _error = 'Không thể cập nhật sản phẩm: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteInventoryItem(String id) async {
    try {
      await InventoryApiService.deleteInventoryItem(id);
      _items.removeWhere((item) => item.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Không thể xóa sản phẩm: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> createStockInReceipt(StockInReceiptModel receipt) async {
    try {
      final currentProductIndex = _items.indexWhere((i) => i.id == receipt.productId);
      if (currentProductIndex == -1) {
        _error = 'Sản phẩm không tồn tại trong kho';
        notifyListeners();
        return false;
      }

      final currentProduct = _items[currentProductIndex];
      final newReceipt = await InventoryApiService.createStockInReceipt(
        receipt: receipt,
        currentProduct: currentProduct,
      );

      _receipts.insert(0, newReceipt);

      // Update product stock locally
      final updatedProduct = currentProduct.copyWith(
        currentStock: currentProduct.currentStock + receipt.quantity,
        lastUpdated: DateTime.now(),
      );
      _items[currentProductIndex] = updatedProduct;

      // Add local transaction
      _transactions.insert(
        0,
        InventoryTransactionModel(
          id: 'TX-${DateTime.now().millisecondsSinceEpoch}',
          type: 'STOCK_IN',
          productId: currentProduct.id,
          productName: currentProduct.name,
          quantityChange: receipt.quantity,
          balanceAfter: updatedProduct.currentStock,
          referenceCode: receipt.receiptCode,
          notes: receipt.notes ?? 'Nhập kho từ phiếu ${receipt.receiptCode}',
          createdAt: DateTime.now(),
          createdBy: receipt.createdBy,
        ),
      );

      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Không thể tạo phiếu nhập kho: $e';
      notifyListeners();
      return false;
    }
  }
}
