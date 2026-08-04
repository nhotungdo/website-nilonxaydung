import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/inventory_item_model.dart';
import '../models/stock_in_receipt_model.dart';
import '../models/inventory_transaction_model.dart';
import 'supabase_service.dart';

class InventoryApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ALL INVENTORY ITEMS (From Supabase Only)
  // ─────────────────────────────────────────────
  static Future<List<InventoryItemModel>> fetchInventoryItems() async {
    try {
      final res = await _db.from('inventory_items').select('*').order('name', ascending: true);
      return (res as List).map((json) => InventoryItemModel.fromJson(json)).toList();
    } catch (e) {
      debugPrint('[InventoryApiService] fetchInventoryItems error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // CREATE / ADD INVENTORY ITEM
  // ─────────────────────────────────────────────
  static Future<InventoryItemModel> createInventoryItem(InventoryItemModel item) async {
    try {
      await _db.from('inventory_items').insert(item.toJson());
      return item;
    } catch (e) {
      debugPrint('[InventoryApiService] createInventoryItem error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE INVENTORY ITEM
  // ─────────────────────────────────────────────
  static Future<void> updateInventoryItem(InventoryItemModel item) async {
    try {
      await _db.from('inventory_items').update(item.toJson()).eq('id', item.id);
    } catch (e) {
      debugPrint('[InventoryApiService] updateInventoryItem error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // DELETE INVENTORY ITEM
  // ─────────────────────────────────────────────
  static Future<void> deleteInventoryItem(String id) async {
    try {
      await _db.from('inventory_items').delete().eq('id', id);
    } catch (e) {
      debugPrint('[InventoryApiService] deleteInventoryItem error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // FETCH STOCK IN RECEIPTS
  // ─────────────────────────────────────────────
  static Future<List<StockInReceiptModel>> fetchStockInReceipts() async {
    try {
      final res = await _db.from('stock_in_receipts').select('*').order('created_at', ascending: false);
      return (res as List).map((json) => StockInReceiptModel.fromJson(json)).toList();
    } catch (e) {
      debugPrint('[InventoryApiService] fetchStockInReceipts error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // CREATE STOCK IN RECEIPT (Increases stock & logs transaction)
  // ─────────────────────────────────────────────
  static Future<StockInReceiptModel> createStockInReceipt({
    required StockInReceiptModel receipt,
    required InventoryItemModel currentProduct,
  }) async {
    try {
      // 1. Save receipt
      await _db.from('stock_in_receipts').insert(receipt.toJson());

      // 2. Update product stock
      final newStock = currentProduct.currentStock + receipt.quantity;
      await _db.from('inventory_items').update({
        'current_stock': newStock,
        'last_updated': DateTime.now().toIso8601String(),
      }).eq('id', currentProduct.id);

      // 3. Log transaction
      final tx = InventoryTransactionModel(
        id: 'TX-${DateTime.now().millisecondsSinceEpoch}',
        type: 'STOCK_IN',
        productId: currentProduct.id,
        productName: currentProduct.name,
        quantityChange: receipt.quantity,
        balanceAfter: newStock,
        referenceCode: receipt.receiptCode,
        notes: receipt.notes ?? 'Nhập kho từ phiếu ${receipt.receiptCode}',
        createdAt: DateTime.now(),
        createdBy: receipt.createdBy,
      );
      await _db.from('inventory_transactions').insert(tx.toJson());

      return receipt;
    } catch (e) {
      debugPrint('[InventoryApiService] createStockInReceipt error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // FETCH INVENTORY TRANSACTIONS
  // ─────────────────────────────────────────────
  static Future<List<InventoryTransactionModel>> fetchTransactions() async {
    try {
      final res = await _db.from('inventory_transactions').select('*').order('created_at', ascending: false);
      return (res as List).map((json) => InventoryTransactionModel.fromJson(json)).toList();
    } catch (e) {
      debugPrint('[InventoryApiService] fetchTransactions error: $e');
      rethrow;
    }
  }
}
