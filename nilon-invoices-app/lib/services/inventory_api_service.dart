import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/inventory_item_model.dart';
import '../models/stock_in_receipt_model.dart';
import '../models/inventory_transaction_model.dart';
import 'firebase_service.dart';

class InventoryApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _itemsCol => _db.collection('inventory_items');
  static CollectionReference get _receiptsCol => _db.collection('stock_in_receipts');
  static CollectionReference get _transactionsCol => _db.collection('inventory_transactions');

  // ─────────────────────────────────────────────
  // FETCH ALL INVENTORY ITEMS
  // ─────────────────────────────────────────────
  static Future<List<InventoryItemModel>> fetchInventoryItems() async {
    try {
      final snap = await _itemsCol.orderBy('name').get();
      return snap.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return InventoryItemModel.fromJson({'id': doc.id, ...data});
      }).toList();
    } catch (e) {
      try {
        final snap = await _itemsCol.get();
        return snap.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return InventoryItemModel.fromJson({'id': doc.id, ...data});
        }).toList();
      } catch (inner) {
        debugPrint('[InventoryApiService] fetchInventoryItems error: $e ($inner)');
        rethrow;
      }
    }
  }

  // ─────────────────────────────────────────────
  // CREATE / ADD INVENTORY ITEM
  // ─────────────────────────────────────────────
  static Future<InventoryItemModel> createInventoryItem(InventoryItemModel item) async {
    try {
      final docId = item.id.isNotEmpty ? item.id : _itemsCol.doc().id;
      final data = item.toJson();
      data['id'] = docId;
      data['last_updated'] = FieldValue.serverTimestamp();
      await _itemsCol.doc(docId).set(data);
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
      final data = item.toJson();
      data['last_updated'] = FieldValue.serverTimestamp();
      await _itemsCol.doc(item.id).set(data, SetOptions(merge: true));
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
      await _itemsCol.doc(id).delete();
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
      final snap = await _receiptsCol.orderBy('created_at', descending: true).get();
      return snap.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return StockInReceiptModel.fromJson({'id': doc.id, ...data});
      }).toList();
    } catch (e) {
      try {
        final snap = await _receiptsCol.get();
        return snap.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return StockInReceiptModel.fromJson({'id': doc.id, ...data});
        }).toList();
      } catch (inner) {
        debugPrint('[InventoryApiService] fetchStockInReceipts error: $e');
        rethrow;
      }
    }
  }

  // ─────────────────────────────────────────────
  // CREATE STOCK IN RECEIPT
  // ─────────────────────────────────────────────
  static Future<StockInReceiptModel> createStockInReceipt({
    required StockInReceiptModel receipt,
    required InventoryItemModel currentProduct,
  }) async {
    try {
      // 1. Save receipt
      final receiptData = receipt.toJson();
      receiptData['created_at'] = FieldValue.serverTimestamp();
      await _receiptsCol.doc(receipt.id).set(receiptData);

      // 2. Update product stock
      final newStock = currentProduct.currentStock + receipt.quantity;
      await _itemsCol.doc(currentProduct.id).update({
        'current_stock': newStock,
        'last_updated': FieldValue.serverTimestamp(),
      });

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
      final txData = tx.toJson();
      txData['created_at'] = FieldValue.serverTimestamp();
      await _transactionsCol.doc(tx.id).set(txData);

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
      final snap = await _transactionsCol.orderBy('created_at', descending: true).get();
      return snap.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return InventoryTransactionModel.fromJson({'id': doc.id, ...data});
      }).toList();
    } catch (e) {
      try {
        final snap = await _transactionsCol.get();
        return snap.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return InventoryTransactionModel.fromJson({'id': doc.id, ...data});
        }).toList();
      } catch (inner) {
        debugPrint('[InventoryApiService] fetchTransactions error: $e');
        rethrow;
      }
    }
  }
}
