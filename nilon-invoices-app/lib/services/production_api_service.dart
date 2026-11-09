import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/production_log_model.dart';
import '../models/inventory_item_model.dart';
import '../models/inventory_transaction_model.dart';
import 'firebase_service.dart';

class ProductionApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _logsCol => _db.collection('daily_production_logs');
  static CollectionReference get _itemsCol => _db.collection('inventory_items');
  static CollectionReference get _txCol => _db.collection('inventory_transactions');

  // ─────────────────────────────────────────────
  // FETCH PRODUCTION LOGS
  // ─────────────────────────────────────────────
  static Future<List<DailyProductionLogModel>> fetchProductionLogs() async {
    try {
      final snap = await _logsCol.orderBy('created_at', descending: true).get();
      return snap.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return DailyProductionLogModel.fromJson({'id': doc.id, ...data});
      }).toList();
    } catch (e) {
      try {
        final snap = await _logsCol.get();
        return snap.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return DailyProductionLogModel.fromJson({'id': doc.id, ...data});
        }).toList();
      } catch (inner) {
        debugPrint('[ProductionApiService] fetchProductionLogs error: $e');
        rethrow;
      }
    }
  }

  // ─────────────────────────────────────────────
  // CREATE PRODUCTION LOG
  // ─────────────────────────────────────────────
  static Future<DailyProductionLogModel> createProductionLog({
    required DailyProductionLogModel log,
    required InventoryItemModel? targetProduct,
  }) async {
    try {
      // 1. Insert production log
      final logData = log.toJson();
      logData['created_at'] = FieldValue.serverTimestamp();
      await _logsCol.doc(log.id).set(logData);

      // 2. If autoAddedToStock & product exists -> update stock & add transaction log
      if (log.autoAddedToStock && targetProduct != null) {
        final newStock = targetProduct.currentStock + log.producedQuantity;
        await _itemsCol.doc(targetProduct.id).update({
          'current_stock': newStock,
          'last_updated': FieldValue.serverTimestamp(),
        });

        final tx = InventoryTransactionModel(
          id: 'TX-${DateTime.now().millisecondsSinceEpoch}',
          type: 'PRODUCTION_ADD',
          productId: targetProduct.id,
          productName: targetProduct.name,
          quantityChange: log.producedQuantity,
          balanceAfter: newStock,
          referenceCode: log.id,
          notes: 'Tự động nhập kho từ Nhật ký sản xuất (${log.shift} - ${log.machineId})',
          createdAt: DateTime.now(),
          createdBy: log.operatorName,
        );
        final txData = tx.toJson();
        txData['created_at'] = FieldValue.serverTimestamp();
        await _txCol.doc(tx.id).set(txData);
      }

      return log;
    } catch (e) {
      debugPrint('[ProductionApiService] createProductionLog error: $e');
      rethrow;
    }
  }
}
